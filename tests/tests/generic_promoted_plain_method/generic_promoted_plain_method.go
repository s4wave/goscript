package main

// Meta is a plain struct whose methods a generic struct promotes.
type Meta struct{ name string }

// Name returns p followed by the name.
func (m *Meta) Name(p string) string { return p + m.name }

// Inner is a generic struct embedded with a fixed type argument.
type Inner[T any] struct{ v T }

// Label returns p followed by the kind of value.
func (in *Inner[T]) Label(p string) string { return p + "inner" }

// Outer is a generic struct embedding both.
type Outer[T any] struct {
	Meta
	*Inner[int]
	v T
}

// Get returns the value.
func (o *Outer[T]) Get() T { return o.v }

type namer interface{ Name(p string) string }

type labeler interface{ Label(p string) string }

// both calls the promoted methods through a constraint.
func both[P interface {
	namer
	labeler
}](p P) string {
	return p.Name("c:") + " " + p.Label("c:")
}

func main() {
	o := &Outer[float64]{Meta{"a"}, &Inner[int]{1}, 2.5}

	// Direct calls.
	println(o.Name("d:"), o.Label("d:"))

	// Calls through interfaces of the promoted methods, which take their
	// own arguments and no type arguments.
	var n namer = o
	var l labeler = o
	println(n.Name("i:"), l.Label("i:"))
	var x any = o
	println(x.(namer).Name("a:"), x.(labeler).Label("a:"))

	// Calls through a type parameter's constraint.
	println(both(o))
}
