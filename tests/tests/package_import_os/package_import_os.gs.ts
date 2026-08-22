// Generated file based on package_import_os.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as fs from "@goscript/io/fs/index.js"
import "@goscript/os/index.js"
import "@goscript/io/fs/index.js"

export async function main(): globalThis.Promise<void> {
	{
		let [wd, err] = os.Getwd()
		if (err == null) {
			if (!$.stringEqual(wd, "")) {
				await $.println("Current working directory ok")
			}
		} else {
			await $.println("Error getting working directory:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
	}

	// Test Environment variables - these work
	os.Setenv("TEST_VAR", "test_value")
	await $.println("Set environment variable TEST_VAR")

	{
		let val = os.Getenv("TEST_VAR")
		if (!$.stringEqual(val, "")) {
			await $.println("Got environment variable TEST_VAR:", val)
		}
	}

	os.Unsetenv("TEST_VAR")
	{
		let val = os.Getenv("TEST_VAR")
		if ($.stringEqual(val, "")) {
			await $.println("Environment variable TEST_VAR unset successfully")
		}
	}

	// Test Hostname - works with mock data
	{
		let [hostname, err] = os.Hostname()
		if (err == null) {
			await $.println("Hostname:", hostname)
		} else {
			await $.println("Error getting hostname:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
	}

	let [n, err] = os.File.prototype.Write.call($.pointerValue<os.File>(os.Stdout), new Uint8Array([115, 116, 100, 111, 117, 116, 32, 119, 114, 105, 116, 101, 32, 119, 111, 114, 107, 115, 10]))
	if (err == null) {
		await $.println("Stdout write bytes:", n)
	} else {
		await $.println("Stdout write error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}

	let fileName = "os-runtime-file.txt"
	let writeErr = os.WriteFile(fileName, new Uint8Array([114, 117, 110, 116, 105, 109, 101, 32, 102, 105, 108, 101, 32, 99, 111, 110, 116, 101, 110, 116, 115]), $.uint(0o644, 32))
	if (writeErr == null) {
		await $.println("WriteFile ok")
	} else {
		await $.println("WriteFile error:", await $.pointerValue<Exclude<$.GoError, null>>(writeErr).Error())
	}

	{
		let __goscriptTuple0: any = os.ReadFile(fileName)
		let data: $.Slice<number> = __goscriptTuple0[0]
		let readErr = __goscriptTuple0[1]
		if (readErr == null) {
			await $.println("ReadFile data:", $.bytesToString(data))
		} else {
			await $.println("ReadFile error:", await $.pointerValue<Exclude<$.GoError, null>>(readErr).Error())
		}
	}

	{
		let [info, statErr] = os.Stat(fileName)
		if (statErr == null) {
			await $.println("Stat name:", await $.pointerValue<Exclude<fs.FileInfo, null>>(info).Name())
			await $.println("Stat size:", await $.pointerValue<Exclude<fs.FileInfo, null>>(info).Size())
		} else {
			await $.println("Stat error:", await $.pointerValue<Exclude<$.GoError, null>>(statErr).Error())
		}
	}

	let removeErr = os.Remove(fileName)
	if (removeErr == null) {
		await $.println("Remove ok")
	} else {
		await $.println("Remove error:", await $.pointerValue<Exclude<$.GoError, null>>(removeErr).Error())
	}

	{
		let [tempDir, __goscriptShadow0] = os.MkdirTemp("", "os-temp-dir-*")
		if (__goscriptShadow0 == null) {
			await $.println("MkdirTemp ok")
			os.RemoveAll(tempDir)
		} else {
			await $.println("MkdirTemp error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
		}
	}

	{
		let __goscriptTuple1: any = os.CreateTemp("", "os-temp-file-*")
		let tempFile: os.File | $.VarRef<os.File> | null = __goscriptTuple1[0]
		let __goscriptShadow1 = __goscriptTuple1[1]
		if (__goscriptShadow1 == null) {
			await $.println("CreateTemp ok")
			await $.println("CreateTemp name empty:", $.stringEqual(os.File.prototype.Name.call($.pointerValue<os.File>(tempFile)), ""))
			os.File.prototype.Close.call($.pointerValue<os.File>(tempFile))
			os.Remove(os.File.prototype.Name.call($.pointerValue<os.File>(tempFile)))
		} else {
			await $.println("CreateTemp error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow1).Error())
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
