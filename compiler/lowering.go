package compiler

import (
	"cmp"
	"context"
	"encoding/base64"
	"encoding/hex"
	"go/ast"
	"go/constant"
	"go/token"
	"go/types"
	"maps"
	"math"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"runtime"
	"slices"
	"sort"
	"strconv"
	"strings"
	"sync"
	"unicode"
	"unicode/utf8"

	"github.com/pkg/errors"
	"golang.org/x/sync/errgroup"
	"golang.org/x/tools/go/ast/astutil"
	"golang.org/x/tools/go/packages"
)

// LoweringOwner owns conversion from the semantic model to compiler IR.
type LoweringOwner struct {
	runtimeOwner  *RuntimeContractOwner
	overrideOwner *OverrideRegistryOwner
}

// LoweringOptions are request-scoped lowering switches.
type LoweringOptions struct {
	// SourceRoot is the request source root that may contain sibling protobuf TypeScript files.
	SourceRoot string
	// DisplayRoot is the request root used to format source file names in diagnostics.
	DisplayRoot string
	// OutputPath is the TypeScript output root used for generated relative imports.
	OutputPath string
	// ProtobufTypeScriptBinding binds .pb.go files to sibling .pb.ts files.
	ProtobufTypeScriptBinding bool
	// AdditionalBindingRoots extends the roots searched for protobuf TypeScript bindings.
	AdditionalBindingRoots []string
	// TrimTypeInfo drops metadata used only by reflect from named type registration payloads.
	TrimTypeInfo bool
	// SkipPackages names packages whose output is already available and must not be lowered.
	SkipPackages map[string]bool
	// ExternalEmbeds selects the embedded files written as separate files.
	ExternalEmbeds *ExternalEmbedPolicy
}

// NewLoweringOwner creates the lowering owner.
func NewLoweringOwner(runtimeOwner *RuntimeContractOwner, overrideOwner *OverrideRegistryOwner) *LoweringOwner {
	if runtimeOwner == nil {
		runtimeOwner = NewRuntimeContractOwner()
	}
	if overrideOwner == nil {
		overrideOwner = NewOverrideRegistryOwner()
	}
	return &LoweringOwner{
		runtimeOwner:  runtimeOwner,
		overrideOwner: overrideOwner,
	}
}

// Build converts the semantic model into the compiler IR.
func (o *LoweringOwner) Build(ctx context.Context, model *SemanticModel, opts ...LoweringOptions) (*LoweredProgram, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if model == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/lowering:no-model",
			Message:  "lowering requires a semantic model",
		}}
	}

	var options LoweringOptions
	if len(opts) != 0 {
		options = opts[0]
	}

	program := &LoweredProgram{trimTypeInfo: options.TrimTypeInfo}
	defer setRuntimePackageNames(model)()
	defer setLocalTypeNames(model)()
	asyncLazyCache := newAsyncLazyCache()
	runtimeMethodSets := newRuntimeMethodSetCache()
	semPkgs := make([]*semanticPackage, 0, len(model.packages))
	for _, semPkg := range model.packages {
		if !options.SkipPackages[semPkg.pkgPath] {
			semPkgs = append(semPkgs, semPkg)
		}
	}
	slices.SortFunc(semPkgs, func(a, b *semanticPackage) int {
		return cmp.Compare(a.pkgPath, b.pkgPath)
	})

	// Lowering reads the semantic model without changing it and writes only
	// into the per-package result below, so packages lower independently. Each
	// worker keeps its own call-graph traversal state and shares only the
	// caches above, which are guarded and hold entry-independent answers.
	// Results are collected by index and assembled in sorted package order
	// afterwards, so diagnostics and emitted packages stay deterministic.
	type packageResult struct {
		pkg         *loweredPackage
		diagnostics []Diagnostic
	}
	results := make([]packageResult, len(semPkgs))
	group := errgroup.Group{}
	group.SetLimit(runtime.GOMAXPROCS(0))
	for idx, semPkg := range semPkgs {
		if semPkg.source == nil {
			results[idx].diagnostics = []Diagnostic{
				loweringUnsupported("package", semPkg.pkgPath, "missing semantic source package"),
			}
			continue
		}
		group.Go(func() error {
			loweredPkg, pkgDiagnostics := o.lowerPackage(
				model,
				semPkg,
				newAsyncLazyState(asyncLazyCache),
				runtimeMethodSets,
				options,
			)
			results[idx] = packageResult{pkg: loweredPkg, diagnostics: pkgDiagnostics}
			return nil
		})
	}
	if err := group.Wait(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/lowering:failed",
			Message:  err.Error(),
		}}
	}

	var diagnostics []Diagnostic
	for _, result := range results {
		diagnostics = append(diagnostics, result.diagnostics...)
		if result.pkg != nil {
			program.packages = append(program.packages, result.pkg)
		}
	}
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}
	return program, nil
}

func (o *LoweringOwner) lowerPackage(
	model *SemanticModel,
	semPkg *semanticPackage,
	asyncLazy *asyncLazyState,
	runtimeMethodSets *runtimeMethodSetCache,
	options LoweringOptions,
) (*loweredPackage, []Diagnostic) {
	loweredPkg := &loweredPackage{
		pkgPath:     semPkg.pkgPath,
		name:        semPkg.name,
		moduleIndex: model.liveCode != nil,
	}
	declFiles := packageDeclFiles(semPkg)
	outputNames := packageOutputNames(semPkg)
	protobufBindings, bindingDiagnostics := protobufTypeScriptBindings(semPkg, options)
	for sourcePath, binding := range protobufBindings {
		outputNames[sourcePath] = binding.outputName
	}
	methodIndex := buildPackageMethodIndex(semPkg)
	diagnostics := slices.Clone(bindingDiagnostics)
	for idx, file := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, file)
		if options.ProtobufTypeScriptBinding && protobufSRPCHasGoScriptReplacement(sourcePath) {
			stub, stubDiagnostics := lowerProtobufSRPCTypeScriptBindingStub(semPkg, sourcePath, options)
			diagnostics = append(diagnostics, stubDiagnostics...)
			if stub != nil {
				loweredPkg.files = append(loweredPkg.files, stub)
			}
			continue
		}
		if binding, ok := protobufBindings[sourcePath]; ok {
			protobufAdapter := !strings.HasSuffix(filepath.Base(binding.sourcePath), "_srpc.pb.go")
			loweredFile, fileDiagnostics := o.lowerFile(lowerFileRequest{
				model:                     model,
				semPkg:                    semPkg,
				file:                      file,
				sourcePath:                sourcePath,
				declFiles:                 declFiles,
				outputNames:               outputNames,
				methodIndex:               methodIndex,
				lazyPackageVars:           semPkg.lazyVars,
				asyncLazy:                 asyncLazy,
				runtimeMethodSets:         runtimeMethodSets,
				protobufTypeScriptAdapter: protobufAdapter,
				trimTypeInfo:              options.TrimTypeInfo,
				displayRoot:               options.DisplayRoot,
				externalEmbeds:            options.ExternalEmbeds,
			})
			diagnostics = append(diagnostics, fileDiagnostics...)
			diagnostics = append(diagnostics, rewriteProtobufTypeScriptBindingFile(loweredFile, binding, semPkg.name)...)
			if loweredFile != nil {
				loweredPkg.files = append(loweredPkg.files, loweredFile)
			}
			continue
		}
		loweredFile, fileDiagnostics := o.lowerFile(lowerFileRequest{
			model:             model,
			semPkg:            semPkg,
			file:              file,
			sourcePath:        sourcePath,
			declFiles:         declFiles,
			outputNames:       outputNames,
			methodIndex:       methodIndex,
			lazyPackageVars:   semPkg.lazyVars,
			asyncLazy:         asyncLazy,
			runtimeMethodSets: runtimeMethodSets,
			trimTypeInfo:      options.TrimTypeInfo,
			displayRoot:       options.DisplayRoot,
			externalEmbeds:    options.ExternalEmbeds,
		})
		diagnostics = append(diagnostics, fileDiagnostics...)
		if loweredFile != nil {
			loweredPkg.files = append(loweredPkg.files, loweredFile)
		}
	}
	importPackageDependencies(semPkg, loweredPkg.files)

	slices.SortFunc(loweredPkg.files, func(a, b *loweredFile) int {
		return cmp.Compare(a.outputName, b.outputName)
	})
	importMainFileSideEffects(loweredPkg)
	lowerPackageInit(semPkg, loweredPkg)
	return loweredPkg, diagnostics
}

// importMainFileSideEffects makes the file with the main function of package
// main import each other file of the package that the package index imports
// for its side effects, such as package variables initialized when its module
// is evaluated. Runners import the file with the main function directly, not
// the package index, so without these imports a file that the main file does
// not otherwise import would never be evaluated: var _ = register() in it
// would not run.
func importMainFileSideEffects(pkg *loweredPackage) {
	if pkg.name != "main" || len(pkg.files) < 2 {
		return
	}

	// Each file with a main function imports the other side effect files
	// that it does not already import.
	for _, file := range pkg.files {
		if !slices.ContainsFunc(file.decls, isMainFunctionDecl) {
			continue
		}
		for _, other := range pkg.files {
			source := "./" + other.outputName
			imported := slices.ContainsFunc(file.imports, func(imp loweredImport) bool {
				return imp.source == source
			})
			if other == file || !other.sideEffect || imported {
				continue
			}
			file.imports = append(file.imports, loweredImport{source: source, bare: true})
		}
	}
}

// packageInitModule is the output name of the module that initializes a
// package with more than one file (see [lowerPackageInit]).
const packageInitModule = "__goscript_package_init.gs.ts"

// lowerPackageInit arranges the initialization of the lazily initialized
// package variables and the init function calls of the package. Go
// initializes the package variables of all files in dependency order before
// calling the init functions in file order. A package with a single file runs
// them at the end of its module. The files of a package with more than one
// file can import each other in a cycle, so a file module can be evaluated
// before another file's declarations, such as a struct class used by an init
// function. Therefore a package init module, imported by the package index and
// by the file with the main function, runs them once all of the files have
// been evaluated.
func lowerPackageInit(semPkg *semanticPackage, pkg *loweredPackage) {
	// fileCall is a call and the file that declares its function.
	type fileCall struct {
		file *loweredFile
		call packageInitCall
	}

	// Order the variable initializers by InitOrder, where variables without
	// initializers do not appear and so come first, then the init functions.
	order := make(map[types.Object]int)
	if semPkg.source != nil && semPkg.source.TypesInfo != nil {
		for idx, initializer := range semPkg.source.TypesInfo.InitOrder {
			for _, lhs := range initializer.Lhs {
				order[lhs] = idx + 1
			}
		}
	}
	var varInits, initFuncs []fileCall
	for _, file := range pkg.files {
		for _, call := range file.varInits {
			varInits = append(varInits, fileCall{file: file, call: call})
		}
		for _, call := range file.initFuncs {
			initFuncs = append(initFuncs, fileCall{file: file, call: call})
		}
	}
	slices.SortStableFunc(varInits, func(a, b fileCall) int {
		return cmp.Compare(order[a.call.obj], order[b.call.obj])
	})
	calls := slices.Concat(varInits, initFuncs)
	if len(calls) == 0 {
		return
	}

	// A single file runs the calls at the end of its module.
	if len(pkg.files) == 1 {
		file := pkg.files[0]
		for _, c := range calls {
			file.decls = append(file.decls, loweredDecl{code: c.call.code("")})
		}
		return
	}

	// The package init module imports each file that declares a call, and
	// runs the calls once.
	initModule := &loweredFile{outputName: packageInitModule, imports: packageDependencyImports(pkg.files)}
	aliases := make(map[*loweredFile]string)
	body := []string{"if (initialized) {\n\t\treturn\n\t}", "initialized = true"}
	for _, c := range calls {
		alias, ok := aliases[c.file]
		if !ok {
			alias = "__goscript_file" + strconv.Itoa(len(aliases))
			aliases[c.file] = alias
			initModule.imports = append(initModule.imports, loweredImport{
				alias:  alias,
				source: "./" + c.file.outputName,
			})
		}
		if c.call.obj == nil {
			c.file.decls = append(c.file.decls, loweredDecl{code: "export { " + c.call.name + " }"})
		}
		body = append(body, c.call.code(alias))
	}
	initModule.decls = []loweredDecl{
		{code: "let initialized = false"},
		{code: "export async function __goscript_package_init(): globalThis.Promise<void> {\n\t" +
			strings.Join(body, "\n\t") + "\n}"},
	}

	// Runners import the file with the main function directly, so it awaits
	// the package init module as well.
	if pkg.name == "main" {
		for _, file := range pkg.files {
			if slices.ContainsFunc(file.decls, isMainFunctionDecl) {
				file.imports = append(file.imports, loweredImport{
					alias:  "__goscript_package_init",
					source: "./" + packageInitModule,
				})
				file.decls = append(file.decls, loweredDecl{
					code: "await __goscript_package_init.__goscript_package_init()",
				})
			}
		}
	}
	pkg.files = append(pkg.files, initModule)
	pkg.initModule = true
}

// isMainFunctionDecl reports whether decl declares the main function.
func isMainFunctionDecl(decl loweredDecl) bool {
	return decl.function != nil && decl.function.name == "main"
}

// importPackageDependencies makes each file of a package that initializes
// package variables import every package that a file of the package imports.
// Go initializes the imported packages before any variable of the package.
// A module with top-level await is evaluated asynchronously, and a module that
// does not import it may be evaluated while it waits, so a file that did not
// import such a package could run its initializers in the middle of the
// package's initialization. A module waits for all of its imports.
func importPackageDependencies(semPkg *semanticPackage, files []*loweredFile) {
	// Only packages of more than one file have imports that a file may lack.
	if len(files) < 2 {
		return
	}
	deps := packageDependencyImports(files)
	initializing := filesWithVarInitializers(semPkg)

	// Each file with initializers imports the packages that it lacks.
	for _, file := range files {
		if !initializing[file.sourcePath] {
			continue
		}
		for _, dep := range deps {
			imported := slices.ContainsFunc(file.imports, func(imp loweredImport) bool {
				return imp.source == dep.source
			})
			if !imported {
				file.imports = append(file.imports, dep)
			}
		}
	}
}

// packageDependencyImports returns a bare import of each package that a file
// of files imports at runtime, in the order of their first imports. Packages
// imported only for types, such as deferred packages, are left out.
func packageDependencyImports(files []*loweredFile) []loweredImport {
	// A package import is bare, or binds a namespace and is kept for its
	// side effects.
	var deps []loweredImport
	seen := make(map[string]bool)
	for _, file := range files {
		for _, imp := range file.imports {
			runtimeImport := imp.bare || (imp.sideEffect && !imp.typeOnly)
			if !runtimeImport || !strings.HasPrefix(imp.source, "@goscript/") || seen[imp.source] {
				continue
			}
			seen[imp.source] = true
			deps = append(deps, loweredImport{source: imp.source, bare: true})
		}
	}
	return deps
}

// filesWithVarInitializers returns the source paths of the files of semPkg
// that declare a package variable initialized by an expression that is not
// constant, which runs when the package is initialized.
func filesWithVarInitializers(semPkg *semanticPackage) map[string]bool {
	// Each value of a var declaration is checked for a constant value.
	files := make(map[string]bool)
	for idx, file := range semPkg.source.Syntax {
		for _, decl := range file.Decls {
			genDecl, ok := decl.(*ast.GenDecl)
			if !ok || genDecl.Tok != token.VAR {
				continue
			}
			for _, spec := range genDecl.Specs {
				valueSpec, _ := spec.(*ast.ValueSpec)
				if valueSpec != nil && slices.ContainsFunc(valueSpec.Values, func(value ast.Expr) bool {
					return semPkg.source.TypesInfo.Types[value].Value == nil
				}) {
					files[sourceFilePath(semPkg, idx, file)] = true
				}
			}
		}
	}
	return files
}

func sourceFilePath(semPkg *semanticPackage, idx int, file *ast.File) string {
	if idx < len(semPkg.source.CompiledGoFiles) {
		return semPkg.source.CompiledGoFiles[idx]
	}
	pos := sourcePos(semPkg.source, file.Package)
	return pos.file
}

func sourceOutputName(sourcePath string) string {
	return strings.TrimSuffix(filepath.Base(sourcePath), ".go") + ".gs.ts"
}

// lowerFileImport is a resolved import shared by lowering passes.
type lowerFileImport struct {
	pkgName *types.PkgName
	name    string
}

// lowerFileRequest carries the package state and per-file options for lowering one source file.
type lowerFileRequest struct {
	model                     *SemanticModel
	semPkg                    *semanticPackage
	file                      *ast.File
	sourcePath                string
	declFiles                 map[types.Object]string
	outputNames               map[string]string
	methodIndex               packageMethodIndex
	lazyPackageVars           map[types.Object]bool
	asyncLazy                 *asyncLazyState
	runtimeMethodSets         *runtimeMethodSetCache
	protobufTypeScriptAdapter bool
	trimTypeInfo              bool
	displayRoot               string
	externalEmbeds            *ExternalEmbedPolicy
}

func (o *LoweringOwner) lowerFile(req lowerFileRequest) (*loweredFile, []Diagnostic) {
	model := req.model
	semPkg := req.semPkg
	file := req.file
	sourcePath := req.sourcePath
	declFiles := req.declFiles
	outputNames := req.outputNames
	methodIndex := req.methodIndex
	lazyPackageVars := req.lazyPackageVars
	asyncLazy := req.asyncLazy
	runtimeMethodSets := req.runtimeMethodSets
	protobufTypeScriptAdapter := req.protobufTypeScriptAdapter
	trimTypeInfo := req.trimTypeInfo
	displayRoot := req.displayRoot
	var diagnostics []Diagnostic
	associatedMethods := o.methodDeclsForFileTypes(semPkg, file, methodIndex)
	relevantImportFiles := map[string]bool{sourcePath: true}
	for _, methodDecl := range associatedMethods {
		methodPath := sourcePos(semPkg.source, methodDecl.Pos()).file
		if methodPath != "" {
			relevantImportFiles[methodPath] = true
		}
	}
	loweredFile := &loweredFile{
		sourcePath: sourcePath,
		outputName: sourceOutputName(sourcePath),
		imports: []loweredImport{{
			alias:  o.runtimeOwner.BuiltinImport().Alias,
			source: o.runtimeOwner.BuiltinImport().Source,
		}},
	}
	if req.externalEmbeds.enabled() {
		loweredFile.assets = make(map[string][]byte)
	}
	loweredFile.typePackagePath, loweredFile.typePackageNames = fileTypePackagePath(semPkg, file)
	loweredFile.noCheck = slices.ContainsFunc(file.Decls, declTooLargeForFlowAnalysis) ||
		slices.ContainsFunc(associatedMethods, func(decl *ast.FuncDecl) bool { return declTooLargeForFlowAnalysis(decl) })
	importAliases := make(map[string]string)
	importPaths := make(map[string]string)
	importNames := make(map[string]string)
	importObjects := make(map[*types.PkgName]string)
	localRefs := o.analyzeLocalFileReferences(semPkg, file, sourcePath, associatedMethods, declFiles, outputNames, runtimeMethodSets)
	reservedImportAliases := localRefs.reservedNames
	seenImport := make(map[string]bool)
	namedImportPaths := make(map[string]bool)
	imports := make([]lowerFileImport, 0)
	for idx, importFile := range semPkg.source.Syntax {
		importSourcePath := sourceFilePath(semPkg, idx, importFile)
		if !relevantImportFiles[importSourcePath] {
			continue
		}
		for _, importSpec := range importFile.Imports {
			pkgName, _ := semPkg.source.TypesInfo.Implicits[importSpec].(*types.PkgName)
			if importSpec.Name != nil {
				pkgName, _ = semPkg.source.TypesInfo.Defs[importSpec.Name].(*types.PkgName)
			}
			if pkgName == nil || pkgName.Imported() == nil {
				continue
			}
			name := pkgName.Name()
			if importSpec.Name != nil {
				name = importSpec.Name.Name
			}
			imports = append(imports, lowerFileImport{pkgName: pkgName, name: name})
			if name != "." && name != "_" {
				namedImportPaths[pkgName.Imported().Path()] = true
			}
		}
	}
	for _, imported := range imports {
		pkgName := imported.pkgName
		name := imported.name
		deferredImport := model.hasDeferredPackage(pkgName.Imported().Path()) && !model.hasDeferredPackage(semPkg.pkgPath)
		if deferredImport {
			diagnostics = append(diagnostics, model.deferredImportDiagnostics(semPkg, pkgName.Imported().Path(), name)...)
		}
		if name == "." {
			// Dot imports do not have a namespace owner in generated modules.
			continue
		}
		if name == "_" {
			// Blank imports preserve init registration through a bare module edge.
			source := "@goscript/" + pkgName.Imported().Path() + "/index.js"
			importKey := "\x00" + source
			if namedImportPaths[pkgName.Imported().Path()] || seenImport[importKey] {
				continue
			}
			seenImport[importKey] = true
			loweredFile.imports = append(loweredFile.imports, loweredImport{
				source: source,
				bare:   true,
			})
			// The package index must import the file for its blank imports to
			// run, even when the file declares nothing else.
			loweredFile.sideEffect = true
			continue
		}
		alias := uniqueImportAlias(safeIdentifier(name), pkgName.Imported().Path(), importAliases, reservedImportAliases)
		source := "@goscript/" + pkgName.Imported().Path() + "/index.js"
		importKey := alias + "\x00" + source
		if seenImport[importKey] {
			continue
		}
		seenImport[importKey] = true
		importAliases[alias] = pkgName.Imported().Path()
		importPaths[pkgName.Imported().Path()] = alias
		importNames[name] = alias
		importObjects[pkgName] = alias
		loweredFile.imports = append(loweredFile.imports, loweredImport{
			alias:      alias,
			source:     source,
			sideEffect: !deferredImport,
			typeOnly:   deferredImport,
		})
	}
	implicitImportPaths := make([]string, 0, len(localRefs.implicitImports))
	for pkgPath := range localRefs.implicitImports {
		if pkgPath != "" && pkgPath != semPkg.pkgPath {
			implicitImportPaths = append(implicitImportPaths, pkgPath)
		}
	}
	slices.Sort(implicitImportPaths)
	for _, pkgPath := range implicitImportPaths {
		o.addGeneratedImportPath(
			model,
			pkgPath,
			loweredFile,
			importAliases,
			importPaths,
			reservedImportAliases,
			seenImport,
			!localRefs.implicitRuntime[pkgPath],
		)
	}
	importSourcePaths := make([]string, 0, len(relevantImportFiles))
	for importSourcePath := range relevantImportFiles {
		importSourcePaths = append(importSourcePaths, importSourcePath)
	}
	slices.Sort(importSourcePaths)
	for _, importSourcePath := range importSourcePaths {
		o.addGeneratedTypeImports(model, semPkg, importSourcePath, loweredFile, importAliases, importPaths, reservedImportAliases, seenImport)
	}
	localImports := make([]loweredImport, 0, len(localRefs.aliases))
	seenLocalImport := make(map[string]bool)
	for _, alias := range localRefs.aliases {
		if seenLocalImport[alias] {
			continue
		}
		seenLocalImport[alias] = true
		source := localRefs.aliasSources[alias]
		typeOnly := !localRefs.runtimeAliases[alias]
		localImports = append(localImports, loweredImport{
			alias:      alias,
			source:     source,
			sideEffect: !typeOnly,
			typeOnly:   typeOnly,
		})
	}
	slices.SortFunc(localImports, func(a, b loweredImport) int {
		return cmp.Compare(a.alias, b.alias)
	})
	loweredFile.imports = append(loweredFile.imports, localImports...)

	ctx := lowerFileContext{
		externalEmbeds:    req.externalEmbeds,
		embedAssets:       loweredFile.assets,
		model:             model,
		semPkg:            semPkg,
		file:              file,
		tokenFile:         semPkg.source.Fset.File(file.Pos()),
		importAliases:     importAliases,
		importPaths:       importPaths,
		importNames:       importNames,
		importObjects:     importObjects,
		sourcePath:        sourcePath,
		localAliases:      localRefs.aliases,
		runtimeAliases:    localRefs.runtimeAliases,
		lazyPackageVars:   lazyPackageVars,
		asyncLazy:         asyncLazy,
		tempNames:         newTempNameOwner(),
		topLevel:          true,
		protobufTSAdapter: protobufTypeScriptAdapter,
		trimTypeInfo:      trimTypeInfo,
		displayRoot:       displayRoot,
		statics:           &staticPool{names: make(map[string]string)},
		awaitTemp:         new(bool),
		funcLitAsync:      make(map[*ast.FuncLit]bool),
	}
	appendDecls := func(decls []loweredDecl) {
		for _, decl := range decls {
			if decl.packageInit != nil {
				loweredFile.sideEffect = true
				loweredFile.varInits = append(loweredFile.varInits, *decl.packageInit)
				continue
			}
			loweredFile.decls = append(loweredFile.decls, decl)
			if decl.indexExport != "" {
				loweredFile.exports = append(loweredFile.exports, decl.indexExport)
			}
			if decl.typeIndexExport != "" {
				loweredFile.typeExports = append(loweredFile.typeExports, decl.typeIndexExport)
			}
			if decl.sideEffect {
				loweredFile.sideEffect = true
			}
			if decl.function != nil && decl.function.indexExported && decl.function.name != "main" {
				loweredFile.exports = append(loweredFile.exports, decl.function.name)
			}
			if decl.structType != nil && decl.structType.indexExported {
				loweredFile.exports = append(loweredFile.exports, decl.structType.name)
			}
		}
	}
	lowerDecl := func(decl ast.Decl) {
		loweredDecls, declDiagnostics := o.lowerDecl(ctx, decl)
		diagnostics = append(diagnostics, declDiagnostics...)
		appendDecls(loweredDecls)
	}
	for _, decl := range file.Decls {
		if isConstGenDecl(decl) {
			lowerDecl(decl)
		}
	}
	for _, decl := range file.Decls {
		if !isConstGenDecl(decl) {
			lowerDecl(decl)
		}
	}
	for _, decl := range loweredFile.decls {
		if decl.function == nil || !decl.function.init {
			continue
		}
		loweredFile.sideEffect = true
		loweredFile.initFuncs = append(loweredFile.initFuncs, packageInitCall{
			name:  decl.function.name,
			async: decl.function.async,
		})
	}
	for _, static := range ctx.statics.decls {
		loweredFile.decls = append(loweredFile.decls, loweredDecl{code: static})
	}
	if *ctx.awaitTemp {
		loweredFile.decls = append(loweredFile.decls, loweredDecl{code: "var " + conditionalAwaitTemp + ": any"})
	}
	return loweredFile, diagnostics
}

// typeIsHoistable reports whether the runtime descriptors of the type can be
// hoisted to the top level of the file (see hoistStatic): it has no type
// parameters and refers to no named types declared inside a function.
func typeIsHoistable(typ types.Type) bool {
	return !typeContainsTypeParam(typ) && !typeContainsLocalNamed(typ, make(map[types.Type]bool))
}

// typeContainsLocalNamed reports whether the type refers to a named type
// declared inside a function.
func typeContainsLocalNamed(typ types.Type, seen map[types.Type]bool) bool {
	if typ == nil || seen[typ] {
		return false
	}
	seen[typ] = true
	switch t := types.Unalias(typ).(type) {
	case *types.Named:
		obj := t.Obj()
		if obj != nil && obj.Pkg() != nil && obj.Parent() != obj.Pkg().Scope() {
			return true
		}
		if args := t.TypeArgs(); args != nil {
			for arg := range args.Types() {
				if typeContainsLocalNamed(arg, seen) {
					return true
				}
			}
		}
		return typeContainsLocalNamed(t.Underlying(), seen)
	case *types.Pointer:
		return typeContainsLocalNamed(t.Elem(), seen)
	case *types.Slice:
		return typeContainsLocalNamed(t.Elem(), seen)
	case *types.Array:
		return typeContainsLocalNamed(t.Elem(), seen)
	case *types.Chan:
		return typeContainsLocalNamed(t.Elem(), seen)
	case *types.Map:
		return typeContainsLocalNamed(t.Key(), seen) || typeContainsLocalNamed(t.Elem(), seen)
	case *types.Struct:
		for field := range t.Fields() {
			if typeContainsLocalNamed(field.Type(), seen) {
				return true
			}
		}
	case *types.Signature:
		for v := range t.Params().Variables() {
			if typeContainsLocalNamed(v.Type(), seen) {
				return true
			}
		}
		for v := range t.Results().Variables() {
			if typeContainsLocalNamed(v.Type(), seen) {
				return true
			}
		}
	case *types.Interface:
		for method := range t.Methods() {
			if typeContainsLocalNamed(method.Type(), seen) {
				return true
			}
		}
	}
	return false
}

// staticPool holds the static expressions hoisted out of the code of a file,
// each evaluated once, the first time it is used, by a getter function.
type staticPool struct {
	// names maps each hoisted expression to the name of its getter.
	names map[string]string
	// decls are the declarations of the getters.
	decls []string
}

// hoistStatic returns a call of a getter that evaluates the given expression
// once, the first time it is called, for an expression whose value does not
// depend on where it is evaluated, such as the method table of a type, which
// would otherwise be created each time the code runs. The value is computed
// lazily so that the declarations it refers to are initialized by then.
func (o *LoweringOwner) hoistStatic(ctx lowerFileContext, expr string) string {
	if ctx.statics == nil {
		return expr
	}
	name, ok := ctx.statics.names[expr]
	if !ok {
		name = "__goscriptStatic" + strconv.Itoa(len(ctx.statics.decls))
		ctx.statics.names[expr] = name
		ctx.statics.decls = append(ctx.statics.decls,
			"var "+name+"$value: any\nfunction "+name+"(): any {\n\treturn "+name+"$value ??= ("+expr+")\n}")
	}
	return name + "()"
}

func (o *LoweringOwner) addGeneratedTypeImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	sourcePath string,
	loweredFile *loweredFile,
	importAliases map[string]string,
	importPaths map[string]string,
	reservedImportAliases map[string]bool,
	seenImport map[string]bool,
) {
	generatedImports := semPkg.generatedImports[sourcePath]
	if len(generatedImports) == 0 {
		return
	}
	pkgPaths := make([]string, 0, len(generatedImports))
	for pkgPath := range generatedImports {
		if pkgPath != "" && pkgPath != semPkg.pkgPath {
			pkgPaths = append(pkgPaths, pkgPath)
		}
	}
	slices.Sort(pkgPaths)
	for _, pkgPath := range pkgPaths {
		o.addGeneratedImportPath(model, pkgPath, loweredFile, importAliases, importPaths, reservedImportAliases, seenImport, true)
	}
}

func (o *LoweringOwner) addGeneratedImportPath(
	model *SemanticModel,
	pkgPath string,
	loweredFile *loweredFile,
	importAliases map[string]string,
	importPaths map[string]string,
	reservedImportAliases map[string]bool,
	seenImport map[string]bool,
	typeOnly bool,
) {
	if !o.hasGeneratedImportPackage(model, pkgPath) {
		return
	}
	if importPaths[pkgPath] != "" {
		return
	}
	alias := generatedImportAlias(model, pkgPath)
	alias = uniqueImportAlias(alias, pkgPath, importAliases, reservedImportAliases)
	source := "@goscript/" + pkgPath + "/index.js"
	importKey := alias + "\x00" + source
	if seenImport[importKey] {
		return
	}
	seenImport[importKey] = true
	importAliases[alias] = pkgPath
	importPaths[pkgPath] = alias
	loweredFile.imports = append(loweredFile.imports, loweredImport{
		alias:      alias,
		source:     source,
		sideEffect: !typeOnly,
		typeOnly:   typeOnly,
	})
}

func (o *LoweringOwner) hasGeneratedImportPackage(model *SemanticModel, pkgPath string) bool {
	if model != nil && model.packages[pkgPath] != nil {
		return true
	}
	return o.overrideFacts().HasPackage(pkgPath)
}

func generatedImportAlias(model *SemanticModel, pkgPath string) string {
	if model != nil {
		if semPkg := model.packages[pkgPath]; semPkg != nil && semPkg.name != "" {
			return safeIdentifier(semPkg.name)
		}
	}
	return safeIdentifier(path.Base(pkgPath))
}

func uniqueImportAlias(alias string, pkgPath string, importAliases map[string]string, reservedAliases map[string]bool) string {
	if !reservedAliases[alias] && (importAliases[alias] == "" || importAliases[alias] == pkgPath) {
		return alias
	}
	base := alias
	for idx := 2; ; idx++ {
		candidate := base + strconv.Itoa(idx)
		if !reservedAliases[candidate] && (importAliases[candidate] == "" || importAliases[candidate] == pkgPath) {
			return candidate
		}
	}
}

// maxFlowBranches is the number of branches in one function past which
// TypeScript may not follow its control flow. Its checker gives up after
// 2000 nested steps back from a use of a variable, and each branch on the
// way can add a few.
const maxFlowBranches = 1000

// declTooLargeForFlowAnalysis reports whether decl is a function with more
// branches than TypeScript may follow, whose file is then not type checked:
// the checker reports such a function and stops narrowing in the files it
// checks after it.
func declTooLargeForFlowAnalysis(decl ast.Decl) bool {
	fn, ok := decl.(*ast.FuncDecl)
	if !ok || fn.Body == nil {
		return false
	}

	// The search stops once the function has too many.
	branches := 0
	ast.Inspect(fn.Body, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.IfStmt, *ast.ForStmt, *ast.RangeStmt, *ast.CaseClause, *ast.CommClause, *ast.LabeledStmt:
			branches++
		case *ast.BinaryExpr:
			if typed.Op == token.LAND || typed.Op == token.LOR {
				branches++
			}
		}
		return branches <= maxFlowBranches
	})
	return branches > maxFlowBranches
}

func (o *LoweringOwner) methodDeclsForFileTypes(semPkg *semanticPackage, file *ast.File, methodIndex packageMethodIndex) []*ast.FuncDecl {
	if semPkg == nil || semPkg.source == nil || file == nil {
		return nil
	}
	fileTypes := make(map[*types.Named]bool)
	for _, decl := range file.Decls {
		genDecl, ok := decl.(*ast.GenDecl)
		if !ok {
			continue
		}
		for _, spec := range genDecl.Specs {
			typeSpec, ok := spec.(*ast.TypeSpec)
			if !ok {
				continue
			}
			typeName, _ := semPkg.source.TypesInfo.Defs[typeSpec.Name].(*types.TypeName)
			if typeName == nil {
				continue
			}
			named, _ := typeName.Type().(*types.Named)
			if named != nil {
				fileTypes[named.Origin()] = true
			}
		}
	}
	if len(fileTypes) == 0 {
		return nil
	}
	var indexed []indexedMethodDecl
	for named := range fileTypes {
		indexed = append(indexed, methodIndex[named]...)
	}
	if len(indexed) == 0 {
		return nil
	}
	// The index groups methods by receiver, so restore the package-wide
	// declaration order the caller relies on.
	slices.SortFunc(indexed, func(a, b indexedMethodDecl) int {
		return cmp.Compare(a.order, b.order)
	})
	methods := make([]*ast.FuncDecl, len(indexed))
	for idx, entry := range indexed {
		methods[idx] = entry.decl
	}
	return methods
}

// indexedMethodDecl keeps a method declaration alongside its position in the
// package-wide declaration order.
type indexedMethodDecl struct {
	order int
	decl  *ast.FuncDecl
}

// packageMethodIndex maps a receiver type to its method declarations. Building
// it once per package keeps method lookup linear in the package size instead of
// rescanning every declaration for every file.
type packageMethodIndex map[*types.Named][]indexedMethodDecl

func buildPackageMethodIndex(semPkg *semanticPackage) packageMethodIndex {
	index := make(packageMethodIndex)
	if semPkg == nil || semPkg.source == nil {
		return index
	}
	order := 0
	for _, syntax := range semPkg.source.Syntax {
		for _, decl := range syntax.Decls {
			funcDecl, ok := decl.(*ast.FuncDecl)
			if !ok || funcDecl.Recv == nil {
				continue
			}
			fnObj, _ := semPkg.source.TypesInfo.Defs[funcDecl.Name].(*types.Func)
			if fnObj == nil {
				continue
			}
			signature, _ := fnObj.Type().(*types.Signature)
			if signature == nil || signature.Recv() == nil {
				continue
			}
			receiver := receiverNamedType(signature.Recv().Type())
			if receiver == nil {
				continue
			}
			origin := receiver.Origin()
			index[origin] = append(index[origin], indexedMethodDecl{order: order, decl: funcDecl})
			order++
		}
	}
	return index
}

// localFileReferenceAnalysis records names reserved by local declarations in one source file.
type localFileReferenceAnalysis struct {
	reservedNames   map[string]bool
	aliases         map[types.Object]string
	aliasSources    map[string]string
	runtimeAliases  map[string]bool
	implicitImports map[string]bool
	implicitRuntime map[string]bool
}

// runtimeMethodSetCache memoizes each named type's runtime method set. The set
// is a function of the type alone, so packages lowered concurrently share one
// cache. go/types resolves a named type lazily, which mutates it, so the lock
// covers the computation and not just the map.
type runtimeMethodSetCache struct {
	mu      sync.Mutex
	methods map[*types.Named][]types.Object
}

func newRuntimeMethodSetCache() *runtimeMethodSetCache {
	return &runtimeMethodSetCache{methods: make(map[*types.Named][]types.Object)}
}

func (c *runtimeMethodSetCache) methodsFor(named *types.Named) []types.Object {
	if named == nil {
		return nil
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	if methods, ok := c.methods[named]; ok {
		return methods
	}
	methodSet := types.NewMethodSet(types.NewPointer(named))
	methods := make([]types.Object, 0, methodSet.Len())
	for method := range methodSet.Methods() {
		methods = append(methods, method.Obj())
	}
	c.methods[named] = methods
	return methods
}

// analyzeLocalFileReferences collects local aliases and implicit type and runtime imports.
func (o *LoweringOwner) analyzeLocalFileReferences(
	semPkg *semanticPackage,
	file *ast.File,
	sourcePath string,
	associatedMethods []*ast.FuncDecl,
	declFiles map[types.Object]string,
	outputNames map[string]string,
	runtimeMethodSets *runtimeMethodSetCache,
) localFileReferenceAnalysis {
	analysis := localFileReferenceAnalysis{
		reservedNames:   make(map[string]bool),
		aliases:         make(map[types.Object]string),
		aliasSources:    make(map[string]string),
		runtimeAliases:  make(map[string]bool),
		implicitImports: make(map[string]bool),
		implicitRuntime: make(map[string]bool),
	}
	seenObjects := make(map[types.Object]bool)
	seenTypes := make(map[types.Type]bool)
	seenRuntimeTypes := make(map[types.Type]bool)
	seenRuntimeOwnerTypes := make(map[types.Type]bool)
	var addTypeDeps func(typ types.Type)
	var addRuntimeTypeDeps func(typ types.Type)
	var addRuntimeTypeOwnerDeps func(typ types.Type)
	var addObject func(obj types.Object, runtime bool)
	addObject = func(obj types.Object, runtime bool) {
		if obj == nil || obj.Pkg() == nil {
			return
		}

		// A method of an instantiated generic type is declared by its origin,
		// so it shares the origin's alias.
		if fn, ok := obj.(*types.Func); ok && fn.Origin() != fn {
			addObject(fn.Origin(), runtime)
			if alias := analysis.aliases[fn.Origin()]; alias != "" {
				analysis.aliases[obj] = alias
			}
			return
		}
		if obj.Pkg().Path() != semPkg.pkgPath {
			if runtime {
				analysis.implicitImports[obj.Pkg().Path()] = true
				analysis.implicitRuntime[obj.Pkg().Path()] = true
			}
			return
		}

		// Resolve each local object's alias and dependencies once, but allow a
		// later value use to promote a type-only import to a runtime import.
		if seenObjects[obj] {
			if runtime {
				if alias := analysis.aliases[obj]; alias != "" {
					analysis.runtimeAliases[alias] = true
				}
			}
			return
		}
		seenObjects[obj] = true
		declFile := declFiles[obj]
		if declFile == "" {
			if fn, ok := obj.(*types.Func); ok {
				if decl := functionDeclForObject(semPkg, fn); decl != nil {
					declFile = sourcePos(semPkg.source, decl.Pos()).file
				}
			}
		}
		if declFile != "" && declFile != sourcePath {
			outputName := outputNames[declFile]
			if outputName != "" {
				alias := "__goscript_" + safeIdentifier(strings.TrimSuffix(outputName, ".gs.ts"))
				analysis.aliases[obj] = alias
				analysis.aliasSources[alias] = "./" + outputName
				if runtime {
					analysis.runtimeAliases[alias] = true
				}
			}
		}
		switch typed := obj.(type) {
		case *types.TypeName:
			addTypeDeps(typed.Type())
			if named, ok := types.Unalias(typed.Type()).(*types.Named); ok {
				if structType := structUnderlyingType(named); structType != nil {
					for field := range structType.Fields() {
						addRuntimeTypeDeps(field.Type())
					}
				}
			}
			if named, ok := types.Unalias(typed.Type()).(*types.Named); ok {
				// A named value type declared here registers its methods at run
				// time (see lowerNamedValueTypeRegistration), so it uses them as
				// values.
				registered := declFile == sourcePath && registersNamedValueMethods(named)
				for method := range named.Methods() {
					addObject(method, registered)
				}
			}
		case *types.Var:
			addTypeDeps(typed.Type())
		case *types.Const:
			addTypeDeps(typed.Type())
		case *types.Func:
			signature, _ := typed.Type().(*types.Signature)
			if signature == nil {
				return
			}
			if receiver := signature.Recv(); receiver != nil {
				addTypeDeps(receiver.Type())
			}
			if params := signature.Params(); params != nil {
				for param := range params.Variables() {
					addTypeDeps(param.Type())
				}
			}
			if results := signature.Results(); results != nil {
				for result := range results.Variables() {
					addTypeDeps(result.Type())
				}
			}
		}
	}
	addTypeDeps = func(typ types.Type) {
		// Basic types cannot introduce imports or refer to another type.
		if _, ok := typ.(*types.Basic); ok {
			return
		}
		if typ == nil || seenTypes[typ] {
			return
		}
		seenTypes[typ] = true
		if alias, ok := typ.(*types.Alias); ok {
			if obj := alias.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() != semPkg.pkgPath {
				analysis.implicitImports[obj.Pkg().Path()] = true
				if args := alias.TypeArgs(); args != nil {
					for t := range args.Types() {
						addTypeDeps(t)
					}
				}
				addTypeDeps(alias.Rhs())
				return
			}
			addObject(alias.Obj(), false)
			if args := alias.TypeArgs(); args != nil {
				for t := range args.Types() {
					addTypeDeps(t)
				}
			}
			addTypeDeps(alias.Rhs())
			return
		}
		if named, ok := types.Unalias(typ).(*types.Named); ok {
			if obj := named.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() != semPkg.pkgPath {
				analysis.implicitImports[obj.Pkg().Path()] = true
				if args := named.TypeArgs(); args != nil {
					for t := range args.Types() {
						addTypeDeps(t)
					}
				}
				return
			}
			addObject(named.Obj(), false)
			if args := named.TypeArgs(); args != nil {
				for t := range args.Types() {
					addTypeDeps(t)
				}
			}
			addTypeDeps(named.Underlying())
			return
		}
		switch typed := types.Unalias(typ).Underlying().(type) {
		case *types.Pointer:
			addTypeDeps(typed.Elem())
		case *types.Slice:
			addTypeDeps(typed.Elem())
		case *types.Array:
			addTypeDeps(typed.Elem())
		case *types.Map:
			addTypeDeps(typed.Key())
			addTypeDeps(typed.Elem())
		case *types.Chan:
			addTypeDeps(typed.Elem())
		case *types.Struct:
			for field := range typed.Fields() {
				addTypeDeps(field.Type())
			}
		case *types.Signature:
			if params := typed.Params(); params != nil {
				for param := range params.Variables() {
					addTypeDeps(param.Type())
				}
			}
			if results := typed.Results(); results != nil {
				for result := range results.Variables() {
					addTypeDeps(result.Type())
				}
			}
		case *types.Interface:
			typed.Complete()
			for method := range typed.Methods() {
				addTypeDeps(method.Type())
			}
			for etyp := range typed.EmbeddedTypes() {
				addTypeDeps(etyp)
			}
		}
	}
	addRuntimeTypeDeps = func(typ types.Type) {
		// Unnamed basic and function types have no runtime type owner.
		switch typ.(type) {
		case nil, *types.Basic, *types.Signature:
			return
		}
		if seenRuntimeTypes[typ] {
			return
		}
		seenRuntimeTypes[typ] = true
		if alias, ok := typ.(*types.Alias); ok {
			addObject(alias.Obj(), true)
			if args := alias.TypeArgs(); args != nil {
				for t := range args.Types() {
					addRuntimeTypeDeps(t)
				}
			}
			addRuntimeTypeDeps(alias.Rhs())
			return
		}
		if named, ok := types.Unalias(typ).(*types.Named); ok {
			addObject(named.Obj(), true)
			for method := range named.Methods() {
				addObject(method, true)
			}
			for _, method := range runtimeMethodSets.methodsFor(named) {
				addObject(method, true)
			}
			if args := named.TypeArgs(); args != nil {
				for t := range args.Types() {
					addRuntimeTypeDeps(t)
				}
			}
			return
		}
		switch typed := types.Unalias(typ).Underlying().(type) {
		case *types.Pointer:
			addRuntimeTypeDeps(typed.Elem())
		case *types.Slice:
			addRuntimeTypeDeps(typed.Elem())
		case *types.Array:
			addRuntimeTypeDeps(typed.Elem())
		case *types.Map:
			addRuntimeTypeDeps(typed.Key())
			addRuntimeTypeDeps(typed.Elem())
		case *types.Chan:
			addRuntimeTypeDeps(typed.Elem())
		}
	}
	addRuntimeTypeOwnerDeps = func(typ types.Type) {
		if typ == nil {
			return
		}
		if seenRuntimeOwnerTypes[typ] {
			return
		}
		seenRuntimeOwnerTypes[typ] = true
		if alias, ok := typ.(*types.Alias); ok {
			addObject(alias.Obj(), true)
			if args := alias.TypeArgs(); args != nil {
				for t := range args.Types() {
					addRuntimeTypeOwnerDeps(t)
				}
			}
			addRuntimeTypeOwnerDeps(alias.Rhs())
			return
		}
		if named, ok := types.Unalias(typ).(*types.Named); ok {
			addObject(named.Obj(), true)
			if args := named.TypeArgs(); args != nil {
				for t := range args.Types() {
					addRuntimeTypeOwnerDeps(t)
				}
			}
			return
		}
		switch typed := types.Unalias(typ).Underlying().(type) {
		case *types.Pointer:
			addRuntimeTypeOwnerDeps(typed.Elem())
		case *types.Slice:
			addRuntimeTypeOwnerDeps(typed.Elem())
		case *types.Array:
			addRuntimeTypeOwnerDeps(typed.Elem())
		case *types.Map:
			addRuntimeTypeOwnerDeps(typed.Key())
			addRuntimeTypeOwnerDeps(typed.Elem())
		case *types.Chan:
			addRuntimeTypeOwnerDeps(typed.Elem())
		}
	}
	inspect := func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.ValueSpec:
			if len(typed.Values) == 0 && typed.Type != nil {
				addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(typed.Type))
			}
		case *ast.Ident:
			obj := semPkg.source.TypesInfo.Defs[typed]
			if obj != nil {
				if _, ok := obj.(*types.PkgName); !ok {
					name := safeIdentifier(obj.Name())
					if name != "_" {
						analysis.reservedNames[name] = true
					}
				}
			}

			// Instantiations pass descriptors of their type arguments, with zero
			// value constructors and method tables, which use the types as values.
			if instance, ok := semPkg.source.TypesInfo.Instances[typed]; ok && instance.TypeArgs != nil {
				for typeArg := range instance.TypeArgs.Types() {
					addRuntimeTypeDeps(typeArg)
				}
			}

			// Reuse the maps already read here, preserving TypeOf's precedence:
			// expression types first, then definitions, then uses. Embedded fields
			// can have both a definition and a use for the same identifier.
			if tv, ok := semPkg.source.TypesInfo.Types[typed]; ok {
				if tv.IsValue() {
					addObject(semPkg.source.TypesInfo.Uses[typed], true)
				}
				addTypeDeps(tv.Type)
				return true
			}
			if obj == nil {
				obj = semPkg.source.TypesInfo.Uses[typed]
			}
			if obj != nil {
				addTypeDeps(obj.Type())
			}
		case *ast.SelectorExpr:
			if selection := semPkg.source.TypesInfo.Selections[typed]; selection != nil {
				switch selection.Kind() {
				case types.FieldVal, types.MethodVal, types.MethodExpr:
					addObject(selection.Obj(), true)
					if selection.Kind() != types.FieldVal {
						addRuntimeTypeOwnerDeps(selection.Recv())
					}
				default:
					addObject(selection.Obj(), false)
				}
				addTypeDeps(selection.Obj().Type())
			} else if obj := semPkg.source.TypesInfo.Uses[typed.Sel]; obj != nil {
				if tv, ok := semPkg.source.TypesInfo.Types[typed]; ok && tv.IsValue() {
					addObject(obj, true)
				}
				addTypeDeps(obj.Type())
			}
			if pointer, ok := types.Unalias(semPkg.source.TypesInfo.TypeOf(typed.X)).Underlying().(*types.Pointer); ok {
				addTypeDeps(pointer.Elem())
			}
		case *ast.CompositeLit:
			addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(typed))
			addCompositeInterfaceValueDeps(semPkg.source.TypesInfo, typed, addRuntimeTypeDeps)
		case *ast.CallExpr:
			if ident, ok := ast.Unparen(typed.Fun).(*ast.Ident); ok && ident.Name == "new" {
				for _, arg := range typed.Args {
					addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(arg))
				}
			}
			if ident, ok := ast.Unparen(typed.Fun).(*ast.Ident); ok && ident.Name == "make" && len(typed.Args) != 0 {
				addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(typed.Args[0]))
			}
			addReflectTypeForRuntimeDeps(semPkg.source.TypesInfo, typed, addRuntimeTypeDeps)
			addInterfaceArgumentRuntimeDeps(semPkg.source.TypesInfo, typed, addRuntimeTypeDeps)
			addRuntimeTypeDeps(semPkg.source.TypesInfo.TypeOf(typed.Fun))
		}
		addImplicitInterfaceConversionDeps(semPkg.source.TypesInfo, node, addRuntimeTypeDeps)
		return true
	}
	ast.Inspect(file, inspect)
	for _, methodDecl := range associatedMethods {
		if sourcePos(semPkg.source, methodDecl.Pos()).file == sourcePath {
			continue
		}
		ast.Inspect(methodDecl, inspect)
	}
	return analysis
}

func addInterfaceArgumentRuntimeDeps(
	info *types.Info,
	call *ast.CallExpr,
	addRuntimeTypeDeps func(types.Type),
) {
	if info == nil || call == nil {
		return
	}
	signature, _ := types.Unalias(info.TypeOf(call.Fun)).(*types.Signature)
	if signature == nil || signature.Params() == nil {
		return
	}
	params := signature.Params()
	for idx, arg := range call.Args {
		paramIdx := idx
		if signature.Variadic() && paramIdx >= params.Len()-1 {
			paramIdx = params.Len() - 1
		}
		if paramIdx < 0 || paramIdx >= params.Len() {
			continue
		}
		paramType := params.At(paramIdx).Type()
		if signature.Variadic() && idx >= params.Len()-1 {
			if slice, ok := types.Unalias(paramType).Underlying().(*types.Slice); ok {
				paramType = slice.Elem()
			}
		}
		if typeIsInterface(paramType) {
			addRuntimeTypeDeps(info.TypeOf(arg))
		}
	}
}

func addReflectTypeForRuntimeDeps(
	info *types.Info,
	call *ast.CallExpr,
	addRuntimeTypeDeps func(types.Type),
) {
	if info == nil || call == nil || !isReflectTypeForExpr(info, call.Fun) {
		return
	}
	switch typed := ast.Unparen(call.Fun).(type) {
	case *ast.IndexExpr:
		addRuntimeTypeDeps(info.TypeOf(typed.Index))
	case *ast.IndexListExpr:
		for _, index := range typed.Indices {
			addRuntimeTypeDeps(info.TypeOf(index))
		}
	}
}

func isReflectTypeForExpr(info *types.Info, expr ast.Expr) bool {
	var base ast.Expr
	switch typed := ast.Unparen(expr).(type) {
	case *ast.IndexExpr:
		base = typed.X
	case *ast.IndexListExpr:
		base = typed.X
	default:
		return false
	}
	selector, ok := ast.Unparen(base).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "TypeFor" {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := info.Uses[ident].(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "reflect"
}

// addImplicitInterfaceConversionDeps records the runtime type dependencies of
// values converted to interface types outside of call arguments and composite
// literals: in return statements, assignments, typed variable declarations,
// channel sends and explicit conversions. Boxing a value of a named type uses
// its methods as values, which can come from a package the file only depends
// on implicitly.
func addImplicitInterfaceConversionDeps(
	info *types.Info,
	node ast.Node,
	addRuntimeTypeDeps func(types.Type),
) {
	addValue := func(target, source types.Type) {
		if target != nil && source != nil && typeIsInterface(target) {
			addRuntimeTypeDeps(source)
		}
	}
	switch typed := node.(type) {
	case *ast.FuncDecl:
		if obj := info.Defs[typed.Name]; obj != nil {
			signature, _ := obj.Type().(*types.Signature)
			addReturnInterfaceValueDeps(info, signature, typed.Body, addValue)
		}
	case *ast.FuncLit:
		signature, _ := types.Unalias(info.TypeOf(typed)).(*types.Signature)
		addReturnInterfaceValueDeps(info, signature, typed.Body, addValue)
	case *ast.AssignStmt:
		if typed.Tok != token.ASSIGN {
			return
		}
		targets := make([]types.Type, len(typed.Lhs))
		for idx, lhs := range typed.Lhs {
			targets[idx] = info.TypeOf(lhs)
		}
		addValueListDeps(info, targets, typed.Rhs, addValue)
	case *ast.ValueSpec:
		if typed.Type == nil {
			return
		}
		target := info.TypeOf(typed.Type)
		targets := make([]types.Type, len(typed.Names))
		for idx := range targets {
			targets[idx] = target
		}
		addValueListDeps(info, targets, typed.Values, addValue)
	case *ast.SendStmt:
		if ch, ok := types.Unalias(info.TypeOf(typed.Chan)).Underlying().(*types.Chan); ok {
			addValue(ch.Elem(), info.TypeOf(typed.Value))
		}
	case *ast.CallExpr:
		if len(typed.Args) != 1 {
			return
		}
		if tv, ok := info.Types[typed.Fun]; ok && tv.IsType() {
			addValue(tv.Type, info.TypeOf(typed.Args[0]))
		}
	}
}

// addValueListDeps calls addValue for each target type with the type of the
// value assigned to it, including the results of a single multi-value call.
func addValueListDeps(
	info *types.Info,
	targets []types.Type,
	values []ast.Expr,
	addValue func(target, source types.Type),
) {
	// Each value converts to the target at its position.
	if len(values) == len(targets) {
		for idx, value := range values {
			addValue(targets[idx], info.TypeOf(value))
		}
		return
	}

	// A single multi-value call converts each result to its target.
	if len(values) != 1 {
		return
	}
	tuple, ok := info.TypeOf(values[0]).(*types.Tuple)
	if !ok || tuple.Len() != len(targets) {
		return
	}
	for idx, target := range targets {
		addValue(target, tuple.At(idx).Type())
	}
}

// addReturnInterfaceValueDeps calls addValue for each returned value of body,
// excluding nested function literals, with its result type.
func addReturnInterfaceValueDeps(
	info *types.Info,
	signature *types.Signature,
	body *ast.BlockStmt,
	addValue func(target, source types.Type),
) {
	// Only a function with a body and results returns values.
	if signature == nil || body == nil || signature.Results().Len() == 0 {
		return
	}

	// Each return converts its values to the result types.
	results := signature.Results()
	targets := make([]types.Type, results.Len())
	for idx := range targets {
		targets[idx] = results.At(idx).Type()
	}

	// A nested function literal converts its returns to its own results.
	ast.Inspect(body, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.FuncLit:
			return false
		case *ast.ReturnStmt:
			addValueListDeps(info, targets, typed.Results, addValue)
		}
		return true
	})
}

func addCompositeInterfaceValueDeps(
	info *types.Info,
	lit *ast.CompositeLit,
	addRuntimeTypeDeps func(types.Type),
) {
	if info == nil || lit == nil {
		return
	}
	typ := types.Unalias(info.TypeOf(lit))
	if pointer, ok := typ.Underlying().(*types.Pointer); ok {
		typ = types.Unalias(pointer.Elem())
	}
	switch typed := typ.Underlying().(type) {
	case *types.Array:
		addCompositeElementsRuntimeDeps(info, lit.Elts, typed.Elem(), addRuntimeTypeDeps)
	case *types.Slice:
		addCompositeElementsRuntimeDeps(info, lit.Elts, typed.Elem(), addRuntimeTypeDeps)
	case *types.Map:
		for _, elt := range lit.Elts {
			keyValue, ok := elt.(*ast.KeyValueExpr)
			if !ok {
				continue
			}
			if typeIsInterface(typed.Key()) {
				addRuntimeTypeDeps(info.TypeOf(keyValue.Key))
			}
			if typeIsInterface(typed.Elem()) {
				addRuntimeTypeDeps(info.TypeOf(keyValue.Value))
			}
		}
	case *types.Struct:
		nextField := 0
		for _, elt := range lit.Elts {
			fieldIdx := nextField
			value := elt
			if keyValue, ok := elt.(*ast.KeyValueExpr); ok {
				value = keyValue.Value
				if ident, ok := keyValue.Key.(*ast.Ident); ok {
					for idx := range typed.NumFields() {
						if typed.Field(idx).Name() == ident.Name {
							fieldIdx = idx
							break
						}
					}
				}
			} else {
				nextField++
			}
			if fieldIdx < 0 || fieldIdx >= typed.NumFields() {
				continue
			}
			if typeIsInterface(typed.Field(fieldIdx).Type()) {
				addRuntimeTypeDeps(info.TypeOf(value))
			}
		}
	}
}

func addCompositeElementsRuntimeDeps(
	info *types.Info,
	elements []ast.Expr,
	elemType types.Type,
	addRuntimeTypeDeps func(types.Type),
) {
	if !typeIsInterface(elemType) {
		return
	}
	for _, elt := range elements {
		if keyValue, ok := elt.(*ast.KeyValueExpr); ok {
			elt = keyValue.Value
		}
		addRuntimeTypeDeps(info.TypeOf(elt))
	}
}

func typeIsInterface(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Interface)
	return ok
}

func safeIdentifier(value string) string {
	var b strings.Builder
	for idx, r := range value {
		valid := r == '_' || r >= 'a' && r <= 'z' || r >= 'A' && r <= 'Z' || idx != 0 && r >= '0' && r <= '9'
		if valid {
			b.WriteRune(r)
			continue
		}
		if r > 127 {
			b.WriteString("_u")
			b.WriteString(strconv.FormatInt(int64(r), 16))
			continue
		}
		b.WriteByte('_')
	}
	if b.Len() == 0 {
		return "_"
	}
	identifier := b.String()
	switch identifier {
	case "abstract", "any", "arguments", "as", "asserts", "async", "await", "boolean",
		"break", "case", "catch", "class", "const", "constructor", "continue", "debugger",
		"declare", "default", "delete", "do", "else", "enum", "eval", "export", "extends", "false",
		"finally", "for", "from", "function", "get", "if", "implements", "import", "in",
		"infer", "instanceof", "interface", "is", "keyof", "let", "module", "namespace",
		"never", "new", "null", "number", "object", "of", "package", "private", "protected",
		"public", "readonly", "require", "return", "set", "static", "string", "super",
		"switch", "symbol", "this", "throw", "true", "try", "type", "typeof", "undefined",
		"unique", "unknown", "var", "void", "while", "with", "yield":
		return "_" + identifier
	default:
		return identifier
	}
}

func methodMemberName(value string) string {
	if safeIdentifier(value) == value {
		return value
	}
	return "[" + strconv.Quote(value) + "]"
}

func safeParamName(param *types.Var, idx int) string {
	if param == nil || param.Name() == "" || param.Name() == "_" {
		return "_p" + strconv.Itoa(idx)
	}
	return safeIdentifier(param.Name())
}

// lowerFileContext carries source and scope facts through lowering.
type lowerFileContext struct {
	// tokenFile resolves positions in the current file without a shared FileSet lookup.
	tokenFile *token.File
	// externalEmbeds selects the embedded files that are written as separate
	// files, which are recorded in embedAssets (see [loweredFile.assets]).
	externalEmbeds  *ExternalEmbedPolicy
	embedAssets     map[string][]byte
	model           *SemanticModel
	semPkg          *semanticPackage
	file            *ast.File
	importAliases   map[string]string
	importPaths     map[string]string
	importNames     map[string]string
	importObjects   map[*types.PkgName]string
	sourcePath      string
	localAliases    map[types.Object]string
	lazyPackageVars map[types.Object]bool
	asyncLazy       *asyncLazyState
	identAliases    map[types.Object]string
	// runtimeAliases holds the local aliases that the file imports as
	// values, not only as types.
	runtimeAliases map[string]bool
	// pointerTargets names the locals that hold the struct that a pointer
	// receiver, parameter or local points to (see pointerTargetLocals).
	pointerTargets map[types.Object]string
	// pointerTargetDecls lists the pointer locals in pointerTargets that
	// each statement declares.
	pointerTargetDecls            map[ast.Stmt][]*ast.Ident
	identAliasRefs                map[types.Object]bool
	tempNames                     *tempNameOwner
	signature                     *types.Signature
	typeParams                    map[string]bool
	staticTypeParams              map[string]bool
	asyncFunction                 bool
	protobufGeneratedSyncFunction bool
	// syncDirectiveFunction is set in the body of a function that
	// //goscript:sync marks, outside its function literals. Its calls that
	// may suspend are checked to return a value instead of awaited.
	syncDirectiveFunction bool
	// callSiteFunction is set in the body of a function that
	// //goscript:callsite marks, outside its function literals. The call sites
	// it passes link its own (see lowering-call-sites.go).
	callSiteFunction  bool
	functionTypeDepth int
	deferState        *loweredDeferState
	// hoistArgsCall is the call of a defer or go statement, whose arguments
	// are evaluated into the temporaries of hoistedArgs (see lowerCallArgs).
	// hoistedCallee is set when the call reads its function from a
	// temporary too, a Go function value that takes Go-shaped arguments.
	hoistArgsCall *ast.CallExpr
	hoistedArgs   *[]string
	hoistedCallee bool
	// borrow holds the borrowed results of the function being lowered and
	// the calls in it that borrow results (see lowering-borrowed-results.go).
	borrow *borrowState
	// localLiterals holds the slice literals of the function declaration
	// being lowered, also those of its function literals, that keep arrays
	// (see lowering-local-literals.go).
	localLiterals map[*ast.CompositeLit]bool
	// copyValues is whether the struct values lowered are read after the
	// expression that lowers them, as by a method value or a defer or go
	// statement, so that they are copied even for a method or function that
	// only reads them.
	copyValues bool
	// transientAddress is whether a field address being lowered is passed to
	// a transient pointer parameter, so that it may be a new reference
	// rather than the stable one (see markTransientPointers).
	transientAddress bool
	// exprTemps maps the operands of a compound assignment target that have
	// side effects to the temporaries that hold their values, which the
	// target reads instead of evaluating them again (see
	// stableCompoundTarget).
	exprTemps map[ast.Expr]string
	// rangeElements are the slices that enclosing range loops index by their
	// own index variable, whose elements s[i] read and write the loop's
	// window directly (see rangeWindowElement).
	rangeElements []rangeElementAccess
	rangeBranch   *loweredRangeBranch
	rangeBreak    bool
	rangeContinue bool
	// gotoJumps maps the labels that gotos can reach to the statements that
	// jump to them (see lowerStmtListAfter).
	gotoJumps map[string]gotoJump
	// gotoHoist holds the variables of a goto state machine declared ahead
	// of it (see lowerGotoDispatch).
	gotoHoist           *gotoHoist
	functionScopedDecls bool
	loopLabel           string
	switchBreak         bool
	// switchLabel labels the switch that an unlabeled break leaves, when a
	// goto loop lies between them.
	switchLabel       string
	topLevel          bool
	protobufTSAdapter bool
	trimTypeInfo      bool
	// statics holds the static expressions of the file hoisted out of the
	// code that would evaluate them each time (see hoistStatic).
	statics *staticPool
	// loopWindows are the slices whose windows enclosing loops read once,
	// whose elements and lengths read the window (see loopSliceWindows).
	loopWindows []loopSliceWindow
	// awaitTemp is set when the file uses the temporary variable of
	// conditional awaits (see conditionalAwait), which is then declared.
	awaitTemp *bool
	// funcLitAsync records whether each function literal of the file was
	// lowered async, for the calls through the local that holds it (see
	// fixedFuncLocal).
	funcLitAsync map[*ast.FuncLit]bool
	// nestedFunctions collects the lowered function literals of the current
	// literal body, whose awaits do not make that body async.
	nestedFunctions *[]string

	// rangeLabels maps visible labels to their statements in the current yield.
	rangeLabels map[string]ast.Stmt
	// rangeLoop is the range statement whose body runs in the current yield.
	rangeLoop *ast.RangeStmt
	// noGoto records that an enclosing statement subtree contains no goto,
	// including inside function literals, so nested lists need no further scan.
	noGoto      bool
	displayRoot string
}

func (ctx lowerFileContext) diagnosticPosition(pos token.Pos) *DiagnosticPosition {
	if ctx.semPkg == nil {
		return nil
	}
	return diagnosticPositionFromSource(sourcePos(ctx.semPkg.source, pos), ctx.displayRoot)
}

func loweringUnsupportedAt(ctx lowerFileContext, node ast.Node, kind string, subject string, detail string) Diagnostic {
	diag := loweringUnsupported(kind, subject, detail)
	if node != nil {
		diag.Position = ctx.diagnosticPosition(node.Pos())
	}
	return diag
}

func loweringUnsupportedPos(ctx lowerFileContext, pos token.Pos, kind string, subject string, detail string) Diagnostic {
	diag := loweringUnsupported(kind, subject, detail)
	diag.Position = ctx.diagnosticPosition(pos)
	return diag
}

type tempNameOwner struct {
	counters map[string]int
}

func (ctx lowerFileContext) canReferenceNamedType(named *types.Named) bool {
	if named == nil || named.Obj() == nil {
		return true
	}
	return ctx.canReferenceObjectPackage(named.Obj())
}

func (ctx lowerFileContext) canReferenceObjectPackage(obj types.Object) bool {
	if obj == nil || obj.Pkg() == nil || ctx.semPkg == nil {
		return true
	}
	pkgPath := obj.Pkg().Path()
	if pkgPath == "" || pkgPath == ctx.semPkg.pkgPath {
		return true
	}
	if ctx.importPaths[pkgPath] != "" {
		return true
	}
	if ctx.localAliases[obj] != "" {
		return true
	}
	return false
}

func newTempNameOwner() *tempNameOwner {
	return &tempNameOwner{counters: make(map[string]int)}
}

func (ctx lowerFileContext) tempName(prefix string) string {
	if ctx.tempNames == nil {
		return "__goscript" + prefix + "0"
	}
	return ctx.tempNames.next(prefix)
}

func (ctx lowerFileContext) withIdentAliases(aliases map[types.Object]string) lowerFileContext {
	if len(aliases) == 0 {
		return ctx
	}
	if len(ctx.identAliases) != 0 {
		merged := make(map[types.Object]string, len(ctx.identAliases)+len(aliases))
		maps.Copy(merged, ctx.identAliases)
		maps.Copy(merged, aliases)
		ctx.identAliases = merged
		return ctx
	}
	ctx.identAliases = aliases
	return ctx
}

func (ctx lowerFileContext) withIdentRefAliases(aliases map[types.Object]string) lowerFileContext {
	if len(aliases) == 0 {
		return ctx
	}
	ctx = ctx.withIdentAliases(aliases)
	refs := make(map[types.Object]bool, len(ctx.identAliasRefs)+len(aliases))
	maps.Copy(refs, ctx.identAliasRefs)
	for obj := range aliases {
		refs[obj] = true
	}
	ctx.identAliasRefs = refs
	return ctx
}

func (o *tempNameOwner) next(prefix string) string {
	idx := o.counters[prefix]
	o.counters[prefix] = idx + 1
	return "__goscript" + prefix + strconv.Itoa(idx)
}

func (o *LoweringOwner) lowerDecl(ctx lowerFileContext, decl ast.Decl) ([]loweredDecl, []Diagnostic) {
	switch typed := decl.(type) {
	case *ast.GenDecl:
		if typed.Tok == token.IMPORT {
			return nil, nil
		}
		return o.lowerGenDecl(ctx, typed)
	case *ast.FuncDecl:
		// Dead code elimination leaves out unreachable functions and the
		// free functions of unreachable methods of named non-struct types.
		if !ctx.model.funcDeclLive(ctx.semPkg, typed) {
			return nil, nil
		}
		if typed.Recv != nil {
			if receiver := receiverNamedTypeFromDecl(ctx, typed); receiver != nil && namedStructType(receiver) == nil {
				fn, diagnostics := o.lowerNamedReceiverMethodDecl(ctx, typed, receiver)
				if fn == nil {
					return nil, []Diagnostic{loweringUnsupportedAt(ctx, typed, "function", typed.Name.Name, "missing type information")}
				}
				return []loweredDecl{{function: fn}}, diagnostics
			}
			return nil, nil
		}
		fn, diagnostics := o.lowerFuncDecl(ctx, typed)
		if fn == nil {
			return nil, []Diagnostic{loweringUnsupportedAt(ctx, typed, "function", typed.Name.Name, "missing type information")}
		}
		return []loweredDecl{{function: fn}}, diagnostics
	default:
		return nil, []Diagnostic{loweringUnsupportedAt(ctx, decl, "declaration", ctx.semPkg.pkgPath, "unsupported declaration kind")}
	}
}

func isConstGenDecl(decl ast.Decl) bool {
	genDecl, ok := decl.(*ast.GenDecl)
	return ok && genDecl.Tok == token.CONST
}

func (o *LoweringOwner) lowerGenDecl(ctx lowerFileContext, decl *ast.GenDecl) ([]loweredDecl, []Diagnostic) {
	decls := make([]loweredDecl, 0, len(decl.Specs))
	var diagnostics []Diagnostic
	for _, spec := range decl.Specs {
		switch typed := spec.(type) {
		case *ast.TypeSpec:
			decl, specDiagnostics := o.lowerTypeSpec(ctx, typed)
			diagnostics = append(diagnostics, specDiagnostics...)
			if decl.code != "" || decl.structType != nil {
				decls = append(decls, decl)
			}
		case *ast.ValueSpec:
			embedPatterns := goEmbedPatterns(decl.Doc, typed.Doc)
			if len(typed.Values) == 1 && len(typed.Names) > 1 && tupleResultTypes(ctx, typed.Values[0]) != nil {
				tupleDecls, tupleDiagnostics := o.lowerTupleValueSpec(ctx, decl, typed)
				diagnostics = append(diagnostics, tupleDiagnostics...)
				decls = append(decls, tupleDecls...)
				continue
			}
			for idx, name := range typed.Names {
				if name.Name == "_" && ctx.topLevel && idx < len(typed.Values) &&
					!initializerMayHaveRuntimeEffects(ctx, typed.Values[idx]) {
					continue
				}
				obj := ctx.semPkg.source.TypesInfo.Defs[name]
				if obj == nil {
					continue
				}
				value := o.lowerDeclarationZeroValueExpr(ctx, obj.Type())
				if constObj, ok := obj.(*types.Const); ok {
					if constValue, ok := lowerConstantValueForType(constObj.Val(), constObj.Type()); ok {
						value = constValue
					}
				} else if idx < len(typed.Values) {
					lowered, exprDiagnostics := o.lowerExpr(ctx, typed.Values[idx])
					diagnostics = append(diagnostics, exprDiagnostics...)
					value = o.lowerValueForTarget(ctx, typed.Values[idx], obj.Type(), lowered)
					value = o.lowerTopLevelInitializerValue(ctx, typed.Values[idx], value)
				} else if len(embedPatterns) != 0 {
					embedded, embedDiagnostics := o.lowerGoEmbedValue(ctx, typed.Pos(), obj.Type(), embedPatterns)
					diagnostics = append(diagnostics, embedDiagnostics...)
					if embedded != "" {
						value = embedded
					}
				}
				if _, ok := obj.(*types.Const); !ok && ctx.model.needsVarRef[obj] {
					value = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")"
				}
				keyword := strings.TrimSpace(declarationKeyword(ctx))
				if _, ok := obj.(*types.Const); ok || decl.Tok == token.CONST {
					keyword = "const"
				}
				variableType := o.declaredVariableType(ctx, obj)
				declName := o.lowerIdent(ctx, name, true)
				if name.Name == "_" {
					declName = ctx.tempName("Blank")
				}
				lazy := ctx.topLevel && ctx.lazyPackageVars[obj]
				code := keyword + " " + declName + ": " + variableType + " = " + value
				if keyword != "const" && o.inferredValueType(value) == variableType {
					code = keyword + " " + declName + " = " + value
				}
				if o.gotoHoistedDecl(ctx, obj, declName) {
					code = declName + " = " + value
				}
				if lazy {
					keyword = "var"
					code = "var " + declName + ": " + variableType
				}
				indexExport := ""
				if ctx.topLevel && name.Name != "_" {
					code = "export " + code
					if ast.IsExported(name.Name) {
						indexExport = name.Name
					}
				}
				// An initializer that may have effects, such as a call,
				// makes the package index import the file even when the
				// variable is unexported or blank.
				effects := ctx.topLevel && keyword != "const" && idx < len(typed.Values) &&
					initializerMayHaveRuntimeEffects(ctx, typed.Values[idx])
				decls = append(decls, loweredDecl{code: code, indexExport: indexExport, sideEffect: effects})
				if lazy {
					getterName := packageVarGetterName(name.Name)
					initName := packageVarInitName(name.Name)
					initIndexExport := ""
					if ast.IsExported(name.Name) {
						initIndexExport = initName
					}
					getterCode := "export function " + getterName + "(): " + variableType + " {\n\t"
					if strings.Contains(value, "await ") {
						initCode := "export async function " + initName + "(): globalThis.Promise<void> {\n\t" +
							"if (((" + declName + ") as any) === undefined) {\n\t\t" +
							declName + " = " + value + "\n\t}\n}"
						decls = append(decls, loweredDecl{code: initCode, indexExport: initIndexExport})
						decls = append(decls, loweredDecl{packageInit: &packageInitCall{obj: obj, name: initName, async: true}})
						getterCode += "if (((" + declName + ") as any) === undefined) {\n\t\t" +
							"throw new globalThis.Error(" + strconv.Quote("goscript package variable "+name.Name+" read before initialization") + ")\n\t}\n"
					} else {
						initCode := "export function " + initName + "(): void {\n\t" +
							"if (((" + declName + ") as any) === undefined) {\n\t\t" +
							declName + " = " + value + "\n\t}\n}"
						decls = append(decls, loweredDecl{code: initCode, indexExport: initIndexExport})
						// A table of constant data is built when it is first read.
						if !ctx.semPkg.deferredVars[obj] && (idx >= len(typed.Values) || len(typed.Names) != len(typed.Values) ||
							!packageVarInitIsDeferred(ctx.semPkg.source.TypesInfo, typed.Values[idx])) {
							decls = append(decls, loweredDecl{packageInit: &packageInitCall{obj: obj, name: initName}})
						}
						getterCode += "if (((" + declName + ") as any) === undefined) {\n\t\t" +
							initName + "()\n\t}\n"
					}
					getterCode += "\treturn " + declName + "\n}"
					getterIndexExport := ""
					if ast.IsExported(name.Name) {
						getterIndexExport = getterName
					}
					decls = append(decls, loweredDecl{code: getterCode, indexExport: getterIndexExport})
				}
				if ctx.topLevel && name.Name != "_" && keyword != "const" {
					setterName := packageVarSetterName(name.Name)
					setterType := o.tsPackageVarSetterValueTypeFor(ctx, obj.Type())
					setterTarget := declName
					if ctx.model.needsVarRef[obj] {
						if lazy {
							setterTarget = packageVarGetterName(name.Name) + "().value"
						} else {
							setterTarget += ".value"
						}
					}
					setterValue := "__goscriptValue"
					assignment := setterTarget + " = " + setterValue
					if isStructValueType(obj.Type()) {
						assignment = o.lowerStructAssignment(setterTarget, setterValue)
					}
					if isArrayValueType(obj.Type()) {
						assignment = setterTarget + " = " + o.lowerArrayAssignment(setterTarget, setterValue, obj.Type())
					}
					setterCode := "export function " + setterName + "(" + setterValue + ": " + setterType + "): void {\n\t" + assignment + "\n}"
					setterIndexExport := ""
					if ast.IsExported(name.Name) {
						setterIndexExport = setterName
					}
					decls = append(decls, loweredDecl{code: setterCode, indexExport: setterIndexExport})
				}
			}
		default:
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, typed, "declaration", ctx.semPkg.pkgPath, "unsupported general declaration"))
		}
	}
	return decls, diagnostics
}

func (o *LoweringOwner) lowerTopLevelInitializerValue(ctx lowerFileContext, expr ast.Expr, value string) string {
	if !ctx.topLevel || strings.HasPrefix(value, "await ") {
		return value
	}
	if !o.topLevelInitializerNeedsAwait(ctx, expr) {
		return value
	}
	return "await " + value
}

func (o *LoweringOwner) topLevelInitializerNeedsAwait(ctx lowerFileContext, expr ast.Expr) bool {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	needsAwait := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if needsAwait {
			return false
		}
		if _, ok := node.(*ast.FuncLit); ok {
			return false
		}
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		if o.callExprNeedsAwait(ctx, call) {
			needsAwait = true
			return false
		}
		if o.callUsesOverridePackage(ctx, call.Fun) {
			return true
		}
		// A function of another package is awaited, unless it is effect free
		// and so makes no calls.
		fn := calledFunction(ctx.semPkg.source, call.Fun)
		if fn != nil && fn.Pkg() != nil && fn.Pkg().Path() != ctx.semPkg.pkgPath && !ctx.model.effectFreeFuncs[fn] {
			needsAwait = true
			return false
		}
		return true
	})
	return needsAwait
}

func initializerMayHaveRuntimeEffects(ctx lowerFileContext, expr ast.Expr) bool {
	hasEffects := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if hasEffects {
			return false
		}
		switch typed := node.(type) {
		case *ast.CallExpr:
			if isEffectFreePackageInitializerCall(ctx, typed) {
				return true
			}
			if callTargetSignature(ctx, typed.Fun) != nil {
				hasEffects = true
				return false
			}
		case *ast.UnaryExpr:
			if typed.Op == token.ARROW {
				hasEffects = true
				return false
			}
		}
		return true
	})
	return hasEffects
}

func isEffectFreePackageInitializerCall(ctx lowerFileContext, call *ast.CallExpr) bool {
	if call == nil {
		return false
	}
	if isEffectFreePackageInitializerBuiltin(ctx, call.Fun) {
		return true
	}
	if isReflectTypeOfCall(ctx, call) {
		return true
	}
	if isReflectTypeForCall(ctx, call) {
		return true
	}
	if isMathBigNewIntCall(ctx, call) {
		return true
	}
	selector, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "Elem" {
		return false
	}
	receiver, ok := ast.Unparen(selector.X).(*ast.CallExpr)
	return ok && isReflectTypeOfCall(ctx, receiver)
}

func isEffectFreePackageInitializerBuiltin(ctx lowerFileContext, expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return false
	}
	if ident.Name != "make" && ident.Name != "new" {
		return false
	}
	_, ok = objectForIdent(ctx, ident).(*types.Builtin)
	return ok
}

func isReflectTypeOfCall(ctx lowerFileContext, call *ast.CallExpr) bool {
	selector, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "TypeOf" {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "reflect"
}

func isReflectTypeForCall(ctx lowerFileContext, call *ast.CallExpr) bool {
	fun := ast.Unparen(call.Fun)
	switch typed := fun.(type) {
	case *ast.IndexExpr:
		fun = ast.Unparen(typed.X)
	case *ast.IndexListExpr:
		fun = ast.Unparen(typed.X)
	}
	selector, ok := fun.(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "TypeFor" {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "reflect"
}

func isMathBigNewIntCall(ctx lowerFileContext, call *ast.CallExpr) bool {
	selector, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "NewInt" {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "math/big"
}

func packageDeclFiles(semPkg *semanticPackage) map[types.Object]string {
	if semPkg == nil || semPkg.source == nil {
		return nil
	}
	if len(semPkg.source.Syntax) <= 1 {
		return nil
	}
	declFiles := make(map[types.Object]string, len(semPkg.declarations))
	for idx, file := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, file)
		for _, decl := range file.Decls {
			recordDeclFileObjects(semPkg.source.TypesInfo, declFiles, sourcePath, decl)
		}
	}
	for _, decl := range semPkg.declarations {
		if decl.object != nil && decl.position.file != "" && declFiles[decl.object] == "" {
			declFiles[decl.object] = decl.position.file
		}
	}
	return declFiles
}

func recordDeclFileObjects(info *types.Info, declFiles map[types.Object]string, sourcePath string, decl ast.Decl) {
	if info == nil || sourcePath == "" {
		return
	}
	switch typed := decl.(type) {
	case *ast.FuncDecl:
		if obj := info.Defs[typed.Name]; obj != nil {
			declFiles[obj] = sourcePath
		}
	case *ast.GenDecl:
		for _, spec := range typed.Specs {
			switch typedSpec := spec.(type) {
			case *ast.TypeSpec:
				if obj := info.Defs[typedSpec.Name]; obj != nil {
					declFiles[obj] = sourcePath
				}
			case *ast.ValueSpec:
				for _, name := range typedSpec.Names {
					if obj := info.Defs[name]; obj != nil {
						declFiles[obj] = sourcePath
					}
				}
			}
		}
	}
}

func packageOutputNames(semPkg *semanticPackage) map[string]string {
	if semPkg == nil || semPkg.source == nil {
		return nil
	}
	outputNames := make(map[string]string, len(semPkg.source.Syntax))
	for idx, syntax := range semPkg.source.Syntax {
		outputSourcePath := sourceFilePath(semPkg, idx, syntax)
		outputNames[outputSourcePath] = sourceOutputName(outputSourcePath)
	}
	return outputNames
}

// lazyPackageVars returns the package variables that initialize lazily through
// a getter. The answer depends only on the package's own syntax and
// initialization order.
func lazyPackageVars(semPkg *semanticPackage) map[types.Object]bool {
	declFiles := packageDeclFiles(semPkg)
	varOrder := make(map[types.Object]int)
	for idx, obj := range semPkg.initOrder {
		varOrder[obj] = idx
	}
	funcRefs := packageVarsReferencedFromOtherFileTopLevelCalls(semPkg, declFiles)
	lazy := make(map[types.Object]bool)
	for idx, file := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, file)
		for _, decl := range file.Decls {
			genDecl, ok := decl.(*ast.GenDecl)
			if !ok || genDecl.Tok != token.VAR {
				continue
			}
			for _, spec := range genDecl.Specs {
				valueSpec, ok := spec.(*ast.ValueSpec)
				if !ok {
					continue
				}
				for valueIdx, name := range valueSpec.Names {
					obj, _ := semPkg.source.TypesInfo.Defs[name].(*types.Var)
					if obj == nil {
						continue
					}
					// A large table of constant data is built on first read.
					if valueIdx < len(valueSpec.Values) && len(valueSpec.Names) == len(valueSpec.Values) &&
						packageVarInitIsDeferred(semPkg.source.TypesInfo, valueSpec.Values[valueIdx]) {
						lazy[obj] = true
						continue
					}
					if valueIdx < len(valueSpec.Values) &&
						initializerReferencesLaterPackageVar(semPkg, varOrder, obj, valueSpec.Values[valueIdx]) {
						lazy[obj] = true
						continue
					}
					if valueIdx < len(valueSpec.Values) &&
						initializerReferencesOtherFileObject(semPkg, declFiles, sourcePath, valueSpec.Values[valueIdx]) {
						lazy[obj] = true
						continue
					}
					if valueIdx < len(valueSpec.Values) &&
						initializerCallsFunctionReferencingOtherFileObject(semPkg, declFiles, sourcePath, valueSpec.Values[valueIdx]) {
						lazy[obj] = true
						continue
					}
					if valueIdx < len(valueSpec.Values) &&
						initializerCallsFunctionReferencingLaterPackageVar(semPkg, varOrder, obj, valueSpec.Values[valueIdx]) {
						lazy[obj] = true
						continue
					}
					if valueIdx >= len(valueSpec.Values) &&
						zeroValueReferencesOtherFileObject(semPkg, declFiles, sourcePath, obj.Type()) {
						lazy[obj] = true
						continue
					}
					if funcRefs[obj] &&
						(valueIdx >= len(valueSpec.Values) ||
							!initializerMayHaveRuntimeEffects(lowerFileContext{semPkg: semPkg}, valueSpec.Values[valueIdx])) {
						lazy[obj] = true
					}
				}
			}
		}
	}
	return lazy
}

func packageVarsReferencedFromOtherFileTopLevelCalls(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
) map[*types.Var]bool {
	refs := make(map[*types.Var]bool)
	if semPkg == nil || semPkg.source == nil || semPkg.source.TypesInfo == nil {
		return refs
	}
	var collectFuncRefs func(rootSource string, fn *types.Func, seen map[*types.Func]bool)
	collectFuncRefs = func(rootSource string, fn *types.Func, seen map[*types.Func]bool) {
		if fn == nil || seen[fn] {
			return
		}
		seen[fn] = true
		decl := functionDeclForObject(semPkg, fn)
		if decl == nil || decl.Body == nil {
			return
		}
		ast.Inspect(decl.Body, func(node ast.Node) bool {
			switch typed := node.(type) {
			case *ast.Ident:
				obj, _ := semPkg.source.TypesInfo.Uses[typed].(*types.Var)
				if obj == nil || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
					return true
				}
				if declFiles[obj] != "" && declFiles[obj] != rootSource {
					refs[obj] = true
				}
			case *ast.CallExpr:
				called := calledFunction(semPkg.source, typed.Fun)
				if called != nil && called.Pkg() != nil && called.Pkg().Path() == semPkg.pkgPath {
					collectFuncRefs(rootSource, called, seen)
				}
			}
			return true
		})
	}
	for _, file := range semPkg.source.Syntax {
		sourcePath := sourcePos(semPkg.source, file.Pos()).file
		for _, decl := range file.Decls {
			switch typed := decl.(type) {
			case *ast.GenDecl:
				if typed.Tok != token.VAR {
					continue
				}
				for _, spec := range typed.Specs {
					valueSpec, ok := spec.(*ast.ValueSpec)
					if !ok {
						continue
					}
					for _, value := range valueSpec.Values {
						collectTopLevelRefs(semPkg, declFiles, refs, sourcePath, value, collectFuncRefs)
					}
				}
			case *ast.FuncDecl:
				if typed.Name.Name == "init" && typed.Body != nil {
					collectTopLevelRefs(semPkg, declFiles, refs, sourcePath, typed.Body, collectFuncRefs)
				}
			}
		}
	}
	return refs
}

func collectTopLevelRefs(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	refs map[*types.Var]bool,
	sourcePath string,
	node ast.Node,
	collectFuncRefs func(string, *types.Func, map[*types.Func]bool),
) {
	ast.Inspect(node, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.Ident:
			obj, _ := semPkg.source.TypesInfo.Uses[typed].(*types.Var)
			if obj == nil || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
				return true
			}
			if declFiles[obj] != "" && declFiles[obj] != sourcePath {
				refs[obj] = true
			}
		case *ast.CallExpr:
			called := calledFunction(semPkg.source, typed.Fun)
			if called == nil || called.Pkg() == nil || called.Pkg().Path() != semPkg.pkgPath {
				return true
			}
			collectFuncRefs(sourcePath, called, make(map[*types.Func]bool))
		}
		return true
	})
}

// packageVarIsLazy reports whether obj is a package variable its package
// initializes lazily.
func packageVarIsLazy(ctx lowerFileContext, obj types.Object) bool {
	if obj == nil || obj.Pkg() == nil || ctx.model == nil {
		return false
	}
	semPkg := ctx.model.packages[obj.Pkg().Path()]
	return semPkg != nil && semPkg.lazyVars[obj]
}

// lazyPackageVarRead returns an expression reading the lazily initialized
// package variable obj through its getter. qualifier is empty or an import
// alias followed by a dot. In an async function or at the module top level,
// the expression first awaits an asynchronous initializer.
func (o *LoweringOwner) lazyPackageVarRead(ctx lowerFileContext, qualifier string, obj types.Object) string {
	value := qualifier + packageVarGetterName(obj.Name()) + "()"
	if !ctx.asyncFunction && !ctx.topLevel || !o.packageVarHasAsyncLazyInit(ctx, obj) {
		return value
	}
	return "(await " + qualifier + packageVarInitName(obj.Name()) + "(), " + value + ")"
}

// packageVarHasAsyncLazyInit reports whether the package variable obj has an
// initializer that must be awaited.
func (o *LoweringOwner) packageVarHasAsyncLazyInit(ctx lowerFileContext, obj types.Object) bool {
	// Resolve the package that declares obj.
	varObj, _ := obj.(*types.Var)
	if varObj == nil || varObj.Pkg() == nil || ctx.model == nil {
		return false
	}
	semPkg := ctx.model.packages[varObj.Pkg().Path()]
	if semPkg == nil || semPkg.source == nil {
		return false
	}

	// Find the initializer among the package's var declarations.
	initCtx := lowerFileContext{
		model:     ctx.model,
		semPkg:    semPkg,
		asyncLazy: ctx.asyncLazy,
		topLevel:  true,
	}
	for _, file := range semPkg.source.Syntax {
		for _, decl := range file.Decls {
			genDecl, ok := decl.(*ast.GenDecl)
			if !ok || genDecl.Tok != token.VAR {
				continue
			}
			for _, spec := range genDecl.Specs {
				valueSpec, ok := spec.(*ast.ValueSpec)
				if !ok {
					continue
				}
				for idx, ident := range valueSpec.Names {
					if ident.Name != varObj.Name() || idx >= len(valueSpec.Values) {
						continue
					}
					return o.topLevelInitializerNeedsAwait(initCtx, valueSpec.Values[idx])
				}
			}
		}
	}
	return false
}

func initializerReferencesLaterPackageVar(
	semPkg *semanticPackage,
	varOrder map[types.Object]int,
	current types.Object,
	expr ast.Expr,
) bool {
	currentIdx, ok := varOrder[current]
	if !ok {
		return false
	}
	references := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if references {
			return false
		}
		if _, ok := node.(*ast.FuncLit); ok {
			return false
		}
		ident, ok := node.(*ast.Ident)
		if !ok {
			return true
		}
		obj, ok := semPkg.source.TypesInfo.Uses[ident].(*types.Var)
		if !ok || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
			return true
		}
		if idx, ok := varOrder[obj]; ok && idx > currentIdx {
			references = true
			return false
		}
		return true
	})
	return references
}

func initializerCallsFunctionReferencingLaterPackageVar(
	semPkg *semanticPackage,
	varOrder map[types.Object]int,
	current types.Object,
	expr ast.Expr,
) bool {
	currentIdx, ok := varOrder[current]
	if !ok {
		return false
	}
	references := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if references {
			return false
		}
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		fn := calledFunction(semPkg.source, call.Fun)
		if fn == nil || fn.Pkg() == nil || fn.Pkg().Path() != semPkg.pkgPath {
			return true
		}
		if functionReferencesLaterPackageVar(semPkg, varOrder, currentIdx, fn, nil) {
			references = true
			return false
		}
		return true
	})
	return references
}

func initializerCallsFunctionReferencingOtherFileObject(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	sourcePath string,
	expr ast.Expr,
) bool {
	references := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if references {
			return false
		}
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		fn := calledFunction(semPkg.source, call.Fun)
		if fn == nil || fn.Pkg() == nil || fn.Pkg().Path() != semPkg.pkgPath {
			return true
		}
		if functionReferencesOtherFileObject(semPkg, declFiles, sourcePath, fn, nil) {
			references = true
			return false
		}
		return true
	})
	return references
}

func functionReferencesLaterPackageVar(
	semPkg *semanticPackage,
	varOrder map[types.Object]int,
	currentIdx int,
	fn *types.Func,
	seen map[*types.Func]bool,
) bool {
	if fn == nil {
		return false
	}
	if seen == nil {
		seen = make(map[*types.Func]bool)
	}
	if seen[fn] {
		return false
	}
	seen[fn] = true
	fnDecl := functionDeclForObject(semPkg, fn)
	if fnDecl == nil || fnDecl.Body == nil {
		return false
	}
	references := false
	ast.Inspect(fnDecl.Body, func(node ast.Node) bool {
		if references {
			return false
		}
		if _, ok := node.(*ast.FuncLit); ok {
			return false
		}
		if ident, ok := node.(*ast.Ident); ok {
			if obj, ok := semPkg.source.TypesInfo.Uses[ident].(*types.Var); ok &&
				obj.Pkg() != nil && obj.Pkg().Path() == semPkg.pkgPath {
				if idx, ok := varOrder[obj]; ok && idx > currentIdx {
					references = true
					return false
				}
			}
		}
		if call, ok := node.(*ast.CallExpr); ok {
			called := calledFunction(semPkg.source, call.Fun)
			if called != nil && called.Pkg() != nil && called.Pkg().Path() == semPkg.pkgPath &&
				functionReferencesLaterPackageVar(semPkg, varOrder, currentIdx, called, seen) {
				references = true
				return false
			}
		}
		return true
	})
	return references
}

func functionReferencesOtherFileObject(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	sourcePath string,
	fn *types.Func,
	seen map[*types.Func]bool,
) bool {
	if fn == nil {
		return false
	}
	if seen == nil {
		seen = make(map[*types.Func]bool)
	}
	if seen[fn] {
		return false
	}
	seen[fn] = true
	fnDecl := functionDeclForObject(semPkg, fn)
	if fnDecl == nil || fnDecl.Body == nil {
		return false
	}
	references := false
	ast.Inspect(fnDecl.Body, func(node ast.Node) bool {
		if references {
			return false
		}
		if _, ok := node.(*ast.FuncLit); ok {
			return false
		}
		if lit, ok := node.(*ast.CompositeLit); ok {
			if zeroValueReferencesOtherFileObject(semPkg, declFiles, sourcePath, semPkg.source.TypesInfo.TypeOf(lit)) {
				references = true
				return false
			}
		}
		if ident, ok := node.(*ast.Ident); ok {
			obj := semPkg.source.TypesInfo.Uses[ident]
			if obj != nil && obj.Pkg() != nil && obj.Pkg().Path() == semPkg.pkgPath {
				if declFile := declFiles[obj]; declFile != "" && declFile != sourcePath {
					references = true
					return false
				}
			}
		}
		if call, ok := node.(*ast.CallExpr); ok {
			called := calledFunction(semPkg.source, call.Fun)
			if called != nil && called.Pkg() != nil && called.Pkg().Path() == semPkg.pkgPath &&
				functionReferencesOtherFileObject(semPkg, declFiles, sourcePath, called, seen) {
				references = true
				return false
			}
		}
		return true
	})
	return references
}

// functionDeclForObject returns the declaration for the exact function object,
// or nil for functions without syntax in the package.
func functionDeclForObject(semPkg *semanticPackage, fn *types.Func) *ast.FuncDecl {
	if semPkg == nil {
		return nil
	}
	return semPkg.functionDecls[fn]
}

func initializerReferencesOtherFileObject(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	sourcePath string,
	expr ast.Expr,
) bool {
	references := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if references {
			return false
		}
		if lit, ok := node.(*ast.CompositeLit); ok {
			if zeroValueReferencesOtherFileObject(semPkg, declFiles, sourcePath, semPkg.source.TypesInfo.TypeOf(lit)) {
				references = true
				return false
			}
		}
		ident, ok := node.(*ast.Ident)
		if !ok {
			return true
		}
		obj := semPkg.source.TypesInfo.Uses[ident]
		if obj == nil || obj.Pkg() == nil || obj.Pkg().Path() != semPkg.pkgPath {
			return true
		}
		if declFile := declFiles[obj]; declFile != "" && declFile != sourcePath {
			references = true
			return false
		}
		return true
	})
	return references
}

func zeroValueReferencesOtherFileObject(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	sourcePath string,
	typ types.Type,
) bool {
	return zeroValueReferencesOtherFileObjectSeen(semPkg, declFiles, sourcePath, typ, make(map[types.Type]bool))
}

func zeroValueReferencesOtherFileObjectSeen(
	semPkg *semanticPackage,
	declFiles map[types.Object]string,
	sourcePath string,
	typ types.Type,
	seen map[types.Type]bool,
) bool {
	if typ == nil || seen[typ] {
		return false
	}
	seen[typ] = true
	if named := namedStructType(typ); named != nil {
		if obj := named.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() == semPkg.pkgPath {
			if declFile := declFiles[obj]; declFile != "" && declFile != sourcePath {
				return true
			}
		}
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Array:
		return zeroValueReferencesOtherFileObjectSeen(semPkg, declFiles, sourcePath, typed.Elem(), seen)
	case *types.Struct:
		for field := range typed.Fields() {
			if zeroValueReferencesOtherFileObjectSeen(semPkg, declFiles, sourcePath, field.Type(), seen) {
				return true
			}
		}
	}
	return false
}

func (o *LoweringOwner) lowerTupleValueSpec(
	ctx lowerFileContext,
	decl *ast.GenDecl,
	spec *ast.ValueSpec,
) ([]loweredDecl, []Diagnostic) {
	right, diagnostics := o.lowerTupleExpr(ctx, spec.Values[0])
	tempName := ctx.tempName("Tuple")
	lazyTuple := false
	if ctx.topLevel {
		for _, name := range spec.Names {
			obj := ctx.semPkg.source.TypesInfo.Defs[name]
			if obj != nil && ctx.lazyPackageVars[obj] {
				lazyTuple = true
				break
			}
		}
	}
	var decls []loweredDecl
	tupleExpr := tempName
	if lazyTuple {
		tupleGetterName := packageVarGetterName(tempName)
		decls = append(decls, loweredDecl{code: "var " + tempName + ": any = undefined as any"})
		decls = append(decls, loweredDecl{code: "function " + tupleGetterName + "(): any {\n\t" +
			"if (((" + tempName + ") as any) === undefined) {\n\t\t" +
			tempName + " = " + right + "\n\t}\n\treturn " + tempName + "\n}"})
		tupleExpr = tupleGetterName + "()"
	} else {
		decls = append(decls, loweredDecl{code: "const " + tempName + " = " + right})
	}
	for idx, name := range spec.Names {
		if name.Name == "_" {
			continue
		}
		obj := ctx.semPkg.source.TypesInfo.Defs[name]
		if obj == nil {
			continue
		}
		value := o.lowerDeclaredValue(ctx, name, tupleExpr+"["+strconv.Itoa(idx)+"]")
		keyword := "let"
		if _, ok := obj.(*types.Const); ok || decl.Tok == token.CONST {
			keyword = "const"
		}
		variableType := o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj])
		code := keyword + " " + o.lowerIdent(ctx, name, true) + ": " + variableType + " = " + value
		lazy := lazyTuple || ctx.topLevel && ctx.lazyPackageVars[obj]
		if lazy {
			// The lazy variable holds undefined until its getter runs the
			// initializer; declaring it without an initializer keeps the
			// declared type T while the runtime value starts as undefined.
			code = "var " + o.lowerIdent(ctx, name, true) + ": " + variableType
		}
		indexExport := ""
		if ctx.topLevel {
			code = "export " + code
			if ast.IsExported(name.Name) {
				indexExport = name.Name
			}
		}
		decls = append(decls, loweredDecl{code: code, indexExport: indexExport})
		if lazy {
			getterName := packageVarGetterName(name.Name)
			getterCode := "export function " + getterName + "(): " + variableType + " {\n\t" +
				"if (((" + o.lowerIdent(ctx, name, true) + ") as any) === undefined) {\n\t\t" +
				o.lowerIdent(ctx, name, true) + " = " + value + "\n\t}\n\treturn " + o.lowerIdent(ctx, name, true) + "\n}"
			getterIndexExport := ""
			if ast.IsExported(name.Name) {
				getterIndexExport = getterName
			}
			decls = append(decls, loweredDecl{code: getterCode, indexExport: getterIndexExport})
		}
	}
	return decls, diagnostics
}

func lowerConstantValue(value constant.Value) (string, bool) {
	if value == nil {
		return "", false
	}
	switch value.Kind() {
	case constant.Bool:
		return strconv.FormatBool(constant.BoolVal(value)), true
	case constant.String:
		return lowerGoStringLiteral(constant.StringVal(value)), true
	case constant.Int:
		if intValue, ok := constant.Int64Val(value); ok {
			return strconv.FormatInt(intValue, 10), true
		}
		if uintValue, ok := constant.Uint64Val(value); ok {
			return strconv.FormatUint(uintValue, 10), true
		}
		return value.ExactString(), true
	case constant.Float:
		// ExactString of a fraction is "num/denom", which loses its value
		// to the precedence of the operator around it and to the precision of
		// a literal with that many digits.
		if f, _ := constant.Float64Val(value); !math.IsInf(f, 0) {
			return strconv.FormatFloat(f, 'g', -1, 64), true
		}
		return value.ExactString(), true
	case constant.Complex:
		real, _ := lowerConstantValue(constant.Real(value))
		imag, _ := lowerConstantValue(constant.Imag(value))
		return "$.complex(" + real + ", " + imag + ")", true
	default:
		return "", false
	}
}

func lowerLargeIntegerConstantValue(value constant.Value) (string, bool) {
	if value == nil || value.Kind() != constant.Int || constant.BitLen(value) <= 53 {
		return "", false
	}
	return value.ExactString(), true
}

// lowerConstantValueForType lowers an integer constant to a bigint literal when
// its declared type is bigint-backed (int64/uint64 and named types over them),
// so that const declarations and inlined const references carry the same
// representation as the values they participate in arithmetic with.
func lowerConstantValueForType(value constant.Value, typ types.Type) (string, bool) {
	if value != nil && value.Kind() == constant.Int && isBigIntBackedType(typ) {
		return value.ExactString() + "n", true
	}
	if isFloat32Type(typ) {
		if lowered, ok := lowerFloat32ConstantValue(value); ok {
			return lowered, true
		}
	}
	return lowerConstantValue(value)
}

// lowerFloat32ConstantValue lowers a numeric constant of a float32 type to
// its value rounded to float32 precision, which is how float32 values are
// represented at runtime (see the float32 runtime helper), so that a
// constant compares equal to the same value computed or converted at runtime.
func lowerFloat32ConstantValue(value constant.Value) (string, bool) {
	if value == nil || (value.Kind() != constant.Int && value.Kind() != constant.Float) {
		return "", false
	}
	f, _ := constant.Float64Val(constant.ToFloat(value))
	return strconv.FormatFloat(float64(float32(f)), 'g', -1, 64), true
}

// isWideIntegerConstantExpr reports whether expr is an integer constant
// beyond the safe integers of JavaScript (see lowerWideIntegerConstantValue).
func isWideIntegerConstantExpr(ctx lowerFileContext, expr ast.Expr) bool {
	tv, ok := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)]
	if !ok {
		return false
	}
	_, wide := lowerWideIntegerConstantValue(tv.Value)
	return wide
}

func lowerWideIntegerConstantValue(value constant.Value) (string, bool) {
	if value == nil || value.Kind() != constant.Int || constant.BitLen(value) <= 53 {
		return "", false
	}
	return value.ExactString(), true
}

func lowerConstantStringByteSlice(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	if value == nil || value.Kind() != constant.String {
		return "", false
	}
	return byteSliceLiteral([]byte(constant.StringVal(value))), true
}

func lowerConstantStringLen(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	if value == nil || value.Kind() != constant.String {
		return "", false
	}
	return strconv.Itoa(len([]byte(constant.StringVal(value)))), true
}

func goEmbedPatterns(groups ...*ast.CommentGroup) []string {
	var patterns []string
	for _, group := range groups {
		if group == nil {
			continue
		}
		for _, comment := range group.List {
			text := strings.TrimSpace(comment.Text)
			if after, ok := strings.CutPrefix(text, "//"); ok {
				text = strings.TrimSpace(after)
			}
			if after, ok := strings.CutPrefix(text, "/*"); ok {
				text = strings.TrimSpace(strings.TrimSuffix(after, "*/"))
			}
			if !strings.HasPrefix(text, "go:embed") {
				continue
			}
			patterns = append(patterns, strings.Fields(strings.TrimSpace(strings.TrimPrefix(text, "go:embed")))...)
		}
	}
	return patterns
}

func (o *LoweringOwner) lowerGoEmbedValue(
	ctx lowerFileContext,
	diagPos token.Pos,
	typ types.Type,
	patterns []string,
) (string, []Diagnostic) {
	if isEmbedFSType(typ) {
		return o.lowerGoEmbedFSValue(ctx, diagPos, patterns)
	}
	if len(patterns) != 1 {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern list")}
	}
	cleanPattern, diagnostics := cleanGoEmbedFilePattern(ctx, diagPos, patterns[0])
	if len(diagnostics) != 0 {
		return "", diagnostics
	}
	data, diagnostics := readGoEmbedFile(ctx, cleanPattern)
	if len(diagnostics) != 0 {
		return "", diagnostics
	}
	if isStringType(typ) {
		return lowerGoStringLiteral(string(data)), nil
	}
	if slice, ok := types.Unalias(typ).Underlying().(*types.Slice); ok && isByteType(slice.Elem()) {
		return o.embeddedBytesLiteral(data), nil
	}
	diag := loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed target type")
	diag.Detail = "target type: " + types.TypeString(typ, func(pkg *types.Package) string {
		if pkg == nil {
			return ""
		}
		return pkg.Path()
	})
	return "", []Diagnostic{diag}
}

func (o *LoweringOwner) lowerGoEmbedFSValue(ctx lowerFileContext, diagPos token.Pos, patterns []string) (string, []Diagnostic) {
	embedAlias := ctx.importPaths["embed"]
	if embedAlias == "" {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed FS import")}
	}
	if len(patterns) == 0 {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern list")}
	}

	filesByPath := make(map[string][]byte)
	for _, pattern := range patterns {
		files, diagnostics := expandGoEmbedPattern(ctx, diagPos, pattern)
		if len(diagnostics) != 0 {
			return "", diagnostics
		}
		for _, file := range files {
			filesByPath[file.path] = file.data
		}
	}
	paths := make([]string, 0, len(filesByPath))
	for path := range filesByPath {
		paths = append(paths, path)
	}
	slices.Sort(paths)

	// Each file is inline, or external as the policy selects (see
	// [ExternalEmbedPolicy]), and listed after the inline files.
	entries := make([]string, 0, len(paths))
	var external []string
	for _, path := range paths {
		file := goEmbedFile{path: path, data: filesByPath[path]}
		if ctx.externalEmbeds.external(file) {
			external = append(external, externalEmbedEntry(file, ctx.embedAssets))
			continue
		}
		entries = append(entries, "["+lowerGoStringLiteral(path)+", "+o.embeddedBytesLiteral(file.data)+"]")
	}
	files := "new globalThis.Map<string, Uint8Array>([" + strings.Join(entries, ", ") + "])"
	if len(external) != 0 {
		files += ", [" + strings.Join(external, ", ") + "]"
	}
	builtinAlias := o.runtimeOwner.BuiltinImport().Alias
	return builtinAlias + ".markAsStructValue(new " + embedAlias + ".FS(" + files + "))", nil
}

type goEmbedFile struct {
	path string
	data []byte
}

var errGoEmbedRead = errors.New("go:embed file read failed")

func cleanGoEmbedFilePattern(ctx lowerFileContext, diagPos token.Pos, pattern string) (string, []Diagnostic) {
	cleanPattern, _, diagnostics := cleanGoEmbedPattern(ctx, diagPos, pattern)
	if len(diagnostics) != 0 {
		return "", diagnostics
	}
	if strings.Contains(cleanPattern, "*") {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern")}
	}
	info, err := os.Stat(filepath.Join(filepath.Dir(ctx.sourcePath), filepath.FromSlash(cleanPattern)))
	if err != nil {
		return "", []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	if info.IsDir() {
		return "", []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed directory target")}
	}
	return cleanPattern, nil
}

func cleanGoEmbedPattern(ctx lowerFileContext, diagPos token.Pos, pattern string) (string, bool, []Diagnostic) {
	pattern = strings.Trim(pattern, "`\"")
	all := false
	if strings.HasPrefix(pattern, "all:") {
		all = true
		pattern = strings.TrimPrefix(pattern, "all:")
	}
	cleanPattern := path.Clean(pattern)
	if pattern == "" ||
		path.IsAbs(pattern) ||
		cleanPattern == "." ||
		cleanPattern == ".." ||
		strings.HasPrefix(cleanPattern, "../") {
		return "", false, []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern")}
	}
	return cleanPattern, all, nil
}

func expandGoEmbedPattern(ctx lowerFileContext, diagPos token.Pos, pattern string) ([]goEmbedFile, []Diagnostic) {
	cleanPattern, all, diagnostics := cleanGoEmbedPattern(ctx, diagPos, pattern)
	if len(diagnostics) != 0 {
		return nil, diagnostics
	}
	pkgDir := filepath.Dir(ctx.sourcePath)
	paths := []string{filepath.Join(pkgDir, filepath.FromSlash(cleanPattern))}
	if strings.Contains(cleanPattern, "*") {
		matches, err := filepath.Glob(filepath.Join(pkgDir, filepath.FromSlash(cleanPattern)))
		if err != nil {
			return nil, []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "unsupported go:embed pattern")}
		}
		if len(matches) == 0 {
			return nil, []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "go:embed pattern matched no files")}
		}
		paths = matches
	}

	var files []goEmbedFile
	for _, path := range paths {
		collected, diagnostics := collectGoEmbedPath(ctx, diagPos, pkgDir, path, all)
		if len(diagnostics) != 0 {
			return nil, diagnostics
		}
		files = append(files, collected...)
	}
	slices.SortFunc(files, func(a, b goEmbedFile) int {
		return cmp.Compare(a.path, b.path)
	})
	return files, nil
}

func collectGoEmbedPath(ctx lowerFileContext, diagPos token.Pos, pkgDir, absPath string, all bool) ([]goEmbedFile, []Diagnostic) {
	info, err := os.Stat(absPath)
	if err != nil {
		return nil, []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	if !info.IsDir() {
		file, diagnostics := readGoEmbedAbsFile(ctx, pkgDir, absPath)
		if len(diagnostics) != 0 {
			return nil, diagnostics
		}
		return []goEmbedFile{file}, nil
	}

	var files []goEmbedFile
	var readDiagnostics []Diagnostic
	if err := filepath.WalkDir(absPath, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path != absPath && !all && (strings.HasPrefix(entry.Name(), ".") || strings.HasPrefix(entry.Name(), "_")) {
			if entry.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if entry.IsDir() {
			return nil
		}
		file, diagnostics := readGoEmbedAbsFile(ctx, pkgDir, path)
		if len(diagnostics) != 0 {
			readDiagnostics = diagnostics
			return errGoEmbedRead
		}
		files = append(files, file)
		return nil
	}); err != nil {
		if len(readDiagnostics) != 0 {
			return nil, readDiagnostics
		}
		return nil, []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	if len(files) == 0 {
		return nil, []Diagnostic{loweringUnsupportedPos(ctx, diagPos, "declaration", ctx.semPkg.pkgPath, "go:embed directory matched no files")}
	}
	return files, nil
}

func readGoEmbedFile(ctx lowerFileContext, cleanPattern string) ([]byte, []Diagnostic) {
	file, diagnostics := readGoEmbedAbsFile(ctx, filepath.Dir(ctx.sourcePath), filepath.Join(filepath.Dir(ctx.sourcePath), filepath.FromSlash(cleanPattern)))
	if len(diagnostics) != 0 {
		return nil, diagnostics
	}
	return file.data, nil
}

func readGoEmbedAbsFile(ctx lowerFileContext, pkgDir, absPath string) (goEmbedFile, []Diagnostic) {
	relPath, err := filepath.Rel(pkgDir, absPath)
	if err != nil {
		return goEmbedFile{}, []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	data, err := os.ReadFile(absPath)
	if err != nil {
		return goEmbedFile{}, []Diagnostic{goEmbedReadDiagnostic(ctx, err)}
	}
	return goEmbedFile{path: filepath.ToSlash(relPath), data: data}, nil
}

func goEmbedReadDiagnostic(ctx lowerFileContext, err error) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/lowering:embed",
		Message:  "failed to read go:embed file",
		Detail:   ctx.semPkg.pkgPath + ": " + err.Error(),
	}
}

func isEmbedFSType(typ types.Type) bool {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false
	}
	return named.Obj().Pkg().Path() == "embed" && named.Obj().Name() == "FS"
}

// embeddedBytesLiteralMin is the length from which embedded data is written
// as base64 text instead of an array literal of its bytes.
const embeddedBytesLiteralMin = 128

// embeddedBytesLiteral returns a new Uint8Array of the bytes of an embedded
// file. Large files are decoded from text, which is about a third of the size
// of an array literal and much faster for the engine to parse: UTF-8 files
// from a string literal of their characters, which is smaller than base64 and
// compresses much better, and other files from base64.
func (o *LoweringOwner) embeddedBytesLiteral(data []byte) string {
	// Small files are array literals.
	if len(data) < embeddedBytesLiteralMin {
		return byteSliceLiteral(data)
	}

	// UTF-8 text is a string literal, unless its escapes make it longer than base64.
	encoded := base64.StdEncoding.EncodeToString(data)
	if text, ok := embeddedTextLiteral(data, len(encoded)+2); ok {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperBytesFromText) + "(" + text + ")"
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperBytesFromBase64) + "(\"" + encoded + "\")"
}

// embeddedTextLiteral returns a JavaScript string literal of the characters of
// the UTF-8 text data, whose UTF-8 encoding is data again. It reports false
// when data is not valid UTF-8 or the literal would be longer than limit.
func embeddedTextLiteral(data []byte, limit int) (string, bool) {
	// Only valid UTF-8 encodes back to the same bytes.
	if !utf8.Valid(data) {
		return "", false
	}
	var b strings.Builder
	b.Grow(len(data) + 2)
	b.WriteByte('"')

	// Each character is written as itself or an escape, while the literal fits.
	for _, r := range string(data) {
		writeTextLiteralRune(&b, r)
		if b.Len() > limit {
			return "", false
		}
	}

	// The closing quote ends the literal.
	b.WriteByte('"')
	return b.String(), b.Len() <= limit
}

// writeTextLiteralRune writes the character r into a double-quoted JavaScript
// string literal, escaping quotes, backslashes, control characters and the
// line and paragraph separators.
func writeTextLiteralRune(b *strings.Builder, r rune) {
	switch {
	case r == '"':
		b.WriteString(`\"`)
	case r == '\\':
		b.WriteString(`\\`)
	case r == '\n':
		b.WriteString(`\n`)
	case r == '\r':
		b.WriteString(`\r`)
	case r == '\t':
		b.WriteString(`\t`)
	case r < 0x20 || r == 0x7f || r == 0x2028 || r == 0x2029:
		hexDigits := strconv.FormatInt(int64(r), 16)
		b.WriteString(`\u` + strings.Repeat("0", 4-len(hexDigits)) + hexDigits)
	default:
		b.WriteRune(r)
	}
}

func byteSliceLiteral(data []byte) string {
	values := make([]string, 0, len(data))
	for _, value := range data {
		values = append(values, strconv.FormatUint(uint64(value), 10))
	}
	return "new Uint8Array([" + strings.Join(values, ", ") + "])"
}

// lowerGoStringLiteral returns the JavaScript string literal of a Go string
// constant. A Go string is represented by a JavaScript string with one
// character per UTF-8 byte, so each byte that is not printable ASCII is
// written as a \xNN escape.
func lowerGoStringLiteral(value string) string {
	// The literal has at least a character per byte, and the quotes.
	var b strings.Builder
	b.Grow(len(value) + 2)
	b.WriteByte('"')

	// Each byte is written as itself, an escape or its \xNN code.
	for i := 0; i < len(value); i++ {
		c := value[i]
		switch {
		case c == '"':
			b.WriteString(`\"`)
		case c == '\\':
			b.WriteString(`\\`)
		case c == '\n':
			b.WriteString(`\n`)
		case c == '\r':
			b.WriteString(`\r`)
		case c == '\t':
			b.WriteString(`\t`)
		case c >= 0x20 && c < 0x7f:
			b.WriteByte(c)
		default:
			b.WriteString(`\x`)
			b.WriteByte("0123456789abcdef"[c>>4])
			b.WriteByte("0123456789abcdef"[c&0xf])
		}
	}

	// The closing quote ends the literal.
	b.WriteByte('"')
	return b.String()
}

func (o *LoweringOwner) lowerTypeSpec(ctx lowerFileContext, spec *ast.TypeSpec) (loweredDecl, []Diagnostic) {
	obj, _ := ctx.semPkg.source.TypesInfo.Defs[spec.Name].(*types.TypeName)
	if obj == nil {
		return loweredDecl{}, nil
	}
	if alias, ok := obj.Type().(*types.Alias); ok {
		loweredType := o.tsTypeFor(ctx, alias.Rhs())
		if signature, ok := types.Unalias(alias.Rhs()).Underlying().(*types.Signature); ok {
			loweredType = o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
		}
		code := "type " + obj.Name() + " = " + loweredType
		typeIndexExport := ""
		if ctx.topLevel {
			code = "export " + code
			typeIndexExport = obj.Name()
		}
		return loweredDecl{code: code, typeIndexExport: typeIndexExport}, nil
	}
	named, _ := obj.Type().(*types.Named)
	if named == nil {
		return loweredDecl{}, nil
	}
	semType := ctx.model.types[named]
	if semType == nil {
		return loweredDecl{}, nil
	}
	if _, ok := named.Underlying().(*types.Struct); ok {
		lowered, diagnostics := o.lowerStructType(ctx, semType)
		return loweredDecl{structType: lowered}, diagnostics
	}
	if iface, ok := named.Underlying().(*types.Interface); ok {
		return o.lowerInterfaceType(ctx, semType, iface), nil
	}
	loweredType := o.tsTypeFor(ctx, named.Underlying())
	if signature, ok := named.Underlying().(*types.Signature); ok {
		loweredType = o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
	}
	typeName := safeIdentifier(semType.name)
	code := "type " + typeName + " = " + loweredType
	typeIndexExport := ""
	if ctx.topLevel {
		code = "export " + code
		typeIndexExport = typeName
	}
	var registrations []string
	if registration := o.lowerNamedCompositeTypeRegistration(ctx, named); registration != "" {
		registrations = append(registrations, registration)
	}
	if registration := o.lowerNamedValueTypeRegistration(ctx, named); registration != "" {
		registrations = append(registrations, registration)
	}
	if len(registrations) > 0 {
		return loweredDecl{
			code:            code + "\n\n" + strings.Join(registrations, "\n\n"),
			typeIndexExport: typeIndexExport,
			sideEffect:      true,
		}, nil
	}
	return loweredDecl{code: code, typeIndexExport: typeIndexExport}, nil
}

// lowerNamedCompositeTypeRegistration registers the runtime type information
// of a top-level, non-generic named map, slice or array type under its Go
// type string, so that code given only the type's name, such as
// encoding/json decoding a field of the type, can resolve its key and
// element types.
func (o *LoweringOwner) lowerNamedCompositeTypeRegistration(ctx lowerFileContext, named *types.Named) string {
	// A generic or local type has no single Go type string to register.
	if !ctx.topLevel || named.TypeParams().Len() != 0 {
		return ""
	}
	obj := named.Obj()
	if obj == nil || obj.Pkg() == nil || obj.Parent() != obj.Pkg().Scope() {
		return ""
	}
	switch named.Underlying().(type) {
	case *types.Map, *types.Slice, *types.Array:
	default:
		return ""
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperRegisterNamedType) + "(" +
		strconv.Quote(goRuntimeTypeString(named)) + ", " +
		o.runtimeTypeInfoExpr(named.Underlying()) + ");"
}

// registersNamedValueMethods reports whether a package-level named type is
// a non-generic, non-struct, non-interface type with methods, whose method
// sets lowerNamedValueTypeRegistration registers.
func registersNamedValueMethods(named *types.Named) bool {
	// Generic types and types without methods have no single method set.
	if named.TypeParams().Len() != 0 || named.NumMethods() == 0 {
		return false
	}

	// Only package-level types are registered by name.
	obj := named.Obj()
	if obj == nil || obj.Pkg() == nil || obj.Parent() != obj.Pkg().Scope() {
		return false
	}

	// Struct and interface types carry their methods in their own boxes.
	switch named.Underlying().(type) {
	case *types.Struct, *types.Interface:
		return false
	}
	return true
}

// lowerNamedValueTypeRegistration registers the method sets of a named type
// selected by registersNamedValueMethods and of a pointer to it, so that values
// of the type created at run time, as by reflect, box into interfaces with
// their methods.
func (o *LoweringOwner) lowerNamedValueTypeRegistration(ctx lowerFileContext, named *types.Named) string {
	if !ctx.topLevel || !registersNamedValueMethods(named) {
		return ""
	}

	// Register the value and pointer method sets that are not empty.
	var registrations []string
	for _, methodSetType := range []types.Type{named, types.NewPointer(named)} {
		if types.NewMethodSet(methodSetType).Len() == 0 {
			continue
		}
		methods := o.genericMethodDescriptorsForType(ctx, named, methodSetType, make(map[types.Type]bool))
		signatures := o.genericMethodSignatureDescriptors(methodSetType)
		if methods == "" || signatures == "" {
			continue
		}
		registrations = append(registrations,
			o.runtimeOwner.QualifiedHelper(RuntimeHelperRegisterNamedValueType)+"(\n\t"+
				strconv.Quote(goRuntimeTypeString(methodSetType))+",\n\t"+
				methods+",\n\t"+signatures+"\n);")
	}
	return strings.Join(registrations, "\n\n")
}

func (o *LoweringOwner) lowerInterfaceType(ctx lowerFileContext, semType *semanticType, iface *types.Interface) loweredDecl {
	iface.Complete()
	typeName := safeIdentifier(semType.name)
	code := "type " + typeName + " = " + o.tsInterfaceType(ctx, iface)
	typeIndexExport := ""
	if ctx.topLevel {
		code = "export " + code
		typeIndexExport = typeName
	}
	methodSignatures := o.runtimeMethodSignatures(iface)
	if ctx.trimTypeInfo {
		methodSignatures = o.runtimeTrimmedMethodSignatures(iface)
	}
	code = code + "\n\n" + o.runtimeOwner.QualifiedHelper(RuntimeHelperRegisterInterfaceType) +
		"(\n\t" + strconv.Quote(runtimeNamedTypeName(semType.named)) +
		",\n\tnull,\n\t" + methodSignatures + "\n);"
	return loweredDecl{code: code, typeIndexExport: typeIndexExport, sideEffect: true}
}

func (o *LoweringOwner) tsInterfaceType(ctx lowerFileContext, iface *types.Interface) string {
	if iface.NumMethods() == 0 {
		return "any"
	}
	methods := make([]string, 0, iface.NumMethods())
	for method := range iface.Methods() {
		methods = append(methods, o.tsMethodSignature(ctx, method))
	}
	return "{\n\t" + strings.Join(methods, "\n\t") + "\n}"
}

func (o *LoweringOwner) tsMethodSignature(ctx lowerFileContext, method *types.Func) string {
	signature, _ := method.Type().(*types.Signature)
	if signature == nil {
		return method.Name() + "(): unknown"
	}
	async := o.functionAsync(ctx, method)
	params := o.tsSignatureParamsFor(ctx, signature, async)
	if signature.Recv() != nil && len(genericReceiverTypeParams(signature.Recv().Type())) != 0 {
		hidden := "__typeArgs: $.GenericTypeArgs | undefined"
		if params == "" {
			params = hidden
		} else {
			params = hidden + ", " + params
		}
	}

	// A method that //goscript:sync marks keeps implementations that the
	// coloring made async assignable; its calls assert the result.
	if ctx.model.syncDirective(method) {
		return method.Name() + "(" + params + "): " + asyncCompatibleResultType(o.tsSignatureResultFor(ctx, signature))
	}
	return method.Name() + "(" + params + "): " +
		asyncCompatibleMethodResultType(o.tsSignatureResultFor(ctx, signature), async)
}

func (o *LoweringOwner) runtimeMethodSignatures(iface *types.Interface) string {
	return o.runtimeMethodSignaturesWithSeen(iface, make(map[types.Type]bool))
}

func (o *LoweringOwner) runtimeMethodSignaturesWithSeen(iface *types.Interface, seen map[types.Type]bool) string {
	methods := make([]string, 0, iface.NumMethods())
	for method := range iface.Methods() {
		methods = append(methods, o.runtimeMethodSignature(method, seen))
	}
	return "[" + strings.Join(methods, ", ") + "]"
}

func (o *LoweringOwner) runtimeTrimmedMethodSignatures(iface *types.Interface) string {
	return o.runtimeTrimmedMethodSignaturesWithSeen(iface, make(map[types.Type]bool))
}

func (o *LoweringOwner) runtimeTrimmedMethodSignaturesWithSeen(iface *types.Interface, seen map[types.Type]bool) string {
	methods := make([]string, 0, iface.NumMethods())
	for method := range iface.Methods() {
		methods = append(methods, o.runtimeTrimmedMethodSignature(method, seen))
	}
	return "[" + strings.Join(methods, ", ") + "]"
}

func (o *LoweringOwner) runtimeMethodAssertSignaturesWithSeen(ctx lowerFileContext, iface *types.Interface, seen map[types.Type]bool) string {
	methods := make([]string, 0, iface.NumMethods())
	for method := range iface.Methods() {
		methods = append(methods, o.runtimeMethodAssertSignature(ctx, method, seen))
	}
	return "[" + strings.Join(methods, ", ") + "]"
}

func (o *LoweringOwner) runtimeMethodSignature(method *types.Func, seen map[types.Type]bool) string {
	return o.runtimeReceiverMethodSignature(method, false, seen)
}

// runtimeReceiverMethodSignature describes a method of a type's method set.
// A method that is only in the method set of a pointer to the type, such as
// one with a pointer receiver, is marked so that the runtime can leave it
// out of the method set of a value that is not addressable, as Go does.
func (o *LoweringOwner) runtimeReceiverMethodSignature(method *types.Func, pointerOnly bool, seen map[types.Type]bool) string {
	helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperMethodSignature)
	args := []string{strconv.Quote(method.Name())}
	signature, _ := method.Type().(*types.Signature)
	variadic := signature != nil && signature.Variadic()

	// The arguments are positional, so the parameters and results are given
	// whenever a later argument is.
	flags := pointerOnly || variadic
	if signature != nil {
		if signature.Params().Len() != 0 || signature.Results().Len() != 0 || flags {
			args = append(args, o.runtimeMethodParameters(signature.Params(), seen))
		}
		if signature.Results().Len() != 0 || flags {
			args = append(args, o.runtimeMethodParameters(signature.Results(), seen))
		}
	}

	// A pointer-receiver method and a variadic method are marked.
	if flags {
		args = append(args, strconv.FormatBool(pointerOnly))
	}
	if variadic {
		args = append(args, "true")
	}
	return helper + "(" + strings.Join(args, ", ") + ")"
}

func (o *LoweringOwner) runtimeTrimmedMethodSignature(method *types.Func, seen map[types.Type]bool) string {
	return o.runtimeTrimmedReceiverMethodSignature(method, false, seen)
}

func (o *LoweringOwner) runtimeTrimmedReceiverMethodSignature(method *types.Func, pointerOnly bool, seen map[types.Type]bool) string {
	// Only a pointer-receiver method is marked, as it is not in the value's method set.
	pointerReceiver := ""
	if pointerOnly {
		pointerReceiver = ", pointerReceiver: true"
	}
	signature, _ := method.Type().(*types.Signature)
	if signature == nil {
		return "{ name: " + strconv.Quote(method.Name()) + ", args: [], returns: []" + pointerReceiver + " }"
	}
	variadic := ""
	if signature.Variadic() {
		variadic = ", variadic: true"
	}
	return "{ name: " + strconv.Quote(method.Name()) +
		", args: " + o.runtimeTrimmedMethodArgs(signature.Params()) +
		", returns: " + o.runtimeTrimmedMethodReturns(signature.Results(), seen) + pointerReceiver + variadic + " }"
}

// hasPointerReceiver reports whether method is declared with a pointer
// receiver.
func hasPointerReceiver(method *types.Func) bool {
	signature, _ := method.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return false
	}
	_, ok := types.Unalias(signature.Recv().Type()).(*types.Pointer)
	return ok
}

func (o *LoweringOwner) runtimeMethodAssertSignature(ctx lowerFileContext, method *types.Func, seen map[types.Type]bool) string {
	signature, _ := method.Type().(*types.Signature)
	if signature == nil {
		return "{ name: " + strconv.Quote(method.Name()) + ", args: [], returns: [] }"
	}
	return "{ name: " + strconv.Quote(method.Name()) +
		", args: " + o.runtimeMethodAssertArgs(ctx, signature.Params(), seen) +
		", returns: " + o.runtimeMethodAssertReturns(ctx, signature.Results(), seen) + " }"
}

func (o *LoweringOwner) runtimeMethodParameters(tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	args := make([]string, 0, tuple.Len())
	for param := range tuple.Variables() {
		value := o.runtimeTypeInfoExprWithSeen(param.Type(), seen)
		if name := param.Name(); name != "" {
			value = "[" + strconv.Quote(name) + ", " + value + "]"
		}
		args = append(args, value)
	}
	return "[" + strings.Join(args, ", ") + "]"
}

func (o *LoweringOwner) runtimeTrimmedMethodArgs(tuple *types.Tuple) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	arg := "{ type: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	args := make([]string, 0, tuple.Len())
	for range tuple.Len() {
		args = append(args, arg)
	}
	return "[" + strings.Join(args, ", ") + "]"
}

func (o *LoweringOwner) runtimeMethodAssertArgs(ctx lowerFileContext, tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	args := make([]string, 0, tuple.Len())
	for idx := range tuple.Len() {
		param := tuple.At(idx)
		name := param.Name()
		if name == "" {
			name = "_p" + strconv.Itoa(idx)
		}
		args = append(args, "{ name: "+strconv.Quote(name)+", type: "+o.runtimeTypeAssertInfoExprWithSeen(ctx, param.Type(), seen)+" }")
	}
	return "[" + strings.Join(args, ", ") + "]"
}

func (o *LoweringOwner) runtimeTrimmedMethodReturns(tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	results := make([]string, 0, tuple.Len())
	for result := range tuple.Variables() {
		results = append(results, "{ type: "+o.runtimeTypeInfoExprWithSeen(result.Type(), seen)+" }")
	}
	return "[" + strings.Join(results, ", ") + "]"
}

func (o *LoweringOwner) runtimeMethodAssertReturns(ctx lowerFileContext, tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	results := make([]string, 0, tuple.Len())
	for idx := range tuple.Len() {
		result := tuple.At(idx)
		name := result.Name()
		if name == "" {
			name = "_r" + strconv.Itoa(idx)
		}
		results = append(results, "{ name: "+strconv.Quote(name)+", type: "+o.runtimeTypeAssertInfoExprWithSeen(ctx, result.Type(), seen)+" }")
	}
	return "[" + strings.Join(results, ", ") + "]"
}

func (o *LoweringOwner) lowerStructType(ctx lowerFileContext, semType *semanticType) (*loweredStruct, []Diagnostic) {
	lowered := &loweredStruct{
		exported: ctx.topLevel,
		// Re-export every top-level named type from the package barrel, not just
		// Go-exported ones. GoScript emits all types (an unexported type still
		// becomes `export type`/`export class` in its file module), and a
		// cross-package caller must be able to spell them: an exported function
		// can take or return an unexported type, as with variadic functional
		// options (func New(opts ...option)).
		indexExported:        ctx.topLevel,
		protobufPreserveJSON: ctx.protobufTSAdapter && o.protobufTypeScriptAdapterPreserveJSON(ctx, semType, make(map[*types.Named]bool)),
		name:                 safeIdentifier(semType.name),
		typeName:             runtimeNamedTypeName(semType.named),
		cloneMethod:          "clone",
		generic:              semType.named.TypeParams().Len() != 0,
		fields:               make([]loweredStructField, 0, len(semType.fields)),
	}
	for idx, field := range semType.fields {
		structValue := isStructValueType(field.typ)
		if named := namedStructType(field.typ); named != nil && !o.canSpellNamedType(ctx, named) {
			structValue = false
		}
		fieldName := tsStructFieldName(field.name, idx)
		runtimeName := ""
		if fieldName != field.name {
			runtimeName = field.name
		}
		lowered.fields = append(lowered.fields, loweredStructField{
			name:           fieldName,
			runtimeName:    runtimeName,
			typ:            o.tsStructFieldTypeFor(ctx, field.typ),
			zero:           o.lowerZeroValueExprFor(ctx, field.typ),
			runtimeType:    o.runtimeTypeInfoExpr(field.typ),
			messageType:    protobufTypeScriptBindingMessageType(field.typ),
			doc:            field.doc,
			tag:            field.tag,
			pkgPath:        field.pkgPath,
			index:          field.index,
			offset:         field.offset,
			anonymous:      field.embedded,
			exported:       field.exported,
			structValue:    structValue,
			directClone:    structValue && o.hasGeneratedClone(namedStructType(field.typ)),
			arrayValue:     isArrayType(field.typ),
			typeParamValue: typeParamMayHoldValueType(field.typ),
			plainValue:     isPlainAssignType(field.typ),
			interfaceValue: types.IsInterface(field.typ),
		})
	}

	methodDecls := o.methodDeclsForType(ctx, semType.named)
	explicitMethods := make(map[string]bool, len(methodDecls)+len(semType.fields))
	for _, field := range semType.fields {
		explicitMethods[field.name] = true
	}
	if len(methodDecls) != 0 {
		lowered.methods = make([]loweredFunction, 0, len(methodDecls))
		for _, methodDecl := range methodDecls {
			if methodDecl != nil {
				explicitMethods[methodDecl.Name.Name] = true
			}
		}
	}
	var diagnostics []Diagnostic
	for _, methodDecl := range methodDecls {
		// An unreachable method keeps only its runtime metadata.
		if dead, ok := o.deadMethodMetadata(ctx, semType.named, methodDecl); ok {
			lowered.methods = append(lowered.methods, dead)
			continue
		}
		lowerDecl := methodDecl
		methodSourcePath := sourcePos(ctx.semPkg.source, methodDecl.Pos()).file
		if ctx.protobufTSAdapter &&
			methodSourcePath == ctx.sourcePath &&
			!protobufTypeScriptAdapterOneofBranch(semType) &&
			protobufTypeScriptBindingReplacesMethodName(methodDecl.Name.Name) &&
			(!lowered.protobufPreserveJSON || !protobufTypeScriptBindingJSONMethodName(methodDecl.Name.Name)) {
			bodyless := *methodDecl
			bodyless.Body = nil
			lowerDecl = &bodyless
		}
		method, methodDiagnostics := o.lowerFuncDecl(ctx.withDeclFile(methodDecl), lowerDecl)
		diagnostics = append(diagnostics, methodDiagnostics...)
		if method != nil {
			lowered.methods = append(lowered.methods, *method)
		}
	}
	for _, field := range semType.fields {
		methods := o.lowerEmbeddedMethodForwarders(
			ctx.withReceiverTypeParams(genericReceiverTypeParams(semType.named)),
			semType.named,
			field,
			explicitMethods,
		)
		lowered.methods = append(lowered.methods, methods...)
	}

	// Rename the generated copy method when a field, a declared method or a
	// promoted method forwarder already uses the name.
	if explicitMethods["clone"] {
		lowered.cloneMethod = "__goscriptClone"
	}
	lowered.positional = o.hasGeneratedClassShape(semType.named)
	return lowered, diagnostics
}

// deadMethodMetadata returns the metadata-only lowering of a method of a
// struct type that dead code elimination found unreachable, and whether it is.
func (o *LoweringOwner) deadMethodMetadata(ctx lowerFileContext, named *types.Named, decl *ast.FuncDecl) (loweredFunction, bool) {
	// A reachable method or one without type information is lowered.
	fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[decl.Name].(*types.Func)
	if fnObj == nil || ctx.model.methodLive(named, decl.Name.Name) {
		return loweredFunction{}, false
	}

	// The type's method list describes the method as before.
	pointerOnly := hasPointerReceiver(fnObj)
	return loweredFunction{
		metadataOnly:            true,
		name:                    methodMemberName(decl.Name.Name),
		runtimeName:             decl.Name.Name,
		runtimeSignature:        o.runtimeReceiverMethodSignature(fnObj, pointerOnly, make(map[types.Type]bool)),
		runtimeTrimmedSignature: o.runtimeTrimmedReceiverMethodSignature(fnObj, pointerOnly, make(map[types.Type]bool)),
	}, true
}

func protobufTypeScriptAdapterOneofBranch(semType *semanticType) bool {
	if semType == nil {
		return false
	}
	branch := false
	for _, field := range semType.fields {
		if strings.Contains(field.tag, "protobuf_oneof") {
			return false
		}
		if strings.Contains(field.tag, "oneof") {
			branch = true
		}
	}
	return branch
}

func (o *LoweringOwner) protobufTypeScriptAdapterPreserveJSON(
	ctx lowerFileContext,
	semType *semanticType,
	seen map[*types.Named]bool,
) bool {
	if semType == nil || semType.named == nil {
		return false
	}
	named := semType.named.Origin()
	if named == nil || seen[named] {
		return false
	}
	seen[named] = true
	for _, methodDecl := range o.methodDeclsForType(ctx, named) {
		if methodDecl == nil || !protobufTypeScriptBindingJSONMethodName(methodDecl.Name.Name) {
			continue
		}
		if sourcePos(ctx.semPkg.source, methodDecl.Pos()).file != ctx.sourcePath {
			return true
		}
	}
	for _, field := range semType.fields {
		if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, field.typ, seen) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) protobufTypeScriptAdapterTypeHasCustomJSON(
	ctx lowerFileContext,
	typ types.Type,
	seen map[*types.Named]bool,
) bool {
	if typ == nil {
		return false
	}
	if alias, ok := typ.(*types.Alias); ok {
		if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, alias.Rhs(), seen) {
			return true
		}
		if args := alias.TypeArgs(); args != nil {
			for t := range args.Types() {
				if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, t, seen) {
					return true
				}
			}
		}
		return false
	}
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if o.protobufTypeScriptAdapterNamedTypeHasCustomJSON(ctx, named) {
			return true
		}
		if obj := named.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() == ctx.semPkg.pkgPath {
			semType := ctx.model.types[named]
			if semType == nil {
				semType = ctx.model.types[named.Origin()]
			}
			if semType != nil && o.protobufTypeScriptAdapterPreserveJSON(ctx, semType, seen) {
				return true
			}
		}
		origin := named.Origin()
		if origin != nil {
			if seen[origin] {
				return false
			}
			seen[origin] = true
		}
		if args := named.TypeArgs(); args != nil {
			for t := range args.Types() {
				if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, t, seen) {
					return true
				}
			}
		}
		if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, named.Underlying(), seen) {
			return true
		}
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Pointer:
		return o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Elem(), seen)
	case *types.Slice:
		return o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Elem(), seen)
	case *types.Array:
		return o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Elem(), seen)
	case *types.Map:
		return o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Key(), seen) ||
			o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, typed.Elem(), seen)
	case *types.Struct:
		for field := range typed.Fields() {
			if o.protobufTypeScriptAdapterTypeHasCustomJSON(ctx, field.Type(), seen) {
				return true
			}
		}
	}
	return false
}

func (o *LoweringOwner) protobufTypeScriptAdapterNamedTypeHasCustomJSON(
	ctx lowerFileContext,
	named *types.Named,
) bool {
	if named == nil {
		return false
	}
	methodSet := types.NewMethodSet(types.NewPointer(named))
	for _, name := range []string{"MarshalJSON", "MarshalProtoJSON", "UnmarshalJSON", "UnmarshalProtoJSON"} {
		selection := methodSet.Lookup(nil, name)
		if selection == nil {
			continue
		}
		method, ok := selection.Obj().(*types.Func)
		if !ok {
			continue
		}
		sourcePath := sourcePos(ctx.semPkg.source, method.Pos()).file
		if sourcePath == "" || strings.HasSuffix(sourcePath, ".pb.go") {
			continue
		}
		return true
	}
	return false
}

func (o *LoweringOwner) lowerEmbeddedMethodForwarders(
	ctx lowerFileContext,
	outer *types.Named,
	field semanticField,
	explicitMethods map[string]bool,
) []loweredFunction {
	// Only an embedded field promotes methods.
	if !field.embedded {
		return nil
	}

	// Methods of a named non-struct type lower to free functions taking the
	// receiver, so its forwarders pass the field value, or a reference to the
	// field for a pointer method, instead of selecting a method on it.
	var valueReceiver *types.Named
	var valueMethodSet *types.MethodSet
	methodSetType := field.typ
	if named := namedStructType(field.typ); named != nil {
		methodSetType = types.NewPointer(field.typ)
		valueMethodSet = types.NewMethodSet(field.typ)
	} else if pointerToNamedStructType(field.typ) != nil {
		methodSetType = field.typ
	} else if _, ok := types.Unalias(field.typ).Underlying().(*types.Interface); ok {
		methodSetType = field.typ
	} else if named, ok := types.Unalias(field.typ).(*types.Named); ok {
		valueReceiver = named.Origin()
		methodSetType = types.NewPointer(field.typ)
		valueMethodSet = types.NewMethodSet(field.typ)
	} else {
		return nil
	}
	methodSet := types.NewMethodSet(methodSetType)
	if methodSet.Len() == 0 {
		return nil
	}
	var methods []loweredFunction
	for selection := range methodSet.Methods() {
		method, _ := selection.Obj().(*types.Func)
		if method == nil || explicitMethods[method.Name()] {
			continue
		}
		if !ast.IsExported(method.Name()) && method.Pkg() != nil && method.Pkg().Path() != ctx.semPkg.pkgPath {
			continue
		}
		signature, _ := method.Type().(*types.Signature)
		if signature == nil {
			continue
		}
		// A method promoted from an embedded struct value is only in the
		// method set of a pointer to the outer type when it is not in the
		// method set of the embedded value.
		pointerOnly := valueMethodSet != nil && valueMethodSet.Lookup(method.Pkg(), method.Name()) == nil
		async := o.functionAsync(ctx, method)
		lowered := loweredFunction{
			async:                   async,
			sourcePath:              ctx.sourcePath,
			name:                    methodMemberName(method.Name()),
			runtimeName:             method.Name(),
			runtimeSignature:        o.runtimeReceiverMethodSignature(method, pointerOnly, make(map[types.Type]bool)),
			runtimeTrimmedSignature: o.runtimeTrimmedReceiverMethodSignature(method, pointerOnly, make(map[types.Type]bool)),
			result:                  asyncResultType("any", async),
			deferState:              &loweredDeferState{},
		}

		// An unreachable forwarder keeps only its runtime metadata.
		if !ctx.model.methodLive(outer, method.Name()) {
			lowered.metadataOnly = true
			methods = append(methods, lowered)
			explicitMethods[method.Name()] = true
			continue
		}
		var genericArgs string
		if valueReceiver == nil {
			genericArgs = o.genericReceiverTypeArgsExpr(ctx, selection)
		}
		if strings.Contains(genericArgs, "__typeArgs") {
			lowered.params = append(lowered.params, loweredParam{
				name: "__typeArgs",
				typ:  "$.GenericTypeArgs | undefined",
			})
		}
		args := make([]string, 0, signature.Params().Len())
		for idx := range signature.Params().Len() {
			param := signature.Params().At(idx)
			name := safeParamName(param, idx)
			args = append(args, name)
			lowered.params = append(lowered.params, loweredParam{name: name, typ: "any"})
		}
		// A value method of a named non-struct type, the field's own or one
		// promoted from deeper in it, is a free function taking the receiver.
		// A pointer method of the field's own type takes a reference to the
		// field, so that it can change the field.
		receiver, target := valueReceiver, "this."+tsStructFieldName(field.name, 0)
		if receiver != nil && isPointerType(signature.Recv().Type()) {
			target = o.runtimeOwner.QualifiedHelper(RuntimeHelperFieldRef) + "(this, " + strconv.Quote(tsStructFieldName(field.name, 0)) + ")"
		}
		if receiver == nil {
			targetType := o.tsEmbeddedForwarderTargetType(ctx, field.typ)
			target = o.embeddedForwarderTargetExpr(ctx, field, selection, targetType)
			if named := methodReceiverNamedType(method); !isPointerType(signature.Recv().Type()) && namedNonInterfaceNonStructType(named) {
				receiver = named.Origin()
			}
		}
		var call string
		var body []loweredStmt
		if receiver != nil {
			callArgs := append([]string{target}, args...)
			call = o.methodFunctionExpr(ctx, receiver, method, method.Name()) + "(" + strings.Join(callArgs, ", ") + ")"
		} else {
			callArgs := args
			if genericArgs != "" {
				callArgs = append([]string{genericArgs}, callArgs...)
			}
			call = target + "." + method.Name() + "(" + strings.Join(callArgs, ", ") + ")"

			// A method that observes its receiver gets the reference to the
			// embedded field, through the prototype of its class when the
			// file can name it.
			if ref, ok := o.embeddedForwarderIdentityReceiver(ctx, field, selection, method); ok {
				if prototype, ok := o.pointerMethodPrototype(ctx, method); ok {
					call = prototype + ".call(" + strings.Join(append([]string{ref}, callArgs...), ", ") + ")"
				} else {
					body = append(body, loweredStmt{text: "const __receiver = " + ref})
					callArgs = append([]string{"__receiver"}, callArgs...)
					call = identityReceiverCallee("__receiver", method.Name()) + "(" + strings.Join(callArgs, ", ") + ")"
				}
			}
		}
		if async {
			call = "await " + call
		}
		lowered.body = append(body, loweredStmt{text: "return " + call})
		methods = append(methods, lowered)
		explicitMethods[method.Name()] = true
	}
	return methods
}

func (o *LoweringOwner) embeddedForwarderTargetExpr(
	ctx lowerFileContext,
	field semanticField,
	selection *types.Selection,
	targetType string,
) string {
	pointerValue := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue)
	expr := pointerValue + "<" + targetType + ">(this." + tsStructFieldName(field.name, 0) + ")"
	if selection == nil || len(selection.Index()) <= 1 {
		return expr
	}

	typ := field.typ
	for _, index := range selection.Index()[:len(selection.Index())-1] {
		structType, ok := types.Unalias(derefPointerType(typ)).Underlying().(*types.Struct)
		if !ok || index < 0 || index >= structType.NumFields() {
			return expr
		}
		field := structType.Field(index)
		expr += "." + tsStructFieldName(field.Name(), index)
		typ = field.Type()
		expr = o.embeddedForwarderSelectableExpr(ctx, typ, expr)
	}
	return expr
}

func (o *LoweringOwner) embeddedForwarderSelectableExpr(ctx lowerFileContext, typ types.Type, expr string) string {
	pointerValue := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue)
	if named := pointerToNamedStructType(typ); named != nil {
		return pointerValue + "<any>(" + expr + ")"
	}
	if _, ok := types.Unalias(typ).Underlying().(*types.Interface); ok {
		return pointerValue + "<any>(" + expr + ")"
	}
	return expr
}

func (o *LoweringOwner) tsEmbeddedForwarderTargetType(ctx lowerFileContext, typ types.Type) string {
	if named := pointerToNamedStructType(typ); named != nil {
		return o.namedTypeExpr(ctx, named)
	}
	if named := namedStructType(typ); named != nil {
		return o.namedTypeExpr(ctx, named)
	}
	return "Exclude<" + o.tsStructFieldTypeFor(ctx, typ) + ", null>"
}

func (o *LoweringOwner) methodDeclsForType(ctx lowerFileContext, named *types.Named) []*ast.FuncDecl {
	if named == nil {
		return nil
	}
	var methods []*ast.FuncDecl
	for _, file := range ctx.semPkg.source.Syntax {
		for _, decl := range file.Decls {
			fnDecl, ok := decl.(*ast.FuncDecl)
			if !ok || fnDecl.Recv == nil {
				continue
			}
			fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[fnDecl.Name].(*types.Func)
			if fnObj == nil {
				continue
			}
			signature, _ := fnObj.Type().(*types.Signature)
			if signature == nil || signature.Recv() == nil {
				continue
			}
			if sameNamedTypeOrigin(receiverNamedType(signature.Recv().Type()), named) {
				methods = append(methods, fnDecl)
			}
		}
	}
	slices.SortFunc(methods, func(a, b *ast.FuncDecl) int {
		return cmp.Compare(a.Name.Name, b.Name.Name)
	})
	return methods
}

func receiverNamedTypeFromDecl(ctx lowerFileContext, decl *ast.FuncDecl) *types.Named {
	if decl == nil || decl.Recv == nil {
		return nil
	}
	fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[decl.Name].(*types.Func)
	if fnObj == nil {
		return nil
	}
	signature, _ := fnObj.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return nil
	}
	return receiverNamedType(signature.Recv().Type())
}

func (o *LoweringOwner) lowerNamedReceiverMethodDecl(
	ctx lowerFileContext,
	decl *ast.FuncDecl,
	receiver *types.Named,
) (*loweredFunction, []Diagnostic) {
	fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[decl.Name].(*types.Func)
	if fnObj == nil {
		return nil, nil
	}
	signature, _ := fnObj.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return nil, nil
	}
	protobufSync := protobufGeneratedSyncDecl(ctx, decl)
	async := o.functionAsync(ctx, fnObj)
	if protobufSync {
		async = false
	}
	functionCtx := ctx.withSignature(signature)
	receiverTypeParams := genericReceiverTypeParams(signature.Recv().Type())
	if len(receiverTypeParams) != 0 {
		functionCtx = functionCtx.withReceiverTypeParams(receiverTypeParams)
	}
	resultCtx := functionCtx.withAsyncFunction(async)
	result := o.tsSignatureResultFor(resultCtx, signature)
	receiverName := "recv"
	if len(decl.Recv.List) != 0 && len(decl.Recv.List[0].Names) != 0 {
		receiverName = safeIdentifier(decl.Recv.List[0].Names[0].Name)
	}
	deferState := &loweredDeferState{}
	lowered := &loweredFunction{
		exported:      ctx.topLevel,
		indexExported: ctx.topLevel,
		async:         async,
		sourcePath:    sourcePos(ctx.semPkg.source, decl.Pos()).file,
		name:          methodFunctionName(receiver, decl.Name.Name),
		result:        asyncResultType(result, async),
		deferState:    deferState,
		params: []loweredParam{{
			name: receiverName,
			typ:  o.tsReceiverTypeFor(ctx, signature.Recv().Type()),
		}},
		namedResults: o.lowerNamedResults(functionCtx, signature),
	}
	if len(receiverTypeParams) != 0 {
		lowered.params = append(lowered.params, loweredParam{
			name: "__typeArgs",
			typ:  "$.GenericTypeArgs | undefined",
		})
	}
	if len(decl.Recv.List) != 0 && len(decl.Recv.List[0].Names) != 0 {
		receiverObj := ctx.semPkg.source.TypesInfo.Defs[decl.Recv.List[0].Names[0]]
		_, receiverPointer := signature.Recv().Type().(*types.Pointer)
		needsVarRef := !receiverPointer && receiverObj != nil && ctx.model.needsVarRef[receiverObj]
		// An array value receiver is a copy, so it is cloned when the method
		// can modify it, as callers pass their array itself.
		cloneArray := !receiverPointer && receiverObj != nil && isArrayType(receiverObj.Type()) &&
			(needsVarRef || bodyAssignsTo(ctx, decl.Body, receiverObj))
		if needsVarRef || cloneArray {
			rawName := ctx.tempName("Receiver")
			lowered.params[0].name = rawName
			value := rawName
			if cloneArray {
				value = o.runtimeOwner.QualifiedHelper(RuntimeHelperCloneArrayValue) + "(" + rawName + ", " +
					o.runtimeTypeInfoExpr(receiverObj.Type()) + ")"
			}
			if needsVarRef {
				value = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")"
			}
			lowered.paramBindings = append(lowered.paramBindings, loweredStmt{
				text: "let " + receiverName + ": " + o.tsVariableTypeFor(ctx, receiverObj.Type(), needsVarRef) + " = " + value,
			})
		}
	}
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		lowered.params, lowered.paramBindings = o.appendLoweredParam(functionCtx, lowered.params, lowered.paramBindings, param, idx, decl.Body == nil || async)
	}
	if site, ok := o.callSiteParam(ctx, fnObj); ok {
		lowered.params = append(lowered.params, site)
	}
	if flag, ok := o.borrowFlagParam(ctx, fnObj); ok {
		lowered.params = append(lowered.params, flag)
	}
	if decl.Body != nil {
		bodyCtx := functionCtx.withAsyncFunction(async).withProtobufGeneratedSyncFunction(protobufSync).withDeferState(deferState).
			withSyncDirectiveFunction(ctx.model.syncDirective(fnObj)).withCallSiteFunction(ctx.model.callSiteFunctions[fnObj])
		bodyCtx = o.withBorrowedResults(bodyCtx, decl, fnObj)
		targets, targetDecls, prelude := o.pointerTargetLocals(bodyCtx, decl, lowered.receiverAlias)
		if len(targets) != 0 {
			bodyCtx.pointerTargets = targets
			bodyCtx.pointerTargetDecls = targetDecls
		}
		body, diagnostics := o.lowerBlock(bodyCtx, decl.Body)
		lowered.body = append(prelude, body...)
		if deferState.used {
			lowered.recoverReturn = o.recoverReturnStmt(bodyCtx, signature)
			if funcBodyUsesRecover(bodyCtx, decl.Body) {
				deferState.recover = true
			}
		}
		if deferState.async && bodyCtx.syncDirectiveFunction {
			diagnostics = append(diagnostics, syncDirectiveSuspendsAt(bodyCtx, decl.Pos(), "a call it defers may suspend"))
		}
		if deferState.async && !lowered.async {
			lowered.async = true
			lowered.result = asyncResultType(o.tsSignatureResultFor(functionCtx.withAsyncFunction(true), signature), true)
		}
		return lowered, diagnostics
	}
	if zeroReturn, ok := o.lowerBodylessReturnStmt(functionCtx, signature); ok {
		lowered.body = []loweredStmt{{text: zeroReturn}}
	}
	return lowered, nil
}

// bodyAssignsTo reports whether body assigns to obj or to an element or field
// of it, as in v = x, v[i] = x, v.f++, or a range loop that assigns to them.
func bodyAssignsTo(ctx lowerFileContext, body *ast.BlockStmt, obj types.Object) bool {
	// A declaration without a body, such as an assembly stub, assigns nothing.
	if body == nil {
		return false
	}

	// Assigning through an index or a field of obj modifies obj.
	assigns := func(expr ast.Expr) bool {
		for {
			switch e := expr.(type) {
			case *ast.ParenExpr:
				expr = e.X
			case *ast.IndexExpr:
				expr = e.X
			case *ast.SelectorExpr:
				expr = e.X
			case *ast.Ident:
				return ctx.semPkg.source.TypesInfo.Uses[e] == obj
			default:
				return false
			}
		}
	}

	// Closures count too: they share the receiver with the method body. A
	// false return prunes only children, so a found result stops the walk.
	found := false
	ast.Inspect(body, func(node ast.Node) bool {
		if found {
			return false
		}
		switch n := node.(type) {
		case *ast.AssignStmt:
			found = slices.ContainsFunc(n.Lhs, assigns)
		case *ast.IncDecStmt:
			found = assigns(n.X)
		case *ast.RangeStmt:
			found = n.Tok == token.ASSIGN && (assigns(n.Key) || assigns(n.Value))
		}
		return !found
	})
	return found
}

func (o *LoweringOwner) lowerFuncDecl(ctx lowerFileContext, decl *ast.FuncDecl) (*loweredFunction, []Diagnostic) {
	fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[decl.Name].(*types.Func)
	if fnObj == nil {
		return nil, nil
	}
	signature, _ := fnObj.Type().(*types.Signature)
	if signature == nil {
		return nil, nil
	}
	protobufSync := protobufGeneratedSyncDecl(ctx, decl)
	async := o.functionAsync(ctx, fnObj)
	if protobufSync {
		async = false
	}
	if decl.Name.Name == "main" {
		async = true
	}
	functionCtx := ctx.withSignature(signature)
	var receiverTypeParams []*types.TypeParam
	if signature.Recv() != nil {
		receiverTypeParams = genericReceiverTypeParams(signature.Recv().Type())
		functionCtx = functionCtx.withReceiverTypeParams(receiverTypeParams)
	}
	resultCtx := functionCtx.withAsyncFunction(async)
	result := o.tsSignatureResultFor(resultCtx, signature)
	deferState := &loweredDeferState{}
	name := safeIdentifier(decl.Name.Name)
	blankName := decl.Name.Name == "_"
	initFunc := ctx.topLevel && decl.Name.Name == "init" && decl.Recv == nil
	if blankName {
		name = ctx.tempName("BlankFunc")
	} else if initFunc {
		name = ctx.tempName("Init")
	}
	runtimeName := ""
	if decl.Recv != nil && !blankName {
		name = methodMemberName(decl.Name.Name)
		runtimeName = decl.Name.Name
	}
	lowered := &loweredFunction{
		exported:      ctx.topLevel && !blankName && !initFunc,
		indexExported: ctx.topLevel && !blankName && !initFunc && (ast.IsExported(decl.Name.Name) || decl.Name.Name == "main"),
		init:          initFunc,
		async:         async,
		sourcePath:    sourcePos(ctx.semPkg.source, decl.Pos()).file,
		name:          name,
		runtimeName:   runtimeName,
		result:        asyncResultType(result, async),
		deferState:    deferState,
		namedResults:  o.lowerNamedResults(functionCtx, signature),
	}
	if decl.Recv != nil {
		pointerOnly := hasPointerReceiver(fnObj)
		lowered.runtimeSignature = o.runtimeReceiverMethodSignature(fnObj, pointerOnly, make(map[types.Type]bool))
		lowered.runtimeTrimmedSignature = o.runtimeTrimmedReceiverMethodSignature(fnObj, pointerOnly, make(map[types.Type]bool))
	}
	if signature.TypeParams() != nil && signature.TypeParams().Len() != 0 {
		lowered.typeParams = signatureTypeParamNames(signature)
		lowered.params = append(lowered.params, loweredParam{
			name: "__typeArgs",
			typ:  "$.GenericTypeArgs | undefined",
		})
	}
	if decl.Recv != nil && len(decl.Recv.List) != 0 && len(decl.Recv.List[0].Names) != 0 {
		o.lowerMethodReceiver(ctx, lowered, decl, signature)
	}
	if len(receiverTypeParams) != 0 {
		lowered.params = append(lowered.params, loweredParam{
			name: "__typeArgs",
			typ:  "$.GenericTypeArgs | undefined",
		})
	}
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		lowered.params, lowered.paramBindings = o.appendLoweredParam(functionCtx, lowered.params, lowered.paramBindings, param, idx, decl.Body == nil || async)
	}
	if site, ok := o.callSiteParam(ctx, fnObj); ok {
		lowered.params = append(lowered.params, site)
	}
	if flag, ok := o.borrowFlagParam(ctx, fnObj); ok {
		lowered.params = append(lowered.params, flag)
	}
	if decl.Body != nil {
		bodyCtx := functionCtx.withAsyncFunction(async).withProtobufGeneratedSyncFunction(protobufSync).withDeferState(deferState).
			withSyncDirectiveFunction(ctx.model.syncDirective(fnObj)).withCallSiteFunction(ctx.model.callSiteFunctions[fnObj])
		bodyCtx = o.withBorrowedResults(bodyCtx, decl, fnObj)
		targets, targetDecls, prelude := o.pointerTargetLocals(bodyCtx, decl, lowered.receiverAlias)
		if len(targets) != 0 {
			bodyCtx.pointerTargets = targets
			bodyCtx.pointerTargetDecls = targetDecls
		}
		body, diagnostics := o.lowerBlock(bodyCtx, decl.Body)
		lowered.body = append(prelude, body...)
		if deferState.used {
			lowered.recoverReturn = o.recoverReturnStmt(bodyCtx, signature)
			if funcBodyUsesRecover(bodyCtx, decl.Body) {
				deferState.recover = true
			}
		}
		if deferState.async && bodyCtx.syncDirectiveFunction {
			diagnostics = append(diagnostics, syncDirectiveSuspendsAt(bodyCtx, decl.Pos(), "a call it defers may suspend"))
		}
		if deferState.async && !lowered.async {
			lowered.async = true
			lowered.result = asyncResultType(o.tsSignatureResultFor(functionCtx.withAsyncFunction(true), signature), true)
		}
		return lowered, diagnostics
	}
	if linked, ok := linknameRuntimeBody(decl); ok {
		lowered.body = []loweredStmt{{text: linked}}
		return lowered, nil
	}
	if zeroReturn, ok := o.lowerBodylessReturnStmt(functionCtx, signature); ok {
		lowered.body = []loweredStmt{{text: zeroReturn}}
	}
	return lowered, nil
}

// linknameRuntimeBodies are the bodies of bodyless functions linked to
// runtime functions that GoScript implements, by linkname target.
var linknameRuntimeBodies = map[string]string{
	// runtime.rand returns random bits of the builtin ChaCha8 generator,
	// as the runtime does, for the global sources of math/rand and
	// math/rand/v2, and for hash/maphash seeds.
	"runtime.rand": "return $.runtimeRand()",
}

// linknameRuntimeBody returns the body for a bodyless function declaration
// linked by a go:linkname directive to a runtime function in
// linknameRuntimeBodies.
func linknameRuntimeBody(decl *ast.FuncDecl) (string, bool) {
	if decl.Body != nil || decl.Doc == nil {
		return "", false
	}
	for _, comment := range decl.Doc.List {
		directive, ok := strings.CutPrefix(comment.Text, "//go:linkname ")
		if !ok {
			continue
		}
		fields := strings.Fields(directive)
		if len(fields) != 2 || fields[0] != decl.Name.Name {
			continue
		}
		if body, ok := linknameRuntimeBodies[fields[1]]; ok {
			return body, true
		}
	}
	return "", false
}

// lowerMethodReceiver sets the local that binds the named receiver of the
// method decl to this: a let when the body or a closure in it assigns the
// receiver, and otherwise a const.
func (o *LoweringOwner) lowerMethodReceiver(ctx lowerFileContext, lowered *loweredFunction, decl *ast.FuncDecl, signature *types.Signature) {
	// The local is named after the receiver and set to this.
	receiverName := decl.Recv.List[0].Names[0]
	recvObj := ctx.semPkg.source.TypesInfo.Defs[receiverName]
	lowered.receiverAlias = safeIdentifier(receiverName.Name)
	lowered.receiverValue = "this"
	lowered.receiverMutable = objectAssignedInBlock(ctx, recvObj, decl.Body)

	// A pointer receiver, or a value receiver that is assigned, is typed as
	// the receiver type rather than as this, so that it can be reassigned.
	_, receiverPointer := signature.Recv().Type().(*types.Pointer)
	if receiverPointer || lowered.receiverMutable {
		lowered.receiverType = o.tsReceiverTypeFor(ctx, signature.Recv().Type())
	}

	// A receiver whose address is taken lives in a variable reference, which
	// is typed as the receiver type for the same reason. Assignments set the
	// value of the reference, so its local stays a const.
	if recvObj != nil && ctx.model.needsVarRef[recvObj] {
		lowered.receiverValue = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "<" + o.tsReceiverTypeFor(ctx, signature.Recv().Type()) + ">(this)"
		lowered.receiverType = ""
		lowered.receiverMutable = false
	}
}

// objectAssignedInBlock reports whether body, including the closures in it,
// assigns to obj itself, so that its local must be declared with let.
// Assignments to the fields or elements of obj do not rebind its local.
func objectAssignedInBlock(ctx lowerFileContext, obj types.Object, body *ast.BlockStmt) bool {
	// Nothing is assigned without an object, a body, or type information.
	if obj == nil || body == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}

	// An assignment rebinds the local only when its target is obj itself.
	info := ctx.semPkg.source.TypesInfo
	rebinds := func(expr ast.Expr) bool {
		ident, ok := ast.Unparen(expr).(*ast.Ident)
		return ok && (info.Uses[ident] == obj || info.Defs[ident] == obj)
	}

	// Closures share the local with the body, so their assignments count.
	// Once an assignment is found, the false returns prune the rest of the walk.
	assigned := false
	ast.Inspect(body, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.AssignStmt:
			assigned = assigned || slices.ContainsFunc(typed.Lhs, rebinds)
		case *ast.IncDecStmt:
			assigned = assigned || rebinds(typed.X)
		case *ast.RangeStmt:
			assigned = assigned || rebinds(typed.Key) || rebinds(typed.Value)
		}
		return !assigned
	})
	return assigned
}

func rangeBindingAssignedInBody(ctx lowerFileContext, expr ast.Expr, body *ast.BlockStmt) bool {
	ident, ok := expr.(*ast.Ident)
	if !ok || ident.Name == "_" || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	obj := ctx.semPkg.source.TypesInfo.Defs[ident]
	if obj == nil {
		obj = ctx.semPkg.source.TypesInfo.Uses[ident]
	}
	return objectAssignedInBlock(ctx, obj, body)
}

func (o *LoweringOwner) lowerMapRangeBinding(
	ctx lowerFileContext,
	expr ast.Expr,
	name string,
	fallback string,
	tempPrefix string,
	declare bool,
	body *ast.BlockStmt,
) (string, []loweredStmt, []Diagnostic) {
	if expr == nil {
		return fallback, nil, nil
	}
	if ident, ok := expr.(*ast.Ident); ok && ident.Name == "_" {
		return fallback, nil, nil
	}
	if declare {
		obj := rangeBindingObject(ctx, expr)
		if name != "" && obj != nil && !ctx.model.needsVarRef[obj] &&
			isValueCopyType(obj.Type()) && rangeValueBindingMayChange(ctx, obj, body) {
			// A map holds its own keys and values, so a struct or array
			// that the body changes is a copy.
			rawName := ctx.tempName(tempPrefix)
			return rawName, []loweredStmt{{
				text: "let " + name + " = " + o.lowerValueForTargetTypes(ctx, obj.Type(), obj.Type(), rawName, true),
			}}, nil
		}
		if name == "" || obj == nil || !ctx.model.needsVarRef[obj] {
			if name != "" {
				return name, nil, nil
			}
			return fallback, nil, nil
		}
		rawName := ctx.tempName(tempPrefix)
		value := rawName
		if isStructValueType(obj.Type()) {
			value = o.lowerStructCloneOf(obj.Type(), value)
		}
		return rawName, []loweredStmt{{
			text: "let " + name + ": " + o.tsVariableTypeFor(ctx, obj.Type(), true) + " = " +
				o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")",
		}}, nil
	}
	rawName := ctx.tempName(tempPrefix)
	left, diagnostics := o.lowerAssignmentTarget(ctx, expr, false)
	value := rawName
	if typ := ctx.semPkg.source.TypesInfo.TypeOf(expr); typ != nil && isValueCopyType(typ) {
		value = o.lowerValueForTargetTypes(ctx, typ, typ, rawName, true)
	}
	return rawName, []loweredStmt{{text: left + " = " + value}}, diagnostics
}

// isValueCopyType reports whether values of typ are structs or arrays, which
// Go copies where they are assigned.
func isValueCopyType(typ types.Type) bool {
	return isStructValueType(typ) || isArrayType(typ)
}

// rangeValueBindingMayChange reports whether the range body may change the
// struct or array variable obj or let another reference reach it: it assigns
// to it or into it, takes its address, calls a pointer method on it, or
// refers to it from a function literal.
func rangeValueBindingMayChange(ctx lowerFileContext, obj types.Object, body *ast.BlockStmt) bool {
	// A range with no body changes nothing.
	if body == nil {
		return false
	}

	// The variable is reached from a chain of selectors and indexes.
	info := ctx.semPkg.source.TypesInfo
	rootIsObj := func(expr ast.Expr) bool {
		return info.Uses[exprRootIdent(expr)] == obj
	}
	changes := false
	ast.Inspect(body, func(node ast.Node) bool {
		if changes {
			return false
		}
		switch typed := node.(type) {
		case *ast.AssignStmt:
			for _, lhs := range typed.Lhs {
				changes = changes || rootIsObj(lhs)
			}
		case *ast.IncDecStmt:
			changes = rootIsObj(typed.X)
		case *ast.RangeStmt:
			changes = (typed.Key != nil && rootIsObj(typed.Key)) || (typed.Value != nil && rootIsObj(typed.Value))
		case *ast.UnaryExpr:
			changes = typed.Op == token.AND && rootIsObj(typed.X)
		case *ast.SliceExpr:
			// Slicing an array takes its address.
			changes = rootIsObj(typed.X)
		case *ast.FuncLit:
			ast.Inspect(typed.Body, func(node ast.Node) bool {
				if ident, ok := node.(*ast.Ident); ok && info.Uses[ident] == obj {
					changes = true
				}
				return !changes
			})
		case *ast.SelectorExpr:
			if selection := info.Selections[typed]; selection != nil && selection.Kind() == types.MethodVal && rootIsObj(typed.X) {
				if signature, ok := selection.Obj().Type().(*types.Signature); ok && signature.Recv() != nil {
					_, changes = signature.Recv().Type().(*types.Pointer)
				}
			}
		}
		return !changes
	})
	return changes
}

func rangeBindingObject(ctx lowerFileContext, expr ast.Expr) types.Object {
	ident, ok := expr.(*ast.Ident)
	if !ok || ident.Name == "_" || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	if obj := ctx.semPkg.source.TypesInfo.Defs[ident]; obj != nil {
		return obj
	}
	return ctx.semPkg.source.TypesInfo.Uses[ident]
}

func expressionUsesObject(ctx lowerFileContext, expr ast.Expr, obj types.Object) bool {
	if expr == nil || obj == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	if ident, ok := ast.Unparen(expr).(*ast.Ident); ok {
		return ctx.semPkg.source.TypesInfo.Uses[ident] == obj || ctx.semPkg.source.TypesInfo.Defs[ident] == obj
	}
	uses := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if uses {
			return false
		}
		ident, ok := node.(*ast.Ident)
		if !ok {
			return true
		}
		if ctx.semPkg.source.TypesInfo.Uses[ident] == obj || ctx.semPkg.source.TypesInfo.Defs[ident] == obj {
			uses = true
			return false
		}
		return true
	})
	return uses
}

func (o *LoweringOwner) appendLoweredParam(
	ctx lowerFileContext,
	params []loweredParam,
	bindings []loweredStmt,
	param *types.Var,
	idx int,
	asyncCompatible bool,
) ([]loweredParam, []loweredStmt) {
	name := safeParamName(param, idx)
	if param == nil {
		return append(params, loweredParam{name: name, typ: "unknown"}), bindings
	}
	typ := o.tsFuncParamTypeFor(ctx, param.Type(), asyncCompatible)
	if param.Name() == "" || param.Name() == "_" || !ctx.model.needsVarRef[param] {
		return append(params, loweredParam{name: name, typ: typ}), bindings
	}
	rawName := ctx.tempName("Param")
	params = append(params, loweredParam{name: rawName, typ: typ})
	bindings = append(bindings, loweredStmt{
		text: "let " + name + ": " + o.tsVariableTypeFor(ctx, param.Type(), true) + " = " +
			o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + rawName + ")",
	})
	return params, bindings
}

func (ctx lowerFileContext) withSignature(signature *types.Signature) lowerFileContext {
	ctx.signature = signature
	ctx.borrow = nil
	if signature != nil && signature.TypeParams() != nil && signature.TypeParams().Len() != 0 {
		next := make(map[string]bool, len(ctx.typeParams)+signature.TypeParams().Len())
		maps.Copy(next, ctx.typeParams)
		nextStatic := make(map[string]bool, len(ctx.staticTypeParams)+signature.TypeParams().Len())
		maps.Copy(nextStatic, ctx.staticTypeParams)
		for typeParam := range signature.TypeParams().TypeParams() {
			next[typeParam.Obj().Name()] = true
			if signatureUsesTypeParamAsSliceElem(signature, typeParam) {
				nextStatic[typeParam.Obj().Name()] = true
			}
		}
		ctx.typeParams = next
		ctx.staticTypeParams = nextStatic
	}
	return ctx
}

func (ctx lowerFileContext) withReceiverTypeParams(params []*types.TypeParam) lowerFileContext {
	if len(params) == 0 {
		return ctx
	}
	next := make(map[string]bool, len(ctx.typeParams)+len(params))
	maps.Copy(next, ctx.typeParams)
	for _, param := range params {
		if param != nil && param.Obj() != nil {
			next[param.Obj().Name()] = true
		}
	}
	ctx.typeParams = next
	return ctx
}

// withDeclFile returns ctx reading the syntax of the file that declares decl.
// A type's methods may be declared in other files of its package, and the
// syntax walks that resolve a local's declaration search the current file.
func (ctx lowerFileContext) withDeclFile(decl ast.Node) lowerFileContext {
	for _, file := range ctx.semPkg.source.Syntax {
		if file.FileStart <= decl.Pos() && decl.Pos() < file.FileEnd {
			ctx.file = file
			ctx.tokenFile = ctx.semPkg.source.Fset.File(file.Pos())
			return ctx
		}
	}
	return ctx
}

func (ctx lowerFileContext) withAsyncFunction(async bool) lowerFileContext {
	ctx.asyncFunction = async
	return ctx
}

func (ctx lowerFileContext) withSyncDirectiveFunction(sync bool) lowerFileContext {
	ctx.syncDirectiveFunction = sync
	return ctx
}

func (ctx lowerFileContext) withProtobufGeneratedSyncFunction(sync bool) lowerFileContext {
	ctx.protobufGeneratedSyncFunction = sync
	return ctx
}

func (ctx lowerFileContext) withFunctionTypeDepth(depth int) lowerFileContext {
	ctx.functionTypeDepth = depth
	return ctx
}

func (ctx lowerFileContext) withDeferState(deferState *loweredDeferState) lowerFileContext {
	ctx.deferState = deferState
	return ctx
}

func (ctx lowerFileContext) withLocalScope() lowerFileContext {
	ctx.topLevel = false
	ctx.functionScopedDecls = false
	return ctx
}

func (ctx lowerFileContext) withFunctionScopedDecls() lowerFileContext {
	ctx.functionScopedDecls = true
	return ctx
}

func declarationKeyword(ctx lowerFileContext) string {
	if ctx.functionScopedDecls {
		return "var "
	}
	return "let "
}

func (ctx lowerFileContext) withRangeBranch(branch *loweredRangeBranch) lowerFileContext {
	ctx.rangeBranch = branch
	ctx.rangeBreak = true
	ctx.rangeContinue = true
	return ctx
}

func (ctx lowerFileContext) withoutRangeBranch() lowerFileContext {
	ctx.rangeBranch = nil
	ctx.rangeBreak = false
	ctx.rangeContinue = false
	return ctx
}

func (ctx lowerFileContext) withoutRangeLoopBranches() lowerFileContext {
	ctx.rangeBreak = false
	ctx.rangeContinue = false
	return ctx
}

func (ctx lowerFileContext) withoutRangeBreak() lowerFileContext {
	ctx.rangeBreak = false
	return ctx
}

// withGotoJumps adds jumps to the labels gotos can reach.
func (ctx lowerFileContext) withGotoJumps(jumps map[string]gotoJump) lowerFileContext {
	if len(ctx.gotoJumps) == 0 {
		ctx.gotoJumps = jumps
		return ctx
	}
	merged := make(map[string]gotoJump, len(ctx.gotoJumps)+len(jumps))
	maps.Copy(merged, ctx.gotoJumps)
	maps.Copy(merged, jumps)
	ctx.gotoJumps = merged
	return ctx
}

func (ctx lowerFileContext) withLoopLabel(label string) lowerFileContext {
	ctx.loopLabel = label
	return ctx
}

// withoutLoopLabel starts a loop body, whose unlabeled branches leave or
// continue that loop.
func (ctx lowerFileContext) withoutLoopLabel() lowerFileContext {
	ctx.loopLabel = ""
	ctx.switchBreak = false
	ctx.switchLabel = ""
	return ctx
}

// withSwitchBreak starts a switch case body, whose unlabeled break leaves the
// switch, labeled by label when a goto loop lies between them.
func (ctx lowerFileContext) withSwitchBreak(label string) lowerFileContext {
	ctx.switchBreak = true
	ctx.switchLabel = label
	return ctx
}

func (o *LoweringOwner) lowerBlock(ctx lowerFileContext, block *ast.BlockStmt) ([]loweredStmt, []Diagnostic) {
	if block == nil {
		return nil, nil
	}
	return o.lowerStmtListAfter(ctx.withLocalScope(), block.List, sourceLine(ctx, block.Lbrace))
}

func (o *LoweringOwner) lowerStmt(ctx lowerFileContext, stmt ast.Stmt) ([]loweredStmt, []Diagnostic) {
	return o.lowerStmtInto(ctx, stmt, nil)
}

func (o *LoweringOwner) lowerStmtInto(ctx lowerFileContext, stmt ast.Stmt, out []loweredStmt) ([]loweredStmt, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.DeclStmt:
		decls, diagnostics := o.lowerDecl(ctx, typed.Decl)
		stmts := make([]loweredStmt, 0, len(decls))
		for _, decl := range decls {
			if decl.code != "" {
				stmts = append(stmts, loweredStmt{text: decl.code})
				continue
			}
			if decl.structType != nil {
				var b strings.Builder
				renderStruct(&b, decl.structType, o.runtimeOwner, ctx.trimTypeInfo)
				stmts = append(stmts, loweredStmt{text: strings.TrimRight(b.String(), "\n")})
			}
		}
		return o.appendPointerTargetDecls(ctx, typed, append(out, stmts...)), diagnostics
	case *ast.BlockStmt:
		body, diagnostics := o.lowerBlock(ctx, typed)
		return append(out, loweredStmt{hasBlock: true, children: body}), diagnostics
	case *ast.AssignStmt:
		stmts, diagnostics := o.lowerAssignStmt(ctx, typed)
		return o.appendPointerTargetDecls(ctx, typed, append(out, stmts...)), diagnostics
	case *ast.SendStmt:
		text, diagnostics := o.lowerSendStmt(ctx, typed)
		return append(out, loweredStmt{text: text}), diagnostics
	case *ast.GoStmt:
		text, diagnostics := o.lowerGoStmt(ctx, typed)
		return append(out, loweredStmt{text: text}), diagnostics
	case *ast.DeferStmt:
		text, diagnostics := o.lowerDeferStmt(ctx, typed)
		return append(out, loweredStmt{text: text}), diagnostics
	case *ast.ExprStmt:
		text, diagnostics := o.lowerExpr(ctx, typed.X)
		if call, ok := typed.X.(*ast.CallExpr); ok {
			text = o.unassertedCallResult(ctx, call, text)
		}
		return append(out, loweredStmt{text: expressionStmtText(text)}), diagnostics
	case *ast.ReturnStmt:
		text, diagnostics := o.lowerReturnStmt(ctx, typed)
		return append(out, loweredStmt{text: text}), diagnostics
	case *ast.IfStmt:
		var diagnostics []Diagnostic
		var init []loweredStmt
		var initPrelude []loweredStmt
		initCtx := ctx
		scopeCtx := ctx
		if typed.Init != nil {
			if stmtCtx, nextCtx, prelude, ok := o.lowerShortDeclStatementContext(ctx, typed.Init); ok {
				initCtx = stmtCtx
				scopeCtx = nextCtx
				initPrelude = append(initPrelude, prelude...)
			}
			initStmts, initDiagnostics := o.lowerStmt(initCtx, typed.Init)
			diagnostics = append(diagnostics, initDiagnostics...)
			init = append(init, initStmts...)
		}
		cond, condDiagnostics := o.lowerExpr(scopeCtx, typed.Cond)
		diagnostics = append(diagnostics, condDiagnostics...)
		body, bodyDiagnostics := o.lowerBlock(scopeCtx, typed.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		stmt := loweredStmt{
			hasBlock: true,
			text:     "if (" + cond + ")",
			children: body,
		}
		if typed.Else != nil {
			elseBody, elseDiagnostics := o.lowerElse(scopeCtx, typed.Else)
			diagnostics = append(diagnostics, elseDiagnostics...)
			stmt.elseBody = elseBody
		}
		if len(init) != 0 {
			init = append(init, stmt)
			initPrelude = append(initPrelude, loweredStmt{children: init})
			return append(out, initPrelude...), diagnostics
		}
		return append(out, stmt), diagnostics
	case *ast.ForStmt:
		lowered, diagnostics := o.lowerForStmt(ctx, typed)
		return append(out, lowered), diagnostics
	case *ast.RangeStmt:
		lowered, diagnostics := o.lowerRangeStmt(ctx, typed)
		return append(out, lowered), diagnostics
	case *ast.SelectStmt:
		lowered, diagnostics := o.lowerSelectStmt(ctx, typed)
		return append(out, loweredStmt{selectStmt: lowered}), diagnostics
	case *ast.SwitchStmt:
		stmts, diagnostics := o.lowerSwitchStmt(ctx, typed)
		return append(out, stmts...), diagnostics
	case *ast.TypeSwitchStmt:
		stmts, diagnostics := o.lowerTypeSwitchStmt(ctx, typed)
		return append(out, stmts...), diagnostics
	case *ast.LabeledStmt:
		// Preserve lexical labels without sharing mutations between nested scopes.
		labels := make(map[string]ast.Stmt, len(ctx.rangeLabels)+1)
		maps.Copy(labels, ctx.rangeLabels)
		labels[typed.Label.Name] = typed.Stmt
		ctx.rangeLabels = labels

		lowered, diagnostics := o.lowerStmt(ctx, typed.Stmt)
		if len(lowered) != 0 {
			label := safeIdentifier(typed.Label.Name)
			if lowered[0].text == "" {
				return append(out, loweredStmt{text: label + ":", children: lowered}), diagnostics
			}
			if labeledTextCannotPrefix(lowered[0].text) {
				out = append(out, loweredStmt{text: label + ":;"})
				return append(out, lowered...), diagnostics
			}
			lowered[0].text = label + ": " + lowered[0].text
		}
		return append(out, lowered...), diagnostics
	case *ast.IncDecStmt:
		// A bigint-backed operand (int64/uint64) needs a bigint step literal so
		// the generated +/- does not mix bigint and number.
		oneLiteral := "1"
		if isBigIntBackedType(ctx.semPkg.source.TypesInfo.TypeOf(typed.X)) {
			oneLiteral = "1n"
		}
		if index, ok := unwrapParenExpr(typed.X).(*ast.IndexExpr); ok && isMapType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)) {
			tok := token.ADD_ASSIGN
			if typed.Tok == token.DEC {
				tok = token.SUB_ASSIGN
			}
			stmts, diagnostics := o.lowerMapIndexUpdateStmts(ctx, index, tok, oneLiteral, ctx.semPkg.source.TypesInfo.TypeOf(typed.X), false)
			return append(out, stmts...), diagnostics
		}
		if setter, ok := o.packageVarSetterForAssignment(ctx, typed.X); ok {
			expr, diagnostics := o.lowerExpr(ctx, typed.X)
			op := "+"
			if typed.Tok == token.DEC {
				op = "-"
			}
			return append(out, loweredStmt{text: setter + "(" + expr + " " + op + " " + oneLiteral + ")"}), diagnostics
		}
		op := token.ADD
		if typed.Tok == token.DEC {
			op = token.SUB
		}

		// A narrow integer wraps and a float32 rounds, also an element of a
		// slice held in an array rather than a typed array, reading the
		// target twice, so the operands of the target are evaluated once
		// first.
		targetType := ctx.semPkg.source.TypesInfo.TypeOf(typed.X)
		if _, ok := incDecStepValue(targetType, "x", op); ok {
			targetCtx, prelude, diagnostics := o.stableCompoundTarget(ctx, typed.X)
			expr, exprDiagnostics := o.lowerIncDecTarget(targetCtx, typed.X)
			value, _ := incDecStepValue(targetType, expr+" "+op.String()+" 1", op)
			out = append(append(out, prelude...), loweredStmt{text: expr + " = " + value})
			return out, append(diagnostics, exprDiagnostics...)
		}

		// Other pointer and element targets step in place.
		if _, ok := unwrapParenExpr(typed.X).(*ast.StarExpr); ok {
			expr, diagnostics := o.lowerIncDecTarget(ctx, typed.X)
			return append(out, loweredStmt{text: expr + typed.Tok.String()}), diagnostics
		}
		if _, ok := unwrapParenExpr(typed.X).(*ast.IndexExpr); ok {
			expr, diagnostics := o.lowerIncDecTarget(ctx, typed.X)
			return append(out, loweredStmt{text: expr + typed.Tok.String()}), diagnostics
		}

		// Any other operand steps in place.
		expr, diagnostics := o.lowerExpr(ctx, typed.X)
		return append(out, loweredStmt{text: expr + typed.Tok.String()}), diagnostics
	case *ast.BranchStmt:
		if typed.Label != nil {
			switch typed.Tok {
			case token.BREAK, token.CONTINUE:
				// A label outside this yield must resume after its iterator call.
				if ctx.rangeBranch != nil && ctx.rangeLabels[typed.Label.Name] == nil {
					if ctx.rangeBranch.branchFlag == "" {
						ctx.rangeBranch.branchFlag = ctx.tempName("RangeBranch")
					}
					ctx.rangeBranch.branches = append(ctx.rangeBranch.branches, loweredRangeLabeledBranch{tok: typed.Tok, label: typed.Label.Name})
					return append(out, loweredStmt{text: ctx.rangeBranch.branchFlag + " = " + strconv.Itoa(len(ctx.rangeBranch.branches)) + "\nreturn false"}), nil
				}

				// A branch to this iterator completes or advances its current yield.
				if ctx.rangeBranch != nil && ctx.rangeLabels[typed.Label.Name] == ctx.rangeLoop {
					return append(out, loweredStmt{text: "return " + strconv.FormatBool(typed.Tok == token.CONTINUE)}), nil
				}

				// Other local labels remain reachable in the current callback.
				return append(out, loweredStmt{text: typed.Tok.String() + " " + safeIdentifier(typed.Label.Name)}), nil
			case token.GOTO:
				label := safeIdentifier(typed.Label.Name)
				if jump, ok := ctx.gotoJumps[label]; ok {
					return jump.appendTo(out), nil
				}
				return out, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported goto branch to "+label)}
			default:
				return out, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported labeled branch")}
			}
		}
		switch typed.Tok {
		case token.BREAK, token.CONTINUE:
			if typed.Tok == token.BREAK && ctx.switchBreak && ctx.switchLabel != "" {
				return append(out, loweredStmt{text: "break " + ctx.switchLabel}), nil
			}
			if typed.Tok == token.BREAK && ctx.loopLabel != "" && !ctx.switchBreak {
				return append(out, loweredStmt{text: "break " + ctx.loopLabel}), nil
			}
			if typed.Tok == token.CONTINUE && ctx.loopLabel != "" {
				return append(out, loweredStmt{text: "continue " + ctx.loopLabel}), nil
			}
			if typed.Tok == token.BREAK && ctx.rangeBranch != nil && ctx.rangeBreak {
				return append(out, loweredStmt{text: "return false"}), nil
			}
			if typed.Tok == token.CONTINUE && ctx.rangeBranch != nil && ctx.rangeContinue {
				return append(out, loweredStmt{text: "return true"}), nil
			}
			return append(out, loweredStmt{text: typed.Tok.String()}), nil
		case token.FALLTHROUGH:
			return append(out, loweredStmt{text: "fallthrough"}), nil
		default:
			return out, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported branch")}
		}
	case *ast.EmptyStmt:
		return out, nil
	default:
		return out, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported statement kind")}
	}
}

// unassertedCallResult removes the assertion of a call's result to its Go
// type from lowered, for a call whose result is unused.
func (o *LoweringOwner) unassertedCallResult(ctx lowerFileContext, call *ast.CallExpr, lowered string) string {
	// Only an assertion to the call's result type is removed.
	signature := signatureForType(ctx.semPkg.source.TypesInfo.TypeOf(call.Fun))
	if signature == nil || signature.Results().Len() == 0 {
		return lowered
	}
	suffix := " as " + o.tsSignatureResultFor(ctx, signature) + ")"
	if !strings.HasPrefix(lowered, "(") || !strings.HasSuffix(lowered, suffix) {
		return lowered
	}

	// The opening parenthesis must close at the end.
	depth := 0
	for idx, char := range lowered {
		switch char {
		case '(':
			depth++
		case ')':
			depth--
		}
		if depth == 0 && idx != len(lowered)-1 {
			return lowered
		}
	}
	return lowered[1 : len(lowered)-len(suffix)]
}

func expressionStmtText(text string) string {
	trimmed := strings.TrimLeft(text, " \t")
	if strings.HasPrefix(trimmed, "(") || strings.HasPrefix(trimmed, "[") {
		return "void " + text
	}
	return text
}

func packageVarSetterName(name string) string {
	return "__goscript_set_" + safeIdentifier(name)
}

func packageVarGetterName(name string) string {
	return "__goscript_get_" + safeIdentifier(name)
}

func packageVarInitName(name string) string {
	return "__goscript_init_" + safeIdentifier(name)
}

func (o *LoweringOwner) lowerElse(ctx lowerFileContext, stmt ast.Stmt) ([]loweredStmt, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.BlockStmt:
		return o.lowerBlock(ctx, typed)
	case *ast.IfStmt:
		return o.lowerStmt(ctx, typed)
	default:
		return nil, []Diagnostic{loweringUnsupportedAt(ctx, typed, "statement", ctx.semPkg.pkgPath, "unsupported else statement")}
	}
}

func (o *LoweringOwner) lowerStmtList(ctx lowerFileContext, stmts []ast.Stmt) ([]loweredStmt, []Diagnostic) {
	return o.lowerStmtListAfter(ctx, stmts, 0)
}

// lowerStmtListAfter lowers statements while preserving source gaps and goto scopes.
func (o *LoweringOwner) lowerStmtListAfter(
	ctx lowerFileContext,
	stmts []ast.Stmt,
	prevEndLine int,
) ([]loweredStmt, []Diagnostic) {
	// A list without gotos spares the lists nested in it their search.
	lowered := make([]loweredStmt, 0, len(stmts))
	var diagnostics []Diagnostic
	hasGoto := !ctx.noGoto && stmtListHasGoto(stmts)
	ctx.noGoto = !hasGoto

	// Gotos that labeled blocks and loops cannot all reach run in a state
	// machine from the first statement that they involve.
	if hasGoto && !gotoShapesReach(stmts) {
		start := gotoDispatchStart(stmts)
		for _, stmt := range stmts[:start] {
			var stmtDiagnostics []Diagnostic
			lowered, ctx, prevEndLine, stmtDiagnostics = o.lowerListStmt(ctx, stmt, lowered, prevEndLine)
			diagnostics = append(diagnostics, stmtDiagnostics...)
		}
		dispatch, dispatchDiagnostics := o.lowerGotoDispatch(ctx, stmts[start:], prevEndLine)
		return append(lowered, dispatch...), append(diagnostics, dispatchDiagnostics...)
	}

	// Labels of backward gotos start loops, and those of forward gotos end
	// blocks.
	var gotoSpans map[string]int
	var forwardSpans map[string]forwardGotoLabelSpan
	if hasGoto {
		gotoSpans = backwardGotoLabelSpans(stmts)
		forwardSpans = forwardGotoLabelSpans(stmts, gotoSpans)
	}
	for idx := 0; idx < len(stmts); idx++ {
		stmt := stmts[idx]
		if hasGoto {
			// A goto into a backward loop past its first statement skips that
			// statement on the first pass.
			leading := leadingStmtLines(ctx, prevEndLine, sourceLine(ctx, stmt.Pos()))
			if span, ok := leadingGotoBackwardLoopSpan(stmts, idx, gotoSpans); ok {
				loop, loopDiagnostics := o.lowerBackwardGotoLoop(
					ctx,
					span.label,
					span.labelIdx,
					span.endIdx,
					span.forwardLabel,
					stmts,
					leading,
				)
				diagnostics = append(diagnostics, loopDiagnostics...)
				lowered = append(lowered, loop...)
				if endLine := sourceLine(ctx, stmts[span.endIdx].End()); endLine != 0 {
					prevEndLine = endLine
				}
				idx = span.endIdx
				continue
			}

			// Forward gotos break out of the blocks that end at their labels.
			if group, ok := forwardGotoLabelGroupAt(idx, forwardSpans); ok {
				groupLowered, groupDiagnostics := o.lowerForwardGotoLabelGroup(
					ctx,
					stmts,
					group,
					prevEndLine,
					leading,
				)
				diagnostics = append(diagnostics, groupDiagnostics...)
				lowered = append(lowered, groupLowered...)
				if labeled, ok := stmts[group.labelIdx].(*ast.LabeledStmt); ok {
					labelLowered, labelDiagnostics := o.lowerStmt(ctx, labeled.Stmt)
					diagnostics = append(diagnostics, labelDiagnostics...)
					lowered = append(lowered, labelLowered...)
					if endLine := sourceLine(ctx, labeled.End()); endLine != 0 {
						prevEndLine = endLine
					}
				}
				idx = group.labelIdx
				continue
			}

			// Backward gotos continue the loop that starts at their label.
			if labeled, ok := stmt.(*ast.LabeledStmt); ok {
				label := safeIdentifier(labeled.Label.Name)
				if endIdx, ok := gotoSpans[label]; ok {
					loop, loopDiagnostics := o.lowerBackwardGotoLoop(
						ctx,
						label,
						idx,
						endIdx,
						"",
						stmts,
						leading,
					)
					diagnostics = append(diagnostics, loopDiagnostics...)
					lowered = append(lowered, loop...)
					if endLine := sourceLine(ctx, stmts[endIdx].End()); endLine != 0 {
						prevEndLine = endLine
					}
					idx = endIdx
					continue
				}
			}
		}

		// Any other statement lowers by itself.
		var stmtDiagnostics []Diagnostic
		lowered, ctx, prevEndLine, stmtDiagnostics = o.lowerListStmt(ctx, stmt, lowered, prevEndLine)
		diagnostics = append(diagnostics, stmtDiagnostics...)
	}
	return lowered, diagnostics
}

// lowerListStmt appends one statement of a list to lowered, after the source
// lines that separate it from the previous one, and returns the context of
// the statements that follow it and the line it ends on.
func (o *LoweringOwner) lowerListStmt(
	ctx lowerFileContext,
	stmt ast.Stmt,
	lowered []loweredStmt,
	prevEndLine int,
) ([]loweredStmt, lowerFileContext, int, []Diagnostic) {
	// The statement keeps the blank lines and comments before it.
	leading := leadingStmtLines(ctx, prevEndLine, sourceLine(ctx, stmt.Pos()))
	if endLine := sourceLine(ctx, stmt.End()); endLine != 0 {
		prevEndLine = endLine
	}

	// A declaration that shadows names it uses renames its variables for the
	// statements that follow it.
	if stmtCtx, nextCtx, ok := o.lowerDeclStatementContext(ctx, stmt); ok {
		start := len(lowered)
		lowered, diagnostics := o.lowerStmtInto(stmtCtx, stmt, lowered)
		if len(lowered) > start && len(leading) != 0 {
			lowered[start].leading = append(leading, lowered[start].leading...)
		}
		return lowered, nextCtx, prevEndLine, diagnostics
	}

	// So does a short variable declaration, which saves the outer values it
	// reads first.
	if stmtCtx, nextCtx, prelude, ok := o.lowerShortDeclStatementContext(ctx, stmt); ok {
		stmtLowered, diagnostics := o.lowerStmt(stmtCtx, stmt)
		if len(prelude) != 0 {
			if len(leading) != 0 {
				prelude[0].leading = append(leading, prelude[0].leading...)
			}
			lowered = append(lowered, prelude...)
		} else if len(stmtLowered) != 0 && len(leading) != 0 {
			stmtLowered[0].leading = append(leading, stmtLowered[0].leading...)
		}
		return append(lowered, stmtLowered...), nextCtx, prevEndLine, diagnostics
	}

	// Any other statement lowers in the current context.
	start := len(lowered)
	lowered, diagnostics := o.lowerStmtInto(ctx, stmt, lowered)
	if len(lowered) > start && len(leading) != 0 {
		lowered[start].leading = append(leading, lowered[start].leading...)
	}
	return lowered, ctx, prevEndLine, diagnostics
}

func (o *LoweringOwner) lowerDeclStatementContext(
	ctx lowerFileContext,
	stmt ast.Stmt,
) (lowerFileContext, lowerFileContext, bool) {
	declStmt, ok := stmt.(*ast.DeclStmt)
	if !ok {
		return ctx, ctx, false
	}
	genDecl, ok := declStmt.Decl.(*ast.GenDecl)
	if !ok || genDecl.Tok != token.VAR {
		return ctx, ctx, false
	}
	aliases := make(map[types.Object]string)
	for _, spec := range genDecl.Specs {
		valueSpec, ok := spec.(*ast.ValueSpec)
		if !ok {
			continue
		}
		for _, name := range valueSpec.Names {
			if name.Name == "_" {
				continue
			}
			def := ctx.semPkg.source.TypesInfo.Defs[name]
			if def == nil || aliases[def] != "" {
				continue
			}
			if shortDeclDefShadowsOuterName(ctx, name.Name, def) || valueSpecUsesOuterName(ctx, valueSpec, name.Name, def) {
				aliases[def] = ctx.tempName("Shadow")
			}
		}
	}
	if len(aliases) == 0 {
		return ctx, ctx, false
	}
	nextCtx := ctx.withIdentRefAliases(aliases)
	return nextCtx, nextCtx, true
}

func (o *LoweringOwner) lowerShortDeclStatementContext(
	ctx lowerFileContext,
	stmt ast.Stmt,
) (lowerFileContext, lowerFileContext, []loweredStmt, bool) {
	assign, ok := stmt.(*ast.AssignStmt)
	if !ok || assign.Tok != token.DEFINE {
		return ctx, ctx, nil, false
	}
	oldAliases, newAliases, prelude := o.lowerShortDeclShadowAliases(ctx, assign)
	if len(oldAliases) == 0 && len(newAliases) == 0 {
		return ctx, ctx, nil, false
	}
	stmtCtx := ctx.withIdentAliases(oldAliases).withIdentRefAliases(newAliases)
	return stmtCtx, ctx.withIdentRefAliases(newAliases), prelude, true
}

func (o *LoweringOwner) lowerBackwardGotoLoop(
	ctx lowerFileContext,
	label string,
	labelIdx int,
	endIdx int,
	initialForwardLabel string,
	stmts []ast.Stmt,
	leading []string,
) ([]loweredStmt, []Diagnostic) {
	// The gotos to the label of the loop continue it.
	labeled, ok := stmts[labelIdx].(*ast.LabeledStmt)
	if !ok {
		return nil, nil
	}
	var lowered []loweredStmt
	var body []loweredStmt
	var diagnostics []Diagnostic
	bodyCtx := ctx.withGotoJumps(map[string]gotoJump{label: {branch: "continue " + label}}).withFunctionScopedDecls()

	// A leading goto past the first statement skips it on the first pass.
	if initialForwardLabel != "" {
		skipVar := ctx.tempName("Skip")
		init := loweredStmt{text: "let " + skipVar + " = true"}
		if len(leading) != 0 {
			init.leading = append(leading, init.leading...)
		}
		lowered = append(lowered, init)
		first, firstDiagnostics := o.lowerStmt(bodyCtx, labeled.Stmt)
		diagnostics = append(diagnostics, firstDiagnostics...)
		body = append(body, loweredStmt{hasBlock: true, text: "if (!" + skipVar + ")", children: first})
		body = append(body, loweredStmt{text: skipVar + " = false"})
	} else {
		first, firstDiagnostics := o.lowerStmt(bodyCtx, labeled.Stmt)
		diagnostics = append(diagnostics, firstDiagnostics...)
		body = append(body, first...)
	}

	// The loop runs the rest of its statements once, unless a goto continues
	// it.
	rest, restDiagnostics := o.lowerStmtListAfter(
		bodyCtx,
		stmts[labelIdx+1:endIdx+1],
		sourceLine(ctx, labeled.Label.End()),
	)
	diagnostics = append(diagnostics, restDiagnostics...)
	body = append(body, rest...)
	body = append(body, loweredStmt{text: "break"})
	loop := loweredStmt{hasBlock: true, text: label + ": while (true)", children: body}
	if initialForwardLabel == "" && len(leading) != 0 {
		loop.leading = append(leading, loop.leading...)
	}
	lowered = append(lowered, loop)
	return lowered, diagnostics
}

type forwardGotoLabelSpan struct {
	label    string
	start    int
	labelIdx int
}

type forwardGotoLabelGroup struct {
	start         int
	labelIdx      int
	spans         []forwardGotoLabelSpan
	forwardLabels map[string]bool
}

func forwardGotoLabelGroupAt(start int, spans map[string]forwardGotoLabelSpan) (forwardGotoLabelGroup, bool) {
	var included map[string]bool
	group := forwardGotoLabelGroup{start: start, labelIdx: -1}
	for label, span := range spans {
		if span.start != start {
			continue
		}
		if included == nil {
			included = make(map[string]bool)
			group.forwardLabels = make(map[string]bool)
		}
		included[label] = true
		group.spans = append(group.spans, span)
		group.forwardLabels[label] = true
		if span.labelIdx > group.labelIdx {
			group.labelIdx = span.labelIdx
		}
	}
	if len(group.spans) == 0 {
		return forwardGotoLabelGroup{}, false
	}

	for {
		changed := false
		for label, span := range spans {
			if included[label] || span.start < start || span.start >= group.labelIdx {
				continue
			}
			included[label] = true
			group.spans = append(group.spans, span)
			group.forwardLabels[label] = true
			if span.labelIdx > group.labelIdx {
				group.labelIdx = span.labelIdx
			}
			changed = true
		}
		if !changed {
			break
		}
	}

	slices.SortFunc(group.spans, func(a, b forwardGotoLabelSpan) int {
		if n := cmp.Compare(a.labelIdx, b.labelIdx); n != 0 {
			return n
		}
		return cmp.Compare(a.label, b.label)
	})
	return group, true
}

func (o *LoweringOwner) lowerForwardGotoLabelGroup(
	ctx lowerFileContext,
	stmts []ast.Stmt,
	group forwardGotoLabelGroup,
	prevEndLine int,
	leading []string,
) ([]loweredStmt, []Diagnostic) {
	jumps := make(map[string]gotoJump, len(group.forwardLabels))
	for label := range group.forwardLabels {
		jumps[label] = gotoJump{branch: "break " + label}
	}
	forwardCtx := ctx.withGotoJumps(jumps)
	first := group.spans[0]
	body, diagnostics := o.lowerStmtListAfter(forwardCtx, stmts[group.start:first.labelIdx], prevEndLine)
	block := loweredStmt{hasBlock: true, text: first.label + ":", children: body}

	for idx := 1; idx < len(group.spans); idx++ {
		prev := group.spans[idx-1]
		next := group.spans[idx]
		children := []loweredStmt{block}
		if labeled, ok := stmts[prev.labelIdx].(*ast.LabeledStmt); ok {
			segment := make([]ast.Stmt, 0, next.labelIdx-prev.labelIdx)
			segment = append(segment, labeled.Stmt)
			segment = append(segment, stmts[prev.labelIdx+1:next.labelIdx]...)
			segmentLowered, segmentDiagnostics := o.lowerStmtListAfter(
				forwardCtx,
				segment,
				sourceLine(ctx, labeled.Label.End()),
			)
			diagnostics = append(diagnostics, segmentDiagnostics...)
			children = append(children, segmentLowered...)
		}
		block = loweredStmt{hasBlock: true, text: next.label + ":", children: children}
	}

	if len(leading) != 0 {
		block.leading = append(leading, block.leading...)
	}
	return []loweredStmt{block}, diagnostics
}

type leadingGotoBackwardLoop struct {
	label        string
	labelIdx     int
	endIdx       int
	forwardLabel string
}

func stmtListHasGoto(stmts []ast.Stmt) bool {
	for _, stmt := range stmts {
		hasGoto := false
		ast.Inspect(stmt, func(node ast.Node) bool {
			branch, ok := node.(*ast.BranchStmt)
			if ok && branch.Tok == token.GOTO && branch.Label != nil {
				hasGoto = true
				return false
			}
			return !hasGoto
		})
		if hasGoto {
			return true
		}
	}
	return false
}

func backwardGotoLabelSpans(stmts []ast.Stmt) map[string]int {
	seenLabels := make(map[string]bool)
	spans := make(map[string]int)
	for idx, stmt := range stmts {
		if labeled, ok := stmt.(*ast.LabeledStmt); ok {
			seenLabels[safeIdentifier(labeled.Label.Name)] = true
		}
		ast.Inspect(stmt, func(node ast.Node) bool {
			branch, ok := node.(*ast.BranchStmt)
			if !ok || branch.Tok != token.GOTO || branch.Label == nil {
				return true
			}
			label := safeIdentifier(branch.Label.Name)
			if seenLabels[label] {
				spans[label] = idx
			}
			return true
		})
	}
	for label, idx := range spans {
		if idx+1 < len(stmts) {
			if _, ok := stmts[idx+1].(*ast.ReturnStmt); ok {
				spans[label] = idx + 1
			}
		}
	}
	return spans
}

func leadingGotoBackwardLoopSpan(stmts []ast.Stmt, idx int, backwardSpans map[string]int) (leadingGotoBackwardLoop, bool) {
	// The goto precedes the label of a backward loop.
	if idx+1 >= len(stmts) {
		return leadingGotoBackwardLoop{}, false
	}
	branch, ok := stmts[idx].(*ast.BranchStmt)
	if !ok || branch.Tok != token.GOTO || branch.Label == nil {
		return leadingGotoBackwardLoop{}, false
	}
	nextLabel, ok := stmts[idx+1].(*ast.LabeledStmt)
	if !ok {
		return leadingGotoBackwardLoop{}, false
	}
	label := safeIdentifier(nextLabel.Label.Name)
	endIdx, ok := backwardSpans[label]
	if !ok {
		return leadingGotoBackwardLoop{}, false
	}

	// The loop skips only the statement of its own label, so the goto must
	// target the label right after it.
	forwardLabel := safeIdentifier(branch.Label.Name)
	if idx+2 > endIdx {
		return leadingGotoBackwardLoop{}, false
	}
	labeled, ok := stmts[idx+2].(*ast.LabeledStmt)
	if !ok || safeIdentifier(labeled.Label.Name) != forwardLabel {
		return leadingGotoBackwardLoop{}, false
	}
	return leadingGotoBackwardLoop{
		label:        label,
		labelIdx:     idx + 1,
		endIdx:       endIdx,
		forwardLabel: forwardLabel,
	}, true
}

func forwardGotoLabelSpans(stmts []ast.Stmt, backwardSpans map[string]int) map[string]forwardGotoLabelSpan {
	labelIndexes := make(map[string]int)
	for idx, stmt := range stmts {
		labeled, ok := stmt.(*ast.LabeledStmt)
		if !ok {
			continue
		}
		label := safeIdentifier(labeled.Label.Name)
		if _, isBackward := backwardSpans[label]; isBackward {
			continue
		}
		labelIndexes[label] = idx
	}
	spans := make(map[string]forwardGotoLabelSpan)
	for idx, stmt := range stmts {
		ast.Inspect(stmt, func(node ast.Node) bool {
			branch, ok := node.(*ast.BranchStmt)
			if !ok || branch.Tok != token.GOTO || branch.Label == nil {
				return true
			}
			label := safeIdentifier(branch.Label.Name)
			labelIdx, ok := labelIndexes[label]
			if !ok || labelIdx <= idx {
				return true
			}
			span, ok := spans[label]
			if !ok || idx < span.start {
				spans[label] = forwardGotoLabelSpan{
					label:    label,
					start:    idx,
					labelIdx: labelIdx,
				}
			}
			return true
		})
	}
	return spans
}

func leadingStmtLines(ctx lowerFileContext, prevEndLine int, startLine int) []string {
	if prevEndLine == 0 || startLine == 0 || startLine <= prevEndLine+1 {
		return nil
	}
	if ctx.file == nil || ctx.semPkg == nil || ctx.semPkg.source == nil || ctx.semPkg.source.Fset == nil {
		return []string{""}
	}

	// Comment groups are sorted by position, so the gap's comments form one
	// contiguous run starting after prevEndLine.
	comments := ctx.file.Comments
	first := sort.Search(len(comments), func(i int) bool {
		return sourceLine(ctx, comments[i].Pos()) > prevEndLine
	})
	var lines []string
	lastLine := prevEndLine
	for _, group := range comments[first:] {
		groupStart := sourceLine(ctx, group.Pos())
		groupEnd := sourceLine(ctx, group.End())
		if groupEnd >= startLine {
			break
		}
		if groupStart > lastLine+1 {
			lines = append(lines, "")
		}
		for _, comment := range group.List {
			for line := range strings.SplitSeq(comment.Text, "\n") {
				lines = append(lines, line)
			}
		}
		lastLine = groupEnd
	}
	if startLine > lastLine+1 {
		lines = append(lines, "")
	}
	return lines
}

// sourceLine returns the adjusted source line, including for associated methods
// and comments whose positions belong to a different source file.
func sourceLine(ctx lowerFileContext, pos token.Pos) int {
	if !pos.IsValid() {
		return 0
	}

	// Resolve positions in the current file without the shared FileSet lookup.
	if file := ctx.tokenFile; file != nil && int(pos) >= file.Base() && int(pos) <= file.Base()+file.Size() {
		return file.Position(pos).Line
	}

	// Associated methods can be emitted with a type declared in another file.
	if ctx.semPkg == nil || ctx.semPkg.source == nil || ctx.semPkg.source.Fset == nil {
		return 0
	}
	return ctx.semPkg.source.Fset.Position(pos).Line
}

func (o *LoweringOwner) lowerSendStmt(ctx lowerFileContext, stmt *ast.SendStmt) (string, []Diagnostic) {
	channel, channelDiagnostics := o.lowerExpr(ctx, stmt.Chan)
	value, valueDiagnostics := o.lowerExpr(ctx, stmt.Value)
	diagnostics := append(channelDiagnostics, valueDiagnostics...)
	if channelType, _ := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(stmt.Chan)).Underlying().(*types.Chan); channelType != nil {
		value = o.lowerValueForTarget(ctx, stmt.Value, channelType.Elem(), value)
	}
	return "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanSend) + "(" + channel + ", " + value + ")", diagnostics
}

// lowerGoStmt lowers a go statement to a microtask. A function literal
// called without arguments is the task itself; any other call is wrapped in
// a task that makes the call.
func (o *LoweringOwner) lowerGoStmt(ctx lowerFileContext, stmt *ast.GoStmt) (string, []Diagnostic) {
	// The task runs outside the deferring function.
	goCtx := ctx
	goCtx.deferState = nil
	if lit, ok := ast.Unparen(stmt.Call.Fun).(*ast.FuncLit); ok && len(stmt.Call.Args) == 0 {
		task, _, diagnostics := o.lowerFuncLitCallCallee(goCtx, lit)
		return "queueMicrotask(" + task + ")", diagnostics
	}

	// Any other call is made by a task, async only when the call awaits.
	prelude, call, diagnostics := o.lowerStatementCall(goCtx, stmt.Call)
	prefix := ""
	if strings.Contains(call, "await ") {
		prefix = "async "
	}
	return prelude + "queueMicrotask(" + prefix + "() => { " + call + " })", diagnostics
}

// lowerStatementCall lowers the call of a defer or go statement, which
// evaluates the function value and the arguments where the statement runs and
// calls the function later. It returns the statements that evaluate them,
// each ending in a newline, and the call that reads their results.
func (o *LoweringOwner) lowerStatementCall(ctx lowerFileContext, call *ast.CallExpr) (string, string, []Diagnostic) {
	// The arguments lower into temporaries that the statement evaluates.
	var hoisted []string
	argCtx := ctx
	argCtx.hoistArgsCall = call
	argCtx.hoistedArgs = &hoisted
	argCtx.copyValues = true

	// A method or function variable is evaluated into a temporary too.
	if statementCallNeedsCalleeValue(ctx, call) {
		calleeCtx := ctx
		calleeCtx.copyValues = true
		callee, diagnostics := o.lowerExpr(calleeCtx, call.Fun)
		calleeTemp := ctx.tempName("DeferCallee")
		hoisted = append(hoisted, "const "+calleeTemp+" = "+callee)

		// The call reads the temporaries.
		argCtx.hoistedCallee = true
		args, argDiagnostics := o.lowerCallArgs(argCtx, call, callTargetSignature(ctx, call.Fun))
		diagnostics = append(diagnostics, argDiagnostics...)
		text := o.lowerCallableExpr(ctx, call.Fun, calleeTemp) + "(" + strings.Join(args, ", ") + ")"
		text = o.awaitCallIfNeeded(ctx, call, text)
		return hoistedPrelude(hoisted), text, diagnostics
	}

	// A declared function, builtin or function literal is called directly.
	text, diagnostics := o.lowerCallExpr(argCtx, call)
	return hoistedPrelude(hoisted), text, diagnostics
}

// fixedPointerReceiver reports whether the receiver x of the method selection
// is a pointer whose value is the same wherever it is evaluated.
func fixedPointerReceiver(ctx lowerFileContext, x ast.Expr, selection *types.Selection) bool {
	// The method has a pointer receiver and is not promoted.
	signature, _ := selection.Obj().Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return false
	}
	if _, ptr := signature.Recv().Type().(*types.Pointer); !ptr || len(selection.Index()) != 1 {
		return false
	}

	// The receiver is a local variable.
	ident, ok := ast.Unparen(x).(*ast.Ident)
	if !ok {
		return false
	}
	obj, ok := ctx.semPkg.source.TypesInfo.Uses[ident].(*types.Var)
	if !ok || obj.Pkg() == nil || obj.Parent() == obj.Pkg().Scope() {
		return false
	}

	// A local of struct type is addressed by the call, which cannot change.
	if _, ptr := types.Unalias(obj.Type()).Underlying().(*types.Pointer); !ptr {
		// The receiver is the variable's address.
		return true
	}
	if ctx.model.needsVarRef[obj] {
		return false
	}

	// A pointer local declared in a block is fixed unless it is reassigned.
	path, _ := astutil.PathEnclosingInterval(ctx.file, obj.Pos(), obj.Pos())
	for _, node := range path {
		if _, ok := node.(*ast.BlockStmt); ok {
			return !isReassignedLocal(ctx, obj)
		}
		if _, ok := node.(*ast.FuncType); ok {
			return false
		}
	}
	return false
}

// hoistedPrelude returns the statements that evaluate the hoisted temporaries,
// each ending in a newline.
func hoistedPrelude(hoisted []string) string {
	if len(hoisted) == 0 {
		return ""
	}
	return strings.Join(hoisted, "\n") + "\n"
}

// statementCallNeedsCalleeValue reports whether the function that a defer or
// go statement calls is a value to evaluate at the statement: a method, whose
// receiver Go evaluates there, or a function variable. A declared function,
// a builtin and a function literal are called directly.
func statementCallNeedsCalleeValue(ctx lowerFileContext, call *ast.CallExpr) bool {
	// An instantiated generic function is judged by the function itself.
	fun := ast.Unparen(call.Fun)
	if index, ok := fun.(*ast.IndexExpr); ok {
		fun = ast.Unparen(index.X)
	} else if index, ok := fun.(*ast.IndexListExpr); ok {
		fun = ast.Unparen(index.X)
	}

	// Judge the function by what it names.
	info := ctx.semPkg.source.TypesInfo
	switch typed := fun.(type) {
	case *ast.FuncLit:
		return false
	case *ast.Ident:
		switch info.Uses[typed].(type) {
		case *types.Func, *types.Builtin, *types.TypeName:
			return false
		}
		return true
	case *ast.SelectorExpr:
		if selection := info.Selections[typed]; selection != nil {
			// A method is evaluated as a method value, which binds its
			// receiver, unless its receiver is a pointer that cannot change:
			// the address of a variable, or a local pointer variable that is
			// never assigned again.
			if selection.Kind() == types.MethodVal && fixedPointerReceiver(ctx, typed.X, selection) {
				return false
			}
			return true
		}
		switch info.Uses[typed.Sel].(type) {
		case *types.Func, *types.Builtin, *types.TypeName:
			return false
		}
		return true
	}
	return true
}

func (o *LoweringOwner) lowerDeferStmt(ctx lowerFileContext, stmt *ast.DeferStmt) (string, []Diagnostic) {
	// The call lowers with the arguments evaluated at the statement.
	prelude, call, diagnostics := o.lowerStatementCall(ctx, stmt.Call)

	// The enclosing function records what the deferred call needs.
	async := strings.Contains(call, "await ")
	if ctx.deferState != nil {
		ctx.deferState.used = true
		if async {
			ctx.deferState.async = true
		}
		if deferCallMayRecover(ctx, stmt.Call) {
			ctx.deferState.recover = true
		}
	}

	// The deferred call runs inside a function of its own.
	if async {
		return prelude + "__defer.defer(async () => { " + call + " })", diagnostics
	}
	return prelude + "__defer.defer(() => { " + call + " })", diagnostics
}

func (o *LoweringOwner) lowerAssignStmt(ctx lowerFileContext, stmt *ast.AssignStmt) ([]loweredStmt, []Diagnostic) {
	// A compound assignment from a receive lowers as a binary expression.
	plain := stmt.Tok == token.ASSIGN || stmt.Tok == token.DEFINE
	if plain && len(stmt.Rhs) == 1 && isChannelReceiveExpr(stmt.Rhs[0]) {
		return o.lowerChannelReceiveAssignStmt(ctx, stmt)
	}
	if len(stmt.Lhs) == 1 && len(stmt.Rhs) == 1 {
		if ident, ok := stmt.Lhs[0].(*ast.Ident); ok && ident.Name == "_" {
			right, diagnostics := o.lowerExpr(ctx, stmt.Rhs[0])
			return []loweredStmt{{text: right}}, diagnostics
		}
	}
	if len(stmt.Rhs) == 1 && len(stmt.Lhs) > 1 {
		if allBlankIdents(stmt.Lhs) {
			right, diagnostics := o.lowerTupleExpr(ctx, stmt.Rhs[0])
			return []loweredStmt{{text: right}}, diagnostics
		}
		right, diagnostics := o.lowerTupleExpr(ctx, stmt.Rhs[0])
		lefts := make([]string, 0, len(stmt.Lhs))
		for _, lhs := range stmt.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
				lefts = append(lefts, "")
				continue
			}
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, stmt.Tok == token.DEFINE)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		prefix := ""
		if stmt.Tok == token.DEFINE {
			prefix = declarationKeyword(ctx)
			if !allShortAssignTargetsNew(ctx, stmt.Lhs) || o.tupleDeclarationNeedsElementStatements(ctx, stmt) ||
				gotoHoistsAny(ctx, stmt.Lhs) {
				return o.lowerTupleReassignmentStmt(ctx, stmt, right, diagnostics)
			}
			return []loweredStmt{{text: prefix + "[" + strings.Join(lefts, ", ") + "] = " + right}}, diagnostics
		}
		return o.lowerTupleReassignmentStmt(ctx, stmt, right, diagnostics)
	}
	if len(stmt.Rhs) > 1 && len(stmt.Lhs) == len(stmt.Rhs) && stmt.Tok == token.ASSIGN {
		return o.lowerParallelAssignStmt(ctx, stmt)
	}

	stmts := make([]loweredStmt, 0, len(stmt.Lhs))
	var diagnostics []Diagnostic
	for idx, lhs := range stmt.Lhs {
		if idx >= len(stmt.Rhs) {
			break
		}

		// A blank target still evaluates its value, in order.
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			right, rightDiagnostics := o.lowerExpr(ctx, stmt.Rhs[idx])
			diagnostics = append(diagnostics, rightDiagnostics...)
			stmts = append(stmts, loweredStmt{text: right})
			continue
		}
		isShortDecl := stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs)

		// A compound assignment reads its target twice, so the operands of
		// the target are evaluated once first; a map update has its own
		// temporaries.
		if !plain && !isMapIndexExpr(ctx, lhs) {
			var prelude []loweredStmt
			var preludeDiagnostics []Diagnostic
			ctx, prelude, preludeDiagnostics = o.stableCompoundTarget(ctx, lhs)
			diagnostics = append(diagnostics, preludeDiagnostics...)
			stmts = append(stmts, prelude...)
		}

		right, rightDiagnostics := o.lowerExpr(ctx, stmt.Rhs[idx])
		diagnostics = append(diagnostics, rightDiagnostics...)
		targetType := assignmentTargetType(ctx, lhs)
		mask := isInt32Mask(ctx, stmt.Rhs[idx])
		// A struct assigned to existing storage is copied into it field by
		// field, so a value of the same type is not copied first.
		uncopied := right
		right = o.lowerValueForTarget(ctx, stmt.Rhs[idx], targetType, right)

		// A number shifted by a 64-bit count, a bigint, takes the count as a
		// number, since JavaScript does not mix the two in a shift.
		if (stmt.Tok == token.SHL_ASSIGN || stmt.Tok == token.SHR_ASSIGN) && !isRuntimeWideIntegerType(targetType) &&
			isBigIntBackedType(ctx.semPkg.source.TypesInfo.TypeOf(stmt.Rhs[idx])) {
			right = wideToNumber(o.runtimeOwner, ctx.semPkg.source.TypesInfo.TypeOf(stmt.Rhs[idx]), right)
		}
		if targetType != nil && genericCallResultUsesTypeParam(ctx, stmt.Rhs[idx]) {
			right = "(" + right + " as " + o.tsTypeFor(ctx, targetType) + ")"
			uncopied = "(" + uncopied + " as " + o.tsTypeFor(ctx, targetType) + ")"
		}
		if sourceType := ctx.semPkg.source.TypesInfo.TypeOf(stmt.Rhs[idx]); sourceType == nil || targetType == nil ||
			!types.Identical(sourceType, targetType) || !structAssignCopiesDeeply(targetType, 0) {
			uncopied = right
		}
		if setter, ok := o.packageVarSetterForAssignment(ctx, lhs); ok {
			value, ok := o.packageVarAssignmentValue(ctx, lhs, targetType, right, stmt.Tok)
			if !ok {
				value = right
			}
			stmts = append(stmts, loweredStmt{text: setter + "(" + value + ")"})
			continue
		}
		if index, ok := lhs.(*ast.IndexExpr); ok && isMapType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)) && stmt.Tok != token.DEFINE {
			update, updateDiagnostics := o.lowerMapIndexUpdateStmts(ctx, index, stmt.Tok, right, targetType, mask)
			diagnostics = append(diagnostics, updateDiagnostics...)
			stmts = append(stmts, update...)
			continue
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, isShortDecl)
		diagnostics = append(diagnostics, leftDiagnostics...)
		star, starTarget := unwrapParenExpr(lhs).(*ast.StarExpr)
		if !isShortDecl && isStructValueType(targetType) {
			stmts = append(stmts, loweredStmt{text: o.lowerStructAssignmentTo(ctx, lhs, left, uncopied)})
			continue
		}
		if !isShortDecl && isArrayValueType(targetType) {
			stmts = append(stmts, loweredStmt{text: o.lowerArrayAssignmentTo(ctx, lhs, left, uncopied, targetType)})
			continue
		}
		if starTarget && stmt.Tok == token.ASSIGN {
			pointer, pointerDiagnostics := o.lowerPointerStorageExpr(ctx, star.X)
			diagnostics = append(diagnostics, pointerDiagnostics...)
			stmts = append(stmts, loweredStmt{text: pointer + " = " + right})
			continue
		}
		if starTarget && stmt.Tok != token.DEFINE {
			pointer, pointerDiagnostics := o.lowerPointerStorageExpr(ctx, star.X)
			diagnostics = append(diagnostics, pointerDiagnostics...)
			if value, ok := integerQuotientAssignExpr(targetType, pointer, right, stmt.Tok); ok {
				stmts = append(stmts, loweredStmt{text: value})
				continue
			}
			stmts = append(stmts, loweredStmt{text: lowerCompoundAssignStmt(o.runtimeOwner, targetType, pointer, right, stmt.Tok, mask)})
			continue
		}
		if isShortDecl {
			if ident, ok := lhs.(*ast.Ident); ok {
				right = o.lowerDeclaredValue(ctx, ident, right)
				if o.gotoHoistedDecl(ctx, ctx.semPkg.source.TypesInfo.Defs[ident], left) {
					stmts = append(stmts, loweredStmt{text: left + " = " + right})
					continue
				}
			}
			stmts = append(stmts, loweredStmt{text: declarationKeyword(ctx) + left + o.shortDeclTypeAnnotation(ctx, lhs, stmt.Rhs[idx]) + " = " + right})
			continue
		}
		if helper, ok := wideIntegerAssignHelper(targetType, stmt.Tok); ok {
			call := wideIntegerHelperCall(o.runtimeOwner, targetType, helper, left, right)
			stmts = append(stmts, loweredStmt{text: left + " = " + call})
			continue
		}
		if value, ok := integerQuotientAssignExpr(targetType, left, right, stmt.Tok); ok {
			stmts = append(stmts, loweredStmt{text: value})
			continue
		}
		op := stmt.Tok.String()
		if stmt.Tok == token.DEFINE {
			op = "="
		}
		if stmt.Tok != token.ASSIGN && stmt.Tok != token.DEFINE {
			stmts = append(stmts, loweredStmt{text: lowerCompoundAssignStmt(o.runtimeOwner, targetType, left, right, stmt.Tok, mask)})
			continue
		}
		stmts = append(stmts, loweredStmt{text: left + " " + op + " " + right})
	}
	return stmts, diagnostics
}

func (o *LoweringOwner) lowerMapIndexUpdateStmts(
	ctx lowerFileContext,
	index *ast.IndexExpr,
	tok token.Token,
	right string,
	targetType types.Type,
	mask bool,
) ([]loweredStmt, []Diagnostic) {
	mapExpr, mapDiagnostics := o.lowerExpr(ctx, index.X)
	keyExpr, keyDiagnostics := o.lowerExpr(ctx, index.Index)
	diagnostics := append(mapDiagnostics, keyDiagnostics...)
	if mapType, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(index.X)).Underlying().(*types.Map); ok {
		keyExpr = o.lowerValueForTarget(ctx, index.Index, mapType.Key(), keyExpr)
	}
	if tok == token.ASSIGN {
		return []loweredStmt{{text: o.runtimeOwner.QualifiedHelper(RuntimeHelperMapSet) + "(" + mapExpr + ", " + keyExpr + ", " + right + ")"}}, diagnostics
	}
	mapTemp := ctx.tempName("Map")
	keyTemp := ctx.tempName("MapKey")
	current := o.lowerMapGetValue(ctx, index, mapTemp, keyTemp)
	value := lowerCompoundAssignValue(o.runtimeOwner, targetType, current, right, tok, mask)
	return []loweredStmt{
		{text: "const " + mapTemp + " = " + mapExpr},
		{text: "const " + keyTemp + " = " + keyExpr},
		{text: o.runtimeOwner.QualifiedHelper(RuntimeHelperMapSet) + "(" + mapTemp + ", " + keyTemp + ", " + value + ")"},
	}, diagnostics
}

// lowerCompoundAssignStmt lowers the compound assignment left op= right. An
// operation that JavaScript computes as Go does keeps its compound operator.
// mask reports whether right is a constant in [0, 2^31).
func lowerCompoundAssignStmt(
	runtimeOwner *RuntimeContractOwner,
	targetType types.Type,
	left string,
	right string,
	tok token.Token,
	mask bool,
) string {
	value := lowerCompoundAssignValue(runtimeOwner, targetType, left, right, tok, mask)
	if value == left+" "+strings.TrimSuffix(tok.String(), "=")+" ("+right+")" {
		return left + " " + tok.String() + " " + right
	}
	return left + " = " + value
}

// lowerCompoundAssignValue returns the value that left op= right assigns to
// left. mask reports whether right is a constant in [0, 2^31).
func lowerCompoundAssignValue(
	runtimeOwner *RuntimeContractOwner,
	targetType types.Type,
	left string,
	right string,
	tok token.Token,
	mask bool,
) string {
	// Wide integers, int bitwise operations, 32-bit products and integer
	// quotients have helpers.
	if helper, ok := wideIntegerAssignHelper(targetType, tok); ok {
		return wideIntegerHelperCall(runtimeOwner, targetType, helper, left, right)
	}
	if value, ok := lowerIntBitwiseValue(runtimeOwner, targetType, tok, left, right, mask); ok {
		return value
	}
	if tok == token.MUL_ASSIGN {
		if value, ok := lower32BitIntegerMultiplicationValue(targetType, left, right); ok {
			return value
		}
	}
	if value, ok := integerQuotientAssignValueExpr(targetType, left, right, tok); ok {
		return value
	}

	// Other operators apply to the parenthesized operand, wrapped to the
	// target's width.
	right = "(" + right + ")"
	wrapNarrow := func(value string) string {
		if targetType == nil || isFloatType(targetType) {
			return value
		}
		if bits, ok := unsignedIntegerBits(targetType); ok && bits < 64 {
			return runtimeOwner.QualifiedHelper(RuntimeHelperUint) + "(" + value + ", " + strconv.Itoa(bits) + ")"
		}
		if bits, ok := signedIntegerBits(targetType); ok && bits < 64 {
			return runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" + value + ", " + strconv.Itoa(bits) + ")"
		}
		return value
	}

	// The JavaScript bitwise operators return int32s, which a uint32 target
	// converts back to its unsigned value.
	wrapUint32 := func(value string) string {
		if bits, ok := unsignedIntegerBits(targetType); ok && bits == 32 {
			return "(" + value + ") >>> 0"
		}
		return value
	}
	switch tok {
	case token.ADD_ASSIGN:
		value := left + " + " + right
		if isFloat32Type(targetType) {
			return "globalThis.Math.fround(" + value + ")"
		}
		return wrapNarrow(value)
	case token.SUB_ASSIGN:
		value := left + " - " + right
		if isFloat32Type(targetType) {
			return "globalThis.Math.fround(" + value + ")"
		}
		return wrapNarrow(value)
	case token.MUL_ASSIGN:
		value := left + " * " + right
		if isFloat32Type(targetType) {
			return "globalThis.Math.fround(" + value + ")"
		}
		return wrapNarrow(value)
	case token.QUO_ASSIGN:
		value := left + " / " + right
		if isFloat32Type(targetType) {
			return "globalThis.Math.fround(" + value + ")"
		}
		return value
	case token.REM_ASSIGN:
		return left + " % " + right
	case token.AND_ASSIGN:
		return wrapUint32(left + " & " + right)
	case token.OR_ASSIGN:
		return wrapUint32(left + " | " + right)
	case token.XOR_ASSIGN:
		return wrapUint32(left + " ^ " + right)
	case token.SHL_ASSIGN:
		if value, ok := lowerNarrowShiftAssignValue(runtimeOwner, targetType, left, right, tok, wrapNarrow); ok {
			return value
		}
		return wrapNarrow(left + " << " + right)
	case token.SHR_ASSIGN:
		if value, ok := lowerNarrowShiftAssignValue(runtimeOwner, targetType, left, right, tok, wrapNarrow); ok {
			return value
		}
		if bits, ok := unsignedIntegerBits(targetType); ok && bits <= 32 {
			return "(" + left + " >>> " + right + ") >>> 0"
		}
		return left + " >> " + right
	case token.AND_NOT_ASSIGN:
		return wrapUint32(left + " & ~(" + right + ")")
	default:
		return right
	}
}

func integerQuotientAssignExpr(targetType types.Type, left string, right string, tok token.Token) (string, bool) {
	value, ok := integerQuotientAssignValueExpr(targetType, left, right, tok)
	if !ok {
		return "", false
	}
	return left + " = " + value, true
}

func assignmentTargetType(ctx lowerFileContext, lhs ast.Expr) types.Type {
	if ident, ok := lhs.(*ast.Ident); ok {
		if obj := ctx.semPkg.source.TypesInfo.Defs[ident]; obj != nil {
			return obj.Type()
		}
	}
	return ctx.semPkg.source.TypesInfo.TypeOf(lhs)
}

func integerQuotientAssignValueExpr(targetType types.Type, left string, right string, tok token.Token) (string, bool) {
	if tok != token.QUO_ASSIGN || !isIntegerType(targetType) {
		return "", false
	}
	if bits, ok := unsignedIntegerBits(targetType); ok && bits <= 32 {
		return "(" + left + " / " + right + ") >>> 0", true
	}
	return "globalThis.Math.trunc(" + left + " / " + right + ")", true
}

// incDecStepValue returns value, the stepped value of an increment or
// decrement of a variable of type typ, wrapped to a narrow integer type or
// rounded to float32, and whether typ is such a type.
func incDecStepValue(typ types.Type, value string, op token.Token) (string, bool) {
	if isFloat32Type(typ) {
		return "globalThis.Math.fround(" + value + ")", true
	}
	return wrapNarrowIntegerValue(typ, value, op)
}

// lowerIncDecTarget lowers the assignable target of an increment or
// decrement: the storage a pointer points to, the target[index] form of an
// array or slice element, whose read path is a bounds-checked helper, or
// another operand.
func (o *LoweringOwner) lowerIncDecTarget(ctx lowerFileContext, target ast.Expr) (string, []Diagnostic) {
	switch typed := unwrapParenExpr(target).(type) {
	case *ast.StarExpr:
		return o.lowerPointerStorageExpr(ctx, typed.X)
	case *ast.IndexExpr:
		return o.lowerAssignmentTarget(ctx, typed, false)
	}
	return o.lowerExpr(ctx, target)
}

// intBitwiseHelper returns the runtime helper for the bitwise operator op,
// or its assignment form, on values of the type typ, and whether typ is int.
// An int is a number exact to 2^53, and the JavaScript bitwise operators keep
// only its low 32 bits, so the helpers apply them to its high and low words.
func intBitwiseHelper(typ types.Type, op token.Token) (RuntimeHelper, bool) {
	// Only int and the untyped integers that default to it are such numbers.
	if !basicKind(typ, types.Int) && !basicKind(typ, types.UntypedInt) {
		return "", false
	}
	switch op {
	case token.AND, token.AND_ASSIGN:
		return RuntimeHelperIntAnd, true
	case token.OR, token.OR_ASSIGN:
		return RuntimeHelperIntOr, true
	case token.XOR, token.XOR_ASSIGN:
		return RuntimeHelperIntXor, true
	case token.AND_NOT, token.AND_NOT_ASSIGN:
		return RuntimeHelperIntAndNot, true
	case token.SHL, token.SHL_ASSIGN:
		return RuntimeHelperIntShl, true
	case token.SHR, token.SHR_ASSIGN:
		return RuntimeHelperIntShr, true
	default:
		return "", false
	}
}

// lowerIntBitwiseValue returns left op right for the bitwise operator op, or
// its assignment form, on values of the type typ, and whether typ is int. An
// & with a mask, a constant in [0, 2^31), keeps the JavaScript operator,
// which computes the same low bits.
func lowerIntBitwiseValue(
	runtimeOwner *RuntimeContractOwner,
	typ types.Type,
	op token.Token,
	left string,
	right string,
	mask bool,
) (string, bool) {
	// Other types, and the masks, keep the JavaScript operators.
	helper, ok := intBitwiseHelper(typ, op)
	if !ok || mask && helper == RuntimeHelperIntAnd {
		return "", false
	}
	return runtimeOwner.QualifiedHelper(helper) + "(" + left + ", " + right + ")", true
}

// isInt32Mask reports whether expr is an integer constant in [0, 2^31), whose
// JavaScript & with any int keeps the low bits of the int as Go's & does.
func isInt32Mask(ctx lowerFileContext, expr ast.Expr) bool {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	if value == nil || value.Kind() != constant.Int {
		return false
	}
	bits, exact := constant.Int64Val(value)
	return exact && bits >= 0 && bits <= math.MaxInt32
}

// wrapNarrowIntegerValue wraps the result of an addition, subtraction or
// left shift of integers narrower than 64 bits, which JavaScript computes
// without overflow, to the width of its type, as Go does. A JavaScript left
// shift already wraps to a signed 32-bit result, so it needs no wrapping for
// int32.
func wrapNarrowIntegerValue(typ types.Type, value string, op token.Token) (string, bool) {
	if bits, ok := unsignedIntegerBits(typ); ok {
		switch bits {
		case 8:
			return "((" + value + ") & 0xff)", true
		case 16:
			return "((" + value + ") & 0xffff)", true
		case 32:
			return "((" + value + ") >>> 0)", true
		}
		return "", false
	}
	if bits, ok := signedIntegerBits(typ); ok {
		switch bits {
		case 8:
			return "((" + value + ") << 24 >> 24)", true
		case 16:
			return "((" + value + ") << 16 >> 16)", true
		case 32:
			if op == token.SHL {
				return "", false
			}
			return "((" + value + ") | 0)", true
		}
	}
	return "", false
}

func lower32BitIntegerMultiplicationValue(targetType types.Type, left string, right string) (string, bool) {
	if targetType == nil {
		return "", false
	}
	basic, ok := types.Unalias(targetType).Underlying().(*types.Basic)
	if !ok {
		return "", false
	}
	switch basic.Kind() {
	case types.Uint32:
		return "globalThis.Math.imul(" + left + ", " + right + ") >>> 0", true
	case types.Int32:
		return "globalThis.Math.imul(" + left + ", " + right + ")", true
	default:
		return "", false
	}
}

func wideIntegerAssignHelper(targetType types.Type, tok token.Token) (RuntimeHelper, bool) {
	if !isRuntimeWideIntegerType(targetType) {
		return "", false
	}
	signed := isFixedSignedWideIntegerType(targetType)
	switch tok {
	case token.SHL_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Shl, RuntimeHelperInt64Shl), true
	case token.SHR_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Shr, RuntimeHelperInt64Shr), true
	case token.MUL_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Mul, RuntimeHelperInt64Mul), true
	case token.QUO_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Div, RuntimeHelperInt64Div), true
	case token.REM_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Mod, RuntimeHelperInt64Mod), true
	case token.ADD_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Add, RuntimeHelperInt64Add), true
	case token.SUB_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Sub, RuntimeHelperInt64Sub), true
	case token.AND_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64And, RuntimeHelperInt64And), true
	case token.AND_NOT_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64AndNot, RuntimeHelperInt64AndNot), true
	case token.OR_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Or, RuntimeHelperInt64Or), true
	case token.XOR_ASSIGN:
		return wideIntegerHelper(signed, RuntimeHelperUint64Xor, RuntimeHelperInt64Xor), true
	default:
		return "", false
	}
}

func (o *LoweringOwner) lowerChannelReceiveAssignStmt(
	ctx lowerFileContext,
	stmt *ast.AssignStmt,
) ([]loweredStmt, []Diagnostic) {
	if len(stmt.Rhs) != 1 {
		return nil, nil
	}
	receive, ok := stmt.Rhs[0].(*ast.UnaryExpr)
	if !ok || receive.Op != token.ARROW {
		return nil, nil
	}
	channel, diagnostics := o.lowerExpr(ctx, receive.X)
	if len(stmt.Lhs) == 1 {
		if ident, ok := stmt.Lhs[0].(*ast.Ident); ok && ident.Name == "_" {
			return []loweredStmt{{text: "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecv) + "(" + channel + ")"}}, diagnostics
		}
		value := "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecv) + "(" + channel + ")"
		targetStmt, targetDiagnostics := o.lowerTupleTargetAssignmentStmt(ctx, stmt.Lhs[0], value, stmt.Tok == token.DEFINE)
		return []loweredStmt{targetStmt}, append(diagnostics, targetDiagnostics...)
	}
	tempName := ctx.tempName("Recv")
	stmts := []loweredStmt{{text: "let " + tempName + " = await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecvWithOk) + "(" + channel + ")"}}
	if allBlankIdents(stmt.Lhs) {
		return stmts, diagnostics
	}
	fields := []string{".value", ".ok"}
	for idx, lhs := range stmt.Lhs {
		if idx >= len(fields) {
			break
		}
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		declare := stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs)
		value := tempName + fields[idx]
		targetStmt, targetDiagnostics := o.lowerTupleTargetAssignmentStmt(ctx, lhs, value, declare)
		diagnostics = append(diagnostics, targetDiagnostics...)
		stmts = append(stmts, targetStmt)
	}
	return stmts, diagnostics
}

func (o *LoweringOwner) shortDeclTypeAnnotation(ctx lowerFileContext, lhs ast.Expr, rhs ast.Expr) string {
	ident, ok := lhs.(*ast.Ident)
	if !ok {
		return ""
	}
	obj := ctx.semPkg.source.TypesInfo.Defs[ident]
	if obj == nil {
		return ""
	}

	// A local that always holds its literal takes the literal's exact type.
	if rhs != nil && fixedFuncLocal(ctx, obj) != nil {
		return ""
	}
	if signature := unnamedSignatureForType(obj.Type()); signature != nil {
		typ := o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
		if ctx.model.needsVarRef[obj] {
			typ = "$.VarRef<" + typ + ">"
		}
		return ": " + typ
	}
	if rhs != nil && isInterfaceType(obj.Type()) && (isIdentLikeExpr(rhs) || (o.callsOverridePackage(ctx, rhs) && isReassignedLocal(ctx, obj))) {
		return ": " + o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj])
	}
	if rhs != nil && shortDeclFeedsOwnInit(ctx, obj, rhs) {
		return ": " + o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj])
	}

	// A value without its own expression, such as an element of an untyped
	// tuple or a received value, has no type to infer and always takes its Go
	// type. Otherwise a nil-able local takes its Go type, so a later nil
	// assignment typechecks, and one that is never assigned again keeps the
	// type inferred from its value.
	typ := ": " + o.tsVariableTypeFor(ctx, obj.Type(), ctx.model.needsVarRef[obj])
	if rhs == nil {
		return typ
	}
	if !shortDeclNeedsTypeAnnotation(obj.Type()) ||
		(!ctx.model.needsVarRef[obj] && !isReassignedLocal(ctx, obj)) {
		return ""
	}
	return typ
}

// callsOverridePackage reports whether expr is a call to a function or method
// declared by an override package. Hand-written override signatures may
// return an interface as non-nullable, as reflect's Type.Elem does, so a
// variable declared from the call needs the Go type's nullable annotation
// to be assigned a nil-able value later.
func (o *LoweringOwner) callsOverridePackage(ctx lowerFileContext, expr ast.Expr) bool {
	// Without override packages, no call can reach one.
	if o.overrideOwner == nil {
		return false
	}

	// Only a call can reach an override package function.
	call, _ := ast.Unparen(expr).(*ast.CallExpr)
	if call == nil {
		return false
	}
	var ident *ast.Ident
	switch fun := ast.Unparen(call.Fun).(type) {
	case *ast.Ident:
		ident = fun
	case *ast.SelectorExpr:
		ident = fun.Sel
	default:
		return false
	}
	fn, _ := ctx.semPkg.source.TypesInfo.Uses[ident].(*types.Func)
	return fn != nil && fn.Pkg() != nil && o.overrideFacts().HasPackage(fn.Pkg().Path())
}

// inferredValueType returns the type TypeScript infers for a let binding
// initialized to the lowered value, or "" when the value is not one whose type
// is evident: a literal, a struct value or a VarRef holding one of those.
func (o *LoweringOwner) inferredValueType(value string) string {
	if inner, ok := strings.CutPrefix(value, o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef)+"("); ok {
		if inner, ok := strings.CutSuffix(inner, ")"); ok {
			if typ := o.inferredValueType(inner); typ != "" {
				return "$.VarRef<" + typ + ">"
			}
		}
		return ""
	}
	if inner, ok := strings.CutPrefix(value, o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue)+"(new "); ok {
		if typ, ok := strings.CutSuffix(inner, "())"); ok && isQualifiedTSName(typ) {
			return typ
		}
		return ""
	}
	switch {
	case value == "true" || value == "false":
		return "boolean"
	case numericLiteralPattern.MatchString(value):
		if strings.HasSuffix(value, "n") {
			return "bigint"
		}
		return "number"
	}
	if _, err := strconv.Unquote(value); err == nil && strings.HasPrefix(value, `"`) {
		return "string"
	}
	return ""
}

// numericLiteralPattern matches a lowered integer, float or bigint literal.
var numericLiteralPattern = regexp.MustCompile(`^-?[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?n?$`)

// isQualifiedTSName reports whether name is a type name with an optional
// package qualifier and no type arguments.
func isQualifiedTSName(name string) bool {
	for _, part := range strings.Split(name, ".") {
		if !token.IsIdentifier(part) {
			return false
		}
	}
	return true
}

// isReassignedLocal reports whether the local variable obj is assigned
// after its declaration, by an assignment, a redeclaring :=, an increment or
// a range assignment.
func isReassignedLocal(ctx lowerFileContext, obj types.Object) bool {
	return localAssignmentsFor(ctx).reassigned[obj]
}

// fixedLocalValue returns the expression that the local variable obj always
// holds: obj is declared by := to the expression, never assigned again and
// never referenced by pointer.
func fixedLocalValue(ctx lowerFileContext, obj types.Object) ast.Expr {
	assignments := localAssignmentsFor(ctx)
	if assignments.reassigned[obj] || ctx.model.needsVarRef[obj] {
		return nil
	}
	return assignments.values[obj]
}

// fixedFuncLocal returns the function literal that the local variable obj
// always holds, so a call through obj calls the literal.
func fixedFuncLocal(ctx lowerFileContext, obj types.Object) *ast.FuncLit {
	lit, _ := fixedLocalValue(ctx, obj).(*ast.FuncLit)
	return lit
}

// isMadeLocal reports whether expr names a local variable that always holds
// the result of the make builtin, which is never nil.
func isMadeLocal(ctx lowerFileContext, expr ast.Expr) bool {
	ident, ok := ast.Unparen(expr).(*ast.Ident)
	if !ok {
		return false
	}
	obj, ok := ctx.semPkg.source.TypesInfo.Uses[ident].(*types.Var)
	if !ok {
		return false
	}
	call, ok := fixedLocalValue(ctx, obj).(*ast.CallExpr)
	if !ok {
		return false
	}
	fun, ok := ast.Unparen(call.Fun).(*ast.Ident)
	if !ok {
		return false
	}
	builtin, ok := ctx.semPkg.source.TypesInfo.Uses[fun].(*types.Builtin)
	return ok && builtin.Name() == "make"
}

func localAssignmentsFor(ctx lowerFileContext) *localAssignments {
	pkg := ctx.semPkg
	pkg.assignmentsOnce.Do(func() {
		pkg.assignments = collectLocalAssignments(pkg.source)
	})
	return pkg.assignments
}

// collectLocalAssignments finds how the variables of pkg are assigned. An
// identifier on the left of an assignment that is not the variable's
// declaring identifier assigns it again.
func collectLocalAssignments(pkg *packages.Package) *localAssignments {
	assignments := &localAssignments{
		reassigned: make(map[types.Object]bool),
		values:     make(map[types.Object]ast.Expr),
	}
	mark := func(targets ...ast.Expr) {
		for _, target := range targets {
			ident, ok := ast.Unparen(target).(*ast.Ident)
			if !ok {
				continue
			}
			if obj := pkg.TypesInfo.ObjectOf(ident); obj != nil && ident.Pos() != obj.Pos() {
				assignments.reassigned[obj] = true
			}
		}
	}
	for _, file := range pkg.Syntax {
		ast.Inspect(file, func(node ast.Node) bool {
			switch typed := node.(type) {
			case *ast.AssignStmt:
				mark(typed.Lhs...)
				if typed.Tok == token.DEFINE && len(typed.Lhs) == len(typed.Rhs) {
					for idx, lhs := range typed.Lhs {
						ident, ok := lhs.(*ast.Ident)
						if !ok {
							continue
						}
						if obj := pkg.TypesInfo.Defs[ident]; obj != nil {
							assignments.values[obj] = ast.Unparen(typed.Rhs[idx])
						}
					}
				}
			case *ast.IncDecStmt:
				mark(typed.X)
			case *ast.RangeStmt:
				if typed.Tok == token.ASSIGN {
					mark(typed.Key, typed.Value)
				}
			}
			return true
		})
	}
	return assignments
}

// shortDeclFeedsOwnInit reports whether obj, declared as obj := init, is read by
// an assignment to a local variable that init also reads. TypeScript infers the
// declared type of obj from init, and init reads the assigned variable at its
// narrowed type, which depends on the assigned expression and so on obj. The
// cycle is an implicit any unless obj has an annotation.
func shortDeclFeedsOwnInit(ctx lowerFileContext, obj types.Object, init ast.Expr) bool {
	info := ctx.semPkg.source.TypesInfo
	reads := make(map[types.Object]bool)
	ast.Inspect(init, func(node ast.Node) bool {
		if ident, ok := node.(*ast.Ident); ok {
			if local, ok := info.Uses[ident].(*types.Var); ok && !local.IsField() && local.Parent() != local.Pkg().Scope() {
				reads[local] = true
			}
		}
		return true
	})
	if len(reads) == 0 {
		return false
	}

	path, _ := astutil.PathEnclosingInterval(ctx.file, obj.Pos(), obj.Pos())
	var scope ast.Node
	for _, node := range path {
		if _, ok := node.(*ast.BlockStmt); ok {
			scope = node
			break
		}
	}
	if scope == nil {
		return false
	}

	feeds := false
	ast.Inspect(scope, func(node ast.Node) bool {
		assign, ok := node.(*ast.AssignStmt)
		if !ok || assign.Tok != token.ASSIGN || len(assign.Lhs) != len(assign.Rhs) {
			return !feeds
		}
		for idx, lhs := range assign.Lhs {
			ident, ok := lhs.(*ast.Ident)
			if !ok || !reads[info.Uses[ident]] {
				continue
			}
			ast.Inspect(assign.Rhs[idx], func(node ast.Node) bool {
				if ident, ok := node.(*ast.Ident); ok && info.Uses[ident] == obj {
					feeds = true
				}
				return !feeds
			})
		}
		return !feeds
	})
	return feeds
}

func isIdentLikeExpr(expr ast.Expr) bool {
	_, ok := ast.Unparen(expr).(*ast.Ident)
	return ok
}

func shortDeclNeedsTypeAnnotation(typ types.Type) bool {
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Pointer:
		_, pointsToArray := types.Unalias(typed.Elem()).Underlying().(*types.Array)
		return pointsToArray || namedStructType(typed.Elem()) != nil || namedNonStructType(typed.Elem()) != nil
	case *types.Map:
		return true
	case *types.Slice:
		return true
	case *types.Chan:
		return true
	default:
		return false
	}
}

func (o *LoweringOwner) lowerTupleTargetAssignmentStmt(
	ctx lowerFileContext,
	lhs ast.Expr,
	value string,
	declare bool,
) (loweredStmt, []Diagnostic) {
	if !declare {
		if index, ok := unwrapParenExpr(lhs).(*ast.IndexExpr); ok && isMapType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)) {
			targetType := assignmentTargetType(ctx, lhs)
			value = o.lowerValueForTarget(ctx, lhs, targetType, value)
			stmts, diagnostics := o.lowerMapIndexUpdateStmts(ctx, index, token.ASSIGN, value, targetType, false)
			if len(stmts) != 0 {
				return stmts[0], diagnostics
			}
			return loweredStmt{}, diagnostics
		}
		if stmt, diagnostics, ok := o.lowerStarTargetAssignmentStmt(ctx, lhs, value); ok {
			return stmt, diagnostics
		}
		if setter, ok := o.packageVarSetterForAssignment(ctx, lhs); ok {
			return loweredStmt{text: setter + "(" + value + ")"}, nil
		}
	}
	left, diagnostics := o.lowerAssignmentTarget(ctx, lhs, declare)
	if !declare && isStructValueType(assignmentTargetType(ctx, lhs)) {
		return loweredStmt{text: o.lowerStructAssignmentTo(ctx, lhs, left, value)}, diagnostics
	}
	if targetType := assignmentTargetType(ctx, lhs); !declare && isArrayValueType(targetType) {
		return loweredStmt{text: o.lowerArrayAssignmentTo(ctx, lhs, left, value, targetType)}, diagnostics
	}
	prefix := ""
	if declare {
		value = o.lowerDeclaredValue(ctx, lhs, value)
		if ident, ok := lhs.(*ast.Ident); ok && o.gotoHoistedDecl(ctx, ctx.semPkg.source.TypesInfo.Defs[ident], left) {
			return loweredStmt{text: left + " = " + value}, diagnostics
		}
		prefix = declarationKeyword(ctx)
		left += o.shortDeclTypeAnnotation(ctx, lhs, nil)
	}
	return loweredStmt{text: prefix + left + " = " + value}, diagnostics
}

func (o *LoweringOwner) lowerStarTargetAssignmentStmt(
	ctx lowerFileContext,
	lhs ast.Expr,
	right string,
) (loweredStmt, []Diagnostic, bool) {
	star, ok := unwrapParenExpr(lhs).(*ast.StarExpr)
	if !ok {
		return loweredStmt{}, nil, false
	}
	if isStructValueType(ctx.semPkg.source.TypesInfo.TypeOf(lhs)) {
		pointer, diagnostics := o.lowerPointerValueExpr(ctx, star.X)
		return loweredStmt{text: o.lowerStructAssignment(pointer, right)}, diagnostics, true
	}
	if targetType := ctx.semPkg.source.TypesInfo.TypeOf(lhs); isArrayValueType(targetType) {
		pointer, diagnostics := o.lowerPointerValueExpr(ctx, star.X)
		return loweredStmt{text: o.lowerArrayAssignment(pointer, right, targetType)}, diagnostics, true
	}
	pointer, diagnostics := o.lowerPointerStorageExpr(ctx, star.X)
	return loweredStmt{text: pointer + " = " + right}, diagnostics, true
}

// structAssignCopiesDeeply reports whether $.assignStruct copies a value of
// typ into existing storage without sharing any of its mutable parts: every
// field is a basic value or a reference, or a struct or array of such fields.
// A field of a type parameter, which the struct's assign method copies as it
// is, may hold a struct or array value.
func structAssignCopiesDeeply(typ types.Type, depth int) bool {
	if depth > 16 {
		return false
	}
	switch typed := types.Unalias(typ).(type) {
	case *types.TypeParam:
		return false
	case *types.Named:
		if typed.TypeArgs().Len() != 0 {
			return false
		}
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Struct:
		for idx := range typed.NumFields() {
			if !structAssignCopiesDeeply(typed.Field(idx).Type(), depth+1) {
				return false
			}
		}
	case *types.Array:
		return structAssignCopiesDeeply(typed.Elem(), depth+1)
	}
	return true
}

// lowerStructAssignment preserves the addresses of an existing struct's fields.
func (o *LoweringOwner) lowerStructAssignment(target, value string) string {
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperAssignStruct) + "(" + target + ", " + value + ")"
}

// lowerStructAssignmentTo copies value into the existing struct that lhs
// names. A local variable is also assigned the result, which is the same
// struct, so that TypeScript forgets what it narrowed about its fields.
func (o *LoweringOwner) lowerStructAssignmentTo(ctx lowerFileContext, lhs ast.Expr, left, value string) string {
	// A struct of a generated class copies the value by the class's own
	// assign method, which returns the struct; any other struct by the
	// runtime helper.
	assignment := o.lowerStructAssignment(left, value)
	if o.isGeneratedStructClass(namedStructType(assignmentTargetType(ctx, lhs))) {
		assignment = parenthesizeAwaitedExpr(left) + ".__goscriptAssign(" + value + ")"
	}

	// A local variable is assigned the result.
	ident, ok := unwrapParenExpr(lhs).(*ast.Ident)
	if !ok {
		return assignment
	}
	obj, ok := ctx.semPkg.source.TypesInfo.Uses[ident].(*types.Var)
	if !ok || obj.Pkg() == nil || obj.Parent() == obj.Pkg().Scope() {
		return assignment
	}
	return left + " = " + assignment
}

// isArrayValueType reports whether typ is an array type with elements, whose
// assignment copies into the existing array.
func isArrayValueType(typ types.Type) bool {
	if typ == nil || isTypeParamType(typ) {
		return false
	}
	array, ok := types.Unalias(typ).Underlying().(*types.Array)
	return ok && array.Len() > 0
}

// lowerArrayAssignment copies the array value into the existing array
// target element by element, assigning struct and array elements in place,
// as Go assigns an array, so that pointers to its elements stay valid.
func (o *LoweringOwner) lowerArrayAssignment(target, value string, typ types.Type) string {
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperAssignFieldValue) + "(" + target + ", " + value + ", " + o.runtimeTypeInfoExpr(typ) + ")"
}

// lowerArrayAssignmentTo copies value into the existing array that lhs
// names. A local variable is also assigned the result, which is the same
// array.
func (o *LoweringOwner) lowerArrayAssignmentTo(ctx lowerFileContext, lhs ast.Expr, left, value string, typ types.Type) string {
	// The array is copied into its storage.
	assignment := o.lowerArrayAssignment(left, value, typ)

	// A local variable is assigned the result.
	ident, ok := unwrapParenExpr(lhs).(*ast.Ident)
	if !ok {
		return assignment
	}
	obj, ok := ctx.semPkg.source.TypesInfo.Uses[ident].(*types.Var)
	if !ok || obj.Pkg() == nil || obj.Parent() == obj.Pkg().Scope() {
		return assignment
	}
	return left + " = " + assignment
}

func (o *LoweringOwner) lowerTupleReassignmentStmt(
	ctx lowerFileContext,
	stmt *ast.AssignStmt,
	right string,
	diagnostics []Diagnostic,
) ([]loweredStmt, []Diagnostic) {
	tempName := ctx.tempName("Tuple")
	stmts := []loweredStmt{{text: "let " + tempName + ": any = " + right}}
	for idx, lhs := range stmt.Lhs {
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		declare := stmt.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs)
		value := tempName + "[" + strconv.Itoa(idx) + "]"
		value = o.lowerTupleAssignmentValueForTarget(ctx, stmt, lhs, idx, value)
		targetStmt, targetDiagnostics := o.lowerTupleTargetAssignmentStmt(ctx, lhs, value, declare)
		diagnostics = append(diagnostics, targetDiagnostics...)
		stmts = append(stmts, targetStmt)
	}
	return stmts, diagnostics
}

// lowerShortDeclShadowAliases saves outer values and renames declarations whose
// initializers would otherwise refer to the new bindings in TypeScript.
func (o *LoweringOwner) lowerShortDeclShadowAliases(
	ctx lowerFileContext,
	assign *ast.AssignStmt,
) (map[types.Object]string, map[types.Object]string, []loweredStmt) {
	// Resolve the new bindings once for both old-value and new-name aliases.
	defsByName := make(map[string]types.Object)
	var defs []types.Object
	for _, expr := range assign.Lhs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" {
			continue
		}
		if obj := ctx.semPkg.source.TypesInfo.Defs[ident]; obj != nil {
			defsByName[ident.Name] = obj
			defs = append(defs, obj)
		}
	}
	if len(defs) == 0 {
		return nil, nil, nil
	}

	// Visit each initializer once. Reserve new aliases in encounter order, but
	// assign their names after all old-value aliases to preserve emitted names.
	var oldAliases, newAliases map[types.Object]string
	var newDefs []types.Object
	var prelude []loweredStmt
	reserve := func(def types.Object) {
		if _, exists := newAliases[def]; exists {
			return
		}
		if newAliases == nil {
			newAliases = make(map[types.Object]string)
		}
		newAliases[def] = ""
		newDefs = append(newDefs, def)
	}
	for _, rhs := range assign.Rhs {
		walkShortDeclValueUses(ctx.semPkg.source.TypesInfo, rhs, func(ident *ast.Ident, used types.Object) {
			def := defsByName[ident.Name]
			if def == nil || objectDeclaredInAssignRHS(used, assign) {
				return
			}

			// A package or builtin function is not a value, so its old value
			// needs no alias: it is still lowered by name after the new
			// binding, as in len := len(a).
			_, isPackage := used.(*types.PkgName)
			_, isBuiltin := used.(*types.Builtin)
			if !isPackage && !isBuiltin && oldAliases[used] == "" {
				if oldAliases == nil {
					oldAliases = make(map[types.Object]string)
				}
				alias := ctx.tempName("Shadow")
				value := o.lowerIdent(ctx, ident, false)
				oldAliases[used] = alias
				prelude = append(prelude, loweredStmt{text: "let " + alias + " = " + value})
			}
			if used != def {
				reserve(def)
			}
		})
		for _, def := range defs {
			if _, exists := newAliases[def]; !exists && o.mapIndexDefaultUsesShortDeclName(ctx, rhs, def.Name()) {
				reserve(def)
			}
		}
	}
	for _, def := range defs {
		if _, exists := newAliases[def]; !exists && shortDeclDefShadowsOuterName(ctx, def.Name(), def) {
			reserve(def)
		}
	}
	for _, def := range newDefs {
		newAliases[def] = ctx.tempName("Shadow")
	}
	return oldAliases, newAliases, prelude
}

// walkShortDeclValueUses visits initializer uses in source order, excluding type
// names, selector names, and bare literal keys from shadow alias analysis.
func walkShortDeclValueUses(info *types.Info, expr ast.Expr, visit func(*ast.Ident, types.Object)) {
	var inspect func(ast.Node) bool
	inspect = func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.Ident:
			obj := info.Uses[typed]
			if _, isType := obj.(*types.TypeName); obj != nil && !isType {
				visit(typed, obj)
			}
		case *ast.SelectorExpr:
			ast.Inspect(typed.X, inspect)
			return false
		case *ast.KeyValueExpr:
			if _, ok := typed.Key.(*ast.Ident); ok {
				ast.Inspect(typed.Value, inspect)
				return false
			}
		}
		return true
	}
	ast.Inspect(expr, inspect)
}

func shortDeclDefShadowsOuterName(ctx lowerFileContext, name string, def types.Object) bool {
	for scope := def.Parent(); scope != nil; scope = scope.Parent() {
		if scope == def.Parent() {
			continue
		}
		obj := scope.Lookup(name)
		if scope.Parent() == types.Universe {
			if obj == nil {
				return false
			}
			if _, isTypeName := obj.(*types.TypeName); isTypeName {
				return true
			}
			if _, isFunc := obj.(*types.Func); isFunc {
				return sameSourceFile(ctx, obj.Pos(), def.Pos()) && obj.Pos() < def.Pos()
			}
			return false
		}
		if obj != nil && obj.Pos().IsValid() && obj.Pos() < def.Pos() {
			return true
		}
	}
	return false
}

func sameSourceFile(ctx lowerFileContext, left token.Pos, right token.Pos) bool {
	if !left.IsValid() || !right.IsValid() || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	leftPos := sourcePos(ctx.semPkg.source, left)
	rightPos := sourcePos(ctx.semPkg.source, right)
	return leftPos.file != "" && leftPos.file == rightPos.file
}

func valueSpecUsesOuterName(ctx lowerFileContext, spec *ast.ValueSpec, name string, def types.Object) bool {
	if spec == nil || name == "" || def == nil {
		return false
	}
	usesOuter := false
	for _, value := range spec.Values {
		ast.Inspect(value, func(node ast.Node) bool {
			ident, ok := node.(*ast.Ident)
			if !ok || ident.Name != name {
				return true
			}
			obj := ctx.semPkg.source.TypesInfo.Uses[ident]
			if obj != nil && obj != def {
				usesOuter = true
				return false
			}
			return true
		})
		if usesOuter {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) mapIndexDefaultUsesShortDeclName(
	ctx lowerFileContext,
	rhs ast.Expr,
	name string,
) bool {
	index, ok := unwrapParenExpr(rhs).(*ast.IndexExpr)
	if !ok || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	mapType, _ := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(index.X)).Underlying().(*types.Map)
	if mapType == nil {
		return false
	}
	named := namedStructType(mapType.Elem())
	if named == nil || named.Obj() == nil {
		return false
	}
	return safeIdentifier(named.Obj().Name()) == safeIdentifier(name) &&
		!strings.Contains(o.namedTypeExpr(ctx, named), ".")
}

func objectDeclaredInAssignRHS(obj types.Object, assign *ast.AssignStmt) bool {
	if obj == nil || assign == nil {
		return false
	}
	pos := obj.Pos()
	return pos.IsValid() && assign.Pos() < pos && pos < assign.End()
}

func (o *LoweringOwner) lowerDeclaredValue(ctx lowerFileContext, lhs ast.Expr, value string) string {
	ident, ok := lhs.(*ast.Ident)
	if !ok {
		return value
	}
	obj := ctx.semPkg.source.TypesInfo.Defs[ident]
	if obj == nil || !ctx.model.needsVarRef[obj] {
		return value
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")"
}

func (o *LoweringOwner) lowerParallelAssignStmt(ctx lowerFileContext, stmt *ast.AssignStmt) ([]loweredStmt, []Diagnostic) {
	stmts := make([]loweredStmt, 0, len(stmt.Rhs)*2)
	var diagnostics []Diagnostic
	tempPrefix := ctx.tempName("Assign") + "_"
	for idx, rhs := range stmt.Rhs {
		right, rightDiagnostics := o.lowerExpr(ctx, rhs)
		diagnostics = append(diagnostics, rightDiagnostics...)
		typeAnnotation := ""
		if idx < len(stmt.Lhs) {
			targetType := ctx.semPkg.source.TypesInfo.TypeOf(stmt.Lhs[idx])
			if targetType != nil {
				right = o.lowerValueForTarget(ctx, rhs, targetType, right)
				typeAnnotation = ": " + o.tsVariableTypeFor(ctx, targetType, false)
			}
		}
		stmts = append(stmts, loweredStmt{text: "let " + tempPrefix + strconv.Itoa(idx) + typeAnnotation + " = " + right})
	}
	for idx, lhs := range stmt.Lhs {
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		targetStmt, targetDiagnostics := o.lowerTupleTargetAssignmentStmt(ctx, lhs, tempPrefix+strconv.Itoa(idx), false)
		diagnostics = append(diagnostics, targetDiagnostics...)
		stmts = append(stmts, targetStmt)
	}
	return stmts, diagnostics
}

func allShortAssignTargetsNew(ctx lowerFileContext, exprs []ast.Expr) bool {
	for _, expr := range exprs {
		if ident, ok := expr.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		if !isShortAssignTargetNew(ctx, expr) {
			return false
		}
	}
	return true
}

func (o *LoweringOwner) tupleDeclarationNeedsElementStatements(ctx lowerFileContext, stmt *ast.AssignStmt) bool {
	return tupleDeclarationNeedsElementStatements(ctx, stmt.Lhs) ||
		tupleDeclarationRHSUsesNewName(ctx, stmt.Lhs, stmt.Rhs[0]) ||
		o.tupleAssignmentNeedsTargetConversion(ctx, stmt)
}

func tupleDeclarationNeedsElementStatements(ctx lowerFileContext, exprs []ast.Expr) bool {
	for _, expr := range exprs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" {
			continue
		}
		obj := ctx.semPkg.source.TypesInfo.Defs[ident]
		if obj != nil && (ctx.model.needsVarRef[obj] || shortDeclNeedsTypeAnnotation(obj.Type())) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) tupleAssignmentNeedsTargetConversion(ctx lowerFileContext, stmt *ast.AssignStmt) bool {
	sourceResults := tupleResultTypes(ctx, stmt.Rhs[0])
	if sourceResults == nil {
		return false
	}
	genericResults := genericCallTupleResultTypeParamIndexes(ctx, stmt.Rhs[0])
	for idx, lhs := range stmt.Lhs {
		if idx >= sourceResults.Len() {
			break
		}
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		targetType := ctx.semPkg.source.TypesInfo.TypeOf(lhs)
		if targetType == nil {
			continue
		}
		if genericResults[idx] {
			return true
		}
		value := "__tupleValue"
		if !sameIntegerRepresentation(targetType, sourceResults.At(idx).Type()) &&
			o.lowerValueForTargetTypes(ctx, targetType, sourceResults.At(idx).Type(), value, false) != value {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerTupleAssignmentValueForTarget(
	ctx lowerFileContext,
	stmt *ast.AssignStmt,
	lhs ast.Expr,
	idx int,
	value string,
) string {
	sourceResults := tupleResultTypes(ctx, stmt.Rhs[0])
	if sourceResults == nil || idx >= sourceResults.Len() {
		return value
	}
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(lhs)
	if targetType == nil {
		return value
	}

	// Each return wraps an integer result to its width.
	if !sameIntegerRepresentation(targetType, sourceResults.At(idx).Type()) {
		value = o.lowerValueForTargetTypes(ctx, targetType, sourceResults.At(idx).Type(), value, false)
	}
	if genericCallTupleResultTypeParamIndexes(ctx, stmt.Rhs[0])[idx] {
		return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")"
	}
	return value
}

func tupleDeclarationRHSUsesNewName(ctx lowerFileContext, lhs []ast.Expr, rhs ast.Expr) bool {
	names := make(map[string]bool)
	for _, expr := range lhs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" || ctx.semPkg.source.TypesInfo.Defs[ident] == nil {
			continue
		}
		names[ident.Name] = true
	}
	if len(names) == 0 {
		return false
	}
	usesName := false
	ast.Inspect(rhs, func(node ast.Node) bool {
		ident, ok := node.(*ast.Ident)
		if ok && names[ident.Name] {
			usesName = true
			return false
		}
		return true
	})
	return usesName
}

func isShortAssignTargetNew(ctx lowerFileContext, expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return false
	}
	return ctx.semPkg.source.TypesInfo.Defs[ident] != nil
}

func allBlankIdents(exprs []ast.Expr) bool {
	if len(exprs) == 0 {
		return false
	}
	for _, expr := range exprs {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name != "_" {
			return false
		}
	}
	return true
}

func labeledTextCannotPrefix(text string) bool {
	return strings.HasPrefix(text, "let ") || strings.HasPrefix(text, "var ") || strings.HasPrefix(text, "const ") || strings.HasPrefix(text, "class ")
}

func isChannelReceiveExpr(expr ast.Expr) bool {
	receive, ok := expr.(*ast.UnaryExpr)
	return ok && receive.Op == token.ARROW
}

func (o *LoweringOwner) lowerReturnStmt(ctx lowerFileContext, stmt *ast.ReturnStmt) (string, []Diagnostic) {
	if ctx.rangeBranch != nil {
		return o.lowerRangeFuncReturnStmt(ctx, stmt)
	}
	if o.returnNeedsNamedResultDefer(ctx) {
		return o.lowerNamedResultDeferReturnStmt(ctx, stmt)
	}
	if len(stmt.Results) == 0 {
		if result, ok := o.lowerNamedResultReturn(ctx); ok {
			return "return " + result, nil
		}
		return "return", nil
	}
	if len(stmt.Results) == 1 {
		expr, diagnostics := o.lowerExpr(ctx, stmt.Results[0])
		if result, ok := o.lowerTupleReturnExpr(ctx, stmt.Results[0], expr); ok {
			return result, diagnostics
		}
		if returnType := singleReturnType(ctx); returnType != nil {
			expr = borrowedReturn(ctx, stmt.Results, 0, expr, o.lowerValueForTarget(ctx, stmt.Results[0], returnType, expr))
			if genericCallResultUsesTypeParam(ctx, stmt.Results[0]) {
				expr = "(" + expr + " as " + o.tsTypeFor(ctx, returnType) + ")"
			}
		}
		expr = elideTailReturnAwait(ctx, stmt.Results[0], expr)
		return "return " + expr, diagnostics
	}
	parts := make([]string, 0, len(stmt.Results))
	var diagnostics []Diagnostic
	for idx, result := range stmt.Results {
		expr, exprDiagnostics := o.lowerExpr(ctx, result)
		diagnostics = append(diagnostics, exprDiagnostics...)
		if ctx.signature != nil && ctx.signature.Results() != nil && idx < ctx.signature.Results().Len() {
			expr = borrowedReturn(ctx, stmt.Results, idx, expr, o.lowerValueForTarget(ctx, result, ctx.signature.Results().At(idx).Type(), expr))
		}
		parts = append(parts, expr)
	}
	return "return [" + strings.Join(parts, ", ") + "]", diagnostics
}

func (o *LoweringOwner) returnNeedsNamedResultDefer(ctx lowerFileContext) bool {
	if ctx.deferState == nil || !ctx.deferState.used || ctx.signature == nil || ctx.signature.Results() == nil {
		return false
	}
	for result := range ctx.signature.Results().Variables() {
		if result.Name() != "" {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerNamedResultDeferReturnStmt(ctx lowerFileContext, stmt *ast.ReturnStmt) (string, []Diagnostic) {
	var diagnostics []Diagnostic
	var lines []string
	explicitTemp := ""
	if len(stmt.Results) != 0 {
		var value string
		var values []string
		if len(stmt.Results) == 1 && ctx.signature.Results().Len() > 1 {
			expr, exprDiagnostics := o.lowerExpr(ctx, stmt.Results[0])
			diagnostics = append(diagnostics, exprDiagnostics...)
			if prefix, tuple, ok := o.lowerTupleReturnValue(ctx, stmt.Results[0], expr); ok {
				lines = append(lines, prefix)
				value = tuple
			} else {
				value = expr
			}
		} else {
			values = make([]string, 0, len(stmt.Results))
			for idx, result := range stmt.Results {
				expr, exprDiagnostics := o.lowerExpr(ctx, result)
				diagnostics = append(diagnostics, exprDiagnostics...)
				if idx < ctx.signature.Results().Len() {
					expr = o.lowerValueForTarget(ctx, result, ctx.signature.Results().At(idx).Type(), expr)
				}
				values = append(values, expr)
			}
		}
		temp := ctx.tempName("Return")
		explicitTemp = temp
		tempType := o.tsSignatureResultFor(ctx, ctx.signature)
		if value != "" {
			lines = append(lines, "const "+temp+": "+tempType+" = "+value)
		} else if len(values) == 1 {
			lines = append(lines, "const "+temp+": "+tempType+" = "+values[0])
		} else {
			lines = append(lines, "const "+temp+": "+tempType+" = ["+strings.Join(values, ", ")+"]")
		}
		for idx := range ctx.signature.Results().Len() {
			result := ctx.signature.Results().At(idx)
			name := result.Name()
			if name == "" || name == "_" {
				continue
			}
			target := safeIdentifier(name)
			if ctx.model.needsVarRef[result] {
				target += ".value"
			}
			source := temp
			if ctx.signature.Results().Len() > 1 {
				source += "[" + strconv.Itoa(idx) + "]"
			}
			lines = append(lines, target+" = "+source)
		}
	}
	lines = append(lines, o.lowerDeferDisposeStmt(ctx))
	if result, ok := o.lowerNamedResultReturnWithExplicitTemp(ctx, explicitTemp); ok {
		lines = append(lines, "return "+result)
	} else {
		lines = append(lines, "return")
	}
	return strings.Join(lines, "\n"), diagnostics
}

func (o *LoweringOwner) lowerNamedResultReturnWithExplicitTemp(ctx lowerFileContext, explicitTemp string) (string, bool) {
	if explicitTemp == "" {
		return o.lowerNamedResultReturn(ctx)
	}
	parts := make([]string, 0, ctx.signature.Results().Len())
	hasNamedResult := false
	multi := ctx.signature.Results().Len() > 1
	for idx := range ctx.signature.Results().Len() {
		result := ctx.signature.Results().At(idx)
		name := result.Name()
		if name == "" || name == "_" {
			source := explicitTemp
			if multi {
				source += "[" + strconv.Itoa(idx) + "]"
			}
			parts = append(parts, source)
			if name != "" {
				hasNamedResult = true
			}
			continue
		}
		hasNamedResult = true
		parts = append(parts, o.lowerNamedResultValue(ctx, result))
	}
	if !hasNamedResult {
		return "", false
	}
	if len(parts) == 1 {
		return parts[0], true
	}
	return "[" + strings.Join(parts, ", ") + "]", true
}

func (o *LoweringOwner) lowerDeferDisposeStmt(ctx lowerFileContext) string {
	if ctx.deferState != nil && ctx.deferState.async {
		return "await __defer.dispose()"
	}
	return "__defer.dispose()"
}

func (o *LoweringOwner) lowerBodylessReturnStmt(ctx lowerFileContext, signature *types.Signature) (string, bool) {
	if signature.Results().Len() == 0 {
		return "", false
	}
	if signature.Results().Len() == 1 {
		result := signature.Results().At(0)
		return "return " + o.lowerDeclarationZeroValueExpr(ctx, result.Type()), true
	}
	results := make([]string, 0, signature.Results().Len())
	for result := range signature.Results().Variables() {
		results = append(results, o.lowerDeclarationZeroValueExpr(ctx, result.Type()))
	}
	return "return [" + strings.Join(results, ", ") + "]", true
}

func (o *LoweringOwner) lowerRangeFuncReturnStmt(ctx lowerFileContext, stmt *ast.ReturnStmt) (string, []Diagnostic) {
	if len(stmt.Results) == 0 {
		if result, ok := o.lowerNamedResultReturn(ctx); ok {
			return ctx.rangeBranch.hasReturn + " = true\n" + ctx.rangeBranch.value + " = " + result + "\nreturn false", nil
		}
		return ctx.rangeBranch.hasReturn + " = true\nreturn false", nil
	}
	if len(stmt.Results) == 1 {
		expr, diagnostics := o.lowerExpr(ctx.withoutRangeBranch(), stmt.Results[0])
		if result, ok := o.lowerTupleRangeReturnExpr(ctx, stmt.Results[0], expr); ok {
			return result, diagnostics
		}
		if returnType := singleReturnType(ctx); returnType != nil {
			expr = o.lowerValueForTarget(ctx, stmt.Results[0], returnType, expr)
		}
		return ctx.rangeBranch.hasReturn + " = true\n" + ctx.rangeBranch.value + " = " + expr + "\nreturn false", diagnostics
	}
	parts := make([]string, 0, len(stmt.Results))
	var diagnostics []Diagnostic
	for idx, result := range stmt.Results {
		expr, exprDiagnostics := o.lowerExpr(ctx.withoutRangeBranch(), result)
		diagnostics = append(diagnostics, exprDiagnostics...)
		if ctx.signature != nil && ctx.signature.Results() != nil && idx < ctx.signature.Results().Len() {
			expr = o.lowerValueForTarget(ctx.withoutRangeBranch(), result, ctx.signature.Results().At(idx).Type(), expr)
		}
		parts = append(parts, expr)
	}
	return ctx.rangeBranch.hasReturn + " = true\n" + ctx.rangeBranch.value + " = [" + strings.Join(parts, ", ") + "]\nreturn false", diagnostics
}

// elideTailReturnAwait drops tail await only after the caller is already known
// async. Function literal lowering still uses await as evidence that the
// generated callback itself must become async.
func elideTailReturnAwait(ctx lowerFileContext, result ast.Expr, expr string) string {
	if !ctx.asyncFunction || ctx.deferState != nil && ctx.deferState.used {
		return expr
	}
	if _, ok := unwrapParenExpr(result).(*ast.CallExpr); !ok {
		return expr
	}
	if call, ok := conditionalAwaitCall(expr); ok {
		return call
	}
	return strings.TrimPrefix(expr, "await ")
}

// conditionalAwaitCall returns the call of a conditional await made by
// conditionalAwait, so that it can be returned without awaiting it.
func conditionalAwaitCall(expr string) (string, bool) {
	// The wrapper is the text conditionalAwait puts around the call, with
	// the assertion of a result type dropped, since the returned call is
	// checked against the result type of the function that returns it.
	t := conditionalAwaitTemp
	prefix := "(" + t + " = "
	suffix := ", " + t + " instanceof Promise ? await " + t + " : " + t + ")"
	if typed, ok := strings.CutPrefix(expr, "("); ok && strings.HasPrefix(typed, prefix) && strings.HasSuffix(typed, ")") {
		if end := strings.LastIndex(typed, suffix+" as "); end >= 0 {
			expr = typed[:end+len(suffix)]
		}
	}
	if !strings.HasPrefix(expr, prefix) || !strings.HasSuffix(expr, suffix) {
		return "", false
	}
	call := expr[len(prefix) : len(expr)-len(suffix)]

	// A nested conditional await would make the call text ambiguous.
	if strings.Contains(call, suffix) {
		return "", false
	}
	return call, true
}

func singleReturnType(ctx lowerFileContext) types.Type {
	if ctx.signature == nil || ctx.signature.Results() == nil || ctx.signature.Results().Len() != 1 {
		return nil
	}
	return ctx.signature.Results().At(0).Type()
}

func (o *LoweringOwner) lowerTupleReturnExpr(ctx lowerFileContext, expr ast.Expr, value string) (string, bool) {
	prefix, tuple, ok := o.lowerTupleReturnValue(ctx, expr, value)
	if !ok {
		return "", false
	}
	return prefix + "\nreturn " + tuple, true
}

func (o *LoweringOwner) lowerTupleRangeReturnExpr(ctx lowerFileContext, expr ast.Expr, value string) (string, bool) {
	prefix, tuple, ok := o.lowerTupleReturnValue(ctx.withoutRangeBranch(), expr, value)
	if !ok {
		return "", false
	}
	return prefix + "\n" + ctx.rangeBranch.hasReturn + " = true\n" +
		ctx.rangeBranch.value + " = " + tuple + "\nreturn false", true
}

func (o *LoweringOwner) lowerTupleReturnValue(ctx lowerFileContext, expr ast.Expr, value string) (string, string, bool) {
	if ctx.signature == nil || ctx.signature.Results() == nil || ctx.signature.Results().Len() < 2 {
		return "", "", false
	}
	sourceResults := tupleResultTypes(ctx, expr)
	if sourceResults == nil || sourceResults.Len() != ctx.signature.Results().Len() {
		return "", "", false
	}
	temp := ctx.tempName("Return")
	genericResults := genericCallTupleResultTypeParamIndexes(ctx, expr)
	parts := make([]string, 0, sourceResults.Len())
	changed := false
	for idx := range sourceResults.Len() {
		part := temp + "[" + strconv.Itoa(idx) + "]"
		targetType := ctx.signature.Results().At(idx).Type()
		converted := part
		if !sameIntegerRepresentation(targetType, sourceResults.At(idx).Type()) {
			converted = o.lowerValueForTargetTypes(ctx, targetType, sourceResults.At(idx).Type(), part, false)
		}
		if genericResults[idx] {
			converted = "(" + converted + " as " + o.tsTypeFor(ctx, targetType) + ")"
		}
		if converted != part {
			changed = true
		}
		part = converted
		parts = append(parts, part)
	}
	if !changed {
		return "", "", false
	}
	return "const " + temp + " = " + value, "[" + strings.Join(parts, ", ") + "]", true
}

func tupleResultTypes(ctx lowerFileContext, expr ast.Expr) *types.Tuple {
	if tuple, ok := ctx.semPkg.source.TypesInfo.TypeOf(expr).(*types.Tuple); ok {
		return tuple
	}
	// A conversion to a function type yields one function value, not the
	// results of its signature.
	call, ok := ast.Unparen(expr).(*ast.CallExpr)
	if !ok || ctx.semPkg.source.TypesInfo.Types[call.Fun].IsType() {
		return nil
	}
	signature := callTargetSignature(ctx, call.Fun)
	if signature == nil || signature.Results() == nil || signature.Results().Len() < 2 {
		return nil
	}
	return signature.Results()
}

func genericCallResultUsesTypeParam(ctx lowerFileContext, expr ast.Expr) bool {
	call, ok := ast.Unparen(expr).(*ast.CallExpr)
	if !ok {
		return false
	}
	signature := genericFunctionSignatureForCall(ctx, call.Fun)
	if signature == nil {
		signature = sourceFunctionSignatureForCall(ctx, call.Fun)
	}
	if signature == nil || signature.Results() == nil || signature.Results().Len() != 1 {
		return false
	}
	return typeContainsTypeParam(signature.Results().At(0).Type())
}

func genericCallTupleResultTypeParamIndexes(ctx lowerFileContext, expr ast.Expr) map[int]bool {
	call, ok := ast.Unparen(expr).(*ast.CallExpr)
	if !ok {
		return nil
	}
	signature := genericFunctionSignatureForCall(ctx, call.Fun)
	if signature == nil {
		signature = sourceFunctionSignatureForCall(ctx, call.Fun)
	}
	if signature == nil || signature.Results() == nil || signature.Results().Len() < 2 {
		return nil
	}
	indexes := make(map[int]bool)
	for idx := range signature.Results().Len() {
		if typeContainsTypeParam(signature.Results().At(idx).Type()) {
			indexes[idx] = true
		}
	}
	return indexes
}

func genericFunctionSignatureForCall(ctx lowerFileContext, fun ast.Expr) *types.Signature {
	for {
		switch typed := ast.Unparen(fun).(type) {
		case *ast.IndexExpr:
			fun = typed.X
		case *ast.IndexListExpr:
			fun = typed.X
		default:
			return genericFunctionSignature(ctx, fun)
		}
	}
}

func sourceFunctionSignatureForCall(ctx lowerFileContext, fun ast.Expr) *types.Signature {
	for {
		switch typed := ast.Unparen(fun).(type) {
		case *ast.IndexExpr:
			fun = typed.X
		case *ast.IndexListExpr:
			fun = typed.X
		default:
			if ctx.semPkg == nil || ctx.semPkg.source == nil {
				return nil
			}
			fn := calledFunction(ctx.semPkg.source, fun)
			if fn == nil {
				return nil
			}
			if origin := fn.Origin(); origin != nil {
				fn = origin
			}
			signature, _ := fn.Type().(*types.Signature)
			return signature
		}
	}
}

func typeContainsTypeParam(typ types.Type) bool {
	return typeContainsTypeParamSeen(typ, make(map[types.Type]bool))
}

func typeContainsTypeParamSeen(typ types.Type, seen map[types.Type]bool) bool {
	if typ == nil {
		return false
	}
	if seen[typ] {
		return false
	}
	seen[typ] = true
	if _, ok := types.Unalias(typ).(*types.TypeParam); ok {
		return true
	}
	switch typed := types.Unalias(typ).(type) {
	case *types.Named:
		if args := typed.TypeArgs(); args != nil {
			for t := range args.Types() {
				if typeContainsTypeParamSeen(t, seen) {
					return true
				}
			}
		}
	case *types.Alias:
		if args := typed.TypeArgs(); args != nil {
			for t := range args.Types() {
				if typeContainsTypeParamSeen(t, seen) {
					return true
				}
			}
		}
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Array:
		return typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Slice:
		return typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Map:
		return typeContainsTypeParamSeen(typed.Key(), seen) || typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Chan:
		return typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Pointer:
		return typeContainsTypeParamSeen(typed.Elem(), seen)
	case *types.Signature:
		return tupleContainsTypeParamSeen(typed.Params(), seen) || tupleContainsTypeParamSeen(typed.Results(), seen)
	case *types.Struct:
		for field := range typed.Fields() {
			if typeContainsTypeParamSeen(field.Type(), seen) {
				return true
			}
		}
		return false
	default:
		return false
	}
}

func tupleContainsTypeParamSeen(tuple *types.Tuple, seen map[types.Type]bool) bool {
	if tuple == nil {
		return false
	}
	for v := range tuple.Variables() {
		if typeContainsTypeParamSeen(v.Type(), seen) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerNamedResults(ctx lowerFileContext, signature *types.Signature) []loweredNamedResult {
	if signature == nil || signature.Results() == nil {
		return nil
	}
	results := make([]loweredNamedResult, 0, signature.Results().Len())
	for result := range signature.Results().Variables() {
		name := result.Name()
		if name == "" || name == "_" {
			continue
		}
		needsVarRef := ctx.model.needsVarRef[result]
		zero := o.lowerDeclarationZeroValueExpr(ctx, result.Type())
		returnExpr := safeIdentifier(name)
		if needsVarRef {
			zero = o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + zero + ")"
			returnExpr += ".value"
		}
		typ := o.tsVariableTypeFor(ctx, result.Type(), needsVarRef)
		if o.inferredValueType(zero) == typ {
			typ = ""
		}
		results = append(results, loweredNamedResult{
			name:       safeIdentifier(name),
			typ:        typ,
			zero:       zero,
			returnExpr: returnExpr,
		})
	}
	return results
}

func (o *LoweringOwner) lowerNamedResultReturn(ctx lowerFileContext) (string, bool) {
	if ctx.signature == nil || ctx.signature.Results() == nil || ctx.signature.Results().Len() == 0 {
		return "", false
	}
	parts := make([]string, 0, ctx.signature.Results().Len())
	hasNamedResult := false
	for result := range ctx.signature.Results().Variables() {
		name := result.Name()
		if name == "" {
			parts = append(parts, o.lowerDeclarationZeroValueExpr(ctx, result.Type()))
			continue
		}
		hasNamedResult = true
		if name == "_" {
			parts = append(parts, o.lowerDeclarationZeroValueExpr(ctx, result.Type()))
			continue
		}
		parts = append(parts, o.lowerNamedResultValue(ctx, result))
	}
	if !hasNamedResult {
		return "", false
	}
	if len(parts) == 1 {
		return parts[0], true
	}
	return "[" + strings.Join(parts, ", ") + "]", true
}

// lowerNamedResultValue returns the value of a named result to return. A
// struct or array result that another reference can reach, through its
// address or a function literal, is copied, so that the caller gets a value
// of its own.
func (o *LoweringOwner) lowerNamedResultValue(ctx lowerFileContext, result *types.Var) string {
	// A variable reference result is read through its value.
	value := safeIdentifier(result.Name())
	if ctx.model.needsVarRef[result] {
		value += ".value"
	}

	// Only a struct or array result that another reference can reach is copied.
	if !isStructValueType(result.Type()) && !isArrayType(result.Type()) {
		return value
	}
	if !ctx.model.needsVarRef[result] && !namedResultUsedInFuncLit(ctx, result) {
		return value
	}
	return o.lowerValueForTargetTypes(ctx, result.Type(), result.Type(), value, true)
}

// namedResultUsedInFuncLit reports whether a function literal in the function
// that declares result refers to it.
func namedResultUsedInFuncLit(ctx lowerFileContext, result *types.Var) bool {
	// Without the syntax, assume that a function literal uses the result.
	if ctx.file == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return true
	}

	// Find the body of the function that declares the result.
	var body *ast.BlockStmt
	ast.Inspect(ctx.file, func(node ast.Node) bool {
		if body != nil || node == nil || node.Pos() > result.Pos() || node.End() <= result.Pos() {
			return false
		}
		switch typed := node.(type) {
		case *ast.FuncDecl:
			if typed.Body != nil && typed.Type.Pos() <= result.Pos() && result.Pos() < typed.Type.End() {
				body = typed.Body
			}
		case *ast.FuncLit:
			if typed.Type.Pos() <= result.Pos() && result.Pos() < typed.Type.End() {
				body = typed.Body
			}
		}
		return body == nil
	})
	if body == nil {
		return true
	}

	// Look for a use of the result inside a function literal of the body.
	info := ctx.semPkg.source.TypesInfo
	used := false
	ast.Inspect(body, func(node ast.Node) bool {
		// Stop at the first use.
		if used {
			return false
		}

		lit, ok := node.(*ast.FuncLit)
		if !ok {
			return true
		}

		// A function literal that mentions the result uses it.
		ast.Inspect(lit.Body, func(node ast.Node) bool {
			if ident, ok := node.(*ast.Ident); ok && info.Uses[ident] == result {
				used = true
			}
			return !used
		})
		return false
	})
	return used
}

// recoverReturnStmt builds the return statement a defer+recover function runs
// after its deferred recover() swallows a panic: the named results, the zero
// values for unnamed results, or an empty string for a void function (which
// falls through and returns undefined).
func (o *LoweringOwner) recoverReturnStmt(ctx lowerFileContext, signature *types.Signature) string {
	if signature == nil || signature.Results() == nil || signature.Results().Len() == 0 {
		return ""
	}
	if expr, ok := o.lowerNamedResultReturn(ctx); ok {
		return "return " + expr
	}
	if zeroReturn, ok := o.lowerBodylessReturnStmt(ctx, signature); ok {
		return zeroReturn
	}
	return ""
}

func (o *LoweringOwner) lowerForStmt(ctx lowerFileContext, stmt *ast.ForStmt) (loweredStmt, []Diagnostic) {
	bodyCtx := ctx.withoutRangeLoopBranches().withoutLoopLabel()
	loopLabel := ""
	if !ctx.noGoto && stmtsWrapGotoLoop(stmt.Body.List, true) {
		loopLabel = ctx.tempName("Loop")
		bodyCtx = bodyCtx.withLoopLabel(loopLabel)
	}
	initCtx := ctx
	loopCtx := ctx
	var initPrelude []loweredStmt
	if assign, ok := stmt.Init.(*ast.AssignStmt); ok && assign.Tok == token.DEFINE {
		oldAliases, newAliases, prelude := o.lowerShortDeclShadowAliases(ctx, assign)
		if len(oldAliases) != 0 || len(newAliases) != 0 {
			initCtx = ctx.withIdentAliases(oldAliases).withIdentRefAliases(newAliases)
			loopCtx = ctx.withIdentRefAliases(newAliases)
			bodyCtx = bodyCtx.withIdentRefAliases(newAliases)
			initPrelude = prelude
		}
	}

	// The slices that the loop indexes read their windows once (see
	// loopSliceWindows), declared in the init clause, which must then be
	// empty or a declaration.
	windows, windowDecls := o.loopSliceWindows(ctx, stmt, nil, "", stmt.Init, stmt.Cond, stmt.Post, stmt.Body)
	if stmt.Init == nil && stmt.Post == nil {
		// A loop with only a condition reads its windows in the init clause
		// of a for loop.
		loopCtx = loopCtx.withLoopSliceWindows(windows)
		bodyCtx = bodyCtx.withLoopSliceWindows(windows)
		cond := "true"
		var diagnostics []Diagnostic
		if stmt.Cond != nil {
			var condDiagnostics []Diagnostic
			cond, condDiagnostics = o.lowerExpr(loopCtx, stmt.Cond)
			diagnostics = append(diagnostics, condDiagnostics...)
		}
		body, bodyDiagnostics := o.lowerBlock(bodyCtx, stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)

		// The loop runs while its condition holds.
		text := "while (" + cond + ")"
		if len(windowDecls) != 0 {
			text = "for (let " + strings.Join(windowDecls, ", ") + "; " + cond + "; )"
		}
		if loopLabel != "" {
			text = loopLabel + ": " + text
		}
		return loweredStmt{
			hasBlock: true,
			text:     text,
			children: body,
		}, diagnostics
	}

	// Other loops lower their three clauses into a for loop.
	init := ""
	var diagnostics []Diagnostic
	if stmt.Init != nil {
		lowered, initDiagnostics := o.lowerForInitStmt(initCtx, stmt.Init)
		diagnostics = append(diagnostics, initDiagnostics...)
		init = lowered
	}

	// The windows join an init clause that is empty or a declaration.
	if withWindows, ok := prependLoopInit(init, windowDecls); ok {
		init = withWindows
		loopCtx = loopCtx.withLoopSliceWindows(windows)
		bodyCtx = bodyCtx.withLoopSliceWindows(windows)
	}

	// The condition and post statement read through the windows.
	cond := ""
	if stmt.Cond != nil {
		var condDiagnostics []Diagnostic
		cond, condDiagnostics = o.lowerExpr(loopCtx, stmt.Cond)
		diagnostics = append(diagnostics, condDiagnostics...)
	}
	post := ""
	if stmt.Post != nil {
		lowered, postDiagnostics := o.lowerForPostStmt(loopCtx, stmt.Post)
		diagnostics = append(diagnostics, postDiagnostics...)
		post = lowered
	}

	// So does the body, which the init prelude, if any, precedes.
	body, bodyDiagnostics := o.lowerBlock(bodyCtx, stmt.Body)
	diagnostics = append(diagnostics, bodyDiagnostics...)
	text := "for (" + init + "; " + cond + "; " + post + ")"
	if loopLabel != "" {
		text = loopLabel + ": " + text
	}
	forStmt := loweredStmt{
		hasBlock: true,
		text:     text,
		children: body,
	}
	if len(initPrelude) != 0 {
		return loweredStmt{children: append(initPrelude, forStmt)}, diagnostics
	}
	return forStmt, diagnostics
}

func (o *LoweringOwner) lowerForInitStmt(ctx lowerFileContext, stmt ast.Stmt) (string, []Diagnostic) {
	assign, ok := stmt.(*ast.AssignStmt)
	if !ok {
		lowered, diagnostics := o.lowerStmt(ctx, stmt)
		if len(lowered) == 0 {
			return "", diagnostics
		}
		return strings.TrimSuffix(lowered[0].text, ";"), diagnostics
	}
	if assign.Tok == token.DEFINE && len(assign.Rhs) > 1 && len(assign.Lhs) == len(assign.Rhs) {
		parts := make([]string, 0, len(assign.Lhs))
		var diagnostics []Diagnostic
		for idx, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
				continue
			}
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, true)
			right, rightDiagnostics := o.lowerExpr(ctx, assign.Rhs[idx])
			diagnostics = append(diagnostics, leftDiagnostics...)
			diagnostics = append(diagnostics, rightDiagnostics...)
			right = o.lowerDeclaredValue(ctx, lhs, right)
			parts = append(parts, left+" = "+right)
		}
		return "let " + strings.Join(parts, ", "), diagnostics
	}
	if len(assign.Rhs) == 1 && len(assign.Lhs) > 1 {
		right, diagnostics := o.lowerTupleExpr(ctx, assign.Rhs[0])
		lefts := make([]string, 0, len(assign.Lhs))
		for _, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
				lefts = append(lefts, "")
				continue
			}
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, assign.Tok == token.DEFINE)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		if assign.Tok == token.DEFINE {
			if allShortAssignTargetsNew(ctx, assign.Lhs) && !o.tupleDeclarationNeedsElementStatements(ctx, assign) {
				return "let [" + strings.Join(lefts, ", ") + "] = " + right, diagnostics
			}
			tempName := ctx.tempName("Tuple")
			parts := []string{tempName + " = " + right}
			for idx, lhs := range assign.Lhs {
				if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
					continue
				}
				value := o.lowerTupleAssignmentValueForTarget(ctx, assign, lhs, idx, tempName+"["+strconv.Itoa(idx)+"]")
				value = o.lowerDeclaredValue(ctx, lhs, value)
				parts = append(parts, lefts[idx]+" = "+value)
			}
			return "let " + strings.Join(parts, ", "), diagnostics
		}
		return "[" + strings.Join(lefts, ", ") + "] = " + right, diagnostics
	}
	lowered, diagnostics := o.lowerStmt(ctx, stmt)
	if len(lowered) == 0 {
		return "", diagnostics
	}
	return strings.TrimSuffix(lowered[0].text, ";"), diagnostics
}

func (o *LoweringOwner) lowerForPostStmt(ctx lowerFileContext, stmt ast.Stmt) (string, []Diagnostic) {
	if assign, ok := stmt.(*ast.AssignStmt); ok && len(assign.Rhs) == 1 && len(assign.Lhs) > 1 {
		right, diagnostics := o.lowerTupleExpr(ctx, assign.Rhs[0])
		lefts := make([]string, 0, len(assign.Lhs))
		for _, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
				lefts = append(lefts, "")
				continue
			}
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, false)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		return "[" + strings.Join(lefts, ", ") + "] = " + right, diagnostics
	}
	if assign, ok := stmt.(*ast.AssignStmt); ok && assign.Tok == token.ASSIGN && len(assign.Rhs) > 1 && len(assign.Rhs) == len(assign.Lhs) {
		lefts := make([]string, 0, len(assign.Lhs))
		rights := make([]string, 0, len(assign.Rhs))
		var diagnostics []Diagnostic
		for _, lhs := range assign.Lhs {
			left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, false)
			diagnostics = append(diagnostics, leftDiagnostics...)
			lefts = append(lefts, left)
		}
		for idx, rhs := range assign.Rhs {
			right, rightDiagnostics := o.lowerExpr(ctx, rhs)
			diagnostics = append(diagnostics, rightDiagnostics...)
			if idx < len(assign.Lhs) {
				targetType := ctx.semPkg.source.TypesInfo.TypeOf(assign.Lhs[idx])
				right = o.lowerValueForTarget(ctx, rhs, targetType, right)
			}
			rights = append(rights, right)
		}
		return "[" + strings.Join(lefts, ", ") + "] = [" + strings.Join(rights, ", ") + "]", diagnostics
	}

	// A statement that lowers to one statement is the post expression.
	lowered, diagnostics := o.lowerStmt(ctx, stmt)
	if len(lowered) == 0 {
		return "", diagnostics
	}
	if len(lowered) == 1 && len(lowered[0].children) == 0 {
		return strings.TrimSuffix(lowered[0].text, ";"), diagnostics
	}

	// Several statements, such as the temporaries of a compound assignment,
	// run in a function of their own.
	var body strings.Builder
	renderStmts(&body, lowered, 0)
	return minMaxIIFE([]string{strings.TrimSpace(body.String())}), diagnostics
}

func (o *LoweringOwner) lowerRangeStmt(ctx lowerFileContext, stmt *ast.RangeStmt) (loweredStmt, []Diagnostic) {
	rangeValue, diagnostics := o.lowerExpr(ctx, stmt.X)
	aliases := o.lowerRangeDeclShadowAliases(ctx, stmt)
	bodyCtx := ctx.withoutLoopLabel()
	loopPrefix := ""
	if !ctx.noGoto && stmtsWrapGotoLoop(stmt.Body.List, true) {
		loopLabel := ctx.tempName("Loop")
		loopPrefix = loopLabel + ": "
		bodyCtx = bodyCtx.withLoopLabel(loopLabel)
	}
	if len(aliases) != 0 {
		bodyCtx = bodyCtx.withIdentRefAliases(aliases)
	}

	keyName := rangeKeyNameFor(ctx, stmt.Key, aliases)
	valueName := rangeKeyNameFor(ctx, stmt.Value, aliases)
	rangeType := typeParamCoreType(ctx.semPkg.source.TypesInfo.TypeOf(stmt.X))

	// A range that assigns existing variables, fields or elements instead of
	// declaring its key and value loops over temporaries of its own, which
	// each iteration assigns to them first, as Go does.
	var assigns []loweredStmt
	if stmt.Tok == token.ASSIGN && !isMapType(rangeType) && !isFunctionType(rangeType) {
		var keyAssigns, valueAssigns []loweredStmt
		var keyDiagnostics, valueDiagnostics []Diagnostic
		keyName, keyAssigns, keyDiagnostics = o.lowerRangeAssignment(ctx, stmt.Key, "RangeKey")
		valueName, valueAssigns, valueDiagnostics = o.lowerRangeAssignment(ctx, stmt.Value, "RangeValue")
		assigns = append(keyAssigns, valueAssigns...)
		diagnostics = append(append(diagnostics, keyDiagnostics...), valueDiagnostics...)
	}
	lowerBody := func(bodyCtx lowerFileContext) ([]loweredStmt, []Diagnostic) {
		body, bodyDiagnostics := o.lowerBlock(bodyCtx, stmt.Body)
		return append(slices.Clone(assigns), body...), bodyDiagnostics
	}

	if isChannelType(rangeType) {
		body, bodyDiagnostics := lowerBody(bodyCtx.withoutRangeLoopBranches())
		diagnostics = append(diagnostics, bodyDiagnostics...)
		tempName := ctx.tempName("Range")
		children := []loweredStmt{
			{text: "let " + tempName + " = await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecvWithOk) + "(" + rangeValue + ")"},
			{text: "if (!" + tempName + ".ok)", children: []loweredStmt{{text: "break"}}},
		}
		if keyName != "" {
			children = append(children, loweredStmt{text: "let " + keyName + " = " + tempName + ".value"})
		}
		children = append(children, body...)
		return loweredStmt{
			hasBlock: true,
			text:     loopPrefix + "while (true)",
			children: children,
		}, diagnostics
	}
	if isIntegerRangeType(rangeType) {
		// The slices that the loop indexes read their windows once (see
		// loopSliceWindows).
		windows, windowDecls := o.loopSliceWindows(ctx, stmt, nil, "", stmt.Key, stmt.Value, stmt.Body)
		intCtx := bodyCtx.withoutRangeLoopBranches().withLoopSliceWindows(windows)
		body, bodyDiagnostics := lowerBody(intCtx)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		if keyName == "" {
			keyName = "__rangeIndex"
		}
		counter, body := o.rangeCounter(ctx, stmt, keyName, body)

		// The counter takes the range type's representation. Go evaluates
		// the count once, so a count that is not constant is held in a temp.
		init := counter + " = 0"
		if isBigIntBackedType(rangeType) {
			init += "n"
		}
		bound := rangeValue
		if ctx.semPkg.source.TypesInfo.Types[stmt.X].Value == nil {
			bound = ctx.tempName("RangeCount")
			init = bound + " = " + rangeValue + ", " + init
		}
		init = strings.Join(append(windowDecls, init), ", ")
		return loweredStmt{
			hasBlock: true,
			text:     loopPrefix + "for (let " + init + "; " + counter + " < " + bound + "; " + counter + "++)",
			children: body,
		}, diagnostics
	}
	if isMapType(rangeType) {
		body, bodyDiagnostics := o.lowerBlock(bodyCtx.withoutRangeLoopBranches(), stmt.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		rangeTarget := rangeValue
		if strings.HasPrefix(rangeTarget, "await ") {
			rangeTarget = "(" + rangeTarget + ")"
		}
		key, keyBindings, keyDiagnostics := o.lowerMapRangeBinding(ctx, stmt.Key, keyName, "__rangeKey", "RangeKey", stmt.Tok == token.DEFINE, stmt.Body)
		value, valueBindings, valueDiagnostics := o.lowerMapRangeBinding(ctx, stmt.Value, valueName, "__rangeValue", "RangeValue", stmt.Tok == token.DEFINE, stmt.Body)
		diagnostics = append(diagnostics, keyDiagnostics...)
		diagnostics = append(diagnostics, valueDiagnostics...)
		binding := "const"
		if rangeBindingAssignedInBody(ctx, stmt.Key, stmt.Body) ||
			rangeBindingAssignedInBody(ctx, stmt.Value, stmt.Body) {
			binding = "let"
		}
		children := append(keyBindings, valueBindings...)
		children = append(children, body...)
		return loweredStmt{
			hasBlock: true,
			text:     loopPrefix + "for (" + binding + " [" + key + ", " + value + "] of " + rangeTarget + "?.entries() ?? [])",
			children: children,
		}, diagnostics
	}
	if isStringType(rangeType) {
		// The body is lowered first, and the key and value get names.
		body, bodyDiagnostics := lowerBody(bodyCtx.withoutRangeLoopBranches())
		diagnostics = append(diagnostics, bodyDiagnostics...)
		key := keyName
		if key == "" {
			key = "__rangeIndex"
		}
		value := valueName
		if value == "" {
			value = "__rangeRune"
		}

		// The key and value are constants unless the body assigns them.
		binding := "const"
		if rangeBindingAssignedInBody(ctx, stmt.Key, stmt.Body) ||
			rangeBindingAssignedInBody(ctx, stmt.Value, stmt.Body) {
			binding = "let"
		}

		// The runes are read from an iterator that allocates nothing for
		// each rune, and bound to the key and value at the start of the body.
		runes := ctx.tempName("Runes")
		var bindings []loweredStmt
		if keyName != "" {
			bindings = append(bindings, loweredStmt{text: binding + " " + key + " = " + runes + ".index"})
		}
		if valueName != "" {
			bindings = append(bindings, loweredStmt{text: binding + " " + value + " = " + runes + ".rune"})
		}
		return loweredStmt{
			hasBlock: true,
			text:     loopPrefix + "for (let " + runes + " = " + o.runtimeOwner.QualifiedHelper(RuntimeHelperStringRunes) + "(" + rangeValue + "); " + runes + ".next(); )",
			children: append(bindings, body...),
		}, diagnostics
	}
	if isFunctionType(rangeType) {
		signature := rangeFunctionSignature(rangeType)
		if signature == nil {
			return loweredStmt{}, append(diagnostics, loweringUnsupportedAt(ctx, stmt, "statement", ctx.semPkg.pkgPath, "unsupported function range signature"))
		}
		lowered, funcDiagnostics := o.lowerRangeFuncStmt(ctx, stmt, rangeValue, signature)
		diagnostics = append(diagnostics, funcDiagnostics...)
		return lowered, diagnostics
	}

	// The window of the slice or array is read once, as Go evaluates the
	// length once, and its elements are read from its backing array
	// directly, which is much faster than through a slice proxy.
	rangeWindow := ctx.tempName("RangeWindow")
	indexName := keyName
	if indexName == "" {
		indexName = "__rangeIndex"
	}
	loopCtx := bodyCtx.withoutRangeLoopBranches()
	if access, ok := rangeElementAccessFor(ctx, stmt, rangeType, rangeWindow, indexName); ok {
		loopCtx.rangeElements = append(append([]rangeElementAccess(nil), ctx.rangeElements...), access)
	}

	// The slices that the loop indexes read their windows once (see
	// loopSliceWindows); the slice ranged over uses the loop's window.
	var ranged types.Object
	if ident, ok := ast.Unparen(stmt.X).(*ast.Ident); ok {
		if _, isSlice := types.Unalias(rangeType).Underlying().(*types.Slice); isSlice {
			ranged = ctx.semPkg.source.TypesInfo.Uses[ident]
		}
	}
	windows, windowDecls := o.loopSliceWindows(ctx, stmt, ranged, rangeWindow, stmt.Key, stmt.Value, stmt.Body)
	loopCtx = loopCtx.withLoopSliceWindows(windows)

	// The body reads the elements through the range target's window.
	body, bodyDiagnostics := lowerBody(loopCtx)
	diagnostics = append(diagnostics, bodyDiagnostics...)
	rangeTarget := ctx.tempName("RangeTarget")
	rangeTargetValue := o.lowerArrayPointerTarget(ctx, rangeValue, rangeType)
	counter, children := o.rangeCounter(ctx, stmt, indexName, body)
	if valueName != "" {
		// The value variable holds a copy of the element, so struct and array
		// elements are cloned, unless the variable can share the element
		// (see rangeValueSharesElement).
		valueType := ctx.semPkg.source.TypesInfo.TypeOf(stmt.Value)
		element := "(" + rangeWindow + ".backing[" + rangeWindow + ".offset + " + counter + "] as " + o.tsTypeFor(ctx, valueType) + ")"
		value := o.lowerValueForTargetTypes(ctx, valueType, valueType, element, !rangeValueSharesElement(ctx, stmt, rangeType))
		if typeParamMayHoldValueType(valueType) {
			value = o.runtimeOwner.QualifiedHelper(RuntimeHelperCopyElement) + "(" + value + ")"
		}
		if stmt.Tok == token.DEFINE {
			value = o.lowerDeclaredValue(ctx, stmt.Value, value)
		}
		children = append([]loweredStmt{{text: "let " + valueName + " = " + value}}, children...)
	}
	return loweredStmt{
		hasBlock: true,
		text: loopPrefix + "for (let " + rangeTarget + " = " + rangeTargetValue + ", " +
			rangeWindow + " = " + o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceRange) + "(" + rangeTarget + "), " +
			strings.Join(append(windowDecls, counter+" = 0"), ", ") + "; " + counter + " < " + rangeWindow + ".length; " + counter + "++)",
		children: children,
	}, diagnostics
}

// lowerRangeAssignment returns the temporary that a range loop binds in place
// of expr, a key or value that the range statement assigns, and the statement
// that assigns the temporary to expr; a missing or blank expr has neither.
func (o *LoweringOwner) lowerRangeAssignment(ctx lowerFileContext, expr ast.Expr, tempPrefix string) (string, []loweredStmt, []Diagnostic) {
	// Nothing is assigned to a missing or blank expression.
	if expr == nil {
		return "", nil, nil
	}
	if ident, ok := expr.(*ast.Ident); ok && ident.Name == "_" {
		return "", nil, nil
	}

	// Struct and array values are copied, as Go assigns them.
	temp := ctx.tempName(tempPrefix)
	value := temp
	if typ := ctx.semPkg.source.TypesInfo.TypeOf(expr); typ != nil && isValueCopyType(typ) {
		value = o.lowerValueForTargetTypes(ctx, typ, typ, temp, true)
	}
	assign, diagnostics := o.lowerTupleTargetAssignmentStmt(ctx, expr, value, false)
	return temp, []loweredStmt{assign}, diagnostics
}

// rangeCounter returns the counter of a range loop over an integer, slice or
// array whose key is named keyName, and the body with the key bound to it. A
// key that the body assigns, or that needs a variable reference, is a copy of
// a hidden counter, bound at the start of each iteration, since in Go a change
// of the key does not change the iterations, which a change of the counter of
// the JavaScript loop would.
func (o *LoweringOwner) rangeCounter(ctx lowerFileContext, stmt *ast.RangeStmt, keyName string, body []loweredStmt) (string, []loweredStmt) {
	// A key that only the loop changes is the counter.
	if stmt.Tok != token.DEFINE || stmt.Key == nil {
		return keyName, body
	}
	key := rangeBindingObject(ctx, stmt.Key)
	if key == nil || (!ctx.model.needsVarRef[key] && !objectAssignedInBlock(ctx, key, stmt.Body)) {
		return keyName, body
	}

	// Otherwise the key is declared from the hidden counter.
	counter := ctx.tempName("RangeIndex")
	binding := loweredStmt{text: "let " + keyName + " = " + o.lowerDeclaredValue(ctx, stmt.Key, counter)}
	return counter, append([]loweredStmt{binding}, body...)
}

// rangeElementAccess is a slice variable that a range loop over it indexes
// by the loop's index variable.
type rangeElementAccess struct {
	slice  types.Object
	index  types.Object
	window string
	name   string
}

// rangeElementAccessFor returns the element access of a range loop over a
// slice variable, by an index variable that the loop declares, when the body
// never assigns either variable, so that s[i] is always in the window that
// the loop read.
func rangeElementAccessFor(ctx lowerFileContext, stmt *ast.RangeStmt, rangeType types.Type, window string, indexName string) (rangeElementAccess, bool) {
	// The loop declares an index variable and ranges over a slice variable.
	if _, ok := types.Unalias(rangeType).Underlying().(*types.Slice); !ok || stmt.Tok != token.DEFINE || stmt.Key == nil {
		return rangeElementAccess{}, false
	}
	info := ctx.semPkg.source.TypesInfo
	sliceIdent, ok := ast.Unparen(stmt.X).(*ast.Ident)
	if !ok {
		return rangeElementAccess{}, false
	}

	// Both variables are plain locals that need no variable reference.
	slice, ok := info.Uses[sliceIdent].(*types.Var)
	keyIdent, keyOK := stmt.Key.(*ast.Ident)
	if !ok || !keyOK || keyIdent.Name == "_" || ctx.model.needsVarRef[slice] {
		return rangeElementAccess{}, false
	}
	index := info.Defs[keyIdent]
	if index == nil || ctx.model.needsVarRef[index] || ctx.lazyPackageVars[slice] {
		return rangeElementAccess{}, false
	}

	// The body assigns neither variable and takes neither address.
	tracked := func(expr ast.Expr) bool {
		ident, ok := ast.Unparen(expr).(*ast.Ident)
		if !ok {
			return false
		}
		obj := info.ObjectOf(ident)
		return obj == slice || obj == index
	}
	assigned := false
	ast.Inspect(stmt.Body, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.AssignStmt:
			assigned = assigned || slices.ContainsFunc(typed.Lhs, tracked)
		case *ast.IncDecStmt:
			assigned = assigned || tracked(typed.X)
		case *ast.UnaryExpr:
			assigned = assigned || typed.Op == token.AND && tracked(typed.X)
		case *ast.RangeStmt:
			assigned = assigned || typed.Tok == token.ASSIGN && (tracked(typed.Key) || tracked(typed.Value))
		}
		return !assigned
	})
	if assigned || sliceAssignedInFuncLit(ctx, stmt, slice) {
		return rangeElementAccess{}, false
	}
	return rangeElementAccess{slice: slice, index: index, window: window, name: indexName}, true
}

// sliceAssignedInFuncLit reports whether a function literal in the function
// that contains stmt assigns the variable slice, which the loop body could
// call.
func sliceAssignedInFuncLit(ctx lowerFileContext, stmt ast.Stmt, slice types.Object) bool {
	// Without the syntax, assume that a function literal assigns the slice.
	if ctx.file == nil {
		return true
	}

	// Find the outermost function that contains the statement.
	path, _ := astutil.PathEnclosingInterval(ctx.file, stmt.Pos(), stmt.End())
	var outer ast.Node
	for _, node := range path {
		switch node.(type) {
		case *ast.FuncDecl, *ast.FuncLit:
			outer = node
		}
	}
	if outer == nil {
		return true
	}

	// Look for an assignment to the slice inside a function literal.
	info := ctx.semPkg.source.TypesInfo
	assigned := false
	ast.Inspect(outer, func(node ast.Node) bool {
		lit, ok := node.(*ast.FuncLit)
		if !ok || assigned {
			return !assigned
		}
		ast.Inspect(lit.Body, func(node ast.Node) bool {
			if assign, ok := node.(*ast.AssignStmt); ok {
				for _, lhs := range assign.Lhs {
					if ident, ok := ast.Unparen(lhs).(*ast.Ident); ok && info.ObjectOf(ident) == slice {
						assigned = true
					}
				}
			}
			return !assigned
		})
		return false
	})
	return assigned
}

// rangeWindowElement returns the element s[i] of an enclosing range loop's
// window, read or written in place, for a slice and index variable of the
// loop (see rangeElementAccessFor).
func rangeWindowElement(ctx lowerFileContext, expr *ast.IndexExpr) (string, bool) {
	// Only an index of a slice variable by an index variable can match.
	if len(ctx.rangeElements) == 0 {
		return "", false
	}
	sliceIdent, ok := ast.Unparen(expr.X).(*ast.Ident)
	if !ok {
		return "", false
	}
	indexIdent, ok := ast.Unparen(expr.Index).(*ast.Ident)
	if !ok {
		return "", false
	}

	// The innermost loop that indexes the slice by the index variable wins.
	info := ctx.semPkg.source.TypesInfo
	slice, index := info.Uses[sliceIdent], info.Uses[indexIdent]
	for idx := len(ctx.rangeElements) - 1; idx >= 0; idx-- {
		access := ctx.rangeElements[idx]
		if access.slice == slice && access.index == index {
			return "(" + access.window + ".backing as any[])[" + access.window + ".offset + " + access.name + "]", true
		}
	}
	return "", false
}

func (o *LoweringOwner) lowerRangeDeclShadowAliases(
	ctx lowerFileContext,
	stmt *ast.RangeStmt,
) map[types.Object]string {
	if stmt.Tok != token.DEFINE {
		return nil
	}
	defsByName := make(map[string]types.Object)
	for _, expr := range []ast.Expr{stmt.Key, stmt.Value} {
		ident, ok := expr.(*ast.Ident)
		if !ok || ident.Name == "_" {
			continue
		}
		if def := ctx.semPkg.source.TypesInfo.Defs[ident]; def != nil {
			defsByName[ident.Name] = def
		}
	}
	if len(defsByName) == 0 {
		return nil
	}
	aliases := make(map[types.Object]string)
	ast.Inspect(stmt.X, func(node ast.Node) bool {
		ident, ok := node.(*ast.Ident)
		if !ok {
			return true
		}
		def := defsByName[ident.Name]
		if def == nil || aliases[def] != "" {
			return true
		}
		if used := ctx.semPkg.source.TypesInfo.Uses[ident]; used != nil && used != def {
			aliases[def] = ctx.tempName("RangeShadow")
		}
		return true
	})
	return aliases
}

// lowerRangeFuncStmt carries control flow through the iterator's yield callback.
func (o *LoweringOwner) lowerRangeFuncStmt(
	ctx lowerFileContext,
	stmt *ast.RangeStmt,
	rangeValue string,
	signature *types.Signature,
) (loweredStmt, []Diagnostic) {
	// Derive yield parameters from the iterator's checked signature.
	yieldSignature, ok := types.Unalias(signature.Params().At(0).Type()).Underlying().(*types.Signature)
	if !ok {
		return loweredStmt{}, []Diagnostic{loweringUnsupportedAt(ctx, stmt, "statement", ctx.semPkg.pkgPath, "unsupported function range yield signature")}
	}
	keyName := rangeKeyName(stmt.Key)
	valueName := rangeKeyName(stmt.Value)
	paramKeyName := keyName
	paramValueName := valueName
	if stmt.Tok != token.DEFINE {
		paramKeyName = ""
		paramValueName = ""
	}
	paramNames := rangeFuncParamNames(paramKeyName, paramValueName, yieldSignature.Params().Len(), ctx.tempName("Range"))

	// Allocate callback state for pending returns and labeled branches.
	parentBranch := ctx.rangeBranch
	rangeBranch := &loweredRangeBranch{hasReturn: ctx.tempName("RangeReturn")}
	if ctx.signature != nil && ctx.signature.Results() != nil && ctx.signature.Results().Len() != 0 {
		rangeBranch.value = ctx.tempName("RangeReturnValue")
		rangeBranch.resultType = o.tsSignatureResultFor(ctx, ctx.signature)
	}

	// Only the current iterator's label remains local to its yield callback,
	// which no goto leaves.
	bodyCtx := ctx.withoutLoopLabel().withRangeBranch(rangeBranch)
	bodyCtx.gotoJumps = nil
	bodyCtx.rangeLoop = stmt
	bodyCtx.rangeLabels = make(map[string]ast.Stmt)
	for label, target := range ctx.rangeLabels {
		if target == stmt {
			bodyCtx.rangeLabels[label] = target
		}
	}
	body, diagnostics := o.lowerBlock(bodyCtx, stmt.Body)

	// Resume each pending branch in the enclosing scope, crossing another yield
	// when needed. Lowering owns that decision just as it does for source branches.
	for idx, branch := range rangeBranch.branches {
		var branchDiagnostics []Diagnostic
		rangeBranch.branches[idx].body, branchDiagnostics = o.lowerStmt(ctx, &ast.BranchStmt{Tok: branch.tok, Label: ast.NewIdent(branch.label)})
		diagnostics = append(diagnostics, branchDiagnostics...)
	}

	// Bind assignment-form range values before running the source loop body.
	if stmt.Tok != token.DEFINE {
		assignments, assignmentDiagnostics := o.lowerRangeFuncAssignments(ctx, stmt, paramNames)
		diagnostics = append(diagnostics, assignmentDiagnostics...)
		body = append(assignments, body...)
	}

	// Preserve await requirements and the enclosing callback's return state.
	async := ctx.asyncFunction || stmtsContainAwait(body, nil) || o.rangeFunctionValueNeedsAwait(ctx, stmt.X)
	return loweredStmt{rangeFunc: &loweredRangeFunc{
		value:        rangeValue,
		params:       paramNames,
		body:         body,
		async:        async,
		returnBranch: rangeBranch,
		parentBranch: parentBranch,
	}}, diagnostics
}

func (o *LoweringOwner) rangeFunctionValueNeedsAwait(ctx lowerFileContext, expr ast.Expr) bool {
	if call, ok := ast.Unparen(expr).(*ast.CallExpr); ok {
		if signatureForType(ctx.semPkg.source.TypesInfo.TypeOf(call)) != nil {
			return false
		}
	}
	return o.callNeedsAwait(ctx, expr)
}

func (o *LoweringOwner) lowerRangeFuncAssignments(
	ctx lowerFileContext,
	stmt *ast.RangeStmt,
	paramNames []string,
) ([]loweredStmt, []Diagnostic) {
	var diagnostics []Diagnostic
	var assignments []loweredStmt
	for idx, expr := range []ast.Expr{stmt.Key, stmt.Value} {
		if expr == nil || idx >= len(paramNames) {
			continue
		}
		if ident, ok := expr.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, expr, false)
		diagnostics = append(diagnostics, leftDiagnostics...)
		assignments = append(assignments, loweredStmt{text: left + " = " + paramNames[idx]})
	}
	return assignments, diagnostics
}

func (o *LoweringOwner) lowerSelectStmt(ctx lowerFileContext, stmt *ast.SelectStmt) (*loweredSelect, []Diagnostic) {
	resultType := "void"
	if ctx.signature != nil {
		resultType = o.tsSignatureResultFor(ctx, ctx.signature)
	}
	selectName := ctx.tempName("Select")
	lowered := &loweredSelect{
		hasReturn:  selectName + "HasReturn",
		value:      selectName + "Value",
		result:     selectName + "Result",
		resultType: resultType,
	}
	var diagnostics []Diagnostic
	caseID := 0
	for _, raw := range stmt.Body.List {
		clause, ok := raw.(*ast.CommClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, raw, "statement", ctx.semPkg.pkgPath, "unsupported select clause"))
			continue
		}
		switch comm := clause.Comm.(type) {
		case nil:
			body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), clause.Body)
			diagnostics = append(diagnostics, bodyDiagnostics...)
			lowered.hasDefault = true
			lowered.cases = append(lowered.cases, loweredSelectCase{
				id:      -1,
				channel: "null",
				body:    body,
			})
		case *ast.SendStmt:
			channel, channelDiagnostics := o.lowerExpr(ctx, comm.Chan)
			value, valueDiagnostics := o.lowerExpr(ctx, comm.Value)
			body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), clause.Body)
			diagnostics = append(diagnostics, channelDiagnostics...)
			diagnostics = append(diagnostics, valueDiagnostics...)
			diagnostics = append(diagnostics, bodyDiagnostics...)
			lowered.cases = append(lowered.cases, loweredSelectCase{
				id:      caseID,
				isSend:  true,
				channel: channel,
				value:   value,
				body:    body,
			})
			caseID++
		case *ast.ExprStmt:
			channel, prelude, receiveDiagnostics := o.lowerSelectReceiveComm(ctx, nil, comm.X, lowered.result)
			body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), clause.Body)
			diagnostics = append(diagnostics, receiveDiagnostics...)
			diagnostics = append(diagnostics, bodyDiagnostics...)
			lowered.cases = append(lowered.cases, loweredSelectCase{
				id:      caseID,
				channel: channel,
				prelude: prelude,
				body:    body,
			})
			caseID++
		case *ast.AssignStmt:
			channel, prelude, receiveDiagnostics := o.lowerSelectReceiveComm(ctx, comm, nil, lowered.result)
			body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak(), clause.Body)
			diagnostics = append(diagnostics, receiveDiagnostics...)
			diagnostics = append(diagnostics, bodyDiagnostics...)
			lowered.cases = append(lowered.cases, loweredSelectCase{
				id:      caseID,
				channel: channel,
				prelude: prelude,
				body:    body,
			})
			caseID++
		default:
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, comm, "statement", ctx.semPkg.pkgPath, "unsupported select communication"))
		}
	}
	lowered.returns = selectCasesReturn(lowered.cases)
	lowered.external = selectCasesNeedExternalBody(lowered.cases)
	return lowered, diagnostics
}

func selectCasesNeedExternalBody(cases []loweredSelectCase) bool {
	for _, switchCase := range cases {
		if stmtsContainLoopJump(switchCase.body) {
			return true
		}
	}
	return false
}

func selectCasesReturn(cases []loweredSelectCase) bool {
	if len(cases) == 0 {
		return false
	}
	for _, switchCase := range cases {
		if !stmtsEndInReturn(switchCase.body) {
			return false
		}
	}
	return true
}

func stmtsEndInReturn(stmts []loweredStmt) bool {
	if len(stmts) == 0 {
		return false
	}
	last := stmts[len(stmts)-1]
	return stmtEndsInReturn(last)
}

func stmtEndsInReturn(stmt loweredStmt) bool {
	trimmed := strings.TrimSpace(stmt.text)
	if strings.HasPrefix(trimmed, "return") {
		return true
	}
	if stmt.selectStmt != nil {
		return stmt.selectStmt.returns
	}
	if trimmed == "" && (stmt.hasBlock || len(stmt.children) != 0) {
		return stmtsEndInReturn(stmt.children)
	}
	if strings.HasPrefix(trimmed, "if ") && len(stmt.elseBody) != 0 {
		return stmtsEndInReturn(stmt.children) && stmtsEndInReturn(stmt.elseBody)
	}
	return false
}

func stmtsContainLoopJump(stmts []loweredStmt) bool {
	for _, stmt := range stmts {
		if stmtTextContainsLoopJump(stmt.text) {
			return true
		}
		if stmt.selectStmt != nil && stmtsContainSelectLoopJump(stmt.selectStmt) {
			return true
		}
		if stmt.switchStmt != nil && stmtsContainSwitchLoopJump(stmt.switchStmt) {
			return true
		}
		if stmt.typeSwitch != nil && stmtsContainTypeSwitchLoopJump(stmt.typeSwitch) {
			return true
		}
		if stmtsContainLoopJump(stmt.children) || stmtsContainLoopJump(stmt.elseBody) {
			return true
		}
	}
	return false
}

func stmtTextContainsLoopJump(text string) bool {
	for line := range strings.SplitSeq(text, "\n") {
		trimmed := strings.TrimSpace(line)
		if trimmed == "break" || trimmed == "continue" ||
			strings.HasPrefix(trimmed, "break ") || strings.HasPrefix(trimmed, "continue ") {
			return true
		}
	}
	return false
}

func stmtsContainSwitchLoopJump(stmt *loweredSwitch) bool {
	if stmt == nil {
		return false
	}
	for _, switchCase := range stmt.cases {
		if stmtsContainLoopJump(switchCase.body) {
			return true
		}
	}
	return false
}

func stmtsContainTypeSwitchLoopJump(stmt *loweredTypeSwitch) bool {
	if stmt == nil {
		return false
	}
	if stmtsContainLoopJump(stmt.defaultBody) {
		return true
	}
	for _, switchCase := range stmt.cases {
		if stmtsContainLoopJump(switchCase.body) {
			return true
		}
	}
	return false
}

func stmtsContainSelectLoopJump(stmt *loweredSelect) bool {
	if stmt == nil {
		return false
	}
	for _, switchCase := range stmt.cases {
		if stmtsContainLoopJump(switchCase.body) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) lowerSelectReceiveComm(
	ctx lowerFileContext,
	assign *ast.AssignStmt,
	expr ast.Expr,
	resultName string,
) (string, []loweredStmt, []Diagnostic) {
	receiveExpr := expr
	if assign != nil && len(assign.Rhs) == 1 {
		receiveExpr = assign.Rhs[0]
	}
	receive, ok := receiveExpr.(*ast.UnaryExpr)
	if !ok || receive.Op != token.ARROW {
		return "null", nil, []Diagnostic{loweringUnsupportedAt(ctx, receiveExpr, "statement", ctx.semPkg.pkgPath, "unsupported select receive")}
	}
	channel, diagnostics := o.lowerExpr(ctx, receive.X)
	if assign == nil {
		return channel, nil, diagnostics
	}
	prelude := make([]loweredStmt, 0, len(assign.Lhs))
	fields := []string{".value", ".ok"}
	for idx, lhs := range assign.Lhs {
		if idx >= len(fields) {
			break
		}
		if ident, ok := lhs.(*ast.Ident); ok && ident.Name == "_" {
			continue
		}
		left, leftDiagnostics := o.lowerAssignmentTarget(ctx, lhs, assign.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs))
		diagnostics = append(diagnostics, leftDiagnostics...)
		prefix := ""
		if assign.Tok == token.DEFINE && isShortAssignTargetNew(ctx, lhs) {
			prefix = "let "
		}
		prelude = append(prelude, loweredStmt{text: prefix + left + " = " + resultName + fields[idx]})
	}
	return channel, prelude, diagnostics
}

// taglessSwitchValue is the tag of a switch whose cases are conditions. It is
// widened to boolean because TypeScript may narrow a case condition to a
// literal type, such as a constant or a variable only assigned in a closure,
// and reject a literal case that is not comparable with the literal true.
const taglessSwitchValue = "(true as boolean)"

func (o *LoweringOwner) lowerSwitchStmt(ctx lowerFileContext, stmt *ast.SwitchStmt) ([]loweredStmt, []Diagnostic) {
	var diagnostics []Diagnostic
	var init []loweredStmt
	if stmt.Init != nil {
		lowered, initDiagnostics := o.lowerStmt(ctx, stmt.Init)
		diagnostics = append(diagnostics, initDiagnostics...)
		init = append(init, lowered...)
	}

	value := taglessSwitchValue
	var tagType types.Type
	if stmt.Tag != nil {
		var valueDiagnostics []Diagnostic
		value, valueDiagnostics = o.lowerExpr(ctx, stmt.Tag)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = lowerConstantComparableValue(ctx, stmt.Tag, value)
		tagType = ctx.semPkg.source.TypesInfo.TypeOf(stmt.Tag)
	}

	// A tag that === cannot compare is evaluated once, and each case becomes
	// the condition tag == case.
	compareCases := tagType != nil && isValueSwitchTagType(tagType)
	compareValue := value
	if compareCases {
		compareValue = ctx.tempName("Switch")
		init = append(init, loweredStmt{text: "let " + compareValue + " = " + value})
		value = taglessSwitchValue
	}
	switchIR := &loweredSwitch{value: value}

	// A goto loop in a case body needs the switch labeled for its breaks.
	if !ctx.noGoto && caseBodiesWrapGotoLoop(stmt.Body, false) {
		switchIR.label = ctx.tempName("Switch")
	}
	for _, raw := range stmt.Body.List {
		clause, ok := raw.(*ast.CaseClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, raw, "statement", ctx.semPkg.pkgPath, "unsupported switch clause"))
			continue
		}
		bodyStmts, fallsThrough := splitSwitchFallthrough(clause.Body)
		body, bodyDiagnostics := o.lowerStmtList(ctx.withLocalScope().withoutRangeBreak().withSwitchBreak(switchIR.label), bodyStmts)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		values := make([]string, 0, len(clause.List))
		for _, expr := range clause.List {
			lowered, exprDiagnostics := o.lowerExpr(ctx, expr)
			diagnostics = append(diagnostics, exprDiagnostics...)
			if compareCases {
				// Comparisons the typed equality declines, such as case nil,
				// lower as a binary == does.
				eq := &ast.BinaryExpr{X: stmt.Tag, OpPos: expr.Pos(), Op: token.EQL, Y: expr}
				if value, ok := o.lowerTypedEqualityExpr(ctx, eq, compareValue, lowered); ok {
					lowered = value
				} else {
					left, right := o.lowerEqualityOperands(ctx, eq, compareValue, lowered)
					lowered = left + " == " + right
				}
			} else if tagType != nil && isBigIntBackedType(tagType) {
				// A bigint-backed tag (int64/uint64) lowers to a bigint at
				// runtime, and JS switch matches with strict ===. An integer
				// constant case must carry the bigint literal ("5n") so a small
				// value still matches; a plain number case (5) would fail
				// 5n === 5 and fall through to default.
				if tv, ok := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)]; ok {
					if bigLit, ok := lowerConstantValueForType(tv.Value, tagType); ok {
						lowered = bigLit
					}
				}
			} else if tagType != nil && isWideIntegerConstantExpr(ctx, expr) {
				// A constant beyond the safe integers of a number-backed tag
				// (such as ^uint(0)) is a bigint at runtime, as conversions
				// and comparisons lower it, so the case is lowered as they do.
				lowered = o.lowerValueForTarget(ctx, expr, tagType, lowered)
			}
			values = append(values, lowered)
		}
		switchIR.cases = append(switchIR.cases, loweredSwitchCase{
			defaultCase:  len(clause.List) == 0,
			values:       values,
			body:         body,
			fallsThrough: fallsThrough,
		})
	}

	lowered := loweredStmt{switchStmt: switchIR}
	if len(init) == 0 {
		return []loweredStmt{lowered}, diagnostics
	}
	init = append(init, lowered)
	return []loweredStmt{{children: init}}, diagnostics
}

// splitSwitchFallthrough returns the statements of a case body without its
// final fallthrough, and whether it had one. A labeled fallthrough, the
// target of a goto in the case, leaves its labels on an empty statement, so
// that the goto still jumps to the end of the case.
func splitSwitchFallthrough(body []ast.Stmt) ([]ast.Stmt, bool) {
	if len(body) == 0 {
		return body, false
	}

	// Find the fallthrough under the labels of the last statement.
	last := body[len(body)-1]
	var labels []*ast.LabeledStmt
	stmt := last
	for labeled, ok := stmt.(*ast.LabeledStmt); ok; labeled, ok = stmt.(*ast.LabeledStmt) {
		labels = append(labels, labeled)
		stmt = labeled.Stmt
	}
	branch, ok := stmt.(*ast.BranchStmt)
	if !ok || branch.Tok != token.FALLTHROUGH {
		return body, false
	}
	if len(labels) == 0 {
		return body[:len(body)-1], true
	}

	// Rebuild the labels around an empty statement in place of the fallthrough.
	var inner ast.Stmt = &ast.EmptyStmt{Semicolon: branch.Pos(), Implicit: true}
	for i := len(labels) - 1; i >= 0; i-- {
		inner = &ast.LabeledStmt{Label: labels[i].Label, Colon: labels[i].Colon, Stmt: inner}
	}
	trimmed := append(slices.Clip(body[:len(body)-1]), inner)
	return trimmed, true
}

func lowerConstantComparableValue(ctx lowerFileContext, expr ast.Expr, value string) string {
	if typ := constantComparableType(ctx, expr); typ != "" {
		return "(" + value + " as " + typ + ")"
	}
	return value
}

func constantComparableType(ctx lowerFileContext, expr ast.Expr) string {
	tv, ok := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)]
	if !ok || tv.Value == nil {
		return ""
	}
	basic, ok := types.Unalias(tv.Type).Underlying().(*types.Basic)
	if !ok {
		return ""
	}
	switch {
	case basic.Info()&types.IsBoolean != 0:
		return "boolean"
	case basic.Info()&types.IsString != 0:
		return "string"
	case basic.Info()&types.IsNumeric != 0 && basic.Info()&types.IsComplex == 0:
		return "number"
	default:
		return ""
	}
}

func (o *LoweringOwner) lowerTypeSwitchStmt(ctx lowerFileContext, stmt *ast.TypeSwitchStmt) ([]loweredStmt, []Diagnostic) {
	var lowered []loweredStmt
	var diagnostics []Diagnostic
	if stmt.Init != nil {
		init, initDiagnostics := o.lowerStmt(ctx, stmt.Init)
		diagnostics = append(diagnostics, initDiagnostics...)
		lowered = append(lowered, init...)
	}

	valueExpr, varName, varRef, assignDiagnostics := o.lowerTypeSwitchAssign(ctx, stmt.Assign)
	diagnostics = append(diagnostics, assignDiagnostics...)
	if valueExpr == "" {
		return lowered, append(diagnostics, loweringUnsupportedAt(ctx, stmt.Assign, "statement", ctx.semPkg.pkgPath, "unsupported type switch assignment"))
	}

	switchIR := &loweredTypeSwitch{
		value:   valueExpr,
		varName: varName,
		varRef:  varRef,
	}
	cacheable := true

	// A goto loop in a case body needs the switch labeled for its breaks.
	if !ctx.noGoto && caseBodiesWrapGotoLoop(stmt.Body, false) {
		switchIR.label = ctx.tempName("Switch")
	}
	for _, clauseStmt := range stmt.Body.List {
		clause, ok := clauseStmt.(*ast.CaseClause)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, clauseStmt, "statement", ctx.semPkg.pkgPath, "unsupported type switch clause"))
			continue
		}
		body, bodyDiagnostics := o.lowerStmtList(ctx.withoutRangeBreak().withSwitchBreak(switchIR.label), clause.Body)
		diagnostics = append(diagnostics, bodyDiagnostics...)
		if len(clause.List) == 0 {
			switchIR.defaultBody = body
			switchIR.defaultRef = varRef || loweredStmtsUseVarRefName(body, varName)
			continue
		}
		types := make([]string, 0, len(clause.List))
		tsTypes := make([]string, 0, len(clause.List))
		cacheable = cacheable && len(clause.List) == 1
		for _, expr := range clause.List {
			typ := ctx.semPkg.source.TypesInfo.TypeOf(expr)
			cacheable = cacheable && isTypeSwitchSiteCaseType(typ)
			if isUntypedNilType(typ) {
				types = append(types, typeSwitchNilCase)
				tsTypes = append(tsTypes, "any")
				continue
			}
			types = append(types, o.runtimeTypeAssertInfoExpr(ctx, typ))
			if typ == nil {
				tsTypes = append(tsTypes, "any")
			} else {
				tsTypes = append(tsTypes, o.tsTypeSwitchCaseTypeFor(ctx, typ))
			}
		}
		binding := typeSwitchValueName
		if len(clause.List) == 1 && types[0] != typeSwitchNilCase {
			typ := ctx.semPkg.source.TypesInfo.TypeOf(clause.List[0])
			binding = o.lowerTypeSwitchBinding(typ, tsTypes[0], types[0])
		}
		switchIR.cases = append(switchIR.cases, loweredTypeSwitchCase{
			types:   types,
			tsTypes: tsTypes,
			binding: binding,
			varRef:  varRef || loweredStmtsUseVarRefName(body, varName),
			body:    body,
		})
	}
	if cacheable && len(switchIR.cases) != 0 {
		switchIR.site = o.lowerTypeSwitchSite(ctx, switchIR)
	}
	lowered = append(lowered, loweredStmt{typeSwitch: switchIR})
	return lowered, diagnostics
}

// lowerTypeSwitchSite returns the hoisted runtime site of a type switch whose
// clauses each list one type. typeSwitchCase asserts the operand to the case
// types in order, as the clauses would, and remembers the case that a box of
// each dynamic type takes, which its type alone decides (see
// isTypeSwitchSiteCaseType). Switches with the same case types share a site.
func (o *LoweringOwner) lowerTypeSwitchSite(ctx lowerFileContext, switchIR *loweredTypeSwitch) string {
	types := make([]string, 0, len(switchIR.cases))
	for _, switchCase := range switchIR.cases {
		types = append(types, switchCase.types[0])
	}
	site := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeSwitchSite) + "([" + strings.Join(types, ", ") + "])"
	return o.hoistStatic(ctx, site)
}

// isTypeSwitchSiteCaseType reports whether a type switch case of type typ
// can share a hoisted site (see lowerTypeSwitchSite): nil, or a type whose
// descriptor can be hoisted and that is not a map type, whose assertion
// samples the entries of the map.
func isTypeSwitchSiteCaseType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	if isUntypedNilType(typ) {
		return true
	}
	if _, isMap := types.Unalias(typ).Underlying().(*types.Map); isMap {
		return false
	}
	return typeIsHoistable(typ)
}

// lowerTypeSwitchBinding narrows the operand to typ for a one-type case. Go
// binds a copy of the dynamic value, so struct and array values are cloned and
// writes through the case variable do not reach the interface.
func (o *LoweringOwner) lowerTypeSwitchBinding(typ types.Type, tsType string, typeInfo string) string {
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeAssert) + "<" + tsType + ">(" +
		typeSwitchValueName + ", " + typeInfo + ").value"
	switch {
	case typ == nil:
		return value
	case isStructValueType(typ):
		return o.lowerStructClone(value)
	case isArrayType(typ):
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperCloneArrayValue) + "(" + value + ", " + typeInfo + ")"
	default:
		return value
	}
}

func (o *LoweringOwner) tsTypeSwitchCaseTypeFor(ctx lowerFileContext, typ types.Type) string {
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if _, ok := named.Underlying().(*types.Interface); ok {
			return o.tsTypeFor(ctx, named)
		}
	}
	return o.tsTypeFor(ctx, typ)
}

func loweredStmtsUseVarRefName(stmts []loweredStmt, name string) bool {
	if name == "" {
		return false
	}
	needle := name + ".value"
	for _, stmt := range stmts {
		if loweredStmtTextUsesVarRefName(stmt.text, needle) {
			return true
		}
		if loweredStmtsUseVarRefName(stmt.children, name) {
			return true
		}
		if stmt.switchStmt != nil {
			for _, switchCase := range stmt.switchStmt.cases {
				if loweredStmtsUseVarRefName(switchCase.body, name) {
					return true
				}
			}
		}
		if stmt.typeSwitch != nil {
			for _, switchCase := range stmt.typeSwitch.cases {
				if loweredStmtsUseVarRefName(switchCase.body, name) {
					return true
				}
			}
			if loweredStmtsUseVarRefName(stmt.typeSwitch.defaultBody, name) {
				return true
			}
		}
	}
	return false
}

func loweredStmtTextUsesVarRefName(text, needle string) bool {
	offset := 0
	for {
		idx := strings.Index(text[offset:], needle)
		if idx < 0 {
			return false
		}
		start := offset + idx
		end := start + len(needle)
		if tsIdentifierBoundaryBefore(text, start) && tsIdentifierBoundaryAfter(text, end) {
			return true
		}
		offset = start + 1
	}
}

func tsIdentifierBoundaryBefore(text string, idx int) bool {
	if idx == 0 {
		return true
	}
	prev := text[idx-1]
	return prev != '.' && !isTSIdentifierByte(prev)
}

func tsIdentifierBoundaryAfter(text string, idx int) bool {
	return idx >= len(text) || !isTSIdentifierByte(text[idx])
}

func isTSIdentifierByte(b byte) bool {
	return b == '$' || b == '_' || ('0' <= b && b <= '9') || ('A' <= b && b <= 'Z') || ('a' <= b && b <= 'z')
}

func (o *LoweringOwner) lowerTypeSwitchAssign(ctx lowerFileContext, stmt ast.Stmt) (string, string, bool, []Diagnostic) {
	switch typed := stmt.(type) {
	case *ast.ExprStmt:
		return o.lowerTypeSwitchGuard(ctx, typed.X, "")
	case *ast.AssignStmt:
		if len(typed.Lhs) != 1 || len(typed.Rhs) != 1 {
			return "", "", false, nil
		}
		varName := ""
		varRef := false
		if ident, ok := typed.Lhs[0].(*ast.Ident); ok && ident.Name != "_" {
			varName = safeIdentifier(ident.Name)
			if obj := ctx.semPkg.source.TypesInfo.Defs[ident]; obj != nil {
				varRef = ctx.model.needsVarRef[obj]
			} else if obj := ctx.semPkg.source.TypesInfo.Uses[ident]; obj != nil {
				varRef = ctx.model.needsVarRef[obj]
			}
		}
		value, name, _, diagnostics := o.lowerTypeSwitchGuard(ctx, typed.Rhs[0], varName)
		return value, name, varRef, diagnostics
	default:
		return "", "", false, nil
	}
}

func (o *LoweringOwner) lowerTypeSwitchGuard(ctx lowerFileContext, expr ast.Expr, varName string) (string, string, bool, []Diagnostic) {
	assertion, ok := expr.(*ast.TypeAssertExpr)
	if !ok || assertion.Type != nil {
		return "", "", false, nil
	}
	value, diagnostics := o.lowerExpr(ctx, assertion.X)
	return value, varName, false, diagnostics
}

func rangeKeyName(expr ast.Expr) string {
	ident, ok := expr.(*ast.Ident)
	if !ok || ident.Name == "_" {
		return ""
	}
	return safeIdentifier(ident.Name)
}

func rangeKeyNameFor(ctx lowerFileContext, expr ast.Expr, aliases map[types.Object]string) string {
	if ident, ok := expr.(*ast.Ident); ok && ident.Name != "_" {
		if alias := aliases[ctx.semPkg.source.TypesInfo.Defs[ident]]; alias != "" {
			return alias
		}
	}
	return rangeKeyName(expr)
}

func rangeFunctionSignature(typ types.Type) *types.Signature {
	signature, ok := types.Unalias(typ).Underlying().(*types.Signature)
	if !ok || signature.Params() == nil || signature.Params().Len() != 1 {
		return nil
	}
	yieldSignature, ok := types.Unalias(signature.Params().At(0).Type()).Underlying().(*types.Signature)
	if !ok || yieldSignature.Params() == nil || yieldSignature.Results() == nil {
		return nil
	}
	if yieldSignature.Params().Len() > 2 || yieldSignature.Results().Len() != 1 {
		return nil
	}
	if !isBoolType(yieldSignature.Results().At(0).Type()) {
		return nil
	}
	return signature
}

func isFunctionType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Signature)
	return ok
}

func isBoolType(typ types.Type) bool {
	return basicKind(typ, types.Bool)
}

func isUntypedNilType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Kind() == types.UntypedNil
}

func rangeFuncParamNames(keyName, valueName string, arity int, fallback string) []string {
	names := make([]string, 0, arity)
	if arity >= 1 {
		name := keyName
		if name == "" {
			name = fallback + "_0"
		}
		names = append(names, name)
	}
	if arity >= 2 {
		name := valueName
		if name == "" {
			name = fallback + "_1"
		}
		names = append(names, name)
	}
	return names
}

func isIntegerRangeType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Info()&types.IsInteger != 0
}

func isEqualityOperator(op token.Token) bool {
	return op == token.EQL || op == token.NEQ
}

func isRelationalOperator(op token.Token) bool {
	return op == token.LSS || op == token.LEQ || op == token.GTR || op == token.GEQ
}

func (o *LoweringOwner) lowerNumericComparisonOperands(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, string) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if isNumericType(leftType) && isNumericType(rightType) {
		left = o.lowerValueForTarget(ctx, expr.X, rightType, left)
		right = o.lowerValueForTarget(ctx, expr.Y, leftType, right)
	}
	return left, right
}

// isPlainAssignType reports whether values of the type are assigned as they
// are, without copying (see loweredStructField.plainValue).
func isPlainAssignType(typ types.Type) bool {
	if _, ok := types.Unalias(typ).(*types.TypeParam); ok {
		return false
	}
	switch types.Unalias(typ).Underlying().(type) {
	case *types.Basic, *types.Pointer, *types.Slice, *types.Map, *types.Signature, *types.Chan:
		return true
	}
	return false
}

func isArrayType(typ types.Type) bool {
	_, ok := types.Unalias(typ).Underlying().(*types.Array)
	return ok
}

func (o *LoweringOwner) lowerEqualityOperands(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, string) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	left, right = o.lowerNumericComparisonOperands(ctx, expr, left, right)
	if constantComparableType(ctx, expr.X) != "" && constantComparableType(ctx, expr.X) == constantComparableType(ctx, expr.Y) {
		left = lowerConstantComparableValue(ctx, expr.X, left)
	}
	if isStringType(leftType) && isStringType(rightType) {
		leftLiteral := isStringLiteralExpr(expr.X)
		rightLiteral := isStringLiteralExpr(expr.Y)
		if leftLiteral && !rightLiteral {
			right = "(" + right + " as string)"
		}
		if rightLiteral && !leftLiteral {
			left = "(" + left + " as string)"
		}
	}
	if isInterfaceType(leftType) && !isInterfaceType(rightType) {
		right = o.lowerValueForTargetTypes(ctx, leftType, rightType, right, false)
	}
	if isInterfaceType(rightType) && !isInterfaceType(leftType) {
		left = o.lowerValueForTargetTypes(ctx, rightType, leftType, left, false)
	}
	return left, right
}

// lowerTypedEqualityExpr compares the lowered operands of an == or != whose
// type JavaScript === does not compare as Go does: arrays, complex numbers, and
// structs by value, pointers across unsafe aliases, strings by their bytes, and
// interfaces by their dynamic values. It reports false for operands === compares.
func (o *LoweringOwner) lowerTypedEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	for _, lower := range []func(lowerFileContext, *ast.BinaryExpr, string, string) (string, bool){
		o.lowerArrayEqualityExpr,
		o.lowerPointerEqualityExpr,
		o.lowerComplexEqualityExpr,
		o.lowerStructEqualityExpr,
		o.lowerStringEqualityExpr,
		o.lowerInterfaceEqualityExpr,
	} {
		if value, ok := lower(ctx, expr, left, right); ok {
			return value, true
		}
	}
	return "", false
}

// isValueSwitchTagType reports whether a switch on a tag of typ compares each
// case through the equality its type needs. A JavaScript switch matches with
// ===, which compares arrays, complex numbers, and structs by identity,
// interfaces by their boxes, and pointers without their unsafe aliases.
func isValueSwitchTagType(typ types.Type) bool {
	return isInterfaceType(typ) || isPointerType(typ) || isArrayType(typ) || isComplexType(typ) || isStructComparableType(typ)
}

func (o *LoweringOwner) lowerArrayEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isArrayType(leftType) || !isArrayType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

func (o *LoweringOwner) lowerComplexEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isComplexType(leftType) || !isComplexType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

// lowerPointerEqualityExpr compares two pointers, also unsafe pointers.
// Pointers to the same storage are the same object, except references to a
// slice or array element, which each &s[i] makes anew, and views that an
// unsafe pointer conversion makes of another pointer's storage, so operands
// that can be evaluated twice are compared with === first, and through the
// runtime only if the left one is such a reference or a view was made.
func (o *LoweringOwner) lowerPointerEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	// Both operands are pointers.
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isComparedPointerType(leftType) || !isComparedPointerType(rightType) {
		return "", false
	}

	// Other operands are compared by the runtime alone.
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerEqual) + "(" + left + ", " + right + ")"
	if !isSimpleLoweredOperand(left) || !isSimpleLoweredOperand(right) {
		if expr.Op == token.NEQ {
			value = "!" + value
		}
		return value, true
	}

	// Simple operands are compared inline, and by the runtime only if the
	// left one may alias another pointer: a view was made or it is a
	// reference to an element. The test is inline, since calls of runtime
	// helpers are not inlined in hot loops.
	aliases := "(" + o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerAliasesMade) +
		" || (" + left + " as any)?.__goElementBacking !== undefined)"
	if expr.Op == token.NEQ {
		return "(" + left + " !== " + right + " && !(" + aliases + " && " + value + "))", true
	}
	return "(" + left + " === " + right + " || " + aliases + " && " + value + ")", true
}

func (o *LoweringOwner) lowerStructEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isStructComparableType(leftType) || !isStructComparableType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperStructEqual) + "(" + left + ", " + right + ")"

	// Small structs of the same type whose operands can be read twice are
	// compared field by field inline (see lowerInlineStructEqual), unless
	// the operands call runtime readers that more than two fields would
	// repeat.
	if types.Identical(leftType, rightType) && isRereadableStructOperand(left) && isRereadableStructOperand(right) {
		inline, ok := o.lowerInlineStructEqual(leftType, left, right)
		if ok && (strings.Count(inline, " && ") < 2 || !simpleOperandCalls.MatchString(left+right)) {
			value = "(" + inline + ")"
		}
	}
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

func (o *LoweringOwner) lowerStringEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isStringType(leftType) || !isStringType(rightType) {
		return "", false
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperStringEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

// lowerStringSliceEqualityExpr lowers s[low:high] == t, and t == s[low:high]
// when t is a constant or a variable, to a runtime comparison that checks the
// bounds of the slice expression and compares its bytes in place, without
// making the substring. The operands keep their order of evaluation.
func (o *LoweringOwner) lowerStringSliceEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr) (string, []Diagnostic, bool) {
	// One operand is a two-index slice of a string, and the other a string.
	info := ctx.semPkg.source.TypesInfo
	slice, other := stringSliceOperand(info, expr.X), expr.Y
	if slice == nil {
		slice, other = stringSliceOperand(info, expr.Y), expr.X
		if slice == nil || !isSimpleStringOperand(info, other) {
			return "", nil, false
		}
	}
	if !isStringType(info.TypeOf(other)) {
		return "", nil, false
	}

	// The slice operands are lowered as lowerSliceExpr lowers them.
	target, diagnostics := o.lowerExpr(ctx, slice.X)
	low, lowDiagnostics := o.lowerOptionalExpr(ctx, slice.Low)
	high, highDiagnostics := o.lowerOptionalExpr(ctx, slice.High)
	value, valueDiagnostics := o.lowerExpr(ctx, other)
	low = o.lowerNumberIndexValue(ctx, slice.Low, low)
	high = o.lowerNumberIndexValue(ctx, slice.High, high)
	diagnostics = append(append(append(diagnostics, lowDiagnostics...), highDiagnostics...), valueDiagnostics...)

	// != negates the comparison.
	call := o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceStringEqual) +
		"(" + strings.Join([]string{target, low, high, value}, ", ") + ")"
	if expr.Op == token.NEQ {
		call = "!" + call
	}
	return call, diagnostics, true
}

// stringSliceOperand returns expr as a two-index slice expression of a
// string, or nil if it is not one.
func stringSliceOperand(info *types.Info, expr ast.Expr) *ast.SliceExpr {
	slice, ok := unwrapParenExpr(expr).(*ast.SliceExpr)
	if !ok || slice.Slice3 || !isStringType(info.TypeOf(slice.X)) {
		return nil
	}
	return slice
}

// isSimpleStringOperand reports whether expr is a constant or a variable,
// whose evaluation the bounds and target of a slice may follow.
func isSimpleStringOperand(info *types.Info, expr ast.Expr) bool {
	expr = unwrapParenExpr(expr)
	if info.Types[expr].Value != nil {
		return true
	}
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return false
	}
	_, isVar := info.Uses[ident].(*types.Var)
	return isVar
}

// isStringConcat reports whether expr concatenates strings.
func isStringConcat(ctx lowerFileContext, expr *ast.BinaryExpr) bool {
	return expr.Op == token.ADD && isStringType(ctx.semPkg.source.TypesInfo.TypeOf(expr))
}

func (o *LoweringOwner) lowerInterfaceEqualityExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	// A comparison with nil tests the interface itself.
	if isNilExpr(expr.X) || isNilExpr(expr.Y) {
		return "", false
	}

	// Go converts the non-interface operand to the interface type, so a named
	// basic value compares as the boxed value an interface holds.
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	switch leftIface, rightIface := isInterfaceType(leftType), isInterfaceType(rightType); {
	case !leftIface && !rightIface:
		return "", false
	case !rightIface:
		right = o.lowerValueForTargetTypes(ctx, leftType, rightType, right, false)
	case !leftIface:
		left = o.lowerValueForTargetTypes(ctx, rightType, leftType, left, false)
	}
	value := o.runtimeOwner.QualifiedHelper(RuntimeHelperComparableEqual) + "(" + left + ", " + right + ")"
	if expr.Op == token.NEQ {
		value = "!" + value
	}
	return value, true
}

func (o *LoweringOwner) lowerStringOrderExpr(
	ctx lowerFileContext,
	expr *ast.BinaryExpr,
	left string,
	right string,
	leftDiagnostics []Diagnostic,
	rightDiagnostics []Diagnostic,
) (string, []Diagnostic, bool) {
	leftType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	rightType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Y)
	if !isStringType(leftType) || !isStringType(rightType) {
		return "", nil, false
	}
	left, leftDiagnostics = o.lowerStringOrderOperand(ctx, expr.X, left, leftDiagnostics)
	right, rightDiagnostics = o.lowerStringOrderOperand(ctx, expr.Y, right, rightDiagnostics)
	compare := o.runtimeOwner.QualifiedHelper(RuntimeHelperStringCompare) + "(" + left + ", " + right + ")"
	switch expr.Op {
	case token.LSS:
		return compare + " < 0", append(leftDiagnostics, rightDiagnostics...), true
	case token.LEQ:
		return compare + " <= 0", append(leftDiagnostics, rightDiagnostics...), true
	case token.GTR:
		return compare + " > 0", append(leftDiagnostics, rightDiagnostics...), true
	case token.GEQ:
		return compare + " >= 0", append(leftDiagnostics, rightDiagnostics...), true
	default:
		return "", nil, false
	}
}

func (o *LoweringOwner) lowerStringOrderOperand(
	ctx lowerFileContext,
	expr ast.Expr,
	fallback string,
	fallbackDiagnostics []Diagnostic,
) (string, []Diagnostic) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return fallback, fallbackDiagnostics
	}
	targetType := typeFromExpr(ctx, call.Fun)
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])
	if targetType == nil || sourceType == nil || !isStringType(targetType) || !isByteSliceType(sourceType) {
		return fallback, fallbackDiagnostics
	}
	return o.lowerExpr(ctx, call.Args[0])
}

func (o *LoweringOwner) lowerMinMaxBuiltin(ctx lowerFileContext, expr *ast.CallExpr, args []string, maxValue bool) string {
	if len(args) == 0 {
		return "undefined"
	}
	if len(args) == 1 {
		return args[0]
	}
	if isStringType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		return o.lowerStringMinMaxBuiltin(ctx, args, maxValue)
	}
	helper := RuntimeHelperMin
	if maxValue {
		helper = RuntimeHelperMax
	}
	return o.lowerNumericMinMaxBuiltin(ctx, args, helper)
}

func (o *LoweringOwner) lowerNumericMinMaxBuiltin(ctx lowerFileContext, args []string, helper RuntimeHelper) string {
	call := o.runtimeOwner.QualifiedHelper(helper)
	if len(args) == 2 {
		return call + "(" + args[0] + ", " + args[1] + ")"
	}
	names, body, best := minMaxTemps(ctx, args)
	for _, name := range names[1:] {
		body = append(body, best+" = "+call+"("+best+", "+name+")")
	}
	body = append(body, "return "+best)
	return minMaxIIFE(body)
}

func (o *LoweringOwner) lowerStringMinMaxBuiltin(ctx lowerFileContext, args []string, maxValue bool) string {
	names, body, best := minMaxTemps(ctx, args)
	op := " <= 0"
	if maxValue {
		op = " >= 0"
	}
	compare := o.runtimeOwner.QualifiedHelper(RuntimeHelperStringCompare)
	for _, name := range names[1:] {
		body = append(body, best+" = "+compare+"("+best+", "+name+")"+op+" ? "+best+" : "+name)
	}
	body = append(body, "return "+best)
	return minMaxIIFE(body)
}

func minMaxTemps(ctx lowerFileContext, args []string) ([]string, []string, string) {
	names := make([]string, 0, len(args))
	body := make([]string, 0, len(args)*2)
	for _, arg := range args {
		name := ctx.tempName("MinMax")
		names = append(names, name)
		body = append(body, "const "+name+" = "+arg)
	}
	best := ctx.tempName("MinMax")
	body = append(body, "let "+best+" = "+names[0])
	return names, body, best
}

func minMaxIIFE(body []string) string {
	code := strings.Join(body, "; ")
	if strings.Contains(code, "await ") {
		return "(await (async () => { " + code + " })())"
	}
	return "(() => { " + code + " })()"
}

func binaryOperandUsesTypeParam(ctx lowerFileContext, expr ast.Expr) bool {
	typ := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	_, ok := types.Unalias(typ).(*types.TypeParam)
	return ok
}

func (o *LoweringOwner) lowerExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	// An operand already evaluated into a temporary reads it.
	if temp, ok := ctx.exprTemps[unwrapParenExpr(expr)]; ok {
		return temp, nil
	}
	if tv := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)]; tv.Value != nil {
		if tv.Value.Kind() == constant.Complex {
			if constantValue, ok := lowerConstantValue(tv.Value); ok {
				return constantValue, nil
			}
		}
		if isFloat32Type(tv.Type) {
			if constantValue, ok := lowerFloat32ConstantValue(tv.Value); ok {
				return constantValue, nil
			}
		}

		// A constant uintptr call, such as unsafe.Sizeof, unsafe.Alignof or
		// unsafe.Offsetof, lowers to its value: those calls have no runtime
		// implementation, and Go computes them at compile time.
		if _, ok := unwrapParenExpr(expr).(*ast.CallExpr); ok && isUintptrType(tv.Type) {
			if constantValue, ok := lowerConstantValue(tv.Value); ok {
				return constantValue, nil
			}
		}
	}
	switch typed := expr.(type) {
	case *ast.BasicLit:
		return lowerBasicLit(typed), nil
	case *ast.Ident:
		return o.lowerIdent(ctx, typed, false), nil
	case *ast.BinaryExpr:
		if value := ctx.semPkg.source.TypesInfo.Types[typed].Value; value != nil {
			if (typed.Op == token.SHL || typed.Op == token.SHR) && (value.Kind() == constant.Int || value.Kind() == constant.Float) {
				if constantValue, ok := lowerConstantValue(value); ok {
					return constantValue, nil
				}
			}
			if constantValue, ok := lowerLargeIntegerConstantValue(value); ok {
				return constantValue, nil
			}
		}
		if isEqualityOperator(typed.Op) {
			if value, diagnostics, ok := o.lowerAddressEqualityExpr(ctx, typed); ok {
				return value, diagnostics
			}
			if value, diagnostics, ok := o.lowerStringSliceEqualityExpr(ctx, typed); ok {
				return value, diagnostics
			}
		}
		left, leftDiagnostics := o.lowerExpr(ctx, typed.X)
		right, rightDiagnostics := o.lowerExpr(ctx, typed.Y)
		// A string concatenation lowers to a JavaScript +, so a chain of them
		// needs no parentheses.
		if x, ok := typed.X.(*ast.BinaryExpr); ok && (!isStringConcat(ctx, typed) || !isStringConcat(ctx, x)) {
			left = "(" + left + ")"
		}
		if _, ok := typed.Y.(*ast.BinaryExpr); ok {
			right = "(" + right + ")"
		}
		if typed.Op == token.AND_NOT {
			// Wide (int64/uint64) operands lower to bigint, and a Go constant like
			// 1<<63 lowers to a JS number whose raw ~ collapses to -1, so the raw
			// "left & ~(right)" mixes bigint and number at runtime. Route wide
			// AND-NOT through the typed helper; narrow operands keep raw JS.
			if value, ok := o.lowerWideIntegerBinaryExpr(ctx, typed, left, right); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
			if value, ok := lowerIntBitwiseValue(o.runtimeOwner, ctx.semPkg.source.TypesInfo.TypeOf(typed), typed.Op, left, right, false); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
			return left + " & ~(" + right + ")", append(leftDiagnostics, rightDiagnostics...)
		}
		if isEqualityOperator(typed.Op) {
			if value, ok := o.lowerTypedEqualityExpr(ctx, typed, left, right); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
			left, right = o.lowerEqualityOperands(ctx, typed, left, right)
		} else if isRelationalOperator(typed.Op) {
			left, right = o.lowerNumericComparisonOperands(ctx, typed, left, right)
		}
		if typed.Op == token.MUL {
			if value, ok := lower32BitIntegerMultiplicationValue(ctx.semPkg.source.TypesInfo.TypeOf(typed), left, right); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
		}
		if value, ok := o.lowerWideIntegerBinaryExpr(ctx, typed, left, right); ok {
			return value, append(leftDiagnostics, rightDiagnostics...)
		}
		if typed.Op == token.QUO && isIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(typed)) {
			return "globalThis.Math.trunc(" + left + " / " + right + ")", append(leftDiagnostics, rightDiagnostics...)
		}
		if typed.Op == token.SHR {
			if bits, ok := unsignedIntegerBits(ctx.semPkg.source.TypesInfo.TypeOf(typed.X)); ok && bits <= 32 {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperUintShr) +
					"(" + left + ", " + right + ", " + strconv.Itoa(bits) + ")", append(leftDiagnostics, rightDiagnostics...)
			}
		}
		if (typed.Op == token.SHL || typed.Op == token.SHR) && isBigIntBackedType(ctx.semPkg.source.TypesInfo.TypeOf(typed.Y)) {
			// Go decouples a shift's result type from its count type, so a number
			// result can be shifted by an int64/uint64 count. That count lowers to
			// bigint while the base stays a number, and a raw JS << / >> on the
			// pair throws "Cannot mix BigInt and other types". The wide-result and
			// uintShr paths above already ran, so the base here is number-backed:
			// coerce the bigint count to a number to match Go's count semantics.
			right = wideToNumber(o.runtimeOwner, ctx.semPkg.source.TypesInfo.TypeOf(typed.Y), right)
		}

		// The bitwise operators on ints keep their bits above 32, except for
		// an & with a mask.
		mask := isInt32Mask(ctx, typed.X) || isInt32Mask(ctx, typed.Y)
		if value, ok := lowerIntBitwiseValue(o.runtimeOwner, ctx.semPkg.source.TypesInfo.TypeOf(typed), typed.Op, left, right, mask); ok {
			return value, append(leftDiagnostics, rightDiagnostics...)
		}
		// Narrow integers shifted by counts that may be 32 or more shift all bits out.
		if value, ok := o.lowerNarrowShiftExpr(ctx, typed, left, right); ok {
			return value, append(leftDiagnostics, rightDiagnostics...)
		}
		if typed.Op == token.ADD || typed.Op == token.SUB || typed.Op == token.SHL {
			if value, ok := wrapNarrowIntegerValue(ctx.semPkg.source.TypesInfo.TypeOf(typed), left+" "+typed.Op.String()+" "+right, typed.Op); ok {
				return value, append(leftDiagnostics, rightDiagnostics...)
			}
		}
		if value, diagnostics, ok := o.lowerStringOrderExpr(ctx, typed, left, right, leftDiagnostics, rightDiagnostics); ok {
			return value, diagnostics
		}
		if binaryOperandUsesTypeParam(ctx, typed.X) {
			left = "(" + left + " as any)"
		}
		if binaryOperandUsesTypeParam(ctx, typed.Y) {
			right = "(" + right + " as any)"
		}
		value := left + " " + typed.Op.String() + " " + right
		if isFloat32Type(ctx.semPkg.source.TypesInfo.TypeOf(typed)) && isFloatBinaryArithmeticOperator(typed.Op) {
			value = "globalThis.Math.fround(" + value + ")"
		}
		return value, append(leftDiagnostics, rightDiagnostics...)
	case *ast.UnaryExpr:
		if typed.Op == token.AND {
			return o.lowerAddressExpr(ctx, typed.X)
		}
		if typed.Op == token.ARROW {
			value, diagnostics := o.lowerExpr(ctx, typed.X)
			return "await " + o.runtimeOwner.QualifiedHelper(RuntimeHelperChanRecv) + "(" + value + ")", diagnostics
		}
		value, diagnostics := o.lowerExpr(ctx, typed.X)
		if typed.Op == token.NOT || typed.Op == token.SUB || typed.Op == token.ADD {
			return lowerPrefixUnaryExpr(typed.Op, value), diagnostics
		}
		if typed.Op == token.XOR {
			resultType := ctx.semPkg.source.TypesInfo.TypeOf(typed)
			// The int64*/uint64* family returns bigint; number-typed wide results
			// (uint, uintptr) keep full 64-bit width through coerceWideHelperResult.
			wideComplement := func(helper RuntimeHelper) string {
				return coerceWideHelperResult(o.runtimeOwner, resultType,
					o.runtimeOwner.QualifiedHelper(helper)+"("+value+", -1n)")
			}
			if bits, ok := unsignedIntegerBits(resultType); ok {
				if bits <= 32 {
					return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) +
						"(~" + value + ", " + strconv.Itoa(bits) + ")", diagnostics
				}
				return wideComplement(RuntimeHelperUint64Xor), diagnostics
			}
			if isBigIntBackedType(resultType) {
				return wideComplement(RuntimeHelperInt64Xor), diagnostics
			}

			// The complement of an int, a number exact to 2^53, is -x - 1,
			// which keeps its bits above 32, where ~ keeps only 32.
			if bits, ok := signedIntegerBits(resultType); ok && bits > 32 {
				return "(-(" + value + ") - 1)", diagnostics
			}
			return "~" + value, diagnostics
		}
		return value, append(diagnostics, loweringUnsupportedAt(ctx, typed, "expression", ctx.semPkg.pkgPath, "unsupported unary operator"))
	case *ast.StarExpr:
		return o.lowerPointerValueExpr(ctx, typed.X)
	case *ast.ParenExpr:
		value, diagnostics := o.lowerExpr(ctx, typed.X)
		return "(" + value + ")", diagnostics
	case *ast.CallExpr:
		return o.lowerCallExpr(ctx, typed)
	case *ast.FuncLit:
		value, _, diagnostics := o.lowerFuncLit(ctx, typed)
		return value, diagnostics
	case *ast.SelectorExpr:
		return o.lowerSelectorExpr(ctx, typed)
	case *ast.IndexExpr:
		return o.lowerIndexExpr(ctx, typed)
	case *ast.SliceExpr:
		return o.lowerSliceExpr(ctx, typed)
	case *ast.CompositeLit:
		return o.lowerCompositeLit(ctx, typed, true)
	case *ast.TypeAssertExpr:
		return o.lowerTypeAssertExpr(ctx, typed)
	case *ast.IndexListExpr:
		return o.lowerExpr(ctx, typed.X)
	default:
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, typed, "expression", ctx.semPkg.pkgPath, "unsupported expression kind")}
	}
}

func lowerBasicLit(lit *ast.BasicLit) string {
	if lit.Kind == token.CHAR {
		value, err := strconv.Unquote(lit.Value)
		if err != nil || value == "" {
			return "0"
		}
		return strconv.FormatInt(int64([]rune(value)[0]), 10)
	}
	if lit.Kind == token.STRING {
		value, err := strconv.Unquote(lit.Value)
		if err != nil {
			return strconv.Quote(lit.Value)
		}
		return lowerGoStringLiteral(value)
	}
	if lit.Kind == token.INT && isLegacyOctalLiteral(lit.Value) {
		digits := strings.TrimLeft(strings.ReplaceAll(lit.Value, "_", ""), "0")
		if digits == "" {
			digits = "0"
		}
		return "0o" + digits
	}
	return lit.Value
}

func isStringLiteralExpr(expr ast.Expr) bool {
	lit, ok := unwrapParenExpr(expr).(*ast.BasicLit)
	return ok && lit.Kind == token.STRING
}

func isLegacyOctalLiteral(value string) bool {
	if len(value) < 2 || value[0] != '0' {
		return false
	}
	if len(value) >= 2 {
		switch value[1] {
		case 'x', 'X', 'o', 'O', 'b', 'B':
			return false
		}
	}
	for _, char := range value[1:] {
		if char == '_' {
			continue
		}
		return char >= '0' && char <= '7'
	}
	return false
}

func (o *LoweringOwner) lowerFuncLit(ctx lowerFileContext, lit *ast.FuncLit) (string, bool, []Diagnostic) {
	return o.lowerFuncLitWithAsyncCalls(ctx, lit, true)
}

func (o *LoweringOwner) lowerFuncLitForTarget(
	ctx lowerFileContext,
	lit *ast.FuncLit,
	targetType types.Type,
	allowAsyncOverrideCallback bool,
) (string, bool, []Diagnostic) {
	allowAsyncCalls := allowAsyncOverrideCallback || signatureForType(targetType) == nil
	return o.lowerFuncLitWithAsyncCalls(ctx, lit, allowAsyncCalls)
}

func (o *LoweringOwner) lowerFuncLitWithAsyncCalls(
	ctx lowerFileContext,
	lit *ast.FuncLit,
	allowAsyncCalls bool,
) (string, bool, []Diagnostic) {
	function, async, signature, diagnostics := o.lowerFuncLitArrowWithAsyncCalls(ctx, lit, allowAsyncCalls)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFunctionValue) +
		"(" + function + ", " + o.runtimeFunctionTypeInfo(signature, "") + ")", async, diagnostics
}

func (o *LoweringOwner) lowerFuncLitCallCallee(ctx lowerFileContext, lit *ast.FuncLit) (string, bool, []Diagnostic) {
	function, async, _, diagnostics := o.lowerFuncLitArrowWithAsyncCalls(ctx, lit, true)
	if async && ctx.syncDirectiveFunction {
		diagnostics = append(diagnostics, syncDirectiveSuspendsAt(ctx, lit.Pos(), "a function literal it calls may suspend"))
	}
	return function, async, diagnostics
}

// syncDirectiveSuspendsAt returns the error for code at pos that may suspend
// in a function that //goscript:sync marks.
func syncDirectiveSuspendsAt(ctx lowerFileContext, pos token.Pos, detail string) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/directive:sync-suspends",
		Message:  "function marked " + syncDirectiveLine + ", but " + detail,
		Position: ctx.diagnosticPosition(pos),
	}
}

func (o *LoweringOwner) lowerFuncLitArrowWithAsyncCalls(
	ctx lowerFileContext,
	lit *ast.FuncLit,
	allowAsyncCalls bool,
) (string, bool, *types.Signature, []Diagnostic) {
	signature, _ := ctx.semPkg.source.TypesInfo.TypeOf(lit).(*types.Signature)
	deferState := &loweredDeferState{}
	bodyCtx := ctx.withSignature(signature).withAsyncFunction(false).withDeferState(deferState).withoutRangeBranch().
		withSyncDirectiveFunction(false).withCallSiteFunction(false)
	var nested []string
	bodyCtx.nestedFunctions = &nested
	litAsync := allowAsyncCalls && (ctx.model == nil || ctx.model.funcLitAsync(lit.Pos()))
	asyncCompatibleParams := litAsync && funcLiteralNeedsAsyncFunctionParamCalls(signature)
	if litAsync {
		bodyCtx = bodyCtx.withAsyncFunction(true)
	}
	var params []loweredParam
	var paramBindings []loweredStmt
	if signature != nil && signature.Params() != nil {
		for idx := range signature.Params().Len() {
			param := signature.Params().At(idx)
			params, paramBindings = o.appendLoweredParam(ctx, params, paramBindings, param, idx, asyncCompatibleParams)
		}
	}
	body, diagnostics := o.lowerBlock(bodyCtx, lit.Body)
	litFn := &loweredFunction{body: body, deferState: deferState}
	if deferState.used {
		litFn.recoverReturn = o.recoverReturnStmt(bodyCtx, signature)
		if funcBodyUsesRecover(bodyCtx, lit.Body) {
			deferState.recover = true
		}
	}
	var rendered strings.Builder
	renderStmts(&rendered, paramBindings, 1)
	renderNamedResults(&rendered, o.lowerNamedResults(ctx, signature), 1)
	renderBodyWithDefer(&rendered, litFn, 1)

	// The analysis decides whether the literal is async. Its lowered text
	// holds the awaits of its own body, apart from the literals nested in it,
	// and only a literal lowered for a synchronous override callback consults
	// it.
	async := bodyCtx.asyncFunction || deferState.async || (!allowAsyncCalls && stmtsContainAwait(body, nested))
	prefix := ""
	if async {
		prefix = "async "
	}

	// A literal without results needs no result annotation: TypeScript
	// infers void, or a Promise of void when the literal is async.
	resultType := ""
	if signature != nil && signature.Results().Len() != 0 {
		resultType = ": " + asyncResultType(o.tsSignatureResultFor(ctx, signature), async)
	}
	function := prefix + "(" + renderLoweredParams(params) + ")" + resultType + " => {\n" +
		rendered.String() + "}"

	// The enclosing literal and the calls through a fixed local read the
	// lowered literal.
	if ctx.nestedFunctions != nil {
		*ctx.nestedFunctions = append(*ctx.nestedFunctions, function)
	}
	if ctx.funcLitAsync != nil {
		ctx.funcLitAsync[lit] = async
	}
	return function, async, signature, diagnostics
}

func renderLoweredParams(params []loweredParam) string {
	if len(params) == 0 {
		return ""
	}
	rendered := make([]string, 0, len(params))
	for _, param := range params {
		rendered = append(rendered, param.name+": "+param.typ)
	}
	return strings.Join(rendered, ", ")
}

// stmtsContainAwait reports whether the lowered statements await, outside
// the nested function literals they contain.
func stmtsContainAwait(stmts []loweredStmt, nested []string) bool {
	for _, stmt := range stmts {
		if textAwaits(stmt.text, nested) ||
			stmtsContainAwait(stmt.children, nested) ||
			stmtsContainAwait(stmt.elseBody, nested) {
			return true
		}
		if stmt.rangeFunc != nil && (stmt.rangeFunc.async || stmtsContainAwait(stmt.rangeFunc.body, nested)) {
			return true
		}
		if stmt.selectStmt != nil {
			return true
		}
		if stmt.switchStmt != nil {
			if textAwaits(stmt.switchStmt.value, nested) {
				return true
			}
			for _, switchCase := range stmt.switchStmt.cases {
				for _, value := range switchCase.values {
					if textAwaits(value, nested) {
						return true
					}
				}
				if stmtsContainAwait(switchCase.body, nested) {
					return true
				}
			}
		}
		if stmt.typeSwitch != nil {
			if textAwaits(stmt.typeSwitch.value, nested) {
				return true
			}
			for _, switchCase := range stmt.typeSwitch.cases {
				if stmtsContainAwait(switchCase.body, nested) {
					return true
				}
			}
			if stmtsContainAwait(stmt.typeSwitch.defaultBody, nested) {
				return true
			}
		}
	}
	return false
}

// withNestedFunctions returns ctx collecting the function literals lowered
// in it, and a function that returns those lowered since this call, for
// textAwaits.
func (ctx lowerFileContext) withNestedFunctions() (lowerFileContext, func() []string) {
	if ctx.nestedFunctions == nil {
		ctx.nestedFunctions = new([]string)
	}
	collected, start := ctx.nestedFunctions, len(*ctx.nestedFunctions)
	return ctx, func() []string { return (*collected)[start:] }
}

// textAwaits reports whether the lowered text awaits outside the nested
// function literals it contains.
func textAwaits(text string, nested []string) bool {
	if !strings.Contains(text, "await ") {
		return false
	}
	for _, function := range nested {
		text = strings.ReplaceAll(text, function, "")
	}
	return strings.Contains(text, "await ")
}

func lowerIdent(ident *ast.Ident) string {
	switch ident.Name {
	case "nil":
		return "null"
	case "true", "false":
		return ident.Name
	default:
		return safeIdentifier(ident.Name)
	}
}

// lowerIdent lowers an identifier in an expression. Unless raw, a variable
// stored in a pointer box is read through its value.
func (o *LoweringOwner) lowerIdent(ctx lowerFileContext, ident *ast.Ident, raw bool) string {
	// Keep the predeclared literals.
	value := lowerIdent(ident)
	if ident.Name == "nil" || ident.Name == "true" || ident.Name == "false" {
		return value
	}

	// Resolve aliases, constants, and imported objects.
	obj := objectForIdent(ctx, ident)
	if alias := ctx.identAliases[obj]; alias != "" {
		if !raw && obj != nil && ctx.identAliasRefs[obj] && ctx.model.needsVarRef[obj] {
			return alias + ".value"
		}
		return alias
	}
	if constObj, ok := obj.(*types.Const); ok && !raw {
		if constValue, ok := lowerConstantValueForType(constObj.Val(), constObj.Type()); ok {
			return constValue
		}
	}
	if imported, ok := o.lowerImportedIdent(ctx, obj, value, raw); ok {
		return imported
	}

	// Read a variable declared in another file of this package through
	// that file's module alias.
	if alias := ctx.localAliases[obj]; alias != "" {
		qualified := alias + "." + value
		if ctx.lazyPackageVars[obj] {
			qualified = o.lazyPackageVarRead(ctx, alias+".", obj)
		}
		if raw {
			return qualified
		}
		return o.lowerPackageVarReadValue(ctx, obj, qualified)
	}

	// Read a variable of this file, unboxed unless raw.
	if raw {
		return value
	}
	if ctx.lazyPackageVars[obj] {
		return o.lowerPackageVarReadValue(ctx, obj, o.lazyPackageVarRead(ctx, "", obj))
	}
	if obj != nil && ctx.model.needsVarRef[obj] {
		return value + ".value"
	}
	return value
}

// lowerImportedIdent lowers obj when it belongs to an imported package,
// qualifying value by the import alias.
func (o *LoweringOwner) lowerImportedIdent(ctx lowerFileContext, obj types.Object, value string, raw bool) (string, bool) {
	// Find the import alias of the object's package.
	if obj == nil || obj.Pkg() == nil || ctx.semPkg == nil || obj.Pkg().Path() == ctx.semPkg.pkgPath {
		return "", false
	}
	alias := ctx.importPaths[obj.Pkg().Path()]
	if alias == "" {
		return "", false
	}

	// Qualify the object, reading a lazy variable through its getter.
	qualified := alias + "." + value
	if packageVarIsLazy(ctx, obj) {
		qualified = o.lazyPackageVarRead(ctx, alias+".", obj)
	}
	if raw {
		return qualified, true
	}
	return o.lowerPackageVarReadValue(ctx, obj, qualified), true
}

func (o *LoweringOwner) lowerPackageVarReadValue(ctx lowerFileContext, obj types.Object, value string) string {
	if obj == nil || ctx.model == nil || !ctx.model.needsVarRef[obj] {
		return value
	}
	if varObj, ok := obj.(*types.Var); ok && packageVarReadNeedsPointerValue(varObj.Type()) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<" + o.tsNonNilTypeFor(ctx, varObj.Type()) + ">(" + value + ")"
	}
	return value + ".value"
}

func objectForIdent(ctx lowerFileContext, ident *ast.Ident) types.Object {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	if obj := ctx.semPkg.source.TypesInfo.Uses[ident]; obj != nil {
		return obj
	}
	return ctx.semPkg.source.TypesInfo.Defs[ident]
}

func objectForValueExpr(ctx lowerFileContext, expr ast.Expr) types.Object {
	switch typed := expr.(type) {
	case *ast.Ident:
		return objectForIdent(ctx, typed)
	case *ast.SelectorExpr:
		if ctx.semPkg == nil || ctx.semPkg.source == nil {
			return nil
		}
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil {
			return nil
		}
		return ctx.semPkg.source.TypesInfo.Uses[typed.Sel]
	default:
		return nil
	}
}

func objectNeedsVarRef(ctx lowerFileContext, obj types.Object) bool {
	if obj == nil || ctx.model == nil {
		return false
	}
	if ctx.model.needsVarRef[obj] {
		return true
	}
	if obj.Pkg() == nil {
		return false
	}
	semPkg := ctx.model.packages[obj.Pkg().Path()]
	return semPkg != nil && semPkg.varRefNames[obj.Name()]
}

func (o *LoweringOwner) lowerCallExpr(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic) {
	if ident, ok := expr.Fun.(*ast.Ident); ok && isBuiltinCallTarget(ctx, ident) {
		switch ident.Name {
		case "make":
			return o.lowerMakeExpr(ctx, expr)
		case "new":
			return o.lowerNewExpr(ctx, expr)
		case "copy":
			if call, diagnostics, ok := o.lowerByteCopyRanges(ctx, expr); ok {
				return call, diagnostics
			}
		}
	}
	if targetType := typeFromExpr(ctx, expr.Fun); targetType != nil {
		return o.lowerConversionExpr(ctx, expr, targetType)
	}

	args, diagnostics := o.lowerCallArgs(ctx, expr, callTargetSignature(ctx, expr.Fun))
	if fun, ok := unwrapParenExpr(expr.Fun).(*ast.FuncLit); ok {
		callee, async, calleeDiagnostics := o.lowerFuncLitCallCallee(ctx, fun)
		call := "(" + callee + ")(" + strings.Join(args, ", ") + ")"
		if async {
			call = "await " + call
			if ctx.deferState != nil {
				ctx.deferState.async = true
			}
		}
		return call, append(diagnostics, calleeDiagnostics...)
	}

	switch fun := expr.Fun.(type) {
	case *ast.Ident:
		if isBuiltinCallTarget(ctx, fun) {
			switch fun.Name {
			case "println", "print":
				helper := RuntimeHelperPrintln
				if fun.Name == "print" {
					helper = RuntimeHelperPrint
				}
				// The print helpers render operands through the async
				// MaybePromise convention, so the write is awaited to keep
				// host output in Go call order relative to other awaited
				// writers.
				if ctx.deferState != nil {
					ctx.deferState.async = true
				}
				return "await " + o.runtimeOwner.QualifiedHelper(helper) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "append":
				// Appended values copy at the argument boundary, before callers
				// can reuse a struct or array used to build the slice.
				if len(expr.Args) > 0 {
					if slice, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0])).Underlying().(*types.Slice); ok {
						for idx := 1; idx < len(args); idx++ {
							if expr.Ellipsis != token.NoPos && idx == len(args)-1 {
								continue
							}
							args[idx] = o.lowerValueForTargetTypes(
								ctx,
								slice.Elem(),
								ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[idx]),
								args[idx],
								o.shouldCloneStructValue(ctx, expr.Args[idx]),
							)
						}
					}
				}
				appendHelper := o.runtimeOwner.QualifiedHelper(RuntimeHelperAppend)
				// Values of a type that the arguments above already copied, and
				// that is not a byte, append without the general helper: one
				// value with appendOne, and more with appendValues, which takes
				// the element hint before them.
				hintFirst := false
				if expr.Ellipsis == token.NoPos && len(args) >= 2 {
					if slice, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr)).Underlying().(*types.Slice); ok &&
						!isByteType(slice.Elem()) && !isTypeParamType(slice.Elem()) {
						appendHelper = o.runtimeOwner.QualifiedHelper(RuntimeHelperAppendOne)
						if len(args) > 2 {
							appendHelper = o.runtimeOwner.QualifiedHelper(RuntimeHelperAppendValues)
							hintFirst = true
						}
					}
				}
				if expr.Ellipsis != token.NoPos && len(args) > 1 {
					last := len(args) - 1
					spread := args[last]
					if isStringType(ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[len(expr.Args)-1])) {
						spread = o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + spread + ")"
					}
					args[last] = spread
					appendHelper = o.runtimeOwner.QualifiedHelper(RuntimeHelperAppendSlice)
				}
				if len(args) > 0 && args[0] == "null" {
					if slice, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr)).Underlying().(*types.Slice); ok {
						appendHelper += "<" + o.tsTypeFor(ctx, slice.Elem()) + ">"
					}
				}
				// Most zeros are inferred from appended values. Carry static
				// metadata only when the dynamic value can differ from the Go
				// slice element zero.
				elemHint := ""
				if slice, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr)).Underlying().(*types.Slice); ok {
					if isByteType(slice.Elem()) {
						elemHint = o.runtimeOwner.QualifiedHelper(RuntimeHelperByteSliceHint)
					} else if _, hint := typedSliceArray(slice.Elem()); hint != "" {
						elemHint = o.runtimeOwner.QualifiedHelper(RuntimeHelperTypedSliceHints) + "." + hint
					} else if appendZeroNeedsStaticHint(slice.Elem()) {
						zero := o.lowerDeclarationZeroValueExpr(ctx, slice.Elem())
						zeroHint := ""
						switch {
						case zero == "null" || strings.HasPrefix(zero, "null as ") || strings.HasPrefix(zero, "null! as "):
							zeroHint = o.runtimeOwner.QualifiedHelper(RuntimeHelperAppendZeros) + ".nil"
						case isComplexType(slice.Elem()):
							zeroHint = o.runtimeOwner.QualifiedHelper(RuntimeHelperAppendZeros) + ".complex"
						default:
							zeroFactory := "() => (" + zero + " as " + o.tsSliceElemTypeFor(ctx, slice.Elem()) + ")"
							zeroHint = o.runtimeOwner.QualifiedHelper(RuntimeHelperAppendZero) +
								"(" + zeroFactory + ")"
						}
						elemHint = zeroHint
					}
				}

				// The hint follows the values, or precedes them for appendValues.
				switch {
				case hintFirst && elemHint == "":
					args = slices.Insert(args, 1, "undefined")
				case hintFirst:
					args = slices.Insert(args, 1, elemHint)
				case elemHint != "":
					args = append(args, elemHint)
				}
				return appendHelper + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "cap":
				if len(expr.Args) == 1 {
					args[0] = o.lowerArrayPointerTarget(ctx, args[0], ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0]))
				}
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperCap) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "clear":
				// A factory gives the zero value of the element type, which
				// the runtime cannot tell from the elements: a struct or
				// array element is cleared to a zero value of its own, and a
				// 64 bit word held as a bigint to the number zero.
				if sliceType, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0])).Underlying().(*types.Slice); ok && !isTypeParamType(sliceType.Elem()) {
					args = append(args, "() => "+o.lowerZeroValueExprFor(ctx, sliceType.Elem()))
				}
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperClear) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "copy":
				// Struct elements are copied in place, as Go copies memory.
				if sliceType, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0])).Underlying().(*types.Slice); ok && isStructValueType(sliceType.Elem()) {
					args = append(args, "true")
				}
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperCopy) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "delete":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperDeleteMapEntry) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "len":
				if len(expr.Args) == 1 {
					if literalLen, ok := lowerConstantStringLen(ctx, expr.Args[0]); ok {
						return literalLen, diagnostics
					}
					argType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0])
					args[0] = o.lowerArrayPointerTarget(ctx, args[0], argType)
					// The length of a string or slice, known by its static
					// type, is read without the general len dispatch.
					if _, isTypeParam := types.Unalias(argType).(*types.TypeParam); !isTypeParam && argType != nil {
						switch underlying := types.Unalias(argType).Underlying().(type) {
						case *types.Basic:
							if underlying.Info()&types.IsString != 0 {
								return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringLen) + "(" + args[0] + ")", diagnostics
							}
						case *types.Slice:
							if length, ok := loopWindowLen(ctx, expr.Args[0]); ok {
								return length, diagnostics
							}
							return o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceLen) + "(" + args[0] + ")", diagnostics
						}
					}
				}
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperLen) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "max":
				return o.lowerMinMaxBuiltin(ctx, expr, args, true), diagnostics
			case "min":
				return o.lowerMinMaxBuiltin(ctx, expr, args, false), diagnostics
			case "complex":
				if isComplex64Type(ctx.semPkg.source.TypesInfo.TypeOf(expr)) && len(args) == 2 {
					return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex64) + "(" + strings.Join(args, ", ") + ")", diagnostics
				}
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "real":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperReal) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "imag":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperImag) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "panic":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperPanic) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "recover":
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperRecover) + "(" + strings.Join(args, ", ") + ")", diagnostics
			case "close":
				if len(args) != 1 {
					return "undefined", append(diagnostics, loweringUnsupportedAt(ctx, expr, "call", ctx.semPkg.pkgPath, "close requires one argument"))
				}
				if isMadeLocal(ctx, expr.Args[0]) {
					return args[0] + ".close()", diagnostics
				}
				return args[0] + "!.close()", diagnostics
			}
		}
		if genericFunctionSignature(ctx, fun) != nil {
			args = append([]string{o.genericTypeArgsExpr(ctx, fun, nil)}, args...)
		}
		callee := o.lowerCallableExpr(ctx, fun, o.lowerIdent(ctx, fun, false))
		call := callee + "(" + strings.Join(args, ", ") + ")"
		return o.awaitCallIfNeeded(ctx, expr, call), diagnostics
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[fun]; selection != nil && selection.Kind() == types.MethodVal {
			if typeParam := receiverTypeParam(selection.Recv()); typeParam != nil {
				receiverExpr, receiverDiagnostics := o.lowerExpr(ctx, fun.X)
				diagnostics = append(diagnostics, receiverDiagnostics...)
				if !typeParamInScope(ctx, typeParam) {
					call := receiverExpr + "." + fun.Sel.Name + "(" + strings.Join(args, ", ") + ")"
					return o.awaitCallIfNeeded(ctx, expr, call), diagnostics
				}
				methodArgs := append([]string{"__typeArgs", strconv.Quote(typeParam.Obj().Name()), strconv.Quote(fun.Sel.Name), receiverExpr}, args...)
				call := o.runtimeOwner.QualifiedHelper(RuntimeHelperCallGenericMethod) + "(" + strings.Join(methodArgs, ", ") + ")"
				return o.awaitCallIfNeeded(ctx, expr, call), diagnostics
			}
			// A generic method on a plain receiver takes its own type dictionary.
			if genericFunctionSignature(ctx, fun) != nil &&
				len(genericReceiverTypeParams(selection.Recv())) == 0 &&
				!o.callUsesOverridePackage(ctx, fun) {
				args = append([]string{o.genericTypeArgsExpr(ctx, fun, nil)}, args...)
			}
			if genericArgs := o.genericReceiverTypeArgsExpr(ctx, selection); genericArgs != "" &&
				!o.callUsesOverridePackage(ctx, fun) {
				if isInterfaceType(selection.Recv()) {
					receiverExpr, receiverDiagnostics := o.lowerMethodReceiverExpr(ctx, fun.X, selection)
					diagnostics = append(diagnostics, receiverDiagnostics...)
					callArgs := []string{receiverExpr, strconv.Quote(fun.Sel.Name), genericArgs}
					callArgs = append(callArgs, args...)
					call := o.runtimeOwner.QualifiedHelper(RuntimeHelperCallInterfaceMethod) +
						"(" + strings.Join(callArgs, ", ") + ")"
					return o.awaitCallIfNeeded(ctx, expr, call), diagnostics
				}
				args = append([]string{genericArgs}, args...)
			}
			receiver := methodReceiverNamedType(selection.Obj())
			if receiver == nil {
				receiver = receiverNamedType(selection.Recv())
			}
			if namedNonInterfaceNonStructType(receiver) {
				return o.lowerNamedReceiverMethodCall(ctx, expr, args, diagnostics)
			}
			if call, callDiagnostics, ok := o.lowerPointerReceiverMethodCall(ctx, fun, selection, args); ok {
				return o.awaitCallIfNeeded(ctx, expr, call), append(diagnostics, callDiagnostics...)
			}
			// A method that observes its receiver takes the address of a
			// struct value.
			if call, callDiagnostics, ok := o.lowerIdentityReceiverMethodCall(ctx, fun, selection, args); ok {
				return o.awaitCallIfNeeded(ctx, expr, call), append(diagnostics, callDiagnostics...)
			}
			receiverExpr, receiverDiagnostics := o.lowerMethodReceiverExpr(ctx, fun.X, selection)
			diagnostics = append(diagnostics, receiverDiagnostics...)
			call := receiverExpr + "." + fun.Sel.Name + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, expr, call), diagnostics
		}
		selector, selectorDiagnostics := o.lowerSelectorExpr(ctx, fun)
		if genericFunctionSignature(ctx, fun) != nil &&
			(!o.callUsesOverridePackage(ctx, fun) || o.overrideFacts().TakesTypeArgs(calledFunction(ctx.semPkg.source, fun))) {
			args = append([]string{o.genericTypeArgsExpr(ctx, fun, nil)}, args...)
		}
		args = o.appendSlicesGrowZeroFactory(ctx, fun, expr, args)
		// unsafe.Slice of typed array elements views the memory that its
		// pointer points into as those elements, so it is told their kind.
		if unsafePackageFunction(ctx, fun, "Slice") {
			if slice, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr)).Underlying().(*types.Slice); ok {
				if _, hint := typedSliceArray(slice.Elem()); hint != "" {
					args = append(args, strconv.Quote(hint))
				}
			}
		}
		call := o.lowerCallableExpr(ctx, fun, selector) + "(" + strings.Join(args, ", ") + ")"
		if unsafePackageFunction(ctx, fun, "Slice") {
			call = "(" + call + " as " + o.tsTypeFor(ctx, ctx.semPkg.source.TypesInfo.TypeOf(expr)) + ")"
		}
		return o.awaitCallIfNeeded(ctx, expr, call), append(diagnostics, selectorDiagnostics...)
	case *ast.IndexExpr:
		if signature := callTargetSignature(ctx, fun); signature != nil {
			if callTargetSignature(ctx, fun.X) != nil {
				callee, calleeDiagnostics := o.lowerExpr(ctx, fun.X)
				if !o.callUsesSlicesOverride(ctx, fun.X) {
					args = append([]string{o.genericTypeArgsExpr(ctx, fun.X, []ast.Expr{fun.Index})}, args...)
				}
				args = o.appendSlicesGrowZeroFactory(ctx, fun.X, expr, args)
				call := o.lowerCallableExpr(ctx, fun.X, callee) + "(" + strings.Join(args, ", ") + ")"
				return o.awaitCallIfNeeded(ctx, expr, call), append(diagnostics, calleeDiagnostics...)
			}
			callee, calleeDiagnostics := o.lowerExpr(ctx, fun)
			call := o.lowerCallableExpr(ctx, fun, callee) + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, expr, call), append(diagnostics, calleeDiagnostics...)
		}
	case *ast.IndexListExpr:
		if signature, _ := ctx.semPkg.source.TypesInfo.TypeOf(fun).(*types.Signature); signature != nil {
			callee, calleeDiagnostics := o.lowerExpr(ctx, fun.X)
			if !o.callUsesSlicesOverride(ctx, fun.X) {
				args = append([]string{o.genericTypeArgsExpr(ctx, fun.X, fun.Indices)}, args...)
			}
			args = o.appendSlicesGrowZeroFactory(ctx, fun.X, expr, args)
			call := o.lowerCallableExpr(ctx, fun.X, callee) + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, expr, call), append(diagnostics, calleeDiagnostics...)
		}
	case *ast.CallExpr:
		callee, calleeDiagnostics := o.lowerCallExpr(ctx, fun)
		if strings.HasPrefix(callee, "await ") {
			callee = "(" + callee + ")"
		}
		callee = o.lowerCallableExpr(ctx, fun, callee)
		call := callee + "(" + strings.Join(args, ", ") + ")"
		if strings.HasPrefix(callee, "(await ") && ctx.deferState != nil {
			ctx.deferState.async = true
		}
		return o.awaitCallIfNeeded(ctx, expr, call), append(diagnostics, calleeDiagnostics...)
	default:
		if callTargetSignature(ctx, expr.Fun) != nil {
			callee, calleeDiagnostics := o.lowerExpr(ctx, expr.Fun)
			if strings.HasPrefix(callee, "await ") {
				callee = "(" + callee + ")"
			}
			call := o.lowerCallableExpr(ctx, expr.Fun, callee) + "(" + strings.Join(args, ", ") + ")"
			return o.awaitCallIfNeeded(ctx, expr, call), append(diagnostics, calleeDiagnostics...)
		}
		return "undefined", append(diagnostics, loweringUnsupportedAt(ctx, expr.Fun, "call", ctx.semPkg.pkgPath, errors.Errorf("unsupported call target %T", expr.Fun).Error()))
	}
	return "undefined", append(diagnostics, loweringUnsupportedAt(ctx, expr.Fun, "call", ctx.semPkg.pkgPath, errors.Errorf("unsupported call target %T", expr.Fun).Error()))
}

func (o *LoweringOwner) lowerCallableExpr(ctx lowerFileContext, expr ast.Expr, callee string) string {
	if callTargetNeedsNonNull(ctx, expr) {
		return callee + "!"
	}
	return callee
}

// lowerCallArgs lowers the arguments of a call against the callee's
// signature. Variadic arguments are packed into a slice, except for calls to
// override packages, which take them as TypeScript rest parameters.
func (o *LoweringOwner) lowerCallArgs(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	signature *types.Signature,
) ([]string, []Diagnostic) {
	// An ordinary call keeps its arguments in place, passes its position to
	// a function that takes it (see callSiteArg), and asks for the results it
	// may borrow (see collectBorrowCalls).
	if ctx.hoistArgsCall != expr || ctx.hoistedArgs == nil {
		args, diagnostics := o.lowerCallArgValues(ctx, expr, signature, o.callUsesOverridePackage(ctx, expr.Fun))
		if site, ok := o.callSiteArg(ctx, expr); ok {
			args = append(args, site)
		}
		if flag, ok := borrowCallArg(ctx, expr); ok {
			args = append(args, flag)
		}
		return args, diagnostics
	}

	// The arguments of a deferred or go call are evaluated where the
	// statement runs, so each is stored in a temporary that the call reads.
	hoisted := ctx.hoistedArgs
	overrideCall := !ctx.hoistedCallee && o.callUsesOverridePackage(ctx, expr.Fun)
	ctx.hoistArgsCall, ctx.hoistedArgs, ctx.hoistedCallee = nil, nil, false
	args, diagnostics := o.lowerCallArgValues(ctx, expr, signature, overrideCall)

	// A literal needs no temporary; the others are stored, a spread keeping
	// its marker on the temporary.
	for idx, arg := range args {
		if isHoistFreeArg(arg) {
			continue
		}
		spread := strings.HasPrefix(arg, "...")
		value := arg
		if spread {
			value = strings.TrimPrefix(arg, "...")
		}
		temp := ctx.tempName("DeferArg")
		*hoisted = append(*hoisted, "const "+temp+" = "+value)
		if spread {
			temp = "..." + temp
		}
		args[idx] = temp
	}
	return args, diagnostics
}

// isHoistFreeArg reports whether a lowered argument is a literal, whose value
// does not depend on when it is evaluated.
func isHoistFreeArg(arg string) bool {
	if arg == "null" || arg == "undefined" || arg == "true" || arg == "false" {
		return true
	}
	if _, err := strconv.ParseFloat(arg, 64); err == nil {
		return true
	}
	if len(arg) >= 2 && arg[0] == '"' && arg[len(arg)-1] == '"' && !strings.ContainsAny(arg[1:len(arg)-1], "\\\"") {
		return true
	}
	return false
}

// lowerCallArgValues lowers the arguments of a call (see lowerCallArgs).
// overrideCall is whether the call is made directly to an override package,
// whose TypeScript signatures differ from the Go shape.
func (o *LoweringOwner) lowerCallArgValues(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	signature *types.Signature,
	overrideCall bool,
) ([]string, []Diagnostic) {
	// Override callbacks may suspend only when the override awaits them.
	allowAsyncOverrideCallback := !overrideCall ||
		o.overrideCallNeedsAwait(ctx, expr.Fun) ||
		o.callbackOverrideCallNeedsAwait(ctx, expr)

	// Spread tuple arguments and special override shapes have their own paths.
	if args, diagnostics, ok := o.lowerTupleCallArgs(ctx, expr, signature, overrideCall); ok {
		return args, diagnostics
	}
	if overrideCall && isProtobufTextWriteStringerCall(ctx, expr.Fun) {
		return o.lowerProtobufTextWriteStringerArgs(ctx, expr, signature, allowAsyncOverrideCallback)
	}
	if signature == nil || !signature.Variadic() || isBuiltinCallTarget(ctx, expr.Fun) {
		return o.lowerFixedCallArgs(ctx, expr, signature, overrideCall, allowAsyncOverrideCallback)
	}
	if overrideCall {
		return o.lowerOverrideVariadicCallArgs(ctx, expr, signature, allowAsyncOverrideCallback)
	}

	// Lower the fixed arguments in place and collect the variadic ones.
	params := signature.Params()
	fixedCount := params.Len() - 1
	variadicType := params.At(fixedCount).Type()
	args := make([]string, 0, params.Len())
	var variadicArgs []string
	var diagnostics []Diagnostic
	for idx, arg := range expr.Args {
		targetType := variadicType
		if idx < fixedCount {
			targetType = params.At(idx).Type()
		}
		lowered, argDiagnostics := o.lowerCallArgExpr(ctx, arg, targetType, allowAsyncOverrideCallback)
		diagnostics = append(diagnostics, argDiagnostics...)
		if idx < fixedCount {
			args = append(args, o.lowerCallArgForTarget(ctx, arg, targetType, lowered, false))
			continue
		}
		if expr.Ellipsis != token.NoPos && idx == len(expr.Args)-1 {
			lowered = o.lowerCallArgForTarget(ctx, arg, targetType, lowered, false)
			// A slice of a named type, such as a generic named slice whose
			// TypeScript type has an any element, is passed as the variadic
			// parameter's slice type.
			if argType := ctx.semPkg.source.TypesInfo.TypeOf(arg); argType != nil && !types.Identical(argType, variadicType) {
				lowered = "(" + lowered + " as " + o.tsTypeFor(ctx, variadicType) + ")"
			}
			args = append(args, lowered)
			continue
		}
		if slice, ok := types.Unalias(variadicType).Underlying().(*types.Slice); ok {
			lowered = o.lowerCallArgForTarget(ctx, arg, slice.Elem(), lowered, false)
		}
		variadicArgs = append(variadicArgs, lowered)
	}

	// Pack the variadic arguments, unless a slice was passed with ellipsis.
	if len(expr.Args) < fixedCount || (expr.Ellipsis != token.NoPos && len(args) == params.Len()) {
		return args, diagnostics
	}
	if len(variadicArgs) == 0 {
		return append(args, "null"), diagnostics
	}
	if slice, ok := types.Unalias(variadicType).Underlying().(*types.Slice); ok {
		return append(args, o.packedSliceExpr(slice.Elem(), o.tsTypeFor(ctx, slice.Elem()), variadicArgs)), diagnostics
	}
	args = append(args, o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayToSlice)+
		"<any>(["+strings.Join(variadicArgs, ", ")+"])")
	return args, diagnostics
}

// packedSliceExpr returns a new slice of the lowered values, of elements of
// type elem spelled elemType, held in the typed array of such elements other
// than bytes if there is one, as a slice literal is.
func (o *LoweringOwner) packedSliceExpr(elem types.Type, elemType string, values []string) string {
	if typedArray, hint := typedSliceArray(elem); typedArray != "" && hint != "byte" {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperTypedSliceOf) +
			"(" + typedArray + ", [" + strings.Join(values, ", ") + "]) as $.Slice<" + elemType + ">"
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayToSlice) +
		"<" + elemType + ">([" + strings.Join(values, ", ") + "])"
}

// lowerOverrideVariadicCallArgs lowers the arguments of a variadic call to an
// override package, whose TypeScript signature takes the variadic arguments as
// a rest parameter. A function value passed to a fixed callback parameter that
// the override calls without awaiting is adapted to return synchronously.
func (o *LoweringOwner) lowerOverrideVariadicCallArgs(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	signature *types.Signature,
	allowAsyncOverrideCallback bool,
) ([]string, []Diagnostic) {
	// Each argument after the fixed ones targets the variadic element type.
	params := signature.Params()
	fixedCount := params.Len() - 1
	elemType := params.At(fixedCount).Type()
	if slice, ok := types.Unalias(elemType).Underlying().(*types.Slice); ok {
		elemType = slice.Elem()
	}

	// Lower each argument and spread a slice passed with ellipsis.
	args := make([]string, 0, len(expr.Args))
	var diagnostics []Diagnostic
	for idx, arg := range expr.Args {
		param := params.At(min(idx, fixedCount))
		allowAsyncCallback := allowAsyncOverrideCallback || o.overrideAwaitsCallback(ctx, expr.Fun, param.Name())
		lowered, argDiagnostics := o.lowerCallArgExpr(ctx, arg, param.Type(), allowAsyncCallback)
		diagnostics = append(diagnostics, argDiagnostics...)
		switch {
		case idx < fixedCount:
			lowered = o.lowerCallArgForTarget(ctx, arg, param.Type(), lowered, true)
			if !allowAsyncCallback {
				lowered = o.lowerSyncCallbackArg(ctx, arg, param.Type(), lowered)
			}
		case expr.Ellipsis != token.NoPos && idx == len(expr.Args)-1:
			lowered = "...(" + o.lowerCallArgForTarget(ctx, arg, param.Type(), lowered, true) + " ?? [])"
		default:
			lowered = o.lowerCallArgForTarget(ctx, arg, elemType, lowered, true)
		}
		args = append(args, lowered)
	}
	return args, diagnostics
}

// lowerTupleCallArgs lowers a call whose only argument is a call returning
// several values, as in f(g()). The results fill the parameters in order,
// each converted to its parameter type. For a variadic f the results past the
// fixed parameters are packed into the variadic slice, or passed as rest
// arguments to an override package.
func (o *LoweringOwner) lowerTupleCallArgs(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	signature *types.Signature,
	overrideCall bool,
) ([]string, []Diagnostic, bool) {
	// Only a lone multi-value call argument spreads over the parameters.
	if signature == nil || len(expr.Args) != 1 || expr.Ellipsis != token.NoPos ||
		isBuiltinCallTarget(ctx, expr.Fun) {
		return nil, nil, false
	}
	sourceResults := tupleResultTypes(ctx, expr.Args[0])
	if sourceResults == nil || sourceResults.Len() < 2 {
		return nil, nil, false
	}

	// The results must cover the fixed parameters, and match them exactly
	// for a non-variadic callee, which an override does not take as a tuple.
	params := signature.Params()
	variadic := signature.Variadic()
	fixedCount := params.Len()
	var elemType types.Type
	if variadic {
		fixedCount--
		elemType = params.At(fixedCount).Type().Underlying().(*types.Slice).Elem()
	}
	if variadic && sourceResults.Len() < fixedCount ||
		!variadic && (overrideCall || sourceResults.Len() != params.Len()) {
		return nil, nil, false
	}

	// Convert each result, read from the tuple placeholder, to its target.
	value, diagnostics := o.lowerTupleExpr(ctx, expr.Args[0])
	var parts, partTypes, packed []string
	changed := false
	for idx := range sourceResults.Len() {
		target := elemType
		if idx < fixedCount {
			target = params.At(idx).Type()
		}
		part := "__goscriptTupleArg[" + strconv.Itoa(idx) + "]"
		converted := o.lowerValueForTargetTypes(ctx, target, sourceResults.At(idx).Type(), part, false)
		changed = changed || converted != part
		if idx >= fixedCount && !overrideCall {
			packed = append(packed, converted)
			continue
		}
		parts = append(parts, converted)
		partTypes = append(partTypes, o.tsTypeFor(ctx, target))
	}

	// A non-override variadic call takes the rest as one slice argument.
	if variadic && !overrideCall {
		slice := "null"
		if len(packed) > 0 {
			slice = o.packedSliceExpr(elemType, o.tsTypeFor(ctx, elemType), packed)
		}
		parts = append(parts, slice)
		partTypes = append(partTypes, o.tsTypeFor(ctx, params.At(fixedCount).Type()))
	}

	// Results that fill the parameters with no conversion spread directly.
	if !variadic && !changed {
		return []string{"...(" + o.parenthesizedTupleCast(ctx, value, params) + ")"}, diagnostics, true
	}
	temp := ctx.tempName("TupleArg")
	for idx, part := range parts {
		parts[idx] = strings.ReplaceAll(part, "__goscriptTupleArg", temp)
	}
	body := "const " + temp + " = " + value + "; return [" + strings.Join(parts, ", ") + "] as [" + strings.Join(partTypes, ", ") + "]"
	if strings.Contains(value, "await ") {
		return []string{"...(await (async () => { " + body + " })())"}, diagnostics, true
	}
	return []string{"...(() => { " + body + " })()"}, diagnostics, true
}

func (o *LoweringOwner) parenthesizedTupleCast(ctx lowerFileContext, value string, params *types.Tuple) string {
	if strings.HasPrefix(value, "await ") {
		return "(" + value + ") as " + o.tupleTypeForParams(ctx, params)
	}
	return value + " as " + o.tupleTypeForParams(ctx, params)
}

func (o *LoweringOwner) tupleTypeForParams(ctx lowerFileContext, params *types.Tuple) string {
	if params == nil || params.Len() == 0 {
		return "[]"
	}
	parts := make([]string, 0, params.Len())
	for v := range params.Variables() {
		parts = append(parts, o.tsTypeFor(ctx, v.Type()))
	}
	return "[" + strings.Join(parts, ", ") + "]"
}

func (o *LoweringOwner) lowerProtobufTextWriteStringerArgs(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	signature *types.Signature,
	allowAsyncOverrideCallback bool,
) ([]string, []Diagnostic) {
	var params *types.Tuple
	if signature != nil {
		params = signature.Params()
	}
	args := make([]string, 0, len(expr.Args))
	var diagnostics []Diagnostic
	for idx, arg := range expr.Args {
		var targetType types.Type
		if params != nil && idx < params.Len() {
			targetType = params.At(idx).Type()
		}
		if idx == 1 {
			if sourceSignature := sourceFunctionSignatureForCall(ctx, expr.Fun); sourceSignature != nil && sourceSignature.Params() != nil && sourceSignature.Params().Len() > idx {
				if constraint := typeParamInterfaceConstraint(sourceSignature.Params().At(idx).Type()); constraint != nil {
					targetType = constraint
				}
			}
		}
		lowered, argDiagnostics := o.lowerCallArgExpr(ctx, arg, targetType, allowAsyncOverrideCallback)
		diagnostics = append(diagnostics, argDiagnostics...)
		if targetType != nil {
			lowered = o.lowerCallArgForTarget(ctx, arg, targetType, lowered, true)
		}
		args = append(args, lowered)
	}
	return args, diagnostics
}

func isProtobufTextWriteStringerCall(ctx lowerFileContext, fun ast.Expr) bool {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	fn := calledFunction(ctx.semPkg.source, fun)
	return fn != nil &&
		fn.Pkg() != nil &&
		fn.Pkg().Path() == "github.com/aperturerobotics/protobuf-go-lite" &&
		fn.Name() == "TextWriteStringer"
}

// lowerFixedCallArgs lowers each argument against its parameter, if any. A
// function value passed to an override callback parameter that the override
// calls without awaiting is adapted to return synchronously.
func (o *LoweringOwner) lowerFixedCallArgs(
	ctx lowerFileContext,
	call *ast.CallExpr,
	signature *types.Signature,
	overrideCall bool,
	allowAsyncOverrideCallback bool,
) ([]string, []Diagnostic) {
	// A call without a known signature lowers its arguments untyped.
	var params *types.Tuple
	if signature != nil {
		params = signature.Params()
	}

	// A struct parameter that the called function only reads takes the
	// caller's value without a copy (see funcParamsReadOnly), and a
	// transient pointer parameter a new reference to a field (see
	// markTransientPointers).
	var paramsReadOnly []valueReadOnlyKind
	var paramsTransient []bool
	calleeAsync := false
	if fn := calledFunction(ctx.semPkg.source, ast.Unparen(call.Fun)); fn != nil && !overrideCall {
		if semFn := semanticFunctionFor(ctx.model, fn); semFn != nil {
			paramsReadOnly = semFn.paramsReadOnly
			calleeAsync = o.functionAsync(ctx, fn)
			if !isMethodExprCall(ctx.semPkg.source, call) {
				paramsTransient = semFn.paramsTransient
			}
		}
	}

	// Lower each argument against its parameter.
	args := make([]string, 0, len(call.Args))
	var diagnostics []Diagnostic
	for idx, expr := range call.Args {
		// An argument without a parameter lowers untyped.
		if idx >= params.Len() {
			lowered, exprDiagnostics := o.lowerCallArgExpr(ctx, expr, nil, allowAsyncOverrideCallback)
			diagnostics = append(diagnostics, exprDiagnostics...)
			args = append(args, lowered)
			continue
		}

		// Other arguments lower against their parameters, and a read-only
		// struct parameter shares the value.
		param := params.At(idx)
		allowAsyncCallback := allowAsyncOverrideCallback || o.overrideAwaitsCallback(ctx, call.Fun, param.Name())
		lowered, exprDiagnostics := o.lowerFixedCallArg(ctx, expr, param.Type(), allowAsyncCallback, idx < len(paramsTransient) && paramsTransient[idx])
		diagnostics = append(diagnostics, exprDiagnostics...)
		if idx < len(paramsReadOnly) && !ctx.copyValues &&
			types.Identical(ctx.semPkg.source.TypesInfo.TypeOf(expr), param.Type()) &&
			valueReadOnlyArg(ctx, paramsReadOnly[idx], calleeAsync, expr) {
			args = append(args, lowered)
			continue
		}
		lowered = o.lowerCallArgForTarget(ctx, expr, param.Type(), lowered, overrideCall)
		if !allowAsyncCallback {
			lowered = o.lowerSyncCallbackArg(ctx, expr, param.Type(), lowered)
		}
		args = append(args, lowered)
	}
	return args, diagnostics
}

// lowerFixedCallArg lowers the argument expr of a parameter of type
// targetType. The address of a field passed to a transient parameter is a
// new reference to the field.
func (o *LoweringOwner) lowerFixedCallArg(ctx lowerFileContext, expr ast.Expr, targetType types.Type, overrideCall bool, transient bool) (string, []Diagnostic) {
	if transient {
		if selector, selection := fieldAddressOperand(ctx, expr); selector != nil {
			return o.lowerTransientFieldAddress(ctx, selector, selection)
		}
	}
	return o.lowerCallArgExpr(ctx, expr, targetType, overrideCall)
}

// fieldAddressOperand returns the field selection x.f of expr when it is
// the address &x.f of a field, which a transient parameter may take as a new
// reference.
func fieldAddressOperand(ctx lowerFileContext, expr ast.Expr) (*ast.SelectorExpr, *types.Selection) {
	// Only the address of a selected field.
	unary, ok := ast.Unparen(expr).(*ast.UnaryExpr)
	if !ok || unary.Op != token.AND {
		return nil, nil
	}
	return fieldSelectionOperand(ctx, unary.X)
}

// fieldSelectionOperand returns expr as a field selection x.f, if it is one.
func fieldSelectionOperand(ctx lowerFileContext, expr ast.Expr) (*ast.SelectorExpr, *types.Selection) {
	// Only a selector that selects a field.
	selector, ok := ast.Unparen(expr).(*ast.SelectorExpr)
	if !ok {
		return nil, nil
	}
	selection := ctx.semPkg.source.TypesInfo.Selections[selector]
	if selection == nil || selection.Kind() != types.FieldVal {
		return nil, nil
	}
	return selector, selection
}

// lowerTransientFieldAddress lowers the address of the field of selector,
// passed to a transient pointer parameter, as a new reference to the field.
func (o *LoweringOwner) lowerTransientFieldAddress(ctx lowerFileContext, selector *ast.SelectorExpr, selection *types.Selection) (string, []Diagnostic) {
	// A struct field is its own struct object, which needs no reference.
	if isStructValueType(ctx.semPkg.source.TypesInfo.TypeOf(selector)) {
		return o.lowerFieldSelectionExpr(ctx, selector, selection, false)
	}

	// Any other field takes a new reference.
	ctx.transientAddress = true
	return o.lowerFieldSelectionExpr(ctx, selector, selection, true)
}

func (o *LoweringOwner) lowerCallArgExpr(
	ctx lowerFileContext,
	expr ast.Expr,
	targetType types.Type,
	overrideCall bool,
) (string, []Diagnostic) {
	if lit, ok := ast.Unparen(expr).(*ast.FuncLit); ok && targetType != nil {
		value, _, diagnostics := o.lowerFuncLitForTarget(ctx, lit, targetType, overrideCall)
		return value, diagnostics
	}
	return o.lowerExpr(ctx, expr)
}

func (o *LoweringOwner) lowerCallArgForTarget(
	ctx lowerFileContext,
	expr ast.Expr,
	targetType types.Type,
	value string,
	overrideCall bool,
) string {
	if overrideCall {
		if constraint := typeParamInterfaceConstraint(targetType); constraint != nil {
			targetType = constraint
		}
	}
	value = o.lowerValueForTarget(ctx, expr, targetType, value)
	if !overrideCall || !isNonEmptyInterfaceType(targetType) {
		return value
	}

	// Override parameters typed as a non-empty interface exclude null. A nilable
	// source collapses a typed nil first; a converted concrete value is never nil
	// but its interface wrapper is typed nullable, so it only needs the assertion.
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if isInterfaceType(sourceType) || isNilableType(sourceType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValueOrNil) + "(" + value + ")!"
	}
	return parenthesizeAwaitedExpr(value) + "!"
}

// lowerSyncCallbackArg adapts a function value passed to a synchronous
// callback parameter of an override. A function variable, field, or result
// has an async-compatible type, because it may hold an async function, but
// the override calls it without awaiting, so each call must return its result
// synchronously. Function literals and declared functions already have the
// exact type, and a callback without results has nothing to await.
func (o *LoweringOwner) lowerSyncCallbackArg(
	ctx lowerFileContext,
	expr ast.Expr,
	targetType types.Type,
	value string,
) string {
	// Only a callback with results can hand a pending promise to its caller.
	signature := signatureForType(targetType)
	if signature == nil || signature.Results().Len() == 0 {
		return value
	}

	// Nil, literals, and declared functions already have the exact type.
	pkg := ctx.semPkg.source
	if tv, ok := pkg.TypesInfo.Types[expr]; ok && tv.IsNil() {
		return value
	}
	switch e := ast.Unparen(expr).(type) {
	case *ast.FuncLit:
		return value
	case *ast.Ident:
		if _, ok := pkg.TypesInfo.Uses[e].(*types.Func); ok {
			return value
		}
	case *ast.SelectorExpr:
		if _, ok := pkg.TypesInfo.Uses[e.Sel].(*types.Func); ok {
			return value
		}
	}

	return o.runtimeOwner.QualifiedHelper(RuntimeHelperSyncFunction) + "(" + value + ")"
}

func typeParamInterfaceConstraint(typ types.Type) types.Type {
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if !ok {
		return nil
	}
	iface, ok := types.Unalias(typeParam.Constraint()).Underlying().(*types.Interface)
	if !ok {
		return nil
	}
	iface.Complete()
	if iface.NumMethods() == 0 {
		return nil
	}
	return iface
}

func callTargetSignature(ctx lowerFileContext, expr ast.Expr) *types.Signature {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	typ := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if typ == nil {
		return nil
	}
	if signature, ok := typ.(*types.Signature); ok {
		return signature
	}
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	return signature
}

func callTargetNeedsNonNull(ctx lowerFileContext, expr ast.Expr) bool {
	if callTargetSignature(ctx, expr) == nil {
		return false
	}
	switch typed := expr.(type) {
	case *ast.FuncLit:
		return false
	case *ast.Ident:
		switch obj := objectForIdent(ctx, typed).(type) {
		case *types.Func, *types.Builtin:
			return false
		case *types.Var:
			return fixedFuncLocal(ctx, obj) == nil
		default:
			return true
		}
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil && selection.Kind() == types.MethodVal {
			return false
		}
		if _, ok := objectForIdent(ctx, typed.Sel).(*types.Func); ok {
			return false
		}
		return true
	default:
		return true
	}
}

func isBuiltinCallTarget(ctx lowerFileContext, expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return false
	}
	_, ok = objectForIdent(ctx, ident).(*types.Builtin)
	return ok
}

// funcBodyUsesRecover reports whether body lexically contains a call to the
// builtin recover. The scan descends into nested function literals because a
// recover() inside a deferred func literal recovers the enclosing function's
// panic, so that enclosing function is the one that needs the recover-aware
// emission.
func funcBodyUsesRecover(ctx lowerFileContext, body ast.Node) bool {
	found := false
	ast.Inspect(body, func(node ast.Node) bool {
		if found {
			return false
		}
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		ident, ok := call.Fun.(*ast.Ident)
		if !ok || ident.Name != "recover" {
			return true
		}
		if _, ok := objectForIdent(ctx, ident).(*types.Builtin); ok {
			found = true
			return false
		}
		return true
	})
	return found
}

func deferCallMayRecover(ctx lowerFileContext, call *ast.CallExpr) bool {
	if call == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	if lit, ok := call.Fun.(*ast.FuncLit); ok {
		return funcBodyUsesRecover(ctx, lit.Body)
	}
	fn := calledFunction(ctx.semPkg.source, call.Fun)
	if fn == nil {
		return false
	}
	target := functionOriginOrSelf(fn)
	for _, file := range ctx.semPkg.source.Syntax {
		for _, decl := range file.Decls {
			funcDecl, ok := decl.(*ast.FuncDecl)
			if !ok || funcDecl.Body == nil {
				continue
			}
			declFn, _ := ctx.semPkg.source.TypesInfo.Defs[funcDecl.Name].(*types.Func)
			if functionOriginOrSelf(declFn) != target {
				continue
			}
			return funcBodyUsesRecover(ctx, funcDecl.Body)
		}
	}
	return false
}

func (o *LoweringOwner) callUsesOverridePackage(ctx lowerFileContext, expr ast.Expr) bool {
	if o.overrideOwner == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	fn := calledFunction(ctx.semPkg.source, expr)
	if fn == nil || fn.Pkg() == nil {
		return false
	}
	if ctx.model != nil && ctx.model.functions[fn] != nil {
		return false
	}
	return o.overrideFacts().HasPackage(fn.Pkg().Path())
}

// callUsesSlicesOverride reports whether expr resolves to the handwritten
// slices package, whose TypeScript generic functions do not accept descriptors.
func (o *LoweringOwner) callUsesSlicesOverride(ctx lowerFileContext, expr ast.Expr) bool {
	if !o.callUsesOverridePackage(ctx, expr) {
		return false
	}
	fn := calledFunction(ctx.semPkg.source, expr)
	return fn != nil && fn.Pkg() != nil && fn.Pkg().Path() == "slices"
}

// slicesZeroFactoryFunctions are the functions of the slices override that
// take the zero value factory of the element type as their last argument:
// Grow for the elements it exposes, and the others for the elements they
// free at the end of the slice, which Go zeroes.
var slicesZeroFactoryFunctions = map[string]bool{
	"Compact":     true,
	"CompactFunc": true,
	"Delete":      true,
	"DeleteFunc":  true,
	"Grow":        true,
}

// appendSlicesGrowZeroFactory appends the zero value factory that slices.Grow
// needs to fill the capacity it adds, and that Delete, Compact and their Func
// variants need to zero the elements they free: Go zeroes them, and a slice
// resliced into them must read zeros, not nil or the absent value of an
// untyped array.
func (o *LoweringOwner) appendSlicesGrowZeroFactory(
	ctx lowerFileContext,
	callee ast.Expr,
	expr *ast.CallExpr,
	args []string,
) []string {
	selector, ok := callee.(*ast.SelectorExpr)
	if !ok || !slicesZeroFactoryFunctions[selector.Sel.Name] || !o.callUsesSlicesOverride(ctx, selector) {
		return args
	}
	typ := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if typ == nil {
		return args
	}
	slice, ok := types.Unalias(typ).Underlying().(*types.Slice)
	if !ok {
		return args
	}
	zeroFactory := "() => (" + o.lowerDeclarationZeroValueExpr(ctx, slice.Elem()) +
		" as " + o.tsSliceElemTypeFor(ctx, slice.Elem()) + ")"
	return append(args, zeroFactory)
}

func unsafePackageFunction(ctx lowerFileContext, expr ast.Expr, name string) bool {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	selector, ok := expr.(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != name {
		return false
	}
	ident, ok := selector.X.(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	return pkgName != nil && pkgName.Imported() != nil && pkgName.Imported().Path() == "unsafe"
}

func (o *LoweringOwner) lowerMakeExpr(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic) {
	if len(expr.Args) < 1 {
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr, "call", ctx.semPkg.pkgPath, "make requires a type argument")}
	}
	targetType := typeFromExpr(ctx, expr.Args[0])
	if targetType == nil {
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr.Args[0], "call", ctx.semPkg.pkgPath, "make requires a type expression")}
	}
	switch typed := types.Unalias(targetType).Underlying().(type) {
	case *types.Slice:
		length := "0"
		capacity := ""
		var diagnostics []Diagnostic
		if len(expr.Args) >= 2 {
			var lengthDiagnostics []Diagnostic
			length, lengthDiagnostics = o.lowerExpr(ctx, expr.Args[1])
			length = o.lowerNumberIndexValue(ctx, expr.Args[1], length)
			diagnostics = append(diagnostics, lengthDiagnostics...)
		}
		if len(expr.Args) >= 3 {
			var capacityDiagnostics []Diagnostic
			capacity, capacityDiagnostics = o.lowerExpr(ctx, expr.Args[2])
			capacity = o.lowerNumberIndexValue(ctx, expr.Args[2], capacity)
			diagnostics = append(diagnostics, capacityDiagnostics...)
		}
		args := []string{length}
		if capacity != "" {
			args = append(args, capacity)
		}
		if hint := sliceTypeHint(typed.Elem()); hint != "" {
			if capacity == "" {
				args = append(args, "undefined")
			}
			args = append(args, strconv.Quote(hint))
		}
		if typeParam, ok := types.Unalias(typed.Elem()).(*types.TypeParam); ok && typeParamInScope(ctx, typeParam) {
			if capacity == "" {
				args = append(args, "undefined")
			}
			// The type argument picks the typed array of fixed-size numbers.
			if len(args) < 3 {
				args = append(args, o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericSliceTypeHint)+
					"(__typeArgs, "+strconv.Quote(typeParam.Obj().Name())+")")
			}
			args = append(args, "() => ("+o.lowerDeclarationZeroValueExpr(ctx, typed.Elem())+" as "+o.tsSliceElemTypeFor(ctx, typed.Elem())+")")
		}
		// Struct and array elements get their zero values from a factory,
		// as each element is a value of its own.
		if makeSliceElemNeedsZeroFactory(typed.Elem()) {
			if capacity == "" {
				args = append(args, "undefined")
			}
			if len(args) < 3 {
				args = append(args, "undefined")
			}
			args = append(args, "() => "+o.lowerZeroValueExprFor(ctx, typed.Elem()))
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMakeSlice) +
			"<" + o.tsSliceElemTypeFor(ctx, typed.Elem()) + ">(" + strings.Join(args, ", ") + ")", diagnostics
	case *types.Map:
		return o.lowerMapConstructor(ctx, typed, ""), nil
	case *types.Chan:
		capacity := "0"
		var diagnostics []Diagnostic
		if len(expr.Args) >= 2 {
			var capacityDiagnostics []Diagnostic
			capacity, capacityDiagnostics = o.lowerExpr(ctx, expr.Args[1])
			capacity = o.lowerNumberIndexValue(ctx, expr.Args[1], capacity)
			diagnostics = append(diagnostics, capacityDiagnostics...)
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMakeChannel) +
			"<" + o.tsTypeFor(ctx, typed.Elem()) + ">(" + capacity + ", " +
			o.lowerDeclarationZeroValueExpr(ctx, typed.Elem()) + ", " + strconv.Quote(channelDirectionString(typed.Dir())) + ")", diagnostics
	default:
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr.Args[0], "call", ctx.semPkg.pkgPath, "unsupported make type")}
	}
}

// lowerNewExpr lowers new(T) to a pointer to the zero value of T, and new(x)
// to a pointer to the value of x.
func (o *LoweringOwner) lowerNewExpr(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic) {
	// new takes a single type or value.
	if len(expr.Args) != 1 {
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr, "call", ctx.semPkg.pkgPath, "new requires one argument")}
	}

	// A value argument is allocated as a VarRef holding that value.
	argument := expr.Args[0]
	typ := typeFromExpr(ctx, argument)
	if typ == nil {
		if ctx.semPkg == nil || ctx.semPkg.source == nil || ctx.semPkg.source.TypesInfo == nil {
			return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, argument, "call", "new", "missing type information for new expression argument")}
		}
		typ = types.Default(ctx.semPkg.source.TypesInfo.TypeOf(argument))
		if typ == nil || isUntypedNilType(typ) {
			return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, argument, "call", ctx.semPkg.pkgPath, "missing type information for new expression argument")}
		}
		value, diagnostics := o.lowerExpr(ctx, argument)
		value = o.lowerValueForTarget(ctx, argument, typ, value)
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) +
			"<" + o.tsTypeFor(ctx, typ) + ">(" + value + ")", diagnostics
	}

	// A pointer to a struct is the struct instance itself, so new of a
	// struct allocates its zero instance, and new of a type parameter lets
	// the runtime type argument decide whether to allocate a VarRef.
	if named := namedStructType(typ); named != nil {
		return o.lowerNamedStructZeroValueExpr(ctx, named), nil
	}
	if typeParam, ok := types.Unalias(typ).(*types.TypeParam); ok && typeParamInScope(ctx, typeParam) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericNew) +
			"(__typeArgs, " + strconv.Quote(typeParam.Obj().Name()) + ", " + zeroValueExpr(typ) + ")", nil
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) +
		"<" + o.tsTypeFor(ctx, typ) + ">(" + o.lowerDeclarationZeroValueExpr(ctx, typ) + ")", nil
}

func (o *LoweringOwner) lowerConversionExpr(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	targetType types.Type,
) (string, []Diagnostic) {
	// A conversion lowers its single operand.
	if len(expr.Args) != 1 {
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, expr, "call", ctx.semPkg.pkgPath, "unsupported conversion arity")}
	}
	value, diagnostics := o.lowerExpr(ctx, expr.Args[0])
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Args[0])

	// Arithmetic on an integer type narrower than 64 bits is computed on
	// JavaScript numbers without wrapping, so the result wraps to its own
	// width before it is converted, as uint16(a+b) does in Go.
	if isNumericType(targetType) && isNarrowIntegerArithmetic(ctx, expr.Args[0]) {
		if bits, ok := unsignedIntegerBits(sourceType); ok && bits < 64 {
			value = o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) + "(" + value + ", " + strconv.Itoa(bits) + ")"
		} else if bits, ok := signedIntegerBits(sourceType); ok && bits < 64 {
			value = o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" + value + ", " + strconv.Itoa(bits) + ")"
		}
	}

	// A conversion that keeps the JavaScript value returns its operand
	// unchanged, so a binary operand must stay grouped where the conversion
	// is itself an operand, as in float64(n) / float64(a*b).
	grouped := value
	if _, ok := ast.Unparen(expr.Args[0]).(*ast.BinaryExpr); ok {
		grouped = "(" + value + ")"
	}

	// Unsafe pointer conversions keep pointer identity or resolve addresses.
	if isNumericType(targetType) && isUnsafePointerType(sourceType) {
		if value, addressDiagnostics, ok := o.lowerUnsafePointerIntegerExpr(ctx, expr.Args[0]); ok {
			return value, append(diagnostics, addressDiagnostics...)
		}
		if isUintptrType(targetType) {
			// Opaque unsafe pointers have no JS integer address; keep identity-only
			// uintptr round trips, such as the standard noescape xor-zero pattern, as pointer tokens.
			return "(" + value + " as any)", diagnostics
		}
	}
	if helper, addressDiagnostics, ok := o.lowerReflectHeaderPointerConversion(ctx, targetType, expr.Args[0]); ok {
		return helper, append(diagnostics, addressDiagnostics...)
	}
	if helper, addressDiagnostics, ok := o.lowerUnsafeArrayPointerConversion(ctx, targetType, expr.Args[0]); ok {
		return helper, append(diagnostics, addressDiagnostics...)
	}
	if isUnsafePointerType(targetType) {
		if value, identityDiagnostics, ok := o.lowerUnsafePointerIdentityExpr(ctx, expr.Args[0]); ok {
			return "(" + value + " as any)", append(diagnostics, identityDiagnostics...)
		}
		return "(" + value + " as any)", diagnostics
	}
	if isNilExpr(expr.Args[0]) && isPointerType(targetType) {
		return "null", diagnostics
	}

	// Type parameter and interface targets convert by their runtime type.
	if typeParam, ok := types.Unalias(targetType).(*types.TypeParam); ok &&
		typeParamInScope(ctx, typeParam) && !types.Identical(targetType, sourceType) &&
		basicTypeSet(typeParam.Constraint()) {
		// The type argument determines the representation of a numeric value,
		// such as a bigint for int64, so the conversion happens at runtime.
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericConvert) +
			"<" + o.tsSliceElemTypeFor(ctx, targetType) + ">(__typeArgs, " +
			strconv.Quote(typeParam.Obj().Name()) + ", " + value + ")", diagnostics
	}
	if isInterfaceType(targetType) {
		return o.lowerValueForTarget(ctx, expr.Args[0], targetType, value), diagnostics
	}

	// String, rune slice and byte slice conversions copy through runtime helpers.
	if isStringType(targetType) {
		switch {
		case isRuneSliceType(sourceType):
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperRunesToString) + "(" + value + ")", diagnostics
		case isByteSliceType(sourceType):
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperBytesToString) + "(" + value + ")", diagnostics
		case overrideNamedStringType(ctx, o, sourceType):
			return "globalThis.String(" + value + ")", diagnostics
		case isStringType(sourceType):
			return grouped, diagnostics
		case isNumericType(sourceType):
			// An invalid rune converts to U+FFFD, where String.fromCodePoint throws
			// or keeps a surrogate.
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperRuneToString) + "(" + value + ")", diagnostics
		default:
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericBytesOrStringToString) + "(" + value + ")", diagnostics
		}
	}
	if isRuneSliceType(targetType) && isStringType(sourceType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToRunes) + "(" + value + ")", diagnostics
	}
	if isByteSliceType(targetType) && isStringType(sourceType) {
		if literal, ok := lowerConstantStringByteSlice(ctx, expr.Args[0]); ok {
			return literal, diagnostics
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + value + ")", diagnostics
	}

	// Slice to array and array pointer conversions copy or alias the elements.
	if array := pointerToArrayType(targetType); array != nil {
		if slice, ok := types.Unalias(sourceType).Underlying().(*types.Slice); ok && types.Identical(array.Elem(), slice.Elem()) {
			result := o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceToArrayPointer) +
				"<" + o.tsTypeFor(ctx, array.Elem()) + ">(" +
				value + ", " + strconv.FormatInt(array.Len(), 10)
			if isByteType(array.Elem()) {
				result += `, "byte"`
			}
			result += ")"
			if isByteType(array.Elem()) {
				result = "(" + result + " as " + o.tsTypeFor(ctx, targetType) + ")"
			}
			return result, diagnostics
		}
	}
	if array, ok := types.Unalias(targetType).Underlying().(*types.Array); ok {
		if slice, ok := types.Unalias(sourceType).Underlying().(*types.Slice); ok && types.Identical(array.Elem(), slice.Elem()) {
			result := o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceToArray) +
				"<" + o.tsTypeFor(ctx, array.Elem()) + ">(" +
				value + ", " + strconv.FormatInt(array.Len(), 10)
			if isByteType(array.Elem()) {
				result += `, "byte"`
			}
			result += ")"
			if isByteType(array.Elem()) {
				result = "(" + result + " as " + o.tsTypeFor(ctx, targetType) + ")"
			}
			return result, diagnostics
		}
	}

	// Struct conversions between identical layouts keep or copy the value.
	if target := pointerToNamedStructType(targetType); target != nil {
		source := pointerToNamedStructType(sourceType)
		if source != nil && !types.Identical(target, source) &&
			types.IdenticalIgnoreTags(target.Underlying(), source.Underlying()) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsafePointerCast) +
				"<" + o.tsTypeFor(ctx, targetType) + ">(" + value + ", " +
				o.namedTypeExpr(ctx, target) + ")", diagnostics
		}
	}
	if conversion, ok := o.lowerNamedStructConversion(ctx, expr.Args[0], targetType, sourceType, value); ok {
		return renderNamedStructConversion(conversion), diagnostics
	}

	// Complex targets and numeric literals keep their constant form.
	if isComplex64Type(targetType) {
		if isComplexType(sourceType) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex64) + "(" + value + ")", diagnostics
		}
		if isIntegerType(sourceType) || isFloatType(sourceType) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex64) + "(" + value + ", 0)", diagnostics
		}
	}
	if isComplexType(targetType) && (isIntegerType(sourceType) || isFloatType(sourceType)) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex) + "(" + value + ", 0)", diagnostics
	}
	if isNumericType(targetType) {
		if constantValue, ok := o.lowerNumericConstantExprForTarget(ctx, expr.Args[0], targetType); ok {
			return constantValue, diagnostics
		}
		// A small integer literal converted to a named number-represented type
		// (e.g. MyInt(5)) is just its already-lowered literal: the value fits a
		// JS number, so a $.int/$.uint width helper would add noise. Builtin int
		// conversions still widen below so their literal type does not narrow,
		// and named-const references keep flowing through as their symbol.
		if o.numericConversionKeepsLiteral(ctx, expr.Args[0], targetType) {
			return grouped, diagnostics
		}
	}

	// Named function and non-numeric named types wrap or keep the value.
	if named := namedFunctionType(targetType); named != nil {
		typeName := runtimeNamedTypeName(named)
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedFunction) +
			"(" + value + ", " + strconv.Quote(typeName) + ", " +
			o.runtimeFunctionTypeInfo(named.Underlying().(*types.Signature), typeName) + ")", diagnostics
	}
	if named := namedNonStructType(targetType); named != nil && !isNumericType(named) {
		if _, ok := named.Underlying().(*types.Slice); ok {
			return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")", diagnostics
		}
		return grouped, diagnostics
	}

	// An integer converted to an integer type that holds all its values,
	// such as int(r) of a rune, keeps its value.
	if integerConversionKeepsValue(sourceType, targetType) {
		return grouped, diagnostics
	}

	// A 64-bit integer converted to a narrower integer, as uint32(f.Int64()),
	// keeps the low bits of its bigint.
	if isBigIntBackedType(sourceType) {
		if bits, ok := unsignedIntegerBits(targetType); ok && bits < 64 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperUintFromWide) +
				"(" + value + ", " + strconv.Itoa(bits) + ")", diagnostics
		}
		if bits, ok := signedIntegerBits(targetType); ok && bits < 64 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperIntFromWide) +
				"(" + value + ", " + strconv.Itoa(bits) + ")", diagnostics
		}
	}

	// Numeric conversions round to the target representation.
	if isNumericType(targetType) {
		if isFloatType(targetType) {
			converted := grouped
			if isBigIntBackedType(sourceType) {
				converted = wideToNumber(o.runtimeOwner, sourceType, value)
			}
			// A float32 value is already rounded.
			if isFloat32Type(targetType) && !isFloat32Type(sourceType) {
				converted = "globalThis.Math.fround(" + converted + ")"
			}
			return converted, diagnostics
		}
		if isBigIntBackedType(targetType) {
			// A bigint of the same signedness, as int64(f) of a named int64
			// type, already has the value.
			_, targetUnsigned := unsignedIntegerBits(targetType)
			_, sourceUnsigned := unsignedIntegerBits(sourceType)
			if isBigIntBackedType(sourceType) && targetUnsigned == sourceUnsigned {
				return grouped, diagnostics
			}

			// Other values are converted to the 64 bits of the target.
			helper := RuntimeHelperInt64
			if targetUnsigned {
				helper = RuntimeHelperUint64
			}
			return o.runtimeOwner.QualifiedHelper(helper) + "(" + value + ")", diagnostics
		}
		if bits, ok := unsignedIntegerBits(targetType); ok {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) +
				"(" + value + ", " + strconv.Itoa(bits) + ")", diagnostics
		}
		if bits, ok := signedIntegerBits(targetType); ok && bits < 64 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) +
				"(" + value + ", " + strconv.Itoa(bits) + ")", diagnostics
		}

		// An int of a 64-bit integer is the number of its signed 64 bits, as
		// int(x) of a uint64 is negative from 1<<63.
		if isBigIntBackedType(sourceType) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt64ToNumber) + "(" + value + ")", diagnostics
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" + value + ")", diagnostics
	}

	// The unsafe functions that return pointers, such as unsafe.Add, return
	// unknown values, which keep their values as pointers of the target type.
	call, isCall := ast.Unparen(expr.Args[0]).(*ast.CallExpr)
	if isCall && !ctx.semPkg.source.TypesInfo.Types[call.Fun].IsType() &&
		isUnsafePointerType(sourceType) && isPointerType(targetType) {
		return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")", diagnostics
	}
	return grouped, diagnostics
}

// coerceWideHelperResult coerces a bigint result from the int64*/uint64* runtime
// family back to resultType's representation. int64/uint64 results stay bigint.
// Unsigned number-typed wide results (uint, uintptr) flow through $.uint(_, 64),
// which keeps values above 2^53 as a runtime bigint so full 64-bit width
// survives; a precision-losing Number() wrap would truncate values like
// ^uint(0). Signed platform int converts to the nearest number through the
// words of its 64 bits (accepted precision loss above 2^53, matching Model A's
// int->number mapping): $.uint on a signed value would reinterpret its sign bit
// as magnitude.
func coerceWideHelperResult(runtimeOwner *RuntimeContractOwner, resultType types.Type, call string) string {
	if isBigIntBackedType(resultType) {
		return call
	}
	if _, ok := unsignedIntegerBits(resultType); ok {
		return runtimeOwner.QualifiedHelper(RuntimeHelperUint) + "(" + call + ", 64)"
	}
	return runtimeOwner.QualifiedHelper(RuntimeHelperInt64ToNumber) + "(" + call + ")"
}

// wideToNumber converts a value of the bigint-backed type typ to the nearest
// number, through the words of its 64 bits, which V8 compiles to machine
// operations where it does not compile Number of a bigint.
func wideToNumber(runtimeOwner *RuntimeContractOwner, typ types.Type, value string) string {
	// The words are read as signed or unsigned as the type is.
	helper := RuntimeHelperInt64ToNumber
	if _, unsigned := unsignedIntegerBits(typ); unsigned {
		helper = RuntimeHelperUint64ToNumber
	}
	return runtimeOwner.QualifiedHelper(helper) + "(" + value + ")"
}

func (o *LoweringOwner) lowerWideIntegerBinaryExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	// Only operations with a wide result or left operand use the helpers.
	resultType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	resultWide := isRuntimeWideIntegerType(resultType)
	leftWide := isRuntimeWideIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(expr.X))
	if !resultWide && !leftWide {
		return "", false
	}

	// The signedness picks the helper family, and constant operands are
	// bigint literals, or numbers for uint and uintptr when they fit.
	signed := isFixedSignedWideIntegerType(resultType) ||
		isFixedSignedWideIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(expr.X))
	numberConstants := isWideUintType(resultType)
	left = lowerWideIntegerOperand(ctx, expr.X, left, numberConstants)
	right = lowerWideIntegerOperand(ctx, expr.Y, right, numberConstants)

	// Wide helpers coerce both operands before using JS bigint operators. Even
	// int64/uint64 results route through them because overrides and generated
	// fields can present number-typed operands for Go wide-integer expressions.
	wrap := func(call string) string {
		return coerceWideHelperResult(o.runtimeOwner, resultType, call)
	}
	helperCall := func(helper RuntimeHelper) string {
		return wideIntegerHelperCall(o.runtimeOwner, resultType, helper, left, right)
	}

	// Each operator has its helper, with simpler forms for some operands.
	switch expr.Op {
	case token.SHL, token.SHR:
		return o.lowerWideShiftExpr(ctx, expr, signed, left, right, wrap), true
	case token.MUL:
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64Mul, RuntimeHelperInt64Mul)), true
	case token.QUO:
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64Div, RuntimeHelperInt64Div)), true
	case token.REM:
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64Mod, RuntimeHelperInt64Mod)), true
	case token.ADD:
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64Add, RuntimeHelperInt64Add)), true
	case token.SUB:
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64Sub, RuntimeHelperInt64Sub)), true
	case token.AND:
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64And, RuntimeHelperInt64And)), true
	case token.AND_NOT:
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64AndNot, RuntimeHelperInt64AndNot)), true
	case token.XOR:
		if isZeroIntegerExpr(ctx, expr.Y) {
			return left, true
		}
		if isZeroIntegerExpr(ctx, expr.X) {
			return right, true
		}
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64Xor, RuntimeHelperInt64Xor)), true
	case token.OR:
		shift, ok := wideLeftShiftExpr(ctx, expr.X)
		if ok && !signed {
			if bits, ok := lowIntegerBits(ctx, expr.Y); ok && bits <= shift {
				return helperCall(RuntimeHelperUint64Add), true
			}
		}
		return helperCall(wideIntegerHelper(signed, RuntimeHelperUint64Or, RuntimeHelperInt64Or)), true
	default:
		return "", false
	}
}

// lowerWideShiftExpr lowers a shift of a wide integer, whose result wrap
// converts to the representation of the result type.
func (o *LoweringOwner) lowerWideShiftExpr(ctx lowerFileContext, expr *ast.BinaryExpr, signed bool, left string, right string, wrap func(string) string) string {
	// The helper is picked by the operator and the signedness.
	helper := RuntimeHelperUint64Shr
	if expr.Op == token.SHL {
		helper = RuntimeHelperUint64Shl
	}
	if signed {
		helper = RuntimeHelperInt64Shr
		if expr.Op == token.SHL {
			helper = RuntimeHelperInt64Shl
		}
	}

	// A constant count is a number, which the helpers take as a shared
	// bigint count or power of two from a table.
	amount, constantAmount := constantShiftAmount(ctx, expr.Y)
	if constantAmount {
		right = strconv.Itoa(amount)
	}

	// One shifted left by a variable count, as a bit flag mask 1<<f, is a
	// single bit, which the runtime takes from a table of bigints.
	if !constantAmount && expr.Op == token.SHL && isOneIntegerExpr(ctx, expr.X) {
		bit := wideIntegerHelper(signed, RuntimeHelperUint64Bit, RuntimeHelperInt64Bit)
		return wrap(o.runtimeOwner.QualifiedHelper(bit) + "(" + right + ")")
	}

	// An unsigned shift left by a constant of 32 or more multiplies.
	if constantAmount && amount >= 32 && expr.Op == token.SHL && !signed {
		base := o.lowerWideShiftLeftOperand(ctx, expr.X, left)
		return wrap(o.runtimeOwner.QualifiedHelper(RuntimeHelperUint64Mul) +
			"(" + base + ", " + shiftMultiplier(amount) + ")")
	}

	// Other shifts call the helper.
	return wideIntegerHelperCall(o.runtimeOwner, ctx.semPkg.source.TypesInfo.TypeOf(expr), helper, left, right)
}

// lowerWideIntegerOperand returns a constant operand of a wide integer
// operation as a bigint literal, or as a number literal when numbers is set
// and it fits in one, or fallback for other operands.
func lowerWideIntegerOperand(ctx lowerFileContext, expr ast.Expr, fallback string, numbers bool) string {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	if value == nil || value.Kind() != constant.Int {
		return fallback
	}
	if exact, ok := constant.Uint64Val(value); numbers && ok && exact <= maxSafeInteger {
		return value.ExactString()
	}
	return value.ExactString() + "n"
}

// maxSafeInteger is the largest integer that every smaller integer and it
// are exact numbers in JavaScript, 2^53 - 1.
const maxSafeInteger = 1<<53 - 1

// isWideUintType reports whether typ is uint or uintptr: 64 bits wide, and a
// number up to 2^53 - 1 and a bigint above at run time (see uint).
func isWideUintType(typ types.Type) bool {
	bits, ok := unsignedIntegerBits(typ)
	return ok && bits == 64 && !isBigIntBackedType(typ)
}

// wideUintHelpers are the helpers of the operations of uint and uintptr, by
// the uint64 helpers of the operations.
var wideUintHelpers = map[RuntimeHelper]RuntimeHelper{
	RuntimeHelperUint64Add:    RuntimeHelperWideUintAdd,
	RuntimeHelperUint64Sub:    RuntimeHelperWideUintSub,
	RuntimeHelperUint64Mul:    RuntimeHelperWideUintMul,
	RuntimeHelperUint64Div:    RuntimeHelperWideUintDiv,
	RuntimeHelperUint64Mod:    RuntimeHelperWideUintMod,
	RuntimeHelperUint64And:    RuntimeHelperWideUintAnd,
	RuntimeHelperUint64AndNot: RuntimeHelperWideUintAndNot,
	RuntimeHelperUint64Or:     RuntimeHelperWideUintOr,
	RuntimeHelperUint64Xor:    RuntimeHelperWideUintXor,
	RuntimeHelperUint64Shl:    RuntimeHelperWideUintShl,
	RuntimeHelperUint64Shr:    RuntimeHelperWideUintShr,
}

// wideIntegerHelperCall calls helper, an int64 or uint64 helper, with left
// and right, converting its result to resultType. A uint or uintptr result
// calls the wideUint helper of the operation instead, which computes numbers
// as numbers rather than converting them to bigints and back.
func wideIntegerHelperCall(runtimeOwner *RuntimeContractOwner, resultType types.Type, helper RuntimeHelper, left string, right string) string {
	if wide, ok := wideUintHelpers[helper]; ok && isWideUintType(resultType) {
		return runtimeOwner.QualifiedHelper(wide) + "(" + left + ", " + right + ")"
	}
	return coerceWideHelperResult(runtimeOwner, resultType, runtimeOwner.QualifiedHelper(helper)+"("+left+", "+right+")")
}

func wideIntegerHelper(signed bool, unsigned RuntimeHelper, signedHelper RuntimeHelper) RuntimeHelper {
	if signed {
		return signedHelper
	}
	return unsigned
}

func (o *LoweringOwner) lowerWideShiftLeftOperand(ctx lowerFileContext, expr ast.Expr, fallback string) string {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return fallback
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if bits, ok := unsignedIntegerBits(targetType); !ok || bits < 64 {
		return fallback
	}
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])
	if _, ok := signedIntegerBits(sourceType); !ok {
		return fallback
	}
	value, _ := o.lowerExpr(ctx, call.Args[0])
	return value
}

func constantShiftAmount(ctx lowerFileContext, expr ast.Expr) (int, bool) {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	if value == nil {
		return 0, false
	}
	amount, ok := constant.Int64Val(value)
	if !ok || amount < 0 || amount > int64(strconv.IntSize) {
		return 0, false
	}
	return int(amount), true
}

func wideLeftShiftExpr(ctx lowerFileContext, expr ast.Expr) (int, bool) {
	binary, ok := unwrapParenExpr(expr).(*ast.BinaryExpr)
	if !ok || binary.Op != token.SHL || !isWideIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(binary.X)) {
		return 0, false
	}
	amount, ok := constantShiftAmount(ctx, binary.Y)
	if !ok || amount < 32 {
		return 0, false
	}
	return amount, true
}

func lowIntegerBits(ctx lowerFileContext, expr ast.Expr) (int, bool) {
	if call, ok := unwrapParenExpr(expr).(*ast.CallExpr); ok && len(call.Args) == 1 {
		if bits, ok := integerBits(ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])); ok {
			return bits, true
		}
	}
	return integerBits(ctx.semPkg.source.TypesInfo.TypeOf(expr))
}

// isOneIntegerExpr reports whether expr is the integer constant 1.
func isOneIntegerExpr(ctx lowerFileContext, expr ast.Expr) bool {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	return value != nil && value.Kind() == constant.Int && constant.Compare(value, token.EQL, constant.MakeInt64(1))
}

func isZeroIntegerExpr(ctx lowerFileContext, expr ast.Expr) bool {
	value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr)].Value
	return value != nil && value.Kind() == constant.Int && constant.Sign(value) == 0
}

func shiftMultiplier(amount int) string {
	return "(2 ** " + strconv.Itoa(amount) + ")"
}

func (o *LoweringOwner) lowerNamedStructConversion(
	ctx lowerFileContext,
	sourceExpr ast.Expr,
	targetType types.Type,
	sourceType types.Type,
	value string,
) (*loweredNamedStructConversionExpr, bool) {
	// The target is a named struct and the source a different named or an
	// unnamed struct of the same underlying type.
	target := namedStructType(targetType)
	source := namedStructType(sourceType)
	unnamedSource, _ := types.Unalias(sourceType).(*types.Struct)
	if target == nil || (source == nil && unnamedSource == nil) ||
		(source != nil && types.Identical(target, source)) ||
		!types.IdenticalIgnoreTags(target.Underlying(), sourceType.Underlying()) {
		return nil, false
	}

	// An override struct is only cast.
	if o.typeUsesOverride(target) || o.typeUsesOverride(source) {
		return &loweredNamedStructConversionExpr{
			value: loweredExpr{
				text:  value,
				async: o.conversionValueNeedsAwait(ctx, sourceExpr),
			},
			castOnly:   true,
			castTarget: o.tsTypeFor(ctx, targetType),
		}, true
	}
	structType, _ := target.Underlying().(*types.Struct)
	temp := ctx.tempName("Convert")
	fields := make([]loweredConversionField, 0, structType.NumFields())
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		name := tsStructFieldName(field.Name(), idx)
		fields = append(fields, loweredConversionField{name: name, copy: o.lowerFieldValueCopy(field.Type(), temp+"."+name)})
	}
	return &loweredNamedStructConversionExpr{
		positional: o.hasGeneratedClone(target),
		value: loweredExpr{
			text:  value,
			async: o.conversionValueNeedsAwait(ctx, sourceExpr),
		},
		target: o.namedTypeExpr(ctx, target),
		temp:   temp,
		helper: o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue),
		fields: fields,
	}, true
}

func (o *LoweringOwner) conversionValueNeedsAwait(ctx lowerFileContext, expr ast.Expr) bool {
	switch typed := expr.(type) {
	case *ast.CallExpr:
		if o.callExprNeedsAwait(ctx, typed) || o.conversionValueNeedsAwait(ctx, typed.Fun) {
			return true
		}
		for _, arg := range typed.Args {
			if o.conversionValueNeedsAwait(ctx, arg) {
				return true
			}
		}
		return false
	case *ast.ParenExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X)
	case *ast.UnaryExpr:
		return typed.Op == token.ARROW || o.conversionValueNeedsAwait(ctx, typed.X)
	case *ast.BinaryExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X) || o.conversionValueNeedsAwait(ctx, typed.Y)
	case *ast.CompositeLit:
		for _, elt := range typed.Elts {
			if o.conversionValueNeedsAwait(ctx, elt) {
				return true
			}
		}
		return false
	case *ast.FuncLit:
		return ctx.model != nil && ctx.semPkg != nil && ctx.semPkg.source != nil &&
			exprMayNeedAwait(ctx.model, ctx.semPkg.source, typed)
	case *ast.IndexExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X) || o.conversionValueNeedsAwait(ctx, typed.Index)
	case *ast.IndexListExpr:
		if o.conversionValueNeedsAwait(ctx, typed.X) {
			return true
		}
		for _, index := range typed.Indices {
			if o.conversionValueNeedsAwait(ctx, index) {
				return true
			}
		}
		return false
	case *ast.KeyValueExpr:
		return o.conversionValueNeedsAwait(ctx, typed.Key) || o.conversionValueNeedsAwait(ctx, typed.Value)
	case *ast.SelectorExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X)
	case *ast.SliceExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X) ||
			o.conversionValueNeedsAwait(ctx, typed.Low) ||
			o.conversionValueNeedsAwait(ctx, typed.High) ||
			o.conversionValueNeedsAwait(ctx, typed.Max)
	case *ast.StarExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X)
	case *ast.TypeAssertExpr:
		return o.conversionValueNeedsAwait(ctx, typed.X)
	default:
		return false
	}
}

func (o *LoweringOwner) typeUsesOverride(named *types.Named) bool {
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil || o.overrideOwner == nil {
		return false
	}
	return o.overrideFacts().HasPackage(named.Obj().Pkg().Path())
}

func (o *LoweringOwner) lowerNamedReceiverMethodCall(
	ctx lowerFileContext,
	expr *ast.CallExpr,
	args []string,
	diagnostics []Diagnostic,
) (string, []Diagnostic) {
	// Resolve the named type that declares the method.
	selector := expr.Fun.(*ast.SelectorExpr)
	selection := ctx.semPkg.source.TypesInfo.Selections[selector]
	receiver := methodReceiverNamedType(selection.Obj())
	if receiver == nil {
		receiver = selectedReceiverNamedType(ctx.semPkg.source, selector, selection)
	}

	// Call the method function with the receiver as its first argument. A
	// transient pointer receiver takes a new reference to a field.
	var receiverExpr string
	var receiverDiagnostics []Diagnostic
	if field, fieldSelection := o.transientReceiverField(ctx, selector, selection); field != nil {
		receiverExpr, receiverDiagnostics = o.lowerTransientFieldAddress(ctx, field, fieldSelection)
	} else {
		receiverExpr, receiverDiagnostics = o.lowerNamedReceiverForMethod(ctx, selector.X, selection)
	}
	diagnostics = append(diagnostics, receiverDiagnostics...)
	allArgs := append([]string{receiverExpr}, args...)
	call := o.methodFunctionExpr(ctx, receiver, selection.Obj(), selector.Sel.Name) + "(" + strings.Join(allArgs, ", ") + ")"
	return o.awaitCallIfNeeded(ctx, expr, call), diagnostics
}

func (o *LoweringOwner) lowerPointerReceiverMethodCall(
	ctx lowerFileContext,
	selector *ast.SelectorExpr,
	selection *types.Selection,
	args []string,
) (string, []Diagnostic, bool) {
	// Only a method declared on a pointer to a named struct, called on such
	// a pointer, is called this way.
	if len(selection.Index()) != 1 || !isPointerToStructType(ctx.semPkg.source.TypesInfo.TypeOf(selector.X)) {
		return "", nil, false
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return "", nil, false
	}
	signature, _ := method.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return "", nil, false
	}

	// The receiver's named type.
	if !isPointerToStructType(signature.Recv().Type()) {
		return "", nil, false
	}
	receiver := receiverNamedType(signature.Recv().Type())
	if receiver == nil {
		return "", nil, false
	}

	// An override method takes its receiver unwrapped, since hand-written
	// methods do not unwrap a variable reference or a boxed pointer.
	receiverExpr, diagnostics := o.lowerExpr(ctx, selector.X)
	localReceiver := receiverExpr
	override := o.receiverUsesOverridePackage(signature.Recv().Type())
	if override {
		if nilReceiverOverrideMethods[method.FullName()] {
			receiverExpr = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValueOrNil) + "(" + receiverExpr + ")"
		} else {
			receiverExpr = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
				"<" + o.tsTypeFor(ctx, signature.Recv().Type().(*types.Pointer).Elem()) + ">(" + receiverExpr + ")"
		}
	}

	// A receiver that lowers to the type's own name is a value of it, whose
	// method is called on the value.
	if receiverExpr == o.namedTypeExpr(ctx, receiver) {
		call := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<" + o.namedTypeExpr(ctx, receiver) + ">(" + receiverExpr + ")." +
			methodMemberName(selector.Sel.Name) + "(" + strings.Join(args, ", ") + ")"
		return call, diagnostics, true
	}

	// An absent receiver package has no class to import. A field of an
	// override type holds the override's own class, not the Go type's, so the
	// Go type's prototype would run the wrong implementation.
	if receiver != nil && receiver.Obj() != nil && receiver.Obj().Pkg() != nil {
		pkgPath := receiver.Obj().Pkg().Path()
		absent := ctx.importPaths[pkgPath] == "" && !o.hasGeneratedImportPackage(ctx.model, pkgPath)
		// A nil-safe override method is called through its prototype, since
		// its receiver may be nil, which has no methods to call.
		if !absent && nilReceiverOverrideMethods[method.FullName()] {
			callArgs := append([]string{receiverExpr}, args...)
			call := namedValueExpr(ctx, receiver) + ".prototype." + selector.Sel.Name + ".call(" + strings.Join(callArgs, ", ") + ")"
			return call, diagnostics, true
		}
		if absent || o.isOverrideFieldValue(ctx, selector.X) {
			call := receiverExpr + "." + methodMemberName(selector.Sel.Name) + "(" + strings.Join(args, ", ") + ")"
			return call, diagnostics, true
		}
	}
	// A cross-package unexported receiver keeps a dynamic dispatch: never import
	// the foreign package's prototype for an unexported type, even though its
	// barrel re-exports the type name. The imported class identity must not leak
	// across the package boundary, so dispatch through the runtime value helper.
	if crossPackageUnexportedNamedType(ctx, receiver) {
		call := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<any>(" + receiverExpr + ")." + methodMemberName(selector.Sel.Name) +
			"(" + strings.Join(args, ", ") + ")"
		return call, diagnostics, true
	}
	// The method is called directly on a plain receiver, and otherwise
	// through its prototype. The guard reads the local receiver itself, which
	// an override receiver's $.pointerValue returns unchanged when the guard
	// holds.
	callArgs := append([]string{receiverExpr}, args...)
	call := namedValueExpr(ctx, receiver) + ".prototype." + selector.Sel.Name + ".call(" + strings.Join(callArgs, ", ") + ")"
	if override {
		receiverExpr = localReceiver
	}
	return directPointerMethodCall(receiverExpr, o.namedTypeExpr(ctx, receiver), selector.Sel.Name, args, call), diagnostics, true
}

// directPointerMethodCall returns a call of the pointer method name on the
// local receiver, which calls the method on the receiver directly when it is
// a plain struct, and otherwise makes call, which calls the method through
// its prototype and so takes a nil receiver, a variable reference or a
// boxed pointer. Calling through the prototype is much slower in V8 than a
// direct method call, which it can inline. Only one of the two calls runs,
// so the arguments are evaluated once; long arguments keep the prototype
// call alone, so as not to double the code.
func directPointerMethodCall(receiver, receiverType, name string, args []string, call string) string {
	// Only a plain local receiver can be read more than once.
	if !plainLocalName.MatchString(receiver) || len(strings.Join(args, ", ")) > maxDirectCallArgsLen {
		return call
	}

	// The receiver is checked as interfaceMethodReceiver checks it.
	value := "(" + receiver + " as any)"
	member := methodMemberName(name)
	if !strings.HasPrefix(member, "[") {
		member = "." + member
	}
	direct := "(" + value + " as " + receiverType + ")" + member + "(" + strings.Join(args, ", ") + ")"
	return "(" + receiver + " !== null && " + value + ".__isVarRef !== true && " +
		value + ".__goValue === undefined ? " + direct + " : " + call + ")"
}

// maxDirectCallArgsLen is the longest argument list, in characters, that a
// direct pointer method call repeats (see directPointerMethodCall).
const maxDirectCallArgsLen = 120

// transientReceiverField returns the field selection x.f of a call x.f.M()
// of a pointer method whose receiver is transient, which takes a new
// reference to the field.
func (o *LoweringOwner) transientReceiverField(ctx lowerFileContext, selector *ast.SelectorExpr, selection *types.Selection) (*ast.SelectorExpr, *types.Selection) {
	// Only a method declared on the field's own type, not a promoted one.
	method, _ := selection.Obj().(*types.Func)
	if method == nil || len(selection.Index()) != 1 || !methodHasPointerReceiver(method) {
		return nil, nil
	}

	// The receiver is the address of the field when the field is no pointer.
	if isPointerType(ctx.semPkg.source.TypesInfo.TypeOf(selector.X)) {
		return nil, nil
	}
	semFn := semanticFunctionFor(ctx.model, method)
	if semFn == nil || !semFn.receiverTransient {
		return nil, nil
	}
	return fieldSelectionOperand(ctx, selector.X)
}

func (o *LoweringOwner) lowerNamedReceiverForMethod(
	ctx lowerFileContext,
	expr ast.Expr,
	selection *types.Selection,
) (string, []Diagnostic) {
	method, _ := selection.Obj().(*types.Func)
	receiverPointer := false
	var receiverType types.Type
	if method != nil {
		signature, _ := method.Type().(*types.Signature)
		if signature != nil && signature.Recv() != nil {
			receiverType = signature.Recv().Type()
			_, receiverPointer = receiverType.(*types.Pointer)
		}
	}
	if receiverPointer {
		// A pointer method promoted from an embedded field takes a reference
		// to that field.
		exprType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
		if index := selection.Index(); len(index) > 1 && !o.receiverUsesOverridePackage(exprType) {
			return o.lowerPromotedFieldAddress(ctx, expr, index[:len(index)-1])
		}
		if isPointerType(exprType) {
			return o.lowerExpr(ctx, expr)
		}
		if ident, ok := expr.(*ast.Ident); ok {
			if obj := objectForIdent(ctx, ident); obj != nil && ctx.model.needsVarRef[obj] {
				return o.lowerIdent(ctx, ident, true), nil
			}
		}
		return o.lowerAddressExpr(ctx, expr)
	}
	receiver, diagnostics := o.lowerMethodReceiverExpr(ctx, expr, selection)
	selectedType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if index := selection.Index(); len(index) > 1 && !o.receiverUsesOverridePackage(selectedType) {
		selectedType = promotedMethodReceiverType(selectedType, index[:len(index)-1])
	}
	if receiverType != nil && isPointerType(selectedType) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + "<" + o.tsTypeFor(ctx, receiverType) + ">(" + receiver + ")", diagnostics
	}
	return receiver, diagnostics
}

// lowerPromotedFieldAddress returns a reference to the embedded field that
// fields, a path of embedded field indices, selects from expr, as the
// receiver of a pointer method promoted from the field.
func (o *LoweringOwner) lowerPromotedFieldAddress(ctx lowerFileContext, expr ast.Expr, fields []int) (string, []Diagnostic) {
	// Select the struct that holds the last embedded field.
	exprType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	var base string
	var diagnostics []Diagnostic
	if isPointerToStructType(exprType) {
		base, diagnostics = o.lowerPointerValueExpr(ctx, expr)
	} else {
		base, diagnostics = o.lowerExpr(ctx, expr)
		base = parenthesizeAwaitedExpr(base)
	}
	parent, parentType := o.lowerPromotedMethodReceiver(ctx, base, exprType, fields[:len(fields)-1])

	// An embedded pointer is the reference; a value field is referenced.
	structType := structUnderlyingType(derefPointerType(parentType))
	last := fields[len(fields)-1]
	if structType == nil || last < 0 || last >= structType.NumFields() {
		return base, diagnostics
	}
	field := structType.Field(last)
	name := tsStructFieldName(field.Name(), last)
	if isPointerType(field.Type()) {
		return parent + "." + name, diagnostics
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFieldRef) + "(" + parent + ", " + strconv.Quote(name) + ")", diagnostics
}

// lowerSelectorExpr resolves package exports, methods, and field selections.
func (o *LoweringOwner) lowerSelectorExpr(ctx lowerFileContext, expr *ast.SelectorExpr) (string, []Diagnostic) {
	// Resolve package exports and retain deferred initialization results.
	if ident, ok := expr.X.(*ast.Ident); ok {
		if pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName); pkgName != nil {
			if alias := importAliasForPkgName(ctx, pkgName); alias != "" {
				value := alias + "." + expr.Sel.Name
				if fn, ok := ctx.semPkg.source.TypesInfo.Uses[expr.Sel].(*types.Func); ok && ctx.model.functionDeferred(fn) && !ctx.model.hasDeferredPackage(ctx.semPkg.pkgPath) {
					source := strconvQuote("@goscript/" + pkgName.Imported().Path() + "/index.js")
					load := o.runtimeOwner.QualifiedHelper(RuntimeHelperLoadDeferredPackage) + "(" + source + ", () => import(" + source + "))"
					return "(async (...__args: Parameters<typeof " + value + ">) => (await " + load + ")." + expr.Sel.Name + "(...__args))", nil
				}

				// Initialize lazy package variables before exposing their values.
				obj, _ := ctx.semPkg.source.TypesInfo.Uses[expr.Sel].(*types.Var)
				if packageVarIsLazy(ctx, ctx.semPkg.source.TypesInfo.Uses[expr.Sel]) {
					value = o.lazyPackageVarRead(ctx, alias+".", obj)
				}
				if obj != nil && packageVarReadNeedsPointerValue(obj.Type()) {
					value = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
						"<" + o.tsNonNilTypeFor(ctx, obj.Type()) + ">(" + value + ")"
				} else if obj != nil && ctx.model.needsVarRef[obj] {
					// A variable whose address is taken is stored in a pointer box.
					value += ".value"
				}
				return value, nil
			}
		}
	}

	// Resolve receiver methods and promoted fields through semantic selections.
	if selection := ctx.semPkg.source.TypesInfo.Selections[expr]; selection != nil {
		switch selection.Kind() {
		case types.MethodVal:
			namedReceiver := methodReceiverNamedType(selection.Obj())
			if namedReceiver == nil {
				namedReceiver = selectedReceiverNamedType(ctx.semPkg.source, expr, selection)
			}
			if namedNonInterfaceNonStructType(namedReceiver) {
				receiverExpr, diagnostics := o.lowerNamedReceiverForMethod(ctx, expr.X, selection)
				methodExpr := o.methodFunctionExpr(ctx, namedReceiver, selection.Obj(), expr.Sel.Name)
				return o.lowerMethodValueClosure(ctx, selection, receiverExpr, methodExpr, true), diagnostics
			}
			// A method that observes its receiver is bound to the address
			// of a struct value.
			if value, diagnostics, ok := o.lowerIdentityReceiverMethodValue(ctx, expr, selection); ok {
				return value, diagnostics
			}
			// The method value is called later, so it gets a copy of a value
			// receiver even for a method that only reads it.
			receiverCtx := ctx
			receiverCtx.copyValues = true
			receiver, diagnostics := o.lowerMethodReceiverExpr(receiverCtx, expr.X, selection)
			return o.lowerMethodValueClosure(ctx, selection, receiver, "__receiver."+expr.Sel.Name, false), diagnostics
		case types.MethodExpr:
			if receiver := receiverNamedType(selection.Recv()); namedNonInterfaceNonStructType(receiver) {
				return o.methodFunctionExpr(ctx, receiver, selection.Obj(), expr.Sel.Name), nil
			}
			return o.lowerMethodExpressionClosure(ctx, selection), nil
		case types.FieldVal:
			return o.lowerFieldSelectionExpr(ctx, expr, selection, false)
		}
	}

	// Preserve member access precedence for awaited receiver expressions.
	left, diagnostics := o.lowerExpr(ctx, expr.X)
	left = parenthesizeAwaitedExpr(left)
	return left + "." + expr.Sel.Name, diagnostics
}

func packageVarSelectorNeedsPointerValue(ctx lowerFileContext, expr ast.Expr) bool {
	selector, ok := ast.Unparen(expr).(*ast.SelectorExpr)
	if !ok || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	if selection := ctx.semPkg.source.TypesInfo.Selections[selector]; selection != nil {
		return false
	}
	ident, ok := ast.Unparen(selector.X).(*ast.Ident)
	if !ok {
		return false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	if importAliasForPkgName(ctx, pkgName) == "" {
		return false
	}
	obj, _ := ctx.semPkg.source.TypesInfo.Uses[selector.Sel].(*types.Var)
	return obj != nil && packageVarReadNeedsPointerValue(obj.Type())
}

func packageVarReadNeedsPointerValue(typ types.Type) bool {
	if typ == nil || isPointerType(typ) {
		return false
	}
	if isStructValueType(typ) {
		return true
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Array)
	return ok
}

func (o *LoweringOwner) packageVarSetterForAssignment(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	if ident, ok := unwrapParenExpr(expr).(*ast.Ident); ok {
		obj, _ := objectForIdent(ctx, ident).(*types.Var)
		if obj == nil {
			return "", false
		}
		alias := ctx.localAliases[obj]
		if alias != "" {
			return alias + "." + packageVarSetterName(ident.Name), true
		}
		if ctx.lazyPackageVars[obj] {
			return packageVarSetterName(ident.Name), true
		}
		return "", false
	}
	selector, ok := unwrapParenExpr(expr).(*ast.SelectorExpr)
	if !ok {
		return "", false
	}
	ident, ok := selector.X.(*ast.Ident)
	if !ok {
		return "", false
	}
	pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
	if pkgName == nil {
		return "", false
	}
	alias := importAliasForPkgName(ctx, pkgName)
	if alias == "" {
		return "", false
	}
	obj, _ := ctx.semPkg.source.TypesInfo.Uses[selector.Sel].(*types.Var)
	if obj == nil || obj.Pkg() == nil {
		return "", false
	}
	return alias + "." + packageVarSetterName(selector.Sel.Name), true
}

func (o *LoweringOwner) packageVarAssignmentValue(
	ctx lowerFileContext,
	lhs ast.Expr,
	targetType types.Type,
	right string,
	tok token.Token,
) (string, bool) {
	if tok == token.ASSIGN {
		return right, true
	}
	left, diagnostics := o.lowerExpr(ctx, lhs)
	if len(diagnostics) != 0 {
		return "", false
	}
	if helper, ok := wideIntegerAssignHelper(targetType, tok); ok {
		return wideIntegerHelperCall(o.runtimeOwner, targetType, helper, left, right), true
	}
	if value, ok := lowerIntBitwiseValue(o.runtimeOwner, targetType, tok, left, right, false); ok {
		return value, true
	}
	if tok == token.AND_NOT_ASSIGN {
		return left + " & ~(" + right + ")", true
	}
	if value, ok := integerQuotientAssignValueExpr(targetType, left, right, tok); ok {
		return value, true
	}
	op := tok.String()
	if before, ok := strings.CutSuffix(op, "="); ok {
		op = before
	}
	return left + " " + op + " " + right, true
}

func (o *LoweringOwner) tsPackageVarSetterValueTypeFor(ctx lowerFileContext, typ types.Type) string {
	if signature := unnamedSignatureForType(typ); signature != nil {
		return o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
	}
	return o.tsTypeFor(ctx, typ)
}

func (o *LoweringOwner) lowerFieldSelectionExpr(
	ctx lowerFileContext,
	expr *ast.SelectorExpr,
	selection *types.Selection,
	address bool,
) (string, []Diagnostic) {
	// Only the address of this field may be transient, not those its
	// receiver takes.
	transient := ctx.transientAddress
	ctx.transientAddress = false
	if value, diagnostics, ok := o.lowerUnsafeStructFieldSelectionExpr(ctx, expr, selection, address); ok {
		return value, diagnostics
	}

	// A direct field is selected on the lowered receiver.
	receiver, diagnostics := o.lowerFieldReceiverExpr(ctx, expr.X)
	receiver = parenthesizeAwaitedExpr(receiver)
	index := selection.Index()
	if len(index) == 0 {
		fieldName := tsStructFieldName(expr.Sel.Name, 0)
		if address {
			return o.lowerFieldAddressExpr(receiver, fieldName, transient), diagnostics
		}
		return receiver + "." + fieldName, diagnostics
	}

	// An embedded field path selects each field in turn.
	typ := derefPointerType(ctx.semPkg.source.TypesInfo.TypeOf(expr.X))
	for idx, fieldIndex := range index {
		// A path through a type that is not a struct selects the name.
		structType := structUnderlyingType(typ)
		if structType == nil || fieldIndex < 0 || fieldIndex >= structType.NumFields() {
			fieldName := tsStructFieldName(expr.Sel.Name, 0)
			if address {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperFieldRef) + "(" + receiver + ", " + strconv.Quote(fieldName) + ")", diagnostics
			}
			return receiver + "." + fieldName, diagnostics
		}

		// The last field of the path is the selected one.
		field := structType.Field(fieldIndex)
		name := tsStructFieldName(field.Name(), fieldIndex)
		if idx == len(index)-1 {
			if address {
				return o.lowerFieldAddressExpr(receiver, name, transient), diagnostics
			}
			return receiver + "." + name, diagnostics
		}

		// An embedded field is the receiver of the next, through a pointer.
		receiver += "." + name
		typ = field.Type()
		if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
			receiver = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
				"<" + o.tsTypeFor(ctx, pointer.Elem()) + ">(" + receiver + ")"
			typ = pointer.Elem()
		}
	}

	// A path that runs out of struct types selects the name.
	if address {
		return o.lowerFieldAddressExpr(receiver, tsStructFieldName(expr.Sel.Name, 0), transient), diagnostics
	}
	return receiver + "." + tsStructFieldName(expr.Sel.Name, 0), diagnostics
}

// lowerFieldAddressExpr returns the reference to the field of the struct
// that receiver evaluates to, whose fields are its own properties: the stable
// one, or a new one when transient.
func (o *LoweringOwner) lowerFieldAddressExpr(receiver string, fieldName string, transient bool) string {
	// A transient parameter takes a new reference.
	helper := RuntimeHelperFieldRef
	if transient {
		helper = RuntimeHelperTransientFieldRef
	}
	return o.runtimeOwner.QualifiedHelper(helper) + "(" + receiver + ", " + strconv.Quote(fieldName) + ")"
}

func (o *LoweringOwner) lowerUnsafeStructFieldSelectionExpr(
	ctx lowerFileContext,
	expr *ast.SelectorExpr,
	selection *types.Selection,
	address bool,
) (string, []Diagnostic, bool) {
	index := selection.Index()
	if len(index) != 1 {
		return "", nil, false
	}
	targetCall, ok := unwrapParenExpr(expr.X).(*ast.CallExpr)
	if !ok || len(targetCall.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, targetCall.Fun)
	if targetType == nil {
		return "", nil, false
	}
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil {
		return "", nil, false
	}
	targetStruct := structUnderlyingType(targetPointer.Elem())
	if targetStruct == nil || index[0] < 0 || index[0] >= targetStruct.NumFields() {
		return "", nil, false
	}
	unsafeCall, ok := unwrapParenExpr(targetCall.Args[0]).(*ast.CallExpr)
	if !ok || len(unsafeCall.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, unsafeCall.Fun)) {
		return "", nil, false
	}
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(unsafeCall.Args[0])
	if sourceType == nil {
		return "", nil, false
	}
	sourcePointer, _ := types.Unalias(sourceType).Underlying().(*types.Pointer)
	if sourcePointer == nil {
		return "", nil, false
	}
	sourceStruct := structUnderlyingType(sourcePointer.Elem())
	if sourceStruct == nil || index[0] >= sourceStruct.NumFields() {
		return "", nil, false
	}
	targetField := targetStruct.Field(index[0])
	sourceField := sourceStruct.Field(index[0])
	if !unsafeStructFieldLayoutCompatible(targetField, sourceField) {
		return "", nil, false
	}
	receiver, diagnostics := o.lowerFieldReceiverExpr(ctx, unsafeCall.Args[0])
	fieldName := tsStructFieldName(sourceField.Name(), index[0])
	if address {
		return o.lowerFieldAddressExpr(receiver, fieldName, false), diagnostics, true
	}
	return receiver + "." + fieldName, diagnostics, true
}

func unsafeStructFieldLayoutCompatible(target *types.Var, source *types.Var) bool {
	if target == nil || source == nil || target.Name() != source.Name() {
		return false
	}
	return unsafeFieldTypeLayoutCompatible(target.Type(), source.Type())
}

func unsafeFieldTypeLayoutCompatible(left types.Type, right types.Type) bool {
	if types.Identical(left, right) {
		return true
	}
	leftUnderlying := types.Unalias(left).Underlying()
	rightUnderlying := types.Unalias(right).Underlying()
	return types.Identical(leftUnderlying, rightUnderlying)
}

// lowerMethodValueClosure lowers the method value of selection to a closure
// that binds receiver once and calls callee with the method's arguments.
func (o *LoweringOwner) lowerMethodValueClosure(
	ctx lowerFileContext,
	selection *types.Selection,
	receiver string,
	callee string,
	includeReceiver bool,
) string {
	// The closure takes the method's parameters.
	signature, _ := selection.Type().(*types.Signature)
	var params []string
	var args []string
	if signature != nil && signature.Params() != nil {
		params = make([]string, 0, signature.Params().Len())
		args = make([]string, 0, signature.Params().Len())
		for idx := range signature.Params().Len() {
			param := signature.Params().At(idx)
			name := safeParamName(param, idx)
			params = append(params, name+": "+o.tsTypeFor(ctx, param.Type()))
			args = append(args, name)
		}
	}

	// A generic receiver passes its type arguments, through
	// callInterfaceMethod for an interface receiver.
	callArgs := make([]string, 0, len(args)+3)
	genericArgs := ""
	if !o.methodSelectionUsesOverridePackage(ctx, selection) {
		genericArgs = o.genericReceiverTypeArgsExpr(ctx, selection)
	}
	interfaceGeneric := genericArgs != "" && isInterfaceType(selection.Recv())
	if interfaceGeneric {
		callArgs = append(callArgs, "__receiver", strconv.Quote(selection.Obj().Name()), genericArgs)
		callee = o.runtimeOwner.QualifiedHelper(RuntimeHelperCallInterfaceMethod)
	} else {
		if includeReceiver {
			callArgs = append(callArgs, "__receiver")
		}
		if genericArgs != "" {
			callArgs = append(callArgs, genericArgs)
		}
	}
	// An override method takes its variadic arguments as a rest parameter.
	if len(args) != 0 && signature.Variadic() && o.methodSelectionUsesOverridePackage(ctx, selection) {
		args[len(args)-1] = "...(" + args[len(args)-1] + " ?? [])"
	}
	callArgs = append(callArgs, args...)
	closure := "((__receiver) => (" + strings.Join(params, ", ") + ") => " + callee + "(" + strings.Join(callArgs, ", ") + "))(" + receiver + ")"
	if signature == nil {
		return closure
	}

	// The function value carries its Go type and the name Go gives the
	// method value.
	valueInfo := o.runtimeFunctionTypeInfo(signature, "")
	if method, ok := selection.Obj().(*types.Func); ok {
		if name := methodValueGoName(method); name != "" {
			valueInfo += ", " + strconv.Quote(name)
		}
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFunctionValue) + "(" + closure + ", " + valueInfo + ")"
}

func (o *LoweringOwner) lowerMethodExpressionClosure(ctx lowerFileContext, selection *types.Selection) string {
	signature, _ := selection.Type().(*types.Signature)
	if signature == nil || signature.Params() == nil || signature.Params().Len() == 0 {
		return "undefined"
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return "undefined"
	}
	receiver := receiverNamedType(selection.Recv())
	receiverName := safeParamName(signature.Params().At(0), 0)
	args := make([]string, 0, signature.Params().Len()-1)
	for idx := 1; idx < signature.Params().Len(); idx++ {
		args = append(args, safeParamName(signature.Params().At(idx), idx))
	}
	methodArgs := args
	genericArgs := ""
	if !o.methodSelectionUsesOverridePackage(ctx, selection) {
		genericArgs = o.genericReceiverTypeArgsExpr(ctx, selection)
	}
	call := ""
	if genericArgs != "" && isInterfaceType(selection.Recv()) {
		methodArgs = append([]string{receiverName, strconv.Quote(method.Name()), genericArgs}, methodArgs...)
		call = o.runtimeOwner.QualifiedHelper(RuntimeHelperCallInterfaceMethod) +
			"(" + strings.Join(methodArgs, ", ") + ")"
	} else {
		if genericArgs != "" {
			methodArgs = append([]string{genericArgs}, methodArgs...)
		}
		call = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
			"<" + o.namedTypeExpr(ctx, receiver) + ">(" + receiverName + ")." +
			method.Name() + "(" + strings.Join(methodArgs, ", ") + ")"
	}
	async := o.functionAsync(ctx, method)
	prefix := ""
	if async {
		prefix = "async "
		call = "await " + call
	}
	functionCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	function := prefix + "(" + o.tsSignatureParamsFor(functionCtx, signature, async) + "): " +
		asyncResultType(o.tsSignatureResultFor(functionCtx, signature), async) + " => " + call
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFunctionValue) +
		"(" + function + ", " + o.runtimeFunctionTypeInfo(signature, "") + ")"
}

func (o *LoweringOwner) lowerFieldReceiverExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if isPointerToStructType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		return o.lowerPointerValueExpr(ctx, expr)
	}
	value, diagnostics := o.lowerExpr(ctx, expr)
	value = parenthesizeAwaitedExpr(value)
	if obj := objectForValueExpr(ctx, expr); obj != nil &&
		objectNeedsVarRef(ctx, obj) &&
		isStructValueType(obj.Type()) &&
		!packageVarSelectorNeedsPointerValue(ctx, expr) &&
		fieldReceiverNeedsVarRefValue(ctx, expr, obj) {
		return value + ".value", diagnostics
	}
	return value, diagnostics
}

func fieldReceiverNeedsVarRefValue(ctx lowerFileContext, expr ast.Expr, obj types.Object) bool {
	if _, ok := expr.(*ast.Ident); !ok {
		return true
	}
	// Identifier aliases already lower to the dereferenced value.
	if ctx.identAliases[obj] != "" {
		return false
	}
	if ctx.localAliases[obj] != "" {
		if varObj, ok := obj.(*types.Var); ok && packageVarReadNeedsPointerValue(varObj.Type()) {
			return false
		}
		return !ctx.lazyPackageVars[obj]
	}
	return false
}

func (o *LoweringOwner) lowerMethodReceiverExpr(
	ctx lowerFileContext,
	expr ast.Expr,
	selection *types.Selection,
) (string, []Diagnostic) {
	fn, _ := selection.Obj().(*types.Func)
	receiverPointer := false
	if fn != nil {
		signature, _ := fn.Type().(*types.Signature)
		if signature != nil && signature.Recv() != nil {
			_, receiverPointer = signature.Recv().Type().(*types.Pointer)
		}
	}

	var receiver string
	var diagnostics []Diagnostic
	if isPointerToStructType(ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		receiver, diagnostics = o.lowerPointerValueExpr(ctx, expr)
	} else {
		receiver, diagnostics = o.lowerExpr(ctx, expr)
		receiver = parenthesizeAwaitedExpr(receiver)
	}
	receiverType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if !receiverPointer {
		if obj := objectForValueExpr(ctx, expr); obj != nil &&
			objectNeedsVarRef(ctx, obj) &&
			isStructValueType(obj.Type()) &&
			!packageVarSelectorNeedsPointerValue(ctx, expr) &&
			fieldReceiverNeedsVarRefValue(ctx, expr, obj) {
			receiver += ".value"
		}
	}
	if index := selection.Index(); len(index) > 1 && !o.receiverUsesOverridePackage(receiverType) {
		receiver, receiverType = o.lowerPromotedMethodReceiver(ctx, receiver, receiverType, index[:len(index)-1])
	}
	if receiverPointer {
		if obj := objectForValueExpr(ctx, expr); obj != nil &&
			objectNeedsVarRef(ctx, obj) &&
			isStructValueType(obj.Type()) &&
			fieldReceiverNeedsVarRefValue(ctx, expr, obj) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
				"<" + o.tsNonNilTypeFor(ctx, receiverType) + ">(" + receiver + ")", diagnostics
		}
		return receiver, diagnostics
	}
	if isStructValueType(receiverType) || isPointerToStructType(receiverType) {
		// A method that does not modify its value receiver, and does not
		// suspend while other code could modify the caller's value, is
		// passed the value without a copy.
		if method, _ := selection.Obj().(*types.Func); method != nil && !ctx.copyValues {
			if semFn := semanticFunctionFor(ctx.model, method); semFn != nil &&
				valueReadOnlyArg(ctx, semFn.receiverReadOnly, o.functionAsync(ctx, method), expr) {
				return receiver, diagnostics
			}
		}
		return o.lowerStructClone(receiver), diagnostics
	}
	if isInterfaceType(receiverType) {
		return o.interfaceMethodReceiver(ctx, receiver, receiverType), diagnostics
	}
	return receiver, diagnostics
}

// interfaceMethodReceiver returns the value that a method of the interface
// value receiver is called on. A local holding a plain object, the common
// case, is checked inline and called directly; nil, a variable reference and
// a boxed pointer go through $.pointerValue, which panics for nil.
func (o *LoweringOwner) interfaceMethodReceiver(ctx lowerFileContext, receiver string, receiverType types.Type) string {
	// Only a plain local can be read more than once.
	nonNil := o.tsNonNilTypeFor(ctx, receiverType)
	slow := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + "<" + nonNil + ">(" + receiver + ")"
	if !plainLocalName.MatchString(receiver) {
		return slow
	}

	// The object is its own receiver unless it is nil, a variable reference
	// or a boxed pointer, whose type name starts with "*" (code 42). A box
	// of a named value, such as a bit flag constant, is its own receiver.
	value := "(" + receiver + " as any)"
	return "(" + receiver + " !== null && " + value + ".__isVarRef !== true && (" +
		value + ".__goValue === undefined || " + value + ".__goType?.charCodeAt(0) !== 42) ? (" +
		receiver + " as " + nonNil + ") : " + slow + ")"
}

// plainLocalName matches a JavaScript identifier, the lowered form of a
// local variable that can be read more than once without side effects.
var plainLocalName = regexp.MustCompile(`^[A-Za-z_$][A-Za-z0-9_$]*$`)

// isOverrideFieldValue reports whether expr selects a struct field declared by
// an override package type.
func (o *LoweringOwner) isOverrideFieldValue(ctx lowerFileContext, expr ast.Expr) bool {
	selector, _ := ast.Unparen(expr).(*ast.SelectorExpr)
	if selector == nil {
		return false
	}
	selection := ctx.semPkg.source.TypesInfo.Selections[selector]
	return selection != nil && selection.Kind() == types.FieldVal && o.receiverUsesOverridePackage(selection.Recv())
}

// nilReceiverOverrideMethods are the pointer-receiver methods of override
// package types that Go defines for a nil receiver, keyed by their full
// name. Their receiver is passed through unchanged when it is nil, so the
// override method handles it instead of the call panicking.
var nilReceiverOverrideMethods = map[string]bool{
	"(*runtime.Func).Name": true,

	// The methods of a nil *os.File report os.ErrInvalid, as Go's
	// checkValid does, so they take the nil receiver.
	"(*os.File).Chdir":            true,
	"(*os.File).Chmod":            true,
	"(*os.File).Chown":            true,
	"(*os.File).Close":            true,
	"(*os.File).Fd":               true,
	"(*os.File).Read":             true,
	"(*os.File).ReadAt":           true,
	"(*os.File).ReadDir":          true,
	"(*os.File).ReadFrom":         true,
	"(*os.File).Readdir":          true,
	"(*os.File).Readdirnames":     true,
	"(*os.File).Seek":             true,
	"(*os.File).SetDeadline":      true,
	"(*os.File).SetReadDeadline":  true,
	"(*os.File).SetWriteDeadline": true,
	"(*os.File).Stat":             true,
	"(*os.File).Sync":             true,
	"(*os.File).SyscallConn":      true,
	"(*os.File).Truncate":         true,
	"(*os.File).Write":            true,
	"(*os.File).WriteAt":          true,
	"(*os.File).WriteString":      true,
	"(*os.File).WriteTo":          true,
}

func (o *LoweringOwner) receiverUsesOverridePackage(typ types.Type) bool {
	if o.overrideOwner == nil {
		return false
	}
	named, _ := types.Unalias(derefPointerType(typ)).(*types.Named)
	return named != nil && named.Obj() != nil && named.Obj().Pkg() != nil &&
		o.overrideFacts().HasPackage(named.Obj().Pkg().Path())
}

func (o *LoweringOwner) lowerPromotedMethodReceiver(
	ctx lowerFileContext,
	receiver string,
	typ types.Type,
	index []int,
) (string, types.Type) {
	typ = derefPointerType(typ)
	for _, fieldIndex := range index {
		structType := structUnderlyingType(typ)
		if structType == nil || fieldIndex < 0 || fieldIndex >= structType.NumFields() {
			return receiver, typ
		}
		field := structType.Field(fieldIndex)
		receiver += "." + tsStructFieldName(field.Name(), fieldIndex)
		typ = field.Type()
		if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
			receiver = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
				"<" + o.tsTypeFor(ctx, pointer.Elem()) + ">(" + receiver + ")"
			typ = pointer.Elem()
		}
	}
	return receiver, typ
}

func promotedMethodReceiverType(typ types.Type, index []int) types.Type {
	typ = derefPointerType(typ)
	for _, fieldIndex := range index {
		structType := structUnderlyingType(typ)
		if structType == nil || fieldIndex < 0 || fieldIndex >= structType.NumFields() {
			return typ
		}
		typ = structType.Field(fieldIndex).Type()
		if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
			typ = pointer.Elem()
		}
	}
	return typ
}

func (o *LoweringOwner) lowerAssignmentTarget(
	ctx lowerFileContext,
	expr ast.Expr,
	declare bool,
) (string, []Diagnostic) {
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		if declare {
			return o.lowerIdent(ctx, typed, true), nil
		}
		if obj := objectForIdent(ctx, typed); obj != nil && ctx.lazyPackageVars[obj] {
			target := o.lowerIdent(ctx, typed, true)
			if ctx.model.needsVarRef[obj] {
				target += ".value"
			}
			return target, nil
		}
		return o.lowerIdent(ctx, typed, false), nil
	case *ast.StarExpr:
		return o.lowerPointerValueExpr(ctx, typed.X)
	case *ast.IndexExpr:
		// Assignment targets need an assignable JS reference (target[index]); the
		// read path wraps array/slice indexing in a bounds-checked helper, which
		// is not assignable. Map and string targets keep their own paths.
		targetType := ctx.semPkg.source.TypesInfo.TypeOf(typed.X)
		if isStringType(targetType) || isMapType(targetType) {
			return o.lowerExpr(ctx, expr)
		}
		if element, ok := rangeWindowElement(ctx, typed); ok {
			return element, nil
		}
		if element, diagnostics, ok := o.loopWindowElement(ctx, typed); ok {
			return element, diagnostics
		}

		// The target and index lower as values.
		target, targetDiagnostics := o.lowerExpr(ctx, typed.X)
		index, indexDiagnostics := o.lowerExpr(ctx, typed.Index)
		diagnostics := append(targetDiagnostics, indexDiagnostics...)

		// A slice element is written in its backing array; an array element
		// in the array itself.
		if _, ok := types.Unalias(targetType).Underlying().(*types.Slice); ok {
			return o.lowerSliceElementTarget(ctx, typed, target, targetType, index), diagnostics
		}
		return o.lowerIndexTarget(ctx, target, targetType) + "[" + o.lowerNumberIndexValue(ctx, typed.Index, index) + "]", diagnostics
	default:
		return o.lowerExpr(ctx, expr)
	}
}

// lowerSliceElementTarget returns the assignable reference to element index of
// the slice target: the slot of its backing array at its offset in the
// slice's window.
func (o *LoweringOwner) lowerSliceElementTarget(ctx lowerFileContext, expr *ast.IndexExpr, target string, targetType types.Type, index string) string {
	slice := o.lowerIndexTarget(ctx, target, targetType)
	indexValue := o.lowerNumberIndexValue(ctx, expr.Index, index)

	// A slice that can be evaluated twice names its backing array and slot.
	if isSimpleLoweredOperand(target) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceElems) + "(" + slice + ")[" +
			o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceSlot) + "(" + slice + ", " + indexValue + ")]"
	}

	// Any other slice is evaluated once, through a reference to the element.
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexRef) + "(" + slice + ", " + indexValue + ").value"
}

func (o *LoweringOwner) lowerAddressExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if value, ok := o.lowerPackageVarAddressExpr(ctx, expr); ok {
		return value, nil
	}
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		return o.lowerIdent(ctx, typed, true), nil
	case *ast.CompositeLit:
		value, diagnostics := o.lowerCompositeLit(ctx, typed, false)
		if namedStructType(ctx.semPkg.source.TypesInfo.TypeOf(typed)) != nil {
			return value, diagnostics
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")", diagnostics
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil && selection.Kind() == types.FieldVal {
			return o.lowerFieldSelectionExpr(ctx, typed, selection, true)
		}
		receiver, diagnostics := o.lowerFieldReceiverExpr(ctx, typed.X)
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperFieldRef) + "(" + receiver + ", " + strconv.Quote(typed.Sel.Name) + ")", diagnostics
	case *ast.IndexExpr:
		return o.lowerIndexAddressExpr(ctx, typed)
	case *ast.StarExpr:
		// &*p is the identity address-of-dereference: it yields the original
		// pointer, not a copy, so emit the pointer expression directly.
		return o.lowerExpr(ctx, typed.X)
	default:
		return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, typed, "expression", ctx.semPkg.pkgPath, "unsupported address expression")}
	}
}

func (o *LoweringOwner) lowerPackageVarAddressExpr(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		obj, _ := objectForIdent(ctx, typed).(*types.Var)
		if obj == nil || !objectNeedsVarRef(ctx, obj) {
			return "", false
		}
		// A lazily initialized variable in the same file is initialized by
		// its getter, which returns its VarRef (other files use an alias,
		// which lowerIdent already reads through the getter).
		if ctx.lazyPackageVars[obj] && ctx.localAliases[obj] == "" && ctx.identAliases[obj] == "" {
			return o.lazyPackageVarRead(ctx, "", obj), true
		}
		return o.lowerIdent(ctx, typed, true), true
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil {
			return "", false
		}
		ident, ok := unwrapParenExpr(typed.X).(*ast.Ident)
		if !ok {
			return "", false
		}
		pkgName, _ := objectForIdent(ctx, ident).(*types.PkgName)
		if pkgName == nil {
			return "", false
		}
		alias := importAliasForPkgName(ctx, pkgName)
		if alias == "" {
			return "", false
		}
		obj, _ := ctx.semPkg.source.TypesInfo.Uses[typed.Sel].(*types.Var)
		if obj == nil {
			return "", false
		}
		// A hand-written override package exports its variables as plain
		// values, so the address refers to the variable's current value.
		if obj.Pkg() != nil && o.overrideFacts().HasPackage(obj.Pkg().Path()) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + alias + "." + typed.Sel.Name + ")", true
		}
		if !objectNeedsVarRef(ctx, obj) {
			return "", false
		}
		// A lazily initialized variable is initialized by its getter, which
		// returns its VarRef.
		if packageVarIsLazy(ctx, obj) {
			return o.lazyPackageVarRead(ctx, alias+".", obj), true
		}
		return alias + "." + typed.Sel.Name, true
	default:
		return "", false
	}
}

func importAliasForPkgName(ctx lowerFileContext, pkgName *types.PkgName) string {
	if pkgName == nil {
		return ""
	}
	if alias := ctx.importObjects[pkgName]; alias != "" {
		return alias
	}
	if imported := pkgName.Imported(); imported != nil {
		if alias := ctx.importPaths[imported.Path()]; alias != "" {
			return alias
		}
	}
	return ctx.importNames[pkgName.Name()]
}

func (o *LoweringOwner) lowerIndexAddressExpr(ctx lowerFileContext, expr *ast.IndexExpr) (string, []Diagnostic) {
	target, targetDiagnostics := o.lowerExpr(ctx, expr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, expr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	if isStringType(targetType) || isMapType(targetType) {
		return "undefined", append(diagnostics, loweringUnsupportedAt(ctx, expr, "expression", ctx.semPkg.pkgPath, "unsupported address expression"))
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexRef) + "(" + o.lowerIndexTarget(ctx, target, targetType) + ", " + o.lowerNumberIndexValue(ctx, expr.Index, index) + ")", diagnostics
}

func (o *LoweringOwner) lowerAddressEqualityExpr(
	ctx lowerFileContext,
	expr *ast.BinaryExpr,
) (string, []Diagnostic, bool) {
	left, leftDiagnostics, leftOK := o.lowerIndexAddressIntegerExpr(ctx, expr.X)
	if !leftOK {
		return "", nil, false
	}
	right, rightDiagnostics, rightOK := o.lowerIndexAddressIntegerExpr(ctx, expr.Y)
	if !rightOK {
		return "", nil, false
	}
	return left + " " + expr.Op.String() + " " + right, append(leftDiagnostics, rightDiagnostics...), true
}

func (o *LoweringOwner) lowerUnsafePointerIntegerExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, call.Fun)) {
		return "", nil, false
	}
	return o.lowerIndexByteAddressIntegerExpr(ctx, call.Args[0])
}

func (o *LoweringOwner) lowerUnsafePointerIdentityExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	expr = unwrapParenExpr(expr)
	if binary, ok := expr.(*ast.BinaryExpr); ok && binary.Op == token.XOR {
		switch {
		case isZeroIntegerExpr(ctx, binary.Y):
			return o.lowerUnsafePointerIdentityExpr(ctx, binary.X)
		case isZeroIntegerExpr(ctx, binary.X):
			return o.lowerUnsafePointerIdentityExpr(ctx, binary.Y)
		}
	}
	call, ok := expr.(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])
	if !isUintptrType(targetType) || !isUnsafePointerType(sourceType) {
		return "", nil, false
	}
	if _, _, ok := o.lowerUnsafePointerIntegerExpr(ctx, call.Args[0]); ok {
		return "", nil, false
	}
	value, diagnostics := o.lowerExpr(ctx, call.Args[0])
	return value, diagnostics, true
}

func (o *LoweringOwner) lowerIndexAddressIntegerExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	address, ok := unwrapParenExpr(expr).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	indexExpr, ok := unwrapParenExpr(address.X).(*ast.IndexExpr)
	if !ok {
		return "", nil, false
	}
	target, targetDiagnostics := o.lowerExpr(ctx, indexExpr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, indexExpr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(indexExpr.X)
	if isStringType(targetType) || isMapType(targetType) {
		return "", diagnostics, false
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexAddress) +
		"(" + o.lowerIndexTarget(ctx, target, targetType) + ", " + o.lowerNumberIndexValue(ctx, indexExpr.Index, index) + ")", diagnostics, true
}

func (o *LoweringOwner) lowerIndexByteAddressIntegerExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	address, ok := unwrapParenExpr(expr).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	indexExpr, ok := unwrapParenExpr(address.X).(*ast.IndexExpr)
	if !ok {
		return "", nil, false
	}
	target, targetDiagnostics := o.lowerExpr(ctx, indexExpr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, indexExpr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(indexExpr.X)
	if isStringType(targetType) || isMapType(targetType) {
		return "", diagnostics, false
	}
	elementSize := goScriptElementByteSize(ctx, indexElementType(targetType))
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexByteAddress) +
		"(" + o.lowerIndexTarget(ctx, target, targetType) + ", " + o.lowerNumberIndexValue(ctx, indexExpr.Index, index) + ", " + strconv.FormatInt(elementSize, 10) + ")", diagnostics, true
}

func (o *LoweringOwner) lowerPointerValueExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if value, diagnostics, ok := o.lowerUnsafeStringPointerValue(ctx, expr); ok {
		return value, diagnostics
	}
	if value, diagnostics, ok := o.lowerUnsafeStringByteSlicePointerValue(ctx, expr); ok {
		return value, diagnostics
	}
	if ref, diagnostics, ok := o.lowerUnsafeArrayPointerRefExpr(ctx, expr); ok {
		return ref + "!.value", diagnostics
	}
	if ref, diagnostics, ok := o.lowerUnsafePointerRefExpr(ctx, expr); ok {
		return ref + ".value", diagnostics
	}
	if ident, ok := ast.Unparen(expr).(*ast.Ident); ok && ctx.pointerTargets != nil {
		obj := ctx.semPkg.source.TypesInfo.Uses[ident]
		if target := ctx.pointerTargets[obj]; target != "" && ctx.identAliases[obj] == "" {
			return target, nil
		}
	}
	base, diagnostics := o.lowerExpr(ctx, expr)
	typeArg := ""
	if pointer, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr)).Underlying().(*types.Pointer); ok {
		typeArg = "<" + o.tsTypeFor(ctx, pointer.Elem()) + ">"
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + typeArg + "(" + base + ")", diagnostics
}

// pointerTargetLocals returns the locals that hold the structs that pointers
// to structs point to, and the statements that set those of the pointer
// receiver and parameters of decl. The pointers are the receiver, the
// parameters, and the locals that a statement of the body declares, that the
// body never assigns, does not take the address of, and dereferences at least
// twice. A read or write of a field through the pointer then reads the local
// rather than calling $.pointerValue each time. A nil pointer's local panics
// when a field is read or written, as the dereference does. The locals of
// declared pointers are set after their declarations (see
// appendPointerTargetDecls), from the statements that decls maps.
func (o *LoweringOwner) pointerTargetLocals(ctx lowerFileContext, decl *ast.FuncDecl, receiverAlias string) (map[types.Object]string, map[ast.Stmt][]*ast.Ident, []loweredStmt) {
	// A function without a body or syntax has nothing to analyze.
	if decl.Body == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil, nil, nil
	}

	// The candidates are the receiver and parameters, and the locals that
	// statements declare, that are pointers to structs.
	candidates := make(map[types.Object]string)
	addParam := func(field *ast.Field, name string) {
		if len(field.Names) == 1 {
			o.addPointerTargetCandidate(ctx, candidates, field.Names[0], name)
		}
	}
	if decl.Recv != nil && len(decl.Recv.List) == 1 && receiverAlias != "" && receiverAlias != "_" {
		addParam(decl.Recv.List[0], receiverAlias)
	}
	for _, field := range fieldsOf(decl.Type.Params) {
		if len(field.Names) == 1 {
			addParam(field, safeIdentifier(field.Names[0].Name))
		}
	}
	declared := o.pointerTargetDeclCandidates(ctx, decl.Body, candidates)
	if len(candidates) == 0 {
		return nil, nil, nil
	}

	// Drop the candidates the body changes, and keep those it dereferences
	// at least twice.
	uses := pointerTargetUses(ctx, decl.Body, candidates)
	targets := make(map[types.Object]string)
	for obj, name := range candidates {
		if uses[obj] >= 2 {
			// The local is read through a type assertion, which TypeScript
			// does not narrow, since calls between reads may change the
			// fields.
			elem := obj.Type().Underlying().(*types.Pointer).Elem()
			targets[obj] = "(" + name + "$ as " + o.tsTypeFor(ctx, elem) + ")"
		}
	}
	if len(targets) == 0 {
		return nil, nil, nil
	}

	// The receiver and parameter locals are set at the start of the body,
	// in order.
	var prelude []loweredStmt
	for _, field := range append(append([]*ast.Field{}, fieldsOf(decl.Recv)...), fieldsOf(decl.Type.Params)...) {
		if len(field.Names) != 1 {
			continue
		}
		obj := ctx.semPkg.source.TypesInfo.Defs[field.Names[0]]
		if _, ok := targets[obj]; ok {
			prelude = append(prelude, loweredStmt{text: "const " + o.pointerTargetLocal(ctx, obj, candidates[obj])})
		}
	}

	// The declared locals are set after the statements that declare them.
	decls := make(map[ast.Stmt][]*ast.Ident)
	for stmt, idents := range declared {
		for _, ident := range idents {
			if _, ok := targets[ctx.semPkg.source.TypesInfo.Defs[ident]]; ok {
				decls[stmt] = append(decls[stmt], ident)
			}
		}
	}
	return targets, decls, prelude
}

// addPointerTargetCandidate adds the variable that ident declares to
// candidates under name, when it is a plain pointer to a struct, held in no
// variable reference or alias.
func (o *LoweringOwner) addPointerTargetCandidate(ctx lowerFileContext, candidates map[types.Object]string, ident *ast.Ident, name string) bool {
	// The variable is a plain pointer to a struct.
	obj := ctx.semPkg.source.TypesInfo.Defs[ident]
	if obj == nil || ident.Name == "_" || ctx.model.needsVarRef[obj] || !isPointerToStructType(obj.Type()) {
		return false
	}

	// A variable read through an alias is left alone.
	if ctx.identAliases != nil && ctx.identAliases[obj] != "" {
		return false
	}
	candidates[obj] = name
	return true
}

// pointerTargetDeclCandidates adds the pointer to struct locals that the
// statements of the statement lists in body declare to candidates, and
// returns their identifiers by declaring statement. A function with goto
// statements has none, since its statements may be lowered out of order.
func (o *LoweringOwner) pointerTargetDeclCandidates(ctx lowerFileContext, body *ast.BlockStmt, candidates map[types.Object]string) map[ast.Stmt][]*ast.Ident {
	// A function with goto statements declares no candidates.
	if blockHasGoto(body) {
		return nil
	}

	// add records the candidates that one statement declares.
	declared := make(map[ast.Stmt][]*ast.Ident)
	add := func(stmt ast.Stmt, idents []*ast.Ident) {
		for _, ident := range idents {
			if o.addPointerTargetCandidate(ctx, candidates, ident, safeIdentifier(ident.Name)) {
				declared[stmt] = append(declared[stmt], ident)
			}
		}
	}

	// The candidates are declared by short variable declarations and
	// initialized var declarations in statement lists.
	ast.Inspect(body, func(node ast.Node) bool {
		for _, stmt := range stmtListOf(node) {
			add(stmt, declaredIdents(stmt))
		}
		return true
	})
	return declared
}

// stmtListOf returns the statement list of a block, case or select clause.
func stmtListOf(node ast.Node) []ast.Stmt {
	// Other nodes have no statement list.
	switch typed := node.(type) {
	case *ast.BlockStmt:
		return typed.List
	case *ast.CaseClause:
		return typed.Body
	case *ast.CommClause:
		return typed.Body
	}
	return nil
}

// declaredIdents returns the identifiers that a short variable declaration,
// or a var declaration with values, declares.
func declaredIdents(stmt ast.Stmt) []*ast.Ident {
	// A short variable declaration declares its left side.
	if assign, ok := stmt.(*ast.AssignStmt); ok && assign.Tok == token.DEFINE {
		var idents []*ast.Ident
		for _, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok {
				idents = append(idents, ident)
			}
		}
		return idents
	}

	// A var declaration declares the names of its specs with values.
	declStmt, ok := stmt.(*ast.DeclStmt)
	if !ok {
		return nil
	}
	gen, ok := declStmt.Decl.(*ast.GenDecl)
	if !ok || gen.Tok != token.VAR {
		return nil
	}
	var idents []*ast.Ident
	for _, spec := range gen.Specs {
		if valueSpec, ok := spec.(*ast.ValueSpec); ok && len(valueSpec.Values) != 0 {
			idents = append(idents, valueSpec.Names...)
		}
	}
	return idents
}

// blockHasGoto reports whether body has a goto statement.
func blockHasGoto(body *ast.BlockStmt) bool {
	// The search stops at the first goto.
	found := false
	ast.Inspect(body, func(node ast.Node) bool {
		if branch, ok := node.(*ast.BranchStmt); ok && branch.Tok == token.GOTO {
			found = true
		}
		return !found
	})
	return found
}

// pointerTargetUses counts the field dereferences of each candidate in body,
// and drops the candidates that body assigns or takes the address of.
func pointerTargetUses(ctx lowerFileContext, body *ast.BlockStmt, candidates map[types.Object]string) map[types.Object]int {
	// drop drops the candidate that expr uses, if any; a declaration of the
	// candidate itself does not drop it.
	info := ctx.semPkg.source.TypesInfo
	uses := make(map[types.Object]int)
	drop := func(expr ast.Expr) {
		if ident, ok := ast.Unparen(expr).(*ast.Ident); ok && info.Defs[ident] == nil {
			delete(candidates, info.ObjectOf(ident))
		}
	}

	// countUpdate counts a field that an assignment operator or an increment
	// or decrement updates once more, since it is read and written.
	countUpdate := func(expr ast.Expr) {
		selector, ok := ast.Unparen(expr).(*ast.SelectorExpr)
		if !ok {
			return
		}
		if ident, ok := ast.Unparen(selector.X).(*ast.Ident); ok {
			if selection := info.Selections[selector]; selection != nil && selection.Kind() == types.FieldVal {
				uses[info.Uses[ident]]++
			}
		}
	}

	// Assignments, increments, range variables and address operations drop
	// candidates, and field selections count dereferences.
	ast.Inspect(body, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.AssignStmt:
			for _, lhs := range typed.Lhs {
				drop(lhs)
				if typed.Tok != token.ASSIGN && typed.Tok != token.DEFINE {
					countUpdate(lhs)
				}
			}
		case *ast.IncDecStmt:
			drop(typed.X)
			countUpdate(typed.X)
		case *ast.RangeStmt:
			for _, expr := range []ast.Expr{typed.Key, typed.Value} {
				if expr != nil {
					drop(expr)
				}
			}
		case *ast.UnaryExpr:
			if typed.Op == token.AND {
				drop(typed.X)
			}
		case *ast.SelectorExpr:
			if ident, ok := ast.Unparen(typed.X).(*ast.Ident); ok {
				if selection := info.Selections[typed]; selection != nil && selection.Kind() == types.FieldVal {
					uses[info.Uses[ident]]++
				}
			}
		}
		return true
	})
	return uses
}

// pointerTargetLocal returns the declaration, without its keyword, of the
// local that holds the struct that the pointer local name of obj points to.
// It reads the struct inline, so that each site sees the few kinds of
// pointers it is passed (a struct or a variable reference), which is much
// faster than the generic $.pointerTarget, and calls $.pointerTarget for nil
// and boxed pointers.
func (o *LoweringOwner) pointerTargetLocal(ctx lowerFileContext, obj types.Object, name string) string {
	// The pointer is checked for nil, a variable reference, a plain struct,
	// and anything else, which $.pointerTarget handles.
	elem := o.tsTypeFor(ctx, obj.Type().Underlying().(*types.Pointer).Elem())
	slow := o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerTarget) + "<" + elem + ">(" + name + ")"
	pointer := "(" + name + " as any)"
	return name + "$: " + elem + " = " + name + " == null ? " + slow +
		" : " + pointer + ".__isVarRef === true ? " + pointer + ".value" +
		" : " + pointer + ".__goValue === undefined ? " + pointer + " : " + slow
}

// appendPointerTargetDecls appends to out the locals that hold the structs
// that the pointer locals stmt declares point to (see pointerTargetLocals).
// A local whose name is not its plain identifier here is dropped from the
// targets, so that its uses dereference it.
func (o *LoweringOwner) appendPointerTargetDecls(ctx lowerFileContext, stmt ast.Stmt, out []loweredStmt) []loweredStmt {
	// Each declared target gets its local, unless it has another name here.
	for _, ident := range ctx.pointerTargetDecls[stmt] {
		obj := ctx.semPkg.source.TypesInfo.Defs[ident]
		name := safeIdentifier(ident.Name)
		if ctx.identAliases[obj] != "" || o.lowerIdent(ctx, ident, false) != name {
			delete(ctx.pointerTargets, obj)
			continue
		}
		out = append(out, loweredStmt{text: declarationKeyword(ctx) + o.pointerTargetLocal(ctx, obj, name)})
	}
	return out
}

func fieldsOf(list *ast.FieldList) []*ast.Field {
	if list == nil {
		return nil
	}
	return list.List
}

func (o *LoweringOwner) lowerUnsafeStringPointerValue(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return "", nil, false
	}
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil || !isStringType(targetPointer.Elem()) {
		return "", nil, false
	}
	unsafeCall, ok := unwrapParenExpr(call.Args[0]).(*ast.CallExpr)
	if !ok || len(unsafeCall.Args) != 1 {
		return "", nil, false
	}
	unsafeTargetType := typeFromExpr(ctx, unsafeCall.Fun)
	if unsafeTargetType == nil || !isUnsafePointerType(unsafeTargetType) {
		return "", nil, false
	}
	address, ok := unwrapParenExpr(unsafeCall.Args[0]).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND || !isByteSliceType(ctx.semPkg.source.TypesInfo.TypeOf(address.X)) {
		return "", nil, false
	}
	value, diagnostics := o.lowerExpr(ctx, address.X)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperBytesToString) + "(" + value + ")", diagnostics, true
}

func (o *LoweringOwner) lowerUnsafeStringByteSlicePointerValue(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return "", nil, false
	}
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil || !isByteSliceType(targetPointer.Elem()) {
		return "", nil, false
	}
	unsafeCall, ok := unwrapParenExpr(call.Args[0]).(*ast.CallExpr)
	if !ok || len(unsafeCall.Args) != 1 {
		return "", nil, false
	}
	unsafeTargetType := typeFromExpr(ctx, unsafeCall.Fun)
	if unsafeTargetType == nil || !isUnsafePointerType(unsafeTargetType) {
		return "", nil, false
	}
	address, ok := unwrapParenExpr(unsafeCall.Args[0]).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	source, ok := localStringSliceHeaderSource(ctx, address.X)
	if !ok {
		return "", nil, false
	}
	value, diagnostics := o.lowerExpr(ctx, source)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + value + ")", diagnostics, true
}

func (o *LoweringOwner) lowerReflectHeaderPointerConversion(
	ctx lowerFileContext,
	targetType types.Type,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil {
		return "", nil, false
	}
	header, _ := types.Unalias(targetPointer.Elem()).(*types.Named)
	if header == nil || header.Obj() == nil || header.Obj().Pkg() == nil || header.Obj().Pkg().Path() != "reflect" {
		return "", nil, false
	}
	unsafeCall, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(unsafeCall.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, unsafeCall.Fun)) {
		return "", nil, false
	}
	address, ok := unwrapParenExpr(unsafeCall.Args[0]).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, false
	}
	switch header.Obj().Name() {
	case "StringHeader":
		if !isStringType(ctx.semPkg.source.TypesInfo.TypeOf(address.X)) {
			return "", nil, false
		}
		value, diagnostics := o.lowerAddressedValueRef(ctx, address.X)
		helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperStringHeaderRef) + "(" + value + ")"
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsafePointerCast) + "<" + o.tsTypeFor(ctx, targetType) + ">(" + helper + ")", diagnostics, true
	case "SliceHeader":
		if !isByteSliceType(ctx.semPkg.source.TypesInfo.TypeOf(address.X)) {
			return "", nil, false
		}
		value, diagnostics := o.lowerAddressedValueRef(ctx, address.X)
		helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperSliceHeaderRef) + "(" + value + ")"
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsafePointerCast) + "<" + o.tsTypeFor(ctx, targetType) + ">(" + helper + ")", diagnostics, true
	default:
		return "", nil, false
	}
}

func (o *LoweringOwner) lowerUnsafeArrayPointerConversion(
	ctx lowerFileContext,
	targetType types.Type,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	if targetType == nil {
		return "", nil, false
	}
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil {
		return "", nil, false
	}
	array, _ := types.Unalias(targetPointer.Elem()).Underlying().(*types.Array)
	if array == nil {
		return "", nil, false
	}
	ref, sourceType, diagnostics, ok := o.lowerUnsafeArrayPointerSourceRef(ctx, expr)
	if !ok {
		return "", nil, false
	}
	sourceElementSize := goScriptElementByteSize(ctx, sourceType)
	targetElementSize := goScriptElementByteSize(ctx, array.Elem())
	sourceTypeArg := o.tsTypeFor(ctx, array.Elem())
	if sourceType != nil {
		sourceTypeArg = o.tsTypeFor(ctx, sourceType)
	}
	helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayPointerFromIndexRef) +
		"<" + sourceTypeArg + ">(" + ref + ", " +
		strconv.FormatInt(array.Len(), 10) + ", " +
		strconv.FormatInt(sourceElementSize, 10) + ", " +
		strconv.FormatInt(targetElementSize, 10) + ")"
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsafePointerCast) + "<" + o.tsTypeFor(ctx, targetType) + ">(" + helper + ")", diagnostics, true
}

func (o *LoweringOwner) lowerUnsafeArrayPointerSourceRef(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, types.Type, []Diagnostic, bool) {
	if unsafeCall, ok := unwrapParenExpr(expr).(*ast.CallExpr); ok && len(unsafeCall.Args) == 1 {
		if isUnsafePointerType(typeFromExpr(ctx, unsafeCall.Fun)) {
			return o.lowerUnsafeArrayPointerAddressSourceRef(ctx, unsafeCall.Args[0])
		}
		if arg, ok := unsafePointerIdentityCallArg(ctx, unsafeCall); ok {
			return o.lowerUnsafeArrayPointerSourceRef(ctx, arg)
		}
	}
	return o.lowerUnsafeArrayPointerAddressSourceRef(ctx, expr)
}

func (o *LoweringOwner) lowerUnsafeArrayPointerAddressSourceRef(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, types.Type, []Diagnostic, bool) {
	if source, ok := stringHeaderDataSource(ctx, expr); ok {
		value, diagnostics := o.lowerExpr(ctx, source)
		bytes := o.runtimeOwner.QualifiedHelper(RuntimeHelperStringToBytes) + "(" + value + ")"
		ref := o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexRef) + "(" + bytes + ", 0)"
		return ref, types.Typ[types.Uint8], diagnostics, true
	}

	address, ok := unwrapParenExpr(expr).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND {
		return "", nil, nil, false
	}
	if index, ok := unwrapParenExpr(address.X).(*ast.IndexExpr); ok {
		ref, diagnostics := o.lowerAddressExpr(ctx, index)
		return ref, indexElementType(ctx.semPkg.source.TypesInfo.TypeOf(index.X)), diagnostics, true
	}
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(address.X)
	if isNumericType(sourceType) || isStringType(sourceType) || isComplexType(sourceType) {
		value, diagnostics := o.lowerExpr(ctx, address.X)
		ref := o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexRef) + "([" + value + "], 0)"
		return ref, sourceType, diagnostics, true
	}
	ref, diagnostics := o.lowerAddressExpr(ctx, address.X)
	return ref, sourceType, diagnostics, true
}

func unsafePointerIdentityCallArg(ctx lowerFileContext, call *ast.CallExpr) (ast.Expr, bool) {
	if call == nil || len(call.Args) != 1 ||
		!isUnsafePointerType(ctx.semPkg.source.TypesInfo.TypeOf(call)) ||
		!isUnsafePointerType(ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])) {
		return nil, false
	}
	fn := calledFunction(ctx.semPkg.source, call.Fun)
	decl := functionDeclForObject(ctx.semPkg, fn)
	if decl == nil || decl.Type == nil || decl.Type.Params == nil ||
		len(decl.Type.Params.List) != 1 || len(decl.Type.Params.List[0].Names) != 1 ||
		decl.Body == nil {
		return nil, false
	}
	param := objectForIdent(ctx, decl.Type.Params.List[0].Names[0])
	if param == nil {
		return nil, false
	}
	aliases := make(map[types.Object]bool)
	for _, stmt := range decl.Body.List {
		switch typed := stmt.(type) {
		case *ast.AssignStmt:
			if !recordUnsafePointerUintptrAlias(ctx, typed, param, aliases) {
				return nil, false
			}
		case *ast.ReturnStmt:
			if len(typed.Results) == 1 && unsafePointerIdentityReturnExpr(ctx, typed.Results[0], param, aliases) {
				return call.Args[0], true
			}
			return nil, false
		default:
			return nil, false
		}
	}
	return nil, false
}

func recordUnsafePointerUintptrAlias(ctx lowerFileContext, stmt *ast.AssignStmt, param types.Object, aliases map[types.Object]bool) bool {
	if stmt == nil || len(stmt.Lhs) != 1 || len(stmt.Rhs) != 1 {
		return false
	}
	ident, ok := unwrapParenExpr(stmt.Lhs[0]).(*ast.Ident)
	if !ok || ident.Name == "_" {
		return false
	}
	if !unsafePointerUintptrIdentityExpr(ctx, stmt.Rhs[0], param, aliases) {
		return false
	}
	obj := objectForIdent(ctx, ident)
	if obj == nil {
		return false
	}
	aliases[obj] = true
	return true
}

func unsafePointerIdentityReturnExpr(ctx lowerFileContext, expr ast.Expr, param types.Object, aliases map[types.Object]bool) bool {
	expr = unwrapParenExpr(expr)
	if ident, ok := expr.(*ast.Ident); ok {
		return objectForIdent(ctx, ident) == param
	}
	call, ok := expr.(*ast.CallExpr)
	if !ok || len(call.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, call.Fun)) {
		return false
	}
	return unsafePointerUintptrIdentityExpr(ctx, call.Args[0], param, aliases)
}

func unsafePointerUintptrIdentityExpr(ctx lowerFileContext, expr ast.Expr, param types.Object, aliases map[types.Object]bool) bool {
	expr = unwrapParenExpr(expr)
	if binary, ok := expr.(*ast.BinaryExpr); ok && binary.Op == token.XOR {
		switch {
		case isZeroIntegerExpr(ctx, binary.Y):
			return unsafePointerUintptrIdentityExpr(ctx, binary.X, param, aliases)
		case isZeroIntegerExpr(ctx, binary.X):
			return unsafePointerUintptrIdentityExpr(ctx, binary.Y, param, aliases)
		}
		return false
	}
	if ident, ok := expr.(*ast.Ident); ok {
		obj := objectForIdent(ctx, ident)
		return obj == param || aliases[obj]
	}
	call, ok := expr.(*ast.CallExpr)
	if !ok || len(call.Args) != 1 || !isUintptrType(typeFromExpr(ctx, call.Fun)) {
		return false
	}
	ident, ok := unwrapParenExpr(call.Args[0]).(*ast.Ident)
	return ok && objectForIdent(ctx, ident) == param
}

func stringHeaderDataSource(ctx lowerFileContext, expr ast.Expr) (ast.Expr, bool) {
	selector, ok := unwrapParenExpr(expr).(*ast.SelectorExpr)
	if !ok || selector.Sel.Name != "Data" {
		return nil, false
	}
	call, ok := unwrapParenExpr(selector.X).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return nil, false
	}
	targetPointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if targetPointer == nil {
		return nil, false
	}
	header, _ := types.Unalias(targetPointer.Elem()).(*types.Named)
	if header == nil || header.Obj() == nil || header.Obj().Pkg() == nil ||
		header.Obj().Pkg().Path() != "reflect" || header.Obj().Name() != "StringHeader" {
		return nil, false
	}
	unsafeCall, ok := unwrapParenExpr(call.Args[0]).(*ast.CallExpr)
	if !ok || len(unsafeCall.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, unsafeCall.Fun)) {
		return nil, false
	}
	address, ok := unwrapParenExpr(unsafeCall.Args[0]).(*ast.UnaryExpr)
	if !ok || address.Op != token.AND || !isStringType(ctx.semPkg.source.TypesInfo.TypeOf(address.X)) {
		return nil, false
	}
	return address.X, true
}

func (o *LoweringOwner) lowerAddressedValueRef(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if ident, ok := unwrapParenExpr(expr).(*ast.Ident); ok {
		if obj := objectForIdent(ctx, ident); obj != nil && ctx.model.needsVarRef[obj] {
			return o.lowerIdent(ctx, ident, true), nil
		}
	}
	value, diagnostics := o.lowerExpr(ctx, expr)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")", diagnostics
}

func localStringSliceHeaderSource(ctx lowerFileContext, expr ast.Expr) (ast.Expr, bool) {
	lit, ok := unwrapParenExpr(expr).(*ast.CompositeLit)
	if !ok {
		return nil, false
	}
	structType, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).Underlying().(*types.Struct)
	if !ok || structType.NumFields() != 2 {
		return nil, false
	}
	if !isStringType(structType.Field(0).Type()) || !isIntegerType(structType.Field(1).Type()) {
		return nil, false
	}
	var source ast.Expr
	var capacity ast.Expr
	for idx, elt := range lit.Elts {
		fieldIndex := idx
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			ident, ok := keyed.Key.(*ast.Ident)
			if !ok {
				return nil, false
			}
			fieldIndex = -1
			for index := range structType.NumFields() {
				if structType.Field(index).Name() == ident.Name {
					fieldIndex = index
					break
				}
			}
			if fieldIndex < 0 {
				return nil, false
			}
		}
		switch fieldIndex {
		case 0:
			source = valueExpr
		case 1:
			capacity = valueExpr
		}
	}
	if source == nil || capacity == nil {
		return nil, false
	}
	if !isStringType(ctx.semPkg.source.TypesInfo.TypeOf(source)) ||
		!isIntegerType(ctx.semPkg.source.TypesInfo.TypeOf(capacity)) {
		return nil, false
	}
	if !isLenCallOfExpr(ctx, capacity, source) {
		return nil, false
	}
	return source, true
}

func isLenCallOfExpr(ctx lowerFileContext, expr ast.Expr, target ast.Expr) bool {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return false
	}
	ident, ok := unwrapParenExpr(call.Fun).(*ast.Ident)
	if !ok || ident.Name != "len" {
		return false
	}
	if objectForIdent(ctx, ident) != types.Universe.Lookup("len") {
		return false
	}
	return sameLoweredSourceExpr(ctx, call.Args[0], target)
}

func sameLoweredSourceExpr(ctx lowerFileContext, left ast.Expr, right ast.Expr) bool {
	left = unwrapParenExpr(left)
	right = unwrapParenExpr(right)
	if leftIdent, ok := left.(*ast.Ident); ok {
		rightIdent, ok := right.(*ast.Ident)
		return ok && objectForIdent(ctx, leftIdent) == objectForIdent(ctx, rightIdent)
	}
	return false
}

// lowerPointerStorageExpr lowers the storage that *expr assigns to.
func (o *LoweringOwner) lowerPointerStorageExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	// Unsafe pointers resolve to the storage they address.
	if ref, diagnostics, ok := o.lowerUnsafeArrayPointerRefExpr(ctx, expr); ok {
		return ref + "!.value", diagnostics
	}
	if ref, diagnostics, ok := o.lowerUnsafePointerRefExpr(ctx, expr); ok {
		return ref + ".value", diagnostics
	}
	if ref, diagnostics, ok := o.lowerUnsafePointerStorageExpr(ctx, expr); ok {
		return ref, diagnostics
	}

	// A pointer to a type parameter may be a struct instance rather than a
	// VarRef, so stores go through the runtime's pointer storage.
	base, diagnostics := o.lowerExpr(ctx, expr)
	if typeParamPointerInScope(ctx, ctx.semPkg.source.TypesInfo.TypeOf(expr)) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericPointerRef) + "(" + base + ").value", diagnostics
	}
	return parenthesizeAwaitedExpr(base) + "!.value", diagnostics
}

// typeParamPointerInScope reports whether typ is a pointer to a type
// parameter in scope.
func typeParamPointerInScope(ctx lowerFileContext, typ types.Type) bool {
	ptr, ok := types.Unalias(typ).(*types.Pointer)
	if !ok {
		return false
	}
	typeParam, ok := types.Unalias(ptr.Elem()).(*types.TypeParam)
	return ok && typeParamInScope(ctx, typeParam)
}

func (o *LoweringOwner) lowerUnsafeArrayPointerRefExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return "", nil, false
	}
	return o.lowerUnsafeArrayPointerConversion(ctx, targetType, call.Args[0])
}

func (o *LoweringOwner) lowerUnsafePointerRefExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	targetType := typeFromExpr(ctx, call.Fun)
	if targetType == nil {
		return "", nil, false
	}
	pointer, _ := types.Unalias(targetType).Underlying().(*types.Pointer)
	if pointer == nil || !isUnsafePointerType(ctx.semPkg.source.TypesInfo.TypeOf(call.Args[0])) {
		return "", nil, false
	}
	if ref, diagnostics, ok := o.lowerUnsafeNumericRefExpr(ctx, pointer.Elem(), call.Args[0]); ok {
		return ref, diagnostics, true
	}
	value, diagnostics := o.lowerExpr(ctx, call.Args[0])
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsafePointerRef) +
		"<" + o.tsTypeFor(ctx, pointer.Elem()) + ">(" + value + ")", diagnostics, true
}

// lowerUnsafeNumericRefExpr lowers the unsafe.Pointer(&x) argument of a
// conversion to a pointer to targetType, where x and targetType are fixed-size
// numeric types of the same size, such as (*uint32)(unsafe.Pointer(&f)) for a
// float32 f, to a reference that reinterprets the bits of x as targetType.
// This is the common idiom for float bit conversions without the math package.
func (o *LoweringOwner) lowerUnsafeNumericRefExpr(
	ctx lowerFileContext,
	targetType types.Type,
	arg ast.Expr,
) (string, []Diagnostic, bool) {
	// Match the unsafe.Pointer(&x) argument.
	call, ok := unwrapParenExpr(arg).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, call.Fun)) {
		return "", nil, false
	}
	addr, ok := unwrapParenExpr(call.Args[0]).(*ast.UnaryExpr)
	if !ok || addr.Op != token.AND {
		return "", nil, false
	}

	// Reinterpret only between fixed-size numeric kinds of the same size.
	fromKind, fromSize := fixedSizeNumericKind(ctx.semPkg.source.TypesInfo.TypeOf(addr.X))
	toKind, toSize := fixedSizeNumericKind(targetType)
	if fromSize == 0 || fromSize != toSize {
		return "", nil, false
	}

	// Wrap the reference to x in one that converts its bits.
	ref, diagnostics := o.lowerExpr(ctx, addr)
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsafeNumericRef) +
		"<" + o.tsTypeFor(ctx, targetType) + ">(" + ref + ", " +
		strconv.Quote(fromKind) + ", " + strconv.Quote(toKind) + ")", diagnostics, true
}

// fixedSizeNumericKind returns the Go name and byte size of the basic kind of
// a fixed-size integer or float type, or a size of 0 for any other type.
func fixedSizeNumericKind(typ types.Type) (string, int) {
	if typ == nil {
		return "", 0
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok {
		return "", 0
	}
	switch basic.Kind() {
	case types.Int8, types.Uint8:
		return basic.Name(), 1
	case types.Int16, types.Uint16:
		return basic.Name(), 2
	case types.Int32, types.Uint32, types.Float32:
		return basic.Name(), 4
	case types.Int64, types.Uint64, types.Float64:
		return basic.Name(), 8
	default:
		return "", 0
	}
}

func (o *LoweringOwner) lowerUnsafePointerStorageExpr(
	ctx lowerFileContext,
	expr ast.Expr,
) (string, []Diagnostic, bool) {
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return "", nil, false
	}
	pointer, _ := types.Unalias(typeFromExpr(ctx, call.Fun)).Underlying().(*types.Pointer)
	if pointer == nil || !exprContainsUnsafePointerConversion(ctx, call.Args[0]) {
		return "", nil, false
	}
	_, diagnostics := o.lowerExpr(ctx, call.Args[0])
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsupportedPointerRef) +
		"<" + o.tsTypeFor(ctx, pointer.Elem()) + ">(undefined).value", diagnostics, true
}

func exprContainsUnsafePointerConversion(ctx lowerFileContext, expr ast.Expr) bool {
	found := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if found {
			return false
		}
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		if isUnsafePointerType(typeFromExpr(ctx, call.Fun)) {
			found = true
			return false
		}
		return true
	})
	return found
}

func (o *LoweringOwner) lowerIndexExpr(ctx lowerFileContext, expr *ast.IndexExpr) (string, []Diagnostic) {
	if signature := genericFunctionSignature(ctx, expr.X); signature != nil {
		return o.lowerGenericFunctionValue(ctx, expr.X, []ast.Expr{expr.Index}, signature)
	}
	if element, ok := rangeWindowElement(ctx, expr); ok {
		elemType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
		return "(" + element + " as " + o.tsTypeFor(ctx, elemType) + ")", nil
	}
	if element, diagnostics, ok := o.loopWindowElement(ctx, expr); ok {
		elemType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
		return "(" + element + " as " + o.tsTypeFor(ctx, elemType) + ")", diagnostics
	}
	target, targetDiagnostics := o.lowerExpr(ctx, expr.X)
	index, indexDiagnostics := o.lowerExpr(ctx, expr.Index)
	diagnostics := append(targetDiagnostics, indexDiagnostics...)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	switch {
	case isStringType(targetType):
		// A constant string lookup needs one byte, not a fresh UTF-8 buffer.
		// Encode each Go byte as a JS code unit, including invalid UTF-8 bytes.
		value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr.X)].Value
		if value != nil && value.Kind() == constant.String {
			encoded := hex.EncodeToString([]byte(constant.StringVal(value)))
			var literal strings.Builder
			literal.WriteByte('"')
			for i := 0; i < len(encoded); i += 2 {
				literal.WriteString(`\x`)
				literal.WriteString(encoded[i : i+2])
			}
			literal.WriteByte('"')
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexByteString) + "(" + literal.String() + ", " + o.lowerNumberIndexValue(ctx, expr.Index, index) + ")", diagnostics
		}

		return o.runtimeOwner.QualifiedHelper(RuntimeHelperIndexString) + "(" + target + ", " + o.lowerNumberIndexValue(ctx, expr.Index, index) + ")", diagnostics
	case isMapType(targetType):
		return o.lowerMapGetValue(ctx, expr, target, index), diagnostics
	}

	// Array elements are read directly; slices and the rest need arrayIndex.
	if array, ok := types.Unalias(targetType).Underlying().(*types.Array); ok {
		return o.lowerArrayElement(ctx, expr, target, index, array), diagnostics
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayIndex) + "(" + o.lowerIndexTarget(ctx, target, targetType) + ", " + o.lowerNumberIndexValue(ctx, expr.Index, index) + ")", diagnostics
}

// lowerArrayElement lowers reading the element of an array value at an index.
// Every representation of an array (a JS array, a typed array or an array
// view) indexes directly, and the length of the array is static, so the read
// needs no dispatch on the representation, unlike that of a slice element.
func (o *LoweringOwner) lowerArrayElement(ctx lowerFileContext, expr *ast.IndexExpr, target, index string, array *types.Array) string {
	// A constant index is in range, as the type checker rejects others.
	indexValue := o.lowerNumberIndexValue(ctx, expr.Index, index)
	if value := ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(expr.Index)].Value; value == nil {
		indexValue = o.runtimeOwner.QualifiedHelper(RuntimeHelperCheckArrayIndex) + "(" + indexValue + ", " + strconv.FormatInt(array.Len(), 10) + ")"
	}

	// The target is parenthesized unless it is a name or a field of one.
	if !isPlainPropertyPath(target) {
		target = "(" + target + ")"
	}
	return target + "[" + indexValue + "]"
}

// isPlainPropertyPath returns whether the TypeScript expression is a name or
// a chain of property accesses of one, which can be indexed as it is.
func isPlainPropertyPath(expr string) bool {
	// Every character must be part of a name, or a dot or digit after the first.
	for i, r := range expr {
		ok := r == '_' || r == '$' || unicode.IsLetter(r) || (i > 0 && (r == '.' || unicode.IsDigit(r)))
		if !ok {
			return false
		}
	}
	return expr != "" && !strings.HasSuffix(expr, ".")
}

// lowerNumberIndexValue coerces an index or size expression to a JS number when
// its Go type is bigint-backed (int64/uint64/uint/uintptr). Array indices, slice
// bounds, string/byte offsets, and make/len sizes must be number, not bigint.
func (o *LoweringOwner) lowerNumberIndexValue(ctx lowerFileContext, expr ast.Expr, value string) string {
	if expr == nil {
		return value
	}
	if typ := ctx.semPkg.source.TypesInfo.TypeOf(expr); isBigIntBackedType(typ) {
		return wideToNumber(o.runtimeOwner, typ, value)
	}
	return value
}

func (o *LoweringOwner) lowerGenericFunctionValue(
	ctx lowerFileContext,
	callee ast.Expr,
	typeArgExprs []ast.Expr,
	signature *types.Signature,
) (string, []Diagnostic) {
	calleeExpr, diagnostics := o.lowerExpr(ctx, callee)
	typeArgs := o.genericTypeArgsExpr(ctx, callee, typeArgExprs)
	signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	params := o.tsSignatureParamsFor(signatureCtx, signature, false)
	args := []string{typeArgs}
	if signature.Params() != nil {
		for idx := range signature.Params().Len() {
			args = append(args, safeParamName(signature.Params().At(idx), idx))
		}
	}
	call := o.lowerCallableExpr(ctx, callee, calleeExpr) + "(" + strings.Join(args, ", ") + ")"
	async := o.callNeedsAwait(ctx, callee)
	prefix := ""
	body := call
	if async {
		prefix = "async "
		body = "await " + call
	}
	function := prefix + "(" + params + "): " +
		asyncResultType(o.tsSignatureResultFor(signatureCtx, signature), async) +
		" => " + body
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFunctionValue) +
		"(" + function + ", " + o.runtimeFunctionTypeInfo(signature, "") + ")", diagnostics
}

func (o *LoweringOwner) lowerIndexTarget(ctx lowerFileContext, target string, typ types.Type) string {
	if strings.HasPrefix(target, "await ") {
		target = "(" + target + ")"
	}
	if array := pointerToArrayType(typ); array != nil {
		return o.lowerArrayPointerTarget(ctx, target, typ)
	}
	if indexed, ok := o.typeParamIndexedTSType(ctx, typ); ok {
		return "(" + target + " as " + indexed + ")"
	}
	if isNilableType(typ) {
		return target + "!"
	}
	return target
}

// typeParamIndexedTSType returns the TypeScript type to index a value of a
// type parameter whose type set holds only arrays, such as [3]int | [4]int,
// which TypeScript does not know to be indexable.
func (o *LoweringOwner) typeParamIndexedTSType(ctx lowerFileContext, typ types.Type) (string, bool) {
	// Only a type parameter with type terms has a type set to index.
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if !ok {
		return "", false
	}
	var terms []types.Type
	if !collectTypeSetTerms(typeParam.Constraint(), &terms) || len(terms) == 0 {
		return "", false
	}

	// Every term must be an array; join their distinct TypeScript types.
	var tsTypes []string
	for _, term := range terms {
		if _, ok := types.Unalias(term).Underlying().(*types.Array); !ok {
			return "", false
		}
		ts := o.tsTypeFor(ctx, term)
		if !slices.Contains(tsTypes, ts) {
			tsTypes = append(tsTypes, ts)
		}
	}
	return strings.Join(tsTypes, " | "), true
}

// typeParamCoreType returns the core type of a type parameter whose type
// terms share one underlying type, such as M ~map[K]V, which range and other
// operations on the type parameter use. Any other type is returned unchanged.
func typeParamCoreType(typ types.Type) types.Type {
	// Only a type parameter has a type set to resolve.
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if !ok {
		return typ
	}

	// All the terms of the type set must share one underlying type.
	var terms []types.Type
	if !collectTypeSetTerms(typeParam.Constraint(), &terms) || len(terms) == 0 {
		return typ
	}
	core := terms[0].Underlying()
	for _, term := range terms[1:] {
		if !types.Identical(core, term.Underlying()) {
			return typ
		}
	}
	return core
}

// collectTypeSetTerms appends the type terms of the given constraint to terms,
// and reports false if the constraint has no type terms to collect.
func collectTypeSetTerms(typ types.Type, terms *[]types.Type) bool {
	switch typed := types.Unalias(typ).(type) {
	case *types.Union:
		for i := range typed.Len() {
			if !collectTypeSetTerms(typed.Term(i).Type(), terms) {
				*terms = append(*terms, typed.Term(i).Type())
			}
		}
		return true
	case *types.Named, *types.Interface:
		iface, ok := typed.Underlying().(*types.Interface)
		if !ok {
			return false
		}
		found := false
		for i := range iface.NumEmbeddeds() {
			if collectTypeSetTerms(iface.EmbeddedType(i), terms) {
				found = true
			} else if _, isIface := iface.EmbeddedType(i).Underlying().(*types.Interface); !isIface {
				*terms = append(*terms, iface.EmbeddedType(i))
				found = true
			}
		}
		return found
	}
	return false
}

func (o *LoweringOwner) lowerArrayPointerTarget(ctx lowerFileContext, target string, typ types.Type) string {
	array := pointerToArrayType(typ)
	if array == nil {
		return target
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) +
		"<" + o.tsTypeFor(ctx, array) + ">(" + target + ")"
}

func (o *LoweringOwner) lowerSliceExpr(ctx lowerFileContext, expr *ast.SliceExpr) (string, []Diagnostic) {
	// The operand and the bounds are lowered in order.
	target, diagnostics := o.lowerExpr(ctx, expr.X)
	low, lowDiagnostics := o.lowerOptionalExpr(ctx, expr.Low)
	high, highDiagnostics := o.lowerOptionalExpr(ctx, expr.High)
	max, maxDiagnostics := o.lowerOptionalExpr(ctx, expr.Max)
	diagnostics = append(diagnostics, lowDiagnostics...)
	diagnostics = append(diagnostics, highDiagnostics...)
	diagnostics = append(diagnostics, maxDiagnostics...)

	// The bounds are numbers, and a string slices as a string.
	low = o.lowerNumberIndexValue(ctx, expr.Low, low)
	high = o.lowerNumberIndexValue(ctx, expr.High, high)
	max = o.lowerNumberIndexValue(ctx, expr.Max, max)
	helper := RuntimeHelperGoSlice
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.X)
	if isStringType(targetType) {
		helper = RuntimeHelperSliceStringOrBytes
	} else {
		target = o.lowerArrayPointerTarget(ctx, target, targetType)
	}

	// The helper takes the max bound of a full slice expression only.
	args := []string{target, low, high}
	if expr.Slice3 {
		args = append(args, max)
	}
	slice := o.runtimeOwner.QualifiedHelper(helper) + "(" + strings.Join(args, ", ") + ")"

	// A constant slice of a read-only table is the same whenever it is
	// taken, so it is made once, on first use, which also panics where Go
	// would.
	if constantTableSlice(ctx, expr) && !strings.Contains(slice, "await ") {
		return o.hoistStatic(ctx, slice), diagnostics
	}
	return slice, diagnostics
}

func (o *LoweringOwner) lowerOptionalExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	if expr == nil {
		return "undefined", nil
	}
	return o.lowerExpr(ctx, expr)
}

func (o *LoweringOwner) lowerCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	markStruct bool,
) (string, []Diagnostic) {
	if value, diagnostics, ok := o.lowerPromotedStructCompositeLit(ctx, lit, markStruct); ok {
		return value, diagnostics
	}
	if len(lit.Elts) == 0 {
		if typeParam, ok := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(lit)).(*types.TypeParam); ok {
			if typeParamInScope(ctx, typeParam) {
				return o.lowerDeclarationZeroValueExpr(ctx, typeParam), nil
			}
		}
	}
	typ := ctx.semPkg.source.TypesInfo.TypeOf(lit)
	if named := namedStructType(typ); named != nil {
		return o.lowerStructCompositeLit(ctx, lit, named, markStruct)
	}

	// An element of a pointer type with its & elided, as in
	// []*struct{ n int }{{1}}, is the address of a literal of the element
	// type: a struct of a named type is its own pointer, and any other value
	// lives in a variable reference, as lowerAddressExpr makes.
	if ptr, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		if named := namedStructType(ptr.Elem()); named != nil {
			return o.lowerStructCompositeLit(ctx, lit, named, false)
		}
		if value, diagnostics, ok := o.lowerUnnamedCompositeLit(ctx, lit, ptr.Elem()); ok {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperVarRef) + "(" + value + ")", diagnostics
		}
	}
	if value, diagnostics, ok := o.lowerUnnamedCompositeLit(ctx, lit, typ); ok {
		return value, diagnostics
	}
	detail := "unsupported composite literal"
	if typ != nil {
		detail += " of type " + typ.String()
	}
	return "undefined", []Diagnostic{loweringUnsupportedAt(ctx, lit, "expression", ctx.semPkg.pkgPath, detail)}
}

// lowerUnnamedCompositeLit lowers lit as a literal of typ, an anonymous
// struct, array, slice or map type, or reports false for any other type.
func (o *LoweringOwner) lowerUnnamedCompositeLit(ctx lowerFileContext, lit *ast.CompositeLit, typ types.Type) (string, []Diagnostic, bool) {
	var value string
	var diagnostics []Diagnostic
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Struct:
		value, diagnostics = o.lowerAnonymousStructCompositeLit(ctx, lit, typed)
	case *types.Array:
		value, diagnostics = o.lowerArrayCompositeLit(ctx, lit, typed)
	case *types.Slice:
		value, diagnostics = o.lowerSliceCompositeLit(ctx, lit, typed)
	case *types.Map:
		value, diagnostics = o.lowerMapCompositeLit(ctx, lit, typed)
	default:
		return "", nil, false
	}
	return value, diagnostics, true
}

func (o *LoweringOwner) lowerStructCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	named *types.Named,
	markStruct bool,
) (string, []Diagnostic) {
	// The awaits of the function literals in the fields do not make the
	// literal await.
	ctx, nested := ctx.withNestedFunctions()
	structType, _ := named.Underlying().(*types.Struct)
	values := make([]string, structType.NumFields())
	var prelude []string
	var diagnostics []Diagnostic

	// Each value is copied for its field, and evaluated before the literal
	// when it has calls, so that values are evaluated in source order.
	for idx, elt := range lit.Elts {
		fieldIndex, valueExpr := structLiteralField(structType, idx, elt)
		if fieldIndex < 0 {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, elt, "expression", ctx.semPkg.pkgPath, "unsupported struct literal field"))
			continue
		}
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = o.lowerValueForTarget(ctx, valueExpr, structType.Field(fieldIndex).Type(), value)
		if compositeLiteralFieldNeedsPreEval(ctx, valueExpr) {
			temp := ctx.tempName("LiteralField")
			prelude = append(prelude, "const "+temp+" = "+value)
			value = temp
		}
		values[fieldIndex] = value
	}

	// An instance of a generic struct takes the zero values of the omitted
	// fields of type parameter types.
	if named.TypeArgs().Len() != 0 {
		for idx, zero := range o.genericStructFieldZeros(ctx, named) {
			if values[idx] == "" {
				values[idx] = zero
			}
		}
	}

	// A positional class takes the values in field order.
	if o.hasGeneratedClone(named) {
		return o.wrapCompositeLitPrelude(o.lowerPositionalStructExpr(ctx, named, markStruct, values), prelude, nested), diagnostics
	}

	// Another class takes an init object of the values.
	fields := make([]string, 0, len(values))
	for idx, value := range values {
		if value != "" {
			fields = append(fields, tsStructFieldName(structType.Field(idx).Name(), idx)+": "+value)
		}
	}
	expr := "new " + o.namedTypeExpr(ctx, named) + "()"
	if len(fields) != 0 {
		expr = "new " + o.namedTypeExpr(ctx, named) + "({" + strings.Join(fields, ", ") + "})"
	}
	expr = o.lowerGenericInstance(ctx, named, expr)
	if markStruct {
		expr = o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(" + expr + ")"
	}
	return o.wrapCompositeLitPrelude(expr, prelude, nested), diagnostics
}

// structLiteralField returns the index of the field of structType that elt,
// the element at idx of a struct literal, sets, or -1, and its value.
func structLiteralField(structType *types.Struct, idx int, elt ast.Expr) (int, ast.Expr) {
	// A keyed element names its field.
	if keyed, ok := elt.(*ast.KeyValueExpr); ok {
		ident, ok := keyed.Key.(*ast.Ident)
		if !ok {
			return -1, keyed.Value
		}
		for index := range structType.NumFields() {
			if structType.Field(index).Name() == ident.Name {
				return index, keyed.Value
			}
		}
		return -1, keyed.Value
	}

	// An unkeyed element sets the field at its position.
	if idx < structType.NumFields() {
		return idx, elt
	}
	return -1, elt
}

// wrapCompositeLitPrelude returns expr, evaluated after the statements of
// prelude in a function literal when there are any, awaited when they await.
func (o *LoweringOwner) wrapCompositeLitPrelude(expr string, prelude []string, nested func() []string) string {
	// A literal without a prelude is the expression itself.
	if len(prelude) == 0 {
		return expr
	}
	body := strings.Join(prelude, "; ") + "; return " + expr
	if textAwaits(body, nested()) {
		return "(await (async () => { " + body + " })())"
	}
	return "(() => { " + body + " })()"
}

// lowerPositionalStructExpr returns a new struct of a positional struct class
// (see hasGeneratedClone), a struct value if value, from the values of its
// fields in field order, where an empty value is the field's zero value.
func (o *LoweringOwner) lowerPositionalStructExpr(ctx lowerFileContext, named *types.Named, value bool, values []string) string {
	// Trailing zero values are left out.
	last := len(values)
	for last > 0 && values[last-1] == "" {
		last--
	}

	// The marker comes first, then the values.
	args := make([]string, 0, last+1)
	args = append(args, strconv.FormatBool(value))
	for _, fieldValue := range values[:last] {
		if fieldValue == "" {
			fieldValue = "undefined"
		}
		args = append(args, fieldValue)
	}
	if !value && last == 0 {
		args = args[:0]
	}
	return o.lowerGenericInstance(ctx, named, "new "+o.namedTypeExpr(ctx, named)+"("+strings.Join(args, ", ")+")")
}

func compositeLiteralFieldNeedsPreEval(ctx lowerFileContext, expr ast.Expr) bool {
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.CallExpr:
		for _, arg := range typed.Args {
			if compositeLiteralFieldNeedsPreEval(ctx, arg) {
				return true
			}
		}
		if ident, ok := typed.Fun.(*ast.Ident); ok && isBuiltinCallTarget(ctx, ident) {
			return false
		}
		return typeFromExpr(ctx, typed.Fun) == nil
	case *ast.UnaryExpr:
		return typed.Op == token.ARROW || compositeLiteralFieldNeedsPreEval(ctx, typed.X)
	case *ast.BinaryExpr:
		return compositeLiteralFieldNeedsPreEval(ctx, typed.X) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.Y)
	case *ast.IndexExpr:
		return compositeLiteralFieldNeedsPreEval(ctx, typed.X) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.Index)
	case *ast.IndexListExpr:
		if compositeLiteralFieldNeedsPreEval(ctx, typed.X) {
			return true
		}
		for _, index := range typed.Indices {
			if compositeLiteralFieldNeedsPreEval(ctx, index) {
				return true
			}
		}
		return false
	case *ast.SliceExpr:
		return compositeLiteralFieldNeedsPreEval(ctx, typed.X) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.Low) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.High) ||
			compositeLiteralFieldNeedsPreEval(ctx, typed.Max)
	case *ast.StarExpr:
		return compositeLiteralFieldNeedsPreEval(ctx, typed.X)
	default:
		return false
	}
}

func (o *LoweringOwner) lowerAnonymousStructCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	structType *types.Struct,
) (string, []Diagnostic) {
	fields := make([]string, structType.NumFields())
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fields[idx] = tsStructFieldName(field.Name(), idx) + ": (" +
			o.lowerZeroValueExprFor(ctx, field.Type()) + " as " + o.tsStructFieldTypeFor(ctx, field.Type()) + ")"
	}
	var diagnostics []Diagnostic
	for idx, elt := range lit.Elts {
		fieldName := ""
		fieldType := types.Type(nil)
		fieldIndex := -1
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			if ident, ok := keyed.Key.(*ast.Ident); ok {
				for index := range structType.NumFields() {
					field := structType.Field(index)
					if field.Name() == ident.Name {
						fieldName = tsStructFieldName(field.Name(), index)
						fieldIndex = index
						fieldType = field.Type()
						break
					}
				}
			}
		}
		if fieldName == "" && idx < structType.NumFields() {
			field := structType.Field(idx)
			fieldName = tsStructFieldName(field.Name(), idx)
			fieldIndex = idx
			fieldType = field.Type()
		}
		if fieldName == "" {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, elt, "expression", ctx.semPkg.pkgPath, "unsupported anonymous struct literal field"))
			continue
		}
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = o.lowerValueForTarget(ctx, valueExpr, fieldType, value)
		field := fieldName + ": " + value
		if fieldIndex >= 0 {
			fields[fieldIndex] = field
			continue
		}
		fields = append(fields, field)
	}
	return o.lowerAnonymousStructValue("{"+strings.Join(fields, ", ")+"}", structType), diagnostics
}

// lowerAnonymousStructValue marks an anonymous struct object as a struct value
// that carries its type, so copies clone it like a named struct.
func (o *LoweringOwner) lowerAnonymousStructValue(object string, structType *types.Struct) string {
	if structType.NumFields() == 0 {
		return object
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperAnonymousStructValue) + "(" +
		object + ", " + o.runtimeTypeInfoExpr(structType) + ")"
}

// lowerArrayCompositeLit preserves element values without expanding empty arrays into source.
func (o *LoweringOwner) lowerArrayCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	array *types.Array,
) (string, []Diagnostic) {
	// Reuse declaration initialization so each mutable element gets its own zero value.
	if len(lit.Elts) == 0 {
		return o.lowerZeroValueExprFor(ctx, array), nil
	}

	// Overlay explicit elements on the array's implicit zero values.
	values := make([]string, int(array.Len()))
	for idx := range values {
		values[idx] = o.lowerZeroValueExprFor(ctx, array.Elem())
	}
	nextIndex := 0
	allByteConstants := isByteType(array.Elem())
	var diagnostics []Diagnostic
	for _, elt := range lit.Elts {
		index := nextIndex
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			parsed, keyConst := constIntExpr(ctx, keyed.Key)
			if keyConst {
				index = parsed
			}
			if !keyConst {
				key, keyDiagnostics := o.lowerExpr(ctx, keyed.Key)
				diagnostics = append(diagnostics, keyDiagnostics...)
				parsed, err := strconv.Atoi(key)
				if err == nil {
					index = parsed
				}
			}
		}
		if index >= 0 && index < len(values) {
			if isByteType(array.Elem()) {
				if folded, ok := foldByteConstant(ctx, valueExpr); ok {
					values[index] = folded
					nextIndex = index + 1
					continue
				}
			}
			value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
			diagnostics = append(diagnostics, valueDiagnostics...)
			if isByteType(array.Elem()) {
				allByteConstants = false
				values[index] = value
			} else {
				values[index] = o.lowerValueForTarget(ctx, valueExpr, array.Elem(), value)
			}
		}
		nextIndex = index + 1
	}
	if isByteType(array.Elem()) {
		if allByteConstants && len(values) >= 1024 {
			data := make([]byte, len(values))
			for idx, value := range values {
				parsed, _ := strconv.ParseUint(value, 10, 8)
				data[idx] = byte(parsed)
			}
			return o.lowerArrayValue(o.runtimeOwner.BuiltinImport().Alias+".bytesFromHex("+strconv.Quote(hex.EncodeToString(data))+")", array), diagnostics
		}
		return o.lowerArrayValue("new Uint8Array(["+strings.Join(values, ", ")+"])", array), diagnostics
	}
	return o.lowerArrayValue("["+strings.Join(values, ", ")+"]", array), diagnostics
}

// lowerArrayValue marks array storage as a Go array value, so bulk slice copies
// clone it. Arrays of struct or array elements carry their descriptor so the
// clone can copy each element, and arrays of float elements carry it so that
// fmt formats the elements at their precision.
func (o *LoweringOwner) lowerArrayValue(storage string, array *types.Array) string {
	helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayValue)
	elem := types.Unalias(array.Elem()).Underlying()
	_, isStruct := elem.(*types.Struct)
	_, isArray := elem.(*types.Array)
	if !isStruct && !isArray && !isFloatType(elem) {
		return helper + "(" + storage + ")"
	}
	return helper + "(" + storage + ", " + o.runtimeTypeInfoExpr(array) + ")"
}

func (o *LoweringOwner) lowerSliceCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	slice *types.Slice,
) (string, []Diagnostic) {
	isByte := isByteType(slice.Elem())
	values := make([]string, 0, len(lit.Elts))
	nextIndex := 0
	var diagnostics []Diagnostic
	for _, elt := range lit.Elts {
		index := nextIndex
		valueExpr := elt
		if keyed, ok := elt.(*ast.KeyValueExpr); ok {
			valueExpr = keyed.Value
			parsed, keyConst := constIntExpr(ctx, keyed.Key)
			if keyConst {
				index = parsed
			}
			if !keyConst {
				key, keyDiagnostics := o.lowerExpr(ctx, keyed.Key)
				diagnostics = append(diagnostics, keyDiagnostics...)
				parsed, err := strconv.Atoi(key)
				if err == nil {
					index = parsed
				}
			}
		}
		for len(values) <= index {
			values = append(values, o.lowerZeroValueExprFor(ctx, slice.Elem()))
		}
		// A constant byte element folds to its plain numeric literal: the Go
		// type checker already proved it fits uint8, so a runtime $.uint(k, 8)
		// truncation is dead work. Non-constant elements keep the runtime
		// truncation that lowerValueForTarget applies for the byte target.
		if isByte {
			if folded, ok := foldByteConstant(ctx, valueExpr); ok {
				values[index] = folded
				nextIndex = index + 1
				continue
			}
		}
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		if isByte {
			// new Uint8Array([...]) applies ToUint8 (mod-256 two's-complement
			// truncation) to every element on construction, identical to Go's
			// byte conversion, so a non-constant element needs no $.uint(x, 8)
			// wrap here. This invariant must hold for any future change away
			// from the Uint8Array byte backing.
			values[index] = value
		} else {
			values[index] = o.lowerValueForTarget(ctx, valueExpr, slice.Elem(), value)
		}
		nextIndex = index + 1
	}
	// Byte specialization is a property of the Go element type, not the backing
	// representation: a []byte literal keeps the Uint8Array representation
	// shared by the make, conversion, and array-literal paths. The literal is
	// asserted to the wider Slice<number> type so it still flows into generic
	// Slice<unknown> parameters and clear(); a bare Uint8Array narrows too
	// tightly at those call sites. Keyed/sparse literals route here too and are
	// zero-filled in values, so the same construction covers them.
	if isByte {
		return "new Uint8Array([" + strings.Join(values, ", ") + "]) as $.Slice<" +
			o.tsSliceElemTypeFor(ctx, slice.Elem()) + ">", diagnostics
	}

	// A literal that only its function indexes keeps an array (see
	// lowering-local-literals.go).
	elemType := o.tsSliceElemTypeFor(ctx, slice.Elem())
	if ctx.localLiterals[lit] {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperArrayToSlice) +
			"<" + elemType + ">([" + strings.Join(values, ", ") + "])", diagnostics
	}

	// Other fixed-size numeric elements are held in their typed arrays in the
	// same way, whose stores also wrap or round each element as Go stores it.
	return o.packedSliceExpr(slice.Elem(), elemType, values), diagnostics
}

func (o *LoweringOwner) lowerMapCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	mapType *types.Map,
) (string, []Diagnostic) {
	entries := make([]string, 0, len(lit.Elts))
	var diagnostics []Diagnostic
	for _, elt := range lit.Elts {
		keyed, ok := elt.(*ast.KeyValueExpr)
		if !ok {
			diagnostics = append(diagnostics, loweringUnsupportedAt(ctx, elt, "expression", ctx.semPkg.pkgPath, "unsupported map literal entry"))
			continue
		}
		key, keyDiagnostics := o.lowerExpr(ctx, keyed.Key)
		value, valueDiagnostics := o.lowerExpr(ctx, keyed.Value)
		diagnostics = append(diagnostics, keyDiagnostics...)
		diagnostics = append(diagnostics, valueDiagnostics...)
		key = o.lowerValueForTarget(ctx, keyed.Key, mapType.Key(), key)
		value = o.lowerValueForTarget(ctx, keyed.Value, mapType.Elem(), value)
		entries = append(entries, "["+key+", "+value+"]")
	}
	return o.lowerMapConstructor(ctx, mapType, "["+strings.Join(entries, ", ")+"]"), diagnostics
}

// lowerMapConstructor preserves the declared equality of pointer keys. Generic
// keys carry their runtime type so pointer instantiations use the same path.
func (o *LoweringOwner) lowerMapConstructor(ctx lowerFileContext, mapType *types.Map, entries string) string {
	args := entries
	_, generic := types.Unalias(mapType.Key()).(*types.TypeParam)
	_, pointer := types.Unalias(mapType.Key()).Underlying().(*types.Pointer)
	if generic || pointer {
		if args == "" {
			args = "undefined"
		}
		args += ", " + o.runtimeTypeAssertInfoExpr(ctx, mapType.Key())
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMakeMap) + "<" + o.tsTypeFor(ctx, mapType.Key()) + ", " + o.tsTypeFor(ctx, mapType.Elem()) + ">(" + args + ")"
}

func tsNativeMapType(keyType, elemType string) string {
	return "globalThis.Map<" + keyType + ", " + elemType + ">"
}

func (o *LoweringOwner) lowerTypeAssertExpr(ctx lowerFileContext, expr *ast.TypeAssertExpr) (string, []Diagnostic) {
	// The generic assertion checks the value against the type's descriptor.
	value, diagnostics := o.lowerExpr(ctx, expr.X)
	targetType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Type)
	tsType := o.tsTypeAssertionTypeFor(ctx, targetType)
	assert := o.runtimeOwner.QualifiedHelper(RuntimeHelperMustTypeAssert) +
		"<" + tsType + ">(" + value + ", " + o.runtimeTypeAssertInfoExpr(ctx, targetType) + ")"

	// A variable asserted to a pointer to a named struct type is first
	// checked inline against the Go type name it was boxed with (see
	// $.interfaceValue), which is much faster than the generic assertion.
	// Boxed pointer values and typed nils take the generic path.
	if name, ok := pointerAssertTypeName(targetType); ok && isPlainVariableRead(value) {
		boxed := "(" + value + " as any)"
		return "(" + boxed + "?.__goType === " + strconv.Quote(name) + " && " + boxed + ".__goValue === undefined && " +
			boxed + ".__isTypedNil !== true ? (" + boxed + " as " + tsType + ") : " + assert + ")", diagnostics
	}
	return assert, diagnostics
}

// pointerAssertTypeName returns the Go type name that $.interfaceValue boxes
// a pointer of typ with, for an unnamed pointer to a named struct type that
// is not generic.
func pointerAssertTypeName(typ types.Type) (string, bool) {
	// The type is a pointer to a named struct type.
	pointer, ok := types.Unalias(typ).(*types.Pointer)
	if !ok {
		return "", false
	}
	named := namedStructType(pointer.Elem())
	if named == nil || named.TypeArgs().Len() != 0 || named.TypeParams().Len() != 0 {
		return "", false
	}
	return goRuntimeTypeString(typ), true
}

// plainVariableRead matches the lowering of a read of a variable, which can
// be repeated without side effects.
var plainVariableRead = regexp.MustCompile(`^[A-Za-z_$][A-Za-z0-9_$]*(\.value)?$`)

// isPlainVariableRead reports whether value is the lowering of a read of a
// variable.
func isPlainVariableRead(value string) bool {
	return plainVariableRead.MatchString(value)
}

func (o *LoweringOwner) lowerTupleExpr(ctx lowerFileContext, expr ast.Expr) (string, []Diagnostic) {
	switch typed := expr.(type) {
	case *ast.TypeAssertExpr:
		value, diagnostics := o.lowerExpr(ctx, typed.X)
		targetType := ctx.semPkg.source.TypesInfo.TypeOf(typed.Type)
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeAssertTuple) +
			"<" + o.tsTypeAssertionTypeFor(ctx, targetType) + ">(" +
			value + ", " + o.runtimeTypeAssertInfoExpr(ctx, targetType) + ")", diagnostics
	case *ast.IndexExpr:
		if isMapType(ctx.semPkg.source.TypesInfo.TypeOf(typed.X)) {
			target, targetDiagnostics := o.lowerExpr(ctx, typed.X)
			index, indexDiagnostics := o.lowerExpr(ctx, typed.Index)
			return o.lowerMapGetTuple(ctx, typed, target, index), append(targetDiagnostics, indexDiagnostics...)
		}
	}
	return o.lowerExpr(ctx, expr)
}

func (o *LoweringOwner) lowerMapGetValue(ctx lowerFileContext, expr *ast.IndexExpr, target string, index string) string {
	return o.lowerMapGetTuple(ctx, expr, target, index) + "[0]"
}

func (o *LoweringOwner) lowerMapGetTuple(ctx lowerFileContext, expr *ast.IndexExpr, target string, index string) string {
	mapType, _ := types.Unalias(ctx.semPkg.source.TypesInfo.TypeOf(expr.X)).Underlying().(*types.Map)
	defaultValue := "undefined"
	if mapType != nil {
		// A lookup only reads its key, so a struct key of the map's key type
		// is not copied.
		indexType := ctx.semPkg.source.TypesInfo.TypeOf(expr.Index)
		if !isStructValueType(mapType.Key()) || indexType == nil || !types.Identical(indexType, mapType.Key()) {
			index = o.lowerValueForTarget(ctx, expr.Index, mapType.Key(), index)
		}
		defaultValue = o.lowerZeroValueExprFor(ctx, mapType.Elem())
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMapGet) +
			"<" + o.tsTypeFor(ctx, mapType.Key()) + ", " + o.tsTypeFor(ctx, mapType.Elem()) + ", " + o.tsTypeFor(ctx, mapType.Elem()) + ">(" +
			target + ", " + index + ", " + defaultValue + ")"
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMapGet) + "(" + target + ", " + index + ", " + defaultValue + ")"
}

// lowerValueForTarget converts value, the lowered expr, to the representation
// of targetType.
func (o *LoweringOwner) lowerValueForTarget(
	ctx lowerFileContext,
	expr ast.Expr,
	targetType types.Type,
	value string,
) string {
	// A real value assigned to a complex type becomes a complex number.
	sourceType := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	if isComplex64Type(targetType) {
		if isComplexType(sourceType) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex64) + "(" + value + ")"
		}
		if isRealNumericConstantExpr(ctx, expr) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex64) + "(" + value + ", 0)"
		}
	}
	if isComplexType(targetType) {
		if isComplexType(sourceType) {
			return value
		}
		if isRealNumericConstantExpr(ctx, expr) {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex) + "(" + value + ", 0)"
		}
	}
	if isNumericType(targetType) {
		if constantValue, ok := o.lowerNumericConstantExprForTarget(ctx, expr, targetType); ok {
			return constantValue
		}
		if constantValue, ok := lowerNumberIntegerConstantExpr(ctx, expr, targetType); ok {
			// Keep a literal's own lowered spelling, such as 0o700.
			if lit, ok := unwrapParenExpr(expr).(*ast.BasicLit); ok && lit.Kind == token.INT {
				return value
			}
			return constantValue
		}
	}
	if sameIntegerRepresentation(targetType, sourceType) && isNormalizedIntegerExpr(ctx, expr) {
		return value
	}

	// A function of an override package is adapted to the calls of function
	// values: a variadic one takes a slice, and another one converts its
	// interface arguments.
	if adapted, ok := o.lowerOverrideVariadicFunctionValue(ctx, expr, value); ok {
		value = adapted
	} else if adapted, ok := o.lowerOverrideFunctionValue(ctx, expr, targetType, value); ok {
		return adapted
	}
	if isInterfaceType(targetType) {
		// A declared function boxed into an interface records its Go name,
		// which runtime.FuncForPC reports for its reflect Pointer.
		if goName := declaredFuncGoName(ctx, expr); goName != "" {
			value = o.runtimeOwner.QualifiedHelper(RuntimeHelperGoFunc) + "(" + value + ", " + strconv.Quote(goName) + ")"
		}
	}
	value = o.lowerValueForTargetTypes(ctx, targetType, sourceType, value, o.shouldCloneStructValue(ctx, expr))
	if typeParamMayHoldValueType(targetType) && typeParamMayHoldValueType(sourceType) && isStoredValueExpr(ctx, expr) {
		// A type parameter may be instantiated with a struct or array type,
		// which Go copies at assignment, so a stored value is copied when it
		// is one at run time.
		value = o.runtimeOwner.QualifiedHelper(RuntimeHelperCopyElement) + "(" + value + ")"
	}
	return value
}

// isStoredValueExpr reports whether expr reads a value stored in a variable,
// field, element or pointer target, rather than producing a new value.
func isStoredValueExpr(ctx lowerFileContext, expr ast.Expr) bool {
	switch typed := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		_, ok := ctx.semPkg.source.TypesInfo.ObjectOf(typed).(*types.Var)
		return ok
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil {
			return selection.Kind() == types.FieldVal
		}
		_, ok := ctx.semPkg.source.TypesInfo.ObjectOf(typed.Sel).(*types.Var)
		return ok
	case *ast.IndexExpr:
		return !isFunctionType(ctx.semPkg.source.TypesInfo.TypeOf(typed))
	case *ast.StarExpr:
		return true
	}
	return false
}

// declaredFuncGoName returns the name that the Go runtime gives the
// non-generic package-level function that expr refers to, such as
// example.com/pkg.Func, or "" if expr is not such a function.
func declaredFuncGoName(ctx lowerFileContext, expr ast.Expr) string {
	// Resolve the function that expr names, directly or through its package.
	var ident *ast.Ident
	switch e := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		ident = e
	case *ast.SelectorExpr:
		ident = e.Sel
	default:
		return ""
	}

	// Only a non-generic package-level function has a fixed Go name.
	fn, ok := ctx.semPkg.source.TypesInfo.Uses[ident].(*types.Func)
	if !ok || fn.Pkg() == nil || fn.Parent() != fn.Pkg().Scope() {
		return ""
	}
	sig, ok := fn.Type().(*types.Signature)
	if !ok || sig.Recv() != nil || sig.TypeParams().Len() != 0 {
		return ""
	}
	return goRuntimePackageName(fn.Pkg()) + "." + fn.Name()
}

// methodValueGoName returns the name that the Go runtime gives the method
// value of method, such as example.com/pkg.(*T).Method-fm, or "" if its
// receiver type is not named.
func methodValueGoName(method *types.Func) string {
	// Find the named receiver type, through a pointer receiver.
	sig, ok := method.Type().(*types.Signature)
	if !ok || sig.Recv() == nil || method.Pkg() == nil {
		return ""
	}
	recv := types.Unalias(sig.Recv().Type())
	ptr, pointer := recv.(*types.Pointer)
	if pointer {
		recv = types.Unalias(ptr.Elem())
	}
	named, ok := recv.(*types.Named)
	if !ok {
		return ""
	}

	// Go elides type arguments and parenthesizes a pointer receiver.
	typeName := named.Obj().Name()
	if named.TypeParams().Len() != 0 || named.TypeArgs().Len() != 0 {
		typeName += "[...]"
	}
	if pointer {
		typeName = "(*" + typeName + ")"
	}
	return goRuntimePackageName(method.Pkg()) + "." + typeName + "." + method.Name() + "-fm"
}

// goRuntimePackageName returns the package qualifier of Go runtime function
// names: the import path, or main for the main package.
func goRuntimePackageName(pkg *types.Package) string {
	if pkg.Name() == "main" {
		return "main"
	}
	return pkg.Path()
}

// lowerOverrideVariadicFunctionValue returns value, the value of a variadic
// function of an override package, as a function that takes its variadic
// arguments as a slice, as the values of Go functions do, and passes them to
// the function as the rest arguments that its TypeScript signature takes. It
// reports false for any other value.
func (o *LoweringOwner) lowerOverrideVariadicFunctionValue(ctx lowerFileContext, expr ast.Expr, value string) (string, bool) {
	// Only a reference to a plain variadic function of an override package
	// takes rest arguments.
	expr = unwrapParenExpr(expr)
	switch expr.(type) {
	case *ast.Ident, *ast.SelectorExpr:
	default:
		return "", false
	}
	fn := calledFunction(ctx.semPkg.source, expr)
	if fn == nil || !o.callUsesOverridePackage(ctx, expr) {
		return "", false
	}
	signature := fn.Signature()
	if !signature.Variadic() || signature.Recv() != nil || signature.TypeParams().Len() > 0 {
		return "", false
	}

	// The wrapper spreads the slice of variadic arguments after the others.
	params := make([]string, 0, signature.Params().Len())
	args := make([]string, 0, signature.Params().Len())
	for idx := range signature.Params().Len() {
		name := "__goscriptArg" + strconv.Itoa(idx)
		params = append(params, name+": "+o.tsTypeFor(ctx, signature.Params().At(idx).Type()))
		args = append(args, name)
	}
	args[len(args)-1] = "...(" + args[len(args)-1] + " ?? [])"
	return "((__goscriptFn: typeof " + value + ") => (" + strings.Join(params, ", ") + ") => __goscriptFn(" +
		strings.Join(args, ", ") + "))(" + value + ")", true
}

// lowerOverrideFunctionValue adapts a function of an override package with a
// non-empty interface parameter, used as a value of a function type. A direct
// call converts each such argument with pointerValueOrNil, because the
// override takes the pointed-to value of a pointer and excludes null from its
// parameter type, so the function value converts its arguments in the same
// way. A method value or a variadic or generic function is only typed as the
// target function type. It reports false when expr is not such a function.
func (o *LoweringOwner) lowerOverrideFunctionValue(
	ctx lowerFileContext,
	expr ast.Expr,
	targetType types.Type,
	value string,
) (string, bool) {
	// Only a named function reference to a function type can be adapted.
	target := signatureForType(targetType)
	if target == nil {
		return "", false
	}
	expr = unwrapParenExpr(expr)
	switch expr.(type) {
	case *ast.Ident, *ast.SelectorExpr, *ast.IndexExpr, *ast.IndexListExpr:
	default:
		return "", false
	}

	// Find an override function with an interface parameter.
	fn := calledFunction(ctx.semPkg.source, expr)
	if fn == nil || !o.callUsesOverridePackage(ctx, expr) {
		return "", false
	}
	signature := fn.Signature()
	params := signature.Params()
	if !slices.ContainsFunc(slices.Collect(params.Variables()), func(param *types.Var) bool {
		return isNonEmptyInterfaceType(param.Type())
	}) {
		return "", false
	}

	// Only a plain function can be wrapped parameter by parameter.
	if signature.Recv() != nil || signature.Variadic() || signature.TypeParams().Len() > 0 ||
		target.Params().Len() != params.Len() {
		return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")", true
	}

	// Wrap the function, converting each interface argument.
	wrapperParams := make([]string, 0, params.Len())
	args := make([]string, 0, params.Len())
	for idx := range params.Len() {
		name := "__goscriptArg" + strconv.Itoa(idx)
		wrapperParams = append(wrapperParams, name+": "+o.tsTypeFor(ctx, target.Params().At(idx).Type()))
		if isNonEmptyInterfaceType(params.At(idx).Type()) {
			name = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValueOrNil) + "(" + name + ")!"
		}
		args = append(args, name)
	}
	return "((__goscriptFn: typeof " + value + ") => (" + strings.Join(wrapperParams, ", ") + ") => __goscriptFn(" +
		strings.Join(args, ", ") + "))(" + value + ")", true
}

// lowerNumberIntegerConstantExpr lowers an integer constant stored into a
// number-represented integer type as its plain literal. Go rejects a constant
// its type cannot represent, so a $.int/$.uint width helper cannot change the
// value. Literals also keep large constant tables cheap: JavaScriptCore gives
// each call element of an array literal its own register, so a generated
// parser table of helper calls overflows a worker stack when its module loads.
func lowerNumberIntegerConstantExpr(ctx lowerFileContext, expr ast.Expr, targetType types.Type) (string, bool) {
	if !isIntegerType(targetType) || isBigIntBackedType(targetType) {
		return "", false
	}
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return "", false
	}
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	if !ok || tv.Value == nil || tv.Value.Kind() != constant.Int || constant.BitLen(tv.Value) > 53 {
		return "", false
	}
	return lowerConstantValue(tv.Value)
}

func lowerRealNumericConstantExpr(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return "", false
	}
	if _, ok := objectForValueExpr(ctx, expr).(*types.Const); !ok {
		return "", false
	}
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	if !ok || tv.Value == nil {
		return "", false
	}
	switch tv.Value.Kind() {
	case constant.Int:
		if constant.BitLen(tv.Value) <= 53 {
			return "", false
		}
		return lowerConstantValue(tv.Value)
	default:
		return "", false
	}
}

func (o *LoweringOwner) lowerNumericConstantExprForTarget(ctx lowerFileContext, expr ast.Expr, targetType types.Type) (string, bool) {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return "", false
	}
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	if ok && tv.Value != nil {
		if isFloat32Type(targetType) {
			if value, ok := lowerRealNumericConstantExpr(ctx, expr); ok {
				return "globalThis.Math.fround(" + value + ")", true
			}
		}
		if isBigIntBackedType(targetType) && tv.Value.Kind() == constant.Int {
			return tv.Value.ExactString() + "n", true
		}
		if bits, ok := unsignedIntegerBits(targetType); ok && bits >= 64 {
			if value, ok := lowerWideIntegerConstantValue(tv.Value); ok {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) + "(" +
					strconv.Quote(value) + ", 64)", true
			}
		}
		if bits, ok := signedIntegerBits(targetType); ok && bits >= 64 {
			if value, ok := lowerWideIntegerConstantValue(tv.Value); ok {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" +
					strconv.Quote(value) + ", 64)", true
			}
		}
	}
	return lowerRealNumericConstantExpr(ctx, expr)
}

// numericConversionKeepsLiteral reports whether a conversion to a named
// number-represented integer type may keep the operand's already-lowered
// literal text instead of wrapping it in a runtime width helper. It holds when
// the operand is a small integer literal (not a named-const reference) and the
// target is a named integer type whose representation is a JS number: the value
// already fits, so $.int/$.uint normalization would add noise, and unlike a
// builtin int the named literal type does not need widening. Bigint-backed
// targets are excluded because they require BigInt conversion.
func (o *LoweringOwner) numericConversionKeepsLiteral(ctx lowerFileContext, expr ast.Expr, targetType types.Type) bool {
	if namedNonStructType(targetType) == nil || !isIntegerType(targetType) || isBigIntBackedType(targetType) {
		return false
	}
	if _, ok := objectForValueExpr(ctx, expr).(*types.Const); ok {
		return false
	}
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	return ok && tv.Value != nil && tv.Value.Kind() == constant.Int && constant.BitLen(tv.Value) <= 53
}

func isRealNumericConstantExpr(ctx lowerFileContext, expr ast.Expr) bool {
	if ctx.semPkg != nil && ctx.semPkg.source != nil {
		if tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]; ok && tv.Value != nil {
			switch tv.Value.Kind() {
			case constant.Int, constant.Float:
				return true
			}
		}
	}
	switch typed := expr.(type) {
	case *ast.BasicLit:
		return typed.Kind == token.INT || typed.Kind == token.FLOAT || typed.Kind == token.CHAR
	case *ast.UnaryExpr:
		return (typed.Op == token.ADD || typed.Op == token.SUB) && isRealNumericConstantExpr(ctx, typed.X)
	default:
		return false
	}
}

// lowerPrefixUnaryExpr preserves Go's identity plus and separates repeated signs.
func lowerPrefixUnaryExpr(op token.Token, value string) string {
	// JavaScript unary plus converts to number and rejects bigint operands.
	if op == token.ADD {
		return value
	}
	prefix := op.String()
	if op == token.SUB && strings.HasPrefix(value, "-") {
		return prefix + "(" + value + ")"
	}
	return prefix + value
}

func (o *LoweringOwner) lowerValueForTargetTypes(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
	cloneStructValue bool,
) string {
	if targetType == nil || sourceType == nil {
		return value
	}
	if isFunctionType(targetType) && isUntypedNilType(sourceType) {
		return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")"
	}
	if isBuiltinErrorType(targetType) {
		if wrapper := o.lowerPrimitiveErrorWrapper(ctx, sourceType, value); wrapper != "" {
			return wrapper
		}
	}
	if wrapper := o.lowerNumericInterfaceWrapper(targetType, sourceType, value); wrapper != "" {
		return wrapper
	}
	if wrapper := o.lowerTypeParamPointerInterfaceValue(ctx, targetType, sourceType, value); wrapper != "" {
		return wrapper
	}
	if isInterfaceType(targetType) && isStructValueType(sourceType) {
		if cloneStructValue {
			value = o.lowerStructCloneOf(sourceType, value)
		}
		if wrapper := o.lowerNamedValueInterfaceWrapper(ctx, targetType, sourceType, value); wrapper != "" {
			return wrapper
		}
		// A named struct value is boxed by structInterfaceValue, which may
		// copy it into a box of its class.
		if namedStructType(sourceType) != nil && !typeContainsTypeParam(sourceType) {
			return o.lowerInterfaceValueCall(ctx, RuntimeHelperStructInterfaceValue, targetType, sourceType, value, o.overrideTypeInfo(ctx, sourceType, o.runtimeTypeInfoExpr(sourceType)))
		}
		return o.lowerInterfaceValueExpr(ctx, targetType, sourceType, value)
	}
	if wrapper := o.lowerNamedValueInterfaceWrapper(ctx, targetType, sourceType, value); wrapper != "" {
		return wrapper
	}
	if wrapper := o.lowerNamedBasicInterfaceBox(ctx, targetType, sourceType, value); wrapper != "" {
		return wrapper
	}

	// An array is copied into the interface, which carries its type, so that
	// reflection sees its length, element type and name.
	if isInterfaceType(targetType) && !isInterfaceType(sourceType) && isArrayType(sourceType) {
		if cloneStructValue {
			value = o.runtimeOwner.QualifiedHelper(RuntimeHelperCloneArrayValue) + "(" + value + ", " + o.runtimeTypeInfoExpr(sourceType) + ")"
		}
		return o.lowerInterfaceValueExpr(ctx, targetType, sourceType, value)
	}

	if isInterfaceType(targetType) && !isInterfaceType(sourceType) && isNilableType(sourceType) {
		return o.lowerInterfaceValueExpr(ctx, targetType, sourceType, value)
	}
	if isInterfaceType(targetType) && isInterfaceType(sourceType) &&
		!types.Identical(targetType, sourceType) && types.AssignableTo(sourceType, targetType) {
		return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")"
	}

	// An unnamed struct assigned to a named struct type becomes a value of
	// the named type.
	if value, ok := o.lowerUnnamedToNamedStruct(ctx, targetType, sourceType, value); ok {
		return value
	}
	if isStructValueType(targetType) && cloneStructValue {
		return o.lowerStructCloneOf(targetType, value)
	}
	// Arrays retain value semantics at assignment, argument, and return boundaries.
	if isArrayType(targetType) && isArrayType(sourceType) && cloneStructValue {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperCloneArrayValue) + "(" + value + ", " + o.runtimeTypeInfoExpr(sourceType) + ")"
	}
	if isIntegerType(targetType) && isIntegerType(sourceType) {
		if isBigIntBackedType(targetType) {
			if isBigIntBackedType(sourceType) {
				return value
			}
			helper := RuntimeHelperInt64
			if _, ok := unsignedIntegerBits(targetType); ok {
				helper = RuntimeHelperUint64
			}
			return o.runtimeOwner.QualifiedHelper(helper) + "(" + value + ")"
		}
		if isBasicFixedWideIntegerType(targetType) {
			if bits, ok := unsignedIntegerBits(targetType); ok {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) +
					"(" + value + ", " + strconv.Itoa(bits) + ")"
			}
			if _, ok := signedIntegerBits(targetType); ok {
				return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) + "(" + value + ")"
			}
		}
		if bits, ok := unsignedIntegerBits(targetType); ok && bits < 64 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperUint) +
				"(" + value + ", " + strconv.Itoa(bits) + ")"
		}
		if bits, ok := signedIntegerBits(targetType); ok && bits < 64 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperInt) +
				"(" + value + ", " + strconv.Itoa(bits) + ")"
		}
	}
	if named := namedNonStructType(targetType); named != nil {
		if _, ok := named.Underlying().(*types.Slice); ok {
			return "(" + value + " as " + o.tsTypeFor(ctx, targetType) + ")"
		}
	}
	return value
}

// lowerTypeParamPointerInterfaceValue converts a pointer to a value of a type
// parameter in scope to an interface using the runtime type argument, so that
// the interface value has the method set of a pointer to the type argument.
func (o *LoweringOwner) lowerTypeParamPointerInterfaceValue(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
) string {
	// Only an interface target that is not itself a type parameter boxes the
	// pointer.
	if _, ok := types.Unalias(targetType).(*types.TypeParam); ok || !isInterfaceType(targetType) {
		return ""
	}
	ptr, ok := types.Unalias(sourceType).(*types.Pointer)
	if !ok {
		return ""
	}
	typeParam, ok := types.Unalias(ptr.Elem()).(*types.TypeParam)
	if !ok || !typeParamInScope(ctx, typeParam) {
		return ""
	}
	helper := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeParamPointerInterfaceValue)
	if target := o.tsTypeFor(ctx, targetType); target != "any" {
		helper += "<" + target + ">"
	}
	return helper + "(" + value + ", __typeArgs?.[" + strconv.Quote(typeParam.Obj().Name()) + "], " +
		strconv.Quote(goRuntimeTypeString(sourceType)) + ", " + o.runtimeTypeAssertInfoExpr(ctx, sourceType) + ")"
}

func (o *LoweringOwner) lowerInterfaceValueExpr(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
) string {
	// Type parameters in scope, such as E in []E, resolve from the runtime
	// type arguments, so that reflection sees the instantiated type rather
	// than an empty interface, and the value's dynamic type is named by it.
	if typeContainsTypeParam(sourceType) {
		return o.lowerInterfaceValueCall(ctx, RuntimeHelperGenericInterfaceValue, targetType, sourceType, value, o.runtimeTypeAssertInfoExpr(ctx, sourceType))
	}
	return o.lowerInterfaceValueCall(ctx, RuntimeHelperInterfaceValue, targetType, sourceType, value, o.overrideTypeInfo(ctx, sourceType, o.runtimeTypeInfoExpr(sourceType)))
}

// lowerInterfaceValueCall calls helper, an interfaceValue helper, to convert
// value to an interface with the type of sourceType, described by typeInfo.
func (o *LoweringOwner) lowerInterfaceValueCall(
	ctx lowerFileContext,
	helper RuntimeHelper,
	targetType types.Type,
	sourceType types.Type,
	value string,
	typeInfo string,
) string {
	// The helper names the target type when it is narrower than any.
	call := o.runtimeOwner.QualifiedHelper(helper)
	if target := o.tsTypeFor(ctx, targetType); target != "any" {
		call += "<" + target + ">"
	}
	return call + "(" + value + ", " +
		strconv.Quote(goRuntimeTypeString(sourceType)) + ", " +
		typeInfo + ")"
}

// overrideTypeInfo returns typeInfo, the type information of a value of
// sourceType converted to an interface. A struct or interface type of an
// override package, or a pointer to one, is registered by its hand-written
// TypeScript, whose method signatures may be missing or inexact, so the type
// information also gives them, from the Go types, for reflection.
func (o *LoweringOwner) overrideTypeInfo(ctx lowerFileContext, sourceType types.Type, typeInfo string) string {
	// Only a named struct or interface type of an override package, or a
	// pointer to one, is described.
	named, _ := types.Unalias(derefPointerType(sourceType)).(*types.Named)
	if named == nil || !o.typeUsesOverride(named) || named.TypeParams().Len() != 0 {
		return typeInfo
	}
	var signatures []string
	switch underlying := named.Underlying().(type) {
	case *types.Struct:
		signatures = o.overrideStructMethodSignatures(named)
	case *types.Interface:
		// Unexported methods are left out, as hand-written values may not
		// have them.
		for method := range underlying.Methods() {
			if method.Exported() {
				signatures = append(signatures, o.runtimeMethodSignature(method, make(map[types.Type]bool)))
			}
		}
	}
	if len(signatures) == 0 {
		return typeInfo
	}

	// The signatures are given once per file.
	return o.hoistStatic(ctx, o.runtimeOwner.QualifiedHelper(RuntimeHelperOverrideTypeMethods)+"("+typeInfo+", "+
		strconv.Quote(runtimeNamedTypeName(named))+", () => ["+strings.Join(signatures, ", ")+"])")
}

// overrideStructMethodSignatures describes the exported methods of the method
// set of a pointer to named, marking those not in the value's method set.
func (o *LoweringOwner) overrideStructMethodSignatures(named *types.Named) []string {
	methodSet := types.NewMethodSet(types.NewPointer(named))
	valueMethods := types.NewMethodSet(named)
	signatures := make([]string, 0, methodSet.Len())
	for selection := range methodSet.Methods() {
		method, _ := selection.Obj().(*types.Func)
		if method == nil || !method.Exported() {
			continue
		}
		pointerOnly := valueMethods.Lookup(method.Pkg(), method.Name()) == nil
		signatures = append(signatures, o.runtimeReceiverMethodSignature(method, pointerOnly, make(map[types.Type]bool)))
	}
	return signatures
}

func (o *LoweringOwner) lowerNumericInterfaceWrapper(
	targetType types.Type,
	sourceType types.Type,
	value string,
) string {
	if targetType == nil || sourceType == nil || !isInterfaceType(targetType) || isInterfaceType(sourceType) {
		return ""
	}
	basic, ok := types.Unalias(sourceType).(*types.Basic)
	if !ok || basic.Info()&types.IsNumeric == 0 || basic.Info()&types.IsUntyped != 0 {
		return ""
	}
	typeName := goRuntimeTypeString(sourceType)
	args := value + ", " + strconv.Quote(typeName)
	if runtimeName := basicRuntimeName(basic); runtimeName != typeName {
		args += ", " + strconv.Quote(runtimeName)
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperBasicInterfaceValue) + "(" + args + ")"
}

func isBasicFixedWideIntegerType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).(*types.Basic)
	if !ok {
		return false
	}
	switch basic.Kind() {
	case types.Int64, types.Uint64, types.Uintptr:
		return true
	default:
		return false
	}
}

// lowerGenericInstance returns expr, which makes a new instance of named,
// marked with the methods of its type (see genericInstanceMethodsExpr) when
// named is an instantiated generic struct type, so that reflect can call
// them, or expr itself otherwise.
func (o *LoweringOwner) lowerGenericInstance(ctx lowerFileContext, named *types.Named, expr string) string {
	methods := o.genericInstanceMethodsExpr(ctx, named)
	if methods == "" {
		return expr
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericInstance) + "(" + expr + ", " + methods + ")"
}

// genericInstanceMethodsExpr returns a function that describes the methods
// of a pointer to named, an instantiated generic struct type, as the method
// table that boxes it in an interface and the signatures of its methods, or
// "" if named has no methods that take type arguments.
func (o *LoweringOwner) genericInstanceMethodsExpr(ctx lowerFileContext, named *types.Named) string {
	// Only an instance of a compiled generic struct type with such methods
	// has them: the classes of override packages are written by hand.
	if named == nil || named.TypeArgs().Len() == 0 || namedStructType(named) == nil || o.typeUsesOverride(named.Origin()) {
		return ""
	}

	// The method table is the one that boxes a pointer to the instance in an
	// interface.
	pointer := types.NewPointer(named)
	if !genericMethodSetHasReceiverTypeParams(pointer) {
		return ""
	}
	methods := o.genericMethodDescriptorsForType(ctx, named, pointer, make(map[types.Type]bool))
	if methods == "" {
		return ""
	}

	// The signatures mark the methods that only a pointer has.
	valueMethods := types.NewMethodSet(named)
	var signatures []string
	for selection := range types.NewMethodSet(pointer).Methods() {
		if method, _ := selection.Obj().(*types.Func); method != nil {
			pointerOnly := valueMethods.Lookup(method.Pkg(), method.Name()) == nil
			signatures = append(signatures, o.genericInstanceMethodSignature(ctx, method, pointerOnly))
		}
	}
	describe := "[" + methods + ", [" + strings.Join(signatures, ", ") + "]]"

	// Without type parameters, the description is the same each time, so it
	// is made once, by the getter of a static.
	if typeIsHoistable(pointer) {
		if getter, ok := strings.CutSuffix(o.hoistStatic(ctx, describe), "()"); ok {
			return getter
		}
	}
	return "() => " + describe
}

// genericInstanceMethodSignature describes method, a method of the method
// set of a pointer to an instantiated generic struct type, as
// runtimeReceiverMethodSignature does, with the types of its parameters and
// results that are type parameters given by their type arguments.
func (o *LoweringOwner) genericInstanceMethodSignature(ctx lowerFileContext, method *types.Func, pointerOnly bool) string {
	// Each parameter and result is described in the context of the code.
	signature, _ := method.Type().(*types.Signature)
	describe := func(tuple *types.Tuple) string {
		var infos []string
		for v := range tuple.Variables() {
			infos = append(infos, o.runtimeTypeAssertInfoExprWithSeen(ctx, v.Type(), make(map[types.Type]bool)))
		}
		return "[" + strings.Join(infos, ", ") + "]"
	}

	// The flags are positional, as for methodSignature.
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMethodSignature) + "(" + strconv.Quote(method.Name()) + ", " +
		describe(signature.Params()) + ", " + describe(signature.Results()) + ", " +
		strconv.FormatBool(pointerOnly) + ", " + strconv.FormatBool(signature.Variadic()) + ")"
}

func (o *LoweringOwner) lowerNamedValueInterfaceWrapper(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
) string {
	if targetType == nil || sourceType == nil {
		return ""
	}
	if !isInterfaceType(targetType) || isInterfaceType(sourceType) {
		return ""
	}
	targetInterface, _ := types.Unalias(targetType).Underlying().(*types.Interface)
	if targetInterface == nil || !types.Implements(sourceType, targetInterface) {
		return ""
	}
	targetGeneric := genericMethodSetHasReceiverTypeParams(targetType)
	receiver, methodSetType := namedNonStructMethodSetType(sourceType)
	if receiver == nil {
		receiver, methodSetType = genericMethodSetDescriptorTarget(sourceType)
		if receiver == nil ||
			(!genericMethodSetHasReceiverTypeParams(methodSetType) && !targetGeneric) {
			return ""
		}
	}
	methods := o.genericMethodDescriptorsForType(ctx, receiver, methodSetType, make(map[types.Type]bool))
	if methods == "" {
		return ""
	}
	signatures := o.genericMethodSignatureDescriptors(methodSetType)
	if signatures == "" {
		return ""
	}
	typeInfo := o.runtimeTypeInfoExpr(sourceType)

	// Without type parameters, the method table, type info and method
	// signatures of the type are the same each time, so they are created once.
	hoistable := typeIsHoistable(sourceType) && typeIsHoistable(targetType)
	if hoistable {
		methods = o.hoistStatic(ctx, methods)
		typeInfo = o.hoistStatic(ctx, typeInfo)
		signatures = o.hoistStatic(ctx, signatures)
	}
	boxed := o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedValueInterfaceValue) +
		"<" + o.tsTypeFor(ctx, targetType) + ">(" + value + ", " +
		strconv.Quote(goRuntimeTypeString(sourceType)) + ", " + methods + ", " +
		typeInfo + ", " + signatures + ")"

	// A constant, such as a bit flag passed to HasFlag, is boxed once: a box
	// is never changed, so every use can share it.
	if hoistable && isLiteralValueText(value) {
		return o.hoistStatic(ctx, boxed)
	}
	return boxed
}

// isLiteralValueText reports whether value is the lowered text of a boolean,
// number, bigint or string literal, whose evaluation has no effects and gives
// the same value each time.
func isLiteralValueText(value string) bool {
	// Booleans and numbers are matched by their text.
	if value == "true" || value == "false" || numericLiteralPattern.MatchString(value) {
		return true
	}

	// A string literal is a quoted Go string.
	_, err := strconv.Unquote(value)
	return err == nil && strings.HasPrefix(value, `"`)
}

// lowerNamedBasicInterfaceBox boxes a value of a named basic type, or of a
// type parameter that may be one, converted to an interface type, so that its
// Go type is known to type assertions and type switches. A raw primitive in an
// interface has an unnamed basic type. Named basic types with methods for the
// target interface are boxed by lowerNamedValueInterfaceWrapper.
func (o *LoweringOwner) lowerNamedBasicInterfaceBox(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
) string {
	if targetType == nil || sourceType == nil || !isInterfaceType(targetType) {
		return ""
	}
	if _, ok := types.Unalias(targetType).(*types.TypeParam); ok {
		return ""
	}

	// A type parameter value is boxed at runtime from its type argument.
	if typeParam, ok := types.Unalias(sourceType).(*types.TypeParam); ok {
		if !typeParamInScope(ctx, typeParam) {
			return ""
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeParamInterfaceValue) +
			"<" + o.tsTypeFor(ctx, targetType) + ">(" +
			value + ", " + o.genericTypeDescriptorExpr(ctx, sourceType) + ")"
	}

	// A named basic value is boxed with its type and no methods.
	if isInterfaceType(sourceType) {
		return ""
	}
	named, ok := types.Unalias(sourceType).(*types.Named)
	if !ok || named.Obj() == nil {
		return ""
	}
	if _, ok := named.Underlying().(*types.Basic); !ok {
		return ""
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedValueInterfaceValue) +
		"<" + o.tsTypeFor(ctx, targetType) + ">(" + value + ", " +
		strconv.Quote(goRuntimeTypeString(sourceType)) + ", {}, " +
		o.runtimeTypeInfoExpr(sourceType) + ")"
}

func (o *LoweringOwner) lowerPrimitiveErrorWrapper(ctx lowerFileContext, sourceType types.Type, value string) string {
	named, _ := types.Unalias(sourceType).(*types.Named)
	if named == nil || named.Obj() == nil {
		return ""
	}
	if _, ok := types.Unalias(named.Underlying()).(*types.Basic); !ok {
		return ""
	}
	errorType, _ := types.Universe.Lookup("error").Type().Underlying().(*types.Interface)
	if errorType == nil || !types.Implements(named, errorType) {
		return ""
	}
	method, _, _ := types.LookupFieldOrMethod(named, true, named.Obj().Pkg(), "Error")
	fn, _ := method.(*types.Func)
	if fn == nil {
		return ""
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperNamedValueInterfaceValue) +
		"<$.GoError>(" + value + ", " + strconv.Quote(goRuntimeTypeString(sourceType)) +
		", {\"Error\": " + o.methodFunctionExpr(ctx, named, fn, "Error") + "}, " +
		o.runtimeTypeInfoExpr(sourceType) + ")"
}

// lowerUnnamedToNamedStruct copies value, an unnamed struct value assigned to
// a generated struct class of the same underlying type, into a new value of
// that class, so that the target has the methods and representation of its
// type.
func (o *LoweringOwner) lowerUnnamedToNamedStruct(
	ctx lowerFileContext,
	targetType types.Type,
	sourceType types.Type,
	value string,
) (string, bool) {
	// Only an unnamed struct assigned to a generated class is rebuilt.
	target := namedStructType(targetType)
	if _, unnamed := types.Unalias(sourceType).(*types.Struct); !unnamed || !o.isGeneratedStructClass(target) {
		return "", false
	}

	// A positional class takes a copy of each field of the value.
	if o.hasGeneratedClone(target) {
		structType := target.Underlying().(*types.Struct)
		values := make([]string, structType.NumFields())
		for idx := range structType.NumFields() {
			field := structType.Field(idx)
			values[idx] = o.lowerFieldValueCopy(field.Type(), "__goscriptSource."+tsStructFieldName(field.Name(), idx))
		}
		return "((__goscriptSource) => " + o.lowerPositionalStructExpr(ctx, target, true, values) + ")(" + value + ")", true
	}

	// The class constructor copies the fields of its init value.
	return o.lowerGenericInstance(ctx, target, "new "+o.namedTypeExpr(ctx, target)+"("+value+", true)"), true
}

func (o *LoweringOwner) lowerStructClone(value string) string {
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(" +
		o.runtimeOwner.QualifiedHelper(RuntimeHelperCloneStructValue) + "(" + value + "))"
}

// lowerStructCloneOf copies value, a struct value of type typ. A value of a
// generated struct class is copied by its own clone method, which returns a
// marked struct value, so that each copy site calls one known method.
func (o *LoweringOwner) lowerStructCloneOf(typ types.Type, value string) string {
	if o.hasGeneratedClone(namedStructType(typ)) {
		return "(" + value + ").clone()"
	}
	return o.lowerStructClone(value)
}

// isGeneratedStructClass reports whether named is a non-generic package-level
// struct type that the compiler emits as a positional class: its constructor
// takes the struct value marker and then the field values in field order, and
// its copy method is named clone.
func (o *LoweringOwner) isGeneratedStructClass(named *types.Named) bool {
	// A named, non-generic type.
	if named == nil || named.TypeParams().Len() != 0 || named.TypeArgs().Len() != 0 {
		return false
	}
	return o.hasGeneratedClassShape(named)
}

// hasGeneratedClone reports whether a struct value of type named is copied by
// the clone method of its generated positional class: a generated struct
// class (see isGeneratedStructClass), or an instance of a generic struct type
// whose class has the same shape, whose clone method copies the fields of
// type parameter types by their values at run time.
func (o *LoweringOwner) hasGeneratedClone(named *types.Named) bool {
	if named == nil || named.TypeArgs().Len() == 0 {
		return o.isGeneratedStructClass(named)
	}
	return o.hasGeneratedClassShape(named.Origin())
}

// hasGeneratedClassShape reports whether named, which may be generic, is a
// struct type declared at package level in Go source whose class has the
// clone method, which no field or method of its own takes the name of.
func (o *LoweringOwner) hasGeneratedClassShape(named *types.Named) bool {
	// A named type declared at package level in Go source.
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false
	}
	pkg := named.Obj().Pkg()
	if named.Obj().Parent() != pkg.Scope() || o.overrideFacts().HasPackage(pkg.Path()) {
		return false
	}

	// A struct that declares no clone or protobuf field.
	structType, ok := named.Underlying().(*types.Struct)
	if !ok {
		return false
	}
	for idx := range structType.NumFields() {
		if structType.Field(idx).Name() == "clone" || strings.Contains(structType.Tag(idx), "protobuf") {
			return false
		}
	}

	// A struct with no clone method of its own.
	methods := types.NewMethodSet(types.NewPointer(named))
	for selection := range methods.Methods() {
		if selection.Obj().Name() == "clone" {
			return false
		}
	}
	return true
}

// lowerNewStructValue returns the zero struct value of a generated struct
// class.
func (o *LoweringOwner) lowerNewStructValue(ctx lowerFileContext, named *types.Named) string {
	return o.lowerGenericInstance(ctx, named, "new "+o.namedTypeExpr(ctx, named)+"(true)")
}

func (o *LoweringOwner) lowerNamedStructZeroValueExpr(
	ctx lowerFileContext,
	named *types.Named,
) string {
	// A struct that is not an instance has its zero values already.
	name := o.namedTypeExpr(ctx, named)
	if named.TypeArgs().Len() == 0 {
		return "new " + name + "()"
	}

	// A positional class takes the zero values of the type parameter fields
	// of an instance in field order.
	if o.hasGeneratedClone(named) {
		return o.lowerPositionalStructExpr(ctx, named, false, o.genericStructFieldZeros(ctx, named))
	}

	// The zero values of the type parameter fields of an instance are
	// passed in, as fresh values that the constructor need not copy.
	structType := named.Underlying().(*types.Struct)
	originType, _ := named.Origin().Underlying().(*types.Struct)
	fields := make([]string, 0, structType.NumFields())
	fresh := false
	for idx := range structType.NumFields() {
		if !genericStructFieldNeedsInstantiatedZero(named, idx) {
			continue
		}
		field := structType.Field(idx)
		fields = append(
			fields,
			tsStructFieldName(field.Name(), idx)+": "+
				o.lowerDeclarationZeroValueExpr(ctx, field.Type()),
		)
		fresh = fresh || (typeParamMayHoldValueType(originType.Field(idx).Type()) && !o.typeUsesOverride(named.Origin()))
	}

	// A struct without such fields has its zero values already.
	if len(fields) == 0 {
		return o.lowerGenericInstance(ctx, named, "new "+name+"()")
	}
	if fresh {
		return o.lowerGenericInstance(ctx, named, "new "+name+"({"+strings.Join(fields, ", ")+"}, undefined, true)")
	}
	return o.lowerGenericInstance(ctx, named, "new "+name+"({"+strings.Join(fields, ", ")+"})")
}

// genericStructFieldZeros returns the zero value of each field of named, an
// instance of a generic struct type, that is of a type parameter type, and
// an empty value for each other field.
func (o *LoweringOwner) genericStructFieldZeros(ctx lowerFileContext, named *types.Named) []string {
	structType := named.Underlying().(*types.Struct)
	values := make([]string, structType.NumFields())
	for idx := range structType.NumFields() {
		if genericStructFieldNeedsInstantiatedZero(named, idx) {
			values[idx] = o.lowerDeclarationZeroValueExpr(ctx, structType.Field(idx).Type())
		}
	}
	return values
}

// lowerFieldValueCopy returns a copy of value, a value of typ stored in a
// field, for a positional constructor, which keeps the values it takes.
func (o *LoweringOwner) lowerFieldValueCopy(typ types.Type, value string) string {
	switch {
	case isStructValueType(typ):
		return o.lowerStructCloneOf(typ, value)
	case isArrayType(typ):
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperCloneArrayValue) + "(" + value + ", " + o.runtimeTypeInfoExpr(typ) + ")"
	case typeParamMayHoldValueType(typ):
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperCopyElement) + "(" + value + ")"
	default:
		return value
	}
}

func genericStructFieldNeedsInstantiatedZero(named *types.Named, idx int) bool {
	if named.TypeArgs().Len() == 0 {
		return false
	}
	originType, ok := named.Origin().Underlying().(*types.Struct)
	if !ok || idx >= originType.NumFields() {
		return false
	}
	_, ok = types.Unalias(originType.Field(idx).Type()).(*types.TypeParam)
	return ok
}

func (o *LoweringOwner) lowerZeroValueExprFor(ctx lowerFileContext, typ types.Type) string {
	if named := namedStructType(typ); named != nil && isStructValueType(typ) {
		if !o.canSpellNamedType(ctx, named) {
			return "undefined as any"
		}
		if o.isGeneratedStructClass(named) {
			return o.lowerNewStructValue(ctx, named)
		}
		if o.hasGeneratedClone(named) {
			return o.lowerPositionalStructExpr(ctx, named, true, o.genericStructFieldZeros(ctx, named))
		}
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) +
			"(" + o.lowerNamedStructZeroValueExpr(ctx, named) + ")"
	}

	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		if typed.Kind() == types.UnsafePointer {
			return "null"
		}
		if typed.Info()&types.IsComplex != 0 {
			return o.runtimeOwner.QualifiedHelper(RuntimeHelperComplex) + "(0, 0)"
		}
		if typed.Info()&types.IsBoolean != 0 {
			return "false"
		}
		if typed.Info()&types.IsString != 0 {
			return "\"\""
		}
		if typed.Info()&types.IsNumeric != 0 {
			switch typed.Kind() {
			case types.Int64, types.Uint64:
				return "0n"
			}
			return "0"
		}
		return "undefined"
	case *types.Array:
		if isByteType(typed.Elem()) {
			return o.lowerArrayValue("new Uint8Array("+strconv.FormatInt(typed.Len(), 10)+")", typed)
		}
		elem := o.lowerZeroValueExprFor(ctx, typed.Elem())
		return o.lowerArrayValue("globalThis.Array.from({ length: "+strconv.FormatInt(typed.Len(), 10)+" }, () => "+arrowBodyExpr(elem)+")", typed)
	case *types.Struct:
		return o.lowerAnonymousStructValue(anonymousStructZeroValueExpr(typed, func(fieldType types.Type) string {
			return o.lowerZeroValueExprFor(ctx, fieldType)
		}), typed)
	default:
		return "null"
	}
}

func (o *LoweringOwner) lowerDeclarationZeroValueExpr(ctx lowerFileContext, typ types.Type) string {
	if isFunctionType(typ) {
		return "null! as " + o.tsFunctionZeroValueTypeFor(ctx, typ)
	}
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if !ok {
		value := o.lowerZeroValueExprFor(ctx, typ)
		if value == "null" {
			return "null! as " + o.tsTypeFor(ctx, typ)
		}
		return value
	}
	if !typeParamInScope(ctx, typeParam) {
		return zeroValueExpr(typ)
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericZero) +
		"(__typeArgs, " + strconv.Quote(typeParam.Obj().Name()) + ", " + zeroValueExpr(typ) + ")"
}

func (o *LoweringOwner) tsFunctionZeroValueTypeFor(ctx lowerFileContext, typ types.Type) string {
	if signature := unnamedSignatureForType(typ); signature != nil {
		return o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
	}
	return o.tsTypeFor(ctx, typ)
}

func (o *LoweringOwner) runtimeTypeInfoExpr(typ types.Type) string {
	return o.runtimeTypeInfoExprWithSeen(typ, make(map[types.Type]bool))
}

func (o *LoweringOwner) runtimeTypeAssertInfoExpr(ctx lowerFileContext, typ types.Type) string {
	return o.runtimeTypeAssertInfoExprWithSeen(ctx, typ, make(map[types.Type]bool))
}

// runtimeTypeAssertInfoExprWithSeen renders the runtime type descriptor for a
// type-assertion or type-switch target. It mirrors runtimeTypeInfoExprWithSeen
// but threads ctx so a type parameter in scope resolves to its runtime
// __typeArgs entry. Keep the two structurally in sync: the named-type checks,
// the underlying switch arms, and the leaf cases must stay parallel; the only
// intended differences are the type-parameter prefix and the ctx-threaded
// recursion.
func (o *LoweringOwner) runtimeTypeAssertInfoExprWithSeen(ctx lowerFileContext, typ types.Type, seen map[types.Type]bool) string {
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if ok && typeParamInScope(ctx, typeParam) {
		return "__typeArgs?.[" + strconv.Quote(typeParam.Obj().Name()) + "]?.type ?? " +
			o.runtimeTypeInfoExpr(typ)
	}

	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	if typ == nil {
		return "{ kind: " + typeKind + ".Basic, name: \"unknown\" }"
	}
	typeKey := types.Unalias(typ)
	if typeKey != nil {
		if seen[typeKey] {
			return o.shallowRuntimeTypeInfoExpr(typ)
		}
		seen[typeKey] = true
		defer delete(seen, typeKey)
	}
	if named := namedStructType(typ); named != nil {
		return strconv.Quote(runtimeNamedTypeName(named))
	}
	if named := namedFunctionType(typ); named != nil {
		return o.runtimeFunctionTypeAssertInfoWithSeen(ctx, named.Underlying().(*types.Signature), runtimeNamedTypeName(named), seen)
	}
	if named := namedNonStructType(typ); named != nil {
		if basic, ok := types.Unalias(named.Underlying()).(*types.Basic); ok {
			return runtimeBasicTypeInfoExpr(o.runtimeOwner.QualifiedHelper(RuntimeHelperBasicType), basic, runtimeNamedTypeName(named))
		}
		if slice, ok := types.Unalias(named.Underlying()).(*types.Slice); ok {
			return o.runtimeDescriptorExpr(RuntimeHelperSliceType, o.runtimeTypeAssertInfoExprWithSeen(ctx, slice.Elem(), seen), strconv.Quote(runtimeNamedTypeName(named)))
		}
		return strconv.Quote(runtimeNamedTypeName(named))
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		return runtimeBasicTypeInfoExpr(o.runtimeOwner.QualifiedHelper(RuntimeHelperBasicType), typed, "")
	case *types.Pointer:
		return o.runtimeDescriptorExpr(RuntimeHelperPointerType, o.runtimeTypeAssertInfoExprWithSeen(ctx, typed.Elem(), seen))
	case *types.Struct:
		return "{ kind: " + typeKind + ".Struct, methods: [], fields: " + o.runtimeStructAssertFieldsExpr(ctx, typed, seen) + " }"
	case *types.Slice:
		return o.runtimeDescriptorExpr(RuntimeHelperSliceType, o.runtimeTypeAssertInfoExprWithSeen(ctx, typed.Elem(), seen))
	case *types.Array:
		return o.runtimeDescriptorExpr(RuntimeHelperArrayType, o.runtimeTypeAssertInfoExprWithSeen(ctx, typed.Elem(), seen), strconv.FormatInt(typed.Len(), 10))
	case *types.Map:
		return o.runtimeDescriptorExpr(RuntimeHelperMapType, o.runtimeTypeAssertInfoExprWithSeen(ctx, typed.Key(), seen), o.runtimeTypeAssertInfoExprWithSeen(ctx, typed.Elem(), seen))
	case *types.Chan:
		return o.runtimeDescriptorExpr(RuntimeHelperChannelType, o.runtimeTypeAssertInfoExprWithSeen(ctx, typed.Elem(), seen), strconv.Quote(channelDirectionString(typed.Dir())))
	case *types.Interface:
		typed.Complete()
		return "{ kind: " + typeKind + ".Interface, methods: " + o.runtimeMethodAssertSignaturesWithSeen(ctx, typed, seen) + " }"
	case *types.Signature:
		return o.runtimeFunctionTypeAssertInfoWithSeen(ctx, typed, "", seen)
	default:
		return o.runtimeTypeInfoExpr(typ)
	}
}

// runtimeTypeInfoExprWithSeen renders the runtime type descriptor for typ. Keep
// it structurally in sync with runtimeTypeAssertInfoExprWithSeen.
func (o *LoweringOwner) runtimeTypeInfoExprWithSeen(typ types.Type, seen map[types.Type]bool) string {
	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	if typ == nil {
		return "{ kind: " + typeKind + ".Basic, name: \"unknown\" }"
	}
	typeKey := types.Unalias(typ)
	if typeKey != nil {
		if seen[typeKey] {
			return o.shallowRuntimeTypeInfoExpr(typ)
		}
		seen[typeKey] = true
		defer delete(seen, typeKey)
	}
	if named := namedStructType(typ); named != nil {
		return strconv.Quote(runtimeNamedTypeName(named))
	}
	if named := namedFunctionType(typ); named != nil {
		return o.runtimeFunctionTypeInfoWithSeen(named.Underlying().(*types.Signature), runtimeNamedTypeName(named), seen)
	}
	if named := namedNonStructType(typ); named != nil {
		if basic, ok := types.Unalias(named.Underlying()).(*types.Basic); ok {
			return runtimeBasicTypeInfoExpr(o.runtimeOwner.QualifiedHelper(RuntimeHelperBasicType), basic, runtimeNamedTypeName(named))
		}
		if slice, ok := types.Unalias(named.Underlying()).(*types.Slice); ok {
			return o.runtimeDescriptorExpr(RuntimeHelperSliceType, o.runtimeTypeInfoExprWithSeen(slice.Elem(), seen), strconv.Quote(runtimeNamedTypeName(named)))
		}
		return strconv.Quote(runtimeNamedTypeName(named))
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		return runtimeBasicTypeInfoExpr(o.runtimeOwner.QualifiedHelper(RuntimeHelperBasicType), typed, "")
	case *types.Pointer:
		return o.runtimeDescriptorExpr(RuntimeHelperPointerType, o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen))
	case *types.Struct:
		return "{ kind: " + typeKind + ".Struct, methods: [], fields: " + o.runtimeStructFieldsExpr(typed, seen) + " }"
	case *types.Slice:
		return o.runtimeDescriptorExpr(RuntimeHelperSliceType, o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen))
	case *types.Array:
		return o.runtimeDescriptorExpr(RuntimeHelperArrayType, o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen), strconv.FormatInt(typed.Len(), 10))
	case *types.Map:
		return o.runtimeDescriptorExpr(RuntimeHelperMapType, o.runtimeTypeInfoExprWithSeen(typed.Key(), seen), o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen))
	case *types.Chan:
		return o.runtimeDescriptorExpr(RuntimeHelperChannelType, o.runtimeTypeInfoExprWithSeen(typed.Elem(), seen), strconv.Quote(channelDirectionString(typed.Dir())))
	case *types.Interface:
		typed.Complete()
		return "{ kind: " + typeKind + ".Interface, methods: " + o.runtimeMethodSignaturesWithSeen(typed, seen) + " }"
	case *types.Signature:
		return o.runtimeFunctionTypeInfoWithSeen(typed, "", seen)
	default:
		return "{ kind: " + typeKind + ".Basic, name: \"unknown\" }"
	}
}

// runtimeDescriptorExpr keeps pure descriptor construction removable by bundlers.
func (o *LoweringOwner) runtimeDescriptorExpr(helper RuntimeHelper, args ...string) string {
	return "/* @__PURE__ */ " + o.runtimeOwner.QualifiedHelper(helper) + "(" + strings.Join(args, ", ") + ")"
}

func runtimeBasicTypeInfoExpr(helper string, basic *types.Basic, typeName string) string {
	name := "unknown"
	switch {
	case basic.Info()&types.IsBoolean != 0:
		name = "bool"
	case basic.Info()&types.IsString != 0:
		name = "string"
	case basic.Info()&types.IsNumeric != 0:
		name = basicRuntimeName(basic)
	}
	parts := []string{strconv.Quote(name)}
	if typeName != "" {
		parts = append(parts, strconv.Quote(typeName))
	}
	return "/* @__PURE__ */ " + helper + "(" + strings.Join(parts, ", ") + ")"
}

func (o *LoweringOwner) shallowRuntimeTypeInfoExpr(typ types.Type) string {
	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	switch types.Unalias(typ).Underlying().(type) {
	case *types.Interface:
		return "{ kind: " + typeKind + ".Interface, methods: [] }"
	case *types.Signature:
		return "{ kind: " + typeKind + ".Function, params: [], results: [] }"
	case *types.Pointer:
		return "{ kind: " + typeKind + ".Pointer, elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	case *types.Struct:
		return "{ kind: " + typeKind + ".Struct, methods: [], fields: [] }"
	case *types.Slice:
		return "{ kind: " + typeKind + ".Slice, elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	case *types.Array:
		return "{ kind: " + typeKind + ".Array, elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" }, length: 0 }"
	case *types.Map:
		return "{ kind: " + typeKind + ".Map, keyType: { kind: " + typeKind + ".Basic, name: \"unknown\" }, elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	case *types.Chan:
		return "{ kind: " + typeKind + ".Channel, direction: \"both\", elemType: { kind: " + typeKind + ".Basic, name: \"unknown\" } }"
	default:
		return "{ kind: " + typeKind + ".Basic, name: \"unknown\" }"
	}
}

func (o *LoweringOwner) runtimeStructFieldsExpr(structType *types.Struct, seen map[types.Type]bool) string {
	fields := make([]string, 0, structType.NumFields())
	var vars []*types.Var
	for field := range structType.Fields() {
		vars = append(vars, field)
	}
	offsets := structFieldOffsets(goScriptTypeSizes(), vars)
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fieldName := tsStructFieldName(field.Name(), idx)
		runtimeName := ""
		if fieldName != field.Name() {
			runtimeName = field.Name()
		}
		pkgPath := ""
		if !field.Exported() && field.Pkg() != nil {
			pkgPath = field.Pkg().Path()
		}
		fieldInfo := runtimeStructFieldInfoExpr(
			o.runtimeOwner.QualifiedHelper(RuntimeHelperStructField),
			o.runtimeTypeInfoExprWithSeen(field.Type(), seen),
			fieldName,
			runtimeName,
			structType.Tag(idx),
			pkgPath,
			field.Embedded(),
			[]int{idx},
			offsets[idx],
			field.Exported(),
		)
		fields = append(fields, fieldInfo)
	}
	return "[" + strings.Join(fields, ", ") + "]"
}

func (o *LoweringOwner) runtimeStructAssertFieldsExpr(ctx lowerFileContext, structType *types.Struct, seen map[types.Type]bool) string {
	fields := make([]string, 0, structType.NumFields())
	var vars []*types.Var
	for field := range structType.Fields() {
		vars = append(vars, field)
	}
	offsets := structFieldOffsets(goScriptTypeSizes(), vars)
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fieldName := tsStructFieldName(field.Name(), idx)
		runtimeName := ""
		if fieldName != field.Name() {
			runtimeName = field.Name()
		}
		pkgPath := ""
		if !field.Exported() && field.Pkg() != nil {
			pkgPath = field.Pkg().Path()
		}
		fieldInfo := runtimeStructFieldInfoExpr(
			o.runtimeOwner.QualifiedHelper(RuntimeHelperStructField),
			o.runtimeTypeAssertInfoExprWithSeen(ctx, field.Type(), seen),
			fieldName,
			runtimeName,
			structType.Tag(idx),
			pkgPath,
			field.Embedded(),
			[]int{idx},
			offsets[idx],
			field.Exported(),
		)
		fields = append(fields, fieldInfo)
	}
	return "[" + strings.Join(fields, ", ") + "]"
}

func runtimeStructFieldInfoExpr(
	helper string,
	runtimeType string,
	storageKey string,
	runtimeName string,
	tag string,
	pkgPath string,
	anonymous bool,
	index []int,
	offset int64,
	exported bool,
) string {
	name := runtimeName
	if name == "" {
		name = storageKey
	}
	args := []string{
		strconv.Quote(name),
		runtimeType,
		runtimeStructFieldIndexExpr(index),
		strconv.FormatInt(offset, 10),
		strconv.FormatBool(exported),
	}
	var options []string
	if name != storageKey {
		options = append(options, "key: "+strconv.Quote(storageKey))
	}
	if runtimeName != "" || pkgPath != "" {
		options = append(options, "pkgPath: "+strconv.Quote(pkgPath))
	}
	if tag != "" {
		options = append(options, "tag: "+lowerGoStringLiteral(tag))
	}
	if anonymous {
		options = append(options, "anonymous: true")
	}
	if len(options) != 0 {
		args = append(args, "{ "+strings.Join(options, ", ")+" }")
	}
	return "/* @__PURE__ */ " + helper + "(" + strings.Join(args, ", ") + ")"
}

func runtimeStructFieldIndexExpr(index []int) string {
	values := make([]string, 0, len(index))
	for _, value := range index {
		values = append(values, strconv.Itoa(value))
	}
	return "[" + strings.Join(values, ", ") + "]"
}

func (o *LoweringOwner) runtimeFunctionTypeInfo(signature *types.Signature, name string) string {
	return o.runtimeFunctionTypeInfoWithSeen(signature, name, make(map[types.Type]bool))
}

func (o *LoweringOwner) runtimeFunctionTypeInfoWithSeen(signature *types.Signature, name string, seen map[types.Type]bool) string {
	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	parts := []string{"kind: " + typeKind + ".Function"}
	if name != "" {
		parts = append(parts, "name: "+strconv.Quote(name))
	}
	parts = append(parts, "params: "+o.runtimeSignatureTypes(signature.Params(), seen))
	parts = append(parts, "results: "+o.runtimeSignatureTypes(signature.Results(), seen))
	if signature.Variadic() {
		parts = append(parts, "isVariadic: true")
	}
	runtimePackage := strings.TrimSuffix(typeKind, ".TypeKind")
	return "({ " + strings.Join(parts, ", ") + " } as " + runtimePackage + ".FunctionTypeInfo)"
}

func (o *LoweringOwner) runtimeFunctionTypeAssertInfoWithSeen(
	ctx lowerFileContext,
	signature *types.Signature,
	name string,
	seen map[types.Type]bool,
) string {
	typeKind := o.runtimeOwner.QualifiedHelper(RuntimeHelperTypeKind)
	parts := []string{"kind: " + typeKind + ".Function"}
	if name != "" {
		parts = append(parts, "name: "+strconv.Quote(name))
	}
	parts = append(parts, "params: "+o.runtimeTypeAssertSignatureTypes(ctx, signature.Params(), seen))
	parts = append(parts, "results: "+o.runtimeTypeAssertSignatureTypes(ctx, signature.Results(), seen))
	if signature.Variadic() {
		parts = append(parts, "isVariadic: true")
	}
	runtimePackage := strings.TrimSuffix(typeKind, ".TypeKind")
	return "({ " + strings.Join(parts, ", ") + " } as " + runtimePackage + ".FunctionTypeInfo)"
}

func (o *LoweringOwner) runtimeSignatureTypes(tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	types := make([]string, 0, tuple.Len())
	for v := range tuple.Variables() {
		types = append(types, o.runtimeTypeInfoExprWithSeen(v.Type(), seen))
	}
	return "[" + strings.Join(types, ", ") + "]"
}

func (o *LoweringOwner) runtimeTypeAssertSignatureTypes(ctx lowerFileContext, tuple *types.Tuple, seen map[types.Type]bool) string {
	if tuple == nil || tuple.Len() == 0 {
		return "[]"
	}
	types := make([]string, 0, tuple.Len())
	for v := range tuple.Variables() {
		types = append(types, o.runtimeTypeAssertInfoExprWithSeen(ctx, v.Type(), seen))
	}
	return "[" + strings.Join(types, ", ") + "]"
}

func tsStructFieldName(name string, idx int) string {
	// A blank field gets a name of its own.
	if name == "_" {
		return "_blank" + strconv.Itoa(idx)
	}

	// A field is an own property of its struct object, and an own property
	// named __proto__ would set the object's prototype instead.
	if name == "__proto__" {
		return "_" + name
	}
	return safeIdentifier(name)
}

// shouldCloneStructValue reports whether a struct value expr must be copied
// where Go copies it. A composite literal is a new value, and so is the
// result of a call of a function or concrete method compiled from Go, since
// each return copies a stored struct value (see lowerNamedResultValue). The
// last read of a local that nothing reads afterwards moves its value (see
// collectMoves).
func (o *LoweringOwner) shouldCloneStructValue(ctx lowerFileContext, expr ast.Expr) bool {
	switch typed := ast.Unparen(expr).(type) {
	case *ast.CompositeLit:
		return false
	case *ast.CallExpr:
		return !o.isFreshStructCallResult(ctx, typed)
	default:
		return !movedLocalValue(ctx, expr)
	}
}

// isFreshStructCallResult reports whether call returns a struct value no other
// storage refers to: a call of a function or concrete method compiled from Go
// source. Conversions, function values, interface methods and hand-written
// override packages may return stored values.
func (o *LoweringOwner) isFreshStructCallResult(ctx lowerFileContext, call *ast.CallExpr) bool {
	// The call is of a declared function or method, not a conversion or builtin.
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	info := ctx.semPkg.source.TypesInfo
	if tv, ok := info.Types[call.Fun]; !ok || tv.IsType() || tv.IsBuiltin() {
		return false
	}
	fn := calledFunction(ctx.semPkg.source, ast.Unparen(call.Fun))
	if fn == nil || fn.Pkg() == nil {
		return false
	}

	// An interface method may return a stored value.
	signature, _ := fn.Type().(*types.Signature)
	if signature == nil {
		return false
	}
	if recv := signature.Recv(); recv != nil && types.IsInterface(recv.Type()) {
		return false
	}

	// A generic function returns a value of a type parameter as it is.
	if origin, _ := fn.Origin().Type().(*types.Signature); origin != nil {
		for result := range origin.Results().Variables() {
			if _, ok := types.Unalias(result.Type()).(*types.TypeParam); ok {
				return false
			}
		}
	}

	// A method expression passes its receiver along, so the result may be it.
	if selector, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr); ok {
		if selection := info.Selections[selector]; selection != nil && selection.Kind() != types.MethodVal {
			return false
		}
	}

	// Hand-written override packages may return stored values.
	return !o.overrideFacts().HasPackage(fn.Pkg().Path())
}

func constIntExpr(ctx lowerFileContext, expr ast.Expr) (int, bool) {
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	if !ok || tv.Value == nil {
		return 0, false
	}
	value, ok := constant.Int64Val(tv.Value)
	if !ok {
		return 0, false
	}
	return int(value), true
}

// foldByteConstant folds a compile-time constant byte element to its plain
// numeric TypeScript literal. The Go type checker has already validated the
// value is representable as uint8, so the folded literal needs no runtime
// $.uint(x, 8) truncation. Non-constant elements return ok=false so the caller
// keeps the runtime truncation wrapping.
func foldByteConstant(ctx lowerFileContext, expr ast.Expr) (string, bool) {
	tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]
	if !ok || tv.Value == nil {
		return "", false
	}
	value, ok := constant.Uint64Val(constant.ToInt(tv.Value))
	if !ok {
		return "", false
	}
	return strconv.FormatUint(value&0xff, 10), true
}

func (o *LoweringOwner) tsSignatureParamsFor(ctx lowerFileContext, signature *types.Signature, asyncCompatibleFunctionParams bool) string {
	if signature == nil || signature.Params() == nil || signature.Params().Len() == 0 {
		return ""
	}
	params := make([]string, 0, signature.Params().Len())
	for idx := range signature.Params().Len() {
		param := signature.Params().At(idx)
		params = append(params, safeParamName(param, idx)+": "+o.tsFuncParamTypeFor(ctx, param.Type(), asyncCompatibleFunctionParams))
	}
	return strings.Join(params, ", ")
}

func (o *LoweringOwner) tsSignatureResultFor(ctx lowerFileContext, signature *types.Signature) string {
	if signature == nil || signature.Results() == nil || signature.Results().Len() == 0 {
		return "void"
	}
	if signature.Results().Len() == 1 {
		return o.tsSignatureResultTypeFor(ctx, signature.Results().At(0).Type())
	}
	results := make([]string, 0, signature.Results().Len())
	for result := range signature.Results().Variables() {
		results = append(results, o.tsSignatureResultTypeFor(ctx, result.Type()))
	}
	return "[" + strings.Join(results, ", ") + "]"
}

func (o *LoweringOwner) tsSignatureResultTypeFor(ctx lowerFileContext, typ types.Type) string {
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if _, ok := types.Unalias(named.Underlying()).(*types.Signature); ok {
			return o.tsTypeFor(ctx, typ)
		}
	}
	if signature := signatureForType(typ); ctx.functionTypeDepth == 0 && signature != nil {
		return o.tsAsyncCompatibleFunctionResultTypeFor(ctx, signature)
	}
	return o.tsTypeFor(ctx, typ)
}

func funcSignatureNeedsAsyncFunctionParamCalls(signature *types.Signature) bool {
	if signature == nil || signature.Params() == nil {
		return false
	}
	for param := range signature.Params().Variables() {
		paramSignature := signatureForType(param.Type())
		if paramSignature != nil && paramSignature.Results() != nil && paramSignature.Results().Len() != 0 {
			return true
		}
	}
	return false
}

func funcLiteralNeedsAsyncFunctionParamCalls(signature *types.Signature) bool {
	if signature == nil || signature.Params() == nil {
		return false
	}
	if signature.Results() == nil || signature.Results().Len() == 0 {
		return false
	}
	return funcSignatureNeedsAsyncFunctionParamCalls(signature)
}

func unnamedSignatureForType(typ types.Type) *types.Signature {
	if typ == nil {
		return nil
	}
	if _, ok := types.Unalias(typ).(*types.Named); ok {
		return nil
	}
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	return signature
}

func asyncResultType(result string, async bool) string {
	if !async {
		return result
	}
	return tsPromiseType(result)
}

func asyncCompatibleResultType(result string) string {
	if result == "void" {
		return result
	}
	return result + " | " + tsPromiseType(result)
}

func asyncCompatibleMethodResultType(result string, async bool) string {
	if !async {
		return result
	}
	return asyncCompatibleResultType(result)
}

func tsPromiseType(result string) string {
	return "globalThis.Promise<" + result + ">"
}

func (o *LoweringOwner) tsVariableTypeFor(ctx lowerFileContext, typ types.Type, needsVarRef bool) string {
	valueType := o.tsTypeFor(ctx, typ)
	if needsVarRef {
		return "$.VarRef<" + valueType + ">"
	}
	return valueType
}

func (o *LoweringOwner) tsFuncParamTypeFor(ctx lowerFileContext, typ types.Type, asyncCompatible bool) string {
	if !asyncCompatible {
		return o.tsTypeFor(ctx, typ)
	}
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	if signature == nil {
		return o.tsTypeFor(ctx, typ)
	}
	signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	return "((" + o.tsSignatureParamsFor(signatureCtx, signature, false) + ") => " +
		asyncCompatibleResultType(o.tsSignatureResultFor(signatureCtx, signature)) + ") | null"
}

func (o *LoweringOwner) tsTypeAssertionTypeFor(ctx lowerFileContext, typ types.Type) string {
	if signature := signatureForType(typ); signature != nil {
		return o.tsAsyncCompatibleFunctionTypeFor(ctx, signature)
	}
	return o.tsTypeFor(ctx, typ)
}

func (o *LoweringOwner) tsAsyncCompatibleFunctionTypeFor(ctx lowerFileContext, signature *types.Signature) string {
	signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	return "((" + o.tsSignatureParamsFor(signatureCtx, signature, true) + ") => " +
		asyncCompatibleResultType(o.tsSignatureResultFor(signatureCtx, signature)) + ") | null"
}

func (o *LoweringOwner) tsAsyncCompatibleFunctionResultTypeFor(ctx lowerFileContext, signature *types.Signature) string {
	signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
	return "((" + o.tsSignatureParamsFor(signatureCtx, signature, false) + ") => " +
		asyncCompatibleResultType(o.tsSignatureResultFor(signatureCtx, signature)) + ") | null"
}

func (o *LoweringOwner) tsTypeFor(ctx lowerFileContext, typ types.Type) string {
	if typ == nil {
		return "unknown"
	}
	if alias, ok := typ.(*types.Alias); ok {
		return o.aliasTypeExpr(ctx, alias)
	}
	if isBuiltinErrorType(typ) {
		return "$.GoError"
	}
	if isUnsafePointerType(typ) {
		return "any"
	}
	if _, ok := types.Unalias(typ).(*types.TypeParam); ok {
		return "any"
	}
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if !o.canSpellNamedType(ctx, named) {
			return "any"
		}
		name := o.namedTypeExpr(ctx, named)
		if _, ok := named.Underlying().(*types.Interface); ok {
			return name + " | null"
		}
		if _, ok := types.Unalias(named.Underlying()).(*types.Signature); ok {
			return name + " | null"
		}
		return name
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		if typed.Kind() == types.UntypedNil {
			return "null"
		}
		if typed.Info()&types.IsComplex != 0 {
			return "$.Complex"
		}
		if typed.Info()&types.IsBoolean != 0 {
			return "boolean"
		}
		if typed.Info()&types.IsString != 0 {
			return "string"
		}
		if typed.Info()&types.IsNumeric != 0 {
			switch typed.Kind() {
			case types.Int64, types.Uint64:
				return "bigint"
			}
			return "number"
		}
		return "unknown"
	case *types.Array:
		if isByteType(typed.Elem()) {
			return "Uint8Array"
		}
		return tsArrayType(o.tsTypeFor(ctx, typed.Elem()))
	case *types.Slice:
		return "$.Slice<" + o.tsSliceElemTypeFor(ctx, typed.Elem()) + ">"
	case *types.Map:
		return tsNativeMapType(o.tsTypeFor(ctx, typed.Key()), o.tsTypeFor(ctx, typed.Elem())) + " | null"
	case *types.Chan:
		return "$.Channel<" + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
	case *types.Struct:
		return o.tsAnonymousStructTypeFor(ctx, typed)
	case *types.Pointer:
		if isBuiltinErrorType(typed.Elem()) {
			return "$.VarRef<$.GoError> | null"
		}
		if _, ok := types.Unalias(typed.Elem()).(*types.TypeParam); ok {
			return "any"
		}
		if named := namedNonStructType(typed.Elem()); named != nil {
			if !o.canSpellNamedType(ctx, named) {
				return "any"
			}
			if _, ok := named.Underlying().(*types.Interface); ok {
				return "$.VarRef<" + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
			}
			if _, ok := types.Unalias(named.Underlying()).(*types.Signature); ok {
				return "$.VarRef<" + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
			}
			return "$.VarRef<" + o.namedTypeExpr(ctx, named) + "> | null"
		}
		if named := namedStructType(typed.Elem()); named != nil {
			if !o.canSpellNamedType(ctx, named) {
				return "any"
			}
			name := o.namedTypeExpr(ctx, named)
			return name + " | $.VarRef<" + name + "> | null"
		}
		return "$.VarRef<" + o.tsTypeFor(ctx, typed.Elem()) + "> | null"
	case *types.Interface:
		return "any"
	case *types.Signature:
		signatureCtx := ctx.withFunctionTypeDepth(ctx.functionTypeDepth + 1)
		return "((" + o.tsSignatureParamsFor(signatureCtx, typed, true) + ") => " +
			asyncCompatibleResultType(o.tsSignatureResultFor(signatureCtx, typed)) + ") | null"
	default:
		return "unknown"
	}
}

func (o *LoweringOwner) tsSliceElemTypeFor(ctx lowerFileContext, typ types.Type) string {
	if typeParam, ok := types.Unalias(typ).(*types.TypeParam); ok && staticTypeParamInScope(ctx, typeParam) {
		return safeIdentifier(typeParam.Obj().Name())
	}
	if pointer, ok := types.Unalias(typ).(*types.Pointer); ok {
		if typeParam, ok := types.Unalias(pointer.Elem()).(*types.TypeParam); ok && staticTypeParamInScope(ctx, typeParam) {
			name := safeIdentifier(typeParam.Obj().Name())
			return name + " | $.VarRef<" + name + "> | null"
		}
	}
	return o.tsTypeFor(ctx, typ)
}

func (o *LoweringOwner) tsNonNilTypeFor(ctx lowerFileContext, typ types.Type) string {
	if isBuiltinErrorType(typ) {
		return "Exclude<$.GoError, null>"
	}
	if named, ok := types.Unalias(typ).(*types.Named); ok {
		if _, ok := named.Underlying().(*types.Interface); ok {
			if !o.canSpellNamedType(ctx, named) {
				return "any"
			}
			return "Exclude<" + o.namedTypeExpr(ctx, named) + ", null>"
		}
	}
	return strings.TrimSuffix(o.tsTypeFor(ctx, typ), " | null")
}

func (o *LoweringOwner) aliasTypeExpr(ctx lowerFileContext, alias *types.Alias) string {
	if alias == nil || alias.Obj() == nil {
		return "unknown"
	}
	if !ctx.canReferenceObjectPackage(alias.Obj()) {
		return "any"
	}
	if alias.Obj().Pkg() == nil {
		return o.tsTypeFor(ctx, alias.Rhs())
	}
	baseName := alias.Obj().Name()
	if localAlias := ctx.localAliases[alias.Obj()]; localAlias != "" {
		baseName = localAlias + "." + baseName
	} else if importAlias := ctx.importPaths[alias.Obj().Pkg().Path()]; importAlias != "" {
		baseName = importAlias + "." + baseName
	}
	// Override packages can export an interface shape for a Go alias. Keep
	// its nil value in generated uses, just as for a named Go interface.
	if _, ok := types.Unalias(alias).Underlying().(*types.Interface); ok {
		return baseName + " | null"
	}
	return baseName
}

// crossPackageUnexportedNamedType reports whether named is an unexported type
// defined in a different package than ctx's file.
func crossPackageUnexportedNamedType(ctx lowerFileContext, named *types.Named) bool {
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil || ctx.semPkg == nil {
		return false
	}
	return named.Obj().Pkg().Path() != ctx.semPkg.pkgPath && !ast.IsExported(named.Obj().Name())
}

// canSpellNamedType reports whether named can be written by name in the
// generated TypeScript for ctx's file. It combines import visibility with the
// barrel-export rule: a generated package barrel re-exports every named type, so
// even an unexported type is spellable through it, but a hand-written override
// package barrel exports only the Go-exported API, so an unexported type from an
// override package stays unspellable and must lower to any.
func (o *LoweringOwner) canSpellNamedType(ctx lowerFileContext, named *types.Named) bool {
	if !ctx.canReferenceNamedType(named) {
		return false
	}
	if named == nil || named.Obj() == nil {
		return true
	}
	if !ast.IsExported(named.Obj().Name()) && o.typeUsesOverride(named) {
		return false
	}
	return true
}

func tsArrayType(elem string) string {
	if strings.Contains(elem, "|") {
		return "(" + elem + ")[]"
	}
	return elem + "[]"
}

func (o *LoweringOwner) tsAnonymousStructTypeFor(ctx lowerFileContext, structType *types.Struct) string {
	fields := make([]string, 0, structType.NumFields())
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fields = append(fields, strconv.Quote(tsStructFieldName(field.Name(), idx))+": "+o.tsStructFieldTypeFor(ctx, field.Type()))
	}
	return "{" + strings.Join(fields, ", ") + "}"
}

func (o *LoweringOwner) tsStructFieldTypeFor(ctx lowerFileContext, typ types.Type) string {
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	if signature == nil {
		return o.tsTypeFor(ctx, typ)
	}
	return "((" + o.tsSignatureParamsFor(ctx, signature, true) + ") => " +
		asyncCompatibleResultType(o.tsSignatureResultFor(ctx, signature)) + ") | null"
}

func appendZeroNeedsStaticHint(typ types.Type) bool {
	if namedStructType(typ) != nil && isStructValueType(typ) {
		return false
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		return typed.Kind() == types.UnsafePointer || typed.Info()&types.IsComplex != 0
	case *types.Array:
		return appendZeroNeedsStaticHint(typed.Elem())
	default:
		return true
	}
}

func zeroValueExpr(typ types.Type) string {
	if typ == nil {
		return "undefined"
	}
	if named := namedStructType(typ); named != nil && isStructValueType(typ) {
		return "new " + safeIdentifier(named.Obj().Name()) + "()"
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		if typed.Kind() == types.UnsafePointer {
			return "null"
		}
		if typed.Info()&types.IsComplex != 0 {
			return "({ real: 0, imag: 0 })"
		}
		if typed.Info()&types.IsBoolean != 0 {
			return "false"
		}
		if typed.Info()&types.IsString != 0 {
			return "\"\""
		}
		if typed.Info()&types.IsNumeric != 0 {
			switch typed.Kind() {
			case types.Int64, types.Uint64:
				return "0n"
			}
			return "0"
		}
		return "undefined"
	case *types.Array:
		if isByteType(typed.Elem()) {
			return "new Uint8Array(" + strconv.FormatInt(typed.Len(), 10) + ")"
		}
		elem := zeroValueExpr(typed.Elem())
		return "globalThis.Array.from({ length: " + strconv.FormatInt(typed.Len(), 10) + " }, () => " + arrowBodyExpr(elem) + ")"
	case *types.Struct:
		return anonymousStructZeroValueExpr(typed, zeroValueExpr)
	default:
		return "null"
	}
}

func anonymousStructZeroValueExpr(structType *types.Struct, zero func(types.Type) string) string {
	fields := make([]string, 0, structType.NumFields())
	for idx := range structType.NumFields() {
		field := structType.Field(idx)
		fields = append(fields, strconv.Quote(tsStructFieldName(field.Name(), idx))+": "+zero(field.Type()))
	}
	return "{" + strings.Join(fields, ", ") + "}"
}

func arrowBodyExpr(expr string) string {
	if strings.HasPrefix(expr, "{") {
		return "(" + expr + ")"
	}
	return expr
}

func namedStructType(typ types.Type) *types.Named {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		return nil
	}
	if _, ok := named.Underlying().(*types.Struct); !ok {
		return nil
	}
	return named
}

func pointerToNamedStructType(typ types.Type) *types.Named {
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return nil
	}
	return namedStructType(pointer.Elem())
}

func namedNonStructType(typ types.Type) *types.Named {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		return nil
	}
	if _, ok := named.Underlying().(*types.Struct); ok {
		return nil
	}
	return named
}

func namedFunctionType(typ types.Type) *types.Named {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		return nil
	}
	if _, ok := named.Underlying().(*types.Signature); !ok {
		return nil
	}
	return named
}

func overrideNamedStringType(ctx lowerFileContext, owner *LoweringOwner, typ types.Type) bool {
	named, _ := types.Unalias(typ).(*types.Named)
	return named != nil && isStringType(named) && owner.typeUsesOverride(named)
}

func isBuiltinErrorType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil || named.Obj() == nil {
		return false
	}
	return named.Obj().Pkg() == nil && named.Obj().Name() == "error"
}

func receiverTypeParam(typ types.Type) *types.TypeParam {
	for {
		pointer, ok := typ.(*types.Pointer)
		if !ok {
			break
		}
		typ = pointer.Elem()
	}
	typeParam, _ := types.Unalias(typ).(*types.TypeParam)
	return typeParam
}

func genericReceiverTypeParams(typ types.Type) []*types.TypeParam {
	named := receiverNamedType(typ)
	if named == nil {
		return nil
	}
	params := named.TypeParams()
	if (params == nil || params.Len() == 0) && named.Origin() != nil {
		params = named.Origin().TypeParams()
	}

	if params == nil {
		return nil
	}
	result := make([]*types.TypeParam, 0, params.Len())
	for param := range params.TypeParams() {
		result = append(result, param)
	}
	return result
}

func (o *LoweringOwner) genericTypeArgsLiteral(entries []string) string {
	// The marker value is a GenericTypeDescriptor-shaped brand so the marker
	// property satisfies the GenericTypeArgs index signature now that the
	// marker key is a string constant (minifier-safe; a Symbol key threw
	// "Cannot convert a Symbol value to a string" when a minifier inlined the
	// descriptor's consumer and stringified the computed key).
	return "{[" + o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericTypeArgsMarker) +
		"]: " + o.runtimeOwner.QualifiedHelper(RuntimeHelperGenericTypeArgsBrand) +
		", " + strings.Join(entries, ", ") + "}"
}

// genericReceiverTypeArgsExprForMethod returns the type arguments literal for
// calling method, declared on a generic receiver, as a member of the method
// set of methodSetType, or "" if the receiver is not generic.
func (o *LoweringOwner) genericReceiverTypeArgsExprForMethod(
	ctx lowerFileContext,
	method *types.Func,
	methodSetType types.Type,
	seen map[types.Type]bool,
) string {
	// Bind the declared receiver's type parameters, preferring the method set
	// type's arguments over the declared receiver's own.
	if method == nil || methodSetType == nil {
		return ""
	}
	signature, _ := method.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return ""
	}
	params := genericReceiverTypeParams(signature.Recv().Type())
	return o.receiverTypeArgsLiteral(ctx, params, seen, receiverNamedType(methodSetType), methodReceiverNamedType(method))
}

// receiverTypeArgsLiteral binds the receiver type parameters params to the
// type arguments of the first candidate with one argument per parameter. It
// returns "" if params is empty or no candidate matches.
func (o *LoweringOwner) receiverTypeArgsLiteral(
	ctx lowerFileContext,
	params []*types.TypeParam,
	seen map[types.Type]bool,
	candidates ...*types.Named,
) string {
	if len(params) == 0 {
		return ""
	}

	// Bind each parameter to the matching candidate's argument.
	for _, receiver := range candidates {
		if receiver == nil || receiver.TypeArgs().Len() != len(params) {
			continue
		}
		entries := make([]string, 0, len(params))
		static := true
		for idx, param := range params {
			if !typeIsHoistable(receiver.TypeArgs().At(idx)) {
				static = false
			}
			entries = append(entries, param.Obj().Name()+": "+o.genericTypeDescriptorExprWithSeen(ctx, receiver.TypeArgs().At(idx), seen))
		}
		if static {
			return o.hoistStatic(ctx, o.genericTypeArgsLiteral(entries))
		}
		return o.genericTypeArgsLiteral(entries)
	}
	return ""
}

// genericTypeArgsExprForNamed returns the generic type arguments literal of
// an instantiated named type, or "" if it is not generic.
func (o *LoweringOwner) genericTypeArgsExprForNamed(
	ctx lowerFileContext,
	named *types.Named,
	seen map[types.Type]bool,
) string {
	if named == nil {
		return ""
	}
	return o.receiverTypeArgsLiteral(ctx, genericReceiverTypeParams(named), seen, named)
}

// genericReceiverTypeArgsExpr returns the type arguments literal for the
// generic receiver of a selected method, or "" if the receiver is not generic.
func (o *LoweringOwner) genericReceiverTypeArgsExpr(ctx lowerFileContext, selection *types.Selection) string {
	if selection == nil || selection.Obj() == nil {
		return ""
	}
	declared := methodReceiverNamedType(selection.Obj())
	params := genericReceiverTypeParams(declared)
	return o.receiverTypeArgsLiteral(ctx, params, make(map[types.Type]bool), receiverNamedType(selection.Recv()), declared)
}

func (o *LoweringOwner) methodSelectionUsesOverridePackage(ctx lowerFileContext, selection *types.Selection) bool {
	if o.overrideOwner == nil || selection == nil || selection.Obj() == nil {
		return false
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil || method.Pkg() == nil {
		return false
	}
	if ctx.model != nil && ctx.model.functions[method] != nil {
		return false
	}
	return o.overrideFacts().HasPackage(method.Pkg().Path())
}

func signatureHasTypeParam(signature *types.Signature, target *types.TypeParam) bool {
	if signature == nil || target == nil {
		return false
	}
	typeParams := signature.TypeParams()
	if typeParams == nil {
		return false
	}
	for typeParam := range typeParams.TypeParams() {
		if typeParam == target || typeParam.Obj() == target.Obj() {
			return true
		}
	}
	return false
}

// basicTypeSet reports whether the type set of the given constraint is
// restricted to basic types, such as ~int32 | ~int64, so that a conversion
// to a type parameter with that constraint can change a value's representation.
func basicTypeSet(constraint types.Type) bool {
	var terms []types.Type
	if !collectTypeSetTerms(constraint, &terms) || len(terms) == 0 {
		return false
	}
	return !slices.ContainsFunc(terms, func(term types.Type) bool {
		_, basic := types.Unalias(term).Underlying().(*types.Basic)
		return !basic
	})
}

func typeParamInScope(ctx lowerFileContext, target *types.TypeParam) bool {
	if target == nil {
		return false
	}
	if signatureHasTypeParam(ctx.signature, target) {
		return true
	}
	return ctx.typeParams[target.Obj().Name()]
}

func staticTypeParamInScope(ctx lowerFileContext, target *types.TypeParam) bool {
	if target == nil || !typeParamInScope(ctx, target) {
		return false
	}
	return ctx.staticTypeParams[target.Obj().Name()]
}

func signatureTypeParamNames(signature *types.Signature) []string {
	if signature == nil || signature.TypeParams() == nil {
		return nil
	}
	typeParams := signature.TypeParams()
	names := make([]string, 0, typeParams.Len())
	for typeParam := range typeParams.TypeParams() {
		if !signatureUsesTypeParamAsSliceElem(signature, typeParam) {
			continue
		}
		names = append(names, safeIdentifier(typeParam.Obj().Name()))
	}
	return names
}

func signatureUsesTypeParamAsSliceElem(signature *types.Signature, target *types.TypeParam) bool {
	if signature == nil || target == nil {
		return false
	}
	return tupleUsesTypeParamAsSliceElem(signature.Params(), target) ||
		tupleUsesTypeParamAsSliceElem(signature.Results(), target)
}

func tupleUsesTypeParamAsSliceElem(tuple *types.Tuple, target *types.TypeParam) bool {
	if tuple == nil {
		return false
	}
	for variable := range tuple.Variables() {
		if typeUsesTypeParamAsSliceElem(variable.Type(), target) {
			return true
		}
	}
	return false
}

func typeUsesTypeParamAsSliceElem(typ types.Type, target *types.TypeParam) bool {
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Slice:
		if typeParam, ok := types.Unalias(typed.Elem()).(*types.TypeParam); ok &&
			(typeParam == target || typeParam.Obj() == target.Obj()) {
			return true
		}
		return typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Array:
		return typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Pointer:
		return typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Map:
		return typeUsesTypeParamAsSliceElem(typed.Key(), target) ||
			typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Chan:
		return typeUsesTypeParamAsSliceElem(typed.Elem(), target)
	case *types.Signature:
		return tupleUsesTypeParamAsSliceElem(typed.Params(), target) ||
			tupleUsesTypeParamAsSliceElem(typed.Results(), target)
	default:
		return false
	}
}

func sameNamedTypeOrigin(a *types.Named, b *types.Named) bool {
	if a == nil || b == nil {
		return false
	}
	return a == b || a.Origin() == b.Origin()
}

func namedNonInterfaceNonStructType(named *types.Named) bool {
	if named == nil {
		return false
	}
	switch named.Underlying().(type) {
	case *types.Interface, *types.Struct:
		return false
	default:
		return true
	}
}

// isStructValueType reports whether typ is a named struct or a nonempty
// anonymous struct, which Go copies by value. An empty anonymous struct has no
// state to copy, so it stays a plain object.
// typeParamMayHoldValueType reports whether typ is a type parameter whose
// type set may include a struct or array type, which Go copies by value.
func typeParamMayHoldValueType(typ types.Type) bool {
	// Only a type parameter can stand for a type chosen by the caller.
	typeParam, ok := types.Unalias(typ).(*types.TypeParam)
	if !ok {
		return false
	}

	// A method-set constraint admits any type, including a struct.
	iface, ok := typeParam.Constraint().Underlying().(*types.Interface)
	if !ok || iface.IsMethodSet() {
		return true
	}
	return typeSetMayHoldValueType(iface)
}

// typeSetMayHoldValueType reports whether the type terms of iface may include
// a struct or array type.
func typeSetMayHoldValueType(iface *types.Interface) bool {
	for i := range iface.NumEmbeddeds() {
		switch embedded := types.Unalias(iface.EmbeddedType(i)).(type) {
		case *types.Union:
			for j := range embedded.Len() {
				switch embedded.Term(j).Type().Underlying().(type) {
				case *types.Struct, *types.Array, *types.Interface:
					return true
				}
			}
		default:
			if inner, ok := embedded.Underlying().(*types.Interface); ok {
				if typeSetMayHoldValueType(inner) {
					return true
				}
				continue
			}
			switch embedded.Underlying().(type) {
			case *types.Struct, *types.Array:
				return true
			}
		}
	}
	return false
}

// makeSliceElemNeedsZeroFactory reports whether make([]T, n) must build each
// element with a zero-value factory: T is a struct with fields, named or not,
// or an array type, whose zero value is an object rather than null.
func makeSliceElemNeedsZeroFactory(elem types.Type) bool {
	// A type parameter has its own factory.
	if _, ok := types.Unalias(elem).(*types.TypeParam); ok {
		return false
	}

	// Struct values and arrays are objects.
	if isStructValueType(elem) {
		return true
	}
	_, isArray := types.Unalias(elem).Underlying().(*types.Array)
	return isArray
}

func isStructValueType(typ types.Type) bool {
	if namedStructType(typ) != nil {
		return true
	}
	structType, ok := types.Unalias(typ).(*types.Struct)
	return ok && structType.NumFields() != 0
}

func isStructComparableType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	if _, ok := types.Unalias(typ).Underlying().(*types.Struct); !ok {
		return false
	}
	return types.Comparable(typ)
}

func isPointerToStructType(typ types.Type) bool {
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return false
	}
	return structUnderlyingType(pointer.Elem()) != nil
}

func derefPointerType(typ types.Type) types.Type {
	if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		return pointer.Elem()
	}
	return typ
}

func structUnderlyingType(typ types.Type) *types.Struct {
	typed, _ := types.Unalias(typ).Underlying().(*types.Struct)
	return typed
}

func pointerToArrayType(typ types.Type) *types.Array {
	if typ == nil {
		return nil
	}
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return nil
	}
	array, _ := types.Unalias(pointer.Elem()).Underlying().(*types.Array)
	return array
}

func isMapType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Map)
	return ok
}

func indexElementType(typ types.Type) types.Type {
	if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		typ = pointer.Elem()
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Slice:
		return typed.Elem()
	case *types.Array:
		return typed.Elem()
	default:
		return nil
	}
}

func goScriptElementByteSize(ctx lowerFileContext, typ types.Type) int64 {
	if typ == nil {
		return 1
	}
	if sizes := ctx.semPkg.source.TypesSizes; sizes != nil {
		if size := sizes.Sizeof(typ); size > 0 {
			return size
		}
	}
	if bits, ok := integerBits(typ); ok && bits > 0 {
		return int64((bits + 7) / 8)
	}
	if isFloatType(typ) {
		basic, _ := types.Unalias(typ).Underlying().(*types.Basic)
		if basic != nil && basic.Kind() == types.Float32 {
			return 4
		}
		return 8
	}
	return 1
}

func isChannelType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Chan)
	return ok
}

// basicKind reports whether typ's underlying type is a basic type of the given
// kind. It is nil-safe and returns false for a nil type.
func basicKind(typ types.Type, kind types.BasicKind) bool {
	if typ == nil {
		return false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Kind() == kind
}

// basicInfo reports whether typ's underlying type is a basic type whose info
// flags include the given flag. It is nil-safe and returns false for a nil type.
func basicInfo(typ types.Type, flag types.BasicInfo) bool {
	if typ == nil {
		return false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	return ok && basic.Info()&flag != 0
}

func isComplexType(typ types.Type) bool {
	return basicInfo(typ, types.IsComplex)
}

func isPointerType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	return ok
}

// isComparedPointerType reports whether == compares values of typ as
// pointers, by the storage they point to.
func isComparedPointerType(typ types.Type) bool {
	return isPointerType(typ) || isUnsafePointerType(typ)
}

func isUnsafePointerType(typ types.Type) bool {
	return basicKind(typ, types.UnsafePointer)
}

func isUintptrType(typ types.Type) bool {
	return basicKind(typ, types.Uintptr)
}

func channelDirectionString(dir types.ChanDir) string {
	switch dir {
	case types.SendOnly:
		return "send"
	case types.RecvOnly:
		return "receive"
	default:
		return "both"
	}
}

func isNilExpr(expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	return ok && ident.Name == "nil"
}

func unwrapParenExpr(expr ast.Expr) ast.Expr {
	for {
		paren, ok := expr.(*ast.ParenExpr)
		if !ok {
			return expr
		}
		expr = paren.X
	}
}

func isStringType(typ types.Type) bool {
	return basicInfo(typ, types.IsString)
}

func isNumericType(typ types.Type) bool {
	return basicInfo(typ, types.IsNumeric)
}

func isIntegerType(typ types.Type) bool {
	return basicInfo(typ, types.IsInteger)
}

func isFloatType(typ types.Type) bool {
	return basicInfo(typ, types.IsFloat)
}

func isFloat32Type(typ types.Type) bool {
	return basicKind(typ, types.Float32)
}

func isComplex64Type(typ types.Type) bool {
	return basicKind(typ, types.Complex64)
}

func isFloatBinaryArithmeticOperator(tok token.Token) bool {
	switch tok {
	case token.ADD, token.SUB, token.MUL, token.QUO:
		return true
	default:
		return false
	}
}

// isNarrowIntegerArithmetic reports whether expr is a non-constant
// arithmetic expression, which can overflow its integer type.
func isNarrowIntegerArithmetic(ctx lowerFileContext, expr ast.Expr) bool {
	expr = ast.Unparen(expr)
	if tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]; !ok || tv.Value != nil {
		return false
	}
	switch e := expr.(type) {
	case *ast.BinaryExpr:
		switch e.Op {
		case token.ADD, token.SUB, token.MUL, token.SHL:
			return true
		}
	case *ast.UnaryExpr:
		// The complement ^x is wrapped where it is lowered.
		return e.Op == token.SUB
	}
	return false
}

func unsignedIntegerBits(typ types.Type) (int, bool) {
	if typ == nil {
		return 0, false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok || basic.Info()&types.IsUnsigned == 0 {
		return 0, false
	}
	switch basic.Kind() {
	case types.Uint8:
		return 8, true
	case types.Uint16:
		return 16, true
	case types.Uint32:
		return 32, true
	default:
		return 64, true
	}
}

// integerConversionKeepsValue reports whether converting a value of the
// integer type source to the integer type target keeps every value, so that
// the conversion needs no wrapping: the target has at least the bits of a
// source of the same signedness, or more bits than an unsigned source. Both
// must be represented as numbers, not bigints.
func integerConversionKeepsValue(source types.Type, target types.Type) bool {
	// Only number-represented integer types qualify.
	if isBigIntBackedType(source) || isBigIntBackedType(target) {
		return false
	}

	// A signed source fits a signed target at least as wide.
	sourceBits, sourceSigned := signedIntegerBits(source)
	targetBits, targetSigned := signedIntegerBits(target)
	if sourceSigned && targetSigned {
		return sourceBits <= targetBits
	}

	// An unsigned source fits an unsigned target at least as wide, or a
	// signed target that is wider.
	sourceBits, sourceUnsigned := unsignedIntegerBits(source)
	if !sourceUnsigned {
		return false
	}
	if targetSigned {
		return sourceBits < targetBits
	}
	targetBits, targetUnsigned := unsignedIntegerBits(target)
	return targetUnsigned && sourceBits <= targetBits
}

func signedIntegerBits(typ types.Type) (int, bool) {
	if typ == nil {
		return 0, false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok || basic.Info()&types.IsInteger == 0 || basic.Info()&types.IsUnsigned != 0 {
		return 0, false
	}
	switch basic.Kind() {
	case types.Int8:
		return 8, true
	case types.Int16:
		return 16, true
	case types.Int32:
		return 32, true
	default:
		return 64, true
	}
}

func integerBits(typ types.Type) (int, bool) {
	if bits, ok := unsignedIntegerBits(typ); ok {
		return bits, true
	}
	return signedIntegerBits(typ)
}

func isWideIntegerType(typ types.Type) bool {
	bits, ok := integerBits(typ)
	return ok && bits > 32
}

func isFixedWideIntegerType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok {
		return false
	}
	switch basic.Kind() {
	case types.Int64, types.Uint64, types.Uintptr:
		return true
	default:
		return false
	}
}

// sameIntegerRepresentation reports whether target and source are integer
// types of the same kind, whose values need no conversion between them.
func sameIntegerRepresentation(target types.Type, source types.Type) bool {
	// An unknown type has no representation to share.
	if target == nil || source == nil {
		return false
	}

	// Both types are integers of one kind.
	targetBasic, ok := types.Unalias(target).Underlying().(*types.Basic)
	if !ok || targetBasic.Info()&types.IsInteger == 0 || targetBasic.Info()&types.IsUntyped != 0 {
		return false
	}
	sourceBasic, ok := types.Unalias(source).Underlying().(*types.Basic)
	return ok && sourceBasic.Kind() == targetBasic.Kind()
}

// isNormalizedIntegerExpr reports whether expr reads an integer value that is
// already wrapped to the width of its type: a stored value or the result of a
// call or conversion, which each assignment, return and conversion wraps, but
// not the result of arithmetic, which may be wrapped by the conversion at its
// use.
func isNormalizedIntegerExpr(ctx lowerFileContext, expr ast.Expr) bool {
	switch typed := ast.Unparen(expr).(type) {
	case *ast.Ident:
		_, ok := ctx.semPkg.source.TypesInfo.ObjectOf(typed).(*types.Var)
		return ok
	case *ast.SelectorExpr:
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil {
			return selection.Kind() == types.FieldVal
		}
		_, ok := ctx.semPkg.source.TypesInfo.ObjectOf(typed.Sel).(*types.Var)
		return ok
	case *ast.IndexExpr:
		// An element of an array that a converted pointer reinterprets may
		// hold another type's value.
		_, conversion := ast.Unparen(typed.X).(*ast.CallExpr)
		return !conversion
	case *ast.StarExpr:
		_, conversion := ast.Unparen(typed.X).(*ast.CallExpr)
		return !conversion
	case *ast.CallExpr:
		// A conversion to an integer type wraps its value too.
		return true
	}
	return false
}

// isBigIntBackedType reports whether typ lowers to a TypeScript bigint. Only the
// fixed 64-bit Go integer types int64 and uint64 are represented as bigint to
// preserve full-width precision and Go overflow semantics. The platform-width
// uint and uintptr, plain int, and the narrower fixed-width integers stay number
// so they remain usable as array indices; uint/uintptr arithmetic still routes
// through the int64/uint64 runtime helpers and the result flows through
// coerceWideHelperResult, which keeps values above 2^53 as a runtime bigint to
// preserve full 64-bit width, matching design/SPEC_DIFFERENCES.md which maps
// int64/uint64 to bigint and uint/uintptr to the number representation.
func isBigIntBackedType(typ types.Type) bool {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok {
		return false
	}
	switch basic.Kind() {
	case types.Int64, types.Uint64:
		return true
	default:
		return false
	}
}

func isFixedSignedWideIntegerType(typ types.Type) bool {
	return basicKind(typ, types.Int64)
}

func isRuntimeWideIntegerType(typ types.Type) bool {
	if isFixedWideIntegerType(typ) {
		return true
	}
	bits, ok := unsignedIntegerBits(typ)
	return ok && bits > 32
}

func isRuneSliceType(typ types.Type) bool {
	slice, ok := types.Unalias(typ).Underlying().(*types.Slice)
	return ok && isRuneType(slice.Elem())
}

func isByteSliceType(typ types.Type) bool {
	slice, ok := types.Unalias(typ).Underlying().(*types.Slice)
	return ok && isByteType(slice.Elem())
}

func isRuneType(typ types.Type) bool {
	return basicKind(typ, types.Int32)
}

func isByteType(typ types.Type) bool {
	return basicKind(typ, types.Uint8)
}

func sliceTypeHint(typ types.Type) string {
	if _, hint := typedSliceArray(typ); hint != "" {
		return hint
	}
	switch {
	case isStringType(typ):
		return "string"
	case isNumericType(typ):
		return "number"
	case isBoolType(typ):
		return "boolean"
	default:
		return ""
	}
}

// typedSliceArray returns the JavaScript typed array that holds the slices of
// elements of type typ and the runtime hint that names it, or two empty
// strings for elements held in plain arrays. Fixed-size numeric elements up to
// 32 bits and float64 have typed arrays, whose stores wrap and round as Go
// does. int, uint and uintptr hold 53-bit numbers and the 64-bit integers
// bigints, which no typed array represents.
func typedSliceArray(typ types.Type) (array, hint string) {
	basic, ok := types.Unalias(typ).Underlying().(*types.Basic)
	if !ok {
		return "", ""
	}
	switch basic.Kind() {
	case types.Uint8:
		return "Uint8Array", "byte"
	case types.Int8:
		return "Int8Array", "int8"
	case types.Int16:
		return "Int16Array", "int16"
	case types.Uint16:
		return "Uint16Array", "uint16"
	case types.Int32:
		return "Int32Array", "int32"
	case types.Uint32:
		return "Uint32Array", "uint32"
	case types.Float32:
		return "Float32Array", "float32"
	case types.Float64:
		return "Float64Array", "float64"
	default:
		return "", ""
	}
}

func typeFromExpr(ctx lowerFileContext, expr ast.Expr) types.Type {
	if expr == nil || ctx.semPkg == nil || ctx.semPkg.source == nil || ctx.semPkg.source.TypesInfo == nil {
		return nil
	}
	if tv, ok := ctx.semPkg.source.TypesInfo.Types[expr]; ok && tv.IsType() {
		return tv.Type
	}
	return nil
}

func genericFunctionSignature(ctx lowerFileContext, expr ast.Expr) *types.Signature {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	var fn *types.Func
	switch typed := expr.(type) {
	case *ast.Ident:
		fn, _ = ctx.semPkg.source.TypesInfo.Uses[typed].(*types.Func)
	case *ast.SelectorExpr:
		fn, _ = ctx.semPkg.source.TypesInfo.Uses[typed.Sel].(*types.Func)
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection != nil {
			fn, _ = selection.Obj().(*types.Func)
		}
	}
	if fn == nil {
		return nil
	}
	signature, _ := fn.Type().(*types.Signature)
	if signature == nil || signature.TypeParams() == nil || signature.TypeParams().Len() == 0 {
		return nil
	}
	return signature
}

func protobufGeneratedSyncDecl(ctx lowerFileContext, decl *ast.FuncDecl) bool {
	if decl == nil || ctx.semPkg == nil || ctx.semPkg.source == nil || !protobufTypeScriptBindingReplacesMethodName(decl.Name.Name) {
		return false
	}
	return strings.HasSuffix(sourcePos(ctx.semPkg.source, decl.Pos()).file, ".pb.go")
}

func protobufGeneratedSyncMethod(ctx lowerFileContext, fn *types.Func) bool {
	if fn == nil || fn.Pkg() == nil || ctx.model == nil || !protobufTypeScriptBindingReplacesMethodName(fn.Name()) {
		return false
	}
	semPkg := ctx.model.packages[fn.Pkg().Path()]
	if semPkg == nil || semPkg.source == nil {
		return false
	}
	decl := functionDeclForObject(semPkg, fn)
	if decl == nil {
		return false
	}
	return strings.HasSuffix(sourcePos(semPkg.source, decl.Pos()).file, ".pb.go")
}

func (o *LoweringOwner) functionAsync(ctx lowerFileContext, fn *types.Func) bool {
	if fn == nil || ctx.model == nil {
		return false
	}
	if protobufGeneratedSyncMethod(ctx, fn) {
		return false
	}
	if ctx.model.functionAsync(fn) {
		return true
	}
	return o.functionReferencesAsyncLazyPackageVar(ctx, fn, make(map[*types.Func]bool))
}

// asyncLazyState carries one traversal of the call graph looking for async lazy
// package variables, plus the answers it has proven along the way.
//
// The call graph contains cycles, so a back edge has to assume an answer for a
// function that is still being computed. Any result resting on that assumption
// depends on where the traversal happened to start, and memoizing it would let
// one entry point poison the answer a later query receives. Each frame
// therefore tracks the shallowest back edge reached anywhere in its subtree,
// the lowlink of Tarjan's algorithm, and only a frame that no back edge escaped
// has an answer worth keeping.
type asyncLazyState struct {
	// cache holds proven answers and is shared by every traversal, because the
	// underlying question is reachability in the call graph and so does not
	// depend on where a traversal started.
	cache *asyncLazyCache
	// visiting maps each function on this traversal's stack to its frame depth,
	// and belongs to the traversal alone.
	visiting map[*types.Func]int
	depth    int
	lowlink  int
}

// asyncLazyCache holds the proven answers shared across concurrently lowered
// packages. Only results that no back edge escaped are stored, so every entry
// is the true reachability answer and readers cannot observe a value that
// depended on another traversal's entry point.
type asyncLazyCache struct {
	mu     sync.Mutex
	result map[*types.Func]bool
}

func newAsyncLazyCache() *asyncLazyCache {
	return &asyncLazyCache{result: make(map[*types.Func]bool)}
}

func (c *asyncLazyCache) load(fn *types.Func) (bool, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	cached, ok := c.result[fn]
	return cached, ok
}

func (c *asyncLazyCache) store(fn *types.Func, references bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.result[fn] = references
}

func newAsyncLazyState(cache *asyncLazyCache) *asyncLazyState {
	return &asyncLazyState{
		cache:    cache,
		visiting: make(map[*types.Func]int),
	}
}

func (o *LoweringOwner) functionReferencesAsyncLazyPackageVar(
	ctx lowerFileContext,
	fn *types.Func,
	seen map[*types.Func]bool,
) bool {
	fn = functionOriginOrSelf(fn)
	if fn == nil || ctx.model == nil {
		return false
	}
	state := ctx.asyncLazy
	if state == nil {
		if seen[fn] {
			return false
		}
		seen[fn] = true
		return o.walkAsyncLazyFunctionBody(ctx, fn, seen)
	}
	if cached, ok := state.cache.load(fn); ok {
		return cached
	}
	if depth, ok := state.visiting[fn]; ok {
		// A back edge: fn is still being answered further up the stack, so
		// assume false to break the cycle. Record how shallow the edge
		// reached, because every frame from here up to that depth is now
		// resting on the assumption.
		state.lowlink = min(state.lowlink, depth)
		return false
	}

	state.depth++
	frameDepth := state.depth
	state.visiting[fn] = frameDepth
	parentLowlink := state.lowlink
	state.lowlink = frameDepth

	references := o.walkAsyncLazyFunctionBody(ctx, fn, seen)

	frameLowlink := state.lowlink
	delete(state.visiting, fn)
	state.depth--
	if frameLowlink >= frameDepth {
		// No back edge escaped this frame, so nothing it assumed is still
		// pending and the answer no longer depends on where the traversal
		// started. Only then is it safe to memoize.
		state.cache.store(fn, references)
	}
	state.lowlink = min(parentLowlink, frameLowlink)
	return references
}

// walkAsyncLazyFunctionBody reports whether fn's own body reaches an async lazy
// package variable, either directly or through a call. Cycle handling and
// memoization belong to the caller.
func (o *LoweringOwner) walkAsyncLazyFunctionBody(
	ctx lowerFileContext,
	fn *types.Func,
	seen map[*types.Func]bool,
) bool {
	semFn := ctx.model.functions[fn]
	if semFn == nil {
		return false
	}
	for obj := range semFn.packageVars {
		if packageVarIsLazy(ctx, obj) && o.packageVarHasAsyncLazyInit(ctx, obj) {
			return true
		}
	}
	for called := range semFn.calls {
		if o.functionReferencesAsyncLazyPackageVar(ctx, called, seen) {
			return true
		}
	}
	return false
}

func (o *LoweringOwner) callNeedsAwait(ctx lowerFileContext, fun ast.Expr) bool {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	pkg := ctx.semPkg.source
	// Calling a generic function instantiation calls the function.
	var generic ast.Expr
	switch typed := fun.(type) {
	case *ast.IndexExpr:
		generic = typed.X
	case *ast.IndexListExpr:
		generic = typed.X
	}
	if generic != nil && signatureForType(pkg.TypesInfo.TypeOf(generic)) != nil {
		fun = generic
	}
	called := calledFunction(pkg, fun)
	if ctx.protobufGeneratedSyncFunction && called != nil && protobufTypeScriptBindingReplacesMethodName(called.Name()) {
		return false
	}
	return o.functionAsync(ctx, called) ||
		o.overrideCallNeedsAwait(ctx, fun) ||
		(!ctx.protobufGeneratedSyncFunction && callUsesFunctionValue(pkg, fun) && o.valueCallAsync(ctx, fun)) ||
		(ctx.asyncFunction && callUsesInterfaceMethod(pkg, fun)) ||
		// A package variable initializer can await, as package initialization
		// is asynchronous, so it awaits a function variable that may suspend.
		((ctx.asyncFunction || ctx.topLevel) && callUsesFunctionIdentifier(pkg, fun) && o.valueCallAsync(ctx, fun))
}

// valueCallAsync reports whether a call through the function value fun may
// suspend: its class reaches an async function value.
//
// A //goscript:async or //goscript:sync directive on the field, variable or
// func type it calls through decides it instead.
func (o *LoweringOwner) valueCallAsync(ctx lowerFileContext, fun ast.Expr) bool {
	if ctx.model == nil {
		return true
	}
	switch directive, _ := ctx.model.asyncDirectives.valueCall(ctx.semPkg.source, fun); directive {
	case asyncDirectiveAsync:
		return true
	case asyncDirectiveSync:
		return false
	}
	return ctx.model.valueCallAsync(ctx.semPkg.source.TypesInfo.TypeOf(fun))
}

func callUsesInterfaceMethod(pkg *packages.Package, fun ast.Expr) bool {
	if pkg == nil {
		return false
	}
	selector, ok := fun.(*ast.SelectorExpr)
	if !ok {
		return false
	}
	selection := pkg.TypesInfo.Selections[selector]
	if selection == nil || selection.Kind() != types.MethodVal {
		return false
	}
	return isInterfaceType(selection.Recv())
}

func (o *LoweringOwner) overrideCallNeedsAwait(ctx lowerFileContext, fun ast.Expr) bool {
	if o.overrideOwner == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	if fn := calledFunction(ctx.semPkg.source, fun); fn != nil && fn.Pkg() != nil {
		if protobufGeneratedSyncMethod(ctx, fn) {
			return false
		}
		if o.overrideFacts().IsFunctionAsync(fn.Pkg().Path(), fn.Name()) {
			return true
		}
	}
	selector, ok := fun.(*ast.SelectorExpr)
	if !ok {
		return false
	}
	selection := ctx.semPkg.source.TypesInfo.Selections[selector]
	if selection == nil {
		return false
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return false
	}
	if protobufGeneratedSyncMethod(ctx, method) {
		return false
	}
	named := selectedReceiverNamedType(ctx.semPkg.source, selector, selection)
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return false
	}
	return o.overrideFacts().IsMethodAsync(
		named.Obj().Pkg().Path(),
		named.Obj().Name()+"."+method.Name(),
	)
}

// overrideAwaitsCallback reports whether override metadata names param of the
// called function or method as a callback its runtime awaits.
func (o *LoweringOwner) overrideAwaitsCallback(ctx lowerFileContext, fun ast.Expr, param string) bool {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	pkg := ctx.semPkg.source
	facts := o.overrideFacts()
	return facts.AwaitsCallback(overrideCallPackage(pkg, fun), overrideCallMethod(pkg, fun), param) ||
		facts.AwaitsCallback(overrideFunctionCallPackage(pkg, fun), overrideFunctionCallName(pkg, fun), param)
}

// callbackOverrideCallNeedsAwait reports whether a call to a callback async
// override passes a function argument that may suspend.
func (o *LoweringOwner) callbackOverrideCallNeedsAwait(ctx lowerFileContext, call *ast.CallExpr) bool {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	ok, deps, shapes := callbackOverrideCallFacts(ctx.semPkg.source, o.overrideFacts(), call, ctx.model.literalKey)
	if !ok {
		return false
	}
	return slices.ContainsFunc(deps, func(dep *types.Func) bool {
		return dep == nil || o.functionAsync(ctx, dep)
	}) || slices.ContainsFunc(shapes, ctx.model.shapeCallAsync)
}

// callExprNeedsAwait reports whether call may suspend, by its callee or by a
// function argument it passes to a callback async override.
//
// A call of a format function that override metadata lists in
// asyncWhenOperands is decided by its operands.
func (o *LoweringOwner) callExprNeedsAwait(ctx lowerFileContext, call *ast.CallExpr) bool {
	if async, ok := o.formatCallAsync(ctx, call); ok {
		return async
	}
	if async, ok := ctx.model.mutexCallAsync(ctx.semPkg, call); ok {
		return async
	}
	if shapes, ok := o.overrideFacts().AsyncWhenFieldShapes(calledFunction(ctx.semPkg.source, call.Fun)); ok {
		return ctx.model == nil || slices.ContainsFunc(shapes, ctx.model.shapeCallAsync)
	}
	return o.callNeedsAwait(ctx, call.Fun) || o.callbackOverrideCallNeedsAwait(ctx, call)
}

// formatCallAsync reports whether a call of a format function that override
// metadata lists in asyncWhenOperands may suspend, by its operands. It
// reports ok false for any other call.
func (o *LoweringOwner) formatCallAsync(ctx lowerFileContext, call *ast.CallExpr) (async, ok bool) {
	// Only a call of a listed format function is decided here.
	if ctx.model == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false, false
	}
	pkg := ctx.semPkg.source
	called := calledFunction(pkg, call.Fun)
	if !o.overrideFacts().IsAsyncWhenOperands(called) {
		return false, false
	}
	return ctx.model.formatCallAsync(pkg, o.overrideFacts(), called, call), true
}

// awaitCallIfNeeded awaits the lowered call when it may suspend. A call
// through a function variable in a synchronous literal cannot await, so it
// unwraps the result of a function value that returned synchronously.
func (o *LoweringOwner) awaitCallIfNeeded(ctx lowerFileContext, call *ast.CallExpr, lowered string) string {
	// A function that //goscript:sync marks cannot await, so its calls that
	// may suspend must have returned a value. The semantic model reports the
	// calls that always return a promise.
	if ctx.syncDirectiveFunction && o.callExprNeedsAwait(ctx, call) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperSyncResult) + "(" + lowered + ")"
	}

	// A call through a local that always holds a lowered literal awaits only
	// an async literal.
	if async, ok := o.fixedFuncLocalCallAsync(ctx, call); ok && (!async || ctx.asyncFunction) {
		if async {
			return "await " + lowered
		}
		return lowered
	}

	// Await a call that may suspend.
	if o.callExprNeedsAwait(ctx, call) {
		if awaited, ok := o.conditionalAwait(ctx, call, lowered); ok {
			return awaited
		}
		return "await " + lowered
	}

	// Only a call with results needs more.
	pkg := ctx.semPkg.source
	fun := call.Fun
	signature := signatureForType(pkg.TypesInfo.TypeOf(fun))
	if signature == nil || signature.Results().Len() == 0 {
		return lowered
	}

	// A value whose class is sync, a function that metadata makes async only
	// in some programs, or a method of an override interface that metadata
	// declares sync returns a value here, but its TypeScript type admits a
	// promise, so the result is asserted to its Go type.
	valueCall := callUsesFunctionValue(pkg, fun) || callUsesFunctionIdentifier(pkg, fun)
	called := calledFunction(pkg, fun)
	if valueCall && !o.valueCallAsync(ctx, fun) ||
		ctx.model != nil && (ctx.model.asyncWhenTargets[called] || ctx.model.syncOverrideInterfaceMethod(called) ||
			o.overrideFacts().IsAsyncWhenOperands(called) ||
			ctx.model.syncDirective(called) && isInterfaceMethod(called)) {
		return "(" + lowered + " as " + o.tsSignatureResultFor(ctx, signature) + ")"
	}

	// A function variable in a synchronous literal must have returned a
	// value.
	if callUsesFunctionIdentifier(pkg, fun) {
		return o.runtimeOwner.QualifiedHelper(RuntimeHelperSyncResult) + "(" + lowered + ")"
	}
	return lowered
}

// fixedFuncLocalCallAsync reports whether call calls the literal of a fixed
// function local (see fixedFuncLocal) that was lowered async. It reports ok
// false when the callee is not such a local or its literal is not lowered
// yet.
func (o *LoweringOwner) fixedFuncLocalCallAsync(ctx lowerFileContext, call *ast.CallExpr) (async, ok bool) {
	// Only a local variable can hold a fixed literal.
	ident, isIdent := ast.Unparen(call.Fun).(*ast.Ident)
	if !isIdent || ctx.funcLitAsync == nil {
		return false, false
	}
	obj, _ := objectForIdent(ctx, ident).(*types.Var)
	if obj == nil {
		return false, false
	}

	// The literal records its async mark once lowered.
	lit := fixedFuncLocal(ctx, obj)
	if lit == nil {
		return false, false
	}
	async, ok = ctx.funcLitAsync[lit]
	return async, ok
}

// conditionalAwaitTemp is the module variable that holds the result of a
// call that is awaited only if it returns a promise.
const conditionalAwaitTemp = "__goscriptAwait"

// conditionalAwait returns the lowered call awaited only if it returns a
// promise, for a call through a function value or an interface method, which
// may or may not suspend depending on the function it calls. Awaiting a
// value that is not a promise still suspends the caller until the microtask
// queue runs, which is much slower than continuing. The result is assigned to
// a module variable and tested in one expression without suspending, so that
// concurrent callers can share it. The variable is untyped, since the declared
// TypeScript result types of handwritten overrides can differ from those of
// the Go result types. A composite result, unlike a basic or interface result,
// carries element types, so it is asserted to its Go type for the
// code that consumes it, such as the type inference of a generic call, which
// cannot infer element types from an untyped value. It returns false for other
// calls, which are always awaited.
func (o *LoweringOwner) conditionalAwait(ctx lowerFileContext, call *ast.CallExpr, lowered string) (string, bool) {
	// Only an async function with a temporary can await conditionally.
	if ctx.awaitTemp == nil || ctx.semPkg == nil || ctx.semPkg.source == nil || !ctx.asyncFunction {
		return "", false
	}

	// Only a call whose callee is not known statically may return a promise.
	pkg := ctx.semPkg.source
	fun := call.Fun
	if !callUsesFunctionValue(pkg, fun) && !callUsesFunctionIdentifier(pkg, fun) && !callUsesInterfaceMethod(pkg, fun) {
		return "", false
	}
	if o.overrideCallNeedsAwait(ctx, fun) || o.callbackOverrideCallNeedsAwait(ctx, call) {
		return "", false
	}
	signature := signatureForType(pkg.TypesInfo.TypeOf(fun))
	if signature == nil || signature.Results().Len() > 1 {
		return "", false
	}

	// The call is stored once and awaited only when it returned a promise.
	*ctx.awaitTemp = true
	t := conditionalAwaitTemp
	expr := "(" + t + " = " + lowered + ", " + t + " instanceof Promise ? await " + t + " : " + t + ")"
	if signature.Results().Len() == 1 {
		result := signature.Results().At(0).Type()
		switch result.Underlying().(type) {
		case *types.Basic, *types.Interface:
		default:
			expr = "(" + expr + " as " + o.tsTypeFor(ctx, result) + ")"
		}
	}
	return expr, true
}

func parenthesizeAwaitedExpr(expr string) string {
	if strings.HasPrefix(expr, "await ") {
		return "(" + expr + ")"
	}
	return expr
}

func (o *LoweringOwner) genericTypeArgsExpr(ctx lowerFileContext, callee ast.Expr, typeArgExprs []ast.Expr) string {
	signature := genericFunctionSignature(ctx, callee)
	if signature == nil {
		return "undefined"
	}
	typeParams := signature.TypeParams()
	instanceArgs := instantiatedTypeArgs(ctx, callee)
	entries := make([]string, 0, typeParams.Len())
	static := true
	for idx := range typeParams.Len() {
		var typ types.Type
		if idx < len(typeArgExprs) {
			typ = ctx.semPkg.source.TypesInfo.TypeOf(typeArgExprs[idx])
		} else if instanceArgs != nil && idx < instanceArgs.Len() {
			typ = instanceArgs.At(idx)
		}
		if typ == nil {
			continue
		}
		if !typeIsHoistable(typ) {
			static = false
		}
		entries = append(entries, typeParams.At(idx).Obj().Name()+": "+o.genericTypeDescriptorExpr(ctx, typ))
	}
	if len(entries) == 0 {
		return "undefined"
	}

	// Type arguments without type parameters are the same at each call, so
	// they are created once.
	if static {
		return o.hoistStatic(ctx, o.genericTypeArgsLiteral(entries))
	}
	return o.genericTypeArgsLiteral(entries)
}

// instantiatedTypeArgs resolves the full type argument list the type checker
// recorded for a generic instantiation, whether written explicitly, partly
// inferred, or wholly inferred from the call's arguments.
func instantiatedTypeArgs(ctx lowerFileContext, callee ast.Expr) *types.TypeList {
	if ctx.semPkg == nil || ctx.semPkg.source == nil {
		return nil
	}
	instances := ctx.semPkg.source.TypesInfo.Instances
	if instances == nil {
		return nil
	}
	switch typed := callee.(type) {
	case *ast.Ident:
		if instance, ok := instances[typed]; ok {
			return instance.TypeArgs
		}
	case *ast.SelectorExpr:
		if instance, ok := instances[typed.Sel]; ok {
			return instance.TypeArgs
		}
	}
	return nil
}

func (o *LoweringOwner) genericTypeDescriptorExpr(ctx lowerFileContext, typ types.Type) string {
	return o.genericTypeDescriptorExprWithSeen(ctx, typ, make(map[types.Type]bool))
}

// genericTypeDescriptorExprWithSeen renders the generic type descriptor for
// typ. The method descriptors of a type include the descriptors of the type
// arguments of their receivers, which can refer back to typ, as in
// type App struct{ Base[*Win] } with type Win struct{ Base[*App] }. seen holds
// the types whose method descriptors are being rendered, and a type that is
// already in seen is rendered without methods, so that the generic method
// calls on it use the receiver's own methods.
func (o *LoweringOwner) genericTypeDescriptorExprWithSeen(ctx lowerFileContext, typ types.Type, seen map[types.Type]bool) string {
	if typeParam, ok := types.Unalias(typ).(*types.TypeParam); ok && typeParamInScope(ctx, typeParam) {
		return "__typeArgs?.[" + strconv.Quote(typeParam.Obj().Name()) + "] ?? { type: " +
			o.runtimeTypeInfoExpr(typ) + ", zero: () => " + o.lowerZeroValueExprFor(ctx, typ) + " }"
	}
	parts := []string{
		"type: " + o.runtimeTypeInfoExpr(typ),
		"zero: () => " + o.lowerZeroValueExprFor(ctx, typ),
	}
	if methods := o.genericMethodDescriptors(ctx, typ, seen); methods != "" {
		parts = append(parts, "methods: "+methods)
		if signatures := o.genericMethodSignatureDescriptors(typ); signatures != "" &&
			genericTypeDescriptorNeedsMethodSignatures(typ) {
			parts = append(parts, "methodSignatures: "+signatures)
		}
	}
	return "{ " + strings.Join(parts, ", ") + " }"
}

func genericTypeDescriptorNeedsMethodSignatures(typ types.Type) bool {
	named, _ := genericMethodSetDescriptorTarget(typ)
	if named == nil {
		return false
	}
	return namedStructType(named) == nil && !isInterfaceType(named)
}

func (o *LoweringOwner) genericMethodDescriptors(ctx lowerFileContext, typ types.Type, seen map[types.Type]bool) string {
	named, methodSetType := genericMethodSetDescriptorTarget(typ)
	if named == nil {
		return ""
	}
	return o.genericMethodDescriptorsForType(ctx, named, methodSetType, seen)
}

func (o *LoweringOwner) genericMethodDescriptorsForType(
	ctx lowerFileContext,
	named *types.Named,
	methodSetType types.Type,
	seen map[types.Type]bool,
) string {
	// Stop at a type already being described, as when a receiver's type
	// arguments refer back to it.
	typeKey := types.Unalias(methodSetType)
	if seen[typeKey] {
		return ""
	}
	seen[typeKey] = true
	defer delete(seen, typeKey)

	// Describe each method of the type's method set.
	methodSet := types.NewMethodSet(methodSetType)
	methods := make([]string, 0, methodSet.Len())
	for selection := range methodSet.Methods() {
		method, _ := selection.Obj().(*types.Func)
		if method == nil {
			continue
		}
		// An unreachable method has no function or class method to call.
		if !isInterfaceType(named) && !ctx.model.methodLive(named, method.Name()) {
			continue
		}
		// A promoted method is called through the embedding type's
		// forwarder, which takes that type's own type arguments when the
		// embedded type's method needs them (see promotedForwarderTakesTypeArgs),
		// and supplies the embedded type's itself.
		var genericArgs string
		if len(selection.Index()) > 1 {
			outer := receiverNamedType(methodSetType)
			if promotedForwarderTakesTypeArgs(outer, selection.Index()) {
				genericArgs = o.genericTypeArgsExprForNamed(ctx, outer, seen)
			}
		} else {
			genericArgs = o.genericReceiverTypeArgsExprForMethod(ctx, method, methodSetType, seen)
		}
		if namedStructType(named) != nil || isInterfaceType(named) {
			// A struct receiver may arrive as a VarRef when the caller
			// converted the address of a variable to the constraint's
			// pointer type-set element, so unwrap it before the
			// property-keyed call. Instances pass through unchanged.
			receiverExpr := "receiver"
			if namedStructType(named) != nil {
				receiverExpr = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + "(receiver)"
			}
			callArgs := make([]string, 0, 2)
			if genericArgs != "" {
				callArgs = append(callArgs, genericArgs)
			}
			params, rest := o.methodDescriptorParams(method)
			callArgs = append(callArgs, rest...)
			methods = append(methods, method.Name()+": (receiver: any"+params+") => "+receiverExpr+"."+method.Name()+"("+strings.Join(callArgs, ", ")+")")
			continue
		}
		receiver := "receiver"
		if sig, _ := method.Type().(*types.Signature); sig != nil {
			if recv := sig.Recv(); recv != nil {
				if _, ok := types.Unalias(recv.Type()).Underlying().(*types.Pointer); !ok {
					if _, ok := types.Unalias(methodSetType).Underlying().(*types.Pointer); ok {
						receiver = o.runtimeOwner.QualifiedHelper(RuntimeHelperPointerValue) + "(receiver)"
					} else {
						receiver = "(" + o.runtimeOwner.QualifiedHelper(RuntimeHelperIsVarRef) +
							"(receiver) ? receiver.value : receiver)"
					}
				}
			}
		}
		callArgs := []string{receiver}
		if genericArgs != "" {
			callArgs = append(callArgs, genericArgs)
		}
		params, rest := o.methodDescriptorParams(method)
		callArgs = append(callArgs, rest...)
		methods = append(methods, method.Name()+": (receiver: any"+params+") => "+
			"("+o.methodFunctionExpr(ctx, named.Origin(), method, method.Name())+" as any)("+strings.Join(callArgs, ", ")+")")
	}
	if len(methods) == 0 {
		return ""
	}
	return "{" + strings.Join(methods, ", ") + "}"
}

// methodDescriptorParams returns the parameters after the receiver of a
// method table entry for method, and the arguments it passes on. A method
// without parameters takes none, so that calling it spreads no arguments;
// any other method takes the rest of its arguments, dropping generic type
// arguments that a caller may pass first.
func (o *LoweringOwner) methodDescriptorParams(method *types.Func) (string, []string) {
	// A method without parameters ignores any arguments.
	if sig, _ := method.Type().(*types.Signature); sig != nil && sig.Params().Len() == 0 {
		return "", nil
	}

	// Other methods pass on their arguments.
	return ", ...args: any[]", []string{"..." + o.runtimeOwner.QualifiedHelper(RuntimeHelperStripGenericTypeArgs) + "(args)"}
}

func (o *LoweringOwner) genericMethodSignatureDescriptors(typ types.Type) string {
	_, methodSetType := genericMethodSetDescriptorTarget(typ)
	if methodSetType == nil {
		return ""
	}
	methodSet := types.NewMethodSet(methodSetType)
	methods := make([]string, 0, methodSet.Len())
	for method := range methodSet.Methods() {
		fn, _ := method.Obj().(*types.Func)
		if fn != nil {
			methods = append(methods, o.runtimeMethodSignature(fn, make(map[types.Type]bool)))
		}
	}
	if len(methods) == 0 {
		return ""
	}
	return "[" + strings.Join(methods, ", ") + "]"
}

// promotedForwarderTakesTypeArgs reports whether the forwarder that the class
// of outer, a struct type, declares for the method promoted along index (the
// index of a method selection) takes outer's type arguments, as
// lowerEmbeddedMethodForwarders declares it: when the type that declares the
// method is generic in outer's type parameters, such as Base[T] embedded in
// Number[T], and not for a plain or fixed instance embedded type, such as a
// struct without type parameters or Inner[int].
func promotedForwarderTakesTypeArgs(outer *types.Named, index []int) bool {
	// Only a generic struct's forwarders can take type arguments.
	if outer == nil || len(index) < 2 {
		return false
	}
	structType, ok := outer.Origin().Underlying().(*types.Struct)
	if !ok || index[0] >= structType.NumFields() {
		return false
	}

	// A field of a named non-struct type has free method functions, which
	// its forwarders call without type arguments.
	typ := structType.Field(index[0]).Type()
	if namedStructType(typ) == nil && pointerToNamedStructType(typ) == nil && !isInterfaceType(typ) {
		return false
	}

	// Follow the embedded fields to the type that declares the method, as
	// instantiated in outer's own type parameters.
	for _, idx := range index[1 : len(index)-1] {
		embedded, ok := derefPointerType(typ).Underlying().(*types.Struct)
		if !ok || idx >= embedded.NumFields() {
			return false
		}
		typ = embedded.Field(idx).Type()
	}
	return len(genericReceiverTypeParams(typ)) != 0 && typeContainsTypeParam(typ)
}

func genericMethodSetDescriptorTarget(typ types.Type) (*types.Named, types.Type) {
	named, _ := types.Unalias(typ).(*types.Named)
	if named == nil {
		if pointer := pointerToNamedStructType(typ); pointer != nil {
			return pointer, typ
		}
		return namedNonStructMethodSetType(typ)
	}
	return named, named
}

func namedNonStructMethodSetType(typ types.Type) (*types.Named, types.Type) {
	if named := namedNonStructType(typ); named != nil {
		return named, named
	}
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return nil, nil
	}
	named := namedNonStructType(pointer.Elem())
	if named == nil {
		return nil, nil
	}
	return named, typ
}

func genericMethodSetHasReceiverTypeParams(typ types.Type) bool {
	if typ == nil {
		return false
	}
	for method := range types.NewMethodSet(typ).Methods() {
		fn, _ := method.Obj().(*types.Func)
		if fn == nil {
			continue
		}
		signature, _ := fn.Type().(*types.Signature)
		if signature != nil && signature.Recv() != nil &&
			len(genericReceiverTypeParams(signature.Recv().Type())) != 0 {
			return true
		}
	}
	return false
}

func methodFunctionName(receiver *types.Named, method string) string {
	if receiver == nil || receiver.Obj() == nil {
		return safeIdentifier(method)
	}
	return safeIdentifier(receiver.Obj().Name()) + "_" + safeIdentifier(method)
}

func methodReceiverNamedType(obj types.Object) *types.Named {
	fn, _ := obj.(*types.Func)
	if fn == nil {
		return nil
	}
	signature, _ := fn.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return nil
	}
	return receiverNamedType(signature.Recv().Type())
}

func (o *LoweringOwner) methodFunctionExpr(
	ctx lowerFileContext,
	receiver *types.Named,
	obj types.Object,
	method string,
) string {
	name := methodFunctionName(receiver, method)
	if alias := ctx.localAliases[obj]; alias != "" {
		return alias + "." + name
	}
	if receiver != nil && receiver.Obj() != nil && receiver.Obj().Pkg() != nil {
		if alias := ctx.importPaths[receiver.Obj().Pkg().Path()]; alias != "" {
			return alias + "." + name
		}
	}
	return name
}

// namedTypeExpr returns the type-position spelling of named, including type
// arguments for instantiated override types.
func (o *LoweringOwner) namedTypeExpr(ctx lowerFileContext, named *types.Named) string {
	baseName := namedValueExpr(ctx, named)
	if args := o.overrideTypeArgsExpr(ctx, named); args != "" {
		return baseName + "<" + args + ">"
	}
	return baseName
}

// namedValueExpr returns the value-position spelling of named: the qualified
// class name without type arguments. TypeScript rejects a property access such
// as .prototype after an instantiation expression.
func namedValueExpr(ctx lowerFileContext, named *types.Named) string {
	if named == nil || named.Obj() == nil {
		return "unknown"
	}
	baseName := safeIdentifier(named.Obj().Name())
	if alias := ctx.localAliases[named.Obj()]; alias != "" {
		return alias + "." + baseName
	}
	if named.Obj().Pkg() != nil {
		if alias := ctx.importPaths[named.Obj().Pkg().Path()]; alias != "" {
			return alias + "." + baseName
		}
	}
	return baseName
}

func (o *LoweringOwner) overrideTypeArgsExpr(ctx lowerFileContext, named *types.Named) string {
	if o.overrideOwner == nil || named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return ""
	}
	args := named.TypeArgs()
	if args == nil || args.Len() == 0 {
		return ""
	}
	if !o.overrideFacts().HasPackage(named.Obj().Pkg().Path()) {
		return ""
	}
	parts := make([]string, 0, args.Len())
	for typ := range args.Types() {
		parts = append(parts, o.tsTypeFor(ctx, typ))
	}
	return strings.Join(parts, ", ")
}

func (o *LoweringOwner) overrideFacts() *OverrideFacts {
	if o.overrideOwner == nil {
		return nil
	}
	facts, diagnostics := o.overrideOwner.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		return nil
	}
	return facts
}

func (o *LoweringOwner) tsReceiverTypeFor(ctx lowerFileContext, typ types.Type) string {
	if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		if named := namedNonStructType(pointer.Elem()); named != nil {
			return "$.VarRef<" + o.namedTypeExpr(ctx, named) + "> | null"
		}
	}
	return o.tsTypeFor(ctx, typ)
}

// fileTypePackagePath returns the package path and runtime names of the
// named types declared in file, including local types, when the package
// path differs from the package name. Runtime type names carry only the
// package name, so reflect needs the path registered to report PkgPath.
// Types in package main report "main", as in Go.
func fileTypePackagePath(semPkg *semanticPackage, file *ast.File) (string, []string) {
	// Package main and a package whose path is its name need no registration.
	pkg := semPkg.source.Types
	if pkg == nil || pkg.Name() == "main" || pkg.Path() == pkg.Name() {
		return "", nil
	}

	// The names are the types declared in the file, in source order.
	var names []string
	ast.Inspect(file, func(node ast.Node) bool {
		// Only a declared type of the file is registered.
		spec, ok := node.(*ast.TypeSpec)
		if !ok {
			return true
		}

		// An alias names an existing type, so it has no type of its own to register.
		obj, _ := semPkg.source.TypesInfo.Defs[spec.Name].(*types.TypeName)
		if obj == nil || obj.IsAlias() {
			return true
		}
		if named, ok := obj.Type().(*types.Named); ok {
			names = append(names, runtimeNamedTypeName(named))
		}
		return true
	})
	if len(names) == 0 {
		return "", nil
	}
	return pkg.Path(), names
}

func runtimeNamedTypeName(named *types.Named) string {
	if named == nil || named.Obj() == nil {
		return ""
	}
	if named.Obj().Pkg() == nil {
		return named.Obj().Name()
	}
	return runtimePackageName(named.Obj().Pkg()) + "." + runtimeTypeObjectName(named.Obj())
}

func goRuntimeTypeString(typ types.Type) string {
	typ = types.Unalias(typ)
	switch typed := typ.(type) {
	case *types.Named:
		return runtimeNamedTypeName(typed)
	case *types.Pointer:
		return "*" + goRuntimeTypeString(typed.Elem())
	case *types.Slice:
		return "[]" + goRuntimeTypeString(typed.Elem())
	case *types.Array:
		return "[" + strconv.FormatInt(typed.Len(), 10) + "]" + goRuntimeTypeString(typed.Elem())
	case *types.Map:
		return "map[" + goRuntimeTypeString(typed.Key()) + "]" + goRuntimeTypeString(typed.Elem())
	case *types.Chan:
		switch typed.Dir() {
		case types.RecvOnly:
			return "<-chan " + goRuntimeTypeString(typed.Elem())
		case types.SendOnly:
			return "chan<- " + goRuntimeTypeString(typed.Elem())
		default:
			return "chan " + goRuntimeTypeString(typed.Elem())
		}
	default:
		return types.TypeString(typ, runtimePackageName)
	}
}

func basicRuntimeName(basic *types.Basic) string {
	if basic == nil {
		return "unknown"
	}
	switch basic.Kind() {
	case types.Bool:
		return "bool"
	case types.String:
		return "string"
	case types.Int:
		return "int"
	case types.Int8:
		return "int8"
	case types.Int16:
		return "int16"
	case types.Int32:
		return "int32"
	case types.Int64:
		return "int64"
	case types.Uint:
		return "uint"
	case types.Uint8:
		return "uint8"
	case types.Uint16:
		return "uint16"
	case types.Uint32:
		return "uint32"
	case types.Uint64:
		return "uint64"
	case types.Uintptr:
		return "uintptr"
	case types.Float32:
		return "float32"
	case types.Float64:
		return "float64"
	case types.Complex64:
		return "complex64"
	case types.Complex128:
		return "complex128"
	default:
		if basic.Info()&types.IsNumeric != 0 {
			return "int"
		}
		return basic.Name()
	}
}

func loweringUnsupported(kind string, subject string, detail string) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/lowering:unsupported",
		Message:  "unsupported " + kind + " in v2 lowering seed",
		Detail:   subject + ": " + detail,
	}
}

// valueReadOnlyArg reports whether expr, the value passed for a value
// receiver or parameter of the given kind, can be passed without a copy. A
// function that changes no storage but its locals can share any value while
// it runs, unless it suspends, when other code could change the value. One
// that may change other storage can share only a value that no other
// reference reaches (see isUnaliasedLocalValue), even across a suspension,
// since only the caller, which waits for it, can change that value.
func valueReadOnlyArg(ctx lowerFileContext, kind valueReadOnlyKind, async bool, expr ast.Expr) bool {
	// A composite literal is a new value that nothing else reaches.
	if _, ok := ast.Unparen(expr).(*ast.CompositeLit); ok && kind != valueNotReadOnly {
		return true
	}

	// Otherwise the kind says which values the function can share.
	switch kind {
	case valueReadOnly:
		return !async || isUnaliasedLocalValue(ctx, expr)
	case valueReadOnlyUnaliased:
		return isUnaliasedLocalValue(ctx, expr)
	}
	return false
}

// isUnaliasedLocalValue reports whether expr is a local struct variable, or
// a struct field of one, that no reference other than the variable reaches:
// its address is never taken, no pointer method is called on it or its
// fields, no function literal refers to it, and it is not a range variable,
// which may share an element of the ranged value.
func isUnaliasedLocalValue(ctx lowerFileContext, expr ast.Expr) bool {
	// Find the variable that expr reads through plain field selections.
	info := ctx.semPkg.source.TypesInfo
	var ident *ast.Ident
	for ident == nil {
		switch typed := ast.Unparen(expr).(type) {
		case *ast.Ident:
			ident = typed
		case *ast.SelectorExpr:
			selection := info.Selections[typed]
			if selection == nil || selection.Kind() != types.FieldVal || selection.Indirect() {
				return false
			}
			expr = typed.X
		default:
			return false
		}
	}

	// The variable is a struct or array local of this file.
	obj, ok := info.Uses[ident].(*types.Var)
	if !ok || obj.Pkg() == nil || obj.Parent() == nil || obj.Parent() == obj.Pkg().Scope() ||
		!isValueCopyType(obj.Type()) || ctx.model.needsVarRef[obj] || ctx.file == nil {
		return false
	}
	if obj.Pos() < ctx.file.Pos() || obj.Pos() >= ctx.file.End() {
		return false
	}

	// A local that holds a borrowed result shares the value of the argument
	// that the call borrowed it from.
	if arg, ok := borrowedLocalArg(ctx, obj); ok {
		return isUnaliasedLocalValue(ctx, arg)
	}

	// Find the body of the function that declares it, which is not a range
	// variable.
	path, _ := astutil.PathEnclosingInterval(ctx.file, obj.Pos(), obj.Pos())
	var body *ast.BlockStmt
	for _, node := range path {
		switch typed := node.(type) {
		case *ast.RangeStmt:
			if (typed.Key != nil && typed.Key.Pos() == obj.Pos()) || (typed.Value != nil && typed.Value.Pos() == obj.Pos()) {
				return false
			}
		case *ast.FuncDecl:
			body = typed.Body
		case *ast.FuncLit:
			body = typed.Body
		}
		if body != nil {
			break
		}
	}
	if body == nil {
		return false
	}

	// Look for a reference to the variable that the body creates.
	rootIsObj := func(expr ast.Expr) bool {
		return info.Uses[exprRootIdent(expr)] == obj
	}
	aliased := false
	ast.Inspect(body, func(node ast.Node) bool {
		if aliased {
			return false
		}
		switch typed := node.(type) {
		case *ast.FuncLit:
			ast.Inspect(typed.Body, func(node ast.Node) bool {
				if ident, ok := node.(*ast.Ident); ok && info.Uses[ident] == obj {
					aliased = true
				}
				return !aliased
			})
			return false
		case *ast.UnaryExpr:
			aliased = typed.Op == token.AND && rootIsObj(typed.X)
		case *ast.SliceExpr:
			aliased = rootIsObj(typed.X)
		case *ast.SelectorExpr:
			if selection := info.Selections[typed]; selection != nil && selection.Kind() == types.MethodVal && rootIsObj(typed.X) {
				if signature, ok := selection.Obj().Type().(*types.Signature); ok && signature.Recv() != nil {
					_, aliased = signature.Recv().Type().(*types.Pointer)
				}
			}
		}
		return !aliased
	})
	return !aliased
}

// isTypeParamType reports whether typ is a type parameter, whose values may
// be structs or arrays that the runtime copies.
func isTypeParamType(typ types.Type) bool {
	_, ok := types.Unalias(typ).(*types.TypeParam)
	return ok
}

// isSimpleLoweredOperand reports whether a lowered expression can be
// evaluated twice: identifiers, property reads, non-null assertions and calls
// of pure runtime readers.
func isSimpleLoweredOperand(value string) bool {
	// An await may resolve to something else the second time.
	if value == "" || strings.Contains(value, "await") {
		return false
	}

	// The only calls are of runtime readers without side effects.
	for _, call := range simpleOperandCalls.FindAllStringSubmatch(value, -1) {
		switch call[1] {
		case "$.pointerValue", "$.pointerTarget", "$.arrayIndex":
		default:
			return false
		}
	}

	// The rest is names, property reads, indexes and assertions.
	for _, r := range value {
		if strings.ContainsRune("_$.!()<>, |[]", r) || (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') {
			continue
		}
		return false
	}
	return true
}

// simpleOperandCalls matches the callee of each call in a lowered expression.
var simpleOperandCalls = regexp.MustCompile(`([\w$.]+)(?:<[^()]*>)?\(`)
