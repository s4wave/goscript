// Generated file based on package_import_protobuf_equalvt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import * as strings from "@goscript/strings/index.js"

export type state = number

$.registerNamedValueType(
	"main.state",
	{String: (receiver: any) => (state_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.state",
	{String: (receiver: any) => (state_String as any)($.pointerValue(receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export class msg {
	public declare v: number

	constructor(__goscriptValue?: boolean, v$?: number) {
		this.v = v$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): msg {
		return new msg(true, this.v)
	}

	public __goscriptAssign(source: msg): this {
		this.v = source.v
		return this
	}

	public CloneMessageVT(): protobuf_go_lite.CloneMessage | null {
		const m: msg | $.VarRef<msg> | null = this;
		return $.interfaceValue<protobuf_go_lite.CloneMessage | null>((m !== null && (m as any).__isVarRef !== true && (m as any).__goValue === undefined ? ((m as any) as msg).CloneVT() : msg.prototype.CloneVT.call(m)), "*main.msg", /* @__PURE__ */ $.pointerType("main.msg"))
	}

	public CloneVT(): msg | $.VarRef<msg> | null {
		const m: msg | $.VarRef<msg> | null = this;
		if (m == null) {
			return null
		}
		return new msg(false, $.pointerValue<msg>(m).v)
	}

	public EqualVT(other: msg | $.VarRef<msg> | null): boolean {
		const m: msg | $.VarRef<msg> | null = this;
		return (other != null) && ($.pointerValue<msg>(m).v == $.pointerValue<msg>(other).v)
	}

	public MarshalToSizedBufferVT(_p0: $.Slice<number>): [number, $.GoError] {
		const m: msg | $.VarRef<msg> | null = this;
		return [0, null]
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const m: msg | $.VarRef<msg> | null = this;
		return [null, null]
	}

	public Reset(): void {
		const m: msg | $.VarRef<msg> | null = this;
	}

	public SizeVT(): number {
		const m: msg | $.VarRef<msg> | null = this;
		return 0
	}

	public UnmarshalVT(_p0: $.Slice<number>): $.GoError {
		const m: msg | $.VarRef<msg> | null = this;
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.msg",
		() => new msg(),
		() => [{ name: "CloneMessageVT", args: [], returns: [{ type: "protobuf_go_lite.CloneMessage" }], pointerReceiver: true }, { name: "CloneVT", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("main.msg") }], pointerReceiver: true }, { name: "EqualVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "MarshalToSizedBufferVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }, { name: "MarshalVT", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }], pointerReceiver: true }, { name: "Reset", args: [], returns: [], pointerReceiver: true }, { name: "SizeVT", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "UnmarshalVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }], pointerReceiver: true }],
		msg,
		() => [{ name: "v", key: "v", type: /* @__PURE__ */ $.basicType("int") }]
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
	let original = new msg(false, 7)
	let cloned = (protobuf_go_lite.CloneVTValue(__goscriptStatic0(), original) as msg | $.VarRef<msg> | null)
	await $.println("clone:", (cloned !== original && !(($.pointerAliasesMade || (cloned as any)?.__goElementBacking !== undefined) && $.pointerEqual(cloned, original))), (cloned !== null && (cloned as any).__isVarRef !== true && (cloned as any).__goValue === undefined ? ((cloned as any) as msg).EqualVT(original) : msg.prototype.EqualVT.call(cloned, original)))
	await $.println("clone-slice:", !$.pointerEqual($.plainSliceIndex(protobuf_go_lite.CloneVTSlice($.arrayToSlice<msg | $.VarRef<msg> | null>([original]))!, 0), original))
	let enumSlice = ($.typedSliceOf(Int32Array, [1, 0]) as $.Slice<state>)
	let clonedEnumSlice = (protobuf_go_lite.CloneSlice(enumSlice) as $.Slice<state>)
	await $.println("clone-enum-slice:", $.typedSliceIndex(clonedEnumSlice!, 0), $.typedSliceIndex(clonedEnumSlice!, 1))
	await $.println("equal:", protobuf_go_lite.IsEqualVT(__goscriptStatic0(), original, new msg(false, 7)))
	await $.println("equal-slice-implicit:", protobuf_go_lite.EqualVTSliceImplicit($.arrayToSlice<msg | $.VarRef<msg> | null>([null, original]), $.arrayToSlice<msg | $.VarRef<msg> | null>([new msg(), new msg(false, 7)]), $.functionValue((): msg | $.VarRef<msg> | null => {
		return new msg()
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.pointerType("main.msg")] } as $.FunctionTypeInfo))))
	let sb: $.VarRef<protobuf_go_lite.TextBuilder> = $.varRef($.markAsStructValue(new strings.Builder()))
	protobuf_go_lite.TextWriteStringer(sb, __goscriptStatic4()!)
	await $.println("stringer:", sb.value.String())
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.msg"), zero: () => null, methods: {CloneMessageVT: (receiver: any) => $.pointerValue(receiver).CloneMessageVT(), CloneVT: (receiver: any) => $.pointerValue(receiver).CloneVT(), EqualVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).EqualVT(...$.stripGenericTypeArgs(args)), MarshalToSizedBufferVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).MarshalToSizedBufferVT(...$.stripGenericTypeArgs(args)), MarshalVT: (receiver: any) => $.pointerValue(receiver).MarshalVT(), Reset: (receiver: any) => $.pointerValue(receiver).Reset(), SizeVT: (receiver: any) => $.pointerValue(receiver).SizeVT(), UnmarshalVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).UnmarshalVT(...$.stripGenericTypeArgs(args))} }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({String: (receiver: any) => (state_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.basicType("int32", "main.state"))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ($.namedValueInterfaceValue<any>(1, "main.state", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()))
}

if ($.isMainScript(import.meta)) {
	await main()
}
