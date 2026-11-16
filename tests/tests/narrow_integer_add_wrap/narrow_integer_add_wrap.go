package main

type fixed int32

func main() {
	var u uint32 = 0xffffffff
	var z uint32
	println(u+1, u+u, z-1)
	var q int32 = 2147483647
	q++
	println(q)
	q--
	println(q, q+q)
	var a, b fixed = 40000 * 64, 30000 * 64
	println(a*a/64+b*b/64, a+b+2147483647)
	var i8 int8 = 127
	i8++
	println(i8, int8(-128)-i8)
	var u16 uint16 = 65535
	u16++
	one := uint16(1)
	println(u16, one<<15<<1)
	var u8 uint8 = 200
	println(u8+100, u8<<1)

	// Products, negations, quotients and uint32 bitwise results wrap before
	// an outer operation reads them.
	var s8, m8 int8 = 127, -128
	var neg int8 = -1
	var m32 int32 = -2147483648
	var w uint32 = 0xf0f0f0f0
	println((s8*s8)/2, (u8*u8)/2, (-m32)/2, -m8, m8/neg)
	println((w|1)/2, (w^1)/2, (w&w)/2, (w&^1)/2, (w|1) > 5)
}
