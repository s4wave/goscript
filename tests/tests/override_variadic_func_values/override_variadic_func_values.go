package main

import (
	"fmt"
	"reflect"
	"strings"
)

// apply calls f, a function value, as Go calls function values.
func apply(f func(string, ...any) string) string { return f("%v-%v", 1, 2) }

// printer holds a function value in a field.
type printer struct {
	print func(a ...any) string
}

func main() {
	// The values of variadic functions of hand-written packages take their
	// variadic arguments as a slice, as the values of Go functions do.
	f := fmt.Sprintf
	println(f("%v-%v", 1, 2))
	println(apply(fmt.Sprintf))
	args := []any{3, 4}
	println(f("%v-%v", args...))
	p := printer{print: fmt.Sprint}
	println(p.print(5, 6))
	r := strings.NewReplacer
	println(r("a", "b").Replace("aa"))
	var e func(string, ...any) error = fmt.Errorf
	println(e("x %d", 7).Error())

	// So does reflect, which calls them as Go function values, as
	// interpreters such as yaegi do.
	call := reflect.ValueOf(fmt.Sprintf).Call([]reflect.Value{reflect.ValueOf("%v-%v"), reflect.ValueOf(8), reflect.ValueOf(9)})
	println(call[0].String())

	// Direct calls are unchanged.
	println(fmt.Sprintf("%v-%v", 10, 11), fmt.Sprint(args...))
}
