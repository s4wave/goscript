package compiler

import (
	"go/token"
	"go/types"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
)

// universeFactsPackage collects facts about objects without a package, such
// as the error interface's Error method. Every package can reach them.
const universeFactsPackage = ""

// packageFactDigests digests the whole-program facts attached to the objects
// each package defines, keyed by the defining package path.
//
// Whole-program analysis can change a package's facts from outside it: a
// dependent that passes an async callback makes the callee async, an async
// implementation makes the interface method it implements async, and taking
// the address of an exported variable makes it a variable reference. Lowering
// a package reads these facts only for objects in its import closure, so the
// digests of that closure decide whether its lowered output can be reused.
func (m *SemanticModel) packageFactDigests() map[string]string {
	fset := m.fileSet()
	facts := make(map[string][]string)
	add := func(kind string, obj types.Object, value string) {
		pkgPath := universeFactsPackage
		if obj.Pkg() != nil {
			pkgPath = obj.Pkg().Path()
		}
		facts[pkgPath] = append(facts[pkgPath], kind+"|"+objectFactID(fset, obj)+"|"+value)
	}

	for fn, semFn := range m.functions {
		add("func", fn, strconv.FormatBool(semFn.async)+"|"+
			strconv.FormatBool(semFn.hasBody)+"|"+
			strconv.FormatBool(semFn.deferred))
	}
	for fn := range m.asyncInterfaceMethodObjs {
		add("async-interface-method", fn, "")
	}
	for obj := range m.needsVarRef {
		add("var-ref", obj, "")
	}
	for obj := range m.addressTaken {
		add("address-taken", obj, "")
	}
	for pkgPath, semPkg := range m.packages {
		if len(semPkg.localFacts) != 0 {
			facts[pkgPath] = append(facts[pkgPath], semPkg.localFacts...)
		}
	}

	digests := make(map[string]string, len(facts))
	for pkgPath, lines := range facts {
		slices.Sort(lines)
		digests[pkgPath] = sha256String(strings.Join(slices.Compact(lines), "\n"))
	}
	return digests
}

// fileSet returns the file set shared by the loaded packages.
func (m *SemanticModel) fileSet() *token.FileSet {
	for _, semPkg := range m.packages {
		if semPkg.source != nil && semPkg.source.Fset != nil {
			return semPkg.source.Fset
		}
	}
	return nil
}

// objectFactID names obj stably across compiles of the same package source:
// its name and its declaring file and offset. Generic instances share their
// origin's ID.
func objectFactID(fset *token.FileSet, obj types.Object) string {
	if fset == nil || !obj.Pos().IsValid() {
		return obj.Name()
	}
	pos := fset.Position(obj.Pos())
	return obj.Name() + "@" + filepath.Base(pos.Filename) + ":" + strconv.Itoa(pos.Offset)
}
