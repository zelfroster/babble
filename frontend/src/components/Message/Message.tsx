export interface ChatMessage {
  timeStamp: number;
  body: string;
  username: string;
}

interface ChatMessageProps {
  message: ChatMessage;
}

const Message: React.FC<ChatMessageProps> = ({ message }) => {
  const { timeStamp, body, username } = message;
  console.log({ timeStamp, body, username });
  const messageTimestamp = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
  }).format(timeStamp);

  const isNotifyMessage =
    body === "New User Joined..." || body === "A User Left...";

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        {/* @TODO: Show random and persistent colors for a user */}
        <span className="font-medium text-[#24d1ac]">{username}</span>
        <p className={`${isNotifyMessage ? "text-neutral-500" : "text-white"}`}>
          {body}
        </p>
      </div>
      <span className="text-neutral-500">{messageTimestamp}</span>
    </div>
  );
};

export default Message;
