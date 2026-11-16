package main

// Increments and decrements wrap integers and round float32 values as Go
// stores them, in variables, struct fields, through pointers, and in
// slice and array elements, also of slices held in plain arrays, as generic
// code makes them.

type counters struct {
	I8  int8
	U16 uint16
	F   float32
}

func appendOf[T any](s []T, v ...T) []T {
	return append(s, v...)
}

func index() int {
	println("index evaluated")
	return 0
}

func main() {
	// Variables and struct fields.
	vf := float32(16777216)
	vf++
	var vu uint16
	vu--
	var vi int32 = -2147483648
	vi--
	c := counters{I8: 127, F: 16777216}
	c.I8++
	c.U16--
	c.F++
	println("vars:", vf == 16777216, vu, vi, c.I8, c.U16, c.F == 16777216)

	// 64-bit integers, which are bigints or wide numbers.
	var i64 int64 = 9223372036854775807
	i64++
	var u64 uint64
	u64--
	var u uint
	u--
	println("wide:", i64, u64, u)

	// Elements of slices held in plain and in typed arrays, and of arrays.
	gi := appendOf[int32](nil, 2147483647)
	gi[0]++
	gb := appendOf[byte](nil, 255, 0)
	gb[0]++
	gb[1]--
	gf := appendOf[float32](nil, 16777216)
	gf[0]++
	ti := []int16{32767}
	ti[0]++
	arr := [2]uint8{255, 0}
	arr[0]++
	arr[1]--
	println("elements:", gi[0], gb[0], gb[1], gf[0] == 16777216, ti[0], arr[0], arr[1])

	// Through pointers, with the target evaluated once.
	pi := &gi[0]
	*pi--
	pf := &vf
	*pf++
	pu := &c.U16
	*pu++
	gu := appendOf[uint32](nil, 0)
	gu[index()]--
	println("pointers:", gi[0], vf == 16777216, c.U16, gu[0])
}
