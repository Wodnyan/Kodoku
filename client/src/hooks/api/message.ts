import { useEffect, useState } from "react";
import { fetchAllMessages } from "../../api/messages";

export const useFetchAllMessages = (serverId: number, roomId: number) => {
  const [messages, setMessages] = useState<any[] | []>([]);

  useEffect(() => {
    fetchAllMessages(serverId, roomId)
      .then((messages) => {
        console.log(messages);
        setMessages(messages);
      })
      .catch(({ response }) => console.log(response));
  }, [serverId, roomId]);

  return {
    messages,
    setMessages,
  };
};
