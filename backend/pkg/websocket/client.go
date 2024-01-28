package websocket

import (
	"fmt"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
	mu   sync.Mutex
}

type Message struct {
	Type      int    `json: "type"`
	TimeStamp int64  `json: "timeStamp"`
	Body      string `json: "body"`
	// Username  string `json: "username"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()

		if err != nil {
			fmt.Println(err)
			return
		}

		t := time.Now().UnixNano() / int64(time.Millisecond)
		fmt.Println(p)
		message := Message{Type: messageType, Body: string(p), TimeStamp: t}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Recieved: %+v\n", message)
	}
}
