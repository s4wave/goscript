package lib

import "github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg"

// Count does not depend on q, but lib imports q, which Go initializes first.
var Count = reg.Add("lib count")
