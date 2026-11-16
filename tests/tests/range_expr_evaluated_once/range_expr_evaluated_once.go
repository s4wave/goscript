package main

var calls int

func values() []byte {
	calls++
	return []byte{1, 4, 5}
}

type pt struct{ x int }

var table = [3]int{1, 2, 3}

func bump(a *[3]int) { a[2]++ }

func main() {
	sum := 0
	for _, value := range values()[1:] {
		sum += int(value)
	}
	println("calls:", calls)
	println("sum:", sum)

	// An array range expression is a copy, so stores into the array during
	// the loop do not reach the values it reads.
	arr := [3]int{1, 2, 3}
	ranged := 0
	for _, v := range arr {
		arr[2] = 9
		ranged = ranged*10 + v
	}
	println("array:", ranged, arr[2])

	sa := [2]pt{{1}, {2}}
	ranged = 0
	for _, v := range sa {
		sa[1].x = 9
		ranged = ranged*10 + v.x
	}
	println("struct array:", ranged, sa[1].x)

	ranged = 0
	for i, v := range table {
		if i == 0 {
			bump(&table)
		}
		ranged = ranged*10 + v
	}
	println("package array:", ranged, table[2])

	// Ranging through a pointer to an array reads the array itself.
	ptr := &[3]int{1, 2, 3}
	ranged = 0
	for _, v := range ptr {
		ptr[2] = 9
		ranged = ranged*10 + v
	}
	println("array pointer:", ranged)

	// The value is assigned to an element of the ranged array.
	dst := [3]int{1, 2, 3}
	for _, dst[2] = range dst {
	}
	println("assigned:", dst[0], dst[1], dst[2])

	// Loops whose arrays cannot change read them in place.
	ro := [3]int{4, 5, 6}
	ranged = 0
	for _, v := range ro {
		ranged = ranged*10 + v
	}
	println("read only:", ranged)
}
