import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class JoinClanCommand extends Command {
  constructor() {
    super("join", {
      channel: "guild",
      aliases: ["join", "joinclan", "jc"],
      clientPermissions: ["SEND_MESSAGES"],
      args: [
        {
          id: "clan_id",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription(
                  "Quel est le nom ou l'alias du clan à rejoindre?"
                )
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
      if (!clan) throw new Error("Je n'ai trouvé aucun clan correspondant");
      const leader = await message.guild!.members.fetch(clan.leader_id);

      this.client.ClanMemberApplicationManager.add({
        author_id: message.author.id,
        clan_id: clan.id,
      });

      await leader
        .send(
          new MessageEmbed().setDescription(
            `<@${message.author.id}> à demandé à rejoindre votre clan sur ${
              message.guild!.name
            }!\n Utilisez la commande \`%acm <@${
              message.author.id
            }>\` pour lui assigner le rôle de clan`
          )
        )
        .catch((e) => null);

      return new MessageEmbed()
        .setTitle("Demande envoyée")
        .setDescription(
          `Votre chef de clan peut maintenant utiliser la commande \`%acm <@${message.author.id}>\` pour vous assigner le rôle de clan`
        );
    } catch (err) {
      throw err;
    }
  }
}
