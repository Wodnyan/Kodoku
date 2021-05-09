import { Formik } from "formik";
import React, { useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { useCreateServer } from "../../hooks/http/servers";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Server } from "../../types";
import styles from "./new-server-popup.module.css";

type AddServer = (server: Server) => void;

type Props = {
  closePopup: () => void;
  addServer: AddServer;
};

type CreateNewServerProps = {
  goBack: () => void;
  addServer: AddServer;
};

enum CurrentPage {
  Default = "default",
  NewServer = "new",
  JoinServer = "join",
}

export const NewServerPopup: React.FC<Props> = ({ closePopup, addServer }) => {
  const { ref } = useClickOutside(closePopup);
  const [state, setState] = useState<CurrentPage>(CurrentPage.Default);

  let body = null;

  function handleClick() {
    closePopup();
  }

  switch (state) {
    case CurrentPage.Default:
      body = (
        <Default
          changeCurrentView={{
            joinServer: () => setState(CurrentPage.JoinServer),
            newServer: () => setState(CurrentPage.NewServer),
          }}
          closePopup={handleClick}
        />
      );
      break;
    case CurrentPage.NewServer:
      body = (
        <CreateNewServer
          addServer={addServer}
          goBack={() => setState(CurrentPage.Default)}
        />
      );
      break;
    case CurrentPage.JoinServer:
      body = (
        <JoinNewServer
          addServer={addServer}
          goBack={() => setState(CurrentPage.Default)}
        />
      );
      break;
  }

  return (
    <div ref={ref} className={styles.container}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={state}
          // @ts-ignore
          addEndListener={(button: HTMLElement, done: () => void) => {
            button.addEventListener("transitionend", done, false);
          }}
          classNames={{
            enter: styles.fadeEnter,
            exit: styles.fadeExit,
            enterActive: styles.fadeEnterActive,
            exitActive: styles.fadeExitActive,
          }}
        >
          <div>{body}</div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

type DefaultProps = {
  closePopup: () => void;
  changeCurrentView: {
    newServer: () => void;
    joinServer: () => void;
  };
};

const Default: React.FC<DefaultProps> = ({ changeCurrentView, closePopup }) => {
  return (
    <>
      <header>
        <h1>Add a Server</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam aut
        </p>
        <button onClick={() => closePopup()}>X</button>
      </header>
      <Button full onClick={() => changeCurrentView.newServer()}>
        Create new Server
      </Button>
      <Button full onClick={() => changeCurrentView.joinServer()}>
        Join a Server
      </Button>
    </>
  );
};

const CreateNewServer: React.FC<CreateNewServerProps> = ({
  goBack,
  addServer,
}) => {
  const [request, { error, isLoading }] = useCreateServer();
  return (
    <>
      <h1>Create new Server</h1>
      <Formik
        initialValues={{ name: "" }}
        onSubmit={async (values) => {
          const server = await request(values);
          if (server) {
            addServer(server);
          }
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Input
              onChange={handleChange}
              value={values.name}
              full
              placeholder="name"
              name="name"
            />
            {error.error && <h1>{error.error}</h1>}
            <Button isLoading={isLoading} type="submit">
              Create
            </Button>
          </form>
        )}
      </Formik>
      <button onClick={() => goBack()}>Go Back</button>
    </>
  );
};

const JoinNewServer: React.FC<CreateNewServerProps> = ({ goBack }) => {
  return (
    <>
      <h1>Join new Server</h1>
      <button onClick={() => goBack()}>Go Back</button>
    </>
  );
};
