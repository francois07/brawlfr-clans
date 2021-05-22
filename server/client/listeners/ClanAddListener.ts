import { Listener } from "discord-akairo";
import type { Message } from "discord.js";
import type { IClanDoc } from "../../models/Clan";
import getEmbedList from "../util/getEmbedList";

export default class ClanAddListener extends Listener {
  constructor() {
    super("addClan", {
      emitter: "clanManager",
      event: "addItem",
    });
  }

  public async exec(newClan: IClanDoc): Promise<void> {
    try {
      const clans = await this.client.ClanManager.model.find();
      const guild = await this.client.guilds.fetch(newClan.guild_id);
      const leader = await guild.members.fetch(newClan.leader_id);
      const leader_role_id = this.client.settings.get(
        newClan.guild_id,
        "leader_role_id",
        undefined
      );
      const embedList: Message = this.client.settings.get(
        newClan.guild_id,
        "embed_list",
        undefined
      );

      if (leader_role_id) await leader.roles.add(leader_role_id);
      const newRole = await guild.roles.create({
        data: { name: newClan.alias || newClan.name },
        reason: `Add ${newClan.name} to the clan list`,
      });
      await leader.roles.add(newRole);

      newClan.role_id = newRole.id;
      await newClan.save();

      if (embedList) embedList.edit(getEmbedList(clans));
    } catch (err) {
      console.log(err);
    }
  }
}
