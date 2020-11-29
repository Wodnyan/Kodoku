import React, { useEffect, useState } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { getAllServers } from "../api/server";
import Chat from "../components/Chat";
import NewServer from "../components/NewServer";
import ServerLogo, { CreateNewServerButton } from "../components/ServerLogo";
import Rooms from "../components/Rooms";
import { API_ENDPOINT } from "../constants";
import UserContext from "../context/UserContext";
import { Server, User } from "../types";
import Members from "../components/Members";

const ChatPage = () => {
  const [showNewServerOverlay, setShowNewServerOverlay] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [servers, setServers] = useState<[] | Server[]>([]);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const authenticate = await fetch(`${API_ENDPOINT}/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": "true",
        },
      });
      if (authenticate.status === 401) {
        return history.push("/");
      }
      const { user } = await authenticate.json();
      setUser(user);
      const servers = await getAllServers(user.id);
      setServers(servers);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewServer = (payload: Server) => {
    setServers((prev) => [...prev, payload]);
  };

  return (
    <UserContext.Provider value={user}>
      <Router>
        {showNewServerOverlay && (
          <NewServer
            closeOverlay={() => setShowNewServerOverlay(false)}
            addServer={addNewServer}
          />
        )}
        <div className="relative h-full flex">
          <section className="hide-scrollbar bg-red-400 w-16 h-screen overflow-auto">
            {(servers as Server[]).map((server) => {
              return (
                <ServerLogo
                  logoSrc={server.icon}
                  key={server.id}
                  id={server.id}
                />
              );
            })}
            <CreateNewServerButton
              toggleNewServerOverlay={() =>
                setShowNewServerOverlay((prev) => !prev)
              }
            />
          </section>
          <Switch>
            <Route exact path="/chat">
              <section className="bg-blue-800 w-full h-screen overflow-auto flex justify-center items-center">
                <h1 className="text-4xl text-blue-900">Welcome to KODOKU</h1>
              </section>
            </Route>
            <Route exact path="/chat/:serverId">
              <section className="bg-red-900 w-1/5 h-full overflow-auto">
                <Rooms rooms={[...Array(50)]} />
              </section>
              <section className="bg-blue-400 w-8/12 ">
                <Chat />
              </section>
              <section className="bg-blue-800 w-1/6 h-screen overflow-auto">
                {/* <Members /> */}
              </section>
            </Route>
            <Route exact path="/chat/:serverId/:roomId"></Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
};
export default ChatPage;
