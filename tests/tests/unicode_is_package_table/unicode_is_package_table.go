package main

import "unicode"

var vowels = &unicode.RangeTable{
	R16: []unicode.Range16{
		{Lo: 'a', Hi: 'a', Stride: 1},
		{Lo: 'e', Hi: 'e', Stride: 1},
		{Lo: 'i', Hi: 'i', Stride: 1},
	},
}

var digits = &unicode.RangeTable{
	R16: []unicode.Range16{{Lo: '0', Hi: '9', Stride: 1}},
}

func main() {
	local := &unicode.RangeTable{R16: []unicode.Range16{{Lo: 'x', Hi: 'z', Stride: 1}}}
	println(unicode.Is(vowels, 'e'), unicode.Is(vowels, 'z'), unicode.Is(local, 'y'))
	println(unicode.In('7', vowels, digits), unicode.In('q', vowels, digits))
	println(unicode.IsOneOf([]*unicode.RangeTable{vowels, local}, 'z'))
}
