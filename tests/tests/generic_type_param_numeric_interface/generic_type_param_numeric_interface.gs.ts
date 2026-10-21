// Generated file based on generic_type_param_numeric_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export type Celsius = number

export class Base {
	public declare Values: $.Slice<any>

	constructor(__goscriptValue?: boolean, Values$?: $.Slice<any>) {
		this.Values = Values$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Base {
		return $.copyGenericInstance(this, new Base(true, this.Values))
	}

	public __goscriptAssign(source: Base): this {
		this.Values = source.Values
		return this
	}

	public Kind(__typeArgs: $.GenericTypeArgs | undefined): reflect.Kind {
		const b: Base | $.VarRef<Base> | null = this;
		let v: any = $.genericZero(__typeArgs, "T", null)
		return ($.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.typeParamInterfaceValue<any>(v, __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }))).Kind() as reflect.Kind)
	}

	static __typeInfo = $.registerStructType(
		"main.Base",
		() => new Base(),
		() => [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")], true)],
		Base,
		() => [/* @__PURE__ */ $.structField("Values", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }), [0], 0, true)]
	)
}

export function kindOf(__typeArgs: $.GenericTypeArgs | undefined, v: any): string {
	return reflect.Kind_String(($.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.typeParamInterfaceValue<any>(v, __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }))).Kind() as reflect.Kind))
}

export function typeSwitch(__typeArgs: $.GenericTypeArgs | undefined, v: any): string {
	{
		const __goscriptTypeSwitchValue = $.typeParamInterfaceValue<any>(v, __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null })
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic0())) {
			case 0:
				{
					return "float64"
				}
				break
			case 1:
				{
					return "float32"
				}
				break
			case 2:
				{
					return "int"
				}
				break
			case 3:
				{
					return "int64"
				}
				break
			case 4:
				{
					return "uint8"
				}
				break
			case 5:
				{
					return "string"
				}
				break
		}
	}
	return "other"
}

export async function main(): globalThis.Promise<void> {
	await $.println(reflect.Kind_String(Base.prototype.Kind.call(($.genericInstance(new Base(), __goscriptStatic2)), __goscriptStatic1())), reflect.Kind_String(Base.prototype.Kind.call(($.genericInstance(new Base(), __goscriptStatic4)), __goscriptStatic3())), reflect.Kind_String(Base.prototype.Kind.call(($.genericInstance(new Base(), __goscriptStatic6)), __goscriptStatic5())))
	await $.println(reflect.Kind_String(Base.prototype.Kind.call(($.genericInstance(new Base(), __goscriptStatic8)), __goscriptStatic7())), reflect.Kind_String(Base.prototype.Kind.call(($.genericInstance(new Base(), __goscriptStatic10)), __goscriptStatic9())), reflect.Kind_String(Base.prototype.Kind.call(($.genericInstance(new Base(), __goscriptStatic12)), __goscriptStatic11())))
	await $.println(kindOf(__goscriptStatic1(), 0.0), kindOf(__goscriptStatic3(), 2), kindOf(__goscriptStatic5(), 3), kindOf(__goscriptStatic7(), 4n), kindOf(__goscriptStatic13(), 5))
	await $.println(typeSwitch(__goscriptStatic1(), 1.0), typeSwitch(__goscriptStatic3(), 1), typeSwitch(__goscriptStatic5(), 1), typeSwitch(__goscriptStatic7(), 1n), typeSwitch(__goscriptStatic9(), 1), typeSwitch(__goscriptStatic11(), "s"))
	let x: any = $.basicInterfaceValue(2.5, "float64")
	await $.println(typeSwitch(__goscriptStatic14(), x))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("float64"), /* @__PURE__ */ $.basicType("float32"), /* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int64"), /* @__PURE__ */ $.basicType("uint8"), /* @__PURE__ */ $.basicType("string")]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float64"), zero: () => 0 }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ([{Kind: (receiver: any) => $.pointerValue(receiver).Kind(__goscriptStatic1())}, [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")], true, false)]])
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float32"), zero: () => 0 }})
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ([{Kind: (receiver: any) => $.pointerValue(receiver).Kind(__goscriptStatic3())}, [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")], true, false)]])
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ([{Kind: (receiver: any) => $.pointerValue(receiver).Kind(__goscriptStatic5())}, [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")], true, false)]])
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }})
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ([{Kind: (receiver: any) => $.pointerValue(receiver).Kind(__goscriptStatic7())}, [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")], true, false)]])
}

var __goscriptStatic9$value: any
function __goscriptStatic9(): any {
	return __goscriptStatic9$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("uint8"), zero: () => 0 }})
}

var __goscriptStatic10$value: any
function __goscriptStatic10(): any {
	return __goscriptStatic10$value ??= ([{Kind: (receiver: any) => $.pointerValue(receiver).Kind(__goscriptStatic9())}, [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")], true, false)]])
}

var __goscriptStatic11$value: any
function __goscriptStatic11(): any {
	return __goscriptStatic11$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic12$value: any
function __goscriptStatic12(): any {
	return __goscriptStatic12$value ??= ([{Kind: (receiver: any) => $.pointerValue(receiver).Kind(__goscriptStatic11())}, [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")], true, false)]])
}

var __goscriptStatic13$value: any
function __goscriptStatic13(): any {
	return __goscriptStatic13$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float64", "main.Celsius"), zero: () => 0 }})
}

var __goscriptStatic14$value: any
function __goscriptStatic14(): any {
	return __goscriptStatic14$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
}

if ($.isMainScript(import.meta)) {
	await main()
}
