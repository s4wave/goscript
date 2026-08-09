// Package todo provides the business logic for a todo list application.
// This Go code is transpiled to TypeScript using GoScript and used as the
// backend logic for a tRPC + Drizzle ORM + SQLite application.
package todo

import "time"

// Todo represents a single todo item.
type Todo struct {
	// ID is the list-assigned todo identifier.
	ID int64
	// Title is the todo summary.
	Title string
	// Description is the optional todo detail.
	Description string
	// Completed reports whether the todo is complete.
	Completed bool
	// Priority is the todo priority level.
	Priority Priority
	// CreatedAt is the Unix timestamp when the todo was created.
	CreatedAt int64
	// UpdatedAt is the Unix timestamp when the todo last changed.
	UpdatedAt int64
}

// Priority represents the priority level of a todo item.
type Priority int

const (
	PriorityLow Priority = iota
	PriorityMedium
	PriorityHigh
)

// PriorityString returns the string representation of a Priority.
func PriorityString(p Priority) string {
	switch p {
	case PriorityLow:
		return "low"
	case PriorityMedium:
		return "medium"
	case PriorityHigh:
		return "high"
	default:
		return "unknown"
	}
}

// ParsePriority parses a string into a Priority.
func ParsePriority(s string) Priority {
	switch s {
	case "low":
		return PriorityLow
	case "medium":
		return PriorityMedium
	case "high":
		return PriorityHigh
	default:
		return PriorityLow
	}
}

// NewTodo creates a new Todo with the given title.
func NewTodo(title string) *Todo {
	now := time.Now().Unix()
	return &Todo{
		Title:     title,
		Priority:  PriorityMedium,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// SetDescription sets the description and updates the timestamp.
func (t *Todo) SetDescription(desc string) {
	t.Description = desc
	t.UpdatedAt = time.Now().Unix()
}

// SetPriority sets the priority and updates the timestamp.
func (t *Todo) SetPriority(p Priority) {
	t.Priority = p
	t.UpdatedAt = time.Now().Unix()
}

// MarkComplete marks the todo as completed.
func (t *Todo) MarkComplete() {
	t.Completed = true
	t.UpdatedAt = time.Now().Unix()
}

// MarkIncomplete marks the todo as not completed.
func (t *Todo) MarkIncomplete() {
	t.Completed = false
	t.UpdatedAt = time.Now().Unix()
}

// Toggle toggles the completed state.
func (t *Todo) Toggle() {
	t.Completed = !t.Completed
	t.UpdatedAt = time.Now().Unix()
}

// IsOverdue checks if the todo is overdue based on a deadline timestamp.
// Returns false if deadline is 0 (no deadline set).
func (t *Todo) IsOverdue(deadline int64) bool {
	if deadline == 0 {
		return false
	}
	return !t.Completed && time.Now().Unix() > deadline
}

// Validate validates a todo and returns an error message if invalid.
func Validate(title string) string {
	if len(title) == 0 {
		return "title is required"
	}
	if len(title) > 200 {
		return "title must be 200 characters or less"
	}
	return ""
}

// ValidateDescription validates a description and returns an error message if invalid.
func ValidateDescription(desc string) string {
	if len(desc) > 1000 {
		return "description must be 1000 characters or less"
	}
	return ""
}
