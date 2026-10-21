// Generated file based on package_import_io.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as io from "@goscript/io/index.js"
import * as sync from "@goscript/sync/index.js"

export class writerHolder {
	public declare w: io.Writer | null

	constructor(__goscriptValue?: boolean, w$?: io.Writer | null) {
		this.w = w$ ?? (null! as io.Writer | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): writerHolder {
		return new writerHolder(true, this.w)
	}

	public __goscriptAssign(source: writerHolder): this {
		this.w = $.assignFieldValue(this.w, source.w)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.writerHolder",
		() => new writerHolder(),
		() => [],
		writerHolder,
		() => [{ name: "w", key: "w", type: "io.Writer" }]
	)
}

export class asyncBuffer {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): asyncBuffer {
		return new asyncBuffer(true)
	}

	public __goscriptAssign(source: asyncBuffer): this {
		return this
	}

	public async Reset(w: io.Writer | null): globalThis.Promise<void> {
		const b: asyncBuffer | $.VarRef<asyncBuffer> | null = this;
		if ($.comparableEqual($.interfaceValue<io.Writer | null>(b, "*main.asyncBuffer", /* @__PURE__ */ $.pointerType("main.asyncBuffer")), w)) {
			await $.println("Reset same writer")
			return
		}
		await $.println("Reset different writer")
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		const b: asyncBuffer | $.VarRef<asyncBuffer> | null = this;
		asyncWrites.value.Load("last")
		return [$.sliceLen(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.asyncBuffer",
		() => new asyncBuffer(),
		() => [{ name: "Reset", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }],
		asyncBuffer,
		() => []
	)
}

export class staticReader {
	public declare done: boolean

	constructor(__goscriptValue?: boolean, done$?: boolean) {
		this.done = done$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): staticReader {
		return new staticReader(true, this.done)
	}

	public __goscriptAssign(source: staticReader): this {
		this.done = source.done
		return this
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		const r: staticReader | $.VarRef<staticReader> | null = this;
		const r$: staticReader = r == null ? $.pointerTarget<staticReader>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<staticReader>(r)
		if ((r$ as staticReader).done) {
			return [0, io.EOF]
		}
		$.copy(p, new Uint8Array([99, 111, 112, 121]));
		;(r$ as staticReader).done = true
		return [4, null]
	}

	static __typeInfo = $.registerStructType(
		"main.staticReader",
		() => new staticReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }],
		staticReader,
		() => [{ name: "done", key: "done", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export class asyncReader {
	public declare done: boolean

	constructor(__goscriptValue?: boolean, done$?: boolean) {
		this.done = done$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): asyncReader {
		return new asyncReader(true, this.done)
	}

	public __goscriptAssign(source: asyncReader): this {
		this.done = source.done
		return this
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		const r: asyncReader | $.VarRef<asyncReader> | null = this;
		const r$: asyncReader = r == null ? $.pointerTarget<asyncReader>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<asyncReader>(r)
		asyncWrites.value.Load("read")
		if ((r$ as asyncReader).done) {
			return [0, io.EOF]
		}
		$.copy(p, new Uint8Array([97, 115, 121, 110, 99]));
		;(r$ as asyncReader).done = true
		return [5, null]
	}

	static __typeInfo = $.registerStructType(
		"main.asyncReader",
		() => new asyncReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }],
		asyncReader,
		() => [{ name: "done", key: "done", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export class asyncReaderAt {
	public declare data: $.Slice<number>

	constructor(__goscriptValue?: boolean, data$?: $.Slice<number>) {
		this.data = data$ ?? (null! as $.Slice<number>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): asyncReaderAt {
		return new asyncReaderAt(true, this.data)
	}

	public __goscriptAssign(source: asyncReaderAt): this {
		this.data = source.data
		return this
	}

	public ReadAt(p: $.Slice<number>, off: bigint): [number, $.GoError] {
		const r: asyncReaderAt | $.VarRef<asyncReaderAt> | null = this;
		const r$: asyncReaderAt = r == null ? $.pointerTarget<asyncReaderAt>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<asyncReaderAt>(r)
		asyncWrites.value.Load("readat")
		if (off >= $.int64($.sliceLen((r$ as asyncReaderAt).data))) {
			return [0, io.EOF]
		}
		let n = $.copy(p, $.goSlice((r$ as asyncReaderAt).data, $.int64ToNumber(off), undefined))
		if (n < $.sliceLen(p)) {
			return [n, io.EOF]
		}
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.asyncReaderAt",
		() => new asyncReaderAt(),
		() => [{ name: "ReadAt", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }],
		asyncReaderAt,
		() => [{ name: "data", key: "data", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export class pipeReadResult {
	public declare n: number

	public declare data: string

	public declare errNil: boolean

	public declare errEOF: boolean

	constructor(__goscriptValue?: boolean, n$?: number, data$?: string, errNil$?: boolean, errEOF$?: boolean) {
		this.n = n$ ?? 0
		this.data = data$ ?? ""
		this.errNil = errNil$ ?? false
		this.errEOF = errEOF$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): pipeReadResult {
		return new pipeReadResult(true, this.n, this.data, this.errNil, this.errEOF)
	}

	public __goscriptAssign(source: pipeReadResult): this {
		this.n = source.n
		this.data = source.data
		this.errNil = source.errNil
		this.errEOF = source.errEOF
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pipeReadResult",
		() => new pipeReadResult(),
		() => [],
		pipeReadResult,
		() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }, { name: "data", key: "data", type: /* @__PURE__ */ $.basicType("string") }, { name: "errNil", key: "errNil", type: /* @__PURE__ */ $.basicType("bool") }, { name: "errEOF", key: "errEOF", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export let asyncWrites = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_asyncWrites(__goscriptValue: sync.Map): void {
	$.assignStruct(asyncWrites.value, __goscriptValue)
}

export async function copyInterfaces(dst: io.Writer | null, src: io.Reader | null): globalThis.Promise<[bigint, $.GoError]> {
	return io.Copy($.pointerValueOrNil(dst)!, $.pointerValueOrNil(src)!)
}

export async function main(): globalThis.Promise<void> {
	// Test basic error variables
	await $.println("EOF:", (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>(io.EOF).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("ErrClosedPipe:", (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>(io.ErrClosedPipe).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("ErrShortWrite:", (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>(io.ErrShortWrite).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("ErrUnexpectedEOF:", (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>(io.ErrUnexpectedEOF).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	// Test seek constants
	await $.println("SeekStart:", 0)
	await $.println("SeekCurrent:", 1)
	await $.println("SeekEnd:", 2)

	// Test Discard writer
	let [n, err] = await io.WriteString($.pointerValueOrNil(io.Discard)!, "hello world")
	await $.println("WriteString to Discard - bytes:", n, "err:", err == null)

	let holder = new writerHolder(true, io.Discard)
	let __goscriptTuple0: any = await io.WriteString($.pointerValueOrNil(holder.w)!, "field writer")
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	await $.println("WriteString field writer - bytes:", n, "err:", err == null)

	let buf = new asyncBuffer()
	await (buf !== null && (buf as any).__isVarRef !== true && (buf as any).__goValue === undefined ? ((buf as any) as asyncBuffer).Reset($.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer", /* @__PURE__ */ $.pointerType("main.asyncBuffer"))) : asyncBuffer.prototype.Reset.call(buf, $.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer", /* @__PURE__ */ $.pointerType("main.asyncBuffer"))))
	await (buf !== null && (buf as any).__isVarRef !== true && (buf as any).__goValue === undefined ? ((buf as any) as asyncBuffer).Reset(null) : asyncBuffer.prototype.Reset.call(buf, null))
	let __goscriptTuple1: any = await copyInterfaces(io.Discard, $.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader", /* @__PURE__ */ $.pointerType("main.staticReader")))
	let n64: bigint = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println("Copy interface - bytes:", n64, "err:", err == null)
	let __goscriptTuple2: any = await io.Copy($.pointerValueOrNil(io.Discard)!, $.interfaceValue<io.Reader | null>($.anonymousStructValue({Reader: $.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader", /* @__PURE__ */ $.pointerType("main.staticReader"))}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Reader", "io.Reader", [0], 0, true, { anonymous: true })] }), "struct{io.Reader}", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Reader", "io.Reader", [0], 0, true, { anonymous: true })] })!)
	n64 = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("Copy embedded reader - bytes:", n64, "err:", err == null)
	let __goscriptTuple3: any = await io.Copy($.interfaceValue<io.Writer | null>($.anonymousStructValue({Writer: io.Discard}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Writer", "io.Writer", [0], 0, true, { anonymous: true })] }), "struct{io.Writer}", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Writer", "io.Writer", [0], 0, true, { anonymous: true })] })!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader", /* @__PURE__ */ $.pointerType("main.staticReader")))!)
	n64 = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	await $.println("Copy embedded writer - bytes:", n64, "err:", err == null)
	let __goscriptTuple4: any = await io.Copy($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer", /* @__PURE__ */ $.pointerType("main.asyncBuffer")))!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader", /* @__PURE__ */ $.pointerType("main.staticReader")))!)
	n64 = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	await $.println("Copy async writer - bytes:", n64, "err:", err == null)
	let __goscriptTuple5: any = await io.CopyN($.pointerValueOrNil(io.Discard)!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(new asyncReader(), "*main.asyncReader", /* @__PURE__ */ $.pointerType("main.asyncReader")))!, 5n)
	n64 = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	await $.println("CopyN async reader - bytes:", n64, "err:", err == null)
	let __goscriptTuple6: any = await io.Copy($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer", /* @__PURE__ */ $.pointerType("main.asyncBuffer")))!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewBuffer(new Uint8Array([99, 111, 112, 121])), "*bytes.Buffer", __goscriptStatic0()))!)
	n64 = __goscriptTuple6[0]
	err = __goscriptTuple6[1]
	await $.println("Copy bytes WriteTo async writer - bytes:", n64, "err:", err == null)
	let viewBacking = new Uint8Array([0, 0, 0, 0, 99]) as $.Slice<number>
	let __goscriptTuple7: any = bytes.Buffer.prototype.Read.call($.pointerValue<bytes.Buffer>(bytes.NewBuffer(new Uint8Array([118, 105, 101, 119]))), $.goSlice(viewBacking, undefined, 4))
	n = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	await $.println("Read into byte slice view - bytes:", n, "data:", $.bytesToString(viewBacking), "err:", err == null)
	let dst = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let __goscriptTuple8: any = await io.Copy($.pointerValueOrNil($.interfaceValue<io.Writer | null>(dst, "*bytes.Buffer", __goscriptStatic0()))!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(new asyncReader(), "*main.asyncReader", /* @__PURE__ */ $.pointerType("main.asyncReader")))!)
	n64 = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	await $.println("Copy bytes ReadFrom async reader - bytes:", n64, "data:", dst.value.String(), "err:", err == null)
	let sectionReader = io.NewSectionReader($.pointerValueOrNil($.interfaceValue<io.ReaderAt | null>(new asyncReaderAt(false, new Uint8Array([97, 98, 99, 100, 101, 102])), "*main.asyncReaderAt", /* @__PURE__ */ $.pointerType("main.asyncReaderAt")))!, 1n, 3n)
	let __goscriptTuple9: any = await io.CopyBuffer($.pointerValueOrNil(io.Discard)!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(sectionReader, "*io.SectionReader", __goscriptStatic1()))!, $.makeSlice<number>(2, undefined, "byte"))
	n64 = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	await $.println("Copy section async readerat - bytes:", n64, "err:", err == null)

	let __goscriptTuple10: any = io.Pipe()
	let reader: io.PipeReader | $.VarRef<io.PipeReader> | null = __goscriptTuple10[0]
	let writer: io.PipeWriter | $.VarRef<io.PipeWriter> | null = __goscriptTuple10[1]
	let done = $.makeChannel<boolean>(1, false, "both")
	let pipeReads = $.makeChannel<pipeReadResult>(2, new pipeReadResult(true), "both")
	queueMicrotask(async () => {
		let __goscriptShadow0 = $.makeSlice<number>(5, undefined, "byte")
		let [__goscriptShadow1, __goscriptShadow2] = await (reader !== null && (reader as any).__isVarRef !== true && (reader as any).__goValue === undefined ? ((reader as any) as io.PipeReader).Read(__goscriptShadow0) : io.PipeReader.prototype.Read.call($.pointerValue<io.PipeReader>(reader), __goscriptShadow0))
		await $.chanSend(pipeReads, new pipeReadResult(true, __goscriptShadow1, $.bytesToString($.goSlice(__goscriptShadow0, undefined, __goscriptShadow1)), __goscriptShadow2 == null, $.comparableEqual(__goscriptShadow2, io.EOF)))
		let __goscriptTuple11: any = await (reader !== null && (reader as any).__isVarRef !== true && (reader as any).__goValue === undefined ? ((reader as any) as io.PipeReader).Read(__goscriptShadow0) : io.PipeReader.prototype.Read.call($.pointerValue<io.PipeReader>(reader), __goscriptShadow0))
		__goscriptShadow1 = __goscriptTuple11[0]
		__goscriptShadow2 = __goscriptTuple11[1]
		await $.chanSend(pipeReads, new pipeReadResult(true, __goscriptShadow1, undefined, __goscriptShadow2 == null, $.comparableEqual(__goscriptShadow2, io.EOF)))
		await $.chanSend(done, true)
	})
	let __goscriptTuple12: any = await (writer !== null && (writer as any).__isVarRef !== true && (writer as any).__goValue === undefined ? ((writer as any) as io.PipeWriter).Write(new Uint8Array([104, 101, 108, 108, 111])) : io.PipeWriter.prototype.Write.call($.pointerValue<io.PipeWriter>(writer), new Uint8Array([104, 101, 108, 108, 111])))
	n = __goscriptTuple12[0]
	err = __goscriptTuple12[1]
	await $.println("Pipe write - bytes:", n, "err:", err == null)
	err = (writer !== null && (writer as any).__isVarRef !== true && (writer as any).__goValue === undefined ? ((writer as any) as io.PipeWriter).Close() : io.PipeWriter.prototype.Close.call($.pointerValue<io.PipeWriter>(writer)))
	await $.println("Pipe close err:", err == null)
	await $.chanRecv(done)
	let firstRead: pipeReadResult = await $.chanRecv(pipeReads)
	let eofRead: pipeReadResult = await $.chanRecv(pipeReads)
	await $.println("Pipe read - bytes:", firstRead.n, "data:", firstRead.data, "err:", firstRead.errNil)
	await $.println("Pipe read EOF - bytes:", eofRead.n, "err EOF:", eofRead.errEOF)
	let __goscriptTuple13: any = await (writer !== null && (writer as any).__isVarRef !== true && (writer as any).__goValue === undefined ? ((writer as any) as io.PipeWriter).Write(new Uint8Array([97, 103, 97, 105, 110])) : io.PipeWriter.prototype.Write.call($.pointerValue<io.PipeWriter>(writer), new Uint8Array([97, 103, 97, 105, 110])))
	n = __goscriptTuple13[0]
	err = __goscriptTuple13[1]
	await $.println("Pipe write after close - bytes:", n, "err closed:", $.comparableEqual(err, io.ErrClosedPipe))

	let __goscriptTuple14: any = io.Pipe()
	reader = __goscriptTuple14[0]
	writer = __goscriptTuple14[1]
	let ready = $.makeChannel<boolean>(1, false, "both")
	let readResult = $.makeChannel<pipeReadResult>(1, new pipeReadResult(true), "both")
	queueMicrotask(async () => {
		let __goscriptShadow3 = $.makeSlice<number>(5, undefined, "byte")
		await $.chanSend(ready, true)
		let [__goscriptShadow4, __goscriptShadow5] = await (reader !== null && (reader as any).__isVarRef !== true && (reader as any).__goValue === undefined ? ((reader as any) as io.PipeReader).Read(__goscriptShadow3) : io.PipeReader.prototype.Read.call($.pointerValue<io.PipeReader>(reader), __goscriptShadow3))
		await $.chanSend(readResult, new pipeReadResult(true, __goscriptShadow4, $.bytesToString($.goSlice(__goscriptShadow3, undefined, __goscriptShadow4)), __goscriptShadow5 == null, $.comparableEqual(__goscriptShadow5, io.EOF)))
	})
	await $.chanRecv(ready)
	let __goscriptTuple15: any = await (writer !== null && (writer as any).__isVarRef !== true && (writer as any).__goValue === undefined ? ((writer as any) as io.PipeWriter).Write(new Uint8Array([108, 97, 116, 101, 114])) : io.PipeWriter.prototype.Write.call($.pointerValue<io.PipeWriter>(writer), new Uint8Array([108, 97, 116, 101, 114])))
	n = __goscriptTuple15[0]
	err = __goscriptTuple15[1]
	let delayed: pipeReadResult = await $.chanRecv(readResult)
	await $.println("Pipe delayed write - bytes:", n, "err:", err == null)
	await $.println("Pipe delayed read - bytes:", delayed.n, "data:", delayed.data, "err:", delayed.errNil, "err EOF:", delayed.errEOF)
	err = (writer !== null && (writer as any).__isVarRef !== true && (writer as any).__goValue === undefined ? ((writer as any) as io.PipeWriter).Close() : io.PipeWriter.prototype.Close.call($.pointerValue<io.PipeWriter>(writer)))
	await $.println("Pipe delayed close err:", err == null)

	await $.println("test finished")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Buffer"), "bytes.Buffer", () => [$.methodSignature("Available", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("AvailableBuffer", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Next", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Peek", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadBytes", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]], true), $.methodSignature("ReadFrom", [["r", "io.Reader"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true), $.methodSignature("ReadRune", [], [["r", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadString", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.basicType("string")], ["err", "error"]], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Truncate", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("io.SectionReader"), "io.SectionReader", () => [$.methodSignature("Outer", [], [["r", "io.ReaderAt"], ["off", /* @__PURE__ */ $.basicType("int64")], ["n", /* @__PURE__ */ $.basicType("int64")]], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true)]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
