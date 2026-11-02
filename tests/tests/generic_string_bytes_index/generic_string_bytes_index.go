package main

// first returns the first byte of data and the rest of it, for data whose
// type parameter is a string or a byte slice, as in
// github.com/clipperhouse/uax29.
func first[T ~string | ~[]byte](data T) (byte, T) {
	return data[0], data[1:]
}

// sum adds the bytes of data, indexing it in a loop.
func sum[T ~string | ~[]byte](data T) int {
	n := 0
	for i := 0; i < len(data); i++ {
		n += int(data[i])
	}
	return n
}

type text string

func main() {
	b, rest := first("abc")
	println(b, rest, len(rest))
	b, bytes := first([]byte("xyz"))
	println(b, string(bytes), len(bytes))
	b, named := first(text("héllo"))
	println(b, string(named), len(named))
	println(sum("abc"), sum([]byte{1, 2, 3}), sum(text("é")))
}
