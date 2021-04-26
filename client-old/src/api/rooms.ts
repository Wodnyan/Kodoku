import axios from "axios";
import { API_ENDPOINT } from "../constants";

const SERVER_ENDPOINT = `${API_ENDPOINT}/servers`;

export async function getAllRooms(serverId: number) {
  const {
    data: { rooms },
  } = await axios.get(`${SERVER_ENDPOINT}/${serverId}/rooms`);
  return rooms;
}

export async function createRoom(serverId: number, roomName: string) {
  const accessToken = localStorage.getItem("access_token");
  const {
    data: { room },
  } = await axios.post(
    `${SERVER_ENDPOINT}/${serverId}/rooms`,
    { roomName },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return room;
}
