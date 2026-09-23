package main

import (
	"hash"
	"hash/maphash"
)

var stripeSeed = maphash.MakeSeed()

func stripe(key string) uint64 {
	return maphash.String(stripeSeed, key) % 4096
}

func main() {
	seed := maphash.MakeSeed()
	whole := maphash.String(seed, "hello world")
	println(maphash.Bytes(seed, []byte("hello world")) == whole)

	var h maphash.Hash
	h.SetSeed(seed)
	h.WriteString("hello")
	h.WriteByte(' ')
	h.Write([]byte("world"))
	println(h.Sum64() == whole)

	var hh hash.Hash64 = &h
	println(hh.Size(), hh.BlockSize(), len(hh.Sum(nil)))

	h.Reset()
	println(h.Sum64() == maphash.String(seed, ""))
	println(maphash.String(seed, "a") != maphash.String(seed, "b"))
	println(maphash.Comparable(seed, 42) == maphash.Comparable(seed, 42))

	var zero maphash.Hash
	zero.WriteString("abc")
	println(zero.Sum64() == maphash.String(zero.Seed(), "abc"))

	println(stripe("block") == stripe("block"), stripe("block") < 4096)
}
