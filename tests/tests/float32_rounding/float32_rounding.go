package main

func main() {
	var sum32 float32
	var sum64 float64
	for range 10 {
		sum32 += 0.1
		sum64 += 0.1
	}
	println("sum32:", float64(sum32))
	println("sum64:", sum64)

	onePointOne32 := float32(1.1)
	println("widened32:", float64(onePointOne32))

	var max32 float32 = 3.4028234663852886e38
	overflow32 := max32 * 2
	finite64 := float64(max32) * 2
	println("overflow32:", float64(overflow32))
	println("finite64:", finite64)
}
