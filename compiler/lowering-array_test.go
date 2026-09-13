package compiler

import (
	"os"
	"path/filepath"
	"testing"
)

// TestCompilePackagesCompactEmptyArrays prevents source size from scaling with zero-filled array length.
func TestCompilePackagesCompactEmptyArrays(t *testing.T) {
	// Compile the large struct-array shape used by compression lookup tables.
	directory := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/emptyarray\n\ngo 1.25.3\n",
		"main.go": "package emptyarray\ntype Entry struct { Offset, Previous int32 }\nfunc Table() [1 << 22]Entry { return [1 << 22]Entry{} }\n",
	})
	output := filepath.Join(t.TempDir(), "output")
	compiler, err := NewCompiler(&Config{Dir: directory, OutputPath: output}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := compiler.CompilePackages(t.Context(), "."); err != nil {
		t.Fatal(err)
	}

	// A zero-filled table requires bounded source regardless of its runtime length.
	content, err := os.ReadFile(filepath.Join(output, "@goscript", "example.test", "emptyarray", "main.gs.ts"))
	if err != nil {
		t.Fatal(err)
	}
	if len(content) > 8192 {
		t.Fatalf("empty array generated %d bytes; expected compact initialization", len(content))
	}
}
