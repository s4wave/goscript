package main

import "reflect"

type Grid struct {
	N [2]int
	F [3]float32
	B [2]bool
}

type Pair [2]int

type Counts map[string]int

func main() {
	// Set array fields from array values converted to interfaces.
	var g Grid
	v := reflect.ValueOf(&g).Elem()
	v.Field(0).Set(reflect.ValueOf([2]int{3, 4}))
	f := [3]float32{1, 2, 3}
	v.Field(1).Set(reflect.ValueOf(f))
	var b any = [2]bool{true, false}
	v.Field(2).Set(reflect.ValueOf(b))
	println("fields:", g.N[0], g.N[1], g.F[2], g.B[0], g.B[1])

	// Set a whole array through a pointer.
	var arr [2]int
	reflect.ValueOf(&arr).Elem().Set(reflect.ValueOf([2]int{5, 6}))
	println("array:", arr[0], arr[1])

	// Array types keep their length and element type, and named array and
	// map types their names.
	println("types:", reflect.TypeOf(f).String(), reflect.TypeOf([2]uint8{}).String())
	println("named:", reflect.TypeOf([2]int{}).String(), reflect.TypeOf(Pair{}).String(), reflect.TypeOf(Pair{}).Name())
	println("maps:", reflect.TypeOf(map[string]int{}).String(), reflect.TypeOf(Counts{}).String())

	// The interface holds a copy of the array.
	a := [2]int{1, 2}
	var x any = a
	a[0] = 9
	println("copy:", x.([2]int)[0])

	// Type assertions and switches see the array type.
	switch y := x.(type) {
	case [3]int:
		println("switch: [3]int", y[0])
	case [2]int:
		println("switch: [2]int", y[0])
	}
	var p any = Pair{4, 5}
	_, isPair := p.(Pair)
	_, isPlain := p.([2]int)
	println("assert:", isPair, isPlain, x == any([2]int{1, 2}), x == any([2]int{9, 2}))
}
