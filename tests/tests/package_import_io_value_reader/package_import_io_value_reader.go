package main

import (
	"io"
	"strings"
)

// zeroReader is a value-receiver reader, so passing zeroReader{} converts a
// concrete struct value to io.Reader.
type zeroReader struct{}

// Read fills p with zeros and never reaches EOF.
func (zeroReader) Read(p []byte) (int, error) {
	clear(p)
	return len(p), nil
}

func main() {
	// Bound the unbounded value reader directly.
	data, err := io.ReadAll(io.LimitReader(zeroReader{}, 3))
	println("limit:", len(data), data[0] == 0, err == nil)

	// Join a bounded zero range with a trailing reader through a spread slice.
	rdrs := []io.Reader{io.LimitReader(zeroReader{}, 2)}
	rdrs = append(rdrs, strings.NewReader("ab"))
	data, err = io.ReadAll(io.MultiReader(rdrs...))
	println("multi:", len(data), data[1] == 0, string(data[2:]), err == nil)
}
