package main

import "reflect"

type Inner struct {
	Name string
	N    int
}

type Outer struct {
	P    *Inner
	IP   *int
	SP   *string
	PS   []*Inner
	PM   map[string]*Inner
	In   Inner
	Ptrs []*int
}

func main() {
	// reflect.New of a struct versus &T{}.
	n := reflect.New(reflect.TypeOf(Inner{}))
	n.Elem().Field(0).SetString("a")
	println("new struct:", reflect.DeepEqual(n.Interface(), &Inner{Name: "a"}))

	// reflect.New of a struct versus the address of a variable.
	v := mk("a")
	println("new struct var:", reflect.DeepEqual(n.Interface(), &v), reflect.DeepEqual(&v, n.Interface()))
	set := reflect.New(reflect.TypeOf(Inner{}))
	set.Elem().Set(reflect.ValueOf(v))
	println("set struct var:", reflect.DeepEqual(set.Interface(), &v))
	println("var ptr elems:", reflect.DeepEqual([]*Inner{&v}, []*Inner{n.Interface().(*Inner)}), reflect.DeepEqual(map[int]*Inner{1: set.Interface().(*Inner)}, map[int]*Inner{1: &v}))

	// reflect.New of an int versus a pointer to an int variable.
	ni := reflect.New(reflect.TypeOf(0))
	ni.Elem().SetInt(3)
	three := 3
	println("new int:", reflect.DeepEqual(ni.Interface(), &three))

	// Set pointer fields through reflect.
	var o Outer
	ov := reflect.ValueOf(&o).Elem()
	p := reflect.New(reflect.TypeOf(Inner{}))
	p.Elem().Field(0).SetString("b")
	ov.Field(0).Set(p)
	ip := reflect.New(reflect.TypeOf(0))
	ip.Elem().SetInt(5)
	ov.Field(1).Set(ip)
	sp := reflect.New(reflect.TypeOf(""))
	sp.Elem().SetString("s")
	ov.Field(2).Set(sp)
	five := 5
	s := "s"
	want := Outer{P: &Inner{Name: "b"}, IP: &five, SP: &s}
	println("fields:", reflect.DeepEqual(o, want), reflect.DeepEqual(&o, &want))

	// Addr of a struct field, of a slice element.
	ov.Field(5).Field(0).SetString("in")
	println("addr field:", reflect.DeepEqual(ov.Field(5).Addr().Interface(), &Inner{Name: "in"}))

	// Slices and maps of pointers made by reflect.
	sl := reflect.MakeSlice(reflect.TypeOf([]*Inner{}), 1, 1)
	sl.Index(0).Set(reflect.New(reflect.TypeOf(Inner{})))
	sl.Index(0).Elem().Field(1).SetInt(7)
	ov.Field(3).Set(sl)
	println("slice:", reflect.DeepEqual(o.PS, []*Inner{{N: 7}}))
	mp := reflect.MakeMap(reflect.TypeOf(map[string]*Inner{}))
	mp.SetMapIndex(reflect.ValueOf("k"), reflect.New(reflect.TypeOf(Inner{})))
	ov.Field(4).Set(mp)
	println("map:", reflect.DeepEqual(o.PM, map[string]*Inner{"k": {}}))
	ips := reflect.MakeSlice(reflect.TypeOf([]*int{}), 1, 1)
	ips.Index(0).Set(reflect.New(reflect.TypeOf(0)))
	ov.Field(6).Set(ips)
	zero := 0
	println("int ptrs:", reflect.DeepEqual(o.Ptrs, []*int{&zero}))

	// Unequal pointees are still unequal.
	println("differ:", reflect.DeepEqual(n.Interface(), &Inner{Name: "z"}), reflect.DeepEqual(ni.Interface(), &five))
	println("pointer vs value:", reflect.DeepEqual(&v, v), reflect.DeepEqual(v, &v), reflect.DeepEqual(n.Interface(), v), reflect.DeepEqual(v, n.Interface()))
	type Holder struct{ A, B any }
	println("in interfaces:", reflect.DeepEqual(Holder{&v, v}, Holder{n.Interface(), v}), reflect.DeepEqual(Holder{&v, v}, Holder{v, &v}))
	// Values of the same type made by reflect and by the program are equal.
	m := reflect.MakeMap(reflect.TypeOf(map[string]any{}))
	m.SetMapIndex(reflect.ValueOf("A"), reflect.ValueOf(1))
	println("reflect map:", reflect.DeepEqual([]any{map[string]any{"A": 1}}, []any{m.Interface()}))
	var nilp *int
	println("nil:", reflect.DeepEqual(nilp, ni.Interface()))
}

// mk returns an Inner with the given name.
func mk(name string) Inner {
	return Inner{Name: name}
}
