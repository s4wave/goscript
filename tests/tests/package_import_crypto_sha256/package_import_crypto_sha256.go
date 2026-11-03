package main

import (
	"bytes"
	"crypto/sha256"
	"crypto/sha512"
	"hash"
)

func main() {
	// The one-shot SHA-256 digest has its standard size and byte encoding.
	sum := sha256.Sum256([]byte("abc"))
	println("sum len", len(sum))
	println("sum first", sum[0])
	println("sum last", sum[31])

	// Incremental writes preserve their order and report the consumed length.
	var h hash.Hash = sha256.New()
	n, err := h.Write([]byte("a"))
	println("write a", n, err == nil)
	n, err = h.Write([]byte("bc"))
	println("write bc", n, err == nil)

	// Sum appends its digest after the supplied prefix.
	stream := h.Sum([]byte{1, 2})
	println("stream len", len(stream))
	println("stream prefix", stream[0], stream[1])
	println("stream digest", stream[2], stream[33])

	// Sum uses the caller's spare slice capacity.
	backing := make([]byte, sha256.Size)
	backed := h.Sum(backing[:0])
	println("backed len", len(backed), len(backing))
	println("backed digest", backing[0], backing[31], backed[0], backed[31])

	// Every SHA-2 constructor preserves independent incremental state.
	checkClone("sha224", sha256.New224)
	checkClone("sha256", sha256.New)
	checkClone("sha384", sha512.New384)
	checkClone("sha512", sha512.New)
	checkClone("sha512/224", sha512.New512_224)
	checkClone("sha512/256", sha512.New512_256)
}

// checkClone reaches Cloner through hash.Hash, as TLS's transcript does.
func checkClone(name string, makeHash func() hash.Hash) {
	// A prefix spans full compression blocks and a partial final block.
	prefix := make([]byte, 257)
	for i := range prefix {
		prefix[i] = byte(i)
	}
	h := makeHash()
	h.Write(prefix)
	h.Sum(nil)

	// Cloning after Sum preserves the prefix without finalizing either state.
	cloner, ok := h.(hash.Cloner)
	println(name, "cloner", ok)
	if !ok {
		return
	}
	branch, err := cloner.Clone()
	println(name, "clone err nil", err == nil)

	// Each branch accepts a different suffix and still matches a fresh digest.
	h.Write([]byte("left"))
	branch.Write([]byte("right"))

	// Fresh runs independently verify each branch's full digest.
	left := makeHash()
	left.Write(prefix)
	left.Write([]byte("left"))
	right := makeHash()
	right.Write(prefix)
	right.Write([]byte("right"))
	println(name, "fork", bytes.Equal(h.Sum(nil), left.Sum(nil)), bytes.Equal(branch.Sum(nil), right.Sum(nil)))

	// Reset affects only the selected branch, including after its Sum.
	h.Reset()
	empty := makeHash().Sum(nil)
	println(name, "reset", bytes.Equal(h.Sum(nil), empty), bytes.Equal(branch.Sum(nil), right.Sum(nil)))
	branch.Reset()
	h.Write([]byte("new"))
	println(name, "branch reset", bytes.Equal(branch.Sum(nil), empty), !bytes.Equal(h.Sum(nil), empty))
}
