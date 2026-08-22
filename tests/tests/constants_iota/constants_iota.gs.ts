// Generated file based on constants_iota.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ByteSize = number

export type Direction = number

export const KB: ByteSize = 1024

export const MB: ByteSize = 1048576

export const GB: ByteSize = 1073741824

export const TB: ByteSize = 1099511627776

export const North: Direction = 0

export const East: Direction = 1

export const South: Direction = 2

export const West: Direction = 3

export const Red: number = 0

export const Green: number = 1

export const Blue: number = 2

export const Sunday: number = 0

export const Monday: number = 1

export const Tuesday: number = 2

export const Wednesday: number = 3

export const Thursday: number = 4

export const Friday: number = 5

export const Saturday: number = 6

export const First: number = 1

export const Second: number = 2

export const Third: number = 3

export const A: number = 0

export const B: number = 2

export const C: number = 4

export async function main(): globalThis.Promise<void> {
	await $.println("ByteSize constants:")
	await $.println("KB:", $.int(1024))
	await $.println("MB:", $.int(1048576))
	await $.println("GB:", $.int(1073741824))
	await $.println("TB:", $.int(1099511627776))

	await $.println("Direction constants:")
	await $.println("North:", $.int(0))
	await $.println("East:", $.int(1))
	await $.println("South:", $.int(2))
	await $.println("West:", $.int(3))

	await $.println("Color constants:")
	await $.println("Red:", 0)
	await $.println("Green:", 1)
	await $.println("Blue:", 2)

	await $.println("Day constants:")
	await $.println("Sunday:", 0)
	await $.println("Monday:", 1)
	await $.println("Tuesday:", 2)
	await $.println("Wednesday:", 3)
	await $.println("Thursday:", 4)
	await $.println("Friday:", 5)
	await $.println("Saturday:", 6)

	await $.println("Arithmetic constants:")
	await $.println("First:", 1)
	await $.println("Second:", 2)
	await $.println("Third:", 3)

	await $.println("Multiplication constants:")
	await $.println("A:", 0)
	await $.println("B:", 2)
	await $.println("C:", 4)
}

if ($.isMainScript(import.meta)) {
	await main()
}
