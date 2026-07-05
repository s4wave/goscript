import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  Compiler,
  FuncForPC,
  Gosched,
  MemStats,
  ReadMemStats,
  ReadTrace,
  SetFinalizer,
  StartTrace,
  StopTrace,
} from './runtime.js'

describe('runtime override', () => {
  it('exposes stack and trace compatibility helpers', () => {
    expect(Compiler).toBe('gc')
    expect(FuncForPC(0)).toBeNull()
    expect(StartTrace()?.Error()).toBe(
      'runtime: execution tracing is unsupported in GoScript',
    )
    expect(ReadTrace()).toBeNull()
    expect(() => StopTrace()).not.toThrow()
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
  })
})
