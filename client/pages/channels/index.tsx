import React from "react";
import styles from "../../styles/channels/channels.module.css";
import { ChatPageLayout } from "../../components/layouts/ChatPageLayout/ChatPageLayout";

const ChannelsPage = () => {
  return (
    <div className={styles.container}>
      <ChatPageLayout />
    </div>
  );
};

export default ChannelsPage;
