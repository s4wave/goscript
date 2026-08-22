package tests

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

// TestTypeCheckConfigPrefersFixtureOutput pins fixture-isolated dependency
// resolution: @goscript/* resolves to each fixture's own emitted run/output
// closure before the legacy global tests/deps tree. Two graph-different
// fixtures therefore typecheck against their own emitted bytes even when the
// global legacy tree holds conflicting text, and tests/deps stays
// byte-identical because nothing in the harness writes it at test time.
func TestTypeCheckConfigPrefersFixtureOutput(t *testing.T) {
	repoRoot, err := filepath.Abs(filepath.Join(".."))
	if err != nil {
		t.Fatal(err.Error())
	}
	depsDial := filepath.Join(repoRoot, "tests", "deps", "net", "dial.gs.ts")
	before, err := os.ReadFile(depsDial)
	if err != nil {
		t.Fatal(err.Error())
	}

	for _, tc := range []struct {
		name       string
		fixtureTag string
	}{
		{name: "graph-a", fixtureTag: "fixture-a"},
		{name: "graph-b", fixtureTag: "fixture-b"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			workspace := t.TempDir()
			writeDir := func(rel string, contents string) {
				t.Helper()
				path := filepath.Join(workspace, rel)
				if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
					t.Fatal(err.Error())
				}
				if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
					t.Fatal(err.Error())
				}
			}

			// Minimal base config matching tests/tsconfig.base.json without
			// its repository-root extends target.
			baseConfig := map[string]any{
				"compilerOptions": map[string]any{
					"target":                     "es2022",
					"lib":                        []string{"es2022"},
					"module":                     "esnext",
					"moduleResolution":           "bundler",
					"allowImportingTsExtensions": true,
					"noEmit":                     true,
					"strict":                     true,
				},
			}
			baseBytes, err := json.MarshalIndent(baseConfig, "", "  ")
			if err != nil {
				t.Fatal(err.Error())
			}
			writeDir("tests/tsconfig.base.json", string(baseBytes)+"\n")

			// Legacy global snapshot whose text conflicts with both fixtures.
			writeDir("tests/deps/net/dial.gs.ts", "export const who = \"legacy\"\n")

			testName := tc.name
			testPkgGoPathPrefix := "example.test/module/tests/tests/" + testName
			// Each fixture emits its own conflicting net bytes.
			writeDir(
				"tests/tests/"+testName+"/run/output/@goscript/"+testPkgGoPathPrefix+"/main.gs.ts",
				"export const unused = 0\n",
			)
			writeDir(
				"tests/tests/"+testName+"/run/output/@goscript/net/dial.gs.ts",
				"export const who: \""+tc.fixtureTag+"\" = \""+tc.fixtureTag+"\"\n",
			)
			writeDir(
				"tests/tests/"+testName+"/main.gs.ts",
				"import { who } from \"@goscript/net/dial.js\"\n\nconst typed: \""+tc.fixtureTag+"\" = who\n",
			)

			parentModulePath := "example.test/module"
			testDir := filepath.Join(workspace, "tests", "tests", testName)
			tsconfigPath := WriteTypeCheckConfig(t, parentModulePath, workspace, testDir)

			configBytes, err := os.ReadFile(tsconfigPath)
			if err != nil {
				t.Fatal(err.Error())
			}
			var parsed struct {
				CompilerOptions struct {
					Paths map[string][]string `json:"paths"`
				} `json:"compilerOptions"`
			}
			if err := json.Unmarshal(configBytes, &parsed); err != nil {
				t.Fatal(err.Error())
			}
			goscriptPaths := parsed.CompilerOptions.Paths["@goscript/*"]
			if len(goscriptPaths) == 0 {
				t.Fatalf("@goscript/* path mapping missing:\n%s", configBytes)
			}
			wantSuffix := filepath.ToSlash(filepath.Join("tests", "tests", testName, "run", "output", "@goscript", "*"))
			first := goscriptPaths[0]
			isFixtureClosure := len(first) > len(wantSuffix) && first[len(first)-len(wantSuffix):] == wantSuffix
			if !isFixtureClosure {
				t.Fatalf("@goscript/* must resolve this fixture's own run/output closure first, got %q:\n%s", first, configBytes)
			}
			for _, entry := range goscriptPaths[1:] {
				if entry == wantSuffix {
					t.Fatalf("fixture run/output closure duplicated in %q:\n%s", entry, configBytes)
				}
			}

			// The global legacy tree must be byte-identical after config
			// generation; the harness has no write path into it.
			after, err := os.ReadFile(depsDial)
			if err != nil {
				t.Fatal(err.Error())
			}
			if string(before) != string(after) {
				t.Fatalf("global tests/deps changed during fixture typecheck setup")
			}
		})
	}
}
