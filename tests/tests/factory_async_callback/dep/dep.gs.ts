// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Factory = {
	GetConfigID(): string | globalThis.Promise<string>
}

$.registerInterfaceType(
	"dep.Factory",
	null,
	[{ name: "GetConfigID", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export class Bus {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Bus {
		const cloned = new Bus()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"dep.Bus",
		() => new Bus(),
		[],
		Bus,
		[]
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
		const cloned = new factory()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public GetConfigID(__typeArgs: $.GenericTypeArgs | undefined): string {
		const f: factory | $.VarRef<factory> | null = this
		return "factory-async"
	}

	static __typeInfo = $.registerStructType(
		"dep.factory",
		() => new factory(),
		[{ name: "GetConfigID", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		factory,
		[]
	)
}

export async function NewFactory(b: Bus): globalThis.Promise<Factory | null> {
	let ch: $.Channel<{}> | null = $.makeChannel<{}>(1, {}, "both")
	await $.chanSend(ch, {})
	await $.chanRecv(ch)
	return $.namedValueInterfaceValue<Factory | null>(new factory(), "*dep.factory", {GetConfigID: (receiver: any, ...args: any[]) => receiver.GetConfigID({[$.genericTypeArgsMarker]: true, T: { type: "dep.Bus", zero: () => $.markAsStructValue(new Bus()) }}, ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: "dep.factory" }, [{ name: "GetConfigID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])
}
