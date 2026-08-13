import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { NewExitError, VmModuleConfig } from '../runtime.js'
import { New } from './browser.js'

const importedIncrementModule = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x06, 0x01, 0x60, 0x01,
  0x7f, 0x01, 0x7f, 0x02, 0x0c, 0x01, 0x03, 0x65, 0x6e, 0x76, 0x04, 0x68, 0x6f,
  0x73, 0x74, 0x00, 0x00, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x72,
  0x75, 0x6e, 0x00, 0x01, 0x0a, 0x08, 0x01, 0x06, 0x00, 0x41, 0x29, 0x10, 0x00,
  0x0b,
])

const duplicateHostImportModule = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x0b, 0x02, 0x60, 0x01,
  0x7f, 0x01, 0x7f, 0x60, 0x01, 0x7e, 0x01, 0x7e, 0x02, 0x17, 0x02, 0x03, 0x65,
  0x6e, 0x76, 0x04, 0x68, 0x6f, 0x73, 0x74, 0x00, 0x00, 0x03, 0x65, 0x6e, 0x76,
  0x04, 0x68, 0x6f, 0x73, 0x74, 0x00, 0x01, 0x07, 0x11, 0x02, 0x05, 0x72, 0x75,
  0x6e, 0x33, 0x32, 0x00, 0x00, 0x05, 0x72, 0x75, 0x6e, 0x36, 0x34, 0x00, 0x01,
])

const i64IdentityModule = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x06, 0x01, 0x60, 0x01,
  0x7e, 0x01, 0x7e, 0x03, 0x02, 0x01, 0x00, 0x07, 0x08, 0x01, 0x04, 0x69, 0x64,
  0x36, 0x34, 0x00, 0x00, 0x0a, 0x06, 0x01, 0x04, 0x00, 0x20, 0x00, 0x0b,
])

const f32IdentityModule = i64IdentityModule.map((value) =>
  value === 0x7e ? 0x7d : value,
)
const f64IdentityModule = i64IdentityModule.map((value) =>
  value === 0x7e ? 0x7c : value,
)

const importedI64Module = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x06, 0x01, 0x60, 0x01,
  0x7e, 0x01, 0x7e, 0x02, 0x0c, 0x01, 0x03, 0x65, 0x6e, 0x76, 0x04, 0x68, 0x6f,
  0x73, 0x74, 0x00, 0x00, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x72,
  0x75, 0x6e, 0x00, 0x01, 0x0a, 0x08, 0x01, 0x06, 0x00, 0x20, 0x00, 0x10, 0x00,
  0x0b,
])

async function instantiate(
  wasm: Uint8Array,
  hostFunction?: (
    ctx: null,
    instance: unknown,
    stack: $.Slice<bigint>,
  ) => $.GoError | Promise<$.GoError>,
) {
  const [module, compileErr] = await New().Compile(null, wasm)
  expect(compileErr).toBeNull()
  expect(module).not.toBeNull()

  const hostFunctions =
    hostFunction ? new Map([['env.host', hostFunction]]) : null
  const [instance, instantiateErr] = await module!.Instantiate(
    null,
    new VmModuleConfig({ HostFunctions: hostFunctions }),
  )
  expect(instantiateErr).toBeNull()
  expect(instance).not.toBeNull()
  return instance!
}

describe('browser WASM host function contract', () => {
  it('passes i32 stack values as bigint and returns error tuples', async () => {
    const instance = await instantiate(
      importedIncrementModule,
      (_ctx, instance, stack) => {
        expect(instance).not.toBeNull()
        expect(stack?.[0]).toBe(41n)
        if (stack) stack[0] = 42n
        return null
      },
    )

    const [results, callErr] = await instance.Call(null, 'run')
    expect(callErr).toBeNull()
    expect(results).toEqual([42n])
  })

  it('supports duplicate host imports with different signatures', async () => {
    const i64Value = 0xf123456789abcdefn
    const instance = await instantiate(
      duplicateHostImportModule,
      (_ctx, _instance, stack) => {
        if (stack) stack[0] += 1n
        return null
      },
    )

    const [i32Results, i32Err] = await instance.Call(null, 'run32', 41n)
    expect(i32Err).toBeNull()
    expect(i32Results).toEqual([42n])

    const [i64Results, i64Err] = await instance.Call(null, 'run64', i64Value)
    expect(i64Err).toBeNull()
    expect(i64Results).toEqual([i64Value + 1n])
  })

  it('preserves i64 arguments and results beyond Number precision', async () => {
    const value = 0xf123456789abcdefn
    const identity = await instantiate(i64IdentityModule)
    const [identityResults, identityErr] = await identity.Call(
      null,
      'id64',
      value,
    )
    expect(identityErr).toBeNull()
    expect(identityResults).toEqual([value])

    const imported = await instantiate(
      importedI64Module,
      (_ctx, _inst, stack) => {
        expect(stack?.[0]).toBe(value)
        if (stack) stack[0] ^= 0x00ff000000000000n
        return null
      },
    )
    const [importedResults, importedErr] = await imported.Call(
      null,
      'run',
      value,
    )
    expect(importedErr).toBeNull()
    expect(importedResults).toEqual([value ^ 0x00ff000000000000n])
  })

  it('preserves f32 and f64 stack representations', async () => {
    const f32 = await instantiate(f32IdentityModule)
    const [f32Results, f32Err] = await f32.Call(null, 'id64', 0x3fc00000n)
    expect(f32Err).toBeNull()
    expect(f32Results).toEqual([0x3fc00000n])

    const f64 = await instantiate(f64IdentityModule)
    const [f64Results, f64Err] = await f64.Call(
      null,
      'id64',
      0x400921fb54442d18n,
    )
    expect(f64Err).toBeNull()
    expect(f64Results).toEqual([0x400921fb54442d18n])
  })

  it('preserves synchronous Go host errors and ExitError identity', async () => {
    const goErr = $.newError('concrete host failure')!
    const goErrorInstance = await instantiate(
      importedIncrementModule,
      () => goErr,
    )
    const [, callErr] = await goErrorInstance.Call(null, 'run')
    expect(callErr).toBe(goErr)
    expect(callErr?.Error()).toBe('concrete host failure')

    const exitErr = NewExitError(23)
    const exitInstance = await instantiate(
      importedIncrementModule,
      () => exitErr,
    )
    const [, exitCallErr] = await exitInstance.Call(null, 'run')
    expect(exitCallErr).toBe(exitErr)
    expect(exitCallErr?.Error()).toBe('exit: 23')
    expect((exitCallErr as typeof exitErr).ExitCode()).toBe(23)
  })

  it('rejects Promise-valued host functions', async () => {
    const instance = await instantiate(
      importedIncrementModule,
      async () => null,
    )
    const [, callErr] = await instance.Call(null, 'run')
    expect(callErr?.Error()).toContain('asynchronous WebAssembly host function')
  })

  it('returns a Go error for a nil module config', async () => {
    const [module, compileErr] = await New().Compile(
      null,
      importedIncrementModule,
    )
    expect(compileErr).toBeNull()

    const [instance, instantiateErr] = await module!.Instantiate(null, null)
    expect(instance).toBeNull()
    expect(instantiateErr?.Error()).toContain('nil pointer dereference')
  })
})
