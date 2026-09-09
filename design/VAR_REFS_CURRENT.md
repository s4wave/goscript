# Current variable and field references

The handwritten [VarRef design](VAR_REFS.md) records the original requirement: an address identifies a variable's storage, and every pointer to that storage observes its current value. Its representation examples are historical. This note describes the current compiler and runtime.

`varRef(value)` creates a variable cell when analysis determines that the variable needs an address. A pointer variable needs its own cell only when its address is taken. A pointer to a named struct can be a direct class instance or a `VarRef` containing that instance; generated dereferences use `pointerValue` for both representations.

Generated structs store their values directly in `_fields`. Prototype accessors expose ordinary field reads and writes. `fieldRef(record, key)` returns the same reference for every address of that field. The reference reads and writes the record; constructing an unaddressed field allocates no reference cell. A pointer-valued field stores its pointer directly, so taking that field's address adds a reference around the pointer rather than dereferencing it.

Variable and field references allocate their owned pointer handle when `__goPointer` or `__goAddress` is first requested. These properties are prototype accessors. Pointer consumers use the reference API directly, rather than copying its JavaScript properties.

Cloning creates independent value storage through the declaring constructor. Assignment to an existing named struct uses `assignStruct`, preserving the target's field record and recursively preserving nested struct and array storage. Pointer, slice, map, and interface fields receive the source references. The compiler prepares the source value before assigning it. Ordinary, pointer, tuple, channel-receive, and package-variable assignments share this rule. Reflection uses the same assignment helper and obtains field addresses from the same field record as generated code.

For example, `p := &s.Count; s = Item{Count: 2}; *p = 3` leaves `s.Count == 3`, and `p == &s.Count` remains true. Replacing the struct instance or a nested aggregate would break that invariant even if the variable's outer `VarRef` remained intact.

`fmt` uses Go field names, field order, and type metadata. `%v` prints struct values, `%+v` includes field names, and `%#v` includes struct type names. A top-level struct pointer prints `&` followed by its value. Nested pointers and scalar pointers print addresses, which also prevents recursive pointer graphs from expanding indefinitely. Runtime addresses are stable within a process, but their numeric values need not match another process. Builtin `print` and `println` retain their deterministic inspection format and omit reference machinery.

The `varref_struct` compliance fixture checks held field pointers, nested aggregates, pointer fields, tuple and parallel assignment, package variables, and reflection against native Go. `fmt_struct_values` compares named and anonymous structs, pointer graphs, and a Logrus controller warning with native Go. Existing runtime tests exercise codecs, equality, reflection, and owned pointer handles. These checks establish the covered behaviors, not complete Go language or `fmt` conformance.
