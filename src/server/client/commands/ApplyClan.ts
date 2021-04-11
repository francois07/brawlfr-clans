import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";

export default class AddClanCommand extends Command {
  constructor() {
    super("applyclan", {
      channel: "guild",
      aliases: ["applyclan"],
      args: [
        {
          id: "name",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription("Quel est le nom de votre clan?")
                .setColor(0xffaa2b),
          },
        },
        {
          id: "alias",
          type: "string",
          match: "option",
          flag: "alias:",
          default: null,
        },
        {
          id: "discord_url",
          type: "string",
          prompt: {
            start: (message: Message) =>
              new MessageEmbed()
                .setDescription("Quel le lien du discord de votre clan?")
                .setColor(0xffaa2b),
          },
        },
        {
          id: "level",
          type: "number",
        },
      ],
    });
  }

  public async exec(message: Message, args: any) {
    console.log(args);
    const newApplication = await this.client.ClanApplicationManager.add({
      author_id: message.author.id,
      embed_id: "no embed",
      clan: {
        guild_id: message.guild!.id,
        name: args.name,
        alias: args.alias,
        level: args.level,
        discord_url: args.discord_url,
        leader_id: message.author.id,
        role_id: null,
      },
    });

    return new MessageEmbed()
      .setTitle(`Demande envoyée!`)
      .setDescription(`Votre demande a pour id \`${newApplication.id}\``);
  }
}
