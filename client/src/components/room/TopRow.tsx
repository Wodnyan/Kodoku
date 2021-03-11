import React, { useState } from "react";

interface DropdownProps {
  openCreateRoomPopup: () => void;
  openInvitePopup: () => void;
}
interface TopRowProps {
  openCreateRoomPopup: () => void;
  openInvitePopup: () => void;
}

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
        <button
          className={dropdown ? "transform rotate-180" : ""}
          onClick={() => setDropdown((prev) => !prev)}
        >
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

export default TopRow;
