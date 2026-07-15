package compiler

import (
	"context"
	"errors"
	"go/ast"
	"go/parser"
	"go/token"
	"path/filepath"
	"strings"
	"testing"

	"golang.org/x/tools/go/packages"
)

func TestFormatDiagnosticIncludesDisplayPosition(t *testing.T) {
	diag := Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/test",
		Message:  "failed",
		Detail:   "bad input",
		Position: &DiagnosticPosition{
			File:        filepath.Join("internal", "raw.go"),
			DisplayFile: filepath.Join("pkg", "main.go"),
			Line:        12,
			Column:      3,
		},
	}

	got := FormatDiagnostic(diag)
	want := "pkg/main.go:12:3: goscript/test: failed (bad input)"
	if got != want {
		t.Fatalf("FormatDiagnostic() = %q, want %q", got, want)
	}
}

func TestFormatDiagnosticWithoutPositionPreservesLegacyShape(t *testing.T) {
	diag := Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/test",
		Message:  "failed",
		Detail:   "bad input",
	}

	got := FormatDiagnostic(diag)
	want := "goscript/test: failed (bad input)"
	if got != want {
		t.Fatalf("FormatDiagnostic() = %q, want %q", got, want)
	}
}

func TestDiagnosticPositionFromSourceUsesDisplayRoot(t *testing.T) {
	root := t.TempDir()
	file := filepath.Join(root, "pkg", "main.go")
	pos := diagnosticPositionFromSource(sourcePosition{
		file:   file,
		line:   7,
		column: 9,
	}, root)

	if pos == nil {
		t.Fatal("expected diagnostic position")
	}
	if pos.File != file {
		t.Fatalf("File = %q, want %q", pos.File, file)
	}
	if pos.DisplayFile != "pkg/main.go" {
		t.Fatalf("DisplayFile = %q, want %q", pos.DisplayFile, "pkg/main.go")
	}
}

func TestLoweringUnsupportedDiagnosticIncludesSourcePosition(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/loweringdiag\n\ngo 1.25.3\n",
		"main.go": "package loweringdiag\n\nfunc Make[T ~[]int]() T {\n\treturn make(T, 1)\n}\n",
	})
	service := NewCompileService()
	_, err := service.Compile(context.Background(), &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "output"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeReference,
	})
	if err == nil {
		t.Fatal("expected lowering diagnostic")
	}
	var compileErr *CompileError
	if !errors.As(err, &compileErr) {
		t.Fatalf("expected CompileError, got %T: %v", err, err)
	}
	if len(compileErr.Diagnostics) != 1 {
		t.Fatalf("Diagnostics = %#v, want exactly one", compileErr.Diagnostics)
	}
	diag := compileErr.Diagnostics[0]
	if diag.Code != "goscript/lowering:unsupported" {
		t.Fatalf("Code = %q, want goscript/lowering:unsupported", diag.Code)
	}
	if diag.Position == nil {
		t.Fatalf("missing position in %#v", diag)
	}
	if diag.Position.DisplayFile != "main.go" {
		t.Fatalf("DisplayFile = %q, want main.go", diag.Position.DisplayFile)
	}
	if diag.Position.Line != 4 {
		t.Fatalf("Line = %d, want 4", diag.Position.Line)
	}
	if got := FormatDiagnostics(compileErr.Diagnostics); !strings.HasPrefix(got, "main.go:4:") {
		t.Fatalf("formatted diagnostic = %q, want main.go:4 prefix", got)
	}
}

func TestLowerNewExprMissingTypeInformationReturnsDiagnostic(t *testing.T) {
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "main.go", "package main\n\nfunc main() {\n\tnew(missing)\n}\n", 0)
	if err != nil {
		t.Fatalf("parse fixture: %v", err)
	}
	var call *ast.CallExpr
	ast.Inspect(file, func(node ast.Node) bool {
		if typed, ok := node.(*ast.CallExpr); ok {
			call = typed
			return false
		}
		return true
	})
	if call == nil {
		t.Fatal("missing new call")
	}

	owner := NewLoweringOwner(nil, nil)
	ctx := lowerFileContext{
		semPkg: &semanticPackage{
			pkgPath: "example.test/missing",
			source: &packages.Package{
				Fset:      fset,
				TypesInfo: nil,
			},
		},
		displayRoot: ".",
	}
	value, diagnostics := owner.lowerNewExpr(ctx, call)
	if value != "undefined" {
		t.Fatalf("lowered value = %q, want undefined", value)
	}
	if len(diagnostics) != 1 {
		t.Fatalf("diagnostics = %#v, want exactly one", diagnostics)
	}
	diag := diagnostics[0]
	if diag.Severity != DiagnosticSeverityError {
		t.Fatalf("severity = %q, want error", diag.Severity)
	}
	if diag.Code != "goscript/lowering:unsupported" {
		t.Fatalf("code = %q, want goscript/lowering:unsupported", diag.Code)
	}
	if diag.Detail != "new: missing type information for new expression argument" {
		t.Fatalf("detail = %q, want missing-type detail", diag.Detail)
	}
	if diag.Position == nil {
		t.Fatalf("missing position in %#v", diag)
	}
	if diag.Position.DisplayFile != "main.go" || diag.Position.Line != 4 {
		t.Fatalf("position = %#v, want main.go:4", diag.Position)
	}
}
