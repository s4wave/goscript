package compiler

import (
	"go/ast"
	"go/types"
	"slices"
	"strconv"
	"strings"

	"golang.org/x/tools/go/packages"
)

// Reflection twins.
//
// An interpreter such as yaegi calls the exported functions and methods of a
// program through reflect.Value.Call, and passes them the function values that
// reflection made for its own function literals, which may suspend. A call of
// such a value through a func parameter must then await it, but making every
// call through the parameter's func type await, wherever the program calls
// such a type, makes much of the program async.
//
// A callback parameter is a func parameter that its function only calls,
// compares with nil and passes to callback parameters of other functions, all
// during the call: it never keeps, returns or converts the value, nor lets a
// function literal, method value, go or defer statement hold it. A function
// with callback parameters that reflection can call gets a twin: an async
// copy of its body that awaits the calls of its callback parameters and passes
// them to the twins of the functions it passes them to. reflect.Value.Call
// calls the twin, while compiled callers, which pass compiled functions, call
// the function itself, which stays sync. Any other func parameter of an
// exported function or method escapes the call, so calls of its func type stay
// open where the program can make function values (see buildFuncValueGraph).

// reflectTwinSuffix ends the name of a twin, which no Go identifier has as it
// is not one.
const reflectTwinSuffix = "$reflect"

// callbackSlot names a func parameter of a function by its index.
type callbackSlot struct {
	fn    *types.Func
	index int
}

// callbackCandidate is a func parameter whose uses are all callback uses when
// each of its dependencies, the parameters it is passed to, is a callback
// parameter. called reports whether the function calls or passes it at all.
type callbackCandidate struct {
	slot   callbackSlot
	deps   []callbackSlot
	called bool
}

// callbackCandidates returns the func parameters of decl whose uses all may
// be callback uses, with the parameters they depend on. Only a function that
// can have a twin has candidates: a function or a method of a named struct
// type, neither of which is generic.
func callbackCandidates(pkg *packages.Package, fn *types.Func, decl *ast.FuncDecl) []*callbackCandidate {
	// Only a function with a body that can have a twin is checked.
	if pkg == nil || decl == nil || decl.Body == nil || !reflectTwinKind(fn) {
		return nil
	}

	// Each named func parameter that is not variadic is a candidate when each
	// use may be a callback use.
	var candidates []*callbackCandidate
	index := 0
	for _, field := range decl.Type.Params.List {
		for _, name := range field.Names {
			obj := pkg.TypesInfo.Defs[name]
			if candidate := callbackCandidateFor(pkg, fn, decl, obj, index); candidate != nil {
				candidates = append(candidates, candidate)
			}
			index++
		}
		if len(field.Names) == 0 {
			index++
		}
	}
	return candidates
}

// callbackCandidateFor returns the candidate of obj, the parameter of fn at
// index, or nil when obj is not a func parameter or a use lets it escape.
func callbackCandidateFor(pkg *packages.Package, fn *types.Func, decl *ast.FuncDecl, obj types.Object, index int) *callbackCandidate {
	// Only a func parameter that is not variadic qualifies.
	if obj == nil || signatureForType(obj.Type()) == nil {
		return nil
	}
	if _, ok := types.Unalias(obj.Type()).Underlying().(*types.Signature); !ok {
		return nil
	}

	// Each of its uses must be a callback use.
	deps, called, ok := callbackUses(pkg, decl.Body, obj)
	if !ok {
		return nil
	}
	return &callbackCandidate{slot: callbackSlot{fn, index}, deps: deps, called: called}
}

// reflectTwinKind reports whether fn is a function or method that can have a
// twin: a package function or a method of a named struct type, not generic.
func reflectTwinKind(fn *types.Func) bool {
	// A generic function or a method of a generic type has none.
	signature, _ := fn.Type().(*types.Signature)
	if signature == nil || signature.TypeParams().Len() != 0 || signature.RecvTypeParams().Len() != 0 {
		return false
	}

	// A method's receiver is a named struct type or a pointer to one.
	if signature.Recv() == nil {
		return true
	}
	return namedStructType(receiverNamedType(signature.Recv().Type())) != nil
}

// callbackUses reports whether every use of obj in body may be a callback
// use, the parameters that the uses pass obj to, and whether a use calls or
// passes it.
func callbackUses(pkg *packages.Package, body *ast.BlockStmt, obj types.Object) ([]callbackSlot, bool, bool) {
	// Each use is judged by the nodes that enclose it.
	var deps []callbackSlot
	called, ok := false, true
	var stack []ast.Node
	ast.Inspect(body, func(node ast.Node) bool {
		// The stack holds the nodes from body to the current one.
		if !ok {
			return false
		}
		if node == nil {
			stack = stack[:len(stack)-1]
			return true
		}
		stack = append(stack, node)

		// A use of obj needs its enclosing nodes to keep it in the call.
		if ident, isIdent := node.(*ast.Ident); isIdent && pkg.TypesInfo.Uses[ident] == obj {
			dep, calls, useOK := callbackUse(pkg, stack)
			ok, called = useOK, called || calls
			if useOK && dep != nil {
				deps = append(deps, *dep)
			}
		}
		return true
	})
	return deps, called, ok
}

// callbackUse judges the use of a func parameter at the top of stack. It
// reports the parameter that the use passes it to, if any, which must then be
// a callback parameter too, whether the use calls or passes it, and whether
// the use is a callback use.
func callbackUse(pkg *packages.Package, stack []ast.Node) (*callbackSlot, bool, bool) {
	// A function literal may run after the call returns.
	for _, node := range stack {
		if _, ok := node.(*ast.FuncLit); ok {
			return nil, false, false
		}
	}

	// The use is judged by its parent: a call of the value that runs now, a
	// comparison with nil, or an argument of a static call.
	at := len(stack) - 1
	parent, parentAt := transientParent(stack, at)
	switch typed := parent.(type) {
	case *ast.BinaryExpr:
		return nil, false, transientNilCompare(pkg, typed)
	case *ast.CallExpr:
		if ast.Unparen(typed.Fun) == stack[at] {
			return nil, true, !transientDeferredCall(stack, parentAt, typed)
		}
		dep, ok := callbackCallArg(pkg, stack, parentAt, typed, stack[parentAt+1])
		return dep, ok, ok
	}
	return nil, false, false
}

// callbackCallArg judges a func parameter passed as an argument of call at
// stack[at]: only a static call that runs now of a function, or of a method
// declared on the receiver's own named type, named without parentheses, as
// the argument of a parameter that is not variadic, keeps it in the call when
// that parameter does.
func callbackCallArg(pkg *packages.Package, stack []ast.Node, at int, call *ast.CallExpr, arg ast.Node) (*callbackSlot, bool) {
	// The call runs now and calls a declared function or method.
	if transientDeferredCall(stack, at, call) || call.Ellipsis.IsValid() || isMethodExprCall(pkg, call) {
		return nil, false
	}
	fun := call.Fun
	fn := calledFunction(pkg, fun)
	if fn == nil {
		return nil, false
	}

	// A method is called on its own receiver type, not promoted from an
	// embedded field or through an interface.
	if selector, ok := fun.(*ast.SelectorExpr); ok {
		selection := pkg.TypesInfo.Selections[selector]
		if selection != nil && (selection.Kind() != types.MethodVal || len(selection.Index()) != 1 || isInterfaceType(selection.Recv())) {
			return nil, false
		}
	}

	// The argument is passed to a parameter that is not variadic.
	signature, _ := fn.Type().(*types.Signature)
	index := slices.Index(call.Args, arg.(ast.Expr))
	if signature == nil || index < 0 || (signature.Variadic() && index >= signature.Params().Len()-1) {
		return nil, false
	}
	return &callbackSlot{functionOriginOrSelf(fn), index}, true
}

// markCallbackParams computes the callback parameters of the functions of
// model from their candidates. A parameter that a function passes on is a
// callback parameter only if the parameters it is passed to are, so the facts
// are the greatest fixpoint over the whole program, as for transient
// pointers. A deferred function, and a method whose value the program takes,
// which reflection could call without its twin, have none.
func markCallbackParams(model *SemanticModel, values []funcValue) {
	// Each func parameter whose uses all may be callback uses is a candidate.
	candidates := make(map[callbackSlot]*callbackCandidate)
	for _, semFn := range model.functions {
		if semFn.deferred || semFn.function.Pkg() == nil || model.deferredPackages[semFn.function.Pkg().Path()] {
			continue
		}
		for _, candidate := range semFn.callbackCandidates {
			candidates[candidate.slot] = candidate
		}
	}
	dropMethodValueCandidates(candidates, values)

	// A candidate with a dependency that is not one is not a callback.
	for changed := true; changed; {
		changed = false
		for slot, candidate := range candidates {
			if slices.ContainsFunc(candidate.deps, func(dep callbackSlot) bool { return candidates[dep] == nil }) {
				delete(candidates, slot)
				changed = true
			}
		}
	}

	// The remaining candidates are marked on their functions.
	for slot, candidate := range candidates {
		semFn := model.functions[slot.fn]
		if semFn.paramsCallback == nil {
			semFn.paramsCallback = make([]*callbackCandidate, semFn.signature.Params().Len())
		}
		semFn.paramsCallback[slot.index] = candidate
	}
}

// dropMethodValueCandidates drops the candidates of the methods whose values
// the program takes: a method value is a new function, without the twin.
func dropMethodValueCandidates(candidates map[callbackSlot]*callbackCandidate, values []funcValue) {
	// Collect the methods taken as values.
	methods := make(map[*types.Func]bool)
	for _, value := range values {
		if signature, _ := value.key.Type().(*types.Signature); signature != nil && signature.Recv() != nil {
			methods[value.key] = true
		}
	}

	// Their parameters escape.
	for slot := range candidates {
		if methods[slot.fn] {
			delete(candidates, slot)
		}
	}
}

// reflectCallable reports whether reflection can call fn, a declared
// function or method: it is exported and not generic.
func reflectCallable(fn *types.Func) bool {
	signature, _ := fn.Type().(*types.Signature)
	return fn.Exported() && signature != nil && !isInterfaceMethod(fn) &&
		signature.TypeParams().Len() == 0 && signature.RecvTypeParams().Len() == 0
}

// escapingReflectParamShapes returns the shapes of the func parameters of the
// functions and methods that reflection can call which are not callback
// parameters. reflect.Value.Call may pass them function values that
// reflection made, which the functions keep or pass on beyond the call, so
// calls of their func types stay open.
func escapingReflectParamShapes(model *SemanticModel) map[string]bool {
	shapes := make(map[string]bool)
	for fn, semFn := range model.functions {
		// Only a declared function that reflection can call qualifies.
		if semFn.function != fn || !reflectCallable(fn) {
			continue
		}

		// Each func parameter that is not a callback parameter escapes.
		for idx := range semFn.signature.Params().Len() {
			param := semFn.signature.Params().At(idx)
			if _, ok := types.Unalias(param.Type()).Underlying().(*types.Signature); !ok {
				continue
			}
			if semFn.callbackParam(idx) == nil {
				shapes[funcValueShape(param.Type())] = true
			}
		}
	}
	return shapes
}

// callbackParam returns the candidate of the parameter at idx when it is a
// callback parameter, or nil.
func (semFn *semanticFunction) callbackParam(idx int) *callbackCandidate {
	if idx >= len(semFn.paramsCallback) {
		return nil
	}
	return semFn.paramsCallback[idx]
}

// markReflectTwins marks the functions that get a twin: each function or
// method that reflection can call with a callback parameter that it calls
// through a func type whose calls do not await, and the functions their twins
// pass callback parameters to. Only a whole program that makes function
// values by reflection has twins; in any other, every call of a func type
// awaits or no such value exists.
func markReflectTwins(model *SemanticModel) {
	// Collect the functions that reflection calls with values it made.
	if !model.makesFuncValues {
		return
	}
	var queue []*types.Func
	for fn, semFn := range model.functions {
		if semFn.function == fn && reflectCallable(fn) && model.needsReflectTwin(semFn) {
			queue = append(queue, fn)
		}
	}

	// Their twins call the twins of the functions they pass callbacks to.
	model.reflectTwins = make(map[*types.Func]bool)
	for len(queue) != 0 {
		fn := queue[len(queue)-1]
		queue = queue[:len(queue)-1]
		if model.reflectTwins[fn] {
			continue
		}
		model.reflectTwins[fn] = true
		for _, candidate := range model.functions[fn].paramsCallback {
			if candidate == nil {
				continue
			}
			for _, dep := range candidate.deps {
				queue = append(queue, dep.fn)
			}
		}
	}
}

// needsReflectTwin reports whether semFn has a callback parameter that it
// calls or passes on whose calls do not await.
func (m *SemanticModel) needsReflectTwin(semFn *semanticFunction) bool {
	for idx, candidate := range semFn.paramsCallback {
		if candidate != nil && candidate.called && !m.shapeCallAsync(funcValueShape(semFn.signature.Params().At(idx).Type())) {
			return true
		}
	}
	return false
}

// reflectTwin reports whether fn has a twin.
func (m *SemanticModel) reflectTwin(fn *types.Func) bool {
	return fn != nil && m.reflectTwins[functionOriginOrSelf(fn)]
}

// reflectTwinParams returns the callback parameters of fn, whose calls its
// twin awaits.
func (m *SemanticModel) reflectTwinParams(fn *types.Func) map[types.Object]bool {
	params := make(map[types.Object]bool)
	semFn := m.functions[fn]
	for idx, candidate := range semFn.paramsCallback {
		if candidate != nil {
			params[semFn.signature.Params().At(idx)] = true
		}
	}
	return params
}

// reflectTwinFacts returns the fact digest lines of the twins of the
// functions a package declares, with their callback parameters, which decide
// the twins it lowers and the calls of other packages' twins.
func (m *SemanticModel) reflectTwinFacts(semPkg *semanticPackage) []string {
	var lines []string
	for _, semFn := range semPkg.functions {
		if !m.reflectTwins[semFn.function] {
			continue
		}
		var params []string
		for idx, candidate := range semFn.paramsCallback {
			if candidate != nil {
				params = append(params, strconv.Itoa(idx))
			}
		}
		lines = append(lines, "reflect-twin|"+objectFactID(m.fileSet(), semFn.function)+"|"+strings.Join(params, ","))
	}
	return lines
}
