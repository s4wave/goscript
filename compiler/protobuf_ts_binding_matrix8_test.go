package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

// TestProtobufTypeScriptBindingBindsExoticSamePackageShapes covers
// pointer-to-slice and slice-of-pointer-to-message fields that reference
// messages bound in a sibling same-package file, plus a struct whose field
// references a message bound in the same file while another field references
// the sibling binding's published class for the same proto package.
func TestProtobufTypeScriptBindingBindsExoticSamePackageShapes(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/exoticpb\n\ngo 1.25\n")
	writeTestFile(t, dir, "root.pb.go", `package exoticpb

type WorldSnapshot struct {
	Tick int64 `+"`"+`protobuf:"varint,1,opt,name=tick,proto3" json:"tick,omitempty"`+"`"+`
}

type WorldEvent struct {
	Name string `+"`"+`protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "root.pb.ts", `export interface WorldSnapshot {
  tick?: string
}
export const WorldSnapshot = {} as any
export interface WorldEvent {
  name?: string
}
export const WorldEvent = {} as any
`)
	writeTestFile(t, dir, "world_storage.pb.go", `package exoticpb

type MercuryEvent struct {
	Name string `+"`"+`protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`+"`"+`
}

type MercuryBatch struct {
	Events   []*MercuryEvent  `+"`"+`protobuf:"bytes,1,rep,name=events,proto3" json:"events,omitempty"`+"`"+`
	Snapshot *WorldSnapshot   `+"`"+`protobuf:"bytes,2,opt,name=snapshot,proto3" json:"snapshot,omitempty"`+"`"+`
}

type MercuryTickLog struct {
	History *[]*WorldEvent `+"`"+`protobuf:"bytes,1,opt,name=history,proto3" json:"history,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "world_storage.pb.ts", `import { WorldEvent, WorldSnapshot } from './root.pb.js'

export interface MercuryEvent {
  name?: string
}
export const MercuryEvent = {} as any
export interface MercuryBatch {
  events?: MercuryEvent[]
  snapshot?: WorldSnapshot
}
export const MercuryBatch = {} as any
export interface MercuryTickLog {
  history?: WorldEvent[]
}
export const MercuryTickLog = {} as any
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

	storage := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "exoticpb", "world_storage.pb.ts"))
	wantSnippets := []string{
		`(MercuryTickLog as any).__protobufTypeScriptFields = {"history": __protobuf_ts_root_pb.WorldEvent};`,
		`(MercuryBatch as any).__protobufTypeScriptFields = {"events": MercuryEvent, "snapshot": __protobuf_ts_root_pb.WorldSnapshot};`,
		`(MercuryEvent as any).__protobufTypeScriptMessage = __protobuf_ts.MercuryEvent;`,
	}
	for _, snippet := range wantSnippets {
		if !strings.Contains(storage, snippet) {
			t.Fatalf("storage binding should bind the exotic same-package field shapes\nwant: %s\ngot:\n%s", snippet, storage)
		}
	}
}
