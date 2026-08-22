// Generated file based on package_import_unicode.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unicode from "@goscript/unicode/index.js"
import "@goscript/unicode/index.js"

export async function main(): globalThis.Promise<void> {
	// Test character classification functions
	await $.println("Testing character classification:")

	// Test IsLetter
	await $.println("IsLetter('A'):", unicode.IsLetter($.int(65, 32)))
	await $.println("IsLetter('1'):", unicode.IsLetter($.int(49, 32)))

	// Test IsDigit
	await $.println("IsDigit('5'):", unicode.IsDigit($.int(53, 32)))
	await $.println("IsDigit('a'):", unicode.IsDigit($.int(97, 32)))

	// Test IsUpper
	await $.println("IsUpper('Z'):", unicode.IsUpper($.int(90, 32)))
	await $.println("IsUpper('z'):", unicode.IsUpper($.int(122, 32)))

	// Test IsLower
	await $.println("IsLower('b'):", unicode.IsLower($.int(98, 32)))
	await $.println("IsLower('B'):", unicode.IsLower($.int(66, 32)))

	// Test IsSpace
	await $.println("IsSpace(' '):", unicode.IsSpace($.int(32, 32)))
	await $.println("IsSpace('x'):", unicode.IsSpace($.int(120, 32)))

	// Test IsPunct
	await $.println("IsPunct('!'):", unicode.IsPunct($.int(33, 32)))
	await $.println("IsPunct('a'):", unicode.IsPunct($.int(97, 32)))

	// Test case conversion functions
	await $.println("\nTesting case conversion:")

	// Test ToUpper
	await $.println("ToUpper('a'):", String.fromCodePoint(unicode.ToUpper($.int(97, 32))))
	await $.println("ToUpper('Z'):", String.fromCodePoint(unicode.ToUpper($.int(90, 32))))

	// Test ToLower
	await $.println("ToLower('A'):", String.fromCodePoint(unicode.ToLower($.int(65, 32))))
	await $.println("ToLower('z'):", String.fromCodePoint(unicode.ToLower($.int(122, 32))))

	// Test ToTitle
	await $.println("ToTitle('a'):", String.fromCodePoint(unicode.ToTitle($.int(97, 32))))

	// Test To function with constants
	await $.println("To(UpperCase, 'b'):", String.fromCodePoint(unicode.To(unicode.UpperCase, $.int(98, 32))))
	await $.println("To(LowerCase, 'C'):", String.fromCodePoint(unicode.To(unicode.LowerCase, $.int(67, 32))))

	// Test SimpleFold
	await $.println("SimpleFold('A'):", String.fromCodePoint(unicode.SimpleFold($.int(65, 32))))
	await $.println("SimpleFold('a'):", String.fromCodePoint(unicode.SimpleFold($.int(97, 32))))

	// Test constants
	await $.println("\nTesting constants:")
	await $.println("MaxRune:", $.int(unicode.MaxRune, 32))
	await $.println("Version:", unicode.Version)

	// Test range tables with Is function
	await $.println("\nTesting range tables:")
	await $.println("Is(Letter, 'A'):", unicode.Is(unicode.Letter, $.int(65, 32)))
	await $.println("Is(Letter, '1'):", unicode.Is(unicode.Letter, $.int(49, 32)))
	await $.println("Is(Digit, '5'):", unicode.Is(unicode.Digit, $.int(53, 32)))
	await $.println("Is(Digit, 'x'):", unicode.Is(unicode.Digit, $.int(120, 32)))

	// Test In function
	await $.println("In('A', Letter, Digit):", unicode.In($.int(65, 32), unicode.Letter, unicode.Digit))
	await $.println("In('5', Letter, Digit):", unicode.In($.int(53, 32), unicode.Letter, unicode.Digit))
	await $.println("In('!', Letter, Digit):", unicode.In($.int(33, 32), unicode.Letter, unicode.Digit))

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
