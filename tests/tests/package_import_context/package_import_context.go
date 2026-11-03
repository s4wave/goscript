package main

import (
	"context"
	"errors"
	"time"
)

func run(ctx context.Context) {
	sctx, sctxCancel := context.WithCancel(ctx)
	defer sctxCancel()

	myCh := make(chan struct{})

	go func() {
		<-sctx.Done()
		myCh <- struct{}{}
	}()

	// Check that myCh is not readable yet
	select {
	case <-myCh:
		println("myCh should not be readable yet")
	default:
		println("myCh is not be readable yet")
	}

	// Cancel context which should trigger the goroutine
	sctxCancel()

	// Now myCh should become readable
	<-myCh

	println("read successfully")
}

func main() {
	ctx := context.Background()
	run(ctx)

	deadlineCtx, cancel := context.WithDeadline(ctx, time.Now().Add(time.Hour))
	defer cancel()
	deadline, ok := deadlineCtx.Deadline()
	println("deadline ok:", ok)
	println("deadline zero:", deadline.IsZero())

	// A deadline is an absolute lower bound, including fractional milliseconds.
	cause := errors.New("deadline cause")
	for range 8 {
		end := time.Now().Add(10*time.Millisecond + 250*time.Microsecond)
		child, stop := context.WithDeadlineCause(ctx, end, cause)
		<-child.Done()
		if time.Now().Before(end) || child.Err() != context.DeadlineExceeded || context.Cause(child) != cause {
			panic("deadline fired early or lost its cause")
		}
		stop()
	}
	println("deadline timing and cause: true")

	// Manual cancellation keeps its own cause and stops the pending timer.
	manual, stop := context.WithDeadlineCause(ctx, time.Now().Add(time.Hour), cause)
	stop()
	if manual.Err() != context.Canceled || context.Cause(manual) != context.Canceled {
		panic("manual cancellation used the deadline cause")
	}
	child, stop := context.WithDeadlineCause(manual, time.Now().Add(time.Hour), cause)
	defer stop()
	if child.Err() != context.Canceled || context.Cause(child) != context.Canceled {
		panic("canceled parent did not cancel its deadline child")
	}
	println("deadline cancellation: true")

	println("test finished")
}
