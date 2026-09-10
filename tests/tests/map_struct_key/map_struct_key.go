package main

type requestKey struct {
	soID     string
	inviteID string
	peerID   string
}

type node struct {
	value string
	next  *node
}

func newMap[K comparable, V any]() map[K]V {
	return make(map[K]V)
}

func main() {
	status := make(map[requestKey]string)
	status[requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"}] = "pending"
	status[requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"}] = "accepted"

	got, ok := status[requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"}]
	println("same struct key:", got, ok, len(status))

	_, missing := status[requestKey{soID: "so-2", inviteID: "inv-1", peerID: "peer-1"}]
	println("different struct key:", missing)

	delete(status, requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})
	_, deleted := status[requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"}]
	println("deleted struct key:", deleted, len(status))

	first := &requestKey{soID: "same"}
	second := &requestKey{soID: "same"}
	pointers := map[*requestKey]int{first: 1, second: 2}
	println("distinct pointer keys:", len(pointers), pointers[first], pointers[second])
	delete(pointers, first)
	println("delete one pointer:", len(pointers), pointers[second])

	left, right := &node{value: "same"}, &node{value: "same"}
	left.next, right.next = left, right
	cyclic := newMap[*node, int]()
	cyclic[left], cyclic[right] = 3, 4
	println("cyclic pointer keys:", len(cyclic), cyclic[left], cyclic[right])
}
