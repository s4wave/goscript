package compiler

import (
	"context"
	"go/ast"
	"os"
	"runtime"
	"slices"
	"strconv"
	"strings"

	"golang.org/x/tools/go/packages"
)

// PackageGraph is the immutable package graph produced for a compile request.
type PackageGraph struct {
	// RequestedPatterns are the package patterns from the compile request.
	RequestedPatterns []string
	// RequestedPackagePaths are the loaded package paths for requested patterns.
	RequestedPackagePaths []string
	// Nodes are the deterministic package graph nodes.
	Nodes []*PackageGraphNode
	// NodesByPackagePath maps package path to graph node.
	NodesByPackagePath map[string]*PackageGraphNode
	// SourceOverrides are the override packages this program compiles from
	// their Go source, per their sourceWhenImported metadata.
	SourceOverrides []string

	packagesByPath map[string]*packages.Package
	// checker holds the file set and parsed syntax Check shares across checks.
	checker *packageChecker
}

// PackageGraphNode is one package in the loaded graph.
type PackageGraphNode struct {
	// ID is the go/packages package identity.
	ID string
	// PkgPath is the stable Go package path.
	PkgPath string
	// Name is the Go package name.
	Name string
	// ModulePath is the owning module path when known.
	ModulePath string
	// ModuleDir is the owning module directory when known.
	ModuleDir string
	// ForTest is the package path under test for Go test variants.
	ForTest string
	// GoFiles are the package source files.
	GoFiles []string
	// CompiledGoFiles are files selected by build constraints.
	CompiledGoFiles []string
	// Imports are imported package paths.
	Imports []string
	// Requested marks packages matched by request patterns.
	Requested bool
	// OverrideCandidate marks packages with a matching GoScript override package.
	OverrideCandidate bool
}

// PackageGraphOwner owns Go package loading and graph identity.
type PackageGraphOwner struct {
	overrideOwner *OverrideRegistryOwner
}

// NewPackageGraphOwner creates the package graph owner.
func NewPackageGraphOwner(overrideOwners ...*OverrideRegistryOwner) *PackageGraphOwner {
	overrideOwner := NewOverrideRegistryOwner()
	if len(overrideOwners) != 0 && overrideOwners[0] != nil {
		overrideOwner = overrideOwners[0]
	}
	return &PackageGraphOwner{overrideOwner: overrideOwner}
}

// Load builds the package graph for a validated request with syntax and type
// information for every package.
func (o *PackageGraphOwner) Load(ctx context.Context, req *CompileRequest) (*PackageGraph, []Diagnostic) {
	graph, diagnostics := o.LoadIdentity(ctx, req)
	if diagnosticsHaveErrors(diagnostics) {
		return graph, diagnostics
	}
	return graph, append(diagnostics, o.Check(ctx, graph, nil)...)
}

// goScriptLoaderEnv returns the go command environment for loading GoScript
// packages. GoScript never compiles cgo, so cgo stays disabled even when the
// host toolchain defaults it on for js/wasm.
func goScriptLoaderEnv() []string {
	return append(os.Environ(), "GOOS=js", "GOARCH=wasm", "CGO_ENABLED=0")
}

// LoadIdentity builds the package identity graph: names, files and imports,
// without syntax or types. Check completes it.
func (o *PackageGraphOwner) LoadIdentity(ctx context.Context, req *CompileRequest) (*PackageGraph, []Diagnostic) {
	// Stop before loading for a canceled request.
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}

	// List the packages the request names and their imports.
	cfg := &packages.Config{
		Context:    ctx,
		Dir:        req.Dir,
		Env:        goScriptLoaderEnv(),
		BuildFlags: goScriptBuildFlags(req.BuildFlags),
		Tests:      req.Tests,
		Mode:       packageGraphLoadMode,
	}

	// A host without a go command, such as a JavaScript runtime, loads the
	// vendored module directly.
	load := packages.Load
	if runtime.GOOS == "js" {
		load = loadVendorPackages
	}
	pkgs, err := load(cfg, req.Patterns...)
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

	// Read the override facts the graph nodes apply.
	overrideFacts, overrideDiagnostics := o.overrideOwner.Facts(ctx)
	if diagnosticsHaveErrors(overrideDiagnostics) {
		return nil, overrideDiagnostics
	}

	// Record the packages the patterns matched.
	requested := make(map[string]bool)
	var requestedPaths []string
	for _, pkg := range pkgs {
		if isTestMainPackage(pkg) {
			continue
		}
		path := packagePath(pkg)
		requested[path] = true
		requestedPaths = append(requestedPaths, path)
	}
	slices.Sort(requestedPaths)

	// With tests, a package's same-package test variant replaces it.
	samePackageTestVariants := make(map[string]bool)
	if req.Tests {
		for _, pkg := range pkgs {
			if pkg == nil || pkg.ForTest == "" || strings.HasSuffix(pkg.Name, "_test") {
				continue
			}
			samePackageTestVariants[pkg.ForTest] = true
		}
	}

	// Collect the nodes until no compiled package imports a package that
	// makes an override yield to its Go source. A yielded override only adds
	// compiled packages, so each pass yields at least one more override or
	// is the last.
	var graph *PackageGraph
	var sourceOverrides []string
	for {
		graph = &PackageGraph{
			RequestedPatterns:     slices.Clone(req.Patterns),
			RequestedPackagePaths: slices.Clone(requestedPaths),
			NodesByPackagePath:    make(map[string]*PackageGraphNode),
			SourceOverrides:       slices.Clone(sourceOverrides),
			packagesByPath:        make(map[string]*packages.Package),
		}
		facts := overrideFacts.withoutPackages(sourceOverrides)
		seen := make(map[string]bool)
		for _, pkg := range pkgs {
			if isTestMainPackage(pkg) {
				continue
			}
			o.collect(graph, pkg, req.DependencyMode, requested, samePackageTestVariants, facts, seen)
		}
		yielded := graph.yieldedOverrides(facts)
		if len(yielded) == 0 {
			break
		}
		sourceOverrides = append(sourceOverrides, yielded...)
		slices.Sort(sourceOverrides)
	}
	slices.SortFunc(graph.Nodes, func(a, b *PackageGraphNode) int {
		if a.PkgPath == b.PkgPath {
			return strings.Compare(a.ID, b.ID)
		}
		return strings.Compare(a.PkgPath, b.PkgPath)
	})

	// Lowering assumes complete type information, so every lowered node must
	// load cleanly, including dependencies the request did not name. Override
	// candidates ship hand-written TypeScript and never lower their Go source.
	var diagnostics []Diagnostic
	for _, node := range graph.Nodes {
		if !node.OverrideCandidate {
			diagnostics = append(diagnostics, packageDiagnostics(graph.packagesByPath[node.PkgPath])...)
		}
	}
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

// packageGraphLoadMode asks go list for package identity only. Check parses
// and type-checks every package itself, so no export data is requested either;
// requesting it makes go list compile the whole program first.
const packageGraphLoadMode = packages.NeedName |
	packages.NeedFiles |
	packages.NeedCompiledGoFiles |
	packages.NeedImports |
	packages.NeedDeps |
	packages.NeedForTest |
	packages.NeedModule

func (o *PackageGraphOwner) collect(
	graph *PackageGraph,
	pkg *packages.Package,
	mode DependencyMode,
	requested map[string]bool,
	samePackageTestVariants map[string]bool,
	overrideFacts *OverrideFacts,
	seen map[string]bool,
) {
	// Skip packages already collected and the variants a test variant
	// replaces. A test variant of an unrequested package collects its
	// production package instead.
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

	// Add the package's node.
	seen[pkg.ID] = true
	normalizePackageFileOrder(pkg)
	node := newPackageGraphNode(pkg, requested[path], overrideFacts)
	graph.Nodes = append(graph.Nodes, node)
	graph.NodesByPackagePath[path] = node
	graph.packagesByPath[path] = pkg
	if mode != DependencyModeAll {
		return
	}

	// An override ships hand-written TypeScript, so only the packages whose
	// types it exposes join the graph.
	var imports []string
	if node.OverrideCandidate {
		imports = overrideFacts.Metadata(path).NativeDependencies
	} else {
		imports = make([]string, 0, len(pkg.Imports))
		for importPath := range pkg.Imports {
			imports = append(imports, importPath)
		}
	}
	slices.Sort(imports)
	for _, importPath := range imports {
		o.collect(graph, pkg.Imports[importPath], mode, requested, samePackageTestVariants, overrideFacts, seen)
	}
}

// yieldedOverrides returns the override packages in facts whose
// sourceWhenImported metadata names a package that a compiled node imports.
func (g *PackageGraph) yieldedOverrides(facts *OverrideFacts) []string {
	// Find the packages the compiled nodes import.
	imported := make(map[string]bool)
	for _, node := range g.Nodes {
		if node.OverrideCandidate {
			continue
		}
		for _, importPath := range node.Imports {
			imported[importPath] = true
		}
	}

	// Yield each override that one of them triggers.
	var yielded []string
	for pkgPath, pkg := range facts.packages {
		for _, trigger := range pkg.metadata.SourceWhenImported {
			if imported[trigger] {
				yielded = append(yielded, pkgPath)
				break
			}
		}
	}
	slices.Sort(yielded)
	return yielded
}

// overrideFacts returns the override facts of the program the graph holds:
// facts without the overrides it compiles from source.
func (g *PackageGraph) overrideFacts(facts *OverrideFacts) *OverrideFacts {
	if g == nil {
		return facts
	}
	return facts.withoutPackages(g.SourceOverrides)
}

func newPackageGraphNode(pkg *packages.Package, requested bool, overrideFacts *OverrideFacts) *PackageGraphNode {
	// Sort the import paths.
	imports := make([]string, 0, len(pkg.Imports))
	for importPath := range pkg.Imports {
		imports = append(imports, importPath)
	}
	slices.Sort(imports)

	// Read the module, which the standard library lacks.
	var modulePath string
	var moduleDir string
	if pkg.Module != nil {
		modulePath = pkg.Module.Path
		moduleDir = pkg.Module.Dir
	}

	return &PackageGraphNode{
		ID:                pkg.ID,
		PkgPath:           packagePath(pkg),
		Name:              pkg.Name,
		ModulePath:        modulePath,
		ModuleDir:         moduleDir,
		ForTest:           pkg.ForTest,
		GoFiles:           slices.Clone(pkg.GoFiles),
		CompiledGoFiles:   slices.Clone(pkg.CompiledGoFiles),
		Imports:           imports,
		Requested:         requested,
		OverrideCandidate: overrideFacts.HasPackage(packagePath(pkg)),
	}
}

func packageBlocklistDiagnostics(graph *PackageGraph, blocklist []string) []Diagnostic {
	// Report the first chain that reaches a blocked package.
	chain := packageBlocklistChain(graph, blocklist)
	if len(chain) == 0 {
		return nil
	}
	blocked := chain[len(chain)-1]
	return []Diagnostic{{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/package-graph:blocklisted-package",
		Message:  "package graph contains blocklisted package " + strconv.Quote(blocked),
		Detail:   "import chain: " + strings.Join(chain, " -> "),
	}}
}

func packageBlocklistChain(graph *PackageGraph, blocklist []string) []string {
	// A graph without requested packages has no chain.
	if graph == nil || len(graph.RequestedPackagePaths) == 0 {
		return nil
	}

	// Queue the requested packages in order, so the breadth-first walk finds
	// a shortest chain.
	roots := slices.Clone(graph.RequestedPackagePaths)
	slices.Sort(roots)
	type queueEntry struct {
		path  string
		chain []string
	}
	queue := make([]queueEntry, 0, len(roots))
	seen := make(map[string]bool)
	for _, root := range roots {
		if graph.NodesByPackagePath[root] == nil || seen[root] {
			continue
		}
		seen[root] = true
		queue = append(queue, queueEntry{
			path:  root,
			chain: []string{root},
		})
	}

	// Walk the imports until a package is blocked.
	for len(queue) != 0 {
		entry := queue[0]
		queue = queue[1:]
		if packagePathBlocklisted(entry.path, blocklist) {
			return entry.chain
		}
		node := graph.NodesByPackagePath[entry.path]
		if node == nil {
			continue
		}

		// Override candidates are compiled from their GoScript override, whose
		// TypeScript imports replace the native Go imports. collect prunes their
		// native dependencies from the graph, so the blocklist walk must treat
		// them as leaves; otherwise an overridden package (for example a
		// reflect-free encoding/json override) would falsely chain to a
		// blocklisted package it no longer imports in the compiled output.
		if node.OverrideCandidate {
			continue
		}

		// Queue each import not yet seen.
		imports := slices.Clone(node.Imports)
		slices.Sort(imports)
		for _, importPath := range imports {
			if graph.NodesByPackagePath[importPath] == nil || seen[importPath] {
				continue
			}
			seen[importPath] = true
			nextChain := slices.Clone(entry.chain)
			nextChain = append(nextChain, importPath)
			queue = append(queue, queueEntry{
				path:  importPath,
				chain: nextChain,
			})
		}
	}
	return nil
}

func packageGraphContainsPackage(graph *PackageGraph, packagePath string) bool {
	return len(packageBlocklistChain(graph, []string{packagePath})) != 0
}

func packagePathBlocklisted(path string, blocklist []string) bool {
	for _, blocked := range blocklist {
		// Match the package exactly or any subpackage, on a path-segment
		// boundary so "crypto" blocks "crypto/ecdsa" but not "cryptobyte".
		if path == blocked || strings.HasPrefix(path, blocked+"/") {
			return true
		}
	}
	return false
}

func normalizePackageFileOrder(pkg *packages.Package) {
	// Sort the files, keeping parsed syntax beside its file name.
	if pkg == nil {
		return
	}
	slices.Sort(pkg.GoFiles)
	if len(pkg.Syntax) == len(pkg.CompiledGoFiles) {
		type sourceFile struct {
			name string
			file *ast.File
		}
		files := make([]sourceFile, len(pkg.Syntax))
		for idx, file := range pkg.Syntax {
			files[idx] = sourceFile{name: pkg.CompiledGoFiles[idx], file: file}
		}
		slices.SortFunc(files, func(a, b sourceFile) int {
			return strings.Compare(a.name, b.name)
		})
		for idx, file := range files {
			pkg.CompiledGoFiles[idx] = file.name
			pkg.Syntax[idx] = file.file
		}
		return
	}
	slices.Sort(pkg.CompiledGoFiles)
	slices.SortFunc(pkg.Syntax, func(a, b *ast.File) int {
		if pkg.Fset == nil {
			return strings.Compare(a.Name.Name, b.Name.Name)
		}
		return strings.Compare(
			pkg.Fset.Position(a.Package).Filename,
			pkg.Fset.Position(b.Package).Filename,
		)
	})
}

func isTestMainPackage(pkg *packages.Package) bool {
	return pkg != nil && pkg.ForTest == "" && pkg.Name == "main" && strings.HasSuffix(packagePath(pkg), ".test")
}

func packagePath(pkg *packages.Package) string {
	if pkg == nil {
		return ""
	}
	if pkg.PkgPath != "" {
		return pkg.PkgPath
	}
	return pkg.ID
}

func packageDiagnostics(pkg *packages.Package) []Diagnostic {
	if pkg == nil || len(pkg.Errors) == 0 {
		return nil
	}
	diagnostics := make([]Diagnostic, 0, len(pkg.Errors))
	for _, pkgErr := range pkg.Errors {
		diagnostics = append(diagnostics, Diagnostic{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/package-graph:load-error",
			Message:  "Go package " + packagePath(pkg) + " contains load errors",
			Detail:   pkgErr.Error(),
		})
	}
	return diagnostics
}
