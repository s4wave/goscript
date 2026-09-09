// Generated file based on indirect_circular_deps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class A {
	public declare BB: $.Slice<B>

	public _fields: {
		BB: $.Slice<B>
	}

	constructor(init?: Partial<{BB?: $.Slice<B>}>) {
		this._fields = {
			BB: init?.BB ?? (null! as $.Slice<B>)
		}
	}

	public clone(): A {
		return $.markAsStructValue(new A(this))
	}

	static {
		$.bindStructFields(this.prototype, ["BB"])
	}

	static __typeInfo = $.registerStructType(
		"main.A",
		() => new A(),
		() => [],
		A,
		() => [{ name: "BB", key: "BB", type: /* @__PURE__ */ $.sliceType("main.B") }]
	)
}

export class B {
	public declare AA: $.Slice<A>

	public _fields: {
		AA: $.Slice<A>
	}

	constructor(init?: Partial<{AA?: $.Slice<A>}>) {
		this._fields = {
			AA: init?.AA ?? (null! as $.Slice<A>)
		}
	}

	public clone(): B {
		return $.markAsStructValue(new B(this))
	}

	static {
		$.bindStructFields(this.prototype, ["AA"])
	}

	static __typeInfo = $.registerStructType(
		"main.B",
		() => new B(),
		() => [],
		B,
		() => [{ name: "AA", key: "AA", type: /* @__PURE__ */ $.sliceType("main.A") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let a1 = $.markAsStructValue(new A())
	let b1 = $.markAsStructValue(new B())

	let a2 = $.markAsStructValue(new A({BB: $.arrayToSlice<B>([$.markAsStructValue($.cloneStructValue(b1))])}))
	let b2 = $.markAsStructValue(new B({AA: $.arrayToSlice<A>([$.markAsStructValue($.cloneStructValue(a1))])}))

	await $.println("a1:", a1.BB == null)
	await $.println("b1:", b1.AA == null)
	await $.println("a2 has", $.len(a2.BB), "B items")
	await $.println("b2 has", $.len(b2.AA), "A items")
}

if ($.isMainScript(import.meta)) {
	await main()
}
