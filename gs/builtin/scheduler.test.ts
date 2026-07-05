import { describe, expect, it } from 'vitest'

import { queueTask } from './scheduler.js'

describe('queueTask', () => {
  it('runs on a task boundary after the microtask checkpoint', async () => {
    // A microtask queued after queueTask must still run first: queueTask crosses
    // a real event-loop turn, so it never joins the current microtask drain.
    const order: string[] = []
    await new Promise<void>((done) => {
      queueTask(() => {
        order.push('task')
        done()
      })
      queueMicrotask(() => order.push('microtask'))
    })
    expect(order).toEqual(['microtask', 'task'])
  })

  it('dispatches multiple tasks in FIFO order', async () => {
    const order: number[] = []
    await new Promise<void>((done) => {
      queueTask(() => order.push(1))
      queueTask(() => order.push(2))
      queueTask(() => {
        order.push(3)
        done()
      })
    })
    expect(order).toEqual([1, 2, 3])
  })
})
