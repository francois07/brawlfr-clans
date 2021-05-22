import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class LeaveClanCommand extends Command {
  constructor() {
    super("leaveclan", {
      channel: "guild",
      aliases: ["leaveclan", "lc"],
      clientPermissions: ["SEND_MESSAGES"],
      args: [
        {
          id: "clan_id",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription("Quel est le nom ou l'alias du clan à quitter?")
                .setColor(0xffaa2b),
          },
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    try {
      const clan = await this.client.ClanManager.model
        .findOne({
          $or: [
            { id: args.clan_id },
            { name: args.clan_id },
            { alias: args.clan_id },
          ],
        })
        .catch((e) => null);

      if (!clan) throw new Error("Vous n'est pas membre de ce clan!");
      const hasRole = message.member!.roles.cache.has(clan.role_id!);
      if (!hasRole) throw new Error("Vous ne faites pas partie de ce clan");

      message.member!.roles.remove(clan.role_id!).catch((e) => {
        throw e;
      });

      return new MessageEmbed().setDescription("Clan quitté");
    } catch (err) {
      throw err;
    }
  }
}
