package main

import "unsafe"

type sourceStruct struct {
	flag bool
	data []uint
}

type viewStruct struct {
	flag bool
	data []uint
}

func noescape(p unsafe.Pointer) unsafe.Pointer {
	x := uintptr(p)
	return unsafe.Pointer(x ^ 0)
}

func inlineSlice(values []uint) []uint {
	return (*[2]uint)(noescape(unsafe.Pointer(&values[0])))[:]
}

func markThroughView(src *sourceStruct) bool {
	(*viewStruct)(unsafe.Pointer(src)).flag = true
	return (*viewStruct)(unsafe.Pointer(src)).flag
}

func main() {
	// An identity round-trip preserves the indexed pointer token.
	values := []uint{1, 2}
	p := unsafe.Pointer(&values[1])
	q := noescape(p)
	println("same:", q == p)
	println("nil:", q == nil)

	// The array pointer keeps the original numeric backing and aliases.
	inline := inlineSlice(values)
	println("inline:", inline[0], inline[1])
	inline[0] = 9
	println("updated:", values[0])

	// Target-sized words retain their number representation over byte storage.
	var bytes [2 * unsafe.Sizeof(uint(0))]byte
	words := (*[2]uint)(unsafe.Pointer(&bytes[0]))
	words[0] = 7
	bytes[unsafe.Sizeof(uint(0))] = 9
	println("byte words:", words[0], words[1], bytes[0])

	// Signed words preserve their two's-complement bytes and number value.
	signed := (*int)(unsafe.Pointer(&bytes[0]))
	*signed = -3
	println("signed word:", *signed, bytes[0])

	// Address-sized values share the unsigned word's original storage.
	address := (*uintptr)(unsafe.Pointer(&bytes[unsafe.Sizeof(uint(0))]))
	*address = 10
	println("address word:", *address, words[1])

	// Ordinary reference-bearing struct casts keep their existing identity.
	var src sourceStruct
	println("struct:", markThroughView(&src), src.flag)
}
