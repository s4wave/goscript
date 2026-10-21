package main

// Pins shifts of integers of 32 bits or fewer by variable counts of 32 or
// more, which Go shifts out completely (or fills with the sign bit, for a
// right shift of a negative signed value), while the JavaScript shift
// operators take the count modulo 32. go-text's fontscan builds its rune
// coverage masks with uint32(1)<<(end-start+1)-1, a count of 32 for a full
// word, which must be all ones.
func mask(start, end byte) uint32 {
	return (uint32(1)<<(end-start+1) - 1) << start
}

func count() uint {
	return 33
}

func main() {
	println("mask 0..31", mask(0, 31))
	println("mask 4..31", mask(4, 31))
	println("mask 0..3", mask(0, 3))

	var n uint = 32
	var u32 uint32 = 1
	var i32 int32 = 1
	var neg int32 = -8
	var u16 uint16 = 1
	var i8 int8 = -1
	var u8 uint8 = 1
	println("uint32 << 32", u32<<n, "int32 << 32", i32<<n, "uint16 << 32", u16<<n, "uint8 << 32", u8<<n)
	println("int32 >> 32", i32>>n, "negative int32 >> 32", neg>>n, "int8 >> 32", i8>>n)
	println("uint32 << 31", u32<<(n-1), "int32 << 31", i32<<(n-1))
	println("uint32 << call", u32<<count(), "int32 >> call", neg>>count())

	// Compound assignments shift the same way.
	a, b, c, d := u32, i32, neg, u16
	a <<= n
	b <<= n
	c >>= n
	d <<= n
	println("assign", a, b, c, d)
	e, f := u32, neg
	e <<= count()
	f >>= count()
	println("assign call", e, f)
	println("bit", bit(' '), bit('a'), bit(0x3f))
}

// bit returns the bit of r in a word, whose masked count needs no guard.
func bit(r rune) uint32 {
	return 1 << (r & 0x1f)
}
