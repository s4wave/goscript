package main

import "reflect"

type reader interface {
	Read([]byte) (int, error)
}

type source struct{}

func (*source) Read(value []byte) (int, error) {
	return len(value), nil
}

func mapComparisonPanics() (panicked bool) {
	defer func() {
		panicked = recover() != nil
	}()
	var mapped map[string]int
	var left any = mapped
	var right any = mapped
	_ = left == right
	return false
}

func main() {
	var mapped map[string]int
	var mappedAny any = mapped
	mappedValue, mappedOK := mappedAny.(map[string]int)
	println("map", mappedOK, mappedValue == nil)

	var channel chan int
	var channelAny any = channel
	channelValue, channelOK := channelAny.(chan int)
	println("chan", channelOK, channelValue == nil)

	var callback func()
	var callbackAny any = callback
	callbackValue, callbackOK := callbackAny.(func())
	println("func", callbackOK, callbackValue == nil)

	var pointer *source
	var pointerAny any = pointer
	readerValue, readerOK := pointerAny.(reader)
	count, err := readerValue.Read([]byte{1, 2})
	if err != nil {
		panic(err)
	}
	println("reader", readerOK, count)

	mappedReflect := reflect.ValueOf(mapped)
	println("reflect-map", mappedReflect.Kind() == reflect.Map, mappedReflect.IsNil())

	pointerReflect := reflect.ValueOf(pointer)
	println(
		"reflect-pointer",
		pointerReflect.Kind() == reflect.Pointer,
		pointerReflect.IsNil(),
		pointerReflect.Type().Elem().Kind() == reflect.Struct,
	)

	println("map-comparison-panics", mapComparisonPanics())
}
