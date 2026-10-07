// Generated file based on net_http_servemux_patterns.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import type * as io from "@goscript/io/index.js"

import * as url from "@goscript/net/url/index.js"
import "@goscript/net/http/index.js"
import "@goscript/net/http/httptest/index.js"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/net/url/index.js"

export function route(label: string): http.Handler | null {
	return $.namedValueInterfaceValue<http.Handler | null>($.namedFunction($.functionValue(async (w: http.ResponseWriter | null, r: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<void> => {
		let body = (((((label + " id=") + http.Request.prototype.PathValue.call($.pointerValue<http.Request>(r), "id")) + " path=") + http.Request.prototype.PathValue.call($.pointerValue<http.Request>(r), "path")) + " pattern=") + $.pointerValue<http.Request>(r).Pattern
		{
			let [, err] = await $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write($.stringToBytes(body))
			if (err != null) {
				await $.println("write error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			}
		}
	}, ({ kind: $.TypeKind.Function, params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", {ServeHTTP: (receiver: any, ...args: any[]) => (http.HandlerFunc_ServeHTTP as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo), [$.methodSignature("ServeHTTP", [["w", "http.ResponseWriter"], ["r", /* @__PURE__ */ $.pointerType("http.Request")]])])
}

export async function serve(mux: http.ServeMux | $.VarRef<http.ServeMux> | null, req: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<void> {
	let rec: httptest.ResponseRecorder | $.VarRef<httptest.ResponseRecorder> | null = httptest.NewRecorder()
	await http.ServeMux.prototype.ServeHTTP.call($.pointerValue<http.ServeMux>(mux), $.pointerValueOrNil($.interfaceValue<http.ResponseWriter | null>(rec, "*httptest.ResponseRecorder", /* @__PURE__ */ $.pointerType("httptest.ResponseRecorder")))!, req)
	await $.println($.pointerValue<http.Request>(req).Method, $.pointerValue<http.Request>(req).Host, $.pointerValue<url.URL>($.pointerValue<http.Request>(req).URL).Path, "->", $.pointerValue<httptest.ResponseRecorder>(rec).Code, bytes.Buffer.prototype.String.call($.pointerValue<bytes.Buffer>($.pointerValue<httptest.ResponseRecorder>(rec).Body)), await http.Header_Get(httptest.ResponseRecorder.prototype.Header.call($.pointerValue<httptest.ResponseRecorder>(rec)), "Allow"), await http.Header_Get(httptest.ResponseRecorder.prototype.Header.call($.pointerValue<httptest.ResponseRecorder>(rec)), "Location"))
}

export async function _get(mux: http.ServeMux | $.VarRef<http.ServeMux> | null, method: string, target: string): globalThis.Promise<void> {
	await serve(mux, httptest.NewRequest(method, target, null!))
}

export async function register(mux: http.ServeMux | $.VarRef<http.ServeMux> | null, pattern: string, handler: http.Handler | null): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await $.println("register", pattern, "panics:", $.recover() != null)
		})() })
		http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), pattern, $.pointerValueOrNil(handler)!)
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function main(): globalThis.Promise<void> {
	let mux: http.ServeMux | $.VarRef<http.ServeMux> | null = http.NewServeMux()
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "/{$}", $.pointerValueOrNil(route("home"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "GET /items/{id}", $.pointerValueOrNil(route("get"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "DELETE /items/{id}", $.pointerValueOrNil(route("delete"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "GET /items/new", $.pointerValueOrNil(route("new"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "POST /items", $.pointerValueOrNil(route("create"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "/items/{id}/files/{path...}", $.pointerValueOrNil(route("files"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "/static/", $.pointerValueOrNil(route("static"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "/static/special", $.pointerValueOrNil(route("special"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "/exact/{$}", $.pointerValueOrNil(route("exact"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "example.com/hosted", $.pointerValueOrNil(route("host"))!)
	http.ServeMux.prototype.Handle.call($.pointerValue<http.ServeMux>(mux), "/hosted", $.pointerValueOrNil(route("any-host"))!)

	await _get(mux, "GET", "/")
	await _get(mux, "GET", "/missing")
	await _get(mux, "GET", "/items/42")
	await _get(mux, "HEAD", "/items/42")
	await _get(mux, "DELETE", "/items/7")
	await _get(mux, "POST", "/items/7")
	await _get(mux, "GET", "/items/new")
	await _get(mux, "POST", "/items")
	await _get(mux, "GET", "/items")
	await _get(mux, "GET", "/items/a%2Fb")
	await _get(mux, "GET", "/items/a%20b")
	await _get(mux, "PUT", "/items/42/files/a/b/c")
	await _get(mux, "PUT", "/items/42/files/")
	await _get(mux, "PUT", "/items/42/files")
	await _get(mux, "GET", "/static/css/app.css")
	await _get(mux, "GET", "/static/special")
	await _get(mux, "GET", "/static/special/more")
	await _get(mux, "GET", "/static")
	await _get(mux, "GET", "/exact/")
	await _get(mux, "GET", "/exact")
	await _get(mux, "GET", "/exact/x")
	await _get(mux, "GET", "/items//42")

	let hosted: http.Request | $.VarRef<http.Request> | null = httptest.NewRequest("GET", "/hosted", null!)
	await serve(mux, hosted)
	hosted = httptest.NewRequest("GET", "/hosted", null!)
	$.pointerValue<http.Request>(hosted).Host = "other.org:8080"
	await serve(mux, hosted)

	let [h, pattern] = http.ServeMux.prototype.Handler.call($.pointerValue<http.ServeMux>(mux), httptest.NewRequest("GET", "/items/9", null!))
	await $.println("handler:", h != null, pattern)

	let req: http.Request | $.VarRef<http.Request> | null = httptest.NewRequest("GET", "/", null!)
	await $.println("unset:", $.stringEqual(http.Request.prototype.PathValue.call($.pointerValue<http.Request>(req), "id"), ""))
	http.Request.prototype.SetPathValue.call($.pointerValue<http.Request>(req), "id", "set")
	await $.println("set:", http.Request.prototype.PathValue.call($.pointerValue<http.Request>(req), "id"), http.Request.prototype.PathValue.call($.pointerValue<http.Request>(http.Request.prototype.Clone.call($.pointerValue<http.Request>(req), $.pointerValueOrNil(http.Request.prototype.Context.call($.pointerValue<http.Request>(req)))!)), "id"))

	await register(mux, "GET /items/{name}", route("conflict"))
	await register(mux, "/items/new", route("overlap"))
	await register(mux, "/items/{id}/files/{path...}", route("duplicate"))
	await register(mux, "/a/{x}/{x}", route("duplicate name"))
	await register(mux, "/a/{x", route("unclosed"))
	await register(mux, "/a/{$}/b", route("dollar not last"))
	await register(mux, "/a/{x...}/b", route("multi not last"))
	await register(mux, "BAD(METHOD /a", route("method"))
	await register(mux, "a", route("no slash"))
	await register(mux, "", route("empty"))
	await register(mux, "/nil", null)
	await register(mux, "/ok/{id}", route("ok"))
}

if ($.isMainScript(import.meta)) {
	await main()
}
