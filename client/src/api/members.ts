import { API_ENDPOINT } from "../constants";

const MEMBERS_ENPOINT = `${API_ENDPOINT}/members`;

export async function getAllMembers(serverId?: number) {
  const resp = await fetch(
    `${MEMBERS_ENPOINT}${serverId !== undefined ? `?serverId=${serverId}` : ""}`
  );
  return resp;
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
