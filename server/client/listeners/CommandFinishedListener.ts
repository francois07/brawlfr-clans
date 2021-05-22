import type { Command } from "discord-akairo";
import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import type { Message } from "discord.js";

export default class CommandFinishedListener extends Listener {
  public constructor() {
    super("commandFinished", {
      emitter: "commandHandler",
      event: "commandFinished",
    });
  }

  public async exec(
    message: Message,
    command: Command,
    args: any,
    returnValue: any
  ) {
    message.react("👌");
    if (returnValue && (await returnValue) instanceof MessageEmbed) {
      message.channel.send(returnValue.setColor(0x9c7bd4)).catch((e) => {
        throw e;
      });
    }
  }
}
