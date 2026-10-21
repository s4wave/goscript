// Generated file based on star_compound_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class holder {
	public declare values: $.VarRef<$.Slice<number>> | null

	constructor(__goscriptValue?: boolean, values$?: $.VarRef<$.Slice<number>> | null) {
		this.values = values$ ?? (null! as $.VarRef<$.Slice<number>> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): holder {
		return new holder(true, this.values)
	}

	public __goscriptAssign(source: holder): this {
		this.values = source.values
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [],
		holder,
		() => [{ name: "values", key: "values", type: /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))) }]
	)
}

export function trim(h: holder | $.VarRef<holder> | null): void {
	const h$: holder = h == null ? $.pointerTarget<holder>(h) : (h as any).__isVarRef === true ? (h as any).value : (h as any).__goValue === undefined ? (h as any) : $.pointerTarget<holder>(h);
	;(h$ as holder).values!.value = $.goSlice(($.pointerValue<$.Slice<number>>((h$ as holder).values)), undefined, $.sliceLen($.pointerValue<$.Slice<number>>((h$ as holder).values)) - 1)
}

export function trimParen(h: holder | $.VarRef<holder> | null): void {
	const h$: holder = h == null ? $.pointerTarget<holder>(h) : (h as any).__isVarRef === true ? (h as any).value : (h as any).__goValue === undefined ? (h as any) : $.pointerTarget<holder>(h);
	;(h$ as holder).values!.value = $.goSlice(($.pointerValue<$.Slice<number>>((h$ as holder).values)), undefined, $.sliceLen($.pointerValue<$.Slice<number>>((h$ as holder).values)) - 1)
}

export async function main(): globalThis.Promise<void> {
	let x = $.varRef(2)
	let p: $.VarRef<number> | null = x

	p!.value += 3
	await $.println(x.value)

	p!.value = $.intAndNot(p!.value, 1)
	// 5 (0101) &^ 1 (0001) = 4 (0100)
	await $.println(x.value)

	p!.value = $.intShl(p!.value, 2)
	await $.println(x.value)

	p!.value = $.intShr(p!.value, 1)
	await $.println(x.value)

	p!.value = $.intOr(p!.value, 3)
	await $.println(x.value)

	p!.value++
	await $.println(x.value)

	p!.value--
	await $.println(x.value)

	let values: $.VarRef<$.Slice<number>> = $.varRef($.arrayToSlice<number>([1, 2, 3, 4]))
	let h = new holder(false, values)
	let h$: holder = h == null ? $.pointerTarget<holder>(h) : (h as any).__isVarRef === true ? (h as any).value : (h as any).__goValue === undefined ? (h as any) : $.pointerTarget<holder>(h)
	trim(h)
	await $.println("len after star:", $.sliceLen($.pointerValue<$.Slice<number>>((h$ as holder).values)))
	trimParen(h)
	await $.println("len after paren star:", $.sliceLen($.pointerValue<$.Slice<number>>((h$ as holder).values)))
}

if ($.isMainScript(import.meta)) {
	await main()
}
