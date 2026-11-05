// Generated file based on string_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type label = string

export async function main(): globalThis.Promise<void> {
	let w: any = "test"
	await $.println("value is", $.mustTypeAssert<string>(w, /* @__PURE__ */ $.basicType("string")))

	// A failed assertion gives the zero value of the type, also for nil.
	let n: any = null! as any
	let [s, ok] = $.typeAssertTuple<string>(n, /* @__PURE__ */ $.basicType("string"))
	await $.println("nil string:", $.stringLen(s), $.stringEqual(s, ""), ok)
	let i: any = $.basicInterfaceValue(3, "int")
	let __goscriptTuple0: any = $.typeAssertTuple<string>(i, /* @__PURE__ */ $.basicType("string"))
	s = __goscriptTuple0[0]
	ok = __goscriptTuple0[1]
	await $.println("int string:", $.stringLen(s), $.stringEqual(s, ""), ok)
	let m = $.makeMap<string, any>([])
	let __goscriptTuple1: any = $.typeAssertTuple<string>($.mapGet<string, any, any>(m, "missing", null)[0], /* @__PURE__ */ $.basicType("string"))
	let t: string = __goscriptTuple1[0]
	ok = __goscriptTuple1[1]
	await $.println("missing string:", $.stringLen(t), t + "x", ok)
	let __goscriptTuple2: any = $.typeAssertTuple<label>(n, /* @__PURE__ */ $.basicType("string", "main.label"))
	let l: label = __goscriptTuple2[0]
	ok = __goscriptTuple2[1]
	await $.println("nil label:", $.stringLen(l), $.stringEqual(l, ""), ok)
	let __goscriptTuple3: any = $.typeAssertTuple<number>(n, /* @__PURE__ */ $.basicType("float64"))
	let f: number = __goscriptTuple3[0]
	ok = __goscriptTuple3[1]
	await $.println("nil float64:", f == 0, ok)
	let __goscriptTuple4: any = $.typeAssertTuple<number>(n, /* @__PURE__ */ $.basicType("int"))
	let k: number = __goscriptTuple4[0]
	ok = __goscriptTuple4[1]
	await $.println("nil int:", k + 1, ok)
	let __goscriptTuple5: any = $.typeAssertTuple<boolean>(n, /* @__PURE__ */ $.basicType("bool"))
	let b: boolean = __goscriptTuple5[0]
	ok = __goscriptTuple5[1]
	await $.println("nil bool:", b, ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}
