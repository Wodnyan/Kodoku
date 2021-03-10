import { useState, useEffect } from "react";
import { getAllMembers } from "../../api/members";

export const useMembers = (serverId?: number) => {
  const [members, setMembers] = useState<any[] | []>([]);

  useEffect(() => {
    if (serverId) {
      getAllMembers(serverId)
        .then((members) => {
          setMembers(members);
        })
        .catch(({ response }) => console.log(response));
    }
  }, [serverId]);

  return {
    members,
  };
};
