import * as $ from "@goscript/builtin/index.js";

// E https://oeis.org/A001113.
export let E: number = Math.E

// Pi https://oeis.org/A000796.
export let Pi: number = Math.PI

// Phi https://oeis.org/A001622.
export let Phi: number = 1.61803398874989484820458683436563811772030917980576286213544862

// Sqrt2 https://oeis.org/A002193.
export let Sqrt2: number = Math.SQRT2

// SqrtE https://oeis.org/A019774.
export let SqrtE: number = Math.sqrt(Math.E)

// SqrtPi https://oeis.org/A002161.
export let SqrtPi: number = Math.sqrt(Math.PI)

// SqrtPhi https://oeis.org/A139339.
export let SqrtPhi: number = Math.sqrt(1.61803398874989484820458683436563811772030917980576286213544862)

// Ln2 https://oeis.org/A002162.
export let Ln2: number = Math.LN2

export let Log2E: number = Math.LOG2E

// Ln10 https://oeis.org/A002392.
export let Ln10: number = Math.LN10

export let Log10E: number = Math.LOG10E

// MaxFloat32 3.40282346638528859811704183484516925440e+38.
export let MaxFloat32: number = 3.4028234663852886e+38

// SmallestNonzeroFloat32 1.401298464324817070923729583289916131280e-45.
export let SmallestNonzeroFloat32: number = 1.401298464324817e-45

// MaxFloat64 1.79769313486231570814527423731704356798070e+308.
export let MaxFloat64: number = Number.MAX_VALUE

// SmallestNonzeroFloat64 4.9406564584124654417656879286822137236505980e-324.
export let SmallestNonzeroFloat64: number = Number.MIN_VALUE

// 32 or 64
let intSize: number = (32 << ((~(0 as number) >> 63)))

// MaxInt32 or MaxInt64 depending on intSize.
export let MaxInt: number = 9223372036854775807

// MinInt32 or MinInt64 depending on intSize.
export let MinInt: number = -9223372036854775808

// MaxInt8 127.
export let MaxInt8: number = 127

// MinInt8 -128.
export let MinInt8: number = -128

// MaxInt16 32767.
export let MaxInt16: number = 32767

// MinInt16 -32768.
export let MinInt16: number = -32768

// MaxInt32 2147483647.
export let MaxInt32: number = 2147483647

// MinInt32 -2147483648.
export let MinInt32: number = -2147483648

// MaxInt64 9223372036854775807.
export let MaxInt64: number = 9223372036854775807

// MinInt64 -9223372036854775808.
export let MinInt64: number = -9223372036854775808

// MaxUint32 or MaxUint64 depending on intSize.
export let MaxUint: bigint = 0xFFFFFFFFFFFFFFFFn

// MaxUint8 255.
export let MaxUint8: number = 255

// MaxUint16 65535.
export let MaxUint16: number = 65535

// MaxUint32 4294967295.
export let MaxUint32: number = 4294967295

// MaxUint64 18446744073709551615.
export let MaxUint64: number | bigint = 0xFFFFFFFFFFFFFFFFn
