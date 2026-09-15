package compiler

import (
	"go/ast"
	"go/types"
	"strings"
)

// lowerPromotedStructCompositeLit initializes promoted fields in source order.
// Go's type checker rejects ambiguous paths, overlapping initializers, and
// implicit pointer indirection through an embedded field.
func (o *LoweringOwner) lowerPromotedStructCompositeLit(
	ctx lowerFileContext,
	lit *ast.CompositeLit,
	markStruct bool,
) (string, []Diagnostic, bool) {
	// Retain the ordinary literal lowering unless a key reaches an embedding.
	typ := ctx.semPkg.source.TypesInfo.TypeOf(lit)
	if pointer, ok := types.Unalias(typ).Underlying().(*types.Pointer); ok {
		typ = pointer.Elem()
		markStruct = false
	}
	structure := structUnderlyingType(typ)
	if structure == nil {
		return "", nil, false
	}
	paths := make([][]int, len(lit.Elts))
	promoted := false
	for index, element := range lit.Elts {
		keyed, ok := element.(*ast.KeyValueExpr)
		if !ok {
			return "", nil, false
		}
		key, ok := keyed.Key.(*ast.Ident)
		if !ok {
			return "", nil, false
		}
		_, path, _ := types.LookupFieldOrMethod(structure, false, ctx.semPkg.source.Types, key.Name)
		paths[index] = path
		promoted = promoted || len(path) > 1
	}
	if !promoted {
		return "", nil, false
	}

	// Start with the complete zero value, preserving omitted direct fields.
	zero := o.lowerDeclarationZeroValueExpr(ctx, typ)
	if named := namedStructType(typ); named != nil {
		zero = o.lowerNamedStructZeroValueExpr(ctx, named)
	}
	result := ctx.tempName("StructLiteral")
	statements := []string{"const " + result + ": " + o.tsTypeFor(ctx, typ) + " = " + zero}
	initialized := make(map[string]bool)
	var diagnostics []Diagnostic
	for index, element := range lit.Elts {
		// Initialize each enclosing value once with its instantiated field zeros.
		var path strings.Builder
		path.WriteString(result)
		fieldType := typ
		for depth, fieldIndex := range paths[index] {
			field := structUnderlyingType(fieldType).Field(fieldIndex)
			fieldType = field.Type()
			path.WriteString("." + tsStructFieldName(field.Name(), fieldIndex))
			if depth < len(paths[index])-1 && !initialized[path.String()] {
				statements = append(statements, path.String()+" = "+o.lowerDeclarationZeroValueExpr(ctx, fieldType))
				initialized[path.String()] = true
			}
		}

		// Evaluate and copy the initializer before advancing to the next key.
		valueExpr := element.(*ast.KeyValueExpr).Value
		value, valueDiagnostics := o.lowerExpr(ctx, valueExpr)
		diagnostics = append(diagnostics, valueDiagnostics...)
		value = o.lowerValueForTarget(ctx, valueExpr, fieldType, value)
		statements = append(statements, path.String()+" = "+value)
	}

	// Preserve expression and await behavior at the original literal position.
	value := result
	if markStruct && namedStructType(typ) != nil {
		value = o.runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(" + value + ")"
	}
	statements = append(statements, "return "+value)
	body := strings.Join(statements, "; ")
	if strings.Contains(body, "await ") {
		return "(await (async () => { " + body + " })())", diagnostics, true
	}
	return "(() => { " + body + " })()", diagnostics, true
}
