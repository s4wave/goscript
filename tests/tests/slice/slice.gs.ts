// Generated file based on slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// --- Original Tests ---
	await $.println("--- Original Tests ---")
	// Create a slice of integers with length 5 and capacity 10
	let s: $.Slice<number> = $.makeSlice<number>(5, 10, "number")
	await $.println($.len(s))
	await $.println($.cap(s))

	// Create a slice of strings with length 3
	let s2: $.Slice<string> = $.makeSlice<string>(3, undefined, "string")
	await $.println($.len(s2))
	await $.println($.cap(s2))

	// Assign values
	s![0] = 10
	s![4] = 20
	s2![1] = "hello"

	await $.println($.arrayIndex(s!, 0))
	await $.println($.arrayIndex(s!, 4))
	await $.println($.arrayIndex(s2!, 1))

	// --- New Tests ---
	await $.println("--- New Tests ---")

	// Create slice from array literal
	let arrLit = [1, 2, 3, 4, 5]
	let sliceFromLit: $.Slice<number> = $.goSlice(arrLit, undefined, undefined)
	await $.println($.len(sliceFromLit))
	await $.println($.cap(sliceFromLit))
	await $.println($.arrayIndex(sliceFromLit!, 0))
	await $.println($.arrayIndex(sliceFromLit!, 4))

	// Create slice from array variable
	let arrVar = ["a", "b", "c", "d"]
	let sliceFromVar: $.Slice<string> = $.goSlice(arrVar, undefined, undefined)
	await $.println($.len(sliceFromVar))
	await $.println($.cap(sliceFromVar))
	await $.println($.arrayIndex(sliceFromVar!, 0))
	await $.println($.arrayIndex(sliceFromVar!, 3))

	// Create slice with specific indices
	let sliceIndices: $.Slice<string> = $.goSlice(arrVar, 1, 3)
	await $.println($.len(sliceIndices))
	await $.println($.cap(sliceIndices))
	await $.println($.arrayIndex(sliceIndices!, 0))
	await $.println($.arrayIndex(sliceIndices!, 1))

	// Create slice with 0 len/cap and append
	await $.println("--- Zero len/cap append ---")
	let zeroSlice: $.Slice<number> = $.makeSlice<number>(0, 0, "number")
	await $.println($.len(zeroSlice))
	await $.println($.cap(zeroSlice))
	zeroSlice = $.append(zeroSlice, 100)
	await $.println($.len(zeroSlice))
	await $.println($.cap(zeroSlice))
	await $.println($.arrayIndex(zeroSlice!, 0))
	zeroSlice = $.append(zeroSlice, 200)
	await $.println($.len(zeroSlice))
	await $.println($.cap(zeroSlice))
	await $.println($.arrayIndex(zeroSlice!, 1))

	// Modify slice, check original array
	await $.println("--- Modify slice, check array ---")
	let modArr = [10, 20, 30]
	let modSlice: $.Slice<number> = $.goSlice(modArr, undefined, undefined)
	modSlice![1] = 25
	await $.println($.arrayIndex(modArr, 1))
	await $.println($.arrayIndex(modSlice!, 1))

	// Modify array, check slice
	await $.println("--- Modify array, check slice ---")
	modArr[0] = 15
	await $.println($.arrayIndex(modArr, 0))
	await $.println($.arrayIndex(modSlice!, 0))

	// Append to sub-slice within capacity
	await $.println("--- Append sub-slice w/in capacity ---")
	let appendArr = [1, 2, 3, 4, 5]
	let appendSlice1: $.Slice<number> = $.goSlice(appendArr, 0, 2)
	await $.println($.len(appendSlice1))
	await $.println($.cap(appendSlice1))
	let appendSlice2: $.Slice<number> = $.append(appendSlice1, 99)
	await $.println($.len(appendSlice2))
	await $.println($.cap(appendSlice2))
	await $.println($.arrayIndex(appendSlice2!, 2))
	await $.println($.arrayIndex(appendArr, 2))

	// Append to sub-slice exceeding capacity
	await $.println("--- Append sub-slice exceed capacity ---")
	let appendSlice3: $.Slice<number> = $.goSlice(appendArr, 3, 5)
	await $.println($.len(appendSlice3))
	await $.println($.cap(appendSlice3))
	let appendSlice4: $.Slice<number> = $.append(appendSlice3, 101)
	await $.println($.len(appendSlice4))
	await $.println($.cap(appendSlice4))
	await $.println($.arrayIndex(appendSlice4!, 0))
	await $.println($.arrayIndex(appendSlice4!, 1))
	await $.println($.arrayIndex(appendSlice4!, 2))
	// Original array should NOT be modified beyond its bounds by this append
	await $.println($.arrayIndex(appendArr, 0))
	await $.println($.arrayIndex(appendArr, 1))
	await $.println($.arrayIndex(appendArr, 2))
	await $.println($.arrayIndex(appendArr, 3))
	await $.println($.arrayIndex(appendArr, 4))

	// Slicing a slice
	await $.println("--- Slicing a slice ---")
	let baseSlice: $.Slice<number> = $.arrayToSlice<number>([0, 10, 20, 30, 40, 50])
	let subSlice1: $.Slice<number> = $.goSlice(baseSlice, 1, 4)
	await $.println($.len(subSlice1))
	await $.println($.cap(subSlice1))
	await $.println($.arrayIndex(subSlice1!, 0))
	let subSlice2: $.Slice<number> = $.goSlice(subSlice1, 1, 3)
	await $.println($.len(subSlice2))
	await $.println($.cap(subSlice2))
	await $.println($.arrayIndex(subSlice2!, 0))
	await $.println($.arrayIndex(subSlice2!, 1))
	subSlice2![0] = 22
	await $.println($.arrayIndex(subSlice1!, 1))
	await $.println($.arrayIndex(baseSlice!, 2))

	// Three-index slicing (if supported) - Check capacity
	await $.println("--- Three-index slicing ---")
	let threeIndexArr = [0, 1, 2, 3, 4, 5]
	let threeIndexSlice: $.Slice<number> = $.goSlice(threeIndexArr, 1, 3, 4)
	await $.println($.len(threeIndexSlice))
	await $.println($.cap(threeIndexSlice))
	await $.println($.arrayIndex(threeIndexSlice!, 0))
	await $.println($.arrayIndex(threeIndexSlice!, 1))
	// Appending should modify original array up to new capacity limit
	threeIndexSlice = $.append(threeIndexSlice, 99)
	await $.println($.len(threeIndexSlice))
	await $.println($.cap(threeIndexSlice))
	await $.println($.arrayIndex(threeIndexSlice!, 2))
	await $.println($.arrayIndex(threeIndexArr, 3))
	// Appending again should reallocate
	threeIndexSlice = $.append(threeIndexSlice, 101)
	await $.println($.len(threeIndexSlice))
	await $.println($.cap(threeIndexSlice))
	await $.println($.arrayIndex(threeIndexSlice!, 3))
	await $.println($.arrayIndex(threeIndexArr, 4))

	// --- Additional Tests for Full Coverage ---
	await $.println("--- Additional Tests ---")

	// Slice literal
	let sliceLiteral: $.Slice<number> = $.arrayToSlice<number>([10, 20, 30])
	await $.println("Slice literal len:", $.len(sliceLiteral))
	await $.println("Slice literal cap:", $.cap(sliceLiteral))
	await $.println("Slice literal[1]:", $.arrayIndex(sliceLiteral!, 1))

	// Nil slice
	let nilSlice: $.Slice<number> = null! as $.Slice<number>
	await $.println("Nil slice len:", $.len(nilSlice))
	await $.println("Nil slice cap:", $.cap(nilSlice))
	nilSlice = $.append(nilSlice, 5)
	await $.println("Append to nil slice len:", $.len(nilSlice))
	await $.println("Append to nil slice cap:", $.cap(nilSlice))
	await $.println("Append to nil slice[0]:", $.arrayIndex(nilSlice!, 0))
	let spreadSource: $.Slice<number> = $.arrayToSlice<number>([7, 8])
	nilSlice = $.appendSlice(nilSlice, spreadSource)
	await $.println("Append spread slice len:", $.len(nilSlice))
	await $.println("Append spread slice[1]:", $.arrayIndex(nilSlice!, 1))
	await $.println("Append spread slice[2]:", $.arrayIndex(nilSlice!, 2))

	// Out-of-bounds indexing (should panic)
	// Note: Testing panics in compliance tests requires specific handling in the test runner.
	// For now, we'll add the code but expect it to fail if panics are not caught.
	// The runner should ideally catch these panics and verify the error type/message.

	// println("--- Testing out-of-bounds panic ---")
	// smallSlice := []int{1}
	// println(smallSlice[1]) // Index out of bounds (len 1, cap 1) - should panic
	// smallSlice[1] = 10     // Index out of bounds - should panic
	// println(smallSlice[-1]) // Negative index - should panic

	// --- Slices of Slices Tests ---
	await $.println("--- Slices of Slices Tests ---")

	// Create a slice of slices of integers
	let sliceOfSlices: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1, 2, 3]), $.arrayToSlice<number>([4, 5]), $.arrayToSlice<number>([6, 7, 8, 9])])

	await $.println("Length of sliceOfSlices:", $.len(sliceOfSlices))
	await $.println("Capacity of sliceOfSlices:", $.cap(sliceOfSlices))

	// Access elements
	await $.println("sliceOfSlices[0][1]:", $.arrayIndex($.arrayIndex(sliceOfSlices!, 0)!, 1))
	await $.println("sliceOfSlices[1][0]:", $.arrayIndex($.arrayIndex(sliceOfSlices!, 1)!, 0))
	await $.println("sliceOfSlices[2][3]:", $.arrayIndex($.arrayIndex(sliceOfSlices!, 2)!, 3))

	// Append to inner slice (should modify the inner slice)
	await $.println("--- Append to inner slice ---")
	let innerSlice: $.Slice<number> = $.arrayIndex(sliceOfSlices!, 1)
	await $.println("Length of innerSlice:", $.len(innerSlice))
	await $.println("Capacity of innerSlice:", $.cap(innerSlice))

	innerSlice = $.append(innerSlice, 50)
	await $.println("Length of innerSlice after append:", $.len(innerSlice))
	await $.println("Capacity of innerSlice after append:", $.cap(innerSlice))
	await $.println("innerSlice[2]:", $.arrayIndex(innerSlice!, 2))

	// Check if the original slice of slices reflects the change (it should, as innerSlice is a view)
	// Note: Appending to innerSlice might reallocate its underlying array if capacity is exceeded.
	// If reallocated, the original sliceOfSlices will *not* see the change at that index.
	// This test case specifically checks the scenario where the append happens within the original capacity
	// or if the reallocation behavior is correctly handled by GoScript.
	// For this simple case, appending 50 to {4, 5} will likely cause reallocation.
	// Let's test appending within capacity first.

	// Create a slice of slices where inner slice has capacity for append
	let sliceOfSlicesWithCap: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1, 2, 3]), $.makeSlice<number>(2, 5, "number"), $.arrayToSlice<number>([6, 7, 8, 9])])
	$.arrayIndex(sliceOfSlicesWithCap!, 1)![0] = 40
	$.arrayIndex(sliceOfSlicesWithCap!, 1)![1] = 50

	await $.println("--- Append to inner slice with capacity ---")
	let innerSliceWithCap: $.Slice<number> = $.arrayIndex(sliceOfSlicesWithCap!, 1)
	await $.println("Length of innerSliceWithCap:", $.len(innerSliceWithCap))
	await $.println("Capacity of innerSliceWithCap:", $.cap(innerSliceWithCap))

	innerSliceWithCap = $.append(innerSliceWithCap, 60)
	await $.println("Length of innerSliceWithCap after append:", $.len(innerSliceWithCap))
	await $.println("Capacity of innerSliceWithCap after append:", $.cap(innerSliceWithCap))
	await $.println("innerSliceWithCap[2]:", $.arrayIndex(innerSliceWithCap!, 2))

	// Check if the original slice of slices reflects the change (it should, as append was within capacity)
	await $.println("sliceOfSlicesWithCap[1][2]:", $.arrayIndex($.goSlice($.arrayIndex(sliceOfSlicesWithCap!, 1), undefined, 3)!, 2))

	// Append to inner slice exceeding capacity
	await $.println("--- Append to inner slice exceeding capacity ---")
	let innerSliceExceedCap: $.Slice<number> = $.arrayIndex(sliceOfSlices!, 0)
	await $.println("Length of innerSliceExceedCap:", $.len(innerSliceExceedCap))
	await $.println("Capacity of innerSliceExceedCap:", $.cap(innerSliceExceedCap))

	innerSliceExceedCap = $.append(innerSliceExceedCap, 10, 20)
	await $.println("Length of innerSliceExceedCap after append:", $.len(innerSliceExceedCap))
	await $.println("Capacity of innerSliceExceedCap after append:", $.cap(innerSliceExceedCap))
	await $.println("innerSliceExceedCap[3]:", $.arrayIndex(innerSliceExceedCap!, 3))
	await $.println("innerSliceExceedCap[4]:", $.arrayIndex(innerSliceExceedCap!, 4))

	// Check if the original slice of slices reflects the change (it should NOT, due to reallocation)
	// The original sliceOfSlices[0] should still be {1, 2, 3}
	await $.println("Original sliceOfSlices[0] after inner append:", $.arrayIndex($.arrayIndex(sliceOfSlices!, 0)!, 0), $.arrayIndex($.arrayIndex(sliceOfSlices!, 0)!, 1), $.arrayIndex($.arrayIndex(sliceOfSlices!, 0)!, 2))

	// Slicing a slice of slices
	await $.println("--- Slicing a slice of slices ---")
	let subSliceOfSlices: $.Slice<$.Slice<number>> = $.goSlice(sliceOfSlices, 1, 3)
	await $.println("Length of subSliceOfSlices:", $.len(subSliceOfSlices))
	await $.println("Capacity of subSliceOfSlices:", $.cap(subSliceOfSlices))
	await $.println("subSliceOfSlices[0][0]:", $.arrayIndex($.arrayIndex(subSliceOfSlices!, 0)!, 0))
	await $.println("subSliceOfSlices[1][2]:", $.arrayIndex($.arrayIndex(subSliceOfSlices!, 1)!, 2))

	// Modify element in sub-slice of slices (should affect original)
	await $.println("--- Modify element in sub-slice of slices ---")
	$.arrayIndex(subSliceOfSlices!, 0)![1] = 55
	await $.println("sliceOfSlices[1][1] after sub-slice modification:", $.arrayIndex($.arrayIndex(sliceOfSlices!, 1)!, 1))

	// Append a new slice to the slice of slices
	await $.println("--- Append a new slice to slice of slices ---")
	sliceOfSlices = $.append(sliceOfSlices, $.arrayToSlice<number>([100, 110]), $.appendZeros.nil)
	await $.println("Length of sliceOfSlices after append:", $.len(sliceOfSlices))
	await $.println("Capacity of sliceOfSlices after append:", $.cap(sliceOfSlices))
	await $.println("sliceOfSlices[3][0]:", $.arrayIndex($.arrayIndex(sliceOfSlices!, 3)!, 0))

	// Append an existing slice to the slice of slices
	await $.println("--- Append an existing slice to slice of slices ---")
	let existingSlice: $.Slice<number> = $.arrayToSlice<number>([200, 210])
	sliceOfSlices = $.append(sliceOfSlices, existingSlice, $.appendZeros.nil)
	await $.println("Length of sliceOfSlices after appending existing:", $.len(sliceOfSlices))
	await $.println("Capacity of sliceOfSlices after appending existing:", $.cap(sliceOfSlices))
	await $.println("sliceOfSlices[4][1]:", $.arrayIndex($.arrayIndex(sliceOfSlices!, 4)!, 1))

	// Modify the appended existing slice (should NOT affect the slice in sliceOfSlices if it was copied)
	// Go's append copies the slice header, but the underlying array is shared unless reallocation occurs.
	// Modifying existingSlice *after* appending it should not affect the copy in sliceOfSlices
	// unless they still share the underlying array and the modification is within the shared capacity.
	// Let's test this carefully.
	await $.println("--- Modify appended existing slice ---")
	existingSlice![0] = 205
	await $.println("sliceOfSlices[4][0] after modifying existingSlice:", $.arrayIndex($.arrayIndex(sliceOfSlices!, 4)!, 0))

	// If we modify an element in the slice within sliceOfSlices, it *should* affect the original existingSlice
	// if they share the underlying array.
	await $.println("--- Modify slice within sliceOfSlices ---")
	$.arrayIndex(sliceOfSlices!, 4)![1] = 215
	await $.println("existingSlice[1] after modifying slice within sliceOfSlices:", $.arrayIndex(existingSlice!, 1))

	// Create a slice of slices using make
	await $.println("--- Make slice of slices ---")
	let makeSliceOfSlices: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>(2, 4)
	await $.println("Length of makeSliceOfSlices:", $.len(makeSliceOfSlices))
	await $.println("Capacity of makeSliceOfSlices:", $.cap(makeSliceOfSlices))

	// Initialize inner slices
	makeSliceOfSlices![0] = $.arrayToSlice<number>([1000, 2000])
	makeSliceOfSlices![1] = $.makeSlice<number>(1, 3, "number")
	$.arrayIndex(makeSliceOfSlices!, 1)![0] = 3000

	await $.println("makeSliceOfSlices[0][1]:", $.arrayIndex($.arrayIndex(makeSliceOfSlices!, 0)!, 1))
	await $.println("makeSliceOfSlices[1][0]:", $.arrayIndex($.arrayIndex(makeSliceOfSlices!, 1)!, 0))

	// Append a new inner slice
	makeSliceOfSlices = $.append(makeSliceOfSlices, $.arrayToSlice<number>([4000, 5000]), $.appendZeros.nil)
	await $.println("Length of makeSliceOfSlices after append:", $.len(makeSliceOfSlices))
	await $.println("Capacity of makeSliceOfSlices after append:", $.cap(makeSliceOfSlices))
	await $.println("makeSliceOfSlices[2][1]:", $.arrayIndex($.arrayIndex(makeSliceOfSlices!, 2)!, 1))

	// Append another new inner slice (should exceed capacity and reallocate outer slice)
	makeSliceOfSlices = $.append(makeSliceOfSlices, $.arrayToSlice<number>([6000]), $.appendZeros.nil)
	await $.println("Length of makeSliceOfSlices after second append:", $.len(makeSliceOfSlices))
	await $.println("Capacity of makeSliceOfSlices after second append:", $.cap(makeSliceOfSlices))
	await $.println("makeSliceOfSlices[3][0]:", $.arrayIndex($.arrayIndex(makeSliceOfSlices!, 3)!, 0))

	// Nil slice of slices
	await $.println("--- Nil slice of slices ---")
	let nilSliceOfSlices: $.Slice<$.Slice<number>> = null! as $.Slice<$.Slice<number>>
	await $.println("Nil slice of slices len:", $.len(nilSliceOfSlices))
	await $.println("Nil slice of slices cap:", $.cap(nilSliceOfSlices))

	// Append to nil slice of slices
	nilSliceOfSlices = $.append(nilSliceOfSlices, $.arrayToSlice<number>([10000]), $.appendZeros.nil)
	await $.println("Length of nilSliceOfSlices after append:", $.len(nilSliceOfSlices))
	await $.println("Capacity of nilSliceOfSlices after append:", $.cap(nilSliceOfSlices))
	await $.println("nilSliceOfSlices[0][0]:", $.arrayIndex($.arrayIndex(nilSliceOfSlices!, 0)!, 0))

	// Append another slice to the nil slice of slices
	nilSliceOfSlices = $.append(nilSliceOfSlices, $.arrayToSlice<number>([20000, 30000]), $.appendZeros.nil)
	await $.println("Length of nilSliceOfSlices after second append:", $.len(nilSliceOfSlices))
	await $.println("Capacity of nilSliceOfSlices after second append:", $.cap(nilSliceOfSlices))
	await $.println("nilSliceOfSlices[1][1]:", $.arrayIndex($.arrayIndex(nilSliceOfSlices!, 1)!, 1))

	// Empty slice of slices (not nil)
	await $.println("--- Empty slice of slices ---")
	let emptySliceOfSlices: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>(0)
	await $.println("Empty slice of slices len:", $.len(emptySliceOfSlices))
	await $.println("Empty slice of slices cap:", $.cap(emptySliceOfSlices))

	// Append to empty slice of slices
	emptySliceOfSlices = $.append(emptySliceOfSlices, $.arrayToSlice<number>([40000]), $.appendZeros.nil)
	await $.println("Length of emptySliceOfSlices after append:", $.len(emptySliceOfSlices))
	await $.println("Capacity of emptySliceOfSlices after append:", $.cap(emptySliceOfSlices))
	await $.println("emptySliceOfSlices[0][0]:", $.arrayIndex($.arrayIndex(emptySliceOfSlices!, 0)!, 0))
}

if ($.isMainScript(import.meta)) {
	await main()
}
