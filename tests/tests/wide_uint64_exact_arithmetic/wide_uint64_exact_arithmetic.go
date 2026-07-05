package main

func main() {
	var acc uint64 = 1
	acc = acc*6364136223846793005 + 1442695040888963407
	acc ^= acc >> 33
	println("lcg-xor:", acc)

	var large uint64 = 9007199254740993
	println("mul-over-2^53:", large*3)

	var max = ^uint64(0)
	println("wrap-add:", max+2)

	mixed := (((uint64(1)<<63)+12345)>>4)%97
	println("mixed-add-shift-mod:", mixed)
}
