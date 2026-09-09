// Generated file based on bodyless_async_callback.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

import "@goscript/unsafe/index.js"
import "@goscript/sync/index.js"

export class Setting {
	public declare once: sync.Once

	public _fields: {
		once: sync.Once
	}

	constructor(init?: Partial<{once?: sync.Once}>) {
		this._fields = {
			once: init?.once ? $.markAsStructValue($.cloneStructValue(init.once)) : $.markAsStructValue(new sync.Once())
		}
	}

	public clone(): Setting {
		return $.markAsStructValue(new Setting(this))
	}

	public async Value(): globalThis.Promise<string> {
		const s: Setting | $.VarRef<Setting> | null = this
		await $.pointerValue<Setting>(s).once.Do($.functionValue((): void => {
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return ""
	}

	static {
		$.bindStructFields(this.prototype, ["once"])
	}

	static __typeInfo = $.registerStructType(
		"main.Setting",
		() => new Setting(),
		() => [{ name: "Value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		Setting,
		() => [{ name: "once", key: "once", type: "sync.Once" }]
	)
}

export function setCallback(callback: ((_p0: string) => (() => void) | null | globalThis.Promise<(() => void) | null>) | null): void {
}

export async function newCallback(name: string): globalThis.Promise<(() => void) | null> {
	let s: Setting | $.VarRef<Setting> | null = new Setting()
	await Setting.prototype.Value.call(s)
	return $.functionValue(async (): globalThis.Promise<void> => {
		await $.println("callback:", name)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
}

function __goscriptInit0(): void {
	setCallback(newCallback)
}

export async function main(): globalThis.Promise<void> {
	await $.println("ok")
}

__goscriptInit0()

if ($.isMainScript(import.meta)) {
	await main()
}
