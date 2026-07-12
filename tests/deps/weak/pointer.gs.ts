// Generated file based on pointer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as abi from "@goscript/internal/abi/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/internal/abi/index.js"
import "@goscript/runtime/index.js"
import "@goscript/unsafe/index.js"

export class Pointer {
	// Mention T in the type definition to prevent conversions
	// between Pointer types, like we do for sync/atomic.Pointer.
	public get _blank0(): any[] {
		return this._fields._blank0.value
	}
	public set _blank0(value: any[]) {
		this._fields._blank0.value = value
	}

	public get u(): any {
		return this._fields.u.value
	}
	public set u(value: any) {
		this._fields.u.value = value
	}

	public _fields: {
		_blank0: $.VarRef<any[]>
		u: $.VarRef<any>
	}

	constructor(init?: Partial<{_blank0?: any[], u?: any}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 !== undefined ? $.cloneArrayValue(init._blank0) : Array.from({ length: 0 }, () => null)),
			u: $.varRef(init?.u ?? (null as any))
		}
	}

	public clone(): Pointer {
		const cloned = new Pointer()
		cloned._fields = {
			_blank0: $.varRef($.cloneArrayValue(this._fields._blank0.value)),
			u: $.varRef(this._fields.u.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Value(): any {
		const p = this
		if (p.u == null) {
			return null
		}
		return runtime_makeStrongFromWeak(p.u)
	}

	static __typeInfo = $.registerStructType(
		"weak.Pointer",
		() => new Pointer(),
		[{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } } }] }],
		Pointer,
		[{ name: "_", key: "_blank0", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } }, length: 0 }, pkgPath: "weak", index: [0], offset: 0, exported: false }, { name: "u", key: "u", type: { kind: $.TypeKind.Basic, name: "unknown" }, pkgPath: "weak", index: [1], offset: 0, exported: false }]
	)
}

export function Make(__typeArgs: $.GenericTypeArgs | undefined, ptr: any): Pointer {
	// Explicitly force ptr to escape to the heap.
	ptr = (abi.Escape(ptr) as any)

	let u: any = null as any
	if (ptr != null) {
		u = runtime_registerWeakPointer((ptr as any))
	}
	runtime.KeepAlive($.interfaceValue<any>(ptr, "*T", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } }))
	return $.markAsStructValue(new Pointer({u: u}))
}

export function runtime_registerWeakPointer(_p0: any): any {
	return null as any
}

export function runtime_makeStrongFromWeak(_p0: any): any {
	return null as any
}
