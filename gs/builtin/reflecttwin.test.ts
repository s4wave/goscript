import { describe, expect, it } from 'vitest'

import {
  bindReflectMethod,
  callReflectTwin,
  namedFunction,
  reflectTwin,
  setReflectTwin,
} from './type.js'

describe('reflection twins', () => {
  it('finds the twin of a package function, also through a typed wrapper', () => {
    function Sum(): number {
      return 1
    }
    async function Sum$reflect(): Promise<number> {
      return 2
    }
    setReflectTwin(Sum, Sum$reflect)
    const typed = namedFunction(Sum, 'example.com/pkg.Adder')

    expect(typed).not.toBe(Sum)
    expect(reflectTwin(Sum)).toBe(Sum$reflect)
    expect(reflectTwin(typed)).toBe(Sum$reflect)
  })

  it('returns a function without a twin itself', () => {
    function plain(): void {}
    expect(reflectTwin(plain)).toBe(plain)
  })

  it('binds the twin of a method with the method', async () => {
    class Node {
      constructor(public name: string) {}
      Walk(): string {
        return this.name
      }
      async Walk$reflect(): Promise<string> {
        return this.name + ' twin'
      }
      Plain(): string {
        return this.name
      }
    }
    const node = new Node('n')
    const walk = bindReflectMethod(node, 'Walk', node.Walk)
    const plain = bindReflectMethod(node, 'Plain', node.Plain)

    expect(walk()).toBe('n')
    expect(await reflectTwin(walk)()).toBe('n twin')
    expect(reflectTwin(plain)).toBe(plain)
    expect(await callReflectTwin(node, 'Walk')).toBe('n twin')
    expect(callReflectTwin(node, 'Plain')).toBe('n')
  })
})
