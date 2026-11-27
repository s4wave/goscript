package compiler_test

import (
	"go/build"
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"testing"

	"github.com/pkg/errors"
	"github.com/s4wave/goscript/tests"
)

// TestCompliance runs the inherited GoScript compliance fixtures through the
// v2 compiler pipeline.
func TestCompliance(t *testing.T) {
	// Locate the workspace root, which is the compiler package's parent.
	workspaceDir, err := os.Getwd()
	if err != nil {
		t.Fatalf("failed to get working directory: %v", err)
	}
	workspaceDir = filepath.Clean(filepath.Join(workspaceDir, ".."))

	// List the fixture directories.
	testsDir := filepath.Join(workspaceDir, "tests", "tests")
	entries, err := os.ReadDir(testsDir)
	if err != nil {
		t.Fatalf("failed to read tests dir: %v", err)
	}

	// target is the build context the compiler loads packages with, so a
	// fixture's file constraints select the same files the compiler sees.
	target := build.Default
	target.GOOS, target.GOARCH = "js", "wasm"

	// Keep each fixture that has a Go file the target build context selects.
	fixtures := make([]complianceFixture, 0, len(entries))
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		testPath := filepath.Join(testsDir, entry.Name())
		goFiles, err := filepath.Glob(filepath.Join(testPath, "*.go"))
		if err != nil || len(goFiles) == 0 {
			continue
		}
		matchesBuild := false
		for _, goFile := range goFiles {
			matches, err := target.MatchFile(testPath, filepath.Base(goFile))
			if err != nil {
				t.Fatal(err)
			}
			matchesBuild = matchesBuild || matches
		}
		if !matchesBuild {
			continue
		}
		name := entry.Name()
		fixtures = append(fixtures, complianceFixture{
			name:     name,
			category: complianceCategory(name),
			path:     testPath,
		})
	}

	// Load the failures remembered from the previous run.
	failures, err := loadComplianceFailureState(workspaceDir)
	if err != nil {
		t.Fatalf("failed to load compliance failure state: %v", err)
	}

	// Fixtures run in parallel, each in its own directory, bounded by go test's
	// -parallel. The failure state is shared, so it is guarded by mu, and a
	// fixture that fails again after failing in the previous run stops the
	// fixtures that have not started.
	var (
		mu       sync.Mutex
		ranTests atomic.Int64
		stopped  atomic.Bool
	)

	// The suite outlives its subtests, so it reports through t, which the
	// subtests' own t shadows.
	suite := t
	t.Cleanup(func() {
		if ranTests.Load() == 0 {
			suite.Error("compliance harness did not run any fixture directories")
		}
	})
	for _, fixture := range failures.order(fixtures) {
		name := fixture.name
		wasFailing := failures.wasFailing(name)
		t.Run(fixture.category+"/"+name, func(t *testing.T) {
			t.Parallel()

			// Skip a fixture that starts after another failed again.
			if stopped.Load() {
				t.Skip("an earlier fixture failed again")
			}

			// Record the outcome once the fixture ends, including a skip.
			defer func() {
				// The failure state and the stop flag are shared by all fixtures.
				mu.Lock()
				defer mu.Unlock()

				// Update and save the failure state.
				if t.Failed() {
					failures.recordFailure(name)
				} else {
					failures.recordPass(name)
				}
				if err := failures.save(); err != nil {
					t.Errorf("failed to save compliance failure state: %v", err)
				}

				// Stop the remaining fixtures when a fixture failed again.
				if t.Failed() && wasFailing {
					stopped.Store(true)
					suite.Errorf("compliance fixture %s failed again; cached failure state saved to %s", name, failures.path)
				}
			}()

			// Skip fixtures that another test or a known gap covers.
			if hasComplianceMarker(t, fixture.path, "expect-fail") {
				t.Skip("expected compliance failure marker")
			}
			if expectedV2ComplianceGaps[name] {
				t.Skip("expected v2 compliance gap")
			}
			if complianceHarnessExcluded[name] {
				t.Skip("validated by a dedicated oracle test, not stdout comparison")
			}

			// Compile and run the fixture, and clear its output when it passes.
			ranTests.Add(1)
			tests.RunGoScriptTestDir(t, workspaceDir, fixture.path)
			if !t.Failed() {
				if err := os.RemoveAll(filepath.Join(fixture.path, "run")); err != nil {
					t.Logf("failed to remove run directory for %s: %v", name, err)
				}
			}
		})
	}
}

type complianceFixture struct {
	name     string
	category string
	path     string
}

// complianceFailureState remembers active fixture failures between local runs.
// A passing run removes the fixture so the next full run only fail-fasts on
// failures that are still reproducing.
type complianceFailureState struct {
	path     string
	failures map[string]int
}

func loadComplianceFailureState(workspaceDir string) (*complianceFailureState, error) {
	// A missing state file means no fixture has failed yet.
	state := &complianceFailureState{
		path:     filepath.Join(workspaceDir, ".tmp", "compliance-failures.tsv"),
		failures: make(map[string]int),
	}
	data, err := os.ReadFile(state.path)
	if os.IsNotExist(err) {
		return state, nil
	}
	if err != nil {
		return nil, errors.Wrapf(err, "read %s", state.path)
	}

	// Parse one fixture and failure count per line.
	for lineNum, line := range strings.Split(strings.TrimSpace(string(data)), "\n") {
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		name, countText, ok := strings.Cut(line, "\t")
		if !ok {
			return nil, errors.Errorf("parse %s line %d: expected fixture and count", state.path, lineNum+1)
		}
		count, err := strconv.Atoi(countText)
		if err != nil || count < 0 {
			return nil, errors.Errorf("parse %s line %d: invalid count %q", state.path, lineNum+1, countText)
		}
		if count > 0 {
			state.failures[name] = count
		}
	}
	return state, nil
}

func (s *complianceFailureState) order(fixtures []complianceFixture) []complianceFixture {
	// Run recent failures first, the most frequent failures before the rest.
	ordered := slices.Clone(fixtures)
	slices.SortFunc(ordered, func(a, b complianceFixture) int {
		// Failing fixtures come first, the most frequent failure leading.
		aFailures, bFailures := s.failures[a.name], s.failures[b.name]
		if aFailures > 0 && bFailures == 0 {
			return -1
		}
		if aFailures == 0 && bFailures > 0 {
			return 1
		}
		if aFailures != bFailures {
			return bFailures - aFailures
		}

		// Ties keep the category order and then the name order.
		if a.category != b.category {
			return strings.Compare(a.category, b.category)
		}
		return strings.Compare(a.name, b.name)
	})
	return ordered
}

func (s *complianceFailureState) wasFailing(name string) bool {
	return s.failures[name] > 0
}

func (s *complianceFailureState) recordFailure(name string) {
	s.failures[name]++
}

func (s *complianceFailureState) recordPass(name string) {
	delete(s.failures, name)
}

func (s *complianceFailureState) save() error {
	// Create the state directory.
	if err := os.MkdirAll(filepath.Dir(s.path), 0o755); err != nil {
		return errors.Wrapf(err, "create %s", filepath.Dir(s.path))
	}

	// Sort the failing fixtures by count, then by name, so the file is stable.
	names := make([]string, 0, len(s.failures))
	for name := range s.failures {
		names = append(names, name)
	}
	slices.SortFunc(names, func(a, b string) int {
		aFailures, bFailures := s.failures[a], s.failures[b]
		if aFailures != bFailures {
			return bFailures - aFailures
		}
		return strings.Compare(a, b)
	})

	// Write one fixture and failure count per line.
	var out strings.Builder
	out.WriteString("# fixture\tconsecutive_failures\n")
	for _, name := range names {
		out.WriteString(name)
		out.WriteByte('\t')
		out.WriteString(strconv.Itoa(s.failures[name]))
		out.WriteByte('\n')
	}
	if err := os.WriteFile(s.path, []byte(out.String()), 0o644); err != nil {
		return errors.Wrapf(err, "write %s", s.path)
	}
	return nil
}

func TestComplianceFailureState(t *testing.T) {
	// Start from one recent and one stale failure.
	state := &complianceFailureState{
		path: filepath.Join(t.TempDir(), ".tmp", "compliance-failures.tsv"),
		failures: map[string]int{
			"recent": 1,
			"stale":  3,
		},
	}

	// Order the fixtures with the most failures first.
	ordered := state.order([]complianceFixture{
		{name: "clean-b", category: "core"},
		{name: "recent", category: "core"},
		{name: "stale", category: "core"},
		{name: "clean-a", category: "core"},
	})
	got := []string{ordered[0].name, ordered[1].name, ordered[2].name, ordered[3].name}
	want := []string{"stale", "recent", "clean-a", "clean-b"}
	if !slices.Equal(got, want) {
		t.Fatalf("ordered fixtures = %v, want %v", got, want)
	}

	// Record a pass and two failures, and save the state.
	state.recordPass("stale")
	state.recordFailure("recent")
	state.recordFailure("new")
	if err := state.save(); err != nil {
		t.Fatalf("failed to save state: %v", err)
	}

	// Load the saved state and check each count.
	loaded, err := loadComplianceFailureState(filepath.Dir(filepath.Dir(state.path)))
	if err != nil {
		t.Fatalf("failed to load state: %v", err)
	}
	if loaded.wasFailing("stale") {
		t.Fatal("passing fixture stayed in fail set")
	}
	if got := loaded.failures["recent"]; got != 2 {
		t.Fatalf("recent failure count = %d, want 2", got)
	}
	if got := loaded.failures["new"]; got != 1 {
		t.Fatalf("new failure count = %d, want 1", got)
	}
}

func hasComplianceMarker(t *testing.T, testPath, marker string) bool {
	t.Helper()

	// A marker is a file in the fixture directory.
	_, err := os.Stat(filepath.Join(testPath, marker))
	if err == nil {
		return true
	}
	if !os.IsNotExist(err) {
		t.Fatalf("failed to check marker %s for %s: %v", marker, testPath, err)
	}
	return false
}

func complianceCategory(name string) string {
	switch {
	case strings.HasPrefix(name, "package_import"):
		return "package-import"
	case strings.Contains(name, "async") ||
		strings.Contains(name, "channel") ||
		strings.Contains(name, "goroutine") ||
		strings.Contains(name, "select") ||
		strings.Contains(name, "defer"):
		return "async"
	case strings.Contains(name, "generic"):
		return "generics"
	case strings.Contains(name, "interface") ||
		strings.Contains(name, "method") ||
		strings.Contains(name, "type_assert") ||
		strings.Contains(name, "type_switch"):
		return "interfaces"
	case strings.Contains(name, "array") ||
		strings.Contains(name, "map") ||
		strings.Contains(name, "slice") ||
		strings.Contains(name, "string"):
		return "collections"
	case strings.Contains(name, "pointer") ||
		strings.Contains(name, "struct") ||
		strings.Contains(name, "varref"):
		return "values"
	default:
		return "core"
	}
}

// complianceHarnessExcluded lists fixture directories that the shared stdout
// comparison harness must skip because a dedicated test validates them another
// way. runtime_trace_proof, runtime_trace_empty, and runtime_trace_multibatch
// emit Go execution-trace bytes whose GoScript subset is intentionally not
// byte-identical to the native runtime trace, so TestRuntimeTraceProof,
// TestRuntimeTraceEmptyCapture, and TestRuntimeTraceMultiBatch validate them
// through the upstream Go trace reader.
var complianceHarnessExcluded = map[string]bool{
	"runtime_trace_proof":      true,
	"runtime_trace_empty":      true,
	"runtime_trace_multibatch": true,
}

var expectedV2ComplianceGaps = map[string]bool{
	"bitwise_and_not_assignment":        true,
	"buffer_value_field_error":          true,
	"bytes":                             true,
	"chan_type_assertion":               true,
	"debug_marshal":                     true,
	"debug_simple":                      true,
	"filepath_walkfunc_call":            true,
	"flag_bitwise_op":                   true,
	"for_init_multi_assign":             true,
	"for_range":                         true,
	"function_call_variable_shadowing":  true,
	"function_signature_type":           true,
	"generics":                          true,
	"generics_interface":                true,
	"generics_leading_int":              true,
	"if_type_assert":                    true,
	"import_interface":                  true,
	"index_expr_type_assertion":         true,
	"interface_embedding":               true,
	"interface_type_reference":          true,
	"json_debug":                        true,
	"json_encoder_debug":                true,
	"json_numfield":                     true,
	"json_typefields":                   true,
	"json_typefields_flow":              true,
	"linkname_alias":                    true,
	"map_const_key":                     true,
	"method_async_dependency":           true,
	"method_binding":                    true,
	"method_receiver_async_paren":       true,
	"method_receiver_await_paren":       true,
	"method_receiver_call_return":       true,
	"method_receiver_paren_line":        true,
	"method_receiver_shadowing":         true,
	"missing_valueof_error":             true,
	"multi_return_same_type":            true,
	"named_slice_wrapper":               true,
	"named_struct_async_method":         true,
	"named_types_valueof":               true,
	"nil_pkg_pointer_dereference":       true,
	"os_filemode_struct":                true,
	"path_error_constructor":            true,
	"pointer_circular_ref":              true,
	"pointer_range_loop":                true,
	"promise_return_type":               true,
	"receiver_variable":                 true,
	"reflect_numfield":                  true,
	"reserved_words":                    true,
	"star_expr_destructuring":           true,
	"struct_embedding":                  true,
	"struct_embedding_bytes_buffer":     true,
	"type_conversion_interface_ptr_nil": true,
	"type_declaration_receiver":         true,
	"util_promise":                      true,
	"varref_deref_struct":               true,
	"wrapper_type_args":                 true,
}
