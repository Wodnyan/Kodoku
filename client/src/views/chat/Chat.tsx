import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Rooms from "../../components/room/Rooms";
import UserContext from "../../context/UserContext";
import Servers from "../../components/Servers";
import { useAuth } from "../../hooks/api/auth";
import { LandingView } from "./LandingView";
import { ServerView } from "./ServerView";
import { RoomView } from "./RoomView";

const ChatPage = () => {
  const { user } = useAuth("/");

  return (
    <UserContext.Provider value={user}>
      <Router>
        <div className="relative h-full flex">
          <Route path="/chat">
            <section className="hide-scrollbar bg-gray-800 w-16 h-screen overflow-auto">
              <Servers />
            </section>
          </Route>
          <Route exact path="/chat">
            <LandingView />
          </Route>
          <Switch>
            <Route path="/chat/:serverId">
              <section className="bg-gray-700 w-1/5 h-screen">
                <Rooms />
              </section>
            </Route>
          </Switch>
          <Route exact path="/chat/:serverId">
            <ServerView />
          </Route>
          <Route exact path="/chat/:serverId/:roomId">
            <RoomView />
          </Route>
        </div>
      </Router>
    </UserContext.Provider>
  );
};
export default ChatPage;
