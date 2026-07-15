package main

type Number int

type Pair struct {
	Value int
}

func main() {
	untypedInt := new(42)
	println("untyped int:", *untypedInt)

	untypedBool := new(true)
	println("untyped bool:", *untypedBool)

	value := 7
	typedValue := new(value)
	println("typed value:", *typedValue)

	namedValue := Number(9)
	namedPointer := new(namedValue)
	println("named value:", *namedPointer)

	pairPointer := new(Pair{Value: 11})
	println("struct value:", pairPointer.Value)
}
