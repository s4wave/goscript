package main

func main() {
	// Integer slices retain overlapping memmove behavior.
	right := []int{1, 2, 3, 4, 5}
	n := copy(right[2:], right[1:4])
	println("right count:", n)
	println("right:", right[0], right[1], right[2], right[3], right[4])

	left := []int{1, 2, 3, 4, 5}
	n = copy(left[1:], left[2:])
	println("left count:", n)
	println("left:", left[0], left[1], left[2], left[3], left[4])

	// Byte ranges copy in both directions without exposing temporary views.
	bytes := []byte{1, 2, 3, 4, 5}
	start, stop := 1, 4
	n = copy(bytes[start+1:], bytes[start:stop])
	println("byte right:", n, bytes[0], bytes[1], bytes[2], bytes[3], bytes[4])
	n = copy(bytes[:stop-1], bytes[start+1:])
	println("byte left:", n, bytes[0], bytes[1], bytes[2], bytes[3], bytes[4])

	// Explicit high bounds may extend into spare capacity; omitted highs may not.
	backing := []byte{10, 11, 12, 13, 14, 15}
	dst := backing[1:2:5]
	src := []byte{7, 8, 9}
	n = copy(dst[1:4], src[:])
	println("capacity:", n, backing[0], backing[1], backing[2], backing[3], backing[4], backing[5])
	n = copy(dst[:], src[:])
	println("length:", n, backing[1], backing[2])

	// Bounds with calls preserve their observable evaluation sequence.
	n = copy(dst[bound(0):], src[bound(1):])
	println("effect count:", n)

	// Nil ranges still validate the other operand before returning zero.
	var empty []byte
	println("nil:", copy(empty[:], src[:]))
	checkInvalidSource(empty, src)
}

// bound prints each bound evaluation and returns its value.
func bound(value int) int {
	println("bound:", value)
	return value
}

// checkInvalidSource verifies a source bounds panic even for an empty destination.
func checkInvalidSource(dst, src []byte) {
	defer func() { println("invalid source:", recover() != nil) }()
	high := len(src) + 1
	copy(dst[:], src[:high])
}
