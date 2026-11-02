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
		if kind, _ := fixedSizeNumericKind(pointer.Elem()); kind == "" && !basicKind(pointer.Elem(), types.Bool) {
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
	if kind, _ := fixedSizeNumericKind(typ); kind != "" {
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
