package main

// Level is a named non-struct type with a value method.
type Level int

func (l Level) Rank(prefix string) string {
	if l > 2 {
		return prefix + "senior"
	}
	return prefix + "junior"
}

type Ranker interface {
	Rank(prefix string) string
}

// Engineer promotes Rank from its embedded Level.
type Engineer struct {
	Level
	Name string
}

func main() {
	eng := Engineer{Level: 3, Name: "Grace"}
	println("direct:", eng.Rank("rank: "))

	var r Ranker = eng
	println("interface:", r.Rank("value: "))

	r = &Engineer{Level: 1, Name: "Ada"}
	println("pointer:", r.Rank("pointer: "))
}
