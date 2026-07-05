package main

func main() {
	dAtA := []byte{10, 20, 30, 40, 50}

	// Protobuf idiom: append a sub-slice onto a truncated nil []byte. The
	// result must stay byte-specialized regardless of the nil destination.
	var dst []byte
	dst = append(dst[:0], dAtA[1:4]...)
	println("spread nil:", dst)
	println("spread len:", len(dst))

	// Individual-element append onto a nil []byte stays byte-specialized.
	var single []byte
	single = append(single, 65, 66, 67)
	println("single nil:", single)

	// Reusing a pre-made byte buffer with [:0] keeps specialization across
	// reallocation past its capacity.
	buf := make([]byte, 0, 2)
	buf = append(buf[:0], dAtA...)
	println("reused:", buf)

	// Appending a string onto a nil []byte also stays byte-specialized.
	var text []byte
	text = append(text, "Hi"...)
	println("string nil:", text)
}
