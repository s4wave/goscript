// Generated file based on quic_loss_frame_handler.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type wireFrame = {
	Write(): void
}

$.registerInterfaceType(
	"main.wireFrame",
	null,
	[{ name: "Write", args: [], returns: [] }]
);

export type FrameHandler = {
	OnAcked(_p0: wireFrame | null): void
	OnLost(_p0: wireFrame | null): void
}

$.registerInterfaceType(
	"main.FrameHandler",
	null,
	[{ name: "OnAcked", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "OnLost", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);

export class pingFrame {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): pingFrame {
		return $.markAsStructValue(new pingFrame(this))
	}

	public Write(): void {
	}

	static __typeInfo = $.registerStructType(
		"main.pingFrame",
		() => new pingFrame(),
		() => [{ name: "Write", args: [], returns: [] }],
		pingFrame,
		() => []
	)
}

export class Frame {
	public declare Frame: wireFrame | null

	public declare Handler: FrameHandler | null

	public _fields: {
		Frame: wireFrame | null
		Handler: FrameHandler | null
	}

	constructor(init?: Partial<{Frame?: wireFrame | null, Handler?: FrameHandler | null}>) {
		this._fields = {
			Frame: init?.Frame ?? (null! as wireFrame | null),
			Handler: init?.Handler ?? (null! as FrameHandler | null)
		}
	}

	public clone(): Frame {
		return $.markAsStructValue(new Frame(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Frame", "Handler"])
	}

	static __typeInfo = $.registerStructType(
		"main.Frame",
		() => new Frame(),
		() => [],
		Frame,
		() => [{ name: "Frame", key: "Frame", type: "main.wireFrame" }, { name: "Handler", key: "Handler", type: "main.FrameHandler" }]
	)
}

export class packet {
	public declare Frames: $.Slice<Frame>

	public _fields: {
		Frames: $.Slice<Frame>
	}

	constructor(init?: Partial<{Frames?: $.Slice<Frame>}>) {
		this._fields = {
			Frames: init?.Frames ?? (null! as $.Slice<Frame>)
		}
	}

	public clone(): packet {
		return $.markAsStructValue(new packet(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Frames"])
	}

	static __typeInfo = $.registerStructType(
		"main.packet",
		() => new packet(),
		() => [],
		packet,
		() => [{ name: "Frames", key: "Frames", type: /* @__PURE__ */ $.sliceType("main.Frame") }]
	)
}

export class retransmissionQueue {
	public declare lost: number

	public _fields: {
		lost: number
	}

	constructor(init?: Partial<{lost?: number}>) {
		this._fields = {
			lost: init?.lost ?? (0 as number)
		}
	}

	public clone(): retransmissionQueue {
		return $.markAsStructValue(new retransmissionQueue(this))
	}

	public AppDataAckHandler(): FrameHandler | null {
		const q: retransmissionQueue | $.VarRef<retransmissionQueue> | null = this
		return $.interfaceValue<FrameHandler | null>($.unsafePointerCast<retransmissionQueueAppDataAckHandler | $.VarRef<retransmissionQueueAppDataAckHandler> | null>(q, retransmissionQueueAppDataAckHandler), "*main.retransmissionQueueAppDataAckHandler", /* @__PURE__ */ $.pointerType("main.retransmissionQueueAppDataAckHandler"))
	}

	public HandshakeAckHandler(): FrameHandler | null {
		const q: retransmissionQueue | $.VarRef<retransmissionQueue> | null = this
		return $.interfaceValue<FrameHandler | null>($.unsafePointerCast<retransmissionQueueHandshakeAckHandler | $.VarRef<retransmissionQueueHandshakeAckHandler> | null>(q, retransmissionQueueHandshakeAckHandler), "*main.retransmissionQueueHandshakeAckHandler", /* @__PURE__ */ $.pointerType("main.retransmissionQueueHandshakeAckHandler"))
	}

	public InitialAckHandler(): FrameHandler | null {
		const q: retransmissionQueue | $.VarRef<retransmissionQueue> | null = this
		return $.interfaceValue<FrameHandler | null>($.unsafePointerCast<retransmissionQueueInitialAckHandler | $.VarRef<retransmissionQueueInitialAckHandler> | null>(q, retransmissionQueueInitialAckHandler), "*main.retransmissionQueueInitialAckHandler", /* @__PURE__ */ $.pointerType("main.retransmissionQueueInitialAckHandler"))
	}

	static {
		$.bindStructFields(this.prototype, ["lost"])
	}

	static __typeInfo = $.registerStructType(
		"main.retransmissionQueue",
		() => new retransmissionQueue(),
		() => [{ name: "AppDataAckHandler", args: [], returns: [{ type: "main.FrameHandler" }] }, { name: "HandshakeAckHandler", args: [], returns: [{ type: "main.FrameHandler" }] }, { name: "InitialAckHandler", args: [], returns: [{ type: "main.FrameHandler" }] }],
		retransmissionQueue,
		() => [{ name: "lost", key: "lost", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class retransmissionQueueInitialAckHandler {
	public declare lost: number

	public _fields: {
		lost: number
	}

	constructor(init?: Partial<{lost?: number}>) {
		this._fields = {
			lost: init?.lost ?? (0 as number)
		}
	}

	public clone(): retransmissionQueueInitialAckHandler {
		return $.markAsStructValue(new retransmissionQueueInitialAckHandler(this))
	}

	public OnAcked(_p0: wireFrame | null): void {
		const q: retransmissionQueueInitialAckHandler | $.VarRef<retransmissionQueueInitialAckHandler> | null = this
	}

	public async OnLost(_p0: wireFrame | null): globalThis.Promise<void> {
		let q: retransmissionQueueInitialAckHandler | $.VarRef<retransmissionQueueInitialAckHandler> | null = this
		$.pointerValue<retransmissionQueueInitialAckHandler>(q).lost++
		await $.println("initial")
	}

	static {
		$.bindStructFields(this.prototype, ["lost"])
	}

	static __typeInfo = $.registerStructType(
		"main.retransmissionQueueInitialAckHandler",
		() => new retransmissionQueueInitialAckHandler(),
		() => [{ name: "OnAcked", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "OnLost", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		retransmissionQueueInitialAckHandler,
		() => [{ name: "lost", key: "lost", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class retransmissionQueueHandshakeAckHandler {
	public declare lost: number

	public _fields: {
		lost: number
	}

	constructor(init?: Partial<{lost?: number}>) {
		this._fields = {
			lost: init?.lost ?? (0 as number)
		}
	}

	public clone(): retransmissionQueueHandshakeAckHandler {
		return $.markAsStructValue(new retransmissionQueueHandshakeAckHandler(this))
	}

	public OnAcked(_p0: wireFrame | null): void {
		const q: retransmissionQueueHandshakeAckHandler | $.VarRef<retransmissionQueueHandshakeAckHandler> | null = this
	}

	public async OnLost(_p0: wireFrame | null): globalThis.Promise<void> {
		let q: retransmissionQueueHandshakeAckHandler | $.VarRef<retransmissionQueueHandshakeAckHandler> | null = this
		$.pointerValue<retransmissionQueueHandshakeAckHandler>(q).lost++
		await $.println("handshake")
	}

	static {
		$.bindStructFields(this.prototype, ["lost"])
	}

	static __typeInfo = $.registerStructType(
		"main.retransmissionQueueHandshakeAckHandler",
		() => new retransmissionQueueHandshakeAckHandler(),
		() => [{ name: "OnAcked", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "OnLost", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		retransmissionQueueHandshakeAckHandler,
		() => [{ name: "lost", key: "lost", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class retransmissionQueueAppDataAckHandler {
	public declare lost: number

	public _fields: {
		lost: number
	}

	constructor(init?: Partial<{lost?: number}>) {
		this._fields = {
			lost: init?.lost ?? (0 as number)
		}
	}

	public clone(): retransmissionQueueAppDataAckHandler {
		return $.markAsStructValue(new retransmissionQueueAppDataAckHandler(this))
	}

	public OnAcked(_p0: wireFrame | null): void {
		const q: retransmissionQueueAppDataAckHandler | $.VarRef<retransmissionQueueAppDataAckHandler> | null = this
	}

	public async OnLost(_p0: wireFrame | null): globalThis.Promise<void> {
		let q: retransmissionQueueAppDataAckHandler | $.VarRef<retransmissionQueueAppDataAckHandler> | null = this
		$.pointerValue<retransmissionQueueAppDataAckHandler>(q).lost++
		await $.println("app")
	}

	static {
		$.bindStructFields(this.prototype, ["lost"])
	}

	static __typeInfo = $.registerStructType(
		"main.retransmissionQueueAppDataAckHandler",
		() => new retransmissionQueueAppDataAckHandler(),
		() => [{ name: "OnAcked", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "OnLost", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		retransmissionQueueAppDataAckHandler,
		() => [{ name: "lost", key: "lost", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function queueFramesForRetransmission(p: packet | $.VarRef<packet> | null): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = $.pointerValue<packet>(p).Frames, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let f = __goscriptRangeTarget0![__rangeIndex]
		if (f.Handler != null) {
			await $.pointerValue<Exclude<FrameHandler, null>>(f.Handler).OnLost(f.Frame)
		}
	}
}

export async function main(): globalThis.Promise<void> {
	let q: retransmissionQueue | $.VarRef<retransmissionQueue> | null = new retransmissionQueue()
	let p: packet | $.VarRef<packet> | null = new packet({Frames: $.arrayToSlice<Frame>([(() => { const __goscriptLiteralField0 = retransmissionQueue.prototype.InitialAckHandler.call(q); return $.markAsStructValue(new Frame({Frame: $.interfaceValue<wireFrame | null>($.markAsStructValue(new pingFrame()), "main.pingFrame", "main.pingFrame"), Handler: __goscriptLiteralField0})) })(), (() => { const __goscriptLiteralField1 = retransmissionQueue.prototype.HandshakeAckHandler.call(q); return $.markAsStructValue(new Frame({Frame: $.interfaceValue<wireFrame | null>($.markAsStructValue(new pingFrame()), "main.pingFrame", "main.pingFrame"), Handler: __goscriptLiteralField1})) })(), (() => { const __goscriptLiteralField2 = retransmissionQueue.prototype.AppDataAckHandler.call(q); return $.markAsStructValue(new Frame({Frame: $.interfaceValue<wireFrame | null>($.markAsStructValue(new pingFrame()), "main.pingFrame", "main.pingFrame"), Handler: __goscriptLiteralField2})) })()])})
	await queueFramesForRetransmission(p)
	await $.println("lost:", $.pointerValue<retransmissionQueue>(q).lost)
	await $.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
