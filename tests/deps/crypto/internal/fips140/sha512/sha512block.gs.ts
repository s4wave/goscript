// Generated file based on sha512block.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"

import type * as hash from "@goscript/hash/index.js"

import * as __goscript_sha512 from "./sha512.gs.ts"
import "@goscript/math/bits/index.js"
import "./sha512.gs.ts"

export var _K: bigint[]

export function __goscript_init__K(): void {
	if (((_K) as any) === undefined) {
		_K = [4794697086780616226n, 8158064640168781261n, 13096744586834688815n, 16840607885511220156n, 4131703408338449720n, 6480981068601479193n, 10538285296894168987n, 12329834152419229976n, 15566598209576043074n, 1334009975649890238n, 2608012711638119052n, 6128411473006802146n, 8268148722764581231n, 9286055187155687089n, 11230858885718282805n, 13951009754708518548n, 16472876342353939154n, 17275323862435702243n, 1135362057144423861n, 2597628984639134821n, 3308224258029322869n, 5365058923640841347n, 6679025012923562964n, 8573033837759648693n, 10970295158949994411n, 12119686244451234320n, 12683024718118986047n, 13788192230050041572n, 14330467153632333762n, 15395433587784984357n, 489312712824947311n, 1452737877330783856n, 2861767655752347644n, 3322285676063803686n, 5560940570517711597n, 5996557281743188959n, 7280758554555802590n, 8532644243296465576n, 9350256976987008742n, 10552545826968843579n, 11727347734174303076n, 12113106623233404929n, 14000437183269869457n, 14369950271660146224n, 15101387698204529176n, 15463397548674623760n, 17586052441742319658n, 1182934255886127544n, 1847814050463011016n, 2177327727835720531n, 2830643537854262169n, 3796741975233480872n, 4115178125766777443n, 5681478168544905931n, 6601373596472566643n, 7507060721942968483n, 8399075790359081724n, 8693463985226723168n, 9568029438360202098n, 10144078919501101548n, 10430055236837252648n, 11840083180663258601n, 13761210420658862357n, 14299343276471374635n, 14566680578165727644n, 15097957966210449927n, 16922976911328602910n, 17689382322260857208n, 500013540394364858n, 748580250866718886n, 1242879168328830382n, 1977374033974150939n, 2944078676154940804n, 3659926193048069267n, 4368137639120453308n, 4836135668995329356n, 5532061633213252278n, 6448918945643986474n, 6902733635092675308n, 7801388544844847127n]
	}
}

export function __goscript_get__K(): bigint[] {
	if (((_K) as any) === undefined) {
		__goscript_init__K()
	}
	return _K
}

export function __goscript_set__K(__goscriptValue: bigint[]): void {
	_K = __goscriptValue
}

export function blockGeneric(dig: __goscript_sha512.Digest | $.VarRef<__goscript_sha512.Digest> | null, p: $.Slice<number>): void {
	let w: bigint[] = Array.from({ length: 80 }, () => 0n)
	let h0 = $.arrayIndex($.pointerValue<__goscript_sha512.Digest>(dig).h, 0)
	let h1 = $.arrayIndex($.pointerValue<__goscript_sha512.Digest>(dig).h, 1)
	let h2 = $.arrayIndex($.pointerValue<__goscript_sha512.Digest>(dig).h, 2)
	let h3 = $.arrayIndex($.pointerValue<__goscript_sha512.Digest>(dig).h, 3)
	let h4 = $.arrayIndex($.pointerValue<__goscript_sha512.Digest>(dig).h, 4)
	let h5 = $.arrayIndex($.pointerValue<__goscript_sha512.Digest>(dig).h, 5)
	let h6 = $.arrayIndex($.pointerValue<__goscript_sha512.Digest>(dig).h, 6)
	let h7 = $.arrayIndex($.pointerValue<__goscript_sha512.Digest>(dig).h, 7)
	while ($.len(p) >= 128) {
		let a = h0
		let b = h1
		let c = h2
		let d = h3
		let e = h4
		let f = h5
		let g = h6
		let h = h7

		for (let i = 0; i < 80; i++) {
			if (i < 16) {
				let j = i * 8
				w[i] = $.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Mul($.uint64($.arrayIndex(p!, j)), (2 ** 56))), ($.uint64Mul($.uint64($.arrayIndex(p!, j + 1)), (2 ** 48))))), ($.uint64Mul($.uint64($.arrayIndex(p!, j + 2)), (2 ** 40))))), ($.uint64Mul($.uint64($.arrayIndex(p!, j + 3)), (2 ** 32))))), ($.uint64Shl($.uint64($.arrayIndex(p!, j + 4)), 24n)))), ($.uint64Shl($.uint64($.arrayIndex(p!, j + 5)), 16n)))), ($.uint64Shl($.uint64($.arrayIndex(p!, j + 6)), 8n)))), $.uint64($.arrayIndex(p!, j + 7)))
			} else {
				let v1 = $.arrayIndex(w, i - 2)
				let t1 = $.uint64Xor(($.uint64Xor(bits.RotateLeft64(v1, -19), bits.RotateLeft64(v1, -61))), ($.uint64Shr(v1, 6n)))
				let v2 = $.arrayIndex(w, i - 15)
				let t2 = $.uint64Xor(($.uint64Xor(bits.RotateLeft64(v2, -1), bits.RotateLeft64(v2, -8))), ($.uint64Shr(v2, 7n)))

				w[i] = $.uint64Add(($.uint64Add(($.uint64Add(t1, $.arrayIndex(w, i - 7))), t2)), $.arrayIndex(w, i - 16))
			}

			let t1 = $.uint64Add(($.uint64Add(($.uint64Add(($.uint64Add(h, ($.uint64Xor(($.uint64Xor(bits.RotateLeft64(e, -14), bits.RotateLeft64(e, -18))), bits.RotateLeft64(e, -41))))), ($.uint64Xor(($.uint64And(e, f)), ($.uint64And($.uint64Xor(e, -1n), g)))))), $.arrayIndex(__goscript_get__K(), i))), $.arrayIndex(w, i))

			let t2 = $.uint64Add(($.uint64Xor(($.uint64Xor(bits.RotateLeft64(a, -28), bits.RotateLeft64(a, -34))), bits.RotateLeft64(a, -39))), ($.uint64Xor(($.uint64Xor(($.uint64And(a, b)), ($.uint64And(a, c)))), ($.uint64And(b, c)))))

			h = g
			g = f
			f = e
			e = $.uint64Add(d, t1)
			d = c
			c = b
			b = a
			a = $.uint64Add(t1, t2)
		}

		h0 = $.uint64Add(h0, a)
		h1 = $.uint64Add(h1, b)
		h2 = $.uint64Add(h2, c)
		h3 = $.uint64Add(h3, d)
		h4 = $.uint64Add(h4, e)
		h5 = $.uint64Add(h5, f)
		h6 = $.uint64Add(h6, g)
		h7 = $.uint64Add(h7, h)

		p = $.goSlice(p, 128, undefined)
	}

	let __goscriptAssign0_0: bigint = h0
	let __goscriptAssign0_1: bigint = h1
	let __goscriptAssign0_2: bigint = h2
	let __goscriptAssign0_3: bigint = h3
	let __goscriptAssign0_4: bigint = h4
	let __goscriptAssign0_5: bigint = h5
	let __goscriptAssign0_6: bigint = h6
	let __goscriptAssign0_7: bigint = h7
	$.pointerValue<__goscript_sha512.Digest>(dig).h[0] = __goscriptAssign0_0
	$.pointerValue<__goscript_sha512.Digest>(dig).h[1] = __goscriptAssign0_1
	$.pointerValue<__goscript_sha512.Digest>(dig).h[2] = __goscriptAssign0_2
	$.pointerValue<__goscript_sha512.Digest>(dig).h[3] = __goscriptAssign0_3
	$.pointerValue<__goscript_sha512.Digest>(dig).h[4] = __goscriptAssign0_4
	$.pointerValue<__goscript_sha512.Digest>(dig).h[5] = __goscriptAssign0_5
	$.pointerValue<__goscript_sha512.Digest>(dig).h[6] = __goscriptAssign0_6
	$.pointerValue<__goscript_sha512.Digest>(dig).h[7] = __goscriptAssign0_7
}
