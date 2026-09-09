package main

import (
	"bytes"
	"fmt"
	"strings"

	"github.com/sirupsen/logrus"
)

// Inner supplies a nested value field for formatting.
type Inner struct {
	// Ready is included even when it is false.
	Ready bool
}

// Record combines named, unexported, and nested fields.
type Record struct {
	// Count is the numeric field.
	Count int
	// name is visible to formatting despite being unexported.
	name string
	// Inner is a nested value.
	Inner Inner
}

// Pointers retains scalar and recursive references for formatting.
type Pointers struct {
	// Value points to a scalar, which formats as an address.
	Value *int
	// Next can point back to this record.
	Next *Pointers
	// Dynamic holds a pointer behind an interface.
	Dynamic any
}

// main compares generated value and pointer formatting with native Go.
func main() {
	value := Record{Count: 3, name: "hello", Inner: Inner{Ready: true}}
	println(fmt.Sprintf("%v", value))
	println(fmt.Sprintf("%+v", value))
	println(fmt.Sprintf("%v", &value))
	println(fmt.Sprintf("%+v", &value))
	println(fmt.Sprint(&value))
	println(fmt.Sprintf("%#v", value))
	println(fmt.Sprintf("%#v", &value))

	anonymous := struct{ Count int }{Count: 4}
	println(fmt.Sprintf("%v", anonymous))
	println(fmt.Sprintf("%+v", anonymous))
	println(fmt.Sprintf("%v", &anonymous))
	println(fmt.Sprintf("%+v", &anonymous))

	// Addresses differ across runtimes; their identity and surrounding text agree.
	count := 7
	pointers := Pointers{Value: &count}
	pointers.Next = &pointers
	pointers.Dynamic = &pointers
	text := fmt.Sprintf("%+v", &pointers)
	text = strings.ReplaceAll(text, fmt.Sprintf("%p", &count), "<scalar>")
	text = strings.ReplaceAll(text, fmt.Sprintf("%p", &pointers), "<self>")
	println(text)

	// Exercise the same log field formatting used by controller shutdown warnings.
	var output bytes.Buffer
	logger := logrus.New()
	logger.SetOutput(&output)
	logger.SetFormatter(&logrus.TextFormatter{DisableColors: true, DisableTimestamp: true})
	logger.WithField("controller", &value).Warn("waiting for controller Execute to return")
	println(strings.TrimSpace(output.String()))
}
