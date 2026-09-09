// Generated file based on named_type_wrapper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyFileMode = number

export class FileStatus {
	public declare mode: MyFileMode

	public declare size: bigint

	public _fields: {
		mode: MyFileMode
		size: bigint
	}

	constructor(init?: Partial<{mode?: MyFileMode, size?: bigint}>) {
		this._fields = {
			mode: init?.mode ?? (0 as MyFileMode),
			size: init?.size ?? (0n as bigint)
		}
	}

	public clone(): FileStatus {
		return $.markAsStructValue(new FileStatus(this))
	}

	static {
		$.bindStructFields(this.prototype, ["mode", "size"])
	}

	static __typeInfo = $.registerStructType(
		"main.FileStatus",
		() => new FileStatus(),
		() => [],
		FileStatus,
		() => [{ name: "mode", key: "mode", type: /* @__PURE__ */ $.basicType("int", "main.MyFileMode") }, { name: "size", key: "size", type: /* @__PURE__ */ $.basicType("int64") }]
	)
}

export function MyFileMode_String(m: MyFileMode): string {
	return "mode"
}

export async function main(): globalThis.Promise<void> {
	// Test using the named type directly
	let mode: MyFileMode = 0o644
	await $.println("Mode value:", $.int(mode))
	await $.println("Mode string:", MyFileMode_String(mode))

	// Test using in struct
	let status = $.markAsStructValue(new FileStatus({mode: 0o755, size: 1024n}))

	await $.println("Status mode:", $.int(status.mode))
	await $.println("Status size:", status.size)

	// Test type assertion and conversion
	let genericMode: MyFileMode = 0o777
	await $.println("Generic mode:", $.int(genericMode))
}

if ($.isMainScript(import.meta)) {
	await main()
}
