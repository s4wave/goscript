// Generated file based on ratconv.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import type * as __goscript_accuracy_string from "./accuracy_string.gs.ts"

import * as __goscript_arith from "./arith.gs.ts"

import type * as __goscript_float from "./float.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import * as __goscript_intconv from "./intconv.gs.ts"

import * as __goscript_intmarsh from "./intmarsh.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natconv from "./natconv.gs.ts"

import * as __goscript_natdiv from "./natdiv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_prime from "./prime.gs.ts"

import * as __goscript_rat from "./rat.gs.ts"

import * as __goscript_ratmarsh from "./ratmarsh.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "./arith.gs.ts"
import "./int.gs.ts"
import "./intconv.gs.ts"
import "./intmarsh.gs.ts"
import "./nat.gs.ts"
import "./natconv.gs.ts"
import "./natdiv.gs.ts"
import "./natmul.gs.ts"
import "./prime.gs.ts"
import "./rat.gs.ts"
import "./ratmarsh.gs.ts"

export function ratTok(ch: number): boolean {
	return strings.ContainsRune("+-/0123456789.eE", $.int(ch, 32))
}

export var ratZero: $.VarRef<__goscript_rat.Rat>

export function __goscript_init_ratZero(): void {
	if (((ratZero) as any) === undefined) {
		ratZero = $.varRef($.markAsStructValue(new __goscript_rat.Rat()))
	}
}

export function __goscript_get_ratZero(): $.VarRef<__goscript_rat.Rat> {
	if (((ratZero) as any) === undefined) {
		__goscript_init_ratZero()
	}
	return ratZero
}

export function __goscript_set_ratZero(__goscriptValue: __goscript_rat.Rat): void {
	__goscript_get_ratZero().value = __goscriptValue
}

export async function scanExponent(r: io.ByteScanner | null, base2ok: boolean, sepOk: boolean): globalThis.Promise<[bigint, number, $.GoError]> {
	let exp: bigint = 0n
	let base: number = 0
	let err: $.GoError = null! as $.GoError
	// one char look-ahead
	let __goscriptTuple0: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
	let ch = $.uint(__goscriptTuple0[0], 8)
	err = __goscriptTuple0[1]
	if (err != null) {
		if ($.comparableEqual(err, io.EOF)) {
			err = null
		}
		return [0n, 10, err]
	}

	// exponent char
	switch (ch) {
		case 101:
		case 69:
		{
			base = 10
			break
		}
		case 112:
		case 80:
		{
			if (base2ok) {
				base = 2
				break
			}
		}
		default:
		{
			await $.pointerValue<Exclude<io.ByteScanner, null>>(r).UnreadByte()
			return [0n, 10, null]
			break
		}
	}

	// sign
	let digits: $.Slice<number> = null! as $.Slice<number>
	let __goscriptTuple1: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
	ch = $.uint(__goscriptTuple1[0], 8)
	err = __goscriptTuple1[1]
	if ((err == null) && (($.uint(ch, 8) == $.uint(43, 8)) || ($.uint(ch, 8) == $.uint(45, 8)))) {
		if ($.uint(ch, 8) == $.uint(45, 8)) {
			digits = $.append(digits, $.uint(45, 8), $.byteSliceHint)
		}
		let __goscriptTuple2: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
		ch = $.uint(__goscriptTuple2[0], 8)
		err = __goscriptTuple2[1]
	}

	// prev encodes the previously seen char: it is one
	// of '_', '0' (a digit), or '.' (anything else). A
	// valid separator '_' may only occur after a digit.
	let prev = $.int(46, 32)
	let invalSep = false

	// exponent value
	let hasDigits = false
	while (err == null) {
		if (($.uint(48, 8) <= $.uint(ch, 8)) && ($.uint(ch, 8) <= $.uint(57, 8))) {
			digits = $.append(digits, $.uint(ch, 8), $.byteSliceHint)
			prev = $.int(48, 32)
			hasDigits = true
		} else {
			if (($.uint(ch, 8) == $.uint(95, 8)) && sepOk) {
				if ($.int(prev, 32) != $.int(48, 32)) {
					invalSep = true
				}
				prev = $.int(95, 32)
			} else {
				await $.pointerValue<Exclude<io.ByteScanner, null>>(r).UnreadByte()
				break
			}
		}
		let __goscriptTuple3: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
		ch = $.uint(__goscriptTuple3[0], 8)
		err = __goscriptTuple3[1]
	}

	if ($.comparableEqual(err, io.EOF)) {
		err = null
	}
	if ((err == null) && !hasDigits) {
		err = __goscript_natconv.errNoDigits
	}
	if (err == null) {
		let __goscriptTuple4: any = strconv.ParseInt($.bytesToString(digits), 10, 64)
		exp = __goscriptTuple4[0]
		err = __goscriptTuple4[1]
	}
	// other errors take precedence over invalid separators
	if ((err == null) && (invalSep || ($.int(prev, 32) == $.int(95, 32)))) {
		err = __goscript_natconv.errInvalSep
	}

	return [exp, base, err]
}
