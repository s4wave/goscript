package compiler

import (
	"go/ast"
	"go/importer"
	"go/parser"
	"go/token"
	"go/types"
	"slices"
	"strings"
	"testing"

	"golang.org/x/tools/go/packages"
)

// readOnlyTablesSource declares package tables and local arrays named ro*
// that only reads use, and ones named rw* that some use may change.
const readOnlyTablesSource = `package p

import (
	"bytes"
	"unsafe"
)

type named []byte

func (n named) first() byte { return n[0] }

var (
	roArray   = [4]uint8{1, 2, 3, 4}
	roSlice   = []int{1, 2, 3}
	roString  = []byte("abc")
	roChain   = []int{1, 2, 3}
	roNoInit  [8]byte
	roRange   = [3]int{1, 2, 3}
	roCopy    = []int{1, 2, 3}
	rwAssign  = []int{1, 2, 3}
	rwElem    = [2]int{1, 2}
	rwInc     = [2]int{1, 2}
	rwAddr    = [2]int{1, 2}
	rwElemPtr = [2]int{1, 2}
	rwParam   = []int{1, 2}
	rwChain   = []int{1, 2}
	rwReturn  = []int{1, 2}
	rwLocal   = []int{1, 2}
	rwOther   = []byte("ab")
	rwCopyDst = []int{1, 2}
	rwAppend  = []int{1, 2}
	rwUnsafe  = []byte("ab")
	rwMethod  = named("ab")
	rwField   = [1]struct{ x int }{}
	rwVariad  = []int{1, 2}
	rwClosure = []int{1, 2}
	rwConvert = []byte("ab")
	rwValue   = [2]int{1, 2}
	rwReassign = []int{1, 2}
	RwExport  = []int{1, 2}
)

func read(a []int) int      { return a[0] + len(a) }
func pass(a []int) int      { return read(a[1:]) }
func write(a []int)         { a[0] = 1 }
func passWrite(a []int)     { write(a[1:]) }
func keep(a []int) []int    { return a }
func variadic(a ...[]int)   {}
func assignParam(a []int)   { a = nil; _ = a }
func closure(a []int)       { func() { a[0] = 2 }() }
func byValue(roParam [2]int) int { return roParam[0] }

func uses() {
	_ = roArray[1] + roArray[:][0] + roArray[1:3][0] + uint8(len(roArray[:2]))
	_ = read(roSlice[1:]) + cap(roSlice[:2:3])
	_ = string(roString[1:])
	_ = pass(roChain[:])
	_ = roNoInit[3]
	for _, v := range roRange[1:] {
		_ = v
	}
	roLocal := [2]int{1, 2}
	for _, v := range roLocal {
		_ = v + roLocal[0]
	}
	rwLocalArray := [2]int{1, 2}
	rwLocalArray[1] = 3
	rwLocalSlice := rwLocalArray[:]
	_ = rwLocalSlice
	dst := make([]int, 2)
	copy(dst, roCopy[1:])
	dst = append(dst, roCopy[1:]...)

	rwAssign = nil
	rwElem[0] = 1
	rwInc[1]++
	_ = &rwAddr
	_ = &rwElemPtr[0]
	write(rwParam[1:])
	passWrite(rwChain[:])
	_ = keep(rwReturn[1:])
	local := rwLocal[1:]
	_ = local
	_ = bytes.Equal(rwOther[1:], nil)
	copy(rwCopyDst[1:], dst)
	_ = append(rwAppend[:1], 5)
	_ = unsafe.SliceData(rwUnsafe[1:])
	_ = rwMethod[1:].first()
	rwField[0].x = 1
	variadic(rwVariad[1:])
	closure(rwClosure[1:])
	_ = named(rwConvert[1:])
	_ = byValue(rwValue)
	_ = RwExport[1:]
	assignParam(rwReassign[1:])
}
`

// TestCollectReadOnlyTables checks which tables only reads use.
func TestCollectReadOnlyTables(t *testing.T) {
	// The source type-checks as a package.
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "p.go", readOnlyTablesSource, parser.ParseComments)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	info := &types.Info{
		Types: make(map[ast.Expr]types.TypeAndValue),
		Defs:  make(map[*ast.Ident]types.Object),
		Uses:  make(map[*ast.Ident]types.Object),
	}
	conf := types.Config{Importer: importer.Default()}
	typesPkg, err := conf.Check("example.test/p", fset, []*ast.File{file}, info)
	if err != nil {
		t.Fatalf("check: %v", err)
	}

	// The ro tables are read only, and no other.
	pkg := &packages.Package{Types: typesPkg, TypesInfo: info, Syntax: []*ast.File{file}, Fset: fset}
	var got []string
	for obj := range collectReadOnlyTables(pkg) {
		got = append(got, obj.Name())
	}
	slices.Sort(got)
	var want []string
	for _, obj := range info.Defs {
		if obj != nil && strings.HasPrefix(obj.Name(), "ro") {
			want = append(want, obj.Name())
		}
	}
	slices.Sort(want)
	if !slices.Equal(got, want) {
		t.Fatalf("read-only tables = %v, want %v", got, want)
	}
}
