// Generated file based on conn_id_generator_methods.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type connRunner = {
	Add(_p0: number): void
}

$.registerInterfaceType(
	"main.connRunner",
	null,
	[{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);

export type sourceRunner = {
	SourceOnly(_p0: number): void
}

$.registerInterfaceType(
	"main.sourceRunner",
	null,
	[{ name: "SourceOnly", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);

export type connRunners = globalThis.Map<connRunner | null, connRunnerCallbacks> | null

export class transport {
	public get values(): globalThis.Map<number, number> | null {
		return this._fields.values.value
	}
	public set values(value: globalThis.Map<number, number> | null) {
		this._fields.values.value = value
	}

	public _fields: {
		values: $.VarRef<globalThis.Map<number, number> | null>
	}

	constructor(init?: Partial<{values?: globalThis.Map<number, number> | null}>) {
		this._fields = {
			values: $.varRef(init?.values ?? (null! as globalThis.Map<number, number> | null))
		}
	}

	public clone(): transport {
		const cloned = new transport()
		cloned._fields = {
			values: $.varRef(this._fields.values.value)
		}
		return $.markAsStructValue(cloned)
	}

	public SourceOnly(id: number): void {
		let h: transport | $.VarRef<transport> | null = this
		$.mapSet($.pointerValue<transport>(h).values, id, id)
	}

	static __typeInfo = $.registerStructType(
		"main.transport",
		() => new transport(),
		[{ name: "SourceOnly", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		transport,
		[{ name: "values", key: "values", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "int" }, elemType: { kind: $.TypeKind.Basic, name: "int" } } }]
	)
}

export class packetHandlerMap {
	public get values(): globalThis.Map<number, number> | null {
		return this._fields.values.value
	}
	public set values(value: globalThis.Map<number, number> | null) {
		this._fields.values.value = value
	}

	public _fields: {
		values: $.VarRef<globalThis.Map<number, number> | null>
	}

	constructor(init?: Partial<{values?: globalThis.Map<number, number> | null}>) {
		this._fields = {
			values: $.varRef(init?.values ?? (null! as globalThis.Map<number, number> | null))
		}
	}

	public clone(): packetHandlerMap {
		const cloned = new packetHandlerMap()
		cloned._fields = {
			values: $.varRef(this._fields.values.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Add(id: number): void {
		let h: packetHandlerMap | $.VarRef<packetHandlerMap> | null = this
		$.mapSet($.pointerValue<packetHandlerMap>(h).values, id, id)
	}

	static __typeInfo = $.registerStructType(
		"main.packetHandlerMap",
		() => new packetHandlerMap(),
		[{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		packetHandlerMap,
		[{ name: "values", key: "values", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "int" }, elemType: { kind: $.TypeKind.Basic, name: "int" } } }]
	)
}

export class connRunnerCallbacks {
	public get AddConnectionID(): ((_p0: number) => void) | null {
		return this._fields.AddConnectionID.value
	}
	public set AddConnectionID(value: ((_p0: number) => void) | null) {
		this._fields.AddConnectionID.value = value
	}

	public _fields: {
		AddConnectionID: $.VarRef<((_p0: number) => void) | null>
	}

	constructor(init?: Partial<{AddConnectionID?: ((_p0: number) => void) | null}>) {
		this._fields = {
			AddConnectionID: $.varRef(init?.AddConnectionID ?? (null! as ((_p0: number) => void) | null))
		}
	}

	public clone(): connRunnerCallbacks {
		const cloned = new connRunnerCallbacks()
		cloned._fields = {
			AddConnectionID: $.varRef(this._fields.AddConnectionID.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.connRunnerCallbacks",
		() => new connRunnerCallbacks(),
		[],
		connRunnerCallbacks,
		[{ name: "AddConnectionID", key: "AddConnectionID", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo) }]
	)
}

export async function connRunners_AddConnectionID(cr: connRunners, id: number): globalThis.Promise<void> {
	for (const [__rangeKey, c] of cr?.entries() ?? []) {
		await c.AddConnectionID!(id)
	}
}

export function newConnRunnerCallbacks(runner: connRunner | null): connRunnerCallbacks {
	return $.markAsStructValue(new connRunnerCallbacks({AddConnectionID: $.functionValue(async (id: number): globalThis.Promise<void> => {
		await $.pointerValue<Exclude<connRunner, null>>(runner).Add(id)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo))}))
}

export function testVarRefConversion(): void {
	let value = $.varRef($.markAsStructValue(new transport({values: $.makeMap<number, number>()})))
	let source: transport | $.VarRef<transport> | null = value
	let destination: packetHandlerMap | $.VarRef<packetHandlerMap> | null = $.unsafePointerCast<packetHandlerMap | $.VarRef<packetHandlerMap> | null>(source, packetHandlerMap)
	packetHandlerMap.prototype.Add.call(destination, 9)
	value.value = $.markAsStructValue(new transport({values: $.makeMap<number, number>()}))
	packetHandlerMap.prototype.Add.call(destination, 10)
	$.println("varref destination:", $.mapGet<number, number, number>(value.value.values, 10, 0)[0])
}

export async function main(): globalThis.Promise<void> {
	let t: transport | $.VarRef<transport> | null = new transport({values: $.makeMap<number, number>()})
	let runner: packetHandlerMap | $.VarRef<packetHandlerMap> | null = $.unsafePointerCast<packetHandlerMap | $.VarRef<packetHandlerMap> | null>(t, packetHandlerMap)
	transport.prototype.SourceOnly.call(t, 3)
	let runnerAgainDest: packetHandlerMap | $.VarRef<packetHandlerMap> | null = $.unsafePointerCast<packetHandlerMap | $.VarRef<packetHandlerMap> | null>(t, packetHandlerMap)
	let runners: connRunners = new globalThis.Map<connRunner | null, connRunnerCallbacks>([[$.interfaceValue<connRunner | null>(runner, "*main.packetHandlerMap", { kind: $.TypeKind.Pointer, elemType: "main.packetHandlerMap" }), $.markAsStructValue($.cloneStructValue(newConnRunnerCallbacks($.interfaceValue<connRunner | null>(runner, "*main.packetHandlerMap", { kind: $.TypeKind.Pointer, elemType: "main.packetHandlerMap" }))))]])
	let sourceInterface: sourceRunner | null = $.interfaceValue<sourceRunner | null>(t, "*main.transport", { kind: $.TypeKind.Pointer, elemType: "main.transport" })
	let destinationInterface: connRunner | null = $.interfaceValue<connRunner | null>(runner, "*main.packetHandlerMap", { kind: $.TypeKind.Pointer, elemType: "main.packetHandlerMap" })
	await connRunners_AddConnectionID(runners, 7)
	let runnerAgain: transport | $.VarRef<transport> | null = $.unsafePointerCast<transport | $.VarRef<transport> | null>(runner, transport)
	$.println("source:", $.mapGet<number, number, number>($.pointerValue<transport>(t).values, 3, 0)[0])
	$.println("same destination view:", $.pointerEqual(runner, runnerAgainDest))
	$.println("destination:", $.mapGet<number, number, number>($.pointerValue<transport>(t).values, 7, 0)[0])
	$.println("same pointer:", $.pointerEqual(t, runnerAgain))
	$.println("boxed same pointer:", $.pointerEqual(t, runnerAgain))
	await $.pointerValue<Exclude<sourceRunner, null>>(sourceInterface).SourceOnly(4)
	await $.pointerValue<Exclude<connRunner, null>>(destinationInterface).Add(8)
	let pointerValues: globalThis.Map<transport | $.VarRef<transport> | null, number> | null = new globalThis.Map<transport | $.VarRef<transport> | null, number>([[t, 42]])
	$.println("map lookup:", $.mapGet<transport | $.VarRef<transport> | null, number, number>(pointerValues, runnerAgain, 0)[0])
	testVarRefConversion()
}

if ($.isMainScript(import.meta)) {
	await main()
}
