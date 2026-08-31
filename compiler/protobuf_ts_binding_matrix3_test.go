package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

// TestProtobufTypeScriptBindingCrossFileDigitCamelFieldCtor verifies that a
// message-kind field resolves a sibling binding's GoScript wrapper class
// when the Go struct applies protoc-gen-go's digit-camel capitalization in
// another file of the same proto package. The constructor must be the
// constructible wrapper class named after the Go type, not the sibling
// schema const, while an exactly matching struct elsewhere still binds to
// its own wrapper class exactly.
func TestProtobufTypeScriptBindingCrossFileDigitCamelFieldCtor(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/digitcrosspb\n\ngo 1.25\n")
	writeTestFile(t, dir, "world.pb.go", `package digitcrosspb

type V86Fs struct {
	Name string
}
`)
	writeTestFile(t, dir, "world.pb.ts", `export interface V86fs {
  name?: string
}
export const V86fs = {} as any
`)
	writeTestFile(t, dir, "root.pb.go", `package digitcrosspb

type WorldCommit struct {
	Checkpoint *V86Fs `+"`"+`protobuf:"bytes,1,opt,name=checkpoint,json=checkpoint,proto3" json:"checkpoint,omitempty"`+"`"+`
}

type ExactMsg struct {
	Name string `+"`"+`protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "root.pb.ts", `import { V86fs } from './world.pb.js'

export interface WorldCommit {
  checkpoint?: V86fs
}
export const WorldCommit = {} as any
export interface ExactMsg {
  name?: string
}
export const ExactMsg = {} as any
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

	root := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "digitcrosspb", "root.pb.ts"))
	if !strings.Contains(root, `"checkpoint": __goscript_world_pb_ts.V86Fs`) {
		t.Fatalf("cross-file field should qualify the sibling GoScript wrapper class V86Fs, got:\n%s", root)
	}
	if !strings.Contains(root, `__protobufTypeScriptMessage = __protobuf_ts.ExactMsg;`) {
		t.Fatalf("exactly matching struct elsewhere should still bind to its own const exactly, got:\n%s", root)
	}

	world := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "digitcrosspb", "world.pb.ts"))
	if !strings.Contains(world, `__protobufTypeScriptMessage = __protobuf_ts.V86fs;`) {
		t.Fatalf("sibling binding should keep binding V86Fs to its exported const V86fs, got:\n%s", world)
	}
}
