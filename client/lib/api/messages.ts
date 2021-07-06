import axios from "axios";
import { API_ENDPOINT } from "../../constants";

export async function fetchAllMessagesOfRoom(
  serverId: number,
  roomId: number,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: "desc" | "asc";
  }
) {
  const { data } = await axios.get(
    `${API_ENDPOINT}/servers/${serverId}/rooms/${roomId}/messages`,
    {
      params: {
        limit: options?.limit || 50,
        offset: options?.offset || 0,
        orderBy: options?.orderBy || "desc",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  return data.messages;
}
