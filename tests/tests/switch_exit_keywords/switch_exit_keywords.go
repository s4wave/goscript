package main

func returnValue(result *string)  { *result += "return" }
func throwError(result *string)   { *result += "throw" }
func continueWork(result *string) { *result += "continue" }
func breakfast(result *string)    { *result += "break" }

func prefixCase(value int) string {
	result := ""
	switch value {
	case 0:
		returnValue(&result)
	case 1:
		throwError(&result)
	case 2:
		continueWork(&result)
	case 3:
		breakfast(&result)
	case 4:
		result += "next"
	}
	return result
}

func nestedReturn(value int) string {
	switch value {
	case 0:
		{
			return "returned"
		}
	default:
		return "default"
	}
}

func nestedBranches() string {
	result := ""
	for value := 0; value < 3; value++ {
		switch value {
		case 0:
			{
				continue
			}
		case 1:
			{
				break
			}
		default:
			result += "default"
		}
		result += "after"
	}
	return result
}

func main() {
	for value := 0; value <= 4; value++ {
		println(prefixCase(value))
	}
	println(nestedReturn(0))
	println(nestedReturn(1))
	println(nestedBranches())
}
