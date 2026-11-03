import * as $ from '@goscript/builtin/index.js'
import * as time from '@goscript/time/index.js'

export const Canceled = $.newError('context canceled')

export const DeadlineExceeded = $.newError('context deadline exceeded')

// CancelFunc Function types.
export type CancelFunc = (() => void) | null
export type CancelCauseFunc = (cause: $.GoError) => void

// Context interface matching Go's context.Context.
export type Context = null | {
  // Deadline returns the time when work done on behalf of this context should be canceled
  Deadline(): [time.Time, boolean]

  // Done returns a channel that's closed when work done on behalf of this
  // context should be canceled, or null if this context can never be canceled.
  Done(): $.Channel<{}> | null

  // Err returns a non-nil error value after Done is closed
  Err(): $.GoError

  // Value returns the value associated with this context for key, or null
  Value(key: any): any
}

// ContextNonNil is a non-nil context.
export type ContextNonNil = Exclude<Context, null>

// Base implementation for all contexts
abstract class baseContext implements ContextNonNil {
  abstract Deadline(): [time.Time, boolean]
  abstract Done(): $.Channel<{}> | null
  abstract Err(): $.GoError
  abstract Value(key: any): any
}

// Background/TODO context that is never canceled
class backgroundContext extends baseContext {
  Deadline(): [time.Time, boolean] {
    return [new time.Time(), false]
  }

  Done(): $.Channel<{}> | null {
    return null
  }

  Err(): $.GoError {
    return null
  }

  Value(_key: any): any {
    return null
  }
}

// Value context wraps a parent and adds a key-value pair
class valueContext extends baseContext {
  constructor(
    private parent: ContextNonNil,
    private key: any,
    private val: any,
  ) {
    super()
  }

  getParent(): ContextNonNil {
    return this.parent
  }

  Deadline(): [time.Time, boolean] {
    return this.parent.Deadline()
  }

  Done(): $.Channel<{}> | null {
    return this.parent.Done()
  }

  Err(): $.GoError {
    return this.parent.Err()
  }

  Value(key: any): any {
    if (this.key === key || $.comparableEqual(this.key, key)) {
      return this.val
    }
    return this.parent.Value(key)
  }
}

// Cancel context that can be canceled
class cancelContext extends baseContext {
  protected doneChannel: $.Channel<{}>
  protected err: $.GoError = null
  protected cause: $.GoError = null
  protected children: Set<cancelContext> = new Set()
  protected parent: ContextNonNil
  protected parentCancelCtx: cancelContext | null = null
  protected removeFromParent: (() => void) | null = null

  constructor(parent: ContextNonNil) {
    super()
    this.parent = parent
    this.doneChannel = $.makeChannel<{}>(0, {}, 'both')
  }

  Deadline(): [time.Time, boolean] {
    return this.parent.Deadline()
  }

  Done(): $.Channel<{}> {
    return this.doneChannel
  }

  Err(): $.GoError {
    return this.err
  }

  Value(key: any): any {
    return this.parent.Value(key)
  }

  getCause(): $.GoError {
    return this.cause ?? this.err
  }

  cancel(removeFromParent: boolean, err: $.GoError, cause: $.GoError): void {
    if (this.err !== null) {
      return // Already canceled
    }

    this.err = err
    this.cause = cause
    this.doneChannel.close()

    // Cancel all children
    for (const child of this.children) {
      child.cancel(false, err, cause)
    }
    this.children.clear()

    // Remove from parent's children if requested
    if (removeFromParent && this.removeFromParent) {
      this.removeFromParent()
      this.removeFromParent = null
    }
  }

  // propagateCancel arranges for the parent's cancellation to cancel this
  // context. A parent that can never be canceled needs nothing.
  propagateCancel(): void {
    const parentDone = this.parent.Done()
    if (parentDone === null) {
      return
    }

    // Find parent cancelContext if any
    let parent = this.parent
    while (parent instanceof valueContext) {
      parent = (parent as valueContext).getParent()
    }

    if (parent instanceof cancelContext) {
      // Parent is a cancel context, register as child
      this.parentCancelCtx = parent
      if (parent.err !== null) {
        // Parent already canceled
        this.cancel(false, parent.err, parent.cause)
      } else {
        parent.children.add(this)
        this.removeFromParent = () => {
          parent.children.delete(this)
        }
      }
    } else {
      this.watchParentDone(parentDone)
    }
  }

  // watchParentDone cancels this context when parentDone closes. The wait is
  // withdrawn when this context is canceled first, so a canceled child is not
  // retained by a long-lived parent.
  private watchParentDone(parentDone: $.Channel<{}>): void {
    const stopWait = new AbortController()
    this.removeFromParent = () => stopWait.abort()
    void parentDone.selectReceive(0, stopWait.signal).then(() => {
      const parentErr = this.parent.Err()
      if (parentErr && this.err === null) {
        this.cancel(false, parentErr, null)
      }
    })
  }
}

// Timer context with deadline
class timerContext extends cancelContext {
  private deadline: time.Time
  private timer: time.Timer | null = null

  constructor(parent: ContextNonNil, deadline: time.Time) {
    super(parent)
    this.deadline = deadline.clone()
  }

  Deadline(): [time.Time, boolean] {
    return [this.deadline.clone(), true]
  }

  startTimer(cause: $.GoError): void {
    // Keep an already canceled parent from leaving a deadline timer behind.
    if (this.Err() !== null) {
      return
    }

    // An elapsed deadline cancels the returned context immediately.
    const duration = this.deadline.Sub(time.Now())
    if (duration <= 0n) {
      this.cancel(true, DeadlineExceeded, cause)
      return
    }

    // Go timers wait out an early host callback before reporting expiry.
    this.timer = time.AfterFunc(duration, () => {
      this.cancel(true, DeadlineExceeded, cause)
    })
  }

  cancel(removeFromParent: boolean, err: $.GoError, cause: $.GoError): void {
    super.cancel(removeFromParent, err, cause)
    this.timer?.Stop()
    this.timer = null
  }
}

// Without cancel context - inherits values but not cancellation
class withoutCancelContext extends baseContext {
  constructor(private parent: ContextNonNil) {
    super()
  }

  Deadline(): [time.Time, boolean] {
    return [new time.Time(), false]
  }

  Done(): $.Channel<{}> | null {
    return null
  }

  Err(): $.GoError {
    return null
  }

  Value(key: any): any {
    return this.parent.Value(key)
  }
}

// Singleton contexts
const background = new backgroundContext()
const todo = new backgroundContext()

// Background returns a non-nil, empty Context that is never canceled.
export function Background(): Context {
  return background
}

// TODO returns a non-nil, empty Context.
export function TODO(): Context {
  return todo
}

// WithCancel returns a copy of parent with a new Done channel.
export function WithCancel(parent: Context): [Context, CancelFunc] {
  if (parent === null) {
    throw new Error('cannot create context from nil parent')
  }
  const ctx = new cancelContext(parent)
  ctx.propagateCancel()

  return [
    ctx,
    () => {
      ctx.cancel(true, Canceled, null)
    },
  ]
}

// WithCancelCause returns a copy of parent with a new Done channel and cause recording.
export function WithCancelCause(parent: Context): [Context, CancelCauseFunc] {
  if (parent === null) {
    throw new Error('cannot create context from nil parent')
  }
  const ctx = new cancelContext(parent)
  ctx.propagateCancel()

  return [
    ctx,
    (cause: $.GoError) => {
      ctx.cancel(true, Canceled, cause)
    },
  ]
}

// WithDeadline returns a copy of parent with the deadline adjusted to be no later than d.
export function WithDeadline(
  parent: Context,
  d: time.Time,
): [Context, CancelFunc] {
  return WithDeadlineCause(parent, d, null)
}

// WithDeadlineCause is like WithDeadline but also sets the cause.
export function WithDeadlineCause(
  parent: Context,
  d: time.Time,
  cause: $.GoError,
): [Context, CancelFunc] {
  if (parent === null) {
    throw new Error('cannot create context from nil parent')
  }
  // Check if parent deadline is already earlier
  const [parentDeadline, ok] = parent.Deadline()
  if (ok && (parentDeadline.Before(d) || parentDeadline.Equal(d))) {
    // Parent deadline is already sooner
    return WithCancel(parent)
  }

  const ctx = new timerContext(parent, d)
  ctx.propagateCancel()
  ctx.startTimer(cause)

  return [
    ctx,
    () => {
      ctx.cancel(true, Canceled, null)
    },
  ]
}

// WithTimeout returns WithDeadline(parent, Date.now() + timeout).
export function WithTimeout(
  parent: Context,
  timeout: time.Duration,
): [Context, CancelFunc] {
  return WithDeadline(parent, time.Now().Add(timeout))
}

// WithTimeoutCause is like WithTimeout but also sets the cause.
export function WithTimeoutCause(
  parent: Context,
  timeout: time.Duration,
  cause: $.GoError,
): [Context, CancelFunc] {
  return WithDeadlineCause(parent, time.Now().Add(timeout), cause)
}

// WithValue returns a copy of parent with the value associated with key.
export function WithValue(parent: Context, key: any, val: any): Context {
  if (parent === null) {
    throw new Error('cannot create context from nil parent')
  }
  return new valueContext(parent, key, val)
}

// WithoutCancel returns a context that inherits values but not cancellation.
export function WithoutCancel(parent: Context): Context {
  if (parent === null) {
    throw new Error('cannot create context from nil parent')
  }
  return new withoutCancelContext(parent)
}

// Cause returns the underlying cause of the context's cancellation.
export function Cause(ctx: Context): $.GoError {
  if (!ctx) return null

  let c = ctx
  // Unwrap value contexts
  while (c instanceof valueContext) {
    c = (c as valueContext).getParent()
  }

  if (c instanceof cancelContext) {
    return c.getCause()
  }

  return c.Err()
}

// AfterFunc runs f in a separate goroutine after ctx is done. Stop withdraws
// the wait from the done channel, so a stopped AfterFunc on a long-lived ctx
// retains neither f nor its captures.
export function AfterFunc(ctx: Context, f: (() => void) | null): () => boolean {
  if (ctx === null) {
    throw new Error('cannot create context from nil parent')
  }

  // A context that can never be done never runs f.
  let settled = false
  const done = ctx.Done()
  if (done === null) {
    return () => {
      if (settled) {
        return false
      }
      settled = true
      return true
    }
  }

  // The wait commits synchronously when ctx is done, before f runs.
  const stopWait = new AbortController()
  void done
    .selectReceive(0, stopWait.signal, () => {
      settled = true
    })
    .then(() => {
      queueMicrotask(() => {
        if (f === null) {
          throw new Error('context: nil AfterFunc callback')
        }
        f()
      })
    })

  return () => {
    if (settled) {
      return false
    }
    settled = true
    stopWait.abort()
    return true
  }
}
