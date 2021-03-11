import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createInvite } from "../../api/invites";
import { createRoom } from "../../api/rooms";
import useCloseOnClick from "../../hooks/close-on-click";
import { Room } from "../../types";

interface InvitePopupProps {
  close: () => void;
  serverId: number;
}

interface NewRoomInputs {
  roomName: string;
}

interface PopupProps {
  close: () => void;
  addRoom: (room: Room) => void;
  serverId: number;
}

export const InvitePopup: React.FC<InvitePopupProps> = ({
  close,
  serverId,
}) => {
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

export const NewRoomPopup: React.FC<PopupProps> = ({
  close,
  addRoom,
  serverId,
}) => {
  const { register, handleSubmit } = useForm<NewRoomInputs>();
  const ref = useCloseOnClick(close);

  async function onSubmit({ roomName }: any) {
    try {
      const room = await createRoom(serverId, roomName);
      addRoom(room);
    } catch (error) {
      console.log(error);
    }
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
