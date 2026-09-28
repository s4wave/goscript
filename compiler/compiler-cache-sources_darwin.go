package compiler

import (
	"os"
	"syscall"
	"time"
)

// sourceStamp returns the stat stamp of a file and when it last changed.
func sourceStamp(info os.FileInfo) (string, time.Time, bool) {
	st, ok := info.Sys().(*syscall.Stat_t)
	if !ok {
		return "", time.Time{}, false
	}
	return formatSourceStamp(info, time.Unix(st.Ctimespec.Unix()), st.Ino)
}
