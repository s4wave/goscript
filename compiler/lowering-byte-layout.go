package compiler

import (
	"go/ast"
	"go/types"
	"strconv"
	"strings"
)

// lowerUnsafeByteView lowers fixed-layout pointers whose erased source may be bytes.
func (o *LoweringOwner) lowerUnsafeByteView(ctx lowerFileContext, target types.Type, source ast.Expr, value string) (string, bool) {
	// Only an unsafe pointer converted to fixed-layout storage needs this view.
	if !isUnsafePointerType(ctx.semPkg.source.TypesInfo.TypeOf(source)) {
		return "", false
	}
	pointer, _ := types.Unalias(target).Underlying().(*types.Pointer)
	if pointer == nil {
		return "", false
	}
	switch types.Unalias(pointer.Elem()).Underlying().(type) {
	case *types.Array, *types.Struct:
	case *types.Basic:
		if byteLayoutScalarKind(pointer.Elem()) == "" && !basicKind(pointer.Elem(), types.Bool) {
			return "", false
		}
	default:
		return "", false
	}

	// Byte origins take precedence; ordinary numeric arrays keep their old view.
	fallbackArgs := ""
	if _, element, _, ok := o.lowerUnsafeArrayPointerSourceRef(ctx, source); ok && isNumericType(element) && !isByteType(element) {
		from, fromSize := fixedSizeNumericKind(element)
		if _, array := types.Unalias(pointer.Elem()).Underlying().(*types.Array); array {
			fallbackArgs = ", undefined, " + strconv.FormatInt(goScriptElementByteSize(ctx, element), 10)
		}
		if _, toSize := fixedSizeNumericKind(pointer.Elem()); fromSize != 0 && fromSize == toSize {
			if from == "rune" {
				from = "int32"
			}
			fallbackArgs = ", " + strconv.Quote(from)
		}
	}

	// Reuse a target's descriptor without allocating it for each executed cast.
	layout, ok := o.byteLayoutExpr(ctx, pointer.Elem())
	if !ok {
		layout = "null"
	} else if typeIsHoistable(pointer.Elem()) {
		layout = o.hoistStatic(ctx, layout)
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperUnsafeByteView) + "<" + o.tsTypeFor(ctx, target) + ">(" + value + ", " + layout + fallbackArgs + ")", true
}

// byteLayoutExpr describes Go-sized scalar, array and struct storage recursively.
// Managed references have no byte representation in the JavaScript heap.
func (o *LoweringOwner) byteLayoutExpr(ctx lowerFileContext, typ types.Type) (string, bool) {
	// Use the loaded target's sizes, including field padding and array strides.
	sizes := ctx.semPkg.source.TypesSizes
	if sizes == nil || typeContainsTypeParam(typ) {
		return "", false
	}
	prefix := "{ size: " + strconv.FormatInt(sizes.Sizeof(typ), 10) + ", align: " + strconv.FormatInt(sizes.Alignof(typ), 10)

	// Scalars retain their Go numeric representation rather than their JS width.
	if kind := byteLayoutScalarKind(typ); kind != "" {
		if kind == "byte" {
			kind = "uint8"
		} else if kind == "rune" {
			kind = "int32"
		}
		return prefix + ", kind: \"scalar\", scalar: " + strconv.Quote(kind) + " }", true
	}
	if basicKind(typ, types.Bool) {
		return prefix + ", kind: \"scalar\", scalar: \"bool\" }", true
	}

	// Composite views use recursive element layouts and compiler field offsets.
	switch shape := types.Unalias(typ).Underlying().(type) {
	case *types.Array:
		element, ok := o.byteLayoutExpr(ctx, shape.Elem())
		if !ok {
			return "", false
		}
		return prefix + ", kind: \"array\", length: " + strconv.FormatInt(shape.Len(), 10) + ", element: " + element + " }", true
	case *types.Struct:
		fields := make([]*types.Var, shape.NumFields())
		for i := range fields {
			fields[i] = shape.Field(i)
		}
		offsets := sizes.Offsetsof(fields)
		entries := make([]string, len(fields))
		for i, field := range fields {
			layout, ok := o.byteLayoutExpr(ctx, field.Type())
			if !ok {
				return "", false
			}
			entries[i] = "{ key: " + strconv.Quote(tsStructFieldName(field.Name(), i)) + ", offset: " + strconv.FormatInt(offsets[i], 10) + ", layout: " + layout + " }"
		}
		create := ""
		if named := namedStructType(typ); named != nil {
			create = ", create: () => new " + namedValueExpr(ctx, named) + "()"
		}
		return prefix + ", kind: \"struct\"" + create + ", fields: [" + strings.Join(entries, ", ") + "] }", true
	default:
		return "", false
	}
}

// byteLayoutScalarKind includes target-sized words, represented as JS numbers.
func byteLayoutScalarKind(typ types.Type) string {
	// Fixed-width integers and floats retain their existing runtime kind.
	if kind, _ := fixedSizeNumericKind(typ); kind != "" {
		return kind
	}

	// The descriptor's size comes from the loaded target rather than the host.
	basic, _ := types.Unalias(typ).Underlying().(*types.Basic)
	if basic != nil {
		switch basic.Kind() {
		case types.Int, types.Uint, types.Uintptr:
			return basic.Name()
		}
	}
	return ""
}

// unsafeStringArraySource recognizes a byte-array pointer over string data.
func unsafeStringArraySource(ctx lowerFileContext, expr ast.Expr) (ast.Expr, int64, bool) {
	// The immediate slice supplies its bounds; the declared array may be huge.
	call, ok := unwrapParenExpr(expr).(*ast.CallExpr)
	if !ok || len(call.Args) != 1 {
		return nil, 0, false
	}
	target := typeFromExpr(ctx, call.Fun)
	if target == nil {
		return nil, 0, false
	}
	pointer, _ := types.Unalias(target).Underlying().(*types.Pointer)
	if pointer == nil {
		return nil, 0, false
	}
	array, _ := types.Unalias(pointer.Elem()).Underlying().(*types.Array)
	if array == nil || !isByteType(array.Elem()) {
		return nil, 0, false
	}

	// Reuse the existing reflect-header data recognition without evaluating it.
	unsafeCall, ok := unwrapParenExpr(call.Args[0]).(*ast.CallExpr)
	if !ok || len(unsafeCall.Args) != 1 || !isUnsafePointerType(typeFromExpr(ctx, unsafeCall.Fun)) {
		return nil, 0, false
	}
	source, ok := stringHeaderDataSource(ctx, unsafeCall.Args[0])
	return source, array.Len(), ok
}
