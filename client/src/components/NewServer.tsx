import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { API_ENDPOINT } from "../constants";
import UserContext from "../context/UserContext";
import { Server } from "../types";

interface NewServerInputs {
  serverName: string;
  serverIcon: string;
}
interface JoinServerInput {
  serverInviteCode: string;
}

interface NewServerFormProps {
  addServer: (payload: Server) => void;
}

interface NewServerProps {
  closeOverlay: () => void;
  addServer: (payload: Server) => void;
}

enum CurrentFormState {
  Create = 0,
  Join = 1,
}

const NewServer: React.FC<NewServerProps> = ({ closeOverlay, addServer }) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [currentForm, setCurrentForm] = useState<
    CurrentFormState.Create | CurrentFormState.Join
  >(CurrentFormState.Create);
  useEffect(() => {
    const handle = (e: any) => {
      if (ref.current && e.target === ref.current) {
        closeOverlay();
      }
    };
    document.addEventListener("click", handle);
    return () => {
      document.removeEventListener("click", handle);
    };
  }, [closeOverlay]);

  return (
    <div
      ref={ref}
      className="absolute flex flex-col justify-center items-center h-full w-full bg-black bg-opacity-50"
    >
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
        <JoinServerForm />
      )}
    </div>
  );
};

export const JoinServerForm = () => {
  const { register, handleSubmit, watch } = useForm<JoinServerInput>();
  const user = useContext(UserContext);

  const onSubmit = async (data: NewServerInputs) => {
    console.log(data);
  };

  return (
    <form className="w-1/3" onSubmit={handleSubmit(onSubmit)}>
      <img src={String(watch("serverUrl"))} alt="" />
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
  const { register, handleSubmit, watch } = useForm<NewServerInputs>();
  const user = useContext(UserContext);

  const onSubmit = async (data: NewServerInputs) => {
    const payload = {
      name: data.serverName,
      icon: data.serverIcon === "" ? undefined : data.serverIcon,
      ownerId: user?.id,
    };
    const resp = await fetch(`${API_ENDPOINT}/server`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const { newServer } = await resp.json();
    addServer({
      id: newServer.id,
      icon: newServer.icon,
      name: newServer.name,
    });
    console.log(newServer);
  };

  return (
    <form className="w-1/3" onSubmit={handleSubmit(onSubmit)}>
      <img src={String(watch("serverUrl"))} alt="" />
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
      <div className="w-full">
        <label htmlFor="serverIcon" className="text-white">
          Server Icon URL
        </label>
        <input
          className="input"
          name="serverIcon"
          id="serverIcon"
          type="text"
          ref={register()}
        />
      </div>
      <button className="text-white">Submit</button>
    </form>
  );
};
export default NewServer;
