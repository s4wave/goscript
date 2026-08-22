// Generated file based on pointers.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public get Val(): number {
		return this._fields.Val.value
	}
	public set Val(value: number) {
		this._fields.Val.value = value
	}

	public _fields: {
		Val: $.VarRef<number>
	}

	constructor(init?: Partial<{Val?: number}>) {
		this._fields = {
			Val: $.varRef(init?.Val ?? (0 as number))
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Val: $.varRef(this._fields.Val.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "Val", key: "Val", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s1 = $.varRef($.markAsStructValue(new MyStruct({Val: 1})))
	let s2 = $.varRef($.markAsStructValue(new MyStruct({Val: 2})))

	let p1: $.VarRef<MyStruct | $.VarRef<MyStruct> | null> = $.varRef(s1)
	let p2: $.VarRef<MyStruct | $.VarRef<MyStruct> | null> = $.varRef(s1)
	let p3: $.VarRef<MyStruct | $.VarRef<MyStruct> | null> = $.varRef(s2)

	let p4: MyStruct | $.VarRef<MyStruct> | null = s1
	p4

	let pp1 = $.varRef(p1)
	let pp2 = p2
	let pp3 = p3

	let ppp1 = pp1

	await $.println("--- Initial Values ---")
	await $.println("s1.Val:", s1.value.Val)
	await $.println("s2.Val:", s2.value.Val)
	await $.println("p1==p2:", $.pointerEqual(p1.value, p2.value))
	await $.println("p1==p3:", $.pointerEqual(p1.value, p3.value))

	// --- Pointer Comparisons ---
	await $.println("\n--- Pointer Comparisons ---")
	await $.println("pp1==pp2:", $.pointerEqual(pp1.value, pp2))
	await $.println("pp1==pp3:", $.pointerEqual(pp1.value, pp3))
	await $.println("*pp1==*pp2:", $.pointerEqual($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp1.value), $.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp2)))
	await $.println("*pp1==*pp3:", $.pointerEqual($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp1.value), $.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp3)))
	await $.println("(**pp1).Val == (**pp2).Val:", ($.pointerValue<MyStruct>($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp1.value))).Val == ($.pointerValue<MyStruct>($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp2))).Val)
	await $.println("(**pp1).Val == (**pp3).Val:", ($.pointerValue<MyStruct>($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp1.value))).Val == ($.pointerValue<MyStruct>($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp3))).Val)

	// Triple pointer comparisons
	await $.println("ppp1==ppp1:", $.pointerEqual(ppp1, ppp1))
	await $.println("*ppp1==pp1:", $.pointerEqual($.pointerValue<$.VarRef<MyStruct | $.VarRef<MyStruct> | null> | null>(ppp1), pp1.value))
	await $.println("**ppp1==p1:", $.pointerEqual($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>($.pointerValue<$.VarRef<MyStruct | $.VarRef<MyStruct> | null> | null>(ppp1)), p1.value))
	await $.println("(***ppp1).Val == s1.Val:", ($.pointerValue<MyStruct>($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>($.pointerValue<$.VarRef<MyStruct | $.VarRef<MyStruct> | null> | null>(ppp1)))).Val == s1.value.Val)

	// --- Modifications through Pointers ---
	await $.println("\n--- Modifications ---")
	$.assignStruct($.pointerValue<MyStruct>(p1.value), $.markAsStructValue(new MyStruct({Val: 10})))
	await $.println("After *p1 = {Val: 10}:")
	await $.println("  s1.Val:", s1.value.Val)
	await $.println("  (*p2).Val:", ($.pointerValue<MyStruct>(p2.value)).Val)
	await $.println("  (**pp1).Val:", ($.pointerValue<MyStruct>($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp1.value))).Val)
	await $.println("  (***ppp1).Val:", ($.pointerValue<MyStruct>($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>($.pointerValue<$.VarRef<MyStruct | $.VarRef<MyStruct> | null> | null>(ppp1)))).Val)
	await $.println("  s2.Val:", s2.value.Val)

	$.assignStruct($.pointerValue<MyStruct>($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(pp3)), $.markAsStructValue(new MyStruct({Val: 20})))
	await $.println("After **pp3 = {Val: 20}:")
	await $.println("  s2.Val:", s2.value.Val)
	await $.println("  (*p3).Val:", ($.pointerValue<MyStruct>(p3.value)).Val)
	await $.println("  s1.Val:", s1.value.Val)

	// --- Nil Pointers ---
	await $.println("\n--- Nil Pointers ---")
	let np: $.VarRef<MyStruct | $.VarRef<MyStruct> | null> = $.varRef(null)
	let npp: $.VarRef<MyStruct | $.VarRef<MyStruct> | null> | null = null
	let nppp: $.VarRef<$.VarRef<MyStruct | $.VarRef<MyStruct> | null> | null> | null = null

	await $.println("np == nil:", np.value == null)
	await $.println("npp == nil:", npp == null)
	await $.println("nppp == nil:", nppp == null)

	npp = np
	await $.println("After npp = &np:")
	await $.println("  npp == nil:", npp == null)
	await $.println("  *npp == nil:", $.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(npp) == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
