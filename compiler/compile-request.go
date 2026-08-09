package compiler

// DependencyMode describes how much of the loaded package graph to keep.
type DependencyMode string

const (
	// DependencyModeRequested keeps only requested package nodes.
	DependencyModeRequested DependencyMode = "requested"
	// DependencyModeAll keeps reachable dependency package nodes.
	DependencyModeAll DependencyMode = "all"
)

// RuntimeEmissionMode describes how runtime packages should be handled.
type RuntimeEmissionMode string

const (
	// RuntimeEmissionModeEmit emits required runtime packages with output.
	RuntimeEmissionModeEmit RuntimeEmissionMode = "emit"
	// RuntimeEmissionModeReference references runtime packages without emitting them.
	RuntimeEmissionModeReference RuntimeEmissionMode = "reference"
)

// CompileRequest describes one compiler invocation after adapter normalization.
type CompileRequest struct {
	// Patterns are the Go package patterns requested by the caller.
	Patterns []string
	// Dir is the working directory for package loading.
	Dir string
	// OutputPath is the root where TypeScript output would be written.
	OutputPath string
	// CacheRoot is the explicit compiler cache root. Empty disables caching.
	CacheRoot string
	// BuildFlags are forwarded to the Go package loader.
	BuildFlags []string
	// OverrideDirs are additional GoScript override roots.
	OverrideDirs []string
	// PackageBlocklist rejects package paths in the loaded dependency closure.
	PackageBlocklist []string
	// DependencyMode controls whether dependencies are included in the graph.
	DependencyMode DependencyMode
	// RuntimeEmissionMode controls runtime package emission policy.
	RuntimeEmissionMode RuntimeEmissionMode
	// ProtobufTypeScriptBinding binds .pb.go files to sibling .pb.ts files.
	ProtobufTypeScriptBinding bool
	// Tests controls whether package loading includes Go package-test variants.
	Tests bool
	// AllDependencies controls whether the package graph should include deps.
	AllDependencies bool
	// DisableEmitBuiltin controls whether runtime packages are emitted.
	DisableEmitBuiltin bool
}
