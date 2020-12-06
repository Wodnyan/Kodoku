import { API_ENDPOINT } from "../constants";

const MESSAGES_ENDPOINT = `${API_ENDPOINT}/messages`;

export function getAllMessages(roomId?: number) {
  return fetch(
    `${MESSAGES_ENDPOINT}?${isNaN === undefined ? "" : "roomId=" + roomId}`
  );
}
