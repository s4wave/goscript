// Generated file based on generic_struct_field_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class box {
	public declare Value: any

	public _fields: {
		Value: any
	}

	constructor(init?: Partial<{Value?: any}>) {
		this._fields = {
			Value: init?.Value ?? (null! as any)
		}
	}

	public clone(): box {
		return $.markAsStructValue(new box(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		() => new box(),
		() => [],
		box,
		() => [{ name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class point {
	public declare X: number

	public _fields: {
		X: number
	}

	constructor(init?: Partial<{X?: number}>) {
		this._fields = {
			X: init?.X ?? (0 as number)
		}
	}

	public clone(): point {
		return $.markAsStructValue(new point(this))
	}

	static {
		$.bindStructFields(this.prototype, ["X"])
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [],
		point,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let intBox: box = $.markAsStructValue(new box({Value: 0}))
	await $.println("int", intBox.Value)

	let stringBox: box = $.markAsStructValue(new box({Value: ""}))
	await $.println("string", $.stringEqual(stringBox.Value, ""))

	let mapBox: box = $.markAsStructValue(new box({Value: null! as globalThis.Map<string, number> | null}))
	await $.println("map", mapBox.Value == null)

	let pointBox: box = $.markAsStructValue(new box({Value: $.markAsStructValue(new point())}))
	await $.println("struct", pointBox.Value.X)

	let explicit = $.markAsStructValue(new box({Value: 0}))
	await $.println("literal", explicit.Value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
