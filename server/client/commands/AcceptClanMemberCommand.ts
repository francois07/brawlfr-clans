import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class AcceptClanMemberCommand extends Command {
  constructor() {
    super("acceptmember", {
      channel: "guild",
      aliases: ["acceptmember", "acm"],
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
      const application = await this.client.ClanMemberApplicationManager.model
        .findOne({ author_id: member.id })
        .catch((e) => null);
      if (!application)
        throw new Error("Je n'ai trouvé aucune demande correspondant");

      member.roles.add(clan.role_id!).catch((e) => {
        throw e;
      });

      this.client.ClanMemberApplicationManager.remove(application.id);

      return new MessageEmbed().setDescription("Membre accepté");
    } catch (err) {
      throw err;
    }
  }
}
