// Generated file based on math_big_karatsuba.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as big from "@goscript/math/big/index.js"

export function slowMul(a: big.Int | $.VarRef<big.Int> | null, b: big.Int | $.VarRef<big.Int> | null): big.Int | $.VarRef<big.Int> | null {
	let sum = new big.Int()
	let mask = big.NewInt(4294967295n)
	let rest = big.Int.prototype.Set.call($.pointerValue<big.Int>(new big.Int()), b)
	let digit = new big.Int()
	for (let shift = 0; (rest !== null && (rest as any).__isVarRef !== true && (rest as any).__goValue === undefined ? ((rest as any) as big.Int).Sign() : big.Int.prototype.Sign.call($.pointerValue<big.Int>(rest))) != 0; shift = $.wideUintAdd(shift, 32)) {
		void (digit !== null && (digit as any).__isVarRef !== true && (digit as any).__goValue === undefined ? ((digit as any) as big.Int).And(rest, mask) : big.Int.prototype.And.call($.pointerValue<big.Int>(digit), rest, mask))
		let term = big.Int.prototype.Mul.call($.pointerValue<big.Int>(new big.Int()), a, digit)
		big.Int.prototype.Add.call($.pointerValue<big.Int>(sum), sum, (term !== null && (term as any).__isVarRef !== true && (term as any).__goValue === undefined ? ((term as any) as big.Int).Lsh(term, shift) : big.Int.prototype.Lsh.call($.pointerValue<big.Int>(term), term, shift)))
		void (rest !== null && (rest as any).__isVarRef !== true && (rest as any).__goValue === undefined ? ((rest as any) as big.Int).Rsh(rest, 32) : big.Int.prototype.Rsh.call($.pointerValue<big.Int>(rest), rest, 32))
	}
	return sum
}

export async function main(): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = $.arrayToSlice<number>([46, 100]), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let k = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number)
		let a = big.Int.prototype.Exp.call($.pointerValue<big.Int>(new big.Int()), big.NewInt(10n), big.NewInt($.int64(k * 19)), null)
		void (a !== null && (a as any).__isVarRef !== true && (a as any).__goValue === undefined ? ((a as any) as big.Int).Sub(a, big.NewInt(3n)) : big.Int.prototype.Sub.call($.pointerValue<big.Int>(a), a, big.NewInt(3n)))
		let b = big.Int.prototype.Exp.call($.pointerValue<big.Int>(new big.Int()), big.NewInt(3n), big.NewInt($.int64(k * 40)), null)
		let fast = big.Int.prototype.Mul.call($.pointerValue<big.Int>(new big.Int()), a, b)
		await $.println(k, $.sliceLen((fast !== null && (fast as any).__isVarRef !== true && (fast as any).__goValue === undefined ? ((fast as any) as big.Int).Bits() : big.Int.prototype.Bits.call($.pointerValue<big.Int>(fast)))), (fast !== null && (fast as any).__isVarRef !== true && (fast as any).__goValue === undefined ? ((fast as any) as big.Int).Cmp(slowMul(a, b)) : big.Int.prototype.Cmp.call($.pointerValue<big.Int>(fast), slowMul(a, b))))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
