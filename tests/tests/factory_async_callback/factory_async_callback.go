package main

import "github.com/s4wave/goscript/tests/tests/factory_async_callback/dep"

type AddFactoryFunc func(b dep.Bus) []dep.Factory

var Factories = []AddFactoryFunc{
	func(b dep.Bus) []dep.Factory {
		return []dep.Factory{dep.NewFactory(b)}
	},
}

func main() {
	factories := Factories[0](dep.Bus{})
	println(factories[0].GetConfigID())
}
