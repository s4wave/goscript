package main

import "reflect"

type item struct{ name string }

func names(s []*item) string {
	r := ""
	for _, it := range s {
		if it == nil {
			r += "nil "
			continue
		}
		r += it.name + " "
	}
	return r
}

func main() {
	a, b, c := &item{"a"}, &item{"b"}, &item{"c"}

	// a slice of a slice shares its elements: writes through it are seen
	s := []*item{a, b, c}
	sv := reflect.ValueOf(&s).Elem()
	sv.Slice(0, 2).Index(0).Set(reflect.ValueOf(c))
	println("set through slice:", names(s))

	// deleting with an overlapping copy, as slices.Delete does
	s = []*item{a, b, c}
	sv = reflect.ValueOf(&s).Elem()
	n := reflect.Copy(sv.Slice(0, 2), sv.Slice(1, 3))
	sv.Index(2).SetZero()
	sv.Set(sv.Slice(0, 2))
	println("delete first:", n, len(s), names(s))

	// inserting with an overlapping copy, toward the end
	s = []*item{a, b, nil}
	sv = reflect.ValueOf(&s).Elem()
	reflect.Copy(sv.Slice(1, 3), sv.Slice(0, 2))
	sv.Index(0).Set(reflect.ValueOf(c))
	println("insert first:", names(s))

	// strings and ints too
	ss := []string{"x", "y", "z"}
	ssv := reflect.ValueOf(&ss).Elem()
	reflect.Copy(ssv.Slice(0, 2), ssv.Slice(1, 3))
	println("strings:", ss[0], ss[1], ss[2])

	// a slice of an array shares the array
	arr := [3]string{"p", "q", "r"}
	av := reflect.ValueOf(&arr).Elem()
	av.Slice(1, 3).Index(0).SetString("Q")
	println("array:", arr[0], arr[1], arr[2], av.Slice(1, 3).Kind() == reflect.Slice)
}
