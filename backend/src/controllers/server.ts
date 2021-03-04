import Member from "../api/member/member.model";
import ErrorHandler from "../lib/error-handler";
import validateServer from "../lib/validate-server";
import Server from "../models/Server";

export class ServerController {
  modifiers = {
    selectNonCredentials(builder: any) {
      builder.select("id", "username", "email", "avatar_url as avatarUrl");
    },
  };
  public async getAll() {
    const allServers = await Server.query()
      .withGraphJoined("owner(selectNonCredentials)")
      .modifiers(this.modifiers);
    return allServers;
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
