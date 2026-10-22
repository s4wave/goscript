package compiler

import (
	"go/ast"
	"go/types"
	"strconv"
	"strings"
)

// A pointer method called on an addressable struct value, such as x.M() or
// s.f.M(), runs on the struct object itself, which is fast. Taking the
// address &x or &s.f elsewhere gives a reference to the variable or field
// instead, and the two are different objects. A method whose receiver is
// transient never observes the difference; any other method may keep its
// receiver or compare it, so it takes the reference that & gives.

// observesReceiver reports whether method is a pointer method of a generated
// struct class whose receiver is not transient, and so must be the same
// pointer that taking the address of its operand gives.
func (o *LoweringOwner) observesReceiver(ctx lowerFileContext, method *types.Func) bool {
	// Only a pointer method of a struct that is not an override.
	if method == nil || !methodHasPointerReceiver(method) {
		return false
	}
	recv := method.Type().(*types.Signature).Recv().Type()
	if !isPointerToStructType(recv) || o.receiverUsesOverridePackage(recv) {
		return false
	}

	// A transient receiver needs no reference.
	semFn := semanticFunctionFor(ctx.model, method)
	return semFn == nil || !semFn.receiverTransient
}

// lowerIdentityReceiverAddress lowers the address of the struct that a call
// of a pointer method selected from operand receives: &operand, or the
// address of the embedded struct field that the method is promoted from. It
// reports false when the receiver is a pointer that operand holds, or a
// struct of an override package.
func (o *LoweringOwner) lowerIdentityReceiverAddress(ctx lowerFileContext, operand ast.Expr, selection *types.Selection) (string, []Diagnostic, bool) {
	// A method of the operand's own struct type takes &operand.
	operandType := ctx.semPkg.source.TypesInfo.TypeOf(operand)
	if o.receiverUsesOverridePackage(operandType) || o.isOverrideFieldValue(ctx, operand) {
		return "", nil, false
	}
	index := selection.Index()
	if len(index) == 1 {
		if isPointerType(operandType) || !isStructValueType(operandType) {
			return "", nil, false
		}
		address, diagnostics := o.lowerAddressExpr(ctx, operand)
		return address, diagnostics, true
	}

	// A promoted method takes the address of the embedded struct field.
	if !o.promotedFromStructField(operandType, index[:len(index)-1]) {
		return "", nil, false
	}
	address, diagnostics := o.lowerPromotedFieldAddress(ctx, operand, index[:len(index)-1])
	return address, diagnostics, true
}

// promotedFromStructField reports whether the path of embedded fields from
// typ ends at a struct value field, not a pointer, of a type that is not an
// override.
func (o *LoweringOwner) promotedFromStructField(typ types.Type, path []int) bool {
	// Each embedded field is selected in turn.
	for _, fieldIndex := range path {
		structType := structUnderlyingType(derefPointerType(typ))
		if structType == nil || fieldIndex < 0 || fieldIndex >= structType.NumFields() {
			return false
		}
		typ = structType.Field(fieldIndex).Type()
	}

	// The last one is a struct value.
	return !isPointerType(typ) && isStructValueType(typ) && !o.receiverUsesOverridePackage(typ)
}

// lowerIdentityReceiverMethodCall lowers a call of a pointer method that
// observes its receiver on an addressable struct value, which receives the
// address of that struct.
func (o *LoweringOwner) lowerIdentityReceiverMethodCall(
	ctx lowerFileContext,
	selector *ast.SelectorExpr,
	selection *types.Selection,
	args []string,
) (string, []Diagnostic, bool) {
	// Only a method that observes its receiver, on a struct value.
	method, _ := selection.Obj().(*types.Func)
	if !o.observesReceiver(ctx, method) {
		return "", nil, false
	}
	address, diagnostics, ok := o.lowerIdentityReceiverAddress(ctx, selector.X, selection)
	if !ok {
		return "", nil, false
	}

	// The method of the struct's class is called with the address as its
	// receiver.
	if prototype, ok := o.pointerMethodPrototype(ctx, method); ok {
		return prototype + ".call(" + strings.Join(append([]string{address}, args...), ", ") + ")", diagnostics, true
	}

	// A class the file cannot name is found from the struct.
	callArgs := append([]string{address, strconv.Quote(method.Name())}, args...)
	call := o.runtimeOwner.QualifiedHelper(RuntimeHelperCallPointerMethod) + "(" + strings.Join(callArgs, ", ") + ")"
	return call, diagnostics, true
}

// lowerIdentityReceiverMethodValue lowers the method value x.M of a pointer
// method that observes its receiver on an addressable struct value, which is
// bound to the address of that struct.
func (o *LoweringOwner) lowerIdentityReceiverMethodValue(ctx lowerFileContext, expr *ast.SelectorExpr, selection *types.Selection) (string, []Diagnostic, bool) {
	// Only a method that observes its receiver, on a struct value.
	method, _ := selection.Obj().(*types.Func)
	if !o.observesReceiver(ctx, method) {
		return "", nil, false
	}
	address, diagnostics, ok := o.lowerIdentityReceiverAddress(ctx, expr.X, selection)
	if !ok {
		return "", nil, false
	}

	// The bound address is the receiver of the method of the struct's
	// class.
	callee := identityReceiverCallee("__receiver", method.Name())
	if prototype, ok := o.pointerMethodPrototype(ctx, method); ok {
		callee = prototype + ".call"
	}
	return o.lowerMethodValueClosure(ctx, selection, address, callee, true), diagnostics, true
}

// pointerMethodPrototype returns the pointer method of a struct type read
// from the prototype of the struct's class, as in T.prototype.M, through
// which a call with a reference to the struct as its receiver finds the
// method directly rather than on the struct that the reference refers to.
// It reports false when the file cannot name the class at run time: an
// override, a type of a package that the file does not import as a value
// or defers, or an unexported type of another package.
func (o *LoweringOwner) pointerMethodPrototype(ctx lowerFileContext, method *types.Func) (string, bool) {
	// The struct type that declares the method, of no override.
	receiver := methodReceiverNamedType(method)
	if receiver == nil || receiver.Obj() == nil || receiver.Obj().Pkg() == nil || o.receiverUsesOverridePackage(receiver) {
		return "", false
	}

	// A type of this package is declared in this file or in one that the
	// file imports as a value.
	pkgPath := receiver.Obj().Pkg().Path()
	local := pkgPath == ctx.semPkg.pkgPath
	if alias := ctx.localAliases[receiver.Obj()]; local && alias != "" && !ctx.runtimeAliases[alias] {
		return "", false
	}

	// Another package's type is exported by a package that the file
	// imports and does not defer.
	deferred := ctx.model.hasDeferredPackage(pkgPath) && !ctx.model.hasDeferredPackage(ctx.semPkg.pkgPath)
	if !local && (ctx.importPaths[pkgPath] == "" || deferred || crossPackageUnexportedNamedType(ctx, receiver)) {
		return "", false
	}

	// The prototype of its class holds the method.
	member := methodMemberName(method.Name())
	if !strings.HasPrefix(member, "[") {
		member = "." + member
	}
	return namedValueExpr(ctx, receiver) + ".prototype" + member, true
}

// identityReceiverCallee returns the call method of the method name of the
// struct that the reference named ref refers to, which takes ref as its
// receiver.
func identityReceiverCallee(ref, name string) string {
	member := methodMemberName(name)
	if !strings.HasPrefix(member, "[") {
		member = "." + member
	}
	return ref + ".value" + member + ".call"
}

// embeddedForwarderIdentityReceiver returns the reference to the embedded
// struct field that the forwarder of a promoted pointer method passes as its
// receiver, when the method observes its receiver: the field is selected
// from this through the path of embedded fields that selection, made from
// the type of field, follows.
func (o *LoweringOwner) embeddedForwarderIdentityReceiver(ctx lowerFileContext, field semanticField, selection *types.Selection, method *types.Func) (string, bool) {
	// Only a method that observes its receiver.
	if !o.observesReceiver(ctx, method) {
		return "", false
	}

	// Each embedded field on the path holds the next.
	parent, name, typ := "this", tsStructFieldName(field.name, 0), field.typ
	for _, fieldIndex := range selection.Index()[:len(selection.Index())-1] {
		structType := structUnderlyingType(derefPointerType(typ))
		if structType == nil || fieldIndex < 0 || fieldIndex >= structType.NumFields() {
			return "", false
		}
		parent = o.embeddedForwarderSelectableExpr(ctx, typ, parent+"."+name)
		next := structType.Field(fieldIndex)
		name, typ = tsStructFieldName(next.Name(), fieldIndex), next.Type()
	}

	// The last one is referenced when it is a struct value.
	if isPointerType(typ) || !isStructValueType(typ) || o.receiverUsesOverridePackage(typ) {
		return "", false
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperFieldRef) + "(" + parent + ", " + strconv.Quote(name) + ")", true
}
