import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class AddClanCommand extends Command {
  constructor() {
    super("addclan", {
      channel: "guild",
      aliases: ["addclan"],
      args: [
        { id: "leader_id", type: "string" },
        {
          id: "name",
          type: "string",
        },
        {
          id: "alias",
          type: "string",
        },
        {
          id: "discord_url",
          type: "string",
        },
        {
          id: "level",
          type: "number",
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    await this.client.ClanManager.add({
      guild_id: message.guild!.id,
      name: args.name,
      alias: args.alias,
      level: args.level,
      discord_url: args.discord_url,
      leader_id: args.leader_id,
      role_id: null,
    });

    return new MessageEmbed().setTitle(`Added ${args.name} to the list`);
  }
}
