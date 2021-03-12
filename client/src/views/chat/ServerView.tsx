import Members from "../../components/Members";

export const ServerView = () => {
  // TODO: check if user is a member
  return (
    <>
      <section className="w-8/12 bg-gray-600"></section>
      <section className="bg-gray-700 w-1/6 h-screen overflow-auto">
        <Members />
      </section>
    </>
  );
};
