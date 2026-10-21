// Generated file based on override_variadic_func_values.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as strings from "@goscript/strings/index.js"
import "@goscript/strings/index.js"

export class printer {
	public declare print: ((a: $.Slice<any>) => string | globalThis.Promise<string>) | null

	constructor(__goscriptValue?: boolean, print$?: ((a: $.Slice<any>) => string | globalThis.Promise<string>) | null) {
		this.print = print$ ?? (null! as ((a: $.Slice<any>) => string | globalThis.Promise<string>) | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): printer {
		return new printer(true, this.print)
	}

	public __goscriptAssign(source: printer): this {
		this.print = source.print
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.printer",
		() => new printer(),
		() => [],
		printer,
		() => [/* @__PURE__ */ $.structField("print", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] })], results: [/* @__PURE__ */ $.basicType("string")], isVariadic: true } as $.FunctionTypeInfo), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/override_variadic_func_values" })]
	)
}

export function apply(f: ((_p0: string, _p1: $.Slice<any>) => string | globalThis.Promise<string>) | null): string {
	return (f!("%v-%v", $.arrayToSlice<any>([$.basicInterfaceValue(1, "int"), $.basicInterfaceValue(2, "int")])) as string)
}

export async function main(): globalThis.Promise<void> {
	// The values of variadic functions of hand-written packages take their
	// variadic arguments as a slice, as the values of Go functions do.
	let f: ((format: string, a: $.Slice<any>) => string | globalThis.Promise<string>) | null = ((__goscriptFn: typeof fmt.Sprintf) => (__goscriptArg0: string, __goscriptArg1: $.Slice<any>) => __goscriptFn(__goscriptArg0, ...(__goscriptArg1 ?? [])))(fmt.Sprintf)
	await $.println((f!("%v-%v", $.arrayToSlice<any>([$.basicInterfaceValue(1, "int"), $.basicInterfaceValue(2, "int")])) as string))
	await $.println(apply(((__goscriptFn: typeof fmt.Sprintf) => (__goscriptArg0: string, __goscriptArg1: $.Slice<any>) => __goscriptFn(__goscriptArg0, ...(__goscriptArg1 ?? [])))(fmt.Sprintf)))
	let args = $.arrayToSlice<any>([$.basicInterfaceValue(3, "int"), $.basicInterfaceValue(4, "int")])
	await $.println((f!("%v-%v", args) as string))
	let p = new printer(true, ((__goscriptFn: typeof fmt.Sprint) => (__goscriptArg0: $.Slice<any>) => __goscriptFn(...(__goscriptArg0 ?? [])))(fmt.Sprint))
	await $.println((p.print!($.arrayToSlice<any>([$.basicInterfaceValue(5, "int"), $.basicInterfaceValue(6, "int")])) as string))
	let r: ((oldnew: $.Slice<string>) => strings.Replacer | $.VarRef<strings.Replacer> | null | globalThis.Promise<strings.Replacer | $.VarRef<strings.Replacer> | null>) | null = ((__goscriptFn: typeof strings.NewReplacer) => (__goscriptArg0: $.Slice<string>) => __goscriptFn(...(__goscriptArg0 ?? [])))(strings.NewReplacer)
	await $.println(strings.Replacer.prototype.Replace.call($.pointerValue<strings.Replacer>((r!($.arrayToSlice<string>(["a", "b"])) as strings.Replacer | $.VarRef<strings.Replacer> | null)), "aa"))
	let e: ((_p0: string, _p1: $.Slice<any>) => $.GoError | globalThis.Promise<$.GoError>) | null = ((__goscriptFn: typeof fmt.Errorf) => (__goscriptArg0: string, __goscriptArg1: $.Slice<any>) => __goscriptFn(__goscriptArg0, ...(__goscriptArg1 ?? [])))(fmt.Errorf)
	await $.println((__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>((e!("x %d", $.arrayToSlice<any>([$.basicInterfaceValue(7, "int")])) as $.GoError)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	// So does reflect, which calls them as Go function values, as
	// interpreters such as yaegi do.
	let call = await $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.goFunc(((__goscriptFn: typeof fmt.Sprintf) => (__goscriptArg0: string, __goscriptArg1: $.Slice<any>) => __goscriptFn(__goscriptArg0, ...(__goscriptArg1 ?? [])))(fmt.Sprintf), "fmt.Sprintf"), "func(format string, a ...any) string", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] })], results: [/* @__PURE__ */ $.basicType("string")], isVariadic: true } as $.FunctionTypeInfo))))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf("%v-%v"))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(8, "int")))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(9, "int"))))]))
	await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex(call!, 0))).String())

	// Direct calls are unchanged.
	await $.println((fmt.Sprintf("%v-%v", $.basicInterfaceValue(10, "int"), $.basicInterfaceValue(11, "int")) as string), (fmt.Sprint(...(args ?? [])) as string))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
