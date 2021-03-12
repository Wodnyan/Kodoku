import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getAllMembers, getOneMember } from "../../api/members";

export const useFecthAllMembers = (serverId?: number) => {
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

export const useFetchOneMember = (serverId: number, userId?: number) => {
  const history = useHistory();
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (userId) {
      getOneMember(serverId, userId)
        .then((data) => {
          setMember(data);
        })
        .catch(() => history.push("/chat"));
    }
  }, [serverId, userId]);

  return {
    member,
  };
};
