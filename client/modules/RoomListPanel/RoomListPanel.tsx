import React from "react";
import { useRecoilState } from "recoil";
import { useAuth } from "../../context/auth/AuthProvider";
import { currentServerState } from "../../global-state/current-server";
import styles from "./room-list-panel.module.css";
import { RoomListSection } from "./sections/RoomListSection";
import { ServerOptionsSection } from "./sections/ServerOptionsSection";
import { UserInfoSection } from "./sections/UserInfoSection";

export const RoomListPanel = () => {
  const { user } = useAuth();
  const [currentServer] = useRecoilState(currentServerState);

  return (
    <div className={styles.container}>
      <ServerOptionsSection server={currentServer.server} />
      <RoomListSection rooms={currentServer.rooms} />
      {user && <UserInfoSection user={user} />}
    </div>
  );
};
