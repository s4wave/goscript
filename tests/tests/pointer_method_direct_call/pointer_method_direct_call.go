package main

type counter struct {
	n int
}

func (c *counter) add(i int) int {
	if c == nil {
		return -1
	}
	c.n += i
	return c.n
}

func (c *counter) get() int { return c.n }

// value reads a copied receiver, so capturing it through nil must panic.
func (c counter) value() int { return c.n }

type adder interface{ add(i int) int }

// holder promotes the pointer methods of its possibly nil embedded counter.
type holder struct{ *counter }

func next(c *counter) *counter {
	if c.n > 2 {
		return nil
	}
	return c
}

// captureNilValue distinguishes capture-time dereference from invocation.
func captureNilValue() {
	// Observe whether receiver evaluation completed before the panic.
	captured := false
	defer func() { println("nil value capture:", captured, recover() != nil) }()
	var c *counter
	fn := c.value
	captured = true
	_ = fn()
}

// captureNilOuter must evaluate the promoted field before binding its method.
func captureNilOuter() {
	// A nil outer pointer cannot supply its embedded receiver.
	captured := false
	defer func() { println("nil outer capture:", captured, recover() != nil) }()
	var outer *holder
	fn := outer.add
	captured = true
	_ = fn(1)
}

func main() {
	// A pointer method is called directly on a plain struct pointer.
	c := &counter{}
	for i := range 4 {
		c.add(i)
	}
	println(c.get())

	// A nil receiver still reaches the method.
	var nilc *counter
	println(nilc.add(5))

	// The arguments are evaluated once, whichever way the method is called.
	calls := 0
	arg := func() int { calls++; return 2 }
	println(c.add(arg()), nilc.add(arg()), calls)

	// A bound pointer method retains nil without dereferencing or re-evaluation.
	nilCalls := 0
	makeNil := func() *counter { nilCalls++; return nil }
	nilFn := makeNil().add
	println("nil pointer capture:", nilCalls, nilFn(4))

	// Reassigning the source pointer does not change the captured receiver.
	bound := &counter{n: 10}
	fn := bound.add
	bound = &counter{n: 30}
	println("bound pointer:", fn(2), bound.n)

	// Method expressions use the same nil-capable pointer dispatch.
	println("nil pointer expression:", (*counter).add(nil, 4))
	captureNilValue()

	// The final embedded pointer may be nil, while its outer value is valid.
	outer := holder{}
	promoted := outer.add
	println("nil inner capture:", promoted(3))
	println("nil inner expression:", (holder).add(outer, 3))
	captureNilOuter()

	// A value method captures a copy rather than the subsequently changed value.
	valueSource := counter{n: 5}
	copyFn := valueSource.value
	valueSource.n = 9
	println("value copy:", copyFn(), valueSource.n)

	// A pointer to a struct variable that a closure reassigns.
	var v counter
	pv := &v
	reset := func() { v = counter{n: 100} }
	pv.add(1)
	reset()
	println(pv.add(1), v.n)

	// Interface calls on a struct pointer, and on a nil interface, which panics.
	var a adder = c
	println(a.add(10))
	a = next(c)
	defer func() {
		println("recovered:", recover() != nil)
	}()
	var none adder
	println(none.add(1))
}
