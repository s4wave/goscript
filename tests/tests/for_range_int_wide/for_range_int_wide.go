package main

// high places v in the high bits.
func high(v uint64) uint64 {
	return v << 40
}

func main() {
	// A 64-bit count gives a 64-bit counter.
	var wide uint64
	for i := range uint64(4) {
		wide += high(i)
	}
	println("uint64 range sum:", wide)

	var signed int64
	for i := range int64(3) {
		signed -= int64(high(uint64(i)))
	}
	println("int64 range sum:", signed)

	// A narrower count keeps an int counter.
	n := 0
	for i := range uint8(3) {
		n += int(i)
	}
	println("uint8 range sum:", n)

	// The count is evaluated once.
	calls := 0
	count := func() uint64 {
		calls++
		return 3
	}
	for range count() {
	}
	println("count calls:", calls)

	m := 2
	for i := range m {
		m++
		println("iteration:", i, m)
	}
}
