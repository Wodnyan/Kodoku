import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import UserContext from "../context/UserContext";
import useCloseOnClick from "../hooks/close-on-click";
import { Server } from "../types";
import { createServer } from "../api/server";
import { joinServer } from "../api/members";

interface NewServerInputs {
  serverName: string;
}

interface JoinServerInput {
  inviteCode: string;
}

interface NewServerFormProps {
  addServer: (payload: Server) => void;
}

interface NewServerProps {
  closeOverlay: () => void;
  addServer: (payload: Server) => void;
}

interface JoinServerFormProps {
  addServer: (payload: Server) => void;
}

enum CurrentFormState {
  Create = 0,
  Join = 1,
}

const NewServer: React.FC<NewServerProps> = ({ closeOverlay, addServer }) => {
  const ref = useCloseOnClick(closeOverlay);
  const [currentForm, setCurrentForm] = useState<
    CurrentFormState.Create | CurrentFormState.Join
  >(CurrentFormState.Create);

  return (
    <div ref={ref} className="simple-popup-container-full">
      <div className="cursor-pointer">
        <span
          onClick={() => setCurrentForm(CurrentFormState.Create)}
          className={`text-white text-4xl ${
            currentForm === CurrentFormState.Create
              ? "text-opacity-100"
              : "text-opacity-50"
          }`}
        >
          Create
        </span>
        <span className="text-white text-4xl">/</span>
        <span
          onClick={() => setCurrentForm(CurrentFormState.Join)}
          className={`text-white text-4xl ${
            currentForm === CurrentFormState.Join
              ? "text-opacity-100"
              : "text-opacity-50"
          }`}
        >
          Join
        </span>
      </div>
      {currentForm === CurrentFormState.Create ? (
        <NewServerForm addServer={addServer} />
      ) : (
        <JoinServerForm addServer={addServer} />
      )}
    </div>
  );
};

export const JoinServerForm: React.FC<JoinServerFormProps> = ({
  addServer,
}) => {
  const { register, handleSubmit } = useForm<JoinServerInput>();
  const user = useContext(UserContext);

  const onSubmit = async ({ inviteCode }: JoinServerInput) => {
    if (user) {
      const member = await joinServer(inviteCode, user.id, 2);
    }
  };

  return (
    <form className="w-1/3" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full">
        <label htmlFor="inviteCode" className="text-white">
          Invite Code
        </label>
        <input
          className="input"
          name="inviteCode"
          id="inviteCode"
          type="text"
          ref={register({ required: true })}
        />
      </div>
      <button className="text-white">Submit</button>
    </form>
  );
};

export const NewServerForm: React.FC<NewServerFormProps> = ({ addServer }) => {
  const { register, handleSubmit } = useForm<NewServerInputs>();
  const user = useContext(UserContext);

  const onSubmit = async (data: NewServerInputs) => {
    try {
      const { newServer } = await createServer({
        ownerId: user!.id!,
        name: data.serverName,
      });
      addServer({
        name: newServer.name,
        id: newServer.id,
        icon: newServer.icon,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="w-1/3" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full">
        <label htmlFor="serverName" className="text-white">
          Server Name
        </label>
        <input
          className="input"
          name="serverName"
          id="serverName"
          type="text"
          ref={register({ required: true })}
        />
      </div>
      <button className="text-white">Submit</button>
    </form>
  );
};
export default NewServer;
