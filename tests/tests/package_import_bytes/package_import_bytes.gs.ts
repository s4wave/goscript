// Generated file based on package_import_bytes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as io from "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	// Test basic byte slice operations
	let b1 = new Uint8Array([104, 101, 108, 108, 111])
	let b2 = new Uint8Array([119, 111, 114, 108, 100])

	// Test Equal
	if (bytes.Equal(b1, b1)) {
		await $.println("Equal works correctly")
	}

	// Test Compare
	let result = bytes.Compare(b1, b2)
	if (result < 0) {
		await $.println("Compare works: hello < world")
	}

	// Test Contains
	if (bytes.Contains(b1, new Uint8Array([101, 108, 108]))) {
		await $.println("Contains works correctly")
	}

	// Test Index
	let idx = bytes.Index(b1, new Uint8Array([108, 108]))
	if (idx == 2) {
		await $.println("Index works correctly, found at position:", idx)
	}

	// Test Join
	let slices = $.arrayToSlice<$.Slice<number>>([b1, b2])
	let joined = bytes.Join(slices, new Uint8Array([32]))
	await $.println("Joined:", $.bytesToString(joined))

	// Test Split
	let split = bytes.Split(joined, new Uint8Array([32]))
	await $.println("Split result length:", $.sliceLen(split))
	if ($.sliceLen(split) == 2) {
		await $.println("Split works correctly")
	}

	// Test HasPrefix and HasSuffix
	if (bytes.HasPrefix(b1, new Uint8Array([104, 101]))) {
		await $.println("HasPrefix works correctly")
	}

	if (bytes.HasSuffix(b1, new Uint8Array([108, 111]))) {
		await $.println("HasSuffix works correctly")
	}

	// Test Trim functions
	let whitespace = new Uint8Array([32, 32, 104, 101, 108, 108, 111, 32, 32])
	let trimmed = bytes.TrimSpace(whitespace)
	await $.println("Trimmed:", $.bytesToString(trimmed))

	// Test ToUpper and ToLower
	let upper = bytes.ToUpper(b1)
	let lower = bytes.ToLower(upper)
	await $.println("Upper:", $.bytesToString(upper))
	await $.println("Lower:", $.bytesToString(lower))

	// Test Repeat
	let repeated = bytes.Repeat(new Uint8Array([120]), 3)
	await $.println("Repeated:", $.bytesToString(repeated))

	// Test Count
	let count = bytes.Count(new Uint8Array([98, 97, 110, 97, 110, 97]), new Uint8Array([97]))
	await $.println("Count of 'a' in 'banana':", count)

	// Test Replace
	let replaced = bytes.Replace(new Uint8Array([104, 101, 108, 108, 111, 32, 104, 101, 108, 108, 111]), new Uint8Array([104, 101, 108, 108, 111]), new Uint8Array([104, 105]), 1)
	await $.println("Replace result:", $.bytesToString(replaced))

	// Test ReplaceAll
	let replacedAll = bytes.ReplaceAll(new Uint8Array([104, 101, 108, 108, 111, 32, 104, 101, 108, 108, 111]), new Uint8Array([104, 101, 108, 108, 111]), new Uint8Array([104, 105]))
	await $.println("ReplaceAll result:", $.bytesToString(replacedAll))

	// Test Buffer
	let buf = $.varRef($.markAsStructValue(new bytes.Buffer()))
	buf.value.WriteString("Hello ")
	buf.value.WriteString("World")
	await $.println("Buffer content:", buf.value.String())
	await $.println("Buffer length:", buf.value.Len())

	// Test Buffer Read
	let data: $.Slice<number> = $.makeSlice<number>(5, undefined, "byte")
	let [n, ] = buf.value.Read(data)
	await $.println("Read", n, "bytes:", $.bytesToString(data))

	// Test Buffer Reset
	buf.value.Reset()
	await $.println("Buffer after reset, length:", buf.value.Len())

	// Test Buffer pointer receiver calls through an address-taken pointer.
	let ptr = buf
	void (ptr !== null && (ptr as any).__isVarRef !== true && (ptr as any).__goValue === undefined ? ((ptr as any) as bytes.Buffer).Write(new Uint8Array([112, 116, 114])) : bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(ptr), new Uint8Array([112, 116, 114])))
	await $.println("Pointer buffer content:", (ptr !== null && (ptr as any).__isVarRef !== true && (ptr as any).__goValue === undefined ? ((ptr as any) as bytes.Buffer).String() : bytes.Buffer.prototype.String.call($.pointerValue<bytes.Buffer>(ptr))))
	void (ptr !== null && (ptr as any).__isVarRef !== true && (ptr as any).__goValue === undefined ? ((ptr as any) as bytes.Buffer).Reset() : bytes.Buffer.prototype.Reset.call($.pointerValue<bytes.Buffer>(ptr)))

	// Test Buffer as Reader interface through an address expression.
	buf.value.WriteString("abc")
	let multi = io.MultiReader($.pointerValueOrNil($.interfaceValue<io.Reader | null>(buf, "*bytes.Buffer", __goscriptStatic0()))!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader(new Uint8Array([100, 101])), "*bytes.Reader", __goscriptStatic1()))!)
	data = $.makeSlice<number>(5, undefined, "byte")
	let __goscriptTuple0: any = await (multi !== null && (multi as any).__isVarRef !== true && ((multi as any).__goValue === undefined || (multi as any).__goType?.charCodeAt(0) !== 42) ? (multi as Exclude<io.Reader, null>) : $.pointerValue<Exclude<io.Reader, null>>(multi)).Read(data)
	n = __goscriptTuple0[0]
	await $.println("MultiReader read", n, "bytes:", $.bytesToString($.goSlice(data, undefined, n)))

	let reader = bytes.NewReader(new Uint8Array([114, 101, 97, 100, 101, 114]))
	let at = $.makeSlice<number>(3, undefined, "byte")
	let off = 2n
	let __goscriptTuple1: any = (reader !== null && (reader as any).__isVarRef !== true && (reader as any).__goValue === undefined ? ((reader as any) as bytes.Reader).ReadAt(at, off) : bytes.Reader.prototype.ReadAt.call($.pointerValue<bytes.Reader>(reader), at, off))
	n = __goscriptTuple1[0]
	let err: $.GoError = __goscriptTuple1[1]
	await $.println("Reader ReadAt", n, "bytes:", $.bytesToString($.goSlice(at, undefined, n)), "err:", err == null)
	let __goscriptTuple2: any = (reader !== null && (reader as any).__isVarRef !== true && (reader as any).__goValue === undefined ? ((reader as any) as bytes.Reader).Seek(off, 0) : bytes.Reader.prototype.Seek.call($.pointerValue<bytes.Reader>(reader), off, 0))
	let pos: bigint = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("Reader Seek", pos, "err:", err == null)
	await $.println("Reader Size", (reader !== null && (reader as any).__isVarRef !== true && (reader as any).__goValue === undefined ? ((reader as any) as bytes.Reader).Size() : bytes.Reader.prototype.Size.call($.pointerValue<bytes.Reader>(reader))))
	let writeDst = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let __goscriptTuple3: any = await (reader !== null && (reader as any).__isVarRef !== true && (reader as any).__goValue === undefined ? ((reader as any) as bytes.Reader).WriteTo($.pointerValueOrNil($.interfaceValue<io.Writer | null>(writeDst, "*bytes.Buffer", __goscriptStatic0()))!) : bytes.Reader.prototype.WriteTo.call($.pointerValue<bytes.Reader>(reader), $.pointerValueOrNil($.interfaceValue<io.Writer | null>(writeDst, "*bytes.Buffer", __goscriptStatic0()))!))
	let n64: bigint = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	await $.println("Reader WriteTo", n64, "bytes:", writeDst.value.String(), "err:", err == null)

	// Test HasPrefix and HasSuffix on windows into a larger slice, which
	// compare only the prefix or suffix bytes of the window.
	let doc = new Uint8Array([60, 112, 62, 111, 110, 101, 60, 47, 112, 62, 60, 112, 62, 116, 119, 111, 60, 47, 112, 62])
	let win = $.goSlice(doc, 3, 13)
	await $.println("HasPrefix window:", bytes.HasPrefix(win, new Uint8Array([111, 110, 101, 60, 47, 112, 62])), bytes.HasPrefix(win, new Uint8Array([60, 112, 62])))
	await $.println("HasSuffix window:", bytes.HasSuffix(win, new Uint8Array([60, 112, 62])), bytes.HasSuffix(win, new Uint8Array([116, 119, 111])))
	await $.println("HasPrefix longer:", bytes.HasPrefix($.goSlice(win, undefined, 2), new Uint8Array([111, 110, 101])), bytes.HasSuffix($.goSlice(win, 8, undefined), new Uint8Array([60, 47, 112, 62, 60, 112, 62])))
	let nilBytes: $.Slice<number> = null! as $.Slice<number>
	await $.println("HasPrefix nil:", bytes.HasPrefix(nilBytes, null), bytes.HasPrefix(nilBytes, new Uint8Array([97])), bytes.HasPrefix(win, null))
	await $.println("HasSuffix nil:", bytes.HasSuffix(nilBytes, null), bytes.HasSuffix(nilBytes, new Uint8Array([97])), bytes.HasSuffix(win, new Uint8Array([]) as $.Slice<number>))
	let __goscriptTuple4: any = bytes.CutPrefix(win, new Uint8Array([111, 110, 101]))
	let rest: $.Slice<number> = __goscriptTuple4[0]
	let ok: boolean = __goscriptTuple4[1]
	await $.println("CutPrefix window:", $.bytesToString(rest), ok)
	let __goscriptTuple5: any = bytes.CutSuffix(win, new Uint8Array([60, 112, 62]))
	rest = __goscriptTuple5[0]
	ok = __goscriptTuple5[1]
	await $.println("CutSuffix window:", $.bytesToString(rest), ok)
	await $.println("TrimPrefix/TrimSuffix window:", $.bytesToString(bytes.TrimSuffix(bytes.TrimPrefix(win, new Uint8Array([111, 110, 101])), new Uint8Array([60, 112, 62]))))

	await $.println("test finished")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Buffer"), "bytes.Buffer", () => [$.methodSignature("Available", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("AvailableBuffer", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Next", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Peek", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadBytes", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]], true), $.methodSignature("ReadFrom", [["r", "io.Reader"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true), $.methodSignature("ReadRune", [], [["r", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadString", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.basicType("string")], ["err", "error"]], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Truncate", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Reader"), "bytes.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

if ($.isMainScript(import.meta)) {
	await main()
}
