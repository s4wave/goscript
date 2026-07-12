// Generated file based on fipstls.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/fips140/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"
import "@goscript/crypto/fips140/index.js"
import "@goscript/sync/atomic/index.js"

export let required: $.VarRef<atomic.Bool> = $.varRef($.markAsStructValue(new atomic.Bool()))

export function __goscript_set_required(__goscriptValue: atomic.Bool): void {
	required.value = __goscriptValue
}

function __goscriptInit0(): void {
	if (fips140.Enabled()) {
		Force()
	}
}

export function Force(): void {
	required.value.Store(true)
}

export function Required(): boolean {
	return required.value.Load()
}

export function TestingOnlyAbandon(): void {
	required.value.Store(false)
}

__goscriptInit0()
