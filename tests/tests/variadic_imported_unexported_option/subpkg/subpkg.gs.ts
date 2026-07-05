// Generated file based on subpkg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type option = ((_p0: Thing | $.VarRef<Thing> | null) => void) | null

export class Thing {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public get Label(): string {
		return this._fields.Label.value
	}
	public set Label(value: string) {
		this._fields.Label.value = value
	}

	public _fields: {
		Value: $.VarRef<number>
		Label: $.VarRef<string>
	}

	constructor(init?: Partial<{Value?: number, Label?: string}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? (0 as number)),
			Label: $.varRef(init?.Label ?? ("" as string))
		}
	}

	public clone(): Thing {
		const cloned = new Thing()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value),
			Label: $.varRef(this._fields.Label.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"subpkg.Thing",
		() => new Thing(),
		[],
		Thing,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "Label", key: "Label", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export function WithValue(v: number): option | null {
	return $.functionValue((t: Thing | $.VarRef<Thing> | null): void => {
		$.pointerValue<Thing>(t).Value = v
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "subpkg.Thing" }], results: [] } as $.FunctionTypeInfo))
}

export function WithLabel(l: string): option | null {
	return $.functionValue((t: Thing | $.VarRef<Thing> | null): void => {
		$.pointerValue<Thing>(t).Label = l
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "subpkg.Thing" }], results: [] } as $.FunctionTypeInfo))
}

export async function New(opts: $.Slice<option | null>): globalThis.Promise<Thing | $.VarRef<Thing> | null> {
	let t: Thing | $.VarRef<Thing> | null = new Thing()
	for (let __goscriptRangeTarget0 = opts, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let opt = __goscriptRangeTarget0![__rangeIndex]
		await opt!(t)
	}
	return t
}
