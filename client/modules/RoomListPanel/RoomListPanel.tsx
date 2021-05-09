import React from "react";
import { useRouter } from "next/router";
import { useGetAllRoomsOfServer } from "../../hooks/http/rooms";
import { Room } from "../../types";
import styles from "./room-list-panel.module.css";
import { Avatar } from "../../components/Avatar/Avatar";
import { useAuth } from "../../context/auth/AuthProvider";
import { useRecoilState } from "recoil";
import { currentServerState } from "../../global-state/current-server";

export const RoomList = () => {
  const {
    query: { serverId },
  } = useRouter();
  const [rooms] = useGetAllRoomsOfServer(Number(serverId));
  const [currentServer] = useRecoilState(currentServerState);
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <section>{currentServer.server?.name}</section>
      <section>
        {rooms.length === 0 && <p>No rooms</p>}
        <ul className={styles.roomList}>
          {(rooms as Room[]).map((room) => (
            <li key={room.id}>{room.name}</li>
          ))}
        </ul>
      </section>
      {/* Make this a component */}
      <section className={styles.userSection}>
        <div className={styles.userInfo}>
          <Avatar src={user.avatar}>{user.username[0]}</Avatar>
          <p>{user.username}</p>
        </div>
        <div className={styles.userOptions}>
          <Avatar>S</Avatar>
        </div>
      </section>
    </div>
  );
};
