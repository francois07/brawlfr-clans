import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";
import type { IClan } from "../../models/Clan";
import getEmbedList from "../util/getEmbedList";

export default class SendEmbedListCommand extends Command {
  constructor() {
    super("sendembedlist", {
      aliases: ["sendembedlist", "sndl"],
      clientPermissions: ["SEND_MESSAGES"],
    });
  }

  public async exec(message: Message) {
    try {
      const clans = await this.client.ClanManager.model.find();
      return getEmbedList(clans);
    } catch (err) {
      throw err;
    }
  }
}
