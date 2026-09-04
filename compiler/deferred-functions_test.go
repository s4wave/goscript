package compiler

import (
	"context"
	"fmt"
	"path/filepath"
	"strings"
	"testing"

	"github.com/s4wave/goscript/compiler/tsworkspace"
)

func TestDeferredFunctionInitializesOnFirstConcurrentUse(t *testing.T) {
	// Build a package graph whose feature package increments state during init.
	dir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/deferred\n\ngo 1.25\n",
		"app.go": `package app
import "example.test/deferred/feature"
func Load() int { return feature.Read() }
func Getter() func() int { return feature.Read }
`,
		"state/state.go": `package state
var count int
func Inc() { count++ }
func Count() int { return count }
`,
		"feature/feature.go": `package feature
import "example.test/deferred/state"
func init() { state.Inc() }
func Read() int { return state.Count() }
`,
	})

	// Compare eager and deferred compilation and execution.
	for _, deferred := range []bool{false, true} {
		t.Run(fmt.Sprintf("deferred=%v", deferred), func(t *testing.T) {
			// Compile the fixture with the selected initialization policy.
			out := filepath.Join(dir, "output")
			config := &Config{Dir: dir, OutputPath: out, CacheRoot: filepath.Join(dir, "cache"), AllDependencies: true}
			if deferred {
				config.DeferredFunctions = []string{"example.test/deferred/feature.Read"}
			}
			comp, err := NewCompiler(config, nil, nil)
			if err != nil {
				t.Fatal(err)
			}
			if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
				t.Fatal(err)
			}

			// Verify that deferred compilation emits only a dynamic feature edge.
			source := readTestFile(t, filepath.Join(out, "@goscript/example.test/deferred/app.gs.ts"))
			if deferred && !strings.Contains(source, `import("@goscript/example.test/deferred/feature/index.js")`) {
				t.Fatalf("expected dynamic feature edge:\n%s", source)
			}
			if deferred && strings.Contains(source, `import "@goscript/example.test/deferred/feature/index.js"`) {
				t.Fatalf("expected dynamic-only feature edge:\n%s", source)
			}

			// Type-check and run concurrent calls against the generated modules.
			writeTestFile(t, dir, "tsconfig.json", `{"compilerOptions":{"paths":{"@goscript/*":["./output/@goscript/*"]},"allowImportingTsExtensions":true,"target":"ESNext","module":"ESNext","moduleResolution":"bundler","strict":true,"skipLibCheck":true,"types":[]}}`)
			initialCount := 1
			if deferred {
				initialCount = 0
			}
			writeTestFile(t, dir, "runner.ts", fmt.Sprintf(`import * as app from './output/@goscript/example.test/deferred/index.js'
import * as state from './output/@goscript/example.test/deferred/state/index.js'
if (state.Count() !== %d) throw Error('feature initialized during startup')
const read = await app.Getter()
if (!read) throw Error("missing function value")
if (state.Count() !== %d) throw Error('taking function value initialized feature')
const values = await Promise.all([app.Load(), app.Load(), read()])
if (values.some(v => v !== 1) || state.Count() !== 1) throw Error('concurrent use initialized feature more than once')
console.log('initialization passed')
`, initialCount, initialCount))
			toolDir, err := filepath.Abs("..")
			if err != nil {
				t.Fatal(err)
			}
			workspace := tsworkspace.NewOwner(dir, toolDir)
			if phase := workspace.EnsureNodeAmbientTypes(); phase.Failed() {
				t.Fatal(phase.Error)
			}
			typecheck := workspace.RunTool(t.Context(), tsworkspace.PhaseTypeCheck, dir, "tsgo", "--noEmit", "--project", "tsconfig.json")
			if typecheck.Failed() {
				t.Fatalf("typecheck: %v\n%s", typecheck.Error, typecheck.Output)
			}

			result := workspace.RunTool(t.Context(), tsworkspace.PhaseRuntime, dir, "bun", "run", "runner.ts")
			if result.Failed() {
				t.Fatalf("deferred runtime: %v\n%s", result.Error, result.Output)
			}
		})
	}
}

func TestDeferredFunctionRejectsEagerReferences(t *testing.T) {
	// Build a graph where an eager value reference prevents deferral.
	dir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/eager\n\ngo 1.25\n",
		"app.go": `package app
import "example.test/eager/feature"
func Load() int { return feature.Value + feature.Read() }
`,
		"feature/feature.go": `package feature
var Value int
func Read() int { return Value }
`,
	})

	// Compile and require the eager-reference diagnostic.
	comp, err := NewCompiler(&Config{Dir: dir, OutputPath: filepath.Join(dir, "out"), AllDependencies: true, DeferredFunctions: []string{"example.test/eager/feature.Read"}}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	_, err = comp.CompilePackages(t.Context(), ".")
	requireDiagnostic(t, err, "goscript/deferred:eager-reference")
}

func TestDeferredFunctionSharesInitializationFailure(t *testing.T) {
	// Build a graph whose deferred package fails during initialization.
	dir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/failure\n\ngo 1.25\n",
		"app.go": `package app
import "example.test/failure/feature"
func Load() int { return feature.Read() }
`,
		"state/state.go": `package state
var Count int
`,
		"feature/feature.go": `package feature
import "example.test/failure/state"
func init() { state.Count++; panic("feature initialization failed") }
func Read() int { return state.Count }
`,
	})

	// Compile the graph with the failing package deferred.
	comp, err := NewCompiler(&Config{Dir: dir, OutputPath: filepath.Join(dir, "output"), AllDependencies: true, DeferredFunctions: []string{"example.test/failure/feature.Read"}}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(t.Context(), "."); err != nil {
		t.Fatal(err)
	}

	// Run repeated calls and verify that the initialization failure is shared.
	writeTestFile(t, dir, "tsconfig.json", `{"compilerOptions":{"paths":{"@goscript/*":["./output/@goscript/*"]}}}`)
	writeTestFile(t, dir, "runner.ts", `import * as app from './output/@goscript/example.test/failure/index.js'
import * as state from './output/@goscript/example.test/failure/state/index.js'
if (state.Count !== 0) throw Error('feature initialized eagerly')
const results = await Promise.allSettled([app.Load(), app.Load()])
const later = await Promise.allSettled([app.Load()])
if ([...results, ...later].some(r => r.status !== 'rejected')) throw Error('initialization failure was lost')
if (state.Count !== 1) throw Error('failed initialization was retried')
`)
	toolDir, err := filepath.Abs("..")
	if err != nil {
		t.Fatal(err)
	}
	result := tsworkspace.NewOwner(dir, toolDir).RunTool(t.Context(), tsworkspace.PhaseRuntime, dir, "bun", "run", "runner.ts")
	if result.Failed() {
		t.Fatalf("failed initialization: %v\n%s", result.Error, result.Output)
	}
}
