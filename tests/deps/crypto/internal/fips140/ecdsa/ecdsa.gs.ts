// Generated file based on ecdsa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as bigmod from "@goscript/crypto/internal/fips140/bigmod/index.js"

import * as drbg2 from "@goscript/crypto/internal/fips140/drbg/index.js"

import * as nistec from "@goscript/crypto/internal/fips140/nistec/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as hmac from "@goscript/crypto/internal/fips140/hmac/index.js"

import * as __goscript_cast from "./cast.gs.ts"

import * as __goscript_ecdsa_noasm from "./ecdsa_noasm.gs.ts"

import * as __goscript_hmacdrbg from "./hmacdrbg.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/bigmod/index.js"
import "@goscript/crypto/internal/fips140/drbg/index.js"
import "@goscript/crypto/internal/fips140/nistec/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/crypto/internal/fips140/hmac/index.js"
import "./cast.gs.ts"
import "./ecdsa_noasm.gs.ts"
import "./hmacdrbg.gs.ts"

export type curveID = string

export type Point = {
	Add(__typeArgs: $.GenericTypeArgs | undefined, p1: any, p2: any): any | globalThis.Promise<any>
	Bytes(__typeArgs: $.GenericTypeArgs | undefined): $.Slice<number> | globalThis.Promise<$.Slice<number>>
	BytesX(__typeArgs: $.GenericTypeArgs | undefined): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	ScalarBaseMult(__typeArgs: $.GenericTypeArgs | undefined, _p0: $.Slice<number>): [any, $.GoError] | globalThis.Promise<[any, $.GoError]>
	ScalarMult(__typeArgs: $.GenericTypeArgs | undefined, _p0: any, _p1: $.Slice<number>): [any, $.GoError] | globalThis.Promise<[any, $.GoError]>
	SetBytes(__typeArgs: $.GenericTypeArgs | undefined, _p0: $.Slice<number>): [any, $.GoError] | globalThis.Promise<[any, $.GoError]>
}

$.registerInterfaceType(
	"ecdsa.Point",
	null,
	[{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }]
);

export class PublicKey {
	public get curve(): curveID {
		return this._fields.curve.value
	}
	public set curve(value: curveID) {
		this._fields.curve.value = value
	}

	public get q(): $.Slice<number> {
		return this._fields.q.value
	}
	public set q(value: $.Slice<number>) {
		this._fields.q.value = value
	}

	public _fields: {
		curve: $.VarRef<curveID>
		q: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{curve?: curveID, q?: $.Slice<number>}>) {
		this._fields = {
			curve: $.varRef(init?.curve ?? ("" as curveID)),
			q: $.varRef(init?.q ?? (null as $.Slice<number>))
		}
	}

	public clone(): PublicKey {
		const cloned = new PublicKey()
		cloned._fields = {
			curve: $.varRef(this._fields.curve.value),
			q: $.varRef(this._fields.q.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): $.Slice<number> {
		const pub: PublicKey | $.VarRef<PublicKey> | null = this
		return $.pointerValue<PublicKey>(pub).q
	}

	static __typeInfo = $.registerStructType(
		"ecdsa.PublicKey",
		() => new PublicKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		PublicKey,
		[{ name: "curve", key: "curve", type: { kind: $.TypeKind.Basic, name: "string", typeName: "ecdsa.curveID" }, pkgPath: "crypto/internal/fips140/ecdsa", index: [0], offset: 0, exported: false }, { name: "q", key: "q", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/ecdsa", index: [1], offset: 16, exported: false }]
	)
}

export class PrivateKey {
	public get pub(): PublicKey {
		return this._fields.pub.value
	}
	public set pub(value: PublicKey) {
		this._fields.pub.value = value
	}

	public get d(): $.Slice<number> {
		return this._fields.d.value
	}
	public set d(value: $.Slice<number>) {
		this._fields.d.value = value
	}

	public _fields: {
		pub: $.VarRef<PublicKey>
		d: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{pub?: PublicKey, d?: $.Slice<number>}>) {
		this._fields = {
			pub: $.varRef(init?.pub ? $.markAsStructValue($.cloneStructValue(init.pub)) : $.markAsStructValue(new PublicKey())),
			d: $.varRef(init?.d ?? (null as $.Slice<number>))
		}
	}

	public clone(): PrivateKey {
		const cloned = new PrivateKey()
		cloned._fields = {
			pub: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.pub.value))),
			d: $.varRef(this._fields.d.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): $.Slice<number> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		return $.pointerValue<PrivateKey>(priv).d
	}

	public PublicKey(): PublicKey | $.VarRef<PublicKey> | null {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		return $.pointerValue<PrivateKey>(priv)._fields.pub
	}

	static __typeInfo = $.registerStructType(
		"ecdsa.PrivateKey",
		() => new PrivateKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "PublicKey", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" } }] }],
		PrivateKey,
		[{ name: "pub", key: "pub", type: "ecdsa.PublicKey", pkgPath: "crypto/internal/fips140/ecdsa", index: [0], offset: 0, exported: false }, { name: "d", key: "d", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/ecdsa", index: [1], offset: 40, exported: false }]
	)
}

export class Curve {
	public get curve(): curveID {
		return this._fields.curve.value
	}
	public set curve(value: curveID) {
		this._fields.curve.value = value
	}

	public get newPoint(): (() => any | globalThis.Promise<any>) | null {
		return this._fields.newPoint.value
	}
	public set newPoint(value: (() => any | globalThis.Promise<any>) | null) {
		this._fields.newPoint.value = value
	}

	public get ordInverse(): ((_p0: $.Slice<number>) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null {
		return this._fields.ordInverse.value
	}
	public set ordInverse(value: ((_p0: $.Slice<number>) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null) {
		this._fields.ordInverse.value = value
	}

	public get N(): bigmod.Modulus | $.VarRef<bigmod.Modulus> | null {
		return this._fields.N.value
	}
	public set N(value: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null) {
		this._fields.N.value = value
	}

	public get nMinus2(): $.Slice<number> {
		return this._fields.nMinus2.value
	}
	public set nMinus2(value: $.Slice<number>) {
		this._fields.nMinus2.value = value
	}

	public _fields: {
		curve: $.VarRef<curveID>
		newPoint: $.VarRef<(() => any | globalThis.Promise<any>) | null>
		ordInverse: $.VarRef<((_p0: $.Slice<number>) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null>
		N: $.VarRef<bigmod.Modulus | $.VarRef<bigmod.Modulus> | null>
		nMinus2: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{curve?: curveID, newPoint?: (() => any | globalThis.Promise<any>) | null, ordInverse?: ((_p0: $.Slice<number>) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null, N?: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, nMinus2?: $.Slice<number>}>) {
		this._fields = {
			curve: $.varRef(init?.curve ?? ("" as curveID)),
			newPoint: $.varRef(init?.newPoint ?? (null as (() => any | globalThis.Promise<any>) | null)),
			ordInverse: $.varRef(init?.ordInverse ?? (null as ((_p0: $.Slice<number>) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null)),
			N: $.varRef(init?.N ?? (null as bigmod.Modulus | $.VarRef<bigmod.Modulus> | null)),
			nMinus2: $.varRef(init?.nMinus2 ?? (null as $.Slice<number>))
		}
	}

	public clone(): Curve {
		const cloned = new Curve()
		cloned._fields = {
			curve: $.varRef(this._fields.curve.value),
			newPoint: $.varRef(this._fields.newPoint.value),
			ordInverse: $.varRef(this._fields.ordInverse.value),
			N: $.varRef(this._fields.N.value),
			nMinus2: $.varRef(this._fields.nMinus2.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"ecdsa.Curve",
		() => new Curve(),
		[],
		Curve,
		[{ name: "curve", key: "curve", type: { kind: $.TypeKind.Basic, name: "string", typeName: "ecdsa.curveID" }, pkgPath: "crypto/internal/fips140/ecdsa", index: [0], offset: 0, exported: false }, { name: "newPoint", key: "newPoint", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }] } as $.FunctionTypeInfo), pkgPath: "crypto/internal/fips140/ecdsa", index: [1], offset: 16, exported: false }, { name: "ordInverse", key: "ordInverse", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/internal/fips140/ecdsa", index: [2], offset: 24, exported: false }, { name: "N", key: "N", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" }, index: [3], offset: 32, exported: true }, { name: "nMinus2", key: "nMinus2", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/ecdsa", index: [4], offset: 40, exported: false }]
	)
}

export class Signature {
	public get R(): $.Slice<number> {
		return this._fields.R.value
	}
	public set R(value: $.Slice<number>) {
		this._fields.R.value = value
	}

	public get S(): $.Slice<number> {
		return this._fields.S.value
	}
	public set S(value: $.Slice<number>) {
		this._fields.S.value = value
	}

	public _fields: {
		R: $.VarRef<$.Slice<number>>
		S: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{R?: $.Slice<number>, S?: $.Slice<number>}>) {
		this._fields = {
			R: $.varRef(init?.R ?? (null as $.Slice<number>)),
			S: $.varRef(init?.S ?? (null as $.Slice<number>))
		}
	}

	public clone(): Signature {
		const cloned = new Signature()
		cloned._fields = {
			R: $.varRef(this._fields.R.value),
			S: $.varRef(this._fields.S.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"ecdsa.Signature",
		() => new Signature(),
		[],
		Signature,
		[{ name: "R", key: "R", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "S", key: "S", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [1], offset: 24, exported: true }]
	)
}

export const p224: curveID = "P-224"

export const p256: curveID = "P-256"

export const p384: curveID = "P-384"

export const p521: curveID = "P-521"

export function precomputeParams(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, order: $.Slice<number>): void {
	let err: $.GoError = null as $.GoError
	let __goscriptTuple0: any = bigmod.NewModulus(order)
	$.pointerValue<Curve>(c).N = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	if (err != null) {
		$.panic((err as any))
	}
	let __goscriptTuple1: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), new Uint8Array([2]) as $.Slice<number>, $.pointerValue<Curve>(c).N)
	let two: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple1[0]
	$.pointerValue<Curve>(c).nMinus2 = bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.Sub.call(bigmod.Nat.prototype.ExpandFor.call(bigmod.NewNat(), $.pointerValue<Curve>(c).N), two, $.pointerValue<Curve>(c).N), $.pointerValue<Curve>(c).N)
}

export async function P224(): globalThis.Promise<Curve | $.VarRef<Curve> | null> {
	return _P224!()
}

export let _P224: (() => Curve | $.VarRef<Curve> | null | globalThis.Promise<Curve | $.VarRef<Curve> | null>) | null = sync.OnceValue($.functionValue((): Curve | $.VarRef<Curve> | null => {
	let c: Curve | $.VarRef<Curve> | null = new Curve({curve: "P-224", newPoint: nistec.NewP224Point})
	precomputeParams({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, c, p224Order)
	return c
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "ecdsa.Curve" }] } as $.FunctionTypeInfo)))

export function __goscript_set__P224(__goscriptValue: (() => Curve | $.VarRef<Curve> | null | globalThis.Promise<Curve | $.VarRef<Curve> | null>) | null): void {
	_P224 = __goscriptValue
}

export let p224Order: $.Slice<number> = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 22, 162, 224, 184, 240, 62, 19, 221, 41, 69, 92, 92, 42, 61]) as $.Slice<number>

export function __goscript_set_p224Order(__goscriptValue: $.Slice<number>): void {
	p224Order = __goscriptValue
}

export async function P256(): globalThis.Promise<Curve | $.VarRef<Curve> | null> {
	return _P256!()
}

export let _P256: (() => Curve | $.VarRef<Curve> | null | globalThis.Promise<Curve | $.VarRef<Curve> | null>) | null = sync.OnceValue($.functionValue((): Curve | $.VarRef<Curve> | null => {
	let c: Curve | $.VarRef<Curve> | null = new Curve({curve: "P-256", newPoint: nistec.NewP256Point, ordInverse: nistec.P256OrdInverse})
	precomputeParams({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, c, p256Order)
	return c
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "ecdsa.Curve" }] } as $.FunctionTypeInfo)))

export function __goscript_set__P256(__goscriptValue: (() => Curve | $.VarRef<Curve> | null | globalThis.Promise<Curve | $.VarRef<Curve> | null>) | null): void {
	_P256 = __goscriptValue
}

export let p256Order: $.Slice<number> = new Uint8Array([255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 188, 230, 250, 173, 167, 23, 158, 132, 243, 185, 202, 194, 252, 99, 37, 81]) as $.Slice<number>

export function __goscript_set_p256Order(__goscriptValue: $.Slice<number>): void {
	p256Order = __goscriptValue
}

export async function P384(): globalThis.Promise<Curve | $.VarRef<Curve> | null> {
	return _P384!()
}

export let _P384: (() => Curve | $.VarRef<Curve> | null | globalThis.Promise<Curve | $.VarRef<Curve> | null>) | null = sync.OnceValue($.functionValue((): Curve | $.VarRef<Curve> | null => {
	let c: Curve | $.VarRef<Curve> | null = new Curve({curve: "P-384", newPoint: nistec.NewP384Point})
	precomputeParams({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, c, p384Order)
	return c
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "ecdsa.Curve" }] } as $.FunctionTypeInfo)))

export function __goscript_set__P384(__goscriptValue: (() => Curve | $.VarRef<Curve> | null | globalThis.Promise<Curve | $.VarRef<Curve> | null>) | null): void {
	_P384 = __goscriptValue
}

export let p384Order: $.Slice<number> = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 199, 99, 77, 129, 244, 55, 45, 223, 88, 26, 13, 178, 72, 176, 167, 122, 236, 236, 25, 106, 204, 197, 41, 115]) as $.Slice<number>

export function __goscript_set_p384Order(__goscriptValue: $.Slice<number>): void {
	p384Order = __goscriptValue
}

export async function P521(): globalThis.Promise<Curve | $.VarRef<Curve> | null> {
	return _P521!()
}

export let _P521: (() => Curve | $.VarRef<Curve> | null | globalThis.Promise<Curve | $.VarRef<Curve> | null>) | null = sync.OnceValue($.functionValue((): Curve | $.VarRef<Curve> | null => {
	let c: Curve | $.VarRef<Curve> | null = new Curve({curve: "P-521", newPoint: nistec.NewP521Point})
	precomputeParams({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, c, p521Order)
	return c
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "ecdsa.Curve" }] } as $.FunctionTypeInfo)))

export function __goscript_set__P521(__goscriptValue: (() => Curve | $.VarRef<Curve> | null | globalThis.Promise<Curve | $.VarRef<Curve> | null>) | null): void {
	_P521 = __goscriptValue
}

export let p521Order: $.Slice<number> = new Uint8Array([1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 250, 81, 134, 135, 131, 191, 47, 150, 107, 127, 204, 1, 72, 247, 9, 165, 208, 59, 181, 201, 184, 137, 156, 71, 174, 187, 111, 183, 30, 145, 56, 100, 9]) as $.Slice<number>

export function __goscript_set_p521Order(__goscriptValue: $.Slice<number>): void {
	p521Order = __goscriptValue
}

export async function NewPrivateKey(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, D: $.Slice<number>, Q: $.Slice<number>): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	fips140.RecordApproved()
	let __goscriptTuple2: any = await NewPublicKey({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, Q)
	let pub: PublicKey | $.VarRef<PublicKey> | null = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}
	if ($.len(D) != bigmod.Modulus.prototype.Size.call($.pointerValue<Curve>(c).N)) {
		return [null, errors.New("ecdsa: invalid private key length")]
	}
	let __goscriptTuple3: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), D, $.pointerValue<Curve>(c).N)
	let d: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}
	if (bigmod.Nat.prototype.IsZero.call(d) == 1) {
		return [null, errors.New("ecdsa: private key is zero")]
	}
	let priv: PrivateKey | $.VarRef<PrivateKey> | null = (() => { const __goscriptLiteralField0 = bigmod.Nat.prototype.Bytes.call(d, $.pointerValue<Curve>(c).N); return new PrivateKey({pub: $.markAsStructValue($.cloneStructValue($.pointerValue<PublicKey>(pub))), d: __goscriptLiteralField0}) })()
	return [priv, null]
}

export async function NewPublicKey(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, Q: $.Slice<number>): globalThis.Promise<[PublicKey | $.VarRef<PublicKey> | null, $.GoError]> {
	// SetBytes checks that Q is a valid point on the curve, and that its
	// coordinates are reduced modulo p, fulfilling the requirements of SP
	// 800-89, Section 5.3.2.
	if (($.len(Q) < 1) || ($.uint($.arrayIndex(Q!, 0), 8) == $.uint(0, 8))) {
		return [null, errors.New("ecdsa: invalid public key encoding")]
	}
	let [, err] = await $.callGenericMethod(__typeArgs, "P", "SetBytes", await $.pointerValue<Curve>(c).newPoint!(), Q)
	if (err != null) {
		return [null, err]
	}
	return [new PublicKey({curve: $.pointerValue<Curve>(c).curve, q: Q}), null]
}

export async function GenerateKey(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, rand: io.Reader | null): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	fips140.RecordApproved()

	let __goscriptTuple4: any = await randomPoint({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, $.functionValue(async (b: $.Slice<number>): globalThis.Promise<$.GoError> => {
		return await drbg2.ReadWithReader(rand, b)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo)))
	let k: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple4[0]
	let Q = (__goscriptTuple4[1] as any)
	let err = __goscriptTuple4[2]
	if (err != null) {
		return [null, err]
	}

	let priv: PrivateKey | $.VarRef<PrivateKey> | null = (await (async () => { const __goscriptLiteralField2 = bigmod.Nat.prototype.Bytes.call(k, $.pointerValue<Curve>(c).N); return new PrivateKey({pub: (await (async () => { const __goscriptLiteralField1 = await $.callGenericMethod(__typeArgs, "P", "Bytes", Q); return $.markAsStructValue(new PublicKey({curve: $.pointerValue<Curve>(c).curve, q: __goscriptLiteralField1})) })()), d: __goscriptLiteralField2}) })())
	await __goscript_cast.fipsPCT({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, priv)
	return [priv, null]
}

export async function randomPoint(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, generate: ((_p0: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<[bigmod.Nat | $.VarRef<bigmod.Nat> | null, any, $.GoError]> {
	let k: bigmod.Nat | $.VarRef<bigmod.Nat> | null = null as bigmod.Nat | $.VarRef<bigmod.Nat> | null
	let p: any = $.genericZero(__typeArgs, "P", null)
	let err: $.GoError = null as $.GoError
	while (true) {
		let b: $.Slice<number> = $.makeSlice<number>(bigmod.Modulus.prototype.Size.call($.pointerValue<Curve>(c).N), undefined, "byte")
		{
			let __goscriptShadow0 = await generate!(b)
			if (__goscriptShadow0 != null) {
				return [null, null, __goscriptShadow0]
			}
		}

		// Take only the leftmost bits of the generated random value. This is
		// both necessary to increase the chance of the random value being in
		// the correct range and to match the specification. It's unfortunate
		// that we need to do a shift instead of a mask, but see the comment on
		// rightShift.
		//
		// These are the most dangerous lines in the package and maybe in the
		// library: a single bit of bias in the selection of nonces would likely
		// lead to key recovery, but no tests would fail. Look but DO NOT TOUCH.
		{
			let excess = ($.len(b) * 8) - bigmod.Modulus.prototype.BitLen.call($.pointerValue<Curve>(c).N)
			if (excess > 0) {
				// Just to be safe, assert that this only happens for the one curve that
				// doesn't have a round number of bits.
				if (!$.stringEqual($.pointerValue<Curve>(c).curve, "P-521")) {
					$.panic("ecdsa: internal error: unexpectedly masking off bits")
				}
				b = rightShift(b, excess)
			}
		}

		// FIPS 186-5, Appendix A.4.2 makes us check x <= N - 2 and then return
		// x + 1. Note that it follows that 0 < x + 1 < N. Instead, SetBytes
		// checks that k < N, and we explicitly check 0 != k. Since k can't be
		// negative, this is strictly equivalent. None of this matters anyway
		// because the chance of selecting zero is cryptographically negligible.
		{
			let __goscriptTuple5: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), b, $.pointerValue<Curve>(c).N)
			let __goscriptShadow1: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple5[0]
			let __goscriptShadow2 = __goscriptTuple5[1]
			if ((__goscriptShadow2 == null) && (bigmod.Nat.prototype.IsZero.call(__goscriptShadow1) == 0)) {
				let __goscriptTuple6: any = await $.callGenericMethod(__typeArgs, "P", "ScalarBaseMult", await $.pointerValue<Curve>(c).newPoint!(), bigmod.Nat.prototype.Bytes.call(__goscriptShadow1, $.pointerValue<Curve>(c).N))
				let __goscriptShadow3 = (__goscriptTuple6[0] as any)
				let __goscriptShadow4 = __goscriptTuple6[1]
				return [__goscriptShadow1, __goscriptShadow3, __goscriptShadow4]
			}
		}

		if (__goscript_get_testingOnlyRejectionSamplingLooped() != null) {
			await __goscript_get_testingOnlyRejectionSamplingLooped()!()
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export var testingOnlyRejectionSamplingLooped: (() => void) | null

export function __goscript_init_testingOnlyRejectionSamplingLooped(): void {
	if (((testingOnlyRejectionSamplingLooped) as any) === undefined) {
		testingOnlyRejectionSamplingLooped = null as (() => void) | null
	}
}

export function __goscript_get_testingOnlyRejectionSamplingLooped(): (() => void) | null {
	if (((testingOnlyRejectionSamplingLooped) as any) === undefined) {
		__goscript_init_testingOnlyRejectionSamplingLooped()
	}
	return testingOnlyRejectionSamplingLooped
}

export function __goscript_set_testingOnlyRejectionSamplingLooped(__goscriptValue: (() => void) | null): void {
	testingOnlyRejectionSamplingLooped = __goscriptValue
}

export async function Sign(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, h: (() => any | globalThis.Promise<any>) | null, priv: PrivateKey | $.VarRef<PrivateKey> | null, rand: io.Reader | null, hash: $.Slice<number>): globalThis.Promise<[Signature | $.VarRef<Signature> | null, $.GoError]> {
	if (!$.stringEqual($.pointerValue<PrivateKey>(priv).pub.curve, $.pointerValue<Curve>(c).curve)) {
		return [null, errors.New("ecdsa: private key does not match curve")]
	}
	fips140.RecordApproved()
	await __goscript_cast.__goscript_get_fipsSelfTest()!()

	// Random ECDSA is dangerous, because a failure of the RNG would immediately
	// leak the private key. Instead, we use a "hedged" approach, as specified
	// in draft-irtf-cfrg-det-sigs-with-noise-04, Section 4. This has also the
	// advantage of closely resembling Deterministic ECDSA.

	let Z: $.Slice<number> = $.makeSlice<number>($.len($.pointerValue<PrivateKey>(priv).d), undefined, "byte")
	{
		let err = await drbg2.ReadWithReader(rand, Z)
		if (err != null) {
			return [null, err]
		}
	}

	// See https://github.com/cfrg/draft-irtf-cfrg-det-sigs-with-noise/issues/6
	// for the FIPS compliance of this method. In short Z is entropy from the
	// main DRBG, of length 3/2 of security_strength, so the nonce is optional
	// per SP 800-90Ar1, Section 8.6.7, and the rest is a personalization
	// string, which per SP 800-90Ar1, Section 8.7.1 may contain secret
	// information.
	let __goscriptShadow5: __goscript_hmacdrbg.hmacDRBG | $.VarRef<__goscript_hmacdrbg.hmacDRBG> | null = await __goscript_hmacdrbg.newDRBG(undefined, h, Z, null, $.namedValueInterfaceValue<__goscript_hmacdrbg.personalizationString | null>($.arrayToSlice<$.Slice<number>>([$.pointerValue<PrivateKey>(priv).d, bits2octets({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, hash)]), "ecdsa.blockAlignedPersonalizationString", {isPersonalizationString: (receiver: any, ...args: any[]) => (__goscript_hmacdrbg.blockAlignedPersonalizationString_isPersonalizationString as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ecdsa.blockAlignedPersonalizationString", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, [{ name: "isPersonalizationString", args: [], returns: [] }]))

	return __goscript_ecdsa_noasm.sign({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, priv, __goscriptShadow5, hash)
}

export async function SignDeterministic(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, h: (() => any | globalThis.Promise<any>) | null, priv: PrivateKey | $.VarRef<PrivateKey> | null, hash: $.Slice<number>): globalThis.Promise<[Signature | $.VarRef<Signature> | null, $.GoError]> {
	if (!$.stringEqual($.pointerValue<PrivateKey>(priv).pub.curve, $.pointerValue<Curve>(c).curve)) {
		return [null, errors.New("ecdsa: private key does not match curve")]
	}
	fips140.RecordApproved()
	await __goscript_cast.__goscript_get_fipsSelfTestDeterministic()!()
	let __goscriptShadow6: __goscript_hmacdrbg.hmacDRBG | $.VarRef<__goscript_hmacdrbg.hmacDRBG> | null = await __goscript_hmacdrbg.newDRBG(undefined, h, $.pointerValue<PrivateKey>(priv).d, bits2octets({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, hash), null)
	return __goscript_ecdsa_noasm.sign({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, priv, __goscriptShadow6, hash)
}

export function bits2octets(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, hash: $.Slice<number>): $.Slice<number> {
	let e: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
	hashToNat({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, e, hash)
	return bigmod.Nat.prototype.Bytes.call(e, $.pointerValue<Curve>(c).N)
}

export async function signGeneric(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, priv: PrivateKey | $.VarRef<PrivateKey> | null, drbg: __goscript_hmacdrbg.hmacDRBG | $.VarRef<__goscript_hmacdrbg.hmacDRBG> | null, hash: $.Slice<number>): globalThis.Promise<[Signature | $.VarRef<Signature> | null, $.GoError]> {
	// FIPS 186-5, Section 6.4.1

	let __goscriptTuple7: any = await randomPoint({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, $.functionValue(async (b: $.Slice<number>): globalThis.Promise<$.GoError> => {
		await __goscript_hmacdrbg.hmacDRBG.prototype.Generate.call(drbg, b)
		return null
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo)))
	let k: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple7[0]
	let R = (__goscriptTuple7[1] as any)
	let err = __goscriptTuple7[2]
	if (err != null) {
		return [null, err]
	}

	// kInv = k⁻¹
	let kInv: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
	await inverse({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, kInv, k)

	let __goscriptTuple8: any = await $.callGenericMethod(__typeArgs, "P", "BytesX", R)
	let Rx: $.Slice<number> = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple9: any = bigmod.Nat.prototype.SetOverflowingBytes.call(bigmod.NewNat(), Rx, $.pointerValue<Curve>(c).N)
	let r: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		return [null, err]
	}

	// The spec wants us to retry here, but the chance of hitting this condition
	// on a large prime-order group like the NIST curves we support is
	// cryptographically negligible. If we hit it, something is awfully wrong.
	if (bigmod.Nat.prototype.IsZero.call(r) == 1) {
		return [null, errors.New("ecdsa: internal error: r is zero")]
	}

	let e: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
	hashToNat({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, e, hash)

	let __goscriptTuple10: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), $.pointerValue<PrivateKey>(priv).d, $.pointerValue<Curve>(c).N)
	let s: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple10[0]
	err = __goscriptTuple10[1]
	if (err != null) {
		return [null, err]
	}
	bigmod.Nat.prototype.Mul.call(s, r, $.pointerValue<Curve>(c).N)
	bigmod.Nat.prototype.Add.call(s, e, $.pointerValue<Curve>(c).N)
	bigmod.Nat.prototype.Mul.call(s, kInv, $.pointerValue<Curve>(c).N)

	// Again, the chance of this happening is cryptographically negligible.
	if (bigmod.Nat.prototype.IsZero.call(s) == 1) {
		return [null, errors.New("ecdsa: internal error: s is zero")]
	}

	return [(() => { const __goscriptLiteralField3 = bigmod.Nat.prototype.Bytes.call(r, $.pointerValue<Curve>(c).N); const __goscriptLiteralField4 = bigmod.Nat.prototype.Bytes.call(s, $.pointerValue<Curve>(c).N); return new Signature({R: __goscriptLiteralField3, S: __goscriptLiteralField4}) })(), null]
}

export async function inverse(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, kInv: bigmod.Nat | $.VarRef<bigmod.Nat> | null, k: bigmod.Nat | $.VarRef<bigmod.Nat> | null): globalThis.Promise<void> {
	if ($.pointerValue<Curve>(c).ordInverse != null) {
		let __goscriptTuple11: any = await $.pointerValue<Curve>(c).ordInverse!(bigmod.Nat.prototype.Bytes.call(k, $.pointerValue<Curve>(c).N))
		let kBytes: $.Slice<number> = __goscriptTuple11[0]
		let err = __goscriptTuple11[1]
		// Some platforms don't implement ordInverse, and always return an error.
		if (err == null) {
			let [, __goscriptShadow7] = bigmod.Nat.prototype.SetBytes.call(kInv, kBytes, $.pointerValue<Curve>(c).N)
			if (__goscriptShadow7 != null) {
				$.panic("ecdsa: internal error: ordInverse produced an invalid value")
			}
			return
		}
	}

	// Calculate the inverse of s in GF(N) using Fermat's method
	// (exponentiation modulo P - 2, per Euler's theorem)
	bigmod.Nat.prototype.Exp.call(kInv, k, $.pointerValue<Curve>(c).nMinus2, $.pointerValue<Curve>(c).N)
}

export function hashToNat(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, e: bigmod.Nat | $.VarRef<bigmod.Nat> | null, hash: $.Slice<number>): void {
	// ECDSA asks us to take the left-most log2(N) bits of hash, and use them as
	// an integer modulo N. This is the absolute worst of all worlds: we still
	// have to reduce, because the result might still overflow N, but to take
	// the left-most bits for P-521 we have to do a right shift.
	{
		let size = bigmod.Modulus.prototype.Size.call($.pointerValue<Curve>(c).N)
		if ($.len(hash) >= size) {
			hash = $.goSlice(hash, undefined, size)
			{
				let excess = ($.len(hash) * 8) - bigmod.Modulus.prototype.BitLen.call($.pointerValue<Curve>(c).N)
				if (excess > 0) {
					hash = rightShift(hash, excess)
				}
			}
		}
	}
	let [, err] = bigmod.Nat.prototype.SetOverflowingBytes.call(e, hash, $.pointerValue<Curve>(c).N)
	if (err != null) {
		$.panic("ecdsa: internal error: truncated hash is too long")
	}
}

export function rightShift(b: $.Slice<number>, shift: number): $.Slice<number> {
	if ((shift <= 0) || (shift >= 8)) {
		$.panic("ecdsa: internal error: shift can only be by 1 to 7 bits")
	}
	b = bytes.Clone(b)
	for (let i = $.len(b) - 1; i >= 0; i--) {
		b![i] = (b![i] >>> ($.uint(shift, 8))) >>> 0
		if (i > 0) {
			b![i] = b![i] | ($.uint($.arrayIndex(b!, i - 1) << (8 - shift), 8))
		}
	}
	return b
}

export async function Verify(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, pub: PublicKey | $.VarRef<PublicKey> | null, hash: $.Slice<number>, sig: Signature | $.VarRef<Signature> | null): globalThis.Promise<$.GoError> {
	if (!$.stringEqual($.pointerValue<PublicKey>(pub).curve, $.pointerValue<Curve>(c).curve)) {
		return errors.New("ecdsa: public key does not match curve")
	}
	fips140.RecordApproved()
	await __goscript_cast.__goscript_get_fipsSelfTest()!()
	return __goscript_ecdsa_noasm.verify({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, pub, hash, sig)
}

export async function verifyGeneric(__typeArgs: $.GenericTypeArgs | undefined, c: Curve | $.VarRef<Curve> | null, pub: PublicKey | $.VarRef<PublicKey> | null, hash: $.Slice<number>, sig: Signature | $.VarRef<Signature> | null): globalThis.Promise<$.GoError> {
	// FIPS 186-5, Section 6.4.2

	let __goscriptTuple12: any = await $.callGenericMethod(__typeArgs, "P", "SetBytes", await $.pointerValue<Curve>(c).newPoint!(), $.pointerValue<PublicKey>(pub).q)
	let Q = (__goscriptTuple12[0] as any)
	let err = __goscriptTuple12[1]
	if (err != null) {
		return err
	}

	let __goscriptTuple13: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), $.pointerValue<Signature>(sig).R, $.pointerValue<Curve>(c).N)
	let r: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple13[0]
	err = __goscriptTuple13[1]
	if (err != null) {
		return err
	}
	if (bigmod.Nat.prototype.IsZero.call(r) == 1) {
		return errors.New("ecdsa: invalid signature: r is zero")
	}
	let __goscriptTuple14: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), $.pointerValue<Signature>(sig).S, $.pointerValue<Curve>(c).N)
	let s: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple14[0]
	err = __goscriptTuple14[1]
	if (err != null) {
		return err
	}
	if (bigmod.Nat.prototype.IsZero.call(s) == 1) {
		return errors.New("ecdsa: invalid signature: s is zero")
	}

	let e: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
	hashToNat({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, e, hash)

	// w = s⁻¹
	let w: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
	await inverse({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, w, s)

	// p₁ = [e * s⁻¹]G
	let __goscriptTuple15: any = await $.callGenericMethod(__typeArgs, "P", "ScalarBaseMult", await $.pointerValue<Curve>(c).newPoint!(), bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.Mul.call(e, w, $.pointerValue<Curve>(c).N), $.pointerValue<Curve>(c).N))
	let p1 = (__goscriptTuple15[0] as any)
	err = __goscriptTuple15[1]
	if (err != null) {
		return err
	}
	// p₂ = [r * s⁻¹]Q
	let __goscriptTuple16: any = await $.callGenericMethod(__typeArgs, "P", "ScalarMult", Q, Q, bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.Mul.call(w, r, $.pointerValue<Curve>(c).N), $.pointerValue<Curve>(c).N))
	let p2 = (__goscriptTuple16[0] as any)
	err = __goscriptTuple16[1]
	if (err != null) {
		return err
	}
	// BytesX returns an error for the point at infinity.
	let __goscriptTuple17: any = await $.callGenericMethod(__typeArgs, "P", "BytesX", await $.callGenericMethod(__typeArgs, "P", "Add", p1, p1, p2))
	let Rx: $.Slice<number> = __goscriptTuple17[0]
	err = __goscriptTuple17[1]
	if (err != null) {
		return err
	}

	let __goscriptTuple18: any = bigmod.Nat.prototype.SetOverflowingBytes.call(bigmod.NewNat(), Rx, $.pointerValue<Curve>(c).N)
	let v: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple18[0]
	err = __goscriptTuple18[1]
	if (err != null) {
		return err
	}

	if (bigmod.Nat.prototype.Equal.call(v, r) != 1) {
		return errors.New("ecdsa: signature did not verify")
	}
	return null
}
