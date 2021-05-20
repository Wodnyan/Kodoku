import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocketio = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5050");
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};
