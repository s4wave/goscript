package compiler

// CompileError wraps structured diagnostics for ordinary Go error paths.
type CompileError struct {
	// Diagnostics are the structured compiler diagnostics.
	Diagnostics []Diagnostic
}

// NewCompileError creates a compile error from diagnostics.
func NewCompileError(diagnostics []Diagnostic) *CompileError {
	return &CompileError{Diagnostics: append([]Diagnostic(nil), diagnostics...)}
}

// Error returns the human-readable diagnostic summary.
func (e *CompileError) Error() string {
	if e == nil || len(e.Diagnostics) == 0 {
		return "goscript: compile failed"
	}

	return FormatDiagnostics(e.Diagnostics)
}
