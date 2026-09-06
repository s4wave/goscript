//go:build go1.27

package compiler

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// TestCompilePackagesInfersGenericMethodArguments checks dictionary forwarding
// through value and pointer receivers when the caller also has type parameters.
func TestCompilePackagesInfersGenericMethodArguments(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/genericmethod\n\ngo 1.27.0\n",
		"main.go": `package main

type Counter struct{}

func (Counter) Value[T any](n T) T { return n }
func (*Counter) Pointer[T any](n T) T { return n }

func Forward[T any](n T) T {
	c := new(Counter)
	return c.Pointer(c.Value(n))
}

func main() { println(Forward(5)) }
`,
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err)
	}
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "genericmethod", "main.gs.ts"))
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{
		".Value({",
		"Counter.prototype.Pointer.call(c, {",
	} {
		if !strings.Contains(string(content), want) {
			t.Fatalf("missing generic method dictionary %q in generated output:\n%s", want, content)
		}
	}
}
