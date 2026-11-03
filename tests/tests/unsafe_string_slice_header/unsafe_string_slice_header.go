package main

import (
	"reflect"
	"unsafe"
)

type localSliceHeader struct {
	s   string
	cap int
}

// stringBytes views a standard string header through the slice header contract.
func stringBytes(s string) (b []byte) {
	// Copy the string's data and length into the empty slice header.
	strh := (*reflect.StringHeader)(unsafe.Pointer(&s))
	sh := (*reflect.SliceHeader)(unsafe.Pointer(&b))
	sh.Data = strh.Data
	sh.Len = strh.Len
	sh.Cap = strh.Len
	return b
}

func localStringBytes(s string) []byte {
	return *(*[]byte)(unsafe.Pointer(&localSliceHeader{s, len(s)}))
}

// arrayStringBytes slices an intentionally oversized array pointer to real data.
func arrayStringBytes(s string) []byte {
	return (*[0x7fff0000]byte)(unsafe.Pointer((*reflect.StringHeader)(unsafe.Pointer(&s)).Data))[:len(s):len(s)]
}

// arrayStringBounds preserves the declared array bound when it is smaller.
func arrayStringBounds(s string) {
	defer func() { println("array bounds:", recover() != nil) }()
	_ = (*[2]byte)(unsafe.Pointer((*reflect.StringHeader)(unsafe.Pointer(&s)).Data))[:len(s):len(s)]
}

func samePointers(s *string, b *[]byte) (*string, *[]byte) {
	return (*string)(s), (*[]byte)(b)
}

func main() {
	// Read byte views produced from both standard and local string headers.
	b := stringBytes("abc")
	println(len(b), cap(b), b[0], b[1], b[2])
	local := localStringBytes("wxyz")
	println(len(local), cap(local), local[0], local[3])

	// Identity casts retain the original string and slice pointer storage.
	str, bytes := "pointer", []byte("go")
	sp, bp := samePointers(&str, &bytes)
	println(*sp, len(*bp))

	// The large array declaration does not enlarge the actual string slice.
	array := arrayStringBytes("array")
	println("array:", len(array), cap(array), array[0], array[4])
	arrayStringBounds("array")
}
