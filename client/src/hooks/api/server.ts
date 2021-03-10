import { useEffect, useState } from "react";
import { getAllServersOfUser } from "../../api/server";
import { Server } from "../../types";

export const useServer = (userId?: number) => {
  const [servers, setServers] = useState<Server[] | []>([]);

  useEffect(() => {
    if (userId) {
      getAllServersOfUser(userId)
        .then(({ servers }) => {
          setServers(servers);
        })
        .catch(console.log);
    }
  }, [userId]);

  return {
    servers,
    setServers,
  };
};
