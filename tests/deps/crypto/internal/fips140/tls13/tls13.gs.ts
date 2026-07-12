// Generated file based on tls13.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as hkdf from "@goscript/crypto/internal/fips140/hkdf/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/crypto/internal/fips140/hkdf/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"

export class EarlySecret {
	public get secret(): $.Slice<number> {
		return this._fields.secret.value
	}
	public set secret(value: $.Slice<number>) {
		this._fields.secret.value = value
	}

	public get hash(): (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null {
		return this._fields.hash.value
	}
	public set hash(value: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null) {
		this._fields.hash.value = value
	}

	public _fields: {
		secret: $.VarRef<$.Slice<number>>
		hash: $.VarRef<(() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null>
	}

	constructor(init?: Partial<{secret?: $.Slice<number>, hash?: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null}>) {
		this._fields = {
			secret: $.varRef(init?.secret ?? (null as $.Slice<number>)),
			hash: $.varRef(init?.hash ?? (null as (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null))
		}
	}

	public clone(): EarlySecret {
		const cloned = new EarlySecret()
		cloned._fields = {
			secret: $.varRef(this._fields.secret.value),
			hash: $.varRef(this._fields.hash.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ClientEarlyTrafficSecret(transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
		const s: EarlySecret | $.VarRef<EarlySecret> | null = this
		return deriveSecret(undefined, $.pointerValue<EarlySecret>(s).hash, $.pointerValue<EarlySecret>(s).secret, "c e traffic", transcript)
	}

	public async EarlyExporterMasterSecret(transcript: hash2.Hash | null): globalThis.Promise<ExporterMasterSecret | $.VarRef<ExporterMasterSecret> | null> {
		const s: EarlySecret | $.VarRef<EarlySecret> | null = this
		return (await (async () => { const __goscriptLiteralField0 = await deriveSecret(undefined, $.pointerValue<EarlySecret>(s).hash, $.pointerValue<EarlySecret>(s).secret, "e exp master", transcript); return new ExporterMasterSecret({secret: __goscriptLiteralField0, hash: $.pointerValue<EarlySecret>(s).hash}) })())
	}

	public async HandshakeSecret(sharedSecret: $.Slice<number>): globalThis.Promise<HandshakeSecret | $.VarRef<HandshakeSecret> | null> {
		const s: EarlySecret | $.VarRef<EarlySecret> | null = this
		let derived: $.Slice<number> = await deriveSecret(undefined, $.pointerValue<EarlySecret>(s).hash, $.pointerValue<EarlySecret>(s).secret, "derived", null)
		return (await (async () => { const __goscriptLiteralField1 = await extract(undefined, $.pointerValue<EarlySecret>(s).hash, sharedSecret, derived); return new HandshakeSecret({secret: __goscriptLiteralField1, hash: $.pointerValue<EarlySecret>(s).hash}) })())
	}

	public async ResumptionBinderKey(): globalThis.Promise<$.Slice<number>> {
		const s: EarlySecret | $.VarRef<EarlySecret> | null = this
		return deriveSecret(undefined, $.pointerValue<EarlySecret>(s).hash, $.pointerValue<EarlySecret>(s).secret, "res binder", null)
	}

	static __typeInfo = $.registerStructType(
		"tls13.EarlySecret",
		() => new EarlySecret(),
		[{ name: "ClientEarlyTrafficSecret", args: [{ name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "EarlyExporterMasterSecret", args: [{ name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls13.ExporterMasterSecret" } }] }, { name: "HandshakeSecret", args: [{ name: "sharedSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls13.HandshakeSecret" } }] }, { name: "ResumptionBinderKey", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		EarlySecret,
		[{ name: "secret", key: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/tls13", index: [0], offset: 0, exported: false }, { name: "hash", key: "hash", type: ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo), pkgPath: "crypto/internal/fips140/tls13", index: [1], offset: 24, exported: false }]
	)
}

export class HandshakeSecret {
	public get secret(): $.Slice<number> {
		return this._fields.secret.value
	}
	public set secret(value: $.Slice<number>) {
		this._fields.secret.value = value
	}

	public get hash(): (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null {
		return this._fields.hash.value
	}
	public set hash(value: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null) {
		this._fields.hash.value = value
	}

	public _fields: {
		secret: $.VarRef<$.Slice<number>>
		hash: $.VarRef<(() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null>
	}

	constructor(init?: Partial<{secret?: $.Slice<number>, hash?: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null}>) {
		this._fields = {
			secret: $.varRef(init?.secret ?? (null as $.Slice<number>)),
			hash: $.varRef(init?.hash ?? (null as (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null))
		}
	}

	public clone(): HandshakeSecret {
		const cloned = new HandshakeSecret()
		cloned._fields = {
			secret: $.varRef(this._fields.secret.value),
			hash: $.varRef(this._fields.hash.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ClientHandshakeTrafficSecret(transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
		const s: HandshakeSecret | $.VarRef<HandshakeSecret> | null = this
		return deriveSecret(undefined, $.pointerValue<HandshakeSecret>(s).hash, $.pointerValue<HandshakeSecret>(s).secret, "c hs traffic", transcript)
	}

	public async MasterSecret(): globalThis.Promise<MasterSecret | $.VarRef<MasterSecret> | null> {
		const s: HandshakeSecret | $.VarRef<HandshakeSecret> | null = this
		let derived: $.Slice<number> = await deriveSecret(undefined, $.pointerValue<HandshakeSecret>(s).hash, $.pointerValue<HandshakeSecret>(s).secret, "derived", null)
		return (await (async () => { const __goscriptLiteralField3 = await extract(undefined, $.pointerValue<HandshakeSecret>(s).hash, null, derived); return new MasterSecret({secret: __goscriptLiteralField3, hash: $.pointerValue<HandshakeSecret>(s).hash}) })())
	}

	public async ServerHandshakeTrafficSecret(transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
		const s: HandshakeSecret | $.VarRef<HandshakeSecret> | null = this
		return deriveSecret(undefined, $.pointerValue<HandshakeSecret>(s).hash, $.pointerValue<HandshakeSecret>(s).secret, "s hs traffic", transcript)
	}

	static __typeInfo = $.registerStructType(
		"tls13.HandshakeSecret",
		() => new HandshakeSecret(),
		[{ name: "ClientHandshakeTrafficSecret", args: [{ name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "MasterSecret", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls13.MasterSecret" } }] }, { name: "ServerHandshakeTrafficSecret", args: [{ name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		HandshakeSecret,
		[{ name: "secret", key: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/tls13", index: [0], offset: 0, exported: false }, { name: "hash", key: "hash", type: ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo), pkgPath: "crypto/internal/fips140/tls13", index: [1], offset: 24, exported: false }]
	)
}

export class MasterSecret {
	public get secret(): $.Slice<number> {
		return this._fields.secret.value
	}
	public set secret(value: $.Slice<number>) {
		this._fields.secret.value = value
	}

	public get hash(): (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null {
		return this._fields.hash.value
	}
	public set hash(value: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null) {
		this._fields.hash.value = value
	}

	public _fields: {
		secret: $.VarRef<$.Slice<number>>
		hash: $.VarRef<(() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null>
	}

	constructor(init?: Partial<{secret?: $.Slice<number>, hash?: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null}>) {
		this._fields = {
			secret: $.varRef(init?.secret ?? (null as $.Slice<number>)),
			hash: $.varRef(init?.hash ?? (null as (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null))
		}
	}

	public clone(): MasterSecret {
		const cloned = new MasterSecret()
		cloned._fields = {
			secret: $.varRef(this._fields.secret.value),
			hash: $.varRef(this._fields.hash.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ClientApplicationTrafficSecret(transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
		const s: MasterSecret | $.VarRef<MasterSecret> | null = this
		return deriveSecret(undefined, $.pointerValue<MasterSecret>(s).hash, $.pointerValue<MasterSecret>(s).secret, "c ap traffic", transcript)
	}

	public async ExporterMasterSecret(transcript: hash2.Hash | null): globalThis.Promise<ExporterMasterSecret | $.VarRef<ExporterMasterSecret> | null> {
		const s: MasterSecret | $.VarRef<MasterSecret> | null = this
		return (await (async () => { const __goscriptLiteralField4 = await deriveSecret(undefined, $.pointerValue<MasterSecret>(s).hash, $.pointerValue<MasterSecret>(s).secret, "exp master", transcript); return new ExporterMasterSecret({secret: __goscriptLiteralField4, hash: $.pointerValue<MasterSecret>(s).hash}) })())
	}

	public async ResumptionMasterSecret(transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
		const s: MasterSecret | $.VarRef<MasterSecret> | null = this
		return deriveSecret(undefined, $.pointerValue<MasterSecret>(s).hash, $.pointerValue<MasterSecret>(s).secret, "res master", transcript)
	}

	public async ServerApplicationTrafficSecret(transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
		const s: MasterSecret | $.VarRef<MasterSecret> | null = this
		return deriveSecret(undefined, $.pointerValue<MasterSecret>(s).hash, $.pointerValue<MasterSecret>(s).secret, "s ap traffic", transcript)
	}

	static __typeInfo = $.registerStructType(
		"tls13.MasterSecret",
		() => new MasterSecret(),
		[{ name: "ClientApplicationTrafficSecret", args: [{ name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "ExporterMasterSecret", args: [{ name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls13.ExporterMasterSecret" } }] }, { name: "ResumptionMasterSecret", args: [{ name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "ServerApplicationTrafficSecret", args: [{ name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		MasterSecret,
		[{ name: "secret", key: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/tls13", index: [0], offset: 0, exported: false }, { name: "hash", key: "hash", type: ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo), pkgPath: "crypto/internal/fips140/tls13", index: [1], offset: 24, exported: false }]
	)
}

export class ExporterMasterSecret {
	public get secret(): $.Slice<number> {
		return this._fields.secret.value
	}
	public set secret(value: $.Slice<number>) {
		this._fields.secret.value = value
	}

	public get hash(): (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null {
		return this._fields.hash.value
	}
	public set hash(value: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null) {
		this._fields.hash.value = value
	}

	public _fields: {
		secret: $.VarRef<$.Slice<number>>
		hash: $.VarRef<(() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null>
	}

	constructor(init?: Partial<{secret?: $.Slice<number>, hash?: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null}>) {
		this._fields = {
			secret: $.varRef(init?.secret ?? (null as $.Slice<number>)),
			hash: $.varRef(init?.hash ?? (null as (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null))
		}
	}

	public clone(): ExporterMasterSecret {
		const cloned = new ExporterMasterSecret()
		cloned._fields = {
			secret: $.varRef(this._fields.secret.value),
			hash: $.varRef(this._fields.hash.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Exporter(label: string, context: $.Slice<number>, length: number): globalThis.Promise<$.Slice<number>> {
		const s: ExporterMasterSecret | $.VarRef<ExporterMasterSecret> | null = this
		let secret: $.Slice<number> = await deriveSecret(undefined, $.pointerValue<ExporterMasterSecret>(s).hash, $.pointerValue<ExporterMasterSecret>(s).secret, label, null)
		let h = await $.pointerValue<ExporterMasterSecret>(s).hash!()
		await $.pointerValue<Exclude<hash2.Hash, null>>(h).Write(context)
		return ExpandLabel(undefined, $.pointerValue<ExporterMasterSecret>(s).hash, secret, "exporter", await $.pointerValue<Exclude<hash2.Hash, null>>(h).Sum(null), length)
	}

	static __typeInfo = $.registerStructType(
		"tls13.ExporterMasterSecret",
		() => new ExporterMasterSecret(),
		[{ name: "Exporter", args: [{ name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "context", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "length", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		ExporterMasterSecret,
		[{ name: "secret", key: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/tls13", index: [0], offset: 0, exported: false }, { name: "hash", key: "hash", type: ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo), pkgPath: "crypto/internal/fips140/tls13", index: [1], offset: 24, exported: false }]
	)
}

export const resumptionBinderLabel: string = "res binder"

export const clientEarlyTrafficLabel: string = "c e traffic"

export const clientHandshakeTrafficLabel: string = "c hs traffic"

export const serverHandshakeTrafficLabel: string = "s hs traffic"

export const clientApplicationTrafficLabel: string = "c ap traffic"

export const serverApplicationTrafficLabel: string = "s ap traffic"

export const earlyExporterLabel: string = "e exp master"

export const exporterLabel: string = "exp master"

export const resumptionLabel: string = "res master"

export async function ExpandLabel(__typeArgs: $.GenericTypeArgs | undefined, hash: (() => any | globalThis.Promise<any>) | null, secret: $.Slice<number>, label: string, context: $.Slice<number>, length: number): globalThis.Promise<$.Slice<number>> {
	if (((6 + $.len(label)) > 255) || ($.len(context) > 255)) {
		// It should be impossible for this to panic: labels are fixed strings,
		// and context is either a fixed-length computed hash, or parsed from a
		// field which has the same length limitation.
		//
		// Another reasonable approach might be to return a randomized slice if
		// we encounter an error, which would break the connection, but avoid
		// panicking. This would perhaps be safer but significantly more
		// confusing to users.
		$.panic("tls13: label or context too long")
	}
	let hkdfLabel: $.Slice<number> = $.makeSlice<number>(0, ((((2 + 1) + 6) + $.len(label)) + 1) + $.len(context), "byte")
	hkdfLabel = byteorder.BEAppendUint16(hkdfLabel, $.uint($.uint(length, 16), 16))
	hkdfLabel = $.append(hkdfLabel, $.uint($.uint(6 + $.len(label), 8), 8), $.byteSliceHint)
	hkdfLabel = $.appendSlice(hkdfLabel, $.stringToBytes("tls13 "), $.byteSliceHint)
	hkdfLabel = $.appendSlice(hkdfLabel, $.stringToBytes(label), $.byteSliceHint)
	hkdfLabel = $.append(hkdfLabel, $.uint($.uint($.len(context), 8), 8), $.byteSliceHint)
	hkdfLabel = $.appendSlice(hkdfLabel, context, $.byteSliceHint)
	return hkdf.Expand(undefined, hash, secret, $.bytesToString(hkdfLabel), length)
}

export async function extract(__typeArgs: $.GenericTypeArgs | undefined, hash: (() => any | globalThis.Promise<any>) | null, newSecret: $.Slice<number>, currentSecret: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
	if (newSecret == null) {
		newSecret = $.makeSlice<number>(await $.callGenericMethod(__typeArgs, "H", "Size", await hash!()), undefined, "byte")
	}
	return hkdf.Extract(undefined, hash, newSecret, currentSecret)
}

export async function deriveSecret(__typeArgs: $.GenericTypeArgs | undefined, hash: (() => any | globalThis.Promise<any>) | null, secret: $.Slice<number>, label: string, transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
	if (transcript == null) {
		transcript = (await hash!() as hash2.Hash | null)
	}
	return ExpandLabel(undefined, hash, secret, label, await $.pointerValue<Exclude<hash2.Hash, null>>(transcript).Sum(null), await $.pointerValue<Exclude<hash2.Hash, null>>(transcript).Size())
}

export async function NewEarlySecret(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, psk: $.Slice<number>): globalThis.Promise<EarlySecret | $.VarRef<EarlySecret> | null> {
	return (await (async () => { const __goscriptLiteralField2 = await extract(undefined, h, psk, null); return new EarlySecret({secret: __goscriptLiteralField2, hash: $.functionValue(async (): globalThis.Promise<hash2.Hash | null> => {
		return (await h!() as hash2.Hash | null)
	}, ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo))}) })())
}

export function TestingOnlyExporterSecret(s: ExporterMasterSecret | $.VarRef<ExporterMasterSecret> | null): $.Slice<number> {
	return $.pointerValue<ExporterMasterSecret>(s).secret
}
