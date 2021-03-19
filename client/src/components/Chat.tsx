import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import scrollToBottom from "../lib/scroll-to-bottom";
import { useParams } from "react-router-dom";
import { Message } from "../types";
import UserContext from "../context/UserContext";
import useSocket from "../hooks/connect-to-socket";
import { useFetchAllMessages } from "../hooks/api/message";
import * as timeago from "timeago.js";
import { getScrollPercentage } from "../lib/get-scroll-percentage";

interface ChatInputProps {
  innerRef: any;
  scrollToBottom: () => void;
  promptUser: boolean;
  togglePrompt: () => void;
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
  const [promptUser, setPromptUser] = useState(false);

  const { register, handleSubmit } = useForm<MessageInput>();
  const params = useParams() as any;
  const user = useContext(UserContext);
  const socket = useSocket("/");
  const chat = useRef<HTMLDivElement | null>(null);
  const { messages, setMessages, loading } = useFetchAllMessages(
    params.serverId,
    params.roomId
  );

  // On load scroll the chat to the bottom
  useEffect(() => {
    if (chat.current) {
      scrollToBottom(chat.current);
    }
  }, [params.serverId, params.roomId, loading, chat]);

  useEffect(() => {
    socket?.on(
      "message",
      ({
        createdAt,
        id,
        message,
        username,
      }: {
        createdAt: string;
        id: number;
        message: string;
        username: string;
      }) => {
        setMessages((prev) => [
          ...prev,
          {
            id,
            body: message,
            sender: username,
            createdAt: createdAt,
          },
        ]);
        const scrollPercentage = getScrollPercentage(chat.current!);
        if (chat.current && scrollPercentage > 75) {
          scrollToBottom(chat.current);
        } else {
          setPromptUser(true);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chat]);

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
    if (chat.current) {
      scrollToBottom(chat.current);
    }
    socket?.emit("message", {
      message: data.chatInput,
      username: user?.username,
      userId: user?.id,
      serverId: params.serverId,
      roomId: params.roomId,
    });
    e.target.reset();
  };

  const temp = () => {
    if (chat.current) {
      scrollToBottom(chat.current);
    }
  };

  return (
    <div className="h-full grid grid-rows-2">
      <div ref={chat} className="overflow-auto min-h-full row-span-2">
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
        <ChatInput
          scrollToBottom={temp}
          innerRef={register({ required: true })}
          promptUser={promptUser}
          togglePrompt={() => setPromptUser((prev) => !prev)}
        />
      </form>
    </div>
  );
});

const ChatInput: React.FC<ChatInputProps> = React.memo(
  ({ innerRef, scrollToBottom, promptUser, togglePrompt }) => {
    const handleClick = () => {
      scrollToBottom();
      togglePrompt();
    };
    return (
      <>
        {promptUser && <button onClick={handleClick}>Scroll back</button>}
        <input
          type="text"
          className="w-11/12 mx-auto block p-2 m-3 text-lg rounded"
          name="chatInput"
          ref={innerRef}
        />
      </>
    );
  }
);

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
