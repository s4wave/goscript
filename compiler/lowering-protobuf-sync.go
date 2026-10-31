package compiler

import (
	"go/ast"
	"go/types"
	"strings"
)

// Generated protobuf methods that a TypeScript binding can replace, such as
// String, CloneVT and MarshalVT, stay synchronous where the coloring would
// make them async only through open interfaces: a protobuf-go-lite body calls
// the same methods of its fields and oneofs, and those calls stay synchronous
// in it. A body that calls a function or override that does suspend, as
// google.golang.org/protobuf's String does through prototext, keeps the
// coloring instead, so its declaration and its callers agree with its awaits.

// findProtobufAsyncMethods records in o.protobufAsync the generated protobuf
// methods whose body suspends. It runs before packages lower in parallel and
// leaves the map read-only for them.
//
// Every method starts synchronous. A pass marks a method async when a call in
// its body needs an await in a synchronous generated method, which can depend
// on methods marked in the same pass, so passes repeat until none marks
// another. Marks only add, so the passes end.
func (o *LoweringOwner) findProtobufAsyncMethods(model *SemanticModel, asyncLazy *asyncLazyCache) {
	// Start from every method synchronous.
	o.protobufAsync = make(map[*types.Func]bool)

	// List the replaceable methods declared in generated protobuf files.
	type generatedMethod struct {
		fn   *types.Func
		decl *ast.FuncDecl
		ctx  lowerFileContext
	}
	var methods []generatedMethod
	for _, semPkg := range model.packages {
		if semPkg.source == nil {
			continue
		}
		ctx := lowerFileContext{
			model:                         model,
			semPkg:                        semPkg,
			lazyPackageVars:               semPkg.lazyVars,
			asyncLazy:                     newAsyncLazyState(asyncLazy),
			protobufGeneratedSyncFunction: true,
		}
		for fn, decl := range semPkg.functionDecls {
			if decl.Body != nil && protobufGeneratedMethodDecl(semPkg, decl) {
				methods = append(methods, generatedMethod{fn: fn, decl: decl, ctx: ctx})
			}
		}
	}

	// Mark the methods whose body suspends until a pass marks none.
	for marked := true; marked; {
		marked = false
		for _, method := range methods {
			if !o.protobufAsync[method.fn] && o.bodyCallNeedsAwait(method.ctx, method.decl.Body) {
				o.protobufAsync[method.fn] = true
				marked = true
			}
		}
	}
}

// bodyCallNeedsAwait reports whether a call in body, outside its function
// literals, needs an await in ctx.
func (o *LoweringOwner) bodyCallNeedsAwait(ctx lowerFileContext, body *ast.BlockStmt) bool {
	found := false
	ast.Inspect(body, func(node ast.Node) bool {
		if found {
			return false
		}
		switch node := node.(type) {
		case *ast.FuncLit:
			return false
		case *ast.CallExpr:
			found = o.callExprNeedsAwait(ctx, node)
		}
		return !found
	})
	return found
}

// protobufGeneratedSyncMethod reports whether fn is a generated protobuf
// method that stays synchronous.
func (o *LoweringOwner) protobufGeneratedSyncMethod(ctx lowerFileContext, fn *types.Func) bool {
	if fn == nil || fn.Pkg() == nil || ctx.model == nil || o.protobufAsync[fn] {
		return false
	}
	semPkg := ctx.model.packages[fn.Pkg().Path()]
	decl := functionDeclForObject(semPkg, fn)
	return decl != nil && protobufGeneratedMethodDecl(semPkg, decl)
}

// protobufGeneratedMethodDecl reports whether decl, in semPkg, declares a
// method a protobuf TypeScript binding replaces in a generated .pb.go file.
func protobufGeneratedMethodDecl(semPkg *semanticPackage, decl *ast.FuncDecl) bool {
	if semPkg == nil || semPkg.source == nil || !protobufTypeScriptBindingReplacesMethodName(decl.Name.Name) {
		return false
	}
	return strings.HasSuffix(sourcePos(semPkg.source, decl.Pos()).file, ".pb.go")
}
