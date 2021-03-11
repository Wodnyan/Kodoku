import { useEffect, useState } from "react";
import { getAllRooms } from "../../api/rooms";
import { Room } from "../../types";

export const useRooms = (serverId: number) => {
  const [rooms, setRooms] = useState<Room[] | []>([]);
  useEffect(() => {
    getAllRooms(serverId)
      .then((rooms) => {
        setRooms(rooms);
      })
      .catch(console.log);
  }, [serverId]);
  return {
    rooms,
    setRooms,
  };
};
