package main

func sum(values *[4]int) int {
	out := len(values) + cap(values)
	for i := range len(values) {
		out += values[i]
	}
	return out
}

func main() {
	values := &[4]int{1, 2, 3, 4}
	println(sum(values))
}
