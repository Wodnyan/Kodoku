import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { notFoundHandler, errorHandler } from "./middlewares/middlewares";
import api from "./api/api";
import socket from "./socket";

const app = express();
const server = http.createServer(app);
socket(server);

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/v1", api);
app.use(notFoundHandler);
app.use(errorHandler);

export default server;
