import React from "react";
import styles from "./chat-layout.module.css";

type Props = {
  messages: React.ReactNode;
  input: React.ReactNode;
};

export const ChatLayout: React.FC<Props> = ({ messages, input }) => {
  return (
    <div className={styles.container}>
      <div className={styles.messages}>{messages}</div>
      <div className={styles.input}>{input}</div>
    </div>
  );
};
