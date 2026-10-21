package main

import "reflect"

// kind reports the dynamic type of v, as a type switch sees it.
func kind(v any) string {
	switch v.(type) {
	case float32:
		return "float32"
	case float64:
		return "float64"
	case int:
		return "int"
	}
	return "other"
}

// kinds reports the dynamic types of vals.
func kinds(vals ...any) string {
	s := ""
	for _, v := range vals {
		s += kind(v) + " "
	}
	return s
}

func main() {
	// A float64 with an integer value keeps its type through Interface, as
	// interpreters such as yaegi make their constants and variables.
	v := reflect.New(reflect.TypeFor[float64]()).Elem()
	v.SetFloat(3)
	println(kind(v.Interface()))
	println(kind(reflect.ValueOf(2).Convert(reflect.TypeFor[float64]()).Interface()))

	// An int keeps its type too: a type switch with a float32 case before
	// the int case takes it for an int.
	i := reflect.New(reflect.TypeFor[int]()).Elem()
	i.SetInt(3)
	_, isFloat32 := i.Interface().(float32)
	println(kind(i.Interface()), isFloat32)

	// The same for arguments of interface type passed by Call.
	println(reflect.ValueOf(kind).Call([]reflect.Value{v})[0].String())
	println(reflect.ValueOf(kinds).Call([]reflect.Value{v, reflect.ValueOf(1)})[0].String())

	// And for values stored in interface elements, fields and map values.
	s := reflect.MakeSlice(reflect.TypeFor[[]any](), 1, 1)
	s.Index(0).Set(v)
	s = reflect.Append(s, v)
	println(kinds(s.Interface().([]any)...))
	m := reflect.MakeMap(reflect.TypeFor[map[string]any]())
	m.SetMapIndex(reflect.ValueOf("k"), v)
	println(kind(m.Interface().(map[string]any)["k"]))
	var x struct{ F any }
	reflect.ValueOf(&x).Elem().Field(0).Set(v)
	println(kind(x.F))
}
