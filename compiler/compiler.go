// Package compiler translates Go packages into TypeScript.
//
// Compiler is the public adapter: NewCompiler validates a Config and
// CompilePackages turns package patterns into a CompileRequest for
// CompileService, which owns the pipeline. Compile runs one request through
// these owners in order:
//
//   - CompileRequestOwner validates the request.
//   - PackageGraphOwner loads the package graph with go/packages for
//     GOOS=js, GOARCH=wasm and CGO_ENABLED=0. DependencyModeAll follows every
//     dependency; DependencyModeRequested compiles only the named packages.
//   - OverrideRegistryOwner plans which hand-written packages from the
//     override directories (the gs/ tree) replace Go packages, and reports
//     the facts they declare, such as which of their functions are async.
//     An overridden package is not compiled, and the graph follows only the
//     dependencies its metadata names, not its Go imports.
//   - PackageGraphOwner type-checks the graph, and OverrideParityVerifier
//     checks that each override exports the API of the Go package it
//     replaces.
//   - SemanticModelOwner builds the SemanticModel. It colors every function
//     that may suspend as async. The coloring starts from the functions
//     whose own bodies suspend, the async facts of overrides and the
//     interface methods marked //goscript:async, and spreads through
//     callers, function values and interface implementations.
//   - LoweringOwner lowers the model into a LoweredProgram.
//   - TypeScriptEmitOwner writes one TypeScript package per lowered package,
//     and OverrideRegistryOwner copies the override packages beside them.
//
// Each stage appends to the request's diagnostics. The first stage that
// reports an error stops the compile, and Compile returns the diagnostics in
// both the CompilationResult and a CompileError.
//
// CompilerCacheOwner keeps a content-keyed cache beside the pipeline. A whole
// program whose inputs are unchanged replays without checking; otherwise a
// package whose stored body summary still applies is checked without bodies,
// and a package whose closure is unchanged replays its emitted output instead
// of being lowered again. RuntimeContractOwner names the TypeScript runtime
// that lowered and emitted code calls.
package compiler

import (
	"context"

	"github.com/sirupsen/logrus"
	"golang.org/x/tools/go/packages"
)

// Compiler is the public Go adapter for the v2 compile service.
type Compiler struct {
	le      *logrus.Entry
	config  Config
	service *CompileService
}

// NewCompiler builds a compiler adapter over the v2 compile service.
func NewCompiler(conf *Config, le *logrus.Entry, _ *packages.Config) (*Compiler, error) {
	if err := conf.Validate(); err != nil {
		return nil, err
	}

	return &Compiler{
		le:      le,
		config:  *conf,
		service: NewCompileService(conf.OverrideDirs...),
	}, nil
}

// CompilePackages compiles Go package patterns through the v2 pipeline.
func (c *Compiler) CompilePackages(ctx context.Context, patterns ...string) (*CompilationResult, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}

	if c.le != nil {
		c.le.Debugf("goscript v2 compile request: %v", patterns)
	}
	request := c.service.RequestOwner().NewRequest(c.config, patterns)
	return c.service.Compile(ctx, request)
}
