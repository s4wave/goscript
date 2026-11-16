package main

type node struct {
	next int
}

type queue struct {
	value int
}

type link struct {
	next *link
	id   int
}

var order string

func idx(n int) int {
	order += "i"
	return n
}

func val(n int) int {
	order += "v"
	return n
}

func pair() (int, int) {
	order += "p"
	return 2, 9
}

func main() {
	left := &queue{value: 1}
	right := &queue{value: 2}
	left, right = right, left
	println(left.value, right.value)

	nodes := [2]node{{next: 1}, {next: 0}}
	pc := 0
	inst := &nodes[pc]
	pc, inst = inst.next, &nodes[inst.next]
	println(pc, inst.next)

	// The operands of every target are evaluated before any is assigned.
	s := []int{0, 0, 0}
	i := 0
	i, s[i] = 2, 9
	println("index:", s[0], s[1], s[2])

	var prev *link
	cur := &link{id: 1, next: &link{id: 2}}
	cur, cur.next, prev = cur.next, prev, cur
	println("deref:", cur.id, prev.id, prev.next == nil)

	p := &i
	i, s[*p] = 1, 7
	println("pointer:", s[1], s[2])

	t := []int{1, 0, 0}
	t[0], t[t[0]] = 2, 5
	println("element:", t[0], t[1], t[2])

	// Target operands that call are evaluated before the values.
	order = ""
	s[idx(0)], s[idx(1)] = val(3), val(4)
	println("order:", order, s[0], s[1])

	// A tuple call evaluates the target operands first, too.
	order = ""
	i = 0
	s[idx(i)], i = pair()
	println("tuple:", order, s[0], i)
	i = 0
	i, s[i] = pair()
	println("tuple index:", s[0], s[1], s[2], i)
}
