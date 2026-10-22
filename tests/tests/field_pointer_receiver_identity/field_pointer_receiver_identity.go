package main

import "slices"

// Node keeps a pointer to itself through its pointer methods.
type Node struct {
	name string
	self *Node
}

// Register keeps the receiver in the registry.
func (n *Node) Register() {
	n.self = n
	registry = append(registry, n)
	counts[n]++
}

// Is reports whether the receiver is p.
func (n *Node) Is(p *Node) bool {
	return n == p
}

// Rename only changes the node, so its receiver is transient.
func (n *Node) Rename(name string) {
	n.name = name
}

// Wait receives from ch before it keeps the receiver, so it is async.
func (n *Node) Wait(ch chan bool) bool {
	<-ch
	n.self = n
	return n.self == n
}

// Item embeds a Node and holds others in fields, a slice and an array.
type Item struct {
	Node
	Child Node
	Group struct{ Leaf Node }
	List  []Node
	Pair  [2]Node
}

// Outer embeds an Item, whose Node's methods it promotes from two levels down.
type Outer struct {
	Item
}

// Self is a generic struct whose method keeps its receiver.
type Self[T any] struct {
	self *Self[T]
	v    T
}

// Keep keeps the receiver and v.
func (s *Self[T]) Keep(v T) {
	s.self = s
	s.v = v
}

// Namer is the interface of a node's promoted methods.
type Namer interface {
	Register()
	Is(p *Node) bool
}

// Box holds values of any type.
type Box[T any] struct {
	values []T
}

// Add keeps value.
func (b *Box[T]) Add(value T) {
	b.values = append(b.values, value)
}

// Get returns the value at i.
func (b *Box[T]) Get(i int) T {
	value := b.values[i]
	return value
}

var (
	registry []*Node
	counts   = map[*Node]int{}
	global   Node
)

func main() {
	var item Item
	item.List = make([]Node, 2)

	// A field's receiver is the field's address.
	child := &item.Child
	item.Child.Register()
	println("field:", item.Child.self == child, item.Child.Is(child), child.Is(&item.Child))

	// An embedded struct's receiver, called directly, promoted, and through
	// an interface.
	item.Node.Register()
	println("embedded:", item.self == &item.Node, item.Is(&item.Node))
	var namer Namer = &item
	println("interface:", namer.Is(&item.Node), registry[1] == &item.Node)

	// Nested fields, fields reached through a pointer, slice and array
	// elements.
	item.Group.Leaf.Register()
	println("nested:", item.Group.Leaf.self == &item.Group.Leaf)
	ptr := &item
	ptr.Child.Rename("child")
	println("through pointer:", ptr.Child.Is(&item.Child), item.Child.name)
	item.List[1].Register()
	println("slice element:", item.List[1].self == &item.List[1], item.List[1].Is(&item.List[1]))
	item.Pair[0].Register()
	println("array element:", item.Pair[0].self == &item.Pair[0])

	// Variables, local and package level.
	var local Node
	local.Register()
	println("local:", local.self == &local, global.Is(&global))

	// The registry, a pointer-keyed map and interfaces hold the same pointers.
	println("registry:", registry[0] == &item.Child, counts[&item.Child], counts[&local], len(counts))
	var a, b any = &item.Child, item.Child.self
	println("any:", a == b)

	// A method value is bound to the field's address.
	is := item.Child.Is
	println("method value:", is(&item.Child))

	// Generic code and slices keep the pointers rather than copies.
	var box Box[*Node]
	box.Add(item.Child.self)
	box.Get(0).name = "boxed"
	clone := slices.Clone(registry)
	clone[0].name += "+cloned"
	println("generic:", item.Child.name, box.Get(0) == &item.Child)

	// Methods promoted from two levels down, called directly and as a value.
	var outer Outer
	outer.Register()
	println("two levels:", outer.self == &outer.Item.Node, registry[len(registry)-1] == &outer.Node)
	register := outer.Register
	register()
	println("promoted method value:", registry[len(registry)-1] == &outer.Node, counts[&outer.Node])

	// A generic struct field and an async method keep the field's address.
	var holder struct{ B Self[int] }
	holder.B.Keep(5)
	println("generic field:", holder.B.self == &holder.B, holder.B.v)
	ch := make(chan bool, 1)
	ch <- true
	println("async:", item.Child.Wait(ch), item.Child.self == &item.Child)
}
