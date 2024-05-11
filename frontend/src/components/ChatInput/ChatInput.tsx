import { useContext, useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { sendMsg } from "../../api/socket";

import { BiSolidSend } from "react-icons/bi";
import { UserContext } from "../../contexts/user.context";

const ChatInput = () => {
  const [messageInput, setMessageInput] = useState<string>("");

  const { currentUser } = useContext(UserContext);

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setMessageInput(e.target.value);
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (messageInput === "") {
      return;
    }
    if (currentUser?.username) {
      sendMsg(messageInput, currentUser?.username);
    }
    setMessageInput("");
  }

  return (
    <form onSubmit={handleSendMessage} className="flex gap-4 px-3 py-2">
      <Input
        type="text"
        placeholder="Type a message..."
        value={messageInput}
        onChange={handleChangeInput}
      />
      <Button type="submit" className="gap-1 h-9">
        Send <BiSolidSend />
      </Button>
    </form>
  );
};

export default ChatInput;
