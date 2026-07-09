// Generated file based on wide_uint64_wraparound.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class BigInt {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): BigInt {
		const cloned = new BigInt()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.BigInt",
		() => new BigInt(),
		[],
		BigInt,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let value = 18446744073709551615n
	$.println($.uint64Add(value, 1n))
}

if ($.isMainScript(import.meta)) {
	await main()
}
