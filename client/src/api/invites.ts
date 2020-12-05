import { API_ENDPOINT } from "../constants";

export async function createInvite(serverId: number) {
  return fetch(`${API_ENDPOINT}/invites`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serverId,
    }),
  });
}
