// Generated file based on json_stream.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bufio from "@goscript/bufio/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as io from "@goscript/io/index.js"
import * as strings from "@goscript/strings/index.js"
import "@goscript/io/index.js"

export class chanReader {
	public declare ch: $.Channel<string> | null

	public declare cur: string

	constructor(__goscriptValue?: boolean, ch$?: $.Channel<string> | null, cur$?: string) {
		this.ch = ch$ ?? (null! as $.Channel<string> | null)
		this.cur = cur$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): chanReader {
		return new chanReader(true, this.ch, this.cur)
	}

	public __goscriptAssign(source: chanReader): this {
		this.ch = source.ch
		this.cur = source.cur
		return this
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: chanReader | $.VarRef<chanReader> | null = this;
		const r$: chanReader = r == null ? $.pointerTarget<chanReader>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<chanReader>(r)
		if ($.stringEqual((r$ as chanReader).cur, "")) {
			let __goscriptRecv0 = await $.chanRecvWithOk((r$ as chanReader).ch)
			let s: string = __goscriptRecv0.value
			let ok: boolean = __goscriptRecv0.ok
			if (!ok) {
				return [0, io.EOF]
			}
			;(r$ as chanReader).cur = s
		}
		let n = $.copy(p, (r$ as chanReader).cur);
		;(r$ as chanReader).cur = $.sliceStringOrBytes((r$ as chanReader).cur, n, undefined)
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.chanReader",
		() => new chanReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }],
		chanReader,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("string"), "both") }, { name: "cur", key: "cur", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class item {
	public declare A: string

	public declare B: number

	constructor(__goscriptValue?: boolean, A$?: string, B$?: number) {
		this.A = A$ ?? ""
		this.B = B$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): item {
		return new item(true, this.A, this.B)
	}

	public __goscriptAssign(source: item): this {
		this.A = source.A
		this.B = source.B
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [],
		item,
		() => [{ name: "A", key: "A", type: /* @__PURE__ */ $.basicType("string") }, { name: "B", key: "B", type: /* @__PURE__ */ $.basicType("float64") }]
	)
}

export async function newChanReader(chunks: $.Slice<string>): globalThis.Promise<chanReader | $.VarRef<chanReader> | null> {
	let r = new chanReader(false, $.makeChannel<string>(0, "", "both"))
	let r$: chanReader = r == null ? $.pointerTarget<chanReader>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<chanReader>(r)
	$.go(async () => {
		for (let __goscriptRangeTarget0 = chunks, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
			let c = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as string)
			await $.chanSend((r$ as chanReader).ch, c)
		}
		void (r$ as chanReader).ch!.close()
	})
	return r
}

export async function printTokens(dec: json.Decoder | $.VarRef<json.Decoder> | null): globalThis.Promise<void> {
	while (true) {
		let [tok, err] = await (dec !== null && (dec as any).__isVarRef !== true && (dec as any).__goValue === undefined ? ((dec as any) as json.Decoder).Token() : json.Decoder.prototype.Token.call($.pointerValue<json.Decoder>(dec)))
		if (err != null) {
			fmt.Println("token end:", $.comparableEqual(err, io.EOF))
			return
		}
		{
			const __goscriptTypeSwitchValue = tok
			switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic0())) {
				case 0:
					{
						let t: json.Delim = $.typeAssert<json.Delim>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int32", "json.Delim")).value
						fmt.Println("delim", json.Delim_String(t), await (dec !== null && (dec as any).__isVarRef !== true && (dec as any).__goValue === undefined ? ((dec as any) as json.Decoder).More() : json.Decoder.prototype.More.call($.pointerValue<json.Decoder>(dec))))
					}
					break
				case 1:
					{
						let t: string = $.typeAssert<string>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string")).value
						fmt.Println("string", t)
					}
					break
				case 2:
					{
						let t: number = $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("float64")).value
						fmt.Println("number", $.basicInterfaceValue(t, "float64"))
					}
					break
				case 3:
					{
						let t: json.Number = $.typeAssert<json.Number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string", "json.Number")).value
						let [f, ] = json.Number_Float64(t)
						fmt.Println("json.Number", json.Number_String(t), $.basicInterfaceValue(f, "float64"))
					}
					break
				case 4:
					{
						let t: boolean = $.typeAssert<boolean>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("bool")).value
						fmt.Println("bool", t)
					}
					break
			}
		}
	}
}

export async function main(): globalThis.Promise<void> {
	// Compact preserves number literal spelling.
	let c = $.varRef($.markAsStructValue(new bytes.Buffer()))
	json.Compact(c, new Uint8Array([123, 34, 110, 34, 58, 32, 49, 101, 43, 48, 48, 44, 32, 34, 98, 105, 103, 34, 58, 32, 57, 48, 48, 55, 49, 57, 57, 50, 53, 52, 55, 52, 48, 57, 57, 51, 125]))
	fmt.Println(c.value.String())

	// Indent lays out the compact form with Go spacing.
	let ind = $.varRef($.markAsStructValue(new bytes.Buffer()))
	json.Indent(ind, new Uint8Array([123, 34, 97, 34, 58, 49, 44, 34, 98, 34, 58, 91, 50, 44, 51, 93, 125]), "", "  ")
	fmt.Println(ind.value.String())

	// Decoder reads one value per call and buffers the rest of the stream.
	let dec = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("1 2 3"), "*strings.Reader", __goscriptStatic1()))!)
	let n = $.varRef(0)
	while (await (dec !== null && (dec as any).__isVarRef !== true && (dec as any).__goValue === undefined ? ((dec as any) as json.Decoder).Decode($.interfaceValue(n, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))) : json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(dec), $.interfaceValue(n, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))))) == null) {
		fmt.Println("decoded", $.basicInterfaceValue(n.value, "int"))
	}

	// UseNumber keeps the exact source literal beyond float64 precision.
	let und = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("{\"big\":9007199254740993}"), "*strings.Reader", __goscriptStatic1()))!)
	void (und !== null && (und as any).__isVarRef !== true && (und as any).__goValue === undefined ? ((und as any) as json.Decoder).UseNumber() : json.Decoder.prototype.UseNumber.call($.pointerValue<json.Decoder>(und)))
	let m: $.VarRef<globalThis.Map<string, any> | null> = $.varRef(null! as globalThis.Map<string, any> | null)
	await json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(und), $.interfaceValue(m, "*map[string]interface{}", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }))))
	fmt.Println("big", $.mapGet<string, any, any>(m.value, "big", null)[0])

	// A malformed document yields a *json.SyntaxError with the Go byte offset.
	let v: $.VarRef<any> = $.varRef(null! as any)
	let err: $.GoError = (json.Unmarshal(new Uint8Array([91, 49, 44, 93]), $.interfaceValue(v, "*interface{}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Interface, methods: [] }))) as $.GoError)
	{
		let __goscriptTuple0: any = $.typeAssertTuple<json.SyntaxError | $.VarRef<json.SyntaxError> | null>(err, /* @__PURE__ */ $.pointerType("json.SyntaxError"))
		let se: json.SyntaxError | $.VarRef<json.SyntaxError> | null = __goscriptTuple0[0]
		let ok: boolean = __goscriptTuple0[1]
		if (ok) {
			fmt.Println("offset", $.basicInterfaceValue($.pointerValue<json.SyntaxError>(se).Offset, "int64"))
		}
	}

	// Token advances the stream; More reports remaining container elements.
	let mdec = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("[10,20]"), "*strings.Reader", __goscriptStatic1()))!)
	await (mdec !== null && (mdec as any).__isVarRef !== true && (mdec as any).__goValue === undefined ? ((mdec as any) as json.Decoder).Token() : json.Decoder.prototype.Token.call($.pointerValue<json.Decoder>(mdec)))
	fmt.Println("more", await (mdec !== null && (mdec as any).__isVarRef !== true && (mdec as any).__goValue === undefined ? ((mdec as any) as json.Decoder).More() : json.Decoder.prototype.More.call($.pointerValue<json.Decoder>(mdec))))
	await (mdec !== null && (mdec as any).__isVarRef !== true && (mdec as any).__goValue === undefined ? ((mdec as any) as json.Decoder).Token() : json.Decoder.prototype.Token.call($.pointerValue<json.Decoder>(mdec)))
	await (mdec !== null && (mdec as any).__isVarRef !== true && (mdec as any).__goValue === undefined ? ((mdec as any) as json.Decoder).Token() : json.Decoder.prototype.Token.call($.pointerValue<json.Decoder>(mdec)))
	fmt.Println("more", await (mdec !== null && (mdec as any).__isVarRef !== true && (mdec as any).__goValue === undefined ? ((mdec as any) as json.Decoder).More() : json.Decoder.prototype.More.call($.pointerValue<json.Decoder>(mdec))))

	// A blocking reader delivers values, a number, and a multibyte character
	// split across its chunks.
	let bdec = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(bufio.NewReader($.interfaceValue<io.Reader | null>(await newChanReader($.arrayToSlice<string>(["{\"A\": \"h", "\xc3", "\xa9llo\", \"B\": 1", "2.5}", "\n{\"A\": \"x\", \"B\": 3}"])), "*main.chanReader", /* @__PURE__ */ $.pointerType("main.chanReader"))), "*bufio.Reader", /* @__PURE__ */ $.pointerType("bufio.Reader")))!)
	while (true) {
		let it: $.VarRef<item> = $.varRef(new item(true))
		{
			let __goscriptShadow0 = await (bdec !== null && (bdec as any).__isVarRef !== true && (bdec as any).__goValue === undefined ? ((bdec as any) as json.Decoder).Decode($.interfaceValue(it, "*main.item", /* @__PURE__ */ $.pointerType("main.item"))) : json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(bdec), $.interfaceValue(it, "*main.item", /* @__PURE__ */ $.pointerType("main.item"))))
			if (__goscriptShadow0 != null) {
				fmt.Println("decode end:", $.comparableEqual(__goscriptShadow0, io.EOF))
				break
			}
		}
		fmt.Println(it.value.A, $.basicInterfaceValue(it.value.B, "float64"))
	}

	// Token and More work on a blocking reader, and UseNumber tokens are
	// json.Number values.
	await printTokens(json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(await newChanReader($.arrayToSlice<string>(["[1, \"two\", ", "{\"k\": true}]"])), "*main.chanReader", /* @__PURE__ */ $.pointerType("main.chanReader")))!))
	let ndec = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(await newChanReader($.arrayToSlice<string>(["[1.5, \"s\"]"])), "*main.chanReader", /* @__PURE__ */ $.pointerType("main.chanReader")))!)
	void (ndec !== null && (ndec as any).__isVarRef !== true && (ndec as any).__goValue === undefined ? ((ndec as any) as json.Decoder).UseNumber() : json.Decoder.prototype.UseNumber.call($.pointerValue<json.Decoder>(ndec)))
	await printTokens(ndec)

	// A syntax error is reported without waiting for the rest of the input.
	let it: $.VarRef<item> = $.varRef(new item(true))
	err = await json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(await newChanReader($.arrayToSlice<string>(["{\"A\": ]", " more"])), "*main.chanReader", /* @__PURE__ */ $.pointerType("main.chanReader")))!)), $.interfaceValue(it, "*main.item", /* @__PURE__ */ $.pointerType("main.item")))
	fmt.Println("syntax error:", err != null)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("int32", "json.Delim"), /* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("float64"), /* @__PURE__ */ $.basicType("string", "json.Number"), /* @__PURE__ */ $.basicType("bool")]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("strings.Reader"), "strings.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["s", /* @__PURE__ */ $.basicType("string")]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

if ($.isMainScript(import.meta)) {
	await main()
}
