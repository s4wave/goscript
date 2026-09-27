package compiler

import (
	"context"
	"maps"
	"slices"
	"strings"
	"testing"
)

// TestBodySummaryRoundTrip checks that packages built from their body
// summaries after a check without bodies give the same whole-program facts as
// packages built from their bodies.
func TestBodySummaryRoundTrip(t *testing.T) {
	ctx := context.Background()
	service := NewCompileService()
	req := service.RequestOwner().NewRequest(Config{
		Dir:             "..",
		OutputPath:      t.TempDir(),
		AllDependencies: true,
	}, []string{"./compiler"})
	graph, diagnostics := service.graphOwner.Load(ctx, req)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("load: %v", diagnostics)
	}
	summarize := make(map[string]bool)
	for _, node := range graph.Nodes {
		if !node.OverrideCandidate {
			summarize[node.PkgPath] = true
		}
	}
	full, diagnostics := service.semanticOwner.Build(ctx, graph, SemanticBuildOptions{Summarize: summarize})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("full build: %v", diagnostics)
	}
	want := bodySummaryFacts(full)
	summaries := full.summaries
	t.Logf("summarized %d of %d packages", len(summaries), len(summarize))
	if len(summaries) < len(summarize)/2 {
		t.Fatalf("summarized only %d of %d packages", len(summaries), len(summarize))
	}

	bodiless := make(map[string]bool, len(summaries))
	for pkgPath := range summaries {
		bodiless[pkgPath] = true
	}
	if diagnostics := service.graphOwner.Check(ctx, graph, bodiless); diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("check without bodies: %v", diagnostics)
	}
	applied, diagnostics := service.semanticOwner.Build(ctx, graph, SemanticBuildOptions{Summaries: summaries})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("summary build: %v", diagnostics)
	}
	if len(applied.staleSummaries) != 0 {
		t.Fatalf("stale summaries: %v", applied.staleSummaries)
	}
	got := bodySummaryFacts(applied)
	for pkgPath, line := range want {
		if got[pkgPath] != line {
			t.Errorf("%s:\nfull:    %s\nsummary: %s", pkgPath, line, got[pkgPath])
		}
	}
	if len(got) != len(want) {
		t.Errorf("facts cover %d packages from summaries, want %d", len(got), len(want))
	}
}

// bodySummaryFacts lists, per package, the facts that lowering reads across
// packages and the cache keys artifacts by.
func bodySummaryFacts(model *SemanticModel) map[string]string {
	fset := model.fileSet()
	facts := make(map[string]string)
	for pkgPath, digest := range model.packageFactDigests() {
		facts[pkgPath] = "facts " + digest
	}
	for pkgPath, semPkg := range model.packages {
		lines := []string{facts[pkgPath]}
		for _, name := range slices.Sorted(maps.Keys(semPkg.varRefNames)) {
			lines = append(lines, "var-ref-name "+name)
		}
		for obj := range semPkg.lazyVars {
			lines = append(lines, "lazy "+objectKey(fset, obj))
		}
		for _, semFn := range semPkg.functions {
			for v := range semFn.packageVars {
				lines = append(lines, "package-var "+objectKey(fset, semFn.function)+" "+objectKey(fset, v))
			}
		}
		slices.Sort(lines[1:])
		facts[pkgPath] = strings.Join(lines, "\n")
	}
	return facts
}
