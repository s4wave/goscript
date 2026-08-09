package compiler

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func TestRenderIndexUsesRuntimeModuleSpecifiersAndStableFormatting(t *testing.T) {
	pkg := &loweredPackage{files: []*loweredFile{
		{outputName: "short.gs.ts", exports: []string{"Short"}},
		{
			outputName: "long.gs.ts",
			exports: []string{
				"Eight", "Five", "Four", "Nine", "One", "Seven", "Six", "Ten", "Three", "Two",
			},
		},
	}}

	got := renderIndex(pkg)
	want := strings.Join([]string{
		"export {",
		"  Eight,",
		"  Five,",
		"  Four,",
		"  Nine,",
		"  One,",
		"  Seven,",
		"  Six,",
		"  Ten,",
		"  Three,",
		"  Two,",
		"} from './long.gs.js'",
		"export { Short } from './short.gs.js'",
		"",
	}, "\n")
	if got != want {
		t.Fatalf("unexpected index:\n%s\nwant:\n%s", got, want)
	}
}

func TestRenderSwitchBodyOnlyAddsBreakForNonterminalCases(t *testing.T) {
	tests := []struct {
		name         string
		body         []loweredStmt
		fallsThrough bool
		wantBreaks   int
	}{
		{name: "ordinary", body: []loweredStmt{{text: "work()"}}, wantBreaks: 1},
		{name: "return prefix", body: []loweredStmt{{text: "returnValue()"}}, wantBreaks: 1},
		{name: "throw prefix", body: []loweredStmt{{text: "throwError()"}}, wantBreaks: 1},
		{name: "continue prefix", body: []loweredStmt{{text: "continueWork()"}}, wantBreaks: 1},
		{name: "break prefix", body: []loweredStmt{{text: "breakfast()"}}, wantBreaks: 1},
		{name: "labeled return prefix", body: []loweredStmt{{text: "Done: returnValue()"}}, wantBreaks: 1},
		{name: "fallthrough", body: []loweredStmt{{text: "work()"}}, fallsThrough: true},
		{name: "return", body: []loweredStmt{{text: "return value"}}},
		{name: "parenthesized return", body: []loweredStmt{{text: "return(value)"}}},
		{name: "labeled return", body: []loweredStmt{{text: "Done: return value"}}},
		{name: "throw", body: []loweredStmt{{text: "throw panic"}}},
		{name: "continue", body: []loweredStmt{{text: "continue outer"}}},
		{name: "break", body: []loweredStmt{{text: "break outer"}}, wantBreaks: 1},
		{name: "nested return", body: []loweredStmt{{hasBlock: true, children: []loweredStmt{{text: "return value"}}}}},
		{name: "labeled nested throw", body: []loweredStmt{{text: "Done:", children: []loweredStmt{{text: "throw panic"}}}}},
		{name: "nested ordinary", body: []loweredStmt{{hasBlock: true, children: []loweredStmt{{text: "returnValue()"}}}}, wantBreaks: 1},
		{
			name: "terminal if",
			body: []loweredStmt{{
				text:     "if (ready)",
				children: []loweredStmt{{text: "return value"}},
				elseBody: []loweredStmt{{text: "throw panic"}},
			}},
		},
		{
			name: "nonterminal if",
			body: []loweredStmt{{
				text:     "if (ready)",
				children: []loweredStmt{{text: "return value"}},
				elseBody: []loweredStmt{{text: "returnValue()"}},
			}},
			wantBreaks: 1,
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var got strings.Builder
			renderSwitchBody(&got, test.body, test.fallsThrough, 0)
			breaks := 0
			for line := range strings.Lines(got.String()) {
				if strings.TrimSpace(line) == "break" || strings.HasPrefix(strings.TrimSpace(line), "break ") {
					breaks++
				}
			}
			if breaks != test.wantBreaks {
				t.Fatalf("got %d break statements, want %d:\n%s", breaks, test.wantBreaks, got.String())
			}
		})
	}
}

func TestRenderedIndexLoadsEmittedJavaScriptModule(t *testing.T) {
	node, err := exec.LookPath("node")
	if err != nil {
		t.Skip("node is not installed")
	}
	dir := t.TempDir()
	index := renderIndex(&loweredPackage{files: []*loweredFile{{
		outputName: "value.gs.ts",
		exports:    []string{"Value"},
	}}})
	for name, contents := range map[string]string{
		"index.js":     index,
		"value.gs.js":  "export const Value = 42\n",
		"package.json": `{"type":"module"}`,
	} {
		if err := os.WriteFile(filepath.Join(dir, name), []byte(contents), 0o600); err != nil {
			t.Fatal(err)
		}
	}
	command := "import(" + strconvQuote(filepath.ToSlash(filepath.Join(dir, "index.js"))) +
		").then(module => { if (module.Value !== 42) process.exit(1) })"
	if output, err := exec.Command(node, "-e", command).CombinedOutput(); err != nil {
		t.Fatalf("load emitted package index: %v\n%s", err, output)
	}
}
