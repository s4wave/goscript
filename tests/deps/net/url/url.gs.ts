// Generated file based on url.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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
	public get Op(): string {
		return this._fields.Op.value
	}
	public set Op(value: string) {
		this._fields.Op.value = value
	}

	public get URL(): string {
		return this._fields.URL.value
	}
	public set URL(value: string) {
		this._fields.URL.value = value
	}

	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		Op: $.VarRef<string>
		URL: $.VarRef<string>
		Err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{Op?: string, URL?: string, Err?: $.GoError}>) {
		this._fields = {
			Op: $.varRef(init?.Op ?? ("" as string)),
			URL: $.varRef(init?.URL ?? ("" as string)),
			Err: $.varRef(init?.Err ?? (null as $.GoError))
		}
	}

	public clone(): Error {
		const cloned = new Error()
		cloned._fields = {
			Op: $.varRef(this._fields.Op.value),
			URL: $.varRef(this._fields.URL.value),
			Err: $.varRef(this._fields.Err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const e: Error | $.VarRef<Error> | null = this
		return fmt.Sprintf("%s %q: %s", $.pointerValue<Error>(e).Op, $.pointerValue<Error>(e).URL, ($.pointerValue<Error>(e).Err as any))
	}

	public async Temporary(): globalThis.Promise<boolean> {
		const e: Error | $.VarRef<Error> | null = this
		let [t, ok] = $.typeAssertTuple<any>($.pointerValue<Error>(e).Err, { kind: $.TypeKind.Interface, methods: [{ name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] })
		return ok && await $.pointerValue<any>(t).Temporary()
	}

	public async Timeout(): globalThis.Promise<boolean> {
		const e: Error | $.VarRef<Error> | null = this
		let [t, ok] = $.typeAssertTuple<any>($.pointerValue<Error>(e).Err, { kind: $.TypeKind.Interface, methods: [{ name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] })
		return ok && await $.pointerValue<any>(t).Timeout()
	}

	public Unwrap(): $.GoError {
		const e: Error | $.VarRef<Error> | null = this
		return $.pointerValue<Error>(e).Err
	}

	static __typeInfo = $.registerStructType(
		"url.Error",
		() => new Error(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unwrap", args: [], returns: [{ name: "_r0", type: "error" }] }],
		Error,
		[{ name: "Op", key: "Op", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "URL", key: "URL", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 16, exported: true }, { name: "Err", key: "Err", type: "error", index: [2], offset: 32, exported: true }]
	)
}

export class URL {
	public get Scheme(): string {
		return this._fields.Scheme.value
	}
	public set Scheme(value: string) {
		this._fields.Scheme.value = value
	}

	public get Opaque(): string {
		return this._fields.Opaque.value
	}
	public set Opaque(value: string) {
		this._fields.Opaque.value = value
	}

	public get User(): Userinfo | $.VarRef<Userinfo> | null {
		return this._fields.User.value
	}
	public set User(value: Userinfo | $.VarRef<Userinfo> | null) {
		this._fields.User.value = value
	}

	public get Host(): string {
		return this._fields.Host.value
	}
	public set Host(value: string) {
		this._fields.Host.value = value
	}

	public get Path(): string {
		return this._fields.Path.value
	}
	public set Path(value: string) {
		this._fields.Path.value = value
	}

	public get Fragment(): string {
		return this._fields.Fragment.value
	}
	public set Fragment(value: string) {
		this._fields.Fragment.value = value
	}

	// RawQuery contains the encoded query values, without the initial '?'.
	// Use URL.Query to decode the query.
	public get RawQuery(): string {
		return this._fields.RawQuery.value
	}
	public set RawQuery(value: string) {
		this._fields.RawQuery.value = value
	}

	// RawPath is an optional field containing an encoded path hint.
	// See the EscapedPath method for more details.
	//
	// In general, code should call EscapedPath instead of reading RawPath.
	public get RawPath(): string {
		return this._fields.RawPath.value
	}
	public set RawPath(value: string) {
		this._fields.RawPath.value = value
	}

	// RawFragment is an optional field containing an encoded fragment hint.
	// See the EscapedFragment method for more details.
	//
	// In general, code should call EscapedFragment instead of reading RawFragment.
	public get RawFragment(): string {
		return this._fields.RawFragment.value
	}
	public set RawFragment(value: string) {
		this._fields.RawFragment.value = value
	}

	// ForceQuery indicates whether the original URL contained a query ('?') character.
	// When set, the String method will include a trailing '?', even when RawQuery is empty.
	public get ForceQuery(): boolean {
		return this._fields.ForceQuery.value
	}
	public set ForceQuery(value: boolean) {
		this._fields.ForceQuery.value = value
	}

	// OmitHost indicates the URL has an empty host (authority).
	// When set, the String method will not include the host when it is empty.
	public get OmitHost(): boolean {
		return this._fields.OmitHost.value
	}
	public set OmitHost(value: boolean) {
		this._fields.OmitHost.value = value
	}

	public _fields: {
		Scheme: $.VarRef<string>
		Opaque: $.VarRef<string>
		User: $.VarRef<Userinfo | $.VarRef<Userinfo> | null>
		Host: $.VarRef<string>
		Path: $.VarRef<string>
		Fragment: $.VarRef<string>
		RawQuery: $.VarRef<string>
		RawPath: $.VarRef<string>
		RawFragment: $.VarRef<string>
		ForceQuery: $.VarRef<boolean>
		OmitHost: $.VarRef<boolean>
	}

	constructor(init?: Partial<{Scheme?: string, Opaque?: string, User?: Userinfo | $.VarRef<Userinfo> | null, Host?: string, Path?: string, Fragment?: string, RawQuery?: string, RawPath?: string, RawFragment?: string, ForceQuery?: boolean, OmitHost?: boolean}>) {
		this._fields = {
			Scheme: $.varRef(init?.Scheme ?? ("" as string)),
			Opaque: $.varRef(init?.Opaque ?? ("" as string)),
			User: $.varRef(init?.User ?? (null as Userinfo | $.VarRef<Userinfo> | null)),
			Host: $.varRef(init?.Host ?? ("" as string)),
			Path: $.varRef(init?.Path ?? ("" as string)),
			Fragment: $.varRef(init?.Fragment ?? ("" as string)),
			RawQuery: $.varRef(init?.RawQuery ?? ("" as string)),
			RawPath: $.varRef(init?.RawPath ?? ("" as string)),
			RawFragment: $.varRef(init?.RawFragment ?? ("" as string)),
			ForceQuery: $.varRef(init?.ForceQuery ?? (false as boolean)),
			OmitHost: $.varRef(init?.OmitHost ?? (false as boolean))
		}
	}

	public clone(): URL {
		const cloned = new URL()
		cloned._fields = {
			Scheme: $.varRef(this._fields.Scheme.value),
			Opaque: $.varRef(this._fields.Opaque.value),
			User: $.varRef(this._fields.User.value),
			Host: $.varRef(this._fields.Host.value),
			Path: $.varRef(this._fields.Path.value),
			Fragment: $.varRef(this._fields.Fragment.value),
			RawQuery: $.varRef(this._fields.RawQuery.value),
			RawPath: $.varRef(this._fields.RawPath.value),
			RawFragment: $.varRef(this._fields.RawFragment.value),
			ForceQuery: $.varRef(this._fields.ForceQuery.value),
			OmitHost: $.varRef(this._fields.OmitHost.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const u: URL | $.VarRef<URL> | null = this
		return [$.appendSlice(b, $.stringToBytes(URL.prototype.String.call(u)), $.byteSliceHint), null]
	}

	public EscapedFragment(): string {
		const u: URL | $.VarRef<URL> | null = this
		if ((!$.stringEqual($.pointerValue<URL>(u).RawFragment, "")) && validEncoded($.pointerValue<URL>(u).RawFragment, $.uint(64, 8))) {
			let [f, err] = unescape($.pointerValue<URL>(u).RawFragment, $.uint(64, 8))
			if ((err == null) && ($.stringEqual(f, $.pointerValue<URL>(u).Fragment))) {
				return $.pointerValue<URL>(u).RawFragment
			}
		}
		return escape($.pointerValue<URL>(u).Fragment, $.uint(64, 8))
	}

	public EscapedPath(): string {
		const u: URL | $.VarRef<URL> | null = this
		if ((!$.stringEqual($.pointerValue<URL>(u).RawPath, "")) && validEncoded($.pointerValue<URL>(u).RawPath, $.uint(1, 8))) {
			let [p, err] = unescape($.pointerValue<URL>(u).RawPath, $.uint(1, 8))
			if ((err == null) && ($.stringEqual(p, $.pointerValue<URL>(u).Path))) {
				return $.pointerValue<URL>(u).RawPath
			}
		}
		if ($.stringEqual($.pointerValue<URL>(u).Path, "*")) {
			return "*"
		}
		return escape($.pointerValue<URL>(u).Path, $.uint(1, 8))
	}

	public Hostname(): string {
		const u: URL | $.VarRef<URL> | null = this
		let [host, ] = splitHostPort($.pointerValue<URL>(u).Host)
		return host
	}

	public IsAbs(): boolean {
		const u: URL | $.VarRef<URL> | null = this
		return !$.stringEqual($.pointerValue<URL>(u).Scheme, "")
	}

	public JoinPath(elem: $.Slice<string>): URL | $.VarRef<URL> | null {
		const u: URL | $.VarRef<URL> | null = this
		let __goscriptTuple0: any = URL.prototype.joinPath.call(u, elem)
		let url: URL | $.VarRef<URL> | null = __goscriptTuple0[0]
		return url
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const u: URL | $.VarRef<URL> | null = this
		let text: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		return URL.prototype.AppendBinary.call(u, null)
	}

	public Parse(ref: string): [URL | $.VarRef<URL> | null, $.GoError] {
		const u: URL | $.VarRef<URL> | null = this
		let __goscriptTuple1: any = Parse(ref)
		let refURL: URL | $.VarRef<URL> | null = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return [URL.prototype.ResolveReference.call(u, refURL), null]
	}

	public Port(): string {
		const u: URL | $.VarRef<URL> | null = this
		let [, port] = splitHostPort($.pointerValue<URL>(u).Host)
		return port
	}

	public Query(): Values {
		const u: URL | $.VarRef<URL> | null = this
		let __goscriptTuple2: any = ParseQuery($.pointerValue<URL>(u).RawQuery)
		let v: Values = __goscriptTuple2[0]
		return v
	}

	public Redacted(): string {
		const u: URL | $.VarRef<URL> | null = this
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
		const u: URL | $.VarRef<URL> | null = this
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
		const u: URL | $.VarRef<URL> | null = this
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
		const u: URL | $.VarRef<URL> | null = this
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
			buf.value.WriteByte($.uint(58, 8))
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
							buf.value.WriteByte($.uint(64, 8))
						}
					}
					{
						let h = $.pointerValue<URL>(u).Host
						if (!$.stringEqual(h, "")) {
							buf.value.WriteString(escape(h, $.uint(4, 8)))
						}
					}
				}
			}
			let __goscriptShadow0 = URL.prototype.EscapedPath.call(u)
			if (((!$.stringEqual(__goscriptShadow0, "")) && ($.uint($.indexStringOrBytes(__goscriptShadow0, 0), 8) != $.uint(47, 8))) && (!$.stringEqual($.pointerValue<URL>(u).Host, ""))) {
				buf.value.WriteByte($.uint(47, 8))
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
			buf.value.WriteByte($.uint(63, 8))
			buf.value.WriteString($.pointerValue<URL>(u).RawQuery)
		}
		if (!$.stringEqual($.pointerValue<URL>(u).Fragment, "")) {
			buf.value.WriteByte($.uint(35, 8))
			buf.value.WriteString(URL.prototype.EscapedFragment.call(u))
		}
		return buf.value.String()
	}

	public UnmarshalBinary(text: $.Slice<number>): $.GoError {
		let u: URL | $.VarRef<URL> | null = this
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
		const u: URL | $.VarRef<URL> | null = this
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
		let u: URL | $.VarRef<URL> | null = this
		let [frag, err] = unescape(f, $.uint(64, 8))
		if (err != null) {
			return err
		}
		$.pointerValue<URL>(u).Fragment = frag
		{
			let escf = escape(frag, $.uint(64, 8))
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
		let u: URL | $.VarRef<URL> | null = this
		let [__goscriptShadow1, err] = unescape(p, $.uint(1, 8))
		if (err != null) {
			return err
		}
		$.pointerValue<URL>(u).Path = __goscriptShadow1
		{
			let escp = escape(__goscriptShadow1, $.uint(1, 8))
			if ($.stringEqual(p, escp)) {
				// Default encoding is fine.
				$.pointerValue<URL>(u).RawPath = ""
			} else {
				$.pointerValue<URL>(u).RawPath = p
			}
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"url.URL",
		() => new URL(),
		[{ name: "AppendBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "EscapedFragment", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "EscapedPath", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Hostname", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "IsAbs", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "JoinPath", args: [{ name: "elem", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "url.URL" } }] }, { name: "MarshalBinary", args: [], returns: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "Parse", args: [{ name: "ref", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "url.URL" } }, { name: "_r1", type: "error" }] }, { name: "Port", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Query", args: [], returns: [{ name: "_r0", type: "url.Values" }] }, { name: "Redacted", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "RequestURI", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "ResolveReference", args: [{ name: "ref", type: { kind: $.TypeKind.Pointer, elemType: "url.URL" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "url.URL" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalBinary", args: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "joinPath", args: [{ name: "elem", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "url.URL" } }, { name: "_r1", type: "error" }] }, { name: "setFragment", args: [{ name: "f", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "setPath", args: [{ name: "p", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "error" }] }],
		URL,
		[{ name: "Scheme", key: "Scheme", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Opaque", key: "Opaque", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 16, exported: true }, { name: "User", key: "User", type: { kind: $.TypeKind.Pointer, elemType: "url.Userinfo" }, index: [2], offset: 32, exported: true }, { name: "Host", key: "Host", type: { kind: $.TypeKind.Basic, name: "string" }, index: [3], offset: 40, exported: true }, { name: "Path", key: "Path", type: { kind: $.TypeKind.Basic, name: "string" }, index: [4], offset: 56, exported: true }, { name: "Fragment", key: "Fragment", type: { kind: $.TypeKind.Basic, name: "string" }, index: [5], offset: 72, exported: true }, { name: "RawQuery", key: "RawQuery", type: { kind: $.TypeKind.Basic, name: "string" }, index: [6], offset: 88, exported: true }, { name: "RawPath", key: "RawPath", type: { kind: $.TypeKind.Basic, name: "string" }, index: [7], offset: 104, exported: true }, { name: "RawFragment", key: "RawFragment", type: { kind: $.TypeKind.Basic, name: "string" }, index: [8], offset: 120, exported: true }, { name: "ForceQuery", key: "ForceQuery", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [9], offset: 136, exported: true }, { name: "OmitHost", key: "OmitHost", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [10], offset: 137, exported: true }]
	)
}

export class Userinfo {
	public get username(): string {
		return this._fields.username.value
	}
	public set username(value: string) {
		this._fields.username.value = value
	}

	public get password(): string {
		return this._fields.password.value
	}
	public set password(value: string) {
		this._fields.password.value = value
	}

	public get passwordSet(): boolean {
		return this._fields.passwordSet.value
	}
	public set passwordSet(value: boolean) {
		this._fields.passwordSet.value = value
	}

	public _fields: {
		username: $.VarRef<string>
		password: $.VarRef<string>
		passwordSet: $.VarRef<boolean>
	}

	constructor(init?: Partial<{username?: string, password?: string, passwordSet?: boolean}>) {
		this._fields = {
			username: $.varRef(init?.username ?? ("" as string)),
			password: $.varRef(init?.password ?? ("" as string)),
			passwordSet: $.varRef(init?.passwordSet ?? (false as boolean))
		}
	}

	public clone(): Userinfo {
		const cloned = new Userinfo()
		cloned._fields = {
			username: $.varRef(this._fields.username.value),
			password: $.varRef(this._fields.password.value),
			passwordSet: $.varRef(this._fields.passwordSet.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Password(): [string, boolean] {
		const u: Userinfo | $.VarRef<Userinfo> | null = this
		if (u == null) {
			return ["", false]
		}
		return [$.pointerValue<Userinfo>(u).password, $.pointerValue<Userinfo>(u).passwordSet]
	}

	public String(): string {
		const u: Userinfo | $.VarRef<Userinfo> | null = this
		if (u == null) {
			return ""
		}
		let s = escape($.pointerValue<Userinfo>(u).username, $.uint(16, 8))
		if ($.pointerValue<Userinfo>(u).passwordSet) {
			s = s + (":" + escape($.pointerValue<Userinfo>(u).password, $.uint(16, 8)))
		}
		return s
	}

	public Username(): string {
		const u: Userinfo | $.VarRef<Userinfo> | null = this
		if (u == null) {
			return ""
		}
		return $.pointerValue<Userinfo>(u).username
	}

	static __typeInfo = $.registerStructType(
		"url.Userinfo",
		() => new Userinfo(),
		[{ name: "Password", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Username", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		Userinfo,
		[{ name: "username", key: "username", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net/url", index: [0], offset: 0, exported: false }, { name: "password", key: "password", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "net/url", index: [1], offset: 16, exported: false }, { name: "passwordSet", key: "passwordSet", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "net/url", index: [2], offset: 32, exported: false }]
	)
}

export const upperhex: string = "0123456789ABCDEF"

export const defaultMaxParams: number = 10000

export let urlstrictcolons: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("urlstrictcolons")

export function __goscript_set_urlstrictcolons(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	urlstrictcolons = __goscriptValue
}

export function ishex(c: number): boolean {
	return $.uint(($.arrayIndex(__goscript_encoding_table.table, c) & 128), 8) != $.uint(0, 8)
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
	return $.uint(($.arrayIndex(__goscript_encoding_table.table, c) & mode), 8) == $.uint(0, 8)
}

export function QueryUnescape(s: string): [string, $.GoError] {
	return unescape(s, $.uint(32, 8))
}

export function PathUnescape(s: string): [string, $.GoError] {
	return unescape(s, $.uint(2, 8))
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
					return ["", $.namedValueInterfaceValue<$.GoError>(s, "url.EscapeError", {"Error": EscapeError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "url.EscapeError" })]
				}
				// Per https://tools.ietf.org/html/rfc3986#page-21
				// in the host component %-encoding can only be used
				// for non-ASCII bytes.
				// But https://tools.ietf.org/html/rfc6874#section-2
				// introduces %25 being allowed to escape a percent sign
				// in IPv6 scoped-address literals. Yay.
				if ((($.uint(mode, 8) == $.uint(4, 8)) && ($.uint(unhex($.uint($.indexStringOrBytes(s, i + 1), 8)), 8) < $.uint(8, 8))) && (!$.stringEqual($.sliceStringOrBytes(s, i, i + 3), "%25"))) {
					return ["", $.namedValueInterfaceValue<$.GoError>($.sliceStringOrBytes(s, i, i + 3), "url.EscapeError", {"Error": EscapeError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "url.EscapeError" })]
				}
				if ($.uint(mode, 8) == $.uint(8, 8)) {
					// RFC 6874 says basically "anything goes" for zone identifiers
					// and that even non-ASCII can be redundantly escaped,
					// but it seems prudent to restrict %-escaped bytes here to those
					// that are valid host name bytes in their unescaped form.
					// That is, you can use escaping in the zone identifier but not
					// to introduce bytes you couldn't just write directly.
					// But Windows puts spaces here! Yay.
					let v = $.uint((unhex($.uint($.indexStringOrBytes(s, i + 1), 8)) << 4) | unhex($.uint($.indexStringOrBytes(s, i + 2), 8)), 8)
					if (((!$.stringEqual($.sliceStringOrBytes(s, i, i + 3), "%25")) && ($.uint(v, 8) != $.uint(32, 8))) && shouldEscape($.uint(v, 8), $.uint(4, 8))) {
						return ["", $.namedValueInterfaceValue<$.GoError>($.sliceStringOrBytes(s, i, i + 3), "url.EscapeError", {"Error": EscapeError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "url.EscapeError" })]
					}
				}
				i = i + (3)
				break
			}
			case 43:
			{
				hasPlus = $.uint(mode, 8) == $.uint(32, 8)
				i++
				break
			}
			default:
			{
				if (((($.uint(mode, 8) == $.uint(4, 8)) || ($.uint(mode, 8) == $.uint(8, 8))) && ($.uint($.indexStringOrBytes(s, i), 8) < $.uint(0x80, 8))) && shouldEscape($.uint($.indexStringOrBytes(s, i), 8), $.uint(mode, 8))) {
					return ["", $.namedValueInterfaceValue<$.GoError>($.sliceStringOrBytes(s, i, i + 1), "url.InvalidHostError", {"Error": InvalidHostError_Error}, { kind: $.TypeKind.Basic, name: "string", typeName: "url.InvalidHostError" })]
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
			unescapedPlusSign = $.uint(32, 8)
			break
		}
		default:
		{
			unescapedPlusSign = $.uint(43, 8)
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
	return escape(s, $.uint(32, 8))
}

export function PathEscape(s: string): string {
	return escape(s, $.uint(2, 8))
}

export function escape(s: string, mode: __goscript_encoding_table.encoding): string {
	let spaceCount = 0
	let hexCount = 0
	for (let __goscriptRangeTarget0 = $.stringToBytes(s), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let c = __goscriptRangeTarget0![__rangeIndex]
		if (shouldEscape($.uint(c, 8), $.uint(mode, 8))) {
			if (($.uint(c, 8) == $.uint(32, 8)) && ($.uint(mode, 8) == $.uint(32, 8))) {
				spaceCount++
			} else {
				hexCount++
			}
		}
	}

	if ((spaceCount == 0) && (hexCount == 0)) {
		return s
	}

	let buf: Uint8Array = new Uint8Array(64)
	let t: $.Slice<number> = null as $.Slice<number>

	let required = $.len(s) + (2 * hexCount)
	if (required <= $.len(buf)) {
		t = $.goSlice(buf, undefined, required)
	} else {
		t = $.makeSlice<number>(required, undefined, "byte")
	}

	if (hexCount == 0) {
		$.copy(t, s)
		for (let i = 0; i < $.len(s); i++) {
			if ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(32, 8)) {
				t![i] = $.uint(43, 8)
			}
		}
		return $.bytesToString(t)
	}

	let j = 0
	for (let __goscriptRangeTarget1 = $.stringToBytes(s), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let c = __goscriptRangeTarget1![__rangeIndex]
		switch (true) {
			case ($.uint(c, 8) == $.uint(32, 8)) && ($.uint(mode, 8) == $.uint(32, 8)):
			{
				t![j] = $.uint(43, 8)
				j++
				break
			}
			case shouldEscape($.uint(c, 8), $.uint(mode, 8)):
			{
				t![j] = $.uint(37, 8)
				t![j + 1] = $.uint($.indexStringOrBytes("0123456789ABCDEF", $.uintShr(c, 4, 8)), 8)
				t![j + 2] = $.uint($.indexStringOrBytes("0123456789ABCDEF", c & 15), 8)
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
	let err: $.GoError = null as $.GoError
	for (let i = 0; i < $.len(rawURL); i++) {
		let c = $.uint($.indexStringOrBytes(rawURL, i), 8)
		switch (true) {
			case (($.uint(97, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(122, 8))) || (($.uint(65, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(90, 8))):
			{
				break
			}
			case (((($.uint(48, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(57, 8))) || ($.uint(c, 8) == $.uint(43, 8))) || ($.uint(c, 8) == $.uint(45, 8))) || ($.uint(c, 8) == $.uint(46, 8)):
			{
				if (i == 0) {
					return ["", rawURL, null]
				}
				break
			}
			case $.uint(c, 8) == $.uint(58, 8):
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
		return [null, $.interfaceValue<$.GoError>(new Error({Op: "parse", URL: u, Err: err}), "*url.Error", { kind: $.TypeKind.Pointer, elemType: "url.Error" })]
	}
	if ($.stringEqual(frag, "")) {
		return [url, null]
	}
	{
		err = URL.prototype.setFragment.call(url, frag)
		if (err != null) {
			return [null, $.interfaceValue<$.GoError>(new Error({Op: "parse", URL: rawURL, Err: err}), "*url.Error", { kind: $.TypeKind.Pointer, elemType: "url.Error" })]
		}
	}
	return [url, null]
}

export function ParseRequestURI(rawURL: string): [URL | $.VarRef<URL> | null, $.GoError] {
	let __goscriptTuple5: any = parse(rawURL, true)
	let url: URL | $.VarRef<URL> | null = __goscriptTuple5[0]
	let err = __goscriptTuple5[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>(new Error({Op: "parse", URL: rawURL, Err: err}), "*url.Error", { kind: $.TypeKind.Pointer, elemType: "url.Error" })]
	}
	return [url, null]
}

export function parse(rawURL: string, viaRequest: boolean): [URL | $.VarRef<URL> | null, $.GoError] {
	let rest: string = ""
	let err: $.GoError = null as $.GoError

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
			let i = strings.Index(authority, "/")
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
	let user: Userinfo | $.VarRef<Userinfo> | null = null as Userinfo | $.VarRef<Userinfo> | null
	let host: string = ""
	let err: $.GoError = null as $.GoError
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
			let __goscriptTuple11: any = unescape(userinfo, $.uint(16, 8))
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
			let __goscriptTuple12: any = unescape(username, $.uint(16, 8))
			username = __goscriptTuple12[0]
			err = __goscriptTuple12[1]
			if (err != null) {
				return [null, "", err]
			}
		}
		{
			let __goscriptTuple13: any = unescape(password, $.uint(16, 8))
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
				let [unescapedColonPort, err] = unescape(colonPort, $.uint(4, 8))
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
					let [hostPart, __goscriptShadow3] = unescape($.sliceStringOrBytes(hostname, undefined, zoneIdx), $.uint(4, 8))
					if (__goscriptShadow3 != null) {
						return ["", __goscriptShadow3]
					}
					let __goscriptTuple14: any = unescape($.sliceStringOrBytes(hostname, zoneIdx, undefined), $.uint(8, 8))
					let zonePart = __goscriptTuple14[0]
					__goscriptShadow3 = __goscriptTuple14[1]
					if (__goscriptShadow3 != null) {
						return ["", __goscriptShadow3]
					}
					unescapedHostname = hostPart + zonePart
				} else {
					let __goscriptShadow4: $.GoError = null as $.GoError
					let __goscriptTuple15: any = unescape(hostname, $.uint(4, 8))
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

	let err: $.GoError = null as $.GoError
	{
		let __goscriptTuple17: any = unescape(host, $.uint(4, 8))
		host = __goscriptTuple17[0]
		err = __goscriptTuple17[1]
		if (err != null) {
			return ["", err]
		}
	}
	return [host, null]
}

export function badSetPath(_p0: URL | $.VarRef<URL> | null, _p1: string): $.GoError {
	return null as $.GoError
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
	if ($.uint($.indexStringOrBytes(port, 0), 8) != $.uint(58, 8)) {
		return false
	}
	for (const [__rangeIndex, b] of $.rangeString($.sliceStringOrBytes(port, 1, undefined))) {
		if (($.int(b, 32) < $.int(48, 32)) || ($.int(b, 32) > $.int(57, 32))) {
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
	let err: $.GoError = null as $.GoError
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
				buf.value.WriteByte($.uint(38, 8))
			}
			buf.value.WriteString(keyEscaped)
			buf.value.WriteByte($.uint(61, 8))
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
		if ($.uint($.indexStringOrBytes(ref, 0), 8) != $.uint(47, 8)) {
			let i = strings.LastIndex(base, "/")
			full = $.sliceStringOrBytes(base, undefined, i + 1) + ref
		} else {
			full = ref
		}
	}
	if ($.stringEqual(full, "")) {
		return ""
	}

	let elem: string = ""
	let dst: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	let first = true
	let remaining = full
	// We want to return a leading '/', so write it now.
	dst.value.WriteByte($.uint(47, 8))
	let found = true
	while (found) {
		let __goscriptTuple22: any = strings.Cut(remaining, "/")
		elem = __goscriptTuple22[0]
		remaining = __goscriptTuple22[1]
		found = __goscriptTuple22[2]
		if ($.stringEqual(elem, ".")) {
			first = false
			// drop
			continue
		}

		if ($.stringEqual(elem, "..")) {
			// Ignore the leading '/' we already wrote.
			let str = $.sliceStringOrBytes(dst.value.String(), 1, undefined)
			let index = strings.LastIndexByte(str, $.uint(47, 8))

			dst.value.Reset()
			dst.value.WriteByte($.uint(47, 8))
			if (index == -1) {
				first = true
			} else {
				dst.value.WriteString($.sliceStringOrBytes(str, undefined, index))
			}
		} else {
			if (!first) {
				dst.value.WriteByte($.uint(47, 8))
			}
			dst.value.WriteString(elem)
			first = false
		}
	}

	if (($.stringEqual(elem, ".")) || ($.stringEqual(elem, ".."))) {
		dst.value.WriteByte($.uint(47, 8))
	}

	// We wrote an initial '/', but we don't want two.
	let r = dst.value.String()
	if (($.len(r) > 1) && ($.uint($.indexStringOrBytes(r, 1), 8) == $.uint(47, 8))) {
		r = $.sliceStringOrBytes(r, 1, undefined)
	}
	return r
}

export function splitHostPort(hostPort: string): [string, string] {
	let host: string = ""
	let port: string = ""
	host = hostPort

	let colon = strings.LastIndexByte(host, $.uint(58, 8))
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
		if (($.int(65, 32) <= $.int(r, 32)) && ($.int(r, 32) <= $.int(90, 32))) {
			continue
		}
		if (($.int(97, 32) <= $.int(r, 32)) && ($.int(r, 32) <= $.int(122, 32))) {
			continue
		}
		if (($.int(48, 32) <= $.int(r, 32)) && ($.int(r, 32) <= $.int(57, 32))) {
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
		if (($.uint(b, 8) < $.uint(32, 8)) || ($.uint(b, 8) == $.uint(0x7f, 8))) {
			return true
		}
	}
	return false
}

export function JoinPath(base: string, elem: $.Slice<string>): [string, $.GoError] {
	let result: string = ""
	let err: $.GoError = null as $.GoError
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
