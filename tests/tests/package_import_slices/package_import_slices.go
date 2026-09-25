package main

import (
	"maps"
	"slices"
)

func main() {
	s := []int{1, 2, 3, 4, 5}

	// This should trigger the interface range issue
	// slices.All returns an iterator interface that can be ranged over
	for i, v := range slices.All(s) {
		println("index:", i, "value:", v)
	}
	for i, v := range slices.Backward(s) {
		if i < 3 {
			break
		}
		println("backward:", i, v)
	}

	cloned := slices.Clone(s)
	cloned[0] = 99
	println("clone first:", cloned[0], "original first:", s[0], "same len:", len(cloned) == len(s))
	var nilSlice []int
	println("nil clone:", slices.Clone(nilSlice) == nil)

	println("equal:", slices.Equal([]int{1, 2}, []int{1, 2}), slices.Equal([]int{1}, []int{2}))
	println("equal func:", slices.EqualFunc([]int{1, 3}, []int{5, 7}, func(a, b int) bool {
		return a%2 == b%2
	}))
	println("contains:", slices.Contains(s, 3), slices.ContainsFunc(s, func(v int) bool {
		return v > 4
	}))
	inserted := slices.Insert([]int{1, 4}, 1, 2, 3)
	println("insert:", inserted[0], inserted[1], inserted[2], inserted[3])
	slices.Reverse(inserted)
	println("reverse:", inserted[0], inserted[1], inserted[2], inserted[3])
	println("is sorted:", slices.IsSorted([]int{1, 2, 3}), slices.IsSorted([]int{1, 3, 2}))

	type item struct {
		group int
		label string
	}
	stable := []item{{2, "a"}, {1, "b"}, {2, "c"}, {1, "d"}}
	slices.SortStableFunc(stable, func(a, b item) int {
		return a.group - b.group
	})
	println("stable:", stable[0].label, stable[1].label, stable[2].label, stable[3].label)
	println("is sorted func:", slices.IsSortedFunc(stable, func(a, b item) int {
		return a.group - b.group
	}))

	filtered := slices.DeleteFunc([]int{1, 2, 3, 4, 5}, func(v int) bool {
		return v%2 == 0
	})
	println("delete func:", filtered[0], filtered[1], filtered[2], len(filtered))

	sortedKeys := slices.Sorted(maps.Keys(map[string]int{"c": 3, "a": 1, "b": 2}))
	println("sorted:", sortedKeys[0], sortedKeys[1], sortedKeys[2])

	for v := range slices.Values(s) {
		println("value:", v)
	}
	for v := range slices.Values(s) {
		if v > 2 {
			break
		}
		println("value stop:", v)
	}
	valueCount := 0
	for range slices.Values(nilSlice) {
		valueCount++
	}
	println("nil values:", valueCount)
	sortedValues := slices.Sorted(slices.Values([]string{"c", "a", "b"}))
	println("sorted values:", sortedValues[0], sortedValues[1], sortedValues[2])

	repeated := slices.Repeat([]int{7, 8}, 3)
	println("repeat:", len(repeated), cap(repeated), repeated[0], repeated[5], slices.Repeat([]int(nil), 2) == nil, len(slices.Repeat([]int{1}, 0)))

	sortedFunc := slices.SortedFunc(slices.Values([]int{1, 3, 2}), func(a, b int) int {
		return b - a
	})
	println("sorted func:", sortedFunc[0], sortedFunc[1], sortedFunc[2], slices.SortedFunc(slices.Values([]int{}), func(a, b int) int {
		return a - b
	}) == nil)

	stableSeq := slices.SortedStableFunc(slices.Values([]item{{2, "a"}, {1, "b"}, {2, "c"}, {1, "d"}}), func(a, b item) int {
		return a.group - b.group
	})
	println("sorted stable func:", stableSeq[0].label, stableSeq[1].label, stableSeq[2].label, stableSeq[3].label)

	println("test finished")
}
