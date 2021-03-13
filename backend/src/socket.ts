import { Server } from "http";
import { Socket } from "socket.io";
import { MessageController } from "./controllers/message";

const socketio = require("socket.io");

const messageController = new MessageController();

export default function (server: Server) {
  const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000/",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("User Connected");

    socket.on("subscribe", ({ serverId, roomId }) => {
      const room = `${serverId}:${roomId}`;
      socket.join(room);
    });

    socket.on(
      "message",
      async ({ message, username, userId, serverId, roomId }) => {
        const room = `${serverId}:${roomId}`;
        console.log(userId);
        const newMessage = await messageController.create(
          roomId,
          userId,
          message
        );
        socket.to(room).emit("message", {
          id: newMessage.id,
          message: message,
          username,
          createdAt: newMessage.created_at,
        });
      }
    );
  });
}
