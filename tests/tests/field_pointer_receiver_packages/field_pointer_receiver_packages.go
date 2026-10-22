package main

import "github.com/s4wave/goscript/tests/tests/field_pointer_receiver_packages/inner"

// Outer embeds a struct of another package and holds a Widget.
type Outer struct {
	inner.Mid
	Local Widget
}

func main() {
	// Methods of a type whose methods are declared in another file.
	var w Widget
	w.Keep()
	w.Base.Keep()
	println("other file:", w.self == &w.Base, w.Is(&w.Base), w.n)

	// Methods promoted from structs of another package, exported and not.
	var o Outer
	o.Keep()
	o.Mid.Base.Keep()
	println("other package:", o.Self == &o.Mid.Base, o.N)
	println("unexported:", o.KeepHidden(), o.HiddenKept())

	// A field that embeds a struct of this package.
	o.Local.Keep()
	keep := o.Local.Keep
	keep()
	println("field:", o.Local.self == &o.Local.Base, o.Local.Is(&o.Local.Base), o.Local.n)
}
