package compiler

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func matrix7WriteModule(t *testing.T, module string) string {
	t.Helper()
	dir := t.TempDir()
	pkg := module[strings.LastIndex(module, "/")+1:]
	writeTestFile(t, dir, "go.mod", "module "+module+"\n\ngo 1.25\n")
	writeTestFile(t, dir, "a.pb.go", "package "+pkg+`

type V86Fs struct {
	Name string "protobuf:\"bytes,1,opt,name=name,proto3\" json:\"name,omitempty\""
}
`)
	writeTestFile(t, dir, "a.pb.ts", `export interface V86Fs {
  name?: string
}
export const V86fs = {} as any
`)
	writeTestFile(t, dir, "b.pb.go", "package "+pkg+`

type V86FS struct {
	Name string "protobuf:\"bytes,1,opt,name=name,proto3\" json:\"name,omitempty\""
}
`)
	writeTestFile(t, dir, "b.pb.ts", `export interface V86FS {
  name?: string
}
export const V86FS = {} as any
`)
	return dir
}

const matrix7CPbTs = `export interface Local {
  name?: string
}
export const Local = {} as any
export interface Mixed {
  ok?: Local
}
export const Mixed = {} as any
export interface Holder {
  target?: unknown
}
export const Holder = {} as any
`

// TestProtobufTypeScriptBindingMatrix7SiblingCaseCollisionStaysUnbound
// verifies that a struct whose safe identifier collides case-insensitively
// with consts exported by two different sibling binding files (V86fs in one,
// V86FS in another) stays unbound, while exact cross-file references to each
// sibling's own messages still resolve and the rest of the file keeps its
// binding metadata.
func TestProtobufTypeScriptBindingMatrix7SiblingCaseCollisionStaysUnbound(t *testing.T) {
	dir := matrix7WriteModule(t, "example.test/matrix7collide")
	writeTestFile(t, dir, "c.pb.go", `package matrix7collide

type Local struct {
	Name string "protobuf:\"bytes,1,opt,name=name,proto3\" json:\"name,omitempty\""
}

// V86fS case-insensitively matches the consts published by both sibling
// binding files but matches nothing in this file's own .pb.ts, so it must
// stay unbound rather than guessing between the siblings.
type V86fS struct {
	Name string "protobuf:\"bytes,1,opt,name=name,proto3\" json:\"name,omitempty\""
}

type Mixed struct {
	Ok   *Local `+"`"+`protobuf:"bytes,1,opt,name=ok,proto3" json:"ok,omitempty"`+"`"+`
	SibA *V86Fs `+"`"+`protobuf:"bytes,2,opt,name=sib_a,json=sibA,proto3" json:"sib_a,omitempty"`+"`"+`
	SibB *V86FS `+"`"+`protobuf:"bytes,3,opt,name=sib_b,json=sibB,proto3" json:"sib_b,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "c.pb.ts", matrix7CPbTs)

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

	pkgDir := filepath.Join(out, "@goscript", "example.test", "matrix7collide")
	c := readTestFile(t, filepath.Join(pkgDir, "c.pb.ts"))
	wantFields := `(Mixed as any).__protobufTypeScriptFields = {"ok": Local, "sibA": __protobuf_ts_a_pb.V86Fs, "sibB": __protobuf_ts_b_pb.V86FS};`
	if !strings.Contains(c, wantFields) {
		t.Fatalf("resolvable local and exact cross-sibling fields should bind while the ambiguous name stays out of the field map\nwant: %s\ngot:\n%s", wantFields, c)
	}
	if strings.Contains(c, "(V86fS as any).__protobufTypeScriptMessage") ||
		strings.Contains(c, "(V86fS as any).__protobufTypeScriptFields") {
		t.Fatalf("struct colliding across sibling files must stay unbound, got:\n%s", c)
	}
	a := readTestFile(t, filepath.Join(pkgDir, "a.pb.ts"))
	if !strings.Contains(a, `__protobufTypeScriptMessage = __protobuf_ts.V86fs;`) {
		t.Fatalf("first sibling should keep its digit-camel binding to V86fs, got:\n%s", a)
	}
	b := readTestFile(t, filepath.Join(pkgDir, "b.pb.ts"))
	if !strings.Contains(b, `__protobufTypeScriptMessage = __protobuf_ts.V86FS;`) {
		t.Fatalf("second sibling should keep its exact binding to V86FS, got:\n%s", b)
	}
}

// TestProtobufTypeScriptBindingMatrix7UnresolvedFieldsStayPerField verifies
// that each unresolvable message-kind reference reports its own diagnostic
// without masking other fields or structs: an unbound field next to a
// resolvable field, and a second unbound name (the cross-sibling collision
// candidate), each surface separately.
func TestProtobufTypeScriptBindingMatrix7UnresolvedFieldsStayPerField(t *testing.T) {
	dir := matrix7WriteModule(t, "example.test/matrix7perfield")
	writeTestFile(t, dir, "c.pb.go", `package matrix7perfield

type Local struct {
	Name string "protobuf:\"bytes,1,opt,name=name,proto3\" json:\"name,omitempty\""
}

type Ghost struct {
	Name string
}

type V86fS struct {
	Name string "protobuf:\"bytes,1,opt,name=name,proto3\" json:\"name,omitempty\""
}

type Mixed struct {
	Bad *Ghost `+"`"+`protobuf:"bytes,1,opt,name=bad,proto3" json:"bad,omitempty"`+"`"+`
	Ok  *Local `+"`"+`protobuf:"bytes,2,opt,name=ok,proto3" json:"ok,omitempty"`+"`"+`
}

type Holder struct {
	Target *V86fS `+"`"+`protobuf:"bytes,1,opt,name=target,proto3" json:"target,omitempty"`+"`"+`
}
`)
	writeTestFile(t, dir, "c.pb.ts", matrix7CPbTs)

	comp, err := NewCompiler(&Config{
		Dir:                       dir,
		OutputPath:                filepath.Join(dir, "out"),
		ProtobufTypeScriptBinding: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	result, err := comp.CompilePackages(context.Background(), ".")
	if err == nil {
		t.Fatal("expected unresolved message-kind references to fail the compile")
	}
	if result == nil {
		t.Fatal("expected diagnostics result")
	}
	var details []string
	for _, diag := range result.Diagnostics {
		if diag.Code == "goscript/protobuf-ts-binding:unresolved" {
			details = append(details, diag.Detail)
		}
	}
	if len(details) != 2 {
		t.Fatalf("expected exactly one diagnostic per unresolved field, got %d: %q", len(details), details)
	}
	for _, want := range []struct{ field, ref string }{
		{"Mixed.Bad", "Ghost"},
		{"Holder.Target", "V86fS"},
	} {
		found := false
		for _, detail := range details {
			if strings.Contains(detail, want.field) && strings.Contains(detail, want.ref) {
				found = true
				break
			}
		}
		if !found {
			t.Fatalf("missing unresolved diagnostic for %s referencing %s, got %q", want.field, want.ref, details)
		}
	}
}
