package main

import "slices"

// point is a named struct stored inside array elements.
type point struct {
	x int
}

// main checks that bulk slice copies copy each array element.
func main() {
	src := [][1]int{{1}}

	dst := make([][1]int, 1)
	copy(dst, src)
	dst[0][0] = 9
	println("copy:", src[0][0])

	appended := append([][1]int(nil), src...)
	appended[0][0] = 9
	println("append:", src[0][0])

	cloned := slices.Clone(src)
	cloned[0][0] = 9
	println("clone:", src[0][0])

	concat := slices.Concat(src, src)
	concat[1][0] = 9
	println("concat:", src[0][0])

	for v := range slices.Values(src) {
		v[0] = 9
	}
	println("values:", src[0][0])

	points := [][1]point{{{x: 1}}}
	pointCopies := make([][1]point, 1)
	copy(pointCopies, points)
	pointCopies[0][0].x = 9
	println("struct array:", points[0][0].x)

	nested := [][1][1]int{{{1}}}
	nestedCopies := slices.Clone(nested)
	nestedCopies[0][0][0] = 9
	println("nested:", nested[0][0][0])

	shared := [][]int{{1}}
	sharedCopies := slices.Clone(shared)
	sharedCopies[0][0] = 9
	println("slice elements share:", shared[0][0])
}
