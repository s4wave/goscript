package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

// TestProtobufTypeScriptBindingCrossFileMapAndRepeatedFields verifies that a
// single container struct binds a map field with message values and a
// repeated message field when both referenced messages are declared in
// another binding file of the same proto package. Each field constructor
// qualifies the sibling binding file's published message class through the
// minted side-effect import.
func TestProtobufTypeScriptBindingCrossFileMapAndRepeatedFields(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/crossfilepb\n\ngo 1.25\n")
	writeTestFile(t, dir, "root.pb.go", `package crossfilepb

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
	writeTestFile(t, dir, "world_storage.pb.go", `package crossfilepb

type MercuryWorldState struct {
	SnapshotsByTick map[string]*WorldSnapshot `+"`"+`protobuf:"bytes,1,rep,name=snapshots_by_tick,json=snapshotsByTick,proto3" json:"snapshots_by_tick,omitempty" protobuf_key:"bytes,0,opt,name=key" protobuf_val:"bytes,1,opt,name=value"`+"`"+`
	Events          []*WorldEvent             `+"`"+`protobuf:"bytes,2,rep,name=events,proto3" json:"events,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "world_storage.pb.ts", `import { WorldEvent, WorldSnapshot } from './root.pb.js'

export interface MercuryWorldState {
  snapshotsByTick?: { [key: string]: WorldSnapshot }
  events?: WorldEvent[]
}
export const MercuryWorldState = {} as any
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

	storage := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "crossfilepb", "world_storage.pb.ts"))
	wantSnippets := []string{
		`import * as __protobuf_ts_root_pb from`,
		`(MercuryWorldState as any).__protobufTypeScriptFields = {"events": __protobuf_ts_root_pb.WorldEvent, "snapshotsByTick": __protobuf_ts_root_pb.WorldSnapshot};`,
	}
	for _, snippet := range wantSnippets {
		if !strings.Contains(storage, snippet) {
			t.Fatalf("storage binding should resolve the cross-file map value and repeated message fields through the sibling binding\nwant: %s\ngot:\n%s", snippet, storage)
		}
	}
	root := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "crossfilepb", "root.pb.ts"))
	if !strings.Contains(root, `__protobufTypeScriptMessage = __protobuf_ts.WorldSnapshot;`) ||
		!strings.Contains(root, `__protobufTypeScriptMessage = __protobuf_ts.WorldEvent;`) {
		t.Fatalf("sibling binding should keep binding its own messages, got:\n%s", root)
	}
}
