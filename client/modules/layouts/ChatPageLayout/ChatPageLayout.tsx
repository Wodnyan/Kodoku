import { ServerListSidePanel } from "../../ServerListSidePanel/ServerListSidePanel";
import styles from "./chat-page-layout.module.css";

interface Props {
  serverList?: React.ReactNode;
  roomList?: React.ReactNode;
  chat?: React.ReactNode;
  memberList?: React.ReactNode;
}

export const ChatPageLayout: React.FC<Props> = ({
  serverList = <ServerListSidePanel />,
  roomList,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.serverList}>{serverList}</div>
      <div className={styles.roomList}>{roomList || ""}</div>
      <div className={styles.chat}></div>
      <div className={styles.memberList}></div>
    </div>
  );
};