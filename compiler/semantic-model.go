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
	for _, node := range graph.Nodes {
		if node.OverrideCandidate {
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
	model.collectVarRefNames()
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}

	diagnostics = append(diagnostics, model.deferFunctions(opts.DeferredFunctions)...)
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}
	model.functionCallers = semanticFunctionCallers(model)
	asyncArgumentSites := asyncArgumentCallSites(model)
	methodSets, methodSetDiagnostics := o.resolveImplementationMethodSets(ctx, model)
	diagnostics = append(diagnostics, methodSetDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}
	interfaceGraph, interfaceDiagnostics := o.resolveInterfaceImplementationGraph(ctx, model, methodSets)
	diagnostics = append(diagnostics, interfaceDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}
	anonymousInterfaceGraph, anonymousInterfaceDiagnostics := o.resolveAnonymousInterfaceImplementationGraph(ctx, model, methodSets)
	diagnostics = append(diagnostics, anonymousInterfaceDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}
	o.applyUnknownInterfaceAsyncMethods(model, interfaceGraph, anonymousInterfaceGraph)
	interfaceAsyncEdges, markDiagnostics := o.buildInterfaceAsyncEdges(ctx, model, interfaceGraph)
	diagnostics = append(diagnostics, markDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		model.freeze()
		return model, diagnostics
	}
	diagnostics = append(diagnostics, colorAsyncFunctions(ctx, model, asyncArgumentSites, interfaceAsyncEdges, anonymousInterfaceGraph)...)
	model.freeze()
	return model, diagnostics
}

func newSemanticModel() *SemanticModel {
	return &SemanticModel{
		packages:                 make(map[string]*semanticPackage),
		addressTaken:             make(map[types.Object]bool),
		needsVarRef:              make(map[types.Object]bool),
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

	for _, file := range pkg.Syntax {
		tokenFile := pkg.Fset.File(file.Pos())
		o.collectFileDeclarations(shard, semPkg, pkg, tokenFile, file)
		o.collectFacts(shard, semPkg, pkg, tokenFile, file, nil, nil)
	}
	for _, file := range pkg.Syntax {
		collectFunctionFacts(shard, pkg, file, overrideFacts)
	}
	semPkg.lazyVars = lazyPackageVars(semPkg)
	semPkg.asyncArgumentCalls = collectAsyncArgumentCalls(pkg)
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
	maps.Copy(m.types, shard.types)
	maps.Copy(m.values, shard.values)
	maps.Copy(m.addressTaken, shard.addressTaken)
	maps.Copy(m.needsVarRef, shard.needsVarRef)
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

// collectFunctionFacts records the calls and direct async causes of the
// functions declared in file. A callee from another package is not in the
// shard yet; its async mark reaches the caller through the recorded call when
// Build propagates async across the merged model.
func collectFunctionFacts(
	model *SemanticModel,
	pkg *packages.Package,
	file *ast.File,
	overrideFacts *OverrideFacts,
) {
	for _, decl := range file.Decls {
		fnDecl, ok := decl.(*ast.FuncDecl)
		if !ok || fnDecl.Body == nil {
			continue
		}
		fnObj, _ := pkg.TypesInfo.Defs[fnDecl.Name].(*types.Func)
		semFn := model.functions[fnObj]
		if semFn == nil {
			continue
		}
		ast.Inspect(fnDecl.Body, func(node ast.Node) bool {
			switch typed := node.(type) {
			case *ast.FuncLit:
				return false
			case *ast.Ident:
				recordPackageVarUse(semFn, pkg.TypesInfo.Uses[typed])
			case *ast.SendStmt, *ast.SelectStmt:
				markFunctionAsync(semFn)
			case *ast.UnaryExpr:
				if typed.Op == token.ARROW {
					markFunctionAsync(semFn)
				}
			case *ast.RangeStmt:
				if signatureForType(pkg.TypesInfo.TypeOf(typed.X)) != nil {
					if called := calledFunction(pkg, typed.X); called != nil {
						semFn.calls[functionOriginOrSelf(called)] = true
					}
					if rangeFunctionExprNeedsAwait(model, pkg, overrideFacts, typed.X) {
						markFunctionAsync(semFn)
					}
				}
			case *ast.CallExpr:
				if called := calledFunction(pkg, typed.Fun); called != nil {
					semFn.calls[functionOriginOrSelf(called)] = true
				}
				if fun, ok := ast.Unparen(typed.Fun).(*ast.FuncLit); ok {
					recordImmediateFuncLitAsyncFacts(model, pkg, overrideFacts, semFn, fun)
				}
				if !semFn.async && callSuspends(pkg, overrideFacts, typed.Fun) {
					markFunctionAsync(semFn)
				}
			}
			return true
		})
	}
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
	if overrideFacts.IsMethodAsync(overrideCallPackage(pkg, expr), overrideCallMethod(pkg, expr)) {
		return true
	}
	return callUsesFunctionValue(pkg, expr)
}

// callSuspends reports whether a call suspends its caller whatever the callee's
// own coloring: printing, calling a function value, or calling an async
// override.
func callSuspends(pkg *packages.Package, overrideFacts *OverrideFacts, fun ast.Expr) bool {
	return isBuiltinPrintCall(pkg, fun) ||
		callUsesFunctionValue(pkg, fun) ||
		callUsesFunctionIdentifier(pkg, fun) ||
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

func recordImmediateFuncLitAsyncFacts(
	model *SemanticModel,
	pkg *packages.Package,
	overrideFacts *OverrideFacts,
	semFn *semanticFunction,
	lit *ast.FuncLit,
) {
	if lit == nil || lit.Body == nil {
		return
	}
	ast.Inspect(lit.Body, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.FuncLit:
			return false
		case *ast.Ident:
			recordPackageVarUse(semFn, pkg.TypesInfo.Uses[typed])
		case *ast.SendStmt, *ast.SelectStmt:
			markFunctionAsync(semFn)
		case *ast.UnaryExpr:
			if typed.Op == token.ARROW {
				markFunctionAsync(semFn)
			}
		case *ast.CallExpr:
			called := calledFunction(pkg, typed.Fun)
			if called != nil {
				semFn.calls[functionOriginOrSelf(called)] = true
			}
			if semFn.async {
				break
			}
			if calledFn := semanticFunctionFor(model, called); calledFn != nil && calledFn.async {
				markFunctionAsync(semFn)
			} else if callSuspends(pkg, overrideFacts, typed.Fun) {
				markFunctionAsync(semFn)
			}
		}
		return true
	})
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

func exprMayNeedAwait(model *SemanticModel, pkg *packages.Package, expr ast.Expr) bool {
	if called := calledFunction(pkg, expr); called != nil {
		return model.functionAsync(called)
	}
	lit, ok := expr.(*ast.FuncLit)
	if !ok {
		return false
	}
	needsAwait := false
	ast.Inspect(lit.Body, func(node ast.Node) bool {
		if needsAwait {
			return false
		}
		switch typed := node.(type) {
		case *ast.FuncLit:
			return false
		case *ast.SendStmt, *ast.SelectStmt:
			needsAwait = true
			return false
		case *ast.UnaryExpr:
			if typed.Op == token.ARROW {
				needsAwait = true
				return false
			}
		case *ast.CallExpr:
			if callUsesFunctionValue(pkg, typed.Fun) {
				needsAwait = true
				return false
			}
			if callUsesFunctionIdentifier(pkg, typed.Fun) {
				needsAwait = true
				return false
			}
			if called := calledFunction(pkg, typed.Fun); called != nil && model.functionAsync(called) {
				needsAwait = true
				return false
			}
		}
		return true
	})
	return needsAwait
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

func semanticFunctionCallers(model *SemanticModel) map[*types.Func][]*semanticFunction {
	callers := make(map[*types.Func][]*semanticFunction)
	for _, semFn := range model.functions {
		for called := range semFn.calls {
			called = functionOriginOrSelf(called)
			if called == nil {
				continue
			}
			callers[called] = append(callers[called], semFn)
		}
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

func (o *SemanticModelOwner) resolveImplementationMethodSets(
	ctx context.Context,
	model *SemanticModel,
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
	sortNamedTypes(concretes)
	return implementationMethodSets(concretes), nil
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

func (o *SemanticModelOwner) applyUnknownInterfaceAsyncMethods(
	model *SemanticModel,
	interfaceGraph []semanticInterfaceImplementationGraphEntry,
	anonymousInterfaceGraph []semanticAnonymousInterfaceImplementation,
) {
	known := make(map[*types.Func]bool)
	for _, graphEntry := range interfaceGraph {
		iface, _ := graphEntry.iface.Underlying().(*types.Interface)
		if !interfaceIsPackageSealed(iface) || namedTypeHasParams(graphEntry.iface) {
			continue
		}
		ifaceOrigin := namedOriginOrSelf(graphEntry.iface)
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
	for method := range model.functionCallers {
		method = functionOriginOrSelf(method)
		if method == nil || known[method] {
			continue
		}
		signature, _ := method.Type().(*types.Signature)
		if signature == nil || signature.Recv() == nil || !isInterfaceType(signature.Recv().Type()) {
			continue
		}
		// An implementation outside the compiled graph may suspend. Mark only
		// the callers that invoke this method. The interface method itself stays
		// synchronous until a compiled implementation proves it can suspend.
		for _, caller := range model.functionCallers[method] {
			markFunctionAsync(caller)
		}
	}
}

// buildInterfaceAsyncEdges records the implementation graph on the model and
// returns the distinct edges from each implementation to the interface methods
// whose async coloring is still undecided.
func (o *SemanticModelOwner) buildInterfaceAsyncEdges(
	ctx context.Context,
	model *SemanticModel,
	interfaceGraph []semanticInterfaceImplementationGraphEntry,
) (interfaceAsyncEdges, []Diagnostic) {
	model.interfaceImplementations = make([]semanticInterfaceImplementation, 0, len(interfaceGraph))
	edges := make(interfaceAsyncEdges)
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

func (m *SemanticModel) functionAsync(fn *types.Func) bool {
	semFn := semanticFunctionFor(m, fn)
	if semFn != nil && semFn.async {
		return true
	}
	return m.interfaceMethodAsync(fn)
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
