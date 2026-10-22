// Generated file based on the_works.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Op = number

$.registerNamedValueType(
	"main.Op",
	{String: (receiver: any) => (Op_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.Op",
	{String: (receiver: any) => (Op_String as any)($.pointerValue(receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type Report = {
	Program(): string
}

$.registerInterfaceType(
	"main.Report",
	null,
	[{ name: "Program", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class Instr {
	public declare Op: Op

	public declare Arg: bigint

	constructor(__goscriptValue?: boolean, Op$?: Op, Arg$?: bigint) {
		this.Op = Op$ ?? 0
		this.Arg = Arg$ ?? 0n
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Instr {
		return new Instr(true, this.Op, this.Arg)
	}

	public __goscriptAssign(source: Instr): this {
		this.Op = source.Op
		this.Arg = source.Arg
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Instr",
		() => new Instr(),
		() => [],
		Instr,
		() => [{ name: "Op", key: "Op", type: /* @__PURE__ */ $.basicType("int", "main.Op") }, { name: "Arg", key: "Arg", type: /* @__PURE__ */ $.basicType("int64") }]
	)
}

export class Program {
	public declare Name: string

	public declare Code: $.Slice<Instr>

	constructor(__goscriptValue?: boolean, Name$?: string, Code$?: $.Slice<Instr>) {
		this.Name = Name$ ?? ""
		this.Code = Code$ ?? (null! as $.Slice<Instr>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Program {
		return new Program(true, this.Name, this.Code)
	}

	public __goscriptAssign(source: Program): this {
		this.Name = source.Name
		this.Code = source.Code
		return this
	}

	public Listing(): ((_yield: ((_p0: number, _p1: Instr) => boolean | globalThis.Promise<boolean>) | null) => void) | null {
		const p = this;
		return $.functionValue(async (_yield: ((_p0: number, _p1: Instr) => boolean | globalThis.Promise<boolean>) | null) => {
			for (let __goscriptRangeTarget0 = p.Code, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), pc = 0; pc < __goscriptRangeWindow0.length; pc++) {
				let _in = ((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + pc] as Instr)).clone()
				if (!(__goscriptAwait = _yield!(pc, (_in).clone()), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
					return
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), "main.Instr"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
	}

	static __typeInfo = $.registerStructType(
		"main.Program",
		() => new Program(),
		() => [{ name: "Listing", args: [], returns: [{ type: ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), "main.Instr"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo) }] }],
		Program,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "Code", key: "Code", type: /* @__PURE__ */ $.sliceType("main.Instr") }]
	)
}

export class Stack {
	public declare items: $.Slice<any>

	constructor(__goscriptValue?: boolean, items$?: $.Slice<any>) {
		this.items = items$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Stack {
		return $.copyGenericInstance(this, new Stack(true, this.items))
	}

	public __goscriptAssign(source: Stack): this {
		this.items = source.items
		return this
	}

	public Pop(__typeArgs: $.GenericTypeArgs | undefined): any {
		const s: Stack | $.VarRef<Stack> | null = this;
		const s$: Stack = s == null ? $.pointerTarget<Stack>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<Stack>(s)
		if ($.sliceLen((s$ as Stack).items) == 0) {
			$.panic("stack underflow")
		}
		let v = $.copyElement($.arrayIndex((s$ as Stack).items!, $.sliceLen((s$ as Stack).items) - 1));
		;(s$ as Stack).items = $.goSlice((s$ as Stack).items, undefined, $.sliceLen((s$ as Stack).items) - 1)
		return $.copyElement(v)
	}

	public Push(__typeArgs: $.GenericTypeArgs | undefined, v: any): void {
		const s: Stack | $.VarRef<Stack> | null = this;
		const s$: Stack = s == null ? $.pointerTarget<Stack>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<Stack>(s);
		;(s$ as Stack).items = $.append((s$ as Stack).items, v, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as any)))
	}

	static __typeInfo = $.registerStructType(
		"main.Stack",
		() => new Stack(),
		() => [{ name: "Pop", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }, { name: "Push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Stack,
		() => [{ name: "items", key: "items", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export class VM {
	public declare pc: number

	public declare steps: number

	public declare stack: Stack

	constructor(__goscriptValue?: boolean, pc$?: number, steps$?: number, stack$?: Stack) {
		this.pc = pc$ ?? 0
		this.steps = steps$ ?? 0
		this.stack = stack$ ?? $.genericInstance(new Stack(true), __goscriptStatic1)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): VM {
		return new VM(true, this.pc, this.steps, this.stack.clone())
	}

	public __goscriptAssign(source: VM): this {
		this.pc = source.pc
		this.steps = source.steps
		this.stack.__goscriptAssign(source.stack)
		return this
	}

	public Step(code: $.Slice<Instr>): boolean {
		const vm: VM | $.VarRef<VM> | null = this;
		const vm$: VM = vm == null ? $.pointerTarget<VM>(vm) : (vm as any).__isVarRef === true ? (vm as any).value : (vm as any).__goValue === undefined ? (vm as any) : $.pointerTarget<VM>(vm)
		let _in = ($.arrayIndex(code!, (vm$ as VM).pc)).clone();
		;(vm$ as VM).pc++;
		;(vm$ as VM).steps++
		let s = $.fieldRef((vm$ as VM), "stack")
		switch (_in.Op) {
			case 0:
			{
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Push(__goscriptStatic0(), _in.Arg) : Stack.prototype.Push.call(s, __goscriptStatic0(), _in.Arg))
				break
			}
			case 1:
			{
				let v = ((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())) as bigint)
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Push(__goscriptStatic0(), v) : Stack.prototype.Push.call(s, __goscriptStatic0(), v))
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Push(__goscriptStatic0(), v) : Stack.prototype.Push.call(s, __goscriptStatic0(), v))
				break
			}
			case 2:
			{
				let b = ((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())) as bigint)
				let a = ((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())) as bigint)
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Push(__goscriptStatic0(), a) : Stack.prototype.Push.call(s, __goscriptStatic0(), a))
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Push(__goscriptStatic0(), b) : Stack.prototype.Push.call(s, __goscriptStatic0(), b))
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Push(__goscriptStatic0(), a) : Stack.prototype.Push.call(s, __goscriptStatic0(), a))
				break
			}
			case 3:
			{
				let b = ((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())) as bigint)
				let a = ((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())) as bigint)
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Push(__goscriptStatic0(), b) : Stack.prototype.Push.call(s, __goscriptStatic0(), b))
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Push(__goscriptStatic0(), a) : Stack.prototype.Push.call(s, __goscriptStatic0(), a))
				break
			}
			case 4:
			{
				void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0()))
				break
			}
			case 5:
			{
				Stack.prototype.Push.call(s, __goscriptStatic0(), $.int64Sub((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())), 1n))
				break
			}
			case 6:
			{
				Stack.prototype.Push.call(s, __goscriptStatic0(), $.int64Add((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())), (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0()))))
				break
			}
			case 7:
			{
				Stack.prototype.Push.call(s, __goscriptStatic0(), $.int64Mul((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())), (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0()))))
				break
			}
			case 8:
			{
				if ((s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as Stack).Pop(__goscriptStatic0()) : Stack.prototype.Pop.call(s, __goscriptStatic0())) != 0n) {
					;(vm$ as VM).pc = $.int64ToNumber(_in.Arg)
				}
				break
			}
			case 9:
			{
				return true
				break
			}
		}
		return false
	}

	static __typeInfo = $.registerStructType(
		"main.VM",
		() => new VM(),
		() => [{ name: "Step", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
		VM,
		() => [{ name: "pc", key: "pc", type: /* @__PURE__ */ $.basicType("int") }, { name: "steps", key: "steps", type: /* @__PURE__ */ $.basicType("int") }, { name: "stack", key: "stack", type: /* @__PURE__ */ $.genericStructType("main.Stack", "main.Stack[int64]", () => [/* @__PURE__ */ $.structField("items", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int64")), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/the_works" })]) }]
	)
}

export class Answer {
	public declare Name: string

	public declare Value: bigint

	public declare Steps: number

	constructor(__goscriptValue?: boolean, Name$?: string, Value$?: bigint, Steps$?: number) {
		this.Name = Name$ ?? ""
		this.Value = Value$ ?? 0n
		this.Steps = Steps$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Answer {
		return new Answer(true, this.Name, this.Value, this.Steps)
	}

	public __goscriptAssign(source: Answer): this {
		this.Name = source.Name
		this.Value = source.Value
		this.Steps = source.Steps
		return this
	}

	public Program(): string {
		const a = this;
		return a.Name
	}

	static __typeInfo = $.registerStructType(
		"main.Answer",
		() => new Answer(),
		() => [{ name: "Program", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		Answer,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int64") }, { name: "Steps", key: "Steps", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Fault {
	public declare Name: string

	public declare Reason: string

	constructor(__goscriptValue?: boolean, Name$?: string, Reason$?: string) {
		this.Name = Name$ ?? ""
		this.Reason = Reason$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Fault {
		return new Fault(true, this.Name, this.Reason)
	}

	public __goscriptAssign(source: Fault): this {
		this.Name = source.Name
		this.Reason = source.Reason
		return this
	}

	public Program(): string {
		const f: Fault | $.VarRef<Fault> | null = this;
		return $.pointerValue<Fault>(f).Name
	}

	static __typeInfo = $.registerStructType(
		"main.Fault",
		() => new Fault(),
		() => [{ name: "Program", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		Fault,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "Reason", key: "Reason", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export const Push: Op = 0

export const Dup: Op = 1

export const Over: Op = 2

export const Swap: Op = 3

export const Drop: Op = 4

export const Dec: Op = 5

export const Add: Op = 6

export const Mul: Op = 7

export const Jnz: Op = 8

export const Halt: Op = 9

export let opNames: globalThis.Map<Op, string> | null = $.makeMap<Op, string>([[0, "push"], [1, "dup"], [2, "over"], [3, "swap"], [4, "drop"], [5, "dec"], [6, "add"], [7, "mul"], [8, "jnz"], [9, "halt"]])

export function __goscript_set_opNames(__goscriptValue: globalThis.Map<Op, string> | null): void {
	opNames = __goscriptValue
}

export function Op_String(o: Op): string {
	return $.mapGet<Op, string, string>(opNames, o, "")[0]
}

export async function run(p: Program, answers: $.Channel<Answer> | null, faults: $.Channel<Fault | $.VarRef<Fault> | null> | null): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async () => {
			{
				let r = $.recover()
				if (r != null) {
					await $.chanSend(faults, new Fault(false, p.Name, $.mustTypeAssert<string>(r, /* @__PURE__ */ $.basicType("string"))))
				}
			}
		})() })
		let vm = new VM()
		let vm$: VM = vm == null ? $.pointerTarget<VM>(vm) : (vm as any).__isVarRef === true ? (vm as any).value : (vm as any).__goValue === undefined ? (vm as any) : $.pointerTarget<VM>(vm)
		while (!(vm !== null && (vm as any).__isVarRef !== true && (vm as any).__goValue === undefined ? ((vm as any) as VM).Step(p.Code) : VM.prototype.Step.call(vm, p.Code))) {
		}
		await $.chanSend(answers, (() => { const __goscriptLiteralField0 = (vm$ as VM).stack.Pop(__goscriptStatic0()); return new Answer(true, p.Name, __goscriptLiteralField0, (vm$ as VM).steps) })())
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export function factorial(name: string, n: bigint): Program {
	return new Program(true, name, $.arrayToSlice<Instr>([new Instr(true, 0, 1n), new Instr(true, 0, n), new Instr(true, 3, 0n), new Instr(true, 2, 0n), new Instr(true, 7, 0n), new Instr(true, 3, 0n), new Instr(true, 5, 0n), new Instr(true, 1, 0n), new Instr(true, 8, 2n), new Instr(true, 4, 0n), new Instr(true, 9, 0n)]))
}

export async function main(): globalThis.Promise<void> {
	let programs = $.arrayToSlice<Program>([factorial("20!", 20n), factorial("21!", 21n), new Program(true, "broken", $.arrayToSlice<Instr>([new Instr(true, 0, 1n), new Instr(true, 6, 0n), new Instr(true, 9, 0n)]))])

	await $.println("listing of", $.arrayIndex(programs!, 0).Name)
	let __goscriptRangeReturn0 = false
	;await (async () => {
		await $.markAsStructValue($.cloneStructValue($.arrayIndex(programs!, 0))).Listing()!(async (pc, _in) => {
			if ((_in.Op == 0) || (_in.Op == 8)) {
				await $.println(" ", pc, Op_String(_in.Op), _in.Arg)
				return true
			}
			await $.println(" ", pc, Op_String(_in.Op))
			return true
		})
	})()
	if (__goscriptRangeReturn0) {
		return
	}

	let answers = $.makeChannel<Answer>(0, new Answer(true), "both")
	let faults = $.makeChannel<Fault | $.VarRef<Fault> | null>(0, null! as Fault | $.VarRef<Fault> | null, "both")
	for (let __goscriptRangeTarget1 = programs, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let p = ((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as Program)).clone()
		const __goscriptDeferArg0 = (p).clone()
		const __goscriptDeferArg1 = answers
		const __goscriptDeferArg2 = faults
		queueMicrotask(async () => { await run(__goscriptDeferArg0, __goscriptDeferArg1, __goscriptDeferArg2) })
	}

	let reports = $.makeMap<string, Report | null>()
	while ($.len(reports) < $.sliceLen(programs)) {
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: answers,
				onSelected: async (__goscriptSelect0Result) => {
					let a = __goscriptSelect0Result.value
					$.mapSet(reports, a.Name, $.structInterfaceValue<Report | null>((a).clone(), "main.Answer", "main.Answer"))
				}
			},
			{
				id: 1,
				isSend: false,
				channel: faults,
				onSelected: async (__goscriptSelect0Result) => {
					let f = __goscriptSelect0Result.value
					$.mapSet(reports, $.pointerValue<Fault>(f).Name, $.interfaceValue<Report | null>(f, "*main.Fault", /* @__PURE__ */ $.pointerType("main.Fault")))
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
	}

	let totalSteps = 0
	for (let __goscriptRangeTarget2 = programs, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
		let p = ((__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as Program)).clone()
		{
			const __goscriptTypeSwitchValue = $.mapGet<string, Report | null, Report | null>(reports, p.Name, null)[0]
			switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic2())) {
				case 0:
					{
						let r: Answer = $.markAsStructValue($.cloneStructValue($.typeAssert<Answer>(__goscriptTypeSwitchValue, "main.Answer").value))
						totalSteps += r.Steps
						await $.println(r.Program(), "=", r.Value, "in", r.Steps, "steps")
					}
					break
				case 1:
					{
						let r: Fault | $.VarRef<Fault> | null = $.typeAssert<Fault | $.VarRef<Fault> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType("main.Fault")).value
						await $.println((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as Fault).Program() : Fault.prototype.Program.call(r)), "crashed:", $.pointerValue<Fault>(r).Reason)
					}
					break
			}
		}
	}
	await $.println("total steps:", totalSteps)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Pop: (receiver: any) => $.pointerValue(receiver).Pop(__goscriptStatic0()), Push: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Push(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Pop", [], [/* @__PURE__ */ $.basicType("int64")], true, false), $.methodSignature("Push", [/* @__PURE__ */ $.basicType("int64")], [], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ($.typeSwitchSite(["main.Answer", /* @__PURE__ */ $.pointerType("main.Fault")]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
