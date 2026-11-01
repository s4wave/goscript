package main

import "reflect"

type T struct {
	A string
	B float32
}

// walk follows pointers as reflection-based encoders do.
func walk(v reflect.Value) string {
	if v.Kind() == reflect.Ptr {
		if v.IsNil() {
			return "nil"
		}
		return "*" + walk(v.Elem())
	}
	return v.Kind().String()
}

type shape interface{ Area() int }

type square struct{ Side int }

func (s square) Area() int { return s.Side * s.Side }

type holder struct {
	S shape
	A any
}

// underlying follows interfaces and pointers until it reaches a concrete
// value, stopping at a nil element, as reflection helpers commonly do.
func underlying(v reflect.Value) reflect.Value {
	for v.Kind() == reflect.Interface || v.Kind() == reflect.Pointer {
		e := v.Elem()
		if !e.IsValid() {
			return v
		}
		v = e
	}
	return v
}

type node interface {
	AsBase() *base
}

type base struct {
	This node
	Name string
}

func (b *base) AsBase() *base { return b }

// NewInstance makes a new node of the same type, as a tree of embedded
// struct types does.
func (b *base) NewInstance() node {
	return reflect.New(reflect.TypeOf(b.This).Elem()).Interface().(node)
}

type widget struct {
	base
	X int
}

type body struct {
	widget
	Title string
}

// structPointers shows that a struct pointer from reflect is the pointer
// itself, which satisfies interfaces, both from ValueOf and from New.
func structPointers() {
	b := &body{Title: "body"}
	b.This = b
	n, ok := reflect.ValueOf(b).Interface().(node)
	println("valueof:", ok, ok && n.(*body) == b)
	a, ok := reflect.ValueOf(b).Elem().Addr().Interface().(*body)
	println("addr:", ok, a == b)

	nb, ok := b.NewInstance().(*body)
	println("new:", ok, nb != b, nb.Title == "", nb.AsBase() != nil)
	nv := reflect.New(reflect.TypeOf(widget{}))
	nv.Elem().FieldByName("X").SetInt(7)
	println("new widget:", nv.Interface().(*widget).X)

	var np *body
	iv := reflect.ValueOf(np).Interface()
	println("nil:", iv != nil, iv.(*body) == nil)

	// Taking the struct out of a pointer leaves the pointer a pointer, as an
	// API installer reading a schema object and its value does.
	var obj any = reflect.New(reflect.TypeOf(widget{})).Interface()
	elem := reflect.Indirect(reflect.ValueOf(obj)).Interface()
	println("indirect:", reflect.ValueOf(obj).Kind().String(), reflect.ValueOf(elem).Kind().String())
	_, isPtr := obj.(*widget)
	_, isElem := elem.(widget)
	println("indirect types:", isPtr, isElem)
}

func main() {
	s := &T{A: "aaa", B: 3.14}
	v := reflect.ValueOf(s)
	println(v.Kind().String(), v.Elem().Kind().String(), v.Elem().Type().String())
	println(walk(v), walk(reflect.ValueOf(&s)))

	var np *T
	println(walk(reflect.ValueOf(np)), reflect.ValueOf(np).Elem().IsValid())

	e := v.Elem()
	println(e.NumField(), e.Field(0).String(), e.CanSet())
	e.Field(0).SetString("bbb")
	e.FieldByName("B").SetFloat(2.5)
	println(s.A, s.B)

	// Field Values copied into a slice read back what was set through them.
	fields := []reflect.Value{e.Field(0), e.Field(1)}
	fields[0].SetString("ccc")
	fields[1].SetFloat(1.5)
	println(fields[0].String(), fields[1].Float(), s.A, s.B)

	// Values made by New read back what was set through them, as decoders
	// building map keys do.
	name := reflect.New(reflect.TypeOf("")).Elem()
	name.SetString("a")
	println(name.String(), name.Interface().(string))
	name.SetString("é")
	println(name.Len())

	n := reflect.New(reflect.TypeOf(0)).Elem()
	n.SetInt(7)
	big := reflect.New(reflect.TypeOf(int64(0))).Elem()
	big.SetInt(1 << 40)
	println(n.Int(), big.Int())

	f := reflect.New(reflect.TypeOf(0.0)).Elem()
	f.SetFloat(2.5)
	b := reflect.New(reflect.TypeOf(false)).Elem()
	b.SetBool(true)
	println(f.Float(), b.Bool())

	sl := reflect.New(reflect.TypeOf([]string{})).Elem()
	sl.Set(reflect.ValueOf([]string{"x", "y"}))
	println(sl.Len())

	// The element of a nil interface is the zero Value.
	var empty holder
	ev := reflect.ValueOf(&empty).Elem()
	sf := ev.Field(0)
	println(sf.Kind().String(), sf.IsNil(), sf.Elem().IsValid())
	println(underlying(sf).Kind().String(), underlying(ev.Field(1)).Kind().String())

	full := holder{S: square{Side: 3}, A: &square{Side: 2}}
	fv := reflect.ValueOf(&full).Elem()
	u := underlying(fv.Field(0))
	println(u.Kind().String(), u.Field(0).Int())
	u = underlying(fv.Field(1))
	println(u.Kind().String(), u.Field(0).Int())

	var nilAny any
	println(reflect.ValueOf(&nilAny).Elem().Elem().IsValid())

	structPointers()
}
