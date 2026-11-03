package main

import "unsafe"

type first struct {
	// X is shared through the unsafe pointer view.
	X int
}

type second struct {
	// X has the same offset as first.X.
	X int
}

// count and otherCount are distinct pointer-interface dynamic types.
type count int32

type otherCount int32

// Value exposes a named scalar pointer through an interface method table.
func (p *count) Value() int32 { return int32(*p) }

// Value exposes the other type at the same scalar address.
func (p *otherCount) Value() int32 { return int32(*p) }

func main() {
	// Distinct pointers before and after an unsafe view is made.
	a := &first{X: 1}
	other := &first{X: 1}
	println("same:", a == a, a != a)
	println("distinct:", a == other, a != other)

	// A view of another type, converted back, is the same pointer.
	view := (*second)(unsafe.Pointer(a))
	back := (*first)(unsafe.Pointer(view))
	println("back:", a == back, a != back, back == a)
	println("still distinct:", a == other, back != other)

	// Fields and elements reached through the pointers agree.
	view.X = 7
	println("shared:", a.X, back.X)
	items := []*first{other, a}
	found := -1
	for i, item := range items {
		if item == back {
			found = i
		}
	}
	println("found:", found)

	// Interface pointer keys include both the address and the dynamic type.
	n := count(3)
	alias := (*otherCount)(&n)
	keys := map[any]string{&n: "first", alias: "second"}
	println("typed keys:", len(keys), keys[&n], keys[alias], any(&n) == any(alias))

	// Overwriting one dynamic type keeps the other key's entry.
	keys[&n] = "updated"
	println("overwrite:", len(keys), keys[&n], keys[alias])

	// Iteration preserves the actual interface keys of both types.
	firstSeen, secondSeen := false, false
	for key := range keys {
		firstSeen = firstSeen || key == any(&n)
		secondSeen = secondSeen || key == any(alias)
	}
	println("iteration:", firstSeen, secondSeen)

	// Deleting one dynamic type leaves the other address match intact.
	delete(keys, &n)
	println("delete:", len(keys), keys[alias])
}
