package main

// values covers small numbers, numbers around 2^32 and 2^53, where uint
// values change from numbers to bigints, and the top of the 64-bit range.
var values = []uint{
	0, 1, 7, 31, 32, 1000003,
	1<<32 - 1, 1 << 32, 1<<32 + 5,
	1<<53 - 1, 1 << 53, 1<<53 + 1,
	1<<63 + 12345, 1<<64 - 1,
}

func main() {
	// Each operation is checked on every pair of values.
	for _, a := range values {
		for _, b := range values {
			println(a, b, a+b, a-b, a*b, a&b, a|b, a^b, a&^b)
			if b != 0 {
				println(" ", a/b, a%b)
			}
		}
	}

	// Shifts by constants and variables.
	for _, a := range values {
		for _, s := range []uint{0, 1, 5, 31, 32, 33, 52, 53, 63, 64, 70} {
			println(a, s, a<<s, a>>s, a<<3, a>>3, a<<40, a>>40)
		}
	}

	// Compound assignments and the bit vector arithmetic of regexp's
	// backtracker, with constant operands.
	var visited [8]uint32
	for pc := uint32(0); pc < 5; pc++ {
		for pos := 0; pos < 7; pos++ {
			n := uint(int(pc)*(7+1) + pos)
			visited[n/32] |= 1 << (n & (32 - 1))
		}
	}
	println(visited[0], visited[1])
	u := uint(1<<53 - 3)
	u += 5
	u *= 3
	u -= 1 << 60
	u /= 7
	u %= 1000000007
	u <<= 20
	u >>= 3
	u &= 1<<45 - 1
	u |= 1 << 50
	u ^= 12345
	u &^= 255
	println(u)

	// uintptr shares the representation.
	p := uintptr(1<<40 + 9)
	println(p*p, p/3, p>>7, p&0xff)
}
