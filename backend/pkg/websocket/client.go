package websocket

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/zelfroster/babble/utils"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
	mu   sync.Mutex
}

type Message struct {
	Type      int    `json:"type"`
	TimeStamp int64  `json:"timeStamp"`
	Body      string `json:"body"`
	Username  string `json:"username"`
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

		ts := utils.GetCurrentTimeStamp()

		message := Message{Type: messageType, TimeStamp: ts}

		err = json.Unmarshal([]byte(p), &message)

		if err != nil {
			fmt.Println("error: ", err)
		}

		c.Pool.Broadcast <- message

		fmt.Printf("Message Recieved: %+v\n", message)
	}
}
