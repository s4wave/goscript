// Generated file based on pointer_method_direct_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type adder = {
	add(i: number): number
}

$.registerInterfaceType(
	"main.adder",
	null,
	[{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class counter {
	public declare n: number

	constructor(__goscriptValue?: boolean, n$?: number) {
		this.n = n$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): counter {
		return new counter(true, this.n)
	}

	public __goscriptAssign(source: counter): this {
		this.n = source.n
		return this
	}

	public add(i: number): number {
		const c: counter | $.VarRef<counter> | null = this;
		const c$: counter = c == null ? $.pointerTarget<counter>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<counter>(c)
		if (c == null) {
			return -1
		}
		;(c$ as counter).n += i
		return (c$ as counter).n
	}

	public ["get"](): number {
		const c: counter | $.VarRef<counter> | null = this;
		return $.pointerValue<counter>(c).n
	}

	public value(): number {
		const c = this;
		return c.n
	}

	static __typeInfo = $.registerStructType(
		"main.counter",
		() => new counter(),
		() => [{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		counter,
		() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class holder {
	public declare counter: counter | $.VarRef<counter> | null

	constructor(__goscriptValue?: boolean, counter$?: counter | $.VarRef<counter> | null) {
		this.counter = counter$ ?? (null! as counter | $.VarRef<counter> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): holder {
		return new holder(true, this.counter)
	}

	public __goscriptAssign(source: holder): this {
		this.counter = source.counter
		return this
	}

	public add(i: any): any {
		return $.pointerValue<counter>(this.counter).add(i)
	}

	public ["get"](): any {
		return $.pointerValue<counter>(this.counter).get()
	}

	public value(): any {
		return $.pointerValue<counter>(this.counter).value()
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		holder,
		() => [{ name: "counter", key: "counter", type: /* @__PURE__ */ $.pointerType("main.counter"), anonymous: true }]
	)
}

export function next(c: counter | $.VarRef<counter> | null): counter | $.VarRef<counter> | null {
	if ($.pointerValue<counter>(c).n > 2) {
		return null
	}
	return c
}

export async function captureNilValue(): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		// Observe whether receiver evaluation completed before the panic.
		let captured = false
		__defer.defer(async () => { await (async () => {
			await $.println("nil value capture:", captured, $.recover() != null)
		})() })
		let c: counter | $.VarRef<counter> | null = null! as counter | $.VarRef<counter> | null
		let fn: (() => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => () => __receiver.value())($.markAsStructValue($.cloneStructValue($.pointerValue<counter>(c)))), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.counter.value-fm")
		captured = true;
		;(fn!() as number)
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function captureNilOuter(): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		// A nil outer pointer cannot supply its embedded receiver.
		let captured = false
		__defer.defer(async () => { await (async () => {
			await $.println("nil outer capture:", captured, $.recover() != null)
		})() })
		let outer: holder | $.VarRef<holder> | null = null! as holder | $.VarRef<holder> | null
		let fn: ((i: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (i: number) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as counter).add(i) : counter.prototype.add.call(__receiver, i)))($.pointerValue<holder>(outer).counter), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*counter).add-fm")
		captured = true;
		;(fn!(1) as number)
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function main(): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		// A pointer method is called directly on a plain struct pointer.
		let c = new counter()
		for (let i = 0; i < 4; i++) {
			void (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as counter).add(i) : counter.prototype.add.call(c, i))
		}
		await $.println((c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as counter)["get"]() : counter.prototype.get.call(c)))

		// A nil receiver still reaches the method.
		let nilc: counter | $.VarRef<counter> | null = null! as counter | $.VarRef<counter> | null
		await $.println((nilc !== null && (nilc as any).__isVarRef !== true && (nilc as any).__goValue === undefined ? ((nilc as any) as counter).add(5) : counter.prototype.add.call(nilc, 5)))

		// The arguments are evaluated once, whichever way the method is called.
		let calls = 0
		let arg = $.functionValue((): number => {
			calls++
			return 2
		}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
		await $.println((c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as counter).add(arg()) : counter.prototype.add.call(c, arg())), (nilc !== null && (nilc as any).__isVarRef !== true && (nilc as any).__goValue === undefined ? ((nilc as any) as counter).add(arg()) : counter.prototype.add.call(nilc, arg())), calls)

		// A bound pointer method retains nil without dereferencing or re-evaluation.
		let nilCalls = 0
		let makeNil = $.functionValue((): counter | $.VarRef<counter> | null => {
			nilCalls++
			return null
		}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.pointerType("main.counter")] } as $.FunctionTypeInfo))
		let nilFn: ((i: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (i: number) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as counter).add(i) : counter.prototype.add.call(__receiver, i)))(makeNil()), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*counter).add-fm")
		await $.println("nil pointer capture:", nilCalls, (nilFn!(4) as number))

		// Reassigning the source pointer does not change the captured receiver.
		let bound: counter | $.VarRef<counter> | null = new counter(false, 10)
		let fn: ((i: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (i: number) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as counter).add(i) : counter.prototype.add.call(__receiver, i)))(bound), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*counter).add-fm")
		bound = new counter(false, 30)
		await $.println("bound pointer:", (fn!(2) as number), $.pointerValue<counter>(bound).n)

		// Method expressions use the same nil-capable pointer dispatch.
		await $.println("nil pointer expression:", $.functionValue((c: counter | $.VarRef<counter> | null, i: number): number => (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as counter).add(i) : counter.prototype.add.call(c, i)), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.counter"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))(null, 4))
		await captureNilValue()

		// The final embedded pointer may be nil, while its outer value is valid.
		let outer = $.varRef(new holder(true))
		let promoted: ((i: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (i: number) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as counter).add(i) : counter.prototype.add.call(__receiver, i)))(outer.value.counter), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*counter).add-fm")
		await $.println("nil inner capture:", (promoted!(3) as number))
		await $.println("nil inner expression:", $.functionValue((c: holder, i: number): number => counter.prototype.add.call(c.counter, i), ({ kind: $.TypeKind.Function, params: ["main.holder", /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))((outer.value).clone(), 3))
		await captureNilOuter()

		// A value method captures a copy rather than the subsequently changed value.
		let valueSource = new counter(true, 5)
		let copyFn: (() => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => () => __receiver.value())($.markAsStructValue($.cloneStructValue(valueSource))), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.counter.value-fm")
		valueSource.n = 9
		await $.println("value copy:", (copyFn!() as number), valueSource.n)

		// A pointer to a struct variable that a closure reassigns.
		let v: $.VarRef<counter> = $.varRef(new counter(true))
		let pv = v
		let reset = $.functionValue(() => {
			v.value = v.value.__goscriptAssign(new counter(true, 100))
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
		void (pv !== null && (pv as any).__isVarRef !== true && (pv as any).__goValue === undefined ? ((pv as any) as counter).add(1) : counter.prototype.add.call(pv, 1))
		reset()
		await $.println((pv !== null && (pv as any).__isVarRef !== true && (pv as any).__goValue === undefined ? ((pv as any) as counter).add(1) : counter.prototype.add.call(pv, 1)), v.value.n)

		// Interface calls on a struct pointer, and on a nil interface, which panics.
		let a: adder | null = $.interfaceValue<adder | null>(c, "*main.counter", /* @__PURE__ */ $.pointerType("main.counter"))
		await $.println((__goscriptAwait = (a !== null && (a as any).__isVarRef !== true && ((a as any).__goValue === undefined || (a as any).__goType?.charCodeAt(0) !== 42) ? (a as Exclude<adder, null>) : $.pointerValue<Exclude<adder, null>>(a)).add(10), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		a = $.interfaceValue<adder | null>(next(c), "*main.counter", /* @__PURE__ */ $.pointerType("main.counter"))
		__defer.defer(async () => { await (async () => {
			await $.println("recovered:", $.recover() != null)
		})() })
		let none: adder | null = null! as adder | null
		await $.println((__goscriptAwait = (none !== null && (none as any).__isVarRef !== true && ((none as any).__goValue === undefined || (none as any).__goType?.charCodeAt(0) !== 42) ? (none as Exclude<adder, null>) : $.pointerValue<Exclude<adder, null>>(none)).add(1), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
