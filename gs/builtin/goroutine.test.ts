import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { GoroutineFatal } from './goroutine.js'

type Builtin = typeof import('./index.js')

// load imports a fresh runtime, so the dead state of one case does not leak
// into the next, and records the failures its fatal handler receives.
async function load(): Promise<{ $: Builtin; fatals: GoroutineFatal[] }> {
  vi.resetModules()
  const $ = await import('./index.js')
  const fatals: GoroutineFatal[] = []
  $.setFatalHandler((fatal) => fatals.push(fatal))
  return { $, fatals }
}

// settle lets queued goroutines run and their failures be reported.
function settle(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 10))
}

describe('goroutine failures', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('ends the program with the panic text when a goroutine panics', async () => {
    const { $, fatals } = await load()
    const ran: string[] = []

    $.go(() => {
      $.panic('boom')
    })
    await settle()
    $.go(() => {
      ran.push('after')
    })
    await settle()

    expect(fatals).toHaveLength(1)
    expect(fatals[0].exitCode).toBe(2)
    expect(fatals[0].goroutine).toBe(2)
    expect(fatals[0].message).toMatch(
      /^panic: boom\n\ngoroutine 2 \[running\]:/,
    )
    expect(ran).toEqual([])
  })

  it('keeps running when a deferred recover stops the panic', async () => {
    const { $, fatals } = await load()
    let value: unknown = null

    $.go(async () => {
      const __defer = new $.AsyncDisposableStack()
      try {
        __defer.defer(() => {
          value = $.recover()
        })
        $.panic('handled')
        await __defer.dispose()
      } catch (e) {
        await __defer.disposePanic(e)
        if (!$.recovered(e)) {
          throw e
        }
      }
    })
    await settle()

    expect(value).toBe('handled')
    expect(fatals).toEqual([])
    expect($.numGoroutine()).toBe(1)
  })

  it('ends the program when an awaited rejection escapes a goroutine', async () => {
    const { $, fatals } = await load()

    $.go(async () => {
      await Promise.reject(
        new DOMException(
          'Data provided does not meet requirements',
          'DataError',
        ),
      )
    })
    await settle()

    expect(fatals).toHaveLength(1)
    expect(fatals[0].message).toMatch(
      /^panic: DataError: Data provided does not meet requirements\n\ngoroutine 2 \[running\]:/,
    )
  })

  it('ends only the goroutine on runtime.Goexit', async () => {
    const { $, fatals } = await load()
    const { Goexit } = await import('../runtime/runtime.js')
    const ran: string[] = []

    $.go(() => {
      Goexit()
    })
    await settle()
    $.go(() => {
      ran.push('after')
    })
    await settle()

    expect(fatals).toEqual([])
    expect(ran).toEqual(['after'])
    expect($.numGoroutine()).toBe(1)
  })

  it('exits 2 with the report on standard error by default in a JavaScript runtime', () => {
    const entry = fileURLToPath(new URL('./index.ts', import.meta.url))
    const script = `const $ = await import(${JSON.stringify(entry)}); $.go(() => $.panic('boom'))`
    const run = spawnSync('bun', ['-e', script], { encoding: 'utf8' })

    expect(run.status).toBe(2)
    expect(run.stderr).toMatch(/^panic: boom\n\ngoroutine 2 \[running\]:/)
  })
})
