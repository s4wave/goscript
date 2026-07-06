package main

func run(frames <-chan int, done <-chan string) string {
	command := true
	out := ""
	for {
		if command {
			select {
			case result := <-done:
				out += result
				command = false
				continue
			default:
			}
		}
		select {
		case frame := <-frames:
			switch frame {
			case 1:
				if command {
					out += "busy "
					continue
				}
				out += "input "
			case 2:
				out += "resize "
				continue
			case 3:
				return out + "close"
			}
		case result := <-done:
			out += result
			command = false
		}
	}
}

func main() {
	frames := make(chan int, 3)
	done := make(chan string, 1)
	frames <- 2
	frames <- 1
	frames <- 3
	done <- "done "
	println(run(frames, done))
}
