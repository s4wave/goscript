// Generated file based on ech.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as hpke from "@goscript/crypto/hpke/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as strings from "@goscript/strings/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as context2 from "@goscript/context/index.js"

import * as crypto from "@goscript/crypto/index.js"

import type * as cipher from "@goscript/crypto/cipher/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

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

import type * as __goscript_handshake_client from "./handshake_client.gs.ts"

import type * as __goscript_handshake_client_tls13 from "./handshake_client_tls13.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import type * as __goscript_handshake_server from "./handshake_server.gs.ts"

import * as __goscript_handshake_server_tls13 from "./handshake_server_tls13.gs.ts"

import type * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_quic from "./quic.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/hpke/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/strings/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/context/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdh/index.js"
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
import "./handshake_messages.gs.ts"
import "./handshake_server_tls13.gs.ts"
import "./quic.gs.ts"
import "./ticket.gs.ts"

export type echExtType = number

export class echCipher {
	public get KDFID(): number {
		return this._fields.KDFID.value
	}
	public set KDFID(value: number) {
		this._fields.KDFID.value = value
	}

	public get AEADID(): number {
		return this._fields.AEADID.value
	}
	public set AEADID(value: number) {
		this._fields.AEADID.value = value
	}

	public _fields: {
		KDFID: $.VarRef<number>
		AEADID: $.VarRef<number>
	}

	constructor(init?: Partial<{KDFID?: number, AEADID?: number}>) {
		this._fields = {
			KDFID: $.varRef(init?.KDFID ?? (0 as number)),
			AEADID: $.varRef(init?.AEADID ?? (0 as number))
		}
	}

	public clone(): echCipher {
		const cloned = new echCipher()
		cloned._fields = {
			KDFID: $.varRef(this._fields.KDFID.value),
			AEADID: $.varRef(this._fields.AEADID.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.echCipher",
		() => new echCipher(),
		[],
		echCipher,
		[{ name: "KDFID", key: "KDFID", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [0], offset: 0, exported: true }, { name: "AEADID", key: "AEADID", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [1], offset: 2, exported: true }]
	)
}

export class echExtension {
	public get Type(): number {
		return this._fields.Type.value
	}
	public set Type(value: number) {
		this._fields.Type.value = value
	}

	public get Data(): $.Slice<number> {
		return this._fields.Data.value
	}
	public set Data(value: $.Slice<number>) {
		this._fields.Data.value = value
	}

	public _fields: {
		Type: $.VarRef<number>
		Data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Type?: number, Data?: $.Slice<number>}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? (0 as number)),
			Data: $.varRef(init?.Data ?? (null as $.Slice<number>))
		}
	}

	public clone(): echExtension {
		const cloned = new echExtension()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value),
			Data: $.varRef(this._fields.Data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.echExtension",
		() => new echExtension(),
		[],
		echExtension,
		[{ name: "Type", key: "Type", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [0], offset: 0, exported: true }, { name: "Data", key: "Data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [1], offset: 8, exported: true }]
	)
}

export class echConfig {
	public get raw(): $.Slice<number> {
		return this._fields.raw.value
	}
	public set raw(value: $.Slice<number>) {
		this._fields.raw.value = value
	}

	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get Length(): number {
		return this._fields.Length.value
	}
	public set Length(value: number) {
		this._fields.Length.value = value
	}

	public get ConfigID(): number {
		return this._fields.ConfigID.value
	}
	public set ConfigID(value: number) {
		this._fields.ConfigID.value = value
	}

	public get KemID(): number {
		return this._fields.KemID.value
	}
	public set KemID(value: number) {
		this._fields.KemID.value = value
	}

	public get PublicKey(): $.Slice<number> {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: $.Slice<number>) {
		this._fields.PublicKey.value = value
	}

	public get SymmetricCipherSuite(): $.Slice<echCipher> {
		return this._fields.SymmetricCipherSuite.value
	}
	public set SymmetricCipherSuite(value: $.Slice<echCipher>) {
		this._fields.SymmetricCipherSuite.value = value
	}

	public get MaxNameLength(): number {
		return this._fields.MaxNameLength.value
	}
	public set MaxNameLength(value: number) {
		this._fields.MaxNameLength.value = value
	}

	public get PublicName(): $.Slice<number> {
		return this._fields.PublicName.value
	}
	public set PublicName(value: $.Slice<number>) {
		this._fields.PublicName.value = value
	}

	public get Extensions(): $.Slice<echExtension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<echExtension>) {
		this._fields.Extensions.value = value
	}

	public _fields: {
		raw: $.VarRef<$.Slice<number>>
		Version: $.VarRef<number>
		Length: $.VarRef<number>
		ConfigID: $.VarRef<number>
		KemID: $.VarRef<number>
		PublicKey: $.VarRef<$.Slice<number>>
		SymmetricCipherSuite: $.VarRef<$.Slice<echCipher>>
		MaxNameLength: $.VarRef<number>
		PublicName: $.VarRef<$.Slice<number>>
		Extensions: $.VarRef<$.Slice<echExtension>>
	}

	constructor(init?: Partial<{raw?: $.Slice<number>, Version?: number, Length?: number, ConfigID?: number, KemID?: number, PublicKey?: $.Slice<number>, SymmetricCipherSuite?: $.Slice<echCipher>, MaxNameLength?: number, PublicName?: $.Slice<number>, Extensions?: $.Slice<echExtension>}>) {
		this._fields = {
			raw: $.varRef(init?.raw ?? (null as $.Slice<number>)),
			Version: $.varRef(init?.Version ?? (0 as number)),
			Length: $.varRef(init?.Length ?? (0 as number)),
			ConfigID: $.varRef(init?.ConfigID ?? (0 as number)),
			KemID: $.varRef(init?.KemID ?? (0 as number)),
			PublicKey: $.varRef(init?.PublicKey ?? (null as $.Slice<number>)),
			SymmetricCipherSuite: $.varRef(init?.SymmetricCipherSuite ?? (null as $.Slice<echCipher>)),
			MaxNameLength: $.varRef(init?.MaxNameLength ?? (0 as number)),
			PublicName: $.varRef(init?.PublicName ?? (null as $.Slice<number>)),
			Extensions: $.varRef(init?.Extensions ?? (null as $.Slice<echExtension>))
		}
	}

	public clone(): echConfig {
		const cloned = new echConfig()
		cloned._fields = {
			raw: $.varRef(this._fields.raw.value),
			Version: $.varRef(this._fields.Version.value),
			Length: $.varRef(this._fields.Length.value),
			ConfigID: $.varRef(this._fields.ConfigID.value),
			KemID: $.varRef(this._fields.KemID.value),
			PublicKey: $.varRef(this._fields.PublicKey.value),
			SymmetricCipherSuite: $.varRef(this._fields.SymmetricCipherSuite.value),
			MaxNameLength: $.varRef(this._fields.MaxNameLength.value),
			PublicName: $.varRef(this._fields.PublicName.value),
			Extensions: $.varRef(this._fields.Extensions.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.echConfig",
		() => new echConfig(),
		[],
		echConfig,
		[{ name: "raw", key: "raw", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [1], offset: 24, exported: true }, { name: "Length", key: "Length", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [2], offset: 26, exported: true }, { name: "ConfigID", key: "ConfigID", type: { kind: $.TypeKind.Basic, name: "uint8" }, index: [3], offset: 28, exported: true }, { name: "KemID", key: "KemID", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [4], offset: 30, exported: true }, { name: "PublicKey", key: "PublicKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [5], offset: 32, exported: true }, { name: "SymmetricCipherSuite", key: "SymmetricCipherSuite", type: { kind: $.TypeKind.Slice, elemType: "tls.echCipher" }, index: [6], offset: 56, exported: true }, { name: "MaxNameLength", key: "MaxNameLength", type: { kind: $.TypeKind.Basic, name: "uint8" }, index: [7], offset: 80, exported: true }, { name: "PublicName", key: "PublicName", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [8], offset: 88, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "tls.echExtension" }, index: [9], offset: 112, exported: true }]
	)
}

export class echConfigErr {
	public get field(): string {
		return this._fields.field.value
	}
	public set field(value: string) {
		this._fields.field.value = value
	}

	public _fields: {
		field: $.VarRef<string>
	}

	constructor(init?: Partial<{field?: string}>) {
		this._fields = {
			field: $.varRef(init?.field ?? ("" as string))
		}
	}

	public clone(): echConfigErr {
		const cloned = new echConfigErr()
		cloned._fields = {
			field: $.varRef(this._fields.field.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const e: echConfigErr | $.VarRef<echConfigErr> | null = this
		if ($.stringEqual($.pointerValue<echConfigErr>(e).field, "")) {
			return "tls: malformed ECHConfig"
		}
		return fmt.Sprintf("tls: malformed ECHConfig, invalid %s field", $.pointerValue<echConfigErr>(e).field)
	}

	static __typeInfo = $.registerStructType(
		"tls.echConfigErr",
		() => new echConfigErr(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		echConfigErr,
		[{ name: "field", key: "field", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export class rawExtension {
	public get extType(): number {
		return this._fields.extType.value
	}
	public set extType(value: number) {
		this._fields.extType.value = value
	}

	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		extType: $.VarRef<number>
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{extType?: number, data?: $.Slice<number>}>) {
		this._fields = {
			extType: $.varRef(init?.extType ?? (0 as number)),
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
		}
	}

	public clone(): rawExtension {
		const cloned = new rawExtension()
		cloned._fields = {
			extType: $.varRef(this._fields.extType.value),
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.rawExtension",
		() => new rawExtension(),
		[],
		rawExtension,
		[{ name: "extType", key: "extType", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }]
	)
}

export class ECHRejectionError {
	public get RetryConfigList(): $.Slice<number> {
		return this._fields.RetryConfigList.value
	}
	public set RetryConfigList(value: $.Slice<number>) {
		this._fields.RetryConfigList.value = value
	}

	public _fields: {
		RetryConfigList: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{RetryConfigList?: $.Slice<number>}>) {
		this._fields = {
			RetryConfigList: $.varRef(init?.RetryConfigList ?? (null as $.Slice<number>))
		}
	}

	public clone(): ECHRejectionError {
		const cloned = new ECHRejectionError()
		cloned._fields = {
			RetryConfigList: $.varRef(this._fields.RetryConfigList.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: ECHRejectionError | $.VarRef<ECHRejectionError> | null = this
		return "tls: server rejected ECH"
	}

	static __typeInfo = $.registerStructType(
		"tls.ECHRejectionError",
		() => new ECHRejectionError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		ECHRejectionError,
		[{ name: "RetryConfigList", key: "RetryConfigList", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }]
	)
}

export const innerECHExt: echExtType = 1

export const outerECHExt: echExtType = 0

export let errMalformedECHConfigList: $.GoError = errors.New("tls: malformed ECHConfigList")

export function __goscript_set_errMalformedECHConfigList(__goscriptValue: $.GoError): void {
	errMalformedECHConfigList = __goscriptValue
}

export function parseECHConfig(enc: $.Slice<number>): [boolean, echConfig, $.GoError] {
	let skip: boolean = false
	let ec: echConfig = $.markAsStructValue(new echConfig())
	let err: $.GoError = null as $.GoError
	let s: $.VarRef<cryptobyte.String> = $.varRef(((enc as cryptobyte.String) as cryptobyte.String))
	ec.raw = enc
	if (!cryptobyte.String_ReadUint16(s, ec._fields.Version)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "version"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	if (!cryptobyte.String_ReadUint16(s, ec._fields.Length)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "length"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	if ($.len(ec.raw) < ($.int(ec.Length) + 4)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "length"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	ec.raw = $.goSlice(ec.raw, undefined, ec.Length + 4)
	if ($.uint(ec.Version, 16) != $.uint(65037, 16)) {
		cryptobyte.String_Skip(s, $.int(ec.Length))
		return [true, $.markAsStructValue(new echConfig()), null]
	}
	if (!cryptobyte.String_ReadUint8(s, ec._fields.ConfigID)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "config_id"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	if (!cryptobyte.String_ReadUint16(s, ec._fields.KemID)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "kem_id"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	if (!__goscript_handshake_messages.readUint16LengthPrefixed(s, ec._fields.PublicKey)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "public_key"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	let cipherSuites: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadUint16LengthPrefixed(s, cipherSuites)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "cipher_suites"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	while (!cryptobyte.String_Empty(cipherSuites.value)) {
		let c: echCipher = $.markAsStructValue(new echCipher())
		if (!cryptobyte.String_ReadUint16(cipherSuites, c._fields.KDFID)) {
			return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "cipher_suites kdf_id"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
		}
		if (!cryptobyte.String_ReadUint16(cipherSuites, c._fields.AEADID)) {
			return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "cipher_suites aead_id"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
		}
		ec.SymmetricCipherSuite = $.append(ec.SymmetricCipherSuite, c)
	}
	if (!cryptobyte.String_ReadUint8(s, ec._fields.MaxNameLength)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "maximum_name_length"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	let publicName: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadUint8LengthPrefixed(s, publicName)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "public_name"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	ec.PublicName = publicName.value
	let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadUint16LengthPrefixed(s, extensions)) {
		return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "extensions"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
	}
	while (!cryptobyte.String_Empty(extensions.value)) {
		let e: echExtension = $.markAsStructValue(new echExtension())
		if (!cryptobyte.String_ReadUint16(extensions, e._fields.Type)) {
			return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "extensions type"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
		}
		if (!cryptobyte.String_ReadUint16LengthPrefixed(extensions, e._fields.Data)) {
			return [false, $.markAsStructValue(new echConfig()), $.interfaceValue<$.GoError>(new echConfigErr({field: "extensions data"}), "*tls.echConfigErr", { kind: $.TypeKind.Pointer, elemType: "tls.echConfigErr" })]
		}
		ec.Extensions = $.append(ec.Extensions, e)
	}

	return [false, $.markAsStructValue($.cloneStructValue(ec)), null]
}

export function parseECHConfigList(data: $.Slice<number>): [$.Slice<echConfig>, $.GoError] {
	let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))
	let length: $.VarRef<number> = $.varRef(0)
	if (!cryptobyte.String_ReadUint16(s, length)) {
		return [null, errMalformedECHConfigList]
	}
	if ($.uint(length.value, 16) != $.uint($.uint($.len(data) - 2, 16), 16)) {
		return [null, errMalformedECHConfigList]
	}
	let configs: $.Slice<echConfig> = null as $.Slice<echConfig>
	while ($.len((s.value as cryptobyte.String)) > 0) {
		if ($.len((s.value as cryptobyte.String)) < 4) {
			return [null, errors.New("tls: malformed ECHConfig")]
		}
		let configLen = $.uint(($.uint($.arrayIndex(s.value!, 2), 16) << 8) | $.uint($.arrayIndex(s.value!, 3), 16), 16)
		let [skip, ec, err] = parseECHConfig(s.value)
		if (err != null) {
			return [null, err]
		}
		s.value = ($.goSlice(s.value, configLen + 4, undefined) as cryptobyte.String)
		if (!skip) {
			configs = $.append(configs, ec)
		}
	}
	return [configs, null]
}

export async function pickECHConfig(list: $.Slice<echConfig>): globalThis.Promise<[echConfig | $.VarRef<echConfig> | null, hpke.PublicKey | null, hpke.KDF | null, hpke.AEAD | null]> {
	for (let __goscriptRangeTarget2 = list, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let ec = $.varRef(__goscriptRangeTarget2![__rangeIndex])
		if (!validDNSName($.bytesToString(ec.value.PublicName))) {
			continue
		}
		let unsupportedExt: boolean = false
		for (let __goscriptRangeTarget0 = ec.value.Extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let ext = __goscriptRangeTarget0![__rangeIndex]
			// If high order bit is set to 1 the extension is mandatory.
			// Since we don't support any extensions, if we see a mandatory
			// bit, we skip the config.
			if ($.uint((ext.Type & $.uint(32768, 16)), 16) != $.uint(0, 16)) {
				unsupportedExt = true
			}
		}
		if (unsupportedExt) {
			continue
		}
		let [kem, err] = hpke.NewKEM($.uint(ec.value.KemID, 16))
		if (err != null) {
			continue
		}
		let __goscriptTuple0: any = await $.pointerValue<Exclude<hpke.KEM, null>>(kem).NewPublicKey(ec.value.PublicKey)
		let pub = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
		if (err != null) {
			// This is an error in the config, but killing the connection feels
			// excessive.
			continue
		}
		for (let __goscriptRangeTarget1 = ec.value.SymmetricCipherSuite, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let cs = __goscriptRangeTarget1![__rangeIndex]
			// All of the supported AEADs and KDFs are fine, rather than
			// imposing some sort of preference here, we just pick the first
			// valid suite.
			let [kdf, __goscriptShadow0] = hpke.NewKDF($.uint(cs.KDFID, 16))
			if (__goscriptShadow0 != null) {
				continue
			}
			let __goscriptTuple1: any = hpke.NewAEAD($.uint(cs.AEADID, 16))
			let __goscriptShadow1 = __goscriptTuple1[0]
			__goscriptShadow0 = __goscriptTuple1[1]
			if (__goscriptShadow0 != null) {
				continue
			}
			return [ec, pub, kdf, __goscriptShadow1]
		}
	}
	return [null, null, null, null]
}

export async function encodeInnerClientHello(inner: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, maxNameLength: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let __goscriptTuple2: any = await __goscript_handshake_messages.clientHelloMsg.prototype.marshalMsg.call(inner, true)
	let h: $.Slice<number> = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}
	h = $.goSlice(h, 4, undefined)

	let paddingLen: number = 0
	if (!$.stringEqual($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(inner).serverName, "")) {
		paddingLen = $.max(0, maxNameLength - $.len($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(inner).serverName))
	} else {
		paddingLen = maxNameLength + 9
	}
	paddingLen = 31 - ((($.len(h) + paddingLen) - 1) % 32)

	return [$.appendSlice(h, $.makeSlice<number>(paddingLen, undefined, "byte"), $.byteSliceHint), null]
}

export function skipUint8LengthPrefixed(s: $.VarRef<cryptobyte.String> | null): boolean {
	let skip: $.VarRef<number> = $.varRef(0)
	if (!cryptobyte.String_ReadUint8(s, skip)) {
		return false
	}
	return cryptobyte.String_Skip(s, $.int(skip.value))
}

export function skipUint16LengthPrefixed(s: $.VarRef<cryptobyte.String> | null): boolean {
	let skip: $.VarRef<number> = $.varRef(0)
	if (!cryptobyte.String_ReadUint16(s, skip)) {
		return false
	}
	return cryptobyte.String_Skip(s, $.int(skip.value))
}

export function extractRawExtensions(hello: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null): [$.Slice<rawExtension>, $.GoError] {
	let s: $.VarRef<cryptobyte.String> = $.varRef((($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(hello).original as cryptobyte.String) as cryptobyte.String))
	if (((!cryptobyte.String_Skip(s, (4 + 2) + 32) || !skipUint8LengthPrefixed(s)) || !skipUint16LengthPrefixed(s)) || !skipUint8LengthPrefixed(s)) {
		return [null, errors.New("tls: malformed outer client hello")]
	}
	let rawExtensions: $.Slice<rawExtension> = null as $.Slice<rawExtension>
	let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadUint16LengthPrefixed(s, extensions)) {
		return [null, errors.New("tls: malformed outer client hello")]
	}

	while (!cryptobyte.String_Empty(extensions.value)) {
		let extension: $.VarRef<number> = $.varRef(0)
		let extData: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!cryptobyte.String_ReadUint16(extensions, extension) || !cryptobyte.String_ReadUint16LengthPrefixed(extensions, extData)) {
			return [null, errors.New("tls: invalid inner client hello")]
		}
		rawExtensions = $.append(rawExtensions, $.markAsStructValue(new rawExtension({extType: $.uint(extension.value, 16), data: extData.value})))
	}
	return [rawExtensions, null]
}

export async function decodeInnerClientHello(outer: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, encoded: $.Slice<number>): globalThis.Promise<[__goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, $.GoError]> {
	// Reconstructing the inner client hello from its encoded form is somewhat
	// complicated. It is missing its header (message type and length), session
	// ID, and the extensions may be compressed. Since we need to put the
	// extensions back in the same order as they were in the raw outer hello,
	// and since we don't store the raw extensions, or the order we parsed them
	// in, we need to reparse the raw extensions from the outer hello in order
	// to properly insert them into the inner hello. This _should_ result in raw
	// bytes which match the hello as it was generated by the client.
	let innerReader: $.VarRef<cryptobyte.String> = $.varRef(((encoded as cryptobyte.String) as cryptobyte.String))
	let versionAndRandom: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let sessionID: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let cipherSuites: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let compressionMethods: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (((((!cryptobyte.String_ReadBytes(innerReader, versionAndRandom, 2 + 32) || !__goscript_handshake_messages.readUint8LengthPrefixed(innerReader, sessionID)) || ($.len(sessionID.value) != 0)) || !__goscript_handshake_messages.readUint16LengthPrefixed(innerReader, cipherSuites)) || !__goscript_handshake_messages.readUint8LengthPrefixed(innerReader, compressionMethods)) || !cryptobyte.String_ReadUint16LengthPrefixed(innerReader, extensions)) {
		return [null, errors.New("tls: invalid inner client hello")]
	}

	// The specification says we must verify that the trailing padding is all
	// zeros. This is kind of weird for TLS messages, where we generally just
	// throw away any trailing garbage.
	for (let __goscriptRangeTarget3 = innerReader.value, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let p = __goscriptRangeTarget3![__rangeIndex]
		if ($.uint(p, 8) != $.uint(0, 8)) {
			return [null, errors.New("tls: invalid inner client hello")]
		}
	}

	let __goscriptTuple3: any = extractRawExtensions(outer)
	let rawOuterExts: $.Slice<rawExtension> = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}

	let recon: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null = cryptobyte.NewBuilder(null)
	cryptobyte.Builder.prototype.AddUint8.call(recon, $.uint(1, 8))
	await cryptobyte.Builder.prototype.AddUint24LengthPrefixed.call(recon, $.functionValue(async (recon: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
		cryptobyte.Builder.prototype.AddBytes.call(recon, versionAndRandom.value)
		await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(recon, $.functionValue((recon: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
			cryptobyte.Builder.prototype.AddBytes.call(recon, $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(outer).sessionId)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(recon, $.functionValue((recon: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
			cryptobyte.Builder.prototype.AddBytes.call(recon, cipherSuites.value)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		await cryptobyte.Builder.prototype.AddUint8LengthPrefixed.call(recon, $.functionValue((recon: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
			cryptobyte.Builder.prototype.AddBytes.call(recon, compressionMethods.value)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
		await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(recon, $.functionValue(async (recon: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			while (!cryptobyte.String_Empty(extensions.value)) {
				let extension: $.VarRef<number> = $.varRef(0)
				let extData: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
				if (!cryptobyte.String_ReadUint16(extensions, extension) || !cryptobyte.String_ReadUint16LengthPrefixed(extensions, extData)) {
					cryptobyte.Builder.prototype.SetError.call(recon, errors.New("tls: invalid inner client hello"))
					return
				}
				if ($.uint(extension.value, 16) == $.uint(64768, 16)) {
					if (!cryptobyte.String_ReadUint8LengthPrefixed(extData, extData)) {
						cryptobyte.Builder.prototype.SetError.call(recon, errors.New("tls: invalid inner client hello"))
						return
					}
					let i: number = 0
					while (!cryptobyte.String_Empty(extData.value)) {
						let extType: $.VarRef<number> = $.varRef(0)
						if (!cryptobyte.String_ReadUint16(extData, extType)) {
							cryptobyte.Builder.prototype.SetError.call(recon, errors.New("tls: invalid inner client hello"))
							return
						}
						if ($.uint(extType.value, 16) == $.uint(65037, 16)) {
							cryptobyte.Builder.prototype.SetError.call(recon, errors.New("tls: invalid outer extensions"))
							return
						}
						for (; i <= $.len(rawOuterExts); i++) {
							if (i == $.len(rawOuterExts)) {
								cryptobyte.Builder.prototype.SetError.call(recon, errors.New("tls: invalid outer extensions"))
								return
							}
							if ($.uint($.arrayIndex(rawOuterExts!, i).extType, 16) == $.uint(extType.value, 16)) {
								break
							}
						}
						cryptobyte.Builder.prototype.AddUint16.call(recon, $.uint($.arrayIndex(rawOuterExts!, i).extType, 16))
						await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(recon, $.functionValue((recon: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
							cryptobyte.Builder.prototype.AddBytes.call(recon, $.arrayIndex(rawOuterExts!, i).data)
						}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
					}
				} else {
					cryptobyte.Builder.prototype.AddUint16.call(recon, $.uint(extension.value, 16))
					await cryptobyte.Builder.prototype.AddUint16LengthPrefixed.call(recon, $.functionValue((recon: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(recon, extData.value)
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

	let __goscriptTuple4: any = cryptobyte.Builder.prototype.Bytes.call(recon)
	let reconBytes: $.Slice<number> = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		return [null, err]
	}
	let inner: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null = new __goscript_handshake_messages.clientHelloMsg()
	if (!__goscript_handshake_messages.clientHelloMsg.prototype.unmarshal.call(inner, reconBytes)) {
		return [null, errors.New("tls: invalid reconstructed inner client hello")]
	}

	if (!bytes.Equal($.pointerValue<__goscript_handshake_messages.clientHelloMsg>(inner).encryptedClientHello, new Uint8Array([1]) as $.Slice<number>)) {
		return [null, errInvalidECHExt]
	}

	let hasTLS13 = false
	for (let __goscriptRangeTarget4 = $.pointerValue<__goscript_handshake_messages.clientHelloMsg>(inner).supportedVersions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let v = __goscriptRangeTarget4![__rangeIndex]
		// Skip GREASE values (values of the form 0x?A0A).
		// GREASE (Generate Random Extensions And Sustain Extensibility) is a mechanism used by
		// browsers like Chrome to ensure TLS implementations correctly ignore unknown values.
		// GREASE values follow a specific pattern: 0x?A0A, where ? can be any hex digit.
		// These values should be ignored when processing supported TLS versions.
		if (($.uint((v & 0x0F0F), 16) == $.uint(0x0A0A, 16)) && ($.uint((v & 0xff), 16) == $.uint(($.uintShr(v, 8, 16)), 16))) {
			continue
		}

		// Ensure at least TLS 1.3 is offered.
		if ($.uint(v, 16) == $.uint(772, 16)) {
			hasTLS13 = true
		} else {
			if ($.uint(v, 16) < $.uint(772, 16)) {
				// Reject if any non-GREASE value is below TLS 1.3, as ECH requires TLS 1.3+.
				return [null, errors.New("tls: client sent encrypted_client_hello extension with unsupported versions")]
			}
		}
	}

	if (!hasTLS13) {
		return [null, errors.New("tls: client sent encrypted_client_hello extension but did not offer TLS 1.3")]
	}

	return [inner, null]
}

export async function decryptECHPayload(context: hpke.Recipient | $.VarRef<hpke.Recipient> | null, hello: $.Slice<number>, payload: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let outerAAD: $.Slice<number> = bytes.Replace($.goSlice(hello, 4, undefined), payload, $.makeSlice<number>($.len(payload), undefined, "byte"), 1)
	return hpke.Recipient.prototype.Open.call(context, outerAAD, payload)
}

export async function generateOuterECHExt(id: number, kdfID: number, aeadID: number, encodedKey: $.Slice<number>, payload: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
	b.value.AddUint8($.uint(0, 8))
	b.value.AddUint16($.uint(kdfID, 16))
	b.value.AddUint16($.uint(aeadID, 16))
	b.value.AddUint8($.uint(id, 8))
	await b.value.AddUint16LengthPrefixed($.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
		cryptobyte.Builder.prototype.AddBytes.call(b, encodedKey)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
	await b.value.AddUint16LengthPrefixed($.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
		cryptobyte.Builder.prototype.AddBytes.call(b, payload)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
	return b.value.Bytes()
}

export async function computeAndUpdateOuterECHExtension(outer: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, inner: __goscript_handshake_messages.clientHelloMsg | $.VarRef<__goscript_handshake_messages.clientHelloMsg> | null, ech: __goscript_handshake_client.echClientContext | $.VarRef<__goscript_handshake_client.echClientContext> | null, useKey: boolean): globalThis.Promise<$.GoError> {
	let encapKey: $.Slice<number> = null as $.Slice<number>
	if (useKey) {
		encapKey = $.pointerValue<__goscript_handshake_client.echClientContext>(ech).encapsulatedKey
	}
	let __goscriptTuple5: any = await encodeInnerClientHello(inner, $.int($.pointerValue<echConfig>($.pointerValue<__goscript_handshake_client.echClientContext>(ech).config).MaxNameLength))
	let encodedInner: $.Slice<number> = __goscriptTuple5[0]
	let err = __goscriptTuple5[1]
	if (err != null) {
		return err
	}
	// NOTE: the tag lengths for all of the supported AEADs are the same (16
	// bytes), so we have hardcoded it here. If we add support for another AEAD
	// with a different tag length, we will need to change this.
	let encryptedLen = $.len(encodedInner) + 16
	let __goscriptTuple6: any = await generateOuterECHExt($.uint($.pointerValue<echConfig>($.pointerValue<__goscript_handshake_client.echClientContext>(ech).config).ConfigID, 8), $.uint($.pointerValue<__goscript_handshake_client.echClientContext>(ech).kdfID, 16), $.uint($.pointerValue<__goscript_handshake_client.echClientContext>(ech).aeadID, 16), encapKey, $.makeSlice<number>(encryptedLen, undefined, "byte"))
	$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(outer).encryptedClientHello = __goscriptTuple6[0]
	err = __goscriptTuple6[1]
	if (err != null) {
		return err
	}
	let __goscriptTuple7: any = await __goscript_handshake_messages.clientHelloMsg.prototype.marshal.call(outer)
	let serializedOuter: $.Slice<number> = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	if (err != null) {
		return err
	}
	serializedOuter = $.goSlice(serializedOuter, 4, undefined)
	let __goscriptTuple8: any = await hpke.Sender.prototype.Seal.call($.pointerValue<__goscript_handshake_client.echClientContext>(ech).hpkeContext, serializedOuter, encodedInner)
	let encryptedInner: $.Slice<number> = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		return err
	}
	let __goscriptTuple9: any = await generateOuterECHExt($.uint($.pointerValue<echConfig>($.pointerValue<__goscript_handshake_client.echClientContext>(ech).config).ConfigID, 8), $.uint($.pointerValue<__goscript_handshake_client.echClientContext>(ech).kdfID, 16), $.uint($.pointerValue<__goscript_handshake_client.echClientContext>(ech).aeadID, 16), encapKey, encryptedInner)
	$.pointerValue<__goscript_handshake_messages.clientHelloMsg>(outer).encryptedClientHello = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		return err
	}
	return null
}

export function validDNSName(name: string): boolean {
	if ($.len(name) > 253) {
		return false
	}
	let labels: $.Slice<string> = strings.Split(name, ".")
	if ($.len(labels) <= 1) {
		return false
	}
	for (let __goscriptRangeTarget5 = labels, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
		let l = __goscriptRangeTarget5![__rangeIndex]
		let labelLen = $.len(l)
		if (labelLen == 0) {
			return false
		}
		for (const [i, r] of $.rangeString(l)) {
			if (($.int(r, 32) == $.int(45, 32)) && ((i == 0) || (i == (labelLen - 1)))) {
				return false
			}
			if ((((($.int(r, 32) < $.int(48, 32)) || ($.int(r, 32) > $.int(57, 32))) && (($.int(r, 32) < $.int(97, 32)) || ($.int(r, 32) > $.int(122, 32)))) && (($.int(r, 32) < $.int(65, 32)) || ($.int(r, 32) > $.int(90, 32)))) && ($.int(r, 32) != $.int(45, 32))) {
				return false
			}
		}
	}
	return true
}

export let errMalformedECHExt: $.GoError = errors.New("tls: malformed encrypted_client_hello extension")

export function __goscript_set_errMalformedECHExt(__goscriptValue: $.GoError): void {
	errMalformedECHExt = __goscriptValue
}

export let errInvalidECHExt: $.GoError = errors.New("tls: client sent invalid encrypted_client_hello extension")

export function __goscript_set_errInvalidECHExt(__goscriptValue: $.GoError): void {
	errInvalidECHExt = __goscriptValue
}

export function parseECHExt(ext: $.Slice<number>): [echExtType, echCipher, number, $.Slice<number>, $.Slice<number>, $.GoError] {
	let echType: echExtType = 0
	let cs: echCipher = $.markAsStructValue(new echCipher())
	let configID: $.VarRef<number> = $.varRef(0)
	let encap: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let payload: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let err: $.GoError = null as $.GoError
	let data: $.Slice<number> = $.makeSlice<number>($.len(ext), undefined, "byte")
	$.copy(data, ext)
	let s: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))
	let echInt: $.VarRef<number> = $.varRef(0)
	if (!cryptobyte.String_ReadUint8(s, echInt)) {
		err = errMalformedECHExt
		return [echType, cs, configID.value, encap.value, payload.value, err]
	}
	echType = $.uint($.uint(echInt.value, 8), 8)
	if ($.uint(echType, 8) == $.uint(1, 8)) {
		if (!cryptobyte.String_Empty(s.value)) {
			err = errMalformedECHExt
			return [echType, cs, configID.value, encap.value, payload.value, err]
		}
		return [$.uint(echType, 8), $.markAsStructValue($.cloneStructValue(cs)), $.uint(0, 8), null, null, null]
	}
	if ($.uint(echType, 8) != $.uint(0, 8)) {
		err = errInvalidECHExt
		return [echType, cs, configID.value, encap.value, payload.value, err]
	}
	if (!cryptobyte.String_ReadUint16(s, cs._fields.KDFID)) {
		err = errMalformedECHExt
		return [echType, cs, configID.value, encap.value, payload.value, err]
	}
	if (!cryptobyte.String_ReadUint16(s, cs._fields.AEADID)) {
		err = errMalformedECHExt
		return [echType, cs, configID.value, encap.value, payload.value, err]
	}
	if (!cryptobyte.String_ReadUint8(s, configID)) {
		err = errMalformedECHExt
		return [echType, cs, configID.value, encap.value, payload.value, err]
	}
	if (!__goscript_handshake_messages.readUint16LengthPrefixed(s, encap)) {
		err = errMalformedECHExt
		return [echType, cs, configID.value, encap.value, payload.value, err]
	}
	if (!__goscript_handshake_messages.readUint16LengthPrefixed(s, payload)) {
		err = errMalformedECHExt
		return [echType, cs, configID.value, encap.value, payload.value, err]
	}

	// NOTE: clone encap and payload so that mutating them does not mutate the
	// raw extension bytes.
	return [$.uint(echType, 8), $.markAsStructValue($.cloneStructValue(cs)), $.uint(configID.value, 8), bytes.Clone(encap.value), bytes.Clone(payload.value), null]
}

export async function buildRetryConfigList(keys: $.Slice<__goscript_common.EncryptedClientHelloKey>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let atLeastOneRetryConfig: boolean = false
	let retryBuilder: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
	await retryBuilder.value.AddUint16LengthPrefixed($.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
		for (let __goscriptRangeTarget6 = keys, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
			let c = __goscriptRangeTarget6![__rangeIndex]
			if (!c.SendAsRetry) {
				continue
			}
			atLeastOneRetryConfig = true
			cryptobyte.Builder.prototype.AddBytes.call(b, c.Config)
		}
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
	if (!atLeastOneRetryConfig) {
		return [null, null]
	}
	return retryBuilder.value.Bytes()
}
