// Generated file based on package_import_starpc_srpc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as js from "@goscript/syscall/js/index.js"

import * as time from "@goscript/time/index.js"

import * as rpcstream from "@goscript/github.com/aperturerobotics/starpc/rpcstream/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/syscall/js/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/aperturerobotics/starpc/rpcstream/index.js"
import "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

export class handler {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): handler {
		return $.markAsStructValue(new handler(this))
	}

	public GetMethodIDs(): $.Slice<string> {
		return $.arrayToSlice<string>(["method", "stream", "hold", "empty"])
	}

	public GetServiceID(): string {
		return "svc"
	}

	public async InvokeMethod(serviceID: string, methodID: string, strm: srpc.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
		if ($.stringEqual(methodID, "empty")) {
			return [true, await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))]
		}
		if (($.stringEqual(methodID, "stream")) || ($.stringEqual(methodID, "hold"))) {
			let total = 0
			while (true) {
				let msg: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
				let err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(msg, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
				if ($.comparableEqual(err, io.EOF)) {
					break
				}
				if (err != null) {
					return [true, err]
				}
				total = total + ($.len(srpc.RawMessage.prototype.GetData.call(msg)))
			}
			return [true, await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([$.uint(total, 8)]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))]
		}
		if (strm == null) {
			return [true, null]
		}
		return [true, await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([111, 107]), false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))]
	}

	static __typeInfo = $.registerStructType(
		"main.handler",
		() => new handler(),
		() => [$.methodSignature("GetMethodIDs", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))]), $.methodSignature("GetServiceID", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("InvokeMethod", [["serviceID", /* @__PURE__ */ $.basicType("string")], ["methodID", /* @__PURE__ */ $.basicType("string")], ["strm", "srpc.Stream"]], [/* @__PURE__ */ $.basicType("bool"), "error"])],
		handler,
		() => []
	)
}

export class embeddedStream {
	public declare Stream: srpc.Stream | null

	public _fields: {
		Stream: srpc.Stream | null
	}

	constructor(init?: Partial<{Stream?: srpc.Stream | null}>) {
		this._fields = {
			Stream: init?.Stream ?? (null! as srpc.Stream | null)
		}
	}

	public clone(): embeddedStream {
		return $.markAsStructValue(new embeddedStream(this))
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).Close()
	}

	public async CloseSend(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).CloseSend()
	}

	public Context(): any {
		return $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).Context()
	}

	public async MsgRecv(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).MsgRecv(msg)
	}

	public async MsgSend(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).MsgSend(msg)
	}

	static {
		$.bindStructFields(this.prototype, ["Stream"])
	}

	static __typeInfo = $.registerStructType(
		"main.embeddedStream",
		() => new embeddedStream(),
		() => [$.methodSignature("Close", [], ["error"]), $.methodSignature("CloseSend", [], ["error"]), $.methodSignature("Context", [], ["context.Context"]), $.methodSignature("MsgRecv", [["msg", "protobuf_go_lite.Message"]], ["error"]), $.methodSignature("MsgSend", [["msg", "protobuf_go_lite.Message"]], ["error"])],
		embeddedStream,
		() => [/* @__PURE__ */ $.structField("Stream", "srpc.Stream", [0], 0, true, { anonymous: true })]
	)
}

export class streamOpenResult {
	public declare stream: srpc.Stream | null

	public declare err: $.GoError

	public _fields: {
		stream: srpc.Stream | null
		err: $.GoError
	}

	constructor(init?: Partial<{stream?: srpc.Stream | null, err?: $.GoError}>) {
		this._fields = {
			stream: init?.stream ?? (null! as srpc.Stream | null),
			err: init?.err ?? (null! as $.GoError)
		}
	}

	public clone(): streamOpenResult {
		return $.markAsStructValue(new streamOpenResult(this))
	}

	static {
		$.bindStructFields(this.prototype, ["stream", "err"])
	}

	static __typeInfo = $.registerStructType(
		"main.streamOpenResult",
		() => new streamOpenResult(),
		() => [],
		streamOpenResult,
		() => [/* @__PURE__ */ $.structField("stream", "srpc.Stream", [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("err", "error", [1], 16, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" })]
	)
}

export class streamProbeResult {
	public declare total: number

	public declare err: string

	public _fields: {
		total: number
		err: string
	}

	constructor(init?: Partial<{total?: number, err?: string}>) {
		this._fields = {
			total: init?.total ?? (0 as number),
			err: init?.err ?? ("" as string)
		}
	}

	public clone(): streamProbeResult {
		return $.markAsStructValue(new streamProbeResult(this))
	}

	static {
		$.bindStructFields(this.prototype, ["total", "err"])
	}

	static __typeInfo = $.registerStructType(
		"main.streamProbeResult",
		() => new streamProbeResult(),
		() => [],
		streamProbeResult,
		() => [/* @__PURE__ */ $.structField("total", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("err", /* @__PURE__ */ $.basicType("string"), [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" })]
	)
}

export class rpcStreamServerResult {
	public declare err: string

	public _fields: {
		err: string
	}

	constructor(init?: Partial<{err?: string}>) {
		this._fields = {
			err: init?.err ?? ("" as string)
		}
	}

	public clone(): rpcStreamServerResult {
		return $.markAsStructValue(new rpcStreamServerResult(this))
	}

	static {
		$.bindStructFields(this.prototype, ["err"])
	}

	static __typeInfo = $.registerStructType(
		"main.rpcStreamServerResult",
		() => new rpcStreamServerResult(),
		() => [],
		rpcStreamServerResult,
		() => [/* @__PURE__ */ $.structField("err", /* @__PURE__ */ $.basicType("string"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" })]
	)
}

export class memoryRpcStream {
	public declare ctx: context.Context | null

	public declare cancel: (() => void) | null

	public declare recv: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null

	public declare send: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null

	public declare closeSend: sync.Once

	public declare cancelLocal: sync.Once

	public _fields: {
		ctx: context.Context | null
		cancel: (() => void) | null
		recv: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null
		send: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null
		closeSend: sync.Once
		cancelLocal: sync.Once
	}

	constructor(init?: Partial<{ctx?: context.Context | null, cancel?: (() => void) | null, recv?: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null, send?: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null, closeSend?: sync.Once, cancelLocal?: sync.Once}>) {
		this._fields = {
			ctx: init?.ctx ?? (null! as context.Context | null),
			cancel: init?.cancel ?? (null! as (() => void) | null),
			recv: init?.recv ?? (null! as $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null),
			send: init?.send ?? (null! as $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null),
			closeSend: init?.closeSend ? $.markAsStructValue($.cloneStructValue(init.closeSend)) : $.markAsStructValue(new sync.Once()),
			cancelLocal: init?.cancelLocal ? $.markAsStructValue($.cloneStructValue(init.cancelLocal)) : $.markAsStructValue(new sync.Once())
		}
	}

	public clone(): memoryRpcStream {
		return $.markAsStructValue(new memoryRpcStream(this))
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		await memoryRpcStream.prototype.CloseSend.call(m)
		await $.pointerValue<memoryRpcStream>(m).cancelLocal.Do($.functionValue(async (): globalThis.Promise<void> => {
			await $.pointerValue<memoryRpcStream>(m).cancel!()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return null
	}

	public async CloseSend(): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		await $.pointerValue<memoryRpcStream>(m).closeSend.Do($.functionValue((): void => {
			$.pointerValue<memoryRpcStream>(m).send!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return null
	}

	public Context(): context.Context | null {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		return $.pointerValue<memoryRpcStream>(m).ctx
	}

	public async MsgRecv(msg: srpc.Message): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		while (true) {
			let __goscriptTuple0: any = await memoryRpcStream.prototype.Recv.call(m)
			let pkt: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple0[0]
			let err = __goscriptTuple0[1]
			if (err != null) {
				return err
			}
			let data: $.Slice<number> = rpcstream.RpcStreamPacket.prototype.GetData.call(pkt)
			if ($.len(data) == 0) {
				continue
			}
			return $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg).UnmarshalVT(data)
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async MsgSend(msg: srpc.Message): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		let __goscriptTuple1: any = await $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg).MarshalVT()
		let data: $.Slice<number> = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return err
		}
		return memoryRpcStream.prototype.Send.call(m, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<rpcstream.isRpcStreamPacket_Body | null>(new rpcstream.RpcStreamPacket_Data({Data: data}), "*rpcstream.RpcStreamPacket_Data", /* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket_Data"))}))
	}

	public async Recv(): globalThis.Promise<[rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, $.GoError]> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, [rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<memoryRpcStream>(m).ctx).Done(),
				onSelected: async (__goscriptSelect0Result) => {
					return [null, context.Canceled]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<memoryRpcStream>(m).recv,
				onSelected: async (__goscriptSelect0Result) => {
					let pkt = __goscriptSelect0Result.value
					let ok = __goscriptSelect0Result.ok
					if (!ok) {
						return [null, io.EOF]
					}
					return [pkt, null]
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Send(pkt: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<memoryRpcStream>(m).ctx).Done(),
				onSelected: async (__goscriptSelect1Result) => {
					return context.Canceled
				}
			},
			{
				id: 1,
				isSend: true,
				channel: $.pointerValue<memoryRpcStream>(m).send,
				value: rpcstream.RpcStreamPacket.prototype.CloneVT.call(pkt),
				onSelected: async (__goscriptSelect1Result) => {
					return null
				}
			}
		], false)
		if (__goscriptSelect1HasReturn) {
			return __goscriptSelect1Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	static {
		$.bindStructFields(this.prototype, ["ctx", "cancel", "recv", "send", "closeSend", "cancelLocal"])
	}

	static __typeInfo = $.registerStructType(
		"main.memoryRpcStream",
		() => new memoryRpcStream(),
		() => [$.methodSignature("Close", [], ["error"]), $.methodSignature("CloseSend", [], ["error"]), $.methodSignature("Context", [], ["context.Context"]), $.methodSignature("MsgRecv", [["msg", "protobuf_go_lite.Message"]], ["error"]), $.methodSignature("MsgSend", [["msg", "protobuf_go_lite.Message"]], ["error"]), $.methodSignature("Recv", [], [/* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket"), "error"]), $.methodSignature("Send", [["pkt", /* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket")]], ["error"])],
		memoryRpcStream,
		() => [/* @__PURE__ */ $.structField("ctx", "context.Context", [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("cancel", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), [1], 16, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("recv", /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket"), "receive"), [2], 24, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("send", /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket"), "send"), [3], 32, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("closeSend", "sync.Once", [4], 40, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("cancelLocal", "sync.Once", [5], 52, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" })]
	)
}

export class memoryRpcContext {
	public declare done: $.Channel<{}> | null

	public declare once: sync.Once

	public _fields: {
		done: $.Channel<{}> | null
		once: sync.Once
	}

	constructor(init?: Partial<{done?: $.Channel<{}> | null, once?: sync.Once}>) {
		this._fields = {
			done: init?.done ?? (null! as $.Channel<{}> | null),
			once: init?.once ? $.markAsStructValue($.cloneStructValue(init.once)) : $.markAsStructValue(new sync.Once())
		}
	}

	public clone(): memoryRpcContext {
		return $.markAsStructValue(new memoryRpcContext(this))
	}

	public Deadline(): [time.Time, boolean] {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this
		return [$.markAsStructValue(new time.Time()), false]
	}

	public Done(): $.Channel<{}> | null {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this
		return $.pointerValue<memoryRpcContext>(m).done
	}

	public async Err(): globalThis.Promise<$.GoError> {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this
		const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<memoryRpcContext>(m).done,
				onSelected: async (__goscriptSelect2Result) => {
					return context.Canceled
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect2Result) => {
					return null
				}
			}
		], true)
		if (__goscriptSelect2HasReturn) {
			return __goscriptSelect2Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Value(key: any): globalThis.Promise<any> {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this
		return $.pointerValue<Exclude<context.Context, null>>(context.Background()).Value(key)
	}

	static {
		$.bindStructFields(this.prototype, ["done", "once"])
	}

	static __typeInfo = $.registerStructType(
		"main.memoryRpcContext",
		() => new memoryRpcContext(),
		() => [$.methodSignature("Deadline", [], ["time.Time", /* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Done", [], [/* @__PURE__ */ $.channelType({ kind: $.TypeKind.Struct, methods: [], fields: [] }, "receive")]), $.methodSignature("Err", [], ["error"]), $.methodSignature("Value", [["key", { kind: $.TypeKind.Interface, methods: [] }]], [{ kind: $.TypeKind.Interface, methods: [] }])],
		memoryRpcContext,
		() => [/* @__PURE__ */ $.structField("done", /* @__PURE__ */ $.channelType({ kind: $.TypeKind.Struct, methods: [], fields: [] }, "both"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("once", "sync.Once", [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" })]
	)
}

export async function closeEmbedded(strm: embeddedStream): globalThis.Promise<$.GoError> {
	return $.pointerValue<Exclude<srpc.Stream, null>>(strm.Stream).CloseSend()
}

export async function recvOne(__typeArgs: $.GenericTypeArgs | undefined, strm: srpc.StreamRecv | null): globalThis.Promise<$.GoError> {
	let [, err] = await $.callInterfaceMethod($.pointerValue<Exclude<srpc.StreamRecv, null>>(strm), "Recv", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	return err
}

export function newMemoryRpcContext(): [memoryRpcContext | $.VarRef<memoryRpcContext> | null, (() => void) | null] {
	let ctx: memoryRpcContext | $.VarRef<memoryRpcContext> | null = new memoryRpcContext({done: $.makeChannel<{}>(0, {}, "both")})
	return [ctx, $.functionValue(async (): globalThis.Promise<void> => {
		await $.pointerValue<memoryRpcContext>(ctx).once.Do($.functionValue((): void => {
			$.pointerValue<memoryRpcContext>(ctx).done!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))]
}

export function newMemoryRpcStreamPair(): [memoryRpcStream | $.VarRef<memoryRpcStream> | null, memoryRpcStream | $.VarRef<memoryRpcStream> | null] {
	let __goscriptTuple2: any = newMemoryRpcContext()
	let aCtx: memoryRpcContext | $.VarRef<memoryRpcContext> | null = __goscriptTuple2[0]
	let aCancel: (() => void) | null = __goscriptTuple2[1]
	let __goscriptTuple3: any = newMemoryRpcContext()
	let bCtx: memoryRpcContext | $.VarRef<memoryRpcContext> | null = __goscriptTuple3[0]
	let bCancel: (() => void) | null = __goscriptTuple3[1]
	let aToB: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null = $.makeChannel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null>(16, null! as rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, "both")
	let bToA: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null = $.makeChannel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null>(16, null! as rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, "both")
	return [new memoryRpcStream({ctx: $.interfaceValue<context.Context | null>(aCtx, "*main.memoryRpcContext", /* @__PURE__ */ $.pointerType("main.memoryRpcContext")), cancel: aCancel, recv: bToA, send: aToB}), new memoryRpcStream({ctx: $.interfaceValue<context.Context | null>(bCtx, "*main.memoryRpcContext", /* @__PURE__ */ $.pointerType("main.memoryRpcContext")), cancel: bCancel, recv: aToB, send: bToA})]
}

export async function openHeldStreams(ctx: context.Context | null, client: srpc.Client | null, count: number): globalThis.Promise<[$.Slice<srpc.Stream | null>, boolean]> {
	let resultCh: $.Channel<streamOpenResult> | null = $.makeChannel<streamOpenResult>(count, $.markAsStructValue(new streamOpenResult()), "both")
	for (let i = 0; i < count; i++) {
		queueMicrotask(async () => { await (async (idx: number): globalThis.Promise<void> => {
			let [strm, err] = await $.pointerValue<Exclude<srpc.Client, null>>(client).NewStream(ctx, "svc", "hold", null)
			if (err == null) {
				err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([$.uint(idx, 8)]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
			}
			await $.chanSend(resultCh, $.markAsStructValue(new streamOpenResult({stream: strm, err: err})))
		})(i) })
	}

	let streams: $.Slice<srpc.Stream | null> = $.makeSlice<srpc.Stream | null>(0, count)
	for (let __rangeIndex = 0; __rangeIndex < count; __rangeIndex++) {
		const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, [$.Slice<srpc.Stream | null>, boolean]>([
			{
				id: 0,
				isSend: false,
				channel: resultCh,
				onSelected: async (__goscriptSelect3Result) => {
					let result = __goscriptSelect3Result.value
					if (result.err != null) {
						await $.println("hold open error:", await $.pointerValue<Exclude<$.GoError, null>>(result.err).Error())
						return [streams, false]
					}
					streams = $.append(streams, result.stream, $.appendZeros.nil)
				}
			},
			{
				id: 1,
				isSend: false,
				channel: time.After(5000000000n),
				onSelected: async (__goscriptSelect3Result) => {
					await $.println("hold open timeout")
					return [streams, false]
				}
			}
		], false)
		if (__goscriptSelect3HasReturn) {
			return __goscriptSelect3Value
		}
	}

	return [streams, true]
}

export async function closeHeldStreams(streams: $.Slice<srpc.Stream | null>): globalThis.Promise<boolean> {
	for (let __goscriptRangeTarget0 = streams, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let strm = __goscriptRangeTarget0![__rangeIndex]
		{
			let err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).CloseSend()
			if (err != null) {
				await $.println("hold close send error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
				return false
			}
		}
		let resp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
		{
			let err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(resp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
			if (err != null) {
				await $.println("hold recv error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
				return false
			}
		}
		if (($.len(srpc.RawMessage.prototype.GetData.call(resp)) != 1) || ($.uint($.arrayIndex(srpc.RawMessage.prototype.GetData.call(resp)!, 0), 8) != $.uint(1, 8))) {
			await $.println("hold response mismatch")
			return false
		}
	}
	return true
}

export async function probeConcurrentStreams(ctx: context.Context | null, client: srpc.Client | null, count: number): globalThis.Promise<boolean> {
	let resultCh: $.Channel<streamProbeResult> | null = $.makeChannel<streamProbeResult>(count, $.markAsStructValue(new streamProbeResult()), "both")
	for (let i = 0; i < count; i++) {
		queueMicrotask(async () => { await (async (idx: number): globalThis.Promise<void> => {
			let [total, err] = await probeStream(ctx, client, $.uint($.uint(idx + 1, 8), 8), $.uint($.uint(idx + 2, 8), 8))
			if (err != null) {
				await $.chanSend(resultCh, (await (async () => { const __goscriptLiteralField0 = await $.pointerValue<Exclude<$.GoError, null>>(err).Error(); return $.markAsStructValue(new streamProbeResult({err: __goscriptLiteralField0})) })()))
				return
			}
			await $.chanSend(resultCh, $.markAsStructValue(new streamProbeResult({total: total})))
		})(i) })
	}

	for (let i = 0; i < count; i++) {
		const [__goscriptSelect4HasReturn, __goscriptSelect4Value] = await $.selectStatement<any, boolean>([
			{
				id: 0,
				isSend: false,
				channel: resultCh,
				onSelected: async (__goscriptSelect4Result) => {
					let result = __goscriptSelect4Result.value
					if (!$.stringEqual(result.err, "")) {
						await $.println("probe error:", result.err)
						return false
					}
					if (result.total != 2) {
						await $.println("probe total mismatch:", i, result.total)
						return false
					}
				}
			},
			{
				id: 1,
				isSend: false,
				channel: time.After(5000000000n),
				onSelected: async (__goscriptSelect4Result) => {
					await $.println("probe timeout:", i)
					return false
				}
			}
		], false)
		if (__goscriptSelect4HasReturn) {
			return __goscriptSelect4Value
		}
	}
	return true
}

export async function probeStream(ctx: context.Context | null, client: srpc.Client | null, a: number, b: number): globalThis.Promise<[number, $.GoError]> {
	let [strm, err] = await $.pointerValue<Exclude<srpc.Client, null>>(client).NewStream(ctx, "svc", "stream", null)
	if (err != null) {
		return [0, err]
	}
	{
		let __goscriptShadow0 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([a]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
		if (__goscriptShadow0 != null) {
			return [0, __goscriptShadow0]
		}
	}
	{
		let __goscriptShadow1 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([b]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
		if (__goscriptShadow1 != null) {
			return [0, __goscriptShadow1]
		}
	}
	{
		let __goscriptShadow2 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).CloseSend()
		if (__goscriptShadow2 != null) {
			return [0, __goscriptShadow2]
		}
	}
	let resp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow3 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(resp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
		if (__goscriptShadow3 != null) {
			return [0, __goscriptShadow3]
		}
	}
	let data: $.Slice<number> = srpc.RawMessage.prototype.GetData.call(resp)
	if ($.len(data) != 1) {
		return [$.len(data), null]
	}
	return [$.int($.arrayIndex(data!, 0)), null]
}

export function newRoutedRpcStreamClient(ctx: context.Context | null, componentID: string, getter: rpcstream.RpcStreamGetter | null, waitAck: boolean, results: $.Channel<rpcStreamServerResult> | null): srpc.Client | null {
	return rpcstream.NewRpcStreamClient(undefined, $.functionValue(async (callCtx: context.Context | null): globalThis.Promise<[memoryRpcStream | $.VarRef<memoryRpcStream> | null, $.GoError]> => {
		let __goscriptTuple4: any = newMemoryRpcStreamPair()
		let client: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple4[0]
		let server: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple4[1]
		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			let err = await rpcstream.HandleRpcStream($.interfaceValue<rpcstream.RpcStream | null>(server, "*main.memoryRpcStream", /* @__PURE__ */ $.pointerType("main.memoryRpcStream")), getter)
			if (((err != null) && (!$.comparableEqual(err, context.Canceled))) && (!$.comparableEqual(err, io.EOF))) {
				const [__goscriptSelect5HasReturn, __goscriptSelect5Value] = await $.selectStatement<any, void>([
					{
						id: 0,
						isSend: true,
						channel: results,
						value: (await (async () => { const __goscriptLiteralField1 = await $.pointerValue<Exclude<$.GoError, null>>(err).Error(); return $.markAsStructValue(new rpcStreamServerResult({err: __goscriptLiteralField1})) })()),
					},
					{
						id: -1,
						isSend: false,
						channel: null,
					}
				], true)
				if (__goscriptSelect5HasReturn) {
					return __goscriptSelect5Value
				}
			}
		})() })
		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			const [__goscriptSelect6HasReturn, __goscriptSelect6Value] = await $.selectStatement<any, void>([
				{
					id: 0,
					isSend: false,
					channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
					onSelected: async (__goscriptSelect6Result) => {
						await memoryRpcStream.prototype.Close.call(client)
						await memoryRpcStream.prototype.Close.call(server)
					}
				},
				{
					id: 1,
					isSend: false,
					channel: await $.pointerValue<Exclude<context.Context, null>>(callCtx).Done(),
					onSelected: async (__goscriptSelect6Result) => {
						await memoryRpcStream.prototype.Close.call(client)
						await memoryRpcStream.prototype.Close.call(server)
					}
				}
			], false)
			if (__goscriptSelect6HasReturn) {
				return __goscriptSelect6Value
			}
		})() })
		return [client, null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context"], results: [/* @__PURE__ */ $.pointerType("main.memoryRpcStream"), "error"] } as $.FunctionTypeInfo)), componentID, waitAck)
}

export async function exerciseRpcStreamClientPressure(ctx: context.Context | null): globalThis.Promise<boolean> {
	let mux = srpc.NewMux(null)
	{
		let err = await $.pointerValue<Exclude<srpc.Mux, null>>(mux).Register($.interfaceValue<srpc.Handler | null>($.markAsStructValue(new handler()), "main.handler", "main.handler"))
		if (err != null) {
			await $.println("rpcstream pressure register error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}

	let results: $.Channel<rpcStreamServerResult> | null = $.makeChannel<rpcStreamServerResult>(8, $.markAsStructValue(new rpcStreamServerResult()), "both")
	let getter: ((ctx: context.Context | null, componentID: string, released: (() => void) | null) => [srpc.Invoker | null, (() => void) | null, $.GoError] | globalThis.Promise<[srpc.Invoker | null, (() => void) | null, $.GoError]>) | null = $.functionValue((ctx: context.Context | null, componentID: string, released: (() => void) | null): [srpc.Invoker | null, (() => void) | null, $.GoError] => {
		if ((!$.stringEqual(componentID, "component-root")) && (!$.stringEqual(componentID, "component-space"))) {
			return [null, (null as (() => void) | null), null]
		}
		return [(mux as srpc.Invoker | null), (null as (() => void) | null), null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context", /* @__PURE__ */ $.basicType("string"), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)], results: ["srpc.Invoker", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "error"] } as $.FunctionTypeInfo))

	let rootClient = newRoutedRpcStreamClient(ctx, "component-root", getter, true, results)
	let __goscriptTuple5: any = await openHeldStreams(ctx, rootClient, 64)
	let held: $.Slice<srpc.Stream | null> = __goscriptTuple5[0]
	let ok = __goscriptTuple5[1]
	if (!ok) {
		return false
	}

	let spaceClient = newRoutedRpcStreamClient(ctx, "component-space", getter, true, results)
	if (!await probeConcurrentStreams(ctx, spaceClient, 16)) {
		return false
	}
	if (!await closeHeldStreams(held)) {
		return false
	}

	const [__goscriptSelect7HasReturn, __goscriptSelect7Value] = await $.selectStatement<any, boolean>([
		{
			id: 0,
			isSend: false,
			channel: results,
			onSelected: async (__goscriptSelect7Result) => {
				let result = __goscriptSelect7Result.value
				await $.println("rpcstream pressure server error:", result.err)
				return false
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
		}
	], true)
	if (__goscriptSelect7HasReturn) {
		return __goscriptSelect7Value
	}
	return true
}

export async function exerciseRpcStreamHandle(): globalThis.Promise<boolean> {
	await using __defer = new $.AsyncDisposableStack()
	let __goscriptTuple6: any = newMemoryRpcStreamPair()
	let client: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple6[0]
	let server: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple6[1]
	__defer.defer(async () => { await memoryRpcStream.prototype.Close.call(client) })
	__defer.defer(async () => { await memoryRpcStream.prototype.Close.call(server) })

	let invoked: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	let done: $.Channel<$.GoError> | null = $.makeChannel<$.GoError>(1, null! as $.GoError, "both")
	queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
		await $.chanSend(done, await rpcstream.HandleRpcStream($.interfaceValue<rpcstream.RpcStream | null>(server, "*main.memoryRpcStream", /* @__PURE__ */ $.pointerType("main.memoryRpcStream")), $.functionValue(async (ctx: context.Context | null, componentID: string, released: (() => void) | null): globalThis.Promise<[srpc.Invoker | null, (() => void) | null, $.GoError]> => {
			if (!$.stringEqual(componentID, "component-a")) {
				await $.chanSend(invoked, false)
				return [null, (null as (() => void) | null), null]
			}
			return [$.namedValueInterfaceValue<srpc.Invoker | null>($.namedFunction($.functionValue(async (serviceID: string, methodID: string, strm: srpc.Stream | null): globalThis.Promise<[boolean, $.GoError]> => {
				await $.chanSend(invoked, ($.stringEqual(serviceID, "svc")) && ($.stringEqual(methodID, "method")))
				return [true, null]
			}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string"), "srpc.Stream"], results: [/* @__PURE__ */ $.basicType("bool"), "error"] } as $.FunctionTypeInfo)), "srpc.InvokerFunc", ({ kind: $.TypeKind.Function, name: "srpc.InvokerFunc", params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string"), "srpc.Stream"], results: [/* @__PURE__ */ $.basicType("bool"), "error"] } as $.FunctionTypeInfo)), "srpc.InvokerFunc", {InvokeMethod: (receiver: any, ...args: any[]) => (srpc.InvokerFunc_InvokeMethod as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, ({ kind: $.TypeKind.Function, name: "srpc.InvokerFunc", params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string"), "srpc.Stream"], results: [/* @__PURE__ */ $.basicType("bool"), "error"] } as $.FunctionTypeInfo), [$.methodSignature("InvokeMethod", [["serviceID", /* @__PURE__ */ $.basicType("string")], ["methodID", /* @__PURE__ */ $.basicType("string")], ["strm", "srpc.Stream"]], [/* @__PURE__ */ $.basicType("bool"), "error"])]), (null as (() => void) | null), null]
		}, ({ kind: $.TypeKind.Function, params: ["context.Context", /* @__PURE__ */ $.basicType("string"), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)], results: ["srpc.Invoker", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "error"] } as $.FunctionTypeInfo))))
	})() })

	{
		let err = await memoryRpcStream.prototype.Send.call(client, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<rpcstream.isRpcStreamPacket_Body | null>(new rpcstream.RpcStreamPacket_Init({Init: new rpcstream.RpcStreamInit({ComponentId: "component-a"})}), "*rpcstream.RpcStreamPacket_Init", /* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket_Init"))}))
		if (err != null) {
			await $.println("rpcstream init send error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}

	let __goscriptTuple7: any = await memoryRpcStream.prototype.Recv.call(client)
	let ack: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple7[0]
	let err = __goscriptTuple7[1]
	if (err != null) {
		await $.println("rpcstream ack recv error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return false
	}
	if ((rpcstream.RpcStreamPacket.prototype.GetAck.call(ack) == null) || (!$.stringEqual(rpcstream.RpcAck.prototype.GetError.call(rpcstream.RpcStreamPacket.prototype.GetAck.call(ack)), ""))) {
		await $.println("rpcstream ack mismatch")
		return false
	}

	let __goscriptTuple8: any = srpc.Packet.prototype.MarshalVT.call(srpc.NewCallStartPacket("svc", "method", null, false))
	let start: $.Slice<number> = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		await $.println("rpcstream call start marshal error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return false
	}
	{
		let __goscriptShadow4 = await memoryRpcStream.prototype.Send.call(client, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<rpcstream.isRpcStreamPacket_Body | null>(new rpcstream.RpcStreamPacket_Data({Data: start}), "*rpcstream.RpcStreamPacket_Data", /* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket_Data"))}))
		if (__goscriptShadow4 != null) {
			await $.println("rpcstream call start send error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow4).Error())
			return false
		}
	}

	const [__goscriptSelect8HasReturn, __goscriptSelect8Value] = await $.selectStatement<any, boolean>([
		{
			id: 0,
			isSend: false,
			channel: invoked,
			onSelected: async (__goscriptSelect8Result) => {
				let ok = __goscriptSelect8Result.value
				if (!ok) {
					await $.println("rpcstream invoke mismatch")
					return false
				}
			}
		},
		{
			id: 1,
			isSend: false,
			channel: time.After(5000000000n),
			onSelected: async (__goscriptSelect8Result) => {
				await $.println("rpcstream invoke timeout")
				return false
			}
		}
	], false)
	if (__goscriptSelect8HasReturn) {
		return __goscriptSelect8Value
	}

	let __goscriptTuple9: any = await memoryRpcStream.prototype.Recv.call(client)
	let resp: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		await $.println("rpcstream response recv error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return false
	}
	if (rpcstream.RpcStreamPacket.prototype.GetData.call(resp) == null) {
		await $.println("rpcstream response missing data")
		return false
	}

	const [__goscriptSelect9HasReturn, __goscriptSelect9Value] = await $.selectStatement<any, boolean>([
		{
			id: 0,
			isSend: false,
			channel: done,
			onSelected: async (__goscriptSelect9Result) => {
				let err = __goscriptSelect9Result.value
				if (err != null) {
					await $.println("rpcstream handle error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
					return false
				}
			}
		},
		{
			id: 1,
			isSend: false,
			channel: time.After(5000000000n),
			onSelected: async (__goscriptSelect9Result) => {
				await $.println("rpcstream handle timeout")
				return false
			}
		}
	], false)
	if (__goscriptSelect9HasReturn) {
		return __goscriptSelect9Value
	}

	return true
}

export async function exercisePushablePacketWriter(): globalThis.Promise<boolean> {
	await using __defer = new $.AsyncDisposableStack()
	let pushed: $.Slice<$.Slice<number>> = null! as $.Slice<$.Slice<number>>
	let ended = false
	let pushFn = $.markAsStructValue($.cloneStructValue(js.FuncOf($.functionValue(async (_this: js.Value, args: $.Slice<js.Value>): globalThis.Promise<any> => {
		if ($.len(args) != 1) {
			await $.println("push arg count:", $.len(args))
			return null
		}
		let data: $.Slice<number> = $.makeSlice<number>($.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Length(), undefined, "byte")
		js.CopyBytesToGo(data, $.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))))
		pushed = $.append(pushed, data, $.appendZeros.nil)
		return null
	}, ({ kind: $.TypeKind.Function, params: ["js.Value", /* @__PURE__ */ $.sliceType("js.Value")], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
	__defer.defer(() => { $.markAsStructValue($.cloneStructValue(pushFn)).Release() })
	let endFn = $.markAsStructValue($.cloneStructValue(js.FuncOf($.functionValue((_this: js.Value, args: $.Slice<js.Value>): any => {
		ended = true
		return null
	}, ({ kind: $.TypeKind.Function, params: ["js.Value", /* @__PURE__ */ $.sliceType("js.Value")], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
	__defer.defer(() => { $.markAsStructValue($.cloneStructValue(endFn)).Release() })

	let writer: srpc.PushablePacketWriter | $.VarRef<srpc.PushablePacketWriter> | null = srpc.NewPushablePacketWriter($.markAsStructValue($.cloneStructValue(js.ValueOf($.interfaceValue($.makeMap<string, any>([["push", $.interfaceValue($.markAsStructValue($.cloneStructValue(pushFn)), "js.Func", "js.Func")], ["end", $.interfaceValue($.markAsStructValue($.cloneStructValue(endFn)), "js.Func", "js.Func")]]), "map[string]any", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }))))))
	{
		let err = srpc.PushablePacketWriter.prototype.WritePacket.call(writer, srpc.NewCallStartPacket("svc", "push", new Uint8Array([7, 8, 9]) as $.Slice<number>, false))
		if (err != null) {
			await $.println("pushable call-start error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	{
		let err = srpc.PushablePacketWriter.prototype.WritePacket.call(writer, srpc.NewCallCancelPacket())
		if (err != null) {
			await $.println("pushable cancel error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	{
		let err = srpc.PushablePacketWriter.prototype.Close.call(writer)
		if (err != null) {
			await $.println("pushable close error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	if (!ended) {
		await $.println("pushable end missing")
		return false
	}
	if ($.len(pushed) != 2) {
		await $.println("pushable packets:", $.len(pushed))
		return false
	}

	let sawStart = false
	let startHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null = srpc.NewPacketDataHandler($.functionValue((pkt: srpc.Packet | $.VarRef<srpc.Packet> | null): $.GoError => {
		let start: srpc.CallStart | $.VarRef<srpc.CallStart> | null = srpc.Packet.prototype.GetCallStart.call(pkt)
		if (start == null) {
			return io.ErrUnexpectedEOF
		}
		sawStart = (($.stringEqual(srpc.CallStart.prototype.GetRpcService.call(start), "svc")) && ($.stringEqual(srpc.CallStart.prototype.GetRpcMethod.call(start), "push"))) && ($.stringEqual($.bytesToString(srpc.CallStart.prototype.GetData.call(start)), $.bytesToString(new Uint8Array([7, 8, 9]) as $.Slice<number>)))
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("srpc.Packet")], results: ["error"] } as $.FunctionTypeInfo)))
	{
		let err = await startHandler!($.arrayIndex(pushed!, 0))
		if (err != null) {
			await $.println("pushable start decode error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	if (!sawStart) {
		await $.println("pushable start mismatch")
		return false
	}

	let sawCancel = false
	let cancelHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null = srpc.NewPacketDataHandler($.functionValue((pkt: srpc.Packet | $.VarRef<srpc.Packet> | null): $.GoError => {
		sawCancel = srpc.Packet.prototype.GetCallCancel.call(pkt)
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("srpc.Packet")], results: ["error"] } as $.FunctionTypeInfo)))
	{
		let err = await cancelHandler!($.arrayIndex(pushed!, 1))
		if (err != null) {
			await $.println("pushable cancel decode error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return false
		}
	}
	if (!sawCancel) {
		await $.println("pushable cancel missing")
		return false
	}

	return true
}

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let [ctx, cancel] = context.WithTimeout($.pointerValueOrNil(context.Background())!, 20000000000n)
	__defer.defer(async () => { await cancel!() })

	let mux = srpc.NewMux(null)
	await $.pointerValue<Exclude<srpc.Mux, null>>(mux).Register($.interfaceValue<srpc.Handler | null>($.markAsStructValue(new handler()), "main.handler", "main.handler"))
	await $.pointerValue<Exclude<srpc.Mux, null>>(mux).InvokeMethod("svc", "method", null)
	closeEmbedded
	$.functionValue(async (strm: srpc.StreamRecv | null): globalThis.Promise<$.GoError> => await recvOne({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, strm), ({ kind: $.TypeKind.Function, params: ["srpc.StreamRecv"], results: ["error"] } as $.FunctionTypeInfo))
	srpc.NewRawMessage(new Uint8Array([1, 2, 3]) as $.Slice<number>, true)
	let server: srpc.Server | $.VarRef<srpc.Server> | null = srpc.NewServer((mux as srpc.Invoker | null))
	let client = srpc.NewClient(srpc.NewServerPipe(server))
	let unaryResp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	let err = await $.pointerValue<Exclude<srpc.Client, null>>(client).ExecCall(ctx, "svc", "method", $.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")), $.interfaceValue<srpc.Message>(unaryResp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
	if (err != null) {
		await $.println("exec error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	await $.println("exec bytes:", $.len(srpc.RawMessage.prototype.GetData.call(unaryResp)))
	let __goscriptTuple10: any = await $.pointerValue<Exclude<srpc.Client, null>>(client).NewStream(ctx, "svc", "stream", null)
	let strm = __goscriptTuple10[0]
	err = __goscriptTuple10[1]
	if (err != null) {
		await $.println("stream open error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([1, 2, 3]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([4, 5]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).CloseSend()
	let resp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow5 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(resp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
		if (__goscriptShadow5 != null) {
			await $.println("stream recv error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow5).Error())
			return
		}
	}
	let data: $.Slice<number> = srpc.RawMessage.prototype.GetData.call(resp)
	if ($.len(data) != 1) {
		await $.println("stream response length:", $.len(data))
		return
	}
	await $.println("stream bytes:", $.uint($.arrayIndex(data!, 0), 8))
	let emptyResp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow6 = await $.pointerValue<Exclude<srpc.Client, null>>(client).ExecCall(ctx, "svc", "empty", $.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")), $.interfaceValue<srpc.Message>(emptyResp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")))
		if (__goscriptShadow6 != null) {
			await $.println("empty exec error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow6).Error())
			return
		}
	}
	await $.println("empty exec bytes:", $.len(srpc.RawMessage.prototype.GetData.call(emptyResp)))

	let __goscriptTuple11: any = await openHeldStreams(ctx, client, 32)
	let held: $.Slice<srpc.Stream | null> = __goscriptTuple11[0]
	let ok = __goscriptTuple11[1]
	if (!ok) {
		return
	}
	if (!await probeConcurrentStreams(ctx, client, 16)) {
		return
	}
	if (!await closeHeldStreams(held)) {
		return
	}
	await $.println("pressure streams: ok")
	if (!await exercisePushablePacketWriter()) {
		return
	}
	await $.println("pushable writer: ok")
	if (!await exerciseRpcStreamHandle()) {
		return
	}
	await $.println("rpcstream handle: ok")
	if (!await exerciseRpcStreamClientPressure(ctx)) {
		return
	}
	await $.println("rpcstream pressure: ok")
	await $.println("success: native starpc srpc")
}

if ($.isMainScript(import.meta)) {
	await main()
}
