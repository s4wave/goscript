package main

// Keep keeps the receiver.
func (b *Base) Keep() {
	b.self = b
	b.n++
}

// Is reports whether the receiver is p.
func (b *Base) Is(p *Base) bool {
	return b == p
}
