package compiler

// LoweringOptions are request-scoped lowering switches.
type LoweringOptions struct {
	// SourceRoot is the request source root that may contain sibling protobuf TypeScript files.
	SourceRoot string
	// DisplayRoot is the request root used to format source file names in diagnostics.
	DisplayRoot string
	// OutputPath is the TypeScript output root used for generated relative imports.
	OutputPath string
	// ProtobufTypeScriptBinding binds .pb.go files to sibling .pb.ts files.
	ProtobufTypeScriptBinding bool
	// TrimTypeInfo drops metadata used only by reflect from named type registration payloads.
	TrimTypeInfo bool
}
