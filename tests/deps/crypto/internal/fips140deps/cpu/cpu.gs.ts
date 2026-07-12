// Generated file based on cpu.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as cpu from "@goscript/internal/cpu/index.js"

import * as goarch from "@goscript/internal/goarch/index.js"
import "@goscript/internal/cpu/index.js"
import "@goscript/internal/goarch/index.js"

export const BigEndian: boolean = false

export const AMD64: boolean = false

export const ARM64: boolean = false

export const PPC64: boolean = false

export const PPC64le: boolean = false

export let ARM64HasAES: boolean = cpu.ARM64.HasAES

export function __goscript_set_ARM64HasAES(__goscriptValue: boolean): void {
	ARM64HasAES = __goscriptValue
}

export let ARM64HasPMULL: boolean = cpu.ARM64.HasPMULL

export function __goscript_set_ARM64HasPMULL(__goscriptValue: boolean): void {
	ARM64HasPMULL = __goscriptValue
}

export let ARM64HasSHA2: boolean = cpu.ARM64.HasSHA2

export function __goscript_set_ARM64HasSHA2(__goscriptValue: boolean): void {
	ARM64HasSHA2 = __goscriptValue
}

export let ARM64HasSHA512: boolean = cpu.ARM64.HasSHA512

export function __goscript_set_ARM64HasSHA512(__goscriptValue: boolean): void {
	ARM64HasSHA512 = __goscriptValue
}

export let ARM64HasSHA3: boolean = cpu.ARM64.HasSHA3

export function __goscript_set_ARM64HasSHA3(__goscriptValue: boolean): void {
	ARM64HasSHA3 = __goscriptValue
}

export let LOONG64HasLSX: boolean = cpu.Loong64.HasLSX

export function __goscript_set_LOONG64HasLSX(__goscriptValue: boolean): void {
	LOONG64HasLSX = __goscriptValue
}

export let LOONG64HasLASX: boolean = cpu.Loong64.HasLASX

export function __goscript_set_LOONG64HasLASX(__goscriptValue: boolean): void {
	LOONG64HasLASX = __goscriptValue
}

export let S390XHasAES: boolean = cpu.S390X.HasAES

export function __goscript_set_S390XHasAES(__goscriptValue: boolean): void {
	S390XHasAES = __goscriptValue
}

export let S390XHasAESCBC: boolean = cpu.S390X.HasAESCBC

export function __goscript_set_S390XHasAESCBC(__goscriptValue: boolean): void {
	S390XHasAESCBC = __goscriptValue
}

export let S390XHasAESCTR: boolean = cpu.S390X.HasAESCTR

export function __goscript_set_S390XHasAESCTR(__goscriptValue: boolean): void {
	S390XHasAESCTR = __goscriptValue
}

export let S390XHasAESGCM: boolean = cpu.S390X.HasAESGCM

export function __goscript_set_S390XHasAESGCM(__goscriptValue: boolean): void {
	S390XHasAESGCM = __goscriptValue
}

export let S390XHasECDSA: boolean = cpu.S390X.HasECDSA

export function __goscript_set_S390XHasECDSA(__goscriptValue: boolean): void {
	S390XHasECDSA = __goscriptValue
}

export let S390XHasGHASH: boolean = cpu.S390X.HasGHASH

export function __goscript_set_S390XHasGHASH(__goscriptValue: boolean): void {
	S390XHasGHASH = __goscriptValue
}

export let S390XHasSHA256: boolean = cpu.S390X.HasSHA256

export function __goscript_set_S390XHasSHA256(__goscriptValue: boolean): void {
	S390XHasSHA256 = __goscriptValue
}

export let S390XHasSHA3: boolean = cpu.S390X.HasSHA3

export function __goscript_set_S390XHasSHA3(__goscriptValue: boolean): void {
	S390XHasSHA3 = __goscriptValue
}

export let S390XHasSHA512: boolean = cpu.S390X.HasSHA512

export function __goscript_set_S390XHasSHA512(__goscriptValue: boolean): void {
	S390XHasSHA512 = __goscriptValue
}

export let X86HasAES: boolean = cpu.X86.HasAES

export function __goscript_set_X86HasAES(__goscriptValue: boolean): void {
	X86HasAES = __goscriptValue
}

export let X86HasADX: boolean = cpu.X86.HasADX

export function __goscript_set_X86HasADX(__goscriptValue: boolean): void {
	X86HasADX = __goscriptValue
}

export let X86HasAVX: boolean = cpu.X86.HasAVX

export function __goscript_set_X86HasAVX(__goscriptValue: boolean): void {
	X86HasAVX = __goscriptValue
}

export let X86HasAVX2: boolean = cpu.X86.HasAVX2

export function __goscript_set_X86HasAVX2(__goscriptValue: boolean): void {
	X86HasAVX2 = __goscriptValue
}

export let X86HasBMI2: boolean = cpu.X86.HasBMI2

export function __goscript_set_X86HasBMI2(__goscriptValue: boolean): void {
	X86HasBMI2 = __goscriptValue
}

export let X86HasPCLMULQDQ: boolean = cpu.X86.HasPCLMULQDQ

export function __goscript_set_X86HasPCLMULQDQ(__goscriptValue: boolean): void {
	X86HasPCLMULQDQ = __goscriptValue
}

export let X86HasSHA: boolean = cpu.X86.HasSHA

export function __goscript_set_X86HasSHA(__goscriptValue: boolean): void {
	X86HasSHA = __goscriptValue
}

export let X86HasSSE41: boolean = cpu.X86.HasSSE41

export function __goscript_set_X86HasSSE41(__goscriptValue: boolean): void {
	X86HasSSE41 = __goscriptValue
}

export let X86HasSSSE3: boolean = cpu.X86.HasSSSE3

export function __goscript_set_X86HasSSSE3(__goscriptValue: boolean): void {
	X86HasSSSE3 = __goscriptValue
}
