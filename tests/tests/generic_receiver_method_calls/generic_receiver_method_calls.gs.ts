// Generated file based on generic_receiver_method_calls.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type reader = {
	Value(__typeArgs: $.GenericTypeArgs | undefined): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.reader",
	null,
	[{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class box {
	public get value(): any {
		return this._fields.value.value
	}
	public set value(value: any) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<any>
	}

	constructor(init?: Partial<{value?: any}>) {
		this._fields = {
			value: $.varRef(init?.value ?? (null! as any))
		}
	}

	public clone(): box {
		const cloned = new box()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		const b: box | $.VarRef<box> | null = this
		return $.pointerValue<box>(b).value
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		() => new box(),
		[{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		box,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class holder {
	public get box(): box {
		return this._fields.box.value
	}
	public set box(value: box) {
		this._fields.box.value = value
	}

	public _fields: {
		box: $.VarRef<box>
	}

	constructor(init?: Partial<{box?: box}>) {
		this._fields = {
			box: $.varRef(init?.box ? $.markAsStructValue($.cloneStructValue(init.box)) : $.markAsStructValue(new box({value: null})))
		}
	}

	public clone(): holder {
		const cloned = new holder()
		cloned._fields = {
			box: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.box.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		return $.pointerValue<box>(this.box).Value({[$.genericTypeArgsMarker]: true, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		[{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		holder,
		[{ name: "box", key: "box", type: "main.box", anonymous: true }]
	)
}

export function direct(__typeArgs: $.GenericTypeArgs | undefined, b: box | $.VarRef<box> | null): any {
	return (box.prototype.Value.call(b, {[$.genericTypeArgsMarker]: true, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}) as any)
}

export async function throughInterface(__typeArgs: $.GenericTypeArgs | undefined, r: reader | null): globalThis.Promise<any> {
	return (await $.callInterfaceMethod($.pointerValue<Exclude<reader, null>>(r), "Value", {[$.genericTypeArgsMarker]: true, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}) as any)
}

export function promoted(__typeArgs: $.GenericTypeArgs | undefined, h: holder | $.VarRef<holder> | null): any {
	return ($.pointerValue<holder>(h).box.Value({[$.genericTypeArgsMarker]: true, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}) as any)
}

export async function methodExpression(__typeArgs: $.GenericTypeArgs | undefined, b: box | $.VarRef<box> | null): globalThis.Promise<any> {
	let value: ((_p0: box | $.VarRef<box> | null) => any | globalThis.Promise<any>) | null = $.functionValue((b: box | $.VarRef<box> | null): any => $.pointerValue<box>(b).Value({[$.genericTypeArgsMarker]: true, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "main.box" }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))
	return value!(b)
}

export async function main(): globalThis.Promise<void> {
	let b: box | $.VarRef<box> | null = new box({value: 7})
	$.println("direct:", direct({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, b))
	$.println("interface:", await throughInterface({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, $.namedValueInterfaceValue<reader | null>(b, "*main.box", {Value: (receiver: any, ...args: any[]) => receiver.Value({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: "main.box" }, [{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])))
	$.println("promoted:", promoted({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, new holder({box: $.markAsStructValue($.cloneStructValue($.pointerValue<box>(b)))})))
	$.println("expression:", await methodExpression({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, b))
}

if ($.isMainScript(import.meta)) {
	await main()
}
