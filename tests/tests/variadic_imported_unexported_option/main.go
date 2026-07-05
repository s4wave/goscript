package main

import "github.com/s4wave/goscript/tests/tests/variadic_imported_unexported_option/subpkg"

func main() {
	thing := subpkg.New(subpkg.WithValue(7), subpkg.WithLabel("hi"))
	println(thing.Value)
	println(thing.Label)
}
