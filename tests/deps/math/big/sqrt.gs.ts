// Generated file based on sqrt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as sync from "@goscript/sync/index.js"

import type * as fmt from "@goscript/fmt/index.js"

import type * as io from "@goscript/io/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import * as __goscript_accuracy_string from "./accuracy_string.gs.ts"

import * as __goscript_arith from "./arith.gs.ts"

import * as __goscript_float from "./float.gs.ts"

import * as __goscript_floatconv from "./floatconv.gs.ts"

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

import type * as __goscript_ratconv from "./ratconv.gs.ts"

import type * as __goscript_ratmarsh from "./ratmarsh.gs.ts"

import * as __goscript_roundingmode_string from "./roundingmode_string.gs.ts"
import "@goscript/math/index.js"
import "@goscript/sync/index.js"
import "./accuracy_string.gs.ts"
import "./arith.gs.ts"
import "./float.gs.ts"
import "./floatconv.gs.ts"
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
import "./roundingmode_string.gs.ts"

export let threeOnce: $.VarRef<{"Once": sync.Once, "v": __goscript_float.Float | $.VarRef<__goscript_float.Float> | null}> = $.varRef({"Once": $.markAsStructValue(new sync.Once()), "v": null})

export function __goscript_set_threeOnce(__goscriptValue: {"Once": sync.Once, "v": __goscript_float.Float | $.VarRef<__goscript_float.Float> | null}): void {
	threeOnce.value = __goscriptValue
}

export async function three(): globalThis.Promise<__goscript_float.Float | $.VarRef<__goscript_float.Float> | null> {
	await threeOnce.value.Once.Do($.functionValue(async (): globalThis.Promise<void> => {
		threeOnce.value.v = await __goscript_float.NewFloat(3.0)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return threeOnce.value.v
}

export function newFloat(prec2: number): __goscript_float.Float | $.VarRef<__goscript_float.Float> | null {
	let z: __goscript_float.Float | $.VarRef<__goscript_float.Float> | null = new __goscript_float.Float()
	// nat.make ensures the slice length is > 0
	$.pointerValue<__goscript_float.Float>(z).mant = (__goscript_nat.nat_make($.pointerValue<__goscript_float.Float>(z).mant, $.int(Math.trunc(prec2 / 64)) * 2) as __goscript_nat.nat)
	return z
}
