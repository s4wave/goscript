// Generated file based on fips140.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as check from "@goscript/crypto/internal/fips140/check/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/check/index.js"

export function Enabled(): boolean {
	if (fips140.Enabled && !check.Verified) {
		$.panic("crypto/fips140: FIPS 140-3 mode enabled, but integrity check didn't pass")
	}
	return fips140.Enabled
}

export function Version(): string {
	return fips140.Version()
}
