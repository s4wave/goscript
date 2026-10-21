package reg

var Names []string

func Add(name string) bool {
	Names = append(Names, name)
	return true
}
