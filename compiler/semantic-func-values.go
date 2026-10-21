package compiler

import (
	"go/ast"
	"go/token"
	"go/types"

	"golang.org/x/tools/go/packages"
)

// Calls through function values.
//
// A call through a function value (a variable, field, parameter, element,
// call result or type assertion of func type) may reach any function whose
// value the program takes with an assignable type: a declared function or
// method, a method value or expression, a function literal, or the yield
// callback of a range-over-func loop. The analysis groups both sides by
// shape (see funcValueShape). Each called shape is a class with a synthetic
// key; a call through a value is a call of its class, and a class is async
// when a matching value is.
//
// Function literals and the initializers of lazily initialized package
// variables are nodes of the analysis too, with their own calls and async
// causes. A literal is a value; an initializer makes the functions that read
// its variable wait for it.

// funcValue is a function value a package takes: shape is the shape of its
// type, and key the function, interface method, literal node or loop node
// whose async mark decides it.
type funcValue struct {
	shape string
	key   *types.Func
}

// Names of the synthetic keys of the analysis nodes. They are not Go
// identifiers, so they never collide with a declared function.
const (
	funcLitNodeName   = "func·lit"
	lazyInitNodeName  = "init·"
	funcValueNodeName = "func·value"
)

// newSyntheticNode returns a node of the analysis whose key is a new
// synthetic function named name at pos.
func newSyntheticNode(pos token.Pos, pkg *types.Package, name string) *semanticFunction {
	signature := types.NewSignatureType(nil, nil, nil, nil, nil, false)
	fn := types.NewFunc(pos, pkg, name, signature)
	return &semanticFunction{
		name:      name,
		function:  fn,
		signature: signature,
		hasBody:   true,
		calls:     make(map[*types.Func]bool),
	}
}

// recordValueCall records that semFn calls through a value of shape.
func recordValueCall(semFn *semanticFunction, shape string) {
	if shape == "" {
		return
	}
	if semFn.valueCalls == nil {
		semFn.valueCalls = make(map[string]bool)
	}
	semFn.valueCalls[shape] = true
}

// funcFactsWalker collects the async facts of one package's code: the calls
// and direct async causes of each declared function, function literal and
// lazy initializer, and the function values the package takes.
type funcFactsWalker struct {
	model         *SemanticModel
	semPkg        *semanticPackage
	pkg           *packages.Package
	overrideFacts *OverrideFacts
	directives    asyncDirectives
	// callees holds the expressions in the callee position of a call, which
	// call a function rather than take its value.
	callees map[ast.Node]bool
	// immediate holds the literals that are called where they are written.
	immediate map[*ast.FuncLit]bool
	// taken holds the values already recorded.
	taken map[funcValue]bool
	// lockSites holds the Lock and RLock statements of known mutexes.
	lockSites map[*ast.CallExpr]lockSite
}

// collectFunctionFacts records the calls and direct async causes of the
// package's declared functions, literals and lazy initializers, and the
// function values it takes. Function bodies outside literals belong to the
// enclosing node; an immediately called literal is also part of it.
func collectFunctionFacts(
	model *SemanticModel,
	semPkg *semanticPackage,
	pkg *packages.Package,
	overrideFacts *OverrideFacts,
	directives asyncDirectives,
) {
	// The package's nodes and values start empty.
	w := &funcFactsWalker{
		model:         model,
		semPkg:        semPkg,
		pkg:           pkg,
		overrideFacts: overrideFacts,
		directives:    directives,
		callees:       make(map[ast.Node]bool),
		immediate:     make(map[*ast.FuncLit]bool),
		taken:         make(map[funcValue]bool),
		lockSites:     make(map[*ast.CallExpr]lockSite),
	}
	semPkg.funcLits = make(map[token.Pos]*semanticFunction)
	semPkg.lockSections = make(map[token.Pos]*semanticFunction)

	// Find the critical sections of every function and literal body.
	for _, file := range pkg.Syntax {
		ast.Inspect(file, func(node ast.Node) bool {
			switch typed := node.(type) {
			case *ast.FuncDecl:
				if typed.Body != nil {
					collectLockSites(pkg, semPkg, typed.Body, w.lockSites)
				}
			case *ast.FuncLit:
				collectLockSites(pkg, semPkg, typed.Body, w.lockSites)
			}
			return true
		})
	}
	semPkg.lazyInits = make(map[types.Object]*semanticFunction)
	top := &semanticFunction{calls: make(map[*types.Func]bool)}

	// Walk each declared body and each package variable initializer.
	for _, file := range pkg.Syntax {
		for _, decl := range file.Decls {
			switch typed := decl.(type) {
			case *ast.FuncDecl:
				w.walkFuncDecl(typed)
			case *ast.GenDecl:
				w.walkVarDecl(top, typed)
			}
		}
	}
	semPkg.topValueCalls = top.valueCalls
}

// walkFuncDecl walks the body of a declared function.
func (w *funcFactsWalker) walkFuncDecl(decl *ast.FuncDecl) {
	fn, _ := w.pkg.TypesInfo.Defs[decl.Name].(*types.Func)
	if semFn := w.model.functions[fn]; semFn != nil && decl.Body != nil {
		w.walk(semFn, decl.Body)
	}
	w.visitExportedFuncParams(fn)
}

// visitExportedFuncParams records the func types of the parameters of fn, an
// exported function or method. An interpreter calls such functions through
// reflect.Value.Call, which passes the function values that reflection made
// for it, of any func type, as their arguments, so calls of the types stay
// open, as calls of an asserted func type do.
func (w *funcFactsWalker) visitExportedFuncParams(fn *types.Func) {
	// Only an exported function or method is called that way.
	if fn == nil || !fn.Exported() {
		return
	}
	signature, _ := fn.Type().(*types.Signature)
	if signature == nil {
		return
	}

	// Each parameter of a func type opens its calls.
	for param := range signature.Params().Variables() {
		if _, ok := param.Type().Underlying().(*types.Signature); ok {
			w.recordAssertedShape(funcValueShape(param.Type()))
		}
	}
}

// walkVarDecl walks the initializers of package variables. A lazily
// initialized variable's initializer runs on its first read, so it walks
// into the variable's node; any other runs at package initialization.
func (w *funcFactsWalker) walkVarDecl(top *semanticFunction, decl *ast.GenDecl) {
	if decl.Tok != token.VAR {
		return
	}
	for _, spec := range decl.Specs {
		valueSpec, _ := spec.(*ast.ValueSpec)
		if valueSpec == nil {
			continue
		}
		for idx, value := range valueSpec.Values {
			// One value initializes its own name, or all names of a
			// multi-value call.
			names := valueSpec.Names
			if len(valueSpec.Values) == len(names) {
				names = names[idx : idx+1]
			}
			nodes := w.lazyInitNodes(names)
			for _, node := range nodes {
				w.walk(node, value)
				if w.initializerCallsOtherPackage(value) {
					markOwnAsync(node, value.Pos(), asyncCauseInitOrder, "")
				}
			}
			if len(nodes) == 0 {
				w.walk(top, value)
			}
		}
	}
}

// lazyInitNodes returns the nodes of the lazily initialized variables among
// names.
func (w *funcFactsWalker) lazyInitNodes(names []*ast.Ident) []*semanticFunction {
	var nodes []*semanticFunction
	for _, name := range names {
		obj := w.pkg.TypesInfo.Defs[name]
		if obj == nil || !w.semPkg.lazyVars[obj] {
			continue
		}
		node := w.semPkg.lazyInits[obj]
		if node == nil {
			node = newSyntheticNode(obj.Pos(), w.pkg.Types, lazyInitNodeName+obj.Name())
			w.semPkg.lazyInits[obj] = node
		}
		nodes = append(nodes, node)
	}
	return nodes
}

// initializerCallsOtherPackage reports whether a package variable
// initializer calls a function of another compiled package. Lowering awaits
// such a call in a lazy initializer, as that package's initialization may
// still be pending.
func (w *funcFactsWalker) initializerCallsOtherPackage(expr ast.Expr) bool {
	calls := false
	ast.Inspect(expr, func(node ast.Node) bool {
		// Literal bodies do not run during initialization.
		if _, ok := node.(*ast.FuncLit); ok || calls {
			return false
		}

		// A call of a function of another compiled package counts.
		call, ok := node.(*ast.CallExpr)
		if !ok {
			return true
		}
		fn := calledFunction(w.pkg, call.Fun)
		if fn != nil && fn.Pkg() != nil && fn.Pkg().Path() != w.semPkg.pkgPath {
			calls = !w.overrideFacts.HasPackage(fn.Pkg().Path())
		}
		return !calls
	})
	return calls
}

// walk records the facts of root into node.
func (w *funcFactsWalker) walk(node *semanticFunction, root ast.Node) {
	ast.Inspect(root, func(n ast.Node) bool {
		return w.visit(node, n)
	})
}

// visit records the facts of one syntax node into node and reports whether
// to walk its children.
func (w *funcFactsWalker) visit(node *semanticFunction, n ast.Node) bool {
	switch typed := n.(type) {
	case *ast.FuncLit:
		return w.visitFuncLit(typed)
	case *ast.Ident:
		w.visitIdent(node, typed)
	case *ast.SelectorExpr:
		w.visitSelector(node, typed)
		return false
	case *ast.SendStmt:
		markOwnAsync(node, typed.Pos(), asyncCauseChannel, "channel send")
	case *ast.SelectStmt:
		markOwnAsync(node, typed.Pos(), asyncCauseChannel, "select")
	case *ast.UnaryExpr:
		if typed.Op == token.ARROW {
			markOwnAsync(node, typed.Pos(), asyncCauseChannel, "channel receive")
		}
		if mutex := mutexOperand(w.pkg, typed.X); typed.Op == token.AND && mutex != nil {
			w.semPkg.recordMutexEscape(mutex, typed.Pos())
		}
	case *ast.RangeStmt:
		w.visitRange(node, typed)
	case *ast.CallExpr:
		w.visitCall(node, typed)
	case *ast.TypeAssertExpr:
		w.visitAssertedType(typed.Type)
	case *ast.CaseClause:
		for _, expr := range typed.List {
			if tv, ok := w.pkg.TypesInfo.Types[expr]; ok && tv.IsType() {
				w.visitAssertedType(expr)
			}
		}
	}
	return true
}

// visitFuncLit records a literal's node. A literal called where it is
// written is part of the enclosing node too, so its body is walked again
// into it; any other literal is a function value.
func (w *funcFactsWalker) visitFuncLit(lit *ast.FuncLit) bool {
	node := w.literal(lit)
	if w.immediate[lit] {
		return true
	}
	w.takeValue(lit, node.function)
	return false
}

// literal returns the node of lit, walking its body the first time.
func (w *funcFactsWalker) literal(lit *ast.FuncLit) *semanticFunction {
	// A literal walked before keeps its node.
	if node := w.semPkg.funcLits[lit.Pos()]; node != nil {
		return node
	}
	node := newSyntheticNode(lit.Pos(), w.pkg.Types, funcLitNodeName)
	w.semPkg.funcLits[lit.Pos()] = node
	w.walk(node, lit.Body)
	return node
}

// visitIdent records a package variable read, and a declared function
// named outside a callee position as a value.
func (w *funcFactsWalker) visitIdent(node *semanticFunction, ident *ast.Ident) {
	obj := w.pkg.TypesInfo.Uses[ident]
	recordPackageVarUse(node, obj)
	if fn, ok := obj.(*types.Func); ok && !w.callees[ident] {
		w.takeValue(ident, fn)
	}
}

// visitSelector walks the operand of a selector and records a qualified
// package variable read, and a method value, method expression or qualified
// function outside a callee position as a value.
func (w *funcFactsWalker) visitSelector(node *semanticFunction, sel *ast.SelectorExpr) {
	// The operand is walked as usual, and the selected object is read.
	w.walk(node, sel.X)
	obj := w.pkg.TypesInfo.Uses[sel.Sel]
	recordPackageVarUse(node, obj)
	if w.callees[sel] {
		return
	}

	// A mutex method taken as a value may lock it anywhere.
	if _, mutex := mutexMethodCall(w.pkg, sel); mutex != nil {
		w.semPkg.recordMutexEscape(mutex, sel.Pos())
	}

	// A method value or method expression takes the method's value.
	if selection := w.pkg.TypesInfo.Selections[sel]; selection != nil {
		method, _ := selection.Obj().(*types.Func)
		if method != nil && selection.Kind() != types.FieldVal {
			w.takeValue(sel, method)
		}
		return
	}

	// A qualified identifier may name a function of another package.
	if fn, ok := obj.(*types.Func); ok {
		w.takeValue(sel, fn)
	}
}

// visitRange records a range over a channel, which suspends, or over a
// function. Calling a declared function
// calls it; any other function is a value. The loop body is the yield
// callback, a value as async as the enclosing node.
func (w *funcFactsWalker) visitRange(node *semanticFunction, stmt *ast.RangeStmt) {
	// A range over a channel receives from it.
	if typ := w.pkg.TypesInfo.TypeOf(stmt.X); typ != nil {
		if _, ok := typ.Underlying().(*types.Chan); ok {
			markOwnAsync(node, stmt.Pos(), asyncCauseChannel, "range over channel")
			return
		}
	}

	// Only a range over a function calls it.
	signature := signatureForType(w.pkg.TypesInfo.TypeOf(stmt.X))
	if signature == nil {
		return
	}

	// The iterator is a declared function or a value.
	if called := calledFunction(w.pkg, stmt.X); called != nil {
		node.calls[functionOriginOrSelf(called)] = true
	} else {
		recordValueCall(node, funcValueShape(w.pkg.TypesInfo.TypeOf(stmt.X)))
	}
	if rangeFunctionExprNeedsAwait(w.model, w.pkg, w.overrideFacts, stmt.X) {
		markOwnAsync(node, stmt.Pos(), asyncCauseOverrideCall, "range over "+types.ExprString(stmt.X))
	}

	// The loop body is a function value of the yield type.
	if signature.Params().Len() == 1 && node.function != nil {
		w.addValue(funcValue{shape: funcValueShape(signature.Params().At(0).Type()), key: node.function})
	}
}

// visitCall records a call: of a declared function, of a value of the
// callee's shape, and of the direct async causes of the callee and the
// function arguments of a callback async override.
func (w *funcFactsWalker) visitCall(node *semanticFunction, call *ast.CallExpr) {
	// The callee is called, not taken as a value.
	fun := ast.Unparen(call.Fun)
	w.callees[calleeExpr(fun)] = true
	if lit, ok := fun.(*ast.FuncLit); ok {
		w.immediate[lit] = true
	}

	// The callee is a declared function or a value. A format function's
	// operands decide it, and a suspendingValues override hands out async
	// values.
	if called := calledFunction(w.pkg, call.Fun); called != nil && !w.visitFormatCall(node, call, called) {
		node.calls[functionOriginOrSelf(called)] = true
	}
	if callUsesFunctionValue(w.pkg, call.Fun) || callUsesFunctionIdentifier(w.pkg, call.Fun) {
		w.visitValueCall(node, call)
	}
	w.recordSuspendingValues(calledFunction(w.pkg, call.Fun), signatureForType(w.pkg.TypesInfo.TypeOf(call.Fun)))

	// A Lock of a known mutex waits on its critical sections. Some callees
	// suspend whatever the program, and callback async overrides wait on
	// their function arguments.
	if w.visitLock(node, call) {
		return
	}
	if shapes, ok := w.overrideFacts.AsyncWhenFieldShapes(calledFunction(w.pkg, call.Fun)); ok {
		for _, shape := range shapes {
			recordValueCall(node, shape)
		}
		return
	}
	if !node.async && callSuspends(w.pkg, w.overrideFacts, call.Fun) {
		kind, detail := suspendingCallCause(w.pkg, w.overrideFacts, call.Fun)
		markOwnAsync(node, call.Pos(), kind, detail)
	}
	recordCallbackOverrideCall(w.pkg, w.overrideFacts, node, call, w.literalKey)
}

// recordSuspendingValues records the shapes of the function values that an
// override function, which metadata lists in suspendingValues, hands to
// compiled code when called with signature, the function's type at a call or
// where its value is taken: its function results and the callbacks it passes
// to its function arguments. iter.Pull's next, stop and yield are such values.
func (w *funcFactsWalker) recordSuspendingValues(fn *types.Func, signature *types.Signature) {
	// Only such an override function qualifies.
	if signature == nil || !w.overrideFacts.MakesSuspendingValues(fn) {
		return
	}

	// The function results flow out to the caller.
	var shapes []string
	for result := range signature.Results().Variables() {
		shapes = append(shapes, funcValueShape(result.Type()))
	}

	// The callbacks flow into the function arguments.
	for param := range signature.Params().Variables() {
		if callee := signatureForType(param.Type()); callee != nil {
			for callback := range callee.Params().Variables() {
				shapes = append(shapes, funcValueShape(callback.Type()))
			}
		}
	}

	// Each function shape is recorded once.
	for _, shape := range shapes {
		if shape == "" {
			continue
		}
		if w.semPkg.suspendingValueShapes == nil {
			w.semPkg.suspendingValueShapes = make(map[string]bool)
		}
		w.semPkg.suspendingValueShapes[shape] = true
	}
}

// visitLock records a Lock or RLock call of a known mutex with a critical
// section as a lock of the mutex, and walks the section into its node the
// first time. It reports whether the call was one; a Lock of a known mutex
// without a section, or a TryLock of one, lets the mutex escape.
func (w *funcFactsWalker) visitLock(node *semanticFunction, call *ast.CallExpr) bool {
	// A TryLock takes the lock without a section the analysis finds.
	name, mutex := mutexMethodCall(w.pkg, call.Fun)
	if mutex != nil && (name == mutexTryLock || name == mutexTryRLock) {
		w.semPkg.recordMutexEscape(mutex, call.Pos())
		return false
	}

	// Only a Lock of a known mutex qualifies.
	if mutex == nil || name != mutexLock && name != mutexRLock {
		return false
	}
	site, ok := w.lockSites[call]
	if !ok || !site.ok {
		w.semPkg.recordMutexEscape(mutex, call.Pos())
		return false
	}

	// The section is a node of its own.
	recordLock(node, mutex)
	if w.semPkg.lockSections[call.Pos()] == nil {
		section := newSyntheticNode(call.Pos(), w.pkg.Types, lockSectionNodeName)
		section.mutex = mutex
		w.semPkg.lockSections[call.Pos()] = section
		for _, stmt := range site.region {
			w.walk(section, stmt)
		}
	}
	return true
}

// visitFormatCall records a call of a format function that override
// metadata lists in asyncWhenOperands as calls of the methods its operands'
// static types allow, and reports whether it was one. An override method
// that metadata marks async suspends.
func (w *funcFactsWalker) visitFormatCall(node *semanticFunction, call *ast.CallExpr, called *types.Func) bool {
	// Only a format function with operands that decide it qualifies.
	if !w.overrideFacts.IsAsyncWhenOperands(called) {
		return false
	}
	deps := formatCallDeps(w.pkg, called, call.Args)
	if deps.global {
		return false
	}

	// Each method is a call, or an override method by its metadata.
	for _, method := range deps.methods {
		switch {
		case formatDepIsCall(w.overrideFacts, method):
			node.calls[method] = true
		case overrideMethodAsync(w.overrideFacts, method):
			markOwnAsync(node, call.Pos(), asyncCauseOverrideCall, "formats a value whose "+method.FullName()+" is async")
		}
	}
	return true
}

// visitValueCall records a call through a function value as a call of its
// class, unless a directive on the field, variable or func type it calls
// through decides it: //goscript:async suspends, and //goscript:sync cuts the
// call from the class.
func (w *funcFactsWalker) visitValueCall(node *semanticFunction, call *ast.CallExpr) {
	directive, obj := w.directives.valueCall(w.pkg, call.Fun)
	switch directive {
	case asyncDirectiveAsync:
		markOwnAsync(node, call.Pos(), asyncCauseDirective, "call through "+obj.Name()+", which "+asyncDirectiveLine+" marks")
	case asyncDirectiveNone:
		recordValueCall(node, funcValueShape(w.pkg.TypesInfo.TypeOf(call.Fun)))
	}
}

// literalKey returns the key of lit's node, walking its body the first time.
func (w *funcFactsWalker) literalKey(lit *ast.FuncLit) *types.Func {
	return w.literal(lit).function
}

// visitAssertedType records a func type asserted from an interface value. A
// value that reflection made may have any func type, so calls of the type
// stay open.
func (w *funcFactsWalker) visitAssertedType(expr ast.Expr) {
	// Only an asserted func type opens its calls.
	if expr == nil {
		return
	}
	w.recordAssertedShape(funcValueShape(w.pkg.TypesInfo.TypeOf(expr)))
}

// recordAssertedShape records shape, the shape of a func type, as one through
// which values that reflection made can reach the package's code.
func (w *funcFactsWalker) recordAssertedShape(shape string) {
	if shape == "" {
		return
	}
	if w.semPkg.assertedFuncShapes == nil {
		w.semPkg.assertedFuncShapes = make(map[string]bool)
	}
	w.semPkg.assertedFuncShapes[shape] = true
}

// takeValue records that the package takes the value of key at expr. The
// value of a suspendingValues override function hands out suspending values
// when called.
func (w *funcFactsWalker) takeValue(expr ast.Expr, key *types.Func) {
	w.recordSuspendingValues(key, signatureForType(w.pkg.TypesInfo.TypeOf(expr)))
	w.addValue(funcValue{shape: funcValueShape(w.pkg.TypesInfo.TypeOf(expr)), key: functionOriginOrSelf(key)})
}

// addValue records a function value once.
func (w *funcFactsWalker) addValue(value funcValue) {
	if value.shape == "" || w.taken[value] {
		return
	}
	w.taken[value] = true
	w.semPkg.funcValues = append(w.semPkg.funcValues, value)
}

// calleeExpr returns the expression naming the function a call calls,
// without parentheses and the type arguments of a generic instance.
func calleeExpr(fun ast.Expr) ast.Expr {
	for {
		switch typed := fun.(type) {
		case *ast.ParenExpr:
			fun = typed.X
		case *ast.IndexExpr:
			fun = typed.X
		case *ast.IndexListExpr:
			fun = typed.X
		default:
			return fun
		}
	}
}
