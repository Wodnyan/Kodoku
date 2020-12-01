import React, { useEffect, useState, useContext } from "react";
import { getAllServers } from "../api/server";
import UserContext from "../context/UserContext";
import { Server } from "../types";
import NewServer from "./NewServer";
import ServerLogo, { CreateNewServerButton } from "./ServerLogo";

const Servers = () => {
  const [servers, setServers] = useState<Server[] | []>([]);
  const [popup, setPopup] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    getAllServers(user?.id)
      .then((res) => res.json())
      .then((res) => setServers(res.servers));
  }, [user]);

  return (
    <>
      {popup && (
        <NewServer
          closeOverlay={() => setPopup(false)}
          addServer={(server: Server) =>
            setServers((prev) => [...prev, server])
          }
        />
      )}
      {(servers as Server[]).map((server) => {
        return (
          <ServerLogo logoSrc={server.icon} key={server.id} id={server.id} />
        );
      })}
      <CreateNewServerButton toggleNewServerOverlay={() => setPopup(true)} />
    </>
  );
};

export default Servers;
