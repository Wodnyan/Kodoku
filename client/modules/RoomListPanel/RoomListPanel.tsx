import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useGetAllRoomsOfServer } from "../../hooks/http/rooms";
import { Room } from "../../types";
import styles from "./room-list-panel.module.css";
import { Avatar } from "../../components/Avatar/Avatar";
import { useAuth } from "../../context/auth/AuthProvider";
import { useRecoilState } from "recoil";
import { currentServerState } from "../../global-state/current-server";
import { Button } from "../../components/Button/Button";
import { CSSTransition } from "react-transition-group";
import { useClickOutside } from "../../hooks/useClickOutside";

export const RoomList = () => {
  const {
    query: { serverId },
  } = useRouter();
  const { user } = useAuth();
  const [rooms] = useGetAllRoomsOfServer(Number(serverId));
  const [currentServer] = useRecoilState(currentServerState);

  const [popout, setPopout] = useState(true);

  const closePopupBtnRef = useRef(null);

  const { ref } = useClickOutside(() => setPopout(false), closePopupBtnRef);

  function togglePopout() {
    setPopout((prev) => !prev);
  }

  return (
    <div className={styles.container}>
      <section className={styles.roomOptions}>
        <div>{currentServer.server?.name}</div>
        <CSSTransition
          in={popout}
          timeout={100}
          classNames={{
            enter: styles.popoutBtnEnter,
            enterDone: styles.popoutBtnEnterActive,
            exit: styles.popoutBtnExit,
            exitDone: styles.popoutBtnExitDone,
          }}
        >
          <button
            ref={closePopupBtnRef}
            className={styles.popoutBtn}
            onClick={togglePopout}
          >
            open
          </button>
        </CSSTransition>
        <CSSTransition
          unmountOnExit
          in={popout}
          timeout={200}
          classNames={{
            enter: styles.popoutEnter,
            enterActive: styles.popoutEnterActive,
            exit: styles.popoutExit,
            exitActive: styles.popoutExitActive,
          }}
        >
          <div ref={ref} className={styles.popout}>
            <Button full>Create Room</Button>
            <Button full>Create Invite</Button>
            <Button full>Leave Server</Button>
            <Button full>Server Options</Button>
          </div>
        </CSSTransition>
      </section>
      <section>
        {rooms.length === 0 && <p>No rooms</p>}
        <ul className={styles.roomList}>
          {(rooms as Room[]).map((room) => (
            <li key={room.id}>{room.name}</li>
          ))}
        </ul>
      </section>
      <section className={styles.userSection}>
        <div className={styles.userInfo}>
          <Avatar src={user?.avatar}>{user?.username[0]}</Avatar>
          <p>{user?.username}</p>
        </div>
        <div className={styles.userOptions}>
          <Avatar>S</Avatar>
        </div>
      </section>
    </div>
  );
};
