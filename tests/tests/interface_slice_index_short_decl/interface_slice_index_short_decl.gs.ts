// Generated file based on interface_slice_index_short_decl.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/interface_slice_index_short_decl/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/interface_slice_index_short_decl/dep/index.js"

export type value = Uint8Array

export type Fixed = $.Slice<dep.Ref | null>

export type Shape = {
	Mark(): boolean
}

$.registerInterfaceType(
	"main.Shape",
	null,
	[{ name: "Mark", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }]
);

export class Action {
	public declare Result: number

	public declare Filter: globalThis.Map<number, dep.Ref | null> | null

	public _fields: {
		Result: number
		Filter: globalThis.Map<number, dep.Ref | null> | null
	}

	constructor(init?: Partial<{Result?: number, Filter?: globalThis.Map<number, dep.Ref | null> | null}>) {
		this._fields = {
			Result: init?.Result ?? (0 as number),
			Filter: init?.Filter ?? (null! as globalThis.Map<number, dep.Ref | null> | null)
		}
	}

	public clone(): Action {
		return $.markAsStructValue(new Action(this))
	}

	public Mark(): boolean {
		const a = this
		return a.Filter != null
	}

	public SetFilter(k: number, v: dep.Ref | null): void {
		let a: Action | $.VarRef<Action> | null = this
		if ($.pointerValue<Action>(a).Filter == null) {
			$.pointerValue<Action>(a).Filter = $.makeMap<number, dep.Ref | null>()
		}
		$.mapSet($.pointerValue<Action>(a).Filter, k, v)
	}

	static {
		$.bindStructFields(this.prototype, ["Result", "Filter"])
	}

	static __typeInfo = $.registerStructType(
		"main.Action",
		() => new Action(),
		() => [{ name: "Mark", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "SetFilter", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		Action,
		() => [{ name: "Result", key: "Result", type: /* @__PURE__ */ $.basicType("int") }, { name: "Filter", key: "Filter", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("int"), "dep.Ref") }]
	)
}

export function value_Key(v: value): any {
	return $.namedValueInterfaceValue<any>(v, "main.value", {Key: (receiver: any, ...args: any[]) => (value_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, "main.value", [$.methodSignature("Key", [], [{ kind: $.TypeKind.Interface, methods: [] }])])
}

export function Fixed_Mark(f: Fixed): boolean {
	return $.len((f as Fixed)) != 0
}

export async function main(): globalThis.Promise<void> {
	let shapes: $.Slice<Shape | null> = $.arrayToSlice<Shape | null>([$.namedValueInterfaceValue<Shape | null>($.arrayToSlice<dep.Ref | null>([$.namedValueInterfaceValue<dep.Ref | null>(new Uint8Array([1, 2]), "main.value", {Key: (receiver: any, ...args: any[]) => (value_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, "main.value", [$.methodSignature("Key", [], [{ kind: $.TypeKind.Interface, methods: [] }])])]), "main.Fixed", {Mark: (receiver: any, ...args: any[]) => (Fixed_Mark as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.sliceType("dep.Ref", "main.Fixed"), [$.methodSignature("Mark", [], [/* @__PURE__ */ $.basicType("bool")])]), $.interfaceValue<Shape | null>($.markAsStructValue(new Action({Result: 1, Filter: $.makeMap<number, dep.Ref | null>([[1, $.namedValueInterfaceValue<dep.Ref | null>(new Uint8Array([1, 2]), "main.value", {Key: (receiver: any, ...args: any[]) => (value_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, "main.value", [$.methodSignature("Key", [], [{ kind: $.TypeKind.Interface, methods: [] }])])]])})), "main.Action", "main.Action")])
	let fixed: $.Slice<Fixed> = null! as $.Slice<Fixed>
	for (let __goscriptRangeTarget0 = shapes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let shape = __goscriptRangeTarget0![__rangeIndex]
		{
			const __goscriptTypeSwitchValue = shape
			switch (true) {
				case $.typeAssert<Fixed>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.sliceType("dep.Ref", "main.Fixed")).ok:
					{
						let shape: Fixed = $.typeAssert<Fixed>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.sliceType("dep.Ref", "main.Fixed")).value
						shape = ($.append((shape as Fixed), $.namedValueInterfaceValue<dep.Ref | null>(new Uint8Array([3, 4]), "main.value", {Key: (receiver: any, ...args: any[]) => (value_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, "main.value", [$.methodSignature("Key", [], [{ kind: $.TypeKind.Interface, methods: [] }])]), $.appendZeros.nil) as Fixed)
						fixed = $.append(fixed, (shape as Fixed), $.appendZeros.nil)
					}
					break
				case $.typeAssert<Action>(__goscriptTypeSwitchValue, "main.Action").ok:
					{
						let shape: $.VarRef<Action> = $.varRef($.typeAssert<Action>(__goscriptTypeSwitchValue, "main.Action").value)
						let fix: Fixed = ($.arrayIndex(fixed!, 0) as Fixed)
						let fv = $.arrayIndex(fix!, 0)
						{
							let v = $.mapGet<number, dep.Ref | null, dep.Ref | null>(shape.value.Filter, shape.value.Result, null)[0]
							if (v != null) {
								await dep.ToKey(v)
								await dep.ToKey(fv)
							}
						}
						shape.value.SetFilter(2, fv)
					}
					break
			}
		}
	}
	let fix: Fixed = ($.arrayIndex(fixed!, 0) as Fixed)
	let fv = $.arrayIndex(fix!, 0)
	if (await dep.ToKey(fv) != null) {
		await $.println("ok")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
