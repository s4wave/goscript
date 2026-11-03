import { describe, expect, it } from 'vitest'

import {
  ErrNotExist,
  IsExist,
  IsNotExist,
  IsPermission,
  NewSyscallError,
  PathError,
  SyscallError,
} from './error.gs.js'
import { newHostError } from './types_js.gs.js'

function hostError(code: string): Error {
  return Object.assign(new Error(code), { code })
}

describe('os error classification', () => {
  it('preserves syscall details and an asynchronous underlying error', async () => {
    // Wrap the actual supplied object without formatting it during construction.
    const inner = { Error: async () => 'deadline' }
    const wrapped = NewSyscallError('connect', inner)
    expect(wrapped).toBeInstanceOf(SyscallError)

    // The wrapper retains its fields and awaits its underlying message.
    const details = wrapped as SyscallError
    expect(details.Syscall).toBe('connect')
    expect(details.Unwrap()).toBe(inner)
    expect(await details.Error()).toBe('connect: deadline')
    expect(NewSyscallError('connect', null)).toBeNull()
  })

  it('unwraps path errors before comparing sentinel errors', () => {
    const err = new PathError({
      Err: ErrNotExist,
      Op: 'open',
      Path: 'missing',
    })

    expect(IsNotExist(err)).toBe(true)
    expect(IsExist(err)).toBe(false)
  })

  it('recognizes host filesystem error codes', () => {
    // Translate the host's missing, existing and permission error codes.
    expect(IsNotExist(newHostError(hostError('ENOENT')))).toBe(true)
    expect(IsNotExist(newHostError(hostError('ENOTDIR')))).toBe(true)
    expect(IsExist(newHostError(hostError('EEXIST')))).toBe(true)
    expect(IsPermission(newHostError(hostError('EACCES')))).toBe(true)
    expect(IsPermission(newHostError(hostError('EPERM')))).toBe(true)
  })

  it('does not treat unrelated host errors as filesystem sentinels', () => {
    expect(IsNotExist(newHostError(hostError('EIO')))).toBe(false)
    expect(IsExist(newHostError(hostError('EIO')))).toBe(false)
    expect(IsPermission(newHostError(hostError('EIO')))).toBe(false)
  })
})
