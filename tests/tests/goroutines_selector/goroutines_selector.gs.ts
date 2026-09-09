// Generated file based on goroutines_selector.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Foo {
	public declare done: $.Channel<boolean> | null

	public _fields: {
		done: $.Channel<boolean> | null
	}

	constructor(init?: Partial<{done?: $.Channel<boolean> | null}>) {
		this._fields = {
			done: init?.done ?? (null! as $.Channel<boolean> | null)
		}
	}

	public clone(): Foo {
		return $.markAsStructValue(new Foo(this))
	}

	public async Bar(): globalThis.Promise<void> {
		const f: Foo | $.VarRef<Foo> | null = this
		await $.println("Foo.Bar called")
		await $.chanSend($.pointerValue<Foo>(f).done, true)
	}

	static {
		$.bindStructFields(this.prototype, ["done"])
	}

	static __typeInfo = $.registerStructType(
		"main.Foo",
		() => new Foo(),
		() => [{ name: "Bar", args: [], returns: [] }],
		Foo,
		() => [{ name: "done", key: "done", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("bool"), "both") }]
	)
}

export function NewFoo(): Foo | $.VarRef<Foo> | null {
	return new Foo({done: $.makeChannel<boolean>(0, false, "both")})
}

export async function main(): globalThis.Promise<void> {
	let f: Foo | $.VarRef<Foo> | null = NewFoo()
	queueMicrotask(async () => { await Foo.prototype.Bar.call(f) })
	await $.chanRecv($.pointerValue<Foo>(f).done)
	await $.println("main done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
