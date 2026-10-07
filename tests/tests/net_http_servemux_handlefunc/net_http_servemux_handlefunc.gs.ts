// Generated file based on net_http_servemux_handlefunc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"

import * as bytes from "@goscript/bytes/index.js"

import type * as io from "@goscript/io/index.js"

import * as url from "@goscript/net/url/index.js"
import "@goscript/net/http/index.js"
import "@goscript/net/http/httptest/index.js"
import "@goscript/bytes/index.js"
import "@goscript/net/url/index.js"

export async function serve(handler: http.Handler | null, target: string): globalThis.Promise<void> {
	let rec: httptest.ResponseRecorder | $.VarRef<httptest.ResponseRecorder> | null = httptest.NewRecorder()
	await $.pointerValue<Exclude<http.Handler, null>>(handler).ServeHTTP($.pointerValueOrNil($.interfaceValue<http.ResponseWriter | null>(rec, "*httptest.ResponseRecorder", /* @__PURE__ */ $.pointerType("httptest.ResponseRecorder")))!, httptest.NewRequest(http.MethodGet, target, null!))
	await $.println(target, "->", $.pointerValue<httptest.ResponseRecorder>(rec).Code, await http.Header_Get(httptest.ResponseRecorder.prototype.Header.call($.pointerValue<httptest.ResponseRecorder>(rec)), "X-Route"), $.pointerValue<bytes.Buffer>($.pointerValue<httptest.ResponseRecorder>(rec).Body).String())
}

export async function main(): globalThis.Promise<void> {
	let mux: http.ServeMux | $.VarRef<http.ServeMux> | null = http.NewServeMux()
	http.ServeMux.prototype.HandleFunc.call($.pointerValue<http.ServeMux>(mux), "/mux", $.functionValue(async (w: http.ResponseWriter | null, r: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<void> => {
		http.Header_Set((await $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Header()), "X-Route", "mux")
		await $.pointerValue<Exclude<http.ResponseWriter, null>>(w).WriteHeader(202)
		{
			let [, err] = await $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write($.stringToBytes("hello " + $.pointerValue<url.URL>($.pointerValue<http.Request>(r).URL).Path))
			if (err != null) {
				await $.println("write error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			}
		}
	}, ({ kind: $.TypeKind.Function, params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)))
	http.HandleFunc("/default", $.functionValue(async (w: http.ResponseWriter | null, r: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<void> => {
		http.Header_Set((await $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Header()), "X-Route", "default")
		{
			let [, err] = await $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write($.stringToBytes("hello " + $.pointerValue<url.URL>($.pointerValue<http.Request>(r).URL).Path))
			if (err != null) {
				await $.println("write error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			}
		}
	}, ({ kind: $.TypeKind.Function, params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)))

	await serve($.interfaceValue<http.Handler | null>(mux, "*http.ServeMux", /* @__PURE__ */ $.pointerType("http.ServeMux")), "/mux")
	await serve($.interfaceValue<http.Handler | null>(mux, "*http.ServeMux", /* @__PURE__ */ $.pointerType("http.ServeMux")), "/missing")
	await serve($.interfaceValue<http.Handler | null>(http.DefaultServeMux, "*http.ServeMux", /* @__PURE__ */ $.pointerType("http.ServeMux")), "/default")
}

if ($.isMainScript(import.meta)) {
	await main()
}
