import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { fetchAllMembersOfServer } from "../../lib/api/members";
import { Member } from "../../types";
import styles from "./member-list-panel.module.css";

export const MemberListPanel = () => {
  const {
    query: { serverId },
    isReady,
  } = useRouter();
  const { data, refetch } = useQuery("getAllmembers", async () => {
    if (serverId) {
      return fetchAllMembersOfServer(Number(serverId));
    }
  });

  useEffect(() => {
    (async () => {
      if (!isReady) return;
      await refetch();
    })();
  }, [serverId]);

  return (
    <section className={styles.container}>
      <h1>Members</h1>
      <ul className={styles.memberList}>
        {data?.map((member: Member) => (
          <li key={member.id}>{member.username}</li>
        ))}
      </ul>
    </section>
  );
};
