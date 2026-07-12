// Generated file based on quic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as crypto from "@goscript/crypto/index.js"

import type * as cipher from "@goscript/crypto/cipher/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import type * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as hash from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_alert from "./alert.gs.ts"

import type * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_conn from "./conn.gs.ts"

import * as __goscript_ech from "./ech.gs.ts"

import * as __goscript_handshake_client from "./handshake_client.gs.ts"

import * as __goscript_handshake_client_tls13 from "./handshake_client_tls13.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_handshake_server from "./handshake_server.gs.ts"

import * as __goscript_handshake_server_tls13 from "./handshake_server_tls13.gs.ts"

import type * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"

import * as __goscript_tls from "./tls.gs.ts"
import "@goscript/context/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./alert.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./conn.gs.ts"
import "./ech.gs.ts"
import "./handshake_client.gs.ts"
import "./handshake_client_tls13.gs.ts"
import "./handshake_messages.gs.ts"
import "./handshake_server.gs.ts"
import "./handshake_server_tls13.gs.ts"
import "./ticket.gs.ts"
import "./tls.gs.ts"

export type QUICEncryptionLevel = number

export type QUICEventKind = number

export class QUICConn {
	public get conn(): __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null {
		return this._fields.conn.value
	}
	public set conn(value: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null) {
		this._fields.conn.value = value
	}

	public get sessionTicketSent(): boolean {
		return this._fields.sessionTicketSent.value
	}
	public set sessionTicketSent(value: boolean) {
		this._fields.sessionTicketSent.value = value
	}

	public _fields: {
		conn: $.VarRef<__goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null>
		sessionTicketSent: $.VarRef<boolean>
	}

	constructor(init?: Partial<{conn?: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, sessionTicketSent?: boolean}>) {
		this._fields = {
			conn: $.varRef(init?.conn ?? (null as __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null)),
			sessionTicketSent: $.varRef(init?.sessionTicketSent ?? (false as boolean))
		}
	}

	public clone(): QUICConn {
		const cloned = new QUICConn()
		cloned._fields = {
			conn: $.varRef(this._fields.conn.value),
			sessionTicketSent: $.varRef(this._fields.sessionTicketSent.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const q: QUICConn | $.VarRef<QUICConn> | null = this
		if ($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).ctx == null) {
			return null
		}
		await $.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).cancel!()
		await $.chanRecv($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).signalc)
		while (true) {
			let __goscriptRange0 = await $.chanRecvWithOk($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).blockedc)
			if (!__goscriptRange0.ok) {
				break
			}
		}
		return $.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr
	}

	public async ConnectionState(): globalThis.Promise<__goscript_common.ConnectionState> {
		const q: QUICConn | $.VarRef<QUICConn> | null = this
		return $.markAsStructValue($.cloneStructValue(await __goscript_conn.Conn.prototype.ConnectionState.call($.pointerValue<QUICConn>(q).conn)))
	}

	public async HandleData(level: QUICEncryptionLevel, data: $.Slice<number>): globalThis.Promise<$.GoError> {
		let q: QUICConn | $.VarRef<QUICConn> | null = this
		using __defer = new $.DisposableStack()
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<QUICConn>(q).conn
		if ($.pointerValue<__goscript_conn.Conn>(c)._in.level != level) {
			return quicError($.pointerValue<__goscript_conn.Conn>(c)._in.setErrorLocked(errors.New("tls: handshake data received at wrong level")))
		}
		$.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>(c).quic).readbuf = data
		await $.chanRecv($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>(c).quic).signalc)
		let __goscriptRecv0 = await $.chanRecvWithOk($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>(c).quic).blockedc)
		let ok = __goscriptRecv0.ok
		if (ok) {
			// The handshake goroutine is waiting for more data.
			return null
		}
		// The handshake goroutine has exited.
		await $.pointerValue<__goscript_conn.Conn>(c).handshakeMutex.Lock()
		__defer.defer(() => { $.pointerValue<__goscript_conn.Conn>(c).handshakeMutex.Unlock() })
		$.pointerValue<__goscript_conn.Conn>(c).hand.Write($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>(c).quic).readbuf)
		$.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>(c).quic).readbuf = null
		while (($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).hand.Len() >= 4) && ($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr == null)) {
			let b: $.Slice<number> = $.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).hand.Bytes()
			let n = (($.int($.arrayIndex(b!, 1)) << 16) | ($.int($.arrayIndex(b!, 2)) << 8)) | $.int($.arrayIndex(b!, 3))
			if (n > 65536) {
				$.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr = fmt.Errorf("tls: handshake message of length %d bytes exceeds maximum of %d bytes", $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(65536, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
				break
			}
			if ($.len(b) < (4 + n)) {
				return null
			}
			{
				let err = await __goscript_conn.Conn.prototype.handlePostHandshakeMessage.call($.pointerValue<QUICConn>(q).conn)
				if (err != null) {
					$.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr = err
				}
			}
		}
		if ($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr != null) {
			return quicError($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr)
		}
		return null
	}

	public async NextEvent(): globalThis.Promise<QUICEvent> {
		const q: QUICConn | $.VarRef<QUICConn> | null = this
		let qs: quicState | $.VarRef<quicState> | null = $.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic
		{
			let last = $.pointerValue<quicState>(qs).nextEvent - 1
			if ((last >= 0) && ($.len($.arrayIndex($.pointerValue<quicState>(qs).events!, last).Data) > 0)) {
				// Write over some of the previous event's data,
				// to catch callers erroneously retaining it.
				$.arrayIndex($.pointerValue<quicState>(qs).events!, last).Data![0] = $.uint(0, 8)
			}
		}
		if (($.pointerValue<quicState>(qs).nextEvent >= $.len($.pointerValue<quicState>(qs).events)) && $.pointerValue<quicState>(qs).waitingForDrain) {
			$.pointerValue<quicState>(qs).waitingForDrain = false
			await $.chanRecv($.pointerValue<quicState>(qs).signalc)
			await $.chanRecv($.pointerValue<quicState>(qs).blockedc)
		}
		{
			let err = $.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr
			if (err != null) {
				if ($.pointerValue<quicState>(qs).errorReturned) {
					return $.markAsStructValue(new QUICEvent({Kind: 0}))
				}
				$.pointerValue<quicState>(qs).errorReturned = true
				$.pointerValue<quicState>(qs).events = null
				$.pointerValue<quicState>(qs).nextEvent = 0
				return $.markAsStructValue(new QUICEvent({Kind: 10, Err: $.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr}))
			}
		}
		if ($.pointerValue<quicState>(qs).nextEvent >= $.len($.pointerValue<quicState>(qs).events)) {
			$.pointerValue<quicState>(qs).events = $.goSlice($.pointerValue<quicState>(qs).events, undefined, 0)
			$.pointerValue<quicState>(qs).nextEvent = 0
			return $.markAsStructValue(new QUICEvent({Kind: 0}))
		}
		let e = $.markAsStructValue($.cloneStructValue($.arrayIndex($.pointerValue<quicState>(qs).events!, $.pointerValue<quicState>(qs).nextEvent)))
		$.pointerValue<quicState>(qs).events![$.pointerValue<quicState>(qs).nextEvent] = $.markAsStructValue(new QUICEvent())
		$.pointerValue<quicState>(qs).nextEvent++
		return $.markAsStructValue($.cloneStructValue(e))
	}

	public async SendSessionTicket(opts: QUICSessionTicketOptions): globalThis.Promise<$.GoError> {
		let q: QUICConn | $.VarRef<QUICConn> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<QUICConn>(q).conn
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).SessionTicketsDisabled) {
			return null
		}
		if (!$.pointerValue<__goscript_conn.Conn>(c).isHandshakeComplete.Load()) {
			return quicError(errors.New("tls: SendSessionTicket called before handshake completed"))
		}
		if ($.pointerValue<__goscript_conn.Conn>(c).isClient) {
			return quicError(errors.New("tls: SendSessionTicket called on the client"))
		}
		if ($.pointerValue<QUICConn>(q).sessionTicketSent) {
			return quicError(errors.New("tls: SendSessionTicket called multiple times"))
		}
		$.pointerValue<QUICConn>(q).sessionTicketSent = true
		return quicError(await __goscript_conn.Conn.prototype.sendSessionTicket.call(c, opts.EarlyData, opts.Extra))
	}

	public async SetTransportParameters(params: $.Slice<number>): globalThis.Promise<void> {
		let q: QUICConn | $.VarRef<QUICConn> | null = this
		if (params == null) {
			params = new Uint8Array([]) as $.Slice<number>
		}
		$.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).transportParams = params
		if ($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).started) {
			await $.chanRecv($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).signalc)
			await $.chanRecv($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).blockedc)
		}
	}

	public async Start(ctx: context.Context | null): globalThis.Promise<$.GoError> {
		let q: QUICConn | $.VarRef<QUICConn> | null = this
		if ($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).started) {
			return quicError(errors.New("tls: Start called more than once"))
		}
		$.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).started = true
		if ($.uint($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).config).MinVersion, 16) < $.uint(772, 16)) {
			return quicError(errors.New("tls: Config MinVersion must be at least TLS 1.3"))
		}
		queueMicrotask(async () => { await __goscript_conn.Conn.prototype.HandshakeContext.call($.pointerValue<QUICConn>(q).conn, ctx) })
		{
			let __goscriptRecv1 = await $.chanRecvWithOk($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).quic).blockedc)
			let ok = __goscriptRecv1.ok
			if (!ok) {
				return $.pointerValue<__goscript_conn.Conn>($.pointerValue<QUICConn>(q).conn).handshakeErr
			}
		}
		return null
	}

	public async StoreSession(session: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null): globalThis.Promise<$.GoError> {
		const q: QUICConn | $.VarRef<QUICConn> | null = this
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = $.pointerValue<QUICConn>(q).conn
		if (!$.pointerValue<__goscript_conn.Conn>(c).isClient) {
			return quicError(errors.New("tls: StoreSessionTicket called on the server"))
		}
		let cacheKey = await __goscript_conn.Conn.prototype.clientSessionCacheKey.call(c)
		if ($.stringEqual(cacheKey, "")) {
			return null
		}
		let cs: __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null = new __goscript_ticket.ClientSessionState({session: session})
		await $.pointerValue<Exclude<__goscript_common.ClientSessionCache, null>>($.pointerValue<__goscript_common.Config>($.pointerValue<__goscript_conn.Conn>(c).config).ClientSessionCache).Put(cacheKey, cs)
		return null
	}

	static __typeInfo = $.registerStructType(
		"tls.QUICConn",
		() => new QUICConn(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "ConnectionState", args: [], returns: [{ name: "_r0", type: "tls.ConnectionState" }] }, { name: "HandleData", args: [{ name: "level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "NextEvent", args: [], returns: [{ name: "_r0", type: "tls.QUICEvent" }] }, { name: "SendSessionTicket", args: [{ name: "opts", type: "tls.QUICSessionTicketOptions" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetTransportParameters", args: [{ name: "params", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Start", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "error" }] }, { name: "StoreSession", args: [{ name: "session", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" } }], returns: [{ name: "_r0", type: "error" }] }],
		QUICConn,
		[{ name: "conn", key: "conn", type: { kind: $.TypeKind.Pointer, elemType: "tls.Conn" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "sessionTicketSent", key: "sessionTicketSent", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }]
	)
}

export class QUICConfig {
	public get TLSConfig(): __goscript_common.Config | $.VarRef<__goscript_common.Config> | null {
		return this._fields.TLSConfig.value
	}
	public set TLSConfig(value: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null) {
		this._fields.TLSConfig.value = value
	}

	// EnableSessionEvents may be set to true to enable the
	// [QUICStoreSession] and [QUICResumeSession] events for client connections.
	// When this event is enabled, sessions are not automatically
	// stored in the client session cache.
	// The application should use [QUICConn.StoreSession] to store sessions.
	public get EnableSessionEvents(): boolean {
		return this._fields.EnableSessionEvents.value
	}
	public set EnableSessionEvents(value: boolean) {
		this._fields.EnableSessionEvents.value = value
	}

	public _fields: {
		TLSConfig: $.VarRef<__goscript_common.Config | $.VarRef<__goscript_common.Config> | null>
		EnableSessionEvents: $.VarRef<boolean>
	}

	constructor(init?: Partial<{TLSConfig?: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, EnableSessionEvents?: boolean}>) {
		this._fields = {
			TLSConfig: $.varRef(init?.TLSConfig ?? (null as __goscript_common.Config | $.VarRef<__goscript_common.Config> | null)),
			EnableSessionEvents: $.varRef(init?.EnableSessionEvents ?? (false as boolean))
		}
	}

	public clone(): QUICConfig {
		const cloned = new QUICConfig()
		cloned._fields = {
			TLSConfig: $.varRef(this._fields.TLSConfig.value),
			EnableSessionEvents: $.varRef(this._fields.EnableSessionEvents.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.QUICConfig",
		() => new QUICConfig(),
		[],
		QUICConfig,
		[{ name: "TLSConfig", key: "TLSConfig", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" }, index: [0], offset: 0, exported: true }, { name: "EnableSessionEvents", key: "EnableSessionEvents", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [1], offset: 8, exported: true }]
	)
}

export class QUICEvent {
	public get Kind(): QUICEventKind {
		return this._fields.Kind.value
	}
	public set Kind(value: QUICEventKind) {
		this._fields.Kind.value = value
	}

	// Set for QUICSetReadSecret, QUICSetWriteSecret, and QUICWriteData.
	public get Level(): QUICEncryptionLevel {
		return this._fields.Level.value
	}
	public set Level(value: QUICEncryptionLevel) {
		this._fields.Level.value = value
	}

	// Set for QUICTransportParameters, QUICSetReadSecret, QUICSetWriteSecret, and QUICWriteData.
	// The contents are owned by crypto/tls, and are valid until the next NextEvent call.
	public get Data(): $.Slice<number> {
		return this._fields.Data.value
	}
	public set Data(value: $.Slice<number>) {
		this._fields.Data.value = value
	}

	// Set for QUICSetReadSecret and QUICSetWriteSecret.
	public get Suite(): number {
		return this._fields.Suite.value
	}
	public set Suite(value: number) {
		this._fields.Suite.value = value
	}

	// Set for QUICResumeSession and QUICStoreSession.
	public get SessionState(): __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null {
		return this._fields.SessionState.value
	}
	public set SessionState(value: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null) {
		this._fields.SessionState.value = value
	}

	// Set for QUICErrorEvent.
	// The error will wrap AlertError.
	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		Kind: $.VarRef<QUICEventKind>
		Level: $.VarRef<QUICEncryptionLevel>
		Data: $.VarRef<$.Slice<number>>
		Suite: $.VarRef<number>
		SessionState: $.VarRef<__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null>
		Err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{Kind?: QUICEventKind, Level?: QUICEncryptionLevel, Data?: $.Slice<number>, Suite?: number, SessionState?: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, Err?: $.GoError}>) {
		this._fields = {
			Kind: $.varRef(init?.Kind ?? (0 as QUICEventKind)),
			Level: $.varRef(init?.Level ?? (0 as QUICEncryptionLevel)),
			Data: $.varRef(init?.Data ?? (null as $.Slice<number>)),
			Suite: $.varRef(init?.Suite ?? (0 as number)),
			SessionState: $.varRef(init?.SessionState ?? (null as __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null)),
			Err: $.varRef(init?.Err ?? (null as $.GoError))
		}
	}

	public clone(): QUICEvent {
		const cloned = new QUICEvent()
		cloned._fields = {
			Kind: $.varRef(this._fields.Kind.value),
			Level: $.varRef(this._fields.Level.value),
			Data: $.varRef(this._fields.Data.value),
			Suite: $.varRef(this._fields.Suite.value),
			SessionState: $.varRef(this._fields.SessionState.value),
			Err: $.varRef(this._fields.Err.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.QUICEvent",
		() => new QUICEvent(),
		[],
		QUICEvent,
		[{ name: "Kind", key: "Kind", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEventKind" }, index: [0], offset: 0, exported: true }, { name: "Level", key: "Level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" }, index: [1], offset: 8, exported: true }, { name: "Data", key: "Data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [2], offset: 16, exported: true }, { name: "Suite", key: "Suite", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [3], offset: 40, exported: true }, { name: "SessionState", key: "SessionState", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" }, index: [4], offset: 48, exported: true }, { name: "Err", key: "Err", type: "error", index: [5], offset: 56, exported: true }]
	)
}

export class quicState {
	public get events(): $.Slice<QUICEvent> {
		return this._fields.events.value
	}
	public set events(value: $.Slice<QUICEvent>) {
		this._fields.events.value = value
	}

	public get nextEvent(): number {
		return this._fields.nextEvent.value
	}
	public set nextEvent(value: number) {
		this._fields.nextEvent.value = value
	}

	// eventArr is a statically allocated event array, large enough to handle
	// the usual maximum number of events resulting from a single call: transport
	// parameters, Initial data, Early read secret, Handshake write and read
	// secrets, Handshake data, Application write secret, Application data.
	public get eventArr(): QUICEvent[] {
		return this._fields.eventArr.value
	}
	public set eventArr(value: QUICEvent[]) {
		this._fields.eventArr.value = value
	}

	public get started(): boolean {
		return this._fields.started.value
	}
	public set started(value: boolean) {
		this._fields.started.value = value
	}

	public get signalc(): $.Channel<{}> | null {
		return this._fields.signalc.value
	}
	public set signalc(value: $.Channel<{}> | null) {
		this._fields.signalc.value = value
	}

	public get blockedc(): $.Channel<{}> | null {
		return this._fields.blockedc.value
	}
	public set blockedc(value: $.Channel<{}> | null) {
		this._fields.blockedc.value = value
	}

	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	public get cancel(): (() => void) | null {
		return this._fields.cancel.value
	}
	public set cancel(value: (() => void) | null) {
		this._fields.cancel.value = value
	}

	public get waitingForDrain(): boolean {
		return this._fields.waitingForDrain.value
	}
	public set waitingForDrain(value: boolean) {
		this._fields.waitingForDrain.value = value
	}

	public get errorReturned(): boolean {
		return this._fields.errorReturned.value
	}
	public set errorReturned(value: boolean) {
		this._fields.errorReturned.value = value
	}

	// readbuf is shared between HandleData and the handshake goroutine.
	// HandshakeCryptoData passes ownership to the handshake goroutine by
	// reading from signalc, and reclaims ownership by reading from blockedc.
	public get readbuf(): $.Slice<number> {
		return this._fields.readbuf.value
	}
	public set readbuf(value: $.Slice<number>) {
		this._fields.readbuf.value = value
	}

	public get transportParams(): $.Slice<number> {
		return this._fields.transportParams.value
	}
	public set transportParams(value: $.Slice<number>) {
		this._fields.transportParams.value = value
	}

	public get enableSessionEvents(): boolean {
		return this._fields.enableSessionEvents.value
	}
	public set enableSessionEvents(value: boolean) {
		this._fields.enableSessionEvents.value = value
	}

	public _fields: {
		events: $.VarRef<$.Slice<QUICEvent>>
		nextEvent: $.VarRef<number>
		eventArr: $.VarRef<QUICEvent[]>
		started: $.VarRef<boolean>
		signalc: $.VarRef<$.Channel<{}> | null>
		blockedc: $.VarRef<$.Channel<{}> | null>
		ctx: $.VarRef<context.Context | null>
		cancel: $.VarRef<(() => void) | null>
		waitingForDrain: $.VarRef<boolean>
		errorReturned: $.VarRef<boolean>
		readbuf: $.VarRef<$.Slice<number>>
		transportParams: $.VarRef<$.Slice<number>>
		enableSessionEvents: $.VarRef<boolean>
	}

	constructor(init?: Partial<{events?: $.Slice<QUICEvent>, nextEvent?: number, eventArr?: QUICEvent[], started?: boolean, signalc?: $.Channel<{}> | null, blockedc?: $.Channel<{}> | null, ctx?: context.Context | null, cancel?: (() => void) | null, waitingForDrain?: boolean, errorReturned?: boolean, readbuf?: $.Slice<number>, transportParams?: $.Slice<number>, enableSessionEvents?: boolean}>) {
		this._fields = {
			events: $.varRef(init?.events ?? (null as $.Slice<QUICEvent>)),
			nextEvent: $.varRef(init?.nextEvent ?? (0 as number)),
			eventArr: $.varRef(init?.eventArr !== undefined ? $.cloneArrayValue(init.eventArr) : Array.from({ length: 8 }, () => $.markAsStructValue(new QUICEvent()))),
			started: $.varRef(init?.started ?? (false as boolean)),
			signalc: $.varRef(init?.signalc ?? (null as $.Channel<{}> | null)),
			blockedc: $.varRef(init?.blockedc ?? (null as $.Channel<{}> | null)),
			ctx: $.varRef(init?.ctx ?? (null as context.Context | null)),
			cancel: $.varRef(init?.cancel ?? (null as (() => void) | null)),
			waitingForDrain: $.varRef(init?.waitingForDrain ?? (false as boolean)),
			errorReturned: $.varRef(init?.errorReturned ?? (false as boolean)),
			readbuf: $.varRef(init?.readbuf ?? (null as $.Slice<number>)),
			transportParams: $.varRef(init?.transportParams ?? (null as $.Slice<number>)),
			enableSessionEvents: $.varRef(init?.enableSessionEvents ?? (false as boolean))
		}
	}

	public clone(): quicState {
		const cloned = new quicState()
		cloned._fields = {
			events: $.varRef(this._fields.events.value),
			nextEvent: $.varRef(this._fields.nextEvent.value),
			eventArr: $.varRef($.cloneArrayValue(this._fields.eventArr.value)),
			started: $.varRef(this._fields.started.value),
			signalc: $.varRef(this._fields.signalc.value),
			blockedc: $.varRef(this._fields.blockedc.value),
			ctx: $.varRef(this._fields.ctx.value),
			cancel: $.varRef(this._fields.cancel.value),
			waitingForDrain: $.varRef(this._fields.waitingForDrain.value),
			errorReturned: $.varRef(this._fields.errorReturned.value),
			readbuf: $.varRef(this._fields.readbuf.value),
			transportParams: $.varRef(this._fields.transportParams.value),
			enableSessionEvents: $.varRef(this._fields.enableSessionEvents.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.quicState",
		() => new quicState(),
		[],
		quicState,
		[{ name: "events", key: "events", type: { kind: $.TypeKind.Slice, elemType: "tls.QUICEvent" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "nextEvent", key: "nextEvent", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [1], offset: 24, exported: false }, { name: "eventArr", key: "eventArr", type: { kind: $.TypeKind.Array, elemType: "tls.QUICEvent", length: 8 }, pkgPath: "crypto/tls", index: [2], offset: 32, exported: false }, { name: "started", key: "started", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [3], offset: 608, exported: false }, { name: "signalc", key: "signalc", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "crypto/tls", index: [4], offset: 616, exported: false }, { name: "blockedc", key: "blockedc", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "crypto/tls", index: [5], offset: 624, exported: false }, { name: "ctx", key: "ctx", type: "context.Context", pkgPath: "crypto/tls", index: [6], offset: 632, exported: false }, { name: "cancel", key: "cancel", type: ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [7], offset: 648, exported: false }, { name: "waitingForDrain", key: "waitingForDrain", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [8], offset: 656, exported: false }, { name: "errorReturned", key: "errorReturned", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [9], offset: 657, exported: false }, { name: "readbuf", key: "readbuf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [10], offset: 664, exported: false }, { name: "transportParams", key: "transportParams", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [11], offset: 688, exported: false }, { name: "enableSessionEvents", key: "enableSessionEvents", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [12], offset: 712, exported: false }]
	)
}

export class QUICSessionTicketOptions {
	// EarlyData specifies whether the ticket may be used for 0-RTT.
	public get EarlyData(): boolean {
		return this._fields.EarlyData.value
	}
	public set EarlyData(value: boolean) {
		this._fields.EarlyData.value = value
	}

	public get Extra(): $.Slice<$.Slice<number>> {
		return this._fields.Extra.value
	}
	public set Extra(value: $.Slice<$.Slice<number>>) {
		this._fields.Extra.value = value
	}

	public _fields: {
		EarlyData: $.VarRef<boolean>
		Extra: $.VarRef<$.Slice<$.Slice<number>>>
	}

	constructor(init?: Partial<{EarlyData?: boolean, Extra?: $.Slice<$.Slice<number>>}>) {
		this._fields = {
			EarlyData: $.varRef(init?.EarlyData ?? (false as boolean)),
			Extra: $.varRef(init?.Extra ?? (null as $.Slice<$.Slice<number>>))
		}
	}

	public clone(): QUICSessionTicketOptions {
		const cloned = new QUICSessionTicketOptions()
		cloned._fields = {
			EarlyData: $.varRef(this._fields.EarlyData.value),
			Extra: $.varRef(this._fields.Extra.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.QUICSessionTicketOptions",
		() => new QUICSessionTicketOptions(),
		[],
		QUICSessionTicketOptions,
		[{ name: "EarlyData", key: "EarlyData", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [0], offset: 0, exported: true }, { name: "Extra", key: "Extra", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, index: [1], offset: 8, exported: true }]
	)
}

export const QUICEncryptionLevelInitial: QUICEncryptionLevel = 0

export const QUICEncryptionLevelEarly: QUICEncryptionLevel = 1

export const QUICEncryptionLevelHandshake: QUICEncryptionLevel = 2

export const QUICEncryptionLevelApplication: QUICEncryptionLevel = 3

export const QUICNoEvent: QUICEventKind = 0

export const QUICSetReadSecret: QUICEventKind = 1

export const QUICSetWriteSecret: QUICEventKind = 2

export const QUICWriteData: QUICEventKind = 3

export const QUICTransportParameters: QUICEventKind = 4

export const QUICTransportParametersRequired: QUICEventKind = 5

export const QUICRejectedEarlyData: QUICEventKind = 6

export const QUICHandshakeDone: QUICEventKind = 7

export const QUICResumeSession: QUICEventKind = 8

export const QUICStoreSession: QUICEventKind = 9

export const QUICErrorEvent: QUICEventKind = 10

export async function QUICEncryptionLevel_String(l: QUICEncryptionLevel): globalThis.Promise<string> {
	switch (l) {
		case 0:
		{
			return "Initial"
			break
		}
		case 1:
		{
			return "Early"
			break
		}
		case 2:
		{
			return "Handshake"
			break
		}
		case 3:
		{
			return "Application"
			break
		}
		default:
		{
			return fmt.Sprintf("QUICEncryptionLevel(%v)", $.namedValueInterfaceValue<any>($.int(l), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function QUICClient(config: QUICConfig | $.VarRef<QUICConfig> | null): QUICConn | $.VarRef<QUICConn> | null {
	return newQUICConn(__goscript_tls.Client(null, $.pointerValue<QUICConfig>(config).TLSConfig), config)
}

export function QUICServer(config: QUICConfig | $.VarRef<QUICConfig> | null): QUICConn | $.VarRef<QUICConn> | null {
	return newQUICConn(__goscript_tls.Server(null, $.pointerValue<QUICConfig>(config).TLSConfig), config)
}

export function newQUICConn(conn: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, config: QUICConfig | $.VarRef<QUICConfig> | null): QUICConn | $.VarRef<QUICConn> | null {
	$.pointerValue<__goscript_conn.Conn>(conn).quic = new quicState({signalc: $.makeChannel<{}>(0, {}, "both"), blockedc: $.makeChannel<{}>(0, {}, "both"), enableSessionEvents: $.pointerValue<QUICConfig>(config).EnableSessionEvents})
	$.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>(conn).quic).events = $.goSlice($.pointerValue<quicState>($.pointerValue<__goscript_conn.Conn>(conn).quic).eventArr, undefined, 0)
	return new QUICConn({conn: conn})
}

export function quicError(err: $.GoError): $.GoError {
	if (err == null) {
		return null
	}
	{
		let [, ok] = errors.AsType({E: { type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.AlertError" }, zero: () => 0, methods: {Error: (receiver: any, ...args: any[]) => (__goscript_alert.AlertError_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, $.pointerValueOrNil(err)!)
		if (ok) {
			return err
		}
	}
	let __goscriptTuple0: any = errors.AsType({E: { type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" }, zero: () => 0, methods: {Error: (receiver: any, ...args: any[]) => (__goscript_alert.alert_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (__goscript_alert.alert_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, $.pointerValueOrNil(err)!)
	let a = ($.uint(__goscriptTuple0[0], 8) as __goscript_alert.alert)
	let ok = __goscriptTuple0[1]
	if (!ok) {
		a = $.uint(80, 8)
	}
	// Return an error wrapping the original error and an AlertError.
	// Truncate the text of the alert to 0 characters.
	return fmt.Errorf("%w%.0w", (err as any), $.namedValueInterfaceValue<any>($.uint(a, 8), "tls.AlertError", {Error: (receiver: any, ...args: any[]) => (__goscript_alert.AlertError_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.AlertError" }, [{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
}
