package main

import "github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg"

// Other does not depend on lib or q, which main imports and Go initializes
// first.
var Other = reg.Add("main other")
