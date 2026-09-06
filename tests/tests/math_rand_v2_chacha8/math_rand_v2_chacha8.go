package main

import (
	"math/rand/v2"
)

func main() {
	var seed [32]byte
	for i := range seed {
		seed[i] = byte(i + 1)
	}
	r := rand.NewChaCha8(seed)
	for i := 0; i < 8; i++ {
		println(r.Uint64())
	}
	for i := 0; i < 124; i++ {
		r.Uint64()
	}
	for i := 0; i < 8; i++ {
		println(r.Uint64())
	}
	b, err := r.MarshalBinary()
	if err != nil {
		panic(err)
	}
	println(len(b))
	for _, v := range b {
		println(v)
	}
	r2 := rand.NewChaCha8(seed)
	if err := r2.UnmarshalBinary(b); err != nil {
		panic(err)
	}
	for i := 0; i < 8; i++ {
		println(r2.Uint64())
	}
	seed2 := seed
	seed2[0] = 0xff
	r.Seed(seed2)
	println(r.Uint64())
}
