// Generated file based on fmt_struct_values.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as strings from "@goscript/strings/index.js"

import * as logrus from "@goscript/github.com/sirupsen/logrus/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/fmt/index.js"
import "@goscript/strings/index.js"
import "@goscript/github.com/sirupsen/logrus/index.js"

export class Inner {
	// Ready is included even when it is false.
	public declare Ready: boolean

	public _fields: {
		Ready: boolean
	}

	constructor(init?: Partial<{Ready?: boolean}>) {
		this._fields = {
			Ready: init?.Ready ?? (false as boolean)
		}
	}

	public clone(): Inner {
		return $.markAsStructValue(new Inner(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Ready"])
	}

	static __typeInfo = $.registerStructType(
		"main.Inner",
		() => new Inner(),
		() => [],
		Inner,
		() => [/* @__PURE__ */ $.structField("Ready", /* @__PURE__ */ $.basicType("bool"), [0], 0, true)]
	)
}

export class Record {
	// Count is the numeric field.
	public declare Count: number

	// name is visible to formatting despite being unexported.
	public declare name: string

	// Inner is a nested value.
	public declare Inner: Inner

	public _fields: {
		Count: number
		name: string
		Inner: Inner
	}

	constructor(init?: Partial<{Count?: number, name?: string, Inner?: Inner}>) {
		this._fields = {
			Count: init?.Count ?? (0 as number),
			name: init?.name ?? ("" as string),
			Inner: init?.Inner ? $.markAsStructValue($.cloneStructValue(init.Inner)) : $.markAsStructValue(new Inner())
		}
	}

	public clone(): Record {
		return $.markAsStructValue(new Record(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Count", "name", "Inner"])
	}

	static __typeInfo = $.registerStructType(
		"main.Record",
		() => new Record(),
		() => [],
		Record,
		() => [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("name", /* @__PURE__ */ $.basicType("string"), [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/fmt_struct_values" }), /* @__PURE__ */ $.structField("Inner", "main.Inner", [2], 24, true)]
	)
}

export class Pointers {
	// Value points to a scalar, which formats as an address.
	public declare Value: $.VarRef<number> | null

	// Next can point back to this record.
	public declare Next: Pointers | $.VarRef<Pointers> | null

	// Dynamic holds a pointer behind an interface.
	public declare Dynamic: any

	public _fields: {
		Value: $.VarRef<number> | null
		Next: Pointers | $.VarRef<Pointers> | null
		Dynamic: any
	}

	constructor(init?: Partial<{Value?: $.VarRef<number> | null, Next?: Pointers | $.VarRef<Pointers> | null, Dynamic?: any}>) {
		this._fields = {
			Value: init?.Value ?? (null! as $.VarRef<number> | null),
			Next: init?.Next ?? (null! as Pointers | $.VarRef<Pointers> | null),
			Dynamic: init?.Dynamic ?? (null! as any)
		}
	}

	public clone(): Pointers {
		return $.markAsStructValue(new Pointers(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value", "Next", "Dynamic"])
	}

	static __typeInfo = $.registerStructType(
		"main.Pointers",
		() => new Pointers(),
		() => [],
		Pointers,
		() => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")), [0], 0, true), /* @__PURE__ */ $.structField("Next", /* @__PURE__ */ $.pointerType("main.Pointers"), [1], 8, true), /* @__PURE__ */ $.structField("Dynamic", { kind: $.TypeKind.Interface, methods: [] }, [2], 16, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	let value = $.varRef($.markAsStructValue(new Record({Count: 3, name: "hello", Inner: $.markAsStructValue(new Inner({Ready: true}))})))
	await $.println(await fmt.Sprintf("%v", $.interfaceValue($.markAsStructValue($.cloneStructValue(value.value)), "main.Record", "main.Record")))
	await $.println(await fmt.Sprintf("%+v", $.interfaceValue($.markAsStructValue($.cloneStructValue(value.value)), "main.Record", "main.Record")))
	await $.println(await fmt.Sprintf("%v", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))))
	await $.println(await fmt.Sprintf("%+v", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))))
	await $.println(await fmt.Sprint($.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))))
	await $.println(await fmt.Sprintf("%#v", $.interfaceValue($.markAsStructValue($.cloneStructValue(value.value)), "main.Record", "main.Record")))
	await $.println(await fmt.Sprintf("%#v", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))))

	let anonymous = $.varRef({Count: 4})
	await $.println(await fmt.Sprintf("%v", anonymous.value))
	await $.println(await fmt.Sprintf("%+v", anonymous.value))
	await $.println(await fmt.Sprintf("%v", $.interfaceValue(anonymous, "*struct{Count int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true)] }))))
	await $.println(await fmt.Sprintf("%+v", $.interfaceValue(anonymous, "*struct{Count int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true)] }))))

	// Addresses differ across runtimes; their identity and surrounding text agree.
	let count = $.varRef(7)
	let pointers = $.varRef($.markAsStructValue(new Pointers({Value: count})))
	pointers.value.Next = pointers
	pointers.value.Dynamic = $.interfaceValue(pointers, "*main.Pointers", /* @__PURE__ */ $.pointerType("main.Pointers"))
	let text = await fmt.Sprintf("%+v", $.interfaceValue(pointers, "*main.Pointers", /* @__PURE__ */ $.pointerType("main.Pointers")))
	text = strings.ReplaceAll(text, await fmt.Sprintf("%p", $.interfaceValue(count, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))), "<scalar>")
	text = strings.ReplaceAll(text, await fmt.Sprintf("%p", $.interfaceValue(pointers, "*main.Pointers", /* @__PURE__ */ $.pointerType("main.Pointers"))), "<self>")
	await $.println(text)

	// Exercise the same log field formatting used by controller shutdown warnings.
	let output: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let logger: logrus.Logger | $.VarRef<logrus.Logger> | null = logrus.New()
	await logrus.Logger.prototype.SetOutput.call(logger, $.interfaceValue<io.Writer | null>(output, "*bytes.Buffer", /* @__PURE__ */ $.pointerType("bytes.Buffer")))
	await logrus.Logger.prototype.SetFormatter.call(logger, $.interfaceValue<logrus.Formatter | null>(new logrus.TextFormatter({DisableColors: true, DisableTimestamp: true}), "*logrus.TextFormatter", /* @__PURE__ */ $.pointerType("logrus.TextFormatter")))
	await logrus.Entry.prototype.Warn.call(await logrus.Logger.prototype.WithField.call(logger, "controller", $.interfaceValue(value, "*main.Record", /* @__PURE__ */ $.pointerType("main.Record"))), $.arrayToSlice<any>(["waiting for controller Execute to return"]))
	await $.println(strings.TrimSpace(output.value.String()))
}

if ($.isMainScript(import.meta)) {
	await main()
}
