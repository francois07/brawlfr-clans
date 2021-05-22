import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class SetEmbedListCommand extends Command {
  constructor() {
    super("setembedlist", {
      aliases: ["setembedlist", "sel"],
      channel: "guild",
      userPermissions: ["MANAGE_ROLES"],
      args: [
        {
          id: "embed_list_id",
          type: "string",
          prompt: {
            start: (message: MessageEmbed) =>
              new MessageEmbed()
                .setTitle("Quel est l'id de la liste?")
                .setColor(0xffaa2b),
          },
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    const { embed_list_id } = args;
    try {
      const embedList = await message.channel!.messages.fetch(embed_list_id);
      if (!embed_list_id) {
        return Promise.reject("Aucun message ne correspond à cet id");
      }

      this.client.settings.set(message.guild!.id, "embed_list", embedList);

      return new MessageEmbed()
        .setTitle("Paramètres mis à jour")
        .setDescription(
          `\`${embedList!.id}\` est maintenant associé à la liste de clans`
        );
    } catch (err) {
      throw err;
    }
  }
}
