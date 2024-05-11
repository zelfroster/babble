import ChatInput from "@components/ChatInput/ChatInput";
import Message, { ChatMessage } from "@components/Message/Message";

export interface ChatHistoryProps {
  chatHistory: ChatMessage[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory }) => {
  console.log({ chatHistory });
  return (
    <div className="font-medium flex flex-col border border-solid rounded-sm grow">
      <h2 className="py-2 px-3">Chat History</h2>
      <div className="border-t border-solid flex flex-col gap-2 h-full overflow-auto grow">
        {chatHistory.map((chatMessage: ChatMessage) => (
          <Message key={chatMessage?.timeStamp} message={chatMessage} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatHistory;
