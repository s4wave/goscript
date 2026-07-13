// Generated file based on handshake_messages.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_ech from "./ech.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/x509/index.js"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./ech.gs.ts"

export type marshalingFunction = ((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null) => $.GoError | globalThis.Promise<$.GoError>) | null

export type transcriptHash = {
	Write(_p0: $.Slice<number>): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
}

$.registerInterfaceType(
	"tls.transcriptHash",
	null,
	[{ name: "Write", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }]
);

export class clientHelloMsg {
	public get original(): $.Slice<number> {
		return this._fields.original.value
	}
	public set original(value: $.Slice<number>) {
		this._fields.original.value = value
	}

	public get vers(): number {
		return this._fields.vers.value
	}
	public set vers(value: number) {
		this._fields.vers.value = value
	}

	public get random(): $.Slice<number> {
		return this._fields.random.value
	}
	public set random(value: $.Slice<number>) {
		this._fields.random.value = value
	}

	public get sessionId(): $.Slice<number> {
		return this._fields.sessionId.value
	}
	public set sessionId(value: $.Slice<number>) {
		this._fields.sessionId.value = value
	}

	public get cipherSuites(): $.Slice<number> {
		return this._fields.cipherSuites.value
	}
	public set cipherSuites(value: $.Slice<number>) {
		this._fields.cipherSuites.value = value
	}

	public get compressionMethods(): $.Slice<number> {
		return this._fields.compressionMethods.value
	}
	public set compressionMethods(value: $.Slice<number>) {
		this._fields.compressionMethods.value = value
	}

	public get serverName(): string {
		return this._fields.serverName.value
	}
	public set serverName(value: string) {
		this._fields.serverName.value = value
	}

	public get ocspStapling(): boolean {
		return this._fields.ocspStapling.value
	}
	public set ocspStapling(value: boolean) {
		this._fields.ocspStapling.value = value
	}

	public get supportedCurves(): $.Slice<__goscript_common.CurveID> {
		return this._fields.supportedCurves.value
	}
	public set supportedCurves(value: $.Slice<__goscript_common.CurveID>) {
		this._fields.supportedCurves.value = value
	}

	public get supportedPoints(): $.Slice<number> {
		return this._fields.supportedPoints.value
	}
	public set supportedPoints(value: $.Slice<number>) {
		this._fields.supportedPoints.value = value
	}

	public get ticketSupported(): boolean {
		return this._fields.ticketSupported.value
	}
	public set ticketSupported(value: boolean) {
		this._fields.ticketSupported.value = value
	}

	public get sessionTicket(): $.Slice<number> {
		return this._fields.sessionTicket.value
	}
	public set sessionTicket(value: $.Slice<number>) {
		this._fields.sessionTicket.value = value
	}

	public get supportedSignatureAlgorithms(): $.Slice<__goscript_common.SignatureScheme> {
		return this._fields.supportedSignatureAlgorithms.value
	}
	public set supportedSignatureAlgorithms(value: $.Slice<__goscript_common.SignatureScheme>) {
		this._fields.supportedSignatureAlgorithms.value = value
	}

	public get supportedSignatureAlgorithmsCert(): $.Slice<__goscript_common.SignatureScheme> {
		return this._fields.supportedSignatureAlgorithmsCert.value
	}
	public set supportedSignatureAlgorithmsCert(value: $.Slice<__goscript_common.SignatureScheme>) {
		this._fields.supportedSignatureAlgorithmsCert.value = value
	}

	public get secureRenegotiationSupported(): boolean {
		return this._fields.secureRenegotiationSupported.value
	}
	public set secureRenegotiationSupported(value: boolean) {
		this._fields.secureRenegotiationSupported.value = value
	}

	public get secureRenegotiation(): $.Slice<number> {
		return this._fields.secureRenegotiation.value
	}
	public set secureRenegotiation(value: $.Slice<number>) {
		this._fields.secureRenegotiation.value = value
	}

	public get extendedMasterSecret(): boolean {
		return this._fields.extendedMasterSecret.value
	}
	public set extendedMasterSecret(value: boolean) {
		this._fields.extendedMasterSecret.value = value
	}

	public get alpnProtocols(): $.Slice<string> {
		return this._fields.alpnProtocols.value
	}
	public set alpnProtocols(value: $.Slice<string>) {
		this._fields.alpnProtocols.value = value
	}

	public get scts(): boolean {
		return this._fields.scts.value
	}
	public set scts(value: boolean) {
		this._fields.scts.value = value
	}

	public get supportedVersions(): $.Slice<number> {
		return this._fields.supportedVersions.value
	}
	public set supportedVersions(value: $.Slice<number>) {
		this._fields.supportedVersions.value = value
	}

	public get cookie(): $.Slice<number> {
		return this._fields.cookie.value
	}
	public set cookie(value: $.Slice<number>) {
		this._fields.cookie.value = value
	}

	public get keyShares(): $.Slice<__goscript_common.keyShare> {
		return this._fields.keyShares.value
	}
	public set keyShares(value: $.Slice<__goscript_common.keyShare>) {
		this._fields.keyShares.value = value
	}

	public get earlyData(): boolean {
		return this._fields.earlyData.value
	}
	public set earlyData(value: boolean) {
		this._fields.earlyData.value = value
	}

	public get pskModes(): $.Slice<number> {
		return this._fields.pskModes.value
	}
	public set pskModes(value: $.Slice<number>) {
		this._fields.pskModes.value = value
	}

	public get pskIdentities(): $.Slice<__goscript_common.pskIdentity> {
		return this._fields.pskIdentities.value
	}
	public set pskIdentities(value: $.Slice<__goscript_common.pskIdentity>) {
		this._fields.pskIdentities.value = value
	}

	public get pskBinders(): $.Slice<$.Slice<number>> {
		return this._fields.pskBinders.value
	}
	public set pskBinders(value: $.Slice<$.Slice<number>>) {
		this._fields.pskBinders.value = value
	}

	public get quicTransportParameters(): $.Slice<number> {
		return this._fields.quicTransportParameters.value
	}
	public set quicTransportParameters(value: $.Slice<number>) {
		this._fields.quicTransportParameters.value = value
	}

	public get encryptedClientHello(): $.Slice<number> {
		return this._fields.encryptedClientHello.value
	}
	public set encryptedClientHello(value: $.Slice<number>) {
		this._fields.encryptedClientHello.value = value
	}

	// extensions are only populated on the server-side of a handshake
	public get extensions(): $.Slice<number> {
		return this._fields.extensions.value
	}
	public set extensions(value: $.Slice<number>) {
		this._fields.extensions.value = value
	}

	public _fields: {
		original: $.VarRef<$.Slice<number>>
		vers: $.VarRef<number>
		random: $.VarRef<$.Slice<number>>
		sessionId: $.VarRef<$.Slice<number>>
		cipherSuites: $.VarRef<$.Slice<number>>
		compressionMethods: $.VarRef<$.Slice<number>>
		serverName: $.VarRef<string>
		ocspStapling: $.VarRef<boolean>
		supportedCurves: $.VarRef<$.Slice<__goscript_common.CurveID>>
		supportedPoints: $.VarRef<$.Slice<number>>
		ticketSupported: $.VarRef<boolean>
		sessionTicket: $.VarRef<$.Slice<number>>
		supportedSignatureAlgorithms: $.VarRef<$.Slice<__goscript_common.SignatureScheme>>
		supportedSignatureAlgorithmsCert: $.VarRef<$.Slice<__goscript_common.SignatureScheme>>
		secureRenegotiationSupported: $.VarRef<boolean>
		secureRenegotiation: $.VarRef<$.Slice<number>>
		extendedMasterSecret: $.VarRef<boolean>
		alpnProtocols: $.VarRef<$.Slice<string>>
		scts: $.VarRef<boolean>
		supportedVersions: $.VarRef<$.Slice<number>>
		cookie: $.VarRef<$.Slice<number>>
		keyShares: $.VarRef<$.Slice<__goscript_common.keyShare>>
		earlyData: $.VarRef<boolean>
		pskModes: $.VarRef<$.Slice<number>>
		pskIdentities: $.VarRef<$.Slice<__goscript_common.pskIdentity>>
		pskBinders: $.VarRef<$.Slice<$.Slice<number>>>
		quicTransportParameters: $.VarRef<$.Slice<number>>
		encryptedClientHello: $.VarRef<$.Slice<number>>
		extensions: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{original?: $.Slice<number>, vers?: number, random?: $.Slice<number>, sessionId?: $.Slice<number>, cipherSuites?: $.Slice<number>, compressionMethods?: $.Slice<number>, serverName?: string, ocspStapling?: boolean, supportedCurves?: $.Slice<__goscript_common.CurveID>, supportedPoints?: $.Slice<number>, ticketSupported?: boolean, sessionTicket?: $.Slice<number>, supportedSignatureAlgorithms?: $.Slice<__goscript_common.SignatureScheme>, supportedSignatureAlgorithmsCert?: $.Slice<__goscript_common.SignatureScheme>, secureRenegotiationSupported?: boolean, secureRenegotiation?: $.Slice<number>, extendedMasterSecret?: boolean, alpnProtocols?: $.Slice<string>, scts?: boolean, supportedVersions?: $.Slice<number>, cookie?: $.Slice<number>, keyShares?: $.Slice<__goscript_common.keyShare>, earlyData?: boolean, pskModes?: $.Slice<number>, pskIdentities?: $.Slice<__goscript_common.pskIdentity>, pskBinders?: $.Slice<$.Slice<number>>, quicTransportParameters?: $.Slice<number>, encryptedClientHello?: $.Slice<number>, extensions?: $.Slice<number>}>) {
		this._fields = {
			original: $.varRef(init?.original ?? (null as $.Slice<number>)),
			vers: $.varRef(init?.vers ?? (0 as number)),
			random: $.varRef(init?.random ?? (null as $.Slice<number>)),
			sessionId: $.varRef(init?.sessionId ?? (null as $.Slice<number>)),
			cipherSuites: $.varRef(init?.cipherSuites ?? (null as $.Slice<number>)),
			compressionMethods: $.varRef(init?.compressionMethods ?? (null as $.Slice<number>)),
			serverName: $.varRef(init?.serverName ?? ("" as string)),
			ocspStapling: $.varRef(init?.ocspStapling ?? (false as boolean)),
			supportedCurves: $.varRef(init?.supportedCurves ?? (null as $.Slice<__goscript_common.CurveID>)),
			supportedPoints: $.varRef(init?.supportedPoints ?? (null as $.Slice<number>)),
			ticketSupported: $.varRef(init?.ticketSupported ?? (false as boolean)),
			sessionTicket: $.varRef(init?.sessionTicket ?? (null as $.Slice<number>)),
			supportedSignatureAlgorithms: $.varRef(init?.supportedSignatureAlgorithms ?? (null as $.Slice<__goscript_common.SignatureScheme>)),
			supportedSignatureAlgorithmsCert: $.varRef(init?.supportedSignatureAlgorithmsCert ?? (null as $.Slice<__goscript_common.SignatureScheme>)),
			secureRenegotiationSupported: $.varRef(init?.secureRenegotiationSupported ?? (false as boolean)),
			secureRenegotiation: $.varRef(init?.secureRenegotiation ?? (null as $.Slice<number>)),
			extendedMasterSecret: $.varRef(init?.extendedMasterSecret ?? (false as boolean)),
			alpnProtocols: $.varRef(init?.alpnProtocols ?? (null as $.Slice<string>)),
			scts: $.varRef(init?.scts ?? (false as boolean)),
			supportedVersions: $.varRef(init?.supportedVersions ?? (null as $.Slice<number>)),
			cookie: $.varRef(init?.cookie ?? (null as $.Slice<number>)),
			keyShares: $.varRef(init?.keyShares ?? (null as $.Slice<__goscript_common.keyShare>)),
			earlyData: $.varRef(init?.earlyData ?? (false as boolean)),
			pskModes: $.varRef(init?.pskModes ?? (null as $.Slice<number>)),
			pskIdentities: $.varRef(init?.pskIdentities ?? (null as $.Slice<__goscript_common.pskIdentity>)),
			pskBinders: $.varRef(init?.pskBinders ?? (null as $.Slice<$.Slice<number>>)),
			quicTransportParameters: $.varRef(init?.quicTransportParameters ?? (null as $.Slice<number>)),
			encryptedClientHello: $.varRef(init?.encryptedClientHello ?? (null as $.Slice<number>)),
			extensions: $.varRef(init?.extensions ?? (null as $.Slice<number>))
		}
	}

	public __goscriptClone(): clientHelloMsg {
		const cloned = new clientHelloMsg()
		cloned._fields = {
			original: $.varRef(this._fields.original.value),
			vers: $.varRef(this._fields.vers.value),
			random: $.varRef(this._fields.random.value),
			sessionId: $.varRef(this._fields.sessionId.value),
			cipherSuites: $.varRef(this._fields.cipherSuites.value),
			compressionMethods: $.varRef(this._fields.compressionMethods.value),
			serverName: $.varRef(this._fields.serverName.value),
			ocspStapling: $.varRef(this._fields.ocspStapling.value),
			supportedCurves: $.varRef(this._fields.supportedCurves.value),
			supportedPoints: $.varRef(this._fields.supportedPoints.value),
			ticketSupported: $.varRef(this._fields.ticketSupported.value),
			sessionTicket: $.varRef(this._fields.sessionTicket.value),
			supportedSignatureAlgorithms: $.varRef(this._fields.supportedSignatureAlgorithms.value),
			supportedSignatureAlgorithmsCert: $.varRef(this._fields.supportedSignatureAlgorithmsCert.value),
			secureRenegotiationSupported: $.varRef(this._fields.secureRenegotiationSupported.value),
			secureRenegotiation: $.varRef(this._fields.secureRenegotiation.value),
			extendedMasterSecret: $.varRef(this._fields.extendedMasterSecret.value),
			alpnProtocols: $.varRef(this._fields.alpnProtocols.value),
			scts: $.varRef(this._fields.scts.value),
			supportedVersions: $.varRef(this._fields.supportedVersions.value),
			cookie: $.varRef(this._fields.cookie.value),
			keyShares: $.varRef(this._fields.keyShares.value),
			earlyData: $.varRef(this._fields.earlyData.value),
			pskModes: $.varRef(this._fields.pskModes.value),
			pskIdentities: $.varRef(this._fields.pskIdentities.value),
			pskBinders: $.varRef(this._fields.pskBinders.value),
			quicTransportParameters: $.varRef(this._fields.quicTransportParameters.value),
			encryptedClientHello: $.varRef(this._fields.encryptedClientHello.value),
			extensions: $.varRef(this._fields.extensions.value)
		}
		return $.markAsStructValue(cloned)
	}

	public clone(): clientHelloMsg | $.VarRef<clientHelloMsg> | null {
		const m: clientHelloMsg | $.VarRef<clientHelloMsg> | null = this
		return (() => { const __goscriptLiteralField0 = slices.Clone($.pointerValue<clientHelloMsg>(m).original); const __goscriptLiteralField1 = slices.Clone($.pointerValue<clientHelloMsg>(m).random); const __goscriptLiteralField2 = slices.Clone($.pointerValue<clientHelloMsg>(m).sessionId); const __goscriptLiteralField3 = slices.Clone($.pointerValue<clientHelloMsg>(m).cipherSuites); const __goscriptLiteralField4 = slices.Clone($.pointerValue<clientHelloMsg>(m).compressionMethods); const __goscriptLiteralField5 = slices.Clone($.pointerValue<clientHelloMsg>(m).supportedCurves); const __goscriptLiteralField6 = slices.Clone($.pointerValue<clientHelloMsg>(m).supportedPoints); const __goscriptLiteralField7 = slices.Clone($.pointerValue<clientHelloMsg>(m).sessionTicket); const __goscriptLiteralField8 = slices.Clone($.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithms); const __goscriptLiteralField9 = slices.Clone($.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithmsCert); const __goscriptLiteralField10 = slices.Clone($.pointerValue<clientHelloMsg>(m).secureRenegotiation); const __goscriptLiteralField11 = slices.Clone($.pointerValue<clientHelloMsg>(m).alpnProtocols); const __goscriptLiteralField12 = slices.Clone($.pointerValue<clientHelloMsg>(m).supportedVersions); const __goscriptLiteralField13 = slices.Clone($.pointerValue<clientHelloMsg>(m).cookie); const __goscriptLiteralField14 = slices.Clone($.pointerValue<clientHelloMsg>(m).keyShares); const __goscriptLiteralField15 = slices.Clone($.pointerValue<clientHelloMsg>(m).pskModes); const __goscriptLiteralField16 = slices.Clone($.pointerValue<clientHelloMsg>(m).pskIdentities); const __goscriptLiteralField17 = slices.Clone($.pointerValue<clientHelloMsg>(m).pskBinders); const __goscriptLiteralField18 = slices.Clone($.pointerValue<clientHelloMsg>(m).quicTransportParameters); const __goscriptLiteralField19 = slices.Clone($.pointerValue<clientHelloMsg>(m).encryptedClientHello); return new clientHelloMsg({original: __goscriptLiteralField0, vers: $.uint($.pointerValue<clientHelloMsg>(m).vers, 16), random: __goscriptLiteralField1, sessionId: __goscriptLiteralField2, cipherSuites: __goscriptLiteralField3, compressionMethods: __goscriptLiteralField4, serverName: $.pointerValue<clientHelloMsg>(m).serverName, ocspStapling: $.pointerValue<clientHelloMsg>(m).ocspStapling, supportedCurves: __goscriptLiteralField5, supportedPoints: __goscriptLiteralField6, ticketSupported: $.pointerValue<clientHelloMsg>(m).ticketSupported, sessionTicket: __goscriptLiteralField7, supportedSignatureAlgorithms: __goscriptLiteralField8, supportedSignatureAlgorithmsCert: __goscriptLiteralField9, secureRenegotiationSupported: $.pointerValue<clientHelloMsg>(m).secureRenegotiationSupported, secureRenegotiation: __goscriptLiteralField10, extendedMasterSecret: $.pointerValue<clientHelloMsg>(m).extendedMasterSecret, alpnProtocols: __goscriptLiteralField11, scts: $.pointerValue<clientHelloMsg>(m).scts, supportedVersions: __goscriptLiteralField12, cookie: __goscriptLiteralField13, keyShares: __goscriptLiteralField14, earlyData: $.pointerValue<clientHelloMsg>(m).earlyData, pskModes: __goscriptLiteralField15, pskIdentities: __goscriptLiteralField16, pskBinders: __goscriptLiteralField17, quicTransportParameters: __goscriptLiteralField18, encryptedClientHello: __goscriptLiteralField19}) })()
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: clientHelloMsg | $.VarRef<clientHelloMsg> | null = this
		return clientHelloMsg.prototype.marshalMsg.call(m, false)
	}

	public async marshalMsg(echInner: boolean): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: clientHelloMsg | $.VarRef<clientHelloMsg> | null = this
		let exts: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		if ($.len($.pointerValue<clientHelloMsg>(m).serverName) > 0) {
			// RFC 6066, Section 3
			exts.value.AddUint16($.uint(0, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					cryptobyte.Builder.prototype.AddUint8.call(exts, $.uint(0, 8))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(exts, $.stringToBytes($.pointerValue<clientHelloMsg>(m).serverName))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if (($.len($.pointerValue<clientHelloMsg>(m).supportedPoints) > 0) && !echInner) {
			// RFC 4492, Section 5.1.2
			exts.value.AddUint16($.uint(11, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<clientHelloMsg>(m).supportedPoints)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.pointerValue<clientHelloMsg>(m).ticketSupported && !echInner) {
			// RFC 5077, Section 3.2
			exts.value.AddUint16($.uint(35, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<clientHelloMsg>(m).sessionTicket)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.pointerValue<clientHelloMsg>(m).secureRenegotiationSupported && !echInner) {
			// RFC 5746, Section 3.2
			exts.value.AddUint16($.uint(65281, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<clientHelloMsg>(m).secureRenegotiation)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.pointerValue<clientHelloMsg>(m).extendedMasterSecret && !echInner) {
			// RFC 7627
			exts.value.AddUint16($.uint(23, 16))
			exts.value.AddUint16($.uint(0, 16))
		}
		if ($.pointerValue<clientHelloMsg>(m).scts) {
			// RFC 6962, Section 3.3.1
			exts.value.AddUint16($.uint(18, 16))
			exts.value.AddUint16($.uint(0, 16))
		}
		if ($.pointerValue<clientHelloMsg>(m).earlyData) {
			// RFC 8446, Section 4.2.10
			exts.value.AddUint16($.uint(42, 16))
			exts.value.AddUint16($.uint(0, 16))
		}
		if ($.pointerValue<clientHelloMsg>(m).quicTransportParameters != null) {
			// RFC 9001, Section 8.2
			exts.value.AddUint16($.uint(57, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<clientHelloMsg>(m).quicTransportParameters)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).encryptedClientHello) > 0) {
			exts.value.AddUint16($.uint(65037, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<clientHelloMsg>(m).encryptedClientHello)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		// Note that any extension that can be compressed during ECH must be
		// contiguous. If any additional extensions are to be compressed they must
		// be added to the following block, so that they can be properly
		// decompressed on the other side.
		let echOuterExts: $.Slice<number> = null as $.Slice<number>
		if ($.pointerValue<clientHelloMsg>(m).ocspStapling) {
			// RFC 4366, Section 3.6
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(5, 16))
			} else {
				exts.value.AddUint16($.uint(5, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddUint8.call(exts, $.uint(1, 8))
					cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint(0, 16))
					cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint(0, 16))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).supportedCurves) > 0) {
			// RFC 4492, sections 5.1.1 and RFC 8446, Section 4.2.7
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(10, 16))
			} else {
				exts.value.AddUint16($.uint(10, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						for (let __goscriptRangeTarget0 = $.pointerValue<clientHelloMsg>(m).supportedCurves, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
							let curve = __goscriptRangeTarget0![__rangeIndex]
							cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint($.uint(curve, 16), 16))
						}
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithms) > 0) {
			// RFC 5246, Section 7.4.1.4.1
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(13, 16))
			} else {
				exts.value.AddUint16($.uint(13, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						for (let __goscriptRangeTarget1 = $.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithms, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
							let sigAlgo = __goscriptRangeTarget1![__rangeIndex]
							cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint($.uint(sigAlgo, 16), 16))
						}
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithmsCert) > 0) {
			// RFC 8446, Section 4.2.3
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(50, 16))
			} else {
				exts.value.AddUint16($.uint(50, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						for (let __goscriptRangeTarget2 = $.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithmsCert, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
							let sigAlgo = __goscriptRangeTarget2![__rangeIndex]
							cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint($.uint(sigAlgo, 16), 16))
						}
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).alpnProtocols) > 0) {
			// RFC 7301, Section 3.1
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(16, 16))
			} else {
				exts.value.AddUint16($.uint(16, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						for (let __goscriptRangeTarget3 = $.pointerValue<clientHelloMsg>(m).alpnProtocols, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
							let proto = __goscriptRangeTarget3![__rangeIndex]
							await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
								cryptobyte.Builder.prototype.AddBytes.call(exts, $.stringToBytes(proto))
							}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
						}
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).supportedVersions) > 0) {
			// RFC 8446, Section 4.2.1
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(43, 16))
			} else {
				exts.value.AddUint16($.uint(43, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						for (let __goscriptRangeTarget4 = $.pointerValue<clientHelloMsg>(m).supportedVersions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
							let vers = __goscriptRangeTarget4![__rangeIndex]
							cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint(vers, 16))
						}
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).cookie) > 0) {
			// RFC 8446, Section 4.2.2
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(44, 16))
			} else {
				exts.value.AddUint16($.uint(44, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<clientHelloMsg>(m).cookie)
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).keyShares) > 0) {
			// RFC 8446, Section 4.2.8
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(51, 16))
			} else {
				exts.value.AddUint16($.uint(51, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						for (let __goscriptRangeTarget5 = $.pointerValue<clientHelloMsg>(m).keyShares, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
							let ks = __goscriptRangeTarget5![__rangeIndex]
							cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint($.uint(ks.group, 16), 16))
							await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
								cryptobyte.Builder.prototype.AddBytes.call(exts, ks.data)
							}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
						}
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if ($.len($.pointerValue<clientHelloMsg>(m).pskModes) > 0) {
			// RFC 8446, Section 4.2.9
			if (echInner) {
				echOuterExts = $.append(echOuterExts, $.uint(45, 16))
			} else {
				exts.value.AddUint16($.uint(45, 16))
				await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<clientHelloMsg>(m).pskModes)
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
		if (($.len(echOuterExts) > 0) && echInner) {
			exts.value.AddUint16($.uint(64768, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					for (let __goscriptRangeTarget6 = echOuterExts, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
						let e = __goscriptRangeTarget6![__rangeIndex]
						cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint(e, 16))
					}
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		// pre_shared_key must be the last extension
		if (($.len($.pointerValue<clientHelloMsg>(m).pskIdentities) > 0) && ((echInner || ($.len($.pointerValue<clientHelloMsg>(m).encryptedClientHello) == 0)) || bytes.Equal($.pointerValue<clientHelloMsg>(m).encryptedClientHello, new Uint8Array([1]) as $.Slice<number>))) {
			// RFC 8446, Section 4.2.11
			exts.value.AddUint16($.uint(41, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					for (let __goscriptRangeTarget7 = $.pointerValue<clientHelloMsg>(m).pskIdentities, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget7); __rangeIndex++) {
						let psk = __goscriptRangeTarget7![__rangeIndex]
						await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
							cryptobyte.Builder.prototype.AddBytes.call(exts, psk.label)
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
						cryptobyte.Builder.prototype.AddUint32.call(exts, $.uint(psk.obfuscatedTicketAge, 32))
					}
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					for (let __goscriptRangeTarget8 = $.pointerValue<clientHelloMsg>(m).pskBinders, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
						let binder = __goscriptRangeTarget8![__rangeIndex]
						await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
							cryptobyte.Builder.prototype.AddBytes.call(exts, binder)
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		let __goscriptTuple0: any = exts.value.Bytes()
		let extBytes: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}

		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(1, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			cryptobyte.Builder.prototype.AddUint16.call(b, $.uint($.pointerValue<clientHelloMsg>(m).vers, 16))
			await addBytesWithLength(b, $.pointerValue<clientHelloMsg>(m).random, 32)
			await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				if (!echInner) {
					cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<clientHelloMsg>(m).sessionId)
				}
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				for (let __goscriptRangeTarget9 = $.pointerValue<clientHelloMsg>(m).cipherSuites, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
					let suite = __goscriptRangeTarget9![__rangeIndex]
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(suite, 16))
				}
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<clientHelloMsg>(m).compressionMethods)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

			if ($.len(extBytes) > 0) {
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(b, extBytes)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public async marshalWithoutBinders(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: clientHelloMsg | $.VarRef<clientHelloMsg> | null = this
		let bindersLen = 2
		for (let __goscriptRangeTarget10 = $.pointerValue<clientHelloMsg>(m).pskBinders, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
			let binder = __goscriptRangeTarget10![__rangeIndex]
			bindersLen = bindersLen + (1)
			bindersLen = bindersLen + ($.len(binder))
		}

		let fullMessage: $.Slice<number> = null as $.Slice<number>
		if ($.pointerValue<clientHelloMsg>(m).original != null) {
			fullMessage = $.pointerValue<clientHelloMsg>(m).original
		} else {
			let err: $.GoError = null as $.GoError
			let __goscriptTuple1: any = await clientHelloMsg.prototype.marshal.call(m)
			fullMessage = __goscriptTuple1[0]
			err = __goscriptTuple1[1]
			if (err != null) {
				return [null, err]
			}
		}
		return [$.goSlice(fullMessage, undefined, $.len(fullMessage) - bindersLen), null]
	}

	public originalBytes(): $.Slice<number> {
		const m: clientHelloMsg | $.VarRef<clientHelloMsg> | null = this
		return $.pointerValue<clientHelloMsg>(m).original
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: clientHelloMsg | $.VarRef<clientHelloMsg> | null = this
		$.assignStruct($.pointerValue<clientHelloMsg>(m), $.markAsStructValue(new clientHelloMsg({original: data})))
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		if (((!cryptobyte.String_Skip(s, 4) || !cryptobyte.String_ReadUint16(s, $.pointerValue<clientHelloMsg>(m)._fields.vers)) || !cryptobyte.String_ReadBytes(s, $.pointerValue<clientHelloMsg>(m)._fields.random, 32)) || !readUint8LengthPrefixed(s, $.pointerValue<clientHelloMsg>(m)._fields.sessionId)) {
			return false
		}

		let cipherSuites: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!cryptobyte.String_ReadUint16LengthPrefixed(s, cipherSuites)) {
			return false
		}
		$.pointerValue<clientHelloMsg>(m).cipherSuites = $.arrayToSlice<number>([])
		$.pointerValue<clientHelloMsg>(m).secureRenegotiationSupported = false
		while (!cryptobyte.String_Empty(cipherSuites.value)) {
			let suite: $.VarRef<number> = $.varRef(0)
			if (!cryptobyte.String_ReadUint16(cipherSuites, suite)) {
				return false
			}
			if ($.uint(suite.value, 16) == $.uint(255, 16)) {
				$.pointerValue<clientHelloMsg>(m).secureRenegotiationSupported = true
			}
			$.pointerValue<clientHelloMsg>(m).cipherSuites = $.append($.pointerValue<clientHelloMsg>(m).cipherSuites, $.uint(suite.value, 16))
		}

		if (!readUint8LengthPrefixed(s, $.pointerValue<clientHelloMsg>(m)._fields.compressionMethods)) {
			return false
		}

		if (cryptobyte.String_Empty(s.value)) {
			// ClientHello is optionally followed by extension data
			return true
		}

		let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!cryptobyte.String_ReadUint16LengthPrefixed(s, extensions) || !cryptobyte.String_Empty(s.value)) {
			return false
		}

		let seenExts: globalThis.Map<number, boolean> | null = $.makeMap<number, boolean>()
		while (!cryptobyte.String_Empty(extensions.value)) {
			let extension: $.VarRef<number> = $.varRef(0)
			let extData: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadUint16(extensions, extension) || !cryptobyte.String_ReadUint16LengthPrefixed(extensions, extData)) {
				return false
			}

			if ($.mapGet<number, boolean, boolean>(seenExts, $.uint(extension.value, 16), false)[0]) {
				return false
			}
			$.mapSet(seenExts, $.uint(extension.value, 16), true)
			$.pointerValue<clientHelloMsg>(m).extensions = $.append($.pointerValue<clientHelloMsg>(m).extensions, $.uint(extension.value, 16))

			switch (extension.value) {
				case 0:
				{
					let nameList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, nameList) || cryptobyte.String_Empty(nameList.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(nameList.value)) {
						let nameType: $.VarRef<number> = $.varRef(0)
						let serverName: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
						if ((!cryptobyte.String_ReadUint8(nameList, nameType) || !cryptobyte.String_ReadUint16LengthPrefixed(nameList, serverName)) || cryptobyte.String_Empty(serverName.value)) {
							return false
						}
						if ($.uint(nameType.value, 8) != $.uint(0, 8)) {
							continue
						}
						if ($.len($.pointerValue<clientHelloMsg>(m).serverName) != 0) {
							// Multiple names of the same name_type are prohibited.
							return false
						}
						$.pointerValue<clientHelloMsg>(m).serverName = $.bytesToString(serverName.value)
						// An SNI value may not include a trailing dot.
						if (strings.HasSuffix($.pointerValue<clientHelloMsg>(m).serverName, ".")) {
							return false
						}
					}
					break
				}
				case 5:
				{
					let statusType: $.VarRef<number> = $.varRef(0)
					let ignored: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if ((!cryptobyte.String_ReadUint8(extData, statusType) || !cryptobyte.String_ReadUint16LengthPrefixed(extData, ignored)) || !cryptobyte.String_ReadUint16LengthPrefixed(extData, ignored)) {
						return false
					}
					$.pointerValue<clientHelloMsg>(m).ocspStapling = $.uint(statusType.value, 8) == $.uint(1, 8)
					break
				}
				case 10:
				{
					let curves: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, curves) || cryptobyte.String_Empty(curves.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(curves.value)) {
						let curve: $.VarRef<number> = $.varRef(0)
						if (!cryptobyte.String_ReadUint16(curves, curve)) {
							return false
						}
						$.pointerValue<clientHelloMsg>(m).supportedCurves = $.append($.pointerValue<clientHelloMsg>(m).supportedCurves, $.uint($.uint(curve.value, 16), 16))
					}
					break
				}
				case 11:
				{
					if (!readUint8LengthPrefixed(extData, $.pointerValue<clientHelloMsg>(m)._fields.supportedPoints) || ($.len($.pointerValue<clientHelloMsg>(m).supportedPoints) == 0)) {
						return false
					}
					break
				}
				case 35:
				{
					$.pointerValue<clientHelloMsg>(m).ticketSupported = true
					cryptobyte.String_ReadBytes(extData, $.pointerValue<clientHelloMsg>(m)._fields.sessionTicket, $.len((extData.value as cryptobyte.String)))
					break
				}
				case 13:
				{
					let sigAndAlgs: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, sigAndAlgs) || cryptobyte.String_Empty(sigAndAlgs.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(sigAndAlgs.value)) {
						let sigAndAlg: $.VarRef<number> = $.varRef(0)
						if (!cryptobyte.String_ReadUint16(sigAndAlgs, sigAndAlg)) {
							return false
						}
						$.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithms = $.append($.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithms, $.uint($.uint(sigAndAlg.value, 16), 16))
					}
					break
				}
				case 50:
				{
					let sigAndAlgs: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, sigAndAlgs) || cryptobyte.String_Empty(sigAndAlgs.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(sigAndAlgs.value)) {
						let sigAndAlg: $.VarRef<number> = $.varRef(0)
						if (!cryptobyte.String_ReadUint16(sigAndAlgs, sigAndAlg)) {
							return false
						}
						$.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithmsCert = $.append($.pointerValue<clientHelloMsg>(m).supportedSignatureAlgorithmsCert, $.uint($.uint(sigAndAlg.value, 16), 16))
					}
					break
				}
				case 65281:
				{
					if (!readUint8LengthPrefixed(extData, $.pointerValue<clientHelloMsg>(m)._fields.secureRenegotiation)) {
						return false
					}
					$.pointerValue<clientHelloMsg>(m).secureRenegotiationSupported = true
					break
				}
				case 23:
				{
					$.pointerValue<clientHelloMsg>(m).extendedMasterSecret = true
					break
				}
				case 16:
				{
					let protoList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, protoList) || cryptobyte.String_Empty(protoList.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(protoList.value)) {
						let proto: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
						if (!cryptobyte.String_ReadUint8LengthPrefixed(protoList, proto) || cryptobyte.String_Empty(proto.value)) {
							return false
						}
						$.pointerValue<clientHelloMsg>(m).alpnProtocols = $.append($.pointerValue<clientHelloMsg>(m).alpnProtocols, $.bytesToString(proto.value))
					}
					break
				}
				case 18:
				{
					$.pointerValue<clientHelloMsg>(m).scts = true
					break
				}
				case 43:
				{
					let versList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint8LengthPrefixed(extData, versList) || cryptobyte.String_Empty(versList.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(versList.value)) {
						let vers: $.VarRef<number> = $.varRef(0)
						if (!cryptobyte.String_ReadUint16(versList, vers)) {
							return false
						}
						$.pointerValue<clientHelloMsg>(m).supportedVersions = $.append($.pointerValue<clientHelloMsg>(m).supportedVersions, $.uint(vers.value, 16))
					}
					break
				}
				case 44:
				{
					if (!readUint16LengthPrefixed(extData, $.pointerValue<clientHelloMsg>(m)._fields.cookie) || ($.len($.pointerValue<clientHelloMsg>(m).cookie) == 0)) {
						return false
					}
					break
				}
				case 51:
				{
					let clientShares: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, clientShares)) {
						return false
					}
					while (!cryptobyte.String_Empty(clientShares.value)) {
						let ks: __goscript_common.keyShare = $.markAsStructValue(new __goscript_common.keyShare())
						if ((!cryptobyte.String_ReadUint16(clientShares, ks._fields.group) || !readUint16LengthPrefixed(clientShares, ks._fields.data)) || ($.len(ks.data) == 0)) {
							return false
						}
						$.pointerValue<clientHelloMsg>(m).keyShares = $.append($.pointerValue<clientHelloMsg>(m).keyShares, ks)
					}
					break
				}
				case 42:
				{
					$.pointerValue<clientHelloMsg>(m).earlyData = true
					break
				}
				case 45:
				{
					if (!readUint8LengthPrefixed(extData, $.pointerValue<clientHelloMsg>(m)._fields.pskModes)) {
						return false
					}
					break
				}
				case 57:
				{
					$.pointerValue<clientHelloMsg>(m).quicTransportParameters = $.makeSlice<number>($.len((extData.value as cryptobyte.String)), undefined, "byte")
					if (!cryptobyte.String_CopyBytes(extData, $.pointerValue<clientHelloMsg>(m).quicTransportParameters)) {
						return false
					}
					break
				}
				case 41:
				{
					if (!cryptobyte.String_Empty(extensions.value)) {
						return false
					}
					let identities: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, identities) || cryptobyte.String_Empty(identities.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(identities.value)) {
						let psk: __goscript_common.pskIdentity = $.markAsStructValue(new __goscript_common.pskIdentity())
						if ((!readUint16LengthPrefixed(identities, psk._fields.label) || !cryptobyte.String_ReadUint32(identities, psk._fields.obfuscatedTicketAge)) || ($.len(psk.label) == 0)) {
							return false
						}
						$.pointerValue<clientHelloMsg>(m).pskIdentities = $.append($.pointerValue<clientHelloMsg>(m).pskIdentities, psk)
					}
					let binders: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, binders) || cryptobyte.String_Empty(binders.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(binders.value)) {
						let binder: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
						if (!readUint8LengthPrefixed(binders, binder) || ($.len(binder.value) == 0)) {
							return false
						}
						$.pointerValue<clientHelloMsg>(m).pskBinders = $.append($.pointerValue<clientHelloMsg>(m).pskBinders, binder.value)
					}
					break
				}
				case 65037:
				{
					if (!cryptobyte.String_ReadBytes(extData, $.pointerValue<clientHelloMsg>(m)._fields.encryptedClientHello, $.len((extData.value as cryptobyte.String)))) {
						return false
					}
					break
				}
				default:
				{
					continue
					break
				}
			}

			if (!cryptobyte.String_Empty(extData.value)) {
				return false
			}
		}

		return true
	}

	public updateBinders(pskBinders: $.Slice<$.Slice<number>>): $.GoError {
		let m: clientHelloMsg | $.VarRef<clientHelloMsg> | null = this
		if ($.len(pskBinders) != $.len($.pointerValue<clientHelloMsg>(m).pskBinders)) {
			return errors.New("tls: internal error: pskBinders length mismatch")
		}
		for (let __goscriptRangeTarget11 = $.pointerValue<clientHelloMsg>(m).pskBinders, i = 0; i < $.len(__goscriptRangeTarget11); i++) {
			if ($.len($.arrayIndex(pskBinders!, i)) != $.len($.arrayIndex($.pointerValue<clientHelloMsg>(m).pskBinders!, i))) {
				return errors.New("tls: internal error: pskBinders length mismatch")
			}
		}
		$.pointerValue<clientHelloMsg>(m).pskBinders = pskBinders

		return null
	}

	static __typeInfo = $.registerStructType(
		"tls.clientHelloMsg",
		() => new clientHelloMsg(),
		[{ name: "clone", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }] }, { name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "marshalMsg", args: [{ name: "echInner", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "marshalWithoutBinders", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "originalBytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "updateBinders", args: [{ name: "pskBinders", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }], returns: [{ name: "_r0", type: "error" }] }],
		clientHelloMsg,
		[{ name: "original", key: "original", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "vers", key: "vers", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [1], offset: 24, exported: false }, { name: "random", key: "random", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [2], offset: 32, exported: false }, { name: "sessionId", key: "sessionId", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [3], offset: 56, exported: false }, { name: "cipherSuites", key: "cipherSuites", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }, pkgPath: "crypto/tls", index: [4], offset: 80, exported: false }, { name: "compressionMethods", key: "compressionMethods", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [5], offset: 104, exported: false }, { name: "serverName", key: "serverName", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/tls", index: [6], offset: 128, exported: false }, { name: "ocspStapling", key: "ocspStapling", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [7], offset: 144, exported: false }, { name: "supportedCurves", key: "supportedCurves", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" } }, pkgPath: "crypto/tls", index: [8], offset: 152, exported: false }, { name: "supportedPoints", key: "supportedPoints", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [9], offset: 176, exported: false }, { name: "ticketSupported", key: "ticketSupported", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [10], offset: 200, exported: false }, { name: "sessionTicket", key: "sessionTicket", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [11], offset: 208, exported: false }, { name: "supportedSignatureAlgorithms", key: "supportedSignatureAlgorithms", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" } }, pkgPath: "crypto/tls", index: [12], offset: 232, exported: false }, { name: "supportedSignatureAlgorithmsCert", key: "supportedSignatureAlgorithmsCert", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" } }, pkgPath: "crypto/tls", index: [13], offset: 256, exported: false }, { name: "secureRenegotiationSupported", key: "secureRenegotiationSupported", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [14], offset: 280, exported: false }, { name: "secureRenegotiation", key: "secureRenegotiation", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [15], offset: 288, exported: false }, { name: "extendedMasterSecret", key: "extendedMasterSecret", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [16], offset: 312, exported: false }, { name: "alpnProtocols", key: "alpnProtocols", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "crypto/tls", index: [17], offset: 320, exported: false }, { name: "scts", key: "scts", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [18], offset: 344, exported: false }, { name: "supportedVersions", key: "supportedVersions", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }, pkgPath: "crypto/tls", index: [19], offset: 352, exported: false }, { name: "cookie", key: "cookie", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [20], offset: 376, exported: false }, { name: "keyShares", key: "keyShares", type: { kind: $.TypeKind.Slice, elemType: "tls.keyShare" }, pkgPath: "crypto/tls", index: [21], offset: 400, exported: false }, { name: "earlyData", key: "earlyData", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [22], offset: 424, exported: false }, { name: "pskModes", key: "pskModes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [23], offset: 432, exported: false }, { name: "pskIdentities", key: "pskIdentities", type: { kind: $.TypeKind.Slice, elemType: "tls.pskIdentity" }, pkgPath: "crypto/tls", index: [24], offset: 456, exported: false }, { name: "pskBinders", key: "pskBinders", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "crypto/tls", index: [25], offset: 480, exported: false }, { name: "quicTransportParameters", key: "quicTransportParameters", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [26], offset: 504, exported: false }, { name: "encryptedClientHello", key: "encryptedClientHello", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [27], offset: 528, exported: false }, { name: "extensions", key: "extensions", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }, pkgPath: "crypto/tls", index: [28], offset: 552, exported: false }]
	)
}

export class serverHelloMsg {
	public get original(): $.Slice<number> {
		return this._fields.original.value
	}
	public set original(value: $.Slice<number>) {
		this._fields.original.value = value
	}

	public get vers(): number {
		return this._fields.vers.value
	}
	public set vers(value: number) {
		this._fields.vers.value = value
	}

	public get random(): $.Slice<number> {
		return this._fields.random.value
	}
	public set random(value: $.Slice<number>) {
		this._fields.random.value = value
	}

	public get sessionId(): $.Slice<number> {
		return this._fields.sessionId.value
	}
	public set sessionId(value: $.Slice<number>) {
		this._fields.sessionId.value = value
	}

	public get cipherSuite(): number {
		return this._fields.cipherSuite.value
	}
	public set cipherSuite(value: number) {
		this._fields.cipherSuite.value = value
	}

	public get compressionMethod(): number {
		return this._fields.compressionMethod.value
	}
	public set compressionMethod(value: number) {
		this._fields.compressionMethod.value = value
	}

	public get ocspStapling(): boolean {
		return this._fields.ocspStapling.value
	}
	public set ocspStapling(value: boolean) {
		this._fields.ocspStapling.value = value
	}

	public get ticketSupported(): boolean {
		return this._fields.ticketSupported.value
	}
	public set ticketSupported(value: boolean) {
		this._fields.ticketSupported.value = value
	}

	public get secureRenegotiationSupported(): boolean {
		return this._fields.secureRenegotiationSupported.value
	}
	public set secureRenegotiationSupported(value: boolean) {
		this._fields.secureRenegotiationSupported.value = value
	}

	public get secureRenegotiation(): $.Slice<number> {
		return this._fields.secureRenegotiation.value
	}
	public set secureRenegotiation(value: $.Slice<number>) {
		this._fields.secureRenegotiation.value = value
	}

	public get extendedMasterSecret(): boolean {
		return this._fields.extendedMasterSecret.value
	}
	public set extendedMasterSecret(value: boolean) {
		this._fields.extendedMasterSecret.value = value
	}

	public get alpnProtocol(): string {
		return this._fields.alpnProtocol.value
	}
	public set alpnProtocol(value: string) {
		this._fields.alpnProtocol.value = value
	}

	public get scts(): $.Slice<$.Slice<number>> {
		return this._fields.scts.value
	}
	public set scts(value: $.Slice<$.Slice<number>>) {
		this._fields.scts.value = value
	}

	public get supportedVersion(): number {
		return this._fields.supportedVersion.value
	}
	public set supportedVersion(value: number) {
		this._fields.supportedVersion.value = value
	}

	public get serverShare(): __goscript_common.keyShare {
		return this._fields.serverShare.value
	}
	public set serverShare(value: __goscript_common.keyShare) {
		this._fields.serverShare.value = value
	}

	public get selectedIdentityPresent(): boolean {
		return this._fields.selectedIdentityPresent.value
	}
	public set selectedIdentityPresent(value: boolean) {
		this._fields.selectedIdentityPresent.value = value
	}

	public get selectedIdentity(): number {
		return this._fields.selectedIdentity.value
	}
	public set selectedIdentity(value: number) {
		this._fields.selectedIdentity.value = value
	}

	public get supportedPoints(): $.Slice<number> {
		return this._fields.supportedPoints.value
	}
	public set supportedPoints(value: $.Slice<number>) {
		this._fields.supportedPoints.value = value
	}

	public get encryptedClientHello(): $.Slice<number> {
		return this._fields.encryptedClientHello.value
	}
	public set encryptedClientHello(value: $.Slice<number>) {
		this._fields.encryptedClientHello.value = value
	}

	public get serverNameAck(): boolean {
		return this._fields.serverNameAck.value
	}
	public set serverNameAck(value: boolean) {
		this._fields.serverNameAck.value = value
	}

	// HelloRetryRequest extensions
	public get cookie(): $.Slice<number> {
		return this._fields.cookie.value
	}
	public set cookie(value: $.Slice<number>) {
		this._fields.cookie.value = value
	}

	public get selectedGroup(): __goscript_common.CurveID {
		return this._fields.selectedGroup.value
	}
	public set selectedGroup(value: __goscript_common.CurveID) {
		this._fields.selectedGroup.value = value
	}

	public _fields: {
		original: $.VarRef<$.Slice<number>>
		vers: $.VarRef<number>
		random: $.VarRef<$.Slice<number>>
		sessionId: $.VarRef<$.Slice<number>>
		cipherSuite: $.VarRef<number>
		compressionMethod: $.VarRef<number>
		ocspStapling: $.VarRef<boolean>
		ticketSupported: $.VarRef<boolean>
		secureRenegotiationSupported: $.VarRef<boolean>
		secureRenegotiation: $.VarRef<$.Slice<number>>
		extendedMasterSecret: $.VarRef<boolean>
		alpnProtocol: $.VarRef<string>
		scts: $.VarRef<$.Slice<$.Slice<number>>>
		supportedVersion: $.VarRef<number>
		serverShare: $.VarRef<__goscript_common.keyShare>
		selectedIdentityPresent: $.VarRef<boolean>
		selectedIdentity: $.VarRef<number>
		supportedPoints: $.VarRef<$.Slice<number>>
		encryptedClientHello: $.VarRef<$.Slice<number>>
		serverNameAck: $.VarRef<boolean>
		cookie: $.VarRef<$.Slice<number>>
		selectedGroup: $.VarRef<__goscript_common.CurveID>
	}

	constructor(init?: Partial<{original?: $.Slice<number>, vers?: number, random?: $.Slice<number>, sessionId?: $.Slice<number>, cipherSuite?: number, compressionMethod?: number, ocspStapling?: boolean, ticketSupported?: boolean, secureRenegotiationSupported?: boolean, secureRenegotiation?: $.Slice<number>, extendedMasterSecret?: boolean, alpnProtocol?: string, scts?: $.Slice<$.Slice<number>>, supportedVersion?: number, serverShare?: __goscript_common.keyShare, selectedIdentityPresent?: boolean, selectedIdentity?: number, supportedPoints?: $.Slice<number>, encryptedClientHello?: $.Slice<number>, serverNameAck?: boolean, cookie?: $.Slice<number>, selectedGroup?: __goscript_common.CurveID}>) {
		this._fields = {
			original: $.varRef(init?.original ?? (null as $.Slice<number>)),
			vers: $.varRef(init?.vers ?? (0 as number)),
			random: $.varRef(init?.random ?? (null as $.Slice<number>)),
			sessionId: $.varRef(init?.sessionId ?? (null as $.Slice<number>)),
			cipherSuite: $.varRef(init?.cipherSuite ?? (0 as number)),
			compressionMethod: $.varRef(init?.compressionMethod ?? (0 as number)),
			ocspStapling: $.varRef(init?.ocspStapling ?? (false as boolean)),
			ticketSupported: $.varRef(init?.ticketSupported ?? (false as boolean)),
			secureRenegotiationSupported: $.varRef(init?.secureRenegotiationSupported ?? (false as boolean)),
			secureRenegotiation: $.varRef(init?.secureRenegotiation ?? (null as $.Slice<number>)),
			extendedMasterSecret: $.varRef(init?.extendedMasterSecret ?? (false as boolean)),
			alpnProtocol: $.varRef(init?.alpnProtocol ?? ("" as string)),
			scts: $.varRef(init?.scts ?? (null as $.Slice<$.Slice<number>>)),
			supportedVersion: $.varRef(init?.supportedVersion ?? (0 as number)),
			serverShare: $.varRef(init?.serverShare ? $.markAsStructValue($.cloneStructValue(init.serverShare)) : $.markAsStructValue(new __goscript_common.keyShare())),
			selectedIdentityPresent: $.varRef(init?.selectedIdentityPresent ?? (false as boolean)),
			selectedIdentity: $.varRef(init?.selectedIdentity ?? (0 as number)),
			supportedPoints: $.varRef(init?.supportedPoints ?? (null as $.Slice<number>)),
			encryptedClientHello: $.varRef(init?.encryptedClientHello ?? (null as $.Slice<number>)),
			serverNameAck: $.varRef(init?.serverNameAck ?? (false as boolean)),
			cookie: $.varRef(init?.cookie ?? (null as $.Slice<number>)),
			selectedGroup: $.varRef(init?.selectedGroup ?? (0 as __goscript_common.CurveID))
		}
	}

	public clone(): serverHelloMsg {
		const cloned = new serverHelloMsg()
		cloned._fields = {
			original: $.varRef(this._fields.original.value),
			vers: $.varRef(this._fields.vers.value),
			random: $.varRef(this._fields.random.value),
			sessionId: $.varRef(this._fields.sessionId.value),
			cipherSuite: $.varRef(this._fields.cipherSuite.value),
			compressionMethod: $.varRef(this._fields.compressionMethod.value),
			ocspStapling: $.varRef(this._fields.ocspStapling.value),
			ticketSupported: $.varRef(this._fields.ticketSupported.value),
			secureRenegotiationSupported: $.varRef(this._fields.secureRenegotiationSupported.value),
			secureRenegotiation: $.varRef(this._fields.secureRenegotiation.value),
			extendedMasterSecret: $.varRef(this._fields.extendedMasterSecret.value),
			alpnProtocol: $.varRef(this._fields.alpnProtocol.value),
			scts: $.varRef(this._fields.scts.value),
			supportedVersion: $.varRef(this._fields.supportedVersion.value),
			serverShare: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.serverShare.value))),
			selectedIdentityPresent: $.varRef(this._fields.selectedIdentityPresent.value),
			selectedIdentity: $.varRef(this._fields.selectedIdentity.value),
			supportedPoints: $.varRef(this._fields.supportedPoints.value),
			encryptedClientHello: $.varRef(this._fields.encryptedClientHello.value),
			serverNameAck: $.varRef(this._fields.serverNameAck.value),
			cookie: $.varRef(this._fields.cookie.value),
			selectedGroup: $.varRef(this._fields.selectedGroup.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: serverHelloMsg | $.VarRef<serverHelloMsg> | null = this
		let exts: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		if ($.pointerValue<serverHelloMsg>(m).ocspStapling) {
			exts.value.AddUint16($.uint(5, 16))
			exts.value.AddUint16($.uint(0, 16))
		}
		if ($.pointerValue<serverHelloMsg>(m).ticketSupported) {
			exts.value.AddUint16($.uint(35, 16))
			exts.value.AddUint16($.uint(0, 16))
		}
		if ($.pointerValue<serverHelloMsg>(m).secureRenegotiationSupported) {
			exts.value.AddUint16($.uint(65281, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<serverHelloMsg>(m).secureRenegotiation)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.pointerValue<serverHelloMsg>(m).extendedMasterSecret) {
			exts.value.AddUint16($.uint(23, 16))
			exts.value.AddUint16($.uint(0, 16))
		}
		if ($.len($.pointerValue<serverHelloMsg>(m).alpnProtocol) > 0) {
			exts.value.AddUint16($.uint(16, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(exts, $.stringToBytes($.pointerValue<serverHelloMsg>(m).alpnProtocol))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.len($.pointerValue<serverHelloMsg>(m).scts) > 0) {
			exts.value.AddUint16($.uint(18, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					for (let __goscriptRangeTarget12 = $.pointerValue<serverHelloMsg>(m).scts, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
						let sct = __goscriptRangeTarget12![__rangeIndex]
						await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
							cryptobyte.Builder.prototype.AddBytes.call(exts, sct)
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.uint($.pointerValue<serverHelloMsg>(m).supportedVersion, 16) != $.uint(0, 16)) {
			exts.value.AddUint16($.uint(43, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint($.pointerValue<serverHelloMsg>(m).supportedVersion, 16))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.uint($.pointerValue<serverHelloMsg>(m).serverShare.group, 16) != $.uint(0, 16)) {
			exts.value.AddUint16($.uint(51, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint($.uint($.pointerValue<serverHelloMsg>(m).serverShare.group, 16), 16))
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<serverHelloMsg>(m).serverShare.data)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.pointerValue<serverHelloMsg>(m).selectedIdentityPresent) {
			exts.value.AddUint16($.uint(41, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint($.pointerValue<serverHelloMsg>(m).selectedIdentity, 16))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}

		if ($.len($.pointerValue<serverHelloMsg>(m).cookie) > 0) {
			exts.value.AddUint16($.uint(44, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<serverHelloMsg>(m).cookie)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.uint($.pointerValue<serverHelloMsg>(m).selectedGroup, 16) != $.uint(0, 16)) {
			exts.value.AddUint16($.uint(51, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddUint16.call(exts, $.uint($.uint($.pointerValue<serverHelloMsg>(m).selectedGroup, 16), 16))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.len($.pointerValue<serverHelloMsg>(m).supportedPoints) > 0) {
			exts.value.AddUint16($.uint(11, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue(async (exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(exts, $.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<serverHelloMsg>(m).supportedPoints)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.len($.pointerValue<serverHelloMsg>(m).encryptedClientHello) > 0) {
			exts.value.AddUint16($.uint(65037, 16))
			await exts.value.AddUint16LengthPrefixed($.functionValue((exts: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(exts, $.pointerValue<serverHelloMsg>(m).encryptedClientHello)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
		if ($.pointerValue<serverHelloMsg>(m).serverNameAck) {
			exts.value.AddUint16($.uint(0, 16))
			exts.value.AddUint16($.uint(0, 16))
		}

		let __goscriptTuple2: any = exts.value.Bytes()
		let extBytes: $.Slice<number> = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		if (err != null) {
			return [null, err]
		}

		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(2, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			cryptobyte.Builder.prototype.AddUint16.call(b, $.uint($.pointerValue<serverHelloMsg>(m).vers, 16))
			await addBytesWithLength(b, $.pointerValue<serverHelloMsg>(m).random, 32)
			await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<serverHelloMsg>(m).sessionId)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			cryptobyte.Builder.prototype.AddUint16.call(b, $.uint($.pointerValue<serverHelloMsg>(m).cipherSuite, 16))
			cryptobyte.Builder.prototype.AddUint8.call(b, $.uint($.pointerValue<serverHelloMsg>(m).compressionMethod, 8))

			if ($.len(extBytes) > 0) {
				await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(b, extBytes)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public originalBytes(): $.Slice<number> {
		const m: serverHelloMsg | $.VarRef<serverHelloMsg> | null = this
		return $.pointerValue<serverHelloMsg>(m).original
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: serverHelloMsg | $.VarRef<serverHelloMsg> | null = this
		$.assignStruct($.pointerValue<serverHelloMsg>(m), $.markAsStructValue(new serverHelloMsg({original: data})))
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		if (((((!cryptobyte.String_Skip(s, 4) || !cryptobyte.String_ReadUint16(s, $.pointerValue<serverHelloMsg>(m)._fields.vers)) || !cryptobyte.String_ReadBytes(s, $.pointerValue<serverHelloMsg>(m)._fields.random, 32)) || !readUint8LengthPrefixed(s, $.pointerValue<serverHelloMsg>(m)._fields.sessionId)) || !cryptobyte.String_ReadUint16(s, $.pointerValue<serverHelloMsg>(m)._fields.cipherSuite)) || !cryptobyte.String_ReadUint8(s, $.pointerValue<serverHelloMsg>(m)._fields.compressionMethod)) {
			return false
		}

		if (cryptobyte.String_Empty(s.value)) {
			// ServerHello is optionally followed by extension data
			return true
		}

		let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!cryptobyte.String_ReadUint16LengthPrefixed(s, extensions) || !cryptobyte.String_Empty(s.value)) {
			return false
		}

		let seenExts: globalThis.Map<number, boolean> | null = $.makeMap<number, boolean>()
		while (!cryptobyte.String_Empty(extensions.value)) {
			let extension: $.VarRef<number> = $.varRef(0)
			let extData: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadUint16(extensions, extension) || !cryptobyte.String_ReadUint16LengthPrefixed(extensions, extData)) {
				return false
			}

			if ($.mapGet<number, boolean, boolean>(seenExts, $.uint(extension.value, 16), false)[0]) {
				return false
			}
			$.mapSet(seenExts, $.uint(extension.value, 16), true)

			switch (extension.value) {
				case 5:
				{
					$.pointerValue<serverHelloMsg>(m).ocspStapling = true
					break
				}
				case 35:
				{
					$.pointerValue<serverHelloMsg>(m).ticketSupported = true
					break
				}
				case 65281:
				{
					if (!readUint8LengthPrefixed(extData, $.pointerValue<serverHelloMsg>(m)._fields.secureRenegotiation)) {
						return false
					}
					$.pointerValue<serverHelloMsg>(m).secureRenegotiationSupported = true
					break
				}
				case 23:
				{
					$.pointerValue<serverHelloMsg>(m).extendedMasterSecret = true
					break
				}
				case 16:
				{
					let protoList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, protoList) || cryptobyte.String_Empty(protoList.value)) {
						return false
					}
					let proto: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if ((!cryptobyte.String_ReadUint8LengthPrefixed(protoList, proto) || cryptobyte.String_Empty(proto.value)) || !cryptobyte.String_Empty(protoList.value)) {
						return false
					}
					$.pointerValue<serverHelloMsg>(m).alpnProtocol = $.bytesToString(proto.value)
					break
				}
				case 18:
				{
					let sctList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, sctList) || cryptobyte.String_Empty(sctList.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(sctList.value)) {
						let sct: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
						if (!readUint16LengthPrefixed(sctList, sct) || ($.len(sct.value) == 0)) {
							return false
						}
						$.pointerValue<serverHelloMsg>(m).scts = $.append($.pointerValue<serverHelloMsg>(m).scts, sct.value)
					}
					break
				}
				case 43:
				{
					if (!cryptobyte.String_ReadUint16(extData, $.pointerValue<serverHelloMsg>(m)._fields.supportedVersion)) {
						return false
					}
					break
				}
				case 44:
				{
					if (!readUint16LengthPrefixed(extData, $.pointerValue<serverHelloMsg>(m)._fields.cookie) || ($.len($.pointerValue<serverHelloMsg>(m).cookie) == 0)) {
						return false
					}
					break
				}
				case 51:
				{
					if ($.len((extData.value as cryptobyte.String)) == 2) {
						if (!cryptobyte.String_ReadUint16(extData, $.pointerValue<serverHelloMsg>(m)._fields.selectedGroup)) {
							return false
						}
					} else {
						if (!cryptobyte.String_ReadUint16(extData, $.pointerValue<serverHelloMsg>(m).serverShare._fields.group) || !readUint16LengthPrefixed(extData, $.pointerValue<serverHelloMsg>(m).serverShare._fields.data)) {
							return false
						}
					}
					break
				}
				case 41:
				{
					$.pointerValue<serverHelloMsg>(m).selectedIdentityPresent = true
					if (!cryptobyte.String_ReadUint16(extData, $.pointerValue<serverHelloMsg>(m)._fields.selectedIdentity)) {
						return false
					}
					break
				}
				case 11:
				{
					if (!readUint8LengthPrefixed(extData, $.pointerValue<serverHelloMsg>(m)._fields.supportedPoints) || ($.len($.pointerValue<serverHelloMsg>(m).supportedPoints) == 0)) {
						return false
					}
					break
				}
				case 65037:
				{
					$.pointerValue<serverHelloMsg>(m).encryptedClientHello = $.makeSlice<number>($.len((extData.value as cryptobyte.String)), undefined, "byte")
					if (!cryptobyte.String_CopyBytes(extData, $.pointerValue<serverHelloMsg>(m).encryptedClientHello)) {
						return false
					}
					break
				}
				case 0:
				{
					if ($.len((extData.value as cryptobyte.String)) != 0) {
						return false
					}
					$.pointerValue<serverHelloMsg>(m).serverNameAck = true
					break
				}
				default:
				{
					continue
					break
				}
			}

			if (!cryptobyte.String_Empty(extData.value)) {
				return false
			}
		}

		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.serverHelloMsg",
		() => new serverHelloMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "originalBytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		serverHelloMsg,
		[{ name: "original", key: "original", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "vers", key: "vers", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [1], offset: 24, exported: false }, { name: "random", key: "random", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [2], offset: 32, exported: false }, { name: "sessionId", key: "sessionId", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [3], offset: 56, exported: false }, { name: "cipherSuite", key: "cipherSuite", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [4], offset: 80, exported: false }, { name: "compressionMethod", key: "compressionMethod", type: { kind: $.TypeKind.Basic, name: "uint8" }, pkgPath: "crypto/tls", index: [5], offset: 82, exported: false }, { name: "ocspStapling", key: "ocspStapling", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [6], offset: 83, exported: false }, { name: "ticketSupported", key: "ticketSupported", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [7], offset: 84, exported: false }, { name: "secureRenegotiationSupported", key: "secureRenegotiationSupported", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [8], offset: 85, exported: false }, { name: "secureRenegotiation", key: "secureRenegotiation", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [9], offset: 88, exported: false }, { name: "extendedMasterSecret", key: "extendedMasterSecret", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [10], offset: 112, exported: false }, { name: "alpnProtocol", key: "alpnProtocol", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/tls", index: [11], offset: 120, exported: false }, { name: "scts", key: "scts", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "crypto/tls", index: [12], offset: 136, exported: false }, { name: "supportedVersion", key: "supportedVersion", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [13], offset: 160, exported: false }, { name: "serverShare", key: "serverShare", type: "tls.keyShare", pkgPath: "crypto/tls", index: [14], offset: 168, exported: false }, { name: "selectedIdentityPresent", key: "selectedIdentityPresent", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [15], offset: 200, exported: false }, { name: "selectedIdentity", key: "selectedIdentity", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [16], offset: 202, exported: false }, { name: "supportedPoints", key: "supportedPoints", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [17], offset: 208, exported: false }, { name: "encryptedClientHello", key: "encryptedClientHello", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [18], offset: 232, exported: false }, { name: "serverNameAck", key: "serverNameAck", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [19], offset: 256, exported: false }, { name: "cookie", key: "cookie", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [20], offset: 264, exported: false }, { name: "selectedGroup", key: "selectedGroup", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }, pkgPath: "crypto/tls", index: [21], offset: 288, exported: false }]
	)
}

export class encryptedExtensionsMsg {
	public get alpnProtocol(): string {
		return this._fields.alpnProtocol.value
	}
	public set alpnProtocol(value: string) {
		this._fields.alpnProtocol.value = value
	}

	public get quicTransportParameters(): $.Slice<number> {
		return this._fields.quicTransportParameters.value
	}
	public set quicTransportParameters(value: $.Slice<number>) {
		this._fields.quicTransportParameters.value = value
	}

	public get earlyData(): boolean {
		return this._fields.earlyData.value
	}
	public set earlyData(value: boolean) {
		this._fields.earlyData.value = value
	}

	public get echRetryConfigs(): $.Slice<number> {
		return this._fields.echRetryConfigs.value
	}
	public set echRetryConfigs(value: $.Slice<number>) {
		this._fields.echRetryConfigs.value = value
	}

	public get serverNameAck(): boolean {
		return this._fields.serverNameAck.value
	}
	public set serverNameAck(value: boolean) {
		this._fields.serverNameAck.value = value
	}

	public _fields: {
		alpnProtocol: $.VarRef<string>
		quicTransportParameters: $.VarRef<$.Slice<number>>
		earlyData: $.VarRef<boolean>
		echRetryConfigs: $.VarRef<$.Slice<number>>
		serverNameAck: $.VarRef<boolean>
	}

	constructor(init?: Partial<{alpnProtocol?: string, quicTransportParameters?: $.Slice<number>, earlyData?: boolean, echRetryConfigs?: $.Slice<number>, serverNameAck?: boolean}>) {
		this._fields = {
			alpnProtocol: $.varRef(init?.alpnProtocol ?? ("" as string)),
			quicTransportParameters: $.varRef(init?.quicTransportParameters ?? (null as $.Slice<number>)),
			earlyData: $.varRef(init?.earlyData ?? (false as boolean)),
			echRetryConfigs: $.varRef(init?.echRetryConfigs ?? (null as $.Slice<number>)),
			serverNameAck: $.varRef(init?.serverNameAck ?? (false as boolean))
		}
	}

	public clone(): encryptedExtensionsMsg {
		const cloned = new encryptedExtensionsMsg()
		cloned._fields = {
			alpnProtocol: $.varRef(this._fields.alpnProtocol.value),
			quicTransportParameters: $.varRef(this._fields.quicTransportParameters.value),
			earlyData: $.varRef(this._fields.earlyData.value),
			echRetryConfigs: $.varRef(this._fields.echRetryConfigs.value),
			serverNameAck: $.varRef(this._fields.serverNameAck.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: encryptedExtensionsMsg | $.VarRef<encryptedExtensionsMsg> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(8, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				if ($.len($.pointerValue<encryptedExtensionsMsg>(m).alpnProtocol) > 0) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(16, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
							await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
								cryptobyte.Builder.prototype.AddBytes.call(b, $.stringToBytes($.pointerValue<encryptedExtensionsMsg>(m).alpnProtocol))
							}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
				if ($.pointerValue<encryptedExtensionsMsg>(m).quicTransportParameters != null) {
					// draft-ietf-quic-tls-32, Section 8.2
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(57, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<encryptedExtensionsMsg>(m).quicTransportParameters)
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
				if ($.pointerValue<encryptedExtensionsMsg>(m).earlyData) {
					// RFC 8446, Section 4.2.10
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(42, 16))
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(0, 16))
				}
				if ($.len($.pointerValue<encryptedExtensionsMsg>(m).echRetryConfigs) > 0) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(65037, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<encryptedExtensionsMsg>(m).echRetryConfigs)
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
				if ($.pointerValue<encryptedExtensionsMsg>(m).serverNameAck) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(0, 16))
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(0, 16))
				}
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: encryptedExtensionsMsg | $.VarRef<encryptedExtensionsMsg> | null = this
		$.assignStruct($.pointerValue<encryptedExtensionsMsg>(m), $.markAsStructValue(new encryptedExtensionsMsg()))
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if ((!cryptobyte.String_Skip(s, 4) || !cryptobyte.String_ReadUint16LengthPrefixed(s, extensions)) || !cryptobyte.String_Empty(s.value)) {
			return false
		}

		let seenExts: globalThis.Map<number, boolean> | null = $.makeMap<number, boolean>()
		while (!cryptobyte.String_Empty(extensions.value)) {
			let extension: $.VarRef<number> = $.varRef(0)
			let extData: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadUint16(extensions, extension) || !cryptobyte.String_ReadUint16LengthPrefixed(extensions, extData)) {
				return false
			}

			if ($.mapGet<number, boolean, boolean>(seenExts, $.uint(extension.value, 16), false)[0]) {
				return false
			}
			$.mapSet(seenExts, $.uint(extension.value, 16), true)

			switch (extension.value) {
				case 16:
				{
					let protoList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, protoList) || cryptobyte.String_Empty(protoList.value)) {
						return false
					}
					let proto: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if ((!cryptobyte.String_ReadUint8LengthPrefixed(protoList, proto) || cryptobyte.String_Empty(proto.value)) || !cryptobyte.String_Empty(protoList.value)) {
						return false
					}
					$.pointerValue<encryptedExtensionsMsg>(m).alpnProtocol = $.bytesToString(proto.value)
					break
				}
				case 57:
				{
					$.pointerValue<encryptedExtensionsMsg>(m).quicTransportParameters = $.makeSlice<number>($.len((extData.value as cryptobyte.String)), undefined, "byte")
					if (!cryptobyte.String_CopyBytes(extData, $.pointerValue<encryptedExtensionsMsg>(m).quicTransportParameters)) {
						return false
					}
					break
				}
				case 42:
				{
					$.pointerValue<encryptedExtensionsMsg>(m).earlyData = true
					break
				}
				case 65037:
				{
					$.pointerValue<encryptedExtensionsMsg>(m).echRetryConfigs = $.makeSlice<number>($.len((extData.value as cryptobyte.String)), undefined, "byte")
					if (!cryptobyte.String_CopyBytes(extData, $.pointerValue<encryptedExtensionsMsg>(m).echRetryConfigs)) {
						return false
					}
					break
				}
				case 0:
				{
					if ($.len((extData.value as cryptobyte.String)) != 0) {
						return false
					}
					$.pointerValue<encryptedExtensionsMsg>(m).serverNameAck = true
					break
				}
				default:
				{
					continue
					break
				}
			}

			if (!cryptobyte.String_Empty(extData.value)) {
				return false
			}
		}

		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.encryptedExtensionsMsg",
		() => new encryptedExtensionsMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		encryptedExtensionsMsg,
		[{ name: "alpnProtocol", key: "alpnProtocol", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "quicTransportParameters", key: "quicTransportParameters", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [1], offset: 16, exported: false }, { name: "earlyData", key: "earlyData", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [2], offset: 40, exported: false }, { name: "echRetryConfigs", key: "echRetryConfigs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [3], offset: 48, exported: false }, { name: "serverNameAck", key: "serverNameAck", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [4], offset: 72, exported: false }]
	)
}

export class endOfEarlyDataMsg {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): endOfEarlyDataMsg {
		const cloned = new endOfEarlyDataMsg()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public marshal(): [$.Slice<number>, $.GoError] {
		const m: endOfEarlyDataMsg | $.VarRef<endOfEarlyDataMsg> | null = this
		let x: $.Slice<number> = $.makeSlice<number>(4, undefined, "byte")
		x![0] = $.uint(5, 8)
		return [x, null]
	}

	public unmarshal(data: $.Slice<number>): boolean {
		const m: endOfEarlyDataMsg | $.VarRef<endOfEarlyDataMsg> | null = this
		return $.len(data) == 4
	}

	static __typeInfo = $.registerStructType(
		"tls.endOfEarlyDataMsg",
		() => new endOfEarlyDataMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		endOfEarlyDataMsg,
		[]
	)
}

export class keyUpdateMsg {
	public get updateRequested(): boolean {
		return this._fields.updateRequested.value
	}
	public set updateRequested(value: boolean) {
		this._fields.updateRequested.value = value
	}

	public _fields: {
		updateRequested: $.VarRef<boolean>
	}

	constructor(init?: Partial<{updateRequested?: boolean}>) {
		this._fields = {
			updateRequested: $.varRef(init?.updateRequested ?? (false as boolean))
		}
	}

	public clone(): keyUpdateMsg {
		const cloned = new keyUpdateMsg()
		cloned._fields = {
			updateRequested: $.varRef(this._fields.updateRequested.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: keyUpdateMsg | $.VarRef<keyUpdateMsg> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(24, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
			if ($.pointerValue<keyUpdateMsg>(m).updateRequested) {
				cryptobyte.Builder.prototype.AddUint8.call(b, $.uint(1, 8))
			} else {
				cryptobyte.Builder.prototype.AddUint8.call(b, $.uint(0, 8))
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: keyUpdateMsg | $.VarRef<keyUpdateMsg> | null = this
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		let updateRequested: $.VarRef<number> = $.varRef(0)
		if ((!cryptobyte.String_Skip(s, 4) || !cryptobyte.String_ReadUint8(s, updateRequested)) || !cryptobyte.String_Empty(s.value)) {
			return false
		}
		switch (updateRequested.value) {
			case 0:
			{
				$.pointerValue<keyUpdateMsg>(m).updateRequested = false
				break
			}
			case 1:
			{
				$.pointerValue<keyUpdateMsg>(m).updateRequested = true
				break
			}
			default:
			{
				return false
				break
			}
		}
		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.keyUpdateMsg",
		() => new keyUpdateMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		keyUpdateMsg,
		[{ name: "updateRequested", key: "updateRequested", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class newSessionTicketMsgTLS13 {
	public get lifetime(): number {
		return this._fields.lifetime.value
	}
	public set lifetime(value: number) {
		this._fields.lifetime.value = value
	}

	public get ageAdd(): number {
		return this._fields.ageAdd.value
	}
	public set ageAdd(value: number) {
		this._fields.ageAdd.value = value
	}

	public get nonce(): $.Slice<number> {
		return this._fields.nonce.value
	}
	public set nonce(value: $.Slice<number>) {
		this._fields.nonce.value = value
	}

	public get label(): $.Slice<number> {
		return this._fields.label.value
	}
	public set label(value: $.Slice<number>) {
		this._fields.label.value = value
	}

	public get maxEarlyData(): number {
		return this._fields.maxEarlyData.value
	}
	public set maxEarlyData(value: number) {
		this._fields.maxEarlyData.value = value
	}

	public _fields: {
		lifetime: $.VarRef<number>
		ageAdd: $.VarRef<number>
		nonce: $.VarRef<$.Slice<number>>
		label: $.VarRef<$.Slice<number>>
		maxEarlyData: $.VarRef<number>
	}

	constructor(init?: Partial<{lifetime?: number, ageAdd?: number, nonce?: $.Slice<number>, label?: $.Slice<number>, maxEarlyData?: number}>) {
		this._fields = {
			lifetime: $.varRef(init?.lifetime ?? (0 as number)),
			ageAdd: $.varRef(init?.ageAdd ?? (0 as number)),
			nonce: $.varRef(init?.nonce ?? (null as $.Slice<number>)),
			label: $.varRef(init?.label ?? (null as $.Slice<number>)),
			maxEarlyData: $.varRef(init?.maxEarlyData ?? (0 as number))
		}
	}

	public clone(): newSessionTicketMsgTLS13 {
		const cloned = new newSessionTicketMsgTLS13()
		cloned._fields = {
			lifetime: $.varRef(this._fields.lifetime.value),
			ageAdd: $.varRef(this._fields.ageAdd.value),
			nonce: $.varRef(this._fields.nonce.value),
			label: $.varRef(this._fields.label.value),
			maxEarlyData: $.varRef(this._fields.maxEarlyData.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: newSessionTicketMsgTLS13 | $.VarRef<newSessionTicketMsgTLS13> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(4, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			cryptobyte.Builder.prototype.AddUint32.call(b, $.uint($.pointerValue<newSessionTicketMsgTLS13>(m).lifetime, 32))
			cryptobyte.Builder.prototype.AddUint32.call(b, $.uint($.pointerValue<newSessionTicketMsgTLS13>(m).ageAdd, 32))
			await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<newSessionTicketMsgTLS13>(m).nonce)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<newSessionTicketMsgTLS13>(m).label)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

			await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				if ($.uint($.pointerValue<newSessionTicketMsgTLS13>(m).maxEarlyData, 32) > $.uint(0, 32)) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(42, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddUint32.call(b, $.uint($.pointerValue<newSessionTicketMsgTLS13>(m).maxEarlyData, 32))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: newSessionTicketMsgTLS13 | $.VarRef<newSessionTicketMsgTLS13> | null = this
		$.assignStruct($.pointerValue<newSessionTicketMsgTLS13>(m), $.markAsStructValue(new newSessionTicketMsgTLS13()))
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if ((((((!cryptobyte.String_Skip(s, 4) || !cryptobyte.String_ReadUint32(s, $.pointerValue<newSessionTicketMsgTLS13>(m)._fields.lifetime)) || !cryptobyte.String_ReadUint32(s, $.pointerValue<newSessionTicketMsgTLS13>(m)._fields.ageAdd)) || !readUint8LengthPrefixed(s, $.pointerValue<newSessionTicketMsgTLS13>(m)._fields.nonce)) || !readUint16LengthPrefixed(s, $.pointerValue<newSessionTicketMsgTLS13>(m)._fields.label)) || !cryptobyte.String_ReadUint16LengthPrefixed(s, extensions)) || !cryptobyte.String_Empty(s.value)) {
			return false
		}

		while (!cryptobyte.String_Empty(extensions.value)) {
			let extension: $.VarRef<number> = $.varRef(0)
			let extData: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadUint16(extensions, extension) || !cryptobyte.String_ReadUint16LengthPrefixed(extensions, extData)) {
				return false
			}

			switch (extension.value) {
				case 42:
				{
					if (!cryptobyte.String_ReadUint32(extData, $.pointerValue<newSessionTicketMsgTLS13>(m)._fields.maxEarlyData)) {
						return false
					}
					break
				}
				default:
				{
					continue
					break
				}
			}

			if (!cryptobyte.String_Empty(extData.value)) {
				return false
			}
		}

		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.newSessionTicketMsgTLS13",
		() => new newSessionTicketMsgTLS13(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		newSessionTicketMsgTLS13,
		[{ name: "lifetime", key: "lifetime", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "ageAdd", key: "ageAdd", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "crypto/tls", index: [1], offset: 4, exported: false }, { name: "nonce", key: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [2], offset: 8, exported: false }, { name: "label", key: "label", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [3], offset: 32, exported: false }, { name: "maxEarlyData", key: "maxEarlyData", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "crypto/tls", index: [4], offset: 56, exported: false }]
	)
}

export class certificateRequestMsgTLS13 {
	public get ocspStapling(): boolean {
		return this._fields.ocspStapling.value
	}
	public set ocspStapling(value: boolean) {
		this._fields.ocspStapling.value = value
	}

	public get scts(): boolean {
		return this._fields.scts.value
	}
	public set scts(value: boolean) {
		this._fields.scts.value = value
	}

	public get supportedSignatureAlgorithms(): $.Slice<__goscript_common.SignatureScheme> {
		return this._fields.supportedSignatureAlgorithms.value
	}
	public set supportedSignatureAlgorithms(value: $.Slice<__goscript_common.SignatureScheme>) {
		this._fields.supportedSignatureAlgorithms.value = value
	}

	public get supportedSignatureAlgorithmsCert(): $.Slice<__goscript_common.SignatureScheme> {
		return this._fields.supportedSignatureAlgorithmsCert.value
	}
	public set supportedSignatureAlgorithmsCert(value: $.Slice<__goscript_common.SignatureScheme>) {
		this._fields.supportedSignatureAlgorithmsCert.value = value
	}

	public get certificateAuthorities(): $.Slice<$.Slice<number>> {
		return this._fields.certificateAuthorities.value
	}
	public set certificateAuthorities(value: $.Slice<$.Slice<number>>) {
		this._fields.certificateAuthorities.value = value
	}

	public _fields: {
		ocspStapling: $.VarRef<boolean>
		scts: $.VarRef<boolean>
		supportedSignatureAlgorithms: $.VarRef<$.Slice<__goscript_common.SignatureScheme>>
		supportedSignatureAlgorithmsCert: $.VarRef<$.Slice<__goscript_common.SignatureScheme>>
		certificateAuthorities: $.VarRef<$.Slice<$.Slice<number>>>
	}

	constructor(init?: Partial<{ocspStapling?: boolean, scts?: boolean, supportedSignatureAlgorithms?: $.Slice<__goscript_common.SignatureScheme>, supportedSignatureAlgorithmsCert?: $.Slice<__goscript_common.SignatureScheme>, certificateAuthorities?: $.Slice<$.Slice<number>>}>) {
		this._fields = {
			ocspStapling: $.varRef(init?.ocspStapling ?? (false as boolean)),
			scts: $.varRef(init?.scts ?? (false as boolean)),
			supportedSignatureAlgorithms: $.varRef(init?.supportedSignatureAlgorithms ?? (null as $.Slice<__goscript_common.SignatureScheme>)),
			supportedSignatureAlgorithmsCert: $.varRef(init?.supportedSignatureAlgorithmsCert ?? (null as $.Slice<__goscript_common.SignatureScheme>)),
			certificateAuthorities: $.varRef(init?.certificateAuthorities ?? (null as $.Slice<$.Slice<number>>))
		}
	}

	public clone(): certificateRequestMsgTLS13 {
		const cloned = new certificateRequestMsgTLS13()
		cloned._fields = {
			ocspStapling: $.varRef(this._fields.ocspStapling.value),
			scts: $.varRef(this._fields.scts.value),
			supportedSignatureAlgorithms: $.varRef(this._fields.supportedSignatureAlgorithms.value),
			supportedSignatureAlgorithmsCert: $.varRef(this._fields.supportedSignatureAlgorithmsCert.value),
			certificateAuthorities: $.varRef(this._fields.certificateAuthorities.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: certificateRequestMsgTLS13 | $.VarRef<certificateRequestMsgTLS13> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(13, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			// certificate_request_context (SHALL be zero length unless used for
			// post-handshake authentication)
			cryptobyte.Builder.prototype.AddUint8.call(b, $.uint(0, 8))

			await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				if ($.pointerValue<certificateRequestMsgTLS13>(m).ocspStapling) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(5, 16))
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(0, 16))
				}
				if ($.pointerValue<certificateRequestMsgTLS13>(m).scts) {
					// RFC 8446, Section 4.4.2.1 makes no mention of
					// signed_certificate_timestamp in CertificateRequest, but
					// "Extensions in the Certificate message from the client MUST
					// correspond to extensions in the CertificateRequest message
					// from the server." and it appears in the table in Section 4.2.
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(18, 16))
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(0, 16))
				}
				if ($.len($.pointerValue<certificateRequestMsgTLS13>(m).supportedSignatureAlgorithms) > 0) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(13, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
							for (let __goscriptRangeTarget13 = $.pointerValue<certificateRequestMsgTLS13>(m).supportedSignatureAlgorithms, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget13); __rangeIndex++) {
								let sigAlgo = __goscriptRangeTarget13![__rangeIndex]
								cryptobyte.Builder.prototype.AddUint16.call(b, $.uint($.uint(sigAlgo, 16), 16))
							}
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
				if ($.len($.pointerValue<certificateRequestMsgTLS13>(m).supportedSignatureAlgorithmsCert) > 0) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(50, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
							for (let __goscriptRangeTarget14 = $.pointerValue<certificateRequestMsgTLS13>(m).supportedSignatureAlgorithmsCert, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget14); __rangeIndex++) {
								let sigAlgo = __goscriptRangeTarget14![__rangeIndex]
								cryptobyte.Builder.prototype.AddUint16.call(b, $.uint($.uint(sigAlgo, 16), 16))
							}
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
				if ($.len($.pointerValue<certificateRequestMsgTLS13>(m).certificateAuthorities) > 0) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(47, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
							for (let __goscriptRangeTarget15 = $.pointerValue<certificateRequestMsgTLS13>(m).certificateAuthorities, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget15); __rangeIndex++) {
								let ca = __goscriptRangeTarget15![__rangeIndex]
								await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
									cryptobyte.Builder.prototype.AddBytes.call(b, ca)
								}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
							}
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: certificateRequestMsgTLS13 | $.VarRef<certificateRequestMsgTLS13> | null = this
		$.assignStruct($.pointerValue<certificateRequestMsgTLS13>(m), $.markAsStructValue(new certificateRequestMsgTLS13()))
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		let context: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if ((((!cryptobyte.String_Skip(s, 4) || !cryptobyte.String_ReadUint8LengthPrefixed(s, context)) || !cryptobyte.String_Empty(context.value)) || !cryptobyte.String_ReadUint16LengthPrefixed(s, extensions)) || !cryptobyte.String_Empty(s.value)) {
			return false
		}

		while (!cryptobyte.String_Empty(extensions.value)) {
			let extension: $.VarRef<number> = $.varRef(0)
			let extData: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadUint16(extensions, extension) || !cryptobyte.String_ReadUint16LengthPrefixed(extensions, extData)) {
				return false
			}

			switch (extension.value) {
				case 5:
				{
					$.pointerValue<certificateRequestMsgTLS13>(m).ocspStapling = true
					break
				}
				case 18:
				{
					$.pointerValue<certificateRequestMsgTLS13>(m).scts = true
					break
				}
				case 13:
				{
					let sigAndAlgs: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, sigAndAlgs) || cryptobyte.String_Empty(sigAndAlgs.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(sigAndAlgs.value)) {
						let sigAndAlg: $.VarRef<number> = $.varRef(0)
						if (!cryptobyte.String_ReadUint16(sigAndAlgs, sigAndAlg)) {
							return false
						}
						$.pointerValue<certificateRequestMsgTLS13>(m).supportedSignatureAlgorithms = $.append($.pointerValue<certificateRequestMsgTLS13>(m).supportedSignatureAlgorithms, $.uint($.uint(sigAndAlg.value, 16), 16))
					}
					break
				}
				case 50:
				{
					let sigAndAlgs: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, sigAndAlgs) || cryptobyte.String_Empty(sigAndAlgs.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(sigAndAlgs.value)) {
						let sigAndAlg: $.VarRef<number> = $.varRef(0)
						if (!cryptobyte.String_ReadUint16(sigAndAlgs, sigAndAlg)) {
							return false
						}
						$.pointerValue<certificateRequestMsgTLS13>(m).supportedSignatureAlgorithmsCert = $.append($.pointerValue<certificateRequestMsgTLS13>(m).supportedSignatureAlgorithmsCert, $.uint($.uint(sigAndAlg.value, 16), 16))
					}
					break
				}
				case 47:
				{
					let auths: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, auths) || cryptobyte.String_Empty(auths.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(auths.value)) {
						let ca: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
						if (!readUint16LengthPrefixed(auths, ca) || ($.len(ca.value) == 0)) {
							return false
						}
						$.pointerValue<certificateRequestMsgTLS13>(m).certificateAuthorities = $.append($.pointerValue<certificateRequestMsgTLS13>(m).certificateAuthorities, ca.value)
					}
					break
				}
				default:
				{
					continue
					break
				}
			}

			if (!cryptobyte.String_Empty(extData.value)) {
				return false
			}
		}

		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.certificateRequestMsgTLS13",
		() => new certificateRequestMsgTLS13(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		certificateRequestMsgTLS13,
		[{ name: "ocspStapling", key: "ocspStapling", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "scts", key: "scts", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [1], offset: 1, exported: false }, { name: "supportedSignatureAlgorithms", key: "supportedSignatureAlgorithms", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" } }, pkgPath: "crypto/tls", index: [2], offset: 8, exported: false }, { name: "supportedSignatureAlgorithmsCert", key: "supportedSignatureAlgorithmsCert", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" } }, pkgPath: "crypto/tls", index: [3], offset: 32, exported: false }, { name: "certificateAuthorities", key: "certificateAuthorities", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "crypto/tls", index: [4], offset: 56, exported: false }]
	)
}

export class certificateMsg {
	public get certificates(): $.Slice<$.Slice<number>> {
		return this._fields.certificates.value
	}
	public set certificates(value: $.Slice<$.Slice<number>>) {
		this._fields.certificates.value = value
	}

	public _fields: {
		certificates: $.VarRef<$.Slice<$.Slice<number>>>
	}

	constructor(init?: Partial<{certificates?: $.Slice<$.Slice<number>>}>) {
		this._fields = {
			certificates: $.varRef(init?.certificates ?? (null as $.Slice<$.Slice<number>>))
		}
	}

	public clone(): certificateMsg {
		const cloned = new certificateMsg()
		cloned._fields = {
			certificates: $.varRef(this._fields.certificates.value)
		}
		return $.markAsStructValue(cloned)
	}

	public marshal(): [$.Slice<number>, $.GoError] {
		const m: certificateMsg | $.VarRef<certificateMsg> | null = this
		let i: number = 0
		for (let __goscriptRangeTarget16 = $.pointerValue<certificateMsg>(m).certificates, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget16); __rangeIndex++) {
			let slice = __goscriptRangeTarget16![__rangeIndex]
			i = i + ($.len(slice))
		}

		let length = (3 + (3 * $.len($.pointerValue<certificateMsg>(m).certificates))) + i
		let x: $.Slice<number> = $.makeSlice<number>(4 + length, undefined, "byte")
		x![0] = $.uint(11, 8)
		x![1] = $.uint($.uint(length >> 16, 8), 8)
		x![2] = $.uint($.uint(length >> 8, 8), 8)
		x![3] = $.uint($.uint(length, 8), 8)

		let certificateOctets = length - 3
		x![4] = $.uint($.uint(certificateOctets >> 16, 8), 8)
		x![5] = $.uint($.uint(certificateOctets >> 8, 8), 8)
		x![6] = $.uint($.uint(certificateOctets, 8), 8)

		let y: $.Slice<number> = $.goSlice(x, 7, undefined)
		for (let __goscriptRangeTarget17 = $.pointerValue<certificateMsg>(m).certificates, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget17); __rangeIndex++) {
			let slice = __goscriptRangeTarget17![__rangeIndex]
			y![0] = $.uint($.uint($.len(slice) >> 16, 8), 8)
			y![1] = $.uint($.uint($.len(slice) >> 8, 8), 8)
			y![2] = $.uint($.uint($.len(slice), 8), 8)
			$.copy($.goSlice(y, 3, undefined), slice)
			y = $.goSlice(y, 3 + $.len(slice), undefined)
		}

		return [x, null]
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: certificateMsg | $.VarRef<certificateMsg> | null = this
		if ($.len(data) < 7) {
			return false
		}

		let certsLen = $.uint((($.uint($.arrayIndex(data!, 4), 32) << 16) | ($.uint($.arrayIndex(data!, 5), 32) << 8)) | $.uint($.arrayIndex(data!, 6), 32), 32)
		if ($.uint($.uint($.len(data), 32), 32) != $.uint((certsLen + 7), 32)) {
			return false
		}

		let numCerts = 0
		let d: $.Slice<number> = $.goSlice(data, 7, undefined)
		while ($.uint(certsLen, 32) > $.uint(0, 32)) {
			if ($.len(d) < 4) {
				return false
			}
			let certLen = $.uint((($.uint($.arrayIndex(d!, 0), 32) << 16) | ($.uint($.arrayIndex(d!, 1), 32) << 8)) | $.uint($.arrayIndex(d!, 2), 32), 32)
			if ($.uint($.uint($.len(d), 32), 32) < $.uint((3 + certLen), 32)) {
				return false
			}
			d = $.goSlice(d, 3 + certLen, undefined)
			certsLen = certsLen - ($.uint(3 + certLen, 32))
			numCerts++
		}

		$.pointerValue<certificateMsg>(m).certificates = $.makeSlice<$.Slice<number>>(numCerts)
		d = $.goSlice(data, 7, undefined)
		for (let i = 0; i < numCerts; i++) {
			let certLen = $.uint((($.uint($.arrayIndex(d!, 0), 32) << 16) | ($.uint($.arrayIndex(d!, 1), 32) << 8)) | $.uint($.arrayIndex(d!, 2), 32), 32)
			$.pointerValue<certificateMsg>(m).certificates![i] = $.goSlice(d, 3, 3 + certLen)
			d = $.goSlice(d, 3 + certLen, undefined)
		}

		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.certificateMsg",
		() => new certificateMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		certificateMsg,
		[{ name: "certificates", key: "certificates", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class certificateMsgTLS13 {
	public get certificate(): __goscript_common.Certificate {
		return this._fields.certificate.value
	}
	public set certificate(value: __goscript_common.Certificate) {
		this._fields.certificate.value = value
	}

	public get ocspStapling(): boolean {
		return this._fields.ocspStapling.value
	}
	public set ocspStapling(value: boolean) {
		this._fields.ocspStapling.value = value
	}

	public get scts(): boolean {
		return this._fields.scts.value
	}
	public set scts(value: boolean) {
		this._fields.scts.value = value
	}

	public _fields: {
		certificate: $.VarRef<__goscript_common.Certificate>
		ocspStapling: $.VarRef<boolean>
		scts: $.VarRef<boolean>
	}

	constructor(init?: Partial<{certificate?: __goscript_common.Certificate, ocspStapling?: boolean, scts?: boolean}>) {
		this._fields = {
			certificate: $.varRef(init?.certificate ? $.markAsStructValue($.cloneStructValue(init.certificate)) : $.markAsStructValue(new __goscript_common.Certificate())),
			ocspStapling: $.varRef(init?.ocspStapling ?? (false as boolean)),
			scts: $.varRef(init?.scts ?? (false as boolean))
		}
	}

	public clone(): certificateMsgTLS13 {
		const cloned = new certificateMsgTLS13()
		cloned._fields = {
			certificate: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.certificate.value))),
			ocspStapling: $.varRef(this._fields.ocspStapling.value),
			scts: $.varRef(this._fields.scts.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: certificateMsgTLS13 | $.VarRef<certificateMsgTLS13> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(11, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			cryptobyte.Builder.prototype.AddUint8.call(b, $.uint(0, 8))

			let certificate = $.markAsStructValue($.cloneStructValue($.pointerValue<certificateMsgTLS13>(m).certificate))
			if (!$.pointerValue<certificateMsgTLS13>(m).ocspStapling) {
				certificate.OCSPStaple = null
			}
			if (!$.pointerValue<certificateMsgTLS13>(m).scts) {
				certificate.SignedCertificateTimestamps = null
			}
			await marshalCertificate(b, $.markAsStructValue($.cloneStructValue(certificate)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: certificateMsgTLS13 | $.VarRef<certificateMsgTLS13> | null = this
		$.assignStruct($.pointerValue<certificateMsgTLS13>(m), $.markAsStructValue(new certificateMsgTLS13()))
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		let context: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if ((((!cryptobyte.String_Skip(s, 4) || !cryptobyte.String_ReadUint8LengthPrefixed(s, context)) || !cryptobyte.String_Empty(context.value)) || !unmarshalCertificate(s, $.pointerValue<certificateMsgTLS13>(m)._fields.certificate)) || !cryptobyte.String_Empty(s.value)) {
			return false
		}

		$.pointerValue<certificateMsgTLS13>(m).scts = $.pointerValue<certificateMsgTLS13>(m).certificate.SignedCertificateTimestamps != null
		$.pointerValue<certificateMsgTLS13>(m).ocspStapling = $.pointerValue<certificateMsgTLS13>(m).certificate.OCSPStaple != null

		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.certificateMsgTLS13",
		() => new certificateMsgTLS13(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		certificateMsgTLS13,
		[{ name: "certificate", key: "certificate", type: "tls.Certificate", pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "ocspStapling", key: "ocspStapling", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [1], offset: 120, exported: false }, { name: "scts", key: "scts", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [2], offset: 121, exported: false }]
	)
}

export class serverKeyExchangeMsg {
	public get key(): $.Slice<number> {
		return this._fields.key.value
	}
	public set key(value: $.Slice<number>) {
		this._fields.key.value = value
	}

	public _fields: {
		key: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{key?: $.Slice<number>}>) {
		this._fields = {
			key: $.varRef(init?.key ?? (null as $.Slice<number>))
		}
	}

	public clone(): serverKeyExchangeMsg {
		const cloned = new serverKeyExchangeMsg()
		cloned._fields = {
			key: $.varRef(this._fields.key.value)
		}
		return $.markAsStructValue(cloned)
	}

	public marshal(): [$.Slice<number>, $.GoError] {
		const m: serverKeyExchangeMsg | $.VarRef<serverKeyExchangeMsg> | null = this
		let length = $.len($.pointerValue<serverKeyExchangeMsg>(m).key)
		let x: $.Slice<number> = $.makeSlice<number>(length + 4, undefined, "byte")
		x![0] = $.uint(12, 8)
		x![1] = $.uint($.uint(length >> 16, 8), 8)
		x![2] = $.uint($.uint(length >> 8, 8), 8)
		x![3] = $.uint($.uint(length, 8), 8)
		$.copy($.goSlice(x, 4, undefined), $.pointerValue<serverKeyExchangeMsg>(m).key)

		return [x, null]
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: serverKeyExchangeMsg | $.VarRef<serverKeyExchangeMsg> | null = this
		if ($.len(data) < 4) {
			return false
		}
		$.pointerValue<serverKeyExchangeMsg>(m).key = $.goSlice(data, 4, undefined)
		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.serverKeyExchangeMsg",
		() => new serverKeyExchangeMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		serverKeyExchangeMsg,
		[{ name: "key", key: "key", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class certificateStatusMsg {
	public get response(): $.Slice<number> {
		return this._fields.response.value
	}
	public set response(value: $.Slice<number>) {
		this._fields.response.value = value
	}

	public _fields: {
		response: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{response?: $.Slice<number>}>) {
		this._fields = {
			response: $.varRef(init?.response ?? (null as $.Slice<number>))
		}
	}

	public clone(): certificateStatusMsg {
		const cloned = new certificateStatusMsg()
		cloned._fields = {
			response: $.varRef(this._fields.response.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: certificateStatusMsg | $.VarRef<certificateStatusMsg> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(22, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			cryptobyte.Builder.prototype.AddUint8.call(b, $.uint(1, 8))
			await cryptobyte.Builder.prototype.AddUint24LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<certificateStatusMsg>(m).response)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public unmarshal(data: $.Slice<number>): boolean {
		const m: certificateStatusMsg | $.VarRef<certificateStatusMsg> | null = this
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		let statusType: $.VarRef<number> = $.varRef(0)
		if (((((!cryptobyte.String_Skip(s, 4) || !cryptobyte.String_ReadUint8(s, statusType)) || ($.uint(statusType.value, 8) != $.uint(1, 8))) || !readUint24LengthPrefixed(s, $.pointerValue<certificateStatusMsg>(m)._fields.response)) || ($.len($.pointerValue<certificateStatusMsg>(m).response) == 0)) || !cryptobyte.String_Empty(s.value)) {
			return false
		}
		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.certificateStatusMsg",
		() => new certificateStatusMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		certificateStatusMsg,
		[{ name: "response", key: "response", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class serverHelloDoneMsg {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): serverHelloDoneMsg {
		const cloned = new serverHelloDoneMsg()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public marshal(): [$.Slice<number>, $.GoError] {
		const m: serverHelloDoneMsg | $.VarRef<serverHelloDoneMsg> | null = this
		let x: $.Slice<number> = $.makeSlice<number>(4, undefined, "byte")
		x![0] = $.uint(14, 8)
		return [x, null]
	}

	public unmarshal(data: $.Slice<number>): boolean {
		const m: serverHelloDoneMsg | $.VarRef<serverHelloDoneMsg> | null = this
		return $.len(data) == 4
	}

	static __typeInfo = $.registerStructType(
		"tls.serverHelloDoneMsg",
		() => new serverHelloDoneMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		serverHelloDoneMsg,
		[]
	)
}

export class clientKeyExchangeMsg {
	public get ciphertext(): $.Slice<number> {
		return this._fields.ciphertext.value
	}
	public set ciphertext(value: $.Slice<number>) {
		this._fields.ciphertext.value = value
	}

	public _fields: {
		ciphertext: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{ciphertext?: $.Slice<number>}>) {
		this._fields = {
			ciphertext: $.varRef(init?.ciphertext ?? (null as $.Slice<number>))
		}
	}

	public clone(): clientKeyExchangeMsg {
		const cloned = new clientKeyExchangeMsg()
		cloned._fields = {
			ciphertext: $.varRef(this._fields.ciphertext.value)
		}
		return $.markAsStructValue(cloned)
	}

	public marshal(): [$.Slice<number>, $.GoError] {
		const m: clientKeyExchangeMsg | $.VarRef<clientKeyExchangeMsg> | null = this
		let length = $.len($.pointerValue<clientKeyExchangeMsg>(m).ciphertext)
		let x: $.Slice<number> = $.makeSlice<number>(length + 4, undefined, "byte")
		x![0] = $.uint(16, 8)
		x![1] = $.uint($.uint(length >> 16, 8), 8)
		x![2] = $.uint($.uint(length >> 8, 8), 8)
		x![3] = $.uint($.uint(length, 8), 8)
		$.copy($.goSlice(x, 4, undefined), $.pointerValue<clientKeyExchangeMsg>(m).ciphertext)

		return [x, null]
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: clientKeyExchangeMsg | $.VarRef<clientKeyExchangeMsg> | null = this
		if ($.len(data) < 4) {
			return false
		}
		let l = (($.int($.arrayIndex(data!, 1)) << 16) | ($.int($.arrayIndex(data!, 2)) << 8)) | $.int($.arrayIndex(data!, 3))
		if (l != ($.len(data) - 4)) {
			return false
		}
		$.pointerValue<clientKeyExchangeMsg>(m).ciphertext = $.goSlice(data, 4, undefined)
		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.clientKeyExchangeMsg",
		() => new clientKeyExchangeMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		clientKeyExchangeMsg,
		[{ name: "ciphertext", key: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class finishedMsg {
	public get verifyData(): $.Slice<number> {
		return this._fields.verifyData.value
	}
	public set verifyData(value: $.Slice<number>) {
		this._fields.verifyData.value = value
	}

	public _fields: {
		verifyData: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{verifyData?: $.Slice<number>}>) {
		this._fields = {
			verifyData: $.varRef(init?.verifyData ?? (null as $.Slice<number>))
		}
	}

	public clone(): finishedMsg {
		const cloned = new finishedMsg()
		cloned._fields = {
			verifyData: $.varRef(this._fields.verifyData.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: finishedMsg | $.VarRef<finishedMsg> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(20, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
			cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<finishedMsg>(m).verifyData)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public unmarshal(data: $.Slice<number>): boolean {
		const m: finishedMsg | $.VarRef<finishedMsg> | null = this
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))
		return (cryptobyte.String_Skip(s, 1) && readUint24LengthPrefixed(s, $.pointerValue<finishedMsg>(m)._fields.verifyData)) && cryptobyte.String_Empty(s.value)
	}

	static __typeInfo = $.registerStructType(
		"tls.finishedMsg",
		() => new finishedMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		finishedMsg,
		[{ name: "verifyData", key: "verifyData", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class certificateRequestMsg {
	// hasSignatureAlgorithm indicates whether this message includes a list of
	// supported signature algorithms. This change was introduced with TLS 1.2.
	public get hasSignatureAlgorithm(): boolean {
		return this._fields.hasSignatureAlgorithm.value
	}
	public set hasSignatureAlgorithm(value: boolean) {
		this._fields.hasSignatureAlgorithm.value = value
	}

	public get certificateTypes(): $.Slice<number> {
		return this._fields.certificateTypes.value
	}
	public set certificateTypes(value: $.Slice<number>) {
		this._fields.certificateTypes.value = value
	}

	public get supportedSignatureAlgorithms(): $.Slice<__goscript_common.SignatureScheme> {
		return this._fields.supportedSignatureAlgorithms.value
	}
	public set supportedSignatureAlgorithms(value: $.Slice<__goscript_common.SignatureScheme>) {
		this._fields.supportedSignatureAlgorithms.value = value
	}

	public get certificateAuthorities(): $.Slice<$.Slice<number>> {
		return this._fields.certificateAuthorities.value
	}
	public set certificateAuthorities(value: $.Slice<$.Slice<number>>) {
		this._fields.certificateAuthorities.value = value
	}

	public _fields: {
		hasSignatureAlgorithm: $.VarRef<boolean>
		certificateTypes: $.VarRef<$.Slice<number>>
		supportedSignatureAlgorithms: $.VarRef<$.Slice<__goscript_common.SignatureScheme>>
		certificateAuthorities: $.VarRef<$.Slice<$.Slice<number>>>
	}

	constructor(init?: Partial<{hasSignatureAlgorithm?: boolean, certificateTypes?: $.Slice<number>, supportedSignatureAlgorithms?: $.Slice<__goscript_common.SignatureScheme>, certificateAuthorities?: $.Slice<$.Slice<number>>}>) {
		this._fields = {
			hasSignatureAlgorithm: $.varRef(init?.hasSignatureAlgorithm ?? (false as boolean)),
			certificateTypes: $.varRef(init?.certificateTypes ?? (null as $.Slice<number>)),
			supportedSignatureAlgorithms: $.varRef(init?.supportedSignatureAlgorithms ?? (null as $.Slice<__goscript_common.SignatureScheme>)),
			certificateAuthorities: $.varRef(init?.certificateAuthorities ?? (null as $.Slice<$.Slice<number>>))
		}
	}

	public clone(): certificateRequestMsg {
		const cloned = new certificateRequestMsg()
		cloned._fields = {
			hasSignatureAlgorithm: $.varRef(this._fields.hasSignatureAlgorithm.value),
			certificateTypes: $.varRef(this._fields.certificateTypes.value),
			supportedSignatureAlgorithms: $.varRef(this._fields.supportedSignatureAlgorithms.value),
			certificateAuthorities: $.varRef(this._fields.certificateAuthorities.value)
		}
		return $.markAsStructValue(cloned)
	}

	public marshal(): [$.Slice<number>, $.GoError] {
		const m: certificateRequestMsg | $.VarRef<certificateRequestMsg> | null = this
		// See RFC 4346, Section 7.4.4.
		let length = (1 + $.len($.pointerValue<certificateRequestMsg>(m).certificateTypes)) + 2
		let casLength = 0
		for (let __goscriptRangeTarget20 = $.pointerValue<certificateRequestMsg>(m).certificateAuthorities, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget20); __rangeIndex++) {
			let ca = __goscriptRangeTarget20![__rangeIndex]
			casLength = casLength + (2 + $.len(ca))
		}
		length = length + (casLength)

		if ($.pointerValue<certificateRequestMsg>(m).hasSignatureAlgorithm) {
			length = length + (2 + (2 * $.len($.pointerValue<certificateRequestMsg>(m).supportedSignatureAlgorithms)))
		}

		let x: $.Slice<number> = $.makeSlice<number>(4 + length, undefined, "byte")
		x![0] = $.uint(13, 8)
		x![1] = $.uint($.uint(length >> 16, 8), 8)
		x![2] = $.uint($.uint(length >> 8, 8), 8)
		x![3] = $.uint($.uint(length, 8), 8)

		x![4] = $.uint($.uint($.len($.pointerValue<certificateRequestMsg>(m).certificateTypes), 8), 8)

		$.copy($.goSlice(x, 5, undefined), $.pointerValue<certificateRequestMsg>(m).certificateTypes)
		let y: $.Slice<number> = $.goSlice(x, 5 + $.len($.pointerValue<certificateRequestMsg>(m).certificateTypes), undefined)

		if ($.pointerValue<certificateRequestMsg>(m).hasSignatureAlgorithm) {
			let n = $.len($.pointerValue<certificateRequestMsg>(m).supportedSignatureAlgorithms) * 2
			y![0] = $.uint($.uint(n >> 8, 8), 8)
			y![1] = $.uint($.uint(n, 8), 8)
			y = $.goSlice(y, 2, undefined)
			for (let __goscriptRangeTarget21 = $.pointerValue<certificateRequestMsg>(m).supportedSignatureAlgorithms, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget21); __rangeIndex++) {
				let sigAlgo = __goscriptRangeTarget21![__rangeIndex]
				y![0] = $.uint($.uint($.uintShr(sigAlgo, 8, 16), 8), 8)
				y![1] = $.uint($.uint(sigAlgo, 8), 8)
				y = $.goSlice(y, 2, undefined)
			}
		}

		y![0] = $.uint($.uint(casLength >> 8, 8), 8)
		y![1] = $.uint($.uint(casLength, 8), 8)
		y = $.goSlice(y, 2, undefined)
		for (let __goscriptRangeTarget22 = $.pointerValue<certificateRequestMsg>(m).certificateAuthorities, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget22); __rangeIndex++) {
			let ca = __goscriptRangeTarget22![__rangeIndex]
			y![0] = $.uint($.uint($.len(ca) >> 8, 8), 8)
			y![1] = $.uint($.uint($.len(ca), 8), 8)
			y = $.goSlice(y, 2, undefined)
			$.copy(y, ca)
			y = $.goSlice(y, $.len(ca), undefined)
		}

		return [x, null]
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: certificateRequestMsg | $.VarRef<certificateRequestMsg> | null = this
		if ($.len(data) < 5) {
			return false
		}

		let length = $.uint((($.uint($.arrayIndex(data!, 1), 32) << 16) | ($.uint($.arrayIndex(data!, 2), 32) << 8)) | $.uint($.arrayIndex(data!, 3), 32), 32)
		if ($.uint(($.uint($.len(data), 32) - 4), 32) != $.uint(length, 32)) {
			return false
		}

		let numCertTypes = $.int($.arrayIndex(data!, 4))
		data = $.goSlice(data, 5, undefined)
		if ((numCertTypes == 0) || ($.len(data) <= numCertTypes)) {
			return false
		}

		$.pointerValue<certificateRequestMsg>(m).certificateTypes = $.makeSlice<number>(numCertTypes, undefined, "byte")
		if ($.copy($.pointerValue<certificateRequestMsg>(m).certificateTypes, data) != numCertTypes) {
			return false
		}

		data = $.goSlice(data, numCertTypes, undefined)

		if ($.pointerValue<certificateRequestMsg>(m).hasSignatureAlgorithm) {
			if ($.len(data) < 2) {
				return false
			}
			let sigAndHashLen = $.uint(($.uint($.arrayIndex(data!, 0), 16) << 8) | $.uint($.arrayIndex(data!, 1), 16), 16)
			data = $.goSlice(data, 2, undefined)
			if (($.uint((sigAndHashLen & 1), 16) != $.uint(0, 16)) || ($.uint(sigAndHashLen, 16) == $.uint(0, 16))) {
				return false
			}
			if ($.len(data) < $.int(sigAndHashLen)) {
				return false
			}
			let numSigAlgos = $.uint(Math.trunc(sigAndHashLen / 2), 16)
			$.pointerValue<certificateRequestMsg>(m).supportedSignatureAlgorithms = $.makeSlice<__goscript_common.SignatureScheme>(numSigAlgos, undefined, "number")
			for (let __goscriptRangeTarget23 = $.pointerValue<certificateRequestMsg>(m).supportedSignatureAlgorithms, i = 0; i < $.len(__goscriptRangeTarget23); i++) {
				$.pointerValue<certificateRequestMsg>(m).supportedSignatureAlgorithms![i] = $.uint(($.uint($.arrayIndex(data!, 0), 16) << 8) | $.uint($.arrayIndex(data!, 1), 16), 16)
				data = $.goSlice(data, 2, undefined)
			}
		}

		if ($.len(data) < 2) {
			return false
		}
		let casLength = $.uint(($.uint($.arrayIndex(data!, 0), 16) << 8) | $.uint($.arrayIndex(data!, 1), 16), 16)
		data = $.goSlice(data, 2, undefined)
		if ($.len(data) < $.int(casLength)) {
			return false
		}
		let cas: $.Slice<number> = $.makeSlice<number>(casLength, undefined, "byte")
		$.copy(cas, data)
		data = $.goSlice(data, casLength, undefined)

		$.pointerValue<certificateRequestMsg>(m).certificateAuthorities = null
		while ($.len(cas) > 0) {
			if ($.len(cas) < 2) {
				return false
			}
			let caLen = $.uint(($.uint($.arrayIndex(cas!, 0), 16) << 8) | $.uint($.arrayIndex(cas!, 1), 16), 16)
			cas = $.goSlice(cas, 2, undefined)

			if ($.len(cas) < $.int(caLen)) {
				return false
			}

			$.pointerValue<certificateRequestMsg>(m).certificateAuthorities = $.append($.pointerValue<certificateRequestMsg>(m).certificateAuthorities, $.goSlice(cas, undefined, caLen))
			cas = $.goSlice(cas, caLen, undefined)
		}

		return $.len(data) == 0
	}

	static __typeInfo = $.registerStructType(
		"tls.certificateRequestMsg",
		() => new certificateRequestMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		certificateRequestMsg,
		[{ name: "hasSignatureAlgorithm", key: "hasSignatureAlgorithm", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "certificateTypes", key: "certificateTypes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "supportedSignatureAlgorithms", key: "supportedSignatureAlgorithms", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" } }, pkgPath: "crypto/tls", index: [2], offset: 32, exported: false }, { name: "certificateAuthorities", key: "certificateAuthorities", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "crypto/tls", index: [3], offset: 56, exported: false }]
	)
}

export class certificateVerifyMsg {
	public get hasSignatureAlgorithm(): boolean {
		return this._fields.hasSignatureAlgorithm.value
	}
	public set hasSignatureAlgorithm(value: boolean) {
		this._fields.hasSignatureAlgorithm.value = value
	}

	public get signatureAlgorithm(): __goscript_common.SignatureScheme {
		return this._fields.signatureAlgorithm.value
	}
	public set signatureAlgorithm(value: __goscript_common.SignatureScheme) {
		this._fields.signatureAlgorithm.value = value
	}

	public get signature(): $.Slice<number> {
		return this._fields.signature.value
	}
	public set signature(value: $.Slice<number>) {
		this._fields.signature.value = value
	}

	public _fields: {
		hasSignatureAlgorithm: $.VarRef<boolean>
		signatureAlgorithm: $.VarRef<__goscript_common.SignatureScheme>
		signature: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{hasSignatureAlgorithm?: boolean, signatureAlgorithm?: __goscript_common.SignatureScheme, signature?: $.Slice<number>}>) {
		this._fields = {
			hasSignatureAlgorithm: $.varRef(init?.hasSignatureAlgorithm ?? (false as boolean)),
			signatureAlgorithm: $.varRef(init?.signatureAlgorithm ?? (0 as __goscript_common.SignatureScheme)),
			signature: $.varRef(init?.signature ?? (null as $.Slice<number>))
		}
	}

	public clone(): certificateVerifyMsg {
		const cloned = new certificateVerifyMsg()
		cloned._fields = {
			hasSignatureAlgorithm: $.varRef(this._fields.hasSignatureAlgorithm.value),
			signatureAlgorithm: $.varRef(this._fields.signatureAlgorithm.value),
			signature: $.varRef(this._fields.signature.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async marshal(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: certificateVerifyMsg | $.VarRef<certificateVerifyMsg> | null = this
		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		b.value.AddUint8($.uint(15, 8))
		await b.value.AddUint24LengthPrefixed($.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			if ($.pointerValue<certificateVerifyMsg>(m).hasSignatureAlgorithm) {
				cryptobyte.Builder.prototype.AddUint16.call(b, $.uint($.uint($.pointerValue<certificateVerifyMsg>(m).signatureAlgorithm, 16), 16))
			}
			await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(b, $.pointerValue<certificateVerifyMsg>(m).signature)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		return b.value.Bytes()
	}

	public unmarshal(data: $.Slice<number>): boolean {
		const m: certificateVerifyMsg | $.VarRef<certificateVerifyMsg> | null = this
		let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))

		if (!cryptobyte.String_Skip(s, 4)) {
			return false
		}
		if ($.pointerValue<certificateVerifyMsg>(m).hasSignatureAlgorithm) {
			if (!cryptobyte.String_ReadUint16(s, $.pointerValue<certificateVerifyMsg>(m)._fields.signatureAlgorithm)) {
				return false
			}
		}
		return readUint16LengthPrefixed(s, $.pointerValue<certificateVerifyMsg>(m)._fields.signature) && cryptobyte.String_Empty(s.value)
	}

	static __typeInfo = $.registerStructType(
		"tls.certificateVerifyMsg",
		() => new certificateVerifyMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		certificateVerifyMsg,
		[{ name: "hasSignatureAlgorithm", key: "hasSignatureAlgorithm", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "signatureAlgorithm", key: "signatureAlgorithm", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }, pkgPath: "crypto/tls", index: [1], offset: 2, exported: false }, { name: "signature", key: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [2], offset: 8, exported: false }]
	)
}

export class newSessionTicketMsg {
	public get ticket(): $.Slice<number> {
		return this._fields.ticket.value
	}
	public set ticket(value: $.Slice<number>) {
		this._fields.ticket.value = value
	}

	public _fields: {
		ticket: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{ticket?: $.Slice<number>}>) {
		this._fields = {
			ticket: $.varRef(init?.ticket ?? (null as $.Slice<number>))
		}
	}

	public clone(): newSessionTicketMsg {
		const cloned = new newSessionTicketMsg()
		cloned._fields = {
			ticket: $.varRef(this._fields.ticket.value)
		}
		return $.markAsStructValue(cloned)
	}

	public marshal(): [$.Slice<number>, $.GoError] {
		const m: newSessionTicketMsg | $.VarRef<newSessionTicketMsg> | null = this
		// See RFC 5077, Section 3.3.
		let ticketLen = $.len($.pointerValue<newSessionTicketMsg>(m).ticket)
		let length = (2 + 4) + ticketLen
		let x: $.Slice<number> = $.makeSlice<number>(4 + length, undefined, "byte")
		x![0] = $.uint(4, 8)
		x![1] = $.uint($.uint(length >> 16, 8), 8)
		x![2] = $.uint($.uint(length >> 8, 8), 8)
		x![3] = $.uint($.uint(length, 8), 8)
		x![8] = $.uint($.uint(ticketLen >> 8, 8), 8)
		x![9] = $.uint($.uint(ticketLen, 8), 8)
		$.copy($.goSlice(x, 10, undefined), $.pointerValue<newSessionTicketMsg>(m).ticket)

		return [x, null]
	}

	public unmarshal(data: $.Slice<number>): boolean {
		let m: newSessionTicketMsg | $.VarRef<newSessionTicketMsg> | null = this
		if ($.len(data) < 10) {
			return false
		}

		let length = $.uint((($.uint($.arrayIndex(data!, 1), 32) << 16) | ($.uint($.arrayIndex(data!, 2), 32) << 8)) | $.uint($.arrayIndex(data!, 3), 32), 32)
		if ($.uint(($.uint($.len(data), 32) - 4), 32) != $.uint(length, 32)) {
			return false
		}

		let ticketLen = ($.int($.arrayIndex(data!, 8)) << 8) + $.int($.arrayIndex(data!, 9))
		if (($.len(data) - 10) != ticketLen) {
			return false
		}

		$.pointerValue<newSessionTicketMsg>(m).ticket = $.goSlice(data, 10, undefined)

		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.newSessionTicketMsg",
		() => new newSessionTicketMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		newSessionTicketMsg,
		[{ name: "ticket", key: "ticket", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class helloRequestMsg {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): helloRequestMsg {
		const cloned = new helloRequestMsg()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public marshal(): [$.Slice<number>, $.GoError] {
		return [new Uint8Array([0, 0, 0, 0]) as $.Slice<number>, null]
	}

	public unmarshal(data: $.Slice<number>): boolean {
		return $.len(data) == 4
	}

	static __typeInfo = $.registerStructType(
		"tls.helloRequestMsg",
		() => new helloRequestMsg(),
		[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		helloRequestMsg,
		[]
	)
}

export async function marshalingFunction_Marshal(f: marshalingFunction | null, b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<$.GoError> {
	return f!(b)
}

export async function addBytesWithLength(b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null, v: $.Slice<number>, n: number): globalThis.Promise<void> {
	await cryptobyte.Builder.prototype.AddValue.call(b, $.namedValueInterfaceValue<cryptobyte.MarshalingValue | null>($.namedFunction($.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): $.GoError => {
		if ($.len(v) != n) {
			return fmt.Errorf("invalid value length: expected %d, got %d", $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.len(v), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
		}
		cryptobyte.Builder.prototype.AddBytes.call(b, v)
		return null
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: ["error"] } as $.FunctionTypeInfo)), "tls.marshalingFunction", ({ kind: $.TypeKind.Function, name: "tls.marshalingFunction", params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: ["error"] } as $.FunctionTypeInfo)), "tls.marshalingFunction", {Marshal: (receiver: any, ...args: any[]) => (marshalingFunction_Marshal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, ({ kind: $.TypeKind.Function, name: "tls.marshalingFunction", params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: ["error"] } as $.FunctionTypeInfo), [{ name: "Marshal", args: [{ name: "b", type: { kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" } }], returns: [{ name: "_r0", type: "error" }] }]))
}

export function addUint64(b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null, v: bigint): void {
	cryptobyte.Builder.prototype.AddUint32.call(b, $.uint($.uint($.uint64Shr(v, 32n), 32), 32))
	cryptobyte.Builder.prototype.AddUint32.call(b, $.uint($.uint(v, 32), 32))
}

export function readUint64(s: $.VarRef<cryptobyte.String> | null, out: $.VarRef<bigint> | null): boolean {
	let hi: $.VarRef<number> = $.varRef(0)
	let lo: $.VarRef<number> = $.varRef(0)
	if (!cryptobyte.String_ReadUint32(s, hi) || !cryptobyte.String_ReadUint32(s, lo)) {
		return false
	}
	out!.value = $.uint64Add(($.uint64Mul($.uint64(hi.value), (2 ** 32))), $.uint64(lo.value))
	return true
}

export function readUint8LengthPrefixed(s: $.VarRef<cryptobyte.String> | null, out: $.VarRef<$.Slice<number>> | null): boolean {
	return cryptobyte.String_ReadUint8LengthPrefixed(s, out)
}

export function readUint16LengthPrefixed(s: $.VarRef<cryptobyte.String> | null, out: $.VarRef<$.Slice<number>> | null): boolean {
	return cryptobyte.String_ReadUint16LengthPrefixed(s, out)
}

export function readUint24LengthPrefixed(s: $.VarRef<cryptobyte.String> | null, out: $.VarRef<$.Slice<number>> | null): boolean {
	return cryptobyte.String_ReadUint24LengthPrefixed(s, out)
}

export async function marshalCertificate(b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null, certificate: __goscript_common.Certificate): globalThis.Promise<void> {
	await cryptobyte.Builder.prototype.AddUint24LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
		for (let __goscriptRangeTarget19 = certificate.Certificate, i = 0; i < $.len(__goscriptRangeTarget19); i++) {
			let cert = __goscriptRangeTarget19![i]
			await cryptobyte.Builder.prototype.AddUint24LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
				cryptobyte.Builder.prototype.AddBytes.call(b, cert)
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
				if (i > 0) {
					// This library only supports OCSP and SCT for leaf certificates.
					return
				}
				if (certificate.OCSPStaple != null) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(5, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						cryptobyte.Builder.prototype.AddUint8.call(b, $.uint(1, 8))
						await cryptobyte.Builder.prototype.AddUint24LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
							cryptobyte.Builder.prototype.AddBytes.call(b, certificate.OCSPStaple)
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
				if (certificate.SignedCertificateTimestamps != null) {
					cryptobyte.Builder.prototype.AddUint16.call(b, $.uint(18, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
							for (let __goscriptRangeTarget18 = certificate.SignedCertificateTimestamps, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget18); __rangeIndex++) {
								let sct = __goscriptRangeTarget18![__rangeIndex]
								await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(b, $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
									cryptobyte.Builder.prototype.AddBytes.call(b, sct)
								}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
							}
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		}
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
}

export function unmarshalCertificate(s: $.VarRef<cryptobyte.String> | null, certificate: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null): boolean {
	let certList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadUint24LengthPrefixed(s, certList)) {
		return false
	}
	while (!cryptobyte.String_Empty(certList.value)) {
		let cert: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
		let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!readUint24LengthPrefixed(certList, cert) || !cryptobyte.String_ReadUint16LengthPrefixed(certList, extensions)) {
			return false
		}
		$.pointerValue<__goscript_common.Certificate>(certificate).Certificate = $.append($.pointerValue<__goscript_common.Certificate>(certificate).Certificate, cert.value)
		while (!cryptobyte.String_Empty(extensions.value)) {
			let extension: $.VarRef<number> = $.varRef(0)
			let extData: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadUint16(extensions, extension) || !cryptobyte.String_ReadUint16LengthPrefixed(extensions, extData)) {
				return false
			}
			if ($.len($.pointerValue<__goscript_common.Certificate>(certificate).Certificate) > 1) {
				// This library only supports OCSP and SCT for leaf certificates.
				continue
			}

			switch (extension.value) {
				case 5:
				{
					let statusType: $.VarRef<number> = $.varRef(0)
					if (((!cryptobyte.String_ReadUint8(extData, statusType) || ($.uint(statusType.value, 8) != $.uint(1, 8))) || !readUint24LengthPrefixed(extData, $.pointerValue<__goscript_common.Certificate>(certificate)._fields.OCSPStaple)) || ($.len($.pointerValue<__goscript_common.Certificate>(certificate).OCSPStaple) == 0)) {
						return false
					}
					break
				}
				case 18:
				{
					let sctList: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadUint16LengthPrefixed(extData, sctList) || cryptobyte.String_Empty(sctList.value)) {
						return false
					}
					while (!cryptobyte.String_Empty(sctList.value)) {
						let sct: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
						if (!readUint16LengthPrefixed(sctList, sct) || ($.len(sct.value) == 0)) {
							return false
						}
						$.pointerValue<__goscript_common.Certificate>(certificate).SignedCertificateTimestamps = $.append($.pointerValue<__goscript_common.Certificate>(certificate).SignedCertificateTimestamps, sct.value)
					}
					break
				}
				default:
				{
					continue
					break
				}
			}

			if (!cryptobyte.String_Empty(extData.value)) {
				return false
			}
		}
	}
	return true
}

export async function transcriptMsg(msg: __goscript_common.handshakeMessage | null, h: transcriptHash | null): globalThis.Promise<$.GoError> {
	{
		let [msgWithOrig, ok] = $.typeAssertTuple<__goscript_common.handshakeMessageWithOriginalBytes | null>(msg, "tls.handshakeMessageWithOriginalBytes")
		if (ok) {
			{
				let orig: $.Slice<number> = await $.pointerValue<Exclude<__goscript_common.handshakeMessageWithOriginalBytes, null>>(msgWithOrig).originalBytes()
				if (orig != null) {
					await $.pointerValue<Exclude<transcriptHash, null>>(h).Write(await $.pointerValue<Exclude<__goscript_common.handshakeMessageWithOriginalBytes, null>>(msgWithOrig).originalBytes())
					return null
				}
			}
		}
	}

	let __goscriptTuple3: any = await $.pointerValue<Exclude<__goscript_common.handshakeMessage, null>>(msg).marshal()
	let data: $.Slice<number> = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return err
	}
	await $.pointerValue<Exclude<transcriptHash, null>>(h).Write(data)
	return null
}
