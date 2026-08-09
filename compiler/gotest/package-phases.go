package gotest

// PackagePhases records structured package-test phase status.
type PackagePhases struct {
	// Workspace covers workspace files and tool discovery.
	Workspace PhaseStatus
	// Compile covers GoScript compile/lowering work.
	Compile PhaseStatus
	// Emit covers TypeScript emit/copy output work.
	Emit PhaseStatus
	// TypeCheck covers tsgo execution.
	TypeCheck PhaseStatus
	// Runtime covers Bun test execution.
	Runtime PhaseStatus
}
