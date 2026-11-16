// Generated file based on map_support.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Create map using make
	let scores = $.makeMap<string, number>()
	await $.println("Empty map created: Expected: true, Actual:", $.len(scores) == 0)

	// Add key-value pairs
	$.mapSet(scores, "Alice", 90)
	$.mapSet(scores, "Bob", 85)
	$.mapSet(scores, "Charlie", 92)

	// Map size
	await $.println("Map size after adding 3 items: Expected: 3, Actual:", $.len(scores))

	// Access values
	await $.println("Alice's score: Expected: 90, Actual:", $.mapGet<string, number, number>(scores, "Alice", 0)[0])
	await $.println("Bob's score: Expected: 85, Actual:", $.mapGet<string, number, number>(scores, "Bob", 0)[0])

	// Modify a value
	$.mapSet(scores, "Bob", 88)
	await $.println("Bob's updated score: Expected: 88, Actual:", $.mapGet<string, number, number>(scores, "Bob", 0)[0])
	const __goscriptMap0 = scores
	const __goscriptMapKey0 = "Bob"
	$.mapSet(__goscriptMap0, __goscriptMapKey0, $.mapGet<string, number, number>(__goscriptMap0, __goscriptMapKey0, 0)[0] + 1)
	await $.println("Bob's incremented score: Expected: 89, Actual:", $.mapGet<string, number, number>(scores, "Bob", 0)[0])
	const __goscriptMap1 = scores
	const __goscriptMapKey1 = "Bob"
	$.mapSet(__goscriptMap1, __goscriptMapKey1, $.mapGet<string, number, number>(__goscriptMap1, __goscriptMapKey1, 0)[0] + 3)
	await $.println("Bob's compound score: Expected: 92, Actual:", $.mapGet<string, number, number>(scores, "Bob", 0)[0])
	const __goscriptMap2 = scores
	const __goscriptMapKey2 = "Bob"
	$.mapSet(__goscriptMap2, __goscriptMapKey2, $.mapGet<string, number, number>(__goscriptMap2, __goscriptMapKey2, 0)[0] - 1)
	await $.println("Bob's decremented score: Expected: 91, Actual:", $.mapGet<string, number, number>(scores, "Bob", 0)[0])

	// Check if key exists (comma-ok idiom)
	let [value, exists] = $.mapGet<string, number, number>(scores, "David", 0)
	await $.println("Does David exist in map? Expected: false, Actual:", exists)
	await $.println("Value for non-existent key: Expected: 0, Actual:", value)

	// Delete a key
	$.deleteMapEntry(scores, "Charlie")
	let __goscriptTuple0: any = $.mapGet<string, number, number>(scores, "Charlie", 0)
	exists = __goscriptTuple0[1]
	await $.println("After delete, does Charlie exist? Expected: false, Actual:", exists)

	// Create map with literal syntax
	let colors = $.makeMap<string, string>([["red", "#ff0000"], ["green", "#00ff00"], ["blue", "#0000ff"]])
	await $.println("Map literal size: Expected: 3, Actual:", $.len(colors))
	await $.println("Color code for red: Expected: #ff0000, Actual:", $.mapGet<string, string, string>(colors, "red", "")[0])

	// Iterate over a map with range
	await $.println("Iterating over scores map:")

	// Create a new map with string keys and string values for testing iteration
	let stringMap = $.makeMap<string, string>([["Alice", "A+"], ["Bob", "B+"], ["Charlie", "A"]])

	// Note: Map iteration is not ordered in Go, so we will collect the results and sort them for consistent test output.
	let scoreResults: $.Slice<string> = null! as $.Slice<string>
	for (const [name, grade] of stringMap?.entries() ?? []) {
		// Using string concatenation to build the output string
		let result = "  - Name: " + name + " Grade: " + grade
		scoreResults = $.appendOne(scoreResults, result)
	}

	// Inline bubble sort for string slice
	// (avoid importing sort package yet)
	let n = $.sliceLen(scoreResults)
	for (let __goscriptSliceWindow0 = $.sliceRange(scoreResults), i = 0; i < (n - 1); i++) {
		for (let j = 0; j < ((n - i) - 1); j++) {
			if ($.stringCompare(((__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, j)] as string), ((__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, j + 1)] as string)) > 0) {
				let __goscriptAssign0_0: string = ((__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, j + 1)] as string)
				let __goscriptAssign0_1: string = ((__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, j)] as string);
				;(__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, j)] = __goscriptAssign0_0;
				;(__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, j + 1)] = __goscriptAssign0_1
			}
		}
	}

	for (let __goscriptRangeTarget0 = scoreResults, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let result = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as string)
		await $.println(result)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
