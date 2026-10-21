package main

import "reflect"

// Base is a generic type whose methods depend on its type argument.
type Base[T float32 | int] struct{ Vals []T }

// Kind returns the kind of the type argument.
func (b *Base[T]) Kind() string { return reflect.TypeFor[T]().Kind().String() }

// Set sets the values to n copies of the conversion of f to T.
func (b *Base[T]) Set(f float64, n int) {
	b.Vals = make([]T, n)
	for i := range b.Vals {
		b.Vals[i] = T(f)
	}
}

// Fill sets each value to v.
func (b *Base[T]) Fill(v T) {
	for i := range b.Vals {
		b.Vals[i] = v
	}
}

// Sum returns the sum of the values.
func (b *Base[T]) Sum() float64 {
	s := 0.0
	for _, v := range b.Vals {
		s += float64(v)
	}
	return s
}

// First returns the first value.
func (b *Base[T]) First() T { return b.Vals[0] }

// Number embeds a pointer to a Base, as cogentcore.org/lab/tensor does.
type Number[T float32 | int] struct{ *Base[T] }

// String is a method of Number itself.
func (n *Number[T]) String() string { return "number " + n.Kind() }

// Pair is a generic value type.
type Pair[T any] struct{ A, B T }

// Kind returns the kind of the type argument.
func (p Pair[T]) Kind() string { return reflect.TypeFor[T]().Kind().String() }

// NewNumber makes a Number in generic code.
func NewNumber[T float32 | int]() *Number[T] { return &Number[T]{&Base[T]{}} }

// NewFloat32 makes a Number in non-generic code.
func NewFloat32() *Number[float32] { return NewNumber[float32]() }

type kinder interface{ Kind() string }

type stringer interface{ String() string }

// describe calls the methods of n through an interface.
func describe(n kinder) string {
	if s, ok := n.(stringer); ok {
		return s.String()
	}
	return n.Kind()
}

// typeName returns the name of the dynamic type of v, a number.
func typeName(v any) string {
	switch v.(type) {
	case int:
		return "int"
	case float32:
		return "float32"
	}
	return "other"
}

func main() {
	// Values returned by functions called through reflect, as interpreters
	// such as yaegi call them, have the methods of their instantiated types.
	for i, f := range []any{NewFloat32, NewNumber[int]} {
		r := reflect.ValueOf(f).Call(nil)[0]
		println(r.MethodByName("Kind").Call(nil)[0].String())
		println(r.Interface().(kinder).Kind(), r.Interface().(stringer).String())
		println(reflect.ValueOf(describe).Call([]reflect.Value{r})[0].String())
		r.MethodByName("Set").Call([]reflect.Value{reflect.ValueOf(2.5), reflect.ValueOf(2)})
		vals := r.Elem().Field(0).Elem().Field(0)
		println(vals.Len(), typeName(r.MethodByName("First").Call(nil)[0].Interface()))
		fill := []any{float32(1.5), 3}[i]
		r.MethodByName("Fill").Call([]reflect.Value{reflect.ValueOf(fill)})
		println(r.MethodByName("Sum").Call(nil)[0].Float())
	}

	// The same for a value made in generic code and taken from a field.
	type holder struct{ N *Number[float32] }
	h := holder{NewNumber[float32]()}
	println(reflect.ValueOf(h).Field(0).Interface().(kinder).Kind())

	// A generic value type keeps its methods when copied.
	p := Pair[float32]{1, 2}
	q := p
	pv := reflect.ValueOf(q)
	println(pv.MethodByName("Kind").Call(nil)[0].String(), pv.Interface().(kinder).Kind())
	println(reflect.ValueOf(&q).Elem().Interface().(kinder).Kind())
}
