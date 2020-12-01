import { API_ENDPOINT } from "../constants";

export async function getAllServers(userId?: number) {
  const resp = await fetch(
    `${API_ENDPOINT}/server${isNaN(Number(userId)) ? "" : "?userId=" + userId}`
  );
  return resp;
}
