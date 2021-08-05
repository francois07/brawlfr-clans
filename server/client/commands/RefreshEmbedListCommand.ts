import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";
import type { IClan } from "../../models/Clan";
import getEmbedList from "../util/getEmbedList";

export default class SendEmbedListCommand extends Command {
  constructor() {
    super("refreshembedlist", {
      channel: "guild",
      aliases: ["rel", "rfrsh"],
      clientPermissions: ["SEND_MESSAGES"],
    });
  }

  public async exec(message: Message) {
    try {
      const { embed_id, channel_id } = this.client.settings.get(
        message.guild!.id,
        "embed_list",
        undefined
      );
      const clans = await this.client.ClanManager.model.find();
      const embed_list = getEmbedList(clans, message.guild!.id);
      const embedChannel: any = message
        .guild!.channels.cache.filter((c) => c.type === "text")
        .get(channel_id);
      const embedList: Message = await embedChannel?.messages.fetch(embed_id);

      if (embedList) embedList.edit(embed_list);

      return new MessageEmbed().setDescription("Liste de clans mise à jour!");
    } catch (err) {
      throw err;
    }
  }
}
