package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

// TestProtobufTypeScriptBindingResolvesSamePackageCrossFileOneofCases binds a
// oneof whose message-kind case value references a message declared in a
// sibling .pb.go of the same proto package. Every case must bind into the
// parent's oneof metadata and the message-kind value must emit through the
// sibling binding import.
func TestProtobufTypeScriptBindingResolvesSamePackageCrossFileOneofCases(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", `module example.test/oneofcrossfilepb

go 1.25
`)
	writeTestFile(t, dir, "root.pb.go", `package oneofcrossfilepb

type WorldSnapshot struct {
	Tick int64 `+"`"+`protobuf:"varint,1,opt,name=tick,proto3" json:"tick,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "root.pb.ts", `export interface WorldSnapshot {
  tick?: string
}
export const WorldSnapshot = {} as any
`)
	writeTestFile(t, dir, "world_storage.pb.go", `package oneofcrossfilepb

type EventEnvelope struct {
	Choice isEventEnvelope_Choice `+"`"+`protobuf_oneof:"choice"`+"`"+`
}

type isEventEnvelope_Choice interface{ isEventEnvelope_Choice() }

type EventEnvelope_Label struct {
	Label string `+"`"+`protobuf:"bytes,2,opt,name=label,proto3" json:"label,omitempty,oneof"`+"`"+`
}

func (*EventEnvelope_Label) isEventEnvelope_Choice() {}

type EventEnvelope_Snapshot struct {
	Snapshot *WorldSnapshot `+"`"+`protobuf:"bytes,1,opt,name=snapshot,proto3,oneof"`+"`"+`
}

func (*EventEnvelope_Snapshot) isEventEnvelope_Choice() {}
`)
	writeTestFile(t, dir, "world_storage.pb.ts", `export interface EventEnvelope {
  choice?: EventEnvelopeChoice
}
export const EventEnvelope = {} as any
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

	storage := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "oneofcrossfilepb", "world_storage.pb.ts"))
	wantSnippets := []string{
		`(EventEnvelope as any).__protobufTypeScriptFields = {"snapshot": __protobuf_ts_root_pb.WorldSnapshot};`,
		`(EventEnvelope as any).__protobufTypeScriptOneofFields = {"choice": {"label": EventEnvelope_Label, "snapshot": EventEnvelope_Snapshot}};`,
	}
	for _, snippet := range wantSnippets {
		if !strings.Contains(storage, snippet) {
			t.Fatalf("storage binding should bind cross-file oneof cases through the sibling binding\nwant: %s\ngot:\n%s", snippet, storage)
		}
	}
	root := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "oneofcrossfilepb", "root.pb.ts"))
	if !strings.Contains(root, `(WorldSnapshot as any).__protobufTypeScriptMessage = __protobuf_ts.WorldSnapshot;`) {
		t.Fatalf("sibling binding should keep binding its own messages, got:\n%s", root)
	}
}
