package compiler

import (
	"slices"

	"golang.org/x/tools/go/packages"
)

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

func newPackageGraphNode(pkg *packages.Package, requested bool, overrideFacts *OverrideFacts) *PackageGraphNode {
	imports := make([]string, 0, len(pkg.Imports))
	for importPath := range pkg.Imports {
		imports = append(imports, importPath)
	}
	slices.Sort(imports)

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
