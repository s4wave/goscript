package main

// main exercises explicit and empty array literals against native Go output.
func main() {
	// Test basic array literal
	var a [3]int = [3]int{1, 2, 3} //nolint:staticcheck
	println(a[0], a[1], a[2])

	// Test array literal with inferred length
	b := [...]string{"hello", "world"}
	println(b[0], b[1])

	// Test array literal with specific element initialization
	c := [5]int{1: 10, 3: 30}
	println(c[0], c[1], c[2], c[3], c[4])

	// Test empty byte array literal
	d := [4]byte{}
	println(len(d), d[0], d[3])

	// Empty struct-array elements and repeated literals retain independent values.
	e := [4096]struct{ value int }{}
	f := [4096]struct{ value int }{}
	e[0].value = 7
	e[4095].value = 9
	println(len(e), e[0].value, e[1].value, e[4095].value, f[0].value)

	// Nested arrays allocate separate inner arrays for each element.
	g := [2][3]int{}
	g[0][1] = 11
	println(g[0][1], g[1][1])
}
