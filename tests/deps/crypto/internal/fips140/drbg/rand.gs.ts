// Generated file based on rand.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as sysrand from "@goscript/crypto/internal/sysrand/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as __goscript_ctrdrbg from "./ctrdrbg.gs.ts"

import * as __goscript_entropy_wasm from "./entropy_wasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/sysrand/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "./ctrdrbg.gs.ts"
import "./entropy_wasm.gs.ts"

export type DefaultReader = {
	defaultReader(): void
}

$.registerInterfaceType(
	"drbg.DefaultReader",
	null,
	[{ name: "defaultReader", args: [], returns: [] }]
);

export let drbgInstance: $.VarRef<atomic.Pointer<__goscript_ctrdrbg.Counter>> = $.varRef($.markAsStructValue(new atomic.Pointer<__goscript_ctrdrbg.Counter>()))

export function __goscript_set_drbgInstance(__goscriptValue: atomic.Pointer<__goscript_ctrdrbg.Counter>): void {
	drbgInstance.value = __goscriptValue
}

export var drbgPool: $.VarRef<sync.Pool>

export function __goscript_init_drbgPool(): void {
	if (((drbgPool) as any) === undefined) {
		drbgPool = $.varRef($.markAsStructValue(new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>(__goscript_ctrdrbg.NewCounter(__goscript_entropy_wasm.getEntropy()), "*drbg.Counter", { kind: $.TypeKind.Pointer, elemType: "drbg.Counter" })
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})))
	}
}

export function __goscript_get_drbgPool(): $.VarRef<sync.Pool> {
	if (((drbgPool) as any) === undefined) {
		__goscript_init_drbgPool()
	}
	return drbgPool
}

export function __goscript_set_drbgPool(__goscriptValue: sync.Pool): void {
	__goscript_get_drbgPool().value = __goscriptValue
}

export async function Read(b: $.Slice<number>): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	if (testingReader != null) {
		fips140.RecordNonApproved()
		// Avoid letting b escape in the non-testing case.
		let bb: $.Slice<number> = $.makeSlice<number>($.len(b), undefined, "byte")
		await $.pointerValue<Exclude<io.Reader, null>>(testingReader).Read(bb)
		$.copy(b, bb)
		return
	}

	if (!fips140.Enabled) {
		sysrand.Read(b)
		return
	}

	// At every read, 128 random bits from the operating system are mixed as
	// additional input, to make the output as strong as non-FIPS randomness.
	// This is not credited as entropy for FIPS purposes, as allowed by Section
	// 8.7.2: "Note that a DRBG does not rely on additional input to provide
	// entropy, even though entropy could be provided in the additional input".
	let additionalInput: $.VarRef<Uint8Array> | null = $.varRef<Uint8Array>(new Uint8Array(48))
	sysrand.Read($.goSlice($.pointerValue<Uint8Array>(additionalInput), undefined, 16))

	let drbg: __goscript_ctrdrbg.Counter | $.VarRef<__goscript_ctrdrbg.Counter> | null = (drbgInstance.value.Swap(null) as __goscript_ctrdrbg.Counter | $.VarRef<__goscript_ctrdrbg.Counter> | null)
	if (drbg == null) {
		drbg = $.mustTypeAssert<__goscript_ctrdrbg.Counter | $.VarRef<__goscript_ctrdrbg.Counter> | null>(await $.pointerValue<sync.Pool>(__goscript_get_drbgPool()).Get(), { kind: $.TypeKind.Pointer, elemType: "drbg.Counter" })
	}
	__defer.defer(() => { ((): void => {
		if (!drbgInstance.value.CompareAndSwap(null, drbg)) {
			$.pointerValue<sync.Pool>(__goscript_get_drbgPool()).Put($.interfaceValue<any>(drbg, "*drbg.Counter", { kind: $.TypeKind.Pointer, elemType: "drbg.Counter" }))
		}
	})() })

	while ($.len(b) > 0) {
		let size = $.min($.len(b), 65536)
		{
			let reseedRequired = __goscript_ctrdrbg.Counter.prototype.Generate.call(drbg, $.goSlice(b, undefined, size), additionalInput)
			if (reseedRequired) {
				// See SP 800-90A Rev. 1, Section 9.3.1, Steps 6-8, as explained in
				// Section 9.3.2: if Generate reports a reseed is required, the
				// additional input is passed to Reseed along with the entropy and
				// then nulled before the next Generate call.
				__goscript_ctrdrbg.Counter.prototype.Reseed.call(drbg, __goscript_entropy_wasm.getEntropy(), additionalInput)
				additionalInput = null
				continue
			}
		}
		b = $.goSlice(b, size, undefined)
	}
}

export let testingReader: io.Reader | null = null as io.Reader | null

export function __goscript_set_testingReader(__goscriptValue: io.Reader | null): void {
	testingReader = __goscriptValue
}

export function SetTestingReader(r: io.Reader | null): void {
	testingReader = r
}

export async function ReadWithReader(r: io.Reader | null, b: $.Slice<number>): globalThis.Promise<$.GoError> {
	{
		let [, ok] = $.typeAssertTuple<DefaultReader | null>(r, "drbg.DefaultReader")
		if (ok) {
			await Read(b)
			return null
		}
	}

	fips140.RecordNonApproved()
	let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, b)
	return err
}
