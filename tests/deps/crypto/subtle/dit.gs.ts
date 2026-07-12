// Generated file based on dit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sys from "@goscript/internal/runtime/sys/index.js"

import "@goscript/unsafe/index.js"
import "@goscript/internal/runtime/sys/index.js"

export async function WithDataIndependentTiming(f: (() => void) | null): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	if (!sys.DITSupported) {
		await f!()
		return
	}

	let alreadyEnabled = setDITEnabled()

	// disableDIT is called in a deferred function so that if f panics we will
	// still disable DIT, in case the panic is recovered further up the stack.
	__defer.defer(() => { ((): void => {
		if (!alreadyEnabled) {
			setDITDisabled()
		}
	})() })

	await f!()
}

export function setDITEnabled(): boolean {
	return false
}

export function setDITDisabled(): void {
}
