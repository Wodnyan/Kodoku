import React from "react";

interface ChatMessageProps {
  children: React.ReactNode;
  username: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ children, username }) => {
  return (
    <div>
      <span className="text-gray-400 text-xs">2 minutes ago</span>
      <span>{username}:</span>
      <span>{children}</span>
    </div>
  );
};
export default ChatMessage;
