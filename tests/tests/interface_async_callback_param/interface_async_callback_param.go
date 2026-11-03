package main

import (
	"errors"
	"runtime"
	"sync"
)

type scanner interface {
	Scan(func(int) error) error
}

type listScanner struct{}

func (listScanner) Scan(fn func(int) error) error {
	return fn(7)
}

func run(s scanner) error {
	return s.Scan(func(v int) error {
		if v != 7 {
			return errors.New("wrong value")
		}
		return nil
	})
}

// stageOpener returns a tuple through an interface method that suspends.
type stageOpener interface {
	// Open returns a value and release after opening the stage.
	Open() (int, func(), error)
}

// stageStore suspends before returning the stage tuple.
type stageStore struct{}

// Open yields before returning its tuple.
func (stageStore) Open() (int, func(), error) {
	runtime.Gosched()
	return 9, func() {}, nil
}

// openStage dispatches through an asserted interface.
func openStage(store any) (int, func(), error) {
	return store.(stageOpener).Open()
}

// resolve calls the typed resolver and releases its result.
func resolve[T any](callback func() (T, func(), error)) T {
	value, release, err := callback()
	if err != nil {
		panic(err)
	}
	release()
	return value
}

func main() {
	// Await an interface tuple through a generic resolver callback.
	println("stage:", resolve(func() (int, func(), error) {
		value, release, err := openStage(stageStore{})
		return value, release, err
	}))

	// Pass a synchronous callback through the scanner interface.
	println(run(listScanner{}) == nil)

	// Call a stored callback that invokes a runtime override.
	var m sync.Map
	callbacks := [1]func(int) error{
		func(v int) error {
			m.Load(v)
			return nil
		},
	}
	println(callbacks[0](1) == nil)
}
