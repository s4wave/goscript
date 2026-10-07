package compiler

import (
	"context"
	"go/ast"
	"go/token"
	"go/types"
	"slices"

	"golang.org/x/tools/go/packages"
)

// asyncArgumentCallSite is a call that passes function arguments to a callee
// with a body. The callee becomes async when the call always suspends or when
// any function in deps becomes async.
type asyncArgumentCallSite struct {
	semFn    *semanticFunction
	suspends bool
	deps     []*types.Func
}

// interfaceAsyncEdges lists the distinct interface methods that each
// implementation colors. An interface method waits on its implementations and
// becomes async when any of them does.
type interfaceAsyncEdges map[*semanticFunction][]*types.Func

// add records that ifaceMethod waits on implFn, once.
func (e interfaceAsyncEdges) add(implFn *semanticFunction, ifaceMethod *types.Func) {
	if !slices.Contains(e[implFn], ifaceMethod) {
		e[implFn] = append(e[implFn], ifaceMethod)
	}
}

// asyncArgumentCall is a call in one package that passes function arguments
// whose async marks can make the callee async.
type asyncArgumentCall struct {
	called   *types.Func
	suspends bool
	deps     []*types.Func
}

// collectAsyncArgumentCalls finds the calls in pkg whose function arguments
// can make the callee async.
func collectAsyncArgumentCalls(pkg *packages.Package) []asyncArgumentCall {
	var calls []asyncArgumentCall
	for _, file := range pkg.Syntax {
		ast.Inspect(file, func(node ast.Node) bool {
			expr, ok := node.(*ast.CallExpr)
			if !ok {
				return true
			}
			called := calledFunction(pkg, expr.Fun)
			if called == nil {
				return true
			}
			signature, _ := called.Type().(*types.Signature)
			suspends, deps := asyncArgumentFacts(pkg, signature, expr.Args)
			if suspends || len(deps) != 0 {
				calls = append(calls, asyncArgumentCall{called: called, suspends: suspends, deps: deps})
			}
			return true
		})
	}
	return calls
}

// asyncArgumentCallSites resolves every package's async argument calls to the
// callees with a body.
func asyncArgumentCallSites(model *SemanticModel) []asyncArgumentCallSite {
	var sites []asyncArgumentCallSite
	for _, semPkg := range model.packages {
		for _, call := range semPkg.asyncArgumentCalls {
			semFn := semanticFunctionFor(model, call.called)
			if semFn == nil || !semFn.hasBody {
				continue
			}
			sites = append(sites, asyncArgumentCallSite{
				semFn:    semFn,
				suspends: call.suspends,
				deps:     call.deps,
			})
		}
	}
	return sites
}

// asyncArgumentFacts inspects the arguments passed to function-typed
// parameters. It reports whether one always suspends, and otherwise the
// functions whose async marks decide whether one needs an await. The rules
// match exprMayNeedAwait.
//
// Deps are function origins. Coloring resolves a generic instance and its
// origin to the same semantic function and full name, and an origin is a
// declared object a body summary can name.
func asyncArgumentFacts(pkg *packages.Package, signature *types.Signature, args []ast.Expr) (bool, []*types.Func) {
	if signature == nil || signature.Params() == nil {
		return false, nil
	}
	params := signature.Params()
	var deps []*types.Func
	for idx, arg := range args {
		paramIdx := idx
		if signature.Variadic() && idx >= params.Len()-1 {
			paramIdx = params.Len() - 1
		}
		if paramIdx < 0 || paramIdx >= params.Len() || signatureForType(params.At(paramIdx).Type()) == nil {
			continue
		}
		if called := calledFunction(pkg, arg); called != nil {
			deps = append(deps, functionOriginOrSelf(called))
			continue
		}
		lit, ok := arg.(*ast.FuncLit)
		if !ok {
			continue
		}
		suspends := false
		ast.Inspect(lit.Body, func(node ast.Node) bool {
			switch typed := node.(type) {
			case *ast.FuncLit:
				return false
			case *ast.SendStmt, *ast.SelectStmt:
				suspends = true
			case *ast.UnaryExpr:
				suspends = typed.Op == token.ARROW
			case *ast.CallExpr:
				if callUsesFunctionValue(pkg, typed.Fun) || callUsesFunctionIdentifier(pkg, typed.Fun) {
					suspends = true
				} else if called := calledFunction(pkg, typed.Fun); called != nil {
					deps = append(deps, functionOriginOrSelf(called))
				}
			}
			return !suspends
		})
		if suspends {
			return true, nil
		}
	}
	return false, deps
}

// asyncColoring propagates async marks to their fixpoint with one worklist.
//
// Every rule only adds marks, so each function key is visited once, when it
// first reports async through SemanticModel.functionAsync. Visiting a key marks
// its callers, the anonymous interface methods it implements, and the callees
// of the argument sites that pass it. The reverse indexes route a new mark to
// every key that it makes async.
type asyncColoring struct {
	model *SemanticModel
	// keysBySemFn lists the keys that resolve to each semantic function.
	keysBySemFn map[*semanticFunction][]*types.Func
	// keysByFullName lists the named-receiver interface method keys by full
	// name, which SemanticModel.interfaceMethodAsync also consults.
	keysByFullName    map[string][]*types.Func
	registered        map[*types.Func]bool
	ifaceEdges        interfaceAsyncEdges
	anonMethodsByImpl map[*types.Func][]*types.Func
	sitesByDep        map[*types.Func][]*semanticFunction
	visited           map[*types.Func]bool
	queue             []*types.Func
}

// colorAsyncFunctions marks every function and interface method that can
// suspend, starting from the facts collected per package.
func colorAsyncFunctions(
	ctx context.Context,
	model *SemanticModel,
	sites []asyncArgumentCallSite,
	ifaceEdges interfaceAsyncEdges,
	anonymousInterfaceGraph []semanticAnonymousInterfaceImplementation,
) []Diagnostic {
	if err := ctx.Err(); err != nil {
		return []Diagnostic{contextCanceledDiagnostic(err)}
	}
	c := &asyncColoring{
		model:             model,
		keysBySemFn:       make(map[*semanticFunction][]*types.Func),
		keysByFullName:    make(map[string][]*types.Func),
		registered:        make(map[*types.Func]bool),
		ifaceEdges:        ifaceEdges,
		anonMethodsByImpl: make(map[*types.Func][]*types.Func),
		sitesByDep:        make(map[*types.Func][]*semanticFunction),
		visited:           make(map[*types.Func]bool),
	}
	for called := range model.functionCallers {
		c.register(called)
	}
	for _, graphEntry := range anonymousInterfaceGraph {
		for methodName, ifaceMethod := range graphEntry.ifaceMethods {
			implMethod := graphEntry.implMethods[methodName]
			c.register(implMethod)
			c.anonMethodsByImpl[implMethod] = append(c.anonMethodsByImpl[implMethod], ifaceMethod)
		}
	}
	for _, site := range sites {
		for _, dep := range site.deps {
			c.register(dep)
			c.sitesByDep[dep] = append(c.sitesByDep[dep], site.semFn)
		}
	}

	for key := range c.registered {
		if model.functionAsync(key) {
			c.visit(key)
		}
	}
	for implFn, ifaceMethods := range ifaceEdges {
		if !implFn.async {
			continue
		}
		for _, ifaceMethod := range ifaceMethods {
			c.markInterfaceMethod(ifaceMethod)
		}
	}
	for _, site := range sites {
		if site.suspends {
			c.markFunction(site.semFn)
		}
	}

	for len(c.queue) != 0 {
		if err := ctx.Err(); err != nil {
			return []Diagnostic{contextCanceledDiagnostic(err)}
		}
		key := c.queue[len(c.queue)-1]
		c.queue = c.queue[:len(c.queue)-1]
		for _, caller := range model.functionCallers[key] {
			c.markFunction(caller)
		}
		for _, ifaceMethod := range c.anonMethodsByImpl[key] {
			if model.markInterfaceMethodAsync(ifaceMethod) {
				c.visitInterfaceMethod(ifaceMethod)
			}
		}
		for _, semFn := range c.sitesByDep[key] {
			c.markFunction(semFn)
		}
	}
	return nil
}

// register indexes key by every mark that can make it report async.
func (c *asyncColoring) register(key *types.Func) {
	if key == nil || c.registered[key] {
		return
	}
	c.registered[key] = true
	if semFn := semanticFunctionFor(c.model, key); semFn != nil {
		c.keysBySemFn[semFn] = append(c.keysBySemFn[semFn], key)
	}
	if interfaceMethodHasNamedReceiver(key) {
		if fullName := c.model.functionFullName(key); fullName != "" {
			c.keysByFullName[fullName] = append(c.keysByFullName[fullName], key)
		}
	}
}

func (c *asyncColoring) visit(key *types.Func) {
	if c.visited[key] {
		return
	}
	c.visited[key] = true
	c.queue = append(c.queue, key)
}

// markFunction marks semFn async and visits the keys and interface methods the
// new mark decides.
func (c *asyncColoring) markFunction(semFn *semanticFunction) {
	if !markFunctionAsync(semFn) {
		return
	}
	for _, key := range c.keysBySemFn[semFn] {
		c.visit(key)
	}
	for _, ifaceMethod := range c.ifaceEdges[semFn] {
		c.markInterfaceMethod(ifaceMethod)
	}
}

// markInterfaceMethod colors an interface method whose implementation is async.
func (c *asyncColoring) markInterfaceMethod(ifaceMethod *types.Func) {
	if c.model.markInterfaceMethodAsync(ifaceMethod) {
		c.visitInterfaceMethod(ifaceMethod)
	}
	c.markFunction(semanticFunctionFor(c.model, ifaceMethod))
}

// visitInterfaceMethod visits the keys an async interface method mark decides.
func (c *asyncColoring) visitInterfaceMethod(ifaceMethod *types.Func) {
	if c.registered[ifaceMethod] {
		c.visit(ifaceMethod)
	}
	if interfaceMethodHasNamedReceiver(ifaceMethod) {
		for _, key := range c.keysByFullName[c.model.functionFullName(ifaceMethod)] {
			c.visit(key)
		}
	}
}
