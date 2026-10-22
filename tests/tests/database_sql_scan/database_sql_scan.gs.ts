// Generated file based on database_sql_scan.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as context from "@goscript/context/index.js"
import * as sql from "@goscript/database/sql/index.js"
import * as driver from "@goscript/database/sql/driver/index.js"
import * as io from "@goscript/io/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as time from "@goscript/time/index.js"
import "@goscript/io/index.js"

export class connector {
	public declare direct: boolean

	public declare blob: boolean

	constructor(__goscriptValue?: boolean, direct$?: boolean, blob$?: boolean) {
		this.direct = direct$ ?? false
		this.blob = blob$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): connector {
		return new connector(true, this.direct, this.blob)
	}

	public __goscriptAssign(source: connector): this {
		this.direct = source.direct
		this.blob = source.blob
		return this
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
		return [$.structInterfaceValue<driver.Conn | null>((c).clone(), "main.connector", "main.connector"), null]
	}

	public Driver(): driver.Driver | null {
		const c = this;
		return $.structInterfaceValue<driver.Driver | null>((c).clone(), "main.connector", "main.connector")
	}

	public async ExecContext(_p0: context.Context | null, _p1: string, _p2: $.Slice<driver.NamedValue>): globalThis.Promise<[driver.Result | null, $.GoError]> {
		const c = this;
		await time.Sleep(1000000n)
		return [__goscriptStatic3(), null]
	}

	public Open(_p0: string): [driver.Conn | null, $.GoError] {
		const c = this;
		return [$.structInterfaceValue<driver.Conn | null>((c).clone(), "main.connector", "main.connector"), null]
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
		return [$.interfaceValue<driver.Rows | null>(new rows(false, undefined, c.blob), "*main.rows", /* @__PURE__ */ $.pointerType("main.rows")), null]
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

	constructor(__goscriptValue?: boolean, done$?: boolean, blob$?: boolean) {
		this.done = done$ ?? false
		this.blob = blob$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): rows {
		return new rows(true, this.done, this.blob)
	}

	public __goscriptAssign(source: rows): this {
		this.done = source.done
		this.blob = source.blob
		return this
	}

	public Close(): $.GoError {
		return null
	}

	public Columns(): $.Slice<string> {
		return $.arrayToSlice<string>(["value"])
	}

	public Next(dest: $.Slice<driver.Value | null>): $.GoError {
		const r: rows | $.VarRef<rows> | null = this;
		const r$: rows = r == null ? $.pointerTarget<rows>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<rows>(r)
		if ((r$ as rows).done) {
			return io.EOF
		}
		;(r$ as rows).done = true
		if ((r$ as rows).blob) {
			$.sliceElems(dest!)[$.sliceSlot(dest!, 0)] = $.interfaceValue<driver.Value | null>(new Uint8Array([100, 117, 114, 97, 98, 108, 101]), "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")))
		} else {
			$.sliceElems(dest!)[$.sliceSlot(dest!, 0)] = $.basicInterfaceValue(42n, "int64")
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.rows",
		() => new rows(),
		() => [$.methodSignature("Close", [], ["error"], true), $.methodSignature("Columns", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))], true), $.methodSignature("Next", [["dest", /* @__PURE__ */ $.sliceType("driver.Value")]], ["error"], true)],
		rows,
		() => [/* @__PURE__ */ $.structField("done", /* @__PURE__ */ $.basicType("bool"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/database_sql_scan" }), /* @__PURE__ */ $.structField("blob", /* @__PURE__ */ $.basicType("bool"), [1], 1, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/database_sql_scan" })]
	)
}

export class columnRows {
	public declare rows: rows

	constructor(__goscriptValue?: boolean, rows$?: rows) {
		this.rows = rows$ ?? new rows(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): columnRows {
		return new columnRows(true, this.rows.clone())
	}

	public __goscriptAssign(source: columnRows): this {
		this.rows.__goscriptAssign(source.rows)
		return this
	}

	public Next(_p0: $.Slice<driver.Value | null>): $.GoError {
		$.panic("ordinary Next called on column scanner")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public NextRow(): $.GoError {
		const r: columnRows | $.VarRef<columnRows> | null = this;
		const r$: columnRows = r == null ? $.pointerTarget<columnRows>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<columnRows>(r)
		if ((r$ as columnRows).rows.done) {
			return io.EOF
		}
		;(r$ as columnRows).rows.done = true
		return null
	}

	public async ScanColumn(ctx: driver.ScanContext, index: number, dest: any): globalThis.Promise<$.GoError> {
		if (index != 0) {
			$.panic("unexpected column")
		}
		return sql.ConvertAssign(ctx, dest, $.basicInterfaceValue(42n, "int64"))
	}

	public Close(): any {
		return rows.prototype.Close.call($.fieldRef(this, "rows"))
	}

	public Columns(): any {
		return rows.prototype.Columns.call($.fieldRef(this, "rows"))
	}

	static __typeInfo = $.registerStructType(
		"main.columnRows",
		() => new columnRows(),
		() => [$.methodSignature("Next", [/* @__PURE__ */ $.sliceType("driver.Value")], ["error"], true), $.methodSignature("NextRow", [], ["error"], true), $.methodSignature("ScanColumn", [["ctx", "driver.ScanContext"], ["index", /* @__PURE__ */ $.basicType("int")], ["dest", { kind: $.TypeKind.Interface, methods: [] }]], ["error"], true), $.methodSignature("Close", [], ["error"], true), $.methodSignature("Columns", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))], true)],
		columnRows,
		() => [/* @__PURE__ */ $.structField("rows", "main.rows", [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/database_sql_scan", anonymous: true })]
	)
}

export async function main(): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = $.arrayToSlice<boolean>([false, true]), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let direct = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as boolean)
		let db = await sql.OpenDB($.structInterfaceValue<driver.Connector | null>(new connector(true, direct), "main.connector", "main.connector"))
		{
			let [, err] = await (db !== null && (db as any).__isVarRef !== true && (db as any).__goValue === undefined ? ((db as any) as sql.DB).ExecContext(context.Background(), "create", null) : sql.DB.prototype.ExecContext.call(db, context.Background(), "create", null))
			if (err != null) {
				$.panic((err as any))
			}
		}
		let value = $.varRef(0)
		{
			let err = await sql.Row.prototype.Scan.call(await sql.DB.prototype.QueryRowContext.call(db, context.Background(), "query", $.arrayToSlice<any>([$.interfaceValue(new Uint8Array([107, 101, 121]), "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")))])), $.arrayToSlice<any>([$.interfaceValue(value, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))]))
			if (err != null) {
				$.panic((err as any))
			}
		}
		await $.println(direct, value.value)
		{
			let err = await (db !== null && (db as any).__isVarRef !== true && (db as any).__goValue === undefined ? ((db as any) as sql.DB).Close() : sql.DB.prototype.Close.call(db))
			if (err != null) {
				$.panic((err as any))
			}
		}
	}
	let value = $.varRef(0)
	{
		let err = await sql.ConvertAssign($.markAsStructValue(new driver.ScanContext()), $.interfaceValue(value, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))), $.basicInterfaceValue(7n, "int64"))
		if (err != null) {
			$.panic((err as any))
		}
	}
	await $.println("zero context", value.value)
	let db = await sql.OpenDB($.structInterfaceValue<driver.Connector | null>(new connector(true, undefined, true), "main.connector", "main.connector"))
	let data: $.VarRef<$.Slice<number>> = $.varRef(null! as $.Slice<number>)
	{
		let err = await sql.Row.prototype.Scan.call(await (db !== null && (db as any).__isVarRef !== true && (db as any).__goValue === undefined ? ((db as any) as sql.DB).QueryRow("blob", null) : sql.DB.prototype.QueryRow.call(db, "blob", null)), $.arrayToSlice<any>([$.interfaceValue(data, "*[]byte", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))]))
		if (err != null) {
			$.panic((err as any))
		}
	}
	await $.println("blob", $.bytesToString(data.value))
	let raw: $.VarRef<sql.RawBytes> = $.varRef(null! as sql.RawBytes)
	await $.println("raw rejected", await sql.Row.prototype.Scan.call(await (db !== null && (db as any).__isVarRef !== true && (db as any).__goValue === undefined ? ((db as any) as sql.DB).QueryRow("blob", null) : sql.DB.prototype.QueryRow.call(db, "blob", null)), $.arrayToSlice<any>([$.interfaceValue(raw, "*sql.RawBytes", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "sql.RawBytes")))])) != null)
	{
		let err = await (db !== null && (db as any).__isVarRef !== true && (db as any).__goValue === undefined ? ((db as any) as sql.DB).Close() : sql.DB.prototype.Close.call(db))
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

		constructor(init?: Partial<{Value?: number}>, __goscriptValue?: boolean) {
			this.Value = init?.Value ?? (0 as number)
			;(this as any)[$.structValueMarker] = __goscriptValue === true
		}

		public clone(): tagged {
			return new tagged(this, true)
		}

		public __goscriptAssign(source: tagged): this {
			this.Value = source.Value
			return this
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

		constructor(init?: Partial<{Value?: number}>, __goscriptValue?: boolean) {
			this.Value = init?.Value ?? (0 as number)
			;(this as any)[$.structValueMarker] = __goscriptValue === true
		}

		public clone(): retagged {
			return new retagged(this, true)
		}

		public __goscriptAssign(source: retagged): this {
			this.Value = source.Value
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.retagged",
			() => new retagged(),
			() => [],
			retagged,
			() => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("int"), [0], 0, true, { tag: "json:\"second\"" })]
		)
	}
	await $.println("named integer", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int", "main.namedInt"), zero: () => 0 }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic4()))!), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("boolean string", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor(__goscriptStatic6())).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic5()))!), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("byte string", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor(__goscriptStatic7())).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic5()))!), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("slice array", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor(__goscriptStatic9())).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic8()))!), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("named elements", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int", "main.namedInt")), zero: () => null }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic9()))!), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("struct tags", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.tagged", zero: () => $.markAsStructValue(new tagged()) }})).ConvertibleTo($.pointerValueOrNil(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.retagged", zero: () => $.markAsStructValue(new retagged()) }}))!), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({LastInsertId: (receiver: any) => (driver.RowsAffected_LastInsertId as any)(($.isVarRef(receiver) ? receiver.value : receiver)), RowsAffected: (receiver: any) => (driver.RowsAffected_RowsAffected as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.basicType("int64", "driver.RowsAffected"))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ([$.methodSignature("LastInsertId", [], [/* @__PURE__ */ $.basicType("int64"), "error"]), $.methodSignature("RowsAffected", [], [/* @__PURE__ */ $.basicType("int64"), "error"])])
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ($.namedValueInterfaceValue<driver.Result | null>(0n, "driver.RowsAffected", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("bool"), zero: () => false }})
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), zero: () => null }})
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), zero: () => $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)) }})
}

var __goscriptStatic9$value: any
function __goscriptStatic9(): any {
	return __goscriptStatic9$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), zero: () => null }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
