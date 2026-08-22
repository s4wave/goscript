// Generated file based on package_import_errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"
import "@goscript/errors/index.js"

export type scalarErr = number

export class customErr {
	public get msg(): string {
		return this._fields.msg.value
	}
	public set msg(value: string) {
		this._fields.msg.value = value
	}

	public _fields: {
		msg: $.VarRef<string>
	}

	constructor(init?: Partial<{msg?: string}>) {
		this._fields = {
			msg: $.varRef(init?.msg ?? ("" as string))
		}
	}

	public clone(): customErr {
		const cloned = new customErr()
		cloned._fields = {
			msg: $.varRef(this._fields.msg.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: customErr | $.VarRef<customErr> | null = this
		return $.pointerValue<customErr>(e).msg
	}

	static __typeInfo = $.registerStructType(
		"main.customErr",
		() => new customErr(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		customErr,
		[{ name: "msg", key: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export class wrappedErr {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{err?: $.GoError}>) {
		this._fields = {
			err: $.varRef(init?.err ?? (null! as $.GoError))
		}
	}

	public clone(): wrappedErr {
		const cloned = new wrappedErr()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const e = this
		return "wrapped: " + await $.pointerValue<Exclude<$.GoError, null>>(e.err).Error()
	}

	public Unwrap(): $.GoError {
		const e = this
		return e.err
	}

	static __typeInfo = $.registerStructType(
		"main.wrappedErr",
		() => new wrappedErr(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Unwrap", args: [], returns: [{ type: "error" }] }],
		wrappedErr,
		[{ name: "err", key: "err", type: "error" }]
	)
}

export function scalarErr_Error(recv: scalarErr): string {
	return "scalar error"
}

export async function main(): globalThis.Promise<void> {
	// Test basic error creation
	let err1 = errors.New("first error")
	let err2 = errors.New("second error")

	await $.println("err1:", await $.pointerValue<Exclude<$.GoError, null>>(err1).Error())
	await $.println("err2:", await $.pointerValue<Exclude<$.GoError, null>>(err2).Error())

	// Test error comparison
	await $.println("err1 == err2:", $.comparableEqual(err1, err2))
	await $.println("err1 == nil:", err1 == null)

	// Test nil error
	let nilErr: $.GoError = null! as $.GoError
	await $.println("nilErr == nil:", nilErr == null)

	let typedErr: customErr | $.VarRef<customErr> | null = new customErr({msg: "typed error"})
	let __goscriptTuple0: any = errors.AsType({[$.genericTypeArgsMarker]: true, E: { type: { kind: $.TypeKind.Pointer, elemType: "main.customErr" }, zero: () => null, methods: {Error: (receiver: any, ...args: any[]) => receiver.Error(...$.stripGenericTypeArgs(args))} }}, $.interfaceValue<$.GoError>($.markAsStructValue(new wrappedErr({err: $.interfaceValue<$.GoError>(typedErr, "*main.customErr", { kind: $.TypeKind.Pointer, elemType: "main.customErr" })})), "main.wrappedErr", "main.wrappedErr"))
	let matched: customErr | $.VarRef<customErr> | null = (__goscriptTuple0[0] as customErr | $.VarRef<customErr> | null)
	let ok = __goscriptTuple0[1]
	await $.println("AsType matched:", ok)
	if (ok) {
		await $.println("AsType message:", $.pointerValue<customErr>(matched).msg)
	}
	let __goscriptTuple1: any = errors.AsType({[$.genericTypeArgsMarker]: true, E: { type: { kind: $.TypeKind.Pointer, elemType: "main.customErr" }, zero: () => null, methods: {Error: (receiver: any, ...args: any[]) => receiver.Error(...$.stripGenericTypeArgs(args))} }}, $.pointerValueOrNil(err1)!)
	ok = __goscriptTuple1[1]
	await $.println("AsType missing:", ok)

	let scalarTarget: $.VarRef<scalarErr> = $.varRef(0)
	await $.println("As scalar missing:", errors.As($.pointerValueOrNil(err1)!, $.namedValueInterfaceValue<any>(scalarTarget, "*main.scalarErr", {Error: (receiver: any, ...args: any[]) => (scalarErr_Error as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8", typeName: "main.scalarErr" } }, [{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])), $.uint(scalarTarget.value, 8))
	await $.println("As scalar matched:", errors.As($.namedValueInterfaceValue<$.GoError>(42, "main.scalarErr", {"Error": scalarErr_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "main.scalarErr" }), $.namedValueInterfaceValue<any>(scalarTarget, "*main.scalarErr", {Error: (receiver: any, ...args: any[]) => (scalarErr_Error as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint8", typeName: "main.scalarErr" } }, [{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])), $.uint(scalarTarget.value, 8))

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
