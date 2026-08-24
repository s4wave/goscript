package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestProtobufTypeScriptBindingResolvesNestedCrossFileRefs(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/nestedcrossfilepb\n\ngo 1.25\n")
	writeTestFile(t, dir, "inner.pb.go", `package nestedcrossfilepb

// Outer_Inner is the Go name protoc-gen-go emits for the nested message
// Outer.Inner.
type Outer_Inner struct {
	Name string `+"`"+`protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "inner.pb.ts", `export interface Outer_Inner {
  name?: string
}
export const Outer_Inner = {} as any
`)
	writeTestFile(t, dir, "outer.pb.go", `package nestedcrossfilepb

type Holder struct {
	First *Outer_Inner   `+"`"+`protobuf:"bytes,1,opt,name=first,proto3" json:"first,omitempty"`+"`"+`
	Rest  []*Outer_Inner `+"`"+`protobuf:"bytes,2,rep,name=rest,proto3" json:"rest,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "outer.pb.ts", `import { Outer_Inner } from './inner.pb.js'

export interface Holder {
  first?: Outer_Inner
  rest?: Outer_Inner[]
}
export const Holder = {} as any
`)

	out := filepath.Join(dir, "out")
	comp, err := NewCompiler(&Config{
		Dir:                       dir,
		OutputPath:                out,
		ProtobufTypeScriptBinding: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatalf("compile with protobuf TypeScript binding: %v", err)
	}

	outer := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "nestedcrossfilepb", "outer.pb.ts"))
	wantSnippets := []string{
		`(Holder as any).__protobufTypeScriptFields = {"first": __protobuf_ts_inner_pb.Outer_Inner, "rest": __protobuf_ts_inner_pb.Outer_Inner};`,
		`import * as __protobuf_ts_inner_pb from "`,
	}
	for _, snippet := range wantSnippets {
		if !strings.Contains(outer, snippet) {
			t.Fatalf("binding should resolve nested Outer.Inner fields through the sibling binding\nwant: %s\ngot:\n%s", snippet, outer)
		}
	}
	inner := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "nestedcrossfilepb", "inner.pb.ts"))
	if !strings.Contains(inner, `__protobufTypeScriptMessage = __protobuf_ts.Outer_Inner;`) {
		t.Fatalf("sibling binding should keep binding its own nested message, got:\n%s", inner)
	}
}
