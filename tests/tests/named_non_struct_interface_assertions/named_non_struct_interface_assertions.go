package main

type adder interface {
	Add(int) int
}

type namedSlice []int

func (v namedSlice) Add(n int) int {
	return len(v) + n
}

type namedMap map[string]int

func (v namedMap) Add(n int) int {
	return len(v) + n
}

type namedArray [2]int

func (v namedArray) Add(n int) int {
	return len(v) + n
}

type namedInt int

func (v namedInt) Add(n int) int {
	return int(v) + n
}

type pointerSlice []int

func (v *pointerSlice) Add(n int) int {
	return len(*v) + n
}

type pointerMap map[string]int

func (v *pointerMap) Add(n int) int {
	return len(*v) + n
}

func check(value any) {
	adder, ok := value.(adder)
	if !ok {
		println(false)
		return
	}
	println(ok, adder.Add(3))
}

func main() {
	check(namedSlice{1, 2})
	check(namedMap{"one": 1, "two": 2})
	check(namedArray{1, 2})
	check(namedInt(4))
	value := pointerSlice{1, 2}
	check(&value)
	mapped := pointerMap{"one": 1, "two": 2}
	check(&mapped)
}
