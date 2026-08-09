package gotest

import (
	"context"

	"github.com/aperturerobotics/util/conc"
)

// runPackageTasks executes package tasks through a bounded ordered queue and
// waits for every queued task before aggregating its result.
func runPackageTasks(
	ctx context.Context,
	parallelism int,
	indexes []int,
	run func(context.Context, int) bool,
	cancel func(int),
) bool {
	results := make([]bool, len(indexes))
	jobs := make([]func(), len(indexes))
	for taskIdx, packageIdx := range indexes {
		jobs[taskIdx] = func() {
			if ctx.Err() != nil {
				cancel(packageIdx)
				return
			}
			results[taskIdx] = run(ctx, packageIdx)
		}
	}

	queue := conc.NewConcurrentQueue(max(parallelism, 1))
	queue.Enqueue(jobs...)
	_ = queue.WaitIdle(context.Background(), nil)

	for _, succeeded := range results {
		if !succeeded {
			return false
		}
	}
	return true
}
