import NextLink from "next/link";
import { useRouter } from "next/router";
import { Room } from "../../../types";
import styles from "../room-list-panel.module.css";

type Rooms = Room[] | [];

export const RoomListSection: React.FC<{ rooms: Rooms }> = ({ rooms }) => {
  const {
    query: { serverId, roomId },
  } = useRouter();

  return (
    <section>
      {rooms.length === 0 && <p>No rooms</p>}
      <ul className={styles.roomList}>
        {(rooms as Room[]).map((room) => (
          <li
            className={
              Number(roomId) === room.id ? styles.roomListItemCurrent : ""
            }
            key={room.id}
          >
            <NextLink href={`/channels/${serverId}/${room.id}`}>
              <a>{room.name}</a>
            </NextLink>
          </li>
        ))}
      </ul>
    </section>
  );
};
