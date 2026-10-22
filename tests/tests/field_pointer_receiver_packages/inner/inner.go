// Package inner has structs whose pointer methods keep their receivers.
package inner

// Base keeps its receiver.
type Base struct {
	Self *Base
	N    int
}

// Keep keeps the receiver.
func (b *Base) Keep() {
	b.Self = b
	b.N++
}

// base is unexported, with an exported method that keeps its receiver.
type base struct {
	self *base
}

// KeepHidden keeps the receiver.
func (b *base) KeepHidden() bool {
	b.self = b
	return b.self == b
}

// Mid embeds both.
type Mid struct {
	Base
	base
}

// HiddenKept reports whether the embedded base kept its own address.
func (m *Mid) HiddenKept() bool {
	return m.base.self == &m.base
}
