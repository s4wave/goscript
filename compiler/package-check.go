package compiler

import (
	"context"
	"errors"
	"fmt"
	"go/ast"
	"go/parser"
	"go/scanner"
	"go/token"
	"go/types"
	"os"
	"runtime"
	"slices"
	"strings"
	"sync"

	"golang.org/x/tools/go/packages"
)

// Check parses and type-checks every package the identity graph reaches,
// including the dependencies of override candidates, and fills each package's
// syntax and type information in place. It reports the parse and type errors
// of lowered nodes; the graph must carry no identity load errors.
//
// Only lowered nodes outside bodiless have their function bodies checked.
// Every other package contributes only its declarations: override candidates
// and their dependencies are never lowered, and a bodiless node's body facts
// come from its stored summary. Checking the graph again replaces every
// package's types and reuses the parsed syntax.
//
// The identity load already ran go list, so the check reads sources directly
// instead of loading the graph a second time. Each package parses as soon as
// its goroutine starts, one goroutine per file, and type-checks once its imports
// are complete. At most GOMAXPROCS files parse or packages check at once.
func (o *PackageGraphOwner) Check(ctx context.Context, graph *PackageGraph, bodiless map[string]bool) []Diagnostic {
	pkgs := graph.reachablePackages()
	if graph.checker == nil {
		graph.checker = &packageChecker{
			fset:   token.NewFileSet(),
			sizes:  goScriptTypeSizes(),
			work:   make(chan struct{}, runtime.GOMAXPROCS(0)),
			parsed: make(map[string]*parsedFile),
		}
	}
	checker := graph.checker
	done := make(map[*packages.Package]chan struct{}, len(pkgs))
	for _, pkg := range pkgs {
		done[pkg] = make(chan struct{})
	}
	var wg sync.WaitGroup
	for _, pkg := range pkgs {
		wg.Go(func() {
			defer close(done[pkg])
			node := graph.NodesByPackagePath[pkg.PkgPath]
			bodies := node != nil && !node.OverrideCandidate && !bodiless[pkg.PkgPath]
			checker.check(ctx, pkg, bodies, func() {
				for _, imp := range pkg.Imports {
					<-done[imp]
				}
			})
		})
	}
	wg.Wait()
	if err := ctx.Err(); err != nil {
		return []Diagnostic{contextCanceledDiagnostic(err)}
	}

	// Lowering assumes complete type information, so every lowered node must
	// check cleanly.
	var diagnostics []Diagnostic
	for _, node := range graph.Nodes {
		if !node.OverrideCandidate {
			diagnostics = append(diagnostics, packageDiagnostics(graph.packagesByPath[node.PkgPath])...)
		}
	}
	return diagnostics
}

// reachablePackages returns every package the graph nodes import, directly or
// transitively, in package path order.
func (g *PackageGraph) reachablePackages() []*packages.Package {
	seen := make(map[*packages.Package]bool)
	var pkgs []*packages.Package
	var visit func(pkg *packages.Package)
	visit = func(pkg *packages.Package) {
		if seen[pkg] {
			return
		}
		seen[pkg] = true
		pkgs = append(pkgs, pkg)
		for _, imp := range pkg.Imports {
			visit(imp)
		}
	}
	for _, node := range g.Nodes {
		visit(g.packagesByPath[node.PkgPath])
	}
	slices.SortFunc(pkgs, func(a, b *packages.Package) int {
		return strings.Compare(a.ID, b.ID)
	})
	return pkgs
}

// packageChecker parses and type-checks packages into one file set.
type packageChecker struct {
	fset  *token.FileSet
	sizes types.Sizes
	// work bounds the files parsing and packages type-checking at once.
	work chan struct{}

	mu sync.Mutex
	// parsed shares each file's syntax between the test variants that list it.
	parsed map[string]*parsedFile
}

type parsedFile struct {
	ready chan struct{}
	file  *ast.File
	err   error
}

// check parses pkg, calls waitImports, and type-checks pkg against its
// imports, with function bodies when bodies is set. Errors land in pkg.Errors
// as go/packages reports them.
func (c *packageChecker) check(ctx context.Context, pkg *packages.Package, bodies bool, waitImports func()) {
	pkg.Errors, pkg.TypeErrors = nil, nil
	pkg.Fset = c.fset
	pkg.TypesSizes = c.sizes
	pkg.TypesInfo = &types.Info{
		Types:        make(map[ast.Expr]types.TypeAndValue),
		Defs:         make(map[*ast.Ident]types.Object),
		Uses:         make(map[*ast.Ident]types.Object),
		Implicits:    make(map[ast.Node]types.Object),
		Instances:    make(map[*ast.Ident]types.Instance),
		Scopes:       make(map[ast.Node]*types.Scope),
		Selections:   make(map[*ast.SelectorExpr]*types.Selection),
		FileVersions: make(map[*ast.File]string),
	}
	if pkg.PkgPath == "unsafe" {
		pkg.Types = types.Unsafe
		pkg.Syntax = []*ast.File{}
		return
	}
	pkg.Types = types.NewPackage(pkg.PkgPath, pkg.Name)

	files := make([]*ast.File, len(pkg.CompiledGoFiles))
	errs := make([]error, len(pkg.CompiledGoFiles))
	var wg sync.WaitGroup
	for i, name := range pkg.CompiledGoFiles {
		wg.Go(func() { files[i], errs[i] = c.parse(ctx, name) })
	}
	wg.Wait()
	pkg.Syntax = make([]*ast.File, 0, len(files))
	for i, file := range files {
		if errs[i] != nil {
			appendPackageError(pkg, errs[i])
		}
		if file != nil {
			pkg.Syntax = append(pkg.Syntax, file)
		}
	}
	waitImports()
	if ctx.Err() != nil {
		return
	}

	conf := &types.Config{
		Importer: packageImporter(pkg),
		Error:    func(err error) { appendPackageError(pkg, err) },
		Sizes:    c.sizes,
		// IgnoreFuncBodies also skips function literal bodies and the unused
		// import check, which needs the bodies.
		IgnoreFuncBodies: !bodies,
	}
	if pkg.Module != nil && pkg.Module.GoVersion != "" {
		conf.GoVersion = "go" + pkg.Module.GoVersion
	}
	c.work <- struct{}{}
	err := types.NewChecker(conf, c.fset, pkg.Types, pkg.TypesInfo).Files(pkg.Syntax)
	<-c.work
	if err != nil && len(pkg.Errors) == 0 && len(pkg.Syntax) != 0 &&
		strings.HasPrefix(err.Error(), "package requires newer Go version") {
		appendPackageError(pkg, types.Error{Fset: c.fset, Pos: pkg.Syntax[0].Package, Msg: err.Error()})
	}
}

// parse returns the syntax of one file, parsing it on first use.
func (c *packageChecker) parse(ctx context.Context, name string) (*ast.File, error) {
	c.mu.Lock()
	parsed := c.parsed[name]
	if parsed != nil {
		c.mu.Unlock()
		<-parsed.ready
		return parsed.file, parsed.err
	}
	parsed = &parsedFile{ready: make(chan struct{})}
	c.parsed[name] = parsed
	c.mu.Unlock()

	defer close(parsed.ready)
	c.work <- struct{}{}
	defer func() { <-c.work }()
	if parsed.err = ctx.Err(); parsed.err != nil {
		return nil, parsed.err
	}
	src, err := os.ReadFile(name)
	if err != nil {
		parsed.err = err
		return nil, err
	}
	parsed.file, parsed.err = parser.ParseFile(c.fset, name, src, parser.AllErrors|parser.ParseComments|parser.SkipObjectResolution)
	return parsed.file, parsed.err
}

// packageImporter resolves pkg's imports to their checked packages.
func packageImporter(pkg *packages.Package) types.ImporterFrom {
	return packageImporterFunc(func(path string) (*types.Package, error) {
		if path == "unsafe" {
			return types.Unsafe, nil
		}
		imp := pkg.Imports[path]
		if imp == nil {
			return nil, errors.New("no metadata for " + path)
		}
		if imp.Types == nil || !imp.Types.Complete() {
			return nil, errors.New("incomplete types for " + path)
		}
		return imp.Types, nil
	})
}

type packageImporterFunc func(path string) (*types.Package, error)

func (f packageImporterFunc) Import(path string) (*types.Package, error) {
	return f(path)
}

func (f packageImporterFunc) ImportFrom(path, _ string, _ types.ImportMode) (*types.Package, error) {
	return f(path)
}

// appendPackageError records err in pkg.Errors the way go/packages does.
func appendPackageError(pkg *packages.Package, err error) {
	var pathErr *os.PathError
	var listErr scanner.ErrorList
	var typeErr types.Error
	switch {
	case errors.As(err, &listErr):
		for _, err := range listErr {
			pkg.Errors = append(pkg.Errors, packages.Error{
				Pos:  err.Pos.String(),
				Msg:  err.Msg,
				Kind: packages.ParseError,
			})
		}
	case errors.As(err, &typeErr):
		pkg.TypeErrors = append(pkg.TypeErrors, typeErr)
		pkg.Errors = append(pkg.Errors, packages.Error{
			Pos:  typeErr.Fset.Position(typeErr.Pos).String(),
			Msg:  typeErr.Msg,
			Kind: packages.TypeError,
		})
	case errors.As(err, &pathErr):
		pkg.Errors = append(pkg.Errors, packages.Error{
			Pos:  pathErr.Path + ":1",
			Msg:  pathErr.Err.Error(),
			Kind: packages.ParseError,
		})
	default:
		pkg.Errors = append(pkg.Errors, packages.Error{
			Pos:  "-",
			Msg:  fmt.Sprint(err),
			Kind: packages.UnknownError,
		})
	}
}
