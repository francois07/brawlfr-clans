import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class SetSupportRoleCommand extends Command {
  constructor() {
    super("setsupportrole", {
      aliases: ["setsupportrole", "ssr"],
      channel: "guild",
      userPermissions: ["MANAGE_ROLES"],
      args: [
        {
          id: "support_role_id",
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
    const { support_role_id } = args;
    try {
      const supportRole = await message.guild!.roles.fetch(support_role_id);
      if (!support_role_id) {
        return Promise.reject("Aucun role ne correspond à cet id");
      }

      this.client.settings.set(
        message.guild!.id,
        "support_role_id",
        support_role_id
      );

      return new MessageEmbed()
        .setTitle("Paramètres mis à jour")
        .setDescription(
          `\`${supportRole!.name}\` est maintenant associé au support`
        );
    } catch (err) {
      throw err;
    }
  }
}
