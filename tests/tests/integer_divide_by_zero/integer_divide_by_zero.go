package main

// Integer division and remainder by zero panic with a runtime error, for
// every integer width and for the assignment forms.

func catch(fn func()) string {
	msg := "none"
	func() {
		defer func() {
			if r := recover(); r != nil {
				if err, ok := r.(error); ok {
					msg = err.Error()
				} else {
					msg = "non-error panic"
				}
			}
		}()
		fn()
	}()
	return msg
}

func main() {
	z := 0
	var z8 uint8
	var z32 int32
	var z64 int64
	var zu uint
	println("int /:", catch(func() { println(1 / z) }))
	println("int %:", catch(func() { println(1 % z) }))
	println("uint8 /:", catch(func() { var o uint8 = 1; println(o / z8) }))
	println("int32 %:", catch(func() { var o int32 = 1; println(o % z32) }))
	println("int64 /:", catch(func() { var o int64 = 1; println(o / z64) }))
	println("uint /:", catch(func() { println(uint(1) / zu) }))
	println("int /=:", catch(func() { q := 5; q /= z; println(q) }))
	println("int %=:", catch(func() { q := 5; q %= z; println(q) }))

	// Nonzero divisors truncate toward zero, and constant ones stay inline.
	q, r := 17, -5
	q /= r + 1
	const k = -3
	println(q, 7/-2, 7%-2, 10/k, 10%k, -7/r, -7%r)
}
