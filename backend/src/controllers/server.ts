import Member from "../api/member/member.model";
import ErrorHandler from "../lib/error-handler";
import validateServer from "../lib/validate-server";
import Server from "../models/Server";

interface Update {
  icon?: string;
}

export class ServerController {
  private readonly modifiers = {
    selectNonCredentials(builder: any) {
      builder.select("id", "username", "email", "avatar_url as avatarUrl");
    },
  };

  private readonly select = [
    "servers.id",
    "icon",
    "name",
    "created_at as createdAt",
    "updated_at as updatedAt",
  ];

  public async getAll() {
    const allServers = await Server.query()
      .withGraphJoined("owner(selectNonCredentials)")
      .modifiers(this.modifiers)
      .select(this.select);
    return allServers;
  }

  public async getOne(serverId: number) {
    const server = await Server.query()
      .findOne({ "servers.id": serverId })
      .withGraphJoined("owner(selectNonCredentials)")
      .modifiers(this.modifiers)
      .select(this.select);
    return server;
  }

  public async create(userId: number, name: string, icon?: string) {
    await validateServer({
      name,
      ownerId: userId,
      icon,
    });
    const uniqueServerName = await this.isServerNameTaken(name);
    if (!uniqueServerName) {
      throw new ErrorHandler(409, "Server name is taken");
    }
    const newServer = await Server.transaction(async (trx) => {
      const server = await Server.query(trx).insertAndFetch({
        name,
        owner_id: userId,
        icon,
      });
      const member = await server.$relatedQuery<Member>("members", trx).insert({
        member_id: userId,
        server_id: server.id,
      });
      return server;
    });
    return newServer;
  }

  public async update(serverId: number, update?: Update) {
    const updatedServer = await Server.query()
      .patch({
        icon: update?.icon,
      })
      .findById(serverId);
    return updatedServer;
  }

  public async delete(serverId: number) {
    await Server.query().where({ id: serverId }).delete();
  }

  private async isServerNameTaken(serverName: string) {
    const server = await Server.query().findOne({
      name: serverName,
    });
    return server === undefined;
  }
}
