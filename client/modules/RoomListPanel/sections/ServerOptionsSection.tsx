import axios from "axios";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useRecoilState } from "recoil";
import { Button } from "../../../components/Button/Button";
import { Input } from "../../../components/Input/Input";
import { Popup } from "../../../components/Popup/Popup";
import { API_ENDPOINT } from "../../../constants";
import { useAuth } from "../../../context/auth/AuthProvider";
import { currentServerState } from "../../../global-state/current-server";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { Server } from "../../../types";
import styles from "../room-list-panel.module.css";

enum Popups {
  Create = "create",
  Invite = "invite",
}

export const ServerOptionsSection: React.FC<{ server?: Server }> = ({
  server,
}) => {
  const router = useRouter();
  const [popout, setPopout] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState<Popups | null>(null);
  const [currentServer, setCurrentServer] = useRecoilState(currentServerState);
  const { user } = useAuth();

  const closePopupBtnRef = useRef(null);

  const { ref } = useClickOutside(() => setPopout(false), closePopupBtnRef);

  function togglePopout() {
    setPopout((prev) => !prev);
  }

  let popup = null;

  switch (currentPopup) {
    case Popups.Create:
      popup = <CreateRoomPopupView />;
      break;
    case Popups.Invite:
      popup = <CreateInvitePopupView />;
      break;
  }

  async function leaveServer() {
    if (!currentServer.server.id || !user.id) {
      return;
    }
    try {
      await axios.delete(
        `${API_ENDPOINT}/servers/${currentServer.server.id}/members/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setCurrentServer((prev) => ({
        ...prev,
        rooms: prev.rooms.filter((room) => room.id !== currentServer.server.id),
      }));
      router.push("/channels");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {showPopup && (
        <Popup closeOnClickOutside closeFn={() => setShowPopup(false)}>
          <button onClick={() => setShowPopup(false)}>X</button>
          {popup}
        </Popup>
      )}
      <section className={styles.roomOptions}>
        <div>{server?.name}</div>
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
            <Button full onClick={leaveServer}>
              Leave Server
            </Button>
            <Button full>Server Options</Button>
          </div>
        </CSSTransition>
      </section>
    </>
  );
};

const CreateInvitePopupView = () => {
  const {
    query: { serverId },
  } = useRouter();
  return (
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
};

const CreateRoomPopupView = () => {
  const [, setCurrentServer] = useRecoilState(currentServerState);
  const [newRoomError, setNewRoomError] = useState<string>("");
  const {
    query: { serverId },
  } = useRouter();

  return (
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
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
};
