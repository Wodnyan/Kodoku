import React from "react";
import styles from "../../../styles/channels/channels.module.css";
import { ChatPageLayout } from "../../../modules/layouts/ChatPageLayout/ChatPageLayout";
import { RoomList } from "../../../modules/RoomListPanel/RoomListPanel";

const PageWithRooms = () => {
  return (
    <div className={styles.container}>
      <ChatPageLayout roomList={<RoomList />} />
    </div>
  );
};

export default PageWithRooms;
