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
	"reflect"
	"runtime"
	"runtime/debug"
	"slices"
	"strconv"
	"strings"
	"sync"

	jsoniter "github.com/aperturerobotics/json-iterator-lite"
	"golang.org/x/mod/modfile"
	"golang.org/x/sync/errgroup"
)

// compilerCacheSchema identifies the on-disk artifact entry format.
const compilerCacheSchema = "goscript-package-artifact-v2"

// compilerSemanticsVersion versions emitted-output semantics. Bump this value
// with every behavior-changing compiler commit so artifacts cached by an
// older binary miss and rebuild instead of replaying stale bytes.
const compilerSemanticsVersion = "16"

type compilerCacheEntryKind string

const (
	compilerCacheEntryGenerated compilerCacheEntryKind = "generated"
	compilerCacheEntryCopied    compilerCacheEntryKind = "copied"
	compilerCacheEntryProgram   compilerCacheEntryKind = "program"
	compilerCacheEntrySummary   compilerCacheEntryKind = "summary"
)

// errCompilerCacheMiss stops a program replay at its first missing artifact.
var errCompilerCacheMiss = errors.New("compiler cache miss")

// CompilerCacheOwner owns persistent compiler artifact lookup, replay, and store.
//
// Entries come in four kinds. A source entry is keyed by a package's
// transitive sources and the request. An artifact entry adds the semantic facts
// of the package's import closure to its source key and stores one package's
// output. A program entry is keyed by every source entry and lists the artifact
// entries of the last complete compile, so an unchanged program replays before
// semantic analysis. A summary entry is keyed by a package's source key and
// stores its body summary, so the package checks without bodies.
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
	writeKeyField(&program, "identity", keyOwner.identity)
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
	// Workers report misses through replayed, never through the group.
	_ = group.Wait()
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

// summaryEntry returns the summary entry of a generated source entry.
func summaryEntry(entry compilerCacheEntry) compilerCacheEntry {
	var b strings.Builder
	writeKeyField(&b, "schema", compilerCacheSchema)
	writeKeyField(&b, "kind", string(compilerCacheEntrySummary))
	writeKeyField(&b, "source-key", entry.key)
	return compilerCacheEntry{
		key:         sha256String(b.String()),
		kind:        compilerCacheEntrySummary,
		packagePath: entry.packagePath,
	}
}

// Summaries reads the stored body summaries of the generated packages, by
// package path.
func (o *CompilerCacheOwner) Summaries(req *CompileRequest, sources compilerCacheSources) map[string][]byte {
	summaries := make(map[string][]byte)
	if !o.Enabled(req) {
		return summaries
	}
	var mtx sync.Mutex
	var group errgroup.Group
	group.SetLimit(runtime.GOMAXPROCS(0))
	for _, entry := range sources.packages {
		if entry.kind != compilerCacheEntryGenerated {
			continue
		}
		group.Go(func() error {
			entry := summaryEntry(entry)
			manifest, ok := o.readManifest(req, entry)
			if !ok || manifest.kind != entry.kind || manifest.packagePath != entry.packagePath || len(manifest.files) != 1 {
				return nil
			}
			data, ok := o.readBlob(req, manifest.files[0])
			if !ok {
				return nil
			}
			mtx.Lock()
			summaries[entry.packagePath] = data
			mtx.Unlock()
			return nil
		})
	}
	// Workers report misses by leaving no summary, never through the group.
	_ = group.Wait()
	return summaries
}

// StoreSummaries stores the body summaries a build extracted under their
// packages' source entries.
func (o *CompilerCacheOwner) StoreSummaries(
	req *CompileRequest,
	sources compilerCacheSources,
	summaries map[string][]byte,
) {
	if !o.Enabled(req) || len(summaries) == 0 {
		return
	}
	for _, entry := range sources.packages {
		data, ok := summaries[entry.packagePath]
		if !ok || entry.kind != compilerCacheEntryGenerated {
			continue
		}
		entry := summaryEntry(entry)
		o.storeManifest(req, compilerCacheManifest{
			schema:      compilerCacheSchema,
			key:         entry.key,
			kind:        compilerCacheEntrySummary,
			packagePath: entry.packagePath,
			files: []compilerCacheManifestFile{{
				path:   "summary",
				kind:   string(compilerCacheEntrySummary),
				sha256: sha256Hex(data),
				size:   uint64(len(data)),
				blob:   o.storeBlob(req, data),
			}},
		})
	}
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
			// A nested package's files share the prefix but belong to its
			// own entry, keyed by its own sources.
			name, ok := strings.CutPrefix(filePath, prefix)
			if !ok || strings.Contains(name, "/") {
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
	if info, err := os.Stat(path); err == nil {
		markCompilerCacheUsed(path, info)
	}
	return manifest, true
}

func (o *CompilerCacheOwner) replayManifest(req *CompileRequest, manifest compilerCacheManifest) bool {
	var madeDir string
	for _, file := range manifest.files {
		if !safeOutputArtifactPath(file.path) {
			return false
		}
		dest := filepath.Join(req.OutputPath, filepath.FromSlash(file.path))
		if o.outputMatches(req, dest, file) {
			continue
		}
		data, ok := o.readBlob(req, file)
		if !ok {
			return false
		}
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

// outputMatches reports whether dest already holds a manifest file whose blob
// is still stored, and marks the blob used. Replay then leaves dest alone
// without reading the blob.
func (o *CompilerCacheOwner) outputMatches(req *CompileRequest, dest string, file compilerCacheManifestFile) bool {
	if !safeCacheBlobPath(file.blob) {
		return false
	}
	existing, err := os.ReadFile(dest)
	if err != nil || uint64(len(existing)) != file.size || sha256Hex(existing) != file.sha256 {
		return false
	}
	blobPath := filepath.Join(o.schemaRoot(req), filepath.FromSlash(file.blob))
	info, err := os.Stat(blobPath)
	if err != nil {
		return false
	}
	markCompilerCacheUsed(blobPath, info)
	return true
}

// readBlob reads and verifies the blob of a manifest file.
func (o *CompilerCacheOwner) readBlob(req *CompileRequest, file compilerCacheManifestFile) ([]byte, bool) {
	if !safeCacheBlobPath(file.blob) {
		return nil, false
	}
	blobPath := filepath.Join(o.schemaRoot(req), filepath.FromSlash(file.blob))
	data, err := os.ReadFile(blobPath)
	if err != nil || uint64(len(data)) != file.size || sha256Hex(data) != file.sha256 {
		return nil, false
	}
	if info, err := os.Stat(blobPath); err == nil {
		markCompilerCacheUsed(blobPath, info)
	}
	return data, true
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
	defer func() { _ = os.RemoveAll(tmpDir) }()

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
		manifestPath := filepath.Join(entryDir, "manifest.json")
		if info, statErr := os.Stat(manifestPath); statErr == nil {
			markCompilerCacheUsed(manifestPath, info)
		}
	}
}

// storeBlob writes a cache blob on a best-effort basis. A failed store leaves no blob, and the next compile rebuilds.
func (o *CompilerCacheOwner) storeBlob(req *CompileRequest, data []byte) string {
	digest := sha256Hex(data)
	rel := path.Join("blobs", "sha256", digest[:2], digest)
	blobPath := filepath.Join(o.schemaRoot(req), filepath.FromSlash(rel))
	if info, err := os.Stat(blobPath); err == nil {
		markCompilerCacheUsed(blobPath, info)
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
		_ = os.Remove(tmpName)
		return rel
	}
	if err := os.Rename(tmpName, blobPath); err != nil {
		_ = os.Remove(tmpName)
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
	// roots name source directories in keys, longest directory first.
	roots []compilerCacheKeyRoot
	// identity digests the schema, compiler and request fields every key
	// shares.
	identity string
	// ownDigests holds the digest of each node's own files and side inputs.
	ownDigests map[string]string
	// graphDigests memoizes nodeDigest.
	graphDigests map[string]string
}

// compilerCacheKeyRoot names a source directory in cache keys.
type compilerCacheKeyRoot struct {
	dir  string
	name string
}

// newCompilerCacheKeyOwner digests every node's own inputs in parallel. Each
// module's identity files are read once and shared by its packages.
func newCompilerCacheKeyOwner(req *CompileRequest, graph *PackageGraph) *compilerCacheKeyOwner {
	owner := &compilerCacheKeyOwner{
		req:          req,
		graph:        graph,
		roots:        compilerCacheKeyRoots(graph),
		ownDigests:   make(map[string]string, len(graph.Nodes)),
		graphDigests: make(map[string]string, len(graph.Nodes)),
	}
	owner.identity = owner.sharedIdentity()

	moduleIdentities := make(map[string][]string)
	for _, node := range graph.Nodes {
		if _, ok := moduleIdentities[node.ModuleDir]; ok {
			continue
		}
		var identities []string
		for _, file := range moduleIdentityFiles(node.ModuleDir) {
			identities = append(identities, owner.moduleFileIdentity(file))
		}
		moduleIdentities[node.ModuleDir] = identities
	}

	ownDigests := make([]string, len(graph.Nodes))
	forEachParallel(len(graph.Nodes), func(idx int) {
		node := graph.Nodes[idx]
		ownDigests[idx] = owner.nodeOwnDigest(node, moduleIdentities[node.ModuleDir])
	})
	for idx, node := range graph.Nodes {
		owner.ownDigests[node.PkgPath] = ownDigests[idx]
	}
	return owner
}

// compilerCacheKeyRoots names each module directory by its module path and the
// standard library source directory by std. Keys then match across checkouts
// and machines that hold the same sources.
func compilerCacheKeyRoots(graph *PackageGraph) []compilerCacheKeyRoot {
	names := make(map[string]string)
	for _, node := range graph.Nodes {
		switch {
		case node.ModuleDir != "":
			names[cleanAbs(node.ModuleDir)] = node.ModulePath
		case len(node.GoFiles) != 0:
			pkgDir := cleanAbs(filepath.Dir(node.GoFiles[0]))
			if root, ok := strings.CutSuffix(pkgDir, "/"+node.PkgPath); ok {
				names[root] = "std"
			}
		}
	}
	roots := make([]compilerCacheKeyRoot, 0, len(names))
	for dir, name := range names {
		roots = append(roots, compilerCacheKeyRoot{dir: dir, name: name})
	}
	slices.SortFunc(roots, func(a, b compilerCacheKeyRoot) int {
		return len(b.dir) - len(a.dir)
	})
	return roots
}

// keyPath names file by the root that holds it, or else relative to the
// request directory, so the checkout location never enters a key.
func (o *compilerCacheKeyOwner) keyPath(file string) string {
	abs := cleanAbs(file)
	for _, root := range o.roots {
		rel, ok := strings.CutPrefix(abs, root.dir)
		if ok && (rel == "" || rel[0] == '/') {
			return root.name + ":" + strings.TrimPrefix(rel, "/")
		}
	}
	rel, err := filepath.Rel(cleanAbs(o.req.Dir), abs)
	if err != nil {
		return abs
	}
	return "dir:" + filepath.ToSlash(rel)
}

// fileIdentity names a file by its key path and content.
func (o *compilerCacheKeyOwner) fileIdentity(file string) string {
	data, err := os.ReadFile(file)
	if err != nil {
		return o.keyPath(file) + "|unreadable"
	}
	return o.keyPath(file) + "|" + sha256Hex(data)
}

// moduleFileIdentity names a module identity file by its key path and
// content. A go.mod counts with its directory replacements keyed, so the
// checkout location never enters a key; the replaced module's own sources key
// its packages.
func (o *compilerCacheKeyOwner) moduleFileIdentity(file string) string {
	data, err := os.ReadFile(file)
	if err != nil {
		return o.keyPath(file) + "|unreadable"
	}
	if filepath.Base(file) == "go.mod" {
		data = o.keyedGoMod(file, data)
	}
	return o.keyPath(file) + "|" + sha256Hex(data)
}

// keyedGoMod rewrites each directory replacement in a go.mod to its key path.
// A go.mod that does not parse or format counts by its raw content.
func (o *compilerCacheKeyOwner) keyedGoMod(file string, data []byte) []byte {
	mod, err := modfile.Parse(file, data, nil)
	if err != nil {
		return data
	}
	for _, replace := range mod.Replace {
		if !modfile.IsDirectoryPath(replace.New.Path) {
			continue
		}
		dir := replace.New.Path
		if !filepath.IsAbs(dir) {
			dir = filepath.Join(filepath.Dir(file), dir)
		}
		if err := mod.AddReplace(replace.Old.Path, replace.Old.Version, o.keyPath(dir), ""); err != nil {
			return data
		}
	}
	keyed, err := mod.Format()
	if err != nil {
		return data
	}
	return keyed
}

// sharedIdentity digests the schema, the compiler identity and the request.
// Override directories count by content, which decides the override facts the
// parity check reads.
func (o *compilerCacheKeyOwner) sharedIdentity() string {
	var b strings.Builder
	writeKeyField(&b, "schema", compilerCacheSchema)
	writeCompilerIdentity(&b)
	req := o.req
	for _, pattern := range req.Patterns {
		writeKeyField(&b, "pattern", pattern)
	}
	writeKeyField(&b, "dir", o.keyPath(req.Dir))
	if req.ProtobufTypeScriptBinding {
		writeKeyField(&b, "protobuf-output", o.keyPath(req.OutputPath))
		for _, root := range req.AdditionalBindingRoots {
			writeKeyField(&b, "protobuf-binding-root", o.keyPath(root))
		}
	}
	for _, flag := range goScriptBuildFlags(req.BuildFlags) {
		writeKeyField(&b, "build-flag", flag)
	}
	for _, dir := range req.OverrideDirs {
		writeKeyField(&b, "override-dir", o.overrideDirDigest(dir))
	}
	for _, function := range req.DeferredFunctions {
		writeKeyField(&b, "deferred-function", function)
	}
	for _, path := range req.PackageBlocklist {
		writeKeyField(&b, "blocklist", path)
	}
	writeKeyField(&b, "dependency-mode", string(req.DependencyMode))
	writeKeyField(&b, "runtime-mode", string(req.RuntimeEmissionMode))
	writeKeyField(&b, "protobuf-ts-binding", strconv.FormatBool(req.ProtobufTypeScriptBinding))
	writeKeyField(&b, "tests", strconv.FormatBool(req.Tests))
	for _, key := range goLoaderEnvKeys() {
		writeKeyField(&b, "env-"+key, os.Getenv(key))
	}
	return sha256String(b.String())
}

// overrideDirDigest digests the relative names and contents of every file
// under an override directory.
func (o *compilerCacheKeyOwner) overrideDirDigest(dir string) string {
	var b strings.Builder
	err := filepath.WalkDir(dir, func(path string, entry os.DirEntry, err error) error {
		if err != nil || entry.IsDir() {
			return err
		}
		rel, err := filepath.Rel(dir, path)
		if err != nil {
			return err
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		writeKeyField(&b, "file", filepath.ToSlash(rel)+"|"+sha256Hex(data))
		return nil
	})
	if err != nil {
		writeKeyField(&b, "unreadable", o.keyPath(dir))
	}
	return sha256String(b.String())
}

func (o *compilerCacheKeyOwner) generatedKey(node *PackageGraphNode) string {
	var b strings.Builder
	writeKeyField(&b, "identity", o.identity)
	writeKeyField(&b, "kind", string(compilerCacheEntryGenerated))
	writeKeyField(&b, "package-digest", o.nodeDigest(node.PkgPath))
	return sha256String(b.String())
}

func (o *compilerCacheKeyOwner) copiedKey(pkg overrideCopyPackage) string {
	var b strings.Builder
	writeKeyField(&b, "identity", o.identity)
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
// identity files. Each source file is read once, for both its identity and
// its embed directives.
func (o *compilerCacheKeyOwner) nodeOwnDigest(node *PackageGraphNode, moduleIdentities []string) string {
	var b strings.Builder
	writeKeyField(&b, "id", node.ID)
	writeKeyField(&b, "path", node.PkgPath)
	writeKeyField(&b, "name", node.Name)
	writeKeyField(&b, "module-path", node.ModulePath)
	writeKeyField(&b, "for-test", node.ForTest)
	writeKeyField(&b, "requested", strconv.FormatBool(node.Requested))
	writeKeyField(&b, "override-candidate", strconv.FormatBool(node.OverrideCandidate))

	identities := make(map[string]string, len(node.CompiledGoFiles))
	var inputs []string
	for _, file := range node.CompiledGoFiles {
		data, err := os.ReadFile(file)
		if err != nil {
			identities[file] = o.keyPath(file) + "|unreadable"
			continue
		}
		identities[file] = o.keyPath(file) + "|" + sha256Hex(data)
		inputs = append(inputs, o.goEmbedSideInputs(file, data)...)
	}
	for _, file := range node.GoFiles {
		identity, ok := identities[file]
		if !ok {
			identity = o.fileIdentity(file)
		}
		writeKeyField(&b, "go-file", identity)
	}
	for _, file := range node.CompiledGoFiles {
		writeKeyField(&b, "compiled-file", identities[file])
	}

	inputs = append(inputs, o.protobufSideInputs(node)...)
	slices.Sort(inputs)
	for _, input := range inputs {
		writeKeyField(&b, "side-input", input)
	}
	for _, identity := range moduleIdentities {
		writeKeyField(&b, "module-file", identity)
	}
	return sha256String(b.String())
}

// writeCompilerIdentity writes the producing-binary identity fields of a
// cache key.
func writeCompilerIdentity(b *strings.Builder) {
	writeCompilerIdentityWithSemantics(b, compilerSemanticsVersion)
}

// writeCompilerIdentityWithSemantics writes the identity fields with an
// explicit semantics version so tests can pin that a bump invalidates keys.
// A released compiler is named by its module version. A development build
// carries no trustworthy version, so its executable's content names it.
func writeCompilerIdentityWithSemantics(b *strings.Builder, semanticsVersion string) {
	writeKeyField(b, "semantics-version", semanticsVersion)
	writeKeyField(b, "go-version", runtime.Version())
	info, ok := debug.ReadBuildInfo()
	if !ok || !compilerModuleVersioned(info) {
		writeKeyField(b, "executable-sha256", executableDigest())
	}
	if !ok {
		return
	}
	writeKeyField(b, "module", info.Main.Path+"@"+info.Main.Version)
	for _, dep := range info.Deps {
		writeKeyField(b, "dep", dep.Path+"@"+dep.Version)
		if dep.Replace != nil {
			writeKeyField(b, "dep-replace", dep.Replace.Path+"@"+dep.Replace.Version)
		}
	}
}

// compilerModuleVersioned reports whether the build names a released version
// of the module holding the compiler. Local replacements, development builds
// and modified checkouts are unversioned.
func compilerModuleVersioned(info *debug.BuildInfo) bool {
	pkgPath := reflect.TypeFor[CompilerCacheOwner]().PkgPath()
	modules := append([]*debug.Module{&info.Main}, info.Deps...)
	for _, mod := range modules {
		if pkgPath != mod.Path && !strings.HasPrefix(pkgPath, mod.Path+"/") {
			continue
		}
		if mod.Replace != nil {
			mod = mod.Replace
		}
		return mod.Version != "" &&
			mod.Version != "(devel)" &&
			!strings.HasSuffix(mod.Version, "+dirty")
	}
	return false
}

// executableDigest hashes the running compiler binary. A rebuilt binary at the
// same path, or the same binary at another path, keys correctly.
var executableDigest = sync.OnceValue(func() string {
	exe, err := os.Executable()
	if err != nil {
		return "unknown|" + err.Error()
	}
	f, err := os.Open(exe)
	if err != nil {
		return exe + "|" + err.Error()
	}
	defer f.Close() //nolint:errcheck
	h := sha256.New()
	if _, err := io.Copy(h, f); err != nil {
		return exe + "|" + err.Error()
	}
	return hex.EncodeToString(h.Sum(nil))
})

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

// goEmbedSideInputs names the files a Go source's go:embed directives embed.
func (o *compilerCacheKeyOwner) goEmbedSideInputs(goFile string, data []byte) []string {
	if !bytes.Contains(data, []byte("go:embed")) {
		return nil
	}
	syntax, err := parser.ParseFile(token.NewFileSet(), goFile, data, parser.ParseComments|parser.SkipObjectResolution)
	if err != nil {
		return []string{"go:embed-parse|" + o.keyPath(goFile)}
	}
	pkgDir := filepath.Dir(goFile)
	var inputs []string
	for _, pattern := range goEmbedPatterns(syntax.Comments...) {
		files, err := compilerCacheGoEmbedFiles(pkgDir, pattern)
		if err != nil {
			inputs = append(inputs, "go:embed-error|"+o.keyPath(goFile)+"|"+pattern)
			continue
		}
		for _, file := range files {
			inputs = append(inputs, "go:embed-file|"+pattern+"|"+o.fileIdentity(file))
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

// protobufSideInputs names the TypeScript bindings the protobuf binding mode
// reads beside a node's generated protobuf sources.
func (o *compilerCacheKeyOwner) protobufSideInputs(node *PackageGraphNode) []string {
	if !o.req.ProtobufTypeScriptBinding {
		return nil
	}
	sourceRoot := protobufTypeScriptBindingRoot(o.req.Dir)
	var inputs []string
	for _, sourcePath := range node.CompiledGoFiles {
		if !strings.HasSuffix(sourcePath, ".pb.go") ||
			strings.HasSuffix(filepath.Base(sourcePath), "_srpc.pb.go") ||
			!protobufTypeScriptBindingInSourceRoot(sourceRoot, sourcePath, o.req.AdditionalBindingRoots...) {
			continue
		}
		tsPath := strings.TrimSuffix(sourcePath, ".go") + ".ts"
		inputs = append(inputs, "protobuf-ts-binding|"+o.fileIdentity(tsPath))
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
