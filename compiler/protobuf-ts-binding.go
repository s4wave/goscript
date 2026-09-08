package compiler

import (
	"go/ast"
	"go/types"
	"os"
	"path/filepath"
	"slices"
	"strings"
)

type protobufTypeScriptBinding struct {
	sourcePath   string
	outputName   string
	importSource string
	messageNames map[string]string
	hasOneof     bool

	// packageMessages maps every message bound by any binding file in the
	// same package to the sibling binding that publishes it. Field
	// resolution consults it for same-package cross-file references.
	packageMessages map[string]protobufTypeScriptBoundMessage
}

// protobufTypeScriptBoundMessage records the sibling binding file that
// publishes a bound message class. messageNames is that file's bound
// message names, so cross-file qualification emits the actual exported
// TypeScript const spelling rather than the Go safe identifier.
type protobufTypeScriptBoundMessage struct {
	importSource string
	outputName   string
	messageNames map[string]string
}

// protobufTypeScriptBindingSiblingImports mints imports of sibling binding
// files so a same-package cross-file field constructor can qualify the
// referenced message class. Constructor metadata needs the GoScript wrapper
// class emitted in the sibling module, so the value import (not the
// side-effect schema import) supplies the constructor.
type protobufTypeScriptBindingSiblingImports struct {
	file    *loweredFile
	aliases map[string]string
}

// wrapperAliasFor returns the import alias qualifying the GoScript wrapper
// classes emitted in the sibling binding module, adding a value import on
// first use. It reuses an import of the same module that lowering already
// added so the emitted file never declares the same module twice.
func (s *protobufTypeScriptBindingSiblingImports) wrapperAliasFor(outputName string) string {
	importSource := "./" + outputName
	if s.aliases == nil {
		s.aliases = make(map[string]string)
	}
	if alias, ok := s.aliases[importSource]; ok {
		return alias
	}
	// Reuse an import of the same module that lowering already added so the
	// emitted file never declares the same module twice.
	for _, imp := range s.file.imports {
		if imp.source == importSource && imp.alias != "" && !imp.typeOnly {
			s.aliases[importSource] = imp.alias
			return imp.alias
		}
	}
	base := "__goscript_" + safeIdentifier(strings.TrimSuffix(outputName, ".ts"))
	reserved := make(map[string]bool, len(s.file.imports))
	for _, imp := range s.file.imports {
		if imp.alias != "" {
			reserved[imp.alias] = true
		}
	}
	alias := uniqueImportAlias(base, importSource, nil, reserved)
	s.aliases[importSource] = alias
	s.file.imports = append(s.file.imports, loweredImport{
		alias:  alias,
		source: importSource,
	})
	return alias
}

type protobufTypeScriptBindingOneofCase struct {
	groupLocalName string
	caseLocalName  string
	branchCtor     string
	valueCtor      string
}

func protobufTypeScriptBindings(semPkg *semanticPackage, options LoweringOptions) (map[string]protobufTypeScriptBinding, []Diagnostic) {
	if semPkg == nil || semPkg.source == nil || !options.ProtobufTypeScriptBinding {
		return nil, nil
	}
	bindings := make(map[string]protobufTypeScriptBinding)
	var diagnostics []Diagnostic
	for idx, syntax := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, syntax)
		if !strings.HasSuffix(sourcePath, ".pb.go") {
			continue
		}
		if strings.HasSuffix(filepath.Base(sourcePath), "_srpc.pb.go") {
			continue
		}
		if !protobufTypeScriptBindingInSourceRoot(options.SourceRoot, sourcePath, options.AdditionalBindingRoots...) {
			continue
		}
		tsPath := strings.TrimSuffix(sourcePath, ".go") + ".ts"
		messageNames := protobufTypeScriptBindingMessageNames(syntax, tsPath)
		if _, err := os.Stat(tsPath); err != nil {
			if os.IsNotExist(err) {
				if len(messageNames) == 0 {
					continue
				}
				diagnostics = append(diagnostics, Diagnostic{
					Severity: DiagnosticSeverityError,
					Code:     "goscript/protobuf-ts-binding:missing",
					Message:  "protobuf TypeScript binding is missing sibling .pb.ts",
					Detail:   sourcePath + " requires " + tsPath,
				})
				continue
			}
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/protobuf-ts-binding:stat",
				Message:  "failed to inspect protobuf TypeScript binding",
				Detail:   err.Error(),
			})
			continue
		}
		importSource, err := protobufTypeScriptBindingImportSource(options.OutputPath, semPkg.pkgPath, tsPath)
		if err != nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/protobuf-ts-binding:import-source",
				Message:  "failed to compute protobuf TypeScript binding import",
				Detail:   err.Error(),
			})
			continue
		}
		bindings[sourcePath] = protobufTypeScriptBinding{
			sourcePath:   sourcePath,
			outputName:   strings.TrimSuffix(filepath.Base(sourcePath), ".go") + ".ts",
			importSource: importSource,
			messageNames: messageNames,
			hasOneof:     protobufTypeScriptBindingHasOneof(syntax),
		}
	}

	// Index the bound messages across all binding files so a field in one
	// file can resolve a reference to a message declared in another file of
	// the same package.
	packageMessages := make(map[string]protobufTypeScriptBoundMessage, len(bindings))
	for _, binding := range bindings {
		for name := range binding.messageNames {
			packageMessages[name] = protobufTypeScriptBoundMessage{
				importSource: binding.importSource,
				outputName:   binding.outputName,
				messageNames: binding.messageNames,
			}
		}
	}
	for sourcePath, binding := range bindings {
		binding.packageMessages = packageMessages
		bindings[sourcePath] = binding
	}
	return bindings, diagnostics
}

func protobufTypeScriptBindingRoot(dir string) string {
	dir = strings.TrimSpace(dir)
	if dir == "" {
		return ""
	}
	abs, err := filepath.Abs(dir)
	if err != nil {
		return dir
	}
	for {
		if _, err := os.Stat(filepath.Join(abs, "go.mod")); err == nil {
			return abs
		}
		parent := filepath.Dir(abs)
		if parent == abs {
			return dir
		}
		abs = parent
	}
}

func protobufTypeScriptBindingInSourceRoot(sourceRoot, sourcePath string, additionalRoots ...string) bool {
	if strings.TrimSpace(sourceRoot) == "" {
		return true
	}
	sourceAbs, err := filepath.Abs(sourcePath)
	if err != nil {
		return false
	}
	for _, root := range append([]string{sourceRoot}, additionalRoots...) {
		if strings.TrimSpace(root) == "" {
			continue
		}
		if protobufTypeScriptBindingInRoot(root, sourceAbs) {
			return true
		}
	}
	return false
}

func protobufTypeScriptBindingInRoot(root, sourceAbs string) bool {
	rootAbs, err := filepath.Abs(root)
	if err != nil {
		return false
	}
	rel, err := filepath.Rel(rootAbs, sourceAbs)
	if err != nil {
		return false
	}
	if rel == "." || strings.HasPrefix(rel, ".."+string(filepath.Separator)) || rel == ".." || filepath.IsAbs(rel) {
		return false
	}
	if rel == "vendor" || strings.HasPrefix(rel, "vendor"+string(filepath.Separator)) {
		return false
	}
	return true
}

func protobufTypeScriptBindingImportSource(outputPath, pkgPath, tsPath string) (string, error) {
	outputDir := filepath.Join(outputPath, "@goscript", filepath.FromSlash(pkgPath))
	outputDir, err := filepath.Abs(outputDir)
	if err != nil {
		return "", err
	}
	rel, err := filepath.Rel(outputDir, tsPath)
	if err != nil {
		return "", err
	}
	rel = filepath.ToSlash(rel)
	if !strings.HasPrefix(rel, ".") {
		rel = "./" + rel
	}
	return strings.TrimSuffix(rel, ".ts") + ".js", nil
}

func protobufTypeScriptBindingHasOneof(file *ast.File) bool {
	if file == nil {
		return false
	}
	for _, decl := range file.Decls {
		genDecl, ok := decl.(*ast.GenDecl)
		if !ok {
			continue
		}
		for _, spec := range genDecl.Specs {
			typeSpec, ok := spec.(*ast.TypeSpec)
			if !ok {
				continue
			}
			structType, ok := typeSpec.Type.(*ast.StructType)
			if !ok || structType.Fields == nil {
				continue
			}
			for _, field := range structType.Fields.List {
				if field.Tag != nil && strings.Contains(field.Tag.Value, "protobuf_oneof") {
					return true
				}
			}
		}
	}
	return false
}

func protobufTypeScriptBindingMessageNames(file *ast.File, tsPath string) map[string]string {
	names := make(map[string]string)
	if file == nil {
		return names
	}
	exportedTSMessages := protobufTypeScriptBindingExportedConsts(tsPath)

	// Index exported consts case-insensitively so a Go safe identifier that
	// differs from the protobuf-es const only in digit-camel capitalization,
	// such as protoc-gen-go's V86Fs versus the exported const V86fs, still
	// resolves to the actual exported spelling. Exact safe-identifier matches
	// stay authoritative and unchanged; this index is only a fallback that
	// binds when exactly one exported const matches case-insensitively and
	// that const is not yet claimed by another struct. Anything else stays
	// unbound with the unresolved diagnostic.
	loweredTSMessages := make(map[string][]string, len(exportedTSMessages))
	for export := range exportedTSMessages {
		lowered := strings.ToLower(export)
		loweredTSMessages[lowered] = append(loweredTSMessages[lowered], export)
	}

	// boundTSConsts records consts claimed by an earlier struct so two
	// structs never bind to the same TypeScript const.
	boundTSConsts := make(map[string]bool)

	for _, decl := range file.Decls {
		genDecl, ok := decl.(*ast.GenDecl)
		if !ok {
			continue
		}
		for _, spec := range genDecl.Specs {
			typeSpec, ok := spec.(*ast.TypeSpec)
			if !ok {
				continue
			}
			if _, ok := typeSpec.Type.(*ast.StructType); !ok {
				continue
			}
			name := typeSpec.Name.Name
			safeName := protobufTypeScriptBindingSafeIdentifier(name)
			if len(exportedTSMessages) == 0 || exportedTSMessages[safeName] {
				names[name] = safeName
				boundTSConsts[safeName] = true
				continue
			}

			// Fall back to the case-insensitive index only when exactly one
			// exported const matches; ambiguous or already-bound consts stay
			// unbound and keep reporting the unresolved diagnostic.
			matches := loweredTSMessages[strings.ToLower(safeName)]
			if len(matches) != 1 || boundTSConsts[matches[0]] {
				continue
			}
			names[name] = matches[0]
			boundTSConsts[matches[0]] = true
		}
	}
	return names
}

func protobufTypeScriptBindingExportedConsts(tsPath string) map[string]bool {
	data, err := os.ReadFile(tsPath)
	if err != nil {
		return nil
	}
	exports := make(map[string]bool)
	for line := range strings.SplitSeq(string(data), "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "export const ") {
			continue
		}
		rest := strings.TrimPrefix(line, "export const ")
		end := 0
		for end < len(rest) && protobufTypeScriptBindingIdentifierByte(rest[end]) {
			end++
		}
		if end != 0 {
			exports[rest[:end]] = true
		}
	}
	return exports
}

func protobufTypeScriptBindingIdentifierByte(ch byte) bool {
	return ch == '_' || ch == '$' ||
		ch >= '0' && ch <= '9' ||
		ch >= 'A' && ch <= 'Z' ||
		ch >= 'a' && ch <= 'z'
}

func protobufTypeScriptBindingSafeIdentifier(name string) string {
	switch name {
	case "break",
		"case",
		"catch",
		"class",
		"const",
		"continue",
		"debugger",
		"default",
		"delete",
		"do",
		"else",
		"export",
		"extends",
		"false",
		"finally",
		"for",
		"function",
		"if",
		"import",
		"in",
		"instanceof",
		"new",
		"null",
		"return",
		"super",
		"switch",
		"this",
		"throw",
		"true",
		"try",
		"typeof",
		"var",
		"void",
		"while",
		"with",
		"yield",
		"enum",
		"implements",
		"interface",
		"let",
		"package",
		"private",
		"protected",
		"public",
		"static",
		"Object",
		"bigint",
		"number",
		"boolean",
		"string",
		"object",
		"globalThis",
		"Uint8Array",
		"Partial":
		return name + "$"
	default:
		return name
	}
}

func rewriteProtobufTypeScriptBindingFile(file *loweredFile, binding protobufTypeScriptBinding, pkgName string) []Diagnostic {
	if file == nil {
		return nil
	}
	var diagnostics []Diagnostic
	file.outputName = binding.outputName
	const importAlias = "__protobuf_ts"
	file.imports = append(file.imports, loweredImport{
		alias:      importAlias,
		source:     binding.importSource,
		sideEffect: true,
	})
	siblings := &protobufTypeScriptBindingSiblingImports{file: file}
	oneofCases := protobufTypeScriptBindingOneofCases(file, pkgName, binding, siblings, &diagnostics)
	oneofBranches := make(map[string]bool)
	for _, cases := range oneofCases {
		for _, oneofCase := range cases {
			oneofBranches[oneofCase.branchCtor] = true
		}
	}
	var setupDecls []loweredDecl
	for _, decl := range file.decls {
		if decl.structType == nil {
			continue
		}
		if protobufTypeScriptBindingSyntheticMapEntry(decl.structType.name) || oneofBranches[decl.structType.name] {
			continue
		}
		rewriteProtobufTypeScriptBindingStruct(decl.structType, binding.sourcePath)
		messageName, ok := binding.messageNames[decl.structType.name]
		if !ok {
			continue
		}
		setup, setupDiagnostics := protobufTypeScriptBindingStructSetupDecl(decl.structType, importAlias, messageName, pkgName, file, binding, siblings, oneofCases[decl.structType.name])
		diagnostics = append(diagnostics, setupDiagnostics...)
		if setup.code != "" {
			setupDecls = append(setupDecls, setup)
		}
	}
	file.decls = append(file.decls, setupDecls...)
	return diagnostics
}

func protobufTypeScriptBindingOneofCases(file *loweredFile, pkgName string, binding protobufTypeScriptBinding, siblings *protobufTypeScriptBindingSiblingImports, diagnostics *[]Diagnostic) map[string][]protobufTypeScriptBindingOneofCase {
	parentByName := make(map[string]*loweredStruct)
	for _, decl := range file.decls {
		if decl.structType != nil {
			parentByName[decl.structType.name] = decl.structType
		}
	}
	out := make(map[string][]protobufTypeScriptBindingOneofCase)
	for _, decl := range file.decls {
		branch := decl.structType
		if branch == nil || !strings.Contains(branch.name, "_") {
			continue
		}
		parent := protobufTypeScriptBindingOneofParent(branch.name, parentByName)
		if parent == nil {
			continue
		}
		groups := protobufTypeScriptBindingOneofGroups(parent)
		if len(groups) == 0 {
			continue
		}
		groupLocalName := protobufTypeScriptBindingOneofCaseGroup(branch, parent, groups)
		if groupLocalName == "" {
			continue
		}
		for _, field := range branch.fields {
			if !strings.Contains(field.tag, "oneof") {
				continue
			}
			valueCtor, isMessage := protobufTypeScriptBindingFieldCtor(field, pkgName, file, binding, siblings)
			if isMessage && valueCtor == "" {
				*diagnostics = append(*diagnostics, Diagnostic{
					Severity: DiagnosticSeverityError,
					Code:     "goscript/protobuf-ts-binding:unresolved",
					Message:  "protobuf TypeScript binding cannot resolve a message-kind field reference",
					Detail:   branch.name + "." + field.name + " references \"" + field.runtimeType + "\", which is neither a bound message in this package nor an imported bound message",
				})
				continue
			}
			out[parent.name] = append(out[parent.name], protobufTypeScriptBindingOneofCase{
				groupLocalName: groupLocalName,
				caseLocalName:  protobufTypeScriptBindingFieldLocalName(field),
				branchCtor:     branch.name,
				valueCtor:      valueCtor,
			})
		}
	}
	for parentName := range out {
		slices.SortFunc(out[parentName], func(left, right protobufTypeScriptBindingOneofCase) int {
			if left.groupLocalName != right.groupLocalName {
				return strings.Compare(left.groupLocalName, right.groupLocalName)
			}
			return strings.Compare(left.caseLocalName, right.caseLocalName)
		})
	}
	return out
}

func protobufTypeScriptBindingOneofParent(branchName string, parents map[string]*loweredStruct) *loweredStruct {
	var parent *loweredStruct
	for name, candidate := range parents {
		if name == branchName || !strings.HasPrefix(branchName, name+"_") {
			continue
		}
		if parent == nil || len(name) > len(parent.name) {
			parent = candidate
		}
	}
	return parent
}

func protobufTypeScriptBindingOneofGroups(parent *loweredStruct) map[string]string {
	groups := make(map[string]string)
	for _, field := range parent.fields {
		if !strings.Contains(field.tag, "protobuf_oneof") {
			continue
		}
		localName := protobufTypeScriptBindingTagValue(field.tag, "protobuf_oneof:\"")
		if localName == "" {
			groups[field.name] = protobufTypeScriptBindingFieldLocalName(field)
			continue
		}
		groups[field.name] = protobufTypeScriptBindingProtoCamel(localName)
	}
	return groups
}

func protobufTypeScriptBindingOneofCaseGroup(branch, parent *loweredStruct, groups map[string]string) string {
	if len(groups) == 1 {
		for _, localName := range groups {
			return localName
		}
	}
	prefix := "is" + parent.name + "_"
	for _, method := range branch.methods {
		groupName, ok := strings.CutPrefix(method.name, prefix)
		if !ok {
			continue
		}
		if localName := groups[groupName]; localName != "" {
			return localName
		}
	}
	return ""
}

func protobufTypeScriptBindingSyntheticMapEntry(name string) bool {
	return strings.Contains(name, "_") && strings.HasSuffix(name, "Entry")
}

func lowerProtobufSRPCTypeScriptBindingStub(semPkg *semanticPackage, sourcePath string, options LoweringOptions) (*loweredFile, []Diagnostic) {
	tsPath := strings.TrimSuffix(sourcePath, ".go") + ".ts"
	if _, err := os.Stat(tsPath); err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/protobuf-ts-binding:srpc-stat",
			Message:  "failed to inspect SRPC TypeScript binding",
			Detail:   err.Error(),
		}}
	}
	importSource, err := protobufTypeScriptBindingImportSource(options.OutputPath, semPkg.pkgPath, tsPath)
	if err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/protobuf-ts-binding:srpc-import-source",
			Message:  "failed to compute SRPC TypeScript binding import",
			Detail:   err.Error(),
		}}
	}
	return &loweredFile{
		sourcePath: sourcePath,
		outputName: sourceOutputName(sourcePath),
		decls: []loweredDecl{{
			code: "export * from " + strconvQuote(importSource),
		}},
		exportAll: true,
	}, nil
}

func protobufSRPCHasGoScriptReplacement(sourcePath string) bool {
	base := filepath.Base(sourcePath)
	if !strings.HasSuffix(base, "_srpc.pb.go") {
		return false
	}
	replacement := strings.TrimSuffix(base, "_srpc.pb.go") + "-srpc-goscript.go"
	_, err := os.Stat(filepath.Join(filepath.Dir(sourcePath), replacement))
	return err == nil
}

func rewriteProtobufTypeScriptBindingStruct(structType *loweredStruct, bindingSourcePath string) {
	if structType == nil {
		return
	}
	var names []string
	for idx := range structType.methods {
		method := &structType.methods[idx]
		if method.sourcePath != bindingSourcePath || !protobufTypeScriptBindingReplacesMethodName(method.name) {
			continue
		}
		if structType.protobufPreserveJSON && protobufTypeScriptBindingJSONMethodName(method.name) {
			continue
		}
		method.async = false
		method.prototypeDeclaration = true
		method.paramBindings = nil
		method.namedResults = nil
		method.deferState = nil
		method.body = nil
		names = append(names, strconvQuote(method.name))
	}
	if len(names) != 0 {
		structType.prototypeSetup = "protobuf_go_lite.BindMessageMethods(this, " + strconvQuote("*"+structType.typeName) + ", [" + strings.Join(names, ", ") + "])"
	}
}

func protobufTypeScriptBindingJSONMethodName(name string) bool {
	switch name {
	case "MarshalJSON", "MarshalProtoJSON", "UnmarshalJSON", "UnmarshalProtoJSON":
		return true
	default:
		return false
	}
}

func protobufTypeScriptBindingReplacesMethodName(name string) bool {
	switch name {
	case "CloneMessageVT",
		"CloneVT",
		"EqualMessageVT",
		"EqualVT",
		"MarshalJSON",
		"MarshalProtoJSON",
		"MarshalToSizedBufferVT",
		"MarshalToVT",
		"MarshalVT",
		"ProtoMessage",
		"Reset",
		"SizeVT",
		"String",
		"UnmarshalJSON",
		"UnmarshalProtoJSON",
		"UnmarshalVT":
		return true
	default:
		return false
	}
}

func protobufTypeScriptBindingStructSetupDecl(structType *loweredStruct, importAlias, messageName, pkgName string, file *loweredFile, binding protobufTypeScriptBinding, siblings *protobufTypeScriptBindingSiblingImports, oneofCases []protobufTypeScriptBindingOneofCase) (loweredDecl, []Diagnostic) {
	if structType == nil {
		return loweredDecl{}, nil
	}
	if messageName == "" {
		messageName = structType.name
	}
	var diagnostics []Diagnostic
	fieldEntries := make(map[string]string)
	for _, field := range structType.fields {
		if strings.Contains(field.tag, "protobuf_oneof") {
			continue
		}
		ctor, isMessage := protobufTypeScriptBindingFieldCtor(field, pkgName, file, binding, siblings)
		if !isMessage {
			continue
		}
		if ctor == "" {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/protobuf-ts-binding:unresolved",
				Message:  "protobuf TypeScript binding cannot resolve a message-kind field reference",
				Detail:   structType.name + "." + field.name + " references \"" + field.runtimeType + "\", which is neither a bound message in this package nor an imported bound message",
			})
			continue
		}
		fieldEntries[protobufTypeScriptBindingFieldLocalName(field)] = ctor
	}
	for _, oneofCase := range oneofCases {
		if oneofCase.valueCtor != "" {
			fieldEntries[oneofCase.caseLocalName] = oneofCase.valueCtor
		}
	}
	fieldNames := make([]string, 0, len(fieldEntries))
	for name := range fieldEntries {
		fieldNames = append(fieldNames, name)
	}
	slices.Sort(fieldNames)
	entries := make([]string, 0, len(fieldNames))
	for _, name := range fieldNames {
		entries = append(entries, strconvQuote(name)+": "+fieldEntries[name])
	}
	code := "(" + structType.name + " as any).__protobufTypeScriptMessage = " + importAlias + "." + messageName + ";\n" +
		"(" + structType.name + " as any).__protobufTypeScriptFields = {" + strings.Join(entries, ", ") + "};"
	if len(oneofCases) != 0 {
		code += "\n(" + structType.name + " as any).__protobufTypeScriptOneofFields = " + protobufTypeScriptBindingOneofFieldsLiteral(oneofCases) + ";"
	}
	return loweredDecl{code: code}, diagnostics
}

func protobufTypeScriptBindingOneofFieldsLiteral(oneofCases []protobufTypeScriptBindingOneofCase) string {
	groups := make(map[string][]protobufTypeScriptBindingOneofCase)
	for _, oneofCase := range oneofCases {
		groups[oneofCase.groupLocalName] = append(groups[oneofCase.groupLocalName], oneofCase)
	}
	groupNames := make([]string, 0, len(groups))
	for name := range groups {
		groupNames = append(groupNames, name)
	}
	slices.Sort(groupNames)
	entries := make([]string, 0, len(groupNames))
	for _, groupName := range groupNames {
		cases := groups[groupName]
		slices.SortFunc(cases, func(left, right protobufTypeScriptBindingOneofCase) int {
			return strings.Compare(left.caseLocalName, right.caseLocalName)
		})
		caseEntries := make([]string, 0, len(cases))
		for _, oneofCase := range cases {
			caseEntries = append(caseEntries, strconvQuote(oneofCase.caseLocalName)+": "+oneofCase.branchCtor)
		}
		entries = append(entries, strconvQuote(groupName)+": {"+strings.Join(caseEntries, ", ")+"}")
	}
	return "{" + strings.Join(entries, ", ") + "}"
}

func protobufTypeScriptBindingFieldLocalName(field loweredStructField) string {
	if tag := field.tag; tag != "" {
		if value := protobufTypeScriptBindingTagValue(tag, "json="); value != "" {
			return value
		}
		if value := protobufTypeScriptBindingTagValue(tag, "name="); value != "" {
			return protobufTypeScriptBindingProtoCamel(value)
		}
	}
	if field.name == "" {
		return field.name
	}
	return strings.ToLower(field.name[:1]) + field.name[1:]
}

func protobufTypeScriptBindingTagValue(tag, key string) string {
	_, after, ok := strings.Cut(tag, key)
	if !ok {
		return ""
	}
	rest := after
	end := len(rest)
	for idx, ch := range rest {
		if ch == ',' || ch == '"' || ch == '`' || ch == ' ' {
			end = idx
			break
		}
	}
	return rest[:end]
}

func protobufTypeScriptBindingProtoCamel(name string) string {
	if name == "" {
		return ""
	}
	parts := strings.Split(name, "_")
	var out strings.Builder
	for idx, part := range parts {
		if part == "" {
			continue
		}
		part = strings.ToLower(part)
		if idx == 0 {
			out.WriteString(part)
			continue
		}
		out.WriteString(strings.ToUpper(part[:1]))
		out.WriteString(part[1:])
	}
	return out.String()
}

// protobufTypeScriptBindingMessageType resolves message identity from Go types,
// independently of the emitted reflection descriptor representation.
func protobufTypeScriptBindingMessageType(typ types.Type) string {
	seen := make(map[types.Type]bool)
	for typ != nil && !seen[typ] {
		seen[typ] = true
		if named := namedStructType(typ); named != nil {
			return runtimeNamedTypeName(named)
		}
		switch typed := types.Unalias(typ).Underlying().(type) {
		case *types.Pointer:
			typ = typed.Elem()
		case *types.Slice:
			typ = typed.Elem()
		case *types.Array:
			typ = typed.Elem()
		case *types.Map:
			typ = typed.Elem()
		default:
			return ""
		}
	}
	return ""
}

func protobufTypeScriptBindingSplitDotted(ref string) (pkgName, typeName string, ok bool) {
	idx := strings.LastIndex(ref, ".")
	if idx <= 0 || idx == len(ref)-1 {
		return "", "", false
	}
	return ref[:idx], ref[idx+1:], true
}

// protobufTypeScriptBindingFieldCtor resolves the TypeScript class identifier
// for a message-kind struct field. The canonical Go message type identifies
// the referenced class independently of emitted reflection metadata. The emitted
// constructor comes from the declared field type so the qualifier is the
// actual lowered import alias, which may differ from the dependency directory
// basename and Go package clause. Same-package references resolve through the
// bound message names of the current file and then through the package-wide
// registry for messages declared in another file of the same package,
// qualifying the sibling binding's class with a dedicated import. It reports
// isMessage=false for fields that reference no named struct. An unresolvable
// message-kind reference returns ctor="" with isMessage=true so the caller
// can report a compile-time diagnostic rather than silently omitting binding
// metadata.
func protobufTypeScriptBindingFieldCtor(field loweredStructField, pkgName string, file *loweredFile, binding protobufTypeScriptBinding, siblings *protobufTypeScriptBindingSiblingImports) (ctor string, isMessage bool) {
	refPkg, refType, ok := protobufTypeScriptBindingSplitDotted(field.messageType)
	if !ok {
		return "", false
	}
	if refPkg == pkgName {
		if _, bound := binding.messageNames[refType]; bound {
			return refType, true
		}

		// Same proto package, different file: bind through the sibling
		// binding file's published message class.
		sibling, crossFile := binding.packageMessages[refType]
		if !crossFile {
			return "", true
		}

		// Qualify the GoScript wrapper class emitted in the sibling binding
		// module. Constructor metadata is executed with new by the runtime,
		// so it must reference the constructible wrapper class, not the
		// sibling protobuf-es-lite schema object.
		return siblings.wrapperAliasFor(sibling.outputName) + "." + refType, true
	}
	return protobufTypeScriptBindingImportedCtor(field.typ, refType, file), true
}

// protobufTypeScriptBindingImportedCtor resolves the emitted constructor for
// an imported message reference by finding one lowered import whose alias
// qualifies the referenced type name in the declared field type text. Only
// named, non-type-only imports qualify; blank and type-only imports cannot
// carry value constructors. Distinct qualifying imports leave the reference
// ambiguous and return "" so the caller reports the unresolved diagnostic.
func protobufTypeScriptBindingImportedCtor(typ, refType string, file *loweredFile) string {
	matchAlias := ""
	matchSource := ""
	for _, imp := range file.imports {
		if imp.alias == "" || imp.typeOnly {
			continue
		}
		if !loweredTypQualifiesRef(typ, imp.alias, refType) {
			continue
		}
		if matchAlias != "" && (matchAlias != imp.alias || matchSource != imp.source) {
			return ""
		}
		matchAlias = imp.alias
		matchSource = imp.source
	}
	if matchAlias == "" {
		return ""
	}
	return matchAlias + "." + refType
}

// loweredTypQualifiesRef reports whether typ spells the referenced type name
// qualified by exactly the given import alias at identifier boundaries.
func loweredTypQualifiesRef(typ, alias, refType string) bool {
	needle := alias + "." + refType
	for offset := 0; ; offset++ {
		idx := strings.Index(typ[offset:], needle)
		if idx < 0 {
			return false
		}
		idx += offset
		start := idx + len(needle)
		if (idx == 0 || !typIdentChar(typ[idx-1])) &&
			(start == len(typ) || !typIdentChar(typ[start])) {
			return true
		}
		offset = idx + 1
	}
}

func typIdentChar(ch byte) bool {
	return ch == '_' || ch == '$' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')
}
