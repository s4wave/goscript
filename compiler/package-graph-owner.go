package compiler

import (
	"context"
	"os"
	"slices"
	"strings"

	"golang.org/x/tools/go/packages"
)

// PackageGraphOwner owns Go package loading and graph identity.
type PackageGraphOwner struct {
	// overrideOwner provides package override facts during graph loading.
	overrideOwner *OverrideRegistryOwner
}

type packageGraphLoadShape int

const (
	packageGraphLoadFull packageGraphLoadShape = iota
	packageGraphLoadIdentity
)

// NewPackageGraphOwner creates the package graph owner.
func NewPackageGraphOwner(overrideOwners ...*OverrideRegistryOwner) *PackageGraphOwner {
	overrideOwner := NewOverrideRegistryOwner()
	if len(overrideOwners) != 0 && overrideOwners[0] != nil {
		overrideOwner = overrideOwners[0]
	}
	return &PackageGraphOwner{overrideOwner: overrideOwner}
}

// Load builds the package graph for a validated request.
func (o *PackageGraphOwner) Load(ctx context.Context, req *CompileRequest) (*PackageGraph, []Diagnostic) {
	return o.load(ctx, req, packageGraphLoadFull)
}

// LoadIdentity builds the package identity graph needed for cache lookup.
func (o *PackageGraphOwner) LoadIdentity(ctx context.Context, req *CompileRequest) (*PackageGraph, []Diagnostic) {
	return o.load(ctx, req, packageGraphLoadIdentity)
}

func (o *PackageGraphOwner) load(ctx context.Context, req *CompileRequest, shape packageGraphLoadShape) (*PackageGraph, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}

	cfg := &packages.Config{
		Context:    ctx,
		Dir:        req.Dir,
		Env:        append(os.Environ(), "GOOS=js", "GOARCH=wasm"),
		BuildFlags: goScriptBuildFlags(req.BuildFlags),
		Tests:      req.Tests,
		Mode:       packageGraphLoadMode(shape),
	}
	pkgs, err := packages.Load(cfg, req.Patterns...)
	if err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:load",
			Message:  "failed to load Go packages",
			Detail:   err.Error(),
		}}
	}
	if len(pkgs) == 0 {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:no-packages",
			Message:  "package patterns did not match any packages",
		}}
	}
	overrideFacts, overrideDiagnostics := o.overrideOwner.Facts(ctx)
	if diagnosticsHaveErrors(overrideDiagnostics) {
		return nil, overrideDiagnostics
	}

	graph := &PackageGraph{
		RequestedPatterns:     slices.Clone(req.Patterns),
		NodesByPackagePath:    make(map[string]*PackageGraphNode),
		packagesByPath:        make(map[string]*packages.Package),
		RequestedPackagePaths: make([]string, 0, len(pkgs)),
	}

	requested := make(map[string]bool)
	for _, pkg := range pkgs {
		if isTestMainPackage(pkg) {
			continue
		}
		path := packagePath(pkg)
		requested[path] = true
		graph.RequestedPackagePaths = append(graph.RequestedPackagePaths, path)
	}
	slices.Sort(graph.RequestedPackagePaths)
	samePackageTestVariants := make(map[string]bool)
	if req.Tests {
		for _, pkg := range pkgs {
			if pkg == nil || pkg.ForTest == "" || strings.HasSuffix(pkg.Name, "_test") {
				continue
			}
			samePackageTestVariants[pkg.ForTest] = true
		}
	}

	var diagnostics []Diagnostic
	seen := make(map[string]bool)
	for _, pkg := range pkgs {
		if isTestMainPackage(pkg) {
			continue
		}
		o.collect(graph, pkg, req.DependencyMode, requested, samePackageTestVariants, overrideFacts, seen)
		diagnostics = append(diagnostics, packageDiagnostics(pkg)...)
	}
	slices.SortFunc(graph.Nodes, func(a, b *PackageGraphNode) int {
		if a.PkgPath == b.PkgPath {
			return strings.Compare(a.ID, b.ID)
		}
		return strings.Compare(a.PkgPath, b.PkgPath)
	})
	if len(graph.Nodes) == 0 {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:no-nodes",
			Message:  "package graph did not contain any package nodes",
		})
	}
	if len(req.PackageBlocklist) != 0 {
		diagnostics = append(diagnostics, packageBlocklistDiagnostics(graph, req.PackageBlocklist)...)
	}
	return graph, diagnostics
}

func packageGraphLoadMode(shape packageGraphLoadShape) packages.LoadMode {
	mode := packages.NeedName |
		packages.NeedFiles |
		packages.NeedCompiledGoFiles |
		packages.NeedImports |
		packages.NeedDeps |
		packages.NeedForTest |
		packages.NeedModule
	if shape == packageGraphLoadIdentity {
		return mode
	}
	return mode |
		packages.NeedExportFile |
		packages.NeedTypes |
		packages.NeedSyntax |
		packages.NeedTypesInfo |
		packages.NeedTypesSizes
}

func (o *PackageGraphOwner) collect(
	graph *PackageGraph,
	pkg *packages.Package,
	mode DependencyMode,
	requested map[string]bool,
	samePackageTestVariants map[string]bool,
	overrideFacts *OverrideFacts,
	seen map[string]bool,
) {
	if pkg == nil || seen[pkg.ID] {
		return
	}
	path := packagePath(pkg)
	if pkg.ForTest != "" && path != pkg.ForTest && !strings.HasSuffix(pkg.Name, "_test") && samePackageTestVariants[path] {
		return
	}
	if pkg.ForTest == "" && samePackageTestVariants[path] {
		return
	}
	if pkg.ForTest != "" && !requested[pkg.ForTest] {
		if prod := pkg.Imports[pkg.ForTest]; prod != nil {
			o.collect(graph, prod, mode, requested, samePackageTestVariants, overrideFacts, seen)
		}
		return
	}
	if graph.NodesByPackagePath[path] != nil {
		return
	}
	seen[pkg.ID] = true

	normalizePackageFileOrder(pkg)

	node := newPackageGraphNode(pkg, requested[path], overrideFacts)
	graph.Nodes = append(graph.Nodes, node)
	graph.NodesByPackagePath[path] = node
	graph.packagesByPath[path] = pkg

	if mode != DependencyModeAll || node.OverrideCandidate {
		return
	}
	imports := make([]string, 0, len(pkg.Imports))
	for importPath := range pkg.Imports {
		imports = append(imports, importPath)
	}
	slices.Sort(imports)
	for _, importPath := range imports {
		o.collect(graph, pkg.Imports[importPath], mode, requested, samePackageTestVariants, overrideFacts, seen)
	}
}
