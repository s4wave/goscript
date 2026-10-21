// Generated file based on float_constant_precedence.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as math from "@goscript/math/index.js"

export const third: number = 0.3333333333333333

export const negThird: number = -0.3333333333333333

export const twoThirds: number = 0.6666666666666666

export const negTenth: number = -0.1

export const smallRatio: number = 3.3333333333333333e-21

export async function main(): globalThis.Promise<void> {
	let x = 12.0
	let n = 5

	fmt.Println("div:", $.basicInterfaceValue(x / 0.3333333333333333, "float64"), $.basicInterfaceValue(x / -0.3333333333333333, "float64"), $.basicInterfaceValue(x / 0.6666666666666666, "float64"), $.basicInterfaceValue(x / -(-0.1), "float64"))
	fmt.Println("sub:", $.basicInterfaceValue(0.3333333333333333 - x, "float64"), $.basicInterfaceValue(-0.3333333333333333 - x, "float64"), $.basicInterfaceValue(x - 0.3333333333333333, "float64"), $.basicInterfaceValue(x - -0.3333333333333333, "float64"))
	fmt.Println("mul:", $.basicInterfaceValue(x * 0.3333333333333333, "float64"), $.basicInterfaceValue(0.3333333333333333 * x, "float64"), $.basicInterfaceValue(x * -0.3333333333333333, "float64"), $.basicInterfaceValue((x * 0.6666666666666666) * x, "float64"))
	fmt.Println("neg:", $.basicInterfaceValue(-x / 0.3333333333333333, "float64"), $.basicInterfaceValue(-(x / 0.3333333333333333), "float64"), $.basicInterfaceValue(-(x * -0.3333333333333333), "float64"), $.basicInterfaceValue(-x - -0.3333333333333333, "float64"), $.basicInterfaceValue(-x * -0.1, "float64"))
	fmt.Println("pow:", $.basicInterfaceValue(round(math.Pow(x, 0.3333333333333333)), "float64"), $.basicInterfaceValue(round(math.Pow(0.3333333333333333, 2)), "float64"), $.basicInterfaceValue(round(math.Pow(-0.1, 3)), "float64"), $.basicInterfaceValue(round(math.Pow(x, -0.3333333333333333)), "float64"))
	fmt.Println("call:", $.basicInterfaceValue(math.Sqrt(x * 0.3333333333333333), "float64"), $.basicInterfaceValue(math.Abs(-0.3333333333333333 * x), "float64"), $.basicInterfaceValue(math.Max(0.3333333333333333, x / 0.3333333333333333), "float64"))
	fmt.Println("shift:", $.basicInterfaceValue(($.intShl($.int(x / 0.3333333333333333), 2)), "float64"), $.basicInterfaceValue(globalThis.Number($.int64Bit(n)) / 0.3333333333333333, "float64"), $.basicInterfaceValue(($.intShr($.int(x * 0.3333333333333333), 1)), "float64"), $.basicInterfaceValue(x / (0.3333333333333333 * globalThis.Number(1099511627776)), "float64"))
	fmt.Println("small:", $.basicInterfaceValue(x / 3.3333333333333333e-21, "float64"), $.basicInterfaceValue(3.3333333333333333e-21 * x, "float64"))
	fmt.Println("cmp:", (x * 0.3333333333333333) < 4.01, (x / 0.3333333333333333) == 36, (x - 0.3333333333333333) > 11)
	fmt.Println("mix:", $.basicInterfaceValue((x + 0.3333333333333333) / (x - 0.3333333333333333), "float64"), $.basicInterfaceValue((x / 0.3333333333333333) / 0.3333333333333333, "float64"), $.basicInterfaceValue(x / (1 / 0.3333333333333333), "float64"))
}

export function round(v: number): number {
	return math.Round(v * 1e9) / 1e9
}

if ($.isMainScript(import.meta)) {
	await main()
}
