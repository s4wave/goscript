package main

type ref interface {
	Key() any
}

type valueHash [4]byte

func (h valueHash) Key() any {
	return h
}

func sameKey(a, b ref) bool {
	return a.Key() == b.Key()
}

func differentKey(a, b ref) bool {
	return a.Key() != b.Key()
}

// catch runs fn and returns the message of the runtime error it panics
// with, or "none".
func catch(fn func()) (msg string) {
	msg = "none"
	defer func() {
		if r := recover(); r != nil {
			msg = r.(error).Error()
		}
	}()
	fn()
	return
}

func main() {
	a := valueHash{1: 7}
	b := valueHash{1: 7}
	c := valueHash{2: 7}

	println("same:", sameKey(a, b))
	println("different:", differentKey(a, c))

	// Interfaces holding the same uncomparable dynamic type panic when
	// compared, even with themselves, and cannot be map keys.
	var x any = []int{1}
	var s any = "s"
	println("self:", catch(func() { println(x == x) }))
	println("mixed:", catch(func() { println(x == s) }))
	var e1, e2 any = [1]any{[]int{1}}, [1]any{[]int{1}}
	println("array:", catch(func() { println(e1 == e2) }))
	m := map[any]int{}
	println("map set:", catch(func() { m[x] = 1 }))
	println("map get:", catch(func() { _ = m[x] }))
	println("map delete:", catch(func() { delete(m, x) }))
	var nilMap map[any]int
	println("nil map get:", catch(func() { _ = nilMap[x] }))
	println("map len:", len(m))
}
