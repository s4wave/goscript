import { AsyncDisposableStack, DisposableStack } from '../defer.js'

type DisposableStackResult = {
  disposeSymbolPresent: boolean
  asyncDisposeSymbolPresent: boolean
  usesDisposeSymbol: boolean
  usesAsyncDisposeSymbol: boolean
  order: string[]
  disposeError: string | undefined
}

declare global {
  var __goscriptDisposableStackResult:
    | Promise<DisposableStackResult>
    | undefined
}

globalThis.__goscriptDisposableStackResult = (async () => {
  const disposeSymbol = Symbol.dispose ?? Symbol.for('Symbol.dispose')
  const asyncDisposeSymbol =
    Symbol.asyncDispose ?? Symbol.for('Symbol.asyncDispose')
  const result: DisposableStackResult = {
    disposeSymbolPresent: typeof Symbol.dispose === 'symbol',
    asyncDisposeSymbolPresent: typeof Symbol.asyncDispose === 'symbol',
    usesDisposeSymbol:
      typeof Object.getOwnPropertyDescriptor(
        DisposableStack.prototype,
        disposeSymbol,
      )?.value === 'function',
    usesAsyncDisposeSymbol:
      typeof Object.getOwnPropertyDescriptor(
        AsyncDisposableStack.prototype,
        asyncDisposeSymbol,
      )?.value === 'function',
    order: [],
    disposeError: undefined,
  }

  {
    using stack = new DisposableStack()
    stack.defer(() => result.order.push('first'))
    stack.defer(() => result.order.push('second'))
  }

  await (async () => {
    await using stack = new AsyncDisposableStack()
    stack.defer(async () => {
      result.order.push('async')
    })
  })()

  try {
    {
      using stack = new DisposableStack()
      stack.defer(() => {
        throw new Error('deferred failure')
      })
    }
  } catch (error) {
    result.disposeError = error instanceof Error ? error.message : String(error)
  }

  return result
})()
