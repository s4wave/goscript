package compiler

import (
	"context"
	"os"
	"path/filepath"
	"slices"
	"strings"
)

// OverrideMetadata describes compiler-visible facts from a package override.
type OverrideMetadata struct {
	// Dependencies are override package dependencies.
	Dependencies []string
	// NativeDependencies are Go packages whose types the override exposes
	// through its API. The graph lowers them from their Go source, so code
	// that reaches them through the override, such as a method call on a
	// result, can import them.
	NativeDependencies []string
	// SourceWhenImported names packages whose import by a package the
	// program compiles from Go source makes the program compile this package
	// from its Go source too. An override that implements only part of a
	// package family, such as encoding/json without encoding/json/v2, yields
	// to the source of the whole family in a program that reaches the rest.
	SourceWhenImported []string
	// AsyncFunctions maps package-level function names to async status.
	AsyncFunctions map[string]bool
	// CallbackAsyncFunctions maps package-level function names, or
	// Type.Method keys, that call their function arguments before returning.
	// Such a function returns a promise only when an argument does, so a call
	// suspends exactly when one of its function arguments can.
	CallbackAsyncFunctions map[string]bool
	// AsyncMethods maps Type.Method keys to async status.
	AsyncMethods map[string]bool
	// AsyncCallbacks maps a function name or Type.Method key to the names of
	// its function-typed parameters the runtime stores and awaits. A function
	// literal passed for one lowers as an async function, so its interface
	// calls await.
	AsyncCallbacks map[string][]string
	// AsyncWhenMethods maps a package-level function name or Type.Method key
	// to method names. The function or method is async in a program where a
	// compiled method with one of those names is async, such as json.Marshal
	// with an async MarshalJSON, and synchronous otherwise. The builtin
	// package's metadata keys universe objects, such as error.Error.
	AsyncWhenMethods map[string][]string
	// FuncValueMakers names the functions and Type.Method keys that make
	// function values of any type at run time, such as reflect.MakeFunc. A
	// program that uses one can obtain such a value by asserting a func type
	// from an interface value, so calls of that type stay async.
	FuncValueMakers map[string]bool
	// SyncInterfaces names interfaces the package declares whose methods
	// no override value suspends in, except the methods of named override
	// types that metadata marks async. In a whole program such an interface
	// is closed over the graph like a compiled one, and so is any interface
	// whose methods all appear in one.
	SyncInterfaces map[string]bool
	// AsyncWhenOperands names the asyncWhenMethods functions that call the
	// methods they list only on the values of their arguments, by the rules
	// of fmt: Error, Format, GoString and String. A call of one is async only
	// when the static types of its operands allow an async such method.
	AsyncWhenOperands map[string]bool
	// AsyncWhenFields maps a Type.Method key to the func-typed fields of the
	// receiver that the method calls, such as sync.Pool.Get's New. The method
	// suspends exactly when a call through one of them may.
	AsyncWhenFields map[string][]string
	// TransientPointerFunctions names the package-level functions that only
	// read and write through their pointer parameters during the call, as
	// sync/atomic.LoadInt64 does, so that a caller can pass them a new
	// reference to a field (see markTransientPointers).
	TransientPointerFunctions map[string]bool
	// SuspendingValues names the package-level functions whose
	// function values suspend: the function results they return and the
	// callbacks they pass to their function arguments, as iter.Pull's next
	// and stop and the yield it passes to its sequence do. Calls through
	// values of those types, instantiated at each call, are async.
	SuspendingValues map[string]bool
	// TypeArgFunctions names the package-level generic functions whose
	// TypeScript takes the descriptor of their type arguments as the first
	// argument, as iter.Pull does to return the zero value of V.
	TypeArgFunctions map[string]bool
	// CallSiteFunctions names the package-level functions whose TypeScript
	// takes the Go position of each direct call as one more argument after
	// their parameters, as runtime.Caller does to report the frames of
	// functions that //goscript:callsite marks (see lowering-call-sites.go).
	CallSiteFunctions map[string]bool
}

// OverrideRegistryOwner owns GoScript override package metadata and copy plans.
type OverrideRegistryOwner struct {
	overrideDirs []string
	facts        *OverrideFacts
}

// NewOverrideRegistryOwner creates the override registry owner.
func NewOverrideRegistryOwner(overrideDirs ...string) *OverrideRegistryOwner {
	return &OverrideRegistryOwner{overrideDirs: slices.Clone(overrideDirs)}
}

// Facts returns the immutable compiler-visible override facts.
func (o *OverrideRegistryOwner) Facts(ctx context.Context) (*OverrideFacts, []Diagnostic) {
	if o == nil {
		o = NewOverrideRegistryOwner()
	}
	if o.facts != nil {
		return o.facts, nil
	}
	facts, diagnostics := buildOverrideFacts(ctx, o.overrideDirs)
	if diagnosticsHaveErrors(diagnostics) {
		return facts, diagnostics
	}
	o.facts = facts
	return facts, diagnostics
}

// Metadata returns compiler-visible override metadata for a package path.
func (o *OverrideRegistryOwner) Metadata(pkgPath string) (*OverrideMetadata, error) {
	facts, diagnostics := o.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		return nil, NewCompileError(diagnostics)
	}
	metadata := facts.Metadata(pkgPath)
	return &metadata, nil
}

// CopyPlan builds the ordered override package copy plan for a request.
func (o *OverrideRegistryOwner) CopyPlan(
	ctx context.Context,
	req *CompileRequest,
	graph *PackageGraph,
) (*overrideCopyPlan, []Diagnostic) {
	if o == nil {
		o = NewOverrideRegistryOwner()
	}
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	plan := &overrideCopyPlan{}
	if req == nil || req.RuntimeEmissionMode == RuntimeEmissionModeReference {
		return plan, nil
	}
	if graph == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:no-graph",
			Message:  "override copy planning requires a package graph",
		}}
	}
	facts, diagnostics := o.Facts(ctx)
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}

	visiting := make(map[string]bool)
	visited := make(map[string]bool)
	diagnostics = append(diagnostics, o.addPackageToPlan(ctx, facts, plan, "builtin", visiting, visited)...)
	for _, node := range graph.Nodes {
		if node.OverrideCandidate {
			diagnostics = append(diagnostics, o.addPackageToPlan(ctx, facts, plan, node.PkgPath, visiting, visited)...)
		}
	}
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}
	return plan, diagnostics
}

// CopyPackages writes override packages from a copy plan to the request output tree.
func (o *OverrideRegistryOwner) CopyPackages(
	ctx context.Context,
	req *CompileRequest,
	plan *overrideCopyPlan,
) ([]string, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if req == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:no-request",
			Message:  "override package copying requires a compile request",
		}}
	}
	if plan == nil || len(plan.packages) == 0 {
		return nil, nil
	}

	var copied []string
	var diagnostics []Diagnostic
	for _, pkg := range plan.packages {
		if err := ctx.Err(); err != nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/context:canceled",
				Message:  err.Error(),
			})
			break
		}
		for _, file := range pkg.files {
			dest := filepath.Join(req.OutputPath, "@goscript", filepath.FromSlash(file.path))
			if err := os.MkdirAll(filepath.Dir(dest), 0o755); err != nil {
				diagnostics = append(diagnostics, overrideError("create override output", file.path, err))
				continue
			}
			if err := os.WriteFile(dest, file.data, 0o644); err != nil {
				diagnostics = append(diagnostics, overrideError("write override file", file.path, err))
			}
		}
		copied = append(copied, pkg.path)
	}
	return copied, diagnostics
}

// IsMethodAsync returns true when override metadata marks a method async.
func (o *OverrideRegistryOwner) IsMethodAsync(pkgPath, method string) (bool, error) {
	facts, diagnostics := o.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		return false, NewCompileError(diagnostics)
	}
	return facts.IsMethodAsync(pkgPath, method), nil
}

// IsFunctionAsync returns true when override metadata marks a package-level function async.
func (o *OverrideRegistryOwner) IsFunctionAsync(pkgPath, function string) (bool, error) {
	facts, diagnostics := o.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		return false, NewCompileError(diagnostics)
	}
	return facts.IsFunctionAsync(pkgPath, function), nil
}

type overrideCopyPlan struct {
	packages []overrideCopyPackage
}

type overrideCopyPackage struct {
	path  string
	files []overrideCopyFile
}

type overrideCopyFile struct {
	path string
	data []byte
}

func (o *OverrideRegistryOwner) addPackageToPlan(
	ctx context.Context,
	facts *OverrideFacts,
	plan *overrideCopyPlan,
	pkgPath string,
	visiting map[string]bool,
	visited map[string]bool,
) []Diagnostic {
	if err := ctx.Err(); err != nil {
		return []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if visited[pkgPath] {
		return nil
	}
	if visiting[pkgPath] {
		return []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:dependency-cycle",
			Message:  "override package dependencies contain a cycle",
			Detail:   pkgPath,
		}}
	}

	pkg, dependencies, ok := facts.copyPackage(pkgPath)
	if !ok {
		return []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:missing-package",
			Message:  "override package does not exist",
			Detail:   pkgPath,
		}}
	}
	visiting[pkgPath] = true
	var diagnostics []Diagnostic
	for _, dependency := range dependencies {
		diagnostics = append(diagnostics, o.addPackageToPlan(ctx, facts, plan, dependency, visiting, visited)...)
	}
	delete(visiting, pkgPath)
	if diagnosticsHaveErrors(diagnostics) {
		return diagnostics
	}

	visited[pkgPath] = true
	plan.packages = append(plan.packages, pkg)
	return diagnostics
}

func isOverrideSourceFile(filePath string) bool {
	return strings.HasSuffix(filePath, ".ts") && !strings.HasSuffix(filePath, ".test.ts")
}

func scanOverrideImports(data string) []string {
	imports := make(map[string]bool)
	for line := range strings.SplitSeq(data, "\n") {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "//") {
			continue
		}
		for _, quote := range []string{"\"", "'"} {
			prefix := quote + "@goscript/"
			remaining := line
			for {
				idx := strings.Index(remaining, prefix)
				if idx < 0 {
					break
				}
				remaining = remaining[idx+len(quote):]
				end := strings.Index(remaining, quote)
				if end < 0 {
					break
				}
				imports[remaining[:end]] = true
				remaining = remaining[end+len(quote):]
			}
		}
	}
	result := make([]string, 0, len(imports))
	for imported := range imports {
		result = append(result, imported)
	}
	slices.Sort(result)
	return result
}

func overrideError(action, detail string, err error) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/overrides:io",
		Message:  "failed to " + action,
		Detail:   strings.TrimSpace(detail + " " + err.Error()),
	}
}
