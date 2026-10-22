// Generated file based on field_pointer_receiver_packages.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as inner from "@goscript/github.com/s4wave/goscript/tests/tests/field_pointer_receiver_packages/inner/index.js"
import * as __goscript_methods from "./methods.gs.ts"
import * as __goscript_types from "./types.gs.ts"
import * as __goscript_widget from "./widget.gs.ts"
import "./methods.gs.ts"
import "./types.gs.ts"

export class Outer {
	public declare Mid: inner.Mid

	public declare Local: __goscript_widget.Widget

	constructor(__goscriptValue?: boolean, Mid$?: inner.Mid, Local$?: __goscript_widget.Widget) {
		this.Mid = Mid$ ?? new inner.Mid(true)
		this.Local = Local$ ?? new __goscript_widget.Widget(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.Mid.clone(), this.Local.clone())
	}

	public __goscriptAssign(source: Outer): this {
		this.Mid.__goscriptAssign(source.Mid)
		this.Local.__goscriptAssign(source.Local)
		return this
	}

	public HiddenKept(): any {
		return $.pointerValue<inner.Mid>(this.Mid).HiddenKept()
	}

	public Keep(): any {
		return inner.Base.prototype.Keep.call($.fieldRef(this.Mid, "Base"))
	}

	public KeepHidden(): any {
		const __receiver = $.fieldRef(this.Mid, "base")
		return __receiver.value.KeepHidden.call(__receiver)
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [{ name: "HiddenKept", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Keep", args: [], returns: [], pointerReceiver: true }, { name: "KeepHidden", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
		Outer,
		() => [{ name: "Mid", key: "Mid", type: "inner.Mid", anonymous: true }, { name: "Local", key: "Local", type: "main.Widget" }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Methods of a type whose methods are declared in another file.
	let w: $.VarRef<__goscript_widget.Widget> = $.varRef(new __goscript_widget.Widget(true))
	__goscript_types.Base.prototype.Keep.call($.fieldRef(w.value, "Base"))
	__goscript_types.Base.prototype.Keep.call($.fieldRef(w.value, "Base"))
	await $.println("other file:", $.pointerEqual(w.value.Base.self, $.fieldRef(w.value, "Base")), __goscript_types.Base.prototype.Is.call($.fieldRef(w.value, "Base"), $.fieldRef(w.value, "Base")), w.value.Base.n)

	// Methods promoted from structs of another package, exported and not.
	let o: $.VarRef<Outer> = $.varRef(new Outer(true))
	inner.Base.prototype.Keep.call($.fieldRef(o.value.Mid, "Base"))
	inner.Base.prototype.Keep.call($.fieldRef(o.value.Mid, "Base"))
	await $.println("other package:", $.pointerEqual(o.value.Mid.Base.Self, $.fieldRef(o.value.Mid, "Base")), o.value.Mid.Base.N)
	await $.println("unexported:", $.callPointerMethod($.fieldRef(o.value.Mid, "base"), "KeepHidden"), o.value.Mid.HiddenKept())

	// A field that embeds a struct of this package.
	__goscript_types.Base.prototype.Keep.call($.fieldRef(o.value.Local, "Base"))
	let keep: (() => void) | null = $.functionValue(((__receiver) => () => __goscript_types.Base.prototype.Keep.call(__receiver))($.fieldRef(o.value.Local, "Base")), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "main.(*Base).Keep-fm")
	keep!()
	await $.println("field:", $.pointerEqual(o.value.Local.Base.self, $.fieldRef(o.value.Local, "Base")), __goscript_types.Base.prototype.Is.call($.fieldRef(o.value.Local, "Base"), $.fieldRef(o.value.Local, "Base")), o.value.Local.Base.n)
}

if ($.isMainScript(import.meta)) {
	await main()
}
