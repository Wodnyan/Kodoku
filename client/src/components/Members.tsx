import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllMembers } from "../api/members";

interface Member {
  id: number;
  username: string;
}

const Members = React.memo(() => {
  const [members, setMembers] = useState<Member[] | []>([]);
  const { serverId } = useParams() as any;

  useEffect(() => {
    getAllMembers(serverId)
      .then((res) => res.json())
      .then((res) => setMembers(res.members));
  }, [serverId]);

  return (
    <>
      <h1>Members</h1>
      <ul>
        {(members as Member[]).map((member) => (
          <li key={member.id}>{member.username}</li>
        ))}
      </ul>
    </>
  );
});

export default Members;
