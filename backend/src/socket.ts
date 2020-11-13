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
    socket.on("message", (message: Message) => {
      console.log(message);
      socket.broadcast.emit("message", message);
    });
  });
}
