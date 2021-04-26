import React, { useState } from "react";
import { Settings } from "../settings/Settings";

interface UserCardProps {
  username?: string;
  avatarUrl?: string | null;
}

const DEFAULT_AVATAR_URL =
  "https://www.minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg";

const UserCard = ({ username, avatarUrl }: UserCardProps) => {
  const [openSetting, setOpenSettings] = useState(false);

  const handleClick = () => {
    setOpenSettings(true);
  };

  return (
    <div className="p-4 flex justify-between bg-blue-400">
      {openSetting && <Settings closeSettings={() => setOpenSettings(false)} />}
      <div className="flex items-center">
        <img
          src={avatarUrl || DEFAULT_AVATAR_URL}
          alt="avatar"
          className="rounded-full h-12 w-12 mr-2"
        />
        <h1 className="text-xl">{username}</h1>
      </div>
      <button onClick={handleClick}>
        <img alt="settings" className="w-5 h-5" src="/gear-option.svg" />
      </button>
    </div>
  );
};
export default UserCard;
