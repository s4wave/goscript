package main

type multiplyCase struct {
	x        uint32
	y        uint32
	unsigned uint32
	signed   int32
}

func main() {
	cases := []multiplyCase{
		{65535, 65535, 4294836225, -131071},
		{134217729, 134217729, 268435457, 268435457},
		{4294967295, 4294967295, 1, 1},
		{4294967295, 3221225473, 1073741823, 1073741823},
		{4294967295, 134217729, 4160749567, -134217729},
	}

	for _, tc := range cases {
		checkUint32(tc.x, tc.y, tc.unsigned)
		checkInt32(int32(tc.x), int32(tc.y), tc.signed)
	}

	checkInt32(-2147483647, -2147483647, 1)
	checkInt32(-2147483648, -1, -2147483648)

	checkPlatformIntWidths()
	println("ok")
}

func checkUint32(x, y, want uint32) {
	got := x * y
	if got != want {
		println("uint32", x, "*", y, "got", got, "want", want)
	}

	compound := x
	compound *= y
	if compound != want {
		println("uint32 *=", x, "*", y, "got", compound, "want", want)
	}
}

func checkInt32(x, y, want int32) {
	got := x * y
	if got != want {
		println("int32", x, "*", y, "got", got, "want", want)
	}

	compound := x
	compound *= y
	if compound != want {
		println("int32 *=", x, "*", y, "got", compound, "want", want)
	}
}

func checkPlatformIntWidths() {
	var neg int64 = -1
	if uint(neg) == uint(0xffffffff) {
		println("uint is 32-bit")
	}
	if int(neg) == int(0xffffffff) {
		println("int is 32-bit")
	}
	if uintptr(neg) == uintptr(0xffffffff) {
		println("uintptr is 32-bit")
	}
}
