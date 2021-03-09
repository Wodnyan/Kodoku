import React, { useEffect, useState, useContext } from "react";
// import { getAllServers } from "../api/server";
import UserContext from "../context/UserContext";
// import { Server } from "../types";
import NewServer from "./NewServer";
import ServerLogo, { CreateNewServerButton } from "./ServerLogo";
import { useServer } from "../hooks/api/server";
import { Server } from "../types";

const Servers = React.memo(() => {
  const [popup, setPopup] = useState(false);
  const user = useContext(UserContext);
  const { servers, setServers } = useServer(user?.id);

  return (
    <>
      {popup && (
        <NewServer
          closeOverlay={() => setPopup(false)}
          addServer={(server) => setServers((prev) => [server, ...prev])}
        />
      )}
      {(servers as Server[]).map((server) => (
        <ServerLogo id={server.id} logoSrc={server.icon} key={server.id} />
      ))}
      <CreateNewServerButton toggleNewServerOverlay={() => setPopup(true)} />
    </>
  );
});

export default Servers;
