package main

type entry struct {
	key string
}

type object struct {
	entries []entry
}

func (o *object) next() *entry {
	if cap(o.entries) > len(o.entries) {
		o.entries = o.entries[:len(o.entries)+1]
	} else {
		o.entries = append(o.entries, entry{})
	}
	return &o.entries[len(o.entries)-1]
}

func parseKey() (string, error) {
	return "parsed", nil
}

func printInterfaceSpareZero() {
	values := make([]any, 0, 2)
	values = append(values, entry{key: "value"})
	values = values[:2]
	println(values[1] == nil)
}

func printInterfaceAppendSliceSpareZero() {
	values := make([]any, 0, 2)
	values = append(values, []any{entry{key: "value"}}...)
	values = values[:2]
	println(values[1] == nil)
}

func main() {
	o := &object{}
	for i := range 4 {
		entry := o.next()
		entry.key = "set"
		println(i, entry.key)
	}

	entry := o.next()
	var err error
	entry.key, err = parseKey()
	println(entry.key, err == nil)
	printInterfaceSpareZero()
	printInterfaceAppendSliceSpareZero()
}
