// Generated file based on package_import_bytes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	// Test basic byte slice operations
	let b1: $.Slice<number> = new Uint8Array([104, 101, 108, 108, 111])
	let b2: $.Slice<number> = new Uint8Array([119, 111, 114, 108, 100])

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
	let slices: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([b1, b2])
	let joined: $.Slice<number> = bytes.Join(slices, new Uint8Array([32]))
	await $.println("Joined:", $.bytesToString(joined))

	// Test Split
	let split: $.Slice<$.Slice<number>> = bytes.Split(joined, new Uint8Array([32]))
	await $.println("Split result length:", $.len(split))
	if ($.len(split) == 2) {
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
	let whitespace: $.Slice<number> = new Uint8Array([32, 32, 104, 101, 108, 108, 111, 32, 32])
	let trimmed: $.Slice<number> = bytes.TrimSpace(whitespace)
	await $.println("Trimmed:", $.bytesToString(trimmed))

	// Test ToUpper and ToLower
	let upper: $.Slice<number> = bytes.ToUpper(b1)
	let lower: $.Slice<number> = bytes.ToLower(upper)
	await $.println("Upper:", $.bytesToString(upper))
	await $.println("Lower:", $.bytesToString(lower))

	// Test Repeat
	let repeated: $.Slice<number> = bytes.Repeat(new Uint8Array([120]), 3)
	await $.println("Repeated:", $.bytesToString(repeated))

	// Test Count
	let count = bytes.Count(new Uint8Array([98, 97, 110, 97, 110, 97]), new Uint8Array([97]))
	await $.println("Count of 'a' in 'banana':", count)

	// Test Replace
	let replaced: $.Slice<number> = bytes.Replace(new Uint8Array([104, 101, 108, 108, 111, 32, 104, 101, 108, 108, 111]), new Uint8Array([104, 101, 108, 108, 111]), new Uint8Array([104, 105]), 1)
	await $.println("Replace result:", $.bytesToString(replaced))

	// Test ReplaceAll
	let replacedAll: $.Slice<number> = bytes.ReplaceAll(new Uint8Array([104, 101, 108, 108, 111, 32, 104, 101, 108, 108, 111]), new Uint8Array([104, 101, 108, 108, 111]), new Uint8Array([104, 105]))
	await $.println("ReplaceAll result:", $.bytesToString(replacedAll))

	// Test Buffer
	let buf: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
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
	let ptr: bytes.Buffer | $.VarRef<bytes.Buffer> | null = buf
	bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(ptr), new Uint8Array([112, 116, 114]))
	await $.println("Pointer buffer content:", bytes.Buffer.prototype.String.call($.pointerValue<bytes.Buffer>(ptr)))
	bytes.Buffer.prototype.Reset.call($.pointerValue<bytes.Buffer>(ptr))

	// Test Buffer as Reader interface through an address expression.
	buf.value.WriteString("abc")
	let multi = io.MultiReader($.pointerValueOrNil($.interfaceValue<io.Reader | null>(buf, "*bytes.Buffer", { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" }))!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader(new Uint8Array([100, 101])), "*bytes.Reader", { kind: $.TypeKind.Pointer, elemType: "bytes.Reader" }))!)
	data = $.makeSlice<number>(5, undefined, "byte")
	let __goscriptTuple0: any = await $.pointerValue<Exclude<io.Reader, null>>(multi).Read(data)
	n = __goscriptTuple0[0]
	await $.println("MultiReader read", n, "bytes:", $.bytesToString($.goSlice(data, undefined, n)))

	let reader: bytes.Reader | $.VarRef<bytes.Reader> | null = bytes.NewReader(new Uint8Array([114, 101, 97, 100, 101, 114]))
	let at: $.Slice<number> = $.makeSlice<number>(3, undefined, "byte")
	let off: bigint = 2n
	let __goscriptTuple1: any = bytes.Reader.prototype.ReadAt.call($.pointerValue<bytes.Reader>(reader), at, off)
	n = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	await $.println("Reader ReadAt", n, "bytes:", $.bytesToString($.goSlice(at, undefined, n)), "err:", err == null)
	let __goscriptTuple2: any = bytes.Reader.prototype.Seek.call($.pointerValue<bytes.Reader>(reader), off, io.SeekStart)
	let pos = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("Reader Seek", pos, "err:", err == null)
	await $.println("Reader Size", bytes.Reader.prototype.Size.call($.pointerValue<bytes.Reader>(reader)))
	let writeDst: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let __goscriptTuple3: any = await bytes.Reader.prototype.WriteTo.call($.pointerValue<bytes.Reader>(reader), $.pointerValueOrNil($.interfaceValue<io.Writer | null>(writeDst, "*bytes.Buffer", { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" }))!)
	let n64 = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	await $.println("Reader WriteTo", n64, "bytes:", writeDst.value.String(), "err:", err == null)

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
