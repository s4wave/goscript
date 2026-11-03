package main

import (
	"encoding/json"
	"reflect"
)

type Item struct {
	Name  string
	Done  bool
	Count int
}

// main tests that Unmarshal leaves a value of a basic type unchanged for
// a JSON value of another type, with an UnmarshalTypeError, decoding the
// other values, and for a JSON null, without an error.
func main() {
	b := true
	err := json.Unmarshal([]byte(`"x"`), &b)
	_, isType := err.(*json.UnmarshalTypeError)
	println("bool from string:", err != nil, isType, b)
	err = json.Unmarshal([]byte(`null`), &b)
	println("bool from null:", err == nil, b)

	n := 3
	err = json.Unmarshal([]byte(`true`), &n)
	println("int from bool:", err != nil, n)
	s := "s"
	err = json.Unmarshal([]byte(`3`), &s)
	println("string from number:", err != nil, s)
	err = json.Unmarshal([]byte(`null`), &s)
	println("string from null:", err == nil, s)

	it := Item{Name: "a", Done: true, Count: 2}
	err = json.Unmarshal([]byte(`{"Name":"b","Done":"yes","Count":4}`), &it)
	println("struct fields:", err != nil, it.Name, it.Done, it.Count)
	err = json.Unmarshal([]byte(`{"Name":null,"Done":null,"Count":null}`), &it)
	println("struct nulls:", err == nil, it.Name, it.Done, it.Count)

	var flags []bool
	err = json.Unmarshal([]byte(`[true,"x",false]`), &flags)
	println("slice elements:", err != nil, len(flags), flags[0], flags[1], flags[2])

	// a field of a struct made with reflect, through its address
	st := reflect.StructOf([]reflect.StructField{{Name: "Done", Type: reflect.TypeFor[bool]()}})
	v := reflect.New(st).Elem()
	err = json.Unmarshal([]byte(`"true"`), v.Field(0).Addr().Interface())
	println("reflect field:", err != nil, v.Field(0).Bool())
}
