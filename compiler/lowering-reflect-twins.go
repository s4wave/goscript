package compiler

import (
	"go/ast"
	"go/types"
	"strings"
)

// Lowering of reflection twins (see semantic-reflect-twins.go).
//
// The twin of a function is its body lowered again as an async function
// named with reflectTwinSuffix, in which the calls of the callback parameters
// await the values they return when those are promises, and the calls that
// pass a callback parameter on call and await the twin of their callee. A
// package function's twin is linked to the function by a property that
// reflect.Value.Call reads; a method's twin is a method of the same class,
// which reflection finds by its name.

// lowerReflectTwin returns the twin of decl, whose function lowered to fn,
// or nil when it has none.
func (o *LoweringOwner) lowerReflectTwin(ctx lowerFileContext, decl *ast.FuncDecl, fn *loweredFunction) *loweredFunction {
	// Only a function with a twin has one, and a twin has none.
	fnObj, _ := ctx.semPkg.source.TypesInfo.Defs[decl.Name].(*types.Func)
	if ctx.reflectTwin != nil || decl.Body == nil || ctx.model == nil || !ctx.model.reflectTwin(fnObj) {
		return nil
	}

	// The twin lowers the body again, which reports no diagnostics of its
	// own.
	twinCtx := ctx
	twinCtx.reflectTwin = ctx.model.reflectTwinParams(fnObj)
	twin, _ := o.lowerFuncDeclBody(twinCtx, decl)
	if twin == nil {
		return nil
	}

	// A package function is linked to its twin.
	if decl.Recv == nil {
		twin.attach = o.runtimeOwner.QualifiedHelper(RuntimeHelperSetReflectTwin) + "(" + fn.name + ", " + twin.name + ")"
	}
	return twin
}

// reflectTwinCallee returns the callee of call when the twin being lowered
// passes one of its callback parameters to it, which then calls the callee's
// twin, or nil.
func reflectTwinCallee(ctx lowerFileContext, call *ast.CallExpr) ast.Expr {
	// Only an argument of a twin can be a callback parameter.
	if ctx.reflectTwin == nil {
		return nil
	}

	// The semantic model makes every call that passes one a call of a twin.
	for _, arg := range call.Args {
		ident, ok := ast.Unparen(arg).(*ast.Ident)
		if ok && ctx.reflectTwin[objectForIdent(ctx, ident)] {
			return call.Fun
		}
	}
	return nil
}

// reflectTwinParamCall reports whether fun, the callee of a call in a twin,
// is one of the twin's callback parameters, whose calls may suspend.
func reflectTwinParamCall(ctx lowerFileContext, fun ast.Expr) bool {
	ident, ok := ast.Unparen(fun).(*ast.Ident)
	return ok && ctx.reflectTwin != nil && ctx.reflectTwin[objectForIdent(ctx, ident)]
}

// reflectTwinCallName returns name, the name that fun calls, as the name of
// its twin when the call being lowered calls the twin.
func reflectTwinCallName(ctx lowerFileContext, fun ast.Expr, name string) string {
	if ctx.twinCallee == nil || ctx.twinCallee != fun {
		return name
	}
	return name + reflectTwinSuffix
}

// reflectTwinMemberName returns the member name of a method's twin, the
// member that methodMemberName names, which is an identifier when the
// method's name is one.
func reflectTwinMemberName(name string) (string, bool) {
	base, ok := strings.CutSuffix(name, reflectTwinSuffix)
	return name, ok && safeIdentifier(base) == base
}
