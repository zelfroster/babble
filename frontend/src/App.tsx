import { useEffect, useState } from "react";

import Header from "@components/Header/Header";
import ChatHistory from "@components/ChatHistory/ChatHistory";
import ChatInput from "@components/ChatInput/ChatInput";
import { connect } from "./api/socket";
import { Input } from "@components/ui/input";

export interface ChatMessage {
  timeStamp: number;
  data: string;
}

function App() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [tempUsername, setTempUsername] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    connect((msg: ChatMessage) => {
      setChatHistory((prevChatHistory) => [...prevChatHistory, msg]);
    });
  }, [username]);

  return (
    <div className="container py-4 dark min-h-screen">
      <Header />
      {username ? (
        <>
          <ChatHistory chatHistory={chatHistory} />
          <ChatInput username={username} />
        </>
      ) : (
        <form
          onSubmit={() => {
            setUsername(tempUsername);
          }}
        >
          <Input
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            placeholder="Enter your name..."
          />
        </form>
      )}
    </div>
  );
}

export default App;
