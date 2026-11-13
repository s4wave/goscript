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
import "@goscript/io/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

export class handler {
	constructor(__goscriptValue?: boolean) {
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): handler {
		return new handler(true)
	}

	public __goscriptAssign(source: handler): this {
		return this
	}

	public GetMethodIDs(): $.Slice<string> {
		return $.arrayToSlice<string>(["method", "stream", "hold", "empty"])
	}

	public GetServiceID(): string {
		return "svc"
	}

	public async InvokeMethod(serviceID: string, methodID: string, strm: srpc.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
		if ($.stringEqual(methodID, "empty")) {
			return [true, (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgSend($.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(null, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)]
		}
		if (($.stringEqual(methodID, "stream")) || ($.stringEqual(methodID, "hold"))) {
			let total = 0
			while (true) {
				let msg = srpc.NewRawMessage(null, false)
				let err = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgRecv($.interfaceValue<srpc.Message | null>(msg, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
				if ($.comparableEqual(err, io.EOF)) {
					break
				}
				if (err != null) {
					return [true, err]
				}
				total += $.sliceLen((msg !== null && (msg as any).__isVarRef !== true && (msg as any).__goValue === undefined ? ((msg as any) as srpc.RawMessage).GetData() : srpc.RawMessage.prototype.GetData.call(msg)))
			}
			return [true, (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgSend($.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(new Uint8Array([$.uint(total, 8)]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)]
		}
		if (strm == null) {
			return [true, null]
		}
		return [true, (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgSend($.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(new Uint8Array([111, 107]), false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)]
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

	constructor(__goscriptValue?: boolean, Stream$?: srpc.Stream | null) {
		this.Stream = Stream$ ?? (null! as srpc.Stream | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): embeddedStream {
		return new embeddedStream(true, this.Stream)
	}

	public __goscriptAssign(source: embeddedStream): this {
		this.Stream = $.assignFieldValue(this.Stream, source.Stream)
		return this
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

	constructor(__goscriptValue?: boolean, stream$?: srpc.Stream | null, err$?: $.GoError) {
		this.stream = stream$ ?? (null! as srpc.Stream | null)
		this.err = err$ ?? (null! as $.GoError)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): streamOpenResult {
		return new streamOpenResult(true, this.stream, this.err)
	}

	public __goscriptAssign(source: streamOpenResult): this {
		this.stream = $.assignFieldValue(this.stream, source.stream)
		this.err = $.assignFieldValue(this.err, source.err)
		return this
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

	constructor(__goscriptValue?: boolean, total$?: number, err$?: string) {
		this.total = total$ ?? 0
		this.err = err$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): streamProbeResult {
		return new streamProbeResult(true, this.total, this.err)
	}

	public __goscriptAssign(source: streamProbeResult): this {
		this.total = source.total
		this.err = source.err
		return this
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

	constructor(__goscriptValue?: boolean, err$?: string) {
		this.err = err$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): rpcStreamServerResult {
		return new rpcStreamServerResult(true, this.err)
	}

	public __goscriptAssign(source: rpcStreamServerResult): this {
		this.err = source.err
		return this
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

	constructor(__goscriptValue?: boolean, ctx$?: context.Context | null, cancel$?: (() => void) | null, recv$?: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null, send$?: $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null, closeSend$?: sync.Once, cancelLocal$?: sync.Once) {
		this.ctx = ctx$ ?? (null! as context.Context | null)
		this.cancel = cancel$ ?? (null! as (() => void) | null)
		this.recv = recv$ ?? (null! as $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null)
		this.send = send$ ?? (null! as $.Channel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null> | null)
		this.closeSend = closeSend$ ?? $.markAsStructValue(new sync.Once())
		this.cancelLocal = cancelLocal$ ?? $.markAsStructValue(new sync.Once())
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): memoryRpcStream {
		return new memoryRpcStream(true, this.ctx, this.cancel, this.recv, this.send, $.markAsStructValue($.cloneStructValue(this.closeSend)), $.markAsStructValue($.cloneStructValue(this.cancelLocal)))
	}

	public __goscriptAssign(source: memoryRpcStream): this {
		this.ctx = $.assignFieldValue(this.ctx, source.ctx)
		this.cancel = source.cancel
		this.recv = source.recv
		this.send = source.send
		$.assignStruct(this.closeSend, source.closeSend)
		$.assignStruct(this.cancelLocal, source.cancelLocal)
		return this
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this;
		const m$: memoryRpcStream = m == null ? $.pointerTarget<memoryRpcStream>(m) : (m as any).__isVarRef === true ? (m as any).value : (m as any).__goValue === undefined ? (m as any) : $.pointerTarget<memoryRpcStream>(m);
		;(m !== null && (m as any).__isVarRef !== true && (m as any).__goValue === undefined ? ((m as any) as memoryRpcStream).CloseSend() : memoryRpcStream.prototype.CloseSend.call(m))
		await (m$ as memoryRpcStream).cancelLocal.Do($.functionValue(async () => {
			void (__goscriptAwait = (m$ as memoryRpcStream).cancel!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return null
	}

	public CloseSend(): $.GoError {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this;
		const m$: memoryRpcStream = m == null ? $.pointerTarget<memoryRpcStream>(m) : (m as any).__isVarRef === true ? (m as any).value : (m as any).__goValue === undefined ? (m as any) : $.pointerTarget<memoryRpcStream>(m)
		void (m$ as memoryRpcStream).closeSend.Do($.functionValue(() => {
			void (m$ as memoryRpcStream).send!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return null
	}

	public Context(): context.Context | null {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this;
		return $.pointerValue<memoryRpcStream>(m).ctx
	}

	public async MsgRecv(msg: srpc.Message | null): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this;
		while (true) {
			let __goscriptTuple0: any = await (m !== null && (m as any).__isVarRef !== true && (m as any).__goValue === undefined ? ((m as any) as memoryRpcStream).Recv() : memoryRpcStream.prototype.Recv.call(m))
			let pkt: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple0[0]
			let err: $.GoError = __goscriptTuple0[1]
			if (err != null) {
				return err
			}
			let data = (pkt !== null && (pkt as any).__isVarRef !== true && (pkt as any).__goValue === undefined ? ((pkt as any) as rpcstream.RpcStreamPacket).GetData() : rpcstream.RpcStreamPacket.prototype.GetData.call(pkt))
			if ($.sliceLen(data) == 0) {
				continue
			}
			return (msg !== null && (msg as any).__isVarRef !== true && ((msg as any).__goValue === undefined || (msg as any).__goType?.charCodeAt(0) !== 42) ? (msg as Exclude<protobuf_go_lite.Message, null>) : $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg)).UnmarshalVT(data)
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async MsgSend(msg: srpc.Message | null): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this;
		let __goscriptTuple1: any = await (msg !== null && (msg as any).__isVarRef !== true && ((msg as any).__goValue === undefined || (msg as any).__goType?.charCodeAt(0) !== 42) ? (msg as Exclude<protobuf_go_lite.Message, null>) : $.pointerValue<Exclude<protobuf_go_lite.Message, null>>(msg)).MarshalVT()
		let data: $.Slice<number> = __goscriptTuple1[0]
		let err: $.GoError = __goscriptTuple1[1]
		if (err != null) {
			return err
		}
		return memoryRpcStream.prototype.Send.call(m, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<rpcstream.isRpcStreamPacket_Body | null>(new rpcstream.RpcStreamPacket_Data({Data: data}), "*rpcstream.RpcStreamPacket_Data", /* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket_Data"))}))
	}

	public async Recv(): globalThis.Promise<[rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, $.GoError]> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this;
		const m$: memoryRpcStream = m == null ? $.pointerTarget<memoryRpcStream>(m) : (m as any).__isVarRef === true ? (m as any).value : (m as any).__goValue === undefined ? (m as any) : $.pointerTarget<memoryRpcStream>(m)
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, [rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: ((__goscriptAwait = $.pointerValue<Exclude<context.Context, null>>((m$ as memoryRpcStream).ctx).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null),
				onSelected: async (__goscriptSelect0Result) => {
					return [null, context.Canceled]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: (m$ as memoryRpcStream).recv,
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
		throw new globalThis.Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Send(pkt: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null): globalThis.Promise<$.GoError> {
		const m: memoryRpcStream | $.VarRef<memoryRpcStream> | null = this;
		const m$: memoryRpcStream = m == null ? $.pointerTarget<memoryRpcStream>(m) : (m as any).__isVarRef === true ? (m as any).value : (m as any).__goValue === undefined ? (m as any) : $.pointerTarget<memoryRpcStream>(m)
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: ((__goscriptAwait = $.pointerValue<Exclude<context.Context, null>>((m$ as memoryRpcStream).ctx).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null),
				onSelected: async (__goscriptSelect1Result) => {
					return context.Canceled
				}
			},
			{
				id: 1,
				isSend: true,
				channel: (m$ as memoryRpcStream).send,
				value: (pkt !== null && (pkt as any).__isVarRef !== true && (pkt as any).__goValue === undefined ? ((pkt as any) as rpcstream.RpcStreamPacket).CloneVT() : rpcstream.RpcStreamPacket.prototype.CloneVT.call(pkt)),
				onSelected: async (__goscriptSelect1Result) => {
					return null
				}
			}
		], false)
		if (__goscriptSelect1HasReturn) {
			return __goscriptSelect1Value
		}
		throw new globalThis.Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"main.memoryRpcStream",
		() => new memoryRpcStream(),
		() => [$.methodSignature("Close", [], ["error"], true), $.methodSignature("CloseSend", [], ["error"], true), $.methodSignature("Context", [], ["context.Context"], true), $.methodSignature("MsgRecv", [["msg", "protobuf_go_lite.Message"]], ["error"], true), $.methodSignature("MsgSend", [["msg", "protobuf_go_lite.Message"]], ["error"], true), $.methodSignature("Recv", [], [/* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket"), "error"], true), $.methodSignature("Send", [["pkt", /* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket")]], ["error"], true)],
		memoryRpcStream,
		() => [/* @__PURE__ */ $.structField("ctx", "context.Context", [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("cancel", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), [1], 16, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("recv", /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket"), "receive"), [2], 24, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("send", /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket"), "send"), [3], 32, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("closeSend", "sync.Once", [4], 40, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("cancelLocal", "sync.Once", [5], 52, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" })]
	)
}

export class memoryRpcContext {
	public declare done: $.Channel<{}> | null

	public declare once: sync.Once

	constructor(__goscriptValue?: boolean, done$?: $.Channel<{}> | null, once$?: sync.Once) {
		this.done = done$ ?? (null! as $.Channel<{}> | null)
		this.once = once$ ?? $.markAsStructValue(new sync.Once())
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): memoryRpcContext {
		return new memoryRpcContext(true, this.done, $.markAsStructValue($.cloneStructValue(this.once)))
	}

	public __goscriptAssign(source: memoryRpcContext): this {
		this.done = source.done
		$.assignStruct(this.once, source.once)
		return this
	}

	public Deadline(): [time.Time, boolean] {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this;
		return [$.markAsStructValue(new time.Time()), false]
	}

	public Done(): $.Channel<{}> | null {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this;
		return $.pointerValue<memoryRpcContext>(m).done
	}

	public async Err(): globalThis.Promise<$.GoError> {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this;
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
		throw new globalThis.Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Value(key: any): globalThis.Promise<any> {
		const m: memoryRpcContext | $.VarRef<memoryRpcContext> | null = this;
		return $.pointerValue<Exclude<context.Context, null>>(context.Background()).Value(key)
	}

	static __typeInfo = $.registerStructType(
		"main.memoryRpcContext",
		() => new memoryRpcContext(),
		() => [$.methodSignature("Deadline", [], ["time.Time", /* @__PURE__ */ $.basicType("bool")], true), $.methodSignature("Done", [], [/* @__PURE__ */ $.channelType({ kind: $.TypeKind.Struct, methods: [], fields: [] }, "receive")], true), $.methodSignature("Err", [], ["error"], true), $.methodSignature("Value", [["key", { kind: $.TypeKind.Interface, methods: [] }]], [{ kind: $.TypeKind.Interface, methods: [] }], true)],
		memoryRpcContext,
		() => [/* @__PURE__ */ $.structField("done", /* @__PURE__ */ $.channelType({ kind: $.TypeKind.Struct, methods: [], fields: [] }, "both"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" }), /* @__PURE__ */ $.structField("once", "sync.Once", [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_starpc_srpc" })]
	)
}

export async function closeEmbedded(strm: embeddedStream): globalThis.Promise<$.GoError> {
	return $.pointerValue<Exclude<srpc.Stream, null>>(strm.Stream).CloseSend()
}

export async function recvOne(__typeArgs: $.GenericTypeArgs | undefined, strm: srpc.StreamRecv | null): globalThis.Promise<$.GoError> {
	let [, err] = await $.callInterfaceMethod((strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.StreamRecv, null>) : $.pointerValue<Exclude<srpc.StreamRecv, null>>(strm)), "Recv", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	return err
}

export function newMemoryRpcContext(): [memoryRpcContext | $.VarRef<memoryRpcContext> | null, (() => void) | null] {
	let ctx = new memoryRpcContext(false, $.makeChannel<{}>(0, {}, "both"))
	let ctx$: memoryRpcContext = ctx == null ? $.pointerTarget<memoryRpcContext>(ctx) : (ctx as any).__isVarRef === true ? (ctx as any).value : (ctx as any).__goValue === undefined ? (ctx as any) : $.pointerTarget<memoryRpcContext>(ctx)
	return [ctx, $.functionValue(() => {
		void (ctx$ as memoryRpcContext).once.Do($.functionValue(() => {
			void (ctx$ as memoryRpcContext).done!.close()
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
	let aToB = $.makeChannel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null>(16, null! as rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, "both")
	let bToA = $.makeChannel<rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null>(16, null! as rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null, "both")
	return [new memoryRpcStream(false, $.interfaceValue<context.Context | null>(aCtx, "*main.memoryRpcContext", /* @__PURE__ */ $.pointerType("main.memoryRpcContext")), aCancel, bToA, aToB), new memoryRpcStream(false, $.interfaceValue<context.Context | null>(bCtx, "*main.memoryRpcContext", /* @__PURE__ */ $.pointerType("main.memoryRpcContext")), bCancel, aToB, bToA)]
}

export async function openHeldStreams(ctx: context.Context | null, client: srpc.Client | null, count: number): globalThis.Promise<[$.Slice<srpc.Stream | null>, boolean]> {
	let resultCh = $.makeChannel<streamOpenResult>(count, new streamOpenResult(true), "both")
	for (let __goscriptRangeCount0 = count, i = 0; i < __goscriptRangeCount0; i++) {
		const __goscriptDeferArg0 = i
		$.go(async () => { await (async (idx: number) => {
			let [strm, err] = await (client !== null && (client as any).__isVarRef !== true && ((client as any).__goValue === undefined || (client as any).__goType?.charCodeAt(0) !== 42) ? (client as Exclude<srpc.Client, null>) : $.pointerValue<Exclude<srpc.Client, null>>(client)).NewStream(ctx, "svc", "hold", null)
			if (err == null) {
				err = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgSend($.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(new Uint8Array([$.uint(idx, 8)]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
			}
			await $.chanSend(resultCh, new streamOpenResult(true, strm, err))
		})(__goscriptDeferArg0) })
	}

	let streams: $.Slice<srpc.Stream | null> = $.makeSlice<srpc.Stream | null>(0, count)
	for (let __goscriptRangeCount1 = count, __rangeIndex = 0; __rangeIndex < __goscriptRangeCount1; __rangeIndex++) {
		const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, [$.Slice<srpc.Stream | null>, boolean]>([
			{
				id: 0,
				isSend: false,
				channel: resultCh,
				onSelected: async (__goscriptSelect3Result) => {
					let result = __goscriptSelect3Result.value
					if (result.err != null) {
						await $.println("hold open error:", (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>(result.err).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
						return [streams, false]
					}
					streams = $.appendOne(streams, result.stream, $.appendZeros.nil)
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
	for (let __goscriptRangeTarget0 = streams, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let strm = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as srpc.Stream | null)
		{
			let err = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).CloseSend(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
			if (err != null) {
				await $.println("hold close send error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
				return false
			}
		}
		let resp = srpc.NewRawMessage(null, false)
		{
			let err = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgRecv($.interfaceValue<srpc.Message | null>(resp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
			if (err != null) {
				await $.println("hold recv error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
				return false
			}
		}
		if (($.sliceLen((resp !== null && (resp as any).__isVarRef !== true && (resp as any).__goValue === undefined ? ((resp as any) as srpc.RawMessage).GetData() : srpc.RawMessage.prototype.GetData.call(resp))) != 1) || ($.uint($.typedSliceIndex((resp !== null && (resp as any).__isVarRef !== true && (resp as any).__goValue === undefined ? ((resp as any) as srpc.RawMessage).GetData() : srpc.RawMessage.prototype.GetData.call(resp))!, 0), 8) != 1)) {
			await $.println("hold response mismatch")
			return false
		}
	}
	return true
}

export async function probeConcurrentStreams(ctx: context.Context | null, client: srpc.Client | null, count: number): globalThis.Promise<boolean> {
	let resultCh = $.makeChannel<streamProbeResult>(count, new streamProbeResult(true), "both")
	for (let __goscriptRangeCount2 = count, i = 0; i < __goscriptRangeCount2; i++) {
		const __goscriptDeferArg1 = i
		$.go(async () => { await (async (idx: number) => {
			let [total, err] = await probeStream(ctx, client, $.uint(idx + 1, 8), $.uint(idx + 2, 8))
			if (err != null) {
				await $.chanSend(resultCh, (await (async () => { const __goscriptLiteralField0 = (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait); return new streamProbeResult(true, undefined, __goscriptLiteralField0) })()))
				return
			}
			await $.chanSend(resultCh, new streamProbeResult(true, total))
		})(__goscriptDeferArg1) })
	}

	for (let __goscriptRangeCount3 = count, i = 0; i < __goscriptRangeCount3; i++) {
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
	let [strm, err] = await (client !== null && (client as any).__isVarRef !== true && ((client as any).__goValue === undefined || (client as any).__goType?.charCodeAt(0) !== 42) ? (client as Exclude<srpc.Client, null>) : $.pointerValue<Exclude<srpc.Client, null>>(client)).NewStream(ctx, "svc", "stream", null)
	if (err != null) {
		return [0, err]
	}
	{
		let __goscriptShadow0 = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgSend($.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(new Uint8Array([a]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (__goscriptShadow0 != null) {
			return [0, __goscriptShadow0]
		}
	}
	{
		let __goscriptShadow1 = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgSend($.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(new Uint8Array([b]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (__goscriptShadow1 != null) {
			return [0, __goscriptShadow1]
		}
	}
	{
		let __goscriptShadow2 = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).CloseSend(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (__goscriptShadow2 != null) {
			return [0, __goscriptShadow2]
		}
	}
	let resp = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow3 = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgRecv($.interfaceValue<srpc.Message | null>(resp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (__goscriptShadow3 != null) {
			return [0, __goscriptShadow3]
		}
	}
	let data = (resp !== null && (resp as any).__isVarRef !== true && (resp as any).__goValue === undefined ? ((resp as any) as srpc.RawMessage).GetData() : srpc.RawMessage.prototype.GetData.call(resp))
	if ($.sliceLen(data) != 1) {
		return [$.sliceLen(data), null]
	}
	return [$.typedSliceIndex(data!, 0), null]
}

export async function newRoutedRpcStreamClient(ctx: context.Context | null, componentID: string, getter: ((ctx: context.Context | null, componentID: string, released: (() => void) | null) => [srpc.Invoker | null, (() => void) | null, $.GoError] | globalThis.Promise<[srpc.Invoker | null, (() => void) | null, $.GoError]>) | null, waitAck: boolean, results: $.Channel<rpcStreamServerResult> | null): globalThis.Promise<srpc.Client | null> {
	return rpcstream.NewRpcStreamClient(__goscriptStatic0(), $.functionValue(async (callCtx: context.Context | null): globalThis.Promise<[memoryRpcStream | $.VarRef<memoryRpcStream> | null, $.GoError]> => {
		let __goscriptTuple4: any = newMemoryRpcStreamPair()
		let client: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple4[0]
		let server: memoryRpcStream | $.VarRef<memoryRpcStream> | null = __goscriptTuple4[1]
		$.go(async () => {
			let err = await rpcstream.HandleRpcStream($.interfaceValue<rpcstream.RpcStream | null>(server, "*main.memoryRpcStream", /* @__PURE__ */ $.pointerType("main.memoryRpcStream")), getter)
			if (((err != null) && (!$.comparableEqual(err, context.Canceled))) && (!$.comparableEqual(err, io.EOF))) {
				const [__goscriptSelect5HasReturn, __goscriptSelect5Value] = await $.selectStatement<any, void>([
					{
						id: 0,
						isSend: true,
						channel: results,
						value: (await (async () => { const __goscriptLiteralField1 = (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait); return new rpcStreamServerResult(true, __goscriptLiteralField1) })()),
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
		})
		$.go(async () => {
			const [__goscriptSelect6HasReturn, __goscriptSelect6Value] = await $.selectStatement<any, void>([
				{
					id: 0,
					isSend: false,
					channel: ((__goscriptAwait = (ctx !== null && (ctx as any).__isVarRef !== true && ((ctx as any).__goValue === undefined || (ctx as any).__goType?.charCodeAt(0) !== 42) ? (ctx as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(ctx)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null),
					onSelected: async (__goscriptSelect6Result) => {
						await (client !== null && (client as any).__isVarRef !== true && (client as any).__goValue === undefined ? ((client as any) as memoryRpcStream).Close() : memoryRpcStream.prototype.Close.call(client))
						await (server !== null && (server as any).__isVarRef !== true && (server as any).__goValue === undefined ? ((server as any) as memoryRpcStream).Close() : memoryRpcStream.prototype.Close.call(server))
					}
				},
				{
					id: 1,
					isSend: false,
					channel: ((__goscriptAwait = (callCtx !== null && (callCtx as any).__isVarRef !== true && ((callCtx as any).__goValue === undefined || (callCtx as any).__goType?.charCodeAt(0) !== 42) ? (callCtx as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(callCtx)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null),
					onSelected: async (__goscriptSelect6Result) => {
						await (client !== null && (client as any).__isVarRef !== true && (client as any).__goValue === undefined ? ((client as any) as memoryRpcStream).Close() : memoryRpcStream.prototype.Close.call(client))
						await (server !== null && (server as any).__isVarRef !== true && (server as any).__goValue === undefined ? ((server as any) as memoryRpcStream).Close() : memoryRpcStream.prototype.Close.call(server))
					}
				}
			], false)
			if (__goscriptSelect6HasReturn) {
				return __goscriptSelect6Value
			}
		})
		return [client, null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context"], results: [/* @__PURE__ */ $.pointerType("main.memoryRpcStream"), "error"] } as $.FunctionTypeInfo)), componentID, waitAck)
}

export async function exerciseRpcStreamClientPressure(ctx: context.Context | null): globalThis.Promise<boolean> {
	let mux = srpc.NewMux(null)
	{
		let err = (__goscriptAwait = (mux !== null && (mux as any).__isVarRef !== true && ((mux as any).__goValue === undefined || (mux as any).__goType?.charCodeAt(0) !== 42) ? (mux as Exclude<srpc.Mux, null>) : $.pointerValue<Exclude<srpc.Mux, null>>(mux)).Register($.structInterfaceValue<srpc.Handler | null>(new handler(true), "main.handler", "main.handler")), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (err != null) {
			await $.println("rpcstream pressure register error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return false
		}
	}

	let results = $.makeChannel<rpcStreamServerResult>(8, new rpcStreamServerResult(true), "both")
	let getter = $.functionValue((ctx: context.Context | null, componentID: string, released: (() => void) | null): [srpc.Invoker | null, (() => void) | null, $.GoError] => {
		if ((!$.stringEqual(componentID, "component-root")) && (!$.stringEqual(componentID, "component-space"))) {
			return [null, (null as (() => void) | null), null]
		}
		return [(mux as srpc.Invoker | null), (null as (() => void) | null), null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context", /* @__PURE__ */ $.basicType("string"), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)], results: ["srpc.Invoker", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "error"] } as $.FunctionTypeInfo))

	let rootClient = await newRoutedRpcStreamClient(ctx, "component-root", getter, true, results)
	let __goscriptTuple5: any = await openHeldStreams(ctx, rootClient, 64)
	let held: $.Slice<srpc.Stream | null> = __goscriptTuple5[0]
	let ok: boolean = __goscriptTuple5[1]
	if (!ok) {
		return false
	}

	let spaceClient = await newRoutedRpcStreamClient(ctx, "component-space", getter, true, results)
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
	__defer.defer(async () => { await (client !== null && (client as any).__isVarRef !== true && (client as any).__goValue === undefined ? ((client as any) as memoryRpcStream).Close() : memoryRpcStream.prototype.Close.call(client)) })
	__defer.defer(async () => { await (server !== null && (server as any).__isVarRef !== true && (server as any).__goValue === undefined ? ((server as any) as memoryRpcStream).Close() : memoryRpcStream.prototype.Close.call(server)) })

	let invoked = $.makeChannel<boolean>(1, false, "both")
	let done = $.makeChannel<$.GoError>(1, null! as $.GoError, "both")
	$.go(async () => {
		await $.chanSend(done, await rpcstream.HandleRpcStream($.interfaceValue<rpcstream.RpcStream | null>(server, "*main.memoryRpcStream", /* @__PURE__ */ $.pointerType("main.memoryRpcStream")), $.functionValue(async (ctx: context.Context | null, componentID: string, released: (() => void) | null): globalThis.Promise<[srpc.Invoker | null, (() => void) | null, $.GoError]> => {
			if (!$.stringEqual(componentID, "component-a")) {
				await $.chanSend(invoked, false)
				return [null, (null as (() => void) | null), null]
			}
			return [$.namedValueInterfaceValue<srpc.Invoker | null>($.namedFunction($.functionValue(async (serviceID: string, methodID: string, strm: srpc.Stream | null): globalThis.Promise<[boolean, $.GoError]> => {
				await $.chanSend(invoked, ($.stringEqual(serviceID, "svc")) && ($.stringEqual(methodID, "method")))
				return [true, null]
			}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string"), "srpc.Stream"], results: [/* @__PURE__ */ $.basicType("bool"), "error"] } as $.FunctionTypeInfo)), "srpc.InvokerFunc", ({ kind: $.TypeKind.Function, name: "srpc.InvokerFunc", params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string"), "srpc.Stream"], results: [/* @__PURE__ */ $.basicType("bool"), "error"] } as $.FunctionTypeInfo)), "srpc.InvokerFunc", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()), (null as (() => void) | null), null]
		}, ({ kind: $.TypeKind.Function, params: ["context.Context", /* @__PURE__ */ $.basicType("string"), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)], results: ["srpc.Invoker", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "error"] } as $.FunctionTypeInfo))))
	})

	{
		let err = await memoryRpcStream.prototype.Send.call(client, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<rpcstream.isRpcStreamPacket_Body | null>(new rpcstream.RpcStreamPacket_Init({Init: new rpcstream.RpcStreamInit({ComponentId: "component-a"})}), "*rpcstream.RpcStreamPacket_Init", /* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket_Init"))}))
		if (err != null) {
			await $.println("rpcstream init send error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return false
		}
	}

	let __goscriptTuple7: any = await (client !== null && (client as any).__isVarRef !== true && (client as any).__goValue === undefined ? ((client as any) as memoryRpcStream).Recv() : memoryRpcStream.prototype.Recv.call(client))
	let ack: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple7[0]
	let err: $.GoError = __goscriptTuple7[1]
	if (err != null) {
		await $.println("rpcstream ack recv error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return false
	}
	if (((ack !== null && (ack as any).__isVarRef !== true && (ack as any).__goValue === undefined ? ((ack as any) as rpcstream.RpcStreamPacket).GetAck() : rpcstream.RpcStreamPacket.prototype.GetAck.call(ack)) == null) || (!$.stringEqual(rpcstream.RpcAck.prototype.GetError.call((ack !== null && (ack as any).__isVarRef !== true && (ack as any).__goValue === undefined ? ((ack as any) as rpcstream.RpcStreamPacket).GetAck() : rpcstream.RpcStreamPacket.prototype.GetAck.call(ack))), ""))) {
		await $.println("rpcstream ack mismatch")
		return false
	}

	let __goscriptTuple8: any = srpc.Packet.prototype.MarshalVT.call(srpc.NewCallStartPacket("svc", "method", null, false))
	let start: $.Slice<number> = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		await $.println("rpcstream call start marshal error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return false
	}
	{
		let __goscriptShadow4 = await memoryRpcStream.prototype.Send.call(client, new rpcstream.RpcStreamPacket({Body: $.interfaceValue<rpcstream.isRpcStreamPacket_Body | null>(new rpcstream.RpcStreamPacket_Data({Data: start}), "*rpcstream.RpcStreamPacket_Data", /* @__PURE__ */ $.pointerType("rpcstream.RpcStreamPacket_Data"))}))
		if (__goscriptShadow4 != null) {
			await $.println("rpcstream call start send error:", (__goscriptAwait = (__goscriptShadow4 !== null && (__goscriptShadow4 as any).__isVarRef !== true && ((__goscriptShadow4 as any).__goValue === undefined || (__goscriptShadow4 as any).__goType?.charCodeAt(0) !== 42) ? (__goscriptShadow4 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow4)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
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

	let __goscriptTuple9: any = await (client !== null && (client as any).__isVarRef !== true && (client as any).__goValue === undefined ? ((client as any) as memoryRpcStream).Recv() : memoryRpcStream.prototype.Recv.call(client))
	let resp: rpcstream.RpcStreamPacket | $.VarRef<rpcstream.RpcStreamPacket> | null = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		await $.println("rpcstream response recv error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return false
	}
	if ((resp !== null && (resp as any).__isVarRef !== true && (resp as any).__goValue === undefined ? ((resp as any) as rpcstream.RpcStreamPacket).GetData() : rpcstream.RpcStreamPacket.prototype.GetData.call(resp)) == null) {
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
					await $.println("rpcstream handle error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
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
		if ($.sliceLen(args) != 1) {
			await $.println("push arg count:", $.sliceLen(args))
			return null
		}
		let data = $.makeSlice<number>($.markAsStructValue($.cloneStructValue($.plainSliceIndex(args!, 0))).Length(), undefined, "byte")
		js.CopyBytesToGo(data, $.markAsStructValue($.cloneStructValue($.plainSliceIndex(args!, 0))))
		pushed = $.appendOne(pushed, data, $.appendZeros.nil)
		return null
	}, ({ kind: $.TypeKind.Function, params: ["js.Value", /* @__PURE__ */ $.sliceType("js.Value")], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
	const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => __receiver.Release())($.markAsStructValue($.cloneStructValue(pushFn))), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "syscall/js.Func.Release-fm")
	__defer.defer(() => { __goscriptDeferCallee0() })
	let endFn = $.markAsStructValue($.cloneStructValue(js.FuncOf($.functionValue((_this: js.Value, args: $.Slice<js.Value>): any => {
		ended = true
		return null
	}, ({ kind: $.TypeKind.Function, params: ["js.Value", /* @__PURE__ */ $.sliceType("js.Value")], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
	const __goscriptDeferCallee1 = $.functionValue(((__receiver) => () => __receiver.Release())($.markAsStructValue($.cloneStructValue(endFn))), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "syscall/js.Func.Release-fm")
	__defer.defer(() => { __goscriptDeferCallee1() })

	let writer = srpc.NewPushablePacketWriter(js.ValueOf($.interfaceValue($.makeMap<string, any>([["push", $.structInterfaceValue($.markAsStructValue($.cloneStructValue(pushFn)), "js.Func", __goscriptStatic4())], ["end", $.structInterfaceValue($.markAsStructValue($.cloneStructValue(endFn)), "js.Func", __goscriptStatic4())]]), "map[string]interface{}", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }))))
	{
		let err = (writer !== null && (writer as any).__isVarRef !== true && (writer as any).__goValue === undefined ? ((writer as any) as srpc.PushablePacketWriter).WritePacket(srpc.NewCallStartPacket("svc", "push", new Uint8Array([7, 8, 9]) as $.Slice<number>, false)) : srpc.PushablePacketWriter.prototype.WritePacket.call(writer, srpc.NewCallStartPacket("svc", "push", new Uint8Array([7, 8, 9]) as $.Slice<number>, false)))
		if (err != null) {
			await $.println("pushable call-start error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return false
		}
	}
	{
		let err = (writer !== null && (writer as any).__isVarRef !== true && (writer as any).__goValue === undefined ? ((writer as any) as srpc.PushablePacketWriter).WritePacket(srpc.NewCallCancelPacket()) : srpc.PushablePacketWriter.prototype.WritePacket.call(writer, srpc.NewCallCancelPacket()))
		if (err != null) {
			await $.println("pushable cancel error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return false
		}
	}
	{
		let err = (writer !== null && (writer as any).__isVarRef !== true && (writer as any).__goValue === undefined ? ((writer as any) as srpc.PushablePacketWriter).Close() : srpc.PushablePacketWriter.prototype.Close.call(writer))
		if (err != null) {
			await $.println("pushable close error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return false
		}
	}
	if (!ended) {
		await $.println("pushable end missing")
		return false
	}
	if ($.sliceLen(pushed) != 2) {
		await $.println("pushable packets:", $.sliceLen(pushed))
		return false
	}

	let sawStart = false
	let startHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null = srpc.NewPacketDataHandler($.functionValue((pkt: srpc.Packet | $.VarRef<srpc.Packet> | null): $.GoError => {
		let start = (pkt !== null && (pkt as any).__isVarRef !== true && (pkt as any).__goValue === undefined ? ((pkt as any) as srpc.Packet).GetCallStart() : srpc.Packet.prototype.GetCallStart.call(pkt))
		if (start == null) {
			return io.ErrUnexpectedEOF
		}
		sawStart = (($.stringEqual((start !== null && (start as any).__isVarRef !== true && (start as any).__goValue === undefined ? ((start as any) as srpc.CallStart).GetRpcService() : srpc.CallStart.prototype.GetRpcService.call(start)), "svc")) && ($.stringEqual((start !== null && (start as any).__isVarRef !== true && (start as any).__goValue === undefined ? ((start as any) as srpc.CallStart).GetRpcMethod() : srpc.CallStart.prototype.GetRpcMethod.call(start)), "push"))) && ($.stringEqual($.bytesToString((start !== null && (start as any).__isVarRef !== true && (start as any).__goValue === undefined ? ((start as any) as srpc.CallStart).GetData() : srpc.CallStart.prototype.GetData.call(start))), $.bytesToString(new Uint8Array([7, 8, 9]) as $.Slice<number>)))
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("srpc.Packet")], results: ["error"] } as $.FunctionTypeInfo)))
	{
		let err = (__goscriptAwait = startHandler!($.plainSliceIndex(pushed!, 0)), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (err != null) {
			await $.println("pushable start decode error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return false
		}
	}
	if (!sawStart) {
		await $.println("pushable start mismatch")
		return false
	}

	let sawCancel = false
	let cancelHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null = srpc.NewPacketDataHandler($.functionValue((pkt: srpc.Packet | $.VarRef<srpc.Packet> | null): $.GoError => {
		sawCancel = (pkt !== null && (pkt as any).__isVarRef !== true && (pkt as any).__goValue === undefined ? ((pkt as any) as srpc.Packet).GetCallCancel() : srpc.Packet.prototype.GetCallCancel.call(pkt))
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("srpc.Packet")], results: ["error"] } as $.FunctionTypeInfo)))
	{
		let err = (__goscriptAwait = cancelHandler!($.plainSliceIndex(pushed!, 1)), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (err != null) {
			await $.println("pushable cancel decode error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
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
	const __goscriptDeferCallee2 = cancel
	__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee2!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) })

	let mux = srpc.NewMux(null);
	;(__goscriptAwait = (mux !== null && (mux as any).__isVarRef !== true && ((mux as any).__goValue === undefined || (mux as any).__goType?.charCodeAt(0) !== 42) ? (mux as Exclude<srpc.Mux, null>) : $.pointerValue<Exclude<srpc.Mux, null>>(mux)).Register($.structInterfaceValue<srpc.Handler | null>(new handler(true), "main.handler", "main.handler")), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await (mux !== null && (mux as any).__isVarRef !== true && ((mux as any).__goValue === undefined || (mux as any).__goType?.charCodeAt(0) !== 42) ? (mux as Exclude<srpc.Mux, null>) : $.pointerValue<Exclude<srpc.Mux, null>>(mux)).InvokeMethod("svc", "method", null)
	closeEmbedded
	$.functionValue(async (strm: srpc.StreamRecv | null): globalThis.Promise<$.GoError> => await recvOne(__goscriptStatic5(), strm), ({ kind: $.TypeKind.Function, params: ["srpc.StreamRecv"], results: ["error"] } as $.FunctionTypeInfo))
	srpc.NewRawMessage(new Uint8Array([1, 2, 3]) as $.Slice<number>, true)
	let server = srpc.NewServer((mux as srpc.Invoker | null))
	let client = await srpc.NewClient(srpc.NewServerPipe(server))
	let unaryResp = srpc.NewRawMessage(null, false)
	let err = (__goscriptAwait = (client !== null && (client as any).__isVarRef !== true && ((client as any).__goValue === undefined || (client as any).__goType?.charCodeAt(0) !== 42) ? (client as Exclude<srpc.Client, null>) : $.pointerValue<Exclude<srpc.Client, null>>(client)).ExecCall(ctx, "svc", "method", $.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(null, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")), $.interfaceValue<srpc.Message | null>(unaryResp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	if (err != null) {
		await $.println("exec error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}
	await $.println("exec bytes:", $.sliceLen((unaryResp !== null && (unaryResp as any).__isVarRef !== true && (unaryResp as any).__goValue === undefined ? ((unaryResp as any) as srpc.RawMessage).GetData() : srpc.RawMessage.prototype.GetData.call(unaryResp))))
	let __goscriptTuple10: any = await (client !== null && (client as any).__isVarRef !== true && ((client as any).__goValue === undefined || (client as any).__goType?.charCodeAt(0) !== 42) ? (client as Exclude<srpc.Client, null>) : $.pointerValue<Exclude<srpc.Client, null>>(client)).NewStream(ctx, "svc", "stream", null)
	let strm: srpc.Stream | null = __goscriptTuple10[0]
	err = __goscriptTuple10[1]
	if (err != null) {
		await $.println("stream open error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}
	;(__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgSend($.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(new Uint8Array([1, 2, 3]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait);
	;(__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgSend($.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(new Uint8Array([4, 5]) as $.Slice<number>, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait);
	;(__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).CloseSend(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	let resp = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow5 = (__goscriptAwait = (strm !== null && (strm as any).__isVarRef !== true && ((strm as any).__goValue === undefined || (strm as any).__goType?.charCodeAt(0) !== 42) ? (strm as Exclude<srpc.Stream, null>) : $.pointerValue<Exclude<srpc.Stream, null>>(strm)).MsgRecv($.interfaceValue<srpc.Message | null>(resp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (__goscriptShadow5 != null) {
			await $.println("stream recv error:", (__goscriptAwait = (__goscriptShadow5 !== null && (__goscriptShadow5 as any).__isVarRef !== true && ((__goscriptShadow5 as any).__goValue === undefined || (__goscriptShadow5 as any).__goType?.charCodeAt(0) !== 42) ? (__goscriptShadow5 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow5)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return
		}
	}
	let data = (resp !== null && (resp as any).__isVarRef !== true && (resp as any).__goValue === undefined ? ((resp as any) as srpc.RawMessage).GetData() : srpc.RawMessage.prototype.GetData.call(resp))
	if ($.sliceLen(data) != 1) {
		await $.println("stream response length:", $.sliceLen(data))
		return
	}
	await $.println("stream bytes:", $.typedSliceIndex(data!, 0))
	let emptyResp = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow6 = (__goscriptAwait = (client !== null && (client as any).__isVarRef !== true && ((client as any).__goValue === undefined || (client as any).__goType?.charCodeAt(0) !== 42) ? (client as Exclude<srpc.Client, null>) : $.pointerValue<Exclude<srpc.Client, null>>(client)).ExecCall(ctx, "svc", "empty", $.interfaceValue<srpc.Message | null>(srpc.NewRawMessage(null, false), "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage")), $.interfaceValue<srpc.Message | null>(emptyResp, "*srpc.RawMessage", /* @__PURE__ */ $.pointerType("srpc.RawMessage"))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (__goscriptShadow6 != null) {
			await $.println("empty exec error:", (__goscriptAwait = (__goscriptShadow6 !== null && (__goscriptShadow6 as any).__isVarRef !== true && ((__goscriptShadow6 as any).__goValue === undefined || (__goscriptShadow6 as any).__goType?.charCodeAt(0) !== 42) ? (__goscriptShadow6 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow6)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return
		}
	}
	await $.println("empty exec bytes:", $.sliceLen((emptyResp !== null && (emptyResp as any).__isVarRef !== true && (emptyResp as any).__goValue === undefined ? ((emptyResp as any) as srpc.RawMessage).GetData() : srpc.RawMessage.prototype.GetData.call(emptyResp))))

	let __goscriptTuple11: any = await openHeldStreams(ctx, client, 32)
	let held: $.Slice<srpc.Stream | null> = __goscriptTuple11[0]
	let ok: boolean = __goscriptTuple11[1]
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

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.memoryRpcStream"), zero: () => null, methods: {Close: (receiver: any) => $.pointerValue(receiver).Close(), CloseSend: (receiver: any) => $.pointerValue(receiver).CloseSend(), Context: (receiver: any) => $.pointerValue(receiver).Context(), MsgRecv: (receiver: any, ...args: any[]) => $.pointerValue(receiver).MsgRecv(...$.stripGenericTypeArgs(args)), MsgSend: (receiver: any, ...args: any[]) => $.pointerValue(receiver).MsgSend(...$.stripGenericTypeArgs(args)), Recv: (receiver: any) => $.pointerValue(receiver).Recv(), Send: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Send(...$.stripGenericTypeArgs(args))} }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({InvokeMethod: (receiver: any, ...args: any[]) => (srpc.InvokerFunc_InvokeMethod as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (({ kind: $.TypeKind.Function, name: "srpc.InvokerFunc", params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string"), "srpc.Stream"], results: [/* @__PURE__ */ $.basicType("bool"), "error"] } as $.FunctionTypeInfo))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("InvokeMethod", [["serviceID", /* @__PURE__ */ $.basicType("string")], ["methodID", /* @__PURE__ */ $.basicType("string")], ["strm", "srpc.Stream"]], [/* @__PURE__ */ $.basicType("bool"), "error"])])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ($.overrideTypeMethods("js.Func", "js.Func", () => [$.methodSignature("Bool", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Call", [["m", /* @__PURE__ */ $.basicType("string")], ["args", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] })]], ["js.Value"], false, true), $.methodSignature("Delete", [["p", /* @__PURE__ */ $.basicType("string")]]), $.methodSignature("Equal", [["w", "js.Value"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Float", [], [/* @__PURE__ */ $.basicType("float64")]), $.methodSignature("Get", [["p", /* @__PURE__ */ $.basicType("string")]], ["js.Value"]), $.methodSignature("Index", [["i", /* @__PURE__ */ $.basicType("int")]], ["js.Value"]), $.methodSignature("InstanceOf", [["t", "js.Value"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Int", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Invoke", [["args", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] })]], ["js.Value"], false, true), $.methodSignature("IsNaN", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("IsNull", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("IsUndefined", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Length", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("New", [["args", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] })]], ["js.Value"], false, true), $.methodSignature("Release"), $.methodSignature("Set", [["p", /* @__PURE__ */ $.basicType("string")], ["x", { kind: $.TypeKind.Interface, methods: [] }]]), $.methodSignature("SetIndex", [["i", /* @__PURE__ */ $.basicType("int")], ["x", { kind: $.TypeKind.Interface, methods: [] }]]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Truthy", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Type", [], [/* @__PURE__ */ $.basicType("int", "js.Type")])]))
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
