import * as context from '@goscript/context/index.js'

export type TestFunc = (t: T) => void | Promise<void>
export type TB = T | B | F

export type TestCase = {
  name: string
  fn: TestFunc
}

export type RunOptions = {
  verbose?: boolean
  count?: number
  short?: boolean
}

export type RunResult = {
  ok: boolean
  failed: number
  skipped: number
}

interface HostProcess {
  env?: Record<string, string | undefined>
  cwd?: () => string
  chdir?: (dir: string) => void
  getBuiltinModule?: (name: string) => unknown
}

interface HostGlobal {
  process?: HostProcess
  require?: (name: string) => unknown
}

class TestControl extends Error {
  public readonly kind: 'fatal' | 'skip'

  constructor(kind: 'fatal' | 'skip', message: string) {
    super(message)
    this.kind = kind
  }
}

let shortMode = false

export class T {
  private readonly testName: string
  private failed = false
  private skipped = false
  private logs: string[] = []
  private pendingLogText: Promise<void>[] = []
  private cleanups: (() => void | Promise<void>)[] = []
  private tempDirs: string[] = []

  constructor(name: string) {
    this.testName = name
  }

  public Name(): string {
    return this.testName
  }

  public Fail(): void {
    this.failed = true
  }

  public FailNow(): never {
    this.failed = true
    throw new TestControl('fatal', 'test failed')
  }

  public Failed(): boolean {
    return this.failed
  }

  public Error(...args: unknown[]): void {
    this.Log(...args)
    this.Fail()
  }

  public Errorf(format: string, ...args: unknown[]): void {
    this.Log(formatMessage(format, args))
    this.Fail()
  }

  public Fatal(...args: unknown[]): never {
    this.Log(...args)
    this.FailNow()
  }

  public Fatalf(format: string, ...args: unknown[]): never {
    this.Log(formatMessage(format, args))
    this.FailNow()
  }

  public Log(...args: unknown[]): void {
    this.pushLog(args.map(formatValue))
  }

  public Logf(format: string, ...args: unknown[]): void {
    this.pushLog([formatMessage(format, args)])
  }

  // pushLog appends a rendered entry. When an operand resolves
  // asynchronously, a placeholder entry holds its position and the resolved
  // text replaces it once the microtask queue runs; flushLogs awaits these
  // before printing so no entry is lost or flushed as a placeholder.
  private pushLog(parts: MaybeText[]): void {
    const joined = joinMaybeText(parts, ' ')
    if (typeof joined === 'string') {
      this.logs.push(joined)
      return
    }
    const index = this.logs.length
    this.logs.push('')
    this.pendingLogText.push(
      Promise.resolve(joined).then((text) => {
        this.logs[index] = text
      }),
    )
  }

  public Skip(...args: unknown[]): never {
    this.Log(...args)
    this.SkipNow()
  }

  public Skipf(format: string, ...args: unknown[]): never {
    this.Log(formatMessage(format, args))
    this.SkipNow()
  }

  public SkipNow(): never {
    this.skipped = true
    throw new TestControl('skip', 'test skipped')
  }

  public Skipped(): boolean {
    return this.skipped
  }

  public Helper(): void {}

  public Cleanup(fn: (() => void | Promise<void>) | null): void {
    this.cleanups.push(() => {
      if (fn == null) {
        throw new Error('testing: nil cleanup function')
      }
      return fn()
    })
  }

  public async Run(name: string, fn: TestFunc): Promise<boolean> {
    const child = new T(this.testName + '/' + name)
    try {
      await fn(child)
    } catch (err) {
      if (isProcessExitError(err)) {
        throw err
      }
      if (err instanceof TestControl && err.kind === 'skip') {
        // A skipped subtest is still a successful Run result.
      } else {
        child.Fail()
        if (!(err instanceof TestControl)) {
          child.Log(err)
        }
      }
    }
    try {
      await child.runCleanups()
    } catch (err) {
      if (isProcessExitError(err)) {
        throw err
      }
      child.Fail()
      if (!(err instanceof TestControl)) {
        child.Log(err)
      }
    }
    if (child.Failed()) {
      this.Fail()
      await child.flushLogs()
      return false
    }
    return true
  }

  public TempDir(): string {
    const fs = requireHostModule<{
      mkdtempSync(prefix: string): string
      rmSync(path: string, opts: { force: boolean; recursive: boolean }): void
    }>('node:fs', 'testing.TempDir')
    const os = requireHostModule<{ tmpdir(): string }>(
      'node:os',
      'testing.TempDir',
    )
    const pathMod = requireHostModule<{ join(...parts: string[]): string }>(
      'node:path',
      'testing.TempDir',
    )
    const path = fs.mkdtempSync(
      pathMod.join(
        os.tmpdir(),
        'goscript-test-' +
          this.testName.replace(/[^A-Za-z0-9_.-]/g, '_') +
          '-' +
          String(this.tempDirs.length),
      ) + '-',
    )
    this.tempDirs.push(path)
    this.Cleanup(() => {
      fs.rmSync(path, { force: true, recursive: true })
    })
    return path
  }

  public Parallel(): void {}

  public Setenv(key: string, value: string): void {
    const env = (globalThis as HostGlobal).process?.env
    if (env === undefined) {
      throw new Error('testing.Setenv is not supported without a host process')
    }
    const oldValue = env[key]
    env[key] = value
    this.Cleanup(() => {
      if (oldValue === undefined) {
        delete env[key]
        return
      }
      env[key] = oldValue
    })
  }

  public Chdir(dir: string): void {
    const proc = (globalThis as HostGlobal).process
    if (proc?.cwd === undefined || proc.chdir === undefined) {
      throw new Error('testing.Chdir is not supported without a host process')
    }
    const oldDir = proc.cwd()
    proc.chdir(dir)
    this.Cleanup(() => {
      proc.chdir!(oldDir)
    })
  }

  public ArtifactDir(): string {
    return this.TempDir()
  }

  public Attr(_key: string, _value: string): void {}

  public Context(): context.Context {
    return context.Background()
  }

  public Output(): null {
    return null
  }

  public private(): void {}

  public async runCleanups(): Promise<void> {
    for (let i = this.cleanups.length - 1; i >= 0; i--) {
      await this.cleanups[i]()
    }
  }

  public async flushLogs(): Promise<void> {
    // Entries rendered through an async transpiled Error()/String() method
    // resolve after the microtask queue runs; settle them before flushing so
    // the printed log carries the final text.
    const pending = this.pendingLogText
    this.pendingLogText = []
    await Promise.all(pending)
    for (const line of this.logs) {
      console.log('    ' + line)
    }
  }
}

export class B extends T {
  public N = 1

  constructor(name = 'Benchmark') {
    super(name)
  }

  public async Run(
    name: string,
    fn: (b: B) => void | Promise<void>,
  ): Promise<boolean> {
    const child = new B(this.Name() + '/' + name)
    child.N = this.N
    try {
      await fn(child)
    } catch (err) {
      if (isProcessExitError(err)) {
        throw err
      }
      child.Error(err)
    }
    if (child.Failed()) {
      this.Fail()
      return false
    }
    return true
  }

  public StartTimer(): void {}

  public StopTimer(): void {}

  public ResetTimer(): void {}

  public ReportAllocs(): void {}

  public SetBytes(_bytes: number): void {}

  public ReportMetric(_n: number, _unit: string): void {}

  public RunParallel(_fn: (pb: PB) => void): void {}

  public Loop(): boolean {
    if (this.N > 0) {
      this.N--
      return true
    }
    return false
  }
}

export class F extends T {
  constructor(name = 'Fuzz') {
    super(name)
  }

  public Add(..._args: unknown[]): void {}

  public Fuzz(_fn: unknown): void {}
}

export class PB {
  private remaining = 1

  public Next(): boolean {
    if (this.remaining > 0) {
      this.remaining--
      return true
    }
    return false
  }
}

export function Short(): boolean {
  return shortMode
}

export async function runTests(
  packagePath: string,
  tests: TestCase[],
  options: RunOptions = {},
): Promise<RunResult> {
  const previousShortMode = shortMode
  shortMode = options.short ?? false
  const count = options.count ?? 1
  let failed = 0
  let skipped = 0
  try {
    for (let run = 0; run < count; run++) {
      for (const test of tests) {
        if (options.verbose) {
          console.log('=== RUN   ' + test.name)
        }
        const t = new T(test.name)
        const start = Date.now()
        try {
          await test.fn(t)
        } catch (err) {
          if (isProcessExitError(err)) {
            throw err
          }
          if (err instanceof TestControl && err.kind === 'skip') {
            skipped++
          } else {
            t.Fail()
            if (!(err instanceof TestControl)) {
              t.Log(err)
            }
          }
        }
        await t.runCleanups()
        const elapsed = ((Date.now() - start) / 1000).toFixed(2)
        if (t.Skipped()) {
          if (options.verbose) {
            await t.flushLogs()
          }
          console.log('--- SKIP: ' + test.name + ' (' + elapsed + 's)')
          continue
        }
        if (t.Failed()) {
          failed++
          await t.flushLogs()
          console.log('--- FAIL: ' + test.name + ' (' + elapsed + 's)')
          continue
        }
        if (options.verbose) {
          await t.flushLogs()
          console.log('--- PASS: ' + test.name + ' (' + elapsed + 's)')
        }
      }
    }
    if (failed === 0) {
      if (options.verbose) {
        console.log('PASS')
      }
      return { ok: true, failed, skipped }
    }
    console.log('FAIL\t' + packagePath)
    return { ok: false, failed, skipped }
  } finally {
    shortMode = previousShortMode
  }
}

function formatMessage(format: string, args: unknown[]): MaybeText {
  const parts: MaybeText[] = []
  let index = 0
  let cursor = 0
  const verbPattern = /%#v|%\+v|%q|%[vds]/g
  let match: RegExpExecArray | null
  while ((match = verbPattern.exec(format)) !== null) {
    if (match.index > cursor) {
      parts.push(format.slice(cursor, match.index))
    }
    const value = args[index++]
    parts.push(
      match[0] === '%q' ? JSON.stringify(String(value)) : formatValue(value),
    )
    cursor = verbPattern.lastIndex
  }
  if (cursor < format.length) {
    parts.push(format.slice(cursor))
  }
  return joinMaybeText(parts, '')
}

function requireHostModule<T>(name: string, api: string): T {
  const fromProcess = (globalThis as HostGlobal).process?.getBuiltinModule?.(
    name,
  )
  if (fromProcess !== undefined && fromProcess !== null) {
    return fromProcess as T
  }
  const req = hostRequire()
  if (req !== undefined) {
    return req(name) as T
  }
  throw new Error(
    api + ' is not supported without Node-compatible host modules',
  )
}

function hostRequire(): ((name: string) => unknown) | undefined {
  const globalRequire = (globalThis as HostGlobal).require
  if (typeof globalRequire === 'function') {
    return globalRequire
  }
  try {
    const req = eval(
      'typeof require === "function" ? require : undefined',
    ) as unknown
    if (typeof req === 'function') {
      return req as (name: string) => unknown
    }
  } catch {
    return undefined
  }
  return undefined
}

function isProcessExitError(err: unknown): boolean {
  if (err === null || typeof err !== 'object') {
    return false
  }
  const code = (err as { __goscriptExitCode?: unknown }).__goscriptExitCode
  return typeof code === 'number'
}

// A transpiled Go Error() or String() method may be async, so log operands
// render through the MaybePromise convention: text when synchronous, a
// Promise that pushResolvedText settles onto the log entry otherwise.
type MaybeText = string | PromiseLike<string>

function isThenableText(value: unknown): value is PromiseLike<string> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

function formatValue(value: unknown): MaybeText {
  if (isThenableText(value)) {
    return value
  }
  if (value instanceof Error) {
    return value.message
  }
  if (
    value !== null &&
    typeof value === 'object' &&
    'Error' in value &&
    typeof value.Error === 'function'
  ) {
    return value.Error() as MaybeText
  }
  if (value === null) {
    return '<nil>'
  }
  return String(value)
}

// joinMaybeText joins rendered operands, returning a Promise only when one of
// them is still resolving.
function joinMaybeText(parts: MaybeText[], separator: string): MaybeText {
  if (parts.some(isThenableText)) {
    return Promise.all(parts.map((part) => Promise.resolve(part))).then(
      (resolved) => resolved.join(separator),
    )
  }
  return (parts as string[]).join(separator)
}
