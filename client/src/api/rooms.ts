import { API_ENDPOINT } from "../constants";

const ROOM_ENDPOINT = `${API_ENDPOINT}/room`;

export async function getAllRooms(serverId: number) {
  const resp = await fetch(ROOM_ENDPOINT);
  return resp;
}

export async function createRoom(serverId: number, roomName: string) {
  const resp = await fetch(ROOM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      serverId,
      name: roomName,
    }),
  });
  return resp;
}
