// Generated file based on package_import_named_struct_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/time/index.js"

export class LocalTime {
	public declare wall: bigint

	public declare ext: bigint

	public declare loc: time.Location | $.VarRef<time.Location> | null

	public _fields: {
		wall: bigint
		ext: bigint
		loc: time.Location | $.VarRef<time.Location> | null
	}

	constructor(init?: Partial<{wall?: bigint, ext?: bigint, loc?: time.Location | $.VarRef<time.Location> | null}>) {
		this._fields = {
			wall: init?.wall ?? (0n as bigint),
			ext: init?.ext ?? (0n as bigint),
			loc: init?.loc ?? (null! as time.Location | $.VarRef<time.Location> | null)
		}
	}

	public clone(): LocalTime {
		return $.markAsStructValue(new LocalTime(this))
	}

	static {
		$.bindStructFields(this.prototype, ["wall", "ext", "loc"])
	}

	static __typeInfo = $.registerStructType(
		"main.LocalTime",
		() => new LocalTime(),
		() => [],
		LocalTime,
		() => [{ name: "wall", key: "wall", type: /* @__PURE__ */ $.basicType("uint64") }, { name: "ext", key: "ext", type: /* @__PURE__ */ $.basicType("int64") }, { name: "loc", key: "loc", type: /* @__PURE__ */ $.pointerType("time.Location") }]
	)
}

export function asTime(t: LocalTime): time.Time {
	return $.markAsStructValue($.cloneStructValue($.namedStructConversion<time.Time>(t)))
}

export function asLocal(t: time.Time): LocalTime {
	return $.markAsStructValue($.cloneStructValue($.namedStructConversion<LocalTime>(t)))
}

export async function main(): globalThis.Promise<void> {
	let first = $.markAsStructValue($.cloneStructValue($.namedStructConversion<LocalTime>($.markAsStructValue($.cloneStructValue(time.Unix(11n, 0n))).UTC())))
	await $.println("as time:", $.markAsStructValue($.cloneStructValue(asTime($.markAsStructValue($.cloneStructValue(first))))).Unix())

	let second = $.markAsStructValue($.cloneStructValue(asLocal($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Unix(22n, 0n))).UTC())))))
	await $.println("as local:", $.markAsStructValue($.cloneStructValue($.namedStructConversion<time.Time>(second))).Unix())
}

if ($.isMainScript(import.meta)) {
	await main()
}
