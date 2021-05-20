import axios from "axios";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Input } from "../../components/Input/Input";
import { ChatLayout } from "../../components/layouts/ChatLayout/ChatLayout";
import { API_ENDPOINT } from "../../constants";
import { useAuth } from "../../context/auth/AuthProvider";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
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

  const [messages, setMessages] = useState<[] | Message[]>([]);

  useEffect(() => {
    // Get all messages of a rooms
    const getAllMessages = async () => {
      try {
        const { data } = await axios.get(
          `${API_ENDPOINT}/servers/${serverId}/rooms/${roomId}/messages`,
          {
            params: {
              limit: 25,
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
    <ChatLayout
      messages={(messages as Message[]).map((message) => (
        <div ref={ref} key={message.id}>
          <h1>{message.body}</h1>
        </div>
      ))}
      input={
        <Formik
          initialValues={{
            message: "",
          }}
          onSubmit={async ({ message }, { resetForm }) => {
            // Refactor: This is supposed to be done with sockets
            if (!message) return;
            try {
              const {
                data: { newMessage },
              } = await axios.post(
                `${API_ENDPOINT}/servers/${serverId}/rooms/${roomId}/messages`,
                {
                  message,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );
              setMessages((prev) => [
                ...prev,
                {
                  body: newMessage.body,
                  id: newMessage.id,
                  user,
                },
              ]);
              resetForm();
              scrollToBottom("smooth");
            } catch (error) {
              console.error(error.response);
            }
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
  );
};
