// Generated file based on handshake_client.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as fips140tls from "@goscript/crypto/tls/internal/fips140tls/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as hash from "@goscript/hash/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as time from "@goscript/time/index.js"

import type * as cipher from "@goscript/crypto/cipher/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as big from "@goscript/math/big/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_alert from "./alert.gs.ts"

import * as __goscript_auth from "./auth.gs.ts"

import * as __goscript_cache from "./cache.gs.ts"

import * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_conn from "./conn.gs.ts"

import * as __goscript_defaults from "./defaults.gs.ts"

import * as __goscript_defaults_fips140 from "./defaults_fips140.gs.ts"

import * as __goscript_ech from "./ech.gs.ts"

import * as __goscript_handshake_client_tls13 from "./handshake_client_tls13.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_handshake_server from "./handshake_server.gs.ts"

import * as __goscript_handshake_server_tls13 from "./handshake_server_tls13.gs.ts"

import * as __goscript_key_agreement from "./key_agreement.gs.ts"

import * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_prf from "./prf.gs.ts"

import * as __goscript_quic from "./quic.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/crypto/internal/fips140/tls13/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/crypto/tls/internal/fips140tls/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/hash/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/time/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/math/big/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "./alert.gs.ts"
import "./auth.gs.ts"
import "./cache.gs.ts"
import "./cipher_suites.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./conn.gs.ts"
import "./defaults.gs.ts"
import "./defaults_fips140.gs.ts"
import "./ech.gs.ts"
import "./handshake_client_tls13.gs.ts"
import "./handshake_messages.gs.ts"
import "./handshake_server.gs.ts"
import "./handshake_server_tls13.gs.ts"
import "./key_agreement.gs.ts"
import "./key_schedule.gs.ts"
import "./prf.gs.ts"
import "./quic.gs.ts"
import "./ticket.gs.ts"

export class clientHandshakeState {
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

	public get suite(): __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null {
		return this._fields.suite.value
	}
	public set suite(value: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null) {
		this._fields.suite.value = value
	}

	public get finishedHash(): __goscript_prf.finishedHash {
		return this._fields.finishedHash.value
	}
	public set finishedHash(value: __goscript_prf.finishedHash) {
		this._fields.finishedHash.value = value
	}

	public get masterSecret(): $.Slice<number> {
		return this._fields.masterSecret.value
	}
	public set masterSecret(value: $.Slice<number>) {
		this._fields.masterSecret.value = value
	}

	public get session(): __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null {
		return this._fields.session.value
	}
	public set session(value: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) {
		this._fields.session.value = value
	}

	public get ticket(): $.Slice<number> {
		return this._fields.ticket.value
	}
	public set ticket(value: $.Slice<number>) {
		this._fields.ticket.value = value
	}

	public _fields: {
		c: $.VarRef<__goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null>
		ctx: $.VarRef<context.Context | null>
		serverHello: $.VarRef<__goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null>
		hello: $.VarRef<__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null>
		suite: $.VarRef<__goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null>
		finishedHash: $.VarRef<__goscript_prf.finishedHash>
		masterSecret: $.VarRef<$.Slice<number>>
		session: $.VarRef<__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null>
		ticket: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{c?: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, ctx?: context.Context | null, serverHello?: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null, hello?: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, suite?: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null, finishedHash?: __goscript_prf.finishedHash, masterSecret?: $.Slice<number>, session?: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, ticket?: $.Slice<number>}>) {
		this._fields = {
			c: $.varRef(init?.c ?? (null as __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null)),
			ctx: $.varRef(init?.ctx ?? (null as context.Context | null)),
			serverHello: $.varRef(init?.serverHello ?? (null as __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null)),
			hello: $.varRef(init?.hello ?? (null as __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null)),
			suite: $.varRef(init?.suite ?? (null as __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null)),
			finishedHash: $.varRef(init?.finishedHash ? $.markAsStructValue($.cloneStructValue(init.finishedHash)) : $.markAsStructValue(new __goscript_prf.finishedHash())),
			masterSecret: $.varRef(init?.masterSecret ?? (null as $.Slice<number>)),
			session: $.varRef(init?.session ?? (null as __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null)),
			ticket: $.varRef(init?.ticket ?? (null as $.Slice<number>))
		}
	}

	public clone(): clientHandshakeState {
		const cloned = new clientHandshakeState()
		cloned._fields = {
			c: $.varRef(this._fields.c.value),
			ctx: $.varRef(this._fields.ctx.value),
			serverHello: $.varRef(this._fields.serverHello.value),
			hello: $.varRef(this._fields.hello.value),
			suite: $.varRef(this._fields.suite.value),
			finishedHash: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.finishedHash.value))),
			masterSecret: $.varRef(this._fields.masterSecret.value),
			session: $.varRef(this._fields.session.value),
			ticket: $.varRef(this._fields.ticket.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async doFullHandshake(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeState>(hs).c

		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
		if (err != null) {
			return err
		}
		let __goscriptTuple0: any = $.typeAssertTuple<__goscript_handshake_messages.certificateMsg | $.VarRef<__goscript_handshake_messages.certificateMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsg" })
		let certMsg: __goscript_handshake_messages.certificateMsg | $.VarRef<__goscript_handshake_messages.certificateMsg> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (!ok || ($.len($.pointerValue<__goscript_handshake_messages.certificateMsg>(certMsg).certificates) == 0)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(certMsg, "*tls.certificateMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsg" }), msg)
		}

		let __goscriptTuple1: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
		msg = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (err != null) {
			return err
		}

		let __goscriptTuple2: any = $.typeAssertTuple<__goscript_handshake_messages.certificateStatusMsg | $.VarRef<__goscript_handshake_messages.certificateStatusMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateStatusMsg" })
		let cs: __goscript_handshake_messages.certificateStatusMsg | $.VarRef<__goscript_handshake_messages.certificateStatusMsg> | null = __goscriptTuple2[0]
		ok = __goscriptTuple2[1]
		if (ok) {
			// RFC4366 on Certificate Status Request:
			// The server MAY return a "certificate_status" message.

			if (!$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).ocspStapling) {
				// If a server returns a "CertificateStatus" message, then the
				// server MUST have included an extension of type "status_request"
				// with empty "extension_data" in the extended server hello.

				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
				return errors.New("tls: received unexpected CertificateStatus message")
			}

			$.pointerValue<__goscript_conn.Conn>(c).ocspResponse = $.pointerValue<__goscript_handshake_messages.certificateStatusMsg>(cs).response

			let __goscriptTuple3: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			msg = __goscriptTuple3[0]
			err = __goscriptTuple3[1]
			if (err != null) {
				return err
			}
		}

		if ($.pointerValue<__goscript_conn.Conn>(c).handshakes == 0) {
			// If this is the first handshake on a connection, process and
			// (optionally) verify the server's certificates.
			{
				let __goscriptShadow0 = await __goscript_conn.Conn.prototype.verifyServerCertificate.call(c, $.pointerValue<__goscript_handshake_messages.certificateMsg>(certMsg).certificates)
				if (__goscriptShadow0 != null) {
					return __goscriptShadow0
				}
			}
		} else {
			// This is a renegotiation handshake. We require that the
			// server's identity (i.e. leaf certificate) is unchanged and
			// thus any previous trust decision is still valid.
			//
			// See https://mitls.org/pages/attacks/3SHAKE for the
			// motivation behind this requirement.
			if (!bytes.Equal($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_conn.Conn>(c).peerCertificates!, 0)).Raw, $.arrayIndex($.pointerValue<__goscript_handshake_messages.certificateMsg>(certMsg).certificates!, 0))) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(42, 8))
				return errors.New("tls: server's identity changed during renegotiation")
			}
		}

		let __goscriptShadow1 = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).ka!($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16))

		let __goscriptTuple4: any = $.typeAssertTuple<__goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" })
		let skx: __goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null = __goscriptTuple4[0]
		ok = __goscriptTuple4[1]
		if (ok) {
			err = await $.pointerValue<Exclude<__goscript_key_agreement.keyAgreement, null>>(__goscriptShadow1).processServerKeyExchange($.pointerValue<__goscript_conn.Conn>(c).config, $.pointerValue<clientHandshakeState>(hs).hello, $.pointerValue<clientHandshakeState>(hs).serverHello, $.arrayIndex($.pointerValue<__goscript_conn.Conn>(c).peerCertificates!, 0), skx)
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
				return err
			}
			let __goscriptShadow2 = __goscriptShadow1
			{
				let __goscriptTuple5: any = $.typeAssertTuple<__goscript_key_agreement.ecdheKeyAgreement | $.VarRef<__goscript_key_agreement.ecdheKeyAgreement> | null>(__goscriptShadow2, { kind: $.TypeKind.Pointer, elemType: "tls.ecdheKeyAgreement" })
				let __goscriptShadow3: __goscript_key_agreement.ecdheKeyAgreement | $.VarRef<__goscript_key_agreement.ecdheKeyAgreement> | null = __goscriptTuple5[0]
				let __goscriptShadow4 = __goscriptTuple5[1]
				if (__goscriptShadow4) {
					$.pointerValue<__goscript_conn.Conn>(c).curveID = $.uint($.pointerValue<__goscript_key_agreement.ecdheKeyAgreement>(__goscriptShadow3).curveID, 16)
					$.pointerValue<__goscript_conn.Conn>(c).peerSigAlg = $.uint($.pointerValue<__goscript_key_agreement.ecdheKeyAgreement>(__goscriptShadow3).signatureAlgorithm, 16)
				}
			}

			let __goscriptTuple6: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			msg = __goscriptTuple6[0]
			err = __goscriptTuple6[1]
			if (err != null) {
				return err
			}
		}

		let chainToSend: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null = null as __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null
		let certRequested: boolean = false
		let __goscriptTuple7: any = $.typeAssertTuple<__goscript_handshake_messages.certificateRequestMsg | $.VarRef<__goscript_handshake_messages.certificateRequestMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateRequestMsg" })
		let certReq: __goscript_handshake_messages.certificateRequestMsg | $.VarRef<__goscript_handshake_messages.certificateRequestMsg> | null = __goscriptTuple7[0]
		ok = __goscriptTuple7[1]
		if (ok) {
			certRequested = true

			let cri: __goscript_common.CertificateRequestInfo | $.VarRef<__goscript_common.CertificateRequestInfo> | null = certificateRequestInfoFromMsg($.pointerValue<clientHandshakeState>(hs).ctx, $.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), certReq)
			{
				let __goscriptTuple8: any = await __goscript_conn.Conn.prototype.getClientCertificate.call(c, cri)
				chainToSend = __goscriptTuple8[0]
				err = __goscriptTuple8[1]
				if (err != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return err
				}
			}

			let __goscriptTuple9: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			msg = __goscriptTuple9[0]
			err = __goscriptTuple9[1]
			if (err != null) {
				return err
			}
		}

		let __goscriptTuple10: any = $.typeAssertTuple<__goscript_handshake_messages.serverHelloDoneMsg | $.VarRef<__goscript_handshake_messages.serverHelloDoneMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloDoneMsg" })
		let shd: __goscript_handshake_messages.serverHelloDoneMsg | $.VarRef<__goscript_handshake_messages.serverHelloDoneMsg> | null = __goscriptTuple10[0]
		ok = __goscriptTuple10[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(shd, "*tls.serverHelloDoneMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloDoneMsg" }), msg)
		}

		// If the server requested a certificate then we have to send a
		// Certificate message, even if it's empty because we don't have a
		// certificate to send.
		if (certRequested) {
			certMsg = new __goscript_handshake_messages.certificateMsg()
			$.pointerValue<__goscript_handshake_messages.certificateMsg>(certMsg).certificates = $.pointerValue<__goscript_common.Certificate>(chainToSend).Certificate
			{
				let [, __goscriptShadow5] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certMsg, "*tls.certificateMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
				if (__goscriptShadow5 != null) {
					return __goscriptShadow5
				}
			}
		}

		let __goscriptTuple11: any = await $.pointerValue<Exclude<__goscript_key_agreement.keyAgreement, null>>(__goscriptShadow1).generateClientKeyExchange($.pointerValue<__goscript_conn.Conn>(c).config, $.pointerValue<clientHandshakeState>(hs).hello, $.arrayIndex($.pointerValue<__goscript_conn.Conn>(c).peerCertificates!, 0))
		let preMasterSecret: $.Slice<number> = __goscriptTuple11[0]
		let ckx: __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null = __goscriptTuple11[1]
		err = __goscriptTuple11[2]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}
		if (ckx != null) {
			{
				let [, __goscriptShadow6] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(ckx, "*tls.clientKeyExchangeMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
				if (__goscriptShadow6 != null) {
					return __goscriptShadow6
				}
			}
		}

		if ($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).extendedMasterSecret) {
			$.pointerValue<__goscript_conn.Conn>(c).extMasterSecret = true
			$.pointerValue<clientHandshakeState>(hs).masterSecret = await __goscript_prf.extMasterFromPreMasterSecret($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<clientHandshakeState>(hs).suite, preMasterSecret, await $.markAsStructValue($.cloneStructValue($.pointerValue<clientHandshakeState>(hs).finishedHash)).Sum())
		} else {
			if (fips140tls.Required()) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
				return errors.New("tls: FIPS 140-3 requires the use of Extended Master Secret")
			}
			$.pointerValue<clientHandshakeState>(hs).masterSecret = await __goscript_prf.masterFromPreMasterSecret($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<clientHandshakeState>(hs).suite, preMasterSecret, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).random)
		}
		{
			let __goscriptShadow7 = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "CLIENT_RANDOM", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).random, $.pointerValue<clientHandshakeState>(hs).masterSecret)
			if (__goscriptShadow7 != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return errors.New("tls: failed to write to key log: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow7).Error())
			}
		}

		if ((chainToSend != null) && ($.len($.pointerValue<__goscript_common.Certificate>(chainToSend).Certificate) > 0)) {
			let certVerify: __goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null = new __goscript_handshake_messages.certificateVerifyMsg()

			let [key, __goscriptShadow8] = $.typeAssertTuple<crypto.Signer | null>($.pointerValue<__goscript_common.Certificate>(chainToSend).PrivateKey, "crypto.Signer")
			if (!__goscriptShadow8) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return fmt.Errorf("tls: client certificate private key of type %T does not implement crypto.Signer", ($.pointerValue<__goscript_common.Certificate>(chainToSend).PrivateKey as any))
			}

			if ($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16) >= $.uint(771, 16)) {
				let __goscriptTuple12: any = await __goscript_auth.selectSignatureScheme($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), chainToSend, $.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).supportedSignatureAlgorithms)
				let signatureAlgorithm = $.uint(__goscriptTuple12[0], 16)
				let __goscriptShadow9 = __goscriptTuple12[1]
				if (__goscriptShadow9 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
					return __goscriptShadow9
				}
				let __goscriptTuple13: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint(signatureAlgorithm, 16))
				let sigType = $.uint(__goscriptTuple13[0], 8)
				let sigHash = __goscriptTuple13[1]
				__goscriptShadow9 = __goscriptTuple13[2]
				if (__goscriptShadow9 != null) {
					return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				}
				$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).hasSignatureAlgorithm = true
				$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm = $.uint(signatureAlgorithm, 16)
				if (sigHash == crypto.SHA1) {
					godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1))
					godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1))
				}
				if ($.pointerValue<clientHandshakeState>(hs).finishedHash.buffer == null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return errors.New("tls: internal error: did not keep handshake transcript for TLS 1.2")
				}
				let signOpts = $.namedValueInterfaceValue<crypto.SignerOpts | null>(sigHash, "crypto.Hash", {Available: (receiver: any, ...args: any[]) => (crypto.Hash_Available as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), HashFunc: (receiver: any, ...args: any[]) => (crypto.Hash_HashFunc as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), New: (receiver: any, ...args: any[]) => (crypto.Hash_New as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Size: (receiver: any, ...args: any[]) => (crypto.Hash_Size as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (crypto.Hash_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, [{ name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "New", args: [], returns: [{ name: "_r0", type: "hash.Hash" }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])
				if ($.uint(sigType, 8) == $.uint(226, 8)) {
					signOpts = $.interfaceValue<crypto.SignerOpts | null>(new rsa.PSSOptions({SaltLength: rsa.PSSSaltLengthEqualsHash, Hash: sigHash}), "*rsa.PSSOptions", { kind: $.TypeKind.Pointer, elemType: "rsa.PSSOptions" })
				}
				let __goscriptTuple14: any = await crypto.SignMessage(key, __goscript_common.Config.prototype.rand.call($.pointerValue<__goscript_conn.Conn>(c).config), $.pointerValue<clientHandshakeState>(hs).finishedHash.buffer, signOpts)
				$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signature = __goscriptTuple14[0]
				__goscriptShadow9 = __goscriptTuple14[1]
				if (__goscriptShadow9 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return __goscriptShadow9
				}
			} else {
				let __goscriptTuple15: any = __goscript_auth.legacyTypeAndHashFromPublicKey(await $.pointerValue<Exclude<crypto.Signer, null>>(key).Public())
				let sigType = $.uint(__goscriptTuple15[0], 8)
				let sigHash = __goscriptTuple15[1]
				let __goscriptShadow10 = __goscriptTuple15[2]
				if (__goscriptShadow10 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
					return __goscriptShadow10
				}
				let signed: $.Slice<number> = await $.markAsStructValue($.cloneStructValue($.pointerValue<clientHandshakeState>(hs).finishedHash)).hashForClientCertificate($.uint(sigType, 8))
				let __goscriptTuple16: any = await $.pointerValue<Exclude<crypto.Signer, null>>(key).Sign(__goscript_common.Config.prototype.rand.call($.pointerValue<__goscript_conn.Conn>(c).config), signed, $.namedValueInterfaceValue<crypto.SignerOpts | null>(sigHash, "crypto.Hash", {Available: (receiver: any, ...args: any[]) => (crypto.Hash_Available as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), HashFunc: (receiver: any, ...args: any[]) => (crypto.Hash_HashFunc as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), New: (receiver: any, ...args: any[]) => (crypto.Hash_New as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Size: (receiver: any, ...args: any[]) => (crypto.Hash_Size as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (crypto.Hash_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, [{ name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "New", args: [], returns: [{ name: "_r0", type: "hash.Hash" }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
				$.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signature = __goscriptTuple16[0]
				__goscriptShadow10 = __goscriptTuple16[1]
				if (__goscriptShadow10 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return __goscriptShadow10
				}
			}

			{
				let [, __goscriptShadow11] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certVerify, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
				if (__goscriptShadow11 != null) {
					return __goscriptShadow11
				}
			}
		}

		$.pointerValue<clientHandshakeState>(hs).finishedHash.discardHandshakeBuffer()

		return null
	}

	public async establishKeys(): globalThis.Promise<$.GoError> {
		const hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeState>(hs).c

		let __goscriptTuple17: any = await __goscript_prf.keysFromMasterSecret($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<clientHandshakeState>(hs).suite, $.pointerValue<clientHandshakeState>(hs).masterSecret, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).random, $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).macLen, $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).keyLen, $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).ivLen)
		let clientMAC: $.Slice<number> = __goscriptTuple17[0]
		let serverMAC: $.Slice<number> = __goscriptTuple17[1]
		let clientKey: $.Slice<number> = __goscriptTuple17[2]
		let serverKey: $.Slice<number> = __goscriptTuple17[3]
		let clientIV: $.Slice<number> = __goscriptTuple17[4]
		let serverIV: $.Slice<number> = __goscriptTuple17[5]
		let clientCipher: any = null as any
		let serverCipher: any = null as any
		let clientHash: hash.Hash | null = null as hash.Hash | null
		let serverHash: hash.Hash | null = null as hash.Hash | null
		if ($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).cipher != null) {
			clientCipher = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).cipher!(clientKey, clientIV, false)
			clientHash = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).mac!(clientMAC)
			serverCipher = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).cipher!(serverKey, serverIV, true)
			serverHash = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).mac!(serverMAC)
		} else {
			clientCipher = (await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).aead!(clientKey, clientIV) as any)
			serverCipher = (await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).aead!(serverKey, serverIV) as any)
		}

		$.pointerValue<__goscript_conn.Conn>(c)._in.prepareCipherSpec($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), serverCipher, serverHash)
		$.pointerValue<__goscript_conn.Conn>(c).out.prepareCipherSpec($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), clientCipher, clientHash)
		return null
	}

	public async handshake(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeState>(hs).c

		// If we did not load a session (hs.session == nil), but we did set a
		// session ID in the transmitted client hello (hs.hello.sessionId != nil),
		// it means we tried to negotiate TLS 1.3 and sent a random session ID as a
		// compatibility measure (see RFC 8446, Section 4.1.2).
		//
		// Since we're now handshaking for TLS 1.2, if the server echoed the
		// transmitted ID back to us, we know mischief is afoot: the session ID
		// was random and can't possibly be recognized by the server.
		if ((($.pointerValue<clientHandshakeState>(hs).session == null) && ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).sessionId != null)) && bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).sessionId, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).sessionId)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server echoed TLS 1.3 compatibility session ID in TLS 1.2")
		}

		let [isResume, err] = await clientHandshakeState.prototype.processServerHello.call(hs)
		if (err != null) {
			return err
		}

		$.pointerValue<clientHandshakeState>(hs).finishedHash = $.markAsStructValue($.cloneStructValue(await __goscript_prf.newFinishedHash($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<clientHandshakeState>(hs).suite)))

		// No signatures of the handshake are needed in a resumption.
		// Otherwise, in a full handshake, if we don't have any certificates
		// configured then we will never send a CertificateVerify message and
		// thus no signatures are needed in that case either.
		if (isResume || (($.len($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).Certificates) == 0) && ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).GetClientCertificate == null))) {
			$.pointerValue<clientHandshakeState>(hs).finishedHash.discardHandshakeBuffer()
		}

		{
			let __goscriptShadow12 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<clientHandshakeState>(hs).hello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (__goscriptShadow12 != null) {
				return __goscriptShadow12
			}
		}
		{
			let __goscriptShadow13 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<clientHandshakeState>(hs).serverHello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (__goscriptShadow13 != null) {
				return __goscriptShadow13
			}
		}

		$.pointerValue<__goscript_conn.Conn>(c).buffering = true
		$.pointerValue<__goscript_conn.Conn>(c).didResume = isResume
		if (isResume) {
			{
				let __goscriptShadow14 = await clientHandshakeState.prototype.establishKeys.call(hs)
				if (__goscriptShadow14 != null) {
					return __goscriptShadow14
				}
			}
			{
				let __goscriptShadow15 = await clientHandshakeState.prototype.readSessionTicket.call(hs)
				if (__goscriptShadow15 != null) {
					return __goscriptShadow15
				}
			}
			{
				let __goscriptShadow16 = await clientHandshakeState.prototype.readFinished.call(hs, $.goSlice($.pointerValue<__goscript_conn.Conn>(c).serverFinished, undefined, undefined))
				if (__goscriptShadow16 != null) {
					return __goscriptShadow16
				}
			}
			$.pointerValue<__goscript_conn.Conn>(c).clientFinishedIsFirst = false
			// Make sure the connection is still being verified whether or not this
			// is a resumption. Resumptions currently don't reverify certificates so
			// they don't call verifyServerCertificate. See Issue 31641.
			if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection != null) {
				{
					let __goscriptShadow17 = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection!($.markAsStructValue($.cloneStructValue(__goscript_conn.Conn.prototype.connectionStateLocked.call(c))))
					if (__goscriptShadow17 != null) {
						await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(42, 8))
						return __goscriptShadow17
					}
				}
			}
			{
				let __goscriptShadow18 = await clientHandshakeState.prototype.sendFinished.call(hs, $.goSlice($.pointerValue<__goscript_conn.Conn>(c).clientFinished, undefined, undefined))
				if (__goscriptShadow18 != null) {
					return __goscriptShadow18
				}
			}
			{
				let [, __goscriptShadow19] = await __goscript_conn.Conn.prototype.flush.call(c)
				if (__goscriptShadow19 != null) {
					return __goscriptShadow19
				}
			}
		} else {
			{
				let __goscriptShadow20 = await clientHandshakeState.prototype.doFullHandshake.call(hs)
				if (__goscriptShadow20 != null) {
					return __goscriptShadow20
				}
			}
			{
				let __goscriptShadow21 = await clientHandshakeState.prototype.establishKeys.call(hs)
				if (__goscriptShadow21 != null) {
					return __goscriptShadow21
				}
			}
			{
				let __goscriptShadow22 = await clientHandshakeState.prototype.sendFinished.call(hs, $.goSlice($.pointerValue<__goscript_conn.Conn>(c).clientFinished, undefined, undefined))
				if (__goscriptShadow22 != null) {
					return __goscriptShadow22
				}
			}
			{
				let [, __goscriptShadow23] = await __goscript_conn.Conn.prototype.flush.call(c)
				if (__goscriptShadow23 != null) {
					return __goscriptShadow23
				}
			}
			$.pointerValue<__goscript_conn.Conn>(c).clientFinishedIsFirst = true
			{
				let __goscriptShadow24 = await clientHandshakeState.prototype.readSessionTicket.call(hs)
				if (__goscriptShadow24 != null) {
					return __goscriptShadow24
				}
			}
			{
				let __goscriptShadow25 = await clientHandshakeState.prototype.readFinished.call(hs, $.goSlice($.pointerValue<__goscript_conn.Conn>(c).serverFinished, undefined, undefined))
				if (__goscriptShadow25 != null) {
					return __goscriptShadow25
				}
			}
		}
		{
			let __goscriptShadow26 = await clientHandshakeState.prototype.saveSessionTicket.call(hs)
			if (__goscriptShadow26 != null) {
				return __goscriptShadow26
			}
		}

		$.pointerValue<__goscript_conn.Conn>(c).ekm = __goscript_prf.ekmFromMasterSecret($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<clientHandshakeState>(hs).suite, $.pointerValue<clientHandshakeState>(hs).masterSecret, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).random)
		$.pointerValue<__goscript_conn.Conn>(c).isHandshakeComplete.Store(true)

		return null
	}

	public async pickCipherSuite(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		{
			$.pointerValue<clientHandshakeState>(hs).suite = __goscript_cipher_suites.mutualCipherSuite($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).cipherSuites, $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).cipherSuite, 16))
			if ($.pointerValue<clientHandshakeState>(hs).suite == null) {
				await __goscript_conn.Conn.prototype.sendAlert.call($.pointerValue<clientHandshakeState>(hs).c, $.uint(40, 8))
				return errors.New("tls: server chose an unconfigured cipher suite")
			}
		}

		if ((($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>($.pointerValue<clientHandshakeState>(hs).c).config).CipherSuites == null) && !fips140tls.Required()) && $.mapGet<number, boolean, boolean>(__goscript_cipher_suites.rsaKexCiphers, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).id, 16), false)[0]) {
			godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_defaults.tlsrsakex))
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_defaults.tlsrsakex))
		}
		if ((($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>($.pointerValue<clientHandshakeState>(hs).c).config).CipherSuites == null) && !fips140tls.Required()) && $.mapGet<number, boolean, boolean>(__goscript_cipher_suites.tdesCiphers, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).id, 16), false)[0]) {
			godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_defaults.tls3des))
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_defaults.tls3des))
		}

		$.pointerValue<__goscript_conn.Conn>($.pointerValue<clientHandshakeState>(hs).c).cipherSuite = $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).id, 16)
		return null
	}

	public async processServerHello(): globalThis.Promise<[boolean, $.GoError]> {
		let hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeState>(hs).c

		{
			let err = await clientHandshakeState.prototype.pickCipherSuite.call(hs)
			if (err != null) {
				return [false, err]
			}
		}

		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).compressionMethod, 8) != $.uint(0, 8)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return [false, errors.New("tls: server selected unsupported compression format")]
		}

		let supportsPointFormat = false
		let offeredNonCompressedFormat = false
		for (let __goscriptRangeTarget0 = $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).supportedPoints, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let format = __goscriptRangeTarget0![__rangeIndex]
			if ($.uint(format, 8) == $.uint(0, 8)) {
				supportsPointFormat = true
			} else {
				offeredNonCompressedFormat = true
			}
		}
		if (!supportsPointFormat && offeredNonCompressedFormat) {
			return [false, errors.New("tls: server offered only incompatible point formats")]
		}

		if (($.pointerValue<__goscript_conn.Conn>(c).handshakes == 0) && $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).secureRenegotiationSupported) {
			$.pointerValue<__goscript_conn.Conn>(c).secureRenegotiation = true
			if ($.len($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).secureRenegotiation) != 0) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
				return [false, errors.New("tls: initial handshake had non-empty renegotiation extension")]
			}
		}

		if (($.pointerValue<__goscript_conn.Conn>(c).handshakes > 0) && $.pointerValue<__goscript_conn.Conn>(c).secureRenegotiation) {
			let expectedSecureRenegotiation: Uint8Array = new Uint8Array(24)
			$.copy($.goSlice(expectedSecureRenegotiation, undefined, undefined), $.goSlice($.pointerValue<__goscript_conn.Conn>(c).clientFinished, undefined, undefined))
			$.copy($.goSlice(expectedSecureRenegotiation, 12, undefined), $.goSlice($.pointerValue<__goscript_conn.Conn>(c).serverFinished, undefined, undefined))
			if (!bytes.Equal($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).secureRenegotiation, $.goSlice(expectedSecureRenegotiation, undefined, undefined))) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
				return [false, errors.New("tls: incorrect renegotiation extension contents")]
			}
		}

		{
			let err = checkALPN($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).alpnProtocols, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).alpnProtocol, false)
			if (err != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(110, 8))
				return [false, err]
			}
		}
		$.pointerValue<__goscript_conn.Conn>(c).clientProtocol = $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).alpnProtocol

		$.pointerValue<__goscript_conn.Conn>(c).scts = $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).scts

		if (!clientHandshakeState.prototype.serverResumedSession.call(hs)) {
			return [false, null]
		}

		if ($.uint($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).version, 16) != $.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return [false, errors.New("tls: server resumed a session with a different version")]
		}

		if ($.uint($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).cipherSuite, 16) != $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<clientHandshakeState>(hs).suite).id, 16)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return [false, errors.New("tls: server resumed a session with a different cipher suite")]
		}

		// RFC 7627, Section 5.3
		if ($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).extMasterSecret != $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).extendedMasterSecret) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return [false, errors.New("tls: server resumed a session with a different EMS extension")]
		}

		// Restore master secret and certificates from previous state
		$.pointerValue<clientHandshakeState>(hs).masterSecret = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).secret
		$.pointerValue<__goscript_conn.Conn>(c).extMasterSecret = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).extMasterSecret
		$.pointerValue<__goscript_conn.Conn>(c).peerCertificates = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).peerCertificates
		$.pointerValue<__goscript_conn.Conn>(c).verifiedChains = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).verifiedChains
		$.pointerValue<__goscript_conn.Conn>(c).ocspResponse = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).ocspResponse
		// Let the ServerHello SCTs override the session SCTs from the original
		// connection, if any are provided.
		if (($.len($.pointerValue<__goscript_conn.Conn>(c).scts) == 0) && ($.len($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).scts) != 0)) {
			$.pointerValue<__goscript_conn.Conn>(c).scts = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).scts
		}
		$.pointerValue<__goscript_conn.Conn>(c).curveID = $.uint($.pointerValue<__goscript_ticket.SessionState>($.pointerValue<clientHandshakeState>(hs).session).curveID, 16)

		return [true, null]
	}

	public async readFinished(out: $.Slice<number>): globalThis.Promise<$.GoError> {
		const hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeState>(hs).c

		{
			let err = await __goscript_conn.Conn.prototype.readChangeCipherSpec.call(c)
			if (err != null) {
				return err
			}
		}

		// finishedMsg is included in the transcript, but not until after we
		// check the client version, since the state before this message was
		// sent is used during verification.
		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, null)
		if (err != null) {
			return err
		}
		let __goscriptTuple18: any = $.typeAssertTuple<__goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" })
		let serverFinished: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = __goscriptTuple18[0]
		let ok = __goscriptTuple18[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(serverFinished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), msg)
		}

		let verify: $.Slice<number> = await $.markAsStructValue($.cloneStructValue($.pointerValue<clientHandshakeState>(hs).finishedHash)).serverSum($.pointerValue<clientHandshakeState>(hs).masterSecret)
		if (($.len(verify) != $.len($.pointerValue<__goscript_handshake_messages.finishedMsg>(serverFinished).verifyData)) || (subtle.ConstantTimeCompare(verify, $.pointerValue<__goscript_handshake_messages.finishedMsg>(serverFinished).verifyData) != 1)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return errors.New("tls: server's Finished message was incorrect")
		}

		{
			let __goscriptShadow27 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(serverFinished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (__goscriptShadow27 != null) {
				return __goscriptShadow27
			}
		}

		$.copy(out, verify)
		return null
	}

	public async readSessionTicket(): globalThis.Promise<$.GoError> {
		let hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		if (!$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).ticketSupported) {
			return null
		}
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeState>(hs).c

		if (!$.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).ticketSupported) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: server sent unrequested session ticket")
		}

		let [msg, err] = await __goscript_conn.Conn.prototype.readHandshake.call(c, $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
		if (err != null) {
			return err
		}
		let __goscriptTuple19: any = $.typeAssertTuple<__goscript_handshake_messages.newSessionTicketMsg | $.VarRef<__goscript_handshake_messages.newSessionTicketMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsg" })
		let sessionTicketMsg: __goscript_handshake_messages.newSessionTicketMsg | $.VarRef<__goscript_handshake_messages.newSessionTicketMsg> | null = __goscriptTuple19[0]
		let ok = __goscriptTuple19[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(sessionTicketMsg, "*tls.newSessionTicketMsg", { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsg" }), msg)
		}

		$.pointerValue<clientHandshakeState>(hs).ticket = $.pointerValue<__goscript_handshake_messages.newSessionTicketMsg>(sessionTicketMsg).ticket
		return null
	}

	public async saveSessionTicket(): globalThis.Promise<$.GoError> {
		const hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		if ($.pointerValue<clientHandshakeState>(hs).ticket == null) {
			return null
		}
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeState>(hs).c

		let cacheKey = await __goscript_conn.Conn.prototype.clientSessionCacheKey.call(c)
		if ($.stringEqual(cacheKey, "")) {
			return null
		}

		let session: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = await __goscript_conn.Conn.prototype.sessionState.call(c)
		$.pointerValue<__goscript_ticket.SessionState>(session).secret = $.pointerValue<clientHandshakeState>(hs).masterSecret
		$.pointerValue<__goscript_ticket.SessionState>(session).ticket = $.pointerValue<clientHandshakeState>(hs).ticket

		let cs: __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null = new __goscript_ticket.ClientSessionState({session: session})
		await $.pointerValue<Exclude<__goscript_common.ClientSessionCache, null>>($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientSessionCache).Put(cacheKey, cs)
		return null
	}

	public async sendFinished(out: $.Slice<number>): globalThis.Promise<$.GoError> {
		const hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<clientHandshakeState>(hs).c

		{
			let err = await __goscript_conn.Conn.prototype.writeChangeCipherRecord.call(c)
			if (err != null) {
				return err
			}
		}

		let finished: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = new __goscript_handshake_messages.finishedMsg()
		$.pointerValue<__goscript_handshake_messages.finishedMsg>(finished).verifyData = await $.markAsStructValue($.cloneStructValue($.pointerValue<clientHandshakeState>(hs).finishedHash)).clientSum($.pointerValue<clientHandshakeState>(hs).masterSecret)
		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<clientHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(finished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<clientHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (err != null) {
				return err
			}
		}
		$.copy(out, $.pointerValue<__goscript_handshake_messages.finishedMsg>(finished).verifyData)
		return null
	}

	public serverResumedSession(): boolean {
		const hs: clientHandshakeState | $.VarRef<clientHandshakeState> | null = this
		// If the server responded with the same sessionId then it means the
		// sessionTicket is being used to resume a TLS session.
		return (($.pointerValue<clientHandshakeState>(hs).session != null) && ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).sessionId != null)) && bytes.Equal($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<clientHandshakeState>(hs).serverHello).sessionId, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<clientHandshakeState>(hs).hello).sessionId)
	}

	static __typeInfo = $.registerStructType(
		"tls.clientHandshakeState",
		() => new clientHandshakeState(),
		[{ name: "doFullHandshake", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "establishKeys", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "handshake", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "pickCipherSuite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "processServerHello", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }, { name: "readFinished", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "readSessionTicket", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "saveSessionTicket", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendFinished", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "serverResumedSession", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		clientHandshakeState,
		[{ name: "c", key: "c", type: { kind: $.TypeKind.Pointer, elemType: "tls.Conn" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "ctx", key: "ctx", type: "context.Context", pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "serverHello", key: "serverHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }, pkgPath: "crypto/tls", index: [2], offset: 24, exported: false }, { name: "hello", key: "hello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }, pkgPath: "crypto/tls", index: [3], offset: 32, exported: false }, { name: "suite", key: "suite", type: { kind: $.TypeKind.Pointer, elemType: "tls.cipherSuite" }, pkgPath: "crypto/tls", index: [4], offset: 40, exported: false }, { name: "finishedHash", key: "finishedHash", type: "tls.finishedHash", pkgPath: "crypto/tls", index: [5], offset: 48, exported: false }, { name: "masterSecret", key: "masterSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [6], offset: 152, exported: false }, { name: "session", key: "session", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" }, pkgPath: "crypto/tls", index: [7], offset: 176, exported: false }, { name: "ticket", key: "ticket", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [8], offset: 184, exported: false }]
	)
}

export class echClientContext {
	public get config(): __goscript_ech.echConfig | $.VarRef<__goscript_ech.echConfig> | null {
		return this._fields.config.value
	}
	public set config(value: __goscript_ech.echConfig | $.VarRef<__goscript_ech.echConfig> | null) {
		this._fields.config.value = value
	}

	public get hpkeContext(): hpke.Sender | $.VarRef<hpke.Sender> | null {
		return this._fields.hpkeContext.value
	}
	public set hpkeContext(value: hpke.Sender | $.VarRef<hpke.Sender> | null) {
		this._fields.hpkeContext.value = value
	}

	public get encapsulatedKey(): $.Slice<number> {
		return this._fields.encapsulatedKey.value
	}
	public set encapsulatedKey(value: $.Slice<number>) {
		this._fields.encapsulatedKey.value = value
	}

	public get innerHello(): __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null {
		return this._fields.innerHello.value
	}
	public set innerHello(value: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null) {
		this._fields.innerHello.value = value
	}

	public get innerTranscript(): hash.Hash | null {
		return this._fields.innerTranscript.value
	}
	public set innerTranscript(value: hash.Hash | null) {
		this._fields.innerTranscript.value = value
	}

	public get kdfID(): number {
		return this._fields.kdfID.value
	}
	public set kdfID(value: number) {
		this._fields.kdfID.value = value
	}

	public get aeadID(): number {
		return this._fields.aeadID.value
	}
	public set aeadID(value: number) {
		this._fields.aeadID.value = value
	}

	public get echRejected(): boolean {
		return this._fields.echRejected.value
	}
	public set echRejected(value: boolean) {
		this._fields.echRejected.value = value
	}

	public get retryConfigs(): $.Slice<number> {
		return this._fields.retryConfigs.value
	}
	public set retryConfigs(value: $.Slice<number>) {
		this._fields.retryConfigs.value = value
	}

	public _fields: {
		config: $.VarRef<__goscript_ech.echConfig | $.VarRef<__goscript_ech.echConfig> | null>
		hpkeContext: $.VarRef<hpke.Sender | $.VarRef<hpke.Sender> | null>
		encapsulatedKey: $.VarRef<$.Slice<number>>
		innerHello: $.VarRef<__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null>
		innerTranscript: $.VarRef<hash.Hash | null>
		kdfID: $.VarRef<number>
		aeadID: $.VarRef<number>
		echRejected: $.VarRef<boolean>
		retryConfigs: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{config?: __goscript_ech.echConfig | $.VarRef<__goscript_ech.echConfig> | null, hpkeContext?: hpke.Sender | $.VarRef<hpke.Sender> | null, encapsulatedKey?: $.Slice<number>, innerHello?: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, innerTranscript?: hash.Hash | null, kdfID?: number, aeadID?: number, echRejected?: boolean, retryConfigs?: $.Slice<number>}>) {
		this._fields = {
			config: $.varRef(init?.config ?? (null as __goscript_ech.echConfig | $.VarRef<__goscript_ech.echConfig> | null)),
			hpkeContext: $.varRef(init?.hpkeContext ?? (null as hpke.Sender | $.VarRef<hpke.Sender> | null)),
			encapsulatedKey: $.varRef(init?.encapsulatedKey ?? (null as $.Slice<number>)),
			innerHello: $.varRef(init?.innerHello ?? (null as __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null)),
			innerTranscript: $.varRef(init?.innerTranscript ?? (null as hash.Hash | null)),
			kdfID: $.varRef(init?.kdfID ?? (0 as number)),
			aeadID: $.varRef(init?.aeadID ?? (0 as number)),
			echRejected: $.varRef(init?.echRejected ?? (false as boolean)),
			retryConfigs: $.varRef(init?.retryConfigs ?? (null as $.Slice<number>))
		}
	}

	public clone(): echClientContext {
		const cloned = new echClientContext()
		cloned._fields = {
			config: $.varRef(this._fields.config.value),
			hpkeContext: $.varRef(this._fields.hpkeContext.value),
			encapsulatedKey: $.varRef(this._fields.encapsulatedKey.value),
			innerHello: $.varRef(this._fields.innerHello.value),
			innerTranscript: $.varRef(this._fields.innerTranscript.value),
			kdfID: $.varRef(this._fields.kdfID.value),
			aeadID: $.varRef(this._fields.aeadID.value),
			echRejected: $.varRef(this._fields.echRejected.value),
			retryConfigs: $.varRef(this._fields.retryConfigs.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.echClientContext",
		() => new echClientContext(),
		[],
		echClientContext,
		[{ name: "config", key: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.echConfig" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "hpkeContext", key: "hpkeContext", type: { kind: $.TypeKind.Pointer, elemType: "hpke.Sender" }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "encapsulatedKey", key: "encapsulatedKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [2], offset: 16, exported: false }, { name: "innerHello", key: "innerHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }, pkgPath: "crypto/tls", index: [3], offset: 40, exported: false }, { name: "innerTranscript", key: "innerTranscript", type: "hash.Hash", pkgPath: "crypto/tls", index: [4], offset: 48, exported: false }, { name: "kdfID", key: "kdfID", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [5], offset: 64, exported: false }, { name: "aeadID", key: "aeadID", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [6], offset: 66, exported: false }, { name: "echRejected", key: "echRejected", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [7], offset: 68, exported: false }, { name: "retryConfigs", key: "retryConfigs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [8], offset: 72, exported: false }]
	)
}

export const defaultMaxRSAKeySize: number = 8192

export function checkALPN(clientProtos: $.Slice<string>, serverProto: string, quic: boolean): $.GoError {
	if ($.stringEqual(serverProto, "")) {
		if (quic && ($.len(clientProtos) > 0)) {
			// RFC 9001, Section 8.1
			return errors.New("tls: server did not select an ALPN protocol")
		}
		return null
	}
	if ($.len(clientProtos) == 0) {
		return errors.New("tls: server advertised unrequested ALPN extension")
	}
	for (let __goscriptRangeTarget1 = clientProtos, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let proto = __goscriptRangeTarget1![__rangeIndex]
		if ($.stringEqual(proto, serverProto)) {
			return null
		}
	}
	return errors.New("tls: server selected unadvertised ALPN protocol")
}

export let tlsmaxrsasize: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("tlsmaxrsasize")

export function __goscript_set_tlsmaxrsasize(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	tlsmaxrsasize = __goscriptValue
}

export function checkKeySize(n: number): [number, boolean] {
	let max: number = 0
	let ok: boolean = false
	{
		let v = godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(tlsmaxrsasize))
		if (!$.stringEqual(v, "")) {
			{
				let [__goscriptShadow28, err] = strconv.Atoi(v)
				if (err == null) {
					if ((n <= __goscriptShadow28) != (n <= 8192)) {
						godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(tlsmaxrsasize))
					}
					return [__goscriptShadow28, n <= __goscriptShadow28]
				}
			}
		}
	}
	return [8192, n <= 8192]
}

export function certificateRequestInfoFromMsg(ctx: context.Context | null, vers: number, certReq: __goscript_handshake_messages.certificateRequestMsg | $.VarRef<__goscript_handshake_messages.certificateRequestMsg> | null): __goscript_common.CertificateRequestInfo | $.VarRef<__goscript_common.CertificateRequestInfo> | null {
	let cri: __goscript_common.CertificateRequestInfo | $.VarRef<__goscript_common.CertificateRequestInfo> | null = new __goscript_common.CertificateRequestInfo({AcceptableCAs: $.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).certificateAuthorities, Version: $.uint(vers, 16), ctx: ctx})

	let rsaAvail: boolean = false
	let ecAvail: boolean = false
	for (let __goscriptRangeTarget2 = $.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).certificateTypes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let certType = __goscriptRangeTarget2![__rangeIndex]
		switch (certType) {
			case 1:
			{
				rsaAvail = true
				break
			}
			case 64:
			{
				ecAvail = true
				break
			}
		}
	}

	if (!$.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).hasSignatureAlgorithm) {
		// Prior to TLS 1.2, signature schemes did not exist. In this case we
		// make up a list based on the acceptable certificate types, to help
		// GetClientCertificate and SupportsCertificate select the right certificate.
		// The hash part of the SignatureScheme is a lie here, because
		// TLS 1.0 and 1.1 always use MD5+SHA1 for RSA and SHA1 for ECDSA.
		switch (true) {
			case rsaAvail && ecAvail:
			{
				$.pointerValue<__goscript_common.CertificateRequestInfo>(cri).SignatureSchemes = $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(1027, 16), $.uint(1283, 16), $.uint(1539, 16), $.uint(1025, 16), $.uint(1281, 16), $.uint(1537, 16), $.uint(513, 16)])
				break
			}
			case rsaAvail:
			{
				$.pointerValue<__goscript_common.CertificateRequestInfo>(cri).SignatureSchemes = $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(1025, 16), $.uint(1281, 16), $.uint(1537, 16), $.uint(513, 16)])
				break
			}
			case ecAvail:
			{
				$.pointerValue<__goscript_common.CertificateRequestInfo>(cri).SignatureSchemes = $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(1027, 16), $.uint(1283, 16), $.uint(1539, 16)])
				break
			}
		}
		return cri
	}

	// Filter the signature schemes based on the certificate types.
	// See RFC 5246, Section 7.4.4 (where it calls this "somewhat complicated").
	$.pointerValue<__goscript_common.CertificateRequestInfo>(cri).SignatureSchemes = $.makeSlice<__goscript_common.SignatureScheme>(0, $.len($.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).supportedSignatureAlgorithms), "number")
	for (let __goscriptRangeTarget3 = $.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).supportedSignatureAlgorithms, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let sigScheme = __goscriptRangeTarget3![__rangeIndex]
		let __goscriptTuple20: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint(sigScheme, 16))
		let sigType = $.uint(__goscriptTuple20[0], 8)
		let err = __goscriptTuple20[2]
		if (err != null) {
			continue
		}
		switch (sigType) {
			case 227:
			case 228:
			{
				if (ecAvail) {
					$.pointerValue<__goscript_common.CertificateRequestInfo>(cri).SignatureSchemes = $.append($.pointerValue<__goscript_common.CertificateRequestInfo>(cri).SignatureSchemes, $.uint(sigScheme, 16))
				}
				break
			}
			case 226:
			case 225:
			{
				if (rsaAvail) {
					$.pointerValue<__goscript_common.CertificateRequestInfo>(cri).SignatureSchemes = $.append($.pointerValue<__goscript_common.CertificateRequestInfo>(cri).SignatureSchemes, $.uint(sigScheme, 16))
				}
				break
			}
		}
	}

	return cri
}

export function hostnameInSNI(name: string): string {
	let host = name
	if ((($.len(host) > 0) && ($.uint($.indexStringOrBytes(host, 0), 8) == $.uint(91, 8))) && ($.uint($.indexStringOrBytes(host, $.len(host) - 1), 8) == $.uint(93, 8))) {
		host = $.sliceStringOrBytes(host, 1, $.len(host) - 1)
	}
	{
		let i = strings.LastIndex(host, "%")
		if (i > 0) {
			host = $.sliceStringOrBytes(host, undefined, i)
		}
	}
	if (net.ParseIP(host) != null) {
		return ""
	}
	while (($.len(name) > 0) && ($.uint($.indexStringOrBytes(name, $.len(name) - 1), 8) == $.uint(46, 8))) {
		name = $.sliceStringOrBytes(name, undefined, $.len(name) - 1)
	}
	return name
}

export async function computeAndUpdatePSK(m: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, binderKey: $.Slice<number>, transcript: hash.Hash | null, finishedHash: ((_p0: $.Slice<number>, _p1: hash.Hash | null) => $.Slice<number> | globalThis.Promise<$.Slice<number>>) | null): globalThis.Promise<$.GoError> {
	let __goscriptTuple21: any = await __goscript_handshake_messages.clientHelloMsg.prototype.marshalWithoutBinders.call(m)
	let helloBytes: $.Slice<number> = __goscriptTuple21[0]
	let err = __goscriptTuple21[1]
	if (err != null) {
		return err
	}
	await $.pointerValue<Exclude<hash.Hash, null>>(transcript).Write(helloBytes)
	let pskBinders: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([await finishedHash!(binderKey, transcript)])
	return __goscript_handshake_messages.clientHelloMsg.prototype.updateBinders.call(m, pskBinders)
}
