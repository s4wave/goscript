package main

import (
	"errors"
	"os"
)

type customErr struct {
	// msg is the error's stable text.
	msg string
}

// Error returns the error's text.
func (e *customErr) Error() string {
	return e.msg
}

// Timeout lets a syscall wrapper expose its underlying timeout behavior.
func (*customErr) Timeout() bool {
	return true
}

type scalarErr uint8

// Error returns the scalar error's text.
func (scalarErr) Error() string {
	return "scalar error"
}

type wrappedErr struct {
	// err is the wrapped error.
	err error
}

// Error includes the wrapped error's text.
func (e wrappedErr) Error() string {
	return "wrapped: " + e.err.Error()
}

// Unwrap returns the original error.
func (e wrappedErr) Unwrap() error {
	return e.err
}

func main() {
	// Construct two independent errors.
	err1 := errors.New("first error")
	err2 := errors.New("second error")

	// Format each message without merging the errors' identity.
	println("err1:", err1.Error())
	println("err2:", err2.Error())

	// Compare independent error values and nil.
	println("err1 == err2:", err1 == err2)
	println("err1 == nil:", err1 == nil)

	// An uninitialized error interface is nil.
	var nilErr error
	println("nilErr == nil:", nilErr == nil)

	// Extract the concrete pointer through a wrapper's Unwrap method.
	typedErr := &customErr{msg: "typed error"}
	matched, ok := errors.AsType[*customErr](wrappedErr{err: typedErr})
	println("AsType matched:", ok)
	if ok {
		println("AsType message:", matched.msg)
	}
	_, ok = errors.AsType[*customErr](err1)
	println("AsType missing:", ok)

	// Type extraction also preserves a named scalar error's value.
	var scalarTarget scalarErr
	println("As scalar missing:", errors.As(err1, &scalarTarget), scalarTarget)
	println(
		"As scalar matched:",
		errors.As(scalarErr(42), &scalarTarget),
		scalarTarget,
	)

	// A syscall wrapper preserves the operation and its underlying error.
	sysErr := os.NewSyscallError("connect", typedErr)
	println("syscall:", sysErr.Error(), errors.Is(sysErr, typedErr), os.IsTimeout(sysErr))
	details, ok := sysErr.(*os.SyscallError)
	println("syscall details:", ok, details.Syscall, details.Err == typedErr)
	println("syscall nil:", os.NewSyscallError("connect", nil) == nil)
	println("test finished")
}
