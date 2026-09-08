// Generated file based on atomic_struct_field_init.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"
import "@goscript/sync/atomic/index.js"

export class MyStruct {
	public declare closed: atomic.Bool

	public declare count: atomic.Int32

	public declare flag: atomic.Uint32

	public _fields: {
		closed: atomic.Bool
		count: atomic.Int32
		flag: atomic.Uint32
	}

	constructor(init?: Partial<{closed?: atomic.Bool, count?: atomic.Int32, flag?: atomic.Uint32}>) {
		this._fields = {
			closed: init?.closed ? $.markAsStructValue($.cloneStructValue(init.closed)) : $.markAsStructValue(new atomic.Bool()),
			count: init?.count ? $.markAsStructValue($.cloneStructValue(init.count)) : $.markAsStructValue(new atomic.Int32()),
			flag: init?.flag ? $.markAsStructValue($.cloneStructValue(init.flag)) : $.markAsStructValue(new atomic.Uint32())
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["closed", "count", "flag"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [],
		MyStruct,
		() => [{ name: "closed", key: "closed", type: "atomic.Bool" }, { name: "count", key: "count", type: "atomic.Int32" }, { name: "flag", key: "flag", type: "atomic.Uint32" }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Test struct initialization with atomic fields
	let s = $.markAsStructValue(new MyStruct())

	// Test that the atomic fields work correctly
	s.closed.Store(true)
	s.count.Store($.int(42, 32))
	s.flag.Store($.uint(100, 32))

	await $.println("closed:", s.closed.Load())
	await $.println("count:", $.int(s.count.Load(), 32))
	await $.println("flag:", $.uint(s.flag.Load(), 32))

	// Test struct initialization with init values
	let s2 = $.markAsStructValue(new MyStruct({closed: $.markAsStructValue(new atomic.Bool()), count: $.markAsStructValue(new atomic.Int32()), flag: $.markAsStructValue(new atomic.Uint32())}))

	s2.closed.Store(false)
	s2.count.Store($.int(24, 32))
	s2.flag.Store($.uint(50, 32))

	await $.println("s2 closed:", s2.closed.Load())
	await $.println("s2 count:", $.int(s2.count.Load(), 32))
	await $.println("s2 flag:", $.uint(s2.flag.Load(), 32))

	await $.println("atomic struct field test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
