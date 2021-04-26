import React, { useContext, useState } from "react";
import { Room } from "../../types";
import { Link, useParams } from "react-router-dom";
import { useRooms } from "../../hooks/api/rooms";
import TopRow from "./TopRow";
import { InvitePopup, NewRoomPopup } from "./Popups";
import UserContext from "../../context/UserContext";
import UserCard from "./UserCard";

enum Popups {
  Create = 1,
  Join,
}
interface RoomNameProps {
  children: React.ReactNode;
  serverId: number;
  id: number;
}
export const RoomName: React.FC<RoomNameProps> = React.memo(
  ({ children, id, serverId }) => {
    return (
      <Link
        to={`/chat/${serverId}/${id}`}
        className="truncate whitespace-nowrap cursor-pointer block mb-3 mt-1 hover:bg-red-500 p-1 w-11/12 mx-auto rounded transition-colors duration-100 ease"
      >
        <span>#</span>
        <span>{children}</span>
      </Link>
    );
  }
);
const Rooms = React.memo(() => {
  const [popup, setPopup] = useState<Popups | null>(null);
  const params = useParams() as any;
  const { rooms, setRooms } = useRooms(params.serverId);
  const user = useContext(UserContext);

  const addRoom = (room: Room) => {
    setRooms((prev) => [...prev, room]);
  };

  const closePopup = () => setPopup(null);

  return (
    <section className="h-full flex flex-col">
      {popup === Popups.Create && (
        <NewRoomPopup
          serverId={params.serverId!}
          addRoom={addRoom}
          close={closePopup}
        />
      )}
      {popup === Popups.Join && (
        <InvitePopup serverId={params.serverId} close={closePopup} />
      )}
      <TopRow
        openInvitePopup={() => setPopup(Popups.Join)}
        openCreateRoomPopup={() => setPopup(Popups.Create)}
      />
      <ul className="overflow-auto">
        {(rooms as Room[]).map((room) => (
          <li key={room.id}>
            <RoomName serverId={params.serverId!} id={room.id}>
              {room.name}
            </RoomName>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <UserCard username={user?.username} avatarUrl={user?.avatarUrl} />
      </div>
    </section>
  );
});

export default Rooms;
