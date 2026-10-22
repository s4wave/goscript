package main

import "reflect"

type Blob []byte

type Doc struct {
	Data  []byte
	Named Blob
	Parts [][]byte
}

func main() {
	var d Doc
	dv := reflect.ValueOf(&d).Elem()

	// Set a byte slice field.
	dv.Field(0).SetBytes([]byte("hello"))
	println("Data:", string(d.Data), len(d.Data))

	// Set a field of a named byte slice type.
	dv.Field(1).SetBytes([]byte("named"))
	println("Named:", string(d.Named))

	// Set an element of a slice of byte slices.
	d.Parts = make([][]byte, 2)
	dv.Field(2).Index(1).SetBytes([]byte("part"))
	println("Parts:", len(d.Parts[0]), string(d.Parts[1]))

	// Set a byte slice variable through a pointer.
	var b []byte
	reflect.ValueOf(&b).Elem().SetBytes([]byte("var"))
	println("var:", string(b))

	// The value shares storage with the slice it was set from.
	src := []byte("abc")
	dv.Field(0).SetBytes(src)
	src[0] = 'X'
	println("shared:", string(d.Data))

	// Bytes reads back the value that was set.
	println("Bytes:", string(dv.Field(0).Bytes()))
}
