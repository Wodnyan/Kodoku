import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../constants";
import { Member } from "../../types";
import styles from "./member-list-panel.module.css";

export const MemberListPanel = () => {
  const {
    query: { serverId },
  } = useRouter();
  const [members, setMembers] = useState<Member[] | []>([]);

  useEffect(() => {
    (async () => {
      try {
        if (serverId) {
          const { data } = await axios.get(
            `${API_ENDPOINT}/servers/${serverId}/members`
          );
          setMembers(data.members);
        }
      } catch (error) {
        console.error(error.response.data);
      }
    })();
  }, [serverId]);

  return (
    <section className={styles.container}>
      <h1>Members</h1>
      <ul className={styles.memberList}>
        {members.map((member: Member) => (
          <li>{member.username}</li>
        ))}
      </ul>
    </section>
  );
};
