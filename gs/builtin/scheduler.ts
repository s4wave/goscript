// queueTask posts fn to run on a real task boundary: one full event-loop turn,
// after the current microtask checkpoint drains but without setTimeout's nesting
// clamp (browsers force a >=4ms minimum once setTimeout(0) is nested a few deep).
//
// The invariant is that a microtask is NOT a yield. queueMicrotask callbacks all
// run before the event loop gets to touch I/O, timers, or rendering, so a
// goroutine that "yields" via a microtask never actually lets those make
// progress and a busy-wait loop that only advances through native Go scheduling
// can livelock. queueTask crosses an event-loop turn so the loop can service
// that other work before fn runs.
//
// Preference order, resolved once and cached:
//   1. scheduler.postTask (browsers): a first-class user-blocking task.
//   2. MessageChannel port dispatch (Node, Bun): a task boundary with no clamp.
//   3. setTimeout(fn, 0): last resort where neither of the above exists.

type PostTaskScheduler = {
  postTask(fn: () => void, options?: { priority?: string }): Promise<unknown>
}

type RefCountedPort = MessagePort & {
  ref?: () => void
  unref?: () => void
}

function postTaskPoster(): ((fn: () => void) => void) | undefined {
  const sched = (globalThis as { scheduler?: PostTaskScheduler }).scheduler
  if (!sched || typeof sched.postTask !== 'function') {
    return undefined
  }
  return (fn) => {
    void sched.postTask(fn, { priority: 'user-blocking' })
  }
}

function messageChannelPoster(): ((fn: () => void) => void) | undefined {
  if (typeof MessageChannel === 'undefined') {
    return undefined
  }
  const channel = new MessageChannel()
  const port1 = channel.port1 as RefCountedPort
  const port2 = channel.port2 as RefCountedPort
  const queue: Array<() => void> = []

  const setRefed = (refed: boolean): void => {
    // Node/Bun ports keep the event loop alive while referenced; hold a ref only
    // while tasks are pending so an idle runtime can still exit. Browser ports
    // expose no ref/unref, so these are optional no-ops.
    if (refed) {
      port1.ref?.()
      port2.ref?.()
    } else {
      port1.unref?.()
      port2.unref?.()
    }
  }

  port1.onmessage = () => {
    const fn = queue.shift()
    if (queue.length === 0) {
      setRefed(false)
    }
    fn?.()
  }
  setRefed(false)

  return (fn) => {
    if (queue.length === 0) {
      setRefed(true)
    }
    queue.push(fn)
    port2.postMessage(undefined)
  }
}

let poster: ((fn: () => void) => void) | undefined

function taskPoster(): (fn: () => void) => void {
  if (poster === undefined) {
    poster =
      postTaskPoster() ??
      messageChannelPoster() ??
      ((fn) => {
        setTimeout(fn, 0)
      })
  }
  return poster
}

export function queueTask(fn: () => void): void {
  taskPoster()(fn)
}
