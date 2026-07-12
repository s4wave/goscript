package main

type wireFrame interface {
	Write()
}

type pingFrame struct{}

func (pingFrame) Write() {}

type FrameHandler interface {
	OnAcked(wireFrame)
	OnLost(wireFrame)
}

type Frame struct {
	Frame   wireFrame
	Handler FrameHandler
}

type packet struct {
	Frames []Frame
}

type retransmissionQueue struct {
	lost int
}

type retransmissionQueueInitialAckHandler retransmissionQueue

type retransmissionQueueHandshakeAckHandler retransmissionQueue

type retransmissionQueueAppDataAckHandler retransmissionQueue

func (q *retransmissionQueueInitialAckHandler) OnAcked(wireFrame) {}

func (q *retransmissionQueueInitialAckHandler) OnLost(wireFrame) {
	q.lost++
	println("initial")
}

func (q *retransmissionQueueHandshakeAckHandler) OnAcked(wireFrame) {}

func (q *retransmissionQueueHandshakeAckHandler) OnLost(wireFrame) {
	q.lost++
	println("handshake")
}

func (q *retransmissionQueueAppDataAckHandler) OnAcked(wireFrame) {}

func (q *retransmissionQueueAppDataAckHandler) OnLost(wireFrame) {
	q.lost++
	println("app")
}

func (q *retransmissionQueue) InitialAckHandler() FrameHandler {
	return (*retransmissionQueueInitialAckHandler)(q)
}

func (q *retransmissionQueue) HandshakeAckHandler() FrameHandler {
	return (*retransmissionQueueHandshakeAckHandler)(q)
}

func (q *retransmissionQueue) AppDataAckHandler() FrameHandler {
	return (*retransmissionQueueAppDataAckHandler)(q)
}

func queueFramesForRetransmission(p *packet) {
	for _, f := range p.Frames {
		if f.Handler != nil {
			f.Handler.OnLost(f.Frame)
		}
	}
}

func main() {
	q := &retransmissionQueue{}
	p := &packet{Frames: []Frame{
		{Frame: pingFrame{}, Handler: q.InitialAckHandler()},
		{Frame: pingFrame{}, Handler: q.HandshakeAckHandler()},
		{Frame: pingFrame{}, Handler: q.AppDataAckHandler()},
	}}
	queueFramesForRetransmission(p)
	println("lost:", q.lost)
	println("done")
}
