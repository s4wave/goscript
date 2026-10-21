package main

import "github.com/s4wave/goscript/tests/tests/package_var_effects_other_file/reg"

// Nothing in main.go refers to this file, so only its package variable
// initializers register these names.
var _ = reg.Add("blank")

var unexported = reg.Add("unexported")
