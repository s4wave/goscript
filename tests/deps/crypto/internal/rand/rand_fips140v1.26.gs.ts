// Generated file based on rand_fips140v1.26.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as drbg from "@goscript/crypto/internal/fips140/drbg/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/crypto/internal/fips140/drbg/index.js"
import "@goscript/io/index.js"

export function fips140SetTestingReader(r: io.Reader | null): void {
	drbg.SetTestingReader(r)
}
