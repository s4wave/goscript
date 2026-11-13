package gotest

import (
	"context"
	"maps"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/pkg/errors"
	goscript "github.com/s4wave/goscript"
	"github.com/s4wave/goscript/compiler"
	"github.com/s4wave/goscript/compiler/tsworkspace"
	"golang.org/x/sync/errgroup"
)

const combinedRuntimeResultPrefix = "__GOSCRIPT_PACKAGE_RESULT__"

const browserAmbientTypesFile = "goscript-browser.d.ts"

const browserAmbientTypes = "declare module \"vitest\" {\n\texport function test(name: string, fn: () => void | Promise<void>): void\n}\n" +
	"declare module \"vitest/browser\" {\n\texport const commands: Record<string, (...args: any[]) => Promise<any>>\n}\n"

// runtimeStylePattern matches terminal styles added by runtime reporters.
var runtimeStylePattern = regexp.MustCompile(`\x1b\[[0-9;]*m`)

// Runner owns GoScript package-test loading, compilation, typecheck, and execution.
type Runner struct {
	service *compiler.CompileService
}

// NewRunner creates a package-test runner.
func NewRunner() *Runner {
	return &Runner{service: compiler.NewCompileService()}
}

// Run executes package tests through the GoScript compiler and TypeScript runtime.
func (r *Runner) Run(ctx context.Context, req *Request) (*Result, error) {
	if r == nil {
		r = NewRunner()
	}
	norm, err := req.normalize()
	if err != nil {
		return nil, err
	}
	r.service = compiler.NewCompileService(norm.OverrideDirs...)
	if norm.Timeout != 0 {
		var cancel context.CancelFunc
		ctx, cancel = context.WithTimeout(ctx, norm.Timeout)
		defer cancel()
	}
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	if norm.WorkDir == "" {
		workRoot := filepath.Join(norm.Dir, ".tmp")
		if err := os.MkdirAll(workRoot, 0o755); err != nil {
			return nil, errors.Wrap(err, "create goscript test work root")
		}
		norm.WorkDir, err = os.MkdirTemp(workRoot, "goscript-test-")
		if err != nil {
			return nil, errors.Wrap(err, "create goscript test work directory")
		}
	}
	if norm.OutputRoot == "" {
		norm.OutputRoot = filepath.Join(norm.WorkDir, "output")
	}

	result := &Result{
		WorkDir:    norm.WorkDir,
		OutputRoot: norm.OutputRoot,
	}
	workspace := tsworkspace.NewOwner(norm.WorkDir, norm.Dir)

	runPattern, err := compileRunPattern(norm.Run)
	if err != nil {
		diag := compiler.Diagnostic{
			Severity: compiler.DiagnosticSeverityError,
			Code:     "goscript/gotest:run-pattern",
			Message:  "invalid -run pattern",
			Detail:   err.Error(),
		}
		result.Diagnostics = append(result.Diagnostics, diag)
		markAllFailures(result, OwnerPackageGraph, compiler.NewCompileError([]compiler.Diagnostic{diag}).Error())
		return result, nil
	}

	// An invalid -bench pattern fails every package before any is built.
	var benchPattern *regexp.Regexp
	if norm.Bench != "" {
		benchPattern, err = regexp.Compile(norm.Bench)
		if err != nil {
			diag := compiler.Diagnostic{
				Severity: compiler.DiagnosticSeverityError,
				Code:     "goscript/gotest:bench-pattern",
				Message:  "invalid -bench pattern",
				Detail:   err.Error(),
			}
			result.Diagnostics = append(result.Diagnostics, diag)
			markAllFailures(result, OwnerPackageGraph, compiler.NewCompileError([]compiler.Diagnostic{diag}).Error())
			return result, nil
		}
	}

	testGraphReq := &compiler.CompileRequest{
		Patterns:                  slices.Clone(norm.Patterns),
		Dir:                       norm.Dir,
		OutputPath:                norm.OutputRoot,
		BuildFlags:                slices.Clone(norm.BuildFlags),
		OverrideDirs:              slices.Clone(norm.OverrideDirs),
		ProtobufTypeScriptBinding: req.ProtobufTypeScriptBinding,
		DependencyMode:            compiler.DependencyModeRequested,
		RuntimeEmissionMode:       compiler.RuntimeEmissionModeEmit,
		Tests:                     true,
	}
	testGraph, loadDiagnostics := r.service.PackageGraphOwner().LoadTestGraph(ctx, testGraphReq)
	result.Diagnostics = append(result.Diagnostics, loadDiagnostics...)
	result.Packages = packageResults(testGraph, runPattern, benchPattern)
	if diagnosticsHaveErrors(loadDiagnostics) && len(result.Packages) == 0 {
		markAllFailures(result, OwnerPackageGraph, diagnosticsSummary(loadDiagnostics))
		return result, nil
	}

	// Compile the packages under test.
	r.compilePackageOutputs(ctx, norm, result)

	// Find the runtime npm packages the output imports.
	dependencies, err := runtimeDependencies(norm.OutputRoot)
	if err != nil {
		markAllFailures(result, OwnerTestRunner, err.Error())
		return result, nil
	}
	if norm.RuntimeBackend == RuntimeBackendBrowser {
		browserDeps, err := goscript.BrowserTestDependencies()
		if err != nil {
			markAllFailures(result, OwnerTestRunner, err.Error())
			return result, nil
		}
		if dependencies == nil {
			dependencies = make(map[string]string, len(browserDeps))
		}
		maps.Copy(dependencies, browserDeps)
	}

	// Declare and install them in the workspace.
	if phase := workspace.EnsurePackageJSON(dependencies); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, phase.Error)
		return result, nil
	}
	if phase := workspace.InstallDependencies(ctx, dependencies); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, processErrorText(phase))
		return result, nil
	}

	// Write the ambient types and project for the runtime backend.
	nodeTypesAvailable := tsworkspace.NodeTypesPresent(norm.WorkDir, norm.Dir)
	if norm.RuntimeBackend == RuntimeBackendBrowser {
		nodeTypesAvailable = false
	}
	if norm.RuntimeBackend == RuntimeBackendBrowser {
		for file, content := range map[string]string{
			browserAmbientTypesFile: browserAmbientTypes,
			browserHostFSServerFile: browserHostFSServer,
			browserHostFSClientFile: browserHostFSClient,
		} {
			if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, file, content); phase.Failed() {
				markAllFailures(result, OwnerTestRunner, phase.Error)
				return result, nil
			}
		}
	} else if phase := workspace.EnsureNodeAmbientTypes(); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, phase.Error)
		return result, nil
	}
	if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, "tsconfig.json", renderRuntimeTypeScriptProject(norm, nodeTypesAvailable)); phase.Failed() {
		markAllFailures(result, OwnerTestRunner, phase.Error)
		return result, nil
	}
	r.runPackageTools(ctx, norm, workspace, result, nodeTypesAvailable)
	return result, nil
}

func (r *Runner) runPackageTools(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	nodeTypesAvailable bool,
) {
	indexes := r.preparePackageWorkspaces(req, workspace, result, nodeTypesAvailable)
	if len(indexes) == 0 {
		return
	}
	if phase := materializeRuntimeModuleShims(req); phase.Failed() {
		markRuntimeFailures(result, indexes, OwnerTestRunner, phase.Error)
		return
	}
	if len(indexes) == 1 {
		r.runPackageTypeCheckAndRuntime(ctx, req, workspace, result, indexes[0])
		return
	}
	typecheck := workspace.RunTool(ctx, tsworkspace.PhaseTypeCheck, req.WorkDir, "tsrs", "--project", "tsconfig.json")
	if typecheck.Failed() {
		if owner, ok := aggregateTypeCheckFailureOwner(typecheck.Output); ok {
			markTypeCheckFailures(result, owner, processErrorText(typecheck))
			return
		}
		r.runPackageTypeChecksAndRuntimes(ctx, req, workspace, result, indexes)
		return
	}
	for _, idx := range indexes {
		result.Packages[idx].Phases.TypeCheck = PhaseStatusPass
	}
	r.runPackageRuntimes(ctx, req, workspace, result, indexes)
}

func (r *Runner) preparePackageWorkspaces(
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	nodeTypesAvailable bool,
) []int {
	var indexes []int
	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		if r.preparePackageWorkspace(req, workspace, result, nodeTypesAvailable, idx) {
			indexes = append(indexes, idx)
		}
	}
	return indexes
}

func (r *Runner) preparePackageWorkspace(
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	nodeTypesAvailable bool,
	idx int,
) bool {
	result.Packages[idx].Phases.Workspace = PhaseStatusPass
	runnerFile := packageRunnerFile(idx)
	if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, runnerFile, renderPackageRunner(result.Packages[idx], req)); phase.Failed() {
		result.Packages[idx].Owner = OwnerTestRunner
		result.Packages[idx].Phases.Workspace = PhaseStatusFail
		result.Packages[idx].Error = phase.Error
		return false
	}
	tsconfigFile := packageTSConfigFile(idx)
	if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, tsconfigFile, renderTypeScriptProject(req, runnerFile, tsconfigFile, nodeTypesAvailable)); phase.Failed() {
		result.Packages[idx].Owner = OwnerTestRunner
		result.Packages[idx].Phases.Workspace = PhaseStatusFail
		result.Packages[idx].Error = phase.Error
		return false
	}
	return true
}

func (r *Runner) runPackageTypeChecksAndRuntimes(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	indexes []int,
) {
	packageExecutionFanout(ctx, max(req.Parallelism, 1), packageExecutionIndexes(result, indexes), func(idx int) {
		result.Packages[idx].Owner = OwnerTestRunner
		result.Packages[idx].Phases.TypeCheck = PhaseStatusFail
		result.Packages[idx].Error = ctx.Err().Error()
	}, func(idx int) {
		r.runPackageTypeCheckAndRuntime(ctx, req, workspace, result, idx)
	})
}

func packageExecutionFanout(
	ctx context.Context,
	parallelism int,
	indexes []int,
	onCanceled func(int),
	run func(int),
) {
	var group errgroup.Group
	group.SetLimit(max(parallelism, 1))
	for _, idx := range indexes {
		group.Go(func() error {
			select {
			case <-ctx.Done():
				onCanceled(idx)
				return nil
			default:
			}
			run(idx)
			return nil
		})
	}
	_ = group.Wait()
}

func (r *Runner) runPackageTypeCheckAndRuntime(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	idx int,
) {
	if !r.runPackageTypeCheck(ctx, req, workspace, result, idx) {
		return
	}
	r.runPackageRuntime(ctx, req, workspace, result, idx)
}

func (r *Runner) runPackageTypeCheck(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	idx int,
) bool {
	typecheck := workspace.RunTool(ctx, tsworkspace.PhaseTypeCheck, req.WorkDir, "tsrs", "--project", packageTSConfigFile(idx))
	if typecheck.Failed() {
		result.Packages[idx].Owner = classifyProcessOutput(typecheck.Output)
		result.Packages[idx].Phases.TypeCheck = PhaseStatusFail
		result.Packages[idx].Error = processErrorText(typecheck)
		return false
	}
	result.Packages[idx].Phases.TypeCheck = PhaseStatusPass
	return true
}

func (r *Runner) runPackageRuntimes(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	indexes []int,
) {
	if req.RuntimeBackend == RuntimeBackendBrowser {
		r.runPackageRuntimesIndividually(ctx, req, workspace, result, indexes)
		return
	}
	if len(indexes) > 1 &&
		(req.RuntimeGroups || req.Parallelism == 1) &&
		r.runCombinedPackageRuntimes(ctx, req, workspace, result, indexes) {
		return
	}
	r.runPackageRuntimesIndividually(ctx, req, workspace, result, indexes)
}

// materializeRuntimeModuleShims writes a node_modules/@goscript module beside
// the workspace and the output root for each emitted TypeScript module, so
// Bun resolves @goscript imports to the emitted program.
func materializeRuntimeModuleShims(req *normalizedRequest) tsworkspace.Result {
	// Only Bun resolves @goscript through node_modules, and an empty output
	// needs no shims.
	if req.RuntimeBackend != RuntimeBackendBun {
		return tsworkspace.Result{Phase: tsworkspace.PhaseWorkspace}
	}
	root := filepath.Join(req.OutputRoot, "@goscript")
	if _, err := os.Stat(root); err != nil {
		if os.IsNotExist(err) {
			return tsworkspace.Result{Phase: tsworkspace.PhaseWorkspace}
		}
		return tsworkspace.Result{Phase: tsworkspace.PhaseWorkspace, Error: errors.Wrap(err, "stat GoScript runtime output root").Error()}
	}

	// Write a shim for each module under every root that runs code.
	shimRoots := []string{filepath.Clean(req.WorkDir)}
	if outputRoot := filepath.Clean(req.OutputRoot); outputRoot != shimRoots[0] {
		shimRoots = append(shimRoots, outputRoot)
	}
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		// Shim only the emitted TypeScript modules.
		if err != nil {
			return err
		}
		if entry.IsDir() || filepath.Ext(path) != ".ts" {
			return nil
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		shimRel := filepath.Join("node_modules", "@goscript", strings.TrimSuffix(rel, ".ts")+".js")
		for _, shimRoot := range shimRoots {
			shimPath := filepath.Join(shimRoot, shimRel)
			importPath, err := filepath.Rel(filepath.Dir(shimPath), path)
			if err != nil {
				return err
			}
			importPath = filepath.ToSlash(importPath)
			if !strings.HasPrefix(importPath, ".") {
				importPath = "./" + importPath
			}
			if err := writeRuntimeModuleShim(shimPath, "export * from "+strconv.Quote(importPath)+"\n"); err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return tsworkspace.Result{Phase: tsworkspace.PhaseWorkspace, Error: errors.Wrap(err, "materialize GoScript runtime module shims").Error()}
	}
	return tsworkspace.Result{Phase: tsworkspace.PhaseWorkspace}
}

func writeRuntimeModuleShim(path string, data string) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	return os.WriteFile(path, []byte(data), 0o644)
}

func markRuntimeFailures(result *Result, indexes []int, owner Owner, message string) {
	for _, idx := range indexes {
		if idx < 0 || idx >= len(result.Packages) {
			continue
		}
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = owner
		result.Packages[idx].Phases.Runtime = PhaseStatusFail
		result.Packages[idx].Error = message
	}
}

func (r *Runner) runPackageRuntimesIndividually(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	indexes []int,
) {
	packageExecutionFanout(ctx, max(req.Parallelism, 1), packageExecutionIndexes(result, indexes), func(idx int) {
		result.Packages[idx].Owner = OwnerTestRunner
		result.Packages[idx].Phases.Runtime = PhaseStatusFail
		result.Packages[idx].Error = ctx.Err().Error()
	}, func(idx int) {
		r.runPackageRuntime(ctx, req, workspace, result, idx)
	})
}

func (r *Runner) runCombinedPackageRuntimes(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	indexes []int,
) bool {
	ordered := packageExecutionIndexes(result, indexes)
	chunks := packageRuntimeChunks(ordered, max(req.Parallelism, 1))
	if len(chunks) == 0 {
		return true
	}
	if len(chunks) == 1 {
		return r.runCombinedPackageRuntime(ctx, req, workspace, result, "runner-all.ts", chunks[0])
	}

	var mu sync.Mutex
	ok := true
	var group errgroup.Group
	group.SetLimit(max(req.Parallelism, 1))
	for chunkIdx, chunk := range chunks {
		runnerFile := "runner-all-" + strconv.Itoa(chunkIdx) + ".ts"
		group.Go(func() error {
			if r.runCombinedPackageRuntime(ctx, req, workspace, result, runnerFile, chunk) {
				return nil
			}
			mu.Lock()
			ok = false
			mu.Unlock()
			return nil
		})
	}
	_ = group.Wait()
	return ok
}

func packageRuntimeChunks(indexes []int, parallelism int) [][]int {
	if len(indexes) == 0 {
		return nil
	}
	if parallelism < 1 {
		parallelism = 1
	}
	if parallelism > len(indexes) {
		parallelism = len(indexes)
	}
	chunks := make([][]int, parallelism)
	for idx, packageIdx := range indexes {
		chunks[idx%parallelism] = append(chunks[idx%parallelism], packageIdx)
	}
	return chunks
}

func (r *Runner) runCombinedPackageRuntime(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	runnerFile string,
	indexes []int,
) bool {
	if phase := workspace.WriteFile(tsworkspace.PhaseWorkspace, runnerFile, renderCombinedRunner(result, indexes, req)); phase.Failed() {
		return false
	}
	runtime := workspace.RunTool(ctx, tsworkspace.PhaseRuntime, req.WorkDir, "bun", runnerFile)
	if runtime.Failed() {
		return false
	}
	records, ok := parseCombinedRuntimeRecords(runtime.Output)
	if !ok {
		return false
	}
	byPath := make(map[string]combinedRuntimeRecord, len(records))
	for _, record := range records {
		byPath[record.PackagePath] = record
	}
	for _, idx := range indexes {
		record, ok := byPath[result.Packages[idx].PackagePath]
		if !ok {
			return false
		}
		result.Packages[idx].Elapsed = time.Duration(record.ElapsedMS) * time.Millisecond
		result.Packages[idx].Output = strings.TrimSpace(record.Output)
		if record.OK {
			result.Packages[idx].Phases.Runtime = PhaseStatusPass
			result.Packages[idx].Action = ActionPass
			continue
		}
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = classifyProcessOutput(record.Output)
		result.Packages[idx].Phases.Runtime = PhaseStatusFail
		result.Packages[idx].Error = strings.TrimSpace(record.Output)
		if result.Packages[idx].Error == "" {
			result.Packages[idx].Error = "goscript test failed"
		}
	}
	return true
}

func (r *Runner) runPackageRuntime(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	idx int,
) {
	if req.RuntimeBackend == RuntimeBackendBrowser {
		r.runPackageBrowserRuntime(ctx, req, workspace, result, idx)
		return
	}
	runtime := workspace.RunTool(ctx, tsworkspace.PhaseRuntime, req.WorkDir, "bun", packageRunnerFile(idx))
	result.Packages[idx].Elapsed = runtime.Elapsed
	result.Packages[idx].Output = strings.TrimSpace(runtime.Output)
	if runtime.Failed() {
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = classifyProcessOutput(runtime.Output)
		result.Packages[idx].Phases.Runtime = PhaseStatusFail
		result.Packages[idx].Error = runtime.Error
		return
	}
	result.Packages[idx].Phases.Runtime = PhaseStatusPass
	result.Packages[idx].Action = ActionPass
}

func (r *Runner) runPackageBrowserRuntime(
	ctx context.Context,
	req *normalizedRequest,
	workspace *tsworkspace.Owner,
	result *Result,
	idx int,
) {
	configFile := browserVitestConfigFile(idx)
	if phase := workspace.WriteFile(
		tsworkspace.PhaseWorkspace,
		configFile,
		renderBrowserVitestConfig(req, packageRunnerFile(idx), result.Packages[idx].SourceDir),
	); phase.Failed() {
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = OwnerTestRunner
		result.Packages[idx].Phases.Workspace = PhaseStatusFail
		result.Packages[idx].Error = phase.Error
		return
	}
	runtime := workspace.RunTool(ctx, tsworkspace.PhaseRuntime, req.WorkDir, "vitest", "run", "--config", configFile, "--reporter", "verbose")
	result.Packages[idx].Elapsed = runtime.Elapsed
	result.Packages[idx].Output = strings.TrimSpace(runtime.Output)
	records, ok := parseCombinedRuntimeRecords(runtime.Output)
	if !ok {
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = classifyProcessOutput(runtime.Output)
		result.Packages[idx].Phases.Runtime = PhaseStatusFail
		result.Packages[idx].Error = processErrorText(runtime)
		if result.Packages[idx].Error == "" {
			result.Packages[idx].Error = "browser test did not report a GoScript package result"
		}
		return
	}
	for _, record := range records {
		if record.PackagePath != result.Packages[idx].PackagePath {
			continue
		}
		result.Packages[idx].Elapsed = time.Duration(record.ElapsedMS) * time.Millisecond
		result.Packages[idx].Output = strings.TrimSpace(record.Output)
		if record.OK && !runtime.Failed() {
			result.Packages[idx].Phases.Runtime = PhaseStatusPass
			result.Packages[idx].Action = ActionPass
			return
		}
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = classifyProcessOutput(record.Output)
		result.Packages[idx].Phases.Runtime = PhaseStatusFail
		result.Packages[idx].Error = strings.TrimSpace(record.Output)
		if result.Packages[idx].Error == "" {
			result.Packages[idx].Error = processErrorText(runtime)
		}
		if result.Packages[idx].Error == "" {
			result.Packages[idx].Error = "goscript browser test failed"
		}
		return
	}
	result.Packages[idx].Action = ActionFail
	result.Packages[idx].Owner = OwnerTestRunner
	result.Packages[idx].Phases.Runtime = PhaseStatusFail
	result.Packages[idx].Error = "browser test did not report package " + result.Packages[idx].PackagePath
}

// compilePackageOutputs compiles the runnable packages and their tests as one
// program under req.OutputRoot. Whole-program analysis colors a shared
// dependency by every caller in the program, so packages compiled apart could
// emit conflicting copies of it. A failed batch does not name its package, so
// each package then compiles alone into a scratch root to find the failures,
// and the rest compile again as one batch.
func (r *Runner) compilePackageOutputs(ctx context.Context, req *normalizedRequest, result *Result) {
	// Compile the batch, or drop the failing packages and compile it again.
	if _, err := r.compilePackageBatch(ctx, req, result); err == nil {
		return
	}
	r.markPackageCompileFailures(ctx, req, result)
	compileResult, err := r.compilePackageBatch(ctx, req, result)
	if err == nil {
		return
	}

	// The packages that compile alone still fail together.
	result.Diagnostics = append(result.Diagnostics, resultDiagnostics(compileResult)...)
	for idx := range result.Packages {
		pkg := &result.Packages[idx]
		if !shouldCompilePackage(*pkg) {
			continue
		}
		pkg.Action = ActionFail
		pkg.Owner = classifyDiagnostics(resultDiagnostics(compileResult))
		markCompilePhase(pkg, compileResult, false)
		pkg.Error = err.Error()
	}
}

// compilePackageBatch compiles every runnable package with its tests into
// req.OutputRoot and marks them compiled when the program compiles.
func (r *Runner) compilePackageBatch(ctx context.Context, req *normalizedRequest, result *Result) (*compiler.CompilationResult, error) {
	// Compile the runnable packages as one program.
	packagePaths := runnablePackagePaths(result.Packages)
	if len(packagePaths) == 0 {
		return nil, nil
	}
	compileResult, err := r.service.Compile(ctx, packageTestCompileRequest(req, packagePaths, req.OutputRoot))
	if err != nil {
		return compileResult, err
	}

	// Record its diagnostics and mark each package compiled.
	if compileResult != nil {
		result.Diagnostics = append(result.Diagnostics, compileResult.Diagnostics...)
		appendAsyncReport(result, compileResult)
	}
	for idx := range result.Packages {
		if shouldCompilePackage(result.Packages[idx]) {
			markCompilePhase(&result.Packages[idx], compileResult, true)
		}
	}
	return compileResult, nil
}

// markPackageCompileFailures compiles each runnable package alone into a
// scratch root and marks the packages that fail.
func (r *Runner) markPackageCompileFailures(ctx context.Context, req *normalizedRequest, result *Result) {
	for idx := range result.Packages {
		pkg := &result.Packages[idx]
		if !shouldCompilePackage(*pkg) {
			continue
		}
		scratch, err := os.MkdirTemp(req.WorkDir, "compile-")
		if err != nil {
			pkg.Action = ActionFail
			pkg.Owner = OwnerTestRunner
			pkg.Error = errors.Wrap(err, "create scratch compile root").Error()
			continue
		}
		compileResult, err := r.service.Compile(ctx, packageTestCompileRequest(req, []string{pkg.PackagePath}, scratch))
		_ = os.RemoveAll(scratch)
		if err == nil {
			continue
		}
		if compileResult != nil {
			result.Diagnostics = append(result.Diagnostics, compileResult.Diagnostics...)
		}
		pkg.Action = ActionFail
		pkg.Owner = classifyDiagnostics(resultDiagnostics(compileResult))
		markCompilePhase(pkg, compileResult, false)
		pkg.Error = err.Error()
	}
}

// packageTestCompileRequest builds the request that compiles packagePaths
// with their tests and every dependency into outputPath.
func packageTestCompileRequest(req *normalizedRequest, packagePaths []string, outputPath string) *compiler.CompileRequest {
	return &compiler.CompileRequest{
		Patterns:                  packagePaths,
		Dir:                       req.Dir,
		OutputPath:                outputPath,
		BuildFlags:                slices.Clone(req.BuildFlags),
		OverrideDirs:              slices.Clone(req.OverrideDirs),
		ProtobufTypeScriptBinding: req.ProtobufTypeScriptBinding,
		DependencyMode:            compiler.DependencyModeAll,
		RuntimeEmissionMode:       compiler.RuntimeEmissionModeEmit,
		Tests:                     true,
		ReportAsync:               req.ReportAsync,
		EliminateDeadCode:         req.EliminateDeadCode,
	}
}

// appendAsyncReport adds the async report of a test binary compile to
// result, when it has one.
func appendAsyncReport(result *Result, compileResult *compiler.CompilationResult) {
	if compileResult.AsyncReport != nil {
		result.AsyncReports = append(result.AsyncReports, compileResult.AsyncReport)
	}
}

func compileRunPattern(pattern string) (*regexp.Regexp, error) {
	pattern = strings.TrimSpace(pattern)
	if pattern == "" {
		return nil, nil
	}
	return regexp.Compile(pattern)
}

func packageResults(testGraph *compiler.PackageTestGraph, runPattern, benchPattern *regexp.Regexp) []PackageResult {
	if testGraph == nil {
		return nil
	}
	results := make([]PackageResult, 0, len(testGraph.Packages))
	for _, pkg := range testGraph.Packages {
		result := newSkippedPackageResult(pkg.PackagePath)
		result.SourceDir = packageSourceDir(pkg)
		result.Tests = append(result.Tests, packageVariantTests(pkg.SamePackageTests, runPattern, benchPattern)...)
		result.Tests = append(result.Tests, packageVariantTests(pkg.ExternalPackageTests, runPattern, benchPattern)...)
		result.TestImports = packageTestImports(pkg)
		slices.SortFunc(result.Tests, func(a, b Test) int {
			if a.Name == b.Name {
				return strings.Compare(a.PackagePath, b.PackagePath)
			}
			return strings.Compare(a.Name, b.Name)
		})
		if len(result.Tests) != 0 {
			result.TestPackagePath = result.Tests[0].PackagePath
			result.Action = ActionFail
			result.Phases = PackagePhases{}
		}
		if diagnosticsHaveErrors(pkg.Diagnostics) {
			result.Action = ActionFail
			result.Owner = OwnerPackageGraph
			result.Error = diagnosticsSummary(pkg.Diagnostics)
			result.Phases = failurePhases(OwnerPackageGraph)
		}
		results = append(results, result)
	}
	return results
}

func packageSourceDir(pkg *compiler.PackageTestGraphPackage) string {
	if pkg == nil {
		return ""
	}
	for _, files := range [][]string{
		pkg.CompiledGoFiles,
		pkg.GoFiles,
		testVariantCompiledGoFiles(pkg.SamePackageTests),
		testVariantGoFiles(pkg.SamePackageTests),
		testVariantCompiledGoFiles(pkg.ExternalPackageTests),
		testVariantGoFiles(pkg.ExternalPackageTests),
	} {
		if len(files) != 0 && files[0] != "" {
			return filepath.Dir(files[0])
		}
	}
	return ""
}

func testVariantCompiledGoFiles(variant *compiler.PackageTestGraphVariant) []string {
	if variant == nil {
		return nil
	}
	return variant.CompiledGoFiles
}

func testVariantGoFiles(variant *compiler.PackageTestGraphVariant) []string {
	if variant == nil {
		return nil
	}
	return variant.GoFiles
}

func newSkippedPackageResult(packagePath string) PackageResult {
	return PackageResult{
		PackagePath: packagePath,
		Action:      ActionSkip,
		Phases: PackagePhases{
			Workspace: PhaseStatusSkip,
			Compile:   PhaseStatusSkip,
			Emit:      PhaseStatusSkip,
			TypeCheck: PhaseStatusSkip,
			Runtime:   PhaseStatusSkip,
		},
	}
}

func packageTestImports(pkg *compiler.PackageTestGraphPackage) []string {
	importSet := make(map[string]bool)
	for _, variant := range []*compiler.PackageTestGraphVariant{pkg.SamePackageTests, pkg.ExternalPackageTests} {
		if variant == nil {
			continue
		}
		for _, importPath := range variant.Imports {
			importSet[importPath] = true
		}
	}
	imports := make([]string, 0, len(importSet))
	for importPath := range importSet {
		imports = append(imports, importPath)
	}
	slices.Sort(imports)
	return imports
}

// packageVariantTests returns the tests of the variant matching runPattern
// (all if it is nil), and the benchmarks matching benchPattern (none if it
// is nil).
func packageVariantTests(variant *compiler.PackageTestGraphVariant, runPattern, benchPattern *regexp.Regexp) []Test {
	if variant == nil {
		return nil
	}
	tests := make([]Test, 0, len(variant.Tests))
	for _, test := range variant.Tests {
		if runPattern != nil && !runPattern.MatchString(test.Name) {
			continue
		}
		tests = append(tests, Test{
			Name:        test.Name,
			PackagePath: test.PackagePath,
		})
	}
	if benchPattern == nil {
		return tests
	}
	for _, bench := range variant.Benchmarks {
		if !benchPattern.MatchString(bench.Name) {
			continue
		}
		tests = append(tests, Test{
			Name:        bench.Name,
			PackagePath: bench.PackagePath,
			Benchmark:   true,
		})
	}
	return tests
}

func shouldCompilePackage(result PackageResult) bool {
	return result.Action != ActionSkip && result.Owner == "" && result.Error == ""
}

func runnablePackagePaths(results []PackageResult) []string {
	seen := make(map[string]bool)
	paths := make([]string, 0, len(results))
	for _, result := range results {
		if !shouldCompilePackage(result) {
			continue
		}
		if result.PackagePath == "" || seen[result.PackagePath] {
			continue
		}
		seen[result.PackagePath] = true
		paths = append(paths, result.PackagePath)
	}
	slices.Sort(paths)
	return paths
}

func packageExecutionIndexes(result *Result, indexes []int) []int {
	ordered := slices.Clone(indexes)
	slices.SortFunc(ordered, func(a, b int) int {
		var aPkg, bPkg PackageResult
		if result != nil {
			if a >= 0 && a < len(result.Packages) {
				aPkg = result.Packages[a]
			}
			if b >= 0 && b < len(result.Packages) {
				bPkg = result.Packages[b]
			}
		}
		if len(aPkg.Tests) != len(bPkg.Tests) {
			return len(bPkg.Tests) - len(aPkg.Tests)
		}
		return strings.Compare(aPkg.PackagePath, bPkg.PackagePath)
	})
	return ordered
}

func markAllFailures(result *Result, owner Owner, message string) {
	message = strings.TrimSpace(message)
	if result == nil {
		return
	}
	if len(result.Packages) == 0 {
		result.Packages = append(result.Packages, PackageResult{
			PackagePath: "package-patterns",
			Action:      ActionFail,
			Owner:       owner,
			Error:       message,
			Phases:      failurePhases(owner),
		})
		return
	}
	for idx := range result.Packages {
		if result.Packages[idx].Action == ActionSkip {
			continue
		}
		if result.Packages[idx].Action == ActionFail && (result.Packages[idx].Owner != "" || result.Packages[idx].Error != "") {
			continue
		}
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = owner
		result.Packages[idx].Error = message
		result.Packages[idx].Phases = failurePhases(owner)
	}
}

func markTypeCheckFailures(result *Result, owner Owner, message string) {
	message = strings.TrimSpace(message)
	if result == nil {
		return
	}
	for idx := range result.Packages {
		if !shouldCompilePackage(result.Packages[idx]) {
			continue
		}
		result.Packages[idx].Action = ActionFail
		result.Packages[idx].Owner = owner
		result.Packages[idx].Error = message
		result.Packages[idx].Phases.TypeCheck = PhaseStatusFail
		result.Packages[idx].Phases.Runtime = PhaseStatusSkip
	}
}

func failurePhases(owner Owner) PackagePhases {
	if owner == OwnerPackageGraph {
		return PackagePhases{
			Workspace: PhaseStatusSkip,
			Compile:   PhaseStatusFail,
			Emit:      PhaseStatusSkip,
			TypeCheck: PhaseStatusSkip,
			Runtime:   PhaseStatusSkip,
		}
	}
	return PackagePhases{
		Workspace: PhaseStatusFail,
		Compile:   PhaseStatusSkip,
		Emit:      PhaseStatusSkip,
		TypeCheck: PhaseStatusSkip,
		Runtime:   PhaseStatusSkip,
	}
}

func packageRunnerFile(idx int) string {
	return "runner-" + strconv.Itoa(idx) + ".ts"
}

func packageTSConfigFile(idx int) string {
	return "tsconfig-" + strconv.Itoa(idx) + ".json"
}

func browserVitestConfigFile(idx int) string {
	return "vitest-browser-" + strconv.Itoa(idx) + ".config.mts"
}

func renderPackageRunner(result PackageResult, req *normalizedRequest) string {
	if req.RuntimeBackend == RuntimeBackendBrowser {
		return renderBrowserRunner(result, req)
	}
	return renderRunner(result, req)
}

func renderRunner(result PackageResult, req *normalizedRequest) string {
	var b strings.Builder
	b.WriteString("import { runTests } from \"@goscript/testing/runner.js\"\n")
	imports := runnerImports(result.Tests)
	for idx, packagePath := range imports {
		b.WriteString("import * as pkg")
		b.WriteString(strconv.Itoa(idx))
		b.WriteString(" from ")
		b.WriteString(strconv.Quote("@goscript/" + packagePath + "/index.js"))
		b.WriteString("\n")
	}
	b.WriteString("\n")
	writeProcessChdir(&b, result.SourceDir)
	b.WriteString("const result = await runTests(")
	b.WriteString(strconv.Quote(result.PackagePath))
	b.WriteString(", [\n")
	writeRunnerTests(&b, "\t", result.Tests, func(test Test) string {
		return "pkg" + strconv.Itoa(slices.Index(imports, test.PackagePath))
	})
	b.WriteString("], { verbose: ")
	if req.Verbose {
		b.WriteString("true")
	} else {
		b.WriteString("false")
	}
	writeRunOptions(&b, req)
	b.WriteString(" })\n")
	b.WriteString("if (!result.ok) {\n\tthrow new Error(\"goscript test failed\")\n}\n")
	b.WriteString("if (typeof process !== \"undefined\" && process.exit) {\n\tprocess.exit(0)\n}\n")
	return b.String()
}

func renderBrowserRunner(result PackageResult, req *normalizedRequest) string {
	var b strings.Builder
	b.WriteString("import { hostFSReady } from \"./" + browserHostFSClientFile + "\"\n")
	b.WriteString("import { test } from \"vitest\"\n")
	b.WriteString("import { runTests } from \"@goscript/testing/runner.js\"\n")
	imports := runnerImports(result.Tests)
	for idx, packagePath := range imports {
		b.WriteString("import * as pkg")
		b.WriteString(strconv.Itoa(idx))
		b.WriteString(" from ")
		b.WriteString(strconv.Quote("@goscript/" + packagePath + "/index.js"))
		b.WriteString("\n")
	}
	b.WriteString("\n")
	b.WriteString("test(")
	b.WriteString(strconv.Quote(result.PackagePath))
	b.WriteString(", async () => {\n")
	b.WriteString("\tconst __goscriptResultPrefix = ")
	b.WriteString(strconv.Quote(combinedRuntimeResultPrefix))
	b.WriteString("\n")
	b.WriteString("\tconst __goscriptOriginalLog = console.log\n")
	b.WriteString("\tconst __goscriptLogs: string[] = []\n")
	b.WriteString("\tconst __goscriptStartedAt = Date.now()\n")
	b.WriteString("\tlet __goscriptOK = false\n")
	b.WriteString("\tlet __goscriptError: unknown = null\n")
	b.WriteString("\tconsole.log = (...args) => __goscriptLogs.push(args.map((arg) => String(arg)).join(' '))\n")
	writeRuntimeRecordFunction(&b, "\t")
	b.WriteString("\ttry {\n")
	b.WriteString("\t\tawait hostFSReady()\n")
	b.WriteString("\t\tconst result = await runTests(")
	b.WriteString(strconv.Quote(result.PackagePath))
	b.WriteString(", [\n")
	writeRunnerTests(&b, "\t\t\t", result.Tests, func(test Test) string {
		return "pkg" + strconv.Itoa(slices.Index(imports, test.PackagePath))
	})
	b.WriteString("\t\t], { verbose: ")
	if req.Verbose {
		b.WriteString("true")
	} else {
		b.WriteString("false")
	}
	writeRunOptions(&b, req)
	b.WriteString(" })\n")
	b.WriteString("\t\t__goscriptOK = result.ok\n")
	b.WriteString("\t\tif (!result.ok) {\n")
	b.WriteString("\t\t\t__goscriptError = new Error(\"goscript test failed\")\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t} catch (err) {\n")
	b.WriteString("\t\tconst exitCode = __goscriptProcessExitCode(err)\n")
	b.WriteString("\t\tif (exitCode !== null) {\n")
	b.WriteString("\t\t\t__goscriptLogs.push(\"goscript process exited with code \" + String(exitCode))\n")
	b.WriteString("\t\t\tif (exitCode === 0 && ")
	if req.PanicOnExit0 {
		b.WriteString("true")
	} else {
		b.WriteString("false")
	}
	b.WriteString(") {\n")
	b.WriteString("\t\t\t\t__goscriptOK = false\n")
	b.WriteString("\t\t\t\t__goscriptError = new Error(\"unexpected os.Exit(0) during test\")\n")
	b.WriteString("\t\t\t} else {\n")
	b.WriteString("\t\t\t\t__goscriptOK = exitCode === 0\n")
	b.WriteString("\t\t\t\tif (exitCode !== 0) {\n")
	b.WriteString("\t\t\t\t__goscriptError = new Error(\"goscript process exited with code \" + String(exitCode))\n")
	b.WriteString("\t\t\t\t}\n")
	b.WriteString("\t\t\t}\n")
	b.WriteString("\t\t} else {\n")
	b.WriteString("\t\t\t__goscriptOK = false\n")
	b.WriteString("\t\t\t__goscriptError = err\n")
	b.WriteString("\t\t\t__goscriptLogs.push(err && (err as Error).stack ? String((err as Error).stack) : String(err))\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t} finally {\n")
	b.WriteString("\t\tconsole.log = __goscriptOriginalLog\n")
	b.WriteString("\t\t__goscriptOriginalLog(__goscriptRuntimeRecord(")
	b.WriteString(strconv.Quote(result.PackagePath))
	b.WriteString(", __goscriptOK, Date.now() - __goscriptStartedAt, __goscriptLogs.join('\\n')))\n")
	b.WriteString("\t}\n")
	b.WriteString("\tif (__goscriptError) {\n")
	b.WriteString("\t\tthrow __goscriptError\n")
	b.WriteString("\t}\n")
	b.WriteString("})\n")
	b.WriteString("\n")
	b.WriteString("function __goscriptProcessExitCode(err: unknown): number | null {\n")
	b.WriteString("\tif (err === null || typeof err !== \"object\") {\n")
	b.WriteString("\t\treturn null\n")
	b.WriteString("\t}\n")
	b.WriteString("\tconst code = (err as { __goscriptExitCode?: unknown }).__goscriptExitCode\n")
	b.WriteString("\treturn typeof code === \"number\" ? code : null\n")
	b.WriteString("}\n")
	return b.String()
}

// combinedRuntimeRecord is one package result emitted by a grouped runtime process.
type combinedRuntimeRecord struct {
	PackagePath string
	OK          bool
	ElapsedMS   int64
	Output      string
}

func parseCombinedRuntimeRecords(output string) ([]combinedRuntimeRecord, bool) {
	// Read the line protocol without the reporter's terminal formatting.
	var records []combinedRuntimeRecord
	for line := range strings.SplitSeq(output, "\n") {
		line = runtimeStylePattern.ReplaceAllString(line, "")
		line = strings.TrimSuffix(line, "\r")
		if !strings.HasPrefix(line, combinedRuntimeResultPrefix) {
			continue
		}

		// Reject incomplete records rather than guessing a package's result.
		record, ok := parseCombinedRuntimeRecord(strings.TrimPrefix(line, combinedRuntimeResultPrefix))
		if !ok {
			return nil, false
		}
		records = append(records, record)
	}

	// A runtime must publish at least one package result.
	return records, len(records) != 0
}

func parseCombinedRuntimeRecord(line string) (combinedRuntimeRecord, bool) {
	packagePath, rest, ok := strings.Cut(line, "\t")
	if !ok {
		return combinedRuntimeRecord{}, false
	}
	okField, rest, ok := strings.Cut(rest, "\t")
	if !ok {
		return combinedRuntimeRecord{}, false
	}
	elapsedField, outputField, ok := strings.Cut(rest, "\t")
	if !ok {
		return combinedRuntimeRecord{}, false
	}
	packagePath, err := url.PathUnescape(packagePath)
	if err != nil || packagePath == "" {
		return combinedRuntimeRecord{}, false
	}
	output, err := url.PathUnescape(outputField)
	if err != nil {
		return combinedRuntimeRecord{}, false
	}
	elapsedMS, err := strconv.ParseInt(elapsedField, 10, 64)
	if err != nil {
		return combinedRuntimeRecord{}, false
	}
	switch okField {
	case "1", "true":
		return combinedRuntimeRecord{
			PackagePath: packagePath,
			OK:          true,
			ElapsedMS:   elapsedMS,
			Output:      output,
		}, true
	case "0", "false":
		return combinedRuntimeRecord{
			PackagePath: packagePath,
			ElapsedMS:   elapsedMS,
			Output:      output,
		}, true
	default:
		return combinedRuntimeRecord{}, false
	}
}

func renderCombinedRunner(result *Result, indexes []int, req *normalizedRequest) string {
	aliases := runnerImportAliases(result, indexes)
	var imports []string
	for packagePath := range aliases {
		imports = append(imports, packagePath)
	}
	slices.Sort(imports)

	var b strings.Builder
	b.WriteString("import { runTests } from \"@goscript/testing/runner.js\"\n")
	for _, packagePath := range imports {
		b.WriteString("import * as ")
		b.WriteString(aliases[packagePath])
		b.WriteString(" from ")
		b.WriteString(strconv.Quote("@goscript/" + packagePath + "/index.js"))
		b.WriteString("\n")
	}
	b.WriteString("\n")
	b.WriteString("const __goscriptResultPrefix = ")
	b.WriteString(strconv.Quote(combinedRuntimeResultPrefix))
	b.WriteString("\n")
	b.WriteString("const __goscriptOriginalLog = console.log\n")
	writeRuntimeRecordFunction(&b, "")
	b.WriteString("async function __goscriptRunPackage(packagePath, packageDir, tests) {\n")
	b.WriteString("\tif (packageDir && typeof process !== \"undefined\" && process.chdir) {\n")
	b.WriteString("\t\tprocess.chdir(packageDir)\n")
	b.WriteString("\t}\n")
	b.WriteString("\tconst logs = []\n")
	b.WriteString("\tconst startedAt = Date.now()\n")
	b.WriteString("\tlet ok = false\n")
	b.WriteString("\tconsole.log = (...args) => logs.push(args.map((arg) => String(arg)).join(' '))\n")
	b.WriteString("\ttry {\n")
	b.WriteString("\t\tconst result = await runTests(packagePath, tests, { verbose: ")
	if req.Verbose {
		b.WriteString("true")
	} else {
		b.WriteString("false")
	}
	writeRunOptions(&b, req)
	b.WriteString(" })\n")
	b.WriteString("\t\tok = result.ok\n")
	b.WriteString("\t} catch (err) {\n")
	b.WriteString("\t\tok = false\n")
	b.WriteString("\t\tlogs.push(err && err.stack ? String(err.stack) : String(err))\n")
	b.WriteString("\t} finally {\n")
	b.WriteString("\t\tconsole.log = __goscriptOriginalLog\n")
	b.WriteString("\t}\n")
	b.WriteString("\t__goscriptOriginalLog(__goscriptRuntimeRecord(packagePath, ok, Date.now() - startedAt, logs.join('\\n')))\n")
	b.WriteString("}\n\n")
	for _, idx := range indexes {
		pkg := result.Packages[idx]
		b.WriteString("await __goscriptRunPackage(")
		b.WriteString(strconv.Quote(pkg.PackagePath))
		b.WriteString(", ")
		b.WriteString(strconv.Quote(pkg.SourceDir))
		b.WriteString(", [\n")
		writeRunnerTests(&b, "\t", pkg.Tests, func(test Test) string {
			return aliases[test.PackagePath]
		})
		b.WriteString("])\n")
	}
	b.WriteString("if (typeof process !== \"undefined\" && process.exit) {\n\tprocess.exit(0)\n}\n")
	return b.String()
}

// writeRunnerTests writes the runTests entries for the given tests, each on
// its own line with the given indent, calling the test function exported by
// the module that alias returns for it.
func writeRunnerTests(b *strings.Builder, indent string, tests []Test, alias func(Test) string) {
	for idx, test := range tests {
		b.WriteString(indent)
		b.WriteString("{ name: ")
		b.WriteString(strconv.Quote(test.Name))
		b.WriteString(", fn: async (t) => await ")
		b.WriteString(alias(test))
		b.WriteString(".")
		b.WriteString(test.Name)
		b.WriteString("(t)")
		if test.Benchmark {
			b.WriteString(", benchmark: true")
		}
		b.WriteString(" }")
		if idx != len(tests)-1 {
			b.WriteString(",")
		}
		b.WriteString("\n")
	}
}

// writeRunOptions writes the runTests options that follow the verbose option.
func writeRunOptions(b *strings.Builder, req *normalizedRequest) {
	// Count and short are always passed; the benchmark time only with -bench.
	b.WriteString(", count: ")
	b.WriteString(strconv.Itoa(req.Count))
	b.WriteString(", short: ")
	b.WriteString(strconv.FormatBool(req.Short))
	if req.Bench != "" {
		b.WriteString(", benchtime: ")
		b.WriteString(strconv.FormatInt(req.BenchTime.Milliseconds(), 10))
	}
}

func writeRuntimeRecordFunction(b *strings.Builder, indent string) {
	b.WriteString(indent)
	b.WriteString("function __goscriptRuntimeRecord(packagePath: string, ok: boolean, elapsedMs: number, output: string): string {\n")
	b.WriteString(indent)
	b.WriteString("\treturn __goscriptResultPrefix + encodeURIComponent(packagePath) + \"\\t\" + (ok ? \"1\" : \"0\") + \"\\t\" + String(elapsedMs) + \"\\t\" + encodeURIComponent(output)\n")
	b.WriteString(indent)
	b.WriteString("}\n")
}

func writeProcessChdir(b *strings.Builder, dir string) {
	if dir == "" {
		return
	}
	b.WriteString("if (typeof process !== \"undefined\" && process.chdir) {\n")
	b.WriteString("\tprocess.chdir(")
	b.WriteString(strconv.Quote(dir))
	b.WriteString(")\n")
	b.WriteString("}\n")
}

func runnerImportAliases(result *Result, indexes []int) map[string]string {
	seen := make(map[string]bool)
	var imports []string
	for _, idx := range indexes {
		if result == nil || idx < 0 || idx >= len(result.Packages) {
			continue
		}
		for _, packagePath := range runnerImports(result.Packages[idx].Tests) {
			if seen[packagePath] {
				continue
			}
			seen[packagePath] = true
			imports = append(imports, packagePath)
		}
	}
	slices.Sort(imports)
	aliases := make(map[string]string, len(imports))
	for idx, packagePath := range imports {
		aliases[packagePath] = "pkg" + strconv.Itoa(idx)
	}
	return aliases
}

func runnerImports(tests []Test) []string {
	seen := make(map[string]bool)
	var imports []string
	for _, test := range tests {
		if test.PackagePath == "" || seen[test.PackagePath] {
			continue
		}
		seen[test.PackagePath] = true
		imports = append(imports, test.PackagePath)
	}
	slices.Sort(imports)
	return imports
}

func processErrorText(result tsworkspace.Result) string {
	output := strings.TrimSpace(result.Output)
	if output != "" {
		return output
	}
	return result.Error
}

func aggregateTypeCheckFailureOwner(output string) (Owner, bool) {
	owner := classifyProcessOutput(output)
	// Package-scoped fallback is worth paying for package-local emitted
	// TypeScript errors. Shared override package failures are independent of
	// the runner file, so rerunning tsrs per package only repeats the same
	// expensive project error.
	if owner == OwnerOverridePackage {
		return owner, true
	}
	return "", false
}

// browserLaunchOptions returns the Playwright provider options that select
// the browser channel and arguments, or "" for the defaults.
func browserLaunchOptions(req *normalizedRequest) string {
	// Each request field selects one Playwright launch option.
	var options []string
	if req.BrowserChannel != "" {
		options = append(options, "channel: "+strconv.Quote(req.BrowserChannel))
	}
	if len(req.BrowserArgs) > 0 {
		args := make([]string, len(req.BrowserArgs))
		for i, arg := range req.BrowserArgs {
			args[i] = strconv.Quote(arg)
		}
		options = append(options, "args: ["+strings.Join(args, ", ")+"]")
	}

	// Without options the provider keeps its defaults.
	if len(options) == 0 {
		return ""
	}
	return "{ launchOptions: { " + strings.Join(options, ", ") + " } }"
}

func renderBrowserVitestConfig(req *normalizedRequest, runnerFile string, sourceDir string) string {
	// Paths are written with forward slashes, and the timeouts default to 30 s.
	outputRoot := filepath.ToSlash(req.OutputRoot)
	runnerFile = filepath.ToSlash(runnerFile)
	timeoutMS := int64(30000)
	if req.Timeout > 0 {
		timeoutMS = int64(req.Timeout / time.Millisecond)
	}

	// The config runs the package's runner file.
	var b strings.Builder
	b.WriteString("import { defineConfig } from \"vitest/config\"\n")
	b.WriteString("import { playwright } from \"@vitest/browser-playwright\"\n")
	b.WriteString("import { hostFS } from \"./" + browserHostFSServerFile + "\"\n\n")
	b.WriteString("export default defineConfig({\n")
	b.WriteString("  test: {\n")
	b.WriteString("    include: [")
	b.WriteString(strconv.Quote(runnerFile))
	b.WriteString("],\n")

	// The tests run in headless Chromium.
	// The browser API server listens on 127.0.0.1 rather than localhost, so
	// that the page opens the address it listens on. With localhost, a server
	// started while another test run's server holds the port on ::1 binds the
	// same port on 127.0.0.1, and the browser, resolving localhost to ::1,
	// connects to the other run's server and never reaches its own.
	b.WriteString("    browser: {\n")
	b.WriteString("      enabled: true,\n")
	b.WriteString("      headless: true,\n")
	b.WriteString("      api: { host: \"127.0.0.1\" },\n")
	b.WriteString("      provider: playwright(")
	b.WriteString(browserLaunchOptions(req))
	b.WriteString("),\n")
	b.WriteString("      instances: [{ browser: \"chromium\" }],\n")

	// The page reads the host filesystem through a browser command.
	b.WriteString("      commands: { " + browserHostFSCommand + ": hostFS(")
	b.WriteString(strconv.Quote(filepath.ToSlash(sourceDir)))
	b.WriteString(") },\n")
	b.WriteString("    },\n")

	// Tests and hooks share the run's timeout.
	b.WriteString("    testTimeout: ")
	b.WriteString(strconv.FormatInt(timeoutMS, 10))
	b.WriteString(",\n")
	b.WriteString("    hookTimeout: ")
	b.WriteString(strconv.FormatInt(timeoutMS, 10))
	b.WriteString(",\n")
	b.WriteString("  },\n")

	// GoScript module imports resolve to the compiled TypeScript output.
	b.WriteString("  resolve: {\n")
	b.WriteString("    alias: [\n")
	b.WriteString("      { find: /^@goscript\\/(.*)\\.js$/, replacement: ")
	b.WriteString(strconv.Quote(outputRoot + "/@goscript/$1.ts"))
	b.WriteString(" },\n")

	// Other GoScript paths resolve as they are, and the config ends.
	b.WriteString("      { find: /^@goscript\\/(.*)$/, replacement: ")
	b.WriteString(strconv.Quote(outputRoot + "/@goscript/$1"))
	b.WriteString(" },\n")
	b.WriteString("    ],\n")
	b.WriteString("  },\n")
	b.WriteString("})\n")
	return b.String()
}

func renderTypeScriptProject(req *normalizedRequest, runnerFile string, projectFile string, nodeTypesAvailable bool) string {
	var b strings.Builder
	b.WriteString("{\n")
	b.WriteString("  \"compilerOptions\": {\n")
	b.WriteString("    \"target\": \"ES2022\",\n")
	b.WriteString("    \"module\": \"ESNext\",\n")
	b.WriteString("    \"moduleResolution\": \"Bundler\",\n")
	b.WriteString("    \"lib\": [\"ESNext\", \"DOM\"],\n")
	b.WriteString("    \"strict\": true,\n")
	b.WriteString("    \"skipLibCheck\": true,\n")
	b.WriteString("    \"allowImportingTsExtensions\": true,\n")
	if req.IncrementalTypeCheck {
		b.WriteString("    \"incremental\": true,\n")
		b.WriteString("    \"tsBuildInfoFile\": ")
		b.WriteString(strconv.Quote(typeScriptBuildInfoFile(projectFile)))
		b.WriteString(",\n")
	}
	b.WriteString("    \"noEmit\": true,\n")
	if nodeTypesAvailable {
		b.WriteString("    \"types\": [\"node\"],\n")
	} else {
		b.WriteString("    \"types\": [],\n")
	}
	b.WriteString("    \"paths\": {\n")
	if req.RuntimeBackend == RuntimeBackendBrowser {
		b.WriteString("      \"vitest\": [\"./" + browserAmbientTypesFile + "\"],\n")
		b.WriteString("      \"vitest/browser\": [\"./" + browserAmbientTypesFile + "\"],\n")
	}
	b.WriteString("      \"*\": [\"./*\"],\n")
	b.WriteString("      \"@goscript/*\": [")
	b.WriteString(strconv.Quote(typeScriptOutputAlias(req)))
	b.WriteString("]\n")
	b.WriteString("    }\n")
	b.WriteString("  },\n")
	if req.RuntimeBackend == RuntimeBackendBrowser {
		b.WriteString("  \"include\": [")
		b.WriteString(strconv.Quote(runnerFile))
		b.WriteString(", ")
		b.WriteString(strconv.Quote(browserAmbientTypesFile))
	} else {
		b.WriteString("  \"include\": [")
		b.WriteString(strconv.Quote(runnerFile))
		b.WriteString(", ")
		b.WriteString(strconv.Quote(tsworkspace.NodeAmbientTypesFile))
	}
	b.WriteString("]\n")
	b.WriteString("}\n")
	return b.String()
}

func renderRuntimeTypeScriptProject(req *normalizedRequest, nodeTypesAvailable bool) string {
	var b strings.Builder
	b.WriteString("{\n")
	b.WriteString("  \"compilerOptions\": {\n")
	b.WriteString("    \"target\": \"ES2022\",\n")
	b.WriteString("    \"module\": \"ESNext\",\n")
	b.WriteString("    \"moduleResolution\": \"Bundler\",\n")
	b.WriteString("    \"lib\": [\"ESNext\", \"DOM\"],\n")
	b.WriteString("    \"strict\": true,\n")
	b.WriteString("    \"skipLibCheck\": true,\n")
	b.WriteString("    \"allowImportingTsExtensions\": true,\n")
	if req.IncrementalTypeCheck {
		b.WriteString("    \"incremental\": true,\n")
		b.WriteString("    \"tsBuildInfoFile\": ")
		b.WriteString(strconv.Quote(typeScriptBuildInfoFile("tsconfig.json")))
		b.WriteString(",\n")
	}
	b.WriteString("    \"noEmit\": true,\n")
	if nodeTypesAvailable {
		b.WriteString("    \"types\": [\"node\"],\n")
	} else {
		b.WriteString("    \"types\": [],\n")
	}
	b.WriteString("    \"paths\": {\n")
	if req.RuntimeBackend == RuntimeBackendBrowser {
		b.WriteString("      \"vitest\": [\"./" + browserAmbientTypesFile + "\"],\n")
		b.WriteString("      \"vitest/browser\": [\"./" + browserAmbientTypesFile + "\"],\n")
	}
	b.WriteString("      \"*\": [\"./*\"],\n")
	b.WriteString("      \"@goscript/*\": [")
	b.WriteString(strconv.Quote(typeScriptOutputAlias(req)))
	b.WriteString("]\n")
	b.WriteString("    }\n")
	b.WriteString("  },\n")
	if req.RuntimeBackend == RuntimeBackendBrowser {
		b.WriteString("  \"include\": [\"runner-*.ts\", ")
		b.WriteString(strconv.Quote(browserAmbientTypesFile))
	} else {
		b.WriteString("  \"include\": [\"runner-*.ts\", ")
		b.WriteString(strconv.Quote(tsworkspace.NodeAmbientTypesFile))
	}
	b.WriteString("]\n")
	b.WriteString("}\n")
	return b.String()
}

func typeScriptBuildInfoFile(projectFile string) string {
	name := strings.TrimSuffix(projectFile, filepath.Ext(projectFile))
	if name == "" {
		name = "tsconfig"
	}
	return ".goscript/" + name + ".tsbuildinfo"
}

// typeScriptOutputAlias returns the workspace-relative path pattern that
// @goscript imports resolve to under the output root.
func typeScriptOutputAlias(req *normalizedRequest) string {
	outputRoot := req.OutputRoot
	if rel, err := filepath.Rel(req.WorkDir, outputRoot); err == nil {
		outputRoot = rel
	}
	return "./" + filepath.ToSlash(filepath.Join(outputRoot, "@goscript", "*"))
}

func markCompilePhase(pkg *PackageResult, result *compiler.CompilationResult, passed bool) {
	if pkg == nil {
		return
	}
	if passed {
		pkg.Phases.Compile = PhaseStatusPass
		pkg.Phases.Emit = PhaseStatusPass
		return
	}
	if classifyDiagnostics(resultDiagnostics(result)) == OwnerTypeScriptEmitter {
		pkg.Phases.Compile = PhaseStatusPass
		pkg.Phases.Emit = PhaseStatusFail
		return
	}
	pkg.Phases.Compile = PhaseStatusFail
	pkg.Phases.Emit = PhaseStatusSkip
}

func resultDiagnostics(result *compiler.CompilationResult) []compiler.Diagnostic {
	if result == nil {
		return nil
	}
	return result.Diagnostics
}

func classifyDiagnostics(diagnostics []compiler.Diagnostic) Owner {
	for _, diagnostic := range diagnostics {
		switch {
		case strings.HasPrefix(diagnostic.Code, "goscript/package-graph"):
			return OwnerPackageGraph
		case strings.HasPrefix(diagnostic.Code, "goscript/semantic"):
			return OwnerSemanticModel
		case strings.HasPrefix(diagnostic.Code, "goscript/lowering"):
			return OwnerLowering
		case strings.HasPrefix(diagnostic.Code, "goscript/emitter"):
			return OwnerTypeScriptEmitter
		case strings.HasPrefix(diagnostic.Code, "goscript/overrides"):
			return OwnerOverridePackage
		case strings.HasPrefix(diagnostic.Code, "goscript/runtime"):
			return OwnerRuntimePackage
		}
	}
	return OwnerTestRunner
}

func classifyProcessOutput(output string) Owner {
	switch {
	case strings.Contains(output, "@goscript/testing") || strings.Contains(output, "@goscript/"):
		return OwnerOverridePackage
	case strings.Contains(output, "TypeScript") || strings.Contains(output, "TS"):
		return OwnerTypeScriptEmitter
	case strings.Contains(output, "panic") || strings.Contains(output, "runtime"):
		return OwnerRuntimePackage
	default:
		return OwnerTestRunner
	}
}

func diagnosticsHaveErrors(diagnostics []compiler.Diagnostic) bool {
	for _, diagnostic := range diagnostics {
		if diagnostic.Severity == compiler.DiagnosticSeverityError {
			return true
		}
	}
	return false
}

func diagnosticsSummary(diagnostics []compiler.Diagnostic) string {
	return compiler.FormatDiagnostics(diagnostics)
}

// runtimeDependencies returns the npm packages that the GoScript runtime
// declares and that the output under outputRoot imports, mapping each package
// name to its version.
func runtimeDependencies(outputRoot string) (map[string]string, error) {
	declared, err := goscript.RuntimeDependencies()
	if err != nil {
		return nil, errors.Wrap(err, "read GoScript runtime npm dependencies")
	}
	return tsworkspace.ImportedPackages(outputRoot, declared)
}
