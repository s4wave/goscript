package compiler

import (
	"go/ast"
	"go/token"
	"go/types"
	"strconv"
	"strings"
)

// narrowShiftType reports whether integers of the type, of 32 bits or fewer,
// shift with the JavaScript shift operators, and whether it is signed.
func narrowShiftType(typ types.Type) (signed bool, ok bool) {
	if bits, ok := unsignedIntegerBits(typ); ok && bits <= 32 {
		return false, true
	}
	if bits, ok := signedIntegerBits(typ); ok && bits <= 32 {
		return true, true
	}
	return false, false
}

// lowerNarrowShiftExpr returns the shift left op right of an integer of 32
// bits or fewer, whose count may be 32 or more, or false for other shifts
// and for constant counts below 32, which shift as the JavaScript operators
// do. Go shifts all bits out of the value for a count of 32 or more (a right
// shift fills a signed value with its sign bit), while the JavaScript
// operators take the count modulo 32. Unsigned right shifts call uintShr,
// which handles such counts.
func (o *LoweringOwner) lowerNarrowShiftExpr(ctx lowerFileContext, expr *ast.BinaryExpr, left string, right string) (string, bool) {
	// Only shifts of narrow integers by counts that may be 32 or more change.
	typ := ctx.semPkg.source.TypesInfo.TypeOf(expr)
	signed, ok := narrowShiftType(typ)
	if !ok || expr.Op != token.SHL && (expr.Op != token.SHR || !signed) {
		return "", false
	}
	amount, constantAmount := constantShiftAmount(ctx, expr.Y)
	if constantAmount && amount < 32 || isMaskedBelow32(ctx, expr.Y) {
		return "", false
	}

	// A constant count of 32 or more has a constant result for a left shift
	// and the sign of the value for a right shift.
	if constantAmount {
		if expr.Op == token.SHL {
			return "0", true
		}
		return "(" + left + " >> 31)", true
	}

	// A count with side effects is evaluated once, by a helper.
	if exprHasSideEffects(ctx, expr.Y) {
		helper := RuntimeHelperNarrowShr
		if expr.Op == token.SHL {
			helper = RuntimeHelperNarrowShl
		}
		call := o.runtimeOwner.QualifiedHelper(helper) + "(" + left + ", " + right + ")"
		if wrapped, ok := wrapNarrowIntegerValue(typ, call, expr.Op); ok {
			return wrapped, true
		}
		return call, true
	}

	// Other counts are compared to 32 around the operator.
	if expr.Op == token.SHR {
		return "(" + left + " >> (" + right + " < 32 ? " + right + " : 31))", true
	}
	shifted := "(" + left + " << " + right + ")"
	if wrapped, ok := wrapNarrowIntegerValue(typ, left+" << "+right, expr.Op); ok {
		shifted = wrapped
	}
	return "(" + right + " < 32 ? " + shifted + " : 0)", true
}

// isMaskedBelow32 reports whether expr is an & with a constant below 32,
// such as the count r&0x1f of a bit in a word, or a remainder by a constant
// of at most 32, such as bit%8, which are below 32 (a negative remainder
// is an invalid count, which Go panics on, as before).
func isMaskedBelow32(ctx lowerFileContext, expr ast.Expr) bool {
	binary, ok := unwrapParenExpr(expr).(*ast.BinaryExpr)
	if !ok {
		return false
	}
	switch binary.Op {
	case token.AND:
		for _, operand := range []ast.Expr{binary.X, binary.Y} {
			if amount, ok := constantShiftAmount(ctx, operand); ok && amount < 32 {
				return true
			}
		}
	case token.REM:
		amount, ok := constantShiftAmount(ctx, binary.Y)
		return ok && amount > 0 && amount <= 32
	}
	return false
}

// lowerNarrowShiftAssignValue returns the value that left op= right assigns
// to left for a shift of an integer of 32 bits or fewer, whose count may be
// 32 or more (see [LoweringOwner.lowerNarrowShiftExpr]), with wrap wrapping
// a value to the width of the target, or false for other assignments and
// for constant counts below 32. The count is evaluated once, by a helper.
func lowerNarrowShiftAssignValue(
	runtimeOwner *RuntimeContractOwner,
	targetType types.Type,
	left string,
	right string,
	tok token.Token,
	wrap func(string) string,
) (string, bool) {
	// Only shifts of narrow integers by counts that may be 32 or more change.
	signed, ok := narrowShiftType(targetType)
	if !ok || tok != token.SHL_ASSIGN && tok != token.SHR_ASSIGN {
		return "", false
	}
	if amount, err := strconv.Atoi(strings.Trim(right, "()")); err == nil && amount >= 0 && amount < 32 {
		return "", false
	}

	// Each shift has its helper.
	switch {
	case tok == token.SHL_ASSIGN:
		return wrap(runtimeOwner.QualifiedHelper(RuntimeHelperNarrowShl) + "(" + left + ", " + right + ")"), true
	case signed:
		return runtimeOwner.QualifiedHelper(RuntimeHelperNarrowShr) + "(" + left + ", " + right + ")", true
	}
	bits, _ := unsignedIntegerBits(targetType)
	return runtimeOwner.QualifiedHelper(RuntimeHelperUintShr) + "(" + left + ", " + right + ", " + strconv.Itoa(bits) + ")", true
}
