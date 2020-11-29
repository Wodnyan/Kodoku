import React, { useEffect, useState } from "react";
import { createRoom, getAllRooms } from "../api/rooms";
import { Room } from "../types";
import { useForm } from "react-hook-form";
import shortenString from "../lib/shorten-string";

interface RoomNameProps {
  children: React.ReactNode;
}

interface RoomsProps {
  // rooms: Room[] | [];
  rooms: any;
  serverId?: number;
}

interface NewRoomInputs {
  roomName: string;
}

interface TopRowProps {
  openOverlay: () => void;
}

export const RoomName: React.FC<RoomNameProps> = React.memo(({ children }) => {
  return (
    <div className="cursor-pointer mb-3 mt-1 hover:bg-red-500 p-1 w-11/12 mx-auto rounded transition-colors duration-100 ease">
      <span>#</span>
      <span>{children}</span>
    </div>
  );
});

const TopRow: React.FC<TopRowProps> = ({ openOverlay }) => {
  return (
    <div className="flex justify-between px-4 py-2">
      <h1>Rooms</h1>
      <button onClick={openOverlay}>
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="css-i6dzq1"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

const Overlay = () => {
  const { register, handleSubmit } = useForm<NewRoomInputs>();

  async function onSubmit(data: any) {
    console.log(data);
    createRoom(3, data.roomName)
      .then((res) => res.json)
      .then((res) => console.log(res));
  }

  return (
    <div className="absolute z-10 bg-black bg-opacity-50 w-full h-full top-0 left-0">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="roomName">Room Name</label>
          <input
            ref={register({ required: true })}
            type="text"
            name="roomName"
            id="roomName"
            className="input"
          />
        </div>
        <button>Create Room</button>
      </form>
    </div>
  );
};

const Rooms: React.FC<RoomsProps> = (props) => {
  const [rooms, setRooms] = useState([]);
  const [overlay, setOverlay] = useState(false);
  useEffect(() => {
    getAllRooms(3)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setRooms(res.rooms);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      {overlay && <Overlay />}
      <TopRow openOverlay={() => setOverlay(true)} />
      <ul className="h-full">
        {(rooms as Room[]).map((room, id) => (
          <li key={room.id}>
            <RoomName>
              {room.name.length > 20 ? shortenString(room.name, 20) : room.name}
            </RoomName>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Rooms;
