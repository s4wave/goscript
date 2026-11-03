import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  Caller,
  Compiler,
  FuncForPC,
  Gosched,
  MemStats,
  NumCgoCall,
  ReadMemStats,
  ReadTrace,
  SetBlockProfileRate,
  SetCPUProfileRate,
  SetDefaultGOMAXPROCS,
  SetMutexProfileFraction,
  SetFinalizer,
  Stack,
  StartTrace,
  StopTrace,
} from './runtime.js'

describe('runtime override', () => {
  it('copies a stack into the caller buffer within its bounds', () => {
    const buffer = new Uint8Array(8)
    expect(Stack(buffer, false)).toBe(8)
    expect(new TextDecoder().decode(buffer)).toMatch(/^Error/)
    expect(Stack(null, true)).toBe(0)
  })

  it('exposes stack and trace compatibility helpers', () => {
    expect(Compiler).toBe('gc')
    expect(FuncForPC(0)).toBeNull()
    expect(StartTrace()?.Error()).toBe(
      'runtime: execution tracing is unsupported in GoScript',
    )
    expect(ReadTrace()).toBeNull()
    expect(() => StopTrace()).not.toThrow()
  })

  it('reports the Go positions of a chain of call sites', () => {
    // The chain of a caller of a marked function, a marked function and the
    // call of Caller in it reports each frame's Go file and line.
    const user: $.CallSite = { file: 'example.com/app/main.go', line: 12 }
    const add: $.CallSite = {
      file: 'example.com/ui/plan.go',
      line: 30,
      caller: user,
    }
    const site: $.CallSite = {
      file: 'example.com/ui/plan.go',
      line: 40,
      caller: add,
    }
    expect(Caller(0, site).slice(1)).toEqual([
      'example.com/ui/plan.go',
      40,
      true,
    ])
    expect(Caller(2, site).slice(1)).toEqual([
      'example.com/app/main.go',
      12,
      true,
    ])
    const [pc] = Caller(2, site)
    expect(FuncForPC(pc)?.FileLine(pc)).toEqual(['example.com/app/main.go', 12])

    // A frame past the end of the chain comes from the JavaScript stack.
    const [, file, line, ok] = Caller(3, site)
    expect(file).not.toBe('example.com/app/main.go')
    expect(ok && line > 0).toBe(ok)
  })

  it('ignores finalizer registration and clearing', () => {
    const obj = {}
    expect(() => SetFinalizer(obj, () => {})).not.toThrow()
    expect(() => SetFinalizer(obj, null)).not.toThrow()
  })

  it('exposes heap and stack MemStats fields', () => {
    const stats = new MemStats()

    ReadMemStats($.varRef(stats))

    expect(stats.HeapAlloc).toBe(stats.Alloc)
    expect(stats.HeapSys).toBe(stats.Sys)
    expect(stats.HeapInuse).toBe(stats.Alloc)
    expect(stats.StackInuse).toBe(0)
    expect(stats.StackSys).toBe(0)
  })

  it('Gosched yields past an already-pending task boundary', async () => {
    // A task boundary queued before Gosched must run before Gosched resolves. A
    // microtask-based yield would resolve during the microtask drain, ahead of
    // that pending task; queueTask keeps Gosched on the same task queue so the
    // earlier work runs first.
    const order: string[] = []
    $.queueTask(() => order.push('pending-task'))
    await Gosched()
    order.push('after-gosched')
    expect(order).toEqual(['pending-task', 'after-gosched'])

    // A host check-phase callback must also run when yields keep posting work.
    // Reusing the message-port queue for both callbacks only proves FIFO there.
    if (typeof setImmediate !== 'undefined') {
      await new Promise<void>((resolve) => $.queueTask(resolve))
      const hostOrder: string[] = []
      const foreground = new Promise<void>((resolve) => {
        setImmediate(() => {
          hostOrder.push('foreground')
          resolve()
        })
      })
      await Gosched()
      hostOrder.push('after-gosched')
      await foreground
      expect(hostOrder).toEqual(['foreground', 'after-gosched'])
    }
  })

  it('keeps the profiling settings that have no effect', () => {
    expect(SetMutexProfileFraction(5)).toBe(0)
    expect(SetMutexProfileFraction(-1)).toBe(5)
    expect(SetMutexProfileFraction(0)).toBe(5)
    SetBlockProfileRate(1)
    SetCPUProfileRate(100)
    SetDefaultGOMAXPROCS()
    expect(NumCgoCall()).toBe(0n)
  })
})
