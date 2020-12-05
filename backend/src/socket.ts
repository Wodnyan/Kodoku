import { Server } from "http";
import { Socket } from "socket.io";

const socketio = require("socket.io");

interface Message {
  sender: string;
  body: string;
}

export default function (server: Server) {
  const io = socketio(server);
  io.on("connection", (socket: Socket) => {
    console.log("User Connected");

    socket.on("subscribe", ({ serverId, roomId }) => {
      const room = `${serverId}:${roomId}`;
      console.log(room);
      socket.join(room);
    });

    socket.on("message", (message, username, serverId, roomId) => {
      console.log(message);
      const room = `${serverId}:${roomId}`;
      socket.to(room).emit("message", message, username);
    });
  });
}
