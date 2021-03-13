import React, { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import scrollToBottom from "../lib/scroll-to-bottom";
import { useParams } from "react-router-dom";
import { Message } from "../types";
import UserContext from "../context/UserContext";
import useSocket from "../hooks/connect-to-socket";
import { useFetchAllMessages } from "../hooks/api/message";
import * as timeago from "timeago.js";

interface ChatInputProps {
  innerRef: any;
}
interface ChatMessageProps {
  children: React.ReactNode;
  username: string;
  createdAt: string;
}
interface MessageInput {
  chatInput: string;
}

const Chat = React.memo(() => {
  const { register, handleSubmit } = useForm<MessageInput>();
  const params = useParams() as any;
  const user = useContext(UserContext);
  const socket = useSocket("/");
  const chat = useRef<any>(null);
  const { messages, setMessages } = useFetchAllMessages(
    params.serverId,
    params.roomId
  );

  useEffect(() => {
    scrollToBottom(chat.current);
  }, [messages]);

  useEffect(() => {
    socket?.on("message", (message: string, username: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: 1,
          body: message,
          sender: username,
          createdAt: String(Date.now()),
        },
      ]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    socket?.emit("subscribe", {
      serverId: params.serverId,
      roomId: params.roomId,
    });
  }, [params, socket]);

  const onSubmit = (data: MessageInput, e: any) => {
    setMessages((prev) => [
      ...prev,
      {
        id: 1,
        body: data.chatInput,
        sender: user?.username!,
        createdAt: String(Date.now()),
      },
    ]);
    socket?.emit("message", {
      message: data.chatInput,
      username: user?.username,
      userId: user?.id,
      serverId: params.serverId,
      roomId: params.roomId,
    });
    e.target.reset();
  };

  return (
    <div className="h-full grid grid-rows-2">
      <div ref={chat} className="overflow-auto h-full row-span-2">
        {(messages as Message[]).map((message, i) => (
          <ChatMessage
            createdAt={message.createdAt}
            username={message.sender}
            key={i}
          >
            {message.body}
          </ChatMessage>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800">
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
  ({ children, username, createdAt }) => {
    return (
      <div>
        <span className="text-gray-400 text-xs">
          {timeago.format(createdAt)}
        </span>
        <span>{username}:</span>
        <span>{children}</span>
      </div>
    );
  }
);
export default Chat;
