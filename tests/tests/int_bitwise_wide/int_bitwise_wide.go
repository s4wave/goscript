package main

// wide returns 1<<40 at run time, so no operation below is constant folded.
func wide() int {
	return 1 << 40
}

func main() {
	// Binary bitwise operators keep the bits above 32 of an int.
	y := wide()
	m := y | 0xff
	println(y^3, y&m, y|5, y&^1, m&^0xf0, ^y)
	println(-y&0xffff_ffff_ffff, -y|1, -y^-1, (-y)&^y)

	// Shifts move bits across bit 32.
	n := 3
	println(y<<n, y>>n, (-y)>>n, 1<<35, m<<12>>n, m>>40)
	println(y<<12, (-y)<<12, (-y)>>45, y>>41)

	// Compound assignments keep the bits above 32 as well.
	a := y
	a ^= 3
	b := y
	b &= m
	c := y
	c |= 5
	d := m
	d &^= 0xf
	e := y
	e <<= n
	f := -y
	f >>= n
	println(a, b, c, d, e, f)

	// Values that fit 32 bits behave as before.
	s, t := 0x7fff_ffff, -0x8000_0000
	println(s|t, s&t, s^t, s&^t, ^s, s<<1, t>>31, t<<1)

	// Bitwise results up to the edge of the safe integer range.
	big := 1<<53 - 1
	println(big&-2, big^0x5555, big|1<<52, -big-1, (big+1)&big)

	// Negative ints keep two's complement bits.
	neg := -wide() - 7
	println(neg&0xff, neg|0xf, neg^0xff, neg>>1, ^neg, neg&^0x7)
}
