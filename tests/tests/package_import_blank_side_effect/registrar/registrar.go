package registrar

import "github.com/s4wave/goscript/tests/tests/package_import_blank_side_effect/registry"

func init() {
	registry.Register("blank")
}
