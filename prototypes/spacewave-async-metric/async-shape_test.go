package asyncmetric

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestAsyncShapeStatsCountTokens(t *testing.T) {
	root := t.TempDir()
	writeFile(t, root, "a.ts", "async function a() {\n  return await b()\n}\n")
	writeFile(t, root, "b.ts", "const b = async () => {\n  await using cleanup = c();\n  await d();\n}\n")

	stats, err := CollectAsyncShapeStats(root)
	if err != nil {
		t.Fatal(err)
	}
	if stats.Files != 2 {
		t.Fatalf("files = %d, want 2", stats.Files)
	}
	if stats.AsyncFunctions != 2 {
		t.Fatalf("asyncFunctions = %d, want 2", stats.AsyncFunctions)
	}
	if stats.AwaitTokens != 3 {
		t.Fatalf("awaitTokens = %d, want 3", stats.AwaitTokens)
	}
	if stats.ReturnAwaitTokens != 1 {
		t.Fatalf("returnAwaitTokens = %d, want 1", stats.ReturnAwaitTokens)
	}
	if stats.AwaitUsingTokens != 1 {
		t.Fatalf("awaitUsingTokens = %d, want 1", stats.AwaitUsingTokens)
	}
}

func TestAsyncShapeStatsRejectsEmptyRoot(t *testing.T) {
	_, err := CollectAsyncShapeStats("")
	if err == nil || !strings.Contains(err.Error(), "empty output root") {
		t.Fatalf("expected empty output root error, got %v", err)
	}
}

func TestWorkloadResultJSONIncludesMetricAndCoGates(t *testing.T) {
	out := WorkloadResultJSON(&WorkloadResult{
		RuntimeAsyncNS: 42,
		Samples:        2,
		JSRuntime:      "bun",
		Output: AsyncShapeStats{
			Files:             3,
			Bytes:             4,
			AsyncFunctions:    5,
			AwaitTokens:       6,
			ReturnAwaitTokens: 7,
			AwaitUsingTokens:  8,
			TreeHash:          "abc",
		},
		Cases: []RuntimeCaseMetric{{
			Name:      "wrapper_chain",
			RuntimeNS: 9,
			Samples:   2,
			Passed:    true,
		}},
	})
	for _, want := range []string{
		`"runtime_async_ns":42`,
		`"samples":2`,
		`"tree_hash":"abc"`,
		`"wrapper_chain_ns":9`,
		`"passed":true`,
	} {
		if !strings.Contains(out, want) {
			t.Fatalf("JSON output missing %s: %s", want, out)
		}
	}
}

func TestWorkloadResultJSONIncludesFailureDetails(t *testing.T) {
	out := WorkloadResultJSON(&WorkloadResult{
		RuntimeAsyncNS: 0,
		Samples:        1,
		JSRuntime:      "bun",
		Cases: []RuntimeCaseMetric{{
			Name:    "resource_srpc",
			Samples: 1,
			Passed:  false,
			Error:   "generated runtime failed",
		}},
		Failures: []string{"resource_srpc: generated runtime failed"},
	})
	for _, want := range []string{
		`"resource_srpc_ns":0`,
		`"passed":false`,
		`"error":"generated runtime failed"`,
		`"failures":["resource_srpc: generated runtime failed"]`,
	} {
		if !strings.Contains(out, want) {
			t.Fatalf("JSON output missing %s: %s", want, out)
		}
	}
}

func TestParseRuntimeMetricRequiresGeneratedMarker(t *testing.T) {
	value, ok := parseRuntimeMetric("setup noise\ngoscript_metric_ns wrapper_chain 123\n", "wrapper_chain")
	if !ok || value != 123 {
		t.Fatalf("runtime metric = %d, %v; want 123, true", value, ok)
	}
	if value, ok := parseRuntimeMetric("goscript_metric_ns wrapper_chain 0\n", "wrapper_chain"); ok || value != 0 {
		t.Fatalf("zero runtime metric = %d, %v; want 0, false", value, ok)
	}
	if value, ok := parseRuntimeMetric("goscript_metric_ns other 123\n", "wrapper_chain"); ok || value != 0 {
		t.Fatalf("other runtime metric = %d, %v; want 0, false", value, ok)
	}
}

func TestRuntimeAsyncCasesPass(t *testing.T) {
	cases, err := RunRuntimeCases(context.Background(), WorkloadOptions{
		ModuleDir: moduleDir(t),
		Samples:   1,
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(cases) != len(runtimeCases) {
		t.Fatalf("cases = %d, want %d", len(cases), len(runtimeCases))
	}
	for _, runtimeCase := range cases {
		if !runtimeCase.Passed {
			t.Fatalf("%s failed: %s\n%s", runtimeCase.Name, runtimeCase.Error, runtimeCase.Output)
		}
		if runtimeCase.RuntimeNS <= 0 {
			t.Fatalf("%s runtime_ns = %d, want > 0", runtimeCase.Name, runtimeCase.RuntimeNS)
		}
	}
}

func BenchmarkSpacewaveCoreAsyncShape(b *testing.B) {
	spacewaveDir := spacewaveRepoDir(b)
	for i := 0; i < b.N; i++ {
		out := filepath.Join(b.TempDir(), "out")
		if err := CompileSpacewaveCore(context.Background(), spacewaveDir, out); err != nil {
			b.Fatal(err)
		}

		stats, err := CollectAsyncShapeStats(out)
		if err != nil {
			b.Fatal(err)
		}
		b.ReportMetric(float64(stats.Files), "files/op")
		b.ReportMetric(float64(stats.Bytes)/(1024*1024), "MiB/op")
		b.ReportMetric(float64(stats.AsyncFunctions), "async_fns/op")
		b.ReportMetric(float64(stats.AwaitTokens), "awaits/op")
		b.ReportMetric(float64(stats.ReturnAwaitTokens), "return_awaits/op")
		b.ReportMetric(float64(stats.AwaitUsingTokens), "await_using/op")
		b.Logf("tree_hash=%s", stats.TreeHash)
	}
}

func moduleDir(tb testing.TB) string {
	tb.Helper()
	dir, err := resolveModuleDir("")
	if err != nil {
		tb.Fatal(err)
	}
	return dir
}

func spacewaveRepoDir(tb testing.TB) string {
	tb.Helper()
	dir, err := resolveSpacewaveRepoDir(context.Background(), moduleDir(tb), "")
	if err != nil {
		tb.Fatal(err)
	}
	return dir
}

func writeFile(tb testing.TB, root string, rel string, content string) {
	tb.Helper()
	path := filepath.Join(root, filepath.FromSlash(rel))
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		tb.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		tb.Fatal(err)
	}
}
