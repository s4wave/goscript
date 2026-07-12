// Generated file based on cert_pool.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as sha256 from "@goscript/crypto/sha256/index.js"

import * as pem from "@goscript/encoding/pem/index.js"

import * as sync from "@goscript/sync/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import type * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as net from "@goscript/net/index.js"

import * as url from "@goscript/net/url/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_oid from "./oid.gs.ts"

import * as __goscript_parser from "./parser.gs.ts"

import * as __goscript_root from "./root.gs.ts"

import * as __goscript_root_unix from "./root_unix.gs.ts"

import * as __goscript_verify from "./verify.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"

import * as __goscript_x509_string from "./x509_string.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/sha256/index.js"
import "@goscript/encoding/pem/index.js"
import "@goscript/sync/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/math/big/index.js"
import "@goscript/net/index.js"
import "@goscript/net/url/index.js"
import "@goscript/time/index.js"
import "./oid.gs.ts"
import "./parser.gs.ts"
import "./root.gs.ts"
import "./root_unix.gs.ts"
import "./verify.gs.ts"
import "./x509.gs.ts"
import "./x509_string.gs.ts"

export type sum224 = Uint8Array

export class CertPool {
	public get byName(): globalThis.Map<string, $.Slice<number>> | null {
		return this._fields.byName.value
	}
	public set byName(value: globalThis.Map<string, $.Slice<number>> | null) {
		this._fields.byName.value = value
	}

	// lazyCerts contains funcs that return a certificate,
	// lazily parsing/decompressing it as needed.
	public get lazyCerts(): $.Slice<lazyCert> {
		return this._fields.lazyCerts.value
	}
	public set lazyCerts(value: $.Slice<lazyCert>) {
		this._fields.lazyCerts.value = value
	}

	// haveSum maps from sum224(cert.Raw) to true. It's used only
	// for AddCert duplicate detection, to avoid CertPool.contains
	// calls in the AddCert path (because the contains method can
	// call getCert and otherwise negate savings from lazy getCert
	// funcs).
	public get haveSum(): globalThis.Map<sum224, boolean> | null {
		return this._fields.haveSum.value
	}
	public set haveSum(value: globalThis.Map<sum224, boolean> | null) {
		this._fields.haveSum.value = value
	}

	// systemPool indicates whether this is a special pool derived from the
	// system roots. If it includes additional roots, it requires doing two
	// verifications, one using the roots provided by the caller, and one using
	// the system platform verifier.
	public get systemPool(): boolean {
		return this._fields.systemPool.value
	}
	public set systemPool(value: boolean) {
		this._fields.systemPool.value = value
	}

	public _fields: {
		byName: $.VarRef<globalThis.Map<string, $.Slice<number>> | null>
		lazyCerts: $.VarRef<$.Slice<lazyCert>>
		haveSum: $.VarRef<globalThis.Map<sum224, boolean> | null>
		systemPool: $.VarRef<boolean>
	}

	constructor(init?: Partial<{byName?: globalThis.Map<string, $.Slice<number>> | null, lazyCerts?: $.Slice<lazyCert>, haveSum?: globalThis.Map<sum224, boolean> | null, systemPool?: boolean}>) {
		this._fields = {
			byName: $.varRef(init?.byName ?? (null as globalThis.Map<string, $.Slice<number>> | null)),
			lazyCerts: $.varRef(init?.lazyCerts ?? (null as $.Slice<lazyCert>)),
			haveSum: $.varRef(init?.haveSum ?? (null as globalThis.Map<sum224, boolean> | null)),
			systemPool: $.varRef(init?.systemPool ?? (false as boolean))
		}
	}

	public clone(): CertPool {
		const cloned = new CertPool()
		cloned._fields = {
			byName: $.varRef(this._fields.byName.value),
			lazyCerts: $.varRef(this._fields.lazyCerts.value),
			haveSum: $.varRef(this._fields.haveSum.value),
			systemPool: $.varRef(this._fields.systemPool.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async AddCert(cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null): globalThis.Promise<void> {
		const s: CertPool | $.VarRef<CertPool> | null = this
		if (cert == null) {
			$.panic("adding nil Certificate to CertPool")
		}
		CertPool.prototype.addCertFunc.call(s, await sha256.Sum224($.pointerValue<__goscript_x509.Certificate>(cert).Raw), $.bytesToString($.pointerValue<__goscript_x509.Certificate>(cert).RawSubject), $.functionValue((): [__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError] => {
			return [cert, null]
		}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, "error"] } as $.FunctionTypeInfo)), (null as ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null))
	}

	public async AddCertWithConstraint(cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, constraint: ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<void> {
		const s: CertPool | $.VarRef<CertPool> | null = this
		if (cert == null) {
			$.panic("adding nil Certificate to CertPool")
		}
		CertPool.prototype.addCertFunc.call(s, await sha256.Sum224($.pointerValue<__goscript_x509.Certificate>(cert).Raw), $.bytesToString($.pointerValue<__goscript_x509.Certificate>(cert).RawSubject), $.functionValue((): [__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError] => {
			return [cert, null]
		}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, "error"] } as $.FunctionTypeInfo)), constraint)
	}

	public async AppendCertsFromPEM(pemCerts: $.Slice<number>): globalThis.Promise<boolean> {
		const s: CertPool | $.VarRef<CertPool> | null = this
		let ok: boolean = false
		while ($.len(pemCerts) > 0) {
			let block: pem.Block | $.VarRef<pem.Block> | null = null as pem.Block | $.VarRef<pem.Block> | null
			let __goscriptTuple0: any = pem.Decode(pemCerts)
			block = __goscriptTuple0[0]
			pemCerts = __goscriptTuple0[1]
			if (block == null) {
				break
			}
			if ((!$.stringEqual($.pointerValue<pem.Block>(block).Type, "CERTIFICATE")) || ($.len($.pointerValue<pem.Block>(block).Headers) != 0)) {
				continue
			}

			let certBytes: $.Slice<number> = $.pointerValue<pem.Block>(block).Bytes
			let __goscriptTuple1: any = await __goscript_parser.ParseCertificate(certBytes)
			let cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = __goscriptTuple1[0]
			let err = __goscriptTuple1[1]
			if (err != null) {
				continue
			}
			let __goscriptShadow0: $.VarRef<{"Once": sync.Once, "v": __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null}> = $.varRef({"Once": $.markAsStructValue(new sync.Once()), "v": null})
			CertPool.prototype.addCertFunc.call(s, await sha256.Sum224($.pointerValue<__goscript_x509.Certificate>(cert).Raw), $.bytesToString($.pointerValue<__goscript_x509.Certificate>(cert).RawSubject), $.functionValue(async (): globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]> => {
				await __goscriptShadow0.value.Once.Do($.functionValue(async (): globalThis.Promise<void> => {
					// This can't fail, as the same bytes already parsed above.
					let __goscriptTuple2: any = await __goscript_parser.ParseCertificate(certBytes)
					__goscriptShadow0.value.v = __goscriptTuple2[0]
					certBytes = null
				}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
				return [__goscriptShadow0.value.v, null]
			}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, "error"] } as $.FunctionTypeInfo)), (null as ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null))
			ok = true
		}

		return ok
	}

	public Clone(): CertPool | $.VarRef<CertPool> | null {
		const s: CertPool | $.VarRef<CertPool> | null = this
		let p: CertPool | $.VarRef<CertPool> | null = new CertPool({byName: $.makeMap<string, $.Slice<number>>(), lazyCerts: $.makeSlice<lazyCert>($.len($.pointerValue<CertPool>(s).lazyCerts), undefined, undefined, () => $.markAsStructValue(new lazyCert())), haveSum: $.makeMap<sum224, boolean>(), systemPool: $.pointerValue<CertPool>(s).systemPool})
		for (let [k, v] of $.pointerValue<CertPool>(s).byName?.entries() ?? []) {
			let indexes: $.Slice<number> = $.makeSlice<number>($.len(v), undefined, "number")
			$.copy(indexes, v)
			$.mapSet($.pointerValue<CertPool>(p).byName, k, indexes)
		}
		for (let [k, __rangeValue] of $.pointerValue<CertPool>(s).haveSum?.entries() ?? []) {
			$.mapSet($.pointerValue<CertPool>(p).haveSum, k, true)
		}
		$.copy($.pointerValue<CertPool>(p).lazyCerts, $.pointerValue<CertPool>(s).lazyCerts)
		return p
	}

	public Equal(other: CertPool | $.VarRef<CertPool> | null): boolean {
		const s: CertPool | $.VarRef<CertPool> | null = this
		if ((s == null) || (other == null)) {
			return $.pointerEqual(s, other)
		}
		if (($.pointerValue<CertPool>(s).systemPool != $.pointerValue<CertPool>(other).systemPool) || ($.len($.pointerValue<CertPool>(s).haveSum) != $.len($.pointerValue<CertPool>(other).haveSum))) {
			return false
		}
		for (const [h, __rangeValue] of $.pointerValue<CertPool>(s).haveSum?.entries() ?? []) {
			if (!$.mapGet<sum224, boolean, boolean>($.pointerValue<CertPool>(other).haveSum, h, false)[0]) {
				return false
			}
		}
		return true
	}

	public Subjects(): $.Slice<$.Slice<number>> {
		const s: CertPool | $.VarRef<CertPool> | null = this
		let res: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>(CertPool.prototype.len.call(s))
		for (let __goscriptRangeTarget0 = $.pointerValue<CertPool>(s).lazyCerts, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			let lc = __goscriptRangeTarget0![i]
			res![i] = lc.rawSubject
		}
		return res
	}

	public addCertFunc(rawSum224: sum224, rawSubject: string, getCert: (() => [__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError] | globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]>) | null, constraint: ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null): void {
		let s: CertPool | $.VarRef<CertPool> | null = this
		if (getCert == null) {
			$.panic("getCert can't be nil")
		}

		// Check that the certificate isn't being added twice.
		if ($.mapGet<sum224, boolean, boolean>($.pointerValue<CertPool>(s).haveSum, rawSum224, false)[0]) {
			return
		}

		$.mapSet($.pointerValue<CertPool>(s).haveSum, rawSum224, true)
		$.pointerValue<CertPool>(s).lazyCerts = $.append($.pointerValue<CertPool>(s).lazyCerts, $.markAsStructValue(new lazyCert({rawSubject: $.stringToBytes(rawSubject), getCert: getCert, constraint: constraint})))
		$.mapSet($.pointerValue<CertPool>(s).byName, rawSubject, $.append($.mapGet<string, $.Slice<number>, $.Slice<number>>($.pointerValue<CertPool>(s).byName, rawSubject, null)[0], $.len($.pointerValue<CertPool>(s).lazyCerts) - 1))
	}

	public async cert(n: number): globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null, $.GoError]> {
		const s: CertPool | $.VarRef<CertPool> | null = this
		let __goscriptTuple3: any = await $.arrayIndex($.pointerValue<CertPool>(s).lazyCerts!, n).getCert!()
		let cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = __goscriptTuple3[0]
		let err = __goscriptTuple3[1]
		return [cert, $.arrayIndex($.pointerValue<CertPool>(s).lazyCerts!, n).constraint, err]
	}

	public async contains(cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null): globalThis.Promise<boolean> {
		const s: CertPool | $.VarRef<CertPool> | null = this
		if (s == null) {
			return false
		}
		return $.mapGet<sum224, boolean, boolean>($.pointerValue<CertPool>(s).haveSum, await sha256.Sum224($.pointerValue<__goscript_x509.Certificate>(cert).Raw), false)[0]
	}

	public async findPotentialParents(cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null): globalThis.Promise<$.Slice<potentialParent>> {
		const s: CertPool | $.VarRef<CertPool> | null = this
		if (s == null) {
			return null
		}

		// consider all candidates where cert.Issuer matches cert.Subject.
		// when picking possible candidates the list is built in the order
		// of match plausibility as to save cycles in buildChains:
		//   AKID and SKID match
		//   AKID present, SKID missing / AKID missing, SKID present
		//   AKID and SKID don't match
		let matchingKeyID: $.Slice<potentialParent> = null as $.Slice<potentialParent>
		let oneKeyID: $.Slice<potentialParent> = null as $.Slice<potentialParent>
		let mismatchKeyID: $.Slice<potentialParent> = null as $.Slice<potentialParent>
		for (let __goscriptRangeTarget1 = $.mapGet<string, $.Slice<number>, $.Slice<number>>($.pointerValue<CertPool>(s).byName, $.bytesToString($.pointerValue<__goscript_x509.Certificate>(cert).RawIssuer), null)[0], __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let c = __goscriptRangeTarget1![__rangeIndex]
			let __goscriptTuple4: any = await CertPool.prototype.cert.call(s, c)
			let candidate: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = __goscriptTuple4[0]
			let constraint: ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null = __goscriptTuple4[1]
			let err = __goscriptTuple4[2]
			if (err != null) {
				continue
			}
			let kidMatch = bytes.Equal($.pointerValue<__goscript_x509.Certificate>(candidate).SubjectKeyId, $.pointerValue<__goscript_x509.Certificate>(cert).AuthorityKeyId)
			switch (true) {
				case kidMatch:
				{
					matchingKeyID = $.append(matchingKeyID, $.markAsStructValue(new potentialParent({cert: candidate, constraint: constraint})))
					break
				}
				case (($.len($.pointerValue<__goscript_x509.Certificate>(candidate).SubjectKeyId) == 0) && ($.len($.pointerValue<__goscript_x509.Certificate>(cert).AuthorityKeyId) > 0)) || (($.len($.pointerValue<__goscript_x509.Certificate>(candidate).SubjectKeyId) > 0) && ($.len($.pointerValue<__goscript_x509.Certificate>(cert).AuthorityKeyId) == 0)):
				{
					oneKeyID = $.append(oneKeyID, $.markAsStructValue(new potentialParent({cert: candidate, constraint: constraint})))
					break
				}
				default:
				{
					mismatchKeyID = $.append(mismatchKeyID, $.markAsStructValue(new potentialParent({cert: candidate, constraint: constraint})))
					break
				}
			}
		}

		let found = ($.len(matchingKeyID) + $.len(oneKeyID)) + $.len(mismatchKeyID)
		if (found == 0) {
			return null
		}
		let candidates: $.Slice<potentialParent> = $.makeSlice<potentialParent>(0, found, undefined, () => $.markAsStructValue(new potentialParent()))
		candidates = $.appendSlice(candidates, matchingKeyID)
		candidates = $.appendSlice(candidates, oneKeyID)
		candidates = $.appendSlice(candidates, mismatchKeyID)
		return candidates
	}

	public len(): number {
		const s: CertPool | $.VarRef<CertPool> | null = this
		if (s == null) {
			return 0
		}
		return $.len($.pointerValue<CertPool>(s).lazyCerts)
	}

	static __typeInfo = $.registerStructType(
		"x509.CertPool",
		() => new CertPool(),
		[{ name: "AddCert", args: [{ name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [] }, { name: "AddCertWithConstraint", args: [{ name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, { name: "constraint", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], results: ["error"] } as $.FunctionTypeInfo) }], returns: [] }, { name: "AppendCertsFromPEM", args: [{ name: "pemCerts", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "ok", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "x509.CertPool" } }] }, { name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Pointer, elemType: "x509.CertPool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Subjects", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }] }, { name: "addCertFunc", args: [{ name: "rawSum224", type: "x509.sum224" }, { name: "rawSubject", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "getCert", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, "error"] } as $.FunctionTypeInfo) }, { name: "constraint", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], results: ["error"] } as $.FunctionTypeInfo) }], returns: [] }, { name: "cert", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, { name: "_r1", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], results: ["error"] } as $.FunctionTypeInfo) }, { name: "_r2", type: "error" }] }, { name: "contains", args: [{ name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "findPotentialParents", args: [{ name: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "x509.potentialParent" } }] }, { name: "len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		CertPool,
		[{ name: "byName", key: "byName", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "lazyCerts", key: "lazyCerts", type: { kind: $.TypeKind.Slice, elemType: "x509.lazyCert" }, pkgPath: "crypto/x509", index: [1], offset: 8, exported: false }, { name: "haveSum", key: "haveSum", type: { kind: $.TypeKind.Map, keyType: "x509.sum224", elemType: { kind: $.TypeKind.Basic, name: "bool" } }, pkgPath: "crypto/x509", index: [2], offset: 32, exported: false }, { name: "systemPool", key: "systemPool", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/x509", index: [3], offset: 40, exported: false }]
	)
}

export class lazyCert {
	// rawSubject is the Certificate.RawSubject value.
	// It's the same as the CertPool.byName key, but in []byte
	// form to make CertPool.Subjects (as used by crypto/tls) do
	// fewer allocations.
	public get rawSubject(): $.Slice<number> {
		return this._fields.rawSubject.value
	}
	public set rawSubject(value: $.Slice<number>) {
		this._fields.rawSubject.value = value
	}

	// constraint is a function to run against a chain when it is a candidate to
	// be added to the chain. This allows adding arbitrary constraints that are
	// not specified in the certificate itself.
	public get constraint(): ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.constraint.value
	}
	public set constraint(value: ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.constraint.value = value
	}

	// getCert returns the certificate.
	//
	// It is not meant to do network operations or anything else
	// where a failure is likely; the func is meant to lazily
	// parse/decompress data that is already known to be good. The
	// error in the signature primarily is meant for use in the
	// case where a cert file existed on local disk when the program
	// started up is deleted later before it's read.
	public get getCert(): (() => [__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError] | globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]>) | null {
		return this._fields.getCert.value
	}
	public set getCert(value: (() => [__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError] | globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]>) | null) {
		this._fields.getCert.value = value
	}

	public _fields: {
		rawSubject: $.VarRef<$.Slice<number>>
		constraint: $.VarRef<((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null>
		getCert: $.VarRef<(() => [__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError] | globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]>) | null>
	}

	constructor(init?: Partial<{rawSubject?: $.Slice<number>, constraint?: ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null, getCert?: (() => [__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError] | globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]>) | null}>) {
		this._fields = {
			rawSubject: $.varRef(init?.rawSubject ?? (null as $.Slice<number>)),
			constraint: $.varRef(init?.constraint ?? (null as ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null)),
			getCert: $.varRef(init?.getCert ?? (null as (() => [__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError] | globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]>) | null))
		}
	}

	public clone(): lazyCert {
		const cloned = new lazyCert()
		cloned._fields = {
			rawSubject: $.varRef(this._fields.rawSubject.value),
			constraint: $.varRef(this._fields.constraint.value),
			getCert: $.varRef(this._fields.getCert.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.lazyCert",
		() => new lazyCert(),
		[],
		lazyCert,
		[{ name: "rawSubject", key: "rawSubject", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "constraint", key: "constraint", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], results: ["error"] } as $.FunctionTypeInfo), pkgPath: "crypto/x509", index: [1], offset: 24, exported: false }, { name: "getCert", key: "getCert", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/x509", index: [2], offset: 32, exported: false }]
	)
}

export class potentialParent {
	public get cert(): __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null {
		return this._fields.cert.value
	}
	public set cert(value: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null) {
		this._fields.cert.value = value
	}

	public get constraint(): ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null {
		return this._fields.constraint.value
	}
	public set constraint(value: ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null) {
		this._fields.constraint.value = value
	}

	public _fields: {
		cert: $.VarRef<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>
		constraint: $.VarRef<((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null>
	}

	constructor(init?: Partial<{cert?: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, constraint?: ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null}>) {
		this._fields = {
			cert: $.varRef(init?.cert ?? (null as __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null)),
			constraint: $.varRef(init?.constraint ?? (null as ((_p0: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>) => $.GoError | globalThis.Promise<$.GoError>) | null))
		}
	}

	public clone(): potentialParent {
		const cloned = new potentialParent()
		cloned._fields = {
			cert: $.varRef(this._fields.cert.value),
			constraint: $.varRef(this._fields.constraint.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.potentialParent",
		() => new potentialParent(),
		[],
		potentialParent,
		[{ name: "cert", key: "cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "constraint", key: "constraint", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], results: ["error"] } as $.FunctionTypeInfo), pkgPath: "crypto/x509", index: [1], offset: 8, exported: false }]
	)
}

export function NewCertPool(): CertPool | $.VarRef<CertPool> | null {
	return new CertPool({byName: $.makeMap<string, $.Slice<number>>(), haveSum: $.makeMap<sum224, boolean>()})
}

export async function SystemCertPool(): globalThis.Promise<[CertPool | $.VarRef<CertPool> | null, $.GoError]> {
	{
		let sysRoots: CertPool | $.VarRef<CertPool> | null = await __goscript_root.systemRootsPool()
		if (sysRoots != null) {
			return [CertPool.prototype.Clone.call(sysRoots), null]
		}
	}

	return __goscript_root_unix.loadSystemRoots()
}
