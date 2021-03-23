import React from "react";
import { useHistory } from "react-router-dom";
import { logOut } from "../../api/auth";
import useCloseOnClick from "../../hooks/close-on-click";
import { AccordionItem } from "../accordion/Accordion";

interface SettingsProps {
  closeSettings: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ closeSettings }) => {
  const ref = useCloseOnClick(closeSettings);
  return (
    <div
      ref={ref}
      className="absolute overflow-auto top-0 left-0 z-50 w-full h-full bg-black bg-opacity-75 text-white"
    >
      <button
        onClick={closeSettings}
        className="absolute text-white top-8 right-8"
      >
        <img src="/close.svg" width={36} />
      </button>
      <Accordion />
    </div>
  );
};

const Accordion = () => {
  return (
    <div className="mt-4 w-1/2 mx-auto">
      <AccordionItem name="User">
        <UserSettings />
      </AccordionItem>
    </div>
  );
};

const UserSettings = () => {
  const handleClick = async () => {
    try {
      await logOut();
      window.location.replace("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>User Settings go here</h1>
      <button onClick={handleClick}>Log Out!</button>
    </>
  );
};
