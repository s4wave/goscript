package compiler

import (
	"go/ast"
	"go/parser"
	"go/token"
	"go/types"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

// TestWalkShortDeclValueUses preserves initializer order and excludes names that
// must not cause shadow aliases, including bare keys in map literals.
func TestWalkShortDeclValueUses(t *testing.T) {
	// Mix value uses with selector names, literal keys, types, and local definitions.
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "shadow.go", `package shadow
type Record struct { Value int }
type Number int
func take(...any) any { return nil }
func check(value int, record Record, key int) {
	_ = take(record.Value, Record{Value: value},
		map[int]int{key: value, (key + 1): value}, Number(value),
		func() int { local := value; return local }())
}
`, 0)
	if err != nil {
		t.Fatal(err)
	}
	info := &types.Info{Uses: make(map[*ast.Ident]types.Object)}
	config := types.Config{}
	if _, err := config.Check("example.test/shadow", fset, []*ast.File{file}, info); err != nil {
		t.Fatal(err)
	}

	// Only the computed key is visited; a bare key retains the existing exclusion.
	decl := file.Decls[len(file.Decls)-1].(*ast.FuncDecl)
	assign := decl.Body.List[0].(*ast.AssignStmt)
	var got []string
	walkShortDeclValueUses(info, assign.Rhs[0], func(ident *ast.Ident, obj types.Object) {
		if obj != info.Uses[ident] {
			t.Fatalf("use of %s resolved to %v, want %v", ident.Name, obj, info.Uses[ident])
		}
		got = append(got, ident.Name)
	})
	want := []string{"take", "record", "value", "value", "key", "value", "value", "value", "local"}
	if !slices.Equal(got, want) {
		t.Fatalf("initializer uses = %v, want %v", got, want)
	}
}

// TestShortDeclShadowAliasOrder keeps old values ahead of new names across
// multiple initializers, even when their reference order differs from the LHS.
func TestShortDeclShadowAliasOrder(t *testing.T) {
	// Both initializers refer to parameters shadowed by the nested declaration.
	directory := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/shadoworder\n\ngo 1.25.3\n",
		"main.go": `package shadoworder
func swap(first, second int) int {
	{
		first, second := second, first
		return first - second
	}
}
`,
	})
	output := filepath.Join(t.TempDir(), "output")
	compiler, err := NewCompiler(&Config{Dir: directory, OutputPath: output}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := compiler.CompilePackages(t.Context(), "."); err != nil {
		t.Fatal(err)
	}

	// Temporary numbering is part of the byte-identical output contract.
	content, err := os.ReadFile(filepath.Join(output, "@goscript", "example.test", "shadoworder", "main.gs.ts"))
	if err != nil {
		t.Fatal(err)
	}
	want := strings.Join([]string{
		"let __goscriptShadow0 = second",
		"let __goscriptShadow1 = first",
		"let __goscriptShadow3 = __goscriptShadow0",
		"let __goscriptShadow2 = __goscriptShadow1",
		"return __goscriptShadow3 - __goscriptShadow2",
	}, "\n")
	text := strings.ReplaceAll(string(content), "\t", "")
	if !strings.Contains(text, want) {
		t.Fatalf("shadow declarations changed order:\n%s", content)
	}
}
