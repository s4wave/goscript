import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium, webkit } from 'playwright'
import { afterAll, describe, expect, it } from 'vitest'

const outputDir = mkdtempSync(join(tmpdir(), 'goscript-disposable-stack-'))
const outputPath = join(outputDir, 'bundle.js')
const entryPath = fileURLToPath(
  new URL('./testdata/disposable-stack-browser.ts', import.meta.url),
)

execFileSync('bun', [
  'build',
  entryPath,
  '--target=browser',
  '--format=iife',
  `--outfile=${outputPath}`,
])
const bundle = readFileSync(outputPath, 'utf8')

afterAll(() => rmSync(outputDir, { recursive: true, force: true }))

describe.each([
  ['Chromium', chromium],
  ['WebKit', webkit],
])('DisposableStack in %s', (_name, browserType) => {
  it('supports generated using declarations', async () => {
    const browser = await browserType.launch({ headless: true })
    const page = await browser.newPage()
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    try {
      await page.addScriptTag({ content: bundle })
      expect(errors).toEqual([])
      expect(
        await page.evaluate(
          async () => await globalThis.__goscriptDisposableStackResult,
        ),
      ).toEqual({
        disposeSymbolPresent: _name === 'Chromium',
        asyncDisposeSymbolPresent: _name === 'Chromium',
        usesDisposeSymbol: true,
        usesAsyncDisposeSymbol: true,
        order: ['second', 'first', 'async'],
        disposeError: 'deferred failure',
      })
    } finally {
      await browser.close()
    }
  })
})
