package compiler

import (
	"go/ast"
	"go/token"
	"go/types"

	"golang.org/x/tools/go/packages"
)

// A read-only table is an unexported package variable of an array or slice
// type, or a local variable of an array type, whose elements no code ever
// changes: every use of it reads an element,
// its length or capacity, ranges over it or slices it, and every slice of it
// is used the same way or passed to a parameter of a function of the package
// that only reads it. Such a variable is never assigned and its address and
// the addresses of its elements are never taken, so reflect and unsafe never
// reach it either. Only its own package can name an unexported variable, as
// GoScript links no variables by go:linkname, so its syntax decides it in any
// build.
//
// A slice of a read-only table with constant bounds holds the same elements
// whenever it is taken, so one slice serves every evaluation (see
// lowerSliceExpr). Go code generated for lookups, such as the Unicode property
// tables of go-text, slices the same table on every call, and each slice of a
// byte array is a new typed array view.
//
// A range loop over a read-only array reads the array itself instead of the
// copy Go ranges over (see rangeCopiesArray), since nothing can change it.

// readOnlyTablesFor returns the read-only tables of ctx's package, collected
// once, on first use, from the package syntax.
func readOnlyTablesFor(ctx lowerFileContext) map[types.Object]bool {
	pkg := ctx.semPkg
	pkg.readOnlyTablesOnce.Do(func() {
		pkg.readOnlyTables = collectReadOnlyTables(pkg.source)
	})
	return pkg.readOnlyTables
}

// constantTableSlice reports whether expr slices a read-only table with
// constant bounds, so it gives the same slice whenever it is evaluated.
func constantTableSlice(ctx lowerFileContext, expr *ast.SliceExpr) bool {
	// The sliced operand names an unexported package variable.
	info := ctx.semPkg.source.TypesInfo
	ident, ok := ast.Unparen(expr.X).(*ast.Ident)
	if !ok {
		return false
	}
	v := packageLevelVar(info.Uses[ident])
	if v == nil || v.Exported() {
		return false
	}

	// Each bound present is a constant, and the variable is a read-only
	// table.
	for _, bound := range []ast.Expr{expr.Low, expr.High, expr.Max} {
		if bound != nil && info.Types[bound].Value == nil {
			return false
		}
	}
	return readOnlyTablesFor(ctx)[v]
}

// collectReadOnlyTables finds the read-only tables of pkg. A table or a
// parameter is read only when each of its uses reads it, given that the
// parameters it is passed to are read only; a use that does not read rules it
// out, and with it each table or parameter passed to it.
func collectReadOnlyTables(pkg *packages.Package) map[types.Object]bool {
	// The tables and the slice parameters are tracked.
	tables := tableCandidates(pkg)
	params := sliceParams(pkg)
	user := tableUser{info: pkg.TypesInfo, params: params}
	tracked := make(map[types.Object]bool, len(tables))
	for _, v := range tables {
		tracked[v] = true
	}
	for _, fnParams := range params {
		for _, param := range fnParams {
			if param != nil {
				tracked[param] = true
			}
		}
	}

	// Each use of a tracked object either rules it out or depends on the
	// parameters it is passed to.
	ruledOut := make(map[types.Object]bool)
	dependents := make(map[types.Object][]types.Object)
	for _, file := range pkg.Syntax {
		walkWithStack(file, func(stack []ast.Node) {
			// Only a use of a tracked object is judged.
			ident, ok := stack[len(stack)-1].(*ast.Ident)
			obj := pkg.TypesInfo.Uses[ident]
			if !ok || !tracked[obj] {
				return
			}
			deps, reads := user.storage(stack, len(stack)-1)
			if !reads {
				ruledOut[obj] = true
			}
			for _, dep := range deps {
				dependents[dep] = append(dependents[dep], obj)
			}
		})
	}

	// A parameter ruled out rules out what is passed to it.
	queue := make([]types.Object, 0, len(ruledOut))
	for obj := range ruledOut {
		queue = append(queue, obj)
	}
	for len(queue) != 0 {
		obj := queue[len(queue)-1]
		queue = queue[:len(queue)-1]
		for _, dependent := range dependents[obj] {
			if !ruledOut[dependent] {
				ruledOut[dependent] = true
				queue = append(queue, dependent)
			}
		}
	}

	// The tables left are read only.
	readOnly := make(map[types.Object]bool)
	for _, v := range tables {
		if !ruledOut[v] {
			readOnly[v] = true
		}
	}
	return readOnly
}

// tableCandidates returns the unexported package variables of pkg of array
// or slice types, and its local variables of array types.
func tableCandidates(pkg *packages.Package) []*types.Var {
	scope := pkg.Types.Scope()
	var tables []*types.Var
	for _, name := range scope.Names() {
		// Only arrays and slices hold elements a slice can share.
		v, ok := scope.Lookup(name).(*types.Var)
		if !ok || v.Exported() {
			continue
		}
		switch types.Unalias(v.Type()).Underlying().(type) {
		case *types.Array, *types.Slice:
			tables = append(tables, v)
		}
	}

	// A local array holds its own elements; a local slice shares them.
	for _, obj := range pkg.TypesInfo.Defs {
		v, ok := obj.(*types.Var)
		if !ok || v.IsField() || v.Parent() == nil || v.Parent() == scope {
			continue
		}
		if _, ok := types.Unalias(v.Type()).Underlying().(*types.Array); ok {
			tables = append(tables, v)
		}
	}
	return tables
}

// sliceParams returns the parameters of the plain functions of pkg, by
// function, with nil for each parameter not of a slice type. A method or a
// generic function is left out, and so its arguments do not read.
func sliceParams(pkg *packages.Package) map[*types.Func][]types.Object {
	params := make(map[*types.Func][]types.Object)
	for _, file := range pkg.Syntax {
		for _, decl := range file.Decls {
			// Only a plain function with a body is known.
			fnDecl, ok := decl.(*ast.FuncDecl)
			if !ok || fnDecl.Recv != nil || fnDecl.Type.TypeParams != nil || fnDecl.Body == nil {
				continue
			}
			fn, _ := pkg.TypesInfo.Defs[fnDecl.Name].(*types.Func)
			if fn == nil {
				continue
			}

			// Each slice parameter is tracked.
			signature := fn.Type().(*types.Signature)
			fnParams := make([]types.Object, signature.Params().Len())
			for idx := range fnParams {
				param := signature.Params().At(idx)
				if _, ok := types.Unalias(param.Type()).Underlying().(*types.Slice); ok && param.Name() != "_" {
					fnParams[idx] = param
				}
			}
			params[fn] = fnParams
		}
	}
	return params
}

// walkWithStack calls visit for each node under root with the path from root
// to the node, the node last.
func walkWithStack(root ast.Node, visit func(stack []ast.Node)) {
	var stack []ast.Node
	ast.Inspect(root, func(node ast.Node) bool {
		if node == nil {
			stack = stack[:len(stack)-1]
			return true
		}
		stack = append(stack, node)
		visit(stack)
		return true
	})
}

// tableUser judges the uses of the storage of tables.
type tableUser struct {
	info   *types.Info
	params map[*types.Func][]types.Object
}

// parent returns the index in stack of the node that uses stack[idx], past
// any parentheses.
func (u tableUser) parent(stack []ast.Node, idx int) int {
	parent := idx - 1
	for parent >= 0 {
		if _, ok := stack[parent].(*ast.ParenExpr); !ok {
			break
		}
		parent--
	}
	return parent
}

// storage judges the use of stack[idx], a table or a slice of one: it reports
// whether the use only reads the elements, given that the returned
// parameters it is passed to only read them.
func (u tableUser) storage(stack []ast.Node, idx int) ([]types.Object, bool) {
	// The storage is used by its parent.
	parentIdx := u.parent(stack, idx)
	if parentIdx < 0 {
		return nil, false
	}
	node := stack[idx]

	// An element read, a slice used the same way, a range or an argument
	// reads.
	switch parent := stack[parentIdx].(type) {
	case *ast.IndexExpr:
		return nil, ast.Unparen(parent.X) == node && u.element(stack, parentIdx)
	case *ast.SliceExpr:
		if ast.Unparen(parent.X) == node {
			return u.storage(stack, parentIdx)
		}
	case *ast.RangeStmt:
		return nil, ast.Unparen(parent.X) == node
	case *ast.CallExpr:
		return u.argument(parent, node)
	}
	return nil, false
}

// element reports whether stack[idx], an element of a table, is used as a
// value: not changed, addressed, or used to reach a part of the element.
func (u tableUser) element(stack []ast.Node, idx int) bool {
	// The element is used by its parent.
	parentIdx := u.parent(stack, idx)
	if parentIdx < 0 {
		return false
	}
	node := stack[idx]

	// Assigning, incrementing or addressing the element, ranging into it,
	// selecting from it, and indexing or slicing it, which can address a part
	// of it, do not read only.
	switch parent := stack[parentIdx].(type) {
	case *ast.AssignStmt:
		return !exprListHas(parent.Lhs, node)
	case *ast.IncDecStmt, *ast.SelectorExpr:
		return false
	case *ast.UnaryExpr:
		return parent.Op != token.AND
	case *ast.RangeStmt:
		return false
	case *ast.IndexExpr:
		return ast.Unparen(parent.X) != node
	case *ast.SliceExpr:
		return ast.Unparen(parent.X) != node
	}
	return true
}

// argument judges node, a table or a slice of one, as an argument of call:
// the length or capacity, the source of a copy or append, a conversion to a
// string, or a parameter of a function of the package that is not variadic.
func (u tableUser) argument(call *ast.CallExpr, node ast.Node) ([]types.Object, bool) {
	// The argument's position decides.
	argIdx := -1
	for idx, arg := range call.Args {
		if ast.Unparen(arg) == node {
			argIdx = idx
		}
	}
	if argIdx < 0 {
		return nil, false
	}

	// A builtin reads its operand or its source.
	if builtin, ok := calledObject(u.info, call.Fun).(*types.Builtin); ok {
		switch builtin.Name() {
		case "len", "cap":
			return nil, true
		case "copy":
			return nil, argIdx == 1
		case "append":
			return nil, argIdx == 1 && call.Ellipsis.IsValid()
		}
		return nil, false
	}

	// A conversion to a string copies the elements.
	if tv := u.info.Types[call.Fun]; tv.IsType() {
		return nil, isStringType(tv.Type)
	}

	// A function reads when its parameter does.
	fn, _ := calledObject(u.info, call.Fun).(*types.Func)
	fnParams := u.params[fn]
	if argIdx >= len(fnParams) || fnParams[argIdx] == nil || call.Ellipsis.IsValid() ||
		(fn.Type().(*types.Signature).Variadic() && argIdx == len(fnParams)-1) {
		return nil, false
	}
	return []types.Object{fnParams[argIdx]}, true
}

// exprListHas reports whether node is one of exprs, past parentheses.
func exprListHas(exprs []ast.Expr, node ast.Node) bool {
	for _, expr := range exprs {
		if ast.Unparen(expr) == node {
			return true
		}
	}
	return false
}
