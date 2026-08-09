package todo

// TodoList manages a collection of todos.
type TodoList struct {
	// todos contains the list entries in insertion order.
	todos []*Todo
	// nextID is assigned to the next added todo.
	nextID int64
}

// NewTodoList creates a new empty TodoList.
func NewTodoList() *TodoList {
	return &TodoList{
		todos:  make([]*Todo, 0),
		nextID: 1,
	}
}

// Add adds a new todo to the list and assigns it an ID.
func (tl *TodoList) Add(todo *Todo) *Todo {
	todo.ID = tl.nextID
	tl.nextID++
	tl.todos = append(tl.todos, todo)
	return todo
}

// Get retrieves a todo by ID. Returns nil if not found.
func (tl *TodoList) Get(id int64) *Todo {
	for _, t := range tl.todos {
		if t.ID == id {
			return t
		}
	}
	return nil
}

// Remove removes a todo by ID. Returns true if removed, false if not found.
func (tl *TodoList) Remove(id int64) bool {
	for i, t := range tl.todos {
		if t.ID == id {
			tl.todos = append(tl.todos[:i], tl.todos[i+1:]...)
			return true
		}
	}
	return false
}

// All returns all todos in the list.
func (tl *TodoList) All() []*Todo {
	return tl.todos
}

// Active returns only incomplete todos.
func (tl *TodoList) Active() []*Todo {
	result := make([]*Todo, 0)
	for _, t := range tl.todos {
		if !t.Completed {
			result = append(result, t)
		}
	}
	return result
}

// Completed returns only completed todos.
func (tl *TodoList) Completed() []*Todo {
	result := make([]*Todo, 0)
	for _, t := range tl.todos {
		if t.Completed {
			result = append(result, t)
		}
	}
	return result
}

// ByPriority returns todos filtered by priority.
func (tl *TodoList) ByPriority(p Priority) []*Todo {
	result := make([]*Todo, 0)
	for _, t := range tl.todos {
		if t.Priority == p {
			result = append(result, t)
		}
	}
	return result
}

// Count returns the total number of todos.
func (tl *TodoList) Count() int {
	return len(tl.todos)
}

// ActiveCount returns the number of incomplete todos.
func (tl *TodoList) ActiveCount() int {
	count := 0
	for _, t := range tl.todos {
		if !t.Completed {
			count++
		}
	}
	return count
}

// CompletedCount returns the number of completed todos.
func (tl *TodoList) CompletedCount() int {
	count := 0
	for _, t := range tl.todos {
		if t.Completed {
			count++
		}
	}
	return count
}

// ClearCompleted removes all completed todos.
func (tl *TodoList) ClearCompleted() int {
	removed := 0
	newTodos := make([]*Todo, 0)
	for _, t := range tl.todos {
		if t.Completed {
			removed++
		} else {
			newTodos = append(newTodos, t)
		}
	}
	tl.todos = newTodos
	return removed
}

// GetStats returns statistics about the todo list.
func (tl *TodoList) GetStats() Stats {
	stats := Stats{
		Total:      len(tl.todos),
		ByPriority: make(map[string]int),
	}

	for _, t := range tl.todos {
		if t.Completed {
			stats.Completed++
		} else {
			stats.Active++
		}

		priorityStr := PriorityString(t.Priority)
		stats.ByPriority[priorityStr]++
	}

	return stats
}
