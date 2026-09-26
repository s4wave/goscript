package compiler

import (
	"go/ast"
	"go/token"
	"go/types"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// TestSemanticModelSourceFiles preserves adjusted positions and distinct function
// declarations when several files are collected into one package.
func TestSemanticModelSourceFiles(t *testing.T) {
	// Use repeated method and init names, generic functions, and line directives.
	directory := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/sourcefiles\n\ngo 1.25.3\n",
		"a.go": `package sourcefiles
type First struct{}
//line first.go:100:7
func (First) Read() {}
func Identity[T any](v T) T { return v }
func init() {}
func Check(v any) {
 var p *First = nil
 var boxed any = p
 _ = v.(*First)
 _ = boxed
 _ = Identity(1)
 func() {
  var nested *First = nil
  _ = nested
 }()
}
`,
		"b.go": `package sourcefiles
type Second struct{}
//line second.go:200
func (Second) Read() {}
func init() {}
`,
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 directory,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	model := buildSemanticModel(t, graph)
	semPkg := requireSemanticPackage(t, model, "example.test/sourcefiles")
	pkg := semPkg.source
	ctx := lowerFileContext{semPkg: semPkg, tokenFile: pkg.Fset.File(pkg.Syntax[0].Pos())}

	// Match FileSet positions both inside the cached file and across file boundaries.
	declarations := 0
	for _, file := range pkg.Syntax {
		tokenFile := pkg.Fset.File(file.Pos())
		ast.Inspect(file, func(node ast.Node) bool {
			if node == nil {
				return true
			}
			for _, pos := range []token.Pos{node.Pos(), node.End()} {
				want := sourcePos(pkg, pos)
				if got := sourcePosInFile(tokenFile, pos); got != want {
					t.Fatalf("source position at %d: got %#v, want %#v", pos, got, want)
				}
				if got := sourceLine(ctx, pos); got != want.line {
					t.Fatalf("source line at %d: got %d, want %d", pos, got, want.line)
				}
			}
			if ident, ok := node.(*ast.Ident); ok {
				if value := model.values[pkg.TypesInfo.Defs[ident]]; value != nil {
					if want := sourcePos(pkg, ident.Pos()); value.position != want {
						t.Fatalf("value %s position: got %#v, want %#v", ident.Name, value.position, want)
					}
				}
			}
			if decl, ok := node.(*ast.FuncDecl); ok {
				fn, _ := pkg.TypesInfo.Defs[decl.Name].(*types.Func)
				if got := functionDeclForObject(semPkg, fn); got != decl {
					t.Fatalf("declaration for %s at %d: got %p, want %p", fn, decl.Pos(), got, decl)
				}
				declarations++
			}
			return true
		})
	}
	if declarations != 6 {
		t.Fatalf("checked %d function declarations, want 6", declarations)
	}

	// Unresolved functions and invalid positions retain their empty results.
	unknown := types.NewFunc(token.NoPos, pkg.Types, "Read", nil)
	if got := functionDeclForObject(semPkg, unknown); got != nil {
		t.Fatalf("unexpected declaration for an unrelated function: %v", got)
	}
	if got := sourcePosInFile(ctx.tokenFile, token.NoPos); got != (sourcePosition{}) {
		t.Fatalf("invalid position resolved to %#v", got)
	}
	if got := sourceLine(ctx, token.NoPos); got != 0 {
		t.Fatalf("invalid position resolved to line %d", got)
	}
}

// TestCompilePackagesPromotesRepeatedLocalImports keeps runtime imports when an
// object first appears in a type and is later used as a value.
func TestCompilePackagesPromotesRepeatedLocalImports(t *testing.T) {
	// Discover Payload through a signature before constructing it twice.
	directory := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/repeatedimports\n\ngo 1.25.3\n",
		"a.go": `package repeatedimports
type Acceptor interface { Accept(Payload) }
func Make() Payload { return Payload{Value: 1} }
func Again() Payload { return Payload{Value: 2} }
`,
		"payload.go": "package repeatedimports\ntype Payload struct { Value int }\n",
	})
	output := filepath.Join(t.TempDir(), "out")
	compiler, err := NewCompiler(&Config{Dir: directory, OutputPath: output}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := compiler.CompilePackages(t.Context(), "."); err != nil {
		t.Fatal(err)
	}

	// The constructor requires an ordinary import even after the type-only use.
	content, err := os.ReadFile(filepath.Join(output, "@goscript", "example.test", "repeatedimports", "a.gs.ts"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(content), "import * as __goscript_payload from \"./payload.gs.ts\"") {
		t.Fatalf("missing runtime import for repeated local object:\n%s", content)
	}
}
