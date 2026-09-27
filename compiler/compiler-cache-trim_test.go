package compiler

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestCompilerCacheTrimRemovesUnusedEntriesAndOldSchemas(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachetrim\n\ngo 1.25.3\n",
		"main.go": "package cachetrim\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)

	req := &CompileRequest{CacheRoot: cacheRoot}
	owner := NewCompilerCacheOwner()
	oldSchema := filepath.Join(cacheRoot, compilerCacheSchemaPrefix+"v1")
	writeFixtureFile(t, oldSchema, "entries/aa/manifest.json", "{}")
	if _, err := os.Stat(filepath.Join(cacheRoot, "trim.txt")); err != nil {
		t.Fatalf("compile did not record a trim: %v", err)
	}

	// A trim inside the interval changes nothing.
	owner.Trim(req)
	if _, err := os.Stat(oldSchema); err != nil {
		t.Fatalf("trim ran before its interval: %v", err)
	}

	stale := time.Now().Add(-compilerCacheMaxAge - time.Hour)
	schemaRoot := owner.schemaRoot(req)
	var entries, blobs int
	for _, dir := range []string{"entries", "blobs"} {
		err := filepath.WalkDir(filepath.Join(schemaRoot, dir), func(path string, entry os.DirEntry, err error) error {
			if err != nil || entry.IsDir() {
				return err
			}
			switch {
			case entry.Name() == "manifest.json":
				entries++
			case dir == "blobs":
				blobs++
			}
			return os.Chtimes(path, stale, stale)
		})
		if err != nil {
			t.Fatal(err)
		}
	}
	if entries == 0 || blobs == 0 {
		t.Fatalf("fixture stored %d entries and %d blobs", entries, blobs)
	}
	writeFixtureFile(t, cacheRoot, "trim.txt", "0\n")

	owner.Trim(req)
	if _, err := os.Stat(oldSchema); !os.IsNotExist(err) {
		t.Fatalf("old schema root survived trim: %v", err)
	}
	for _, dir := range []string{"entries", "blobs"} {
		err := filepath.WalkDir(filepath.Join(schemaRoot, dir), func(path string, entry os.DirEntry, err error) error {
			if err == nil && !entry.IsDir() {
				t.Errorf("stale cache file survived trim: %s", path)
			}
			return err
		})
		if err != nil {
			t.Fatal(err)
		}
	}
}

func TestCompilerCacheReplayMarksEntriesUsed(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachemark\n\ngo 1.25.3\n",
		"main.go": "package cachemark\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)

	stale := time.Now().Add(-compilerCacheMarkInterval - time.Hour)
	var files []string
	err := filepath.WalkDir(filepath.Join(cacheRoot, compilerCacheSchema), func(path string, entry os.DirEntry, err error) error {
		if err != nil || entry.IsDir() || entry.Name() == "complete" {
			return err
		}
		files = append(files, path)
		return os.Chtimes(path, stale, stale)
	})
	if err != nil {
		t.Fatal(err)
	}

	compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "second"), cacheRoot)
	for _, file := range files {
		info, err := os.Stat(file)
		if err != nil {
			t.Fatal(err)
		}
		if !info.ModTime().After(stale) {
			t.Errorf("replay did not mark %s used", file)
		}
	}
}
