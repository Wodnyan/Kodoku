import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Button/Button";
import { ChatMessage } from "../../components/ChatMessage/ChatMessage";
import { Input } from "../../components/Input/Input";
import { useAuth } from "../../context/auth/AuthProvider";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { useSocketio } from "../../hooks/useSocketio";
import { fetchAllMessagesOfRoom } from "../../lib/api/messages";
import { reverse } from "../../lib/reverse";
import { User } from "../../types";
import styles from "./chat.module.css";

type Message = {
  id: number;
  body: string;
  user: User;
};

const PAGINATION_LIMIT_AMOUNT = 10;

export const Chat = () => {
  const {
    query: { serverId, roomId },
  } = useRouter();

  const { user } = useAuth();

  const { ref, scrollToBottom } = useScrollToBottom();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [, setPingToScrollDown] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: PAGINATION_LIMIT_AMOUNT,
  });

  const socket = useSocketio();

  const [messages, setMessages] = useState<[] | Message[]>([]);

  async function loadMore() {
    const fetchedMessages = await fetchAllMessagesOfRoom(
      Number(serverId),
      Number(roomId),
      {
        limit: pagination.limit + PAGINATION_LIMIT_AMOUNT,
        offset: pagination.offset,
        orderBy: "desc",
      }
    );
    const reversedMessages = reverse<Message>(fetchedMessages);

    const oldScrollHeight = chatContainerRef.current.scrollHeight;

    setMessages(reversedMessages);

    chatContainerRef.current.scrollTop =
      chatContainerRef.current.scrollHeight - oldScrollHeight;

    setPagination((prev) => ({
      ...prev,
      limit: prev.limit + PAGINATION_LIMIT_AMOUNT,
    }));
  }

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
        const fetchedMessages = await fetchAllMessagesOfRoom(
          Number(serverId),
          Number(roomId),
          {
            limit: pagination.limit,
            offset: pagination.offset,
            orderBy: "desc",
          }
        );
        const reversedMessages = reverse<Message>(fetchedMessages);
        setMessages(reversedMessages);
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
    <div className={styles.container}>
      <main ref={chatContainerRef} className={styles.messages}>
        {(messages as Message[]).map((message, id) => (
          <div key={message.id}>
            {id === 0 && (
              <Button
                style={{ margin: "0.5rem 0 1rem" }}
                full
                color="primary"
                onClick={loadMore}
              >
                Load more
              </Button>
            )}
            <div id="message" ref={ref}>
              <ChatMessage user={message.user} message={message.body} />
            </div>
          </div>
        ))}
      </main>
      <div className={styles.input}>
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
      </div>
    </div>
  );
};
