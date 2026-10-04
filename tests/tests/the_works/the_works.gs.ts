// Generated file based on the_works.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Op = number

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

	public _fields: {
		Op: Op
		Arg: bigint
	}

	constructor(init?: Partial<{Op?: Op, Arg?: bigint}>) {
		this._fields = {
			Op: init?.Op ?? (0 as Op),
			Arg: init?.Arg ?? (0n as bigint)
		}
	}

	public clone(): Instr {
		return $.markAsStructValue(new Instr(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Op", "Arg"])
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

	public _fields: {
		Name: string
		Code: $.Slice<Instr>
	}

	constructor(init?: Partial<{Name?: string, Code?: $.Slice<Instr>}>) {
		this._fields = {
			Name: init?.Name ?? ("" as string),
			Code: init?.Code ?? (null! as $.Slice<Instr>)
		}
	}

	public clone(): Program {
		return $.markAsStructValue(new Program(this))
	}

	public Listing(): ((_yield: ((_p0: number, _p1: Instr) => boolean | globalThis.Promise<boolean>) | null) => void) | null {
		const p = this;
		return $.functionValue(async (_yield: ((_p0: number, _p1: Instr) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> => {
			for (let __goscriptRangeTarget0 = p.Code, pc = 0; pc < $.len(__goscriptRangeTarget0); pc++) {
				let _in = $.markAsStructValue($.cloneStructValue(__goscriptRangeTarget0![pc]))
				if (!await _yield!(pc, $.markAsStructValue($.cloneStructValue(_in)))) {
					return
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), "main.Instr"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
	}

	static {
		$.bindStructFields(this.prototype, ["Name", "Code"])
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

	public _fields: {
		items: $.Slice<any>
	}

	constructor(init?: Partial<{items?: $.Slice<any>}>) {
		this._fields = {
			items: init?.items ?? (null! as $.Slice<any>)
		}
	}

	public clone(): Stack {
		return $.markAsStructValue(new Stack(this))
	}

	public Pop(__typeArgs: $.GenericTypeArgs | undefined): any {
		let s: Stack | $.VarRef<Stack> | null = this;
		if ($.len($.pointerValue<Stack>(s).items) == 0) {
			$.panic("stack underflow")
		}
		let v = $.arrayIndex($.pointerValue<Stack>(s).items!, $.len($.pointerValue<Stack>(s).items) - 1)
		$.pointerValue<Stack>(s).items = $.goSlice($.pointerValue<Stack>(s).items, undefined, $.len($.pointerValue<Stack>(s).items) - 1)
		return v
	}

	public Push(__typeArgs: $.GenericTypeArgs | undefined, v: any): void {
		let s: Stack | $.VarRef<Stack> | null = this;
		$.pointerValue<Stack>(s).items = $.append($.pointerValue<Stack>(s).items, v, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as any)))
	}

	static {
		$.bindStructFields(this.prototype, ["items"])
	}

	static __typeInfo = $.registerStructType(
		"main.Stack",
		() => new Stack(),
		() => [{ name: "Pop", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		Stack,
		() => [{ name: "items", key: "items", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export class VM {
	public declare pc: number

	public declare steps: number

	public declare stack: Stack

	public _fields: {
		pc: number
		steps: number
		stack: Stack
	}

	constructor(init?: Partial<{pc?: number, steps?: number, stack?: Stack}>) {
		this._fields = {
			pc: init?.pc ?? (0 as number),
			steps: init?.steps ?? (0 as number),
			stack: init?.stack ? $.markAsStructValue($.cloneStructValue(init.stack)) : $.markAsStructValue(new Stack())
		}
	}

	public clone(): VM {
		return $.markAsStructValue(new VM(this))
	}

	public Step(code: $.Slice<Instr>): boolean {
		let vm: VM | $.VarRef<VM> | null = this;
		let _in = $.markAsStructValue($.cloneStructValue($.arrayIndex(code!, $.pointerValue<VM>(vm).pc)))
		$.pointerValue<VM>(vm).pc++
		$.pointerValue<VM>(vm).steps++
		let s: Stack | $.VarRef<Stack> | null = $.fieldRef($.pointerValue<VM>(vm)._fields, "stack")
		switch (_in.Op) {
			case 0:
			{
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, _in.Arg)
				break
			}
			case 1:
			{
				let v = (Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}) as bigint)
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, v)
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, v)
				break
			}
			case 2:
			{
				let b = (Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}) as bigint)
				let a = (Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}) as bigint)
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, a)
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, b)
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, a)
				break
			}
			case 3:
			{
				let b = (Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}) as bigint)
				let a = (Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}) as bigint)
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, b)
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, a)
				break
			}
			case 4:
			{
				Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }})
				break
			}
			case 5:
			{
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, $.int64Sub(Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}), 1n))
				break
			}
			case 6:
			{
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, $.int64Add(Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}), Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }})))
				break
			}
			case 7:
			{
				Stack.prototype.Push.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}, $.int64Mul(Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}), Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }})))
				break
			}
			case 8:
			{
				if (Stack.prototype.Pop.call(s, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}) != 0n) {
					$.pointerValue<VM>(vm).pc = $.int(_in.Arg)
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

	static {
		$.bindStructFields(this.prototype, ["pc", "steps", "stack"])
	}

	static __typeInfo = $.registerStructType(
		"main.VM",
		() => new VM(),
		() => [{ name: "Step", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }],
		VM,
		() => [{ name: "pc", key: "pc", type: /* @__PURE__ */ $.basicType("int") }, { name: "steps", key: "steps", type: /* @__PURE__ */ $.basicType("int") }, { name: "stack", key: "stack", type: "main.Stack" }]
	)
}

export class Answer {
	public declare Name: string

	public declare Value: bigint

	public declare Steps: number

	public _fields: {
		Name: string
		Value: bigint
		Steps: number
	}

	constructor(init?: Partial<{Name?: string, Value?: bigint, Steps?: number}>) {
		this._fields = {
			Name: init?.Name ?? ("" as string),
			Value: init?.Value ?? (0n as bigint),
			Steps: init?.Steps ?? (0 as number)
		}
	}

	public clone(): Answer {
		return $.markAsStructValue(new Answer(this))
	}

	public Program(): string {
		const a = this;
		return a.Name
	}

	static {
		$.bindStructFields(this.prototype, ["Name", "Value", "Steps"])
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

	public _fields: {
		Name: string
		Reason: string
	}

	constructor(init?: Partial<{Name?: string, Reason?: string}>) {
		this._fields = {
			Name: init?.Name ?? ("" as string),
			Reason: init?.Reason ?? ("" as string)
		}
	}

	public clone(): Fault {
		return $.markAsStructValue(new Fault(this))
	}

	public Program(): string {
		const f: Fault | $.VarRef<Fault> | null = this;
		return $.pointerValue<Fault>(f).Name
	}

	static {
		$.bindStructFields(this.prototype, ["Name", "Reason"])
	}

	static __typeInfo = $.registerStructType(
		"main.Fault",
		() => new Fault(),
		() => [{ name: "Program", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
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
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			{
				let r = $.recover()
				if (r != null) {
					await $.chanSend(faults, new Fault({Name: p.Name, Reason: $.mustTypeAssert<string>(r, /* @__PURE__ */ $.basicType("string"))}))
				}
			}
		})() })
		let vm: VM | $.VarRef<VM> | null = new VM()
		while (!VM.prototype.Step.call(vm, p.Code)) {
		}
		await $.chanSend(answers, (() => { const __goscriptLiteralField0 = $.pointerValue<VM>(vm).stack.Pop({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }}); return $.markAsStructValue(new Answer({Name: p.Name, Value: __goscriptLiteralField0, Steps: $.pointerValue<VM>(vm).steps})) })())
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export function factorial(name: string, n: bigint): Program {
	return $.markAsStructValue(new Program({Name: name, Code: $.arrayToSlice<Instr>([$.markAsStructValue(new Instr({Op: 0, Arg: 1n})), $.markAsStructValue(new Instr({Op: 0, Arg: n})), $.markAsStructValue(new Instr({Op: 3, Arg: 0n})), $.markAsStructValue(new Instr({Op: 2, Arg: 0n})), $.markAsStructValue(new Instr({Op: 7, Arg: 0n})), $.markAsStructValue(new Instr({Op: 3, Arg: 0n})), $.markAsStructValue(new Instr({Op: 5, Arg: 0n})), $.markAsStructValue(new Instr({Op: 1, Arg: 0n})), $.markAsStructValue(new Instr({Op: 8, Arg: 2n})), $.markAsStructValue(new Instr({Op: 4, Arg: 0n})), $.markAsStructValue(new Instr({Op: 9, Arg: 0n}))])}))
}

export async function main(): globalThis.Promise<void> {
	let programs: $.Slice<Program> = $.arrayToSlice<Program>([$.markAsStructValue($.cloneStructValue(factorial("20!", 20n))), $.markAsStructValue($.cloneStructValue(factorial("21!", 21n))), $.markAsStructValue(new Program({Name: "broken", Code: $.arrayToSlice<Instr>([$.markAsStructValue(new Instr({Op: 0, Arg: 1n})), $.markAsStructValue(new Instr({Op: 6, Arg: 0n})), $.markAsStructValue(new Instr({Op: 9, Arg: 0n}))])}))])

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

	let answers: $.Channel<Answer> | null = $.makeChannel<Answer>(0, $.markAsStructValue(new Answer()), "both")
	let faults: $.Channel<Fault | $.VarRef<Fault> | null> | null = $.makeChannel<Fault | $.VarRef<Fault> | null>(0, null! as Fault | $.VarRef<Fault> | null, "both")
	for (let __goscriptRangeTarget1 = programs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let p = $.markAsStructValue($.cloneStructValue(__goscriptRangeTarget1![__rangeIndex]))
		queueMicrotask(async () => { await run($.markAsStructValue($.cloneStructValue(p)), answers, faults) })
	}

	let reports: globalThis.Map<string, Report | null> | null = $.makeMap<string, Report | null>()
	while ($.len(reports) < $.len(programs)) {
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: answers,
				onSelected: async (__goscriptSelect0Result) => {
					let a = __goscriptSelect0Result.value
					$.mapSet(reports, a.Name, $.interfaceValue<Report | null>($.markAsStructValue($.cloneStructValue(a)), "main.Answer", "main.Answer"))
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
	for (let __goscriptRangeTarget2 = programs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let p = $.markAsStructValue($.cloneStructValue(__goscriptRangeTarget2![__rangeIndex]))
		{
			const __goscriptTypeSwitchValue = $.mapGet<string, Report | null, Report | null>(reports, p.Name, null)[0]
			switch (true) {
				case $.typeAssert<Answer>(__goscriptTypeSwitchValue, "main.Answer").ok:
					{
						let r: Answer = $.markAsStructValue($.cloneStructValue($.typeAssert<Answer>(__goscriptTypeSwitchValue, "main.Answer").value))
						totalSteps = totalSteps + (r.Steps)
						await $.println($.markAsStructValue($.cloneStructValue(r)).Program(), "=", r.Value, "in", r.Steps, "steps")
					}
					break
				case $.typeAssert<Fault | $.VarRef<Fault> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType("main.Fault")).ok:
					{
						let r: Fault | $.VarRef<Fault> | null = $.typeAssert<Fault | $.VarRef<Fault> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType("main.Fault")).value
						await $.println(Fault.prototype.Program.call(r), "crashed:", $.pointerValue<Fault>(r).Reason)
					}
					break
			}
		}
	}
	await $.println("total steps:", totalSteps)
}

if ($.isMainScript(import.meta)) {
	await main()
}
