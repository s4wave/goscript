package main

import protobuf_go_lite "github.com/aperturerobotics/protobuf-go-lite"

type state int32

func (s state) String() string {
	switch s {
	case 1:
		return "running"
	default:
		return "idle"
	}
}

type msg struct {
	v int
}

func (m *msg) SizeVT() int {
	return 0
}

func (m *msg) MarshalToSizedBufferVT([]byte) (int, error) {
	return 0, nil
}

func (m *msg) MarshalVT() ([]byte, error) {
	return nil, nil
}

func (m *msg) UnmarshalVT([]byte) error {
	return nil
}

func (m *msg) Reset() {}

func (m *msg) CloneMessageVT() protobuf_go_lite.CloneMessage {
	return m.CloneVT()
}

func (m *msg) CloneVT() *msg {
	if m == nil {
		return nil
	}
	return &msg{v: m.v}
}

func (m *msg) EqualVT(other *msg) bool {
	return other != nil && m.v == other.v
}

func main() {
	original := &msg{v: 7}
	cloned := protobuf_go_lite.CloneVTValue[*msg](original)
	println("clone:", cloned != original, cloned.EqualVT(original))
	println("clone-slice:", protobuf_go_lite.CloneVTSlice([]*msg{original})[0] != original)
	println("equal:", protobuf_go_lite.IsEqualVT[*msg](original, &msg{v: 7}))
	println("equal-slice-implicit:", protobuf_go_lite.EqualVTSliceImplicit([]*msg{nil, original}, []*msg{{}, {v: 7}}, func() *msg { return &msg{} }))
	var sb protobuf_go_lite.TextBuilder
	protobuf_go_lite.TextWriteStringer(&sb, state(1))
	println("stringer:", sb.String())
}
