package main

type holder struct {
	values map[string]int
	items  []item
}

type item struct{ value int }

func (i *item) increment() int {
	i.value++
	return i.value
}

func main() {
	k := holder{values: map[string]int{"a": 1, "b": 2}}
	sum := 0
	for k, v := range k.values {
		sum += len(k) + v
	}
	println(sum)
	items := holder{items: []item{{value: 3}, {value: 7}}}
	for _, items := range items.items {
		println(items.increment())
	}
	println(items.items[0].value, items.items[1].value)
}
