// Generated file based on package_import_unicode.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unicode from "@goscript/unicode/index.js"
import "@goscript/unicode/index.js"

export async function main(): globalThis.Promise<void> {
	// Test character classification functions
	await $.println("Testing character classification:")

	// Test IsLetter
	await $.println("IsLetter('A'):", unicode.IsLetter(65))
	await $.println("IsLetter('1'):", unicode.IsLetter(49))

	// Test IsDigit
	await $.println("IsDigit('5'):", unicode.IsDigit(53))
	await $.println("IsDigit('a'):", unicode.IsDigit(97))

	// Test IsUpper
	await $.println("IsUpper('Z'):", unicode.IsUpper(90))
	await $.println("IsUpper('z'):", unicode.IsUpper(122))

	// Test IsLower
	await $.println("IsLower('b'):", unicode.IsLower(98))
	await $.println("IsLower('B'):", unicode.IsLower(66))

	// Test IsSpace
	await $.println("IsSpace(' '):", unicode.IsSpace(32))
	await $.println("IsSpace('x'):", unicode.IsSpace(120))

	// Test IsPunct
	await $.println("IsPunct('!'):", unicode.IsPunct(33))
	await $.println("IsPunct('a'):", unicode.IsPunct(97))

	// Test case conversion functions
	await $.println("\nTesting case conversion:")

	// Test ToUpper
	await $.println("ToUpper('a'):", String.fromCodePoint(unicode.ToUpper(97)))
	await $.println("ToUpper('Z'):", String.fromCodePoint(unicode.ToUpper(90)))

	// Test ToLower
	await $.println("ToLower('A'):", String.fromCodePoint(unicode.ToLower(65)))
	await $.println("ToLower('z'):", String.fromCodePoint(unicode.ToLower(122)))

	// Test ToTitle
	await $.println("ToTitle('a'):", String.fromCodePoint(unicode.ToTitle(97)))

	// Test To function with constants
	await $.println("To(UpperCase, 'b'):", String.fromCodePoint(unicode.To(0, 98)))
	await $.println("To(LowerCase, 'C'):", String.fromCodePoint(unicode.To(1, 67)))

	// Test SimpleFold
	await $.println("SimpleFold('A'):", String.fromCodePoint(unicode.SimpleFold(65)))
	await $.println("SimpleFold('a'):", String.fromCodePoint(unicode.SimpleFold(97)))

	// Test constants
	await $.println("\nTesting constants:")
	await $.println("MaxRune:", 1114111)
	await $.println("Version:", unicode.Version)

	// Test range tables with Is function
	await $.println("\nTesting range tables:")
	await $.println("Is(Letter, 'A'):", unicode.Is(unicode.Letter, 65))
	await $.println("Is(Letter, '1'):", unicode.Is(unicode.Letter, 49))
	await $.println("Is(Digit, '5'):", unicode.Is(unicode.Digit, 53))
	await $.println("Is(Digit, 'x'):", unicode.Is(unicode.Digit, 120))

	// Test In function
	await $.println("In('A', Letter, Digit):", unicode.In(65, unicode.Letter, unicode.Digit))
	await $.println("In('5', Letter, Digit):", unicode.In(53, unicode.Letter, unicode.Digit))
	await $.println("In('!', Letter, Digit):", unicode.In(33, unicode.Letter, unicode.Digit))

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
