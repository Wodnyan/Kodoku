import React from "react";
import { Avatar } from "../../components/Avatar/Avatar";
import { Server } from "../../types";
import styles from "./server-list-side-panel.module.css";

interface Props {
  servers: Server[] | [];
}

export const ServerListSidePanel: React.FC<Props> = ({ servers }) => {
  return (
    <div className={styles.container}>
      <nav>
        <ul>
          {(servers as Server[]).map((server) => {
            return (
              <li key={server.id} className={styles.navListItem}>
                <Avatar src={server.icon}></Avatar>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
