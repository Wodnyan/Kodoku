import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { ChatPageLayout } from "../../../../components/layouts/ChatPageLayout/ChatPageLayout";
import { API_ENDPOINT } from "../../../../constants";
import { currentServerState } from "../../../../global-state/current-server";
import { useGetAllRoomsOfServer } from "../../../../hooks/http/rooms";
import { Chat } from "../../../../modules/Chat/Chat";
import { MemberListPanel } from "../../../../modules/MemberListPanel/MemberListPanel";
import { RoomListPanel } from "../../../../modules/RoomListPanel/RoomListPanel";
import styles from "../../../../styles/channels/channels.module.css";

const PageWithChat = () => {
  const {
    query: { serverId },
  } = useRouter();
  const [, setCurrentServer] = useRecoilState(currentServerState);
  const [rooms] = useGetAllRoomsOfServer(Number(serverId));

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
        chat={<Chat />}
        roomList={<RoomListPanel />}
      />
    </div>
  );
};

export default PageWithChat;
