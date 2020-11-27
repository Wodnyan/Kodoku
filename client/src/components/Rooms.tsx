import React, { useEffect } from "react";
import { getAllRooms } from "../api/rooms";
import { Room } from "../types";

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

const Rooms: React.FC<RoomsProps> = ({ rooms }) => {
  useEffect(() => {
    console.log(
      getAllRooms(1)
        .then((res) => res.json())
        .then((res) => console.log(res))
    );
  }, []);
  return (
    <ul className="h-screen overflow-auto">
      {(rooms as Room[]).map((_, id) => (
        <li key={id}>
          <RoomName>Bruh</RoomName>
        </li>
      ))}
    </ul>
  );
};

export default Rooms;
