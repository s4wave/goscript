import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  AF_INET,
  AF_INET6,
  AF_UNIX,
  Bind,
  Close,
  CloseOnExec,
  Connect,
  Dup,
  EADDRNOTAVAIL,
  EAGAIN,
  EINTR,
  EMFILE,
  ENOSYS,
  ENFILE,
  ENOTSUP,
  ETIMEDOUT,
  Errno_Error,
  Errno_Is,
  Errno_Temporary,
  Errno_Timeout,
  GetsockoptInt,
  Iovec,
  IPPROTO_IPV6,
  IPPROTO_TCP,
  IPV6_V6ONLY,
  Kill,
  Listen,
  Pread,
  Pwrite,
  Read,
  ReadDirent,
  Recvfrom,
  Recvmsg,
  Seek,
  SendmsgN,
  Sendto,
  SetReadDeadline,
  SetNonblock,
  SetsockoptInt,
  SetWriteDeadline,
  Shutdown,
  SOCK_SEQPACKET,
  SOMAXCONN,
  Socket,
  StopIO,
  Write,
  readv,
  writev,
} from './index.js'
import type { Errno } from './index.js'

describe('syscall network stubs', () => {
  test('exports network constants used by generated net', () => {
    // Match syscall/net_fake.go, which the compiler loads for js/wasm.
    expect(AF_UNIX).toBe(1)
    expect(AF_INET).toBe(2)
    expect(AF_INET6).toBe(3)

    // Keep the socket kind and option values in that same target domain.
    expect(SOCK_SEQPACKET).toBe(4)
    expect(IPPROTO_IPV6).toBe(0x29)
    expect(IPPROTO_TCP).toBe(6)
    expect(IPV6_V6ONLY).toBe(1)
    expect(SOMAXCONN).toBe(0x80)
    expect(ENOTSUP.Error()).toBe('operation not supported')
  })

  test('models Errno numeric zero values and named primitive methods', () => {
    // An addressable errno retains the underlying numeric representation.
    const errno: $.VarRef<Errno> = $.varRef(0)

    // Named methods classify the same error values exposed by the stubs.
    expect(Errno_Error(errno.value)).toBe('errno 0')
    expect(Errno_Is(EADDRNOTAVAIL, EADDRNOTAVAIL)).toBe(true)
    expect(Errno_Temporary(EINTR)).toBe(true)
    expect(Errno_Temporary(EMFILE)).toBe(true)
    expect(Errno_Temporary(ENFILE)).toBe(true)
    expect(Errno_Timeout(EAGAIN)).toBe(true)
    expect(Errno_Timeout(ETIMEDOUT)).toBe(true)
    expect(Errno_Timeout(EADDRNOTAVAIL)).toBe(false)
  })

  test('reports unsupported socket operations as syscall errors', () => {
    // Socket creation, binding and connection calls report unavailable I/O.
    expect(Socket(0, 0, 0)).toEqual([-1, ENOSYS])
    expect(Connect(-1, null)).toBe(ENOSYS)
    expect(Listen(-1, 0)).toBe(ENOSYS)
    expect(Bind(-1, null)).toBe(ENOSYS)
    expect(StopIO(-1)).toBe(ENOSYS)

    // Datagram send and receive calls preserve their error result shapes.
    expect(Recvfrom(-1, null, 0)).toEqual([0, null, ENOSYS])
    expect(Sendto(-1, null, 0, null)).toBe(ENOSYS)
    expect(Recvmsg(-1, null, null, 0)).toEqual([0, 0, 0, null, ENOSYS])
    expect(SendmsgN(-1, null, null, null, 0)).toEqual([0, ENOSYS])

    // Options and deadlines retain the js/wasm syscall stub contract.
    expect(GetsockoptInt(-1, 0, 0)).toEqual([0, ENOSYS])
    expect(SetsockoptInt(-1, 0, 0, 0)).toBeNull()
    expect(SetReadDeadline(-1, 0)).toBe(ENOSYS)
    expect(SetWriteDeadline(-1, 0)).toBe(ENOSYS)
    expect(Shutdown(-1, 0)).toBe(ENOSYS)
  })

  test('reports unsupported process operations as syscall errors', () => {
    // Killing a process stays unsupported on the JavaScript target.
    expect(Kill(123, 9)).toBe(ENOSYS)
  })

  test('exports JavaScript no-op descriptor flag helpers', () => {
    // Descriptor flags can be set without access to a native descriptor.
    expect(Close(1)).toBeNull()
    expect(CloseOnExec(1)).toBeUndefined()
    expect(SetNonblock(1, true)).toBeNull()
    expect(SetNonblock(1, false)).toBeNull()
  })

  test('exports unsupported descriptor operations', () => {
    // Reads, writes and seeks return their ordinary unsupported result.
    expect(Read(-1, null)).toEqual([0, ENOSYS])
    expect(ReadDirent(-1, null)).toEqual([0, ENOSYS])
    expect(Pread(-1, null, 0)).toEqual([0, ENOSYS])
    expect(Pwrite(-1, null, 0)).toEqual([0, ENOSYS])
    expect(Seek(-1, 0n, 0)).toEqual([0n, ENOSYS])
    expect(Write(-1, null)).toEqual([0, ENOSYS])

    // Duplication and vector I/O use the same unsupported boundary.
    expect(Dup(-1)).toEqual([0, ENOSYS])
    expect(readv(-1, [new Iovec()])).toEqual([0, ENOSYS])
    expect(writev(-1, [new Iovec()])).toEqual([0, ENOSYS])
  })
})
