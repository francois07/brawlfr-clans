import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping"],
      category: "Public",
      clientPermissions: ["SEND_MESSAGES"],
      description: {
        content: "The basic ping command",
        usage: "ping",
        examples: ["ping"],
      },
    });
  }

  public exec(message: Message): MessageEmbed {
    return new MessageEmbed().setDescription(
      `🏓 Pong! ${this.client.ws.ping}ms`
    );
  }
}
