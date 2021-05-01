import HttpError from "../lib/exceptions/error-handler";
import { validateSchemaAsync } from "../lib/validators";
import { createRoomSchema } from "../lib/validators/validate-room";
import Room from "../models/Room";

export class RoomController {
  public static async create(serverId: number, roomName: string) {
    await validateSchemaAsync(createRoomSchema, {
      name: roomName,
    });
    const isRoomNameInUse = await this.isRoomNameInUse(serverId, roomName);
    if (isRoomNameInUse) {
      throw new HttpError("Room name in use", 409);
    }
    const newRoom = await Room.query().insertAndFetch({
      name: roomName,
      server_id: serverId,
    });
    return newRoom;
  }

  public static async getAll(serverId?: number) {
    const rooms = await Room.query().where({
      server_id: serverId,
    });
    return rooms;
  }

  public static async delete(serverId: number, roomId: number) {
    return await Room.query()
      .where({
        server_id: serverId,
        id: roomId,
      })
      .delete();
  }

  private static async isRoomNameInUse(serverId: number, roomName: string) {
    const room = await Room.query().findOne({
      server_id: serverId,
      name: roomName,
    });
    return room !== undefined;
  }
}
