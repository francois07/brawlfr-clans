import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class DenyClanCommand extends Command {
  constructor() {
    super("denyclan", {
      channel: "guild",
      aliases: ["denyclan", "dc"],
      clientPermissions: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
      userPermissions: ["MANAGE_ROLES"],
      args: [
        {
          id: "application_id",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription("Quel est l'id de la candidature à refuser?")
                .setColor(0xffaa2b),
          },
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
        return Promise.reject("Aucune demande d'ajout ne correspond à cet id");
      await this.client.ClanApplicationManager.remove(clanApplication.id);
    } catch (err) {
      throw err;
    }
  }
}
