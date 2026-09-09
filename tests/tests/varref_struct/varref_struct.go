package main

import "reflect"

// MyStruct supplies an addressable value field.
type MyStruct struct {
	// MyInt is shared through pointers to this storage.
	MyInt int
}

// Outer combines copied aggregate storage and shared pointer fields.
type Outer struct {
	// Child is copied in place during assignment.
	Child MyStruct
	// Items retains the addresses of array elements.
	Items [2]MyStruct
	// Ptr is replaced rather than copied through its pointee.
	Ptr *MyStruct
}

// global exercises package-variable setter assignment.
var global MyStruct

// pair returns two independent values for tuple assignment.
func pair() (MyStruct, MyStruct) {
	return MyStruct{MyInt: 70}, MyStruct{MyInt: 80}
}

// main checks variable and field identity across assignment paths.
func main() {
	// 'val' is a value type, but its address is taken, so it should be varrefed in TS.
	val := MyStruct{MyInt: 10}
	ptrToVal := &val

	// Accessing pointer value, should use .value
	println("ptrToVal.MyInt:", ptrToVal.MyInt)

	// Accessing pointer value, should use .value
	myIntVal := ptrToVal.MyInt
	println("myIntVal:", myIntVal)

	// Field pointers retain their storage identity across whole-value assignment.
	field := &val.MyInt
	val = MyStruct{MyInt: 30}
	println("field after assignment:", *field, field == &val.MyInt)
	*field = 40
	println("write through field:", val.MyInt, ptrToVal.MyInt)

	// TypeScript keywords use the same storage key for reads and addresses.
	keywords := struct{ catch int }{catch: 5}
	keyword := &keywords.catch
	*keyword = 6
	println("keyword field:", keywords.catch, keyword == &keywords.catch)

	// Nested values keep their storage while pointer fields change referents.
	first := &MyStruct{MyInt: 1}
	second := &MyStruct{MyInt: 2}
	outer := Outer{Ptr: first}
	child := &outer.Child.MyInt
	item := &outer.Items[0].MyInt
	ptrField := &outer.Ptr
	outer = Outer{Child: MyStruct{MyInt: 50}, Items: [2]MyStruct{{MyInt: 60}}, Ptr: second}
	println("nested:", *child, *item, *ptrField == second, first.MyInt)
	println("nested identity:", child == &outer.Child.MyInt, item == &outer.Items[0].MyInt, ptrField == &outer.Ptr)

	// Both tuple and parallel assignments update existing variable storage.
	val, global = pair()
	println("tuple:", *field, global.MyInt)
	globalField := &global.MyInt
	val, global = global, val
	println("parallel:", *field, *globalField)
	global = MyStruct{MyInt: 90}
	println("global:", *globalField)

	// Reflection writes through the same aggregate storage as generated assignment.
	reflect.ValueOf(&val).Elem().Set(reflect.ValueOf(MyStruct{MyInt: 100}))
	println("reflect:", *field, field == &val.MyInt)
	reflected := reflect.ValueOf(&val).Elem().FieldByName("MyInt").Addr().Interface().(*int)
	println("reflect address:", reflected == field)
}
