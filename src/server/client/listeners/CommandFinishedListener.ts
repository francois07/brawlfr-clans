import { Command } from "discord-akairo";
import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

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
      message.channel
        .send(
          returnValue
            .setFooter(
              "Want me on your server? https://top.gg/bot/815728329188573204"
            )
            .setColor(0x9c7bd4)
        )
        .catch((e) => {
          throw e;
        });
    }
  }
}
