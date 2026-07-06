import { readdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { compile } from '../compiler/index.ts'

type BenchModule = {
  main?: () => void | Promise<void>
}

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const workRoot = join(repoRoot, '.tmp', 'runtime-glue-bench')
const outputRoot = join(workRoot, 'output')

await rm(workRoot, { recursive: true, force: true })

await compile({
  pkg: './tests/bench/runtime_glue',
  output: outputRoot,
  dir: repoRoot,
})

const entrypoint = await findGeneratedMain(join(outputRoot, '@goscript'))
if (entrypoint === '') {
  throw new Error(`generated benchmark entrypoint was not found under ${outputRoot}`)
}

// Runtime-selected generated output path: the GoScript compiler owns the module
// directory under output/@goscript, so a static import cannot name it here.
const benchModule = (await import(pathToFileURL(entrypoint).href)) as BenchModule
if (typeof benchModule.main !== 'function') {
  throw new Error(`generated benchmark entrypoint does not export main(): ${entrypoint}`)
}

await benchModule.main()

async function findGeneratedMain(root: string): Promise<string> {
  const entries = await readdir(root, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(root, entry.name)
    if (entry.isDirectory()) {
      const found = await findGeneratedMain(path)
      if (found !== '') {
        return found
      }
      continue
    }
    if (entry.isFile() && entry.name === 'main.gs.ts') {
      return path
    }
  }
  return ''
}
