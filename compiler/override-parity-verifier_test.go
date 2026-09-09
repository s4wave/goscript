package compiler

import (
	"context"
	"go/token"
	"go/types"
	"path/filepath"
	"strings"
	"testing"
)

func TestOverrideParityVerifierWarnsForMissingBehaviorTest(t *testing.T) {
	result, err := compileBehaviorParityFixture(t, "")
	if err != nil {
		t.Fatalf("expected compile without behavior test to warn, not fail: %v\n%#v", err, result.Diagnostics)
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test")
	requireDiagnosticSeverity(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test", DiagnosticSeverityWarning)

	result, err = compileBehaviorParityFixture(t, strings.Join([]string{
		"import { Present } from './index.js'",
		"Present()",
		"",
	}, "\n"))
	if err != nil {
		t.Fatalf("expected compile with behavior test to pass: %v\n%#v", err, result.Diagnostics)
	}
}

func TestOverrideParityVerifierIgnoresImportOnlyBehaviorReference(t *testing.T) {
	result, err := compileBehaviorParityFixture(t, strings.Join([]string{
		"import { Present } from './index.js'",
		"const name = 'Present'",
		"void name",
		"",
	}, "\n"))
	if err != nil {
		t.Fatalf("expected import-only behavior test to warn, not fail: %v\n%#v", err, result.Diagnostics)
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test")
	requireDiagnosticSeverity(t, result.Diagnostics, "goscript/overrides:parity-missing-behavior-test", DiagnosticSeverityWarning)
}

func TestOverrideParityVerifierAcceptsNamespaceBehaviorReference(t *testing.T) {
	result, err := compileBehaviorParityFixture(t, strings.Join([]string{
		"import * as lib from './index.js'",
		"lib.Present()",
		"",
	}, "\n"))
	if err != nil {
		t.Fatalf("expected namespace behavior test to pass: %v\n%#v", err, result.Diagnostics)
	}
}

func compileBehaviorParityFixture(t *testing.T, behaviorTest string) (*CompilationResult, error) {
	t.Helper()

	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/behaviorparity\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/behaviorparity/lib\"",
			"func main() { lib.Present() }",
			"",
		}, "\n"),
		"lib/lib.go": strings.Join([]string{
			"package lib",
			"func Present() {}",
			"",
		}, "\n"),
	})
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/behaviorparity/lib/index.ts", "export function Present(): void {}\n")
	if behaviorTest != "" {
		writeFixtureFile(t, overrideDir, "example.test/behaviorparity/lib/index.test.ts", behaviorTest)
	}
	writeFixtureFile(t, overrideDir, "example.test/behaviorparity/lib/parity.json", parityFixtureJSON(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
	}))

	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      filepath.Join(t.TempDir(), "out"),
		OverrideDirs:    []string{overrideDir},
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}
	return comp.CompilePackages(context.Background(), ".")
}

func requireDiagnosticSeverity(t *testing.T, diagnostics []Diagnostic, code string, severity DiagnosticSeverity) {
	t.Helper()

	for _, diagnostic := range diagnostics {
		if diagnostic.Code == code && diagnostic.Severity == severity {
			return
		}
	}
	t.Fatalf("missing diagnostic %q with severity %q in %#v", code, severity, diagnostics)
}

func TestOverrideParityVerifierToolchainSuperset(t *testing.T) {
	pkg := types.NewPackage("example.test/future", "future")
	ledger := overrideParityLedger{
		SchemaVersion: 1,
		Strict:        true,
		Symbols: map[string]overrideParityEntry{
			"FutureBlocked": {Status: overrideParityStatusBlocked, Reason: "newer stdlib surface"},
			"FutureReal":    {Status: overrideParityStatusReal},
			"FutureVersioned": {
				Status: overrideParityStatusReal,
				Since:  "go1.27",
			},
		},
	}

	t.Run("blocked absent from go and typescript passes", func(t *testing.T) {
		diagnostics := verifyOverrideParityPackage("go1.26.5", pkg.Path(), pkg, ledger, nil, nil)
		for _, diagnostic := range diagnostics {
			if diagnostic.Code == "goscript/overrides:parity-unknown-symbol" &&
				diagnostic.Detail == pkg.Path()+".FutureBlocked" {
				t.Fatalf("blocked superset entry was rejected: %#v", diagnostic)
			}
		}
	})

	t.Run("real absent from go rejects", func(t *testing.T) {
		diagnostics := verifyOverrideParityPackage("go1.26.5", pkg.Path(), pkg, ledger, nil, nil)
		requireDiagnosticCode(t, diagnostics, "goscript/overrides:parity-unknown-symbol")
	})

	t.Run("versioned real export before introduction passes", func(t *testing.T) {
		tsExports := map[string]typeScriptExport{"FutureVersioned": {value: true}}
		diagnostics := verifyOverrideParityPackage("go1.26.5", pkg.Path(), pkg, ledger, tsExports, nil)
		for _, diagnostic := range diagnostics {
			if diagnostic.Code == "goscript/overrides:parity-unknown-symbol" &&
				diagnostic.Detail == pkg.Path()+".FutureVersioned" {
				t.Fatalf("versioned superset entry was rejected: %#v", diagnostic)
			}
		}
	})

	t.Run("versioned real export after introduction rejects", func(t *testing.T) {
		tsExports := map[string]typeScriptExport{"FutureVersioned": {value: true}}
		diagnostics := verifyOverrideParityPackage("go1.27", pkg.Path(), pkg, ledger, tsExports, nil)
		requireDiagnosticCode(t, diagnostics, "goscript/overrides:parity-unknown-symbol")
	})

	t.Run("versioned real without export rejects", func(t *testing.T) {
		diagnostics := verifyOverrideParityPackage("go1.26.5", pkg.Path(), pkg, ledger, nil, nil)
		requireDiagnosticCode(t, diagnostics, "goscript/overrides:parity-unknown-symbol")
	})

	t.Run("blocked absent from go but exported by typescript rejects", func(t *testing.T) {
		tsExports := map[string]typeScriptExport{"FutureBlocked": {value: true}}
		diagnostics := verifyOverrideParityPackage("go1.26.5", pkg.Path(), pkg, ledger, tsExports, nil)
		requireDiagnosticCode(t, diagnostics, "goscript/overrides:parity-unexpected-export")
		requireDiagnosticSeverity(t, diagnostics, "goscript/overrides:parity-unexpected-export", DiagnosticSeverityError)
	})

	t.Run("blocked present in go and exported by typescript rejects", func(t *testing.T) {
		present := types.NewPackage("example.test/present", "present")
		signature := types.NewSignatureType(nil, nil, nil, types.NewTuple(), types.NewTuple(), false)
		present.Scope().Insert(types.NewFunc(token.NoPos, present, "BlockedNow", signature))
		tsExports := map[string]typeScriptExport{"BlockedNow": {value: true}}
		blockedLedger := overrideParityLedger{
			SchemaVersion: 1,
			Strict:        true,
			Symbols: map[string]overrideParityEntry{
				"BlockedNow": {Status: overrideParityStatusBlocked, Reason: "unsupported surface"},
			},
		}
		diagnostics := verifyOverrideParityPackage("go1.26.5", present.Path(), present, blockedLedger, tsExports, nil)
		requireDiagnosticCode(t, diagnostics, "goscript/overrides:parity-unexpected-export")
	})
}
