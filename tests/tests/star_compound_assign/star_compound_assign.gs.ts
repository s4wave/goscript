// Generated file based on star_compound_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class holder {
	public declare values: $.VarRef<$.Slice<number>> | null

	public _fields: {
		values: $.VarRef<$.Slice<number>> | null
	}

	constructor(init?: Partial<{values?: $.VarRef<$.Slice<number>> | null}>) {
		this._fields = {
			values: init?.values ?? (null! as $.VarRef<$.Slice<number>> | null)
		}
	}

	public clone(): holder {
		return $.markAsStructValue(new holder(this))
	}

	static {
		$.bindStructFields(this.prototype, ["values"])
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
	$.pointerValue<holder>(h).values!.value = $.goSlice(($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)), undefined, $.len($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)) - 1)
}

export function trimParen(h: holder | $.VarRef<holder> | null): void {
	$.pointerValue<holder>(h).values!.value = $.goSlice(($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)), undefined, $.len($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)) - 1)
}

export async function main(): globalThis.Promise<void> {
	let x: $.VarRef<number> = $.varRef(2)
	let p: $.VarRef<number> | null = x

	p!.value = p!.value + (3)
	await $.println(x.value)

	p!.value = p!.value & ~((1))
	// 5 (0101) &^ 1 (0001) = 4 (0100)
	await $.println(x.value)

	p!.value = p!.value << (2)
	await $.println(x.value)

	p!.value = p!.value >> (1)
	await $.println(x.value)

	p!.value = p!.value | (3)
	await $.println(x.value)

	p!.value++
	await $.println(x.value)

	p!.value--
	await $.println(x.value)

	let values: $.VarRef<$.Slice<number>> = $.varRef($.arrayToSlice<number>([1, 2, 3, 4]))
	let h: holder | $.VarRef<holder> | null = new holder({values: values})
	trim(h)
	await $.println("len after star:", $.len($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)))
	trimParen(h)
	await $.println("len after paren star:", $.len($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)))
}

if ($.isMainScript(import.meta)) {
	await main()
}
