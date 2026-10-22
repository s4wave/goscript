// Generated file based on widget.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as __goscript_methods from "./methods.gs.ts"
import * as __goscript_types from "./types.gs.ts"
import "./methods.gs.ts"

export class Widget {
	public declare Base: __goscript_types.Base

	public declare name: string

	constructor(__goscriptValue?: boolean, Base$?: __goscript_types.Base, name$?: string) {
		this.Base = Base$ ?? new __goscript_types.Base(true)
		this.name = name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Widget {
		return new Widget(true, this.Base.clone(), this.name)
	}

	public __goscriptAssign(source: Widget): this {
		this.Base.__goscriptAssign(source.Base)
		this.name = source.name
		return this
	}

	public Is(p: any): any {
		return __goscript_types.Base.prototype.Is.call($.fieldRef(this, "Base"), p)
	}

	public Keep(): any {
		return __goscript_types.Base.prototype.Keep.call($.fieldRef(this, "Base"))
	}

	static __typeInfo = $.registerStructType(
		"main.Widget",
		() => new Widget(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Keep", args: [], returns: [], pointerReceiver: true }],
		Widget,
		() => [{ name: "Base", key: "Base", type: "main.Base", anonymous: true }, { name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}
