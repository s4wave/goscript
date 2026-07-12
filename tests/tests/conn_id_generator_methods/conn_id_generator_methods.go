package main

type transport struct {
	values map[int]int
}

func (h *transport) SourceOnly(id int) {
	h.values[id] = id
}

type (
	packetHandlerMap transport
	connRunner       interface {
		Add(int)
	}
)

type sourceRunner interface {
	SourceOnly(int)
}

func (h *packetHandlerMap) Add(id int) {
	h.values[id] = id
}

type connRunnerCallbacks struct {
	AddConnectionID func(int)
}

type connRunners map[connRunner]connRunnerCallbacks

func (cr connRunners) AddConnectionID(id int) {
	for _, c := range cr {
		c.AddConnectionID(id)
	}
}

func newConnRunnerCallbacks(runner connRunner) connRunnerCallbacks {
	return connRunnerCallbacks{
		AddConnectionID: func(id int) { runner.Add(id) },
	}
}

func testVarRefConversion() {
	value := transport{values: make(map[int]int)}
	source := &value
	destination := (*packetHandlerMap)(source)
	destination.Add(9)
	value = transport{values: make(map[int]int)}
	destination.Add(10)
	println("varref destination:", value.values[10])
}

func main() {
	t := &transport{values: make(map[int]int)}
	runner := (*packetHandlerMap)(t)
	t.SourceOnly(3)
	runnerAgainDest := (*packetHandlerMap)(t)
	runners := connRunners{runner: newConnRunnerCallbacks(runner)}
	var sourceInterface sourceRunner = t
	var destinationInterface connRunner = runner
	runners.AddConnectionID(7)
	runnerAgain := (*transport)(runner)
	println("source:", t.values[3])
	println("same destination view:", runner == runnerAgainDest)
	println("destination:", t.values[7])
	println("same pointer:", t == runnerAgain)
	println("boxed same pointer:", t == runnerAgain)
	sourceInterface.SourceOnly(4)
	destinationInterface.Add(8)
	pointerValues := map[*transport]int{t: 42}
	println("map lookup:", pointerValues[runnerAgain])
	testVarRefConversion()
}
