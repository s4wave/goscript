// Generated file based on select_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test 1: Simple deterministic select with default
	// Create a buffered channel so sends don't block
	let ch1: $.Channel<string> | null = $.makeChannel<string>(1, "", "both")

	// First test: empty channel, should hit default
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (__goscriptSelect0Result) => {
				let msg = __goscriptSelect0Result.value
				await $.println("TEST1: Received unexpected value:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
				await $.println("TEST1: Default case hit correctly")
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}

	// Now put something in the channel
	await $.chanSend(ch1, "hello")

	// Second test: should read from channel
	const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch1,
			onSelected: async (__goscriptSelect1Result) => {
				let msg = __goscriptSelect1Result.value
				await $.println("TEST2: Received expected value:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect1Result) => {
				await $.println("TEST2: Default case hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelect1HasReturn) {
		return __goscriptSelect1Value
	}

	// Test 3: Select with channel closing and ok value
	let ch2: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch2, 42)
	ch2!.close()

	// First receive gets the buffered value
	const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch2,
			onSelected: async (__goscriptSelect2Result) => {
				let val = __goscriptSelect2Result.value
				let ok = __goscriptSelect2Result.ok
				if (ok) {
					await $.println("TEST3: Received buffered value with ok==true:", val)
				} else {
					await $.println("TEST3: Unexpected ok==false")
				}
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect2Result) => {
				await $.println("TEST3: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelect2HasReturn) {
		return __goscriptSelect2Value
	}

	// Second receive gets the zero value with ok==false
	const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch2,
			onSelected: async (__goscriptSelect3Result) => {
				let val = __goscriptSelect3Result.value
				let ok = __goscriptSelect3Result.ok
				if (ok) {
					await $.println("TEST4: Unexpected ok==true:", val)
				} else {
					await $.println("TEST4: Received zero value with ok==false:", val)
				}
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect3Result) => {
				await $.println("TEST4: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelect3HasReturn) {
		return __goscriptSelect3Value
	}

	// Test 5: Send operations
	let ch3: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")

	// First send should succeed (buffer not full)
	const [__goscriptSelect4HasReturn, __goscriptSelect4Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: ch3,
			value: 5,
			onSelected: async (__goscriptSelect4Result) => {
				await $.println("TEST5: Sent value successfully")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect4Result) => {
				await $.println("TEST5: Default hit unexpectedly")
			}
		}
	], true)
	if (__goscriptSelect4HasReturn) {
		return __goscriptSelect4Value
	}

	// Second send should hit default (buffer full)
	const [__goscriptSelect5HasReturn, __goscriptSelect5Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: ch3,
			value: 10,
			onSelected: async (__goscriptSelect5Result) => {
				await $.println("TEST6: Sent unexpectedly")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect5Result) => {
				await $.println("TEST6: Default hit correctly (channel full)")
			}
		}
	], true)
	if (__goscriptSelect5HasReturn) {
		return __goscriptSelect5Value
	}

	// Test 7: Multiple channel select (with known values)
	let ch4: $.Channel<string> | null = $.makeChannel<string>(1, "", "both")
	let ch5: $.Channel<string> | null = $.makeChannel<string>(1, "", "both")

	await $.chanSend(ch4, "from ch4")

	// Should select ch4 because it has data, ch5 is empty
	const [__goscriptSelect6HasReturn, __goscriptSelect6Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch4,
			onSelected: async (__goscriptSelect6Result) => {
				let msg = __goscriptSelect6Result.value
				await $.println("TEST7: Selected ch4 correctly:", msg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch5,
			onSelected: async (__goscriptSelect6Result) => {
				let msg = __goscriptSelect6Result.value
				await $.println("TEST7: Selected ch5 unexpectedly:", msg)
			}
		}
	], false)
	if (__goscriptSelect6HasReturn) {
		return __goscriptSelect6Value
	}

	// Now ch4 is empty and ch5 is empty
	await $.chanSend(ch5, "from ch5")

	// Should select ch5 because it has data, ch4 is empty
	const [__goscriptSelect7HasReturn, __goscriptSelect7Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch4,
			onSelected: async (__goscriptSelect7Result) => {
				let msg = __goscriptSelect7Result.value
				await $.println("TEST8: Selected ch4 unexpectedly:", msg)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: ch5,
			onSelected: async (__goscriptSelect7Result) => {
				let msg = __goscriptSelect7Result.value
				await $.println("TEST8: Selected ch5 correctly:", msg)
			}
		}
	], false)
	if (__goscriptSelect7HasReturn) {
		return __goscriptSelect7Value
	}

	// Test 9: Channel closing test case for a separate test
	let chClose: $.Channel<boolean> | null = $.makeChannel<boolean>(0, false, "both")
	chClose!.close()
	let __goscriptRecv0 = await $.chanRecvWithOk(chClose)
	let val = __goscriptRecv0.value
	let ok = __goscriptRecv0.ok
	if (!ok) {
		await $.println("TEST9: Channel is closed, ok is false, val:", val)
	} else {
		await $.println("TEST9: Channel reports as not closed")
	}

	// Empty cases communicate; an empty default leaves the channel alone.
	let empty: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	const [__goscriptSelect8HasReturn, __goscriptSelect8Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: empty,
			value: 17,
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect8Result) => {
				$.panic("empty send case did not send")
			}
		}
	], true)
	if (__goscriptSelect8HasReturn) {
		return __goscriptSelect8Value
	}
	const [__goscriptSelect9HasReturn, __goscriptSelect9Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: empty,
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect9Result) => {
				$.panic("empty receive case did not receive")
			}
		}
	], true)
	if (__goscriptSelect9HasReturn) {
		return __goscriptSelect9Value
	}
	const [__goscriptSelect10HasReturn, __goscriptSelect10Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: empty,
			onSelected: async (__goscriptSelect10Result) => {
				$.panic("empty default case received unexpectedly")
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
		}
	], true)
	if (__goscriptSelect10HasReturn) {
		return __goscriptSelect10Value
	}

	// An empty body retains its receive assignment and closed-channel readiness.
	let value = 0
	await $.chanSend(empty, 23)
	const [__goscriptSelect11HasReturn, __goscriptSelect11Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: empty,
			onSelected: async (__goscriptSelect11Result) => {
				value = __goscriptSelect11Result.value
			}
		}
	], false)
	if (__goscriptSelect11HasReturn) {
		return __goscriptSelect11Value
	}
	empty!.close()
	const [__goscriptSelect12HasReturn, __goscriptSelect12Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: empty,
		}
	], false)
	if (__goscriptSelect12HasReturn) {
		return __goscriptSelect12Value
	}
	await $.println("TEST10: Empty cases completed:", value, $.len(empty))

	// Each blocked select consumes exactly one of two concurrent sends.
	for (let __rangeIndex = 0; __rangeIndex < 16; __rangeIndex++) {
		let first: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
		let second: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
		let sent: $.Channel<{}> | null = $.makeChannel<{}>(2, {}, "both")
		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			await $.chanSend(first, 7)
			await $.chanSend(sent, {})
		})() })
		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			await $.chanSend(second, 9)
			await $.chanSend(sent, {})
		})() })
		let total = 0
		const [__goscriptSelect13HasReturn, __goscriptSelect13Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: first,
				onSelected: async (__goscriptSelect13Result) => {
					total = __goscriptSelect13Result.value
				}
			},
			{
				id: 1,
				isSend: false,
				channel: second,
				onSelected: async (__goscriptSelect13Result) => {
					total = __goscriptSelect13Result.value
				}
			}
		], false)
		if (__goscriptSelect13HasReturn) {
			return __goscriptSelect13Value
		}
		await $.chanRecv(sent)
		await $.chanRecv(sent)
		if (($.len(first) + $.len(second)) != 1) {
			$.panic("select consumed an unselected value")
		}
		const [__goscriptSelect14HasReturn, __goscriptSelect14Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: first,
				onSelected: async (__goscriptSelect14Result) => {
					let remaining = __goscriptSelect14Result.value
					total = total + (remaining)
				}
			},
			{
				id: 1,
				isSend: false,
				channel: second,
				onSelected: async (__goscriptSelect14Result) => {
					let remaining = __goscriptSelect14Result.value
					total = total + (remaining)
				}
			}
		], false)
		if (__goscriptSelect14HasReturn) {
			return __goscriptSelect14Value
		}
		if (total != 16) {
			$.panic("select lost a value")
		}
	}
	await $.println("TEST11: Concurrent select values preserved")
}

if ($.isMainScript(import.meta)) {
	await main()
}
