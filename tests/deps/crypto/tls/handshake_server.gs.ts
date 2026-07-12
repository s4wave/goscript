// Generated file based on handshake_server.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as fips140tls from "@goscript/crypto/tls/internal/fips140tls/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as hash from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"

import * as time from "@goscript/time/index.js"

import * as bytes from "@goscript/bytes/index.js"

import type * as cipher from "@goscript/crypto/cipher/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

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

import * as __goscript_ech from "./ech.gs.ts"

import * as __goscript_handshake_client from "./handshake_client.gs.ts"

import * as __goscript_handshake_client_tls13 from "./handshake_client_tls13.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_handshake_server_tls13 from "./handshake_server_tls13.gs.ts"

import * as __goscript_key_agreement from "./key_agreement.gs.ts"

import * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_prf from "./prf.gs.ts"

import * as __goscript_quic from "./quic.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/context/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/crypto/tls/internal/fips140tls/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"
import "@goscript/time/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/crypto/internal/fips140/tls13/index.js"
import "@goscript/internal/godebug/index.js"
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
import "./ech.gs.ts"
import "./handshake_client.gs.ts"
import "./handshake_client_tls13.gs.ts"
import "./handshake_messages.gs.ts"
import "./handshake_server_tls13.gs.ts"
import "./key_agreement.gs.ts"
import "./key_schedule.gs.ts"
import "./prf.gs.ts"
import "./quic.gs.ts"
import "./ticket.gs.ts"

export class serverHandshakeState {
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

	public get suite(): __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null {
		return this._fields.suite.value
	}
	public set suite(value: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null) {
		this._fields.suite.value = value
	}

	public get ecdheOk(): boolean {
		return this._fields.ecdheOk.value
	}
	public set ecdheOk(value: boolean) {
		this._fields.ecdheOk.value = value
	}

	public get ecSignOk(): boolean {
		return this._fields.ecSignOk.value
	}
	public set ecSignOk(value: boolean) {
		this._fields.ecSignOk.value = value
	}

	public get rsaDecryptOk(): boolean {
		return this._fields.rsaDecryptOk.value
	}
	public set rsaDecryptOk(value: boolean) {
		this._fields.rsaDecryptOk.value = value
	}

	public get rsaSignOk(): boolean {
		return this._fields.rsaSignOk.value
	}
	public set rsaSignOk(value: boolean) {
		this._fields.rsaSignOk.value = value
	}

	public get sessionState(): __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null {
		return this._fields.sessionState.value
	}
	public set sessionState(value: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) {
		this._fields.sessionState.value = value
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

	public get cert(): __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null {
		return this._fields.cert.value
	}
	public set cert(value: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null) {
		this._fields.cert.value = value
	}

	public _fields: {
		c: $.VarRef<__goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null>
		ctx: $.VarRef<context.Context | null>
		clientHello: $.VarRef<__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null>
		hello: $.VarRef<__goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null>
		suite: $.VarRef<__goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null>
		ecdheOk: $.VarRef<boolean>
		ecSignOk: $.VarRef<boolean>
		rsaDecryptOk: $.VarRef<boolean>
		rsaSignOk: $.VarRef<boolean>
		sessionState: $.VarRef<__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null>
		finishedHash: $.VarRef<__goscript_prf.finishedHash>
		masterSecret: $.VarRef<$.Slice<number>>
		cert: $.VarRef<__goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null>
	}

	constructor(init?: Partial<{c?: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, ctx?: context.Context | null, clientHello?: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, hello?: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null, suite?: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null, ecdheOk?: boolean, ecSignOk?: boolean, rsaDecryptOk?: boolean, rsaSignOk?: boolean, sessionState?: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, finishedHash?: __goscript_prf.finishedHash, masterSecret?: $.Slice<number>, cert?: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null}>) {
		this._fields = {
			c: $.varRef(init?.c ?? (null as __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null)),
			ctx: $.varRef(init?.ctx ?? (null as context.Context | null)),
			clientHello: $.varRef(init?.clientHello ?? (null as __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null)),
			hello: $.varRef(init?.hello ?? (null as __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null)),
			suite: $.varRef(init?.suite ?? (null as __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null)),
			ecdheOk: $.varRef(init?.ecdheOk ?? (false as boolean)),
			ecSignOk: $.varRef(init?.ecSignOk ?? (false as boolean)),
			rsaDecryptOk: $.varRef(init?.rsaDecryptOk ?? (false as boolean)),
			rsaSignOk: $.varRef(init?.rsaSignOk ?? (false as boolean)),
			sessionState: $.varRef(init?.sessionState ?? (null as __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null)),
			finishedHash: $.varRef(init?.finishedHash ? $.markAsStructValue($.cloneStructValue(init.finishedHash)) : $.markAsStructValue(new __goscript_prf.finishedHash())),
			masterSecret: $.varRef(init?.masterSecret ?? (null as $.Slice<number>)),
			cert: $.varRef(init?.cert ?? (null as __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null))
		}
	}

	public clone(): serverHandshakeState {
		const cloned = new serverHandshakeState()
		cloned._fields = {
			c: $.varRef(this._fields.c.value),
			ctx: $.varRef(this._fields.ctx.value),
			clientHello: $.varRef(this._fields.clientHello.value),
			hello: $.varRef(this._fields.hello.value),
			suite: $.varRef(this._fields.suite.value),
			ecdheOk: $.varRef(this._fields.ecdheOk.value),
			ecSignOk: $.varRef(this._fields.ecSignOk.value),
			rsaDecryptOk: $.varRef(this._fields.rsaDecryptOk.value),
			rsaSignOk: $.varRef(this._fields.rsaSignOk.value),
			sessionState: $.varRef(this._fields.sessionState.value),
			finishedHash: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.finishedHash.value))),
			masterSecret: $.varRef(this._fields.masterSecret.value),
			cert: $.varRef(this._fields.cert.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async checkForResumption(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).SessionTicketsDisabled) {
			return null
		}

		let sessionState: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = null as __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).UnwrapSession != null) {
			let __goscriptTuple0: any = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).UnwrapSession!($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).sessionTicket, $.markAsStructValue($.cloneStructValue(__goscript_conn.Conn.prototype.connectionStateLocked.call(c))))
			let ss: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = __goscriptTuple0[0]
			let err = __goscriptTuple0[1]
			if (err != null) {
				return err
			}
			if (ss == null) {
				return null
			}
			sessionState = ss
		} else {
			let plaintext: $.Slice<number> = await __goscript_common.Config.prototype.decryptTicket.call($.pointerValue<__goscript_conn.Conn>(c).config, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).sessionTicket, $.pointerValue<__goscript_conn.Conn>(c).ticketKeys)
			if (plaintext == null) {
				return null
			}
			let __goscriptTuple1: any = await __goscript_ticket.ParseSessionState(plaintext)
			let ss: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = __goscriptTuple1[0]
			let err = __goscriptTuple1[1]
			if (err != null) {
				return null
			}
			sessionState = ss
		}

		// TLS 1.2 tickets don't natively have a lifetime, but we want to avoid
		// re-wrapping the same master secret in different tickets over and over for
		// too long, weakening forward secrecy.
		let createdAt = $.markAsStructValue($.cloneStructValue(time.Unix($.int64($.pointerValue<__goscript_ticket.SessionState>(sessionState).createdAt), 0n)))
		if ($.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<__goscript_conn.Conn>(c).config)))).Sub($.markAsStructValue($.cloneStructValue(createdAt))) > 604800000000000n) {
			return null
		}

		// Never resume a session for a different TLS version.
		if ($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16) != $.uint($.pointerValue<__goscript_ticket.SessionState>(sessionState).version, 16)) {
			return null
		}

		let cipherSuiteOk = false
		// Check that the client is still offering the ciphersuite in the session.
		for (let __goscriptRangeTarget0 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).cipherSuites, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let id = __goscriptRangeTarget0![__rangeIndex]
			if ($.uint(id, 16) == $.uint($.pointerValue<__goscript_ticket.SessionState>(sessionState).cipherSuite, 16)) {
				cipherSuiteOk = true
				break
			}
		}
		if (!cipherSuiteOk) {
			return null
		}

		// Check that we also support the ciphersuite from the session.
		let suite: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null = await __goscript_cipher_suites.selectCipherSuite($.arrayToSlice<number>([$.uint($.pointerValue<__goscript_ticket.SessionState>(sessionState).cipherSuite, 16)]), __goscript_common.Config.prototype.supportedCipherSuites.call($.pointerValue<__goscript_conn.Conn>(c).config), $.functionValue(((__receiver) => (c: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null) => __receiver.cipherSuiteOk(c))($.pointerValue<serverHandshakeState>(hs)), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "tls.cipherSuite" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
		if (suite == null) {
			return null
		}

		let sessionHasClientCerts = $.len($.pointerValue<__goscript_ticket.SessionState>(sessionState).peerCertificates) != 0
		let needClientCerts = __goscript_common.requiresClientCert($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth)
		if (needClientCerts && !sessionHasClientCerts) {
			return null
		}
		if (sessionHasClientCerts && ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth == 0)) {
			return null
		}
		if (sessionHasClientCerts && $.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<__goscript_conn.Conn>(c).config)))).After($.markAsStructValue($.cloneStructValue($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_ticket.SessionState>(sessionState).peerCertificates!, 0)).NotAfter)))) {
			return null
		}
		let opts = (await (async () => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue(await __goscript_common.Config.prototype.time.call($.pointerValue<__goscript_conn.Conn>(c).config))); return $.markAsStructValue(new x509.VerifyOptions({CurrentTime: __goscriptLiteralField0, Roots: $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientCAs, KeyUsages: $.arrayToSlice<x509.ExtKeyUsage>([x509.ExtKeyUsageClientAuth])})) })())
		if ((sessionHasClientCerts && ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth >= 3)) && !await __goscript_common.anyValidVerifiedChain($.pointerValue<__goscript_ticket.SessionState>(sessionState).verifiedChains, $.markAsStructValue($.cloneStructValue(opts)))) {
			return null
		}

		// RFC 7627, Section 5.3
		if (!$.pointerValue<__goscript_ticket.SessionState>(sessionState).extMasterSecret && $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).extendedMasterSecret) {
			return null
		}
		if ($.pointerValue<__goscript_ticket.SessionState>(sessionState).extMasterSecret && !$.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).extendedMasterSecret) {
			// Aborting is somewhat harsh, but it's a MUST and it would indicate a
			// weird downgrade in client capabilities.
			return errors.New("tls: session supported extended_master_secret but client does not")
		}
		if (!$.pointerValue<__goscript_ticket.SessionState>(sessionState).extMasterSecret && fips140tls.Required()) {
			// FIPS 140-3 requires the use of Extended Master Secret.
			return null
		}

		$.pointerValue<__goscript_conn.Conn>(c).peerCertificates = $.pointerValue<__goscript_ticket.SessionState>(sessionState).peerCertificates
		$.pointerValue<__goscript_conn.Conn>(c).ocspResponse = $.pointerValue<__goscript_ticket.SessionState>(sessionState).ocspResponse
		$.pointerValue<__goscript_conn.Conn>(c).scts = $.pointerValue<__goscript_ticket.SessionState>(sessionState).scts
		$.pointerValue<__goscript_conn.Conn>(c).verifiedChains = $.pointerValue<__goscript_ticket.SessionState>(sessionState).verifiedChains
		$.pointerValue<__goscript_conn.Conn>(c).extMasterSecret = $.pointerValue<__goscript_ticket.SessionState>(sessionState).extMasterSecret
		$.pointerValue<serverHandshakeState>(hs).sessionState = sessionState
		$.pointerValue<serverHandshakeState>(hs).suite = suite
		$.pointerValue<__goscript_conn.Conn>(c).curveID = $.uint($.pointerValue<__goscript_ticket.SessionState>(sessionState).curveID, 16)
		$.pointerValue<__goscript_conn.Conn>(c).didResume = true
		return null
	}

	public cipherSuiteOk(c: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null): boolean {
		const hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		if (($.pointerValue<__goscript_cipher_suites.cipherSuite>(c).flags & 1) != 0) {
			if (!$.pointerValue<serverHandshakeState>(hs).ecdheOk) {
				return false
			}
			if (($.pointerValue<__goscript_cipher_suites.cipherSuite>(c).flags & 2) != 0) {
				if (!$.pointerValue<serverHandshakeState>(hs).ecSignOk) {
					return false
				}
			} else {
				if (!$.pointerValue<serverHandshakeState>(hs).rsaSignOk) {
					return false
				}
			}
		} else {
			if (!$.pointerValue<serverHandshakeState>(hs).rsaDecryptOk) {
				return false
			}
		}
		if (($.uint($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeState>(hs).c).vers, 16) < $.uint(771, 16)) && (($.pointerValue<__goscript_cipher_suites.cipherSuite>(c).flags & 4) != 0)) {
			return false
		}
		return true
	}

	public async doFullHandshake(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

		if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).ocspStapling && ($.len($.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeState>(hs).cert).OCSPStaple) > 0)) {
			$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).ocspStapling = true
		}

		if (!$.stringEqual($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).serverName, "")) {
			$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).serverNameAck = true
		}

		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).ticketSupported = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).ticketSupported && !$.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).SessionTicketsDisabled
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).cipherSuite = $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).id, 16)

		$.pointerValue<serverHandshakeState>(hs).finishedHash = $.markAsStructValue($.cloneStructValue(await __goscript_prf.newFinishedHash($.uint($.pointerValue<__goscript_conn.Conn>($.pointerValue<serverHandshakeState>(hs).c).vers, 16), $.pointerValue<serverHandshakeState>(hs).suite)))
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth == 0) {
			// No need to keep a full record of the handshake if client
			// certificates won't be used.
			$.pointerValue<serverHandshakeState>(hs).finishedHash.discardHandshakeBuffer()
		}
		{
			let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeState>(hs).clientHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (err != null) {
				return err
			}
		}
		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeState>(hs).hello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (err != null) {
				return err
			}
		}

		let certMsg: __goscript_handshake_messages.certificateMsg | $.VarRef<__goscript_handshake_messages.certificateMsg> | null = new __goscript_handshake_messages.certificateMsg()
		$.pointerValue<__goscript_handshake_messages.certificateMsg>(certMsg).certificates = $.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeState>(hs).cert).Certificate
		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certMsg, "*tls.certificateMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (err != null) {
				return err
			}
		}

		if ($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).ocspStapling) {
			let certStatus: __goscript_handshake_messages.certificateStatusMsg | $.VarRef<__goscript_handshake_messages.certificateStatusMsg> | null = new __goscript_handshake_messages.certificateStatusMsg()
			$.pointerValue<__goscript_handshake_messages.certificateStatusMsg>(certStatus).response = $.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeState>(hs).cert).OCSPStaple
			{
				let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certStatus, "*tls.certificateStatusMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateStatusMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
				if (err != null) {
					return err
				}
			}
		}

		let __goscriptShadow0 = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).ka!($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16))
		let __goscriptTuple2: any = await $.pointerValue<Exclude<__goscript_key_agreement.keyAgreement, null>>(__goscriptShadow0).generateServerKeyExchange($.pointerValue<__goscript_conn.Conn>(c).config, $.pointerValue<serverHandshakeState>(hs).cert, $.pointerValue<serverHandshakeState>(hs).clientHello, $.pointerValue<serverHandshakeState>(hs).hello)
		let skx: __goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return err
		}
		if (skx != null) {
			let __goscriptShadow1 = __goscriptShadow0
			{
				let __goscriptTuple3: any = $.typeAssertTuple<__goscript_key_agreement.ecdheKeyAgreement | $.VarRef<__goscript_key_agreement.ecdheKeyAgreement> | null>(__goscriptShadow1, { kind: $.TypeKind.Pointer, elemType: "tls.ecdheKeyAgreement" })
				let __goscriptShadow2: __goscript_key_agreement.ecdheKeyAgreement | $.VarRef<__goscript_key_agreement.ecdheKeyAgreement> | null = __goscriptTuple3[0]
				let ok = __goscriptTuple3[1]
				if (ok) {
					$.pointerValue<__goscript_conn.Conn>(c).curveID = $.uint($.pointerValue<__goscript_key_agreement.ecdheKeyAgreement>(__goscriptShadow2).curveID, 16)
					$.pointerValue<__goscript_conn.Conn>(c).peerSigAlg = $.uint($.pointerValue<__goscript_key_agreement.ecdheKeyAgreement>(__goscriptShadow2).signatureAlgorithm, 16)
				}
			}
			{
				let [, __goscriptShadow3] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(skx, "*tls.serverKeyExchangeMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
				if (__goscriptShadow3 != null) {
					return __goscriptShadow3
				}
			}
		}

		let certReq: __goscript_handshake_messages.certificateRequestMsg | $.VarRef<__goscript_handshake_messages.certificateRequestMsg> | null = null as __goscript_handshake_messages.certificateRequestMsg | $.VarRef<__goscript_handshake_messages.certificateRequestMsg> | null
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth >= 1) {
			// Request a client certificate
			certReq = new __goscript_handshake_messages.certificateRequestMsg()
			$.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).certificateTypes = new Uint8Array([1, 64]) as $.Slice<number>
			if ($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16) >= $.uint(771, 16)) {
				$.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).hasSignatureAlgorithm = true
				$.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).supportedSignatureAlgorithms = __goscript_common.supportedSignatureAlgorithms($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16))
			}

			// An empty list of certificateAuthorities signals to
			// the client that it may send any certificate in response
			// to our request. When we know the CAs we trust, then
			// we can send them down, so that the client can choose
			// an appropriate certificate to give to us.
			if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientCAs != null) {
				$.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).certificateAuthorities = x509.CertPool.prototype.Subjects.call($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientCAs)
			}
			{
				let [, __goscriptShadow4] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(certReq, "*tls.certificateRequestMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateRequestMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
				if (__goscriptShadow4 != null) {
					return __goscriptShadow4
				}
			}
		}

		let helloDone: __goscript_handshake_messages.serverHelloDoneMsg | $.VarRef<__goscript_handshake_messages.serverHelloDoneMsg> | null = new __goscript_handshake_messages.serverHelloDoneMsg()
		{
			let [, __goscriptShadow5] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(helloDone, "*tls.serverHelloDoneMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloDoneMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (__goscriptShadow5 != null) {
				return __goscriptShadow5
			}
		}

		{
			let [, __goscriptShadow6] = await __goscript_conn.Conn.prototype.flush.call(c)
			if (__goscriptShadow6 != null) {
				return __goscriptShadow6
			}
		}

		let pub: crypto.PublicKey | null = null as crypto.PublicKey | null

		let __goscriptTuple4: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
		let msg = __goscriptTuple4[0]
		err = __goscriptTuple4[1]
		if (err != null) {
			return err
		}

		// If we requested a client certificate, then the client must send a
		// certificate message, even if it's empty.
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientAuth >= 1) {
			let __goscriptTuple5: any = $.typeAssertTuple<__goscript_handshake_messages.certificateMsg | $.VarRef<__goscript_handshake_messages.certificateMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsg" })
			let __goscriptShadow7: __goscript_handshake_messages.certificateMsg | $.VarRef<__goscript_handshake_messages.certificateMsg> | null = __goscriptTuple5[0]
			let ok = __goscriptTuple5[1]
			if (!ok) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
				return __goscript_common.unexpectedMessageError($.interfaceValue<any>(__goscriptShadow7, "*tls.certificateMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsg" }), msg)
			}

			{
				let __goscriptShadow8 = await __goscript_conn.Conn.prototype.processCertsFromClient.call(c, $.markAsStructValue(new __goscript_common.Certificate({Certificate: $.pointerValue<__goscript_handshake_messages.certificateMsg>(__goscriptShadow7).certificates})))
				if (__goscriptShadow8 != null) {
					return __goscriptShadow8
				}
			}
			if ($.len($.pointerValue<__goscript_handshake_messages.certificateMsg>(__goscriptShadow7).certificates) != 0) {
				pub = ($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_conn.Conn>(c).peerCertificates!, 0)).PublicKey as crypto.PublicKey | null)
			}

			let __goscriptTuple6: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			msg = __goscriptTuple6[0]
			err = __goscriptTuple6[1]
			if (err != null) {
				return err
			}
		}
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection != null) {
			{
				let __goscriptShadow9 = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection!($.markAsStructValue($.cloneStructValue(__goscript_conn.Conn.prototype.connectionStateLocked.call(c))))
				if (__goscriptShadow9 != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return __goscriptShadow9
				}
			}
		}

		// Get client key exchange
		let __goscriptTuple7: any = $.typeAssertTuple<__goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" })
		let ckx: __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null = __goscriptTuple7[0]
		let ok = __goscriptTuple7[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(ckx, "*tls.clientKeyExchangeMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" }), msg)
		}

		let __goscriptTuple8: any = await $.pointerValue<Exclude<__goscript_key_agreement.keyAgreement, null>>(__goscriptShadow0).processClientKeyExchange($.pointerValue<__goscript_conn.Conn>(c).config, $.pointerValue<serverHandshakeState>(hs).cert, ckx, $.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16))
		let preMasterSecret: $.Slice<number> = __goscriptTuple8[0]
		err = __goscriptTuple8[1]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return err
		}
		if ($.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).extendedMasterSecret) {
			$.pointerValue<__goscript_conn.Conn>(c).extMasterSecret = true
			$.pointerValue<serverHandshakeState>(hs).masterSecret = await __goscript_prf.extMasterFromPreMasterSecret($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<serverHandshakeState>(hs).suite, preMasterSecret, await $.markAsStructValue($.cloneStructValue($.pointerValue<serverHandshakeState>(hs).finishedHash)).Sum())
		} else {
			if (fips140tls.Required()) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
				return errors.New("tls: FIPS 140-3 requires the use of Extended Master Secret")
			}
			$.pointerValue<serverHandshakeState>(hs).masterSecret = await __goscript_prf.masterFromPreMasterSecret($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<serverHandshakeState>(hs).suite, preMasterSecret, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).random)
		}
		{
			let __goscriptShadow10 = await __goscript_common.Config.prototype.writeKeyLog.call($.pointerValue<__goscript_conn.Conn>(c).config, "CLIENT_RANDOM", $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).random, $.pointerValue<serverHandshakeState>(hs).masterSecret)
			if (__goscriptShadow10 != null) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return __goscriptShadow10
			}
		}

		// If we received a client cert in response to our certificate request message,
		// the client will send us a certificateVerifyMsg immediately after the
		// clientKeyExchangeMsg. This message is a digest of all preceding
		// handshake-layer messages that is signed using the private key corresponding
		// to the client's certificate. This allows us to verify that the client is in
		// possession of the private key of the certificate.
		if ($.len($.pointerValue<__goscript_conn.Conn>(c).peerCertificates) > 0) {
			// certificateVerifyMsg is included in the transcript, but not until
			// after we verify the handshake signature, since the state before
			// this message was sent is used.
			let __goscriptTuple9: any = await __goscript_conn.Conn.prototype.readHandshake.call(c, null)
			msg = __goscriptTuple9[0]
			err = __goscriptTuple9[1]
			if (err != null) {
				return err
			}
			let __goscriptTuple10: any = $.typeAssertTuple<__goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" })
			let certVerify: __goscript_handshake_messages.certificateVerifyMsg | $.VarRef<__goscript_handshake_messages.certificateVerifyMsg> | null = __goscriptTuple10[0]
			let __goscriptShadow11 = __goscriptTuple10[1]
			if (!__goscriptShadow11) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
				return __goscript_common.unexpectedMessageError($.interfaceValue<any>(certVerify, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), msg)
			}

			let sigType: number = 0
			let sigHash: crypto.Hash = 0
			if ($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16) >= $.uint(771, 16)) {
				if (!__goscript_common.isSupportedSignatureAlgorithm($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16), $.pointerValue<__goscript_handshake_messages.certificateRequestMsg>(certReq).supportedSignatureAlgorithms)) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
					return errors.New("tls: client certificate used with invalid signature algorithm")
				}
				let __goscriptTuple11: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16))
				sigType = $.uint(__goscriptTuple11[0], 8)
				sigHash = __goscriptTuple11[1]
				err = __goscriptTuple11[2]
				if (err != null) {
					return __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				}
				if (sigHash == crypto.SHA1) {
					godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1))
					godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1))
				}
				if ($.pointerValue<serverHandshakeState>(hs).finishedHash.buffer == null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return errors.New("tls: internal error: did not keep handshake transcript for TLS 1.2")
				}
				{
					let __goscriptShadow12 = await __goscript_auth.verifyHandshakeSignature($.uint(sigType, 8), pub, sigHash, $.pointerValue<serverHandshakeState>(hs).finishedHash.buffer, $.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signature)
					if (__goscriptShadow12 != null) {
						await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(51, 8))
						return errors.New("tls: invalid signature by the client certificate: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow12).Error())
					}
				}
			} else {
				let __goscriptTuple12: any = __goscript_auth.legacyTypeAndHashFromPublicKey(pub)
				sigType = $.uint(__goscriptTuple12[0], 8)
				sigHash = __goscriptTuple12[1]
				err = __goscriptTuple12[2]
				if (err != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
					return err
				}
				let signed: $.Slice<number> = await $.markAsStructValue($.cloneStructValue($.pointerValue<serverHandshakeState>(hs).finishedHash)).hashForClientCertificate($.uint(sigType, 8))
				{
					let __goscriptShadow13 = await __goscript_auth.verifyLegacyHandshakeSignature($.uint(sigType, 8), pub, sigHash, signed, $.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signature)
					if (__goscriptShadow13 != null) {
						await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(51, 8))
						return errors.New("tls: invalid signature by the client certificate: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow13).Error())
					}
				}
			}

			$.pointerValue<__goscript_conn.Conn>(c).peerSigAlg = $.uint($.pointerValue<__goscript_handshake_messages.certificateVerifyMsg>(certVerify).signatureAlgorithm, 16)

			{
				let __goscriptShadow14 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(certVerify, "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
				if (__goscriptShadow14 != null) {
					return __goscriptShadow14
				}
			}
		}

		$.pointerValue<serverHandshakeState>(hs).finishedHash.discardHandshakeBuffer()

		return null
	}

	public async doResumeHandshake(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).cipherSuite = $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).id, 16)
		$.pointerValue<__goscript_conn.Conn>(c).cipherSuite = $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).id, 16)
		// We echo the client's session ID in the ServerHello to let it know
		// that we're doing a resumption.
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).sessionId = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).sessionId
		// We always send a new session ticket, even if it wraps the same master
		// secret and it's potentially encrypted with the same key, to help the
		// client avoid cross-connection tracking from a network observer.
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).ticketSupported = true
		$.pointerValue<serverHandshakeState>(hs).finishedHash = $.markAsStructValue($.cloneStructValue(await __goscript_prf.newFinishedHash($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<serverHandshakeState>(hs).suite)))
		$.pointerValue<serverHandshakeState>(hs).finishedHash.discardHandshakeBuffer()
		{
			let err = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeState>(hs).clientHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (err != null) {
				return err
			}
		}
		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>($.pointerValue<serverHandshakeState>(hs).hello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (err != null) {
				return err
			}
		}

		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection != null) {
			{
				let err = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).VerifyConnection!($.markAsStructValue($.cloneStructValue(__goscript_conn.Conn.prototype.connectionStateLocked.call(c))))
				if (err != null) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return err
				}
			}
		}

		$.pointerValue<serverHandshakeState>(hs).masterSecret = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<serverHandshakeState>(hs).sessionState).secret

		return null
	}

	public async establishKeys(): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

		let __goscriptTuple13: any = await __goscript_prf.keysFromMasterSecret($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<serverHandshakeState>(hs).suite, $.pointerValue<serverHandshakeState>(hs).masterSecret, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).random, $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).macLen, $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).keyLen, $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).ivLen)
		let clientMAC: $.Slice<number> = __goscriptTuple13[0]
		let serverMAC: $.Slice<number> = __goscriptTuple13[1]
		let clientKey: $.Slice<number> = __goscriptTuple13[2]
		let serverKey: $.Slice<number> = __goscriptTuple13[3]
		let clientIV: $.Slice<number> = __goscriptTuple13[4]
		let serverIV: $.Slice<number> = __goscriptTuple13[5]

		let clientCipher: any = null as any
		let serverCipher: any = null as any
		let clientHash: hash.Hash | null = null as hash.Hash | null
		let serverHash: hash.Hash | null = null as hash.Hash | null

		if ($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).aead == null) {
			clientCipher = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).cipher!(clientKey, clientIV, true)
			clientHash = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).mac!(clientMAC)
			serverCipher = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).cipher!(serverKey, serverIV, false)
			serverHash = await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).mac!(serverMAC)
		} else {
			clientCipher = (await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).aead!(clientKey, clientIV) as any)
			serverCipher = (await $.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).aead!(serverKey, serverIV) as any)
		}

		$.pointerValue<__goscript_conn.Conn>(c)._in.prepareCipherSpec($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), clientCipher, clientHash)
		$.pointerValue<__goscript_conn.Conn>(c).out.prepareCipherSpec($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), serverCipher, serverHash)

		return null
	}

	public async handshake(): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

		{
			let err = await serverHandshakeState.prototype.processClientHello.call(hs)
			if (err != null) {
				return err
			}
		}

		// For an overview of TLS handshaking, see RFC 5246, Section 7.3.
		$.pointerValue<__goscript_conn.Conn>(c).buffering = true
		{
			let err = await serverHandshakeState.prototype.checkForResumption.call(hs)
			if (err != null) {
				return err
			}
		}
		if ($.pointerValue<serverHandshakeState>(hs).sessionState != null) {
			// The client has included a session ticket and so we do an abbreviated handshake.
			{
				let err = await serverHandshakeState.prototype.doResumeHandshake.call(hs)
				if (err != null) {
					return err
				}
			}
			{
				let err = await serverHandshakeState.prototype.establishKeys.call(hs)
				if (err != null) {
					return err
				}
			}
			{
				let err = await serverHandshakeState.prototype.sendSessionTicket.call(hs)
				if (err != null) {
					return err
				}
			}
			{
				let err = await serverHandshakeState.prototype.sendFinished.call(hs, $.goSlice($.pointerValue<__goscript_conn.Conn>(c).serverFinished, undefined, undefined))
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
			$.pointerValue<__goscript_conn.Conn>(c).clientFinishedIsFirst = false
			{
				let err = await serverHandshakeState.prototype.readFinished.call(hs, null)
				if (err != null) {
					return err
				}
			}
		} else {
			// The client didn't include a session ticket, or it wasn't
			// valid so we do a full handshake.
			{
				let err = await serverHandshakeState.prototype.pickCipherSuite.call(hs)
				if (err != null) {
					return err
				}
			}
			{
				let err = await serverHandshakeState.prototype.doFullHandshake.call(hs)
				if (err != null) {
					return err
				}
			}
			{
				let err = await serverHandshakeState.prototype.establishKeys.call(hs)
				if (err != null) {
					return err
				}
			}
			{
				let err = await serverHandshakeState.prototype.readFinished.call(hs, $.goSlice($.pointerValue<__goscript_conn.Conn>(c).clientFinished, undefined, undefined))
				if (err != null) {
					return err
				}
			}
			$.pointerValue<__goscript_conn.Conn>(c).clientFinishedIsFirst = true
			$.pointerValue<__goscript_conn.Conn>(c).buffering = true
			{
				let err = await serverHandshakeState.prototype.sendSessionTicket.call(hs)
				if (err != null) {
					return err
				}
			}
			{
				let err = await serverHandshakeState.prototype.sendFinished.call(hs, null)
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
		}

		$.pointerValue<__goscript_conn.Conn>(c).ekm = __goscript_prf.ekmFromMasterSecret($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<serverHandshakeState>(hs).suite, $.pointerValue<serverHandshakeState>(hs).masterSecret, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).random)
		$.pointerValue<__goscript_conn.Conn>(c).isHandshakeComplete.Store(true)

		return null
	}

	public async pickCipherSuite(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

		let preferenceList: $.Slice<number> = __goscript_common.Config.prototype.cipherSuites.call($.pointerValue<__goscript_conn.Conn>(c).config, __goscript_cipher_suites.isAESGCMPreferred($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).cipherSuites))

		$.pointerValue<serverHandshakeState>(hs).suite = await __goscript_cipher_suites.selectCipherSuite(preferenceList, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).cipherSuites, $.functionValue(((__receiver) => (c: __goscript_cipher_suites.cipherSuite | $.VarRef<__goscript_cipher_suites.cipherSuite> | null) => __receiver.cipherSuiteOk(c))($.pointerValue<serverHandshakeState>(hs)), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "tls.cipherSuite" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
		if ($.pointerValue<serverHandshakeState>(hs).suite == null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return fmt.Errorf("tls: no cipher suite supported by both client and server; client offered: %x", $.interfaceValue<any>($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).cipherSuites, "[]uint16", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }))
		}
		$.pointerValue<__goscript_conn.Conn>(c).cipherSuite = $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).id, 16)

		if ((($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).CipherSuites == null) && !fips140tls.Required()) && $.mapGet<number, boolean, boolean>(__goscript_cipher_suites.rsaKexCiphers, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).id, 16), false)[0]) {
			godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_defaults.tlsrsakex))
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_defaults.tlsrsakex))
		}
		if ((($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).CipherSuites == null) && !fips140tls.Required()) && $.mapGet<number, boolean, boolean>(__goscript_cipher_suites.tdesCiphers, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuite>($.pointerValue<serverHandshakeState>(hs).suite).id, 16), false)[0]) {
			godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_defaults.tls3des))
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_defaults.tls3des))
		}

		for (let __goscriptRangeTarget1 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).cipherSuites, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let id = __goscriptRangeTarget1![__rangeIndex]
			if ($.uint(id, 16) == $.uint(22016, 16)) {
				// The client is doing a fallback connection. See RFC 7507.
				if ($.uint($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).vers, 16) < $.uint(__goscript_common.Config.prototype.maxSupportedVersion.call($.pointerValue<__goscript_conn.Conn>(c).config, false), 16)) {
					await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(86, 8))
					return errors.New("tls: client using inappropriate protocol fallback")
				}
				break
			}
		}

		return null
	}

	public async processClientHello(): globalThis.Promise<$.GoError> {
		let hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

		$.pointerValue<serverHandshakeState>(hs).hello = new __goscript_handshake_messages.serverHelloMsg()
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).vers = $.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16)

		let foundCompression = false
		// We only support null compression, so check that the client offered it.
		for (let __goscriptRangeTarget2 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).compressionMethods, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let compression = __goscriptRangeTarget2![__rangeIndex]
			if ($.uint(compression, 8) == $.uint(0, 8)) {
				foundCompression = true
				break
			}
		}

		if (!foundCompression) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: client does not support uncompressed connections")
		}

		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).random = $.makeSlice<number>(32, undefined, "byte")
		let serverRandom: $.Slice<number> = $.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).random
		// Downgrade protection canaries. See RFC 8446, Section 4.1.3.
		let maxVers = $.uint(__goscript_common.Config.prototype.maxSupportedVersion.call($.pointerValue<__goscript_conn.Conn>(c).config, false), 16)
		if ((($.uint(maxVers, 16) >= $.uint(771, 16)) && ($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16) < $.uint(maxVers, 16))) || __goscript_common.testingOnlyForceDowngradeCanary) {
			if ($.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16) == $.uint(771, 16)) {
				$.copy($.goSlice(serverRandom, 24, undefined), "DOWNGRD\x01")
			} else {
				$.copy($.goSlice(serverRandom, 24, undefined), "DOWNGRD\x00")
			}
			serverRandom = $.goSlice(serverRandom, undefined, 24)
		}
		let [, err] = await io.ReadFull($.pointerValueOrNil(__goscript_common.Config.prototype.rand.call($.pointerValue<__goscript_conn.Conn>(c).config))!, serverRandom)
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			return err
		}

		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).secureRenegotiation) != 0) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return errors.New("tls: initial handshake had non-empty renegotiation extension")
		}

		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).extendedMasterSecret = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).extendedMasterSecret
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).secureRenegotiationSupported = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).secureRenegotiationSupported
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).compressionMethod = $.uint(0, 8)
		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).serverName) > 0) {
			$.pointerValue<__goscript_conn.Conn>(c).serverName = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).serverName
		}

		let __goscriptTuple14: any = negotiateALPN($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).NextProtos, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).alpnProtocols, false)
		let selectedProto = __goscriptTuple14[0]
		err = __goscriptTuple14[1]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(120, 8))
			return err
		}
		$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).alpnProtocol = selectedProto
		$.pointerValue<__goscript_conn.Conn>(c).clientProtocol = selectedProto

		let __goscriptTuple15: any = await __goscript_common.Config.prototype.getCertificate.call($.pointerValue<__goscript_conn.Conn>(c).config, clientHelloInfo($.pointerValue<serverHandshakeState>(hs).ctx, c, $.pointerValue<serverHandshakeState>(hs).clientHello))
		$.pointerValue<serverHandshakeState>(hs).cert = __goscriptTuple15[0]
		err = __goscriptTuple15[1]
		if (err != null) {
			if ($.comparableEqual(err, __goscript_common.errNoCertificates)) {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(112, 8))
			} else {
				await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
			}
			return err
		}
		if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).scts) {
			$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).scts = $.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeState>(hs).cert).SignedCertificateTimestamps
		}

		let __goscriptTuple16: any = supportsECDHE($.pointerValue<__goscript_conn.Conn>(c).config, $.uint($.pointerValue<__goscript_conn.Conn>(c).vers, 16), $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).supportedCurves, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).supportedPoints)
		$.pointerValue<serverHandshakeState>(hs).ecdheOk = __goscriptTuple16[0]
		err = __goscriptTuple16[1]
		if (err != null) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(109, 8))
			return err
		}

		if ($.pointerValue<serverHandshakeState>(hs).ecdheOk && ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>($.pointerValue<serverHandshakeState>(hs).clientHello).supportedPoints) > 0)) {
			// Although omitting the ec_point_formats extension is permitted, some
			// old OpenSSL version will refuse to handshake if not present.
			//
			// Per RFC 4492, section 5.1.2, implementations MUST support the
			// uncompressed point format. See golang.org/issue/31943.
			$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).supportedPoints = new Uint8Array([0]) as $.Slice<number>
		}

		{
			let [priv, ok] = $.typeAssertTuple<crypto.Signer | null>($.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeState>(hs).cert).PrivateKey, "crypto.Signer")
			if (ok) {
				{
					const __goscriptTypeSwitchValue = await $.pointerValue<Exclude<crypto.Signer, null>>(priv).Public()
					switch (true) {
						case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
							{
								$.pointerValue<serverHandshakeState>(hs).ecSignOk = true
							}
							break
						case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
							{
								$.pointerValue<serverHandshakeState>(hs).ecSignOk = true
							}
							break
						case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
							{
								$.pointerValue<serverHandshakeState>(hs).rsaSignOk = true
							}
							break
						default:
							{
								await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
								return fmt.Errorf("tls: unsupported signing key type (%T)", (await $.pointerValue<Exclude<crypto.Signer, null>>(priv).Public() as any))
							}
							break
					}
				}
			}
		}
		{
			let [priv, ok] = $.typeAssertTuple<crypto.Decrypter | null>($.pointerValue<__goscript_common.Certificate>($.pointerValue<serverHandshakeState>(hs).cert).PrivateKey, "crypto.Decrypter")
			if (ok) {
				{
					const __goscriptTypeSwitchValue = await $.pointerValue<Exclude<crypto.Decrypter, null>>(priv).Public()
					switch (true) {
						case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
							{
								$.pointerValue<serverHandshakeState>(hs).rsaDecryptOk = true
							}
							break
						default:
							{
								await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(80, 8))
								return fmt.Errorf("tls: unsupported decryption key type (%T)", (await $.pointerValue<Exclude<crypto.Decrypter, null>>(priv).Public() as any))
							}
							break
					}
				}
			}
		}

		return null
	}

	public async readFinished(out: $.Slice<number>): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

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
		let __goscriptTuple17: any = $.typeAssertTuple<__goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" })
		let clientFinished: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = __goscriptTuple17[0]
		let ok = __goscriptTuple17[1]
		if (!ok) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(clientFinished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), msg)
		}

		let verify: $.Slice<number> = await $.markAsStructValue($.cloneStructValue($.pointerValue<serverHandshakeState>(hs).finishedHash)).clientSum($.pointerValue<serverHandshakeState>(hs).masterSecret)
		if (($.len(verify) != $.len($.pointerValue<__goscript_handshake_messages.finishedMsg>(clientFinished).verifyData)) || (subtle.ConstantTimeCompare(verify, $.pointerValue<__goscript_handshake_messages.finishedMsg>(clientFinished).verifyData) != 1)) {
			await __goscript_conn.Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			return errors.New("tls: client's Finished message is incorrect")
		}

		{
			let __goscriptShadow15 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(clientFinished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (__goscriptShadow15 != null) {
				return __goscriptShadow15
			}
		}

		$.copy(out, verify)
		return null
	}

	public async sendFinished(out: $.Slice<number>): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c

		{
			let err = await __goscript_conn.Conn.prototype.writeChangeCipherRecord.call(c)
			if (err != null) {
				return err
			}
		}

		let finished: __goscript_handshake_messages.finishedMsg | $.VarRef<__goscript_handshake_messages.finishedMsg> | null = new __goscript_handshake_messages.finishedMsg()
		$.pointerValue<__goscript_handshake_messages.finishedMsg>(finished).verifyData = await $.markAsStructValue($.cloneStructValue($.pointerValue<serverHandshakeState>(hs).finishedHash)).serverSum($.pointerValue<serverHandshakeState>(hs).masterSecret)
		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(finished, "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (err != null) {
				return err
			}
		}

		$.copy(out, $.pointerValue<__goscript_handshake_messages.finishedMsg>(finished).verifyData)

		return null
	}

	public async sendSessionTicket(): globalThis.Promise<$.GoError> {
		const hs: serverHandshakeState | $.VarRef<serverHandshakeState> | null = this
		if (!$.pointerValue<__goscript_handshake_messages.serverHelloMsg>($.pointerValue<serverHandshakeState>(hs).hello).ticketSupported) {
			return null
		}

		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<serverHandshakeState>(hs).c
		let m: __goscript_handshake_messages.newSessionTicketMsg | $.VarRef<__goscript_handshake_messages.newSessionTicketMsg> | null = new __goscript_handshake_messages.newSessionTicketMsg()

		let state: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = await __goscript_conn.Conn.prototype.sessionState.call(c)
		$.pointerValue<__goscript_ticket.SessionState>(state).secret = $.pointerValue<serverHandshakeState>(hs).masterSecret
		if ($.pointerValue<serverHandshakeState>(hs).sessionState != null) {
			// If this is re-wrapping an old key, then keep
			// the original time it was created.
			$.pointerValue<__goscript_ticket.SessionState>(state).createdAt = $.pointerValue<__goscript_ticket.SessionState>($.pointerValue<serverHandshakeState>(hs).sessionState).createdAt
		}
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).WrapSession != null) {
			let err: $.GoError = null as $.GoError
			let __goscriptTuple18: any = await $.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).WrapSession!($.markAsStructValue($.cloneStructValue(__goscript_conn.Conn.prototype.connectionStateLocked.call(c))), state)
			$.pointerValue<__goscript_handshake_messages.newSessionTicketMsg>(m).ticket = __goscriptTuple18[0]
			err = __goscriptTuple18[1]
			if (err != null) {
				return err
			}
		} else {
			let __goscriptTuple19: any = await __goscript_ticket.SessionState.prototype.Bytes.call(state)
			let stateBytes: $.Slice<number> = __goscriptTuple19[0]
			let err = __goscriptTuple19[1]
			if (err != null) {
				return err
			}
			let __goscriptTuple20: any = await __goscript_common.Config.prototype.encryptTicket.call($.pointerValue<__goscript_conn.Conn>(c).config, stateBytes, $.pointerValue<__goscript_conn.Conn>(c).ticketKeys)
			$.pointerValue<__goscript_handshake_messages.newSessionTicketMsg>(m).ticket = __goscriptTuple20[0]
			err = __goscriptTuple20[1]
			if (err != null) {
				return err
			}
		}

		{
			let [, err] = await __goscript_conn.Conn.prototype.writeHandshakeRecord.call($.pointerValue<serverHandshakeState>(hs).c, $.interfaceValue<__goscript_common.handshakeMessage | null>(m, "*tls.newSessionTicketMsg", { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsg" }), $.interfaceValue<__goscript_handshake_messages.transcriptHash | null>($.pointerValue<serverHandshakeState>(hs)._fields.finishedHash, "*tls.finishedHash", { kind: $.TypeKind.Pointer, elemType: "tls.finishedHash" }))
			if (err != null) {
				return err
			}
		}

		return null
	}

	static __typeInfo = $.registerStructType(
		"tls.serverHandshakeState",
		() => new serverHandshakeState(),
		[{ name: "checkForResumption", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "cipherSuiteOk", args: [{ name: "c", type: { kind: $.TypeKind.Pointer, elemType: "tls.cipherSuite" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "doFullHandshake", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "doResumeHandshake", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "establishKeys", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "handshake", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "pickCipherSuite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "processClientHello", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readFinished", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "sendFinished", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "sendSessionTicket", args: [], returns: [{ name: "_r0", type: "error" }] }],
		serverHandshakeState,
		[{ name: "c", key: "c", type: { kind: $.TypeKind.Pointer, elemType: "tls.Conn" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "ctx", key: "ctx", type: "context.Context", pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "clientHello", key: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }, pkgPath: "crypto/tls", index: [2], offset: 24, exported: false }, { name: "hello", key: "hello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }, pkgPath: "crypto/tls", index: [3], offset: 32, exported: false }, { name: "suite", key: "suite", type: { kind: $.TypeKind.Pointer, elemType: "tls.cipherSuite" }, pkgPath: "crypto/tls", index: [4], offset: 40, exported: false }, { name: "ecdheOk", key: "ecdheOk", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [5], offset: 48, exported: false }, { name: "ecSignOk", key: "ecSignOk", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [6], offset: 49, exported: false }, { name: "rsaDecryptOk", key: "rsaDecryptOk", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [7], offset: 50, exported: false }, { name: "rsaSignOk", key: "rsaSignOk", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [8], offset: 51, exported: false }, { name: "sessionState", key: "sessionState", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" }, pkgPath: "crypto/tls", index: [9], offset: 56, exported: false }, { name: "finishedHash", key: "finishedHash", type: "tls.finishedHash", pkgPath: "crypto/tls", index: [10], offset: 64, exported: false }, { name: "masterSecret", key: "masterSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [11], offset: 168, exported: false }, { name: "cert", key: "cert", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" }, pkgPath: "crypto/tls", index: [12], offset: 192, exported: false }]
	)
}

export function negotiateALPN(serverProtos: $.Slice<string>, clientProtos: $.Slice<string>, quic: boolean): [string, $.GoError] {
	if (($.len(serverProtos) == 0) || ($.len(clientProtos) == 0)) {
		if (quic && ($.len(serverProtos) != 0)) {
			// RFC 9001, Section 8.1
			return ["", fmt.Errorf("tls: client did not request an application protocol")]
		}
		return ["", null]
	}
	let http11fallback: boolean = false
	for (let __goscriptRangeTarget4 = serverProtos, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let s = __goscriptRangeTarget4![__rangeIndex]
		for (let __goscriptRangeTarget3 = clientProtos, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let c = __goscriptRangeTarget3![__rangeIndex]
			if ($.stringEqual(s, c)) {
				return [s, null]
			}
			if (($.stringEqual(s, "h2")) && ($.stringEqual(c, "http/1.1"))) {
				http11fallback = true
			}
		}
	}
	// As a special case, let http/1.1 clients connect to h2 servers as if they
	// didn't support ALPN. We used not to enforce protocol overlap, so over
	// time a number of HTTP servers were configured with only "h2", but
	// expected to accept connections from "http/1.1" clients. See Issue 46310.
	if (http11fallback) {
		return ["", null]
	}
	return ["", fmt.Errorf("tls: client requested unsupported application protocols (%q)", $.interfaceValue<any>(clientProtos, "[]string", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }))]
}

export function supportsECDHE(c: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, version: number, supportedCurves: $.Slice<__goscript_common.CurveID>, supportedPoints: $.Slice<number>): [boolean, $.GoError] {
	let supportsCurve = false
	for (let __goscriptRangeTarget5 = supportedCurves, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
		let curve = __goscriptRangeTarget5![__rangeIndex]
		if (__goscript_common.Config.prototype.supportsCurve.call(c, $.uint(version, 16), $.uint(curve, 16))) {
			supportsCurve = true
			break
		}
	}

	let supportsPointFormat = false
	let offeredNonCompressedFormat = false
	for (let __goscriptRangeTarget6 = supportedPoints, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
		let pointFormat = __goscriptRangeTarget6![__rangeIndex]
		if ($.uint(pointFormat, 8) == $.uint(0, 8)) {
			supportsPointFormat = true
		} else {
			offeredNonCompressedFormat = true
		}
	}
	// Per RFC 8422, Section 5.1.2, if the Supported Point Formats extension is
	// missing, uncompressed points are supported. If supportedPoints is empty,
	// the extension must be missing, as an empty extension body is rejected by
	// the parser. See https://go.dev/issue/49126.
	if ($.len(supportedPoints) == 0) {
		supportsPointFormat = true
	} else {
		if (offeredNonCompressedFormat && !supportsPointFormat) {
			return [false, errors.New("tls: client offered only incompatible point formats")]
		}
	}

	return [supportsCurve && supportsPointFormat, null]
}

export function clientHelloInfo(ctx: context.Context | null, c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null): __goscript_common.ClientHelloInfo | $.VarRef<__goscript_common.ClientHelloInfo> | null {
	let supportedVersions: $.Slice<number> = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedVersions
	if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedVersions) == 0) {
		supportedVersions = __goscript_common.supportedVersionsFromMax($.uint($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).vers, 16))
	}

	return new __goscript_common.ClientHelloInfo({CipherSuites: $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).cipherSuites, ServerName: $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).serverName, SupportedCurves: $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedCurves, SupportedPoints: $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedPoints, SignatureSchemes: $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedSignatureAlgorithms, SupportedProtos: $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).alpnProtocols, SupportedVersions: supportedVersions, Extensions: $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).extensions, Conn: $.pointerValue<__goscript_conn.Conn>(c).conn, HelloRetryRequest: $.pointerValue<__goscript_conn.Conn>(c).didHRR, config: $.pointerValue<__goscript_conn.Conn>(c).config, ctx: ctx})
}
