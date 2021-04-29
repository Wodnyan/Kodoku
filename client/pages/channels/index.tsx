import React from "react";
import styles from "../../styles/channels/channels.module.css";
import { ServerListSidePanel } from "../../modules/ServerListSidePanel/ServerListSidePanel";
import { useGetAllServers } from "../../hooks/http/servers";

const ChannelsPage = () => {
  const [servers, { isLoading }] = useGetAllServers();
  return (
    <div className={styles.container}>
      <div>
        <ServerListSidePanel servers={servers} />
      </div>
      <div style={{ background: "blue" }} className=""></div>
      <div style={{ background: "purple" }} className=""></div>
      <div style={{ background: "yellow" }} className=""></div>
    </div>
  );
};

export default ChannelsPage;
