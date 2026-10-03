//go:build unix

package tsworkspace

import (
	"context"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"testing"
	"time"
)

// TestOwnerRunToolRunsNodeScriptsWithBun runs a node-shebang tool on a PATH
// that holds Bun but no node, as on hosts without Node installed.
func TestOwnerRunToolRunsNodeScriptsWithBun(t *testing.T) {
	bun, err := exec.LookPath("bun")
	if err != nil {
		t.Skip("bun not installed")
	}
	dir := t.TempDir()
	bin := filepath.Join(dir, "bin")
	if err := os.Mkdir(bin, 0o755); err != nil {
		t.Fatal(err.Error())
	}
	if err := os.Symlink(bun, filepath.Join(bin, "bun")); err != nil {
		t.Fatal(err.Error())
	}
	t.Setenv("PATH", bin)
	tool := filepath.Join(dir, "tool.js")
	script := "#!/usr/bin/env node\nconsole.log(process.argv.slice(2).join(' '))\n"
	if err := os.WriteFile(tool, []byte(script), 0o755); err != nil {
		t.Fatal(err.Error())
	}

	result := NewOwner(dir, dir).RunTool(t.Context(), PhaseTypeCheck, dir, tool, "a", "b")
	if result.Failed() || strings.TrimSpace(result.Output) != "a b" {
		t.Fatalf("node script result = %+v", result)
	}
}

func TestOwnerRunToolCancelsProcessGroup(t *testing.T) {
	dir := t.TempDir()
	pidFile := filepath.Join(dir, "child.pid")
	tool := filepath.Join(dir, "spawn-child.sh")
	script := "#!/bin/sh\n" +
		"sleep 30 &\n" +
		"echo $! > " + strconv.Quote(pidFile) + "\n" +
		"wait\n"
	if err := os.WriteFile(tool, []byte(script), 0o755); err != nil {
		t.Fatal(err.Error())
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	result := NewOwner(dir, dir).RunTool(ctx, PhaseRuntime, dir, tool)
	if !result.Failed() {
		t.Fatalf("expected canceled tool to fail")
	}

	pid := readChildPID(t, pidFile)
	deadline := time.Now().Add(2 * time.Second)
	for processExists(pid) && time.Now().Before(deadline) {
		time.Sleep(25 * time.Millisecond)
	}
	if processExists(pid) {
		_ = syscall.Kill(pid, syscall.SIGKILL)
		t.Fatalf("child process %d survived canceled tool", pid)
	}
}

func readChildPID(t *testing.T, path string) int {
	t.Helper()
	deadline := time.Now().Add(2 * time.Second)
	var data []byte
	var err error
	for time.Now().Before(deadline) {
		data, err = os.ReadFile(path)
		if err == nil {
			break
		}
		time.Sleep(25 * time.Millisecond)
	}
	if err != nil {
		t.Fatalf("read child pid: %v", err)
	}
	pid, err := strconv.Atoi(strings.TrimSpace(string(data)))
	if err != nil {
		t.Fatalf("parse child pid %q: %v", data, err)
	}
	return pid
}

func processExists(pid int) bool {
	err := syscall.Kill(pid, 0)
	return err == nil || errors.Is(err, syscall.EPERM)
}
