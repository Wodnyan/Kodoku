import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Chat from "../components/Chat";
import Rooms from "../components/room/Rooms";
import UserContext from "../context/UserContext";
import Members from "../components/Members";
import Servers from "../components/Servers";
import { useAuth } from "../hooks/api/auth";

const DefaultPage = () => {
  return (
    <section className="bg-blue-800 w-full h-screen overflow-auto flex justify-center items-center">
      <h1 className="text-4xl text-blue-900">Welcome to KODOKU</h1>
    </section>
  );
};

const ServerView = () => {
  return (
    <>
      <section className="w-8/12 bg-gray-600"></section>
      <section className="bg-gray-700 w-1/6 h-screen overflow-auto">
        <Members />
      </section>
    </>
  );
};

const RoomView = () => {
  return (
    <>
      <section className="w-8/12 bg-gray-600">
        <Chat />
      </section>
      <section className="bg-gray-700 w-1/6 h-screen overflow-auto">
        <Members />
      </section>
    </>
  );
};

const ChatPage = () => {
  const { user } = useAuth("/");

  return (
    <UserContext.Provider value={user}>
      <Router>
        <div className="relative h-full flex">
          <section className="hide-scrollbar bg-gray-800 w-16 h-screen overflow-auto">
            <Servers />
          </section>
          <Route exact path="/chat">
            <DefaultPage />
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
