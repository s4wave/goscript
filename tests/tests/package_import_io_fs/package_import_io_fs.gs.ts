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
	await $.println("ModeDir:", $.int(fs.ModeDir))
	await $.println("ModeAppend:", $.int(fs.ModeAppend))
	await $.println("ModeExclusive:", $.int(fs.ModeExclusive))
	await $.println("ModeTemporary:", $.int(fs.ModeTemporary))
	await $.println("ModeSymlink:", $.int(fs.ModeSymlink))
	await $.println("ModeDevice:", $.int(fs.ModeDevice))
	await $.println("ModeNamedPipe:", $.int(fs.ModeNamedPipe))
	await $.println("ModeSocket:", $.int(fs.ModeSocket))
	await $.println("ModeSetuid:", $.int(fs.ModeSetuid))
	await $.println("ModeSetgid:", $.int(fs.ModeSetgid))
	await $.println("ModeCharDevice:", $.int(fs.ModeCharDevice))
	await $.println("ModeSticky:", $.int(fs.ModeSticky))
	await $.println("ModeIrregular:", $.int(fs.ModeIrregular))
	await $.println("ModeType:", $.int(fs.ModeType))
	await $.println("ModePerm:", $.int(fs.ModePerm))

	// Test FileMode methods
	let mode = $.uint(fs.ModeDir | 0o755, 32)
	await $.println("FileMode.IsDir():", fs.FileMode_IsDir(mode))
	await $.println("FileMode.IsRegular():", fs.FileMode_IsRegular(mode))
	await $.println("FileMode.Perm():", $.int(fs.FileMode_Perm(mode)))
	await $.println("FileMode.Type():", $.int(fs.FileMode_Type(mode)))
	await $.println("FileMode.String():", fs.FileMode_String(mode))

	let regularMode = $.uint(0o644, 32)
	await $.println("Regular file IsDir():", fs.FileMode_IsDir(regularMode))
	await $.println("Regular file IsRegular():", fs.FileMode_IsRegular(regularMode))

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
