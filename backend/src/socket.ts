import { Server } from "http";
import { Socket } from "socket.io";
const socketio = require("socket.io");

export default function (server: Server) {
  const io = socketio(server) as Socket;
  io.on("connection", (socket: Socket) => {
    console.log("User Connected");
  });
}
