package compiler

import (
	"go/ast"
	"go/types"
	"path"
	"path/filepath"
	"strconv"
	"strings"

	"golang.org/x/tools/go/packages"
)

// Call sites.
//
// runtime.Caller reads the file and line of a frame from the JavaScript
// stack, which name the generated JavaScript, not the Go source. Code that
// names things by the line of its caller, as a UI library naming the widgets
// each line of its callers adds, gets names that change whenever the bundle
// does, and that collide once a minifier puts many statements on one line.
//
// A //goscript:callsite line in the doc comment of a function or method makes
// each direct call of it pass the Go position of the call, as one more
// argument after its parameters: a CallSite with the file, named as go build
// -trimpath names it (see callSiteFile), and the line of the call's opening
// parenthesis, which Go reports. A call made in the
// body of a function the directive marks also links the position its own
// caller passed, and so does a call of runtime.Caller there, whose override
// takes a call site too (see OverrideMetadata.CallSiteFunctions). Caller
// walks that chain in Go terms and needs no stack trace for the frames it
// reaches, which report their file and line but not their function's name.
// Where the chain ends, at a function the directive does not mark, at a call
// through an interface or function value, or at a deferred or go call, which
// Go reports at another line, Caller reads the JavaScript stack as before.

// callSiteDirectiveLine is the directive line.
const callSiteDirectiveLine = "//goscript:callsite"

// callSiteParamName names the parameter that takes the call site.
const callSiteParamName = "__goscriptCaller"

// collectCallSiteDirectives finds the functions and methods that
// //goscript:callsite marks in the declarations of pkgs. A directive on a
// function without a body is an error.
func collectCallSiteDirectives(pkgs []*packages.Package) (map[*types.Func]bool, []Diagnostic) {
	functions := make(map[*types.Func]bool)
	var diagnostics []Diagnostic
	for _, pkg := range pkgs {
		if pkg == nil || pkg.TypesInfo == nil {
			continue
		}
		for _, file := range pkg.Syntax {
			for _, decl := range file.Decls {
				// Only a function declaration's doc comment carries the directive.
				fnDecl, ok := decl.(*ast.FuncDecl)
				if !ok || !hasDirectiveLine(fnDecl.Doc, callSiteDirectiveLine) {
					continue
				}
				fn, _ := pkg.TypesInfo.Defs[fnDecl.Name].(*types.Func)
				if fn == nil {
					continue
				}

				// A function without a body has no calls to link.
				if fnDecl.Body == nil {
					diagnostics = append(diagnostics, Diagnostic{
						Severity: DiagnosticSeverityError,
						Code:     "goscript/directive:target",
						Message:  callSiteDirectiveLine + " applies to functions and methods with a body",
						Detail:   fn.Name(),
						Position: diagnosticPositionFromSource(sourcePos(pkg, fnDecl.Pos()), ""),
					})
					continue
				}
				functions[fn] = true
			}
		}
	}
	return functions, diagnostics
}

// hasDirectiveLine reports whether doc holds the directive line.
func hasDirectiveLine(doc *ast.CommentGroup, line string) bool {
	if doc == nil {
		return false
	}
	for _, comment := range doc.List {
		rest, ok := strings.CutPrefix(comment.Text, line)
		if ok && (rest == "" || rest[0] == ' ' || rest[0] == '\t') {
			return true
		}
	}
	return false
}

// callSiteParam returns the parameter that takes the call site of a function
// that //goscript:callsite marks, and whether fn has one.
func (o *LoweringOwner) callSiteParam(ctx lowerFileContext, fn *types.Func) (loweredParam, bool) {
	// Only a marked function takes the parameter, which callers may omit.
	if ctx.model == nil || fn == nil || !ctx.model.callSiteFunctions[fn] {
		return loweredParam{}, false
	}
	return loweredParam{name: callSiteParamName + "?", typ: "$.CallSite"}, true
}

// callSiteArg returns the call site that a direct call passes to a function
// that //goscript:callsite marks or that override metadata says takes one, and
// whether the call passes one.
func (o *LoweringOwner) callSiteArg(ctx lowerFileContext, call *ast.CallExpr) (string, bool) {
	// Only a direct call of such a function, or of such a method on a
	// concrete receiver, passes one.
	pkg := ctx.semPkg.source
	if fun, ok := ast.Unparen(call.Fun).(*ast.SelectorExpr); ok {
		if selection := pkg.TypesInfo.Selections[fun]; selection != nil &&
			(selection.Kind() != types.MethodVal || isInterfaceType(selection.Recv())) {
			return "", false
		}
	}

	// An override such as runtime.Caller takes one only from a marked
	// function, as the frames of other functions come from the JavaScript
	// stack, which also names their functions.
	fn := calledFunction(pkg, ast.Unparen(call.Fun))
	marked := fn != nil && ctx.model != nil && ctx.model.callSiteFunctions[fn.Origin()]
	if !marked && !(ctx.callSiteFunction && o.facts.TakesCallSite(fn)) {
		return "", false
	}

	// The site names the file as go build -trimpath does, and the line of the
	// opening parenthesis, as Go reports it.
	pos := pkg.Fset.Position(call.Lparen)
	site := "{ file: " + strconv.Quote(callSiteFile(pkg, pos.Filename)) + ", line: " + strconv.Itoa(pos.Line)
	if ctx.callSiteFunction {
		site += ", caller: " + callSiteParamName
	}
	return site + " }", true
}

// callSiteFile names a source file of pkg as go build -trimpath does: by the
// module path and the file's path in the module, or else by the package path
// and the file name, as for the standard library.
func callSiteFile(pkg *packages.Package, filename string) string {
	// A file in its module's directory is named by its path there.
	if module := pkg.Module; module != nil && module.Dir != "" {
		rel, err := filepath.Rel(module.Dir, filename)
		if err == nil && rel != ".." && !strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
			return path.Join(module.Path, filepath.ToSlash(rel))
		}
	}
	return path.Join(pkg.PkgPath, filepath.Base(filename))
}

// withCallSiteFunction returns ctx for the body of a function, marked as
// //goscript:callsite marks it or not.
func (ctx lowerFileContext) withCallSiteFunction(marked bool) lowerFileContext {
	ctx.callSiteFunction = marked
	return ctx
}
