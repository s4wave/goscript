package compiler

import (
	"go/token"
	"go/types"
)

// LoweredProgram is the compiler-owned IR consumed by TypeScript emission.
type LoweredProgram struct {
	packages     []*loweredPackage
	trimTypeInfo bool
}

type loweredPackage struct {
	pkgPath string
	name    string
	files   []*loweredFile
	// initModule is whether the package has a package init module
	// (see [lowerPackageInit]).
	initModule bool
}

type loweredFile struct {
	sourcePath  string
	outputName  string
	imports     []loweredImport
	decls       []loweredDecl
	exports     []string
	typeExports []string
	exportAll   bool
	sideEffect  bool
	// varInits initialize the lazily initialized package variables declared
	// in this file.
	varInits []packageInitCall
	// initFuncs call the init functions declared in this file.
	initFuncs []packageInitCall
	// typePackagePath is the package path registered for typePackageNames
	// when it differs from the package name, so that reflect reports it.
	typePackagePath string
	// typePackageNames are the runtime names of the named types declared in
	// this file.
	typePackageNames []string
}

// packageInitCall is a call that initializes a package: the initializer of a
// lazily initialized package variable, or an init function.
type packageInitCall struct {
	// obj is the package variable the call initializes, or nil for an init
	// function.
	obj   types.Object
	name  string
	async bool
}

// code returns the statement that makes the call, qualified by the module
// alias when it is not empty.
func (c packageInitCall) code(module string) string {
	call := c.name + "()"
	if module != "" {
		call = module + "." + call
	}
	if c.async {
		return "await " + call
	}
	return call
}

type loweredImport struct {
	alias      string
	source     string
	bare       bool
	sideEffect bool
	typeOnly   bool
}

type loweredExpr struct {
	text  string
	async bool
}

type loweredNamedStructConversionExpr struct {
	value      loweredExpr
	target     string
	temp       string
	helper     string
	fields     []loweredConversionField
	castOnly   bool
	castTarget string
}

type loweredConversionField struct {
	name string
}

type loweredDecl struct {
	code            string
	indexExport     string
	typeIndexExport string
	sideEffect      bool
	// packageInit is the call that initializes the package variable the
	// declaration declares, run by [lowerPackageInit] instead of emitted.
	packageInit *packageInitCall
	function    *loweredFunction
	structType  *loweredStruct
}

type loweredStruct struct {
	exported             bool
	indexExported        bool
	protobufPreserveJSON bool
	prototypeSetup       string
	name                 string
	typeName             string
	cloneMethod          string
	fields               []loweredStructField
	methods              []loweredFunction
}

type loweredStructField struct {
	name        string
	runtimeName string
	typ         string
	zero        string
	runtimeType string
	messageType string // Canonical named message reached through field containers.
	doc         string
	tag         string
	pkgPath     string
	index       []int
	offset      int64
	anonymous   bool
	exported    bool
	structValue bool
	// directClone records that a struct value field is copied by its own
	// clone method (see isGeneratedStructClass).
	directClone bool
	arrayValue  bool
	// typeParamValue reports whether the field's type is a type parameter
	// that may be instantiated with a struct or array type.
	typeParamValue bool
	// plainValue reports whether the field's values are assigned as they are,
	// as for basic, pointer, slice, map, function and channel types, unlike
	// struct and array values, which are copied, and interface and type
	// parameter values, which may hold struct or array values.
	plainValue bool
}

type loweredFunction struct {
	exported                bool
	indexExported           bool
	prototypeDeclaration    bool
	init                    bool
	async                   bool
	sourcePath              string
	name                    string
	typeParams              []string
	runtimeName             string
	runtimeSignature        string
	runtimeTrimmedSignature string
	receiverAlias           string
	receiverType            string
	receiverValue           string
	receiverMutable         bool
	params                  []loweredParam
	paramBindings           []loweredStmt
	namedResults            []loweredNamedResult
	result                  string
	body                    []loweredStmt
	deferState              *loweredDeferState
	// recoverReturn is the return statement emitted if a deferred recover()
	// swallows a panic: the named results, the zero values for unnamed results, or
	// empty for a void function. Defer wrappers keep it for every deferred
	// function so TypeScript sees a total return path after the catch.
	recoverReturn string
}

type loweredParam struct {
	name string
	typ  string
}

type loweredNamedResult struct {
	name       string
	typ        string
	zero       string
	returnExpr string
}

type loweredStmt struct {
	text       string
	leading    []string
	hasBlock   bool
	children   []loweredStmt
	elseBody   []loweredStmt
	rangeFunc  *loweredRangeFunc
	switchStmt *loweredSwitch
	selectStmt *loweredSelect
	typeSwitch *loweredTypeSwitch
}

// loweredRangeFunc invokes an iterator and resumes branches outside its yield.
type loweredRangeFunc struct {
	// value is the iterator expression evaluated at the loop entry.
	value string
	// params names the yielded values bound by the callback.
	params []string
	// body runs for each successful yield.
	body []loweredStmt
	// async indicates that the iterator or callback requires await.
	async bool
	// returnBranch carries pending control flow out of body.
	returnBranch *loweredRangeBranch
	// parentBranch receives function returns crossing another yield callback.
	parentBranch *loweredRangeBranch
}

// loweredRangeBranch carries returns and labeled branches across one yield.
type loweredRangeBranch struct {
	// hasReturn records a pending return from the enclosing Go function.
	hasReturn string
	// value stores the pending function result.
	value string
	// resultType is the TypeScript type of value.
	resultType string
	// branchFlag selects a pending labeled branch after the iterator finishes.
	branchFlag string
	// branches records each target and its resumption statements.
	branches []loweredRangeLabeledBranch
}

// loweredRangeLabeledBranch resumes a source branch after an iterator call.
type loweredRangeLabeledBranch struct {
	// tok selects break or continue in the enclosing scope.
	tok token.Token
	// label is the source label targeted by the branch.
	label string
	// body resumes the branch in the scope containing the iterator call.
	body []loweredStmt
}

type loweredDeferState struct {
	used  bool
	async bool
	// recover is set when the function both registers a defer and lexically
	// contains a recover() call, so it must emit the panic-aware try/catch shape
	// that lets a deferred recover() stop an unwinding panic.
	recover bool
}

type loweredSwitch struct {
	value string
	cases []loweredSwitchCase
}

type loweredSwitchCase struct {
	defaultCase  bool
	values       []string
	body         []loweredStmt
	fallsThrough bool
}

type loweredSelect struct {
	hasReturn  string
	value      string
	result     string
	resultType string
	cases      []loweredSelectCase
	hasDefault bool
	returns    bool
	external   bool
}

type loweredSelectCase struct {
	id      int
	isSend  bool
	channel string
	value   string
	prelude []loweredStmt
	body    []loweredStmt
}

type loweredTypeSwitch struct {
	value       string
	varName     string
	varRef      bool
	cases       []loweredTypeSwitchCase
	defaultBody []loweredStmt
	defaultRef  bool
}

// typeSwitchValueName holds a type switch operand, evaluated once.
const typeSwitchValueName = "__goscriptTypeSwitchValue"

// typeSwitchNilCase stands in a case's types for the nil alternative, which
// matches only a nil interface operand.
const typeSwitchNilCase = "null"

// loweredTypeSwitchCase is one clause of a type switch. types holds the runtime
// type info of each alternative, or typeSwitchNilCase for nil. binding is the
// value the case variable takes: the narrowed copy for a one-type case, or the
// operand itself when the clause lists several types or nil.
type loweredTypeSwitchCase struct {
	types   []string
	tsTypes []string
	binding string
	varRef  bool
	body    []loweredStmt
}
