// Generated file based on package_import_protobuf_equalvt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/strings/index.js"

export type state = number

export class msg {
	public get v(): number {
		return this._fields.v.value
	}
	public set v(value: number) {
		this._fields.v.value = value
	}

	public _fields: {
		v: $.VarRef<number>
	}

	constructor(init?: Partial<{v?: number}>) {
		this._fields = {
			v: $.varRef(init?.v ?? (0 as number))
		}
	}

	public clone(): msg {
		const cloned = new msg()
		cloned._fields = {
			v: $.varRef(this._fields.v.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneMessageVT(): protobuf_go_lite.CloneMessage | null {
		const m: msg | $.VarRef<msg> | null = this
		return $.interfaceValue<protobuf_go_lite.CloneMessage | null>(msg.prototype.CloneVT.call(m), "*main.msg", { kind: $.TypeKind.Pointer, elemType: "main.msg" })
	}

	public CloneVT(): msg | $.VarRef<msg> | null {
		const m: msg | $.VarRef<msg> | null = this
		if (m == null) {
			return null
		}
		return new msg({v: $.pointerValue<msg>(m).v})
	}

	public EqualVT(other: msg | $.VarRef<msg> | null): boolean {
		const m: msg | $.VarRef<msg> | null = this
		return (other != null) && ($.pointerValue<msg>(m).v == $.pointerValue<msg>(other).v)
	}

	public MarshalToSizedBufferVT(_p0: $.Slice<number>): [number, $.GoError] {
		const m: msg | $.VarRef<msg> | null = this
		return [0, null]
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const m: msg | $.VarRef<msg> | null = this
		return [null, null]
	}

	public Reset(): void {
		const m: msg | $.VarRef<msg> | null = this
	}

	public SizeVT(): number {
		const m: msg | $.VarRef<msg> | null = this
		return 0
	}

	public UnmarshalVT(_p0: $.Slice<number>): $.GoError {
		const m: msg | $.VarRef<msg> | null = this
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.msg",
		() => new msg(),
		[{ name: "CloneMessageVT", args: [], returns: [{ type: "protobuf_go_lite.CloneMessage" }] }, { name: "CloneVT", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "main.msg" } }] }, { name: "EqualVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalToSizedBufferVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }, { name: "MarshalVT", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "SizeVT", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "UnmarshalVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		msg,
		[{ name: "v", key: "v", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export function state_String(s: state): string {
	switch (s) {
		case 1:
		{
			return "running"
			break
		}
		default:
		{
			return "idle"
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	let original: msg | $.VarRef<msg> | null = new msg({v: 7})
	let cloned: msg | $.VarRef<msg> | null = (protobuf_go_lite.CloneVTValue({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Pointer, elemType: "main.msg" }, zero: () => null, methods: {CloneMessageVT: (receiver: any, ...args: any[]) => receiver.CloneMessageVT(...$.stripGenericTypeArgs(args)), CloneVT: (receiver: any, ...args: any[]) => receiver.CloneVT(...$.stripGenericTypeArgs(args)), EqualVT: (receiver: any, ...args: any[]) => receiver.EqualVT(...$.stripGenericTypeArgs(args)), MarshalToSizedBufferVT: (receiver: any, ...args: any[]) => receiver.MarshalToSizedBufferVT(...$.stripGenericTypeArgs(args)), MarshalVT: (receiver: any, ...args: any[]) => receiver.MarshalVT(...$.stripGenericTypeArgs(args)), Reset: (receiver: any, ...args: any[]) => receiver.Reset(...$.stripGenericTypeArgs(args)), SizeVT: (receiver: any, ...args: any[]) => receiver.SizeVT(...$.stripGenericTypeArgs(args)), UnmarshalVT: (receiver: any, ...args: any[]) => receiver.UnmarshalVT(...$.stripGenericTypeArgs(args))} }}, original) as msg | $.VarRef<msg> | null)
	$.println("clone:", !$.pointerEqual(cloned, original), msg.prototype.EqualVT.call(cloned, original))
	$.println("clone-slice:", !$.pointerEqual($.arrayIndex(protobuf_go_lite.CloneVTSlice($.arrayToSlice<msg | $.VarRef<msg> | null>([original]))!, 0), original))
	let enumSlice: $.Slice<state> = $.arrayToSlice<state>([$.int(1, 32), $.int(0, 32)])
	let clonedEnumSlice: $.Slice<state> = (protobuf_go_lite.CloneSlice(enumSlice) as $.Slice<state>)
	$.println("clone-enum-slice:", $.int($.arrayIndex(clonedEnumSlice!, 0), 32), $.int($.arrayIndex(clonedEnumSlice!, 1), 32))
	$.println("equal:", protobuf_go_lite.IsEqualVT({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Pointer, elemType: "main.msg" }, zero: () => null, methods: {CloneMessageVT: (receiver: any, ...args: any[]) => receiver.CloneMessageVT(...$.stripGenericTypeArgs(args)), CloneVT: (receiver: any, ...args: any[]) => receiver.CloneVT(...$.stripGenericTypeArgs(args)), EqualVT: (receiver: any, ...args: any[]) => receiver.EqualVT(...$.stripGenericTypeArgs(args)), MarshalToSizedBufferVT: (receiver: any, ...args: any[]) => receiver.MarshalToSizedBufferVT(...$.stripGenericTypeArgs(args)), MarshalVT: (receiver: any, ...args: any[]) => receiver.MarshalVT(...$.stripGenericTypeArgs(args)), Reset: (receiver: any, ...args: any[]) => receiver.Reset(...$.stripGenericTypeArgs(args)), SizeVT: (receiver: any, ...args: any[]) => receiver.SizeVT(...$.stripGenericTypeArgs(args)), UnmarshalVT: (receiver: any, ...args: any[]) => receiver.UnmarshalVT(...$.stripGenericTypeArgs(args))} }}, original, new msg({v: 7})))
	$.println("equal-slice-implicit:", protobuf_go_lite.EqualVTSliceImplicit($.arrayToSlice<msg | $.VarRef<msg> | null>([null, original]), $.arrayToSlice<msg | $.VarRef<msg> | null>([new msg(), new msg({v: 7})]), $.functionValue((): msg | $.VarRef<msg> | null => {
		return new msg()
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "main.msg" }] } as $.FunctionTypeInfo))))
	let sb: $.VarRef<protobuf_go_lite.TextBuilder> = $.varRef($.markAsStructValue(new strings.Builder()))
	protobuf_go_lite.TextWriteStringer(sb, $.namedValueInterfaceValue<any>(1, "main.state", {String: (receiver: any, ...args: any[]) => (state_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "int32", typeName: "main.state" }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
	$.println("stringer:", sb.value.String())
}

if ($.isMainScript(import.meta)) {
	await main()
}
