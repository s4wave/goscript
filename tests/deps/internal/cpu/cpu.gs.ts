// Generated file based on cpu.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import "@goscript/unsafe/index.js"

import * as __goscript_cpu_wasm from "./cpu_wasm.gs.ts"
import "./cpu_wasm.gs.ts"

export class CacheLinePad {
	public get _blank0(): Uint8Array {
		return this._fields._blank0.value
	}
	public set _blank0(value: Uint8Array) {
		this._fields._blank0.value = value
	}

	public _fields: {
		_blank0: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{_blank0?: Uint8Array}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 !== undefined ? $.cloneArrayValue(init._blank0) : new Uint8Array(64))
		}
	}

	public clone(): CacheLinePad {
		const cloned = new CacheLinePad()
		cloned._fields = {
			_blank0: $.varRef($.cloneArrayValue(this._fields._blank0.value))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"cpu.CacheLinePad",
		() => new CacheLinePad(),
		[],
		CacheLinePad,
		[{ name: "_", key: "_blank0", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 64 } }]
	)
}

export class option {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Feature(): $.VarRef<boolean> | null {
		return this._fields.Feature.value
	}
	public set Feature(value: $.VarRef<boolean> | null) {
		this._fields.Feature.value = value
	}

	public get Specified(): boolean {
		return this._fields.Specified.value
	}
	public set Specified(value: boolean) {
		this._fields.Specified.value = value
	}

	public get Enable(): boolean {
		return this._fields.Enable.value
	}
	public set Enable(value: boolean) {
		this._fields.Enable.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Feature: $.VarRef<$.VarRef<boolean> | null>
		Specified: $.VarRef<boolean>
		Enable: $.VarRef<boolean>
	}

	constructor(init?: Partial<{Name?: string, Feature?: $.VarRef<boolean> | null, Specified?: boolean, Enable?: boolean}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ("" as string)),
			Feature: $.varRef(init?.Feature ?? (null as $.VarRef<boolean> | null)),
			Specified: $.varRef(init?.Specified ?? (false as boolean)),
			Enable: $.varRef(init?.Enable ?? (false as boolean))
		}
	}

	public clone(): option {
		const cloned = new option()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Feature: $.varRef(this._fields.Feature.value),
			Specified: $.varRef(this._fields.Specified.value),
			Enable: $.varRef(this._fields.Enable.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"cpu.option",
		() => new option(),
		[],
		option,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "Feature", key: "Feature", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } } }, { name: "Specified", key: "Specified", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "Enable", key: "Enable", type: { kind: $.TypeKind.Basic, name: "bool" } }]
	)
}

export var CacheLineSize: number

export function __goscript_init_CacheLineSize(): void {
	if (((CacheLineSize) as any) === undefined) {
		CacheLineSize = $.uint(64, 64)
	}
}

export function __goscript_get_CacheLineSize(): number {
	if (((CacheLineSize) as any) === undefined) {
		__goscript_init_CacheLineSize()
	}
	return CacheLineSize
}

export function __goscript_set_CacheLineSize(__goscriptValue: number): void {
	CacheLineSize = __goscriptValue
}

export let X86: {"_blank0": CacheLinePad, "HasAES": boolean, "HasADX": boolean, "HasAVX": boolean, "HasAVXVNNI": boolean, "HasAVX2": boolean, "HasAVX512": boolean, "HasAVX512F": boolean, "HasAVX512CD": boolean, "HasAVX512BW": boolean, "HasAVX512DQ": boolean, "HasAVX512VL": boolean, "HasAVX512GFNI": boolean, "HasAVX512VAES": boolean, "HasAVX512VNNI": boolean, "HasAVX512VBMI": boolean, "HasAVX512VBMI2": boolean, "HasAVX512BITALG": boolean, "HasAVX512VPOPCNTDQ": boolean, "HasAVX512VPCLMULQDQ": boolean, "HasBMI1": boolean, "HasBMI2": boolean, "HasERMS": boolean, "HasFSRM": boolean, "HasFMA": boolean, "HasGFNI": boolean, "HasOSXSAVE": boolean, "HasPCLMULQDQ": boolean, "HasPOPCNT": boolean, "HasRDTSCP": boolean, "HasSHA": boolean, "HasSSE3": boolean, "HasSSSE3": boolean, "HasSSE41": boolean, "HasSSE42": boolean, "HasVAES": boolean, "_blank36": CacheLinePad} = {"_blank0": $.markAsStructValue(new CacheLinePad()), "HasAES": false, "HasADX": false, "HasAVX": false, "HasAVXVNNI": false, "HasAVX2": false, "HasAVX512": false, "HasAVX512F": false, "HasAVX512CD": false, "HasAVX512BW": false, "HasAVX512DQ": false, "HasAVX512VL": false, "HasAVX512GFNI": false, "HasAVX512VAES": false, "HasAVX512VNNI": false, "HasAVX512VBMI": false, "HasAVX512VBMI2": false, "HasAVX512BITALG": false, "HasAVX512VPOPCNTDQ": false, "HasAVX512VPCLMULQDQ": false, "HasBMI1": false, "HasBMI2": false, "HasERMS": false, "HasFSRM": false, "HasFMA": false, "HasGFNI": false, "HasOSXSAVE": false, "HasPCLMULQDQ": false, "HasPOPCNT": false, "HasRDTSCP": false, "HasSHA": false, "HasSSE3": false, "HasSSSE3": false, "HasSSE41": false, "HasSSE42": false, "HasVAES": false, "_blank36": $.markAsStructValue(new CacheLinePad())}

export function __goscript_set_X86(__goscriptValue: {"_blank0": CacheLinePad, "HasAES": boolean, "HasADX": boolean, "HasAVX": boolean, "HasAVXVNNI": boolean, "HasAVX2": boolean, "HasAVX512": boolean, "HasAVX512F": boolean, "HasAVX512CD": boolean, "HasAVX512BW": boolean, "HasAVX512DQ": boolean, "HasAVX512VL": boolean, "HasAVX512GFNI": boolean, "HasAVX512VAES": boolean, "HasAVX512VNNI": boolean, "HasAVX512VBMI": boolean, "HasAVX512VBMI2": boolean, "HasAVX512BITALG": boolean, "HasAVX512VPOPCNTDQ": boolean, "HasAVX512VPCLMULQDQ": boolean, "HasBMI1": boolean, "HasBMI2": boolean, "HasERMS": boolean, "HasFSRM": boolean, "HasFMA": boolean, "HasGFNI": boolean, "HasOSXSAVE": boolean, "HasPCLMULQDQ": boolean, "HasPOPCNT": boolean, "HasRDTSCP": boolean, "HasSHA": boolean, "HasSSE3": boolean, "HasSSSE3": boolean, "HasSSE41": boolean, "HasSSE42": boolean, "HasVAES": boolean, "_blank36": CacheLinePad}): void {
	X86 = __goscriptValue
}

export let ARM: {"_blank0": CacheLinePad, "HasVFPv4": boolean, "HasIDIVA": boolean, "HasV7Atomics": boolean, "_blank4": CacheLinePad} = {"_blank0": $.markAsStructValue(new CacheLinePad()), "HasVFPv4": false, "HasIDIVA": false, "HasV7Atomics": false, "_blank4": $.markAsStructValue(new CacheLinePad())}

export function __goscript_set_ARM(__goscriptValue: {"_blank0": CacheLinePad, "HasVFPv4": boolean, "HasIDIVA": boolean, "HasV7Atomics": boolean, "_blank4": CacheLinePad}): void {
	ARM = __goscriptValue
}

export let ARM64: {"_blank0": CacheLinePad, "HasAES": boolean, "HasPMULL": boolean, "HasSHA1": boolean, "HasSHA2": boolean, "HasSHA512": boolean, "HasSHA3": boolean, "HasCRC32": boolean, "HasATOMICS": boolean, "HasCPUID": boolean, "HasDIT": boolean, "IsNeoverse": boolean, "_blank12": CacheLinePad} = {"_blank0": $.markAsStructValue(new CacheLinePad()), "HasAES": false, "HasPMULL": false, "HasSHA1": false, "HasSHA2": false, "HasSHA512": false, "HasSHA3": false, "HasCRC32": false, "HasATOMICS": false, "HasCPUID": false, "HasDIT": false, "IsNeoverse": false, "_blank12": $.markAsStructValue(new CacheLinePad())}

export function __goscript_set_ARM64(__goscriptValue: {"_blank0": CacheLinePad, "HasAES": boolean, "HasPMULL": boolean, "HasSHA1": boolean, "HasSHA2": boolean, "HasSHA512": boolean, "HasSHA3": boolean, "HasCRC32": boolean, "HasATOMICS": boolean, "HasCPUID": boolean, "HasDIT": boolean, "IsNeoverse": boolean, "_blank12": CacheLinePad}): void {
	ARM64 = __goscriptValue
}

export let Loong64: {"_blank0": CacheLinePad, "HasLSX": boolean, "HasLASX": boolean, "HasCRC32": boolean, "HasLAMCAS": boolean, "HasLAM_BH": boolean, "_blank6": CacheLinePad} = {"_blank0": $.markAsStructValue(new CacheLinePad()), "HasLSX": false, "HasLASX": false, "HasCRC32": false, "HasLAMCAS": false, "HasLAM_BH": false, "_blank6": $.markAsStructValue(new CacheLinePad())}

export function __goscript_set_Loong64(__goscriptValue: {"_blank0": CacheLinePad, "HasLSX": boolean, "HasLASX": boolean, "HasCRC32": boolean, "HasLAMCAS": boolean, "HasLAM_BH": boolean, "_blank6": CacheLinePad}): void {
	Loong64 = __goscriptValue
}

export let MIPS64X: {"_blank0": CacheLinePad, "HasMSA": boolean, "_blank2": CacheLinePad} = {"_blank0": $.markAsStructValue(new CacheLinePad()), "HasMSA": false, "_blank2": $.markAsStructValue(new CacheLinePad())}

export function __goscript_set_MIPS64X(__goscriptValue: {"_blank0": CacheLinePad, "HasMSA": boolean, "_blank2": CacheLinePad}): void {
	MIPS64X = __goscriptValue
}

export let PPC64: {"_blank0": CacheLinePad, "HasDARN": boolean, "HasSCV": boolean, "IsPOWER8": boolean, "IsPOWER9": boolean, "IsPOWER10": boolean, "_blank6": CacheLinePad} = {"_blank0": $.markAsStructValue(new CacheLinePad()), "HasDARN": false, "HasSCV": false, "IsPOWER8": false, "IsPOWER9": false, "IsPOWER10": false, "_blank6": $.markAsStructValue(new CacheLinePad())}

export function __goscript_set_PPC64(__goscriptValue: {"_blank0": CacheLinePad, "HasDARN": boolean, "HasSCV": boolean, "IsPOWER8": boolean, "IsPOWER9": boolean, "IsPOWER10": boolean, "_blank6": CacheLinePad}): void {
	PPC64 = __goscriptValue
}

export let S390X: {"_blank0": CacheLinePad, "HasZARCH": boolean, "HasSTFLE": boolean, "HasLDISP": boolean, "HasEIMM": boolean, "HasDFP": boolean, "HasETF3EH": boolean, "HasMSA": boolean, "HasAES": boolean, "HasAESCBC": boolean, "HasAESCTR": boolean, "HasAESGCM": boolean, "HasGHASH": boolean, "HasSHA1": boolean, "HasSHA256": boolean, "HasSHA512": boolean, "HasSHA3": boolean, "HasVX": boolean, "HasVXE": boolean, "HasKDSA": boolean, "HasECDSA": boolean, "HasEDDSA": boolean, "_blank22": CacheLinePad} = {"_blank0": $.markAsStructValue(new CacheLinePad()), "HasZARCH": false, "HasSTFLE": false, "HasLDISP": false, "HasEIMM": false, "HasDFP": false, "HasETF3EH": false, "HasMSA": false, "HasAES": false, "HasAESCBC": false, "HasAESCTR": false, "HasAESGCM": false, "HasGHASH": false, "HasSHA1": false, "HasSHA256": false, "HasSHA512": false, "HasSHA3": false, "HasVX": false, "HasVXE": false, "HasKDSA": false, "HasECDSA": false, "HasEDDSA": false, "_blank22": $.markAsStructValue(new CacheLinePad())}

export function __goscript_set_S390X(__goscriptValue: {"_blank0": CacheLinePad, "HasZARCH": boolean, "HasSTFLE": boolean, "HasLDISP": boolean, "HasEIMM": boolean, "HasDFP": boolean, "HasETF3EH": boolean, "HasMSA": boolean, "HasAES": boolean, "HasAESCBC": boolean, "HasAESCTR": boolean, "HasAESGCM": boolean, "HasGHASH": boolean, "HasSHA1": boolean, "HasSHA256": boolean, "HasSHA512": boolean, "HasSHA3": boolean, "HasVX": boolean, "HasVXE": boolean, "HasKDSA": boolean, "HasECDSA": boolean, "HasEDDSA": boolean, "_blank22": CacheLinePad}): void {
	S390X = __goscriptValue
}

export let RISCV64: {"_blank0": CacheLinePad, "HasFastMisaligned": boolean, "HasV": boolean, "HasZbb": boolean, "_blank4": CacheLinePad} = {"_blank0": $.markAsStructValue(new CacheLinePad()), "HasFastMisaligned": false, "HasV": false, "HasZbb": false, "_blank4": $.markAsStructValue(new CacheLinePad())}

export function __goscript_set_RISCV64(__goscriptValue: {"_blank0": CacheLinePad, "HasFastMisaligned": boolean, "HasV": boolean, "HasZbb": boolean, "_blank4": CacheLinePad}): void {
	RISCV64 = __goscriptValue
}

export let doDerived: (() => void) | null = null as (() => void) | null

export function __goscript_set_doDerived(__goscriptValue: (() => void) | null): void {
	doDerived = __goscriptValue
}

export async function Initialize(env: string): globalThis.Promise<void> {
	__goscript_cpu_wasm.doinit()
	processOptions(env)
	if (doDerived != null) {
		await doDerived!()
	}
}

export let options: $.Slice<option> = null as $.Slice<option>

export function __goscript_set_options(__goscriptValue: $.Slice<option>): void {
	options = __goscriptValue
}

export function processOptions(env: string): void {
	field: while (!$.stringEqual(env, "")) {
		let field = ""
		let i = indexByte(env, $.uint(44, 8))
		if (i < 0) {
			let __goscriptAssign0_0: string = env
			let __goscriptAssign0_1: string = ""
			field = __goscriptAssign0_0
			env = __goscriptAssign0_1
		} else {
			let __goscriptAssign1_0: string = $.sliceStringOrBytes(env, undefined, i)
			let __goscriptAssign1_1: string = $.sliceStringOrBytes(env, i + 1, undefined)
			field = __goscriptAssign1_0
			env = __goscriptAssign1_1
		}
		if (($.len(field) < 4) || (!$.stringEqual($.sliceStringOrBytes(field, undefined, 4), "cpu."))) {
			continue
		}
		i = indexByte(field, $.uint(61, 8))
		if (i < 0) {
			$.print("GODEBUG: no value specified for \"", field, "\"\n")
			continue
		}
		let key = $.sliceStringOrBytes(field, 4, i)
		let value = $.sliceStringOrBytes(field, i + 1, undefined)

		let enable: boolean = false
		switch (value) {
			case "on":
			{
				enable = true
				break
			}
			case "off":
			{
				enable = false
				break
			}
			default:
			{
				$.print("GODEBUG: value \"", value, "\" not supported for cpu option \"", key, "\"\n")
				continue field
				break
			}
		}

		if ($.stringEqual(key, "all")) {
			for (let __goscriptRangeTarget0 = options, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
				$.arrayIndex(options!, i).Specified = true
				$.arrayIndex(options!, i).Enable = enable
			}
			continue field
		}

		for (let __goscriptRangeTarget1 = options, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			if ($.stringEqual($.arrayIndex(options!, i).Name, key)) {
				$.arrayIndex(options!, i).Specified = true
				$.arrayIndex(options!, i).Enable = enable
				continue field
			}
		}

		$.print("GODEBUG: unknown cpu feature \"", key, "\"\n")
	}

	for (let __goscriptRangeTarget2 = options, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let o = __goscriptRangeTarget2![__rangeIndex]
		if (!o.Specified) {
			continue
		}

		if (o.Enable && !$.pointerValue<boolean>(o.Feature)) {
			$.print("GODEBUG: can not enable \"", o.Name, "\", missing CPU support\n")
			continue
		}

		o.Feature!.value = o.Enable
	}
}

export function indexByte(s: string, c: number): number {
	for (let i = 0; i < $.len(s); i++) {
		if ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(c, 8)) {
			return i
		}
	}
	return -1
}
