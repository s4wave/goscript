// Generated file based on generic_struct_slice_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as slices from "@goscript/slices/index.js"

export class item {
	public declare Text: string

	constructor(__goscriptValue?: boolean, Text$?: string) {
		this.Text = Text$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): item {
		return new item(true, this.Text)
	}

	public __goscriptAssign(source: item): this {
		this.Text = source.Text
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [],
		item,
		() => [{ name: "Text", key: "Text", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class arena {
	public declare data: $.Slice<any>

	constructor(__goscriptValue?: boolean, data$?: $.Slice<any>) {
		this.data = data$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): arena {
		return $.copyGenericInstance(this, new arena(true, this.data))
	}

	public __goscriptAssign(source: arena): this {
		this.data = source.data
		return this
	}

	public New(__typeArgs: $.GenericTypeArgs | undefined): any {
		const a: arena | $.VarRef<arena> | null = this;
		const a$: arena = a == null ? $.pointerTarget<arena>(a) : (a as any).__isVarRef === true ? (a as any).value : (a as any).__goValue === undefined ? (a as any) : $.pointerTarget<arena>(a)
		if ($.sliceLen((a$ as arena).data) == $.cap((a$ as arena).data)) {
			let nextSize = 1;
			;(a$ as arena).data = (slices.Grow(null, nextSize, () => ($.genericZero(__typeArgs, "T", null) as any)) as $.Slice<any>)
		}
		let index = $.sliceLen((a$ as arena).data);
		;(a$ as arena).data = $.goSlice((a$ as arena).data, undefined, index + 1)
		return $.indexRef((a$ as arena).data!, index)
	}

	static __typeInfo = $.registerStructType(
		"main.arena",
		() => new arena(),
		() => [{ name: "New", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Interface, methods: [] }) }], pointerReceiver: true }],
		arena,
		() => [{ name: "data", key: "data", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export async function main(): globalThis.Promise<void> {
	let a: $.VarRef<arena> = $.varRef($.genericInstance(new arena(true), __goscriptStatic1))
	let value = (a.value.New(__goscriptStatic0()) as item | $.VarRef<item> | null)
	let value$: item = value == null ? $.pointerTarget<item>(value) : (value as any).__isVarRef === true ? (value as any).value : (value as any).__goValue === undefined ? (value as any) : $.pointerTarget<item>(value);
	;(value$ as item).Text = "ok"
	await $.println((value$ as item).Text)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.item", zero: () => new item(true) }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{New: (receiver: any) => $.pointerValue(receiver).New(__goscriptStatic0())}, [$.methodSignature("New", [], [/* @__PURE__ */ $.pointerType("main.item")], true, false)]])
}

if ($.isMainScript(import.meta)) {
	await main()
}
