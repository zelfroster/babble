import { useContext, useState } from "react";
import { UserContext } from "@contexts/user.context";
import ChatHistory from "@components/ChatHistory/ChatHistory";
import { connect } from "@api/socket";
import { ChatMessage } from "@components/Message/Message";

const Chat = () => {
  const { currentUser } = useContext(UserContext);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  connect((msg) => {
    const { timeStamp, body, username } = JSON.parse(msg);
    console.log({ timeStamp, body, username });
    setChatHistory((prevChatMessage) => [
      ...prevChatMessage,
      { timeStamp, body, username },
    ]);
  });
  return (
    <div className="flex flex-col gap-4 grow">
      <p className="text-xl font-bold"> Welcome {currentUser?.firstName}</p>
      <ChatHistory chatHistory={chatHistory} />
    </div>
  );
};

export default Chat;
