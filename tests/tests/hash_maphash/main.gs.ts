// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as hash from "@goscript/hash/index.js"

import * as maphash from "@goscript/hash/maphash/index.js"
import "@goscript/hash/index.js"
import "@goscript/hash/maphash/index.js"

export let stripeSeed: maphash.Seed = $.markAsStructValue($.cloneStructValue(maphash.MakeSeed()))

export function __goscript_set_stripeSeed(__goscriptValue: maphash.Seed): void {
	$.assignStruct(stripeSeed, __goscriptValue)
}

export function stripe(key: string): bigint {
	return $.uint64Mod(maphash.String($.markAsStructValue($.cloneStructValue(stripeSeed)), key), 4096n)
}

export async function main(): globalThis.Promise<void> {
	let seed = $.markAsStructValue($.cloneStructValue(maphash.MakeSeed()))
	let whole = maphash.String($.markAsStructValue($.cloneStructValue(seed)), "hello world")
	await $.println(maphash.Bytes($.markAsStructValue($.cloneStructValue(seed)), new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])) == whole)

	let h: $.VarRef<maphash.Hash> = $.varRef($.markAsStructValue(new maphash.Hash()))
	h.value.SetSeed($.markAsStructValue($.cloneStructValue(seed)))
	h.value.WriteString("hello")
	h.value.WriteByte(32)
	h.value.Write(new Uint8Array([119, 111, 114, 108, 100]))
	await $.println(h.value.Sum64() == whole)

	let hh: hash.Hash64 | null = $.interfaceValue<hash.Hash64 | null>(h, "*maphash.Hash", /* @__PURE__ */ $.pointerType("maphash.Hash"))
	await $.println(await $.pointerValue<Exclude<hash.Hash64, null>>(hh).Size(), await $.pointerValue<Exclude<hash.Hash64, null>>(hh).BlockSize(), $.len(await $.pointerValue<Exclude<hash.Hash64, null>>(hh).Sum(null)))

	h.value.Reset()
	await $.println(h.value.Sum64() == maphash.String($.markAsStructValue($.cloneStructValue(seed)), ""))
	await $.println(maphash.String($.markAsStructValue($.cloneStructValue(seed)), "a") != maphash.String($.markAsStructValue($.cloneStructValue(seed)), "b"))
	await $.println(maphash.Comparable($.markAsStructValue($.cloneStructValue(seed)), 42) == maphash.Comparable($.markAsStructValue($.cloneStructValue(seed)), 42))

	let zero: $.VarRef<maphash.Hash> = $.varRef($.markAsStructValue(new maphash.Hash()))
	zero.value.WriteString("abc")
	await $.println(zero.value.Sum64() == maphash.String($.markAsStructValue($.cloneStructValue(zero.value.Seed())), "abc"))

	await $.println(stripe("block") == stripe("block"), stripe("block") < 4096n)
}

if ($.isMainScript(import.meta)) {
	await main()
}
