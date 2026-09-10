// Generated file based on blank_parameters.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type blankInterface = {
	Value(): number
}

$.registerInterfaceType(
	"main.blankInterface",
	null,
	[{ name: "Value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class blankImpl {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): blankImpl {
		return $.markAsStructValue(new blankImpl(this))
	}

	public Value(): number {
		const b: blankImpl | $.VarRef<blankImpl> | null = this;
		return $.pointerValue<blankImpl>(b).value
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.blankImpl",
		() => new blankImpl(),
		() => [{ name: "Value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		blankImpl,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Packer {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Packer {
		return $.markAsStructValue(new Packer(this))
	}

	public pack(msg: $.Slice<number>, _p1: globalThis.Map<string, number> | null, _p2: number): $.Slice<number> {
		return $.append(msg, $.uint(1, 8), $.byteSliceHint)
	}

	static __typeInfo = $.registerStructType(
		"main.Packer",
		() => new Packer(),
		() => [{ name: "pack", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }],
		Packer,
		() => []
	)
}

export function blanks(_p0: number, _p1: string): number {
	return 7
}

export function unicodeNames(_u3c6: number, _u3b2: number): [number, number] {
	let _u3c8: number = 0
	let _u3b4: number = 0
	_u3c8 = _u3c6 + 1
	_u3b4 = _u3b2 + 2
	return [_u3c8, _u3b4]
}

export async function main(): globalThis.Promise<void> {
	let p = $.markAsStructValue(new Packer())
	await $.println(blanks(1, "x"))
	await $.println($.len($.markAsStructValue($.cloneStructValue(p)).pack(null, null, 0)))

	let f: ((_p0: number, _p1: number) => number | globalThis.Promise<number>) | null = $.functionValue((_p0: number, _p1: number): number => {
		return 9
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println(await f!(1, 2))

	let [left, right] = unicodeNames(3, 4)
	await $.println(left, right)
}

if ($.isMainScript(import.meta)) {
	await main()
}
