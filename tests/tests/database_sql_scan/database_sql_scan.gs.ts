// Generated file based on database_sql_scan.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as sql from "@goscript/database/sql/index.js"

import * as driver from "@goscript/database/sql/driver/index.js"

import * as io from "@goscript/io/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/context/index.js"
import "@goscript/database/sql/index.js"
import "@goscript/database/sql/driver/index.js"
import "@goscript/io/index.js"
import "@goscript/reflect/index.js"
import "@goscript/time/index.js"

export class connector {
	public declare direct: boolean

	public declare blob: boolean

	public _fields: {
		direct: boolean
		blob: boolean
	}

	constructor(init?: Partial<{direct?: boolean, blob?: boolean}>) {
		this._fields = {
			direct: init?.direct ?? (false as boolean),
			blob: init?.blob ?? (false as boolean)
		}
	}

	public clone(): connector {
		return $.markAsStructValue(new connector(this))
	}

	public Begin(): [driver.Tx | null, $.GoError] {
		const c = this;
		return [null, driver.ErrSkip]
	}

	public Close(): $.GoError {
		const c = this;
		return null
	}

	public Connect(_p0: context.Context | null): [driver.Conn | null, $.GoError] {
		const c = this;
		return [$.interfaceValue<driver.Conn | null>($.markAsStructValue($.cloneStructValue(c)), "main.connector", "main.connector"), null]
	}

	public Driver(): driver.Driver | null {
		const c = this;
		return $.interfaceValue<driver.Driver | null>($.markAsStructValue($.cloneStructValue(c)), "main.connector", "main.connector")
	}

	public async ExecContext(_p0: context.Context | null, _p1: string, _p2: $.Slice<driver.NamedValue>): globalThis.Promise<[driver.Result | null, $.GoError]> {
		const c = this;
		await time.Sleep(1000000n)
		return [$.namedValueInterfaceValue<driver.Result | null>(0n, "driver.RowsAffected", {LastInsertId: (receiver: any, ...args: any[]) => (driver.RowsAffected_LastInsertId as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), RowsAffected: (receiver: any, ...args: any[]) => (driver.RowsAffected_RowsAffected as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.basicType("int64", "driver.RowsAffected"), [$.methodSignature("LastInsertId", [], [/* @__PURE__ */ $.basicType("int64"), "error"]), $.methodSignature("RowsAffected", [], [/* @__PURE__ */ $.basicType("int64"), "error"])]), null]
	}

	public Open(_p0: string): [driver.Conn | null, $.GoError] {
		const c = this;
		return [$.interfaceValue<driver.Conn | null>($.markAsStructValue($.cloneStructValue(c)), "main.connector", "main.connector"), null]
	}

	public Prepare(_p0: string): [driver.Stmt | null, $.GoError] {
		const c = this;
		return [null, driver.ErrSkip]
	}

	public async QueryContext(_p0: context.Context | null, _p1: string, _p2: $.Slice<driver.NamedValue>): globalThis.Promise<[driver.Rows | null, $.GoError]> {
		const c = this;
		await time.Sleep(1000000n)
		if (c.direct) {
			return [$.interfaceValue<driver.Rows | null>(new columnRows(), "*main.columnRows", /* @__PURE__ */ $.pointerType("main.columnRows")), null]
		}
		return [$.interfaceValue<driver.Rows | null>(new rows({blob: c.blob}), "*main.rows", /* @__PURE__ */ $.pointerType("main.rows")), null]
	}

	static {
		$.bindStructFields(this.prototype, ["direct", "blob"])
	}

	static __typeInfo = $.registerStructType(
		"main.connector",
		() => new connector(),
		() => [$.methodSignature("Begin", [], ["driver.Tx", "error"]), $.methodSignature("Close", [], ["error"]), $.methodSignature("Connect", ["context.Context"], ["driver.Conn", "error"]), $.methodSignature("Driver", [], ["driver.Driver"]), $.methodSignature("ExecContext", ["context.Context", /* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType("driver.NamedValue")], ["driver.Result", "error"]), $.methodSignature("Open", [/* @__PURE__ */ $.basicType("string")], ["driver.Conn", "error"]), $.methodSignature("Prepare", [/* @__PURE__ */ $.basicType("string")], ["driver.Stmt", "error"]), $.methodSignature("QueryContext", ["context.Context", /* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType("driver.NamedValue")], ["driver.Rows", "error"])],
		connector,
		() => [/* @__PURE__ */ $.structField("direct", /* @__PURE__ */ $.basicType("bool"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/database_sql_scan" }), /* @__PURE__ */ $.structField("blob", /* @__PURE__ */ $.basicType("bool"), [1], 1, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/database_sql_scan" })]
	)
}

export class rows {
	public declare done: boolean

	public declare blob: boolean

	public _fields: {
		done: boolean
		blob: boolean
	}

	constructor(init?: Partial<{done?: boolean, blob?: boolean}>) {
		this._fields = {
			done: init?.done ?? (false as boolean),
			blob: init?.blob ?? (false as boolean)
		}
	}

	public clone(): rows {
		return $.markAsStructValue(new rows(this))
	}

	public Close(): $.GoError {
		return null
	}

	public Columns(): $.Slice<string> {
		return $.arrayToSlice<string>(["value"])
	}

	public Next(dest: $.Slice<driver.Value | null>): $.GoError {
		let r: rows | $.VarRef<rows> | null = this;
		if ($.pointerValue<rows>(r).done) {
			return io.EOF
		}
		$.pointerValue<rows>(r).done = true
		if ($.pointerValue<rows>(r).blob) {
			dest![0] = $.interfaceValue<driver.Value | null>(new Uint8Array([100, 117, 114, 97, 98, 108, 101]), "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")))
		} else {
			dest![0] = $.basicInterfaceValue(42n, "int64")
		}
		return null
	}

	static {
		$.bindStructFields(this.prototype, ["done", "blob"])
	}

	static __typeInfo = $.registerStructType(
		"main.rows",
		() => new rows(),
		() => [$.methodSignature("Close", [], ["error"]), $.methodSignature("Columns", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))]), $.methodSignature("Next", [["dest", /* @__PURE__ */ $.sliceType("driver.Value")]], ["error"])],
		rows,
		() => [/* @__PURE__ */ $.structField("done", /* @__PURE__ */ $.basicType("bool"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/database_sql_scan" }), /* @__PURE__ */ $.structField("blob", /* @__PURE__ */ $.basicType("bool"), [1], 1, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/database_sql_scan" })]
	)
}

export class columnRows {
	public declare rows: rows

	public _fields: {
		rows: rows
	}

	constructor(init?: Partial<{rows?: rows}>) {
		this._fields = {
			rows: init?.rows ? $.markAsStructValue($.cloneStructValue(init.rows)) : $.markAsStructValue(new rows())
		}
	}

	public clone(): columnRows {
		return $.markAsStructValue(new columnRows(this))
	}

	public Next(_p0: $.Slice<driver.Value | null>): $.GoError {
		$.panic("ordinary Next called on column scanner")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public NextRow(): $.GoError {
		let r: columnRows | $.VarRef<columnRows> | null = this;
		if ($.pointerValue<columnRows>(r).rows.done) {
			return io.EOF
		}
		$.pointerValue<columnRows>(r).rows.done = true
		return null
	}

	public async ScanColumn(ctx: driver.ScanContext, index: number, dest: any): globalThis.Promise<$.GoError> {
		if (index != 0) {
			$.panic("unexpected column")
		}
		return sql.ConvertAssign($.markAsStructValue($.cloneStructValue(ctx)), dest, $.basicInterfaceValue(42n, "int64"))
	}

	public Close(): any {
		return $.pointerValue<rows>(this.rows).Close()
	}

	public Columns(): any {
		return $.pointerValue<rows>(this.rows).Columns()
	}

	static {
		$.bindStructFields(this.prototype, ["rows"])
	}

	static __typeInfo = $.registerStructType(
		"main.columnRows",
		() => new columnRows(),
		() => [$.methodSignature("Next", [/* @__PURE__ */ $.sliceType("driver.Value")], ["error"]), $.methodSignature("NextRow", [], ["error"]), $.methodSignature("ScanColumn", [["ctx", "driver.ScanContext"], ["index", /* @__PURE__ */ $.basicType("int")], ["dest", { kind: $.TypeKind.Interface, methods: [] }]], ["error"]), $.methodSignature("Close", [], ["error"]), $.methodSignature("Columns", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))])],
		columnRows,
		() => [/* @__PURE__ */ $.structField("rows", "main.rows", [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/database_sql_scan", anonymous: true })]
	)
}

export async function main(): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = $.arrayToSlice<boolean>([false, true]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let direct = __goscriptRangeTarget0![__rangeIndex]
		let db: sql.DB | $.VarRef<sql.DB> | null = await sql.OpenDB($.interfaceValue<driver.Connector | null>($.markAsStructValue(new connector({direct: direct})), "main.connector", "main.connector"))
		{
			let [, err] = await sql.DB.prototype.ExecContext.call(db, context.Background(), "create", null)
			if (err != null) {
				$.panic((err as any))
			}
		}
		let value: $.VarRef<number> = $.varRef(0)
		{
			let err = await sql.Row.prototype.Scan.call(await sql.DB.prototype.QueryRowContext.call(db, context.Background(), "query", $.arrayToSlice<any>([$.interfaceValue(new Uint8Array([107, 101, 121]), "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")))])), $.arrayToSlice<any>([$.interfaceValue(value, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))]))
			if (err != null) {
				$.panic((err as any))
			}
		}
		await $.println(direct, value.value)
		{
			let err = await sql.DB.prototype.Close.call(db)
			if (err != null) {
				$.panic((err as any))
			}
		}
	}
	let value: $.VarRef<number> = $.varRef(0)
	{
		let err = await sql.ConvertAssign($.markAsStructValue(new driver.ScanContext()), $.interfaceValue(value, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))), $.basicInterfaceValue(7n, "int64"))
		if (err != null) {
			$.panic((err as any))
		}
	}
	await $.println("zero context", value.value)
	let db: sql.DB | $.VarRef<sql.DB> | null = await sql.OpenDB($.interfaceValue<driver.Connector | null>($.markAsStructValue(new connector({blob: true})), "main.connector", "main.connector"))
	let data: $.VarRef<$.Slice<number>> = $.varRef(null! as $.Slice<number>)
	{
		let err = await sql.Row.prototype.Scan.call(await sql.DB.prototype.QueryRow.call(db, "blob", null), $.arrayToSlice<any>([$.interfaceValue(data, "*[]byte", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))]))
		if (err != null) {
			$.panic((err as any))
		}
	}
	await $.println("blob", $.bytesToString(data.value))
	let raw: $.VarRef<sql.RawBytes> = $.varRef(null! as sql.RawBytes)
	await $.println("raw rejected", await sql.Row.prototype.Scan.call(await sql.DB.prototype.QueryRow.call(db, "blob", null), $.arrayToSlice<any>([$.interfaceValue(raw, "*sql.RawBytes", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "sql.RawBytes")))])) != null)
	{
		let err = await sql.DB.prototype.Close.call(db)
		if (err != null) {
			$.panic((err as any))
		}
	}
	let plainPointer: $.VarRef<$.Slice<number>> | null = null! as $.VarRef<$.Slice<number>> | null
	let rawPointer: $.VarRef<sql.RawBytes> | null = null! as $.VarRef<sql.RawBytes> | null
	let [, plainIsRaw] = $.typeAssertTuple<$.VarRef<sql.RawBytes> | null>($.interfaceValue(plainPointer, "*[]byte", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")))), /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "sql.RawBytes")))
	let [, rawIsPlain] = $.typeAssertTuple<$.VarRef<$.Slice<number>> | null>($.interfaceValue(rawPointer, "*sql.RawBytes", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "sql.RawBytes"))), /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))
	await $.println("nil pointer identity", plainIsRaw, rawIsPlain)

	type namedInt = number
	class tagged {
		public declare Value: number

		public _fields: {
			Value: number
		}

		constructor(init?: Partial<{Value?: number}>) {
			this._fields = {
				Value: init?.Value ?? (0 as number)
			}
		}

		public clone(): tagged {
			return $.markAsStructValue(new tagged(this))
		}

		static {
			$.bindStructFields(this.prototype, ["Value"])
		}

		static __typeInfo = $.registerStructType(
			"main.tagged",
			() => new tagged(),
			() => [],
			tagged,
			() => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("int"), [0], 0, true, { tag: "json:\"first\"" })]
		)
	}
	class retagged {
		public declare Value: number

		public _fields: {
			Value: number
		}

		constructor(init?: Partial<{Value?: number}>) {
			this._fields = {
				Value: init?.Value ?? (0 as number)
			}
		}

		public clone(): retagged {
			return $.markAsStructValue(new retagged(this))
		}

		static {
			$.bindStructFields(this.prototype, ["Value"])
		}

		static __typeInfo = $.registerStructType(
			"main.retagged",
			() => new retagged(),
			() => [],
			retagged,
			() => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("int"), [0], 0, true, { tag: "json:\"second\"" })]
		)
	}
	await $.println("named integer", await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int", "main.namedInt"), zero: () => 0 }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}))!))
	await $.println("boolean string", await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("bool"), zero: () => false }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }}))!))
	await $.println("byte string", await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), zero: () => null }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }}))!))
	await $.println("slice array", await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), zero: () => null }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), zero: () => Array.from({ length: 2 }, () => 0) }}))!))
	await $.println("named elements", await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int", "main.namedInt")), zero: () => null }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), zero: () => null }}))!))
	await $.println("struct tags", await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.tagged", zero: () => $.markAsStructValue(new tagged()) }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.retagged", zero: () => $.markAsStructValue(new retagged()) }}))!))
}

if ($.isMainScript(import.meta)) {
	await main()
}
