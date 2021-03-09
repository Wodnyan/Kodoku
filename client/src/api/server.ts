import axios from "axios";
import { API_ENDPOINT } from "../constants";

interface CreateServerPayload {
  name: string;
  ownerId: number;
}

const SERVERS_ENDPOINT = `${API_ENDPOINT}/servers`;
const USER_ENDPOINT = `${API_ENDPOINT}/users`;

export async function getAllServersOfUser(userId?: number) {
  const accessToken = localStorage.getItem("access_token");
  const { data } = await axios.get(`${USER_ENDPOINT}/${userId}/servers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return data;
}

export async function createServer(payload: CreateServerPayload) {
  const accessToken = localStorage.getItem("access_token");
  const { data } = await axios.post(SERVERS_ENDPOINT, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return data;
}
