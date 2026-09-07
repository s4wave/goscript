package compiler

import (
	"go/ast"
	"go/token"
	"go/types"
	"strings"
)

// lowerByteCopyRanges fuses byte-slice operands whose evaluation cannot suspend,
// mutate state, or panic before the runtime validates each slice in order.
func (o *LoweringOwner) lowerByteCopyRanges(ctx lowerFileContext, expr *ast.CallExpr) (string, []Diagnostic, bool) {
	if len(expr.Args) != 2 {
		return "", nil, false
	}

	// Keep effectful operands in ordinary lowering so their slice checks remain
	// interleaved with subsequent operand evaluation.
	var ranges [2]*ast.SliceExpr
	for index, arg := range expr.Args {
		slice, ok := unwrapParenExpr(arg).(*ast.SliceExpr)
		if !ok || slice.Slice3 || !isByteSliceType(ctx.semPkg.source.TypesInfo.TypeOf(slice.X)) ||
			!copyRangeValueIsInert(ctx, slice.X) ||
			!copyRangeValueIsInert(ctx, slice.Low) ||
			!copyRangeValueIsInert(ctx, slice.High) {
			return "", nil, false
		}
		ranges[index] = slice
	}

	// Pass the original slices and bounds directly, avoiding temporary views.
	var args []string
	var diagnostics []Diagnostic
	for _, slice := range ranges {
		target, targetDiagnostics := o.lowerExpr(ctx, slice.X)
		low, lowDiagnostics := o.lowerOptionalExpr(ctx, slice.Low)
		high, highDiagnostics := o.lowerOptionalExpr(ctx, slice.High)
		args = append(args, target,
			o.lowerNumberIndexValue(ctx, slice.Low, low),
			o.lowerNumberIndexValue(ctx, slice.High, high))
		diagnostics = append(diagnostics, targetDiagnostics...)
		diagnostics = append(diagnostics, lowDiagnostics...)
		diagnostics = append(diagnostics, highDiagnostics...)
	}
	return o.runtimeOwner.QualifiedHelper(RuntimeHelperCopyByteRanges) +
		"(" + strings.Join(args, ", ") + ")", diagnostics, true
}

// copyRangeValueIsInert excludes operations that could expose a postponed slice
// panic, including lazy package variable reads, calls, indexing, and division.
func copyRangeValueIsInert(ctx lowerFileContext, expr ast.Expr) bool {
	if expr == nil {
		return true
	}
	if value, ok := ctx.semPkg.source.TypesInfo.Types[expr]; ok && value.Value != nil {
		return true
	}
	switch expr := unwrapParenExpr(expr).(type) {
	case *ast.Ident:
		variable, ok := ctx.semPkg.source.TypesInfo.Uses[expr].(*types.Var)
		return ok && (variable.Pkg() == nil || variable.Parent() != variable.Pkg().Scope())
	case *ast.UnaryExpr:
		switch expr.Op {
		case token.ADD, token.SUB, token.XOR:
			return copyRangeValueIsInert(ctx, expr.X)
		}
	case *ast.BinaryExpr:
		switch expr.Op {
		case token.ADD, token.SUB, token.MUL, token.AND, token.OR, token.XOR, token.AND_NOT:
			return copyRangeValueIsInert(ctx, expr.X) && copyRangeValueIsInert(ctx, expr.Y)
		}
	}
	return false
}
