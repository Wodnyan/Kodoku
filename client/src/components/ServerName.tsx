import React from "react";

interface ServerNameProps {
  children: React.ReactNode;
}

const ServerName: React.FC<ServerNameProps> = ({ children }) => {
  return (
    <div className="cursor-pointer mb-3 mt-1 hover:bg-red-500 p-1 w-11/12 mx-auto rounded transition-colors duration-100 ease">
      <span>#</span>
      <span>{children}</span>
    </div>
  );
};
export default ServerName;
