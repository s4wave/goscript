package main

// main checks field reads and synthesized constructors across sibling files.
func main() {
	// Read both present and absent map entries.
	println(ReadValue("foo"))
	missing, found := lookup(map[string]Foo{}, "missing")
	println("missing:", missing.Value == "", found)
	present, found := lookup(map[string]Foo{"present": {Value: "value"}}, "present")
	println("present:", present.Value, found)

	// Exercise each constructor in a file whose only sibling reference is Foo.
	println("constructors:", zero().Value == "", literal().Value, allocate().Value == "")
	println("zeros:", result().Value == "", array()[1].Value == "")
}
