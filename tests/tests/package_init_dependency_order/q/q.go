package q

import "github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg"

// Each initializer adds a name, so a package that waits for q sees both.
var First = reg.Add("q first")

var Second = reg.Add("q second")
