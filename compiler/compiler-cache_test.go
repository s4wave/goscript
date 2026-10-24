package compiler

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
)

func TestCompileRequestCarriesCacheRoot(t *testing.T) {
	req := NewCompileRequestOwner().NewRequest(Config{
		Dir:        ".",
		OutputPath: "out",
		CacheRoot:  "cache-root",
	}, []string{"."})
	if req.CacheRoot != "cache-root" {
		t.Fatalf("CacheRoot = %q, want cache-root", req.CacheRoot)
	}
}

func TestCompilePackagesCacheDisabledCreatesNoCacheRoot(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachedefault\n\ngo 1.25.3\n",
		"main.go": "package cachedefault\nconst Value = 1\n",
	})
	outputDir := filepath.Join(t.TempDir(), "out")
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	comp, err := NewCompiler(&Config{
		Dir:        moduleDir,
		OutputPath: outputDir,
		CacheRoot:  "",
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(cacheRoot); !os.IsNotExist(err) {
		t.Fatalf("disabled cache root stat err = %v, want not exist", err)
	}
}

func TestCompilePackagesCacheReplaysOutput(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachereplay\n\ngo 1.25.3\n",
		"main.go": "package cachereplay\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	firstOut := filepath.Join(t.TempDir(), "first")
	result := compileCacheFixture(t, moduleDir, firstOut, cacheRoot)
	if len(result.CompiledPackages) != 1 || result.CompiledPackages[0] != "example.test/cachereplay" {
		t.Fatalf("compiled packages = %#v", result.CompiledPackages)
	}
	manifest := firstCacheManifestPath(t, cacheRoot)
	if manifest == "" {
		t.Fatal("cache manifest not written")
	}
	firstManifestCount := countCacheManifests(t, cacheRoot)

	secondOut := filepath.Join(t.TempDir(), "second")
	second := compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
	if len(second.CompiledPackages) != 1 || second.CompiledPackages[0] != "example.test/cachereplay" {
		t.Fatalf("cached compiled packages = %#v", second.CompiledPackages)
	}

	first := readOutputFile(t, firstOut, "example.test/cachereplay", "main.gs.ts")
	replayed := readOutputFile(t, secondOut, "example.test/cachereplay", "main.gs.ts")
	if first != replayed {
		t.Fatalf("cache replay output changed:\nfirst:\n%s\nsecond:\n%s", first, replayed)
	}
	if got := countCacheManifests(t, cacheRoot); got != firstManifestCount {
		t.Fatalf("cache manifests after replay = %d, want %d", got, firstManifestCount)
	}
}

// TestCompilePackagesCacheReplaysAcrossCheckouts pins that cache keys name
// sources by module and content, so a second checkout of the same module
// replays the first checkout's entries.
func TestCompilePackagesCacheReplaysAcrossCheckouts(t *testing.T) {
	files := map[string]string{
		"go.mod":       "module example.test/cachecheckout\n\ngo 1.25.3\n",
		"main.go":      "package cachecheckout\n\nimport (\n\t_ \"embed\"\n\n\t\"example.test/cachecheckout/sub\"\n)\n\n//go:embed value.txt\nvar Value string\n\nconst Name = sub.Other\n",
		"value.txt":    "value\n",
		"sub/sub.go":   "package sub\nconst Name = \"sub\"\n",
		"sub/other.go": "package sub\nconst Other = Name\n",
	}
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixture(t, writePackageGraphFixture(t, files), filepath.Join(t.TempDir(), "first"), cacheRoot)
	manifests := countCacheManifests(t, cacheRoot)

	second := writePackageGraphFixture(t, files)
	compileCacheFixture(t, second, filepath.Join(t.TempDir(), "second"), cacheRoot)
	if got := countCacheManifests(t, cacheRoot); got != manifests {
		t.Fatalf("cache manifests after second checkout = %d, want %d", got, manifests)
	}

	// Another program of the same checkout, requested from its package
	// directory, replays the package artifact it shares and adds only its
	// program manifest and its own body summary, which another request's
	// facts would not let it use.
	comp, err := NewCompiler(&Config{
		Dir:        filepath.Join(second, "sub"),
		OutputPath: filepath.Join(t.TempDir(), "sub"),
		CacheRoot:  cacheRoot,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err)
	}
	if got := countCacheManifests(t, cacheRoot); got != manifests+2 {
		t.Fatalf("cache manifests after second program = %d, want %d", got, manifests+2)
	}
}

// TestCompilePackagesCacheReplaysAcrossReplacedCheckouts pins that a go.mod
// replacing a module with an absolute directory keys that directory by its
// module, so a generated module in a second checkout still replays. The second
// module sits deeper, as a build tool's per platform directory does, and both
// name a protobuf binding root that holds no package of the graph.
func TestCompilePackagesCacheReplaysAcrossReplacedCheckouts(t *testing.T) {
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	config := Config{ProtobufTypeScriptBinding: true, AdditionalBindingRoots: []string{t.TempDir()}}
	checkout := func(outputName, appPath string) {
		root := writePackageGraphFixture(t, map[string]string{
			"lib/go.mod":           "module example.test/lib\n\ngo 1.25.3\n",
			"lib/lib.go":           "package lib\nconst Name = \"lib\"\n",
			appPath + "/main.go": "package main\n\nimport \"example.test/lib\"\n\nfunc main() { println(lib.Name) }\n",
		})
		appDir := filepath.Join(root, appPath)
		writeFixtureFile(t, appDir, "go.mod", "module example.test/app\n\ngo 1.25.3\n\nrequire example.test/lib v0.0.0\n\nreplace example.test/lib => "+filepath.Join(root, "lib")+"\n")
		compileCacheFixtureConfig(t, config, appDir, filepath.Join(t.TempDir(), outputName), cacheRoot)
	}
	checkout("first", "app")
	manifests := countCacheManifests(t, cacheRoot)

	checkout("second", "web/js/app")
	if got := countCacheManifests(t, cacheRoot); got != manifests {
		t.Fatalf("cache manifests after second checkout = %d, want %d", got, manifests)
	}
}

func TestCompilePackagesCacheReplaysEquivalentMultiPackageOutput(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":      "module example.test/cacheequiv\n\ngo 1.25.3\n",
		"version.txt": "1.2.3\n",
		"main.go": strings.Join([]string{
			"package cacheequiv",
			"import (",
			"  _ \"embed\"",
			"  \"example.test/cacheequiv/dep\"",
			"  _ \"example.test/cacheequiv/side\"",
			")",
			"//go:embed version.txt",
			"var Version string",
			"const Value = dep.Value",
			"",
		}, "\n"),
		"foo.pb.go": "package cacheequiv\ntype Foo struct{}\n",
		"foo.pb.ts": "export const Foo = \"first\";\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"const Value = 3",
			"",
		}, "\n"),
		"side/side.go": strings.Join([]string{
			"package side",
			"func init() {}",
			"",
		}, "\n"),
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	outputRoot := filepath.Join(t.TempDir(), "out")
	compileCacheFixtureConfig(t, Config{
		ProtobufTypeScriptBinding: true,
	}, moduleDir, outputRoot, cacheRoot)
	firstSnapshot := outputTreeSnapshot(t, outputRoot)
	firstManifestCount := countCacheManifests(t, cacheRoot)

	if err := os.RemoveAll(outputRoot); err != nil {
		t.Fatal(err)
	}
	compileCacheFixtureConfig(t, Config{
		ProtobufTypeScriptBinding: true,
	}, moduleDir, outputRoot, cacheRoot)
	secondSnapshot := outputTreeSnapshot(t, outputRoot)
	if firstSnapshot != secondSnapshot {
		t.Fatalf("cache replay output differs:\nfirst:\n%s\nsecond:\n%s", firstSnapshot, secondSnapshot)
	}
	if got := countCacheManifests(t, cacheRoot); got != firstManifestCount {
		t.Fatalf("cache manifests after multi-package replay = %d, want %d", got, firstManifestCount)
	}
}

func TestCompilePackagesCacheReplaysChangedNestedPackage(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/cachenest\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package cachenest",
			"import (",
			"  \"example.test/cachenest/lib\"",
			"  \"example.test/cachenest/lib/child\"",
			")",
			"const Value = lib.Value + child.Value",
			"",
		}, "\n"),
		"lib/lib.go":         "package lib\nconst Value = 1\n",
		"lib/child/child.go": "package child\nconst Value = 2\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixtureConfig(t, Config{}, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)

	childFile := filepath.Join(moduleDir, "lib", "child", "child.go")
	if err := os.WriteFile(childFile, []byte("package child\nconst Value = 3\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	compileCacheFixtureConfig(t, Config{}, moduleDir, filepath.Join(t.TempDir(), "second"), cacheRoot)
	replayOut := filepath.Join(t.TempDir(), "replay")
	compileCacheFixtureConfig(t, Config{}, moduleDir, replayOut, cacheRoot)
	text := readOutputFile(t, replayOut, "example.test/cachenest/lib/child", "child.gs.ts")
	if !strings.Contains(text, "Value: number = 3") {
		t.Fatalf("replay wrote stale nested package output:\n%s", text)
	}

	err := filepath.WalkDir(cacheRoot, func(path string, entry os.DirEntry, err error) error {
		if err != nil || entry.IsDir() || entry.Name() != "manifest.json" {
			return err
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		manifest := parseCompilerCacheManifest(data)
		if manifest.kind != compilerCacheEntryGenerated {
			return nil
		}
		prefix := "@goscript/" + manifest.packagePath + "/"
		for _, file := range manifest.files {
			name, ok := strings.CutPrefix(file.path, prefix)
			if !ok || strings.Contains(name, "/") {
				t.Errorf("%s entry holds foreign file %s", manifest.packagePath, file.path)
			}
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}

func TestCompilePackagesCacheInvalidatesSourceChange(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cacheinvalidate\n\ngo 1.25.3\n",
		"main.go": "package cacheinvalidate\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	firstOut := filepath.Join(t.TempDir(), "first")
	compileCacheFixture(t, moduleDir, firstOut, cacheRoot)

	if err := os.WriteFile(filepath.Join(moduleDir, "main.go"), []byte("package cacheinvalidate\nconst Value = 2\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	secondOut := filepath.Join(t.TempDir(), "second")
	compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
	text := readOutputFile(t, secondOut, "example.test/cacheinvalidate", "main.gs.ts")
	if !strings.Contains(text, "Value: number = 2") {
		t.Fatalf("source change was not reflected in output:\n%s", text)
	}
	if countCacheManifests(t, cacheRoot) < 2 {
		t.Fatal("source change did not create a distinct cache entry")
	}
}

func TestCompilePackagesCacheRequestedModeValidatesImportsBeforeReplay(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/cacherequestedimports\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package cacherequestedimports",
			"import \"example.test/cacherequestedimports/dep\"",
			"const Value = dep.Value",
			"",
		}, "\n"),
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"const Value = 1",
			"",
		}, "\n"),
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)
	firstManifestCount := countCacheManifests(t, cacheRoot)

	if err := os.WriteFile(filepath.Join(moduleDir, "dep", "dep.go"), []byte("package dep\nconst Other = 1\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	comp, err := NewCompiler(&Config{
		Dir:        moduleDir,
		OutputPath: filepath.Join(t.TempDir(), "second"),
		CacheRoot:  cacheRoot,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err == nil {
		t.Fatal("requested-mode cache replay skipped imported package type validation")
	}
	if got := countCacheManifests(t, cacheRoot); got != firstManifestCount {
		t.Fatalf("invalid imported package wrote cache manifests: got %d want %d", got, firstManifestCount)
	}
}

func TestCompilePackagesCacheInvalidatesEmbedFileChange(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":      "module example.test/cacheembed\n\ngo 1.25.3\n",
		"version.txt": "1.2.3\n",
		"main.go": strings.Join([]string{
			"package cacheembed",
			"import _ \"embed\"",
			"//go:embed version.txt",
			"var Version string",
			"",
		}, "\n"),
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	firstOut := filepath.Join(t.TempDir(), "first")
	compileCacheFixtureConfig(t, Config{}, moduleDir, firstOut, cacheRoot)

	if err := os.WriteFile(filepath.Join(moduleDir, "version.txt"), []byte("2.0.0\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	secondOut := filepath.Join(t.TempDir(), "second")
	compileCacheFixtureConfig(t, Config{}, moduleDir, secondOut, cacheRoot)
	text := readOutputFile(t, secondOut, "example.test/cacheembed", "main.gs.ts")
	if !strings.Contains(text, `Version = "2.0.0\n"`) {
		t.Fatalf("embed file change was not reflected in output:\n%s", text)
	}
	if countCacheManifests(t, cacheRoot) < 2 {
		t.Fatal("embed file change did not create a distinct cache entry")
	}
}

func TestCompilePackagesWritesExternalEmbeds(t *testing.T) {
	// A large PNG is external; a small PNG and a large text file stay inline.
	big := strings.Repeat("png", 100)
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":           "module example.test/extembed\n\ngo 1.25.3\n",
		"media/big #1.png": big,
		"media/small.png":  "png",
		"media/notes.txt":  strings.Repeat("text", 100),
		"main.go":          "package extembed\n\nimport \"embed\"\n\n//go:embed media\nvar Media embed.FS\n",
	})
	config := Config{ExternalEmbeds: []string{"*.png"}, ExternalEmbedMinSize: 100}
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	outputDir := filepath.Join(t.TempDir(), "out")
	compileCacheFixtureConfig(t, config, moduleDir, outputDir, cacheRoot)

	// The external file is listed with its size and URL, and written beside
	// the module.
	name := externalEmbedName(goEmbedFile{path: "media/big #1.png", data: []byte(big)})
	text := readOutputFile(t, outputDir, "example.test/extembed", "main.gs.ts")
	entry := `["media/big #1.png", 300, new URL("./@embed/` + strings.ReplaceAll(name, " #", "%20%23") + `", import.meta.url).href]`
	if !strings.Contains(text, entry) {
		t.Fatalf("external embed entry %s was not emitted:\n%s", entry, text)
	}
	if !strings.Contains(text, `["media/small.png", new Uint8Array(`) || !strings.Contains(text, `["media/notes.txt", `) {
		t.Fatalf("small and text files were not inline:\n%s", text)
	}
	if got := readOutputFile(t, outputDir, "example.test/extembed", "@embed/"+name); got != big {
		t.Fatalf("external embed file holds %q", got)
	}

	// A cached compile writes the external file again.
	if err := os.RemoveAll(outputDir); err != nil {
		t.Fatal(err)
	}
	compileCacheFixtureConfig(t, config, moduleDir, outputDir, cacheRoot)
	if got := readOutputFile(t, outputDir, "example.test/extembed", "@embed/"+name); got != big {
		t.Fatalf("replayed external embed file holds %q", got)
	}

	// Without the policy, the file is inline again.
	compileCacheFixtureConfig(t, Config{}, moduleDir, outputDir, cacheRoot)
	text = readOutputFile(t, outputDir, "example.test/extembed", "main.gs.ts")
	if strings.Contains(text, "import.meta.url") {
		t.Fatalf("file was external without the policy:\n%s", text)
	}
}

func TestCompilePackagesCacheInvalidatesAdditionalBindingRoots(t *testing.T) {
	moduleDir := t.TempDir()
	dependencyDir := t.TempDir()
	writeFile := func(path, contents string) {
		t.Helper()
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	writeFile(filepath.Join(moduleDir, "go.mod"), "module example.test/cachepbroot\n\ngo 1.25.3\n\nrequire example.test/cachepbdep v0.0.0\n\nreplace example.test/cachepbdep => "+dependencyDir+"\n")
	writeFile(filepath.Join(moduleDir, "main.go"), "package cachepbroot\n\nimport \"example.test/cachepbdep\"\n\nfunc Use() cachepbdep.Message { return cachepbdep.Message{} }\n")
	writeFile(filepath.Join(dependencyDir, "go.mod"), "module example.test/cachepbdep\n\ngo 1.25.3\n")
	writeFile(filepath.Join(dependencyDir, "message.pb.go"), "package cachepbdep\n\ntype Message struct { Name string }\n")
	writeFile(filepath.Join(dependencyDir, "message.pb.ts"), "export interface Message { name?: string }\nexport const Message = {} as any\n")

	cacheRoot := filepath.Join(t.TempDir(), "cache")
	outputRoot := filepath.Join(t.TempDir(), "out")
	baseConfig := Config{
		ProtobufTypeScriptBinding: true,
	}
	compileCacheFixtureConfig(t, baseConfig, moduleDir, outputRoot, cacheRoot)
	if _, err := os.Stat(filepath.Join(outputRoot, "@goscript", "example.test", "cachepbdep", "message.pb.gs.ts")); err != nil {
		t.Fatalf("initial compile should emit unbound protobuf file: %v", err)
	}
	if err := os.RemoveAll(outputRoot); err != nil {
		t.Fatal(err)
	}
	baseConfig.AdditionalBindingRoots = []string{dependencyDir}
	compileCacheFixtureConfig(t, baseConfig, moduleDir, outputRoot, cacheRoot)
	bound := readOutputFile(t, outputRoot, "example.test/cachepbdep", "message.pb.ts")
	if !strings.Contains(bound, "__protobufTypeScriptMessage = __protobuf_ts.Message") {
		t.Fatalf("additional binding root was not reflected after cache replay:\n%s", bound)
	}
}

func TestCompilePackagesCacheInvalidatesProtobufBindingFileChange(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/cachepb\n\ngo 1.25.3\n",
		"foo.pb.go": `package cachepb

type Foo struct{}
`,
		"foo.pb.ts": `export const Foo = "first";
`,
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	outputRoot := filepath.Join(t.TempDir(), "out")
	compileCacheFixtureConfig(t, Config{ProtobufTypeScriptBinding: true}, moduleDir, outputRoot, cacheRoot)

	if err := os.WriteFile(filepath.Join(moduleDir, "foo.pb.ts"), []byte(`export const Bar = "second";
`), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.RemoveAll(outputRoot); err != nil {
		t.Fatal(err)
	}
	compileCacheFixtureConfig(t, Config{ProtobufTypeScriptBinding: true}, moduleDir, outputRoot, cacheRoot)
	text := readOutputFile(t, outputRoot, "example.test/cachepb", "foo.pb.ts")
	if strings.Contains(text, "__protobufTypeScriptMessage = __protobuf_ts.Foo") {
		t.Fatalf("protobuf binding change was not reflected in output:\n%s", text)
	}
	if countCacheManifests(t, cacheRoot) < 2 {
		t.Fatal("protobuf binding change did not create a distinct cache entry")
	}
}

func TestCompilerCacheKeyInvalidatesRequestAndModuleInputs(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachekey\n\ngo 1.25.3\n",
		"main.go": "package cachekey\nconst Value = 1\n",
	})
	baseReq := &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		CacheRoot:           filepath.Join(t.TempDir(), "cache"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}
	graph := singleNodeCacheGraph(moduleDir, "example.test/cachekey")
	baseKey := generatedCacheKey(t, baseReq, graph)

	cases := []struct {
		name string
		edit func(*CompileRequest)
	}{
		{name: "build flags", edit: func(req *CompileRequest) { req.BuildFlags = []string{"tags=cachetest"} }},
		{name: "package blocklist", edit: func(req *CompileRequest) { req.PackageBlocklist = []string{"example.test/blocked"} }},
		{name: "dependency mode", edit: func(req *CompileRequest) { req.DependencyMode = DependencyModeAll }},
		{name: "runtime mode", edit: func(req *CompileRequest) { req.RuntimeEmissionMode = RuntimeEmissionModeReference }},
		{name: "test variants", edit: func(req *CompileRequest) { req.Tests = true }},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := *baseReq
			tc.edit(&req)
			if key := generatedCacheKey(t, &req, graph); key == baseKey {
				t.Fatalf("%s did not change generated package key", tc.name)
			}
		})
	}

	if err := os.WriteFile(filepath.Join(moduleDir, "go.mod"), []byte("module example.test/cachekey\n\ngo 1.25.3\n\nrequire example.test/dep v0.0.0\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if key := generatedCacheKey(t, baseReq, graph); key == baseKey {
		t.Fatal("module file change did not change generated package key")
	}
}

// TestCompilerCacheKeyChangesWithSemanticsVersion pins that the semantics
// version participates in the compiler identity, so bumping
// compilerSemanticsVersion invalidates every cache entry.
func TestCompilerCacheKeyChangesWithSemanticsVersion(t *testing.T) {
	var previous, bumped strings.Builder
	writeCompilerIdentityWithSemantics(&previous, "0")
	writeCompilerIdentityWithSemantics(&bumped, "1")
	if previous.String() == bumped.String() {
		t.Fatal("semantics version did not change compiler identity")
	}

	var live, current strings.Builder
	writeCompilerIdentity(&live)
	writeCompilerIdentityWithSemantics(&current, compilerSemanticsVersion)
	if live.String() != current.String() {
		t.Fatal("writeCompilerIdentity does not embed compilerSemanticsVersion")
	}
}

func TestCompilerCacheKeyTracksOverridesAndProtobufBindings(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":    "module example.test/cachekeypb\n\ngo 1.25.3\n",
		"foo.pb.go": "package cachekeypb\ntype Foo struct{}\n",
		"foo.pb.ts": "export const Foo = \"first\";\n",
	})
	req := &CompileRequest{
		Patterns:                  []string{"."},
		Dir:                       moduleDir,
		OutputPath:                filepath.Join(t.TempDir(), "out-a"),
		CacheRoot:                 filepath.Join(t.TempDir(), "cache"),
		DependencyMode:            DependencyModeRequested,
		RuntimeEmissionMode:       RuntimeEmissionModeEmit,
		ProtobufTypeScriptBinding: true,
	}
	graph := singleNodeCacheGraph(moduleDir, "example.test/cachekeypb")
	graph.Nodes[0].CompiledGoFiles = []string{filepath.Join(moduleDir, "foo.pb.go")}
	graph.Nodes[0].GoFiles = graph.Nodes[0].CompiledGoFiles
	baseKey := generatedCacheKey(t, req, graph)

	// The output root and patterns belong to the program: a package's output
	// names its bindings by Go package path, so its key ignores them.
	outputReq := *req
	outputReq.OutputPath = filepath.Join(t.TempDir(), "out-b")
	outputReq.Patterns = []string{"./..."}
	if key := generatedCacheKey(t, &outputReq, graph); key != baseKey {
		t.Fatal("protobuf output root or patterns changed generated package key")
	}
	writeFixtureFile(t, moduleDir, "foo.pb.ts", "export const Foo = \"second\";\n")
	if key := generatedCacheKey(t, req, graph); key == baseKey {
		t.Fatal("protobuf TypeScript binding content did not change generated package key")
	}

	plan := &overrideCopyPlan{packages: []overrideCopyPackage{{
		path:  "example.test/cachekeypb",
		files: []overrideCopyFile{{path: "example.test/cachekeypb/index.ts", data: []byte("first")}},
	}}}
	changedPlan := &overrideCopyPlan{packages: []overrideCopyPackage{{
		path:  "example.test/cachekeypb",
		files: []overrideCopyFile{{path: "example.test/cachekeypb/index.ts", data: []byte("second")}},
	}}}
	baseOverrideKey := copiedCacheKey(t, req, graph, plan)
	if key := copiedCacheKey(t, req, graph, changedPlan); key == baseOverrideKey {
		t.Fatal("override file content did not change copied package key")
	}
}

func TestCompilePackagesCacheReplayRechecksChangedParityLedger(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":     "module example.test/cacheparity\n\ngo 1.25.3\n",
		"main.go":    "package main\nimport \"example.test/cacheparity/lib\"\nfunc main() { lib.Present() }\n",
		"lib/lib.go": "package lib\nfunc Present() {}\n",
	})
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/cacheparity/lib/index.ts", "export function Present(): void {}\n")
	writeFixtureFile(t, overrideDir, "example.test/cacheparity/lib/parity.json", parityFixtureJSON(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
	}))
	config := Config{OverrideDirs: []string{overrideDir}}
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixtureConfig(t, config, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)

	writeFixtureFile(t, overrideDir, "example.test/cacheparity/lib/parity.json", parityFixtureJSON(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
		"Absent":  {Status: overrideParityStatusReal},
	}))
	config.Dir = moduleDir
	config.OutputPath = filepath.Join(t.TempDir(), "second")
	config.CacheRoot = cacheRoot
	comp, err := NewCompiler(&config, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	result, err := comp.CompilePackages(context.Background(), ".")
	if err == nil {
		t.Fatal("cache replayed a program whose parity ledger no longer verifies")
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-unknown-symbol")
}

func TestCompilePackagesCacheCorruptionFallsBackToFreshCompile(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachecorrupt\n\ngo 1.25.3\n",
		"main.go": "package cachecorrupt\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	firstOut := filepath.Join(t.TempDir(), "first")
	compileCacheFixture(t, moduleDir, firstOut, cacheRoot)

	blob := firstCacheBlobPath(t, cacheRoot)
	if blob == "" {
		t.Fatal("cache blob not written")
	}
	if err := os.WriteFile(blob, []byte("corrupt"), 0o644); err != nil {
		t.Fatal(err)
	}
	secondOut := filepath.Join(t.TempDir(), "second")
	compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
	text := readOutputFile(t, secondOut, "example.test/cachecorrupt", "main.gs.ts")
	if !strings.Contains(text, "Value: number = 1") {
		t.Fatalf("fresh fallback output missing value:\n%s", text)
	}
}

// TestCompilePackagesCacheReplayRestoresEditedOutput pins that replay into an
// existing output tree compares each file with the manifest, so an edited
// output file is restored from its blob.
func TestCompilePackagesCacheReplayRestoresEditedOutput(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cacherestore\n\ngo 1.25.3\n",
		"main.go": "package cacherestore\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	out := filepath.Join(t.TempDir(), "out")
	compileCacheFixture(t, moduleDir, out, cacheRoot)
	want := readOutputFile(t, out, "example.test/cacherestore", "main.gs.ts")

	path := filepath.Join(out, "@goscript", "example.test", "cacherestore", "main.gs.ts")
	if err := os.WriteFile(path, []byte("edited"), 0o644); err != nil {
		t.Fatal(err)
	}
	compileCacheFixture(t, moduleDir, out, cacheRoot)
	if got := readOutputFile(t, out, "example.test/cacherestore", "main.gs.ts"); got != want {
		t.Fatalf("replayed output = %q, want %q", got, want)
	}
}

func TestCompilePackagesCacheInvalidManifestEntriesFallBackToFreshCompile(t *testing.T) {
	cases := []struct {
		name   string
		tamper func(*testing.T, string)
	}{
		{
			name: "missing blob",
			tamper: func(t *testing.T, cacheRoot string) {
				t.Helper()
				if err := os.Remove(firstCacheBlobPath(t, cacheRoot)); err != nil {
					t.Fatal(err)
				}
			},
		},
		{
			name: "bad key",
			tamper: func(t *testing.T, cacheRoot string) {
				t.Helper()
				manifest := firstCacheManifestPath(t, cacheRoot)
				data, err := os.ReadFile(manifest)
				if err != nil {
					t.Fatal(err)
				}
				data = []byte(strings.Replace(string(data), `"key": "`, `"key": "bad`, 1))
				if err := os.WriteFile(manifest, data, 0o644); err != nil {
					t.Fatal(err)
				}
			},
		},
		{
			name: "unsupported schema",
			tamper: func(t *testing.T, cacheRoot string) {
				t.Helper()
				manifest := firstCacheManifestPath(t, cacheRoot)
				data, err := os.ReadFile(manifest)
				if err != nil {
					t.Fatal(err)
				}
				data = []byte(strings.Replace(string(data), compilerCacheSchema, "unsupported-schema", 1))
				if err := os.WriteFile(manifest, data, 0o644); err != nil {
					t.Fatal(err)
				}
			},
		},
		{
			name: "incomplete entry",
			tamper: func(t *testing.T, cacheRoot string) {
				t.Helper()
				if err := os.Remove(filepath.Join(filepath.Dir(firstCacheManifestPath(t, cacheRoot)), "complete")); err != nil {
					t.Fatal(err)
				}
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			moduleDir := writePackageGraphFixture(t, map[string]string{
				"go.mod":  "module example.test/cacheinvalidmanifest\n\ngo 1.25.3\n",
				"main.go": "package cacheinvalidmanifest\nconst Value = 1\n",
			})
			cacheRoot := filepath.Join(t.TempDir(), "cache")
			compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)
			tc.tamper(t, cacheRoot)

			secondOut := filepath.Join(t.TempDir(), "second")
			compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
			text := readOutputFile(t, secondOut, "example.test/cacheinvalidmanifest", "main.gs.ts")
			if !strings.Contains(text, "Value: number = 1") {
				t.Fatalf("fresh fallback output missing value:\n%s", text)
			}
		})
	}
}

func TestCompilerCacheGoEmbedFilesTreatsQuestionAsPattern(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/cacheembedpattern\n\ngo 1.25.3\n",
		"a.txt":  "one\n",
	})
	files, err := compilerCacheGoEmbedFiles(moduleDir, "?.txt")
	if err != nil {
		t.Fatal(err)
	}
	if len(files) != 1 || !strings.HasSuffix(files[0], string(filepath.Separator)+"a.txt") {
		t.Fatalf("embed pattern files = %#v, want a.txt", files)
	}
}

func TestCompilePackagesCacheConcurrentWritersConverge(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cacheconcurrent\n\ngo 1.25.3\n",
		"main.go": "package cacheconcurrent\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	outputRoots := make([]string, 4)
	for idx := range outputRoots {
		outputRoots[idx] = filepath.Join(t.TempDir(), "out")
	}
	var wg sync.WaitGroup
	errs := make(chan error, 4)
	for idx := range 4 {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			comp, err := NewCompiler(&Config{
				Dir:        moduleDir,
				OutputPath: outputRoots[idx],
				CacheRoot:  cacheRoot,
			}, nil, nil)
			if err != nil {
				errs <- err
				return
			}
			_, err = comp.CompilePackages(context.Background(), ".")
			errs <- err
		}(idx)
	}
	wg.Wait()
	close(errs)
	for err := range errs {
		if err != nil {
			t.Fatal(err)
		}
	}
	if count := countCacheManifests(t, cacheRoot); count == 0 {
		t.Fatal("concurrent writers did not leave any complete cache manifests")
	}
}

func TestCompilePackagesCacheUnsafeManifestPathFallsBackToFreshCompile(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cacheunsafe\n\ngo 1.25.3\n",
		"main.go": "package cacheunsafe\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)

	manifest := firstCacheManifestPath(t, cacheRoot)
	data, err := os.ReadFile(manifest)
	if err != nil {
		t.Fatal(err)
	}
	data = []byte(strings.Replace(string(data), "@goscript/example.test/cacheunsafe/main.gs.ts", "../escape.ts", 1))
	if err := os.WriteFile(manifest, data, 0o644); err != nil {
		t.Fatal(err)
	}

	secondOut := filepath.Join(t.TempDir(), "second")
	compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
	if _, err := os.Stat(filepath.Join(secondOut, "..", "escape.ts")); !os.IsNotExist(err) {
		t.Fatalf("unsafe replay path stat err = %v, want not exist", err)
	}
}

func singleNodeCacheGraph(moduleDir, importPath string) *PackageGraph {
	file := filepath.Join(moduleDir, "main.go")
	node := &PackageGraphNode{
		ID:              importPath,
		PkgPath:         importPath,
		Name:            filepath.Base(importPath),
		ModulePath:      importPath,
		ModuleDir:       moduleDir,
		GoFiles:         []string{file},
		CompiledGoFiles: []string{file},
		Requested:       true,
	}
	return &PackageGraph{
		RequestedPatterns:     []string{"."},
		RequestedPackagePaths: []string{importPath},
		Nodes:                 []*PackageGraphNode{node},
		NodesByPackagePath:    map[string]*PackageGraphNode{importPath: node},
	}
}

func generatedCacheKey(t *testing.T, req *CompileRequest, graph *PackageGraph) string {
	t.Helper()
	entries := NewCompilerCacheOwner().Entries(req, graph, nil).packages
	if len(entries) == 0 {
		t.Fatal("no cache entries")
	}
	return entries[0].key
}

func copiedCacheKey(t *testing.T, req *CompileRequest, graph *PackageGraph, plan *overrideCopyPlan) string {
	t.Helper()
	entries := NewCompilerCacheOwner().Entries(req, graph, plan).packages
	for _, entry := range entries {
		if entry.kind == compilerCacheEntryCopied {
			return entry.key
		}
	}
	t.Fatal("no copied cache entry")
	return ""
}

func compileCacheFixture(t *testing.T, moduleDir, outputDir, cacheRoot string) *CompilationResult {
	t.Helper()
	return compileCacheFixtureConfig(t, Config{}, moduleDir, outputDir, cacheRoot)
}

func compileCacheFixtureConfig(t *testing.T, config Config, moduleDir, outputDir, cacheRoot string) *CompilationResult {
	t.Helper()
	config.Dir = moduleDir
	config.OutputPath = outputDir
	config.CacheRoot = cacheRoot
	comp, err := NewCompiler(&config, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	result, err := comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatal(err)
	}
	return result
}

func readOutputFile(t *testing.T, outputRoot, importPath, name string) string {
	t.Helper()
	data, err := os.ReadFile(filepath.Join(outputRoot, "@goscript", filepath.FromSlash(importPath), name))
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}

func outputTreeSnapshot(t *testing.T, root string) string {
	t.Helper()
	var snapshot strings.Builder
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		snapshot.WriteString(filepath.ToSlash(rel))
		snapshot.WriteByte('\n')
		snapshot.Write(data)
		snapshot.WriteByte('\n')
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return snapshot.String()
}

// firstCacheManifestPath returns the first package manifest, skipping program
// manifests.
func firstCacheManifestPath(t *testing.T, cacheRoot string) string {
	t.Helper()
	var found string
	err := filepath.WalkDir(cacheRoot, func(path string, entry os.DirEntry, err error) error {
		if err != nil || found != "" {
			return err
		}
		if entry.IsDir() || entry.Name() != "manifest.json" {
			return nil
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		if parseCompilerCacheManifest(data).kind != compilerCacheEntryProgram {
			found = path
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return found
}

func firstCacheBlobPath(t *testing.T, cacheRoot string) string {
	t.Helper()
	var found string
	err := filepath.WalkDir(filepath.Join(cacheRoot, compilerCacheSchema, "blobs"), func(path string, entry os.DirEntry, err error) error {
		if err != nil || found != "" {
			return err
		}
		if !entry.IsDir() {
			found = path
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return found
}

func countCacheManifests(t *testing.T, cacheRoot string) int {
	t.Helper()
	count := 0
	err := filepath.WalkDir(cacheRoot, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !entry.IsDir() && entry.Name() == "manifest.json" {
			count++
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return count
}

// cacheFactsFixture has a dependency whose lowered output depends on facts its
// dependent establishes: an async implementation of dep.Runner makes dep.Use
// async, an async callback makes dep.Call async, and taking the address of
// dep.Var makes it a variable reference. decls completes the dependent
// package.
func cacheFactsFixture(decls string) map[string]string {
	return map[string]string{
		"go.mod": "module example.test/cachefacts\n\ngo 1.25.3\n",
		"main.go": "package cachefacts\n\nimport \"example.test/cachefacts/dep\"\n\n" +
			"type runner struct{}\n\n" + decls,
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"import \"example.test/cachefacts/dep/num\"",
			"var Var int",
			"type Runner interface { Run() }",
			"func Use(r Runner) { r.Run() }",
			"func Double(x int) int { return num.Add(x, x) }",
			"func Call(f func()) { f() }",
			"",
		}, "\n"),
		// No edit changes num's closure facts, so a compile that lowers dep
		// again keeps num's check.
		"dep/num/num.go": "package num\n\nfunc Add(a, b int) int { return a + b }\n",
	}
}

const (
	cacheFactsDecls = "func (runner) Run() {}\n\n" +
		"func Start() int { dep.Use(runner{}); return dep.Double(1) }\n"
	cacheFactsBodyEditDecls = "func (runner) Run() {}\n\n" +
		"func Start() int { dep.Use(runner{}); return dep.Double(2) }\n"
	cacheFactsAsyncDecls = "func (runner) Run() { ch := make(chan int, 1); ch <- 1; <-ch }\n\n" +
		"func Start() int { dep.Use(runner{}); return dep.Double(1) }\n"
	cacheFactsVarRefDecls = "func (runner) Run() {}\n\n" +
		"func Start() int { dep.Use(runner{}); p := &dep.Var; *p = 1; return dep.Double(1) }\n"
	cacheFactsExportDecls   = cacheFactsDecls + "\nfunc Triple(x int) int { return x * 3 }\n"
	cacheFactsCallbackDecls = "func (runner) Run() {}\n\n" +
		"func Start() int { dep.Call(func() { ch := make(chan int, 1); ch <- 1; <-ch }); return dep.Double(1) }\n"
)

func TestCompilerCacheArtifactKeysFollowClosureFacts(t *testing.T) {
	const depPath = "example.test/cachefacts/dep"
	const mainPath = "example.test/cachefacts"
	moduleDir := writePackageGraphFixture(t, cacheFactsFixture(cacheFactsDecls))
	keys := func(decls string) map[string]string {
		t.Helper()
		writeFixtureFile(t, moduleDir, "main.go", cacheFactsFixture(decls)["main.go"])
		return cacheFactsArtifactKeys(t, moduleDir)
	}
	base := keys(cacheFactsDecls)

	bodyEdit := keys(cacheFactsBodyEditDecls)
	if bodyEdit[depPath] != base[depPath] {
		t.Fatal("dependent body edit changed the dependency artifact key")
	}
	if bodyEdit[mainPath] == base[mainPath] {
		t.Fatal("body edit kept the edited package artifact key")
	}
	for name, decls := range map[string]string{
		"async implementation": cacheFactsAsyncDecls,
		"variable ref":         cacheFactsVarRefDecls,
	} {
		if keys(decls)[depPath] == base[depPath] {
			t.Fatalf("%s in the dependent kept the dependency artifact key", name)
		}
	}
}

// TestCompilePackagesCacheEditsMatchFreshCompile walks one cache through a
// series of dependent edits and back, checking each cached compile against an
// uncached one. The dependency's body summary is stored once and applied under
// every set of facts its dependent establishes.
func TestCompilePackagesCacheEditsMatchFreshCompile(t *testing.T) {
	edits := []struct {
		name  string
		decls string
		// depChanges is set when the edit changes the dependency's output
		// relative to the base fixture. Interface calls outside a sealed
		// interface and calls of function values with unknown callees are
		// already async, so the async edits change only the dependency's
		// facts.
		depChanges bool
	}{
		{name: "body edit", decls: cacheFactsBodyEditDecls},
		{name: "exported function", decls: cacheFactsExportDecls},
		{name: "async implementation", decls: cacheFactsAsyncDecls},
		{name: "async callback", decls: cacheFactsCallbackDecls},
		{name: "variable ref", decls: cacheFactsVarRefDecls, depChanges: true},
		{name: "revert", decls: cacheFactsDecls},
	}
	config := Config{}
	moduleDir := writePackageGraphFixture(t, cacheFactsFixture(cacheFactsDecls))
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	baseOut := filepath.Join(t.TempDir(), "base")
	compileCacheFixtureConfig(t, config, moduleDir, baseOut, cacheRoot)
	depBase := readOutputFile(t, baseOut, "example.test/cachefacts/dep", "dep.gs.ts")
	for _, edit := range edits {
		writeFixtureFile(t, moduleDir, "main.go", cacheFactsFixture(edit.decls)["main.go"])
		cachedOut := filepath.Join(t.TempDir(), "cached")
		compileCacheFixtureConfig(t, config, moduleDir, cachedOut, cacheRoot)
		freshOut := filepath.Join(t.TempDir(), "fresh")
		compileCacheFixtureConfig(t, config, moduleDir, freshOut, "")

		cached := outputTreeSnapshot(t, cachedOut)
		if fresh := outputTreeSnapshot(t, freshOut); cached != fresh {
			t.Fatalf("%s: cached output differs from fresh compile:\ncached:\n%s\nfresh:\n%s", edit.name, cached, fresh)
		}
		depCached := readOutputFile(t, cachedOut, "example.test/cachefacts/dep", "dep.gs.ts")
		if changed := depCached != depBase; changed != edit.depChanges {
			t.Fatalf("%s: dependency output changed %v, want %v:\n%s", edit.name, changed, edit.depChanges, depCached)
		}
	}
}

// TestCompilePackagesCacheKeepsCallFacts edits a dependent of a package
// whose functions only read some value parameters and pointers and keep or
// change others. The package is then checked without bodies, so its body
// summary must carry those facts: a cached compile that copies no value and
// passes a new field reference where a fresh one does would let the callee
// change the caller's value or keep a pointer that differs from &s.f.
func TestCompilePackagesCacheKeepsCallFacts(t *testing.T) {
	files := func(body string) map[string]string {
		return map[string]string{
			"go.mod": "module example.test/callfacts\n\ngo 1.25.3\n",
			"dep/dep.go": `package dep

type P struct{ X, Y int }

var Saved *int

func Read(p P) int { return p.X }

func Bump(p P) int { p.X++; return p.X }

func Has(p *int) bool { return *p != 0 }

func Keep(p *int) { Saved = p }
`,
			"main.go": `package main

import "example.test/callfacts/dep"

type S struct{ f int }

func main() {
	v := dep.P{X: 1}
	println(dep.Read(v), dep.Bump(v), v.X)
	s := &S{}
	println(dep.Has(&s.f))
	dep.Keep(&s.f)
	println(dep.Saved == &s.f)
` + body + "}\n",
		}
	}
	moduleDir := writePackageGraphFixture(t, files(""))
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	for _, body := range []string{"", "\tprintln(1)\n"} {
		writeFixtureFile(t, moduleDir, "main.go", files(body)["main.go"])
		cachedOut := filepath.Join(t.TempDir(), "cached")
		compileCacheFixtureConfig(t, Config{}, moduleDir, cachedOut, cacheRoot)
		freshOut := filepath.Join(t.TempDir(), "fresh")
		compileCacheFixtureConfig(t, Config{}, moduleDir, freshOut, "")

		cached := outputTreeSnapshot(t, cachedOut)
		if fresh := outputTreeSnapshot(t, freshOut); cached != fresh {
			t.Fatalf("cached output differs from fresh compile:\ncached:\n%s\nfresh:\n%s", cached, fresh)
		}
	}
}

// cacheFactsArtifactKeys loads moduleDir with all dependencies and returns the
// generated artifact key of each package.
func cacheFactsArtifactKeys(t *testing.T, moduleDir string) map[string]string {
	t.Helper()
	ctx := context.Background()
	service := NewCompileService()
	req := service.RequestOwner().NewRequest(Config{
		Dir:        moduleDir,
		OutputPath: t.TempDir(),
		CacheRoot:  t.TempDir(),
	}, []string{"."})
	graph, diagnostics := service.graphOwner.Load(ctx, req)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("load: %v", diagnostics)
	}
	model, diagnostics := service.semanticOwner.Build(ctx, graph, SemanticBuildOptions{})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("semantic model: %v", diagnostics)
	}
	sources := service.cacheOwner.Entries(req, graph, nil)
	keys := make(map[string]string)
	for _, entry := range service.cacheOwner.ArtifactEntries(graph, sources, model, true) {
		if entry.kind == compilerCacheEntryGenerated {
			keys[entry.packagePath] = entry.key
		}
	}
	return keys
}

// TestCompilePackagesCacheWholeProgramRecolorsDependency compiles the facts
// fixture as a program, where dep.Runner is closed over the compiled graph
// and calls through func() values reach only the program's values. An async
// implementation added in the main package makes dep.Use async, and an async
// callback makes dep.Call async, so the dependency's cached output must not
// be reused, and reverting the edit makes both sync again.
func TestCompilePackagesCacheWholeProgramRecolorsDependency(t *testing.T) {
	// The main package completes the fixture as a program.
	program := func(decls string) map[string]string {
		files := cacheFactsFixture(decls + "\nfunc main() { Start() }\n")
		files["main.go"] = strings.Replace(files["main.go"], "package cachefacts", "package main", 1)
		return files
	}
	moduleDir := writePackageGraphFixture(t, program(cacheFactsDecls))
	cacheRoot := filepath.Join(t.TempDir(), "cache")

	// Each edit compiles with and without the cache.
	for _, edit := range []struct {
		name      string
		decls     string
		asyncUse  bool
		asyncCall bool
	}{
		{name: "sync", decls: cacheFactsDecls},
		{name: "async implementation", decls: cacheFactsAsyncDecls, asyncUse: true},
		{name: "revert", decls: cacheFactsDecls},
		{name: "async callback", decls: cacheFactsCallbackDecls, asyncCall: true},
		{name: "revert callback", decls: cacheFactsDecls},
	} {
		writeFixtureFile(t, moduleDir, "main.go", program(edit.decls)["main.go"])
		cachedOut := filepath.Join(t.TempDir(), "cached")
		compileCacheFixtureConfig(t, Config{}, moduleDir, cachedOut, cacheRoot)
		freshOut := filepath.Join(t.TempDir(), "fresh")
		compileCacheFixtureConfig(t, Config{}, moduleDir, freshOut, "")

		// The cached output matches a fresh compile, dep.Use is colored by
		// the implementation, and dep.Call by the program's func() values.
		cached := outputTreeSnapshot(t, cachedOut)
		if fresh := outputTreeSnapshot(t, freshOut); cached != fresh {
			t.Fatalf("%s: cached output differs from fresh compile:\ncached:\n%s\nfresh:\n%s", edit.name, cached, fresh)
		}
		dep := readOutputFile(t, cachedOut, "example.test/cachefacts/dep", "dep.gs.ts")
		if got := strings.Contains(dep, "export async function Use("); got != edit.asyncUse {
			t.Fatalf("%s: dep.Use async %v, want %v:\n%s", edit.name, got, edit.asyncUse, dep)
		}
		if got := strings.Contains(dep, "export async function Call("); got != edit.asyncCall {
			t.Fatalf("%s: dep.Call async %v, want %v:\n%s", edit.name, got, edit.asyncCall, dep)
		}
	}
}

// TestCompilePackagesCacheWholeProgramDefersDependencyTable compiles a
// program whose dependency builds a list from an exported variable that
// points to a large table. The list is deferred while no package changes the
// variable. An assignment added in the main package makes the dependency
// build the list at initialization, so its cached output must not be reused,
// and reverting the edit defers the list again.
func TestCompilePackagesCacheWholeProgramDefersDependencyTable(t *testing.T) {
	// The dependency's list reads Table, which points to a large table.
	data := strings.TrimSuffix(strings.Repeat("1, ", 256), ", ")
	program := func(body string) map[string]string {
		return map[string]string{
			"go.mod":  "module example.test/deferdep\n\ngo 1.25.3\n",
			"main.go": "package main\n\nimport \"example.test/deferdep/dep\"\n\nfunc main() {\n" + body + "\n}\n",
			"dep/dep.go": "package dep\n\ntype T struct{ Data [256]byte }\n\n" +
				"var Table *T = &table\n\nvar table = T{Data: [256]byte{" + data + "}}\n\n" +
				"var List = []*T{Table}\n",
		}
	}
	readBody := "println(len(dep.List))"
	moduleDir := writePackageGraphFixture(t, program(readBody))
	cacheRoot := filepath.Join(t.TempDir(), "cache")

	// Each edit compiles with and without the cache.
	for _, edit := range []struct {
		name     string
		body     string
		deferred bool
	}{
		{name: "read", body: readBody, deferred: true},
		{name: "assign", body: readBody + "\ndep.Table = nil", deferred: false},
		{name: "revert", body: readBody, deferred: true},
	} {
		writeFixtureFile(t, moduleDir, "main.go", program(edit.body)["main.go"])
		cachedOut := filepath.Join(t.TempDir(), "cached")
		compileCacheFixtureConfig(t, Config{}, moduleDir, cachedOut, cacheRoot)
		freshOut := filepath.Join(t.TempDir(), "fresh")
		compileCacheFixtureConfig(t, Config{}, moduleDir, freshOut, "")

		// The cached output matches a fresh compile, and the list is lazy
		// only while Table never changes.
		cached := outputTreeSnapshot(t, cachedOut)
		if fresh := outputTreeSnapshot(t, freshOut); cached != fresh {
			t.Fatalf("%s: cached output differs from fresh compile:\ncached:\n%s\nfresh:\n%s", edit.name, cached, fresh)
		}
		dep := readOutputFile(t, cachedOut, "example.test/deferdep/dep", "dep.gs.ts")
		if got := strings.Contains(dep, "export var List"); got != edit.deferred {
			t.Fatalf("%s: List deferred %v, want %v:\n%s", edit.name, got, edit.deferred, dep)
		}
	}
}

// TestCompilePackagesCacheDeadCodeEditsMatchFreshCompile edits a program
// built with dead code elimination so that the reachable code of an unchanged
// dependency changes. The dependency is checked without bodies, so its
// references come from its body summary, and its artifact replays only while
// the reachability answers it was lowered with hold.
func TestCompilePackagesCacheDeadCodeEditsMatchFreshCompile(t *testing.T) {
	files := func(body string) map[string]string {
		return map[string]string{
			"go.mod": "module example.test/deadcache\n\ngo 1.25.3\n",
			"dep/dep.go": `package dep

type Namer interface{ Name() string }

type T struct{ n int }

func (t *T) Name() string { return helper(t.n) }

func (t *T) Size() int { return t.n }

func helper(n int) string {
	if n > 1 {
		return "many"
	}
	return "one"
}

func New(n int) *T { return &T{n: n} }

func Unused() int { return 7 }
`,
			"main.go": `package main

import "example.test/deadcache/dep"

func main() {
	t := dep.New(2)
` + body + "}\n",
		}
	}
	edits := []struct {
		name string
		body string
	}{
		{name: "base", body: "\t_ = t\n"},
		{name: "direct method", body: "\tprintln(t.Size())\n"},
		{name: "interface method", body: "\tvar n dep.Namer = t\n\tprintln(n.Name())\n"},
		{name: "function", body: "\t_ = t\n\tprintln(dep.Unused())\n"},
		{name: "revert", body: "\t_ = t\n"},
	}
	config := Config{EliminateDeadCode: true}
	moduleDir := writePackageGraphFixture(t, files(edits[0].body))
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	deps := make(map[string]string)
	for _, edit := range edits {
		writeFixtureFile(t, moduleDir, "main.go", files(edit.body)["main.go"])
		freshOut := filepath.Join(t.TempDir(), "fresh")
		compileCacheFixtureConfig(t, config, moduleDir, freshOut, "")
		fresh := outputTreeSnapshot(t, freshOut)
		for pass := range 2 {
			cachedOut := filepath.Join(t.TempDir(), "cached")
			compileCacheFixtureConfig(t, config, moduleDir, cachedOut, cacheRoot)
			if cached := outputTreeSnapshot(t, cachedOut); cached != fresh {
				t.Fatalf("%s pass %d: cached output differs from fresh compile:\ncached:\n%s\nfresh:\n%s", edit.name, pass, cached, fresh)
			}
		}
		dep := readOutputFile(t, freshOut, "example.test/deadcache/dep", "dep.gs.ts")
		for name, other := range deps {
			if other == dep && name != "base" {
				t.Fatalf("%s: dependency output matches %s; the edit did not change its reachable code", edit.name, name)
			}
		}
		deps[edit.name] = dep
	}
}
