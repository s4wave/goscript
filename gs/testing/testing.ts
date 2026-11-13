import * as $ from '@goscript/builtin/index.js'
import * as context from '@goscript/context/index.js'
import * as fmt from '@goscript/fmt/index.js'

export type TestFunc = (t: T) => void | Promise<void>
export type TB = T | B | F

export type BenchmarkFunc = (b: B) => void | Promise<void>

export type TestCase =
  | { name: string; fn: TestFunc; benchmark?: false }
  | { name: string; fn: BenchmarkFunc; benchmark: true }

export type RunOptions = {
  verbose?: boolean
  count?: number
  short?: boolean
  // benchtime is the minimum time in milliseconds to run each benchmark.
  benchtime?: number
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

// TestControl ends the goroutine that calls FailNow or SkipNow. Go implements
// both with runtime.Goexit, so it carries Goexit's name: recover does not stop
// it, and a goroutine it ends does not end the program.
class TestControl extends Error {
  public readonly kind: 'fatal' | 'skip'

  constructor(kind: 'fatal' | 'skip', message: string) {
    super(message)
    this.name = 'GoexitError'
    this.kind = kind
  }
}

let shortMode = false

// goArgs returns the variadic arguments of a call to a logging method of T.
// Go code calling the method directly passes them as rest arguments, where
// an argument of a slice type is boxed with its type. Go code calling it
// through an interface (such as the TestingT interface of testify) packs
// them into a slice, as for any variadic Go method, which arrives as the
// only argument: an unboxed array, or null when there are none.
function goArgs(args: unknown[]): unknown[] {
  // Several arguments were passed directly.
  if (args.length !== 1) {
    return args
  }

  // A single argument is a packed slice, which is empty when it is nil.
  const arg = args[0]
  if (arg === null) {
    return []
  }
  if ($.isArrayOrGoSlice(arg) && !('__goType' in arg)) {
    return $.asArray(arg)
  }
  return args
}

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
    args = goArgs(args)
    this.Log(...args)
    this.Fail()
  }

  public Errorf(format: string, ...args: unknown[]): void {
    args = goArgs(args)
    this.pushLog(fmt.Sprintf(format, ...args))
    this.Fail()
  }

  public Fatal(...args: unknown[]): never {
    args = goArgs(args)
    this.Log(...args)
    this.FailNow()
  }

  public Fatalf(format: string, ...args: unknown[]): never {
    args = goArgs(args)
    this.pushLog(fmt.Sprintf(format, ...args))
    this.FailNow()
  }

  public Log(...args: unknown[]): void {
    args = goArgs(args)
    this.pushLog(
      Promise.resolve(fmt.Sprintln(...args)).then((text) => text.slice(0, -1)),
    )
  }

  public Logf(format: string, ...args: unknown[]): void {
    args = goArgs(args)
    this.pushLog(fmt.Sprintf(format, ...args))
  }

  // logPanic logs a value the test threw. Go code cannot name it.
  public logPanic(err: unknown): void {
    this.pushLog($.panicMessage(err))
  }

  // pushLog appends an entry formatted by fmt, which may call async
  // transpiled Error() or String() methods. A placeholder holds the entry's
  // position until its text resolves; flushLogs awaits every pending entry
  // before printing.
  private pushLog(text: string | Promise<string>): void {
    const index = this.logs.length
    this.logs.push('')
    this.pendingLogText.push(
      Promise.resolve(text).then((resolved) => {
        this.logs[index] = resolved
      }),
    )
  }

  public Skip(...args: unknown[]): never {
    args = goArgs(args)
    this.Log(...args)
    this.SkipNow()
  }

  public Skipf(format: string, ...args: unknown[]): never {
    args = goArgs(args)
    this.pushLog(fmt.Sprintf(format, ...args))
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
          child.logPanic(err)
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
        child.logPanic(err)
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
    // Settle every pending entry so the printed log carries the final text.
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

  // benchTime is the minimum time in milliseconds to run the benchmark.
  public benchTime = 1000
  // verbose is whether to print the logs of the benchmark.
  public verbose = false

  private timerOn = false
  private startTime = 0
  private duration = 0 // milliseconds
  private bytes = 0
  private extra = new globalThis.Map<string, number>()
  private hasSub = false
  private subNames = new globalThis.Map<string, number>()
  private loopUsed = false
  private loopCount = 0
  private loopNextCheck = 0

  constructor(name = 'Benchmark') {
    super(name)
  }

  public async Run(name: string, fn: BenchmarkFunc): Promise<boolean> {
    // A benchmark with sub-benchmarks prints no result of its own.
    this.hasSub = true

    // Repeated names are made unique with a #NN suffix, as in Go.
    const seen = this.subNames.get(name) ?? 0
    this.subNames.set(name, seen + 1)
    if (seen > 0) {
      name += '#' + String(seen).padStart(2, '0')
    }

    // The sub-benchmark runs like the parent and fails it when it fails.
    const child = new B(this.Name() + '/' + name)
    child.benchTime = this.benchTime
    child.verbose = this.verbose
    const ok = await runBenchmark(child, fn)
    if (!ok) {
      this.Fail()
    }
    return ok
  }

  public StartTimer(): void {
    if (!this.timerOn) {
      this.startTime = performance.now()
      this.timerOn = true
    }
  }

  public StopTimer(): void {
    if (this.timerOn) {
      this.duration += performance.now() - this.startTime
      this.timerOn = false
    }
  }

  public ResetTimer(): void {
    if (this.timerOn) {
      this.startTime = performance.now()
    }
    this.duration = 0
  }

  // Elapsed returns the measured elapsed time of the benchmark as a
  // time.Duration.
  public Elapsed(): bigint {
    return BigInt(Math.round(this.elapsedMs() * 1e6))
  }

  // elapsedMs returns the measured elapsed time in milliseconds.
  public elapsedMs(): number {
    if (this.timerOn) {
      return this.duration + performance.now() - this.startTime
    }
    return this.duration
  }

  // ReportAllocs is a no-op, since allocations are not measured.
  public ReportAllocs(): void {}

  public SetBytes(bytes: number | bigint): void {
    this.bytes = Number(bytes)
  }

  public ReportMetric(n: number, unit: string): void {
    this.extra.set(unit, n)
  }

  public RunParallel(fn: (pb: PB) => void): void {
    fn(new PB(this.N))
  }

  // Loop reports whether the benchmark should keep running, as in Go: the
  // first call starts timing, and it returns false once the benchmark has
  // run for the benchmark time, recording the number of iterations as N.
  public Loop(): boolean {
    if (!this.loopUsed) {
      this.loopUsed = true
      this.loopCount = 0
      this.loopNextCheck = 1
      this.ResetTimer()
      this.StartTimer()
    }
    if (this.loopCount >= this.loopNextCheck) {
      if (this.elapsedMs() >= this.benchTime || this.loopCount >= 1e9) {
        this.StopTimer()
        this.N = this.loopCount
        return false
      }
      // Check the time again after about 5% more iterations.
      this.loopNextCheck =
        this.loopCount + Math.max(1, (this.loopCount / 20) | 0)
    }
    this.loopCount++
    return true
  }

  // runN runs the benchmark function once with N set to n.
  public async runN(fn: BenchmarkFunc, n: number): Promise<void> {
    // Each run starts with a fresh timer.
    this.N = n
    this.duration = 0
    this.timerOn = false
    this.loopUsed = false
    this.StartTimer()

    // A failure is recorded, and the timer stops however the run ends.
    try {
      await fn(this)
    } catch (err) {
      if (isProcessExitError(err)) {
        throw err
      }
      if (err instanceof TestControl && err.kind === 'skip') {
        // Skipped reports true
      } else {
        this.Fail()
        if (!(err instanceof TestControl)) {
          this.logPanic(err)
        }
      }
    }
    this.StopTimer()
  }

  // usedLoop reports whether the last run used Loop to set N itself.
  public usedLoop(): boolean {
    return this.loopUsed
  }

  // hasSubBenchmarks reports whether the benchmark ran sub-benchmarks.
  public hasSubBenchmarks(): boolean {
    return this.hasSub
  }

  // result returns the benchmark result line, as printed by go test.
  public result(): string {
    // The line is the name, the iteration count, and the metrics.
    let line = this.Name() + '\t' + String(this.N).padStart(10) + '\t'
    const nsPerOp = this.N > 0 ? (this.duration * 1e6) / this.N : 0
    line += prettyMetric(nsPerOp, 'ns/op')
    if (this.bytes > 0 && this.duration > 0) {
      const mbPerSec = (this.bytes * this.N) / (this.duration / 1000) / 1e6
      line += '\t' + mbPerSec.toFixed(2).padStart(8) + ' MB/s'
    }
    for (const [unit, n] of this.extra) {
      line += '\t' + prettyMetric(n, unit)
    }
    return line
  }
}

// prettyMetric formats a benchmark metric with a precision that depends on
// its magnitude, as go test does.
function prettyMetric(x: number, unit: string): string {
  const y = Math.abs(x)
  let s: string
  if (y === 0 || y >= 999.95) {
    s = x.toFixed(0).padStart(10)
  } else if (y >= 99.995) {
    s = x.toFixed(1).padStart(12)
  } else if (y >= 9.9995) {
    s = x.toFixed(2).padStart(13)
  } else if (y >= 0.99995) {
    s = x.toFixed(3).padStart(14)
  } else if (y >= 0.099995) {
    s = x.toFixed(4).padStart(15)
  } else if (y >= 0.0099995) {
    s = x.toFixed(5).padStart(16)
  } else {
    s = x.toFixed(6).padStart(17)
  }
  return s + ' ' + unit
}

// runBenchmark runs the benchmark function with increasing values of b.N
// until it takes at least b.benchTime, as go test does, and prints the
// result. It returns whether the benchmark passed.
async function runBenchmark(b: B, fn: BenchmarkFunc): Promise<boolean> {
  // One iteration shows whether the benchmark sizes its own loop.
  await b.runN(fn, 1)

  // Otherwise N grows until a run takes the benchmark time.
  if (!b.hasSubBenchmarks() && !b.usedLoop()) {
    let n = 1
    while (
      !b.Failed() &&
      !b.Skipped() &&
      b.elapsedMs() < b.benchTime &&
      n < 1e9
    ) {
      const last = n
      const prevMs = Math.max(b.elapsedMs(), 1e-6)
      n = Math.floor((b.benchTime * b.N) / prevMs)
      n += Math.floor(n / 5)
      n = Math.min(n, 100 * last)
      n = Math.max(n, last + 1)
      n = Math.min(n, 1e9)
      await b.runN(fn, n)
    }
  }

  // The outcome is reported as go test does.
  await b.runCleanups()
  if (b.Failed()) {
    await b.flushLogs()
    console.log('--- FAIL: ' + b.Name())
    return false
  }
  if (b.Skipped()) {
    if (b.verbose) {
      await b.flushLogs()
      console.log('--- SKIP: ' + b.Name())
    }
    return true
  }
  if (!b.hasSubBenchmarks()) {
    console.log(b.result())
  }
  if (b.verbose) {
    await b.flushLogs()
  }
  return true
}

export class F extends T {
  constructor(name = 'Fuzz') {
    super(name)
  }

  public Add(..._args: unknown[]): void {}

  public Fuzz(_fn: unknown): void {}
}

export class PB {
  private remaining: number

  constructor(n = 1) {
    this.remaining = n
  }

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

// verboseMode is whether the running tests were asked for verbose output.
let verboseMode = false

// Verbose reports whether the tests run with verbose output, as -test.v asks.
export function Verbose(): boolean {
  return verboseMode
}

// Init has nothing to do: the test runner reads its options without flags.
export function Init(): void {}

// testBinary is whether the program is a test runner (see runner.ts).
let testBinary = false

// Testing reports whether the current code is being run in a test.
export function Testing(): boolean {
  return testBinary
}

// markTestBinary records that the program is a test runner, before the
// tested packages are initialized.
export function markTestBinary(): void {
  testBinary = true
}

export async function runTests(
  packagePath: string,
  tests: TestCase[],
  options: RunOptions = {},
): Promise<RunResult> {
  const previousShortMode = shortMode
  const previousVerboseMode = verboseMode
  shortMode = options.short ?? false
  verboseMode = options.verbose ?? false
  const count = options.count ?? 1
  let failed = 0
  let skipped = 0
  const benchmarks = tests.filter((test) => test.benchmark)
  tests = tests.filter((test) => !test.benchmark)
  try {
    for (let run = 0; run < count; run++) {
      for (const test of tests) {
        if (options.verbose) {
          console.log('=== RUN   ' + test.name)
        }
        const t = new T(test.name)
        const start = Date.now()
        try {
          await (test.fn as TestFunc)(t)
        } catch (err) {
          if (isProcessExitError(err)) {
            throw err
          }
          if (err instanceof TestControl && err.kind === 'skip') {
            skipped++
          } else {
            t.Fail()
            if (!(err instanceof TestControl)) {
              t.logPanic(err)
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
    // As in go test, benchmarks run only if all of the tests pass.
    if (failed === 0) {
      for (let run = 0; run < count; run++) {
        for (const bench of benchmarks) {
          const b = new B(bench.name)
          b.benchTime = options.benchtime ?? 1000
          b.verbose = options.verbose ?? false
          if (!(await runBenchmark(b, bench.fn as BenchmarkFunc))) {
            failed++
          }
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
    verboseMode = previousVerboseMode
  }
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
