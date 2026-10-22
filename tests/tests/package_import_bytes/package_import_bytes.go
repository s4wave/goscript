package main

import (
	"bytes"
	"io"
)

func main() {
	// Test basic byte slice operations
	b1 := []byte("hello")
	b2 := []byte("world")

	// Test Equal
	if bytes.Equal(b1, b1) {
		println("Equal works correctly")
	}

	// Test Compare
	result := bytes.Compare(b1, b2)
	if result < 0 {
		println("Compare works: hello < world")
	}

	// Test Contains
	if bytes.Contains(b1, []byte("ell")) {
		println("Contains works correctly")
	}

	// Test Index
	idx := bytes.Index(b1, []byte("ll"))
	if idx == 2 {
		println("Index works correctly, found at position:", idx)
	}

	// Test Join
	slices := [][]byte{b1, b2}
	joined := bytes.Join(slices, []byte(" "))
	println("Joined:", string(joined))

	// Test Split
	split := bytes.Split(joined, []byte(" "))
	println("Split result length:", len(split))
	if len(split) == 2 {
		println("Split works correctly")
	}

	// Test HasPrefix and HasSuffix
	if bytes.HasPrefix(b1, []byte("he")) {
		println("HasPrefix works correctly")
	}

	if bytes.HasSuffix(b1, []byte("lo")) {
		println("HasSuffix works correctly")
	}

	// Test Trim functions
	whitespace := []byte("  hello  ")
	trimmed := bytes.TrimSpace(whitespace)
	println("Trimmed:", string(trimmed))

	// Test ToUpper and ToLower
	upper := bytes.ToUpper(b1)
	lower := bytes.ToLower(upper)
	println("Upper:", string(upper))
	println("Lower:", string(lower))

	// Test Repeat
	repeated := bytes.Repeat([]byte("x"), 3)
	println("Repeated:", string(repeated))

	// Test Count
	count := bytes.Count([]byte("banana"), []byte("a"))
	println("Count of 'a' in 'banana':", count)

	// Test Replace
	replaced := bytes.Replace([]byte("hello hello"), []byte("hello"), []byte("hi"), 1)
	println("Replace result:", string(replaced))

	// Test ReplaceAll
	replacedAll := bytes.ReplaceAll([]byte("hello hello"), []byte("hello"), []byte("hi"))
	println("ReplaceAll result:", string(replacedAll))

	// Test Buffer
	var buf bytes.Buffer
	buf.WriteString("Hello ")
	buf.WriteString("World")
	println("Buffer content:", buf.String())
	println("Buffer length:", buf.Len())

	// Test Buffer Read
	data := make([]byte, 5)
	n, _ := buf.Read(data)
	println("Read", n, "bytes:", string(data))

	// Test Buffer Reset
	buf.Reset()
	println("Buffer after reset, length:", buf.Len())

	// Test Buffer pointer receiver calls through an address-taken pointer.
	ptr := &buf
	ptr.Write([]byte("ptr"))
	println("Pointer buffer content:", ptr.String())
	ptr.Reset()

	// Test Buffer as Reader interface through an address expression.
	buf.WriteString("abc")
	multi := io.MultiReader(&buf, bytes.NewReader([]byte("de")))
	data = make([]byte, 5)
	n, _ = multi.Read(data)
	println("MultiReader read", n, "bytes:", string(data[:n]))

	reader := bytes.NewReader([]byte("reader"))
	at := make([]byte, 3)
	var off int64 = 2
	n, err := reader.ReadAt(at, off)
	println("Reader ReadAt", n, "bytes:", string(at[:n]), "err:", err == nil)
	pos, err := reader.Seek(off, io.SeekStart)
	println("Reader Seek", pos, "err:", err == nil)
	println("Reader Size", reader.Size())
	var writeDst bytes.Buffer
	n64, err := reader.WriteTo(&writeDst)
	println("Reader WriteTo", n64, "bytes:", writeDst.String(), "err:", err == nil)

	// Test HasPrefix and HasSuffix on windows into a larger slice, which
	// compare only the prefix or suffix bytes of the window.
	doc := []byte("<p>one</p><p>two</p>")
	win := doc[3:13]
	println("HasPrefix window:", bytes.HasPrefix(win, []byte("one</p>")), bytes.HasPrefix(win, []byte("<p>")))
	println("HasSuffix window:", bytes.HasSuffix(win, []byte("<p>")), bytes.HasSuffix(win, []byte("two")))
	println("HasPrefix longer:", bytes.HasPrefix(win[:2], []byte("one")), bytes.HasSuffix(win[8:], []byte("</p><p>")))
	var nilBytes []byte
	println("HasPrefix nil:", bytes.HasPrefix(nilBytes, nil), bytes.HasPrefix(nilBytes, []byte("a")), bytes.HasPrefix(win, nil))
	println("HasSuffix nil:", bytes.HasSuffix(nilBytes, nil), bytes.HasSuffix(nilBytes, []byte("a")), bytes.HasSuffix(win, []byte{}))
	rest, ok := bytes.CutPrefix(win, []byte("one"))
	println("CutPrefix window:", string(rest), ok)
	rest, ok = bytes.CutSuffix(win, []byte("<p>"))
	println("CutSuffix window:", string(rest), ok)
	println("TrimPrefix/TrimSuffix window:", string(bytes.TrimSuffix(bytes.TrimPrefix(win, []byte("one")), []byte("<p>"))))

	println("test finished")
}
