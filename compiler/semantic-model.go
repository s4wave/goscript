package compiler

import (
	"cmp"
	"context"
	"go/ast"
	"go/token"
	"go/types"
	"maps"
	"runtime"
	"slices"
	"strconv"
	"strings"

	"golang.org/x/sync/errgroup"
	"golang.org/x/tools/go/packages"
)

// SemanticModelOwner owns immutable Go semantic facts used by lowering.
type SemanticModelOwner struct {
	overrideOwner *OverrideRegistryOwner
}

// NewSemanticModelOwner creates the semantic model owner.
func NewSemanticModelOwner(overrideOwners ...*OverrideRegistryOwner) *SemanticModelOwner {
	overrideOwner := NewOverrideRegistryOwner()
	if len(overrideOwners) != 0 && overrideOwners[0] != nil {
		overrideOwner = overrideOwners[0]
	}
	return &SemanticModelOwner{overrideOwner: overrideOwner}
}

// SemanticBuildOptions configures one semantic model build.
type SemanticBuildOptions struct {
	// DeferredFunctions names the functions lowered as deferred.
	DeferredFunctions []string
	// Summaries holds the stored body summaries of the packages checked
	// without bodies, by package path.
	Summaries map[string][]byte
	// Summarize names the packages whose body summaries the build extracts.
	Summarize map[string]bool
	// WholeProgram reports that the graph is a whole program, so exported
	// interfaces whose implementations are all compiled Go code are closed
	// over the graph. Otherwise a call of an exported interface method makes
	// its caller async.
	WholeProgram bool
	// ReportAsync asks for an async report (see AsyncReport).
	ReportAsync bool
}

// Build constructs semantic facts for a package graph.
//
// When a stored body summary does not apply, Build stops after the package
// shards and lists the package in the model's staleSummaries; the caller
// checks it with bodies and builds again.
func (o *SemanticModelOwner) Build(ctx context.Context, graph *PackageGraph, opts SemanticBuildOptions) (*SemanticModel, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if graph == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/semantic:no-graph",
			Message:  "semantic model requires a loaded package graph",
		}}
	}

	model := newSemanticModel()
	overrideFacts, diagnostics := o.overrideOwner.Facts(ctx)
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}

	var nodes []*PackageGraphNode
	var overridePkgs []*types.Package
	for _, node := range graph.Nodes {
		if node.OverrideCandidate {
			if pkg := graph.packagesByPath[node.PkgPath]; pkg != nil && pkg.Types != nil {
				overridePkgs = append(overridePkgs, pkg.Types)
			}
			continue
		}
		if graph.packagesByPath[node.PkgPath] == nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/semantic:missing-package",
				Message:  "package graph node is missing loaded package data",
				Detail:   node.PkgPath,
			})
			continue
		}
		nodes = append(nodes, node)
	}

	// A package's facts depend only on that package, so each package is built
	// into its own shard concurrently. The shards then merge in graph order.
	// The async directives of every package are known before any package's
	// facts, which they decide.
	sources := make([]*packages.Package, len(nodes))
	for idx, node := range nodes {
		sources[idx] = graph.packagesByPath[node.PkgPath]
	}
	directives, directiveDiagnostics := collectAsyncDirectives(sources)
	diagnostics = append(diagnostics, directiveDiagnostics...)
	model.asyncDirectives = directives

	// So are the functions that //goscript:callsite marks, whose calls in any
	// package pass their positions.
	callSites, callSiteDiagnostics := collectCallSiteDirectives(sources)
	diagnostics = append(diagnostics, callSiteDiagnostics...)
	model.callSiteFunctions = callSites

	var objects *summaryObjects
	if len(opts.Summaries) != 0 || len(opts.Summarize) != 0 {
		objects = newSummaryObjects(graph)
	}
	shards := make([]*SemanticModel, len(nodes))
	summaries := make([][]byte, len(nodes))
	applied := make([]bool, len(nodes))
	forEachParallel(len(nodes), func(idx int) {
		if ctx.Err() == nil {
			pkgPath := nodes[idx].PkgPath
			shards[idx], summaries[idx], applied[idx] = o.buildPackage(
				nodes[idx],
				graph.packagesByPath[pkgPath],
				overrideFacts,
				directives,
				objects,
				opts.Summaries[pkgPath],
				opts.Summarize[pkgPath],
			)
		}
	})
	if err := ctx.Err(); err != nil {
		diagnostics = append(diagnostics, contextCanceledDiagnostic(err))
		model.freeze()
		return model, diagnostics
	}
	for idx, node := range nodes {
		if !applied[idx] {
			model.staleSummaries = append(model.staleSummaries, node.PkgPath)
		}
		if summaries[idx] != nil {
			model.summaries[node.PkgPath] = summaries[idx]
		}
	}
	if len(model.staleSummaries) != 0 {
		model.freeze()
		return model, diagnostics
	}
	for _, shard := range shards {
		model.mergePackage(shard)
	}

	// A hand-written override package exports its variables as plain
	// values, so taking the address of one does not box it in a VarRef.
	for obj := range model.needsVarRef {
		if pkg := obj.Pkg(); pkg != nil && overrideFacts.HasPackage(pkg.Path()) && obj.Parent() == pkg.Scope() {
			delete(model.needsVarRef, obj)
		}
	}
	model.collectVarRefNames()
	markTransientPointers(model)

	// Package variables that read only unchanging data initialize on first
	// read, which the marks of every package decide.
	model.deferPackageTables(opts.WholeProgram)
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}

	// Deferred functions load on first call.
	diagnostics = append(diagnostics, model.deferFunctions(opts.DeferredFunctions)...)
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}

	// Func parameters that stay in the call are callback parameters.
	markCallbackParams(model, programFuncValues(model))

	// Color the functions that may suspend.
	var report *asyncReporter
	if opts.ReportAsync {
		report = newAsyncReporter(model, newOverrideBoundary(overridePkgs, overrideFacts), opts.WholeProgram)
	}
	diagnostics = append(diagnostics, o.colorAsync(ctx, model, overrideFacts, overridePkgs, opts.WholeProgram, report)...)

	// Functions that reflection calls with callbacks get twins.
	markReflectTwins(model)
	model.freeze()
	return model, diagnostics
}

// colorAsync resolves the interface implementation graph and colors every
// function that may suspend. In a whole program, exported interfaces whose
// implementations are all compiled Go code are closed over the graph.
func (o *SemanticModelOwner) colorAsync(
	ctx context.Context,
	model *SemanticModel,
	overrideFacts *OverrideFacts,
	overridePkgs []*types.Package,
	wholeProgram bool,
	report *asyncReporter,
) []Diagnostic {
	// Give each shape called through a value a class, after adding the
	// values override packages produce, and index the callers and the calls
	// that pass functions.
	overrideValues := addOverrideFuncValues(model, overridePkgs)
	overrideValues = append(overrideValues, addSuspendingFuncValues(model)...)
	internFuncValueClasses(model)
	addMutexNodes(model)
	model.functionCallers = semanticFunctionCallers(model)
	asyncArgumentSites := asyncArgumentCallSites(model)

	// Pair the interfaces with the method sets that implement them.
	methodSets, diagnostics := o.resolveImplementationMethodSets(ctx, model, overrideFacts, overridePkgs)
	if diagnosticsHaveErrors(diagnostics) {
		return diagnostics
	}
	interfaceGraph, interfaceDiagnostics := o.resolveInterfaceImplementationGraph(ctx, model, methodSets)
	diagnostics = append(diagnostics, interfaceDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		return diagnostics
	}
	anonymousInterfaceGraph, anonymousInterfaceDiagnostics := o.resolveAnonymousInterfaceImplementationGraph(ctx, model, methodSets)
	diagnostics = append(diagnostics, anonymousInterfaceDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		return diagnostics
	}

	// Exported interfaces close over the graph of a whole program.
	var closed map[*types.Named]bool
	if wholeProgram {
		boundary := newOverrideBoundary(overridePkgs, overrideFacts)
		closed = closedInterfaces(model, interfaceGraph, boundary)
		model.syncOverrideInterfaces = make(map[*types.Named]bool)
		for named := range closed {
			if boundary.pkgPaths[named.Obj().Pkg().Path()] {
				model.syncOverrideInterfaces[named] = true
			}
		}
	}

	// Metadata makes some override functions and methods, and interface
	// methods, async only in a program with async methods of given names.
	// In a whole program such an interface method is conditional, not open.
	values := append(programFuncValues(model), overrideValues...)
	asyncWhen := asyncWhenMethodFunctions(model, overrideFacts, values)
	model.asyncWhenTargets = asyncWhenTargetSet(asyncWhen)
	var conditional map[*types.Func]bool
	if wholeProgram {
		conditional = asyncWhenInterfaceMethods(asyncWhen)
	}

	// The graph does not color the methods of open interfaces.
	openMethods := openInterfaceMethods(model, interfaceGraph, anonymousInterfaceGraph, closed, conditional, values)

	// Function values reach the classes of calls that match them.
	openMethodSet := make(map[*types.Func]bool, len(openMethods))
	for _, method := range openMethods {
		openMethodSet[method] = true
	}
	model.openMethods = openMethodSet
	valueGraph := buildFuncValueGraph(model, overrideFacts, values, openMethodSet, wholeProgram)

	// A mutex that escapes the analysis is locked async.
	markMutexEscapes(model, embeddedMutexesExposed(interfaceGraph, anonymousInterfaceGraph,
		programMakesFuncValues(model, overrideFacts, values)))

	// Propagate the async marks to their fixed point.
	interfaceAsyncEdges, markDiagnostics := o.buildInterfaceAsyncEdges(ctx, model, overrideFacts, interfaceGraph)
	diagnostics = append(diagnostics, markDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		return diagnostics
	}
	return append(diagnostics, colorAsyncFunctions(ctx, model, asyncRoots{
		sites:            asyncArgumentSites,
		openMethods:      openMethods,
		values:           valueGraph,
		asyncWhenSeeds:   asyncWhenSeeds(asyncWhen, overrideFacts, overridePkgs),
		directiveMethods: model.asyncDirectives.asyncInterfaceMethods(),
		report:           report,
	}, interfaceAsyncEdges, anonymousInterfaceGraph, asyncWhen)...)
}

func newSemanticModel() *SemanticModel {
	return &SemanticModel{
		packages:                 make(map[string]*semanticPackage),
		addressTaken:             make(map[types.Object]bool),
		needsVarRef:              make(map[types.Object]bool),
		changedVars:              make(map[types.Object]bool),
		effectFreeFuncs:          make(map[types.Object]bool),
		functions:                make(map[*types.Func]*semanticFunction),
		functionCallers:          make(map[*types.Func][]*semanticFunction),
		functionsByFullName:      make(map[string]*semanticFunction),
		functionFullNames:        make(map[*types.Func]string),
		functionAliases:          make(map[*types.Func]*semanticFunction),
		lateMemo:                 newModelLateMemo(),
		types:                    make(map[*types.Named]*semanticType),
		values:                   make(map[types.Object]*semanticValue),
		generatedImports:         make(map[string]map[string]bool),
		generatedImportTypes:     make(map[string]map[types.Type]bool),
		asyncInterfaceMethods:    make(map[string]bool),
		asyncInterfaceMethodObjs: make(map[*types.Func]bool),
		asyncOverrideFunctions:   make(map[*types.Func]bool),
		funcValueClasses:         make(map[string]*types.Func),
		asyncValueClasses:        make(map[*types.Func]bool),
		valueNodes:               make(map[*types.Func]*semanticFunction),
		funcLitNodes:             make(map[token.Pos]*semanticFunction),
		summaries:                make(map[string][]byte),
	}
}

// buildPackage collects one package's declarations and syntax facts into a
// new shard. It reads no other package's facts, so packages build
// concurrently.
//
// A package with a stored body summary was checked without bodies: the shard
// collects the declaration region and applies the summary. It reports false
// when the summary does not apply. Otherwise, when summarize is set, it
// returns the package's body summary, or nil when the package cannot be
// summarized.
func (o *SemanticModelOwner) buildPackage(
	node *PackageGraphNode,
	pkg *packages.Package,
	overrideFacts *OverrideFacts,
	directives asyncDirectives,
	objects *summaryObjects,
	stored []byte,
	summarize bool,
) (*SemanticModel, []byte, bool) {
	shard := newSemanticModel()
	semPkg := &semanticPackage{
		pkgPath:          node.PkgPath,
		name:             node.Name,
		source:           pkg,
		generatedImports: make(map[string]map[string]bool),
		functionDecls:    make(map[*types.Func]*ast.FuncDecl),
	}
	shard.packages[node.PkgPath] = semPkg
	if stored != nil {
		return shard, nil, o.applyBodySummary(shard, semPkg, pkg, objects, stored)
	}

	// Collect the declarations and the facts of the bodies.
	for _, file := range pkg.Syntax {
		tokenFile := pkg.Fset.File(file.Pos())
		o.collectFileDeclarations(shard, semPkg, pkg, tokenFile, file)
		o.collectFacts(shard, semPkg, pkg, tokenFile, file, nil, nil)
	}
	collectEffectFreeFunctions(shard, pkg)
	collectCallFacts(shard, semPkg, pkg, overrideFacts)
	semPkg.lazyVars = lazyPackageVars(semPkg)
	collectFunctionFacts(shard, semPkg, pkg, overrideFacts, directives)
	semPkg.asyncArgumentCalls = collectAsyncArgumentCalls(pkg, semPkg.literalKey, directives)

	// Summarize the bodies for a later check without them.
	if !summarize {
		return shard, nil, true
	}
	summary, ok := summarizeBody(shard, semPkg, objects)
	if !ok {
		return shard, nil, true
	}
	encoded, ok := summary.encode()
	if !ok {
		return shard, nil, true
	}
	return shard, encoded, true
}

// applyBodySummary builds the shard of a package checked without bodies from
// its declaration region and its stored body summary.
func (o *SemanticModelOwner) applyBodySummary(
	shard *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	objects *summaryObjects,
	stored []byte,
) bool {
	summary, ok := decodeBodySummary(stored)
	if !ok {
		return false
	}
	applier, ok := newBodyApplier(summary, pkg, objects)
	if !ok {
		return false
	}
	for _, file := range pkg.Syntax {
		tokenFile := pkg.Fset.File(file.Pos())
		o.collectFileDeclarations(shard, semPkg, pkg, tokenFile, file)
		o.collectFacts(shard, semPkg, pkg, tokenFile, file, nil, func(body ast.Node) {
			applier.addLiterals(o, shard, semPkg, tokenFile, body)
		})
	}
	return applier.apply(shard, semPkg)
}

// mergePackage adds a shard built by buildPackage to the model. A function
// another package already added, such as a method of an embedded interface,
// keeps its first entry and leaves the shard's package function list.
func (m *SemanticModel) mergePackage(shard *SemanticModel) {
	maps.Copy(m.functionFullNames, shard.functionFullNames)
	merged := make(map[*semanticFunction]*semanticFunction, len(shard.functions))
	for pkgPath, semPkg := range shard.packages {
		m.packages[pkgPath] = semPkg
		kept := semPkg.functions[:0]
		for _, semFn := range semPkg.functions {
			if existing := m.existingFunction(semFn.function); existing != nil {
				merged[semFn] = existing
				continue
			}
			merged[semFn] = semFn
			kept = append(kept, semFn)
			if fullName := m.functionFullName(semFn.function); fullName != "" {
				m.functionsByFullName[fullName] = semFn
			}
		}
		semPkg.functions = kept
	}
	for fn, semFn := range shard.functions {
		if m.functions[fn] == nil {
			m.functions[fn] = merged[semFn]
		}
	}

	// The literal and initializer nodes are keyed by their synthetic keys.
	for _, semPkg := range shard.packages {
		for pos, node := range semPkg.funcLits {
			m.funcLitNodes[pos] = node
			m.valueNodes[node.function] = node
		}
		for _, node := range semPkg.lazyInits {
			m.valueNodes[node.function] = node
		}
		for _, node := range semPkg.lockSections {
			m.valueNodes[node.function] = node
		}
	}
	maps.Copy(m.types, shard.types)
	maps.Copy(m.values, shard.values)

	// The marks and generated imports join the program's.
	maps.Copy(m.addressTaken, shard.addressTaken)
	maps.Copy(m.needsVarRef, shard.needsVarRef)
	maps.Copy(m.changedVars, shard.changedVars)
	maps.Copy(m.effectFreeFuncs, shard.effectFreeFuncs)
	maps.Copy(m.generatedImports, shard.generatedImports)
	maps.Copy(m.generatedImportTypes, shard.generatedImportTypes)
}

// collectVarRefNames records each package's variable reference names. A mark
// can come from any package, so this runs after every shard merged.
func (m *SemanticModel) collectVarRefNames() {
	for _, semPkg := range m.packages {
		for _, value := range semPkg.values {
			if !m.needsVarRef[value.object] {
				continue
			}
			if semPkg.varRefNames == nil {
				semPkg.varRefNames = make(map[string]bool)
			}
			semPkg.varRefNames[value.name] = true
		}
	}
}

// existingFunction returns the entry addFunction would reuse for fn.
func (m *SemanticModel) existingFunction(fn *types.Func) *semanticFunction {
	if existing := m.functions[fn]; existing != nil {
		return existing
	}
	if origin := fn.Origin(); origin != nil {
		if existing := m.functions[origin]; existing != nil {
			return existing
		}
	}
	if fullName := m.functionFullName(fn); fullName != "" {
		return m.functionsByFullName[fullName]
	}
	return nil
}

// collectFileDeclarations records imports, declarations, and function syntax before lowering.
func (o *SemanticModelOwner) collectFileDeclarations(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	file *ast.File,
) {
	for _, importSpec := range file.Imports {
		importPath, err := strconv.Unquote(importSpec.Path.Value)
		if err != nil {
			importPath = importSpec.Path.Value
		}
		var name string
		if importSpec.Name != nil {
			name = importSpec.Name.Name
		}
		position := sourcePosInFile(tokenFile, importSpec.Pos())
		semPkg.imports = append(semPkg.imports, semanticImport{
			path:     importPath,
			name:     name,
			file:     position.file,
			position: position,
		})
	}

	for _, decl := range file.Decls {
		switch typed := decl.(type) {
		case *ast.GenDecl:
			o.collectGenDecl(model, semPkg, pkg, tokenFile, typed)
		case *ast.FuncDecl:
			fn, _ := pkg.TypesInfo.Defs[typed.Name].(*types.Func)
			if fn == nil {
				continue
			}
			position := sourcePosInFile(tokenFile, typed.Name.Pos())
			semFn := o.addFunction(model, semPkg, fn, position)
			semFn.hasBody = typed.Body != nil
			semPkg.functionDecls[fn] = typed
			semPkg.declarations = append(semPkg.declarations, semanticDeclaration{
				kind:     "func",
				name:     typed.Name.Name,
				object:   fn,
				position: position,
			})
		}
	}
}

// collectGenDecl records package types, values, and their generated imports.
func (o *SemanticModelOwner) collectGenDecl(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	decl *ast.GenDecl,
) {
	for _, spec := range decl.Specs {
		switch typed := spec.(type) {
		case *ast.TypeSpec:
			obj, _ := pkg.TypesInfo.Defs[typed.Name].(*types.TypeName)
			if obj == nil {
				continue
			}
			position := sourcePosInFile(tokenFile, typed.Name.Pos())
			o.addType(model, semPkg, obj, position, typed.Type, pkg.TypesSizes)
			o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, obj.Type())
			semPkg.declarations = append(semPkg.declarations, semanticDeclaration{
				kind:     "type",
				name:     typed.Name.Name,
				object:   obj,
				position: position,
			})
		case *ast.ValueSpec:
			for _, name := range typed.Names {
				obj := pkg.TypesInfo.Defs[name]
				switch concrete := obj.(type) {
				case *types.Var:
					position := sourcePosInFile(tokenFile, name.Pos())
					o.addValue(model, semPkg, concrete, position, true)
					semPkg.initOrder = append(semPkg.initOrder, concrete)
					semPkg.declarations = append(semPkg.declarations, semanticDeclaration{
						kind:     "var",
						name:     name.Name,
						object:   concrete,
						position: position,
					})
					o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, concrete.Type())
				case *types.Const:
					position := sourcePosInFile(tokenFile, name.Pos())
					o.addValue(model, semPkg, concrete, position, true)
					semPkg.declarations = append(semPkg.declarations, semanticDeclaration{
						kind:     "const",
						name:     name.Name,
						object:   concrete,
						position: position,
					})
					o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, concrete.Type())
				}
			}
		}
	}
}

// collectFacts walks syntax within tokenFile, including nested function
// literals. A non-nil skipBody receives each function and function literal
// body instead, for a package checked without bodies.
func (o *SemanticModelOwner) collectFacts(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	node ast.Node,
	lit *ast.FuncLit,
	skipBody func(ast.Node),
) {
	ast.Inspect(node, func(node ast.Node) bool {
		if skipBody != nil {
			switch node.(type) {
			case *ast.BlockStmt, *ast.FuncLit:
				skipBody(node)
				return false
			}
		}

		// Mark the package variables node may change, then its other facts.
		recordChangedPackageVars(model, pkg, node)
		switch typed := node.(type) {
		case *ast.TypeSpec:
			o.recordTypeSpec(model, semPkg, pkg, tokenFile, typed)
		case *ast.Ident:
			o.addDefinedObject(model, semPkg, pkg, tokenFile, typed)
		case *ast.UnaryExpr:
			if typed.Op == token.AND {
				o.recordAddressTaken(model, pkg, typed.X)
			}
		case *ast.SelectorExpr:
			o.recordPointerReceiverUse(model, pkg, typed)
		case *ast.TypeAssertExpr:
			o.recordTypeAssertion(semPkg, pkg, tokenFile, typed)
		case *ast.ValueSpec:
			o.recordValueSpecNilFacts(semPkg, pkg, tokenFile, typed)
		case *ast.AssignStmt:
			o.recordAssignNilFacts(semPkg, pkg, tokenFile, typed)
			if lit != nil {
				for _, lhs := range typed.Lhs {
					o.recordFuncLitAssignedCapture(model, pkg, lit, lhs)
				}
			}
		case *ast.FuncLit:
			o.collectFacts(model, semPkg, pkg, tokenFile, typed.Body, typed, nil)
			return false
		case *ast.CallExpr:
			o.recordCallSignatureImports(model, semPkg, pkg, tokenFile, typed)
		case *ast.IncDecStmt:
			if lit != nil {
				o.recordFuncLitAssignedCapture(model, pkg, lit, typed.X)
			}
		}
		return true
	})
}

// recordTypeSpec records a declared type and the imports needed to emit it.
func (o *SemanticModelOwner) recordTypeSpec(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	spec *ast.TypeSpec,
) {
	obj, _ := pkg.TypesInfo.Defs[spec.Name].(*types.TypeName)
	if obj == nil {
		return
	}
	position := sourcePosInFile(tokenFile, spec.Name.Pos())
	o.addType(model, semPkg, obj, position, spec.Type, pkg.TypesSizes)
	o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, obj.Type())
}

func (o *SemanticModelOwner) recordFuncLitAssignedCapture(
	model *SemanticModel,
	pkg *packages.Package,
	lit *ast.FuncLit,
	expr ast.Expr,
) {
	ident, ok := ast.Unparen(expr).(*ast.Ident)
	if !ok {
		return
	}
	obj, _ := pkg.TypesInfo.Uses[ident].(*types.Var)
	if obj == nil || !obj.Pos().IsValid() {
		return
	}
	if lit.Pos() < obj.Pos() && obj.Pos() < lit.End() {
		return
	}
	if signatureForType(obj.Type()) == nil {
		return
	}
	model.needsVarRef[obj] = true
}

// recordCallSignatureImports records types required by call parameters and results.
func (o *SemanticModelOwner) recordCallSignatureImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	expr *ast.CallExpr,
) {
	signature := signatureForType(pkg.TypesInfo.TypeOf(expr.Fun))
	if signature == nil {
		return
	}
	position := sourcePosInFile(tokenFile, expr.Pos())
	seen := model.generatedImportSeen(position.file)
	o.recordTupleImports(model, semPkg, position.file, pkg.PkgPath, signature.Params(), seen)
	o.recordTupleImports(model, semPkg, position.file, pkg.PkgPath, signature.Results(), seen)
}

func signatureForType(typ types.Type) *types.Signature {
	if typ == nil {
		return nil
	}
	if signature, ok := typ.(*types.Signature); ok {
		return signature
	}
	signature, _ := types.Unalias(typ).Underlying().(*types.Signature)
	return signature
}

func (o *SemanticModelOwner) recordPointerReceiverUse(
	model *SemanticModel,
	pkg *packages.Package,
	expr *ast.SelectorExpr,
) {
	selection := pkg.TypesInfo.Selections[expr]
	if selection == nil || selection.Kind() != types.MethodVal {
		return
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return
	}
	signature, _ := method.Type().(*types.Signature)
	if signature == nil || signature.Recv() == nil {
		return
	}
	if _, ok := signature.Recv().Type().(*types.Pointer); !ok {
		return
	}
	if _, ok := types.Unalias(pkg.TypesInfo.TypeOf(expr.X)).Underlying().(*types.Pointer); ok {
		return
	}
	obj := objectForAddress(pkg, expr.X)
	if obj == nil {
		return
	}
	model.addressTaken[obj] = true
	model.needsVarRef[obj] = true
}

// addDefinedObject records the value, type, or function defined by ident.
func (o *SemanticModelOwner) addDefinedObject(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	ident *ast.Ident,
) {
	obj := pkg.TypesInfo.Defs[ident]
	switch typed := obj.(type) {
	case *types.Var:
		position := sourcePosInFile(tokenFile, ident.Pos())
		o.addValue(model, semPkg, typed, position, false)
		o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, typed.Type())
	case *types.Const:
		position := sourcePosInFile(tokenFile, ident.Pos())
		o.addValue(model, semPkg, typed, position, false)
		o.recordGeneratedImports(model, semPkg, position.file, pkg.PkgPath, typed.Type())
	case *types.TypeName:
		o.addType(model, semPkg, typed, sourcePosInFile(tokenFile, ident.Pos()), nil, pkg.TypesSizes)
	case *types.Func:
		o.addFunction(model, semPkg, typed, sourcePosInFile(tokenFile, ident.Pos()))
	}
}

func (o *SemanticModelOwner) addType(
	model *SemanticModel,
	semPkg *semanticPackage,
	obj *types.TypeName,
	position sourcePosition,
	typeExpr ast.Expr,
	sizes types.Sizes,
) *semanticType {
	named, _ := obj.Type().(*types.Named)
	if named == nil {
		return nil
	}
	if existing := model.types[named]; existing != nil {
		if typeExpr != nil && len(existing.fields) == 0 {
			existing.fields = semanticFields(named, typeExpr, sizes)
		}
		return existing
	}
	_, isInterface := named.Underlying().(*types.Interface)
	semType := &semanticType{
		name:        obj.Name(),
		named:       named,
		isInterface: isInterface,
		fields:      semanticFields(named, typeExpr, sizes),
		position:    position,
	}
	model.types[named] = semType
	semPkg.types = append(semPkg.types, semType)
	if iface, ok := named.Underlying().(*types.Interface); ok {
		iface.Complete()
		for method := range iface.Methods() {
			o.addFunction(model, semPkg, method, sourcePosition{})
		}
	}
	return semType
}

func (o *SemanticModelOwner) addValue(
	model *SemanticModel,
	semPkg *semanticPackage,
	obj types.Object,
	position sourcePosition,
	topLevel bool,
) *semanticValue {
	if obj == nil {
		return nil
	}
	if existing := model.values[obj]; existing != nil {
		if topLevel {
			existing.topLevel = true
		}
		return existing
	}
	value := &semanticValue{
		name:          obj.Name(),
		object:        obj,
		typ:           obj.Type(),
		zeroValueKind: zeroValueKind(obj.Type()),
		position:      position,
		topLevel:      topLevel,
	}
	model.values[obj] = value
	semPkg.values = append(semPkg.values, value)
	return value
}

func (o *SemanticModelOwner) addFunction(
	model *SemanticModel,
	semPkg *semanticPackage,
	fn *types.Func,
	position sourcePosition,
) *semanticFunction {
	if fn == nil {
		return nil
	}
	if existing := model.existingFunction(fn); existing != nil {
		model.functions[fn] = existing
		if origin := fn.Origin(); origin != nil && model.functions[origin] == nil {
			model.functions[origin] = existing
		}
		return existing
	}
	signature, _ := fn.Type().(*types.Signature)
	semFn := &semanticFunction{
		name:      fn.Name(),
		function:  fn,
		signature: signature,
		position:  position,
		calls:     make(map[*types.Func]bool),
	}
	if signature != nil && signature.Recv() != nil {
		recv := signature.Recv().Type()
		if _, ok := recv.(*types.Pointer); ok {
			semFn.receiverPointer = true
		}
		semFn.receiver = receiverNamedType(recv)
	}
	model.functions[fn] = semFn
	if origin := fn.Origin(); origin != nil {
		model.functions[origin] = semFn
	}
	if fullName := model.functionFullName(fn); fullName != "" {
		model.functionsByFullName[fullName] = semFn
	}
	semPkg.functions = append(semPkg.functions, semFn)
	return semFn
}

func semanticFields(named *types.Named, typeExpr ast.Expr, sizes types.Sizes) []semanticField {
	if named == nil {
		return nil
	}
	structType, _ := named.Underlying().(*types.Struct)
	if structType == nil {
		return nil
	}
	docs := structFieldDocs(typeExpr)
	fields := make([]semanticField, 0, structType.NumFields())
	var vars []*types.Var
	for field := range structType.Fields() {
		vars = append(vars, field)
	}
	offsets := structFieldOffsets(sizes, vars)
	for i := range structType.NumFields() {
		field := structType.Field(i)
		pkgPath := ""
		if !field.Exported() && field.Pkg() != nil {
			pkgPath = field.Pkg().Path()
		}
		fields = append(fields, semanticField{
			name:     field.Name(),
			typ:      field.Type(),
			doc:      docs[field.Name()],
			tag:      structType.Tag(i),
			embedded: field.Embedded(),
			pkgPath:  pkgPath,
			index:    []int{i},
			offset:   offsets[i],
			exported: field.Exported(),
		})
	}
	return fields
}

func goScriptTypeSizes() types.Sizes {
	if sizes := types.SizesFor("gc", "wasm"); sizes != nil {
		return sizes
	}
	return types.SizesFor("gc", "amd64")
}

func structFieldOffsets(sizes types.Sizes, fields []*types.Var) (offsets []int64) {
	offsets = make([]int64, len(fields))
	if len(fields) == 0 {
		return offsets
	}
	if sizes == nil {
		sizes = goScriptTypeSizes()
	}
	if sizes == nil {
		return offsets
	}
	defer func() {
		if recover() != nil {
			// Generic field layouts do not have concrete target offsets during
			// package-level metadata emission; keep compiling and leave them zero.
			offsets = make([]int64, len(fields))
		}
	}()
	computed := sizes.Offsetsof(fields)
	if len(computed) == len(fields) {
		copy(offsets, computed)
	}
	return offsets
}

func structFieldDocs(typeExpr ast.Expr) map[string]string {
	structType, _ := typeExpr.(*ast.StructType)
	if structType == nil || structType.Fields == nil {
		return nil
	}
	docs := make(map[string]string)
	for _, field := range structType.Fields.List {
		if field.Doc == nil {
			continue
		}
		doc := strings.TrimSpace(field.Doc.Text())
		if doc == "" {
			continue
		}
		for _, name := range field.Names {
			docs[name.Name] = doc
		}
	}
	return docs
}

func (o *SemanticModelOwner) recordAddressTaken(model *SemanticModel, pkg *packages.Package, expr ast.Expr) {
	obj := objectForAddress(pkg, expr)
	if obj == nil {
		return
	}
	model.addressTaken[obj] = true
	model.needsVarRef[obj] = true
}

func objectForAddress(pkg *packages.Package, expr ast.Expr) types.Object {
	switch typed := expr.(type) {
	case *ast.Ident:
		if obj := pkg.TypesInfo.Uses[typed]; obj != nil {
			return obj
		}
		return pkg.TypesInfo.Defs[typed]
	case *ast.SelectorExpr:
		if selection := pkg.TypesInfo.Selections[typed]; selection != nil {
			return selection.Obj()
		}
		return pkg.TypesInfo.Uses[typed.Sel]
	}
	return nil
}

// recordPackageVarUse adds obj to semFn's package variables when it is one.
func recordPackageVarUse(semFn *semanticFunction, obj types.Object) {
	v, ok := obj.(*types.Var)
	if !ok || v.Pkg() == nil || v.Parent() != v.Pkg().Scope() {
		return
	}
	if semFn.packageVars == nil {
		semFn.packageVars = make(map[*types.Var]bool)
	}
	semFn.packageVars[v] = true
}

func rangeFunctionExprNeedsAwait(
	model *SemanticModel,
	pkg *packages.Package,
	overrideFacts *OverrideFacts,
	expr ast.Expr,
) bool {
	if model == nil || pkg == nil || signatureForType(pkg.TypesInfo.TypeOf(expr)) == nil {
		return false
	}
	if called := calledFunction(pkg, expr); called != nil {
		if semFn := semanticFunctionFor(model, called); semFn != nil && semFn.async {
			return true
		}
		if called.Pkg() != nil && overrideFacts.IsFunctionAsync(called.Pkg().Path(), called.Name()) {
			return true
		}
	}
	return overrideFacts.IsMethodAsync(overrideCallPackage(pkg, expr), overrideCallMethod(pkg, expr))
}

// callSuspends reports whether a call suspends its caller whatever the
// program: printing, or calling an async override. A call through a function
// value suspends when its class is async (see funcValueShape).
func callSuspends(pkg *packages.Package, overrideFacts *OverrideFacts, fun ast.Expr) bool {
	return isBuiltinPrintCall(pkg, fun) ||
		overrideFacts.IsMethodAsync(overrideCallPackage(pkg, fun), overrideCallMethod(pkg, fun)) ||
		overrideFacts.IsFunctionAsync(overrideFunctionCallPackage(pkg, fun), overrideFunctionCallName(pkg, fun))
}

// isBuiltinPrintCall reports whether the call targets the print or println
// builtin. Both lower to awaited runtime helpers, so any function whose body
// contains one renders output asynchronously.
func isBuiltinPrintCall(pkg *packages.Package, fun ast.Expr) bool {
	ident, ok := ast.Unparen(fun).(*ast.Ident)
	if !ok || ident.Name != "print" && ident.Name != "println" {
		return false
	}
	builtin, ok := pkg.TypesInfo.Uses[ident].(*types.Builtin)
	return ok && (builtin.Name() == "print" || builtin.Name() == "println")
}

func overrideCallPackage(pkg *packages.Package, expr ast.Expr) string {
	selector, ok := expr.(*ast.SelectorExpr)
	if !ok {
		return ""
	}
	selection := pkg.TypesInfo.Selections[selector]
	if selection == nil {
		return ""
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return ""
	}
	named := selectedReceiverNamedType(pkg, selector, selection)
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return ""
	}
	return named.Obj().Pkg().Path()
}

func overrideCallMethod(pkg *packages.Package, expr ast.Expr) string {
	selector, ok := expr.(*ast.SelectorExpr)
	if !ok {
		return ""
	}
	selection := pkg.TypesInfo.Selections[selector]
	if selection == nil {
		return ""
	}
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return ""
	}
	named := selectedReceiverNamedType(pkg, selector, selection)
	if named == nil || named.Obj() == nil {
		return ""
	}
	return named.Obj().Name() + "." + method.Name()
}

func selectedReceiverNamedType(pkg *packages.Package, selector *ast.SelectorExpr, selection *types.Selection) *types.Named {
	if named := promotedReceiverNamedType(selection); named != nil {
		return named
	}
	if named := receiverNamedType(selection.Recv()); named != nil {
		return named
	}
	if pkg == nil || selector == nil {
		return nil
	}
	return receiverNamedType(pkg.TypesInfo.TypeOf(selector.X))
}

func promotedReceiverNamedType(selection *types.Selection) *types.Named {
	index := selection.Index()
	if len(index) <= 1 {
		return nil
	}
	typ := selection.Recv()
	for _, idx := range index[:len(index)-1] {
		for {
			if pointer, ok := types.Unalias(typ).(*types.Pointer); ok {
				typ = pointer.Elem()
				continue
			}
			break
		}
		switch underlying := types.Unalias(typ).Underlying().(type) {
		case *types.Struct:
			if idx < 0 || idx >= underlying.NumFields() {
				return nil
			}
			typ = underlying.Field(idx).Type()
		default:
			return receiverNamedType(typ)
		}
	}
	return receiverNamedType(typ)
}

func overrideFunctionCallPackage(pkg *packages.Package, expr ast.Expr) string {
	fn := calledFunction(pkg, expr)
	if fn == nil || fn.Pkg() == nil {
		return ""
	}
	return fn.Pkg().Path()
}

func overrideFunctionCallName(pkg *packages.Package, expr ast.Expr) string {
	fn := calledFunction(pkg, expr)
	if fn == nil {
		return ""
	}
	return fn.Name()
}

func semanticFunctionFor(model *SemanticModel, fn *types.Func) *semanticFunction {
	if model == nil || fn == nil {
		return nil
	}
	if semFn := model.functions[fn]; semFn != nil {
		return semFn
	}
	if semFn := model.valueNodes[fn]; semFn != nil {
		return semFn
	}
	// functions is fully populated while the model is built and stays read-only
	// afterwards, so anything resolved from here on lands in an overlay that
	// packages lowered concurrently can share. The result is derived only from
	// fn, so whichever goroutine stores it first stores the same answer.
	if semFn, ok := model.functionAliases[fn]; ok {
		return semFn
	}
	if model.frozen {
		if semFn, ok := model.lateMemo.loadAlias(fn); ok {
			return semFn
		}
	}
	var resolved *semanticFunction
	if origin := fn.Origin(); origin != nil {
		resolved = model.functions[origin]
	}
	if resolved == nil {
		if fullName := model.functionFullName(fn); fullName != "" {
			resolved = model.functionsByFullName[fullName]
		}
	}
	if resolved == nil {
		// A miss stays uncached: a function that is not indexed yet may be
		// added later, and a later lookup has to find it.
		return nil
	}
	model.recordFunctionAlias(fn, resolved)
	return resolved
}

func calledFunction(pkg *packages.Package, expr ast.Expr) *types.Func {
	for {
		switch typed := expr.(type) {
		case *ast.IndexExpr:
			expr = typed.X
		case *ast.IndexListExpr:
			expr = typed.X
		default:
			goto unwrapped
		}
	}
unwrapped:
	switch typed := expr.(type) {
	case *ast.Ident:
		fn, _ := pkg.TypesInfo.Uses[typed].(*types.Func)
		return fn
	case *ast.SelectorExpr:
		if selection := pkg.TypesInfo.Selections[typed]; selection != nil {
			fn, _ := selection.Obj().(*types.Func)
			return fn
		}
		fn, _ := pkg.TypesInfo.Uses[typed.Sel].(*types.Func)
		return fn
	}
	return nil
}

func functionOriginOrSelf(fn *types.Func) *types.Func {
	if fn == nil {
		return nil
	}
	if origin := fn.Origin(); origin != nil {
		return origin
	}
	return fn
}

// callUsesFunctionValue reports whether a call's callee is a function value
// computed at run time, whose body the analysis cannot see.
func callUsesFunctionValue(pkg *packages.Package, expr ast.Expr) bool {
	if signatureForType(pkg.TypesInfo.TypeOf(expr)) == nil {
		return false
	}
	switch typed := ast.Unparen(expr).(type) {
	case *ast.CallExpr:
		return true
	case *ast.StarExpr:
		return true
	case *ast.TypeAssertExpr:
		return true
	case *ast.SelectorExpr:
		selection := pkg.TypesInfo.Selections[typed]
		if selection != nil {
			return selection.Kind() == types.FieldVal && signatureForType(selection.Type()) != nil
		}
		obj, _ := pkg.TypesInfo.Uses[typed.Sel].(*types.Var)
		return obj != nil && signatureForType(obj.Type()) != nil
	case *ast.IndexExpr:
		if signatureForType(pkg.TypesInfo.TypeOf(typed.X)) != nil {
			return false
		}
		return true
	case *ast.IndexListExpr:
		if signatureForType(pkg.TypesInfo.TypeOf(typed.X)) != nil {
			return false
		}
		return true
	default:
		return false
	}
}

// callUsesFunctionIdentifier reports whether a call's callee is a variable of
// function type.
func callUsesFunctionIdentifier(pkg *packages.Package, expr ast.Expr) bool {
	if signatureForType(pkg.TypesInfo.TypeOf(expr)) == nil {
		return false
	}
	ident, ok := ast.Unparen(expr).(*ast.Ident)
	if !ok {
		return false
	}
	obj := pkg.TypesInfo.Uses[ident]
	if obj == nil {
		obj = pkg.TypesInfo.Defs[ident]
	}
	_, ok = obj.(*types.Var)
	return ok
}

// exprMayNeedAwait reports whether calling the function expr names may
// suspend: a declared function or a function literal.
func exprMayNeedAwait(model *SemanticModel, pkg *packages.Package, expr ast.Expr) bool {
	if called := calledFunction(pkg, expr); called != nil {
		return model.functionAsync(called)
	}
	lit, ok := expr.(*ast.FuncLit)
	return ok && model.funcLitAsync(lit.Pos())
}

func receiverNamedType(typ types.Type) *types.Named {
	for {
		pointer, ok := typ.(*types.Pointer)
		if !ok {
			break
		}
		typ = pointer.Elem()
	}
	named, _ := types.Unalias(typ).(*types.Named)
	return named
}

// semanticFunctionCallers indexes the nodes that call each function: a
// declared function, literal or initializer node calls the functions it
// names, the classes of the values it calls through, and the initializers of
// the lazily initialized variables it reads.
func semanticFunctionCallers(model *SemanticModel) map[*types.Func][]*semanticFunction {
	// Index the initializer of each lazily initialized variable.
	initKeys := make(map[types.Object]*types.Func)
	for _, semPkg := range model.packages {
		for obj, node := range semPkg.lazyInits {
			initKeys[obj] = node.function
		}
	}

	// Every node records its calls.
	callers := make(map[*types.Func][]*semanticFunction)
	addCalls := func(semFn *semanticFunction) {
		for called := range semFn.calls {
			if called = functionOriginOrSelf(called); called != nil {
				callers[called] = append(callers[called], semFn)
			}
		}
		for shape := range semFn.valueCalls {
			class := model.funcValueClasses[shape]
			callers[class] = append(callers[class], semFn)
		}
		for v := range semFn.packageVars {
			if key := initKeys[v]; key != nil {
				callers[key] = append(callers[key], semFn)
			}
		}
		for mutex := range semFn.locks {
			if node := model.mutexNodes[mutex]; node != nil {
				callers[node.function] = append(callers[node.function], semFn)
			}
		}
	}
	for _, semFn := range model.functions {
		addCalls(semFn)
	}
	for _, node := range model.valueNodes {
		addCalls(node)
	}
	return callers
}

// markFunctionAsync marks fn async and reports whether it was synchronous.
func markFunctionAsync(fn *semanticFunction) bool {
	if fn == nil || fn.async {
		return false
	}
	fn.async = true
	return true
}

// resolveInterfaceImplementationGraph pairs every named interface with the
// method sets that implement it. Each interface resolves independently, so they
// resolve concurrently and join in sorted interface order.
func (o *SemanticModelOwner) resolveInterfaceImplementationGraph(
	ctx context.Context,
	model *SemanticModel,
	methodSets []semanticImplementationMethodSet,
) ([]semanticInterfaceImplementationGraphEntry, []Diagnostic) {
	candidates := newInterfaceCandidates()
	candidates.collectModel(model)
	interfaces := candidates.interfaces
	sortNamedTypes(interfaces)

	methodSetIndexByName := indexImplementationMethodSets(methodSets)
	entries := make([][]semanticInterfaceImplementationGraphEntry, len(interfaces))
	forEachParallel(len(interfaces), func(idx int) {
		if ctx.Err() != nil {
			return
		}
		ifaceNamed := interfaces[idx]
		iface, _ := ifaceNamed.Underlying().(*types.Interface)
		ifaceMethods := interfaceMethodMap(iface)
		if len(ifaceMethods) == 0 {
			return
		}
		for _, methodSetIdx := range implementationMethodSetCandidates(methodSetIndexByName, ifaceMethods) {
			if implementation, ok := o.interfaceImplementationGraphEntry(methodSets[methodSetIdx], ifaceNamed, ifaceMethods); ok {
				entries[idx] = append(entries[idx], implementation)
			}
		}
	})
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{contextCanceledDiagnostic(err)}
	}
	return slices.Concat(entries...), nil
}

// resolveAnonymousInterfaceImplementationGraph pairs the targets of type
// assertions from package-sealed interfaces with the method sets that can
// satisfy both sides. Each package's assertions resolve concurrently.
func (o *SemanticModelOwner) resolveAnonymousInterfaceImplementationGraph(
	ctx context.Context,
	model *SemanticModel,
	methodSets []semanticImplementationMethodSet,
) ([]semanticAnonymousInterfaceImplementation, []Diagnostic) {
	methodSetIndexByName := indexImplementationMethodSets(methodSets)
	semPkgs := slices.Collect(maps.Values(model.packages))
	entries := make([][]semanticAnonymousInterfaceImplementation, len(semPkgs))
	forEachParallel(len(semPkgs), func(idx int) {
		for _, assertion := range semPkgs[idx].typeAssertions {
			if ctx.Err() != nil {
				return
			}
			entries[idx] = append(entries[idx], anonymousInterfaceImplementations(assertion, methodSets, methodSetIndexByName)...)
		}
	})
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{contextCanceledDiagnostic(err)}
	}
	return slices.Concat(entries...), nil
}

func anonymousInterfaceImplementations(
	assertion semanticTypeAssertion,
	methodSets []semanticImplementationMethodSet,
	methodSetIndexByName map[string][]int,
) []semanticAnonymousInterfaceImplementation {
	if assertion.source == nil || assertion.target == nil {
		return nil
	}
	sourceIface, _ := types.Unalias(assertion.source).Underlying().(*types.Interface)
	iface, _ := types.Unalias(assertion.target).Underlying().(*types.Interface)
	if sourceIface == nil || iface == nil || !interfaceIsPackageSealed(sourceIface) {
		return nil
	}
	iface.Complete()
	ifaceMethods := interfaceMethodMap(iface)
	if len(ifaceMethods) == 0 {
		return nil
	}
	var implementations []semanticAnonymousInterfaceImplementation
	for _, methodSetIdx := range implementationMethodSetCandidates(methodSetIndexByName, ifaceMethods) {
		methodSet := methodSets[methodSetIdx]
		receiver := methodSet.receiver
		if (methodSet.typ.TypeArgs() == nil || methodSet.typ.TypeArgs().Len() == 0) &&
			methodSet.typ.TypeParams() != nil && methodSet.typ.TypeParams().Len() != 0 {
			args := typeParamTypes(methodSet.typ.TypeParams())
			if instantiated, err := types.Instantiate(nil, methodSet.typ, args, false); err == nil {
				receiver = instantiated
				if methodSet.pointer {
					receiver = types.NewPointer(instantiated)
				}
			}
		}
		if !types.Implements(receiver, sourceIface) || !types.Implements(receiver, iface) {
			continue
		}
		implementations = append(implementations, semanticAnonymousInterfaceImplementation{
			ifaceMethods: ifaceMethods,
			implMethods:  methodSet.methods,
		})
	}
	return implementations
}

// resolveImplementationMethodSets returns the method sets of the model's
// concrete types and of the override types with an async method. An override
// package has no semantic functions, so its types join the implementation
// graph only to color the interface methods they implement.
func (o *SemanticModelOwner) resolveImplementationMethodSets(
	ctx context.Context,
	model *SemanticModel,
	overrideFacts *OverrideFacts,
	overridePkgs []*types.Package,
) ([]semanticImplementationMethodSet, []Diagnostic) {
	var concretes []*types.Named
	for named, semType := range model.types {
		if err := ctx.Err(); err != nil {
			return nil, []Diagnostic{contextCanceledDiagnostic(err)}
		}
		if !semType.isInterface {
			concretes = append(concretes, namedOriginOrSelf(named))
		}
	}
	for _, pkg := range overridePkgs {
		for _, name := range pkg.Scope().Names() {
			typeName, _ := pkg.Scope().Lookup(name).(*types.TypeName)
			if typeName == nil {
				continue
			}
			named, _ := typeName.Type().(*types.Named)
			if named != nil && !types.IsInterface(named) && overrideTypeHasAsyncMethod(overrideFacts, named) {
				concretes = append(concretes, named)
			}
		}
	}
	sortNamedTypes(concretes)
	return implementationMethodSets(concretes), nil
}

// overrideTypeHasAsyncMethod reports whether override metadata marks a method
// of named async.
func overrideTypeHasAsyncMethod(overrideFacts *OverrideFacts, named *types.Named) bool {
	for method := range named.Methods() {
		if overrideMethodAsync(overrideFacts, method) {
			return true
		}
	}
	return false
}

// overrideMethodAsync reports whether override metadata marks method async.
func overrideMethodAsync(overrideFacts *OverrideFacts, method *types.Func) bool {
	signature, _ := method.Type().(*types.Signature)
	if method.Pkg() == nil || signature == nil || signature.Recv() == nil {
		return false
	}
	receiver := receiverNamedType(signature.Recv().Type())
	if receiver == nil {
		return false
	}
	return overrideFacts.IsMethodAsync(method.Pkg().Path(), receiver.Obj().Name()+"."+method.Name())
}

// interfaceCandidates collects the named interfaces reachable from a
// model's types, signatures, values and type facts.
type interfaceCandidates struct {
	seen       map[string]bool
	seenTypes  map[types.Type]bool
	interfaces []*types.Named
}

func newInterfaceCandidates() *interfaceCandidates {
	return &interfaceCandidates{
		seen:      make(map[string]bool),
		seenTypes: make(map[types.Type]bool),
	}
}

// add records named's origin when it is a package-level interface.
func (c *interfaceCandidates) add(named *types.Named) {
	if named == nil || named.Obj() == nil || named.Obj().Pkg() == nil {
		return
	}
	named = namedOriginOrSelf(named)
	if _, ok := types.Unalias(named.Underlying()).(*types.Interface); !ok {
		return
	}
	key := named.Obj().Pkg().Path() + "." + named.Obj().Name()
	if c.seen[key] {
		return
	}
	c.seen[key] = true
	c.interfaces = append(c.interfaces, named)
}

// collect records the named interfaces typ reaches.
func (c *interfaceCandidates) collect(typ types.Type) {
	if typ == nil {
		return
	}
	typ = types.Unalias(typ)
	if c.seenTypes[typ] {
		return
	}
	c.seenTypes[typ] = true
	switch typed := typ.(type) {
	case *types.Named:
		c.add(typed)
		c.collect(typed.Underlying())
	case *types.Pointer:
		c.collect(typed.Elem())
	case *types.Slice:
		c.collect(typed.Elem())
	case *types.Array:
		c.collect(typed.Elem())
	case *types.Map:
		c.collect(typed.Key())
		c.collect(typed.Elem())
	case *types.Chan:
		c.collect(typed.Elem())
	case *types.Struct:
		for field := range typed.Fields() {
			c.collect(field.Type())
		}
	case *types.Interface:
		typed.Complete()
		for method := range typed.Methods() {
			c.collect(method.Type())
		}
	case *types.Signature:
		if typed.Recv() != nil {
			c.collect(typed.Recv().Type())
		}
		c.collectTuple(typed.Params())
		c.collectTuple(typed.Results())
	}
}

func (c *interfaceCandidates) collectTuple(tuple *types.Tuple) {
	if tuple == nil {
		return
	}
	for v := range tuple.Variables() {
		c.collect(v.Type())
	}
}

// collectModel records the interfaces model reaches, including those a
// package's body summary names.
func (c *interfaceCandidates) collectModel(model *SemanticModel) {
	for _, semType := range model.types {
		c.collect(semType.named)
		for _, field := range semType.fields {
			c.collect(field.typ)
		}
	}
	for _, semFn := range model.functions {
		c.collect(semFn.signature)
	}
	for _, semValue := range model.values {
		c.collect(semValue.typ)
	}
	for _, semPkg := range model.packages {
		for _, assertion := range semPkg.typeAssertions {
			c.collect(assertion.source)
			c.collect(assertion.target)
		}
		for _, fact := range semPkg.nilFacts {
			c.collect(fact.typ)
		}
		for _, named := range semPkg.bodyInterfaces {
			c.add(named)
		}
	}
}

// openInterfaceMethods returns the interface methods called or taken as
// values that the implementation graph does not color: methods of an
// interface that is neither package-sealed nor in closed, the interfaces a
// whole program closes over its graph, unless they are in conditional, the
// methods whose override implementations suspend only as metadata says. An
// implementation outside the graph may suspend, so each is an async root for
// its callers.
func openInterfaceMethods(
	model *SemanticModel,
	interfaceGraph []semanticInterfaceImplementationGraphEntry,
	anonymousInterfaceGraph []semanticAnonymousInterfaceImplementation,
	closed map[*types.Named]bool,
	conditional map[*types.Func]bool,
	values []funcValue,
) []*types.Func {
	// The graph colors the methods a known interface declares, and metadata
	// the conditional ones. A closed interface's methods are known even
	// when the graph holds none of its implementations.
	known := maps.Clone(conditional)
	if known == nil {
		known = make(map[*types.Func]bool)
	}
	for _, graphEntry := range interfaceGraph {
		ifaceOrigin := namedOriginOrSelf(graphEntry.iface)
		if !interfaceKnown(ifaceOrigin, closed) {
			continue
		}
		for _, method := range graphEntry.ifaceMethods {
			signature, _ := method.Type().(*types.Signature)
			if signature == nil || signature.Recv() == nil {
				continue
			}
			receiver := receiverNamedType(signature.Recv().Type())
			if receiver == nil || namedOriginOrSelf(receiver) != ifaceOrigin {
				continue
			}
			known[functionOriginOrSelf(method)] = true
		}
	}
	for named := range closed {
		if iface, _ := named.Underlying().(*types.Interface); iface != nil {
			for method := range iface.ExplicitMethods() {
				known[method] = true
			}
		}
	}

	// It colors the methods of anonymous assertion targets.
	for _, graphEntry := range anonymousInterfaceGraph {
		for _, method := range graphEntry.ifaceMethods {
			signature, _ := method.Type().(*types.Signature)
			if signature != nil && signature.Recv() != nil &&
				receiverNamedType(signature.Recv().Type()) != nil {
				continue
			}
			known[functionOriginOrSelf(method)] = true
		}
	}

	// Any other interface method called or taken as a value is open.
	candidates := slices.Collect(maps.Keys(model.functionCallers))
	for _, value := range values {
		candidates = append(candidates, value.key)
	}
	var open []*types.Func
	seen := make(map[*types.Func]bool)
	for _, method := range candidates {
		method = functionOriginOrSelf(method)
		if method == nil || known[method] || seen[method] {
			continue
		}
		seen[method] = true
		signature, _ := method.Type().(*types.Signature)
		if signature != nil && signature.Recv() != nil && isInterfaceType(signature.Recv().Type()) {
			open = append(open, method)
		}
	}
	return open
}

// buildInterfaceAsyncEdges records the implementation graph on the model and
// returns the distinct edges from each implementation to the interface methods
// whose async coloring is still undecided. An async override method has no
// semantic function; its edges leave a node of its own that is always async.
func (o *SemanticModelOwner) buildInterfaceAsyncEdges(
	ctx context.Context,
	model *SemanticModel,
	overrideFacts *OverrideFacts,
	interfaceGraph []semanticInterfaceImplementationGraphEntry,
) (interfaceAsyncEdges, []Diagnostic) {
	model.interfaceImplementations = make([]semanticInterfaceImplementation, 0, len(interfaceGraph))
	edges := make(interfaceAsyncEdges)
	overrideNodes := make(map[*types.Func]*semanticFunction)
	for _, graphEntry := range interfaceGraph {
		if err := ctx.Err(); err != nil {
			return nil, []Diagnostic{contextCanceledDiagnostic(err)}
		}
		for methodName, ifaceMethod := range graphEntry.ifaceMethods {
			implMethod := graphEntry.implMethods[methodName]
			// A pair with no semantic implementation can never fire, so it is
			// dropped here rather than resolved again on every pass.
			if implFn := semanticFunctionFor(model, implMethod); implFn != nil {
				edges.add(implFn, ifaceMethod)
			} else if overrideMethodAsync(overrideFacts, implMethod) {
				edges.add(asyncOverrideMethodNode(overrideNodes, implMethod), ifaceMethod)
			}
		}
		model.interfaceImplementations = append(model.interfaceImplementations, semanticInterfaceImplementation{
			typ:     graphEntry.typ,
			iface:   graphEntry.iface,
			pointer: graphEntry.pointer,
		})
	}
	return edges, nil
}

// asyncOverrideMethodNode returns the node of an override method that
// metadata marks async, which is always async, adding it to nodes when new.
func asyncOverrideMethodNode(nodes map[*types.Func]*semanticFunction, method *types.Func) *semanticFunction {
	if node := nodes[method]; node != nil {
		return node
	}
	node := &semanticFunction{name: method.Name(), function: method, async: true}
	nodes[method] = node
	return node
}

// syncOverrideInterfaceMethod reports whether fn is a method of an override
// interface that the program closes because metadata declares it sync.
func (m *SemanticModel) syncOverrideInterfaceMethod(fn *types.Func) bool {
	if m == nil || fn == nil || !isInterfaceMethod(fn) {
		return false
	}
	receiver := receiverNamedType(fn.Type().(*types.Signature).Recv().Type())
	return receiver != nil && m.syncOverrideInterfaces[namedOriginOrSelf(receiver)]
}

// syncDirective reports whether //goscript:sync marks fn: a declared
// function or method, or an interface method or its interface type.
func (m *SemanticModel) syncDirective(fn *types.Func) bool {
	if m == nil || fn == nil || len(m.asyncDirectives) == 0 {
		return false
	}
	if isInterfaceMethod(fn) {
		return m.asyncDirectives.interfaceMethod(fn) == asyncDirectiveSync
	}
	return m.asyncDirectives.function(fn) == asyncDirectiveSync
}

// syncFunctions returns the functions and methods with a body that
// //goscript:sync marks, in source order.
func (m *SemanticModel) syncFunctions() []*semanticFunction {
	var list []*semanticFunction
	for obj, directive := range m.asyncDirectives {
		fn, ok := obj.(*types.Func)
		if !ok || directive != asyncDirectiveSync || isInterfaceMethod(fn) {
			continue
		}
		if semFn := m.functions[fn]; semFn != nil && semFn.hasBody {
			list = append(list, semFn)
		}
	}
	slices.SortFunc(list, func(a, b *semanticFunction) int { return compareFuncPos(a.function, b.function) })
	return list
}

func (m *SemanticModel) functionAsync(fn *types.Func) bool {
	semFn := semanticFunctionFor(m, fn)
	if semFn != nil && semFn.async {
		return true
	}
	if m != nil && (m.asyncOverrideFunctions[functionOriginOrSelf(fn)] || m.asyncValueClasses[fn]) {
		return true
	}
	return m.interfaceMethodAsync(fn)
}

// markOverrideFunctionAsync marks the override function fn async and reports
// whether it was synchronous.
func (m *SemanticModel) markOverrideFunctionAsync(fn *types.Func) bool {
	if m == nil || fn == nil || m.asyncOverrideFunctions[fn] {
		return false
	}
	m.asyncOverrideFunctions[fn] = true
	return true
}

// markInterfaceMethodAsync marks fn async and reports whether it was
// synchronous.
func (m *SemanticModel) markInterfaceMethodAsync(fn *types.Func) bool {
	if m == nil || fn == nil || m.asyncInterfaceMethodObjs[fn] {
		return false
	}
	m.asyncInterfaceMethodObjs[fn] = true
	if interfaceMethodHasNamedReceiver(fn) {
		key := m.functionFullName(fn)
		if key != "" {
			m.asyncInterfaceMethods[key] = true
		}
	}
	return true
}

func (m *SemanticModel) interfaceMethodAsync(fn *types.Func) bool {
	if m == nil || fn == nil {
		return false
	}
	if m.asyncInterfaceMethodObjs[fn] {
		return true
	}
	if !interfaceMethodHasNamedReceiver(fn) {
		return false
	}
	key := m.functionFullName(fn)
	return key != "" && m.asyncInterfaceMethods[key]
}

func interfaceMethodHasNamedReceiver(fn *types.Func) bool {
	if fn == nil {
		return false
	}
	signature, _ := fn.Type().(*types.Signature)
	return signature != nil && signature.Recv() != nil &&
		receiverNamedType(signature.Recv().Type()) != nil
}

func contextCanceledDiagnostic(err error) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/context:canceled",
		Message:  err.Error(),
	}
}

func (o *SemanticModelOwner) interfaceImplementationGraphEntry(
	methodSet semanticImplementationMethodSet,
	ifaceNamed *types.Named,
	ifaceMethods map[string]*types.Func,
) (semanticInterfaceImplementationGraphEntry, bool) {
	if !implementationHasMethods(methodSet.methods, ifaceMethods) {
		return semanticInterfaceImplementationGraphEntry{}, false
	}

	if !namedTypeHasParams(methodSet.typ) && !namedTypeHasParams(ifaceNamed) {
		if matches, exact := implementationHasExactMethodSignatures(methodSet.methods, ifaceMethods); exact {
			if !matches {
				return semanticInterfaceImplementationGraphEntry{}, false
			}
			implementation := semanticInterfaceImplementationGraphEntry{
				typ:          methodSet.typ,
				iface:        ifaceNamed,
				pointer:      methodSet.pointer,
				ifaceMethods: ifaceMethods,
				implMethods:  methodSet.methods,
			}
			return implementation, true
		}
	}

	implementsReceiver := methodSet.receiver
	implementsIface := types.Type(ifaceNamed.Underlying())
	if methodSet.typ.TypeParams() != nil && methodSet.typ.TypeParams().Len() != 0 {
		args := typeParamTypes(methodSet.typ.TypeParams())
		if instantiated, err := types.Instantiate(nil, methodSet.typ, args, false); err == nil {
			implementsReceiver = instantiated
			if methodSet.pointer {
				implementsReceiver = types.NewPointer(instantiated)
			}
		}
		if ifaceNamed.TypeParams() != nil && ifaceNamed.TypeParams().Len() == len(args) {
			if instantiated, err := types.Instantiate(nil, ifaceNamed, args, false); err == nil {
				implementsIface = instantiated.Underlying()
			}
		}
	}
	if !types.Implements(implementsReceiver, implementsIface.Underlying().(*types.Interface)) {
		return semanticInterfaceImplementationGraphEntry{}, false
	}

	implementation := semanticInterfaceImplementationGraphEntry{
		typ:          methodSet.typ,
		iface:        ifaceNamed,
		pointer:      methodSet.pointer,
		ifaceMethods: ifaceMethods,
		implMethods:  methodSet.methods,
	}
	return implementation, true
}

func interfaceMethodMap(iface *types.Interface) map[string]*types.Func {
	if iface == nil {
		return nil
	}
	methods := make(map[string]*types.Func)
	for method := range iface.Methods() {
		methods[method.Name()] = method
	}
	return methods
}

func interfaceIsPackageSealed(iface *types.Interface) bool {
	if iface == nil {
		return false
	}
	iface.Complete()
	for method := range iface.Methods() {
		// A package-private method prevents implementations outside its package.
		if !method.Exported() {
			return true
		}
	}
	return false
}

func indexImplementationMethodSets(methodSets []semanticImplementationMethodSet) map[string][]int {
	index := make(map[string][]int)
	for methodSetIndex, methodSet := range methodSets {
		for methodName := range methodSet.methods {
			index[methodName] = append(index[methodName], methodSetIndex)
		}
	}
	return index
}

func implementationMethodSetCandidates(
	index map[string][]int,
	ifaceMethods map[string]*types.Func,
) []int {
	var candidates []int
	for methodName := range ifaceMethods {
		methodSets := index[methodName]
		if len(methodSets) == 0 {
			return nil
		}
		if candidates == nil || len(methodSets) < len(candidates) {
			candidates = methodSets
		}
	}
	return candidates
}

// freeze marks the end of model construction. Lowering reads the model from
// many goroutines afterwards, so later memo entries go to the guarded overlay
// instead of the plain maps the builder filled without a lock.
func (m *SemanticModel) freeze() {
	if m != nil {
		m.frozen = true
	}
}

func (m *SemanticModel) lookupFunctionFullName(fn *types.Func) (string, bool) {
	if fullName, ok := m.functionFullNames[fn]; ok {
		return fullName, true
	}
	if m.frozen {
		return m.lateMemo.loadFullName(fn)
	}
	return "", false
}

func (m *SemanticModel) recordFunctionFullName(fn *types.Func, fullName string) {
	if m.frozen {
		m.lateMemo.storeFullName(fn, fullName)
		return
	}
	m.functionFullNames[fn] = fullName
}

func (m *SemanticModel) recordFunctionAlias(fn *types.Func, semFn *semanticFunction) {
	if m.frozen {
		m.lateMemo.storeAlias(fn, semFn)
		return
	}
	m.functionAliases[fn] = semFn
}

func (m *SemanticModel) functionFullName(fn *types.Func) string {
	if m == nil || fn == nil {
		return ""
	}
	original := fn
	if fullName, ok := m.lookupFunctionFullName(original); ok {
		return fullName
	}
	if origin := fn.Origin(); origin != nil && origin != fn {
		if fullName, ok := m.lookupFunctionFullName(origin); ok {
			m.recordFunctionFullName(original, fullName)
			return fullName
		}
		fn = origin
	}
	fullName := fn.FullName()
	m.recordFunctionFullName(fn, fullName)
	if original != fn {
		m.recordFunctionFullName(original, fullName)
	}
	return fullName
}

// implementationMethodSets returns the value and pointer method sets of each
// concrete type, in that order, computing them concurrently.
func implementationMethodSets(concretes []*types.Named) []semanticImplementationMethodSet {
	methodSets := make([]semanticImplementationMethodSet, len(concretes)*2)
	forEachParallel(len(concretes), func(idx int) {
		concrete := concretes[idx]
		pointer := types.NewPointer(concrete)
		methodSets[idx*2] = semanticImplementationMethodSet{
			typ:      concrete,
			receiver: concrete,
			methods:  methodSetMap(concrete),
		}
		methodSets[idx*2+1] = semanticImplementationMethodSet{
			typ:      concrete,
			receiver: pointer,
			pointer:  true,
			methods:  methodSetMap(pointer),
		}
	})
	return methodSets
}

// forEachParallel calls fn for each index in [0, n) on up to GOMAXPROCS
// goroutines and returns after every call returns.
func forEachParallel(n int, fn func(idx int)) {
	var group errgroup.Group
	group.SetLimit(runtime.GOMAXPROCS(0))
	for idx := range n {
		group.Go(func() error {
			fn(idx)
			return nil
		})
	}
	_ = group.Wait()
}

func methodSetMap(receiver types.Type) map[string]*types.Func {
	if receiver == nil {
		return nil
	}
	set := types.NewMethodSet(receiver)
	if set.Len() == 0 {
		return nil
	}
	methods := make(map[string]*types.Func, set.Len())
	for method := range set.Methods() {
		fn, _ := method.Obj().(*types.Func)
		if fn != nil {
			methods[fn.Name()] = fn
		}
	}
	return methods
}

func implementationHasMethods(
	receiverMethods map[string]*types.Func,
	ifaceMethods map[string]*types.Func,
) bool {
	if len(receiverMethods) == 0 || len(ifaceMethods) == 0 {
		return false
	}
	for methodName := range ifaceMethods {
		if receiverMethods[methodName] == nil {
			return false
		}
	}
	return true
}

func implementationHasExactMethodSignatures(
	receiverMethods map[string]*types.Func,
	ifaceMethods map[string]*types.Func,
) (bool, bool) {
	for methodName, ifaceMethod := range ifaceMethods {
		implMethod := receiverMethods[methodName]
		if implMethod == nil {
			return false, true
		}
		if !methodPackagesCompatible(implMethod, ifaceMethod) {
			return false, true
		}
		implSignature, _ := implMethod.Type().(*types.Signature)
		ifaceSignature, _ := ifaceMethod.Type().(*types.Signature)
		if implSignature == nil || ifaceSignature == nil {
			return false, false
		}
		if !methodSignaturesIdentical(implSignature, ifaceSignature) {
			return false, true
		}
	}
	return true, true
}

func methodPackagesCompatible(implMethod *types.Func, ifaceMethod *types.Func) bool {
	if implMethod == nil || ifaceMethod == nil {
		return false
	}
	if ifaceMethod.Exported() {
		return true
	}
	return packagePathOfObject(implMethod) == packagePathOfObject(ifaceMethod)
}

func packagePathOfObject(obj types.Object) string {
	if obj == nil || obj.Pkg() == nil {
		return ""
	}
	return obj.Pkg().Path()
}

func methodSignaturesIdentical(implSignature *types.Signature, ifaceSignature *types.Signature) bool {
	if implSignature == nil || ifaceSignature == nil || implSignature.Variadic() != ifaceSignature.Variadic() {
		return false
	}
	return tupleTypesIdentical(implSignature.Params(), ifaceSignature.Params()) &&
		tupleTypesIdentical(implSignature.Results(), ifaceSignature.Results())
}

func tupleTypesIdentical(a *types.Tuple, b *types.Tuple) bool {
	if a == nil || b == nil {
		return a == b
	}
	if a.Len() != b.Len() {
		return false
	}
	for idx := range a.Len() {
		if !types.IdenticalIgnoreTags(a.At(idx).Type(), b.At(idx).Type()) {
			return false
		}
	}
	return true
}

func namedTypeHasParams(named *types.Named) bool {
	if named == nil {
		return false
	}
	if params := named.TypeParams(); params != nil && params.Len() != 0 {
		return true
	}
	return named.TypeArgs() != nil && named.TypeArgs().Len() != 0
}

func typeParamTypes(params *types.TypeParamList) []types.Type {
	if params == nil {
		return nil
	}
	args := make([]types.Type, 0, params.Len())
	for tparam := range params.TypeParams() {
		args = append(args, tparam)
	}
	return args
}

func namedOriginOrSelf(named *types.Named) *types.Named {
	if named == nil {
		return nil
	}
	if origin := named.Origin(); origin != nil {
		return origin
	}
	return named
}

func sortNamedTypes(named []*types.Named) {
	slices.SortFunc(named, func(a, b *types.Named) int {
		return cmp.Compare(namedTypeKey(a), namedTypeKey(b))
	})
}

func namedTypeKey(named *types.Named) string {
	if named == nil || named.Obj() == nil {
		return ""
	}
	if named.Obj().Pkg() == nil {
		return named.Obj().Name()
	}
	return named.Obj().Pkg().Path() + "." + named.Obj().Name()
}

// recordTypeAssertion records the asserted and source types at their adjusted position.
func (o *SemanticModelOwner) recordTypeAssertion(
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	expr *ast.TypeAssertExpr,
) {
	if expr.Type == nil {
		return
	}
	semPkg.typeAssertions = append(semPkg.typeAssertions, semanticTypeAssertion{
		position: sourcePosInFile(tokenFile, expr.Pos()),
		source:   pkg.TypesInfo.TypeOf(expr.X),
		target:   pkg.TypesInfo.TypeOf(expr.Type),
	})
}

// recordValueSpecNilFacts records nil conversions in value declarations.
func (o *SemanticModelOwner) recordValueSpecNilFacts(
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	spec *ast.ValueSpec,
) {
	for idx, value := range spec.Values {
		if idx >= len(spec.Names) {
			continue
		}
		obj := pkg.TypesInfo.Defs[spec.Names[idx]]
		if obj == nil {
			continue
		}
		o.recordNilFacts(semPkg, pkg, tokenFile, obj.Type(), value)
	}
}

// recordAssignNilFacts records nil conversions in assignments.
func (o *SemanticModelOwner) recordAssignNilFacts(
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	stmt *ast.AssignStmt,
) {
	for idx, rhs := range stmt.Rhs {
		if idx >= len(stmt.Lhs) {
			continue
		}
		targetType := pkg.TypesInfo.TypeOf(stmt.Lhs[idx])
		o.recordNilFacts(semPkg, pkg, tokenFile, targetType, rhs)
	}
}

// recordNilFacts records nil values and typed nil interface conversions.
func (o *SemanticModelOwner) recordNilFacts(
	semPkg *semanticPackage,
	pkg *packages.Package,
	tokenFile *token.File,
	targetType types.Type,
	expr ast.Expr,
) {
	if isNilIdent(expr) {
		if kind := nilFactKind(targetType); kind != "" {
			semPkg.nilFacts = append(semPkg.nilFacts, semanticNilFact{
				position: sourcePosInFile(tokenFile, expr.Pos()),
				kind:     kind,
				typ:      targetType,
			})
		}
		return
	}

	exprType := pkg.TypesInfo.TypeOf(expr)
	if isInterfaceType(targetType) && !isInterfaceType(exprType) && isNilableType(exprType) {
		semPkg.nilFacts = append(semPkg.nilFacts, semanticNilFact{
			position: sourcePosInFile(tokenFile, expr.Pos()),
			kind:     "typed-nil-interface-risk",
			typ:      exprType,
		})
	}
}

func isNilIdent(expr ast.Expr) bool {
	ident, ok := expr.(*ast.Ident)
	return ok && ident.Name == "nil"
}

func nilFactKind(typ types.Type) string {
	switch {
	case isInterfaceType(typ):
		return "nil-interface"
	case isNilableType(typ):
		return "typed-nil"
	default:
		return ""
	}
}

func isInterfaceType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	_, ok := types.Unalias(typ).Underlying().(*types.Interface)
	return ok
}

func isNonEmptyInterfaceType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	iface, ok := types.Unalias(typ).Underlying().(*types.Interface)
	if !ok {
		return false
	}
	iface.Complete()
	return iface.NumMethods() != 0
}

func isNilableType(typ types.Type) bool {
	if typ == nil {
		return false
	}
	switch types.Unalias(typ).Underlying().(type) {
	case *types.Pointer, *types.Slice, *types.Map, *types.Chan, *types.Signature, *types.Interface:
		return true
	default:
		return false
	}
}

func (o *SemanticModelOwner) recordGeneratedImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	file string,
	currentPkg string,
	typ types.Type,
) {
	if file == "" || typ == nil {
		return
	}
	o.recordTypeImports(model, semPkg, file, currentPkg, typ, model.generatedImportSeen(file))
}

func (m *SemanticModel) generatedImportSeen(file string) map[types.Type]bool {
	seen := m.generatedImportTypes[file]
	if seen == nil {
		seen = make(map[types.Type]bool)
		m.generatedImportTypes[file] = seen
	}
	return seen
}

func (o *SemanticModelOwner) recordTypeImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	file string,
	currentPkg string,
	typ types.Type,
	seen map[types.Type]bool,
) {
	if typ == nil || seen[typ] {
		return
	}
	seen[typ] = true

	if alias, ok := typ.(*types.Alias); ok {
		if obj := alias.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() != currentPkg {
			addGeneratedImport(model, semPkg, file, obj.Pkg().Path())
		}
		if args := alias.TypeArgs(); args != nil {
			for t := range args.Types() {
				o.recordTypeImports(model, semPkg, file, currentPkg, t, seen)
			}
		}
		o.recordTypeImports(model, semPkg, file, currentPkg, alias.Rhs(), seen)
		return
	}

	switch typed := types.Unalias(typ).(type) {
	case *types.Named:
		if obj := typed.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() != currentPkg {
			addGeneratedImport(model, semPkg, file, obj.Pkg().Path())
		}
		if args := typed.TypeArgs(); args != nil {
			for t := range args.Types() {
				o.recordTypeImports(model, semPkg, file, currentPkg, t, seen)
			}
		}
		if obj := typed.Obj(); obj != nil && obj.Pkg() != nil && obj.Pkg().Path() == currentPkg {
			o.recordTypeImports(model, semPkg, file, currentPkg, typed.Underlying(), seen)
		}
	case *types.Pointer:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Slice:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Array:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Map:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Key(), seen)
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Chan:
		o.recordTypeImports(model, semPkg, file, currentPkg, typed.Elem(), seen)
	case *types.Signature:
		o.recordTupleImports(model, semPkg, file, currentPkg, typed.Params(), seen)
		o.recordTupleImports(model, semPkg, file, currentPkg, typed.Results(), seen)
	case *types.Struct:
		for field := range typed.Fields() {
			o.recordTypeImports(model, semPkg, file, currentPkg, field.Type(), seen)
		}
	case *types.Interface:
		typed.Complete()
		for method := range typed.Methods() {
			o.recordTypeImports(model, semPkg, file, currentPkg, method.Type(), seen)
		}
		for etyp := range typed.EmbeddedTypes() {
			o.recordTypeImports(model, semPkg, file, currentPkg, etyp, seen)
		}
	}
}

func (o *SemanticModelOwner) recordTupleImports(
	model *SemanticModel,
	semPkg *semanticPackage,
	file string,
	currentPkg string,
	tuple *types.Tuple,
	seen map[types.Type]bool,
) {
	if tuple == nil {
		return
	}
	for v := range tuple.Variables() {
		o.recordTypeImports(model, semPkg, file, currentPkg, v.Type(), seen)
	}
}

func addGeneratedImport(model *SemanticModel, semPkg *semanticPackage, file string, pkgPath string) {
	if model.generatedImports[file] == nil {
		model.generatedImports[file] = make(map[string]bool)
	}
	model.generatedImports[file][pkgPath] = true
	if semPkg.generatedImports[file] == nil {
		semPkg.generatedImports[file] = make(map[string]bool)
	}
	semPkg.generatedImports[file][pkgPath] = true
}

func zeroValueKind(typ types.Type) string {
	if typ == nil {
		return "unknown"
	}
	switch typed := types.Unalias(typ).Underlying().(type) {
	case *types.Basic:
		switch {
		case typed.Info()&types.IsBoolean != 0:
			return "false"
		case typed.Info()&types.IsString != 0:
			return "\"\""
		case typed.Info()&types.IsNumeric != 0:
			return "0"
		default:
			return "nil"
		}
	case *types.Pointer, *types.Slice, *types.Map, *types.Chan, *types.Signature, *types.Interface:
		return "nil"
	case *types.Array:
		return "array-zero"
	case *types.Struct:
		return "struct-zero"
	default:
		return "unknown"
	}
}

// sourcePos resolves an adjusted position when the containing file is not known.
func sourcePos(pkg *packages.Package, pos token.Pos) sourcePosition {
	if pkg == nil || pkg.Fset == nil || !pos.IsValid() {
		return sourcePosition{}
	}
	return sourcePosFromTokenPosition(pkg.Fset.Position(pos))
}

// sourcePosInFile resolves an adjusted position within a known source file,
// avoiding the shared FileSet lookup during parallel package walks.
func sourcePosInFile(file *token.File, pos token.Pos) sourcePosition {
	if file == nil || !pos.IsValid() {
		return sourcePosition{}
	}
	return sourcePosFromTokenPosition(file.Position(pos))
}

// sourcePosFromTokenPosition retains the source coordinates used by semantic facts.
func sourcePosFromTokenPosition(pos token.Position) sourcePosition {
	return sourcePosition{
		file:   pos.Filename,
		line:   pos.Line,
		column: pos.Column,
	}
}

// methodReceiverReadOnly reports whether decl is a method with a value
// receiver that a call can pass without copying it (see valueVarReadOnly).
func methodReceiverReadOnly(pkg *packages.Package, decl *ast.FuncDecl, effectFree map[types.Object]bool) valueReadOnlyKind {
	// Only a method with a body and one receiver can be checked.
	if pkg == nil || decl == nil || decl.Body == nil || decl.Recv == nil || len(decl.Recv.List) != 1 {
		return valueNotReadOnly
	}

	// A pointer receiver shares the caller's value instead of holding a copy.
	field := decl.Recv.List[0]
	if _, ok := ast.Unparen(field.Type).(*ast.StarExpr); ok {
		return valueNotReadOnly
	}

	// An unnamed receiver cannot be written.
	if len(field.Names) == 0 || field.Names[0].Name == "_" {
		return valueReadOnly
	}

	// An unresolved receiver cannot be checked, so it is assumed to be written.
	recv := pkg.TypesInfo.Defs[field.Names[0]]
	if recv == nil {
		return valueNotReadOnly
	}
	return valueVarReadOnly(pkg, decl, recv, effectFree)
}

// exprRootIdent returns the identifier that expr reads or writes a part of
// through fields, elements, slices and dereferences, or nil for any other
// expression.
func exprRootIdent(expr ast.Expr) *ast.Ident {
	for {
		switch typed := ast.Unparen(expr).(type) {
		case *ast.Ident:
			return typed
		case *ast.SelectorExpr:
			expr = typed.X
		case *ast.IndexExpr:
			expr = typed.X
		case *ast.StarExpr:
			expr = typed.X
		case *ast.SliceExpr:
			expr = typed.X
		default:
			return nil
		}
	}
}

// funcParamsReadOnly reports, for each parameter of decl, whether it is a
// struct value that a call can pass without copying it (see
// valueVarReadOnly).
func funcParamsReadOnly(pkg *packages.Package, decl *ast.FuncDecl, effectFree map[types.Object]bool) []valueReadOnlyKind {
	// A function without a body or parameters has none to share.
	if pkg == nil || decl == nil || decl.Body == nil || decl.Type.Params == nil {
		return nil
	}

	// Judge each named struct parameter; others are not read only.
	var readOnly []valueReadOnlyKind
	anyReadOnly := false
	for _, field := range decl.Type.Params.List {
		names := field.Names
		if len(names) == 0 {
			readOnly = append(readOnly, valueNotReadOnly)
			continue
		}
		for _, name := range names {
			kind := valueNotReadOnly
			if obj := pkg.TypesInfo.Defs[name]; obj != nil && name.Name != "_" && isStructValueType(obj.Type()) {
				kind = valueVarReadOnly(pkg, decl, obj, effectFree)
			}
			readOnly = append(readOnly, kind)
			anyReadOnly = anyReadOnly || kind != valueNotReadOnly
		}
	}
	if !anyReadOnly {
		return nil
	}
	return readOnly
}

// collectCallFacts records what the package's declared functions do with
// their receivers and parameters, which their callers read: the values they
// only read, the results that borrow them and the transient pointer
// candidates. The facts come from the bodies, so a package checked without
// bodies takes them from its summary.
func collectCallFacts(model *SemanticModel, semPkg *semanticPackage, pkg *packages.Package, overrideFacts *OverrideFacts) {
	for fn, decl := range semPkg.functionDecls {
		semFn := model.functions[fn]
		if semFn == nil {
			continue
		}
		semFn.receiverReadOnly = methodReceiverReadOnly(pkg, decl, model.effectFreeFuncs)
		semFn.paramsReadOnly = funcParamsReadOnly(pkg, decl, model.effectFreeFuncs)
		semFn.resultBorrows = funcResultBorrows(pkg, decl, fn, semFn.paramsReadOnly)
		semFn.transientCandidates = transientCandidates(pkg, fn, decl, overrideFacts)
		semFn.callbackCandidates = callbackCandidates(pkg, fn, decl)
	}
}

// funcResultBorrows reports, for each result of decl, the index of the
// struct parameter that a return statement returns as it is, where a caller
// may pass that parameter without a copy (see funcParamsReadOnly), or -1.
// Such a return copies the parameter, unless the call asks to borrow the
// results, which a caller does when it only reads them while its argument
// stays unchanged (see borrowedResultCalls). It is nil when no result
// borrows a parameter, and for functions whose calls cannot add the request
// as a last argument: generic and variadic ones, and ones with named results
// or deferred calls, which may change or keep the results after a return.
func funcResultBorrows(pkg *packages.Package, decl *ast.FuncDecl, fn *types.Func, paramsReadOnly []valueReadOnlyKind) []int {
	// Only a plain function or method with shared parameters qualifies.
	signature, _ := fn.Type().(*types.Signature)
	if paramsReadOnly == nil || decl.Body == nil || signature == nil || signature.Variadic() ||
		signature.TypeParams().Len() != 0 || signature.RecvTypeParams().Len() != 0 ||
		signature.Results().Len() == 0 || signature.Results().At(0).Name() != "" || bodyHasDefer(decl.Body) {
		return nil
	}

	// paramIndex returns the index of the shared parameter that expr names
	// and that result idx can hold, or -1.
	paramIndex := func(expr ast.Expr, idx int) int {
		// The result names a parameter of the same struct type.
		ident, ok := ast.Unparen(expr).(*ast.Ident)
		if !ok {
			return -1
		}
		resultType := signature.Results().At(idx).Type()
		for p := range min(signature.Params().Len(), len(paramsReadOnly)) {
			param := signature.Params().At(p)
			if pkg.TypesInfo.Uses[ident] == param && paramsReadOnly[p] != valueNotReadOnly &&
				isStructValueType(resultType) && types.Identical(param.Type(), resultType) {
				return p
			}
		}
		return -1
	}

	// Record the first shared parameter that each result returns, outside
	// function literals.
	borrows := slices.Repeat([]int{-1}, signature.Results().Len())
	found := false
	ast.Inspect(decl.Body, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.FuncLit:
			return false
		case *ast.ReturnStmt:
			if len(typed.Results) != len(borrows) {
				return true
			}
			for idx, result := range typed.Results {
				if p := paramIndex(result, idx); p >= 0 && borrows[idx] < 0 {
					borrows[idx], found = p, true
				}
			}
		}
		return true
	})
	if !found {
		return nil
	}
	return borrows
}

// bodyHasDefer reports whether body has a defer statement, also in a
// function literal.
func bodyHasDefer(body *ast.BlockStmt) bool {
	found := false
	ast.Inspect(body, func(node ast.Node) bool {
		_, isDefer := node.(*ast.DeferStmt)
		found = found || isDefer
		return !found
	})
	return found
}

// callChangesNoStorage reports whether call is a conversion, a call of a
// builtin that writes no storage, or a call of a function of effectFree (see
// collectEffectFreeFunctions). Any other call may change storage that the
// caller can reach, such as package variables and what they refer to, even
// when it passes only values.
func callChangesNoStorage(pkg *packages.Package, call *ast.CallExpr, effectFree map[types.Object]bool) bool {
	// A conversion changes nothing.
	tv, ok := pkg.TypesInfo.Types[call.Fun]
	if !ok {
		return false
	}
	if tv.IsType() {
		return true
	}

	// An effect-free function changes nothing.
	if fn, ok := calledObject(pkg.TypesInfo, call.Fun).(*types.Func); ok && effectFree[fn] {
		return true
	}

	// Of the builtins, copy and clear write the elements of their argument.
	if !tv.IsBuiltin() {
		return false
	}
	ident, _ := ast.Unparen(call.Fun).(*ast.Ident)
	return ident != nil && ident.Name != "copy" && ident.Name != "clear"
}

// valueReadOnlyKind says when a call can pass a value receiver or parameter
// without copying it (see valueVarReadOnly).
type valueReadOnlyKind uint8

const (
	// valueNotReadOnly is a value that the function may change or keep.
	valueNotReadOnly valueReadOnlyKind = iota
	// valueReadOnlyUnaliased is a value that the function only reads, but
	// while it may change other storage, so that the caller passes only a
	// value that no other reference can reach without a copy.
	valueReadOnlyUnaliased
	// valueReadOnly is a value that the function only reads, while it
	// changes no storage but its own locals and calls no function.
	valueReadOnly
)

// valueVarReadOnly reports whether the value variable obj, a value receiver
// or parameter of decl, can share the caller's value instead of a copy. The
// body must never modify it: it does not assign to it or anything reached
// from it, increment it, range into it, take its address, or call a pointer
// receiver method on it or its fields. No function literal may refer to it,
// since one may run after the call returns. Any caller's value can be shared
// when the body also stores nothing except into its own local values and
// calls no function, which could change the caller's value through a package
// variable or another reference while it reads obj; otherwise only a value
// that no other reference reaches can be (see isUnaliasedLocalValue).
func valueVarReadOnly(pkg *packages.Package, decl *ast.FuncDecl, obj types.Object, effectFree map[types.Object]bool) valueReadOnlyKind {
	// rootIsVar reports whether expr reads or writes a part of obj.
	rootIsVar := func(expr ast.Expr) bool {
		return pkg.TypesInfo.Uses[exprRootIdent(expr)] == obj
	}

	// storesLocally reports whether an assignment to lhs stores into a local
	// variable of decl, not through a pointer, slice, map or package variable.
	storesLocally := func(lhs ast.Expr) bool {
		for {
			switch typed := ast.Unparen(lhs).(type) {
			case *ast.Ident:
				if typed.Name == "_" {
					return true
				}
				target := pkg.TypesInfo.ObjectOf(typed)
				return target != nil && target.Parent() != nil && target.Pkg() != nil &&
					target.Parent() != target.Pkg().Scope() &&
					decl.Pos() <= target.Pos() && target.Pos() < decl.End()
			case *ast.SelectorExpr:
				selection := pkg.TypesInfo.Selections[typed]
				if selection == nil || selection.Kind() != types.FieldVal || selection.Indirect() {
					return false
				}
				base := pkg.TypesInfo.TypeOf(typed.X)
				if base == nil {
					return false
				}
				if _, ptr := types.Unalias(base).Underlying().(*types.Pointer); ptr {
					return false
				}
				lhs = typed.X
			case *ast.IndexExpr:
				base := pkg.TypesInfo.TypeOf(typed.X)
				if base == nil {
					return false
				}
				if _, ok := types.Unalias(base).Underlying().(*types.Array); !ok {
					return false
				}
				lhs = typed.X
			default:
				return false
			}
		}
	}

	// changed records that the body may change obj or keep it, and shared
	// that it may change other storage, which may be obj's caller's value.
	changed, shared := false, false
	ast.Inspect(decl.Body, func(node ast.Node) bool {
		if changed {
			return false
		}
		switch typed := node.(type) {
		case *ast.FuncLit:
			ast.Inspect(typed.Body, func(node ast.Node) bool {
				if ident, ok := node.(*ast.Ident); ok && pkg.TypesInfo.Uses[ident] == obj {
					changed = true
				}
				return !changed
			})
		case *ast.AssignStmt:
			for _, lhs := range typed.Lhs {
				changed = changed || rootIsVar(lhs)
				shared = shared || (typed.Tok != token.DEFINE && !storesLocally(lhs))
			}
		case *ast.IncDecStmt:
			changed = changed || rootIsVar(typed.X)
			shared = shared || !storesLocally(typed.X)
		case *ast.RangeStmt:
			if typed.Tok == token.ASSIGN {
				for _, lhs := range []ast.Expr{typed.Key, typed.Value} {
					if lhs != nil {
						changed = changed || rootIsVar(lhs)
						shared = shared || !storesLocally(lhs)
					}
				}
			}
		case *ast.UnaryExpr:
			changed = changed || (typed.Op == token.AND && rootIsVar(typed.X))
		case *ast.SendStmt, *ast.GoStmt:
			changed = true
		case *ast.CallExpr:
			shared = shared || !callChangesNoStorage(pkg, typed, effectFree)
		case *ast.SelectorExpr:
			selection := pkg.TypesInfo.Selections[typed]
			if selection != nil && selection.Kind() == types.MethodVal && rootIsVar(typed.X) {
				if signature, ok := selection.Obj().Type().(*types.Signature); ok && signature.Recv() != nil {
					if _, ptr := signature.Recv().Type().(*types.Pointer); ptr {
						changed = true
					}
				}
			}
		}
		return !changed
	})
	switch {
	case changed:
		return valueNotReadOnly
	case shared:
		return valueReadOnlyUnaliased
	}
	return valueReadOnly
}
