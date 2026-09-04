package compiler

import (
	"go/types"
	"slices"
	"strings"
)

// deferFunctions colors explicitly selected boundaries before the usual async
// propagation. Their package initialization is owned by the emitted ES module.
func (m *SemanticModel) deferFunctions(names []string) []Diagnostic {
	var diagnostics []Diagnostic

	// Validate and mark each selected function as a deferred boundary.
	for _, name := range names {
		fn := m.functionsByFullName[name]
		if fn == nil || !fn.function.Exported() || fn.receiver != nil || fn.signature.TypeParams().Len() != 0 {
			diagnostics = append(diagnostics, Diagnostic{Severity: DiagnosticSeverityError, Code: "goscript/deferred:function", Message: "deferred boundary must name an exported, non-generic package function in the loaded graph", Detail: name})
			continue
		}

		// Create the deferred package index when the first boundary needs it.
		if m.deferredPackages == nil {
			m.deferredPackages = make(map[string]bool)
		}

		// Record the package and propagate deferred execution through the function.
		m.deferredPackages[fn.function.Pkg().Path()] = true
		fn.deferred = true
		fn.async = true
		fn.asyncReasons = append(fn.asyncReasons, "deferred module import")
	}
	return diagnostics
}

func (m *SemanticModel) functionDeferred(fn *types.Func) bool {
	semFn := semanticFunctionFor(m, fn)
	return semFn != nil && semFn.deferred
}

func (m *SemanticModel) hasDeferredPackage(path string) bool {
	return m.deferredPackages[path]
}

// A configured boundary must actually remove the eager edge. Reject value
// references and side-effect imports instead of silently keeping the package
// in the initial closure. Interface types remain available as erased TS types.
func (m *SemanticModel) deferredImportDiagnostics(pkg *semanticPackage, path, alias string) []Diagnostic {
	var references []string

	// Reject import forms that force package evaluation in the eager closure.
	if alias == "_" || alias == "." {
		references = append(references, "import "+alias)
	}

	// Collect value references that cannot remain on a deferred package edge.
	for _, obj := range pkg.source.TypesInfo.Uses {
		if obj.Pkg() == nil || obj.Pkg().Path() != path {
			continue
		}
		switch value := obj.(type) {
		case *types.Func:
			if m.functionDeferred(value) {
				continue
			}
		case *types.TypeName:
			if _, ok := value.Type().Underlying().(*types.Interface); ok {
				continue
			}
		case *types.PkgName:
			continue
		}
		references = append(references, obj.Name())
	}

	// Return without a diagnostic when the import has no eager references.
	if len(references) == 0 {
		return nil
	}

	// Sort and deduplicate references for stable diagnostic output.
	slices.Sort(references)
	references = slices.Compact(references)

	// Report the references that keep the deferred package eager.
	return []Diagnostic{{Severity: DiagnosticSeverityError, Code: "goscript/deferred:eager-reference", Message: "deferred package has eager references; move shared declarations to an eager package", Detail: pkg.pkgPath + " imports " + path + ": " + strings.Join(references, ", ")}}
}
