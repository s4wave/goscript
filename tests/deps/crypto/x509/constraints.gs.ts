// Generated file based on constraints.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as net from "@goscript/net/index.js"

import * as netip from "@goscript/net/netip/index.js"

import * as url from "@goscript/net/url/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import type * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_cert_pool from "./cert_pool.gs.ts"

import * as __goscript_oid from "./oid.gs.ts"

import * as __goscript_parser from "./parser.gs.ts"

import * as __goscript_root_unix from "./root_unix.gs.ts"

import * as __goscript_verify from "./verify.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"

import * as __goscript_x509_string from "./x509_string.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/fmt/index.js"
import "@goscript/net/index.js"
import "@goscript/net/netip/index.js"
import "@goscript/net/url/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/math/big/index.js"
import "@goscript/time/index.js"
import "./cert_pool.gs.ts"
import "./oid.gs.ts"
import "./parser.gs.ts"
import "./root_unix.gs.ts"
import "./verify.gs.ts"
import "./x509.gs.ts"
import "./x509_string.gs.ts"

export class nameConstraintsSet {
	public get _set(): $.Slice<any> {
		return this._fields._set.value
	}
	public set _set(value: $.Slice<any>) {
		this._fields._set.value = value
	}

	public _fields: {
		_set: $.VarRef<$.Slice<any>>
	}

	constructor(init?: Partial<{_set?: $.Slice<any>}>) {
		this._fields = {
			_set: $.varRef(init?._set ?? (null! as $.Slice<any>))
		}
	}

	public clone(): nameConstraintsSet {
		const cloned = new nameConstraintsSet()
		cloned._fields = {
			_set: $.varRef(this._fields._set.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async search(__typeArgs: $.GenericTypeArgs | undefined, s: any, cmp: ((_p0: any, _p1: any) => number | globalThis.Promise<number>) | null, match: ((_p0: any, _p1: any) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<[any, boolean]> {
		const nc: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null = this
		let lowerBound: any = $.genericZero(__typeArgs, "T", null)
		let exactMatch: boolean = false
		if ($.len($.pointerValue<nameConstraintsSet>(nc)._set) == 0) {
			return [lowerBound, false]
		}
		// Look for the lower bound of s in the set.
		let [i, found] = slices.BinarySearchFunc($.pointerValue<nameConstraintsSet>(nc)._set, s, cmp)
		// If we found an exact match, return it
		if (found) {
			return [$.arrayIndex($.pointerValue<nameConstraintsSet>(nc)._set!, i), true]
		}

		if (i < 0) {
			return [lowerBound, false]
		}

		let constraint: any = $.genericZero(__typeArgs, "T", null)
		if (i == 0) {
			constraint = $.arrayIndex($.pointerValue<nameConstraintsSet>(nc)._set!, 0)
		} else {
			constraint = $.arrayIndex($.pointerValue<nameConstraintsSet>(nc)._set!, i - 1)
		}
		if (await match!(constraint, s)) {
			return [constraint, true]
		}
		return [lowerBound, false]
	}

	public async sortAndPrune(__typeArgs: $.GenericTypeArgs | undefined, cmp: ((_p0: any, _p1: any) => number | globalThis.Promise<number>) | null, subset: ((_p0: any, _p1: any) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
		let nc: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null = this
		if ($.len($.pointerValue<nameConstraintsSet>(nc)._set) < 2) {
			return
		}

		await slices.SortFunc($.pointerValue<nameConstraintsSet>(nc)._set, cmp)

		if ($.len($.pointerValue<nameConstraintsSet>(nc)._set) < 2) {
			return
		}
		let writeIndex = 1
		for (let readIndex = 1; readIndex < $.len($.pointerValue<nameConstraintsSet>(nc)._set); readIndex++) {
			if (!await subset!($.arrayIndex($.pointerValue<nameConstraintsSet>(nc)._set!, writeIndex - 1), $.arrayIndex($.pointerValue<nameConstraintsSet>(nc)._set!, readIndex))) {
				$.pointerValue<nameConstraintsSet>(nc)._set![writeIndex] = $.arrayIndex($.pointerValue<nameConstraintsSet>(nc)._set!, readIndex)
				writeIndex++
			}
		}
		$.pointerValue<nameConstraintsSet>(nc)._set = $.goSlice($.pointerValue<nameConstraintsSet>(nc)._set, undefined, writeIndex)
	}

	static __typeInfo = $.registerStructType(
		"x509.nameConstraintsSet",
		() => new nameConstraintsSet(),
		[{ name: "search", args: [{ name: "s", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "cmp", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo) }, { name: "match", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [{ name: "lowerBound", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "exactMatch", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "sortAndPrune", args: [{ name: "cmp", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo) }, { name: "subset", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [] }],
		nameConstraintsSet,
		[{ name: "set", key: "_set", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }]
	)
}

export class ipConstraints {
	public get ipv4(): nameConstraintsSet | $.VarRef<nameConstraintsSet> | null {
		return this._fields.ipv4.value
	}
	public set ipv4(value: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null) {
		this._fields.ipv4.value = value
	}

	public get ipv6(): nameConstraintsSet | $.VarRef<nameConstraintsSet> | null {
		return this._fields.ipv6.value
	}
	public set ipv6(value: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null) {
		this._fields.ipv6.value = value
	}

	public _fields: {
		ipv4: $.VarRef<nameConstraintsSet | $.VarRef<nameConstraintsSet> | null>
		ipv6: $.VarRef<nameConstraintsSet | $.VarRef<nameConstraintsSet> | null>
	}

	constructor(init?: Partial<{ipv4?: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null, ipv6?: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null}>) {
		this._fields = {
			ipv4: $.varRef(init?.ipv4 ?? (null! as nameConstraintsSet | $.VarRef<nameConstraintsSet> | null)),
			ipv6: $.varRef(init?.ipv6 ?? (null! as nameConstraintsSet | $.VarRef<nameConstraintsSet> | null))
		}
	}

	public clone(): ipConstraints {
		const cloned = new ipConstraints()
		cloned._fields = {
			ipv4: $.varRef(this._fields.ipv4.value),
			ipv6: $.varRef(this._fields.ipv6.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async query(ip: net.IP): globalThis.Promise<[net.IPNet | $.VarRef<net.IPNet> | null, boolean]> {
		const ipc: ipConstraints | $.VarRef<ipConstraints> | null = this
		let c: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null = null! as nameConstraintsSet | $.VarRef<nameConstraintsSet> | null
		if ($.len((ip as net.IP)) == net.IPv4len) {
			c = $.pointerValue<ipConstraints>(ipc).ipv4
		} else {
			c = $.pointerValue<ipConstraints>(ipc).ipv6
		}
		if (c == null) {
			return [null, false]
		}
		const __goscriptReturn0 = await nameConstraintsSet.prototype.search.call(c, {[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" }, zero: () => null, methods: {Contains: (receiver: any, ...args: any[]) => receiver.Contains(...$.stripGenericTypeArgs(args)), Network: (receiver: any, ...args: any[]) => receiver.Network(...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args))} }, V: { type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, zero: () => null, methods: {AppendText: (receiver: any, ...args: any[]) => (net.IP_AppendText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), DefaultMask: (receiver: any, ...args: any[]) => (net.IP_DefaultMask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Equal: (receiver: any, ...args: any[]) => (net.IP_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsGlobalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsGlobalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsInterfaceLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsInterfaceLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLoopback: (receiver: any, ...args: any[]) => (net.IP_IsLoopback as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsMulticast: (receiver: any, ...args: any[]) => (net.IP_IsMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsPrivate: (receiver: any, ...args: any[]) => (net.IP_IsPrivate as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsUnspecified: (receiver: any, ...args: any[]) => (net.IP_IsUnspecified as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => (net.IP_MarshalText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Mask: (receiver: any, ...args: any[]) => (net.IP_Mask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (net.IP_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To16: (receiver: any, ...args: any[]) => (net.IP_To16 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To4: (receiver: any, ...args: any[]) => (net.IP_To4 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), appendTo: (receiver: any, ...args: any[]) => (net.IP_appendTo as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), matchAddrFamily: (receiver: any, ...args: any[]) => (net.IP_matchAddrFamily as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [{ name: "AppendText", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "DefaultMask", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsGlobalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsInterfaceLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLoopback", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsPrivate", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsUnspecified", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Mask", args: [{ name: "mask", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "To16", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "To4", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "appendTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "matchAddrFamily", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }}, (ip as net.IP), ipBinarySearch, ipMatch)
		return [(__goscriptReturn0[0] as net.IPNet | $.VarRef<net.IPNet> | null), __goscriptReturn0[1]]
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"x509.ipConstraints",
		() => new ipConstraints(),
		[{ name: "query", args: [{ name: "ip", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		ipConstraints,
		[{ name: "ipv4", key: "ipv4", type: { kind: $.TypeKind.Pointer, elemType: "x509.nameConstraintsSet" }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "ipv6", key: "ipv6", type: { kind: $.TypeKind.Pointer, elemType: "x509.nameConstraintsSet" }, pkgPath: "crypto/x509", index: [1], offset: 8, exported: false }]
	)
}

export class dnsConstraints {
	// all lets us short circuit the query logic if we see a zero length
	// constraint which permits or excludes everything.
	public get all(): boolean {
		return this._fields.all.value
	}
	public set all(value: boolean) {
		this._fields.all.value = value
	}

	// permitted indicates if these constraints are for permitted or excluded
	// names.
	public get permitted(): boolean {
		return this._fields.permitted.value
	}
	public set permitted(value: boolean) {
		this._fields.permitted.value = value
	}

	public get constraints(): nameConstraintsSet | $.VarRef<nameConstraintsSet> | null {
		return this._fields.constraints.value
	}
	public set constraints(value: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null) {
		this._fields.constraints.value = value
	}

	// parentConstraints contains a subset of constraints which are used for
	// wildcard SAN queries, which are constructed by removing the first label
	// from the constraints in constraints. parentConstraints is only populated
	// if permitted is false.
	public get parentConstraints(): globalThis.Map<string, string> | null {
		return this._fields.parentConstraints.value
	}
	public set parentConstraints(value: globalThis.Map<string, string> | null) {
		this._fields.parentConstraints.value = value
	}

	public _fields: {
		all: $.VarRef<boolean>
		permitted: $.VarRef<boolean>
		constraints: $.VarRef<nameConstraintsSet | $.VarRef<nameConstraintsSet> | null>
		parentConstraints: $.VarRef<globalThis.Map<string, string> | null>
	}

	constructor(init?: Partial<{all?: boolean, permitted?: boolean, constraints?: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null, parentConstraints?: globalThis.Map<string, string> | null}>) {
		this._fields = {
			all: $.varRef(init?.all ?? (false as boolean)),
			permitted: $.varRef(init?.permitted ?? (false as boolean)),
			constraints: $.varRef(init?.constraints ?? (null! as nameConstraintsSet | $.VarRef<nameConstraintsSet> | null)),
			parentConstraints: $.varRef(init?.parentConstraints ?? (null! as globalThis.Map<string, string> | null))
		}
	}

	public clone(): dnsConstraints {
		const cloned = new dnsConstraints()
		cloned._fields = {
			all: $.varRef(this._fields.all.value),
			permitted: $.varRef(this._fields.permitted.value),
			constraints: $.varRef(this._fields.constraints.value),
			parentConstraints: $.varRef(this._fields.parentConstraints.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async query(s: string): globalThis.Promise<[string, boolean]> {
		const dnc: dnsConstraints | $.VarRef<dnsConstraints> | null = this
		if ($.pointerValue<dnsConstraints>(dnc).all) {
			return ["", true]
		}

		let __goscriptTuple0: any = await nameConstraintsSet.prototype.search.call($.pointerValue<dnsConstraints>(dnc).constraints, {[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, V: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, s, dnsCompare, dnsHasSuffix)
		let constraint = (__goscriptTuple0[0] as string)
		let match = __goscriptTuple0[1]
		if (match) {
			return [constraint, true]
		}

		if ((!$.pointerValue<dnsConstraints>(dnc).permitted && ($.len(s) > 0)) && ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(42, 8))) {
			s = strings.ToLower(s)
			let trimmed = trimFirstLabel(s)
			{
				let [__goscriptShadow0, found] = $.mapGet<string, string, string>($.pointerValue<dnsConstraints>(dnc).parentConstraints, trimmed, "")
				if (found) {
					return [__goscriptShadow0, true]
				}
			}
		}
		return ["", false]
	}

	static __typeInfo = $.registerStructType(
		"x509.dnsConstraints",
		() => new dnsConstraints(),
		[{ name: "query", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		dnsConstraints,
		[{ name: "all", key: "all", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "permitted", key: "permitted", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/x509", index: [1], offset: 1, exported: false }, { name: "constraints", key: "constraints", type: { kind: $.TypeKind.Pointer, elemType: "x509.nameConstraintsSet" }, pkgPath: "crypto/x509", index: [2], offset: 8, exported: false }, { name: "parentConstraints", key: "parentConstraints", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "crypto/x509", index: [3], offset: 16, exported: false }]
	)
}

export class emailConstraints {
	public get dnsConstraints(): any {
		return this._fields.dnsConstraints.value
	}
	public set dnsConstraints(value: any) {
		this._fields.dnsConstraints.value = value
	}

	// fullEmails is map of rfc2821Mailboxs that are fully specified in the
	// constraints, which we need to check for separately since they don't
	// follow the same matching rules as the domain-based constraints. The
	// domain portion of the rfc2821Mailbox has been lowercased, since the
	// domain portion is case insensitive. When checking the map for an email,
	// the domain portion of the query should also be lowercased.
	public get fullEmails(): globalThis.Map<__goscript_verify.rfc2821Mailbox, {}> | null {
		return this._fields.fullEmails.value
	}
	public set fullEmails(value: globalThis.Map<__goscript_verify.rfc2821Mailbox, {}> | null) {
		this._fields.fullEmails.value = value
	}

	public _fields: {
		dnsConstraints: $.VarRef<any>
		fullEmails: $.VarRef<globalThis.Map<__goscript_verify.rfc2821Mailbox, {}> | null>
	}

	constructor(init?: Partial<{dnsConstraints?: any, fullEmails?: globalThis.Map<__goscript_verify.rfc2821Mailbox, {}> | null}>) {
		this._fields = {
			dnsConstraints: $.varRef(init?.dnsConstraints ?? (null! as any)),
			fullEmails: $.varRef(init?.fullEmails ?? (null! as globalThis.Map<__goscript_verify.rfc2821Mailbox, {}> | null))
		}
	}

	public clone(): emailConstraints {
		const cloned = new emailConstraints()
		cloned._fields = {
			dnsConstraints: $.varRef(this._fields.dnsConstraints.value),
			fullEmails: $.varRef(this._fields.fullEmails.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async query(s: __goscript_verify.rfc2821Mailbox): globalThis.Promise<[string, boolean]> {
		const ec: emailConstraints | $.VarRef<emailConstraints> | null = this
		if ($.len($.pointerValue<emailConstraints>(ec).fullEmails) > 0) {
			{
				let [, ok] = $.mapGet<__goscript_verify.rfc2821Mailbox, {}, {}>($.pointerValue<emailConstraints>(ec).fullEmails, $.markAsStructValue($.cloneStructValue(s)), {})
				if (ok) {
					return [await fmt.Sprintf("%s@%s", s.local, s.domain), true]
				}
			}
		}
		if ($.pointerValue<emailConstraints>(ec).dnsConstraints == null) {
			return ["", false]
		}
		let [constraint, found] = await $.pointerValue<any>($.pointerValue<emailConstraints>(ec).dnsConstraints).query(s.domain)
		return [constraint, found]
	}

	static __typeInfo = $.registerStructType(
		"x509.emailConstraints",
		() => new emailConstraints(),
		[{ name: "query", args: [{ name: "s", type: "x509.rfc2821Mailbox" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		emailConstraints,
		[{ name: "dnsConstraints", key: "dnsConstraints", type: { kind: $.TypeKind.Interface, methods: [{ name: "query", args: [{ name: "_p0", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "fullEmails", key: "fullEmails", type: { kind: $.TypeKind.Map, keyType: "x509.rfc2821Mailbox", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "crypto/x509", index: [1], offset: 16, exported: false }]
	)
}

export class constraints {
	public get constraintType(): string {
		return this._fields.constraintType.value
	}
	public set constraintType(value: string) {
		this._fields.constraintType.value = value
	}

	public get permitted(): any {
		return this._fields.permitted.value
	}
	public set permitted(value: any) {
		this._fields.permitted.value = value
	}

	public get excluded(): any {
		return this._fields.excluded.value
	}
	public set excluded(value: any) {
		this._fields.excluded.value = value
	}

	public _fields: {
		constraintType: $.VarRef<string>
		permitted: $.VarRef<any>
		excluded: $.VarRef<any>
	}

	constructor(init?: Partial<{constraintType?: string, permitted?: any, excluded?: any}>) {
		this._fields = {
			constraintType: $.varRef(init?.constraintType ?? ("" as string)),
			permitted: $.varRef(init?.permitted ?? (null! as any)),
			excluded: $.varRef(init?.excluded ?? (null! as any))
		}
	}

	public clone(): constraints {
		const cloned = new constraints()
		cloned._fields = {
			constraintType: $.varRef(this._fields.constraintType.value),
			permitted: $.varRef(this._fields.permitted.value),
			excluded: $.varRef(this._fields.excluded.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.constraints",
		() => new constraints(),
		[],
		constraints,
		[{ name: "constraintType", key: "constraintType", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "permitted", key: "permitted", type: { kind: $.TypeKind.Interface, methods: [{ name: "query", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }, pkgPath: "crypto/x509", index: [1], offset: 16, exported: false }, { name: "excluded", key: "excluded", type: { kind: $.TypeKind.Interface, methods: [{ name: "query", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }, pkgPath: "crypto/x509", index: [2], offset: 32, exported: false }]
	)
}

export class chainConstraints {
	public get ip(): constraints {
		return this._fields.ip.value
	}
	public set ip(value: constraints) {
		this._fields.ip.value = value
	}

	public get dns(): constraints {
		return this._fields.dns.value
	}
	public set dns(value: constraints) {
		this._fields.dns.value = value
	}

	public get uri(): constraints {
		return this._fields.uri.value
	}
	public set uri(value: constraints) {
		this._fields.uri.value = value
	}

	public get email(): constraints {
		return this._fields.email.value
	}
	public set email(value: constraints) {
		this._fields.email.value = value
	}

	public get index(): number {
		return this._fields.index.value
	}
	public set index(value: number) {
		this._fields.index.value = value
	}

	public get next(): chainConstraints | $.VarRef<chainConstraints> | null {
		return this._fields.next.value
	}
	public set next(value: chainConstraints | $.VarRef<chainConstraints> | null) {
		this._fields.next.value = value
	}

	public _fields: {
		ip: $.VarRef<constraints>
		dns: $.VarRef<constraints>
		uri: $.VarRef<constraints>
		email: $.VarRef<constraints>
		index: $.VarRef<number>
		next: $.VarRef<chainConstraints | $.VarRef<chainConstraints> | null>
	}

	constructor(init?: Partial<{ip?: constraints, dns?: constraints, uri?: constraints, email?: constraints, index?: number, next?: chainConstraints | $.VarRef<chainConstraints> | null}>) {
		this._fields = {
			ip: $.varRef(init?.ip ? $.markAsStructValue($.cloneStructValue(init.ip)) : $.markAsStructValue(new constraints())),
			dns: $.varRef(init?.dns ? $.markAsStructValue($.cloneStructValue(init.dns)) : $.markAsStructValue(new constraints())),
			uri: $.varRef(init?.uri ? $.markAsStructValue($.cloneStructValue(init.uri)) : $.markAsStructValue(new constraints())),
			email: $.varRef(init?.email ? $.markAsStructValue($.cloneStructValue(init.email)) : $.markAsStructValue(new constraints())),
			index: $.varRef(init?.index ?? (0 as number)),
			next: $.varRef(init?.next ?? (null! as chainConstraints | $.VarRef<chainConstraints> | null))
		}
	}

	public clone(): chainConstraints {
		const cloned = new chainConstraints()
		cloned._fields = {
			ip: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ip.value))),
			dns: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.dns.value))),
			uri: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.uri.value))),
			email: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.email.value))),
			index: $.varRef(this._fields.index.value),
			next: $.varRef(this._fields.next.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async check(dns: $.Slice<string>, uris: $.Slice<parsedURI>, emails: $.Slice<__goscript_verify.rfc2821Mailbox>, ips: $.Slice<net.IP>): globalThis.Promise<$.GoError> {
		const cc: chainConstraints | $.VarRef<chainConstraints> | null = this
		for (let __goscriptRangeTarget5 = ips, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
			let ip = __goscriptRangeTarget5![__rangeIndex]
			{
				let err = await checkConstraints({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" }, zero: () => null, methods: {Contains: (receiver: any, ...args: any[]) => receiver.Contains(...$.stripGenericTypeArgs(args)), Network: (receiver: any, ...args: any[]) => receiver.Network(...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args))} }, V: { type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, zero: () => null, methods: {AppendText: (receiver: any, ...args: any[]) => (net.IP_AppendText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), DefaultMask: (receiver: any, ...args: any[]) => (net.IP_DefaultMask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Equal: (receiver: any, ...args: any[]) => (net.IP_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsGlobalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsGlobalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsInterfaceLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsInterfaceLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLoopback: (receiver: any, ...args: any[]) => (net.IP_IsLoopback as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsMulticast: (receiver: any, ...args: any[]) => (net.IP_IsMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsPrivate: (receiver: any, ...args: any[]) => (net.IP_IsPrivate as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsUnspecified: (receiver: any, ...args: any[]) => (net.IP_IsUnspecified as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => (net.IP_MarshalText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Mask: (receiver: any, ...args: any[]) => (net.IP_Mask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (net.IP_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To16: (receiver: any, ...args: any[]) => (net.IP_To16 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To4: (receiver: any, ...args: any[]) => (net.IP_To4 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), appendTo: (receiver: any, ...args: any[]) => (net.IP_appendTo as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), matchAddrFamily: (receiver: any, ...args: any[]) => (net.IP_matchAddrFamily as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [{ name: "AppendText", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "DefaultMask", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsGlobalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsInterfaceLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLoopback", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsPrivate", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsUnspecified", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Mask", args: [{ name: "mask", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "To16", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "To4", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "appendTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "matchAddrFamily", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }, P: { type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, zero: () => null, methods: {AppendText: (receiver: any, ...args: any[]) => (net.IP_AppendText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), DefaultMask: (receiver: any, ...args: any[]) => (net.IP_DefaultMask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Equal: (receiver: any, ...args: any[]) => (net.IP_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsGlobalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsGlobalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsInterfaceLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsInterfaceLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLoopback: (receiver: any, ...args: any[]) => (net.IP_IsLoopback as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsMulticast: (receiver: any, ...args: any[]) => (net.IP_IsMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsPrivate: (receiver: any, ...args: any[]) => (net.IP_IsPrivate as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsUnspecified: (receiver: any, ...args: any[]) => (net.IP_IsUnspecified as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => (net.IP_MarshalText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Mask: (receiver: any, ...args: any[]) => (net.IP_Mask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (net.IP_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To16: (receiver: any, ...args: any[]) => (net.IP_To16 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To4: (receiver: any, ...args: any[]) => (net.IP_To4 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), appendTo: (receiver: any, ...args: any[]) => (net.IP_appendTo as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), matchAddrFamily: (receiver: any, ...args: any[]) => (net.IP_matchAddrFamily as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [{ name: "AppendText", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "DefaultMask", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsGlobalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsInterfaceLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLoopback", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsPrivate", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsUnspecified", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Mask", args: [{ name: "mask", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "To16", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "To4", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "appendTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "matchAddrFamily", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }}, $.markAsStructValue($.cloneStructValue($.pointerValue<chainConstraints>(cc).ip)), (ip as net.IP), (ip as net.IP))
				if (err != null) {
					return err
				}
			}
		}
		for (let __goscriptRangeTarget6 = dns, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
			let d = __goscriptRangeTarget6![__rangeIndex]
			if (!__goscript_parser.domainNameValid(d, false)) {
				return fmt.Errorf("x509: cannot parse dnsName %q", d)
			}
			{
				let err = await checkConstraints({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, V: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, P: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, $.markAsStructValue($.cloneStructValue($.pointerValue<chainConstraints>(cc).dns)), d, d)
				if (err != null) {
					return err
				}
			}
		}
		for (let __goscriptRangeTarget7 = uris, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget7); __rangeIndex++) {
			let u = __goscriptRangeTarget7![__rangeIndex]
			if (!__goscript_parser.domainNameValid(u.domain, false)) {
				return fmt.Errorf("x509: internal error: URI SAN %q failed to parse", $.interfaceValue($.markAsStructValue($.cloneStructValue(u)), "x509.parsedURI", "x509.parsedURI"))
			}
			{
				let err = await checkConstraints({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, V: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, P: { type: "x509.parsedURI", zero: () => $.markAsStructValue(new parsedURI()), methods: {String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args))} }}, $.markAsStructValue($.cloneStructValue($.pointerValue<chainConstraints>(cc).uri)), u.domain, $.markAsStructValue($.cloneStructValue(u)))
				if (err != null) {
					return err
				}
			}
		}
		for (let __goscriptRangeTarget8 = emails, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
			let e = __goscriptRangeTarget8![__rangeIndex]
			if (!__goscript_parser.domainNameValid(e.domain, false)) {
				return fmt.Errorf("x509: cannot parse rfc822Name %q", $.interfaceValue($.markAsStructValue($.cloneStructValue(e)), "x509.rfc2821Mailbox", "x509.rfc2821Mailbox"))
			}
			{
				let err = await checkConstraints({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, V: { type: "x509.rfc2821Mailbox", zero: () => $.markAsStructValue(new __goscript_verify.rfc2821Mailbox()), methods: {String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args))} }, P: { type: "x509.rfc2821Mailbox", zero: () => $.markAsStructValue(new __goscript_verify.rfc2821Mailbox()), methods: {String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args))} }}, $.markAsStructValue($.cloneStructValue($.pointerValue<chainConstraints>(cc).email)), $.markAsStructValue($.cloneStructValue(e)), $.markAsStructValue($.cloneStructValue(e)))
				if (err != null) {
					return err
				}
			}
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"x509.chainConstraints",
		() => new chainConstraints(),
		[{ name: "check", args: [{ name: "dns", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "uris", type: { kind: $.TypeKind.Slice, elemType: "x509.parsedURI" } }, { name: "emails", type: { kind: $.TypeKind.Slice, elemType: "x509.rfc2821Mailbox" } }, { name: "ips", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }], returns: [{ name: "_r0", type: "error" }] }],
		chainConstraints,
		[{ name: "ip", key: "ip", type: "x509.constraints", pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "dns", key: "dns", type: "x509.constraints", pkgPath: "crypto/x509", index: [1], offset: 48, exported: false }, { name: "uri", key: "uri", type: "x509.constraints", pkgPath: "crypto/x509", index: [2], offset: 96, exported: false }, { name: "email", key: "email", type: "x509.constraints", pkgPath: "crypto/x509", index: [3], offset: 144, exported: false }, { name: "index", key: "index", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/x509", index: [4], offset: 192, exported: false }, { name: "next", key: "next", type: { kind: $.TypeKind.Pointer, elemType: "x509.chainConstraints" }, pkgPath: "crypto/x509", index: [5], offset: 200, exported: false }]
	)
}

export class parsedURI {
	public get uri(): url.URL | $.VarRef<url.URL> | null {
		return this._fields.uri.value
	}
	public set uri(value: url.URL | $.VarRef<url.URL> | null) {
		this._fields.uri.value = value
	}

	public get domain(): string {
		return this._fields.domain.value
	}
	public set domain(value: string) {
		this._fields.domain.value = value
	}

	public _fields: {
		uri: $.VarRef<url.URL | $.VarRef<url.URL> | null>
		domain: $.VarRef<string>
	}

	constructor(init?: Partial<{uri?: url.URL | $.VarRef<url.URL> | null, domain?: string}>) {
		this._fields = {
			uri: $.varRef(init?.uri ?? (null! as url.URL | $.VarRef<url.URL> | null)),
			domain: $.varRef(init?.domain ?? ("" as string))
		}
	}

	public clone(): parsedURI {
		const cloned = new parsedURI()
		cloned._fields = {
			uri: $.varRef(this._fields.uri.value),
			domain: $.varRef(this._fields.domain.value)
		}
		return $.markAsStructValue(cloned)
	}

	public String(): string {
		const u = this
		return url.URL.prototype.String.call(u.uri)
	}

	static __typeInfo = $.registerStructType(
		"x509.parsedURI",
		() => new parsedURI(),
		[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		parsedURI,
		[{ name: "uri", key: "uri", type: { kind: $.TypeKind.Pointer, elemType: "url.URL" }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "domain", key: "domain", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/x509", index: [1], offset: 8, exported: false }]
	)
}

export function ipNetworkSubset(a: net.IPNet | $.VarRef<net.IPNet> | null, b: net.IPNet | $.VarRef<net.IPNet> | null): boolean {
	if (!net.IPNet.prototype.Contains.call(a, ($.pointerValue<net.IPNet>(b).IP as net.IP))) {
		return false
	}
	let broadcast: net.IP = ($.makeSlice<number>($.len(($.pointerValue<net.IPNet>(b).IP as net.IP)), undefined, "byte") as net.IP)
	for (let __goscriptRangeTarget0 = $.pointerValue<net.IPNet>(b).IP, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		broadcast![i] = $.uint($.arrayIndex($.pointerValue<net.IPNet>(b).IP!, i) | ($.uint(~$.arrayIndex($.pointerValue<net.IPNet>(b).Mask!, i), 8)), 8)
	}
	return net.IPNet.prototype.Contains.call(a, (broadcast as net.IP))
}

export function ipNetworkCompare(a: net.IPNet | $.VarRef<net.IPNet> | null, b: net.IPNet | $.VarRef<net.IPNet> | null): number {
	let i = bytes.Compare($.pointerValue<net.IPNet>(a).IP, $.pointerValue<net.IPNet>(b).IP)
	if (i != 0) {
		return i
	}
	return bytes.Compare($.pointerValue<net.IPNet>(a).Mask, $.pointerValue<net.IPNet>(b).Mask)
}

export function ipBinarySearch(constraint: net.IPNet | $.VarRef<net.IPNet> | null, target: net.IP): number {
	return bytes.Compare($.pointerValue<net.IPNet>(constraint).IP, target)
}

export function ipMatch(constraint: net.IPNet | $.VarRef<net.IPNet> | null, target: net.IP): boolean {
	return net.IPNet.prototype.Contains.call(constraint, (target as net.IP))
}

export async function newIPNetConstraints(l: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>): globalThis.Promise<any> {
	if ($.len(l) == 0) {
		return null
	}
	let ipv4: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null> = null! as $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>
	let ipv6: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null> = null! as $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>
	for (let __goscriptRangeTarget1 = l, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let n = __goscriptRangeTarget1![__rangeIndex]
		if ($.len(($.pointerValue<net.IPNet>(n).IP as net.IP)) == net.IPv4len) {
			ipv4 = $.append(ipv4, n, $.appendZeros.nil)
		} else {
			ipv6 = $.append(ipv6, n, $.appendZeros.nil)
		}
	}
	let v4c: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null = null! as nameConstraintsSet | $.VarRef<nameConstraintsSet> | null
	let v6c: nameConstraintsSet | $.VarRef<nameConstraintsSet> | null = null! as nameConstraintsSet | $.VarRef<nameConstraintsSet> | null
	if ($.len(ipv4) > 0) {
		v4c = new nameConstraintsSet({_set: ipv4})
		await nameConstraintsSet.prototype.sortAndPrune.call(v4c, {[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" }, zero: () => null, methods: {Contains: (receiver: any, ...args: any[]) => receiver.Contains(...$.stripGenericTypeArgs(args)), Network: (receiver: any, ...args: any[]) => receiver.Network(...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args))} }, V: { type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, zero: () => null, methods: {AppendText: (receiver: any, ...args: any[]) => (net.IP_AppendText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), DefaultMask: (receiver: any, ...args: any[]) => (net.IP_DefaultMask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Equal: (receiver: any, ...args: any[]) => (net.IP_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsGlobalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsGlobalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsInterfaceLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsInterfaceLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLoopback: (receiver: any, ...args: any[]) => (net.IP_IsLoopback as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsMulticast: (receiver: any, ...args: any[]) => (net.IP_IsMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsPrivate: (receiver: any, ...args: any[]) => (net.IP_IsPrivate as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsUnspecified: (receiver: any, ...args: any[]) => (net.IP_IsUnspecified as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => (net.IP_MarshalText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Mask: (receiver: any, ...args: any[]) => (net.IP_Mask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (net.IP_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To16: (receiver: any, ...args: any[]) => (net.IP_To16 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To4: (receiver: any, ...args: any[]) => (net.IP_To4 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), appendTo: (receiver: any, ...args: any[]) => (net.IP_appendTo as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), matchAddrFamily: (receiver: any, ...args: any[]) => (net.IP_matchAddrFamily as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [{ name: "AppendText", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "DefaultMask", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsGlobalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsInterfaceLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLoopback", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsPrivate", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsUnspecified", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Mask", args: [{ name: "mask", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "To16", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "To4", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "appendTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "matchAddrFamily", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }}, ipNetworkCompare, ipNetworkSubset)
	}
	if ($.len(ipv6) > 0) {
		v6c = new nameConstraintsSet({_set: ipv6})
		await nameConstraintsSet.prototype.sortAndPrune.call(v6c, {[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" }, zero: () => null, methods: {Contains: (receiver: any, ...args: any[]) => receiver.Contains(...$.stripGenericTypeArgs(args)), Network: (receiver: any, ...args: any[]) => receiver.Network(...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args))} }, V: { type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, zero: () => null, methods: {AppendText: (receiver: any, ...args: any[]) => (net.IP_AppendText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), DefaultMask: (receiver: any, ...args: any[]) => (net.IP_DefaultMask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Equal: (receiver: any, ...args: any[]) => (net.IP_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsGlobalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsGlobalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsInterfaceLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsInterfaceLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalMulticast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLinkLocalUnicast: (receiver: any, ...args: any[]) => (net.IP_IsLinkLocalUnicast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsLoopback: (receiver: any, ...args: any[]) => (net.IP_IsLoopback as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsMulticast: (receiver: any, ...args: any[]) => (net.IP_IsMulticast as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsPrivate: (receiver: any, ...args: any[]) => (net.IP_IsPrivate as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), IsUnspecified: (receiver: any, ...args: any[]) => (net.IP_IsUnspecified as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => (net.IP_MarshalText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Mask: (receiver: any, ...args: any[]) => (net.IP_Mask as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (net.IP_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To16: (receiver: any, ...args: any[]) => (net.IP_To16 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), To4: (receiver: any, ...args: any[]) => (net.IP_To4 as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), appendTo: (receiver: any, ...args: any[]) => (net.IP_appendTo as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), matchAddrFamily: (receiver: any, ...args: any[]) => (net.IP_matchAddrFamily as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [{ name: "AppendText", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "DefaultMask", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsGlobalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsInterfaceLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLinkLocalUnicast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsLoopback", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsMulticast", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsPrivate", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsUnspecified", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Mask", args: [{ name: "mask", type: { kind: $.TypeKind.Slice, typeName: "net.IPMask", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "To16", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "To4", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "appendTo", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "matchAddrFamily", args: [{ name: "x", type: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }}, ipNetworkCompare, ipNetworkSubset)
	}
	return $.interfaceValue(new ipConstraints({ipv4: v4c, ipv6: v6c}), "*x509.ipConstraints", { kind: $.TypeKind.Pointer, elemType: "x509.ipConstraints" })
}

export function dnsHasSuffix(a: string, b: string): boolean {
	let lenA = $.len(a)
	let lenB = $.len(b)
	if (lenA > lenB) {
		return false
	}
	let i = lenA - 1
	let offset = lenA - lenB
	for (; i >= 0; i--) {
		let ar = $.uint($.indexStringOrBytes(a, i), 8)
		let br = $.uint($.indexStringOrBytes(b, i - (offset)), 8)
		if ($.uint(ar, 8) == $.uint(br, 8)) {
			continue
		}
		if ($.uint(br, 8) < $.uint(ar, 8)) {
			let __goscriptAssign0_0: number = $.uint(br, 8)
			let __goscriptAssign0_1: number = $.uint(ar, 8)
			ar = __goscriptAssign0_0
			br = __goscriptAssign0_1
		}
		if ((($.uint(65, 8) <= $.uint(ar, 8)) && ($.uint(ar, 8) <= $.uint(90, 8))) && ($.uint(br, 8) == $.uint(((ar + 97) - 65), 8))) {
			continue
		}
		return false
	}

	if ((($.uint($.indexStringOrBytes(a, 0), 8) != $.uint(46, 8)) && (lenB > lenA)) && ($.uint($.indexStringOrBytes(b, (lenB - lenA) - 1), 8) != $.uint(46, 8))) {
		return false
	}

	return true
}

export let dnsCompareTable: Uint8Array = new Uint8Array(256)

export function __goscript_set_dnsCompareTable(__goscriptValue: Uint8Array): void {
	dnsCompareTable = __goscriptValue
}

function __goscriptInit0(): void {
	// NOTE: we don't actually need the
	// full alphabet, but calculating offsets would be more expensive than just
	// having redundant characters.
	for (let i = 0; i < 256; i++) {
		let c = $.uint($.uint(i, 8), 8)
		if (($.uint(65, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(90, 8))) {
			// Lowercase uppercase characters A-Z.
			c = c + ($.uint(97 - 65, 8))
		}
		dnsCompareTable[i] = $.uint(c, 8)
	}
	// Set the period character to 0 so that we get the right sorting behavior.
	//
	// In particular, we need the period character to sort before the only
	// other valid DNS name character which isn't a-z or 0-9, the hyphen,
	// otherwise a name with a dash would be incorrectly sorted into the middle
	// of another tree.
	//
	// For example, imagine a certificate with the constraints "a.com", "a.a.com", and
	// "a-a.com". These would sort as "a.com", "a-a.com", "a.a.com", which would break
	// the pruning step since we wouldn't see that "a.a.com" is a subset of "a.com".
	// Sorting the period before the hyphen ensures that "a.a.com" sorts before "a-a.com".
	dnsCompareTable[46] = $.uint(0, 8)
}

export function dnsCompare(a: string, b: string): number {
	let idxA = $.len(a) - 1
	let idxB = $.len(b) - 1

	while ((idxA >= 0) && (idxB >= 0)) {
		let byteA = $.uint($.arrayIndex(dnsCompareTable, $.indexStringOrBytes(a, idxA)), 8)
		let byteB = $.uint($.arrayIndex(dnsCompareTable, $.indexStringOrBytes(b, idxB)), 8)
		if ($.uint(byteA, 8) == $.uint(byteB, 8)) {
			idxA--
			idxB--
			continue
		}
		let ret = 1
		if ($.uint(byteA, 8) < $.uint(byteB, 8)) {
			ret = -1
		}
		return ret
	}

	let ret = 0
	if (idxA < idxB) {
		ret = -1
	} else {
		if (idxB < idxA) {
			ret = 1
		}
	}
	return ret
}

export async function newDNSConstraints(l: $.Slice<string>, permitted: boolean): globalThis.Promise<any> {
	if ($.len(l) == 0) {
		return null
	}
	for (let __goscriptRangeTarget2 = l, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let n = __goscriptRangeTarget2![__rangeIndex]
		if ($.len(n) == 0) {
			return $.interfaceValue(new dnsConstraints({all: true}), "*x509.dnsConstraints", { kind: $.TypeKind.Pointer, elemType: "x509.dnsConstraints" })
		}
	}
	let __goscriptShadow1: $.Slice<string> = (slices.Clone(l) as $.Slice<string>)

	let nc: dnsConstraints | $.VarRef<dnsConstraints> | null = new dnsConstraints({constraints: new nameConstraintsSet({_set: __goscriptShadow1}), permitted: permitted})

	await nameConstraintsSet.prototype.sortAndPrune.call($.pointerValue<dnsConstraints>(nc).constraints, {[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, V: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, dnsCompare, dnsHasSuffix)

	if (!permitted) {
		let parentConstraints: globalThis.Map<string, string> | null = new globalThis.Map<string, string>([])
		for (let __goscriptRangeTarget3 = $.pointerValue<nameConstraintsSet>($.pointerValue<dnsConstraints>(nc).constraints)._set, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let name = __goscriptRangeTarget3![__rangeIndex]
			name = strings.ToLower(name)
			let trimmedName = trimFirstLabel(name)
			if ($.stringEqual(trimmedName, "")) {
				continue
			}
			$.mapSet(parentConstraints, trimmedName, name)
		}
		if ($.len(parentConstraints) > 0) {
			$.pointerValue<dnsConstraints>(nc).parentConstraints = parentConstraints
		}
	}

	return $.interfaceValue(nc, "*x509.dnsConstraints", { kind: $.TypeKind.Pointer, elemType: "x509.dnsConstraints" })
}

export async function newEmailConstraints(l: $.Slice<string>, permitted: boolean): globalThis.Promise<any> {
	if ($.len(l) == 0) {
		return null
	}
	let exactMap: globalThis.Map<__goscript_verify.rfc2821Mailbox, {}> | null = new globalThis.Map<__goscript_verify.rfc2821Mailbox, {}>([])
	let domains: $.Slice<string> = null! as $.Slice<string>
	for (let __goscriptRangeTarget4 = l, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let c = __goscriptRangeTarget4![__rangeIndex]
		if (!strings.ContainsRune(c, $.int(64, 32))) {
			domains = $.append(domains, c)
			continue
		}
		let [parsed, ok] = __goscript_verify.parseRFC2821Mailbox(c)
		if (!ok) {
			// We've already parsed these addresses in parseCertificate, and
			// treat failures as a hard failure for parsing. The only way we can
			// get a parse failure here is if the caller has mutated the
			// certificate since parsing.
			continue
		}
		parsed.domain = strings.ToLower(parsed.domain)
		$.mapSet(exactMap, $.markAsStructValue($.cloneStructValue(parsed)), {})
	}
	let ec: emailConstraints | $.VarRef<emailConstraints> | null = new emailConstraints({fullEmails: exactMap})
	if ($.len(domains) > 0) {
		$.pointerValue<emailConstraints>(ec).dnsConstraints = await newDNSConstraints(domains, permitted)
	}
	return $.interfaceValue(ec, "*x509.emailConstraints", { kind: $.TypeKind.Pointer, elemType: "x509.emailConstraints" })
}

export async function checkConstraints(__typeArgs: $.GenericTypeArgs | undefined, c: constraints, s: any, p: any): globalThis.Promise<$.GoError> {
	if (c.permitted != null) {
		{
			let [, found] = await $.pointerValue<any>(c.permitted).query(s)
			if (!found) {
				return fmt.Errorf("%s %q is not permitted by any constraint", c.constraintType, (p as any))
			}
		}
	}
	if (c.excluded != null) {
		{
			let __goscriptTuple1: any = await $.pointerValue<any>(c.excluded).query(s)
			let constraint = (__goscriptTuple1[0] as any)
			let found = __goscriptTuple1[1]
			if (found) {
				return fmt.Errorf("%s %q is excluded by constraint %q", c.constraintType, (p as any), (constraint as any))
			}
		}
	}
	return null
}

export async function checkChainConstraints(chain: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>): globalThis.Promise<$.GoError> {
	let currentConstraints: chainConstraints | $.VarRef<chainConstraints> | null = null! as chainConstraints | $.VarRef<chainConstraints> | null
	let last: chainConstraints | $.VarRef<chainConstraints> | null = null! as chainConstraints | $.VarRef<chainConstraints> | null
	for (let __goscriptRangeTarget9 = chain, i = 0; i < $.len(__goscriptRangeTarget9); i++) {
		let c = __goscriptRangeTarget9![i]
		if (!__goscript_x509.Certificate.prototype.hasNameConstraints.call(c)) {
			continue
		}
		let cc: chainConstraints | $.VarRef<chainConstraints> | null = new chainConstraints({ip: (await (async () => { const __goscriptLiteralField0 = await newIPNetConstraints($.pointerValue<__goscript_x509.Certificate>(c).PermittedIPRanges); const __goscriptLiteralField1 = await newIPNetConstraints($.pointerValue<__goscript_x509.Certificate>(c).ExcludedIPRanges); return $.markAsStructValue(new constraints({constraintType: "IP address", permitted: __goscriptLiteralField0, excluded: __goscriptLiteralField1})) })()), dns: (await (async () => { const __goscriptLiteralField2 = await newDNSConstraints($.pointerValue<__goscript_x509.Certificate>(c).PermittedDNSDomains, true); const __goscriptLiteralField3 = await newDNSConstraints($.pointerValue<__goscript_x509.Certificate>(c).ExcludedDNSDomains, false); return $.markAsStructValue(new constraints({constraintType: "DNS name", permitted: __goscriptLiteralField2, excluded: __goscriptLiteralField3})) })()), uri: (await (async () => { const __goscriptLiteralField4 = await newDNSConstraints($.pointerValue<__goscript_x509.Certificate>(c).PermittedURIDomains, true); const __goscriptLiteralField5 = await newDNSConstraints($.pointerValue<__goscript_x509.Certificate>(c).ExcludedURIDomains, false); return $.markAsStructValue(new constraints({constraintType: "URI", permitted: __goscriptLiteralField4, excluded: __goscriptLiteralField5})) })()), email: (await (async () => { const __goscriptLiteralField6 = await newEmailConstraints($.pointerValue<__goscript_x509.Certificate>(c).PermittedEmailAddresses, true); const __goscriptLiteralField7 = await newEmailConstraints($.pointerValue<__goscript_x509.Certificate>(c).ExcludedEmailAddresses, false); return $.markAsStructValue(new constraints({constraintType: "email address", permitted: __goscriptLiteralField6, excluded: __goscriptLiteralField7})) })()), index: i})
		if (currentConstraints == null) {
			currentConstraints = cc
			last = cc
		} else {
			if (last != null) {
				$.pointerValue<chainConstraints>(last).next = cc
				last = cc
			}
		}
	}
	if (currentConstraints == null) {
		return null
	}

	for (let __goscriptRangeTarget10 = chain, i = 0; i < $.len(__goscriptRangeTarget10); i++) {
		let c = __goscriptRangeTarget10![i]
		if (!__goscript_x509.Certificate.prototype.hasSANExtension.call(c)) {
			continue
		}
		if (i >= $.pointerValue<chainConstraints>(currentConstraints).index) {
			while ($.pointerValue<chainConstraints>(currentConstraints).index <= i) {
				if ($.pointerValue<chainConstraints>(currentConstraints).next == null) {
					return null
				}
				currentConstraints = $.pointerValue<chainConstraints>(currentConstraints).next
			}
		}

		let __goscriptTuple2: any = await parseURIs($.pointerValue<__goscript_x509.Certificate>(c).URIs)
		let uris: $.Slice<parsedURI> = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		if (err != null) {
			return err
		}
		let __goscriptTuple3: any = parseMailboxes($.pointerValue<__goscript_x509.Certificate>(c).EmailAddresses)
		let emails: $.Slice<__goscript_verify.rfc2821Mailbox> = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
		if (err != null) {
			return err
		}

		for (let n: chainConstraints | $.VarRef<chainConstraints> | null = currentConstraints; n != null; n = $.pointerValue<chainConstraints>(n).next) {
			{
				let __goscriptShadow2 = await chainConstraints.prototype.check.call(n, $.pointerValue<__goscript_x509.Certificate>(c).DNSNames, uris, emails, $.pointerValue<__goscript_x509.Certificate>(c).IPAddresses)
				if (__goscriptShadow2 != null) {
					return __goscriptShadow2
				}
			}
		}
	}

	return null
}

export async function parseURIs(uris: $.Slice<url.URL | $.VarRef<url.URL> | null>): globalThis.Promise<[$.Slice<parsedURI>, $.GoError]> {
	let parsed: $.Slice<parsedURI> = $.makeSlice<parsedURI>(0, $.len(uris), undefined, () => $.markAsStructValue(new parsedURI()))
	for (let __goscriptRangeTarget11 = uris, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
		let uri = __goscriptRangeTarget11![__rangeIndex]
		let host = strings.ToLower($.pointerValue<url.URL>(uri).Host)
		if ($.len(host) == 0) {
			return [null, fmt.Errorf("URI with empty host (%q) cannot be matched against constraints", url.URL.prototype.String.call(uri))]
		}
		if (strings.Contains(host, ":") && !strings.HasSuffix(host, "]")) {
			let err: $.GoError = null! as $.GoError
			let __goscriptTuple4: any = await net.SplitHostPort($.pointerValue<url.URL>(uri).Host)
			host = __goscriptTuple4[0]
			err = __goscriptTuple4[2]
			if (err != null) {
				return [null, fmt.Errorf("cannot parse URI host %q: %v", $.pointerValue<url.URL>(uri).Host, (err as any))]
			}
		}

		// netip.ParseAddr will reject the URI IPv6 literal form "[...]", so we
		// check if _either_ the string parses as an IP, or if it is enclosed in
		// square brackets.
		{
			let [, err] = netip.ParseAddr(host)
			if ((err == null) || (strings.HasPrefix(host, "[") && strings.HasSuffix(host, "]"))) {
				return [null, fmt.Errorf("URI with IP (%q) cannot be matched against constraints", url.URL.prototype.String.call(uri))]
			}
		}

		parsed = $.append(parsed, $.markAsStructValue(new parsedURI({uri: uri, domain: host})))
	}
	return [parsed, null]
}

export function parseMailboxes(emails: $.Slice<string>): [$.Slice<__goscript_verify.rfc2821Mailbox>, $.GoError] {
	let parsed: $.Slice<__goscript_verify.rfc2821Mailbox> = $.makeSlice<__goscript_verify.rfc2821Mailbox>(0, $.len(emails), undefined, () => $.markAsStructValue(new __goscript_verify.rfc2821Mailbox()))
	for (let __goscriptRangeTarget12 = emails, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
		let email = __goscriptRangeTarget12![__rangeIndex]
		let [mailbox, ok] = __goscript_verify.parseRFC2821Mailbox(email)
		if (!ok) {
			return [null, fmt.Errorf("cannot parse rfc822Name %q", email)]
		}
		mailbox.domain = strings.ToLower(mailbox.domain)
		parsed = $.append(parsed, mailbox)
	}
	return [parsed, null]
}

export function trimFirstLabel(dnsName: string): string {
	let firstDotInd = strings.IndexByte(dnsName, $.uint(46, 8))
	if (firstDotInd < 0) {
		// Constraint is a single label, we cannot trim it.
		return ""
	}
	return $.sliceStringOrBytes(dnsName, firstDotInd, undefined)
}

__goscriptInit0()
