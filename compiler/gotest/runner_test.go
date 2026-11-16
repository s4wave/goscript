package gotest

import (
	"context"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strconv"
	"strings"
	"testing"
	"time"

	goscript "github.com/s4wave/goscript"
	"github.com/s4wave/goscript/compiler"
)

func TestDiagnosticsSummaryUsesCompilerFormatter(t *testing.T) {
	got := diagnosticsSummary([]compiler.Diagnostic{{
		Severity: compiler.DiagnosticSeverityError,
		Code:     "goscript/test",
		Message:  "failed",
		Detail:   "bad input",
		Position: &compiler.DiagnosticPosition{
			DisplayFile: "pkg/main.go",
			Line:        4,
			Column:      2,
		},
	}})
	want := "pkg/main.go:4:2: goscript/test: failed (bad input)"
	if got != want {
		t.Fatalf("diagnosticsSummary() = %q, want %q", got, want)
	}
}

func TestRunnerRunsOrdinaryPackageTest(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/gotest\n\ngo 1.25.3\n",
		"value.go": strings.Join([]string{
			"package gotest",
			"",
			"func Add(a int, b int) int {",
			"\treturn a + b",
			"}",
			"",
		}, "\n"),
		"value_test.go": strings.Join([]string{
			"package gotest",
			"",
			"import \"testing\"",
			"",
			"func TestAdd(t *testing.T) {",
			"\tif Add(1, 2) != 3 {",
			"\t\tt.Fatalf(\"unexpected sum\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	// A checkout's Node types are not visible from an unrelated scratch directory.
	if err := os.MkdirAll(filepath.Join(moduleDir, "node_modules", "@types", "node"), 0o755); err != nil {
		t.Fatal(err)
	}
	workDir := t.TempDir()

	// Run the real compiler, typechecker and runtime outside that checkout.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		WorkDir:  workDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
		Verbose:  true,
	})
	if err != nil {
		t.Fatalf("run package test: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package test to pass: %#v", result.Packages)
	}
	if len(result.Packages) != 1 || len(result.Packages[0].Tests) != 1 {
		t.Fatalf("unexpected package results: %#v", result.Packages)
	}
	if result.Packages[0].Tests[0].Name != "TestAdd" {
		t.Fatalf("unexpected test discovery: %#v", result.Packages[0].Tests)
	}
	if result.Packages[0].Phases.Workspace != PhaseStatusPass ||
		result.Packages[0].Phases.Compile != PhaseStatusPass ||
		result.Packages[0].Phases.Emit != PhaseStatusPass ||
		result.Packages[0].Phases.TypeCheck != PhaseStatusPass ||
		result.Packages[0].Phases.Runtime != PhaseStatusPass {
		t.Fatalf("unexpected phase status: %#v", result.Packages[0].Phases)
	}
}

func TestRunnerComparesInterfacePointerValuesByIdentity(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/ifaceptr\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package ifaceptr",
			"",
			"import \"testing\"",
			"",
			"type Snapshot interface {",
			"\tValue() int",
			"}",
			"",
			"type snapshot struct {",
			"\tvalue int",
			"}",
			"",
			"func (s *snapshot) Value() int { return s.value }",
			"",
			"func TestInterfacePointerValuesUsePointerIdentity(t *testing.T) {",
			"\tvar first Snapshot = &snapshot{value: 1}",
			"\tvar second Snapshot = &snapshot{value: 1}",
			"\tif first == second {",
			"\t\tt.Fatalf(\"distinct pointers stored in interfaces compared equal\")",
			"\t}",
			"\tsecond = first",
			"\tif first != second {",
			"\t\tt.Fatalf(\"same pointer stored in interfaces compared unequal\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
		Verbose:  true,
	})
	if err != nil {
		t.Fatalf("run package test: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package test to pass: %#v", result.Packages)
	}
}

func TestRunnerReportsShortMode(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/short\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package short",
			"",
			"import \"testing\"",
			"",
			"func TestShort(t *testing.T) {",
			"\tif !testing.Short() {",
			"\t\tt.Fatalf(\"expected short mode\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Short:    true,
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run short package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected short package to pass: %#v", result.Packages)
	}
}

func TestRunnerRunsBenchmarks(t *testing.T) {
	// The package has one test and three benchmarks.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/bench\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package bench",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {}",
			"",
			"func BenchmarkSum(b *testing.B) {",
			"\tsum := 0",
			"\tfor i := 0; i < b.N; i++ {",
			"\t\tsum += i",
			"\t}",
			"\tif b.N > 1 && sum == 0 {",
			"\t\tb.Fatal(\"no sum\")",
			"\t}",
			"}",
			"",
			"func BenchmarkLoop(b *testing.B) {",
			"\tfor b.Loop() {",
			"\t}",
			"}",
			"",
			"func BenchmarkOther(b *testing.B) {}",
			"",
		}, "\n"),
	})

	// run passes the package with the given -bench pattern.
	run := func(bench string) *Result {
		result, err := NewRunner().Run(context.Background(), &Request{
			Dir:       moduleDir,
			Patterns:  []string{"."},
			Bench:     bench,
			BenchTime: 10 * time.Millisecond,
			Timeout:   30 * time.Second,
		})
		if err != nil {
			t.Fatalf("run benchmark package: %v", err)
		}
		if !result.Passed() {
			t.Fatalf("expected benchmark package to pass: %#v", result.Packages)
		}
		return result
	}

	// The pattern selects the matching benchmarks only.
	output := run("Sum|Loop").Packages[0].Output
	for _, want := range []string{"BenchmarkSum\t", "BenchmarkLoop\t", " ns/op"} {
		if !strings.Contains(output, want) {
			t.Fatalf("expected benchmark output to contain %q:\n%s", want, output)
		}
	}
	if strings.Contains(output, "BenchmarkOther") {
		t.Fatalf("expected -bench to select benchmarks:\n%s", output)
	}
	if output := run("").Packages[0].Output; strings.Contains(output, "Benchmark") {
		t.Fatalf("expected no benchmarks without -bench:\n%s", output)
	}
}

func TestRunnerReportsTesting(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/testingmode\n\ngo 1.25.3\n",
		"value.go": strings.Join([]string{
			"package testingmode",
			"",
			"import \"testing\"",
			"",
			"var testingAtInit = testing.Testing()",
			"",
		}, "\n"),
		"value_test.go": strings.Join([]string{
			"package testingmode",
			"",
			"import \"testing\"",
			"",
			"func TestTesting(t *testing.T) {",
			"\tif !testingAtInit || !testing.Testing() {",
			"\t\tt.Fatalf(\"expected testing.Testing to report true\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"bubble_test.go": strings.Join([]string{
			"package testingmode",
			"",
			"import (",
			"\t\"testing\"",
			"\t\"testing/synctest\"",
			")",
			"",
			"func TestBubble(t *testing.T) {",
			"\tsynctest.Test(t, func(t *testing.T) {",
			"\t\tsynctest.Wait()",
			"\t})",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run testing package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected testing package to pass: %#v", result.Packages)
	}
}

func TestRunnerRunsAsyncSubtest(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/asyncsubtest\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package asyncsubtest",
			"",
			"import \"testing\"",
			"",
			"func TestAsyncSubtest(t *testing.T) {",
			"\tt.Run(\"child\", func(t *testing.T) {",
			"\t\tch := make(chan string, 1)",
			"\t\tch <- \"ok\"",
			"\t\tif <-ch != \"ok\" {",
			"\t\t\tt.Fatalf(\"unexpected channel value\")",
			"\t\t}",
			"\t})",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run async subtest package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected async subtest to pass: %#v", result.Packages)
	}
}

func TestRunnerAwaitsAsyncDependencyCallsInTests(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/asyncdep\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package asyncdep",
			"",
			"import (",
			"\t\"math/rand\"",
			"\t\"testing\"",
			")",
			"",
			"func TestAsyncDependencyCall(t *testing.T) {",
			"\tr := rand.New(rand.NewSource(1))",
			"\t_ = uint8(r.Intn(256))",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run async dependency package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected async dependency package to pass: %#v", result.Packages)
	}
}

func TestRunnerEvaluatesStructLiteralCallsBeforeFieldCopies(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/literalorder\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package literalorder",
			"",
			"import \"testing\"",
			"",
			"type result struct {",
			"\tvalue int",
			"\terr error",
			"}",
			"",
			"func fill(value *int) error {",
			"\t*value = 7",
			"\treturn nil",
			"}",
			"",
			"func recv() result {",
			"\tvar value int",
			"\treturn result{value: value, err: fill(&value)}",
			"}",
			"",
			"func TestLiteralOrder(t *testing.T) {",
			"\tres := recv()",
			"\tif res.err != nil {",
			"\t\tt.Fatalf(\"unexpected error: %v\", res.err)",
			"\t}",
			"\tif res.value != 7 {",
			"\t\tt.Fatalf(\"unexpected value: %d\", res.value)",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run literal order package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected literal order package to pass: %#v", result.Packages)
	}
}

func TestRunnerRunsExternalPackageTest(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/external\n\ngo 1.25.3\n",
		"value.go": strings.Join([]string{
			"package external",
			"",
			"func Add(a int, b int) int {",
			"\treturn a + b",
			"}",
			"",
		}, "\n"),
		"value_test.go": strings.Join([]string{
			"package external_test",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\texternal \"example.test/external\"",
			")",
			"",
			"func TestExternalAdd(t *testing.T) {",
			"\tif external.Add(4, 5) != 9 {",
			"\t\tt.Fatalf(\"unexpected sum\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	// Run the fixture's tests.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run external package test: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected external package test to pass: %#v", result.Packages)
	}
	if len(result.Packages) != 1 || len(result.Packages[0].Tests) != 1 {
		t.Fatalf("unexpected package results: %#v", result.Packages)
	}
	if result.Packages[0].TestPackagePath == "" {
		t.Fatalf("expected test package path: %#v", result.Packages[0])
	}
}

func TestRunnerBatchCompilesSamePackageTests(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/samebatch\n\ngo 1.25.3\n",
		"helper/value.go": strings.Join([]string{
			"package helper",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"import \"example.test/samebatch/one\"",
			"",
			"func Value() int { return one.Value() + 1 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/external_test.go": strings.Join([]string{
			"package two_test",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\t\"example.test/samebatch/helper\"",
			"\t\"example.test/samebatch/two\"",
			")",
			"",
			"func TestTwoExternal(t *testing.T) {",
			"\tif two.Value() != helper.Value() {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
		Verbose:  true,
	})
	if err != nil {
		t.Fatalf("run same-package batch tests: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected same-package batch tests to pass: %#v", result.Packages)
	}
}

func TestRunnerAppliesOverridesToTestImports(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/testoverride\n\ngo 1.25.3\n",
		"dep/value.go": strings.Join([]string{
			"package dep",
			"",
			"func Value() int {",
			"\tx := 41",
			"\t_ = &x",
			"\treturn x + 1",
			"}",
			"",
		}, "\n"),
		"app/value.go": "package app\n",
		"app/value_test.go": strings.Join([]string{
			"package app",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\t\"example.test/testoverride/dep\"",
			")",
			"",
			"func TestOverrideImport(t *testing.T) {",
			"\tif dep.Value() != 42 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	overrideDir := filepath.Join(moduleDir, "gs")
	if err := os.MkdirAll(filepath.Join(overrideDir, "example.test", "testoverride", "dep"), 0o755); err != nil {
		t.Fatal(err.Error())
	}
	if err := os.WriteFile(
		filepath.Join(overrideDir, "example.test", "testoverride", "dep", "index.ts"),
		[]byte("export function Value(): number { return 42 }\n"),
		0o644,
	); err != nil {
		t.Fatal(err.Error())
	}

	// Run the app's tests with the override directory.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:          moduleDir,
		Patterns:     []string{"./app"},
		OverrideDirs: []string{overrideDir},
		Timeout:      30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run override import package: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package test to pass with override import: %#v", result.Packages)
	}
}

func TestRunnerRejectsInvalidRunPattern(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod":   "module example.test/badrun\n\ngo 1.25.3\n",
		"value.go": "package badrun\n",
	})

	// Run with a run pattern that does not compile.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Run:      "[",
	})
	if err != nil {
		t.Fatalf("run package test: %v", err)
	}
	if result.Passed() {
		t.Fatalf("expected invalid run pattern to fail")
	}
	if result.Packages[0].Owner != OwnerPackageGraph {
		t.Fatalf("unexpected owner classification: %#v", result.Packages[0])
	}
	if len(result.Diagnostics) != 1 || result.Diagnostics[0].Code != "goscript/gotest:run-pattern" {
		t.Fatalf("expected structured run-pattern diagnostic: %#v", result.Diagnostics)
	}
}

func TestRunnerFailsPackagePatternsWhenGraphHasOnlyDiagnostics(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod":   "module example.test/missing\n\ngo 1.25.3\n",
		"value.go": "package missing\n",
	})

	// Run a pattern that matches no directory.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./does-not-exist"},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run missing package test: %v", err)
	}
	if result.Passed() {
		t.Fatalf("expected missing package pattern to fail")
	}
	if len(result.Packages) != 1 || result.Packages[0].Owner != OwnerPackageGraph {
		t.Fatalf("unexpected package graph failure: %#v", result.Packages)
	}
}

func TestMarkAllFailuresPreservesExistingPackageOwners(t *testing.T) {
	// Start from an owned failure, an unowned failure and a skipped package.
	result := &Result{Packages: []PackageResult{
		{
			PackagePath: "example.test/broken",
			Action:      ActionFail,
			Owner:       OwnerPackageGraph,
			Error:       "load failed",
		},
		{
			PackagePath: "example.test/run",
			Action:      ActionFail,
		},
		{
			PackagePath: "example.test/notests",
			Action:      ActionSkip,
		},
	}}

	// Mark every package failed by the test runner.
	markAllFailures(result, OwnerTestRunner, "typecheck failed")

	// Only the unowned failure takes the new owner; the others keep theirs.
	if result.Packages[0].Owner != OwnerPackageGraph || result.Packages[0].Error != "load failed" {
		t.Fatalf("package graph failure was overwritten: %#v", result.Packages[0])
	}
	if result.Packages[1].Owner != OwnerTestRunner || result.Packages[1].Error != "typecheck failed" {
		t.Fatalf("unowned failure was not marked: %#v", result.Packages[1])
	}
	if result.Packages[2].Action != ActionSkip || result.Packages[2].Owner != "" {
		t.Fatalf("skipped package should stay skipped: %#v", result.Packages[2])
	}
}

func TestRunnerScopesPackageLoadErrors(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/mixed\n\ngo 1.25.3\n",
		"clean/value.go": strings.Join([]string{
			"package clean",
			"",
			"func Value() int { return 11 }",
			"",
		}, "\n"),
		"clean/value_test.go": strings.Join([]string{
			"package clean",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {",
			"\tif Value() != 11 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"broken/value.go": "package broken\nfunc Value() int { return 12 }\n",
		"broken/value_test.go": strings.Join([]string{
			"package broken",
			"",
			"import \"testing\"",
			"",
			"func TestBroken(t *testing.T) {",
			"\tMissing()",
			"}",
			"",
		}, "\n"),
		"notests/value.go": "package notests\nfunc Value() int { return 13 }\n",
	})

	// Run the fixture's tests.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run mixed package tests: %v", err)
	}

	// Only the package with the load error fails.
	clean := requirePackageResult(t, result, "example.test/mixed/clean")
	if clean.Action != ActionPass {
		t.Fatalf("clean package should pass independently: %#v", clean)
	}
	broken := requirePackageResult(t, result, "example.test/mixed/broken")
	if broken.Action != ActionFail || broken.Owner != OwnerPackageGraph {
		t.Fatalf("broken package should carry package graph failure: %#v", broken)
	}
	if broken.Phases.Compile != PhaseStatusFail {
		t.Fatalf("broken package should carry compile phase failure: %#v", broken)
	}
	if !strings.Contains(broken.Error, "Missing") {
		t.Fatalf("broken package error should preserve load diagnostic: %#v", broken)
	}
	noTests := requirePackageResult(t, result, "example.test/mixed/notests")
	if noTests.Action != ActionSkip {
		t.Fatalf("no-test package should stay skipped: %#v", noTests)
	}
}

func TestRunnerCompilesAddressOfDereferencePackage(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/mixedcompile\n\ngo 1.25.3\n",
		"clean/value.go": strings.Join([]string{
			"package clean",
			"",
			"func Value() int { return 11 }",
			"",
		}, "\n"),
		"clean/value_test.go": strings.Join([]string{
			"package clean",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {",
			"\tif Value() != 11 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"broken/value.go": strings.Join([]string{
			"package broken",
			"",
			"func Value() int {",
			"\tx := 1",
			"\tp := &x",
			"\t_ = &(*p)",
			"\treturn x",
			"}",
			"",
		}, "\n"),
		"broken/value_test.go": strings.Join([]string{
			"package broken",
			"",
			"import \"testing\"",
			"",
			"func TestBroken(t *testing.T) {",
			"\tif Value() == 0 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	// Run the fixture's tests.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run mixed compile test: %v", err)
	}

	// Both packages compile and pass.
	clean := requirePackageResult(t, result, "example.test/mixedcompile/clean")
	if clean.Action != ActionPass {
		t.Fatalf("clean package should pass independently: %#v", clean)
	}
	broken := requirePackageResult(t, result, "example.test/mixedcompile/broken")
	if broken.Action != ActionPass {
		t.Fatalf("address-of-dereference package should pass: %#v", broken)
	}
}

func TestRunnerSharesOneProgramAfterCompileFailure(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/sharedprogram\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"",
			"type Getter interface{ Get() int }",
			"",
			"func Read(g Getter) int { return g.Get() }",
			"",
		}, "\n"),
		"async/value.go": "package async\n",
		"async/value_test.go": strings.Join([]string{
			"package async",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\t\"example.test/sharedprogram/dep\"",
			")",
			"",
			"type chanGetter struct{ ch chan int }",
			"",
			"func (g chanGetter) Get() int { return <-g.ch }",
			"",
			"func TestRead(t *testing.T) {",
			"\tch := make(chan int, 1)",
			"\tch <- 3",
			"\tif dep.Read(chanGetter{ch: ch}) != 3 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"broken/value.go": "package broken\n",
		"broken/value_test.go": strings.Join([]string{
			"package broken",
			"",
			"import \"testing\"",
			"",
			"func makeSlice[T ~[]int]() T { return make(T, 1) }",
			"",
			"func TestBroken(t *testing.T) {",
			"\tif len(makeSlice[[]int]()) != 1 {",
			"\t\tt.Fatal(\"bad length\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"sync/value.go": "package sync\n",
		"sync/value_test.go": strings.Join([]string{
			"package sync",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\t\"example.test/sharedprogram/dep\"",
			")",
			"",
			"type fixedGetter struct{}",
			"",
			"func (fixedGetter) Get() int { return 4 }",
			"",
			"func TestRead(t *testing.T) {",
			"\tif dep.Read(fixedGetter{}) != 4 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	// Run all three packages, so the broken one fails the first batch.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run shared program test: %v", err)
	}

	// The async package colors dep.Read async, so the sync package must
	// await it too: both packages run against the same program.
	for _, path := range []string{"example.test/sharedprogram/async", "example.test/sharedprogram/sync"} {
		if pkg := requirePackageResult(t, result, path); pkg.Action != ActionPass {
			t.Fatalf("%s should pass in the shared program: %#v", path, pkg)
		}
	}

	// The broken package keeps its own compile failure.
	broken := requirePackageResult(t, result, "example.test/sharedprogram/broken")
	if broken.Action != ActionFail || broken.Phases.Compile != PhaseStatusFail {
		t.Fatalf("broken package should carry its compile failure: %#v", broken)
	}
}

func TestRunnerDoesNotCompileDependencyTests(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/deptest\n\ngo 1.25.3\n",
		"dep/value.go": strings.Join([]string{
			"package dep",
			"",
			"func Value() int { return 11 }",
			"",
		}, "\n"),
		"dep/value_test.go": strings.Join([]string{
			"package dep",
			"",
			"import \"testing\"",
			"",
			"func TestDependencyOnly(t *testing.T) {",
			"Loop:",
			"\tfor {",
			"\t\tbreak Loop",
			"\t}",
			"}",
			"",
		}, "\n"),
		"app/value.go": strings.Join([]string{
			"package app",
			"",
			"import \"example.test/deptest/dep\"",
			"",
			"func Value() int { return dep.Value() }",
			"",
		}, "\n"),
		"app/value_test.go": strings.Join([]string{
			"package app",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {",
			"\tif Value() != 11 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	// Run only the app package.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./app"},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run dependency test isolation fixture: %v", err)
	}

	// The dependency's own tests stay out of the run.
	app := requirePackageResult(t, result, "example.test/deptest/app")
	if app.Action != ActionPass {
		t.Fatalf("package under test should ignore dependency-only tests: %#v", app)
	}
}

func TestRunnerScopesPackageTypecheckErrors(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/mixedtypecheck\n\ngo 1.25.3\n",
		"clean/value.go": strings.Join([]string{
			"package clean",
			"",
			"func Value() int { return 11 }",
			"",
		}, "\n"),
		"clean/value_test.go": strings.Join([]string{
			"package clean",
			"",
			"import \"testing\"",
			"",
			"func TestValue(t *testing.T) {",
			"\tif Value() != 11 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"bad/value.go": strings.Join([]string{
			"package bad",
			"",
			"func Value() int { return 12 }",
			"",
		}, "\n"),
		"bad/value_test.go": strings.Join([]string{
			"package bad",
			"",
			"import \"testing\"",
			"",
			"func TestBad(t *testing.T) {",
			"\tif Value() != 12 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsrs"), strings.Join([]string{
		"#!/bin/sh",
		"project=",
		"while [ \"$#\" -gt 0 ]; do",
		"\tif [ \"$1\" = \"--project\" ]; then",
		"\t\tshift",
		"\t\tproject=\"$1\"",
		"\tfi",
		"\tshift || break",
		"done",
		"if [ \"$project\" = \"tsconfig.json\" ]; then",
		"\tif grep -q 'example.test/mixedtypecheck/bad' runner-*.ts; then",
		"\t\techo 'TypeScript TS9000: bad package'",
		"\t\texit 1",
		"\tfi",
		"\texit 0",
		"fi",
		"runner=$(sed -n 's/.*\"\\(runner-[0-9][0-9]*\\.ts\\)\".*/\\1/p' \"$project\" | head -n 1)",
		"if grep -q 'example.test/mixedtypecheck/bad' \"$runner\"; then",
		"\techo 'TypeScript TS9000: bad package'",
		"\texit 1",
		"fi",
		"exit 0",
		"",
	}, "\n"))
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "bun"), strings.Join([]string{
		"#!/bin/sh",
		"exit 0",
		"",
	}, "\n"))

	// Run the fixture's tests.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run mixed typecheck test: %v", err)
	}

	// Only the package with the type error fails.
	clean := requirePackageResult(t, result, "example.test/mixedtypecheck/clean")
	if clean.Action != ActionPass {
		t.Fatalf("clean package should pass independently: %#v", clean)
	}
	bad := requirePackageResult(t, result, "example.test/mixedtypecheck/bad")
	if bad.Action != ActionFail || bad.Owner != OwnerTypeScriptEmitter {
		t.Fatalf("bad package should carry typecheck failure: %#v", bad)
	}
	if !strings.Contains(bad.Error, "TS9000") {
		t.Fatalf("bad package error should preserve typecheck output: %#v", bad)
	}
}

func TestRunnerDoesNotRepeatSharedOverrideTypecheckFailure(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/sharedoverride\n\ngo 1.25.3\n",
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, "work")
	projectLog := filepath.Join(moduleDir, "projects.log")
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsrs"), strings.Join([]string{
		"#!/bin/sh",
		"project=",
		"while [ \"$#\" -gt 0 ]; do",
		"\tif [ \"$1\" = \"--project\" ]; then",
		"\t\tshift",
		"\t\tproject=\"$1\"",
		"\tfi",
		"\tshift || break",
		"done",
		"printf '%s\\n' \"$project\" >> " + strconv.Quote(projectLog),
		"echo 'output/@goscript/example.test/override/index.ts(1,1): error TS2305: Module has no exported member Thing'",
		"exit 1",
		"",
	}, "\n"))
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "bun"), strings.Join([]string{
		"#!/bin/sh",
		"exit 0",
		"",
	}, "\n"))

	// Run the fixture's tests.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"./..."},
		Timeout:  30 * time.Second,
		WorkDir:  workDir,
	})
	if err != nil {
		t.Fatalf("run shared override typecheck fixture: %v", err)
	}

	// Each package reports the shared override failure once.
	one := requirePackageResult(t, result, "example.test/sharedoverride/one")
	two := requirePackageResult(t, result, "example.test/sharedoverride/two")
	for _, pkg := range []PackageResult{one, two} {
		if pkg.Action != ActionFail || pkg.Owner != OwnerOverridePackage {
			t.Fatalf("package should carry aggregate override failure: %#v", pkg)
		}
		if pkg.Phases.TypeCheck != PhaseStatusFail || pkg.Phases.Runtime != PhaseStatusSkip {
			t.Fatalf("package should fail at aggregate typecheck without runtime: %#v", pkg)
		}
	}
	data, err := os.ReadFile(projectLog)
	if err != nil {
		t.Fatalf("read project log: %v", err)
	}
	projects := strings.Fields(string(data))
	if len(projects) != 1 || projects[0] != "tsconfig.json" {
		t.Fatalf("expected only aggregate typecheck, got:\n%s", data)
	}
}

func TestRunnerUsesBatchTypeScriptProject(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/packageprojects\n\ngo 1.25.3\n",
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, ".tmp", "package-projects")
	projectLog := filepath.Join(moduleDir, "projects.log")
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsrs"), strings.Join([]string{
		"#!/bin/sh",
		"project=",
		"while [ \"$#\" -gt 0 ]; do",
		"\tif [ \"$1\" = \"--project\" ]; then",
		"\t\tshift",
		"\t\tproject=\"$1\"",
		"\tfi",
		"\tshift || break",
		"done",
		"printf '%s\\n' \"$project\" >> " + strconv.Quote(projectLog),
		"exit 0",
		"",
	}, "\n"))
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "bun"), strings.Join([]string{
		"#!/bin/sh",
		"exit 0",
		"",
	}, "\n"))

	// Run the fixture's tests.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:         moduleDir,
		Patterns:    []string{"./..."},
		Timeout:     30 * time.Second,
		WorkDir:     workDir,
		Parallelism: 2,
	})
	if err != nil {
		t.Fatalf("run package projects fixture: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package projects fixture to pass: %#v", result.Packages)
	}
	data, err := os.ReadFile(projectLog)
	if err != nil {
		t.Fatalf("read project log: %v", err)
	}
	projects := string(data)
	if strings.TrimSpace(projects) != "tsconfig.json" {
		t.Fatalf("expected aggregate tsconfig project, got:\n%s", projects)
	}
}

func TestRunnerRunsCombinedRuntimeChunks(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/runtimechunks\n\ngo 1.25.3\n",
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, ".tmp", "runtime-chunks")
	runtimeLog := filepath.Join(moduleDir, "runtime.log")
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsrs"), strings.Join([]string{
		"#!/bin/sh",
		"exit 0",
		"",
	}, "\n"))
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "bun"), strings.Join([]string{
		"#!/bin/sh",
		"runner=\"$1\"",
		"printf '%s\\n' \"$runner\" >> " + strconv.Quote(runtimeLog),
		"case \"$runner\" in",
		"runner-all-*)",
		"\tsed -n 's/.*await __goscriptRunPackage(\"\\([^\"]*\\)\".*/\\1/p' \"$runner\" | while IFS= read -r pkg; do",
		"\t\tprintf '" + combinedRuntimeResultPrefix + "%s\\t1\\t1\\t\\n' \"$pkg\"",
		"\tdone",
		"\texit 0",
		"\t;;",
		"*)",
		"\texit 1",
		"\t;;",
		"esac",
		"",
	}, "\n"))

	// Run the fixture's tests.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:           moduleDir,
		Patterns:      []string{"./..."},
		Timeout:       30 * time.Second,
		WorkDir:       workDir,
		Parallelism:   2,
		RuntimeGroups: true,
	})
	if err != nil {
		t.Fatalf("run runtime chunks fixture: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected runtime chunks fixture to pass: %#v", result.Packages)
	}
	data, err := os.ReadFile(runtimeLog)
	if err != nil {
		t.Fatalf("read runtime log: %v", err)
	}
	runners := strings.Fields(string(data))
	slices.Sort(runners)
	if strings.Join(runners, "\n") != "runner-all-0.ts\nrunner-all-1.ts" {
		t.Fatalf("expected chunked combined runners, got:\n%s", data)
	}
}

func TestRunnerRunsBrowserRuntimeBackend(t *testing.T) {
	// Report browser results with the terminal styles emitted by Vitest.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/browser\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package browser",
			"",
			"import \"testing\"",
			"",
			"func TestBrowser(t *testing.T) {}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, ".tmp", "browser-runtime")
	writeBrowserTestPackages(t, moduleDir)
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "vitest"), strings.Join([]string{
		"#!/bin/sh",
		"printf '\\033[22m\\033[39m" + combinedRuntimeResultPrefix + "example.test%%2Fbrowser\\t1\\t7\\tbrowser%%20ok\\n'",
		"exit 0",
		"",
	}, "\n"))

	// Run through the production runner and verify its package result.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:            moduleDir,
		Patterns:       []string{"."},
		Timeout:        30 * time.Second,
		WorkDir:        workDir,
		RuntimeBackend: RuntimeBackendBrowser,
	})
	if err != nil {
		t.Fatalf("run browser runtime fixture: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected browser runtime fixture to pass: %#v", result.Packages)
	}
	if got := result.Packages[0].Output; got != "browser ok" {
		t.Fatalf("expected browser runtime output, got %q", got)
	}
	config, err := os.ReadFile(filepath.Join(workDir, "vitest-browser-0.config.mts"))
	if err != nil {
		t.Fatalf("read browser vitest config: %v", err)
	}
	if !strings.Contains(string(config), "browser: \"chromium\"") {
		t.Fatalf("expected Chromium browser config, got:\n%s", config)
	}
}

func TestRunnerReportsBrowserRuntimeFailureRecord(t *testing.T) {
	// Report browser results with the terminal styles emitted by Vitest.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/browserfail\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package browserfail",
			"",
			"import \"testing\"",
			"",
			"func TestBrowser(t *testing.T) {}",
			"",
		}, "\n"),
	})
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsrs"), "#!/bin/sh\nexit 0\n")
	writeBrowserTestPackages(t, moduleDir)
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "vitest"), strings.Join([]string{
		"#!/bin/sh",
		"printf '\\033[22m\\033[39m" + combinedRuntimeResultPrefix + "example.test%%2Fbrowserfail\\t0\\t3\\tpage%%20exploded\\n'",
		"exit 1",
		"",
	}, "\n"))

	// Run through the production runner and verify its package result.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:            moduleDir,
		Patterns:       []string{"."},
		Timeout:        30 * time.Second,
		RuntimeBackend: RuntimeBackendBrowser,
	})
	if err != nil {
		t.Fatalf("run browser failure fixture: %v", err)
	}
	if result.Passed() {
		t.Fatalf("expected browser runtime failure")
	}
	pkg := requirePackageResult(t, result, "example.test/browserfail")
	if pkg.Action != ActionFail || pkg.Phases.Runtime != PhaseStatusFail || pkg.Error != "page exploded" {
		t.Fatalf("unexpected browser failure result: %#v", pkg)
	}
}

func TestBrowserVitestConfigLaunchOptions(t *testing.T) {
	// Without launch options the provider keeps its defaults.
	config := renderBrowserVitestConfig(&normalizedRequest{OutputRoot: "/out"}, "runner-0.ts", "/src/pkg")
	if !strings.Contains(config, "provider: playwright(),") {
		t.Fatalf("expected default playwright provider, got:\n%s", config)
	}

	// A channel and arguments render as Playwright launch options.
	config = renderBrowserVitestConfig(&normalizedRequest{
		BrowserChannel: "chrome",
		BrowserArgs:    []string{"--enable-unsafe-webgpu", "--use-angle=metal"},
		OutputRoot:     "/out",
	}, "runner-0.ts", "/src/pkg")
	want := `provider: playwright({ launchOptions: { channel: "chrome", args: ["--enable-unsafe-webgpu", "--use-angle=metal"] } }),`
	if !strings.Contains(config, want) {
		t.Fatalf("expected %q in config, got:\n%s", want, config)
	}
}

func TestBrowserVitestConfigHostFS(t *testing.T) {
	// The host filesystem command resolves paths in the package directory.
	config := renderBrowserVitestConfig(&normalizedRequest{OutputRoot: "/out"}, "runner-0.ts", "/src/pkg")
	for _, want := range []string{
		`import { hostFS } from "./goscript-browser-hostfs.mts"`,
		`commands: { goscriptHostFS: hostFS("/src/pkg") },`,
	} {
		if !strings.Contains(config, want) {
			t.Fatalf("expected %q in config, got:\n%s", want, config)
		}
	}
}

func TestBrowserVitestConfigAPIHost(t *testing.T) {
	// The browser API server listens on, and the page opens, 127.0.0.1.
	config := renderBrowserVitestConfig(&normalizedRequest{OutputRoot: "/out"}, "runner-0.ts", "/src/pkg")
	want := `api: { host: "127.0.0.1" },`
	if !strings.Contains(config, want) {
		t.Fatalf("expected %q in config, got:\n%s", want, config)
	}
}

func TestParseCombinedRuntimeRecordsLineProtocol(t *testing.T) {
	// Parse output that mixes ordinary lines with result records.
	records, ok := parseCombinedRuntimeRecords(strings.Join([]string{
		"ordinary output",
		combinedRuntimeResultPrefix + "example.test%2Fpkg\t1\t42\tline%201%0Aline%202%09tail",
		"",
	}, "\n"))
	if !ok {
		t.Fatal("expected combined runtime record")
	}
	if len(records) != 1 {
		t.Fatalf("expected one combined runtime record, got %#v", records)
	}
	record := records[0]
	if record.PackagePath != "example.test/pkg" {
		t.Fatalf("unexpected package path: %q", record.PackagePath)
	}
	if !record.OK {
		t.Fatal("expected passing runtime record")
	}
	if record.ElapsedMS != 42 {
		t.Fatalf("unexpected elapsed ms: %d", record.ElapsedMS)
	}
	if record.Output != "line 1\nline 2\ttail" {
		t.Fatalf("unexpected output: %q", record.Output)
	}
}

func TestRunnerReportsBrowserRuntimeMissingResult(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/browsermissing\n\ngo 1.25.3\n",
		"value_test.go": strings.Join([]string{
			"package browsermissing",
			"",
			"import \"testing\"",
			"",
			"func TestBrowser(t *testing.T) {}",
			"",
		}, "\n"),
	})
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsrs"), "#!/bin/sh\nexit 0\n")
	writeBrowserTestPackages(t, moduleDir)
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "vitest"), strings.Join([]string{
		"#!/bin/sh",
		"printf 'page exploded before result\\n'",
		"exit 1",
		"",
	}, "\n"))

	// Run in the browser backend.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:            moduleDir,
		Patterns:       []string{"."},
		Timeout:        30 * time.Second,
		RuntimeBackend: RuntimeBackendBrowser,
	})
	if err != nil {
		t.Fatalf("run browser missing-result fixture: %v", err)
	}
	if result.Passed() {
		t.Fatalf("expected browser runtime failure")
	}
	pkg := requirePackageResult(t, result, "example.test/browsermissing")
	if pkg.Action != ActionFail || pkg.Phases.Runtime != PhaseStatusFail {
		t.Fatalf("unexpected browser missing-result status: %#v", pkg)
	}
	if !strings.Contains(pkg.Error, "page exploded before result") {
		t.Fatalf("expected browser process output in error, got %#v", pkg)
	}
}

func TestRunnerFallsBackToPackageScopedTypeScriptProjects(t *testing.T) {
	// Write the fixture module.
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/packageprojects\n\ngo 1.25.3\n",
		"one/value.go": strings.Join([]string{
			"package one",
			"",
			"func Value() int { return 1 }",
			"",
		}, "\n"),
		"one/value_test.go": strings.Join([]string{
			"package one",
			"",
			"import \"testing\"",
			"",
			"func TestOne(t *testing.T) {",
			"\tif Value() != 1 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
		"two/value.go": strings.Join([]string{
			"package two",
			"",
			"func Value() int { return 2 }",
			"",
		}, "\n"),
		"two/value_test.go": strings.Join([]string{
			"package two",
			"",
			"import \"testing\"",
			"",
			"func TestTwo(t *testing.T) {",
			"\tif Value() != 2 {",
			"\t\tt.Fatal(\"bad value\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})
	workDir := filepath.Join(moduleDir, ".tmp", "package-projects")
	projectLog := filepath.Join(moduleDir, "projects.log")
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "tsrs"), strings.Join([]string{
		"#!/bin/sh",
		"project=",
		"while [ \"$#\" -gt 0 ]; do",
		"\tif [ \"$1\" = \"--project\" ]; then",
		"\t\tshift",
		"\t\tproject=\"$1\"",
		"\tfi",
		"\tshift || break",
		"done",
		"printf '%s\\n' \"$project\" >> " + strconv.Quote(projectLog),
		"if [ \"$project\" = \"tsconfig.json\" ]; then",
		"\texit 1",
		"fi",
		"exit 0",
		"",
	}, "\n"))
	writeExecutable(t, filepath.Join(moduleDir, "node_modules", ".bin", "bun"), strings.Join([]string{
		"#!/bin/sh",
		"exit 0",
		"",
	}, "\n"))

	// Run the fixture's tests.
	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:         moduleDir,
		Patterns:    []string{"./..."},
		Timeout:     30 * time.Second,
		WorkDir:     workDir,
		Parallelism: 2,
	})
	if err != nil {
		t.Fatalf("run package projects fixture: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package projects fixture to pass: %#v", result.Packages)
	}
	data, err := os.ReadFile(projectLog)
	if err != nil {
		t.Fatalf("read project log: %v", err)
	}
	projects := string(data)
	if !strings.Contains(projects, "tsconfig.json") ||
		!strings.Contains(projects, "tsconfig-0.json") ||
		!strings.Contains(projects, "tsconfig-1.json") {
		t.Fatalf("expected aggregate project and package-scoped fallback, got:\n%s", projects)
	}
}

func TestDefaultParallelismCapsAtEight(t *testing.T) {
	previous := runtime.GOMAXPROCS(16)
	t.Cleanup(func() { runtime.GOMAXPROCS(previous) })

	if got := DefaultParallelism(); got != 8 {
		t.Fatalf("expected default parallelism cap 8, got %d", got)
	}
}

func TestNormalizeKeepsIncrementalTypeCheckExplicit(t *testing.T) {
	// A work directory alone leaves incremental type checking off.
	norm, err := (&Request{
		Patterns: []string{"./..."},
		WorkDir:  t.TempDir(),
	}).normalize()
	if err != nil {
		t.Fatalf("normalize request: %v", err)
	}
	if norm.IncrementalTypeCheck {
		t.Fatalf("expected explicit workdir alone to skip incremental typecheck cache")
	}

	// The request enables it explicitly.
	norm, err = (&Request{
		Patterns:             []string{"./..."},
		IncrementalTypeCheck: true,
	}).normalize()
	if err != nil {
		t.Fatalf("normalize incremental request: %v", err)
	}
	if !norm.IncrementalTypeCheck {
		t.Fatalf("expected incremental flag to enable typecheck cache")
	}
}

func TestNormalizeRuntimeBackend(t *testing.T) {
	// The default backend is bun.
	norm, err := (&Request{Patterns: []string{"."}}).normalize()
	if err != nil {
		t.Fatalf("normalize default runtime backend: %v", err)
	}
	if norm.RuntimeBackend != RuntimeBackendBun {
		t.Fatalf("runtime backend = %q, want %q", norm.RuntimeBackend, RuntimeBackendBun)
	}

	// The browser backend is accepted.
	norm, err = (&Request{
		Patterns:       []string{"."},
		RuntimeBackend: RuntimeBackendBrowser,
	}).normalize()
	if err != nil {
		t.Fatalf("normalize browser runtime backend: %v", err)
	}
	if norm.RuntimeBackend != RuntimeBackendBrowser {
		t.Fatalf("runtime backend = %q, want %q", norm.RuntimeBackend, RuntimeBackendBrowser)
	}

	// An unknown backend is rejected.
	if _, err := (&Request{
		Patterns:       []string{"."},
		RuntimeBackend: RuntimeBackend("deno"),
	}).normalize(); err == nil {
		t.Fatal("expected unsupported runtime backend to fail")
	}
}

func TestPackageExecutionIndexesPrioritizesLargerTestPackages(t *testing.T) {
	result := &Result{Packages: []PackageResult{
		{
			PackagePath: "example.test/small",
			Tests:       []Test{{Name: "TestSmall"}},
		},
		{
			PackagePath: "example.test/large",
			Tests: []Test{
				{Name: "TestLargeA"},
				{Name: "TestLargeB"},
				{Name: "TestLargeC"},
			},
		},
		{
			PackagePath: "example.test/medium-b",
			Tests: []Test{
				{Name: "TestMediumB1"},
				{Name: "TestMediumB2"},
			},
		},
		{
			PackagePath: "example.test/medium-a",
			Tests: []Test{
				{Name: "TestMediumA1"},
				{Name: "TestMediumA2"},
			},
		},
	}}

	got := packageExecutionIndexes(result, []int{0, 1, 2, 3})
	want := []int{1, 3, 2, 0}
	if !slices.Equal(got, want) {
		t.Fatalf("expected execution indexes %v, got %v", want, got)
	}
}

func TestRenderRunnerChangesToPackageSourceDir(t *testing.T) {
	req := &normalizedRequest{}
	runner := renderRunner(PackageResult{
		PackagePath: "example.test/pkg",
		SourceDir:   "/workspace/pkg",
		Tests: []Test{{
			Name:        "TestCwd",
			PackagePath: "example.test/pkg",
		}},
	}, req)

	if !strings.Contains(runner, "process.chdir(\"/workspace/pkg\")") {
		t.Fatalf("expected runner to chdir to package source dir: %s", runner)
	}
	if !strings.Contains(runner, "await runTests(\"example.test/pkg\"") {
		t.Fatalf("expected runner to execute package tests: %s", runner)
	}
}

func TestRenderBrowserRunnerAvoidsProcessAPIs(t *testing.T) {
	// Render a browser runner for one package.
	req := &normalizedRequest{
		RuntimeBackend: RuntimeBackendBrowser,
	}
	runner := renderPackageRunner(PackageResult{
		PackagePath: "example.test/pkg",
		SourceDir:   "/workspace/pkg",
		Tests: []Test{{
			Name:        "TestBrowser",
			PackagePath: "example.test/pkg",
		}},
	}, req)

	// The runner imports vitest and never touches process.
	if strings.Contains(runner, "process.") {
		t.Fatalf("browser runner should not use process APIs: %s", runner)
	}
	if !strings.Contains(runner, "import { test } from \"vitest\"") {
		t.Fatalf("expected browser runner to use Vitest: %s", runner)
	}
	if !strings.Contains(runner, "await runTests(\"example.test/pkg\"") {
		t.Fatalf("expected browser runner to execute package tests: %s", runner)
	}
}

func TestRenderBrowserRunnerReportsProcessExit(t *testing.T) {
	// Render a browser runner for one package.
	req := &normalizedRequest{
		RuntimeBackend: RuntimeBackendBrowser,
	}
	runner := renderPackageRunner(PackageResult{
		PackagePath: "example.test/pkg",
		SourceDir:   "/workspace/pkg",
		Tests: []Test{{
			Name:        "TestBrowser",
			PackagePath: "example.test/pkg",
		}},
	}, req)

	// The runner reports a process exit as a failure.
	if !strings.Contains(runner, "__goscriptProcessExitCode") {
		t.Fatalf("expected browser runner to classify process exit: %s", runner)
	}
	if !strings.Contains(runner, "goscript process exited with code") {
		t.Fatalf("expected browser runner to report process exit code: %s", runner)
	}
	if !strings.Contains(runner, "__goscriptOK = exitCode === 0") {
		t.Fatalf("expected zero exit to pass and nonzero exit to fail: %s", runner)
	}
}

func TestRenderBrowserRunnerHonorsPanicOnExitZero(t *testing.T) {
	req := &normalizedRequest{
		RuntimeBackend: RuntimeBackendBrowser,
		PanicOnExit0:   true,
	}
	runner := renderPackageRunner(PackageResult{
		PackagePath: "example.test/pkg",
		SourceDir:   "/workspace/pkg",
		Tests: []Test{{
			Name:        "TestBrowser",
			PackagePath: "example.test/pkg",
		}},
	}, req)

	if !strings.Contains(runner, "exitCode === 0 && true") {
		t.Fatalf("expected panic-on-exit-zero to reject os.Exit(0): %s", runner)
	}
	if !strings.Contains(runner, "unexpected os.Exit(0) during test") {
		t.Fatalf("expected panic-on-exit-zero error text: %s", runner)
	}
}

func TestRenderCombinedRunnerChangesToEachPackageSourceDir(t *testing.T) {
	// Render a combined runner for two packages.
	req := &normalizedRequest{}
	runner := renderCombinedRunner(&Result{Packages: []PackageResult{
		{
			PackagePath: "example.test/one",
			SourceDir:   "/workspace/one",
			Tests: []Test{{
				Name:        "TestOne",
				PackagePath: "example.test/one",
			}},
		},
		{
			PackagePath: "example.test/two",
			SourceDir:   "/workspace/two",
			Tests: []Test{{
				Name:        "TestTwo",
				PackagePath: "example.test/two",
			}},
		},
	}}, []int{0, 1}, req)

	// Each package runs in its own source directory.
	if !strings.Contains(runner, "await __goscriptRunPackage(\"example.test/one\", \"/workspace/one\"") {
		t.Fatalf("expected combined runner to pass first package source dir: %s", runner)
	}
	if !strings.Contains(runner, "await __goscriptRunPackage(\"example.test/two\", \"/workspace/two\"") {
		t.Fatalf("expected combined runner to pass second package source dir: %s", runner)
	}
	if !strings.Contains(runner, "process.chdir(packageDir)") {
		t.Fatalf("expected combined runner to chdir before each package: %s", runner)
	}
}

func TestRenderTypeScriptProjectDisablesAmbientTypePackages(t *testing.T) {
	// Render a package project.
	req := &normalizedRequest{
		WorkDir:    "/work",
		OutputRoot: "/work/output",
	}

	// The project disables ambient type packages.
	tsconfig := renderTypeScriptProject(req, "runner-0.ts", "tsconfig-0.json", false)
	if !strings.Contains(tsconfig, "\"types\": []") {
		t.Fatalf("expected generated tsconfig to disable ambient @types packages: %s", tsconfig)
	}
	if !strings.Contains(tsconfig, "\"goscript-node.d.ts\"") {
		t.Fatalf("expected generated tsconfig to include GoScript node ambient declarations: %s", tsconfig)
	}
	if strings.Contains(tsconfig, "\"incremental\": true") || strings.Contains(tsconfig, "\"tsBuildInfoFile\"") {
		t.Fatalf("expected generated tsconfig to keep one-shot typecheck by default: %s", tsconfig)
	}
	if strings.Contains(tsconfig, "output/**/*.ts") {
		t.Fatalf("expected generated tsconfig to typecheck from runner roots, not output globs: %s", tsconfig)
	}
}

func TestRenderBrowserTypeScriptProjectsExcludeNodeAmbientDeclarations(t *testing.T) {
	// Render the projects for the browser backend.
	req := &normalizedRequest{
		WorkDir:        "/work",
		OutputRoot:     "/work/output",
		RuntimeBackend: RuntimeBackendBrowser,
	}

	// The package project leaves out the node declarations.
	packageTSConfig := renderTypeScriptProject(req, "runner-0.ts", "tsconfig-0.json", false)
	if strings.Contains(packageTSConfig, "goscript-node.d.ts") {
		t.Fatalf("browser package tsconfig should not include node ambient declarations: %s", packageTSConfig)
	}
	if !strings.Contains(packageTSConfig, "goscript-browser.d.ts") {
		t.Fatalf("browser package tsconfig should include browser ambient declarations: %s", packageTSConfig)
	}

	// The aggregate project leaves them out too.
	aggregateTSConfig := renderRuntimeTypeScriptProject(req, false)
	if strings.Contains(aggregateTSConfig, "goscript-node.d.ts") {
		t.Fatalf("browser aggregate tsconfig should not include node ambient declarations: %s", aggregateTSConfig)
	}
	if !strings.Contains(aggregateTSConfig, "goscript-browser.d.ts") {
		t.Fatalf("browser aggregate tsconfig should include browser ambient declarations: %s", aggregateTSConfig)
	}
	for _, tsconfig := range []string{packageTSConfig, aggregateTSConfig} {
		if !strings.Contains(tsconfig, `"vitest": ["./goscript-browser.d.ts"]`) {
			t.Fatalf("browser tsconfig must resolve the test API without loading host Vitest declarations: %s", tsconfig)
		}
	}
}

func TestRenderTypeScriptProjectUsesNodeTypesWhenAvailable(t *testing.T) {
	req := &normalizedRequest{
		WorkDir:    "/work",
		OutputRoot: "/work/output",
	}

	tsconfig := renderTypeScriptProject(req, "runner-0.ts", "tsconfig-0.json", true)
	if !strings.Contains(tsconfig, "\"types\": [\"node\"]") {
		t.Fatalf("expected generated tsconfig to opt into node types: %s", tsconfig)
	}
}

func TestRenderRuntimeTypeScriptProjectDisablesEmit(t *testing.T) {
	// Render the aggregate project.
	req := &normalizedRequest{
		WorkDir:    "/work",
		OutputRoot: "/work/output",
	}

	// The aggregate project only type-checks.
	tsconfig := renderRuntimeTypeScriptProject(req, false)
	if !strings.Contains(tsconfig, "\"noEmit\": true") {
		t.Fatalf("expected aggregate tsconfig to disable emit: %s", tsconfig)
	}
	if strings.Contains(tsconfig, "\"incremental\": true") || strings.Contains(tsconfig, "\"tsBuildInfoFile\"") {
		t.Fatalf("expected aggregate tsconfig to keep one-shot typecheck by default: %s", tsconfig)
	}
	if !strings.Contains(tsconfig, "\"runner-*.ts\"") {
		t.Fatalf("expected aggregate tsconfig to typecheck generated runner roots: %s", tsconfig)
	}
	if !strings.Contains(tsconfig, "./output/@goscript/*") {
		t.Fatalf("expected aggregate tsconfig path aliases to reference output root: %s", tsconfig)
	}
	if strings.Contains(tsconfig, "output/**/*.ts") {
		t.Fatalf("expected aggregate tsconfig to typecheck from runner roots, not output globs: %s", tsconfig)
	}
}

func TestMaterializeRuntimeModuleShimsReexportsGeneratedTypeScript(t *testing.T) {
	// Write generated TypeScript for the runtime packages.
	workDir := t.TempDir()
	outputRoot := filepath.Join(workDir, "output")
	for _, name := range []string{
		"errors/index.ts",
		"github.com/s4wave/spacewave/core/plugin/space/config.gs.ts",
	} {
		path := filepath.Join(outputRoot, "@goscript", filepath.FromSlash(name))
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatalf("create output parent: %v", err)
		}
		if err := os.WriteFile(path, []byte("export const value = 1\n"), 0o644); err != nil {
			t.Fatalf("write output file: %v", err)
		}
	}

	// Materialize the module shims over it.
	req := &normalizedRequest{
		WorkDir:        workDir,
		OutputRoot:     outputRoot,
		RuntimeBackend: RuntimeBackendBun,
	}
	phase := materializeRuntimeModuleShims(req)
	if phase.Failed() {
		t.Fatalf("materialize shims: %s", phase.Error)
	}
	for _, root := range []string{workDir, outputRoot} {
		for _, name := range []string{
			"errors/index.js",
			"github.com/s4wave/spacewave/core/plugin/space/config.gs.js",
		} {
			path := filepath.Join(root, "node_modules", "@goscript", filepath.FromSlash(name))
			data, err := os.ReadFile(path)
			if err != nil {
				t.Fatalf("read shim %s: %v", name, err)
			}
			text := string(data)
			if !strings.Contains(text, ".ts\"") {
				t.Fatalf("shim should re-export generated TypeScript: %s", text)
			}
			if strings.Contains(text, workDir) {
				t.Fatalf("shim should use a portable relative import, got: %s", text)
			}
		}
	}
}

func TestRenderTypeScriptProjectsCanUseIncrementalBuildInfo(t *testing.T) {
	// Enable incremental type checking.
	req := &normalizedRequest{
		WorkDir:              "/work",
		OutputRoot:           "/work/output",
		IncrementalTypeCheck: true,
	}

	// The package project keeps its build info.
	packageTSConfig := renderTypeScriptProject(req, "runner-0.ts", "tsconfig-0.json", false)
	if !strings.Contains(packageTSConfig, "\"incremental\": true") ||
		!strings.Contains(packageTSConfig, "\"tsBuildInfoFile\": \".goscript/tsconfig-0.tsbuildinfo\"") {
		t.Fatalf("expected package tsconfig to cache package typecheck state: %s", packageTSConfig)
	}

	// The aggregate project keeps its own build info.
	aggregateTSConfig := renderRuntimeTypeScriptProject(req, false)
	if !strings.Contains(aggregateTSConfig, "\"incremental\": true") ||
		!strings.Contains(aggregateTSConfig, "\"tsBuildInfoFile\": \".goscript/tsconfig.tsbuildinfo\"") {
		t.Fatalf("expected aggregate tsconfig to cache typecheck state: %s", aggregateTSConfig)
	}
}

func requirePackageResult(t *testing.T, result *Result, packagePath string) PackageResult {
	t.Helper()

	if result != nil {
		for _, pkg := range result.Packages {
			if pkg.PackagePath == packagePath {
				return pkg
			}
		}
	}
	t.Fatalf("missing package result %q in %#v", packagePath, result)
	return PackageResult{}
}

func writeFixture(t *testing.T, files map[string]string) string {
	t.Helper()

	dir := t.TempDir()
	for name, contents := range files {
		path := filepath.Join(dir, name)
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatal(err.Error())
		}
		if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
			t.Fatal(err.Error())
		}
	}
	return dir
}

// writeBrowserTestPackages writes stub npm packages for the browser test
// dependencies, so that the runner finds them installed.
func writeBrowserTestPackages(t *testing.T, moduleDir string) {
	t.Helper()

	deps, err := goscript.BrowserTestDependencies()
	if err != nil {
		t.Fatal(err.Error())
	}
	for name := range deps {
		dir := filepath.Join(moduleDir, "node_modules", filepath.FromSlash(name))
		if err := os.MkdirAll(dir, 0o755); err != nil {
			t.Fatal(err.Error())
		}
		if err := os.WriteFile(filepath.Join(dir, "package.json"), []byte(`{"name":`+strconv.Quote(name)+`}`), 0o644); err != nil {
			t.Fatal(err.Error())
		}
	}
}

func writeExecutable(t *testing.T, path string, contents string) {
	t.Helper()

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err.Error())
	}
	if err := os.WriteFile(path, []byte(contents), 0o755); err != nil {
		t.Fatal(err.Error())
	}
}

func TestNormalizeKeepsReportAsync(t *testing.T) {
	norm, err := (&Request{Patterns: []string{"."}, ReportAsync: true}).normalize()
	if err != nil {
		t.Fatalf("normalize request: %v", err)
	}
	if !norm.ReportAsync {
		t.Fatal("expected the async report request to be kept")
	}
}
