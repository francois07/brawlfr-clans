import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class AddClanCommand extends Command {
  constructor() {
    super("acceptclan", {
      channel: "guild",
      aliases: ["acceptclan"],
      args: [
        {
          id: "application_id",
          type: "string",
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    const addedClan = this.client.ClanApplicationManager.get(
      args.application_id
    );
    if (addedClan) {
      await this.client.ClanManager.add({
        guild_id: addedClan.clan.guild_id,
        name: addedClan.clan.name,
        alias: addedClan.clan.alias,
        level: addedClan.clan.level,
        discord_url: addedClan.clan.discord_url,
        leader_id: addedClan.clan.leader_id,
        role_id: addedClan.clan.role_id,
      });
      await this.client.ClanApplicationManager.remove(args.application_id);
      return new MessageEmbed().setTitle("Clan ajouté à la liste!");
    } else {
      throw new Error("Aucune demande d'ajout n'a cet id!");
    }
  }
}
