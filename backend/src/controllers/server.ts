import HttpError from "../lib/exceptions/error-handler";
import { validateSchemaAsync } from "../lib/validators";
import { createServerSchema } from "../lib/validators/validate-server";
import Member from "../models/Member";
import Server from "../models/Server";
import { UserController } from "./user";

export class ServerController {
  private static readonly modifiers = {
    selectNonCredentials(builder: any) {
      builder.select(...UserController.nonCredentials);
    },
  };

  private static readonly select = [
    "servers.id",
    "icon",
    "name",
    "servers.created_at as createdAt",
    "servers.updated_at as updatedAt",
  ];

  public static async getAll(userId?: number) {
    const allServers = await Server.query()
      .withGraphFetched("owner(selectNonCredentials)")
      .modifiers(this.modifiers)
      .leftJoinRelated("members")
      .where({
        "members.member_id": userId,
      })
      .skipUndefined();
    return allServers;
  }

  public static async getOne(serverId: number) {
    const server = await Server.query()
      .findOne({ "servers.id": serverId })
      .withGraphJoined("owner(selectNonCredentials)")
      .modifiers(this.modifiers)
      .select(this.select);
    return server;
  }

  public static async create(userId: number, name: string, icon?: string) {
    await validateSchemaAsync(createServerSchema, {
      name,
      icon,
    });
    const user = await UserController.getOne(userId);
    if (!user) {
      throw new HttpError("No user exists with the id of " + userId, 409);
    }
    const uniqueServerName = await this.isServerNameTaken(name);
    if (!uniqueServerName) {
      throw new HttpError("Server name is taken", 409);
    }
    const newServer = await Server.transaction(async (trx) => {
      const server = await Server.query(trx).insertAndFetch({
        name,
        owner_id: userId,
        icon,
      });
      await server.$relatedQuery<Member>("members", trx).insert({
        member_id: userId,
        server_id: server.id,
      });
      return server;
    });
    return newServer;
  }

  public static async updateIcon(serverId: number, icon: string) {
    const updatedServer = await Server.query()
      .patch({
        icon,
      })
      .findById(serverId)
      .returning("*");
    return updatedServer;
  }

  public static async delete(serverId: number) {
    await Server.query().where({ id: serverId }).delete();
  }

  private static async isServerNameTaken(serverName: string) {
    const server = await Server.query().findOne({
      name: serverName,
    });
    return server === undefined;
  }
}
