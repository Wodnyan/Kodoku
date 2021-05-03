import React from "react";
import { Avatar } from "../../components/Avatar/Avatar";
import { Server } from "../../types";
import styles from "./server-list-side-panel.module.css";
import NextLink from "next/link";
import { useGetAllServers } from "../../hooks/http/servers";

export const ServerListSidePanel: React.FC = () => {
  const [servers] = useGetAllServers();
  return (
    <div className={styles.container}>
      <nav>
        <ul>
          {(servers as Server[]).map((server) => {
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
