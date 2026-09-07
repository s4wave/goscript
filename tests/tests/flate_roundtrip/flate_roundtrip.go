package main

import (
	"bytes"
	"compress/flate"
	"io"
)

func main() {
	// Mixed repeated and distinct bytes exercise dynamic Huffman blocks.
	input := make([]byte, 4096)
	for i := range input {
		input[i] = byte((i*31) ^ (i >> 5))
	}
	for _, level := range []int{flate.BestSpeed, flate.DefaultCompression, flate.BestCompression} {
		var compressed bytes.Buffer
		writer, err := flate.NewWriter(&compressed, level)
		if err != nil {
			panic(err)
		}
		if _, err := writer.Write(input); err != nil {
			panic(err)
		}
		if err := writer.Close(); err != nil {
			panic(err)
		}

		// The decoded bytes must retain the complete original payload.
		reader := flate.NewReader(&compressed)
		output, err := io.ReadAll(reader)
		if err != nil {
			panic(err)
		}
		if err := reader.Close(); err != nil {
			panic(err)
		}
		println(level, len(output), bytes.Equal(input, output))
	}
}
