import React from "react";
import { Link } from "react-router-dom";

interface ServerLogoProps {
  logoSrc: string;
  id: number;
}

interface CreateNewServerButtonProps {
  toggleNewServerOverlay: () => void;
}

export const CreateNewServerButton: React.FC<CreateNewServerButtonProps> = ({
  toggleNewServerOverlay,
}) => {
  return (
    <button
      onClick={toggleNewServerOverlay}
      className="btn--circular bg-blue-400 flex justify-center items-center"
    >
      <svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  );
};

const ServerLogo: React.FC<ServerLogoProps> = React.memo(({ logoSrc, id }) => {
  return (
    <Link to={`/chat/${id}`}>
      <img
        className="object-cover btn--circular"
        src={logoSrc}
        alt="Server logo"
      />
    </Link>
  );
});
export default ServerLogo;
