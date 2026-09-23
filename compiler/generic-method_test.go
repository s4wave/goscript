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

// TestCompilePackagesCallsGenericOverrideMethodThroughPlainPrototype checks that
// a method call on a pointer to an instantiated override type reads the class
// prototype without type arguments, which TypeScript rejects before a property
// access.
func TestCompilePackagesCallsGenericOverrideMethodThroughPlainPrototype(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/genericprototype\n\ngo 1.27.0\n",
		"main.go": `package main

import "sync/atomic"

type nomination struct{ id int }

func store(p *atomic.Pointer[nomination]) { p.Store(&nomination{id: 1}) }

func swap(p *atomic.Pointer[nomination]) *nomination { return p.Swap(nil) }

func main() {
	var p atomic.Pointer[nomination]
	store(&p)
	println(swap(&p).id)
}
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "genericprototype", "main.gs.ts"))
	if err != nil {
		t.Fatal(err)
	}
	text := string(content)
	if strings.Contains(text, ">.prototype.") {
		t.Fatalf("prototype access follows type arguments in generated output:\n%s", text)
	}
	for _, want := range []string{
		"atomic.Pointer.prototype.Store.call(",
		"atomic.Pointer.prototype.Swap.call(",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}
