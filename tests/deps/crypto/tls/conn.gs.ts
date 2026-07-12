// Generated file based on conn.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context2 from "@goscript/context/index.js"

import * as cipher2 from "@goscript/crypto/cipher/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as hash from "@goscript/hash/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import * as strings from "@goscript/strings/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as fips140tls from "@goscript/crypto/tls/internal/fips140tls/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as hkdf from "@goscript/crypto/hkdf/index.js"

import * as hmac from "@goscript/crypto/hmac/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as sort from "@goscript/sort/index.js"

import * as aes from "@goscript/crypto/aes/index.js"

import * as sha256 from "@goscript/crypto/sha256/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as big from "@goscript/math/big/index.js"

import * as __goscript_alert from "./alert.gs.ts"

import * as __goscript_cache from "./cache.gs.ts"

import * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_defaults from "./defaults.gs.ts"

import * as __goscript_defaults_fips140 from "./defaults_fips140.gs.ts"

import * as __goscript_ech from "./ech.gs.ts"

import * as __goscript_handshake_client from "./handshake_client.gs.ts"

import * as __goscript_handshake_client_tls13 from "./handshake_client_tls13.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_handshake_server from "./handshake_server.gs.ts"

import * as __goscript_handshake_server_tls13 from "./handshake_server_tls13.gs.ts"

import type * as __goscript_key_agreement from "./key_agreement.gs.ts"

import * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_prf from "./prf.gs.ts"

import * as __goscript_quic from "./quic.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/crypto/cipher/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/hash/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/strings/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/internal/fips140/tls13/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/tls/internal/fips140tls/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"
import "@goscript/crypto/hkdf/index.js"
import "@goscript/crypto/hmac/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/sort/index.js"
import "@goscript/crypto/aes/index.js"
import "@goscript/crypto/sha256/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/math/big/index.js"
import "./alert.gs.ts"
import "./cache.gs.ts"
import "./cipher_suites.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./defaults.gs.ts"
import "./defaults_fips140.gs.ts"
import "./ech.gs.ts"
import "./handshake_client.gs.ts"
import "./handshake_client_tls13.gs.ts"
import "./handshake_messages.gs.ts"
import "./handshake_server.gs.ts"
import "./handshake_server_tls13.gs.ts"
import "./key_schedule.gs.ts"
import "./prf.gs.ts"
import "./quic.gs.ts"
import "./ticket.gs.ts"

export type cbcMode = {
	BlockSize(): number | globalThis.Promise<number>
	CryptBlocks(dst: $.Slice<number>, src: $.Slice<number>): void
	SetIV(_p0: $.Slice<number>): void
}

$.registerInterfaceType(
	"tls.cbcMode",
	null,
	[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "CryptBlocks", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "SetIV", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }]
);

export class halfConn {
	public get Mutex(): sync.Mutex {
		return this._fields.Mutex.value
	}
	public set Mutex(value: sync.Mutex) {
		this._fields.Mutex.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get version(): number {
		return this._fields.version.value
	}
	public set version(value: number) {
		this._fields.version.value = value
	}

	public get cipher(): any {
		return this._fields.cipher.value
	}
	public set cipher(value: any) {
		this._fields.cipher.value = value
	}

	public get mac(): hash.Hash | null {
		return this._fields.mac.value
	}
	public set mac(value: hash.Hash | null) {
		this._fields.mac.value = value
	}

	public get seq(): Uint8Array {
		return this._fields.seq.value
	}
	public set seq(value: Uint8Array) {
		this._fields.seq.value = value
	}

	public get scratchBuf(): Uint8Array {
		return this._fields.scratchBuf.value
	}
	public set scratchBuf(value: Uint8Array) {
		this._fields.scratchBuf.value = value
	}

	public get nextCipher(): any {
		return this._fields.nextCipher.value
	}
	public set nextCipher(value: any) {
		this._fields.nextCipher.value = value
	}

	public get nextMac(): hash.Hash | null {
		return this._fields.nextMac.value
	}
	public set nextMac(value: hash.Hash | null) {
		this._fields.nextMac.value = value
	}

	public get level(): __goscript_quic.QUICEncryptionLevel {
		return this._fields.level.value
	}
	public set level(value: __goscript_quic.QUICEncryptionLevel) {
		this._fields.level.value = value
	}

	public get trafficSecret(): $.Slice<number> {
		return this._fields.trafficSecret.value
	}
	public set trafficSecret(value: $.Slice<number>) {
		this._fields.trafficSecret.value = value
	}

	public _fields: {
		Mutex: $.VarRef<sync.Mutex>
		err: $.VarRef<$.GoError>
		version: $.VarRef<number>
		cipher: $.VarRef<any>
		mac: $.VarRef<hash.Hash | null>
		seq: $.VarRef<Uint8Array>
		scratchBuf: $.VarRef<Uint8Array>
		nextCipher: $.VarRef<any>
		nextMac: $.VarRef<hash.Hash | null>
		level: $.VarRef<__goscript_quic.QUICEncryptionLevel>
		trafficSecret: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Mutex?: sync.Mutex, err?: $.GoError, version?: number, cipher?: any, mac?: hash.Hash | null, seq?: Uint8Array, scratchBuf?: Uint8Array, nextCipher?: any, nextMac?: hash.Hash | null, level?: __goscript_quic.QUICEncryptionLevel, trafficSecret?: $.Slice<number>}>) {
		this._fields = {
			Mutex: $.varRef(init?.Mutex ? $.markAsStructValue($.cloneStructValue(init.Mutex)) : $.markAsStructValue(new sync.Mutex())),
			err: $.varRef(init?.err ?? (null as $.GoError)),
			version: $.varRef(init?.version ?? (0 as number)),
			cipher: $.varRef(init?.cipher ?? (null as any)),
			mac: $.varRef(init?.mac ?? (null as hash.Hash | null)),
			seq: $.varRef(init?.seq !== undefined ? $.cloneArrayValue(init.seq) : new Uint8Array(8)),
			scratchBuf: $.varRef(init?.scratchBuf !== undefined ? $.cloneArrayValue(init.scratchBuf) : new Uint8Array(13)),
			nextCipher: $.varRef(init?.nextCipher ?? (null as any)),
			nextMac: $.varRef(init?.nextMac ?? (null as hash.Hash | null)),
			level: $.varRef(init?.level ?? (0 as __goscript_quic.QUICEncryptionLevel)),
			trafficSecret: $.varRef(init?.trafficSecret ?? (null as $.Slice<number>))
		}
	}

	public clone(): halfConn {
		const cloned = new halfConn()
		cloned._fields = {
			Mutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Mutex.value))),
			err: $.varRef(this._fields.err.value),
			version: $.varRef(this._fields.version.value),
			cipher: $.varRef(this._fields.cipher.value),
			mac: $.varRef(this._fields.mac.value),
			seq: $.varRef($.cloneArrayValue(this._fields.seq.value)),
			scratchBuf: $.varRef($.cloneArrayValue(this._fields.scratchBuf.value)),
			nextCipher: $.varRef(this._fields.nextCipher.value),
			nextMac: $.varRef(this._fields.nextMac.value),
			level: $.varRef(this._fields.level.value),
			trafficSecret: $.varRef(this._fields.trafficSecret.value)
		}
		return $.markAsStructValue(cloned)
	}

	public changeCipherSpec(): $.GoError {
		let hc: halfConn | $.VarRef<halfConn> | null = this
		if (($.pointerValue<halfConn>(hc).nextCipher == null) || ($.uint($.pointerValue<halfConn>(hc).version, 16) == $.uint(772, 16))) {
			return $.namedValueInterfaceValue<$.GoError>(80, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })
		}
		$.pointerValue<halfConn>(hc).cipher = $.pointerValue<halfConn>(hc).nextCipher
		$.pointerValue<halfConn>(hc).mac = $.pointerValue<halfConn>(hc).nextMac
		$.pointerValue<halfConn>(hc).nextCipher = null
		$.pointerValue<halfConn>(hc).nextMac = null
		$.clear($.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined))
		return null
	}

	public async decrypt(record: $.Slice<number>): globalThis.Promise<[$.Slice<number>, __goscript_common.recordType, $.GoError]> {
		const hc: halfConn | $.VarRef<halfConn> | null = this
		let plaintext: $.Slice<number> = null as $.Slice<number>
		let typ = $.uint($.uint($.arrayIndex(record!, 0), 8), 8)
		let payload: $.Slice<number> = $.goSlice(record, 5, undefined)

		// In TLS 1.3, change_cipher_spec messages are to be ignored without being
		// decrypted. See RFC 8446, Appendix D.4.
		if (($.uint($.pointerValue<halfConn>(hc).version, 16) == $.uint(772, 16)) && ($.uint(typ, 8) == $.uint(20, 8))) {
			return [payload, $.uint(typ, 8), null]
		}

		let paddingGood = $.uint($.uint(255, 8), 8)
		let paddingLen = 0

		let explicitNonceLen = await halfConn.prototype.explicitNonceLen.call(hc)

		if ($.pointerValue<halfConn>(hc).cipher != null) {
			{
				const __goscriptTypeSwitchValue = $.pointerValue<halfConn>(hc).cipher
				switch (true) {
					case $.typeAssert<cipher2.Stream | null>(__goscriptTypeSwitchValue, "cipher.Stream").ok:
						{
							let c: cipher2.Stream | null = $.typeAssert<cipher2.Stream | null>(__goscriptTypeSwitchValue, "cipher.Stream").value
							await $.pointerValue<Exclude<cipher2.Stream, null>>(c).XORKeyStream(payload, payload)
						}
						break
					case $.typeAssert<__goscript_cipher_suites.aead | null>(__goscriptTypeSwitchValue, "tls.aead").ok:
						{
							let c: __goscript_cipher_suites.aead | null = $.typeAssert<__goscript_cipher_suites.aead | null>(__goscriptTypeSwitchValue, "tls.aead").value
							if ($.len(payload) < explicitNonceLen) {
								return [null, $.uint(0, 8), $.namedValueInterfaceValue<$.GoError>(20, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
							}
							let nonce: $.Slice<number> = $.goSlice(payload, undefined, explicitNonceLen)
							if ($.len(nonce) == 0) {
								nonce = $.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined)
							}
							payload = $.goSlice(payload, explicitNonceLen, undefined)

							let additionalData: $.Slice<number> = null as $.Slice<number>
							if ($.uint($.pointerValue<halfConn>(hc).version, 16) == $.uint(772, 16)) {
								additionalData = $.goSlice(record, undefined, 5)
							} else {
								additionalData = $.appendSlice($.goSlice($.pointerValue<halfConn>(hc).scratchBuf, undefined, 0), $.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined), $.byteSliceHint)
								additionalData = $.appendSlice(additionalData, $.goSlice(record, undefined, 3), $.byteSliceHint)
								let n = $.len(payload) - await $.pointerValue<Exclude<__goscript_cipher_suites.aead, null>>(c).Overhead()
								additionalData = $.append(additionalData, $.uint($.uint(n >> 8, 8), 8), $.uint($.uint(n, 8), 8), $.byteSliceHint)
							}

							let err: $.GoError = null as $.GoError
							let __goscriptTuple46: any = await $.pointerValue<Exclude<__goscript_cipher_suites.aead, null>>(c).Open($.goSlice(payload, undefined, 0), nonce, payload, additionalData)
							plaintext = __goscriptTuple46[0]
							err = __goscriptTuple46[1]
							if (err != null) {
								return [null, $.uint(0, 8), $.namedValueInterfaceValue<$.GoError>(20, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
							}
						}
						break
					case $.typeAssert<cbcMode | null>(__goscriptTypeSwitchValue, "tls.cbcMode").ok:
						{
							let c: cbcMode | null = $.typeAssert<cbcMode | null>(__goscriptTypeSwitchValue, "tls.cbcMode").value
							let blockSize = await $.pointerValue<Exclude<cbcMode, null>>(c).BlockSize()
							let minPayload = explicitNonceLen + roundUp(await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<halfConn>(hc).mac).Size() + 1, blockSize)
							if ((($.len(payload) % blockSize) != 0) || ($.len(payload) < minPayload)) {
								return [null, $.uint(0, 8), $.namedValueInterfaceValue<$.GoError>(20, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
							}

							if (explicitNonceLen > 0) {
								await $.pointerValue<Exclude<cbcMode, null>>(c).SetIV($.goSlice(payload, undefined, explicitNonceLen))
								payload = $.goSlice(payload, explicitNonceLen, undefined)
							}
							await $.pointerValue<Exclude<cbcMode, null>>(c).CryptBlocks(payload, payload)

							// In a limited attempt to protect against CBC padding oracles like
							// Lucky13, the data past paddingLen (which is secret) is passed to
							// the MAC function as extra data, to be fed into the HMAC after
							// computing the digest. This makes the MAC roughly constant time as
							// long as the digest computation is constant time and does not
							// affect the subsequent write, modulo cache effects.
							let __goscriptTuple47: any = extractPadding(payload)
							paddingLen = __goscriptTuple47[0]
							paddingGood = $.uint(__goscriptTuple47[1], 8)
						}
						break
					default:
						{
							let c: any = __goscriptTypeSwitchValue
							$.panic("unknown cipher type")
						}
						break
				}
			}

			if ($.uint($.pointerValue<halfConn>(hc).version, 16) == $.uint(772, 16)) {
				if ($.uint(typ, 8) != $.uint(23, 8)) {
					return [null, $.uint(0, 8), $.namedValueInterfaceValue<$.GoError>(10, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
				}
				if ($.len(plaintext) > (16384 + 1)) {
					return [null, $.uint(0, 8), $.namedValueInterfaceValue<$.GoError>(22, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
				}
				// Remove padding and find the ContentType scanning from the end.
				for (let i = $.len(plaintext) - 1; i >= 0; i--) {
					if ($.uint($.arrayIndex(plaintext!, i), 8) != $.uint(0, 8)) {
						typ = $.uint($.uint($.arrayIndex(plaintext!, i), 8), 8)
						plaintext = $.goSlice(plaintext, undefined, i)
						break
					}
					if (i == 0) {
						return [null, $.uint(0, 8), $.namedValueInterfaceValue<$.GoError>(10, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
					}
				}
			}
		} else {
			plaintext = payload
		}

		if ($.pointerValue<halfConn>(hc).mac != null) {
			let macSize = await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<halfConn>(hc).mac).Size()
			if ($.len(payload) < macSize) {
				return [null, $.uint(0, 8), $.namedValueInterfaceValue<$.GoError>(20, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
			}

			let n = ($.len(payload) - macSize) - paddingLen
			n = subtle.ConstantTimeSelect($.int($.uintShr($.uint(n, 32), 31, 32)), 0, n)
			record![3] = $.uint($.uint(n >> 8, 8), 8)
			record![4] = $.uint($.uint(n, 8), 8)
			let remoteMAC: $.Slice<number> = $.goSlice(payload, n, n + macSize)
			let localMAC: $.Slice<number> = await __goscript_cipher_suites.tls10MAC($.pointerValue<halfConn>(hc).mac, $.goSlice($.pointerValue<halfConn>(hc).scratchBuf, undefined, 0), $.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined), $.goSlice(record, undefined, 5), $.goSlice(payload, undefined, n), $.goSlice(payload, n + macSize, undefined))

			// This is equivalent to checking the MACs and paddingGood
			// separately, but in constant-time to prevent distinguishing
			// padding failures from MAC failures. Depending on what value
			// of paddingLen was returned on bad padding, distinguishing
			// bad MAC from bad padding can lead to an attack.
			//
			// See also the logic at the end of extractPadding.
			let macAndPaddingGood = subtle.ConstantTimeCompare(localMAC, remoteMAC) & $.int(paddingGood)
			if (macAndPaddingGood != 1) {
				return [null, $.uint(0, 8), $.namedValueInterfaceValue<$.GoError>(20, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
			}

			plaintext = $.goSlice(payload, undefined, n)
		}

		halfConn.prototype.incSeq.call(hc)
		return [plaintext, $.uint(typ, 8), null]
	}

	public async encrypt(record: $.Slice<number>, payload: $.Slice<number>, rand: io.Reader | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const hc: halfConn | $.VarRef<halfConn> | null = this
		if ($.pointerValue<halfConn>(hc).cipher == null) {
			return [$.appendSlice(record, payload, $.byteSliceHint), null]
		}

		let explicitNonce: $.Slice<number> = null as $.Slice<number>
		{
			let explicitNonceLen = await halfConn.prototype.explicitNonceLen.call(hc)
			if (explicitNonceLen > 0) {
				let __goscriptTuple48: any = sliceForAppend(record, explicitNonceLen)
				record = __goscriptTuple48[0]
				explicitNonce = __goscriptTuple48[1]
				{
					let [, isCBC] = $.typeAssertTuple<cbcMode | null>($.pointerValue<halfConn>(hc).cipher, "tls.cbcMode")
					if (!isCBC && (explicitNonceLen < 16)) {
						// The AES-GCM construction in TLS has an explicit nonce so that the
						// nonce can be random. However, the nonce is only 8 bytes which is
						// too small for a secure, random nonce. Therefore we use the
						// sequence number as the nonce. The 3DES-CBC construction also has
						// an 8 bytes nonce but its nonces must be unpredictable (see RFC
						// 5246, Appendix F.3), forcing us to use randomness. That's not
						// 3DES' biggest problem anyway because the birthday bound on block
						// collision is reached first due to its similarly small block size
						// (see the Sweet32 attack).
						$.copy(explicitNonce, $.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined))
					} else {
						{
							let [, err] = await io.ReadFull($.pointerValueOrNil(rand)!, explicitNonce)
							if (err != null) {
								return [null, err]
							}
						}
					}
				}
			}
		}

		let dst: $.Slice<number> = null as $.Slice<number>
		{
			const __goscriptTypeSwitchValue = $.pointerValue<halfConn>(hc).cipher
			switch (true) {
				case $.typeAssert<cipher2.Stream | null>(__goscriptTypeSwitchValue, "cipher.Stream").ok:
					{
						let c: cipher2.Stream | null = $.typeAssert<cipher2.Stream | null>(__goscriptTypeSwitchValue, "cipher.Stream").value
						let mac: $.Slice<number> = await __goscript_cipher_suites.tls10MAC($.pointerValue<halfConn>(hc).mac, $.goSlice($.pointerValue<halfConn>(hc).scratchBuf, undefined, 0), $.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined), $.goSlice(record, undefined, 5), payload, null)
						let __goscriptTuple49: any = sliceForAppend(record, $.len(payload) + $.len(mac))
						record = __goscriptTuple49[0]
						dst = __goscriptTuple49[1]
						await $.pointerValue<Exclude<cipher2.Stream, null>>(c).XORKeyStream($.goSlice(dst, undefined, $.len(payload)), payload)
						await $.pointerValue<Exclude<cipher2.Stream, null>>(c).XORKeyStream($.goSlice(dst, $.len(payload), undefined), mac)
					}
					break
				case $.typeAssert<__goscript_cipher_suites.aead | null>(__goscriptTypeSwitchValue, "tls.aead").ok:
					{
						let c: __goscript_cipher_suites.aead | null = $.typeAssert<__goscript_cipher_suites.aead | null>(__goscriptTypeSwitchValue, "tls.aead").value
						let nonce: $.Slice<number> = explicitNonce
						if ($.len(nonce) == 0) {
							nonce = $.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined)
						}

						if ($.uint($.pointerValue<halfConn>(hc).version, 16) == $.uint(772, 16)) {
							record = $.appendSlice(record, payload, $.byteSliceHint)

							// Encrypt the actual ContentType and replace the plaintext one.
							record = $.append(record, $.uint($.arrayIndex(record!, 0), 8), $.byteSliceHint)
							record![0] = $.uint($.uint(23, 8), 8)

							let n = ($.len(payload) + 1) + await $.pointerValue<Exclude<__goscript_cipher_suites.aead, null>>(c).Overhead()
							record![3] = $.uint($.uint(n >> 8, 8), 8)
							record![4] = $.uint($.uint(n, 8), 8)

							record = await $.pointerValue<Exclude<__goscript_cipher_suites.aead, null>>(c).Seal($.goSlice(record, undefined, 5), nonce, $.goSlice(record, 5, undefined), $.goSlice(record, undefined, 5))
						} else {
							let additionalData: $.Slice<number> = $.appendSlice($.goSlice($.pointerValue<halfConn>(hc).scratchBuf, undefined, 0), $.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined), $.byteSliceHint)
							additionalData = $.appendSlice(additionalData, $.goSlice(record, undefined, 5), $.byteSliceHint)
							record = await $.pointerValue<Exclude<__goscript_cipher_suites.aead, null>>(c).Seal(record, nonce, payload, additionalData)
						}
					}
					break
				case $.typeAssert<cbcMode | null>(__goscriptTypeSwitchValue, "tls.cbcMode").ok:
					{
						let c: cbcMode | null = $.typeAssert<cbcMode | null>(__goscriptTypeSwitchValue, "tls.cbcMode").value
						let mac: $.Slice<number> = await __goscript_cipher_suites.tls10MAC($.pointerValue<halfConn>(hc).mac, $.goSlice($.pointerValue<halfConn>(hc).scratchBuf, undefined, 0), $.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined), $.goSlice(record, undefined, 5), payload, null)
						let blockSize = await $.pointerValue<Exclude<cbcMode, null>>(c).BlockSize()
						let plaintextLen = $.len(payload) + $.len(mac)
						let paddingLen = blockSize - (plaintextLen % blockSize)
						let __goscriptTuple50: any = sliceForAppend(record, plaintextLen + paddingLen)
						record = __goscriptTuple50[0]
						dst = __goscriptTuple50[1]
						$.copy(dst, payload)
						$.copy($.goSlice(dst, $.len(payload), undefined), mac)
						for (let i = plaintextLen; i < $.len(dst); i++) {
							dst![i] = $.uint($.uint(paddingLen - 1, 8), 8)
						}
						if ($.len(explicitNonce) > 0) {
							await $.pointerValue<Exclude<cbcMode, null>>(c).SetIV(explicitNonce)
						}
						await $.pointerValue<Exclude<cbcMode, null>>(c).CryptBlocks(dst, dst)
					}
					break
				default:
					{
						let c: any = __goscriptTypeSwitchValue
						$.panic("unknown cipher type")
					}
					break
			}
		}

		// Update length to include nonce, MAC and any block padding needed.
		let n = $.len(record) - 5
		record![3] = $.uint($.uint(n >> 8, 8), 8)
		record![4] = $.uint($.uint(n, 8), 8)
		halfConn.prototype.incSeq.call(hc)

		return [record, null]
	}

	public async explicitNonceLen(): globalThis.Promise<number> {
		const hc: halfConn | $.VarRef<halfConn> | null = this
		if ($.pointerValue<halfConn>(hc).cipher == null) {
			return 0
		}

		{
			const __goscriptTypeSwitchValue = $.pointerValue<halfConn>(hc).cipher
			switch (true) {
				case $.typeAssert<cipher2.Stream | null>(__goscriptTypeSwitchValue, "cipher.Stream").ok:
					{
						let c: cipher2.Stream | null = $.typeAssert<cipher2.Stream | null>(__goscriptTypeSwitchValue, "cipher.Stream").value
						return 0
					}
					break
				case $.typeAssert<__goscript_cipher_suites.aead | null>(__goscriptTypeSwitchValue, "tls.aead").ok:
					{
						let c: __goscript_cipher_suites.aead | null = $.typeAssert<__goscript_cipher_suites.aead | null>(__goscriptTypeSwitchValue, "tls.aead").value
						return $.pointerValue<Exclude<__goscript_cipher_suites.aead, null>>(c).explicitNonceLen()
					}
					break
				case $.typeAssert<cbcMode | null>(__goscriptTypeSwitchValue, "tls.cbcMode").ok:
					{
						let c: cbcMode | null = $.typeAssert<cbcMode | null>(__goscriptTypeSwitchValue, "tls.cbcMode").value
						if ($.uint($.pointerValue<halfConn>(hc).version, 16) >= $.uint(770, 16)) {
							return $.pointerValue<Exclude<cbcMode, null>>(c).BlockSize()
						}
						return 0
					}
					break
				default:
					{
						let c: any = __goscriptTypeSwitchValue
						$.panic("unknown cipher type")
					}
					break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public incSeq(): void {
		let hc: halfConn | $.VarRef<halfConn> | null = this
		for (let i = 7; i >= 0; i--) {
			$.pointerValue<halfConn>(hc).seq[i]++
			if ($.uint($.arrayIndex($.pointerValue<halfConn>(hc).seq, i), 8) != $.uint(0, 8)) {
				return
			}
		}

		// Not allowed to let sequence number wrap.
		// Instead, must renegotiate before it does.
		// Not likely enough to bother.
		$.panic("TLS: sequence number wraparound")
	}

	public prepareCipherSpec(version: number, cipher: any, mac: hash.Hash | null): void {
		let hc: halfConn | $.VarRef<halfConn> | null = this
		$.pointerValue<halfConn>(hc).version = $.uint(version, 16)
		$.pointerValue<halfConn>(hc).nextCipher = cipher
		$.pointerValue<halfConn>(hc).nextMac = mac
	}

	public setErrorLocked(err: $.GoError): $.GoError {
		let hc: halfConn | $.VarRef<halfConn> | null = this
		{
			let [e, ok] = $.typeAssertTuple<net.Error | null>(err, "net.Error")
			if (ok) {
				$.pointerValue<halfConn>(hc).err = $.interfaceValue<$.GoError>(new permanentError({err: e}), "*tls.permanentError", { kind: $.TypeKind.Pointer, elemType: "tls.permanentError" })
			} else {
				$.pointerValue<halfConn>(hc).err = err
			}
		}
		return $.pointerValue<halfConn>(hc).err
	}

	public async setTrafficSecret(suite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null, level: __goscript_quic.QUICEncryptionLevel, secret: $.Slice<number>): globalThis.Promise<void> {
		let hc: halfConn | $.VarRef<halfConn> | null = this
		$.pointerValue<halfConn>(hc).trafficSecret = secret
		$.pointerValue<halfConn>(hc).level = level
		let __goscriptTuple51: any = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.trafficKey.call(suite, secret)
		let key: $.Slice<number> = __goscriptTuple51[0]
		let iv: $.Slice<number> = __goscriptTuple51[1]
		$.pointerValue<halfConn>(hc).cipher = (await $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(suite).aead!(key, iv) as any)
		$.clear($.goSlice($.pointerValue<halfConn>(hc).seq, undefined, undefined))
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
		"tls.halfConn",
		() => new halfConn(),
		[{ name: "changeCipherSpec", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "decrypt", args: [{ name: "record", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.recordType" } }, { name: "_r2", type: "error" }] }, { name: "encrypt", args: [{ name: "record", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "payload", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "rand", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "explicitNonceLen", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "incSeq", args: [], returns: [] }, { name: "prepareCipherSpec", args: [{ name: "version", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "cipher", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "mac", type: "hash.Hash" }], returns: [] }, { name: "setErrorLocked", args: [{ name: "err", type: "error" }], returns: [{ name: "_r0", type: "error" }] }, { name: "setTrafficSecret", args: [{ name: "suite", type: { kind: $.TypeKind.Pointer, elemType: "tls.cipherSuiteTLS13" } }, { name: "level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" } }, { name: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Lock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unlock", args: [], returns: [] }],
		halfConn,
		[{ name: "Mutex", key: "Mutex", type: "sync.Mutex", anonymous: true, index: [0], offset: 0, exported: true }, { name: "err", key: "err", type: "error", pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "version", key: "version", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [2], offset: 24, exported: false }, { name: "cipher", key: "cipher", type: { kind: $.TypeKind.Interface, methods: [] }, pkgPath: "crypto/tls", index: [3], offset: 32, exported: false }, { name: "mac", key: "mac", type: "hash.Hash", pkgPath: "crypto/tls", index: [4], offset: 48, exported: false }, { name: "seq", key: "seq", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 8 }, pkgPath: "crypto/tls", index: [5], offset: 64, exported: false }, { name: "scratchBuf", key: "scratchBuf", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 13 }, pkgPath: "crypto/tls", index: [6], offset: 72, exported: false }, { name: "nextCipher", key: "nextCipher", type: { kind: $.TypeKind.Interface, methods: [] }, pkgPath: "crypto/tls", index: [7], offset: 88, exported: false }, { name: "nextMac", key: "nextMac", type: "hash.Hash", pkgPath: "crypto/tls", index: [8], offset: 104, exported: false }, { name: "level", key: "level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" }, pkgPath: "crypto/tls", index: [9], offset: 120, exported: false }, { name: "trafficSecret", key: "trafficSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [10], offset: 128, exported: false }]
	)
}

export class Conn {
	// constant
	public get conn(): net.Conn | null {
		return this._fields.conn.value
	}
	public set conn(value: net.Conn | null) {
		this._fields.conn.value = value
	}

	public get isClient(): boolean {
		return this._fields.isClient.value
	}
	public set isClient(value: boolean) {
		this._fields.isClient.value = value
	}

	public get handshakeFn(): ((_p0: context2.Context | null) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.handshakeFn.value
	}
	public set handshakeFn(value: ((_p0: context2.Context | null) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.handshakeFn.value = value
	}

	public get quic(): __goscript_quic.quicState | $.VarRef<__goscript_quic.quicState> | null {
		return this._fields.quic.value
	}
	public set quic(value: __goscript_quic.quicState | $.VarRef<__goscript_quic.quicState> | null) {
		this._fields.quic.value = value
	}

	// isHandshakeComplete is true if the connection is currently transferring
	// application data (i.e. is not currently processing a handshake).
	// isHandshakeComplete is true implies handshakeErr == nil.
	public get isHandshakeComplete(): atomic.Bool {
		return this._fields.isHandshakeComplete.value
	}
	public set isHandshakeComplete(value: atomic.Bool) {
		this._fields.isHandshakeComplete.value = value
	}

	// constant after handshake; protected by handshakeMutex
	public get handshakeMutex(): sync.Mutex {
		return this._fields.handshakeMutex.value
	}
	public set handshakeMutex(value: sync.Mutex) {
		this._fields.handshakeMutex.value = value
	}

	public get handshakeErr(): $.GoError {
		return this._fields.handshakeErr.value
	}
	public set handshakeErr(value: $.GoError) {
		this._fields.handshakeErr.value = value
	}

	public get vers(): number {
		return this._fields.vers.value
	}
	public set vers(value: number) {
		this._fields.vers.value = value
	}

	public get haveVers(): boolean {
		return this._fields.haveVers.value
	}
	public set haveVers(value: boolean) {
		this._fields.haveVers.value = value
	}

	public get config(): __goscript_common.Config | $.VarRef<__goscript_common.Config> | null {
		return this._fields.config.value
	}
	public set config(value: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null) {
		this._fields.config.value = value
	}

	// handshakes counts the number of handshakes performed on the
	// connection so far. If renegotiation is disabled then this is either
	// zero or one.
	public get handshakes(): number {
		return this._fields.handshakes.value
	}
	public set handshakes(value: number) {
		this._fields.handshakes.value = value
	}

	public get extMasterSecret(): boolean {
		return this._fields.extMasterSecret.value
	}
	public set extMasterSecret(value: boolean) {
		this._fields.extMasterSecret.value = value
	}

	public get didResume(): boolean {
		return this._fields.didResume.value
	}
	public set didResume(value: boolean) {
		this._fields.didResume.value = value
	}

	public get didHRR(): boolean {
		return this._fields.didHRR.value
	}
	public set didHRR(value: boolean) {
		this._fields.didHRR.value = value
	}

	public get cipherSuite(): number {
		return this._fields.cipherSuite.value
	}
	public set cipherSuite(value: number) {
		this._fields.cipherSuite.value = value
	}

	public get curveID(): __goscript_common.CurveID {
		return this._fields.curveID.value
	}
	public set curveID(value: __goscript_common.CurveID) {
		this._fields.curveID.value = value
	}

	public get peerSigAlg(): __goscript_common.SignatureScheme {
		return this._fields.peerSigAlg.value
	}
	public set peerSigAlg(value: __goscript_common.SignatureScheme) {
		this._fields.peerSigAlg.value = value
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

	public get peerCertificates(): $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null> {
		return this._fields.peerCertificates.value
	}
	public set peerCertificates(value: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>) {
		this._fields.peerCertificates.value = value
	}

	// verifiedChains contains the certificate chains that we built, as
	// opposed to the ones presented by the server.
	public get verifiedChains(): $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>> {
		return this._fields.verifiedChains.value
	}
	public set verifiedChains(value: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>) {
		this._fields.verifiedChains.value = value
	}

	// serverName contains the server name indicated by the client, if any.
	public get serverName(): string {
		return this._fields.serverName.value
	}
	public set serverName(value: string) {
		this._fields.serverName.value = value
	}

	// secureRenegotiation is true if the server echoed the secure
	// renegotiation extension. (This is meaningless as a server because
	// renegotiation is not supported in that case.)
	public get secureRenegotiation(): boolean {
		return this._fields.secureRenegotiation.value
	}
	public set secureRenegotiation(value: boolean) {
		this._fields.secureRenegotiation.value = value
	}

	// ekm is a closure for exporting keying material.
	public get ekm(): ((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null {
		return this._fields.ekm.value
	}
	public set ekm(value: ((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null) {
		this._fields.ekm.value = value
	}

	// resumptionSecret is the resumption_master_secret for handling
	// or sending NewSessionTicket messages.
	public get resumptionSecret(): $.Slice<number> {
		return this._fields.resumptionSecret.value
	}
	public set resumptionSecret(value: $.Slice<number>) {
		this._fields.resumptionSecret.value = value
	}

	public get echAccepted(): boolean {
		return this._fields.echAccepted.value
	}
	public set echAccepted(value: boolean) {
		this._fields.echAccepted.value = value
	}

	// ticketKeys is the set of active session ticket keys for this
	// connection. The first one is used to encrypt new tickets and
	// all are tried to decrypt tickets.
	public get ticketKeys(): $.Slice<__goscript_common.ticketKey> {
		return this._fields.ticketKeys.value
	}
	public set ticketKeys(value: $.Slice<__goscript_common.ticketKey>) {
		this._fields.ticketKeys.value = value
	}

	// clientFinishedIsFirst is true if the client sent the first Finished
	// message during the most recent handshake. This is recorded because
	// the first transmitted Finished message is the tls-unique
	// channel-binding value.
	public get clientFinishedIsFirst(): boolean {
		return this._fields.clientFinishedIsFirst.value
	}
	public set clientFinishedIsFirst(value: boolean) {
		this._fields.clientFinishedIsFirst.value = value
	}

	// closeNotifyErr is any error from sending the alertCloseNotify record.
	public get closeNotifyErr(): $.GoError {
		return this._fields.closeNotifyErr.value
	}
	public set closeNotifyErr(value: $.GoError) {
		this._fields.closeNotifyErr.value = value
	}

	// closeNotifySent is true if the Conn attempted to send an
	// alertCloseNotify record.
	public get closeNotifySent(): boolean {
		return this._fields.closeNotifySent.value
	}
	public set closeNotifySent(value: boolean) {
		this._fields.closeNotifySent.value = value
	}

	// clientFinished and serverFinished contain the Finished message sent
	// by the client or server in the most recent handshake. This is
	// retained to support the renegotiation extension and tls-unique
	// channel-binding.
	public get clientFinished(): Uint8Array {
		return this._fields.clientFinished.value
	}
	public set clientFinished(value: Uint8Array) {
		this._fields.clientFinished.value = value
	}

	public get serverFinished(): Uint8Array {
		return this._fields.serverFinished.value
	}
	public set serverFinished(value: Uint8Array) {
		this._fields.serverFinished.value = value
	}

	// clientProtocol is the negotiated ALPN protocol.
	public get clientProtocol(): string {
		return this._fields.clientProtocol.value
	}
	public set clientProtocol(value: string) {
		this._fields.clientProtocol.value = value
	}

	// input/output
	public get _in(): halfConn {
		return this._fields._in.value
	}
	public set _in(value: halfConn) {
		this._fields._in.value = value
	}

	// input/output
	public get out(): halfConn {
		return this._fields.out.value
	}
	public set out(value: halfConn) {
		this._fields.out.value = value
	}

	public get rawInput(): bytes.Buffer {
		return this._fields.rawInput.value
	}
	public set rawInput(value: bytes.Buffer) {
		this._fields.rawInput.value = value
	}

	public get input(): bytes.Reader {
		return this._fields.input.value
	}
	public set input(value: bytes.Reader) {
		this._fields.input.value = value
	}

	public get hand(): bytes.Buffer {
		return this._fields.hand.value
	}
	public set hand(value: bytes.Buffer) {
		this._fields.hand.value = value
	}

	public get buffering(): boolean {
		return this._fields.buffering.value
	}
	public set buffering(value: boolean) {
		this._fields.buffering.value = value
	}

	public get sendBuf(): $.Slice<number> {
		return this._fields.sendBuf.value
	}
	public set sendBuf(value: $.Slice<number>) {
		this._fields.sendBuf.value = value
	}

	// bytesSent counts the bytes of application data sent.
	// packetsSent counts packets.
	public get bytesSent(): bigint {
		return this._fields.bytesSent.value
	}
	public set bytesSent(value: bigint) {
		this._fields.bytesSent.value = value
	}

	public get packetsSent(): bigint {
		return this._fields.packetsSent.value
	}
	public set packetsSent(value: bigint) {
		this._fields.packetsSent.value = value
	}

	// retryCount counts the number of consecutive non-advancing records
	// received by Conn.readRecord. That is, records that neither advance the
	// handshake, nor deliver application data. Protected by in.Mutex.
	public get retryCount(): number {
		return this._fields.retryCount.value
	}
	public set retryCount(value: number) {
		this._fields.retryCount.value = value
	}

	// activeCall indicates whether Close has been call in the low bit.
	// the rest of the bits are the number of goroutines in Conn.Write.
	public get activeCall(): atomic.Int32 {
		return this._fields.activeCall.value
	}
	public set activeCall(value: atomic.Int32) {
		this._fields.activeCall.value = value
	}

	public get tmp(): Uint8Array {
		return this._fields.tmp.value
	}
	public set tmp(value: Uint8Array) {
		this._fields.tmp.value = value
	}

	public _fields: {
		conn: $.VarRef<net.Conn | null>
		isClient: $.VarRef<boolean>
		handshakeFn: $.VarRef<((_p0: context2.Context | null) => $.GoError | globalThis.Promise<$.GoError>) | null>
		quic: $.VarRef<__goscript_quic.quicState | $.VarRef<__goscript_quic.quicState> | null>
		isHandshakeComplete: $.VarRef<atomic.Bool>
		handshakeMutex: $.VarRef<sync.Mutex>
		handshakeErr: $.VarRef<$.GoError>
		vers: $.VarRef<number>
		haveVers: $.VarRef<boolean>
		config: $.VarRef<__goscript_common.Config | $.VarRef<__goscript_common.Config> | null>
		handshakes: $.VarRef<number>
		extMasterSecret: $.VarRef<boolean>
		didResume: $.VarRef<boolean>
		didHRR: $.VarRef<boolean>
		cipherSuite: $.VarRef<number>
		curveID: $.VarRef<__goscript_common.CurveID>
		peerSigAlg: $.VarRef<__goscript_common.SignatureScheme>
		ocspResponse: $.VarRef<$.Slice<number>>
		scts: $.VarRef<$.Slice<$.Slice<number>>>
		peerCertificates: $.VarRef<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>
		verifiedChains: $.VarRef<$.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>>
		serverName: $.VarRef<string>
		secureRenegotiation: $.VarRef<boolean>
		ekm: $.VarRef<((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null>
		resumptionSecret: $.VarRef<$.Slice<number>>
		echAccepted: $.VarRef<boolean>
		ticketKeys: $.VarRef<$.Slice<__goscript_common.ticketKey>>
		clientFinishedIsFirst: $.VarRef<boolean>
		closeNotifyErr: $.VarRef<$.GoError>
		closeNotifySent: $.VarRef<boolean>
		clientFinished: $.VarRef<Uint8Array>
		serverFinished: $.VarRef<Uint8Array>
		clientProtocol: $.VarRef<string>
		_in: $.VarRef<halfConn>
		out: $.VarRef<halfConn>
		rawInput: $.VarRef<bytes.Buffer>
		input: $.VarRef<bytes.Reader>
		hand: $.VarRef<bytes.Buffer>
		buffering: $.VarRef<boolean>
		sendBuf: $.VarRef<$.Slice<number>>
		bytesSent: $.VarRef<bigint>
		packetsSent: $.VarRef<bigint>
		retryCount: $.VarRef<number>
		activeCall: $.VarRef<atomic.Int32>
		tmp: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{conn?: net.Conn | null, isClient?: boolean, handshakeFn?: ((_p0: context2.Context | null) => $.GoError | globalThis.Promise<$.GoError>) | null, quic?: __goscript_quic.quicState | $.VarRef<__goscript_quic.quicState> | null, isHandshakeComplete?: atomic.Bool, handshakeMutex?: sync.Mutex, handshakeErr?: $.GoError, vers?: number, haveVers?: boolean, config?: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null, handshakes?: number, extMasterSecret?: boolean, didResume?: boolean, didHRR?: boolean, cipherSuite?: number, curveID?: __goscript_common.CurveID, peerSigAlg?: __goscript_common.SignatureScheme, ocspResponse?: $.Slice<number>, scts?: $.Slice<$.Slice<number>>, peerCertificates?: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>, verifiedChains?: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>, serverName?: string, secureRenegotiation?: boolean, ekm?: ((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null, resumptionSecret?: $.Slice<number>, echAccepted?: boolean, ticketKeys?: $.Slice<__goscript_common.ticketKey>, clientFinishedIsFirst?: boolean, closeNotifyErr?: $.GoError, closeNotifySent?: boolean, clientFinished?: Uint8Array, serverFinished?: Uint8Array, clientProtocol?: string, _in?: halfConn, out?: halfConn, rawInput?: bytes.Buffer, input?: bytes.Reader, hand?: bytes.Buffer, buffering?: boolean, sendBuf?: $.Slice<number>, bytesSent?: bigint, packetsSent?: bigint, retryCount?: number, activeCall?: atomic.Int32, tmp?: Uint8Array}>) {
		this._fields = {
			conn: $.varRef(init?.conn ?? (null as net.Conn | null)),
			isClient: $.varRef(init?.isClient ?? (false as boolean)),
			handshakeFn: $.varRef(init?.handshakeFn ?? (null as ((_p0: context2.Context | null) => $.GoError | globalThis.Promise<$.GoError>) | null)),
			quic: $.varRef(init?.quic ?? (null as __goscript_quic.quicState | $.VarRef<__goscript_quic.quicState> | null)),
			isHandshakeComplete: $.varRef(init?.isHandshakeComplete ? $.markAsStructValue($.cloneStructValue(init.isHandshakeComplete)) : $.markAsStructValue(new atomic.Bool())),
			handshakeMutex: $.varRef(init?.handshakeMutex ? $.markAsStructValue($.cloneStructValue(init.handshakeMutex)) : $.markAsStructValue(new sync.Mutex())),
			handshakeErr: $.varRef(init?.handshakeErr ?? (null as $.GoError)),
			vers: $.varRef(init?.vers ?? (0 as number)),
			haveVers: $.varRef(init?.haveVers ?? (false as boolean)),
			config: $.varRef(init?.config ?? (null as __goscript_common.Config | $.VarRef<__goscript_common.Config> | null)),
			handshakes: $.varRef(init?.handshakes ?? (0 as number)),
			extMasterSecret: $.varRef(init?.extMasterSecret ?? (false as boolean)),
			didResume: $.varRef(init?.didResume ?? (false as boolean)),
			didHRR: $.varRef(init?.didHRR ?? (false as boolean)),
			cipherSuite: $.varRef(init?.cipherSuite ?? (0 as number)),
			curveID: $.varRef(init?.curveID ?? (0 as __goscript_common.CurveID)),
			peerSigAlg: $.varRef(init?.peerSigAlg ?? (0 as __goscript_common.SignatureScheme)),
			ocspResponse: $.varRef(init?.ocspResponse ?? (null as $.Slice<number>)),
			scts: $.varRef(init?.scts ?? (null as $.Slice<$.Slice<number>>)),
			peerCertificates: $.varRef(init?.peerCertificates ?? (null as $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>)),
			verifiedChains: $.varRef(init?.verifiedChains ?? (null as $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>>)),
			serverName: $.varRef(init?.serverName ?? ("" as string)),
			secureRenegotiation: $.varRef(init?.secureRenegotiation ?? (false as boolean)),
			ekm: $.varRef(init?.ekm ?? (null as ((label: string, context: $.Slice<number>, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null)),
			resumptionSecret: $.varRef(init?.resumptionSecret ?? (null as $.Slice<number>)),
			echAccepted: $.varRef(init?.echAccepted ?? (false as boolean)),
			ticketKeys: $.varRef(init?.ticketKeys ?? (null as $.Slice<__goscript_common.ticketKey>)),
			clientFinishedIsFirst: $.varRef(init?.clientFinishedIsFirst ?? (false as boolean)),
			closeNotifyErr: $.varRef(init?.closeNotifyErr ?? (null as $.GoError)),
			closeNotifySent: $.varRef(init?.closeNotifySent ?? (false as boolean)),
			clientFinished: $.varRef(init?.clientFinished !== undefined ? $.cloneArrayValue(init.clientFinished) : new Uint8Array(12)),
			serverFinished: $.varRef(init?.serverFinished !== undefined ? $.cloneArrayValue(init.serverFinished) : new Uint8Array(12)),
			clientProtocol: $.varRef(init?.clientProtocol ?? ("" as string)),
			_in: $.varRef(init?._in ? $.markAsStructValue($.cloneStructValue(init._in)) : $.markAsStructValue(new halfConn())),
			out: $.varRef(init?.out ? $.markAsStructValue($.cloneStructValue(init.out)) : $.markAsStructValue(new halfConn())),
			rawInput: $.varRef(init?.rawInput ? $.markAsStructValue($.cloneStructValue(init.rawInput)) : $.markAsStructValue(new bytes.Buffer())),
			input: $.varRef(init?.input ? $.markAsStructValue($.cloneStructValue(init.input)) : $.markAsStructValue(new bytes.Reader())),
			hand: $.varRef(init?.hand ? $.markAsStructValue($.cloneStructValue(init.hand)) : $.markAsStructValue(new bytes.Buffer())),
			buffering: $.varRef(init?.buffering ?? (false as boolean)),
			sendBuf: $.varRef(init?.sendBuf ?? (null as $.Slice<number>)),
			bytesSent: $.varRef(init?.bytesSent ?? (0n as bigint)),
			packetsSent: $.varRef(init?.packetsSent ?? (0n as bigint)),
			retryCount: $.varRef(init?.retryCount ?? (0 as number)),
			activeCall: $.varRef(init?.activeCall ? $.markAsStructValue($.cloneStructValue(init.activeCall)) : $.markAsStructValue(new atomic.Int32())),
			tmp: $.varRef(init?.tmp !== undefined ? $.cloneArrayValue(init.tmp) : new Uint8Array(16))
		}
	}

	public clone(): Conn {
		const cloned = new Conn()
		cloned._fields = {
			conn: $.varRef(this._fields.conn.value),
			isClient: $.varRef(this._fields.isClient.value),
			handshakeFn: $.varRef(this._fields.handshakeFn.value),
			quic: $.varRef(this._fields.quic.value),
			isHandshakeComplete: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.isHandshakeComplete.value))),
			handshakeMutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.handshakeMutex.value))),
			handshakeErr: $.varRef(this._fields.handshakeErr.value),
			vers: $.varRef(this._fields.vers.value),
			haveVers: $.varRef(this._fields.haveVers.value),
			config: $.varRef(this._fields.config.value),
			handshakes: $.varRef(this._fields.handshakes.value),
			extMasterSecret: $.varRef(this._fields.extMasterSecret.value),
			didResume: $.varRef(this._fields.didResume.value),
			didHRR: $.varRef(this._fields.didHRR.value),
			cipherSuite: $.varRef(this._fields.cipherSuite.value),
			curveID: $.varRef(this._fields.curveID.value),
			peerSigAlg: $.varRef(this._fields.peerSigAlg.value),
			ocspResponse: $.varRef(this._fields.ocspResponse.value),
			scts: $.varRef(this._fields.scts.value),
			peerCertificates: $.varRef(this._fields.peerCertificates.value),
			verifiedChains: $.varRef(this._fields.verifiedChains.value),
			serverName: $.varRef(this._fields.serverName.value),
			secureRenegotiation: $.varRef(this._fields.secureRenegotiation.value),
			ekm: $.varRef(this._fields.ekm.value),
			resumptionSecret: $.varRef(this._fields.resumptionSecret.value),
			echAccepted: $.varRef(this._fields.echAccepted.value),
			ticketKeys: $.varRef(this._fields.ticketKeys.value),
			clientFinishedIsFirst: $.varRef(this._fields.clientFinishedIsFirst.value),
			closeNotifyErr: $.varRef(this._fields.closeNotifyErr.value),
			closeNotifySent: $.varRef(this._fields.closeNotifySent.value),
			clientFinished: $.varRef($.cloneArrayValue(this._fields.clientFinished.value)),
			serverFinished: $.varRef($.cloneArrayValue(this._fields.serverFinished.value)),
			clientProtocol: $.varRef(this._fields.clientProtocol.value),
			_in: $.varRef($.markAsStructValue($.cloneStructValue(this._fields._in.value))),
			out: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.out.value))),
			rawInput: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.rawInput.value))),
			input: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.input.value))),
			hand: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.hand.value))),
			buffering: $.varRef(this._fields.buffering.value),
			sendBuf: $.varRef(this._fields.sendBuf.value),
			bytesSent: $.varRef(this._fields.bytesSent.value),
			packetsSent: $.varRef(this._fields.packetsSent.value),
			retryCount: $.varRef(this._fields.retryCount.value),
			activeCall: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.activeCall.value))),
			tmp: $.varRef($.cloneArrayValue(this._fields.tmp.value))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		// Interlock with Conn.Write above.
		let x: number = 0
		while (true) {
			x = $.int($.pointerValue<Conn>(c).activeCall.Load(), 32)
			if ($.int((x & 1), 32) != $.int(0, 32)) {
				return net.ErrClosed
			}
			if ($.pointerValue<Conn>(c).activeCall.CompareAndSwap($.int(x, 32), $.int(x | 1, 32))) {
				break
			}
		}
		if ($.int(x, 32) != $.int(0, 32)) {
			// io.Writer and io.Closer should not be used concurrently.
			// If Close is called while a Write is currently in-flight,
			// interpret that as a sign that this Close is really just
			// being used to break the Write and/or clean up resources and
			// avoid sending the alertCloseNotify, which may block
			// waiting on handshakeMutex or the c.out mutex.
			return $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).Close()
		}

		let alertErr: $.GoError = null as $.GoError
		if ($.pointerValue<Conn>(c).isHandshakeComplete.Load()) {
			{
				let err = await Conn.prototype.closeNotify.call(c)
				if (err != null) {
					alertErr = fmt.Errorf("tls: failed to send closeNotify alert (but connection was closed anyway): %w", (err as any))
				}
			}
		}

		{
			let err = await $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).Close()
			if (err != null) {
				return err
			}
		}
		return alertErr
	}

	public async CloseWrite(): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		if (!$.pointerValue<Conn>(c).isHandshakeComplete.Load()) {
			return errEarlyCloseWrite
		}

		return Conn.prototype.closeNotify.call(c)
	}

	public async ConnectionState(): globalThis.Promise<__goscript_common.ConnectionState> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Conn>(c).handshakeMutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).handshakeMutex.Unlock() })
		return $.markAsStructValue($.cloneStructValue(Conn.prototype.connectionStateLocked.call(c)))
	}

	public async Handshake(): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		return Conn.prototype.HandshakeContext.call(c, context2.Background())
	}

	public async HandshakeContext(ctx: context2.Context | null): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		// Delegate to unexported method for named return
		// without confusing documented signature.
		return Conn.prototype.handshakeContext.call(c, ctx)
	}

	public async LocalAddr(): globalThis.Promise<net.Addr | null> {
		const c: Conn | $.VarRef<Conn> | null = this
		return $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).LocalAddr()
	}

	public NetConn(): net.Conn | null {
		const c: Conn | $.VarRef<Conn> | null = this
		return $.pointerValue<Conn>(c).conn
	}

	public async OCSPResponse(): globalThis.Promise<$.Slice<number>> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Conn>(c).handshakeMutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).handshakeMutex.Unlock() })

		return $.pointerValue<Conn>(c).ocspResponse
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		{
			let err = await Conn.prototype.Handshake.call(c)
			if (err != null) {
				return [0, err]
			}
		}
		if ($.len(b) == 0) {
			// Put this after Handshake, in case people were calling
			// Read(nil) for the side effect of the Handshake.
			return [0, null]
		}

		await $.pointerValue<Conn>(c)._in.Mutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c)._in.Mutex.Unlock() })

		while ($.pointerValue<Conn>(c).input.Len() == 0) {
			{
				let err = await Conn.prototype.readRecord.call(c)
				if (err != null) {
					return [0, err]
				}
			}
			while ($.pointerValue<Conn>(c).hand.Len() > 0) {
				{
					let err = await Conn.prototype.handlePostHandshakeMessage.call(c)
					if (err != null) {
						return [0, err]
					}
				}
			}
		}

		let [n, ] = $.pointerValue<Conn>(c).input.Read(b)

		// If a close-notify alert is waiting, read it so that we can return (n,
		// EOF) instead of (n, nil), to signal to the HTTP response reading
		// goroutine that the connection is now closed. This eliminates a race
		// where the HTTP response reading goroutine would otherwise not observe
		// the EOF until its next read, by which time a client goroutine might
		// have already tried to reuse the HTTP connection for a new request.
		// See https://golang.org/cl/76400046 and https://golang.org/issue/3514
		if ((((n != 0) && ($.pointerValue<Conn>(c).input.Len() == 0)) && ($.pointerValue<Conn>(c).rawInput.Len() > 0)) && ($.uint($.uint($.arrayIndex($.pointerValue<Conn>(c).rawInput.Bytes()!, 0), 8), 8) == $.uint(21, 8))) {
			{
				let err = await Conn.prototype.readRecord.call(c)
				if (err != null) {
					return [n, err]
				}
			}
		}

		return [n, null]
	}

	public async RemoteAddr(): globalThis.Promise<net.Addr | null> {
		const c: Conn | $.VarRef<Conn> | null = this
		return $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).RemoteAddr()
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		return $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).SetDeadline($.markAsStructValue($.cloneStructValue(t)))
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		return $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).SetReadDeadline($.markAsStructValue($.cloneStructValue(t)))
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		return $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).SetWriteDeadline($.markAsStructValue($.cloneStructValue(t)))
	}

	public async VerifyHostname(host: string): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Conn>(c).handshakeMutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).handshakeMutex.Unlock() })
		if (!$.pointerValue<Conn>(c).isClient) {
			return errors.New("tls: VerifyHostname called on TLS server connection")
		}
		if (!$.pointerValue<Conn>(c).isHandshakeComplete.Load()) {
			return errors.New("tls: handshake has not yet been performed")
		}
		if ($.len($.pointerValue<Conn>(c).verifiedChains) == 0) {
			return errors.New("tls: handshake did not verify certificate chain")
		}
		return x509.Certificate.prototype.VerifyHostname.call($.arrayIndex($.pointerValue<Conn>(c).peerCertificates!, 0), host)
	}

	public async Write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		// interlock with Close below
		while (true) {
			let x = $.int($.pointerValue<Conn>(c).activeCall.Load(), 32)
			if ($.int((x & 1), 32) != $.int(0, 32)) {
				return [0, net.ErrClosed]
			}
			if ($.pointerValue<Conn>(c).activeCall.CompareAndSwap($.int(x, 32), $.int(x + 2, 32))) {
				break
			}
		}
		__defer.defer(() => { $.pointerValue<Conn>(c).activeCall.Add($.int(-2, 32)) })

		{
			let err = await Conn.prototype.Handshake.call(c)
			if (err != null) {
				return [0, err]
			}
		}

		await $.pointerValue<Conn>(c).out.Mutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).out.Mutex.Unlock() })

		{
			let err = $.pointerValue<Conn>(c).out.err
			if (err != null) {
				return [0, err]
			}
		}

		if (!$.pointerValue<Conn>(c).isHandshakeComplete.Load()) {
			return [0, $.namedValueInterfaceValue<$.GoError>(80, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })]
		}

		if ($.pointerValue<Conn>(c).closeNotifySent) {
			return [0, errShutdown]
		}

		// TLS 1.0 is susceptible to a chosen-plaintext
		// attack when using block mode ciphers due to predictable IVs.
		// This can be prevented by splitting each Application Data
		// record into two records, effectively randomizing the IV.
		//
		// https://www.openssl.org/~bodo/tls-cbc.txt
		// https://bugzilla.mozilla.org/show_bug.cgi?id=665814
		// https://www.imperialviolet.org/2012/01/15/beastfollowup.html

		let m: number = 0
		if (($.len(b) > 1) && ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(769, 16))) {
			{
				let [, ok] = $.typeAssertTuple<cipher2.BlockMode | null>($.pointerValue<Conn>(c).out.cipher, "cipher.BlockMode")
				if (ok) {
					let [n, err] = await Conn.prototype.writeRecordLocked.call(c, $.uint(23, 8), $.goSlice(b, undefined, 1))
					if (err != null) {
						return [n, $.pointerValue<Conn>(c).out.setErrorLocked(err)]
					}
					let __goscriptAssign0_0: number = 1
					let __goscriptAssign0_1: $.Slice<number> = $.goSlice(b, 1, undefined)
					m = __goscriptAssign0_0
					b = __goscriptAssign0_1
				}
			}
		}

		let [n, err] = await Conn.prototype.writeRecordLocked.call(c, $.uint(23, 8), b)
		return [n + m, $.pointerValue<Conn>(c).out.setErrorLocked(err)]
	}

	public async clientHandshake(ctx: context2.Context | null): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		if ($.pointerValue<Conn>(c).config == null) {
			$.pointerValue<Conn>(c).config = __goscript_common.defaultConfig()
		}

		$.pointerValue<Conn>(c).didResume = false
		$.pointerValue<Conn>(c).curveID = $.uint(0, 16)

		let __goscriptTuple0: any = await Conn.prototype.makeClientHello.call(c)
		let hello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = __goscriptTuple0[0]
		let keyShareKeys: __goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null = __goscriptTuple0[1]
		let ech: __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null = __goscriptTuple0[2]
		err = __goscriptTuple0[3]
		if (err != null) {
			return err
		}

		let __goscriptTuple1: any = await Conn.prototype.loadSession.call(c, hello)
		let session: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = __goscriptTuple1[0]
		let earlySecret: tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null = __goscriptTuple1[1]
		let binderKey: $.Slice<number> = __goscriptTuple1[2]
		err = __goscriptTuple1[3]
		if (err != null) {
			return err
		}
		if (session != null) {
			__defer.defer(async () => { await (async (): globalThis.Promise<void> => {

				if (err != null) {
					{
						let cacheKey = await Conn.prototype.clientSessionCacheKey.call(c)
						if (!$.stringEqual(cacheKey, "")) {
							await $.pointerValue<Exclude<__goscript_common.ClientSessionCache, null>>($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientSessionCache).Put(cacheKey, null)
						}
					}
				}
			})() })
		}

		if (ech != null) {

			$.pointerValue<__goscript_handshake_client.echClientContext>(ech).innerHello = __goscript_handshake_messages.clientHelloMsg.prototype.clone.call(hello)

			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).serverName = $.bytesToString($.pointerValue<__goscript_ech.echConfig>($.pointerValue<__goscript_handshake_client.echClientContext>(ech).config).PublicName)

			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).random = $.makeSlice<number>(32, undefined, "byte")
			let __goscriptTuple2: any = await io.ReadFull($.pointerValueOrNil(__goscript_common.Config.prototype.rand.call($.pointerValue<Conn>(c).config))!, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).random)
			err = __goscriptTuple2[1]
			if (err != null) {
				const __goscriptReturn0: $.GoError = errors.New("tls: short read from Rand: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
				err = __goscriptReturn0
				await __defer.dispose()
				return err
			}

			{
				let __goscriptShadow0 = await __goscript_ech.computeAndUpdateOuterECHExtension(hello, $.pointerValue<__goscript_handshake_client.echClientContext>(ech).innerHello, ech, true)
				if (__goscriptShadow0 != null) {
					const __goscriptReturn1: $.GoError = __goscriptShadow0
					err = __goscriptReturn1
					await __defer.dispose()
					return err
				}
			}
		}

		$.pointerValue<Conn>(c).serverName = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).serverName

		{
			let [, __goscriptShadow1] = await Conn.prototype.writeHandshakeRecord.call(c, $.interfaceValue<__goscript_common.handshakeMessage | null>(hello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), null)
			if (__goscriptShadow1 != null) {
				const __goscriptReturn2: $.GoError = __goscriptShadow1
				err = __goscriptReturn2
				await __defer.dispose()
				return err
			}
		}

		if ($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).earlyData) {
			let suite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint($.pointerValue<__goscript_ticket.SessionState>(session).cipherSuite, 16))
			let transcript = await crypto.Hash_New($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(suite).hash)
			let transcriptHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = hello
			if (ech != null) {
				transcriptHello = $.pointerValue<__goscript_handshake_client.echClientContext>(ech).innerHello
			}
			{
				let __goscriptShadow2 = await __goscript_handshake_messages.transcriptMsg($.interfaceValue<__goscript_common.handshakeMessage | null>(transcriptHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), (transcript as __goscript_handshake_messages.transcriptHash | null))
				if (__goscriptShadow2 != null) {
					const __goscriptReturn3: $.GoError = __goscriptShadow2
					err = __goscriptReturn3
					await __defer.dispose()
					return err
				}
			}
			let earlyTrafficSecret: $.Slice<number> = await tls13.EarlySecret.prototype.ClientEarlyTrafficSecret.call(earlySecret, transcript)
			Conn.prototype.quicSetWriteSecret.call(c, 1, $.uint($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(suite).id, 16), earlyTrafficSecret)
		}

		// if i <= paddingLen then the MSB of t is zero
		let __goscriptTuple3: any = await Conn.prototype.readHandshake.call(c, null)
		let msg = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
		if (err != null) {
			const __goscriptReturn4: $.GoError = err
			err = __goscriptReturn4
			await __defer.dispose()
			return err
		}

		let __goscriptTuple4: any = $.typeAssertTuple<__goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" })
		let serverHello: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null = __goscriptTuple4[0]
		let ok = __goscriptTuple4[1]
		if (!ok) {
			await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			const __goscriptReturn5: $.GoError = __goscript_common.unexpectedMessageError($.interfaceValue<any>(serverHello, "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" }), msg)
			err = __goscriptReturn5
			await __defer.dispose()
			return err
		}

		{
			let __goscriptShadow3 = await Conn.prototype.pickTLSVersion.call(c, serverHello)
			if (__goscriptShadow3 != null) {
				const __goscriptReturn6: $.GoError = __goscriptShadow3
				err = __goscriptReturn6
				await __defer.dispose()
				return err
			}
		}

		let maxVers = $.uint(__goscript_common.Config.prototype.maxSupportedVersion.call($.pointerValue<Conn>(c).config, true), 16)
		let tls12Downgrade = $.stringEqual($.bytesToString($.goSlice($.pointerValue<__goscript_handshake_messages.serverHelloMsg>(serverHello).random, 24, undefined)), "DOWNGRD\x01")
		let tls11Downgrade = $.stringEqual($.bytesToString($.goSlice($.pointerValue<__goscript_handshake_messages.serverHelloMsg>(serverHello).random, 24, undefined)), "DOWNGRD\x00")
		if (((($.uint(maxVers, 16) == $.uint(772, 16)) && ($.uint($.pointerValue<Conn>(c).vers, 16) <= $.uint(771, 16))) && (tls12Downgrade || tls11Downgrade)) || ((($.uint(maxVers, 16) == $.uint(771, 16)) && ($.uint($.pointerValue<Conn>(c).vers, 16) <= $.uint(770, 16))) && tls11Downgrade)) {
			await Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			const __goscriptReturn7: $.GoError = errors.New("tls: downgrade attempt detected, possibly due to a MitM attack or a broken middlebox")
			err = __goscriptReturn7
			await __defer.dispose()
			return err
		}

		if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
			let hs: __goscript_handshake_client_tls13.clientHandshakeStateTLS13 | $.VarRef<__goscript_handshake_client_tls13.clientHandshakeStateTLS13> | null = new __goscript_handshake_client_tls13.clientHandshakeStateTLS13({c: c, ctx: ctx, serverHello: serverHello, hello: hello, keyShareKeys: keyShareKeys, session: session, earlySecret: earlySecret, binderKey: binderKey, echContext: ech})
			const __goscriptReturn8: $.GoError = await __goscript_handshake_client_tls13.clientHandshakeStateTLS13.prototype.handshake.call(hs)
			err = __goscriptReturn8
			await __defer.dispose()
			return err
		}

		let hs: __goscript_handshake_client.clientHandshakeState | $.VarRef<__goscript_handshake_client.clientHandshakeState> | null = new __goscript_handshake_client.clientHandshakeState({c: c, ctx: ctx, serverHello: serverHello, hello: hello, session: session})
		const __goscriptReturn9: $.GoError = await __goscript_handshake_client.clientHandshakeState.prototype.handshake.call(hs)
		err = __goscriptReturn9
		await __defer.dispose()
		return err
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async clientSessionCacheKey(): globalThis.Promise<string> {
		const c: Conn | $.VarRef<Conn> | null = this
		if ($.len($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ServerName) > 0) {
			return $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ServerName
		}
		if ($.pointerValue<Conn>(c).conn != null) {
			return $.pointerValue<Exclude<net.Addr, null>>((await $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).RemoteAddr())).String()
		}
		return ""
	}

	public async closeNotify(): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Conn>(c).out.Mutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).out.Mutex.Unlock() })

		if (!$.pointerValue<Conn>(c).closeNotifySent) {
			// Set a Write Deadline to prevent possibly blocking forever.
			await Conn.prototype.SetWriteDeadline.call(c, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(5000000000n))))
			$.pointerValue<Conn>(c).closeNotifyErr = await Conn.prototype.sendAlertLocked.call(c, $.uint(0, 8))
			$.pointerValue<Conn>(c).closeNotifySent = true
			// Any subsequent writes will fail.
			await Conn.prototype.SetWriteDeadline.call(c, $.markAsStructValue($.cloneStructValue(time.Now())))
		}
		return $.pointerValue<Conn>(c).closeNotifyErr
	}

	public connectionStateLocked(): __goscript_common.ConnectionState {
		const c: Conn | $.VarRef<Conn> | null = this
		let state: __goscript_common.ConnectionState = $.markAsStructValue(new __goscript_common.ConnectionState())
		state.HandshakeComplete = $.pointerValue<Conn>(c).isHandshakeComplete.Load()
		state.Version = $.uint($.pointerValue<Conn>(c).vers, 16)
		state.NegotiatedProtocol = $.pointerValue<Conn>(c).clientProtocol
		state.DidResume = $.pointerValue<Conn>(c).didResume
		state.HelloRetryRequest = $.pointerValue<Conn>(c).didHRR
		state.testingOnlyPeerSignatureAlgorithm = $.uint($.pointerValue<Conn>(c).peerSigAlg, 16)
		state.CurveID = $.uint($.pointerValue<Conn>(c).curveID, 16)
		state.NegotiatedProtocolIsMutual = true
		state.ServerName = $.pointerValue<Conn>(c).serverName
		state.CipherSuite = $.uint($.pointerValue<Conn>(c).cipherSuite, 16)
		state.PeerCertificates = $.pointerValue<Conn>(c).peerCertificates
		state.VerifiedChains = $.pointerValue<Conn>(c).verifiedChains
		state.SignedCertificateTimestamps = $.pointerValue<Conn>(c).scts
		state.OCSPResponse = $.pointerValue<Conn>(c).ocspResponse
		if ((!$.pointerValue<Conn>(c).didResume || $.pointerValue<Conn>(c).extMasterSecret) && ($.uint($.pointerValue<Conn>(c).vers, 16) != $.uint(772, 16))) {
			if ($.pointerValue<Conn>(c).clientFinishedIsFirst) {
				state.TLSUnique = $.goSlice($.pointerValue<Conn>(c).clientFinished, undefined, undefined)
			} else {
				state.TLSUnique = $.goSlice($.pointerValue<Conn>(c).serverFinished, undefined, undefined)
			}
		}
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).Renegotiation != 0) {
			state.ekm = __goscript_prf.noEKMBecauseRenegotiation
		} else {
			if (($.uint($.pointerValue<Conn>(c).vers, 16) != $.uint(772, 16)) && !$.pointerValue<Conn>(c).extMasterSecret) {
				state.ekm = $.functionValue(async (label: string, context: $.Slice<number>, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> => {
					if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(tlsunsafeekm)), "1")) {
						godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(tlsunsafeekm))
						return await $.pointerValue<Conn>(c).ekm!(label, context, length)
					}
					return __goscript_prf.noEKMBecauseNoEMS(label, context, length)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo))
			} else {
				state.ekm = $.pointerValue<Conn>(c).ekm
			}
		}
		state.ECHAccepted = $.pointerValue<Conn>(c).echAccepted
		return $.markAsStructValue($.cloneStructValue(state))
	}

	public async flush(): globalThis.Promise<[number, $.GoError]> {
		let c: Conn | $.VarRef<Conn> | null = this
		if ($.len($.pointerValue<Conn>(c).sendBuf) == 0) {
			return [0, null]
		}

		let [n, err] = await $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).Write($.pointerValue<Conn>(c).sendBuf)
		$.pointerValue<Conn>(c).bytesSent = $.int64Add($.pointerValue<Conn>(c).bytesSent, $.int64(n))
		$.pointerValue<Conn>(c).sendBuf = null
		$.pointerValue<Conn>(c).buffering = false
		return [n, err]
	}

	public async getClientCertificate(cri: __goscript_common.CertificateRequestInfo | $.VarRef<__goscript_common.CertificateRequestInfo> | null): globalThis.Promise<[__goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).GetClientCertificate != null) {
			return $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).GetClientCertificate!(cri)
		}

		for (let __goscriptRangeTarget0 = $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).Certificates, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let chain = $.varRef(__goscriptRangeTarget0![__rangeIndex])
			{
				let err = await __goscript_common.CertificateRequestInfo.prototype.SupportsCertificate.call(cri, chain)
				if (err != null) {
					continue
				}
			}
			return [chain, null]
		}

		return [new __goscript_common.Certificate(), null]
	}

	public async handleKeyUpdate(keyUpdate: __goscript_handshake_messages.keyUpdateMsg | $.VarRef<__goscript_handshake_messages.keyUpdateMsg> | null): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		if ($.pointerValue<Conn>(c).quic != null) {
			await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return $.pointerValue<Conn>(c)._in.setErrorLocked(errors.New("tls: received unexpected key update message"))
		}

		let __goscriptShadow4: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint($.pointerValue<Conn>(c).cipherSuite, 16))
		if (__goscriptShadow4 == null) {
			return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(80, 8)))
		}

		if ($.pointerValue<__goscript_handshake_messages.keyUpdateMsg>(keyUpdate).updateRequested) {
			await $.pointerValue<Conn>(c).out.Mutex.Lock()
			__defer.defer(() => { $.pointerValue<Conn>(c).out.Mutex.Unlock() })

			let msg: __goscript_handshake_messages.keyUpdateMsg | $.VarRef<__goscript_handshake_messages.keyUpdateMsg> | null = new __goscript_handshake_messages.keyUpdateMsg()
			let __goscriptTuple5: any = await __goscript_handshake_messages.keyUpdateMsg.prototype.marshal.call(msg)
			let msgBytes: $.Slice<number> = __goscriptTuple5[0]
			let err = __goscriptTuple5[1]
			if (err != null) {
				return err
			}
			let __goscriptTuple6: any = await Conn.prototype.writeRecordLocked.call(c, $.uint(22, 8), msgBytes)
			err = __goscriptTuple6[1]
			if (err != null) {
				// Surface the error at the next write.
				$.pointerValue<Conn>(c).out.setErrorLocked(err)
				return null
			}

			let newSecret: $.Slice<number> = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.nextTrafficSecret.call(__goscriptShadow4, $.pointerValue<Conn>(c).out.trafficSecret)
			await Conn.prototype.setWriteTrafficSecret.call(c, __goscriptShadow4, 0, newSecret)
		}

		let newSecret: $.Slice<number> = await __goscript_cipher_suites.cipherSuiteTLS13.prototype.nextTrafficSecret.call(__goscriptShadow4, $.pointerValue<Conn>(c)._in.trafficSecret)
		{
			let err = await Conn.prototype.setReadTrafficSecret.call(c, __goscriptShadow4, 0, newSecret, $.pointerValue<__goscript_handshake_messages.keyUpdateMsg>(keyUpdate).updateRequested)
			if (err != null) {
				return err
			}
		}

		return null
	}

	public async handleNewSessionTicket(msg: __goscript_handshake_messages.newSessionTicketMsgTLS13 | $.VarRef<__goscript_handshake_messages.newSessionTicketMsgTLS13> | null): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		if (!$.pointerValue<Conn>(c).isClient) {
			await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return errors.New("tls: received new session ticket from a client")
		}

		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).SessionTicketsDisabled || ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientSessionCache == null)) {
			return null
		}
		// sendAlertLocked sends a TLS alert message.

		if ($.uint($.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).lifetime, 32) == $.uint(0, 32)) {
			return null
		}
		let lifetime = $.int64Mul($.int64($.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).lifetime), 1000000000n)
		if (lifetime > 604800000000000n) {
			await Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: received a session ticket with invalid lifetime")
		}

		if ($.len($.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).label) == 0) {
			await Conn.prototype.sendAlert.call(c, $.uint(50, 8))
			return errors.New("tls: received a session ticket with empty opaque ticket label")
		}

		// closeNotify is a special case in that it isn't an error.
		if ((($.pointerValue<Conn>(c).quic != null) && ($.uint($.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).maxEarlyData, 32) != $.uint(0, 32))) && ($.uint($.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).maxEarlyData, 32) != $.uint(0xffffffff, 32))) {
			await Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return errors.New("tls: invalid early data for QUIC connection")
		}

		let __goscriptShadow5: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint($.pointerValue<Conn>(c).cipherSuite, 16))
		if ((__goscriptShadow5 == null) || ($.pointerValue<Conn>(c).resumptionSecret == null)) {
			return Conn.prototype.sendAlert.call(c, $.uint(80, 8))
		}

		let psk: $.Slice<number> = await tls13.ExpandLabel(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(__goscriptShadow5).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), $.pointerValue<Conn>(c).resumptionSecret, "resumption", $.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).nonce, crypto.Hash_Size($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(__goscriptShadow5).hash))

		let session: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = await Conn.prototype.sessionState.call(c)
		$.pointerValue<__goscript_ticket.SessionState>(session).secret = psk
		$.pointerValue<__goscript_ticket.SessionState>(session).useBy = $.uint64($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config)))).Add(lifetime))).Unix())
		$.pointerValue<__goscript_ticket.SessionState>(session).ageAdd = $.uint($.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).ageAdd, 32)
		$.pointerValue<__goscript_ticket.SessionState>(session).EarlyData = ($.pointerValue<Conn>(c).quic != null) && ($.uint($.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).maxEarlyData, 32) == $.uint(0xffffffff, 32))
		$.pointerValue<__goscript_ticket.SessionState>(session).ticket = $.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(msg).label
		if (($.pointerValue<Conn>(c).quic != null) && $.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).enableSessionEvents) {
			Conn.prototype.quicStoreSession.call(c, session)
			return null
		}
		let cs: __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null = new __goscript_ticket.ClientSessionState({session: session})
		{
			let cacheKey = await Conn.prototype.clientSessionCacheKey.call(c)
			if (!$.stringEqual(cacheKey, "")) {
				await $.pointerValue<Exclude<__goscript_common.ClientSessionCache, null>>($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientSessionCache).Put(cacheKey, cs)
			}
		}

		return null
	}

	public async handlePostHandshakeMessage(): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		if ($.uint($.pointerValue<Conn>(c).vers, 16) != $.uint(772, 16)) {
			return Conn.prototype.handleRenegotiation.call(c)
		}

		let [msg, err] = await Conn.prototype.readHandshake.call(c, null)
		if (err != null) {
			return err
		}
		$.pointerValue<Conn>(c).retryCount++
		if ($.pointerValue<Conn>(c).retryCount > 16) {
			await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return $.pointerValue<Conn>(c)._in.setErrorLocked(errors.New("tls: too many non-advancing records"))
		}

		{
			const __goscriptTypeSwitchValue = msg
			switch (true) {
				case $.typeAssert<__goscript_handshake_messages.newSessionTicketMsgTLS13 | $.VarRef<__goscript_handshake_messages.newSessionTicketMsgTLS13> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsgTLS13" }).ok:
					{
						let msg: __goscript_handshake_messages.newSessionTicketMsgTLS13 | $.VarRef<__goscript_handshake_messages.newSessionTicketMsgTLS13> | null = $.typeAssert<__goscript_handshake_messages.newSessionTicketMsgTLS13 | $.VarRef<__goscript_handshake_messages.newSessionTicketMsgTLS13> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsgTLS13" }).value
						return Conn.prototype.handleNewSessionTicket.call(c, msg)
					}
					break
				case $.typeAssert<__goscript_handshake_messages.keyUpdateMsg | $.VarRef<__goscript_handshake_messages.keyUpdateMsg> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "tls.keyUpdateMsg" }).ok:
					{
						let msg: __goscript_handshake_messages.keyUpdateMsg | $.VarRef<__goscript_handshake_messages.keyUpdateMsg> | null = $.typeAssert<__goscript_handshake_messages.keyUpdateMsg | $.VarRef<__goscript_handshake_messages.keyUpdateMsg> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "tls.keyUpdateMsg" }).value
						return Conn.prototype.handleKeyUpdate.call(c, msg)
					}
					break
			}
		}
		// The QUIC layer is supposed to treat an unexpected post-handshake CertificateRequest
		// as a QUIC-level PROTOCOL_VIOLATION error (RFC 9001, Section 4.4). Returning an
		// unexpected_message alert here doesn't provide it with enough information to distinguish
		// this condition from other unexpected messages. This is probably fine.
		await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
		return fmt.Errorf("tls: received unexpected handshake message of type %T", msg)
	}

	public async handleRenegotiation(): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
			return errors.New("tls: internal error: unexpected renegotiation")
		}

		let [msg, err] = await Conn.prototype.readHandshake.call(c, null)
		if (err != null) {
			return err
		}

		let __goscriptTuple7: any = $.typeAssertTuple<__goscript_handshake_messages.helloRequestMsg | $.VarRef<__goscript_handshake_messages.helloRequestMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.helloRequestMsg" })
		let helloReq: __goscript_handshake_messages.helloRequestMsg | $.VarRef<__goscript_handshake_messages.helloRequestMsg> | null = __goscriptTuple7[0]
		let ok = __goscriptTuple7[1]
		if (!ok) {
			await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return __goscript_common.unexpectedMessageError($.interfaceValue<any>(helloReq, "*tls.helloRequestMsg", { kind: $.TypeKind.Pointer, elemType: "tls.helloRequestMsg" }), msg)
		}

		if (!$.pointerValue<Conn>(c).isClient) {
			return Conn.prototype.sendAlert.call(c, $.uint(100, 8))
		}

		switch ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).Renegotiation) {
			case 0:
			{
				return Conn.prototype.sendAlert.call(c, $.uint(100, 8))
				break
			}
			case 1:
			{
				if ($.pointerValue<Conn>(c).handshakes > 1) {
					return Conn.prototype.sendAlert.call(c, $.uint(100, 8))
				}
				break
			}
			case 2:
			{
				break
			}
			default:
			{
				await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return errors.New("tls: unknown Renegotiation value")
				break
			}
		}

		await $.pointerValue<Conn>(c).handshakeMutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).handshakeMutex.Unlock() })

		$.pointerValue<Conn>(c).isHandshakeComplete.Store(false)
		{
			$.pointerValue<Conn>(c).handshakeErr = await Conn.prototype.clientHandshake.call(c, context2.Background())
			if ($.pointerValue<Conn>(c).handshakeErr == null) {
				$.pointerValue<Conn>(c).handshakes++
			}
		}
		return $.pointerValue<Conn>(c).handshakeErr
	}

	public async handshakeContext(ctx: context2.Context | null): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		let ret: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		// Fast sync/atomic-based exit if there is no handshake in flight and the
		// last one succeeded without an error. Avoids the expensive context setup
		// and mutex for most Read and Write calls.
		if ($.pointerValue<Conn>(c).isHandshakeComplete.Load()) {
			return null
		}

		let [handshakeCtx, cancel] = context2.WithCancel($.pointerValueOrNil(ctx)!)
		// Note: defer this before calling context.AfterFunc
		// so that we can tell the difference between the input being canceled and
		// this cancellation. In the former case, we need to close the connection.
		__defer.defer(async () => { await cancel!() })

		if ($.pointerValue<Conn>(c).quic != null) {
			$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).ctx = handshakeCtx
			$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).cancel = cancel
		} else {
			if (await $.pointerValue<Exclude<context2.Context, null>>(ctx).Done() != null) {
				// Close the connection if ctx is canceled before the function returns.
				let stop: (() => boolean | globalThis.Promise<boolean>) | null = context2.AfterFunc($.pointerValueOrNil(ctx)!, $.functionValue(async (): globalThis.Promise<void> => {
					await $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).Close()
				}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
				__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
					if (!await stop!()) {
						// Return context error to user.
						ret = await $.pointerValue<Exclude<context2.Context, null>>(ctx).Err()
					}
				})() })
			}
		}

		await $.pointerValue<Conn>(c).handshakeMutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).handshakeMutex.Unlock() })

		{
			let err = $.pointerValue<Conn>(c).handshakeErr
			if (err != null) {
				const __goscriptReturn13: $.GoError = err
				ret = __goscriptReturn13
				await __defer.dispose()
				return ret
			}
		}
		if ($.pointerValue<Conn>(c).isHandshakeComplete.Load()) {
			const __goscriptReturn14: $.GoError = null
			ret = __goscriptReturn14
			await __defer.dispose()
			return ret
		}

		await $.pointerValue<Conn>(c)._in.Mutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c)._in.Mutex.Unlock() })

		$.pointerValue<Conn>(c).handshakeErr = await $.pointerValue<Conn>(c).handshakeFn!(handshakeCtx)
		if ($.pointerValue<Conn>(c).handshakeErr == null) {
			$.pointerValue<Conn>(c).handshakes++
		} else {
			// If an error occurred during the handshake try to flush the
			// alert that might be left in the buffer.
			await Conn.prototype.flush.call(c)
		}

		if (($.pointerValue<Conn>(c).handshakeErr == null) && !$.pointerValue<Conn>(c).isHandshakeComplete.Load()) {
			$.pointerValue<Conn>(c).handshakeErr = errors.New("tls: internal error: handshake should have had a result")
		}
		if (($.pointerValue<Conn>(c).handshakeErr != null) && $.pointerValue<Conn>(c).isHandshakeComplete.Load()) {
			$.panic("tls: internal error: handshake returned an error but is marked successful")
		}

		if ($.pointerValue<Conn>(c).quic != null) {
			if ($.pointerValue<Conn>(c).handshakeErr == null) {
				Conn.prototype.quicHandshakeComplete.call(c)
				// Provide the 1-RTT read secret now that the handshake is complete.
				// The QUIC layer MUST NOT decrypt 1-RTT packets prior to completing
				// the handshake (RFC 9001, Section 5.7).
				{
					let err = await Conn.prototype.quicSetReadSecret.call(c, 3, $.uint($.pointerValue<Conn>(c).cipherSuite, 16), $.pointerValue<Conn>(c)._in.trafficSecret)
					if (err != null) {
						const __goscriptReturn15: $.GoError = err
						ret = __goscriptReturn15
						await __defer.dispose()
						return ret
					}
				}
			} else {
				await $.pointerValue<Conn>(c).out.Mutex.Lock()
				let __goscriptTuple8: any = errors.AsType({E: { type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" }, zero: () => 0, methods: {Error: (receiver: any, ...args: any[]) => (__goscript_alert.alert_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (__goscript_alert.alert_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, $.pointerValueOrNil($.pointerValue<Conn>(c).out.err)!)
				let a = ($.uint(__goscriptTuple8[0], 8) as __goscript_alert.alert)
				let ok = __goscriptTuple8[1]
				if (!ok) {
					a = $.uint(80, 8)
				}
				$.pointerValue<Conn>(c).out.Mutex.Unlock()
				// Return an error which wraps both the handshake error and
				// any alert error we may have sent, or alertInternalError
				// if we didn't send an alert.
				// Truncate the text of the alert to 0 characters.
				$.pointerValue<Conn>(c).handshakeErr = fmt.Errorf("%w%.0w", ($.pointerValue<Conn>(c).handshakeErr as any), $.namedValueInterfaceValue<any>($.uint(a, 8), "tls.AlertError", {Error: (receiver: any, ...args: any[]) => (__goscript_alert.AlertError_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.AlertError" }, [{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
			}
			$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).blockedc!.close()
			$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).signalc!.close()
		}

		const __goscriptReturn16: $.GoError = $.pointerValue<Conn>(c).handshakeErr
		ret = __goscriptReturn16
		await __defer.dispose()
		return ret
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async loadSession(hello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null): globalThis.Promise<[__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null, tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null, $.Slice<number>, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		let session: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = null as __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null
		let earlySecret: tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null = null as tls13.EarlySecret | $.VarRef<tls13.EarlySecret> | null
		let binderKey: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).SessionTicketsDisabled || ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientSessionCache == null)) {
			return [null, null, null, null]
		}

		let echInner = bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).encryptedClientHello, new Uint8Array([1]) as $.Slice<number>)

		$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).ticketSupported = true && !echInner

		if ($.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedVersions!, 0), 16) == $.uint(772, 16)) {

			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).pskModes = new Uint8Array([1]) as $.Slice<number>
		}

		if ($.pointerValue<Conn>(c).handshakes != 0) {
			return [null, null, null, null]
		}

		let cacheKey = await Conn.prototype.clientSessionCacheKey.call(c)
		if ($.stringEqual(cacheKey, "")) {
			return [null, null, null, null]
		}
		let __goscriptTuple9: any = await $.pointerValue<Exclude<__goscript_common.ClientSessionCache, null>>($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientSessionCache).Get(cacheKey)
		let cs: __goscript_ticket.ClientSessionState | $.VarRef<__goscript_ticket.ClientSessionState> | null = __goscriptTuple9[0]
		let ok = __goscriptTuple9[1]
		if (!ok || (cs == null)) {
			return [null, null, null, null]
		}
		session = $.pointerValue<__goscript_ticket.ClientSessionState>(cs).session

		let versOk = false
		for (let __goscriptRangeTarget1 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedVersions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let v = __goscriptRangeTarget1![__rangeIndex]
			if ($.uint(v, 16) == $.uint($.pointerValue<__goscript_ticket.SessionState>(session).version, 16)) {
				versOk = true
				break
			}
		}
		if (!versOk) {
			return [null, null, null, null]
		}

		if ($.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config)))).After($.markAsStructValue($.cloneStructValue($.pointerValue<x509.Certificate>($.arrayIndex($.pointerValue<__goscript_ticket.SessionState>(session).peerCertificates!, 0)).NotAfter)))) {

			await $.pointerValue<Exclude<__goscript_common.ClientSessionCache, null>>($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientSessionCache).Put(cacheKey, null)
			return [null, null, null, null]
		}
		if (!$.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).InsecureSkipVerify) {
			if ($.len($.pointerValue<__goscript_ticket.SessionState>(session).verifiedChains) == 0) {

				return [null, null, null, null]
			}
			{
				let __goscriptShadow6 = x509.Certificate.prototype.VerifyHostname.call($.arrayIndex($.pointerValue<__goscript_ticket.SessionState>(session).peerCertificates!, 0), $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ServerName)
				if (__goscriptShadow6 != null) {

					return [null, null, null, null]
				}
			}
			let opts = (await (async () => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue(await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config))); return $.markAsStructValue(new x509.VerifyOptions({CurrentTime: __goscriptLiteralField0, Roots: $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).RootCAs, KeyUsages: $.arrayToSlice<x509.ExtKeyUsage>([x509.ExtKeyUsageServerAuth])})) })())
			if (!await __goscript_common.anyValidVerifiedChain($.pointerValue<__goscript_ticket.SessionState>(session).verifiedChains, $.markAsStructValue($.cloneStructValue(opts)))) {

				await $.pointerValue<Exclude<__goscript_common.ClientSessionCache, null>>($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientSessionCache).Put(cacheKey, null)
				return [null, null, null, null]
			}
		}

		if ($.uint($.pointerValue<__goscript_ticket.SessionState>(session).version, 16) != $.uint(772, 16)) {

			if (__goscript_cipher_suites.mutualCipherSuite($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites, $.uint($.pointerValue<__goscript_ticket.SessionState>(session).cipherSuite, 16)) == null) {
				return [null, null, null, null]
			}

			if (!$.pointerValue<__goscript_ticket.SessionState>(session).extMasterSecret && fips140tls.Required()) {
				return [null, null, null, null]
			}
			// if n < 0 { n = 0 }
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).sessionTicket = $.pointerValue<__goscript_ticket.SessionState>(session).ticket
			return [session, earlySecret, binderKey, err]
		}

		if ($.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config)))).After($.markAsStructValue($.cloneStructValue(time.Unix($.int64($.pointerValue<__goscript_ticket.SessionState>(session).useBy), 0n))))) {
			await $.pointerValue<Exclude<__goscript_common.ClientSessionCache, null>>($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientSessionCache).Put(cacheKey, null)
			return [null, null, null, null]
		}

		let __goscriptShadow7: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint($.pointerValue<__goscript_ticket.SessionState>(session).cipherSuite, 16))
		if (__goscriptShadow7 == null) {
			return [null, null, null, null]
		}
		let cipherSuiteOk = false
		for (let __goscriptRangeTarget2 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let offeredID = __goscriptRangeTarget2![__rangeIndex]
			let offeredSuite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint(offeredID, 16))
			if ((offeredSuite != null) && ($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(offeredSuite).hash == $.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(__goscriptShadow7).hash)) {
				cipherSuiteOk = true
				break
			}
		}
		if (!cipherSuiteOk) {
			return [null, null, null, null]
		}

		if ($.pointerValue<Conn>(c).quic != null) {
			if ($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).enableSessionEvents) {
				await Conn.prototype.quicResumeSession.call(c, session)
			}

			if ($.pointerValue<__goscript_ticket.SessionState>(session).EarlyData && (__goscript_cipher_suites.mutualCipherSuiteTLS13($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites, $.uint($.pointerValue<__goscript_ticket.SessionState>(session).cipherSuite, 16)) != null)) {
				for (let __goscriptRangeTarget3 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).alpnProtocols, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
					let alpn = __goscriptRangeTarget3![__rangeIndex]
					if ($.stringEqual(alpn, $.pointerValue<__goscript_ticket.SessionState>(session).alpnProtocol)) {
						$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).earlyData = true
						break
					}
				}
			}
		}

		let ticketAge = $.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config)))).Sub($.markAsStructValue($.cloneStructValue(time.Unix($.int64($.pointerValue<__goscript_ticket.SessionState>(session).createdAt), 0n))))
		let identity = $.markAsStructValue(new __goscript_common.pskIdentity({label: $.pointerValue<__goscript_ticket.SessionState>(session).ticket, obfuscatedTicketAge: $.uint($.uint($.int64Div(ticketAge, 1000000n), 32) + $.pointerValue<__goscript_ticket.SessionState>(session).ageAdd, 32)}))
		$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).pskIdentities = $.arrayToSlice<__goscript_common.pskIdentity>([$.markAsStructValue($.cloneStructValue(identity))])
		$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).pskBinders = $.arrayToSlice<$.Slice<number>>([$.makeSlice<number>(crypto.Hash_Size($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(__goscriptShadow7).hash), undefined, "byte")])

		earlySecret = await tls13.NewEarlySecret(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(__goscriptShadow7).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), $.pointerValue<__goscript_ticket.SessionState>(session).secret)
		binderKey = await tls13.EarlySecret.prototype.ResumptionBinderKey.call(earlySecret)
		let transcript = await crypto.Hash_New($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(__goscriptShadow7).hash)
		{
			let __goscriptShadow8 = await __goscript_handshake_client.computeAndUpdatePSK(hello, binderKey, transcript, $.functionValue(((__receiver) => (baseKey: $.Slice<number>, transcript: hash.Hash | null) => __receiver.finishedHash(baseKey, transcript))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(__goscriptShadow7)), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "hash.Hash"], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo)))
			if (__goscriptShadow8 != null) {
				return [null, null, null, __goscriptShadow8]
			}
		}

		return [session, earlySecret, binderKey, err]
	}

	public async makeClientHello(): globalThis.Promise<[__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, __goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null, __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		let config: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null = $.pointerValue<Conn>(c).config
		if (($.len($.pointerValue<__goscript_common.Config>(config).ServerName) == 0) && !$.pointerValue<__goscript_common.Config>(config).InsecureSkipVerify) {
			return [null, null, null, errors.New("tls: either ServerName or InsecureSkipVerify must be specified in the tls.Config")]
		}

		let nextProtosLength = 0
		for (let __goscriptRangeTarget4 = $.pointerValue<__goscript_common.Config>(config).NextProtos, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
			let proto = __goscriptRangeTarget4![__rangeIndex]
			{
				let l = $.len(proto)
				if ((l == 0) || (l > 255)) {
					return [null, null, null, errors.New("tls: invalid NextProtos value")]
				} else {
					nextProtosLength = nextProtosLength + (1 + l)
				}
			}
		}
		if (nextProtosLength > 0xffff) {
			return [null, null, null, errors.New("tls: NextProtos values too large")]
		}

		let supportedVersions: $.Slice<number> = __goscript_common.Config.prototype.supportedVersions.call(config, true)
		if ($.len(supportedVersions) == 0) {
			return [null, null, null, errors.New("tls: no supported versions satisfy MinVersion and MaxVersion")]
		}

		let maxVersion = $.uint($.arrayIndex(supportedVersions!, 0), 16)
		let minVersion = $.uint($.arrayIndex(supportedVersions!, $.len(supportedVersions) - 1), 16)

		let hello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = (() => { const __goscriptLiteralField1 = __goscript_handshake_client.hostnameInSNI($.pointerValue<__goscript_common.Config>(config).ServerName); const __goscriptLiteralField2 = __goscript_common.Config.prototype.curvePreferences.call(config, $.uint(maxVersion, 16)); return new __goscript_handshake_messages.clientHelloMsg({vers: $.uint(maxVersion, 16), compressionMethods: new Uint8Array([0]) as $.Slice<number>, random: $.makeSlice<number>(32, undefined, "byte"), extendedMasterSecret: true, ocspStapling: true, scts: true, serverName: __goscriptLiteralField1, supportedCurves: __goscriptLiteralField2, supportedPoints: new Uint8Array([0]) as $.Slice<number>, secureRenegotiationSupported: true, alpnProtocols: $.pointerValue<__goscript_common.Config>(config).NextProtos, supportedVersions: supportedVersions}) })()

		// closeNotifyErr is any error from sending the alertCloseNotify record.

		if ($.uint($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).vers, 16) > $.uint(771, 16)) {
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).vers = $.uint(771, 16)
		}

		if ($.pointerValue<Conn>(c).handshakes > 0) {
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).secureRenegotiation = $.goSlice($.pointerValue<Conn>(c).clientFinished, undefined, undefined)
		}

		$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites = __goscript_common.Config.prototype.cipherSuites.call(config, __goscript_cipher_suites.hasAESGCMHardwareSupport)

		if ($.uint(maxVersion, 16) < $.uint(771, 16)) {
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites = (slices.DeleteFunc($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites, $.functionValue((id: number): boolean => {
				return ($.pointerValue<__goscript_cipher_suites.cipherSuite>(__goscript_cipher_suites.cipherSuiteByID($.uint(id, 16))).flags & 4) != 0
			}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<number>)
		}
		// raw input, starting with a record header
		let [, err] = await io.ReadFull($.pointerValueOrNil(__goscript_common.Config.prototype.rand.call(config))!, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).random)
		if (err != null) {
			return [null, null, null, errors.New("tls: short read from Rand: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
		}

		// bytesSent counts the bytes of application data sent.
		// packetsSent counts packets.

		if ($.pointerValue<Conn>(c).quic == null) {
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).sessionId = $.makeSlice<number>(32, undefined, "byte")
			{
				let [, __goscriptShadow9] = await io.ReadFull($.pointerValueOrNil(__goscript_common.Config.prototype.rand.call(config))!, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).sessionId)
				if (__goscriptShadow9 != null) {
					return [null, null, null, errors.New("tls: short read from Rand: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow9).Error())]
				}
			}
		}

		if ($.uint(maxVersion, 16) >= $.uint(771, 16)) {
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedSignatureAlgorithms = __goscript_common.supportedSignatureAlgorithms($.uint(minVersion, 16))
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedSignatureAlgorithmsCert = __goscript_common.supportedSignatureAlgorithmsCert()
		}

		let keyShareKeys: __goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null = null as __goscript_key_schedule.keySharePrivateKeys | $.VarRef<__goscript_key_schedule.keySharePrivateKeys> | null
		if ($.uint(maxVersion, 16) >= $.uint(772, 16)) {

			if ($.uint(minVersion, 16) >= $.uint(772, 16)) {
				$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites = null
			}

			if (fips140tls.Required()) {
				$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites = $.appendSlice($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites, __goscript_defaults_fips140.__goscript_get_allowedCipherSuitesTLS13FIPS())
			} else {
				if (__goscript_cipher_suites.hasAESGCMHardwareSupport) {
					$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites = $.appendSlice($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites, __goscript_defaults.__goscript_get_defaultCipherSuitesTLS13())
				} else {
					$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites = $.appendSlice($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).cipherSuites, __goscript_defaults.__goscript_get_defaultCipherSuitesTLS13NoAES())
				}
			}

			if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedCurves) == 0) {
				return [null, null, null, errors.New("tls: no supported elliptic curves for ECDHE")]
			}

			let curveID = $.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedCurves!, 0), 16)
			let [ke, __goscriptShadow10] = __goscript_key_schedule.keyExchangeForCurveID($.uint(curveID, 16))
			if (__goscriptShadow10 != null) {
				return [null, null, null, errors.New("tls: CurvePreferences includes unsupported curve")]
			}
			let __goscriptTuple10: any = await $.pointerValue<Exclude<__goscript_key_schedule.keyExchange, null>>(ke).keyShares(__goscript_common.Config.prototype.rand.call(config))
			keyShareKeys = __goscriptTuple10[0]
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares = __goscriptTuple10[1]
			__goscriptShadow10 = __goscriptTuple10[2]
			if (__goscriptShadow10 != null) {
				return [null, null, null, __goscriptShadow10]
			}

			if (($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares) == 2) && !slices.Contains($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedCurves, $.uint($.arrayIndex($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares!, 1).group, 16))) {
				$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares = $.goSlice($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).keyShares, undefined, 1)
			}
		}

		if ($.pointerValue<Conn>(c).quic != null) {
			let __goscriptTuple11: any = await Conn.prototype.quicGetTransportParameters.call(c)
			let p: $.Slice<number> = __goscriptTuple11[0]
			let __goscriptShadow11 = __goscriptTuple11[1]
			if (__goscriptShadow11 != null) {
				return [null, null, null, __goscriptShadow11]
			}
			if (p == null) {
				p = new Uint8Array([]) as $.Slice<number>
			}
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).quicTransportParameters = p
		}
		// first permanent error
		let ech: __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null = null as __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).EncryptedClientHelloConfigList != null) {
			if (($.uint($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).MinVersion, 16) != $.uint(0, 16)) && ($.uint($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).MinVersion, 16) < $.uint(772, 16))) {
				return [null, null, null, errors.New("tls: MinVersion must be >= VersionTLS13 if EncryptedClientHelloConfigList is populated")]
			}
			if (($.uint($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).MaxVersion, 16) != $.uint(0, 16)) && ($.uint($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).MaxVersion, 16) <= $.uint(771, 16))) {
				return [null, null, null, errors.New("tls: MaxVersion must be >= VersionTLS13 if EncryptedClientHelloConfigList is populated")]
			}
			let __goscriptTuple12: any = __goscript_ech.parseECHConfigList($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).EncryptedClientHelloConfigList)
			let echConfigs: $.Slice<__goscript_ech.echConfig> = __goscriptTuple12[0]
			let __goscriptShadow12 = __goscriptTuple12[1]
			if (__goscriptShadow12 != null) {
				return [null, null, null, __goscriptShadow12]
			}
			let __goscriptTuple13: any = await __goscript_ech.pickECHConfig(echConfigs)
			let __goscriptShadow13: __goscript_ech.echConfig | $.VarRef<__goscript_ech.echConfig> | null = __goscriptTuple13[0]
			let echPK = __goscriptTuple13[1]
			let kdf = __goscriptTuple13[2]
			let __goscriptShadow14 = __goscriptTuple13[3]
			if (__goscriptShadow13 == null) {
				return [null, null, null, errors.New("tls: EncryptedClientHelloConfigList contains no valid configs")]
			}
			ech = (await (async () => { const __goscriptLiteralField3 = $.uint(await $.pointerValue<Exclude<hpke.KDF, null>>(kdf).ID(), 16); const __goscriptLiteralField4 = $.uint(await $.pointerValue<Exclude<hpke.AEAD, null>>(__goscriptShadow14).ID(), 16); return new __goscript_handshake_client.echClientContext({config: __goscriptShadow13, kdfID: __goscriptLiteralField3, aeadID: __goscriptLiteralField4}) })())
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).encryptedClientHello = new Uint8Array([1]) as $.Slice<number>

			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).supportedPoints = null
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).ticketSupported = false
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).secureRenegotiationSupported = false
			$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).extendedMasterSecret = false

			let info: $.Slice<number> = $.appendSlice(new Uint8Array([116, 108, 115, 32, 101, 99, 104, 0]), $.pointerValue<__goscript_ech.echConfig>($.pointerValue<__goscript_handshake_client.echClientContext>(ech).config).raw, $.byteSliceHint)
			let __goscriptTuple14: any = await hpke.NewSender(echPK, kdf, __goscriptShadow14, info)
			$.pointerValue<__goscript_handshake_client.echClientContext>(ech).encapsulatedKey = __goscriptTuple14[0]
			$.pointerValue<__goscript_handshake_client.echClientContext>(ech).hpkeContext = __goscriptTuple14[1]
			__goscriptShadow12 = __goscriptTuple14[2]
			if (__goscriptShadow12 != null) {
				return [null, null, null, __goscriptShadow12]
			}
		}

		return [hello, keyShareKeys, ech, null]
	}

	public async maxPayloadSizeForWrite(typ: __goscript_common.recordType): globalThis.Promise<number> {
		let c: Conn | $.VarRef<Conn> | null = this
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).DynamicRecordSizingDisabled || ($.uint(typ, 8) != $.uint(23, 8))) {
			return 16384
		}

		if ($.pointerValue<Conn>(c).bytesSent >= 131072n) {
			return 16384
		}

		// Subtract TLS overheads to get the maximum payload size.
		let payloadBytes = (1208 - 5) - await $.pointerValue<Conn>(c).out.explicitNonceLen()
		if ($.pointerValue<Conn>(c).out.cipher != null) {
			{
				const __goscriptTypeSwitchValue = $.pointerValue<Conn>(c).out.cipher
				switch (true) {
					case $.typeAssert<cipher2.Stream | null>(__goscriptTypeSwitchValue, "cipher.Stream").ok:
						{
							let ciph: cipher2.Stream | null = $.typeAssert<cipher2.Stream | null>(__goscriptTypeSwitchValue, "cipher.Stream").value
							payloadBytes = payloadBytes - (await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<Conn>(c).out.mac).Size())
						}
						break
					case $.typeAssert<cipher2.AEAD | null>(__goscriptTypeSwitchValue, "cipher.AEAD").ok:
						{
							let ciph: cipher2.AEAD | null = $.typeAssert<cipher2.AEAD | null>(__goscriptTypeSwitchValue, "cipher.AEAD").value
							payloadBytes = payloadBytes - (await $.pointerValue<Exclude<cipher2.AEAD, null>>(ciph).Overhead())
						}
						break
					case $.typeAssert<cbcMode | null>(__goscriptTypeSwitchValue, "tls.cbcMode").ok:
						{
							let ciph: cbcMode | null = $.typeAssert<cbcMode | null>(__goscriptTypeSwitchValue, "tls.cbcMode").value
							let blockSize = await $.pointerValue<Exclude<cbcMode, null>>(ciph).BlockSize()
							// The payload must fit in a multiple of blockSize, with
							// room for at least one padding byte.
							payloadBytes = (payloadBytes & Number($.int64Xor((blockSize - 1), -1n))) - 1
							// The MAC is appended before padding so affects the
							// payload size directly.
							payloadBytes = payloadBytes - (await $.pointerValue<Exclude<hash.Hash, null>>($.pointerValue<Conn>(c).out.mac).Size())
						}
						break
					default:
						{
							let ciph: any = __goscriptTypeSwitchValue
							$.panic("unknown cipher type")
						}
						break
				}
			}
		}
		if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
			payloadBytes--
		}

		// Allow packet growth in arithmetic progression up to max.
		let pkt = $.pointerValue<Conn>(c).packetsSent
		$.pointerValue<Conn>(c).packetsSent++
		if (pkt > 1000n) {
			return 16384
		}

		let n = payloadBytes * $.int($.int64Add(pkt, 1n))
		if (n > 16384) {
			n = 16384
		}
		return n
	}

	public newRecordHeaderError(conn: net.Conn | null, msg: string): RecordHeaderError {
		const c: Conn | $.VarRef<Conn> | null = this
		let err: RecordHeaderError = $.markAsStructValue(new RecordHeaderError())
		err.Msg = msg
		err.Conn = conn
		$.copy($.goSlice(err.RecordHeader, undefined, undefined), $.pointerValue<Conn>(c).rawInput.Bytes())
		return $.markAsStructValue($.cloneStructValue(err))
	}

	public async pickTLSVersion(serverHello: __goscript_handshake_messages.serverHelloMsg | $.VarRef<__goscript_handshake_messages.serverHelloMsg> | null): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		let peerVersion = $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>(serverHello).vers, 16)
		if ($.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>(serverHello).supportedVersion, 16) != $.uint(0, 16)) {
			peerVersion = $.uint($.pointerValue<__goscript_handshake_messages.serverHelloMsg>(serverHello).supportedVersion, 16)
		}

		let __goscriptTuple15: any = __goscript_common.Config.prototype.mutualVersion.call($.pointerValue<Conn>(c).config, true, $.arrayToSlice<number>([$.uint(peerVersion, 16)]))
		let vers = $.uint(__goscriptTuple15[0], 16)
		let ok = __goscriptTuple15[1]
		if (!ok) {
			await Conn.prototype.sendAlert.call(c, $.uint(70, 8))
			return fmt.Errorf("tls: server selected unsupported protocol version %x", $.namedValueInterfaceValue<any>(peerVersion, "uint16", {}, { kind: $.TypeKind.Basic, name: "uint16" }))
		}

		$.pointerValue<Conn>(c).vers = $.uint(vers, 16)
		$.pointerValue<Conn>(c).haveVers = true
		$.pointerValue<Conn>(c)._in.version = $.uint(vers, 16)
		$.pointerValue<Conn>(c).out.version = $.uint(vers, 16)

		return null
	}

	public async processCertsFromClient(certificate: __goscript_common.Certificate): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		let certificates: $.Slice<$.Slice<number>> = certificate.Certificate
		let certs: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null> = $.makeSlice<x509.Certificate | $.VarRef<x509.Certificate> | null>($.len(certificates))
		let err: $.GoError = null as $.GoError
		for (let __goscriptRangeTarget5 = certificates, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
			let asn1Data = __goscriptRangeTarget5![i]
			{
				let __goscriptTuple16: any = await x509.ParseCertificate(asn1Data)
				certs![i] = __goscriptTuple16[0]
				err = __goscriptTuple16[1]
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(50, 8))
					return errors.New("tls: failed to parse client certificate: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
				}
			}
			if ($.pointerValue<x509.Certificate>($.arrayIndex(certs!, i)).PublicKeyAlgorithm == x509.RSA) {
				let n = big.Int.prototype.BitLen.call($.pointerValue<rsa.PublicKey>($.mustTypeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>($.pointerValue<x509.Certificate>($.arrayIndex(certs!, i)).PublicKey, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })).N)
				{
					let [max, ok] = __goscript_handshake_client.checkKeySize(n)
					if (!ok) {
						await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
						return fmt.Errorf("tls: client sent certificate containing RSA key larger than %d bits", $.namedValueInterfaceValue<any>(max, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
				}
			}
		}

		if (($.len(certs) == 0) && __goscript_common.requiresClientCert($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientAuth)) {
			if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
				await Conn.prototype.sendAlert.call(c, $.uint(116, 8))
			} else {
				await Conn.prototype.sendAlert.call(c, $.uint(40, 8))
			}
			return errors.New("tls: client didn't provide a certificate")
		}

		if (($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientAuth >= 3) && ($.len(certs) > 0)) {
			let opts = (await (async () => { const __goscriptLiteralField5 = $.markAsStructValue($.cloneStructValue(await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config))); const __goscriptLiteralField6 = x509.NewCertPool(); return $.markAsStructValue(new x509.VerifyOptions({Roots: $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ClientCAs, CurrentTime: __goscriptLiteralField5, Intermediates: __goscriptLiteralField6, KeyUsages: $.arrayToSlice<x509.ExtKeyUsage>([x509.ExtKeyUsageClientAuth])})) })())

			for (let __goscriptRangeTarget6 = $.goSlice(certs, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
				let cert = __goscriptRangeTarget6![__rangeIndex]
				await x509.CertPool.prototype.AddCert.call(opts.Intermediates, cert)
			}

			let __goscriptTuple17: any = await x509.Certificate.prototype.Verify.call($.arrayIndex(certs!, 0), $.markAsStructValue($.cloneStructValue(opts)))
			let chains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>> = __goscriptTuple17[0]
			let __goscriptShadow15 = __goscriptTuple17[1]
			if (__goscriptShadow15 != null) {
				{
					let [, ok] = errors.AsType({E: { type: "x509.UnknownAuthorityError", zero: () => $.markAsStructValue(new x509.UnknownAuthorityError()), methods: {Error: (receiver: any, ...args: any[]) => receiver.Error(...args)} }}, $.pointerValueOrNil(__goscriptShadow15)!)
					if (ok) {
						await Conn.prototype.sendAlert.call(c, $.uint(48, 8))
					} else {
						{
							let __goscriptTuple18: any = errors.AsType({E: { type: "x509.CertificateInvalidError", zero: () => $.markAsStructValue(new x509.CertificateInvalidError()), methods: {Error: (receiver: any, ...args: any[]) => receiver.Error(...args)} }}, $.pointerValueOrNil(__goscriptShadow15)!)
							let errCertificateInvalid = (__goscriptTuple18[0] as x509.CertificateInvalidError)
							let __goscriptShadow16 = __goscriptTuple18[1]
							if (__goscriptShadow16 && (errCertificateInvalid.Reason == x509.Expired)) {
								await Conn.prototype.sendAlert.call(c, $.uint(45, 8))
							} else {
								await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
							}
						}
					}
				}
				return $.interfaceValue<$.GoError>(new __goscript_common.CertificateVerificationError({UnverifiedCertificates: certs, Err: __goscriptShadow15}), "*tls.CertificateVerificationError", { kind: $.TypeKind.Pointer, elemType: "tls.CertificateVerificationError" })
			}

			let __goscriptTuple19: any = await __goscript_common.fipsAllowedChains(chains)
			$.pointerValue<Conn>(c).verifiedChains = __goscriptTuple19[0]
			__goscriptShadow15 = __goscriptTuple19[1]
			if (__goscriptShadow15 != null) {
				await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
				return $.interfaceValue<$.GoError>(new __goscript_common.CertificateVerificationError({UnverifiedCertificates: certs, Err: __goscriptShadow15}), "*tls.CertificateVerificationError", { kind: $.TypeKind.Pointer, elemType: "tls.CertificateVerificationError" })
			}
		}

		$.pointerValue<Conn>(c).peerCertificates = certs
		$.pointerValue<Conn>(c).ocspResponse = certificate.OCSPStaple
		$.pointerValue<Conn>(c).scts = certificate.SignedCertificateTimestamps

		if ($.len(certs) > 0) {
			{
				const __goscriptTypeSwitchValue = $.pointerValue<x509.Certificate>($.arrayIndex(certs!, 0)).PublicKey
				switch (true) {
					case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }):
						{
						}
						break
					default:
						{
							await Conn.prototype.sendAlert.call(c, $.uint(43, 8))
							return fmt.Errorf("tls: client certificate contains an unsupported public key of type %T", $.pointerValue<x509.Certificate>($.arrayIndex(certs!, 0)).PublicKey)
						}
						break
				}
			}
		}

		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).VerifyPeerCertificate != null) {
			{
				let __goscriptShadow17 = await $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).VerifyPeerCertificate!(certificates, $.pointerValue<Conn>(c).verifiedChains)
				if (__goscriptShadow17 != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return __goscriptShadow17
				}
			}
		}

		return null
	}

	public async processECHClientHello(outer: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, echKeys: $.Slice<__goscript_common.EncryptedClientHelloKey>): globalThis.Promise<[__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, __goscript_handshake_server_tls13.echServerContext | $.VarRef<__goscript_handshake_server_tls13.echServerContext> | null, $.GoError]> {
		let c: Conn | $.VarRef<Conn> | null = this
		let __goscriptTuple20: any = __goscript_ech.parseECHExt($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(outer).encryptedClientHello)
		let echType = $.uint(__goscriptTuple20[0], 8)
		let echCiphersuite = __goscriptTuple20[1]
		let configID = $.uint(__goscriptTuple20[2], 8)
		let encap: $.Slice<number> = __goscriptTuple20[3]
		let payload: $.Slice<number> = __goscriptTuple20[4]
		let err = __goscriptTuple20[5]
		if (err != null) {
			if (errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil(__goscript_ech.errInvalidECHExt)!)) {
				await Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			} else {
				await Conn.prototype.sendAlert.call(c, $.uint(50, 8))
			}

			return [null, null, __goscript_ech.errInvalidECHExt]
		}

		if ($.uint(echType, 8) == $.uint(1, 8)) {
			return [outer, new __goscript_handshake_server_tls13.echServerContext({inner: true}), null]
		}

		if ($.len(echKeys) == 0) {
			return [outer, null, null]
		}

		for (let __goscriptRangeTarget7 = echKeys, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget7); __rangeIndex++) {
			let echKey = __goscriptRangeTarget7![__rangeIndex]
			let [skip, config, __goscriptShadow18] = __goscript_ech.parseECHConfig(echKey.Config)
			if ((__goscriptShadow18 != null) || skip) {
				await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return [null, null, fmt.Errorf("tls: invalid EncryptedClientHelloKey Config: %s", (__goscriptShadow18 as any))]
			}
			if (skip) {
				continue
			}
			let __goscriptTuple21: any = hpke.NewKEM($.uint(config.KemID, 16))
			let kem = __goscriptTuple21[0]
			__goscriptShadow18 = __goscriptTuple21[1]
			if (__goscriptShadow18 != null) {
				await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return [null, null, fmt.Errorf("tls: invalid EncryptedClientHelloKey Config KEM: %s", (__goscriptShadow18 as any))]
			}
			let __goscriptTuple22: any = await $.pointerValue<Exclude<hpke.KEM, null>>(kem).NewPrivateKey(echKey.PrivateKey)
			let echPriv = __goscriptTuple22[0]
			__goscriptShadow18 = __goscriptTuple22[1]
			if (__goscriptShadow18 != null) {
				await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return [null, null, fmt.Errorf("tls: invalid EncryptedClientHelloKey PrivateKey: %s", (__goscriptShadow18 as any))]
			}
			let __goscriptTuple23: any = hpke.NewKDF($.uint(echCiphersuite.KDFID, 16))
			let kdf = __goscriptTuple23[0]
			__goscriptShadow18 = __goscriptTuple23[1]
			if (__goscriptShadow18 != null) {
				await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return [null, null, fmt.Errorf("tls: invalid EncryptedClientHelloKey Config KDF: %s", (__goscriptShadow18 as any))]
			}
			let __goscriptTuple24: any = hpke.NewAEAD($.uint(echCiphersuite.AEADID, 16))
			let __goscriptShadow19 = __goscriptTuple24[0]
			__goscriptShadow18 = __goscriptTuple24[1]
			if (__goscriptShadow18 != null) {
				await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return [null, null, fmt.Errorf("tls: invalid EncryptedClientHelloKey Config AEAD: %s", (__goscriptShadow18 as any))]
			}
			let info: $.Slice<number> = $.appendSlice(new Uint8Array([116, 108, 115, 32, 101, 99, 104, 0]), echKey.Config, $.byteSliceHint)
			let __goscriptTuple25: any = await hpke.NewRecipient(encap, echPriv, kdf, __goscriptShadow19, info)
			let hpkeContext: hpke.Recipient | $.VarRef<hpke.Recipient> | null = __goscriptTuple25[0]
			__goscriptShadow18 = __goscriptTuple25[1]
			if (__goscriptShadow18 != null) {

				continue
			}

			let __goscriptTuple26: any = await __goscript_ech.decryptECHPayload(hpkeContext, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(outer).original, payload)
			let encodedInner: $.Slice<number> = __goscriptTuple26[0]
			__goscriptShadow18 = __goscriptTuple26[1]
			if (__goscriptShadow18 != null) {

				continue
			}

			// This function modifies c.rawInput, which owns the c.input memory.
			let __goscriptTuple27: any = await __goscript_ech.decodeInnerClientHello(outer, encodedInner)
			let echInner: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = __goscriptTuple27[0]
			__goscriptShadow18 = __goscriptTuple27[1]
			if (__goscriptShadow18 != null) {
				await Conn.prototype.sendAlert.call(c, $.uint(47, 8))
				return [null, null, __goscript_ech.errInvalidECHExt]
			}

			$.pointerValue<Conn>(c).echAccepted = true

			return [echInner, new __goscript_handshake_server_tls13.echServerContext({hpkeContext: hpkeContext, configID: $.uint(configID, 8), ciphersuite: $.markAsStructValue($.cloneStructValue(echCiphersuite))}), null]
		}

		return [outer, null, null]
	}

	public async quicGetTransportParameters(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		let c: Conn | $.VarRef<Conn> | null = this
		if ($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).transportParams == null) {
			$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 5})))
		}
		while ($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).transportParams == null) {
			{
				let err = await Conn.prototype.quicWaitForSignal.call(c)
				if (err != null) {
					return [null, err]
				}
			}
		}
		return [$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).transportParams, null]
	}

	public quicHandshakeComplete(): void {
		let c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 7})))
	}

	public async quicReadHandshakeBytes(n: number): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		while ($.pointerValue<Conn>(c).hand.Len() < n) {
			{
				let err = await Conn.prototype.quicWaitForSignal.call(c)
				if (err != null) {
					return err
				}
			}
		}
		return null
	}

	public quicRejectedEarlyData(): void {
		let c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 6})))
	}

	public async quicResumeSession(session: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 8, SessionState: session})))
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).waitingForDrain = true
		while ($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).waitingForDrain) {
			{
				let err = await Conn.prototype.quicWaitForSignal.call(c)
				if (err != null) {
					return err
				}
			}
		}
		return null
	}

	public async quicSetReadSecret(level: __goscript_quic.QUICEncryptionLevel, suite: number, secret: $.Slice<number>): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this

		if ($.pointerValue<Conn>(c).hand.Len() != 0) {
			await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return errors.New("tls: handshake buffer not empty before setting read traffic secret")
		}
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 1, Level: level, Suite: $.uint(suite, 16), Data: secret})))
		return null
	}

	public quicSetTransportParameters(params: $.Slice<number>): void {
		let c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 4, Data: params})))
	}

	public quicSetWriteSecret(level: __goscript_quic.QUICEncryptionLevel, suite: number, secret: $.Slice<number>): void {
		let c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 2, Level: level, Suite: $.uint(suite, 16), Data: secret})))
	}

	public quicStoreSession(session: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null): void {
		let c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 9, SessionState: session})))
	}

	public async quicWaitForSignal(): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		await using __defer = new $.AsyncDisposableStack()

		$.pointerValue<Conn>(c).handshakeMutex.Unlock()
		__defer.defer(async () => { await $.pointerValue<Conn>(c).handshakeMutex.Lock() })

		await $.chanSend($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).blockedc, {})

		await $.chanSend($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).signalc, {})
		if (await $.pointerValue<Exclude<context2.Context, null>>($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).ctx).Err() != null) {
			// Encrypt the actual ContentType and replace the plaintext one.
			return await Conn.prototype.sendAlertLocked.call(c, $.uint(0, 8))
		}
		$.pointerValue<Conn>(c).hand.Write($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).readbuf)
		$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).readbuf = null
		return null
	}

	public quicWriteCryptoData(level: __goscript_quic.QUICEncryptionLevel, data: $.Slice<number>): void {
		let c: Conn | $.VarRef<Conn> | null = this
		let last: __goscript_quic.QUICEvent | $.VarRef<__goscript_quic.QUICEvent> | null = null as __goscript_quic.QUICEvent | $.VarRef<__goscript_quic.QUICEvent> | null
		if ($.len($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events) > 0) {
			last = $.indexRef($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events!, $.len($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events) - 1)
		}
		if (((last == null) || ($.pointerValue<__goscript_quic.QUICEvent>(last).Kind != 3)) || ($.pointerValue<__goscript_quic.QUICEvent>(last).Level != level)) {
			$.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events = $.append($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events, $.markAsStructValue(new __goscript_quic.QUICEvent({Kind: 3, Level: level})))
			last = $.indexRef($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events!, $.len($.pointerValue<__goscript_quic.quicState>($.pointerValue<Conn>(c).quic).events) - 1)
		}
		$.pointerValue<__goscript_quic.QUICEvent>(last).Data = $.appendSlice($.pointerValue<__goscript_quic.QUICEvent>(last).Data, data, $.byteSliceHint)
	}

	public async readChangeCipherSpec(): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		return Conn.prototype.readRecordOrCCS.call(c, true)
	}

	public async readClientHello(ctx: context2.Context | null): globalThis.Promise<[__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, __goscript_handshake_server_tls13.echServerContext | $.VarRef<__goscript_handshake_server_tls13.echServerContext> | null, $.GoError]> {
		let c: Conn | $.VarRef<Conn> | null = this
		// RemoteAddr returns the remote network address.

		let [msg, err] = await Conn.prototype.readHandshake.call(c, null)
		if (err != null) {
			return [null, null, err]
		}
		let __goscriptTuple28: any = $.typeAssertTuple<__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null>(msg, { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" })
		let clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = __goscriptTuple28[0]
		let ok = __goscriptTuple28[1]
		if (!ok) {
			await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return [null, null, __goscript_common.unexpectedMessageError($.interfaceValue<any>(clientHello, "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" }), msg)]
		}

		// SetReadDeadline sets the read deadline on the underlying connection.
		// A zero value for t means [Conn.Read] will not time out.
		let ech: __goscript_handshake_server_tls13.echServerContext | $.VarRef<__goscript_handshake_server_tls13.echServerContext> | null = null as __goscript_handshake_server_tls13.echServerContext | $.VarRef<__goscript_handshake_server_tls13.echServerContext> | null
		if ($.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).encryptedClientHello) != 0) {
			let echKeys: $.Slice<__goscript_common.EncryptedClientHelloKey> = $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).EncryptedClientHelloKeys
			if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).GetEncryptedClientHelloKeys != null) {
				let __goscriptTuple29: any = await $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).GetEncryptedClientHelloKeys!(__goscript_handshake_server.clientHelloInfo(ctx, c, clientHello))
				echKeys = __goscriptTuple29[0]
				err = __goscriptTuple29[1]
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return [null, null, err]
				}
			}
			let __goscriptTuple30: any = await Conn.prototype.processECHClientHello.call(c, clientHello, echKeys)
			clientHello = __goscriptTuple30[0]
			ech = __goscriptTuple30[1]
			err = __goscriptTuple30[2]
			if (err != null) {
				return [null, null, err]
			}
		}

		let configForClient: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null = null as __goscript_common.Config | $.VarRef<__goscript_common.Config> | null
		let originalConfig: __goscript_common.Config | $.VarRef<__goscript_common.Config> | null = $.pointerValue<Conn>(c).config
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).GetConfigForClient != null) {
			let chi: __goscript_common.ClientHelloInfo | $.VarRef<__goscript_common.ClientHelloInfo> | null = __goscript_handshake_server.clientHelloInfo(ctx, c, clientHello)
			{
				let __goscriptTuple31: any = await $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).GetConfigForClient!(chi)
				configForClient = __goscriptTuple31[0]
				err = __goscriptTuple31[1]
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
					return [null, null, err]
				} else {
					if (configForClient != null) {
						$.pointerValue<Conn>(c).config = configForClient
					}
				}
			}
		}
		$.pointerValue<Conn>(c).ticketKeys = await __goscript_common.Config.prototype.ticketKeys.call(originalConfig, configForClient)

		let clientVersions: $.Slice<number> = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).supportedVersions
		if (($.uint($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).vers, 16) >= $.uint(772, 16)) && ($.len(clientVersions) == 0)) {
			// next encryption state
			// next MAC algorithm

			// current QUIC encryption level
			// current TLS 1.3 traffic secret

			clientVersions = __goscript_common.supportedVersionsFromMax($.uint(771, 16))
		} else {
			if ($.len(clientVersions) == 0) {
				clientVersions = __goscript_common.supportedVersionsFromMax($.uint($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(clientHello).vers, 16))
			}
		}
		let __goscriptTuple32: any = __goscript_common.Config.prototype.mutualVersion.call($.pointerValue<Conn>(c).config, false, clientVersions)
		$.pointerValue<Conn>(c).vers = $.uint(__goscriptTuple32[0], 16)
		ok = __goscriptTuple32[1]
		if (!ok) {
			await Conn.prototype.sendAlert.call(c, $.uint(70, 8))
			return [null, null, fmt.Errorf("tls: client offered only unsupported versions: %x", $.interfaceValue<any>(clientVersions, "[]uint16", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }))]
		}
		$.pointerValue<Conn>(c).haveVers = true
		$.pointerValue<Conn>(c)._in.version = $.uint($.pointerValue<Conn>(c).vers, 16)
		$.pointerValue<Conn>(c).out.version = $.uint($.pointerValue<Conn>(c).vers, 16)

		if (($.uint($.pointerValue<Conn>(c).vers, 16) != $.uint(772, 16)) && ((ech != null) && !$.pointerValue<__goscript_handshake_server_tls13.echServerContext>(ech).inner)) {
			await Conn.prototype.sendAlert.call(c, $.uint(47, 8))
			return [null, null, errors.New("tls: Encrypted Client Hello cannot be used pre-TLS 1.3")]
		}

		if (($.uint($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).MinVersion, 16) == $.uint(0, 16)) && ($.uint($.pointerValue<Conn>(c).vers, 16) < $.uint(771, 16))) {
			godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_common.tls10server))
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(__goscript_common.tls10server))
		}

		return [clientHello, ech, null]
	}

	public async readFromUntil(r: io.Reader | null, n: number): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		if ($.pointerValue<Conn>(c).rawInput.Len() >= n) {
			return null
		}
		let needs = n - $.pointerValue<Conn>(c).rawInput.Len()
		// There might be extra input waiting on the wire. Make a best effort
		// attempt to fetch it so that it can be used in (*Conn).Read to
		// "predict" closeNotify alerts.
		$.pointerValue<Conn>(c).rawInput.Grow(needs + bytes.MinRead)
		let [, err] = await $.pointerValue<Conn>(c).rawInput.ReadFrom($.pointerValueOrNil($.interfaceValue<io.Reader | null>(new atLeastReader({R: r, N: $.int64(needs)}), "*tls.atLeastReader", { kind: $.TypeKind.Pointer, elemType: "tls.atLeastReader" }))!)
		return err
	}

	public async readHandshake(transcript: __goscript_handshake_messages.transcriptHash | null): globalThis.Promise<[any, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		{
			let err = await Conn.prototype.readHandshakeBytes.call(c, 4)
			if (err != null) {
				return [null, err]
			}
		}
		let data: $.Slice<number> = $.pointerValue<Conn>(c).hand.Bytes()

		let maxHandshakeSize = 65536
		// hasVers indicates we're past the first message, forcing someone trying to
		// make us just allocate a large buffer to at least do the initial part of
		// the handshake first.
		if ($.pointerValue<Conn>(c).haveVers && ($.uint($.arrayIndex(data!, 0), 8) == $.uint(11, 8))) {
			// Since certificate messages are likely to be the only messages that
			// can be larger than maxHandshake, we use a special limit for just
			// those messages.
			maxHandshakeSize = 262144
		}

		let n = (($.int($.arrayIndex(data!, 1)) << 16) | ($.int($.arrayIndex(data!, 2)) << 8)) | $.int($.arrayIndex(data!, 3))
		if (n > maxHandshakeSize) {
			await Conn.prototype.sendAlertLocked.call(c, $.uint(80, 8))
			return [null, $.pointerValue<Conn>(c)._in.setErrorLocked(fmt.Errorf("tls: handshake message of length %d bytes exceeds maximum of %d bytes", $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(maxHandshakeSize, "int", {}, { kind: $.TypeKind.Basic, name: "int" })))]
		}
		{
			let err = await Conn.prototype.readHandshakeBytes.call(c, 4 + n)
			if (err != null) {
				return [null, err]
			}
		}
		data = $.pointerValue<Conn>(c).hand.Next(4 + n)
		const __goscriptReturn17 = await Conn.prototype.unmarshalHandshakeMessage.call(c, data, transcript)
		return [(__goscriptReturn17[0] as any), __goscriptReturn17[1]]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async readHandshakeBytes(n: number): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		if ($.pointerValue<Conn>(c).quic != null) {
			return Conn.prototype.quicReadHandshakeBytes.call(c, n)
		}
		while ($.pointerValue<Conn>(c).hand.Len() < n) {
			{
				let err = await Conn.prototype.readRecord.call(c)
				if (err != null) {
					return err
				}
			}
		}
		return null
	}

	public async readRecord(): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		return Conn.prototype.readRecordOrCCS.call(c, false)
	}

	public async readRecordOrCCS(expectChangeCipherSpec: boolean): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		if ($.pointerValue<Conn>(c)._in.err != null) {
			return $.pointerValue<Conn>(c)._in.err
		}
		let handshakeComplete = $.pointerValue<Conn>(c).isHandshakeComplete.Load()

		// This function modifies c.rawInput, which owns the c.input memory.
		if ($.pointerValue<Conn>(c).input.Len() != 0) {
			return $.pointerValue<Conn>(c)._in.setErrorLocked(errors.New("tls: internal error: attempted to read record with pending application data"))
		}
		$.pointerValue<Conn>(c).input.Reset(null)

		if ($.pointerValue<Conn>(c).quic != null) {
			return $.pointerValue<Conn>(c)._in.setErrorLocked(errors.New("tls: internal error: attempted to read record with QUIC transport"))
		}

		// Read header, payload.
		{
			let err = await Conn.prototype.readFromUntil.call(c, ($.pointerValue<Conn>(c).conn as io.Reader | null), 5)
			if (err != null) {
				// RFC 8446, Section 6.1 suggests that EOF without an alertCloseNotify
				// is an error, but popular web sites seem to do this, so we accept it
				// if and only if at the record boundary.
				if (($.comparableEqual(err, io.ErrUnexpectedEOF)) && ($.pointerValue<Conn>(c).rawInput.Len() == 0)) {
					err = io.EOF
				}
				{
					let [e, ok] = $.typeAssertTuple<net.Error | null>(err, "net.Error")
					if (!ok || !await $.pointerValue<Exclude<net.Error, null>>(e).Temporary()) {
						$.pointerValue<Conn>(c)._in.setErrorLocked(err)
					}
				}
				return err
			}
		}
		let hdr: $.Slice<number> = $.goSlice($.pointerValue<Conn>(c).rawInput.Bytes(), undefined, 5)
		let typ = $.uint($.uint($.arrayIndex(hdr!, 0), 8), 8)

		// No valid TLS record has a type of 0x80, however SSLv2 handshakes
		// start with a uint16 length where the MSB is set and the first record
		// is always < 256 bytes long. Therefore typ == 0x80 strongly suggests
		// an SSLv2 client.
		if (!handshakeComplete && ($.uint(typ, 8) == $.uint(0x80, 8))) {
			await Conn.prototype.sendAlert.call(c, $.uint(70, 8))
			return $.pointerValue<Conn>(c)._in.setErrorLocked($.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(Conn.prototype.newRecordHeaderError.call(c, null, "unsupported SSLv2 handshake received"))), "tls.RecordHeaderError", "tls.RecordHeaderError"))
		}

		let vers = $.uint(($.uint($.arrayIndex(hdr!, 1), 16) << 8) | $.uint($.arrayIndex(hdr!, 2), 16), 16)
		let expectedVers = $.uint($.pointerValue<Conn>(c).vers, 16)
		if ($.uint(expectedVers, 16) == $.uint(772, 16)) {
			// All TLS 1.3 records are expected to have 0x0303 (1.2) after
			// the initial hello (RFC 8446 Section 5.1).
			expectedVers = $.uint(771, 16)
		}
		let n = ($.int($.arrayIndex(hdr!, 3)) << 8) | $.int($.arrayIndex(hdr!, 4))
		if ($.pointerValue<Conn>(c).haveVers && ($.uint(vers, 16) != $.uint(expectedVers, 16))) {
			await Conn.prototype.sendAlert.call(c, $.uint(70, 8))
			let msg = await fmt.Sprintf("received record with version %x when expecting version %x", $.namedValueInterfaceValue<any>(vers, "uint16", {}, { kind: $.TypeKind.Basic, name: "uint16" }), $.namedValueInterfaceValue<any>(expectedVers, "uint16", {}, { kind: $.TypeKind.Basic, name: "uint16" }))
			return $.pointerValue<Conn>(c)._in.setErrorLocked($.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(Conn.prototype.newRecordHeaderError.call(c, null, msg))), "tls.RecordHeaderError", "tls.RecordHeaderError"))
		}
		if (!$.pointerValue<Conn>(c).haveVers) {
			// First message, be extra suspicious: this might not be a TLS
			// client. Bail out before reading a full 'body', if possible.
			// The current max version is 3.3 so if the version is >= 16.0,
			// it's probably not real.
			if ((($.uint(typ, 8) != $.uint(21, 8)) && ($.uint(typ, 8) != $.uint(22, 8))) || ($.uint(vers, 16) >= $.uint(0x1000, 16))) {
				return $.pointerValue<Conn>(c)._in.setErrorLocked($.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(Conn.prototype.newRecordHeaderError.call(c, $.pointerValue<Conn>(c).conn, "first record does not look like a TLS handshake"))), "tls.RecordHeaderError", "tls.RecordHeaderError"))
			}
		}
		if ((($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) && (n > 16640)) || (n > 18432)) {
			await Conn.prototype.sendAlert.call(c, $.uint(22, 8))
			let msg = await fmt.Sprintf("oversized record received with length %d", $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
			return $.pointerValue<Conn>(c)._in.setErrorLocked($.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(Conn.prototype.newRecordHeaderError.call(c, null, msg))), "tls.RecordHeaderError", "tls.RecordHeaderError"))
		}
		{
			let err = await Conn.prototype.readFromUntil.call(c, ($.pointerValue<Conn>(c).conn as io.Reader | null), 5 + n)
			if (err != null) {
				{
					let [e, ok] = $.typeAssertTuple<net.Error | null>(err, "net.Error")
					if (!ok || !await $.pointerValue<Exclude<net.Error, null>>(e).Temporary()) {
						$.pointerValue<Conn>(c)._in.setErrorLocked(err)
					}
				}
				return err
			}
		}

		// Process message.
		let record: $.Slice<number> = $.pointerValue<Conn>(c).rawInput.Next(5 + n)
		let __goscriptTuple33: any = await $.pointerValue<Conn>(c)._in.decrypt(record)
		let data: $.Slice<number> = __goscriptTuple33[0]
		typ = $.uint(__goscriptTuple33[1], 8)
		let err = __goscriptTuple33[2]
		if (err != null) {
			return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint($.mustTypeAssert<__goscript_alert.alert>(err, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" }), 8)))
		}
		if ($.len(data) > 16384) {
			return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(22, 8)))
		}

		// Application Data messages are always protected.
		if (($.pointerValue<Conn>(c)._in.cipher == null) && ($.uint(typ, 8) == $.uint(23, 8))) {
			return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
		}

		if ((($.uint(typ, 8) != $.uint(21, 8)) && ($.uint(typ, 8) != $.uint(20, 8))) && ($.len(data) > 0)) {
			// This is a state-advancing message: reset the retry count.
			$.pointerValue<Conn>(c).retryCount = 0
		}

		// Handshake messages MUST NOT be interleaved with other record types in TLS 1.3.
		if ((($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) && ($.uint(typ, 8) != $.uint(22, 8))) && ($.pointerValue<Conn>(c).hand.Len() > 0)) {
			return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
		}

		switch (typ) {
			default:
			{
				return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
				break
			}
			case 21:
			{
				if ($.pointerValue<Conn>(c).quic != null) {
					return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
				}
				if ($.len(data) != 2) {
					return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
				}
				if ($.uint($.uint($.arrayIndex(data!, 1), 8), 8) == $.uint(0, 8)) {
					return $.pointerValue<Conn>(c)._in.setErrorLocked(io.EOF)
				}
				if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
					// TLS 1.3 removed warning-level alerts except for alertUserCanceled
					// (RFC 8446, § 6.1). Since at least one major implementation
					// (https://bugs.openjdk.org/browse/JDK-8323517) misuses this alert,
					// many TLS stacks now ignore it outright when seen in a TLS 1.3
					// handshake (e.g. BoringSSL, NSS, Rustls).
					if ($.uint($.uint($.arrayIndex(data!, 1), 8), 8) == $.uint(90, 8)) {
						// Like TLS 1.2 alertLevelWarning alerts, we drop the record and retry.
						return Conn.prototype.retryReadRecord.call(c, expectChangeCipherSpec)
					}
					return $.pointerValue<Conn>(c)._in.setErrorLocked($.interfaceValue<$.GoError>(new net.OpError({Op: "remote error", Err: $.namedValueInterfaceValue<$.GoError>($.uint($.arrayIndex(data!, 1), 8), "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })}), "*net.OpError", { kind: $.TypeKind.Pointer, elemType: "net.OpError" }))
				}
				switch ($.arrayIndex(data!, 0)) {
					case 1:
					{
						return Conn.prototype.retryReadRecord.call(c, expectChangeCipherSpec)
						break
					}
					case 2:
					{
						return $.pointerValue<Conn>(c)._in.setErrorLocked($.interfaceValue<$.GoError>(new net.OpError({Op: "remote error", Err: $.namedValueInterfaceValue<$.GoError>($.uint($.arrayIndex(data!, 1), 8), "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })}), "*net.OpError", { kind: $.TypeKind.Pointer, elemType: "net.OpError" }))
						break
					}
					default:
					{
						return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
						break
					}
				}
				break
			}
			case 20:
			{
				if (($.len(data) != 1) || ($.uint($.arrayIndex(data!, 0), 8) != $.uint(1, 8))) {
					return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(50, 8)))
				}
				// Handshake messages are not allowed to fragment across the CCS.
				if ($.pointerValue<Conn>(c).hand.Len() > 0) {
					return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
				}
				// In TLS 1.3, change_cipher_spec records are ignored until the
				// Finished. See RFC 8446, Appendix D.4. Note that according to Section
				// 5, a server can send a ChangeCipherSpec before its ServerHello, when
				// c.vers is still unset. That's not useful though and suspicious if the
				// server then selects a lower protocol version, so don't allow that.
				if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
					return Conn.prototype.retryReadRecord.call(c, expectChangeCipherSpec)
				}
				if (!expectChangeCipherSpec) {
					return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
				}
				{
					let __goscriptShadow20 = $.pointerValue<Conn>(c)._in.changeCipherSpec()
					if (__goscriptShadow20 != null) {
						return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint($.mustTypeAssert<__goscript_alert.alert>(__goscriptShadow20, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" }), 8)))
					}
				}
				break
			}
			case 23:
			{
				if (!handshakeComplete || expectChangeCipherSpec) {
					return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
				}
				// Some OpenSSL servers send empty records in order to randomize the
				// CBC IV. Ignore a limited number of empty records.
				if ($.len(data) == 0) {
					return Conn.prototype.retryReadRecord.call(c, expectChangeCipherSpec)
				}
				// Note that data is owned by c.rawInput, following the Next call above,
				// to avoid copying the plaintext. This is safe because c.rawInput is
				// not read from or written to until c.input is drained.
				$.pointerValue<Conn>(c).input.Reset(data)
				break
			}
			case 22:
			{
				if (($.len(data) == 0) || expectChangeCipherSpec) {
					return $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))
				}
				$.pointerValue<Conn>(c).hand.Write(data)
				break
			}
		}

		return null
	}

	public async retryReadRecord(expectChangeCipherSpec: boolean): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<Conn>(c).retryCount++
		if ($.pointerValue<Conn>(c).retryCount > 16) {
			await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			return $.pointerValue<Conn>(c)._in.setErrorLocked(errors.New("tls: too many ignored records"))
		}
		return Conn.prototype.readRecordOrCCS.call(c, expectChangeCipherSpec)
	}

	public async sendAlert(err: __goscript_alert.alert): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Conn>(c).out.Mutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).out.Mutex.Unlock() })
		return await Conn.prototype.sendAlertLocked.call(c, $.uint(err, 8))
	}

	public async sendAlertLocked(err: __goscript_alert.alert): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		if ($.pointerValue<Conn>(c).quic != null) {
			return $.pointerValue<Conn>(c).out.setErrorLocked($.interfaceValue<$.GoError>(new net.OpError({Op: "local error", Err: $.namedValueInterfaceValue<$.GoError>(err, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })}), "*net.OpError", { kind: $.TypeKind.Pointer, elemType: "net.OpError" }))
		}

		switch (err) {
			case 100:
			case 0:
			{
				$.pointerValue<Conn>(c).tmp[0] = $.uint(1, 8)
				break
			}
			default:
			{
				$.pointerValue<Conn>(c).tmp[0] = $.uint(2, 8)
				break
			}
		}
		$.pointerValue<Conn>(c).tmp[1] = $.uint($.uint(err, 8), 8)

		let [, writeErr] = await Conn.prototype.writeRecordLocked.call(c, $.uint(21, 8), $.goSlice($.pointerValue<Conn>(c).tmp, 0, 2))
		if ($.uint(err, 8) == $.uint(0, 8)) {
			// closeNotify is a special case in that it isn't an error.
			return writeErr
		}

		return $.pointerValue<Conn>(c).out.setErrorLocked($.interfaceValue<$.GoError>(new net.OpError({Op: "local error", Err: $.namedValueInterfaceValue<$.GoError>(err, "tls.alert", {"Error": __goscript_alert.alert_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" })}), "*net.OpError", { kind: $.TypeKind.Pointer, elemType: "net.OpError" }))
	}

	public async sendSessionTicket(earlyData: boolean, extra: $.Slice<$.Slice<number>>): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		let suite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null = __goscript_cipher_suites.cipherSuiteTLS13ByID($.uint($.pointerValue<Conn>(c).cipherSuite, 16))
		if (suite == null) {
			return errors.New("tls: internal error: unknown cipher suite")
		}

		let psk: $.Slice<number> = await tls13.ExpandLabel(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(suite).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), $.pointerValue<Conn>(c).resumptionSecret, "resumption", null, crypto.Hash_Size($.pointerValue<__goscript_cipher_suites.cipherSuiteTLS13>(suite).hash))

		let m: __goscript_handshake_messages.newSessionTicketMsgTLS13 | $.VarRef<__goscript_handshake_messages.newSessionTicketMsgTLS13> | null = new __goscript_handshake_messages.newSessionTicketMsgTLS13()

		let state: __goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null = await Conn.prototype.sessionState.call(c)
		$.pointerValue<__goscript_ticket.SessionState>(state).secret = psk
		$.pointerValue<__goscript_ticket.SessionState>(state).EarlyData = earlyData
		$.pointerValue<__goscript_ticket.SessionState>(state).Extra = extra
		if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).WrapSession != null) {
			let err: $.GoError = null as $.GoError
			let __goscriptTuple34: any = await $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).WrapSession!($.markAsStructValue($.cloneStructValue(Conn.prototype.connectionStateLocked.call(c))), state)
			$.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(m).label = __goscriptTuple34[0]
			err = __goscriptTuple34[1]
			if (err != null) {
				return err
			}
		} else {
			let __goscriptTuple35: any = await __goscript_ticket.SessionState.prototype.Bytes.call(state)
			let stateBytes: $.Slice<number> = __goscriptTuple35[0]
			let err = __goscriptTuple35[1]
			if (err != null) {
				await Conn.prototype.sendAlert.call(c, $.uint(80, 8))
				return err
			}
			let __goscriptTuple36: any = await __goscript_common.Config.prototype.encryptTicket.call($.pointerValue<Conn>(c).config, stateBytes, $.pointerValue<Conn>(c).ticketKeys)
			$.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(m).label = __goscriptTuple36[0]
			err = __goscriptTuple36[1]
			if (err != null) {
				return err
			}
		}
		$.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(m).lifetime = $.uint($.uint($.int64Div(604800000000000n, 1000000000n), 32), 32)

		let ageAdd: $.Slice<number> = $.makeSlice<number>(4, undefined, "byte")
		{
			let [, err] = await $.pointerValue<Exclude<io.Reader, null>>(__goscript_common.Config.prototype.rand.call($.pointerValue<Conn>(c).config)).Read(ageAdd)
			if (err != null) {
				return err
			}
		}
		$.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(m).ageAdd = $.uint(byteorder.LEUint32(ageAdd), 32)

		if (earlyData) {

			$.pointerValue<__goscript_handshake_messages.newSessionTicketMsgTLS13>(m).maxEarlyData = $.uint(0xffffffff, 32)
		}

		{
			let [, err] = await Conn.prototype.writeHandshakeRecord.call(c, $.interfaceValue<__goscript_common.handshakeMessage | null>(m, "*tls.newSessionTicketMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsgTLS13" }), null)
			if (err != null) {
				return err
			}
		}

		return null
	}

	public async serverHandshake(ctx: context2.Context | null): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		let __goscriptTuple37: any = await Conn.prototype.readClientHello.call(c, ctx)
		let clientHello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = __goscriptTuple37[0]
		let ech: __goscript_handshake_server_tls13.echServerContext | $.VarRef<__goscript_handshake_server_tls13.echServerContext> | null = __goscriptTuple37[1]
		let err = __goscriptTuple37[2]
		if (err != null) {
			return err
		}

		if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
			let hs = $.varRef($.markAsStructValue(new __goscript_handshake_server_tls13.serverHandshakeStateTLS13({c: c, ctx: ctx, clientHello: clientHello, echContext: ech})))
			return hs.value.handshake()
		}

		let hs = $.varRef($.markAsStructValue(new __goscript_handshake_server.serverHandshakeState({c: c, ctx: ctx, clientHello: clientHello})))
		return hs.value.handshake()
	}

	public async sessionState(): globalThis.Promise<__goscript_ticket.SessionState | $.VarRef<__goscript_ticket.SessionState> | null> {
		const c: Conn | $.VarRef<Conn> | null = this
		return (await (async () => { const __goscriptLiteralField7 = $.uint64($.markAsStructValue($.cloneStructValue((await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config)))).Unix()); return new __goscript_ticket.SessionState({version: $.uint($.pointerValue<Conn>(c).vers, 16), cipherSuite: $.uint($.pointerValue<Conn>(c).cipherSuite, 16), createdAt: __goscriptLiteralField7, alpnProtocol: $.pointerValue<Conn>(c).clientProtocol, peerCertificates: $.pointerValue<Conn>(c).peerCertificates, ocspResponse: $.pointerValue<Conn>(c).ocspResponse, scts: $.pointerValue<Conn>(c).scts, isClient: $.pointerValue<Conn>(c).isClient, extMasterSecret: $.pointerValue<Conn>(c).extMasterSecret, verifiedChains: $.pointerValue<Conn>(c).verifiedChains, curveID: $.uint($.pointerValue<Conn>(c).curveID, 16)}) })())
	}

	public async setReadTrafficSecret(suite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null, level: __goscript_quic.QUICEncryptionLevel, secret: $.Slice<number>, locked: boolean): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		// Ensure that there are no buffered handshake messages before changing the
		// read keys, since that can cause messages to be parsed that were encrypted
		// using old keys which are no longer appropriate.
		if ($.pointerValue<Conn>(c).hand.Len() != 0) {
			if (locked) {
				await Conn.prototype.sendAlertLocked.call(c, $.uint(10, 8))
			} else {
				await Conn.prototype.sendAlert.call(c, $.uint(10, 8))
			}
			return errors.New("tls: handshake buffer not empty before setting read traffic secret")
		}
		await $.pointerValue<Conn>(c)._in.setTrafficSecret(suite, level, secret)
		return null
	}

	public async setWriteTrafficSecret(suite: __goscript_cipher_suites.cipherSuiteTLS13 | $.VarRef<__goscript_cipher_suites.cipherSuiteTLS13> | null, level: __goscript_quic.QUICEncryptionLevel, secret: $.Slice<number>): globalThis.Promise<void> {
		const c: Conn | $.VarRef<Conn> | null = this
		await $.pointerValue<Conn>(c).out.setTrafficSecret(suite, level, secret)
	}

	public async unmarshalHandshakeMessage(data: $.Slice<number>, transcript: __goscript_handshake_messages.transcriptHash | null): globalThis.Promise<[__goscript_common.handshakeMessage | null, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		let m: __goscript_common.handshakeMessage | null = null as __goscript_common.handshakeMessage | null
		switch ($.arrayIndex(data!, 0)) {
			case 0:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.helloRequestMsg(), "*tls.helloRequestMsg", { kind: $.TypeKind.Pointer, elemType: "tls.helloRequestMsg" })
				break
			}
			case 1:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.clientHelloMsg(), "*tls.clientHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" })
				break
			}
			case 2:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.serverHelloMsg(), "*tls.serverHelloMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" })
				break
			}
			case 4:
			{
				if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
					m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.newSessionTicketMsgTLS13(), "*tls.newSessionTicketMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsgTLS13" })
				} else {
					m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.newSessionTicketMsg(), "*tls.newSessionTicketMsg", { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsg" })
				}
				break
			}
			case 11:
			{
				if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
					m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.certificateMsgTLS13(), "*tls.certificateMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsgTLS13" })
				} else {
					m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.certificateMsg(), "*tls.certificateMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateMsg" })
				}
				break
			}
			case 13:
			{
				if ($.uint($.pointerValue<Conn>(c).vers, 16) == $.uint(772, 16)) {
					m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.certificateRequestMsgTLS13(), "*tls.certificateRequestMsgTLS13", { kind: $.TypeKind.Pointer, elemType: "tls.certificateRequestMsgTLS13" })
				} else {
					m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.certificateRequestMsg({hasSignatureAlgorithm: $.uint($.pointerValue<Conn>(c).vers, 16) >= $.uint(771, 16)}), "*tls.certificateRequestMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateRequestMsg" })
				}
				break
			}
			case 22:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.certificateStatusMsg(), "*tls.certificateStatusMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateStatusMsg" })
				break
			}
			case 12:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.serverKeyExchangeMsg(), "*tls.serverKeyExchangeMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverKeyExchangeMsg" })
				break
			}
			case 14:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.serverHelloDoneMsg(), "*tls.serverHelloDoneMsg", { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloDoneMsg" })
				break
			}
			case 16:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.clientKeyExchangeMsg(), "*tls.clientKeyExchangeMsg", { kind: $.TypeKind.Pointer, elemType: "tls.clientKeyExchangeMsg" })
				break
			}
			case 15:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.certificateVerifyMsg({hasSignatureAlgorithm: $.uint($.pointerValue<Conn>(c).vers, 16) >= $.uint(771, 16)}), "*tls.certificateVerifyMsg", { kind: $.TypeKind.Pointer, elemType: "tls.certificateVerifyMsg" })
				break
			}
			case 20:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.finishedMsg(), "*tls.finishedMsg", { kind: $.TypeKind.Pointer, elemType: "tls.finishedMsg" })
				break
			}
			case 8:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.encryptedExtensionsMsg(), "*tls.encryptedExtensionsMsg", { kind: $.TypeKind.Pointer, elemType: "tls.encryptedExtensionsMsg" })
				break
			}
			case 5:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.endOfEarlyDataMsg(), "*tls.endOfEarlyDataMsg", { kind: $.TypeKind.Pointer, elemType: "tls.endOfEarlyDataMsg" })
				break
			}
			case 24:
			{
				m = $.interfaceValue<__goscript_common.handshakeMessage | null>(new __goscript_handshake_messages.keyUpdateMsg(), "*tls.keyUpdateMsg", { kind: $.TypeKind.Pointer, elemType: "tls.keyUpdateMsg" })
				break
			}
			default:
			{
				return [null, $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(10, 8)))]
				break
			}
		}

		// The handshake message unmarshalers
		// expect to be able to keep references to data,
		// so pass in a fresh copy that won't be overwritten.
		data = $.appendSlice<number>(null, data, $.byteSliceHint)

		if (!await $.pointerValue<Exclude<__goscript_common.handshakeMessage, null>>(m).unmarshal(data)) {
			return [null, $.pointerValue<Conn>(c)._in.setErrorLocked(await Conn.prototype.sendAlert.call(c, $.uint(50, 8)))]
		}

		if (transcript != null) {
			await $.pointerValue<Exclude<__goscript_handshake_messages.transcriptHash, null>>(transcript).Write(data)
		}

		return [m, null]
	}

	public async verifyServerCertificate(certificates: $.Slice<$.Slice<number>>): globalThis.Promise<$.GoError> {
		let c: Conn | $.VarRef<Conn> | null = this
		let certs: $.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null> = $.makeSlice<x509.Certificate | $.VarRef<x509.Certificate> | null>($.len(certificates))
		for (let __goscriptRangeTarget8 = certificates, i = 0; i < $.len(__goscriptRangeTarget8); i++) {
			let asn1Data = __goscriptRangeTarget8![i]
			let __goscriptTuple38: any = await __goscript_cache.weakCertCache.prototype.newCert.call(__goscript_cache.globalCertCache, asn1Data)
			let cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple38[0]
			let err = __goscriptTuple38[1]
			if (err != null) {
				await Conn.prototype.sendAlert.call(c, $.uint(50, 8))
				return errors.New("tls: failed to parse certificate from server: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			}
			if ($.pointerValue<x509.Certificate>(cert).PublicKeyAlgorithm == x509.RSA) {
				let n = big.Int.prototype.BitLen.call($.pointerValue<rsa.PublicKey>($.mustTypeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>($.pointerValue<x509.Certificate>(cert).PublicKey, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })).N)
				{
					let [max, ok] = __goscript_handshake_client.checkKeySize(n)
					if (!ok) {
						await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
						return fmt.Errorf("tls: server sent certificate containing RSA key larger than %d bits", $.namedValueInterfaceValue<any>(max, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
				}
			}
			certs![i] = cert
		}

		let echRejected = ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).EncryptedClientHelloConfigList != null) && !$.pointerValue<Conn>(c).echAccepted
		if (echRejected) {
			if ($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).EncryptedClientHelloRejectionVerify != null) {
				{
					let err = await $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).EncryptedClientHelloRejectionVerify!($.markAsStructValue($.cloneStructValue(Conn.prototype.connectionStateLocked.call(c))))
					if (err != null) {
						await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
						return err
					}
				}
			} else {
				let opts = (await (async () => { const __goscriptLiteralField8 = $.markAsStructValue($.cloneStructValue(await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config))); const __goscriptLiteralField9 = x509.NewCertPool(); return $.markAsStructValue(new x509.VerifyOptions({Roots: $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).RootCAs, CurrentTime: __goscriptLiteralField8, DNSName: $.pointerValue<Conn>(c).serverName, Intermediates: __goscriptLiteralField9})) })())

				for (let __goscriptRangeTarget9 = $.goSlice(certs, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
					let cert = __goscriptRangeTarget9![__rangeIndex]
					await x509.CertPool.prototype.AddCert.call(opts.Intermediates, cert)
				}
				let __goscriptTuple39: any = await x509.Certificate.prototype.Verify.call($.arrayIndex(certs!, 0), $.markAsStructValue($.cloneStructValue(opts)))
				let chains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>> = __goscriptTuple39[0]
				let err = __goscriptTuple39[1]
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return $.interfaceValue<$.GoError>(new __goscript_common.CertificateVerificationError({UnverifiedCertificates: certs, Err: err}), "*tls.CertificateVerificationError", { kind: $.TypeKind.Pointer, elemType: "tls.CertificateVerificationError" })
				}

				let __goscriptTuple40: any = await __goscript_common.fipsAllowedChains(chains)
				$.pointerValue<Conn>(c).verifiedChains = __goscriptTuple40[0]
				err = __goscriptTuple40[1]
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return $.interfaceValue<$.GoError>(new __goscript_common.CertificateVerificationError({UnverifiedCertificates: certs, Err: err}), "*tls.CertificateVerificationError", { kind: $.TypeKind.Pointer, elemType: "tls.CertificateVerificationError" })
				}
			}
		} else {
			if (!$.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).InsecureSkipVerify) {
				let opts = (await (async () => { const __goscriptLiteralField10 = $.markAsStructValue($.cloneStructValue(await __goscript_common.Config.prototype.time.call($.pointerValue<Conn>(c).config))); const __goscriptLiteralField11 = x509.NewCertPool(); return $.markAsStructValue(new x509.VerifyOptions({Roots: $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).RootCAs, CurrentTime: __goscriptLiteralField10, DNSName: $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).ServerName, Intermediates: __goscriptLiteralField11})) })())

				for (let __goscriptRangeTarget10 = $.goSlice(certs, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
					let cert = __goscriptRangeTarget10![__rangeIndex]
					await x509.CertPool.prototype.AddCert.call(opts.Intermediates, cert)
				}
				let __goscriptTuple41: any = await x509.Certificate.prototype.Verify.call($.arrayIndex(certs!, 0), $.markAsStructValue($.cloneStructValue(opts)))
				let chains: $.Slice<$.Slice<x509.Certificate | $.VarRef<x509.Certificate> | null>> = __goscriptTuple41[0]
				let err = __goscriptTuple41[1]
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return $.interfaceValue<$.GoError>(new __goscript_common.CertificateVerificationError({UnverifiedCertificates: certs, Err: err}), "*tls.CertificateVerificationError", { kind: $.TypeKind.Pointer, elemType: "tls.CertificateVerificationError" })
				}

				let __goscriptTuple42: any = await __goscript_common.fipsAllowedChains(chains)
				$.pointerValue<Conn>(c).verifiedChains = __goscriptTuple42[0]
				err = __goscriptTuple42[1]
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return $.interfaceValue<$.GoError>(new __goscript_common.CertificateVerificationError({UnverifiedCertificates: certs, Err: err}), "*tls.CertificateVerificationError", { kind: $.TypeKind.Pointer, elemType: "tls.CertificateVerificationError" })
				}
			}
		}

		{
			const __goscriptTypeSwitchValue = $.pointerValue<x509.Certificate>($.arrayIndex(certs!, 0)).PublicKey
			switch (true) {
				case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }):
					{
						break
					}
					break
				default:
					{
						await Conn.prototype.sendAlert.call(c, $.uint(43, 8))
						return fmt.Errorf("tls: server's certificate contains an unsupported type of public key: %T", $.pointerValue<x509.Certificate>($.arrayIndex(certs!, 0)).PublicKey)
					}
					break
			}
		}

		$.pointerValue<Conn>(c).peerCertificates = certs

		if (($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).VerifyPeerCertificate != null) && !echRejected) {
			{
				let err = await $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).VerifyPeerCertificate!(certificates, $.pointerValue<Conn>(c).verifiedChains)
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return err
				}
			}
		}

		if (($.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).VerifyConnection != null) && !echRejected) {
			{
				let err = await $.pointerValue<__goscript_common.Config>($.pointerValue<Conn>(c).config).VerifyConnection!($.markAsStructValue($.cloneStructValue(Conn.prototype.connectionStateLocked.call(c))))
				if (err != null) {
					await Conn.prototype.sendAlert.call(c, $.uint(42, 8))
					return err
				}
			}
		}

		return null
	}

	public async write(data: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let c: Conn | $.VarRef<Conn> | null = this
		if ($.pointerValue<Conn>(c).buffering) {
			$.pointerValue<Conn>(c).sendBuf = $.appendSlice($.pointerValue<Conn>(c).sendBuf, data, $.byteSliceHint)
			return [$.len(data), null]
		}

		let [n, err] = await $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Conn>(c).conn).Write(data)
		$.pointerValue<Conn>(c).bytesSent = $.int64Add($.pointerValue<Conn>(c).bytesSent, $.int64(n))
		return [n, err]
	}

	public async writeChangeCipherRecord(): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Conn>(c).out.Mutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).out.Mutex.Unlock() })
		let [, err] = await Conn.prototype.writeRecordLocked.call(c, $.uint(20, 8), new Uint8Array([1]) as $.Slice<number>)
		return err
	}

	public async writeHandshakeRecord(msg: __goscript_common.handshakeMessage | null, transcript: __goscript_handshake_messages.transcriptHash | null): globalThis.Promise<[number, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Conn>(c).out.Mutex.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).out.Mutex.Unlock() })

		let __goscriptTuple43: any = await $.pointerValue<Exclude<__goscript_common.handshakeMessage, null>>(msg).marshal()
		let data: $.Slice<number> = __goscriptTuple43[0]
		let err = __goscriptTuple43[1]
		if (err != null) {
			return [0, err]
		}
		if (transcript != null) {
			await $.pointerValue<Exclude<__goscript_handshake_messages.transcriptHash, null>>(transcript).Write(data)
		}

		return await Conn.prototype.writeRecordLocked.call(c, $.uint(22, 8), data)
	}

	public async writeRecordLocked(typ: __goscript_common.recordType, data: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		if ($.pointerValue<Conn>(c).quic != null) {
			if ($.uint(typ, 8) != $.uint(22, 8)) {
				return [0, errors.New("tls: internal error: sending non-handshake message to QUIC transport")]
			}
			Conn.prototype.quicWriteCryptoData.call(c, $.pointerValue<Conn>(c).out.level, data)
			if (!$.pointerValue<Conn>(c).buffering) {
				{
					let [, err] = await Conn.prototype.flush.call(c)
					if (err != null) {
						return [0, err]
					}
				}
			}
			return [$.len(data), null]
		}

		let outBufPtr = $.mustTypeAssert<$.VarRef<$.Slice<number>> | null>(await outBufPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } })
		let outBuf: $.Slice<number> = $.pointerValue<$.Slice<number>>(outBufPtr)
		__defer.defer(() => { ((): void => {
			// You might be tempted to simplify this by just passing &outBuf to Put,
			// but that would make the local copy of the outBuf slice header escape
			// to the heap, causing an allocation. Instead, we keep around the
			// pointer to the slice header returned by Get, which is already on the
			// heap, and overwrite and return that.
			outBufPtr!.value = outBuf
			outBufPool.value.Put($.interfaceValue<any>(outBufPtr, "*[]byte", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }))
		})() })

		let n: number = 0
		while ($.len(data) > 0) {
			let m = $.len(data)
			{
				let maxPayload = await Conn.prototype.maxPayloadSizeForWrite.call(c, $.uint(typ, 8))
				if (m > maxPayload) {
					m = maxPayload
				}
			}

			let __goscriptTuple44: any = sliceForAppend($.goSlice(outBuf, undefined, 0), 5)
			outBuf = __goscriptTuple44[1]
			outBuf![0] = $.uint($.uint(typ, 8), 8)
			let vers = $.uint($.pointerValue<Conn>(c).vers, 16)
			if ($.uint(vers, 16) == $.uint(0, 16)) {
				// Some TLS servers fail if the record version is
				// greater than TLS 1.0 for the initial ClientHello.
				vers = $.uint(769, 16)
			} else {
				if ($.uint(vers, 16) == $.uint(772, 16)) {
					// TLS 1.3 froze the record layer version to 1.2.
					// See RFC 8446, Section 5.1.
					vers = $.uint(771, 16)
				}
			}
			outBuf![1] = $.uint($.uint($.uintShr(vers, 8, 16), 8), 8)
			outBuf![2] = $.uint($.uint(vers, 8), 8)
			outBuf![3] = $.uint($.uint(m >> 8, 8), 8)
			outBuf![4] = $.uint($.uint(m, 8), 8)

			let err: $.GoError = null as $.GoError
			let __goscriptTuple45: any = await $.pointerValue<Conn>(c).out.encrypt(outBuf, $.goSlice(data, undefined, m), __goscript_common.Config.prototype.rand.call($.pointerValue<Conn>(c).config))
			outBuf = __goscriptTuple45[0]
			err = __goscriptTuple45[1]
			if (err != null) {
				return [n, err]
			}
			{
				let [, __goscriptShadow21] = await Conn.prototype.write.call(c, outBuf)
				if (__goscriptShadow21 != null) {
					return [n, __goscriptShadow21]
				}
			}
			n = n + (m)
			data = $.goSlice(data, m, undefined)
		}

		if (($.uint(typ, 8) == $.uint(20, 8)) && ($.uint($.pointerValue<Conn>(c).vers, 16) != $.uint(772, 16))) {
			{
				let err = $.pointerValue<Conn>(c).out.changeCipherSpec()
				if (err != null) {
					return [n, await Conn.prototype.sendAlertLocked.call(c, $.uint($.mustTypeAssert<__goscript_alert.alert>(err, { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" }), 8))]
				}
			}
		}

		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"tls.Conn",
		() => new Conn(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "ConnectionState", args: [], returns: [{ name: "_r0", type: "tls.ConnectionState" }] }, { name: "Handshake", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "HandshakeContext", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "NetConn", args: [], returns: [{ name: "_r0", type: "net.Conn" }] }, { name: "OCSPResponse", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "VerifyHostname", args: [{ name: "host", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "clientHandshake", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "err", type: "error" }] }, { name: "clientSessionCacheKey", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "closeNotify", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "connectionStateLocked", args: [], returns: [{ name: "_r0", type: "tls.ConnectionState" }] }, { name: "flush", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "getClientCertificate", args: [{ name: "cri", type: { kind: $.TypeKind.Pointer, elemType: "tls.CertificateRequestInfo" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.Certificate" } }, { name: "_r1", type: "error" }] }, { name: "handleKeyUpdate", args: [{ name: "keyUpdate", type: { kind: $.TypeKind.Pointer, elemType: "tls.keyUpdateMsg" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "handleNewSessionTicket", args: [{ name: "msg", type: { kind: $.TypeKind.Pointer, elemType: "tls.newSessionTicketMsgTLS13" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "handlePostHandshakeMessage", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "handleRenegotiation", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "handshakeContext", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "ret", type: "error" }] }, { name: "loadSession", args: [{ name: "hello", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }], returns: [{ name: "session", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" } }, { name: "earlySecret", type: { kind: $.TypeKind.Pointer, elemType: "tls13.EarlySecret" } }, { name: "binderKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "makeClientHello", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "tls.keySharePrivateKeys" } }, { name: "_r2", type: { kind: $.TypeKind.Pointer, elemType: "tls.echClientContext" } }, { name: "_r3", type: "error" }] }, { name: "maxPayloadSizeForWrite", args: [{ name: "typ", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.recordType" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "newRecordHeaderError", args: [{ name: "conn", type: "net.Conn" }, { name: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "err", type: "tls.RecordHeaderError" }] }, { name: "pickTLSVersion", args: [{ name: "serverHello", type: { kind: $.TypeKind.Pointer, elemType: "tls.serverHelloMsg" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "processCertsFromClient", args: [{ name: "certificate", type: "tls.Certificate" }], returns: [{ name: "_r0", type: "error" }] }, { name: "processECHClientHello", args: [{ name: "outer", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "echKeys", type: { kind: $.TypeKind.Slice, elemType: "tls.EncryptedClientHelloKey" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "tls.echServerContext" } }, { name: "_r2", type: "error" }] }, { name: "quicGetTransportParameters", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "quicHandshakeComplete", args: [], returns: [] }, { name: "quicReadHandshakeBytes", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "quicRejectedEarlyData", args: [], returns: [] }, { name: "quicResumeSession", args: [{ name: "session", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "quicSetReadSecret", args: [{ name: "level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" } }, { name: "suite", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "quicSetTransportParameters", args: [{ name: "params", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "quicSetWriteSecret", args: [{ name: "level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" } }, { name: "suite", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "quicStoreSession", args: [{ name: "session", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" } }], returns: [] }, { name: "quicWaitForSignal", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "quicWriteCryptoData", args: [{ name: "level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "readChangeCipherSpec", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readClientHello", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.clientHelloMsg" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "tls.echServerContext" } }, { name: "_r2", type: "error" }] }, { name: "readFromUntil", args: [{ name: "r", type: "io.Reader" }, { name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "readHandshake", args: [{ name: "transcript", type: "tls.transcriptHash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "readHandshakeBytes", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "readRecord", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readRecordOrCCS", args: [{ name: "expectChangeCipherSpec", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "retryReadRecord", args: [{ name: "expectChangeCipherSpec", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "sendAlert", args: [{ name: "err", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "sendAlertLocked", args: [{ name: "err", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.alert" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "sendSessionTicket", args: [{ name: "earlyData", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "extra", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "serverHandshake", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "error" }] }, { name: "sessionState", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.SessionState" } }] }, { name: "setReadTrafficSecret", args: [{ name: "suite", type: { kind: $.TypeKind.Pointer, elemType: "tls.cipherSuiteTLS13" } }, { name: "level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" } }, { name: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "locked", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "setWriteTrafficSecret", args: [{ name: "suite", type: { kind: $.TypeKind.Pointer, elemType: "tls.cipherSuiteTLS13" } }, { name: "level", type: { kind: $.TypeKind.Basic, name: "int", typeName: "tls.QUICEncryptionLevel" } }, { name: "secret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "unmarshalHandshakeMessage", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "transcript", type: "tls.transcriptHash" }], returns: [{ name: "_r0", type: "tls.handshakeMessage" }, { name: "_r1", type: "error" }] }, { name: "verifyServerCertificate", args: [{ name: "certificates", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "write", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "writeChangeCipherRecord", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "writeHandshakeRecord", args: [{ name: "msg", type: "tls.handshakeMessage" }, { name: "transcript", type: "tls.transcriptHash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "writeRecordLocked", args: [{ name: "typ", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "tls.recordType" } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		Conn,
		[{ name: "conn", key: "conn", type: "net.Conn", pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "isClient", key: "isClient", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [1], offset: 16, exported: false }, { name: "handshakeFn", key: "handshakeFn", type: ({ kind: $.TypeKind.Function, params: ["context.Context"], results: ["error"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [2], offset: 24, exported: false }, { name: "quic", key: "quic", type: { kind: $.TypeKind.Pointer, elemType: "tls.quicState" }, pkgPath: "crypto/tls", index: [3], offset: 32, exported: false }, { name: "isHandshakeComplete", key: "isHandshakeComplete", type: "atomic.Bool", pkgPath: "crypto/tls", index: [4], offset: 40, exported: false }, { name: "handshakeMutex", key: "handshakeMutex", type: "sync.Mutex", pkgPath: "crypto/tls", index: [5], offset: 44, exported: false }, { name: "handshakeErr", key: "handshakeErr", type: "error", pkgPath: "crypto/tls", index: [6], offset: 56, exported: false }, { name: "vers", key: "vers", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [7], offset: 72, exported: false }, { name: "haveVers", key: "haveVers", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [8], offset: 74, exported: false }, { name: "config", key: "config", type: { kind: $.TypeKind.Pointer, elemType: "tls.Config" }, pkgPath: "crypto/tls", index: [9], offset: 80, exported: false }, { name: "handshakes", key: "handshakes", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [10], offset: 88, exported: false }, { name: "extMasterSecret", key: "extMasterSecret", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [11], offset: 96, exported: false }, { name: "didResume", key: "didResume", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [12], offset: 97, exported: false }, { name: "didHRR", key: "didHRR", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [13], offset: 98, exported: false }, { name: "cipherSuite", key: "cipherSuite", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [14], offset: 100, exported: false }, { name: "curveID", key: "curveID", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }, pkgPath: "crypto/tls", index: [15], offset: 102, exported: false }, { name: "peerSigAlg", key: "peerSigAlg", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }, pkgPath: "crypto/tls", index: [16], offset: 104, exported: false }, { name: "ocspResponse", key: "ocspResponse", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [17], offset: 112, exported: false }, { name: "scts", key: "scts", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "crypto/tls", index: [18], offset: 136, exported: false }, { name: "peerCertificates", key: "peerCertificates", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, pkgPath: "crypto/tls", index: [19], offset: 160, exported: false }, { name: "verifiedChains", key: "verifiedChains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } }, pkgPath: "crypto/tls", index: [20], offset: 184, exported: false }, { name: "serverName", key: "serverName", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/tls", index: [21], offset: 208, exported: false }, { name: "secureRenegotiation", key: "secureRenegotiation", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [22], offset: 224, exported: false }, { name: "ekm", key: "ekm", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [23], offset: 232, exported: false }, { name: "resumptionSecret", key: "resumptionSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [24], offset: 240, exported: false }, { name: "echAccepted", key: "echAccepted", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [25], offset: 264, exported: false }, { name: "ticketKeys", key: "ticketKeys", type: { kind: $.TypeKind.Slice, elemType: "tls.ticketKey" }, pkgPath: "crypto/tls", index: [26], offset: 272, exported: false }, { name: "clientFinishedIsFirst", key: "clientFinishedIsFirst", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [27], offset: 296, exported: false }, { name: "closeNotifyErr", key: "closeNotifyErr", type: "error", pkgPath: "crypto/tls", index: [28], offset: 304, exported: false }, { name: "closeNotifySent", key: "closeNotifySent", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [29], offset: 320, exported: false }, { name: "clientFinished", key: "clientFinished", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 12 }, pkgPath: "crypto/tls", index: [30], offset: 321, exported: false }, { name: "serverFinished", key: "serverFinished", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 12 }, pkgPath: "crypto/tls", index: [31], offset: 333, exported: false }, { name: "clientProtocol", key: "clientProtocol", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/tls", index: [32], offset: 352, exported: false }, { name: "in", key: "_in", type: "tls.halfConn", pkgPath: "crypto/tls", index: [33], offset: 368, exported: false }, { name: "out", key: "out", type: "tls.halfConn", pkgPath: "crypto/tls", index: [34], offset: 520, exported: false }, { name: "rawInput", key: "rawInput", type: "bytes.Buffer", pkgPath: "crypto/tls", index: [35], offset: 672, exported: false }, { name: "input", key: "input", type: "bytes.Reader", pkgPath: "crypto/tls", index: [36], offset: 712, exported: false }, { name: "hand", key: "hand", type: "bytes.Buffer", pkgPath: "crypto/tls", index: [37], offset: 752, exported: false }, { name: "buffering", key: "buffering", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/tls", index: [38], offset: 792, exported: false }, { name: "sendBuf", key: "sendBuf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [39], offset: 800, exported: false }, { name: "bytesSent", key: "bytesSent", type: { kind: $.TypeKind.Basic, name: "int64" }, pkgPath: "crypto/tls", index: [40], offset: 824, exported: false }, { name: "packetsSent", key: "packetsSent", type: { kind: $.TypeKind.Basic, name: "int64" }, pkgPath: "crypto/tls", index: [41], offset: 832, exported: false }, { name: "retryCount", key: "retryCount", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [42], offset: 840, exported: false }, { name: "activeCall", key: "activeCall", type: "atomic.Int32", pkgPath: "crypto/tls", index: [43], offset: 848, exported: false }, { name: "tmp", key: "tmp", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 }, pkgPath: "crypto/tls", index: [44], offset: 852, exported: false }]
	)
}

export class permanentError {
	public get err(): net.Error | null {
		return this._fields.err.value
	}
	public set err(value: net.Error | null) {
		this._fields.err.value = value
	}

	public _fields: {
		err: $.VarRef<net.Error | null>
	}

	constructor(init?: Partial<{err?: net.Error | null}>) {
		this._fields = {
			err: $.varRef(init?.err ?? (null as net.Error | null))
		}
	}

	public clone(): permanentError {
		const cloned = new permanentError()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: permanentError | $.VarRef<permanentError> | null = this
		return $.pointerValue<Exclude<net.Error, null>>($.pointerValue<permanentError>(e).err).Error()
	}

	public Temporary(): boolean {
		const e: permanentError | $.VarRef<permanentError> | null = this
		return false
	}

	public async Timeout(): globalThis.Promise<boolean> {
		const e: permanentError | $.VarRef<permanentError> | null = this
		return $.pointerValue<Exclude<net.Error, null>>($.pointerValue<permanentError>(e).err).Timeout()
	}

	public Unwrap(): $.GoError {
		const e: permanentError | $.VarRef<permanentError> | null = this
		return ($.pointerValue<permanentError>(e).err as $.GoError)
	}

	static __typeInfo = $.registerStructType(
		"tls.permanentError",
		() => new permanentError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unwrap", args: [], returns: [{ name: "_r0", type: "error" }] }],
		permanentError,
		[{ name: "err", key: "err", type: "net.Error", pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class RecordHeaderError {
	// Msg contains a human readable string that describes the error.
	public get Msg(): string {
		return this._fields.Msg.value
	}
	public set Msg(value: string) {
		this._fields.Msg.value = value
	}

	// RecordHeader contains the five bytes of TLS record header that
	// triggered the error.
	public get RecordHeader(): Uint8Array {
		return this._fields.RecordHeader.value
	}
	public set RecordHeader(value: Uint8Array) {
		this._fields.RecordHeader.value = value
	}

	// Conn provides the underlying net.Conn in the case that a client
	// sent an initial handshake that didn't look like TLS.
	// It is nil if there's already been a handshake or a TLS alert has
	// been written to the connection.
	public get Conn(): net.Conn | null {
		return this._fields.Conn.value
	}
	public set Conn(value: net.Conn | null) {
		this._fields.Conn.value = value
	}

	public _fields: {
		Msg: $.VarRef<string>
		RecordHeader: $.VarRef<Uint8Array>
		Conn: $.VarRef<net.Conn | null>
	}

	constructor(init?: Partial<{Msg?: string, RecordHeader?: Uint8Array, Conn?: net.Conn | null}>) {
		this._fields = {
			Msg: $.varRef(init?.Msg ?? ("" as string)),
			RecordHeader: $.varRef(init?.RecordHeader !== undefined ? $.cloneArrayValue(init.RecordHeader) : new Uint8Array(5)),
			Conn: $.varRef(init?.Conn ?? (null as net.Conn | null))
		}
	}

	public clone(): RecordHeaderError {
		const cloned = new RecordHeaderError()
		cloned._fields = {
			Msg: $.varRef(this._fields.Msg.value),
			RecordHeader: $.varRef($.cloneArrayValue(this._fields.RecordHeader.value)),
			Conn: $.varRef(this._fields.Conn.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e = this
		return "tls: " + e.Msg
	}

	static __typeInfo = $.registerStructType(
		"tls.RecordHeaderError",
		() => new RecordHeaderError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		RecordHeaderError,
		[{ name: "Msg", key: "Msg", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "RecordHeader", key: "RecordHeader", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 5 }, index: [1], offset: 16, exported: true }, { name: "Conn", key: "Conn", type: "net.Conn", index: [2], offset: 24, exported: true }]
	)
}

export class atLeastReader {
	public get R(): io.Reader | null {
		return this._fields.R.value
	}
	public set R(value: io.Reader | null) {
		this._fields.R.value = value
	}

	public get N(): bigint {
		return this._fields.N.value
	}
	public set N(value: bigint) {
		this._fields.N.value = value
	}

	public _fields: {
		R: $.VarRef<io.Reader | null>
		N: $.VarRef<bigint>
	}

	constructor(init?: Partial<{R?: io.Reader | null, N?: bigint}>) {
		this._fields = {
			R: $.varRef(init?.R ?? (null as io.Reader | null)),
			N: $.varRef(init?.N ?? (0n as bigint))
		}
	}

	public clone(): atLeastReader {
		const cloned = new atLeastReader()
		cloned._fields = {
			R: $.varRef(this._fields.R.value),
			N: $.varRef(this._fields.N.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let r: atLeastReader | $.VarRef<atLeastReader> | null = this
		if ($.pointerValue<atLeastReader>(r).N <= 0n) {
			return [0, io.EOF]
		}
		let [n, err] = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<atLeastReader>(r).R).Read(p)
		$.pointerValue<atLeastReader>(r).N = $.int64Sub($.pointerValue<atLeastReader>(r).N, $.int64(n))
		if (($.pointerValue<atLeastReader>(r).N > 0n) && ($.comparableEqual(err, io.EOF))) {
			return [n, io.ErrUnexpectedEOF]
		}
		if (($.pointerValue<atLeastReader>(r).N <= 0n) && (err == null)) {
			return [n, io.EOF]
		}
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"tls.atLeastReader",
		() => new atLeastReader(),
		[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		atLeastReader,
		[{ name: "R", key: "R", type: "io.Reader", index: [0], offset: 0, exported: true }, { name: "N", key: "N", type: { kind: $.TypeKind.Basic, name: "int64" }, index: [1], offset: 16, exported: true }]
	)
}

export const tcpMSSEstimate: number = 1208

export const recordSizeBoostThreshold: number = 131072

export function extractPadding(payload: $.Slice<number>): [number, number] {
	let toRemove: number = 0
	let good: number = 0
	if ($.len(payload) < 1) {
		return [0, $.uint(0, 8)]
	}

	let paddingLen = $.uint($.arrayIndex(payload!, $.len(payload) - 1), 8)
	let t = $.uint($.uint64Sub($.uint($.len(payload) - 1, 64), $.uint(paddingLen, 64)), 64)
	// if len(payload) >= (paddingLen - 1) then the MSB of t is zero
	good = $.uint($.uint($.int($.uint($.uint64Xor(t, -1n), 64), 32) >> 31, 8), 8)

	// The maximum possible padding length plus the actual length field
	let toCheck = 256
	// The length of the padded data is public, so we can use an if here
	if (toCheck > $.len(payload)) {
		toCheck = $.len(payload)
	}

	for (let i = 0; i < toCheck; i++) {
		let __goscriptShadow22 = $.uint($.uint64Sub($.uint(paddingLen, 64), $.uint(i, 64)), 64)
		// if i <= paddingLen then the MSB of t is zero
		let mask = $.uint($.uint($.int($.uint($.uint64Xor(__goscriptShadow22, -1n), 64), 32) >> 31, 8), 8)
		let b = $.uint($.arrayIndex(payload!, ($.len(payload) - 1) - i), 8)
		good = good & ~(($.uint((mask & paddingLen) ^ (mask & b), 8)))
	}

	// We AND together the bits of good and replicate the result across
	// all the bits.
	good = good & ($.uint(good << 4, 8))
	good = good & ($.uint(good << 2, 8))
	good = good & ($.uint(good << 1, 8))
	good = $.uint($.uint($.int(good, 8) >> 7, 8), 8)

	// Zero the padding length on error. This ensures any unchecked bytes
	// are included in the MAC. Otherwise, an attacker that could
	// distinguish MAC failures from padding failures could mount an attack
	// similar to POODLE in SSL 3.0: given a good ciphertext that uses a
	// full block's worth of padding, replace the final block with another
	// block. If the MAC check passed but the padding check failed, the
	// last byte of that block decrypted to the block size.
	//
	// See also macAndPaddingGood logic below.
	paddingLen = paddingLen & ($.uint(good, 8))

	toRemove = $.int(paddingLen) + 1
	return [toRemove, good]
}

export function roundUp(a: number, b: number): number {
	return a + ((b - (a % b)) % b)
}

export function sliceForAppend(_in: $.Slice<number>, n: number): [$.Slice<number>, $.Slice<number>] {
	let head: $.Slice<number> = null as $.Slice<number>
	let tail: $.Slice<number> = null as $.Slice<number>
	{
		let total = $.len(_in) + n
		if ($.cap(_in) >= total) {
			head = $.goSlice(_in, undefined, total)
		} else {
			head = $.makeSlice<number>(total, undefined, "byte")
			$.copy(head, _in)
		}
	}
	tail = $.goSlice(head, $.len(_in), undefined)
	return [head, tail]
}

export let outBufPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>($.varRef<$.Slice<number>>(null as $.Slice<number>), "*[]byte", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } })
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})))

export function __goscript_set_outBufPool(__goscriptValue: sync.Pool): void {
	outBufPool.value = __goscriptValue
}

export let errShutdown: $.GoError = errors.New("tls: protocol is shutdown")

export function __goscript_set_errShutdown(__goscriptValue: $.GoError): void {
	errShutdown = __goscriptValue
}

export let errEarlyCloseWrite: $.GoError = errors.New("tls: CloseWrite called before handshake complete")

export function __goscript_set_errEarlyCloseWrite(__goscriptValue: $.GoError): void {
	errEarlyCloseWrite = __goscriptValue
}

export let tlsunsafeekm: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("tlsunsafeekm")

export function __goscript_set_tlsunsafeekm(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	tlsunsafeekm = __goscriptValue
}
