import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class AcceptClanMemberCommand extends Command {
  constructor() {
    super("kickmember", {
      channel: "guild",
      aliases: ["kickmember", "km"],
      clientPermissions: ["SEND_MESSAGES"],
      args: [
        {
          id: "member_id",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription("Quel est le nom ou l'id du membre à accepter?")
                .setColor(0xffaa2b),
          },
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    try {
      const clan = await this.client.ClanManager.model.findOne({
        leader_id: message.author.id,
      });
      const member =
        message.guild!.members.cache.find((m) =>
          [m.id, m.user.username].includes(args.member_id)
        ) || message.mentions.members?.first();

      if (!clan) throw new Error("Vous n'est pas chef de clan!");
      if (!member) throw new Error("Je n'ai trouvé aucun membre correspondant");
      const hasRole = member.roles.cache.has(clan.role_id!);
      if (!hasRole)
        throw new Error(
          `${member.user.username} ne fait pas partie de votre clan`
        );

      member.roles.remove(clan.role_id!).catch((e) => {
        throw e;
      });

      return new MessageEmbed().setDescription("Membre kické");
    } catch (err) {
      throw err;
    }
  }
}
