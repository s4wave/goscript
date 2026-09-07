package main

func main() {
	values := []byte{1, 2, 3}
	array := ([2]byte)(values[1:])

	println(array[0], array[1])
	values[1] = 9
	println(array[0], values[1])

	// Whole-array writes through converted pointers preserve the slice backing.
	bytePointer := (*[2]byte)(values[1:])
	*bytePointer = [2]byte{7, 8}
	println("byte write:", values[0], values[1], values[2])
	bytePointer[0] = 6
	println("byte alias:", values[1])

	words := []uint16{1, 2, 3, 4}
	wordPointer := (*[2]uint16)(words[1:])
	replacement := [2]uint16{20, 30}
	*wordPointer = replacement
	replacement[0] = 99
	println("word write:", words[0], words[1], words[2], words[3])
	wordPointer[1] = 40
	println("word alias:", words[2])
}
