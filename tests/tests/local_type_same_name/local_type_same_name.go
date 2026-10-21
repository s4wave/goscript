package main

import (
	"fmt"
	"reflect"
)

// show prints the type name, fields and %T of a pointer to a struct.
func show(v any) {
	t := reflect.TypeOf(v).Elem()
	println(t.Name(), t.NumField())
	for i := 0; i < t.NumField(); i++ {
		println(t.Field(i).Name, fmt.Sprint(reflect.ValueOf(v).Elem().Field(i).Interface()))
	}
	println(fmt.Sprintf("%T", v))
}

type person struct {
	ID int
}

func a() any {
	type person struct {
		Name string
		Age  int
	}
	return &person{Name: "Go", Age: 35}
}

func b() any {
	type person struct {
		Title string
	}
	return &person{Title: "Dr"}
}

func main() {
	pa, pb := a(), b()
	show(pa)
	show(pb)
	show(&person{ID: 7})

	// Local types of the same name are distinct types.
	_, ok := pa.(interface{ unused() })
	println(ok, reflect.TypeOf(pa) == reflect.TypeOf(pb), reflect.TypeOf(pa) == reflect.TypeOf(a()))
}
