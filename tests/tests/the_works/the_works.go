// The works: a tiny stack machine. Three programs run at once on
// goroutines and report over channels, and a crash is caught by recover.
package main

// Op is a stack machine instruction.
type Op int

const (
	Push Op = iota
	Dup
	Over
	Swap
	Drop
	Dec
	Add
	Mul
	Jnz
	Halt
)

var opNames = map[Op]string{
	Push: "push", Dup: "dup", Over: "over", Swap: "swap", Drop: "drop",
	Dec: "dec", Add: "add", Mul: "mul", Jnz: "jnz", Halt: "halt",
}

func (o Op) String() string { return opNames[o] }

// Instr is an instruction and its argument.
type Instr struct {
	Op  Op
	Arg int64
}

// Program is a named list of instructions.
type Program struct {
	Name string
	Code []Instr
}

// Listing yields each instruction with its address, for range-over-func.
func (p Program) Listing() func(yield func(int, Instr) bool) {
	return func(yield func(int, Instr) bool) {
		for pc, in := range p.Code {
			if !yield(pc, in) {
				return
			}
		}
	}
}

// Stack is a generic last-in, first-out stack.
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }

func (s *Stack[T]) Pop() T {
	if len(s.items) == 0 {
		panic("stack underflow")
	}
	v := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return v
}

// VM runs one program on a stack of int64 values.
type VM struct {
	pc    int
	steps int
	stack Stack[int64]
}

// Step runs one instruction and reports whether the program halted.
func (vm *VM) Step(code []Instr) bool {
	in := code[vm.pc]
	vm.pc++
	vm.steps++
	s := &vm.stack
	switch in.Op {
	case Push:
		s.Push(in.Arg)
	case Dup:
		v := s.Pop()
		s.Push(v)
		s.Push(v)
	case Over:
		b, a := s.Pop(), s.Pop()
		s.Push(a)
		s.Push(b)
		s.Push(a)
	case Swap:
		b, a := s.Pop(), s.Pop()
		s.Push(b)
		s.Push(a)
	case Drop:
		s.Pop()
	case Dec:
		s.Push(s.Pop() - 1)
	case Add:
		s.Push(s.Pop() + s.Pop())
	case Mul:
		s.Push(s.Pop() * s.Pop())
	case Jnz:
		if s.Pop() != 0 {
			vm.pc = int(in.Arg)
		}
	case Halt:
		return true
	}
	return false
}

// Report is what a finished program sends back.
type Report interface {
	Program() string
}

// Answer is the value a program left on its stack.
type Answer struct {
	Name  string
	Value int64
	Steps int
}

func (a Answer) Program() string { return a.Name }

// Fault is a program that crashed.
type Fault struct {
	Name   string
	Reason string
}

func (f *Fault) Program() string { return f.Name }

// run executes p and sends its answer, or a fault when it panics.
func run(p Program, answers chan<- Answer, faults chan<- *Fault) {
	defer func() {
		if r := recover(); r != nil {
			faults <- &Fault{Name: p.Name, Reason: r.(string)}
		}
	}()
	vm := &VM{}
	for !vm.Step(p.Code) {
	}
	answers <- Answer{Name: p.Name, Value: vm.stack.Pop(), Steps: vm.steps}
}

// factorial builds a program that computes n! with a loop.
func factorial(name string, n int64) Program {
	return Program{Name: name, Code: []Instr{
		{Push, 1}, {Push, n},
		{Swap, 0}, {Over, 0}, {Mul, 0}, {Swap, 0}, {Dec, 0}, {Dup, 0}, {Jnz, 2},
		{Drop, 0}, {Halt, 0},
	}}
}

func main() {
	programs := []Program{
		factorial("20!", 20),
		// 21! overflows int64 and wraps exactly as it does in Go.
		factorial("21!", 21),
		{Name: "broken", Code: []Instr{{Push, 1}, {Add, 0}, {Halt, 0}}},
	}

	println("listing of", programs[0].Name)
	for pc, in := range programs[0].Listing() {
		if in.Op == Push || in.Op == Jnz {
			println(" ", pc, in.Op.String(), in.Arg)
			continue
		}
		println(" ", pc, in.Op.String())
	}

	answers := make(chan Answer)
	faults := make(chan *Fault)
	for _, p := range programs {
		go run(p, answers, faults)
	}

	reports := make(map[string]Report)
	for len(reports) < len(programs) {
		select {
		case a := <-answers:
			reports[a.Name] = a
		case f := <-faults:
			reports[f.Name] = f
		}
	}

	totalSteps := 0
	for _, p := range programs {
		switch r := reports[p.Name].(type) {
		case Answer:
			totalSteps += r.Steps
			println(r.Program(), "=", r.Value, "in", r.Steps, "steps")
		case *Fault:
			println(r.Program(), "crashed:", r.Reason)
		}
	}
	println("total steps:", totalSteps)
}
