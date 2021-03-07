import ErrorHandler from "../lib/error-handler";
import Room from "../models/Room";

export class RoomController {
  public async create(serverId: number, roomName: string) {
    const isRoomNameInUse = await this.isRoomNameInUse(serverId, roomName);
    if (isRoomNameInUse) {
      throw new ErrorHandler(409, "Room name in use");
    }
    const newRoom = await Room.query().insertAndFetch({
      name: roomName,
      server_id: serverId,
    });
    return newRoom;
  }

  public async getAll(serverId?: number) {
    const rooms = await Room.query().where({
      server_id: serverId,
    });
    return rooms;
  }

  public async delete(serverId: number, roomId: number) {
    return await Room.query()
      .where({
        server_id: serverId,
        id: roomId,
      })
      .delete();
  }

  private async isRoomNameInUse(serverId: number, roomName: string) {
    const room = await Room.query().findOne({
      server_id: serverId,
      name: roomName,
    });
    return room !== undefined;
  }
}
