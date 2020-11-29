import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "../types";
import scrollToBottom from "../lib/scroll-to-bottom";

const Chat = React.memo(() => {
  const [messages, setMessages] = useState<Message[] | []>([]);
  const chat = useRef<any>(null);
  useEffect(() => {
    scrollToBottom(chat.current);
  }, []);
  return (
    <div ref={chat} className="overflow-auto h-full">
      {[...Array(100)].map((_, i) => (
        <ChatMessage username="user" key={i}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita Id,
          reiciendis.
        </ChatMessage>
      ))}
    </div>
  );
});
export default Chat;
