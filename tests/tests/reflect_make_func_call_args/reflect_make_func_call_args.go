package main

import "reflect"

// Values holds values to count.
type Values struct{ vals []int }

// Count returns the number of values that keep keeps.
func (v *Values) Count(keep func(v int) bool) int {
	n := 0
	for _, x := range v.vals {
		if keep(x) {
			n++
		}
	}
	return n
}

// Sum returns the sum of the values that f maps vals to.
func Sum(vals []int, f func(v int) int) int {
	s := 0
	for _, x := range vals {
		s += f(x)
	}
	return s
}

func main() {
	// A function that reflection made, as an interpreter such as yaegi
	// makes the function literals of its code, passed by reflect.Value.Call
	// to an exported method and function, which call it.
	keep := reflect.MakeFunc(reflect.TypeFor[func(int) bool](), func(args []reflect.Value) []reflect.Value {
		return []reflect.Value{reflect.ValueOf(args[0].Int() > 4)}
	})
	values := &Values{[]int{1, 5, 7, 2}}
	println(reflect.ValueOf(values).MethodByName("Count").Call([]reflect.Value{keep})[0].Int())
	double := reflect.MakeFunc(reflect.TypeFor[func(int) int](), func(args []reflect.Value) []reflect.Value {
		return []reflect.Value{reflect.ValueOf(2 * int(args[0].Int()))}
	})
	println(reflect.ValueOf(Sum).Call([]reflect.Value{reflect.ValueOf(values.vals), double})[0].Int())

	// Compiled calls are unchanged.
	println(values.Count(func(v int) bool { return v < 4 }), Sum(values.vals, func(v int) int { return v }))
}
