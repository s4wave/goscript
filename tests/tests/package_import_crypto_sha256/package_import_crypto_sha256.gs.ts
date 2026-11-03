// Generated file based on package_import_crypto_sha256.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as sha256 from "@goscript/crypto/sha256/index.js"
import * as sha512 from "@goscript/crypto/sha512/index.js"
import * as hash from "@goscript/hash/index.js"
import * as io from "@goscript/io/index.js"
import "@goscript/crypto/sha512/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	// The one-shot SHA-256 digest has its standard size and byte encoding.
	let sum = $.cloneArrayValue(await sha256.Sum256(new Uint8Array([97, 98, 99])), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 32))
	await $.println("sum len", 32)
	await $.println("sum first", sum[0])
	await $.println("sum last", sum[31])

	// Incremental writes preserve their order and report the consumed length.
	let h: hash.Hash | null = sha256.New()
	let [n, err] = await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Write(new Uint8Array([97]))
	await $.println("write a", n, err == null)
	let __goscriptTuple0: any = await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Write(new Uint8Array([98, 99]))
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	await $.println("write bc", n, err == null)

	// Sum appends its digest after the supplied prefix.
	let stream = await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Sum(new Uint8Array([1, 2]) as $.Slice<number>)
	await $.println("stream len", $.sliceLen(stream))
	await $.println("stream prefix", $.typedSliceIndex(stream!, 0), $.typedSliceIndex(stream!, 1))
	await $.println("stream digest", $.typedSliceIndex(stream!, 2), $.typedSliceIndex(stream!, 33))

	// Sum uses the caller's spare slice capacity.
	let backing = $.makeSlice<number>(sha256.Size, undefined, "byte")
	let backed = await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Sum($.goSlice(backing, undefined, 0))
	await $.println("backed len", $.sliceLen(backed), $.sliceLen(backing))
	await $.println("backed digest", $.typedSliceIndex(backing!, 0), $.typedSliceIndex(backing!, 31), $.typedSliceIndex(backed!, 0), $.typedSliceIndex(backed!, 31))

	// Every SHA-2 constructor preserves independent incremental state.
	await checkClone("sha224", sha256.New224)
	await checkClone("sha256", sha256.New)
	await checkClone("sha384", sha512.New384)
	await checkClone("sha512", sha512.New)
	await checkClone("sha512/224", sha512.New512_224)
	await checkClone("sha512/256", sha512.New512_256)
}

export async function checkClone(name: string, makeHash: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null): globalThis.Promise<void> {
	// A prefix spans full compression blocks and a partial final block.
	let prefix = $.makeSlice<number>(257, undefined, "byte")
	for (let __goscriptRangeTarget0 = prefix, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		;(__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] = $.uint(i, 8)
	}
	let h = (makeHash!() as hash.Hash | null)
	await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Write(prefix)
	await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Sum(null)

	// Cloning after Sum preserves the prefix without finalizing either state.
	let [cloner, ok] = $.typeAssertTuple<hash.Cloner | null>(h, "hash.Cloner")
	await $.println(name, "cloner", ok)
	if (!ok) {
		return
	}
	let [branch, err] = await (cloner !== null && (cloner as any).__isVarRef !== true && ((cloner as any).__goValue === undefined || (cloner as any).__goType?.charCodeAt(0) !== 42) ? (cloner as Exclude<hash.Cloner, null>) : $.pointerValue<Exclude<hash.Cloner, null>>(cloner)).Clone()
	await $.println(name, "clone err nil", err == null)

	// Each branch accepts a different suffix and still matches a fresh digest.
	await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Write(new Uint8Array([108, 101, 102, 116]))
	await (branch !== null && (branch as any).__isVarRef !== true && ((branch as any).__goValue === undefined || (branch as any).__goType?.charCodeAt(0) !== 42) ? (branch as Exclude<hash.Cloner, null>) : $.pointerValue<Exclude<hash.Cloner, null>>(branch)).Write(new Uint8Array([114, 105, 103, 104, 116]))

	// Fresh runs independently verify each branch's full digest.
	let left = (makeHash!() as hash.Hash | null)
	await (left !== null && (left as any).__isVarRef !== true && ((left as any).__goValue === undefined || (left as any).__goType?.charCodeAt(0) !== 42) ? (left as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(left)).Write(prefix)
	await (left !== null && (left as any).__isVarRef !== true && ((left as any).__goValue === undefined || (left as any).__goType?.charCodeAt(0) !== 42) ? (left as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(left)).Write(new Uint8Array([108, 101, 102, 116]))
	let right = (makeHash!() as hash.Hash | null)
	await (right !== null && (right as any).__isVarRef !== true && ((right as any).__goValue === undefined || (right as any).__goType?.charCodeAt(0) !== 42) ? (right as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(right)).Write(prefix)
	await (right !== null && (right as any).__isVarRef !== true && ((right as any).__goValue === undefined || (right as any).__goType?.charCodeAt(0) !== 42) ? (right as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(right)).Write(new Uint8Array([114, 105, 103, 104, 116]))
	await $.println(name, "fork", bytes.Equal(await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Sum(null), await (left !== null && (left as any).__isVarRef !== true && ((left as any).__goValue === undefined || (left as any).__goType?.charCodeAt(0) !== 42) ? (left as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(left)).Sum(null)), bytes.Equal(((__goscriptAwait = (branch !== null && (branch as any).__isVarRef !== true && ((branch as any).__goValue === undefined || (branch as any).__goType?.charCodeAt(0) !== 42) ? (branch as Exclude<hash.Cloner, null>) : $.pointerValue<Exclude<hash.Cloner, null>>(branch)).Sum(null), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Slice<number>), await (right !== null && (right as any).__isVarRef !== true && ((right as any).__goValue === undefined || (right as any).__goType?.charCodeAt(0) !== 42) ? (right as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(right)).Sum(null)))

	// Reset affects only the selected branch, including after its Sum.
	void (__goscriptAwait = (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Reset(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	let empty = await $.pointerValue<Exclude<hash.Hash, null>>((makeHash!() as hash.Hash | null)).Sum(null)
	await $.println(name, "reset", bytes.Equal(await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Sum(null), empty), bytes.Equal(((__goscriptAwait = (branch !== null && (branch as any).__isVarRef !== true && ((branch as any).__goValue === undefined || (branch as any).__goType?.charCodeAt(0) !== 42) ? (branch as Exclude<hash.Cloner, null>) : $.pointerValue<Exclude<hash.Cloner, null>>(branch)).Sum(null), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Slice<number>), await (right !== null && (right as any).__isVarRef !== true && ((right as any).__goValue === undefined || (right as any).__goType?.charCodeAt(0) !== 42) ? (right as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(right)).Sum(null)))
	void (__goscriptAwait = (branch !== null && (branch as any).__isVarRef !== true && ((branch as any).__goValue === undefined || (branch as any).__goType?.charCodeAt(0) !== 42) ? (branch as Exclude<hash.Cloner, null>) : $.pointerValue<Exclude<hash.Cloner, null>>(branch)).Reset(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Write(new Uint8Array([110, 101, 119]))
	await $.println(name, "branch reset", bytes.Equal(((__goscriptAwait = (branch !== null && (branch as any).__isVarRef !== true && ((branch as any).__goValue === undefined || (branch as any).__goType?.charCodeAt(0) !== 42) ? (branch as Exclude<hash.Cloner, null>) : $.pointerValue<Exclude<hash.Cloner, null>>(branch)).Sum(null), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Slice<number>), empty), !bytes.Equal(await (h !== null && (h as any).__isVarRef !== true && ((h as any).__goValue === undefined || (h as any).__goType?.charCodeAt(0) !== 42) ? (h as Exclude<hash.Hash, null>) : $.pointerValue<Exclude<hash.Hash, null>>(h)).Sum(null), empty))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
