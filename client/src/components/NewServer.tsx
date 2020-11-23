import React from "react";
import { useForm } from "react-hook-form";

const NewServer = () => {
  return (
    <div className="absolute flex flex-col justify-center items-center h-full w-full bg-black bg-opacity-50">
      <NewServerForm />
    </div>
  );
};

interface NewServerInputs {
  serverName: string;
  iconUrl: string;
}

export const NewServerForm = () => {
  const { register, handleSubmit, watch } = useForm<NewServerInputs>();

  const onSubmit = (data: NewServerInputs) => {
    console.log(data);
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
        <label htmlFor="serverUrl" className="text-white">
          Server Icon URL
        </label>
        <input
          className="input"
          name="serverUrl"
          id="serverUrl"
          type="text"
          ref={register({ required: true })}
        />
      </div>
      <button className="text-white">Submit</button>
    </form>
  );
};
export default NewServer;
