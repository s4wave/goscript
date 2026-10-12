package main

import "reflect"

type Inner struct{ B int }

type Outer struct {
	*Inner
	C int
}

func main() {
	s := reflect.ValueOf([]string{"a", "b"})
	for i := range s.Seq() {
		println("slice index", i.Int())
	}
	for i, e := range s.Seq2() {
		println("slice", i.Int(), e.String())
	}
	for i := range reflect.ValueOf(3).Seq() {
		println("int", i.Int())
	}
	for i, r := range reflect.ValueOf("hé!").Seq2() {
		println("string", i.Int(), r.Int())
	}
	for k, e := range reflect.ValueOf(map[string]int{"x": 1}).Seq2() {
		println("map", k.String(), e.Int())
	}

	ch := make(chan int, 2)
	ch <- 5
	ch <- 6
	close(ch)
	for e := range reflect.ValueOf(ch).Seq() {
		println("chan", e.Int())
	}
	rc := make(chan int, 1)
	rc <- 8
	v, ok := reflect.ValueOf(rc).Recv()
	println("recv", v.Int(), ok)
	close(rc)
	v, ok = reflect.ValueOf(rc).Recv()
	println("recv closed", v.Int(), ok)

	println(reflect.TypeOf(ch).ChanDir() == reflect.BothDir, reflect.TypeOf((<-chan int)(nil)).ChanDir().String())
	println(reflect.TypeOf(1).CanSeq(), reflect.TypeOf(1).CanSeq2(), reflect.TypeOf("").CanSeq2(), reflect.TypeOf(1.5).CanSeq())

	seq := func(yield func(int) bool) {
		_ = yield(7) && yield(9)
	}
	println(reflect.TypeOf(seq).CanSeq(), reflect.TypeOf(seq).CanSeq2())
	for x := range reflect.ValueOf(seq).Seq() {
		println("func", x.Int())
	}

	s3 := reflect.ValueOf([]int{1, 2, 3, 4}).Slice3(1, 2, 3)
	println("slice3", s3.Len(), s3.Cap(), s3.Index(0).Int())

	var o Outer
	_, err := reflect.ValueOf(o).FieldByIndexErr([]int{0, 0})
	println("nil embedded", err != nil)
	o.Inner = &Inner{B: 9}
	f, err := reflect.ValueOf(o).FieldByIndexErr([]int{0, 0})
	println("embedded", f.Int(), err == nil)
}
