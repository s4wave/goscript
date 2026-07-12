package main

import (
	"bytes"
	"crypto/subtle"
)

func panics(f func()) (panicked bool) {
	defer func() {
		panicked = recover() != nil
	}()
	f()
	return false
}

func main() {
	dst := make([]byte, 4)
	n := subtle.XORBytes(dst, []byte{0x0f, 0xf0, 0x55, 0xaa}, []byte{0x33, 0x0f, 0xaa, 0x55})
	println("normal count", n)
	println("normal value", bytes.Equal(dst, []byte{0x3c, 0xff, 0xff, 0xff}))

	unequal := []byte{99, 99, 99, 99}
	n = subtle.XORBytes(unequal, []byte{1, 2, 3, 4}, []byte{4, 6})
	println("unequal count", n)
	println("unequal value", bytes.Equal(unequal, []byte{5, 4, 99, 99}))

	short := []byte{7}
	println("short panics", panics(func() {
		subtle.XORBytes(short, []byte{1, 2}, []byte{3, 4})
	}))
	println("short unchanged", bytes.Equal(short, []byte{7}))

	exact := []byte{1, 2, 3, 4}
	n = subtle.XORBytes(exact, exact, []byte{4, 3, 2, 1})
	println("exact count", n)
	println("exact value", bytes.Equal(exact, []byte{5, 1, 1, 5}))

	inexact := []byte{1, 2, 3, 4}
	println("inexact panics", panics(func() {
		subtle.XORBytes(inexact[1:], inexact[:3], []byte{4, 5, 6})
	}))
	println("inexact unchanged", bytes.Equal(inexact, []byte{1, 2, 3, 4}))
}
