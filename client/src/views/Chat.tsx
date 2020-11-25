import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import NewServer from "../components/NewServer";
import ServerLogo, { CreateNewServerButton } from "../components/ServerLogo";
import ServerName from "../components/ServerName";
import { API_ENDPOINT } from "../constants";
import UserContext from "../context/UserContext";
import { User } from "../types";

const ChatPage = () => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [showNewServerOverlay, setShowNewServerOverlay] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState<User | null>(null);
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
      if (!authenticate.ok) {
        history.push("/");
      }
      const { user } = await authenticate.json();
      setUser(user);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {showNewServerOverlay && (
        <NewServer closeOverlay={() => setShowNewServerOverlay(false)} />
      )}
      <div className="h-full flex">
        <section className="hide-scrollbar bg-red-400 w-24 h-screen overflow-auto">
          {[...Array(10)].map((_, id) => (
            <ServerLogo src="https://i.kym-cdn.com/entries/icons/mobile/000/026/489/crying.jpg" />
          ))}
          <CreateNewServerButton
            toggleNewServerOverlay={() =>
              setShowNewServerOverlay((prev) => !prev)
            }
          />
        </section>
        <section className="bg-red-900 w-1/3 h-full">
          <ul className="h-screen overflow-auto">
            {[...Array(100)].map((_, id) => (
              <li key={id}>
                <ServerName>Bruh</ServerName>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-blue-400 w-full grid grid-rows-2">
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
        <section className="bg-blue-800 w-1/3 h-screen overflow-auto">
          <h1>Members</h1>
          <ul>
            {[...Array(100)].map((_, i) => (
              <h1>Username</h1>
            ))}
          </ul>
        </section>
      </div>
    </UserContext.Provider>
  );
};
export default ChatPage;
