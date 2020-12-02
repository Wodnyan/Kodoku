import { API_ENDPOINT } from "../constants";

const MEMBERS_ENPOINT = `${API_ENDPOINT}/member`;

export async function getAllMembers(serverId?: number) {
  const resp = await fetch(
    `${MEMBERS_ENPOINT}${serverId !== undefined ? `?serverId=${serverId}` : ""}`
  );
  return resp;
}

export function joinServer(code: string, userId: number) {
  return fetch(`${API_ENDPOINT}/member`, {
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
