import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import scrollToBottom from "../lib/scroll-to-bottom";
import { useParams } from "react-router-dom";
import { Message } from "../types";
import UserContext from "../context/UserContext";
import useSocket from "../hooks/connect-to-socket";

interface ChatInputProps {
  innerRef: any;
}
interface ChatMessageProps {
  children: React.ReactNode;
  username: string;
}
interface MessageInput {
  chatInput: string;
}

const Chat = React.memo(() => {
  const { register, handleSubmit, reset } = useForm<MessageInput>();
  const [messages, setMessages] = useState<[] | Message[]>([]);
  const params = useParams() as any;
  const user = useContext(UserContext);
  const socket = useSocket("/");
  const chat = useRef<any>(null);

  useEffect(() => {
    scrollToBottom(chat.current);
  }, []);

  useEffect(() => {
    socket?.on("message", (message: string, username: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: 1,
          body: message,
          sender: username,
        },
      ]);
      scrollToBottom(chat.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    socket?.emit("subscribe", params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onSubmit = (data: MessageInput, e: any) => {
    setMessages((prev) => [
      ...prev,
      {
        id: 1,
        body: data.chatInput,
        sender: user?.username!,
      },
    ]);
    scrollToBottom(chat.current);
    socket?.emit(
      "message",
      data.chatInput,
      user?.username,
      params.serverId,
      params.roomId
    );
    e.target.reset();
  };

  return (
    <div className="h-full grid grid-rows-2">
      <div ref={chat} className="overflow-auto h-full row-span-2">
        {(messages as Message[]).map((message, i) => (
          <ChatMessage username={message.sender} key={i}>
            {message.body}
          </ChatMessage>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-blue-600">
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

const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({ children, username }) => {
    return (
      <div>
        <span className="text-gray-400 text-xs">2 minutes ago</span>
        <span>{username}:</span>
        <span>{children}</span>
      </div>
    );
  }
);
export default Chat;
