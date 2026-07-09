package main

import (
	"context"
	"flag"
	"os"
	"strconv"
	"strings"

	"github.com/pkg/errors"
	asyncmetric "github.com/s4wave/goscript/prototypes/spacewave-async-metric"
)

func main() {
	if err := run(); err != nil {
		_, _ = os.Stderr.WriteString(err.Error() + "\n")
		os.Exit(1)
	}
}

func run() error {
	var opts asyncmetric.WorkloadOptions
	flag.StringVar(&opts.ModuleDir, "module", "", "prototype module root")
	flag.StringVar(&opts.SpacewaveDir, "spacewave", os.Getenv("SPACEWAVE_REPO"), "Spacewave repository root")
	flag.StringVar(&opts.OutputRoot, "output", os.Getenv("GOSCRIPT_OUTPUT"), "generated Spacewave TypeScript output root")
	flag.StringVar(&opts.WorkDir, "workdir", os.Getenv("GOSCRIPT_WORKDIR"), "generated runtime test workspace root")
	flag.IntVar(&opts.Samples, "samples", envInt("GOSCRIPT_SAMPLES", 5), "runtime samples per case")
	flag.Parse()

	result, err := asyncmetric.RunWorkload(context.Background(), opts)
	if err != nil {
		return err
	}
	if len(result.Failures) != 0 {
		_, _ = os.Stdout.WriteString(asyncmetric.WorkloadResultJSON(result) + "\n")
		return errors.New("runtime async workload failed")
	}
	_, _ = os.Stdout.WriteString(asyncmetric.WorkloadResultJSON(result) + "\n")
	return nil
}

func envInt(name string, fallback int) int {
	value := strings.TrimSpace(os.Getenv(name))
	if value == "" {
		return fallback
	}
	parsed, err := strconv.Atoi(value)
	if err != nil || parsed <= 0 {
		return fallback
	}
	return parsed
}
