// Generated file based on package_import_io_fs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fs from "@goscript/io/fs/index.js"
import "@goscript/io/fs/index.js"

export async function main(): globalThis.Promise<void> {
	// Test ValidPath function
	let valid1 = fs.ValidPath("hello/world.txt")
	await $.println("ValidPath('hello/world.txt'):", valid1)

	let valid2 = fs.ValidPath("../invalid")
	await $.println("ValidPath('../invalid'):", valid2)

	let valid3 = fs.ValidPath(".")
	await $.println("ValidPath('.'):", valid3)

	let valid4 = fs.ValidPath("")
	await $.println("ValidPath(''):", valid4)

	// Test error constants
	await $.println("ErrInvalid:", await $.pointerValue<Exclude<$.GoError, null>>(fs.ErrInvalid).Error())
	await $.println("ErrNotExist:", await $.pointerValue<Exclude<$.GoError, null>>(fs.ErrNotExist).Error())
	await $.println("ErrExist:", await $.pointerValue<Exclude<$.GoError, null>>(fs.ErrExist).Error())
	await $.println("ErrPermission:", await $.pointerValue<Exclude<$.GoError, null>>(fs.ErrPermission).Error())
	await $.println("ErrClosed:", await $.pointerValue<Exclude<$.GoError, null>>(fs.ErrClosed).Error())

	// Test all FileMode constants
	await $.println("ModeDir:", 2147483648)
	await $.println("ModeAppend:", 1073741824)
	await $.println("ModeExclusive:", 536870912)
	await $.println("ModeTemporary:", 268435456)
	await $.println("ModeSymlink:", 134217728)
	await $.println("ModeDevice:", 67108864)
	await $.println("ModeNamedPipe:", 33554432)
	await $.println("ModeSocket:", 16777216)
	await $.println("ModeSetuid:", 8388608)
	await $.println("ModeSetgid:", 4194304)
	await $.println("ModeCharDevice:", 2097152)
	await $.println("ModeSticky:", 1048576)
	await $.println("ModeIrregular:", 524288)
	await $.println("ModeType:", 2401763328)
	await $.println("ModePerm:", 511)

	// Test FileMode methods
	let mode = 2147484141
	await $.println("FileMode.IsDir():", fs.FileMode_IsDir(mode))
	await $.println("FileMode.IsRegular():", fs.FileMode_IsRegular(mode))
	await $.println("FileMode.Perm():", $.int(fs.FileMode_Perm(mode)))
	await $.println("FileMode.Type():", $.int(fs.FileMode_Type(mode)))
	await $.println("FileMode.String():", fs.FileMode_String(mode))

	let regularMode = 420
	await $.println("Regular file IsDir():", fs.FileMode_IsDir(regularMode))
	await $.println("Regular file IsRegular():", fs.FileMode_IsRegular(regularMode))

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
