import React, { useEffect, useState } from "react";
import { getAllRooms } from "../api/rooms";
import { Room } from "../types";
import shortenString from "../lib/shortenString";

interface RoomNameProps {
  children: React.ReactNode;
}

interface RoomsProps {
  // rooms: Room[] | [];
  rooms: any;
  serverId?: number;
}

export const RoomName: React.FC<RoomNameProps> = React.memo(({ children }) => {
  return (
    <div className="cursor-pointer mb-3 mt-1 hover:bg-red-500 p-1 w-11/12 mx-auto rounded transition-colors duration-100 ease">
      <span>#</span>
      <span>{children}</span>
    </div>
  );
});

const Rooms: React.FC<RoomsProps> = (props) => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    getAllRooms(1)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setRooms(res.rooms);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className="h-screen overflow-auto">
      {(rooms as Room[]).map((room, id) => (
        <li key={room.id}>
          <RoomName>
            {room.name.length > 20 ? shortenString(room.name, 20) : room.name}
          </RoomName>
        </li>
      ))}
    </ul>
  );
};

export default Rooms;
