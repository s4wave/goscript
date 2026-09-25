package main

type entry struct {
	key []byte
	n   int
}

type tree[T any] struct {
	less  func(a, b T) bool
	empty T
	count int
}

func newTree[T any](less func(a, b T) bool) *tree[T] {
	tr := new(tree[T])
	tr.less = less
	return tr
}

func literalTree[T any]() tree[T] {
	return tree[T]{count: 1}
}

func varTree[T any]() tree[T] {
	var tr tree[T]
	return tr
}

func zero[T any]() T {
	var z T
	return z
}

func (tr *tree[T]) get() T {
	return tr.empty
}

func lessEntry(a, b entry) bool {
	return a.n < b.n
}

func main() {
	// Inferred from a function-typed argument.
	tr := newTree(lessEntry)
	e := tr.get()
	println("new", e.key == nil, e.n)
	println("less", tr.less(entry{n: 1}, entry{n: 2}))

	// Zero values of type-parameter fields in generic constructors.
	lit := literalTree[entry]()
	println("literal", lit.empty.key == nil, lit.empty.n, lit.count)
	v := varTree[entry]()
	println("var", v.empty.key == nil, v.empty.n)
	z := zero[entry]()
	println("zero", z.key == nil, z.n)
	ints := newTree(func(a, b int) bool { return a < b })
	println("int", ints.get())
}
