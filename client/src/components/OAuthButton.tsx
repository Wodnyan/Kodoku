import React from "react";

interface Props {
  children: React.ReactNode;
  location: string;
  icon?: string;
}

const OAuthButton: React.FC<Props> = ({ children, icon, location }) => {
  const onClick = async () => {
    window.open(location);
    window.close();
  };
  return (
    <button
      onClick={onClick}
      className="flex p-2 rounded bg-gray-900 text-white hover:bg-black"
    >
      <span>
        <img src={icon} alt="icon" />
      </span>
      <span>{children}</span>
    </button>
  );
};
export default OAuthButton;
