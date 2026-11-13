// Generated file based on promoted_cross_package_unexported_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/promoted_cross_package_unexported_method/dep/index.js"

export class cell {
	public declare Base: dep.Base

	public declare align: number

	constructor(__goscriptValue?: boolean, Base$?: dep.Base, align$?: number) {
		this.Base = Base$ ?? new dep.Base(true)
		this.align = align$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): cell {
		return new cell(true, this.Base.clone(), this.align)
	}

	public __goscriptAssign(source: cell): this {
		this.Base.__goscriptAssign(source.Base)
		this.align = source.align
		return this
	}

	public Name(): any {
		return $.pointerValue<dep.Base>(this.Base).Name()
	}

	public SetName(name: any): any {
		return $.pointerValue<dep.Base>(this.Base).SetName(name)
	}

	public async block(): globalThis.Promise<any> {
		return await dep.Base.prototype.block.call($.fieldRef(this, "Base"))
	}

	static __typeInfo = $.registerStructType(
		"main.cell",
		() => new cell(),
		() => [{ name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "SetName", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "block", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		cell,
		() => [{ name: "Base", key: "Base", type: "dep.Base", anonymous: true }, { name: "align", key: "align", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class wrapped {
	public declare cell: cell | $.VarRef<cell> | null

	constructor(__goscriptValue?: boolean, cell$?: cell | $.VarRef<cell> | null) {
		this.cell = cell$ ?? (null! as cell | $.VarRef<cell> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): wrapped {
		return new wrapped(true, this.cell)
	}

	public __goscriptAssign(source: wrapped): this {
		this.cell = source.cell
		return this
	}

	public Name(): any {
		return $.pointerValue<cell>(this.cell).Base.Name()
	}

	public SetName(name: any): any {
		return $.pointerValue<cell>(this.cell).Base.SetName(name)
	}

	public async block(): globalThis.Promise<any> {
		return await dep.Base.prototype.block.call($.fieldRef($.pointerValue<any>(this.cell), "Base"))
	}

	static __typeInfo = $.registerStructType(
		"main.wrapped",
		() => new wrapped(),
		() => [{ name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "SetName", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "block", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		wrapped,
		() => [{ name: "cell", key: "cell", type: /* @__PURE__ */ $.pointerType("main.cell"), anonymous: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let c = new cell(false, undefined, 1)
	$.pointerValue<cell>(c).Base.SetName("cell")
	await $.println(await dep.Describe($.interfaceValue(c, "*main.cell", /* @__PURE__ */ $.pointerType("main.cell"))))

	let w = $.varRef(new wrapped(true, new cell()))
	$.pointerValue<cell>(w.value.cell).Base.SetName("wrapped")
	await $.println(await dep.Describe($.structInterfaceValue((w.value).clone(), "main.wrapped", "main.wrapped")))

	let b: dep.Block | null = $.interfaceValue<dep.Block | null>(c, "*main.cell", /* @__PURE__ */ $.pointerType("main.cell"))
	await $.println((__goscriptAwait = (b !== null && (b as any).__isVarRef !== true && ((b as any).__goValue === undefined || (b as any).__goType?.charCodeAt(0) !== 42) ? (b as Exclude<dep.Block, null>) : $.pointerValue<Exclude<dep.Block, null>>(b)).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	await $.println(await dep.Describe($.basicInterfaceValue($.pointerValue<cell>(c).align, "int")))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
