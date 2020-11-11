import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ENDPOINT } from "../constants";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";

const ChatPage = () => {
  const [foo, setFoo] = useState<null | Socket>(null);
  // foo?.emit("bruh");
  useEffect(() => {
    fetch(`${ENDPOINT}/api/v1`)
      .then((res) => res.json())
      .then((res) => console.log(res));
    const socket = io(ENDPOINT);
    setFoo(socket);
    socket.on("connect", (socket: Socket) => {
      console.log("Connected");
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <div className="h-full flex">
        <section className="bg-red-400 w-24 h-full"></section>
        <section className="bg-red-900 w-1/3 h-full"></section>
        <section className="bg-blue-400 w-full grid grid-rows-2">
          <div className="row-span-2">
            <Chat />
          </div>
          <form className="bg-blue-600">
            <ChatInput />
          </form>
        </section>
        <section className="bg-blue-800 w-1/3 h-full"></section>
      </div>
    </>
  );
};
export default ChatPage;
