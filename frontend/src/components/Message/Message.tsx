import { useState } from "react";

const Message = ({ msg }: { msg: string }) => {
  {
    /* const [message, setMessage] = useState<string>(msg); */
  }
  const messageObj = JSON.parse(msg);
  const messageTimestamp = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
  }).format(messageObj?.TimeStamp);

  const messageBody = JSON.parse(messageObj?.Body);

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <span className="font-bold">{messageBody?.username}</span>
        <p>{messageBody?.message}</p>
      </div>
      <span className="text-neutral-500">{messageTimestamp}</span>
    </div>
  );
};

export default Message;
