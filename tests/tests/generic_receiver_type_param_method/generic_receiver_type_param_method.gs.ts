// Generated file based on generic_receiver_type_param_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type nistPoint = {
	Add(__typeArgs: $.GenericTypeArgs | undefined, _p0: any, _p1: any): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.nistPoint",
	null,
	[{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class nistCurve {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): nistCurve {
		return $.copyGenericInstance(this, new nistCurve(true))
	}

	public __goscriptAssign(source: nistCurve): this {
		return this
	}

	public async Add(__typeArgs: $.GenericTypeArgs | undefined, p1: any, p2: any): globalThis.Promise<any> {
		const curve: nistCurve | $.VarRef<nistCurve> | null = this;
		return $.callGenericMethod(__typeArgs, "Point", "Add", p1, $.copyElement(p1), $.copyElement(p2))
	}

	public Zero(__typeArgs: $.GenericTypeArgs | undefined): any {
		const curve: nistCurve | $.VarRef<nistCurve> | null = this;
		let p: any = $.genericZero(__typeArgs, "Point", null)
		return $.copyElement(p)
	}

	static __typeInfo = $.registerStructType(
		"main.nistCurve",
		() => new nistCurve(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("Add", [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], [{ kind: $.TypeKind.Interface, methods: [] }])] } }], pointerReceiver: true }, { name: "Zero", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("Add", [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], [{ kind: $.TypeKind.Interface, methods: [] }])] } }], pointerReceiver: true }],
		nistCurve,
		() => []
	)
}

export class point {
	public declare N: number

	constructor(__goscriptValue?: boolean, N$?: number) {
		this.N = N$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): point {
		return new point(true, this.N)
	}

	public __goscriptAssign(source: point): this {
		this.N = source.N
		return this
	}

	public Add(a: point | $.VarRef<point> | null, b: point | $.VarRef<point> | null): point | $.VarRef<point> | null {
		const p: point | $.VarRef<point> | null = this;
		return new point(false, $.pointerValue<point>(a).N + $.pointerValue<point>(b).N)
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("main.point") }], pointerReceiver: true }],
		point,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let curve: nistCurve | $.VarRef<nistCurve> | null = $.genericInstance(new nistCurve(), __goscriptStatic1)

export function __goscript_set_curve(__goscriptValue: nistCurve | $.VarRef<nistCurve> | null): void {
	curve = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	let p = (await (curve !== null && (curve as any).__isVarRef !== true && (curve as any).__goValue === undefined ? ((curve as any) as nistCurve).Add(__goscriptStatic0(), new point(false, 2), new point(false, 3)) : nistCurve.prototype.Add.call(curve, __goscriptStatic0(), new point(false, 2), new point(false, 3))) as point | $.VarRef<point> | null)
	await $.println("sum:", $.pointerValue<point>(p).N)
	if ((curve !== null && (curve as any).__isVarRef !== true && (curve as any).__goValue === undefined ? ((curve as any) as nistCurve).Zero(__goscriptStatic0()) : nistCurve.prototype.Zero.call(curve, __goscriptStatic0())) == null) {
		await $.println("zero")
	}
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, Point: { type: /* @__PURE__ */ $.pointerType("main.point"), zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Add(...$.stripGenericTypeArgs(args))} }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Add: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Add(__goscriptStatic0(), ...$.stripGenericTypeArgs(args)), Zero: (receiver: any) => $.pointerValue(receiver).Zero(__goscriptStatic0())}, [$.methodSignature("Add", [/* @__PURE__ */ $.pointerType("main.point"), /* @__PURE__ */ $.pointerType("main.point")], [/* @__PURE__ */ $.pointerType("main.point")], true, false), $.methodSignature("Zero", [], [/* @__PURE__ */ $.pointerType("main.point")], true, false)]])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
