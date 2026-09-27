package compiler

import (
	"context"
	"maps"
	"slices"
)

// CompileService owns the v2 compiler pipeline.
type CompileService struct {
	requestOwner  *CompileRequestOwner
	graphOwner    *PackageGraphOwner
	semanticOwner *SemanticModelOwner
	loweringOwner *LoweringOwner
	emitterOwner  *TypeScriptEmitOwner
	cacheOwner    *CompilerCacheOwner
	runtimeOwner  *RuntimeContractOwner
	overrideOwner *OverrideRegistryOwner
	parityOwner   *OverrideParityVerifier
}

// NewCompileService creates a compile service with every pipeline owner.
func NewCompileService(overrideDirs ...string) *CompileService {
	overrideOwner := NewOverrideRegistryOwner(overrideDirs...)
	runtimeOwner := NewRuntimeContractOwner()
	return &CompileService{
		requestOwner:  NewCompileRequestOwner(),
		graphOwner:    NewPackageGraphOwner(overrideOwner),
		semanticOwner: NewSemanticModelOwner(overrideOwner),
		loweringOwner: NewLoweringOwner(runtimeOwner, overrideOwner),
		emitterOwner:  NewTypeScriptEmitOwner(runtimeOwner),
		cacheOwner:    NewCompilerCacheOwner(),
		runtimeOwner:  runtimeOwner,
		overrideOwner: overrideOwner,
		parityOwner:   NewOverrideParityVerifier(),
	}
}

// RequestOwner returns the compile request owner.
func (s *CompileService) RequestOwner() *CompileRequestOwner {
	return s.requestOwner
}

// PackageGraphOwner returns the package graph owner.
func (s *CompileService) PackageGraphOwner() *PackageGraphOwner {
	return s.graphOwner
}

// SemanticModelOwner returns the semantic model owner.
func (s *CompileService) SemanticModelOwner() *SemanticModelOwner {
	return s.semanticOwner
}

// LoweringOwner returns the lowering owner.
func (s *CompileService) LoweringOwner() *LoweringOwner {
	return s.loweringOwner
}

// TypeScriptEmitOwner returns the TypeScript emit owner.
func (s *CompileService) TypeScriptEmitOwner() *TypeScriptEmitOwner {
	return s.emitterOwner
}

// CompilerCacheOwner returns the compiler cache owner.
func (s *CompileService) CompilerCacheOwner() *CompilerCacheOwner {
	return s.cacheOwner
}

// RuntimeContractOwner returns the runtime contract owner.
func (s *CompileService) RuntimeContractOwner() *RuntimeContractOwner {
	return s.runtimeOwner
}

// OverrideRegistryOwner returns the override registry owner.
func (s *CompileService) OverrideRegistryOwner() *OverrideRegistryOwner {
	return s.overrideOwner
}

// Compile runs one request through the v2 pipeline.
func (s *CompileService) Compile(ctx context.Context, req *CompileRequest) (*CompilationResult, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}

	result := &CompilationResult{}
	if req != nil {
		result.OriginalPackages = slices.Clone(req.Patterns)
	}

	diagnostics := s.requestOwner.Validate(req)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	if !slices.Equal(s.overrideOwner.overrideDirs, req.OverrideDirs) {
		return NewCompileService(req.OverrideDirs...).Compile(ctx, req)
	}
	defer s.cacheOwner.Trim(req)

	var programReplayTried bool
	if s.cacheOwner.Enabled(req) {
		graph, graphDiagnostics := s.graphOwner.LoadIdentity(ctx, req)
		diagnostics = append(diagnostics, graphDiagnostics...)
		if graph != nil {
			result.OriginalPackages = slices.Clone(graph.RequestedPackagePaths)
		}
		if diagnosticsHaveErrors(diagnostics) {
			result.Diagnostics = diagnostics
			return result, NewCompileError(diagnostics)
		}

		// The program key covers every input of the override parity check, so a
		// program stored after a verified compile replays without the full load.
		if req.DependencyMode == DependencyModeAll {
			overridePlan, overrideDiagnostics := s.overrideOwner.CopyPlan(ctx, req, graph)
			diagnostics = append(diagnostics, overrideDiagnostics...)
			if diagnosticsHaveErrors(diagnostics) {
				result.Diagnostics = diagnostics
				return result, NewCompileError(diagnostics)
			}
			sources := s.cacheOwner.Entries(req, graph, overridePlan)
			if cached, ok := s.cacheOwner.ReplayProgram(ctx, req, sources); ok {
				cached.OriginalPackages = slices.Clone(result.OriginalPackages)
				cached.Diagnostics = diagnostics
				return cached, nil
			}
			programReplayTried = true
		}
	}

	graph, graphDiagnostics := s.graphOwner.Load(ctx, req)
	diagnostics = append(diagnostics, graphDiagnostics...)
	if graph != nil {
		result.OriginalPackages = slices.Clone(graph.RequestedPackagePaths)
	}
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	overrideFacts, factsDiagnostics := s.overrideOwner.Facts(ctx)
	diagnostics = append(diagnostics, factsDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	parityDiagnostics := s.parityOwner.Verify(ctx, graph, overrideFacts)
	diagnostics = append(diagnostics, parityDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	overridePlan, overrideDiagnostics := s.overrideOwner.CopyPlan(ctx, req, graph)
	diagnostics = append(diagnostics, overrideDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	sources := s.cacheOwner.Entries(req, graph, overridePlan)
	if !programReplayTried {
		if cached, ok := s.cacheOwner.ReplayProgram(ctx, req, sources); ok {
			cached.OriginalPackages = slices.Clone(result.OriginalPackages)
			cached.Diagnostics = diagnostics
			return cached, nil
		}
	}

	semanticModel, semanticDiagnostics := s.semanticOwner.Build(ctx, graph, req.DeferredFunctions...)
	diagnostics = append(diagnostics, semanticDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	// Packages whose closure sources and closure facts are unchanged replay
	// from the cache; only the rest are lowered and emitted.
	trimTypeInfo := !packageGraphContainsPackage(graph, "reflect")
	artifactEntries := s.cacheOwner.ArtifactEntries(graph, sources, semanticModel, trimTypeInfo)
	replayed := s.cacheOwner.ReplayGenerated(ctx, req, artifactEntries)
	loweredProgram, loweringDiagnostics := s.loweringOwner.Build(ctx, semanticModel, LoweringOptions{
		SourceRoot:                protobufTypeScriptBindingRoot(req.Dir),
		DisplayRoot:               req.Dir,
		OutputPath:                req.OutputPath,
		ProtobufTypeScriptBinding: req.ProtobufTypeScriptBinding,
		AdditionalBindingRoots:    slices.Clone(req.AdditionalBindingRoots),
		TrimTypeInfo:              trimTypeInfo,
		SkipPackages:              replayed,
	})
	diagnostics = append(diagnostics, loweringDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	files, emitDiagnostics := s.emitterOwner.EmitToMemory(ctx, loweredProgram)
	diagnostics = append(diagnostics, emitDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	compiledPackages, writeDiagnostics := s.emitterOwner.WriteFiles(ctx, req, loweredProgram, files)
	diagnostics = append(diagnostics, writeDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	result.CompiledPackages = append(result.CompiledPackages, compiledPackages...)
	result.CompiledPackages = slices.AppendSeq(result.CompiledPackages, maps.Keys(replayed))
	slices.Sort(result.CompiledPackages)
	s.cacheOwner.StoreGenerated(req, artifactEntries, loweredProgram, files)

	copiedPackages, copyDiagnostics := s.overrideOwner.CopyPackages(ctx, req, overridePlan)
	result.CopiedPackages = append(result.CopiedPackages, copiedPackages...)
	diagnostics = append(diagnostics, copyDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	s.cacheOwner.StoreCopied(req, artifactEntries, overridePlan)
	s.cacheOwner.StoreProgram(req, sources, artifactEntries)

	result.Diagnostics = diagnostics
	return result, nil
}
