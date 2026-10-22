// Generated file based on package_import_syscall.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as netip from "@goscript/net/netip/index.js"
import * as os from "@goscript/os/index.js"
import * as syscall from "@goscript/syscall/index.js"
import type * as sync from "@goscript/sync/index.js"
import * as __goscript_stat_js from "./stat_js.gs.ts"
import "@goscript/os/index.js"

export async function main(): globalThis.Promise<void> {
	syscall.CloseOnExec(1)
	{
		let err = syscall.SetNonblock(1, true)
		if (err != null) {
			fmt.Println("set true:", (err as any))
			return
		}
	}
	{
		let err = syscall.SetNonblock(1, false)
		if (err != null) {
			fmt.Println("set false:", (err as any))
			return
		}
	}
	if ((1 as number) != 0) {
		fmt.Println("cloexec supported")
	}
	fmt.Println("signals:", $.basicInterfaceValue(syscall.SIGINT, "int"), $.basicInterfaceValue(syscall.SIGKILL, "int"), $.basicInterfaceValue(syscall.SIGTERM, "int"))
	let sig: os.Signal | null = $.namedValueInterfaceValue<os.Signal | null>(syscall.SIGTERM, "syscall.Signal", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2())
	void (__goscriptAwait = (sig !== null && (sig as any).__isVarRef !== true && ((sig as any).__goValue === undefined || (sig as any).__goType?.charCodeAt(0) !== 42) ? (sig as Exclude<os.Signal, null>) : $.pointerValue<Exclude<os.Signal, null>>(sig)).Signal(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	fmt.Println("signal named:", !$.stringEqual((__goscriptAwait = (sig !== null && (sig as any).__isVarRef !== true && ((sig as any).__goValue === undefined || (sig as any).__goType?.charCodeAt(0) !== 42) ? (sig as Exclude<os.Signal, null>) : $.pointerValue<Exclude<os.Signal, null>>(sig)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), ""))
	{
		let err = syscall.Kill(1, 3)
		if (err == null) {
			fmt.Println("kill unexpectedly succeeded")
		} else {
			fmt.Println("kill:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		}
	}
	if (false) {
		let st = $.varRef($.markAsStructValue(new syscall.Stat_t()))
		let buf: $.Slice<number> = null! as $.Slice<number>
		let iovecs: $.Slice<syscall.Iovec> = null! as $.Slice<syscall.Iovec>
		syscall.Accept(-1)
		syscall.Close(-1)
		syscall.Dup(-1)
		syscall.Fchdir(-1)
		syscall.Fchmod(-1, 0)
		syscall.Fchown(-1, 0, 0)
		syscall.Fstat(-1, st)
		syscall.Fsync(-1)
		syscall.Ftruncate(-1, 0n)
		syscall.Pread(-1, buf, 0n)
		syscall.Pwrite(-1, buf, 0n)
		syscall.Read(-1, buf)
		syscall.ReadDirent(-1, buf)
		syscall.Recvfrom(-1, buf, 0)
		syscall.Recvmsg(-1, buf, buf, 0)
		syscall.Seek(-1, 0n, 0)
		syscall.SendmsgN(-1, buf, buf, null, 0)
		syscall.Sendto(-1, buf, 0, null)
		syscall.Shutdown(-1, 0)
		syscall.Write(-1, buf)
		syscall.F_DUPFD_CLOEXEC
		$.pointerValue<sync.RWMutex>(syscall.ForkLock)
		iovecs
		let attr = new syscall.SysProcAttr()
		attr
	}
	fmt.Println("stat:", __goscript_stat_js.statCtime())

	let sa4 = $.markAsStructValue(new syscall.SockaddrInet4())
	let addr4 = netip.AddrFrom4($.cloneArrayValue(sa4.Addr, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4)))
	$.assignFieldValue(sa4.Addr, addr4.As4(), __goscriptStatic3())

	let sa6 = $.markAsStructValue(new syscall.SockaddrInet6())
	let addr6 = netip.AddrFrom16($.cloneArrayValue(sa6.Addr, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 16)))
	$.assignFieldValue(sa6.Addr, addr6.As16(), __goscriptStatic4())

	fmt.Println("set nonblock ok")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({Signal: (receiver: any) => (syscall.Signal_Signal as any)(($.isVarRef(receiver) ? receiver.value : receiver)), String: (receiver: any) => (syscall.Signal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.basicType("int", "syscall.Signal"))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ([$.methodSignature("Signal"), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 16))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}
