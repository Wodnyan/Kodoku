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
      className="flex w-full p-3 bg-gray-900 text-white hover:bg-black"
    >
      <span className="inline">
        <img src={icon} alt="icon" />
      </span>
      <span className="inline text-center flex-1">{children}</span>
    </button>
  );
};
export default OAuthButton;
