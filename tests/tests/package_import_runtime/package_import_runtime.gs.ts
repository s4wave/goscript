// Generated file based on package_import_runtime.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"
import "@goscript/runtime/index.js"

export async function main(): globalThis.Promise<void> {
	// Test basic runtime functions
	await $.println("GOOS:", runtime.GOOS)
	await $.println("GOARCH:", runtime.GOARCH)
	await $.println("Compiler:", runtime.Compiler)
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

	let pcs: $.Slice<number> = $.makeSlice<number>(0, undefined, "number")
	await $.println("Callers empty:", runtime.Callers(0, pcs))
	let frames: runtime.Frames | $.VarRef<runtime.Frames> | null = runtime.CallersFrames(pcs)
	let [frame, more] = runtime.Frames.prototype.Next.call($.pointerValue<runtime.Frames>(frames))
	await $.println("Frames empty:", frame.Line, more)
	await $.println("FuncForPC nil:", runtime.FuncForPC($.uint(0, 64)) == null)

	let box = $.varRef({value: 1})
	let cleanup = $.markAsStructValue($.cloneStructValue(runtime.AddCleanup(box, $.functionValue(async (value: number): globalThis.Promise<void> => {
		await $.println("cleanup should not run during test:", value)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [] } as $.FunctionTypeInfo)), 1)))
	$.markAsStructValue($.cloneStructValue(cleanup)).Stop()
	runtime.KeepAlive($.interfaceValue(box, "*struct{value int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })))
	await $.println("Cleanup stopped")

	runtime.SetFinalizer($.interfaceValue(box, "*struct{value int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })), $.interfaceValue($.functionValue(async (_p0: $.VarRef<{"value": number}> | null): globalThis.Promise<void> => {
		await $.println("finalizer should not run during test")
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })], results: [] } as $.FunctionTypeInfo)), "func(*struct{value int})", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })], results: [] } as $.FunctionTypeInfo)))
	runtime.SetFinalizer($.interfaceValue(box, "*struct{value int}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_runtime" })] })), null)
	await $.println("Finalizer ignored")
}

if ($.isMainScript(import.meta)) {
	await main()
}
