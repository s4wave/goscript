// Generated file based on package_import_pairing_dial_conversions.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"

export class recreateError {
	public get next(): bigint {
		return this._fields.next.value
	}
	public set next(value: bigint) {
		this._fields.next.value = value
	}

	public _fields: {
		next: $.VarRef<bigint>
	}

	constructor(init?: Partial<{next?: bigint}>) {
		this._fields = {
			next: $.varRef(init?.next ?? (0n as bigint))
		}
	}

	public clone(): recreateError {
		const cloned = new recreateError()
		cloned._fields = {
			next: $.varRef(this._fields.next.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: recreateError | $.VarRef<recreateError> | null = this
		return "recreate"
	}

	static __typeInfo = $.registerStructType(
		"main.recreateError",
		() => new recreateError(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		recreateError,
		[{ name: "next", key: "next", type: { kind: $.TypeKind.Basic, name: "uint64" } }]
	)
}

export class readWriteCloser {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): readWriteCloser {
		const cloned = new readWriteCloser()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		return null
	}

	public Read(_p0: $.Slice<number>): [number, $.GoError] {
		return [0, io.EOF]
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.readWriteCloser",
		() => new readWriteCloser(),
		[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }, { name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		readWriteCloser,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let addr: net.Addr | null = $.interfaceValue<net.Addr | null>((() => { const __goscriptLiteralField0 = (net.IPv4($.uint(127, 8), $.uint(0, 8), $.uint(0, 8), $.uint(1, 8)) as net.IP); return new net.UDPAddr({IP: __goscriptLiteralField0, Port: 443}) })(), "*net.UDPAddr", { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" })
	$.println("addr", await $.pointerValue<Exclude<net.Addr, null>>(addr).Network(), $.pointerValue<net.UDPAddr>($.mustTypeAssert<net.UDPAddr | $.VarRef<net.UDPAddr> | null>(addr, { kind: $.TypeKind.Pointer, elemType: "net.UDPAddr" })).Port)

	let stream: io.ReadWriteCloser | null = $.interfaceValue<io.ReadWriteCloser | null>(new readWriteCloser(), "*main.readWriteCloser", { kind: $.TypeKind.Pointer, elemType: "main.readWriteCloser" })
	let [written, err] = await $.pointerValue<Exclude<io.ReadWriteCloser, null>>(stream).Write(new Uint8Array([100, 105, 97, 108]))
	$.println("stream", written, err == null, await $.pointerValue<Exclude<io.ReadWriteCloser, null>>(stream).Close() == null)

	let keys: $.Channel<crypto.PublicKey | null> | null = $.makeChannel<crypto.PublicKey | null>(1, null, "both")
	await $.chanSend(keys, $.namedValueInterfaceValue<crypto.PublicKey | null>(new Uint8Array([1, 2, 3]) as $.Slice<number>, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]))
	let key: ed25519.PublicKey = ($.mustTypeAssert<ed25519.PublicKey>((await $.chanRecv(keys)), { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }) as ed25519.PublicKey)
	$.println("key", $.len((key as ed25519.PublicKey)), $.uint($.arrayIndex(key!, 0), 8))

	let target: $.VarRef<recreateError | $.VarRef<recreateError> | null> = $.varRef(null as recreateError | $.VarRef<recreateError> | null)
	let matched = errors.As($.pointerValueOrNil($.interfaceValue<$.GoError>(new recreateError({next: 7n}), "*main.recreateError", { kind: $.TypeKind.Pointer, elemType: "main.recreateError" }))!, $.interfaceValue<any>(target, "**main.recreateError", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "main.recreateError" } }))
	$.println("error", matched, $.pointerValue<recreateError>(target.value).next)
}

if ($.isMainScript(import.meta)) {
	await main()
}
