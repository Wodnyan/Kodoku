import { API_ENDPOINT } from "../constants";

export async function getAllServers(userId?: number) {
  const resp = await fetch(
    `${API_ENDPOINT}/server${isNaN(Number(userId)) ? "" : "?userId=" + userId}`
  );
  const body = await resp.json();
  return body.servers;
}
