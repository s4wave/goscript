package compiler

import (
	"context"
	"go/ast"
	"go/parser"
	"go/token"
	"go/types"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// TestCompilePackagesColorsTestVariantInterfaces keeps an async implementation
// visible when its interface package also contributes same-package tests.
func TestCompilePackagesColorsTestVariantInterfaces(t *testing.T) {
	// The test variant contributes a sync implementation; the production
	// importer contributes the async implementation of the same interface.
	dir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/stage\n\ngo 1.27.0\n",
		"store/store.go": `package store
 type Value struct { N int }
 type Store interface { Open() (*Value,func(),error) }
 func Open(s Store) (*Value,func(),error) { return s.Open() }
 `,
		"store/store_test.go": `package store
 type syncStore struct{}
 func (syncStore) Open() (*Value,func(),error) { return &Value{},func(){},nil }
 `,
		"impl/impl.go": `package impl
 import "example.test/stage/store"
 type Store struct{}
 func (Store) Open() (*store.Value,func(),error) { ch:=make(chan int,1);ch<-9;return &store.Value{N:<-ch},func(){},nil }
 `,
		"consumer/consumer.go": `package consumer
 import("example.test/stage/store";"example.test/stage/impl")
 func Use() int { n,release,err:=store.Open(impl.Store{});if err!=nil {panic(err)};release();return n.N }
 `,
		"consumer/consumer_test.go": `package consumer
 import "testing"
 func TestUse(t *testing.T) {if Use()!=9 {t.Fatal("wrong value")}}
 `,
	})

	// Compile both packages together, preserving their distinct checked types.
	out := t.TempDir()
	req := NewCompileRequestOwner().NewRequest(Config{Dir: dir, OutputPath: out}, []string{"./store", "./consumer"})
	req.Tests = true
	if _, err := NewCompileService().Compile(context.Background(), req); err != nil {
		t.Fatal(err)
	}

	// Both the interface wrapper and its tuple consumer must suspend.
	content, err := os.ReadFile(filepath.Join(out, "@goscript/example.test/stage/store/store.gs.ts"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(content), "export async function Open(") {
		t.Fatalf("async implementation lost across package test variants:\n%s", content)
	}
	consumer, err := os.ReadFile(filepath.Join(out, "@goscript/example.test/stage/consumer/consumer.gs.ts"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(consumer), "await store.Open(") {
		t.Fatalf("tuple call is not awaited:\n%s", consumer)
	}
}

// TestVariantTypesKeepDeclaredIdentity distinguishes local declarations, named
// types with equal underlying shapes, and different concrete type arguments.
func TestVariantTypesKeepDeclaredIdentity(t *testing.T) {
	// Check several declarations in one file set, as a package graph does.
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "identity.go", `package identity
 type Left struct { N int }
 type Right struct { N int }
 type Box[T any] struct { Value T }
 func first() { type Local struct{}; _ = Local{} }
 func second() { type Local struct{}; _ = Local{} }
 `, 0)
	if err != nil {
		t.Fatal(err)
	}
	info := &types.Info{Defs: make(map[*ast.Ident]types.Object)}
	pkg, err := new(types.Config).Check("example.test/identity", fset, []*ast.File{file}, info)
	if err != nil {
		t.Fatal(err)
	}

	// A repeated spelling in two function scopes denotes two declarations.
	var locals []types.Type
	for _, obj := range info.Defs {
		if obj != nil && obj.Name() == "Local" {
			locals = append(locals, obj.Type())
		}
	}
	if len(locals) != 2 {
		t.Fatalf("got %d local declarations", len(locals))
	}
	box := pkg.Scope().Lookup("Box").Type()
	ints, err := types.Instantiate(nil, box, []types.Type{types.Typ[types.Int]}, true)
	if err != nil {
		t.Fatal(err)
	}
	stringBox, err := types.Instantiate(nil, box, []types.Type{types.Typ[types.String]}, true)
	if err != nil {
		t.Fatal(err)
	}

	// Equal layouts and origins do not erase declared or argument identity.
	for _, pair := range [][2]types.Type{
		{locals[0], locals[1]},
		{pkg.Scope().Lookup("Left").Type(), pkg.Scope().Lookup("Right").Type()},
		{ints, stringBox},
	} {
		if identicalVariantTypes(pair[0], pair[1]) {
			t.Fatalf("distinct types merged: %s and %s", pair[0], pair[1])
		}
	}
}
