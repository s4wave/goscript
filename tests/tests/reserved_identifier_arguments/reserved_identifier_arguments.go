package main

type Parser struct{}

func (Parser) Parse(arguments []string) int {
	return len(arguments)
}

func collect(arguments string) string {
	return arguments + "!"
}

// enum is a type alias named after a TypeScript reserved word.
type enum = int

func double(e enum) enum {
	return e * 2
}

func main() {
	println(Parser{}.Parse([]string{"a", "b"}))
	println(collect("ok"))
	println(double(21))
}
