package main

import "math"

func main() {
	maxVal := ""
	minVal := "~"
	for _, c := range "3215A" {
		maxVal = max(string(c), maxVal)
		minVal = min(string(c), minVal)
	}
	println("loop:", maxVal, minVal)

	println("two-arg:", min("beta", "alpha"), max("alpha", "beta"))
	println("multi-arg:", min("delta", "alpha", "charlie", "bravo"), max("alpha", "delta", "charlie", "bravo"))
	println("middle-wins:", min("moon", "aardvark", "zebra"), max("ant", "zoo", "yak"))

	nan := math.NaN()
	println("nan:", math.IsNaN(min(nan, 1)), math.IsNaN(max(1, nan)))

	negZero := math.Copysign(0, -1)
	posZero := 0.0
	println("zero:", math.Signbit(min(posZero, negZero)), math.Signbit(max(negZero, posZero)))
}
