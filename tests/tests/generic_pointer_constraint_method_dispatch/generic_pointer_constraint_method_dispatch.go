package main

// localPairingMessage mirrors the spacewave sdk/session pairing constraint: a
// pointer type-set element plus VT codec methods.
type localPairingMessage[T any] interface {
	*T
	MarshalVT() ([]byte, error)
	UnmarshalVT(data []byte) error
}

type pairingOffer struct {
	Note string
}

func (o *pairingOffer) MarshalVT() ([]byte, error) {
	return []byte(o.Note), nil
}

func (o *pairingOffer) UnmarshalVT(data []byte) error {
	o.Note = "decoded:" + string(data)
	return nil
}

func decodeLocalPairing[M localPairingMessage[T], T any](data []byte) (T, error) {
	var msg T
	err := M(&msg).UnmarshalVT(data)
	return msg, err
}

func encodeLocalPairing[M localPairingMessage[T], T any](msg M) ([]byte, error) {
	return msg.MarshalVT()
}

func main() {
	msg, err := decodeLocalPairing[*pairingOffer]([]byte("hi"))
	if err != nil {
		println("decode error")
		return
	}
	println(msg.Note)

	encoded, err := encodeLocalPairing[*pairingOffer](&pairingOffer{Note: "note"})
	if err != nil {
		println("encode error")
		return
	}
	println("encoded:", string(encoded))
}
