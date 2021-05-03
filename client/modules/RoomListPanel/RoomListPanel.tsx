import React from "react";
import { useRouter } from "next/router";
import { useGetAllRoomsOfServer } from "../../hooks/http/rooms";
import { Room } from "../../types";
import styles from "./room-list-panel.module.css";

export const RoomList = () => {
  const {
    query: { serverId },
  } = useRouter();
  const [rooms] = useGetAllRoomsOfServer(Number(serverId));

  console.log(rooms);

  return (
    <>
      <ul className={styles.roomList}>
        {(rooms as Room[]).map((room) => (
          <li>{room.name}</li>
        ))}
      </ul>
    </>
  );
};
