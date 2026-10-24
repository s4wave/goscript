// Generated file based on fmt_func_values.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as strings from "@goscript/strings/index.js"

export class Tiered {
	public declare First: $.Slice<(() => void) | null>

	public declare Normal: $.Slice<(() => void) | null>

	constructor(__goscriptValue?: boolean, First$?: $.Slice<(() => void) | null>, Normal$?: $.Slice<(() => void) | null>) {
		this.First = First$ ?? (null! as $.Slice<(() => void) | null>)
		this.Normal = Normal$ ?? (null! as $.Slice<(() => void) | null>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Tiered {
		return new Tiered(true, this.First, this.Normal)
	}

	public __goscriptAssign(source: Tiered): this {
		this.First = source.First
		this.Normal = source.Normal
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Tiered",
		() => new Tiered(),
		() => [],
		Tiered,
		() => [{ name: "First", key: "First", type: /* @__PURE__ */ $.sliceType(({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)) }, { name: "Normal", key: "Normal", type: /* @__PURE__ */ $.sliceType(({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)) }]
	)
}

export function named(): void {
}

export async function main(): globalThis.Promise<void> {
	let n = 3
	let f = $.functionValue(async () => {
		await $.println(n)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

	// A func prints as its address, the same as %p.
	let p = (fmt.Sprintf("%p", $.interfaceValue(f, "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) as string)
	await $.println(strings.HasPrefix(p, "0x"), $.stringEqual((fmt.Sprintf("%v", $.interfaceValue(f, "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) as string), p), $.stringEqual((fmt.Sprint($.interfaceValue(f, "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) as string), p))
	await $.println($.stringEqual((fmt.Sprint($.interfaceValue($.goFunc(named, "main.named"), "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) as string), (fmt.Sprintf("%p", $.interfaceValue($.goFunc(named, "main.named"), "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) as string)))

	// %#v also spells its type.
	await $.println($.stringEqual((fmt.Sprintf("%#v", $.interfaceValue(f, "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) as string), ("(func())(" + p + ")")))

	// Funcs in slices and structs print as their addresses too.
	await $.println($.stringEqual((fmt.Sprint($.interfaceValue($.arrayToSlice<(() => void) | null>([f]), "[]func()", /* @__PURE__ */ $.sliceType(({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))) as string), ("[" + p + "]")))
	await $.println($.stringEqual((fmt.Sprintf("%+v", $.structInterfaceValue(new Tiered(true, undefined, $.arrayToSlice<(() => void) | null>([f])), "main.Tiered", "main.Tiered")) as string), ("{First:[] Normal:[" + p + "]}")))

	// A nil func prints as nil.
	let nf: (() => void) | null = null! as (() => void) | null
	await $.println((fmt.Sprint($.interfaceValue(nf, "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))) as string))
}

if ($.isMainScript(import.meta)) {
	await main()
}
