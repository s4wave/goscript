package compiler

// RuntimeHelperContract describes one helper exported by the runtime package.
type RuntimeHelperContract struct {
	// Helper identifies the compiler-visible runtime operation.
	Helper RuntimeHelper
	// Export is the symbol exported by the runtime package.
	Export string
	// Category groups the helper with related runtime operations.
	Category RuntimeHelperCategory
}
