import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class AddClanCommand extends Command {
  constructor() {
    super("acceptclan", {
      channel: "guild",
      aliases: ["acceptclan", "ac"],
      clientPermissions: ["SEND_MESSAGES", "MANAGE_ROLES", "MANAGE_CHANNELS"],
      userPermissions: ["MANAGE_ROLES"],
      args: [
        {
          id: "application_id",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription("Quel est l'id de la candidature à accepter?")
                .setColor(0xffaa2b),
          },
        },
        {
          id: "role_id",
          type: "string",
          match: "option",
          flag: "role_id:",
          default: null,
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    try {
      const clanApplication = await this.client.ClanApplicationManager.model
        .findOne({
          $or: [
            { id: args.application_id },
            { "clan.name": args.application_id },
            { "clan.alias": args.application_id },
          ],
        })
        .catch((e) => null);
      if (!clanApplication)
        throw new Error("Aucune demande d'ajout n'a cet id!");

      await this.client.ClanManager.add({
        guild_id: clanApplication.clan.guild_id,
        name: clanApplication.clan.name,
        alias: clanApplication.clan.alias?.length
          ? clanApplication.clan.alias
          : null,
        level: clanApplication.clan.level,
        discord: clanApplication.clan.discord,
        leader_id: clanApplication.clan.leader_id,
        role_id: args.role_id || clanApplication.clan.role_id,
      });
      await this.client.ClanApplicationManager.remove(clanApplication.id);
    } catch (err) {
      throw err;
    }
  }
}
