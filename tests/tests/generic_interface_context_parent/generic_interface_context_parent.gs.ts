// Generated file based on generic_interface_context_parent.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"
import "@goscript/context/index.js"

export type Resolver = {
	Resolve(ctx: context.Context | null, handler: Handler | null): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"main.Resolver",
	null,
	[{ name: "Resolve", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }]
);

export type Handler = {
	Mark(): void
}

$.registerInterfaceType(
	"main.Handler",
	null,
	[{ name: "Mark", args: [], returns: [] }]
);

export type ValueReader = {
	Get(): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.ValueReader",
	null,
	[{ name: "Get", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export class handler {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): handler {
		const cloned = new handler()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Mark(): void {
	}

	static __typeInfo = $.registerStructType(
		"main.handler",
		() => new handler(),
		[{ name: "Mark", args: [], returns: [] }],
		handler,
		[]
	)
}

export class genericResolver {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): genericResolver {
		const cloned = new genericResolver()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public async Resolve(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, handler: Handler | null): globalThis.Promise<$.GoError> {
		let [child, cancel] = context.WithCancel($.pointerValueOrNil(ctx)!)
		await cancel!()
		await $.chanRecv(await $.pointerValue<Exclude<context.Context, null>>(child).Done())
		await $.pointerValue<Exclude<Handler, null>>(handler).Mark()
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.genericResolver",
		() => new genericResolver(),
		[{ name: "Resolve", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		genericResolver,
		[]
	)
}

export class genericValue {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? (0 as number))
		}
	}

	public clone(): genericValue {
		const cloned = new genericValue()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Get(__typeArgs: $.GenericTypeArgs | undefined): number {
		const v = this
		return v.value
	}

	static __typeInfo = $.registerStructType(
		"main.genericValue",
		() => new genericValue(),
		[{ name: "Get", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		genericValue,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let resolver: Resolver | null = $.namedValueInterfaceValue<Resolver | null>(new genericResolver(), "*main.genericResolver", {Resolve: (receiver: any, ...args: any[]) => receiver.Resolve({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ...args)}, { kind: $.TypeKind.Pointer, elemType: "main.genericResolver" }, [{ name: "Resolve", args: [{ name: "ctx", type: "context.Context" }, { name: "handler", type: "main.Handler" }], returns: [{ name: "_r0", type: "error" }] }])
	{
		let err = await $.pointerValue<Exclude<Resolver, null>>(resolver).Resolve(context.Background(), $.interfaceValue<Handler | null>($.markAsStructValue(new handler()), "main.handler", "main.handler"))
		if (err != null) {
			$.println("resolve failed")
			return
		}
	}
	$.println("resolve ok")
	let g = $.markAsStructValue(new genericValue({value: 7}))
	let reader: ValueReader | null = $.namedValueInterfaceValue<ValueReader | null>($.markAsStructValue($.cloneStructValue(g)), "main.genericValue", {Get: (receiver: any, ...args: any[]) => receiver.Get({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ...args)}, "main.genericValue", [{ name: "Get", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])
	g.value = 9
	if (await $.pointerValue<Exclude<ValueReader, null>>(reader).Get() != 7) {
		$.println("value copy failed")
		return
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
