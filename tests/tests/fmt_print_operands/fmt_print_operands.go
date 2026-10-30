package main

import (
	"fmt"
	"io"
	"strings"
)

// The fmt print functions are async at a call only when the static types of
// its operands allow an async Error, Format, GoString or String method, or
// for Fprint, Fprintf and Fprintln, an async Write method of the writer.

// slowName's String method receives from a channel, so it is async.
type slowName struct {
	ch chan string
}

func (s slowName) String() string {
	s.ch <- "slow"
	return <-s.ch
}

// celsius's String method is sync.
type celsius float64

func (c celsius) String() string {
	return fmt.Sprintf("%.1fC", float64(c))
}

// reading holds a slowName, which %v formats with its String method.
type reading struct {
	Name  slowName
	Value int
}

// tag's String method is sync.
type tag struct {
	name string
}

func (t tag) String() string {
	return "#" + t.name
}

// plain holds only sync values.
type plain struct {
	Tag   tag
	Count int
	Tags  []string
}

// Sync: basic operands, a type with a sync String method, and a struct of
// those.
func basics(n int, s string, f float64) string {
	return fmt.Sprintf("%d %s %.2f", n, s, f)
}

func temps(c celsius, p plain) string {
	return fmt.Sprint(c, " ", p)
}

// Async: a slowName, a struct that holds one, and an interface operand that
// may hold one.
func slow(s slowName) string {
	return fmt.Sprintf("<%v>", s)
}

func nested(r reading) string {
	return fmt.Sprintf("%v", r)
}

func anything(v any) string {
	return fmt.Sprint(v)
}

// An error operand is formatted by its Error method, an implementation of
// error.Error, which is async here: an error that fmt.Errorf makes may format
// a slowName with its message.
type codeError struct {
	code int
}

func (e *codeError) Error() string {
	return fmt.Sprintf("code %d", e.code)
}

func wrap(err error) string {
	return fmt.Sprintf("failed: %v", err)
}

// Fprintf to a strings.Builder is sync; to an io.Writer it is async, since a
// writer may be a file or a network stream.
func build(c celsius) string {
	var b strings.Builder
	fmt.Fprintf(&b, "[%v]", c)
	fmt.Fprintln(&b, "done")
	return b.String()
}

func write(w io.Writer, c celsius) {
	fmt.Fprintf(w, "(%v)\n", c)
}

func main() {
	println(basics(1, "a", 2.5))
	println(temps(21.5, plain{Tag: tag{"t"}, Count: 2, Tags: []string{"x"}}))
	println(slow(slowName{ch: make(chan string, 1)}))
	println(nested(reading{Name: slowName{ch: make(chan string, 1)}, Value: 4}))
	println(anything(celsius(1)))
	println(anything(slowName{ch: make(chan string, 1)}))
	println(wrap(&codeError{code: 7}))
	print(build(5))
	var b strings.Builder
	write(&b, 6)
	print(b.String())

	// The builtin print writes its operands with nothing between them, and
	// println separates them with spaces.
	print("print: ", 1, 2, "\n")
	println("println:", 1, 2)
}
