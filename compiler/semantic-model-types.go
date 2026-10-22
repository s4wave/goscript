package compiler

import (
	"go/ast"
	"go/token"
	"go/types"
	"sync"

	"golang.org/x/tools/go/packages"
)

// SemanticModel is the immutable compiler semantic surface consumed by lowering.
type SemanticModel struct {
	// runtimePackageNames are the runtime names of the packages that share
	// their name with another package of the program (see sharedPackageNames).
	runtimePackageNames map[string]string

	packages     map[string]*semanticPackage
	addressTaken map[types.Object]bool
	needsVarRef  map[types.Object]bool
	// changedVars holds the package variables whose storage some package
	// may change after initialization (see recordChangedPackageVars).
	changedVars map[types.Object]bool
	// effectFreeFuncs holds the functions whose calls have no effects (see
	// collectEffectFreeFunctions).
	effectFreeFuncs     map[types.Object]bool
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
	// asyncOverrideFunctions holds the override functions that metadata makes
	// async only in a program with an async implementation of a named method.
	asyncOverrideFunctions map[*types.Func]bool
	// funcValueClasses holds the key of each class of calls through function
	// values, by shape (see funcValueShape).
	funcValueClasses map[string]*types.Func
	// asyncValueClasses holds the classes whose calls may suspend.
	asyncValueClasses map[*types.Func]bool
	// valueNodes holds the literal, lazy initializer and override value nodes
	// of the async analysis by key.
	valueNodes map[*types.Func]*semanticFunction
	// asyncWhenTargets holds the functions, methods and interface methods
	// that override metadata makes async only in some programs.
	asyncWhenTargets map[*types.Func]bool
	// syncOverrideInterfaces holds the override interfaces that a whole
	// program closes because metadata declares them sync. Their TypeScript
	// method types may admit a promise.
	syncOverrideInterfaces map[*types.Named]bool
	// funcLitNodes holds the literal nodes by the literal's position.
	funcLitNodes map[token.Pos]*semanticFunction
	// summaries holds the body summaries the build extracted, by package
	// path.
	summaries map[string][]byte
	// staleSummaries lists the packages whose stored body summaries did not
	// apply. A model with stale summaries is incomplete.
	staleSummaries []string
	// mutexNodes holds the node of each mutex with a known critical section,
	// which calls its critical sections.
	mutexNodes map[types.Object]*semanticFunction
	// openMethods holds the interface methods the coloring leaves open: a
	// call of one makes its caller async, but the method stays sync.
	openMethods map[*types.Func]bool
	// asyncDirectives holds the //goscript:async and //goscript:sync
	// directives of the compiled packages.
	asyncDirectives asyncDirectives
	// callSiteFunctions holds the functions and methods that
	// //goscript:callsite marks (see lowering-call-sites.go).
	callSiteFunctions map[*types.Func]bool
	// liveCode holds the reachable functions and methods of a program built
	// with dead code elimination, or nil when every function is kept (see
	// semantic-dead-code.go).
	liveCode *liveCode
	// makesFuncValues reports whether the program is whole and makes
	// function values by reflection, and reflectTwins holds the functions
	// and methods that get a twin for reflect.Value.Call (see
	// semantic-reflect-twins.go).
	makesFuncValues bool
	reflectTwins    map[*types.Func]bool
	// asyncReport holds the async report the build was asked for, or nil.
	asyncReport *AsyncReport
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
	// deferredVars holds the lazy package variables that the package
	// initializer does not initialize (see deferPackageTables).
	deferredVars map[types.Object]bool
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
	// assignments holds how the package's variables are assigned. Lowering
	// builds it once, on first use, from the package syntax.
	assignments     *localAssignments
	assignmentsOnce sync.Once
	// readOnlyTables holds the package's read-only tables, which lowering
	// collects once, on first use (see readOnlyTablesFor).
	readOnlyTables     map[types.Object]bool
	readOnlyTablesOnce sync.Once
	// funcLits holds the async analysis node of each function literal, by
	// the literal's position.
	funcLits map[token.Pos]*semanticFunction
	// lazyInits holds the node of each lazily initialized variable's
	// initializer.
	lazyInits map[types.Object]*semanticFunction
	// funcValues holds the function values the package takes.
	funcValues []funcValue
	// assertedFuncShapes holds the shapes of the func types the package
	// asserts from interface values, through which values that reflection
	// made can reach the package's code.
	assertedFuncShapes map[string]bool
	// topValueCalls holds the shapes of the function values called outside
	// function bodies, by package initialization.
	topValueCalls map[string]bool
	// suspendingValueShapes holds the shapes of the function values that
	// override functions, which metadata lists in suspendingValues, hand to
	// the package's code at its calls of them.
	suspendingValueShapes map[string]bool
	// lockSections holds the node of the critical section of each Lock or
	// RLock call of a known mutex, by the call's position.
	lockSections map[token.Pos]*semanticFunction
	// mutexEscapes holds the mutexes the package lets escape the analysis,
	// with where.
	mutexEscapes map[types.Object]token.Pos
}

// localAssignments holds the facts lowering reads about how the variables of
// a package are assigned.
type localAssignments struct {
	// reassigned holds the variables that an assignment, an increment or a
	// range assignment changes after their declaration.
	reassigned map[types.Object]bool
	// values maps each variable declared by := to its initial value.
	values map[types.Object]ast.Expr
}

// literalKey returns the key of lit's node, or nil.
func (p *semanticPackage) literalKey(lit *ast.FuncLit) *types.Func {
	if node := p.funcLits[lit.Pos()]; node != nil {
		return node.function
	}
	return nil
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
	// receiverReadOnly reports whether the function is a method with a value
	// receiver that its body never modifies, so that a call need not copy
	// the receiver (see methodReceiverReadOnly).
	receiverReadOnly valueReadOnlyKind
	// paramsReadOnly reports, for each parameter, whether a call need not
	// copy its struct value (see funcParamsReadOnly). It is nil when no
	// parameter is.
	paramsReadOnly []valueReadOnlyKind
	// resultBorrows holds, for each result, the index of the parameter that
	// a call that asks to borrow its results may get back without a copy,
	// or -1 (see funcResultBorrows). It is nil when no result does.
	resultBorrows []int
	// receiverTransient and paramsTransient report whether the pointer
	// receiver and each pointer parameter are transient, so that a call can
	// pass a new reference to a field (see markTransientPointers).
	// paramsTransient is nil when no parameter is.
	receiverTransient bool
	paramsTransient   []bool
	// transientCandidates holds the pointer receiver and parameters whose
	// uses all may be transient, with the parameters they depend on (see
	// transientCandidates).
	transientCandidates []*transientCandidate
	// callbackCandidates holds the func parameters whose uses all may be
	// callback uses, with the parameters they depend on, and paramsCallback
	// the candidates that are callback parameters by index, or nil when no
	// parameter is (see semantic-reflect-twins.go).
	callbackCandidates []*callbackCandidate
	paramsCallback     []*callbackCandidate
	async              bool
	// asyncCause records why the node's own code suspends, when the fact
	// walk found it.
	asyncCause *asyncCause
	deferred   bool
	// calls holds the origins of the functions the body calls outside
	// function literals other than immediately invoked ones.
	calls map[*types.Func]bool
	// packageVars holds the package variables the body names in the same
	// region as calls.
	packageVars map[*types.Var]bool
	// valueCalls holds the shapes of the function values the body calls in
	// the same region as calls.
	valueCalls map[string]bool
	// locks holds the mutexes the body locks with a critical section the
	// analysis knows (see semantic-mutex.go).
	locks map[types.Object]bool
	// mutex is the mutex a critical section node locks.
	mutex types.Object
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
