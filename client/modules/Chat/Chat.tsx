import axios from "axios";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import { ChatMessage } from "../../components/ChatMessage/ChatMessage";
import { Input } from "../../components/Input/Input";
import { ChatLayout } from "../../components/layouts/ChatLayout/ChatLayout";
import { API_ENDPOINT } from "../../constants";
import { useAuth } from "../../context/auth/AuthProvider";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { useSocketio } from "../../hooks/useSocketio";
import { User } from "../../types";

type Message = {
  id: number;
  body: string;
  user: User;
};

export const Chat = () => {
  const {
    query: { serverId, roomId },
  } = useRouter();
  const { user } = useAuth();
  const { ref, scrollToBottom } = useScrollToBottom();
  const [pingToScrollDown, setPingToScrollDown] = useState(false);
  const socket = useSocketio();
  // const chatRef = useRef(null);

  const [messages, setMessages] = useState<[] | Message[]>([]);

  // Subscribe to the room
  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected");

      socket.emit("subscribeToRoom", {
        serverId,
        roomId,
      });
    });
  }, [socket, roomId, serverId]);

  // Message event
  useEffect(() => {
    socket?.on("message", (message) => {
      console.log(message);
      setMessages((prev) => [
        ...prev,
        {
          id: message.id,
          body: message.message,
          user: message.user,
        },
      ]);
      scrollToBottom("smooth");
      setPingToScrollDown(true);
    });
  }, [socket, roomId, serverId]);

  // Get all messages of a rooms
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const { data } = await axios.get(
          `${API_ENDPOINT}/servers/${serverId}/rooms/${roomId}/messages`,
          {
            params: {
              limit: 100,
              offset: 0,
              orderBy: "desc",
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        let messages: Message[] | [] = [];

        // Reverse messages order
        for (let i = 0; i < data.messages.length; i++) {
          const message = (data.messages as never)[i];
          messages = [message, ...messages];
        }

        setMessages(messages);
        if (ref.current) {
          scrollToBottom("auto");
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (serverId && roomId) {
      getAllMessages();
    }
    return () => {};
  }, [serverId, roomId, ref]);

  return (
    <>
      <ChatLayout
        messages={(messages as Message[]).map((message) => (
          <div ref={ref} key={message.id}>
            <ChatMessage user={message.user} message={message.body} />
          </div>
        ))}
        input={
          <Formik
            initialValues={{
              message: "",
            }}
            onSubmit={async ({ message }, { resetForm }) => {
              if (!message) return;
              socket?.emit("message", {
                message,
                username: user.username,
                userId: user.id,
                serverId,
                roomId,
              });

              setMessages((prev) => [
                ...prev,
                {
                  body: message,
                  user,
                  id: +new Date(),
                },
              ]);

              resetForm();
              scrollToBottom("smooth");
            }}
          >
            {({ handleChange, values, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Input
                  full
                  onChange={handleChange}
                  value={values.message}
                  name="message"
                  placeholder="Write a message..."
                />
              </form>
            )}
          </Formik>
        }
      />
      {pingToScrollDown && <Button>Scroll Back</Button>}
    </>
  );
};
