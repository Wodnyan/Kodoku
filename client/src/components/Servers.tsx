import React, { useEffect, useState, useContext } from "react";
import { getAllServers } from "../api/server";
import UserContext from "../context/UserContext";
import { Server } from "../types";
import NewServer from "./NewServer";
import ServerLogo, { CreateNewServerButton } from "./ServerLogo";

const Servers = React.memo(() => {
  const [servers, setServers] = useState<Server[] | []>([]);
  const [popup, setPopup] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    // if (user) {
    //   getAllServers(user?.id)
    //     .then((res) => res.json())
    //     .then((res) => {
    //       setServers(res.servers);
    //     });
    // }
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
      {(servers as Server[]).map((server) => (
        <ServerLogo logoSrc={server.icon} id={server.id} key={server.id} />
      ))}
      <CreateNewServerButton toggleNewServerOverlay={() => setPopup(true)} />
    </>
  );
});

export default Servers;
