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
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): nistCurve {
		return $.markAsStructValue(new nistCurve(this))
	}

	public async Add(__typeArgs: $.GenericTypeArgs | undefined, p1: any, p2: any): globalThis.Promise<any> {
		const curve: nistCurve | $.VarRef<nistCurve> | null = this;
		return (await $.callGenericMethod(__typeArgs, "Point", "Add", p1, p1, p2) as any)
	}

	public Zero(__typeArgs: $.GenericTypeArgs | undefined): any {
		const curve: nistCurve | $.VarRef<nistCurve> | null = this;
		let p: any = $.genericZero(__typeArgs, "Point", null)
		return p
	}

	static __typeInfo = $.registerStructType(
		"main.nistCurve",
		() => new nistCurve(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("Add", [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], [{ kind: $.TypeKind.Interface, methods: [] }])] } }] }, { name: "Zero", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("Add", [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], [{ kind: $.TypeKind.Interface, methods: [] }])] } }] }],
		nistCurve,
		() => []
	)
}

export class point {
	public declare N: number

	public _fields: {
		N: number
	}

	constructor(init?: Partial<{N?: number}>) {
		this._fields = {
			N: init?.N ?? (0 as number)
		}
	}

	public clone(): point {
		return $.markAsStructValue(new point(this))
	}

	public Add(a: point | $.VarRef<point> | null, b: point | $.VarRef<point> | null): point | $.VarRef<point> | null {
		const p: point | $.VarRef<point> | null = this;
		return new point({N: $.pointerValue<point>(a).N + $.pointerValue<point>(b).N})
	}

	static {
		$.bindStructFields(this.prototype, ["N"])
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("main.point") }] }],
		point,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let curve: nistCurve | $.VarRef<nistCurve> | null = new nistCurve()

export function __goscript_set_curve(__goscriptValue: nistCurve | $.VarRef<nistCurve> | null): void {
	curve = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	let p: point | $.VarRef<point> | null = (await nistCurve.prototype.Add.call(curve, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, Point: { type: /* @__PURE__ */ $.pointerType("main.point"), zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Add(...$.stripGenericTypeArgs(args))} }}, new point({N: 2}), new point({N: 3})) as point | $.VarRef<point> | null)
	await $.println("sum:", $.pointerValue<point>(p).N)
	if (nistCurve.prototype.Zero.call(curve, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, Point: { type: /* @__PURE__ */ $.pointerType("main.point"), zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Add(...$.stripGenericTypeArgs(args))} }}) == null) {
		await $.println("zero")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
