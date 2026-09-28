//go:build !linux && !darwin

package compiler

import (
	"os"
	"time"
)

// sourceStamp reports that this platform has no change time to stamp with.
func sourceStamp(os.FileInfo) (string, time.Time, bool) {
	return "", time.Time{}, false
}
