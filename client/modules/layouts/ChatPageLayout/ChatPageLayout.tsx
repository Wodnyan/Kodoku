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
      <div>{serverList}</div>
      <div style={{ background: "blue" }} className="">
        {roomList || ""}
      </div>
      <div style={{ background: "purple" }} className=""></div>
      <div style={{ background: "yellow" }} className=""></div>
    </div>
  );
};
