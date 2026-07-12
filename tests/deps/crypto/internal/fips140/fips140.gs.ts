// Generated file based on fips140.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as godebug from "@goscript/crypto/internal/fips140deps/godebug/index.js"

import * as errors from "@goscript/errors/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as __goscript_notasan from "./notasan.gs.ts"

import * as __goscript_notboring from "./notboring.gs.ts"

import * as __goscript_notpurego from "./notpurego.gs.ts"
import "@goscript/crypto/internal/fips140deps/godebug/index.js"
import "@goscript/errors/index.js"
import "@goscript/runtime/index.js"
import "./notasan.gs.ts"
import "./notboring.gs.ts"
import "./notpurego.gs.ts"

export let Enabled: boolean = false

export function __goscript_set_Enabled(__goscriptValue: boolean): void {
	Enabled = __goscriptValue
}

export let debug: boolean = false

export function __goscript_set_debug(__goscriptValue: boolean): void {
	debug = __goscriptValue
}

function __goscriptInit0(): void {
	let v = godebug.Value("#fips140")
	switch (v) {
		case "on":
		case "only":
		{
			Enabled = true
			break
		}
		case "debug":
		{
			Enabled = true
			debug = true
			break
		}
		case "off":
		case "":
		{
			break
		}
		default:
		{
			$.panic("fips140: unknown GODEBUG setting fips140=" + v)
			break
		}
	}
}

export function Supported(): $.GoError {
	// Keep this in sync with fipsSupported in cmd/dist/test.go.

	// The purego tag changes too much of the implementation to claim the
	// validation still applies.
	if (false) {
		return errors.New("FIPS 140-3 mode is incompatible with the purego build tag")
	}

	// ASAN disapproves of reading swaths of global memory in fips140/check.
	// One option would be to expose runtime.asanunpoison through
	// crypto/internal/fips140deps and then call it to unpoison the range
	// before reading it, but it is unclear whether that would then cause
	// false negatives. For now, FIPS+ASAN doesn't need to work.
	if (false) {
		return errors.New("FIPS 140-3 mode is incompatible with ASAN")
	}

	// See EnableFIPS in cmd/internal/obj/fips.go for commentary.
	// Also, js/wasm and windows/386 don't have good enough timers
	// for the CPU jitter entropy source.
	switch ((true as boolean)) {
		case $.stringEqual(runtime.GOARCH, "wasm"):
		case ($.stringEqual(runtime.GOOS, "windows")) && ($.stringEqual(runtime.GOARCH, "386")):
		case $.stringEqual(runtime.GOOS, "openbsd"):
		case $.stringEqual(runtime.GOOS, "aix"):
		{
			return errors.New((("FIPS 140-3 mode is not supported on " + runtime.GOOS) + "-") + runtime.GOARCH)
			break
		}
	}

	if (false) {
		return errors.New("FIPS 140-3 mode is incompatible with GOEXPERIMENT=boringcrypto")
	}

	return null
}

export function Name(): string {
	return "Go Cryptographic Module"
}

export function Version(): string {
	// This return value is replaced by mkzip.go, it must not be changed or
	// moved to a different file.
	return "latest"
}

__goscriptInit0()
