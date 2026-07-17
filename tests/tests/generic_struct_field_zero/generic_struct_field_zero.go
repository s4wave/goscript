package main

type box[T any] struct {
	Value T
}

type point struct {
	X int
}

func main() {
	var intBox box[int]
	println("int", intBox.Value)

	var stringBox box[string]
	println("string", stringBox.Value == "")

	var mapBox box[map[string]int]
	println("map", mapBox.Value == nil)

	var pointBox box[point]
	println("struct", pointBox.Value.X)

	explicit := box[int]{}
	println("literal", explicit.Value)
}
