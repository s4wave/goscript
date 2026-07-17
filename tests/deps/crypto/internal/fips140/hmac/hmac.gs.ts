// Generated file based on hmac.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as sha256 from "@goscript/crypto/internal/fips140/sha256/index.js"

import * as sha3 from "@goscript/crypto/internal/fips140/sha3/index.js"

import * as sha512 from "@goscript/crypto/internal/fips140/sha512/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/sha256/index.js"
import "@goscript/crypto/internal/fips140/sha3/index.js"
import "@goscript/crypto/internal/fips140/sha512/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"

export type marshalable = {
	MarshalBinary(): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	UnmarshalBinary(_p0: $.Slice<number>): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"hmac.marshalable",
	null,
	[{ name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "UnmarshalBinary", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }]
);

export class HMAC {
	// opad and ipad may share underlying storage with HMAC clones.
	public get opad(): $.Slice<number> {
		return this._fields.opad.value
	}
	public set opad(value: $.Slice<number>) {
		this._fields.opad.value = value
	}

	// opad and ipad may share underlying storage with HMAC clones.
	public get ipad(): $.Slice<number> {
		return this._fields.ipad.value
	}
	public set ipad(value: $.Slice<number>) {
		this._fields.ipad.value = value
	}

	public get outer(): hash.Hash | null {
		return this._fields.outer.value
	}
	public set outer(value: hash.Hash | null) {
		this._fields.outer.value = value
	}

	public get inner(): hash.Hash | null {
		return this._fields.inner.value
	}
	public set inner(value: hash.Hash | null) {
		this._fields.inner.value = value
	}

	// If marshaled is true, then opad and ipad do not contain a padded
	// copy of the key, but rather the marshaled state of outer/inner after
	// opad/ipad has been fed into it.
	public get marshaled(): boolean {
		return this._fields.marshaled.value
	}
	public set marshaled(value: boolean) {
		this._fields.marshaled.value = value
	}

	// forHKDF and keyLen are stored to inform the service indicator decision.
	public get forHKDF(): boolean {
		return this._fields.forHKDF.value
	}
	public set forHKDF(value: boolean) {
		this._fields.forHKDF.value = value
	}

	public get keyLen(): number {
		return this._fields.keyLen.value
	}
	public set keyLen(value: number) {
		this._fields.keyLen.value = value
	}

	public _fields: {
		opad: $.VarRef<$.Slice<number>>
		ipad: $.VarRef<$.Slice<number>>
		outer: $.VarRef<hash.Hash | null>
		inner: $.VarRef<hash.Hash | null>
		marshaled: $.VarRef<boolean>
		forHKDF: $.VarRef<boolean>
		keyLen: $.VarRef<number>
	}

	constructor(init?: Partial<{opad?: $.Slice<number>, ipad?: $.Slice<number>, outer?: hash.Hash | null, inner?: hash.Hash | null, marshaled?: boolean, forHKDF?: boolean, keyLen?: number}>) {
		this._fields = {
			opad: $.varRef(init?.opad ?? (null! as $.Slice<number>)),
			ipad: $.varRef(init?.ipad ?? (null! as $.Slice<number>)),
			outer: $.varRef(init?.outer ?? (null! as hash.Hash | null)),
			inner: $.varRef(init?.inner ?? (null! as hash.Hash | null)),
			marshaled: $.varRef(init?.marshaled ?? (false as boolean)),
			forHKDF: $.varRef(init?.forHKDF ?? (false as boolean)),
			keyLen: $.varRef(init?.keyLen ?? (0 as number))
		}
	}

	public clone(): HMAC {
		const cloned = new HMAC()
		cloned._fields = {
			opad: $.varRef(this._fields.opad.value),
			ipad: $.varRef(this._fields.ipad.value),
			outer: $.varRef(this._fields.outer.value),
			inner: $.varRef(this._fields.inner.value),
			marshaled: $.varRef(this._fields.marshaled.value),
			forHKDF: $.varRef(this._fields.forHKDF.value),
			keyLen: $.varRef(this._fields.keyLen.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async BlockSize(): globalThis.Promise<number> {
		const h: HMAC | $.VarRef<HMAC> | null = this
		return $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).inner).BlockSize()
	}

	public async Clone(): globalThis.Promise<[hash.Cloner | null, $.GoError]> {
		const h: HMAC | $.VarRef<HMAC> | null = this
		let r = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<HMAC>(h))))
		let [ic, ok] = $.typeAssertTuple<hash.Cloner | null>($.pointerValue<HMAC>(h).inner, "hash.Cloner")
		if (!ok) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new errCloneUnsupported()), "hmac.errCloneUnsupported", "hmac.errCloneUnsupported")]
		}
		let __goscriptTuple0: any = $.typeAssertTuple<hash.Cloner | null>($.pointerValue<HMAC>(h).outer, "hash.Cloner")
		let oc = __goscriptTuple0[0]
		ok = __goscriptTuple0[1]
		if (!ok) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new errCloneUnsupported()), "hmac.errCloneUnsupported", "hmac.errCloneUnsupported")]
		}
		let err: $.GoError = null! as $.GoError
		let __goscriptTuple1: any = await $.pointerValue<Exclude<hash.Cloner, null>>(ic).Clone()
		r.value.inner = (__goscriptTuple1[0] as hash.Hash | null)
		err = __goscriptTuple1[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new errCloneUnsupported()), "hmac.errCloneUnsupported", "hmac.errCloneUnsupported")]
		}
		let __goscriptTuple2: any = await $.pointerValue<Exclude<hash.Cloner, null>>(oc).Clone()
		r.value.outer = (__goscriptTuple2[0] as hash.Hash | null)
		err = __goscriptTuple2[1]
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new errCloneUnsupported()), "hmac.errCloneUnsupported", "hmac.errCloneUnsupported")]
		}
		return [$.interfaceValue<hash.Cloner | null>(r, "*hmac.HMAC", { kind: $.TypeKind.Pointer, elemType: "hmac.HMAC" }), null]
	}

	public async Reset(): globalThis.Promise<void> {
		let h: HMAC | $.VarRef<HMAC> | null = this
		if ($.pointerValue<HMAC>(h).marshaled) {
			{
				let err = await $.pointerValue<Exclude<marshalable, null>>($.mustTypeAssert<marshalable | null>($.pointerValue<HMAC>(h).inner, "hmac.marshalable")).UnmarshalBinary($.pointerValue<HMAC>(h).ipad)
				if (err != null) {
					$.panic((err as any))
				}
			}
			return
		}

		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).inner).Reset()
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).inner).Write($.pointerValue<HMAC>(h).ipad)

		// If the underlying hash is marshalable, we can save some time by saving a
		// copy of the hash state now, and restoring it on future calls to Reset and
		// Sum instead of writing ipad/opad every time.
		//
		// We do this on Reset to avoid slowing down the common single-use case.
		//
		// This is allowed by FIPS 198-1, Section 6: "Conceptually, the intermediate
		// results of the compression function on the B-byte blocks (K0 ⊕ ipad) and
		// (K0 ⊕ opad) can be precomputed once, at the time of generation of the key
		// K, or before its first use. These intermediate results can be stored and
		// then used to initialize H each time that a message needs to be
		// authenticated using the same key. [...] These stored intermediate values
		// shall be treated and protected in the same manner as secret keys."
		let [marshalableInner, innerOK] = $.typeAssertTuple<marshalable | null>($.pointerValue<HMAC>(h).inner, "hmac.marshalable")
		if (!innerOK) {
			return
		}
		let [marshalableOuter, outerOK] = $.typeAssertTuple<marshalable | null>($.pointerValue<HMAC>(h).outer, "hmac.marshalable")
		if (!outerOK) {
			return
		}

		let __goscriptTuple3: any = await $.pointerValue<Exclude<marshalable, null>>(marshalableInner).MarshalBinary()
		let imarshal: $.Slice<number> = __goscriptTuple3[0]
		let err = __goscriptTuple3[1]
		if (err != null) {
			return
		}

		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).outer).Reset()
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).outer).Write($.pointerValue<HMAC>(h).opad)
		let __goscriptTuple4: any = await $.pointerValue<Exclude<marshalable, null>>(marshalableOuter).MarshalBinary()
		let omarshal: $.Slice<number> = __goscriptTuple4[0]
		err = __goscriptTuple4[1]
		if (err != null) {
			return
		}

		// Marshaling succeeded; save the marshaled state for later
		$.pointerValue<HMAC>(h).ipad = imarshal
		$.pointerValue<HMAC>(h).opad = omarshal
		$.pointerValue<HMAC>(h).marshaled = true
	}

	public async Size(): globalThis.Promise<number> {
		const h: HMAC | $.VarRef<HMAC> | null = this
		return $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).outer).Size()
	}

	public async Sum(_in: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const h: HMAC | $.VarRef<HMAC> | null = this
		// Per FIPS 140-3 IG C.M, key lengths below 112 bits are only allowed for
		// legacy use (i.e. verification only) and we don't support that. However,
		// HKDF uses the HMAC key for the salt, which is allowed to be shorter.
		if (($.pointerValue<HMAC>(h).keyLen < (Math.trunc(112 / 8))) && !$.pointerValue<HMAC>(h).forHKDF) {
			fips140.RecordNonApproved()
		}
		{
			const __goscriptTypeSwitchValue = $.pointerValue<HMAC>(h).inner
			switch (true) {
				case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "sha256.Digest" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "sha512.Digest" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "sha3.Digest" }):
					{
					}
					break
				default:
					{
						fips140.RecordNonApproved()
					}
					break
			}
		}

		let origLen = $.len(_in)
		_in = await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).inner).Sum(_in)

		if ($.pointerValue<HMAC>(h).marshaled) {
			{
				let err = await $.pointerValue<Exclude<marshalable, null>>($.mustTypeAssert<marshalable | null>($.pointerValue<HMAC>(h).outer, "hmac.marshalable")).UnmarshalBinary($.pointerValue<HMAC>(h).opad)
				if (err != null) {
					$.panic((err as any))
				}
			}
		} else {
			await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).outer).Reset()
			await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).outer).Write($.pointerValue<HMAC>(h).opad)
		}
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).outer).Write($.goSlice(_in, origLen, undefined))
		return $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).outer).Sum($.goSlice(_in, undefined, origLen))
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const h: HMAC | $.VarRef<HMAC> | null = this
		let n: number = 0
		let err: $.GoError = null! as $.GoError
		return $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(h).inner).Write(p)
	}

	static __typeInfo = $.registerStructType(
		"hmac.HMAC",
		() => new HMAC(),
		[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: "hash.Cloner" }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "in", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		HMAC,
		[{ name: "opad", key: "opad", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/hmac", index: [0], offset: 0, exported: false }, { name: "ipad", key: "ipad", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/hmac", index: [1], offset: 24, exported: false }, { name: "outer", key: "outer", type: "hash.Hash", pkgPath: "crypto/internal/fips140/hmac", index: [2], offset: 48, exported: false }, { name: "inner", key: "inner", type: "hash.Hash", pkgPath: "crypto/internal/fips140/hmac", index: [3], offset: 64, exported: false }, { name: "marshaled", key: "marshaled", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/internal/fips140/hmac", index: [4], offset: 80, exported: false }, { name: "forHKDF", key: "forHKDF", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/internal/fips140/hmac", index: [5], offset: 81, exported: false }, { name: "keyLen", key: "keyLen", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/hmac", index: [6], offset: 88, exported: false }]
	)
}

export class errCloneUnsupported {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): errCloneUnsupported {
		const cloned = new errCloneUnsupported()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e = this
		return "crypto/hmac: hash does not support hash.Cloner"
	}

	public Unwrap(): $.GoError {
		const e = this
		return errors.ErrUnsupported
	}

	static __typeInfo = $.registerStructType(
		"hmac.errCloneUnsupported",
		() => new errCloneUnsupported(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Unwrap", args: [], returns: [{ name: "_r0", type: "error" }] }],
		errCloneUnsupported,
		[]
	)
}

export async function New(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, key: $.Slice<number>): globalThis.Promise<HMAC | $.VarRef<HMAC> | null> {
	let hm: HMAC | $.VarRef<HMAC> | null = new HMAC({keyLen: $.len(key)})
	$.pointerValue<HMAC>(hm).outer = (await h!() as hash.Hash | null)
	$.pointerValue<HMAC>(hm).inner = (await h!() as hash.Hash | null)
	let _unique = true
	void ((): void => {
		const __defer = new $.DisposableStack()
		try {
			__defer.defer(() => { ((): void => {
				// The comparison might panic if the underlying types are not comparable.
				$.recover()
			})() })
			if ($.comparableEqual($.pointerValue<HMAC>(hm).outer, $.pointerValue<HMAC>(hm).inner)) {
				_unique = false
			}
			__defer.dispose()
		} catch (e) {
			__defer.disposePanic(e)
			if (!$.recovered(e)) {
				throw e
			}
		}
	})()
	if (!_unique) {
		$.panic("crypto/hmac: hash generation function does not produce unique values")
	}
	let blocksize = await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(hm).inner).BlockSize()
	$.pointerValue<HMAC>(hm).ipad = $.makeSlice<number>(blocksize, undefined, "byte")
	$.pointerValue<HMAC>(hm).opad = $.makeSlice<number>(blocksize, undefined, "byte")
	if ($.len(key) > blocksize) {
		// If key is too big, hash it.
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(hm).outer).Write(key)
		key = await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(hm).outer).Sum(null)
	}
	$.copy($.pointerValue<HMAC>(hm).ipad, key)
	$.copy($.pointerValue<HMAC>(hm).opad, key)
	for (let __goscriptRangeTarget0 = $.pointerValue<HMAC>(hm).ipad, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		$.pointerValue<HMAC>(hm).ipad![i] = $.pointerValue<HMAC>(hm).ipad![i] ^ ($.uint(0x36, 8))
	}
	for (let __goscriptRangeTarget1 = $.pointerValue<HMAC>(hm).opad, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		$.pointerValue<HMAC>(hm).opad![i] = $.pointerValue<HMAC>(hm).opad![i] ^ ($.uint(0x5c, 8))
	}
	await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<HMAC>(hm).inner).Write($.pointerValue<HMAC>(hm).ipad)

	return hm
}

export function MarkAsUsedInKDF(h: HMAC | $.VarRef<HMAC> | null): void {
	$.pointerValue<HMAC>(h).forHKDF = true
}
