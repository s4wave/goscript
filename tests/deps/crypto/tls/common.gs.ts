// Generated file based on common.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes2 from "@goscript/bytes/index.js"

import * as list from "@goscript/container/list/index.js"

import * as context2 from "@goscript/context/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as rand2 from "@goscript/crypto/rand/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as sha512 from "@goscript/crypto/sha512/index.js"

import * as fips140tls from "@goscript/crypto/tls/internal/fips140tls/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time2 from "@goscript/time/index.js"

import "@goscript/unsafe/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as aes from "@goscript/crypto/aes/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"

import * as hmac from "@goscript/crypto/hmac/index.js"

import * as sha256 from "@goscript/crypto/sha256/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as hash from "@goscript/hash/index.js"

import type * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_auth from "./auth.gs.ts"

import * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_defaults from "./defaults.gs.ts"

import * as __goscript_defaults_fips140 from "./defaults_fips140.gs.ts"

import type * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_handshake_server from "./handshake_server.gs.ts"

import type * as __goscript_key_agreement from "./key_agreement.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/container/list/index.js"
import "@goscript/context/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/crypto/rand/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/sha512/index.js"
import "@goscript/crypto/tls/internal/fips140tls/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"
import "@goscript/runtime/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "@goscript/strconv/index.js"
import "@goscript/crypto/aes/index.js"
import "@goscript/crypto/cipher/index.js"
import "@goscript/crypto/hmac/index.js"
import "@goscript/crypto/sha256/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/hash/index.js"
import "./auth.gs.ts"
import "./cipher_suites.gs.ts"
import "./common_string.gs.ts"
import "./defaults.gs.ts"
import "./defaults_fips140.gs.ts"
import "./handshake_server.gs.ts"
import "./ticket.gs.ts"

export type recordType = number

export type CurveID = number

export type ClientAuthType = number

export type ClientSessionCache = {
	Get(sessionKey: string): [__goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null, boolean] | globalThis.Promise<[__goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null, boolean]>
	Put(sessionKey: string, cs: __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null): void
}

$.registerInterfaceType(
	"tls.ClientSessionCache",
	null,
	[{ name: "Get", args: [{ name: "sessionKey", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "session", type: { kind: $.TypeKind.Pointer, elemType: "tls.ClientSessionState" } }, { name: "ok", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Put", args: [{ name: "sessionKey", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "cs", type: { kind: $.TypeKind.Pointer, elemType: "tls.ClientSessionState" } }], returns: [] }]
);

export type SignatureScheme = number

export type RenegotiationSupport = number

export type handshakeMessage = {
	marshal(): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	unmarshal(_p0: $.Slice<number>): boolean
}

$.registerInterfaceType(
	"tls.handshakeMessage",
	null,
	[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "unmarshal", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
);

export type handshakeMessageWithOriginalBytes = {
	marshal(): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	originalBytes(): $.Slice<number>
	unmarshal(_p0: $.Slice<number>): boolean
}

$.registerInterfaceType(
	"tls.handshakeMessageWithOriginalBytes",
	null,
	[{ name: "marshal", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "originalBytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "unmarshal", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
);

export class keyShare {
	public get group(): CurveID {
		return this._fields.group.value
	}
	public set group(value: CurveID) {
		this._fields.group.value = value
	}

	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		group: $.VarRef<CurveID>
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{group?: CurveID, data?: $.Slice<number>}>) {
		this._fields = {
			group: $.varRef(init?.group ?? (0 as CurveID)),
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
		}
	}

	public clone(): keyShare {
		const cloned = new keyShare()
		cloned._fields = {
			group: $.varRef(this._fields.group.value),
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.keyShare",
		() => new keyShare(),
		[],
		keyShare,
		[{ name: "group", key: "group", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }]
	)
}

export class pskIdentity {
	public get label(): $.Slice<number> {
		return this._fields.label.value
	}
	public set label(value: $.Slice<number>) {
		this._fields.label.value = value
	}

	public get obfuscatedTicketAge(): number {
		return this._fields.obfuscatedTicketAge.value
	}
	public set obfuscatedTicketAge(value: number) {
		this._fields.obfuscatedTicketAge.value = value
	}

	public _fields: {
		label: $.VarRef<$.Slice<number>>
		obfuscatedTicketAge: $.VarRef<number>
	}

	constructor(init?: Partial<{label?: $.Slice<number>, obfuscatedTicketAge?: number}>) {
		this._fields = {
			label: $.varRef(init?.label ?? (null as $.Slice<number>)),
			obfuscatedTicketAge: $.varRef(init?.obfuscatedTicketAge ?? (0 as number))
		}
	}

	public clone(): pskIdentity {
		const cloned = new pskIdentity()
		cloned._fields = {
			label: $.varRef(this._fields.label.value),
			obfuscatedTicketAge: $.varRef(this._fields.obfuscatedTicketAge.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.pskIdentity",
		() => new pskIdentity(),
		[],
		pskIdentity,
		[{ name: "label", key: "label", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "obfuscatedTicketAge", key: "obfuscatedTicketAge", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "crypto/tls", index: [1], offset: 24, exported: false }]
	)
}

export class ConnectionState {
	// Version is the TLS version used by the connection (e.g. VersionTLS12).
	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	// HandshakeComplete is true if the handshake has concluded.
	public get HandshakeComplete(): boolean {
		return this._fields.HandshakeComplete.value
	}
	public set HandshakeComplete(value: boolean) {
		this._fields.HandshakeComplete.value = value
	}

	// DidResume is true if this connection was successfully resumed from a
	// previous session with a session ticket or similar mechanism.
	public get DidResume(): boolean {
		return this._fields.DidResume.value
	}
	public set DidResume(value: boolean) {
		this._fields.DidResume.value = value
	}

	// CipherSuite is the cipher suite negotiated for the connection (e.g.
	// TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_AES_128_GCM_SHA256).
	public get CipherSuite(): number {
		return this._fields.CipherSuite.value
	}
	public set CipherSuite(value: number) {
		this._fields.CipherSuite.value = value
	}

	// CurveID is the key exchange mechanism used for the connection. The name
	// refers to elliptic curves for legacy reasons, see [CurveID]. If a legacy
	// RSA key exchange is used, this value is zero.
	public get CurveID(): CurveID {
		return this._fields.CurveID.value
	}
	public set CurveID(value: CurveID) {
		this._fields.CurveID.value = value
	}

	// NegotiatedProtocol is the application protocol negotiated with ALPN.
	public get NegotiatedProtocol(): string {
		return this._fields.NegotiatedProtocol.value
	}
	public set NegotiatedProtocol(value: string) {
		this._fields.NegotiatedProtocol.value = value
	}

	// NegotiatedProtocolIsMutual used to indicate a mutual NPN negotiation.
	//
	// Deprecated: this value is always true.
	public get NegotiatedProtocolIsMutual(): boolean {
		return this._fields.NegotiatedProtocolIsMutual.value
	}
	public set NegotiatedProtocolIsMutual(value: boolean) {
		this._fields.NegotiatedProtocolIsMutual.value = value
	}

	// ServerName is the value of the Server Name Indication extension sent by
	// the client. It's available both on the server and on the client side.
	public get ServerName(): string {
		return this._fields.ServerName.value
	}
	public set ServerName(value: string) {
		this._fields.ServerName.value = value
	}

	// PeerCertificates are the parsed certificates sent by the peer, in the
	// order in which they were sent. The first element is the leaf certificate
	// that the connection is verified against.
	//
	// On the client side, it can't be empty. On the server side, it can be
	// empty if Config.ClientAuth is not RequireAnyClientCert or
	// RequireAndVerifyClientCert.
	//
	// PeerCertificates and its contents should not be modified.
	public get PeerCertificates(): $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null> {
		return this._fields.PeerCertificates.value
	}
	public set PeerCertificates(value: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>) {
		this._fields.PeerCertificates.value = value
	}

	// VerifiedChains is a list of one or more chains where the first element is
	// PeerCertificates[0] and the last element is from Config.RootCAs (on the
	// client side) or Config.ClientCAs (on the server side).
	//
	// On the client side, it's set if Config.InsecureSkipVerify is false. On
	// the server side, it's set if Config.ClientAuth is VerifyClientCertIfGiven
	// (and the peer provided a certificate) or RequireAndVerifyClientCert.
	//
	// VerifiedChains and its contents should not be modified.
	public get VerifiedChains(): $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>> {
		return this._fields.VerifiedChains.value
	}
	public set VerifiedChains(value: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>) {
		this._fields.VerifiedChains.value = value
	}

	// SignedCertificateTimestamps is a list of SCTs provided by the peer
	// through the TLS handshake for the leaf certificate, if any.
	public get SignedCertificateTimestamps(): $.Slice<$.Slice<number>> {
		return this._fields.SignedCertificateTimestamps.value
	}
	public set SignedCertificateTimestamps(value: $.Slice<$.Slice<number>>) {
		this._fields.SignedCertificateTimestamps.value = value
	}

	// OCSPResponse is a stapled Online Certificate Status Protocol (OCSP)
	// response provided by the peer for the leaf certificate, if any.
	public get OCSPResponse(): $.Slice<number> {
		return this._fields.OCSPResponse.value
	}
	public set OCSPResponse(value: $.Slice<number>) {
		this._fields.OCSPResponse.value = value
	}

	// TLSUnique contains the "tls-unique" channel binding value (see RFC 5929,
	// Section 3). This value will be nil for TLS 1.3 connections and for
	// resumed connections that don't support Extended Master Secret (RFC 7627).
	public get TLSUnique(): $.Slice<number> {
		return this._fields.TLSUnique.value
	}
	public set TLSUnique(value: $.Slice<number>) {
		this._fields.TLSUnique.value = value
	}

	// ECHAccepted indicates if Encrypted Client Hello was offered by the client
	// and accepted by the server. Currently, ECH is supported only on the
	// client side.
	public get ECHAccepted(): boolean {
		return this._fields.ECHAccepted.value
	}
	public set ECHAccepted(value: boolean) {
		this._fields.ECHAccepted.value = value
	}

	// HelloRetryRequest indicates whether we sent a HelloRetryRequest if we
	// are a server, or if we received a HelloRetryRequest if we are a client.
	public get HelloRetryRequest(): boolean {
		return this._fields.HelloRetryRequest.value
	}
	public set HelloRetryRequest(value: boolean) {
		this._fields.HelloRetryRequest.value = value
	}

	// ekm is a closure exposed via ExportKeyingMaterial.
	public get ekm(): ((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null {
		return this._fields.ekm.value
	}
	public set ekm(value: ((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null) {
		this._fields.ekm.value = value
	}

	// testingOnlyPeerSignatureAlgorithm is the signature algorithm used by the
	// peer to sign the handshake. It is not set for resumed connections.
	public get testingOnlyPeerSignatureAlgorithm(): SignatureScheme {
		return this._fields.testingOnlyPeerSignatureAlgorithm.value
	}
	public set testingOnlyPeerSignatureAlgorithm(value: SignatureScheme) {
		this._fields.testingOnlyPeerSignatureAlgorithm.value = value
	}

	public _fields: {
		Version: $.VarRef<number>
		HandshakeComplete: $.VarRef<boolean>
		DidResume: $.VarRef<boolean>
		CipherSuite: $.VarRef<number>
		CurveID: $.VarRef<CurveID>
		NegotiatedProtocol: $.VarRef<string>
		NegotiatedProtocolIsMutual: $.VarRef<boolean>
		ServerName: $.VarRef<string>
		PeerCertificates: $.VarRef<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>
		VerifiedChains: $.VarRef<$.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>>
		SignedCertificateTimestamps: $.VarRef<$.Slice<$.Slice<number>>>
		OCSPResponse: $.VarRef<$.Slice<number>>
		TLSUnique: $.VarRef<$.Slice<number>>
		ECHAccepted: $.VarRef<boolean>
		HelloRetryRequest: $.VarRef<boolean>
		ekm: $.VarRef<((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null>
		testingOnlyPeerSignatureAlgorithm: $.VarRef<SignatureScheme>
	}

	constructor(init?: Partial<{Version?: number, HandshakeComplete?: boolean, DidResume?: boolean, CipherSuite?: number, CurveID?: CurveID, NegotiatedProtocol?: string, NegotiatedProtocolIsMutual?: boolean, ServerName?: string, PeerCertificates?: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>, VerifiedChains?: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>, SignedCertificateTimestamps?: $.Slice<$.Slice<number>>, OCSPResponse?: $.Slice<number>, TLSUnique?: $.Slice<number>, ECHAccepted?: boolean, HelloRetryRequest?: boolean, ekm?: ((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null, testingOnlyPeerSignatureAlgorithm?: SignatureScheme}>) {
		this._fields = {
			Version: $.varRef(init?.Version ?? (0 as number)),
			HandshakeComplete: $.varRef(init?.HandshakeComplete ?? (false as boolean)),
			DidResume: $.varRef(init?.DidResume ?? (false as boolean)),
			CipherSuite: $.varRef(init?.CipherSuite ?? (0 as number)),
			CurveID: $.varRef(init?.CurveID ?? (0 as CurveID)),
			NegotiatedProtocol: $.varRef(init?.NegotiatedProtocol ?? ("" as string)),
			NegotiatedProtocolIsMutual: $.varRef(init?.NegotiatedProtocolIsMutual ?? (false as boolean)),
			ServerName: $.varRef(init?.ServerName ?? ("" as string)),
			PeerCertificates: $.varRef(init?.PeerCertificates ?? (null as $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>)),
			VerifiedChains: $.varRef(init?.VerifiedChains ?? (null as $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>)),
			SignedCertificateTimestamps: $.varRef(init?.SignedCertificateTimestamps ?? (null as $.Slice<$.Slice<number>>)),
			OCSPResponse: $.varRef(init?.OCSPResponse ?? (null as $.Slice<number>)),
			TLSUnique: $.varRef(init?.TLSUnique ?? (null as $.Slice<number>)),
			ECHAccepted: $.varRef(init?.ECHAccepted ?? (false as boolean)),
			HelloRetryRequest: $.varRef(init?.HelloRetryRequest ?? (false as boolean)),
			ekm: $.varRef(init?.ekm ?? (null as ((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null)),
			testingOnlyPeerSignatureAlgorithm: $.varRef(init?.testingOnlyPeerSignatureAlgorithm ?? (0 as SignatureScheme))
		}
	}

	public clone(): ConnectionState {
		const cloned = new ConnectionState()
		cloned._fields = {
			Version: $.varRef(this._fields.Version.value),
			HandshakeComplete: $.varRef(this._fields.HandshakeComplete.value),
			DidResume: $.varRef(this._fields.DidResume.value),
			CipherSuite: $.varRef(this._fields.CipherSuite.value),
			CurveID: $.varRef(this._fields.CurveID.value),
			NegotiatedProtocol: $.varRef(this._fields.NegotiatedProtocol.value),
			NegotiatedProtocolIsMutual: $.varRef(this._fields.NegotiatedProtocolIsMutual.value),
			ServerName: $.varRef(this._fields.ServerName.value),
			PeerCertificates: $.varRef(this._fields.PeerCertificates.value),
			VerifiedChains: $.varRef(this._fields.VerifiedChains.value),
			SignedCertificateTimestamps: $.varRef(this._fields.SignedCertificateTimestamps.value),
			OCSPResponse: $.varRef(this._fields.OCSPResponse.value),
			TLSUnique: $.varRef(this._fields.TLSUnique.value),
			ECHAccepted: $.varRef(this._fields.ECHAccepted.value),
			HelloRetryRequest: $.varRef(this._fields.HelloRetryRequest.value),
			ekm: $.varRef(this._fields.ekm.value),
			testingOnlyPeerSignatureAlgorithm: $.varRef(this._fields.testingOnlyPeerSignatureAlgorithm.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ExportKeyingMaterial(label: string, context: $.Slice<number>, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const cs: ConnectionState | $.VarRef<ConnectionState> | null = this
		return $.pointerValue<ConnectionState>(cs).ekm!(label, context, length)
	}

	static __typeInfo = $.registerStructType(
		"tls.ConnectionState",
		() => new ConnectionState(),
		[{ name: "ExportKeyingMaterial", args: [{ name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "context", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "length", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }],
		ConnectionState,
		[{ name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [0], offset: 0, exported: true }, { name: "HandshakeComplete", key: "HandshakeComplete", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [1], offset: 2, exported: true }, { name: "DidResume", key: "DidResume", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [2], offset: 3, exported: true }, { name: "CipherSuite", key: "CipherSuite", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [3], offset: 4, exported: true }, { name: "CurveID", key: "CurveID", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }, index: [4], offset: 6, exported: true }, { name: "NegotiatedProtocol", key: "NegotiatedProtocol", type: { kind: $.TypeKind.Basic, name: "string" }, index: [5], offset: 8, exported: true }, { name: "NegotiatedProtocolIsMutual", key: "NegotiatedProtocolIsMutual", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [6], offset: 24, exported: true }, { name: "ServerName", key: "ServerName", type: { kind: $.TypeKind.Basic, name: "string" }, index: [7], offset: 32, exported: true }, { name: "PeerCertificates", key: "PeerCertificates", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, index: [8], offset: 48, exported: true }, { name: "VerifiedChains", key: "VerifiedChains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } }, index: [9], offset: 72, exported: true }, { name: "SignedCertificateTimestamps", key: "SignedCertificateTimestamps", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, index: [10], offset: 96, exported: true }, { name: "OCSPResponse", key: "OCSPResponse", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [11], offset: 120, exported: true }, { name: "TLSUnique", key: "TLSUnique", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [12], offset: 144, exported: true }, { name: "ECHAccepted", key: "ECHAccepted", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [13], offset: 168, exported: true }, { name: "HelloRetryRequest", key: "HelloRetryRequest", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [14], offset: 169, exported: true }, { name: "ekm", key: "ekm", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [15], offset: 176, exported: false }, { name: "testingOnlyPeerSignatureAlgorithm", key: "testingOnlyPeerSignatureAlgorithm", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }, pkgPath: "crypto/tls", index: [16], offset: 184, exported: false }]
	)
}

export class ClientHelloInfo {
	// CipherSuites lists the CipherSuites supported by the client (e.g.
	// TLS_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256).
	public get CipherSuites(): $.Slice<number> {
		return this._fields.CipherSuites.value
	}
	public set CipherSuites(value: $.Slice<number>) {
		this._fields.CipherSuites.value = value
	}

	// ServerName indicates the name of the server requested by the client
	// in order to support virtual hosting. ServerName is only set if the
	// client is using SNI (see RFC 4366, Section 3.1).
	public get ServerName(): string {
		return this._fields.ServerName.value
	}
	public set ServerName(value: string) {
		this._fields.ServerName.value = value
	}

	// SupportedCurves lists the key exchange mechanisms supported by the
	// client. It was renamed to "supported groups" in TLS 1.3, see RFC 8446,
	// Section 4.2.7 and [CurveID].
	//
	// SupportedCurves may be nil in TLS 1.2 and lower if the Supported Elliptic
	// Curves Extension is not being used (see RFC 4492, Section 5.1.1).
	public get SupportedCurves(): $.Slice<CurveID> {
		return this._fields.SupportedCurves.value
	}
	public set SupportedCurves(value: $.Slice<CurveID>) {
		this._fields.SupportedCurves.value = value
	}

	// SupportedPoints lists the point formats supported by the client.
	// SupportedPoints is set only if the Supported Point Formats Extension
	// is being used (see RFC 4492, Section 5.1.2).
	public get SupportedPoints(): $.Slice<number> {
		return this._fields.SupportedPoints.value
	}
	public set SupportedPoints(value: $.Slice<number>) {
		this._fields.SupportedPoints.value = value
	}

	// SignatureSchemes lists the signature and hash schemes that the client
	// is willing to verify. SignatureSchemes is set only if the Signature
	// Algorithms Extension is being used (see RFC 5246, Section 7.4.1.4.1).
	public get SignatureSchemes(): $.Slice<SignatureScheme> {
		return this._fields.SignatureSchemes.value
	}
	public set SignatureSchemes(value: $.Slice<SignatureScheme>) {
		this._fields.SignatureSchemes.value = value
	}

	// SupportedProtos lists the application protocols supported by the client.
	// SupportedProtos is set only if the Application-Layer Protocol
	// Negotiation Extension is being used (see RFC 7301, Section 3.1).
	//
	// Servers can select a protocol by setting Config.NextProtos in a
	// GetConfigForClient return value.
	public get SupportedProtos(): $.Slice<string> {
		return this._fields.SupportedProtos.value
	}
	public set SupportedProtos(value: $.Slice<string>) {
		this._fields.SupportedProtos.value = value
	}

	// SupportedVersions lists the TLS versions supported by the client.
	// For TLS versions less than 1.3, this is extrapolated from the max
	// version advertised by the client, so values other than the greatest
	// might be rejected if used.
	public get SupportedVersions(): $.Slice<number> {
		return this._fields.SupportedVersions.value
	}
	public set SupportedVersions(value: $.Slice<number>) {
		this._fields.SupportedVersions.value = value
	}

	// Extensions lists the IDs of the extensions presented by the client
	// in the ClientHello.
	public get Extensions(): $.Slice<number> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<number>) {
		this._fields.Extensions.value = value
	}

	// Conn is the underlying net.Conn for the connection. Do not read
	// from, or write to, this connection; that will cause the TLS
	// connection to fail.
	public get Conn(): net.Conn | null {
		return this._fields.Conn.value
	}
	public set Conn(value: net.Conn | null) {
		this._fields.Conn.value = value
	}

	// HelloRetryRequest indicates whether the ClientHello was sent in response
	// to a HelloRetryRequest message.
	public get HelloRetryRequest(): boolean {
		return this._fields.HelloRetryRequest.value
	}
	public set HelloRetryRequest(value: boolean) {
		this._fields.HelloRetryRequest.value = value
	}

	// config is embedded by the GetCertificate or GetConfigForClient caller,
	// for use with SupportsCertificate.
	public get config(): Config | $.VarRef<Config> | null {
		return this._fields.config.value
	}
	public set config(value: Config | $.VarRef<Config> | null) {
		this._fields.config.value = value
	}

	// ctx is the context of the handshake that is in progress.
	public get ctx(): context2.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context2.Context | null) {
		this._fields.ctx.value = value
	}

	public _fields: {
		CipherSuites: $.VarRef<$.Slice<number>>
		ServerName: $.VarRef<string>
		SupportedCurves: $.VarRef<$.Slice<CurveID>>
		SupportedPoints: $.VarRef<$.Slice<number>>
		SignatureSchemes: $.VarRef<$.Slice<SignatureScheme>>
		SupportedProtos: $.VarRef<$.Slice<string>>
		SupportedVersions: $.VarRef<$.Slice<number>>
		Extensions: $.VarRef<$.Slice<number>>
		Conn: $.VarRef<net.Conn | null>
		HelloRetryRequest: $.VarRef<boolean>
		config: $.VarRef<Config | $.VarRef<Config> | null>
		ctx: $.VarRef<context2.Context | null>
	}

	constructor(init?: Partial<{CipherSuites?: $.Slice<number>, ServerName?: string, SupportedCurves?: $.Slice<CurveID>, SupportedPoints?: $.Slice<number>, SignatureSchemes?: $.Slice<SignatureScheme>, SupportedProtos?: $.Slice<string>, SupportedVersions?: $.Slice<number>, Extensions?: $.Slice<number>, Conn?: net.Conn | null, HelloRetryRequest?: boolean, config?: Config | $.VarRef<Config> | null, ctx?: context2.Context | null}>) {
		this._fields = {
			CipherSuites: $.varRef(init?.CipherSuites ?? (null as $.Slice<number>)),
			ServerName: $.varRef(init?.ServerName ?? ("" as string)),
			SupportedCurves: $.varRef(init?.SupportedCurves ?? (null as $.Slice<CurveID>)),
			SupportedPoints: $.varRef(init?.SupportedPoints ?? (null as $.Slice<number>)),
			SignatureSchemes: $.varRef(init?.SignatureSchemes ?? (null as $.Slice<SignatureScheme>)),
			SupportedProtos: $.varRef(init?.SupportedProtos ?? (null as $.Slice<string>)),
			SupportedVersions: $.varRef(init?.SupportedVersions ?? (null as $.Slice<number>)),
			Extensions: $.varRef(init?.Extensions ?? (null as $.Slice<number>)),
			Conn: $.varRef(init?.Conn ?? (null as net.Conn | null)),
			HelloRetryRequest: $.varRef(init?.HelloRetryRequest ?? (false as boolean)),
			config: $.varRef(init?.config ?? (null as Config | $.VarRef<Config> | null)),
			ctx: $.varRef(init?.ctx ?? (null as context2.Context | null))
		}
	}

	public clone(): ClientHelloInfo {
		const cloned = new ClientHelloInfo()
		cloned._fields = {
			CipherSuites: $.varRef(this._fields.CipherSuites.value),
			ServerName: $.varRef(this._fields.ServerName.value),
			SupportedCurves: $.varRef(this._fields.SupportedCurves.value),
			SupportedPoints: $.varRef(this._fields.SupportedPoints.value),
			SignatureSchemes: $.varRef(this._fields.SignatureSchemes.value),
			SupportedProtos: $.varRef(this._fields.SupportedProtos.value),
			SupportedVersions: $.varRef(this._fields.SupportedVersions.value),
			Extensions: $.varRef(this._fields.Extensions.value),
			Conn: $.varRef(this._fields.Conn.value),
			HelloRetryRequest: $.varRef(this._fields.HelloRetryRequest.value),
			config: $.varRef(this._fields.config.value),
			ctx: $.varRef(this._fields.ctx.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Context(): context2.Context | null {
		const c: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null = this
		return $.pointerValue<ClientHelloInfo>(c).ctx
	}

	public async SupportsCertificate(c: Certificate | $.VarRef<Certificate> | null): globalThis.Promise<$.GoError> {
		const chi: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null = this
		// Note we don't currently support certificate_authorities nor
		// signature_algorithms_cert, and don't check the algorithms of the
		// signatures on the chain (which anyway are a SHOULD, see RFC 8446,
		// Section 4.4.2.2).

		let config: Config | $.VarRef<Config> | null = $.pointerValue<ClientHelloInfo>(chi).config
		if (config == null) {
			config = new Config()
		}
		let __goscriptTuple0: any = Config.prototype.mutualVersion.call(config, false, $.pointerValue<ClientHelloInfo>(chi).SupportedVersions)
		let vers = $.uint(__goscriptTuple0[0], 16)
		let ok = __goscriptTuple0[1]
		if (!ok) {
			return errors.New("no mutually supported protocol versions")
		}

		// If the client specified the name they are trying to connect to, the
		// certificate needs to be valid for it.
		if (!$.stringEqual($.pointerValue<ClientHelloInfo>(chi).ServerName, "")) {
			let __goscriptTuple1: any = await Certificate.prototype.leaf.call(c)
			let x509Cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple1[0]
			let err = __goscriptTuple1[1]
			if (err != null) {
				return fmt.Errorf("failed to parse certificate: %w", (err as any))
			}
			{
				let __goscriptShadow0 = x509.Certificate.prototype.VerifyHostname.call(x509Cert, $.pointerValue<ClientHelloInfo>(chi).ServerName)
				if (__goscriptShadow0 != null) {
					return fmt.Errorf("certificate is not valid for requested server name: %w", (__goscriptShadow0 as any))
				}
			}
		}

		// supportsRSAFallback returns nil if the certificate and connection support
		// the static RSA key exchange, and unsupported otherwise. The logic for
		// supporting static RSA is completely disjoint from the logic for
		// supporting signed key exchanges, so we just check it as a fallback.
		let supportsRSAFallback: ((unsupported: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue(async (unsupported: $.GoError): globalThis.Promise<$.GoError> => {
			// TLS 1.3 dropped support for the static RSA key exchange.
			if ($.uint(vers, 16) == $.uint(772, 16)) {
				return unsupported
			}
			// The static RSA key exchange works by decrypting a challenge with the
			// RSA private key, not by signing, so check the PrivateKey implements
			// crypto.Decrypter, like *rsa.PrivateKey does.
			{
				let [priv, __goscriptShadow1] = $.typeAssertTuple<crypto.Decrypter | null>($.pointerValue<Certificate>(c).PrivateKey, "crypto.Decrypter")
				if (__goscriptShadow1) {
					{
						let [, __goscriptShadow2] = $.typeAssertTuple<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(await $.pointerValue<Exclude<crypto.Decrypter, null>>(priv).Public(), { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })
						if (!__goscriptShadow2) {
							return unsupported
						}
					}
				} else {
					return unsupported
				}
			}
			// Finally, there needs to be a mutual cipher suite that uses the static
			// RSA key exchange instead of ECDHE.
			let rsaCipherSuite: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null = await __goscript_cipher_suites.selectCipherSuite($.pointerValue<ClientHelloInfo>(chi).CipherSuites, Config.prototype.supportedCipherSuites.call(config), $.functionValue((c: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null): boolean => {
				if (($.pointerValue<__goscript_cipher_suites.cipherSuite>(c).flags & 1) != 0) {
					return false
				}
				if (($.uint(vers, 16) < $.uint(771, 16)) && (($.pointerValue<__goscript_cipher_suites.cipherSuite>(c).flags & 4) != 0)) {
					return false
				}
				return true
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "tls.cipherSuite" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
			if (rsaCipherSuite == null) {
				return unsupported
			}
			return null
		}, ({ kind: $.TypeKind.Function, params: ["error"], results: ["error"] } as $.FunctionTypeInfo))

		// If the client sent the signature_algorithms extension, ensure it supports
		// schemes we can use with this certificate and TLS version.
		if ($.len($.pointerValue<ClientHelloInfo>(chi).SignatureSchemes) > 0) {
			{
				let [, err] = await __goscript_auth.selectSignatureScheme($.uint(vers, 16), c, $.pointerValue<ClientHelloInfo>(chi).SignatureSchemes)
				if (err != null) {
					return supportsRSAFallback!(err)
				}
			}
		}

		// In TLS 1.3 we are done because supported_groups is only relevant to the
		// ECDHE computation, point format negotiation is removed, cipher suites are
		// only relevant to the AEAD choice, and static RSA does not exist.
		if ($.uint(vers, 16) == $.uint(772, 16)) {
			return null
		}

		// The only signed key exchange we support is ECDHE.
		let [ecdheSupported, err] = __goscript_handshake_server.supportsECDHE(config, $.uint(vers, 16), $.pointerValue<ClientHelloInfo>(chi).SupportedCurves, $.pointerValue<ClientHelloInfo>(chi).SupportedPoints)
		if (err != null) {
			return err
		}
		if (!ecdheSupported) {
			return supportsRSAFallback!(errors.New("client doesn't support ECDHE, can only use legacy RSA key exchange"))
		}

		let ecdsaCipherSuite: boolean = false
		{
			let [priv, __goscriptShadow3] = $.typeAssertTuple<crypto.Signer | null>($.pointerValue<Certificate>(c).PrivateKey, "crypto.Signer")
			if (__goscriptShadow3) {
				{
					const __goscriptTypeSwitchValue = await $.pointerValue<Exclude<crypto.Signer, null>>(priv).Public()
					switch (true) {
						case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
							{
								let pub: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).value
								let curve: CurveID = 0
								{
									let __goscriptSwitch0 = $.pointerValue<ecdsa.PublicKey>(pub).Curve
									switch (true) {
										case $.comparableEqual(__goscriptSwitch0, await elliptic.P256()):
										{
											curve = $.uint(23, 16)
											break
										}
										case $.comparableEqual(__goscriptSwitch0, await elliptic.P384()):
										{
											curve = $.uint(24, 16)
											break
										}
										case $.comparableEqual(__goscriptSwitch0, await elliptic.P521()):
										{
											curve = $.uint(25, 16)
											break
										}
										default:
										{
											return supportsRSAFallback!(await __goscript_auth.unsupportedCertificateError(c))
											break
										}
									}
								}
								let curveOk: boolean = false
								for (let __goscriptRangeTarget0 = $.pointerValue<ClientHelloInfo>(chi).SupportedCurves, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
									let c = __goscriptRangeTarget0![__rangeIndex]
									if (($.uint(c, 16) == $.uint(curve, 16)) && Config.prototype.supportsCurve.call(config, $.uint(vers, 16), $.uint(c, 16))) {
										curveOk = true
										break
									}
								}
								if (!curveOk) {
									return errors.New("client doesn't support certificate curve")
								}
								ecdsaCipherSuite = true
							}
							break
						case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
							{
								let pub: ed25519.PublicKey = $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
								if (($.uint(vers, 16) < $.uint(771, 16)) || ($.len($.pointerValue<ClientHelloInfo>(chi).SignatureSchemes) == 0)) {
									return errors.New("connection doesn't support Ed25519")
								}
								ecdsaCipherSuite = true
							}
							break
						case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
							{
								let pub: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).value
							}
							break
						default:
							{
								let pub: any = __goscriptTypeSwitchValue
								return supportsRSAFallback!(await __goscript_auth.unsupportedCertificateError(c))
							}
							break
					}
				}
			} else {
				return supportsRSAFallback!(await __goscript_auth.unsupportedCertificateError(c))
			}
		}

		// Make sure that there is a mutually supported cipher suite that works with
		// this certificate. Cipher suite selection will then apply the logic in
		// reverse to pick it. See also serverHandshakeState.cipherSuiteOk.
		let __goscriptShadow4: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null = await __goscript_cipher_suites.selectCipherSuite($.pointerValue<ClientHelloInfo>(chi).CipherSuites, Config.prototype.supportedCipherSuites.call(config), $.functionValue((c: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null): boolean => {
			if (($.pointerValue<__goscript_cipher_suites.cipherSuite>(c).flags & 1) == 0) {
				return false
			}
			if (($.pointerValue<__goscript_cipher_suites.cipherSuite>(c).flags & 2) != 0) {
				if (!ecdsaCipherSuite) {
					return false
				}
			} else {
				if (ecdsaCipherSuite) {
					return false
				}
			}
			if (($.uint(vers, 16) < $.uint(771, 16)) && (($.pointerValue<__goscript_cipher_suites.cipherSuite>(c).flags & 4) != 0)) {
				return false
			}
			return true
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "tls.cipherSuite" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
		if (__goscriptShadow4 == null) {
			return supportsRSAFallback!(errors.New("client doesn't support any cipher suites compatible with the certificate"))
		}

		return null
	}

	static __typeInfo = $.registerStructType(
		"tls.ClientHelloInfo",
		() => new ClientHelloInfo(),
		[{ name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "SupportsCertificate", args: [{ name: "c", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }], returns: [{ name: "_r0", type: "error" }] }],
		ClientHelloInfo,
		[{ name: "CipherSuites", key: "CipherSuites", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }, index: [0], offset: 0, exported: true }, { name: "ServerName", key: "ServerName", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 24, exported: true }, { name: "SupportedCurves", key: "SupportedCurves", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" } }, index: [2], offset: 40, exported: true }, { name: "SupportedPoints", key: "SupportedPoints", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [3], offset: 64, exported: true }, { name: "SignatureSchemes", key: "SignatureSchemes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" } }, index: [4], offset: 88, exported: true }, { name: "SupportedProtos", key: "SupportedProtos", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [5], offset: 112, exported: true }, { name: "SupportedVersions", key: "SupportedVersions", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }, index: [6], offset: 136, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }, index: [7], offset: 160, exported: true }, { name: "Conn", key: "Conn", type: "net.Conn", index: [8], offset: 184, exported: true }, { name: "HelloRetryRequest", key: "HelloRetryRequest", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [9], offset: 200, exported: true }, { name: "config", key: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" }, pkgPath: "crypto/tls", index: [10], offset: 208, exported: false }, { name: "ctx", key: "ctx", type: "context.Context", pkgPath: "crypto/tls", index: [11], offset: 216, exported: false }]
	)
}

export class CertificateRequestInfo {
	// AcceptableCAs contains zero or more, DER-encoded, X.501
	// Distinguished Names. These are the names of root or intermediate CAs
	// that the server wishes the returned certificate to be signed by. An
	// empty slice indicates that the server has no preference.
	public get AcceptableCAs(): $.Slice<$.Slice<number>> {
		return this._fields.AcceptableCAs.value
	}
	public set AcceptableCAs(value: $.Slice<$.Slice<number>>) {
		this._fields.AcceptableCAs.value = value
	}

	// SignatureSchemes lists the signature schemes that the server is
	// willing to verify.
	public get SignatureSchemes(): $.Slice<SignatureScheme> {
		return this._fields.SignatureSchemes.value
	}
	public set SignatureSchemes(value: $.Slice<SignatureScheme>) {
		this._fields.SignatureSchemes.value = value
	}

	// Version is the TLS version that was negotiated for this connection.
	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	// ctx is the context of the handshake that is in progress.
	public get ctx(): context2.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context2.Context | null) {
		this._fields.ctx.value = value
	}

	public _fields: {
		AcceptableCAs: $.VarRef<$.Slice<$.Slice<number>>>
		SignatureSchemes: $.VarRef<$.Slice<SignatureScheme>>
		Version: $.VarRef<number>
		ctx: $.VarRef<context2.Context | null>
	}

	constructor(init?: Partial<{AcceptableCAs?: $.Slice<$.Slice<number>>, SignatureSchemes?: $.Slice<SignatureScheme>, Version?: number, ctx?: context2.Context | null}>) {
		this._fields = {
			AcceptableCAs: $.varRef(init?.AcceptableCAs ?? (null as $.Slice<$.Slice<number>>)),
			SignatureSchemes: $.varRef(init?.SignatureSchemes ?? (null as $.Slice<SignatureScheme>)),
			Version: $.varRef(init?.Version ?? (0 as number)),
			ctx: $.varRef(init?.ctx ?? (null as context2.Context | null))
		}
	}

	public clone(): CertificateRequestInfo {
		const cloned = new CertificateRequestInfo()
		cloned._fields = {
			AcceptableCAs: $.varRef(this._fields.AcceptableCAs.value),
			SignatureSchemes: $.varRef(this._fields.SignatureSchemes.value),
			Version: $.varRef(this._fields.Version.value),
			ctx: $.varRef(this._fields.ctx.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Context(): context2.Context | null {
		const c: CertificateRequestInfo | $.VarRef<CertificateRequestInfo> | null = this
		return $.pointerValue<CertificateRequestInfo>(c).ctx
	}

	public async SupportsCertificate(c: Certificate | $.VarRef<Certificate> | null): globalThis.Promise<$.GoError> {
		const cri: CertificateRequestInfo | $.VarRef<CertificateRequestInfo> | null = this
		{
			let [, err] = await __goscript_auth.selectSignatureScheme($.uint($.pointerValue<CertificateRequestInfo>(cri).Version, 16), c, $.pointerValue<CertificateRequestInfo>(cri).SignatureSchemes)
			if (err != null) {
				return err
			}
		}

		if ($.len($.pointerValue<CertificateRequestInfo>(cri).AcceptableCAs) == 0) {
			return null
		}

		for (let __goscriptRangeTarget2 = $.pointerValue<Certificate>(c).Certificate, j = 0; j < $.len(__goscriptRangeTarget2); j++) {
			let cert = __goscriptRangeTarget2![j]
			let x509Cert: x509.Certificate | $.VarRef<x509.Certificate> | null = $.pointerValue<Certificate>(c).Leaf
			// Parse the certificate if this isn't the leaf node, or if
			// chain.Leaf was nil.
			if ((j != 0) || (x509Cert == null)) {
				let err: $.GoError = null as $.GoError
				{
					let __goscriptTuple2: any = await x509.ParseCertificate(cert)
					x509Cert = __goscriptTuple2[0]
					err = __goscriptTuple2[1]
					if (err != null) {
						return fmt.Errorf("failed to parse certificate #%d in the chain: %w", $.namedValueInterfaceValue<any>(j, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (err as any))
					}
				}
			}

			for (let __goscriptRangeTarget1 = $.pointerValue<CertificateRequestInfo>(cri).AcceptableCAs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
				let ca = __goscriptRangeTarget1![__rangeIndex]
				if (bytes2.Equal($.pointerValue<x509.Certificate>(x509Cert).RawIssuer, ca)) {
					return null
				}
			}
		}
		return errors.New("chain is not signed by an acceptable CA")
	}

	static __typeInfo = $.registerStructType(
		"tls.CertificateRequestInfo",
		() => new CertificateRequestInfo(),
		[{ name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "SupportsCertificate", args: [{ name: "c", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }], returns: [{ name: "_r0", type: "error" }] }],
		CertificateRequestInfo,
		[{ name: "AcceptableCAs", key: "AcceptableCAs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, index: [0], offset: 0, exported: true }, { name: "SignatureSchemes", key: "SignatureSchemes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" } }, index: [1], offset: 24, exported: true }, { name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [2], offset: 48, exported: true }, { name: "ctx", key: "ctx", type: "context.Context", pkgPath: "crypto/tls", index: [3], offset: 56, exported: false }]
	)
}

export class Config {
	// Rand provides the source of entropy for nonces and RSA blinding.
	// If Rand is nil, TLS uses the cryptographic random reader in package
	// crypto/rand.
	// The Reader must be safe for use by multiple goroutines.
	public get Rand(): io.Reader | null {
		return this._fields.Rand.value
	}
	public set Rand(value: io.Reader | null) {
		this._fields.Rand.value = value
	}

	// Time returns the current time as the number of seconds since the epoch.
	// If Time is nil, TLS uses time.Now.
	public get Time(): (() => time2.Time | globalThis.Promise<time2.Time>) | null {
		return this._fields.Time.value
	}
	public set Time(value: (() => time2.Time | globalThis.Promise<time2.Time>) | null) {
		this._fields.Time.value = value
	}

	// Certificates contains one or more certificate chains to present to the
	// other side of the connection. The first certificate compatible with the
	// peer's requirements is selected automatically.
	//
	// Server configurations must set one of Certificates, GetCertificate or
	// GetConfigForClient. Clients doing client-authentication may set either
	// Certificates or GetClientCertificate.
	//
	// Note: if there are multiple Certificates, and they don't have the
	// optional field Leaf set, certificate selection will incur a significant
	// per-handshake performance cost.
	public get Certificates(): $.Slice<Certificate> {
		return this._fields.Certificates.value
	}
	public set Certificates(value: $.Slice<Certificate>) {
		this._fields.Certificates.value = value
	}

	// NameToCertificate maps from a certificate name to an element of
	// Certificates. Note that a certificate name can be of the form
	// '*.example.com' and so doesn't have to be a domain name as such.
	//
	// Deprecated: NameToCertificate only allows associating a single
	// certificate with a given name. Leave this field nil to let the library
	// select the first compatible chain from Certificates.
	public get NameToCertificate(): globalThis.Map<string, Certificate | $.VarRef<Certificate> | null> | null {
		return this._fields.NameToCertificate.value
	}
	public set NameToCertificate(value: globalThis.Map<string, Certificate | $.VarRef<Certificate> | null> | null) {
		this._fields.NameToCertificate.value = value
	}

	// GetCertificate returns a Certificate based on the given
	// ClientHelloInfo. It will only be called if the client supplies SNI
	// information or if Certificates is empty.
	//
	// If GetCertificate is nil or returns nil, then the certificate is
	// retrieved from NameToCertificate. If NameToCertificate is nil, the
	// best element of Certificates will be used.
	//
	// Once a Certificate is returned it should not be modified.
	public get GetCertificate(): ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null {
		return this._fields.GetCertificate.value
	}
	public set GetCertificate(value: ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null) {
		this._fields.GetCertificate.value = value
	}

	// GetClientCertificate, if not nil, is called when a server requests a
	// certificate from a client. If set, the contents of Certificates will
	// be ignored.
	//
	// If GetClientCertificate returns an error, the handshake will be
	// aborted and that error will be returned. Otherwise
	// GetClientCertificate must return a non-nil Certificate. If
	// Certificate.Certificate is empty then no certificate will be sent to
	// the server. If this is unacceptable to the server then it may abort
	// the handshake.
	//
	// GetClientCertificate may be called multiple times for the same
	// connection if renegotiation occurs or if TLS 1.3 is in use.
	//
	// Once a Certificate is returned it should not be modified.
	public get GetClientCertificate(): ((_p0: CertificateRequestInfo | $.VarRef<CertificateRequestInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null {
		return this._fields.GetClientCertificate.value
	}
	public set GetClientCertificate(value: ((_p0: CertificateRequestInfo | $.VarRef<CertificateRequestInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null) {
		this._fields.GetClientCertificate.value = value
	}

	// GetConfigForClient, if not nil, is called after a ClientHello is
	// received from a client. It may return a non-nil Config in order to
	// change the Config that will be used to handle this connection. If
	// the returned Config is nil, the original Config will be used. The
	// Config returned by this callback may not be subsequently modified.
	//
	// If GetConfigForClient is nil, the Config passed to Server() will be
	// used for all connections.
	//
	// If SessionTicketKey is explicitly set on the returned Config, or if
	// SetSessionTicketKeys is called on the returned Config, those keys will
	// be used. Otherwise, the original Config keys will be used (and possibly
	// rotated if they are automatically managed). WARNING: this allows session
	// resumtion of connections originally established with the parent (or a
	// sibling) Config, which may bypass the [Config.VerifyPeerCertificate]
	// value of the returned Config.
	public get GetConfigForClient(): ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Config | $.VarRef<Config> | null, $.GoError] | globalThis.Promise<[Config | $.VarRef<Config> | null, $.GoError]>) | null {
		return this._fields.GetConfigForClient.value
	}
	public set GetConfigForClient(value: ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Config | $.VarRef<Config> | null, $.GoError] | globalThis.Promise<[Config | $.VarRef<Config> | null, $.GoError]>) | null) {
		this._fields.GetConfigForClient.value = value
	}

	// VerifyPeerCertificate, if not nil, is called after normal
	// certificate verification by either a TLS client or server. It
	// receives the raw ASN.1 certificates provided by the peer and also
	// any verified chains that normal processing found. If it returns a
	// non-nil error, the handshake is aborted and that error results.
	//
	// If normal verification fails then the handshake will abort before
	// considering this callback. If normal verification is disabled (on the
	// client when InsecureSkipVerify is set, or on a server when ClientAuth is
	// RequestClientCert or RequireAnyClientCert), then this callback will be
	// considered but the verifiedChains argument will always be nil. When
	// ClientAuth is NoClientCert, this callback is not called on the server.
	// rawCerts may be empty on the server if ClientAuth is RequestClientCert or
	// VerifyClientCertIfGiven.
	//
	// This callback is not invoked on resumed connections. WARNING: this
	// includes connections resumed across Configs returned by [Config.Clone] or
	// [Config.GetConfigForClient] and their parents. If that is not intended,
	// use [Config.VerifyConnection] instead, or set [Config.SessionTicketsDisabled].
	//
	// verifiedChains and its contents should not be modified.
	public get VerifyPeerCertificate(): ((rawCerts: $.Slice<$.Slice<number>>, verifiedChains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.VerifyPeerCertificate.value
	}
	public set VerifyPeerCertificate(value: ((rawCerts: $.Slice<$.Slice<number>>, verifiedChains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.VerifyPeerCertificate.value = value
	}

	// VerifyConnection, if not nil, is called after normal certificate
	// verification and after VerifyPeerCertificate by either a TLS client
	// or server. If it returns a non-nil error, the handshake is aborted
	// and that error results.
	//
	// If normal verification fails then the handshake will abort before
	// considering this callback. This callback will run for all connections,
	// including resumptions, regardless of InsecureSkipVerify or ClientAuth
	// settings.
	public get VerifyConnection(): ((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.VerifyConnection.value
	}
	public set VerifyConnection(value: ((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.VerifyConnection.value = value
	}

	// RootCAs defines the set of root certificate authorities
	// that clients use when verifying server certificates.
	// If RootCAs is nil, TLS uses the host's root CA set.
	public get RootCAs(): x509.CertPool | $.VarRef<x509.CertPool> | null {
		return this._fields.RootCAs.value
	}
	public set RootCAs(value: x509.CertPool | $.VarRef<x509.CertPool> | null) {
		this._fields.RootCAs.value = value
	}

	// NextProtos is a list of supported application level protocols, in
	// order of preference. If both peers support ALPN, the selected
	// protocol will be one from this list, and the connection will fail
	// if there is no mutually supported protocol. If NextProtos is empty
	// or the peer doesn't support ALPN, the connection will succeed and
	// ConnectionState.NegotiatedProtocol will be empty.
	public get NextProtos(): $.Slice<string> {
		return this._fields.NextProtos.value
	}
	public set NextProtos(value: $.Slice<string>) {
		this._fields.NextProtos.value = value
	}

	// ServerName is used to verify the hostname on the returned
	// certificates unless InsecureSkipVerify is given. It is also included
	// in the client's handshake to support virtual hosting unless it is
	// an IP address.
	public get ServerName(): string {
		return this._fields.ServerName.value
	}
	public set ServerName(value: string) {
		this._fields.ServerName.value = value
	}

	// ClientAuth determines the server's policy for
	// TLS Client Authentication. The default is NoClientCert.
	public get ClientAuth(): ClientAuthType {
		return this._fields.ClientAuth.value
	}
	public set ClientAuth(value: ClientAuthType) {
		this._fields.ClientAuth.value = value
	}

	// ClientCAs defines the set of root certificate authorities
	// that servers use if required to verify a client certificate
	// by the policy in ClientAuth.
	public get ClientCAs(): x509.CertPool | $.VarRef<x509.CertPool> | null {
		return this._fields.ClientCAs.value
	}
	public set ClientCAs(value: x509.CertPool | $.VarRef<x509.CertPool> | null) {
		this._fields.ClientCAs.value = value
	}

	// InsecureSkipVerify controls whether a client verifies the server's
	// certificate chain and host name. If InsecureSkipVerify is true, crypto/tls
	// accepts any certificate presented by the server and any host name in that
	// certificate. In this mode, TLS is susceptible to machine-in-the-middle
	// attacks unless custom verification is used. This should be used only for
	// testing or in combination with VerifyConnection or VerifyPeerCertificate.
	public get InsecureSkipVerify(): boolean {
		return this._fields.InsecureSkipVerify.value
	}
	public set InsecureSkipVerify(value: boolean) {
		this._fields.InsecureSkipVerify.value = value
	}

	// CipherSuites is a list of enabled TLS 1.0–1.2 cipher suites. The order of
	// the list is ignored. Note that TLS 1.3 ciphersuites are not configurable.
	//
	// If CipherSuites is nil, a safe default list is used. The default cipher
	// suites might change over time. In Go 1.22 RSA key exchange based cipher
	// suites were removed from the default list, but can be re-added with the
	// GODEBUG setting tlsrsakex=1. In Go 1.23 3DES cipher suites were removed
	// from the default list, but can be re-added with the GODEBUG setting
	// tls3des=1.
	public get CipherSuites(): $.Slice<number> {
		return this._fields.CipherSuites.value
	}
	public set CipherSuites(value: $.Slice<number>) {
		this._fields.CipherSuites.value = value
	}

	// PreferServerCipherSuites is a legacy field and has no effect.
	//
	// It used to control whether the server would follow the client's or the
	// server's preference. Servers now select the best mutually supported
	// cipher suite based on logic that takes into account inferred client
	// hardware, server hardware, and security.
	//
	// Deprecated: PreferServerCipherSuites is ignored.
	public get PreferServerCipherSuites(): boolean {
		return this._fields.PreferServerCipherSuites.value
	}
	public set PreferServerCipherSuites(value: boolean) {
		this._fields.PreferServerCipherSuites.value = value
	}

	// SessionTicketsDisabled may be set to true to disable session ticket and
	// PSK (resumption) support. Note that on clients, session ticket support is
	// also disabled if ClientSessionCache is nil.
	public get SessionTicketsDisabled(): boolean {
		return this._fields.SessionTicketsDisabled.value
	}
	public set SessionTicketsDisabled(value: boolean) {
		this._fields.SessionTicketsDisabled.value = value
	}

	// SessionTicketKey is used by TLS servers to provide session resumption.
	// See RFC 5077 and the PSK mode of RFC 8446. If zero, it will be filled
	// with random data before the first server handshake.
	//
	// Deprecated: if this field is left at zero, session ticket keys will be
	// automatically rotated every day and dropped after seven days. For
	// customizing the rotation schedule or synchronizing servers that are
	// terminating connections for the same host, use SetSessionTicketKeys.
	public get SessionTicketKey(): Uint8Array {
		return this._fields.SessionTicketKey.value
	}
	public set SessionTicketKey(value: Uint8Array) {
		this._fields.SessionTicketKey.value = value
	}

	// ClientSessionCache is a cache of ClientSessionState entries for TLS
	// session resumption. It is only used by clients.
	public get ClientSessionCache(): ClientSessionCache | null {
		return this._fields.ClientSessionCache.value
	}
	public set ClientSessionCache(value: ClientSessionCache | null) {
		this._fields.ClientSessionCache.value = value
	}

	// UnwrapSession is called on the server to turn a ticket/identity
	// previously produced by [WrapSession] into a usable session.
	//
	// UnwrapSession will usually either decrypt a session state in the ticket
	// (for example with [Config.EncryptTicket]), or use the ticket as a handle
	// to recover a previously stored state. It must use [ParseSessionState] to
	// deserialize the session state.
	//
	// If UnwrapSession returns an error, the connection is terminated. If it
	// returns (nil, nil), the session is ignored. crypto/tls may still choose
	// not to resume the returned session.
	public get UnwrapSession(): ((identity: $.Slice<number>, cs: ConnectionState) => [__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError] | globalThis.Promise<[__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError]>) | null {
		return this._fields.UnwrapSession.value
	}
	public set UnwrapSession(value: ((identity: $.Slice<number>, cs: ConnectionState) => [__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError] | globalThis.Promise<[__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError]>) | null) {
		this._fields.UnwrapSession.value = value
	}

	// WrapSession is called on the server to produce a session ticket/identity.
	//
	// WrapSession must serialize the session state with [SessionState.Bytes].
	// It may then encrypt the serialized state (for example with
	// [Config.DecryptTicket]) and use it as the ticket, or store the state and
	// return a handle for it.
	//
	// If WrapSession returns an error, the connection is terminated.
	//
	// Warning: the return value will be exposed on the wire and to clients in
	// plaintext. The application is in charge of encrypting and authenticating
	// it (and rotating keys) or returning high-entropy identifiers. Failing to
	// do so correctly can compromise current, previous, and future connections
	// depending on the protocol version.
	public get WrapSession(): ((_p0: ConnectionState, _p1: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null {
		return this._fields.WrapSession.value
	}
	public set WrapSession(value: ((_p0: ConnectionState, _p1: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null) {
		this._fields.WrapSession.value = value
	}

	// MinVersion contains the minimum TLS version that is acceptable.
	//
	// By default, TLS 1.2 is currently used as the minimum. TLS 1.0 is the
	// minimum supported by this package.
	//
	// The server-side default can be reverted to TLS 1.0 by including the value
	// "tls10server=1" in the GODEBUG environment variable.
	public get MinVersion(): number {
		return this._fields.MinVersion.value
	}
	public set MinVersion(value: number) {
		this._fields.MinVersion.value = value
	}

	// MaxVersion contains the maximum TLS version that is acceptable.
	//
	// By default, the maximum version supported by this package is used,
	// which is currently TLS 1.3.
	public get MaxVersion(): number {
		return this._fields.MaxVersion.value
	}
	public set MaxVersion(value: number) {
		this._fields.MaxVersion.value = value
	}

	// CurvePreferences contains a set of supported key exchange mechanisms.
	// The name refers to elliptic curves for legacy reasons, see [CurveID].
	// The order of the list is ignored, and key exchange mechanisms are chosen
	// from this list using an internal preference order. If empty, the default
	// will be used.
	//
	// From Go 1.24, the default includes the [X25519MLKEM768] hybrid
	// post-quantum key exchange. To disable it, set CurvePreferences explicitly
	// or use the GODEBUG=tlsmlkem=0 environment variable.
	//
	// From Go 1.26, the default includes the [SecP256r1MLKEM768] and
	// [SecP256r1MLKEM768] hybrid post-quantum key exchanges, too. To disable
	// them, set CurvePreferences explicitly or use either the
	// GODEBUG=tlsmlkem=0 or the GODEBUG=tlssecpmlkem=0 environment variable.
	public get CurvePreferences(): $.Slice<CurveID> {
		return this._fields.CurvePreferences.value
	}
	public set CurvePreferences(value: $.Slice<CurveID>) {
		this._fields.CurvePreferences.value = value
	}

	// DynamicRecordSizingDisabled disables adaptive sizing of TLS records.
	// When true, the largest possible TLS record size is always used. When
	// false, the size of TLS records may be adjusted in an attempt to
	// improve latency.
	public get DynamicRecordSizingDisabled(): boolean {
		return this._fields.DynamicRecordSizingDisabled.value
	}
	public set DynamicRecordSizingDisabled(value: boolean) {
		this._fields.DynamicRecordSizingDisabled.value = value
	}

	// Renegotiation controls what types of renegotiation are supported.
	// The default, none, is correct for the vast majority of applications.
	public get Renegotiation(): RenegotiationSupport {
		return this._fields.Renegotiation.value
	}
	public set Renegotiation(value: RenegotiationSupport) {
		this._fields.Renegotiation.value = value
	}

	// KeyLogWriter optionally specifies a destination for TLS master secrets
	// in NSS key log format that can be used to allow external programs
	// such as Wireshark to decrypt TLS connections.
	// See https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/Key_Log_Format.
	// Use of KeyLogWriter compromises security and should only be
	// used for debugging.
	public get KeyLogWriter(): io.Writer | null {
		return this._fields.KeyLogWriter.value
	}
	public set KeyLogWriter(value: io.Writer | null) {
		this._fields.KeyLogWriter.value = value
	}

	// EncryptedClientHelloConfigList is a serialized ECHConfigList. If
	// provided, clients will attempt to connect to servers using Encrypted
	// Client Hello (ECH) using one of the provided ECHConfigs.
	//
	// Servers do not use this field. In order to configure ECH for servers, see
	// the EncryptedClientHelloKeys field.
	//
	// If the list contains no valid ECH configs, the handshake will fail
	// and return an error.
	//
	// If EncryptedClientHelloConfigList is set, MinVersion, if set, must
	// be VersionTLS13.
	//
	// When EncryptedClientHelloConfigList is set, the handshake will only
	// succeed if ECH is successfully negotiated. If the server rejects ECH,
	// an ECHRejectionError error will be returned, which may contain a new
	// ECHConfigList that the server suggests using.
	//
	// How this field is parsed may change in future Go versions, if the
	// encoding described in the final Encrypted Client Hello RFC changes.
	public get EncryptedClientHelloConfigList(): $.Slice<number> {
		return this._fields.EncryptedClientHelloConfigList.value
	}
	public set EncryptedClientHelloConfigList(value: $.Slice<number>) {
		this._fields.EncryptedClientHelloConfigList.value = value
	}

	// EncryptedClientHelloRejectionVerify, if not nil, is called when ECH is
	// rejected by the remote server, in order to verify the ECH provider
	// certificate in the outer ClientHello. If it returns a non-nil error, the
	// handshake is aborted and that error results.
	//
	// On the server side this field is not used.
	//
	// Unlike VerifyPeerCertificate and VerifyConnection, normal certificate
	// verification will not be performed before calling
	// EncryptedClientHelloRejectionVerify.
	//
	// If EncryptedClientHelloRejectionVerify is nil and ECH is rejected, the
	// roots in RootCAs will be used to verify the ECH providers public
	// certificate. VerifyPeerCertificate and VerifyConnection are not called
	// when ECH is rejected, even if set, and InsecureSkipVerify is ignored.
	public get EncryptedClientHelloRejectionVerify(): ((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.EncryptedClientHelloRejectionVerify.value
	}
	public set EncryptedClientHelloRejectionVerify(value: ((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.EncryptedClientHelloRejectionVerify.value = value
	}

	// GetEncryptedClientHelloKeys, if not nil, is called when by a server when
	// a client attempts ECH.
	//
	// If GetEncryptedClientHelloKeys is not nil, [EncryptedClientHelloKeys] is
	// ignored.
	//
	// If GetEncryptedClientHelloKeys returns an error, the handshake will be
	// aborted and the error will be returned. Otherwise,
	// GetEncryptedClientHelloKeys must return a non-nil slice of
	// [EncryptedClientHelloKey] that represents the acceptable ECH keys.
	//
	// For further details, see [EncryptedClientHelloKeys].
	public get GetEncryptedClientHelloKeys(): ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [$.Slice<EncryptedClientHelloKey>, $.GoError] | globalThis.Promise<[$.Slice<EncryptedClientHelloKey>, $.GoError]>) | null {
		return this._fields.GetEncryptedClientHelloKeys.value
	}
	public set GetEncryptedClientHelloKeys(value: ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [$.Slice<EncryptedClientHelloKey>, $.GoError] | globalThis.Promise<[$.Slice<EncryptedClientHelloKey>, $.GoError]>) | null) {
		this._fields.GetEncryptedClientHelloKeys.value = value
	}

	// EncryptedClientHelloKeys are the ECH keys to use when a client
	// attempts ECH.
	//
	// If EncryptedClientHelloKeys is set, MinVersion, if set, must be
	// VersionTLS13.
	//
	// If a client attempts ECH, but it is rejected by the server, the server
	// will send a list of configs to retry based on the set of
	// EncryptedClientHelloKeys which have the SendAsRetry field set.
	//
	// If GetEncryptedClientHelloKeys is non-nil, EncryptedClientHelloKeys is
	// ignored.
	//
	// On the client side, this field is ignored. In order to configure ECH for
	// clients, see the EncryptedClientHelloConfigList field.
	public get EncryptedClientHelloKeys(): $.Slice<EncryptedClientHelloKey> {
		return this._fields.EncryptedClientHelloKeys.value
	}
	public set EncryptedClientHelloKeys(value: $.Slice<EncryptedClientHelloKey>) {
		this._fields.EncryptedClientHelloKeys.value = value
	}

	// mutex protects sessionTicketKeys and autoSessionTicketKeys.
	public get mutex(): sync.RWMutex {
		return this._fields.mutex.value
	}
	public set mutex(value: sync.RWMutex) {
		this._fields.mutex.value = value
	}

	// sessionTicketKeys contains zero or more ticket keys. If set, it means
	// the keys were set with SessionTicketKey or SetSessionTicketKeys. The
	// first key is used for new tickets and any subsequent keys can be used to
	// decrypt old tickets. The slice contents are not protected by the mutex
	// and are immutable.
	public get sessionTicketKeys(): $.Slice<ticketKey> {
		return this._fields.sessionTicketKeys.value
	}
	public set sessionTicketKeys(value: $.Slice<ticketKey>) {
		this._fields.sessionTicketKeys.value = value
	}

	// autoSessionTicketKeys is like sessionTicketKeys but is owned by the
	// auto-rotation logic. See Config.ticketKeys.
	public get autoSessionTicketKeys(): $.Slice<ticketKey> {
		return this._fields.autoSessionTicketKeys.value
	}
	public set autoSessionTicketKeys(value: $.Slice<ticketKey>) {
		this._fields.autoSessionTicketKeys.value = value
	}

	public _fields: {
		Rand: $.VarRef<io.Reader | null>
		Time: $.VarRef<(() => time2.Time | globalThis.Promise<time2.Time>) | null>
		Certificates: $.VarRef<$.Slice<Certificate>>
		NameToCertificate: $.VarRef<globalThis.Map<string, Certificate | $.VarRef<Certificate> | null> | null>
		GetCertificate: $.VarRef<((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null>
		GetClientCertificate: $.VarRef<((_p0: CertificateRequestInfo | $.VarRef<CertificateRequestInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null>
		GetConfigForClient: $.VarRef<((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Config | $.VarRef<Config> | null, $.GoError] | globalThis.Promise<[Config | $.VarRef<Config> | null, $.GoError]>) | null>
		VerifyPeerCertificate: $.VarRef<((rawCerts: $.Slice<$.Slice<number>>, verifiedChains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>) => $.GoError | globalThis.Promise<$.GoError>) | null>
		VerifyConnection: $.VarRef<((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null>
		RootCAs: $.VarRef<x509.CertPool | $.VarRef<x509.CertPool> | null>
		NextProtos: $.VarRef<$.Slice<string>>
		ServerName: $.VarRef<string>
		ClientAuth: $.VarRef<ClientAuthType>
		ClientCAs: $.VarRef<x509.CertPool | $.VarRef<x509.CertPool> | null>
		InsecureSkipVerify: $.VarRef<boolean>
		CipherSuites: $.VarRef<$.Slice<number>>
		PreferServerCipherSuites: $.VarRef<boolean>
		SessionTicketsDisabled: $.VarRef<boolean>
		SessionTicketKey: $.VarRef<Uint8Array>
		ClientSessionCache: $.VarRef<ClientSessionCache | null>
		UnwrapSession: $.VarRef<((identity: $.Slice<number>, cs: ConnectionState) => [__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError] | globalThis.Promise<[__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError]>) | null>
		WrapSession: $.VarRef<((_p0: ConnectionState, _p1: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null>
		MinVersion: $.VarRef<number>
		MaxVersion: $.VarRef<number>
		CurvePreferences: $.VarRef<$.Slice<CurveID>>
		DynamicRecordSizingDisabled: $.VarRef<boolean>
		Renegotiation: $.VarRef<RenegotiationSupport>
		KeyLogWriter: $.VarRef<io.Writer | null>
		EncryptedClientHelloConfigList: $.VarRef<$.Slice<number>>
		EncryptedClientHelloRejectionVerify: $.VarRef<((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null>
		GetEncryptedClientHelloKeys: $.VarRef<((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [$.Slice<EncryptedClientHelloKey>, $.GoError] | globalThis.Promise<[$.Slice<EncryptedClientHelloKey>, $.GoError]>) | null>
		EncryptedClientHelloKeys: $.VarRef<$.Slice<EncryptedClientHelloKey>>
		mutex: $.VarRef<sync.RWMutex>
		sessionTicketKeys: $.VarRef<$.Slice<ticketKey>>
		autoSessionTicketKeys: $.VarRef<$.Slice<ticketKey>>
	}

	constructor(init?: Partial<{Rand?: io.Reader | null, Time?: (() => time2.Time | globalThis.Promise<time2.Time>) | null, Certificates?: $.Slice<Certificate>, NameToCertificate?: globalThis.Map<string, Certificate | $.VarRef<Certificate> | null> | null, GetCertificate?: ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null, GetClientCertificate?: ((_p0: CertificateRequestInfo | $.VarRef<CertificateRequestInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null, GetConfigForClient?: ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Config | $.VarRef<Config> | null, $.GoError] | globalThis.Promise<[Config | $.VarRef<Config> | null, $.GoError]>) | null, VerifyPeerCertificate?: ((rawCerts: $.Slice<$.Slice<number>>, verifiedChains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>) => $.GoError | globalThis.Promise<$.GoError>) | null, VerifyConnection?: ((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null, RootCAs?: x509.CertPool | $.VarRef<x509.CertPool> | null, NextProtos?: $.Slice<string>, ServerName?: string, ClientAuth?: ClientAuthType, ClientCAs?: x509.CertPool | $.VarRef<x509.CertPool> | null, InsecureSkipVerify?: boolean, CipherSuites?: $.Slice<number>, PreferServerCipherSuites?: boolean, SessionTicketsDisabled?: boolean, SessionTicketKey?: Uint8Array, ClientSessionCache?: ClientSessionCache | null, UnwrapSession?: ((identity: $.Slice<number>, cs: ConnectionState) => [__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError] | globalThis.Promise<[__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError]>) | null, WrapSession?: ((_p0: ConnectionState, _p1: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null, MinVersion?: number, MaxVersion?: number, CurvePreferences?: $.Slice<CurveID>, DynamicRecordSizingDisabled?: boolean, Renegotiation?: RenegotiationSupport, KeyLogWriter?: io.Writer | null, EncryptedClientHelloConfigList?: $.Slice<number>, EncryptedClientHelloRejectionVerify?: ((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null, GetEncryptedClientHelloKeys?: ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [$.Slice<EncryptedClientHelloKey>, $.GoError] | globalThis.Promise<[$.Slice<EncryptedClientHelloKey>, $.GoError]>) | null, EncryptedClientHelloKeys?: $.Slice<EncryptedClientHelloKey>, mutex?: sync.RWMutex, sessionTicketKeys?: $.Slice<ticketKey>, autoSessionTicketKeys?: $.Slice<ticketKey>}>) {
		this._fields = {
			Rand: $.varRef(init?.Rand ?? (null as io.Reader | null)),
			Time: $.varRef(init?.Time ?? (null as (() => time2.Time | globalThis.Promise<time2.Time>) | null)),
			Certificates: $.varRef(init?.Certificates ?? (null as $.Slice<Certificate>)),
			NameToCertificate: $.varRef(init?.NameToCertificate ?? (null as globalThis.Map<string, Certificate | $.VarRef<Certificate> | null> | null)),
			GetCertificate: $.varRef(init?.GetCertificate ?? (null as ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null)),
			GetClientCertificate: $.varRef(init?.GetClientCertificate ?? (null as ((_p0: CertificateRequestInfo | $.VarRef<CertificateRequestInfo> | null) => [Certificate | $.VarRef<Certificate> | null, $.GoError] | globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]>) | null)),
			GetConfigForClient: $.varRef(init?.GetConfigForClient ?? (null as ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [Config | $.VarRef<Config> | null, $.GoError] | globalThis.Promise<[Config | $.VarRef<Config> | null, $.GoError]>) | null)),
			VerifyPeerCertificate: $.varRef(init?.VerifyPeerCertificate ?? (null as ((rawCerts: $.Slice<$.Slice<number>>, verifiedChains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>) => $.GoError | globalThis.Promise<$.GoError>) | null)),
			VerifyConnection: $.varRef(init?.VerifyConnection ?? (null as ((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null)),
			RootCAs: $.varRef(init?.RootCAs ?? (null as x509.CertPool | $.VarRef<x509.CertPool> | null)),
			NextProtos: $.varRef(init?.NextProtos ?? (null as $.Slice<string>)),
			ServerName: $.varRef(init?.ServerName ?? ("" as string)),
			ClientAuth: $.varRef(init?.ClientAuth ?? (0 as ClientAuthType)),
			ClientCAs: $.varRef(init?.ClientCAs ?? (null as x509.CertPool | $.VarRef<x509.CertPool> | null)),
			InsecureSkipVerify: $.varRef(init?.InsecureSkipVerify ?? (false as boolean)),
			CipherSuites: $.varRef(init?.CipherSuites ?? (null as $.Slice<number>)),
			PreferServerCipherSuites: $.varRef(init?.PreferServerCipherSuites ?? (false as boolean)),
			SessionTicketsDisabled: $.varRef(init?.SessionTicketsDisabled ?? (false as boolean)),
			SessionTicketKey: $.varRef(init?.SessionTicketKey !== undefined ? $.cloneArrayValue(init.SessionTicketKey) : new Uint8Array(32)),
			ClientSessionCache: $.varRef(init?.ClientSessionCache ?? (null as ClientSessionCache | null)),
			UnwrapSession: $.varRef(init?.UnwrapSession ?? (null as ((identity: $.Slice<number>, cs: ConnectionState) => [__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError] | globalThis.Promise<[__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError]>) | null)),
			WrapSession: $.varRef(init?.WrapSession ?? (null as ((_p0: ConnectionState, _p1: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null)),
			MinVersion: $.varRef(init?.MinVersion ?? (0 as number)),
			MaxVersion: $.varRef(init?.MaxVersion ?? (0 as number)),
			CurvePreferences: $.varRef(init?.CurvePreferences ?? (null as $.Slice<CurveID>)),
			DynamicRecordSizingDisabled: $.varRef(init?.DynamicRecordSizingDisabled ?? (false as boolean)),
			Renegotiation: $.varRef(init?.Renegotiation ?? (0 as RenegotiationSupport)),
			KeyLogWriter: $.varRef(init?.KeyLogWriter ?? (null as io.Writer | null)),
			EncryptedClientHelloConfigList: $.varRef(init?.EncryptedClientHelloConfigList ?? (null as $.Slice<number>)),
			EncryptedClientHelloRejectionVerify: $.varRef(init?.EncryptedClientHelloRejectionVerify ?? (null as ((_p0: ConnectionState) => $.GoError | globalThis.Promise<$.GoError>) | null)),
			GetEncryptedClientHelloKeys: $.varRef(init?.GetEncryptedClientHelloKeys ?? (null as ((_p0: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null) => [$.Slice<EncryptedClientHelloKey>, $.GoError] | globalThis.Promise<[$.Slice<EncryptedClientHelloKey>, $.GoError]>) | null)),
			EncryptedClientHelloKeys: $.varRef(init?.EncryptedClientHelloKeys ?? (null as $.Slice<EncryptedClientHelloKey>)),
			mutex: $.varRef(init?.mutex ? $.markAsStructValue($.cloneStructValue(init.mutex)) : $.markAsStructValue(new sync.RWMutex())),
			sessionTicketKeys: $.varRef(init?.sessionTicketKeys ?? (null as $.Slice<ticketKey>)),
			autoSessionTicketKeys: $.varRef(init?.autoSessionTicketKeys ?? (null as $.Slice<ticketKey>))
		}
	}

	public clone(): Config {
		const cloned = new Config()
		cloned._fields = {
			Rand: $.varRef(this._fields.Rand.value),
			Time: $.varRef(this._fields.Time.value),
			Certificates: $.varRef(this._fields.Certificates.value),
			NameToCertificate: $.varRef(this._fields.NameToCertificate.value),
			GetCertificate: $.varRef(this._fields.GetCertificate.value),
			GetClientCertificate: $.varRef(this._fields.GetClientCertificate.value),
			GetConfigForClient: $.varRef(this._fields.GetConfigForClient.value),
			VerifyPeerCertificate: $.varRef(this._fields.VerifyPeerCertificate.value),
			VerifyConnection: $.varRef(this._fields.VerifyConnection.value),
			RootCAs: $.varRef(this._fields.RootCAs.value),
			NextProtos: $.varRef(this._fields.NextProtos.value),
			ServerName: $.varRef(this._fields.ServerName.value),
			ClientAuth: $.varRef(this._fields.ClientAuth.value),
			ClientCAs: $.varRef(this._fields.ClientCAs.value),
			InsecureSkipVerify: $.varRef(this._fields.InsecureSkipVerify.value),
			CipherSuites: $.varRef(this._fields.CipherSuites.value),
			PreferServerCipherSuites: $.varRef(this._fields.PreferServerCipherSuites.value),
			SessionTicketsDisabled: $.varRef(this._fields.SessionTicketsDisabled.value),
			SessionTicketKey: $.varRef($.cloneArrayValue(this._fields.SessionTicketKey.value)),
			ClientSessionCache: $.varRef(this._fields.ClientSessionCache.value),
			UnwrapSession: $.varRef(this._fields.UnwrapSession.value),
			WrapSession: $.varRef(this._fields.WrapSession.value),
			MinVersion: $.varRef(this._fields.MinVersion.value),
			MaxVersion: $.varRef(this._fields.MaxVersion.value),
			CurvePreferences: $.varRef(this._fields.CurvePreferences.value),
			DynamicRecordSizingDisabled: $.varRef(this._fields.DynamicRecordSizingDisabled.value),
			Renegotiation: $.varRef(this._fields.Renegotiation.value),
			KeyLogWriter: $.varRef(this._fields.KeyLogWriter.value),
			EncryptedClientHelloConfigList: $.varRef(this._fields.EncryptedClientHelloConfigList.value),
			EncryptedClientHelloRejectionVerify: $.varRef(this._fields.EncryptedClientHelloRejectionVerify.value),
			GetEncryptedClientHelloKeys: $.varRef(this._fields.GetEncryptedClientHelloKeys.value),
			EncryptedClientHelloKeys: $.varRef(this._fields.EncryptedClientHelloKeys.value),
			mutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mutex.value))),
			sessionTicketKeys: $.varRef(this._fields.sessionTicketKeys.value),
			autoSessionTicketKeys: $.varRef(this._fields.autoSessionTicketKeys.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async BuildNameToCertificate(): globalThis.Promise<void> {
		let c: Config | $.VarRef<Config> | null = this
		$.pointerValue<Config>(c).NameToCertificate = $.makeMap<string, Certificate | $.VarRef<Certificate> | null>()
		for (let __goscriptRangeTarget4 = $.pointerValue<Config>(c).Certificates, i = 0; i < $.len(__goscriptRangeTarget4); i++) {
			let cert: Certificate | $.VarRef<Certificate> | null = $.indexRef($.pointerValue<Config>(c).Certificates!, i)
			let __goscriptTuple3: any = await Certificate.prototype.leaf.call(cert)
			let x509Cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple3[0]
			let err = __goscriptTuple3[1]
			if (err != null) {
				continue
			}
			// If SANs are *not* present, some clients will consider the certificate
			// valid for the name in the Common Name.
			if ((!$.stringEqual($.pointerValue<x509.Certificate>(x509Cert).Subject.CommonName, "")) && ($.len($.pointerValue<x509.Certificate>(x509Cert).DNSNames) == 0)) {
				$.mapSet($.pointerValue<Config>(c).NameToCertificate, $.pointerValue<x509.Certificate>(x509Cert).Subject.CommonName, cert)
			}
			for (let __goscriptRangeTarget3 = $.pointerValue<x509.Certificate>(x509Cert).DNSNames, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
				let san = __goscriptRangeTarget3![__rangeIndex]
				$.mapSet($.pointerValue<Config>(c).NameToCertificate, san, cert)
			}
		}
	}

	public async Clone(): globalThis.Promise<Config | $.VarRef<Config> | null> {
		const c: Config | $.VarRef<Config> | null = this
		using __defer = new $.DisposableStack()
		if (c == null) {
			return null
		}
		await $.pointerValue<Config>(c).mutex.RLock()
		__defer.defer(() => { $.pointerValue<Config>(c).mutex.RUnlock() })
		return new Config({Rand: $.pointerValue<Config>(c).Rand, Time: $.pointerValue<Config>(c).Time, Certificates: $.pointerValue<Config>(c).Certificates, NameToCertificate: $.pointerValue<Config>(c).NameToCertificate, GetCertificate: $.pointerValue<Config>(c).GetCertificate, GetClientCertificate: $.pointerValue<Config>(c).GetClientCertificate, GetConfigForClient: $.pointerValue<Config>(c).GetConfigForClient, GetEncryptedClientHelloKeys: $.pointerValue<Config>(c).GetEncryptedClientHelloKeys, VerifyPeerCertificate: $.pointerValue<Config>(c).VerifyPeerCertificate, VerifyConnection: $.pointerValue<Config>(c).VerifyConnection, RootCAs: $.pointerValue<Config>(c).RootCAs, NextProtos: $.pointerValue<Config>(c).NextProtos, ServerName: $.pointerValue<Config>(c).ServerName, ClientAuth: $.pointerValue<Config>(c).ClientAuth, ClientCAs: $.pointerValue<Config>(c).ClientCAs, InsecureSkipVerify: $.pointerValue<Config>(c).InsecureSkipVerify, CipherSuites: $.pointerValue<Config>(c).CipherSuites, PreferServerCipherSuites: $.pointerValue<Config>(c).PreferServerCipherSuites, SessionTicketsDisabled: $.pointerValue<Config>(c).SessionTicketsDisabled, SessionTicketKey: $.pointerValue<Config>(c).SessionTicketKey, ClientSessionCache: $.pointerValue<Config>(c).ClientSessionCache, UnwrapSession: $.pointerValue<Config>(c).UnwrapSession, WrapSession: $.pointerValue<Config>(c).WrapSession, MinVersion: $.uint($.pointerValue<Config>(c).MinVersion, 16), MaxVersion: $.uint($.pointerValue<Config>(c).MaxVersion, 16), CurvePreferences: $.pointerValue<Config>(c).CurvePreferences, DynamicRecordSizingDisabled: $.pointerValue<Config>(c).DynamicRecordSizingDisabled, Renegotiation: $.pointerValue<Config>(c).Renegotiation, KeyLogWriter: $.pointerValue<Config>(c).KeyLogWriter, EncryptedClientHelloConfigList: $.pointerValue<Config>(c).EncryptedClientHelloConfigList, EncryptedClientHelloRejectionVerify: $.pointerValue<Config>(c).EncryptedClientHelloRejectionVerify, EncryptedClientHelloKeys: $.pointerValue<Config>(c).EncryptedClientHelloKeys, sessionTicketKeys: $.pointerValue<Config>(c).sessionTicketKeys, autoSessionTicketKeys: $.pointerValue<Config>(c).autoSessionTicketKeys})
	}

	public async DecryptTicket(identity: $.Slice<number>, cs: ConnectionState): globalThis.Promise<[__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, $.GoError]> {
		const c: Config | $.VarRef<Config> | null = this
		let ticketKeys: $.Slice<ticketKey> = await Config.prototype.ticketKeys.call(c, null)
		let stateBytes: $.Slice<number> = await Config.prototype.decryptTicket.call(c, identity, ticketKeys)
		if (stateBytes == null) {
			return [null, null]
		}
		let __goscriptTuple4: any = await __goscript_ticket.ParseSessionState(stateBytes)
		let s: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = __goscriptTuple4[0]
		let err = __goscriptTuple4[1]
		if (err != null) {
			return [null, null]
		}
		return [s, null]
	}

	public async EncryptTicket(cs: ConnectionState, ss: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const c: Config | $.VarRef<Config> | null = this
		let ticketKeys: $.Slice<ticketKey> = await Config.prototype.ticketKeys.call(c, null)
		let __goscriptTuple5: any = await __goscript_ticket.SessionState.prototype.Bytes.call(ss)
		let stateBytes: $.Slice<number> = __goscriptTuple5[0]
		let err = __goscriptTuple5[1]
		if (err != null) {
			return [null, err]
		}
		return Config.prototype.encryptTicket.call(c, stateBytes, ticketKeys)
	}

	public async SetSessionTicketKeys(keys: $.Slice<Uint8Array>): globalThis.Promise<void> {
		let c: Config | $.VarRef<Config> | null = this
		if ($.len(keys) == 0) {
			$.panic("tls: keys must have at least one key")
		}

		let newKeys: $.Slice<ticketKey> = $.makeSlice<ticketKey>($.len(keys), undefined, undefined, () => $.markAsStructValue(new ticketKey()))
		for (let __goscriptRangeTarget5 = keys, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
			let bytes = __goscriptRangeTarget5![i]
			newKeys![i] = $.markAsStructValue($.cloneStructValue(await Config.prototype.ticketKeyFromBytes.call(c, bytes)))
		}

		await $.pointerValue<Config>(c).mutex.Lock()
		$.pointerValue<Config>(c).sessionTicketKeys = newKeys
		$.pointerValue<Config>(c).mutex.Unlock()
	}

	public cipherSuites(aesGCMPreferred: boolean): $.Slice<number> {
		const c: Config | $.VarRef<Config> | null = this
		let cipherSuites: $.Slice<number> = null as $.Slice<number>
		if ($.pointerValue<Config>(c).CipherSuites == null) {
			cipherSuites = __goscript_defaults.defaultCipherSuites(aesGCMPreferred)
		} else {
			cipherSuites = __goscript_defaults.supportedCipherSuites(aesGCMPreferred)
			cipherSuites = (slices.DeleteFunc(cipherSuites, $.functionValue((id: number): boolean => {
				return !slices.Contains($.pointerValue<Config>(c).CipherSuites, $.uint(id, 16))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<number>)
		}
		if (fips140tls.Required()) {
			cipherSuites = (slices.DeleteFunc(cipherSuites, $.functionValue((id: number): boolean => {
				return !slices.Contains(__goscript_defaults_fips140.__goscript_get_allowedCipherSuitesFIPS(), $.uint(id, 16))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<number>)
		}
		return cipherSuites
	}

	public curvePreferences(version: number): $.Slice<CurveID> {
		const c: Config | $.VarRef<Config> | null = this
		let curvePreferences: $.Slice<CurveID> = __goscript_defaults.defaultCurvePreferences()
		if (fips140tls.Required()) {
			curvePreferences = (slices.DeleteFunc(curvePreferences, $.functionValue((x: CurveID): boolean => {
				return !slices.Contains(__goscript_defaults_fips140.__goscript_get_allowedCurvePreferencesFIPS(), $.uint(x, 16))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<CurveID>)
		}
		if ((c != null) && ($.len($.pointerValue<Config>(c).CurvePreferences) != 0)) {
			curvePreferences = (slices.DeleteFunc(curvePreferences, $.functionValue((x: CurveID): boolean => {
				return !slices.Contains($.pointerValue<Config>(c).CurvePreferences, $.uint(x, 16))
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<CurveID>)
		}
		if ($.uint(version, 16) < $.uint(772, 16)) {
			curvePreferences = (slices.DeleteFunc(curvePreferences, isTLS13OnlyKeyExchange) as $.Slice<CurveID>)
		}
		return curvePreferences
	}

	public async decryptTicket(encrypted: $.Slice<number>, ticketKeys: $.Slice<ticketKey>): globalThis.Promise<$.Slice<number>> {
		const c: Config | $.VarRef<Config> | null = this
		if ($.len(encrypted) < (aes.BlockSize + sha256.Size)) {
			return null
		}

		let iv: $.Slice<number> = $.goSlice(encrypted, undefined, aes.BlockSize)
		let ciphertext: $.Slice<number> = $.goSlice(encrypted, aes.BlockSize, $.len(encrypted) - sha256.Size)
		let authenticated: $.Slice<number> = $.goSlice(encrypted, undefined, $.len(encrypted) - sha256.Size)
		let macBytes: $.Slice<number> = $.goSlice(encrypted, $.len(encrypted) - sha256.Size, undefined)

		for (let __goscriptRangeTarget6 = ticketKeys, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
			let key = __goscriptRangeTarget6![__rangeIndex]
			let mac = await hmac.New(sha256.New, $.goSlice(key.hmacKey, undefined, undefined))
			await $.pointerValue<Exclude<hash.Hash, null>>(mac).Write(authenticated)
			let expected: $.Slice<number> = await $.pointerValue<Exclude<hash.Hash, null>>(mac).Sum(null)

			if (subtle.ConstantTimeCompare(macBytes, expected) != 1) {
				continue
			}

			let [block, err] = aes.NewCipher($.goSlice(key.aesKey, undefined, undefined))
			if (err != null) {
				return null
			}
			let plaintext: $.Slice<number> = $.makeSlice<number>($.len(ciphertext), undefined, "byte")
			await $.pointerValue<Exclude<cipher.Stream, null>>(cipher.NewCTR($.pointerValueOrNil(block)!, iv)).XORKeyStream(plaintext, ciphertext)

			return plaintext
		}

		return null
	}

	public async encryptTicket(state: $.Slice<number>, ticketKeys: $.Slice<ticketKey>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const c: Config | $.VarRef<Config> | null = this
		if ($.len(ticketKeys) == 0) {
			return [null, errors.New("tls: internal error: session ticket keys unavailable")]
		}

		let encrypted: $.Slice<number> = $.makeSlice<number>((aes.BlockSize + $.len(state)) + sha256.Size, undefined, "byte")
		let iv: $.Slice<number> = $.goSlice(encrypted, undefined, aes.BlockSize)
		let ciphertext: $.Slice<number> = $.goSlice(encrypted, aes.BlockSize, $.len(encrypted) - sha256.Size)
		let authenticated: $.Slice<number> = $.goSlice(encrypted, undefined, $.len(encrypted) - sha256.Size)
		let macBytes: $.Slice<number> = $.goSlice(encrypted, $.len(encrypted) - sha256.Size, undefined)

		{
			let [, err] = await io.ReadFull($.pointerValueOrNil(Config.prototype.rand.call(c))!, iv)
			if (err != null) {
				return [null, err]
			}
		}
		let key = $.markAsStructValue($.cloneStructValue($.arrayIndex(ticketKeys!, 0)))
		let [block, err] = aes.NewCipher($.goSlice(key.aesKey, undefined, undefined))
		if (err != null) {
			return [null, errors.New("tls: failed to create cipher while encrypting ticket: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
		}
		await $.pointerValue<Exclude<cipher.Stream, null>>(cipher.NewCTR($.pointerValueOrNil(block)!, iv)).XORKeyStream(ciphertext, state)

		let mac = await hmac.New(sha256.New, $.goSlice(key.hmacKey, undefined, undefined))
		await $.pointerValue<Exclude<hash.Hash, null>>(mac).Write(authenticated)
		await $.pointerValue<Exclude<hash.Hash, null>>(mac).Sum($.goSlice(macBytes, undefined, 0))

		return [encrypted, null]
	}

	public async getCertificate(clientHello: ClientHelloInfo | $.VarRef<ClientHelloInfo> | null): globalThis.Promise<[Certificate | $.VarRef<Certificate> | null, $.GoError]> {
		const c: Config | $.VarRef<Config> | null = this
		if (($.pointerValue<Config>(c).GetCertificate != null) && (($.len($.pointerValue<Config>(c).Certificates) == 0) || ($.len($.pointerValue<ClientHelloInfo>(clientHello).ServerName) > 0))) {
			let __goscriptTuple6: any = await $.pointerValue<Config>(c).GetCertificate!(clientHello)
			let cert: Certificate | $.VarRef<Certificate> | null = __goscriptTuple6[0]
			let err = __goscriptTuple6[1]
			if ((cert != null) || (err != null)) {
				return [cert, err]
			}
		}

		if ($.len($.pointerValue<Config>(c).Certificates) == 0) {
			return [null, errNoCertificates]
		}

		if ($.len($.pointerValue<Config>(c).Certificates) == 1) {
			// There's only one choice, so no point doing any work.
			return [$.indexRef($.pointerValue<Config>(c).Certificates!, 0), null]
		}

		if ($.pointerValue<Config>(c).NameToCertificate != null) {
			let name = strings.ToLower($.pointerValue<ClientHelloInfo>(clientHello).ServerName)
			{
				let __goscriptTuple7: any = $.mapGet<string, Certificate | $.VarRef<Certificate> | null, Certificate | $.VarRef<Certificate> | null>($.pointerValue<Config>(c).NameToCertificate, name, null)
				let cert: Certificate | $.VarRef<Certificate> | null = __goscriptTuple7[0]
				let ok = __goscriptTuple7[1]
				if (ok) {
					return [cert, null]
				}
			}
			if ($.len(name) > 0) {
				let labels: $.Slice<string> = strings.Split(name, ".")
				labels![0] = "*"
				let wildcardName = strings.Join(labels, ".")
				{
					let __goscriptTuple8: any = $.mapGet<string, Certificate | $.VarRef<Certificate> | null, Certificate | $.VarRef<Certificate> | null>($.pointerValue<Config>(c).NameToCertificate, wildcardName, null)
					let cert: Certificate | $.VarRef<Certificate> | null = __goscriptTuple8[0]
					let ok = __goscriptTuple8[1]
					if (ok) {
						return [cert, null]
					}
				}
			}
		}

		for (let __goscriptRangeTarget7 = $.pointerValue<Config>(c).Certificates, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget7); __rangeIndex++) {
			let cert = $.varRef(__goscriptRangeTarget7![__rangeIndex])
			{
				let err = await ClientHelloInfo.prototype.SupportsCertificate.call(clientHello, cert)
				if (err == null) {
					return [cert, null]
				}
			}
		}

		// If nothing matches, return the first certificate.
		return [$.indexRef($.pointerValue<Config>(c).Certificates!, 0), null]
	}

	public async initLegacySessionTicketKeyRLocked(): globalThis.Promise<void> {
		let c: Config | $.VarRef<Config> | null = this
		await using __defer = new $.AsyncDisposableStack()
		// Don't write if SessionTicketKey is already defined as our deprecated string,
		// or if it is defined by the user but sessionTicketKeys is already set.
		if ((!$.arrayEqual($.pointerValue<Config>(c).SessionTicketKey, new Uint8Array(32))) && (bytes2.HasPrefix($.goSlice($.pointerValue<Config>(c).SessionTicketKey, undefined, undefined), deprecatedSessionTicketKey) || ($.len($.pointerValue<Config>(c).sessionTicketKeys) > 0))) {
			return
		}

		// We need to write some data, so get an exclusive lock and re-check any conditions.
		$.pointerValue<Config>(c).mutex.RUnlock()
		__defer.defer(async () => { await $.pointerValue<Config>(c).mutex.RLock() })
		await $.pointerValue<Config>(c).mutex.Lock()
		__defer.defer(() => { $.pointerValue<Config>(c).mutex.Unlock() })
		if ($.arrayEqual($.pointerValue<Config>(c).SessionTicketKey, new Uint8Array(32))) {
			{
				let [, err] = await io.ReadFull($.pointerValueOrNil(Config.prototype.rand.call(c))!, $.goSlice($.pointerValue<Config>(c).SessionTicketKey, undefined, undefined))
				if (err != null) {
					$.panic(await fmt.Sprintf("tls: unable to generate random session ticket key: %v", (err as any)))
				}
			}
			// Write the deprecated prefix at the beginning so we know we created
			// it. This key with the DEPRECATED prefix isn't used as an actual
			// session ticket key, and is only randomized in case the application
			// reuses it for some reason.
			$.copy($.goSlice($.pointerValue<Config>(c).SessionTicketKey, undefined, undefined), deprecatedSessionTicketKey)
		} else {
			if (!bytes2.HasPrefix($.goSlice($.pointerValue<Config>(c).SessionTicketKey, undefined, undefined), deprecatedSessionTicketKey) && ($.len($.pointerValue<Config>(c).sessionTicketKeys) == 0)) {
				$.pointerValue<Config>(c).sessionTicketKeys = $.arrayToSlice<ticketKey>([$.markAsStructValue($.cloneStructValue(await Config.prototype.ticketKeyFromBytes.call(c, $.pointerValue<Config>(c).SessionTicketKey)))])
			}
		}
	}

	public maxSupportedVersion(isClient: boolean): number {
		const c: Config | $.VarRef<Config> | null = this
		let supportedVersions: $.Slice<number> = Config.prototype.supportedVersions.call(c, isClient)
		if ($.len(supportedVersions) == 0) {
			return $.uint(0, 16)
		}
		return $.uint($.arrayIndex(supportedVersions!, 0), 16)
	}

	public mutualVersion(isClient: boolean, peerVersions: $.Slice<number>): [number, boolean] {
		const c: Config | $.VarRef<Config> | null = this
		let supportedVersions: $.Slice<number> = Config.prototype.supportedVersions.call(c, isClient)
		for (let __goscriptRangeTarget8 = supportedVersions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
			let v = __goscriptRangeTarget8![__rangeIndex]
			if (slices.Contains(peerVersions, $.uint(v, 16))) {
				return [$.uint(v, 16), true]
			}
		}
		return [$.uint(0, 16), false]
	}

	public rand(): io.Reader | null {
		const c: Config | $.VarRef<Config> | null = this
		let r = $.pointerValue<Config>(c).Rand
		if (r == null) {
			return rand2.Reader
		}
		return r
	}

	public supportedCipherSuites(): $.Slice<number> {
		const c: Config | $.VarRef<Config> | null = this
		return Config.prototype.cipherSuites.call(c, false)
	}

	public supportedVersions(isClient: boolean): $.Slice<number> {
		const c: Config | $.VarRef<Config> | null = this
		let versions: $.Slice<number> = $.makeSlice<number>(0, $.len(supportedVersions), "number")
		for (let __goscriptRangeTarget9 = supportedVersions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
			let v = __goscriptRangeTarget9![__rangeIndex]
			if (fips140tls.Required() && !slices.Contains(__goscript_defaults_fips140.__goscript_get_allowedSupportedVersionsFIPS(), $.uint(v, 16))) {
				continue
			}
			if (((c == null) || ($.uint($.pointerValue<Config>(c).MinVersion, 16) == $.uint(0, 16))) && ($.uint(v, 16) < $.uint(771, 16))) {
				if (isClient || (!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(tls10server)), "1"))) {
					continue
				}
			}
			if ((isClient && ($.pointerValue<Config>(c).EncryptedClientHelloConfigList != null)) && ($.uint(v, 16) < $.uint(772, 16))) {
				continue
			}
			if (((c != null) && ($.uint($.pointerValue<Config>(c).MinVersion, 16) != $.uint(0, 16))) && ($.uint(v, 16) < $.uint($.pointerValue<Config>(c).MinVersion, 16))) {
				continue
			}
			if (((c != null) && ($.uint($.pointerValue<Config>(c).MaxVersion, 16) != $.uint(0, 16))) && ($.uint(v, 16) > $.uint($.pointerValue<Config>(c).MaxVersion, 16))) {
				continue
			}
			versions = $.append(versions, $.uint(v, 16))
		}
		return versions
	}

	public supportsCurve(version: number, curve: CurveID): boolean {
		const c: Config | $.VarRef<Config> | null = this
		return slices.Contains(Config.prototype.curvePreferences.call(c, $.uint(version, 16)), $.uint(curve, 16))
	}

	public async ticketKeyFromBytes(b: Uint8Array): globalThis.Promise<ticketKey> {
		const c: Config | $.VarRef<Config> | null = this
		let key: ticketKey = $.markAsStructValue(new ticketKey())
		let hashed = await sha512.Sum512($.goSlice(b, undefined, undefined))
		// The first 16 bytes of the hash used to be exposed on the wire as a ticket
		// prefix. They MUST NOT be used as a secret. In the future, it would make
		// sense to use a proper KDF here, like HKDF with a fixed salt.
		const legacyTicketKeyNameLen: number = 16
		$.copy($.goSlice(key.aesKey, undefined, undefined), $.goSlice(hashed, 16, undefined))
		$.copy($.goSlice(key.hmacKey, undefined, undefined), $.goSlice(hashed, 16 + $.len(key.aesKey), undefined))
		key.created = $.markAsStructValue($.cloneStructValue(await Config.prototype.time.call(c)))
		return $.markAsStructValue($.cloneStructValue(key))
	}

	public async ticketKeys(configForClient: Config | $.VarRef<Config> | null): globalThis.Promise<$.Slice<ticketKey>> {
		let c: Config | $.VarRef<Config> | null = this
		await using __defer = new $.AsyncDisposableStack()
		// If the ConfigForClient callback returned a Config with explicitly set
		// keys, use those, otherwise just use the original Config.
		if (configForClient != null) {
			await $.pointerValue<Config>(configForClient).mutex.RLock()
			if ($.pointerValue<Config>(configForClient).SessionTicketsDisabled) {
				$.pointerValue<Config>(configForClient).mutex.RUnlock()
				return null
			}
			await Config.prototype.initLegacySessionTicketKeyRLocked.call(configForClient)
			if ($.len($.pointerValue<Config>(configForClient).sessionTicketKeys) != 0) {
				let ret: $.Slice<ticketKey> = $.pointerValue<Config>(configForClient).sessionTicketKeys
				$.pointerValue<Config>(configForClient).mutex.RUnlock()
				return ret
			}
			$.pointerValue<Config>(configForClient).mutex.RUnlock()
		}

		await $.pointerValue<Config>(c).mutex.RLock()
		__defer.defer(() => { $.pointerValue<Config>(c).mutex.RUnlock() })
		if ($.pointerValue<Config>(c).SessionTicketsDisabled) {
			return null
		}
		await Config.prototype.initLegacySessionTicketKeyRLocked.call(c)
		if ($.len($.pointerValue<Config>(c).sessionTicketKeys) != 0) {
			return $.pointerValue<Config>(c).sessionTicketKeys
		}
		// Fast path for the common case where the key is fresh enough.
		if (($.len($.pointerValue<Config>(c).autoSessionTicketKeys) > 0) && ($.markAsStructValue($.cloneStructValue((await Config.prototype.time.call(c)))).Sub($.markAsStructValue($.cloneStructValue($.arrayIndex($.pointerValue<Config>(c).autoSessionTicketKeys!, 0).created))) < 86400000000000n)) {
			return $.pointerValue<Config>(c).autoSessionTicketKeys
		}

		// autoSessionTicketKeys are managed by auto-rotation.
		$.pointerValue<Config>(c).mutex.RUnlock()
		__defer.defer(async () => { await $.pointerValue<Config>(c).mutex.RLock() })
		await $.pointerValue<Config>(c).mutex.Lock()
		__defer.defer(() => { $.pointerValue<Config>(c).mutex.Unlock() })
		// Re-check the condition in case it changed since obtaining the new lock.
		if (($.len($.pointerValue<Config>(c).autoSessionTicketKeys) == 0) || ($.markAsStructValue($.cloneStructValue((await Config.prototype.time.call(c)))).Sub($.markAsStructValue($.cloneStructValue($.arrayIndex($.pointerValue<Config>(c).autoSessionTicketKeys!, 0).created))) >= 86400000000000n)) {
			let newKey: Uint8Array = new Uint8Array(32)
			{
				let [, err] = await io.ReadFull($.pointerValueOrNil(Config.prototype.rand.call(c))!, $.goSlice(newKey, undefined, undefined))
				if (err != null) {
					$.panic(await fmt.Sprintf("unable to generate random session ticket key: %v", (err as any)))
				}
			}
			let valid: $.Slice<ticketKey> = $.makeSlice<ticketKey>(0, $.len($.pointerValue<Config>(c).autoSessionTicketKeys) + 1, undefined, () => $.markAsStructValue(new ticketKey()))
			valid = $.append(valid, await Config.prototype.ticketKeyFromBytes.call(c, newKey))
			for (let __goscriptRangeTarget10 = $.pointerValue<Config>(c).autoSessionTicketKeys, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
				let k = __goscriptRangeTarget10![__rangeIndex]
				// While rotating the current key, also remove any expired ones.
				if ($.markAsStructValue($.cloneStructValue((await Config.prototype.time.call(c)))).Sub($.markAsStructValue($.cloneStructValue(k.created))) < 604800000000000n) {
					valid = $.append(valid, k)
				}
			}
			$.pointerValue<Config>(c).autoSessionTicketKeys = valid
		}
		return $.pointerValue<Config>(c).autoSessionTicketKeys
	}

	public async time(): globalThis.Promise<time2.Time> {
		const c: Config | $.VarRef<Config> | null = this
		let t: (() => time2.Time | globalThis.Promise<time2.Time>) | null = $.pointerValue<Config>(c).Time
		if (t == null) {
			t = time2.Now
		}
		return $.markAsStructValue($.cloneStructValue(await t!()))
	}

	public async writeKeyLog(label: string, clientRandom: $.Slice<number>, secret: $.Slice<number>): globalThis.Promise<$.GoError> {
		const c: Config | $.VarRef<Config> | null = this
		if ($.pointerValue<Config>(c).KeyLogWriter == null) {
			return null
		}

		let logLine: $.Slice<number> = fmt.Appendf(null, "%s %x %x\n", label, $.interfaceValue<any>(clientRandom, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }), $.interfaceValue<any>(secret, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }))

		await writerMutex.value.Lock()
		let [, err] = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<Config>(c).KeyLogWriter).Write(logLine)
		writerMutex.value.Unlock()

		return err
	}

	static __typeInfo = $.registerStructType(
		"tls.Config",
		() => new Config(),
		[{ name: "BuildNameToCertificate", args: [], returns: [] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }] }, { name: "DecryptTicket", args: [{ name: "identity", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "cs", type: "tls.ConnectionState" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" } }, { name: "_r1", type: "error" }] }, { name: "EncryptTicket", args: [{ name: "cs", type: "tls.ConnectionState" }, { name: "ss", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "SetSessionTicketKeys", args: [{ name: "keys", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 } } }], returns: [] }, { name: "cipherSuites", args: [{ name: "aesGCMPreferred", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } } }] }, { name: "curvePreferences", args: [{ name: "version", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" } } }] }, { name: "decryptTicket", args: [{ name: "encrypted", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ticketKeys", type: { kind: $.TypeKind.Slice, elemType: "tls.ticketKey" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "encryptTicket", args: [{ name: "state", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ticketKeys", type: { kind: $.TypeKind.Slice, elemType: "tls.ticketKey" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "getCertificate", args: [{ name: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.ClientHelloInfo" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, { name: "_r1", type: "error" }] }, { name: "initLegacySessionTicketKeyRLocked", args: [], returns: [] }, { name: "maxSupportedVersion", args: [{ name: "isClient", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "mutualVersion", args: [{ name: "isClient", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "peerVersions", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "rand", args: [], returns: [{ name: "_r0", type: "io.Reader" }] }, { name: "supportedCipherSuites", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } } }] }, { name: "supportedVersions", args: [{ name: "isClient", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } } }] }, { name: "supportsCurve", args: [{ name: "version", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "curve", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "ticketKeyFromBytes", args: [{ name: "b", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 } }], returns: [{ name: "key", type: "tls.ticketKey" }] }, { name: "ticketKeys", args: [{ name: "configForClient", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "tls.ticketKey" } }] }, { name: "time", args: [], returns: [{ name: "_r0", type: "time.Time" }] }, { name: "writeKeyLog", args: [{ name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "clientRandom", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		Config,
		[{ name: "Rand", key: "Rand", type: "io.Reader", index: [0], offset: 0, exported: true }, { name: "Time", key: "Time", type: ({ kind: $.TypeKind.Function, params: [], results: ["time.Time"] } as $.FunctionTypeInfo), index: [1], offset: 16, exported: true }, { name: "Certificates", key: "Certificates", type: { kind: $.TypeKind.Slice, elemType: "tls.Certificate" }, index: [2], offset: 24, exported: true }, { name: "NameToCertificate", key: "NameToCertificate", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, index: [3], offset: 48, exported: true }, { name: "GetCertificate", key: "GetCertificate", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "tls.ClientHelloInfo" }], results: [{ kind: $.TypeKind.Pointer, elemType: "tls.Certificate" }, "error"] } as $.FunctionTypeInfo), index: [4], offset: 56, exported: true }, { name: "GetClientCertificate", key: "GetClientCertificate", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "tls.CertificateRequestInfo" }], results: [{ kind: $.TypeKind.Pointer, elemType: "tls.Certificate" }, "error"] } as $.FunctionTypeInfo), index: [5], offset: 64, exported: true }, { name: "GetConfigForClient", key: "GetConfigForClient", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "tls.ClientHelloInfo" }], results: [{ kind: $.TypeKind.Pointer, elemType: "tls.Config" }, "error"] } as $.FunctionTypeInfo), index: [6], offset: 72, exported: true }, { name: "VerifyPeerCertificate", key: "VerifyPeerCertificate", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } }], results: ["error"] } as $.FunctionTypeInfo), index: [7], offset: 80, exported: true }, { name: "VerifyConnection", key: "VerifyConnection", type: ({ kind: $.TypeKind.Function, params: ["tls.ConnectionState"], results: ["error"] } as $.FunctionTypeInfo), index: [8], offset: 88, exported: true }, { name: "RootCAs", key: "RootCAs", type: { kind: $.TypeKind.Pointer, elemType: "x509.CertPool" }, index: [9], offset: 96, exported: true }, { name: "NextProtos", key: "NextProtos", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [10], offset: 104, exported: true }, { name: "ServerName", key: "ServerName", type: { kind: $.TypeKind.Basic, name: "string" }, index: [11], offset: 128, exported: true }, { name: "ClientAuth", key: "ClientAuth", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.ClientAuthType" }, index: [12], offset: 144, exported: true }, { name: "ClientCAs", key: "ClientCAs", type: { kind: $.TypeKind.Pointer, elemType: "x509.CertPool" }, index: [13], offset: 152, exported: true }, { name: "InsecureSkipVerify", key: "InsecureSkipVerify", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [14], offset: 160, exported: true }, { name: "CipherSuites", key: "CipherSuites", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }, index: [15], offset: 168, exported: true }, { name: "PreferServerCipherSuites", key: "PreferServerCipherSuites", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [16], offset: 192, exported: true }, { name: "SessionTicketsDisabled", key: "SessionTicketsDisabled", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [17], offset: 193, exported: true }, { name: "SessionTicketKey", key: "SessionTicketKey", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }, index: [18], offset: 194, exported: true }, { name: "ClientSessionCache", key: "ClientSessionCache", type: "tls.ClientSessionCache", index: [19], offset: 232, exported: true }, { name: "UnwrapSession", key: "UnwrapSession", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "tls.ConnectionState"], results: [{ kind: $.TypeKind.Pointer, elemType: "tls.SessionState" }, "error"] } as $.FunctionTypeInfo), index: [20], offset: 248, exported: true }, { name: "WrapSession", key: "WrapSession", type: ({ kind: $.TypeKind.Function, params: ["tls.ConnectionState", { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo), index: [21], offset: 256, exported: true }, { name: "MinVersion", key: "MinVersion", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [22], offset: 264, exported: true }, { name: "MaxVersion", key: "MaxVersion", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [23], offset: 266, exported: true }, { name: "CurvePreferences", key: "CurvePreferences", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" } }, index: [24], offset: 272, exported: true }, { name: "DynamicRecordSizingDisabled", key: "DynamicRecordSizingDisabled", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [25], offset: 296, exported: true }, { name: "Renegotiation", key: "Renegotiation", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.RenegotiationSupport" }, index: [26], offset: 304, exported: true }, { name: "KeyLogWriter", key: "KeyLogWriter", type: "io.Writer", index: [27], offset: 312, exported: true }, { name: "EncryptedClientHelloConfigList", key: "EncryptedClientHelloConfigList", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [28], offset: 328, exported: true }, { name: "EncryptedClientHelloRejectionVerify", key: "EncryptedClientHelloRejectionVerify", type: ({ kind: $.TypeKind.Function, params: ["tls.ConnectionState"], results: ["error"] } as $.FunctionTypeInfo), index: [29], offset: 352, exported: true }, { name: "GetEncryptedClientHelloKeys", key: "GetEncryptedClientHelloKeys", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "tls.ClientHelloInfo" }], results: [{ kind: $.TypeKind.Slice, elemType: "tls.EncryptedClientHelloKey" }, "error"] } as $.FunctionTypeInfo), index: [30], offset: 360, exported: true }, { name: "EncryptedClientHelloKeys", key: "EncryptedClientHelloKeys", type: { kind: $.TypeKind.Slice, elemType: "tls.EncryptedClientHelloKey" }, index: [31], offset: 368, exported: true }, { name: "mutex", key: "mutex", type: "sync.RWMutex", pkgPath: "crypto/tls", index: [32], offset: 392, exported: false }, { name: "sessionTicketKeys", key: "sessionTicketKeys", type: { kind: $.TypeKind.Slice, elemType: "tls.ticketKey" }, pkgPath: "crypto/tls", index: [33], offset: 416, exported: false }, { name: "autoSessionTicketKeys", key: "autoSessionTicketKeys", type: { kind: $.TypeKind.Slice, elemType: "tls.ticketKey" }, pkgPath: "crypto/tls", index: [34], offset: 440, exported: false }]
	)
}

export class EncryptedClientHelloKey {
	// Config should be a marshalled ECHConfig associated with PrivateKey. This
	// must match the config provided to clients byte-for-byte. The config must
	// use as KEM one of
	//
	//   - DHKEM(P-256, HKDF-SHA256) (0x0010)
	//   - DHKEM(P-384, HKDF-SHA384) (0x0011)
	//   - DHKEM(P-521, HKDF-SHA512) (0x0012)
	//   - DHKEM(X25519, HKDF-SHA256) (0x0020)
	//
	// and as KDF one of
	//
	//   - HKDF-SHA256 (0x0001)
	//   - HKDF-SHA384 (0x0002)
	//   - HKDF-SHA512 (0x0003)
	//
	// and as AEAD one of
	//
	//   - AES-128-GCM (0x0001)
	//   - AES-256-GCM (0x0002)
	//   - ChaCha20Poly1305 (0x0003)
	public get Config(): $.Slice<number> {
		return this._fields.Config.value
	}
	public set Config(value: $.Slice<number>) {
		this._fields.Config.value = value
	}

	// PrivateKey should be a marshalled private key, in the format expected by
	// HPKE's DeserializePrivateKey (see RFC 9180), for the KEM used in Config.
	public get PrivateKey(): $.Slice<number> {
		return this._fields.PrivateKey.value
	}
	public set PrivateKey(value: $.Slice<number>) {
		this._fields.PrivateKey.value = value
	}

	// SendAsRetry indicates if Config should be sent as part of the list of
	// retry configs when ECH is requested by the client but rejected by the
	// server.
	public get SendAsRetry(): boolean {
		return this._fields.SendAsRetry.value
	}
	public set SendAsRetry(value: boolean) {
		this._fields.SendAsRetry.value = value
	}

	public _fields: {
		Config: $.VarRef<$.Slice<number>>
		PrivateKey: $.VarRef<$.Slice<number>>
		SendAsRetry: $.VarRef<boolean>
	}

	constructor(init?: Partial<{Config?: $.Slice<number>, PrivateKey?: $.Slice<number>, SendAsRetry?: boolean}>) {
		this._fields = {
			Config: $.varRef(init?.Config ?? (null as $.Slice<number>)),
			PrivateKey: $.varRef(init?.PrivateKey ?? (null as $.Slice<number>)),
			SendAsRetry: $.varRef(init?.SendAsRetry ?? (false as boolean))
		}
	}

	public clone(): EncryptedClientHelloKey {
		const cloned = new EncryptedClientHelloKey()
		cloned._fields = {
			Config: $.varRef(this._fields.Config.value),
			PrivateKey: $.varRef(this._fields.PrivateKey.value),
			SendAsRetry: $.varRef(this._fields.SendAsRetry.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.EncryptedClientHelloKey",
		() => new EncryptedClientHelloKey(),
		[],
		EncryptedClientHelloKey,
		[{ name: "Config", key: "Config", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "PrivateKey", key: "PrivateKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [1], offset: 24, exported: true }, { name: "SendAsRetry", key: "SendAsRetry", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [2], offset: 48, exported: true }]
	)
}

export class ticketKey {
	public get aesKey(): Uint8Array {
		return this._fields.aesKey.value
	}
	public set aesKey(value: Uint8Array) {
		this._fields.aesKey.value = value
	}

	public get hmacKey(): Uint8Array {
		return this._fields.hmacKey.value
	}
	public set hmacKey(value: Uint8Array) {
		this._fields.hmacKey.value = value
	}

	// created is the time at which this ticket key was created. See Config.ticketKeys.
	public get created(): time2.Time {
		return this._fields.created.value
	}
	public set created(value: time2.Time) {
		this._fields.created.value = value
	}

	public _fields: {
		aesKey: $.VarRef<Uint8Array>
		hmacKey: $.VarRef<Uint8Array>
		created: $.VarRef<time2.Time>
	}

	constructor(init?: Partial<{aesKey?: Uint8Array, hmacKey?: Uint8Array, created?: time2.Time}>) {
		this._fields = {
			aesKey: $.varRef(init?.aesKey !== undefined ? $.cloneArrayValue(init.aesKey) : new Uint8Array(16)),
			hmacKey: $.varRef(init?.hmacKey !== undefined ? $.cloneArrayValue(init.hmacKey) : new Uint8Array(16)),
			created: $.varRef(init?.created ? $.markAsStructValue($.cloneStructValue(init.created)) : $.markAsStructValue(new time2.Time()))
		}
	}

	public clone(): ticketKey {
		const cloned = new ticketKey()
		cloned._fields = {
			aesKey: $.varRef($.cloneArrayValue(this._fields.aesKey.value)),
			hmacKey: $.varRef($.cloneArrayValue(this._fields.hmacKey.value)),
			created: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.created.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.ticketKey",
		() => new ticketKey(),
		[],
		ticketKey,
		[{ name: "aesKey", key: "aesKey", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "hmacKey", key: "hmacKey", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 }, pkgPath: "crypto/tls", index: [1], offset: 16, exported: false }, { name: "created", key: "created", type: "time.Time", pkgPath: "crypto/tls", index: [2], offset: 32, exported: false }]
	)
}

export class Certificate {
	public get Certificate(): $.Slice<$.Slice<number>> {
		return this._fields.Certificate.value
	}
	public set Certificate(value: $.Slice<$.Slice<number>>) {
		this._fields.Certificate.value = value
	}

	// PrivateKey contains the private key corresponding to the public key in
	// Leaf. This must implement [crypto.Signer] with an RSA, ECDSA or Ed25519
	// PublicKey.
	//
	// For a server up to TLS 1.2, it can also implement crypto.Decrypter with
	// an RSA PublicKey.
	//
	// If it implements [crypto.MessageSigner], SignMessage will be used instead
	// of Sign for TLS 1.2 and later.
	public get PrivateKey(): crypto.PrivateKey | null {
		return this._fields.PrivateKey.value
	}
	public set PrivateKey(value: crypto.PrivateKey | null) {
		this._fields.PrivateKey.value = value
	}

	// SupportedSignatureAlgorithms is an optional list restricting what
	// signature algorithms the PrivateKey can be used for.
	public get SupportedSignatureAlgorithms(): $.Slice<SignatureScheme> {
		return this._fields.SupportedSignatureAlgorithms.value
	}
	public set SupportedSignatureAlgorithms(value: $.Slice<SignatureScheme>) {
		this._fields.SupportedSignatureAlgorithms.value = value
	}

	// OCSPStaple contains an optional OCSP response which will be served
	// to clients that request it.
	public get OCSPStaple(): $.Slice<number> {
		return this._fields.OCSPStaple.value
	}
	public set OCSPStaple(value: $.Slice<number>) {
		this._fields.OCSPStaple.value = value
	}

	// SignedCertificateTimestamps contains an optional list of Signed
	// Certificate Timestamps which will be served to clients that request it.
	public get SignedCertificateTimestamps(): $.Slice<$.Slice<number>> {
		return this._fields.SignedCertificateTimestamps.value
	}
	public set SignedCertificateTimestamps(value: $.Slice<$.Slice<number>>) {
		this._fields.SignedCertificateTimestamps.value = value
	}

	// Leaf is the parsed form of the leaf certificate, which may be initialized
	// using x509.ParseCertificate to reduce per-handshake processing. If nil,
	// the leaf certificate will be parsed as needed.
	public get Leaf(): x509.Certificate | $.VarRef<x509.Certificate> | null {
		return this._fields.Leaf.value
	}
	public set Leaf(value: x509.Certificate | $.VarRef<x509.Certificate> | null) {
		this._fields.Leaf.value = value
	}

	public _fields: {
		Certificate: $.VarRef<$.Slice<$.Slice<number>>>
		PrivateKey: $.VarRef<crypto.PrivateKey | null>
		SupportedSignatureAlgorithms: $.VarRef<$.Slice<SignatureScheme>>
		OCSPStaple: $.VarRef<$.Slice<number>>
		SignedCertificateTimestamps: $.VarRef<$.Slice<$.Slice<number>>>
		Leaf: $.VarRef<x509.Certificate | $.VarRef<x509.Certificate> | null>
	}

	constructor(init?: Partial<{Certificate?: $.Slice<$.Slice<number>>, PrivateKey?: crypto.PrivateKey | null, SupportedSignatureAlgorithms?: $.Slice<SignatureScheme>, OCSPStaple?: $.Slice<number>, SignedCertificateTimestamps?: $.Slice<$.Slice<number>>, Leaf?: x509.Certificate | $.VarRef<x509.Certificate> | null}>) {
		this._fields = {
			Certificate: $.varRef(init?.Certificate ?? (null as $.Slice<$.Slice<number>>)),
			PrivateKey: $.varRef(init?.PrivateKey ?? (null as crypto.PrivateKey | null)),
			SupportedSignatureAlgorithms: $.varRef(init?.SupportedSignatureAlgorithms ?? (null as $.Slice<SignatureScheme>)),
			OCSPStaple: $.varRef(init?.OCSPStaple ?? (null as $.Slice<number>)),
			SignedCertificateTimestamps: $.varRef(init?.SignedCertificateTimestamps ?? (null as $.Slice<$.Slice<number>>)),
			Leaf: $.varRef(init?.Leaf ?? (null as x509.Certificate | $.VarRef<x509.Certificate> | null))
		}
	}

	public clone(): Certificate {
		const cloned = new Certificate()
		cloned._fields = {
			Certificate: $.varRef(this._fields.Certificate.value),
			PrivateKey: $.varRef(this._fields.PrivateKey.value),
			SupportedSignatureAlgorithms: $.varRef(this._fields.SupportedSignatureAlgorithms.value),
			OCSPStaple: $.varRef(this._fields.OCSPStaple.value),
			SignedCertificateTimestamps: $.varRef(this._fields.SignedCertificateTimestamps.value),
			Leaf: $.varRef(this._fields.Leaf.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async leaf(): globalThis.Promise<[x509.Certificate | $.VarRef<x509.Certificate> | null, $.GoError]> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		if ($.pointerValue<Certificate>(c).Leaf != null) {
			return [$.pointerValue<Certificate>(c).Leaf, null]
		}
		return x509.ParseCertificate($.arrayIndex($.pointerValue<Certificate>(c).Certificate!, 0))
	}

	static __typeInfo = $.registerStructType(
		"tls.Certificate",
		() => new Certificate(),
		[{ name: "leaf", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, { name: "_r1", type: "error" }] }],
		Certificate,
		[{ name: "Certificate", key: "Certificate", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, index: [0], offset: 0, exported: true }, { name: "PrivateKey", key: "PrivateKey", type: "crypto.PrivateKey", index: [1], offset: 24, exported: true }, { name: "SupportedSignatureAlgorithms", key: "SupportedSignatureAlgorithms", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" } }, index: [2], offset: 40, exported: true }, { name: "OCSPStaple", key: "OCSPStaple", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [3], offset: 64, exported: true }, { name: "SignedCertificateTimestamps", key: "SignedCertificateTimestamps", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, index: [4], offset: 88, exported: true }, { name: "Leaf", key: "Leaf", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, index: [5], offset: 112, exported: true }]
	)
}

export class lruSessionCache {
	public get Mutex(): sync.Mutex {
		return this._fields.Mutex.value
	}
	public set Mutex(value: sync.Mutex) {
		this._fields.Mutex.value = value
	}

	public get m(): globalThis.Map<string, list.Element | $.VarRef<list.Element> | null> | null {
		return this._fields.m.value
	}
	public set m(value: globalThis.Map<string, list.Element | $.VarRef<list.Element> | null> | null) {
		this._fields.m.value = value
	}

	public get q(): list.List | $.VarRef<list.List> | null {
		return this._fields.q.value
	}
	public set q(value: list.List | $.VarRef<list.List> | null) {
		this._fields.q.value = value
	}

	public get capacity(): number {
		return this._fields.capacity.value
	}
	public set capacity(value: number) {
		this._fields.capacity.value = value
	}

	public _fields: {
		Mutex: $.VarRef<sync.Mutex>
		m: $.VarRef<globalThis.Map<string, list.Element | $.VarRef<list.Element> | null> | null>
		q: $.VarRef<list.List | $.VarRef<list.List> | null>
		capacity: $.VarRef<number>
	}

	constructor(init?: Partial<{Mutex?: sync.Mutex, m?: globalThis.Map<string, list.Element | $.VarRef<list.Element> | null> | null, q?: list.List | $.VarRef<list.List> | null, capacity?: number}>) {
		this._fields = {
			Mutex: $.varRef(init?.Mutex ? $.markAsStructValue($.cloneStructValue(init.Mutex)) : $.markAsStructValue(new sync.Mutex())),
			m: $.varRef(init?.m ?? (null as globalThis.Map<string, list.Element | $.VarRef<list.Element> | null> | null)),
			q: $.varRef(init?.q ?? (null as list.List | $.VarRef<list.List> | null)),
			capacity: $.varRef(init?.capacity ?? (0 as number))
		}
	}

	public clone(): lruSessionCache {
		const cloned = new lruSessionCache()
		cloned._fields = {
			Mutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Mutex.value))),
			m: $.varRef(this._fields.m.value),
			q: $.varRef(this._fields.q.value),
			capacity: $.varRef(this._fields.capacity.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Get(sessionKey: string): globalThis.Promise<[__goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null, boolean]> {
		const c: lruSessionCache | $.VarRef<lruSessionCache> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<lruSessionCache>(c).Mutex.Lock()
		__defer.defer(() => { $.pointerValue<lruSessionCache>(c).Mutex.Unlock() })

		{
			let __goscriptTuple9: any = $.mapGet<string, list.Element | $.VarRef<list.Element> | null, list.Element | $.VarRef<list.Element> | null>($.pointerValue<lruSessionCache>(c).m, sessionKey, null)
			let elem: list.Element | $.VarRef<list.Element> | null = __goscriptTuple9[0]
			let ok = __goscriptTuple9[1]
			if (ok) {
				list.List.prototype.MoveToFront.call($.pointerValue<lruSessionCache>(c).q, elem)
				return [$.pointerValue<lruSessionCacheEntry>($.mustTypeAssert<lruSessionCacheEntry | $.VarRef<lruSessionCacheEntry> | null>($.pointerValue<list.Element>(elem).Value, { kind: $.TypeKind.Pointer, elemType: "tls.lruSessionCacheEntry" })).state, true]
			}
		}
		return [null, false]
	}

	public async Put(sessionKey: string, cs: __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null): globalThis.Promise<void> {
		let c: lruSessionCache | $.VarRef<lruSessionCache> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<lruSessionCache>(c).Mutex.Lock()
		__defer.defer(() => { $.pointerValue<lruSessionCache>(c).Mutex.Unlock() })

		{
			let __goscriptTuple10: any = $.mapGet<string, list.Element | $.VarRef<list.Element> | null, list.Element | $.VarRef<list.Element> | null>($.pointerValue<lruSessionCache>(c).m, sessionKey, null)
			let elem: list.Element | $.VarRef<list.Element> | null = __goscriptTuple10[0]
			let ok = __goscriptTuple10[1]
			if (ok) {
				if (cs == null) {
					list.List.prototype.Remove.call($.pointerValue<lruSessionCache>(c).q, elem)
					$.deleteMapEntry($.pointerValue<lruSessionCache>(c).m, sessionKey)
				} else {
					let entry: lruSessionCacheEntry | $.VarRef<lruSessionCacheEntry> | null = $.mustTypeAssert<lruSessionCacheEntry | $.VarRef<lruSessionCacheEntry> | null>($.pointerValue<list.Element>(elem).Value, { kind: $.TypeKind.Pointer, elemType: "tls.lruSessionCacheEntry" })
					$.pointerValue<lruSessionCacheEntry>(entry).state = cs
					list.List.prototype.MoveToFront.call($.pointerValue<lruSessionCache>(c).q, elem)
				}
				return
			}
		}

		if (list.List.prototype.Len.call($.pointerValue<lruSessionCache>(c).q) < $.pointerValue<lruSessionCache>(c).capacity) {
			let entry: lruSessionCacheEntry | $.VarRef<lruSessionCacheEntry> | null = new lruSessionCacheEntry({sessionKey: sessionKey, state: cs})
			$.mapSet($.pointerValue<lruSessionCache>(c).m, sessionKey, list.List.prototype.PushFront.call($.pointerValue<lruSessionCache>(c).q, $.interfaceValue<any>(entry, "*tls.lruSessionCacheEntry", { kind: $.TypeKind.Pointer, elemType: "tls.lruSessionCacheEntry" })))
			return
		}

		let elem: list.Element | $.VarRef<list.Element> | null = list.List.prototype.Back.call($.pointerValue<lruSessionCache>(c).q)
		let entry: lruSessionCacheEntry | $.VarRef<lruSessionCacheEntry> | null = $.mustTypeAssert<lruSessionCacheEntry | $.VarRef<lruSessionCacheEntry> | null>($.pointerValue<list.Element>(elem).Value, { kind: $.TypeKind.Pointer, elemType: "tls.lruSessionCacheEntry" })
		$.deleteMapEntry($.pointerValue<lruSessionCache>(c).m, $.pointerValue<lruSessionCacheEntry>(entry).sessionKey)
		$.pointerValue<lruSessionCacheEntry>(entry).sessionKey = sessionKey
		$.pointerValue<lruSessionCacheEntry>(entry).state = cs
		list.List.prototype.MoveToFront.call($.pointerValue<lruSessionCache>(c).q, elem)
		$.mapSet($.pointerValue<lruSessionCache>(c).m, sessionKey, elem)
	}

	public Lock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).Lock()
	}

	public TryLock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).TryLock()
	}

	public Unlock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).Unlock()
	}

	static __typeInfo = $.registerStructType(
		"tls.lruSessionCache",
		() => new lruSessionCache(),
		[{ name: "Get", args: [{ name: "sessionKey", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.ClientSessionState" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Put", args: [{ name: "sessionKey", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "cs", type: { kind: $.TypeKind.Pointer, elemType: "tls.ClientSessionState" } }], returns: [] }, { name: "Lock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unlock", args: [], returns: [] }],
		lruSessionCache,
		[{ name: "Mutex", key: "Mutex", type: "sync.Mutex", anonymous: true, index: [0], offset: 0, exported: true }, { name: "m", key: "m", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "list.Element" } }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "q", key: "q", type: { kind: $.TypeKind.Pointer, elemType: "list.List" }, pkgPath: "crypto/tls", index: [2], offset: 16, exported: false }, { name: "capacity", key: "capacity", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [3], offset: 24, exported: false }]
	)
}

export class lruSessionCacheEntry {
	public get sessionKey(): string {
		return this._fields.sessionKey.value
	}
	public set sessionKey(value: string) {
		this._fields.sessionKey.value = value
	}

	public get state(): __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null {
		return this._fields.state.value
	}
	public set state(value: __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null) {
		this._fields.state.value = value
	}

	public _fields: {
		sessionKey: $.VarRef<string>
		state: $.VarRef<__goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null>
	}

	constructor(init?: Partial<{sessionKey?: string, state?: __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null}>) {
		this._fields = {
			sessionKey: $.varRef(init?.sessionKey ?? ("" as string)),
			state: $.varRef(init?.state ?? (null as __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null))
		}
	}

	public clone(): lruSessionCacheEntry {
		const cloned = new lruSessionCacheEntry()
		cloned._fields = {
			sessionKey: $.varRef(this._fields.sessionKey.value),
			state: $.varRef(this._fields.state.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.lruSessionCacheEntry",
		() => new lruSessionCacheEntry(),
		[],
		lruSessionCacheEntry,
		[{ name: "sessionKey", key: "sessionKey", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "state", key: "state", type: { kind: $.TypeKind.Pointer, elemType: "tls.ClientSessionState" }, pkgPath: "crypto/tls", index: [1], offset: 16, exported: false }]
	)
}

export class CertificateVerificationError {
	// UnverifiedCertificates and its contents should not be modified.
	public get UnverifiedCertificates(): $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null> {
		return this._fields.UnverifiedCertificates.value
	}
	public set UnverifiedCertificates(value: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>) {
		this._fields.UnverifiedCertificates.value = value
	}

	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		UnverifiedCertificates: $.VarRef<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>
		Err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{UnverifiedCertificates?: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>, Err?: $.GoError}>) {
		this._fields = {
			UnverifiedCertificates: $.varRef(init?.UnverifiedCertificates ?? (null as $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>)),
			Err: $.varRef(init?.Err ?? (null as $.GoError))
		}
	}

	public clone(): CertificateVerificationError {
		const cloned = new CertificateVerificationError()
		cloned._fields = {
			UnverifiedCertificates: $.varRef(this._fields.UnverifiedCertificates.value),
			Err: $.varRef(this._fields.Err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const e: CertificateVerificationError | $.VarRef<CertificateVerificationError> | null = this
		return fmt.Sprintf("tls: failed to verify certificate: %s", ($.pointerValue<CertificateVerificationError>(e).Err as any))
	}

	public Unwrap(): $.GoError {
		const e: CertificateVerificationError | $.VarRef<CertificateVerificationError> | null = this
		return $.pointerValue<CertificateVerificationError>(e).Err
	}

	static __typeInfo = $.registerStructType(
		"tls.CertificateVerificationError",
		() => new CertificateVerificationError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Unwrap", args: [], returns: [{ name: "_r0", type: "error" }] }],
		CertificateVerificationError,
		[{ name: "UnverifiedCertificates", key: "UnverifiedCertificates", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, index: [0], offset: 0, exported: true }, { name: "Err", key: "Err", type: "error", index: [1], offset: 24, exported: true }]
	)
}

export const VersionTLS10: number = 769

export const VersionTLS11: number = 770

export const VersionTLS12: number = 771

export const VersionTLS13: number = 772

export const VersionSSL30: number = 768

export const maxPlaintext: number = 16384

export const maxCiphertext: number = 18432

export const maxCiphertextTLS13: number = 16640

export const recordHeaderLen: number = 5

export const maxHandshake: number = 65536

export const maxHandshakeCertificateMsg: number = 262144

export const maxUselessRecords: number = 16

export const recordTypeChangeCipherSpec: recordType = 20

export const recordTypeAlert: recordType = 21

export const recordTypeHandshake: recordType = 22

export const recordTypeApplicationData: recordType = 23

export const typeHelloRequest: number = 0

export const typeClientHello: number = 1

export const typeServerHello: number = 2

export const typeNewSessionTicket: number = 4

export const typeEndOfEarlyData: number = 5

export const typeEncryptedExtensions: number = 8

export const typeCertificate: number = 11

export const typeServerKeyExchange: number = 12

export const typeCertificateRequest: number = 13

export const typeServerHelloDone: number = 14

export const typeCertificateVerify: number = 15

export const typeClientKeyExchange: number = 16

export const typeFinished: number = 20

export const typeCertificateStatus: number = 22

export const typeKeyUpdate: number = 24

export const typeMessageHash: number = 254

export const compressionNone: number = 0

export const extensionServerName: number = 0

export const extensionStatusRequest: number = 5

export const extensionSupportedCurves: number = 10

export const extensionSupportedPoints: number = 11

export const extensionSignatureAlgorithms: number = 13

export const extensionALPN: number = 16

export const extensionSCT: number = 18

export const extensionExtendedMasterSecret: number = 23

export const extensionSessionTicket: number = 35

export const extensionPreSharedKey: number = 41

export const extensionEarlyData: number = 42

export const extensionSupportedVersions: number = 43

export const extensionCookie: number = 44

export const extensionPSKModes: number = 45

export const extensionCertificateAuthorities: number = 47

export const extensionSignatureAlgorithmsCert: number = 50

export const extensionKeyShare: number = 51

export const extensionQUICTransportParameters: number = 57

export const extensionRenegotiationInfo: number = 65281

export const extensionECHOuterExtensions: number = 64768

export const extensionEncryptedClientHello: number = 65037

export const scsvRenegotiation: number = 255

export const CurveP256: CurveID = 23

export const CurveP384: CurveID = 24

export const CurveP521: CurveID = 25

export const X25519: CurveID = 29

export const X25519MLKEM768: CurveID = 4588

export const SecP256r1MLKEM768: CurveID = 4587

export const SecP384r1MLKEM1024: CurveID = 4589

export const pskModePlain: number = 0

export const pskModeDHE: number = 1

export const pointFormatUncompressed: number = 0

export const statusTypeOCSP: number = 1

export const certTypeRSASign: number = 1

export const certTypeECDSASign: number = 64

export const signaturePKCS1v15: number = 225

export const signatureRSAPSS: number = 226

export const signatureECDSA: number = 227

export const signatureEd25519: number = 228

export const downgradeCanaryTLS12: string = "DOWNGRD\x01"

export const downgradeCanaryTLS11: string = "DOWNGRD\x00"

export const NoClientCert: ClientAuthType = 0

export const RequestClientCert: ClientAuthType = 1

export const RequireAnyClientCert: ClientAuthType = 2

export const VerifyClientCertIfGiven: ClientAuthType = 3

export const RequireAndVerifyClientCert: ClientAuthType = 4

export const PKCS1WithSHA256: SignatureScheme = 1025

export const PKCS1WithSHA384: SignatureScheme = 1281

export const PKCS1WithSHA512: SignatureScheme = 1537

export const PSSWithSHA256: SignatureScheme = 2052

export const PSSWithSHA384: SignatureScheme = 2053

export const PSSWithSHA512: SignatureScheme = 2054

export const ECDSAWithP256AndSHA256: SignatureScheme = 1027

export const ECDSAWithP384AndSHA384: SignatureScheme = 1283

export const ECDSAWithP521AndSHA512: SignatureScheme = 1539

export const Ed25519: SignatureScheme = 2055

export const PKCS1WithSHA1: SignatureScheme = 513

export const ECDSAWithSHA1: SignatureScheme = 515

export const RenegotiateNever: RenegotiationSupport = 0

export const RenegotiateOnceAsClient: RenegotiationSupport = 1

export const RenegotiateFreelyAsClient: RenegotiationSupport = 2

export const ticketKeyLifetime: time2.Duration = 604800000000000n

export const ticketKeyRotation: time2.Duration = 86400000000000n

export const maxSessionTicketLifetime: time2.Duration = 604800000000000n

export const roleClient: boolean = true

export const roleServer: boolean = false

export const keyLogLabelTLS12: string = "CLIENT_RANDOM"

export const keyLogLabelClientHandshake: string = "CLIENT_HANDSHAKE_TRAFFIC_SECRET"

export const keyLogLabelServerHandshake: string = "SERVER_HANDSHAKE_TRAFFIC_SECRET"

export const keyLogLabelClientTraffic: string = "CLIENT_TRAFFIC_SECRET_0"

export const keyLogLabelServerTraffic: string = "SERVER_TRAFFIC_SECRET_0"

export async function VersionName(version: number): globalThis.Promise<string> {
	switch (version) {
		case 768:
		{
			return "SSLv3"
			break
		}
		case 769:
		{
			return "TLS 1.0"
			break
		}
		case 770:
		{
			return "TLS 1.1"
			break
		}
		case 771:
		{
			return "TLS 1.2"
			break
		}
		case 772:
		{
			return "TLS 1.3"
			break
		}
		default:
		{
			return fmt.Sprintf("0x%04X", $.namedValueInterfaceValue<any>(version, "uint16", {}, { kind: $.TypeKind.Basic, name: "uint16" }))
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function isTLS13OnlyKeyExchange(curve: CurveID): boolean {
	switch (curve) {
		case 4588:
		case 4587:
		case 4589:
		{
			return true
			break
		}
		default:
		{
			return false
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function isPQKeyExchange(curve: CurveID): boolean {
	switch (curve) {
		case 4588:
		case 4587:
		case 4589:
		{
			return true
			break
		}
		default:
		{
			return false
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let directSigning: crypto.Hash = 0

export function __goscript_set_directSigning(__goscriptValue: crypto.Hash): void {
	directSigning = __goscriptValue
}

export let helloRetryRequestRandom: $.Slice<number> = new Uint8Array([207, 33, 173, 116, 229, 154, 97, 17, 190, 29, 140, 2, 30, 101, 184, 145, 194, 162, 17, 22, 122, 187, 140, 94, 7, 158, 9, 226, 200, 168, 51, 156]) as $.Slice<number>

export function __goscript_set_helloRetryRequestRandom(__goscriptValue: $.Slice<number>): void {
	helloRetryRequestRandom = __goscriptValue
}

export let testingOnlyForceDowngradeCanary: boolean = false

export function __goscript_set_testingOnlyForceDowngradeCanary(__goscriptValue: boolean): void {
	testingOnlyForceDowngradeCanary = __goscriptValue
}

export function requiresClientCert(c: ClientAuthType): boolean {
	switch (c) {
		case 2:
		case 4:
		{
			return true
			break
		}
		default:
		{
			return false
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let deprecatedSessionTicketKey: $.Slice<number> = new Uint8Array([68, 69, 80, 82, 69, 67, 65, 84, 69, 68])

export function __goscript_set_deprecatedSessionTicketKey(__goscriptValue: $.Slice<number>): void {
	deprecatedSessionTicketKey = __goscriptValue
}

export let supportedVersions: $.Slice<number> = $.arrayToSlice<number>([$.uint(772, 16), $.uint(771, 16), $.uint(770, 16), $.uint(769, 16)])

export function __goscript_set_supportedVersions(__goscriptValue: $.Slice<number>): void {
	supportedVersions = __goscriptValue
}

export let tls10server: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("tls10server")

export function __goscript_set_tls10server(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	tls10server = __goscriptValue
}

export function supportedVersionsFromMax(maxVersion: number): $.Slice<number> {
	let versions: $.Slice<number> = $.makeSlice<number>(0, $.len(supportedVersions), "number")
	for (let __goscriptRangeTarget11 = supportedVersions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
		let v = __goscriptRangeTarget11![__rangeIndex]
		if ($.uint(v, 16) > $.uint(maxVersion, 16)) {
			continue
		}
		versions = $.append(versions, $.uint(v, 16))
	}
	return versions
}

export let errNoCertificates: $.GoError = errors.New("tls: no certificates configured")

export function __goscript_set_errNoCertificates(__goscriptValue: $.GoError): void {
	errNoCertificates = __goscriptValue
}

export let writerMutex: $.VarRef<sync.Mutex> = $.varRef($.markAsStructValue(new sync.Mutex()))

export function __goscript_set_writerMutex(__goscriptValue: sync.Mutex): void {
	writerMutex.value = __goscriptValue
}

export function NewLRUClientSessionCache(capacity: number): ClientSessionCache | null {
	const defaultSessionCacheCapacity: number = 64

	if (capacity < 1) {
		capacity = 64
	}
	return $.interfaceValue<ClientSessionCache | null>((() => { const __goscriptLiteralField0 = list.New(); return new lruSessionCache({m: $.makeMap<string, list.Element | $.VarRef<list.Element> | null>(), q: __goscriptLiteralField0, capacity: capacity}) })(), "*tls.lruSessionCache", { kind: $.TypeKind.Pointer, elemType: "tls.lruSessionCache" })
}

export let emptyConfig: $.VarRef<Config> = $.varRef($.markAsStructValue(new Config()))

export function __goscript_set_emptyConfig(__goscriptValue: Config): void {
	emptyConfig.value = __goscriptValue
}

export function defaultConfig(): Config | $.VarRef<Config> | null {
	return emptyConfig
}

export function unexpectedMessageError(wanted: any, got: any): $.GoError {
	return fmt.Errorf("tls: received unexpected handshake message of type %T when waiting for %T", got, wanted)
}

export let testingOnlySupportedSignatureAlgorithms: $.Slice<SignatureScheme> = null as $.Slice<SignatureScheme>

export function __goscript_set_testingOnlySupportedSignatureAlgorithms(__goscriptValue: $.Slice<SignatureScheme>): void {
	testingOnlySupportedSignatureAlgorithms = __goscriptValue
}

export function supportedSignatureAlgorithms(minVers: number): $.Slice<SignatureScheme> {
	let sigAlgs: $.Slice<SignatureScheme> = __goscript_defaults.defaultSupportedSignatureAlgorithms()
	if (testingOnlySupportedSignatureAlgorithms != null) {
		sigAlgs = (slices.Clone(testingOnlySupportedSignatureAlgorithms) as $.Slice<SignatureScheme>)
	}
	return (slices.DeleteFunc(sigAlgs, $.functionValue((s: SignatureScheme): boolean => {
		return isDisabledSignatureAlgorithm($.uint(minVers, 16), $.uint(s, 16), false)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<SignatureScheme>)
}

export let tlssha1: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("tlssha1")

export function __goscript_set_tlssha1(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	tlssha1 = __goscriptValue
}

export function isDisabledSignatureAlgorithm(version: number, s: SignatureScheme, isCert: boolean): boolean {
	if (fips140tls.Required() && !slices.Contains(__goscript_defaults_fips140.__goscript_get_allowedSignatureAlgorithmsFIPS(), $.uint(s, 16))) {
		return true
	}

	// For the _cert extension we include all algorithms, including SHA-1 and
	// PKCS#1 v1.5, because it's more likely that something on our side will be
	// willing to accept a *-with-SHA1 certificate (e.g. with a custom
	// VerifyConnection or by a direct match with the CertPool), than that the
	// peer would have a better certificate but is just choosing not to send it.
	// crypto/x509 will refuse to verify important SHA-1 signatures anyway.
	if (isCert) {
		return false
	}

	// TLS 1.3 removed support for PKCS#1 v1.5 and SHA-1 signatures,
	// and Go 1.25 removed support for SHA-1 signatures in TLS 1.2.
	if ($.uint(version, 16) > $.uint(771, 16)) {
		let __goscriptTuple11: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint(s, 16))
		let sigType = $.uint(__goscriptTuple11[0], 8)
		let sigHash = __goscriptTuple11[1]
		if (($.uint(sigType, 8) == $.uint(225, 8)) || (sigHash == crypto.SHA1)) {
			return true
		}
	} else {
		if (!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(tlssha1)), "1")) {
			let [, sigHash, ] = __goscript_auth.typeAndHashFromSignatureScheme($.uint(s, 16))
			if (sigHash == crypto.SHA1) {
				return true
			}
		}
	}

	return false
}

export function supportedSignatureAlgorithmsCert(): $.Slice<SignatureScheme> {
	let sigAlgs: $.Slice<SignatureScheme> = __goscript_defaults.defaultSupportedSignatureAlgorithms()
	return (slices.DeleteFunc(sigAlgs, $.functionValue((s: SignatureScheme): boolean => {
		return isDisabledSignatureAlgorithm($.uint(0, 16), $.uint(s, 16), true)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<SignatureScheme>)
}

export function isSupportedSignatureAlgorithm(sigAlg: SignatureScheme, supportedSignatureAlgorithms: $.Slice<SignatureScheme>): boolean {
	return slices.Contains(supportedSignatureAlgorithms, $.uint(sigAlg, 16))
}

export async function fipsAllowedChains(chains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>): globalThis.Promise<[$.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>, $.GoError]> {
	if (!fips140tls.Required()) {
		return [chains, null]
	}

	let permittedChains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>> = $.makeSlice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>(0, $.len(chains))
	for (let __goscriptRangeTarget12 = chains, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
		let chain = __goscriptRangeTarget12![__rangeIndex]
		if (await fipsAllowChain(chain)) {
			permittedChains = $.append(permittedChains, chain)
		}
	}

	if ($.len(permittedChains) == 0) {
		return [null, errors.New("tls: no FIPS compatible certificate chains found")]
	}

	return [permittedChains, null]
}

export async function fipsAllowChain(chain: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>): globalThis.Promise<boolean> {
	if ($.len(chain) == 0) {
		return false
	}

	for (let __goscriptRangeTarget13 = chain, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget13); __rangeIndex++) {
		let cert = __goscriptRangeTarget13![__rangeIndex]
		if (!await __goscript_defaults_fips140.isCertificateAllowedFIPS(cert)) {
			return false
		}
	}

	return true
}

export async function anyValidVerifiedChain(verifiedChains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>, opts: x509.VerifyOptions): globalThis.Promise<boolean> {
	for (let __goscriptRangeTarget15 = verifiedChains, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget15); __rangeIndex++) {
		let chain = __goscriptRangeTarget15![__rangeIndex]
		if ($.len(chain) == 0) {
			continue
		}
		if (slices.ContainsFunc(chain, $.functionValue((cert: x509.Certificate | $.VarRef<x509.Certificate> | null): boolean => {
			return $.markAsStructValue($.cloneStructValue(opts.CurrentTime)).Before($.markAsStructValue($.cloneStructValue($.pointerValue<x509.Certificate>(cert).NotBefore))) || $.markAsStructValue($.cloneStructValue(opts.CurrentTime)).After($.markAsStructValue($.cloneStructValue($.pointerValue<x509.Certificate>(cert).NotAfter)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))) {
			continue
		}
		// Since we already validated the chain, we only care that it is rooted
		// in a CA in opts.Roots. On platforms where we control chain validation
		// (e.g. not Windows or macOS) this is a simple lookup in the CertPool
		// internal hash map, which we can simulate by running Verify on the
		// root. On other platforms, we have to do full verification again,
		// because EKU handling might differ. We will want to replace this with
		// CertPool.Contains if/once that is available. See go.dev/issue/77376.
		if ((($.stringEqual(runtime.GOOS, "windows")) || ($.stringEqual(runtime.GOOS, "darwin"))) || ($.stringEqual(runtime.GOOS, "ios"))) {
			opts.Intermediates = x509.NewCertPool()
			for (let __goscriptRangeTarget14 = $.goSlice(chain, 1, $.max(1, $.len(chain) - 1)), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget14); __rangeIndex++) {
				let cert = __goscriptRangeTarget14![__rangeIndex]
				await x509.CertPool.prototype.AddCert.call(opts.Intermediates, cert)
			}
			let leaf: x509.Certificate | $.VarRef<x509.Certificate> | null = $.arrayIndex(chain!, 0)
			{
				let [, err] = await x509.Certificate.prototype.Verify.call(leaf, $.markAsStructValue($.cloneStructValue(opts)))
				if (err == null) {
					return true
				}
			}
		} else {
			let root: x509.Certificate | $.VarRef<x509.Certificate> | null = $.arrayIndex(chain!, $.len(chain) - 1)
			{
				let [, err] = await x509.Certificate.prototype.Verify.call(root, $.markAsStructValue($.cloneStructValue(opts)))
				if (err == null) {
					return true
				}
			}
		}
	}
	return false
}
