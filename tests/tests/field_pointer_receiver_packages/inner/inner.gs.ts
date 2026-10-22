// Generated file based on inner.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

$.registerTypePackagePath("github.com/s4wave/goscript/tests/tests/field_pointer_receiver_packages/inner", ["inner.Base", "inner.base", "inner.Mid"])

export class Base {
	public declare Self: Base | $.VarRef<Base> | null

	public declare N: number

	constructor(__goscriptValue?: boolean, Self$?: Base | $.VarRef<Base> | null, N$?: number) {
		this.Self = Self$ ?? (null! as Base | $.VarRef<Base> | null)
		this.N = N$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Base {
		return new Base(true, this.Self, this.N)
	}

	public __goscriptAssign(source: Base): this {
		this.Self = source.Self
		this.N = source.N
		return this
	}

	public Keep(): void {
		const b: Base | $.VarRef<Base> | null = this;
		const b$: Base = b == null ? $.pointerTarget<Base>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<Base>(b);
		;(b$ as Base).Self = b;
		;(b$ as Base).N++
	}

	static __typeInfo = $.registerStructType(
		"inner.Base",
		() => new Base(),
		() => [{ name: "Keep", args: [], returns: [], pointerReceiver: true }],
		Base,
		() => [{ name: "Self", key: "Self", type: /* @__PURE__ */ $.pointerType("inner.Base") }, { name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class base {
	public declare self: base | $.VarRef<base> | null

	constructor(__goscriptValue?: boolean, self$?: base | $.VarRef<base> | null) {
		this.self = self$ ?? (null! as base | $.VarRef<base> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): base {
		return new base(true, this.self)
	}

	public __goscriptAssign(source: base): this {
		this.self = source.self
		return this
	}

	public KeepHidden(): boolean {
		const b: base | $.VarRef<base> | null = this;
		const b$: base = b == null ? $.pointerTarget<base>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<base>(b);
		;(b$ as base).self = b
		return ((b$ as base).self === b || ($.pointerAliasesMade || ((b$ as base).self as any)?.__goElementBacking !== undefined) && $.pointerEqual((b$ as base).self, b))
	}

	static __typeInfo = $.registerStructType(
		"inner.base",
		() => new base(),
		() => [{ name: "KeepHidden", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
		base,
		() => [{ name: "self", key: "self", type: /* @__PURE__ */ $.pointerType("inner.base") }]
	)
}

export class Mid {
	public declare Base: Base

	public declare base: base

	constructor(__goscriptValue?: boolean, Base$?: Base, base$?: base) {
		this.Base = Base$ ?? new Base(true)
		this.base = base$ ?? new base(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Mid {
		return new Mid(true, this.Base.clone(), this.base.clone())
	}

	public __goscriptAssign(source: Mid): this {
		this.Base.__goscriptAssign(source.Base)
		this.base.__goscriptAssign(source.base)
		return this
	}

	public HiddenKept(): boolean {
		const m: Mid | $.VarRef<Mid> | null = this;
		const m$: Mid = m == null ? $.pointerTarget<Mid>(m) : (m as any).__isVarRef === true ? (m as any).value : (m as any).__goValue === undefined ? (m as any) : $.pointerTarget<Mid>(m)
		return $.pointerEqual((m$ as Mid).base.self, $.fieldRef((m$ as Mid), "base"))
	}

	public Keep(): any {
		return Base.prototype.Keep.call($.fieldRef(this, "Base"))
	}

	public KeepHidden(): any {
		return base.prototype.KeepHidden.call($.fieldRef(this, "base"))
	}

	static __typeInfo = $.registerStructType(
		"inner.Mid",
		() => new Mid(),
		() => [{ name: "HiddenKept", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Keep", args: [], returns: [], pointerReceiver: true }, { name: "KeepHidden", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
		Mid,
		() => [{ name: "Base", key: "Base", type: "inner.Base", anonymous: true }, { name: "base", key: "base", type: "inner.base", anonymous: true }]
	)
}
