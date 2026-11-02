import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  Cond,
  Map,
  Mutex,
  Once,
  OnceFunc,
  OnceValue,
  OnceValues,
  Pool,
  RWMutex,
  WaitGroup,
} from './sync.js'

describe('sync.WaitGroup', () => {
  it('Go tracks scheduled work and unblocks Wait after completion', async () => {
    const wg = new WaitGroup()
    const events: string[] = []

    wg.Go(async () => {
      events.push('worker start')
      await Promise.resolve()
      events.push('worker done')
    })

    const wait = wg.Wait().then(() => {
      events.push('wait done')
    })

    expect(events).toEqual([])
    await wait
    expect(events).toEqual(['worker start', 'worker done', 'wait done'])
  })
})

describe('sync.Cond', () => {
  it('exposes the Locker as public field L', async () => {
    const mutex = new Mutex()
    const cond = new Cond({ L: mutex })

    expect(cond.L).toBe(mutex)
    await cond.L!.Lock()
    cond.L!.Unlock()
  })

  it('has a nil Locker as the zero value', () => {
    expect(new Cond().L).toBe(null)
  })
})

describe('sync.RWMutex', () => {
  it('exposes RLocker as a read-lock Locker', async () => {
    const rw = new RWMutex()
    const locker = rw.RLocker()

    await locker.Lock()
    locker.Unlock()
  })

  it('blocks new readers while a writer is waiting', async () => {
    const rw = new RWMutex()
    const events: string[] = []

    await rw.RLock()
    const writer = rw.Lock().then(() => {
      events.push('writer')
    })
    const reader = rw.RLock().then(() => {
      events.push('reader')
    })
    await Promise.resolve()

    expect(events).toEqual([])
    expect(rw.TryRLock()).toBe(false)

    rw.RUnlock()
    await writer
    expect(events).toEqual(['writer'])

    rw.Unlock()
    await reader
    expect(events).toEqual(['writer', 'reader'])
    rw.RUnlock()
  })
})

describe('sync.Once', () => {
  it('marks Do complete even when f panics', async () => {
    const once = new Once()
    let calls = 0

    // A sync f's panic propagates from Do directly.
    expect(() =>
      once.Do(() => {
        calls++
        throw new Error('boom')
      }),
    ).toThrow('boom')
    await once.Do(() => {
      calls++
    })

    expect(calls).toBe(1)
  })

  it('OnceFunc and OnceValue helpers replay the first panic', () => {
    let funcCalls = 0
    const fn = OnceFunc(() => {
      funcCalls++
      throw new Error('func panic')
    })

    expect(fn).toThrow('func panic')
    expect(fn).toThrow('func panic')
    expect(funcCalls).toBe(1)

    let valueCalls = 0
    const value = OnceValue(() => {
      valueCalls++
      throw new Error('value panic')
    })

    expect(value).toThrow('value panic')
    expect(value).toThrow('value panic')
    expect(valueCalls).toBe(1)

    let valuesCalls = 0
    const values = OnceValues(() => {
      valuesCalls++
      throw new Error('values panic')
    })

    expect(values).toThrow('values panic')
    expect(values).toThrow('values panic')
    expect(valuesCalls).toBe(1)
  })

  it('OnceValue helpers return the first successful result', async () => {
    // Synchronous callbacks retain their immediate return values.
    let valueCalls = 0
    const value = OnceValue(() => {
      valueCalls++
      return 'first'
    })
    let valuesCalls = 0
    const values = OnceValues(() => {
      valuesCalls++
      return ['left', 'right'] as [string, string]
    })

    expect(value()).toBe('first')
    expect(value()).toBe('first')
    expect(valueCalls).toBe(1)
    expect(values()).toEqual(['left', 'right'])
    expect(values()).toEqual(['left', 'right'])
    expect(valuesCalls).toBe(1)

    // Concurrent callers wait for one pending computation.
    let finish!: (value: number) => void
    let pendingCalls = 0
    const pending = OnceValue(() => {
      pendingCalls++
      return new Promise<number>((resolve) => {
        finish = resolve
      })
    })
    const first = pending()
    const second = pending()
    expect(pendingCalls).toBe(1)
    finish(42)
    expect(await first).toBe(42)
    expect(await second).toBe(42)
    expect(await pending()).toBe(42)

    // Each waiter can recover the same panic value independently.
    let fail!: (error: unknown) => void
    const rejected = OnceValue(
      () =>
        new Promise<void>((_resolve, reject) => {
          fail = reject
        }),
    )
    const caught = [
      Promise.resolve(rejected()).catch((err) => err),
      Promise.resolve(rejected()).catch((err) => err),
    ]
    fail(new $.GoPanic('shared panic'))
    const panics = await Promise.all(caught)
    for (const err of panics) {
      expect($.withRecoveringPanic(err, () => $.recover())).toBe('shared panic')
    }
    expect(panics[0]).not.toBe(panics[1])
  })
})

describe('sync.Map', () => {
  it('Clear deletes all entries', async () => {
    const m = new Map()

    await m.Store('first', 1)
    await m.Store('second', 2)
    await m.Clear()

    expect(await m.Load('first')).toEqual([undefined, false])
    expect(await m.Load('second')).toEqual([undefined, false])
  })

  it('CompareAndSwap swaps only matching entries', async () => {
    const m = new Map()

    await m.Store('key', 'value')
    expect(await m.CompareAndSwap('key', 'other', 'next')).toBe(false)
    expect(await m.Load('key')).toEqual(['value', true])
    expect(await m.CompareAndSwap('key', 'value', 'next')).toBe(true)
    expect(await m.Load('key')).toEqual(['next', true])
  })

  it('CompareAndDelete deletes only matching entries', async () => {
    const m = new Map()

    await m.Store('key', 'value')
    expect(await m.CompareAndDelete('key', 'other')).toBe(false)
    expect(await m.Load('key')).toEqual(['value', true])
    expect(await m.CompareAndDelete('key', 'value')).toBe(true)
    expect(await m.Load('key')).toEqual([undefined, false])
  })

  it('Range accepts generated async-shaped callbacks', async () => {
    const m = new Map()
    const visited: string[] = []

    await m.Store('a', 1)
    await m.Store('b', 2)
    await m.Range(async (key, value) => {
      visited.push(`${key}:${value}`)
      return key !== 'a'
    })

    expect(visited).toEqual(['a:1'])
  })

  it('Swap matches equivalent Go string keys', async () => {
    const m = new Map()
    const bytes = new Uint8Array([0x6b, 0xff])
    const text = $.bytesToString(bytes)
    const binary = $.bytesToString(bytes.slice())

    await m.Store(text, 'old')
    expect(await m.Swap(binary, 'new')).toEqual(['old', true])
    expect(await m.Load(text)).toEqual(['new', true])

    const entries: unknown[] = []
    await m.Range((key, value) => {
      entries.push([key, value])
      return true
    })
    expect(entries).toHaveLength(1)
  })

  it('matches boxed comparable interface keys', async () => {
    const m = new Map()
    const first = $.namedValueInterfaceValue(
      8,
      'uint16',
      {},
      {
        kind: $.TypeKind.Basic,
        name: 'uint16',
      },
    )
    const second = $.namedValueInterfaceValue(
      8,
      'uint16',
      {},
      {
        kind: $.TypeKind.Basic,
        name: 'uint16',
      },
    )

    await m.Store(first, 'compressor')
    expect(await m.Load(second)).toEqual(['compressor', true])
    expect(await m.LoadOrStore(second, 'duplicate')).toEqual([
      'compressor',
      true,
    ])
    expect(await m.CompareAndSwap(second, 'compressor', 'updated')).toBe(true)
    expect(await m.Load(first)).toEqual(['updated', true])
    expect(await m.CompareAndDelete(first, 'updated')).toBe(true)
    expect(await m.Load(second)).toEqual([undefined, false])
  })
})

describe('sync.Pool', () => {
  it('awaits async New functions before returning a pooled value', async () => {
    const pool = new Pool({
      New: async () => {
        await Promise.resolve()
        return 'created'
      },
    })

    expect(await pool.Get()).toBe('created')
    pool.Put('reused')
    expect(await pool.Get()).toBe('reused')
  })
})
