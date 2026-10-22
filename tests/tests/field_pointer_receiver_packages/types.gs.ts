// Generated file based on types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as __goscript_methods from "./methods.gs.ts"
import "./methods.gs.ts"

export class Base {
	public declare self: Base | $.VarRef<Base> | null

	public declare n: number

	constructor(__goscriptValue?: boolean, self$?: Base | $.VarRef<Base> | null, n$?: number) {
		this.self = self$ ?? (null! as Base | $.VarRef<Base> | null)
		this.n = n$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Base {
		return new Base(true, this.self, this.n)
	}

	public __goscriptAssign(source: Base): this {
		this.self = source.self
		this.n = source.n
		return this
	}

	public Is(p: Base | $.VarRef<Base> | null): boolean {
		const b: Base | $.VarRef<Base> | null = this;
		return (b === p || ($.pointerAliasesMade || (b as any)?.__goElementBacking !== undefined) && $.pointerEqual(b, p))
	}

	public Keep(): void {
		const b: Base | $.VarRef<Base> | null = this;
		const b$: Base = b == null ? $.pointerTarget<Base>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<Base>(b);
		;(b$ as Base).self = b;
		;(b$ as Base).n++
	}

	static __typeInfo = $.registerStructType(
		"main.Base",
		() => new Base(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Keep", args: [], returns: [], pointerReceiver: true }],
		Base,
		() => [{ name: "self", key: "self", type: /* @__PURE__ */ $.pointerType("main.Base") }, { name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}
