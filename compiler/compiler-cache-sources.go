package compiler

import (
	"bytes"
	"crypto/sha256"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

// sourceStampSettle is how long a file must go unchanged before its digest is
// recorded. A file written again within one timestamp tick of a digest keeps
// its stamp, so a recently changed file is read every time until it settles.
const sourceStampSettle = 2 * time.Second

// sourceDigests identifies source files by content, remembering each file's
// digest under its stat stamp so an unchanged file costs a stat instead of a
// read. Each request directory has one index under the schema root.
//
// A stamp names the size, modification time, change time and inode. Every
// write to a file sets its change time, which no tool can set back, so a
// matching stamp means unchanged contents. Platforms without a change time
// record nothing and read every file.
type sourceDigests struct {
	// path is the index file, or empty when the cache is not in use.
	path string
	// now is when the index was read, for the settle rule.
	now time.Time
	// known is the index as read.
	known map[string]sourceDigest

	mu sync.Mutex
	// seen holds the digests used by this compile, which the stored index
	// becomes.
	seen map[string]sourceDigest
	// changed reports whether seen differs from known.
	changed bool
}

// sourceDigest is the recorded identity of one source file.
type sourceDigest struct {
	stamp  string
	sha256 string
	// embed reports whether the file mentions go:embed, so its directives
	// must be read.
	embed bool
}

// loadSourceDigests reads the index for the request directory. A missing or
// damaged index is empty.
func loadSourceDigests(req *CompileRequest) *sourceDigests {
	d := &sourceDigests{
		now:   time.Now(),
		known: make(map[string]sourceDigest),
		seen:  make(map[string]sourceDigest),
	}
	if req == nil || req.CacheRoot == "" {
		return d
	}
	dirDigest := sha256.Sum256([]byte(cleanAbs(req.Dir)))
	d.path = filepath.Join(req.CacheRoot, compilerCacheSchema, "sources", sha256Hex(dirDigest[:])[:32])
	info, err := os.Stat(d.path)
	if err != nil {
		return d
	}
	data, err := os.ReadFile(d.path)
	if err != nil {
		return d
	}
	markCompilerCacheUsed(d.path, info)
	for line := range strings.Lines(string(data)) {
		fields := strings.SplitN(strings.TrimSuffix(line, "\n"), " ", 4)
		if len(fields) != 4 || len(fields[0]) != sha256.Size*2 {
			return d
		}
		d.known[fields[3]] = sourceDigest{
			sha256: fields[0],
			embed:  fields[1] == "e",
			stamp:  fields[2],
		}
	}
	return d
}

// digest returns the content digest of file and whether it mentions go:embed.
func (d *sourceDigests) digest(file string) (string, bool, error) {
	info, err := os.Stat(file)
	if err != nil {
		return "", false, err
	}
	stamp, changedAt, stamped := sourceStamp(info)
	if known, ok := d.known[file]; stamped && ok && known.stamp == stamp {
		d.record(file, known, false)
		return known.sha256, known.embed, nil
	}
	data, err := os.ReadFile(file)
	if err != nil {
		return "", false, err
	}
	digest := sourceDigest{
		stamp:  stamp,
		sha256: sha256Hex(data),
		embed:  bytes.Contains(data, []byte("go:embed")),
	}
	if stamped && d.now.Sub(changedAt) >= sourceStampSettle {
		d.record(file, digest, true)
	}
	return digest.sha256, digest.embed, nil
}

// record adds a digest to the index this compile stores.
func (d *sourceDigests) record(file string, digest sourceDigest, changed bool) {
	d.mu.Lock()
	d.seen[file] = digest
	d.changed = d.changed || changed
	d.mu.Unlock()
}

// store writes the digests this compile used on a best-effort basis, when
// they differ from the index it read.
func (d *sourceDigests) store() {
	if d.path == "" || (!d.changed && len(d.seen) == len(d.known)) {
		return
	}
	var b strings.Builder
	for file, digest := range d.seen {
		embed := "-"
		if digest.embed {
			embed = "e"
		}
		b.WriteString(digest.sha256 + " " + embed + " " + digest.stamp + " " + file + "\n")
	}
	if err := os.MkdirAll(filepath.Dir(d.path), 0o755); err != nil {
		return
	}
	tmp, err := os.CreateTemp(filepath.Dir(d.path), "index-")
	if err != nil {
		return
	}
	_, writeErr := tmp.WriteString(b.String())
	closeErr := tmp.Close()
	if writeErr != nil || closeErr != nil || os.Rename(tmp.Name(), d.path) != nil {
		_ = os.Remove(tmp.Name())
	}
}

// formatSourceStamp names a file's size, modification time, change time and
// inode, and returns the later of its two times.
func formatSourceStamp(info os.FileInfo, changed time.Time, inode uint64) (string, time.Time, bool) {
	stamp := strconv.FormatInt(info.Size(), 10) + "." +
		strconv.FormatInt(info.ModTime().UnixNano(), 10) + "." +
		strconv.FormatInt(changed.UnixNano(), 10) + "." +
		strconv.FormatUint(inode, 10)
	if info.ModTime().After(changed) {
		changed = info.ModTime()
	}
	return stamp, changed, true
}
