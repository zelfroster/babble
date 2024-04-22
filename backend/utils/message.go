package utils

import "time"

func GetCurrentTimeStamp() int64 {
	ts := time.Now().UnixNano() / int64(time.Millisecond)
	return ts
}
