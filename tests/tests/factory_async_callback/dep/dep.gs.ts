// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Factory = {
	GetConfigID(): string
}

$.registerInterfaceType(
	"dep.Factory",
	null,
	[{ name: "GetConfigID", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class Bus {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Bus {
		return $.markAsStructValue(new Bus(this))
	}

	static __typeInfo = $.registerStructType(
		"dep.Bus",
		() => new Bus(),
		() => [],
		Bus,
		() => []
	)
}

export class factory {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): factory {
		return $.markAsStructValue(new factory(this))
	}

	public GetConfigID(__typeArgs: $.GenericTypeArgs | undefined): string {
		const f: factory | $.VarRef<factory> | null = this;
		return "factory-async"
	}

	static __typeInfo = $.registerStructType(
		"dep.factory",
		() => new factory(),
		() => [{ name: "GetConfigID", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		factory,
		() => []
	)
}

export async function NewFactory(b: Bus): globalThis.Promise<Factory | null> {
	let ch: $.Channel<{}> | null = $.makeChannel<{}>(1, {}, "both")
	await $.chanSend(ch, {})
	await $.chanRecv(ch)
	return $.namedValueInterfaceValue<Factory | null>(new factory(), "*dep.factory", {GetConfigID: (receiver: any, ...args: any[]) => $.pointerValue(receiver).GetConfigID({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "dep.Bus", zero: () => $.markAsStructValue(new Bus()) }}, ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.pointerType("dep.factory"), [$.methodSignature("GetConfigID", [], [/* @__PURE__ */ $.basicType("string")])])
}
