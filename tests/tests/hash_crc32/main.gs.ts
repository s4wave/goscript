// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as encoding from "@goscript/encoding/index.js"

import * as hash from "@goscript/hash/index.js"

import * as crc32 from "@goscript/hash/crc32/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/encoding/index.js"
import "@goscript/hash/index.js"
import "@goscript/hash/crc32/index.js"
import "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	if (((((crc32.Size as number) != 4) || ((crc32.IEEE as number) != 0xedb88320)) || ((crc32.Castagnoli as number) != 0x82f63b78)) || ((crc32.Koopman as number) != 0xeb31d82e)) {
		$.panic("public constants")
	}
	if ((crc32.MakeTable($.uint(crc32.IEEE, 32)) != crc32.IEEETable) || (crc32.MakeTable($.uint(crc32.IEEE, 32)) != crc32.MakeTable($.uint(crc32.IEEE, 32)))) {
		$.panic("IEEE table reuse")
	}
	if (crc32.MakeTable($.uint(crc32.Castagnoli, 32)) != crc32.MakeTable($.uint(crc32.Castagnoli, 32))) {
		$.panic("Castagnoli table reuse")
	}
	if (crc32.MakeTable($.uint(crc32.Koopman, 32)) == crc32.MakeTable($.uint(crc32.Koopman, 32))) {
		$.panic("custom tables unexpectedly reused")
	}

	let payload: $.Slice<number> = $.makeSlice<number>(257, undefined, "byte")
	for (let __goscriptRangeTarget0 = payload, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		payload![i] = $.uint($.uint(((i * 31) + (Math.trunc(i / 3))) + 7, 8), 8)
	}

	let tables: $.Slice<{"name": string, "table": $.VarRef<crc32.Table> | null}> = $.arrayToSlice<{"name": string, "table": $.VarRef<crc32.Table> | null}>([{name: "ieee", table: crc32.IEEETable}, {name: "castagnoli", table: crc32.MakeTable($.uint(crc32.Castagnoli, 32))}, {name: "koopman", table: crc32.MakeTable($.uint(crc32.Koopman, 32))}, {name: "custom", table: crc32.MakeTable($.uint(0xd5828281, 32))}])
	let lengths: $.Slice<number> = $.arrayToSlice<number>([0, 1, 7, 8, 9, 15, 16, 17, $.len(payload)])
	for (let __goscriptRangeTarget2 = tables, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let tc = __goscriptRangeTarget2![__rangeIndex]
		for (let __goscriptRangeTarget1 = lengths, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let length = __goscriptRangeTarget1![__rangeIndex]
			let data: $.Slice<number> = $.goSlice(payload, undefined, length)
			let oneShot = $.uint(crc32.Checksum(data, tc.table), 32)
			let split = Math.trunc(length / 2)
			let updated = $.uint(crc32.Update($.uint(crc32.Update($.uint(0, 32), tc.table, $.goSlice(data, undefined, split)), 32), tc.table, $.goSlice(data, split, undefined)), 32)
			let stream = crc32.New(tc.table)
			{
				let [n, err] = await $.pointerValue<Exclude<hash.Hash32, null>>(stream).Write($.goSlice(data, undefined, split))
				if ((n != split) || (err != null)) {
					$.panic("first stream write")
				}
			}
			{
				let [n, err] = await $.pointerValue<Exclude<hash.Hash32, null>>(stream).Write($.goSlice(data, split, undefined))
				if ((n != (length - split)) || (err != null)) {
					$.panic("second stream write")
				}
			}
			if (($.uint(updated, 32) != $.uint(oneShot, 32)) || ($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(stream).Sum32(), 32) != $.uint(oneShot, 32))) {
				$.panic("checksum mismatch")
			}
			$.println(tc.name, length, $.uint(oneShot, 32))
		}
	}

	if ($.uint(crc32.ChecksumIEEE(payload), 32) != $.uint(crc32.Checksum(payload, crc32.IEEETable), 32)) {
		$.panic("ChecksumIEEE")
	}
	let ieee = crc32.NewIEEE()
	{
		let [, err] = await $.pointerValue<Exclude<hash.Hash32, null>>(ieee).Write($.goSlice(payload, undefined, 113))
		if (err != null) {
			$.panic($.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
	}
	{
		let [, err] = await $.pointerValue<Exclude<hash.Hash32, null>>(ieee).Write($.goSlice(payload, 113, undefined))
		if (err != null) {
			$.panic($.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
	}
	if ($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(ieee).Sum32(), 32) != $.uint(crc32.ChecksumIEEE(payload), 32)) {
		$.panic("NewIEEE")
	}

	let prefix: $.Slice<number> = new Uint8Array([9, 8, 7]) as $.Slice<number>
	let summed: $.Slice<number> = await $.pointerValue<Exclude<hash.Hash32, null>>(ieee).Sum($.goSlice(prefix, undefined, $.len(prefix), $.len(prefix)))
	if (((($.len(summed) != ($.len(prefix) + crc32.Size)) || ($.uint($.arrayIndex(summed!, 0), 8) != $.uint(9, 8))) || ($.uint($.arrayIndex(summed!, 1), 8) != $.uint(8, 8))) || ($.uint($.arrayIndex(summed!, 2), 8) != $.uint(7, 8))) {
		$.panic("prefix-preserving Sum")
	}
	$.println("sum", $.len(summed), $.uint($.arrayIndex(summed!, 3), 8), $.uint($.arrayIndex(summed!, 4), 8), $.uint($.arrayIndex(summed!, 5), 8), $.uint($.arrayIndex(summed!, 6), 8))

	let [marshaler, ok] = $.typeAssertTuple<encoding.BinaryMarshaler | null>(ieee, "encoding.BinaryMarshaler")
	if (!ok) {
		$.panic("BinaryMarshaler")
	}
	let __goscriptTuple0: any = await $.pointerValue<Exclude<encoding.BinaryMarshaler, null>>(marshaler).MarshalBinary()
	let state: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.panic($.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}
	let __goscriptTuple1: any = $.typeAssertTuple<encoding.BinaryAppender | null>(ieee, "encoding.BinaryAppender")
	let appender = __goscriptTuple1[0]
	ok = __goscriptTuple1[1]
	if (!ok) {
		$.panic("BinaryAppender")
	}
	let __goscriptTuple2: any = await $.pointerValue<Exclude<encoding.BinaryAppender, null>>(appender).AppendBinary(new Uint8Array([4, 5]) as $.Slice<number>)
	let appended: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if ((((err != null) || ($.len(appended) != ($.len(state) + 2))) || ($.uint($.arrayIndex(appended!, 0), 8) != $.uint(4, 8))) || ($.uint($.arrayIndex(appended!, 1), 8) != $.uint(5, 8))) {
		$.panic("AppendBinary")
	}
	for (let __goscriptRangeTarget3 = state, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
		if ($.uint($.arrayIndex(appended!, i + 2), 8) != $.uint($.arrayIndex(state!, i), 8)) {
			$.panic("AppendBinary state")
		}
	}
	$.println("state", $.len(state), $.uint($.arrayIndex(state!, 0), 8), $.uint($.arrayIndex(state!, 1), 8), $.uint($.arrayIndex(state!, 2), 8), $.uint($.arrayIndex(state!, 3), 8))

	let restored = crc32.NewIEEE()
	let __goscriptTuple3: any = $.typeAssertTuple<encoding.BinaryUnmarshaler | null>(restored, "encoding.BinaryUnmarshaler")
	let unmarshaler = __goscriptTuple3[0]
	ok = __goscriptTuple3[1]
	if (!ok) {
		$.panic("BinaryUnmarshaler")
	}
	{
		let __goscriptShadow0 = await $.pointerValue<Exclude<encoding.BinaryUnmarshaler, null>>(unmarshaler).UnmarshalBinary(state)
		if (__goscriptShadow0 != null) {
			$.panic($.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
		}
	}
	if ($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(restored).Sum32(), 32) != $.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(ieee).Sum32(), 32)) {
		$.panic("restored state")
	}
	{
		let [, __goscriptShadow1] = await $.pointerValue<Exclude<hash.Hash32, null>>(restored).Write(new Uint8Array([116, 97, 105, 108]))
		if (__goscriptShadow1 != null) {
			$.panic($.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow1).Error())
		}
	}
	if ($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(restored).Sum32(), 32) != $.uint(crc32.Update($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(ieee).Sum32(), 32), crc32.IEEETable, new Uint8Array([116, 97, 105, 108])), 32)) {
		$.panic("restored continuation")
	}

	let beforeInvalid = $.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(restored).Sum32(), 32)
	let invalidCases: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([new Uint8Array([1, 2, 3]) as $.Slice<number>, new Uint8Array([99, 114, 99, 1]) as $.Slice<number>])
	for (let __goscriptRangeTarget4 = invalidCases, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let invalid = __goscriptRangeTarget4![__rangeIndex]
		let __goscriptShadow2 = await $.pointerValue<Exclude<encoding.BinaryUnmarshaler, null>>(unmarshaler).UnmarshalBinary(invalid)
		if (__goscriptShadow2 == null) {
			$.panic("invalid state accepted")
		}
		$.println("invalid", $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow2).Error())
		if ($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(restored).Sum32(), 32) != $.uint(beforeInvalid, 32)) {
			$.panic("invalid state changed hash")
		}
	}
	let other = crc32.New(crc32.MakeTable($.uint(crc32.Castagnoli, 32)))
	let otherUnmarshaler = $.mustTypeAssert<encoding.BinaryUnmarshaler | null>(other, "encoding.BinaryUnmarshaler")
	{
		let __goscriptShadow3 = await $.pointerValue<Exclude<encoding.BinaryUnmarshaler, null>>(otherUnmarshaler).UnmarshalBinary(state)
		if (__goscriptShadow3 == null) {
			$.panic("table mismatch accepted")
		} else {
			$.println("invalid", $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow3).Error())
		}
	}

	let cloneSource = crc32.NewIEEE()
	await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Write(new Uint8Array([112, 114, 101, 102, 105, 120]))
	let __goscriptTuple4: any = $.typeAssertTuple<hash.Cloner | null>(cloneSource, "hash.Cloner")
	let cloner = __goscriptTuple4[0]
	ok = __goscriptTuple4[1]
	if (!ok) {
		$.panic("Cloner")
	}
	let __goscriptTuple5: any = await $.pointerValue<Exclude<hash.Cloner, null>>(cloner).Clone()
	let clonedHash = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	if (err != null) {
		$.panic($.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}
	let clone = $.mustTypeAssert<hash.Hash32 | null>(clonedHash, "hash.Hash32")
	await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Write(new Uint8Array([108, 101, 102, 116]))
	await $.pointerValue<Exclude<hash.Hash32, null>>(clone).Write(new Uint8Array([114, 105, 103, 104, 116]))
	if (($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Sum32(), 32) != $.uint(crc32.ChecksumIEEE(new Uint8Array([112, 114, 101, 102, 105, 120, 108, 101, 102, 116])), 32)) || ($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(clone).Sum32(), 32) != $.uint(crc32.ChecksumIEEE(new Uint8Array([112, 114, 101, 102, 105, 120, 114, 105, 103, 104, 116])), 32))) {
		$.panic("clone independence")
	}
	$.println("clone", $.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Sum32(), 32), $.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(clone).Sum32(), 32))

	await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Reset()
	if ((($.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Sum32(), 32) != $.uint(0, 32)) || (await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Size() != crc32.Size)) || (await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).BlockSize() != 1)) {
		$.panic("Reset/Size/BlockSize")
	}
	$.println("reset", $.uint(await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Sum32(), 32), await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).Size(), await $.pointerValue<Exclude<hash.Hash32, null>>(cloneSource).BlockSize())
}

if ($.isMainScript(import.meta)) {
	await main()
}
