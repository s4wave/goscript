package gotest

import (
	"context"
	"sync/atomic"
	"testing"
)

// TestRunPackageTasksReportsCancelledTasks verifies that every queued task
// records an already-canceled operation before the aggregate result returns.
func TestRunPackageTasksReportsCancelledTasks(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	var cancelled atomic.Int32
	var invoked atomic.Int32

	if runPackageTasks(
		ctx,
		1,
		[]int{0, 1},
		func(context.Context, int) bool {
			invoked.Add(1)
			return true
		},
		func(int) { cancelled.Add(1) },
	) {
		t.Fatal("expected cancelled tasks to fail the group")
	}
	if invoked.Load() != 0 {
		t.Fatalf("invoked tasks = %d, want 0", invoked.Load())
	}
	if cancelled.Load() != 2 {
		t.Fatalf("cancelled tasks = %d, want 2", cancelled.Load())
	}
}
