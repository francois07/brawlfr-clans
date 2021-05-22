import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class RemoveClanCommand extends Command {
  constructor() {
    super("removeclan", {
      aliases: ["removeclan", "rc"],
      channel: "guild",
      args: [
        {
          id: "clan_id",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setTitle(
                  "Quel est l'id , le nom ou l'alias du clan à supprimer?"
                )
                .setColor(0xffaa2b),
          },
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    try {
      const deletedClan = await this.client.ClanManager.model
        .findOne({
          $or: [
            { id: args.clan_id },
            { name: args.clan_id },
            { alias: args.clan_id },
          ],
        })
        .catch((e) => null);
      if (!deletedClan)
        return Promise.reject("Je n'ai trouvé aucun clan correspondant");
      await this.client.ClanManager.remove(deletedClan.id);
      return new MessageEmbed()
        .setTitle("Clan supprimé")
        .setDescription(
          `\`${deletedClan.name}\` a été supprimé de la liste de clans`
        );
    } catch (err) {
      throw err;
    }
  }
}
