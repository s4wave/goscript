// Generated file based on package_import_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/math/index.js"
import "@goscript/time/index.js"

export async function main(): globalThis.Promise<void> {
	let now = $.markAsStructValue($.cloneStructValue(time.Now()))
	let setTime = $.markAsStructValue($.cloneStructValue(time.Date(2025, time.May, 15, 1, 10, 42, 0, time.UTC)))
	if ($.markAsStructValue($.cloneStructValue(now)).Sub($.markAsStructValue($.cloneStructValue(setTime))) < 86400000000000n) {
		await $.println("expected we are > 24 hrs past may 15, incorrect")
	}

	await $.println("preset time", $.markAsStructValue($.cloneStructValue(setTime)).String())
	await $.println("unix", $.markAsStructValue($.cloneStructValue(setTime)).Unix())
	await $.println("unix micro", $.markAsStructValue($.cloneStructValue(setTime)).UnixMicro())
	await $.println("unix nano", $.markAsStructValue($.cloneStructValue(setTime)).UnixNano())
	await $.println("unix milli", $.markAsStructValue($.cloneStructValue(setTime)).UnixMilli())

	// day, month, etc.
	await $.println("day", $.markAsStructValue($.cloneStructValue(setTime)).Day())
	await $.println("month", $.markAsStructValue($.cloneStructValue(setTime)).Month())
	await $.println("january", time.January)
	await $.println("year", $.markAsStructValue($.cloneStructValue(setTime)).Year())
	await $.println("hour", $.markAsStructValue($.cloneStructValue(setTime)).Hour())
	await $.println("minute", $.markAsStructValue($.cloneStructValue(setTime)).Minute())
	await $.println("second", $.markAsStructValue($.cloneStructValue(setTime)).Second())
	await $.println("nanosecond", $.markAsStructValue($.cloneStructValue(setTime)).Nanosecond())
	let [year, month, day] = $.markAsStructValue($.cloneStructValue(setTime)).Date()
	await $.println("date tuple", year, month, day)
	let [hour, minute, second] = $.markAsStructValue($.cloneStructValue(setTime)).Clock()
	await $.println("clock tuple", hour, minute, second)
	let [zoneName, zoneOffset] = $.markAsStructValue($.cloneStructValue(setTime)).Zone()
	await $.println("zone tuple", zoneName, zoneOffset)
	await $.println("add date", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(setTime)).AddDate(1, 2, 3))).UTC())).Format(time.RFC3339))

	// other functions on setTime
	await $.println("weekday", time.Weekday_String($.markAsStructValue($.cloneStructValue(setTime)).Weekday()))
	await $.println("location", time.Location.prototype.String.call($.pointerValue<time.Location>($.markAsStructValue($.cloneStructValue(setTime)).Location())))
	await $.println("utc", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(setTime)).UTC())).Format("2006-01-02T15:04:05Z07:00"))
	await $.println("seconds", time.Duration_Seconds(($.int64Mul(1500n, 1000000n))))
	await $.println("duration string", time.Duration_String(($.int64Mul(1500n, 1000000n))))
	await $.println("negative duration before", $.markAsStructValue($.cloneStructValue(time.Now())).After($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(-60000000000n)))))

	let [duration, durationErr] = time.ParseDuration("1.5s")
	await $.println("parsed duration", duration, durationErr == null)
	let [, badDurationErr] = time.ParseDuration("not-a-duration")
	await $.println("bad duration err", badDurationErr != null)

	let timer: time.Timer | $.VarRef<time.Timer> | null = time.AfterFunc(9223372036854775807n, $.functionValue((): void => {
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await $.println("max duration timer stopped", time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(timer)))
	let maxDuration = 9223372036854775807n
	await $.println("max duration converted", maxDuration > 0n)

	let [parsed, parseErr] = time.Parse(time.RFC3339, "2025-05-15T01:10:42Z")
	await $.println("parsed time", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(parsed)).UTC())).Format(time.RFC3339), parseErr == null)
	await $.println("parsed nano", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(parsed)).UTC())).Format(time.RFC3339Nano))
	let [, badParseErr] = time.Parse(time.RFC3339, "not-a-time")
	await $.println("bad time err", badParseErr != null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
