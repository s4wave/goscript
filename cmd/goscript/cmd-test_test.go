package main

import (
	"bytes"
	"path/filepath"
	"strings"
	"testing"
)

func TestTestCommandHelp(t *testing.T) {
	var out bytes.Buffer
	app := newApp()
	app.Writer = &out

	err := app.Run([]string{"goscript", "test", "--help"})
	if err != nil {
		t.Fatalf("test help failed: %v", err)
	}
	help := out.String()
	for _, expected := range []string{"compile and run Go package tests through GoScript", "--tags", "--run", "--count", "--short", "--timeout", "-p", "--runtime-groups", "--browser", "--protobuf-ts-binding", "--cpuprofile", "--memprofile"} {
		if !strings.Contains(help, expected) {
			t.Fatalf("help output missing %q:\n%s", expected, help)
		}
	}
}

func TestTestCommandBrowserSelector(t *testing.T) {
	for _, browser := range []string{"chromium", "webkit"} {
		t.Run(browser, func(t *testing.T) {
			app := newApp()
			if err := app.Run([]string{"goscript", "test", "--browser", browser, "--help"}); err != nil {
				t.Fatalf("browser value %q rejected: %v", browser, err)
			}
		})
	}

	t.Run("bare", func(t *testing.T) {
		app := newApp()
		err := app.Run([]string{"goscript", "test", "--browser"})
		if err == nil || !strings.Contains(err.Error(), "flag needs an argument") {
			t.Fatalf("bare browser error = %v, want missing value", err)
		}
	})

	t.Run("empty", func(t *testing.T) {
		app := newApp()
		err := app.Run([]string{"goscript", "test", "--browser=", "--dir", t.TempDir(), "."})
		if err == nil || !strings.Contains(err.Error(), "browser name is required") {
			t.Fatalf("empty browser error = %v, want missing value", err)
		}
	})

	t.Run("unknown", func(t *testing.T) {
		app := newApp()
		err := app.Run([]string{"goscript", "test", "--browser", "firefox", "--dir", t.TempDir(), "."})
		if err == nil || !strings.Contains(err.Error(), "unsupported browser name") {
			t.Fatalf("unknown browser error = %v, want unsupported browser name", err)
		}
	})
}

func TestTestCommandRunsPackageTest(t *testing.T) {
	dir := t.TempDir()
	writeFile(t, filepath.Join(dir, "go.mod"), "module example.test/cmdtest\n\ngo 1.25.3\n")
	writeFile(t, filepath.Join(dir, "value.go"), strings.Join([]string{
		"package cmdtest",
		"func Value() int { return 7 }",
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "value_test.go"), strings.Join([]string{
		"package cmdtest",
		"import \"testing\"",
		"func TestValue(t *testing.T) {",
		"\tif Value() != 7 {",
		"\t\tt.Fatal(\"bad value\")",
		"\t}",
		"}",
		"",
	}, "\n"))

	var out bytes.Buffer
	app := newApp()
	app.Writer = &out
	err := app.Run([]string{
		"goscript",
		"test",
		"--dir",
		dir,
		"--workdir",
		filepath.Join(dir, ".tmp", "cmd-test"),
		"-v",
		".",
	})
	if err != nil {
		t.Fatalf("test command failed: %v\n%s", err, out.String())
	}
	if !strings.Contains(out.String(), "ok  \texample.test/cmdtest") {
		t.Fatalf("expected ok package output, got:\n%s", out.String())
	}
}

func TestTestCommandRejectsUnsupportedFlags(t *testing.T) {
	app := newApp()
	err := app.Run([]string{"goscript", "test", "--cover", "."})
	if err == nil {
		t.Fatalf("expected unsupported flag to fail")
	}
	if !strings.Contains(err.Error(), "flag provided but not defined") {
		t.Fatalf("unexpected unsupported flag error: %v", err)
	}
}
