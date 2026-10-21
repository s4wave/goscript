import { describe, expect, it } from 'vitest'

import { Args, Exit, ProcessExitError } from './proc.gs.js'
import { runtime_args } from './proc_js.gs.js'

describe('os process control', () => {
  it('throws a structured browser exit error when process.exit is unavailable', () => {
    const originalProcess = (globalThis as { process?: unknown }).process
    try {
      ;(globalThis as { process?: unknown }).process = {}

      let err: unknown
      try {
        Exit(7)
      } catch (caught) {
        err = caught
      }

      expect(err).toBeInstanceOf(ProcessExitError)
      expect((err as { __goscriptExitCode?: number }).__goscriptExitCode).toBe(
        7,
      )
    } finally {
      ;(globalThis as { process?: unknown }).process = originalProcess
    }
  })

  it('holds the program arguments without an init call', () => {
    expect(Args?.length).toBeGreaterThan(0)
  })

  it('reports the script path as the program name', () => {
    const originalProcess = (globalThis as { process?: unknown }).process
    try {
      ;(globalThis as { process?: unknown }).process = {
        argv: ['bun', './main.js', '-v', 'input'],
      }

      expect(Array.from(runtime_args() ?? [])).toEqual([
        './main.js',
        '-v',
        'input',
      ])
    } finally {
      ;(globalThis as { process?: unknown }).process = originalProcess
    }
  })

  it('names the program "js" in a browser, as Go does', () => {
    const originalProcess = (globalThis as { process?: unknown }).process
    try {
      ;(globalThis as { process?: unknown }).process = undefined

      expect(Array.from(runtime_args() ?? [])).toEqual(['js'])
    } finally {
      ;(globalThis as { process?: unknown }).process = originalProcess
    }
  })
})
