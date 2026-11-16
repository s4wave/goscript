package main

import "reflect"

// T has fields whose values can be read and changed through reflection.
type T struct {
	// A is the string field.
	A string
	// B is the floating point field.
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

type shape interface {
	// Area returns the size of the shape.
	Area() int
}

type square struct {
	// Side is the length of an edge.
	Side int
}

// Area returns the size of the square.
func (s square) Area() int { return s.Side * s.Side }

type holder struct {
	// S holds a shape interface.
	S shape
	// A holds any dynamic value.
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
	// AsBase returns the embedded base.
	AsBase() *base
}

type base struct {
	// This points at the concrete node.
	This node
	// Name identifies the node.
	Name string
}

// AsBase returns the embedded base.
func (b *base) AsBase() *base { return b }

// NewInstance makes a new node of the same type, as a tree of embedded
// struct types does.
func (b *base) NewInstance() node {
	return reflect.New(reflect.TypeOf(b.This).Elem()).Interface().(node)
}

type widget struct {
	base
	// X is a writable widget field.
	X int
}

type body struct {
	widget
	// Title names the body.
	Title string
}

// structPointers shows that a struct pointer from reflect is the pointer
// itself, which satisfies interfaces, both from ValueOf and from New.
func structPointers() {
	// Preserve pointer identity through Interface and Addr.
	b := &body{Title: "body"}
	b.This = b
	n, ok := reflect.ValueOf(b).Interface().(node)
	println("valueof:", ok, ok && n.(*body) == b)
	a, ok := reflect.ValueOf(b).Elem().Addr().Interface().(*body)
	println("addr:", ok, a == b)

	// Make a fresh instance with the same embedded methods.
	nb, ok := b.NewInstance().(*body)
	println("new:", ok, nb != b, nb.Title == "", nb.AsBase() != nil)
	nv := reflect.New(reflect.TypeOf(widget{}))
	nv.Elem().FieldByName("X").SetInt(7)
	println("new widget:", nv.Interface().(*widget).X)

	// A typed nil pointer remains a non-nil interface.
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
	// Follow ordinary pointers and pointers to pointers.
	s := &T{A: "aaa", B: 3.14}
	v := reflect.ValueOf(s)
	println(v.Kind().String(), v.Elem().Kind().String(), v.Elem().Type().String())
	println(walk(v), walk(reflect.ValueOf(&s)))

	// A nil pointer has no reflected element.
	var np *T
	println(walk(reflect.ValueOf(np)), reflect.ValueOf(np).Elem().IsValid())

	// Equality walkers use UnsafeAddr to identify addressable structs before
	// comparing their fields. The address is the same as the original pointer.
	e := v.Elem()
	println("struct address:", e.UnsafeAddr() == v.Pointer(), e.UnsafeAddr() == e.UnsafeAddr())
	fresh := reflect.New(v.Elem().Type())
	println("new struct address:", fresh.Elem().UnsafeAddr() == fresh.Pointer(), fresh.Pointer() != v.Pointer())

	// Writes through struct fields reach the original pointer.
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

	// Reflected integer writes preserve their width.
	n := reflect.New(reflect.TypeOf(0)).Elem()
	n.SetInt(7)
	big := reflect.New(reflect.TypeOf(int64(0))).Elem()
	big.SetInt(1 << 40)
	println(n.Int(), big.Int())

	// Reflected floats and booleans read back their new values.
	f := reflect.New(reflect.TypeOf(0.0)).Elem()
	f.SetFloat(2.5)
	b := reflect.New(reflect.TypeOf(false)).Elem()
	b.SetBool(true)
	println(f.Float(), b.Bool())

	// Assign a slice through its reflected storage.
	sl := reflect.New(reflect.TypeOf([]string{})).Elem()
	sl.Set(reflect.ValueOf([]string{"x", "y"}))
	println(sl.Len())

	// The element of a nil interface is the zero Value.
	var empty holder
	ev := reflect.ValueOf(&empty).Elem()
	sf := ev.Field(0)
	println(sf.Kind().String(), sf.IsNil(), sf.Elem().IsValid())
	println(underlying(sf).Kind().String(), underlying(ev.Field(1)).Kind().String())

	// Unwrap both interface kinds to their concrete values.
	full := holder{S: square{Side: 3}, A: &square{Side: 2}}
	fv := reflect.ValueOf(&full).Elem()
	u := underlying(fv.Field(0))
	println(u.Kind().String(), u.Field(0).Int())
	u = underlying(fv.Field(1))
	println(u.Kind().String(), u.Field(0).Int())

	// A nil empty interface also has no reflected element.
	var nilAny any
	println(reflect.ValueOf(&nilAny).Elem().Elem().IsValid())

	// Check embedded interfaces and dynamically allocated structs.
	structPointers()
}
