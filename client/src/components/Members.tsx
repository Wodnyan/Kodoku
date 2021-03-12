import React from "react";
import { useParams } from "react-router-dom";
import { useFecthAllMembers } from "../hooks/api/members";

interface Member {
  id: number;
  username: string;
}

const Members = React.memo(() => {
  const params = useParams() as any;
  const { members } = useFecthAllMembers(params.serverId);

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
