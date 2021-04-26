import { useContext } from "react";
import { useParams } from "react-router-dom";
import Members from "../../components/Members";
import UserContext from "../../context/UserContext";
import { useFetchOneMember } from "../../hooks/api/members";

export const ServerView = () => {
  const user = useContext(UserContext);
  const params = useParams() as any;
  const member = useFetchOneMember(params.serverId, user?.id);

  return (
    <>
      <section className="w-8/12 bg-gray-600"></section>
      <section className="bg-gray-700 w-1/6 h-screen overflow-auto">
        <Members />
      </section>
    </>
  );
};
