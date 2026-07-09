package asyncmetric

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"hash"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/pkg/errors"
	"github.com/s4wave/goscript/compiler"
	"github.com/s4wave/goscript/compiler/gotest"
)

var spacewaveCorePatterns = []string{
	"./core/resource/root/controller",
	"./core/resource/listener",
	"./core/session/controller",
	"./core/provider/local",
	"./core/provider/spacewave",
	"./core/space/sobject",
	"./core/sobject/world/engine",
	"./core/space/world/optypes",
	"./core/plugin/space",
	"./core/space/http/download",
	"./core/space/http/export",
	"./db/blocktype/controller-factory",
	"github.com/s4wave/spacewave/db/object/peer",
}

// WorkloadOptions selects the source trees and sample count for one async workload run.
type WorkloadOptions struct {
	ModuleDir    string
	SpacewaveDir string
	OutputRoot   string
	WorkDir      string
	Samples      int
}

// AsyncShapeStats describes generated TypeScript async shape counters.
type AsyncShapeStats struct {
	Files             int
	Bytes             int64
	AsyncFunctions    int
	AwaitTokens       int
	ReturnAwaitTokens int
	AwaitUsingTokens  int
	TreeHash          string
}

type RuntimeCaseMetric struct {
	Name      string
	RuntimeNS int64
	Samples   int
	Passed    bool
	Output    string
	Error     string
}

// WorkloadResult is the JSON-serializable async-overhead measurement payload.
type WorkloadResult struct {
	RuntimeAsyncNS int64
	Samples        int
	JSRuntime      string
	Output         AsyncShapeStats
	Cases          []RuntimeCaseMetric
	Failures       []string
}

// RunWorkload compiles the Spacewave async corpus, runs runtime cases, and returns one metric payload.
func RunWorkload(ctx context.Context, opts WorkloadOptions) (*WorkloadResult, error) {
	moduleDir, err := resolveModuleDir(opts.ModuleDir)
	if err != nil {
		return nil, err
	}
	spacewaveDir, err := resolveSpacewaveRepoDir(ctx, moduleDir, opts.SpacewaveDir)
	if err != nil {
		return nil, err
	}
	outputRoot := strings.TrimSpace(opts.OutputRoot)
	if outputRoot == "" {
		outputRoot = filepath.Join(moduleDir, ".tmp", "spacewave-async-metric", "spacewave-out")
	}
	if err := os.RemoveAll(outputRoot); err != nil {
		return nil, errors.Wrap(err, "clear output root")
	}
	if err := CompileSpacewaveCore(ctx, spacewaveDir, outputRoot); err != nil {
		return nil, err
	}
	stats, err := CollectAsyncShapeStats(outputRoot)
	if err != nil {
		return nil, err
	}
	cases, err := RunRuntimeCases(ctx, WorkloadOptions{
		ModuleDir:    moduleDir,
		SpacewaveDir: spacewaveDir,
		OutputRoot:   opts.OutputRoot,
		WorkDir:      opts.WorkDir,
		Samples:      opts.Samples,
	})
	if err != nil {
		return nil, err
	}
	result := &WorkloadResult{
		Samples:   normalizedSamples(opts.Samples),
		JSRuntime: "bun",
		Output:    *stats,
		Cases:     cases,
	}
	for _, metric := range cases {
		result.RuntimeAsyncNS += metric.RuntimeNS
		if !metric.Passed {
			result.Failures = append(result.Failures, metric.Name+": "+metric.Error)
		}
	}
	return result, nil
}

// RunRuntimeCases executes synthetic generated-TypeScript cases through GoScript's package-test runner.
const runtimeMetricPrefix = "goscript_metric_ns"

func RunRuntimeCases(ctx context.Context, opts WorkloadOptions) ([]RuntimeCaseMetric, error) {
	moduleDir, err := resolveModuleDir(opts.ModuleDir)
	if err != nil {
		return nil, err
	}
	caseDir, err := materializeRuntimeCases(moduleDir)
	if err != nil {
		return nil, err
	}
	rel, err := filepath.Rel(moduleDir, caseDir)
	if err != nil {
		return nil, errors.Wrap(err, "runtime case package path")
	}
	pattern := "./" + filepath.ToSlash(rel)
	samples := normalizedSamples(opts.Samples)
	workRoot := strings.TrimSpace(opts.WorkDir)
	if workRoot == "" {
		workRoot = filepath.Join(moduleDir, ".tmp", "spacewave-async-metric", "runtime-work")
	}

	metrics := make([]RuntimeCaseMetric, 0, len(runtimeCases))
	for _, runtimeCase := range runtimeCases {
		caseWorkDir := filepath.Join(workRoot, runtimeCase.Name)
		caseOutputRoot := filepath.Join(caseWorkDir, "output")
		if err := os.RemoveAll(caseWorkDir); err != nil {
			return nil, errors.Wrap(err, "clear runtime case workdir")
		}
		result, err := gotest.NewRunner().Run(ctx, &gotest.Request{
			Dir:            moduleDir,
			Patterns:       []string{pattern},
			Run:            "^" + runtimeCase.TestName + "$",
			Count:          samples,
			WorkDir:        caseWorkDir,
			OutputRoot:     caseOutputRoot,
			Parallelism:    1,
			RuntimeBackend: gotest.RuntimeBackendBun,
			Timeout:        5 * time.Minute,
		})
		if err != nil {
			return nil, errors.Wrapf(err, "run runtime case %s", runtimeCase.Name)
		}
		metric := RuntimeCaseMetric{
			Name:    runtimeCase.Name,
			Samples: samples,
			Passed:  result.Passed(),
		}
		for _, pkg := range result.Packages {
			runtimeNS, ok := parseRuntimeMetric(pkg.Output, runtimeCase.Name)
			if ok {
				metric.RuntimeNS += runtimeNS
			}
			if strings.TrimSpace(pkg.Output) != "" {
				metric.Output = strings.TrimSpace(pkg.Output)
			}
			if pkg.Error != "" {
				metric.Error = pkg.Error
			}
		}
		if metric.Passed && metric.RuntimeNS <= 0 {
			metric.Passed = false
			metric.Error = "runtime metric marker missing"
		}
		if !metric.Passed && metric.Error == "" {
			metric.Error = "runtime case failed"
		}
		metrics = append(metrics, metric)
	}
	return metrics, nil
}

func parseRuntimeMetric(output string, caseName string) (int64, bool) {
	for _, line := range strings.Split(output, "\n") {
		fields := strings.Fields(line)
		if len(fields) != 3 || fields[0] != runtimeMetricPrefix || fields[1] != caseName {
			continue
		}
		value, err := strconv.ParseInt(fields[2], 10, 64)
		return value, err == nil && value > 0
	}
	return 0, false
}

// CompileSpacewaveCore compiles the selected Spacewave async-heavy package corpus to TypeScript.
func CompileSpacewaveCore(ctx context.Context, spacewaveDir string, out string) error {
	comp, err := compiler.NewCompiler(&compiler.Config{
		Dir:             spacewaveDir,
		OutputPath:      out,
		BuildFlags:      []string{"-tags=goscript,skip_e2e,purego"},
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		return err
	}
	_, err = comp.CompilePackages(ctx, spacewaveCorePatterns...)
	return err
}

// CollectAsyncShapeStats counts async-shape tokens and a deterministic tree hash under root.
func CollectAsyncShapeStats(root string) (*AsyncShapeStats, error) {
	if strings.TrimSpace(root) == "" {
		return nil, errors.New("empty output root")
	}
	stats := &AsyncShapeStats{}
	h := sha256.New()
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}

		stats.Files++
		stats.Bytes += info.Size()
		stats.AsyncFunctions += countAsyncFunctions(content)
		stats.AwaitTokens += bytes.Count(content, []byte("await"))
		stats.ReturnAwaitTokens += bytes.Count(content, []byte("return await"))
		stats.AwaitUsingTokens += bytes.Count(content, []byte("await using"))
		writeHashPart(h, []byte(filepath.ToSlash(rel)))
		writeHashPart(h, content)
		return nil
	})
	if err != nil {
		return nil, err
	}
	stats.TreeHash = hex.EncodeToString(h.Sum(nil))
	return stats, nil
}

// WorkloadResultJSON renders the metric payload as the generic GLaDOS JSON process output.
func WorkloadResultJSON(result *WorkloadResult) string {
	if result == nil {
		return "{}"
	}
	var b strings.Builder
	b.WriteByte('{')
	writeJSONIntField(&b, "runtime_async_ns", result.RuntimeAsyncNS, false)
	writeJSONIntField(&b, "samples", int64(result.Samples), true)
	writeJSONStringField(&b, "js_runtime", result.JSRuntime, true)
	b.WriteString(",\"output\":{")
	writeJSONIntField(&b, "files", int64(result.Output.Files), false)
	writeJSONIntField(&b, "bytes", result.Output.Bytes, true)
	writeJSONIntField(&b, "async_functions", int64(result.Output.AsyncFunctions), true)
	writeJSONIntField(&b, "awaits", int64(result.Output.AwaitTokens), true)
	writeJSONIntField(&b, "return_awaits", int64(result.Output.ReturnAwaitTokens), true)
	writeJSONIntField(&b, "await_using", int64(result.Output.AwaitUsingTokens), true)
	writeJSONStringField(&b, "tree_hash", result.Output.TreeHash, true)
	b.WriteByte('}')
	b.WriteString(",\"cases\":{")
	for idx, runtimeCase := range result.Cases {
		writeJSONIntField(&b, runtimeCase.Name+"_ns", runtimeCase.RuntimeNS, idx != 0)
	}
	b.WriteByte('}')
	b.WriteString(",\"case_results\":[")
	for idx, runtimeCase := range result.Cases {
		if idx != 0 {
			b.WriteByte(',')
		}
		b.WriteByte('{')
		writeJSONStringField(&b, "name", runtimeCase.Name, false)
		writeJSONIntField(&b, "runtime_ns", runtimeCase.RuntimeNS, true)
		writeJSONIntField(&b, "samples", int64(runtimeCase.Samples), true)
		writeJSONBoolField(&b, "passed", runtimeCase.Passed, true)
		writeJSONStringField(&b, "output", runtimeCase.Output, true)
		writeJSONStringField(&b, "error", runtimeCase.Error, true)
		b.WriteByte('}')
	}
	b.WriteByte(']')
	b.WriteString(",\"failures\":[")
	for idx, failure := range result.Failures {
		if idx != 0 {
			b.WriteByte(',')
		}
		b.Write(strconv.AppendQuote(nil, failure))
	}
	b.WriteString("]}")
	return b.String()
}

func resolveSpacewaveRepoDir(ctx context.Context, moduleDir string, explicit string) (string, error) {
	if dir := strings.TrimSpace(explicit); dir != "" {
		return absDir(dir)
	}
	if dir := strings.TrimSpace(os.Getenv("SPACEWAVE_REPO")); dir != "" {
		return absDir(dir)
	}
	cmd := exec.CommandContext(ctx, "go", "list", "-m", "-f", "{{.Dir}}", "github.com/s4wave/spacewave")
	cmd.Dir = moduleDir
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		return "", errors.Errorf("resolve github.com/s4wave/spacewave module dir: %v\nstderr:\n%s", err, stderr.String())
	}
	return absDir(strings.TrimSpace(stdout.String()))
}

func resolveModuleDir(start string) (string, error) {
	dir := strings.TrimSpace(start)
	if dir == "" {
		var err error
		dir, err = os.Getwd()
		if err != nil {
			return "", err
		}
	}
	abs, err := filepath.Abs(dir)
	if err != nil {
		return "", err
	}
	for {
		if _, err := os.Stat(filepath.Join(abs, "go.mod")); err == nil {
			return abs, nil
		}
		next := filepath.Dir(abs)
		if next == abs {
			return "", errors.New("module root with go.mod not found")
		}
		abs = next
	}
}

func absDir(dir string) (string, error) {
	abs, err := filepath.Abs(dir)
	if err != nil {
		return "", err
	}
	info, err := os.Stat(abs)
	if err != nil {
		return "", err
	}
	if !info.IsDir() {
		return "", errors.Errorf("%s is not a directory", abs)
	}
	return abs, nil
}

func normalizedSamples(samples int) int {
	if samples <= 0 {
		return 5
	}
	return samples
}

func countAsyncFunctions(content []byte) int {
	return bytes.Count(content, []byte("async function")) + bytes.Count(content, []byte("async ("))
}

func writeHashPart(h hash.Hash, data []byte) {
	_, _ = h.Write(strconv.AppendInt(nil, int64(len(data)), 10))
	_, _ = h.Write([]byte{0})
	_, _ = h.Write(data)
	_, _ = h.Write([]byte{0})
}

func writeJSONIntField(b *strings.Builder, name string, value int64, comma bool) {
	if comma {
		b.WriteByte(',')
	}
	b.Write(strconv.AppendQuote(nil, name))
	b.WriteByte(':')
	b.Write(strconv.AppendInt(nil, value, 10))
}

func writeJSONStringField(b *strings.Builder, name string, value string, comma bool) {
	if comma {
		b.WriteByte(',')
	}
	b.Write(strconv.AppendQuote(nil, name))
	b.WriteByte(':')
	b.Write(strconv.AppendQuote(nil, value))
}

func writeJSONBoolField(b *strings.Builder, name string, value bool, comma bool) {
	if comma {
		b.WriteByte(',')
	}
	b.Write(strconv.AppendQuote(nil, name))
	b.WriteByte(':')
	if value {
		b.WriteString("true")
		return
	}
	b.WriteString("false")
}
