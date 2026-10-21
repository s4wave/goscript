// Generated file based on struct_promoted_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Person {
	// Name is the person's name.
	public declare Name: string

	// Age is the person's age.
	public declare Age: number

	constructor(__goscriptValue?: boolean, Name$?: string, Age$?: number) {
		this.Name = Name$ ?? ""
		this.Age = Age$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Person {
		return new Person(true, this.Name, this.Age)
	}

	public __goscriptAssign(source: Person): this {
		this.Name = source.Name
		this.Age = source.Age
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		() => new Person(),
		() => [],
		Person,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "Age", key: "Age", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Employee {
	public declare Person: Person

	// ID is the employee identifier.
	public declare ID: number

	constructor(__goscriptValue?: boolean, Person$?: Person, ID$?: number) {
		this.Person = Person$ ?? new Person(true)
		this.ID = ID$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Employee {
		return new Employee(true, this.Person.clone(), this.ID)
	}

	public __goscriptAssign(source: Employee): this {
		this.Person.__goscriptAssign(source.Person)
		this.ID = source.ID
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Employee",
		() => new Employee(),
		() => [],
		Employee,
		() => [{ name: "Person", key: "Person", type: "main.Person", anonymous: true }, { name: "ID", key: "ID", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Address {
	// Street is the street address.
	public declare Street: string

	// City is the city name.
	public declare City: string

	constructor(__goscriptValue?: boolean, Street$?: string, City$?: string) {
		this.Street = Street$ ?? ""
		this.City = City$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Address {
		return new Address(true, this.Street, this.City)
	}

	public __goscriptAssign(source: Address): this {
		this.Street = source.Street
		this.City = source.City
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Address",
		() => new Address(),
		() => [],
		Address,
		() => [{ name: "Street", key: "Street", type: /* @__PURE__ */ $.basicType("string") }, { name: "City", key: "City", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Manager {
	public declare Person: Person

	public declare Address: Address

	// Phone is the contact number.
	public declare Phone: string

	// Level is the management level.
	public declare Level: number

	constructor(__goscriptValue?: boolean, Person$?: Person, Address$?: Address, Phone$?: string, Level$?: number) {
		this.Person = Person$ ?? new Person(true)
		this.Address = Address$ ?? new Address(true)
		this.Phone = Phone$ ?? ""
		this.Level = Level$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Manager {
		return new Manager(true, this.Person.clone(), this.Address.clone(), this.Phone, this.Level)
	}

	public __goscriptAssign(source: Manager): this {
		this.Person.__goscriptAssign(source.Person)
		this.Address.__goscriptAssign(source.Address)
		this.Phone = source.Phone
		this.Level = source.Level
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Manager",
		() => new Manager(),
		() => [],
		Manager,
		() => [{ name: "Person", key: "Person", type: "main.Person", anonymous: true }, { name: "Address", key: "Address", type: "main.Address", anonymous: true }, { name: "Phone", key: "Phone", type: /* @__PURE__ */ $.basicType("string") }, { name: "Level", key: "Level", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Team {
	public declare Employee: Employee

	// Active records whether the team is enabled.
	public declare Active: boolean

	constructor(__goscriptValue?: boolean, Employee$?: Employee, Active$?: boolean) {
		this.Employee = Employee$ ?? new Employee(true)
		this.Active = Active$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Team {
		return new Team(true, this.Employee.clone(), this.Active)
	}

	public __goscriptAssign(source: Team): this {
		this.Employee.__goscriptAssign(source.Employee)
		this.Active = source.Active
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Team",
		() => new Team(),
		() => [],
		Team,
		() => [{ name: "Employee", key: "Employee", type: "main.Employee", anonymous: true }, { name: "Active", key: "Active", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export class LiteralValue {
	// Value is the initialized value.
	public declare Value: any

	// Zero remains uninitialized.
	public declare Zero: any

	constructor(__goscriptValue?: boolean, Value$?: any, Zero$?: any) {
		this.Value = Value$ ?? (null! as any)
		this.Zero = Zero$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): LiteralValue {
		return $.copyGenericInstance(this, new LiteralValue(true, $.copyElement(this.Value), $.copyElement(this.Zero)))
	}

	public __goscriptAssign(source: LiteralValue): this {
		this.Value = $.assignFieldValue(this.Value, source.Value)
		this.Zero = $.assignFieldValue(this.Zero, source.Zero)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.LiteralValue",
		() => new LiteralValue(),
		() => [],
		LiteralValue,
		() => [{ name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Zero", key: "Zero", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class LiteralContainer {
	public declare LiteralValue: LiteralValue

	constructor(__goscriptValue?: boolean, LiteralValue$?: LiteralValue) {
		this.LiteralValue = LiteralValue$ ?? new LiteralValue(true, null, null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): LiteralContainer {
		return $.copyGenericInstance(this, new LiteralContainer(true, this.LiteralValue.clone()))
	}

	public __goscriptAssign(source: LiteralContainer): this {
		this.LiteralValue.__goscriptAssign(source.LiteralValue)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.LiteralContainer",
		() => new LiteralContainer(),
		() => [],
		LiteralContainer,
		() => [{ name: "LiteralValue", key: "LiteralValue", type: "main.LiteralValue", anonymous: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Calls interleaved across embeddings must keep their source order.
	let name = $.functionValue(async (value: string): globalThis.Promise<string> => {
		await $.println("evaluate", value)
		return value
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo))
	let m = (await (async () => { const __goscriptStructLiteral0: Manager = new Manager(); __goscriptStructLiteral0.Person = new Person(true); __goscriptStructLiteral0.Person.Name = await name("promoted"); __goscriptStructLiteral0.Address = new Address(true); __goscriptStructLiteral0.Address.City = await name("city"); __goscriptStructLiteral0.Person.Age = 42; __goscriptStructLiteral0.Phone = await name("phone"); __goscriptStructLiteral0.Address.Street = await name("street"); return $.markAsStructValue(__goscriptStructLiteral0) })())
	await $.println(m.Person.Name, m.Person.Age, m.Address.Street, m.Address.City, m.Phone, m.Level)

	// Nested embeddings retain independent value copies and zero fields.
	let team = (() => { const __goscriptStructLiteral1: Team = new Team(); __goscriptStructLiteral1.Employee = new Employee(true); __goscriptStructLiteral1.Employee.Person = new Person(true); __goscriptStructLiteral1.Employee.Person.Name = "nested"; __goscriptStructLiteral1.Employee.ID = 7; __goscriptStructLiteral1.Active = true; return __goscriptStructLiteral1 })()
	let team$: Team = team == null ? $.pointerTarget<Team>(team) : (team as any).__isVarRef === true ? (team as any).value : (team as any).__goValue === undefined ? (team as any) : $.pointerTarget<Team>(team)
	let copy = ((team$ as Team)).clone()
	copy.Employee.Person.Name = "copy"
	await $.println((team$ as Team).Employee.Person.Name, copy.Employee.Person.Name, (team$ as Team).Employee.Person.Age, (team$ as Team).Employee.ID, (team$ as Team).Active)
	let items = $.arrayToSlice<Team | $.VarRef<Team> | null>([(() => { const __goscriptStructLiteral2: Team = new Team(); __goscriptStructLiteral2.Employee = new Employee(true); __goscriptStructLiteral2.Employee.Person = new Person(true); __goscriptStructLiteral2.Employee.Person.Name = "inferred"; return __goscriptStructLiteral2 })()])
	await $.println($.pointerValue<Team>($.arrayIndex(items!, 0)).Employee.Person.Name, $.pointerValue<Team>($.arrayIndex(items!, 0)).Employee.ID)

	// Anonymous and generic structs use the same promoted field paths.
	let anonymous = (() => { const __goscriptStructLiteral3: {"Person": Person, "Enabled": boolean} = $.anonymousStructValue({"Person": new Person(true), "Enabled": false}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Person", "main.Person", [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("Enabled", /* @__PURE__ */ $.basicType("bool"), [1], 24, true)] }); __goscriptStructLiteral3.Person = new Person(true); __goscriptStructLiteral3.Person.Name = "anonymous"; __goscriptStructLiteral3.Enabled = true; return __goscriptStructLiteral3 })()
	await $.println(anonymous.Person.Name, anonymous.Person.Age, anonymous.Enabled)
	let text = (() => { const __goscriptStructLiteral4: LiteralContainer = new LiteralContainer(); __goscriptStructLiteral4.LiteralValue = new LiteralValue(true, "", ""); __goscriptStructLiteral4.LiteralValue.Value = "generic"; return $.markAsStructValue(__goscriptStructLiteral4) })()
	let wide = (() => { const __goscriptStructLiteral5: LiteralContainer = new LiteralContainer(); __goscriptStructLiteral5.LiteralValue = new LiteralValue(true, 0n, 0n); __goscriptStructLiteral5.LiteralValue.Value = 17n; return $.markAsStructValue(__goscriptStructLiteral5) })()
	await $.println(text.LiteralValue.Value, text.LiteralValue.Zero, wide.LiteralValue.Value, wide.LiteralValue.Zero)
}

if ($.isMainScript(import.meta)) {
	await main()
}
