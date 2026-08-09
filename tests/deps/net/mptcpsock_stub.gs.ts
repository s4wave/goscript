// Generated file based on mptcpsock_stub.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as poll from "@goscript/internal/poll/index.js"

import * as singleflight from "@goscript/internal/singleflight/index.js"

import type * as io from "@goscript/io/index.js"

import type * as netip from "@goscript/net/netip/index.js"

import type * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

import type * as dnsmessage from "@goscript/vendor/golang.org/x/net/dns/dnsmessage/index.js"

import * as __goscript__interface from "./interface.gs.js"

import * as __goscript_dial from "./dial.gs.js"

import type * as __goscript_dnsclient from "./dnsclient.gs.js"

import * as __goscript_dnsclient_unix from "./dnsclient_unix.gs.js"

import type * as __goscript_dnsconfig from "./dnsconfig.gs.js"

import * as __goscript_fd_fake from "./fd_fake.gs.js"

import * as __goscript_fd_js from "./fd_js.gs.js"

import * as __goscript_ip from "./ip.gs.js"

import type * as __goscript_iprawsock from "./iprawsock.gs.js"

import type * as __goscript_iprawsock_posix from "./iprawsock_posix.gs.js"

import * as __goscript_ipsock from "./ipsock.gs.js"

import * as __goscript_lookup from "./lookup.gs.js"

import * as __goscript_lookup_unix from "./lookup_unix.gs.js"

import * as __goscript_mac from "./mac.gs.js"

import * as __goscript_net from "./net.gs.js"

import * as __goscript_net_fake from "./net_fake.gs.js"

import * as __goscript_sockaddr_posix from "./sockaddr_posix.gs.js"

import * as __goscript_tcpsock from "./tcpsock.gs.js"

import * as __goscript_tcpsock_posix from "./tcpsock_posix.gs.js"

import type * as __goscript_tcpsock_unix from "./tcpsock_unix.gs.js"

import type * as __goscript_udpsock from "./udpsock.gs.js"

import type * as __goscript_udpsock_posix from "./udpsock_posix.gs.js"

import type * as __goscript_unixsock from "./unixsock.gs.js"

import type * as __goscript_unixsock_posix from "./unixsock_posix.gs.js"
import "@goscript/context/index.js"
import "@goscript/internal/poll/index.js"
import "@goscript/internal/singleflight/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./interface.gs.js"
import "./dial.gs.js"
import "./dnsclient_unix.gs.js"
import "./fd_fake.gs.js"
import "./fd_js.gs.js"
import "./ip.gs.js"
import "./ipsock.gs.js"
import "./lookup.gs.js"
import "./lookup_unix.gs.js"
import "./mac.gs.js"
import "./net.gs.js"
import "./net_fake.gs.js"
import "./sockaddr_posix.gs.js"
import "./tcpsock.gs.js"
import "./tcpsock_posix.gs.js"

export function isUsingMultipathTCP(fd: __goscript_fd_fake.netFD | $.VarRef<__goscript_fd_fake.netFD> | null): boolean {
	return false
}
