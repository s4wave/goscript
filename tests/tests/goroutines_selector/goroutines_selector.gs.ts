// Generated file based on goroutines_selector.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Foo {
	public declare done: $.Channel<boolean> | null

	constructor(__goscriptValue?: boolean, done$?: $.Channel<boolean> | null) {
		this.done = done$ ?? (null! as $.Channel<boolean> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Foo {
		return new Foo(true, this.done)
	}

	public __goscriptAssign(source: Foo): this {
		this.done = source.done
		return this
	}

	public async Bar(): globalThis.Promise<void> {
		const f: Foo | $.VarRef<Foo> | null = this;
		await $.println("Foo.Bar called")
		await $.chanSend($.pointerValue<Foo>(f).done, true)
	}

	static __typeInfo = $.registerStructType(
		"main.Foo",
		() => new Foo(),
		() => [{ name: "Bar", args: [], returns: [], pointerReceiver: true }],
		Foo,
		() => [{ name: "done", key: "done", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("bool"), "both") }]
	)
}

export function NewFoo(): Foo | $.VarRef<Foo> | null {
	return new Foo(false, $.makeChannel<boolean>(0, false, "both"))
}

export async function main(): globalThis.Promise<void> {
	let f = NewFoo()
	$.go(async () => { await (f !== null && (f as any).__isVarRef !== true && (f as any).__goValue === undefined ? ((f as any) as Foo).Bar() : Foo.prototype.Bar.call(f)) })
	await $.chanRecv($.pointerValue<Foo>(f).done)
	await $.println("main done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
