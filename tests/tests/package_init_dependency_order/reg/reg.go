package reg

// Names lists the names added, in the order in which they were added.
var Names []string

// Add adds name to Names and returns the number of names.
func Add(name string) int {
	Names = append(Names, name)
	return len(Names)
}
