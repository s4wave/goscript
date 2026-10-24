package main

import "reflect"

type Node interface {
	Name() string
}

type Props map[string]int

type Grid [2]int

type Tree struct {
	Children []Node
	Parent   *Node
	ByName   map[string]Node
	Props    []Props
	Grids    []Grid
}

// show prints the type of a field boxed by Value.Interface, which must keep
// the names of the types that it is made of.
func show(v reflect.Value) {
	t := reflect.TypeOf(v.Interface())
	println(t.String(), t.Elem().Name(), t.Elem().String())
	pt := reflect.TypeOf(v.Addr().Interface())
	println(pt.String(), pt.Elem().Elem().Name())
}

func main() {
	v := reflect.ValueOf(&Tree{}).Elem()
	for i := 0; i < v.NumField(); i++ {
		show(v.Field(i))
	}
}
