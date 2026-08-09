package todo

// Stats holds statistics about the todo list.
type Stats struct {
	// Total is the number of todos in the list.
	Total int
	// Active is the number of incomplete todos.
	Active int
	// Completed is the number of completed todos.
	Completed int
	// ByPriority maps each priority label to its todo count.
	ByPriority map[string]int
}
