// Generated file based on sockoptip_stub.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import type * as os from "@goscript/os/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript__interface from "./interface.gs.js"

import * as __goscript_fd_fake from "./fd_fake.gs.js"

import * as __goscript_fd_js from "./fd_js.gs.js"

import type * as __goscript_ip from "./ip.gs.js"

import * as __goscript_mac from "./mac.gs.js"

import * as __goscript_net from "./net.gs.js"

import * as __goscript_net_fake from "./net_fake.gs.js"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.js"
import "@goscript/syscall/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./interface.gs.js"
import "./fd_fake.gs.js"
import "./fd_js.gs.js"
import "./mac.gs.js"
import "./net.gs.js"
import "./net_fake.gs.js"
import "./sockaddr_posix.gs.js"

export function setIPv4MulticastInterface(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, ifi: __goscript__interface.Interface | $.VarRef<__goscript__interface.Interface> | null): $.GoError {
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function setIPv4MulticastLoopback(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, v: boolean): $.GoError {
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function joinIPv4Group(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, ifi: __goscript__interface.Interface | $.VarRef<__goscript__interface.Interface> | null, ip: __goscript_ip.IP): $.GoError {
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function setIPv6MulticastInterface(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, ifi: __goscript__interface.Interface | $.VarRef<__goscript__interface.Interface> | null): $.GoError {
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function setIPv6MulticastLoopback(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, v: boolean): $.GoError {
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}

export function joinIPv6Group(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, ifi: __goscript__interface.Interface | $.VarRef<__goscript__interface.Interface> | null, ip: __goscript_ip.IP): $.GoError {
	return $.namedValueInterfaceValue<$.GoError>(syscall.ENOPROTOOPT, "syscall.Errno", {"Error": syscall.Errno_Error}, { kind: $.TypeKind.Basic, name: "uintptr", typeName: "syscall.Errno" })
}
