package compiler

import (
	"go/ast"
	"go/token"
	"go/types"

	"golang.org/x/tools/go/packages"
)

// A transient pointer parameter is a pointer parameter or receiver that the
// function only dereferences, compares with nil and passes to other transient
// parameters during the call. Its identity is never observed: the function
// does not compare it with another pointer, keep it, return it, convert it to
// an interface or unsafe.Pointer, or let a function literal, method value or
// go or defer statement hold it.
//
// A field address &x.f passed to a transient parameter, such as a bit flag
// field whose HasFlag method has a pointer receiver, then needs no stable
// reference: a new reference to the field reads and writes the same field,
// while fieldRef finds or makes the stable one in a WeakMap, which costs far
// more, most of all for an object that has no reference yet.

// transientSlot names a parameter of a function by its index, or its
// receiver by -1.
type transientSlot struct {
	fn    *types.Func
	index int
}

// transientCandidate is a pointer parameter whose uses are all transient
// when each of its dependencies, the parameters it is passed to, is.
type transientCandidate struct {
	slot transientSlot
	deps []transientSlot
}

// markTransientPointers computes the transient pointer parameters and
// receivers of the functions of model from their candidates. The pointers a
// function passes on are transient only if the parameters they are passed
// to are, so the facts are the greatest fixpoint over the whole program: a
// candidate is dropped when a dependency is not a candidate, until none is.
func markTransientPointers(model *SemanticModel) {
	// Each pointer parameter whose uses all may be transient is a candidate.
	candidates := make(map[transientSlot]*transientCandidate)
	for _, semFn := range model.functions {
		for _, candidate := range semFn.transientCandidates {
			candidates[candidate.slot] = candidate
		}
	}

	// A candidate with a dependency that is not one is not transient.
	for changed := true; changed; {
		changed = false
		for slot, candidate := range candidates {
			for _, dep := range candidate.deps {
				if candidates[dep] == nil {
					delete(candidates, slot)
					changed = true
					break
				}
			}
		}
	}

	// The remaining candidates are marked on their functions.
	for slot := range candidates {
		semFn := model.functions[slot.fn]
		if semFn == nil {
			continue
		}
		if slot.index < 0 {
			semFn.receiverTransient = true
			continue
		}
		if semFn.paramsTransient == nil {
			semFn.paramsTransient = make([]bool, semFn.signature.Params().Len())
		}
		semFn.paramsTransient[slot.index] = true
	}
}

// transientCandidates returns the pointer receiver and parameters of decl
// whose uses all may be transient, with the parameters they depend on.
func transientCandidates(pkg *packages.Package, fn *types.Func, decl *ast.FuncDecl, overrideFacts *OverrideFacts) []*transientCandidate {
	// Only a function with a body can be checked.
	if pkg == nil || decl == nil || decl.Body == nil {
		return nil
	}

	// The receiver and each named parameter are candidates by their objects.
	type slotVar struct {
		index int
		obj   types.Object
	}
	var vars []slotVar
	if decl.Recv != nil && len(decl.Recv.List) == 1 && len(decl.Recv.List[0].Names) == 1 {
		vars = append(vars, slotVar{-1, pkg.TypesInfo.Defs[decl.Recv.List[0].Names[0]]})
	}
	index := 0
	for _, field := range decl.Type.Params.List {
		for _, name := range field.Names {
			vars = append(vars, slotVar{index, pkg.TypesInfo.Defs[name]})
			index++
		}
		if len(field.Names) == 0 {
			index++
		}
	}

	// A pointer to a plain value is a candidate when each use may be
	// transient.
	var candidates []*transientCandidate
	for _, v := range vars {
		if v.obj == nil || !isTransientPointerType(v.obj.Type()) {
			continue
		}
		deps, ok := transientUses(pkg, decl.Body, v.obj, overrideFacts)
		if ok {
			candidates = append(candidates, &transientCandidate{transientSlot{fn, v.index}, deps})
		}
	}
	return candidates
}

// isTransientPointerType reports whether typ is a pointer to a boolean,
// number, string or struct type. A pointer to a struct is transient when the
// function never observes its identity, and so may be either the struct
// object or a reference to the variable or field that holds it.
func isTransientPointerType(typ types.Type) bool {
	// Only a pointer to a basic value or a struct.
	pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer)
	if !ok {
		return false
	}
	if isStructValueType(pointer.Elem()) {
		return true
	}
	basic, ok := types.Unalias(pointer.Elem()).Underlying().(*types.Basic)
	return ok && basic.Kind() != types.UnsafePointer && basic.Kind() != types.Invalid
}

// transientUses reports whether every use of obj in body may be transient,
// and the parameters that the uses pass obj to.
func transientUses(pkg *packages.Package, body *ast.BlockStmt, obj types.Object, overrideFacts *OverrideFacts) ([]transientSlot, bool) {
	// Each use is judged by the nodes that enclose it.
	var deps []transientSlot
	ok := true
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

		// A use of obj needs its enclosing nodes to be transient.
		if ident, isIdent := node.(*ast.Ident); isIdent && pkg.TypesInfo.Uses[ident] == obj {
			dep, useOK := transientUse(pkg, stack, overrideFacts)
			ok = useOK
			if useOK && dep != nil {
				deps = append(deps, *dep)
			}
		}
		return true
	})
	return deps, ok
}

// transientUse judges the use of a pointer at the top of stack. It reports
// whether the use may be transient, and the parameter it passes the pointer
// to, if any, which must then be transient too.
func transientUse(pkg *packages.Package, stack []ast.Node, overrideFacts *OverrideFacts) (*transientSlot, bool) {
	// A function literal may run after the call returns.
	for _, node := range stack {
		if _, ok := node.(*ast.FuncLit); ok {
			return nil, false
		}
	}

	// The use is judged by its parent, and a pointer conversion by the
	// conversion's parent, since it is the same reference.
	at := len(stack) - 1
	for {
		parent, parentAt := transientParent(stack, at)
		if parent == nil {
			return nil, false
		}
		switch typed := parent.(type) {
		case *ast.StarExpr:
			return nil, transientDeref(pkg, stack, parentAt)
		case *ast.BinaryExpr:
			return nil, transientNilCompare(pkg, typed)
		case *ast.SelectorExpr:
			if transientFieldSelection(pkg, typed) {
				return nil, true
			}
			return transientMethodCall(pkg, stack, parentAt, typed, overrideFacts)
		case *ast.CallExpr:
			if transientPointerConversion(pkg, typed) {
				at = parentAt
				continue
			}
			return transientCallArg(pkg, stack, parentAt, typed, stack[parentAt+1], overrideFacts)
		default:
			return nil, false
		}
	}
}

// transientParent returns the nearest node enclosing stack[at] that is not a
// parenthesis, and its index.
func transientParent(stack []ast.Node, at int) (ast.Node, int) {
	for idx := at - 1; idx >= 0; idx-- {
		if _, ok := stack[idx].(*ast.ParenExpr); !ok {
			return stack[idx], idx
		}
	}
	return nil, -1
}

// transientDeref reports whether the dereference *p at stack[at] only reads
// or writes the value: &*p and a pointer method called on *p yield p itself.
func transientDeref(pkg *packages.Package, stack []ast.Node, at int) bool {
	// The address of the dereference is the pointer.
	parent, _ := transientParent(stack, at)
	if unary, ok := parent.(*ast.UnaryExpr); ok && unary.Op == token.AND {
		return false
	}

	// A pointer method takes the address of its receiver.
	if selector, ok := parent.(*ast.SelectorExpr); ok {
		selection := pkg.TypesInfo.Selections[selector]
		if selection != nil && selection.Kind() == types.MethodVal && methodHasPointerReceiver(selection.Obj()) {
			return false
		}
	}
	return true
}

// transientNilCompare reports whether a comparison is p == nil or p != nil,
// which does not depend on the pointer's identity.
func transientNilCompare(pkg *packages.Package, expr *ast.BinaryExpr) bool {
	// Only an equality comparison with nil is independent of identity.
	if expr.Op != token.EQL && expr.Op != token.NEQ {
		return false
	}
	return pkg.TypesInfo.Types[expr.X].IsNil() || pkg.TypesInfo.Types[expr.Y].IsNil()
}

// transientPointerConversion reports whether call converts a pointer to
// another pointer type, which keeps the same reference.
func transientPointerConversion(pkg *packages.Package, call *ast.CallExpr) bool {
	// Only a conversion to a pointer type that is not unsafe.Pointer.
	if len(call.Args) != 1 || !pkg.TypesInfo.Types[call.Fun].IsType() {
		return false
	}
	_, ok := types.Unalias(pkg.TypesInfo.TypeOf(call.Fun)).Underlying().(*types.Pointer)
	return ok
}

// transientFieldSelection reports whether selector selects a field of the
// struct that a pointer points to, which reads or addresses that struct's
// storage, whatever reference to it the pointer is.
func transientFieldSelection(pkg *packages.Package, selector *ast.SelectorExpr) bool {
	selection := pkg.TypesInfo.Selections[selector]
	return selection != nil && selection.Kind() == types.FieldVal
}

// transientMethodCall judges p.M at stack[at]: a call of a value method reads
// *p, and a call of a pointer method passes p as its receiver. A method
// promoted from an embedded field takes that field or the pointer it holds,
// not p.
func transientMethodCall(pkg *packages.Package, stack []ast.Node, at int, selector *ast.SelectorExpr, overrideFacts *OverrideFacts) (*transientSlot, bool) {
	// Only a direct call of a method, not a method value.
	selection := pkg.TypesInfo.Selections[selector]
	if selection == nil || selection.Kind() != types.MethodVal {
		return nil, false
	}
	call, callAt := transientParent(stack, at)
	callExpr, ok := call.(*ast.CallExpr)
	if !ok || ast.Unparen(callExpr.Fun) != selector || transientDeferredCall(stack, callAt, callExpr) {
		return nil, false
	}

	// A value method or a promoted method reads *p, and a pointer method's
	// receiver must be transient.
	method, _ := selection.Obj().(*types.Func)
	if method == nil {
		return nil, false
	}
	if !methodHasPointerReceiver(method) || len(selection.Index()) != 1 {
		return nil, true
	}
	return transientCallee(method, -1, overrideFacts)
}

// transientCallArg judges p passed as an argument of call at stack[at].
func transientCallArg(pkg *packages.Package, stack []ast.Node, at int, call *ast.CallExpr, arg ast.Node, overrideFacts *OverrideFacts) (*transientSlot, bool) {
	// Only a static call that runs now, as the argument of a fixed parameter.
	if transientDeferredCall(stack, at, call) || call.Ellipsis.IsValid() {
		return nil, false
	}
	fn := calledFunction(pkg, ast.Unparen(call.Fun))
	if fn == nil || isMethodExprCall(pkg, call) {
		return nil, false
	}
	signature, ok := fn.Type().(*types.Signature)
	if !ok {
		return nil, false
	}

	// The argument must be passed to a parameter that is not variadic.
	index := -1
	for idx, callArg := range call.Args {
		if callArg == arg {
			index = idx
		}
	}
	if index < 0 || (signature.Variadic() && index >= signature.Params().Len()-1) {
		return nil, false
	}
	return transientCallee(fn, index, overrideFacts)
}

// transientDeferredCall reports whether call at stack[at] is the call of a
// go or defer statement.
func transientDeferredCall(stack []ast.Node, at int, call *ast.CallExpr) bool {
	// The statement is the parent of its call.
	parent, _ := transientParent(stack, at)
	switch typed := parent.(type) {
	case *ast.GoStmt:
		return typed.Call == call
	case *ast.DeferStmt:
		return typed.Call == call
	}
	return false
}

// transientCallee returns the parameter of fn by index, or its receiver by
// -1, that a pointer passed to it depends on. An override declares its
// transient functions in its metadata, whose parameters need nothing more.
func transientCallee(fn *types.Func, index int, overrideFacts *OverrideFacts) (*transientSlot, bool) {
	// An override function is transient by its metadata, which names
	// package-level functions.
	fn = functionOriginOrSelf(fn)
	if fn.Pkg() != nil && overrideFacts.HasPackage(fn.Pkg().Path()) {
		if index < 0 || fn.Type().(*types.Signature).Recv() != nil {
			return nil, false
		}
		return nil, overrideFacts.IsTransientPointerFunction(fn.Pkg().Path(), fn.Name())
	}

	// Other functions are transient by the fixpoint.
	return &transientSlot{fn, index}, true
}

// methodHasPointerReceiver reports whether obj is a method with a pointer
// receiver.
func methodHasPointerReceiver(obj types.Object) bool {
	signature, ok := obj.Type().(*types.Signature)
	if !ok || signature.Recv() == nil {
		return false
	}
	_, pointer := types.Unalias(signature.Recv().Type()).(*types.Pointer)
	return pointer
}

// isMethodExprCall reports whether call calls a method expression T.M, whose
// first argument is the receiver rather than the method's first parameter.
func isMethodExprCall(pkg *packages.Package, call *ast.CallExpr) bool {
	selector, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr)
	if !ok {
		return false
	}
	selection := pkg.TypesInfo.Selections[selector]
	return selection != nil && selection.Kind() == types.MethodExpr
}
