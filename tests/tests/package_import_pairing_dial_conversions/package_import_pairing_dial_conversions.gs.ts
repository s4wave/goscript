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
	public declare next: bigint

	public _fields: {
		next: bigint
	}

	constructor(init?: Partial<{next?: bigint}>) {
		this._fields = {
			next: init?.next ?? (0n as bigint)
		}
	}

	public clone(): recreateError {
		return $.markAsStructValue(new recreateError(this))
	}

	public Error(): string {
		const e: recreateError | $.VarRef<recreateError> | null = this
		return "recreate"
	}

	static {
		$.bindStructFields(this.prototype, ["next"])
	}

	static __typeInfo = $.registerStructType(
		"main.recreateError",
		() => new recreateError(),
		() => [{ name: "Error", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		recreateError,
		() => [{ name: "next", key: "next", type: /* @__PURE__ */ $.basicType("uint64") }]
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
		return $.markAsStructValue(new readWriteCloser(this))
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
		() => [{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }, { name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		readWriteCloser,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	let addr: net.Addr | null = $.interfaceValue<net.Addr | null>((() => { const __goscriptLiteralField0 = (net.IPv4($.uint(127, 8), $.uint(0, 8), $.uint(0, 8), $.uint(1, 8)) as net.IP); return new net.UDPAddr({IP: __goscriptLiteralField0, Port: 443}) })(), "*net.UDPAddr", /* @__PURE__ */ $.pointerType("net.UDPAddr"))
	await $.println("addr", await $.pointerValue<Exclude<net.Addr, null>>(addr).Network(), $.pointerValue<net.UDPAddr>($.mustTypeAssert<net.UDPAddr | $.VarRef<net.UDPAddr> | null>(addr, /* @__PURE__ */ $.pointerType("net.UDPAddr"))).Port)

	let stream: io.ReadWriteCloser | null = $.interfaceValue<io.ReadWriteCloser | null>(new readWriteCloser(), "*main.readWriteCloser", /* @__PURE__ */ $.pointerType("main.readWriteCloser"))
	let [written, err] = await $.pointerValue<Exclude<io.ReadWriteCloser, null>>(stream).Write(new Uint8Array([100, 105, 97, 108]))
	await $.println("stream", written, err == null, await $.pointerValue<Exclude<io.ReadWriteCloser, null>>(stream).Close() == null)

	let keys: $.Channel<crypto.PublicKey | null> | null = $.makeChannel<crypto.PublicKey | null>(1, null! as crypto.PublicKey | null, "both")
	await $.chanSend(keys, $.namedValueInterfaceValue<crypto.PublicKey | null>(new Uint8Array([1, 2, 3]) as $.Slice<number>, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PublicKey"), [$.methodSignature("Equal", [["x", "crypto.PublicKey"]], [/* @__PURE__ */ $.basicType("bool")])]))
	let key: ed25519.PublicKey = ($.mustTypeAssert<ed25519.PublicKey>((await $.chanRecv(keys)), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PublicKey")) as ed25519.PublicKey)
	await $.println("key", $.len((key as ed25519.PublicKey)), $.uint($.arrayIndex(key!, 0), 8))

	let target: $.VarRef<recreateError | $.VarRef<recreateError> | null> = $.varRef(null! as recreateError | $.VarRef<recreateError> | null)
	let matched = errors.As($.pointerValueOrNil($.interfaceValue<$.GoError>(new recreateError({next: 7n}), "*main.recreateError", /* @__PURE__ */ $.pointerType("main.recreateError")))!, $.interfaceValue(target, "**main.recreateError", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.pointerType("main.recreateError"))))
	await $.println("error", matched, $.pointerValue<recreateError>(target.value).next)
}

if ($.isMainScript(import.meta)) {
	await main()
}
