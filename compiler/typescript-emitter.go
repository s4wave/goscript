package compiler

import (
	"context"
	"io"
	"maps"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strconv"
	"strings"

	"golang.org/x/sync/errgroup"
)

// TypeScriptEmitOwner owns deterministic TypeScript file emission.
type TypeScriptEmitOwner struct {
	runtimeOwner *RuntimeContractOwner
}

// NewTypeScriptEmitOwner creates the TypeScript emit owner.
func NewTypeScriptEmitOwner(runtimeOwners ...*RuntimeContractOwner) *TypeScriptEmitOwner {
	runtimeOwner := NewRuntimeContractOwner()
	if len(runtimeOwners) != 0 && runtimeOwners[0] != nil {
		runtimeOwner = runtimeOwners[0]
	}
	return &TypeScriptEmitOwner{runtimeOwner: runtimeOwner}
}

// Emit writes a lowered program to the configured TypeScript output tree.
func (o *TypeScriptEmitOwner) Emit(
	ctx context.Context,
	req *CompileRequest,
	program *LoweredProgram,
) ([]string, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/context:canceled",
			Message:  err.Error(),
		}}
	}
	if req == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/emitter:no-request",
			Message:  "TypeScript emission requires a compile request",
		}}
	}
	if program == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/emitter:no-program",
			Message:  "TypeScript emission requires a lowered program",
		}}
	}

	files, diagnostics := o.EmitToMemory(ctx, program)
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}
	return o.WriteFiles(ctx, req, program, files)
}

// WriteFiles writes an in-memory emitted file tree to the request output root.
func (o *TypeScriptEmitOwner) WriteFiles(
	ctx context.Context,
	req *CompileRequest,
	program *LoweredProgram,
	files map[string]string,
) ([]string, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{contextCanceledDiagnostic(err)}
	}
	if req == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/emitter:no-request",
			Message:  "TypeScript emission requires a compile request",
		}}
	}
	if program == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/emitter:no-program",
			Message:  "TypeScript emission requires a lowered program",
		}}
	}

	var compiled []string
	var diagnostics []Diagnostic
	for _, pkg := range program.packages {
		if err := ctx.Err(); err != nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/context:canceled",
				Message:  err.Error(),
			})
			break
		}
		pkgDir := filepath.Join(req.OutputPath, "@goscript", filepath.FromSlash(pkg.pkgPath))
		if err := os.MkdirAll(pkgDir, 0o755); err != nil {
			diagnostics = append(diagnostics, emitError("create package output", pkg.pkgPath, err))
			continue
		}
		for _, file := range pkg.files {
			filePath := "@goscript/" + pkg.pkgPath + "/" + file.outputName
			path := filepath.Join(req.OutputPath, filepath.FromSlash(filePath))
			if err := writeOutputFile(path, files[filePath]); err != nil {
				diagnostics = append(diagnostics, emitError("write TypeScript file", path, err))
			}
			diagnostics = append(diagnostics, writeAssets(pkgDir, file.assets)...)
		}
		indexPath := "@goscript/" + pkg.pkgPath + "/index.ts"
		if err := writeOutputFile(filepath.Join(pkgDir, "index.ts"), files[indexPath]); err != nil {
			diagnostics = append(diagnostics, emitError("write package index", pkg.pkgPath, err))
			continue
		}
		compiled = append(compiled, pkg.pkgPath)
	}
	return compiled, diagnostics
}

// writeAssets writes the external embedded files of a lowered file (see
// [ExternalEmbedPolicy]) into the package output directory pkgDir.
func writeAssets(pkgDir string, assets map[string][]byte) []Diagnostic {
	var diagnostics []Diagnostic
	for name, data := range assets {
		path := filepath.Join(pkgDir, filepath.FromSlash(name))
		err := os.MkdirAll(filepath.Dir(path), 0o755)
		if err == nil {
			err = writeOutputFile(path, string(data))
		}
		if err != nil {
			diagnostics = append(diagnostics, emitError("write embedded file", path, err))
		}
	}
	return diagnostics
}

// writeOutputFile replaces an output file and reports write, truncation, or
// close failures. A file that already holds contents is left untouched, so an
// unchanged output keeps its modification time.
func writeOutputFile(path string, contents string) error {
	if existing, err := os.ReadFile(path); err == nil && string(existing) == contents {
		return nil
	}
	file, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	written, writeErr := file.WriteString(contents)
	closeErr := file.Close()
	if writeErr != nil {
		return writeErr
	}
	if written != len(contents) {
		return io.ErrShortWrite
	}
	return closeErr
}

// EmitToMemory renders a lowered program into deterministic slash-path files.
func (o *TypeScriptEmitOwner) EmitToMemory(
	ctx context.Context,
	program *LoweredProgram,
) (map[string]string, []Diagnostic) {
	if err := ctx.Err(); err != nil {
		return nil, []Diagnostic{contextCanceledDiagnostic(err)}
	}
	if program == nil {
		return nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/emitter:no-program",
			Message:  "TypeScript emission requires a lowered program",
		}}
	}
	// Packages render independently, so each worker fills its own map and the
	// maps merge once rendering ends.
	rendered := make([]map[string]string, len(program.packages))
	group, groupCtx := errgroup.WithContext(ctx)
	group.SetLimit(runtime.GOMAXPROCS(0))
	for idx, pkg := range program.packages {
		group.Go(func() error {
			if err := groupCtx.Err(); err != nil {
				return err
			}
			pkgFiles := make(map[string]string, len(pkg.files)+1)
			for _, file := range pkg.files {
				pkgFiles["@goscript/"+pkg.pkgPath+"/"+file.outputName] = o.renderLoweredFile(pkg, file, program.trimTypeInfo)
				for name, data := range file.assets {
					pkgFiles["@goscript/"+pkg.pkgPath+"/"+name] = string(data)
				}
			}
			pkgFiles["@goscript/"+pkg.pkgPath+"/index.ts"] = renderIndex(pkg)
			rendered[idx] = pkgFiles
			return nil
		})
	}
	if err := group.Wait(); err != nil {
		return nil, []Diagnostic{contextCanceledDiagnostic(err)}
	}

	files := make(map[string]string)
	for _, pkgFiles := range rendered {
		maps.Copy(files, pkgFiles)
	}
	return files, nil
}

// renderLoweredFile orders imports, declarations, and the optional main invocation.
func (o *TypeScriptEmitOwner) renderLoweredFile(pkg *loweredPackage, file *loweredFile, trimTypeInfo bool) string {
	body := o.renderLoweredFileBody(pkg, file, trimTypeInfo)

	// The header names the Go source of the file.
	var b strings.Builder
	b.Grow(len(body) + 128 + len(file.imports)*96)
	if file.sourcePath != "" {
		b.WriteString("// Generated file based on ")
		b.WriteString(filepath.Base(file.sourcePath))
		b.WriteString("\n// Updated when compliance tests are re-run, DO NOT EDIT!\n\n")
	}

	// A file with a function too large to type check is not checked.
	if file.noCheck {
		b.WriteString("// @ts-nocheck\n")
	}

	// Each import binds the namespace of its package.
	for _, imp := range file.imports {
		if imp.bare {
			b.WriteString("import \"")
			b.WriteString(imp.source)
			b.WriteString("\"\n")
			continue
		}
		b.WriteString("import ")
		if imp.typeOnly {
			b.WriteString("type ")
		}
		b.WriteString("* as ")
		b.WriteString(imp.alias)
		b.WriteString(" from \"")
		b.WriteString(imp.source)
		b.WriteString("\"\n")
	}

	// TypeScript drops a namespace import that the file reads only as types,
	// which would skip the package's initialization. A bare import keeps the
	// module edge unless the file calls through the namespace.
	called := calledNamespaces(body, file.imports)
	sideEffectImports := make(map[string]bool)
	for _, imp := range file.imports {
		if imp.bare || imp.typeOnly || !imp.sideEffect || called[imp.alias] || sideEffectImports[imp.source] {
			continue
		}
		sideEffectImports[imp.source] = true
		b.WriteString("import \"")
		b.WriteString(imp.source)
		b.WriteString("\"\n")
	}
	if len(file.imports) != 0 {
		b.WriteString("\n")
	}
	b.WriteString(body)
	return strings.TrimRight(b.String(), "\n") + "\n"
}

// renderLoweredFileBody renders the declarations of file after its imports.
func (o *TypeScriptEmitOwner) renderLoweredFileBody(pkg *loweredPackage, file *loweredFile, trimTypeInfo bool) string {
	var b strings.Builder
	b.Grow(estimateLoweredFileSize(file))
	if len(file.typePackageNames) != 0 {
		quoted := make([]string, len(file.typePackageNames))
		for idx, name := range file.typePackageNames {
			quoted[idx] = strconv.Quote(name)
		}
		b.WriteString(o.runtimeOwner.QualifiedHelper(RuntimeHelperRegisterTypePackagePath))
		b.WriteString("(")
		b.WriteString(strconv.Quote(file.typePackagePath))
		b.WriteString(", [")
		b.WriteString(strings.Join(quoted, ", "))
		b.WriteString("])\n\n")
	}
	hasMain := false
	wroteDecl := false
	writeSeparator := func() {
		if wroteDecl {
			b.WriteString("\n")
		}
		wroteDecl = true
	}
	writeDecl := func(decl loweredDecl) {
		if decl.structType != nil {
			writeSeparator()
			renderStruct(&b, decl.structType, o.runtimeOwner, trimTypeInfo)
			return
		}
		if decl.function != nil {
			writeSeparator()
			renderFunction(&b, decl.function)
			if decl.function.name == "main" {
				hasMain = true
			}
			return
		}
		writeSeparator()
		b.WriteString(decl.code)
		b.WriteString("\n")
	}
	for _, decl := range file.decls {
		if decl.typeIndexExport != "" && decl.code != "" {
			writeDecl(decl)
		}
	}
	for _, decl := range sortedStructDecls(file.decls) {
		if decl.structType != nil {
			writeDecl(decl)
		}
	}
	for _, decl := range file.decls {
		if decl.structType != nil || (decl.typeIndexExport != "" && decl.code != "") {
			continue
		}
		writeDecl(decl)
	}
	if pkg.name == "main" && hasMain {
		writeSeparator()
		b.WriteString("if (")
		b.WriteString(o.runtimeOwner.QualifiedHelper(RuntimeHelperIsMainScript))
		b.WriteString("(import.meta)) {\n")
		b.WriteString("\tawait main()\n")
		b.WriteString("}\n")
	}
	return b.String()
}

// calledNamespaces returns the aliases of the namespace imports that code
// calls through, as alias.name( outside strings and comments. TypeScript keeps
// a namespace import that the file calls through.
func calledNamespaces(code string, imports []loweredImport) map[string]bool {
	aliases := make(map[string]bool, len(imports))
	for _, imp := range imports {
		if imp.alias != "" {
			aliases[imp.alias] = true
		}
	}
	called := make(map[string]bool)
	identEnd := func(start int) int {
		end := start
		for end < len(code) && isTSIdentByte(code[end]) {
			end++
		}
		return end
	}
	for idx := 0; idx < len(code); {
		switch char := code[idx]; {
		case char == '"' || char == '\'' || char == '`':
			idx = skipTSString(code, idx)
		case strings.HasPrefix(code[idx:], "//"):
			end := strings.IndexByte(code[idx:], '\n')
			if end < 0 {
				return called
			}
			idx += end
		case strings.HasPrefix(code[idx:], "/*"):
			end := strings.Index(code[idx+2:], "*/")
			if end < 0 {
				return called
			}
			idx += end + 4
		case isTSIdentByte(char):
			end := identEnd(idx)
			afterMember := idx > 0 && code[idx-1] == '.'
			alias := code[idx:end]
			idx = end
			if afterMember || !aliases[alias] || end >= len(code) || code[end] != '.' {
				continue
			}
			memberEnd := identEnd(end + 1)
			if memberEnd > end+1 && memberEnd < len(code) && code[memberEnd] == '(' {
				called[alias] = true
			}
		default:
			idx++
		}
	}
	return called
}

// skipTSString returns the index after the string or template literal that
// starts at start. A template's substitutions are skipped with it.
func skipTSString(code string, start int) int {
	quote := code[start]
	for idx := start + 1; idx < len(code); idx++ {
		switch code[idx] {
		case '\\':
			idx++
		case quote:
			return idx + 1
		}
	}
	return len(code)
}

// isTSIdentByte reports whether char can appear in an ASCII TypeScript
// identifier.
func isTSIdentByte(char byte) bool {
	return char == '_' || char == '$' || char >= '0' && char <= '9' ||
		char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z'
}

// estimateLoweredFileSize reserves approximate builder capacity without rendering.
func estimateLoweredFileSize(file *loweredFile) int {
	if file == nil {
		return 0
	}
	size := 128 + len(file.imports)*96 + len(file.decls)*32
	for _, imp := range file.imports {
		size += len(imp.alias) + len(imp.source)
	}
	for _, decl := range file.decls {
		size += len(decl.code)
		if decl.function != nil {
			size += estimateLoweredFunctionSize(decl.function)
		}
		if decl.structType != nil {
			size += estimateLoweredStructSize(decl.structType)
		}
	}
	return size
}

// estimateLoweredStructSize includes field accessors, metadata, and methods.
func estimateLoweredStructSize(structType *loweredStruct) int {
	if structType == nil {
		return 0
	}
	size := 256 + len(structType.name) + len(structType.typeName) + len(structType.fields)*128
	for _, field := range structType.fields {
		size += len(field.name) + len(field.runtimeName) + len(field.typ) + len(field.zero) + len(field.runtimeType) +
			len(field.doc) + len(field.tag)
	}
	for idx := range structType.methods {
		size += estimateLoweredFunctionSize(&structType.methods[idx])
	}
	return size
}

// estimateLoweredFunctionSize includes the signature, bindings, and lowered body.
func estimateLoweredFunctionSize(fn *loweredFunction) int {
	if fn == nil {
		return 0
	}
	size := 192 + len(fn.name) + len(fn.result) + len(fn.receiverAlias) + len(fn.receiverType) + len(fn.receiverValue)
	for _, typeParam := range fn.typeParams {
		size += len(typeParam) + 2
	}
	for _, param := range fn.params {
		size += len(param.name) + len(param.typ) + 4
	}
	for _, result := range fn.namedResults {
		size += len(result.name) + len(result.typ) + len(result.zero) + len(result.returnExpr) + 16
	}
	size += estimateLoweredStmtsSize(fn.paramBindings)
	size += estimateLoweredStmtsSize(fn.body)
	return size
}

// estimateLoweredStmtsSize accounts for nested control flow and source comments.
func estimateLoweredStmtsSize(stmts []loweredStmt) int {
	size := len(stmts) * 24
	for _, stmt := range stmts {
		size += len(stmt.text) + len(stmt.leading)*16
		for _, line := range stmt.leading {
			size += len(line)
		}
		size += estimateLoweredStmtsSize(stmt.children)
		size += estimateLoweredStmtsSize(stmt.elseBody)
		if stmt.rangeFunc != nil {
			size += len(stmt.rangeFunc.value) + len(stmt.rangeFunc.params)*16 + estimateLoweredStmtsSize(stmt.rangeFunc.body)
		}
		if stmt.switchStmt != nil {
			size += len(stmt.switchStmt.value)
			for _, switchCase := range stmt.switchStmt.cases {
				size += len(switchCase.values)*16 + estimateLoweredStmtsSize(switchCase.body)
				for _, value := range switchCase.values {
					size += len(value)
				}
			}
		}
		if stmt.selectStmt != nil {
			size += len(stmt.selectStmt.hasReturn) + len(stmt.selectStmt.value) + len(stmt.selectStmt.result) + len(stmt.selectStmt.resultType)
			for _, selectCase := range stmt.selectStmt.cases {
				size += len(selectCase.channel) + len(selectCase.value) + estimateLoweredStmtsSize(selectCase.prelude) +
					estimateLoweredStmtsSize(selectCase.body)
			}
		}
		if stmt.typeSwitch != nil {
			size += len(stmt.typeSwitch.value) + len(stmt.typeSwitch.varName) + estimateLoweredStmtsSize(stmt.typeSwitch.defaultBody)
			for _, switchCase := range stmt.typeSwitch.cases {
				for _, typ := range switchCase.types {
					size += len(typ)
				}
				for _, typ := range switchCase.tsTypes {
					size += len(typ)
				}
				size += estimateLoweredStmtsSize(switchCase.body)
			}
		}
	}
	return size
}

// sortedStructDecls emits zero-value dependencies before their containing structs.
func sortedStructDecls(decls []loweredDecl) []loweredDecl {
	structs := make([]loweredDecl, 0)
	names := make(map[string]bool)
	for _, decl := range decls {
		if decl.structType == nil {
			continue
		}
		structs = append(structs, decl)
		names[decl.structType.name] = true
	}
	if len(structs) < 2 {
		return structs
	}
	byName := make(map[string]loweredDecl, len(structs))
	for _, decl := range structs {
		byName[decl.structType.name] = decl
	}
	visiting := make(map[string]bool, len(structs))
	visited := make(map[string]bool, len(structs))
	sorted := make([]loweredDecl, 0, len(structs))
	var visit func(loweredDecl)
	visit = func(decl loweredDecl) {
		name := decl.structType.name
		if visited[name] || visiting[name] {
			return
		}
		visiting[name] = true
		for _, dep := range structZeroValueDeps(decl.structType, names) {
			if depDecl, ok := byName[dep]; ok {
				visit(depDecl)
			}
		}
		visiting[name] = false
		visited[name] = true
		sorted = append(sorted, decl)
	}
	for _, decl := range structs {
		visit(decl)
	}
	return sorted
}

// structZeroValueDeps finds local struct constructors referenced by field defaults.
func structZeroValueDeps(structType *loweredStruct, names map[string]bool) []string {
	var deps []string
	for _, field := range structType.fields {
		if !field.structValue {
			continue
		}
		for name := range names {
			if name == structType.name {
				continue
			}
			if strings.Contains(field.zero, "new "+name+"(") {
				deps = append(deps, name)
			}
		}
	}
	return deps
}

// renderStructAssign emits the __goscriptAssign method, which copies the
// fields of another value of the struct type into this one by literal keys.
// assignStruct uses it instead of copying the fields by their type info,
// which is much slower.
func renderStructAssign(b *strings.Builder, structType *loweredStruct, runtimeOwner *RuntimeContractOwner) {
	// The method copies each field of source into the receiver by its kind.
	b.WriteString("\n\tpublic __goscriptAssign(source: ")
	b.WriteString(structType.name)
	b.WriteString("): this {\n")
	for _, field := range structType.fields {
		b.WriteString("\t\t")
		switch {
		case field.plainValue:
			b.WriteString("this.")
			b.WriteString(field.name)
			b.WriteString(" = source.")
			b.WriteString(field.name)
		case field.directClone:
			b.WriteString("this.")
			b.WriteString(field.name)
			b.WriteString(".__goscriptAssign(source.")
			b.WriteString(field.name)
			b.WriteString(")")
		case field.structValue:
			b.WriteString(runtimeOwner.QualifiedHelper(RuntimeHelperAssignStruct))
			b.WriteString("(this.")
			b.WriteString(field.name)
			b.WriteString(", source.")
			b.WriteString(field.name)
			b.WriteString(")")
		default:
			// Other fields are copied by their type info, except that an
			// interface or type parameter field needs none, so it allocates
			// no type literal per assignment.
			b.WriteString("this." + field.name + " = " + runtimeOwner.QualifiedHelper(RuntimeHelperAssignFieldValue))
			b.WriteString("(this." + field.name + ", source." + field.name)
			if !field.interfaceValue {
				b.WriteString(", " + field.runtimeType)
			}
			b.WriteString(")")
		}
		b.WriteString("\n")
	}
	b.WriteString("\t\treturn this\n\t}\n")
}

// renderPositionalStructConstructor emits the constructor of a positional
// struct class, which takes the value marker and then the value of each field
// in field order. It stores each value as it is: the caller passes values that
// the new struct owns, such as copies. An omitted value is the field's zero
// value.
func renderPositionalStructConstructor(b *strings.Builder, structType *loweredStruct, runtimeOwner *RuntimeContractOwner) {
	// The parameters are the marker and the fields, whose names end in $,
	// which no Go identifier does, so that they hide no type of a zero value.
	b.WriteString("\tconstructor(__goscriptValue?: boolean")
	for _, field := range structType.fields {
		b.WriteString(", " + field.name + "$?: " + field.typ)
	}
	b.WriteString(") {\n")

	// Each field takes its value or its zero value.
	for _, field := range structType.fields {
		zero := field.zero
		if zero == "null" || field.typeParamValue {
			zero = "(" + zero + " as " + field.typ + ")"
			zero = strings.Replace(zero, "(null as", "(null! as", 1)
		}
		b.WriteString("\t\tthis." + field.name + " = " + field.name + "$ ?? " + zero + "\n")
	}

	// Every instance carries the marker, false for a pointer's struct, so
	// that all instances of a class have one shape.
	b.WriteString("\t\t;(this as any)[" + runtimeOwner.QualifiedHelper(RuntimeHelperStructValueMarker))
	b.WriteString("] = __goscriptValue === true\n\t}\n\n")
}

// renderPositionalStructClone emits the clone method of a positional struct
// class, which passes a copy of each field to the constructor.
func renderPositionalStructClone(b *strings.Builder, structType *loweredStruct, runtimeOwner *RuntimeContractOwner) {
	b.WriteString("\tpublic " + structType.cloneMethod + "(): " + structType.name + " {\n")
	b.WriteString("\t\treturn " + genericCloneStart(structType, runtimeOwner) + "new " + structType.name + "(true")
	for _, field := range structType.fields {
		b.WriteString(", " + positionalFieldCopy(field, "this."+field.name, runtimeOwner))
	}
	b.WriteString(")" + genericCloneEnd(structType) + "\n\t}\n")
}

// genericCloneStart returns the start of the expression of the clone method
// of structType that gives the copy the methods of the instantiated type of
// the original, for a generic struct type (see lowerGenericInstance), and
// genericCloneEnd its end.
func genericCloneStart(structType *loweredStruct, runtimeOwner *RuntimeContractOwner) string {
	if !structType.generic {
		return ""
	}
	return runtimeOwner.QualifiedHelper(RuntimeHelperCopyGenericInstance) + "(this, "
}

// genericCloneEnd returns the end of the expression started by
// genericCloneStart.
func genericCloneEnd(structType *loweredStruct) string {
	if !structType.generic {
		return ""
	}
	return ")"
}

// positionalFieldCopy returns the expression that copies value, the value of
// field, by the field's kind.
func positionalFieldCopy(field loweredStructField, value string, runtimeOwner *RuntimeContractOwner) string {
	switch {
	case field.directClone:
		return value + ".clone()"
	case field.structValue:
		return runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue) + "(" +
			runtimeOwner.QualifiedHelper(RuntimeHelperCloneStructValue) + "(" + value + "))"
	case field.arrayValue:
		return runtimeOwner.QualifiedHelper(RuntimeHelperCloneArrayValue) + "(" + value + ", " + field.runtimeType + ")"
	case field.typeParamValue:
		return runtimeOwner.QualifiedHelper(RuntimeHelperCopyElement) + "(" + value + ")"
	default:
		return value
	}
}

// structFreshInitParam names the constructor parameter of a generic struct
// class that says that the values of its type parameter fields in init are
// fresh, so that it takes them without copies.
const structFreshInitParam = "__goscriptFresh"

// renderStruct emits field storage, value-copy operations, methods, and metadata.
func renderStruct(b *strings.Builder, structType *loweredStruct, runtimeOwner *RuntimeContractOwner, trimTypeInfo bool) {
	markStructValue := runtimeOwner.QualifiedHelper(RuntimeHelperMarkAsStructValue)
	structValueMarker := runtimeOwner.QualifiedHelper(RuntimeHelperStructValueMarker)
	cloneStructValue := runtimeOwner.QualifiedHelper(RuntimeHelperCloneStructValue)
	cloneArrayValue := runtimeOwner.QualifiedHelper(RuntimeHelperCloneArrayValue)
	copyElement := runtimeOwner.QualifiedHelper(RuntimeHelperCopyElement)
	if structType.exported {
		b.WriteString("export ")
	}
	b.WriteString("class ")
	b.WriteString(structType.name)
	b.WriteString(" {\n")

	// Each field is an own property of the instance, as in a plain object,
	// so that a struct value is one object and its fields are read directly.
	for _, field := range structType.fields {
		writeLineComment(b, "\t", field.doc)
		b.WriteString("\tpublic declare ")
		b.WriteString(field.name)
		b.WriteString(": ")
		b.WriteString(field.typ)
		b.WriteString("\n\n")
	}

	// A positional class takes its field values in order and copies itself
	// field by field.
	if structType.positional {
		renderPositionalStructConstructor(b, structType, runtimeOwner)
		renderPositionalStructClone(b, structType, runtimeOwner)
		renderStructBody(b, structType, runtimeOwner, trimTypeInfo)
		return
	}

	// The constructor copies each initial value in by its kind. A generic
	// struct takes values of type parameter fields as they are when the
	// caller says that they are fresh (see lowerNamedStructZeroValueExpr).
	b.WriteString("\tconstructor(init?: Partial<{")
	freshParam := false
	for idx, field := range structType.fields {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(field.name)
		b.WriteString("?: ")
		b.WriteString(field.typ)
		freshParam = freshParam || field.typeParamValue
	}
	b.WriteString("}>, __goscriptValue?: boolean")
	if freshParam {
		b.WriteString(", " + structFreshInitParam + "?: boolean")
	}
	b.WriteString(") {\n")
	for _, field := range structType.fields {
		b.WriteString("\t\tthis.")
		b.WriteString(field.name)
		b.WriteString(" = ")
		if field.directClone {
			b.WriteString("init?.")
			b.WriteString(field.name)
			b.WriteString(" ? init.")
			b.WriteString(field.name)
			b.WriteString(".clone() : ")
			b.WriteString(field.zero)
		} else if field.structValue {
			b.WriteString("init?.")
			b.WriteString(field.name)
			b.WriteString(" ? ")
			b.WriteString(markStructValue)
			b.WriteString("(")
			b.WriteString(cloneStructValue)
			b.WriteString("(init.")
			b.WriteString(field.name)
			b.WriteString(")) : ")
			b.WriteString(field.zero)
		} else if field.arrayValue {
			b.WriteString("init?.")
			b.WriteString(field.name)
			b.WriteString(" !== undefined ? ")
			b.WriteString(cloneArrayValue)
			b.WriteString("(init.")
			b.WriteString(field.name)
			b.WriteString(", ")
			b.WriteString(field.runtimeType)
			b.WriteString(") : ")
			b.WriteString(field.zero)
		} else if field.typeParamValue {
			// A type argument may be a struct or array type, whose values
			// are copied when they are one at run time.
			b.WriteString("init?.")
			b.WriteString(field.name)
			b.WriteString(" !== undefined ? (" + structFreshInitParam + " === true ? init.")
			b.WriteString(field.name)
			b.WriteString(" : ")
			b.WriteString(copyElement)
			b.WriteString("(init.")
			b.WriteString(field.name)
			b.WriteString(")) : (")
			if field.zero == "null" {
				b.WriteString("null!")
			} else {
				b.WriteString(field.zero)
			}
			b.WriteString(" as ")
			b.WriteString(field.typ)
			b.WriteString(")")
		} else {
			b.WriteString("init?.")
			b.WriteString(field.name)
			b.WriteString(" ?? ")
			b.WriteString("(")
			if field.zero == "null" {
				b.WriteString("null!")
			} else {
				b.WriteString(field.zero)
			}
			b.WriteString(" as ")
			b.WriteString(field.typ)
			b.WriteString(")")
		}
		b.WriteString("\n")
	}

	// A struct value carries the marker as its own property, set here so
	// that each class stores it at one site. Every instance has the
	// property, false for a pointer's struct, so that all instances of a
	// class have one shape and marking one later changes no shape.
	b.WriteString("\t\t;(this as any)[")
	b.WriteString(structValueMarker)
	b.WriteString("] = __goscriptValue === true\n\t}\n\n")

	// The clone method copies the struct through its constructor.
	b.WriteString("\tpublic ")
	b.WriteString(structType.cloneMethod)
	b.WriteString("(): ")
	b.WriteString(structType.name)
	b.WriteString(" {\n\t\treturn ")
	b.WriteString(genericCloneStart(structType, runtimeOwner))
	b.WriteString("new ")
	b.WriteString(structType.name)
	b.WriteString("(this, true)")
	b.WriteString(genericCloneEnd(structType))
	b.WriteString("\n\t}\n")
	renderStructBody(b, structType, runtimeOwner, trimTypeInfo)
}

// renderStructBody emits the members of a struct class that follow its clone
// method: the assign method, the methods, the prototype setup and the type
// info, and closes the class.
func renderStructBody(b *strings.Builder, structType *loweredStruct, runtimeOwner *RuntimeContractOwner, trimTypeInfo bool) {
	registerStructType := runtimeOwner.QualifiedHelper(RuntimeHelperRegisterStructType)

	// The assign method and the methods follow the clone method.
	renderStructAssign(b, structType, runtimeOwner)
	for _, method := range structType.methods {
		if method.metadataOnly {
			continue
		}
		b.WriteString("\n")
		renderMethod(b, &method)
	}

	// A static block sets up the prototype.
	if structType.prototypeSetup != "" {
		b.WriteString("\n\tstatic {\n\t\t")
		b.WriteString(structType.prototypeSetup)
		b.WriteString("\n\t}\n")
	}

	// The type info registers the struct with the runtime.
	b.WriteString("\n\tstatic __typeInfo = ")
	b.WriteString(registerStructType)
	b.WriteString("(\n")
	b.WriteString("\t\t")
	b.WriteString(strconvQuote(structType.typeName))
	b.WriteString(",\n\t\t() => new ")
	b.WriteString(structType.name)
	b.WriteString("(),\n\t\t() => [")
	for idx, method := range structType.methods {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(runtimeMethodSignatureExpr(method, trimTypeInfo))
	}
	b.WriteString("],\n\t\t")
	b.WriteString(structType.name)
	b.WriteString(",\n\t\t() => [")
	for idx, field := range structType.fields {
		if idx != 0 {
			b.WriteString(", ")
		}
		if trimTypeInfo {
			b.WriteString(trimmedRuntimeStructFieldInfoExpr(field.runtimeType, field.name, field.runtimeName, field.tag, field.anonymous))
		} else {
			b.WriteString(runtimeStructFieldInfoExpr(
				runtimeOwner.QualifiedHelper(RuntimeHelperStructField),
				field.runtimeType,
				field.name,
				field.runtimeName,
				field.tag,
				field.pkgPath,
				field.anonymous,
				field.index,
				field.offset,
				field.exported,
			))
		}
	}
	b.WriteString("]\n\t)\n")
	b.WriteString("}\n")
}

// runtimeMethodSignatureExpr selects the requested metadata representation.
func runtimeMethodSignatureExpr(method loweredFunction, trimTypeInfo bool) string {
	if trimTypeInfo && method.runtimeTrimmedSignature != "" {
		return method.runtimeTrimmedSignature
	}
	if method.runtimeSignature != "" {
		return method.runtimeSignature
	}
	methodName := method.name
	if method.runtimeName != "" {
		methodName = method.runtimeName
	}
	return "{ name: " + strconvQuote(methodName) + ", args: [], returns: [] }"
}

// trimmedRuntimeStructFieldInfoExpr retains field lookup and value-shape metadata.
func trimmedRuntimeStructFieldInfoExpr(
	runtimeType string,
	storageKey string,
	runtimeName string,
	tag string,
	anonymous bool,
) string {
	name := runtimeName
	if name == "" {
		name = storageKey
	}
	fields := []string{
		"name: " + strconvQuote(name),
		"key: " + strconvQuote(storageKey),
		"type: " + runtimeType,
	}
	if tag != "" {
		fields = append(fields, "tag: "+strconvQuote(tag))
	}
	if anonymous {
		fields = append(fields, "anonymous: true")
	}
	return "{ " + strings.Join(fields, ", ") + " }"
}

// writeLineComment preserves multiline comment text at the requested indentation.
func writeLineComment(b *strings.Builder, indent string, comment string) {
	comment = strings.TrimSpace(comment)
	if comment == "" {
		return
	}
	for line := range strings.SplitSeq(comment, "\n") {
		line = strings.TrimRight(line, "\r")
		if strings.TrimSpace(line) == "" {
			b.WriteString(indent)
			b.WriteString("//\n")
			continue
		}
		b.WriteString(indent)
		b.WriteString("// ")
		b.WriteString(line)
		b.WriteString("\n")
	}
}

// renderFunction emits a declaration with receiver bindings and deferred cleanup.
func renderFunction(b *strings.Builder, fn *loweredFunction) {
	if fn.exported {
		b.WriteString("export ")
	}
	if fn.async {
		b.WriteString("async ")
	}
	b.WriteString("function ")
	b.WriteString(fn.name)
	renderFunctionTypeParams(b, fn)
	b.WriteString("(")
	for idx, param := range fn.params {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(param.name)
		b.WriteString(": ")
		b.WriteString(param.typ)
	}
	b.WriteString("): ")
	b.WriteString(fn.result)
	b.WriteString(" {\n")
	if fn.receiverAlias != "" && fn.receiverAlias != "_" {
		writeIndent(b, 1)
		if fn.receiverMutable {
			b.WriteString("let ")
		} else {
			b.WriteString("const ")
		}
		b.WriteString(fn.receiverAlias)
		if fn.receiverType != "" {
			b.WriteString(": ")
			b.WriteString(fn.receiverType)
		}
		b.WriteString(" = ")
		b.WriteString(receiverValue(fn))
		b.WriteString(";\n")
	}
	renderStmts(b, fn.paramBindings, 1)
	renderNamedResults(b, fn.namedResults, 1)
	renderBodyWithDefer(b, fn, 1)
	if fn.deferState == nil || !fn.deferState.recover {
		renderUnreachableReturn(b, fn, 1)
	}
	b.WriteString("}\n")
}

// renderMethod emits a class method with its lowered receiver and return contract.
func renderMethod(b *strings.Builder, fn *loweredFunction) {
	writeIndent(b, 1)
	b.WriteString("public ")
	if fn.prototypeDeclaration {
		b.WriteString("declare ")
		b.WriteString(fn.name)
		b.WriteString(": (")
		for idx, param := range fn.params {
			if idx != 0 {
				b.WriteString(", ")
			}
			b.WriteString(param.name + ": " + param.typ)
		}
		b.WriteString(") => " + fn.result + "\n")
		return
	}
	if fn.async {
		b.WriteString("async ")
	}
	b.WriteString(fn.name)
	renderFunctionTypeParams(b, fn)
	b.WriteString("(")
	for idx, param := range fn.params {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(param.name)
		b.WriteString(": ")
		b.WriteString(param.typ)
	}
	b.WriteString("): ")
	b.WriteString(fn.result)
	b.WriteString(" {\n")
	if fn.receiverAlias != "" && fn.receiverAlias != "_" {
		writeIndent(b, 2)
		if fn.receiverMutable {
			b.WriteString("let ")
		} else {
			b.WriteString("const ")
		}
		b.WriteString(fn.receiverAlias)
		if fn.receiverType != "" {
			b.WriteString(": ")
			b.WriteString(fn.receiverType)
		}
		b.WriteString(" = ")
		b.WriteString(receiverValue(fn))
		b.WriteString(";\n")
	}
	renderStmts(b, fn.paramBindings, 2)
	renderNamedResults(b, fn.namedResults, 2)
	renderBodyWithDefer(b, fn, 2)
	if fn.deferState == nil || !fn.deferState.recover {
		renderUnreachableReturn(b, fn, 2)
	}
	writeIndent(b, 1)
	b.WriteString("}\n")
}

// renderUnreachableReturn closes non-void paths that lowering marks unreachable.
func renderUnreachableReturn(b *strings.Builder, fn *loweredFunction, indent int) {
	if fn.result == "void" || fn.result == "globalThis.Promise<void>" {
		return
	}
	if loweredStmtsEndWithTerminal(fn.body) {
		return
	}
	writeIndent(b, indent)
	b.WriteString("throw new globalThis.Error(\"goscript: unreachable return\")\n")
}

// loweredStmtsEndWithTerminal recognizes a final textual return or throw.
func loweredStmtsEndWithTerminal(stmts []loweredStmt) bool {
	if len(stmts) == 0 {
		return false
	}
	last := stmts[len(stmts)-1]
	text := strings.TrimSpace(last.text)
	return strings.HasPrefix(text, "return") || strings.HasPrefix(text, "throw ")
}

// renderFunctionTypeParams omits the generic parameter list when it is empty.
func renderFunctionTypeParams(b *strings.Builder, fn *loweredFunction) {
	if len(fn.typeParams) == 0 {
		return
	}
	b.WriteString("<")
	for idx, typeParam := range fn.typeParams {
		if idx != 0 {
			b.WriteString(", ")
		}
		b.WriteString(typeParam)
	}
	b.WriteString(">")
}

// receiverValue selects an explicit lowered receiver or the class instance.
func receiverValue(fn *loweredFunction) string {
	if fn.receiverValue != "" {
		return fn.receiverValue
	}
	return "this"
}

// renderNamedResults initializes named return variables before the function body.
func renderNamedResults(b *strings.Builder, results []loweredNamedResult, indent int) {
	for _, result := range results {
		writeIndent(b, indent)
		b.WriteString("let ")
		b.WriteString(result.name)
		if result.typ != "" {
			b.WriteString(": ")
			b.WriteString(result.typ)
		}
		b.WriteString(" = ")
		b.WriteString(result.zero)
		b.WriteString("\n")
	}
}

// renderDeferStack selects disposal semantics from the lowered defer contract.
func renderDeferStack(b *strings.Builder, state *loweredDeferState, indent int) {
	if state == nil || !state.used {
		return
	}
	writeIndent(b, indent)
	if state.recover {
		if state.async {
			b.WriteString("const __defer = new $.AsyncDisposableStack()\n")
			return
		}
		b.WriteString("const __defer = new $.DisposableStack()\n")
		return
	}
	if state.async {
		b.WriteString("await using __defer = new $.AsyncDisposableStack()\n")
		return
	}
	b.WriteString("using __defer = new $.DisposableStack()\n")
}

// renderBodyWithDefer emits the defer stack, body, and trailing return for a
// function. Defer stacks that may call recover use explicit disposal so normal
// returns call dispose(), panic unwinding calls disposePanic(), and recover()
// cannot observe unrelated async panics. Other defer stacks keep the plain
// using-declaration shape.
func renderBodyWithDefer(b *strings.Builder, fn *loweredFunction, indent int) {
	if fn.deferState == nil || !fn.deferState.used || !fn.deferState.recover {
		renderDeferStack(b, fn.deferState, indent)
		renderStmts(b, fn.body, indent)
		return
	}
	renderDeferStack(b, fn.deferState, indent)
	writeIndent(b, indent)
	b.WriteString("try {\n")
	renderStmts(b, fn.body, indent+1)
	writeIndent(b, indent+1)
	if fn.deferState.async {
		b.WriteString("await __defer.dispose()\n")
	} else {
		b.WriteString("__defer.dispose()\n")
	}
	writeIndent(b, indent)
	b.WriteString("} catch (e) {\n")
	writeIndent(b, indent+1)
	if fn.deferState.async {
		b.WriteString("await __defer.disposePanic(e)\n")
	} else {
		b.WriteString("__defer.disposePanic(e)\n")
	}
	writeIndent(b, indent+1)
	b.WriteString("if (!$.recovered(e)) {\n")
	writeIndent(b, indent+2)
	b.WriteString("throw e\n")
	writeIndent(b, indent+1)
	b.WriteString("}\n")
	writeIndent(b, indent)
	b.WriteString("}\n")
	if fn.recoverReturn != "" {
		writeIndent(b, indent)
		b.WriteString(fn.recoverReturn)
		b.WriteString("\n")
	}
}

// renderStmts preserves control-flow nesting and automatic-semicolon boundaries.
func renderStmts(b *strings.Builder, stmts []loweredStmt, indent int) {
	for idx, stmt := range stmts {
		renderLeadingLines(b, stmt.leading, indent)
		if stmt.rangeFunc != nil {
			renderRangeFunc(b, stmt.rangeFunc, indent)
			continue
		}
		if stmt.switchStmt != nil {
			renderSwitch(b, stmt.switchStmt, indent)
			continue
		}
		if stmt.selectStmt != nil {
			renderSelect(b, stmt.selectStmt, indent)
			continue
		}
		if stmt.typeSwitch != nil {
			renderTypeSwitch(b, stmt.typeSwitch, indent)
			continue
		}
		writeIndent(b, indent)
		if stmt.text == "" && (stmt.hasBlock || len(stmt.children) != 0) {
			b.WriteString("{\n")
			renderStmts(b, stmt.children, indent+1)
			writeIndent(b, indent)
			b.WriteString("}\n")
			continue
		}
		if startsWithASIHazard(stmt.text) {
			// A statement that starts with a parenthesis or bracket would
			// continue the previous line's expression.
			b.WriteString(";")
		}
		writeIndentedText(b, stmt.text, indent)
		if !stmt.hasBlock && len(stmt.children) == 0 {
			if idx+1 < len(stmts) && needsASIBarrier(stmt, stmts[idx+1]) {
				b.WriteString(";")
			}
			b.WriteString("\n")
			continue
		}
		b.WriteString(" {\n")
		renderStmts(b, stmt.children, indent+1)
		writeIndent(b, indent)
		b.WriteString("}")
		if len(stmt.elseBody) == 0 {
			b.WriteString("\n")
			continue
		}
		b.WriteString(" else {\n")
		renderStmts(b, stmt.elseBody, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
	}
}

// startsWithASIHazard reports whether a statement starts with a parenthesis
// or bracket, which JavaScript would read as continuing a previous line.
func startsWithASIHazard(text string) bool {
	trimmed := strings.TrimLeft(text, " \t")
	return strings.HasPrefix(trimmed, "(") || strings.HasPrefix(trimmed, "[")
}

// needsASIBarrier prevents adjacent statements from becoming one JS expression.
func needsASIBarrier(current loweredStmt, next loweredStmt) bool {
	if current.text == "" ||
		current.hasBlock ||
		len(current.children) != 0 ||
		current.rangeFunc != nil ||
		current.switchStmt != nil ||
		current.selectStmt != nil ||
		current.typeSwitch != nil {
		return false
	}
	if strings.HasSuffix(strings.TrimSpace(current.text), ";") {
		return false
	}
	nextText := strings.TrimLeft(next.text, " \t")
	return strings.HasPrefix(nextText, "(") || strings.HasPrefix(nextText, "[")
}

// renderLeadingLines preserves source comments and blank lines before a statement.
func renderLeadingLines(b *strings.Builder, lines []string, indent int) {
	for _, line := range lines {
		if strings.TrimSpace(line) == "" {
			b.WriteString("\n")
			continue
		}
		writeIndent(b, indent)
		b.WriteString(line)
		b.WriteString("\n")
	}
}

// writeIndentedText indents continuation lines of already-lowered statement text.
func writeIndentedText(b *strings.Builder, text string, indent int) {
	lines := strings.Split(text, "\n")
	for idx, line := range lines {
		if idx != 0 {
			b.WriteString("\n")
			if line != "" {
				writeIndent(b, indent)
			}
		}
		b.WriteString(line)
	}
}

// renderSwitch emits grouped case labels and their lowered bodies.
func renderSwitch(b *strings.Builder, stmt *loweredSwitch, indent int) {
	writeIndent(b, indent)
	if stmt.label != "" {
		b.WriteString(stmt.label + ": ")
	}
	b.WriteString("switch (")
	b.WriteString(stmt.value)
	b.WriteString(") {\n")
	for _, switchCase := range stmt.cases {
		if switchCase.defaultCase {
			writeIndent(b, indent+1)
			b.WriteString("default:\n")
		} else {
			for _, value := range switchCase.values {
				writeIndent(b, indent+1)
				b.WriteString("case ")
				b.WriteString(value)
				b.WriteString(":\n")
			}
		}
		renderSwitchBody(b, switchCase.body, switchCase.fallsThrough, indent+1)
	}
	writeIndent(b, indent)
	b.WriteString("}\n")
}

// renderSwitchBody isolates declarations and preserves explicit fallthrough.
func renderSwitchBody(b *strings.Builder, body []loweredStmt, fallsThrough bool, indent int) {
	writeIndent(b, indent)
	b.WriteString("{\n")
	renderStmts(b, body, indent+1)
	if !fallsThrough {
		writeIndent(b, indent+1)
		b.WriteString("break\n")
	}
	writeIndent(b, indent)
	b.WriteString("}\n")
}

// renderRangeFunc carries returns and labeled branches through yield callbacks.
func renderRangeFunc(b *strings.Builder, stmt *loweredRangeFunc, indent int) {
	// Declare pending branches in the scope that resumes them.
	if stmt.returnBranch != nil {
		if len(stmt.returnBranch.branches) != 0 {
			writeIndent(b, indent)
			b.WriteString("let ")
			b.WriteString(stmt.returnBranch.branchFlag)
			b.WriteString(" = 0\n")
		}
		writeIndent(b, indent)
		b.WriteString("let ")
		b.WriteString(stmt.returnBranch.hasReturn)
		b.WriteString(" = false\n")
		if stmt.returnBranch.value != "" {
			writeIndent(b, indent)
			b.WriteString("let ")
			b.WriteString(stmt.returnBranch.value)
			b.WriteString(": ")
			b.WriteString(stmt.returnBranch.resultType)
			b.WriteString(" | undefined\n")
		}
	}

	// Run the iterator with its lowered yield callback.
	writeIndent(b, indent)
	if stmt.async {
		b.WriteString(";await (async () => {\n")
	} else {
		b.WriteString(";(() => {\n")
	}
	writeIndent(b, indent+1)
	if stmt.async {
		b.WriteString("await ")
	}
	b.WriteString(stmt.value)
	b.WriteString("!(")
	if stmt.async {
		b.WriteString("async ")
	}
	b.WriteString("(")
	b.WriteString(strings.Join(stmt.params, ", "))
	b.WriteString(") => {\n")
	renderStmts(b, stmt.body, indent+2)
	writeIndent(b, indent+2)
	b.WriteString("return true\n")
	writeIndent(b, indent+1)
	b.WriteString("})\n")
	writeIndent(b, indent)
	b.WriteString("})()\n")

	// Resume labeled branches before forwarding a pending function return.
	if stmt.returnBranch == nil {
		return
	}
	for idx, branch := range stmt.returnBranch.branches {
		writeIndent(b, indent)
		b.WriteString("if (")
		b.WriteString(stmt.returnBranch.branchFlag)
		b.WriteString(" === ")
		b.WriteString(strconv.Itoa(idx + 1))
		b.WriteString(") {\n")
		renderStmts(b, branch.body, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
	}
	writeIndent(b, indent)
	b.WriteString("if (")
	b.WriteString(stmt.returnBranch.hasReturn)
	b.WriteString(")")
	if stmt.parentBranch != nil {
		b.WriteString(" {\n")
		writeIndent(b, indent+1)
		b.WriteString(stmt.parentBranch.hasReturn)
		b.WriteString(" = true\n")
		if stmt.parentBranch.value != "" && stmt.returnBranch.value != "" {
			writeIndent(b, indent+1)
			b.WriteString(stmt.parentBranch.value)
			b.WriteString(" = ")
			b.WriteString(stmt.returnBranch.value)
			b.WriteString("!\n")
		}
		writeIndent(b, indent+1)
		b.WriteString("return false\n")
		writeIndent(b, indent)
		b.WriteString("}\n")
		return
	}
	if stmt.returnBranch.value == "" {
		b.WriteString(" {\n")
		writeIndent(b, indent+1)
		b.WriteString("return\n")
		writeIndent(b, indent)
		b.WriteString("}\n")
		return
	}
	b.WriteString(" {\n")
	writeIndent(b, indent+1)
	b.WriteString("return ")
	b.WriteString(stmt.returnBranch.value)
	b.WriteString("!")
	b.WriteString("\n")
	writeIndent(b, indent)
	b.WriteString("}\n")
}

// renderNamedStructConversion evaluates the input once before converting fields.
func renderNamedStructConversion(expr *loweredNamedStructConversionExpr) string {
	if expr == nil {
		return "undefined"
	}
	if expr.castOnly {
		return "$.namedStructConversion<" + expr.castTarget + ">(" + expr.value.text + ")"
	}
	fields := make([]string, 0, len(expr.fields))
	for _, field := range expr.fields {
		fields = append(fields, field.name+": "+expr.temp+"."+field.name)
	}
	body := "const " + expr.temp + " = " + expr.value.text + "; return " +
		expr.helper + "(new " + expr.target + "({" + strings.Join(fields, ", ") + "}))"

	// A positional class takes the copies of the fields in order.
	if expr.positional {
		copies := make([]string, 0, len(expr.fields)+1)
		copies = append(copies, "true")
		for _, field := range expr.fields {
			copies = append(copies, field.copy)
		}
		body = "const " + expr.temp + " = " + expr.value.text + "; return new " + expr.target + "(" + strings.Join(copies, ", ") + ")"
	}
	if expr.value.async {
		return "(await (async () => { " + body + " })())"
	}
	return "(() => { " + body + " })()"
}

// renderSelect delegates channel choice and propagates case returns or loop jumps.
func renderSelect(b *strings.Builder, stmt *loweredSelect, indent int) {
	writeIndent(b, indent)
	b.WriteString("const [")
	b.WriteString(stmt.hasReturn)
	b.WriteString(", ")
	b.WriteString(stmt.value)
	b.WriteString("] = await $.selectStatement<any, ")
	if stmt.external {
		b.WriteString("any")
	} else {
		b.WriteString(stmt.resultType)
	}
	b.WriteString(">([\n")
	for idx, switchCase := range stmt.cases {
		renderSelectCase(b, switchCase, stmt.external, stmt.result, indent+1)
		if idx != len(stmt.cases)-1 {
			b.WriteString(",")
		}
		b.WriteString("\n")
	}
	writeIndent(b, indent)
	b.WriteString("], ")
	hasDefault := "false"
	if stmt.hasDefault {
		hasDefault = "true"
	}
	b.WriteString(hasDefault)
	b.WriteString(")\n")
	if stmt.external {
		renderSelectExternalBodies(b, stmt, indent)
		return
	}
	writeIndent(b, indent)
	b.WriteString("if (")
	b.WriteString(stmt.hasReturn)
	b.WriteString(") {\n")
	writeIndent(b, indent+1)
	b.WriteString("return ")
	b.WriteString(stmt.value)
	b.WriteString("\n")
	writeIndent(b, indent)
	b.WriteString("}\n")
	if stmt.returns {
		writeIndent(b, indent)
		b.WriteString("throw new globalThis.Error(\"unreachable select\")\n")
	}
}

// renderSelectExternalBodies keeps loop jumps in the selecting function's scope.
func renderSelectExternalBodies(b *strings.Builder, stmt *loweredSelect, indent int) {
	writeIndent(b, indent)
	b.WriteString("switch (")
	b.WriteString(stmt.value)
	b.WriteString("?.id) {\n")
	for _, switchCase := range stmt.cases {
		writeIndent(b, indent+1)
		b.WriteString("case ")
		b.WriteString(strconv.Itoa(switchCase.id))
		b.WriteString(":\n")
		writeIndent(b, indent+2)
		b.WriteString("{\n")
		writeIndent(b, indent+3)
		b.WriteString("const ")
		b.WriteString(stmt.result)
		b.WriteString(" = ")
		b.WriteString(stmt.value)
		b.WriteString("\n")
		renderStmts(b, switchCase.prelude, indent+3)
		renderStmts(b, switchCase.body, indent+3)
		writeIndent(b, indent+3)
		b.WriteString("break\n")
		writeIndent(b, indent+2)
		b.WriteString("}\n")
	}
	writeIndent(b, indent)
	b.WriteString("}\n")
	if stmt.returns {
		writeIndent(b, indent)
		b.WriteString("throw new globalThis.Error(\"unreachable select\")\n")
	}
}

// renderSelectCase emits the communication and any work performed after selection.
func renderSelectCase(b *strings.Builder, switchCase loweredSelectCase, external bool, resultName string, indent int) {
	// Evaluate the channel and send value before the runtime chooses a case.
	writeIndent(b, indent)
	b.WriteString("{\n")
	writeIndent(b, indent+1)
	b.WriteString("id: ")
	b.WriteString(strconv.Itoa(switchCase.id))
	b.WriteString(",\n")
	writeIndent(b, indent+1)
	b.WriteString("isSend: ")
	isSend := "false"
	if switchCase.isSend {
		isSend = "true"
	}
	b.WriteString(isSend)
	b.WriteString(",\n")
	writeIndent(b, indent+1)
	b.WriteString("channel: ")
	b.WriteString(switchCase.channel)
	b.WriteString(",\n")
	if switchCase.isSend {
		writeIndent(b, indent+1)
		b.WriteString("value: ")
		b.WriteString(switchCase.value)
		b.WriteString(",\n")
	}

	// The runtime completes empty cases without an asynchronous callback.
	// External bodies still need the selected result to dispatch their case.
	if !external && len(switchCase.prelude) == 0 && len(switchCase.body) == 0 {
		writeIndent(b, indent)
		b.WriteString("}")
		return
	}

	// Return the selection for external bodies, or execute the case in its callback.
	writeIndent(b, indent+1)
	b.WriteString("onSelected: async (")
	b.WriteString(resultName)
	b.WriteString(") => {\n")
	if external {
		writeIndent(b, indent+2)
		b.WriteString("return ")
		b.WriteString(resultName)
		b.WriteString("\n")
		writeIndent(b, indent+1)
		b.WriteString("}\n")
		writeIndent(b, indent)
		b.WriteString("}")
		return
	}

	// Receive assignments precede the body, including an otherwise empty case.
	renderStmts(b, switchCase.prelude, indent+2)
	renderSelectCaseStmts(b, switchCase.body, indent+2)
	writeIndent(b, indent+1)
	b.WriteString("}\n")
	writeIndent(b, indent)
	b.WriteString("}")
}

// renderSelectCaseStmts distinguishes a void function return from case completion.
func renderSelectCaseStmts(b *strings.Builder, stmts []loweredStmt, indent int) {
	for idx, stmt := range stmts {
		renderLeadingLines(b, stmt.leading, indent)
		if stmt.rangeFunc != nil {
			renderRangeFunc(b, stmt.rangeFunc, indent)
			continue
		}
		if stmt.switchStmt != nil {
			renderSwitch(b, stmt.switchStmt, indent)
			continue
		}
		if stmt.selectStmt != nil {
			renderSelect(b, stmt.selectStmt, indent)
			continue
		}
		if stmt.typeSwitch != nil {
			renderTypeSwitch(b, stmt.typeSwitch, indent)
			continue
		}
		writeIndent(b, indent)
		if stmt.text == "" && (stmt.hasBlock || len(stmt.children) != 0) {
			b.WriteString("{\n")
			renderSelectCaseStmts(b, stmt.children, indent+1)
			writeIndent(b, indent)
			b.WriteString("}\n")
			continue
		}
		if strings.TrimSpace(stmt.text) == "return" {
			b.WriteString("return $.selectVoidReturn()\n")
			continue
		}
		if startsWithASIHazard(stmt.text) {
			// A statement that starts with a parenthesis or bracket would
			// continue the previous line's expression.
			b.WriteString(";")
		}
		writeIndentedText(b, stmt.text, indent)
		if !stmt.hasBlock && len(stmt.children) == 0 {
			if idx+1 < len(stmts) && needsASIBarrier(stmt, stmts[idx+1]) {
				b.WriteString(";")
			}
			b.WriteString("\n")
			continue
		}
		b.WriteString(" {\n")
		renderSelectCaseStmts(b, stmt.children, indent+1)
		writeIndent(b, indent)
		b.WriteString("}")
		if len(stmt.elseBody) == 0 {
			b.WriteString("\n")
			continue
		}
		b.WriteString(" else {\n")
		renderSelectCaseStmts(b, stmt.elseBody, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
	}
}

// renderTypeSwitch evaluates its operand once before testing runtime types.
func renderTypeSwitch(b *strings.Builder, stmt *loweredTypeSwitch, indent int) {
	writeIndent(b, indent)
	b.WriteString("{\n")
	writeIndent(b, indent+1)
	b.WriteString("const " + typeSwitchValueName + " = ")
	b.WriteString(stmt.value)
	b.WriteString("\n")
	writeIndent(b, indent+1)
	if stmt.label != "" {
		b.WriteString(stmt.label + ": ")
	}
	if stmt.site != "" {
		b.WriteString("switch ($.typeSwitchCase(" + typeSwitchValueName + ", " + stmt.site + ")) {\n")
	} else {
		b.WriteString("switch (true) {\n")
	}
	for idx, switchCase := range stmt.cases {
		if stmt.site != "" {
			renderTypeSwitchSiteCase(b, stmt.varName, stmt.varRef, idx, switchCase, indent+2)
			continue
		}
		renderTypeSwitchCase(b, stmt.varName, stmt.varRef, switchCase, indent+2)
	}
	if len(stmt.defaultBody) != 0 {
		writeIndent(b, indent+2)
		b.WriteString("default:\n")
		renderTypeSwitchInlineBody(b, stmt.varName, stmt.varRef || stmt.defaultRef, "any", typeSwitchValueName, stmt.defaultBody, indent+3)
		writeIndent(b, indent+3)
		b.WriteString("break\n")
	}
	writeIndent(b, indent+1)
	b.WriteString("}\n")
	writeIndent(b, indent)
	b.WriteString("}\n")
}

// renderTypeSwitchCase binds the narrowed value for a matching type alternative.
func renderTypeSwitchCase(b *strings.Builder, varName string, varRef bool, switchCase loweredTypeSwitchCase, indent int) {
	if len(switchCase.types) == 0 {
		return
	}
	writeIndent(b, indent)
	b.WriteString("case ")
	for idx, typ := range switchCase.types {
		if idx != 0 {
			b.WriteString(" || ")
		}
		switch {
		case typ == typeSwitchNilCase:
			// A typed nil is boxed as an object, so only a nil interface is null.
			b.WriteString(typeSwitchValueName + " == null")
		case len(switchCase.types) == 1:
			b.WriteString("$.typeAssert<")
			b.WriteString(typeSwitchAssertType(switchCase, 0))
			b.WriteString(">(" + typeSwitchValueName + ", " + typ + ").ok")
		default:
			b.WriteString("$.is(" + typeSwitchValueName + ", " + typ + ")")
		}
	}
	b.WriteString(":\n")
	renderTypeSwitchInlineBody(b, varName, varRef || switchCase.varRef, typeSwitchCaseVariableType(switchCase), switchCase.binding, switchCase.body, indent+1)
	writeIndent(b, indent+1)
	b.WriteString("break\n")
}

// renderTypeSwitchSiteCase renders the clause of a switch with a site, which
// typeSwitchCase selects by its index, and binds the narrowed value.
func renderTypeSwitchSiteCase(b *strings.Builder, varName string, varRef bool, idx int, switchCase loweredTypeSwitchCase, indent int) {
	writeIndent(b, indent)
	b.WriteString("case " + strconv.Itoa(idx) + ":\n")
	renderTypeSwitchInlineBody(b, varName, varRef || switchCase.varRef, typeSwitchCaseVariableType(switchCase), switchCase.binding, switchCase.body, indent+1)
	writeIndent(b, indent+1)
	b.WriteString("break\n")
}

// typeSwitchAssertType selects the emitted assertion type for one alternative.
func typeSwitchAssertType(switchCase loweredTypeSwitchCase, idx int) string {
	if idx < len(switchCase.tsTypes) && switchCase.tsTypes[idx] != "" {
		return switchCase.tsTypes[idx]
	}
	return "any"
}

// typeSwitchCaseVariableType narrows only cases containing one runtime type.
func typeSwitchCaseVariableType(switchCase loweredTypeSwitchCase) string {
	if len(switchCase.types) == 1 {
		return typeSwitchAssertType(switchCase, 0)
	}
	return ""
}

// renderTypeSwitchInlineBody scopes the case variable and its lowered statements.
func renderTypeSwitchInlineBody(
	b *strings.Builder,
	varName string,
	varRef bool,
	varType string,
	value string,
	body []loweredStmt,
	indent int,
) {
	if varName == "" {
		writeIndent(b, indent)
		b.WriteString("{\n")
		renderStmts(b, body, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
		return
	}
	writeIndent(b, indent)
	b.WriteString("{\n")
	writeIndent(b, indent+1)
	b.WriteString("let ")
	b.WriteString(varName)
	if varRef {
		if varType == "" {
			varType = "any"
		}
		b.WriteString(": $.VarRef<")
		b.WriteString(varType)
		b.WriteString("> = $.varRef(")
		b.WriteString(value)
		b.WriteString(")\n")
		renderStmts(b, body, indent+1)
		writeIndent(b, indent)
		b.WriteString("}\n")
		return
	}
	if varType != "" {
		b.WriteString(": ")
		b.WriteString(varType)
	}
	b.WriteString(" = ")
	b.WriteString(value)
	b.WriteString("\n")
	renderStmts(b, body, indent+1)
	writeIndent(b, indent)
	b.WriteString("}\n")
}

// renderIndex emits sorted value, type, and initialization imports for a package.
func renderIndex(pkg *loweredPackage) string {
	var lines []string
	for _, file := range pkg.files {
		if file.sideEffect {
			lines = append(lines, "import \"./"+file.outputName+"\"")
		}
		if file.exportAll {
			lines = append(lines, "export * from \"./"+file.outputName+"\"")
		}
		exports := slices.Clone(file.exports)
		slices.Sort(exports)
		if len(exports) != 0 {
			lines = append(lines, "export { "+strings.Join(exports, ", ")+" } from \"./"+file.outputName+"\"")
		}
		typeExports := slices.Clone(file.typeExports)
		slices.Sort(typeExports)
		if len(typeExports) != 0 {
			lines = append(lines, "export type { "+strings.Join(typeExports, ", ")+" } from \"./"+file.outputName+"\"")
		}
	}
	slices.Sort(lines)
	if pkg.initModule {
		lines = append(lines,
			"import { __goscript_package_init } from \"./"+packageInitModule+"\"",
			"await __goscript_package_init()")
	}
	if len(lines) == 0 && pkg.moduleIndex {
		return "export {}\n"
	}
	if len(lines) == 0 {
		return ""
	}
	return strings.Join(lines, "\n") + "\n"
}

// writeIndent emits one tab per nesting level.
func writeIndent(b *strings.Builder, indent int) {
	for range indent {
		b.WriteString("\t")
	}
}

// strconvQuote escapes a string literal for emitted TypeScript.
func strconvQuote(value string) string {
	return strconv.Quote(value)
}

// emitError reports an output failure with the affected subject.
func emitError(action string, subject string, err error) Diagnostic {
	return Diagnostic{
		Severity: DiagnosticSeverityError,
		Code:     "goscript/emitter:write",
		Message:  "failed to " + action,
		Detail:   subject + ": " + err.Error(),
	}
}
