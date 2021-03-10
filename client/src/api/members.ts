import axios from "axios";
import { API_ENDPOINT } from "../constants";

const MEMBERS_ENPOINT = `${API_ENDPOINT}/members`;
const SERVERS_ENDPOINT = `${API_ENDPOINT}/servers`;

export async function getAllMembers(serverId: number | null) {
  const accessToken = localStorage.getItem("access_token");
  const {
    data: { members },
  } = await axios.get(`${SERVERS_ENDPOINT}/${serverId}/members`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return members;
}

export function joinServer(code: string, userId: number) {
  return fetch(MEMBERS_ENPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      code,
      userId,
    }),
  });
}
