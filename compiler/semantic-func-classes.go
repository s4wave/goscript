package compiler

import (
	"go/ast"
	"go/token"
	"go/types"
	"maps"
	"slices"
	"strconv"
)

// funcValueGraph holds the edges from function values to the classes of
// calls that may reach them.
type funcValueGraph struct {
	// classesByMember lists the classes each value's async mark makes async.
	classesByMember map[*types.Func][]*types.Func
	// members lists the distinct value keys.
	members []*types.Func
	// open lists the classes that are async whatever the program.
	open []*types.Func
	// asyncMembers lists the values that are async whatever the program:
	// async override functions and methods, and open interface methods.
	asyncMembers []*types.Func
}

// internFuncValueClasses gives each shape the program calls through a value
// a class key.
func internFuncValueClasses(model *SemanticModel) {
	// Each class key is a synthetic function.
	intern := func(shapes map[string]bool) {
		for shape := range shapes {
			if model.funcValueClasses[shape] == nil {
				model.funcValueClasses[shape] = newSyntheticNode(token.NoPos, nil, funcValueNodeName).function
			}
		}
	}

	// Functions, value nodes, package initialization and argument sites call
	// through values.
	for _, semFn := range model.functions {
		intern(semFn.valueCalls)
	}
	for _, node := range model.valueNodes {
		intern(node.valueCalls)
	}
	for _, semPkg := range model.packages {
		intern(semPkg.topValueCalls)
		for _, call := range semPkg.asyncArgumentCalls {
			for _, shape := range call.shapes {
				intern(map[string]bool{shape: true})
			}
		}
	}
}

// funcValueClassIndex finds the classes a value shape matches.
type funcValueClassIndex struct {
	// exact holds the class of each shape without a wildcard.
	exact map[string]*types.Func
	// byOp lists the classes by the operator of their signature, which
	// holds the variadic flag and the parameter and result counts.
	byOp map[string][]funcValueClassEntry
	// matches memoizes the classes of each value shape.
	matches map[string][]*types.Func
}

// funcValueClassEntry is a class with its parsed shape.
type funcValueClassEntry struct {
	node *funcShapeNode
	key  *types.Func
}

// newFuncValueClassIndex indexes the model's classes.
func newFuncValueClassIndex(model *SemanticModel) *funcValueClassIndex {
	index := &funcValueClassIndex{
		exact:   make(map[string]*types.Func),
		byOp:    make(map[string][]funcValueClassEntry),
		matches: make(map[string][]*types.Func),
	}
	for _, shape := range slices.Sorted(maps.Keys(model.funcValueClasses)) {
		node := parseFuncShape(shape)
		if node == nil {
			continue
		}
		key := model.funcValueClasses[shape]
		if !node.wild {
			index.exact[shape] = key
		}
		index.byOp[node.op] = append(index.byOp[node.op], funcValueClassEntry{node: node, key: key})
	}
	return index
}

// classes returns the classes whose calls may reach a value of shape. A
// shape that does not parse matches every class, as a value whose type is
// unknown could.
func (index *funcValueClassIndex) classes(shape string) []*types.Func {
	// Each shape is matched once.
	if matched, ok := index.matches[shape]; ok {
		return matched
	}
	node := parseFuncShape(shape)
	var matched []*types.Func

	// A shape that does not parse matches every class.
	if node == nil {
		for _, entries := range index.byOp {
			for _, entry := range entries {
				matched = append(matched, entry.key)
			}
		}
		index.matches[shape] = matched
		return matched
	}

	// A shape without a wildcard matches its own class exactly; wildcards on
	// either side match structurally.
	for _, entry := range index.byOp[node.op] {
		if (node.wild || entry.node.wild) && funcShapesMatch(node, entry.node) {
			matched = append(matched, entry.key)
		}
	}
	if key := index.exact[shape]; key != nil && !node.wild {
		matched = append(matched, key)
	}
	index.matches[shape] = matched
	return matched
}

// buildFuncValueGraph connects the function values of the program to the
// classes of calls that may reach them.
//
// In a library build every class is open, as a consumer may pass any
// function. In a whole program a class is open when the program asserts a
// matching func type from an interface value, or has it as a func parameter
// that escapes a function reflection can call, and uses a function that can
// make a function value of any type by reflection. An override function or method value is async when
// its metadata says so, and an interface method value when its interface is
// open.
func buildFuncValueGraph(
	model *SemanticModel,
	overrideFacts *OverrideFacts,
	values []funcValue,
	openMethods map[*types.Func]bool,
	wholeProgram bool,
) *funcValueGraph {
	// Without the whole program every class is open.
	graph := &funcValueGraph{classesByMember: make(map[*types.Func][]*types.Func)}
	if !wholeProgram {
		graph.open = slices.Collect(maps.Values(model.funcValueClasses))
		return graph
	}

	// Connect each value to the classes it matches.
	index := newFuncValueClassIndex(model)
	for _, value := range values {
		classes := index.classes(value.shape)
		if len(classes) == 0 {
			continue
		}
		if _, ok := graph.classesByMember[value.key]; !ok {
			graph.members = append(graph.members, value.key)
			if funcValueAsyncByItself(model, overrideFacts, value.key, openMethods) {
				graph.asyncMembers = append(graph.asyncMembers, value.key)
			}
		}
		graph.classesByMember[value.key] = appendUniqueFuncs(graph.classesByMember[value.key], classes)
	}

	// Asserted func types open their classes when the program can make
	// function values by reflection.
	if !programMakesFuncValues(model, overrideFacts, values) {
		return graph
	}
	model.makesFuncValues = true
	for _, semPkg := range model.packages {
		for shape := range semPkg.assertedFuncShapes {
			graph.open = appendUniqueFuncs(graph.open, index.classes(shape))
		}
	}

	// So do the func parameters that reflect.Value.Call can pass such values
	// to and that escape the call.
	for shape := range escapingReflectParamShapes(model) {
		graph.open = appendUniqueFuncs(graph.open, index.classes(shape))
	}
	return graph
}

// programMakesFuncValues reports whether the program calls or takes the
// value of an override function or method that metadata names as a maker of
// function values.
func programMakesFuncValues(model *SemanticModel, overrideFacts *OverrideFacts, values []funcValue) bool {
	// A maker is named by its function name or Type.Method key.
	isMaker := func(fn *types.Func) bool {
		if fn == nil || fn.Pkg() == nil {
			return false
		}
		name := fn.Name()
		if signature, _ := fn.Type().(*types.Signature); signature != nil && signature.Recv() != nil {
			receiver := receiverNamedType(signature.Recv().Type())
			if receiver == nil {
				return false
			}
			name = receiver.Obj().Name() + "." + name
		}
		return overrideFacts.IsFuncValueMaker(fn.Pkg().Path(), name)
	}

	// Look for one among the called functions and the values.
	for called := range model.functionCallers {
		if isMaker(called) {
			return true
		}
	}
	return slices.ContainsFunc(values, func(value funcValue) bool { return isMaker(value.key) })
}

// funcValueAsyncByItself reports whether the value key is async whatever its
// compiled callers: an override function or method that metadata marks
// async, or a method of an open interface.
func funcValueAsyncByItself(
	model *SemanticModel,
	overrideFacts *OverrideFacts,
	key *types.Func,
	openMethods map[*types.Func]bool,
) bool {
	// A compiled function or a value node decides itself.
	if semanticFunctionFor(model, key) != nil || key.Pkg() == nil {
		return false
	}

	// An interface method is open or decided by its implementations.
	signature, _ := key.Type().(*types.Signature)
	if signature != nil && signature.Recv() != nil && isInterfaceType(signature.Recv().Type()) {
		return openMethods[key]
	}

	// An override function or method follows its metadata.
	pkgPath := key.Pkg().Path()
	_, metadataName, _ := overrideMetadataName(key)
	_, callsFields := overrideFacts.AsyncWhenFieldShapes(key)
	return overrideFacts.IsFunctionAsync(pkgPath, key.Name()) ||
		overrideFacts.IsFunctionCallbackAsync(pkgPath, metadataName) ||
		overrideMethodAsync(overrideFacts, key) || callsFields
}

// appendUniqueFuncs appends the functions of add that list lacks.
func appendUniqueFuncs(list, add []*types.Func) []*types.Func {
	for _, fn := range add {
		if !slices.Contains(list, fn) {
			list = append(list, fn)
		}
	}
	return list
}

// programFuncValues returns the function values every package takes.
func programFuncValues(model *SemanticModel) []funcValue {
	var values []funcValue
	for _, pkgPath := range slices.Sorted(maps.Keys(model.packages)) {
		values = append(values, model.packages[pkgPath].funcValues...)
	}
	return values
}

// valueCallAsync reports whether a call through a value of typ may suspend.
// A shape the analysis did not see is decided as open.
func (m *SemanticModel) valueCallAsync(typ types.Type) bool {
	return m.shapeCallAsync(funcValueShape(typ))
}

// shapeCallAsync reports whether a call through a value of shape may suspend.
func (m *SemanticModel) shapeCallAsync(shape string) bool {
	class := m.funcValueClasses[shape]
	return class == nil || m.asyncValueClasses[class]
}

// literalKey returns the key of lit's node, or nil.
func (m *SemanticModel) literalKey(lit *ast.FuncLit) *types.Func {
	if node := m.funcLitNodes[lit.Pos()]; node != nil {
		return node.function
	}
	return nil
}

// funcLitAsync reports whether the function literal at pos may suspend. A
// literal the analysis did not see is decided as async.
func (m *SemanticModel) funcLitAsync(pos token.Pos) bool {
	node := m.funcLitNodes[pos]
	return node == nil || node.async
}

// funcValueShapeFacts returns the fact digest lines of the classes a
// package's code calls through values, so that a package is lowered again
// when one of them changes color.
func (m *SemanticModel) funcValueShapeFacts(semPkg *semanticPackage) []string {
	// Collect the shapes of every node of the package.
	shapes := make(map[string]bool)
	for _, semFn := range semPkg.functions {
		maps.Copy(shapes, semFn.valueCalls)
	}
	for _, node := range semPkg.funcLits {
		maps.Copy(shapes, node.valueCalls)
	}
	for _, node := range semPkg.lazyInits {
		maps.Copy(shapes, node.valueCalls)
	}
	maps.Copy(shapes, semPkg.topValueCalls)

	// Each shape's line holds its class's color.
	var lines []string
	for shape := range shapes {
		async := m.asyncValueClasses[m.funcValueClasses[shape]]
		lines = append(lines, "value-call|"+shape+"|"+strconv.FormatBool(async))
	}
	return lines
}
