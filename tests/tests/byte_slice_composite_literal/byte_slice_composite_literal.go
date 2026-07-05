package main

type holder struct {
	data []byte
}

func main() {
	// A non-empty []byte composite literal must keep the Uint8Array
	// representation shared by the make, conversion, and array-literal
	// paths, rather than degrading to a generic Array<number> backing.
	b := []byte{1, 2, 3}
	println("non-empty:", b)
	println("index:", b[0], b[1], b[2])
	println("len:", len(b))

	// Storing the literal in a struct field and reading it back must
	// preserve the Uint8Array backing without any append repairing it.
	h := holder{data: []byte{9, 8, 7}}
	println("stored:", h.data)
	println("stored index:", h.data[1])

	// An empty non-nil []byte literal stays a Uint8Array.
	e := []byte{}
	println("empty:", e)
	println("empty len:", len(e))

	// A keyed/sparse []byte literal is zero-filled and stays a Uint8Array.
	k := []byte{5: 1}
	println("keyed:", k)
	println("keyed len:", len(k))
}
