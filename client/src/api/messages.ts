import axios from "axios";
import { API_ENDPOINT } from "../constants";

const SERVER_ENDPOINT = `${API_ENDPOINT}/servers`;

export const fetchAllMessages = async (serverId: number, roomId: number) => {
  console.log(`${SERVER_ENDPOINT}/${serverId}/${roomId}/messages`);
  const {
    data: { messages },
  } = await axios.get(
    `${SERVER_ENDPOINT}/${serverId}/rooms/${roomId}/messages`,
    {
      withCredentials: true,
    }
  );
  return messages;
};
