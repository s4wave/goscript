package compiler

// OverrideMetadata describes compiler-visible facts from a package override.
type OverrideMetadata struct {
	// Dependencies are override package dependencies.
	Dependencies []string
	// AsyncFunctions maps package-level function names to async status.
	AsyncFunctions map[string]bool
	// AsyncMethods maps Type.Method keys to async status.
	AsyncMethods map[string]bool
}
