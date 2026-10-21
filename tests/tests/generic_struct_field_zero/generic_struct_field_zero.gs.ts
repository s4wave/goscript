// Generated file based on generic_struct_field_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class box {
	public declare Value: any

	constructor(__goscriptValue?: boolean, Value$?: any) {
		this.Value = Value$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): box {
		return $.copyGenericInstance(this, new box(true, $.copyElement(this.Value)))
	}

	public __goscriptAssign(source: box): this {
		this.Value = $.assignFieldValue(this.Value, source.Value)
		return this
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

	constructor(__goscriptValue?: boolean, X$?: number) {
		this.X = X$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): point {
		return new point(true, this.X)
	}

	public __goscriptAssign(source: point): this {
		this.X = source.X
		return this
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
	let intBox: box = new box(true, 0)
	await $.println("int", intBox.Value)

	let stringBox: box = new box(true, "")
	await $.println("string", $.stringEqual(stringBox.Value, ""))

	let mapBox: box = new box(true, null! as globalThis.Map<string, number> | null)
	await $.println("map", mapBox.Value == null)

	let pointBox: box = new box(true, new point(true))
	await $.println("struct", pointBox.Value.X)

	let explicit = new box(true, 0)
	await $.println("literal", explicit.Value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
