package main

// cell stores the buffered width of one table cell.
type cell struct {
	// width is the number of buffered characters.
	width int
}

// main checks append arguments retain their values after the source is reused.
func main() {
	// Resetting a reusable cell must leave appended entries intact.
	current := cell{width: 7}
	cells := append([]cell(nil), current)
	current = cell{}
	println("cell:", cells[0].width, current.width)

	// Arrays also copy at the argument boundary.
	row := [2]int{3, 4}
	rows := append([][2]int(nil), row)
	row[0] = 9
	println("array:", rows[0][0], row[0])

	// Pointer elements retain their identity.
	pointers := append([]*cell(nil), &current)
	current.width = 11
	println("pointer:", pointers[0].width)
}
