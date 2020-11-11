import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { notFoundHandler, errorHandler } from "./middlewares/middlewares";
import api from "./api/api";
import cors from "cors";
import socket from "./socket";
const io = require("socket.io");

const app = express();
const server = http.createServer(app);
const retard = io(server);
retard.on("connection", (socket: any) => {
  console.log(socket);
});
// socket(server);

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/v1", api);
app.use(notFoundHandler);
app.use(errorHandler);

export default server;
