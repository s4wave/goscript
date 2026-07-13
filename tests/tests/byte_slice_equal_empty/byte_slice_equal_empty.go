package main

import "bytes"

func main() {
	var nilBytes []byte
	backing := []byte{1}
	emptyView := backing[:0]
	otherBacking := []byte{2}
	otherEmptyView := otherBacking[:0]

	println("nil and view:", bytes.Equal(nilBytes, emptyView))
	println("views:", bytes.Equal(emptyView, otherEmptyView))
	println("strings:", string(nilBytes) == string(emptyView))
}
