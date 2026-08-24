package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

// TestProtobufTypeScriptBindingResolvesTwoHopAliasChain verifies that a
// two-hop cross-package import chain binds through the actual lowered import
// aliases at both hops: package chainroot references a bound message from
// package midclause, which itself references a bound message from package
// leafclause. Each consumer import alias differs from the dependency's
// directory basename and Go package clause.
func TestProtobufTypeScriptBindingResolvesTwoHopAliasChain(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/chainpb\n\ngo 1.25\n")
	writeTestFile(t, dir, "leaf/leafimpl/leaf.pb.go", `package leafclause

type LeafMsg struct {
	Name string `+"`"+`protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "leaf/leafimpl/leaf.pb.ts", `export interface LeafMsg {
  name?: string
}
export const LeafMsg = {} as any
`)
	writeTestFile(t, dir, "mid/midimpl/mid.pb.go", `package midclause

import lref "example.test/chainpb/leaf/leafimpl"

type MidMsg struct {
	Leaf *lref.LeafMsg `+"`"+`protobuf:"bytes,1,opt,name=leaf,proto3" json:"leaf,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "mid/midimpl/mid.pb.ts", `import type { LeafMsg } from '../leaf/leafimpl/leaf.pb.js'

export interface MidMsg {
  leaf?: LeafMsg
}
export const MidMsg = {} as any
`)
	writeTestFile(t, dir, "foo.pb.go", `package chainroot

import mref "example.test/chainpb/mid/midimpl"

type RootMsg struct {
	Mid *mref.MidMsg `+"`"+`protobuf:"bytes,1,opt,name=mid,proto3" json:"mid,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "foo.pb.ts", `import type { MidMsg } from './mid/midimpl/mid.pb.js'

export interface RootMsg {
  mid?: MidMsg
}
export const RootMsg = {} as any
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
	patterns := []string{".", "./mid/midimpl", "./leaf/leafimpl"}
	if _, err := comp.CompilePackages(context.Background(), patterns...); err != nil {
		t.Fatalf("compile with protobuf TypeScript binding: %v", err)
	}

	root := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "chainpb", "foo.pb.ts"))
	wantRoot := []string{
		`(RootMsg as any).__protobufTypeScriptMessage = __protobuf_ts.RootMsg;`,
		`(RootMsg as any).__protobufTypeScriptFields = {"mid": mref.MidMsg};`,
	}
	for _, snippet := range wantRoot {
		if !strings.Contains(root, snippet) {
			t.Fatalf("root binding should resolve the mid field through the lowered import alias mref\nwant: %s\ngot:\n%s", snippet, root)
		}
	}

	mid := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "chainpb", "mid", "midimpl", "mid.pb.ts"))
	wantMid := []string{
		`(MidMsg as any).__protobufTypeScriptMessage = __protobuf_ts.MidMsg;`,
		`(MidMsg as any).__protobufTypeScriptFields = {"leaf": lref.LeafMsg};`,
	}
	for _, snippet := range wantMid {
		if !strings.Contains(mid, snippet) {
			t.Fatalf("mid binding should resolve the leaf field through the lowered import alias lref\nwant: %s\ngot:\n%s", snippet, mid)
		}
	}

	leaf := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "chainpb", "leaf", "leafimpl", "leaf.pb.ts"))
	wantLeaf := `(LeafMsg as any).__protobufTypeScriptMessage = __protobuf_ts.LeafMsg;`
	if !strings.Contains(leaf, wantLeaf) {
		t.Fatalf("leaf binding should bind its own message\nwant: %s\ngot:\n%s", wantLeaf, leaf)
	}
}
