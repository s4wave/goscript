import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { New } from './browser.js'
import { NewExitError } from '../runtime.js'

function u32(value: number): number[] {
  const bytes: number[] = []
  do {
    let byte = value & 0x7f
    value >>>= 7
    if (value !== 0) byte |= 0x80
    bytes.push(byte)
  } while (value !== 0)
  return bytes
}

function name(value: string): number[] {
  const bytes = Array.from(new TextEncoder().encode(value))
  return [...u32(bytes.length), ...bytes]
}

function section(id: number, contents: number[]): number[] {
  return [id, ...u32(contents.length), ...contents]
}

function vector(entries: number[][]): number[] {
  return [...u32(entries.length), ...entries.flat()]
}

function moduleBytes(sections: number[][]): Uint8Array {
  return new Uint8Array([
    0x00,
    0x61,
    0x73,
    0x6d,
    0x01,
    0x00,
    0x00,
    0x00,
    ...sections.flat(),
  ])
}

const exitModule = moduleBytes([
  section(
    1,
    vector([
      [0x60, 0x01, 0x7f, 0x00],
      [0x60, 0x00, 0x00],
    ]),
  ),
  section(
    2,
    vector([
      [...name('wasi_snapshot_preview1'), ...name('proc_exit'), 0x00, 0x00],
    ]),
  ),
  section(3, vector([[0x01]])),
  section(7, vector([[...name('_start'), 0x00, 0x01]])),
  section(10, vector([[0x06, 0x00, 0x41, 0x00, 0x10, 0x00, 0x0b]])),
])

const abiModule = moduleBytes([
  section(
    1,
    vector([
      [0x60, 0x01, 0x7e, 0x01, 0x7e],
      [0x60, 0x01, 0x7f, 0x01, 0x7f],
    ]),
  ),
  section(2, vector([[...name('env'), ...name('i64_id'), 0x00, 0x00]])),
  section(3, vector([[0x00], [0x01], [0x00]])),
  section(
    6,
    vector([
      [0x7f, 0x01, 0x41, 0x00, 0x0b],
      [0x7e, 0x01, 0x42, 0x00, 0x0b],
    ]),
  ),
  section(
    7,
    vector([
      [...name('identity64'), 0x00, 0x01],
      [...name('identity32'), 0x00, 0x02],
      [...name('import64'), 0x00, 0x03],
      [...name('global32'), 0x03, 0x00],
      [...name('global64'), 0x03, 0x01],
    ]),
  ),
  section(
    10,
    vector([
      [0x04, 0x00, 0x20, 0x00, 0x0b],
      [0x04, 0x00, 0x20, 0x00, 0x0b],
      [0x06, 0x00, 0x20, 0x00, 0x10, 0x00, 0x0b],
    ]),
  ),
])

const i32ImportModule = moduleBytes([
  section(1, vector([[0x60, 0x01, 0x7f, 0x01, 0x7f]])),
  section(2, vector([[...name('env'), ...name('i32_id'), 0x00, 0x00]])),
  section(3, vector([[0x00]])),
  section(7, vector([[...name('import32'), 0x00, 0x01]])),
  section(10, vector([[0x06, 0x00, 0x20, 0x00, 0x10, 0x00, 0x0b]])),
])

const trapModule = moduleBytes([
  section(1, vector([[0x60, 0x00, 0x00]])),
  section(3, vector([[0x00]])),
  section(7, vector([[...name('trap'), 0x00, 0x00]])),
  section(10, vector([[0x03, 0x00, 0x00, 0x0b]])),
])

const linkErrorModule = moduleBytes([
  section(1, vector([[0x60, 0x00, 0x00]])),
  section(
    2,
    vector([
      [...name('env'), ...name('fn'), 0x00, 0x00],
      [...name('env'), ...name('memory'), 0x02, 0x00, 0x01],
    ]),
  ),
])

function moduleConfig(hostFunctions: Map<string, any> | null) {
  return {
    Name: 'test',
    Args: null,
    Env: null,
    Stdin: null,
    Stdout: null,
    Stderr: null,
    HostFunctions: hostFunctions,
  }
}

async function instantiate(
  bytes: Uint8Array,
  hostFunctions: Map<string, any> | null,
) {
  const [module, compileErr] = await New().Compile(null, bytes)
  expect(compileErr).toBeNull()
  const [instance, instantiateErr] = await module!.Instantiate(
    null,
    moduleConfig(hostFunctions),
  )
  expect(instantiateErr).toBeNull()
  return instance!
}

describe('WasiVM browser runtime override', () => {
  test('compiles only the visible Go byte slice', async () => {
    const backing = new Uint8Array(exitModule.length + 2)
    backing[0] = 0xff
    backing.set(exitModule, 1)
    backing[backing.length - 1] = 0xff

    const [module, err] = await New().Compile(
      null,
      $.goSlice(backing, 1, backing.length - 1),
    )
    expect(err).toBeNull()
    expect(module).not.toBeNull()
  })

  test('preserves i32 and i64 function, import, and global values', async () => {
    const wide = 0xfedcba9876543210n
    let calls = 0
    const instance = await instantiate(
      abiModule,
      new Map([
        [
          'env.i64_id',
          (_ctx: unknown, _instance: unknown, stack: bigint[]) => {
            calls++
            expect(stack[0]).toBe(wide)
            return null
          },
        ],
      ]),
    )

    await expect(instance.Call(null, 'identity64', wide)).resolves.toEqual([
      [wide],
      null,
    ])
    await expect(
      instance.Call(null, 'identity32', 0xffffffffn),
    ).resolves.toEqual([[0xffffffffn], null])
    await expect(instance.Call(null, 'import64', wide)).resolves.toEqual([
      [wide],
      null,
    ])
    expect(calls).toBe(1)

    const i32Instance = await instantiate(
      i32ImportModule,
      new Map([
        [
          'env.i32_id',
          (_ctx: unknown, _instance: unknown, stack: bigint[]) => {
            expect(stack[0]).toBe(0xffffffffn)
            return null
          },
        ],
      ]),
    )
    await expect(
      i32Instance.Call(null, 'import32', 0xffffffffn),
    ).resolves.toEqual([[0xffffffffn], null])

    const fn = instance.ExportedFunction('identity64')!
    await expect(fn.Call(null, wide)).resolves.toEqual([[wide], null])

    const global32 = instance.ExportedGlobal('global32')!
    global32.Set(0xffffffffn)
    expect(global32.Get()).toBe(0xffffffffn)
    const global64 = instance.ExportedGlobal('global64')!
    global64.Set(wide)
    expect(global64.Get()).toBe(wide)
  })

  test('maps only compile and link failures at their API boundaries', async () => {
    const [invalidModule, compileErr] = await New().Compile(
      null,
      new Uint8Array([0x00]),
    )
    expect(invalidModule).toBeNull()
    expect((compileErr as any)?.JsError).toBeInstanceOf(
      WebAssembly.CompileError,
    )

    const [module, err] = await New().Compile(null, linkErrorModule)
    expect(err).toBeNull()
    const [instance, instantiateErr] = await module!.Instantiate(
      null,
      moduleConfig(new Map([['env.fn', () => null]])),
    )
    expect(instance).toBeNull()
    expect((instantiateErr as any)?.JsError).toBeInstanceOf(
      WebAssembly.LinkError,
    )
  })

  test('returns ExitError identity and expected runtime traps from calls', async () => {
    const exitErr = NewExitError(7)
    const instance = await instantiate(
      exitModule,
      new Map([
        [
          'wasi_snapshot_preview1.proc_exit',
          () => {
            throw exitErr
          },
        ],
      ]),
    )
    const [results, callErr] = await instance.Call(null, '_start')
    expect(results).toBeNull()
    expect(callErr).toBe(exitErr)
    expect((callErr as any).ExitCode()).toBe(7)

    const trapInstance = await instantiate(trapModule, null)
    const [trapResults, trapErr] = await trapInstance.Call(null, 'trap')
    expect(trapResults).toBeNull()
    expect((trapErr as any)?.JsError).toBeInstanceOf(WebAssembly.RuntimeError)
  })

  test.each([
    new TypeError('host type defect'),
    new RangeError('host range defect'),
    { programmer: true },
  ])('rethrows unrelated host exception %#', async (programmerError) => {
    const instance = await instantiate(
      abiModule,
      new Map([
        [
          'env.i64_id',
          () => {
            throw programmerError
          },
        ],
      ]),
    )
    await expect(instance.Call(null, 'import64', 1n)).rejects.toBe(
      programmerError,
    )
  })

  test('rejects declared and first-call asynchronous host functions', async () => {
    const [module, compileErr] = await New().Compile(null, abiModule)
    expect(compileErr).toBeNull()
    const [declaredInstance, admissionErr] = await module!.Instantiate(
      null,
      moduleConfig(new Map([['env.i64_id', async () => null]])),
    )
    expect(declaredInstance).toBeNull()
    expect(admissionErr?.Error()).toContain('asynchronous host function')

    const instance = await instantiate(
      abiModule,
      new Map([['env.i64_id', () => Promise.resolve(null)]]),
    )
    const [results, firstCallErr] = await instance.Call(null, 'import64', 1n)
    expect(results).toBeNull()
    expect(firstCallErr?.Error()).toContain('asynchronous host function')
  })
})
