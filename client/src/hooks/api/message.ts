import { useEffect, useState } from "react";
import { fetchAllMessages } from "../../api/messages";
import { Message } from "../../types";

export const useFetchAllMessages = (serverId: number, roomId: number) => {
  const [messages, setMessages] = useState<Message[] | []>([]);

  useEffect(() => {
    fetchAllMessages(serverId, roomId)
      .then((messages) => {
        const temp = messages.map((message: any) => ({
          id: message.id,
          sender: message.user.username,
          body: message.body,
          createdAt: message.createdAt,
        }));
        setMessages(temp);
      })
      .catch(({ response }) => console.log(response));
  }, [serverId, roomId]);

  return {
    messages,
    setMessages,
  };
};
