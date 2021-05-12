import { atom } from "recoil";
import { Room, Server } from "../types";

type CurrentServerState = {
  server: Server | null;
  rooms: Room[] | [];
};

export const currentServerState = atom<CurrentServerState>({
  key: "currentServer",
  default: {
    server: null,
    rooms: [],
  },
});
