import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { notFoundHandler, errorHandler } from "./middlewares/error";
import { checkAuth } from "./middlewares/auth";
import api from "./api/api";
import cors from "cors";
import socket from "./socket";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import makeConnectionToDb from "./db";
import passportConfig from "./passport.config";
import passport from "passport";

dotenv.config();

const app = express();
const server = http.createServer(app);

socket(server);
makeConnectionToDb();
passportConfig();

app.use(helmet());
app.use(morgan("common"));
app.use(passport.initialize());
app.use(checkAuth);
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", api);
app.use(notFoundHandler);
app.use(errorHandler);

export default server;
