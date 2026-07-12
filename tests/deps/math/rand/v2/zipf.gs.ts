// Generated file based on zipf.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as __goscript_exp from "./exp.gs.ts"

import * as __goscript_normal from "./normal.gs.ts"

import * as __goscript_rand from "./rand.gs.ts"
import "@goscript/math/index.js"
import "./exp.gs.ts"
import "./normal.gs.ts"
import "./rand.gs.ts"

export class Zipf {
	public get r(): __goscript_rand.Rand | $.VarRef<__goscript_rand.Rand> | null {
		return this._fields.r.value
	}
	public set r(value: __goscript_rand.Rand | $.VarRef<__goscript_rand.Rand> | null) {
		this._fields.r.value = value
	}

	public get imax(): number {
		return this._fields.imax.value
	}
	public set imax(value: number) {
		this._fields.imax.value = value
	}

	public get v(): number {
		return this._fields.v.value
	}
	public set v(value: number) {
		this._fields.v.value = value
	}

	public get q(): number {
		return this._fields.q.value
	}
	public set q(value: number) {
		this._fields.q.value = value
	}

	public get s(): number {
		return this._fields.s.value
	}
	public set s(value: number) {
		this._fields.s.value = value
	}

	public get oneminusQ(): number {
		return this._fields.oneminusQ.value
	}
	public set oneminusQ(value: number) {
		this._fields.oneminusQ.value = value
	}

	public get oneminusQinv(): number {
		return this._fields.oneminusQinv.value
	}
	public set oneminusQinv(value: number) {
		this._fields.oneminusQinv.value = value
	}

	public get hxm(): number {
		return this._fields.hxm.value
	}
	public set hxm(value: number) {
		this._fields.hxm.value = value
	}

	public get hx0minusHxm(): number {
		return this._fields.hx0minusHxm.value
	}
	public set hx0minusHxm(value: number) {
		this._fields.hx0minusHxm.value = value
	}

	public _fields: {
		r: $.VarRef<__goscript_rand.Rand | $.VarRef<__goscript_rand.Rand> | null>
		imax: $.VarRef<number>
		v: $.VarRef<number>
		q: $.VarRef<number>
		s: $.VarRef<number>
		oneminusQ: $.VarRef<number>
		oneminusQinv: $.VarRef<number>
		hxm: $.VarRef<number>
		hx0minusHxm: $.VarRef<number>
	}

	constructor(init?: Partial<{r?: __goscript_rand.Rand | $.VarRef<__goscript_rand.Rand> | null, imax?: number, v?: number, q?: number, s?: number, oneminusQ?: number, oneminusQinv?: number, hxm?: number, hx0minusHxm?: number}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as __goscript_rand.Rand | $.VarRef<__goscript_rand.Rand> | null)),
			imax: $.varRef(init?.imax ?? (0 as number)),
			v: $.varRef(init?.v ?? (0 as number)),
			q: $.varRef(init?.q ?? (0 as number)),
			s: $.varRef(init?.s ?? (0 as number)),
			oneminusQ: $.varRef(init?.oneminusQ ?? (0 as number)),
			oneminusQinv: $.varRef(init?.oneminusQinv ?? (0 as number)),
			hxm: $.varRef(init?.hxm ?? (0 as number)),
			hx0minusHxm: $.varRef(init?.hx0minusHxm ?? (0 as number))
		}
	}

	public clone(): Zipf {
		const cloned = new Zipf()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			imax: $.varRef(this._fields.imax.value),
			v: $.varRef(this._fields.v.value),
			q: $.varRef(this._fields.q.value),
			s: $.varRef(this._fields.s.value),
			oneminusQ: $.varRef(this._fields.oneminusQ.value),
			oneminusQinv: $.varRef(this._fields.oneminusQinv.value),
			hxm: $.varRef(this._fields.hxm.value),
			hx0minusHxm: $.varRef(this._fields.hx0minusHxm.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Uint64(): globalThis.Promise<bigint> {
		const z: Zipf | $.VarRef<Zipf> | null = this
		if (z == null) {
			$.panic("rand: nil Zipf")
		}
		let k = 0.0

		while (true) {
			let r = await __goscript_rand.Rand.prototype.Float64.call($.pointerValue<Zipf>(z).r)
			let ur = $.pointerValue<Zipf>(z).hxm + (r * $.pointerValue<Zipf>(z).hx0minusHxm)
			let x = Zipf.prototype.hinv.call(z, ur)
			k = math.Floor(x + 0.5)
			if ((k - x) <= $.pointerValue<Zipf>(z).s) {
				break
			}
			if (ur >= (Zipf.prototype.h.call(z, k + 0.5) - math.Exp(-math.Log(k + $.pointerValue<Zipf>(z).v) * $.pointerValue<Zipf>(z).q))) {
				break
			}
		}
		return $.uint64(k)
	}

	public h(x: number): number {
		const z: Zipf | $.VarRef<Zipf> | null = this
		return math.Exp($.pointerValue<Zipf>(z).oneminusQ * math.Log($.pointerValue<Zipf>(z).v + x)) * $.pointerValue<Zipf>(z).oneminusQinv
	}

	public hinv(x: number): number {
		const z: Zipf | $.VarRef<Zipf> | null = this
		return math.Exp($.pointerValue<Zipf>(z).oneminusQinv * math.Log($.pointerValue<Zipf>(z).oneminusQ * x)) - $.pointerValue<Zipf>(z).v
	}

	static __typeInfo = $.registerStructType(
		"rand.Zipf",
		() => new Zipf(),
		[{ name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "h", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "float64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }] }, { name: "hinv", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "float64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }] }],
		Zipf,
		[{ name: "r", key: "r", type: { kind: $.TypeKind.Pointer, elemType: "rand.Rand" }, pkgPath: "math/rand/v2", index: [0], offset: 0, exported: false }, { name: "imax", key: "imax", type: { kind: $.TypeKind.Basic, name: "float64" }, pkgPath: "math/rand/v2", index: [1], offset: 8, exported: false }, { name: "v", key: "v", type: { kind: $.TypeKind.Basic, name: "float64" }, pkgPath: "math/rand/v2", index: [2], offset: 16, exported: false }, { name: "q", key: "q", type: { kind: $.TypeKind.Basic, name: "float64" }, pkgPath: "math/rand/v2", index: [3], offset: 24, exported: false }, { name: "s", key: "s", type: { kind: $.TypeKind.Basic, name: "float64" }, pkgPath: "math/rand/v2", index: [4], offset: 32, exported: false }, { name: "oneminusQ", key: "oneminusQ", type: { kind: $.TypeKind.Basic, name: "float64" }, pkgPath: "math/rand/v2", index: [5], offset: 40, exported: false }, { name: "oneminusQinv", key: "oneminusQinv", type: { kind: $.TypeKind.Basic, name: "float64" }, pkgPath: "math/rand/v2", index: [6], offset: 48, exported: false }, { name: "hxm", key: "hxm", type: { kind: $.TypeKind.Basic, name: "float64" }, pkgPath: "math/rand/v2", index: [7], offset: 56, exported: false }, { name: "hx0minusHxm", key: "hx0minusHxm", type: { kind: $.TypeKind.Basic, name: "float64" }, pkgPath: "math/rand/v2", index: [8], offset: 64, exported: false }]
	)
}

export function NewZipf(r: __goscript_rand.Rand | $.VarRef<__goscript_rand.Rand> | null, s: number, v: number, imax: bigint): Zipf | $.VarRef<Zipf> | null {
	let z: Zipf | $.VarRef<Zipf> | null = new Zipf()
	if ((s <= 1.0) || (v < 1)) {
		return null
	}
	$.pointerValue<Zipf>(z).r = r
	$.pointerValue<Zipf>(z).imax = Number(imax)
	$.pointerValue<Zipf>(z).v = v
	$.pointerValue<Zipf>(z).q = s
	$.pointerValue<Zipf>(z).oneminusQ = 1.0 - $.pointerValue<Zipf>(z).q
	$.pointerValue<Zipf>(z).oneminusQinv = 1.0 / $.pointerValue<Zipf>(z).oneminusQ
	$.pointerValue<Zipf>(z).hxm = Zipf.prototype.h.call(z, $.pointerValue<Zipf>(z).imax + 0.5)
	$.pointerValue<Zipf>(z).hx0minusHxm = (Zipf.prototype.h.call(z, 0.5) - math.Exp(math.Log($.pointerValue<Zipf>(z).v) * (-$.pointerValue<Zipf>(z).q))) - $.pointerValue<Zipf>(z).hxm
	$.pointerValue<Zipf>(z).s = 1 - Zipf.prototype.hinv.call(z, Zipf.prototype.h.call(z, 1.5) - math.Exp(-$.pointerValue<Zipf>(z).q * math.Log($.pointerValue<Zipf>(z).v + 1.0)))
	return z
}
