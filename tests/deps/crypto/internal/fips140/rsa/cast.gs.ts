// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as bigmod from "@goscript/crypto/internal/fips140/bigmod/index.js"

import "@goscript/crypto/internal/fips140/check/index.js"

import * as errors from "@goscript/errors/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_pkcs1v15 from "./pkcs1v15.gs.ts"

import * as __goscript_rsa from "./rsa.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/bigmod/index.js"
import "@goscript/errors/index.js"
import "@goscript/sync/index.js"
import "./pkcs1v15.gs.ts"
import "./rsa.gs.ts"

export function testPrivateKey(): __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null {
	// https://www.rfc-editor.org/rfc/rfc9500.html#section-2.1
	let __goscriptTuple0: any = bigmod.NewModulus(new Uint8Array([176, 249, 232, 25, 67, 167, 174, 152, 146, 170, 222, 23, 202, 124, 64, 248, 116, 79, 237, 47, 129, 72, 230, 200, 234, 162, 123, 125, 0, 21, 72, 251, 81, 146, 171, 40, 181, 108, 80, 96, 177, 24, 204, 209, 49, 229, 148, 135, 76, 108, 169, 137, 181, 108, 39, 41, 111, 9, 251, 147, 160, 52, 223, 50, 233, 124, 111, 240, 153, 140, 253, 142, 111, 66, 221, 165, 138, 205, 31, 169, 121, 134, 241, 68, 243, 209, 84, 214, 118, 80, 23, 94, 104, 84, 179, 169, 82, 0, 59, 192, 104, 135, 184, 69, 90, 194, 177, 159, 123, 47, 118, 80, 78, 188, 152, 236, 148, 85, 113, 176, 120, 146, 21, 13, 220, 106, 116, 202, 15, 188, 211, 84, 151, 206, 129, 83, 77, 175, 148, 24, 132, 75, 19, 174, 163, 31, 157, 90, 107, 149, 87, 187, 223, 97, 158, 253, 78, 136, 127, 45, 66, 184, 221, 139, 201, 135, 234, 225, 191, 137, 202, 184, 94, 226, 30, 53, 99, 5, 223, 108, 7, 168, 131, 142, 62, 244, 28, 89, 93, 204, 228, 61, 175, 196, 145, 35, 239, 77, 138, 187, 169, 61, 57, 5, 228, 2, 141, 123, 169, 20, 132, 162, 117, 150, 224, 123, 75, 110, 217, 146, 240, 119, 181, 36, 211, 220, 254, 125, 221, 85, 73, 190, 124, 206, 141, 160, 53, 207, 160, 179, 251, 143, 158, 70, 247, 50, 178, 168, 107, 70, 1, 101, 192, 143, 83, 19]) as $.Slice<number>)
	let N: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple0[0]
	let __goscriptTuple1: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), new Uint8Array([65, 24, 139, 32, 207, 219, 219, 194, 207, 31, 254, 117, 45, 203, 170, 114, 57, 6, 53, 46, 38, 21, 212, 157, 206, 128, 89, 127, 207, 10, 5, 64, 59, 239, 0, 250, 6, 81, 130, 247, 45, 236, 251, 89, 111, 75, 12, 232, 255, 89, 112, 186, 240, 122, 137, 165, 25, 236, 200, 22, 178, 244, 255, 172, 80, 105, 175, 27, 6, 191, 239, 123, 246, 188, 215, 158, 78, 129, 200, 197, 163, 167, 217, 19, 13, 195, 207, 186, 218, 229, 246, 210, 136, 249, 174, 227, 246, 255, 146, 250, 224, 248, 26, 245, 151, 190, 201, 106, 233, 250, 185, 64, 44, 213, 254, 65, 247, 5, 190, 189, 180, 123, 183, 54, 211, 254, 108, 90, 81, 224, 226, 7, 50, 169, 123, 94, 70, 193, 203, 219, 38, 215, 72, 84, 198, 182, 96, 74, 237, 70, 55, 53, 255, 144, 118, 4, 101, 87, 202, 249, 73, 191, 68, 136, 149, 194, 4, 50, 193, 224, 156, 1, 78, 167, 86, 96, 67, 79, 26, 15, 59, 226, 148, 186, 188, 93, 83, 14, 106, 16, 33, 63, 83, 182, 3, 117, 252, 132, 167, 87, 63, 42, 241, 33, 85, 132, 245, 180, 189, 166, 212, 232, 249, 225, 122, 120, 217, 126, 119, 184, 109, 164, 161, 132, 100, 117, 49, 138, 122, 16, 165, 97, 1, 78, 255, 162, 58, 129, 236, 86, 233, 228, 16, 157, 239, 140, 179, 247, 151, 34, 63, 125, 141, 13, 67, 81]) as $.Slice<number>, N)
	let d: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple1[0]
	let __goscriptTuple2: any = bigmod.NewModulus(new Uint8Array([221, 16, 87, 2, 56, 47, 35, 43, 54, 129, 245, 55, 145, 226, 38, 23, 199, 191, 78, 154, 203, 129, 237, 72, 218, 246, 214, 153, 93, 163, 234, 182, 66, 131, 154, 255, 1, 45, 46, 166, 40, 185, 10, 242, 121, 253, 62, 111, 124, 147, 205, 128, 240, 114, 240, 31, 242, 68, 59, 62, 232, 242, 78, 212, 105, 167, 150, 19, 164, 27, 210, 64, 32, 249, 47, 209, 16, 89, 189, 29, 15, 48, 27, 91, 167, 169, 211, 99, 124, 168, 214, 92, 26, 152, 21, 65, 125, 142, 171, 115, 75, 11, 79, 58, 44, 102, 29, 154, 26, 130, 243, 172, 115, 76, 64, 83, 6, 105, 171, 142, 71, 48, 69, 165, 142, 101, 83, 157]) as $.Slice<number>)
	let p: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple2[0]
	let __goscriptTuple3: any = bigmod.NewModulus(new Uint8Array([204, 241, 229, 187, 144, 200, 233, 120, 30, 167, 91, 235, 241, 11, 194, 82, 225, 30, 176, 35, 160, 38, 15, 24, 135, 85, 42, 86, 134, 63, 74, 100, 33, 232, 198, 0, 191, 82, 61, 108, 177, 176, 173, 189, 214, 91, 254, 228, 168, 138, 3, 126, 61, 26, 65, 94, 91, 185, 86, 72, 218, 90, 12, 162, 107, 84, 244, 166, 57, 72, 82, 44, 61, 95, 137, 185, 74, 114, 239, 255, 149, 19, 77, 89, 64, 206, 69, 117, 143, 48, 137, 128, 144, 137, 86, 88, 142, 239, 87, 91, 62, 75, 196, 195, 104, 207, 232, 19, 238, 156, 37, 44, 43, 2, 224, 223, 145, 241, 170, 1, 147, 141, 56, 104, 93, 96, 186, 111]) as $.Slice<number>)
	let q: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple3[0]
	let __goscriptTuple4: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), new Uint8Array([10, 129, 216, 166, 24, 49, 74, 128, 58, 246, 28, 6, 113, 31, 44, 57, 178, 102, 255, 65, 77, 83, 71, 109, 29, 165, 42, 67, 24, 170, 254, 75, 150, 240, 218, 7, 21, 95, 138, 81, 52, 218, 184, 142, 226, 158, 129, 104, 7, 111, 205, 120, 202, 121, 26, 198, 52, 66, 168, 28, 208, 105, 57, 39, 216, 8, 227, 53, 232, 216, 203, 242, 18, 25, 7, 80, 154, 87, 117, 155, 79, 154, 24, 250, 58, 123, 51, 55, 121, 237, 222, 122, 69, 147, 132, 248, 68, 74, 218, 236, 255, 236, 149, 253, 85, 43, 12, 252, 182, 199, 246, 146, 98, 109, 222, 30, 242, 104, 164, 13, 47, 103, 181, 200, 170, 56, 127, 247]) as $.Slice<number>, p)
	let qInv: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple4[0]
	let dP: $.Slice<number> = new Uint8Array([9, 237, 84, 234, 237, 152, 248, 76, 85, 123, 74, 134, 191, 79, 87, 132, 147, 220, 188, 107, 233, 29, 161, 137, 55, 4, 4, 169, 8, 114, 118, 244, 206, 81, 216, 161, 0, 237, 133, 125, 194, 176, 100, 148, 116, 243, 241, 92, 210, 76, 84, 219, 40, 113, 16, 229, 110, 92, 176, 8, 104, 47, 145, 104, 170, 129, 243, 20, 88, 183, 67, 30, 204, 28, 68, 144, 111, 218, 135, 202, 137, 71, 16, 195, 113, 233, 7, 108, 29, 73, 251, 174, 81, 39, 105, 52, 242, 173, 120, 119, 137, 244, 45, 15, 160, 180, 201, 57, 133, 93, 66, 18, 9, 111, 112, 40, 10, 78, 174, 124, 138, 39, 217, 200, 208, 119, 46, 101]) as $.Slice<number>
	let dQ: $.Slice<number> = new Uint8Array([140, 182, 133, 122, 123, 213, 70, 95, 128, 4, 126, 155, 135, 188, 0, 39, 49, 132, 5, 129, 224, 98, 97, 57, 1, 42, 91, 80, 95, 10, 51, 132, 126, 183, 184, 195, 40, 153, 73, 173, 72, 111, 59, 75, 61, 83, 154, 181, 218, 118, 48, 33, 203, 200, 44, 27, 162, 52, 165, 102, 141, 237, 8, 1, 184, 89, 243, 67, 241, 206, 147, 4, 230, 250, 162, 176, 2, 202, 217, 183, 140, 222, 92, 220, 44, 31, 180, 23, 28, 66, 66, 22, 112, 166, 171, 15, 80, 204, 74, 25, 78, 179, 109, 28, 145, 233, 53, 186, 1, 185, 89, 216, 114, 139, 158, 100, 66, 107, 63, 195, 167, 80, 109, 235, 82, 57, 168, 167]) as $.Slice<number>
	return new __goscript_rsa.PrivateKey({pub: $.markAsStructValue(new __goscript_rsa.PublicKey({N: N, E: 65537})), d: d, p: p, q: q, qInv: qInv, dP: dP, dQ: dQ, fipsApproved: true})
}

export var fipsSelfTest: (() => void) | null

export async function __goscript_init_fipsSelfTest(): globalThis.Promise<void> {
	if (((fipsSelfTest) as any) === undefined) {
		fipsSelfTest = sync.OnceFunc($.functionValue(async (): globalThis.Promise<void> => {
	await fips140.CAST("RSASSA-PKCS-v1.5 2048-bit sign and verify", $.functionValue((): $.GoError => {
		let k: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null = testPrivateKey()
		let hash: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]) as $.Slice<number>
		let want: $.Slice<number> = new Uint8Array([22, 152, 51, 199, 48, 44, 10, 220, 10, 141, 2, 88, 235, 249, 125, 182, 42, 173, 238, 99, 114, 170, 55, 44, 179, 6, 4, 223, 219, 43, 188, 177, 118, 62, 235, 135, 239, 145, 239, 116, 105, 98, 39, 243, 36, 248, 231, 14, 178, 21, 63, 162, 77, 226, 12, 212, 220, 45, 193, 26, 132, 124, 136, 128, 185, 169, 35, 103, 57, 46, 134, 192, 83, 155, 193, 53, 179, 23, 94, 98, 149, 214, 188, 42, 166, 177, 207, 143, 153, 67, 31, 61, 210, 112, 63, 1, 55, 43, 221, 105, 26, 92, 43, 4, 112, 146, 234, 45, 134, 0, 203, 121, 202, 175, 164, 28, 217, 97, 33, 59, 30, 197, 136, 251, 255, 189, 199, 60, 54, 161, 198, 133, 3, 175, 71, 79, 66, 158, 35, 101, 36, 105, 23, 219, 231, 183, 220, 81, 198, 48, 64, 50, 79, 113, 241, 98, 45, 170, 152, 219, 17, 20, 249, 156, 53, 195, 22, 225, 26, 209, 140, 77, 140, 173, 6, 52, 210, 132, 151, 164, 11, 110, 109, 25, 159, 167, 64, 30, 181, 252, 78, 18, 8, 236, 244, 7, 19, 220, 90, 140, 213, 42, 214, 90, 44, 201, 84, 132, 120, 52, 143, 17, 251, 110, 212, 39, 69, 217, 250, 144, 130, 131, 115, 34, 21, 171, 150, 19, 13, 82, 28, 220, 23, 222, 18, 111, 132, 70, 187, 236, 227, 177, 161, 93, 139, 235, 230, 174, 2, 184, 118, 71, 118, 17, 97, 43]) as $.Slice<number>
		let __goscriptTuple5: any = __goscript_pkcs1v15.signPKCS1v15(k, "SHA-256", hash)
		let sig: $.Slice<number> = __goscriptTuple5[0]
		let err = __goscriptTuple5[1]
		if (err != null) {
			return err
		}
		{
			let __goscriptShadow0 = __goscript_pkcs1v15.verifyPKCS1v15(__goscript_rsa.PrivateKey.prototype.PublicKey.call(k), "SHA-256", hash, sig)
			if (__goscriptShadow0 != null) {
				return __goscriptShadow0
			}
		}
		if (!bytes.Equal(sig, want)) {
			return errors.New("unexpected result")
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}
}

export function __goscript_get_fipsSelfTest(): (() => void) | null {
	if (((fipsSelfTest) as any) === undefined) {
		throw new Error("goscript package variable fipsSelfTest read before initialization")
	}
	return fipsSelfTest
}

export function __goscript_set_fipsSelfTest(__goscriptValue: (() => void) | null): void {
	fipsSelfTest = __goscriptValue
}

await __goscript_init_fipsSelfTest()
