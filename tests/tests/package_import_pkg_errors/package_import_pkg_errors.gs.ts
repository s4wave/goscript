// Generated file based on package_import_pkg_errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/github.com/pkg/errors/index.js"
import "@goscript/github.com/pkg/errors/index.js"

export async function main(): globalThis.Promise<void> {
	// Test New
	let err1 = errors.New("basic error")
	await $.println("New error:", await $.pointerValue<Exclude<$.GoError, null>>(err1).Error())

	// Test Errorf
	let err2 = errors.Errorf("formatted error: %d", $.basicInterfaceValue(42, "int"))
	await $.println("Errorf error:", await $.pointerValue<Exclude<$.GoError, null>>(err2).Error())

	// Test WithStack
	let baseErr = errors.New("base error")
	let err3 = errors.WithStack($.pointerValueOrNil(baseErr)!)
	await $.println("WithStack error:", await $.pointerValue<Exclude<$.GoError, null>>(err3).Error())

	// Test Wrap
	let err4 = errors.Wrap($.pointerValueOrNil(baseErr)!, "wrapped message")
	await $.println("Wrap error:", await $.pointerValue<Exclude<$.GoError, null>>(err4).Error())

	// Test Wrapf
	let err5 = errors.Wrapf($.pointerValueOrNil(baseErr)!, "wrapped with format: %s", "test")
	await $.println("Wrapf error:", await $.pointerValue<Exclude<$.GoError, null>>(err5).Error())

	// Test WithMessage
	let err6 = errors.WithMessage($.pointerValueOrNil(baseErr)!, "additional message")
	await $.println("WithMessage error:", await $.pointerValue<Exclude<$.GoError, null>>(err6).Error())

	// Test WithMessagef
	let err7 = errors.WithMessagef($.pointerValueOrNil(baseErr)!, "additional formatted message: %d", $.basicInterfaceValue(123, "int"))
	await $.println("WithMessagef error:", await $.pointerValue<Exclude<$.GoError, null>>(err7).Error())

	// Test Cause
	let cause = errors.Cause($.pointerValueOrNil(err4)!)
	await $.println("Cause error:", await $.pointerValue<Exclude<$.GoError, null>>(cause).Error())

	// Test nil handling
	let nilErr = errors.WithStack(null)
	if (nilErr == null) {
		await $.println("WithStack with nil returns nil")
	}

	let nilWrap = errors.Wrap(null, "message")
	if (nilWrap == null) {
		await $.println("Wrap with nil returns nil")
	}

	let err: $.GoError = null! as $.GoError
	let nilWrapVar = errors.Wrap($.pointerValueOrNil(err)!, "message")
	if (nilWrapVar == null) {
		await $.println("Wrap with nil error variable returns nil")
	}

	// Test Go 1.13 error handling
	let unwrapped = errors.Unwrap($.pointerValueOrNil(err4)!)
	if (unwrapped != null) {
		await $.println("Unwrap error:", await $.pointerValue<Exclude<$.GoError, null>>(unwrapped).Error())
	}

	// Test Is
	if (errors.Is($.pointerValueOrNil(err4)!, $.pointerValueOrNil(baseErr)!)) {
		await $.println("Is check passed")
	}

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
