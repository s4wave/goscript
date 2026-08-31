package main

func main() {
	parent := &Parent{
		Child: &Child{Name: "hello"},
		Children: []*Child{
			{Name: "one"},
			{Name: "two"},
		},
	}

	clone := parent.CloneVT()
	println("clone nil:", clone == nil)
	println("child name:", clone.Child.Name)
	println("child ptr same:", clone.Child == parent.Child)
	println("children count:", len(clone.Children))
	println("children[0]:", clone.Children[0].Name)
	println("children[1]:", clone.Children[1].Name)
	println("children ptr same:", clone.Children[0] == parent.Children[0])

	// Deep equality after clone.
	println("equal:", parent.EqualVT(clone))

	// Mutating the clone must not touch the parent.
	clone.Child.Name = "changed"
	println("parent untouched:", parent.Child.Name == "hello")
}
