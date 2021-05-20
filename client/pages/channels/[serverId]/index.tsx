import React, { useEffect } from "react";
import styles from "../../../styles/channels/channels.module.css";
import { ChatPageLayout } from "../../../components/layouts/ChatPageLayout/ChatPageLayout";
import { RoomListPanel } from "../../../modules/RoomListPanel/RoomListPanel";
import axios from "axios";
import { API_ENDPOINT } from "../../../constants";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { currentServerState } from "../../../global-state/current-server";
import { useGetAllRoomsOfServer } from "../../../hooks/http/rooms";
import { useAuth } from "../../../context/auth/AuthProvider";
import { MemberListPanel } from "../../../modules/MemberListPanel/MemberListPanel";

const PageWithRooms = () => {
  const {
    query: { serverId },
  } = useRouter();
  const [, setCurrentServer] = useRecoilState(currentServerState);
  const [rooms] = useGetAllRoomsOfServer(Number(serverId));
  const {} = useAuth({
    redirectTo: "/",
  });

  // Set rooms in global state
  useEffect(() => {
    setCurrentServer((prev) => ({
      ...prev,
      rooms: rooms.map((room: { id: number; name: string }) => ({
        id: room.id,
        name: room.name,
      })),
    }));
  }, [serverId, JSON.stringify(rooms)]);

  // Get current server
  useEffect(() => {
    (async () => {
      try {
        if (serverId) {
          const { data } = await axios.get(
            `${API_ENDPOINT}/servers/${serverId}`
          );
          setCurrentServer((prev) => ({
            ...prev,
            server: data.server,
          }));
        }
      } catch (error) {
        console.error(error.response.data);
      }
    })();
  }, [serverId]);

  return (
    <div className={styles.container}>
      <ChatPageLayout
        memberList={<MemberListPanel />}
        roomList={<RoomListPanel />}
      />
    </div>
  );
};

export default PageWithRooms;
