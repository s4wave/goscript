package main

import "slices"

// simpleIterator yields three values and stops when its caller leaves the loop.
func simpleIterator(yield func(int) bool) {
	for i := range 3 {
		if !yield(i) {
			return
		}
	}
}

// keyValueIterator yields each indexed string until its caller stops.
func keyValueIterator(yield func(int, string) bool) {
	values := []string{"a", "b", "c"}
	for i, v := range values {
		if !yield(i, v) {
			return
		}
	}
}

// labeledBackward leaves an ordinary outer loop through two yield callbacks.
func labeledBackward() {
	// Skip the first scan and stop the second scan before its final value.
	println("labeled backward:")
scan:
	for pass := range 3 {
		for _, value := range slices.Backward([]int{1, 2, 3}) {
			for inner := range simpleIterator {
				println("scan:", pass, value, inner)
				if pass == 0 {
					continue scan
				}
				if value == 2 {
					break scan
				}
				break
			}
			println("after inner:", value)
		}
		println("after backward:", pass)
	}
	println("scan finished")
}

// labeledIterators targets the current iterator and an enclosing iterator.
func labeledIterators() {
	// Unlabeled branches still stop or advance the current iterator.
	println("unlabeled iterator:")
	for value := range simpleIterator {
		if value == 0 {
			continue
		}
		println("unlabeled:", value)
		break
	}

	// A branch to the current iterator stops or advances its yield directly.
	println("current iterator:")
current:
	for value := range simpleIterator {
		for inner := range 2 {
			println("current:", value, inner)
			if value == 0 {
				continue current
			}
			break current
		}
		println("after current body")
	}

	// An inner iterator forwards branches to the enclosing iterator's yield.
	println("nested iterators:")
outer:
	for value := range simpleIterator {
		for _, backward := range slices.Backward([]int{4, 5}) {
			for inner := range simpleIterator {
				println("nested:", value, backward, inner)
				if value < 2 {
					continue outer
				}
				break outer
			}
			println("after nested inner")
		}
		println("after nested body")
	}
	println("iterators finished")
}

// localLabels keeps branches within a yield local and unwinds only inner yields.
func localLabels() {
	// Local loop labels work directly, including branches from an inner yield.
	println("local labels:")
	for value := range simpleIterator {
	local:
		for inner := range 3 {
			for nested := range simpleIterator {
				println("local:", value, inner, nested)
				if inner == 0 {
					continue local
				}
				break local
			}
			println("after local inner")
		}

		// A switch label remains reachable in this yield callback.
	switchLabel:
		switch value {
		case 0:
			println("local switch:", value)
			break switchLabel
		default:
			println("local switch default:", value)
		}
		println("after local:", value)
	}
}

// main prints iterator values and the observable labeled-branch sequence.
func main() {
	// Exercise ordinary user iterators before labeled control flow.
	println("Testing single value iterator:")
	for v := range simpleIterator {
		println("value:", v)
	}

	println("Testing key-value iterator:")
	for k, v := range keyValueIterator {
		println("key:", k, "value:", v)
	}

	// Exercise branches through one or several yield callback boundaries.
	labeledBackward()
	labeledIterators()
	localLabels()
	println("test finished")
}
