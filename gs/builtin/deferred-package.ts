/** deferredPackages retains each package's import promise, including failures. */
const deferredPackages = new Map<string, Promise<unknown>>()

/**
 * loadDeferredPackage shares the first import result for a canonical package
 * source across all callers. The loader must import that source's module.
 */
export function loadDeferredPackage<T>(
  source: string,
  load: () => Promise<T>,
): Promise<T> {
  // Keep the first evaluation result for the runtime's lifetime.
  let pending = deferredPackages.get(source)
  if (!pending) {
    pending = load()
    deferredPackages.set(source, pending)
  }

  // A canonical source always identifies the same module type.
  return pending as Promise<T>
}
