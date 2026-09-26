package main

import "sync/atomic"

type (
	Process  = func(snap *Snapshot, n int) (*int, []int, error)
	SnapFunc = func(n int) (*int, []int, error)
)

type Snapshot struct {
	base int
}

// Apply calls cb with the snapshot's value.
func (s *Snapshot) Apply(n int, cb SnapFunc) (int, error) {
	next, results, err := cb(s.base + n)
	if err != nil {
		return 0, err
	}
	return *next + len(results), nil
}

type Host struct {
	process atomic.Pointer[Process]
}

// processor wraps the stored process in a snapshot callback.
func (h *Host) processor() func(n int) (int, error) {
	cb := h.process.Load()
	if cb == nil {
		return nil
	}
	return func(n int) (int, error) {
		snap := &Snapshot{base: 10}
		return snap.Apply(n, func(n int) (*int, []int, error) {
			return (*cb)(snap, n)
		})
	}
}

func main() {
	ch := make(chan int, 1)
	ch <- 5
	var process Process = func(snap *Snapshot, n int) (*int, []int, error) {
		next := n + <-ch
		return &next, []int{snap.base}, nil
	}

	h := &Host{}
	h.process.Store(&process)
	got, err := h.processor()(1)
	println("pointer callback", got, err == nil)
}
