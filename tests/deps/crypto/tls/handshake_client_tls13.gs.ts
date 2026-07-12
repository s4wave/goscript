// Generated file based on handshake_client_tls13.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as hkdf from "@goscript/crypto/hkdf/index.js"

import * as hmac from "@goscript/crypto/hmac/index.js"

import * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash from "@goscript/hash/index.js"

import * as slices from "@goscript/slices/index.js"

import * as time from "@goscript/time/index.js"

import type * as cipher from "@goscript/crypto/cipher/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_alert from "./alert.gs.ts"

import * as __goscript_auth from "./auth.gs.ts"

import * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_conn from "./conn.gs.ts"

import * as __goscript_ech from "./ech.gs.ts"

import * as __goscript_handshake_client from "./handshake_client.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_handshake_server from "./handshake_server.gs.ts"

import * as __goscript_handshake_server_tls13 from "./handshake_server_tls13.gs.ts"

import * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_quic from "./quic.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/hkdf/index.js"
import "@goscript/crypto/hmac/index.js"
import "@goscript/crypto/internal/fips140/tls13/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "@goscript/slices/index.js"
import "@goscript/time/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "./alert.gs.ts"
import "./auth.gs.ts"
import "./cipher_suites.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./conn.gs.ts"
import "./ech.gs.ts"
import "./handshake_client.gs.ts"
import "./handshake_messages.gs.ts"
import "./handshake_server.gs.ts"
import "./handshake_server_tls13.gs.ts"
import "./key_schedule.gs.ts"
import "./quic.gs.ts"
import "./ticket.gs.ts"

export class clientHandshakeStateTLS13 {
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

	public get serverHello(): __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null {
		return this._fields.serverHello.value
	}
	public set serverHello(value: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null) {
		this._fields.serverHello.value = value
	}

	public get hello(): __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null {
		return this._fields.hello.value
	}
	public set hello(value: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null) {
		this._fields.hello.value = value
	}

	public get keyShareKeys(): __goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null {
		return this._fields.keyShareKeys.value
	}
	public set keyShareKeys(value: __goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null) {
		this._fields.keyShareKeys.value = value
	}

	public get session(): __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null {
		return this._fields.session.value
	}
	public set session(value: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) {
		this._fields.session.value = value
	}

	public get earlySecret(): tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null {
		return this._fields.earlySecret.value
	}
	public set earlySecret(value: tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null) {
		this._fields.earlySecret.value = value
	}

	public get binderKey(): $.Slice<number> {
		return this._fields.binderKey.value
	}
	public set binderKey(value: $.Slice<number>) {
		this._fields.binderKey.value = value
	}

	public get certReq(): __goscript_handshake_messages.certificateRequestMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13> | null {
		return this._fields.certReq.value
	}
	public set certReq(value: __goscript_handshake_messages.certificateRequestMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13> | null) {
		this._fields.certReq.value = value
	}

	public get usingPSK(): boolean {
		return this._fields.usingPSK.value
	}
	public set usingPSK(value: boolean) {
		this._fields.usingPSK.value = value
	}

	public get sentDummyCCS(): boolean {
		return this._fields.sentDummyCCS.value
	}
	public set sentDummyCCS(value: boolean) {
		this._fields.sentDummyCCS.value = value
	}

	public get suite(): __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null {
		return this._fields.suite.value
	}
	public set suite(value: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null) {
		this._fields.suite.value = value
	}

	public get transcript(): hash.Hash | null {
		return this._fields.transcript.value
	}
	public set transcript(value: hash.Hash | null) {
		this._fields.transcript.value = value
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

	public get echContext(): __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null {
		return this._fields.echContext.value
	}
	public set echContext(value: __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null) {
		this._fields.echContext.value = value
	}

	public _fields: {
		c: $.VarRef<__goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null>
		ctx: $.VarRef<context.Context | null>
		serverHello: $.VarRef<__goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null>
		hello: $.VarRef<__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null>
		keyShareKeys: $.VarRef<__goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null>
		session: $.VarRef<__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null>
		earlySecret: $.VarRef<tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null>
		binderKey: $.VarRef<$.Slice<number>>
		certReq: $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13> | null>
		usingPSK: $.VarRef<boolean>
		sentDummyCCS: $.VarRef<boolean>
		suite: $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null>
		transcript: $.VarRef<hash.Hash | null>
		masterSecret: $.VarRef<tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null>
		trafficSecret: $.VarRef<$.Slice<number>>
		echContext: $.VarRef<__goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null>
	}

	constructor(init?: Partial<{c?: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, ctx?: context.Context | null, serverHello?: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null, hello?: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, keyShareKeys?: __goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null, session?: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, earlySecret?: tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null, binderKey?: $.Slice<number>, certReq?: __goscript_handshake_messages.certificateRequestMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13> | null, usingPSK?: boolean, sentDummyCCS?: boolean, suite?: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null, transcript?: hash.Hash | null, masterSecret?: tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null, trafficSecret?: $.Slice<number>, echContext?: __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null}>) {
		this._fields = {
			c: $.varRef(init?.c ?? (null as __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null)),
			ctx: $.varRef(init?.ctx ?? (null as context.Context | null)),
			serverHello: $.varRef(init?.serverHello ?? (null as __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null)),
			hello: $.varRef(init?.hello ?? (null as __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null)),
			keyShareKeys: $.varRef(init?.keyShareKeys ?? (null as __goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null)),
			session: $.varRef(init?.session ?? (null as __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null)),
			earlySecret: $.varRef(init?.earlySecret ?? (null as tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null)),
			binderKey: $.varRef(init?.binderKey ?? (null as $.Slice<number>)),
			certReq: $.varRef(init?.certReq ?? (null as __goscript_handshake_messages.certificateRequestMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13> | null)),
			usingPSK: $.varRef(init?.usingPSK ?? (false as boolean)),
			sentDummyCCS: $.varRef(init?.sentDummyCCS ?? (false as boolean)),
			suite: $.varRef(init?.suite ?? (null as __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null)),
			transcript: $.varRef(init?.transcript ?? (null as hash.Hash | null)),
			masterSecret: $.varRef(init?.masterSecret ?? (null as tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null)),
			trafficSecret: $.varRef(init?.trafficSecret ?? (null as $.Slice<number>)),
			echContext: $.varRef(init?.echContext ?? (null as __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null))
		}
	}

	public clone(): clientHandshakeStateTLS13 {
		const cloned = new clientHandshakeStateTLS13()
		cloned._fields = {
			c: $.varRef(this._fields.c.value),
			ctx: $.varRef(this._fields.ctx.value),
			serverHello: $.varRef(this._fields.serverHello.value),
			hello: $.varRef(this._fields.hello.value),
			keyShareKeys: $.varRef(this._fields.keyShareKeys.value),
			session: $.varRef(this._fields.session.value),
			earlySecret: $.varRef(this._fields.earlySecret.value),
			binderKey: $.varRef(this._fields.binderKey.value),
			certReq: $.varRef(this._fields.certReq.value),
			usingPSK: $.varRef(this._fields.usingPSK.value),
			sentDummyCCS: $.varRef(this._fields.sentDummyCCS.value),
			suite: $.varRef(this._fields.suite.value),
			transcript: $.varRef(this._fields.transcript.value),
			masterSecret: $.varRef(this._fields.masterSecret.value),
			trafficSecret: $.varRef(this._fields.trafficSecret.value),
			echContext: $.varRef(this._fields.echContext.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async checkServerHelloOrHRR(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).supportedVersion, 16) == $.uint(0, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(109, 8))
			return errors.New("tls: server selected TLS 1.3 using the legacy version field")
		}

		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).supportedVersion, 16) != $.uint(772, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server selected an invalid version after a HelloRetryRequest")
		}

		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).vers, 16) != $.uint(771, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server sent an incorrect legacy version")
		}

		if (((((($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).ocspStapling || $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).ticketSupported) || $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).extendedMasterSecret) || $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).secureRenegotiationSupported) || ($.len($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).secureRenegotiation) != 0)) || ($.len($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).alpnProtocol) != 0)) || ($.len($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).scts) != 0)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
			return errors.New("tls: server sent a ServerHello extension forbidden in TLS 1.3")
		}

		if (!bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).sessionId, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).sessionId)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server did not echo the legacy session ID")
		}

		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).compressionMethod, 8) != $.uint(0, 8)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(50, 8))
			return errors.New("tls: server sent non-zero legacy TLS compression method")
		}

		let selectedSuite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.mutualCipherSuiteTLS13($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).cipherSuites, $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).cipherSuite, 16))
		if (($.pointerValue<clientHandshakeStateTLS13>(hs).suite != null) && (selectedSuite != $.pointerValue<clientHandshakeStateTLS13>(hs).suite)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server changed cipher suite after a HelloRetryRequest")
		}
		if (selectedSuite == null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server chose an unconfigured cipher suite")
		}
		$.pointerValue<clientHandshakeStateTLS13>(hs).suite = selectedSuite
		$.pointerValue<__goscript_conn.Conn>(c).cipherSuite = $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).id, 16)

		return null
	}

	public async establishHandshakeKeys(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		let [ke, err] = __goscript_key_schedule.keyExchangeForCurveID($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).serverShare.group, 16))
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}
		let __goscriptTuple0: any = await $.pointerValue<Exclude<__goscript_key_schedule.keyExchange, null>>(ke).clientSharedSecret($.pointerValue<clientHandshakeStateTLS13>(hs).keyShareKeys, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).serverShare.data)
		let sharedKey: $.Slice<number> = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: invalid server key share")
		}
		$.pointerValue<__goscript_conn.Conn>(c).curveID = $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).serverShare.group, 16)

		let earlySecret: tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).earlySecret
		if (!$.pointerValue<clientHandshakeStateTLS13>(hs).usingPSK) {
			earlySecret = await tls13.NewEarlySecret(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), null)
		}

		let handshakeSecret: tls13.HandshakeSecret | $.VarRef<tls13.HandshakeSecret> | null = await tls13.EarlySecret.prototype.HandshakeSecret.call(earlySecret, sharedKey)

		let clientSecret: $.Slice<number> = await tls13.HandshakeSecret.prototype.ClientHandshakeTrafficSecret.call(handshakeSecret, $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)
		await __goscript_conn.Conn.prototype.setWriteTrafficSecret.call(c, $.pointerValue<clientHandshakeStateTLS13>(hs).suite, 2, clientSecret)
		let serverSecret: $.Slice<number> = await tls13.HandshakeSecret.prototype.ServerHandshakeTrafficSecret.call(handshakeSecret, $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)
		{
			let __goscriptShadow0 = await __goscript_conn.Conn.prototype.setReadTrafficSecret.call(c, $.pointerValue<clientHandshakeStateTLS13>(hs).suite, 2, serverSecret, false)
			if (__goscriptShadow0 != null) {
				return __goscriptShadow0
			}
		}

		if ($.pointerValue<__goscript_conn.Conn>(c).quic != null) {
			__goscript_conn.Conn.prototype.quicSetWriteSecret.call(c, 2, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).id, 16), clientSecret)
			{
				let __goscriptShadow1 = await __goscript_conn.Conn.prototype.quicSetReadSecret.call(c, 2, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).id, 16), serverSecret)
				if (__goscriptShadow1 != null) {
					return __goscriptShadow1
				}
			}
		}

		err = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "CLIENT_HANDSHAKE_TRAFFIC_SECRET", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).random, clientSecret)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}
		err = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "SERVER_HANDSHAKE_TRAFFIC_SECRET", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).random, serverSecret)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}

		$.pointerValue<clientHandshakeStateTLS13>(hs).masterSecret = await tls13.HandshakeSecret.prototype.MasterSecret.call(handshakeSecret)

		return null
	}

	public async handshake(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		// The server must not select TLS 1.3 in a renegotiation. See RFC 8446,
		// sections 4.1.2 and 4.1.3.
		if ($.pointerValue<__goscript_conn.Conn>(c).handshakes > 0) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(70, 8))
			return errors.New("tls: server selected TLS 1.3 in a renegotiation")
		}

		// Consistency check on the presence of a keyShare and its parameters.
		if ((($.pointerValue<clientHandshakeStateTLS13>(hs).keyShareKeys == null) || ($.pointerValue<__goscript_key_schedule.keySharePrivateKeys>($.pointerValue<clientHandshakeStateTLS13>(hs).keyShareKeys).ecdhe == null)) || ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).keyShares) == 0)) {
			return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
		}

		{
			let err = await clientHandshakeStateTLS13.prototype.checkServerHelloOrHRR.call(hs)
			if (err != null) {
				return err
			}
		}

		$.pointerValue<clientHandshakeStateTLS13>(hs).transcript = await crypto.Hash_New($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash)

		{
			let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<clientHandshakeStateTLS13>(hs).hello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		if ($.pointerValue<clientHandshakeStateTLS13>(hs).echContext != null) {
			$.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript = await crypto.Hash_New($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash)
			{
				let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), ($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript as __goscript_handshake_messages.transcriptHash | null))
				if (err != null) {
					return err
				}
			}
		}

		if (bytes.Equal($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).random, __goscript_common.helloRetryRequestRandom)) {
			{
				let err = await clientHandshakeStateTLS13.prototype.sendDummyChangeCipherSpec.call(hs)
				if (err != null) {
					return err
				}
			}
			{
				let err = await clientHandshakeStateTLS13.prototype.processHelloRetryRequest.call(hs)
				if (err != null) {
					return err
				}
			}
		}

		if ($.pointerValue<clientHandshakeStateTLS13>(hs).echContext != null) {
			let confTranscript = await __goscript_handshake_server_tls13.cloneHash($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript, $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash)
			await $.pointerValue<Exclude<hash.Hash, null>>(confTranscript).Write($.goSlice($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).original, undefined, 30))
			await $.pointerValue<Exclude<hash.Hash, null>>(confTranscript).Write($.makeSlice<number>(8, undefined, "byte"))
			await $.pointerValue<Exclude<hash.Hash, null>>(confTranscript).Write($.goSlice($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).original, 38, undefined))
			let h: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null = $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo))
			let __goscriptTuple1: any = await hkdf.Extract(undefined, h, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerHello).random, null)
			let prk: $.Slice<number> = __goscriptTuple1[0]
			let err = __goscriptTuple1[1]
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return err
			}
			let acceptConfirmation: $.Slice<number> = await tls13.ExpandLabel(undefined, h, prk, "ech accept confirmation", await $.pointerValue<Exclude<hash.Hash, null>>(confTranscript).Sum(null), 8)
			if (subtle.ConstantTimeCompare(acceptConfirmation, $.goSlice($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).random, $.len($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).random) - 8, undefined)) == 1) {
				$.pointerValue<clientHandshakeStateTLS13>(hs).hello = $.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerHello
				$.pointerValue<__goscript_conn.Conn>(c).serverName = $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ServerName
				$.pointerValue<clientHandshakeStateTLS13>(hs).transcript = $.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript
				$.pointerValue<__goscript_conn.Conn>(c).echAccepted = true

				if ($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).encryptedClientHello != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
					return errors.New("tls: unexpected encrypted client hello extension in server hello despite ECH being accepted")
				}

				if (($.stringEqual($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).serverName, "")) && $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).serverNameAck) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
					return errors.New("tls: unexpected server_name extension in server hello")
				}
			} else {
				$.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).echRejected = true
			}
		}

		{
			let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		$.pointerValue<__goscript_conn.Conn>(c).buffering = true
		{
			let err = await clientHandshakeStateTLS13.prototype.processServerHello.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await clientHandshakeStateTLS13.prototype.sendDummyChangeCipherSpec.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await clientHandshakeStateTLS13.prototype.establishHandshakeKeys.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await clientHandshakeStateTLS13.prototype.readServerParameters.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await clientHandshakeStateTLS13.prototype.readServerCertificate.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await clientHandshakeStateTLS13.prototype.readServerFinished.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await clientHandshakeStateTLS13.prototype.sendClientCertificate.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let err = await clientHandshakeStateTLS13.prototype.sendClientFinished.call(hs)
			if (err != null) {
				return err
			}
		}
		{
			let [, err] = await __goscript_conn.Conn.prototype.flush.call(c)
			if (err != null) {
				return err
			}
		}

		if (($.pointerValue<clientHandshakeStateTLS13>(hs).echContext != null) && $.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).echRejected) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(121, 8))
			return $.interfaceValue<$.GoError>(new __goscript_ech.ECHRejectionError({RetryConfigList: $.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).retryConfigs}), "*tls.ECHRejectionError", { kind: $.TypeKind.Pointer, elemType: "tls.ECHRejectionError" })
		}

		$.pointerValue<__goscript_conn.Conn>(c).isHandshakeComplete.Store(true)

		return null
	}

	public async processHelloRetryRequest(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		// The first ClientHello gets double-hashed into the transcript upon a
		// HelloRetryRequest. (The idea is that the server might offload transcript
		// storage to the client in the cookie.) See RFC 8446, Section 4.4.1.
		let chHash: $.Slice<number> = await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<clientHandshakeStateTLS13>(hs).transcript).Sum(null)
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<clientHandshakeStateTLS13>(hs).transcript).Reset()
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<clientHandshakeStateTLS13>(hs).transcript).Write(new Uint8Array([254, 0, 0, $.uint($.len(chHash), 8)]) as $.Slice<number>)
		await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<clientHandshakeStateTLS13>(hs).transcript).Write(chHash)
		{
			let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		let isInnerHello: boolean = false
		let hello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).hello
		if ($.pointerValue<clientHandshakeStateTLS13>(hs).echContext != null) {
			chHash = await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript).Sum(null)
			await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript).Reset()
			await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript).Write(new Uint8Array([254, 0, 0, $.uint($.len(chHash), 8)]) as $.Slice<number>)
			await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript).Write(chHash)

			if ($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).encryptedClientHello != null) {
				if ($.len($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).encryptedClientHello) != 8) {
					await __goscript_conn.Conn.prototype.sendAlert.call($.pointerValue<clientHandshakeStateTLS13>(hs).c, $.uint(50, 8))
					return errors.New("tls: malformed encrypted client hello extension")
				}

				let confTranscript = await __goscript_handshake_server_tls13.cloneHash($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript, $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash)
				let hrrHello: $.Slice<number> = $.makeSlice<number>($.len($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).original), undefined, "byte")
				$.copy(hrrHello, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).original)
				hrrHello = bytes.Replace(hrrHello, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).encryptedClientHello, $.makeSlice<number>(8, undefined, "byte"), 1)
				await $.pointerValue<Exclude<hash.Hash, null>>(confTranscript).Write(hrrHello)
				let h: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null = $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo))
				let __goscriptTuple2: any = await hkdf.Extract(undefined, h, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerHello).random, null)
				let prk: $.Slice<number> = __goscriptTuple2[0]
				let err = __goscriptTuple2[1]
				if (err != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return err
				}
				let acceptConfirmation: $.Slice<number> = await tls13.ExpandLabel(undefined, h, prk, "hrr ech accept confirmation", await $.pointerValue<Exclude<hash.Hash, null>>(confTranscript).Sum(null), 8)
				if (subtle.ConstantTimeCompare(acceptConfirmation, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).encryptedClientHello) == 1) {
					hello = $.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerHello
					$.pointerValue<__goscript_conn.Conn>(c).serverName = $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ServerName
					isInnerHello = true
					$.pointerValue<__goscript_conn.Conn>(c).echAccepted = true
				}
			}

			{
				let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), ($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript as __goscript_handshake_messages.transcriptHash | null))
				if (err != null) {
					return err
				}
			}
		} else {
			if ($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).encryptedClientHello != null) {
				// Unsolicited ECH extension should be rejected
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
				return errors.New("tls: unexpected encrypted client hello extension in serverHello")
			}
		}

		// The only HelloRetryRequest extensions we support are key_share and
		// cookie, and clients must abort the handshake if the HRR would not result
		// in any change in the ClientHello.
		if (($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).selectedGroup, 16) == $.uint(0, 16)) && ($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).cookie == null)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server sent an unnecessary HelloRetryRequest message")
		}

		if ($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).cookie != null) {
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cookie = $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).cookie
		}

		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).serverShare.group, 16) != $.uint(0, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(50, 8))
			return errors.New("tls: received malformed key_share extension")
		}

		// If the server sent a key_share extension selecting a group, ensure it's
		// a group we advertised but did not send a key share for, and send a key
		// share for it this time.
		{
			let curveID = $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).selectedGroup, 16)
			if ($.uint(curveID, 16) != $.uint(0, 16)) {
				if (!slices.Contains($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedCurves, $.uint(curveID, 16))) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
					return errors.New("tls: server selected unsupported group")
				}
				if (slices.ContainsFunc($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).keyShares, $.functionValue((ks: __goscript_common.keyShare): boolean => {
					return $.uint(ks.group, 16) == $.uint(curveID, 16)
				}, ({ kind: $.TypeKind.Function, params: ["tls.keyShare"], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
					return errors.New("tls: server sent an unnecessary HelloRetryRequest key_share")
				}
				let [ke, err] = __goscript_key_schedule.keyExchangeForCurveID($.uint(curveID, 16))
				if (err != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return errors.New("tls: CurvePreferences includes unsupported curve")
				}
				let __goscriptTuple3: any = await $.pointerValue<Exclude<__goscript_key_schedule.keyExchange, null>>(ke).keyShares(__goscript_common.Config.prototype.rand.call($.pointerValue<__goscript_conn.Conn>(c).config))
				$.pointerValue<clientHandshakeStateTLS13>(hs).keyShareKeys = __goscriptTuple3[0]
				$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares = __goscriptTuple3[1]
				err = __goscriptTuple3[2]
				if (err != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return err
				}
				// Do not send the fallback ECDH key share in a HRR response.
				$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares = $.goSlice($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares, undefined, 1)
			}
		}

		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).pskIdentities) > 0) {
			let pskSuite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).cipherSuite, 16))
			if (pskSuite == null) {
				return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			}
			if ($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(pskSuite).hash == $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash) {
				// Update binders and obfuscated_ticket_age.
				let ticketAge = $.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<__goscript_conn.Conn>(c).config)))).Sub($.markAsStructValue($.cloneStructValue(time.Unix($.int64($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).createdAt), 0n))))
				$.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).pskIdentities!, 0).obfuscatedTicketAge = $.uint($.uint($.int64Div(ticketAge, 1000000n), 32) + $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).ageAdd, 32)

				let transcript = await crypto.Hash_New($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash)
				await $.pointerValue<Exclude<hash.Hash, null>>(transcript).Write(new Uint8Array([254, 0, 0, $.uint($.len(chHash), 8)]) as $.Slice<number>)
				await $.pointerValue<Exclude<hash.Hash, null>>(transcript).Write(chHash)
				{
					let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), (transcript as __goscript_handshake_messages.transcriptHash | null))
					if (err != null) {
						return err
					}
				}

				{
					let err = await __goscript_handshake_client.computeAndUpdatePSK(hello, $.pointerValue<clientHandshakeStateTLS13>(hs).binderKey, transcript, $.functionValue(((__receiver) => (baseKey: $.Slice<number>, transcript: hash.Hash | null) => __receiver.finishedHash(baseKey, transcript))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite)), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "hash.Hash"], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo)))
					if (err != null) {
						return err
					}
				}
			} else {
				// Server selected a cipher suite incompatible with the PSK.
				$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).pskIdentities = null
				$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).pskBinders = null
			}
		}

		if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).earlyData) {
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).earlyData = false
			__goscript_conn.Conn.prototype.quicRejectedEarlyData.call(c)
		}

		if (isInnerHello) {
			// Any extensions which have changed in hello, but are mirrored in the
			// outer hello and compressed, need to be copied to the outer hello, so
			// they can be properly decompressed by the server. For now, the only
			// extension which may have changed is keyShares.
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).keyShares = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares
			$.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerHello = hello
			{
				let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), ($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerTranscript as __goscript_handshake_messages.transcriptHash | null))
				if (err != null) {
					return err
				}
			}

			{
				let err = await __goscript_ech.computeAndUpdateOuterECHExtension($.pointerValue<clientHandshakeStateTLS13>(hs).hello, $.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).innerHello, $.pointerValue<clientHandshakeStateTLS13>(hs).echContext, false)
				if (err != null) {
					return err
				}
			}
		} else {
			$.pointerValue<clientHandshakeStateTLS13>(hs).hello = hello
		}

		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<clientHandshakeStateTLS13>(hs).hello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		// serverHelloMsg is not included in the transcript
		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, null)
		if (err != null) {
			return err
		}

		let __goscriptTuple4: any = $.typeAssertTuple<__goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" })
		let serverHello: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null = __goscriptTuple4[0]
		let ok = __goscriptTuple4[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(serverHello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), msg)
		}
		$.pointerValue<clientHandshakeStateTLS13>(hs).serverHello = serverHello

		{
			let __goscriptShadow2 = await clientHandshakeStateTLS13.prototype.checkServerHelloOrHRR.call(hs)
			if (__goscriptShadow2 != null) {
				return __goscriptShadow2
			}
		}

		$.pointerValue<__goscript_conn.Conn>(c).didHRR = true
		return null
	}

	public async processServerHello(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		if (bytes.Equal($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).random, __goscript_common.helloRetryRequestRandom)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return errors.New("tls: server sent two HelloRetryRequest messages")
		}

		if ($.len($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).cookie) != 0) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
			return errors.New("tls: server sent a cookie in a normal ServerHello")
		}

		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).selectedGroup, 16) != $.uint(0, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(50, 8))
			return errors.New("tls: malformed key_share extension")
		}

		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).serverShare.group, 16) == $.uint(0, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server did not send a key share")
		}
		if (!slices.ContainsFunc($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).keyShares, $.functionValue((ks: __goscript_common.keyShare): boolean => {
			return $.uint(ks.group, 16) == $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).serverShare.group, 16)
		}, ({ kind: $.TypeKind.Function, params: ["tls.keyShare"], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server selected unsupported group")
		}

		if (!$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).selectedIdentityPresent) {
			return null
		}

		if ($.int($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).serverHello).selectedIdentity) >= $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).pskIdentities)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server selected an invalid PSK")
		}

		if (($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).pskIdentities) != 1) || ($.pointerValue<clientHandshakeStateTLS13>(hs).session == null)) {
			return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
		}
		let pskSuite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).cipherSuite, 16))
		if (pskSuite == null) {
			return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
		}
		if ($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(pskSuite).hash != $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).hash) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server selected an invalid PSK and cipher suite pair")
		}

		$.pointerValue<clientHandshakeStateTLS13>(hs).usingPSK = true
		$.pointerValue<__goscript_conn.Conn>(c).didResume = true
		$.pointerValue<__goscript_conn.Conn>(c).peerCertificates = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).peerCertificates
		$.pointerValue<__goscript_conn.Conn>(c).verifiedChains = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).verifiedChains
		$.pointerValue<__goscript_conn.Conn>(c).ocspResponse = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).ocspResponse
		$.pointerValue<__goscript_conn.Conn>(c).scts = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).scts
		return null
	}

	public async readServerCertificate(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		// Either a PSK or a certificate is always used, but not both.
		// See RFC 8446, Section 4.1.1.
		if ($.pointerValue<clientHandshakeStateTLS13>(hs).usingPSK) {
			// Make sure the connection is still being verified whether or not this
			// is a resumption. Resumptions currently don't reverify certificates so
			// they don't call verifyServerCertificate. See Issue 31641.
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

		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
		if (err != null) {
			return err
		}

		let __goscriptTuple5: any = $.typeAssertTuple<__goscript_handshake_messages.certificateRequestMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateRequestMsgTLS13" })
		let certReq: __goscript_handshake_messages.certificateRequestMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateRequestMsgTLS13> | null = __goscriptTuple5[0]
		let ok = __goscriptTuple5[1]
		if (ok) {
			$.pointerValue<clientHandshakeStateTLS13>(hs).certReq = certReq

			let __goscriptTuple6: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			msg = __goscriptTuple6[0]
			err = __goscriptTuple6[1]
			if (err != null) {
				return err
			}
		}

		let __goscriptTuple7: any = $.typeAssertTuple<__goscript_handshake_messages.certificateMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateMsgTLS13> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsgTLS13" })
		let certMsg: __goscript_handshake_messages.certificateMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateMsgTLS13> | null = __goscriptTuple7[0]
		ok = __goscriptTuple7[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(certMsg, "*tls.certificateMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsgTLS13" }), msg)
		}
		if ($.len($.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).certificate.Certificate) == 0) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(50, 8))
			return errors.New("tls: received empty certificates message")
		}

		$.pointerValue<__goscript_conn.Conn>(c).scts = $.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).certificate.SignedCertificateTimestamps
		$.pointerValue<__goscript_conn.Conn>(c).ocspResponse = $.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).certificate.OCSPStaple

		{
			let __goscriptShadow3 = await __goscript_conn.Conn.prototype.verifyServerCertificate.call(c, $.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).certificate.Certificate)
			if (__goscriptShadow3 != null) {
				return __goscriptShadow3
			}
		}

		// certificateVerifyMsg is included in the transcript, but not until
		// after we verify the handshake signature, since the state before
		// this message was sent is used.
		let __goscriptTuple8: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, null)
		msg = __goscriptTuple8[0]
		err = __goscriptTuple8[1]
		if (err != null) {
			return err
		}

		let __goscriptTuple9: any = $.typeAssertTuple<__goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" })
		let certVerify: __goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null = __goscriptTuple9[0]
		ok = __goscriptTuple9[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(certVerify, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), msg)
		}

		// See RFC 8446, Section 4.4.3.
		// We don't use hs.hello.supportedSignatureAlgorithms because it might
		// include PKCS#1 v1.5 and SHA-1 if the ClientHello also supported TLS 1.2.
		if (!__goscript_common.isSupportedSignatureAlgorithm($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16), __goscript_common.supportedSignatureAlgorithms($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16))) || !__goscript_common.isSupportedSignatureAlgorithm($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16), await __goscript_auth.signatureSchemesForPublicKey($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), ($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_conn.Conn>(c).peerCertificates!, 0)).PublicKey as crypto.PublicKey | null)))) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: certificate used with invalid signature algorithm")
		}
		let __goscriptTuple10: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16))
		let sigType = $.uint(__goscriptTuple10[0], 8)
		let sigHash = __goscriptTuple10[1]
		err = __goscriptTuple10[2]
		if (err != null) {
			return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
		}
		if (($.uint(sigType, 8) == $.uint(225, 8)) || (sigHash == crypto.SHA1)) {
			return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
		}
		let signed: $.Slice<number> = await __goscript_auth.signedMessage("TLS 1.3, server CertificateVerify\x00", $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)
		{
			let __goscriptShadow4 = await __goscript_auth.verifyHandshakeSignature($.uint(sigType, 8), ($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_conn.Conn>(c).peerCertificates!, 0)).PublicKey as crypto.PublicKey | null), sigHash, signed, $.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signature)
			if (__goscriptShadow4 != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(51, 8))
				return errors.New("tls: invalid signature by the server certificate: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow4).Error())
			}
		}
		$.pointerValue<__goscript_conn.Conn>(c).peerSigAlg = $.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16)

		{
			let __goscriptShadow5 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(certVerify, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (__goscriptShadow5 != null) {
				return __goscriptShadow5
			}
		}

		return null
	}

	public async readServerFinished(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		// finishedMsg is included in the transcript, but not until after we
		// check the client version, since the state before this message was
		// sent is used during verification.
		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, null)
		if (err != null) {
			return err
		}

		let __goscriptTuple11: any = $.typeAssertTuple<__goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" })
		let finished: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = __goscriptTuple11[0]
		let ok = __goscriptTuple11[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(finished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), msg)
		}

		let expectedMAC: $.Slice<number> = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.finishedHash.call($.pointerValue<clientHandshakeStateTLS13>(hs).suite, $.pointerValue<__goscript_conn.Conn>(c)._in.trafficSecret, $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)
		if (!hmac.Equal(expectedMAC, $.pointerValue<__goscript_handshake_messages.finishedMsg>(finished).verifyData)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(51, 8))
			return errors.New("tls: invalid server finished hash")
		}

		{
			let __goscriptShadow6 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(finished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (__goscriptShadow6 != null) {
				return __goscriptShadow6
			}
		}

		// Derive secrets that take context through the server Finished.

		$.pointerValue<clientHandshakeStateTLS13>(hs).trafficSecret = await tls13.MasterSecret.prototype.ClientApplicationTrafficSecret.call($.pointerValue<clientHandshakeStateTLS13>(hs).masterSecret, $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)
		let serverSecret: $.Slice<number> = await tls13.MasterSecret.prototype.ServerApplicationTrafficSecret.call($.pointerValue<clientHandshakeStateTLS13>(hs).masterSecret, $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)
		{
			let __goscriptShadow7 = await __goscript_conn.Conn.prototype.setReadTrafficSecret.call(c, $.pointerValue<clientHandshakeStateTLS13>(hs).suite, 3, serverSecret, false)
			if (__goscriptShadow7 != null) {
				return __goscriptShadow7
			}
		}

		err = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "CLIENT_TRAFFIC_SECRET_0", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).random, $.pointerValue<clientHandshakeStateTLS13>(hs).trafficSecret)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}
		err = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "SERVER_TRAFFIC_SECRET_0", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).random, serverSecret)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}

		$.pointerValue<__goscript_conn.Conn>(c).ekm = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.exportKeyingMaterial.call($.pointerValue<clientHandshakeStateTLS13>(hs).suite, $.pointerValue<clientHandshakeStateTLS13>(hs).masterSecret, $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)

		return null
	}

	public async readServerParameters(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
		if (err != null) {
			return err
		}

		let __goscriptTuple12: any = $.typeAssertTuple<__goscript_handshake_messages.encryptedExtensionsMsg | $.VarRef<__goscript_handshake_messages.encryptedExtensionsMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.encryptedExtensionsMsg" })
		let encryptedExtensions: __goscript_handshake_messages.encryptedExtensionsMsg | $.VarRef<__goscript_handshake_messages.encryptedExtensionsMsg> | null = __goscriptTuple12[0]
		let ok = __goscriptTuple12[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(encryptedExtensions, "*tls.encryptedExtensionsMsg", { kind: $.TypeKind.Pointer, elemType: "tls.encryptedExtensionsMsg" }), msg)
		}

		{
			let __goscriptShadow8 = __goscript_handshake_client.checkALPN($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).alpnProtocols, $.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).alpnProtocol, $.pointerValue<__goscript_conn.Conn>(c).quic != null)
			if (__goscriptShadow8 != null) {
				// RFC 8446 specifies that no_application_protocol is sent by servers, but
				// does not specify how clients handle the selection of an incompatible protocol.
				// RFC 9001 Section 8.1 specifies that QUIC clients send no_application_protocol
				// in this case. Always sending no_application_protocol seems reasonable.
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(120, 8))
				return __goscriptShadow8
			}
		}
		$.pointerValue<__goscript_conn.Conn>(c).clientProtocol = $.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).alpnProtocol

		if ($.pointerValue<__goscript_conn.Conn>(c).quic != null) {
			if ($.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).quicTransportParameters == null) {
				// RFC 9001 Section 8.2.
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(109, 8))
				return errors.New("tls: server did not send a quic_transport_parameters extension")
			}
			__goscript_conn.Conn.prototype.quicSetTransportParameters.call(c, $.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).quicTransportParameters)
		} else {
			if ($.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).quicTransportParameters != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
				return errors.New("tls: server sent an unexpected quic_transport_parameters extension")
			}
		}

		if (!$.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).earlyData && $.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).earlyData) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
			return errors.New("tls: server sent an unexpected early_data extension")
		}
		if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeStateTLS13>(hs).hello).earlyData && !$.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).earlyData) {
			__goscript_conn.Conn.prototype.quicRejectedEarlyData.call(c)
		}
		if ($.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).earlyData) {
			if ($.uint($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).cipherSuite, 16) != $.uint($.pointerValue<__goscript_conn.Conn>(c).cipherSuite, 16)) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
				return errors.New("tls: server accepted 0-RTT with the wrong cipher suite")
			}
			if (!$.stringEqual($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeStateTLS13>(hs).session).alpnProtocol, $.pointerValue<__goscript_conn.Conn>(c).clientProtocol)) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
				return errors.New("tls: server accepted 0-RTT with the wrong ALPN")
			}
		}
		if ($.pointerValue<clientHandshakeStateTLS13>(hs).echContext != null) {
			if ($.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).echRejected) {
				$.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).retryConfigs = $.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).echRetryConfigs
			} else {
				if ($.pointerValue<__goscript_handshake_messages.encryptedExtensionsMsg>(encryptedExtensions).echRetryConfigs != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
					return errors.New("tls: server sent encrypted client hello retry configs after accepting encrypted client hello")
				}
			}
		}

		return null
	}

	public async sendClientCertificate(): globalThis.Promise<$.GoError> {
		const hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		if ($.pointerValue<clientHandshakeStateTLS13>(hs).certReq == null) {
			return null
		}

		if (($.pointerValue<clientHandshakeStateTLS13>(hs).echContext != null) && $.pointerValue<__goscript_handshake_client.echClientContext>($.pointerValue<clientHandshakeStateTLS13>(hs).echContext).echRejected) {
			{
				let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.certificateMsgTLS13(), "*tls.certificateMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsgTLS13" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
				if (err != null) {
					return err
				}
			}
			return null
		}

		let __goscriptTuple13: any = await __goscript_conn.Conn.prototype.getClientCertificate.call(c, new __goscript_common.CertificateRequestInfo({AcceptableCAs: $.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).certReq).certificateAuthorities, SignatureSchemes: $.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).certReq).supportedSignatureAlgorithms, Version: $.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), ctx: $.pointerValue<clientHandshakeStateTLS13>(hs).ctx}))
		let cert: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null = __goscriptTuple13[0]
		let err = __goscriptTuple13[1]
		if (err != null) {
			return err
		}

		let certMsg: __goscript_handshake_messages.certificateMsgTLS13 | $.VarRef<__goscript_handshake_messages.certificateMsgTLS13> | null = new __goscript_handshake_messages.certificateMsgTLS13()

		$.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).certificate = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_common.Certificate>(cert)))
		$.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).scts = $.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).certReq).scts && ($.len($.pointerValue<__goscript_common.Certificate>(cert).SignedCertificateTimestamps) > 0)
		$.pointerValue<__goscript_handshake_messages.certificateMsgTLS13>(certMsg).ocspStapling = $.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).certReq).ocspStapling && ($.len($.pointerValue<__goscript_common.Certificate>(cert).OCSPStaple) > 0)

		{
			let [, __goscriptShadow9] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certMsg, "*tls.certificateMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsgTLS13" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (__goscriptShadow9 != null) {
				return __goscriptShadow9
			}
		}

		// If we sent an empty certificate message, skip the CertificateVerify.
		if ($.len($.pointerValue<__goscript_common.Certificate>(cert).Certificate) == 0) {
			return null
		}

		let certVerifyMsg: __goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null = new __goscript_handshake_messages.certificateVerifyMsg()
		$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerifyMsg).hasSignatureAlgorithm = true

		let __goscriptTuple14: any = await __goscript_auth.selectSignatureScheme($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), cert, $.pointerValue<__goscript_handshake_messages.certificateRequestMsgTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).certReq).supportedSignatureAlgorithms)
		$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerifyMsg).signatureAlgorithm = $.uint(__goscriptTuple14[0], 16)
		err = __goscriptTuple14[1]
		if (err != null) {
			// getClientCertificate returned a certificate incompatible with the
			// CertificateRequestInfo supported signature algorithms.
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return err
		}

		let __goscriptTuple15: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerifyMsg).signatureAlgorithm, 16))
		let sigType = $.uint(__goscriptTuple15[0], 8)
		let sigHash = __goscriptTuple15[1]
		err = __goscriptTuple15[2]
		if (err != null) {
			return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
		}

		let signed: $.Slice<number> = await __goscript_auth.signedMessage("TLS 1.3, client CertificateVerify\x00", $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)
		let signOpts = $.namedValueInterfaceValue<crypto.SignerOpts | null>(sigHash, "crypto.Hash", {Available: (receiver: any, ...args: any[]) => (crypto.Hash_Available as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), HashFunc: (receiver: any, ...args: any[]) => (crypto.Hash_HashFunc as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), New: (receiver: any, ...args: any[]) => (crypto.Hash_New as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Size: (receiver: any, ...args: any[]) => (crypto.Hash_Size as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (crypto.Hash_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, [{ name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "New", args: [], returns: [{ name: "_r0", type: "hash.Hash" }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])
		if ($.uint(sigType, 8) == $.uint(226, 8)) {
			signOpts = $.interfaceValue<crypto.SignerOpts | null>(new rsa.PSSOptions({SaltLength: rsa.PSSSaltLengthEqualsHash, Hash: sigHash}), "*rsa.PSSOptions", { kind: $.TypeKind.Pointer, elemType: "rsa.PSSOptions" })
		}
		let __goscriptTuple16: any = await crypto.SignMessage($.mustTypeAssert<crypto.Signer | null>($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey, "crypto.Signer"), __goscript_common.Config.prototype.rand.call($.pointerValue<__goscript_conn.Conn>(c).config), signed, signOpts)
		let sig: $.Slice<number> = __goscriptTuple16[0]
		err = __goscriptTuple16[1]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return errors.New("tls: failed to sign handshake: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
		$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerifyMsg).signature = sig

		{
			let [, __goscriptShadow10] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certVerifyMsg, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (__goscriptShadow10 != null) {
				return __goscriptShadow10
			}
		}

		return null
	}

	public async sendClientFinished(): globalThis.Promise<$.GoError> {
		const hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeStateTLS13>(hs).c

		let finished: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = (await (async () => { const __goscriptLiteralField0 = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.finishedHash.call($.pointerValue<clientHandshakeStateTLS13>(hs).suite, $.pointerValue<__goscript_conn.Conn>(c).out.trafficSecret, $.pointerValue<clientHandshakeStateTLS13>(hs).transcript); return new __goscript_handshake_messages.finishedMsg({verifyData: __goscriptLiteralField0}) })())

		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeStateTLS13>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(finished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), ($.pointerValue<clientHandshakeStateTLS13>(hs).transcript as __goscript_handshake_messages.transcriptHash | null))
			if (err != null) {
				return err
			}
		}

		await __goscript_conn.Conn.prototype.setWriteTrafficSecret.call(c, $.pointerValue<clientHandshakeStateTLS13>(hs).suite, 3, $.pointerValue<clientHandshakeStateTLS13>(hs).trafficSecret)

		if (!$.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).SessionTicketsDisabled && ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientSessionCache != null)) {
			$.pointerValue<__goscript_conn.Conn>(c).resumptionSecret = await tls13.MasterSecret.prototype.ResumptionMasterSecret.call($.pointerValue<clientHandshakeStateTLS13>(hs).masterSecret, $.pointerValue<clientHandshakeStateTLS13>(hs).transcript)
		}

		if ($.pointerValue<__goscript_conn.Conn>(c).quic != null) {
			__goscript_conn.Conn.prototype.quicSetWriteSecret.call(c, 3, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>($.pointerValue<clientHandshakeStateTLS13>(hs).suite).id, 16), $.pointerValue<clientHandshakeStateTLS13>(hs).trafficSecret)
		}

		return null
	}

	public async sendDummyChangeCipherSpec(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeStateTLS13 | $.VarRef<clientHandshakeStateTLS13> | null = this
		if ($.pointerValue<__goscript_conn.Conn>($.pointerValue<clientHandshakeStateTLS13>(hs).c).quic != null) {
			return null
		}
		if ($.pointerValue<clientHandshakeStateTLS13>(hs).sentDummyCCS) {
			return null
		}
		$.pointerValue<clientHandshakeStateTLS13>(hs).sentDummyCCS = true

		return __goscript_conn.Conn.prototype.writeChangeCipherRecord.call($.pointerValue<clientHandshakeStateTLS13>(hs).c)
	}

	static __typeInfo = $.registerStructType(
		"tls.clientHandshakeStateTLS13",
		() => new clientHandshakeStateTLS13(),
		[{ name: "checkServerHelloOrHRR", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "establishHandshakeKeys", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "handshake", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "processHelloRetryRequest", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "processServerHello", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readServerCertificate", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readServerFinished", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readServerParameters", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendClientCertificate", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendClientFinished", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendDummyChangeCipherSpec", args: [], returns: [{ name: "_r0", type: "error" }] }],
		clientHandshakeStateTLS13,
		[{ name: "c", key: "c", type: { kind: $.TypeKind.Pointer, elemType: "tls.Conn" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "ctx", key: "ctx", type: "context.Context", pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "serverHello", key: "serverHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }, pkgPath: "crypto/tls", index: [2], offset: 24, exported: false }, { name: "hello", key: "hello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }, pkgPath: "crypto/tls", index: [3], offset: 32, exported: false }, { name: "keyShareKeys", key: "keyShareKeys", type: { kind: $.TypeKind.Pointer, elemType: "tls.keySharePrivateKeys" }, pkgPath: "crypto/tls", index: [4], offset: 40, exported: false }, { name: "session", key: "session", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" }, pkgPath: "crypto/tls", index: [5], offset: 48, exported: false }, { name: "earlySecret", key: "earlySecret", type: { kind: $.TypeKind.Pointer, elemType: "tls13.EarlySecret" }, pkgPath: "crypto/tls", index: [6], offset: 56, exported: false }, { name: "binderKey", key: "binderKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [7], offset: 64, exported: false }, { name: "certReq", key: "certReq", type: { kind: $.TypeKind.Pointer, elemType: "tls.certificateRequestMsgTLS13" }, pkgPath: "crypto/tls", index: [8], offset: 88, exported: false }, { name: "usingPSK", key: "usingPSK", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [9], offset: 96, exported: false }, { name: "sentDummyCCS", key: "sentDummyCCS", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [10], offset: 97, exported: false }, { name: "suite", key: "suite", type: { kind: $.TypeKind.Pointer, elemType: "tls.cipherSuiteTLS13" }, pkgPath: "crypto/tls", index: [11], offset: 104, exported: false }, { name: "transcript", key: "transcript", type: "hash.Hash", pkgPath: "crypto/tls", index: [12], offset: 112, exported: false }, { name: "masterSecret", key: "masterSecret", type: { kind: $.TypeKind.Pointer, elemType: "tls13.MasterSecret" }, pkgPath: "crypto/tls", index: [13], offset: 128, exported: false }, { name: "trafficSecret", key: "trafficSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [14], offset: 136, exported: false }, { name: "echContext", key: "echContext", type: { kind: $.TypeKind.Pointer, elemType: "tls.echClientContext" }, pkgPath: "crypto/tls", index: [15], offset: 160, exported: false }]
	)
}
