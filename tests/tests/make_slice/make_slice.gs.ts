// Generated file based on make_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	await $.println("--- Testing make() with slices ---")

	// Test 1: Basic make with length only
	await $.println("--- Basic make with length only ---")
	let s1: $.Slice<number> = $.makeSlice<number>(5, undefined, "number")
	await $.println("len(s1):", $.len(s1))
	await $.println("cap(s1):", $.cap(s1))

	// Test 2: Make with length and capacity
	await $.println("--- Make with length and capacity ---")
	let s2: $.Slice<number> = $.makeSlice<number>(3, 10, "number")
	await $.println("len(s2):", $.len(s2))
	await $.println("cap(s2):", $.cap(s2))

	// Test 3: Make bytes with zero length, large capacity
	await $.println("--- Make bytes with zero length, large capacity ---")
	let b1: $.Slice<number> = $.makeSlice<number>(0, 100000, "byte")
	await $.println("len(b1):", $.len(b1))
	await $.println("cap(b1):", $.cap(b1))

	// Test 4: Make bytes with length and capacity
	await $.println("--- Make bytes with length and capacity ---")
	let b2: $.Slice<number> = $.makeSlice<number>(10, 50, "byte")
	await $.println("len(b2):", $.len(b2))
	await $.println("cap(b2):", $.cap(b2))

	// Test 5: Make with zero capacity
	await $.println("--- Make with zero capacity ---")
	let s3: $.Slice<number> = $.makeSlice<number>(0, 0, "number")
	await $.println("len(s3):", $.len(s3))
	await $.println("cap(s3):", $.cap(s3))

	// Test 6: Make with equal length and capacity
	await $.println("--- Make with equal length and capacity ---")
	let s4: $.Slice<string> = $.makeSlice<string>(7, 7, "string")
	await $.println("len(s4):", $.len(s4))
	await $.println("cap(s4):", $.cap(s4))

	// Test 7: Append to slice with extra capacity
	await $.println("--- Append to slice with extra capacity ---")
	let s5: $.Slice<number> = $.makeSlice<number>(2, 5, "number")
	s5![0] = 10
	s5![1] = 20
	await $.println("Before append - len:", $.len(s5), "cap:", $.cap(s5))
	s5 = $.append(s5, 30)
	await $.println("After append - len:", $.len(s5), "cap:", $.cap(s5))
	await $.println("s5[2]:", $.arrayIndex(s5!, 2))

	// Test 8: Append to bytes with extra capacity
	await $.println("--- Append to bytes with extra capacity ---")
	let b3: $.Slice<number> = $.makeSlice<number>(1, 10, "byte")
	b3![0] = $.uint(65, 8)
	await $.println("Before append - len:", $.len(b3), "cap:", $.cap(b3))
	b3 = $.append(b3, $.uint(66, 8), $.byteSliceHint)
	await $.println("After append - len:", $.len(b3), "cap:", $.cap(b3))
	await $.println("b3[0]:", $.uint($.arrayIndex(b3!, 0), 8))
	await $.println("b3[1]:", $.uint($.arrayIndex(b3!, 1), 8))

	// Test 9: Large capacity slice
	await $.println("--- Large capacity slice ---")
	let large: $.Slice<number> = $.makeSlice<number>(5, 1000000, "number")
	await $.println("len(large):", $.len(large))
	await $.println("cap(large):", $.cap(large))

	// Test 10: Zero length, various capacities
	await $.println("--- Zero length, various capacities ---")
	let z1: $.Slice<number> = $.makeSlice<number>(0, 1, "byte")
	let z2: $.Slice<number> = $.makeSlice<number>(0, 100, "byte")
	let z3: $.Slice<number> = $.makeSlice<number>(0, 10000, "byte")
	await $.println("z1 - len:", $.len(z1), "cap:", $.cap(z1))
	await $.println("z2 - len:", $.len(z2), "cap:", $.cap(z2))
	await $.println("z3 - len:", $.len(z3), "cap:", $.cap(z3))

	// Test 11: Slice operations on made slices
	await $.println("--- Slice operations on made slices ---")
	let s6: $.Slice<number> = $.makeSlice<number>(10, 20, "number")
	for (let i = 0; i < 10; i++) {
		s6![i] = i * 10
	}
	let sub: $.Slice<number> = $.goSlice(s6, 2, 5)
	await $.println("sub - len:", $.len(sub), "cap:", $.cap(sub))
	await $.println("sub[0]:", $.arrayIndex(sub!, 0))
	await $.println("sub[2]:", $.arrayIndex(sub!, 2))

	// Test 12: String slices with capacity
	await $.println("--- String slices with capacity ---")
	let str: $.Slice<string> = $.makeSlice<string>(3, 8, "string")
	str![0] = "hello"
	str![1] = "world"
	str![2] = "test"
	await $.println("str - len:", $.len(str), "cap:", $.cap(str))
	await $.println("str[1]:", $.arrayIndex(str!, 1))

	await $.println("--- All tests completed ---")
}

if ($.isMainScript(import.meta)) {
	await main()
}
