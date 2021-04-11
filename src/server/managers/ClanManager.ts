import Manager from "./Manager";
import Clan, { IClan, IClanDoc } from "../models/Clan";
import { MongooseProvider } from "discord-akairo";
import { Client } from "discord.js";

declare module "discord.js" {
  interface Client {
    settings: MongooseProvider;
  }
}

export default class ClanManager extends Manager<IClan, IClanDoc> {
  constructor(client: Client) {
    super(Clan, client);
  }

  public async add(clan: IClan): Promise<IClanDoc> {
    try {
      console.log(clan);
      const guild = await this.client.guilds.fetch(clan.guild_id);
      const leader = await guild.members.fetch(clan.leader_id);
      const leader_role_id = this.client.settings.get(
        clan.guild_id,
        "leader_role_id",
        undefined
      );

      if (leader_role_id) await leader.roles.add(leader_role_id);
      const newRole = await guild.roles.create({
        data: { name: clan.alias || clan.name },
        reason: `Add ${clan.name} to the clan list`,
      });
      await leader.roles.add(newRole);
      const newClan = await super.add({ ...clan, role_id: newRole.id });
      return newClan;
    } catch (err) {
      throw err;
    }
  }

  public async remove(id: string): Promise<IClanDoc | null> {
    try {
      const deletedClan = await super.remove(id);
      if (!deletedClan) return Promise.reject("Invalid ID");
      const guild = await this.client.guilds.fetch(deletedClan!.guild_id);
      const leader = await guild.members.fetch(deletedClan!.leader_id);
      const leader_role_id = this.client.settings.get(
        deletedClan.guild_id,
        "leader_role_id",
        undefined
      );

      if (leader_role_id) await leader.roles.remove(leader_role_id);
      const deletedRole = await guild.roles.fetch(deletedClan.role_id!);
      await deletedRole!.delete(
        `Remove ${deletedClan.name} from the clan list`
      );
      return deletedClan;
    } catch (err) {
      throw err;
    }
  }
}
