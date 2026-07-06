package registry

var registrations = make(map[string]bool)

func Register(name string) {
	registrations[name] = true
}

func Registered(name string) bool {
	return registrations[name]
}
