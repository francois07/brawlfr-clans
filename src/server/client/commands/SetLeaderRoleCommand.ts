import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class SetLeaderRoleCommand extends Command {
  constructor() {
    super("setleaderrole", {
      aliases: ["setleaderrole", "sl"],
      channel: "guild",
      args: [
        {
          id: "leader_role_id",
          type: "string",
          prompt: {
            start: (message: MessageEmbed) =>
              new MessageEmbed()
                .setTitle("Quel est l'id du role?")
                .setColor(0xffaa2b),
          },
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    const { leader_role_id } = args;
    try {
      const leaderRole = await message.guild!.roles.fetch(leader_role_id);
      const clans = this.client.ClanManager.cache
        .filter((c) => c.guild_id === message.guild!.id)
        .array();
      if (!leaderRole) {
        return Promise.reject("Aucun role ne correspond à cet id");
      }

      this.client.settings.set(
        message.guild!.id,
        "leader_role_id",
        leader_role_id
      );

      for (const clan of clans) {
        const leader = await message
          .guild!.members.fetch(clan.leader_id)
          .catch((err) => null);
        if (leader) leader.roles.add(leaderRole);
      }

      return new MessageEmbed()
        .setTitle("Paramètres mis à jour")
        .setDescription(
          `\`${leaderRole.name}\` est maintenant associé aux chefs de clans`
        );
    } catch (err) {
      throw err;
    }
  }
}
