package compiler

import (
	"os"
	"path/filepath"
	"runtime"
	"testing"
	"time"
)

// TestSourceDigestsTrustOnlyMatchingStamps pins that a stored digest is used
// only while the file's stamp matches, so an edit that keeps the size and
// restores the modification time is still read.
func TestSourceDigestsTrustOnlyMatchingStamps(t *testing.T) {
	if runtime.GOOS != "linux" && runtime.GOOS != "darwin" {
		t.Skip("no change time on this platform")
	}
	dir := t.TempDir()
	req := &CompileRequest{Dir: dir, CacheRoot: filepath.Join(dir, "cache")}
	file := filepath.Join(dir, "a.go")
	if err := os.WriteFile(file, []byte("package a // one\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	info, err := os.Stat(file)
	if err != nil {
		t.Fatal(err)
	}
	settled := time.Now().Add(time.Hour)

	load := func() *sourceDigests {
		d := loadSourceDigests(req)
		d.now = settled
		return d
	}
	first := load()
	want, _, err := first.digest(file)
	if err != nil {
		t.Fatal(err)
	}
	first.store()

	unchanged := load()
	if got, _, err := unchanged.digest(file); err != nil || got != want {
		t.Fatalf("unchanged digest = %q, %v, want %q", got, err, want)
	}
	if unchanged.changed {
		t.Fatal("unchanged file was read instead of matched by its stamp")
	}

	if err := os.WriteFile(file, []byte("package a // two\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Chtimes(file, info.ModTime(), info.ModTime()); err != nil {
		t.Fatal(err)
	}
	edited := load()
	got, _, err := edited.digest(file)
	if err != nil {
		t.Fatal(err)
	}
	if got == want {
		t.Fatal("same-size edit with a restored modification time kept the old digest")
	}
}
