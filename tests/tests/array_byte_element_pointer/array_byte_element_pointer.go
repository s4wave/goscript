package main

type bitset struct {
	bits [4]byte
}

func (b *bitset) set(bit uint32) {
	entry := &b.bits[bit/8]
	mask := byte(1) << (bit % 8)
	*entry |= mask
}

func (b *bitset) has(bit uint32) bool {
	entry := &b.bits[bit/8]
	mask := byte(1) << (bit % 8)
	return *entry&mask != 0
}

func main() {
	var b bitset
	b.set(3)
	b.set(30)
	println(b.has(3), b.has(4), b.has(30), b.bits[0], b.bits[3])
}
