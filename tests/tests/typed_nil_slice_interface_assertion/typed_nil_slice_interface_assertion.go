package main

type item struct {
	value string
}

func main() {
	var boxed any = []*item(nil)
	asserted := boxed.([]*item)
	println(asserted == nil)

	commaOK, ok := boxed.([]*item)
	println(ok, commaOK == nil)
}
