import { useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { sendMsg } from "../../api/socket";

import { BiSolidSend } from "react-icons/bi";

const ChatInput = ({ username }: { username: string }) => {
  const [messageInput, setMessageInput] = useState<string>("");

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setMessageInput(e.target.value);
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (messageInput === "") {
      return;
    }
    sendMsg(messageInput, username);
    setMessageInput("");
  }
  console.log(messageInput);

  return (
    <form onSubmit={handleSendMessage} className="flex gap-4">
      <Input
        type="text"
        placeholder="Type a message..."
        value={messageInput}
        onChange={handleChangeInput}
      />
      <Button type="submit" className="gap-1">
        Send <BiSolidSend />
      </Button>
    </form>
  );
};

export default ChatInput;
