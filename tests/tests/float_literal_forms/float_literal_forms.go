package main

func main() {
	eps := 0x1p-52
	println(eps == 2.220446049250313e-16)
	println(0x1.8p1 == 3.0)
	println(0X_1FFFP-16 == 0.1249847412109375)
	println(01.5 == 1.5)
	println(00.25e1 == 2.5)
	x := 2.0 * 0x1p-2
	println(x == 0.5)
}
