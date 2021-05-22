import React from "react";
import { Avatar } from "../../../components/Avatar/Avatar";
import { User } from "../../../types";
import styles from "../room-list-panel.module.css";
import NextLink from "next/link";

export const UserInfoSection: React.FC<{ user: User }> = ({ user }) => {
  return (
    <section className={styles.userSection}>
      <div className={styles.userInfo}>
        <Avatar src={user.avatar}>{user.username[0]}</Avatar>
        <p>{user?.username}</p>
      </div>
      <div className={styles.userOptions}>
        <NextLink href="/options">
          <a>
            <Avatar>S</Avatar>
          </a>
        </NextLink>
      </div>
    </section>
  );
};
