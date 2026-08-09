package compiler

import "strings"

// DiagnosticSeverity is the severity of a compiler diagnostic.
type DiagnosticSeverity string

const (
	// DiagnosticSeverityError marks a diagnostic that stops compilation.
	DiagnosticSeverityError DiagnosticSeverity = "error"
	// DiagnosticSeverityWarning marks a diagnostic that does not stop compilation.
	DiagnosticSeverityWarning DiagnosticSeverity = "warning"
)

// Diagnostic is a structured compiler message surfaced by every adapter.
type Diagnostic struct {
	// Severity is the diagnostic severity.
	Severity DiagnosticSeverity
	// Code is a stable machine-readable diagnostic code.
	Code string
	// Message is the short human-readable diagnostic.
	Message string
	// Detail carries optional longer guidance.
	Detail string
	// Position is the optional source point that caused the diagnostic.
	Position *DiagnosticPosition
}

// FormatDiagnostics returns the canonical human-readable diagnostic summary.
func FormatDiagnostics(diagnostics []Diagnostic) string {
	var b strings.Builder
	for i, diag := range diagnostics {
		if i != 0 {
			b.WriteString("; ")
		}
		b.WriteString(FormatDiagnostic(diag))
	}
	return b.String()
}

// FormatDiagnostic returns the canonical human-readable form of one diagnostic.
func FormatDiagnostic(diag Diagnostic) string {
	var b strings.Builder
	if pos := formatDiagnosticPosition(diag.Position); pos != "" {
		b.WriteString(pos)
		b.WriteString(": ")
	}
	if diag.Code != "" {
		b.WriteString(diag.Code)
		b.WriteString(": ")
	}
	b.WriteString(diag.Message)
	if diag.Detail != "" {
		b.WriteString(" (")
		b.WriteString(diag.Detail)
		b.WriteString(")")
	}
	return b.String()
}

func diagnosticsHaveErrors(diagnostics []Diagnostic) bool {
	for _, diag := range diagnostics {
		if diag.Severity == DiagnosticSeverityError {
			return true
		}
	}
	return false
}
