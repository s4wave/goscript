// Generated file based on net_http_server_request.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"

import * as url from "@goscript/net/url/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/net/http/index.js"
import "@goscript/net/http/httptest/index.js"
import "@goscript/net/url/index.js"

export async function printURL(label: string, u: url.URL | $.VarRef<url.URL> | null): globalThis.Promise<void> {
	await $.println(label, "string:", url.URL.prototype.String.call(u))
	await $.println(label, "fields:", $.pointerValue<url.URL>(u).Scheme, $.pointerValue<url.URL>(u).Opaque, $.pointerValue<url.URL>(u).User == null, $.pointerValue<url.URL>(u).Host, $.pointerValue<url.URL>(u).Path, $.pointerValue<url.URL>(u).RawPath, $.pointerValue<url.URL>(u).RawQuery, $.pointerValue<url.URL>(u).Fragment, $.pointerValue<url.URL>(u).RawFragment, $.pointerValue<url.URL>(u).ForceQuery)
	await $.println(label, "host:", url.URL.prototype.Hostname.call(u), url.URL.prototype.Port.call(u), url.URL.prototype.IsAbs.call(u))
	await $.println(label, "redacted:", url.URL.prototype.Redacted.call(u))
	await $.println(label, "escaped:", url.URL.prototype.EscapedPath.call(u), url.URL.prototype.EscapedFragment.call(u), url.URL.prototype.RequestURI.call(u))

	let __goscriptTuple0: any = url.URL.prototype.Parse.call(u, "../d/e?k=v#top")
	let ref: url.URL | $.VarRef<url.URL> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		await $.println(label, "parse error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	} else {
		await $.println(label, "parse:", url.URL.prototype.String.call(ref))
	}

	await $.println(label, "resolve:", url.URL.prototype.String.call(url.URL.prototype.ResolveReference.call(u, new url.URL({Path: "x/./y"}))))
	await $.println(label, "join:", url.URL.prototype.String.call(url.URL.prototype.JoinPath.call(u, $.arrayToSlice<string>(["sub", "../z"]))))

	let __goscriptTuple1: any = url.URL.prototype.MarshalBinary.call(u)
	let data: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println(label, "marshal:", $.bytesToString(data), err == null)
}

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let server: httptest.Server | $.VarRef<httptest.Server> | null = httptest.NewServer($.pointerValueOrNil($.namedValueInterfaceValue<http.Handler | null>($.namedFunction($.functionValue(async (w: http.ResponseWriter | null, r: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<void> => {
		let __goscriptTuple2: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Request>(r).Body as io.Reader | null))!)
		let data: $.Slice<number> = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		await $.println("server:", $.pointerValue<http.Request>(r).Method, $.comparableEqual($.pointerValue<http.Request>(r).Body, $.pointerValue<any>(http.NoBody)), $.len(data), err == null, url.Values_Get($.pointerValue<http.Request>(r).URL.Query(), "x"), $.pointerValue<http.Request>(r).URL.RequestURI())
		await printURL("server", $.pointerValue<http.Request>(r).URL)
		{
			let [, __goscriptShadow0] = await $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write(new Uint8Array([111, 107]))
			if (__goscriptShadow0 != null) {
				await $.println("write error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
			}
		}
	}, ({ kind: $.TypeKind.Function, params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", {ServeHTTP: (receiver: any, ...args: any[]) => (http.HandlerFunc_ServeHTTP as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo), [$.methodSignature("ServeHTTP", [["w", "http.ResponseWriter"], ["r", /* @__PURE__ */ $.pointerType("http.Request")]])]))!)
	__defer.defer(() => { httptest.Server.prototype.Close.call($.pointerValue<httptest.Server>(server)) })

	let __goscriptTuple3: any = await http.Get($.pointerValue<httptest.Server>(server).URL + "/?x=1")
	let resp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		await $.println("get error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	__defer.defer(async () => { await $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<http.Response>(resp).Body).Close() })
	await $.println("get status:", $.pointerValue<http.Response>(resp).StatusCode)

	let req: http.Request | $.VarRef<http.Request> | null = httptest.NewRequest(http.MethodGet, "/?y=2", null!)
	await $.println("recorded:", $.pointerValue<http.Request>(req).Body != null, url.Values_Get($.pointerValue<http.Request>(req).URL.Query(), "y"), url.Values_Has($.pointerValue<http.Request>(req).URL.Query(), "z"))

	// A parsed *url.URL is a valid request URL.
	let __goscriptTuple4: any = url.Parse("https://example.com:8443/x?y=1")
	let parsed: url.URL | $.VarRef<url.URL> | null = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		await $.println("parse error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.pointerValue<http.Request>(req).URL = parsed
	await $.println("assigned:", url.Values_Get($.pointerValue<http.Request>(req).URL.Query(), "y"), $.pointerValue<http.Request>(req).URL.Hostname(), $.pointerValue<http.Request>(req).URL.Port(), $.pointerValue<http.Request>(req).URL.RequestURI())

	// RequestURI keeps the escaped path and the query unchanged.
	let targets: $.Slice<string> = $.arrayToSlice<string>(["/a%2Fb/c?q=a/../b&n=5", "/a/b", "http://example.com", "https://user:secret@example.com:8443/p/q%20r?a=1&b=2#frag%20x", "mailto:joe@example.com?subject=hi", "http://example.com/p?"])
	for (let __goscriptRangeTarget0 = targets, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let target = __goscriptRangeTarget0![__rangeIndex]
		let __goscriptTuple5: any = http.NewRequest(http.MethodGet, target, null!)
		let __goscriptShadow1: http.Request | $.VarRef<http.Request> | null = __goscriptTuple5[0]
		let __goscriptShadow2 = __goscriptTuple5[1]
		if (__goscriptShadow2 != null) {
			await $.println("new request error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow2).Error())
			continue
		}
		await $.println("request uri:", $.pointerValue<http.Request>(__goscriptShadow1).URL.RequestURI())
		await printURL("request", $.pointerValue<http.Request>(__goscriptShadow1).URL)
	}

	// A bad target reports the parse failure as a *url.Error.
	let __goscriptTuple6: any = http.NewRequest(http.MethodGet, "http://example.com/%zz", null!)
	err = __goscriptTuple6[1]
	let urlErr: $.VarRef<url.Error | $.VarRef<url.Error> | null> = $.varRef(null! as url.Error | $.VarRef<url.Error> | null)
	await $.println("bad target:", errors.As($.pointerValueOrNil(err)!, $.interfaceValue(urlErr, "**url.Error", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.pointerType("url.Error")))), $.pointerValue<url.Error>(urlErr.value).Op, $.pointerValue<url.Error>(urlErr.value).URL, await $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<url.Error>(urlErr.value).Err).Error())
}

if ($.isMainScript(import.meta)) {
	await main()
}
