// Generated file based on package_import_runtime.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as runtime from "@goscript/runtime/index.js"
import * as strconv from "@goscript/strconv/index.js"
import * as strings from "@goscript/strings/index.js"

export class counter {
	public declare n: number

	constructor(__goscriptValue?: boolean, n$?: number) {
		this.n = n$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): counter {
		return new counter(true, this.n)
	}

	public __goscriptAssign(source: counter): this {
		this.n = source.n
		return this
	}

	public PtrMethod(): number {
		const c: counter | $.VarRef<counter> | null = this;
		return $.pointerValue<counter>(c).n
	}

	public ValMethod(): number {
		const c = this;
		return c.n
	}

	static __typeInfo = $.registerStructType(
		"main.counter",
		() => new counter(),
		() => [$.methodSignature("PtrMethod", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("ValMethod", [], [/* @__PURE__ */ $.basicType("int")])],
		counter,
		() => [/* @__PURE__ */ $.structField("n", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })]
	)
}

export class box {
	public declare v: any

	constructor(__goscriptValue?: boolean, v$?: any) {
		this.v = v$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): box {
		return $.copyGenericInstance(this, new box(true, $.copyElement(this.v)))
	}

	public __goscriptAssign(source: box): this {
		this.v = $.assignFieldValue(this.v, source.v)
		return this
	}

	public Get(__typeArgs: $.GenericTypeArgs | undefined): any {
		const b: box | $.VarRef<box> | null = this;
		return $.copyElement($.pointerValue<box>(b).v)
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		() => new box(),
		() => [$.methodSignature("Get", [], [{ kind: $.TypeKind.Interface, methods: [] }], true)],
		box,
		() => [/* @__PURE__ */ $.structField("v", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })]
	)
}

function __goscriptInit0(): void {
	// Graphics and windowing code locks the main goroutine to the main
	// thread in init.
	runtime.LockOSThread()
}

export async function main(): globalThis.Promise<void> {
	// Test basic runtime functions
	await $.println("GOOS:", runtime.GOOS)
	await $.println("GOARCH:", runtime.GOARCH)
	await $.println("Compiler:", runtime.Compiler)
	runtime.GOROOT()
	// println("Version:", runtime.Version()) - not stable for the test (go.mod may change)
	// println("NumCPU:", runtime.NumCPU()) - not stable for the test (number of cores may change)

	// Test GOMAXPROCS
	let procs = runtime.GOMAXPROCS(0)
	await $.println("GOMAXPROCS(-1):", runtime.GOMAXPROCS(-1))
	await $.println("GOMAXPROCS(0):", procs)

	// Test NumGoroutine
	await $.println("NumGoroutine:", runtime.NumGoroutine())

	// Test GC (should be no-op)
	runtime.GC()
	await $.println("GC called successfully")

	let pcs = $.makeSlice<number>(0, undefined, "number")
	await $.println("Callers empty:", runtime.Callers(0, pcs))
	let frames = runtime.CallersFrames(pcs)
	let [frame, more] = (frames !== null && (frames as any).__isVarRef !== true && (frames as any).__goValue === undefined ? ((frames as any) as runtime.Frames).Next() : runtime.Frames.prototype.Next.call($.pointerValue<runtime.Frames>(frames)))
	await $.println("Frames empty:", frame.Line, more)
	await $.println("FuncForPC nil:", runtime.FuncForPC(0) == null)
	await callers()
	await funcValueNames()

	let __goscriptShadow0 = $.varRef($.anonymousStructValue({value: 1}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] }))
	let cleanup = $.markAsStructValue($.cloneStructValue(runtime.AddCleanup(__goscriptShadow0, $.functionValue(async (value: number) => {
		await $.println("cleanup should not run during test:", value)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [] } as $.FunctionTypeInfo)), 1)))
	$.markAsStructValue($.cloneStructValue(cleanup)).Stop()
	runtime.KeepAlive($.interfaceValue(__goscriptShadow0, "*struct{value int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })))
	await $.println("Cleanup stopped")

	runtime.SetFinalizer($.interfaceValue(__goscriptShadow0, "*struct{value int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })), $.interfaceValue($.functionValue(async (_p0: $.VarRef<{"value": number}> | null) => {
		await $.println("finalizer should not run during test")
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })], results: [] } as $.FunctionTypeInfo)), "func(*struct{value int})", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })], results: [] } as $.FunctionTypeInfo)))
	runtime.SetFinalizer($.interfaceValue(__goscriptShadow0, "*struct{value int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })), null)
	await $.println("Finalizer ignored")

	await lockOSThread()
}

export async function callers(): globalThis.Promise<void> {
	let [pc, file, line, ok] = runtime.Caller(0)
	await $.println("Caller:", ok, pc != 0, !$.stringEqual(file, ""), line > 0)
	let f = runtime.FuncForPC(pc)
	await $.println("FuncForPC caller:", f != null, strings.Contains(runtime.Func.prototype.Name.call($.pointerValueOrNil(f)), "callers"))
	await $.println("Caller(1):", !$.stringEqual(callerInfo(), ""))

	let pcs = $.makeSlice<number>(8, undefined, "number")
	let n = runtime.Callers(1, pcs)
	let [frame, ] = runtime.Frames.prototype.Next.call($.pointerValue<runtime.Frames>(runtime.CallersFrames($.goSlice(pcs, undefined, n))))
	await $.println("Callers:", n > 0, frame.Line > 0, strings.Contains(frame.Function, "callers"))
}

export function callerInfo(): string {
	let [pc, file, line, ] = runtime.Caller(1)
	return runtime.Func.prototype.Name.call($.pointerValueOrNil(runtime.FuncForPC(pc))) + " " + file + ":" + strconv.Itoa(line)
}

export function funcName(f: any): string {
	return runtime.Func.prototype.Name.call($.pointerValueOrNil(runtime.FuncForPC($.markAsStructValue($.cloneStructValue(reflect.ValueOf(f))).Pointer())))
}

export function helperFunc(): void {
}

export async function funcValueNames(): globalThis.Promise<void> {
	await $.println("FuncForPC func:", funcName($.interfaceValue($.goFunc(helperFunc, "main.helperFunc"), "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("FuncForPC imported:", funcName($.interfaceValue($.goFunc(strings.ToUpper, "strings.ToUpper"), "func(s string) string", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo))))

	let c = new counter(false, 1)
	await $.println("FuncForPC pointer method:", funcName($.interfaceValue($.functionValue(((__receiver) => () => __receiver.PtrMethod())($.pointerValue<counter>(c)), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*counter).PtrMethod-fm"), "func() int", ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))
	await $.println("FuncForPC value method:", funcName($.interfaceValue($.functionValue(((__receiver) => () => __receiver.ValMethod())($.markAsStructValue($.cloneStructValue($.pointerValue<counter>(c)))), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.counter.ValMethod-fm"), "func() int", ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))

	let b = $.genericInstance(new box(false, 2), __goscriptStatic1)
	await $.println("FuncForPC generic method:", funcName($.interfaceValue($.functionValue(((__receiver) => () => __receiver.Get(__goscriptStatic0()))($.pointerValue<box>(b)), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*box[...]).Get-fm"), "func() int", ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))
}

export async function lockOSThread(): globalThis.Promise<void> {
	let done = $.makeChannel<boolean>(0, false, "both")
	queueMicrotask(async () => {
		await using __defer = new $.AsyncDisposableStack()
		runtime.LockOSThread()
		__defer.defer(() => { runtime.UnlockOSThread() })
		await $.println("locked goroutine ran")
		await $.chanSend(done, true)
	})
	await $.chanRecv(done)
	runtime.UnlockOSThread()
	await $.println("main unlocked")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, E: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Get: (receiver: any) => $.pointerValue(receiver).Get(__goscriptStatic0())}, [$.methodSignature("Get", [], [/* @__PURE__ */ $.basicType("int")], true, false)]])
}

__goscriptInit0()

if ($.isMainScript(import.meta)) {
	await main()
}
