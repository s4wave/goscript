package main

import (
	"strings"
	"text/tabwriter"
)

// main checks a flushed table preserves the buffered cell contents.
func main() {
	// Buffer multiple rows through the standard table formatter.
	var output strings.Builder
	writer := tabwriter.NewWriter(&output, 0, 0, 2, ' ', 0)
	if _, err := writer.Write([]byte("ID\tNAME\n1\tCanvas\n22\tStore\n")); err != nil {
		println(err.Error())
		return
	}
	if err := writer.Flush(); err != nil {
		println(err.Error())
		return
	}

	// Print through the fixture's ordinary output boundary.
	print(output.String())
}
