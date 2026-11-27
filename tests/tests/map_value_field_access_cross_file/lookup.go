package main

// lookup reads the zero value synthesized for an absent map entry.
func lookup(values map[string]Foo, key string) (Foo, bool) {
	value, ok := values[key]
	return value, ok
}
