package main

// zero initializes a sibling struct without an explicit initializer.
func zero() Foo {
	var value Foo
	return value
}
