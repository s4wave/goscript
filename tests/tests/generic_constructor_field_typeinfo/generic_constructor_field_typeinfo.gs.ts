// Generated file based on generic_constructor_field_typeinfo.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Block = {
	MarshalBlock(): [$.Slice<number>, $.GoError]
	UnmarshalBlock(_p0: $.Slice<number>): $.GoError
}

$.registerInterfaceType(
	"main.Block",
	null,
	[{ name: "MarshalBlock", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "UnmarshalBlock", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }]
);

export class blockType {
	public declare typeID: string

	public declare _constructor: (() => any | globalThis.Promise<any>) | null

	constructor(__goscriptValue?: boolean, typeID$?: string, _constructor$?: (() => any | globalThis.Promise<any>) | null) {
		this.typeID = typeID$ ?? ""
		this._constructor = _constructor$ ?? (null! as (() => any | globalThis.Promise<any>) | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): blockType {
		return $.copyGenericInstance(this, new blockType(true, this.typeID, this._constructor))
	}

	public __goscriptAssign(source: blockType): this {
		this.typeID = source.typeID
		this._constructor = source._constructor
		return this
	}

	public Constructor(__typeArgs: $.GenericTypeArgs | undefined): Block | null {
		const t: blockType | $.VarRef<blockType> | null = this;
		return $.typeParamInterfaceValue<Block | null>(($.pointerValue<blockType>(t)._constructor!() as any), __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("MarshalBlock", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("UnmarshalBlock", [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["error"])] }, zero: () => null })
	}

	public GetBlockTypeID(__typeArgs: $.GenericTypeArgs | undefined): string {
		const t: blockType | $.VarRef<blockType> | null = this;
		return $.pointerValue<blockType>(t).typeID
	}

	static __typeInfo = $.registerStructType(
		"main.blockType",
		() => new blockType(),
		() => [{ name: "Constructor", args: [], returns: [{ type: "main.Block" }], pointerReceiver: true }, { name: "GetBlockTypeID", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		blockType,
		() => [{ name: "typeID", key: "typeID", type: /* @__PURE__ */ $.basicType("string") }, { name: "constructor", key: "_constructor", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [$.methodSignature("MarshalBlock", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("UnmarshalBlock", [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["error"])] }] } as $.FunctionTypeInfo) }]
	)
}

export class sampleBlock {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): sampleBlock {
		return new sampleBlock(true)
	}

	public __goscriptAssign(source: sampleBlock): this {
		return this
	}

	public MarshalBlock(): [$.Slice<number>, $.GoError] {
		return [new Uint8Array([1, 2, 3]) as $.Slice<number>, null]
	}

	public UnmarshalBlock(_p0: $.Slice<number>): $.GoError {
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.sampleBlock",
		() => new sampleBlock(),
		() => [{ name: "MarshalBlock", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }], pointerReceiver: true }, { name: "UnmarshalBlock", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }], pointerReceiver: true }],
		sampleBlock,
		() => []
	)
}

export function NewBlockType(__typeArgs: $.GenericTypeArgs | undefined, typeID: string, _constructor: (() => any | globalThis.Promise<any>) | null): blockType | $.VarRef<blockType> | null {
	return $.genericInstance(new blockType(false, typeID, _constructor), () => [{Constructor: (receiver: any) => $.pointerValue(receiver).Constructor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("MarshalBlock", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("UnmarshalBlock", [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["error"])] }, zero: () => null }}), GetBlockTypeID: (receiver: any) => $.pointerValue(receiver).GetBlockTypeID({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("MarshalBlock", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("UnmarshalBlock", [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["error"])] }, zero: () => null }})}, [$.methodSignature("Constructor", [], ["main.Block"], true, false), $.methodSignature("GetBlockTypeID", [], [/* @__PURE__ */ $.basicType("string")], true, false)]])
}

export async function main(): globalThis.Promise<void> {
	let bt = (NewBlockType(__goscriptStatic0(), "sample", $.functionValue((): sampleBlock | $.VarRef<sampleBlock> | null => {
		return new sampleBlock()
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.pointerType("main.sampleBlock")] } as $.FunctionTypeInfo))) as blockType | $.VarRef<blockType> | null)
	let blk = (bt !== null && (bt as any).__isVarRef !== true && (bt as any).__goValue === undefined ? ((bt as any) as blockType).Constructor(__goscriptStatic0()) : blockType.prototype.Constructor.call(bt, __goscriptStatic0()))
	let __goscriptTuple0: any = await (blk !== null && (blk as any).__isVarRef !== true && ((blk as any).__goValue === undefined || (blk as any).__goType?.charCodeAt(0) !== 42) ? (blk as Exclude<Block, null>) : $.pointerValue<Exclude<Block, null>>(blk)).MarshalBlock()
	let data: $.Slice<number> = __goscriptTuple0[0]
	await $.println((bt !== null && (bt as any).__isVarRef !== true && (bt as any).__goValue === undefined ? ((bt as any) as blockType).GetBlockTypeID(__goscriptStatic0()) : blockType.prototype.GetBlockTypeID.call(bt, __goscriptStatic0())), $.sliceLen(data))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.sampleBlock"), zero: () => null, methods: {MarshalBlock: (receiver: any) => $.pointerValue(receiver).MarshalBlock(), UnmarshalBlock: (receiver: any, ...args: any[]) => $.pointerValue(receiver).UnmarshalBlock(...$.stripGenericTypeArgs(args))} }})
}

if ($.isMainScript(import.meta)) {
	await main()
}
