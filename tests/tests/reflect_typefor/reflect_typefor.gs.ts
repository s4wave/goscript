// Generated file based on reflect_typefor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_other from "./other.gs.ts"
import "@goscript/reflect/index.js"
import "@goscript/time/index.js"
import "./other.gs.ts"

export type MyInterface = {
	SomeMethod(): void
}

$.registerInterfaceType(
	"main.MyInterface",
	null,
	[{ name: "SomeMethod", args: [], returns: [] }]
);

export class MyStruct {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Age(): number {
		return this._fields.Age.value
	}
	public set Age(value: number) {
		this._fields.Age.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Age: $.VarRef<number>
	}

	constructor(init?: Partial<{Name?: string, Age?: number}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ("" as string)),
			Age: $.varRef(init?.Age ?? (0 as number))
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Age: $.varRef(this._fields.Age.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Age", key: "Age", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 16, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Test TypeFor with named interface type
	let t1 = reflect.TypeFor({[$.genericTypeArgsMarker]: true, T: { type: "main.MyInterface", zero: () => null, methods: {SomeMethod: (receiver: any, ...args: any[]) => receiver.SomeMethod(...$.stripGenericTypeArgs(args))} }})
	$.println("TypeFor interface:", await $.pointerValue<Exclude<reflect.Type, null>>(t1).String())

	// Test TypeFor with struct type
	let t2 = reflect.TypeFor({[$.genericTypeArgsMarker]: true, T: { type: "main.MyStruct", zero: () => $.markAsStructValue(new MyStruct()) }})
	$.println("TypeFor struct:", await $.pointerValue<Exclude<reflect.Type, null>>(t2).String())
	$.println("TypeFor struct kind:", await $.pointerValue<Exclude<reflect.Type, null>>(t2).Kind() == reflect.Struct)

	// Test TypeFor with int type
	let t3 = reflect.TypeFor({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	$.println("TypeFor int:", await $.pointerValue<Exclude<reflect.Type, null>>(t3).String())
	$.println("TypeFor int kind:", await $.pointerValue<Exclude<reflect.Type, null>>(t3).Kind() == reflect.Int)

	// Test TypeFor with imported and cross-file named struct types
	let t4 = reflect.TypeFor({[$.genericTypeArgsMarker]: true, T: { type: "time.Time", zero: () => $.markAsStructValue(new time.Time()), methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddDate: (receiver: any, ...args: any[]) => receiver.AddDate(...$.stripGenericTypeArgs(args)), After: (receiver: any, ...args: any[]) => receiver.After(...$.stripGenericTypeArgs(args)), AppendBinary: (receiver: any, ...args: any[]) => receiver.AppendBinary(...$.stripGenericTypeArgs(args)), AppendFormat: (receiver: any, ...args: any[]) => receiver.AppendFormat(...$.stripGenericTypeArgs(args)), AppendText: (receiver: any, ...args: any[]) => receiver.AppendText(...$.stripGenericTypeArgs(args)), Before: (receiver: any, ...args: any[]) => receiver.Before(...$.stripGenericTypeArgs(args)), Clock: (receiver: any, ...args: any[]) => receiver.Clock(...$.stripGenericTypeArgs(args)), Compare: (receiver: any, ...args: any[]) => receiver.Compare(...$.stripGenericTypeArgs(args)), Date: (receiver: any, ...args: any[]) => receiver.Date(...$.stripGenericTypeArgs(args)), Day: (receiver: any, ...args: any[]) => receiver.Day(...$.stripGenericTypeArgs(args)), Equal: (receiver: any, ...args: any[]) => receiver.Equal(...$.stripGenericTypeArgs(args)), Format: (receiver: any, ...args: any[]) => receiver.Format(...$.stripGenericTypeArgs(args)), GoString: (receiver: any, ...args: any[]) => receiver.GoString(...$.stripGenericTypeArgs(args)), GobEncode: (receiver: any, ...args: any[]) => receiver.GobEncode(...$.stripGenericTypeArgs(args)), Hour: (receiver: any, ...args: any[]) => receiver.Hour(...$.stripGenericTypeArgs(args)), ISOWeek: (receiver: any, ...args: any[]) => receiver.ISOWeek(...$.stripGenericTypeArgs(args)), In: (receiver: any, ...args: any[]) => receiver.In(...$.stripGenericTypeArgs(args)), IsDST: (receiver: any, ...args: any[]) => receiver.IsDST(...$.stripGenericTypeArgs(args)), IsZero: (receiver: any, ...args: any[]) => receiver.IsZero(...$.stripGenericTypeArgs(args)), Local: (receiver: any, ...args: any[]) => receiver.Local(...$.stripGenericTypeArgs(args)), Location: (receiver: any, ...args: any[]) => receiver.Location(...$.stripGenericTypeArgs(args)), MarshalBinary: (receiver: any, ...args: any[]) => receiver.MarshalBinary(...$.stripGenericTypeArgs(args)), MarshalJSON: (receiver: any, ...args: any[]) => receiver.MarshalJSON(...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => receiver.MarshalText(...$.stripGenericTypeArgs(args)), Minute: (receiver: any, ...args: any[]) => receiver.Minute(...$.stripGenericTypeArgs(args)), Month: (receiver: any, ...args: any[]) => receiver.Month(...$.stripGenericTypeArgs(args)), Nanosecond: (receiver: any, ...args: any[]) => receiver.Nanosecond(...$.stripGenericTypeArgs(args)), Round: (receiver: any, ...args: any[]) => receiver.Round(...$.stripGenericTypeArgs(args)), Second: (receiver: any, ...args: any[]) => receiver.Second(...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args)), Sub: (receiver: any, ...args: any[]) => receiver.Sub(...$.stripGenericTypeArgs(args)), Truncate: (receiver: any, ...args: any[]) => receiver.Truncate(...$.stripGenericTypeArgs(args)), UTC: (receiver: any, ...args: any[]) => receiver.UTC(...$.stripGenericTypeArgs(args)), Unix: (receiver: any, ...args: any[]) => receiver.Unix(...$.stripGenericTypeArgs(args)), UnixMicro: (receiver: any, ...args: any[]) => receiver.UnixMicro(...$.stripGenericTypeArgs(args)), UnixMilli: (receiver: any, ...args: any[]) => receiver.UnixMilli(...$.stripGenericTypeArgs(args)), UnixNano: (receiver: any, ...args: any[]) => receiver.UnixNano(...$.stripGenericTypeArgs(args)), Weekday: (receiver: any, ...args: any[]) => receiver.Weekday(...$.stripGenericTypeArgs(args)), Year: (receiver: any, ...args: any[]) => receiver.Year(...$.stripGenericTypeArgs(args)), YearDay: (receiver: any, ...args: any[]) => receiver.YearDay(...$.stripGenericTypeArgs(args)), Zone: (receiver: any, ...args: any[]) => receiver.Zone(...$.stripGenericTypeArgs(args)), ZoneBounds: (receiver: any, ...args: any[]) => receiver.ZoneBounds(...$.stripGenericTypeArgs(args)), absSec: (receiver: any, ...args: any[]) => receiver.absSec(...$.stripGenericTypeArgs(args)), appendFormat: (receiver: any, ...args: any[]) => receiver.appendFormat(...$.stripGenericTypeArgs(args)), appendFormatRFC3339: (receiver: any, ...args: any[]) => receiver.appendFormatRFC3339(...$.stripGenericTypeArgs(args)), appendStrictRFC3339: (receiver: any, ...args: any[]) => receiver.appendStrictRFC3339(...$.stripGenericTypeArgs(args)), appendTo: (receiver: any, ...args: any[]) => receiver.appendTo(...$.stripGenericTypeArgs(args)), locabs: (receiver: any, ...args: any[]) => receiver.locabs(...$.stripGenericTypeArgs(args))} }})
	$.println("TypeFor imported struct:", await $.pointerValue<Exclude<reflect.Type, null>>(t4).String())
	let t5 = reflect.TypeFor({[$.genericTypeArgsMarker]: true, T: { type: "main.OtherStruct", zero: () => $.markAsStructValue(new __goscript_other.OtherStruct()) }})
	$.println("TypeFor cross-file struct:", await $.pointerValue<Exclude<reflect.Type, null>>(t5).String())

	// Test Pointer constant (should be same as Ptr)
	$.println("Pointer constant:", (reflect.Pointer as number) == reflect.Pointer)

	$.println("reflect_typefor test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
