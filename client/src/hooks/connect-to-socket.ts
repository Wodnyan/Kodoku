import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(path: string) {
  const [socket, setSocket] = useState<null | Socket>(null);
  useEffect(() => {
    setSocket(
      io(path, {
        withCredentials: true,
      })
    );
    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return socket;
}
