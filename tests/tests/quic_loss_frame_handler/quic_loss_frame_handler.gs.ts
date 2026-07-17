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
		const cloned = new pingFrame()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Write(): void {
	}

	static __typeInfo = $.registerStructType(
		"main.pingFrame",
		() => new pingFrame(),
		[{ name: "Write", args: [], returns: [] }],
		pingFrame,
		[]
	)
}

export class Frame {
	public get Frame(): wireFrame | null {
		return this._fields.Frame.value
	}
	public set Frame(value: wireFrame | null) {
		this._fields.Frame.value = value
	}

	public get Handler(): FrameHandler | null {
		return this._fields.Handler.value
	}
	public set Handler(value: FrameHandler | null) {
		this._fields.Handler.value = value
	}

	public _fields: {
		Frame: $.VarRef<wireFrame | null>
		Handler: $.VarRef<FrameHandler | null>
	}

	constructor(init?: Partial<{Frame?: wireFrame | null, Handler?: FrameHandler | null}>) {
		this._fields = {
			Frame: $.varRef(init?.Frame ?? (null! as wireFrame | null)),
			Handler: $.varRef(init?.Handler ?? (null! as FrameHandler | null))
		}
	}

	public clone(): Frame {
		const cloned = new Frame()
		cloned._fields = {
			Frame: $.varRef(this._fields.Frame.value),
			Handler: $.varRef(this._fields.Handler.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Frame",
		() => new Frame(),
		[],
		Frame,
		[{ name: "Frame", key: "Frame", type: "main.wireFrame" }, { name: "Handler", key: "Handler", type: "main.FrameHandler" }]
	)
}

export class packet {
	public get Frames(): $.Slice<Frame> {
		return this._fields.Frames.value
	}
	public set Frames(value: $.Slice<Frame>) {
		this._fields.Frames.value = value
	}

	public _fields: {
		Frames: $.VarRef<$.Slice<Frame>>
	}

	constructor(init?: Partial<{Frames?: $.Slice<Frame>}>) {
		this._fields = {
			Frames: $.varRef(init?.Frames ?? (null! as $.Slice<Frame>))
		}
	}

	public clone(): packet {
		const cloned = new packet()
		cloned._fields = {
			Frames: $.varRef(this._fields.Frames.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.packet",
		() => new packet(),
		[],
		packet,
		[{ name: "Frames", key: "Frames", type: { kind: $.TypeKind.Slice, elemType: "main.Frame" } }]
	)
}

export class retransmissionQueue {
	public get lost(): number {
		return this._fields.lost.value
	}
	public set lost(value: number) {
		this._fields.lost.value = value
	}

	public _fields: {
		lost: $.VarRef<number>
	}

	constructor(init?: Partial<{lost?: number}>) {
		this._fields = {
			lost: $.varRef(init?.lost ?? (0 as number))
		}
	}

	public clone(): retransmissionQueue {
		const cloned = new retransmissionQueue()
		cloned._fields = {
			lost: $.varRef(this._fields.lost.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppDataAckHandler(): FrameHandler | null {
		const q: retransmissionQueue | $.VarRef<retransmissionQueue> | null = this
		return $.interfaceValue<FrameHandler | null>($.unsafePointerCast<retransmissionQueueAppDataAckHandler | $.VarRef<retransmissionQueueAppDataAckHandler> | null>(q, retransmissionQueueAppDataAckHandler), "*main.retransmissionQueueAppDataAckHandler", { kind: $.TypeKind.Pointer, elemType: "main.retransmissionQueueAppDataAckHandler" })
	}

	public HandshakeAckHandler(): FrameHandler | null {
		const q: retransmissionQueue | $.VarRef<retransmissionQueue> | null = this
		return $.interfaceValue<FrameHandler | null>($.unsafePointerCast<retransmissionQueueHandshakeAckHandler | $.VarRef<retransmissionQueueHandshakeAckHandler> | null>(q, retransmissionQueueHandshakeAckHandler), "*main.retransmissionQueueHandshakeAckHandler", { kind: $.TypeKind.Pointer, elemType: "main.retransmissionQueueHandshakeAckHandler" })
	}

	public InitialAckHandler(): FrameHandler | null {
		const q: retransmissionQueue | $.VarRef<retransmissionQueue> | null = this
		return $.interfaceValue<FrameHandler | null>($.unsafePointerCast<retransmissionQueueInitialAckHandler | $.VarRef<retransmissionQueueInitialAckHandler> | null>(q, retransmissionQueueInitialAckHandler), "*main.retransmissionQueueInitialAckHandler", { kind: $.TypeKind.Pointer, elemType: "main.retransmissionQueueInitialAckHandler" })
	}

	static __typeInfo = $.registerStructType(
		"main.retransmissionQueue",
		() => new retransmissionQueue(),
		[{ name: "AppDataAckHandler", args: [], returns: [{ type: "main.FrameHandler" }] }, { name: "HandshakeAckHandler", args: [], returns: [{ type: "main.FrameHandler" }] }, { name: "InitialAckHandler", args: [], returns: [{ type: "main.FrameHandler" }] }],
		retransmissionQueue,
		[{ name: "lost", key: "lost", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export class retransmissionQueueInitialAckHandler {
	public get lost(): number {
		return this._fields.lost.value
	}
	public set lost(value: number) {
		this._fields.lost.value = value
	}

	public _fields: {
		lost: $.VarRef<number>
	}

	constructor(init?: Partial<{lost?: number}>) {
		this._fields = {
			lost: $.varRef(init?.lost ?? (0 as number))
		}
	}

	public clone(): retransmissionQueueInitialAckHandler {
		const cloned = new retransmissionQueueInitialAckHandler()
		cloned._fields = {
			lost: $.varRef(this._fields.lost.value)
		}
		return $.markAsStructValue(cloned)
	}

	public OnAcked(_p0: wireFrame | null): void {
		const q: retransmissionQueueInitialAckHandler | $.VarRef<retransmissionQueueInitialAckHandler> | null = this
	}

	public OnLost(_p0: wireFrame | null): void {
		let q: retransmissionQueueInitialAckHandler | $.VarRef<retransmissionQueueInitialAckHandler> | null = this
		$.pointerValue<retransmissionQueueInitialAckHandler>(q).lost++
		$.println("initial")
	}

	static __typeInfo = $.registerStructType(
		"main.retransmissionQueueInitialAckHandler",
		() => new retransmissionQueueInitialAckHandler(),
		[{ name: "OnAcked", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "OnLost", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		retransmissionQueueInitialAckHandler,
		[{ name: "lost", key: "lost", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export class retransmissionQueueHandshakeAckHandler {
	public get lost(): number {
		return this._fields.lost.value
	}
	public set lost(value: number) {
		this._fields.lost.value = value
	}

	public _fields: {
		lost: $.VarRef<number>
	}

	constructor(init?: Partial<{lost?: number}>) {
		this._fields = {
			lost: $.varRef(init?.lost ?? (0 as number))
		}
	}

	public clone(): retransmissionQueueHandshakeAckHandler {
		const cloned = new retransmissionQueueHandshakeAckHandler()
		cloned._fields = {
			lost: $.varRef(this._fields.lost.value)
		}
		return $.markAsStructValue(cloned)
	}

	public OnAcked(_p0: wireFrame | null): void {
		const q: retransmissionQueueHandshakeAckHandler | $.VarRef<retransmissionQueueHandshakeAckHandler> | null = this
	}

	public OnLost(_p0: wireFrame | null): void {
		let q: retransmissionQueueHandshakeAckHandler | $.VarRef<retransmissionQueueHandshakeAckHandler> | null = this
		$.pointerValue<retransmissionQueueHandshakeAckHandler>(q).lost++
		$.println("handshake")
	}

	static __typeInfo = $.registerStructType(
		"main.retransmissionQueueHandshakeAckHandler",
		() => new retransmissionQueueHandshakeAckHandler(),
		[{ name: "OnAcked", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "OnLost", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		retransmissionQueueHandshakeAckHandler,
		[{ name: "lost", key: "lost", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export class retransmissionQueueAppDataAckHandler {
	public get lost(): number {
		return this._fields.lost.value
	}
	public set lost(value: number) {
		this._fields.lost.value = value
	}

	public _fields: {
		lost: $.VarRef<number>
	}

	constructor(init?: Partial<{lost?: number}>) {
		this._fields = {
			lost: $.varRef(init?.lost ?? (0 as number))
		}
	}

	public clone(): retransmissionQueueAppDataAckHandler {
		const cloned = new retransmissionQueueAppDataAckHandler()
		cloned._fields = {
			lost: $.varRef(this._fields.lost.value)
		}
		return $.markAsStructValue(cloned)
	}

	public OnAcked(_p0: wireFrame | null): void {
		const q: retransmissionQueueAppDataAckHandler | $.VarRef<retransmissionQueueAppDataAckHandler> | null = this
	}

	public OnLost(_p0: wireFrame | null): void {
		let q: retransmissionQueueAppDataAckHandler | $.VarRef<retransmissionQueueAppDataAckHandler> | null = this
		$.pointerValue<retransmissionQueueAppDataAckHandler>(q).lost++
		$.println("app")
	}

	static __typeInfo = $.registerStructType(
		"main.retransmissionQueueAppDataAckHandler",
		() => new retransmissionQueueAppDataAckHandler(),
		[{ name: "OnAcked", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "OnLost", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		retransmissionQueueAppDataAckHandler,
		[{ name: "lost", key: "lost", type: { kind: $.TypeKind.Basic, name: "int" } }]
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
	$.println("lost:", $.pointerValue<retransmissionQueue>(q).lost)
	$.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
