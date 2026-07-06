// Generated file based on registry.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let registrations: globalThis.Map<string, boolean> | null = $.makeMap<string, boolean>()

export function __goscript_set_registrations(__goscriptValue: globalThis.Map<string, boolean> | null): void {
	registrations = __goscriptValue
}

export function Register(name: string): void {
	$.mapSet(registrations, name, true)
}

export function Registered(name: string): boolean {
	return $.mapGet<string, boolean, boolean>(registrations, name, false)[0]
}
