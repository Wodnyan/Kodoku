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
import { Formik } from "formik";
import { Popup } from "../../components/Popup/Popup";
import axios from "axios";
import { API_ENDPOINT } from "../../constants";
import { Input } from "../../components/Input/Input";

enum Popups {
  Create = "create",
  Invite = "invite",
}

export const RoomList = () => {
  const {
    query: { serverId },
  } = useRouter();
  const { user } = useAuth();
  const [currentServer, setCurrentServer] = useRecoilState(currentServerState);

  const [popout, setPopout] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState<Popups | null>(null);
  const [newRoomError, setNewRoomError] = useState<string>("");

  const closePopupBtnRef = useRef(null);

  const { ref } = useClickOutside(() => setPopout(false), closePopupBtnRef);

  function togglePopout() {
    setPopout((prev) => !prev);
  }

  let popup = null;

  switch (currentPopup) {
    case Popups.Create:
      popup = (
        <Formik
          initialValues={{
            roomName: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (values.roomName === "") {
                setNewRoomError("Room name is required");
                return;
              }
              const { data } = await axios.post(
                `${API_ENDPOINT}/servers/${serverId}/rooms`,
                {
                  name: values.roomName,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );
              resetForm();
              setCurrentServer((prev) => ({
                ...prev,
                rooms: [
                  ...prev.rooms,
                  {
                    id: data.room.id,
                    name: data.room.name,
                  },
                ],
              }));
            } catch (error) {
              setNewRoomError(error.response.data.message);
              console.error(error.response.data.message);
            }
          }}
        >
          {({ handleChange, handleSubmit, values }) => (
            <>
              <h1>Create a Room</h1>
              <form onSubmit={handleSubmit}>
                <Input
                  full
                  onChange={handleChange}
                  value={values.roomName}
                  name="roomName"
                  type="text"
                />
                <Button type="submit">Create</Button>
              </form>
              {newRoomError && <h1>{newRoomError}</h1>}
            </>
          )}
        </Formik>
      );
      break;

    case Popups.Invite:
      popup = (
        <>
          <h1>Create Invite Code</h1>
          <Formik
            initialValues={{
              inviteCode: "",
            }}
            onSubmit={async (values) => {
              try {
                const { data } = await axios.get(
                  `${API_ENDPOINT}/servers/${serverId}/invites`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accessToken"
                      )}`,
                    },
                  }
                );
                values.inviteCode = data.inviteCode;
              } catch (error) {
                console.error(error.response);
              }
            }}
          >
            {({ handleSubmit, handleChange, values }) => (
              <form onSubmit={handleSubmit}>
                <Input
                  full
                  onChange={handleChange}
                  value={values.inviteCode}
                  name="inviteCode"
                  placeholder="Invite Code"
                  readOnly
                />
                <Button type="submit">Create Code</Button>
              </form>
            )}
          </Formik>
        </>
      );
      break;
  }

  return (
    <div className={styles.container}>
      {showPopup && (
        <Popup closeOnClickOutside closeFn={() => setShowPopup(false)}>
          <button onClick={() => setShowPopup(false)}>X</button>
          {popup}
        </Popup>
      )}
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
            <Button
              onClick={() => {
                setPopout(false);
                setShowPopup(true);
                setCurrentPopup(Popups.Create);
              }}
              full
            >
              Create Room
            </Button>
            <Button
              onClick={() => {
                setPopout(false);
                setShowPopup(true);
                setCurrentPopup(Popups.Invite);
              }}
              full
            >
              Create Invite
            </Button>
            <Button full>Leave Server</Button>
            <Button full>Server Options</Button>
          </div>
        </CSSTransition>
      </section>
      <section>
        {currentServer.rooms.length === 0 && <p>No rooms</p>}
        <ul className={styles.roomList}>
          {(currentServer.rooms as Room[]).map((room) => (
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
