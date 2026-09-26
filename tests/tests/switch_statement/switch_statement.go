package main

func main() {
	i := 2
	println("Integer switch:")
	switch i {
	case 1:
		println("one")
	case 2:
		println("two")
	case 3:
		println("three")
	default:
		println("other integer")
	}

	s := "hello"
	println("\nString switch:")
	switch s {
	case "world":
		println("world")
	case "hello":
		println("hello")
	default:
		println("other string")
	}
	x := -5
	println("\nSwitch without expression:")
	switch {
	case x < 0:
		println("negative")
	case x == 0:
		println("zero")
	default: // x > 0
		println("positive")
	}

	x = 0
	println("\nSwitch without expression (zero):")
	switch {
	case x < 0:
		println("negative")
	case x == 0:
		println("zero")
	default: // x > 0
		println("positive")
	}

	x = 10
	println("\nSwitch without expression (positive):")
	switch {
	case x < 0:
		println("negative")
	case x == 0:
		println("zero")
	default: // x > 0
		println("positive")
	}

	// Conditions set only inside a callback are still runtime values.
	var data []byte
	rejected := false
	hold(func() {
		data = []byte("x")
		rejected = true
	})
	println("\nSwitch on conditions set in a callback:")
	switch {
	case data == nil && rejected:
		println("rejected")
	case data == nil:
		println("missing")
	default:
		println("found")
	}
}

func hold(fn func()) {
	fn()
}
