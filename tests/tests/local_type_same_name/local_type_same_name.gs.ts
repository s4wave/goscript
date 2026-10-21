// Generated file based on local_type_same_name.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class person {
	public declare ID: number

	constructor(__goscriptValue?: boolean, ID$?: number) {
		this.ID = ID$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
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
		await $.println(((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Field(i), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField).Name, (fmt.Sprint($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf(v))).Elem())).Field(i))).Interface()) as string))
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
			;(this as any)[$.structValueMarker] = __goscriptValue === true
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
			;(this as any)[$.structValueMarker] = __goscriptValue === true
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

export async function main(): globalThis.Promise<void> {
	let pa = a()
	let pb = b()
	await show(pa)
	await show(pb)
	await show($.interfaceValue(new person(false, 7), "*main.person", /* @__PURE__ */ $.pointerType("main.person")))

	// Local types of the same name are distinct types.
	let [, ok] = $.typeAssertTuple<any>(pa, { kind: $.TypeKind.Interface, methods: [{ name: "unused", args: [], returns: [] }] })
	await $.println(ok, $.comparableEqual(reflect.TypeOf(pa), reflect.TypeOf(pb)), $.comparableEqual(reflect.TypeOf(pa), reflect.TypeOf(a())))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
