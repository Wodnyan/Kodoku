import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "../types";

const Chat = () => {
  const [messages, setMessages] = useState<Message[] | []>([]);
  return (
    <div className="overflow-auto h-full">
      {[...Array(100)].map((_, i) => (
        <ChatMessage username="user" key={i}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita Id,
          reiciendis.
        </ChatMessage>
      ))}
    </div>
  );
};
export default Chat;
