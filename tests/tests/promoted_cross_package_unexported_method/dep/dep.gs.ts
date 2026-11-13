// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

$.registerTypePackagePath("github.com/s4wave/goscript/tests/tests/promoted_cross_package_unexported_method/dep", ["dep.Block", "dep.Base"])

export type Block = {
	Name(): string
	block(): string | globalThis.Promise<string>
}

$.registerInterfaceType(
	"dep.Block",
	null,
	[{ name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "block", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class Base {
	public declare name: string

	constructor(__goscriptValue?: boolean, name$?: string) {
		this.name = name$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Base {
		return new Base(true, this.name)
	}

	public __goscriptAssign(source: Base): this {
		this.name = source.name
		return this
	}

	public Name(): string {
		const b: Base | $.VarRef<Base> | null = this;
		return $.pointerValue<Base>(b).name
	}

	public SetName(name: string): void {
		const b: Base | $.VarRef<Base> | null = this;
		$.pointerValue<Base>(b).name = name
	}

	public async block(): globalThis.Promise<string> {
		const b: Base | $.VarRef<Base> | null = this;
		let ch = $.makeChannel<string>(0, "", "both")
		$.go(async () => {
			await $.chanSend(ch, "block " + $.pointerValue<Base>(b).name)
		})
		return await $.chanRecv(ch)
	}

	static __typeInfo = $.registerStructType(
		"dep.Base",
		() => new Base(),
		() => [{ name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "SetName", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "block", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		Base,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function Describe(v: any): globalThis.Promise<string> {
	let [b, ok] = $.typeAssertTuple<Block | null>(v, "dep.Block")
	if (!ok) {
		return "not a block"
	}
	return (b !== null && (b as any).__isVarRef !== true && ((b as any).__goValue === undefined || (b as any).__goType?.charCodeAt(0) !== 42) ? (b as Exclude<Block, null>) : $.pointerValue<Exclude<Block, null>>(b)).block()
}

var __goscriptAwait: any
