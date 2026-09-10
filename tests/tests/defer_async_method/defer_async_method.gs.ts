// Generated file based on defer_async_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class AsyncResource {
	public declare name: string

	public _fields: {
		name: string
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: init?.name ?? ("" as string)
		}
	}

	public clone(): AsyncResource {
		return $.markAsStructValue(new AsyncResource(this))
	}

	public async Release(): globalThis.Promise<void> {
		const r: AsyncResource | $.VarRef<AsyncResource> | null = this;
		let ch: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			await $.chanSend(ch, true)
		})() })
		await $.chanRecv(ch)
		await $.println("Released", $.pointerValue<AsyncResource>(r).name)
	}

	static {
		$.bindStructFields(this.prototype, ["name"])
	}

	static __typeInfo = $.registerStructType(
		"main.AsyncResource",
		() => new AsyncResource(),
		() => [{ name: "Release", args: [], returns: [] }],
		AsyncResource,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let res: AsyncResource | $.VarRef<AsyncResource> | null = new AsyncResource({name: "test"})
	__defer.defer(async () => { await AsyncResource.prototype.Release.call(res) })
	await $.println("main function")
}

if ($.isMainScript(import.meta)) {
	await main()
}
