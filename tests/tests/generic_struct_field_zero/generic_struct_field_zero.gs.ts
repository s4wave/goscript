// Generated file based on generic_struct_field_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class box {
	public get Value(): any {
		return this._fields.Value.value
	}
	public set Value(value: any) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<any>
	}

	constructor(init?: Partial<{Value?: any}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? (null! as any))
		}
	}

	public clone(): box {
		const cloned = new box()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		() => new box(),
		[],
		box,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class point {
	public get X(): number {
		return this._fields.X.value
	}
	public set X(value: number) {
		this._fields.X.value = value
	}

	public _fields: {
		X: $.VarRef<number>
	}

	constructor(init?: Partial<{X?: number}>) {
		this._fields = {
			X: $.varRef(init?.X ?? (0 as number))
		}
	}

	public clone(): point {
		const cloned = new point()
		cloned._fields = {
			X: $.varRef(this._fields.X.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		[],
		point,
		[{ name: "X", key: "X", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let intBox: box = $.markAsStructValue(new box({Value: 0}))
	$.println("int", intBox.Value)

	let stringBox: box = $.markAsStructValue(new box({Value: ""}))
	$.println("string", $.stringEqual(stringBox.Value, ""))

	let mapBox: box = $.markAsStructValue(new box({Value: null! as globalThis.Map<string, number> | null}))
	$.println("map", mapBox.Value == null)

	let pointBox: box = $.markAsStructValue(new box({Value: $.markAsStructValue(new point())}))
	$.println("struct", pointBox.Value.X)

	let explicit = $.markAsStructValue(new box({Value: 0}))
	$.println("literal", explicit.Value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
