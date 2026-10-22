package main

import (
	"reflect"
	"runtime"
	"slices"
)

// Node is a tree node.
type Node struct {
	Name string
	Kids []*Node
}

// Walk calls fun on n and its descendants until fun returns false. Its
// parameter only stays in the call, so reflection calls a twin of it that
// awaits the functions that reflection made.
func (n *Node) Walk(fun func(n *Node) bool) {
	if !fun(n) {
		return
	}
	for _, k := range n.Kids {
		k.Walk(fun)
	}
}

// Count returns the number of nodes under n that keep keeps, which it passes
// to a helper.
func Count(n *Node, keep func(n *Node) bool) int {
	if keep == nil {
		return 0
	}
	return count(n, keep)
}

// count is the helper of Count.
func count(n *Node, keep func(n *Node) bool) int {
	c := 0
	if keep(n) {
		c++
	}
	for _, k := range n.Kids {
		c += count(k, keep)
	}
	return c
}

// CountOf is a generic Count, which reflection cannot call: its parameter,
// whose type matches that of Walk's and count's, does not make their calls
// await.
func CountOf[T any](vals []T, keep func(v T) bool) int {
	c := 0
	for _, v := range vals {
		if keep(v) {
			c++
		}
	}
	return c
}

// Walker walks nodes.
type Walker interface {
	Walk(fun func(n *Node) bool)
}

// Tree has the Walk method of its embedded node, and Doc that of its
// embedded walker.
type Tree struct {
	*Node
	Title string
}

type Doc struct {
	Walker
}

// Button keeps the function OnClick gets, which Click calls later: its
// parameter escapes the call, so the calls of its type await.
type Button struct {
	onClick func(n int) string
	clicks  int
}

func (b *Button) OnClick(f func(n int) string) *Button {
	b.onClick = f
	return b
}

func (b *Button) Click() string {
	b.clicks++
	return b.onClick(b.clicks)
}

func main() {
	// Functions that reflection made, as an interpreter such as yaegi makes
	// the function literals of its code.
	var names []string
	visit := reflect.MakeFunc(reflect.TypeFor[func(*Node) bool](), func(args []reflect.Value) []reflect.Value {
		n := args[0].Interface().(*Node)
		names = append(names, n.Name)
		return []reflect.Value{reflect.ValueOf(n.Name != "b")}
	})
	short := reflect.MakeFunc(reflect.TypeFor[func(*Node) bool](), func(args []reflect.Value) []reflect.Value {
		return []reflect.Value{reflect.ValueOf(len(args[0].Interface().(*Node).Name) <= 2)}
	})
	root := &Node{Name: "root", Kids: []*Node{{Name: "a"}, {Name: "b", Kids: []*Node{{Name: "bc"}}}, {Name: "c"}}}

	// reflect.Value.Call passes them to an exported method and an exported
	// function, which passes it to a helper.
	reflect.ValueOf(root).MethodByName("Walk").Call([]reflect.Value{visit})
	println(len(names), names[0], names[len(names)-1])
	println(reflect.ValueOf(Count).Call([]reflect.Value{reflect.ValueOf(root), short})[0].Int())

	// The method reached through an interface, and promoted from an embedded
	// pointer and an embedded interface.
	var w Walker = root
	names = nil
	reflect.ValueOf(&w).Elem().MethodByName("Walk").Call([]reflect.Value{visit})
	println(len(names))
	names = nil
	reflect.ValueOf(&Tree{Node: root.Kids[1], Title: "t"}).MethodByName("Walk").Call([]reflect.Value{visit})
	println(len(names), names[0])
	names = nil
	reflect.ValueOf(Doc{Walker: root.Kids[0]}).MethodByName("Walk").Call([]reflect.Value{visit})
	println(len(names), names[0])

	// A function that reflection made, stored by a method that reflection
	// calls, is called later by compiled code.
	label := reflect.MakeFunc(reflect.TypeFor[func(int) string](), func(args []reflect.Value) []reflect.Value {
		return []reflect.Value{reflect.ValueOf("click " + string(rune('0'+args[0].Int())))}
	})
	b := &Button{}
	reflect.ValueOf(b).MethodByName("OnClick").Call([]reflect.Value{label})
	println(b.Click(), b.Click())

	// Compiled calls are unchanged, and the function keeps its name.
	n := 0
	root.Walk(func(k *Node) bool { n++; return true })
	println(n, Count(root, func(k *Node) bool { return k.Name != "root" }), Count(root, nil))
	println(CountOf(root.Kids, func(k *Node) bool { return len(k.Kids) == 0 }), slices.IndexFunc(root.Kids, func(k *Node) bool { return k.Name == "c" }))
	println(runtime.FuncForPC(reflect.ValueOf(Count).Pointer()).Name())
}
