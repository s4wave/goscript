package main

func fillArray(dst *[4]byte) {
	for i := range dst {
		dst[i] = byte(i + 1)
	}
}

func sumArray(src *[4]byte) int {
	sum := 0
	for _, v := range src {
		sum += int(v)
	}
	return sum
}

func closureArrayAddress() int {
	result := 0
	func() {
		table := [4]byte{6, 7, 8, 9}
		ptr := &table
		result = int(ptr[2])
	}()
	return result
}

type item struct {
	value int
}

type arrays struct {
	slices [1][]int
	items  [1]item
}

func main() {
	slices := [1][]int{{1}}
	slicesCopy := slices
	slicesCopy[0][0] = 7
	println("slice sharing:", slices[0][0])

	structs := [1]item{{value: 1}}
	structsCopy := structs
	structsCopy[0].value = 7
	println("struct copy:", structs[0].value, structsCopy[0].value)

	pointers := [1]*item{{value: 1}}
	pointersCopy := pointers
	pointersCopy[0].value = 7
	println("pointer sharing:", pointers[0].value, pointers[0] == pointersCopy[0])

	original := arrays{slices: slices, items: structs}
	copied := original
	copied.slices[0][0] = 8
	copied.items[0].value = 8
	println("array fields:", original.slices[0][0], original.items[0].value, copied.items[0].value)

	// Assigning an array element copies its value instead of aliasing the row.
	rows := [2][2]int32{{1, 2}, {3, 4}}
	rows[1] = rows[0]
	rows[1][0] = 9
	println("row copy:", rows[0][0], rows[0][1], rows[1][0], rows[1][1])

	var buckets [2][3]uint64
	cache := &buckets[1]

	println("len:", len(cache))

	cache[0] = 5
	cache[1] = 7
	println("index:", cache[0], cache[1])

	for i, x := range cache {
		println("range:", i, x)
	}

	view := cache[:]
	println("slice:", len(view), view[2])

	buf := []byte{9, 0, 0, 0, 0}
	fillArray((*[4]byte)(buf[1:]))
	println("converted:", buf[0], buf[1], buf[2], buf[3], buf[4])
	println("converted sum:", sumArray((*[4]byte)(buf[1:])))

	literal := &[4]byte{4, 3, 2, 1}
	println("literal sum:", sumArray(literal))
	fillArray(literal)
	println("literal filled:", literal[0], literal[1], literal[2], literal[3])
	println("closure ptr:", closureArrayAddress())
}
