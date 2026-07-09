package asyncmetric

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/pkg/errors"
)

type runtimeCase struct {
	Name     string
	TestName string
}

var runtimeCases = []runtimeCase{
	{Name: "wrapper_chain", TestName: "TestRuntimeWrapperChain"},
	{Name: "interface_function_value", TestName: "TestRuntimeInterfaceFunctionValue"},
	{Name: "channel_select", TestName: "TestRuntimeChannelSelect"},
	{Name: "async_defer_cleanup", TestName: "TestRuntimeAsyncDeferCleanup"},
	{Name: "resource_srpc", TestName: "TestRuntimeResourceSRPC"},
}

func materializeRuntimeCases(moduleDir string) (string, error) {
	if strings.TrimSpace(moduleDir) == "" {
		return "", errors.New("module dir is required")
	}
	caseDir := filepath.Join(moduleDir, ".tmp", "spacewave-async-metric", "runtime-cases")
	if err := os.RemoveAll(caseDir); err != nil {
		return "", errors.Wrap(err, "clear runtime cases")
	}
	if err := os.MkdirAll(caseDir, 0o755); err != nil {
		return "", errors.Wrap(err, "create runtime cases")
	}
	if err := os.WriteFile(filepath.Join(caseDir, "runtime_cases_test.go"), []byte(runtimeCasesSource), 0o644); err != nil {
		return "", errors.Wrap(err, "write runtime cases")
	}
	return caseDir, nil
}

const runtimeCasesSource = `package runtimecases

import (
	"context"
	"testing"
	"time"

	"github.com/aperturerobotics/starpc/srpc"
	s4wave_world "github.com/s4wave/spacewave/sdk/world"
)

const runtimeCaseIterations = 1000

func reportRuntimeMetric(name string, start time.Time) {
	println("goscript_metric_ns", name, time.Since(start).Nanoseconds())
}

type box[T any] struct {
	ch chan T
}

func (b *box[T]) next() T {
	return <-b.ch
}

func wrapperA[T any](b *box[T]) T { return wrapperB[T](b) }
func wrapperB[T any](b *box[T]) T { return wrapperC[T](b) }
func wrapperC[T any](b *box[T]) T { return b.next() }

func TestRuntimeWrapperChain(t *testing.T) {
	b := &box[int]{ch: make(chan int, 1)}
	sum := 0
	start := time.Now()
	for i := 0; i < runtimeCaseIterations; i++ {
		b.ch <- i
		sum += wrapperA[int](b)
	}
	reportRuntimeMetric("wrapper_chain", start)
	if sum != runtimeCaseIterations*(runtimeCaseIterations-1)/2 {
		t.Fatalf("wrapper chain = %d", sum)
	}
}

type asyncReader interface {
	Read() int
}

type channelReader struct {
	ch chan int
}

func (r channelReader) Read() int {
	return <-r.ch
}

func callReader(r asyncReader) int { return r.Read() }
func callFunc(fn func() int) int   { return fn() }

func TestRuntimeInterfaceFunctionValue(t *testing.T) {
	ch := make(chan int, 2)
	r := channelReader{ch: ch}
	fn := r.Read
	sum := 0
	start := time.Now()
	for i := 0; i < runtimeCaseIterations; i++ {
		ch <- 13
		ch <- 29
		sum += callReader(r) + callFunc(fn)
	}
	reportRuntimeMetric("interface_function_value", start)
	if sum != runtimeCaseIterations*42 {
		t.Fatalf("interface/function value = %d", sum)
	}
}

func TestRuntimeChannelSelect(t *testing.T) {
	sum := 0
	start := time.Now()
	for i := 0; i < runtimeCaseIterations; i++ {
		left := make(chan int, 1)
		right := make(chan int, 1)
		left <- 20
		selected := 0
		select {
		case selected = <-left:
		case selected = <-right:
			selected = -1
		}
		select {
		case right <- 22:
		default:
			t.Fatal("send default selected unexpectedly")
		}
		select {
		case value := <-right:
			selected += value
		default:
			t.Fatal("receive default selected unexpectedly")
		}
		sum += selected
	}
	reportRuntimeMetric("channel_select", start)
	if sum != runtimeCaseIterations*42 {
		t.Fatalf("channel/select = %d", sum)
	}
}

func TestRuntimeAsyncDeferCleanup(t *testing.T) {
	done := make(chan int, 1)
	start := time.Now()
	func() {
		ch := make(chan int, 1)
		defer func() {
			done <- <-ch
		}()
		ch <- 42
	}()
	got := <-done
	reportRuntimeMetric("async_defer_cleanup", start)
	if got != 42 {
		t.Fatalf("async defer cleanup = %d", got)
	}
}

type fakeClient struct {
	calls       int
	lastService string
	lastMethod  string
	stream      *fakeStream
}

func (c *fakeClient) ExecCall(_ context.Context, service, method string, _, _ srpc.Message) error {
	c.calls++
	c.lastService = service
	c.lastMethod = method
	return nil
}

func (c *fakeClient) NewStream(ctx context.Context, service, method string, _ srpc.Message) (srpc.Stream, error) {
	c.calls++
	c.lastService = service
	c.lastMethod = method
	c.stream = &fakeStream{ctx: ctx}
	return c.stream, nil
}

type fakeStream struct {
	ctx      context.Context
	receives int
	closes   int
}

func (s *fakeStream) Context() context.Context { return s.ctx }
func (s *fakeStream) MsgSend(_ srpc.Message) error { return nil }
func (s *fakeStream) MsgRecv(_ srpc.Message) error {
	s.receives++
	return nil
}
func (s *fakeStream) CloseSend() error {
	s.closes++
	return nil
}
func (s *fakeStream) Close() error { return nil }

func TestRuntimeResourceSRPC(t *testing.T) {
	fc := &fakeClient{}
	client := s4wave_world.NewSRPCEngineResourceServiceClientWithServiceID(fc, "resource/test")
	start := time.Now()
	for i := 0; i < runtimeCaseIterations; i++ {
		if _, err := client.GetSeqno(context.Background(), &s4wave_world.GetSeqnoRequest{}); err != nil {
			t.Fatal(err)
		}
		stream, err := client.WatchWorldRootSnapshots(context.Background(), &s4wave_world.WatchWorldRootSnapshotsRequest{})
		if err != nil {
			t.Fatal(err)
		}
		if _, err := stream.Recv(); err != nil {
			t.Fatal(err)
		}
	}
	reportRuntimeMetric("resource_srpc", start)
	if fc.lastService != "resource/test" || fc.lastMethod != "WatchWorldRootSnapshots" || fc.calls != runtimeCaseIterations*2 {
		t.Fatalf("generated SRPC client routing failed: service=%s method=%s calls=%d", fc.lastService, fc.lastMethod, fc.calls)
	}
	if fc.stream == nil || fc.stream.closes != 1 || fc.stream.receives != 1 {
		t.Fatalf("stream did not route through generated SRPC methods")
	}
}
`
