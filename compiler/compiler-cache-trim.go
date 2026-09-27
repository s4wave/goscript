package compiler

import (
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// Cache files carry their last use in their modification time, as in the Go
// build cache. Marking is coarse so a replay rarely writes metadata, and trim
// runs at most once per interval.
const (
	// compilerCacheMarkInterval is how stale a use mark may grow before a use
	// refreshes it.
	compilerCacheMarkInterval = time.Hour
	// compilerCacheTrimInterval is the minimum time between trims.
	compilerCacheTrimInterval = 24 * time.Hour
	// compilerCacheMaxAge is how long an unused entry or blob is kept.
	compilerCacheMaxAge = 5 * 24 * time.Hour
)

// compilerCacheSchemaPrefix names every schema root under a cache root.
const compilerCacheSchemaPrefix = "goscript-package-artifact-"

// markCompilerCacheUsed records a use of a cache file whose modification time
// is older than the mark interval.
func markCompilerCacheUsed(path string, info os.FileInfo) {
	now := time.Now()
	if now.Sub(info.ModTime()) < compilerCacheMarkInterval {
		return
	}
	_ = os.Chtimes(path, now, now)
}

// Trim removes entries and blobs unused for the maximum age, and the roots of
// other cache schemas, at most once per trim interval. A removed entry or blob
// makes a later lookup miss, and the compile that misses rebuilds it.
func (o *CompilerCacheOwner) Trim(req *CompileRequest) {
	if !o.Enabled(req) {
		return
	}
	now := time.Now()
	trimPath := filepath.Join(req.CacheRoot, "trim.txt")
	if data, err := os.ReadFile(trimPath); err == nil {
		last, err := strconv.ParseInt(strings.TrimSpace(string(data)), 10, 64)
		if err == nil && now.Sub(time.Unix(last, 0)) < compilerCacheTrimInterval {
			return
		}
	}
	if err := os.WriteFile(trimPath, []byte(strconv.FormatInt(now.Unix(), 10)+"\n"), 0o644); err != nil {
		return
	}

	roots, _ := os.ReadDir(req.CacheRoot)
	for _, root := range roots {
		if root.IsDir() && strings.HasPrefix(root.Name(), compilerCacheSchemaPrefix) && root.Name() != compilerCacheSchema {
			_ = os.RemoveAll(filepath.Join(req.CacheRoot, root.Name()))
		}
	}

	cutoff := now.Add(-compilerCacheMaxAge)
	schemaRoot := o.schemaRoot(req)
	manifestUsedAt := func(dir string) (os.FileInfo, error) {
		return os.Stat(filepath.Join(dir, "manifest.json"))
	}
	trimCompilerCacheFanout(filepath.Join(schemaRoot, "entries"), cutoff, manifestUsedAt)
	trimCompilerCacheFanout(filepath.Join(schemaRoot, "blobs", "sha256"), cutoff, os.Stat)
	trimCompilerCacheItems(filepath.Join(schemaRoot, "tmp"), cutoff, os.Stat)
}

// trimCompilerCacheFanout trims every fan-out directory under root.
func trimCompilerCacheFanout(root string, cutoff time.Time, usedAt func(string) (os.FileInfo, error)) {
	fanouts, _ := os.ReadDir(root)
	for _, fanout := range fanouts {
		trimCompilerCacheItems(filepath.Join(root, fanout.Name()), cutoff, usedAt)
	}
}

// trimCompilerCacheItems removes the items of dir whose use time, read through
// usedAt, is before cutoff.
func trimCompilerCacheItems(dir string, cutoff time.Time, usedAt func(string) (os.FileInfo, error)) {
	items, _ := os.ReadDir(dir)
	for _, item := range items {
		itemPath := filepath.Join(dir, item.Name())
		info, err := usedAt(itemPath)
		if err != nil || info.ModTime().Before(cutoff) {
			_ = os.RemoveAll(itemPath)
		}
	}
}
