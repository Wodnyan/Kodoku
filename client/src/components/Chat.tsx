import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "../types";
import { useForm } from "react-hook-form";
import scrollToBottom from "../lib/scroll-to-bottom";
interface ChatInputProps {
  innerRef: any;
}
interface ChatMessageProps {
  children: React.ReactNode;
  username: string;
}

const Chat = React.memo(() => {
  const { register, handleSubmit } = useForm();
  const [socket, setSocket] = useState<null | Socket>(null);

  const chat = useRef<any>(null);

  useEffect(() => {
    scrollToBottom(chat.current);
  }, []);

  useEffect(() => {
    const socketio = io("/");
    setSocket(socketio);
    socketio.on("connect", (socket: Socket) => {
      console.log("Connected");
    });
    socketio.on("message", (message: any) => {
      console.log(message);
    });
    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full grid grid-rows-2">
      <div ref={chat} className="overflow-auto h-full row-span-2">
        {[...Array(100)].map((_, i) => (
          <ChatMessage username="user" key={i}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita
            Id, reiciendis.
          </ChatMessage>
        ))}
      </div>
      <form
        onSubmit={handleSubmit((data: any) => console.log(data))}
        className="bg-blue-600"
      >
        <ChatInput innerRef={register({ required: true })} />
      </form>
    </div>
  );
});

const ChatInput: React.FC<ChatInputProps> = React.memo(({ innerRef }) => {
  return (
    <input
      type="text"
      className="w-11/12 mx-auto block p-2 m-3 text-lg rounded"
      name="chatInput"
      ref={innerRef}
    />
  );
});

const ChatMessage: React.FC<ChatMessageProps> = ({ children, username }) => {
  return (
    <div>
      <span className="text-gray-400 text-xs">2 minutes ago</span>
      <span>{username}:</span>
      <span>{children}</span>
    </div>
  );
};
export default Chat;
