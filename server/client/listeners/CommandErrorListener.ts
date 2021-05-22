import { Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import type { Command } from "discord-akairo";

export default class CommandErrorListener extends Listener {
  public constructor() {
    super("error", {
      emitter: "commandHandler",
      event: "error",
      category: "client",
    });
  }

  public async exec(
    error: Error,
    message: Message,
    command: Command
  ): Promise<void> {
    try {
      await message.channel.send(
        new MessageEmbed()
          .setTitle("Error")
          .setDescription(error.message || error)
          .setColor(0xf54e42)
      );
      await message.react("❌");
    } catch (e) {
      throw e;
    }
  }
}
