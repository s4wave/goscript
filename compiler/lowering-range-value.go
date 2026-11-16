package compiler

import (
	"go/ast"
	"go/token"
	"go/types"
)

// rangeValueSharesElement reports whether the value variable of a range loop
// over a slice can share the struct or array element it holds instead of a
// copy. Go copies the element into the variable at the start of each
// iteration, and the copy is only observable when the variable or the
// element changes while the variable is live. So the variable can share the
// element when the body never changes the variable (see
// rangeValueBindingMayChange) and cannot change the element: it stores only
// into plain local variables, calls no functions, and does not suspend.
func rangeValueSharesElement(ctx lowerFileContext, stmt *ast.RangeStmt, rangeType types.Type) bool {
	// The loop declares a struct or array value variable and ranges over a
	// slice, whose elements only stores through the slice can change.
	if stmt.Tok != token.DEFINE || stmt.Body == nil || ctx.semPkg == nil || ctx.semPkg.source == nil {
		return false
	}
	if _, ok := types.Unalias(rangeType).Underlying().(*types.Slice); !ok {
		return false
	}
	obj := rangeBindingObject(ctx, stmt.Value)
	if obj == nil || ctx.model.needsVarRef[obj] || !isValueCopyType(obj.Type()) || typeParamMayHoldValueType(obj.Type()) {
		return false
	}

	// The body changes neither the variable nor any storage it may share.
	return !rangeValueBindingMayChange(ctx, obj, stmt.Body) && rangeBodyChangesOnlyLocals(ctx, stmt.Body)
}

// rangeCopiesArray reports whether a range loop over an array value reads a
// copy of it. Go evaluates the range expression once, so the loop reads the
// values the array held when it started, and the copy is observable only when
// the loop reads values and the array may change while it runs. A composite
// literal, which nothing else holds, a read-only array (see
// collectReadOnlyTables) and a loop that changes only locals (see
// rangeBodyChangesOnlyLocals) need no copy.
func rangeCopiesArray(ctx lowerFileContext, stmt *ast.RangeStmt, rangeType types.Type) bool {
	// The loop reads the values of an array.
	if _, ok := types.Unalias(rangeType).Underlying().(*types.Array); !ok || stmt.Body == nil {
		return false
	}
	if value, ok := stmt.Value.(*ast.Ident); stmt.Value == nil || ok && value.Name == "_" {
		return false
	}

	// The array may change while the loop runs.
	info := ctx.semPkg.source.TypesInfo
	switch operand := ast.Unparen(stmt.X).(type) {
	case *ast.CompositeLit:
		return false
	case *ast.Ident:
		if readOnlyTablesFor(ctx)[info.Uses[operand]] {
			return false
		}
	}
	return !rangeOverValues(info, stmt.Body, stmt) || !rangeBodyChangesOnlyLocals(ctx, stmt.Body)
}

// rangeBodyChangesOnlyLocals reports whether body changes no storage but
// local variables that hold no struct or array, which cannot share storage
// with a slice element. It must not call functions other than conversions
// and builtins that change nothing, since a call may change any storage, nor
// send, receive, select, defer, start goroutines or create function
// literals, since another goroutine may change storage while it waits.
func rangeBodyChangesOnlyLocals(ctx lowerFileContext, body *ast.BlockStmt) bool {
	// Each node that may change storage, call or suspend disqualifies body.
	info := ctx.semPkg.source.TypesInfo
	ok := true
	ast.Inspect(body, func(node ast.Node) bool {
		if !ok {
			return false
		}
		switch typed := node.(type) {
		case *ast.FuncLit, *ast.GoStmt, *ast.DeferStmt, *ast.SendStmt, *ast.SelectStmt:
			ok = false
		case *ast.UnaryExpr:
			ok = typed.Op != token.ARROW
		case *ast.CallExpr:
			ok = callChangesNothing(info, typed)
		case *ast.AssignStmt:
			ok = rangeBodyStoresLocally(info, body, typed.Lhs...)
		case *ast.IncDecStmt:
			ok = rangeBodyStoresLocally(info, body, typed.X)
		case *ast.RangeStmt:
			ok = rangeOverValues(info, body, typed)
		}
		return ok
	})
	return ok
}

// callChangesNothing reports whether call is a conversion, or a call of a
// builtin that neither changes storage nor suspends.
func callChangesNothing(info *types.Info, call *ast.CallExpr) bool {
	// A conversion makes a new value.
	tv, ok := info.Types[call.Fun]
	if !ok {
		return false
	}
	if tv.IsType() {
		return true
	}

	// Only builtins that read their arguments or make new values qualify.
	ident, ok := ast.Unparen(call.Fun).(*ast.Ident)
	if !ok || !tv.IsBuiltin() {
		return false
	}
	switch ident.Name {
	case "len", "cap", "min", "max", "complex", "real", "imag", "new", "make", "panic":
		return true
	}
	return false
}

// rangeBodyStoresLocally reports whether each of lhs is the blank
// identifier, a local variable that holds no struct or array or that the
// statement declares, or a field of a struct variable that body declares,
// which holds a value of its own.
func rangeBodyStoresLocally(info *types.Info, body *ast.BlockStmt, lhs ...ast.Expr) bool {
	for _, expr := range lhs {
		// Fields of a struct variable are stored to in its own value.
		ident, ok := ast.Unparen(expr).(*ast.Ident)
		if !ok {
			if !storesIntoBodyStruct(info, body, expr) {
				return false
			}
			continue
		}
		if ident.Name == "_" || info.Defs[ident] != nil {
			continue
		}

		// A local struct or array variable may be assigned in place, so only
		// other locals qualify.
		obj, ok := info.Uses[ident].(*types.Var)
		if !ok || obj.Pkg() == nil || obj.Parent() == nil || obj.Parent() == obj.Pkg().Scope() || isValueCopyType(obj.Type()) {
			return false
		}
	}
	return true
}

// storesIntoBodyStruct reports whether expr selects a field, through struct
// fields only, of a struct variable declared in body, which no slice
// element shares.
func storesIntoBodyStruct(info *types.Info, body *ast.BlockStmt, expr ast.Expr) bool {
	// Walk down the field selections, which must not go through pointers.
	for {
		selector, ok := ast.Unparen(expr).(*ast.SelectorExpr)
		if !ok {
			break
		}
		selection := info.Selections[selector]
		if selection == nil || selection.Kind() != types.FieldVal || selection.Indirect() {
			return false
		}
		expr = selector.X
	}

	// The root is a struct variable that body declares.
	ident, ok := ast.Unparen(expr).(*ast.Ident)
	if !ok {
		return false
	}
	obj, ok := info.Uses[ident].(*types.Var)
	return ok && isStructValueType(obj.Type()) && body.Pos() <= obj.Pos() && obj.Pos() < body.End()
}

// rangeOverValues reports whether a range loop nested in a range body reads
// its values without calls or suspension, and assigns only locals: it does
// not range over a channel or a function.
func rangeOverValues(info *types.Info, body *ast.BlockStmt, stmt *ast.RangeStmt) bool {
	// Channels suspend and functions are called.
	typ := info.TypeOf(stmt.X)
	if typ == nil {
		return false
	}
	switch types.Unalias(typ).Underlying().(type) {
	case *types.Chan, *types.Signature:
		return false
	}

	// Assigned key and value variables must be locals.
	if stmt.Tok != token.ASSIGN {
		return true
	}
	for _, expr := range []ast.Expr{stmt.Key, stmt.Value} {
		if expr != nil && !rangeBodyStoresLocally(info, body, expr) {
			return false
		}
	}
	return true
}
