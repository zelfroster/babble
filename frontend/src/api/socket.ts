import { ChatMessage } from "src/App";

const socket = new WebSocket("ws://localhost:9001/ws");

function connect(cb: (msg: ChatMessage) => void) {
  console.log("connecting...");

  socket.onopen = () => {
    console.log("successfully connected");
  };

  socket.onmessage = (msg) => {
    console.log("Message from server: ", msg);
    cb(msg);
  };

  socket.onclose = (event) => {
    console.log("socket close connection: ", event);
  };

  socket.onerror = (error) => {
    console.log("socket error: ", error);
  };
}

function sendMsg(msg: string, username: string) {
  const data = JSON.stringify({ username: username, body: msg });
  console.log("sending message: ", data);
  socket.send(data);
}

export { connect, sendMsg };
