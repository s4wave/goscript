// Generated file based on ticket.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as aes from "@goscript/crypto/aes/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"

import * as hmac from "@goscript/crypto/hmac/index.js"

import * as sha256 from "@goscript/crypto/sha256/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import type * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as hash from "@goscript/hash/index.js"

import * as net from "@goscript/net/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import type * as __goscript_alert from "./alert.gs.ts"

import * as __goscript_cache from "./cache.gs.ts"

import type * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_conn from "./conn.gs.ts"

import * as __goscript_ech from "./ech.gs.ts"

import type * as __goscript_handshake_client from "./handshake_client.gs.ts"

import type * as __goscript_handshake_client_tls13 from "./handshake_client_tls13.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import type * as __goscript_handshake_server from "./handshake_server.gs.ts"

import type * as __goscript_handshake_server_tls13 from "./handshake_server_tls13.gs.ts"

import type * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_quic from "./quic.gs.ts"
import "@goscript/crypto/aes/index.js"
import "@goscript/crypto/cipher/index.js"
import "@goscript/crypto/hmac/index.js"
import "@goscript/crypto/sha256/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/hash/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./cache.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./conn.gs.ts"
import "./ech.gs.ts"
import "./handshake_messages.gs.ts"
import "./quic.gs.ts"

export class SessionState {
	// Extra is ignored by crypto/tls, but is encoded by [SessionState.Bytes]
	// and parsed by [ParseSessionState].
	//
	// This allows [Config.UnwrapSession]/[Config.WrapSession] and
	// [ClientSessionCache] implementations to store and retrieve additional
	// data alongside this session.
	//
	// To allow different layers in a protocol stack to share this field,
	// applications must only append to it, not replace it, and must use entries
	// that can be recognized even if out of order (for example, by starting
	// with an id and version prefix).
	public get Extra(): $.Slice<$.Slice<number>> {
		return this._fields.Extra.value
	}
	public set Extra(value: $.Slice<$.Slice<number>>) {
		this._fields.Extra.value = value
	}

	// EarlyData indicates whether the ticket can be used for 0-RTT in a QUIC
	// connection. The application may set this to false if it is true to
	// decline to offer 0-RTT even if supported.
	public get EarlyData(): boolean {
		return this._fields.EarlyData.value
	}
	public set EarlyData(value: boolean) {
		this._fields.EarlyData.value = value
	}

	public get version(): number {
		return this._fields.version.value
	}
	public set version(value: number) {
		this._fields.version.value = value
	}

	public get isClient(): boolean {
		return this._fields.isClient.value
	}
	public set isClient(value: boolean) {
		this._fields.isClient.value = value
	}

	public get cipherSuite(): number {
		return this._fields.cipherSuite.value
	}
	public set cipherSuite(value: number) {
		this._fields.cipherSuite.value = value
	}

	// createdAt is the generation time of the secret on the server (which for
	// TLS 1.0–1.2 might be earlier than the current session) and the time at
	// which the ticket was received on the client.
	public get createdAt(): bigint {
		return this._fields.createdAt.value
	}
	public set createdAt(value: bigint) {
		this._fields.createdAt.value = value
	}

	public get secret(): $.Slice<number> {
		return this._fields.secret.value
	}
	public set secret(value: $.Slice<number>) {
		this._fields.secret.value = value
	}

	public get extMasterSecret(): boolean {
		return this._fields.extMasterSecret.value
	}
	public set extMasterSecret(value: boolean) {
		this._fields.extMasterSecret.value = value
	}

	public get peerCertificates(): $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null> {
		return this._fields.peerCertificates.value
	}
	public set peerCertificates(value: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>) {
		this._fields.peerCertificates.value = value
	}

	public get ocspResponse(): $.Slice<number> {
		return this._fields.ocspResponse.value
	}
	public set ocspResponse(value: $.Slice<number>) {
		this._fields.ocspResponse.value = value
	}

	public get scts(): $.Slice<$.Slice<number>> {
		return this._fields.scts.value
	}
	public set scts(value: $.Slice<$.Slice<number>>) {
		this._fields.scts.value = value
	}

	public get verifiedChains(): $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>> {
		return this._fields.verifiedChains.value
	}
	public set verifiedChains(value: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>) {
		this._fields.verifiedChains.value = value
	}

	public get alpnProtocol(): string {
		return this._fields.alpnProtocol.value
	}
	public set alpnProtocol(value: string) {
		this._fields.alpnProtocol.value = value
	}

	// Client-side TLS 1.3-only fields.
	public get useBy(): bigint {
		return this._fields.useBy.value
	}
	public set useBy(value: bigint) {
		this._fields.useBy.value = value
	}

	public get ageAdd(): number {
		return this._fields.ageAdd.value
	}
	public set ageAdd(value: number) {
		this._fields.ageAdd.value = value
	}

	public get ticket(): $.Slice<number> {
		return this._fields.ticket.value
	}
	public set ticket(value: $.Slice<number>) {
		this._fields.ticket.value = value
	}

	// TLS 1.0–1.2 only fields.
	public get curveID(): __goscript_common.CurveID {
		return this._fields.curveID.value
	}
	public set curveID(value: __goscript_common.CurveID) {
		this._fields.curveID.value = value
	}

	public _fields: {
		Extra: $.VarRef<$.Slice<$.Slice<number>>>
		EarlyData: $.VarRef<boolean>
		version: $.VarRef<number>
		isClient: $.VarRef<boolean>
		cipherSuite: $.VarRef<number>
		createdAt: $.VarRef<bigint>
		secret: $.VarRef<$.Slice<number>>
		extMasterSecret: $.VarRef<boolean>
		peerCertificates: $.VarRef<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>
		ocspResponse: $.VarRef<$.Slice<number>>
		scts: $.VarRef<$.Slice<$.Slice<number>>>
		verifiedChains: $.VarRef<$.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>>
		alpnProtocol: $.VarRef<string>
		useBy: $.VarRef<bigint>
		ageAdd: $.VarRef<number>
		ticket: $.VarRef<$.Slice<number>>
		curveID: $.VarRef<__goscript_common.CurveID>
	}

	constructor(init?: Partial<{Extra?: $.Slice<$.Slice<number>>, EarlyData?: boolean, version?: number, isClient?: boolean, cipherSuite?: number, createdAt?: bigint, secret?: $.Slice<number>, extMasterSecret?: boolean, peerCertificates?: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>, ocspResponse?: $.Slice<number>, scts?: $.Slice<$.Slice<number>>, verifiedChains?: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>, alpnProtocol?: string, useBy?: bigint, ageAdd?: number, ticket?: $.Slice<number>, curveID?: __goscript_common.CurveID}>) {
		this._fields = {
			Extra: $.varRef(init?.Extra ?? (null as $.Slice<$.Slice<number>>)),
			EarlyData: $.varRef(init?.EarlyData ?? (false as boolean)),
			version: $.varRef(init?.version ?? (0 as number)),
			isClient: $.varRef(init?.isClient ?? (false as boolean)),
			cipherSuite: $.varRef(init?.cipherSuite ?? (0 as number)),
			createdAt: $.varRef(init?.createdAt ?? (0n as bigint)),
			secret: $.varRef(init?.secret ?? (null as $.Slice<number>)),
			extMasterSecret: $.varRef(init?.extMasterSecret ?? (false as boolean)),
			peerCertificates: $.varRef(init?.peerCertificates ?? (null as $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>)),
			ocspResponse: $.varRef(init?.ocspResponse ?? (null as $.Slice<number>)),
			scts: $.varRef(init?.scts ?? (null as $.Slice<$.Slice<number>>)),
			verifiedChains: $.varRef(init?.verifiedChains ?? (null as $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>)),
			alpnProtocol: $.varRef(init?.alpnProtocol ?? ("" as string)),
			useBy: $.varRef(init?.useBy ?? (0n as bigint)),
			ageAdd: $.varRef(init?.ageAdd ?? (0 as number)),
			ticket: $.varRef(init?.ticket ?? (null as $.Slice<number>)),
			curveID: $.varRef(init?.curveID ?? (0 as __goscript_common.CurveID))
		}
	}

	public clone(): SessionState {
		const cloned = new SessionState()
		cloned._fields = {
			Extra: $.varRef(this._fields.Extra.value),
			EarlyData: $.varRef(this._fields.EarlyData.value),
			version: $.varRef(this._fields.version.value),
			isClient: $.varRef(this._fields.isClient.value),
			cipherSuite: $.varRef(this._fields.cipherSuite.value),
			createdAt: $.varRef(this._fields.createdAt.value),
			secret: $.varRef(this._fields.secret.value),
			extMasterSecret: $.varRef(this._fields.extMasterSecret.value),
			peerCertificates: $.varRef(this._fields.peerCertificates.value),
			ocspResponse: $.varRef(this._fields.ocspResponse.value),
			scts: $.varRef(this._fields.scts.value),
			verifiedChains: $.varRef(this._fields.verifiedChains.value),
			alpnProtocol: $.varRef(this._fields.alpnProtocol.value),
			useBy: $.varRef(this._fields.useBy.value),
			ageAdd: $.varRef(this._fields.ageAdd.value),
			ticket: $.varRef(this._fields.ticket.value),
			curveID: $.varRef(this._fields.curveID.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Bytes(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const s: SessionState | $.VarRef<SessionState> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint16($.uint($.pointerValue<SessionState>(s).version, 16))
		if ($.pointerValue<SessionState>(s).isClient) {
			b.value.AddUint8($.uint(2, 8))
		} else {
			b.value.AddUint8($.uint(1, 8))
		}
		b.value.AddUint16($.uint($.pointerValue<SessionState>(s).cipherSuite, 16))
		__goscript_handshake_messages.addUint64(b, $.pointerValue<SessionState>(s).createdAt)
		await b.value.AddUint8LengthPrefixed($.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
			cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<SessionState>(s).secret)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			for (let __goscriptRangeTarget0 = $.pointerValue<SessionState>(s).Extra, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
				let extra = __goscriptRangeTarget0![__rangeIndex]
				await cryptobyte.Builder.prototype.AddUint24LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(b, extra)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		if ($.pointerValue<SessionState>(s).extMasterSecret) {
			b.value.AddUint8($.uint(1, 8))
		} else {
			b.value.AddUint8($.uint(0, 8))
		}
		if ($.pointerValue<SessionState>(s).EarlyData) {
			b.value.AddUint8($.uint(1, 8))
		} else {
			b.value.AddUint8($.uint(0, 8))
		}
		await __goscript_handshake_messages.marshalCertificate(b, (() => { const __goscriptLiteralField0 = certificatesToBytesSlice($.pointerValue<SessionState>(s).peerCertificates); return $.markAsStructValue(new __goscript_common.Certificate({Certificate: __goscriptLiteralField0, OCSPStaple: $.pointerValue<SessionState>(s).ocspResponse, SignedCertificateTimestamps: $.pointerValue<SessionState>(s).scts})) })())
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			for (let __goscriptRangeTarget2 = $.pointerValue<SessionState>(s).verifiedChains, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
				let chain = __goscriptRangeTarget2![__rangeIndex]
				await cryptobyte.Builder.prototype.AddUint24LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					// We elide the first certificate because it's always the leaf.
					if ($.len(chain) == 0) {
						cryptobyte.Builder.prototype.SetError.call(b, errors.New("tls: internal error: empty verified chain"))
						return
					}
					for (let __goscriptRangeTarget1 = $.goSlice(chain, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
						let cert = __goscriptRangeTarget1![__rangeIndex]
						await cryptobyte.Builder.prototype.AddUint24LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
							cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<x509.Certificate>(cert).Raw)
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		if ($.pointerValue<SessionState>(s).EarlyData) {
			await b.value.AddUint8LengthPrefixed($.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(b, $.stringToBytes($.pointerValue<SessionState>(s).alpnProtocol))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.uint($.pointerValue<SessionState>(s).version, 16) >= $.uint(772, 16)) {
			if ($.pointerValue<SessionState>(s).isClient) {
				__goscript_handshake_messages.addUint64(b, $.pointerValue<SessionState>(s).useBy)
				b.value.AddUint32($.uint($.pointerValue<SessionState>(s).ageAdd, 32))
			}
		} else {
			b.value.AddUint16($.uint($.uint($.pointerValue<SessionState>(s).curveID, 16), 16))
		}
		return b.value.Bytes()
	}

	static __typeInfo = $.registerStructType(
		"tls.SessionState",
		() => new SessionState(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }],
		SessionState,
		[{ name: "Extra", key: "Extra", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, index: [0], offset: 0, exported: true }, { name: "EarlyData", key: "EarlyData", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [1], offset: 24, exported: true }, { name: "version", key: "version", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [2], offset: 26, exported: false }, { name: "isClient", key: "isClient", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [3], offset: 28, exported: false }, { name: "cipherSuite", key: "cipherSuite", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [4], offset: 30, exported: false }, { name: "createdAt", key: "createdAt", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/tls", index: [5], offset: 32, exported: false }, { name: "secret", key: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [6], offset: 40, exported: false }, { name: "extMasterSecret", key: "extMasterSecret", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [7], offset: 64, exported: false }, { name: "peerCertificates", key: "peerCertificates", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, pkgPath: "crypto/tls", index: [8], offset: 72, exported: false }, { name: "ocspResponse", key: "ocspResponse", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [9], offset: 96, exported: false }, { name: "scts", key: "scts", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "crypto/tls", index: [10], offset: 120, exported: false }, { name: "verifiedChains", key: "verifiedChains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } }, pkgPath: "crypto/tls", index: [11], offset: 144, exported: false }, { name: "alpnProtocol", key: "alpnProtocol", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/tls", index: [12], offset: 168, exported: false }, { name: "useBy", key: "useBy", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/tls", index: [13], offset: 184, exported: false }, { name: "ageAdd", key: "ageAdd", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "crypto/tls", index: [14], offset: 192, exported: false }, { name: "ticket", key: "ticket", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [15], offset: 200, exported: false }, { name: "curveID", key: "curveID", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }, pkgPath: "crypto/tls", index: [16], offset: 224, exported: false }]
	)
}

export class ClientSessionState {
	public get session(): SessionState | $.VarRef<SessionState> | null {
		return this._fields.session.value
	}
	public set session(value: SessionState | $.VarRef<SessionState> | null) {
		this._fields.session.value = value
	}

	public _fields: {
		session: $.VarRef<SessionState | $.VarRef<SessionState> | null>
	}

	constructor(init?: Partial<{session?: SessionState | $.VarRef<SessionState> | null}>) {
		this._fields = {
			session: $.varRef(init?.session ?? (null as SessionState | $.VarRef<SessionState> | null))
		}
	}

	public clone(): ClientSessionState {
		const cloned = new ClientSessionState()
		cloned._fields = {
			session: $.varRef(this._fields.session.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ResumptionState(): [$.Slice<number>, SessionState | $.VarRef<SessionState> | null, $.GoError] {
		const cs: ClientSessionState | $.VarRef<ClientSessionState> | null = this
		let ticket: $.Slice<number> = null as $.Slice<number>
		let state: SessionState | $.VarRef<SessionState> | null = null as SessionState | $.VarRef<SessionState> | null
		let err: $.GoError = null as $.GoError
		if ((cs == null) || ($.pointerValue<ClientSessionState>(cs).session == null)) {
			return [null, null, null]
		}
		return [$.pointerValue<SessionState>($.pointerValue<ClientSessionState>(cs).session).ticket, $.pointerValue<ClientSessionState>(cs).session, null]
	}

	static __typeInfo = $.registerStructType(
		"tls.ClientSessionState",
		() => new ClientSessionState(),
		[{ name: "ResumptionState", args: [], returns: [{ name: "ticket", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "state", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" } }, { name: "err", type: "error" }] }],
		ClientSessionState,
		[{ name: "session", key: "session", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export function certificatesToBytesSlice(certs: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>): $.Slice<$.Slice<number>> {
	let s: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>(0, $.len(certs))
	for (let __goscriptRangeTarget3 = certs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let c = __goscriptRangeTarget3![__rangeIndex]
		s = $.append(s, $.pointerValue<x509.Certificate>(c).Raw)
	}
	return s
}

export async function ParseSessionState(data: $.Slice<number>): globalThis.Promise<[SessionState | $.VarRef<SessionState> | null, $.GoError]> {
	let ss: SessionState | $.VarRef<SessionState> | null = new SessionState()
	let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))
	let typ: $.VarRef<number> = $.varRef(0)
	let extMasterSecret: $.VarRef<number> = $.varRef(0)
	let earlyData: $.VarRef<number> = $.varRef(0)
	let cert: $.VarRef<__goscript_common.Certificate> = $.varRef($.markAsStructValue(new __goscript_common.Certificate()))
	let extra: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (((((((((!cryptobyte.String_ReadUint16(s, $.pointerValue<SessionState>(ss)._fields.version) || !cryptobyte.String_ReadUint8(s, typ)) || !cryptobyte.String_ReadUint16(s, $.pointerValue<SessionState>(ss)._fields.cipherSuite)) || !__goscript_handshake_messages.readUint64(s, $.pointerValue<SessionState>(ss)._fields.createdAt)) || !__goscript_handshake_messages.readUint8LengthPrefixed(s, $.pointerValue<SessionState>(ss)._fields.secret)) || !cryptobyte.String_ReadUint24LengthPrefixed(s, extra)) || !cryptobyte.String_ReadUint8(s, extMasterSecret)) || !cryptobyte.String_ReadUint8(s, earlyData)) || ($.len($.pointerValue<SessionState>(ss).secret) == 0)) || !__goscript_handshake_messages.unmarshalCertificate(s, cert)) {
		return [null, errors.New("tls: invalid session encoding")]
	}
	while (!cryptobyte.String_Empty(extra.value)) {
		let e: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
		if (!__goscript_handshake_messages.readUint24LengthPrefixed(extra, e)) {
			return [null, errors.New("tls: invalid session encoding")]
		}
		$.pointerValue<SessionState>(ss).Extra = $.append($.pointerValue<SessionState>(ss).Extra, e.value)
	}
	switch (typ.value) {
		case 1:
		{
			$.pointerValue<SessionState>(ss).isClient = false
			break
		}
		case 2:
		{
			$.pointerValue<SessionState>(ss).isClient = true
			break
		}
		default:
		{
			return [null, errors.New("tls: unknown session encoding")]
			break
		}
	}
	switch (extMasterSecret.value) {
		case 0:
		{
			$.pointerValue<SessionState>(ss).extMasterSecret = false
			break
		}
		case 1:
		{
			$.pointerValue<SessionState>(ss).extMasterSecret = true
			break
		}
		default:
		{
			return [null, errors.New("tls: invalid session encoding")]
			break
		}
	}
	switch (earlyData.value) {
		case 0:
		{
			$.pointerValue<SessionState>(ss).EarlyData = false
			break
		}
		case 1:
		{
			$.pointerValue<SessionState>(ss).EarlyData = true
			break
		}
		default:
		{
			return [null, errors.New("tls: invalid session encoding")]
			break
		}
	}
	for (let __goscriptRangeTarget4 = cert.value.Certificate, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let __goscriptRangeShadow0 = __goscriptRangeTarget4![__rangeIndex]
		let __goscriptTuple0: any = await __goscript_cache.weakCertCache.prototype.newCert.call(__goscript_cache.globalCertCache, __goscriptRangeShadow0)
		let c: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		$.pointerValue<SessionState>(ss).peerCertificates = $.append($.pointerValue<SessionState>(ss).peerCertificates, c)
	}
	if ($.pointerValue<SessionState>(ss).isClient && ($.len($.pointerValue<SessionState>(ss).peerCertificates) == 0)) {
		return [null, errors.New("tls: no server certificates in client session")]
	}
	$.pointerValue<SessionState>(ss).ocspResponse = cert.value.OCSPStaple
	$.pointerValue<SessionState>(ss).scts = cert.value.SignedCertificateTimestamps
	let chainList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadUint24LengthPrefixed(s, chainList)) {
		return [null, errors.New("tls: invalid session encoding")]
	}
	while (!cryptobyte.String_Empty(chainList.value)) {
		let certList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!cryptobyte.String_ReadUint24LengthPrefixed(chainList, certList)) {
			return [null, errors.New("tls: invalid session encoding")]
		}
		let chain: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null> = null as $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>
		if ($.len($.pointerValue<SessionState>(ss).peerCertificates) == 0) {
			return [null, errors.New("tls: invalid session encoding")]
		}
		chain = $.append(chain, $.arrayIndex($.pointerValue<SessionState>(ss).peerCertificates!, 0))
		while (!cryptobyte.String_Empty(certList.value)) {
			let __goscriptShadow0: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
			if (!__goscript_handshake_messages.readUint24LengthPrefixed(certList, __goscriptShadow0)) {
				return [null, errors.New("tls: invalid session encoding")]
			}
			let __goscriptTuple1: any = await __goscript_cache.weakCertCache.prototype.newCert.call(__goscript_cache.globalCertCache, __goscriptShadow0.value)
			let c: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple1[0]
			let err = __goscriptTuple1[1]
			if (err != null) {
				return [null, err]
			}
			chain = $.append(chain, c)
		}
		$.pointerValue<SessionState>(ss).verifiedChains = $.append($.pointerValue<SessionState>(ss).verifiedChains, chain)
	}
	if ($.pointerValue<SessionState>(ss).EarlyData) {
		let alpn: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
		if (!__goscript_handshake_messages.readUint8LengthPrefixed(s, alpn)) {
			return [null, errors.New("tls: invalid session encoding")]
		}
		$.pointerValue<SessionState>(ss).alpnProtocol = $.bytesToString(alpn.value)
	}
	if ($.uint($.pointerValue<SessionState>(ss).version, 16) >= $.uint(772, 16)) {
		if ($.pointerValue<SessionState>(ss).isClient) {
			if (!cryptobyte.String_ReadUint64(s, $.pointerValue<SessionState>(ss)._fields.useBy) || !cryptobyte.String_ReadUint32(s, $.pointerValue<SessionState>(ss)._fields.ageAdd)) {
				return [null, errors.New("tls: invalid session encoding")]
			}
		}
	} else {
		if (!cryptobyte.String_ReadUint16(s, $.pointerValue<SessionState>(ss)._fields.curveID)) {
			return [null, errors.New("tls: invalid session encoding")]
		}
	}
	return [ss, null]
}

export function NewResumptionState(ticket: $.Slice<number>, state: SessionState | $.VarRef<SessionState> | null): [ClientSessionState | $.VarRef<ClientSessionState> | null, $.GoError] {
	$.pointerValue<SessionState>(state).ticket = ticket
	return [new ClientSessionState({session: state}), null]
}
