# Using Generated Code in a TypeScript Project

Generated code imports packages as `@goscript/<import path>/index.js`, and
package indexes import their `.gs.ts` files with explicit `.ts` extensions. A
TypeScript project that typechecks or bundles it needs three things: a path
mapping for `@goscript/*`, permission to import `.ts` files, and the
`esnext.disposable` library for `defer`.

Start from this `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "esnext.disposable", "DOM"],
    "baseUrl": ".",
    "paths": {
      "@goscript/*": ["./output/@goscript/*"]
    },
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  }
}
```

What the generated code depends on:

- `paths` maps `@goscript/*` to the generated tree.
- `moduleResolution: "bundler"` resolves those imports the way a bundler does.
- `allowImportingTsExtensions` lets package indexes import `.ts` files.
- `rewriteRelativeImportExtensions` rewrites those specifiers when TypeScript
  emits JavaScript.
- `esnext.disposable` types the `using` declarations that `defer` compiles to.

When a bundler emits JavaScript and TypeScript only typechecks, add
`"noEmit": true`.

## Running the output

Bun reads `tsconfig.json` paths, so `bun run` executes a generated
`package main` directly. Node does not resolve `paths`; bundle the output
first with Bun, Vite, esbuild, or another bundler that does.

A generated `package main` ends with a guard that calls `main()` only when the
file is the entry point, so importing it from another module does not run it.
