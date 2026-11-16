// Generated file based on time_arithmetic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as math from "@goscript/math/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as time from "@goscript/time/index.js"
import "@goscript/math/index.js"

export class stamped {
	public declare Name: string

	public declare At: time.Time

	constructor(__goscriptValue?: boolean, Name$?: string, At$?: time.Time) {
		this.Name = Name$ ?? ""
		this.At = At$ ?? $.markAsStructValue(new time.Time())
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): stamped {
		return new stamped(true, this.Name, $.markAsStructValue($.cloneStructValue(this.At)))
	}

	public __goscriptAssign(source: stamped): this {
		this.Name = source.Name
		$.assignStruct(this.At, source.At)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.stamped",
		() => new stamped(),
		() => [],
		stamped,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("At", "time.Time", [1], 16, true)]
	)
}

export async function show(label: string, t: time.Time): globalThis.Promise<void> {
	await $.println(label, $.markAsStructValue($.cloneStructValue(t)).Format(time.RFC3339Nano), $.markAsStructValue($.cloneStructValue(t)).UnixNano())
}

export async function main(): globalThis.Promise<void> {
	// Add and Sub of short and long durations, also across milliseconds.
	let t0 = $.markAsStructValue($.cloneStructValue(time.Date(2026, 10, 16, 1, 2, 3, 999_999_999, time.UTC)))
	await show("add ns", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(1n))))
	await show("add -ns", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(-1000000000n))))
	await show("add sub-ms", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(1500001n))))
	await show("add -sub-ms", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(-1500001n))))
	await show("add 200 days", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(17280000000000007n))))
	await show("add -300 years", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(-9145440000000000003n))))
	await show("add max", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Date(1, 1, 1, 0, 0, 0, 0, time.UTC))).Add(9223372036854775807n))))
	let t = $.markAsStructValue($.cloneStructValue(t0))
	let d: time.Duration = 0n
	for (let __rangeIndex = 0; __rangeIndex < 100; __rangeIndex++) {
		t = $.assignStruct(t, $.markAsStructValue($.cloneStructValue(t)).Add(1000003n))
		d = $.int64Add(d, $.markAsStructValue($.cloneStructValue(t)).Sub($.markAsStructValue($.cloneStructValue(t0))))
	}
	await $.println("loop", d, $.markAsStructValue($.cloneStructValue(t)).Sub($.markAsStructValue($.cloneStructValue(t0))), $.markAsStructValue($.cloneStructValue(t0)).Sub($.markAsStructValue($.cloneStructValue(t))))
	let far = $.markAsStructValue($.cloneStructValue(time.Date(2400, 1, 1, 0, 0, 0, 5, time.UTC)))
	await $.println("sub long", $.markAsStructValue($.cloneStructValue(far)).Sub($.markAsStructValue($.cloneStructValue(t0))), $.markAsStructValue($.cloneStructValue(t0)).Sub($.markAsStructValue($.cloneStructValue(far))))
	await $.println("sub saturates", $.markAsStructValue($.cloneStructValue(time.Date(2500, 1, 1, 0, 0, 0, 0, time.UTC))).Sub($.markAsStructValue($.cloneStructValue(time.Date(1500, 1, 1, 0, 0, 0, 0, time.UTC)))) == 9223372036854775807n, $.markAsStructValue($.cloneStructValue(time.Date(1500, 1, 1, 0, 0, 0, 0, time.UTC))).Sub($.markAsStructValue($.cloneStructValue(time.Date(2500, 1, 1, 0, 0, 0, 0, time.UTC)))) == -9223372036854775808n)
	await $.println("compare", $.markAsStructValue($.cloneStructValue(t)).After($.markAsStructValue($.cloneStructValue(t0))), $.markAsStructValue($.cloneStructValue(t)).Before($.markAsStructValue($.cloneStructValue(t0))), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(1n))).Equal($.markAsStructValue($.cloneStructValue(t0))), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(1n))).Add(-1n))).Equal($.markAsStructValue($.cloneStructValue(t0))), $.markAsStructValue($.cloneStructValue(t0)).Compare($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Add(1n)))))

	// == compares the wall clock, monotonic reading and location, and map
	// keys are found by them.
	let a = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Unix(1n, 0n))).UTC()))
	let b = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Unix(2n, 0n))).UTC()))
	await $.println("equal", $.structEqual(a, b), $.structEqual(a, $.markAsStructValue($.cloneStructValue(time.Unix(1n, 0n))).UTC()), $.structEqual($.markAsStructValue($.cloneStructValue(a)).Add(1000000000n), b), $.structEqual(a, $.markAsStructValue($.cloneStructValue(a)).In(time.FixedZone("Y", 0))), reflect.DeepEqual($.structInterfaceValue($.markAsStructValue($.cloneStructValue(a)), "time.Time", __goscriptStatic0()), $.structInterfaceValue($.markAsStructValue($.cloneStructValue(b)), "time.Time", __goscriptStatic0())))
	await $.println("equal fields", $.structEqual(new stamped(true, "x", $.markAsStructValue($.cloneStructValue(a))), new stamped(true, "x", $.markAsStructValue($.cloneStructValue(b)))), $.structEqual(new stamped(true, "x", $.markAsStructValue($.cloneStructValue(a))), (() => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Unix(1n, 0n))).UTC())); return new stamped(true, "x", __goscriptLiteralField0) })()), $.comparableEqual($.structInterfaceValue($.markAsStructValue($.cloneStructValue(a)), "time.Time", __goscriptStatic0()), $.structInterfaceValue($.markAsStructValue($.cloneStructValue(b)), "time.Time", __goscriptStatic0())))
	let seen = $.makeMap<time.Time, number>([[$.markAsStructValue($.cloneStructValue(a)), 1]])
	$.mapSet(seen, $.markAsStructValue($.cloneStructValue(b)), 2)
	const __goscriptMap0 = seen
	const __goscriptMapKey0 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Unix(1n, 0n))).UTC()))
	$.mapSet(__goscriptMap0, __goscriptMapKey0, $.mapGet<time.Time, number, number>(__goscriptMap0, __goscriptMapKey0, 0)[0] + 1)
	await $.println("map", $.len(seen), $.mapGet<time.Time, number, number>(seen, a, 0)[0], $.mapGet<time.Time, number, number>(seen, b, 0)[0], $.mapGet<time.Time, number, number>(seen, $.markAsStructValue($.cloneStructValue(a)).Add(1n), 0)[0])
	let zero = $.markAsStructValue(new time.Time())
	await $.println("zero", $.structEqual(zero, $.markAsStructValue(new time.Time())), $.markAsStructValue($.cloneStructValue(zero)).IsZero(), $.structEqual(a, $.markAsStructValue(new time.Time())), reflect.ValueOf($.structInterfaceValue($.markAsStructValue($.cloneStructValue(zero)), "time.Time", __goscriptStatic0())).IsZero(), reflect.ValueOf($.structInterfaceValue($.markAsStructValue($.cloneStructValue(a)), "time.Time", __goscriptStatic0())).IsZero())
	await $.println("utc", $.structEqual($.markAsStructValue($.cloneStructValue(time.Unix(5n, 0n))).UTC(), time.Date(1970, 1, 1, 0, 0, 5, 0, time.UTC)), $.structEqual($.markAsStructValue($.cloneStructValue(t0)).In(time.UTC), t0), $.structEqual($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Local())).UTC(), t0))

	// Round and Truncate to multiples since the zero time; halfway rounds up.
	for (let __goscriptRangeTarget0 = $.arrayToSlice<time.Duration>([0n, -1n, 1n, 1000n, 1000000n, 1500000000n, 1000000000n, 60000000000n, 420000000000n, 3600000000000n, 86400000000000n, 4611686018427387907n]), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let d = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as time.Duration)
		await show("round " + time.Duration_String(d), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Round(d))))
		await show("truncate " + time.Duration_String(d), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).Truncate(d))))
	}
	let half = $.markAsStructValue($.cloneStructValue(time.Date(2026, 1, 1, 0, 0, 0, 500_000_000, time.UTC)))
	await show("round half", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(half)).Round(1000000000n))))
	await show("round below half", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(half)).Add(-1n))).Round(1000000000n))))
	let old = $.markAsStructValue($.cloneStructValue(time.Date(-5, 3, 1, 12, 30, 0, 250, time.UTC)))
	await show("round before zero", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(old)).Round(3600000000000n))))
	await show("truncate before zero", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(old)).Truncate(3600000000000n))))
	let zone = time.FixedZone("X", 19800)
	await show("truncate zone", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).In(zone))).Truncate(86400000000000n))))
	await $.println("zone kept", time.Location.prototype.String.call($.pointerValue<time.Location>($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t0)).In(zone))).Round(3600000000000n))).Location())))

	// Duration.Round and Truncate, also halfway, negative and saturating.
	for (let __goscriptRangeTarget1 = $.arrayToSlice<time.Duration>([1499n, 1500n, -1500n, -1501n, 9223372036854775807n, -9223372036854775808n, 123456789123456789n]), __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as time.Duration)
		await $.println("duration", v, time.Duration_Round(v, 1000n), time.Duration_Truncate(v, 1000n), time.Duration_Round(v, 3600000000000n), time.Duration_Round(v, 0n))
	}

	// Monotonic readings move with Add and are stripped by Round, Truncate
	// and In.
	let now = $.markAsStructValue($.cloneStructValue(time.Now()))
	let later = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add(1500000000n)))
	await $.println("mono", $.markAsStructValue($.cloneStructValue(later)).Sub($.markAsStructValue($.cloneStructValue(now))), $.markAsStructValue($.cloneStructValue(now)).Sub($.markAsStructValue($.cloneStructValue(later))), $.markAsStructValue($.cloneStructValue(later)).After($.markAsStructValue($.cloneStructValue(now))))
	await $.println("mono stripped", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Round(0n))).Equal($.markAsStructValue($.cloneStructValue(now))), $.structEqual($.markAsStructValue($.cloneStructValue(now)).Truncate(0n), $.markAsStructValue($.cloneStructValue(now)).Round(0n)), $.structEqual($.markAsStructValue($.cloneStructValue(now)).Round(0n), now))
	await $.println("mono string", $.stringLen($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Round(0n))).String()) < $.stringLen($.markAsStructValue($.cloneStructValue(now)).String()))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods("time.Time", "time.Time", () => [$.methodSignature("Add", [["d", /* @__PURE__ */ $.basicType("int64", "time.Duration")]], ["time.Time"]), $.methodSignature("AddDate", [["years", /* @__PURE__ */ $.basicType("int")], ["months", /* @__PURE__ */ $.basicType("int")], ["days", /* @__PURE__ */ $.basicType("int")]], ["time.Time"]), $.methodSignature("After", [["u", "time.Time"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("AppendBinary", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("AppendFormat", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["layout", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendText", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("Before", [["u", "time.Time"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Clock", [], [["hour", /* @__PURE__ */ $.basicType("int")], ["min", /* @__PURE__ */ $.basicType("int")], ["sec", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("Compare", [["u", "time.Time"]], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Date", [], [["year", /* @__PURE__ */ $.basicType("int")], ["month", /* @__PURE__ */ $.basicType("int", "time.Month")], ["day", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("Day", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Equal", [["u", "time.Time"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Format", [["layout", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("GoString", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("GobDecode", [["data", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], ["error"], true), $.methodSignature("GobEncode", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("Hour", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("ISOWeek", [], [["year", /* @__PURE__ */ $.basicType("int")], ["week", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("In", [["loc", /* @__PURE__ */ $.pointerType("time.Location")]], ["time.Time"]), $.methodSignature("IsDST", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("IsZero", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Local", [], ["time.Time"]), $.methodSignature("Location", [], [/* @__PURE__ */ $.pointerType("time.Location")]), $.methodSignature("MarshalBinary", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("MarshalJSON", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("MarshalText", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("Minute", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Month", [], [/* @__PURE__ */ $.basicType("int", "time.Month")]), $.methodSignature("Nanosecond", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Round", [["d", /* @__PURE__ */ $.basicType("int64", "time.Duration")]], ["time.Time"]), $.methodSignature("Second", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Sub", [["u", "time.Time"]], [/* @__PURE__ */ $.basicType("int64", "time.Duration")]), $.methodSignature("Truncate", [["d", /* @__PURE__ */ $.basicType("int64", "time.Duration")]], ["time.Time"]), $.methodSignature("UTC", [], ["time.Time"]), $.methodSignature("Unix", [], [/* @__PURE__ */ $.basicType("int64")]), $.methodSignature("UnixMicro", [], [/* @__PURE__ */ $.basicType("int64")]), $.methodSignature("UnixMilli", [], [/* @__PURE__ */ $.basicType("int64")]), $.methodSignature("UnixNano", [], [/* @__PURE__ */ $.basicType("int64")]), $.methodSignature("UnmarshalBinary", [["data", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], ["error"], true), $.methodSignature("UnmarshalJSON", [["data", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], ["error"], true), $.methodSignature("UnmarshalText", [["data", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], ["error"], true), $.methodSignature("Weekday", [], [/* @__PURE__ */ $.basicType("int", "time.Weekday")]), $.methodSignature("Year", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("YearDay", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Zone", [], [["name", /* @__PURE__ */ $.basicType("string")], ["offset", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("ZoneBounds", [], [["start", "time.Time"], ["end", "time.Time"]])]))
}

if ($.isMainScript(import.meta)) {
	await main()
}
