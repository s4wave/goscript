// Generated file based on url.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as path2 from "@goscript/path/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import "@goscript/unsafe/index.js"

import * as __goscript_encoding_table from "./encoding_table.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/path/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "./encoding_table.gs.ts"

export type EscapeError = string

export type InvalidHostError = string

export type Values = globalThis.Map<string, $.Slice<string>> | null

export class Error {
	public declare Op: string

	public declare URL: string

	public declare Err: $.GoError

	public _fields: {
		Op: string
		URL: string
		Err: $.GoError
	}

	constructor(init?: Partial<{Op?: string, URL?: string, Err?: $.GoError}>) {
		this._fields = {
			Op: init?.Op ?? ("" as string),
			URL: init?.URL ?? ("" as string),
			Err: init?.Err ?? (null! as $.GoError)
		}
	}

	public clone(): Error {
		return $.markAsStructValue(new Error(this))
	}

	public async Error(): globalThis.Promise<string> {
		const e: Error | $.VarRef<Error> | null = this;
		return fmt.Sprintf("%s %q: %s", $.pointerValue<Error>(e).Op, $.pointerValue<Error>(e).URL, ($.pointerValue<Error>(e).Err as any))
	}

	public async Temporary(): globalThis.Promise<boolean> {
		const e: Error | $.VarRef<Error> | null = this;
		let [t, ok] = $.typeAssertTuple<any>($.pointerValue<Error>(e).Err, { kind: $.TypeKind.Interface, methods: [{ name: "Temporary", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("bool") }] }] })
		return ok && await $.pointerValue<any>(t).Temporary()
	}

	public async Timeout(): globalThis.Promise<boolean> {
		const e: Error | $.VarRef<Error> | null = this;
		let [t, ok] = $.typeAssertTuple<any>($.pointerValue<Error>(e).Err, { kind: $.TypeKind.Interface, methods: [{ name: "Timeout", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("bool") }] }] })
		return ok && await $.pointerValue<any>(t).Timeout()
	}

	public Unwrap(): $.GoError {
		const e: Error | $.VarRef<Error> | null = this;
		return $.pointerValue<Error>(e).Err
	}

	static {
		$.bindStructFields(this.prototype, ["Op", "URL", "Err"])
	}

	static __typeInfo = $.registerStructType(
		"url.Error",
		() => new Error(),
		() => [{ name: "Error", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Temporary", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Timeout", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Unwrap", args: [], returns: [{ type: "error" }] }],
		Error,
		() => [{ name: "Op", key: "Op", type: /* @__PURE__ */ $.basicType("string") }, { name: "URL", key: "URL", type: /* @__PURE__ */ $.basicType("string") }, { name: "Err", key: "Err", type: "error" }]
	)
}

export class URL {
	public declare Scheme: string

	public declare Opaque: string

	public declare User: Userinfo | $.VarRef<Userinfo> | null

	public declare Host: string

	public declare Path: string

	public declare Fragment: string

	// RawQuery contains the encoded query values, without the initial '?'.
	// Use URL.Query to decode the query.
	public declare RawQuery: string

	// RawPath is an optional field containing an encoded path hint.
	// See the EscapedPath method for more details.
	//
	// In general, code should call EscapedPath instead of reading RawPath.
	public declare RawPath: string

	// RawFragment is an optional field containing an encoded fragment hint.
	// See the EscapedFragment method for more details.
	//
	// In general, code should call EscapedFragment instead of reading RawFragment.
	public declare RawFragment: string

	// ForceQuery indicates whether the original URL contained a query ('?') character.
	// When set, the String method will include a trailing '?', even when RawQuery is empty.
	public declare ForceQuery: boolean

	// OmitHost indicates the URL has an empty host (authority).
	// When set, the String method will not include the host when it is empty.
	public declare OmitHost: boolean

	public _fields: {
		Scheme: string
		Opaque: string
		User: Userinfo | $.VarRef<Userinfo> | null
		Host: string
		Path: string
		Fragment: string
		RawQuery: string
		RawPath: string
		RawFragment: string
		ForceQuery: boolean
		OmitHost: boolean
	}

	constructor(init?: Partial<{Scheme?: string, Opaque?: string, User?: Userinfo | $.VarRef<Userinfo> | null, Host?: string, Path?: string, Fragment?: string, RawQuery?: string, RawPath?: string, RawFragment?: string, ForceQuery?: boolean, OmitHost?: boolean}>) {
		this._fields = {
			Scheme: init?.Scheme ?? ("" as string),
			Opaque: init?.Opaque ?? ("" as string),
			User: init?.User ?? (null! as Userinfo | $.VarRef<Userinfo> | null),
			Host: init?.Host ?? ("" as string),
			Path: init?.Path ?? ("" as string),
			Fragment: init?.Fragment ?? ("" as string),
			RawQuery: init?.RawQuery ?? ("" as string),
			RawPath: init?.RawPath ?? ("" as string),
			RawFragment: init?.RawFragment ?? ("" as string),
			ForceQuery: init?.ForceQuery ?? (false as boolean),
			OmitHost: init?.OmitHost ?? (false as boolean)
		}
	}

	public clone(): URL {
		return $.markAsStructValue(new URL(this))
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const u: URL | $.VarRef<URL> | null = this;
		return [$.appendSlice(b, $.stringToBytes(URL.prototype.String.call(u)), $.byteSliceHint), null]
	}

	public Clone(): URL | $.VarRef<URL> | null {
		const u: URL | $.VarRef<URL> | null = this;
		if (u == null) {
			return null
		}

		let uc: URL | $.VarRef<URL> | null = $.varRef<URL>($.markAsStructValue($.cloneStructValue($.pointerValue<URL>(u))))
		if ($.pointerValue<URL>(u).User != null) {
			$.pointerValue<URL>(uc).User = $.varRef<Userinfo>($.markAsStructValue($.cloneStructValue($.pointerValue<Userinfo>($.pointerValue<URL>(u).User))))
		}
		return uc
	}

	public EscapedFragment(): string {
		const u: URL | $.VarRef<URL> | null = this;
		if ((!$.stringEqual($.pointerValue<URL>(u).RawFragment, "")) && validEncoded($.pointerValue<URL>(u).RawFragment, 64)) {
			let [f, err] = unescape($.pointerValue<URL>(u).RawFragment, 64)
			if ((err == null) && ($.stringEqual(f, $.pointerValue<URL>(u).Fragment))) {
				return $.pointerValue<URL>(u).RawFragment
			}
		}
		return escape($.pointerValue<URL>(u).Fragment, 64)
	}

	public EscapedPath(): string {
		const u: URL | $.VarRef<URL> | null = this;
		if ((!$.stringEqual($.pointerValue<URL>(u).RawPath, "")) && validEncoded($.pointerValue<URL>(u).RawPath, 1)) {
			let [p, err] = unescape($.pointerValue<URL>(u).RawPath, 1)
			if ((err == null) && ($.stringEqual(p, $.pointerValue<URL>(u).Path))) {
				return $.pointerValue<URL>(u).RawPath
			}
		}
		if ($.stringEqual($.pointerValue<URL>(u).Path, "*")) {
			return "*"
		}
		return escape($.pointerValue<URL>(u).Path, 1)
	}

	public Hostname(): string {
		const u: URL | $.VarRef<URL> | null = this;
		let [host, ] = splitHostPort($.pointerValue<URL>(u).Host)
		return host
	}

	public IsAbs(): boolean {
		const u: URL | $.VarRef<URL> | null = this;
		return !$.stringEqual($.pointerValue<URL>(u).Scheme, "")
	}

	public JoinPath(elem: $.Slice<string>): URL | $.VarRef<URL> | null {
		const u: URL | $.VarRef<URL> | null = this;
		let __goscriptTuple0: any = URL.prototype.joinPath.call(u, elem)
		let url: URL | $.VarRef<URL> | null = __goscriptTuple0[0]
		return url
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const u: URL | $.VarRef<URL> | null = this;
		let text: $.Slice<number> = null! as $.Slice<number>
		let err: $.GoError = null! as $.GoError
		return URL.prototype.AppendBinary.call(u, null)
	}

	public Parse(ref: string): [URL | $.VarRef<URL> | null, $.GoError] {
		const u: URL | $.VarRef<URL> | null = this;
		let __goscriptTuple1: any = Parse(ref)
		let refURL: URL | $.VarRef<URL> | null = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return [URL.prototype.ResolveReference.call(u, refURL), null]
	}

	public Port(): string {
		const u: URL | $.VarRef<URL> | null = this;
		let [, port] = splitHostPort($.pointerValue<URL>(u).Host)
		return port
	}

	public Query(): Values {
		const u: URL | $.VarRef<URL> | null = this;
		let __goscriptTuple2: any = ParseQuery($.pointerValue<URL>(u).RawQuery)
		let v: Values = __goscriptTuple2[0]
		return v
	}

	public Redacted(): string {
		const u: URL | $.VarRef<URL> | null = this;
		if (u == null) {
			return ""
		}

		let ru = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<URL>(u))))
		{
			let [, has] = Userinfo.prototype.Password.call(ru.value.User)
			if (has) {
				ru.value.User = UserPassword(Userinfo.prototype.Username.call(ru.value.User), "xxxxx")
			}
		}
		return ru.value.String()
	}

	public RequestURI(): string {
		const u: URL | $.VarRef<URL> | null = this;
		let result = $.pointerValue<URL>(u).Opaque
		if ($.stringEqual(result, "")) {
			result = URL.prototype.EscapedPath.call(u)
			if ($.stringEqual(result, "")) {
				result = "/"
			}
		} else {
			if (strings.HasPrefix(result, "//")) {
				result = ($.pointerValue<URL>(u).Scheme + ":") + result
			}
		}
		if ($.pointerValue<URL>(u).ForceQuery || (!$.stringEqual($.pointerValue<URL>(u).RawQuery, ""))) {
			result = result + ("?" + $.pointerValue<URL>(u).RawQuery)
		}
		return result
	}

	public ResolveReference(ref: URL | $.VarRef<URL> | null): URL | $.VarRef<URL> | null {
		const u: URL | $.VarRef<URL> | null = this;
		let url = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<URL>(ref))))
		if ($.stringEqual($.pointerValue<URL>(ref).Scheme, "")) {
			url.value.Scheme = $.pointerValue<URL>(u).Scheme
		}
		if (((!$.stringEqual($.pointerValue<URL>(ref).Scheme, "")) || (!$.stringEqual($.pointerValue<URL>(ref).Host, ""))) || ($.pointerValue<URL>(ref).User != null)) {
			// The "absoluteURI" or "net_path" cases.
			// We can ignore the error from setPath since we know we provided a
			// validly-escaped path.
			url.value.setPath(resolvePath(URL.prototype.EscapedPath.call(ref), ""))
			return url
		}
		if (!$.stringEqual($.pointerValue<URL>(ref).Opaque, "")) {
			url.value.User = null
			url.value.Host = ""
			url.value.Path = ""
			return url
		}
		if ((($.stringEqual($.pointerValue<URL>(ref).Path, "")) && !$.pointerValue<URL>(ref).ForceQuery) && ($.stringEqual($.pointerValue<URL>(ref).RawQuery, ""))) {
			url.value.RawQuery = $.pointerValue<URL>(u).RawQuery
			if ($.stringEqual($.pointerValue<URL>(ref).Fragment, "")) {
				url.value.Fragment = $.pointerValue<URL>(u).Fragment
				url.value.RawFragment = $.pointerValue<URL>(u).RawFragment
			}
		}
		if (($.stringEqual($.pointerValue<URL>(ref).Path, "")) && (!$.stringEqual($.pointerValue<URL>(u).Opaque, ""))) {
			url.value.Opaque = $.pointerValue<URL>(u).Opaque
			url.value.User = null
			url.value.Host = ""
			url.value.Path = ""
			return url
		}
		// The "abs_path" or "rel_path" cases.
		url.value.Host = $.pointerValue<URL>(u).Host
		url.value.User = $.pointerValue<URL>(u).User
		url.value.setPath(resolvePath(URL.prototype.EscapedPath.call(u), URL.prototype.EscapedPath.call(ref)))
		return url
	}

	public String(): string {
		const u: URL | $.VarRef<URL> | null = this;
		let buf: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))

		let n = $.len($.pointerValue<URL>(u).Scheme)
		if (!$.stringEqual($.pointerValue<URL>(u).Opaque, "")) {
			n = n + ($.len($.pointerValue<URL>(u).Opaque))
		} else {
			if (!$.pointerValue<URL>(u).OmitHost && (((!$.stringEqual($.pointerValue<URL>(u).Scheme, "")) || (!$.stringEqual($.pointerValue<URL>(u).Host, ""))) || ($.pointerValue<URL>(u).User != null))) {
				let username = Userinfo.prototype.Username.call($.pointerValue<URL>(u).User)
				let [password, ] = Userinfo.prototype.Password.call($.pointerValue<URL>(u).User)
				n = n + (($.len(username) + $.len(password)) + $.len($.pointerValue<URL>(u).Host))
			}
			n = n + ($.len($.pointerValue<URL>(u).Path))
		}
		n = n + ($.len($.pointerValue<URL>(u).RawQuery) + $.len($.pointerValue<URL>(u).RawFragment))
		n = n + (12)
		buf.value.Grow(n)

		if (!$.stringEqual($.pointerValue<URL>(u).Scheme, "")) {
			buf.value.WriteString($.pointerValue<URL>(u).Scheme)
			buf.value.WriteByte(58)
		}
		if (!$.stringEqual($.pointerValue<URL>(u).Opaque, "")) {
			buf.value.WriteString($.pointerValue<URL>(u).Opaque)
		} else {
			if (((!$.stringEqual($.pointerValue<URL>(u).Scheme, "")) || (!$.stringEqual($.pointerValue<URL>(u).Host, ""))) || ($.pointerValue<URL>(u).User != null)) {
				if (($.pointerValue<URL>(u).OmitHost && ($.stringEqual($.pointerValue<URL>(u).Host, ""))) && ($.pointerValue<URL>(u).User == null)) {
				} else {
					if (((!$.stringEqual($.pointerValue<URL>(u).Host, "")) || (!$.stringEqual($.pointerValue<URL>(u).Path, ""))) || ($.pointerValue<URL>(u).User != null)) {
						buf.value.WriteString("//")
					}
					{
						let ui: Userinfo | $.VarRef<Userinfo> | null = $.pointerValue<URL>(u).User
						if (ui != null) {
							buf.value.WriteString(Userinfo.prototype.String.call(ui))
							buf.value.WriteByte(64)
						}
					}
					{
						let h = $.pointerValue<URL>(u).Host
						if (!$.stringEqual(h, "")) {
							buf.value.WriteString(escape(h, 4))
						}
					}
				}
			}
			let __goscriptShadow0 = URL.prototype.EscapedPath.call(u)
			if ((($.pointerValue<URL>(u).OmitHost && ($.stringEqual($.pointerValue<URL>(u).Host, ""))) && ($.pointerValue<URL>(u).User == null)) && strings.HasPrefix(__goscriptShadow0, "//")) {
				// Escape the first / in a path starting with "//" and no authority
				// so that re-parsing the URL doesn't turn the path into an authority
				// (e.g., Path="//host/p" producing "http://host/p").
				buf.value.WriteString("%2F")
				__goscriptShadow0 = $.sliceStringOrBytes(__goscriptShadow0, 1, undefined)
			}
			if (((!$.stringEqual(__goscriptShadow0, "")) && ($.uint($.indexStringOrBytes(__goscriptShadow0, 0), 8) != 47)) && (!$.stringEqual($.pointerValue<URL>(u).Host, ""))) {
				buf.value.WriteByte(47)
			}
			if (buf.value.Len() == 0) {
				// RFC 3986 §4.2
				// A path segment that contains a colon character (e.g., "this:that")
				// cannot be used as the first segment of a relative-path reference, as
				// it would be mistaken for a scheme name. Such a segment must be
				// preceded by a dot-segment (e.g., "./this:that") to make a relative-
				// path reference.
				{
					let [segment, , ] = strings.Cut(__goscriptShadow0, "/")
					if (strings.Contains(segment, ":")) {
						buf.value.WriteString("./")
					}
				}
			}
			buf.value.WriteString(__goscriptShadow0)
		}
		if ($.pointerValue<URL>(u).ForceQuery || (!$.stringEqual($.pointerValue<URL>(u).RawQuery, ""))) {
			buf.value.WriteByte(63)
			buf.value.WriteString($.pointerValue<URL>(u).RawQuery)
		}
		if (!$.stringEqual($.pointerValue<URL>(u).Fragment, "")) {
			buf.value.WriteByte(35)
			buf.value.WriteString(URL.prototype.EscapedFragment.call(u))
		}
		return buf.value.String()
	}

	public UnmarshalBinary(text: $.Slice<number>): $.GoError {
		let u: URL | $.VarRef<URL> | null = this;
		let __goscriptTuple3: any = Parse($.bytesToString(text))
		let u1: URL | $.VarRef<URL> | null = __goscriptTuple3[0]
		let err = __goscriptTuple3[1]
		if (err != null) {
			return err
		}
		$.assignStruct($.pointerValue<URL>(u), $.markAsStructValue($.cloneStructValue($.pointerValue<URL>(u1))))
		return null
	}

	public joinPath(elem: $.Slice<string>): [URL | $.VarRef<URL> | null, $.GoError] {
		const u: URL | $.VarRef<URL> | null = this;
		elem = $.appendSlice($.arrayToSlice<string>([URL.prototype.EscapedPath.call(u)]), elem)
		let p: string = ""
		if (!strings.HasPrefix($.arrayIndex(elem!, 0), "/")) {
			// Return a relative path if u is relative,
			// but ensure that it contains no ../ elements.
			elem![0] = "/" + $.arrayIndex(elem!, 0)
			p = $.sliceStringOrBytes(path2.Join(...(elem ?? [])), 1, undefined)
		} else {
			p = path2.Join(...(elem ?? []))
		}
		// path.Join will remove any trailing slashes.
		// Preserve at least one.
		if (strings.HasSuffix($.arrayIndex(elem!, $.len(elem) - 1), "/") && !strings.HasSuffix(p, "/")) {
			p = p + ("/")
		}
		let url = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<URL>(u))))
		let err = url.value.setPath(p)
		return [url, err]
	}

	public setFragment(f: string): $.GoError {
		let u: URL | $.VarRef<URL> | null = this;
		let [frag, err] = unescape(f, 64)
		if (err != null) {
			return err
		}
		$.pointerValue<URL>(u).Fragment = frag
		{
			let escf = escape(frag, 64)
			if ($.stringEqual(f, escf)) {
				// Default encoding is fine.
				$.pointerValue<URL>(u).RawFragment = ""
			} else {
				$.pointerValue<URL>(u).RawFragment = f
			}
		}
		return null
	}

	public setPath(p: string): $.GoError {
		let u: URL | $.VarRef<URL> | null = this;
		let [__goscriptShadow1, err] = unescape(p, 1)
		if (err != null) {
			return err
		}
		$.pointerValue<URL>(u).Path = __goscriptShadow1
		{
			let escp = escape(__goscriptShadow1, 1)
			if ($.stringEqual(p, escp)) {
				// Default encoding is fine.
				$.pointerValue<URL>(u).RawPath = ""
			} else {
				$.pointerValue<URL>(u).RawPath = p
			}
		}
		return null
	}

	static {
		$.bindStructFields(this.prototype, ["Scheme", "Opaque", "User", "Host", "Path", "Fragment", "RawQuery", "RawPath", "RawFragment", "ForceQuery", "OmitHost"])
	}

	static __typeInfo = $.registerStructType(
		"url.URL",
		() => new URL(),
		() => [{ name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "Clone", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("url.URL") }] }, { name: "EscapedFragment", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "EscapedPath", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Hostname", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "IsAbs", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "JoinPath", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("url.URL") }] }, { name: "MarshalBinary", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "Parse", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("url.URL") }, { type: "error" }] }, { name: "Port", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Query", args: [], returns: [{ type: "url.Values" }] }, { name: "Redacted", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "RequestURI", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "ResolveReference", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("url.URL") }] }, { name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "joinPath", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("url.URL") }, { type: "error" }] }, { name: "setFragment", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "setPath", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		URL,
		() => [{ name: "Scheme", key: "Scheme", type: /* @__PURE__ */ $.basicType("string") }, { name: "Opaque", key: "Opaque", type: /* @__PURE__ */ $.basicType("string") }, { name: "User", key: "User", type: /* @__PURE__ */ $.pointerType("url.Userinfo") }, { name: "Host", key: "Host", type: /* @__PURE__ */ $.basicType("string") }, { name: "Path", key: "Path", type: /* @__PURE__ */ $.basicType("string") }, { name: "Fragment", key: "Fragment", type: /* @__PURE__ */ $.basicType("string") }, { name: "RawQuery", key: "RawQuery", type: /* @__PURE__ */ $.basicType("string") }, { name: "RawPath", key: "RawPath", type: /* @__PURE__ */ $.basicType("string") }, { name: "RawFragment", key: "RawFragment", type: /* @__PURE__ */ $.basicType("string") }, { name: "ForceQuery", key: "ForceQuery", type: /* @__PURE__ */ $.basicType("bool") }, { name: "OmitHost", key: "OmitHost", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export class Userinfo {
	public declare username: string

	public declare password: string

	public declare passwordSet: boolean

	public _fields: {
		username: string
		password: string
		passwordSet: boolean
	}

	constructor(init?: Partial<{username?: string, password?: string, passwordSet?: boolean}>) {
		this._fields = {
			username: init?.username ?? ("" as string),
			password: init?.password ?? ("" as string),
			passwordSet: init?.passwordSet ?? (false as boolean)
		}
	}

	public clone(): Userinfo {
		return $.markAsStructValue(new Userinfo(this))
	}

	public Password(): [string, boolean] {
		const u: Userinfo | $.VarRef<Userinfo> | null = this;
		if (u == null) {
			return ["", false]
		}
		return [$.pointerValue<Userinfo>(u).password, $.pointerValue<Userinfo>(u).passwordSet]
	}

	public String(): string {
		const u: Userinfo | $.VarRef<Userinfo> | null = this;
		if (u == null) {
			return ""
		}
		let s = escape($.pointerValue<Userinfo>(u).username, 16)
		if ($.pointerValue<Userinfo>(u).passwordSet) {
			s = s + (":" + escape($.pointerValue<Userinfo>(u).password, 16))
		}
		return s
	}

	public Username(): string {
		const u: Userinfo | $.VarRef<Userinfo> | null = this;
		if (u == null) {
			return ""
		}
		return $.pointerValue<Userinfo>(u).username
	}

	static {
		$.bindStructFields(this.prototype, ["username", "password", "passwordSet"])
	}

	static __typeInfo = $.registerStructType(
		"url.Userinfo",
		() => new Userinfo(),
		() => [{ name: "Password", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }, { type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Username", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		Userinfo,
		() => [{ name: "username", key: "username", type: /* @__PURE__ */ $.basicType("string") }, { name: "password", key: "password", type: /* @__PURE__ */ $.basicType("string") }, { name: "passwordSet", key: "passwordSet", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export const upperhex: string = "0123456789ABCDEF"

export const defaultMaxParams: number = 10000

export let urlstrictcolons: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("urlstrictcolons")

export function __goscript_set_urlstrictcolons(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	urlstrictcolons = __goscriptValue
}

export function ishex(c: number): boolean {
	return $.uint(($.arrayIndex(__goscript_encoding_table.table, c) & 128), 8) != 0
}

export function unhex(c: number): number {
	return $.uint((9 * ($.uintShr(c, 6, 8))) + (c & 15), 8)
}

export function EscapeError_Error(e: EscapeError): string {
	return "invalid URL escape " + strconv.Quote(e)
}

export function InvalidHostError_Error(e: InvalidHostError): string {
	return ("invalid character " + strconv.Quote(e)) + " in host name"
}

export function shouldEscape(c: number, mode: __goscript_encoding_table.encoding): boolean {
	return $.uint(($.arrayIndex(__goscript_encoding_table.table, c) & mode), 8) == 0
}

export function QueryUnescape(s: string): [string, $.GoError] {
	return unescape(s, 32)
}

export function PathUnescape(s: string): [string, $.GoError] {
	return unescape(s, 2)
}

export function unescape(s: string, mode: __goscript_encoding_table.encoding): [string, $.GoError] {
	// Count %, check that they're well-formed.
	let n = 0
	let hasPlus = false
	for (let i = 0; i < $.len(s); ) {
		switch ($.indexStringOrBytes(s, i)) {
			case 37:
			{
				n++
				if ((((i + 2) >= $.len(s)) || !ishex($.uint($.indexStringOrBytes(s, i + 1), 8))) || !ishex($.uint($.indexStringOrBytes(s, i + 2), 8))) {
					s = $.sliceStringOrBytes(s, i, undefined)
					if ($.len(s) > 3) {
						s = $.sliceStringOrBytes(s, undefined, 3)
					}
					return ["", $.namedValueInterfaceValue<$.GoError>(s, "url.EscapeError", {"Error": EscapeError_Error}, /* @__PURE__ */ $.basicType("string", "url.EscapeError"))]
				}
				// Per https://tools.ietf.org/html/rfc3986#page-21
				// in the host component %-encoding can only be used
				// for non-ASCII bytes.
				// But https://tools.ietf.org/html/rfc6874#section-2
				// introduces %25 being allowed to escape a percent sign
				// in IPv6 scoped-address literals. Yay.
				if ((($.uint(mode, 8) == 4) && ($.uint(unhex($.uint($.indexStringOrBytes(s, i + 1), 8)), 8) < 8)) && (!$.stringEqual($.sliceStringOrBytes(s, i, i + 3), "%25"))) {
					return ["", $.namedValueInterfaceValue<$.GoError>($.sliceStringOrBytes(s, i, i + 3), "url.EscapeError", {"Error": EscapeError_Error}, /* @__PURE__ */ $.basicType("string", "url.EscapeError"))]
				}
				if ($.uint(mode, 8) == 8) {
					// RFC 6874 says basically "anything goes" for zone identifiers
					// and that even non-ASCII can be redundantly escaped,
					// but it seems prudent to restrict %-escaped bytes here to those
					// that are valid host name bytes in their unescaped form.
					// That is, you can use escaping in the zone identifier but not
					// to introduce bytes you couldn't just write directly.
					// But Windows puts spaces here! Yay.
					let v = $.uint((unhex($.uint($.indexStringOrBytes(s, i + 1), 8)) << 4) | unhex($.uint($.indexStringOrBytes(s, i + 2), 8)), 8)
					if (((!$.stringEqual($.sliceStringOrBytes(s, i, i + 3), "%25")) && ($.uint(v, 8) != 32)) && shouldEscape($.uint(v, 8), 4)) {
						return ["", $.namedValueInterfaceValue<$.GoError>($.sliceStringOrBytes(s, i, i + 3), "url.EscapeError", {"Error": EscapeError_Error}, /* @__PURE__ */ $.basicType("string", "url.EscapeError"))]
					}
				}
				i = i + (3)
				break
			}
			case 43:
			{
				hasPlus = $.uint(mode, 8) == 32
				i++
				break
			}
			default:
			{
				if (((($.uint(mode, 8) == 4) || ($.uint(mode, 8) == 8)) && ($.uint($.indexStringOrBytes(s, i), 8) < 0x80)) && shouldEscape($.uint($.indexStringOrBytes(s, i), 8), $.uint(mode, 8))) {
					return ["", $.namedValueInterfaceValue<$.GoError>($.sliceStringOrBytes(s, i, i + 1), "url.InvalidHostError", {"Error": InvalidHostError_Error}, /* @__PURE__ */ $.basicType("string", "url.InvalidHostError"))]
				}
				i++
				break
			}
		}
	}

	if ((n == 0) && !hasPlus) {
		return [s, null]
	}

	let unescapedPlusSign: number = 0
	switch (mode) {
		case 32:
		{
			unescapedPlusSign = 32
			break
		}
		default:
		{
			unescapedPlusSign = 43
			break
		}
	}
	let t: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	t.value.Grow($.len(s) - (2 * n))
	for (let i = 0; i < $.len(s); i++) {
		switch ($.indexStringOrBytes(s, i)) {
			case 37:
			{
				t.value.WriteByte($.uint((unhex($.uint($.indexStringOrBytes(s, i + 1), 8)) << 4) | unhex($.uint($.indexStringOrBytes(s, i + 2), 8)), 8))
				i = i + (2)
				break
			}
			case 43:
			{
				t.value.WriteByte($.uint(unescapedPlusSign, 8))
				break
			}
			default:
			{
				t.value.WriteByte($.uint($.indexStringOrBytes(s, i), 8))
				break
			}
		}
	}
	return [t.value.String(), null]
}

export function QueryEscape(s: string): string {
	return escape(s, 32)
}

export function PathEscape(s: string): string {
	return escape(s, 2)
}

export function escape(s: string, mode: __goscript_encoding_table.encoding): string {
	let spaceCount = 0
	let hexCount = 0
	for (let __goscriptRangeTarget0 = $.stringToBytes(s), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let c = $.uint(__goscriptRangeTarget0![__rangeIndex], 8)
		if (shouldEscape($.uint(c, 8), $.uint(mode, 8))) {
			if (($.uint(c, 8) == 32) && ($.uint(mode, 8) == 32)) {
				spaceCount++
			} else {
				hexCount++
			}
		}
	}

	if ((spaceCount == 0) && (hexCount == 0)) {
		return s
	}

	let buf: Uint8Array = $.arrayValue(new Uint8Array(64))
	let t: $.Slice<number> = null! as $.Slice<number>

	let required = $.len(s) + (2 * hexCount)
	if (required <= 64) {
		t = $.goSlice(buf, undefined, required)
	} else {
		t = $.makeSlice<number>(required, undefined, "byte")
	}

	if (hexCount == 0) {
		$.copy(t, s)
		for (let i = 0; i < $.len(s); i++) {
			if ($.uint($.indexStringOrBytes(s, i), 8) == 32) {
				t![i] = 43
			}
		}
		return $.bytesToString(t)
	}

	let j = 0
	for (let __goscriptRangeTarget1 = $.stringToBytes(s), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let c = $.uint(__goscriptRangeTarget1![__rangeIndex], 8)
		switch ((true as boolean)) {
			case ($.uint(c, 8) == 32) && ($.uint(mode, 8) == 32):
			{
				t![j] = 43
				j++
				break
			}
			case shouldEscape($.uint(c, 8), $.uint(mode, 8)):
			{
				t![j] = 37
				t![j + 1] = $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x41\x42\x43\x44\x45\x46", $.uintShr(c, 4, 8)), 8)
				t![j + 2] = $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x41\x42\x43\x44\x45\x46", c & 15), 8)
				j = j + (3)
				break
			}
			default:
			{
				t![j] = $.uint(c, 8)
				j++
				break
			}
		}
	}
	return $.bytesToString(t)
}

export function User(username: string): Userinfo | $.VarRef<Userinfo> | null {
	return new Userinfo({username: username, password: "", passwordSet: false})
}

export function UserPassword(username: string, password: string): Userinfo | $.VarRef<Userinfo> | null {
	return new Userinfo({username: username, password: password, passwordSet: true})
}

export function getScheme(rawURL: string): [string, string, $.GoError] {
	let scheme: string = ""
	let path: string = ""
	let err: $.GoError = null! as $.GoError
	for (let i = 0; i < $.len(rawURL); i++) {
		let c = $.uint($.indexStringOrBytes(rawURL, i), 8)
		switch ((true as boolean)) {
			case ((97 <= $.uint(c, 8)) && ($.uint(c, 8) <= 122)) || ((65 <= $.uint(c, 8)) && ($.uint(c, 8) <= 90)):
			{
				break
			}
			case ((((48 <= $.uint(c, 8)) && ($.uint(c, 8) <= 57)) || ($.uint(c, 8) == 43)) || ($.uint(c, 8) == 45)) || ($.uint(c, 8) == 46):
			{
				if (i == 0) {
					return ["", rawURL, null]
				}
				break
			}
			case $.uint(c, 8) == 58:
			{
				if (i == 0) {
					return ["", "", errors.New("missing protocol scheme")]
				}
				return [$.sliceStringOrBytes(rawURL, undefined, i), $.sliceStringOrBytes(rawURL, i + 1, undefined), null]
				break
			}
			default:
			{
				return ["", rawURL, null]
				break
			}
		}
	}
	return ["", rawURL, null]
}

export function Parse(rawURL: string): [URL | $.VarRef<URL> | null, $.GoError] {
	// Cut off #frag
	let [u, frag, ] = strings.Cut(rawURL, "#")
	let __goscriptTuple4: any = parse(u, false)
	let url: URL | $.VarRef<URL> | null = __goscriptTuple4[0]
	let err = __goscriptTuple4[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>(new Error({Op: "parse", URL: u, Err: err}), "*url.Error", /* @__PURE__ */ $.pointerType("url.Error"))]
	}
	if ($.stringEqual(frag, "")) {
		return [url, null]
	}
	{
		err = URL.prototype.setFragment.call(url, frag)
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new Error({Op: "parse", URL: rawURL, Err: err}), "*url.Error", /* @__PURE__ */ $.pointerType("url.Error"))]
		}
	}
	return [url, null]
}

export function ParseRequestURI(rawURL: string): [URL | $.VarRef<URL> | null, $.GoError] {
	let __goscriptTuple5: any = parse(rawURL, true)
	let url: URL | $.VarRef<URL> | null = __goscriptTuple5[0]
	let err = __goscriptTuple5[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>(new Error({Op: "parse", URL: rawURL, Err: err}), "*url.Error", /* @__PURE__ */ $.pointerType("url.Error"))]
	}
	return [url, null]
}

export function parse(rawURL: string, viaRequest: boolean): [URL | $.VarRef<URL> | null, $.GoError] {
	let rest: string = ""
	let err: $.GoError = null! as $.GoError

	if (stringContainsCTLByte(rawURL)) {
		return [null, errors.New("net/url: invalid control character in URL")]
	}

	if (($.stringEqual(rawURL, "")) && viaRequest) {
		return [null, errors.New("empty url")]
	}
	let url: URL | $.VarRef<URL> | null = new URL()

	if ($.stringEqual(rawURL, "*")) {
		$.pointerValue<URL>(url).Path = "*"
		return [url, null]
	}

	// Split off possible leading "http:", "mailto:", etc.
	// Cannot contain escaped characters.
	{
		let __goscriptTuple6: any = getScheme(rawURL)
		$.pointerValue<URL>(url).Scheme = __goscriptTuple6[0]
		rest = __goscriptTuple6[1]
		err = __goscriptTuple6[2]
		if (err != null) {
			return [null, err]
		}
	}
	$.pointerValue<URL>(url).Scheme = strings.ToLower($.pointerValue<URL>(url).Scheme)

	if (strings.HasSuffix(rest, "?") && (strings.Count(rest, "?") == 1)) {
		$.pointerValue<URL>(url).ForceQuery = true
		rest = $.sliceStringOrBytes(rest, undefined, $.len(rest) - 1)
	} else {
		let __goscriptTuple7: any = strings.Cut(rest, "?")
		rest = __goscriptTuple7[0]
		$.pointerValue<URL>(url).RawQuery = __goscriptTuple7[1]
	}

	if (!strings.HasPrefix(rest, "/")) {
		if (!$.stringEqual($.pointerValue<URL>(url).Scheme, "")) {
			// We consider rootless paths per RFC 3986 as opaque.
			$.pointerValue<URL>(url).Opaque = rest
			return [url, null]
		}
		if (viaRequest) {
			return [null, errors.New("invalid URI for request")]
		}

		// Avoid confusion with malformed schemes, like cache_object:foo/bar.
		// See golang.org/issue/16822.
		//
		// RFC 3986, §3.3:
		// In addition, a URI reference (Section 4.1) may be a relative-path reference,
		// in which case the first path segment cannot contain a colon (":") character.
		{
			let [segment, , ] = strings.Cut(rest, "/")
			if (strings.Contains(segment, ":")) {
				// First path segment has colon. Not allowed in relative URL.
				return [null, errors.New("first path segment in URL cannot contain colon")]
			}
		}
	}

	if (((!$.stringEqual($.pointerValue<URL>(url).Scheme, "")) || (!viaRequest && !strings.HasPrefix(rest, "///"))) && strings.HasPrefix(rest, "//")) {
		let authority: string = ""
		let __goscriptAssign0_0: string = $.sliceStringOrBytes(rest, 2, undefined)
		let __goscriptAssign0_1: string = ""
		authority = __goscriptAssign0_0
		rest = __goscriptAssign0_1
		{
			let i: number = strings.Index(authority, "/")
			if (i >= 0) {
				let __goscriptAssign1_0: string = $.sliceStringOrBytes(authority, undefined, i)
				let __goscriptAssign1_1: string = $.sliceStringOrBytes(authority, i, undefined)
				authority = __goscriptAssign1_0
				rest = __goscriptAssign1_1
			}
		}
		let __goscriptTuple8: any = parseAuthority($.pointerValue<URL>(url).Scheme, authority)
		$.pointerValue<URL>(url).User = __goscriptTuple8[0]
		$.pointerValue<URL>(url).Host = __goscriptTuple8[1]
		err = __goscriptTuple8[2]
		if (err != null) {
			return [null, err]
		}
	} else {
		if ((!$.stringEqual($.pointerValue<URL>(url).Scheme, "")) && strings.HasPrefix(rest, "/")) {
			// OmitHost is set to true when rawURL has an empty host (authority).
			// See golang.org/issue/46059.
			$.pointerValue<URL>(url).OmitHost = true
		}
	}

	// Set Path and, optionally, RawPath.
	// RawPath is a hint of the encoding of Path. We don't want to set it if
	// the default escaping of Path is equivalent, to help make sure that people
	// don't rely on it in general.
	{
		let __goscriptShadow2 = URL.prototype.setPath.call(url, rest)
		if (__goscriptShadow2 != null) {
			return [null, __goscriptShadow2]
		}
	}
	return [url, null]
}

export function parseAuthority(scheme: string, authority: string): [Userinfo | $.VarRef<Userinfo> | null, string, $.GoError] {
	let user: Userinfo | $.VarRef<Userinfo> | null = null! as Userinfo | $.VarRef<Userinfo> | null
	let host: string = ""
	let err: $.GoError = null! as $.GoError
	let i = strings.LastIndex(authority, "@")
	if (i < 0) {
		let __goscriptTuple9: any = parseHost(scheme, authority)
		host = __goscriptTuple9[0]
		err = __goscriptTuple9[1]
	} else {
		let __goscriptTuple10: any = parseHost(scheme, $.sliceStringOrBytes(authority, i + 1, undefined))
		host = __goscriptTuple10[0]
		err = __goscriptTuple10[1]
	}
	if (err != null) {
		return [null, "", err]
	}
	if (i < 0) {
		return [null, host, null]
	}
	let userinfo = $.sliceStringOrBytes(authority, undefined, i)
	if (!validUserinfo(userinfo)) {
		return [null, "", errors.New("net/url: invalid userinfo")]
	}
	if (!strings.Contains(userinfo, ":")) {
		{
			let __goscriptTuple11: any = unescape(userinfo, 16)
			userinfo = __goscriptTuple11[0]
			err = __goscriptTuple11[1]
			if (err != null) {
				return [null, "", err]
			}
		}
		user = User(userinfo)
	} else {
		let [username, password, ] = strings.Cut(userinfo, ":")
		{
			let __goscriptTuple12: any = unescape(username, 16)
			username = __goscriptTuple12[0]
			err = __goscriptTuple12[1]
			if (err != null) {
				return [null, "", err]
			}
		}
		{
			let __goscriptTuple13: any = unescape(password, 16)
			password = __goscriptTuple13[0]
			err = __goscriptTuple13[1]
			if (err != null) {
				return [null, "", err]
			}
		}
		user = UserPassword(username, password)
	}
	return [user, host, null]
}

export function parseHost(scheme: string, host: string): [string, $.GoError] {
	{
		let openBracketIdx = strings.LastIndex(host, "[")
		if (openBracketIdx > 0) {
			return ["", errors.New("invalid IP-literal")]
		} else {
			if (openBracketIdx == 0) {
				// Parse an IP-Literal in RFC 3986 and RFC 6874.
				// E.g., "[fe80::1]", "[fe80::1%25en0]", "[fe80::1]:80".
				let closeBracketIdx = strings.LastIndex(host, "]")
				if (closeBracketIdx < 0) {
					return ["", errors.New("missing ']' in host")]
				}

				let colonPort = $.sliceStringOrBytes(host, closeBracketIdx + 1, undefined)
				if (!validOptionalPort(colonPort)) {
					return ["", fmt.Errorf("invalid port %q after host", colonPort)]
				}
				let [unescapedColonPort, err] = unescape(colonPort, 4)
				if (err != null) {
					return ["", err]
				}

				let hostname = $.sliceStringOrBytes(host, openBracketIdx + 1, closeBracketIdx)
				let unescapedHostname: string = ""
				// RFC 6874 defines that %25 (%-encoded percent) introduces
				// the zone identifier, and the zone identifier can use basically
				// any %-encoding it likes. That's different from the host, which
				// can only %-encode non-ASCII bytes.
				// We do impose some restrictions on the zone, to avoid stupidity
				// like newlines.
				let zoneIdx = strings.Index(hostname, "%25")
				if (zoneIdx >= 0) {
					let [hostPart, __goscriptShadow3] = unescape($.sliceStringOrBytes(hostname, undefined, zoneIdx), 4)
					if (__goscriptShadow3 != null) {
						return ["", __goscriptShadow3]
					}
					let __goscriptTuple14: any = unescape($.sliceStringOrBytes(hostname, zoneIdx, undefined), 8)
					let zonePart = __goscriptTuple14[0]
					__goscriptShadow3 = __goscriptTuple14[1]
					if (__goscriptShadow3 != null) {
						return ["", __goscriptShadow3]
					}
					unescapedHostname = hostPart + zonePart
				} else {
					let __goscriptShadow4: $.GoError = null! as $.GoError
					let __goscriptTuple15: any = unescape(hostname, 4)
					unescapedHostname = __goscriptTuple15[0]
					__goscriptShadow4 = __goscriptTuple15[1]
					if (__goscriptShadow4 != null) {
						return ["", __goscriptShadow4]
					}
				}

				// Per RFC 3986, only a host identified by a valid
				// IPv6 address can be enclosed by square brackets.
				// This excludes any IPv4, but notably not IPv4-mapped addresses.
				let __goscriptTuple16: any = netip.ParseAddr(unescapedHostname)
				let addr = __goscriptTuple16[0]
				err = __goscriptTuple16[1]
				if (err != null) {
					return ["", fmt.Errorf("invalid host: %w", (err as any))]
				}
				if ($.markAsStructValue($.cloneStructValue(addr)).Is4()) {
					return ["", errors.New("invalid IP-literal")]
				}
				return [(("[" + unescapedHostname) + "]") + unescapedColonPort, null]
			} else {
				{
					let i = strings.Index(host, ":")
					if (i != -1) {
						let lastColon = strings.LastIndex(host, ":")
						if (lastColon != i) {
							// RFC 3986 does not allow colons to appear in the host subcomponent.
							//
							// However, a number of databases including PostgreSQL and MongoDB
							// permit a comma-separated list of hosts (with optional ports) in the
							// host subcomponent.
							//
							// Since we historically permitted colons to appear in the host,
							// enforce strict colons only for http and https URLs.
							//
							// See https://go.dev/issue/75223 and https://go.dev/issue/78077.
							if (($.stringEqual(scheme, "http")) || ($.stringEqual(scheme, "https"))) {
								if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(urlstrictcolons)), "0")) {
									godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(urlstrictcolons))
									i = lastColon
								}
							} else {
								i = lastColon
							}
						}
						let colonPort = $.sliceStringOrBytes(host, i, undefined)
						if (!validOptionalPort(colonPort)) {
							return ["", fmt.Errorf("invalid port %q after host", colonPort)]
						}
					}
				}
			}
		}
	}

	let err: $.GoError = null! as $.GoError
	{
		let __goscriptTuple17: any = unescape(host, 4)
		host = __goscriptTuple17[0]
		err = __goscriptTuple17[1]
		if (err != null) {
			return ["", err]
		}
	}
	return [host, null]
}

export function badSetPath(_p0: URL | $.VarRef<URL> | null, _p1: string): $.GoError {
	return null! as $.GoError
}

export function validEncoded(s: string, mode: __goscript_encoding_table.encoding): boolean {
	for (let i = 0; i < $.len(s); i++) {
		// RFC 3986, Appendix A.
		// pchar = unreserved / pct-encoded / sub-delims / ":" / "@".
		// shouldEscape is not quite compliant with the RFC,
		// so we check the sub-delims ourselves and let
		// shouldEscape handle the others.
		switch ($.indexStringOrBytes(s, i)) {
			case 33:
			case 36:
			case 38:
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
			case 44:
			case 59:
			case 61:
			case 58:
			case 64:
			{
				break
			}
			case 91:
			case 93:
			{
				break
			}
			case 37:
			{
				break
			}
			default:
			{
				if (shouldEscape($.uint($.indexStringOrBytes(s, i), 8), $.uint(mode, 8))) {
					return false
				}
				break
			}
		}
	}
	return true
}

export function validOptionalPort(port: string): boolean {
	if ($.stringEqual(port, "")) {
		return true
	}
	if ($.uint($.indexStringOrBytes(port, 0), 8) != 58) {
		return false
	}
	for (const [__rangeIndex, b] of $.rangeString($.sliceStringOrBytes(port, 1, undefined))) {
		if (($.int(b, 32) < 48) || ($.int(b, 32) > 57)) {
			return false
		}
	}
	return true
}

export function Values_Get(v: Values, key: string): string {
	let vs: $.Slice<string> = $.mapGet<string, $.Slice<string>, $.Slice<string>>(v, key, null)[0]
	if ($.len(vs) == 0) {
		return ""
	}
	return $.arrayIndex(vs!, 0)
}

export function Values_Set(v: Values, key: string, value: string): void {
	$.mapSet(v, key, $.arrayToSlice<string>([value]))
}

export function Values_Add(v: Values, key: string, value: string): void {
	$.mapSet(v, key, $.append($.mapGet<string, $.Slice<string>, $.Slice<string>>(v, key, null)[0], value))
}

export function Values_Del(v: Values, key: string): void {
	$.deleteMapEntry(v, key)
}

export function Values_Has(v: Values, key: string): boolean {
	let [, ok] = $.mapGet<string, $.Slice<string>, $.Slice<string>>(v, key, null)
	return ok
}

export function Values_Clone(vs: Values): Values {
	if (vs == null) {
		return null
	}

	let newVals: Values = $.makeMap<string, $.Slice<string>>()
	for (let [k, v] of vs?.entries() ?? []) {
		$.mapSet(newVals, k, (slices.Clone(v) as $.Slice<string>))
	}
	return newVals
}

export function ParseQuery(query: string): [Values, $.GoError] {
	let m: Values = $.makeMap<string, $.Slice<string>>()
	let err = parseQuery(m, query)
	return [m, err]
}

export let urlmaxqueryparams: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("urlmaxqueryparams")

export function __goscript_set_urlmaxqueryparams(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	urlmaxqueryparams = __goscriptValue
}

export function urlParamsWithinMax(params: number): boolean {
	let withinDefaultMax = params <= 10000
	if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(urlmaxqueryparams)), "")) {
		return withinDefaultMax
	}
	let [customMax, err] = strconv.Atoi(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(urlmaxqueryparams)))
	if (err != null) {
		return withinDefaultMax
	}
	let withinCustomMax = (customMax == 0) || (params < customMax)
	if (withinDefaultMax != withinCustomMax) {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(urlmaxqueryparams))
	}
	return withinCustomMax
}

export function parseQuery(m: Values, query: string): $.GoError {
	let err: $.GoError = null! as $.GoError
	if (!urlParamsWithinMax(strings.Count(query, "&") + 1)) {
		return errors.New("number of URL query parameters exceeded limit")
	}
	while (!$.stringEqual(query, "")) {
		let key: string = ""
		let __goscriptTuple18: any = strings.Cut(query, "&")
		key = __goscriptTuple18[0]
		query = __goscriptTuple18[1]
		if (strings.Contains(key, ";")) {
			err = fmt.Errorf("invalid semicolon separator in query")
			continue
		}
		if ($.stringEqual(key, "")) {
			continue
		}
		let __goscriptTuple19: any = strings.Cut(key, "=")
		key = __goscriptTuple19[0]
		let value = __goscriptTuple19[1]
		let __goscriptTuple20: any = QueryUnescape(key)
		key = __goscriptTuple20[0]
		let err1 = __goscriptTuple20[1]
		if (err1 != null) {
			if (err == null) {
				err = err1
			}
			continue
		}
		let __goscriptTuple21: any = QueryUnescape(value)
		value = __goscriptTuple21[0]
		err1 = __goscriptTuple21[1]
		if (err1 != null) {
			if (err == null) {
				err = err1
			}
			continue
		}
		$.mapSet(m, key, $.append($.mapGet<string, $.Slice<string>, $.Slice<string>>(m, key, null)[0], value))
	}
	return err
}

export function Values_Encode(v: Values): string {
	if ($.len(v) == 0) {
		return ""
	}
	let buf: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	// To minimize allocations, we eschew iterators and pre-size the slice in
	// which we collect v's keys.
	let keys: $.Slice<string> = $.makeSlice<string>($.len(v), undefined, "string")
	let i: number = 0
	for (const [k, __rangeValue] of v?.entries() ?? []) {
		keys![i] = k
		i++
	}
	slices.Sort(keys)
	for (let __goscriptRangeTarget3 = keys, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let k = __goscriptRangeTarget3![__rangeIndex]
		let vs: $.Slice<string> = $.mapGet<string, $.Slice<string>, $.Slice<string>>(v, k, null)[0]
		let keyEscaped = QueryEscape(k)
		for (let __goscriptRangeTarget2 = vs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let v = __goscriptRangeTarget2![__rangeIndex]
			if (buf.value.Len() > 0) {
				buf.value.WriteByte(38)
			}
			buf.value.WriteString(keyEscaped)
			buf.value.WriteByte(61)
			buf.value.WriteString(QueryEscape(v))
		}
	}
	return buf.value.String()
}

export function resolvePath(base: string, ref: string): string {
	let full: string = ""
	if ($.stringEqual(ref, "")) {
		full = base
	} else {
		if ($.uint($.indexStringOrBytes(ref, 0), 8) != 47) {
			let i = strings.LastIndex(base, "/")
			full = $.sliceStringOrBytes(base, undefined, i + 1) + ref
		} else {
			full = ref
		}
	}
	if ($.stringEqual(full, "")) {
		return ""
	}

	let dst: $.Slice<number> = $.makeSlice<number>(0, $.len(full) + 1, "byte")
	dst = $.append(dst, $.uint(47, 8), $.byteSliceHint)
	let elem = ""
	let remaining = full
	let found = true
	let first = true
	while (found) {
		let __goscriptTuple22: any = strings.Cut(remaining, "/")
		elem = __goscriptTuple22[0]
		remaining = __goscriptTuple22[1]
		found = __goscriptTuple22[2]
		switch (elem) {
			case ".":
			{
				first = false
				continue
				break
			}
			case "..":
			{
				{
					let i: number = bytes.LastIndexByte($.goSlice(dst, 1, undefined), 47)
					if (i >= 0) {
						dst = $.goSlice(dst, undefined, i + 1)
					} else {
						dst = $.goSlice(dst, undefined, 1)
					}
				}
				first = $.len(dst) == 1
				break
			}
			default:
			{
				if (!first) {
					dst = $.append(dst, $.uint(47, 8), $.byteSliceHint)
				}
				dst = $.appendSlice(dst, $.stringToBytes(elem), $.byteSliceHint)
				first = false
				break
			}
		}
	}

	if (($.stringEqual(elem, ".")) || ($.stringEqual(elem, ".."))) {
		dst = $.append(dst, $.uint(47, 8), $.byteSliceHint)
	}

	// We wrote an initial '/', but we don't want two.
	if (($.len(dst) > 1) && ($.uint($.arrayIndex(dst!, 1), 8) == 47)) {
		return $.bytesToString($.goSlice(dst, 1, undefined))
	}
	return $.bytesToString(dst)
}

export function splitHostPort(hostPort: string): [string, string] {
	let host: string = ""
	let port: string = ""
	host = hostPort

	let colon: number = strings.LastIndexByte(host, 58)
	if ((colon != -1) && validOptionalPort($.sliceStringOrBytes(host, colon, undefined))) {
		let __goscriptAssign2_0: string = $.sliceStringOrBytes(host, undefined, colon)
		let __goscriptAssign2_1: string = $.sliceStringOrBytes(host, colon + 1, undefined)
		host = __goscriptAssign2_0
		port = __goscriptAssign2_1
	}

	if (strings.HasPrefix(host, "[") && strings.HasSuffix(host, "]")) {
		host = $.sliceStringOrBytes(host, 1, $.len(host) - 1)
	}

	return [host, port]
}

export function validUserinfo(s: string): boolean {
	for (const [__rangeIndex, r] of $.rangeString(s)) {
		if ((65 <= $.int(r, 32)) && ($.int(r, 32) <= 90)) {
			continue
		}
		if ((97 <= $.int(r, 32)) && ($.int(r, 32) <= 122)) {
			continue
		}
		if ((48 <= $.int(r, 32)) && ($.int(r, 32) <= 57)) {
			continue
		}
		switch (r) {
			case 45:
			case 46:
			case 95:
			case 58:
			case 126:
			case 33:
			case 36:
			case 38:
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
			case 44:
			case 59:
			case 61:
			case 37:
			{
				continue
				break
			}
			case 64:
			{
				continue
				break
			}
			default:
			{
				return false
				break
			}
		}
	}
	return true
}

export function stringContainsCTLByte(s: string): boolean {
	for (let i = 0; i < $.len(s); i++) {
		let b = $.uint($.indexStringOrBytes(s, i), 8)
		if (($.uint(b, 8) < 32) || ($.uint(b, 8) == 0x7f)) {
			return true
		}
	}
	return false
}

export function JoinPath(base: string, elem: $.Slice<string>): [string, $.GoError] {
	let result: string = ""
	let err: $.GoError = null! as $.GoError
	let __goscriptTuple23: any = Parse(base)
	let url: URL | $.VarRef<URL> | null = __goscriptTuple23[0]
	err = __goscriptTuple23[1]
	if (err != null) {
		return [result, err]
	}
	let __goscriptTuple24: any = URL.prototype.joinPath.call(url, elem)
	let res: URL | $.VarRef<URL> | null = __goscriptTuple24[0]
	err = __goscriptTuple24[1]
	if (err != null) {
		return ["", err]
	}
	return [URL.prototype.String.call(res), null]
}
