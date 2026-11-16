// Generated file based on package_import_fmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as errors from "@goscript/errors/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as reflect from "@goscript/reflect/index.js"
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
		;(this as any).__goStructValue = __goscriptValue === true
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
		() => [$.methodSignature("Format", [["state", "fmt.State"], ["verb", /* @__PURE__ */ $.basicType("int32")]])],
		byteFormatter,
		() => [/* @__PURE__ */ $.structField("prefix", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_fmt" })]
	)
}

export class pos {
	public declare Line: number

	public declare Char: number

	constructor(__goscriptValue?: boolean, Line$?: number, Char$?: number) {
		this.Line = Line$ ?? 0
		this.Char = Char$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
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
		() => [/* @__PURE__ */ $.structField("Line", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Char", /* @__PURE__ */ $.basicType("int"), [1], 8, true)]
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

	// A reflect.Value operand formats as the value it holds.
	class pt {
		public declare X: number

		public declare Y: number

		constructor(init?: Partial<{X?: number, Y?: number}>, __goscriptValue?: boolean) {
			this.X = init?.X ?? (0 as number)
			this.Y = init?.Y ?? (0 as number)
			;(this as any).__goStructValue = __goscriptValue === true
		}

		public clone(): pt {
			return new pt(this, true)
		}

		public __goscriptAssign(source: pt): this {
			this.X = source.X
			this.Y = source.Y
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.pt",
			() => new pt(),
			() => [],
			pt,
			() => [/* @__PURE__ */ $.structField("X", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Y", /* @__PURE__ */ $.basicType("int"), [1], 8, true)]
		)
	}
	let rv = reflect.ValueOf($.basicInterfaceValue(5, "int"))
	fmt.Printf("reflect: %v %d %s %+v\n", $.structInterfaceValue(rv, "reflect.Value", __goscriptStatic1()), $.structInterfaceValue(rv, "reflect.Value", __goscriptStatic1()), $.structInterfaceValue(reflect.ValueOf("hi"), "reflect.Value", __goscriptStatic1()), $.structInterfaceValue(reflect.ValueOf($.structInterfaceValue($.markAsStructValue(new pt({X: 1, Y: 2})), "main.pt", "main.pt")), "reflect.Value", __goscriptStatic1()))
	fmt.Println("reflect:", $.structInterfaceValue(rv, "reflect.Value", __goscriptStatic1()), $.structInterfaceValue(reflect.ValueOf($.interfaceValue($.arrayToSlice<number>([1, 2]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")))), "reflect.Value", __goscriptStatic1()), $.structInterfaceValue($.markAsStructValue(new reflect.Value()), "reflect.Value", __goscriptStatic1()))

	await $.println("test finished")
}

export function num_String(f: num): string {
	return (fmt.Sprintf("%.*g", $.basicInterfaceValue(7, "int"), $.basicInterfaceValue(f, "float32")) as string)
}

export function sliceVerbs(): void {
	fmt.Printf("%q\n", $.interfaceValue($.arrayToSlice<string>(["a", "b c"]), "[]string", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))))
	fmt.Printf("%d %4d\n", $.interfaceValue($.arrayToSlice<number>([1, 2, 3]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))), $.interfaceValue($.arrayToSlice<number>([4, 5]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))))
	fmt.Printf("%x\n", $.interfaceValue($.arrayToSlice<number>([10, 255]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))))
	fmt.Printf("%.2f %6.1f\n", $.interfaceValue(($.typedSliceOf(Float64Array, [1.5, 2.25]) as $.Slice<number>), "[]float64", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float64"))), $.interfaceValue(($.typedSliceOf(Float64Array, [3.25]) as $.Slice<number>), "[]float64", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float64"))))
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
	fmt.Println((fmt.Sprintf("[%v]", __goscriptStatic5()) as string))
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
	return __goscriptStatic1$value ??= ($.overrideTypeMethods("reflect.Value", "reflect.Value", () => [$.methodSignature("Addr", [], ["reflect.Value"]), $.methodSignature("Bool", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("Call", [["in", /* @__PURE__ */ $.sliceType("reflect.Value")]], [/* @__PURE__ */ $.sliceType("reflect.Value")]), $.methodSignature("CallSlice", [["in", /* @__PURE__ */ $.sliceType("reflect.Value")]], [/* @__PURE__ */ $.sliceType("reflect.Value")]), $.methodSignature("CanAddr", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanComplex", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanConvert", [["t", "reflect.Type"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanFloat", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanInt", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanInterface", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanSet", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanUint", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Clear"), $.methodSignature("Close"), $.methodSignature("Comparable", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Complex", [], [/* @__PURE__ */ $.basicType("complex128")]), $.methodSignature("Convert", [["t", "reflect.Type"]], ["reflect.Value"]), $.methodSignature("Elem", [], ["reflect.Value"]), $.methodSignature("Equal", [["u", "reflect.Value"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Field", [["i", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("FieldByIndex", [["index", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]], ["reflect.Value"]), $.methodSignature("FieldByIndexErr", [["index", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]], ["reflect.Value", "error"]), $.methodSignature("FieldByName", [["name", /* @__PURE__ */ $.basicType("string")]], ["reflect.Value"]), $.methodSignature("FieldByNameFunc", [["match", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)]], ["reflect.Value"]), $.methodSignature("Fields", [], [({ kind: $.TypeKind.Function, name: "iter.Seq2", params: [({ kind: $.TypeKind.Function, params: ["reflect.StructField", "reflect.Value"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)]), $.methodSignature("Float", [], [/* @__PURE__ */ $.basicType("float64")]), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("Index", [["i", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("Int", [], [/* @__PURE__ */ $.basicType("int64")]), $.methodSignature("Interface", [], [["i", { kind: $.TypeKind.Interface, methods: [] }]]), $.methodSignature("InterfaceData", [], [/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uintptr"), 2)]), $.methodSignature("IsNil", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("IsValid", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("IsZero", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")]), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("MapIndex", [["key", "reflect.Value"]], ["reflect.Value"]), $.methodSignature("MapKeys", [], [/* @__PURE__ */ $.sliceType("reflect.Value")]), $.methodSignature("MapRange", [], [/* @__PURE__ */ $.pointerType("reflect.MapIter")]), $.methodSignature("Method", [["i", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("MethodByName", [["name", /* @__PURE__ */ $.basicType("string")]], ["reflect.Value"]), $.methodSignature("Methods", [], [({ kind: $.TypeKind.Function, name: "iter.Seq2", params: [({ kind: $.TypeKind.Function, params: ["reflect.Method", "reflect.Value"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)]), $.methodSignature("NumField", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("NumMethod", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("OverflowComplex", [["x", /* @__PURE__ */ $.basicType("complex128")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("OverflowFloat", [["x", /* @__PURE__ */ $.basicType("float64")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("OverflowInt", [["x", /* @__PURE__ */ $.basicType("int64")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("OverflowUint", [["x", /* @__PURE__ */ $.basicType("uint64")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Pointer", [], [/* @__PURE__ */ $.basicType("uintptr")]), $.methodSignature("Recv", [], [["x", "reflect.Value"], ["ok", /* @__PURE__ */ $.basicType("bool")]]), $.methodSignature("Send", [["x", "reflect.Value"]]), $.methodSignature("Seq", [], [({ kind: $.TypeKind.Function, name: "iter.Seq", params: [({ kind: $.TypeKind.Function, params: ["reflect.Value"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)]), $.methodSignature("Seq2", [], [({ kind: $.TypeKind.Function, name: "iter.Seq2", params: [({ kind: $.TypeKind.Function, params: ["reflect.Value", "reflect.Value"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)]), $.methodSignature("Set", [["x", "reflect.Value"]]), $.methodSignature("SetBool", [["x", /* @__PURE__ */ $.basicType("bool")]]), $.methodSignature("SetBytes", [["x", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]]), $.methodSignature("SetCap", [["n", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("SetComplex", [["x", /* @__PURE__ */ $.basicType("complex128")]]), $.methodSignature("SetFloat", [["x", /* @__PURE__ */ $.basicType("float64")]]), $.methodSignature("SetInt", [["x", /* @__PURE__ */ $.basicType("int64")]]), $.methodSignature("SetIterKey", [["iter", /* @__PURE__ */ $.pointerType("reflect.MapIter")]]), $.methodSignature("SetIterValue", [["iter", /* @__PURE__ */ $.pointerType("reflect.MapIter")]]), $.methodSignature("SetLen", [["n", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("SetMapIndex", [["key", "reflect.Value"], ["elem", "reflect.Value"]]), $.methodSignature("SetPointer", [["x", /* @__PURE__ */ $.basicType("unknown")]]), $.methodSignature("SetString", [["x", /* @__PURE__ */ $.basicType("string")]]), $.methodSignature("SetUint", [["x", /* @__PURE__ */ $.basicType("uint64")]]), $.methodSignature("SetZero"), $.methodSignature("Slice", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("Slice3", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")], ["k", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("TryRecv", [], [["x", "reflect.Value"], ["ok", /* @__PURE__ */ $.basicType("bool")]]), $.methodSignature("TrySend", [["x", "reflect.Value"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Type", [], ["reflect.Type"]), $.methodSignature("Uint", [], [/* @__PURE__ */ $.basicType("uint64")]), $.methodSignature("UnsafeAddr", [], [/* @__PURE__ */ $.basicType("uintptr")]), $.methodSignature("UnsafePointer", [], [/* @__PURE__ */ $.basicType("unknown")])]))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({String: (receiver: any) => (num_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= (/* @__PURE__ */ $.basicType("float32", "main.num"))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ([$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ($.namedValueInterfaceValue<any>(6.666666507720947, "main.num", __goscriptStatic2(), __goscriptStatic3(), __goscriptStatic4()))
}

if ($.isMainScript(import.meta)) {
	await main()
}
