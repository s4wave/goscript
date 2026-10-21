package compiler

import (
	"go/types"
	"hash/fnv"
	"maps"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"sync"
)

// runtimePackageNameSeparator separates the name of a package from the hash
// of its path in a runtime package name. It cannot be in a Go identifier or
// type string, so that the runtime can take it out for display.
const runtimePackageNameSeparator = "·"

// sharedPackageNames returns, for each package of graph that is compiled
// from Go and shares its name with another package of graph, the distinct
// name by which the runtime names its types: its name, the separator and a
// hash of its path. The runtime names a named type by its package name and
// type name, so that types of different packages with the same name, such as
// cogentcore.org/core/types.Type and github.com/h2non/filetype/types.Type,
// would be one type to the type registry, type assertions and reflection.
// Override packages keep their names, which their TypeScript uses, and main
// packages are not renamed.
func sharedPackageNames(graph *PackageGraph) map[string]string {
	// Collect the package paths by name, once each.
	if graph == nil {
		return nil
	}
	paths := make(map[string][]string)
	override := make(map[string]bool)
	for _, node := range graph.Nodes {
		if node.Name == "" || node.Name == "main" || slices.Contains(paths[node.Name], node.PkgPath) {
			continue
		}
		paths[node.Name] = append(paths[node.Name], node.PkgPath)
		override[node.PkgPath] = override[node.PkgPath] || node.OverrideCandidate
	}

	// Each compiled package of a shared name gets a hashed name.
	names := make(map[string]string)
	for name, pkgPaths := range paths {
		if len(pkgPaths) < 2 {
			continue
		}
		for _, pkgPath := range pkgPaths {
			if !override[pkgPath] {
				names[pkgPath] = name + runtimePackageNameSeparator + packagePathHash(pkgPath)
			}
		}
	}
	return names
}

// packagePathHash returns a short hash of a package path.
func packagePathHash(pkgPath string) string {
	h := fnv.New32a()
	h.Write([]byte(pkgPath))
	return strconv.FormatUint(uint64(h.Sum32()), 36)
}

// sharedPackageNamesDigest returns a cache key field for names, which change
// the output of the packages that use the types of the renamed packages.
func sharedPackageNamesDigest(names map[string]string) string {
	var b strings.Builder
	for _, pkgPath := range slices.Sorted(maps.Keys(names)) {
		b.WriteString(pkgPath + "=" + names[pkgPath] + "\n")
	}
	return b.String()
}

// runtimePackageNames maps each package being lowered that has a runtime
// name other than its name (see sharedPackageNames) to that name. It is
// keyed by the type-checked package, which is distinct for each compile.
var runtimePackageNames sync.Map

// setRuntimePackageNames records the runtime names of the packages of model,
// and returns a function that forgets them.
func setRuntimePackageNames(model *SemanticModel) func() {
	// Only the renamed packages are recorded.
	var recorded []*types.Package
	for pkgPath, name := range model.runtimePackageNames {
		semPkg := model.packages[pkgPath]
		if semPkg == nil || semPkg.source == nil || semPkg.source.Types == nil {
			continue
		}
		runtimePackageNames.Store(semPkg.source.Types, name)
		recorded = append(recorded, semPkg.source.Types)
	}
	return func() {
		for _, pkg := range recorded {
			runtimePackageNames.Delete(pkg)
		}
	}
}

// localTypeNames maps each local type (declared in a function) being
// lowered that shares its name with another type of its package to its
// distinct runtime name (see setLocalTypeNames).
var localTypeNames sync.Map

// setLocalTypeNames records the runtime names of the local types of the
// packages of model that share a name with another type of their package,
// and returns a function that forgets them. The runtime names a named type
// by its package name and type name, so that two functions that each declare
// a type person would have one type to the type registry, type assertions
// and reflection. Each such local type gets its name, the separator and a
// hash of its position, which the runtime takes out for display, as for
// packages (see sharedPackageNames).
func setLocalTypeNames(model *SemanticModel) func() {
	// Record the hashed local types of each package to forget them later.
	var recorded []*types.TypeName
	for _, semPkg := range model.packages {
		if semPkg == nil || semPkg.source == nil || semPkg.source.Types == nil || semPkg.source.TypesInfo == nil {
			continue
		}
		// Count the declared types of the package by name.
		pkgScope := semPkg.source.Types.Scope()
		counts := make(map[string]int)
		var locals []*types.TypeName
		for _, obj := range semPkg.source.TypesInfo.Defs {
			tn, ok := obj.(*types.TypeName)
			if !ok || tn.IsAlias() || tn.Parent() == nil {
				continue
			}
			counts[tn.Name()]++
			if tn.Parent() != pkgScope {
				locals = append(locals, tn)
			}
		}
		// Each local type of a shared name gets a hashed name.
		for _, tn := range locals {
			if counts[tn.Name()] < 2 {
				continue
			}
			pos := semPkg.source.Fset.Position(tn.Pos())
			key := filepath.Base(pos.Filename) + ":" + strconv.Itoa(pos.Offset)
			localTypeNames.Store(tn, tn.Name()+runtimePackageNameSeparator+packagePathHash(key))
			recorded = append(recorded, tn)
		}
	}

	// Forget the recorded names when the lowering is done.
	return func() {
		for _, tn := range recorded {
			localTypeNames.Delete(tn)
		}
	}
}

// runtimeTypeObjectName returns the name by which the runtime names the
// type of obj within its package.
func runtimeTypeObjectName(obj *types.TypeName) string {
	if name, ok := localTypeNames.Load(obj); ok {
		return name.(string)
	}
	return obj.Name()
}

// runtimePackageName returns the name by which the runtime names the types
// of pkg.
func runtimePackageName(pkg *types.Package) string {
	if name, ok := runtimePackageNames.Load(pkg); ok {
		return name.(string)
	}
	return pkg.Name()
}
