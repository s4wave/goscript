package main

type label string

func main() {
	var w any = "test"
	println("value is", w.(string))

	// A failed assertion gives the zero value of the type, also for nil.
	var n any
	s, ok := n.(string)
	println("nil string:", len(s), s == "", ok)
	var i any = 3
	s, ok = i.(string)
	println("int string:", len(s), s == "", ok)
	m := map[string]any{}
	t, ok := m["missing"].(string)
	println("missing string:", len(t), t+"x", ok)
	l, ok := n.(label)
	println("nil label:", len(l), l == "", ok)
	f, ok := n.(float64)
	println("nil float64:", f == 0, ok)
	k, ok := n.(int)
	println("nil int:", k+1, ok)
	b, ok := n.(bool)
	println("nil bool:", b, ok)
}
