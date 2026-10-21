package main

import "reflect"

type Base[T any] struct {
	Values []T
}

// Kind is the kind of the type argument, from its zero value.
func (b *Base[T]) Kind() reflect.Kind {
	var v T
	return reflect.TypeOf(v).Kind()
}

func kindOf[T any](v T) string {
	return reflect.TypeOf(v).Kind().String()
}

func typeSwitch[T any](v T) string {
	switch any(v).(type) {
	case float64:
		return "float64"
	case float32:
		return "float32"
	case int:
		return "int"
	case int64:
		return "int64"
	case uint8:
		return "uint8"
	case string:
		return "string"
	}
	return "other"
}

type Celsius float64

func main() {
	println((&Base[float64]{}).Kind().String(), (&Base[float32]{}).Kind().String(), (&Base[int]{}).Kind().String())
	println((&Base[int64]{}).Kind().String(), (&Base[uint8]{}).Kind().String(), (&Base[string]{}).Kind().String())
	println(kindOf(0.0), kindOf(float32(2)), kindOf(3), kindOf(int64(4)), kindOf(Celsius(5)))
	println(typeSwitch(1.0), typeSwitch(float32(1)), typeSwitch(1), typeSwitch(int64(1)), typeSwitch(byte(1)), typeSwitch("s"))
	var x any = 2.5
	println(typeSwitch(x))
}
