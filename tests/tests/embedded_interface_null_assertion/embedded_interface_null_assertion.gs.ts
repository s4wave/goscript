// Generated file based on embedded_interface_null_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Reader = {
	Read(p: $.Slice<number>): [number, $.GoError]
}

$.registerInterfaceType(
	"main.Reader",
	null,
	[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }]
);

export class MyReader {
	public declare Reader: Reader | null

	public declare name: string

	public _fields: {
		Reader: Reader | null
		name: string
	}

	constructor(init?: Partial<{Reader?: Reader | null, name?: string}>) {
		this._fields = {
			Reader: init?.Reader ?? (null! as Reader | null),
			name: init?.name ?? ("" as string)
		}
	}

	public clone(): MyReader {
		return $.markAsStructValue(new MyReader(this))
	}

	public Read(p: any): any {
		return $.pointerValue<Exclude<Reader | null, null>>(this.Reader).Read(p)
	}

	static {
		$.bindStructFields(this.prototype, ["Reader", "name"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyReader",
		() => new MyReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		MyReader,
		() => [{ name: "Reader", key: "Reader", type: "main.Reader", anonymous: true }, { name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class StringReader {
	public declare data: string

	public declare pos: number

	public _fields: {
		data: string
		pos: number
	}

	constructor(init?: Partial<{data?: string, pos?: number}>) {
		this._fields = {
			data: init?.data ?? ("" as string),
			pos: init?.pos ?? (0 as number)
		}
	}

	public clone(): StringReader {
		return $.markAsStructValue(new StringReader(this))
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let s: StringReader | $.VarRef<StringReader> | null = this
		if ($.pointerValue<StringReader>(s).pos >= $.len($.pointerValue<StringReader>(s).data)) {
			return [0, null]
		}
		let n = $.copy(p, $.stringToBytes($.sliceStringOrBytes($.pointerValue<StringReader>(s).data, $.pointerValue<StringReader>(s).pos, undefined)))
		$.pointerValue<StringReader>(s).pos = $.pointerValue<StringReader>(s).pos + (n)
		return [n, null]
	}

	static {
		$.bindStructFields(this.prototype, ["data", "pos"])
	}

	static __typeInfo = $.registerStructType(
		"main.StringReader",
		() => new StringReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		StringReader,
		() => [{ name: "data", key: "data", type: /* @__PURE__ */ $.basicType("string") }, { name: "pos", key: "pos", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let mr1: MyReader | $.VarRef<MyReader> | null = new MyReader({name: "test1"})
	await $.println($.pointerValue<MyReader>(mr1).Reader == null)

	let sr: StringReader | $.VarRef<StringReader> | null = new StringReader({data: "hello", pos: 0})
	let mr2: MyReader | $.VarRef<MyReader> | null = new MyReader({Reader: $.interfaceValue<Reader | null>(sr, "*main.StringReader", /* @__PURE__ */ $.pointerType("main.StringReader")), name: "test2"})
	await $.println($.pointerValue<MyReader>(mr2).Reader != null)

	let buf: $.Slice<number> = $.makeSlice<number>(5, undefined, "byte")
	let [n, ] = $.pointerValue<Exclude<Reader, null>>($.pointerValue<MyReader>(mr2).Reader).Read(buf)
	await $.println(n == 5)

	await $.println(10)
	await $.println(15)
	await $.println(true)
}

if ($.isMainScript(import.meta)) {
	await main()
}
