package compiler

import (
	"go/ast"
	"go/token"
	"go/types"
)

// stableCompoundTarget prepares the target of a compound assignment or of an
// increment that lowers as target = target op value. Go evaluates the
// operands of the target once, but the lowered statement reads the target
// twice, so each operand with side effects (a call or a receive) is evaluated
// into a temporary first. It returns the statements that evaluate them and
// the context in which the target lowers to read the temporaries.
func (o *LoweringOwner) stableCompoundTarget(ctx lowerFileContext, target ast.Expr) (lowerFileContext, []loweredStmt, []Diagnostic) {
	// A target without side effects lowers as it is.
	if !exprHasSideEffects(ctx, target) {
		return ctx, nil, nil
	}

	// The operands lower into temporaries that the target reads, keeping
	// the temporaries of enclosing statements.
	temps := inheritedExprTemps(ctx, 2)
	var stmts []loweredStmt
	unstable := func(expr ast.Expr) bool { return exprHasSideEffects(ctx, expr) }
	diagnostics := o.stabilizeTargetOperands(ctx, target, unstable, temps, &stmts)
	ctx.exprTemps = temps
	return ctx, stmts, diagnostics
}

// inheritedExprTemps returns a copy of the temporaries of ctx, with room for
// extra more, for a statement that adds its own to those of the statements
// that enclose it.
func inheritedExprTemps(ctx lowerFileContext, extra int) map[ast.Expr]string {
	temps := make(map[ast.Expr]string, len(ctx.exprTemps)+extra)
	for expr, temp := range ctx.exprTemps {
		temps[expr] = temp
	}
	return temps
}

// stableTupleTargets prepares the targets of a tuple assignment. Go
// evaluates the index and pointer operands of every target and then the
// right-hand side before it assigns any target, but the lowered statements
// assign the targets one at a time after evaluating the right-hand side. So
// each operand that calls or receives, or that an earlier target's
// assignment may change, is evaluated into a temporary first. It returns the
// statements that evaluate them and the context in which the targets lower
// to read the temporaries.
func (o *LoweringOwner) stableTupleTargets(ctx lowerFileContext, lhs []ast.Expr) (lowerFileContext, []loweredStmt, []Diagnostic) {
	// Each target's operands are judged against the targets before it: the
	// variables they assign, and whether any stores into other storage.
	assigned := make(map[types.Object]bool, len(lhs))
	stores := false
	unstable := func(expr ast.Expr) bool { return tupleOperandMayChange(ctx, expr, assigned, stores) }

	// The operands lower into temporaries in target order, before the
	// right-hand side.
	temps := inheritedExprTemps(ctx, len(lhs))
	var stmts []loweredStmt
	var diagnostics []Diagnostic
	for _, target := range lhs {
		diagnostics = append(diagnostics, o.stabilizeTargetOperands(ctx, target, unstable, temps, &stmts)...)
		if ident, ok := unwrapParenExpr(target).(*ast.Ident); ok {
			// A variable that a pointer reaches is storage too.
			obj := ctx.semPkg.source.TypesInfo.ObjectOf(ident)
			if obj != nil {
				assigned[obj] = true
			}
			stores = stores || obj != nil && ctx.model.needsVarRef[obj]
			continue
		}
		stores = true
	}
	ctx.exprTemps = temps
	return ctx, stmts, diagnostics
}

// tupleOperandMayChange reports whether the target operand expr of a tuple
// assignment calls or receives, or reads a variable in assigned or, when
// stores is set, any storage that a store may change: an element, a field,
// a dereference or a variable that a pointer reaches.
func tupleOperandMayChange(ctx lowerFileContext, expr ast.Expr, assigned map[types.Object]bool, stores bool) bool {
	// A constant never changes.
	info := ctx.semPkg.source.TypesInfo
	if info.Types[unwrapParenExpr(expr)].Value != nil {
		return false
	}

	// Any part of expr that calls, receives or reads changed storage
	// changes it.
	changes := false
	ast.Inspect(expr, func(node ast.Node) bool {
		switch typed := node.(type) {
		case *ast.FuncLit:
			return false
		case *ast.CallExpr:
			changes = !info.Types[unwrapParenExpr(typed.Fun)].IsType()
		case *ast.UnaryExpr:
			changes = typed.Op == token.ARROW
		case *ast.IndexExpr, *ast.StarExpr:
			changes = stores
		case *ast.SelectorExpr:
			// A package qualifier selects no storage.
			changes = stores && info.Selections[typed] != nil
		case *ast.Ident:
			obj := info.Uses[typed]
			changes = obj != nil && (assigned[obj] || stores && ctx.model.needsVarRef[obj])
		}
		return !changes
	})
	return changes
}

// stabilizeTargetOperands evaluates the operands of the addressable
// expression target that are unstable into temporaries, in the order Go
// evaluates them, recording each in temps.
func (o *LoweringOwner) stabilizeTargetOperands(
	ctx lowerFileContext,
	target ast.Expr,
	unstable func(ast.Expr) bool,
	temps map[ast.Expr]string,
	stmts *[]loweredStmt,
) []Diagnostic {
	switch typed := unwrapParenExpr(target).(type) {
	case *ast.IndexExpr:
		// An array value is part of its own storage, whose operands are
		// stabilized in turn; a slice, map or array pointer is a value.
		diagnostics := o.stabilizeTargetBase(ctx, typed.X, unstable, temps, stmts)
		return append(diagnostics, o.stabilizeTargetOperand(ctx, typed.Index, unstable, temps, stmts)...)
	case *ast.SelectorExpr:
		// A field of a struct value is part of its storage; a field through
		// a pointer is read through the pointer value.
		if selection := ctx.semPkg.source.TypesInfo.Selections[typed]; selection == nil || selection.Kind() != types.FieldVal {
			return nil
		}
		return o.stabilizeTargetBase(ctx, typed.X, unstable, temps, stmts)
	case *ast.StarExpr:
		// A dereference of an address is the addressed storage; any other
		// dereference reads the pointer once.
		if addr, ok := unwrapParenExpr(typed.X).(*ast.UnaryExpr); ok && addr.Op == token.AND {
			return o.stabilizeTargetOperands(ctx, addr.X, unstable, temps, stmts)
		}
		return o.stabilizeTargetOperand(ctx, typed.X, unstable, temps, stmts)
	default:
		return nil
	}
}

// stabilizeTargetBase stabilizes the base expression of an index or field
// target: a value of array or struct type is storage whose own operands are
// stabilized, any other base (a slice, map or pointer) is evaluated once.
func (o *LoweringOwner) stabilizeTargetBase(
	ctx lowerFileContext,
	base ast.Expr,
	unstable func(ast.Expr) bool,
	temps map[ast.Expr]string,
	stmts *[]loweredStmt,
) []Diagnostic {
	baseType := ctx.semPkg.source.TypesInfo.TypeOf(base)
	if baseType != nil {
		switch types.Unalias(baseType).Underlying().(type) {
		case *types.Array, *types.Struct:
			return o.stabilizeTargetOperands(ctx, base, unstable, temps, stmts)
		}
	}
	return o.stabilizeTargetOperand(ctx, base, unstable, temps, stmts)
}

// stabilizeTargetOperand evaluates the operand expr into a temporary when it
// is unstable.
func (o *LoweringOwner) stabilizeTargetOperand(
	ctx lowerFileContext,
	expr ast.Expr,
	unstable func(ast.Expr) bool,
	temps map[ast.Expr]string,
	stmts *[]loweredStmt,
) []Diagnostic {
	// A stable operand can be evaluated again in place.
	if !unstable(expr) {
		return nil
	}

	// Other operands are evaluated once, before the assignment.
	value, diagnostics := o.lowerExpr(ctx, expr)
	temp := ctx.tempName("Operand")
	*stmts = append(*stmts, loweredStmt{text: "const " + temp + " = " + value})
	temps[unwrapParenExpr(expr)] = temp
	return diagnostics
}

// exprHasSideEffects reports whether evaluating expr may call a function or
// receive from a channel. Conversions are not calls, and function literals
// are not evaluated by their expression.
func exprHasSideEffects(ctx lowerFileContext, expr ast.Expr) bool {
	found := false
	ast.Inspect(expr, func(node ast.Node) bool {
		if found {
			return false
		}
		switch typed := node.(type) {
		case *ast.FuncLit:
			return false
		case *ast.CallExpr:
			found = !ctx.semPkg.source.TypesInfo.Types[unwrapParenExpr(typed.Fun)].IsType()
		case *ast.UnaryExpr:
			found = typed.Op == token.ARROW
		}
		return !found
	})
	return found
}

// isMapIndexExpr reports whether expr indexes a map.
func isMapIndexExpr(ctx lowerFileContext, expr ast.Expr) bool {
	index, ok := unwrapParenExpr(expr).(*ast.IndexExpr)
	return ok && isMapType(ctx.semPkg.source.TypesInfo.TypeOf(index.X))
}
