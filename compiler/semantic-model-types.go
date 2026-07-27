package compiler

import (
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
}

type semanticPackage struct {
	pkgPath          string
	name             string
	source           *packages.Package
	declarations     []semanticDeclaration
	imports          []semanticImport
	types            []*semanticType
	values           []*semanticValue
	functions        []*semanticFunction
	initOrder        []types.Object
	generatedImports map[string]map[string]bool
	typeAssertions   []semanticTypeAssertion
	nilFacts         []semanticNilFact
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
	name                    string
	object                  types.Object
	typ                     types.Type
	zeroValueKind           string
	position                sourcePosition
	topLevel                bool
	asyncCompatibleFunction bool
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
	asyncReasons    []string
	calls           map[*types.Func]bool
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
