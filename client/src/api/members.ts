import axios from "axios";
import { API_ENDPOINT } from "../constants";

const MEMBERS_ENPOINT = `${API_ENDPOINT}/members`;
const SERVERS_ENDPOINT = `${API_ENDPOINT}/servers`;

export async function getOneMember(serverId: number, userId: number) {
  const accessToken = localStorage.getItem("access_token");
  const { data } = await axios.get(
    `${SERVERS_ENDPOINT}/${serverId}/members/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return data;
}

export async function getAllMembers(serverId: number) {
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

export async function joinServer(
  code: string,
  userId: number,
  serverId: number
) {
  const accessToken = localStorage.getItem("access_token");
  const {
    data: { member },
  } = await axios.post(
    `${SERVERS_ENDPOINT}/${serverId}/members`,
    {
      inviteCode: code,
      userId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return member;
}
