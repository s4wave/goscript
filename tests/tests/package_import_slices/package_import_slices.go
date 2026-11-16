package main

import (
	"maps"
	"slices"
)

// main compares slice operations with their native Go results.
func main() {
	// Use one source for ordered traversal and iterator composition.
	s := []int{1, 2, 3, 4, 5}

	// Traverse forward, then stop a backward traversal before the prefix.
	for i, v := range slices.All(s) {
		println("index:", i, "value:", v)
	}
	for i, v := range slices.Backward(s) {
		if i < 3 {
			break
		}
		println("backward:", i, v)
	}

	// Iterator producers compose with consumers of the shared Seq types.
	chunks := slices.Collect(slices.Chunk(s, 2))
	println("collected chunks:", len(chunks), chunks[0][0], chunks[2][0])
	pairs := maps.Collect(slices.Backward(s))
	println("collected backward:", len(pairs), pairs[0], pairs[4])
	all := maps.Collect(slices.All(s))
	println("collected all:", len(all), all[0], all[4])
	for chunk := range slices.Chunk(s, 2) {
		println("chunk:", len(chunk), cap(chunk), chunk[0])
	}

	// Clones own their backing storage and preserve a nil slice.
	cloned := slices.Clone(s)
	cloned[0] = 99
	println("clone first:", cloned[0], "original first:", s[0], "same len:", len(cloned) == len(s))
	var nilSlice []int
	println("nil clone:", slices.Clone(nilSlice) == nil)

	// Equality, membership and edits preserve the slice values.
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

	// Stable sorts preserve the original order within each group.
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

	// Delete only the elements the predicate selects.
	filtered := slices.DeleteFunc([]int{1, 2, 3, 4, 5}, func(v int) bool {
		return v%2 == 0
	})
	println("delete func:", filtered[0], filtered[1], filtered[2], len(filtered))

	// Collect map keys into a sorted slice.
	sortedKeys := slices.Sorted(maps.Keys(map[string]int{"c": 3, "a": 1, "b": 2}))
	println("sorted:", sortedKeys[0], sortedKeys[1], sortedKeys[2])

	// Values traverses in order, stops early and accepts a nil slice.
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

	// Repeat allocates independent repeated backing and preserves empty cases.
	repeated := slices.Repeat([]int{7, 8}, 3)
	println("repeat:", len(repeated), cap(repeated), repeated[0], repeated[5], slices.Repeat([]int(nil), 2) == nil, len(slices.Repeat([]int{1}, 0)))

	// Sort a value sequence using its comparison function.
	sortedFunc := slices.SortedFunc(slices.Values([]int{1, 3, 2}), func(a, b int) int {
		return b - a
	})
	println("sorted func:", sortedFunc[0], sortedFunc[1], sortedFunc[2], slices.SortedFunc(slices.Values([]int{}), func(a, b int) int {
		return a - b
	}) == nil)

	// Stable sequence sorting keeps equal elements in their input order.
	stableSeq := slices.SortedStableFunc(slices.Values([]item{{2, "a"}, {1, "b"}, {2, "c"}, {1, "d"}}), func(a, b item) int {
		return a.group - b.group
	})
	println("sorted stable func:", stableSeq[0].label, stableSeq[1].label, stableSeq[2].label, stableSeq[3].label)

	// Struct elements are values. Mutating a copy or a yielded loop value
	// must leave the original slice unchanged.
	type cell struct {
		n int
	}
	copySrc := []cell{{1}, {2}}
	copyDst := []cell{{0}, {0}}
	copy(copyDst, copySrc)
	copyDst[0].n = 9
	println("copy struct:", copySrc[0].n, copySrc[1].n, copyDst[0].n, copyDst[1].n)

	// Cloning copies each struct rather than sharing its fields.
	cloneSrc := []cell{{1}, {2}}
	clonedCells := slices.Clone(cloneSrc)
	clonedCells[0].n = 8
	println("clone struct:", cloneSrc[0].n, cloneSrc[1].n, clonedCells[0].n, clonedCells[1].n)

	// Repeated struct values are independent of the source and each other.
	repeatSrc := []cell{{1}, {2}}
	repeatedCells := slices.Repeat(repeatSrc, 2)
	repeatedCells[0].n = 7
	repeatedCells[2].n = 6
	println("repeat struct:", repeatSrc[0].n, repeatSrc[1].n, repeatedCells[0].n, repeatedCells[1].n, repeatedCells[2].n, repeatedCells[3].n)

	// Concatenation copies structs from every input.
	concatSrc := []cell{{1}, {2}}
	concated := slices.Concat(concatSrc, []cell{{3}})
	concated[0].n = 5
	concated[2].n = 4
	println("concat struct:", concatSrc[0].n, concatSrc[1].n, concated[0].n, concated[1].n, concated[2].n)

	// Values yields copies of struct elements.
	valuesSrc := []cell{{1}, {2}}
	for v := range slices.Values(valuesSrc) {
		v.n = 100
	}
	println("values struct:", valuesSrc[0].n, valuesSrc[1].n)

	// All yields copies of struct elements along with their indices.
	allSrc := []cell{{1}, {2}}
	for _, v := range slices.All(allSrc) {
		v.n = 200
	}
	println("all struct:", allSrc[0].n, allSrc[1].n)

	// append copies struct elements into new backing, including variadic sources.
	appendSrc := []cell{{1}}
	appended := append(appendSrc, cell{2})
	appended[0].n = 9
	println("append realloc:", appendSrc[0].n)
	appendSpread := append([]cell(nil), appendSrc...)
	appendSpread[0].n = 8
	println("append slice:", appendSrc[0].n)

	// Overlapping append reads a snapshot, so later source elements stay intact.
	overlap := make([]int, 2, 4)
	overlap[0], overlap[1] = 1, 2
	overlapped := append(overlap[:1], overlap...)
	println("append overlap:", overlapped[0], overlapped[1], overlapped[2])

	// Backward yields struct values rather than references into its source.
	backwardSrc := []cell{{1}}
	for _, v := range slices.Backward(backwardSrc) {
		v.n = 9
	}
	println("backward struct:", backwardSrc[0].n)

	// Insertion copies the source structs into the result.
	insertSrc := []cell{{1}}
	insertedCells := slices.Insert(insertSrc, 0, cell{})
	insertedCells[1].n = 7
	println("insert struct:", insertSrc[0].n)

	// Replacement copies the remaining source structs.
	replaceSrc := []cell{{1}}
	replaced := slices.Replace(replaceSrc, 0, 0, cell{})
	replaced[1].n = 8
	println("replace struct:", replaceSrc[0].n)

	// Growing past capacity copies struct values into the new backing.
	growSrc := []cell{{1}}
	grown := slices.Grow(growSrc, 1)
	grown[0].n = 9
	println("grow struct:", growSrc[0].n)

	// Collect copies the struct values a map iterator yields.
	collectedMap := map[int]cell{0: {1}}
	collected := slices.Collect(maps.Values(collectedMap))
	collected[0].n = 9
	println("collect struct:", collectedMap[0].n)

	// Interface slices can hold a struct after nil or a pointer.
	mutateSecond := func(values []any) {
		switch value := values[1].(type) {
		case cell:
			value.n = 9
		}
	}
	for _, source := range [][]any{{nil, cell{1}}, {&cell{}, cell{2}}} {
		cloned := slices.Clone(source)
		mutateSecond(cloned)
		copied := make([]any, len(source))
		copy(copied, source)
		mutateSecond(copied)
		appended := append([]any(nil), source...)
		mutateSecond(appended)
		println("interface struct:", source[1].(cell).n, cloned[1].(cell).n, copied[1].(cell).n, appended[1].(cell).n)
	}

	// AppendSeq copies yielded structs into its result.
	appendSeqSource := []cell{{1}}
	appendSeq := func(yield func(cell) bool) {
		yield(appendSeqSource[0])
	}
	appendSeqResult := slices.AppendSeq([]cell(nil), appendSeq)
	appendSeqResult[0].n = 9
	println("append seq struct:", appendSeqSource[0].n, appendSeqResult[0].n)

	// SortedFunc returns struct values independent of the source.
	sortedFuncSource := []cell{{2}, {1}}
	sortedFuncResult := slices.SortedFunc(slices.Values(sortedFuncSource), func(a, b cell) int {
		return a.n - b.n
	})
	sortedFuncResult[0].n = 9
	println("sorted func struct:", sortedFuncSource[0].n, sortedFuncSource[1].n, sortedFuncResult[0].n, sortedFuncResult[1].n)

	// Byte slice results hold bytes and feed byte operations.
	src := []byte("abc")
	byteClone := slices.Clone(src)
	byteClone[0] = 'x'
	byteClone[1] += 255
	println("byte clone:", string(byteClone), string(src), byteClone[1])
	println("byte results:", string(slices.Clip(src[:2])), string(slices.Insert(src, 1, 'y')),
		string(slices.Replace(slices.Clone(src), 0, 2, 'q')), string(slices.Repeat(src, 2)),
		string(slices.Concat(src, []byte("de"))))

	// Report that every comparison reached the end.
	println("test finished")
}
