import React from "react";
import { Route } from "react-router-dom";
import Rooms from "../../components/room/Rooms";
import UserContext from "../../context/UserContext";
import Servers from "../../components/Servers";
import { useAuth } from "../../hooks/api/auth";
import { LandingView } from "./LandingView";
import { ServerView } from "./ServerView";
import { RoomView } from "./RoomView";

const ChatPage = () => {
  return (
    <>
      <Route path="/chat">
        <h1>Hello world</h1>
      </Route>
      <Route path="/chat/:serverId">
        <h1>Server Id</h1>
      </Route>
      <Route path="/chat/:serverId/:roomId">
        <h1>Room Id</h1>
      </Route>
    </>
  );
};
export default ChatPage;
