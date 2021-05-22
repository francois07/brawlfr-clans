import { Listener } from "discord-akairo";
import type { Message } from "discord.js";
import type { IClanDoc } from "../../models/Clan";
import getEmbedList from "../util/getEmbedList";

export default class ClanRemoveListener extends Listener {
  constructor() {
    super("removeClan", {
      emitter: "clanManager",
      event: "deleteItem",
    });
  }

  public async exec(deletedClan: IClanDoc | null): Promise<void> {
    try {
      if (!deletedClan) return Promise.reject("Invalid ID");
      const clans = await this.client.ClanManager.model.find();
      const guild = await this.client.guilds.fetch(deletedClan!.guild_id);
      const leader = await guild.members.fetch(deletedClan!.leader_id);
      const leader_role_id = this.client.settings.get(
        deletedClan.guild_id,
        "leader_role_id",
        undefined
      );
      const embedList: Message = this.client.settings.get(
        deletedClan.guild_id,
        "embed_list",
        undefined
      );

      const deletedRole = await guild.roles.fetch(deletedClan.role_id!);
      await deletedRole!.delete(
        `Remove ${deletedClan.name} from the clan list`
      );
      if (leader_role_id) await leader.roles.remove(leader_role_id);

      if (embedList) embedList.edit(getEmbedList(clans));
    } catch (err) {
      throw err;
    }
  }
}
