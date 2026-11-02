// Package sync provides basic synchronization primitives such as mutual exclusion
// locks. Other than the Once and WaitGroup types, most are intended for use by
// low-level library routines. Higher-level synchronization is better done via
// channels and communication.

import {
  GoPanic,
  comparableEqual,
  methodSignature,
  pointerValue,
  registerInterfaceType,
  runtimePanic,
} from '@goscript/builtin/index.js'

// Locker represents an object that can be locked and unlocked.
export interface Locker {
  Lock(): void | Promise<void>
  Unlock(): void
}

// Locker is registered with the runtime type system, so reflection sees an
// interface type with its methods.
registerInterfaceType('sync.Locker', null, [
  methodSignature('Lock'),
  methodSignature('Unlock'),
])

// Mutex is a mutual exclusion lock.
export class Mutex implements Locker {
  private _locked: boolean = false
  private _waitQueue: Array<() => void> = []

  constructor(_init?: Partial<{}>) {
    // Mutex has no public fields to initialize
  }

  // Lock locks m
  // If the lock is already in use, the calling goroutine blocks until the mutex is available.
  // A free lock is acquired synchronously and nothing is returned, so a caller
  // that the compiler proves never finds it held need not await.
  public Lock(): void | Promise<void> {
    if (!this._locked) {
      this._locked = true
      return
    }

    // GoScript lowers goroutine blocking to async suspension.
    return new Promise<void>((resolve) => {
      this._waitQueue.push(resolve)
    })
  }

  // TryLock tries to lock m and reports whether it succeeded
  public TryLock(): boolean {
    if (!this._locked) {
      this._locked = true
      return true
    }
    return false
  }

  // Unlock unlocks m
  public Unlock(): void {
    if (!this._locked) {
      throw new Error('sync: unlock of unlocked mutex')
    }

    this._locked = false

    // Wake up the next waiting goroutine
    if (this._waitQueue.length > 0) {
      const next = this._waitQueue.shift()!
      this._locked = true
      queueMicrotask(() => next())
    }
  }

  // clone returns a copy of this Mutex instance
  public clone(): Mutex {
    return new Mutex()
  }
}

// RWMutex is a reader/writer mutual exclusion lock.
export class RWMutex {
  private _readers: number = 0
  private _writer: boolean = false
  private _readerWaitQueue: Array<() => void> = []
  private _writerWaitQueue: Array<() => void> = []

  constructor(_init?: Partial<{}>) {
    // RWMutex has no public fields to initialize
  }

  // Lock locks rw for writing. A free lock is acquired synchronously.
  public Lock(): void | Promise<void> {
    if (!this._writer && this._readers === 0) {
      this._writer = true
      return
    }

    return new Promise<void>((resolve) => {
      this._writerWaitQueue.push(resolve)
    })
  }

  // TryLock tries to lock rw for writing and reports whether it succeeded
  public TryLock(): boolean {
    if (!this._writer && this._readers === 0) {
      this._writer = true
      return true
    }
    return false
  }

  // Unlock unlocks rw for writing
  public Unlock(): void {
    if (!this._writer) {
      throw new Error('sync: unlock of unlocked RWMutex')
    }

    this._writer = false
    this._wakeUpWaiters()
  }

  // RLock locks rw for reading. A free lock is acquired synchronously.
  public RLock(): void | Promise<void> {
    if (!this._writer && this._writerWaitQueue.length === 0) {
      this._readers++
      return
    }

    return new Promise<void>((resolve) => {
      this._readerWaitQueue.push(() => {
        this._readers++
        resolve()
      })
    })
  }

  // TryRLock tries to lock rw for reading and reports whether it succeeded
  public TryRLock(): boolean {
    if (!this._writer && this._writerWaitQueue.length === 0) {
      this._readers++
      return true
    }
    return false
  }

  // RUnlock undoes a single RLock call
  public RUnlock(): void {
    if (this._readers === 0) {
      throw new Error('sync: RUnlock of unlocked RWMutex')
    }

    this._readers--
    if (this._readers === 0) {
      this._wakeUpWaiters()
    }
  }

  // RLocker returns a Locker interface that implements Lock and Unlock by
  // calling RLock and RUnlock.
  public RLocker(): Locker {
    return {
      Lock: () => this.RLock(),
      Unlock: () => this.RUnlock(),
    }
  }

  private _wakeUpWaiters(): void {
    // Prioritize writers
    if (this._writerWaitQueue.length > 0 && this._readers === 0) {
      const next = this._writerWaitQueue.shift()!
      this._writer = true
      queueMicrotask(() => next())
    } else if (this._readerWaitQueue.length > 0 && !this._writer) {
      // Wake up all waiting readers
      const readers = this._readerWaitQueue.splice(0)
      queueMicrotask(() => {
        readers.forEach((reader) => reader())
      })
    }
  }

  // clone returns a copy of this RWMutex instance
  public clone(): RWMutex {
    return new RWMutex()
  }
}

// WaitGroup waits for a collection of goroutines to finish.
export class WaitGroup {
  private _counter: number = 0
  private _waiters: Array<() => void> = []

  constructor(_init?: Partial<{}>) {
    // WaitGroup has no public fields to initialize
  }

  // Add adds delta, which may be negative, to the WaitGroup counter
  public Add(delta: number): void {
    this._counter += delta
    if (this._counter < 0) {
      throw new Error('sync: negative WaitGroup counter')
    }
    if (this._counter === 0) {
      // Wake up all waiters
      const waiters = this._waiters.splice(0)
      queueMicrotask(() => {
        waiters.forEach((waiter) => waiter())
      })
    }
  }

  // Done decrements the WaitGroup counter by one
  public Done(): void {
    this.Add(-1)
  }

  // Go calls f in a new goroutine and adds that task to the WaitGroup.
  public Go(f: () => void | Promise<void>): void {
    this.Add(1)
    queueMicrotask(async () => {
      try {
        await f()
      } finally {
        this.Done()
      }
    })
  }

  // Wait blocks until the WaitGroup counter is zero
  public async Wait(): Promise<void> {
    if (this._counter === 0) {
      return
    }

    return new Promise<void>((resolve) => {
      this._waiters.push(resolve)
    })
  }

  // clone returns a copy of this WaitGroup instance
  public clone(): WaitGroup {
    return new WaitGroup()
  }
}

// Once is an object that will perform exactly one action.
export class Once {
  private _done: boolean = false
  private _pending: Promise<void> | null = null

  constructor(_init?: Partial<{}>) {
    // Once has no public fields to initialize
  }

  // Do calls the function f if and only if Do is being called for the first
  // time for this instance of Once. It returns a promise only when f does, and
  // a call made while that promise is pending waits for it.
  public Do(f: (() => void | Promise<void>) | null): void | Promise<void> {
    if (f == null) {
      throw new Error('sync: nil function in Once.Do')
    }
    if (this._done) {
      return this._pending ?? undefined
    }
    this._done = true
    const result = f()
    if (result instanceof Promise) {
      this._pending = result.finally(() => {
        this._pending = null
      })
      return this._pending
    }
    return undefined
  }

  // clone returns a copy of this Once instance
  public clone(): Once {
    return new Once()
  }
}

// Cond implements a condition variable, a rendezvous point for goroutines waiting for or announcing the occurrence of an event.
export class Cond {
  public L: Locker | null
  private _waiters: Array<() => void> = []

  // The zero Cond has a nil L, which must be set before calling Wait.
  constructor(init?: Partial<{ L: Locker | null }>) {
    this.L = init?.L ?? null
  }

  // Broadcast wakes all goroutines waiting on c
  public Broadcast(): void {
    const waiters = this._waiters.splice(0)
    queueMicrotask(() => {
      waiters.forEach((waiter) => waiter())
    })
  }

  // Signal wakes one goroutine waiting on c, if there is any
  public Signal(): void {
    if (this._waiters.length > 0) {
      const waiter = this._waiters.shift()!
      queueMicrotask(() => waiter())
    }
  }

  // Wait atomically unlocks c.L and suspends execution of the calling goroutine
  public async Wait(): Promise<void> {
    // L may hold a reference to a Locker, as &x.Mu of a struct field does,
    // so it is resolved as compiled code resolves an interface's receiver.
    if (this.L === null) {
      throw new Error(
        'runtime error: invalid memory address or nil pointer dereference',
      )
    }
    const l = pointerValue<Locker>(this.L)
    await l.Unlock()

    return new Promise<void>((resolve) => {
      this._waiters.push(async () => {
        await l.Lock()
        resolve()
      })
    })
  }

  // clone returns a copy of this Cond instance
  public clone(): Cond {
    return new Cond({ L: this.L })
  }
}

// NewCond returns a new Cond with Locker l.
export function NewCond(l: Locker | null): Cond {
  return new Cond({ L: l })
}

// Map is like a Go map[interface{}]interface{} but is safe for concurrent use by multiple goroutines.
// The runtime runs one goroutine at a time, and no method but Range calls
// back into Go code, so each runs without interruption and needs no lock.
export class Map {
  private _data: globalThis.Map<any, any> = new globalThis.Map()

  constructor(_init?: Partial<{}>) {
    // Map has no public fields to initialize
  }

  // Clear deletes all entries.
  public Clear(): void {
    this._data.clear()
  }

  // Delete deletes the value for a key
  public Delete(key: any): void {
    const entry = this.findEntry(key)
    if (entry.found) {
      this._data.delete(entry.key)
    }
  }

  // CompareAndDelete deletes the entry for key if its value is equal to old.
  public CompareAndDelete(key: any, old: any): boolean {
    const entry = this.findEntry(key)
    if (!entry.found || !comparableEqual(entry.value, old)) {
      return false
    }
    this._data.delete(entry.key)
    return true
  }

  // CompareAndSwap swaps the old and new values for key if the stored value is old.
  // The synchronous body has no await points, so the event loop cannot interleave it.
  public CompareAndSwap(key: any, old: any, value: any): boolean {
    const entry = this.findEntry(key)
    if (!entry.found || !comparableEqual(entry.value, old)) {
      return false
    }
    this._data.set(entry.key, value)
    return true
  }

  // Load returns the value stored in the map for a key, or nil if no value is present
  public Load(key: any): [any, boolean] {
    const entry = this.findEntry(key)
    return entry.found ? [entry.value, true] : [undefined, false]
  }

  // LoadAndDelete deletes the value for a key, returning the previous value if any
  public LoadAndDelete(key: any): [any, boolean] {
    const entry = this.findEntry(key)
    if (!entry.found) {
      return [undefined, false]
    }
    this._data.delete(entry.key)
    return [entry.value, true]
  }

  // LoadOrStore returns the existing value for the key if present
  public LoadOrStore(key: any, value: any): [any, boolean] {
    const entry = this.findEntry(key)
    if (entry.found) {
      return [entry.value, true]
    }
    this._data.set(key, value)
    return [value, false]
  }

  // Range calls f sequentially for each key and value present in the map.
  // It returns a promise only when f does.
  public Range(
    f: (key: any, value: any) => boolean | globalThis.Promise<boolean>,
  ): void | Promise<void> {
    const entries: [any, any][] = Array.from(this._data)
    for (let i = 0; i < entries.length; i++) {
      const more = f(entries[i][0], entries[i][1])
      if (more instanceof Promise) {
        return this.rangeAsync(f, entries, i, more)
      }
      if (!more) {
        return
      }
    }
  }

  // rangeAsync continues Range after f returned a promise for entry i.
  private async rangeAsync(
    f: (key: any, value: any) => boolean | globalThis.Promise<boolean>,
    entries: [any, any][],
    i: number,
    more: Promise<boolean>,
  ): Promise<void> {
    if (!(await more)) {
      return
    }
    for (let j = i + 1; j < entries.length; j++) {
      if (!(await f(entries[j][0], entries[j][1]))) {
        return
      }
    }
  }

  // Store sets the value for a key
  public Store(key: any, value: any): void {
    const entry = this.findEntry(key)
    this._data.set(entry.found ? entry.key : key, value)
  }

  private findEntry(
    key: any,
  ): { found: false } | { found: true; key: any; value: any } {
    if (this._data.has(key)) {
      return { found: true, key, value: this._data.get(key) }
    }
    if (typeof key === 'string') {
      return { found: false }
    }
    for (const [candidate, value] of this._data.entries()) {
      if (candidate !== key && comparableEqual(candidate, key)) {
        return { found: true, key: candidate, value }
      }
    }
    return { found: false }
  }

  // Swap swaps the value for a key and returns the previous value if any
  public Swap(key: any, value: any): [any, boolean] {
    const entry = this.findEntry(key)
    this._data.set(entry.found ? entry.key : key, value)
    return [entry.found ? entry.value : undefined, entry.found]
  }

  // clone returns a copy of this Map instance
  public clone(): Map {
    return new Map()
  }
}

// Pool is a set of temporary objects that may be individually saved and retrieved.
export class Pool {
  public New?: () => any
  private _pool: any[] = []

  constructor(init?: Partial<{ New?: () => any }>) {
    this.New = init?.New
  }

  // Get selects an arbitrary item from the Pool, removes it from the Pool,
  // and returns it to the caller. It returns a promise only when New does.
  public Get(): any {
    if (this._pool.length > 0) {
      return this._pool.pop()
    }
    if (this.New) {
      return this.New()
    }
    return null
  }

  // Put adds x to the pool
  public Put(x: any): void {
    if (x !== null && x !== undefined) {
      this._pool.push(x)
    }
  }

  // clone returns a copy of this Pool instance
  public clone(): Pool {
    return new Pool({ New: this.New })
  }
}

// callNil panics as calling a nil func does in Go.
function callNil(): never {
  runtimePanic(
    'runtime error: invalid memory address or nil pointer dereference',
  )
}

// OnceFunc returns a function that invokes f only once. A nil f panics on
// the first call.
export function OnceFunc(
  f: (() => void | Promise<void>) | null,
): () => void | Promise<void> {
  return OnceValue(f)
}

// OnceValue returns a function that invokes f only once and returns the value
// returned by f. A nil f panics on the first call.
export function OnceValue<T>(
  f: (() => T | Promise<T>) | null,
): () => T | Promise<T> {
  // Keep the result, including a pending call, for every later invocation.
  const call = f ?? callNil
  let value: T | Promise<T>
  let called = false
  let panicked = false
  let panicValue: unknown
  return () => {
    // Replay a completed panic or share the first call's result.
    if (called) {
      if (panicked) {
        rethrowOncePanic(panicValue)
      }
      return value instanceof Promise ? value.catch(rethrowOncePanic) : value
    }
    called = true
    try {
      value = call()
      if (value instanceof Promise) {
        value = value.catch((err) => {
          panicked = true
          panicValue = err
          throw err
        })
      }
    } catch (err) {
      panicked = true
      panicValue = err
      throw err
    }
    return value instanceof Promise ? value.catch(rethrowOncePanic) : value
  }
}

// rethrowOncePanic gives each caller its own recoverable Go panic carrier.
function rethrowOncePanic(err: unknown): never {
  throw err instanceof GoPanic ? new GoPanic(err.value) : err
}

// OnceValues returns a function that invokes f only once and returns the values
// returned by f. A nil f panics on the first call.
export function OnceValues<T1, T2>(
  f: (() => [T1, T2] | Promise<[T1, T2]>) | null,
): () => [T1, T2] | Promise<[T1, T2]> {
  // Cache the computation while returning each tuple by value.
  const call = OnceValue(f)
  return () => {
    const value = call()
    if (value instanceof Promise) {
      return value.then(([first, second]) => [first, second])
    }
    return [value[0], value[1]]
  }
}
