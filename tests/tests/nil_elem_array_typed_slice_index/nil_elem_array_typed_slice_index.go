package main

type R struct{ N int }

// K is a named int32 kind.
type K int32

func get(i int) *R {
	if i == 0 {
		return nil
	}
	return &R{N: i}
}

func main() {
	res := [2]*R{}
	for i := range res {
		res[i] = get(i)
	}
	println(res[0] == nil, res[1].N)

	values := [][]byte{{1}, {2, 3}}
	hashes := make([][]byte, len(values))
	for i, v := range values {
		hashes[i] = v
	}
	println(len(hashes[1]))

	k := []K{2, 3, 4}[1+len(hashes)%2]
	println(int(k))
}
