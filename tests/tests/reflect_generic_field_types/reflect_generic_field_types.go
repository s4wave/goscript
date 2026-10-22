package main

import "reflect"

type Item struct {
	Name string
	N    int
}

type Option[T any] struct {
	Value T
	Valid bool
}

type List[K comparable, V any] struct {
	Values []V
	Keys   []K
	index  map[K]int
}

type Pair[A, B any] struct {
	First  A
	Second *B
	Both   map[string]A
}

type Data struct {
	Opt  Option[[]Item]
	List List[string, *Item]
	Pair Pair[int, Item]
	OptP *Option[float64]
}

func main() {
	t := reflect.TypeOf(Data{})
	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)
		ft := f.Type
		if ft.Kind() == reflect.Pointer {
			ft = ft.Elem()
		}
		for j := 0; j < ft.NumField(); j++ {
			sf := ft.Field(j)
			println(f.Name+"."+sf.Name+":", sf.Type.String(), sf.Type.Kind().String())
		}
	}

	// Decode-like setting through reflect uses the field types.
	var d Data
	ov := reflect.ValueOf(&d).Elem().Field(0).Field(0)
	sl := reflect.MakeSlice(ov.Type(), 1, 1)
	sl.Index(0).Field(0).SetString("x")
	ov.Set(sl)
	println("opt:", len(d.Opt.Value), d.Opt.Value[0].Name)
	lv := reflect.ValueOf(&d).Elem().Field(1).Field(0)
	lv.Set(reflect.Append(lv, reflect.New(lv.Type().Elem().Elem())))
	d.List.Values[0].N = 3
	println("list:", d.List.Values[0].N)

	// Values of the instantiated types report the same field types.
	o := Option[int]{Value: 4, Valid: true}
	println("value:", reflect.TypeOf(o).Field(0).Type.String(), reflect.ValueOf(o).Field(0).Int())

	// Instantiated types are named with their type arguments and are
	// identical wherever they are described.
	ot := t.Field(0).Type
	println("name:", ot.String(), ot.Name(), ot.PkgPath())
	println("identical:", reflect.TypeOf(d.Opt) == ot, reflect.TypeOf(&d.List).Elem() == t.Field(1).Type, ot == reflect.TypeOf(o))

	// Values made by reflect are of the instantiated type.
	np := reflect.New(t.Field(3).Type.Elem())
	np.Elem().Field(0).SetFloat(1.5)
	reflect.ValueOf(&d).Elem().Field(3).Set(np)
	println("new:", d.OptP.Value)
	op, ok := np.Interface().(*Option[float64])
	println("assert:", ok, op.Value)
	reflect.ValueOf(&d).Elem().Field(0).Set(reflect.ValueOf(Option[[]Item]{Valid: true}))
	println("set:", d.Opt.Valid, len(d.Opt.Value))
	var x any = reflect.ValueOf(d.Pair).Interface()
	switch p := x.(type) {
	case Pair[string, Item]:
		println("switch: wrong")
	case Pair[int, Item]:
		println("switch:", p.First)
	}

	// Values made in generic code are also of the instantiated type.
	g := wrap(2.5)
	println("generic:", reflect.TypeOf(g).String(), reflect.TypeOf(g).Field(0).Type.String())
	reflect.ValueOf(&d).Elem().Field(3).Elem().Set(reflect.ValueOf(g))
	println("generic set:", d.OptP.Value)
	b := boxed(3.5)
	println("boxed:", reflect.TypeOf(b).String())
	reflect.ValueOf(&d).Elem().Field(3).Elem().Set(reflect.ValueOf(b))
	println("boxed set:", d.OptP.Value)
}

// boxed returns v as a valid Option in an interface.
func boxed[T any](v T) any {
	return Option[T]{Value: v, Valid: true}
}

// wrap returns v as a valid Option.
func wrap[T any](v T) Option[T] {
	return Option[T]{Value: v, Valid: true}
}
