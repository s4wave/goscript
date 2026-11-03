// Generated file based on package_import_errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as errors from "@goscript/errors/index.js"
import * as os from "@goscript/os/index.js"

export type scalarErr = number

$.registerNamedValueType(
	"main.scalarErr",
	{Error: (receiver: any) => (scalarErr_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.scalarErr",
	{Error: (receiver: any) => (scalarErr_Error as any)($.pointerValue(receiver))},
	[$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")])]
);

export class customErr {
	// msg is the error's stable text.
	public declare msg: string

	constructor(__goscriptValue?: boolean, msg$?: string) {
		this.msg = msg$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): customErr {
		return new customErr(true, this.msg)
	}

	public __goscriptAssign(source: customErr): this {
		this.msg = source.msg
		return this
	}

	public Error(): string {
		const e: customErr | $.VarRef<customErr> | null = this;
		return $.pointerValue<customErr>(e).msg
	}

	public Timeout(): boolean {
		return true
	}

	static __typeInfo = $.registerStructType(
		"main.customErr",
		() => new customErr(),
		() => [{ name: "Error", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "Timeout", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
		customErr,
		() => [{ name: "msg", key: "msg", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class wrappedErr {
	// err is the wrapped error.
	public declare err: $.GoError

	constructor(__goscriptValue?: boolean, err$?: $.GoError) {
		this.err = err$ ?? (null! as $.GoError)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): wrappedErr {
		return new wrappedErr(true, this.err)
	}

	public __goscriptAssign(source: wrappedErr): this {
		this.err = $.assignFieldValue(this.err, source.err)
		return this
	}

	public Error(): string {
		const e = this;
		return "wrapped: " + ($.pointerValue<Exclude<$.GoError, null>>(e.err).Error() as string)
	}

	public Unwrap(): $.GoError {
		const e = this;
		return e.err
	}

	static __typeInfo = $.registerStructType(
		"main.wrappedErr",
		() => new wrappedErr(),
		() => [{ name: "Error", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Unwrap", args: [], returns: [{ type: "error" }] }],
		wrappedErr,
		() => [{ name: "err", key: "err", type: "error" }]
	)
}

export function scalarErr_Error(recv: scalarErr): string {
	return "scalar error"
}

export async function main(): globalThis.Promise<void> {
	// Construct two independent errors.
	let err1 = errors.New("first error")
	let err2 = errors.New("second error")

	// Format each message without merging the errors' identity.
	await $.println("err1:", (__goscriptAwait = (err1 !== null && (err1 as any).__isVarRef !== true && ((err1 as any).__goValue === undefined || (err1 as any).__goType?.charCodeAt(0) !== 42) ? (err1 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err1)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("err2:", (__goscriptAwait = (err2 !== null && (err2 as any).__isVarRef !== true && ((err2 as any).__goValue === undefined || (err2 as any).__goType?.charCodeAt(0) !== 42) ? (err2 as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err2)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	// Compare independent error values and nil.
	await $.println("err1 == err2:", $.comparableEqual(err1, err2))
	await $.println("err1 == nil:", err1 == null)

	// An uninitialized error interface is nil.
	let nilErr: $.GoError = null! as $.GoError
	await $.println("nilErr == nil:", nilErr == null)

	// Extract the concrete pointer through a wrapper's Unwrap method.
	let typedErr = new customErr(false, "typed error")
	let __goscriptTuple0: any = errors.AsType(__goscriptStatic0(), $.structInterfaceValue<$.GoError>(new wrappedErr(true, $.interfaceValue<$.GoError>(typedErr, "*main.customErr", /* @__PURE__ */ $.pointerType("main.customErr"))), "main.wrappedErr", "main.wrappedErr")!)
	let matched: customErr | $.VarRef<customErr> | null = (__goscriptTuple0[0] as customErr | $.VarRef<customErr> | null)
	let ok: boolean = __goscriptTuple0[1]
	await $.println("AsType matched:", ok)
	if (ok) {
		await $.println("AsType message:", $.pointerValue<customErr>(matched).msg)
	}
	let __goscriptTuple1: any = errors.AsType(__goscriptStatic0(), $.pointerValueOrNil(err1)!)
	ok = __goscriptTuple1[1]
	await $.println("AsType missing:", ok)

	// Type extraction also preserves a named scalar error's value.
	let scalarTarget: $.VarRef<scalarErr> = $.varRef(0)
	await $.println("As scalar missing:", errors.As($.pointerValueOrNil(err1)!, $.namedValueInterfaceValue<any>(scalarTarget, "*main.scalarErr", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3())), scalarTarget.value)
	await $.println("As scalar matched:", errors.As($.namedValueInterfaceValue<$.GoError>(42, "main.scalarErr", {"Error": scalarErr_Error}, /* @__PURE__ */ $.basicType("uint8", "main.scalarErr"))!, $.namedValueInterfaceValue<any>(scalarTarget, "*main.scalarErr", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3())), scalarTarget.value)

	// A syscall wrapper preserves the operation and its underlying error.
	let sysErr = os.NewSyscallError("connect", $.pointerValueOrNil($.interfaceValue<$.GoError>(typedErr, "*main.customErr", /* @__PURE__ */ $.pointerType("main.customErr")))!)
	await $.println("syscall:", (__goscriptAwait = (sysErr !== null && (sysErr as any).__isVarRef !== true && ((sysErr as any).__goValue === undefined || (sysErr as any).__goType?.charCodeAt(0) !== 42) ? (sysErr as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(sysErr)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), errors.Is($.pointerValueOrNil(sysErr)!, $.pointerValueOrNil($.interfaceValue<$.GoError>(typedErr, "*main.customErr", /* @__PURE__ */ $.pointerType("main.customErr")))!), os.IsTimeout($.pointerValueOrNil(sysErr)!))
	let __goscriptTuple2: any = $.typeAssertTuple<os.SyscallError | $.VarRef<os.SyscallError> | null>(sysErr, /* @__PURE__ */ $.pointerType("os.SyscallError"))
	let details: os.SyscallError | $.VarRef<os.SyscallError> | null = __goscriptTuple2[0]
	ok = __goscriptTuple2[1]
	let details$: os.SyscallError = details == null ? $.pointerTarget<os.SyscallError>(details) : (details as any).__isVarRef === true ? (details as any).value : (details as any).__goValue === undefined ? (details as any) : $.pointerTarget<os.SyscallError>(details)
	await $.println("syscall details:", ok, (details$ as os.SyscallError).Syscall, $.comparableEqual((details$ as os.SyscallError).Err, $.interfaceValue<$.GoError>(typedErr, "*main.customErr", /* @__PURE__ */ $.pointerType("main.customErr"))))
	await $.println("syscall nil:", os.NewSyscallError("connect", null!) == null)
	await $.println("test finished")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, E: { type: /* @__PURE__ */ $.pointerType("main.customErr"), zero: () => null, methods: {Error: (receiver: any) => $.pointerValue(receiver).Error(), Timeout: (receiver: any) => $.pointerValue(receiver).Timeout()} }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({Error: (receiver: any) => (scalarErr_Error as any)($.pointerValue(receiver))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint8", "main.scalarErr")))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
