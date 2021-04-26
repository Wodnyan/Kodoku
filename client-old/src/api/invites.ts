import axios from "axios";
import { API_ENDPOINT } from "../constants";

const SERVER_ENDPOINT = `${API_ENDPOINT}/servers`;

export async function createInvite(serverId: number) {
  const accessToken = localStorage.getItem("access_token");
  const {
    data: { inviteCode },
  } = await axios.post(
    `${SERVER_ENDPOINT}/${serverId}/invites`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return inviteCode;
}
