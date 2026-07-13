import { configDefaults, defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      '.tmp',
      'dist',
      'vendor',
      '**/vendor',
      '**/tests.browser.test.ts',
      'website/tests/**', // Browser-only tests, run separately with website/vitest.config.ts
    ],
  },
  resolve: {
    alias: [
      {
        find: '@goscript/crypto/index.js',
        replacement: resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'tests/deps/crypto/index.ts',
        ),
      },
      // Map @goscript/*.js to gs/*.ts for existing handwritten sources
      {
        find: /^@goscript\/(.*)\.js$/,
        replacement: resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'gs/$1.ts',
        ),
      },
      // Map @goscript/* to gs/*, including explicit .ts specifiers from compiler output
      {
        find: /^@goscript\/(.*)$/,
        replacement: resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'gs/$1',
        ),
      },
    ],
  },
})
