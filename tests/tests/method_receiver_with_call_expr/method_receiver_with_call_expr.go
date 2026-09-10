package main

type State struct {
	value int
	index *int
}

func (s *State) Process() {
	// This should generate:
	// const s = this
	// ;(getProcessor())!(s)
	// The semicolon is important to prevent: const s = this(getProcessor())!(s)
	getProcessor()(s)
}

func getProcessor() func(*State) {
	return func(s *State) {
		s.value = 42
	}
}

func (s *State) markIndex() {
	// The first body statement begins with a parenthesized pointer expression.
	*s.index = -1
}

func main() {
	state := &State{}
	state.Process()
	println("value:", state.value)
	index := 7
	state.index = &index
	state.markIndex()
	println("index:", index)
}
