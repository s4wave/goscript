package tsworkspace

import "time"

// Result describes one workspace file or process operation.
type Result struct {
	// Phase identifies the workspace operation phase.
	Phase Phase
	// Command is the process command and arguments.
	Command []string
	// Output is the captured process output.
	Output string
	// Error is the process error text, if any.
	Error string
	// Elapsed is the operation duration.
	Elapsed time.Duration
}

// Failed returns true when the operation failed.
func (r Result) Failed() bool {
	return r.Error != ""
}
