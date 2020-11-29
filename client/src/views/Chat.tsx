import React, { useEffect, useState } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { getAllServers } from "../api/server";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import NewServer from "../components/NewServer";
import ServerLogo, { CreateNewServerButton } from "../components/ServerLogo";
import Rooms from "../components/Rooms";
import { API_ENDPOINT } from "../constants";
import UserContext from "../context/UserContext";
import { Server, User } from "../types";
import Members from "../components/Members";

const ChatPage = () => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [showNewServerOverlay, setShowNewServerOverlay] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [servers, setServers] = useState<[] | Server[]>([]);

  const history = useHistory();

  useEffect(() => {
    const socketio = io("/");
    setSocket(socketio);
    socketio.on("connect", (socket: Socket) => {
      console.log("Connected");
    });
    socketio.on("message", (message: any) => {
      console.log(message);
    });
    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget[0] as HTMLInputElement;
    console.log(target.value);
    socket?.emit("message", {
      sender: "Anon",
      body: target.value,
    });
    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
              <section className="bg-blue-400 w-8/12 grid grid-rows-2">
                <div className="row-span-2">
                  <Chat />
                </div>
                <form onSubmit={handleSubmit} className="bg-blue-600">
                  <ChatInput
                    value={inputValue}
                    onChange={(e) => handleInputChange(e)}
                  />
                </form>
              </section>
              <section className="bg-blue-800 w-1/6 h-screen overflow-auto">
                {/* <Members /> */}
              </section>
            </Route>
            <Route exact path="/chat/:serverId/:roomId">
              <section className="bg-red-900 w-1/3 h-full overflow-auto">
                {/* <Rooms rooms={[...Array(50)]} /> */}2
              </section>
              <section className="bg-blue-400 w-full grid grid-rows-2">
                {/* <div className="row-span-2">
                  <Chat />
                </div>
                <form onSubmit={handleSubmit} className="bg-blue-600">
                  <ChatInput
                    value={inputValue}
                    onChange={(e) => handleInputChange(e)}
                  />
                </form> */}
              </section>
              <section className="bg-blue-800 w-1/3 h-screen overflow-auto">
                {/* <Members /> */}
              </section>
            </Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
};
export default ChatPage;
