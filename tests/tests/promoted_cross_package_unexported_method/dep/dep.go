package dep

// Block is implemented only by types that embed Base, through its
// unexported block method.
type Block interface {
	block() string
	Name() string
}

// Base implements Block.
type Base struct {
	name string
}

// block is async: it receives its result from a goroutine.
func (b *Base) block() string {
	ch := make(chan string)
	go func() { ch <- "block " + b.name }()
	return <-ch
}

// Name returns the name of the block.
func (b *Base) Name() string { return b.name }

// SetName sets the name of the block.
func (b *Base) SetName(name string) { b.name = name }

// Describe asserts v to Block and calls its unexported method.
func Describe(v any) string {
	b, ok := v.(Block)
	if !ok {
		return "not a block"
	}
	return b.block()
}
