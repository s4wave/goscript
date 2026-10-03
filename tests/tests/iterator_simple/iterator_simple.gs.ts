// Generated file based on iterator_simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

import type * as iter from "@goscript/iter/index.js"
import "@goscript/slices/index.js"

export async function simpleIterator(_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
	for (let i = 0; i < 3; i++) {
		if (!await _yield!(i)) {
			return
		}
	}
}

export async function keyValueIterator(_yield: ((_p0: number, _p1: string) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
	let values: $.Slice<string> = $.arrayToSlice<string>(["a", "b", "c"])
	for (let __goscriptRangeTarget0 = values, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let v = __goscriptRangeTarget0![i]
		if (!await _yield!(i, v)) {
			return
		}
	}
}

export async function labeledBackward(): globalThis.Promise<void> {
	// Skip the first scan and stop the second scan before its final value.
	await $.println("labeled backward:")
	scan: for (let pass = 0; pass < 3; pass++) {
		let __goscriptRangeBranch1 = 0
		let __goscriptRangeReturn0 = false
		;await (async () => {
			await slices.Backward($.arrayToSlice<number>([1, 2, 3]))!(async (__goscriptRange0_0, value) => {
				let __goscriptRangeBranch0 = 0
				let __goscriptRangeReturn1 = false
				;await (async () => {
					await simpleIterator!(async (inner) => {
						await $.println("scan:", pass, value, inner)
						if (pass == 0) {
							__goscriptRangeBranch0 = 1
							return false
						}
						if (value == 2) {
							__goscriptRangeBranch0 = 2
							return false
						}
						return false
						return true
					})
				})()
				if (__goscriptRangeBranch0 === 1) {
					__goscriptRangeBranch1 = 1
					return false
				}
				if (__goscriptRangeBranch0 === 2) {
					__goscriptRangeBranch1 = 2
					return false
				}
				if (__goscriptRangeReturn1) {
					__goscriptRangeReturn0 = true
					return false
				}
				await $.println("after inner:", value)
				return true
			})
		})()
		if (__goscriptRangeBranch1 === 1) {
			continue scan
		}
		if (__goscriptRangeBranch1 === 2) {
			break scan
		}
		if (__goscriptRangeReturn0) {
			return
		}
		await $.println("after backward:", pass)
	}
	await $.println("scan finished")
}

export async function labeledIterators(): globalThis.Promise<void> {
	// Unlabeled branches still stop or advance the current iterator.
	await $.println("unlabeled iterator:")
	let __goscriptRangeReturn2 = false
	;await (async () => {
		await simpleIterator!(async (value) => {
			if (value == 0) {
				return true
			}
			await $.println("unlabeled:", value)
			return false
			return true
		})
	})()
	if (__goscriptRangeReturn2) {
		return
	}

	// A branch to the current iterator stops or advances its yield directly.
	await $.println("current iterator:")
	current: {
		let __goscriptRangeReturn3 = false
		;await (async () => {
			await simpleIterator!(async (value) => {
				for (let inner = 0; inner < 2; inner++) {
					await $.println("current:", value, inner)
					if (value == 0) {
						return true
					}
					return false
				}
				await $.println("after current body")
				return true
			})
		})()
		if (__goscriptRangeReturn3) {
			return
		}
	}

	// An inner iterator forwards branches to the enclosing iterator's yield.
	await $.println("nested iterators:")
	outer: {
		let __goscriptRangeReturn4 = false
		;await (async () => {
			await simpleIterator!(async (value) => {
				let __goscriptRangeBranch3 = 0
				let __goscriptRangeReturn5 = false
				;await (async () => {
					await slices.Backward($.arrayToSlice<number>([4, 5]))!(async (__goscriptRange5_0, backward) => {
						let __goscriptRangeBranch2 = 0
						let __goscriptRangeReturn6 = false
						;await (async () => {
							await simpleIterator!(async (inner) => {
								await $.println("nested:", value, backward, inner)
								if (value < 2) {
									__goscriptRangeBranch2 = 1
									return false
								}
								__goscriptRangeBranch2 = 2
								return false
								return true
							})
						})()
						if (__goscriptRangeBranch2 === 1) {
							__goscriptRangeBranch3 = 1
							return false
						}
						if (__goscriptRangeBranch2 === 2) {
							__goscriptRangeBranch3 = 2
							return false
						}
						if (__goscriptRangeReturn6) {
							__goscriptRangeReturn5 = true
							return false
						}
						await $.println("after nested inner")
						return true
					})
				})()
				if (__goscriptRangeBranch3 === 1) {
					return true
				}
				if (__goscriptRangeBranch3 === 2) {
					return false
				}
				if (__goscriptRangeReturn5) {
					__goscriptRangeReturn4 = true
					return false
				}
				await $.println("after nested body")
				return true
			})
		})()
		if (__goscriptRangeReturn4) {
			return
		}
	}
	await $.println("iterators finished")
}

export async function localLabels(): globalThis.Promise<void> {
	// Local loop labels work directly, including branches from an inner yield.
	await $.println("local labels:")
	let __goscriptRangeReturn7 = false
	;await (async () => {
		await simpleIterator!(async (value) => {
			local: for (let inner = 0; inner < 3; inner++) {
				let __goscriptRangeBranch4 = 0
				let __goscriptRangeReturn8 = false
				;await (async () => {
					await simpleIterator!(async (nested) => {
						await $.println("local:", value, inner, nested)
						if (inner == 0) {
							__goscriptRangeBranch4 = 1
							return false
						}
						__goscriptRangeBranch4 = 2
						return false
						return true
					})
				})()
				if (__goscriptRangeBranch4 === 1) {
					continue local
				}
				if (__goscriptRangeBranch4 === 2) {
					break local
				}
				if (__goscriptRangeReturn8) {
					__goscriptRangeReturn7 = true
					return false
				}
				await $.println("after local inner")
			}

			// A switch label remains reachable in this yield callback.
			switchLabel: {
				switch (value) {
					case 0:
					{
						await $.println("local switch:", value)
						break switchLabel
						break
					}
					default:
					{
						await $.println("local switch default:", value)
						break
					}
				}
			}
			await $.println("after local:", value)
			return true
		})
	})()
	if (__goscriptRangeReturn7) {
		return
	}
}

export async function main(): globalThis.Promise<void> {
	// Exercise ordinary user iterators before labeled control flow.
	await $.println("Testing single value iterator:")
	let __goscriptRangeReturn9 = false
	;await (async () => {
		await simpleIterator!(async (v) => {
			await $.println("value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn9) {
		return
	}

	await $.println("Testing key-value iterator:")
	let __goscriptRangeReturn10 = false
	;await (async () => {
		await keyValueIterator!(async (k, v) => {
			await $.println("key:", k, "value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn10) {
		return
	}

	// Exercise branches through one or several yield callback boundaries.
	await labeledBackward()
	await labeledIterators()
	await localLabels()
	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
