import React, { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { API_ENDPOINT } from "../constants";
import UserContext from "../context/UserContext";

interface NewServerInputs {
  serverName: string;
  serverIcon: string;
}

interface NewServerProps {
  closeOverlay: () => void;
}

const NewServer: React.FC<NewServerProps> = ({ closeOverlay }) => {
  const ref = useRef<null | HTMLDivElement>(null);
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
      <NewServerForm />
    </div>
  );
};

export const NewServerForm = () => {
  const { register, handleSubmit, watch } = useForm<NewServerInputs>();
  const user = useContext(UserContext);

  const onSubmit = async (data: NewServerInputs) => {
    const payload = {
      name: data.serverName,
      icon: data.serverIcon,
      ownerId: user?.id,
    };
    const resp = await fetch(`${API_ENDPOINT}/server`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = await resp.json();
    console.log(body);
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
          ref={register({ required: true })}
        />
      </div>
      <button className="text-white">Submit</button>
    </form>
  );
};
export default NewServer;
