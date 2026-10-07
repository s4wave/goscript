// Generated file based on net_http_server_request.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"

import * as url from "@goscript/net/url/index.js"
import "@goscript/io/index.js"
import "@goscript/net/http/index.js"
import "@goscript/net/http/httptest/index.js"
import "@goscript/net/url/index.js"

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let server: httptest.Server | $.VarRef<httptest.Server> | null = httptest.NewServer($.pointerValueOrNil($.namedValueInterfaceValue<http.Handler | null>($.namedFunction($.functionValue(async (w: http.ResponseWriter | null, r: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<void> => {
		let __goscriptTuple0: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Request>(r).Body as io.Reader | null))!)
		let data: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		await $.println("server:", $.pointerValue<http.Request>(r).Method, $.comparableEqual($.pointerValue<http.Request>(r).Body, $.pointerValue<any>(http.NoBody)), $.len(data), err == null, url.Values_Get(url.URL.prototype.Query.call($.pointerValue<http.Request>(r).URL), "x"))
		{
			let [, __goscriptShadow0] = await $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write(new Uint8Array([111, 107]))
			if (__goscriptShadow0 != null) {
				await $.println("write error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
			}
		}
	}, ({ kind: $.TypeKind.Function, params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", {ServeHTTP: (receiver: any, ...args: any[]) => (http.HandlerFunc_ServeHTTP as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo), [$.methodSignature("ServeHTTP", [["w", "http.ResponseWriter"], ["r", /* @__PURE__ */ $.pointerType("http.Request")]])]))!)
	__defer.defer(() => { httptest.Server.prototype.Close.call($.pointerValue<httptest.Server>(server)) })

	let __goscriptTuple1: any = await http.Get($.pointerValue<httptest.Server>(server).URL + "/?x=1")
	let resp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		await $.println("get error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	__defer.defer(async () => { await $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<http.Response>(resp).Body).Close() })
	await $.println("get status:", $.pointerValue<http.Response>(resp).StatusCode)

	let req: http.Request | $.VarRef<http.Request> | null = httptest.NewRequest(http.MethodGet, "/?y=2", null!)
	await $.println("recorded:", $.pointerValue<http.Request>(req).Body != null, url.Values_Get(url.URL.prototype.Query.call($.pointerValue<http.Request>(req).URL), "y"), url.Values_Has(url.URL.prototype.Query.call($.pointerValue<http.Request>(req).URL), "z"))
}

if ($.isMainScript(import.meta)) {
	await main()
}
