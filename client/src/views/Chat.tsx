import React, { useEffect, useState } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Chat from "../components/Chat";
import Rooms from "../components/Rooms";
import { API_ENDPOINT } from "../constants";
import UserContext from "../context/UserContext";
import { User } from "../types";
import Members from "../components/Members";
import Servers from "../components/Servers";

const ChatPage = () => {
  const [user, setUser] = useState<User | null>(null);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const authenticate = await fetch(`${API_ENDPOINT}/users`, {
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
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Router>
        <div className="relative h-full flex">
          <section className="hide-scrollbar bg-gray-800 w-16 h-screen overflow-auto">
            <Servers />
          </section>
          <Switch>
            <Route exact path="/chat">
              <section className="bg-blue-800 w-full h-screen overflow-auto flex justify-center items-center">
                <h1 className="text-4xl text-blue-900">Welcome to KODOKU</h1>
              </section>
            </Route>
            <Route exact path="/chat/:serverId">
              <section className="bg-gray-700 w-1/5 h-screen">
                <Rooms />
              </section>
              <section className="w-8/12 bg-gray-600"></section>
              <section className="bg-gray-700 w-1/6 h-screen overflow-auto">
                <Members />
              </section>
            </Route>
            <Route exact path="/chat/:serverId/:roomId">
              <section className="bg-gray-700 w-1/5 h-screen">
                <Rooms />
              </section>
              <section className="w-8/12 bg-gray-600">
                <Chat />
              </section>
              <section className="bg-gray-700 w-1/6 h-screen overflow-auto">
                <Members />
              </section>
            </Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
};
export default ChatPage;
