// Generated file based on promoted_embedded_struct_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type closer = {
	Close(): string
}

$.registerInterfaceType(
	"main.closer",
	null,
	[{ name: "Close", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class stream {
	public declare name: string

	public _fields: {
		name: string
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: init?.name ?? ("" as string)
		}
	}

	public clone(): stream {
		return $.markAsStructValue(new stream(this))
	}

	public Close(): string {
		const s = this
		return "close:" + s.name
	}

	static {
		$.bindStructFields(this.prototype, ["name"])
	}

	static __typeInfo = $.registerStructType(
		"main.stream",
		() => new stream(),
		() => [{ name: "Close", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		stream,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class stopStream {
	public declare stream: stream

	public _fields: {
		stream: stream
	}

	constructor(init?: Partial<{stream?: stream}>) {
		this._fields = {
			stream: init?.stream ? $.markAsStructValue($.cloneStructValue(init.stream)) : $.markAsStructValue(new stream())
		}
	}

	public clone(): stopStream {
		return $.markAsStructValue(new stopStream(this))
	}

	public Close(): any {
		return $.pointerValue<stream>(this.stream).Close()
	}

	static {
		$.bindStructFields(this.prototype, ["stream"])
	}

	static __typeInfo = $.registerStructType(
		"main.stopStream",
		() => new stopStream(),
		() => [{ name: "Close", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		stopStream,
		() => [{ name: "stream", key: "stream", type: "main.stream", anonymous: true }]
	)
}

export class pointerStopStream {
	public declare stream: stream | $.VarRef<stream> | null

	public _fields: {
		stream: stream | $.VarRef<stream> | null
	}

	constructor(init?: Partial<{stream?: stream | $.VarRef<stream> | null}>) {
		this._fields = {
			stream: init?.stream ?? (null! as stream | $.VarRef<stream> | null)
		}
	}

	public clone(): pointerStopStream {
		return $.markAsStructValue(new pointerStopStream(this))
	}

	public Close(): any {
		return $.pointerValue<stream>(this.stream).Close()
	}

	static {
		$.bindStructFields(this.prototype, ["stream"])
	}

	static __typeInfo = $.registerStructType(
		"main.pointerStopStream",
		() => new pointerStopStream(),
		() => [{ name: "Close", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		pointerStopStream,
		() => [{ name: "stream", key: "stream", type: /* @__PURE__ */ $.pointerType("main.stream"), anonymous: true }]
	)
}

export async function closeIt(c: closer | null): globalThis.Promise<void> {
	await $.println(await $.pointerValue<Exclude<closer, null>>(c).Close())
}

export async function main(): globalThis.Promise<void> {
	let value = $.markAsStructValue(new stopStream({stream: $.markAsStructValue(new stream({name: "value"}))}))
	await closeIt($.interfaceValue<closer | null>($.markAsStructValue($.cloneStructValue(value)), "main.stopStream", "main.stopStream"))

	let ptr: stopStream | $.VarRef<stopStream> | null = new stopStream({stream: $.markAsStructValue(new stream({name: "pointer"}))})
	await closeIt($.interfaceValue<closer | null>(ptr, "*main.stopStream", /* @__PURE__ */ $.pointerType("main.stopStream")))

	let promotedPtr = $.markAsStructValue(new pointerStopStream({stream: new stream({name: "embedded pointer"})}))
	await closeIt($.interfaceValue<closer | null>($.markAsStructValue($.cloneStructValue(promotedPtr)), "main.pointerStopStream", "main.pointerStopStream"))
}

if ($.isMainScript(import.meta)) {
	await main()
}
