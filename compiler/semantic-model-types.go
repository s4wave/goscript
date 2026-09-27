package compiler

import (
	"go/ast"
	"go/types"
	"sync"

	"golang.org/x/tools/go/packages"
)

// SemanticModel is the immutable compiler semantic surface consumed by lowering.
type SemanticModel struct {
	packages            map[string]*semanticPackage
	addressTaken        map[types.Object]bool
	needsVarRef         map[types.Object]bool
	functions           map[*types.Func]*semanticFunction
	functionCallers     map[*types.Func][]*semanticFunction
	functionsByFullName map[string]*semanticFunction
	deferredPackages    map[string]bool
	// functionFullNames and functionAliases memoize lookups that lowering
	// performs concurrently. Both derive their value from the key alone, so a
	// racing store writes the same answer.
	functionFullNames map[*types.Func]string
	functionAliases   map[*types.Func]*semanticFunction
	// lateMemo receives entries added after freeze, when lowering reads the
	// model from many goroutines at once. Before that the maps above are
	// written by one goroutine and need no lock.
	lateMemo                 *modelLateMemo
	frozen                   bool
	types                    map[*types.Named]*semanticType
	values                   map[types.Object]*semanticValue
	generatedImports         map[string]map[string]bool
	generatedImportTypes     map[string]map[types.Type]bool
	interfaceImplementations []semanticInterfaceImplementation
	asyncInterfaceMethods    map[string]bool
	asyncInterfaceMethodObjs map[*types.Func]bool
	// summaries holds the body summaries the build extracted, by package
	// path.
	summaries map[string][]byte
	// staleSummaries lists the packages whose stored body summaries did not
	// apply. A model with stale summaries is incomplete.
	staleSummaries []string
}

// semanticPackage holds package facts built by one shard and read by lowering.
type semanticPackage struct {
	// pkgPath is the package import path.
	pkgPath string
	// name is the declared package name.
	name string
	// source holds the loaded syntax and type information.
	source *packages.Package
	// declarations records package declarations in source order.
	declarations []semanticDeclaration
	// imports records imports and their source locations.
	imports []semanticImport
	// types holds the package's named types.
	types []*semanticType
	// values holds the package's variables and constants, including locals.
	values []*semanticValue
	// functions holds semantic facts for functions and methods.
	functions []*semanticFunction
	// functionDecls indexes exact function objects, including methods and init declarations.
	// It is populated during declaration collection and immutable during lowering.
	functionDecls map[*types.Func]*ast.FuncDecl
	// initOrder records package variables in declaration order.
	initOrder []types.Object
	// lazyVars holds the package variables initialized lazily through a
	// getter.
	lazyVars map[types.Object]bool
	// asyncArgumentCalls records the calls whose function arguments can make
	// the callee async.
	asyncArgumentCalls []asyncArgumentCall
	// varRefNames holds the names of the package's values that any package
	// marks as needing a variable reference.
	varRefNames map[string]bool
	// generatedImports records implicit imports by source file.
	generatedImports map[string]map[string]bool
	// typeAssertions records source and target types of explicit assertions.
	typeAssertions []semanticTypeAssertion
	// nilFacts records nil conversions and typed nil interface risks.
	nilFacts []semanticNilFact
	// bodyInterfaces holds the named interfaces the package's function bodies
	// reach, applied from a body summary.
	bodyInterfaces []*types.Named
	// localFacts holds the fact digest lines of the marks on the package's
	// body locals, applied from a body summary.
	localFacts []string
}

type semanticDeclaration struct {
	kind     string
	name     string
	object   types.Object
	position sourcePosition
}

type semanticImport struct {
	path     string
	name     string
	file     string
	position sourcePosition
}

type semanticType struct {
	name        string
	named       *types.Named
	isInterface bool
	fields      []semanticField
	position    sourcePosition
}

type semanticField struct {
	name     string
	typ      types.Type
	doc      string
	tag      string
	embedded bool
	pkgPath  string
	index    []int
	offset   int64
	exported bool
}

type semanticValue struct {
	name          string
	object        types.Object
	typ           types.Type
	zeroValueKind string
	position      sourcePosition
	topLevel      bool
}

type semanticFunction struct {
	name            string
	function        *types.Func
	signature       *types.Signature
	receiver        *types.Named
	receiverPointer bool
	position        sourcePosition
	hasBody         bool
	async           bool
	deferred        bool
	// calls holds the origins of the functions the body calls outside
	// function literals other than immediately invoked ones.
	calls map[*types.Func]bool
	// packageVars holds the package variables the body names in the same
	// region as calls.
	packageVars map[*types.Var]bool
}

type semanticInterfaceImplementation struct {
	typ     *types.Named
	iface   *types.Named
	pointer bool
}

type semanticInterfaceImplementationGraphEntry struct {
	typ          *types.Named
	iface        *types.Named
	pointer      bool
	ifaceMethods map[string]*types.Func
	implMethods  map[string]*types.Func
}

type semanticAnonymousInterfaceImplementation struct {
	ifaceMethods map[string]*types.Func
	implMethods  map[string]*types.Func
}

type semanticImplementationMethodSet struct {
	typ      *types.Named
	receiver types.Type
	pointer  bool
	methods  map[string]*types.Func
}

type semanticTypeAssertion struct {
	position sourcePosition
	source   types.Type
	target   types.Type
}

type semanticNilFact struct {
	position sourcePosition
	kind     string
	typ      types.Type
}

type sourcePosition struct {
	file   string
	line   int
	column int
}

// modelLateMemo holds memo entries discovered after the model is frozen, when
// lowering reads it concurrently. Both values are derived from the key alone,
// so a racing store writes the same answer.
//
// A plain map behind a mutex rather than a sync.Map: sync.Map is built for
// read-mostly or disjoint-key access, and storing a string through it boxes the
// value on every write.
type modelLateMemo struct {
	mu        sync.Mutex
	fullNames map[*types.Func]string
	aliases   map[*types.Func]*semanticFunction
}

func newModelLateMemo() *modelLateMemo {
	return &modelLateMemo{
		fullNames: make(map[*types.Func]string),
		aliases:   make(map[*types.Func]*semanticFunction),
	}
}

func (m *modelLateMemo) loadFullName(fn *types.Func) (string, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	fullName, ok := m.fullNames[fn]
	return fullName, ok
}

func (m *modelLateMemo) storeFullName(fn *types.Func, fullName string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.fullNames[fn] = fullName
}

func (m *modelLateMemo) loadAlias(fn *types.Func) (*semanticFunction, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	semFn, ok := m.aliases[fn]
	return semFn, ok
}

func (m *modelLateMemo) storeAlias(fn *types.Func, semFn *semanticFunction) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.aliases[fn] = semFn
}
