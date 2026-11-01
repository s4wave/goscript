// Generated file based on local_type_same_name.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class person {
	public declare ID: number

	constructor(__goscriptValue?: boolean, ID$?: number) {
		this.ID = ID$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): person {
		return new person(true, this.ID)
	}

	public __goscriptAssign(source: person): this {
		this.ID = source.ID
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.person",
		() => new person(),
		() => [],
		person,
		() => [/* @__PURE__ */ $.structField("ID", /* @__PURE__ */ $.basicType("int"), [0], 0, true)]
	)
}

export async function show(v: any): globalThis.Promise<void> {
	let t = (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(v)).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await $.println((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).NumField(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	for (let i = 0; i < (__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).NumField(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait); i++) {
		await $.println(((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Field(i), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField).Name, (fmt.Sprint(reflect.ValueOf(v).Elem().Field(i).Interface()) as string))
	}
	await $.println((fmt.Sprintf("%T", v) as string))
}

export function a(): any {
	class person {
		public declare Name: string

		public declare Age: number

		constructor(init?: Partial<{Name?: string, Age?: number}>, __goscriptValue?: boolean) {
			this.Name = init?.Name ?? ("" as string)
			this.Age = init?.Age ?? (0 as number)
			;(this as any).__goStructValue = __goscriptValue === true
		}

		public clone(): person {
			return new person(this, true)
		}

		public __goscriptAssign(source: person): this {
			this.Name = source.Name
			this.Age = source.Age
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.person·w2tu5a",
			() => new person(),
			() => [],
			person,
			() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Age", /* @__PURE__ */ $.basicType("int"), [1], 16, true)]
		)
	}
	return $.interfaceValue(new person({Name: "Go", Age: 35}), "*main.person·w2tu5a", /* @__PURE__ */ $.pointerType("main.person·w2tu5a"))
}

export function b(): any {
	class person {
		public declare Title: string

		constructor(init?: Partial<{Title?: string}>, __goscriptValue?: boolean) {
			this.Title = init?.Title ?? ("" as string)
			;(this as any).__goStructValue = __goscriptValue === true
		}

		public clone(): person {
			return new person(this, true)
		}

		public __goscriptAssign(source: person): this {
			this.Title = source.Title
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.person·qyqnq0",
			() => new person(),
			() => [],
			person,
			() => [/* @__PURE__ */ $.structField("Title", /* @__PURE__ */ $.basicType("string"), [0], 0, true)]
		)
	}
	return $.interfaceValue(new person({Title: "Dr"}), "*main.person·qyqnq0", /* @__PURE__ */ $.pointerType("main.person·qyqnq0"))
}

export async function fieldKinds(v: any): globalThis.Promise<void> {
	let t = reflect.TypeOf(v)
	for (let i = 0; i < (__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).NumField(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait); i++) {
		let f = ((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Field(i), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField).Type
		await $.println((__goscriptAwait = (f !== null && (f as any).__isVarRef !== true && ((f as any).__goValue === undefined || (f as any).__goType?.charCodeAt(0) !== 42) ? (f as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(f)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), reflect.Kind_String((__goscriptAwait = (f !== null && (f as any).__isVarRef !== true && ((f as any).__goValue === undefined || (f as any).__goType?.charCodeAt(0) !== 42) ? (f as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(f)).Kind(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>((__goscriptAwait = (f !== null && (f as any).__isVarRef !== true && ((f as any).__goValue === undefined || (f as any).__goType?.charCodeAt(0) !== 42) ? (f as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(f)).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	}
}

export function c(): any {
	type keys = globalThis.Map<string, any> | null
	let x: {"K": keys} = $.anonymousStructValue({"K": null}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("K", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }, "main.keys·94feae"), [0], 0, true, { tag: "json:\",embed\"" })] })
	return $.interfaceValue(x, "struct{K main.keys \"json:\\\",embed\\\"\"}", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("K", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }, "main.keys·94feae"), [0], 0, true, { tag: "json:\",embed\"" })] })
}

export function d(): any {
	type keys = string[]
	let x: {"K": keys} = $.anonymousStructValue({"K": $.arrayValue(globalThis.Array.from({ length: 2 }, () => ""))}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("K", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 2, "main.keys·lbbeg2"), [0], 0, true)] })
	return $.interfaceValue(x, "struct{K main.keys}", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("K", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 2, "main.keys·lbbeg2"), [0], 0, true)] })
}

export async function main(): globalThis.Promise<void> {
	let pa = a()
	let pb = b()
	await show(pa)
	await show(pb)
	await show($.interfaceValue(new person(false, 7), "*main.person", /* @__PURE__ */ $.pointerType("main.person")))

	// Local types of the same name are distinct types.
	let [, ok] = $.typeAssertTuple<any>(pa, { kind: $.TypeKind.Interface, methods: [{ name: "unused", args: [], returns: [] }] })
	await $.println(ok, $.comparableEqual(reflect.TypeOf(pa), reflect.TypeOf(pb)), $.comparableEqual(reflect.TypeOf(pa), reflect.TypeOf(a())))

	// Local map and array types of the same name keep their own kinds.
	await fieldKinds(c())
	await fieldKinds(d())
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
