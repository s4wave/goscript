package main

func main() {
	myStr1 := "testing"
	println("Byte from myStr1[0]:", myStr1[0]) // Expected: t (byte value 116)
	println("Byte from myStr1[2]:", myStr1[2]) // Expected: s (byte value 115)
	println("Byte from myStr1[6]:", myStr1[6]) // Expected: g (byte value 103)

	myStr2 := "你好世界" // "Hello World" in Chinese
	// String indexing returns UTF-8 bytes, not Unicode code points.
	println("Byte from myStr2[0]:", myStr2[0]) // Expected: E4 (byte value 228) - First byte of '你'
	println("Byte from myStr2[1]:", myStr2[1]) // Expected: BD (byte value 189) - Second byte of '你'
	println("Byte from myStr2[2]:", myStr2[2]) // Expected: A0 (byte value 160) - Third byte of '你'
	println("Byte from myStr2[3]:", myStr2[3]) // Expected: E5 (byte value 229) - First byte of '好'

	// Constant lookup tables preserve invalid UTF-8 and control bytes.
	for i := 0; i < len(lookup); i++ {
		println("constant byte", lookup[i])
	}
	checkBounds(-1)
	checkBounds(len(lookup))
}

const lookup = "\x00\xff\a你"

func checkBounds(index int) {
	defer func() { println("out of bounds", recover() != nil) }()
	println(lookup[index])
}
