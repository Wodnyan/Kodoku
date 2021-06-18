import React from "react";
import { User } from "../../types";
import { Avatar } from "../Avatar/Avatar";
import classes from "./chat-message.module.css";

type Props = {
  user: User;
  message: string;
};

export const ChatMessage: React.FC<Props> = ({ user, message }) => {
  return (
    <div className={classes.container}>
      <div className={classes.avatarContainer}>
        <Avatar src={user.avatar}>{user.username[0]}</Avatar>
      </div>
      <div>
        <h1 className={classes.username}>{user.username}</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};
