// Generated file based on sendfile_stub.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import type * as os from "@goscript/os/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_fd_fake from "./fd_fake.gs.js"

import * as __goscript_fd_js from "./fd_js.gs.js"

import * as __goscript_net from "./net.gs.js"

import * as __goscript_net_fake from "./net_fake.gs.js"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.js"
import "@goscript/io/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./fd_fake.gs.js"
import "./fd_js.gs.js"
import "./net.gs.js"
import "./net_fake.gs.js"
import "./sockaddr_posix.gs.js"

export let testHookSupportsSendfile: (() => boolean | globalThis.Promise<boolean>) | null = null! as (() => boolean | globalThis.Promise<boolean>) | null

export function __goscript_set_testHookSupportsSendfile(__goscriptValue: (() => boolean | globalThis.Promise<boolean>) | null): void {
	testHookSupportsSendfile = __goscriptValue
}

export function supportsSendfile(): boolean {
	return false
}

export function sendFile(c: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null, r: io.Reader | null): [bigint, $.GoError, boolean] {
	let n: bigint = 0n
	let err: $.GoError = null! as $.GoError
	let handled: boolean = false
	return [0n, null, false]
}
