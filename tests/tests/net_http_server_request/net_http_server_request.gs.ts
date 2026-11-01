// Generated file based on net_http_server_request.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as errors from "@goscript/errors/index.js"
import * as io from "@goscript/io/index.js"
import * as http from "@goscript/net/http/index.js"
import * as httptest from "@goscript/net/http/httptest/index.js"
import * as url from "@goscript/net/url/index.js"

export class streamWriter {
	public declare header: http.Header

	constructor(__goscriptValue?: boolean, header$?: http.Header) {
		this.header = header$ ?? (null! as http.Header)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): streamWriter {
		return new streamWriter(true, this.header)
	}

	public __goscriptAssign(source: streamWriter): this {
		this.header = source.header
		return this
	}

	public Flush(): void {
		const w: streamWriter | $.VarRef<streamWriter> | null = this;
	}

	public Header(): http.Header {
		const w: streamWriter | $.VarRef<streamWriter> | null = this;
		return $.pointerValue<streamWriter>(w).header
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		const w: streamWriter | $.VarRef<streamWriter> | null = this;
		return [$.sliceLen(p), null]
	}

	public WriteHeader(_p0: number): void {
		const w: streamWriter | $.VarRef<streamWriter> | null = this;
	}

	static __typeInfo = $.registerStructType(
		"main.streamWriter",
		() => new streamWriter(),
		() => [{ name: "Flush", args: [], returns: [], pointerReceiver: true }, { name: "Header", args: [], returns: [{ type: "http.Header" }], pointerReceiver: true }, { name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }, { name: "WriteHeader", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		streamWriter,
		() => [{ name: "header", key: "header", type: "http.Header" }]
	)
}

export async function printURL(label: string, u: url.URL | $.VarRef<url.URL> | null): globalThis.Promise<void> {
	const u$: url.URL = u == null ? $.pointerTarget<url.URL>(u) : (u as any).__isVarRef === true ? (u as any).value : (u as any).__goValue === undefined ? (u as any) : $.pointerTarget<url.URL>(u)
	await $.println(label, "string:", (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).String() : url.URL.prototype.String.call(u)))
	await $.println(label, "fields:", (u$ as url.URL).Scheme, (u$ as url.URL).Opaque, (u$ as url.URL).User == null, (u$ as url.URL).Host, (u$ as url.URL).Path, (u$ as url.URL).RawPath, (u$ as url.URL).RawQuery, (u$ as url.URL).Fragment, (u$ as url.URL).RawFragment, (u$ as url.URL).ForceQuery)
	await $.println(label, "host:", (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).Hostname() : url.URL.prototype.Hostname.call(u)), (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).Port() : url.URL.prototype.Port.call(u)), (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).IsAbs() : url.URL.prototype.IsAbs.call(u)))
	await $.println(label, "redacted:", (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).Redacted() : url.URL.prototype.Redacted.call(u)))
	await $.println(label, "escaped:", (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).EscapedPath() : url.URL.prototype.EscapedPath.call(u)), (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).EscapedFragment() : url.URL.prototype.EscapedFragment.call(u)), (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).RequestURI() : url.URL.prototype.RequestURI.call(u)))

	let __goscriptTuple0: any = (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).Parse("../d/e?k=v#top") : url.URL.prototype.Parse.call(u, "../d/e?k=v#top"))
	let ref: url.URL | $.VarRef<url.URL> | null = __goscriptTuple0[0]
	let err: $.GoError = __goscriptTuple0[1]
	if (err != null) {
		await $.println(label, "parse error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	} else {
		await $.println(label, "parse:", (ref !== null && (ref as any).__isVarRef !== true && (ref as any).__goValue === undefined ? ((ref as any) as url.URL).String() : url.URL.prototype.String.call(ref)))
	}

	await $.println(label, "resolve:", url.URL.prototype.String.call((u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).ResolveReference(new url.URL(false, undefined, undefined, undefined, undefined, "x/./y")) : url.URL.prototype.ResolveReference.call(u, new url.URL(false, undefined, undefined, undefined, undefined, "x/./y")))))
	await $.println(label, "join:", url.URL.prototype.String.call((u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).JoinPath($.arrayToSlice<string>(["sub", "../z"])) : url.URL.prototype.JoinPath.call(u, $.arrayToSlice<string>(["sub", "../z"])))))

	let __goscriptTuple1: any = (u !== null && (u as any).__isVarRef !== true && (u as any).__goValue === undefined ? ((u as any) as url.URL).MarshalBinary() : url.URL.prototype.MarshalBinary.call(u))
	let data: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println(label, "marshal:", $.bytesToString(data), err == null)
}

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let server = httptest.NewServer($.pointerValueOrNil($.namedValueInterfaceValue<http.Handler | null>($.namedFunction($.functionValue(async (w: http.ResponseWriter | null, r: http.Request | $.VarRef<http.Request> | null) => {
		let __goscriptTuple2: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Request>(r).Body as io.Reader | null))!)
		let data: $.Slice<number> = __goscriptTuple2[0]
		let err: $.GoError = __goscriptTuple2[1]
		await $.println("server:", $.pointerValue<http.Request>(r).Method, $.comparableEqual($.pointerValue<http.Request>(r).Body, $.structInterfaceValue<io.ReadCloser | null>($.pointerValue<any>(http.NoBody), "http.noBody", __goscriptStatic0())), $.sliceLen(data), err == null, url.Values_Get($.pointerValue<http.Request>(r).URL.Query(), "x"), $.pointerValue<http.Request>(r).URL.RequestURI())
		await printURL("server", $.pointerValue<http.Request>(r).URL)
		{
			let [, __goscriptShadow0] = await (w !== null && (w as any).__isVarRef !== true && ((w as any).__goValue === undefined || (w as any).__goType?.charCodeAt(0) !== 42) ? (w as Exclude<http.ResponseWriter, null>) : $.pointerValue<Exclude<http.ResponseWriter, null>>(w)).Write(new Uint8Array([111, 107]))
			if (__goscriptShadow0 != null) {
				await $.println("write error:", (__goscriptAwait = (__goscriptShadow0 !== null && (__goscriptShadow0 as any).__isVarRef !== true && ((__goscriptShadow0 as any).__goValue === undefined || (__goscriptShadow0 as any).__goType?.charCodeAt(0) !== 42) ? (__goscriptShadow0 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			}
		}
	}, ({ kind: $.TypeKind.Function, params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()))!)
	__defer.defer(() => { (server !== null && (server as any).__isVarRef !== true && (server as any).__goValue === undefined ? ((server as any) as httptest.Server).Close() : httptest.Server.prototype.Close.call($.pointerValue<httptest.Server>(server))) })

	let __goscriptTuple3: any = await http.Get($.pointerValue<httptest.Server>(server).URL + "/?x=1")
	let resp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple3[0]
	let err: $.GoError = __goscriptTuple3[1]
	let resp$: http.Response = resp == null ? $.pointerTarget<http.Response>(resp) : (resp as any).__isVarRef === true ? (resp as any).value : (resp as any).__goValue === undefined ? (resp as any) : $.pointerTarget<http.Response>(resp)
	if (err != null) {
		await $.println("get error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}
	const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => __receiver.Close())($.pointerValue<Exclude<io.ReadCloser, null>>((resp$ as http.Response).Body)), ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo), "io.Closer.Close-fm")
	__defer.defer(async () => { await __goscriptDeferCallee0() })
	await $.println("get status:", (resp$ as http.Response).StatusCode)

	let req = httptest.NewRequest(http.MethodGet, "/?y=2", null!)
	let req$: http.Request = req == null ? $.pointerTarget<http.Request>(req) : (req as any).__isVarRef === true ? (req as any).value : (req as any).__goValue === undefined ? (req as any) : $.pointerTarget<http.Request>(req)
	await $.println("recorded:", (req$ as http.Request).Body != null, url.Values_Get((req$ as http.Request).URL.Query(), "y"), url.Values_Has((req$ as http.Request).URL.Query(), "z"))

	// A parsed *url.URL is a valid request URL.
	let __goscriptTuple4: any = url.Parse("https://example.com:8443/x?y=1")
	let parsed: url.URL | $.VarRef<url.URL> | null = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		await $.println("parse error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}
	;(req$ as http.Request).URL = parsed
	await $.println("assigned:", url.Values_Get((req$ as http.Request).URL.Query(), "y"), (req$ as http.Request).URL.Hostname(), (req$ as http.Request).URL.Port(), (req$ as http.Request).URL.RequestURI())

	// A composite literal takes a *url.URL field directly.
	let literal = new http.Request({Method: http.MethodPost, URL: parsed})
	let literal$: http.Request = literal == null ? $.pointerTarget<http.Request>(literal) : (literal as any).__isVarRef === true ? (literal as any).value : (literal as any).__goValue === undefined ? (literal as any) : $.pointerTarget<http.Request>(literal)
	await $.println("literal:", (literal$ as http.Request).Method, $.pointerValue<url.URL>((literal$ as http.Request).URL).Host, (literal$ as http.Request).URL.RequestURI())

	// RequestURI keeps the escaped path and the query unchanged.
	let targets = $.arrayToSlice<string>(["/a%2Fb/c?q=a/../b&n=5", "/a/b", "http://example.com", "https://user:secret@example.com:8443/p/q%20r?a=1&b=2#frag%20x", "mailto:joe@example.com?subject=hi", "http://example.com/p?"])
	for (let __goscriptRangeTarget0 = targets, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let target = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as string)
		let __goscriptTuple5: any = http.NewRequest(http.MethodGet, target, null!)
		let __goscriptShadow1: http.Request | $.VarRef<http.Request> | null = __goscriptTuple5[0]
		let __goscriptShadow2: $.GoError = __goscriptTuple5[1]
		if (__goscriptShadow2 != null) {
			await $.println("new request error:", (__goscriptAwait = (__goscriptShadow2 !== null && (__goscriptShadow2 as any).__isVarRef !== true && ((__goscriptShadow2 as any).__goValue === undefined || (__goscriptShadow2 as any).__goType?.charCodeAt(0) !== 42) ? (__goscriptShadow2 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow2)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			continue
		}
		await $.println("request uri:", $.pointerValue<http.Request>(__goscriptShadow1).URL.RequestURI())
		await printURL("request", $.pointerValue<http.Request>(__goscriptShadow1).URL)
	}

	// A bad target reports the parse failure as a *url.Error.
	let __goscriptTuple6: any = http.NewRequest(http.MethodGet, "http://example.com/%zz", null!)
	err = __goscriptTuple6[1]
	let urlErr: $.VarRef<url.Error | $.VarRef<url.Error> | null> = $.varRef(null! as url.Error | $.VarRef<url.Error> | null)
	await $.println("bad target:", errors.As($.pointerValueOrNil(err)!, $.interfaceValue(urlErr, "**url.Error", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.pointerType("url.Error")))), $.pointerValue<url.Error>(urlErr.value).Op, $.pointerValue<url.Error>(urlErr.value).URL, (__goscriptAwait = $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<url.Error>(urlErr.value).Err).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	// A handler asks its writer for the optional interfaces by name, as a
	// watch asks for http.Flusher.
	let w: http.ResponseWriter | null = $.interfaceValue<http.ResponseWriter | null>(new streamWriter(false, $.makeMap<string, $.Slice<string>>([])), "*main.streamWriter", /* @__PURE__ */ $.pointerType("main.streamWriter"))
	let [, flusher] = $.typeAssertTuple<http.Flusher | null>(w, "http.Flusher")
	let [, hijacker] = $.typeAssertTuple<http.Hijacker | null>(w, "http.Hijacker")
	let [, notifier] = $.typeAssertTuple<http.CloseNotifier | null>(w, "http.CloseNotifier")
	await $.println("writer interfaces:", flusher, hijacker, notifier)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods("http.noBody", "http.noBody", () => [$.methodSignature("Close", [], ["error"]), $.methodSignature("Read", [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], [/* @__PURE__ */ $.basicType("int"), "error"]), $.methodSignature("WriteTo", ["io.Writer"], [/* @__PURE__ */ $.basicType("int64"), "error"])]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({ServeHTTP: (receiver: any, ...args: any[]) => (http.HandlerFunc_ServeHTTP as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", /* @__PURE__ */ $.pointerType("http.Request")], results: [] } as $.FunctionTypeInfo))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("ServeHTTP", [["w", "http.ResponseWriter"], ["r", /* @__PURE__ */ $.pointerType("http.Request")]])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
