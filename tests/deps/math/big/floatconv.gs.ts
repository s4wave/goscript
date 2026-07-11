// Generated file based on floatconv.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as strings from "@goscript/strings/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import * as __goscript_accuracy_string from "./accuracy_string.gs.ts"

import * as __goscript_arith from "./arith.gs.ts"

import * as __goscript_float from "./float.gs.ts"

import * as __goscript_floatmarsh from "./floatmarsh.gs.ts"

import * as __goscript_ftoa from "./ftoa.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import * as __goscript_intconv from "./intconv.gs.ts"

import * as __goscript_intmarsh from "./intmarsh.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natconv from "./natconv.gs.ts"

import * as __goscript_natdiv from "./natdiv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_prime from "./prime.gs.ts"

import * as __goscript_rat from "./rat.gs.ts"

import * as __goscript_ratconv from "./ratconv.gs.ts"

import type * as __goscript_ratmarsh from "./ratmarsh.gs.ts"

import * as __goscript_roundingmode_string from "./roundingmode_string.gs.ts"

import * as __goscript_sqrt from "./sqrt.gs.ts"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/strings/index.js"
import "./accuracy_string.gs.ts"
import "./arith.gs.ts"
import "./float.gs.ts"
import "./floatmarsh.gs.ts"
import "./ftoa.gs.ts"
import "./int.gs.ts"
import "./intconv.gs.ts"
import "./intmarsh.gs.ts"
import "./nat.gs.ts"
import "./natconv.gs.ts"
import "./natdiv.gs.ts"
import "./natmul.gs.ts"
import "./prime.gs.ts"
import "./rat.gs.ts"
import "./ratconv.gs.ts"
import "./roundingmode_string.gs.ts"
import "./sqrt.gs.ts"

export var floatZero: $.VarRef<__goscript_float.Float>

export function __goscript_init_floatZero(): void {
	if (((floatZero) as any) === undefined) {
		floatZero = $.varRef($.markAsStructValue(new __goscript_float.Float()))
	}
}

export function __goscript_get_floatZero(): $.VarRef<__goscript_float.Float> {
	if (((floatZero) as any) === undefined) {
		__goscript_init_floatZero()
	}
	return floatZero
}

export function __goscript_set_floatZero(__goscriptValue: __goscript_float.Float): void {
	__goscript_get_floatZero().value = __goscriptValue
}

export let pow5tab: bigint[] = [1n, 5n, 25n, 125n, 625n, 3125n, 15625n, 78125n, 390625n, 1953125n, 9765625n, 48828125n, 244140625n, 1220703125n, 6103515625n, 30517578125n, 152587890625n, 762939453125n, 3814697265625n, 19073486328125n, 95367431640625n, 476837158203125n, 2384185791015625n, 11920928955078125n, 59604644775390625n, 298023223876953125n, 1490116119384765625n, 7450580596923828125n]

export function __goscript_set_pow5tab(__goscriptValue: bigint[]): void {
	pow5tab = __goscriptValue
}

export async function ParseFloat(s: string, base: number, prec: number, mode: __goscript_float.RoundingMode): globalThis.Promise<[__goscript_float.Float | $.VarRef<__goscript_float.Float> | null, number, $.GoError]> {
	let f: __goscript_float.Float | $.VarRef<__goscript_float.Float> | null = null as __goscript_float.Float | $.VarRef<__goscript_float.Float> | null
	let b: number = 0
	let err: $.GoError = null as $.GoError
	return __goscript_float.Float.prototype.Parse.call(__goscript_float.Float.prototype.SetMode.call(await __goscript_float.Float.prototype.SetPrec.call(new __goscript_float.Float(), prec), $.uint(mode, 8)), s, base)
}
