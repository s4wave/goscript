// Generated file based on package_import_fmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as errors from "@goscript/errors/index.js"
import * as fmt from "@goscript/fmt/index.js"
import type * as io from "@goscript/io/index.js"

export type num = number

$.registerNamedValueType(
	"main.num",
	{String: (receiver: any) => (num_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.num",
	{String: (receiver: any) => (num_String as any)($.pointerValue(receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export class byteFormatter {
	public declare prefix: $.Slice<number>

	constructor(__goscriptValue?: boolean, prefix$?: $.Slice<number>) {
		this.prefix = prefix$ ?? (null! as $.Slice<number>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): byteFormatter {
		return new byteFormatter(true, this.prefix)
	}

	public __goscriptAssign(source: byteFormatter): this {
		this.prefix = source.prefix
		return this
	}

	public Format(state: fmt.State | null, verb: number): void {
		const b = this;
		let buf: $.Slice<number> = $.appendSlice(new Uint8Array([]) as $.Slice<number>, b.prefix, $.byteSliceHint)
		buf = $.append(buf, $.uint($.uint(verb, 8), 8), $.byteSliceHint);
		;((state !== null && (state as any).__isVarRef !== true && ((state as any).__goValue === undefined || (state as any).__goType?.charCodeAt(0) !== 42) ? (state as Exclude<fmt.State, null>) : $.pointerValue<Exclude<fmt.State, null>>(state)).Write(buf) as [number, $.GoError])
	}

	static __typeInfo = $.registerStructType(
		"main.byteFormatter",
		() => new byteFormatter(),
		() => [{ name: "Format", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		byteFormatter,
		() => [{ name: "prefix", key: "prefix", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export class pos {
	public declare Line: number

	public declare Char: number

	constructor(__goscriptValue?: boolean, Line$?: number, Char$?: number) {
		this.Line = Line$ ?? 0
		this.Char = Char$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): pos {
		return new pos(true, this.Line, this.Char)
	}

	public __goscriptAssign(source: pos): this {
		this.Line = source.Line
		this.Char = source.Char
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pos",
		() => new pos(),
		() => [],
		pos,
		() => [{ name: "Line", key: "Line", type: /* @__PURE__ */ $.basicType("int") }, { name: "Char", key: "Char", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Test basic Print functions
	fmt.Print("Hello")
	fmt.Print(" ")
	fmt.Print("World")
	fmt.Println()

	// Test Printf with basic formatting
	let name = "Go"
	let version = 1.21
	fmt.Printf("Welcome to %s %.2f\n", name, $.basicInterfaceValue(version, "float64"))

	// Test Println
	fmt.Println("This is println")

	// Test Sprint functions
	let result = (fmt.Sprint("Sprint", " ", "result") as string)
	fmt.Println("Sprint result:", result)
	let parts = $.arrayToSlice<any>(["Spread", " ", "result"])
	let spreadResult = (fmt.Sprint(...(parts ?? [])) as string)
	fmt.Println("Sprint spread result:", spreadResult)

	// Test Sprintf
	let formatted = (fmt.Sprintf("Number: %d, String: %s", $.basicInterfaceValue(42, "int"), "test") as string)
	fmt.Println("Sprintf result:", formatted)
	let formatArgs = $.arrayToSlice<any>([$.basicInterfaceValue(7, "int"), "spread"])
	let formattedSpread = (fmt.Sprintf("Spread Number: %d, String: %s", ...(formatArgs ?? [])) as string)
	fmt.Println("Sprintf spread result:", formattedSpread)

	// Test Sprintln
	let sprintln_result = (fmt.Sprintln("Sprintln", "result") as string)
	fmt.Print("Sprintln result:", sprintln_result)

	// Test Errorf
	let err = fmt.Errorf("error code: %d", $.basicInterfaceValue(404, "int"))
	fmt.Println("Error:", (err as any))

	// Test various format verbs
	fmt.Printf("Boolean: %t\n", true)
	fmt.Printf("Integer: %d\n", $.basicInterfaceValue(123, "int"))
	fmt.Printf("Float: %f\n", $.basicInterfaceValue(3.14159, "float64"))
	fmt.Printf("String: %s\n", "hello")
	fmt.Printf("Type: %T\n", $.basicInterfaceValue(42, "int"))
	fmt.Printf("Value: %v\n", $.interfaceValue($.arrayToSlice<number>([1, 2, 3]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))))

	// Test width and precision
	fmt.Printf("Width: '%5s'\n", "hi")
	fmt.Printf("Precision: '%.2f'\n", $.basicInterfaceValue(3.14159, "float64"))
	fmt.Printf("Both: '%5.2f'\n", $.basicInterfaceValue(3.14159, "float64"))
	fmt.Printf("Formatter: %v\n", $.structInterfaceValue(new byteFormatter(true, new Uint8Array([98, 121, 116, 101, 45])), "main.byteFormatter", "main.byteFormatter"))
	let bs = new Uint8Array([97, 98, 34, 99])
	fmt.Printf("Bytes: %s %q %x %X %v\n", $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))
	fmt.Printf("String hex: %x %X\n", "hi", "hi")
	fmt.Printf("Hex flags: % x %#x %# x %#v\n", $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(bs, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))
	let sub = $.goSlice(bs, 1, 3)
	fmt.Printf("Sliced bytes: %s %q %x %X %v\n", $.interfaceValue(sub, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(sub, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(sub, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(sub, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(sub, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))
	let grown = $.append($.makeSlice<number>(0, 2, "byte"), $.uint(0xde, 8), $.uint(0xad, 8), $.uint(0xbe, 8), $.uint(0xef, 8), $.byteSliceHint)
	fmt.Printf("Grown bytes: %x %X % x %v\n", $.interfaceValue(grown, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(grown, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(grown, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(grown, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))
	let arr = $.arrayValue(new Uint8Array([202, 254, 34, 65]))
	let view = $.goSlice(arr, undefined, undefined)
	fmt.Printf("Array bytes: %s %q %x %X %x %v\n", $.interfaceValue(view, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(view, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(view, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(view, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue($.cloneArrayValue(arr, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4)), "[4]byte", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4)), $.interfaceValue($.cloneArrayValue(arr, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4)), "[4]byte", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4)))
	let none: $.Slice<number> = null! as $.Slice<number>
	fmt.Printf("Nil bytes: [%s] %q [%x] %v\n", $.interfaceValue(none, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(none, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(none, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(none, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))
	fmt.Printf("Quoted: %q %+q %#q %q %+q\n", "tab\there", "\xc3\xa9", "raw", $.basicInterfaceValue(120, "rune", "int32"), $.basicInterfaceValue(233, "rune", "int32"))
	let seq = 255n
	fmt.Printf("Uint64: %d %x %v\n", $.basicInterfaceValue(seq, "uint64"), $.basicInterfaceValue(seq, "uint64"), $.basicInterfaceValue(seq, "uint64"))
	let appended = (fmt.Append(new Uint8Array([98, 97, 115, 101, 45]), "tail") as $.Slice<number>)
	fmt.Println("Append bytes:", $.bytesToString(appended))
	let buf = $.varRef($.markAsStructValue(new bytes.Buffer()))
	fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer", __goscriptStatic0()))!, "Buffered writer")
	fmt.Print(buf.value.String())

	starWidthPrecision()
	sliceVerbs()
	scanVerbs()

	await $.println("test finished")
}

export function num_String(f: num): string {
	return (fmt.Sprintf("%.*g", $.basicInterfaceValue(7, "int"), $.basicInterfaceValue(f, "float32")) as string)
}

export function sliceVerbs(): void {
	fmt.Printf("%q\n", $.interfaceValue($.arrayToSlice<string>(["a", "b c"]), "[]string", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))))
	fmt.Printf("%d %4d\n", $.interfaceValue($.arrayToSlice<number>([1, 2, 3]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))), $.interfaceValue($.arrayToSlice<number>([4, 5]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))))
	fmt.Printf("%x\n", $.interfaceValue($.arrayToSlice<number>([10, 255]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))))
	fmt.Printf("%.2f %6.1f\n", $.interfaceValue($.typedSliceOf(Float64Array, [1.5, 2.25]) as $.Slice<number>, "[]float64", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float64"))), $.interfaceValue($.typedSliceOf(Float64Array, [3.25]) as $.Slice<number>, "[]float64", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float64"))))
	fmt.Printf("%t\n", $.interfaceValue($.arrayToSlice<boolean>([true, false]), "[]bool", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("bool"))))
	fmt.Printf("%q\n", $.interfaceValue($.arrayValue(["x", "y"]), "[2]string", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 2)))
	fmt.Printf("%q %x\n", $.interfaceValue(new Uint8Array([104, 105]), "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(new Uint8Array([104, 105]), "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))
	fmt.Printf("%s %q\n", $.interfaceValue($.arrayToSlice<string>(["a", "b"]), "[]string", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))), $.interfaceValue($.arrayToSlice<string>([]), "[]string", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))))
}

export function starWidthPrecision(): void {
	fmt.Println((fmt.Sprintf("[%.*f]", $.basicInterfaceValue(3, "int"), $.basicInterfaceValue(3.14159, "float64")) as string))
	fmt.Println((fmt.Sprintf("[%*d]", $.basicInterfaceValue(5, "int"), $.basicInterfaceValue(42, "int")) as string))
	fmt.Println((fmt.Sprintf("[%*d]", $.basicInterfaceValue(-5, "int"), $.basicInterfaceValue(42, "int")) as string))
	fmt.Println((fmt.Sprintf("[%*.*f]", $.basicInterfaceValue(8, "int"), $.basicInterfaceValue(2, "int"), $.basicInterfaceValue(3.14159, "float64")) as string))
	fmt.Println((fmt.Sprintf("[%.*g]", $.basicInterfaceValue(7, "int"), $.basicInterfaceValue(13.333333015441895, "float32")) as string))
	fmt.Println((fmt.Sprintf("[%.*d] [%s]", $.basicInterfaceValue(-1, "int"), $.basicInterfaceValue(5, "int"), "after") as string))
	fmt.Println((fmt.Sprintf("[%v]", __goscriptStatic4()) as string))
	fmt.Println((fmt.Sprintf("[%.*d]", "x", $.basicInterfaceValue(5, "int")) as string))
	let err = fmt.Errorf("%*s: %w", $.basicInterfaceValue(6, "int"), "ctx", (errors.New("base") as any))
	fmt.Println((err as any), errors.Unwrap($.pointerValueOrNil(err)!) != null)
}

export function scanVerbs(): void {
	let f32 = $.varRef(0)
	let [n, err] = fmt.Sscanf("1.0", "%g", $.interfaceValue(f32, "*float32", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("float32"))))
	fmt.Println("g float32:", $.basicInterfaceValue(n, "int"), err == null, $.basicInterfaceValue(f32.value, "float32"))

	let f64 = $.varRef(0)
	let __goscriptTuple0: any = fmt.Sscanf(" 2.5e1 rest", "%f", $.interfaceValue(f64, "*float64", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("float64"))))
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	fmt.Println("f float64:", $.basicInterfaceValue(n, "int"), err == null, $.basicInterfaceValue(f64.value, "float64"))

	let i64 = $.varRef(0n)
	let u8 = $.varRef(0)
	let __goscriptTuple1: any = fmt.Sscanf("-42,200", "%d,%d", $.interfaceValue(i64, "*int64", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int64"))), $.interfaceValue(u8, "*uint8", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint8"))))
	n = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	fmt.Println("d int64 uint8:", $.basicInterfaceValue(n, "int"), err == null, $.basicInterfaceValue(i64.value, "int64"), $.basicInterfaceValue(u8.value, "uint8"))

	let r = $.varRef(0)
	let g = $.varRef(0)
	let b = $.varRef(0)
	let __goscriptTuple2: any = fmt.Sscanf("ff8000", "%02x%02x%02x", $.interfaceValue(r, "*uint8", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(g, "*uint8", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(b, "*uint8", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint8"))))
	n = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	fmt.Println("02x:", $.basicInterfaceValue(n, "int"), err == null, $.basicInterfaceValue(r.value, "uint8"), $.basicInterfaceValue(g.value, "uint8"), $.basicInterfaceValue(b.value, "uint8"))
	let __goscriptTuple3: any = fmt.Sscanf("f80", "%1x%1x%1x", $.interfaceValue(r, "*uint8", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(g, "*uint8", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint8"))), $.interfaceValue(b, "*uint8", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint8"))))
	n = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	fmt.Println("1x:", $.basicInterfaceValue(n, "int"), err == null, $.basicInterfaceValue(r.value, "uint8"), $.basicInterfaceValue(g.value, "uint8"), $.basicInterfaceValue(b.value, "uint8"))

	let p: pos = new pos(true)
	let __goscriptTuple4: any = fmt.Sscanf("L12C3", "L%dC%d", $.interfaceValue($.fieldRef(p, "Line"), "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))), $.interfaceValue($.fieldRef(p, "Char"), "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))))
	n = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	fmt.Println("struct fields:", $.basicInterfaceValue(n, "int"), err == null, $.basicInterfaceValue(p.Line, "int"), $.basicInterfaceValue(p.Char, "int"))

	let s = $.varRef("")
	let v = $.varRef(0)
	let __goscriptTuple5: any = fmt.Sscanf("name 7", "%s %v", $.interfaceValue(s, "*string", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("string"))), $.interfaceValue(v, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))))
	n = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	fmt.Println("s v:", $.basicInterfaceValue(n, "int"), err == null, s.value, $.basicInterfaceValue(v.value, "int"))

	let bl = $.varRef(false)
	let __goscriptTuple6: any = fmt.Sscanf("true", "%t", $.interfaceValue(bl, "*bool", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("bool"))))
	n = __goscriptTuple6[0]
	err = __goscriptTuple6[1]
	fmt.Println("t:", $.basicInterfaceValue(n, "int"), err == null, bl.value)

	let __goscriptTuple7: any = fmt.Sscanf("abc", "%d", $.interfaceValue(v, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))))
	n = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	fmt.Println("bad int:", $.basicInterfaceValue(n, "int"), err != null)

	let __goscriptTuple8: any = fmt.Sscanf("12", "%d %d", $.interfaceValue(v, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))), $.interfaceValue(i64, "*int64", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int64"))))
	n = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	fmt.Println("short:", $.basicInterfaceValue(n, "int"), err != null, $.basicInterfaceValue(v.value, "int"))

	let a = $.varRef(0)
	let c = $.varRef(0)
	let word = $.varRef("")
	let __goscriptTuple9: any = fmt.Sscan("3  4\n hello", $.interfaceValue(a, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))), $.interfaceValue(c, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))), $.interfaceValue(word, "*string", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("string"))))
	n = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	fmt.Println("Sscan:", $.basicInterfaceValue(n, "int"), err == null, $.basicInterfaceValue(a.value, "int"), $.basicInterfaceValue(c.value, "int"), word.value)
	let fl = $.varRef(0)
	let __goscriptTuple10: any = fmt.Sscan("1.25", $.interfaceValue(fl, "*float64", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("float64"))))
	n = __goscriptTuple10[0]
	err = __goscriptTuple10[1]
	fmt.Println("Sscan float:", $.basicInterfaceValue(n, "int"), err == null, $.basicInterfaceValue(fl.value, "float64"))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Buffer"), "bytes.Buffer", () => [$.methodSignature("Available", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("AvailableBuffer", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Next", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Peek", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadBytes", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]], true), $.methodSignature("ReadFrom", [["r", "io.Reader"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true), $.methodSignature("ReadRune", [], [["r", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadString", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.basicType("string")], ["err", "error"]], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Truncate", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({String: (receiver: any) => (num_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.basicType("float32", "main.num"))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ($.namedValueInterfaceValue<any>(6.666666507720947, "main.num", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()))
}

if ($.isMainScript(import.meta)) {
	await main()
}
