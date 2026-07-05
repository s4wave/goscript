package subpkg

// option configures a Thing. It is unexported to mirror the functional-option
// pattern where only the With* constructors are exported, matching real Go
// packages such as restic/chunker.
type option func(*Thing)

// Thing is built through variadic options.
type Thing struct {
	Value int
	Label string
}

// WithValue sets Thing.Value.
func WithValue(v int) option {
	return func(t *Thing) { t.Value = v }
}

// WithLabel sets Thing.Label.
func WithLabel(l string) option {
	return func(t *Thing) { t.Label = l }
}

// New builds a Thing from options. The variadic element type option is
// unexported in this package, so a cross-package caller must still be able to
// spell it when packing the variadic arguments.
func New(opts ...option) *Thing {
	t := &Thing{}
	for _, opt := range opts {
		opt(t)
	}
	return t
}
