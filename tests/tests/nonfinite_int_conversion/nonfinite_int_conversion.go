package main

import "math"

// channel converts a color component in [0, 1] to 8 bits, as color code
// does; a component computed from a transparent color can be NaN.
func channel(v float64) uint8 {
	return uint8(v * 255)
}

func main() {
	nan := math.NaN()

	// NaN converts to 0 at every narrow width, as with Go on arm64 and wasm.
	println("uint8", uint8(nan), "uint16", uint16(nan), "uint32", uint32(nan))
	println("int8", int8(nan), "int16", int16(nan), "int32", int32(nan))

	// A NaN result is not a valid integer that later code can compare.
	c := channel(nan)
	println("channel", c, "zero", c == 0)

	// Finite values still truncate toward zero as before.
	a, b, d := 200.7, -12.9, 65000.5
	println("finite", uint8(a), int8(b), uint16(d), int32(b))
}
