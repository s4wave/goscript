// Generated file based on handshake_server_tls13.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as hkdf from "@goscript/crypto/hkdf/index.js"

import * as hmac from "@goscript/crypto/hmac/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as fips140tls from "@goscript/crypto/tls/internal/fips140tls/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as hash from "@goscript/hash/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as io from "@goscript/io/index.js"

import * as slices from "@goscript/slices/index.js"

import * as sort from "@goscript/sort/index.js"

import * as time from "@goscript/time/index.js"

import type * as cipher from "@goscript/crypto/cipher/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as big from "@goscript/math/big/index.js"

import * as net from "@goscript/net/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_alert from "./alert.gs.ts"

import * as __goscript_auth from "./auth.gs.ts"

import * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_conn from "./conn.gs.ts"

import * as __goscript_defaults from "./defaults.gs.ts"

import * as __goscript_defaults_fips140 from "./defaults_fips140.gs.ts"

import * as __goscript_ech from "./ech.gs.ts"

import * as __goscript_handshake_client from "./handshake_client.gs.ts"

import * as __goscript_handshake_client_tls13 from "./handshake_client_tls13.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_handshake_server from "./handshake_server.gs.ts"

import * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_quic from "./quic.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/hkdf/index.js"
import "@goscript/crypto/hmac/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/crypto/internal/fips140/tls13/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/tls/internal/fips140tls/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/hash/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/io/index.js"
import "@goscript/slices/index.js"
import "@goscript/sort/index.js"
import "@goscript/time/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/math/big/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "./alert.gs.ts"
import "./auth.gs.ts"
import "./cipher_suites.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./conn.gs.ts"
import "./defaults.gs.ts"
import "./defaults_fips140.gs.ts"
import "./ech.gs.ts"
import "./handshake_client.gs.ts"
import "./handshake_client_tls13.gs.ts"
import "./handshake_messages.gs.ts"
import "./handshake_server.gs.ts"
import "./key_schedule.gs.ts"
import "./quic.gs.ts"
import "./ticket.gs.ts"

export class echServerContext {
	public get hpkeContext(): hpke.Recipient | $.VarRef<hpke.Recipient> | null {
		return this._fields.hpkeContext.value
	}
	public set hpkeContext(value: hpke.Recipient | $.VarRef<hpke.Recipient> | null) {
		this._fields.hpkeContext.value = value
	}

	public get configID(): number {
		return this._fields.configID.value
	}
	public set configID(value: number) {
		this._fields.configID.value = value
	}

	public get ciphersuite(): __goscript_ech.echCipher {
		return this._fields.ciphersuite.value
	}
	public set ciphersuite(value: __goscript_ech.echCipher) {
		this._fields.ciphersuite.value = value
	}

	public get transcript(): hash.Hash | null {
		return this._fields.transcript.value
	}
	public set transcript(value: hash.Hash | null) {
		this._fields.transcript.value = value
	}

	// inner indicates that the initial client_hello we received contained an
	// encrypted_client_hello extension that indicated it was an "inner" hello.
	// We don't do any additional processing of the hello in this case, so all
	// fields above are unset.
	public get inner(): boolean {
		return this._fields.inner.value
	}
	public set inner(value: boolean) {
		this._fields.inner.value = value
	}

	public _fields: {
		hpkeContext: $.VarRef<hpke.Recipient | $.VarRef<hpke.Recipient> | null>
		configID: $.VarRef<number>
		ciphersuite: $.VarRef<__goscript_ech.echCipher>
		transcript: $.VarRef<hash.Hash | null>
		inner: $.VarRef<boolean>
	}

	constructor(init?: Partial<{hpkeContext?: hpke.Recipient | $.VarRef<hpke.Recipient> | null, configID?: number, ciphersuite?: __goscript_ech.echCipher, transcript?: hash.Hash | null, inner?: boolean}>) {
		this._fields = {
			hpkeContext: $.varRef(init?.hpkeContext ?? (null as hpke.Recipient | $.VarRef<hpke.Recipient> | null)),
			configID: $.varRef(init?.configID ?? (0 as number)),
			ciphersuite: $.varRef(init?.ciphersuite ? $.markAsStructValue($.cloneStructValue(init.ciphersuite)) : $.markAsStructValue(new __goscript_ech.echCipher())),
			transcript: $.varRef(init?.transcript ?? (null as hash.Hash | null)),
			inner: $.varRef(init?.inner ?? (false as boolean))
		}
	}

	public clone(): echServerContext {
		const cloned = new echServerContext()
		cloned._fields = {
			hpkeContext: $.varRef(this._fields.hpkeContext.value),
			configID: $.varRef(this._fields.configID.value),
			ciphersuite: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ciphersuite.value))),
			transcript: $.varRef(this._fields.transcript.value),
			inner: $.varRef(this._fields.inner.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.echServerContext",
		() => new echServerContext(),
		[],
		echServerContext,
		[{ name: "hpkeContext", key: "hpkeContext", type: { kind: $.TypeKind.Pointer, elemType: "hpke.Recipient" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "configID", key: "configID", type: { kind: $.TypeKind.Basic, name: "uint8" }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "ciphersuite", key: "ciphersuite", type: "tls.echCipher", pkgPath: "crypto/tls", index: [2], offset: 10, exported: false }, { name: "transcript", key: "transcript", type: "hash.Hash", pkgPath: "crypto/tls", index: [3], offset: 16, exported: false }, { name: "inner", key: "inner", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [4], offset: 32, exported: false }]
	)
}

export class serverHandshakeStateTLS13 {
	public get c(): __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null {
		return this._fields.c.value
	}
	public set c(value: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null) {
		this._fields.c.value = value
	}

	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	public get clientHello(): __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null {
		return this._fields.clientHello.value
	}
	public set clientHello(value: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null) {
		this._fields.clientHello.value = value
	}

	public get hello(): __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null {
		return this._fields.hello.value
	}
	public set hello(value: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null) {
		this._fields.hello.value = value
	}

	public get sentDummyCCS(): boolean {
		return this._fields.sentDummyCCS.value
	}
	public set sentDummyCCS(value: boolean) {
		this._fields.sentDummyCCS.value = value
	}

	public get usingPSK(): boolean {
		return this._fields.usingPSK.value
	}
	public set usingPSK(value: boolean) {
		this._fields.usingPSK.value = value
	}

	public get earlyData(): boolean {
		return this._fields.earlyData.value
	}
	public set earlyData(value: boolean) {
		this._fields.earlyData.value = value
	}

	public get suite(): __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null {
		return this._fields.suite.value
	}
	public set suite(value: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null) {
		this._fields.suite.value = value
	}

	public get cert(): __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null {
		return this._fields.cert.value
	}
	public set cert(value: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null) {
		this._fields.cert.value = value
	}

	public get sigAlg(): __goscript_common.SignatureScheme {
		return this._fields.sigAlg.value
	}
	public set sigAlg(value: __goscript_common.SignatureScheme) {
		this._fields.sigAlg.value = value
	}

	public get earlySecret(): tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null {
		return this._fields.earlySecret.value
	}
	public set earlySecret(value: tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null) {
		this._fields.earlySecret.value = value
	}

	public get sharedKey(): $.Slice<number> {
		return this._fields.sharedKey.value
	}
	public set sharedKey(value: $.Slice<number>) {
		this._fields.sharedKey.value = value
	}

	public get handshakeSecret(): tls13.HandshakeSecret | $.VarRef<tls13.HandshakeSecret> | null {
		return this._fields.handshakeSecret.value
	}
	public set handshakeSecret(value: tls13.HandshakeSecret | $.VarRef<tls13.HandshakeSecret> | null) {
		this._fields.handshakeSecret.value = value
	}

	public get masterSecret(): tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null {
		return this._fields.masterSecret.value
	}
	public set masterSecret(value: tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null) {
		this._fields.masterSecret.value = value
	}

	public get trafficSecret(): $.Slice<number> {
		return this._fields.trafficSecret.value
	}
	public set trafficSecret(value: $.Slice<number>) {
		this._fields.trafficSecret.value = value
	}

	public get transcript(): hash.Hash | null {
		return this._fields.transcript.value
	}
	public set transcript(value: hash.Hash | null) {
		this._fields.transcript.value = value
	}

	public get clientFinished(): $.Slice<number> {
		return this._fields.clientFinished.value
	}
	public set clientFinished(value: $.Slice<number>) {
		this._fields.clientFinished.value = value
	}

	public get echContext(): echServerContext | $.VarRef<echServerContext> | null {
		return this._fields.echContext.value
	}
	public set echContext(value: echServerContext | $.VarRef<echServerContext> | null) {
		this._fields.echContext.value = value
	}

	public _fields: {
		c: $.VarRef<__goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null>
		ctx: $.VarRef<context.Context | null>
		clientHello: $.VarRef<__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null>
		hello: $.VarRef<__goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null>
		sentDummyCCS: $.VarRef<boolean>
		usingPSK: $.VarRef<boolean>
		earlyData: $.VarRef<boolean>
		suite: $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null>
		cert: $.VarRef<__goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null>
		sigAlg: $.VarRef<__goscript_common.SignatureScheme>
		earlySecret: $.VarRef<tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null>
		sharedKey: $.VarRef<$.Slice<number>>
		handshakeSecret: $.VarRef<tls13.HandshakeSecret | $.VarRef<tls13.HandshakeSecret> | null>
		masterSecret: $.VarRef<tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null>
		trafficSecret: $.VarRef<$.Slice<number>>
		transcript: $.VarRef<hash.Hash | null>
		clientFinished: $.VarRef<$.Slice<number>>
		echContext: $.VarRef<echServerContext | $.VarRef<echServerContext> | null>
	}

	constructor(init?: Partial<{c?: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, ctx?: context.Context | null, clientHello?: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, hello?: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null, sentDummyCCS?: boolean, usingPSK?: boolean, earlyData?: boolean, suite?: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null, cert?: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, sigAlg?: __goscript_common.SignatureScheme, earlySecret?: tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null, sharedKey?: $.Slice<number>, handshakeSecret?: tls13.HandshakeSecret | $.VarRef<tls13.HandshakeSecret> | null, masterSecret?: tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null, trafficSecret?: $.Slice<number>, transcript?: hash.Hash | null, clientFinished?: $.Slice<number>, echContext?: echServerContext | $.VarRef<echServerContext> | null}>) {
		this._fields = {
			c: $.varRef(init?.c ?? (null as __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null)),
			ctx: $.varRef(init?.ctx ?? (null as context.Context | null)),
			clientHello: $.varRef(init?.clientHello ?? (null as __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null)),
			hello: $.varRef(init?.hello ?? (null as __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null)),
			sentDummyCCS: $.varRef(init?.sentDummyCCS ?? (false as boolean)),
			usingPSK: $.varRef(init?.usingPSK ?? (false as boolean)),
			earlyData: $.varRef(init?.earlyData ?? (false as boolean)),
			suite: $.varRef(init?.suite ?? (null as __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null)),
			cert: $.varRef(init?.cert ?? (null as __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null)),
			sigAlg: $.varRef(init?.sigAlg ?? (0 as __goscript_common.SignatureScheme)),
			earlySecret: $.varRef(init?.earlySecret ?? (null as tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null)),
			sharedKey: $.varRef(init?.sharedKey ?? (null as $.Slice<number>)),
			handshakeSecret: $.varRef(init?.handshakeSecret ?? (null as tls13.HandshakeSecret | $.VarRef<tls13.HandshakeSecret> | null)),
			masterSecret: $.varRef(init?.masterSecret ?? (null as tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null)),
			trafficSecret: $.varRef(init?.trafficSecret ?? (null as $.Slice<number>)),
			transcript: $.varRef(init?.transcript ?? (null as hash.Hash | null)),
			clientFinished: $.varRef(init?.clientFinished ?? (null as $.Slice<number>)),
			echContext: $.varRef(init?.echContext ?? (null as echServerContext | $.VarRef<echServerContext> | null))
		}
	}

	public clone(): serverHandshakeStateTLS13 {
		const cloned = new serverHandshakeStateTLS13()
		cloned._fields = {
			c: $.varRef(this._fields.c.value),
			ctx: $.varRef(this._fields.ctx.value),
			clientHello: $.varRef(this._fields.clientHello.value),
			hello: $.varRef(this._fields.hello.value),
			sentDummyCCS: $.varRef(this._fields.sentDummyCCS.value),
			usingPSK: $.varRef(this._fields.usingPSK.value),
			earlyData: $.varRef(this._fields.earlyData.value),
			suite: $.varRef(this._fields.suite.value),
			cert: $.varRef(this._fields.cert.value),
			sigAlg: $.varRef(this._fields.sigAlg.value),
			earlySecret: $.varRef(this._fields.earlySecret.value),
			sharedKey: $.varRef(this._fields.sharedKey.value),
			handshakeSecret: $.varRef(this._fields.handshakeSecret.value),
			masterSecret: $.varRef(this._fields.masterSecret.value),
			trafficSecret: $.varRef(this._fields.trafficSecret.value),
			transcript: $.varRef(this._fields.transcript.value),
			clientFinished: $.varRef(this._fields.clientFinished.value),
			echContext: $.varRef(this._fields.echContext.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async checkForResumption(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).SessionTicketsDisabled) {
			return null
		}

		let modeOK = false
		for (let __goscriptRangeTarget0 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).pskModes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let mode = __goscriptRangeTarget0![__rangeIndex]
			if ($.uint(mode, 8) == $.uint(1, 8)) {
				modeOK = true
				break
			}
		}
		if (!modeOK) {
			return null
		}

		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).pskIdentities) != $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).pskBinders)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: invalid or missing PSK binders")
		}
		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).pskIdentities) == 0) {
			return null
		}

		for (let __goscriptRangeTarget1 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).pskIdentities, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			let identity = __goscriptRangeTarget1![i]
			if (i >= 5) {
				break
			}

			let sessionState: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = null as __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null
			if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).UnwrapSession != null) {
				let err: $.GoError = null as $.GoError
				let __goscriptTuple0: any = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).UnwrapSession!(identity.label, $.markAsStructValue($.cloneStructValue(__goscript_conn.Conn.prototype.connectionStateLocked.call(c))))
				sessionState = __goscriptTuple0[0]
				err = __goscriptTuple0[1]
				if (err != null) {
					return err
				}
				if (sessionState == null) {
					continue
				}
			} else {
				let plaintext: $.Slice<number> = await __goscript_common.Config.prototype.decryptTicket.call($.pointerValue<__goscript_conn.Conn>(c).config, identity.label, $.pointerValue<__goscript_conn.Conn>(c).ticketKeys)
				if (plaintext == null) {
					continue
				}
				let err: $.GoError = null as $.GoError
				let __goscriptTuple1: any = await __goscript_ticket.ParseSessionState(plaintext)
				sessionState = __goscriptTuple1[0]
				err = __goscriptTuple1[1]
				if (err != null) {
					continue
				}
			}

			if ($.uint($.pointerValue<__goscript_ticket.SessionState>(sessionState).version, 16) != $.uint(772, 16)) {
				continue
			}

			let createdAt = $.markAsStructValue($.cloneStructValue(time.Unix($.int64($.pointerValue<__goscript_ticket.SessionState>(sessionState).createdAt), 0n)))
			if ($.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<__goscript_conn.Conn>(c).config)))).Sub($.markAsStructValue($.cloneStructValue(createdAt))) > 604800000000000n) {
				continue
			}

			let pskSuite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint($.pointerValue<__goscript_ticket.SessionState>(sessionState).cipherSuite, 16))
			if ((pskSuite == null) || ($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(pskSuite).hash != $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash)) {
				continue
			}

			// PSK connections don't re-establish client certificates, but carry
			// them over in the session ticket. Ensure the presence of client certs
			// in the ticket is consistent with the configured requirements.
			let sessionHasClientCerts = $.len($.pointerValue<__goscript_ticket.SessionState>(sessionState).peerCertificates) != 0
			let needClientCerts = __goscript_common.requiresClientCert($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth)
			if (needClientCerts && !sessionHasClientCerts) {
				continue
			}
			if (sessionHasClientCerts && ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth == 0)) {
				continue
			}
			if (sessionHasClientCerts && $.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<__goscript_conn.Conn>(c).config)))).After($.markAsStructValue($.cloneStructValue($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_ticket.SessionState>(sessionState).peerCertificates!, 0)).NotAfter)))) {
				continue
			}
			let opts = (await (async () => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue(await __goscript_common.Config.prototype.time.call($.pointerValue<__goscript_conn.Conn>(c).config))); return $.markAsStructValue(new x509.VerifyOptions({CurrentTime: __goscriptLiteralField0, Roots: $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientCAs, KeyUsages: $.arrayToSlice<x509.ExtKeyUsage>([x509.ExtKeyUsageClientAuth])})) })())
			if ((sessionHasClientCerts && ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth >= 3)) && !await __goscript_common.anyValidVerifiedChain($.pointerValue<__goscript_ticket.SessionState>(sessionState).verifiedChains, $.markAsStructValue($.cloneStructValue(opts)))) {
				continue
			}

			if (($.pointerValue<__goscript_conn.Conn>(c).quic != null) && $.pointerValue<__goscript_quic.quicState>($.pointerValue<__goscript_conn.Conn>(c).quic).enableSessionEvents) {
				{
					let err = await __goscript_conn.Conn.prototype.quicResumeSession.call(c, sessionState)
					if (err != null) {
						return err
					}
				}
			}

			$.pointerValue<serverHandshakeStateTLS13>(hs).earlySecret = await tls13.NewEarlySecret(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), $.pointerValue<__goscript_ticket.SessionState>(sessionState).secret)
			let binderKey: $.Slice<number> = await tls13.EarlySecret.prototype.ResumptionBinderKey.call($.pointerValue<serverHandshakeStateTLS13>(hs).earlySecret)
			// Clone the transcript in case a HelloRetryRequest was recorded.
			let transcript = await cloneHash($.pointerValue<serverHandshakeStateTLS13>(hs).transcript, $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash)
			if (transcript == null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return errors.New("tls: internal error: failed to clone hash")
			}
			let __goscriptTuple2: any = await __goscript_handshake_messages.clientHelloMsg.prototype.marshalWithoutBinders.call($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello)
			let clientHelloBytes: $.Slice<number> = __goscriptTuple2[0]
			let err = __goscriptTuple2[1]
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return err
			}
			await $.pointerValue<Exclude<hash.Hash, null>>(transcript).Write(clientHelloBytes)
			let pskBinder: $.Slice<number> = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.finishedHash.call($.pointerValue<serverHandshakeStateTLS13>(hs).suite, binderKey, transcript)
			if (!hmac.Equal($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).pskBinders!, i), pskBinder)) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(51, 8))
				return errors.New("tls: invalid PSK binder")
			}

			if (((((($.pointerValue<__goscript_conn.Conn>(c).quic != null) && $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).earlyData) && (i == 0)) && $.pointerValue<__goscript_ticket.SessionState>(sessionState).EarlyData) && ($.uint($.pointerValue<__goscript_ticket.SessionState>(sessionState).cipherSuite, 16) == $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).id, 16))) && ($.stringEqual($.pointerValue<__goscript_ticket.SessionState>(sessionState).alpnProtocol, $.pointerValue<__goscript_conn.Conn>(c).clientProtocol))) {
				$.pointerValue<serverHandshakeStateTLS13>(hs).earlyData = true

				let __goscriptShadow0 = await crypto.Hash_New($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash)
				{
					let __goscriptShadow1 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), (__goscriptShadow0 as __goscript_handshake_messages.transcriptHash | null))
					if (__goscriptShadow1 != null) {
						return __goscriptShadow1
					}
				}
				let earlyTrafficSecret: $.Slice<number> = await tls13.EarlySecret.prototype.ClientEarlyTrafficSecret.call($.pointerValue<serverHandshakeStateTLS13>(hs).earlySecret, __goscriptShadow0)
				{
					let __goscriptShadow2 = await __goscript_conn.Conn.prototype.quicSetReadSecret.call(c, 1, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).id, 16), earlyTrafficSecret)
					if (__goscriptShadow2 != null) {
						return __goscriptShadow2
					}
				}
			}

			$.pointerValue<__goscript_conn.Conn>(c).didResume = true
			$.pointerValue<__goscript_conn.Conn>(c).peerCertificates = $.pointerValue<__goscript_ticket.SessionState>(sessionState).peerCertificates
			$.pointerValue<__goscript_conn.Conn>(c).ocspResponse = $.pointerValue<__goscript_ticket.SessionState>(sessionState).ocspResponse
			$.pointerValue<__goscript_conn.Conn>(c).scts = $.pointerValue<__goscript_ticket.SessionState>(sessionState).scts
			$.pointerValue<__goscript_conn.Conn>(c).verifiedChains = $.pointerValue<__goscript_ticket.SessionState>(sessionState).verifiedChains

			$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).selectedIdentityPresent = true
			$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).selectedIdentity = $.uint($.uint(i, 16), 16)
			$.pointerValue<serverHandshakeStateTLS13>(hs).usingPSK = true
			return null
		}

		return null
	}

	public async doHelloRetryRequest(selectedGroup: __goscript_common.CurveID): globalThis.Promise<[__goscript_common.keyShare | $.VarRef<__goscript_common.keyShare> | null, $.GoError]> {
		let hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		// Make sure the client didn't send extra handshake messages alongside
		// their initial client_hello. If they sent two client_hello messages,
		// we will consume the second before they respond to the server_hello.
		if ($.pointerValue<__goscript_conn.Conn>(c).hand.Len() != 0) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return [null, errors.New("tls: handshake buffer not empty before HelloRetryRequest")]
		}

		// The first ClientHello gets double-hashed into the transcript upon a
		// HelloRetryRequest. See RFC 8446, Section 4.4.1.
		{
			let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return [null, err]
			}
		}
		let chHash: $.Slice<number> = await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<serverHandshakeStateTLS13>(hs).transcript).Sum(null)
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<serverHandshakeStateTLS13>(hs).transcript).Reset()
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<serverHandshakeStateTLS13>(hs).transcript).Write(new Uint8Array([254, 0, 0, $.uint($.len(chHash), 8)]) as $.Slice<number>)
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<serverHandshakeStateTLS13>(hs).transcript).Write(chHash)

		let helloRetryRequest: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null = new __goscript_handshake_messages.serverHelloMsg({vers: $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).vers, 16), random: __goscript_common.helloRetryRequestRandom, sessionId: $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).sessionId, cipherSuite: $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).cipherSuite, 16), compressionMethod: $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).compressionMethod, 8), supportedVersion: $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).supportedVersion, 16), selectedGroup: $.uint(selectedGroup, 16)})

		if ($.pointerValue<serverHandshakeStateTLS13>(hs).echContext != null) {
			// Compute the acceptance message.
			$.pointerValue<__goscript_handshake_messages.serverHelloMsg>(helloRetryRequest).encryptedClientHello = $.makeSlice<number>(8, undefined, "byte")
			let confTranscript = await cloneHash($.pointerValue<serverHandshakeStateTLS13>(hs).transcript, $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash)
			{
				let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(helloRetryRequest, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), (confTranscript as __goscript_handshake_messages.transcriptHash | null))
				if (err != null) {
					return [null, err]
				}
			}
			let h: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null = $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo))
			let __goscriptTuple3: any = await hkdf.Extract(undefined, h, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).random, null)
			let prf: $.Slice<number> = __goscriptTuple3[0]
			let err = __goscriptTuple3[1]
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return [null, err]
			}
			let acceptConfirmation: $.Slice<number> = await tls13.ExpandLabel(undefined, h, prf, "hrr ech accept confirmation", await $.pointerValue<Exclude<hash.Hash, null>>(confTranscript).Sum(null), 8)
			$.pointerValue<__goscript_handshake_messages.serverHelloMsg>(helloRetryRequest).encryptedClientHello = acceptConfirmation
		}

		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(helloRetryRequest, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return [null, err]
			}
		}

		{
			let err = await serverHandshakeStateTLS13.prototype.sendDummyChangeCipherSpec.call(hs)
			if (err != null) {
				return [null, err]
			}
		}

		// clientHelloMsg is not included in the transcript.
		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, null)
		if (err != null) {
			return [null, err]
		}

		let __goscriptTuple4: any = $.typeAssertTuple<__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" })
		let clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = __goscriptTuple4[0]
		let ok = __goscriptTuple4[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return [null, __goscript_common.unexpectedMessageError($.interfaceValue<any>(clientHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), msg)]
		}

		if ($.pointerValue<serverHandshakeStateTLS13>(hs).echContext != null) {
			if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).encryptedClientHello) == 0) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(109, 8))
				return [null, errors.New("tls: second client hello missing encrypted client hello extension")]
			}

			let __goscriptTuple5: any = __goscript_ech.parseECHExt($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).encryptedClientHello)
			let echType = $.uint(__goscriptTuple5[0], 8)
			let echCiphersuite = __goscriptTuple5[1]
			let configID = $.uint(__goscriptTuple5[2], 8)
			let encap: $.Slice<number> = __goscriptTuple5[3]
			let payload: $.Slice<number> = __goscriptTuple5[4]
			let __goscriptShadow3 = __goscriptTuple5[5]
			if (__goscriptShadow3 != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(50, 8))
				return [null, errors.New("tls: client sent invalid encrypted client hello extension")]
			}

			if ((($.uint(echType, 8) == $.uint(0, 8)) && $.pointerValue<echServerContext>($.pointerValue<serverHandshakeStateTLS13>(hs).echContext).inner) || (($.uint(echType, 8) == $.uint(1, 8)) && !$.pointerValue<echServerContext>($.pointerValue<serverHandshakeStateTLS13>(hs).echContext).inner)) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(50, 8))
				return [null, errors.New("tls: unexpected switch in encrypted client hello extension type")]
			}

			if ($.uint(echType, 8) == $.uint(0, 8)) {
				if (((!$.comparableEqual(echCiphersuite, $.pointerValue<echServerContext>($.pointerValue<serverHandshakeStateTLS13>(hs).echContext).ciphersuite)) || ($.uint(configID, 8) != $.uint($.pointerValue<echServerContext>($.pointerValue<serverHandshakeStateTLS13>(hs).echContext).configID, 8))) || ($.len(encap) != 0)) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
					return [null, errors.New("tls: second client hello encrypted client hello extension does not match")]
				}

				let __goscriptTuple6: any = await __goscript_ech.decryptECHPayload($.pointerValue<echServerContext>($.pointerValue<serverHandshakeStateTLS13>(hs).echContext).hpkeContext, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).original, payload)
				let encodedInner: $.Slice<number> = __goscriptTuple6[0]
				let __goscriptShadow4 = __goscriptTuple6[1]
				if (__goscriptShadow4 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(51, 8))
					return [null, errors.New("tls: failed to decrypt second client hello encrypted client hello extension payload")]
				}

				let __goscriptTuple7: any = await __goscript_ech.decodeInnerClientHello(clientHello, encodedInner)
				let echInner: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = __goscriptTuple7[0]
				__goscriptShadow4 = __goscriptTuple7[1]
				if (__goscriptShadow4 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
					return [null, errors.New("tls: client sent invalid encrypted client hello extension")]
				}

				clientHello = echInner
			}
		}

		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).keyShares) != 1) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return [null, errors.New("tls: client didn't send one key share in second ClientHello")]
		}
		let ks: __goscript_common.keyShare | $.VarRef<__goscript_common.keyShare> | null = $.indexRef($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).keyShares!, 0)

		if ($.uint($.pointerValue<__goscript_common.keyShare>(ks).group, 16) != $.uint(selectedGroup, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return [null, errors.New("tls: client sent unexpected key share in second ClientHello")]
		}

		if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).earlyData) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return [null, errors.New("tls: client indicated early data in second ClientHello")]
		}

		if (illegalClientHelloChange(clientHello, $.pointerValue<serverHandshakeStateTLS13>(hs).clientHello)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return [null, errors.New("tls: client illegally modified second ClientHello")]
		}

		$.pointerValue<__goscript_conn.Conn>(c).didHRR = true
		$.pointerValue<serverHandshakeStateTLS13>(hs).clientHello = clientHello
		return [ks, null]
	}

	public async handshake(): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		// For an overview of the TLS 1.3 handshake, see RFC 8446, Section 2.
		{
			let err = await serverHandshakeStateTLS13.prototype.processClientHello.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await serverHandshakeStateTLS13.prototype.checkForResumption.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await serverHandshakeStateTLS13.prototype.pickCertificate.call(hs)
			if (err != null) {
				return err
			}
		}
		$.pointerValue<__goscript_conn.Conn>(c).buffering = true
		{
			let err = await serverHandshakeStateTLS13.prototype.sendServerParameters.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await serverHandshakeStateTLS13.prototype.sendServerCertificate.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await serverHandshakeStateTLS13.prototype.sendServerFinished.call(hs)
			if (err != null) {
				return err
			}
		}
		// Note that at this point we could start sending application data without
		// waiting for the client's second flight, but the application might not
		// expect the lack of replay protection of the ClientHello parameters.
		{
			let [, err] = await __goscript_conn.Conn.prototype.flush.call(c)
			if (err != null) {
				return err
			}
		}
		{
			let err = await serverHandshakeStateTLS13.prototype.readClientCertificate.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await serverHandshakeStateTLS13.prototype.readClientFinished.call(hs)
			if (err != null) {
				return err
			}
		}

		$.pointerValue<__goscript_conn.Conn>(c).isHandshakeComplete.Store(true)

		return null
	}

	public async pickCertificate(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		// Only one of PSK and certificates are used at a time.
		if ($.pointerValue<serverHandshakeStateTLS13>(hs).usingPSK) {
			return null
		}

		// signature_algorithms is required in TLS 1.3. See RFC 8446, Section 4.2.3.
		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).supportedSignatureAlgorithms) == 0) {
			return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(109, 8))
		}

		let __goscriptTuple8: any = await __goscript_common.Config.prototype.getCertificate.call($.pointerValue<__goscript_conn.Conn>(c).config, __goscript_handshake_server.clientHelloInfo($.pointerValue<serverHandshakeStateTLS13>(hs).ctx, c, $.pointerValue<serverHandshakeStateTLS13>(hs).clientHello))
		let certificate: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null = __goscriptTuple8[0]
		let err = __goscriptTuple8[1]
		if (err != null) {
			if ($.comparableEqual(err, __goscript_common.errNoCertificates)) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(112, 8))
			} else {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			}
			return err
		}
		let __goscriptTuple9: any = await __goscript_auth.selectSignatureScheme($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), certificate, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).supportedSignatureAlgorithms)
		$.pointerValue<serverHandshakeStateTLS13>(hs).sigAlg = $.uint(__goscriptTuple9[0], 16)
		err = __goscriptTuple9[1]
		if (err != null) {
			// getCertificate returned a certificate that is unsupported or
			// incompatible with the client's signature algorithms.
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return err
		}
		$.pointerValue<serverHandshakeStateTLS13>(hs).cert = certificate

		return null
	}

	public async processClientHello(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		$.pointerValue<serverHandshakeStateTLS13>(hs).hello = new __goscript_handshake_messages.serverHelloMsg()

		// TLS 1.3 froze the ServerHello.legacy_version field, and uses
		// supported_versions instead. See RFC 8446, sections 4.1.3 and 4.2.1.
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).vers = $.uint(771, 16)
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).supportedVersion = $.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16)

		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).supportedVersions) == 0) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: client used the legacy version field to negotiate TLS 1.3")
		}

		// Abort if the client is doing a fallback and landing lower than what we
		// support. See RFC 7507, which however does not specify the interaction
		// with supported_versions. The only difference is that with
		// supported_versions a client has a chance to attempt a [TLS 1.2, TLS 1.4]
		// handshake in case TLS 1.3 is broken but 1.2 is not. Alas, in that case,
		// it will have to drop the TLS_FALLBACK_SCSV protection if it falls back to
		// TLS 1.2, because a TLS 1.3 server would abort here. The situation before
		// supported_versions was not better because there was just no way to do a
		// TLS 1.4 handshake without risking the server selecting TLS 1.3.
		for (let __goscriptRangeTarget2 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).cipherSuites, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let id = __goscriptRangeTarget2![__rangeIndex]
			if ($.uint(id, 16) == $.uint(22016, 16)) {
				// Use c.vers instead of max(supported_versions) because an attacker
				// could defeat this by adding an arbitrary high version otherwise.
				if ($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16) < $.uint(__goscript_common.Config.prototype.maxSupportedVersion.call($.pointerValue<__goscript_conn.Conn>(c).config, false), 16)) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(86, 8))
					return errors.New("tls: client using inappropriate protocol fallback")
				}
				break
			}
		}

		if (($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).compressionMethods) != 1) || ($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).compressionMethods!, 0), 8) != $.uint(0, 8))) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: TLS 1.3 client supports illegal compression methods")
		}

		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).random = $.makeSlice<number>(32, undefined, "byte")
		{
			let [, err] = await io.ReadFull($.pointerValueOrNil(__goscript_common.Config.prototype.rand.call($.pointerValue<__goscript_conn.Conn>(c).config))!, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).random)
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return err
			}
		}

		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).secureRenegotiation) != 0) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return errors.New("tls: initial handshake had non-empty renegotiation extension")
		}

		if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).earlyData && ($.pointerValue<__goscript_conn.Conn>(c).quic != null)) {
			if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).pskIdentities) == 0) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
				return errors.New("tls: early_data without pre_shared_key")
			}
		} else {
			if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).earlyData) {
				// See RFC 8446, Section 4.2.10 for the complicated behavior required
				// here. The scenario is that a different server at our address offered
				// to accept early data in the past, which we can't handle. For now, all
				// 0-RTT enabled session tickets need to expire before a Go server can
				// replace a server or join a pool. That's the same requirement that
				// applies to mixing or replacing with any TLS 1.2 server.
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
				return errors.New("tls: client sent unexpected early data")
			}
		}

		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).sessionId = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).sessionId
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).compressionMethod = $.uint(0, 8)

		let preferenceList: $.Slice<number> = __goscript_defaults.__goscript_get_defaultCipherSuitesTLS13()
		if (!__goscript_cipher_suites.hasAESGCMHardwareSupport || !__goscript_cipher_suites.isAESGCMPreferred($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).cipherSuites)) {
			preferenceList = __goscript_defaults.__goscript_get_defaultCipherSuitesTLS13NoAES()
		}
		if (fips140tls.Required()) {
			preferenceList = __goscript_defaults_fips140.__goscript_get_allowedCipherSuitesTLS13FIPS()
		}
		for (let __goscriptRangeTarget3 = preferenceList, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let suiteID = __goscriptRangeTarget3![__rangeIndex]
			$.pointerValue<serverHandshakeStateTLS13>(hs).suite = __goscript_cipher_suites.mutualCipherSuiteTLS13($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).cipherSuites, $.uint(suiteID, 16))
			if ($.pointerValue<serverHandshakeStateTLS13>(hs).suite != null) {
				break
			}
		}
		if ($.pointerValue<serverHandshakeStateTLS13>(hs).suite == null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return fmt.Errorf("tls: no cipher suite supported by both client and server; client offered: %x", $.interfaceValue<any>($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).cipherSuites, "[]uint16", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }))
		}
		$.pointerValue<__goscript_conn.Conn>(c).cipherSuite = $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).id, 16)
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).cipherSuite = $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).id, 16)
		$.pointerValue<serverHandshakeStateTLS13>(hs).transcript = await crypto.Hash_New($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash)

		// First, if a post-quantum key exchange is available, use one. See
		// draft-ietf-tls-key-share-prediction-01, Section 4 for why this must be
		// first.
		//
		// Second, if the client sent a key share for a group we support, use that,
		// to avoid a HelloRetryRequest round-trip.
		//
		// Finally, pick in our fixed preference order.
		let preferredGroups: $.Slice<__goscript_common.CurveID> = __goscript_common.Config.prototype.curvePreferences.call($.pointerValue<__goscript_conn.Conn>(c).config, $.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16))
		preferredGroups = (slices.DeleteFunc(preferredGroups, $.functionValue((group: __goscript_common.CurveID): boolean => {
			return !slices.Contains($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).supportedCurves, $.uint(group, 16))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<__goscript_common.CurveID>)
		if ($.len(preferredGroups) == 0) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return errors.New("tls: no key exchanges supported by both client and server")
		}
		let hasKeyShare: ((group: __goscript_common.CurveID) => boolean | globalThis.Promise<boolean>) | null = $.functionValue((group: __goscript_common.CurveID): boolean => {
			for (let __goscriptRangeTarget4 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).keyShares, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
				let ks = __goscriptRangeTarget4![__rangeIndex]
				if ($.uint(ks.group, 16) == $.uint(group, 16)) {
					return true
				}
			}
			return false
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))
		await sort.SliceStable($.interfaceValue<any>(preferredGroups, "[]tls.CurveID", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" } }), $.functionValue(async (i: number, j: number): globalThis.Promise<boolean> => {
			return await hasKeyShare!($.uint($.arrayIndex(preferredGroups!, i), 16)) && !await hasKeyShare!($.uint($.arrayIndex(preferredGroups!, j), 16))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
		await sort.SliceStable($.interfaceValue<any>(preferredGroups, "[]tls.CurveID", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" } }), $.functionValue((i: number, j: number): boolean => {
			return __goscript_common.isPQKeyExchange($.uint($.arrayIndex(preferredGroups!, i), 16)) && !__goscript_common.isPQKeyExchange($.uint($.arrayIndex(preferredGroups!, j), 16))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
		let selectedGroup = $.uint($.arrayIndex(preferredGroups!, 0), 16)

		let clientKeyShare: __goscript_common.keyShare | $.VarRef<__goscript_common.keyShare> | null = null as __goscript_common.keyShare | $.VarRef<__goscript_common.keyShare> | null
		for (let __goscriptRangeTarget5 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).keyShares, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
			let ks = $.varRef(__goscriptRangeTarget5![__rangeIndex])
			if ($.uint(ks.value.group, 16) == $.uint(selectedGroup, 16)) {
				clientKeyShare = ks
				break
			}
		}
		if (clientKeyShare == null) {
			let __goscriptTuple10: any = await serverHandshakeStateTLS13.prototype.doHelloRetryRequest.call(hs, $.uint(selectedGroup, 16))
			let ks: __goscript_common.keyShare | $.VarRef<__goscript_common.keyShare> | null = __goscriptTuple10[0]
			let err = __goscriptTuple10[1]
			if (err != null) {
				return err
			}
			clientKeyShare = ks
		}
		$.pointerValue<__goscript_conn.Conn>(c).curveID = $.uint(selectedGroup, 16)

		let [ke, err] = __goscript_key_schedule.keyExchangeForCurveID($.uint(selectedGroup, 16))
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return errors.New("tls: CurvePreferences includes unsupported curve")
		}
		let __goscriptTuple11: any = await $.pointerValue<Exclude<__goscript_key_schedule.keyExchange, null>>(ke).serverSharedSecret(__goscript_common.Config.prototype.rand.call($.pointerValue<__goscript_conn.Conn>(c).config), $.pointerValue<__goscript_common.keyShare>(clientKeyShare).data)
		$.pointerValue<serverHandshakeStateTLS13>(hs).sharedKey = __goscriptTuple11[0]
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).serverShare = __goscriptTuple11[1]
		err = __goscriptTuple11[2]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: invalid client key share")
		}

		let __goscriptTuple12: any = __goscript_handshake_server.negotiateALPN($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).NextProtos, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).alpnProtocols, $.pointerValue<__goscript_conn.Conn>(c).quic != null)
		let selectedProto = __goscriptTuple12[0]
		err = __goscriptTuple12[1]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(120, 8))
			return err
		}
		$.pointerValue<__goscript_conn.Conn>(c).clientProtocol = selectedProto

		if ($.pointerValue<__goscript_conn.Conn>(c).quic != null) {
			// RFC 9001 Section 4.2: Clients MUST NOT offer TLS versions older than 1.3.
			for (let __goscriptRangeTarget6 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).supportedVersions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
				let v = __goscriptRangeTarget6![__rangeIndex]
				if ($.uint(v, 16) < $.uint(772, 16)) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(70, 8))
					return errors.New("tls: client offered TLS version older than TLS 1.3")
				}
			}
			// RFC 9001 Section 8.2.
			if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).quicTransportParameters == null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(109, 8))
				return errors.New("tls: client did not send a quic_transport_parameters extension")
			}
			__goscript_conn.Conn.prototype.quicSetTransportParameters.call(c, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).quicTransportParameters)
		} else {
			if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).quicTransportParameters != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
				return errors.New("tls: client sent an unexpected quic_transport_parameters extension")
			}
		}

		$.pointerValue<__goscript_conn.Conn>(c).serverName = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).serverName
		return null
	}

	public async readClientCertificate(): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		if (!serverHandshakeStateTLS13.prototype.requestClientCert.call(hs)) {
			// Make sure the connection is still being verified whether or not
			// the server requested a client certificate.
			if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection != null) {
				{
					let err = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection!($.markAsStructValue($.cloneStructValue(__goscript_conn.Conn.prototype.connectionStateLocked.call(c))))
					if (err != null) {
						await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(42, 8))
						return err
					}
				}
			}
			return null
		}

		// If we requested a client certificate, then the client must send a
		// certificate message. If it's empty, no CertificateVerify is sent.

		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
		if (err != null) {
			return err
		}

		let __goscriptTuple13: any = $.typeAssertTuple<__goscript_handshake_messages.certificateMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateMsgTLS13> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsgTLS13" })
		let certMsg: __goscript_handshake_messages.certificateMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateMsgTLS13> | null = __goscriptTuple13[0]
		let ok = __goscriptTuple13[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(certMsg, "*tls.certificateMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsgTLS13" }), msg)
		}

		{
			let __goscriptShadow5 = await __goscript_conn.Conn.prototype.processCertsFromClient.call(c, $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).certificate)))
			if (__goscriptShadow5 != null) {
				return __goscriptShadow5
			}
		}

		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection != null) {
			{
				let __goscriptShadow6 = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection!($.markAsStructValue($.cloneStructValue(__goscript_conn.Conn.prototype.connectionStateLocked.call(c))))
				if (__goscriptShadow6 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return __goscriptShadow6
				}
			}
		}

		if ($.len($.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).certificate.Certificate) != 0) {
			// certificateVerifyMsg is included in the transcript, but not until
			// after we verify the handshake signature, since the state before
			// this message was sent is used.
			let __goscriptTuple14: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, null)
			msg = __goscriptTuple14[0]
			err = __goscriptTuple14[1]
			if (err != null) {
				return err
			}

			let __goscriptTuple15: any = $.typeAssertTuple<__goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" })
			let certVerify: __goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null = __goscriptTuple15[0]
			let __goscriptShadow7 = __goscriptTuple15[1]
			if (!__goscriptShadow7) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
				return __goscript_common.unexpectedMessageError($.interfaceValue<any>(certVerify, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), msg)
			}

			// See RFC 8446, Section 4.4.3.
			// We don't use certReq.supportedSignatureAlgorithms because it would
			// require keeping the certificateRequestMsgTLS13 around in the hs.
			if (!__goscript_common.isSupportedSignatureAlgorithm($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16), __goscript_common.supportedSignatureAlgorithms($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16))) || !__goscript_common.isSupportedSignatureAlgorithm($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16), await __goscript_auth.signatureSchemesForPublicKey($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), ($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_conn.Conn>(c).peerCertificates!, 0)).PublicKey as crypto.PublicKey | null)))) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
				return errors.New("tls: client certificate used with invalid signature algorithm")
			}
			let __goscriptTuple16: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16))
			let sigType = $.uint(__goscriptTuple16[0], 8)
			let sigHash = __goscriptTuple16[1]
			let __goscriptShadow8 = __goscriptTuple16[2]
			if (__goscriptShadow8 != null) {
				return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			}
			if (($.uint(sigType, 8) == $.uint(225, 8)) || (sigHash == crypto.SHA1)) {
				return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			}
			let signed: $.Slice<number> = await __goscript_auth.signedMessage("TLS 1.3, client CertificateVerify\x00", $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)
			{
				let __goscriptShadow9 = await __goscript_auth.verifyHandshakeSignature($.uint(sigType, 8), ($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_conn.Conn>(c).peerCertificates!, 0)).PublicKey as crypto.PublicKey | null), sigHash, signed, $.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signature)
				if (__goscriptShadow9 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(51, 8))
					return errors.New("tls: invalid signature by the client certificate: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow9).Error())
				}
			}
			$.pointerValue<__goscript_conn.Conn>(c).peerSigAlg = $.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16)

			{
				let __goscriptShadow10 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(certVerify, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
				if (__goscriptShadow10 != null) {
					return __goscriptShadow10
				}
			}
		}

		// If we waited until the client certificates to send session tickets, we
		// are ready to do it now.
		{
			let __goscriptShadow11 = await serverHandshakeStateTLS13.prototype.sendSessionTickets.call(hs)
			if (__goscriptShadow11 != null) {
				return __goscriptShadow11
			}
		}

		return null
	}

	public async readClientFinished(): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		// finishedMsg is not included in the transcript.
		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, null)
		if (err != null) {
			return err
		}

		let __goscriptTuple17: any = $.typeAssertTuple<__goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" })
		let finished: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = __goscriptTuple17[0]
		let ok = __goscriptTuple17[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(finished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), msg)
		}

		if (!hmac.Equal($.pointerValue<serverHandshakeStateTLS13>(hs).clientFinished, $.pointerValue<__goscript_handshake_messages.finishedMsg>(finished).verifyData)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(51, 8))
			return errors.New("tls: invalid client finished hash")
		}

		{
			let __goscriptShadow12 = await __goscript_conn.Conn.prototype.setReadTrafficSecret.call(c, $.pointerValue<serverHandshakeStateTLS13>(hs).suite, 3, $.pointerValue<serverHandshakeStateTLS13>(hs).trafficSecret, false)
			if (__goscriptShadow12 != null) {
				return __goscriptShadow12
			}
		}

		return null
	}

	public requestClientCert(): boolean {
		const hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		return ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeStateTLS13>(hs).c).config).ClientAuth >= 1) && !$.pointerValue<serverHandshakeStateTLS13>(hs).usingPSK
	}

	public async sendDummyChangeCipherSpec(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		if ($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeStateTLS13>(hs).c).quic != null) {
			return null
		}
		if ($.pointerValue<serverHandshakeStateTLS13>(hs).sentDummyCCS) {
			return null
		}
		$.pointerValue<serverHandshakeStateTLS13>(hs).sentDummyCCS = true

		return __goscript_conn.Conn.prototype.writeChangeCipherRecord.call($.pointerValue<serverHandshakeStateTLS13>(hs).c)
	}

	public async sendServerCertificate(): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		// Only one of PSK and certificates are used at a time.
		if ($.pointerValue<serverHandshakeStateTLS13>(hs).usingPSK) {
			return null
		}

		if (serverHandshakeStateTLS13.prototype.requestClientCert.call(hs)) {
			// Request a client certificate
			let certReq: __goscript_handshake_messages.certificateRequestMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13> | null = new __goscript_handshake_messages.certificateRequestMsgTLS13()
			$.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>(certReq).ocspStapling = true
			$.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>(certReq).scts = true
			$.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>(certReq).supportedSignatureAlgorithms = __goscript_common.supportedSignatureAlgorithms($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16))
			$.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>(certReq).supportedSignatureAlgorithmsCert = __goscript_common.supportedSignatureAlgorithmsCert()
			if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientCAs != null) {
				$.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>(certReq).certificateAuthorities = x509.CertPool.prototype.Subjects.call($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientCAs)
			}

			{
				let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certReq, "*tls.certificateRequestMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.certificateRequestMsgTLS13" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
				if (err != null) {
					return err
				}
			}
		}

		let certMsg: __goscript_handshake_messages.certificateMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateMsgTLS13> | null = new __goscript_handshake_messages.certificateMsgTLS13()

		$.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).certificate = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeStateTLS13>(hs).cert)))
		$.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).scts = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).scts && ($.len($.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeStateTLS13>(hs).cert).SignedCertificateTimestamps) > 0)
		$.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).ocspStapling = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).ocspStapling && ($.len($.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeStateTLS13>(hs).cert).OCSPStaple) > 0)

		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certMsg, "*tls.certificateMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsgTLS13" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		let certVerifyMsg: __goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null = new __goscript_handshake_messages.certificateVerifyMsg()
		$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerifyMsg).hasSignatureAlgorithm = true
		$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerifyMsg).signatureAlgorithm = $.uint($.pointerValue<serverHandshakeStateTLS13>(hs).sigAlg, 16)

		let __goscriptTuple18: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint($.pointerValue<serverHandshakeStateTLS13>(hs).sigAlg, 16))
		let sigType = $.uint(__goscriptTuple18[0], 8)
		let sigHash = __goscriptTuple18[1]
		let err = __goscriptTuple18[2]
		if (err != null) {
			return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
		}

		let signed: $.Slice<number> = await __goscript_auth.signedMessage("TLS 1.3, server CertificateVerify\x00", $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)
		let signOpts = $.namedValueInterfaceValue<crypto.SignerOpts | null>(sigHash, "crypto.Hash", {Available: (receiver: any, ...args: any[]) => (crypto.Hash_Available as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), HashFunc: (receiver: any, ...args: any[]) => (crypto.Hash_HashFunc as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), New: (receiver: any, ...args: any[]) => (crypto.Hash_New as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Size: (receiver: any, ...args: any[]) => (crypto.Hash_Size as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (crypto.Hash_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, [{ name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "New", args: [], returns: [{ name: "_r0", type: "hash.Hash" }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])
		if ($.uint(sigType, 8) == $.uint(226, 8)) {
			signOpts = $.interfaceValue<crypto.SignerOpts | null>(new rsa.PSSOptions({SaltLength: rsa.PSSSaltLengthEqualsHash, Hash: sigHash}), "*rsa.PSSOptions", { kind: $.TypeKind.Pointer, elemType: "rsa.PSSOptions" })
		}
		let __goscriptTuple19: any = await crypto.SignMessage($.mustTypeAssert<crypto.Signer | null>($.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeStateTLS13>(hs).cert).PrivateKey, "crypto.Signer"), __goscript_common.Config.prototype.rand.call($.pointerValue<__goscript_conn.Conn>(c).config), signed, signOpts)
		let sig: $.Slice<number> = __goscriptTuple19[0]
		err = __goscriptTuple19[1]
		if (err != null) {
			let _public = await $.pointerValue<Exclude<crypto.Signer, null>>($.mustTypeAssert<crypto.Signer | null>($.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeStateTLS13>(hs).cert).PrivateKey, "crypto.Signer")).Public()
			{
				let __goscriptTuple20: any = $.typeAssertTuple<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(_public, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })
				let rsaKey: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple20[0]
				let ok = __goscriptTuple20[1]
				if ((ok && ($.uint(sigType, 8) == $.uint(226, 8))) && ((Math.trunc(big.Int.prototype.BitLen.call($.pointerValue<rsa.PublicKey>(rsaKey).N) / 8)) < ((crypto.Hash_Size(sigHash) * 2) + 2))) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
				} else {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				}
			}
			return errors.New("tls: failed to sign handshake: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
		$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerifyMsg).signature = sig

		{
			let [, __goscriptShadow13] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certVerifyMsg, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (__goscriptShadow13 != null) {
				return __goscriptShadow13
			}
		}

		return null
	}

	public async sendServerFinished(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		let finished: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = (await (async () => { const __goscriptLiteralField1 = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.finishedHash.call($.pointerValue<serverHandshakeStateTLS13>(hs).suite, $.pointerValue<__goscript_conn.Conn>(c).out.trafficSecret, $.pointerValue<serverHandshakeStateTLS13>(hs).transcript); return new __goscript_handshake_messages.finishedMsg({verifyData: __goscriptLiteralField1}) })())

		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(finished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		// Derive secrets that take context through the server Finished.

		$.pointerValue<serverHandshakeStateTLS13>(hs).masterSecret = await tls13.HandshakeSecret.prototype.MasterSecret.call($.pointerValue<serverHandshakeStateTLS13>(hs).handshakeSecret)

		$.pointerValue<serverHandshakeStateTLS13>(hs).trafficSecret = await tls13.MasterSecret.prototype.ClientApplicationTrafficSecret.call($.pointerValue<serverHandshakeStateTLS13>(hs).masterSecret, $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)
		let serverSecret: $.Slice<number> = await tls13.MasterSecret.prototype.ServerApplicationTrafficSecret.call($.pointerValue<serverHandshakeStateTLS13>(hs).masterSecret, $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)
		await __goscript_conn.Conn.prototype.setWriteTrafficSecret.call(c, $.pointerValue<serverHandshakeStateTLS13>(hs).suite, 3, serverSecret)

		if ($.pointerValue<__goscript_conn.Conn>(c).quic != null) {
			__goscript_conn.Conn.prototype.quicSetWriteSecret.call(c, 3, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).id, 16), serverSecret)
		}

		let err = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "CLIENT_TRAFFIC_SECRET_0", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).random, $.pointerValue<serverHandshakeStateTLS13>(hs).trafficSecret)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}
		err = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "SERVER_TRAFFIC_SECRET_0", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).random, serverSecret)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}

		$.pointerValue<__goscript_conn.Conn>(c).ekm = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.exportKeyingMaterial.call($.pointerValue<serverHandshakeStateTLS13>(hs).suite, $.pointerValue<serverHandshakeStateTLS13>(hs).masterSecret, $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)

		// If we did not request client certificates, at this point we can
		// precompute the client finished and roll the transcript forward to send
		// session tickets in our first flight.
		if (!serverHandshakeStateTLS13.prototype.requestClientCert.call(hs)) {
			{
				let __goscriptShadow14 = await serverHandshakeStateTLS13.prototype.sendSessionTickets.call(hs)
				if (__goscriptShadow14 != null) {
					return __goscriptShadow14
				}
			}
		}

		return null
	}

	public async sendServerParameters(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		if ($.pointerValue<serverHandshakeStateTLS13>(hs).echContext != null) {
			$.copy($.goSlice($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).random, 32 - 8, undefined), $.makeSlice<number>(8, undefined, "byte"))
			let echTranscript = await cloneHash($.pointerValue<serverHandshakeStateTLS13>(hs).transcript, $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash)
			await $.pointerValue<Exclude<hash.Hash, null>>(echTranscript).Write($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).original)
			{
				let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeStateTLS13>(hs).hello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), (echTranscript as __goscript_handshake_messages.transcriptHash | null))
				if (err != null) {
					return err
				}
			}
			// compute the acceptance message
			let h: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null = $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo))
			let __goscriptTuple21: any = await hkdf.Extract(undefined, h, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).random, null)
			let prk: $.Slice<number> = __goscriptTuple21[0]
			let err = __goscriptTuple21[1]
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return err
			}
			let acceptConfirmation: $.Slice<number> = await tls13.ExpandLabel(undefined, h, prk, "ech accept confirmation", await $.pointerValue<Exclude<hash.Hash, null>>(echTranscript).Sum(null), 8)
			$.copy($.goSlice($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).hello).random, 32 - 8, undefined), acceptConfirmation)
		}

		{
			let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeStateTLS13>(hs).hello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		{
			let err = await serverHandshakeStateTLS13.prototype.sendDummyChangeCipherSpec.call(hs)
			if (err != null) {
				return err
			}
		}

		let earlySecret: tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).earlySecret
		if (earlySecret == null) {
			earlySecret = await tls13.NewEarlySecret(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), null)
		}
		$.pointerValue<serverHandshakeStateTLS13>(hs).handshakeSecret = await tls13.EarlySecret.prototype.HandshakeSecret.call(earlySecret, $.pointerValue<serverHandshakeStateTLS13>(hs).sharedKey)

		let serverSecret: $.Slice<number> = await tls13.HandshakeSecret.prototype.ServerHandshakeTrafficSecret.call($.pointerValue<serverHandshakeStateTLS13>(hs).handshakeSecret, $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)
		await __goscript_conn.Conn.prototype.setWriteTrafficSecret.call(c, $.pointerValue<serverHandshakeStateTLS13>(hs).suite, 2, serverSecret)
		let clientSecret: $.Slice<number> = await tls13.HandshakeSecret.prototype.ClientHandshakeTrafficSecret.call($.pointerValue<serverHandshakeStateTLS13>(hs).handshakeSecret, $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)
		{
			let err = await __goscript_conn.Conn.prototype.setReadTrafficSecret.call(c, $.pointerValue<serverHandshakeStateTLS13>(hs).suite, 2, clientSecret, false)
			if (err != null) {
				return err
			}
		}

		if ($.pointerValue<__goscript_conn.Conn>(c).quic != null) {
			__goscript_conn.Conn.prototype.quicSetWriteSecret.call(c, 2, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).id, 16), serverSecret)
			{
				let err = await __goscript_conn.Conn.prototype.quicSetReadSecret.call(c, 2, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<serverHandshakeStateTLS13>(hs).suite).id, 16), clientSecret)
				if (err != null) {
					return err
				}
			}
		}

		let err = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "CLIENT_HANDSHAKE_TRAFFIC_SECRET", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).random, clientSecret)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}
		err = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "SERVER_HANDSHAKE_TRAFFIC_SECRET", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).random, serverSecret)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}

		let encryptedExtensions: __goscript_handshake_messages.encryptedExtensionsMsg | $.VarRef<__goscript_handshake_messages.encryptedExtensionsMsg> | null = new __goscript_handshake_messages.encryptedExtensionsMsg()
		$.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).alpnProtocol = $.pointerValue<__goscript_conn.Conn>(c).clientProtocol

		if ($.pointerValue<__goscript_conn.Conn>(c).quic != null) {
			let __goscriptTuple22: any = await __goscript_conn.Conn.prototype.quicGetTransportParameters.call(c)
			let p: $.Slice<number> = __goscriptTuple22[0]
			let __goscriptShadow15 = __goscriptTuple22[1]
			if (__goscriptShadow15 != null) {
				return __goscriptShadow15
			}
			$.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).quicTransportParameters = p
			$.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).earlyData = $.pointerValue<serverHandshakeStateTLS13>(hs).earlyData
		}

		if (!$.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeStateTLS13>(hs).c).didResume && (!$.stringEqual($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).serverName, ""))) {
			$.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).serverNameAck = true
		}

		// If client sent ECH extension, but we didn't accept it,
		// send retry configs, if available.
		let echKeys: $.Slice<__goscript_common.EncryptedClientHelloKey> = $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeStateTLS13>(hs).c).config).EncryptedClientHelloKeys
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeStateTLS13>(hs).c).config).GetEncryptedClientHelloKeys != null) {
			let __goscriptTuple23: any = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeStateTLS13>(hs).c).config).GetEncryptedClientHelloKeys!(__goscript_handshake_server.clientHelloInfo($.pointerValue<serverHandshakeStateTLS13>(hs).ctx, c, $.pointerValue<serverHandshakeStateTLS13>(hs).clientHello))
			echKeys = __goscriptTuple23[0]
			err = __goscriptTuple23[1]
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return err
			}
		}
		if ((($.len(echKeys) > 0) && ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).encryptedClientHello) > 0)) && ($.pointerValue<serverHandshakeStateTLS13>(hs).echContext == null)) {
			let __goscriptTuple24: any = await __goscript_ech.buildRetryConfigList(echKeys)
			$.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).echRetryConfigs = __goscriptTuple24[0]
			err = __goscriptTuple24[1]
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return err
			}
		}

		{
			let [, __goscriptShadow16] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(encryptedExtensions, "*tls.encryptedExtensionsMsg", { kind: $.TypeKind.Pointer, elemType: "tls.encryptedExtensionsMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (__goscriptShadow16 != null) {
				return __goscriptShadow16
			}
		}

		return null
	}

	public async sendSessionTickets(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeStateTLS13>(hs).c

		$.pointerValue<serverHandshakeStateTLS13>(hs).clientFinished = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.finishedHash.call($.pointerValue<serverHandshakeStateTLS13>(hs).suite, $.pointerValue<__goscript_conn.Conn>(c)._in.trafficSecret, $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)
		let __goscriptShadow17: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = new __goscript_handshake_messages.finishedMsg({verifyData: $.pointerValue<serverHandshakeStateTLS13>(hs).clientFinished})
		{
			let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(__goscriptShadow17, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), ($.pointerValue<serverHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		$.pointerValue<__goscript_conn.Conn>(c).resumptionSecret = await tls13.MasterSecret.prototype.ResumptionMasterSecret.call($.pointerValue<serverHandshakeStateTLS13>(hs).masterSecret, $.pointerValue<serverHandshakeStateTLS13>(hs).transcript)

		if (!serverHandshakeStateTLS13.prototype.shouldSendSessionTickets.call(hs)) {
			return null
		}
		return __goscript_conn.Conn.prototype.sendSessionTicket.call(c, false, null)
	}

	public shouldSendSessionTickets(): boolean {
		const hs: serverHandshakeStateTLS13 | $.VarRef<serverHandshakeStateTLS13> | null = this
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeStateTLS13>(hs).c).config).SessionTicketsDisabled) {
			return false
		}

		// QUIC tickets are sent by QUICConn.SendSessionTicket, not automatically.
		if ($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeStateTLS13>(hs).c).quic != null) {
			return false
		}

		// Don't send tickets the client wouldn't use. See RFC 8446, Section 4.2.9.
		return slices.Contains($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeStateTLS13>(hs).clientHello).pskModes, $.uint(1, 8))
	}

	static __typeInfo = $.registerStructType(
		"tls.serverHandshakeStateTLS13",
		() => new serverHandshakeStateTLS13(),
		[{ name: "checkForResumption", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "doHelloRetryRequest", args: [{ name: "selectedGroup", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.keyShare" } }, { name: "_r1", type: "error" }] }, { name: "handshake", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "pickCertificate", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "processClientHello", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readClientCertificate", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readClientFinished", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "requestClientCert", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "sendDummyChangeCipherSpec", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendServerCertificate", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendServerFinished", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendServerParameters", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendSessionTickets", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "shouldSendSessionTickets", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		serverHandshakeStateTLS13,
		[{ name: "c", key: "c", type: { kind: $.TypeKind.Pointer, elemType: "tls.Conn" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "ctx", key: "ctx", type: "context.Context", pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "clientHello", key: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }, pkgPath: "crypto/tls", index: [2], offset: 24, exported: false }, { name: "hello", key: "hello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }, pkgPath: "crypto/tls", index: [3], offset: 32, exported: false }, { name: "sentDummyCCS", key: "sentDummyCCS", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [4], offset: 40, exported: false }, { name: "usingPSK", key: "usingPSK", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [5], offset: 41, exported: false }, { name: "earlyData", key: "earlyData", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [6], offset: 42, exported: false }, { name: "suite", key: "suite", type: { kind: $.TypeKind.Pointer, elemType: "tls.cipherSuiteTLS13" }, pkgPath: "crypto/tls", index: [7], offset: 48, exported: false }, { name: "cert", key: "cert", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" }, pkgPath: "crypto/tls", index: [8], offset: 56, exported: false }, { name: "sigAlg", key: "sigAlg", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }, pkgPath: "crypto/tls", index: [9], offset: 64, exported: false }, { name: "earlySecret", key: "earlySecret", type: { kind: $.TypeKind.Pointer, elemType: "tls13.EarlySecret" }, pkgPath: "crypto/tls", index: [10], offset: 72, exported: false }, { name: "sharedKey", key: "sharedKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [11], offset: 80, exported: false }, { name: "handshakeSecret", key: "handshakeSecret", type: { kind: $.TypeKind.Pointer, elemType: "tls13.HandshakeSecret" }, pkgPath: "crypto/tls", index: [12], offset: 104, exported: false }, { name: "masterSecret", key: "masterSecret", type: { kind: $.TypeKind.Pointer, elemType: "tls13.MasterSecret" }, pkgPath: "crypto/tls", index: [13], offset: 112, exported: false }, { name: "trafficSecret", key: "trafficSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [14], offset: 120, exported: false }, { name: "transcript", key: "transcript", type: "hash.Hash", pkgPath: "crypto/tls", index: [15], offset: 144, exported: false }, { name: "clientFinished", key: "clientFinished", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [16], offset: 160, exported: false }, { name: "echContext", key: "echContext", type: { kind: $.TypeKind.Pointer, elemType: "tls.echServerContext" }, pkgPath: "crypto/tls", index: [17], offset: 184, exported: false }]
	)
}

export const maxClientPSKIdentities: number = 5

export async function cloneHash(_in: hash.Hash | null, h: crypto.Hash): globalThis.Promise<hash.Hash | null> {
	{
		let [cloner, ok] = $.typeAssertTuple<hash.Cloner | null>(_in, "hash.Cloner")
		if (ok) {
			{
				let [out, err] = await $.pointerValue<Exclude<hash.Cloner, null>>(cloner).Clone()
				if (err == null) {
					return (out as hash.Hash | null)
				}
			}
		}
	}
	// Recreate the interface to avoid importing encoding.
	type binaryMarshaler = {
		MarshalBinary(): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
		UnmarshalBinary(data: $.Slice<number>): $.GoError | globalThis.Promise<$.GoError>
	}

	$.registerInterfaceType(
		"tls.binaryMarshaler",
		null,
		[{ name: "MarshalBinary", args: [], returns: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "UnmarshalBinary", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }]
	);
	let [marshaler, ok] = $.typeAssertTuple<binaryMarshaler | null>(_in, "tls.binaryMarshaler")
	if (!ok) {
		return null
	}
	let __goscriptTuple25: any = await $.pointerValue<Exclude<binaryMarshaler, null>>(marshaler).MarshalBinary()
	let state: $.Slice<number> = __goscriptTuple25[0]
	let err = __goscriptTuple25[1]
	if (err != null) {
		return null
	}
	let out = await crypto.Hash_New(h)
	let __goscriptTuple26: any = $.typeAssertTuple<binaryMarshaler | null>(out, "tls.binaryMarshaler")
	let unmarshaler = __goscriptTuple26[0]
	ok = __goscriptTuple26[1]
	if (!ok) {
		return null
	}
	{
		let __goscriptShadow18 = await $.pointerValue<Exclude<binaryMarshaler, null>>(unmarshaler).UnmarshalBinary(state)
		if (__goscriptShadow18 != null) {
			return null
		}
	}
	return out
}

export function illegalClientHelloChange(ch: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, ch1: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null): boolean {
	if (((((($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedVersions) != $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedVersions)) || ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).cipherSuites) != $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).cipherSuites))) || ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedCurves) != $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedCurves))) || ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedSignatureAlgorithms) != $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedSignatureAlgorithms))) || ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedSignatureAlgorithmsCert) != $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedSignatureAlgorithmsCert))) || ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).alpnProtocols) != $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).alpnProtocols))) {
		return true
	}
	for (let __goscriptRangeTarget7 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedVersions, i = 0; i < $.len(__goscriptRangeTarget7); i++) {
		if ($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedVersions!, i), 16) != $.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedVersions!, i), 16)) {
			return true
		}
	}
	for (let __goscriptRangeTarget8 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).cipherSuites, i = 0; i < $.len(__goscriptRangeTarget8); i++) {
		if ($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).cipherSuites!, i), 16) != $.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).cipherSuites!, i), 16)) {
			return true
		}
	}
	for (let __goscriptRangeTarget9 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedCurves, i = 0; i < $.len(__goscriptRangeTarget9); i++) {
		if ($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedCurves!, i), 16) != $.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedCurves!, i), 16)) {
			return true
		}
	}
	for (let __goscriptRangeTarget10 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedSignatureAlgorithms, i = 0; i < $.len(__goscriptRangeTarget10); i++) {
		if ($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedSignatureAlgorithms!, i), 16) != $.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedSignatureAlgorithms!, i), 16)) {
			return true
		}
	}
	for (let __goscriptRangeTarget11 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedSignatureAlgorithmsCert, i = 0; i < $.len(__goscriptRangeTarget11); i++) {
		if ($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedSignatureAlgorithmsCert!, i), 16) != $.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedSignatureAlgorithmsCert!, i), 16)) {
			return true
		}
	}
	for (let __goscriptRangeTarget12 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).alpnProtocols, i = 0; i < $.len(__goscriptRangeTarget12); i++) {
		if (!$.stringEqual($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).alpnProtocols!, i), $.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).alpnProtocols!, i))) {
			return true
		}
	}
	return ((((((((((((($.uint($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).vers, 16) != $.uint($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).vers, 16)) || !bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).random, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).random)) || !bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).sessionId, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).sessionId)) || !bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).compressionMethods, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).compressionMethods)) || (!$.stringEqual($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).serverName, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).serverName))) || ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).ocspStapling != $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).ocspStapling)) || !bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).supportedPoints, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).supportedPoints)) || ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).ticketSupported != $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).ticketSupported)) || !bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).sessionTicket, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).sessionTicket)) || ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).secureRenegotiationSupported != $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).secureRenegotiationSupported)) || !bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).secureRenegotiation, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).secureRenegotiation)) || ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).scts != $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).scts)) || !bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).cookie, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).cookie)) || !bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch).pskModes, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(ch1).pskModes)
}
