package compiler

import (
	"path/filepath"
	"strconv"
	"strings"
)

// DiagnosticPosition identifies the source point that caused a diagnostic.
type DiagnosticPosition struct {
	// File is the raw file identity from the compiler source owner.
	File string
	// DisplayFile is the request-relative file identity for human output.
	DisplayFile string
	// Line is the 1-based source line.
	Line int
	// Column is the 1-based source column.
	Column int
}

func formatDiagnosticPosition(pos *DiagnosticPosition) string {
	if pos == nil || pos.Line <= 0 {
		return ""
	}
	file := strings.TrimSpace(pos.DisplayFile)
	if file == "" {
		file = strings.TrimSpace(pos.File)
	}
	if file == "" {
		return ""
	}
	var b strings.Builder
	b.WriteString(filepath.ToSlash(file))
	b.WriteString(":")
	b.WriteString(strconv.Itoa(pos.Line))
	if pos.Column > 0 {
		b.WriteString(":")
		b.WriteString(strconv.Itoa(pos.Column))
	}
	return b.String()
}

func diagnosticPositionFromSource(pos sourcePosition, displayRoot string) *DiagnosticPosition {
	if pos.line <= 0 {
		return nil
	}
	file := strings.TrimSpace(pos.file)
	return &DiagnosticPosition{
		File:        file,
		DisplayFile: diagnosticDisplayFile(file, displayRoot),
		Line:        pos.line,
		Column:      pos.column,
	}
}

func diagnosticDisplayFile(file string, displayRoot string) string {
	file = strings.TrimSpace(file)
	if file == "" {
		return ""
	}
	displayRoot = strings.TrimSpace(displayRoot)
	if displayRoot == "" {
		return filepath.ToSlash(file)
	}
	root := displayRoot
	if absRoot, err := filepath.Abs(root); err == nil {
		root = absRoot
	}
	candidate := file
	if !filepath.IsAbs(candidate) {
		candidate = filepath.Join(root, candidate)
	}
	if rel, err := filepath.Rel(root, candidate); err == nil && rel != "." && rel != ".." && !strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
		return filepath.ToSlash(rel)
	}
	return filepath.ToSlash(file)
}
