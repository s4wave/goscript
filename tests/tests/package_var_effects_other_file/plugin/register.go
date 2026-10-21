package plugin

import "github.com/s4wave/goscript/tests/tests/package_var_effects_other_file/reg"

// Nothing refers to this file, so only its initializers register these names.
var _ = reg.Add("plugin blank")

var unexported = reg.Add("plugin unexported")
