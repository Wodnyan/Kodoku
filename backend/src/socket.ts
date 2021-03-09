import { Server } from "http";
import { Socket } from "socket.io";
// import Message from "./api/message/message.models";

const socketio = require("socket.io");

export default function (server: Server) {
  // const io = socketio(server);
  // io.on("connection", (socket: Socket) => {
  //   console.log("User Connected");
  //
  //   socket.on("subscribe", ({ serverId, roomId }) => {
  //     const room = `${serverId}:${roomId}`;
  //     console.log(room);
  //     socket.join(room);
  //   });
  //
  //   socket.on(
  //     "message",
  //     async (message, username, userId, serverId, roomId) => {
  //       const room = `${serverId}:${roomId}`;
  //       const newMessage = await Message.query().insertAndFetch({
  //         body: message,
  //         sender_id: userId,
  //         room_id: roomId,
  //       });
  //       console.log(newMessage);
  //       console.log(message, username, userId, serverId, roomId);
  //       socket.to(room).emit("message", message, username);
  //     }
  //   );
  // });
}
