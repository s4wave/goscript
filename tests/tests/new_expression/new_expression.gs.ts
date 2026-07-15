// Generated file based on new_expression.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Number = number

export class Pair {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<number>
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? (0 as number))
		}
	}

	public clone(): Pair {
		const cloned = new Pair()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		[],
		Pair,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let untypedInt = $.varRef<number>(42)
	$.println("untyped int:", $.pointerValue<number>(untypedInt))

	let untypedBool = $.varRef<boolean>(true)
	$.println("untyped bool:", $.pointerValue<boolean>(untypedBool))

	let value = 7
	let typedValue = $.varRef<number>(value)
	$.println("typed value:", $.pointerValue<number>(typedValue))

	let namedValue = 9
	let namedPointer: $.VarRef<Number> | null = $.varRef<Number>(namedValue)
	$.println("named value:", $.pointerValue<Number>(namedPointer))

	let pairPointer: Pair | $.VarRef<Pair> | null = $.varRef<Pair>($.markAsStructValue(new Pair({Value: 11})))
	$.println("struct value:", $.pointerValue<Pair>(pairPointer).Value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
