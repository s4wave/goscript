import { describe, expect, it, vi } from 'vitest'

import * as $ from '@goscript/builtin/index.js'
import * as time from '@goscript/time/index.js'

import {
  AfterFunc,
  Background,
  Canceled,
  Cause,
  DeadlineExceeded,
  WithCancel,
  WithDeadlineCause,
  WithValue,
  WithoutCancel,
} from './index.js'
import type { Context } from './index.js'

async function nextMicrotask(): Promise<void> {
  await new Promise<void>((resolve) => queueMicrotask(resolve))
}

// foreignContext is a context implemented outside the package, whose
// cancellation a child can observe only through its Done channel. cancel
// closes that channel.
function foreignContext(): [Context, $.Channel<{}>, () => void] {
  const done = $.makeChannel<{}>(0, {}, 'both')
  let err: $.GoError = null
  const ctx: Context = {
    Deadline: () => Background()!.Deadline(),
    Done: () => done,
    Err: () => err,
    Value: () => null,
  }
  const cancel = () => {
    err = Canceled
    done.close()
  }
  return [ctx, done, cancel]
}

describe('context override', () => {
  it('waits out an early host timer and preserves the deadline cause', async () => {
    // Hold the monotonic clock just before expiry while the host timer fires.
    let clock = 0
    const now = vi.spyOn(performance, 'now').mockImplementation(() => clock)
    const cause = $.newError('deadline cause')
    const [ctx, cancel] = WithDeadlineCause(
      Background(),
      time.Now().Add(time.Millisecond),
      cause,
    )
    try {
      const done = ctx!.Done()!.receive()
      clock = 0.95
      await new Promise((resolve) => setTimeout(resolve, 5))
      expect(ctx!.Err()).toBeNull()

      // The same deadline expires once its monotonic duration has elapsed.
      clock = 1
      await done
      expect(ctx!.Err()).toBe(DeadlineExceeded)
      expect(Cause(ctx)).toBe(cause)
    } finally {
      cancel?.()
      now.mockRestore()
    }
  })

  it('matches generated struct keys by Go comparable value', () => {
    class Key {
      static __typeInfo = $.registerStructType('example.key', null, [], Key, [])
    }

    const ctx = WithValue(
      Background(),
      $.interfaceValue($.markAsStructValue(new Key()), 'example.key'),
      'stored',
    )

    expect(
      ctx.Value(
        $.interfaceValue($.markAsStructValue(new Key()), 'example.key'),
      ),
    ).toBe('stored')
  })

  it('runs AfterFunc after cancellation', async () => {
    const [ctx, cancel] = WithCancel(Background())
    let called = false
    let resolveCallback: (() => void) | null = null
    const callbackComplete = new Promise<void>((resolve) => {
      resolveCallback = resolve
    })

    const stop = AfterFunc(ctx, () => {
      called = true
      resolveCallback?.()
    })

    cancel?.()
    await callbackComplete

    expect(called).toBe(true)
    expect(stop()).toBe(false)
  })

  it('stops AfterFunc before cancellation', async () => {
    const [ctx, cancel] = WithCancel(Background())
    let called = false

    const stop = AfterFunc(ctx, () => {
      called = true
    })

    expect(stop()).toBe(true)
    expect(stop()).toBe(false)
    cancel?.()
    await nextMicrotask()
    await nextMicrotask()

    expect(called).toBe(false)
  })

  it('accepts nil AfterFunc callbacks for type compatibility', () => {
    const [ctx] = WithCancel(Background())

    const stop = AfterFunc(ctx, null)

    expect(stop()).toBe(true)
  })

  it('reports a nil Done for contexts that are never canceled', () => {
    expect(Background()!.Done()).toBeNull()
    expect(WithValue(Background(), 'k', 'v')!.Done()).toBeNull()
    const [ctx, cancel] = WithCancel(Background())
    cancel?.()
    expect(WithoutCancel(ctx)!.Done()).toBeNull()
  })

  it('never runs AfterFunc on a context that is never canceled', () => {
    const stop = AfterFunc(Background(), () => {
      throw new Error('ran')
    })

    expect(stop()).toBe(true)
    expect(stop()).toBe(false)
  })

  it('cancels a child when a foreign parent is done', async () => {
    const [parent, , cancelParent] = foreignContext()
    const [child] = WithCancel(parent)

    cancelParent()
    await child!.Done()!.receive()

    expect(child!.Err()).toBe(Canceled)
  })

  it('withdraws a canceled child from a foreign parent', () => {
    const [parent, parentDone] = foreignContext()
    const [, cancel] = WithCancel(parent)
    expect(parentDone.canSendNonBlocking()).toBe(true)

    cancel?.()

    expect(parentDone.canSendNonBlocking()).toBe(false)
  })
})
