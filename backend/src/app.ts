import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { notFoundHandler, errorHandler } from "./middlewares/middlewares";
import api from "./api/api";
import cors from "cors";
import socket from "./socket";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import makeConnectionToDb from "./db";
import passport from "passport";
import passportConfig from "./passport.config";

dotenv.config();

const app = express();
const server = http.createServer(app);
makeConnectionToDb();
socket(server);

passportConfig();
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_KEY!],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/api/v1", api);
app.use(notFoundHandler);
app.use(errorHandler);

export default server;
