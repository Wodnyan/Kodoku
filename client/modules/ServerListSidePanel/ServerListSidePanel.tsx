import React, { useEffect, useState } from "react";
import { Avatar } from "../../components/Avatar/Avatar";
import { Server } from "../../types";
import styles from "./server-list-side-panel.module.css";
import NextLink from "next/link";
import { useGetAllServers } from "../../hooks/http/servers";
import { NewServerPopup } from "../NewServerPopup/NewServerPopup";

export const ServerListSidePanel: React.FC = () => {
  const [servers] = useGetAllServers();
  const [serverList, setServerList] = useState<Server[] | []>([]);
  const [newServerPopup, setNewserverPopup] = useState(false);

  function toggleCreateServerPopup() {
    setNewserverPopup((prev) => !prev);
  }

  function addToServerList(server: Server) {
    setServerList((prev) => [...prev, server]);
  }

  useEffect(() => {
    setServerList(servers);
  }, [servers]);

  return (
    <div className={styles.container}>
      {newServerPopup && (
        <NewServerPopup
          addServer={addToServerList}
          closePopup={toggleCreateServerPopup}
        />
      )}
      <nav>
        <ul>
          <li onClick={toggleCreateServerPopup} className={styles.navListItem}>
            <button
              aria-label="Create server"
              className={styles.createServerButton}
            >
              <Avatar>
                <h1>+</h1>
              </Avatar>
            </button>
          </li>
          {(serverList as Server[]).map((server) => {
            return (
              <li key={server.id} className={styles.navListItem}>
                <NextLink href={`/channels/${server.id}`}>
                  <a>
                    <Avatar src={server.icon}></Avatar>
                  </a>
                </NextLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
