package main

import "unsafe"

var table = [4]byte{1, 2, 3, 4}

// entry has padding, a nested array, and scalar kinds with distinct encodings.
type entry struct {
	// tag leaves padding before the fixed-width fields.
	tag uint8
	// delta checks signed integer encoding.
	delta int16
	// __proto__ uses the compiler's escaped struct storage key.
	__proto__ uint16
	// words checks nested fixed-width array storage.
	words [2]uint64
	// weight checks the floating-point representation.
	weight float32
	// live checks one-byte boolean storage.
	live bool
}

// wordsAlias has the same underlying array layout as entry.words.
type wordsAlias [2]uint64

func acceptMatrix(*[2][2]byte) {
}

func main() {
	// Preserve the address of a byte array through an erased pointer.
	ptr := unsafe.Pointer(&table)
	bytes := (*[4]byte)(ptr)
	println((*bytes)[2])

	// View the same bytes as a nested array.
	ptr = unsafe.Pointer(&table)
	acceptMatrix((*[2][2]byte)(ptr))

	// An erased byte pointer exposes the target's padded layout and strides.
	const stride = unsafe.Sizeof(entry{})
	var storage [2 * stride]byte
	erased := unsafe.Pointer(&storage)
	entries := (*[2]entry)(erased)

	// Store each numeric kind through the shared fields.
	entries[1].tag = 9
	entries[1].delta = -2
	entries[1].__proto__ = 0x1234
	entries[1].words[1] = 0x1122334455667788
	entries[1].weight = 1.5
	entries[1].live = true

	// Check the byte order, padding and root pointer identity.
	const words = unsafe.Offsetof(entry{}.words)
	const weight = unsafe.Offsetof(entry{}.weight)
	println("layout", storage[stride], storage[stride+words+8], storage[stride+words+15], storage[stride+weight+2], storage[stride+weight+3])
	println("values", entries[1].words[1] == 0x1122334455667788, entries[1].weight == 1.5, entries[1].live)

	// Read signed and escaped fields through the same padded storage.
	const delta = unsafe.Offsetof(entry{}.delta)
	println("signed", storage[stride+delta], storage[stride+delta+1], entries[1].delta)
	const escaped = unsafe.Offsetof(entry{}.__proto__)
	println("field", storage[stride+escaped], entries[1].__proto__)

	// The original pointer retains the root's byte address.
	println("roots", unsafe.Pointer(entries) == erased)

	// Aliased subviews share writes and addresses; copying a value stays separate.
	second := (*entry)(unsafe.Pointer(&storage[stride]))
	nested := (*entry)(unsafe.Pointer(&entries[1]))
	storage[stride] = 11
	println("alias", second.tag, nested.tag, unsafe.Pointer(&entries[1]) == unsafe.Pointer(second), unsafe.Pointer(&entries[1].words[1]) == unsafe.Pointer(&storage[stride+words+8]))
	copy := entries[1]
	copy.words[1] = 7
	println("copy", entries[1].words[1] == 0x1122334455667788, copy.words[1])

	// Ordinary pointer casts between named arrays keep their field reference.
	wordsView := (*wordsAlias)(&entries[1].words)
	println("named array", wordsView[1] == entries[1].words[1])

	// Scalar pointers reload their bytes after writes through either alias.
	scalar := (*uint64)(unsafe.Pointer(&storage[stride+words+8]))
	println("scalar", *scalar == entries[1].words[1])
	*scalar = 0x1122334455667799
	storage[stride+words+8] = 0xaa
	println("scalar write", *scalar == 0x11223344556677aa, entries[1].words[1] == *scalar)

	// Recasts of scalar and field references retain the same byte origin.
	unsigned := (*uint16)(unsafe.Pointer(&entries[1].delta))
	println("field cast", *unsigned == 65534)
	*unsigned = 65533
	println("field write", entries[1].delta == -3)
	fieldBytes := (*[2]byte)(unsafe.Pointer(&entries[1].delta))
	fieldBytes[0] = 0xfc
	println("direct field bytes", entries[1].delta == -4, fieldBytes[1] == 0xff)
	back := (*[8]byte)(unsafe.Pointer(scalar))
	back[0] = 0xbb
	println("cast back", *scalar == 0x11223344556677bb, entries[1].words[1] == *scalar)

	// A nonzero byte-slice window retains its backing capacity past its length.
	window := storage[1 : stride+1]
	windowEntry := (*entry)(unsafe.Pointer(&window[stride-1]))
	println("window", windowEntry.tag == entries[1].tag, len(window) == int(stride), cap(window) == len(storage)-1)
	windowEntry.tag = 12
	byteView := (*[3]byte)(unsafe.Pointer(&window[stride-1]))
	byteView[0] = 13
	println("window write", entries[1].tag, byteView[0])
}
