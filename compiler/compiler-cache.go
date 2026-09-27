package compiler

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"go/parser"
	"go/token"
	"io"
	"os"
	"path"
	"path/filepath"
	"runtime"
	"runtime/debug"
	"slices"
	"strconv"
	"strings"
	"sync"

	jsoniter "github.com/aperturerobotics/json-iterator-lite"
	"golang.org/x/sync/errgroup"
)

// compilerCacheSchema identifies the on-disk artifact entry format.
const compilerCacheSchema = "goscript-package-artifact-v2"

// compilerSemanticsVersion versions emitted-output semantics. Bump this value
// with every behavior-changing compiler commit so artifacts cached by an
// older binary miss and rebuild instead of replaying stale bytes.
const compilerSemanticsVersion = "14"

type compilerCacheEntryKind string

const (
	compilerCacheEntryGenerated compilerCacheEntryKind = "generated"
	compilerCacheEntryCopied    compilerCacheEntryKind = "copied"
	compilerCacheEntryProgram   compilerCacheEntryKind = "program"
)

// errCompilerCacheMiss stops a program replay at its first missing artifact.
var errCompilerCacheMiss = errors.New("compiler cache miss")

// CompilerCacheOwner owns persistent compiler artifact lookup, replay, and store.
//
// Entries come in three kinds. A source entry is keyed by a package's
// transitive sources and the request. An artifact entry adds the semantic facts
// of the package's import closure to its source key and stores one package's
// output. A program entry is keyed by every source entry and lists the artifact
// entries of the last complete compile, so an unchanged program replays before
// semantic analysis.
type CompilerCacheOwner struct{}

type compilerCacheEntry struct {
	key         string
	kind        compilerCacheEntryKind
	packagePath string
}

type compilerCacheManifest struct {
	schema           string
	key              string
	kind             compilerCacheEntryKind
	packagePath      string
	compiledPackages []string
	copiedPackages   []string
	files            []compilerCacheManifestFile
	// artifacts lists the artifact entries of a program manifest.
	artifacts []compilerCacheEntry
}

type compilerCacheManifestFile struct {
	path   string
	kind   string
	sha256 string
	size   uint64
	blob   string
}

// NewCompilerCacheOwner creates the compiler cache owner.
func NewCompilerCacheOwner() *CompilerCacheOwner {
	return &CompilerCacheOwner{}
}

func (o *CompilerCacheOwner) Enabled(req *CompileRequest) bool {
	return req != nil && strings.TrimSpace(req.CacheRoot) != ""
}

// compilerCacheSources identifies a compile by its sources: one entry per
// generated or copied package, and the program entry over all of them.
type compilerCacheSources struct {
	program  compilerCacheEntry
	packages []compilerCacheEntry
}

// Entries returns the source entries of a package graph and its override copy
// plan.
func (o *CompilerCacheOwner) Entries(
	req *CompileRequest,
	graph *PackageGraph,
	overridePlan *overrideCopyPlan,
) compilerCacheSources {
	if !o.Enabled(req) || graph == nil {
		return compilerCacheSources{}
	}

	keyOwner := newCompilerCacheKeyOwner(req, graph)
	var sources compilerCacheSources
	var program strings.Builder
	writeKeyField(&program, "schema", compilerCacheSchema)
	writeKeyField(&program, "kind", string(compilerCacheEntryProgram))
	for _, node := range graph.Nodes {
		// Override candidates emit no package, but the override parity check
		// reads their types, so their sources identify the program.
		if node.OverrideCandidate {
			writeKeyField(&program, "override-candidate|"+node.PkgPath, keyOwner.nodeDigest(node.PkgPath))
			continue
		}
		sources.packages = append(sources.packages, compilerCacheEntry{
			key:         keyOwner.generatedKey(node),
			kind:        compilerCacheEntryGenerated,
			packagePath: node.PkgPath,
		})
	}
	if overridePlan != nil {
		for _, pkg := range overridePlan.packages {
			sources.packages = append(sources.packages, compilerCacheEntry{
				key:         keyOwner.copiedKey(pkg),
				kind:        compilerCacheEntryCopied,
				packagePath: pkg.path,
			})
		}
	}
	for _, entry := range sources.packages {
		writeKeyField(&program, string(entry.kind)+"|"+entry.packagePath, entry.key)
	}
	for _, dir := range req.OverrideDirs {
		writeKeyField(&program, "override-dir", overrideDirIdentity(dir))
	}
	sources.program = compilerCacheEntry{
		key:  sha256String(program.String()),
		kind: compilerCacheEntryProgram,
	}
	return sources
}

// ArtifactEntries rekeys the generated source entries by the semantic facts of
// each package's import closure and the program-wide type info trimming.
// Copied entries depend on their files alone and keep their keys.
func (o *CompilerCacheOwner) ArtifactEntries(
	graph *PackageGraph,
	sources compilerCacheSources,
	model *SemanticModel,
	trimTypeInfo bool,
) []compilerCacheEntry {
	if len(sources.packages) == 0 || graph == nil || model == nil {
		return nil
	}

	facts := newClosureFactsDigester(graph, model.packageFactDigests())
	entries := make([]compilerCacheEntry, 0, len(sources.packages))
	for _, entry := range sources.packages {
		if entry.kind == compilerCacheEntryGenerated {
			var b strings.Builder
			writeKeyField(&b, "schema", compilerCacheSchema)
			writeKeyField(&b, "kind", "artifact")
			writeKeyField(&b, "source-key", entry.key)
			writeKeyField(&b, "closure-facts", facts.digest(entry.packagePath))
			writeKeyField(&b, "universe-facts", facts.facts[universeFactsPackage])
			writeKeyField(&b, "trim-type-info", strconv.FormatBool(trimTypeInfo))
			entry.key = sha256String(b.String())
		}
		entries = append(entries, entry)
	}
	return entries
}

// ReplayProgram replays the artifacts of the last complete compile of the
// program identified by its sources. Any missing artifact fails the whole
// replay.
func (o *CompilerCacheOwner) ReplayProgram(
	ctx context.Context,
	req *CompileRequest,
	sources compilerCacheSources,
) (*CompilationResult, bool) {
	if !o.Enabled(req) || len(sources.packages) == 0 {
		return nil, false
	}
	manifest, ok := o.readManifest(req, sources.program)
	if !ok || manifest.kind != compilerCacheEntryProgram {
		return nil, false
	}

	replayed := make([]compilerCacheManifest, len(manifest.artifacts))
	group, groupCtx := errgroup.WithContext(ctx)
	group.SetLimit(runtime.GOMAXPROCS(0))
	for idx, artifact := range manifest.artifacts {
		group.Go(func() error {
			if err := groupCtx.Err(); err != nil {
				return err
			}
			entryManifest, ok := o.replayEntry(req, artifact)
			if !ok {
				return errCompilerCacheMiss
			}
			replayed[idx] = entryManifest
			return nil
		})
	}
	if err := group.Wait(); err != nil {
		return nil, false
	}

	result := &CompilationResult{}
	for _, entryManifest := range replayed {
		result.CompiledPackages = append(result.CompiledPackages, entryManifest.compiledPackages...)
		result.CopiedPackages = append(result.CopiedPackages, entryManifest.copiedPackages...)
	}
	return result, true
}

// ReplayGenerated replays every generated artifact entry found in the cache and
// returns the replayed package paths. Packages that miss must be compiled.
func (o *CompilerCacheOwner) ReplayGenerated(
	ctx context.Context,
	req *CompileRequest,
	artifactEntries []compilerCacheEntry,
) map[string]bool {
	if !o.Enabled(req) {
		return nil
	}
	var mtx sync.Mutex
	replayed := make(map[string]bool)
	var group errgroup.Group
	group.SetLimit(runtime.GOMAXPROCS(0))
	for _, entry := range artifactEntries {
		if entry.kind != compilerCacheEntryGenerated {
			continue
		}
		group.Go(func() error {
			if ctx.Err() != nil {
				return nil
			}
			if _, ok := o.replayEntry(req, entry); ok {
				mtx.Lock()
				replayed[entry.packagePath] = true
				mtx.Unlock()
			}
			return nil
		})
	}
	group.Wait()
	return replayed
}

// StoreProgram records the artifact entries of a complete compile under the
// program's sources.
func (o *CompilerCacheOwner) StoreProgram(
	req *CompileRequest,
	sources compilerCacheSources,
	artifactEntries []compilerCacheEntry,
) {
	if !o.Enabled(req) || len(sources.packages) == 0 || len(artifactEntries) == 0 {
		return
	}
	o.storeManifest(req, compilerCacheManifest{
		schema:    compilerCacheSchema,
		key:       sources.program.key,
		kind:      compilerCacheEntryProgram,
		artifacts: artifactEntries,
	})
}

// replayEntry writes one package entry's files to the output tree.
func (o *CompilerCacheOwner) replayEntry(req *CompileRequest, entry compilerCacheEntry) (compilerCacheManifest, bool) {
	manifest, ok := o.readManifest(req, entry)
	if !ok || manifest.kind != entry.kind || manifest.packagePath != entry.packagePath {
		return compilerCacheManifest{}, false
	}
	if !o.replayManifest(req, manifest) {
		return compilerCacheManifest{}, false
	}
	return manifest, true
}

func (o *CompilerCacheOwner) StoreGenerated(
	req *CompileRequest,
	entries []compilerCacheEntry,
	program *LoweredProgram,
	files map[string]string,
) {
	if !o.Enabled(req) || program == nil || len(files) == 0 {
		return
	}
	entriesByPackage := entriesByKindAndPackage(entries, compilerCacheEntryGenerated)
	for _, pkg := range program.packages {
		entry, ok := entriesByPackage[pkg.pkgPath]
		if !ok {
			continue
		}
		prefix := "@goscript/" + pkg.pkgPath + "/"
		manifest := compilerCacheManifest{
			schema:           compilerCacheSchema,
			key:              entry.key,
			kind:             compilerCacheEntryGenerated,
			packagePath:      pkg.pkgPath,
			compiledPackages: []string{pkg.pkgPath},
		}
		for filePath, contents := range files {
			if !strings.HasPrefix(filePath, prefix) {
				continue
			}
			manifest.files = append(manifest.files, compilerCacheManifestFile{
				path:   filePath,
				kind:   generatedArtifactKind(filePath),
				sha256: sha256Hex([]byte(contents)),
				size:   uint64(len(contents)),
				blob:   o.storeBlob(req, []byte(contents)),
			})
		}
		slices.SortFunc(manifest.files, func(a, b compilerCacheManifestFile) int {
			return strings.Compare(a.path, b.path)
		})
		o.storeManifest(req, manifest)
	}
}

func (o *CompilerCacheOwner) StoreCopied(
	req *CompileRequest,
	entries []compilerCacheEntry,
	plan *overrideCopyPlan,
) {
	if !o.Enabled(req) || plan == nil {
		return
	}
	entriesByPackage := entriesByKindAndPackage(entries, compilerCacheEntryCopied)
	for _, pkg := range plan.packages {
		entry, ok := entriesByPackage[pkg.path]
		if !ok {
			continue
		}
		manifest := compilerCacheManifest{
			schema:         compilerCacheSchema,
			key:            entry.key,
			kind:           compilerCacheEntryCopied,
			packagePath:    pkg.path,
			copiedPackages: []string{pkg.path},
		}
		for _, file := range pkg.files {
			artifactPath := "@goscript/" + filepath.ToSlash(file.path)
			manifest.files = append(manifest.files, compilerCacheManifestFile{
				path:   artifactPath,
				kind:   "override",
				size:   uint64(len(file.data)),
				blob:   o.storeBlob(req, file.data),
				sha256: sha256Hex(file.data),
			})
		}
		slices.SortFunc(manifest.files, func(a, b compilerCacheManifestFile) int {
			return strings.Compare(a.path, b.path)
		})
		o.storeManifest(req, manifest)
	}
}

func (o *CompilerCacheOwner) readManifest(req *CompileRequest, entry compilerCacheEntry) (compilerCacheManifest, bool) {
	if len(entry.key) != sha256.Size*2 {
		return compilerCacheManifest{}, false
	}
	path := filepath.Join(o.entryDir(req, entry.key), "manifest.json")
	data, err := os.ReadFile(path)
	if err != nil {
		return compilerCacheManifest{}, false
	}
	if _, err := os.Stat(filepath.Join(o.entryDir(req, entry.key), "complete")); err != nil {
		return compilerCacheManifest{}, false
	}
	manifest := parseCompilerCacheManifest(data)
	if manifest.schema != compilerCacheSchema || manifest.key != entry.key {
		return compilerCacheManifest{}, false
	}
	if len(manifest.files) == 0 && len(manifest.artifacts) == 0 {
		return compilerCacheManifest{}, false
	}
	return manifest, true
}

func (o *CompilerCacheOwner) replayManifest(req *CompileRequest, manifest compilerCacheManifest) bool {
	var madeDir string
	for _, file := range manifest.files {
		if !safeOutputArtifactPath(file.path) || !safeCacheBlobPath(file.blob) {
			return false
		}
		blobPath := filepath.Join(o.schemaRoot(req), filepath.FromSlash(file.blob))
		data, err := os.ReadFile(blobPath)
		if err != nil || uint64(len(data)) != file.size || sha256Hex(data) != file.sha256 {
			return false
		}
		dest := filepath.Join(req.OutputPath, filepath.FromSlash(file.path))
		if dir := filepath.Dir(dest); dir != madeDir {
			if err := os.MkdirAll(dir, 0o755); err != nil {
				return false
			}
			madeDir = dir
		}
		if err := writeOutputFile(dest, string(data)); err != nil {
			return false
		}
	}
	return true
}

// storeManifest writes cache metadata on a best-effort basis. A failed store leaves no entry, and the next compile rebuilds.
func (o *CompilerCacheOwner) storeManifest(req *CompileRequest, manifest compilerCacheManifest) {
	if len(manifest.files) == 0 && len(manifest.artifacts) == 0 {
		return
	}
	tmpRoot := filepath.Join(o.schemaRoot(req), "tmp")
	if err := os.MkdirAll(tmpRoot, 0o755); err != nil {
		return
	}
	tmpDir, err := os.MkdirTemp(tmpRoot, "entry-")
	if err != nil {
		return
	}
	defer os.RemoveAll(tmpDir)

	data := formatCompilerCacheManifest(manifest)
	if err := os.WriteFile(filepath.Join(tmpDir, "manifest.json"), data, 0o644); err != nil {
		return
	}
	if err := os.WriteFile(filepath.Join(tmpDir, "complete"), []byte("complete\n"), 0o644); err != nil {
		return
	}
	entryDir := o.entryDir(req, manifest.key)
	if err := os.MkdirAll(filepath.Dir(entryDir), 0o755); err != nil {
		return
	}
	if err := os.Rename(tmpDir, entryDir); err != nil {
		if _, statErr := os.Stat(filepath.Join(entryDir, "complete")); statErr == nil {
			return
		}
	}
}

// storeBlob writes a cache blob on a best-effort basis. A failed store leaves no blob, and the next compile rebuilds.
func (o *CompilerCacheOwner) storeBlob(req *CompileRequest, data []byte) string {
	digest := sha256Hex(data)
	rel := path.Join("blobs", "sha256", digest[:2], digest)
	blobPath := filepath.Join(o.schemaRoot(req), filepath.FromSlash(rel))
	if _, err := os.Stat(blobPath); err == nil {
		return rel
	}
	if err := os.MkdirAll(filepath.Dir(blobPath), 0o755); err != nil {
		return rel
	}
	tmp, err := os.CreateTemp(filepath.Dir(blobPath), "blob-")
	if err != nil {
		return rel
	}
	tmpName := tmp.Name()
	written, writeErr := tmp.Write(data)
	closeErr := tmp.Close()
	if writeErr != nil || closeErr != nil || written != len(data) {
		os.Remove(tmpName)
		return rel
	}
	if err := os.Rename(tmpName, blobPath); err != nil {
		os.Remove(tmpName)
	}
	return rel
}

func (o *CompilerCacheOwner) schemaRoot(req *CompileRequest) string {
	return filepath.Join(req.CacheRoot, compilerCacheSchema)
}

func (o *CompilerCacheOwner) entryDir(req *CompileRequest, key string) string {
	return filepath.Join(o.schemaRoot(req), "entries", key[:2], key)
}

func entriesByKindAndPackage(entries []compilerCacheEntry, kind compilerCacheEntryKind) map[string]compilerCacheEntry {
	out := make(map[string]compilerCacheEntry)
	for _, entry := range entries {
		if entry.kind == kind {
			out[entry.packagePath] = entry
		}
	}
	return out
}

// closureFactsDigester combines the fact digests of each package's import
// closure.
type closureFactsDigester struct {
	graph   *PackageGraph
	facts   map[string]string
	digests map[string]string
}

func newClosureFactsDigester(graph *PackageGraph, facts map[string]string) *closureFactsDigester {
	return &closureFactsDigester{
		graph:   graph,
		facts:   facts,
		digests: make(map[string]string),
	}
}

// digest returns the facts digest of pkgPath and its transitive imports.
func (d *closureFactsDigester) digest(pkgPath string) string {
	if digest, ok := d.digests[pkgPath]; ok {
		return digest
	}
	var b strings.Builder
	writeKeyField(&b, "facts", d.facts[pkgPath])
	if node := d.graph.NodesByPackagePath[pkgPath]; node != nil {
		for _, importPath := range node.Imports {
			writeKeyField(&b, "import", importPath)
			writeKeyField(&b, "import-facts", d.digest(importPath))
		}
	}
	digest := sha256String(b.String())
	d.digests[pkgPath] = digest
	return digest
}

type compilerCacheKeyOwner struct {
	req   *CompileRequest
	graph *PackageGraph
	// ownDigests holds the digest of each node's own files and side inputs.
	ownDigests map[string]string
	// graphDigests memoizes nodeDigest.
	graphDigests map[string]string
}

// newCompilerCacheKeyOwner digests every node's own inputs in parallel. Each
// module's identity files are read once and shared by its packages.
func newCompilerCacheKeyOwner(req *CompileRequest, graph *PackageGraph) *compilerCacheKeyOwner {
	moduleIdentities := make(map[string][]string)
	for _, node := range graph.Nodes {
		if _, ok := moduleIdentities[node.ModuleDir]; ok {
			continue
		}
		var identities []string
		for _, file := range moduleIdentityFiles(node.ModuleDir) {
			identities = append(identities, fileIdentity(file))
		}
		moduleIdentities[node.ModuleDir] = identities
	}

	ownDigests := make([]string, len(graph.Nodes))
	forEachParallel(len(graph.Nodes), func(idx int) {
		ownDigests[idx] = nodeOwnDigest(req, graph.Nodes[idx], moduleIdentities[graph.Nodes[idx].ModuleDir])
	})
	owner := &compilerCacheKeyOwner{
		req:          req,
		graph:        graph,
		ownDigests:   make(map[string]string, len(graph.Nodes)),
		graphDigests: make(map[string]string, len(graph.Nodes)),
	}
	for idx, node := range graph.Nodes {
		owner.ownDigests[node.PkgPath] = ownDigests[idx]
	}
	return owner
}

func (o *compilerCacheKeyOwner) generatedKey(node *PackageGraphNode) string {
	var b strings.Builder
	writeKeyField(&b, "schema", compilerCacheSchema)
	writeCompilerIdentity(&b)
	writeRequestIdentity(&b, o.req)
	writeKeyField(&b, "kind", string(compilerCacheEntryGenerated))
	writeKeyField(&b, "package-digest", o.nodeDigest(node.PkgPath))
	return sha256String(b.String())
}

func (o *compilerCacheKeyOwner) copiedKey(pkg overrideCopyPackage) string {
	var b strings.Builder
	writeKeyField(&b, "schema", compilerCacheSchema)
	writeCompilerIdentity(&b)
	writeRequestIdentity(&b, o.req)
	writeKeyField(&b, "kind", string(compilerCacheEntryCopied))
	writeKeyField(&b, "package", pkg.path)
	for _, file := range pkg.files {
		writeKeyField(&b, "override-file", file.path)
		writeKeyField(&b, "override-file-sha256", sha256Hex(file.data))
	}
	return sha256String(b.String())
}

// nodeDigest digests a node's own inputs and those of its transitive imports.
func (o *compilerCacheKeyOwner) nodeDigest(pkgPath string) string {
	if digest := o.graphDigests[pkgPath]; digest != "" {
		return digest
	}
	node := o.graph.NodesByPackagePath[pkgPath]
	if node == nil {
		return ""
	}
	var b strings.Builder
	writeKeyField(&b, "own", o.ownDigests[pkgPath])
	for _, importPath := range node.Imports {
		writeKeyField(&b, "import", importPath)
		if o.graph.NodesByPackagePath[importPath] != nil {
			writeKeyField(&b, "import-digest", o.nodeDigest(importPath))
		}
	}
	digest := sha256String(b.String())
	o.graphDigests[pkgPath] = digest
	return digest
}

// nodeOwnDigest digests a node's identity, files, side inputs and module
// identity files.
func nodeOwnDigest(req *CompileRequest, node *PackageGraphNode, moduleIdentities []string) string {
	var b strings.Builder
	writeKeyField(&b, "id", node.ID)
	writeKeyField(&b, "path", node.PkgPath)
	writeKeyField(&b, "name", node.Name)
	writeKeyField(&b, "module-path", node.ModulePath)
	writeKeyField(&b, "module-dir", node.ModuleDir)
	writeKeyField(&b, "for-test", node.ForTest)
	writeKeyField(&b, "requested", strconv.FormatBool(node.Requested))
	writeKeyField(&b, "override-candidate", strconv.FormatBool(node.OverrideCandidate))
	for _, file := range node.GoFiles {
		writeKeyField(&b, "go-file", fileIdentity(file))
	}
	for _, file := range node.CompiledGoFiles {
		writeKeyField(&b, "compiled-file", fileIdentity(file))
	}
	for _, input := range compilerCacheSideInputs(req, node) {
		writeKeyField(&b, "side-input", input)
	}
	for _, identity := range moduleIdentities {
		writeKeyField(&b, "module-file", identity)
	}
	return sha256String(b.String())
}

// overrideDirIdentity digests every file under an override directory, which
// decides the override facts the parity check reads.
func overrideDirIdentity(dir string) string {
	var b strings.Builder
	err := filepath.WalkDir(dir, func(path string, entry os.DirEntry, err error) error {
		if err != nil || entry.IsDir() {
			return err
		}
		writeKeyField(&b, "file", fileIdentity(path))
		return nil
	})
	if err != nil {
		writeKeyField(&b, "error", err.Error())
	}
	return cleanAbs(dir) + "|" + sha256String(b.String())
}

// writeCompilerIdentity writes the producing-binary identity fields of a
// cache key.
func writeCompilerIdentity(b *strings.Builder) {
	writeCompilerIdentityWithSemantics(b, compilerSemanticsVersion)
}

// writeCompilerIdentityWithSemantics writes the identity fields with an
// explicit semantics version so tests can pin that a bump invalidates keys.
func writeCompilerIdentityWithSemantics(b *strings.Builder, semanticsVersion string) {
	writeKeyField(b, "semantics-version", semanticsVersion)
	writeKeyField(b, "go-version", runtime.Version())
	writeKeyField(b, "executable", executableIdentity())
	if info, ok := debug.ReadBuildInfo(); ok {
		writeKeyField(b, "module", info.Main.Path+"@"+info.Main.Version)
		for _, dep := range info.Deps {
			writeKeyField(b, "dep", dep.Path+"@"+dep.Version)
			if dep.Replace != nil {
				writeKeyField(b, "dep-replace", dep.Replace.Path+"@"+dep.Replace.Version)
			}
		}
	}
}

// executableIdentity names the running compiler binary. Development builds
// report no module version, so the binary's path, size and modification time
// keep a rebuilt compiler from replaying another binary's output.
var executableIdentity = sync.OnceValue(func() string {
	exe, err := os.Executable()
	if err != nil {
		return "unknown|" + err.Error()
	}
	info, err := os.Stat(exe)
	if err != nil {
		return exe + "|stat|" + err.Error()
	}
	return strings.Join([]string{
		exe,
		strconv.FormatInt(info.Size(), 10),
		strconv.FormatInt(info.ModTime().UnixNano(), 10),
	}, "|")
})

func writeRequestIdentity(b *strings.Builder, req *CompileRequest) {
	if req == nil {
		return
	}
	for _, pattern := range req.Patterns {
		writeKeyField(b, "pattern", pattern)
	}
	writeKeyField(b, "dir", cleanAbs(req.Dir))
	if req.ProtobufTypeScriptBinding {
		writeKeyField(b, "protobuf-output", cleanAbs(req.OutputPath))
		for _, root := range req.AdditionalBindingRoots {
			writeKeyField(b, "protobuf-binding-root", cleanAbs(root))
		}
	}
	for _, flag := range goScriptBuildFlags(req.BuildFlags) {
		writeKeyField(b, "build-flag", flag)
	}
	for _, dir := range req.OverrideDirs {
		writeKeyField(b, "override-dir", cleanAbs(dir))
	}
	for _, function := range req.DeferredFunctions {
		writeKeyField(b, "deferred-function", function)
	}
	for _, path := range req.PackageBlocklist {
		writeKeyField(b, "blocklist", path)
	}
	writeKeyField(b, "dependency-mode", string(req.DependencyMode))
	writeKeyField(b, "runtime-mode", string(req.RuntimeEmissionMode))
	writeKeyField(b, "protobuf-ts-binding", strconv.FormatBool(req.ProtobufTypeScriptBinding))
	writeKeyField(b, "tests", strconv.FormatBool(req.Tests))
	for _, key := range goLoaderEnvKeys() {
		writeKeyField(b, "env-"+key, os.Getenv(key))
	}
}

func writeKeyField(b *strings.Builder, key, value string) {
	b.WriteString(key)
	b.WriteByte('=')
	b.WriteString(strconv.Quote(value))
	b.WriteByte('\n')
}

func goLoaderEnvKeys() []string {
	return []string{
		"GOFLAGS",
		"GOMODCACHE",
		"GONOPROXY",
		"GONOSUMDB",
		"GOPATH",
		"GOPRIVATE",
		"GOPROXY",
		"GOROOT",
		"GOSUMDB",
		"GOWORK",
	}
}

func compilerCacheSideInputs(req *CompileRequest, node *PackageGraphNode) []string {
	if node == nil {
		return nil
	}
	var inputs []string
	for _, file := range node.CompiledGoFiles {
		inputs = append(inputs, compilerCacheGoEmbedSideInputs(file)...)
	}
	inputs = append(inputs, compilerCacheProtobufSideInputs(req, node)...)
	slices.Sort(inputs)
	return inputs
}

func compilerCacheGoEmbedSideInputs(goFile string) []string {
	data, err := os.ReadFile(goFile)
	if err != nil || !bytes.Contains(data, []byte("go:embed")) {
		return nil
	}
	syntax, err := parser.ParseFile(token.NewFileSet(), goFile, data, parser.ParseComments)
	if err != nil {
		return []string{"go:embed-parse|" + cleanAbs(goFile) + "|" + err.Error()}
	}
	patterns := goEmbedPatterns(syntax.Comments...)
	if len(patterns) == 0 {
		return nil
	}
	pkgDir := filepath.Dir(goFile)
	var inputs []string
	for _, pattern := range patterns {
		files, err := compilerCacheGoEmbedFiles(pkgDir, pattern)
		if err != nil {
			inputs = append(inputs, "go:embed-error|"+cleanAbs(goFile)+"|"+pattern+"|"+err.Error())
			continue
		}
		for _, file := range files {
			inputs = append(inputs, "go:embed-file|"+pattern+"|"+fileIdentity(file))
		}
	}
	return inputs
}

func compilerCacheGoEmbedFiles(pkgDir, pattern string) ([]string, error) {
	pattern = strings.Trim(pattern, "`\"")
	all := false
	if strings.HasPrefix(pattern, "all:") {
		all = true
		pattern = strings.TrimPrefix(pattern, "all:")
	}
	cleanPattern := path.Clean(pattern)
	if pattern == "" ||
		path.IsAbs(pattern) ||
		cleanPattern == "." ||
		cleanPattern == ".." ||
		strings.HasPrefix(cleanPattern, "../") {
		return nil, errors.New("unsupported go:embed pattern")
	}

	paths := []string{filepath.Join(pkgDir, filepath.FromSlash(cleanPattern))}
	if strings.ContainsAny(cleanPattern, "*?[") {
		matches, err := filepath.Glob(filepath.Join(pkgDir, filepath.FromSlash(cleanPattern)))
		if err != nil {
			return nil, err
		}
		if len(matches) == 0 {
			return nil, errors.New("go:embed pattern matched no files")
		}
		paths = matches
	}

	var files []string
	for _, absPath := range paths {
		collected, err := compilerCacheCollectGoEmbedPath(absPath, all)
		if err != nil {
			return nil, err
		}
		files = append(files, collected...)
	}
	slices.Sort(files)
	return files, nil
}

func compilerCacheCollectGoEmbedPath(absPath string, all bool) ([]string, error) {
	info, err := os.Stat(absPath)
	if err != nil {
		return nil, err
	}
	if !info.IsDir() {
		return []string{absPath}, nil
	}

	var files []string
	err = filepath.WalkDir(absPath, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path != absPath && !all && (strings.HasPrefix(entry.Name(), ".") || strings.HasPrefix(entry.Name(), "_")) {
			if entry.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if entry.IsDir() {
			return nil
		}
		files = append(files, path)
		return nil
	})
	if err != nil {
		return nil, err
	}
	if len(files) == 0 {
		return nil, errors.New("go:embed directory matched no files")
	}
	return files, nil
}

func compilerCacheProtobufSideInputs(req *CompileRequest, node *PackageGraphNode) []string {
	if req == nil || !req.ProtobufTypeScriptBinding {
		return nil
	}
	sourceRoot := protobufTypeScriptBindingRoot(req.Dir)
	var inputs []string
	for _, sourcePath := range node.CompiledGoFiles {
		if !strings.HasSuffix(sourcePath, ".pb.go") ||
			strings.HasSuffix(filepath.Base(sourcePath), "_srpc.pb.go") ||
			!protobufTypeScriptBindingInSourceRoot(sourceRoot, sourcePath, req.AdditionalBindingRoots...) {
			continue
		}
		tsPath := strings.TrimSuffix(sourcePath, ".go") + ".ts"
		inputs = append(inputs, "protobuf-ts-binding|"+fileIdentity(tsPath))
	}
	return inputs
}

func moduleIdentityFiles(moduleDir string) []string {
	if moduleDir == "" {
		return nil
	}
	var files []string
	for _, name := range []string{"go.mod", "go.sum", "vendor/modules.txt"} {
		file := filepath.Join(moduleDir, name)
		if _, err := os.Stat(file); err == nil {
			files = append(files, file)
		}
	}
	return files
}

func fileIdentity(file string) string {
	data, err := os.ReadFile(file)
	if err != nil {
		return filepath.ToSlash(file) + "|missing|" + err.Error()
	}
	return cleanAbs(file) + "|" + sha256Hex(data)
}

func cleanAbs(file string) string {
	if file == "" {
		return ""
	}
	abs, err := filepath.Abs(file)
	if err != nil {
		return filepath.ToSlash(filepath.Clean(file))
	}
	return filepath.ToSlash(filepath.Clean(abs))
}

func generatedArtifactKind(filePath string) string {
	if strings.HasSuffix(filePath, "/index.ts") {
		return "package-index"
	}
	return "generated"
}

func safeOutputArtifactPath(filePath string) bool {
	if filePath == "" || strings.Contains(filePath, "\\") {
		return false
	}
	clean := path.Clean(filePath)
	return clean == filePath &&
		!path.IsAbs(clean) &&
		!strings.HasPrefix(clean, "../") &&
		clean != ".." &&
		(strings.HasPrefix(clean, "@goscript/") || clean == "@goscript")
}

func safeCacheBlobPath(filePath string) bool {
	if filePath == "" || strings.Contains(filePath, "\\") {
		return false
	}
	clean := path.Clean(filePath)
	return clean == filePath &&
		!path.IsAbs(clean) &&
		!strings.HasPrefix(clean, "../") &&
		clean != ".." &&
		strings.HasPrefix(clean, "blobs/sha256/")
}

func sha256Hex(data []byte) string {
	sum := sha256.Sum256(data)
	return hex.EncodeToString(sum[:])
}

func sha256String(data string) string {
	return sha256Hex([]byte(data))
}

func formatCompilerCacheManifest(manifest compilerCacheManifest) []byte {
	var buf bytes.Buffer
	stream := jsoniter.NewStream(&buf, 4096, 2)
	stream.WriteObjectStart()
	stream.WriteObjectField("schema")
	stream.WriteString(manifest.schema)
	stream.WriteMore()
	stream.WriteObjectField("key")
	stream.WriteString(manifest.key)
	stream.WriteMore()
	stream.WriteObjectField("kind")
	stream.WriteString(string(manifest.kind))
	stream.WriteMore()
	stream.WriteObjectField("packagePath")
	stream.WriteString(manifest.packagePath)
	stream.WriteMore()
	writeStringArray(stream, "compiledPackages", manifest.compiledPackages)
	stream.WriteMore()
	writeStringArray(stream, "copiedPackages", manifest.copiedPackages)
	stream.WriteMore()
	stream.WriteObjectField("files")
	stream.WriteArrayStart()
	for idx, file := range manifest.files {
		if idx != 0 {
			stream.WriteMore()
		}
		stream.WriteObjectStart()
		stream.WriteObjectField("path")
		stream.WriteString(file.path)
		stream.WriteMore()
		stream.WriteObjectField("kind")
		stream.WriteString(file.kind)
		stream.WriteMore()
		stream.WriteObjectField("sha256")
		stream.WriteString(file.sha256)
		stream.WriteMore()
		stream.WriteObjectField("size")
		stream.WriteUint64(file.size)
		stream.WriteMore()
		stream.WriteObjectField("blob")
		stream.WriteString(file.blob)
		stream.WriteObjectEnd()
	}
	stream.WriteArrayEnd()
	stream.WriteMore()
	stream.WriteObjectField("artifacts")
	stream.WriteArrayStart()
	for idx, artifact := range manifest.artifacts {
		if idx != 0 {
			stream.WriteMore()
		}
		stream.WriteObjectStart()
		stream.WriteObjectField("kind")
		stream.WriteString(string(artifact.kind))
		stream.WriteMore()
		stream.WriteObjectField("packagePath")
		stream.WriteString(artifact.packagePath)
		stream.WriteMore()
		stream.WriteObjectField("key")
		stream.WriteString(artifact.key)
		stream.WriteObjectEnd()
	}
	stream.WriteArrayEnd()
	stream.WriteObjectEnd()
	if stream.Error != nil {
		return nil
	}
	return slices.Clone(stream.Buffer())
}

func writeStringArray(stream *jsoniter.Stream, field string, values []string) {
	stream.WriteObjectField(field)
	stream.WriteArrayStart()
	for idx, value := range values {
		if idx != 0 {
			stream.WriteMore()
		}
		stream.WriteString(value)
	}
	stream.WriteArrayEnd()
}

func parseCompilerCacheManifest(data []byte) compilerCacheManifest {
	var manifest compilerCacheManifest
	iter := jsoniter.ParseBytes(data)
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "schema":
			manifest.schema = iter.ReadString()
		case "key":
			manifest.key = iter.ReadString()
		case "kind":
			manifest.kind = compilerCacheEntryKind(iter.ReadString())
		case "packagePath":
			manifest.packagePath = iter.ReadString()
		case "compiledPackages":
			manifest.compiledPackages = readStringArray(iter)
		case "copiedPackages":
			manifest.copiedPackages = readStringArray(iter)
		case "files":
			for iter.ReadArray() {
				manifest.files = append(manifest.files, readManifestFile(iter))
			}
		case "artifacts":
			for iter.ReadArray() {
				manifest.artifacts = append(manifest.artifacts, readManifestArtifact(iter))
			}
		default:
			iter.Skip()
		}
	}
	if iter.Error != nil && !errors.Is(iter.Error, io.EOF) {
		return compilerCacheManifest{}
	}
	return manifest
}

func readStringArray(iter *jsoniter.Iterator) []string {
	var values []string
	for iter.ReadArray() {
		values = append(values, iter.ReadString())
	}
	return values
}

func readManifestFile(iter *jsoniter.Iterator) compilerCacheManifestFile {
	var file compilerCacheManifestFile
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "path":
			file.path = iter.ReadString()
		case "kind":
			file.kind = iter.ReadString()
		case "sha256":
			file.sha256 = iter.ReadString()
		case "size":
			file.size = iter.ReadUint64()
		case "blob":
			file.blob = iter.ReadString()
		default:
			iter.Skip()
		}
	}
	return file
}

func readManifestArtifact(iter *jsoniter.Iterator) compilerCacheEntry {
	var artifact compilerCacheEntry
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "kind":
			artifact.kind = compilerCacheEntryKind(iter.ReadString())
		case "packagePath":
			artifact.packagePath = iter.ReadString()
		case "key":
			artifact.key = iter.ReadString()
		default:
			iter.Skip()
		}
	}
	return artifact
}
