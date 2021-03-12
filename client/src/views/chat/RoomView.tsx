import Chat from "../../components/Chat";
import Members from "../../components/Members";

export const RoomView = () => {
  return (
    <>
      <section className="w-8/12 bg-gray-600">
        <Chat />
      </section>
      <section className="bg-gray-700 w-1/6 h-screen overflow-auto">
        <Members />
      </section>
    </>
  );
};
