import React, { useRef, useState } from "react";
import { createRoom } from "../api/rooms";
import { Room } from "../types";
import { useForm } from "react-hook-form";
import shortenString from "../lib/shorten-string";
import useCloseOnClick from "../hooks/close-on-click";
import { Link, useParams } from "react-router-dom";
import { createInvite } from "../api/invites";

enum Popups {
  Create = 1,
  Join,
}

interface RoomNameProps {
  children: React.ReactNode;
  serverId: number;
  id: number;
}

interface InvitePopupProps {
  close: () => void;
  serverId: number;
}

interface PopupProps {
  close: () => void;
  addRoom: (room: Room) => void;
  serverId: number;
}

interface DropdownProps {
  openCreateRoomPopup: () => void;
  openInvitePopup: () => void;
}

interface NewRoomInputs {
  roomName: string;
}

interface TopRowProps {
  openCreateRoomPopup: () => void;
  openInvitePopup: () => void;
}

export const RoomName: React.FC<RoomNameProps> = React.memo(
  ({ children, id, serverId }) => {
    return (
      <Link
        to={`/chat/${serverId}/${id}`}
        className="cursor-pointer block mb-3 mt-1 hover:bg-red-500 p-1 w-11/12 mx-auto rounded transition-colors duration-100 ease"
      >
        <span>#</span>
        <span>{children}</span>
      </Link>
    );
  }
);

const Dropdown: React.FC<DropdownProps> = ({
  openCreateRoomPopup,
  openInvitePopup,
}) => {
  return (
    <ul className="absolute top-full left-1/2 transform -translate-x-1/2 bg-blue-500 w-10/12 p-1">
      <li>
        <button className="room-dropdown-btn" onClick={openInvitePopup}>
          Invite People
        </button>
      </li>
      <li>
        <button className="room-dropdown-btn" onClick={openCreateRoomPopup}>
          Create a room
        </button>
      </li>
    </ul>
  );
};

const TopRow: React.FC<TopRowProps> = React.memo(
  ({ openCreateRoomPopup, openInvitePopup }) => {
    const [dropdown, setDropdown] = useState(false);
    return (
      <div className="relative flex justify-between px-4 py-2">
        <h1>Rooms</h1>
        <button onClick={() => setDropdown((prev) => !prev)}>
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
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        {dropdown && (
          <Dropdown
            openInvitePopup={openInvitePopup}
            openCreateRoomPopup={openCreateRoomPopup}
          />
        )}
      </div>
    );
  }
);

const InvitePopup: React.FC<InvitePopupProps> = ({ close, serverId }) => {
  const [inviteCode, setInviteCode] = useState("");
  const ref = useCloseOnClick(close);
  const inputRef = useRef() as any;

  const createInviteCode = async () => {
    const code = await createInvite(serverId);
    setInviteCode(code);
  };

  const copyToClipBoard = (event: any) => {
    inputRef.current.select();
    document.execCommand("copy");
    event.target.focus();
  };

  return (
    <div ref={ref} className="simple-popup-container-full">
      <form>
        <input
          className="input"
          ref={inputRef}
          value={inviteCode}
          readOnly
          type="text"
        />
        <button
          type="button"
          onClick={inviteCode ? copyToClipBoard : createInviteCode}
        >
          {inviteCode ? "Copy to clip board" : "Create code"}
        </button>
      </form>
    </div>
  );
};

const NewRoomPopup: React.FC<PopupProps> = ({ close, addRoom, serverId }) => {
  const { register, handleSubmit } = useForm<NewRoomInputs>();
  const ref = useCloseOnClick(close);

  async function onSubmit(data: any) {
    createRoom(serverId, data.roomName)
      .then((res) => res.json())
      .then((res) => {
        addRoom(res.room);
      });
  }

  return (
    <div ref={ref} className="simple-popup-container-full">
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

const Rooms = React.memo(() => {
  const [rooms, setRooms] = useState<Room[] | []>([]);
  const [popup, setPopup] = useState<Popups | null>(null);
  const params = useParams() as any;

  // useEffect(() => {
  //   getAllRooms(params.serverId)
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setRooms(res.rooms);
  //     });
  //
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [params.serverId]);

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
              {room.name.length > 20 ? shortenString(room.name, 20) : room.name}
            </RoomName>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default Rooms;
