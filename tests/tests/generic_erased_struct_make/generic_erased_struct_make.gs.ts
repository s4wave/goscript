// Generated file based on generic_erased_struct_make.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class queue {
	public declare buf: $.Slice<any>

	public _fields: {
		buf: $.Slice<any>
	}

	constructor(init?: Partial<{buf?: $.Slice<any>}>) {
		this._fields = {
			buf: init?.buf ?? (null! as $.Slice<any>)
		}
	}

	public clone(): queue {
		return $.markAsStructValue(new queue(this))
	}

	static {
		$.bindStructFields(this.prototype, ["buf"])
	}

	static __typeInfo = $.registerStructType(
		"main.queue",
		() => new queue(),
		() => [],
		queue,
		() => [{ name: "buf", key: "buf", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export function newQueue(__typeArgs: $.GenericTypeArgs | undefined, capacity: number): queue | $.VarRef<queue> | null {
	return new queue({buf: $.makeSlice<any>(capacity, undefined, undefined, () => ($.genericZero(__typeArgs, "T", null) as any))})
}

export async function main(): globalThis.Promise<void> {
	let q: queue | $.VarRef<queue> | null = (newQueue({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, 2) as queue | $.VarRef<queue> | null)
	$.pointerValue<queue>(q).buf![0] = 7
	await $.println($.len($.pointerValue<queue>(q).buf), $.arrayIndex($.pointerValue<queue>(q).buf!, 0))
}

if ($.isMainScript(import.meta)) {
	await main()
}
