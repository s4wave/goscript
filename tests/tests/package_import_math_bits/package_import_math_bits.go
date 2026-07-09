package main

import "math/bits"

func main() {
	println("UintSize", bits.UintSize)
	println("Len-all", bits.Len(^uint(0)))
	println("LeadingZeros-uint-one", bits.LeadingZeros(uint(1)))
	lo, carry := bits.Add(^uint(0), 1, 0)
	println("Add-carry", lo == 0, carry)

	const (
		bit31      uint64 = 1 << 31
		low32      uint64 = uint64(1)<<32 - 1
		low63      uint64 = uint64(1)<<63 - 1
		highBit    uint64 = 1 << 63
		highNibble uint64 = 0xf000000000000000
		all64      uint64 = ^uint64(0)
	)
	const all32 uint32 = ^uint32(0)

	println("LeadingZeros64", bits.LeadingZeros64(0), bits.LeadingZeros64(1), bits.LeadingZeros64(bit31), bits.LeadingZeros64(low32), bits.LeadingZeros64(low63), bits.LeadingZeros64(highBit), bits.LeadingZeros64(highNibble), bits.LeadingZeros64(all64))
	println("TrailingZeros64", bits.TrailingZeros64(0), bits.TrailingZeros64(1), bits.TrailingZeros64(bit31), bits.TrailingZeros64(low32), bits.TrailingZeros64(low63), bits.TrailingZeros64(highBit), bits.TrailingZeros64(highNibble), bits.TrailingZeros64(all64))
	println("OnesCount64", bits.OnesCount64(0), bits.OnesCount64(1), bits.OnesCount64(bit31), bits.OnesCount64(low32), bits.OnesCount64(low63), bits.OnesCount64(highBit), bits.OnesCount64(highNibble), bits.OnesCount64(all64))

	hi, lo32 := bits.Mul32(0, all32)
	println("Mul32-zero", hi, lo32)
	hi, lo32 = bits.Mul32(1, all32)
	println("Mul32-one-all", hi, lo32)
	hi, lo32 = bits.Mul32(1<<31, 2)
	println("Mul32-bit31-double", hi, lo32)
	hi, lo32 = bits.Mul32(all32, all32)
	println("Mul32-all-all", hi, lo32)
	hi, lo32 = bits.Mul32(1<<31, 1<<31)
	println("Mul32-high-high", hi, lo32)
}
