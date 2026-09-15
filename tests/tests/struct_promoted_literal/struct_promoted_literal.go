//go:build go1.27

package main

// Person holds a name and age for embedding.
type Person struct {
	// Name is the person's name.
	Name string
	// Age is the person's age.
	Age int
}

// Employee promotes a person's fields alongside an identifier.
type Employee struct {
	Person
	// ID is the employee identifier.
	ID int
}

// Address holds fields initialized between another embedding's fields.
type Address struct {
	// Street is the street address.
	Street string
	// City is the city name.
	City string
}

// Manager combines embeddings with direct fields.
type Manager struct {
	Person
	Address
	// Phone is the contact number.
	Phone string
	// Level is the management level.
	Level int
}

// Team adds another embedding level to an employee.
type Team struct {
	Employee
	// Active records whether the team is enabled.
	Active bool
}

// LiteralValue holds a value whose zero depends on its type argument.
type LiteralValue[T any] struct {
	// Value is the initialized value.
	Value T
	// Zero remains uninitialized.
	Zero T
}

// LiteralContainer promotes the generic value fields.
type LiteralContainer[T any] struct {
	LiteralValue[T]
}

// main compares promoted initialization, copying, and evaluation order with Go.
func main() {
	// Calls interleaved across embeddings must keep their source order.
	name := func(value string) string {
		println("evaluate", value)
		return value
	}
	m := Manager{
		Name:   name("promoted"),
		City:   name("city"),
		Age:    42,
		Phone:  name("phone"),
		Street: name("street"),
	}
	println(m.Name, m.Age, m.Street, m.City, m.Phone, m.Level)

	// Nested embeddings retain independent value copies and zero fields.
	team := &Team{Name: "nested", ID: 7, Active: true}
	copy := *team
	copy.Name = "copy"
	println(team.Name, copy.Name, team.Age, team.ID, team.Active)
	items := []*Team{{Name: "inferred"}}
	println(items[0].Name, items[0].ID)

	// Anonymous and generic structs use the same promoted field paths.
	anonymous := struct {
		Person
		Enabled bool
	}{Name: "anonymous", Enabled: true}
	println(anonymous.Name, anonymous.Age, anonymous.Enabled)
	text := LiteralContainer[string]{Value: "generic"}
	wide := LiteralContainer[int64]{Value: 17}
	println(text.Value, text.Zero, wide.Value, wide.Zero)
}
