import React, { useEffect } from "react";
import styles from "../../../styles/channels/channels.module.css";
import { ChatPageLayout } from "../../../modules/layouts/ChatPageLayout/ChatPageLayout";
import { RoomList } from "../../../modules/RoomListPanel/RoomListPanel";
import axios from "axios";
import { API_ENDPOINT } from "../../../constants";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { currentServerState } from "../../../global-state/current-server";

const PageWithRooms = () => {
  const router = useRouter();
  const [, setCurrentServer] = useRecoilState(currentServerState);

  // Get current server
  useEffect(() => {
    (async () => {
      try {
        if (router.query.serverId) {
          const { data } = await axios.get(
            `${API_ENDPOINT}/servers/${router.query.serverId}`
          );
          setCurrentServer({
            server: data.server,
          });
        }
      } catch (error) {
        console.error(error.response.data);
      }
    })();
  }, [router.query.serverId]);

  return (
    <div className={styles.container}>
      <ChatPageLayout roomList={<RoomList />} />
    </div>
  );
};

export default PageWithRooms;
