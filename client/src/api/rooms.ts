import { API_ENDPOINT } from "../constants";

export async function getAllRooms(serverId: number) {
  const resp = await fetch(`${API_ENDPOINT}/room`);
  return resp;
}
