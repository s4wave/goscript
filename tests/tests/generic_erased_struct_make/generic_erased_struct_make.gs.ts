// Generated file based on generic_erased_struct_make.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class queue {
	public declare buf: $.Slice<any>

	constructor(__goscriptValue?: boolean, buf$?: $.Slice<any>) {
		this.buf = buf$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): queue {
		return $.copyGenericInstance(this, new queue(true, this.buf))
	}

	public __goscriptAssign(source: queue): this {
		this.buf = source.buf
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.queue",
		() => new queue(),
		() => [],
		queue,
		() => [{ name: "buf", key: "buf", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export function newQueue(__typeArgs: $.GenericTypeArgs | undefined, capacity: number): queue | $.VarRef<queue> | null {
	return new queue(false, $.makeSlice<any>(capacity, undefined, $.genericSliceTypeHint(__typeArgs, "T"), () => ($.genericZero(__typeArgs, "T", null) as any)))
}

export async function main(): globalThis.Promise<void> {
	let q = (newQueue(__goscriptStatic0(), 2) as queue | $.VarRef<queue> | null)
	let q$: queue = q == null ? $.pointerTarget<queue>(q) : (q as any).__isVarRef === true ? (q as any).value : (q as any).__goValue === undefined ? (q as any) : $.pointerTarget<queue>(q)
	$.sliceElems((q$ as queue).buf!)[$.sliceSlot((q$ as queue).buf!, 0)] = 7
	await $.println($.sliceLen((q$ as queue).buf), $.arrayIndex((q$ as queue).buf!, 0))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

if ($.isMainScript(import.meta)) {
	await main()
}
