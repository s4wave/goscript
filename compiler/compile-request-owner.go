package compiler

import (
	"os"
	"path/filepath"
	"slices"
	"strings"
)

// CompileRequestOwner owns adapter input normalization and validation.
type CompileRequestOwner struct{}

// NewCompileRequestOwner creates a compile request owner.
func NewCompileRequestOwner() *CompileRequestOwner {
	return &CompileRequestOwner{}
}

// NewRequest builds a request from public compiler config and package patterns.
func (o *CompileRequestOwner) NewRequest(conf Config, patterns []string) *CompileRequest {
	dir := conf.Dir
	if dir == "" {
		dir = "."
	}

	dependencyMode := DependencyModeRequested
	if conf.AllDependencies {
		dependencyMode = DependencyModeAll
	}
	runtimeEmissionMode := RuntimeEmissionModeEmit
	if conf.DisableEmitBuiltin {
		runtimeEmissionMode = RuntimeEmissionModeReference
	}

	return &CompileRequest{
		Patterns:                  normalizePatterns(patterns),
		Dir:                       strings.TrimSpace(dir),
		OutputPath:                strings.TrimSpace(conf.OutputPath),
		CacheRoot:                 strings.TrimSpace(conf.CacheRoot),
		BuildFlags:                slices.Clone(conf.BuildFlags),
		OverrideDirs:              slices.Clone(conf.OverrideDirs),
		PackageBlocklist:          normalizePackageBlocklist(conf.PackageBlocklist),
		DependencyMode:            dependencyMode,
		RuntimeEmissionMode:       runtimeEmissionMode,
		ProtobufTypeScriptBinding: conf.ProtobufTypeScriptBinding,
		AllDependencies:           conf.AllDependencies,
		DisableEmitBuiltin:        conf.DisableEmitBuiltin,
	}
}

// Validate returns request diagnostics that must stop compilation before output.
func (o *CompileRequestOwner) Validate(req *CompileRequest) []Diagnostic {
	if req == nil {
		return []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:nil",
			Message:  "compile request is nil",
		}}
	}

	var diagnostics []Diagnostic
	if len(req.Patterns) == 0 {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:no-packages",
			Message:  "at least one Go package pattern is required",
			Detail:   "Use goscript compile --package . from inside a Go module.",
		})
	}
	if strings.TrimSpace(req.OutputPath) == "" {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:no-output",
			Message:  "output path root must be specified",
		})
	}
	if strings.TrimSpace(req.Dir) == "" {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:no-working-dir",
			Message:  "working directory must be specified",
		})
	} else {
		info, err := os.Stat(req.Dir)
		switch {
		case err != nil:
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:working-dir",
				Message:  "working directory is not readable",
				Detail:   err.Error(),
			})
		case !info.IsDir():
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:working-dir",
				Message:  "working directory must be a directory",
			})
		case !hasGoMod(req.Dir):
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:no-module",
				Message:  "working directory is not inside a Go module",
				Detail:   "Run goscript from a directory containing go.mod, or pass --dir for a module directory.",
			})
		}
	}
	if req.DependencyMode != DependencyModeRequested && req.DependencyMode != DependencyModeAll {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:dependency-mode",
			Message:  "dependency mode is invalid",
		})
	}
	if req.RuntimeEmissionMode != RuntimeEmissionModeEmit &&
		req.RuntimeEmissionMode != RuntimeEmissionModeReference {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/request:runtime-emission-mode",
			Message:  "runtime emission mode is invalid",
		})
	}
	for _, flag := range req.BuildFlags {
		if strings.TrimSpace(flag) == "" {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:empty-build-flag",
				Message:  "build flags must not contain empty values",
			})
		}
	}
	for _, dir := range req.OverrideDirs {
		dir = strings.TrimSpace(dir)
		if dir == "" {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:empty-override-dir",
				Message:  "override directories must not be empty",
			})
			continue
		}
		info, err := os.Stat(dir)
		switch {
		case err != nil:
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:override-dir",
				Message:  "override directory is not readable",
				Detail:   err.Error(),
			})
		case !info.IsDir():
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:override-dir",
				Message:  "override path must be a directory",
				Detail:   dir,
			})
		}
	}

	for _, pattern := range req.Patterns {
		trimmed := strings.TrimSpace(pattern)
		if trimmed == "" {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:empty-package",
				Message:  "package pattern must not be empty",
			})
			continue
		}
		if strings.HasSuffix(filepath.Base(trimmed), ".go") {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/request:single-file-unsupported",
				Message:  "single-file compilation is not supported by the v2 compiler",
				Detail:   "Use a package pattern such as . or ./path from inside a Go module.",
			})
		}
	}

	return diagnostics
}

func normalizePatterns(patterns []string) []string {
	if len(patterns) == 0 {
		return nil
	}

	normalized := make([]string, 0, len(patterns))
	for _, pattern := range patterns {
		normalized = append(normalized, strings.TrimSpace(pattern))
	}
	return normalized
}

func normalizePackageBlocklist(paths []string) []string {
	var normalized []string
	seen := make(map[string]bool)
	for _, path := range paths {
		for part := range strings.SplitSeq(path, ",") {
			part = strings.TrimSpace(part)
			if part == "" || seen[part] {
				continue
			}
			seen[part] = true
			normalized = append(normalized, part)
		}
	}
	return normalized
}

func hasGoMod(dir string) bool {
	abs, err := filepath.Abs(dir)
	if err != nil {
		return false
	}

	for {
		if _, err := os.Stat(filepath.Join(abs, "go.mod")); err == nil {
			return true
		}
		parent := filepath.Dir(abs)
		if parent == abs {
			return false
		}
		abs = parent
	}
}
