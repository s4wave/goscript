// Generated file based on tls.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as pem from "@goscript/encoding/pem/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as net from "@goscript/net/index.js"

import * as os from "@goscript/os/index.js"

import * as strings from "@goscript/strings/index.js"

import * as bytes from "@goscript/bytes/index.js"

import type * as cipher from "@goscript/crypto/cipher/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import type * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as hash from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import type * as __goscript_alert from "./alert.gs.ts"

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

import * as __goscript_quic from "./quic.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/context/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/encoding/pem/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/net/index.js"
import "@goscript/os/index.js"
import "@goscript/strings/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./conn.gs.ts"
import "./ech.gs.ts"
import "./handshake_client.gs.ts"
import "./handshake_client_tls13.gs.ts"
import "./handshake_messages.gs.ts"
import "./handshake_server.gs.ts"
import "./handshake_server_tls13.gs.ts"
import "./quic.gs.ts"
import "./ticket.gs.ts"

export class listener {
	public get Listener(): net.Listener | null {
		return this._fields.Listener.value
	}
	public set Listener(value: net.Listener | null) {
		this._fields.Listener.value = value
	}

	public get config(): __goscript_common.Config | $.VarRef<__goscript_common.Config> | null {
		return this._fields.config.value
	}
	public set config(value: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null) {
		this._fields.config.value = value
	}

	public _fields: {
		Listener: $.VarRef<net.Listener | null>
		config: $.VarRef<__goscript_common.Config | $.VarRef<__goscript_common.Config> | null>
	}

	constructor(init?: Partial<{Listener?: net.Listener | null, config?: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null}>) {
		this._fields = {
			Listener: $.varRef(init?.Listener ?? (null as net.Listener | null)),
			config: $.varRef(init?.config ?? (null as __goscript_common.Config | $.VarRef<__goscript_common.Config> | null))
		}
	}

	public clone(): listener {
		const cloned = new listener()
		cloned._fields = {
			Listener: $.varRef(this._fields.Listener.value),
			config: $.varRef(this._fields.config.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Accept(): globalThis.Promise<[net.Conn | null, $.GoError]> {
		const l: listener | $.VarRef<listener> | null = this
		let [c, err] = await $.pointerValue<Exclude<net.Listener, null>>($.pointerValue<listener>(l).Listener).Accept()
		if (err != null) {
			return [null, err]
		}
		return [$.interfaceValue<net.Conn | null>(Server(c, $.pointerValue<listener>(l).config), "*tls.Conn", { kind: $.TypeKind.Pointer, elemType: "tls.Conn" }), null]
	}

	public Addr(): any {
		return $.pointerValue<Exclude<net.Listener | null, null>>(this.Listener).Addr()
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<net.Listener | null, null>>(this.Listener).Close()
	}

	static __typeInfo = $.registerStructType(
		"tls.listener",
		() => new listener(),
		[{ name: "Accept", args: [], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "Addr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }],
		listener,
		[{ name: "Listener", key: "Listener", type: "net.Listener", anonymous: true, index: [0], offset: 0, exported: true }, { name: "config", key: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" }, pkgPath: "crypto/tls", index: [1], offset: 16, exported: false }]
	)
}

export class timeoutError {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): timeoutError {
		const cloned = new timeoutError()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		return "tls: DialWithDialer timed out"
	}

	public Temporary(): boolean {
		return true
	}

	public Timeout(): boolean {
		return true
	}

	static __typeInfo = $.registerStructType(
		"tls.timeoutError",
		() => new timeoutError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		timeoutError,
		[]
	)
}

export class Dialer {
	// NetDialer is the optional dialer to use for the TLS connections'
	// underlying TCP connections.
	// A nil NetDialer is equivalent to the net.Dialer zero value.
	public get NetDialer(): net.Dialer | $.VarRef<net.Dialer> | null {
		return this._fields.NetDialer.value
	}
	public set NetDialer(value: net.Dialer | $.VarRef<net.Dialer> | null) {
		this._fields.NetDialer.value = value
	}

	// Config is the TLS configuration to use for new connections.
	// A nil configuration is equivalent to the zero
	// configuration; see the documentation of Config for the
	// defaults.
	public get Config(): __goscript_common.Config | $.VarRef<__goscript_common.Config> | null {
		return this._fields.Config.value
	}
	public set Config(value: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null) {
		this._fields.Config.value = value
	}

	public _fields: {
		NetDialer: $.VarRef<net.Dialer | $.VarRef<net.Dialer> | null>
		Config: $.VarRef<__goscript_common.Config | $.VarRef<__goscript_common.Config> | null>
	}

	constructor(init?: Partial<{NetDialer?: net.Dialer | $.VarRef<net.Dialer> | null, Config?: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null}>) {
		this._fields = {
			NetDialer: $.varRef(init?.NetDialer ?? (null as net.Dialer | $.VarRef<net.Dialer> | null)),
			Config: $.varRef(init?.Config ?? (null as __goscript_common.Config | $.VarRef<__goscript_common.Config> | null))
		}
	}

	public clone(): Dialer {
		const cloned = new Dialer()
		cloned._fields = {
			NetDialer: $.varRef(this._fields.NetDialer.value),
			Config: $.varRef(this._fields.Config.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Dial(network: string, addr: string): globalThis.Promise<[net.Conn | null, $.GoError]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		return Dialer.prototype.DialContext.call(d, context.Background(), network, addr)
	}

	public async DialContext(ctx: context.Context | null, network: string, addr: string): globalThis.Promise<[net.Conn | null, $.GoError]> {
		const d: Dialer | $.VarRef<Dialer> | null = this
		let __goscriptTuple2: any = await dial(ctx, Dialer.prototype.netDialer.call(d), network, addr, $.pointerValue<Dialer>(d).Config)
		let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		if (err != null) {
			// Don't return c (a typed nil) in an interface.
			return [null, err]
		}
		return [$.interfaceValue<net.Conn | null>(c, "*tls.Conn", { kind: $.TypeKind.Pointer, elemType: "tls.Conn" }), null]
	}

	public netDialer(): net.Dialer | $.VarRef<net.Dialer> | null {
		const d: Dialer | $.VarRef<Dialer> | null = this
		if ($.pointerValue<Dialer>(d).NetDialer != null) {
			return $.pointerValue<Dialer>(d).NetDialer
		}
		return new net.Dialer()
	}

	static __typeInfo = $.registerStructType(
		"tls.Dialer",
		() => new Dialer(),
		[{ name: "Dial", args: [{ name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "addr", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "DialContext", args: [{ name: "ctx", type: "context.Context" }, { name: "network", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "addr", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "netDialer", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.Dialer" } }] }],
		Dialer,
		[{ name: "NetDialer", key: "NetDialer", type: { kind: $.TypeKind.Pointer, elemType: "net.Dialer" }, index: [0], offset: 0, exported: true }, { name: "Config", key: "Config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" }, index: [1], offset: 8, exported: true }]
	)
}

export function Server(conn: net.Conn | null, config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null): __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null {
	let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = new __goscript_conn.Conn({conn: conn, config: config})
	$.pointerValue<__goscript_conn.Conn>(c).handshakeFn = $.functionValue(((__receiver) => (ctx: context.Context | null) => __receiver.serverHandshake(ctx))($.pointerValue<__goscript_conn.Conn>(c)), ({ kind: $.TypeKind.Function, params: ["context.Context"], results: ["error"] } as $.FunctionTypeInfo))
	return c
}

export function Client(conn: net.Conn | null, config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null): __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null {
	let c: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = new __goscript_conn.Conn({conn: conn, config: config, isClient: true})
	$.pointerValue<__goscript_conn.Conn>(c).handshakeFn = $.functionValue(((__receiver) => (ctx: context.Context | null) => __receiver.clientHandshake(ctx))($.pointerValue<__goscript_conn.Conn>(c)), ({ kind: $.TypeKind.Function, params: ["context.Context"], results: ["error"] } as $.FunctionTypeInfo))
	return c
}

export function NewListener(inner: net.Listener | null, config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null): net.Listener | null {
	let l: listener | $.VarRef<listener> | null = new listener()
	$.pointerValue<listener>(l).Listener = inner
	$.pointerValue<listener>(l).config = config
	return $.interfaceValue<net.Listener | null>(l, "*tls.listener", { kind: $.TypeKind.Pointer, elemType: "tls.listener" })
}

export async function Listen(network: string, laddr: string, config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null): globalThis.Promise<[net.Listener | null, $.GoError]> {
	// If this condition changes, consider updating http.Server.ServeTLS too.
	if ((config == null) || ((($.len($.pointerValue<__goscript_common.Config>(config).Certificates) == 0) && ($.pointerValue<__goscript_common.Config>(config).GetCertificate == null)) && ($.pointerValue<__goscript_common.Config>(config).GetConfigForClient == null))) {
		return [null, errors.New("tls: neither Certificates, GetCertificate, nor GetConfigForClient set in Config")]
	}
	let [l, err] = await net.Listen(network, laddr)
	if (err != null) {
		return [null, err]
	}
	return [NewListener(l, config), null]
}

export async function DialWithDialer(dialer: net.Dialer | $.VarRef<net.Dialer> | null, network: string, addr: string, config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null): globalThis.Promise<[__goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, $.GoError]> {
	return dial(context.Background(), dialer, network, addr, config)
}

export async function dial(ctx: context.Context | null, netDialer: net.Dialer | $.VarRef<net.Dialer> | null, network: string, addr: string, config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null): globalThis.Promise<[__goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, $.GoError]> {
	await using __defer = new $.AsyncDisposableStack()
	if ($.pointerValue<net.Dialer>(netDialer).Timeout != 0n) {
		let cancel: context.CancelFunc | null = null as context.CancelFunc | null
		let __goscriptTuple0: any = context.WithTimeout($.pointerValueOrNil(ctx)!, $.pointerValue<net.Dialer>(netDialer).Timeout)
		ctx = __goscriptTuple0[0]
		cancel = __goscriptTuple0[1]
		__defer.defer(async () => { await cancel!() })
	}

	if (!$.markAsStructValue($.cloneStructValue($.pointerValue<net.Dialer>(netDialer).Deadline)).IsZero()) {
		let cancel: context.CancelFunc | null = null as context.CancelFunc | null
		let __goscriptTuple1: any = context.WithDeadline($.pointerValueOrNil(ctx)!, $.markAsStructValue($.cloneStructValue($.pointerValue<net.Dialer>(netDialer).Deadline)))
		ctx = __goscriptTuple1[0]
		cancel = __goscriptTuple1[1]
		__defer.defer(async () => { await cancel!() })
	}

	let [rawConn, err] = await net.Dialer.prototype.DialContext.call(netDialer, ctx, network, addr)
	if (err != null) {
		return [null, err]
	}

	let colonPos = strings.LastIndex(addr, ":")
	if (colonPos == -1) {
		colonPos = $.len(addr)
	}
	let hostname = $.sliceStringOrBytes(addr, undefined, colonPos)

	if (config == null) {
		config = __goscript_common.defaultConfig()
	}
	// If no ServerName is set, infer the ServerName
	// from the hostname we're connecting to.
	if ($.stringEqual($.pointerValue<__goscript_common.Config>(config).ServerName, "")) {
		// Make a copy to avoid polluting argument or default.
		let c: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null = await __goscript_common.Config.prototype.Clone.call(config)
		$.pointerValue<__goscript_common.Config>(c).ServerName = hostname
		config = c
	}

	let conn: __goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null = Client(rawConn, config)
	{
		let __goscriptShadow0 = await __goscript_conn.Conn.prototype.HandshakeContext.call(conn, ctx)
		if (__goscriptShadow0 != null) {
			await $.pointerValue<Exclude<net.Conn, null>>(rawConn).Close()
			return [null, __goscriptShadow0]
		}
	}
	return [conn, null]
}

export async function Dial(network: string, addr: string, config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null): globalThis.Promise<[__goscript_conn.Conn | $.VarRef<__goscript_conn.Conn> | null, $.GoError]> {
	return DialWithDialer(new net.Dialer(), network, addr, config)
}

export async function LoadX509KeyPair(certFile: string, keyFile: string): globalThis.Promise<[__goscript_common.Certificate, $.GoError]> {
	let __goscriptTuple3: any = os.ReadFile(certFile)
	let certPEMBlock: $.Slice<number> = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return [$.markAsStructValue(new __goscript_common.Certificate()), err]
	}
	let __goscriptTuple4: any = os.ReadFile(keyFile)
	let keyPEMBlock: $.Slice<number> = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		return [$.markAsStructValue(new __goscript_common.Certificate()), err]
	}
	return X509KeyPair(certPEMBlock, keyPEMBlock)
}

export let x509keypairleaf: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("x509keypairleaf")

export function __goscript_set_x509keypairleaf(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	x509keypairleaf = __goscriptValue
}

export async function X509KeyPair(certPEMBlock: $.Slice<number>, keyPEMBlock: $.Slice<number>): globalThis.Promise<[__goscript_common.Certificate, $.GoError]> {
	let fail: ((err: $.GoError) => [__goscript_common.Certificate, $.GoError] | globalThis.Promise<[__goscript_common.Certificate, $.GoError]>) | null = $.functionValue((err: $.GoError): [__goscript_common.Certificate, $.GoError] => {
		return [$.markAsStructValue(new __goscript_common.Certificate()), err]
	}, ({ kind: $.TypeKind.Function, params: ["error"], results: ["tls.Certificate", "error"] } as $.FunctionTypeInfo))

	let cert: __goscript_common.Certificate = $.markAsStructValue(new __goscript_common.Certificate())
	let skippedBlockTypes: $.Slice<string> = null as $.Slice<string>
	while (true) {
		let certDERBlock: pem.Block | $.VarRef<pem.Block> | null = null as pem.Block | $.VarRef<pem.Block> | null
		let __goscriptTuple5: any = pem.Decode(certPEMBlock)
		certDERBlock = __goscriptTuple5[0]
		certPEMBlock = __goscriptTuple5[1]
		if (certDERBlock == null) {
			break
		}
		if ($.stringEqual($.pointerValue<pem.Block>(certDERBlock).Type, "CERTIFICATE")) {
			cert.Certificate = $.append(cert.Certificate, $.pointerValue<pem.Block>(certDERBlock).Bytes)
		} else {
			skippedBlockTypes = $.append(skippedBlockTypes, $.pointerValue<pem.Block>(certDERBlock).Type)
		}
	}

	if ($.len(cert.Certificate) == 0) {
		if ($.len(skippedBlockTypes) == 0) {
			return fail!(errors.New("tls: failed to find any PEM data in certificate input"))
		}
		if (($.len(skippedBlockTypes) == 1) && strings.HasSuffix($.arrayIndex(skippedBlockTypes!, 0), "PRIVATE KEY")) {
			return fail!(errors.New("tls: failed to find certificate PEM data in certificate input, but did find a private key; PEM inputs may have been switched"))
		}
		return fail!(fmt.Errorf("tls: failed to find \"CERTIFICATE\" PEM block in certificate input after skipping PEM blocks of the following types: %v", $.interfaceValue<any>(skippedBlockTypes, "[]string", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } })))
	}

	skippedBlockTypes = $.goSlice(skippedBlockTypes, undefined, 0)
	let keyDERBlock: pem.Block | $.VarRef<pem.Block> | null = null as pem.Block | $.VarRef<pem.Block> | null
	while (true) {
		let __goscriptTuple6: any = pem.Decode(keyPEMBlock)
		keyDERBlock = __goscriptTuple6[0]
		keyPEMBlock = __goscriptTuple6[1]
		if (keyDERBlock == null) {
			if ($.len(skippedBlockTypes) == 0) {
				return fail!(errors.New("tls: failed to find any PEM data in key input"))
			}
			if (($.len(skippedBlockTypes) == 1) && ($.stringEqual($.arrayIndex(skippedBlockTypes!, 0), "CERTIFICATE"))) {
				return fail!(errors.New("tls: found a certificate rather than a key in the PEM for the private key"))
			}
			return fail!(fmt.Errorf("tls: failed to find PEM block with type ending in \"PRIVATE KEY\" in key input after skipping PEM blocks of the following types: %v", $.interfaceValue<any>(skippedBlockTypes, "[]string", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } })))
		}
		if (($.stringEqual($.pointerValue<pem.Block>(keyDERBlock).Type, "PRIVATE KEY")) || strings.HasSuffix($.pointerValue<pem.Block>(keyDERBlock).Type, " PRIVATE KEY")) {
			break
		}
		skippedBlockTypes = $.append(skippedBlockTypes, $.pointerValue<pem.Block>(keyDERBlock).Type)
	}

	// We don't need to parse the public key for TLS, but we so do anyway
	// to check that it looks sane and matches the private key.
	let __goscriptTuple7: any = await x509.ParseCertificate($.arrayIndex(cert.Certificate!, 0))
	let x509Cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple7[0]
	let err = __goscriptTuple7[1]
	if (err != null) {
		return fail!(err)
	}

	if (!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(x509keypairleaf)), "0")) {
		cert.Leaf = x509Cert
	} else {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(x509keypairleaf))
	}

	let __goscriptTuple8: any = await parsePrivateKey($.pointerValue<pem.Block>(keyDERBlock).Bytes)
	cert.PrivateKey = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		return fail!(err)
	}

	{
		const __goscriptTypeSwitchValue = $.pointerValue<x509.Certificate>(x509Cert).PublicKey
		switch (true) {
			case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
				{
					let pub: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).value
					let __goscriptTuple9: any = $.typeAssertTuple<rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null>(cert.PrivateKey, { kind: $.TypeKind.Pointer, elemType: "rsa.PrivateKey" })
					let priv: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple9[0]
					let ok = __goscriptTuple9[1]
					if (!ok) {
						return fail!(errors.New("tls: private key type does not match public key type"))
					}
					if (!$.pointerValue<rsa.PrivateKey>(priv).PublicKey.Equal($.interfaceValue<crypto.PublicKey | null>(pub, "*rsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }))) {
						return fail!(errors.New("tls: private key does not match public key"))
					}
				}
				break
			case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
				{
					let pub: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).value
					let __goscriptTuple10: any = $.typeAssertTuple<ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null>(cert.PrivateKey, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" })
					let priv: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple10[0]
					let ok = __goscriptTuple10[1]
					if (!ok) {
						return fail!(errors.New("tls: private key type does not match public key type"))
					}
					if (!$.pointerValue<ecdsa.PrivateKey>(priv).PublicKey.Equal($.interfaceValue<crypto.PublicKey | null>(pub, "*ecdsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }))) {
						return fail!(errors.New("tls: private key does not match public key"))
					}
				}
				break
			case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let pub: ed25519.PublicKey = $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					let __goscriptTuple11: any = $.typeAssertTuple<ed25519.PrivateKey>(cert.PrivateKey, { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } })
					let priv: ed25519.PrivateKey = (__goscriptTuple11[0] as ed25519.PrivateKey)
					let ok = __goscriptTuple11[1]
					if (!ok) {
						return fail!(errors.New("tls: private key type does not match public key type"))
					}
					if (!ed25519.PublicKey_Equal($.mustTypeAssert<ed25519.PublicKey>(ed25519.PrivateKey_Public(priv), { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }), $.namedValueInterfaceValue<crypto.PublicKey | null>(pub, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]))) {
						return fail!(errors.New("tls: private key does not match public key"))
					}
				}
				break
			default:
				{
					let pub: any = __goscriptTypeSwitchValue
					return fail!(errors.New("tls: unknown public key algorithm"))
				}
				break
		}
	}

	return [$.markAsStructValue($.cloneStructValue(cert)), null]
}

export async function parsePrivateKey(der: $.Slice<number>): globalThis.Promise<[crypto.PrivateKey | null, $.GoError]> {
	{
		let __goscriptTuple12: any = await x509.ParsePKCS1PrivateKey(der)
		let key: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple12[0]
		let err = __goscriptTuple12[1]
		if (err == null) {
			return [$.interfaceValue<crypto.PrivateKey | null>(key, "*rsa.PrivateKey", { kind: $.TypeKind.Pointer, elemType: "rsa.PrivateKey" }), null]
		}
	}
	{
		let [key, err] = await x509.ParsePKCS8PrivateKey(der)
		if (err == null) {
			{
				const __goscriptTypeSwitchValue = key
				switch (true) {
					case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PrivateKey" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }):
						{
							let key = __goscriptTypeSwitchValue
							return [(key as crypto.PrivateKey | null), null]
						}
						break
					default:
						{
							let key: any = __goscriptTypeSwitchValue
							return [null, errors.New("tls: found unknown private key type in PKCS#8 wrapping")]
						}
						break
				}
			}
		}
	}
	{
		let __goscriptTuple13: any = await x509.ParseECPrivateKey(der)
		let key: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple13[0]
		let err = __goscriptTuple13[1]
		if (err == null) {
			return [$.interfaceValue<crypto.PrivateKey | null>(key, "*ecdsa.PrivateKey", { kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" }), null]
		}
	}

	return [null, errors.New("tls: failed to parse private key")]
}
