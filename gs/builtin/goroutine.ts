import { panicMessage } from './panic.js'

// GoroutineFatal describes the goroutine failure that ended the program.
export interface GoroutineFatal {
  // goroutine is the id of the goroutine that failed; main is 1.
  goroutine: number
  // exitCode is the status Go would exit with: 2 for a panic, or the code a
  // goroutine passed to os.Exit.
  exitCode: number
  // message is the report Go prints to standard error: "panic: <text>"
  // followed by the goroutine and its stack. It is empty for os.Exit.
  message: string
  // error is the value that escaped the goroutine.
  error: unknown
}

// FatalHandler receives the one goroutine failure that ends the program.
export type FatalHandler = (fatal: GoroutineFatal) => void

// The goroutine lifecycle is: queued by go, running, then done. A goroutine
// that returns, or calls runtime.Goexit, is done. One that lets a panic or a
// rejection escape after its deferred calls had their chance to recover ends
// the program, as in Go: the runtime turns dead at once, starts no goroutine
// after that, and hands the failure to the fatal handler.
let nextGoroutine = 1
let liveGoroutines = 1
let dead = false
let fatalHandler: FatalHandler = hostFatal

// go starts task as a new goroutine. The compiler lowers every go statement
// to a call of go, so this is the one place a goroutine starts and ends.
export function go(task: () => unknown): void {
  if (dead) {
    return
  }
  const id = ++nextGoroutine
  liveGoroutines++
  queueMicrotask(() => {
    if (dead) {
      liveGoroutines--
      return
    }
    let result: unknown
    try {
      result = task()
    } catch (err) {
      goroutineFailed(id, err)
      return
    }
    if (!isPromiseLike(result)) {
      liveGoroutines--
      return
    }
    result.then(
      () => {
        liveGoroutines--
      },
      (err: unknown) => goroutineFailed(id, err),
    )
  })
}

// numGoroutine returns the number of goroutines that exist, counting main.
export function numGoroutine(): number {
  return liveGoroutines
}

// setFatalHandler sets the host's handler for the goroutine failure that ends
// the program, replacing the default: in Node or Bun, print the report and
// exit with its status; elsewhere, print the report and raise it as an
// uncaught error, so the page's or worker's error reporting sees it.
export function setFatalHandler(handler: FatalHandler): void {
  fatalHandler = handler
}

// goroutineFailed ends goroutine id with err. runtime.Goexit ends only the
// goroutine; anything else ends the program.
function goroutineFailed(id: number, err: unknown): void {
  liveGoroutines--
  const name = err instanceof Error ? err.name : ''
  if (name === 'GoexitError' || dead) {
    return
  }
  dead = true
  if (name === 'ProcessExitError') {
    const code = (err as { __goscriptExitCode?: unknown }).__goscriptExitCode
    fatalHandler({
      goroutine: id,
      exitCode: typeof code === 'number' ? code : 1,
      message: '',
      error: err,
    })
    return
  }
  void goroutineReport(id, err).then((message) =>
    fatalHandler({ goroutine: id, exitCode: 2, message, error: err }),
  )
}

// goroutineReport formats err as Go reports a fatal panic. A JavaScript error
// that is not a Go panic, such as a TypeError or a WebCrypto rejection, keeps
// its name, which says more than its message alone.
async function goroutineReport(id: number, err: unknown): Promise<string> {
  let text = await panicMessage(err)
  if (err instanceof Error && err.name !== 'Error' && err.name !== 'GoPanic') {
    const name = err.name
    if (!text.startsWith('panic: ' + name)) {
      text = 'panic: ' + name + ': ' + text.slice('panic: '.length)
    }
  }
  const stack = err instanceof Error && err.stack ? err.stack : ''
  const frames = stack
    .split('\n')
    .filter((line) => /^\s+at\s|@/.test(line))
    .join('\n')
  return (
    text + '\n\ngoroutine ' + id + ' [running]:' + (frames ? '\n' + frames : '')
  )
}

// hostFatal is the default fatal handler.
function hostFatal(fatal: GoroutineFatal): void {
  const proc = (
    globalThis as {
      process?: {
        versions?: { node?: string }
        exit?: (code: number) => void
      }
    }
  ).process
  if (fatal.message) {
    console.error(fatal.message)
  }
  if (proc?.versions?.node && typeof proc.exit === 'function') {
    proc.exit(fatal.exitCode)
    return
  }
  if (fatal.exitCode === 0) {
    return
  }
  const err = new Error(
    fatal.message ?
      fatal.message.split('\n')[0]
    : 'exit status ' + fatal.exitCode,
    { cause: fatal.error },
  )
  const report = (globalThis as { reportError?: (err: unknown) => void })
    .reportError
  if (typeof report === 'function') {
    report(err)
    return
  }
  setTimeout(() => {
    throw err
  })
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}
