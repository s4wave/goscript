// Generated file based on undefined_type_error.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class formatter {
	public declare wid: number

	public declare prec: number

	public declare widPresent: boolean

	public declare precPresent: boolean

	public declare minus: boolean

	public declare plus: boolean

	public declare sharp: boolean

	public declare space: boolean

	public declare zero: boolean

	public declare plusV: boolean

	public declare sharpV: boolean

	public _fields: {
		wid: number
		prec: number
		widPresent: boolean
		precPresent: boolean
		minus: boolean
		plus: boolean
		sharp: boolean
		space: boolean
		zero: boolean
		plusV: boolean
		sharpV: boolean
	}

	constructor(init?: Partial<{wid?: number, prec?: number, widPresent?: boolean, precPresent?: boolean, minus?: boolean, plus?: boolean, sharp?: boolean, space?: boolean, zero?: boolean, plusV?: boolean, sharpV?: boolean}>) {
		this._fields = {
			wid: init?.wid ?? (0 as number),
			prec: init?.prec ?? (0 as number),
			widPresent: init?.widPresent ?? (false as boolean),
			precPresent: init?.precPresent ?? (false as boolean),
			minus: init?.minus ?? (false as boolean),
			plus: init?.plus ?? (false as boolean),
			sharp: init?.sharp ?? (false as boolean),
			space: init?.space ?? (false as boolean),
			zero: init?.zero ?? (false as boolean),
			plusV: init?.plusV ?? (false as boolean),
			sharpV: init?.sharpV ?? (false as boolean)
		}
	}

	public clone(): formatter {
		return $.markAsStructValue(new formatter(this))
	}

	static {
		$.bindStructFields(this.prototype, ["wid", "prec", "widPresent", "precPresent", "minus", "plus", "sharp", "space", "zero", "plusV", "sharpV"])
	}

	static __typeInfo = $.registerStructType(
		"main.formatter",
		() => new formatter(),
		() => [],
		formatter,
		() => [{ name: "wid", key: "wid", type: /* @__PURE__ */ $.basicType("int") }, { name: "prec", key: "prec", type: /* @__PURE__ */ $.basicType("int") }, { name: "widPresent", key: "widPresent", type: /* @__PURE__ */ $.basicType("bool") }, { name: "precPresent", key: "precPresent", type: /* @__PURE__ */ $.basicType("bool") }, { name: "minus", key: "minus", type: /* @__PURE__ */ $.basicType("bool") }, { name: "plus", key: "plus", type: /* @__PURE__ */ $.basicType("bool") }, { name: "sharp", key: "sharp", type: /* @__PURE__ */ $.basicType("bool") }, { name: "space", key: "space", type: /* @__PURE__ */ $.basicType("bool") }, { name: "zero", key: "zero", type: /* @__PURE__ */ $.basicType("bool") }, { name: "plusV", key: "plusV", type: /* @__PURE__ */ $.basicType("bool") }, { name: "sharpV", key: "sharpV", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export class printer {
	public declare buf: $.Slice<number>

	public declare arg: any

	// This line causes the issue: fmt: $.VarRef<fmt>; where fmt is undefined
	// Should generate proper type reference
	public declare fmt: formatter

	public _fields: {
		buf: $.Slice<number>
		arg: any
		fmt: formatter
	}

	constructor(init?: Partial<{buf?: $.Slice<number>, arg?: any, fmt?: formatter}>) {
		this._fields = {
			buf: init?.buf ?? (null! as $.Slice<number>),
			arg: init?.arg ?? (null! as any),
			fmt: init?.fmt ? $.markAsStructValue($.cloneStructValue(init.fmt)) : $.markAsStructValue(new formatter())
		}
	}

	public clone(): printer {
		return $.markAsStructValue(new printer(this))
	}

	public async format(verb: number): globalThis.Promise<void> {
		const p: printer | $.VarRef<printer> | null = this;
		// Use the formatter
		if ($.pointerValue<printer>(p).fmt.minus) {
			await $.println("minus flag set")
		}
		if ($.pointerValue<printer>(p).fmt.plus) {
			await $.println("plus flag set")
		}
	}

	public init(): void {
		let p: printer | $.VarRef<printer> | null = this;
		$.assignStruct($.pointerValue<printer>(p).fmt, $.markAsStructValue(new formatter()))
	}

	static {
		$.bindStructFields(this.prototype, ["buf", "arg", "fmt"])
	}

	static __typeInfo = $.registerStructType(
		"main.printer",
		() => new printer(),
		() => [{ name: "format", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "init", args: [], returns: [] }],
		printer,
		() => [{ name: "buf", key: "buf", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { name: "arg", key: "arg", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "fmt", key: "fmt", type: "main.formatter" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p: printer | $.VarRef<printer> | null = new printer()
	printer.prototype.init.call(p)
	await printer.prototype.format.call(p, $.int(100, 32))
	await $.println("Formatter test completed")
}

if ($.isMainScript(import.meta)) {
	await main()
}
