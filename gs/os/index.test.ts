import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { DirFS, ErrNoHandle } from './index.js'

describe('os override', () => {
  it('exports ErrNoHandle', () => {
    expect(ErrNoHandle?.Error()).toBe('os: process handle unavailable')
  })

  it('asserts a DirFS file to the io and fs interfaces it implements', () => {
    const dir = mkdtempSync(join(tmpdir(), 'goscript-os-dirfs-'))
    try {
      writeFileSync(join(dir, 'a.txt'), 'a')
      const [f, err] = DirFS(dir).Open('a.txt')
      expect(err).toBeNull()

      // The compiler emits these package-qualified names for the assertions.
      for (const name of ['io.ReaderAt', 'io.ReadSeekCloser', 'fs.File']) {
        expect($.typeAssert(f, name).ok, name).toBe(true)
      }
      expect($.typeAssert(f, 'io.ByteReader').ok).toBe(false)
      expect(f!.Close()).toBeNull()
    } finally {
      rmSync(dir, { force: true, recursive: true })
    }
  })
})
