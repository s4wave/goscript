package compiler

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// TestProtobufTypeScriptBindingOmitsEnumKindFields verifies that enum-kind
// struct fields stay out of the bound-message constructor metadata. An enum
// lowers as a named basic type, not a quoted message reference, so it must
// neither resolve through the bound-message registry nor produce an
// unresolved-reference diagnostic, whether the enum is declared in a sibling
// binding file of the same proto package or imported from another package
// through an alias.
func TestProtobufTypeScriptBindingOmitsEnumKindFields(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/enumpb\n\ngo 1.25\n")
	writeTestFile(t, dir, "status.pb.go", `package enumpb

type Status int32

const (
	StatusUnknown Status = 0
	StatusActive  Status = 1
)
`)
	writeTestFile(t, dir, "status.pb.ts", `export enum Status {
  UNKNOWN = 0,
  ACTIVE = 1,
}
`)
	writeTestFile(t, dir, "task.pb.go", `package enumpb

type Task struct {
	State Status `+"`"+`protobuf:"varint,1,opt,name=state,proto3,enum=enumpb.Status" json:"state,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "task.pb.ts", `import { Status } from './status.pb.js'

export interface Task {
  state?: Status
}
export const Task = {} as any
`)
	writeTestFile(t, dir, "dep/depimpl/remote.pb.go", `package remoteclause

type Mood int32

const (
	MoodHappy Mood = 0
)

type RemoteMsg struct {
	Name string `+"`"+`protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`+"`"+`
}

func (x *RemoteMsg) CloneVT() *RemoteMsg {
	return &RemoteMsg{Name: x.Name}
}
`)
	writeTestFile(t, dir, "dep/depimpl/remote.pb.ts", `export enum Mood {
  HAPPY = 0,
}
export interface RemoteMsg {
  name?: string
}
export const RemoteMsg = {} as any
`)
	writeTestFile(t, dir, "outer.pb.go", `package enumpb

import rdep "example.test/enumpb/dep/depimpl"

type Outer struct {
	State Status          `+"`"+`protobuf:"varint,1,opt,name=state,proto3,enum=enumpb.Status" json:"state,omitempty"`+"`"+`
	Mood  rdep.Mood       `+"`"+`protobuf:"varint,2,opt,name=mood,proto3,enum=dep.Mood" json:"mood,omitempty"`+"`"+`
	Ptr   *rdep.RemoteMsg `+"`"+`protobuf:"bytes,3,opt,name=ptr,proto3" json:"ptr,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "outer.pb.ts", `import type { RemoteMsg } from './dep/depimpl/remote.pb.js'
import { Status } from './status.pb.js'

export interface Outer {
  state?: Status
  mood?: Mood
  ptr?: RemoteMsg
}
export const Outer = {} as any
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

	task := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "enumpb", "task.pb.ts"))
	if !strings.Contains(task, `(Task as any).__protobufTypeScriptMessage = __protobuf_ts.Task;`) {
		t.Fatalf("Task should bind to its own const, got:\n%s", task)
	}
	if !strings.Contains(task, `(Task as any).__protobufTypeScriptFields = {};`) {
		t.Fatalf("enum-kind field from a sibling binding file should leave the constructor metadata empty, got:\n%s", task)
	}
	outer := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "enumpb", "outer.pb.ts"))
	wantFields := `(Outer as any).__protobufTypeScriptFields = {"ptr": rdep.RemoteMsg};`
	if !strings.Contains(outer, wantFields) {
		t.Fatalf("cross-package enum reference through the import alias should be omitted while the message field binds\nwant: %s\ngot:\n%s", wantFields, outer)
	}
	status := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "enumpb", "status.pb.ts"))
	if !strings.Contains(status, "export type Status = number") ||
		!strings.Contains(status, "export const StatusUnknown: Status = 0") {
		t.Fatalf("sibling enum binding file should lower the enum type and its constants, got:\n%s", status)
	}
	if strings.Contains(status, "__protobufTypeScriptMessage") || strings.Contains(status, "__protobufTypeScriptFields") {
		t.Fatalf("enum declarations should not gain bound-message metadata, got:\n%s", status)
	}
	if _, err := os.Stat(filepath.Join(out, "@goscript", "example.test", "enumpb", "status.gs.ts")); !os.IsNotExist(err) {
		t.Fatalf("bound enum file should not emit status.gs.ts, stat err=%v", err)
	}
}
