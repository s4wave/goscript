// Generated file based on fmt_print_operands.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as io from "@goscript/io/index.js"
import * as strings from "@goscript/strings/index.js"
import "@goscript/io/index.js"

export type celsius = number

$.registerNamedValueType(
	"main.celsius",
	{String: (receiver: any) => (celsius_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.celsius",
	{String: (receiver: any) => (celsius_String as any)($.pointerValue(receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export class slowName {
	public declare ch: $.Channel<string> | null

	constructor(__goscriptValue?: boolean, ch$?: $.Channel<string> | null) {
		this.ch = ch$ ?? (null! as $.Channel<string> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): slowName {
		return new slowName(true, this.ch)
	}

	public __goscriptAssign(source: slowName): this {
		this.ch = source.ch
		return this
	}

	public async String(): globalThis.Promise<string> {
		const s = this;
		await $.chanSend(s.ch, "slow")
		return await $.chanRecv(s.ch)
	}

	static __typeInfo = $.registerStructType(
		"main.slowName",
		() => new slowName(),
		() => [{ name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		slowName,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("string"), "both") }]
	)
}

export class reading {
	public declare Name: slowName

	public declare Value: number

	constructor(__goscriptValue?: boolean, Name$?: slowName, Value$?: number) {
		this.Name = Name$ ?? new slowName(true)
		this.Value = Value$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): reading {
		return new reading(true, this.Name.clone(), this.Value)
	}

	public __goscriptAssign(source: reading): this {
		this.Name.__goscriptAssign(source.Name)
		this.Value = source.Value
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.reading",
		() => new reading(),
		() => [],
		reading,
		() => [{ name: "Name", key: "Name", type: "main.slowName" }, { name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class tag {
	public declare name: string

	constructor(__goscriptValue?: boolean, name$?: string) {
		this.name = name$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): tag {
		return new tag(true, this.name)
	}

	public __goscriptAssign(source: tag): this {
		this.name = source.name
		return this
	}

	public String(): string {
		const t = this;
		return "#" + t.name
	}

	static __typeInfo = $.registerStructType(
		"main.tag",
		() => new tag(),
		() => [{ name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		tag,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class plain {
	public declare Tag: tag

	public declare Count: number

	public declare Tags: $.Slice<string>

	constructor(__goscriptValue?: boolean, Tag$?: tag, Count$?: number, Tags$?: $.Slice<string>) {
		this.Tag = Tag$ ?? new tag(true)
		this.Count = Count$ ?? 0
		this.Tags = Tags$ ?? (null! as $.Slice<string>)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): plain {
		return new plain(true, this.Tag.clone(), this.Count, this.Tags)
	}

	public __goscriptAssign(source: plain): this {
		this.Tag.__goscriptAssign(source.Tag)
		this.Count = source.Count
		this.Tags = source.Tags
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.plain",
		() => new plain(),
		() => [],
		plain,
		() => [{ name: "Tag", key: "Tag", type: "main.tag" }, { name: "Count", key: "Count", type: /* @__PURE__ */ $.basicType("int") }, { name: "Tags", key: "Tags", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")) }]
	)
}

export class codeError {
	public declare code: number

	constructor(__goscriptValue?: boolean, code$?: number) {
		this.code = code$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): codeError {
		return new codeError(true, this.code)
	}

	public __goscriptAssign(source: codeError): this {
		this.code = source.code
		return this
	}

	public Error(): string {
		const e: codeError | $.VarRef<codeError> | null = this;
		return (fmt.Sprintf("code %d", $.basicInterfaceValue($.pointerValue<codeError>(e).code, "int")) as string)
	}

	static __typeInfo = $.registerStructType(
		"main.codeError",
		() => new codeError(),
		() => [{ name: "Error", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		codeError,
		() => [{ name: "code", key: "code", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function celsius_String(c: celsius): string {
	return (fmt.Sprintf("%.1fC", $.basicInterfaceValue(c, "float64")) as string)
}

export function basics(n: number, s: string, f: number): string {
	return (fmt.Sprintf("%d %s %.2f", $.basicInterfaceValue(n, "int"), s, $.basicInterfaceValue(f, "float64")) as string)
}

export function temps(c: celsius, p: plain): string {
	return (fmt.Sprint($.namedValueInterfaceValue<any>(c, "main.celsius", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), " ", $.structInterfaceValue((p).clone(), "main.plain", "main.plain")) as string)
}

export async function slow(s: slowName): globalThis.Promise<string> {
	return fmt.Sprintf("<%v>", $.structInterfaceValue((s).clone(), "main.slowName", "main.slowName"))
}

export async function nested(r: reading): globalThis.Promise<string> {
	return fmt.Sprintf("%v", $.structInterfaceValue((r).clone(), "main.reading", "main.reading"))
}

export async function anything(v: any): globalThis.Promise<string> {
	return fmt.Sprint(v)
}

export async function wrap(err: $.GoError): globalThis.Promise<string> {
	return fmt.Sprintf("failed: %v", (err as any))
}

export function build(c: celsius): string {
	let b = $.varRef($.markAsStructValue(new strings.Builder()))
	fmt.Fprintf($.pointerValueOrNil($.interfaceValue<io.Writer | null>(b, "*strings.Builder", __goscriptStatic3()))!, "[%v]", $.namedValueInterfaceValue<any>(c, "main.celsius", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()))
	fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(b, "*strings.Builder", __goscriptStatic3()))!, "done")
	return b.value.String()
}

export async function write(w: io.Writer | null, c: celsius): globalThis.Promise<void> {
	await fmt.Fprintf($.pointerValueOrNil(w)!, "(%v)\n", $.namedValueInterfaceValue<any>(c, "main.celsius", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()))
}

export async function main(): globalThis.Promise<void> {
	await $.println(basics(1, "a", 2.5))
	await $.println(temps(21.5, new plain(true, new tag(true, "t"), 2, $.arrayToSlice<string>(["x"]))))
	await $.println(await slow(new slowName(true, $.makeChannel<string>(1, "", "both"))))
	await $.println(await nested(new reading(true, new slowName(true, $.makeChannel<string>(1, "", "both")), 4)))
	await $.println(await anything(__goscriptStatic4()))
	await $.println(await anything($.structInterfaceValue(new slowName(true, $.makeChannel<string>(1, "", "both")), "main.slowName", "main.slowName")))
	await $.println(await wrap($.interfaceValue<$.GoError>(new codeError(false, 7), "*main.codeError", /* @__PURE__ */ $.pointerType("main.codeError"))))
	await $.print(build(5))
	let b = $.varRef($.markAsStructValue(new strings.Builder()))
	await write($.interfaceValue<io.Writer | null>(b, "*strings.Builder", __goscriptStatic3()), 6)
	await $.print(b.value.String())

	// The builtin print writes its operands with nothing between them, and
	// println separates them with spaces.
	await $.print("print: ", 1, 2, "\n")
	await $.println("println:", 1, 2)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({String: (receiver: any) => (celsius_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.basicType("float64", "main.celsius"))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ([$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("strings.Builder"), "strings.Builder", () => [$.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("int"), "error"], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [/* @__PURE__ */ $.basicType("int"), "error"], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("int"), "error"], true)]))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ($.namedValueInterfaceValue<any>(1, "main.celsius", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()))
}

if ($.isMainScript(import.meta)) {
	await main()
}
