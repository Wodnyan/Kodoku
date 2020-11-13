import React from "react";

interface ChatInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="w-11/12 mx-auto block p-2 m-3 text-lg rounded"
      value={value}
      onChange={onChange}
    />
  );
};
export default ChatInput;
