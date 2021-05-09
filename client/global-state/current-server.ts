import { atom } from "recoil";
import { Server } from "../types";

export const currentServerState = atom<{ server?: Server }>({
  key: "currentServer",
  default: {
    server: null,
  },
});
