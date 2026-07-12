// Generated file based on key_agreement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as md5 from "@goscript/crypto/md5/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as sha1 from "@goscript/crypto/sha1/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as slices2 from "@goscript/slices/index.js"

import * as context from "@goscript/context/index.js"

import * as hash from "@goscript/hash/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as net from "@goscript/net/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_auth from "./auth.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/md5/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/sha1/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/slices/index.js"
import "@goscript/context/index.js"
import "@goscript/hash/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./auth.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./handshake_messages.gs.ts"
import "./ticket.gs.ts"

export type keyAgreement = {
	generateClientKeyExchange(_p0: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, _p1: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, _p2: x509.Certificate | $.VarRef<x509.Certificate> | null): [$.Slice<number>, __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null, $.GoError] | globalThis.Promise<[$.Slice<number>, __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null, $.GoError]>
	generateServerKeyExchange(_p0: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, _p1: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, _p2: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, _p3: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null): [__goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null, $.GoError] | globalThis.Promise<[__goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null, $.GoError]>
	processClientKeyExchange(_p0: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, _p1: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, _p2: __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null, _p3: number): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	processServerKeyExchange(_p0: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, _p1: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, _p2: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null, _p3: x509.Certificate | $.VarRef<x509.Certificate> | null, _p4: __goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"tls.keyAgreement",
	null,
	[{ name: "generateClientKeyExchange", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "_p1", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "_p2", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" } }, { name: "_r2", type: "error" }] }, { name: "generateServerKeyExchange", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "_p1", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, { name: "_p2", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "_p3", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" } }, { name: "_r1", type: "error" }] }, { name: "processClientKeyExchange", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "_p1", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, { name: "_p2", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" } }, { name: "_p3", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "processServerKeyExchange", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "_p1", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "_p2", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" } }, { name: "_p3", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, { name: "_p4", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" } }], returns: [{ name: "_r0", type: "error" }] }]
);

export class rsaKeyAgreement {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): rsaKeyAgreement {
		const cloned = new rsaKeyAgreement()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public async generateClientKeyExchange(config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, cert: x509.Certificate | $.VarRef<x509.Certificate> | null): globalThis.Promise<[$.Slice<number>, __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null, $.GoError]> {
		const ka = this
		let preMasterSecret: $.Slice<number> = $.makeSlice<number>(48, undefined, "byte")
		preMasterSecret![0] = $.uint($.uint($.uintShr($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).vers, 8, 16), 8), 8)
		preMasterSecret![1] = $.uint($.uint($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).vers, 8), 8)
		let [, err] = await io.ReadFull($.pointerValueOrNil(__goscript_common.Config.prototype.rand.call(config))!, $.goSlice(preMasterSecret, 2, undefined))
		if (err != null) {
			return [null, null, err]
		}

		let __goscriptTuple0: any = $.typeAssertTuple<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>($.pointerValue<x509.Certificate>(cert).PublicKey, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })
		let rsaKey: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (!ok) {
			return [null, null, errors.New("tls: server certificate contains incorrect key type for selected ciphersuite")]
		}
		let __goscriptTuple1: any = await rsa.EncryptPKCS1v15(__goscript_common.Config.prototype.rand.call(config), rsaKey, preMasterSecret)
		let encrypted: $.Slice<number> = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (err != null) {
			return [null, null, err]
		}
		let ckx: __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null = new __goscript_handshake_messages.clientKeyExchangeMsg()
		$.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext = $.makeSlice<number>($.len(encrypted) + 2, undefined, "byte")
		$.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext![0] = $.uint($.uint($.len(encrypted) >> 8, 8), 8)
		$.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext![1] = $.uint($.uint($.len(encrypted), 8), 8)
		$.copy($.goSlice($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext, 2, undefined), encrypted)
		return [preMasterSecret, ckx, null]
	}

	public generateServerKeyExchange(config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, cert: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, hello: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null): [__goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null, $.GoError] {
		const ka = this
		return [null, null]
	}

	public async processClientKeyExchange(config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, cert: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, ckx: __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null, version: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const ka = this
		if ($.len($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext) < 2) {
			return [null, errClientKeyExchange]
		}
		let ciphertextLen = ($.int($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext!, 0)) << 8) | $.int($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext!, 1))
		if (ciphertextLen != ($.len($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext) - 2)) {
			return [null, errClientKeyExchange]
		}
		let ciphertext: $.Slice<number> = $.goSlice($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext, 2, undefined)

		let [priv, ok] = $.typeAssertTuple<crypto.Decrypter | null>($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey, "crypto.Decrypter")
		if (!ok) {
			return [null, errors.New("tls: certificate private key does not implement crypto.Decrypter")]
		}
		// Perform constant time RSA PKCS #1 v1.5 decryption
		let __goscriptTuple2: any = await $.pointerValue<Exclude<crypto.Decrypter, null>>(priv).Decrypt(__goscript_common.Config.prototype.rand.call(config), ciphertext, $.interfaceValue<crypto.DecrypterOpts | null>(new rsa.PKCS1v15DecryptOptions({SessionKeyLen: 48}), "*rsa.PKCS1v15DecryptOptions", { kind: $.TypeKind.Pointer, elemType: "rsa.PKCS1v15DecryptOptions" }))
		let preMasterSecret: $.Slice<number> = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		if (err != null) {
			return [null, err]
		}
		// We don't check the version number in the premaster secret. For one,
		// by checking it, we would leak information about the validity of the
		// encrypted pre-master secret. Secondly, it provides only a small
		// benefit against a downgrade attack and some implementations send the
		// wrong version anyway. See the discussion at the end of section
		// 7.4.7.1 of RFC 4346.
		return [preMasterSecret, null]
	}

	public processServerKeyExchange(config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, serverHello: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null, cert: x509.Certificate | $.VarRef<x509.Certificate> | null, skx: __goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null): $.GoError {
		const ka = this
		return errors.New("tls: unexpected ServerKeyExchange")
	}

	static __typeInfo = $.registerStructType(
		"tls.rsaKeyAgreement",
		() => new rsaKeyAgreement(),
		[{ name: "generateClientKeyExchange", args: [{ name: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" } }, { name: "_r2", type: "error" }] }, { name: "generateServerKeyExchange", args: [{ name: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, { name: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "hello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" } }, { name: "_r1", type: "error" }] }, { name: "processClientKeyExchange", args: [{ name: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, { name: "ckx", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" } }, { name: "version", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "processServerKeyExchange", args: [{ name: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "serverHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" } }, { name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, { name: "skx", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" } }], returns: [{ name: "_r0", type: "error" }] }],
		rsaKeyAgreement,
		[]
	)
}

export class ecdheKeyAgreement {
	public get version(): number {
		return this._fields.version.value
	}
	public set version(value: number) {
		this._fields.version.value = value
	}

	public get isRSA(): boolean {
		return this._fields.isRSA.value
	}
	public set isRSA(value: boolean) {
		this._fields.isRSA.value = value
	}

	// ckx and preMasterSecret are generated in processServerKeyExchange
	// and returned in generateClientKeyExchange.
	public get ckx(): __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null {
		return this._fields.ckx.value
	}
	public set ckx(value: __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null) {
		this._fields.ckx.value = value
	}

	public get preMasterSecret(): $.Slice<number> {
		return this._fields.preMasterSecret.value
	}
	public set preMasterSecret(value: $.Slice<number>) {
		this._fields.preMasterSecret.value = value
	}

	// curveID, signatureAlgorithm, and key are set by processServerKeyExchange
	// and generateServerKeyExchange.
	public get curveID(): __goscript_common.CurveID {
		return this._fields.curveID.value
	}
	public set curveID(value: __goscript_common.CurveID) {
		this._fields.curveID.value = value
	}

	public get signatureAlgorithm(): __goscript_common.SignatureScheme {
		return this._fields.signatureAlgorithm.value
	}
	public set signatureAlgorithm(value: __goscript_common.SignatureScheme) {
		this._fields.signatureAlgorithm.value = value
	}

	public get key(): ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null {
		return this._fields.key.value
	}
	public set key(value: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null) {
		this._fields.key.value = value
	}

	public _fields: {
		version: $.VarRef<number>
		isRSA: $.VarRef<boolean>
		ckx: $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null>
		preMasterSecret: $.VarRef<$.Slice<number>>
		curveID: $.VarRef<__goscript_common.CurveID>
		signatureAlgorithm: $.VarRef<__goscript_common.SignatureScheme>
		key: $.VarRef<ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null>
	}

	constructor(init?: Partial<{version?: number, isRSA?: boolean, ckx?: __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null, preMasterSecret?: $.Slice<number>, curveID?: __goscript_common.CurveID, signatureAlgorithm?: __goscript_common.SignatureScheme, key?: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null}>) {
		this._fields = {
			version: $.varRef(init?.version ?? (0 as number)),
			isRSA: $.varRef(init?.isRSA ?? (false as boolean)),
			ckx: $.varRef(init?.ckx ?? (null as __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null)),
			preMasterSecret: $.varRef(init?.preMasterSecret ?? (null as $.Slice<number>)),
			curveID: $.varRef(init?.curveID ?? (0 as __goscript_common.CurveID)),
			signatureAlgorithm: $.varRef(init?.signatureAlgorithm ?? (0 as __goscript_common.SignatureScheme)),
			key: $.varRef(init?.key ?? (null as ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null))
		}
	}

	public clone(): ecdheKeyAgreement {
		const cloned = new ecdheKeyAgreement()
		cloned._fields = {
			version: $.varRef(this._fields.version.value),
			isRSA: $.varRef(this._fields.isRSA.value),
			ckx: $.varRef(this._fields.ckx.value),
			preMasterSecret: $.varRef(this._fields.preMasterSecret.value),
			curveID: $.varRef(this._fields.curveID.value),
			signatureAlgorithm: $.varRef(this._fields.signatureAlgorithm.value),
			key: $.varRef(this._fields.key.value)
		}
		return $.markAsStructValue(cloned)
	}

	public generateClientKeyExchange(config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, cert: x509.Certificate | $.VarRef<x509.Certificate> | null): [$.Slice<number>, __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null, $.GoError] {
		const ka: ecdheKeyAgreement | $.VarRef<ecdheKeyAgreement> | null = this
		if ($.pointerValue<ecdheKeyAgreement>(ka).ckx == null) {
			return [null, null, errors.New("tls: missing ServerKeyExchange message")]
		}

		return [$.pointerValue<ecdheKeyAgreement>(ka).preMasterSecret, $.pointerValue<ecdheKeyAgreement>(ka).ckx, null]
	}

	public async generateServerKeyExchange(config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, cert: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, hello: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null): globalThis.Promise<[__goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null, $.GoError]> {
		let ka: ecdheKeyAgreement | $.VarRef<ecdheKeyAgreement> | null = this
		for (let __goscriptRangeTarget2 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedCurves, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let c = __goscriptRangeTarget2![__rangeIndex]
			if (__goscript_common.Config.prototype.supportsCurve.call(config, $.uint($.pointerValue<ecdheKeyAgreement>(ka).version, 16), $.uint(c, 16))) {
				$.pointerValue<ecdheKeyAgreement>(ka).curveID = $.uint(c, 16)
				break
			}
		}

		if ($.uint($.pointerValue<ecdheKeyAgreement>(ka).curveID, 16) == $.uint(0, 16)) {
			return [null, errors.New("tls: no supported elliptic curves offered")]
		}
		{
			let [, ok] = curveForCurveID($.uint($.pointerValue<ecdheKeyAgreement>(ka).curveID, 16))
			if (!ok) {
				return [null, errors.New("tls: CurvePreferences includes unsupported curve")]
			}
		}

		let __goscriptTuple3: any = await generateECDHEKey(__goscript_common.Config.prototype.rand.call(config), $.uint($.pointerValue<ecdheKeyAgreement>(ka).curveID, 16))
		let key: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple3[0]
		let err = __goscriptTuple3[1]
		if (err != null) {
			return [null, err]
		}
		$.pointerValue<ecdheKeyAgreement>(ka).key = key

		// See RFC 4492, Section 5.4.
		let ecdhePublic: $.Slice<number> = ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(ecdh.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh.PrivateKey>(key))))
		let serverECDHEParams: $.Slice<number> = $.makeSlice<number>(((1 + 2) + 1) + $.len(ecdhePublic), undefined, "byte")
		serverECDHEParams![0] = $.uint(3, 8)
		serverECDHEParams![1] = $.uint($.uint($.uintShr($.pointerValue<ecdheKeyAgreement>(ka).curveID, 8, 16), 8), 8)
		serverECDHEParams![2] = $.uint($.uint($.pointerValue<ecdheKeyAgreement>(ka).curveID, 8), 8)
		serverECDHEParams![3] = $.uint($.uint($.len(ecdhePublic), 8), 8)
		$.copy($.goSlice(serverECDHEParams, 4, undefined), ecdhePublic)

		let [priv, ok] = $.typeAssertTuple<crypto.Signer | null>($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey, "crypto.Signer")
		if (!ok) {
			return [null, fmt.Errorf("tls: certificate private key of type %T does not implement crypto.Signer", ($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey as any))]
		}

		let sig: $.Slice<number> = null as $.Slice<number>
		if ($.uint($.pointerValue<ecdheKeyAgreement>(ka).version, 16) >= $.uint(771, 16)) {
			let __goscriptTuple4: any = await __goscript_auth.selectSignatureScheme($.uint($.pointerValue<ecdheKeyAgreement>(ka).version, 16), cert, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedSignatureAlgorithms)
			$.pointerValue<ecdheKeyAgreement>(ka).signatureAlgorithm = $.uint(__goscriptTuple4[0], 16)
			err = __goscriptTuple4[1]
			if (err != null) {
				return [null, err]
			}
			let __goscriptTuple5: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint($.pointerValue<ecdheKeyAgreement>(ka).signatureAlgorithm, 16))
			let sigType = $.uint(__goscriptTuple5[0], 8)
			let sigHash = __goscriptTuple5[1]
			let __goscriptShadow0 = __goscriptTuple5[2]
			if (__goscriptShadow0 != null) {
				return [null, __goscriptShadow0]
			}
			if (sigHash == crypto.SHA1) {
				godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1))
				godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1))
			}
			let signed: $.Slice<number> = (slices2.Concat($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>(hello).random, serverECDHEParams) as $.Slice<number>)
			if ((($.uint(sigType, 8) == $.uint(225, 8)) || ($.uint(sigType, 8) == $.uint(226, 8))) != $.pointerValue<ecdheKeyAgreement>(ka).isRSA) {
				return [null, errors.New("tls: certificate cannot be used with the selected cipher suite")]
			}
			let signOpts = $.namedValueInterfaceValue<crypto.SignerOpts | null>(sigHash, "crypto.Hash", {Available: (receiver: any, ...args: any[]) => (crypto.Hash_Available as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), HashFunc: (receiver: any, ...args: any[]) => (crypto.Hash_HashFunc as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), New: (receiver: any, ...args: any[]) => (crypto.Hash_New as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Size: (receiver: any, ...args: any[]) => (crypto.Hash_Size as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (crypto.Hash_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, [{ name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "New", args: [], returns: [{ name: "_r0", type: "hash.Hash" }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])
			if ($.uint(sigType, 8) == $.uint(226, 8)) {
				signOpts = $.interfaceValue<crypto.SignerOpts | null>(new rsa.PSSOptions({SaltLength: rsa.PSSSaltLengthEqualsHash, Hash: sigHash}), "*rsa.PSSOptions", { kind: $.TypeKind.Pointer, elemType: "rsa.PSSOptions" })
			}
			let __goscriptTuple6: any = await crypto.SignMessage(priv, __goscript_common.Config.prototype.rand.call(config), signed, signOpts)
			sig = __goscriptTuple6[0]
			__goscriptShadow0 = __goscriptTuple6[1]
			if (__goscriptShadow0 != null) {
				return [null, errors.New("tls: failed to sign ECDHE parameters: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())]
			}
		} else {
			let __goscriptTuple7: any = __goscript_auth.legacyTypeAndHashFromPublicKey(await $.pointerValue<Exclude<crypto.Signer, null>>(priv).Public())
			let sigType = $.uint(__goscriptTuple7[0], 8)
			let sigHash = __goscriptTuple7[1]
			let __goscriptShadow1 = __goscriptTuple7[2]
			if (__goscriptShadow1 != null) {
				return [null, __goscriptShadow1]
			}
			let signed: $.Slice<number> = await hashForServerKeyExchange($.uint(sigType, 8), $.arrayToSlice<$.Slice<number>>([$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>(hello).random, serverECDHEParams]))
			if (($.uint(sigType, 8) == $.uint(225, 8)) != $.pointerValue<ecdheKeyAgreement>(ka).isRSA) {
				return [null, errors.New("tls: certificate cannot be used with the selected cipher suite")]
			}
			let __goscriptTuple8: any = await $.pointerValue<Exclude<crypto.Signer, null>>(priv).Sign(__goscript_common.Config.prototype.rand.call(config), signed, $.namedValueInterfaceValue<crypto.SignerOpts | null>(sigHash, "crypto.Hash", {Available: (receiver: any, ...args: any[]) => (crypto.Hash_Available as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), HashFunc: (receiver: any, ...args: any[]) => (crypto.Hash_HashFunc as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), New: (receiver: any, ...args: any[]) => (crypto.Hash_New as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Size: (receiver: any, ...args: any[]) => (crypto.Hash_Size as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (crypto.Hash_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, [{ name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "New", args: [], returns: [{ name: "_r0", type: "hash.Hash" }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
			sig = __goscriptTuple8[0]
			__goscriptShadow1 = __goscriptTuple8[1]
			if (__goscriptShadow1 != null) {
				return [null, errors.New("tls: failed to sign ECDHE parameters: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow1).Error())]
			}
		}

		let skx: __goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null = new __goscript_handshake_messages.serverKeyExchangeMsg()
		let sigAndHashLen = 0
		if ($.uint($.pointerValue<ecdheKeyAgreement>(ka).version, 16) >= $.uint(771, 16)) {
			sigAndHashLen = 2
		}
		$.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key = $.makeSlice<number>((($.len(serverECDHEParams) + sigAndHashLen) + 2) + $.len(sig), undefined, "byte")
		$.copy($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key, serverECDHEParams)
		let k: $.Slice<number> = $.goSlice($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key, $.len(serverECDHEParams), undefined)
		if ($.uint($.pointerValue<ecdheKeyAgreement>(ka).version, 16) >= $.uint(771, 16)) {
			k![0] = $.uint($.uint($.uintShr($.pointerValue<ecdheKeyAgreement>(ka).signatureAlgorithm, 8, 16), 8), 8)
			k![1] = $.uint($.uint($.pointerValue<ecdheKeyAgreement>(ka).signatureAlgorithm, 8), 8)
			k = $.goSlice(k, 2, undefined)
		}
		k![0] = $.uint($.uint($.len(sig) >> 8, 8), 8)
		k![1] = $.uint($.uint($.len(sig), 8), 8)
		$.copy($.goSlice(k, 2, undefined), sig)

		return [skx, null]
	}

	public async processClientKeyExchange(config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, cert: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, ckx: __goscript_handshake_messages.clientKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.clientKeyExchangeMsg> | null, version: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const ka: ecdheKeyAgreement | $.VarRef<ecdheKeyAgreement> | null = this
		if (($.len($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext) == 0) || ($.int($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext!, 0)) != ($.len($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext) - 1))) {
			return [null, errClientKeyExchange]
		}

		let __goscriptTuple9: any = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.PrivateKey.prototype.Curve.call($.pointerValue<ecdh.PrivateKey>($.pointerValue<ecdheKeyAgreement>(ka).key))).NewPublicKey($.goSlice($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>(ckx).ciphertext, 1, undefined))
		let peerKey: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null = __goscriptTuple9[0]
		let err = __goscriptTuple9[1]
		if (err != null) {
			return [null, errClientKeyExchange]
		}
		let __goscriptTuple10: any = ecdh.PrivateKey.prototype.ECDH.call($.pointerValue<ecdh.PrivateKey>($.pointerValue<ecdheKeyAgreement>(ka).key), peerKey)
		let preMasterSecret: $.Slice<number> = __goscriptTuple10[0]
		err = __goscriptTuple10[1]
		if (err != null) {
			return [null, errClientKeyExchange]
		}

		return [preMasterSecret, null]
	}

	public async processServerKeyExchange(config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, serverHello: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null, cert: x509.Certificate | $.VarRef<x509.Certificate> | null, skx: __goscript_handshake_messages.serverKeyExchangeMsg | $.VarRef<__goscript_handshake_messages.serverKeyExchangeMsg> | null): globalThis.Promise<$.GoError> {
		let ka: ecdheKeyAgreement | $.VarRef<ecdheKeyAgreement> | null = this
		if ($.len($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key) < 4) {
			return errServerKeyExchange
		}
		if ($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key!, 0), 8) != $.uint(3, 8)) {
			return errors.New("tls: server selected unsupported curve")
		}
		$.pointerValue<ecdheKeyAgreement>(ka).curveID = $.uint(($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key!, 1), 16) << 8) | $.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key!, 2), 16), 16)

		let publicLen = $.int($.arrayIndex($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key!, 3))
		if ((publicLen + 4) > $.len($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key)) {
			return errServerKeyExchange
		}
		let serverECDHEParams: $.Slice<number> = $.goSlice($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key, undefined, 4 + publicLen)
		let publicKey: $.Slice<number> = $.goSlice(serverECDHEParams, 4, undefined)

		let sig: $.Slice<number> = $.goSlice($.pointerValue<__goscript_handshake_messages.serverKeyExchangeMsg>(skx).key, 4 + publicLen, undefined)
		if ($.len(sig) < 2) {
			return errServerKeyExchange
		}
		if ($.uint($.pointerValue<ecdheKeyAgreement>(ka).version, 16) >= $.uint(771, 16)) {
			$.pointerValue<ecdheKeyAgreement>(ka).signatureAlgorithm = $.uint(($.uint($.arrayIndex(sig!, 0), 16) << 8) | $.uint($.arrayIndex(sig!, 1), 16), 16)
			sig = $.goSlice(sig, 2, undefined)
			if ($.len(sig) < 2) {
				return errServerKeyExchange
			}
		}
		let sigLen = ($.int($.arrayIndex(sig!, 0)) << 8) | $.int($.arrayIndex(sig!, 1))
		if ((sigLen + 2) != $.len(sig)) {
			return errServerKeyExchange
		}
		sig = $.goSlice(sig, 2, undefined)

		if (!slices2.Contains($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedCurves, $.uint($.pointerValue<ecdheKeyAgreement>(ka).curveID, 16))) {
			return errors.New("tls: server selected unoffered curve")
		}

		{
			let [, ok] = curveForCurveID($.uint($.pointerValue<ecdheKeyAgreement>(ka).curveID, 16))
			if (!ok) {
				return errors.New("tls: server selected unsupported curve")
			}
		}

		let __goscriptTuple11: any = await generateECDHEKey(__goscript_common.Config.prototype.rand.call(config), $.uint($.pointerValue<ecdheKeyAgreement>(ka).curveID, 16))
		let key: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple11[0]
		let err = __goscriptTuple11[1]
		if (err != null) {
			return err
		}
		$.pointerValue<ecdheKeyAgreement>(ka).key = key

		let __goscriptTuple12: any = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.PrivateKey.prototype.Curve.call($.pointerValue<ecdh.PrivateKey>(key))).NewPublicKey(publicKey)
		let peerKey: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null = __goscriptTuple12[0]
		err = __goscriptTuple12[1]
		if (err != null) {
			return errServerKeyExchange
		}
		let __goscriptTuple13: any = ecdh.PrivateKey.prototype.ECDH.call($.pointerValue<ecdh.PrivateKey>(key), peerKey)
		$.pointerValue<ecdheKeyAgreement>(ka).preMasterSecret = __goscriptTuple13[0]
		err = __goscriptTuple13[1]
		if (err != null) {
			return errServerKeyExchange
		}

		let ourPublicKey: $.Slice<number> = ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(ecdh.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh.PrivateKey>(key))))
		$.pointerValue<ecdheKeyAgreement>(ka).ckx = new __goscript_handshake_messages.clientKeyExchangeMsg()
		$.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>($.pointerValue<ecdheKeyAgreement>(ka).ckx).ciphertext = $.makeSlice<number>(1 + $.len(ourPublicKey), undefined, "byte")
		$.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>($.pointerValue<ecdheKeyAgreement>(ka).ckx).ciphertext![0] = $.uint($.uint($.len(ourPublicKey), 8), 8)
		$.copy($.goSlice($.pointerValue<__goscript_handshake_messages.clientKeyExchangeMsg>($.pointerValue<ecdheKeyAgreement>(ka).ckx).ciphertext, 1, undefined), ourPublicKey)

		let sigType: number = 0
		let sigHash: crypto.Hash = 0
		if ($.uint($.pointerValue<ecdheKeyAgreement>(ka).version, 16) >= $.uint(771, 16)) {
			if (!__goscript_common.isSupportedSignatureAlgorithm($.uint($.pointerValue<ecdheKeyAgreement>(ka).signatureAlgorithm, 16), $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedSignatureAlgorithms)) {
				return errors.New("tls: certificate used with invalid signature algorithm")
			}
			let __goscriptTuple14: any = __goscript_auth.typeAndHashFromSignatureScheme($.uint($.pointerValue<ecdheKeyAgreement>(ka).signatureAlgorithm, 16))
			sigType = $.uint(__goscriptTuple14[0], 8)
			sigHash = __goscriptTuple14[1]
			err = __goscriptTuple14[2]
			if (err != null) {
				return err
			}
			if (sigHash == crypto.SHA1) {
				godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1))
				godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1))
			}
			if ((($.uint(sigType, 8) == $.uint(225, 8)) || ($.uint(sigType, 8) == $.uint(226, 8))) != $.pointerValue<ecdheKeyAgreement>(ka).isRSA) {
				return errServerKeyExchange
			}
			let signed: $.Slice<number> = (slices2.Concat($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>(serverHello).random, serverECDHEParams) as $.Slice<number>)
			{
				let __goscriptShadow2 = await __goscript_auth.verifyHandshakeSignature($.uint(sigType, 8), ($.pointerValue<x509.Certificate>(cert).PublicKey as crypto.PublicKey | null), sigHash, signed, sig)
				if (__goscriptShadow2 != null) {
					return errors.New("tls: invalid signature by the server certificate: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow2).Error())
				}
			}
		} else {
			let __goscriptTuple15: any = __goscript_auth.legacyTypeAndHashFromPublicKey(($.pointerValue<x509.Certificate>(cert).PublicKey as crypto.PublicKey | null))
			sigType = $.uint(__goscriptTuple15[0], 8)
			sigHash = __goscriptTuple15[1]
			err = __goscriptTuple15[2]
			if (err != null) {
				return err
			}
			if (($.uint(sigType, 8) == $.uint(225, 8)) != $.pointerValue<ecdheKeyAgreement>(ka).isRSA) {
				return errServerKeyExchange
			}
			let signed: $.Slice<number> = await hashForServerKeyExchange($.uint(sigType, 8), $.arrayToSlice<$.Slice<number>>([$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).random, $.pointerValue<__goscript_handshake_messages.serverHelloMsg>(serverHello).random, serverECDHEParams]))
			{
				let __goscriptShadow3 = await __goscript_auth.verifyLegacyHandshakeSignature($.uint(sigType, 8), ($.pointerValue<x509.Certificate>(cert).PublicKey as crypto.PublicKey | null), sigHash, signed, sig)
				if (__goscriptShadow3 != null) {
					return errors.New("tls: invalid signature by the server certificate: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow3).Error())
				}
			}
		}

		return null
	}

	static __typeInfo = $.registerStructType(
		"tls.ecdheKeyAgreement",
		() => new ecdheKeyAgreement(),
		[{ name: "generateClientKeyExchange", args: [{ name: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" } }, { name: "_r2", type: "error" }] }, { name: "generateServerKeyExchange", args: [{ name: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, { name: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "hello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" } }, { name: "_r1", type: "error" }] }, { name: "processClientKeyExchange", args: [{ name: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, { name: "ckx", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" } }, { name: "version", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "processServerKeyExchange", args: [{ name: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" } }, { name: "clientHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "serverHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" } }, { name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, { name: "skx", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" } }], returns: [{ name: "_r0", type: "error" }] }],
		ecdheKeyAgreement,
		[{ name: "version", key: "version", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "isRSA", key: "isRSA", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [1], offset: 2, exported: false }, { name: "ckx", key: "ckx", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" }, pkgPath: "crypto/tls", index: [2], offset: 8, exported: false }, { name: "preMasterSecret", key: "preMasterSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [3], offset: 16, exported: false }, { name: "curveID", key: "curveID", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }, pkgPath: "crypto/tls", index: [4], offset: 40, exported: false }, { name: "signatureAlgorithm", key: "signatureAlgorithm", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }, pkgPath: "crypto/tls", index: [5], offset: 42, exported: false }, { name: "key", key: "key", type: { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" }, pkgPath: "crypto/tls", index: [6], offset: 48, exported: false }]
	)
}

export let errClientKeyExchange: $.GoError = errors.New("tls: invalid ClientKeyExchange message")

export function __goscript_set_errClientKeyExchange(__goscriptValue: $.GoError): void {
	errClientKeyExchange = __goscriptValue
}

export let errServerKeyExchange: $.GoError = errors.New("tls: invalid ServerKeyExchange message")

export function __goscript_set_errServerKeyExchange(__goscriptValue: $.GoError): void {
	errServerKeyExchange = __goscriptValue
}

export async function sha1Hash(slices: $.Slice<$.Slice<number>>): globalThis.Promise<$.Slice<number>> {
	let hsha1 = sha1.New()
	for (let __goscriptRangeTarget0 = slices, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let slice = __goscriptRangeTarget0![__rangeIndex]
		await $.pointerValue<Exclude<hash.Hash, null>>(hsha1).Write(slice)
	}
	return $.pointerValue<Exclude<hash.Hash, null>>(hsha1).Sum(null)
}

export async function md5SHA1Hash(slices: $.Slice<$.Slice<number>>): globalThis.Promise<$.Slice<number>> {
	let md5sha1: $.Slice<number> = $.makeSlice<number>(md5.Size + sha1.Size, undefined, "byte")
	let hmd5 = md5.New()
	for (let __goscriptRangeTarget1 = slices, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let slice = __goscriptRangeTarget1![__rangeIndex]
		await $.pointerValue<Exclude<hash.Hash, null>>(hmd5).Write(slice)
	}
	$.copy(md5sha1, await $.pointerValue<Exclude<hash.Hash, null>>(hmd5).Sum(null))
	$.copy($.goSlice(md5sha1, md5.Size, undefined), await sha1Hash(slices))
	return md5sha1
}

export async function hashForServerKeyExchange(sigType: number, slices: $.Slice<$.Slice<number>>): globalThis.Promise<$.Slice<number>> {
	if ($.uint(sigType, 8) == $.uint(227, 8)) {
		return sha1Hash(slices)
	}
	return md5SHA1Hash(slices)
}

export async function generateECDHEKey(rand: io.Reader | null, curveID: __goscript_common.CurveID): globalThis.Promise<[ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null, $.GoError]> {
	let [curve, ok] = curveForCurveID($.uint(curveID, 16))
	if (!ok) {
		return [null, errors.New("tls: internal error: unsupported curve")]
	}

	return $.pointerValue<Exclude<ecdh.Curve, null>>(curve).GenerateKey($.pointerValueOrNil(rand)!)
}

export function curveForCurveID(id: __goscript_common.CurveID): [ecdh.Curve | null, boolean] {
	switch (id) {
		case 29:
		{
			return [ecdh.X25519(), true]
			break
		}
		case 23:
		{
			return [ecdh.P256(), true]
			break
		}
		case 24:
		{
			return [ecdh.P384(), true]
			break
		}
		case 25:
		{
			return [ecdh.P521(), true]
			break
		}
		default:
		{
			return [null, false]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}
