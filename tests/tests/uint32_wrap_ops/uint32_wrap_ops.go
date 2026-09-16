package main

func checksum(c uint32) uint32 {
	return c + 2
}

func main() {
	var c uint32 = 4294967295
	v := checksum(c)
	println(v == 1)
	println(byte(v) == 1)
	var high uint32 = 0x80000000
	println(high>>31 == 1)
	high >>= 1
	println(high == 0x40000000)
	println(^uint16(0) == 0xffff)
	println(high>>32 == 0)
	var count int
	for mask := byte(8); mask <= 24; mask, count = mask-8, count+1 {
		println(mask)
	}
	println(count)

	// Compound assignment must wrap like plain assignment on narrow integers.
	var sum uint32 = 4294967294
	sum += 7
	println(sum)
	sum -= 9
	println(sum)
	var prod uint32 = 0x10000
	prod *= 0x10000
	println(prod == 0)
	var shifted uint32 = 0x40000000
	shifted <<= 1
	println(shifted == 0x80000000)
	shifted <<= 1
	println(shifted)
	var small uint16 = 65535
	small += 2
	println(small)
	small -= 4
	println(small)
	var half uint16 = 0x8000
	half <<= 1
	println(half == 0)
	var down int8 = -128
	down -= 1
	println(down == 127)
}
