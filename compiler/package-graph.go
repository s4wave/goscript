package compiler

import (
	"go/ast"
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

	packagesByPath map[string]*packages.Package
}

func packageBlocklistDiagnostics(graph *PackageGraph, blocklist []string) []Diagnostic {
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
	if graph == nil || len(graph.RequestedPackagePaths) == 0 {
		return nil
	}

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
			Message:  "Go package contains load errors",
			Detail:   pkgErr.Msg,
		})
	}
	return diagnostics
}
