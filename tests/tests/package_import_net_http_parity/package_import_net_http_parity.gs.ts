// Generated file based on package_import_net_http_parity.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as io from "@goscript/io/index.js"
import * as net from "@goscript/net/index.js"
import * as http from "@goscript/net/http/index.js"
import * as httptest from "@goscript/net/http/httptest/index.js"
import * as strings from "@goscript/strings/index.js"
import * as time from "@goscript/time/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as context from "@goscript/context/index.js"
import * as url from "@goscript/net/url/index.js"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/net/url/index.js"

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	// Canonical headers retain every value under the same field name.
	let h = $.makeMap<string, $.Slice<string>>([])
	http.Header_Set(h, "content-type", "text/plain")
	http.Header_Add(h, "content-type", "charset=utf-8")
	await $.println("header:", http.CanonicalHeaderKey("x-test"), await http.Header_Get(h, "CONTENT-TYPE"), $.sliceLen(http.Header_Values(h, "content-type")))

	// Parse protocol versions and look up the method and status constants.
	let [major, minor, ok] = http.ParseHTTPVersion("HTTP/2.0")
	await $.println("proto:", major, minor, ok)
	await $.println("status:", http.MethodPatch, 511, http.StatusText(511))

	// Construct a request with its parsed URL and cookie header.
	let __goscriptTuple0: any = http.NewRequest(http.MethodPut, "https://example.invalid/path?q=1", $.structInterfaceValue<io.Reader | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(http.NoBody))), "http.noBody", __goscriptStatic0())!)
	let req: http.Request | $.VarRef<http.Request> | null = __goscriptTuple0[0]
	let err: $.GoError = __goscriptTuple0[1]
	let req$: http.Request = req == null ? $.pointerTarget<http.Request>(req) : (req as any).__isVarRef === true ? (req as any).value : (req as any).__goValue === undefined ? (req as any) : $.pointerTarget<http.Request>(req)
	if (err != null) {
		await $.println("request error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}
	http.Header_Set((req$ as http.Request).Header, "Cookie", "space=wave")
	await $.println("request:", (req$ as http.Request).Method, $.pointerValue<url.URL>((req$ as http.Request).URL).Path, (req !== null && (req as any).__isVarRef !== true && (req as any).__goValue === undefined ? ((req as any) as http.Request).ProtoAtLeast(1, 1) : http.Request.prototype.ProtoAtLeast.call($.pointerValue<http.Request>(req), 1, 1)), $.sliceLen((req !== null && (req as any).__isVarRef !== true && (req as any).__goValue === undefined ? ((req as any) as http.Request).Cookies() : http.Request.prototype.Cookies.call($.pointerValue<http.Request>(req)))));

	// A cloned request preserves the callback that opens another body reader.
	;(req$ as http.Request).GetBody = $.functionValue((): [io.ReadCloser | null, $.GoError] => {
		return [io.NopCloser($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("again"), "*strings.Reader", __goscriptStatic1()))!), null]
	}, ({ kind: $.TypeKind.Function, params: [], results: ["io.ReadCloser", "error"] } as $.FunctionTypeInfo))
	let __goscriptTuple1: any = ($.pointerValue<http.Request>(http.Request.prototype.Clone.call($.pointerValue<http.Request>(req), $.pointerValueOrNil((req !== null && (req as any).__isVarRef !== true && (req as any).__goValue === undefined ? ((req as any) as http.Request).Context() : http.Request.prototype.Context.call($.pointerValue<http.Request>(req))))!)).GetBody!() as [io.ReadCloser | null, $.GoError])
	let body: io.ReadCloser | null = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		await $.println("getbody error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}
	let __goscriptTuple2: any = await io.ReadAll($.pointerValueOrNil((body as io.Reader | null))!)
	let data: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("getbody:", err == null, $.bytesToString(data))

	// Record an error response with the corresponding status and body.
	let rec: httptest.ResponseRecorder | $.VarRef<httptest.ResponseRecorder> | null = httptest.NewRecorder()
	http.Error($.pointerValueOrNil($.interfaceValue<http.ResponseWriter | null>(rec, "*httptest.ResponseRecorder", __goscriptStatic2()))!, http.ProtocolError.prototype.Error.call($.pointerValue<http.ProtocolError>(http.ErrNotSupported)), 403)
	await $.println("recorder:", $.pointerValue<httptest.ResponseRecorder>(rec).Code, $.pointerValue<bytes.Buffer>($.pointerValue<httptest.ResponseRecorder>(rec).Body).String())

	// Serve the requested content through the ordinary response writer.
	rec = httptest.NewRecorder()
	await http.ServeContent($.pointerValueOrNil($.interfaceValue<http.ResponseWriter | null>(rec, "*httptest.ResponseRecorder", __goscriptStatic2()))!, req, "content.txt", $.markAsStructValue(new time.Time()), $.pointerValueOrNil($.interfaceValue<io.ReadSeeker | null>(strings.NewReader("served"), "*strings.Reader", __goscriptStatic1()))!)
	await $.println("servecontent:", $.pointerValue<httptest.ResponseRecorder>(rec).Code, $.pointerValue<bytes.Buffer>($.pointerValue<httptest.ResponseRecorder>(rec).Body).String())

	// A HEAD response keeps the successful status without sending its body.
	let __goscriptTuple3: any = http.NewRequest(http.MethodHead, "https://example.invalid/content.txt", $.structInterfaceValue<io.Reader | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(http.NoBody))), "http.noBody", __goscriptStatic0())!)
	let headReq: http.Request | $.VarRef<http.Request> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err != null) {
		await $.println("head request error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}
	rec = httptest.NewRecorder()
	await http.ServeContent($.pointerValueOrNil($.interfaceValue<http.ResponseWriter | null>(rec, "*httptest.ResponseRecorder", __goscriptStatic2()))!, headReq, "content.txt", $.markAsStructValue(new time.Time()), $.pointerValueOrNil($.interfaceValue<io.ReadSeeker | null>(strings.NewReader("hidden"), "*strings.Reader", __goscriptStatic1()))!)
	await $.println("servecontent head:", $.pointerValue<httptest.ResponseRecorder>(rec).Code, $.pointerValue<bytes.Buffer>($.pointerValue<httptest.ResponseRecorder>(rec).Body).Len())

	// The TLS test server supplies a client and its configured endpoint.
	let srv = httptest.NewTLSServer($.pointerValueOrNil(http.NotFoundHandler())!)
	__defer.defer(() => { (srv !== null && (srv as any).__isVarRef !== true && (srv as any).__goValue === undefined ? ((srv as any) as httptest.Server).Close() : httptest.Server.prototype.Close.call($.pointerValue<httptest.Server>(srv))) })
	await $.println("server:", !$.stringEqual($.pointerValue<httptest.Server>(srv).URL, ""), (srv !== null && (srv as any).__isVarRef !== true && (srv as any).__goValue === undefined ? ((srv as any) as httptest.Server).Client() : httptest.Server.prototype.Client.call($.pointerValue<httptest.Server>(srv))) != null, httptest.DefaultRemoteAddr)

	// Exercise address-family validation through both loopback socket families.
	await $.println("tcp4:", await transfer("tcp4", "127.0.0.1:0"))
	await $.println("tcp6:", await transfer("tcp6", "[::1]:0"))
}

export async function transfer(network: string, address: string): globalThis.Promise<boolean> {
	await using __defer = new $.AsyncDisposableStack()
	// Accept one connection, keeping the listener alive until the read finishes.
	let [listener, err] = await net.Listen(network, address)
	if (err != null) {
		return false
	}
	const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => __receiver.Close())((listener !== null && (listener as any).__isVarRef !== true && ((listener as any).__goValue === undefined || (listener as any).__goType?.charCodeAt(0) !== 42) ? (listener as Exclude<net.Listener, null>) : $.pointerValue<Exclude<net.Listener, null>>(listener))), ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo), "net.Listener.Close-fm")
	__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee0(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) })

	// Read one payload through the accepted connection.
	let done = $.makeChannel<boolean>(1, false, "both")
	queueMicrotask(async () => {
		await using __defer = new $.AsyncDisposableStack()
		// Close the accepted connection after reading the client's payload.
		let [conn, __goscriptShadow0] = await (listener !== null && (listener as any).__isVarRef !== true && ((listener as any).__goValue === undefined || (listener as any).__goType?.charCodeAt(0) !== 42) ? (listener as Exclude<net.Listener, null>) : $.pointerValue<Exclude<net.Listener, null>>(listener)).Accept()
		if (__goscriptShadow0 != null) {
			await $.chanSend(done, false)
			return
		}
		const __goscriptDeferCallee1 = $.functionValue(((__receiver) => () => __receiver.Close())((conn !== null && (conn as any).__isVarRef !== true && ((conn as any).__goValue === undefined || (conn as any).__goType?.charCodeAt(0) !== 42) ? (conn as Exclude<net.Conn, null>) : $.pointerValue<Exclude<net.Conn, null>>(conn))), ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo), "net.Conn.Close-fm")
		__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee1(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) });

		// Bound the real I/O and check the bytes rather than only dial success.
		;(__goscriptAwait = (conn !== null && (conn as any).__isVarRef !== true && ((conn as any).__goValue === undefined || (conn as any).__goType?.charCodeAt(0) !== 42) ? (conn as Exclude<net.Conn, null>) : $.pointerValue<Exclude<net.Conn, null>>(conn)).SetReadDeadline($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(5000000000n)))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		let data = $.makeSlice<number>(4, undefined, "byte")
		let __goscriptTuple4: any = await io.ReadFull($.pointerValueOrNil((conn as io.Reader | null))!, data)
		__goscriptShadow0 = __goscriptTuple4[1]
		await $.chanSend(done, (__goscriptShadow0 == null) && ($.stringEqual($.bytesToString(data), "ping")))
	})

	// Dial the allocated address and wait for the receiver's result.
	let __goscriptTuple5: any = await net.DialTimeout(network, (__goscriptAwait = $.pointerValue<Exclude<net.Addr, null>>((__goscriptAwait = (listener !== null && (listener as any).__isVarRef !== true && ((listener as any).__goValue === undefined || (listener as any).__goType?.charCodeAt(0) !== 42) ? (listener as Exclude<net.Listener, null>) : $.pointerValue<Exclude<net.Listener, null>>(listener)).Addr(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), 5000000000n)
	let conn: net.Conn | null = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	if (err != null) {
		return false
	}
	const __goscriptDeferCallee2 = $.functionValue(((__receiver) => () => __receiver.Close())((conn !== null && (conn as any).__isVarRef !== true && ((conn as any).__goValue === undefined || (conn as any).__goType?.charCodeAt(0) !== 42) ? (conn as Exclude<net.Conn, null>) : $.pointerValue<Exclude<net.Conn, null>>(conn))), ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo), "net.Conn.Close-fm")
	__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee2(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) });
	;(__goscriptAwait = (conn !== null && (conn as any).__isVarRef !== true && ((conn as any).__goValue === undefined || (conn as any).__goType?.charCodeAt(0) !== 42) ? (conn as Exclude<net.Conn, null>) : $.pointerValue<Exclude<net.Conn, null>>(conn)).SetWriteDeadline($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Now())).Add(5000000000n)))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	{
		let __goscriptTuple6: any = await (conn !== null && (conn as any).__isVarRef !== true && ((conn as any).__goValue === undefined || (conn as any).__goType?.charCodeAt(0) !== 42) ? (conn as Exclude<net.Conn, null>) : $.pointerValue<Exclude<net.Conn, null>>(conn)).Write(new Uint8Array([112, 105, 110, 103]))
		err = __goscriptTuple6[1]
		if (err != null) {
			return false
		}
	}
	return await $.chanRecv(done)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods("http.noBody", "http.noBody", () => [$.methodSignature("Close", [], ["error"]), $.methodSignature("Read", [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], [/* @__PURE__ */ $.basicType("int"), "error"]), $.methodSignature("WriteTo", ["io.Writer"], [/* @__PURE__ */ $.basicType("int64"), "error"])]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("strings.Reader"), "strings.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["s", /* @__PURE__ */ $.basicType("string")]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("httptest.ResponseRecorder"), "httptest.ResponseRecorder", () => [$.methodSignature("Flush", [], [], true), $.methodSignature("Header", [], ["http.Header"], true), $.methodSignature("Result", [], [/* @__PURE__ */ $.pointerType("http.Response")], true), $.methodSignature("Write", [["buf", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("int"), "error"], true), $.methodSignature("WriteHeader", [["code", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("WriteString", [["str", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("int"), "error"], true)]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
