import Message from "@components/Message/Message";
import { ChatMessage } from "src/App";

export interface ChatHistoryProps {
  chatHistory: ChatMessage[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory }) => {
  return (
    <div className="">
      <h2>Chat History</h2>
      <div className="flex flex-col gap-2 border border-solid rounded-sm p-4 my-4 h-full overflow-auto">
        {chatHistory.map((chatMessage: ChatMessage) => (
          <Message key={chatMessage?.timeStamp} msg={chatMessage?.data} />
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
